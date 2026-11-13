// 發音替身（TASK-13，TASK-35 加預產音檔）：init script 把 speechSynthesis 與 audio 元素的播放換成記錄呼叫的版本，
// 斷言念的文字、語速與用哪一種（clip＝預產音檔、system＝手機內建聲音），不依賴模擬器真的發聲
import type { Page } from '@playwright/test'

export type Spoken =
  | { engine: 'system'; text: string; rate: number; lang: string }
  | { engine: 'clip'; text: string; rate: number }

export function fakeSystemVoice(page: Page) {
  return page.addInitScript(() => {
    const spoken: Spoken[] = []
    Object.assign(window, { __spoken: spoken })
    class FakeUtterance {
      lang = ''
      rate = 1
      onend: (() => void) | null = null
      onerror: (() => void) | null = null
      text: string
      constructor(text: string) {
        this.text = text
      }
    }
    Object.defineProperty(window, 'SpeechSynthesisUtterance', { value: FakeUtterance })
    Object.defineProperty(window, 'speechSynthesis', {
      value: {
        cancel: () => {},
        speak: (u: FakeUtterance) => {
          spoken.push({ engine: 'system', text: u.text, rate: u.rate, lang: u.lang })
          setTimeout(() => u.onend?.(), 0)
        },
      },
    })
    // 預產音檔：App 播放前把文字標在 audio 元素的 data-clip（clips.ts）；兩引擎都當作能播 MP3
    const media = HTMLMediaElement.prototype
    media.canPlayType = (type: string) => (type === 'audio/mpeg' ? 'maybe' : '')
    media.play = function (this: HTMLMediaElement) {
      spoken.push({ engine: 'clip', text: this.dataset.clip ?? '', rate: this.playbackRate })
      setTimeout(() => this.dispatchEvent(new Event('ended')), 0)
      return Promise.resolve()
    }
    media.pause = () => {}
  })
}

export const spokenList = (page: Page) =>
  page.evaluate(() => (window as unknown as { __spoken: Spoken[] }).__spoken)

export const lastSpoken = (page: Page) =>
  page.evaluate(() => (window as unknown as { __spoken: Spoken[] }).__spoken.at(-1))
