// Web Speech API 後備（規格 §2「僅作最後後備」、TASK-14 Round 1 D8）：
// 只在本機辨識（Moonshine）不能用時提出；錄音會送到瀏覽器廠商的伺服器，所以必須先經使用者同意，
// 同意只存在記憶體裡，這次開 App 期間有效（不寫進設定、重開要再問）。沒同意前不建立 SpeechRecognition。
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

export interface WebSpeech {
  supported(): boolean
  consented(): boolean
  /** 使用者按「同意並使用」 */
  consent(): void
  /** 開始聽；沒同意會丟錯、不建立 SpeechRecognition；麥克風被拒丟 MicDeniedError */
  start(): Promise<WebSpeechTake>
}

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
      if (!consented) throw new Error('尚未同意使用瀏覽器的語音辨識')
      const Ctor = getCtor()
      if (!Ctor) throw new Error('這個瀏覽器沒有語音辨識')
      const r = new Ctor()
      r.lang = 'en-US'
      r.continuous = true
      r.interimResults = false
      r.maxAlternatives = 1

      await new Promise<void>((resolve, reject) => {
        r.onstart = () => resolve()
        r.onerror = (e) => reject(toError(e.error))
        r.start()
      })

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
  }
}

const g = globalThis as unknown as {
  SpeechRecognition?: RecognitionCtor
  webkitSpeechRecognition?: RecognitionCtor
}

export const webSpeech = createWebSpeech(() => g.SpeechRecognition ?? g.webkitSpeechRecognition)
