// 語音辨識服務（主執行緒端）：模型下載／載入狀態、辨識、釋放 Worker
// 分時載入：有人持有（小課裡有跟讀題）才留著 Worker；沒人持有時，載入一完成就釋放（設定頁單純下載的情況）
import type { DownloadStatus } from '../download/download'
import { detectDevice, MODEL_ID } from './sttEngine'
import type { SttRequest, SttResponse } from './stt.worker'

export type SttState =
  | { kind: 'unknown' } // 還沒查過快取
  | { kind: 'notDownloaded' }
  | { kind: 'downloading'; progress: number } // 第一次下載，0–1
  | { kind: 'downloaded' } // 已在快取、還沒載入記憶體
  | { kind: 'loading' } // 從快取載入＋暖機
  | { kind: 'ready' }
  | { kind: 'failed' }

export interface SttClient {
  get(): SttState
  subscribe(listener: () => void): () => void
  /** 查快取決定「已下載／未下載」；只在 unknown 時查 */
  refresh(): Promise<void>
  /** 下載（未快取時）＋載入＋暖機；進行中重複呼叫回傳同一個 promise */
  load(): Promise<void>
  transcribe(samples: Float32Array): Promise<string>
  /** 持有 Worker；回傳的函式放手，所有人都放手就釋放（載入中則等載入完） */
  acquire(): () => void
}

/** 設定頁與小課共用的下載狀態 */
export function sttDownloadStatus(s: SttState): DownloadStatus {
  if (s.kind === 'downloading') return { kind: 'downloading', progress: s.progress }
  if (s.kind === 'failed') return { kind: 'failed' }
  if (s.kind === 'downloaded' || s.kind === 'loading' || s.kind === 'ready')
    return { kind: 'downloaded' }
  return { kind: 'notDownloaded' }
}

type WorkerLike = Pick<Worker, 'postMessage' | 'terminate' | 'onmessage' | 'onerror'>
type Request = SttRequest extends infer R ? (R extends unknown ? Omit<R, 'id'> : never) : never

/** 「載入中」旗標：載入開始時立起、結束時放下；重開時還立著＝上次載入到一半分頁被系統關掉（記憶體不足） */
export interface LoadingMark {
  get(): boolean
  set(on: boolean): void
}

const noMark: LoadingMark = { get: () => false, set: () => {} }

export function createSttClient({
  createWorker,
  isCached,
  mark = noMark,
}: {
  createWorker: () => WorkerLike
  isCached: () => Promise<boolean>
  mark?: LoadingMark
}): SttClient {
  let state: SttState = { kind: 'unknown' }
  const listeners = new Set<() => void>()
  const set = (s: SttState) => {
    state = s
    listeners.forEach((l) => l())
  }

  let worker: WorkerLike | null = null
  let loading: Promise<void> | null = null
  let holders = 0
  let seq = 0
  const pending = new Map<number, { resolve: (v: unknown) => void; reject: (e: Error) => void }>()

  const rejectAll = (e: Error) => {
    for (const p of pending.values()) p.reject(e)
    pending.clear()
  }

  function terminate() {
    worker?.terminate()
    worker = null
    rejectAll(new Error('語音辨識已釋放'))
    if (state.kind === 'ready') set({ kind: 'downloaded' })
  }

  function call(req: Request, transfer: Transferable[] = []): Promise<unknown> {
    if (!worker) {
      const w = createWorker()
      w.onmessage = ({ data }: MessageEvent<SttResponse>) => {
        if (data.type === 'progress') {
          if (state.kind === 'downloading') set({ kind: 'downloading', progress: data.fraction })
          return
        }
        const p = pending.get(data.id)
        pending.delete(data.id)
        if (data.type === 'result') p?.resolve(data.result)
        else p?.reject(new Error(data.error))
      }
      w.onerror = () => rejectAll(new Error('語音辨識 Worker 發生錯誤'))
      worker = w
    }
    const id = ++seq
    const w = worker
    return new Promise((resolve, reject) => {
      pending.set(id, { resolve, reject })
      w.postMessage({ ...req, id }, transfer)
    })
  }

  return {
    get: () => state,
    subscribe(listener) {
      listeners.add(listener)
      return () => listeners.delete(listener)
    },

    async refresh() {
      if (state.kind !== 'unknown') return
      // 上次載入時分頁被關掉：當作載入失敗（可重試，也會提出瀏覽器語音辨識後備，D8）
      if (mark.get()) {
        mark.set(false)
        set({ kind: 'failed' })
        return
      }
      const cached = await isCached().catch(() => false)
      if (state.kind === 'unknown') set({ kind: cached ? 'downloaded' : 'notDownloaded' })
    },

    load() {
      if (state.kind === 'ready') return Promise.resolve()
      if (loading) return loading
      set(state.kind === 'downloaded' ? { kind: 'loading' } : { kind: 'downloading', progress: 0 })
      mark.set(true)
      loading = call({ cmd: 'load' })
        .then(
          () => {
            set({ kind: 'ready' })
            if (holders === 0) terminate()
          },
          (e: Error) => {
            terminate()
            set({ kind: 'failed' })
            throw e
          },
        )
        .finally(() => {
          loading = null
          mark.set(false)
        })
      return loading
    },

    async transcribe(samples) {
      if (state.kind !== 'ready') throw new Error('語音辨識模型尚未載入')
      return (await call({ cmd: 'transcribe', samples }, [samples.buffer])) as string
    },

    acquire() {
      holders++
      let held = true
      return () => {
        if (!held) return
        held = false
        holders--
        if (holders === 0 && !loading) terminate()
      }
    },
  }
}

/** transformers.js 的模型快取（Cache Storage）裡，目前裝置要用的兩個模型檔都在才算已下載 */
async function modelCached(): Promise<boolean> {
  if (typeof caches === 'undefined') return false
  const decoder = (await detectDevice()) === 'webgpu' ? 'q4' : 'quantized'
  const urls = (await (await caches.open('transformers-cache')).keys()).map((r) => r.url)
  const has = (file: string) =>
    urls.some((u) => u.endsWith(`${MODEL_ID}/resolve/main/onnx/${file}`))
  return has('encoder_model.onnx') && has(`decoder_model_merged_${decoder}.onnx`)
}

const MARK_KEY = 'lg.sttLoading'

export const stt = createSttClient({
  createWorker: () => new Worker(new URL('./stt.worker.ts', import.meta.url), { type: 'module' }),
  isCached: modelCached,
  mark: {
    get: () => {
      try {
        return sessionStorage.getItem(MARK_KEY) === '1'
      } catch {
        return false
      }
    },
    set: (on) => {
      try {
        if (on) sessionStorage.setItem(MARK_KEY, '1')
        else sessionStorage.removeItem(MARK_KEY)
      } catch {
        // 無痕模式等存不了就不偵測
      }
    },
  },
})
