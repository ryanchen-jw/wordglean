// 「今天」與每日新字額度：時間存 UTC epoch ms，只有算「哪一天」時才換到使用者時區（harness 09）

export function deviceTimeZone(): string {
  return Intl.DateTimeFormat().resolvedOptions().timeZone
}

const partsFormatters = new Map<string, Intl.DateTimeFormat>()

function wallClock(ms: number, timeZone: string) {
  let fmt = partsFormatters.get(timeZone)
  if (!fmt) {
    fmt = new Intl.DateTimeFormat('en-US', {
      timeZone,
      hourCycle: 'h23',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    })
    partsFormatters.set(timeZone, fmt)
  }
  const p: Record<string, string> = {}
  for (const { type, value } of fmt.formatToParts(ms)) p[type] = value
  return { y: +p.year, m: +p.month, d: +p.day, h: +p.hour, min: +p.minute, s: +p.second }
}

/** ms 在該時區的日期，格式 YYYY-MM-DD */
export function localDayKey(ms: number, timeZone: string): string {
  const { y, m, d } = wallClock(ms, timeZone)
  return `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`
}

// 該時區在 ms 時刻相對 UTC 的偏移（ms）
function offsetAt(ms: number, timeZone: string): number {
  const w = wallClock(ms, timeZone)
  return Date.UTC(w.y, w.m - 1, w.d, w.h, w.min, w.s) - Math.floor(ms / 1000) * 1000
}

function localMidnightUtc(y: number, m: number, d: number, timeZone: string): number {
  const guess = Date.UTC(y, m - 1, d)
  const first = guess - offsetAt(guess, timeZone)
  // 偏移在 guess 與實際午夜之間可能因夏令時間不同，以實際午夜的偏移再校正一次
  return guess - offsetAt(first, timeZone)
}

/** 本地日 dayKey 的 UTC 起訖（半開區間 [startMs, endMs)） */
export function dayBoundsUtc(dayKey: string, timeZone: string): { startMs: number; endMs: number } {
  const [y, m, d] = dayKey.split('-').map(Number)
  return {
    startMs: localMidnightUtc(y, m, d, timeZone),
    endMs: localMidnightUtc(y, m, d + 1, timeZone),
  }
}

/** 今日還能出幾個新字；待複習 > 每日新字 × 暫停倍數 時暫停出新字 */
export function newWordQuota(input: {
  dailyNewLimit: number
  pauseMultiplier: number
  dueCount: number
  introducedToday: number
}): { remaining: number; paused: boolean } {
  const paused = input.dueCount > input.dailyNewLimit * input.pauseMultiplier
  return {
    remaining: paused ? 0 : Math.max(0, input.dailyNewLimit - input.introducedToday),
    paused,
  }
}
