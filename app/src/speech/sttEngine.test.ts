// Moonshine 推論：精度依裝置、限制輸出長度、推論串成一條鏈（docs/research/voice-poc.md §5）；推論函式為假
import { describe, expect, it, vi } from 'vitest'
import {
  createSttEngine,
  maxNewTokens,
  type Device,
  type PipelineFn,
  type ProgressInfo,
} from './sttEngine'

type Call = { audio: Float32Array; opts: { max_new_tokens: number } }

function fakePipeline(text: string | ((a: Float32Array) => string) = ' hello ') {
  const calls: Call[] = []
  const loads: { model: string; dtype: unknown; device: string }[] = []
  let emit: (p: ProgressInfo) => void = () => {}
  let active = 0
  let maxActive = 0
  const fn: PipelineFn = async (_task, model, opts) => {
    loads.push({ model, dtype: opts.dtype, device: opts.device })
    emit = opts.progress_callback
    return async (audio, o) => {
      calls.push({ audio, opts: o })
      active++
      maxActive = Math.max(maxActive, active)
      await new Promise((r) => setTimeout(r, 5))
      active--
      return { text: typeof text === 'string' ? text : text(audio) }
    }
  }
  return { fn, calls, loads, emit: (p: ProgressInfo) => emit(p), maxActive: () => maxActive }
}

const on = (d: Device) => async () => d

describe('maxNewTokens：每秒音長 6 個 token＋10', () => {
  it.each([
    [16_000 * 3, 28],
    [16_000 * 2.5, 25],
    [16_000 * 0.1, 11],
    [0, 10],
  ])('%i 個樣本 → %i', (n, expected) => {
    expect(maxNewTokens(n)).toBe(expected)
  })
})

describe('createSttEngine', () => {
  it('WASM：encoder fp32＋decoder q8；載入後以 1 秒靜音暖機、輸出上限 2', async () => {
    const p = fakePipeline()
    const engine = createSttEngine(p.fn, on('wasm'))
    await expect(engine.load(() => {})).resolves.toEqual({ device: 'wasm' })
    expect(p.loads).toEqual([
      {
        model: 'onnx-community/moonshine-tiny-ONNX',
        dtype: { encoder_model: 'fp32', decoder_model_merged: 'q8' },
        device: 'wasm',
      },
    ])
    expect(p.calls).toHaveLength(1)
    expect(p.calls[0].audio).toHaveLength(16_000)
    expect(p.calls[0].opts).toEqual({ max_new_tokens: 2 })
  })

  it('WebGPU：decoder 用 q4（全 q8 在 WebGPU 上會輸出亂碼）', async () => {
    const p = fakePipeline()
    await createSttEngine(p.fn, on('webgpu')).load(() => {})
    expect(p.loads[0].dtype).toEqual({ encoder_model: 'fp32', decoder_model_merged: 'q4' })
  })

  it('下載進度＝兩個模型檔已下載合計÷總量，只增不減；兩檔都開始下載前不回報；非 progress 事件忽略', async () => {
    const p = fakePipeline()
    const seen: number[] = []
    const engine = createSttEngine(p.fn, on('wasm'))
    const loading = engine.load((f) => seen.push(f))
    await vi.waitFor(() => expect(p.loads).toHaveLength(1))
    p.emit({ status: 'initiate', file: 'onnx/a.onnx' })
    p.emit({ status: 'progress', file: 'onnx/a.onnx', loaded: 50, total: 100 }) // 只知道一檔，不回報
    p.emit({ status: 'progress', file: 'onnx/b.onnx', loaded: 0, total: 300 }) // 50/400
    p.emit({ status: 'progress', file: 'onnx/b.onnx', loaded: 150, total: 300 }) // 200/400
    p.emit({ status: 'progress', file: 'onnx/b.onnx', loaded: 100, total: 300 }) // 退回，不回報
    p.emit({ status: 'progress', file: 'onnx/b.onnx', loaded: 300, total: 300 }) // 350/400
    p.emit({ status: 'progress', file: 'onnx/a.onnx', loaded: 100, total: 100 }) // 400/400
    await loading
    expect(seen).toEqual([0.125, 0.5, 0.875, 1])
  })

  it('設定檔與 tokenizer 等小檔先下載完不算 100%：大的模型檔還沒開始時不回報（創辦人試用 2026-10-04 ①）', async () => {
    const p = fakePipeline()
    const seen: number[] = []
    const engine = createSttEngine(p.fn, on('wasm'))
    const loading = engine.load((f) => seen.push(f))
    await vi.waitFor(() => expect(p.loads).toHaveLength(1))
    // transformers.js 先抓 config／tokenizer，模型讀完設定才開始抓 onnx
    p.emit({ status: 'progress', file: 'tokenizer.json', loaded: 2000, total: 2000 })
    p.emit({ status: 'progress', file: 'config.json', loaded: 900, total: 900 })
    expect(seen).toEqual([])
    p.emit({ status: 'progress', file: 'onnx/encoder_model.onnx', loaded: 0, total: 30_000_000 })
    p.emit({
      status: 'progress',
      file: 'onnx/decoder_model_merged_quantized.onnx',
      loaded: 0,
      total: 20_000_000,
    })
    p.emit({
      status: 'progress',
      file: 'onnx/encoder_model.onnx',
      loaded: 15_000_000,
      total: 30_000_000,
    })
    await loading
    expect(seen).toEqual([0.3])
  })

  it('辨識：載入前呼叫會失敗；輸出上限依音長；去掉頭尾空白', async () => {
    const p = fakePipeline('  Could we push the meeting  ')
    const engine = createSttEngine(p.fn, on('wasm'))
    await expect(engine.transcribe(new Float32Array(10))).rejects.toThrow('尚未載入')
    await engine.load(() => {})
    const samples = new Float32Array(16_000 * 3)
    await expect(engine.transcribe(samples)).resolves.toBe('Could we push the meeting')
    expect(p.calls[1].audio).toBe(samples)
    expect(p.calls[1].opts).toEqual({ max_new_tokens: 28 })
  })

  it('同時送來的辨識一次只跑一個', async () => {
    const p = fakePipeline((a) => `n${a.length}`)
    const engine = createSttEngine(p.fn, on('wasm'))
    await engine.load(() => {})
    const out = await Promise.all([
      engine.transcribe(new Float32Array(1)),
      engine.transcribe(new Float32Array(2)),
      engine.transcribe(new Float32Array(3)),
    ])
    expect(out).toEqual(['n1', 'n2', 'n3'])
    expect(p.maxActive()).toBe(1)
  })
})
