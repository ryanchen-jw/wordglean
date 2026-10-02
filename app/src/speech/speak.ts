// 發音（最小實作）：手機內建聲音（speechSynthesis）；高音質 Kokoro 選配由 TASK-13 替換此 seam
// 設計規定發音鈕永遠可用（components.md §7），不支援的瀏覽器靜默略過

export function speak(text: string): void {
  if (typeof speechSynthesis === 'undefined') return
  speechSynthesis.cancel()
  const u = new SpeechSynthesisUtterance(text)
  u.lang = 'en-US'
  speechSynthesis.speak(u)
}
