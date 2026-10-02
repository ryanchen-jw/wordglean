// 發音（單字卡的喇叭鈕）：先用手機內建聲音；Kokoro 與退回邏輯屬 TASK-13，接上後替換本檔
export function canSpeak(): boolean {
  return typeof window !== 'undefined' && 'speechSynthesis' in window
}

export function speak(text: string) {
  if (!canSpeak()) return
  const u = new SpeechSynthesisUtterance(text)
  u.lang = 'en-US'
  speechSynthesis.cancel()
  speechSynthesis.speak(u)
}
