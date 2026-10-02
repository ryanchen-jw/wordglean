// 測試用：假的 SpeechRecognition（記錄被建立幾次、依序回傳辨識文字；deny＝模擬麥克風被拒）
import type { RecognitionCtor } from './webSpeech'

export function fakeRecognition({ texts = [] as string[], deny = false } = {}) {
  const made: {
    lang: string
    continuous: boolean
    interimResults: boolean
    stop: () => void
  }[] = []
  const queue = [...texts]
  class FakeRecognition {
    lang = ''
    continuous = false
    interimResults = true
    maxAlternatives = 0
    onstart: (() => void) | null = null
    onresult: ((e: unknown) => void) | null = null
    onerror: ((e: { error: string }) => void) | null = null
    onend: (() => void) | null = null
    constructor() {
      made.push(this)
    }
    start() {
      queueMicrotask(() => (deny ? this.onerror?.({ error: 'not-allowed' }) : this.onstart?.()))
    }
    stop() {
      const text = queue.shift()
      queueMicrotask(() => {
        if (text === undefined) this.onerror?.({ error: 'no-speech' })
        else
          this.onresult?.({
            resultIndex: 0,
            results: [{ isFinal: true, 0: { transcript: text } }],
          })
        this.onend?.()
      })
    }
    abort() {
      queueMicrotask(() => this.onend?.())
    }
  }
  return { Ctor: FakeRecognition as unknown as RecognitionCtor, made }
}
