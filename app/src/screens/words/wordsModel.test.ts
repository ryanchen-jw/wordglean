import { describe, expect, it } from 'vitest'
import type { PoolWord } from '../../data/db'
import { CardState } from '../../srs/scheduler'
import { dueLabel, familiarityOf, filterWords, type WordFilter } from './wordsModel'

const at = (iso: string) => Date.parse(iso)
// 台北 2026-10-01 16:00；當地今天結束於 10-01T16:00Z
const NOW = at('2026-10-01T08:00:00Z')
const TZ = 'Asia/Taipei'

const w = (wordId: string, p: Partial<PoolWord> = {}): PoolWord => ({
  wordId,
  state: CardState.Review,
  due: NOW,
  stability: 5,
  difficulty: 5,
  scheduledDays: 5,
  learningSteps: 0,
  reps: 3,
  lapses: 0,
  lastReview: null,
  courseRefs: [],
  favoritedAt: null,
  addedAt: 0,
  ...p,
})

describe('familiarityOf（D6）', () => {
  it('新字與重學中＝陌生', () => {
    expect(familiarityOf({ state: CardState.New, stability: 0 })).toBe('new')
    expect(familiarityOf({ state: CardState.Relearning, stability: 30 })).toBe('new')
  })
  it('複習中且穩定度 ≥21 天＝熟悉；20.9 天仍是學習中', () => {
    expect(familiarityOf({ state: CardState.Review, stability: 21 })).toBe('familiar')
    expect(familiarityOf({ state: CardState.Review, stability: 20.9 })).toBe('learning')
  })
  it('學習步驟中＝學習中（即使穩定度高）', () => {
    expect(familiarityOf({ state: CardState.Learning, stability: 40 })).toBe('learning')
  })
})

describe('filterWords', () => {
  const words = [
    w('postpone', { due: at('2026-10-04T00:00:00Z') }),
    w('meeting', { due: at('2026-10-01T07:00:00Z') }),
    w('reschedule', { due: at('2026-10-13T00:00:00Z'), favoritedAt: 1, stability: 30 }),
    w('agenda', { state: CardState.New, due: 0, addedAt: 5 }),
    w('attendee', { state: CardState.New, due: 0, addedAt: 2, favoritedAt: 3 }),
  ]
  const f = (p: Partial<WordFilter>): string[] =>
    filterWords(words, { scope: 'all', familiarity: 'all', query: '', ...p }, NOW).map(
      (x) => x.wordId,
    )

  it('全部：依到期時間排序，新字依加入時間排最後', () => {
    expect(f({})).toEqual(['meeting', 'postpone', 'reschedule', 'attendee', 'agenda'])
  })
  it('到期：只有已到期且已開始學的字', () => {
    expect(f({ scope: 'due' })).toEqual(['meeting'])
  })
  it('收藏', () => {
    expect(f({ scope: 'favorite' })).toEqual(['reschedule', 'attendee'])
  })
  it('熟悉度與範圍可疊加', () => {
    expect(f({ familiarity: 'familiar' })).toEqual(['reschedule'])
    expect(f({ scope: 'favorite', familiarity: 'new' })).toEqual(['attendee'])
  })
  it('搜尋英文：不分大小寫、比對字中任一段', () => {
    expect(f({ query: ' EDU ' })).toEqual(['reschedule'])
    expect(f({ query: 'zzz' })).toEqual([])
  })
})

describe('dueLabel（依裝置時區算日數）', () => {
  const label = (due: string, state: CardState = CardState.Review) =>
    dueLabel({ state, due: at(due) }, NOW, TZ)

  it('已過期與今天稍晚到期都是「今天到期」', () => {
    expect(label('2026-09-20T00:00:00Z')).toBe('今天到期')
    expect(label('2026-10-01T15:59:00Z')).toBe('今天到期')
  })
  it('台北隔天 00:00 起算 1 天後', () => {
    expect(label('2026-10-01T16:00:00Z')).toBe('1 天後')
    expect(label('2026-10-04T00:00:00Z')).toBe('3 天後')
    expect(label('2026-10-30T00:00:00Z')).toBe('29 天後')
  })
  it('30 天起以月計、365 天起以年計', () => {
    expect(label('2026-10-31T00:00:00Z')).toBe('1 個月後')
    expect(label('2027-09-30T00:00:00Z')).toBe('12 個月後')
    expect(label('2027-10-01T00:00:00Z')).toBe('1 年後')
  })
  it('新字標「新字」', () => {
    expect(label('2026-09-20T00:00:00Z', CardState.New)).toBe('新字')
  })
})
