// Web Speech API 後備（規格 §2「僅作最後後備」、TASK-14 Round 1 D8）：
// 只在本機辨識（Moonshine）不能用時提出；錄音會送到瀏覽器廠商的伺服器，所以必須先經使用者同意，
// 同意只存在記憶體裡，這次開 App 期間有效（不寫進設定、重開要再問）。沒同意前不建立 SpeechRecognition。
// 即時跟讀（TASK-40）的後備用 startLive：開中間結果，每次結果回呼目前這段的文字，給 liveMatch 當一輪
import { MicDeniedError } from './mic'

interface RecognitionResultList {
  length: number
  [i: number]: { isFinal: boolean; 0: { transcript: string } }
}

interface RecognitionLike {
  lang: string
  continuous: boolean
  interimResults: boolean
  maxAlternatives: number
  onstart: (() => void) | null
  onresult: ((e: { resultIndex: number; results: RecognitionResultList }) => void) | null
  onerror: ((e: { error: string }) => void) | null
  onend: (() => void) | null
  start(): void
  stop(): void
  abort(): void
}

export type RecognitionCtor = new () => RecognitionLike

export interface WebSpeechTake {
  /** 結束並回傳辨識文字 */
  stop(): Promise<string>
  cancel(): void
}

export interface WebSpeechLive {
  /** 停止收音；之後不再回呼 */
  stop(): void
}

export interface WebSpeech {
  supported(): boolean
  consented(): boolean
  /** 使用者按「同意並使用」 */
  consent(): void
  /** 開始聽；沒同意會丟錯、不建立 SpeechRecognition；麥克風被拒丟 MicDeniedError */
  start(): Promise<WebSpeechTake>
  /**
   * 即時版：每次辨識結果（含未定稿的中間結果）回呼目前這段的文字；瀏覽器自己結束（靜音逾時）就重新開始，
   * 出錯（沒聲音除外）才結束並呼叫 onEnd。同意與錯誤處理同 start
   */
  startLive(onText: (text: string) => void, onEnd: (error: Error) => void): Promise<WebSpeechLive>
}

const begin = (r: RecognitionLike) =>
  new Promise<void>((resolve, reject) => {
    r.onstart = () => resolve()
    r.onerror = (e) => reject(toError(e.error))
    r.start()
  })

const toError = (error: string) =>
  error === 'not-allowed' || error === 'service-not-allowed'
    ? new MicDeniedError()
    : new Error(`瀏覽器語音辨識失敗：${error}`)

export function createWebSpeech(getCtor: () => RecognitionCtor | undefined): WebSpeech {
  let consented = false
  return {
    supported: () => !!getCtor(),
    consented: () => consented,
    consent() {
      consented = true
    },
    async start() {
      const r = create(false)
      await begin(r)

      const parts: string[] = []
      let failure: Error | null = null
      r.onresult = (e) => {
        for (let i = e.resultIndex; i < e.results.length; i++)
          if (e.results[i].isFinal) parts.push(e.results[i][0].transcript)
      }
      // 「沒聽到聲音」不算錯，回空字串讓使用者在確認畫面自己填
      r.onerror = (e) => {
        if (e.error !== 'no-speech' && e.error !== 'aborted') failure = toError(e.error)
      }
      const ended = new Promise<void>((resolve) => (r.onend = () => resolve()))

      return {
        async stop() {
          r.stop()
          await ended
          if (failure) throw failure
          return parts.join(' ').replace(/\s+/g, ' ').trim()
        },
        cancel() {
          r.onresult = null
          r.abort()
        },
      }
    },
    async startLive(onText, onEnd) {
      const r = create(true)
      await begin(r)
      let stopped = false
      let failure: Error | null = null
      r.onresult = (e) => {
        const text = e.results[e.results.length - 1]?.[0].transcript.trim()
        if (!stopped && text) onText(text)
      }
      r.onerror = (e) => {
        if (e.error !== 'no-speech' && e.error !== 'aborted') failure = toError(e.error)
      }
      r.onend = () => {
        if (stopped) return
        if (failure) {
          stopped = true
          return onEnd(failure)
        }
        try {
          r.start()
        } catch (e) {
          stopped = true
          onEnd(e as Error)
        }
      }
      return {
        stop() {
          stopped = true
          r.onresult = null
          r.abort()
        },
      }
    },
  }

  function create(interim: boolean) {
    if (!consented) throw new Error('尚未同意使用瀏覽器的語音辨識')
    const Ctor = getCtor()
    if (!Ctor) throw new Error('這個瀏覽器沒有語音辨識')
    const r = new Ctor()
    r.lang = 'en-US'
    r.continuous = true
    r.interimResults = interim
    r.maxAlternatives = 1
    return r
  }
}

const g = globalThis as unknown as {
  SpeechRecognition?: RecognitionCtor
  webkitSpeechRecognition?: RecognitionCtor
}

export const webSpeech = createWebSpeech(() => g.SpeechRecognition ?? g.webkitSpeechRecognition)
