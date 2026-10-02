// TASK-17 計分（AC#2、AC#4）。期望值為手算字面值：每級分數＝(該級勾選率 + 假字沒勾的比率) ÷ 2 × 100，≥85 掌握
import { describe, expect, it } from 'vitest'
import { scorePlacement, type PlacementItem } from './score'

const LEVELS = ['A1', 'A2', 'B1', 'B2', 'C1'] as const
type Pct = Record<(typeof LEVELS)[number], number>

// 固定題本：每級 10 個真字（a1w0…）、10 個假字（p0…）
const form: PlacementItem[] = [
  ...LEVELS.flatMap((level) =>
    Array.from({ length: 10 }, (_, i) => ({ word: `${level.toLowerCase()}w${i}`, level })),
  ),
  ...Array.from({ length: 10 }, (_, i) => ({ word: `p${i}`, level: null })),
]

/** 合成作答者：各級勾前 n 個真字、勾前 falseAlarms 個假字 */
function responder(known: Pct, falseAlarms: number): Set<string> {
  const checked = new Set<string>()
  for (const level of LEVELS)
    for (let i = 0; i < known[level]; i++) checked.add(`${level.toLowerCase()}w${i}`)
  for (let i = 0; i < falseAlarms; i++) checked.add(`p${i}`)
  return checked
}

describe('AC#2 四種合成作答者', () => {
  it('誠實 A2（A1 全會、A2 6／10、B1 2／10）→ 起點 A2', () => {
    const r = scorePlacement(form, responder({ A1: 10, A2: 6, B1: 2, B2: 0, C1: 0 }, 0))
    expect(r.levelScore).toEqual({ A1: 100, A2: 80, B1: 60, B2: 50, C1: 50 })
    expect(r.startLevel).toBe('A2')
    expect(r.retest).toBe(false)
  })

  it('誠實 B2（10／9／8／5／1）→ 起點 B2', () => {
    const r = scorePlacement(form, responder({ A1: 10, A2: 9, B1: 8, B2: 5, C1: 1 }, 0))
    expect(r.levelScore).toEqual({ A1: 100, A2: 95, B1: 90, B2: 75, C1: 55 })
    expect(r.startLevel).toBe('B2')
    expect(r.retest).toBe(false)
  })

  it('全勾灌水 → 最低級 A1，並提示重測', () => {
    const r = scorePlacement(form, new Set(form.map((i) => i.word)))
    expect(r.levelScore).toEqual({ A1: 50, A2: 50, B1: 50, B2: 50, C1: 50 })
    expect(r.falseAlarms).toBe(10)
    expect(r.startLevel).toBe('A1')
    expect(r.retest).toBe(true)
  })

  it('全不勾 → A1，不提示重測', () => {
    const r = scorePlacement(form, new Set())
    expect(r.levelScore).toEqual({ A1: 50, A2: 50, B1: 50, B2: 50, C1: 50 })
    expect(r.startLevel).toBe('A1')
    expect(r.falseAlarms).toBe(0)
    expect(r.retest).toBe(false)
  })
})

describe('計分細節', () => {
  it('勾到 1 個假字：每級降 5 分，A2 剛好 85 仍算掌握（設計 s10 範例：起點 B1）', () => {
    const r = scorePlacement(form, responder({ A1: 10, A2: 8, B1: 5, B2: 2, C1: 0 }, 1))
    expect(r.nonwordCorrect).toBe(0.9)
    expect(r.levelScore).toEqual({ A1: 95, A2: 85, B1: 70, B2: 55, C1: 45 })
    expect(r.startLevel).toBe('B1')
    expect(r.falseAlarms).toBe(1)
    expect(r.retest).toBe(false)
  })

  it('結果長條＝各級勾選率（未校正）', () => {
    const r = scorePlacement(form, responder({ A1: 10, A2: 8, B1: 5, B2: 2, C1: 0 }, 1))
    expect(r.hitRate).toEqual({ A1: 1, A2: 0.8, B1: 0.5, B2: 0.2, C1: 0 })
  })

  it('假字勾一半（5／10）不提示重測；勾 6 個提示重測且起點強制 A1', () => {
    const strong = { A1: 10, A2: 10, B1: 10, B2: 10, C1: 10 }
    const half = scorePlacement(form, responder(strong, 5))
    expect(half.levelScore.C1).toBe(75)
    expect(half.retest).toBe(false)
    expect(half.startLevel).toBe('A1')
    const six = scorePlacement(form, responder(strong, 6))
    expect(six.retest).toBe(true)
    expect(six.startLevel).toBe('A1')
  })

  it('五級都掌握 → C1', () => {
    const r = scorePlacement(form, responder({ A1: 10, A2: 10, B1: 10, B2: 10, C1: 7 }, 0))
    expect(r.levelScore.C1).toBe(85)
    expect(r.startLevel).toBe('C1')
  })

  it('逐級往上：A1 未掌握時，即使 A2 全會也從 A1 開始', () => {
    const r = scorePlacement(form, responder({ A1: 6, A2: 10, B1: 10, B2: 0, C1: 0 }, 0))
    expect(r.startLevel).toBe('A1')
  })
})
