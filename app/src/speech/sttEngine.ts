// Moonshine tiny 推論（在 Worker 內執行；推論函式由外部注入，單元測試不載真模型）
// 改寫自 huggingface/transformers.js-examples moonshine-web（Apache-2.0）與 TASK-1 原型 prototypes/voice-poc：
// WebGPU 偵測→WASM 後備、依裝置分精度（docs/research/voice-poc.md §5：不用全 q8，WebGPU 上會輸出亂碼）、
// 暖機與每次辨識都限制輸出長度（tiny 對靜音不會自己停）、推論串成一條鏈（transformers.js 不支援同時推論）

export const MODEL_ID = 'onnx-community/moonshine-tiny-ONNX'
export const SAMPLE_RATE = 16_000
export const WARMUP_TOKENS = 2
/** 要下載的模型檔數（encoder＋decoder） */
const MODEL_FILES = 2

export type Device = 'webgpu' | 'wasm'

/** moonshine-web 範本精度：WebGPU 約 76MB、WASM 約 52MB */
export const DTYPES = {
  webgpu: { encoder_model: 'fp32', decoder_model_merged: 'q4' },
  wasm: { encoder_model: 'fp32', decoder_model_merged: 'q8' },
} as const

/** 輸出長度上限：每秒音長 6 個 token＋10（原型實測，長句不被截斷） */
export function maxNewTokens(sampleCount: number): number {
  return Math.ceil((sampleCount / SAMPLE_RATE) * 6) + 10
}

export async function detectDevice(): Promise<Device> {
  try {
    const gpu = (navigator as Navigator & { gpu?: { requestAdapter(): Promise<unknown> } }).gpu
    if (gpu && (await gpu.requestAdapter())) return 'webgpu'
  } catch {
    // 取不到 adapter 就用 WASM
  }
  return 'wasm'
}

export interface ProgressInfo {
  status: string
  file?: string
  loaded?: number
  total?: number
}

type Asr = (
  audio: Float32Array,
  opts: { max_new_tokens: number },
) => Promise<{ text: string } | { text: string }[]>

export type PipelineFn = (
  task: 'automatic-speech-recognition',
  model: string,
  opts: {
    dtype: (typeof DTYPES)[Device]
    device: Device
    progress_callback: (p: ProgressInfo) => void
  },
) => Promise<Asr>

export function createSttEngine(pipelineFn: PipelineFn, device: () => Promise<Device>) {
  let asr: Asr | null = null
  let chain: Promise<unknown> = Promise.resolve()
  const chained = <T>(fn: () => Promise<T>): Promise<T> => {
    const p = chain.then(fn, fn)
    chain = p.catch(() => undefined)
    return p
  }

  return {
    /**
     * 下載（已快取則直接讀）＋載入＋暖機；onProgress 為兩個模型檔（encoder、decoder）的整體下載比例，只增不減。
     * 只算 .onnx：transformers.js 先抓 config／tokenizer 小檔、讀完設定才開始抓模型檔，
     * 把小檔算進去會在大檔還沒開始時就報 100%（創辦人試用 2026-10-04 ①）
     */
    async load(onProgress: (fraction: number) => void): Promise<{ device: Device }> {
      const dev = await device()
      const files = new Map<string, { loaded: number; total: number }>()
      let shown = 0
      const model = await pipelineFn('automatic-speech-recognition', MODEL_ID, {
        dtype: DTYPES[dev],
        device: dev,
        progress_callback: (p) => {
          if (p.status !== 'progress' || !p.file?.endsWith('.onnx') || !p.total) return
          files.set(p.file, { loaded: p.loaded ?? 0, total: p.total })
          if (files.size < MODEL_FILES) return
          let loaded = 0
          let total = 0
          for (const f of files.values()) {
            loaded += f.loaded
            total += f.total
          }
          if (loaded / total > shown) {
            shown = loaded / total
            onProgress(shown)
          }
        },
      })
      await chained(() => model(new Float32Array(SAMPLE_RATE), { max_new_tokens: WARMUP_TOKENS }))
      asr = model
      return { device: dev }
    },

    async transcribe(samples: Float32Array): Promise<string> {
      const model = asr
      if (!model) throw new Error('語音辨識模型尚未載入')
      const out = await chained(() =>
        model(samples, { max_new_tokens: maxNewTokens(samples.length) }),
      )
      return (Array.isArray(out) ? out[0].text : out.text).trim()
    },
  }
}
