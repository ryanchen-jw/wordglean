// @vitest-environment node
// AC#2：模擬一位使用者連續 14 天每天早上 9 點（台北）用「今天的學習」：先複習到期、再上一課
// 期望值依據：規格 §7（預設每日新字 10、暫停門檻 ×10）、D3（額度 >0 出一課）、每課 8 個新字
import 'fake-indexeddb/auto'
import Dexie from 'dexie'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { createDb, type LinguaDb } from '../data/db'
import { countDue } from '../data/repo'
import { buildLessonQueue } from '../lesson/assemble'
import type { LessonItemsDoc } from '../lesson/items'
import { createRegistry, READ_TYPES } from '../lesson/queue'
import { answerStep, continueRun, settleLesson, startOrResume } from '../lesson/session'
import { answerReview, loadReviewCards } from '../review/session'
import { CardState } from '../srs/scheduler'
import { dayBoundsUtc, localDayKey } from '../srs/daily'
import { loadTodayPlan } from './plan'

const TZ = 'Asia/Taipei'
const DAY = 86_400_000
const DAY0 = Date.parse('2026-10-05T01:00:00Z') // 台北 09:00
const DAYS = 14
const NONE = { tts: false, stt: false, llmKey: false }
const registry = createRegistry(READ_TYPES)

// 合成課綱：20 課、每課 8 張單字卡（字不重複）＋1 題選擇題
const lessonIds = Array.from({ length: 20 }, (_, i) => `a1-u01-l${String(i + 1).padStart(2, '0')}`)
const docs = new Map<string, LessonItemsDoc>(
  lessonIds.map((lessonId, li) => [
    lessonId,
    {
      schemaVersion: 1,
      lessonId,
      level: 'A1',
      items: [
        ...Array.from({ length: 8 }, (_, wi) => ({
          id: `${lessonId}-q${wi + 1}`,
          type: 'wordCard' as const,
          word: `w${li}x${wi}`,
          exampleEn: `Example ${li} ${wi}.`,
          exampleZh: `例句 ${li} ${wi}`,
          glossZh: `意思${li}-${wi}`,
          distractorsZh: [`干擾${li}-${wi}a`, `干擾${li}-${wi}b`, `干擾${li}-${wi}c`],
        })),
        {
          id: `${lessonId}-q9`,
          type: 'mcq' as const,
          stemEn: 'I ____ a pen.',
          stemZh: '我有一支筆。',
          options: ['have', 'has'],
          answer: 0,
        },
      ],
    },
  ]),
)
const loadItems = async (id: string) => docs.get(id) ?? null

let db: LinguaDb
let name: string
let n = 0
beforeEach(async () => {
  name = `simulate-test-${++n}`
  db = createDb(name)
  await db.open()
})
afterEach(async () => {
  db.close()
  await Dexie.delete(name)
})

async function nextLessonId(): Promise<string | null> {
  const done = new Set((await db.courseProgress.toArray()).map((p) => p.lessonId))
  return lessonIds.find((id) => !done.has(id)) ?? null
}

async function doLesson(lessonId: string, now: number): Promise<void> {
  const { steps } = buildLessonQueue(docs.get(lessonId)!, registry, NONE)
  let { run } = await startOrResume(db, lessonId, steps, now)
  for (const [i, step] of steps.entries()) {
    const at = now + i * 10_000
    run = await answerStep(db, run, step, { correct: true, elapsedMs: 5000, usedHint: false }, at)
    if (i < steps.length - 1) run = await continueRun(db, run, at)
  }
  await settleLesson(db, run, steps, { nowMs: now + steps.length * 10_000 })
}

interface DayLog {
  dueAtStart: number
  reviewed: number
  overflow: number
  lessonId: string | null
  introduced: number
}

async function simulate(): Promise<DayLog[]> {
  const days: DayLog[] = []
  for (let d = 0; d < DAYS; d++) {
    let now = DAY0 + d * DAY
    const dueAtStart = await countDue(db, now)
    const plan = await loadTodayPlan(db, now, TZ, await nextLessonId())
    const { cards, missing } = await loadReviewCards(db, plan.reviews, loadItems)
    expect(missing).toEqual([])
    for (const [i, card] of cards.entries()) {
      now += 10_000
      // 固定的答錯樣式：約每 7 題錯 1 題
      const correct = (d + i) % 7 !== 0
      await answerReview(db, card, { correct, elapsedMs: 5000, usedHint: false }, now, {
        practice: false,
      })
    }
    if (plan.lessonId) await doLesson(plan.lessonId, now + 10_000)
    const { startMs, endMs } = dayBoundsUtc(localDayKey(DAY0 + d * DAY, TZ), TZ)
    const introduced = await db.reviewLogs
      .where('review')
      .between(startMs, endMs, true, false)
      .filter((l) => l.state === CardState.New)
      .count()
    days.push({
      dueAtStart,
      reviewed: cards.length,
      overflow: plan.reviewOverflow,
      lessonId: plan.lessonId,
      introduced,
    })
  }
  return days
}

describe('14 天每日使用（AC#2）', () => {
  it('每天上一課、新字 8 個入池；到期量合理且每天複習得完', async () => {
    const days = await simulate()

    // 入池：預設每日新字 10、每課 8 字 → 每天剛好一課，14 天 112 字
    expect(days.map((x) => x.lessonId)).toEqual(lessonIds.slice(0, DAYS))
    expect(days.map((x) => x.introduced)).toEqual(Array(DAYS).fill(8))
    expect(await db.wordPool.count()).toBe(112)
    expect(await db.courseProgress.count()).toBe(DAYS)

    // 第一天沒有到期；第二天到期的是前一天學的 8 個字（學習步驟 10 分鐘早已過）
    expect(days[0].dueAtStart).toBe(0)
    expect(days[1].dueAtStart).toBe(8)

    // 每天開始時的到期都在一輪上限內複習完（沒有留到下一輪），也從未觸發暫停（門檻 100）
    for (const x of days) {
      expect(x.overflow).toBe(0)
      expect(x.reviewed).toBe(x.dueAtStart)
      expect(x.dueAtStart).toBeLessThanOrEqual(100)
    }
    // 合理範圍：每天到期不超過「近 3 天新字（24）＋答錯重學」，不會堆積成長
    expect(Math.max(...days.map((x) => x.dueAtStart))).toBeLessThanOrEqual(40)

    // 每個字都在學會後隔天第一次複習
    const firstReviewDay = new Map<string, number>()
    for (const l of await db.reviewLogs.orderBy('review').toArray())
      if (l.state !== CardState.New && !firstReviewDay.has(l.wordId))
        firstReviewDay.set(l.wordId, Math.floor((l.review - DAY0) / DAY))
    for (let li = 0; li < DAYS - 1; li++)
      for (let wi = 0; wi < 8; wi++) expect(firstReviewDay.get(`w${li}x${wi}`)).toBe(li + 1)
  })
})
