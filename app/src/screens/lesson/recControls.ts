// 跟讀錄音鈕共用（整句錄音 ShadowingView 與即時跟讀 LiveShadowingView）：樣式、音量條、減少動態效果、計時
// 音量條靜止時的高度（設計 s04 recording）；錄音中依音量縮放
export const WAVE = [6, 12, 20, 14, 22, 10, 16, 6]

const recBase =
  'grid size-[76px] place-items-center rounded-full transition-transform duration-(--lg-duration-press) ease-standard active:scale-(--lg-press-scale) disabled:active:scale-100'
export const recCls = {
  idle: `${recBase} bg-primary text-on-primary`,
  on: `${recBase} bg-error text-on-primary shadow-[0_0_0_6px_var(--lg-error-bg),0_0_0_8px_var(--lg-error)]`,
  busy: `${recBase} bg-disabled-bg text-disabled-text`,
  denied: `${recBase} border-2 border-error bg-surface text-error`,
}

export const reducedMotion = () =>
  typeof window !== 'undefined' && !!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

export const clock = (ms: number) => {
  const s = Math.floor(ms / 1000)
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`
}
