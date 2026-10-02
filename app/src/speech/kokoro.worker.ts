// 高音質發音（Kokoro-82M，選配）：在 Worker 裡載入 fp32＋WebGPU（voice-poc §5：q8 太慢不提供）；
// 模型檔由 transformers.js 存 Cache Storage（transformers-cache），音色檔由 kokoro-js 存 kokoro-voices
// 用法以 kokoro-js（Apache-2.0）README 與 TASK-1 原型 prototypes/voice-poc/src/voice.worker.js 為起點
import { env } from '@huggingface/transformers'
import { KokoroTTS } from 'kokoro-js'
// ort 的 wasm 放本站（不從 jsdelivr 抓；與 TASK-14 語音辨識同一份、同一路徑）；套件 exports 不開放 dist 子路徑，以相對路徑取
import ortMjs from '../../node_modules/@huggingface/transformers/dist/ort-wasm-simd-threaded.jsep.mjs?url'
import ortWasm from '../../node_modules/@huggingface/transformers/dist/ort-wasm-simd-threaded.jsep.wasm?url'
import type { WorkerIn, WorkerOut } from './kokoroProtocol'

env.backends.onnx.wasm!.wasmPaths = { mjs: ortMjs, wasm: ortWasm }

const MODEL_ID = 'onnx-community/Kokoro-82M-v1.0-ONNX'
const VOICE = 'af_heart'
// 小檔（設定、分詞表）先下載完，只看大檔才不會一開始就跳到 100%
const BIG_FILE = 1_000_000

let tts: Promise<KokoroTTS> | null = null
const files = new Map<string, { loaded: number; total: number }>()
// transformers.js 不支援同時推論：一律串成一條鏈
let chain: Promise<unknown> = Promise.resolve()

const post = (m: WorkerOut, transfer: Transferable[] = []) =>
  (self as unknown as Worker).postMessage(m, transfer)

function onProgress(p: { status: string; file?: string; loaded?: number; total?: number }) {
  if (p.status !== 'progress' || !p.file || !p.total) return
  files.set(p.file, { loaded: p.loaded ?? 0, total: p.total })
  let loaded = 0
  let total = 0
  for (const f of files.values())
    if (f.total >= BIG_FILE) {
      loaded += f.loaded
      total += f.total
    }
  if (total) post({ type: 'progress', progress: Math.min(loaded / total, 1) })
}

async function load() {
  tts ??= KokoroTTS.from_pretrained(MODEL_ID, {
    dtype: 'fp32',
    device: 'webgpu',
    progress_callback: onProgress,
  })
  const model = await tts
  // 暖機：下載音色檔、編譯 shader，回報 ready 後第一句就不用等
  await model.generate('Hi.', { voice: VOICE })
}

self.onmessage = (e: MessageEvent<WorkerIn>) => {
  const m = e.data
  if (m.type === 'load') {
    chain = chain.then(load).then(
      () => post({ type: 'ready' }),
      (err: unknown) => {
        tts = null
        post({ type: 'error', message: String(err) })
      },
    )
  } else {
    chain = chain.then(async () => {
      try {
        const audio = await (await tts!).generate(m.text, { voice: VOICE, speed: m.speed })
        const wav = audio.toWav()
        post({ type: 'audio', id: m.id, wav }, [wav])
      } catch (err) {
        post({ type: 'speakError', id: m.id, message: String(err) })
      }
    })
  }
}
