// @vitest-environment node
import { describe, expect, it } from 'vitest'
import { buildLessonQueue } from './assemble'
import type { Capabilities } from './capabilities'
import type { WordCardItem } from './items'
import { matchingGroups, matchingOrder, matchingStep, withMatching } from './matching'
import { createRegistry, READ_TYPES } from './queue'
import { loadFixture } from './testFixtures'

const LESSON = 'a1-u01-l01'
const doc = loadFixture(LESSON)
const NONE: Capabilities = { tts: false, stt: false, llmKey: false }
const q = (n: number) => `${LESSON}-q${String(n).padStart(2, '0')}`

const card = (n: number, word: string, glossZh: string): WordCardItem => ({
  id: `c${n}`,
  type: 'wordCard',
  word,
  exampleEn: '',
  exampleZh: '',
  glossZh,
  distractorsZh: ['甲', '乙', '丙'],
})

describe('配對分組（創辦人 2026-10-05 裁示一）', () => {
  it('每 4 個字一組，插在第 4 個字之後', () => {
    expect(matchingGroups(8, { fill: true })).toEqual([
      { after: 3, members: [0, 1, 2, 3] },
      { after: 7, members: [4, 5, 6, 7] },
    ])
  })

  it('小課：最後不足 4 個字時，用前面的字補滿 4 個', () => {
    expect(matchingGroups(6, { fill: true })).toEqual([
      { after: 3, members: [0, 1, 2, 3] },
      { after: 5, members: [2, 3, 4, 5] },
    ])
  })

  it('複習：不足 4 個字的那一段不出配對', () => {
    expect(matchingGroups(6, { fill: false })).toEqual([{ after: 3, members: [0, 1, 2, 3] }])
  })

  it('全部不足 4 個字：不出配對', () => {
    expect(matchingGroups(3, { fill: true })).toEqual([])
    expect(matchingGroups(0, { fill: true })).toEqual([])
  })
})

describe('配對步驟', () => {
  it('中文用第一義、不寫 FSRS', () => {
    const step = matchingStep('matching#1', [
      card(1, 'the', '那個、這個（指特定的人事物）'),
      card(2, 'be', '是；保持（某種狀態）'),
      card(3, 'and', '和、以及'),
      card(4, 'of', '…的'),
    ])
    expect(step).toEqual({
      key: 'matching#1',
      itemId: 'c1',
      type: 'matching',
      srsWord: null,
      pairs: [
        { word: 'the', gloss: '那個、這個' },
        { word: 'be', gloss: '是' },
        { word: 'and', gloss: '和、以及' },
        { word: 'of', gloss: '…的' },
      ],
    })
  })

  it('片語卡（TASK-24）：英文整串、中文取片語第一義（題庫第一義＝片語表第一義，PHRASE_GLOSS 守住）', () => {
    const step = matchingStep('matching#1', [
      card(1, 'give up', '放棄'),
      card(2, 'pick up', '撿起；接（人）'),
      card(3, 'look after', '照顧'),
      card(4, 'take care of', '照顧；處理'),
    ])
    expect(step.pairs).toEqual([
      { word: 'give up', gloss: '放棄' },
      { word: 'pick up', gloss: '撿起' },
      { word: 'look after', gloss: '照顧' },
      { word: 'take care of', gloss: '照顧' },
    ])
  })

  it('中文排列固定（續作不變），是四個 pair 的重排', () => {
    const step = matchingStep('matching#1', [
      card(1, 'a', '一'),
      card(2, 'b', '二'),
      card(3, 'c', '三'),
      card(4, 'd', '四'),
    ])
    const order = matchingOrder(step)
    expect([...order].sort()).toEqual([0, 1, 2, 3])
    expect(matchingOrder(step)).toEqual(order)
  })
})

describe('小課插入配對', () => {
  it('8 張單字卡：第 4 張與第 8 張之後各一題配對，其餘順序不變', () => {
    const { steps, doc: applied } = buildLessonQueue(doc, createRegistry(READ_TYPES), NONE)
    const out = withMatching(steps, applied)
    expect(out.map((s) => s.key)).toEqual([
      ...[1, 2, 3, 4].map(q),
      'matching#1',
      ...[5, 6, 7, 8].map(q),
      'matching#2',
      q(13),
      q(14),
      `${q(15)}#0`,
      `${q(15)}#1`,
    ])
    expect(out[4].pairs!.map((p) => p.word)).toEqual(['the', 'be', 'and', 'of'])
    expect(out.filter((s) => s.type === 'matching').every((s) => s.srsWord === null)).toBe(true)
  })

  it('不足 4 張單字卡：不出配對', () => {
    const small = {
      ...doc,
      items: doc.items.filter((it) => it.type !== 'wordCard' || ['the', 'be'].includes(it.word)),
    }
    const { steps, doc: applied } = buildLessonQueue(small, createRegistry(READ_TYPES), NONE)
    expect(withMatching(steps, applied).some((s) => s.type === 'matching')).toBe(false)
  })
})
