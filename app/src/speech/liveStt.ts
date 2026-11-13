// 即時跟讀的辨識迴圈（TASK-39，設計 §2.1）：上一輪辨識一結束就送下一輪（不排固定間隔，手機慢就自然拉長），
// 每輪辨識「最近 windowSec 秒」；音量閘：視窗內沒有夠大的人聲就跳過這輪（省電，也防 tiny 對靜音亂出字）；
// 上限：收音滿 maxSeconds 秒自動停（耗電保護，不是靜音偵測）。輸出長度上限沿用 stt 的 maxNewTokens
import { peakFrameRms, type LiveSource } from './liveMic'
import { SAMPLE_RATE } from './sttEngine'

export interface LiveRound {
  /** 第幾輪（從 1 起，只算真的送辨識的） */
  index: number
  text: string
  /** 這一輪辨識耗時 */
  ms: number
  windowSec: number
  /** 送出時已收音的秒數 */
  at: number
}

export type LiveStopReason = 'stopped' | 'limit' | 'error'

export interface LiveLoopOptions {
  source: LiveSource
  transcribe: (samples: Float32Array) => Promise<string>
  /** 每輪開始時讀，可在錄音中切換 */
  windowSec: () => number
  onRound: (round: LiveRound) => void
  onStop?: (reason: LiveStopReason, error?: unknown) => void
  /** 音量閘門檻（50 ms 一格 RMS 的最大值） */
  gate?: number
  maxSeconds?: number
  /**
   * 視窗內至少要有多少秒音訊才送；預設 1 秒：不到 1 秒時 tiny 常重複輸出（「The English, the English…」），
   * 重複字會被對到句中後面還沒播的同一個字（實驗 2：0.5 秒時兩輪確認開仍誤標 1.0%，1 秒時 0%）
   */
  minSeconds?: number
  /** 被跳過（音量閘、音訊不足）時等多久再看 */
  idleMs?: number
  now?: () => number
  sleep?: (ms: number) => Promise<void>
}

export const DEFAULT_GATE = 0.02

export function startLiveLoop({
  source,
  transcribe,
  windowSec,
  onRound,
  onStop,
  gate = DEFAULT_GATE,
  maxSeconds = 60,
  minSeconds = 1,
  idleMs = 100,
  now = () => performance.now(),
  sleep = (ms) => new Promise((r) => setTimeout(r, ms)),
}: LiveLoopOptions) {
  let running = true
  let skipped = 0
  const finish = (reason: LiveStopReason, error?: unknown) => {
    if (!running) return
    running = false
    onStop?.(reason, error)
  }

  void (async () => {
    let index = 0
    while (running) {
      const at = source.elapsed()
      if (at >= maxSeconds) return finish('limit')
      const win = windowSec()
      const samples = source.read(win)
      if (samples.length < minSeconds * SAMPLE_RATE || peakFrameRms(samples) < gate) {
        if (samples.length >= minSeconds * SAMPLE_RATE) skipped++
        await sleep(idleMs)
        continue
      }
      const t0 = now()
      let text: string
      try {
        text = await transcribe(samples)
      } catch (e) {
        return finish('error', e)
      }
      if (!running) return
      onRound({ index: ++index, text, ms: now() - t0, windowSec: win, at })
    }
  })()

  return {
    stop: () => finish('stopped'),
    /** 被音量閘跳過的次數 */
    skipped: () => skipped,
  }
}

/**
 * 測試音檔當成即時音源（實驗用）：音檔從呼叫時開始以真實時間播放，播完接靜音；
 * read 回傳到目前時間為止的最近 seconds 秒
 */
export function createFileSource(samples: Float32Array, now = () => performance.now()): LiveSource {
  const t0 = now()
  const elapsed = () => (now() - t0) / 1000
  return {
    elapsed,
    read(seconds) {
      const end = Math.floor(elapsed() * SAMPLE_RATE)
      const start = Math.max(0, end - Math.floor(seconds * SAMPLE_RATE))
      const out = new Float32Array(end - start)
      if (start < samples.length) out.set(samples.subarray(start, Math.min(end, samples.length)))
      return out
    },
  }
}

/** 百分位數（線性內插，p＝0–1）；空陣列回傳 NaN */
export function percentile(values: number[], p: number): number {
  if (values.length === 0) return NaN
  const s = [...values].sort((a, b) => a - b)
  const idx = p * (s.length - 1)
  const lo = Math.floor(idx)
  return s[lo] + (s[Math.min(lo + 1, s.length - 1)] - s[lo]) * (idx - lo)
}
