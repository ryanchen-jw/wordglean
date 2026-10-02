// @vitest-environment node
import { describe, expect, it } from 'vitest'
import type { LessonItemsDoc, WordCardItem } from './items'
import {
  buildQueue,
  createRegistry,
  defineItemType,
  LISTEN_TYPES,
  READ_TYPES,
  type Step,
} from './queue'
import { loadFixture } from './testFixtures'

const readRegistry = createRegistry(READ_TYPES)

describe('題目佇列（AC#1）', () => {
  it('A1 樣本課：讀類 8 張單字卡＋2 選擇題＋閱讀 2 小題＝12 步，依題目檔順序', () => {
    const { steps } = buildQueue(loadFixture('a1-u01-l01'), readRegistry)
    expect(steps.map((s) => s.key)).toEqual([
      'a1-u01-l01-q01',
      'a1-u01-l01-q02',
      'a1-u01-l01-q03',
      'a1-u01-l01-q04',
      'a1-u01-l01-q05',
      'a1-u01-l01-q06',
      'a1-u01-l01-q07',
      'a1-u01-l01-q08',
      'a1-u01-l01-q13',
      'a1-u01-l01-q14',
      'a1-u01-l01-q15#0',
      'a1-u01-l01-q15#1',
    ])
  })

  it('B1 樣本課：9 張單字卡＋2 選擇題＋閱讀 2 小題＝13 步', () => {
    const { steps } = buildQueue(loadFixture('b1-u01-l01'), readRegistry)
    expect(steps).toHaveLength(13)
    expect(steps.filter((s) => s.type === 'wordCard')).toHaveLength(9)
  })

  it('聽說寫題型未登記：略過並逐題回報', () => {
    const { skipped } = buildQueue(loadFixture('a1-u01-l01'), readRegistry)
    expect(skipped).toEqual([
      { itemId: 'a1-u01-l01-q09', type: 'listenType', reason: 'unsupported' },
      { itemId: 'a1-u01-l01-q10', type: 'listenChoice', reason: 'unsupported' },
      { itemId: 'a1-u01-l01-q11', type: 'shadowing', reason: 'unsupported' },
      { itemId: 'a1-u01-l01-q12', type: 'shadowing', reason: 'unsupported' },
      { itemId: 'a1-u01-l01-q16', type: 'translate', reason: 'unsupported' },
      { itemId: 'a1-u01-l01-q17', type: 'makeSentence', reason: 'unsupported' },
    ])
  })

  it('只有單字卡帶 FSRS 字（D2）；選擇題與閱讀只計分', () => {
    const { steps } = buildQueue(loadFixture('a1-u01-l01'), readRegistry)
    expect(steps.flatMap((s) => (s.srsWord ? [s.srsWord] : []))).toEqual([
      'the',
      'be',
      'and',
      'of',
      'a',
      'in',
      'to',
      'have',
    ])
    expect(steps.filter((s) => s.type !== 'wordCard').every((s) => s.srsWord === null)).toBe(true)
  })

  it('選擇題與閱讀小題的正解索引照題目檔', () => {
    const { steps } = buildQueue(loadFixture('a1-u01-l01'), readRegistry)
    const byKey = (k: string) => steps.find((s) => s.key === k) as Step
    expect(byKey('a1-u01-l01-q13').choice).toEqual({
      options: ['of', 'in', 'to', 'and'],
      answer: 0,
    })
    expect(byKey('a1-u01-l01-q14').choice?.answer).toBe(1)
    expect(byKey('a1-u01-l01-q15#0')).toMatchObject({
      questionIndex: 0,
      choice: { options: ['一個', '兩個', '三個'], answer: 1 },
    })
    expect(byKey('a1-u01-l01-q15#1')).toMatchObject({
      questionIndex: 1,
      choice: { options: ['在學校', '在公園', '在家裡'], answer: 2 },
    })
  })

  describe('單字卡四選一', () => {
    const cards = [
      ...buildQueue(loadFixture('a1-u01-l01'), readRegistry).steps,
      ...buildQueue(loadFixture('b1-u01-l01'), readRegistry).steps,
    ].filter((s) => s.type === 'wordCard')

    it('正解位置上是本課釋義，其餘三個是干擾項', () => {
      const the = cards[0]
      expect(the.choice?.options).toHaveLength(4)
      expect(the.choice?.options[the.choice.answer]).toBe('那個、這個（指特定的人事物）')
      expect([...(the.choice?.options ?? [])].sort()).toEqual(
        ['那個、這個（指特定的人事物）', '和、以及', '在⋯裡面', '有、擁有'].sort(),
      )
    })

    it('同一題每次產生的選項順序相同（續作不變）', () => {
      const again = buildQueue(loadFixture('a1-u01-l01'), readRegistry).steps
      expect(again[0].choice).toEqual(cards[0].choice)
    })

    it('正解不會固定在同一個位置', () => {
      expect(new Set(cards.map((c) => c.choice?.answer)).size).toBeGreaterThan(1)
    })
  })

  describe('欄位不全的題目略過（reason invalid）', () => {
    const doc = (item: Partial<WordCardItem>): LessonItemsDoc => ({
      schemaVersion: 1,
      lessonId: 'a1-u01-l01',
      level: 'A1',
      items: [
        {
          id: 'a1-u01-l01-q01',
          type: 'wordCard',
          word: 'the',
          exampleEn: 'The cat is on the bed.',
          exampleZh: '那隻貓在床上。',
          ...item,
        } as WordCardItem,
      ],
    })

    it('舊格式單字卡（沒有 glossZh／distractorsZh）', () => {
      expect(buildQueue(doc({}), readRegistry)).toEqual({
        steps: [],
        skipped: [{ itemId: 'a1-u01-l01-q01', type: 'wordCard', reason: 'invalid' }],
      })
    })

    it('干擾項與正確釋義重複', () => {
      const bad = doc({ glossZh: '那個', distractorsZh: ['那個', '和', '有'] })
      expect(buildQueue(bad, readRegistry).skipped[0].reason).toBe('invalid')
    })

    it('干擾項不是 3 個', () => {
      const bad = doc({ glossZh: '那個', distractorsZh: ['和', '有'] })
      expect(buildQueue(bad, readRegistry).skipped[0].reason).toBe('invalid')
    })
  })

  describe('聽類兩題型（TASK-13）', () => {
    const listenRegistry = createRegistry([...READ_TYPES, ...LISTEN_TYPES])

    it('A1 樣本課：聽音打字、聽音選答各 1 步，插在單字卡與選擇題之間＝14 步', () => {
      const { steps, skipped } = buildQueue(loadFixture('a1-u01-l01'), listenRegistry)
      expect(steps).toHaveLength(14)
      expect(steps.slice(8, 10)).toEqual([
        { key: 'a1-u01-l01-q09', itemId: 'a1-u01-l01-q09', type: 'listenType', srsWord: null },
        {
          key: 'a1-u01-l01-q10',
          itemId: 'a1-u01-l01-q10',
          type: 'listenChoice',
          srsWord: null,
          choice: { options: ['A dog and a cat', 'Two dogs', 'A cat and a bird'], answer: 0 },
        },
      ])
      expect(skipped.map((s) => s.type)).toEqual([
        'shadowing',
        'shadowing',
        'translate',
        'makeSentence',
      ])
    })

    it('欄位不全的聽題略過（invalid）', () => {
      const bad = (item: Record<string, unknown>): LessonItemsDoc => ({
        schemaVersion: 1,
        lessonId: 'x',
        level: 'A1',
        items: [item as unknown as LessonItemsDoc['items'][number]],
      })
      const reasons = [
        { id: 'a', type: 'listenType', sentenceEn: ' ', sentenceZh: '空' },
        {
          id: 'b',
          type: 'listenChoice',
          audioEn: 'Hi.',
          audioZh: '嗨',
          questionZh: '？',
          options: ['A', 'B'],
          answer: 2,
        },
        {
          id: 'c',
          type: 'listenChoice',
          audioEn: '',
          audioZh: '',
          questionZh: '？',
          options: ['A', 'B'],
          answer: 0,
        },
      ].map((it) => buildQueue(bad(it), listenRegistry).skipped[0]?.reason)
      expect(reasons).toEqual(['invalid', 'invalid', 'invalid'])
    })
  })

  it('可登記新題型（TASK-13～15 接入方式）', () => {
    const listenType = defineItemType({
      type: 'listenType',
      isValid: () => true,
      toSteps: (it) => [{ key: it.id, itemId: it.id, type: 'listenType', srsWord: null }],
    })
    const { steps, skipped } = buildQueue(
      loadFixture('a1-u01-l01'),
      createRegistry([...READ_TYPES, listenType]),
    )
    expect(steps.map((s) => s.key)).toContain('a1-u01-l01-q09')
    expect(skipped.map((s) => s.itemId)).not.toContain('a1-u01-l01-q09')
  })
})
