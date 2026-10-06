import { describe, expect, it } from 'vitest'
import type { Level } from '../curriculum/curriculum'
import {
  computeGrowth,
  isRemembered,
  retrievability,
  startRank,
  type GrowthInput,
  type PoolMemory,
} from './growth'

const DAY = 86_400_000
const NOW = Date.parse('2026-10-06T04:00:00Z') // 台北 12:00
const TZ = 'Asia/Taipei'

// 每級 10 個字：a1w0…a1w9、a2w0…（70% 門檻＝7 個）
const LEVEL_WORDS = Object.fromEntries(
  (['A1', 'A2', 'B1', 'B2', 'C1'] as Level[]).map((l) => [
    l,
    new Set(Array.from({ length: 10 }, (_, i) => `${l.toLowerCase()}w${i}`)),
  ]),
) as Record<Level, Set<string>>

const fresh = (wordId: string): PoolMemory => ({ wordId, stability: 10, lastReview: NOW - DAY })
const words = (level: string, n: number) => Array.from({ length: n }, (_, i) => `${level}w${i}`)

function input(over: Partial<GrowthInput> = {}): GrowthInput {
  return {
    logs: [],
    pool: [],
    levelWords: LEVEL_WORDS,
    placed: null,
    record: undefined,
    nowMs: NOW,
    timeZone: TZ,
    ...over,
  }
}

/** n 個字都作答過、都記得 */
function learnedAndRemembered(ids: string[], reviewMs = NOW - DAY) {
  return {
    logs: ids.map((wordId) => ({ wordId, review: reviewMs })),
    pool: ids.map(fresh),
  }
}

describe('可提取率 R(t)=(1+19/81·t/S)^-0.5', () => {
  it('t＝0 時為 1；t＝S 時剛好 0.9', () => {
    expect(retrievability(0, 5)).toBe(1)
    expect(retrievability(5, 5)).toBe(0.9)
    expect(retrievability(243, 19)).toBe(0.5)
  })

  it('R 剛好 0.9 算記得；多 1 分鐘就不算', () => {
    const S = 3
    expect(isRemembered({ stability: S, lastReview: NOW - 3 * DAY }, NOW)).toBe(true)
    expect(isRemembered({ stability: S, lastReview: NOW - 3 * DAY - 60_000 }, NOW)).toBe(false)
  })

  it('沒複習過（lastReview＝null）或 stability＝0 不算記得', () => {
    expect(isRemembered({ stability: 5, lastReview: null }, NOW)).toBe(false)
    expect(isRemembered({ stability: 0, lastReview: NOW }, NOW)).toBe(false)
  })
})

describe('起點＝分級推薦級的前一級', () => {
  it('未分級、推薦 A1 皆為入門（0）；推薦 B1 為 A2（2）；推薦 C1 為 B2（4）', () => {
    expect(startRank(null)).toBe(0)
    expect(startRank('A1')).toBe(0)
    expect(startRank('B1')).toBe(2)
    expect(startRank('C1')).toBe(4)
  })

  it('推薦 B1、什麼都沒學：程度 A2、往 B1　0%', () => {
    const { model } = computeGrowth(input({ placed: 'B1' }))
    expect(model.level).toBe('A2')
    expect(model.next).toEqual({ level: 'B1', pct: 0 })
  })

  it('未分級：程度入門（null）、往 A1', () => {
    const { model } = computeGrowth(input())
    expect(model.level).toBeNull()
    expect(model.next).toEqual({ level: 'A1', pct: 0 })
  })
})

describe('已學單字', () => {
  it('作答過的字算（同字多次只算一次）；收藏但沒複習過的字不算', () => {
    const { model } = computeGrowth(
      input({
        logs: [
          { wordId: 'a1w0', review: NOW - 2 * DAY },
          { wordId: 'a1w0', review: NOW - DAY },
          { wordId: 'a1w1', review: NOW - DAY },
          { wordId: 'look up', review: NOW - DAY },
        ],
        pool: [
          fresh('a1w0'),
          fresh('a1w1'),
          fresh('look up'),
          { wordId: 'zebra', stability: 0, lastReview: null }, // 收藏、未複習
        ],
      }),
    )
    expect(model.learned).toBe(3)
    expect(model.remembered).toBe(3)
  })

  it('記得的字會隨時間減少，已學單字不變', () => {
    const data = learnedAndRemembered(['a1w0', 'a1w1'])
    const later = computeGrowth(input({ ...data, nowMs: NOW + 30 * DAY }))
    expect(later.model.learned).toBe(2)
    expect(later.model.remembered).toBe(0)
  })
})

describe('這週新學（過去 7 天第一次學）', () => {
  it('第一次作答在 7 天前多 1 毫秒內算；剛好 7 天前不算；之前學過、這週又複習不算', () => {
    const { model } = computeGrowth(
      input({
        logs: [
          { wordId: 'a1w0', review: NOW - 7 * DAY + 1 },
          { wordId: 'a1w1', review: NOW - 7 * DAY },
          { wordId: 'a1w2', review: NOW - 10 * DAY },
          { wordId: 'a1w2', review: NOW - DAY },
          { wordId: 'a1w3', review: NOW },
        ],
      }),
    )
    expect(model.learned).toBe(4)
    expect(model.thisWeek).toBe(2)
  })
})

describe('70% 門檻與各級明細', () => {
  it('A1 記得 6／10（60%）：仍入門，往 A1　60%', () => {
    const { model } = computeGrowth(input(learnedAndRemembered(words('a1', 6))))
    expect(model.level).toBeNull()
    expect(model.next).toEqual({ level: 'A1', pct: 60 })
  })

  it('A1 記得 7／10（剛好 70%）：達到 A1，往 A2', () => {
    const { model } = computeGrowth(input(learnedAndRemembered(words('a1', 7))))
    expect(model.level).toBe('A1')
    expect(model.next).toEqual({ level: 'A2', pct: 0 })
  })

  it('百分比無條件捨去（69.9% 不會顯示成 70%）', () => {
    const levelWords = { ...LEVEL_WORDS, A1: new Set(words('a1', 1000)) }
    const { model } = computeGrowth(
      input({ levelWords, ...learnedAndRemembered(words('a1', 699)) }),
    )
    expect(model.level).toBeNull()
    expect(model.next).toEqual({ level: 'A1', pct: 69 })
  })

  it('各級明細列出 A1–C1 記得字數與總數；不在課綱的字不計入任何級', () => {
    const { model } = computeGrowth(
      input(learnedAndRemembered([...words('a1', 3), ...words('b2', 2), 'zebra'])),
    )
    expect(model.levels).toEqual([
      { level: 'A1', remembered: 3, total: 10 },
      { level: 'A2', remembered: 0, total: 10 },
      { level: 'B1', remembered: 0, total: 10 },
      { level: 'B2', remembered: 2, total: 10 },
      { level: 'C1', remembered: 0, total: 10 },
    ])
    expect(model.remembered).toBe(6)
  })

  it('C1 達標：程度 C1、不再有下一級', () => {
    const { model } = computeGrowth(input(learnedAndRemembered(words('c1', 7))))
    expect(model.level).toBe('C1')
    expect(model.next).toBeNull()
  })
})

describe('只升不降與升級提示', () => {
  it('第一次達到 A1：記下 A1 與達到時間，當天顯示「已達 A1」', () => {
    const { model, record } = computeGrowth(input(learnedAndRemembered(words('a1', 7))))
    expect(record).toEqual({ key: 'local', maxRank: 1, reachedAt: NOW })
    expect(model.reachedToday).toBe('A1')
  })

  it('隔天（台北過午夜）提示消失，程度仍是 A1', () => {
    const data = learnedAndRemembered(words('a1', 7))
    const first = computeGrowth(input(data)).record
    const midnight = Date.parse('2026-10-06T16:00:00Z') // 台北 10-07 00:00
    const sameDay = computeGrowth(input({ ...data, record: first, nowMs: midnight - 1 }))
    expect(sameDay.model.reachedToday).toBe('A1')
    const nextDay = computeGrowth(input({ ...data, record: first, nowMs: midnight }))
    expect(nextDay.model.reachedToday).toBeNull()
    expect(nextDay.model.level).toBe('A1')
  })

  it('記得的字掉到 70% 以下，程度仍維持已達到的最高級；記錄不變', () => {
    const data = learnedAndRemembered(words('a1', 7))
    const record = { key: 'local' as const, maxRank: 1, reachedAt: NOW - 40 * DAY }
    const { model, record: next } = computeGrowth(input({ ...data, record, nowMs: NOW + 60 * DAY }))
    expect(model.remembered).toBe(0)
    expect(model.level).toBe('A1')
    expect(model.next).toEqual({ level: 'A2', pct: 0 })
    expect(next).toEqual(record)
  })

  it('設定改低級距也不降；起點高於記錄時程度跟著起點、不算升級提示', () => {
    const record = { key: 'local' as const, maxRank: 3, reachedAt: null }
    expect(computeGrowth(input({ placed: 'A1', record })).model.level).toBe('B1')
    const up = computeGrowth(input({ placed: 'C1', record }))
    expect(up.model.level).toBe('B2')
    expect(up.model.reachedToday).toBeNull()
    expect(up.record).toEqual({ key: 'local', maxRank: 4, reachedAt: null })
  })

  it('起點已是 A2，記得的字只讓 A1 達標：不升級、不提示', () => {
    const { model, record } = computeGrowth(
      input({ placed: 'B1', ...learnedAndRemembered(words('a1', 10)) }),
    )
    expect(model.level).toBe('A2')
    expect(model.reachedToday).toBeNull()
    expect(record).toEqual({ key: 'local', maxRank: 2, reachedAt: null })
  })

  it('跳級：A1 未達標但 B1 記得 70%，程度直接 B1', () => {
    const { model } = computeGrowth(input(learnedAndRemembered(words('b1', 7))))
    expect(model.level).toBe('B1')
    expect(model.reachedToday).toBe('B1')
  })
})
