// @vitest-environment node
import 'fake-indexeddb/auto'
import Dexie from 'dexie'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { createDb, type LinguaDb } from '../data/db'
import { buildQueue, createRegistry, READ_TYPES, type Step } from './queue'
import { activeKey, type LessonRun } from './run'
import { answerRetry, answerStep, continueRun, settleLesson, startOrResume } from './session'
import { loadFixture } from './testFixtures'

const T = Date.parse('2026-10-02T08:00:00Z')
const SEC = 1000
const LESSON = 'a1-u01-l01'
const { steps: STEPS } = buildQueue(loadFixture(LESSON), createRegistry(READ_TYPES))

let db: LinguaDb
let name: string
let n = 0
beforeEach(async () => {
  name = `lesson-test-${++n}`
  db = createDb(name)
  await db.open()
})
afterEach(async () => {
  db.close()
  await Dexie.delete(name)
})

async function answerAndContinue(run: LessonRun, step: Step, correct: boolean, now: number) {
  const input = { correct, elapsedMs: 3 * SEC, usedHint: false }
  const answered = await answerStep(db, run, step, input, now)
  return isLast(step) ? answered : continueRun(db, answered, now + 1)
}
const isLast = (step: Step) => step.key === STEPS[STEPS.length - 1].key

describe('FSRS 寫入（AC#1）', () => {
  it('單字卡答對：新字入池（來源＝本課）並記一筆 Good', async () => {
    const { run } = await startOrResume(db, LESSON, STEPS, T)
    await answerStep(db, run, STEPS[0], { correct: true, elapsedMs: 3 * SEC, usedHint: false }, T)
    expect(await db.wordPool.get('the')).toMatchObject({ courseRefs: [LESSON], addedAt: T })
    const logs = await db.reviewLogs.toArray()
    expect(logs).toHaveLength(1)
    expect(logs[0]).toMatchObject({ wordId: 'the', rating: 3, state: 0, review: T })
  })

  it.each([
    ['答錯', { correct: false, elapsedMs: 3 * SEC, usedHint: false }, 1],
    ['答對但超過 15 秒', { correct: true, elapsedMs: 15 * SEC + 1, usedHint: false }, 2],
    ['答對但看了例句提示', { correct: true, elapsedMs: 3 * SEC, usedHint: true }, 2],
    ['答對、剛好 15 秒', { correct: true, elapsedMs: 15 * SEC, usedHint: false }, 3],
  ])('單字卡%s', async (_, input, rating) => {
    const { run } = await startOrResume(db, LESSON, STEPS, T)
    await answerStep(db, run, STEPS[0], input, T)
    expect((await db.reviewLogs.toArray()).map((l) => l.rating)).toEqual([rating])
  })

  it('選擇題、閱讀只計分：不入池、不寫評分', async () => {
    const mcqAt = STEPS.findIndex((s) => s.type === 'mcq')
    let { run } = await startOrResume(db, LESSON, STEPS, T)
    for (const step of STEPS.slice(0, mcqAt)) run = await answerAndContinue(run, step, true, T)
    await db.wordPool.clear()
    await db.reviewLogs.clear()
    for (const step of STEPS.slice(mcqAt)) run = await answerAndContinue(run, step, true, T)
    expect(await db.wordPool.count()).toBe(0)
    expect(await db.reviewLogs.count()).toBe(0)
    expect(run.results['a1-u01-l01-q15#1']).toMatchObject({ correct: true, grade: null })
  })

  it('同一交易：寫評分失敗時，新字入池、進度、同步佇列都不留（走查 P2 失敗注入）', async () => {
    const { run } = await startOrResume(db, LESSON, STEPS, T)
    db.reviewLogs.hook('creating', () => {
      throw new Error('注入：寫評分失敗')
    })
    const input = { correct: true, elapsedMs: SEC, usedHint: false }
    await expect(answerStep(db, run, STEPS[0], input, T)).rejects.toThrow('注入')
    expect(await db.wordPool.count()).toBe(0)
    expect(await db.outbox.count()).toBe(0)
    expect((await db.lessonRuns.get(LESSON))?.results).toEqual({})
  })

  it('入池與評分記入同步佇列', async () => {
    const { run } = await startOrResume(db, LESSON, STEPS, T)
    await answerStep(db, run, STEPS[0], { correct: true, elapsedMs: SEC, usedHint: false }, T)
    const tables = (await db.outbox.toArray()).map((o) => o.table)
    expect(tables).toContain('wordPool')
    expect(tables).toContain('reviewLogs')
  })
})

describe('中途離開可續（AC#1）', () => {
  async function reopen() {
    db.close()
    db = createDb(name)
    await db.open()
  }

  it('做到第 4 題離開，重開後從第 4 題接續、已答紀錄保留', async () => {
    let { run } = await startOrResume(db, LESSON, STEPS, T)
    for (const step of STEPS.slice(0, 3)) run = await answerAndContinue(run, step, true, T)
    await reopen()

    const resumed = await startOrResume(db, LESSON, STEPS, T + 3600 * SEC)
    expect(resumed.resumed).toBe(true)
    expect(resumed.run.cursor).toBe(3)
    expect(Object.keys(resumed.run.results)).toEqual(STEPS.slice(0, 3).map((s) => s.key))
    expect(resumed.run.startedAt).toBe(T)
  })

  it('答完還沒按繼續就離開：接續時跳到下一題，該字不重複寫評分', async () => {
    const { run } = await startOrResume(db, LESSON, STEPS, T)
    await answerStep(db, run, STEPS[0], { correct: true, elapsedMs: SEC, usedHint: false }, T)
    await reopen()

    const resumed = await startOrResume(db, LESSON, STEPS, T + 60 * SEC)
    expect(resumed.run.cursor).toBe(1)
    expect(await db.reviewLogs.where('wordId').equals('the').count()).toBe(1)
  })

  it('題目更新過（步驟對不上）就重新開始', async () => {
    const { run } = await startOrResume(db, LESSON, STEPS, T)
    await answerStep(db, run, STEPS[0], { correct: true, elapsedMs: SEC, usedHint: false }, T)
    const fewer = STEPS.slice(1)

    const again = await startOrResume(db, LESSON, fewer, T + SEC)
    expect(again).toMatchObject({ resumed: false, run: { cursor: 0, results: {} } })
  })

  it('沒有存檔時是新進度', async () => {
    const first = await startOrResume(db, LESSON, STEPS, T)
    expect(first).toMatchObject({ resumed: false, run: { cursor: 0, startedAt: T } })
  })
})

describe('結算', () => {
  async function playAll(wrongKeys: string[]) {
    let { run } = await startOrResume(db, LESSON, STEPS, T)
    for (const step of STEPS)
      run = await answerAndContinue(run, step, !wrongKeys.includes(step.key), T)
    return run
  }

  it('12 題答錯 2 題：完成這一課、清掉進度、onSettle 收到摘要', async () => {
    const run = await playAll(['a1-u01-l01-q02', 'a1-u01-l01-q15#1'])
    const onSettle = vi.fn()
    const summary = await settleLesson(db, run, STEPS, { nowMs: T + 300 * SEC, onSettle })

    expect(summary).toEqual({
      lessonId: LESSON,
      total: 12,
      correct: 10,
      newWords: ['the', 'be', 'and', 'of', 'a', 'in', 'to', 'have'],
      wrongKeys: ['a1-u01-l01-q02', 'a1-u01-l01-q15#1'],
    })
    expect(onSettle).toHaveBeenCalledExactlyOnceWith(summary)
    expect(await db.courseProgress.get(LESSON)).toEqual({
      lessonId: LESSON,
      completedAt: T + 300 * SEC,
      updatedAt: T + 300 * SEC,
    })
    expect(await db.lessonRuns.count()).toBe(0)
    expect((await db.outbox.toArray()).some((o) => o.table === 'courseProgress')).toBe(true)
    expect(await db.wordPool.count()).toBe(8)
  })

  it('還有題目沒答不能結算，也不呼叫 onSettle', async () => {
    const { run } = await startOrResume(db, LESSON, STEPS, T)
    const onSettle = vi.fn()
    await expect(settleLesson(db, run, STEPS, { nowMs: T, onSettle })).rejects.toThrow()
    expect(onSettle).not.toHaveBeenCalled()
    expect(await db.courseProgress.count()).toBe(0)
  })

  it('錯題重做（創辦人試用 2026-10-04 ⑤）：重做不寫 FSRS、不改第一次作答；中途離開重開，從重做的那題接續', async () => {
    const wrong = ['a1-u01-l01-q02', 'a1-u01-l01-q15#1']
    let run = await playAll(wrong)
    run = await continueRun(db, run, T + SEC)
    expect(run.retry).toMatchObject({ round: 1, keys: wrong, cursor: 0 })
    const logs = await db.reviewLogs.count()
    const q02 = STEPS.find((s) => s.key === wrong[0])!
    run = await answerRetry(db, run, q02, { correct: true }, T + 2 * SEC)
    expect(await db.reviewLogs.count()).toBe(logs)
    expect(run.results[wrong[0]].correct).toBe(false)

    // 答完重做題、還沒按繼續就離開：重開時跳到下一題重做
    const again = await startOrResume(db, LESSON, STEPS, T + 3 * SEC)
    expect(again.resumed).toBe(true)
    expect(activeKey(again.run)).toBe(wrong[1])
    expect(again.run.retry).toMatchObject({ round: 1, cursor: 1 })

    const summary = await settleLesson(db, again.run, STEPS, { nowMs: T + 4 * SEC })
    expect(summary).toMatchObject({ correct: 10, wrongKeys: wrong })
  })

  it('結算後再開同一課是新進度', async () => {
    const run = await playAll([])
    await settleLesson(db, run, STEPS, { nowMs: T })
    expect((await startOrResume(db, LESSON, STEPS, T + SEC)).resumed).toBe(false)
  })
})
