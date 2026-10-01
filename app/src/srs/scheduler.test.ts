// @vitest-environment node
import { describe, expect, it } from 'vitest'
import { createScheduler, Grade, CardState, type FsrsFields, type ReviewEntry } from './scheduler'

const MIN = 60_000
const DAY = 86_400_000
const T0 = Date.parse('2026-10-01T00:00:00Z')

describe('FSRS 封裝：狀態轉換（規格 §7：學習步驟 1m／10m、重學 10m）', () => {
  const s = createScheduler()

  it('新字的初始狀態', () => {
    const c = s.newCard(T0)
    expect(c).toMatchObject({ state: CardState.New, due: T0, reps: 0, lapses: 0, lastReview: null })
  })

  it('新字答 Again → 學習中，1 分鐘後到期', () => {
    const { card } = s.review(s.newCard(T0), Grade.Again, T0)
    expect(card.state).toBe(CardState.Learning)
    expect(card.due).toBe(T0 + 1 * MIN)
  })

  it('新字答 Good → 學習中，10 分鐘後到期；再 Good → 畢業進複習，間隔 ≥ 1 天', () => {
    const step1 = s.review(s.newCard(T0), Grade.Good, T0).card
    expect(step1.state).toBe(CardState.Learning)
    expect(step1.due).toBe(T0 + 10 * MIN)

    const t1 = T0 + 10 * MIN
    const grad = s.review(step1, Grade.Good, t1).card
    expect(grad.state).toBe(CardState.Review)
    expect(grad.scheduledDays).toBeGreaterThanOrEqual(1)
    expect(grad.due).toBe(t1 + grad.scheduledDays * DAY)
    expect(grad.reps).toBe(2)
    expect(grad.lastReview).toBe(t1)
  })

  it('複習中答錯 → 重學，10 分鐘後到期、遺忘次數 +1；重學後 Good → 回到複習', () => {
    let c = s.review(s.newCard(T0), Grade.Good, T0).card
    c = s.review(c, Grade.Good, T0 + 10 * MIN).card
    const tReview = c.due
    const lapse = s.review(c, Grade.Again, tReview).card
    expect(lapse.state).toBe(CardState.Relearning)
    expect(lapse.due).toBe(tReview + 10 * MIN)
    expect(lapse.lapses).toBe(1)

    const back = s.review(lapse, Grade.Good, tReview + 10 * MIN).card
    expect(back.state).toBe(CardState.Review)
    expect(back.scheduledDays).toBeGreaterThanOrEqual(1)
  })

  it('review log 記錄作答前狀態與作答時間', () => {
    const { log } = s.review(s.newCard(T0), Grade.Good, T0)
    expect(log).toMatchObject({ rating: Grade.Good, state: CardState.New, review: T0 })
  })

  it('replay：以 review log 重播得到與逐次作答相同的卡片狀態（TASK-20 依賴）', () => {
    const logs: ReviewEntry[] = []
    let c = s.newCard(T0)
    const plan: [Grade, number][] = [
      [Grade.Good, T0],
      [Grade.Good, T0 + 10 * MIN],
      [Grade.Again, T0 + 5 * DAY],
      [Grade.Good, T0 + 5 * DAY + 10 * MIN],
      [Grade.Hard, T0 + 9 * DAY],
    ]
    for (const [g, t] of plan) {
      const r = s.review(c, g, t)
      c = r.card
      logs.push(r.log)
    }
    expect(s.replay(logs)).toEqual(c)
  })

  it('replay：沒有紀錄時回到新字', () => {
    expect(s.replay([])).toMatchObject({ state: CardState.New, reps: 0 })
  })
})

// 固定種子的 PRNG（mulberry32），讓模擬可重現
function mulberry32(seed: number) {
  return () => {
    seed |= 0
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

describe('FSRS 封裝：模擬 60 天作答的到期分布', () => {
  const s = createScheduler()
  const rand = mulberry32(20261001)
  const pickGrade = (): Grade => {
    const r = rand()
    if (r < 0.1) return Grade.Again
    if (r < 0.15) return Grade.Hard
    if (r < 0.95) return Grade.Good
    return Grade.Easy
  }

  // 100 個字：前 10 天每天引入 10 個；每天 09:00 UTC 起 2 小時內把到期的字做完
  const cards: FsrsFields[] = []
  const logs: ReviewEntry[] = []
  const control: number[] = [] // 一律答 Good 的對照字，記錄其複習間隔
  let controlCard: FsrsFields | null = null

  for (let day = 0; day < 60; day++) {
    const start = T0 + day * DAY + 9 * 60 * MIN
    const end = start + 120 * MIN
    if (day < 10) for (let i = 0; i < 10; i++) cards.push(s.newCard(start))
    if (day === 0) controlCard = s.newCard(start)

    let clock = start
    for (;;) {
      let idx = -1
      for (let i = 0; i < cards.length; i++) {
        if (cards[i].due <= end && (idx < 0 || cards[i].due < cards[idx].due)) idx = i
      }
      const ctrlDue = controlCard && controlCard.due <= end
      if (idx < 0 && !ctrlDue) break
      if (ctrlDue && (idx < 0 || controlCard!.due <= cards[idx].due)) {
        clock = Math.max(clock, controlCard!.due)
        const r = s.review(controlCard!, Grade.Good, clock)
        logs.push(r.log)
        controlCard = r.card
        if (r.card.state === CardState.Review) control.push(r.card.scheduledDays)
        continue
      }
      clock = Math.max(clock, cards[idx].due)
      const r = s.review(cards[idx], pickGrade(), clock)
      logs.push(r.log)
      cards[idx] = r.card
    }
  }

  it('所有卡片與紀錄的數值有限、無 NaN', () => {
    for (const c of cards) {
      for (const v of [c.due, c.stability, c.difficulty, c.scheduledDays, c.reps, c.lapses]) {
        expect(Number.isFinite(v)).toBe(true)
      }
    }
    for (const l of logs) {
      for (const v of [l.due, l.stability, l.difficulty, l.scheduledDays, l.review]) {
        expect(Number.isFinite(v)).toBe(true)
      }
    }
  })

  it('無負間隔：每張卡的下次到期都不早於上次作答', () => {
    for (const c of cards) {
      expect(c.lastReview).not.toBeNull()
      expect(c.due).toBeGreaterThanOrEqual(c.lastReview!)
      expect(c.scheduledDays).toBeGreaterThanOrEqual(0)
    }
  })

  it('一律答 Good 的字，複習間隔逐次拉長', () => {
    expect(control.length).toBeGreaterThanOrEqual(3)
    for (let i = 1; i < control.length; i++) expect(control[i]).toBeGreaterThan(control[i - 1])
  })

  it('到期日分散，不擠在同一天', () => {
    const days = new Set(
      cards.filter((c) => c.state === CardState.Review).map((c) => Math.floor(c.due / DAY)),
    )
    expect(days.size).toBeGreaterThanOrEqual(10)
  })
})
