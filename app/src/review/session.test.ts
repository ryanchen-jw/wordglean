// @vitest-environment node
import 'fake-indexeddb/auto'
import Dexie from 'dexie'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { createDb, type LinguaDb } from '../data/db'
import { addFavorite, addFromCourse } from '../data/repo'
import type { LexIndex, LexInfo } from '../dict/lexicon'
import type { LessonItemsDoc } from '../lesson/items'
import { loadFixture } from '../lesson/testFixtures'
import { answerReview, lessonWordCards, loadReviewCards } from './session'

const T = Date.parse('2026-10-02T08:00:00Z')
const L1 = 'a1-u01-l01'
const L2 = 'a1-u01-l02'

const docs: Record<string, LessonItemsDoc> = { [L1]: loadFixture(L1), [L2]: loadFixture(L2) }
let loads: string[]
const loadItems = async (id: string) => {
  loads.push(id)
  return docs[id] ?? null
}

let db: LinguaDb
let name: string
let n = 0
beforeEach(async () => {
  name = `review-test-${++n}`
  db = createDb(name)
  await db.open()
  loads = []
})
afterEach(async () => {
  db.close()
  await Dexie.delete(name)
})

describe('loadReviewCards', () => {
  it('依字的課程來源取原課單字卡，順序照傳入的字', async () => {
    await addFromCourse(db, 'it', L2, T)
    await addFromCourse(db, 'have', L1, T)
    const { cards, missing } = await loadReviewCards(db, ['have', 'it'], loadItems)
    expect(missing).toEqual([])
    expect(cards.map((c) => [c.wordId, c.item.id, c.item.glossZh])).toEqual([
      ['have', `${L1}-q08`, '有、擁有'],
      ['it', `${L2}-q01`, '它（指物或動物）'],
    ])
    expect(cards[0].step).toMatchObject({ key: `${L1}-q08`, type: 'wordCard', srsWord: 'have' })
    expect(cards[0].step.choice?.options).toHaveLength(4)
  })

  it('同一課只載入一次', async () => {
    await addFromCourse(db, 'the', L1, T)
    await addFromCourse(db, 'and', L1, T)
    await loadReviewCards(db, ['the', 'and'], loadItems)
    expect(loads).toEqual([L1])
  })

  it('來源課沒有這個字的單字卡、題目檔不存在、或不在池中：列入 missing，不出題', async () => {
    await addFromCourse(db, 'cup', L1, T) // l01 沒有 cup 的單字卡
    await addFromCourse(db, 'dog', 'a1-u09-l09', T) // 沒有題目檔
    const { cards, missing } = await loadReviewCards(db, ['cup', 'dog', 'ghost'], loadItems)
    expect(cards).toEqual([])
    expect(missing).toEqual(['cup', 'dog', 'ghost'])
  })

  it('第一個來源找不到時改找下一個來源', async () => {
    await addFromCourse(db, 'it', 'a1-u09-l09', T)
    await addFromCourse(db, 'it', L2, T)
    const { cards } = await loadReviewCards(db, ['it'], loadItems)
    expect(cards.map((c) => c.item.id)).toEqual([`${L2}-q01`])
  })
})

describe('lessonWordCards（再複習一次剛學的字）', () => {
  it('取本課的單字卡，照題目檔順序', () => {
    expect(lessonWordCards(docs[L1]).map((c) => c.wordId)).toEqual([
      'the',
      'be',
      'and',
      'of',
      'a',
      'in',
      'to',
      'have',
    ])
  })
})

describe('answerReview', () => {
  const input = { correct: false, elapsedMs: 3000, usedHint: false }

  it('正式複習：記一筆評分（答錯＝Again），課程來源不變、不寫小課進度', async () => {
    await addFromCourse(db, 'have', L1, T)
    const { cards } = await loadReviewCards(db, ['have'], loadItems)
    const grade = await answerReview(db, cards[0], input, T + 1000, { practice: false })
    expect(grade).toBe(1)
    const logs = await db.reviewLogs.toArray()
    expect(logs).toHaveLength(1)
    expect(logs[0]).toMatchObject({ wordId: 'have', rating: 1, review: T + 1000 })
    expect((await db.wordPool.get('have'))?.courseRefs).toEqual([L1])
    expect(await db.lessonRuns.count()).toBe(0)
  })

  it('練習（D5）：不寫任何資料', async () => {
    await addFromCourse(db, 'have', L1, T)
    const before = await db.wordPool.get('have')
    const outbox = await db.outbox.count()
    const card = lessonWordCards(docs[L1]).find((c) => c.wordId === 'have')!
    const grade = await answerReview(
      db,
      card,
      { correct: true, elapsedMs: 3000, usedHint: false },
      T + 1000,
      { practice: true },
    )
    expect(grade).toBe(3)
    expect(await db.reviewLogs.count()).toBe(0)
    expect(await db.wordPool.get('have')).toEqual(before)
    expect(await db.outbox.count()).toBe(outbox)
  })
})

describe('收藏字的複習卡（沒有課程來源，TASK-16 併入後）', () => {
  const info = (cefr: LexInfo['cefr'], glossZh: string | null): LexInfo => ({
    cefr,
    toeic: false,
    freqRank: null,
    glossZh,
  })
  // 單字總表的中文第一段是詞性；選項去掉詞性，干擾項取同級、同詞性的字
  const lex: LexIndex = new Map([
    ['river', info('A1', 'n. 河, 江')],
    ['stone', info('A1', 'n. 石頭, 寶石⋯')],
    ['tree', info('A1', 'n. 樹')],
    ['cat', info('A1', 'n. 貓')],
    ['run', info('A1', 'v. 跑')],
    ['lake', info('A2', 'n. 湖')],
    ['jump', info('A1', 'v. 跳')],
    ['ghostword', info('A1', null)],
  ])
  let lexLoads = 0
  const loadLex = async () => {
    lexLoads++
    return lex
  }
  beforeEach(() => {
    lexLoads = 0
  })

  it('中文取單字總表（去掉詞性），3 個干擾項取同級同詞性，順序固定', async () => {
    await addFavorite(db, 'river', T)
    const first = await loadReviewCards(db, ['river'], loadItems, loadLex)
    expect(first.missing).toEqual([])
    const card = first.cards[0]
    expect(card.wordId).toBe('river')
    expect(card.item).toMatchObject({ word: 'river', glossZh: '河, 江', exampleEn: '' })
    expect([...card.item.distractorsZh].sort()).toEqual(['石頭, 寶石⋯', '樹', '貓'].sort())
    expect(card.step).toMatchObject({ type: 'wordCard', srsWord: 'river' })
    const again = await loadReviewCards(db, ['river'], loadItems, loadLex)
    expect(again.cards[0].step.choice).toEqual(card.step.choice)
  })

  it('同級同詞性不足 3 個時，用同級其他詞性補', async () => {
    await addFavorite(db, 'run', T)
    const { cards } = await loadReviewCards(db, ['run'], loadItems, loadLex)
    expect(cards[0].item.distractorsZh).toHaveLength(3)
    expect(cards[0].item.distractorsZh).toContain('跳')
    expect(cards[0].item.distractorsZh).not.toContain('跑')
  })

  it('單字總表沒有中文：列入 missing', async () => {
    await addFavorite(db, 'ghostword', T)
    await addFavorite(db, 'zzz', T)
    const { cards, missing } = await loadReviewCards(db, ['ghostword', 'zzz'], loadItems, loadLex)
    expect(cards).toEqual([])
    expect(missing).toEqual(['ghostword', 'zzz'])
  })

  it('全是課程字時不載入單字總表；課程卡優先於收藏卡', async () => {
    await addFromCourse(db, 'have', L1, T)
    await addFavorite(db, 'have', T)
    const { cards } = await loadReviewCards(db, ['have'], loadItems, loadLex)
    expect(cards[0].item.id).toBe(`${L1}-q08`)
    expect(lexLoads).toBe(0)
  })
})
