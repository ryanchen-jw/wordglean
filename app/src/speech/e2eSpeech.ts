// e2e 專用（只在建置時設 VITE_E2E_SPEECH=true 才會用到，一般建置整段移除）：
// - 頁面載入前若設了 window.__lgSpeechConfig（Playwright addInitScript），換成可控的假辨識與假麥克風，供 06 視覺 smoke 截 s04 各狀態
// - 沒設則用真的服務；另掛 window.__lgSpeech.transcribeWav 讓 AC#2 整合測試用真模型辨識預錄音檔
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
  let release: () => void = () => {}
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
        const done = () => resolve(heard.shift() ?? '')
        if (cfg.hold) release = done
        else done()
      }),
    acquire: () => () => {},
  }
  ;(window as Win).__lgSpeech = {
    setModel: (s: SttState) => set(s),
    finish: () => release(),
  }
  const Recognition = class {
    lang = ''
    continuous = false
    interimResults = false
    maxAlternatives = 1
    onstart: (() => void) | null = null
    onend: (() => void) | null = null
    onresult = null
    onerror = null
    start() {
      setTimeout(() => this.onstart?.())
    }
    stop() {
      setTimeout(() => this.onend?.())
    }
    abort() {}
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
