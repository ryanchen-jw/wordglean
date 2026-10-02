// TASK-17 抽題（drawForm）＋以正式題本跑合成作答者（AC#2 整合）
import { describe, expect, it } from 'vitest'
import bank from '../../../content/placement/placement.json'
import { drawForm, type PlacementBank } from './form'
import { scorePlacement, type PlacementItem } from './score'

const LEVELS = ['A1', 'A2', 'B1', 'B2', 'C1'] as const

// 固定種子亂數（測試用，結果可重現）
function seeded(seed: number) {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6d2b79f5) >>> 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const typedBank = bank as PlacementBank

describe('drawForm', () => {
  const form = drawForm(typedBank, seeded(1))

  it('60 題：A1–C1 各 10 個真字（取自該級候選）＋10 個假字（取自假字池），不重複', () => {
    expect(form).toHaveLength(60)
    expect(new Set(form.map((i) => i.word)).size).toBe(60)
    for (const level of LEVELS) {
      const items = form.filter((i) => i.level === level)
      expect(items).toHaveLength(10)
      for (const i of items) expect(typedBank.levels[level]).toContain(i.word)
    }
    const pseudo = form.filter((i) => i.level === null)
    expect(pseudo).toHaveLength(10)
    for (const i of pseudo) expect(typedBank.pseudowords).toContain(i.word)
  })

  it('打散：前 12 題（第一組）不會全是同一級', () => {
    expect(new Set(form.slice(0, 12).map((i) => i.level)).size).toBeGreaterThan(1)
  })

  it('不同亂數抽到不同題（重測換題）', () => {
    const other = drawForm(typedBank, seeded(2))
    expect(other.map((i) => i.word)).not.toEqual(form.map((i) => i.word))
  })
})

describe('AC#2 正式題本＋合成作答者', () => {
  // 各級認識前 n 個出現的字；false alarm 數另給
  function answer(form: PlacementItem[], known: Record<string, number>, falseAlarms: number) {
    const seen: Record<string, number> = {}
    const checked = new Set<string>()
    for (const { word, level } of form) {
      const key = level ?? 'pseudo'
      seen[key] = (seen[key] ?? 0) + 1
      const limit = level ? known[level] : falseAlarms
      if (seen[key] <= limit) checked.add(word)
    }
    return checked
  }

  for (const seed of [1, 2, 3]) {
    const form = drawForm(typedBank, seeded(seed))
    it(`種子 ${seed}：誠實 A2→A2、誠實 B2→B2、全勾→A1＋重測、全不勾→A1`, () => {
      const a2 = scorePlacement(form, answer(form, { A1: 10, A2: 6, B1: 2, B2: 0, C1: 0 }, 0))
      expect(a2.startLevel).toBe('A2')
      const b2 = scorePlacement(form, answer(form, { A1: 10, A2: 9, B1: 8, B2: 5, C1: 1 }, 0))
      expect(b2.startLevel).toBe('B2')
      const all = scorePlacement(form, new Set(form.map((i) => i.word)))
      expect([all.startLevel, all.retest]).toEqual(['A1', true])
      const none = scorePlacement(form, new Set())
      expect([none.startLevel, none.retest]).toEqual(['A1', false])
    })
  }
})
