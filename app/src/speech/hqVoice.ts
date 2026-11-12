// 高音質發音（Kokoro 選配）的狀態：支援偵測（WebGPU）、下載與進度、使用者選用、載入、合成與快取
// 下載＝在 Worker 載入模型（檔案由 transformers.js 存 Cache Storage）；完成即改選高音質
// 分頁在載入中被系統關掉（記憶體不足）時 sessionStorage 旗標會留著，同一分頁之後不再載入（voice-poc §5）
// TASK-34：下載（含下載後的模型載入）失敗一律維持「失敗」並附原因，重開 App 也不退回「未下載」；
// 最近一次失敗（階段、原因、訊息、時間）存 localStorage，診斷頁（screens/debug）讀它
import type { DownloadStatus, HqFailReason } from '../download/download'
import type { WorkerLike, WorkerOut } from './kokoroProtocol'
import type { Rate, VoiceEngine } from './tts'

export type VoiceChoice = 'system' | 'hq'

export interface AudioCache {
  get(key: string): Promise<ArrayBuffer | undefined> | ArrayBuffer | undefined
  set(key: string, wav: ArrayBuffer): unknown
}

export interface HqDeps {
  createWorker: () => WorkerLike
  hasWebGpu: () => Promise<boolean>
  /** 模型檔還在 Cache Storage（瀏覽器可能清掉） */
  modelCached: () => Promise<boolean>
  storage: Storage
  session: Storage
  play: (wav: ArrayBuffer) => { done: Promise<void>; stop: () => void }
  audioCache: AudioCache
  /** 載入期間多久沒有任何回音就算失敗（預設 90 秒；下載中每次進度都重新計時） */
  idleTimeoutMs?: number
  /** 播放時載入（已下載的模型）：多久沒有第一次回音就算失敗、改用內建聲音（預設 10 秒；有回音後改用 idleTimeoutMs） */
  firstEchoTimeoutMs?: number
  /** 合成一句多久沒回傳音檔就算失敗（預設 30 秒；Worker 收掉、下次重開） */
  synthTimeoutMs?: number
}

const DOWNLOADED_KEY = 'lg.ttsHq.downloaded'
const CHOICE_KEY = 'lg.ttsVoice'
const LOADING_KEY = 'lg.ttsHqLoading'
// 下載中（startDownload 到成功或失敗）掛著；App 啟動時還在＝上次下載途中頁面被系統關掉
const BOOTING_KEY = 'lg.ttsHq.booting'
const LAST_FAILURE_KEY = 'lg.ttsHq.lastFailure'

export type HqStage = 'download' | 'load' | 'speak' | 'init'
export interface HqFailure {
  stage: HqStage
  reason: HqFailReason | 'cacheMissing'
  message: string
  at: string
}

class HqLoadError extends Error {
  readonly reason: HqFailReason
  constructor(reason: HqFailReason, message: string) {
    super(message)
    this.reason = reason
  }
}
const reasonOf = (err: unknown): HqFailReason => (err instanceof HqLoadError ? err.reason : 'error')

function safe<T>(f: () => T, fallback: T): T {
  try {
    return f()
  } catch {
    return fallback
  }
}

export function createHqVoice(deps: HqDeps) {
  const read = (k: string) => safe(() => deps.storage.getItem(k), null)
  const write = (k: string, v: string | null) =>
    safe(() => (v === null ? deps.storage.removeItem(k) : deps.storage.setItem(k, v)), undefined)

  const record = (stage: HqStage, reason: HqFailure['reason'], message: string) =>
    write(
      LAST_FAILURE_KEY,
      JSON.stringify({ stage, reason, message, at: new Date().toISOString() } satisfies HqFailure),
    )
  // 沒有已下載旗標時：最近一次失敗在下載階段，就維持失敗（不退回未下載、不誘導重下）
  const initialStatus = (): DownloadStatus => {
    if (read(DOWNLOADED_KEY)) return { kind: 'downloaded' }
    const last = safe(() => JSON.parse(read(LAST_FAILURE_KEY) ?? 'null') as HqFailure | null, null)
    return last?.stage === 'download' && last.reason !== 'cacheMissing'
      ? { kind: 'failed', reason: last.reason }
      : { kind: 'notDownloaded' }
  }

  let status: DownloadStatus = initialStatus()
  const listeners = new Set<() => void>()
  const setStatus = (s: DownloadStatus) => {
    status = s
    listeners.forEach((l) => l())
  }

  let worker: WorkerLike | null = null
  let ready: Promise<void> | null = null
  let onProgress: ((p: number) => void) | null = null
  let nextId = 1
  const pending = new Map<
    number,
    { resolve: (wav: ArrayBuffer) => void; reject: (e: Error) => void }
  >()
  let playing: { stop: () => void } | null = null
  // 最後一次請求：等待中（讀快取、合成）被取代的請求靠比對它得知自己不該出聲
  let latest: { key: string } | null = null
  const synthesizing = new Map<string, Promise<ArrayBuffer | undefined>>()
  let synthTail: Promise<unknown> = Promise.resolve()
  // 目前 Worker 的失敗處理（合成逾時也走這裡）
  let failWorker: ((err: Error) => void) | null = null

  // Worker 腳本本身載不到（App 更新後離線開啟，Worker 不在預快取）、執行中崩潰或久無回音時，
  // 不能讓 ready 永遠懸著：一律失敗並清掉，交給既有的「退回內建聲音＋提示」與「下載失敗可重試」
  // firstEchoMs：第一次回音的時限（播放時載入用，不讓使用者對著無聲等 90 秒）；之後每次進度以 idleTimeoutMs 重新計時
  function boot(stage: 'download' | 'load', firstEchoMs?: number): Promise<void> {
    if (ready) return ready
    const w = deps.createWorker()
    worker = w
    let idle: ReturnType<typeof setTimeout> | undefined
    let loaded = false
    ready = new Promise<void>((resolve, reject) => {
      // 載入中或已載入後（合成中崩潰）都走這裡：等待中的合成一併失敗、Worker 收掉，下次重開
      const fail = (err: Error) => {
        clearTimeout(idle)
        record(loaded ? 'speak' : stage, reasonOf(err), err.message)
        reject(err)
        for (const p of pending.values()) p.reject(err)
        pending.clear()
        w.terminate()
        if (worker === w) {
          worker = null
          ready = null
        }
      }
      failWorker = fail
      const arm = (ms = deps.idleTimeoutMs ?? 90_000) => {
        clearTimeout(idle)
        idle = setTimeout(() => fail(new HqLoadError('timeout', '高音質發音載入逾時')), ms)
      }
      arm(firstEchoMs)
      w.onerror = (e) =>
        fail(new HqLoadError('worker', `高音質發音的 Worker 無法執行：${e?.message ?? ''}`))
      w.onmessageerror = () => fail(new HqLoadError('worker', '高音質發音的 Worker 訊息無法解讀'))
      w.onmessage = (e: MessageEvent<WorkerOut>) => {
        const m = e.data
        if (m.type === 'progress') {
          arm()
          onProgress?.(m.progress)
        } else if (m.type === 'ready') {
          clearTimeout(idle)
          loaded = true
          resolve()
        } else if (m.type === 'error') fail(new Error(m.message))
        else {
          const p = pending.get(m.id)
          pending.delete(m.id)
          if (m.type === 'audio') p?.resolve(m.wav)
          else {
            record('speak', 'error', m.message)
            p?.reject(new Error(m.message))
          }
        }
      }
    })
    w.postMessage({ type: 'load' })
    return ready
  }

  // Worker 依序合成，一起送的話排隊時間會算進合成逾時：一次只送一句，輪到時已被取代的就不送。
  // 同一句（文字＋語速）合成中再按，共用同一次
  function synthesize(key: string, text: string, rate: Rate) {
    const running = synthesizing.get(key)
    if (running) return running
    const job = synthTail
      .then(async () => {
        if (latest?.key !== key) return undefined
        const id = nextId++
        let timer: ReturnType<typeof setTimeout> | undefined
        const wav = await new Promise<ArrayBuffer>((resolve, reject) => {
          pending.set(id, { resolve, reject })
          worker!.postMessage({ type: 'speak', id, text, speed: rate })
          timer = setTimeout(
            () => failWorker?.(new Error('高音質發音合成逾時')),
            deps.synthTimeoutMs ?? 30_000,
          )
        }).finally(() => clearTimeout(timer))
        await deps.audioCache.set(key, wav)
        return wav
      })
      .finally(() => synthesizing.delete(key))
    synthesizing.set(key, job)
    synthTail = job.catch(() => {})
    return job
  }

  const engine: VoiceEngine = {
    async speak(text: string, rate: Rate) {
      const key = `${rate}|${text}`
      const request = (latest = { key })
      let wav = await deps.audioCache.get(key)
      if (request !== latest) return
      wav ??= await synthesize(key, text, rate)
      if (request !== latest || !wav) return
      const p = deps.play(wav)
      playing = p
      await p.done
    },
    cancel() {
      latest = null
      playing?.stop()
      playing = null
    },
  }

  return {
    status: () => status,
    choice: (): VoiceChoice =>
      status.kind === 'downloaded' && read(CHOICE_KEY) === 'hq' ? 'hq' : 'system',
    setChoice(c: VoiceChoice) {
      write(CHOICE_KEY, c)
      listeners.forEach((l) => l())
    },
    wantHq() {
      return this.choice() === 'hq'
    },
    subscribe(l: () => void) {
      listeners.add(l)
      return () => void listeners.delete(l)
    },

    async init() {
      if (!(await deps.hasWebGpu().catch(() => false))) return setStatus({ kind: 'unsupported' })
      if (status.kind === 'downloading') return
      if (read(BOOTING_KEY)) {
        write(BOOTING_KEY, null)
        record('download', 'crashed', 'page closed while downloading (boot flag left)')
      }
      const flagged = !!read(DOWNLOADED_KEY)
      if (flagged && !(await deps.modelCached().catch(() => false))) {
        write(DOWNLOADED_KEY, null)
        write(CHOICE_KEY, null)
        record('init', 'cacheMissing', 'downloaded flag set but model.onnx not in cache')
        return setStatus({ kind: 'notDownloaded' })
      }
      setStatus(initialStatus())
    },

    startDownload() {
      if (status.kind === 'downloading' || status.kind === 'unsupported') return
      setStatus({ kind: 'downloading', progress: 0 })
      write(BOOTING_KEY, '1')
      onProgress = (progress) => setStatus({ kind: 'downloading', progress })
      boot('download').then(
        () => {
          onProgress = null
          write(BOOTING_KEY, null)
          write(DOWNLOADED_KEY, '1')
          write(CHOICE_KEY, 'hq')
          setStatus({ kind: 'downloaded' })
        },
        (err: unknown) => {
          onProgress = null
          write(BOOTING_KEY, null)
          setStatus({ kind: 'failed', reason: reasonOf(err) })
        },
      )
    },

    /** 發音服務的 loadHq：已下載的模型載入 Worker；上次載入中崩潰就直接失敗 */
    async load(): Promise<VoiceEngine> {
      if (safe(() => deps.session.getItem(LOADING_KEY), null)) {
        record('load', 'crashed', 'page closed while loading (session flag left)')
        throw new HqLoadError('crashed', '上次載入高音質發音時分頁被關閉')
      }
      safe(() => deps.session.setItem(LOADING_KEY, '1'), undefined)
      try {
        await boot('load', deps.firstEchoTimeoutMs ?? 10_000)
      } finally {
        safe(() => deps.session.removeItem(LOADING_KEY), undefined)
      }
      return engine
    },
  }
}

export type HqVoice = ReturnType<typeof createHqVoice>
