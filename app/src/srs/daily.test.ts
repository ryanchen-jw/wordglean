// @vitest-environment node
import { describe, expect, it } from 'vitest'
import { dayBoundsUtc, localDayKey, newWordQuota } from './daily'

const at = (iso: string) => Date.parse(iso)

describe('localDayKey：以使用者時區換日', () => {
  it('UTC+8（Asia/Taipei）：UTC 16:00 換日', () => {
    expect(localDayKey(at('2026-10-01T15:59:59.999Z'), 'Asia/Taipei')).toBe('2026-10-01')
    expect(localDayKey(at('2026-10-01T16:00:00Z'), 'Asia/Taipei')).toBe('2026-10-02')
  })

  it('UTC-5（America/Bogota）：UTC 05:00 換日', () => {
    expect(localDayKey(at('2026-10-02T04:59:59.999Z'), 'America/Bogota')).toBe('2026-10-01')
    expect(localDayKey(at('2026-10-02T05:00:00Z'), 'America/Bogota')).toBe('2026-10-02')
  })

  it('UTC-5（America/New_York 冬令）：UTC 05:00 換日', () => {
    expect(localDayKey(at('2026-12-15T04:59:59.999Z'), 'America/New_York')).toBe('2026-12-14')
    expect(localDayKey(at('2026-12-15T05:00:00Z'), 'America/New_York')).toBe('2026-12-15')
  })

  it('同一瞬間在兩個時區屬於不同日', () => {
    const t = at('2026-10-01T20:00:00Z')
    expect(localDayKey(t, 'Asia/Taipei')).toBe('2026-10-02')
    expect(localDayKey(t, 'America/Bogota')).toBe('2026-10-01')
  })
})

describe('dayBoundsUtc：本地日界轉 UTC（半開區間）', () => {
  it('Asia/Taipei 2026-10-02', () => {
    expect(dayBoundsUtc('2026-10-02', 'Asia/Taipei')).toEqual({
      startMs: at('2026-10-01T16:00:00Z'),
      endMs: at('2026-10-02T16:00:00Z'),
    })
  })

  it('America/Bogota 2026-10-02', () => {
    expect(dayBoundsUtc('2026-10-02', 'America/Bogota')).toEqual({
      startMs: at('2026-10-02T05:00:00Z'),
      endMs: at('2026-10-03T05:00:00Z'),
    })
  })

  it('America/New_York 夏令結束日 2026-11-01 有 25 小時', () => {
    expect(dayBoundsUtc('2026-11-01', 'America/New_York')).toEqual({
      startMs: at('2026-11-01T04:00:00Z'),
      endMs: at('2026-11-02T05:00:00Z'),
    })
  })

  it('Australia/Sydney 夏令開始日 2026-10-04 有 23 小時（UTC 以東、午夜在切換前）', () => {
    expect(dayBoundsUtc('2026-10-04', 'Australia/Sydney')).toEqual({
      startMs: at('2026-10-03T14:00:00Z'),
      endMs: at('2026-10-04T13:00:00Z'),
    })
  })
})

describe('newWordQuota：每日新字上限與暫停門檻', () => {
  const base = { dailyNewLimit: 10, pauseMultiplier: 10 }

  it('未達上限：剩餘＝上限－今日已出', () => {
    expect(newWordQuota({ ...base, dueCount: 0, introducedToday: 3 })).toEqual({
      remaining: 7,
      paused: false,
    })
  })

  it('已達或超過上限：剩餘 0，不為負', () => {
    expect(newWordQuota({ ...base, dueCount: 0, introducedToday: 10 })).toEqual({
      remaining: 0,
      paused: false,
    })
    expect(newWordQuota({ ...base, dueCount: 0, introducedToday: 12 })).toEqual({
      remaining: 0,
      paused: false,
    })
  })

  it('待複習＝上限×10 時不暫停；超過 1 筆即暫停', () => {
    expect(newWordQuota({ ...base, dueCount: 100, introducedToday: 0 })).toEqual({
      remaining: 10,
      paused: false,
    })
    expect(newWordQuota({ ...base, dueCount: 101, introducedToday: 0 })).toEqual({
      remaining: 0,
      paused: true,
    })
  })

  // TASK-18 執行長裁示：上限 0＝使用者不要新字，不是複習太多，不顯示「新課暫停」
  it('每日新字設 0：有到期也不算暫停，剩餘 0', () => {
    expect(
      newWordQuota({ dailyNewLimit: 0, pauseMultiplier: 10, dueCount: 1, introducedToday: 0 }),
    ).toEqual({ remaining: 0, paused: false })
  })

  it('暫停倍數可設定', () => {
    expect(
      newWordQuota({ dailyNewLimit: 10, pauseMultiplier: 5, dueCount: 51, introducedToday: 0 }),
    ).toEqual({
      remaining: 0,
      paused: true,
    })
    expect(
      newWordQuota({ dailyNewLimit: 20, pauseMultiplier: 10, dueCount: 150, introducedToday: 5 }),
    ).toEqual({
      remaining: 15,
      paused: false,
    })
  })
})
