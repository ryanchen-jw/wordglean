// 音效（創辦人試用 2026-10-04 ④）：答對、答錯、完成一課各一個短音；Web Audio 即時合成，不用音檔、不加依賴
// 規則：設定頁可關（預設開，存這台裝置）；使用者還沒互動過不播（瀏覽器限制）；跟讀錄音中不播
export type Sfx = 'correct' | 'wrong' | 'complete'

const KEY = 'lg.sfx'

/** 每個音：頻率（Hz）、起點與長度（秒）；整段都在 400ms 內 */
type Note = { freq: number; at: number; dur: number }
const PATCHES: Record<Sfx, { wave: OscillatorType; peak: number; notes: Note[] }> = {
  // 上行兩音：E5 → A5
  correct: {
    wave: 'sine',
    peak: 0.16,
    notes: [
      { freq: 659.25, at: 0, dur: 0.14 },
      { freq: 880, at: 0.09, dur: 0.2 },
    ],
  },
  // 下行兩個低音，柔和不刺耳：E4 → C4
  wrong: {
    wave: 'triangle',
    peak: 0.14,
    notes: [
      { freq: 329.63, at: 0, dur: 0.14 },
      { freq: 261.63, at: 0.11, dur: 0.22 },
    ],
  },
  // 三音琶音：C5 → E5 → G5
  complete: {
    wave: 'sine',
    peak: 0.14,
    notes: [
      { freq: 523.25, at: 0, dur: 0.16 },
      { freq: 659.25, at: 0.1, dur: 0.16 },
      { freq: 783.99, at: 0.2, dur: 0.2 },
    ],
  },
}

/** 音效長度（ms） */
export const sfxDurationMs = (kind: Sfx) =>
  Math.round(Math.max(...PATCHES[kind].notes.map((n) => n.at + n.dur)) * 1000)

export function sfxEnabled(): boolean {
  try {
    return localStorage.getItem(KEY) !== 'off'
  } catch {
    return true
  }
}

export function setSfxEnabled(on: boolean) {
  try {
    if (on) localStorage.removeItem(KEY)
    else localStorage.setItem(KEY, 'off')
  } catch {
    // 存不下就只在這次開啟期間生效
  }
}

// 使用者互動過才播：優先用瀏覽器的 userActivation，不支援時以自己記的第一次點按為準
let touched = false

/** App 啟動時呼叫一次（main.tsx）：記下第一次點按（給不支援 userActivation 的瀏覽器）；import 本模組不會註冊任何監聽 */
export function watchFirstInteraction(target: Pick<Window, 'addEventListener'> = window) {
  for (const type of ['pointerdown', 'keydown'] as const)
    target.addEventListener(type, () => (touched = true), { capture: true, once: true })
}
const activated = () =>
  touched ||
  !!(navigator as Navigator & { userActivation?: { hasBeenActive: boolean } }).userActivation
    ?.hasBeenActive

// 錄音中不播：錄音開始時 hold()，結束時放手
let holds = 0
export function holdSfx(): () => void {
  holds++
  let held = true
  return () => {
    if (!held) return
    held = false
    holds--
  }
}

let ctx: AudioContext | null = null
let busyUntil = 0

function audioContext(): AudioContext | null {
  if (ctx) return ctx
  const Ctor =
    window.AudioContext ??
    (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
  if (!Ctor) return null
  ctx = new Ctor()
  return ctx
}

/** 播一個音效；不播（關閉、未互動、錄音中、不支援）就什麼都不做 */
export function playSfx(kind: Sfx) {
  if (!sfxEnabled() || !activated() || holds > 0) return
  try {
    const ac = audioContext()
    if (!ac) return
    if (ac.state === 'suspended') void ac.resume().catch(() => undefined)
    const { wave, peak, notes } = PATCHES[kind]
    const t0 = ac.currentTime + 0.01
    for (const n of notes) {
      const osc = ac.createOscillator()
      const gain = ac.createGain()
      osc.type = wave
      osc.frequency.value = n.freq
      // 10ms 淡入、指數淡出，避免爆音
      gain.gain.setValueAtTime(0.0001, t0 + n.at)
      gain.gain.linearRampToValueAtTime(peak, t0 + n.at + 0.01)
      gain.gain.exponentialRampToValueAtTime(0.0001, t0 + n.at + n.dur)
      osc.connect(gain).connect(ac.destination)
      osc.start(t0 + n.at)
      osc.stop(t0 + n.at + n.dur + 0.02)
    }
    busyUntil = Date.now() + sfxDurationMs(kind)
  } catch (e) {
    console.warn('[sfx] 無法播放音效', e)
  }
}

/** 正在播的音效播完（沒在播就馬上）；接著要發音的地方先等它，避免字音和音效疊在一起 */
export function afterSfx(): Promise<void> {
  const wait = busyUntil - Date.now()
  return wait > 0 ? new Promise((r) => setTimeout(r, wait)) : Promise.resolve()
}

/** 測試用：清掉播放狀態；touched＝使用者是否已互動過 */
export function resetSfxForTest({ touched: on = true } = {}) {
  ctx = null
  busyUntil = 0
  holds = 0
  touched = on
}
