// @vitest-environment node
import 'fake-indexeddb/auto'
import Dexie from 'dexie'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { createDb, type LinguaDb, type PoolWord } from '../data/db'
import { saveSettings } from '../data/repo'
import type { LevelDoc } from '../curriculum/curriculum'
import { assembleToday, loadNextLessonId, loadTodayPlan, reviewCapOf } from './plan'

const T = Date.parse('2026-10-02T08:00:00Z')
const MIN = 60_000
const TZ = 'Asia/Taipei'
const NEXT = 'a1-u01-l02'

const words = (n: number) => Array.from({ length: n }, (_, i) => `w${String(i).padStart(3, '0')}`)

describe('assembleToday（AC#1）', () => {
  it('無到期：不排複習，直接出下一課', () => {
    expect(
      assembleToday({
        due: [],
        quota: { remaining: 10, paused: false },
        nextLessonId: NEXT,
        reviewCap: 100,
      }),
    ).toEqual({ reviews: [], reviewOverflow: 0, lessonId: NEXT, lessonBlocked: null })
  })

  it('到期過多：依到期時間由早到晚取到上限，其餘算在下一輪；暫停時不出課', () => {
    // 150 個字，due 由晚到早排進來：w000 最晚、w149 最早
    const due = words(150).map((wordId, i) => ({ wordId, due: T - i * MIN }))
    const plan = assembleToday({
      due,
      quota: { remaining: 0, paused: true },
      nextLessonId: NEXT,
      reviewCap: 100,
    })
    expect(plan.reviews).toHaveLength(100)
    expect(plan.reviews[0]).toBe('w149')
    expect(plan.reviews[99]).toBe('w050')
    expect(plan.reviewOverflow).toBe(50)
    expect(plan.lessonId).toBeNull()
    expect(plan.lessonBlocked).toBe('paused')
  })

  it('新字上限為 0（未暫停）：照常複習、不出課', () => {
    expect(
      assembleToday({
        due: [{ wordId: 'apple', due: T }],
        quota: { remaining: 0, paused: false },
        nextLessonId: NEXT,
        reviewCap: 100,
      }),
    ).toEqual({ reviews: ['apple'], reviewOverflow: 0, lessonId: null, lessonBlocked: 'quota' })
  })

  it('暫停門檻觸發：到期全排進複習、不出課（暫停優先於額度）', () => {
    expect(
      assembleToday({
        due: [
          { wordId: 'cat', due: T - 2 * MIN },
          { wordId: 'bag', due: T - MIN },
          { wordId: 'ant', due: T - 2 * MIN },
        ],
        quota: { remaining: 5, paused: true },
        nextLessonId: NEXT,
        reviewCap: 100,
      }),
    ).toEqual({
      reviews: ['ant', 'cat', 'bag'],
      reviewOverflow: 0,
      lessonId: null,
      lessonBlocked: 'paused',
    })
  })

  it('還有額度但只剩 1 個也照常出一課（D3）；整級上完時不出課', () => {
    const base = { due: [], reviewCap: 100 }
    expect(
      assembleToday({ ...base, quota: { remaining: 1, paused: false }, nextLessonId: NEXT })
        .lessonId,
    ).toBe(NEXT)
    expect(
      assembleToday({ ...base, quota: { remaining: 10, paused: false }, nextLessonId: null }),
    ).toMatchObject({ lessonId: null, lessonBlocked: 'levelDone' })
  })
})

describe('reviewCapOf（D4）', () => {
  it('一輪上限＝每日新字 × 暫停倍數；乘積為 0 時退回 100', () => {
    expect(reviewCapOf({ dailyNewLimit: 10, pauseMultiplier: 10 })).toBe(100)
    expect(reviewCapOf({ dailyNewLimit: 20, pauseMultiplier: 5 })).toBe(100)
    expect(reviewCapOf({ dailyNewLimit: 3, pauseMultiplier: 10 })).toBe(30)
    expect(reviewCapOf({ dailyNewLimit: 0, pauseMultiplier: 10 })).toBe(100)
  })
})

describe('loadTodayPlan（從本機資料庫組裝）', () => {
  let db: LinguaDb
  let name: string
  let n = 0
  beforeEach(async () => {
    name = `today-test-${++n}`
    db = createDb(name)
    await db.open()
  })
  afterEach(async () => {
    db.close()
    await Dexie.delete(name)
  })

  // 已複習過（Review 狀態）的課程字；due 可指定
  const row = (wordId: string, due: number, patch: Partial<PoolWord> = {}): PoolWord => ({
    wordId,
    state: 2,
    due,
    stability: 3,
    difficulty: 5,
    scheduledDays: 3,
    learningSteps: 0,
    reps: 2,
    lapses: 0,
    lastReview: due - 3 * 86_400_000,
    courseRefs: ['a1-u01-l01'],
    favoritedAt: null,
    addedAt: T - 10 * 86_400_000,
    ...patch,
  })
  const settings = (dailyNewLimit: number) =>
    db.settings.put({
      id: 'local',
      dailyNewLimit,
      pauseMultiplier: 10,
      desiredRetention: 0.9,
      cefrLevel: null,
      updatedAt: 0,
    })

  it('只排已到期、已開始學、在單字池（課程來源或收藏，inPool）的字', async () => {
    await db.wordPool.bulkPut([
      row('due', T - 2 * MIN),
      row('later', T + MIN),
      row('fresh', T - MIN, { state: 0 }),
      row('favonly', T - MIN, { courseRefs: [], favoritedAt: T - 86_400_000 }),
      row('unfaved', T - MIN, { courseRefs: [], favoritedAt: null }),
    ])
    const plan = await loadTodayPlan(db, T, TZ, NEXT)
    expect(plan.reviews).toEqual(['due', 'favonly'])
    expect(plan.lessonId).toBe(NEXT)
  })

  it('每日新字設 0、沒有到期：不出課（額度）', async () => {
    await settings(0)
    expect(await loadTodayPlan(db, T, TZ, NEXT)).toEqual({
      reviews: [],
      reviewOverflow: 0,
      lessonId: null,
      lessonBlocked: 'quota',
    })
  })

  it('待複習 101 個（門檻 100）：暫停出新課，這一輪複習 100 個', async () => {
    await db.wordPool.bulkPut(words(101).map((w, i) => row(w, T - (i + 1) * MIN)))
    const plan = await loadTodayPlan(db, T, TZ, NEXT)
    expect(plan.reviews).toHaveLength(100)
    expect(plan.reviews[0]).toBe('w100')
    expect(plan.reviewOverflow).toBe(1)
    expect(plan.lessonBlocked).toBe('paused')
  })

  it('每日新字設 0、到期 120 個：一輪上限退回 100', async () => {
    await settings(0)
    await db.wordPool.bulkPut(words(120).map((w) => row(w, T - MIN)))
    const plan = await loadTodayPlan(db, T, TZ, NEXT)
    expect(plan.reviews).toHaveLength(100)
    expect(plan.reviewOverflow).toBe(20)
    expect(plan.lessonId).toBeNull()
  })
})

describe('loadNextLessonId（今日動線的下一課，與首頁同規則）', () => {
  let db: LinguaDb
  let name: string
  let n = 0
  beforeEach(async () => {
    name = `next-test-${++n}`
    db = createDb(name)
    await db.open()
  })
  afterEach(async () => {
    db.close()
    await Dexie.delete(name)
  })

  const lessons = (level: string, ids: string[]) =>
    ids.map((id) => ({ id: `${level}-${id}`, words: [] }))
  const docs: Record<string, LevelDoc> = {
    A1: {
      schemaVersion: 1,
      level: 'A1',
      units: [
        {
          id: 'a1-u01',
          topic: 't',
          titleZh: '單元',
          lessons: lessons('a1', ['u01-l01', 'u01-l02']),
        },
      ],
    },
    B1: {
      schemaVersion: 1,
      level: 'B1',
      units: [
        {
          id: 'b1-u01',
          topic: 't',
          titleZh: '單元',
          lessons: lessons('b1', ['u01-l01', 'u01-l02']),
        },
      ],
    },
  }
  const loadLevel = async (level: string) => docs[level]

  it('沒有進度：A1 第一課', async () => {
    expect(await loadNextLessonId(db, loadLevel)).toBe('a1-u01-l01')
  })

  it('目前級距＝最後完成那課的級距，取其中第一個未完成的課（同級依序，D1）', async () => {
    await db.courseProgress.bulkPut([
      { lessonId: 'a1-u01-l01', completedAt: 1, updatedAt: 1 },
      { lessonId: 'b1-u01-l01', completedAt: 2, updatedAt: 2 },
    ])
    expect(await loadNextLessonId(db, loadLevel)).toBe('b1-u01-l02')
  })

  it('設定有級距（TASK-17 分級／設定頁）時以設定為準，與首頁同規則', async () => {
    await db.courseProgress.put({ lessonId: 'a1-u01-l01', completedAt: 1, updatedAt: 1 })
    await saveSettings(db, { cefrLevel: 'B1' }, 1)
    expect(await loadNextLessonId(db, loadLevel)).toBe('b1-u01-l01')
  })

  it('整級上完：null', async () => {
    await db.courseProgress.bulkPut([
      { lessonId: 'a1-u01-l01', completedAt: 1, updatedAt: 1 },
      { lessonId: 'a1-u01-l02', completedAt: 2, updatedAt: 2 },
    ])
    expect(await loadNextLessonId(db, loadLevel)).toBeNull()
  })
})
