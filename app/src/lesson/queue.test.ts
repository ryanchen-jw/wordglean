// @vitest-environment node
import { describe, expect, it } from 'vitest'
import type { LessonItemsDoc, WordCardItem } from './items'
import {
  buildQueue,
  createRegistry,
  defineItemType,
  firstSense,
  LISTEN_TYPES,
  READ_TYPES,
  SPEAK_TYPES,
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
      expect(the.choice?.options[the.choice.answer]).toBe('那個、這個')
      expect([...(the.choice?.options ?? [])].sort()).toEqual(
        ['那個、這個', '和、以及', '在⋯裡面', '有、擁有'].sort(),
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

describe('跟讀題型（TASK-14）', () => {
  const doc = (items: LessonItemsDoc['items']): LessonItemsDoc => ({
    schemaVersion: 1,
    lessonId: 'x',
    level: 'a1',
    items,
  })
  const registry = createRegistry([...READ_TYPES, ...SPEAK_TYPES])

  it('一題一步、只計分不寫 FSRS（srsWord＝null）、沒有選項', () => {
    const { steps, skipped } = buildQueue(
      doc([
        {
          id: 's1',
          type: 'shadowing',
          sentenceEn: 'I have a cup of tea.',
          sentenceZh: '我有一杯茶。',
        },
      ]),
      registry,
    )
    expect(skipped).toEqual([])
    expect(steps).toEqual<Step[]>([{ key: 's1', itemId: 's1', type: 'shadowing', srsWord: null }])
  })

  it('目標句空白或沒有任何英數字＝欄位不全，略過', () => {
    const { steps, skipped } = buildQueue(
      doc([
        { id: 's1', type: 'shadowing', sentenceEn: '  ', sentenceZh: '' },
        { id: 's2', type: 'shadowing', sentenceEn: '…?', sentenceZh: '' },
      ]),
      registry,
    )
    expect(steps).toEqual([])
    expect(skipped).toEqual([
      { itemId: 's1', type: 'shadowing', reason: 'invalid' },
      { itemId: 's2', type: 'shadowing', reason: 'invalid' },
    ])
  })

  it('樣本課 A1：兩題跟讀接在單字卡之後，整課 14 步', () => {
    const { steps } = buildQueue(loadFixture('a1-u01-l01'), registry)
    expect(steps).toHaveLength(14)
    expect(steps.slice(8, 10).map((s) => [s.key, s.type])).toEqual([
      ['a1-u01-l01-q11', 'shadowing'],
      ['a1-u01-l01-q12', 'shadowing'],
    ])
  })
})

describe('單字卡選項只顯示第一義（TASK-9 格式洩題）', () => {
  it('firstSense：全形分號切第一段、半形不切、去前後空白', () => {
    expect(firstSense('會議')).toBe('會議')
    expect(firstSense('是；保持（某種狀態）')).toBe('是')
    expect(firstSense('河; 江')).toBe('河; 江')
    expect(firstSense('  是 ；保持 ')).toBe('是')
  })

  it('firstSense：去掉全形括號註記（含括號本身）', () => {
    expect(firstSense('在（某時間或地點）')).toBe('在')
    expect(firstSense('電梯（英式）；舉起')).toBe('電梯')
    expect(firstSense('一個、一（個）')).toBe('一個、一')
  })

  it('firstSense：整段都是括號時保留原文', () => {
    expect(firstSense('（英式）')).toBe('（英式）')
    expect(firstSense('（口語）；很酷')).toBe('（口語）')
  })

  it('小課：干擾項的括號一併去除', () => {
    const { options, answer } = buildQueue(
      doc('在（某時間或地點）', ['從（某處）', '往、到', '和（某人）一起']),
      readRegistry,
    ).steps[0].choice!
    expect([...options].sort()).toEqual(['在', '從', '往、到', '和一起'].sort())
    expect(options[answer]).toBe('在')
  })

  const doc = (glossZh: string, distractorsZh: string[]): LessonItemsDoc => ({
    schemaVersion: 1,
    lessonId: 'a1-u01-l01',
    level: 'A1',
    items: [
      {
        id: 'a1-u01-l01-q02',
        type: 'wordCard',
        word: 'be',
        exampleEn: 'Be quiet.',
        exampleZh: '安靜。',
        glossZh,
        distractorsZh,
      },
    ],
  })

  it('小課：正解兩義並列、干擾項單義——四個選項都不含「；」，正解為第一義', () => {
    const { options, answer } = buildQueue(
      doc('是；保持（某種狀態）', ['去', '有', '給']),
      readRegistry,
    ).steps[0].choice!
    expect(options.filter((o) => o.includes('；'))).toEqual([])
    expect(options[answer]).toBe('是')
  })

  it('小課：干擾項含「；」也只取第一段', () => {
    const { options } = buildQueue(doc('是', ['去；走', '有', '給']), readRegistry).steps[0].choice!
    expect([...options].sort()).toEqual(['去', '是', '有', '給'].sort())
  })

  it('小課：取第一義後選項重複＝不合格', () => {
    const bad = doc('是；保持', ['是；存在', '有', '給'])
    expect(buildQueue(bad, readRegistry).skipped[0].reason).toBe('invalid')
  })
})
