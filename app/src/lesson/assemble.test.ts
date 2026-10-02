// @vitest-environment node
import 'fake-indexeddb/auto'
import Dexie from 'dexie'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { createDb, type LinguaDb } from '../data/db'
import { buildLessonQueue, interleave } from './assemble'
import { applyCapabilities, type Capabilities } from './capabilities'
import type { LessonItem } from './items'
import { createRegistry, defineItemType, READ_TYPES } from './queue'
import { answerStep, continueRun, settleLesson, startOrResume } from './session'
import { loadFixture } from './testFixtures'

const T = Date.parse('2026-10-02T08:00:00Z')
const LESSON = 'a1-u01-l01'
const doc = loadFixture(LESSON)

const ALL: Capabilities = { tts: true, stt: true, llmKey: true }
const NONE: Capabilities = { tts: false, stt: false, llmKey: false }

// 聽說寫的畫面還沒做（TASK-13～15）：測試用一題一步的替身登記，驗證引擎層的排列與替代
const stub = (type: LessonItem['type']) =>
  defineItemType({
    type,
    isValid: () => true,
    toSteps: (it) => [{ key: it.id, itemId: it.id, type: it.type, srsWord: null }],
  })
const FULL = createRegistry([
  ...READ_TYPES,
  ...(['listenType', 'listenChoice', 'shadowing', 'translate', 'makeSentence'] as const).map(stub),
])

const q = (n: number) => `${LESSON}-q${String(n).padStart(2, '0')}`

describe('穿插', () => {
  it('單字卡先出，其餘依聽→說→讀→寫輪流，閱讀小題相連', () => {
    const { steps } = buildLessonQueue(doc, FULL, ALL)
    expect(steps.map((s) => s.key)).toEqual([
      ...[1, 2, 3, 4, 5, 6, 7, 8].map(q),
      q(9), // 聽
      q(11), // 說
      q(13), // 讀
      q(16), // 寫
      q(10),
      q(12),
      q(14),
      q(17),
      `${q(15)}#0`,
      `${q(15)}#1`,
    ])
  })

  it('只有讀類題時：單字卡在前，選擇題與閱讀照題目檔順序', () => {
    const { steps } = buildLessonQueue(doc, createRegistry(READ_TYPES), NONE)
    expect(steps.map((s) => s.key)).toEqual([
      ...[1, 2, 3, 4, 5, 6, 7, 8].map(q),
      q(13),
      q(14),
      `${q(15)}#0`,
      `${q(15)}#1`,
    ])
  })

  it('interleave 不增減步驟', () => {
    const { steps } = buildLessonQueue(doc, FULL, ALL)
    expect(
      interleave(steps)
        .map((s) => s.key)
        .sort(),
    ).toEqual(steps.map((s) => s.key).sort())
  })
})

describe('能力替代規則', () => {
  it('不能說、能播音：跟讀改成聽音打字（同題號、欄位保留）', () => {
    const { doc: out, changes } = applyCapabilities(doc, { tts: true, stt: false, llmKey: true })
    expect(changes).toEqual([
      { itemId: q(11), from: 'shadowing', to: 'listenType' },
      { itemId: q(12), from: 'shadowing', to: 'listenType' },
    ])
    expect(out.items.find((i) => i.id === q(11))).toMatchObject({
      type: 'listenType',
      sentenceEn: 'I have a cup of tea.',
      sentenceZh: '我有一杯茶。',
    })
  })

  it('不能播音：聽類題略過；跟讀改成聽音打字後也略過', () => {
    const { doc: out, changes } = applyCapabilities(doc, { tts: false, stt: false, llmKey: true })
    expect(changes).toEqual([
      { itemId: q(9), from: 'listenType', to: 'skip' },
      { itemId: q(10), from: 'listenChoice', to: 'skip' },
      { itemId: q(11), from: 'shadowing', to: 'skip' },
      { itemId: q(12), from: 'shadowing', to: 'skip' },
    ])
    expect(out.items.map((i) => i.type)).not.toContain('listenType')
    expect(out.items.map((i) => i.type)).not.toContain('shadowing')
  })

  it('沒有金鑰：寫作題改成對照參考答案自評（規格 §6）', () => {
    const { doc: out, changes } = applyCapabilities(doc, { tts: true, stt: true, llmKey: false })
    expect(changes).toEqual([
      { itemId: q(16), from: 'translate', to: 'selfCheck' },
      { itemId: q(17), from: 'makeSentence', to: 'selfCheck' },
    ])
    expect(out.items.find((i) => i.id === q(16))).toMatchObject({
      type: 'translate',
      selfCheck: true,
    })
  })

  it('能力齊全：題目不變', () => {
    const { doc: out, changes } = applyCapabilities(doc, ALL)
    expect(changes).toEqual([])
    expect(out.items).toEqual(doc.items)
  })
})

describe('三種能力都不可用時仍能完成一課（AC#4）', () => {
  let db: LinguaDb
  let name: string
  let n = 0
  beforeEach(async () => {
    name = `assemble-test-${++n}`
    db = createDb(name)
    await db.open()
  })
  afterEach(async () => {
    db.close()
    await Dexie.delete(name)
  })

  it('引擎層：聽說略過、寫作改自評，沒有任何需要能力的題目留下', () => {
    const { steps } = buildLessonQueue(doc, FULL, NONE)
    expect(steps.map((s) => s.type)).toEqual([
      ...Array(8).fill('wordCard'),
      'mcq',
      'translate',
      'mcq',
      'makeSentence',
      'reading',
      'reading',
    ])
  })

  it('只有讀類題畫面（目前 App）：走完、結算、8 個新字入池', async () => {
    const { steps } = buildLessonQueue(doc, createRegistry(READ_TYPES), NONE)
    let { run } = await startOrResume(db, LESSON, steps, T)
    for (const [i, step] of steps.entries()) {
      run = await answerStep(db, run, step, { correct: true, elapsedMs: 3000, usedHint: false }, T)
      if (i < steps.length - 1) run = await continueRun(db, run, T)
    }
    const summary = await settleLesson(db, run, steps, { nowMs: T })
    expect(summary).toMatchObject({ lessonId: LESSON, total: 12, correct: 12 })
    expect(await db.wordPool.count()).toBe(8)
    expect(await db.courseProgress.get(LESSON)).toMatchObject({ completedAt: T })
  })
})
