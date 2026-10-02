// 手機內建聲音替身（TASK-13）：init script 把 speechSynthesis 換成記錄呼叫的版本，斷言念的句子、語速與語言，
// 不依賴模擬器真的發聲
import type { Page } from '@playwright/test'

export type Spoken = { text: string; rate: number; lang: string }

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
          spoken.push({ text: u.text, rate: u.rate, lang: u.lang })
          setTimeout(() => u.onend?.(), 0)
        },
      },
    })
  })
}

export const spokenList = (page: Page) =>
  page.evaluate(() => (window as unknown as { __spoken: Spoken[] }).__spoken)

export const lastSpoken = (page: Page) =>
  page.evaluate(() => (window as unknown as { __spoken: Spoken[] }).__spoken.at(-1))

/** 模擬支援 WebGPU 的手機（只讓「高音質發音」顯示為可下載；不會真的載入模型）。設計 s03／s11 預設畫面以此為準 */
export function fakeWebGpu(page: Page) {
  return page.addInitScript(() =>
    // configurable：個別測試可再覆寫成「沒有 WebGPU」
    Object.defineProperty(navigator, 'gpu', {
      value: { requestAdapter: async () => ({}) },
      configurable: true,
    }),
  )
}
