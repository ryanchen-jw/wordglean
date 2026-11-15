// e2e 專用（只在建置時設 VITE_E2E_SPEECH=true 才會用到，一般建置整段移除）：
// - 頁面載入前若設了 window.__lgSpeechConfig（Playwright addInitScript），換成可控的假辨識與假麥克風，供 06 視覺 smoke 截 s04 各狀態
// - 沒設則用真的服務；另掛 window.__lgSpeech.transcribeWav 讓 AC#2 整合測試用真模型辨識預錄音檔
// - 即時跟讀（TASK-40）：live＝依序的每輪辨識文字（與整句錄音的 heard 分開）。即時麥克風開著時辨識取 live 的下一句；
//   live 還有剩時假麥克風給有聲音的樣本，沒剩就給靜音（辨識迴圈被音量閘跳過）。假的瀏覽器語音辨識以中間結果送出 live 的下一句。
//   每輪約 200 ms；liveHold 時改由 __lgSpeech.next() 一次放一輪。__lgSpeech.live() 回報即時麥克風與瀏覽器辨識開／關次數（資源釋放的證據）
import { createWebSpeech, type RecognitionCtor } from './webSpeech'
import { to16k, type MicPermission } from './mic'
import type { SpeechServices } from './services'
import type { SttClient, SttState } from './stt'
import { isSttUsable } from './usable'

export interface E2eSpeechConfig {
  model?: SttState['kind']
  mic?: MicPermission
  /** 依序回傳的辨識結果 */
  heard?: string[]
  /** true＝辨識停在「轉文字中」，直到呼叫 __lgSpeech.finish() */
  hold?: boolean
  /** 即時跟讀依序的每輪辨識文字 */
  live?: string[]
  /** true＝即時跟讀每輪等 __lgSpeech.next() 才出結果 */
  liveHold?: boolean
  /** 瀏覽器是否支援即時取樣（AudioWorklet）；預設 true */
  liveMic?: boolean
  wasm?: boolean
  /** 瀏覽器是否有語音辨識（後備） */
  webSpeech?: boolean
}

type Win = typeof window & {
  __lgSpeechConfig?: E2eSpeechConfig
  __lgSpeech?: Record<string, unknown>
}

function fakeServices(cfg: E2eSpeechConfig, real: SpeechServices): SpeechServices {
  let state = { kind: cfg.model ?? 'ready' } as SttState
  const listeners = new Set<() => void>()
  const set = (s: SttState) => {
    state = s
    listeners.forEach((l) => l())
  }
  const heard = [...(cfg.heard ?? [])]
  const rounds = [...(cfg.live ?? [])]
  let release: () => void = () => {}
  // liveHold：next() 先到（辨識還沒送出這一輪）就記一次額度，下一輪一送出就放行
  let next: (() => void) | null = null
  let credits = 0
  const counts = { micStarts: 0, micStops: 0, webStarts: 0, webStops: 0 }
  const liveOpen = () => counts.micStarts > counts.micStops
  /** 一輪即時結果：liveHold 時等 next()，否則約 200 ms 後 */
  const liveRound = (emit: () => void) => {
    if (!cfg.liveHold) setTimeout(emit, 200)
    else if (credits > 0) {
      credits--
      setTimeout(emit)
    } else next = emit
  }
  const stt: SttClient = {
    get: () => state,
    subscribe: (l) => {
      listeners.add(l)
      return () => listeners.delete(l)
    },
    refresh: async () => {},
    load: async () => {},
    transcribe: () =>
      new Promise((resolve) => {
        if (liveOpen()) return liveRound(() => resolve(rounds.shift() ?? ''))
        const done = () => resolve(heard.shift() ?? '')
        if (cfg.hold) release = done
        else done()
      }),
    acquire: () => () => {},
  }
  ;(window as Win).__lgSpeech = {
    setModel: (s: SttState) => set(s),
    finish: () => release(),
    next: () => {
      const f = next
      next = null
      if (f) f()
      else credits++
    },
    live: () => ({ ...counts }),
  }
  const Recognition = class {
    lang = ''
    continuous = false
    interimResults = false
    maxAlternatives = 1
    onstart: (() => void) | null = null
    onend: (() => void) | null = null
    onresult: ((e: unknown) => void) | null = null
    onerror = null
    open = false
    start() {
      setTimeout(() => this.onstart?.())
      if (!this.interimResults) return
      counts.webStarts++
      this.open = true
      const emit = () => {
        if (!this.open) return
        const text = rounds.shift()
        if (text !== undefined)
          this.onresult?.({
            resultIndex: 0,
            results: [{ isFinal: false, 0: { transcript: text } }],
          })
        if (rounds.length) liveRound(emit)
      }
      liveRound(emit)
    }
    stop() {
      setTimeout(() => this.onend?.())
    }
    abort() {
      if (!this.interimResults) return
      this.open = false
      counts.webStops++
    }
  } as unknown as RecognitionCtor
  const web = cfg.webSpeech ? createWebSpeech(() => Recognition) : real.webSpeech
  return {
    stt,
    moonshineAvailable: () => cfg.wasm ?? true,
    micPermission: async () => cfg.mic ?? 'granted',
    requestMic: async () => true,
    startRecording: async () => ({
      stop: async () => new Float32Array(16_000),
      cancel: () => {},
    }),
    liveMicSupported: () => cfg.liveMic ?? true,
    async startLiveMic() {
      counts.micStarts++
      const t0 = Date.now()
      const elapsed = () => (Date.now() - t0) / 1000
      return {
        elapsed,
        read: (sec: number) =>
          new Float32Array(Math.floor(Math.min(sec, elapsed()) * 16_000)).fill(
            rounds.length ? 0.1 : 0,
          ),
        level: () => 0.5,
        stop: () => {
          counts.micStops++
          // 停錄後還在等的那一輪作廢（辨識迴圈已停，不吃掉下一次錄音的輪次）
          next = null
        },
      }
    },
    webSpeech: web,
    sttUsable: () => isSttUsable(cfg.mic !== 'unsupported', cfg.wasm ?? true, web.consented()),
  }
}

export function e2eSpeechServices(real: SpeechServices): SpeechServices {
  const cfg = (window as Win).__lgSpeechConfig
  if (cfg) return fakeServices(cfg, real)
  let held = false
  // 每次錄音的長度與音量（證據：真的錄到聲音；辨識結果為空時分辨是錄到靜音還是辨識端）
  const recordings: { seconds: number; rms: number; peak: number }[] = []
  const realStart = real.startRecording
  real = {
    ...real,
    async startRecording(onLevel) {
      const rec = await realStart(onLevel)
      return {
        cancel: () => rec.cancel(),
        async stop() {
          const s = await rec.stop()
          let sum = 0
          let peak = 0
          for (const v of s) {
            sum += v * v
            peak = Math.max(peak, Math.abs(v))
          }
          recordings.push({
            seconds: s.length / 16_000,
            rms: Math.sqrt(sum / (s.length || 1)),
            peak,
          })
          return s
        },
      }
    },
  }
  ;(window as Win).__lgSpeech = {
    recordings: () => recordings,
    sttState: () => real.stt.get(),
    /** 用真模型辨識一個音檔（第一次會下載／載入模型，之後一直留著）；回傳辨識文字 */
    async transcribeWav(url: string) {
      if (!held) {
        real.stt.acquire()
        held = true
      }
      await real.stt.load()
      const samples = await to16k(await (await fetch(url)).arrayBuffer())
      return real.stt.transcribe(samples)
    },
  }
  return real
}
