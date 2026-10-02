// 手機內建聲音（speechSynthesis）：零下載、永遠可用的預設引擎；不支援的瀏覽器回 null
import type { Rate, VoiceEngine } from './tts'

export function systemVoice(): VoiceEngine | null {
  if (typeof speechSynthesis === 'undefined') return null
  return {
    speak: (text: string, rate: Rate) =>
      new Promise<void>((resolve) => {
        const u = new SpeechSynthesisUtterance(text)
        u.lang = 'en-US'
        u.rate = rate
        // 被下一句取消也算結束，不讓呼叫端卡住
        u.onend = () => resolve()
        u.onerror = () => resolve()
        speechSynthesis.speak(u)
      }),
    cancel: () => speechSynthesis.cancel(),
  }
}
