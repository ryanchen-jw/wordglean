// 語音辨識 Worker：只在跟讀需要時建立，用完由主執行緒 terminate 釋放記憶體（分時載入，不與 Kokoro 同時常駐）
// 錄音只以 Float32Array 傳進來推論，不經網路；網路只用來第一次下載模型（Hugging Face，之後讀 Cache Storage）
import { env, pipeline } from '@huggingface/transformers'
// ort 的 wasm 放本站（不從 jsdelivr 抓）；套件 exports 不開放 dist 子路徑，以相對路徑取
import ortMjs from '../../node_modules/@huggingface/transformers/dist/ort-wasm-simd-threaded.jsep.mjs?url'
import ortWasm from '../../node_modules/@huggingface/transformers/dist/ort-wasm-simd-threaded.jsep.wasm?url'
import { createSttEngine, detectDevice, type PipelineFn } from './sttEngine'

env.allowLocalModels = false
env.backends.onnx.wasm!.wasmPaths = { mjs: ortMjs, wasm: ortWasm }

export type SttRequest =
  { id: number; cmd: 'load' } | { id: number; cmd: 'transcribe'; samples: Float32Array }

export type SttResponse =
  | { type: 'progress'; fraction: number }
  | { type: 'result'; id: number; result: unknown }
  | { type: 'error'; id: number; error: string }

const engine = createSttEngine(pipeline as unknown as PipelineFn, detectDevice)
const post = (msg: SttResponse) => self.postMessage(msg)

self.onmessage = async ({ data }: MessageEvent<SttRequest>) => {
  try {
    const result =
      data.cmd === 'load'
        ? await engine.load((fraction) => post({ type: 'progress', fraction }))
        : await engine.transcribe(data.samples)
    post({ type: 'result', id: data.id, result })
  } catch (e) {
    post({ type: 'error', id: data.id, error: String((e as Error)?.stack ?? e) })
  }
}
