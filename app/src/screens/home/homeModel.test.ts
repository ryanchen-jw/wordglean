// @vitest-environment node
import 'fake-indexeddb/auto'
import Dexie from 'dexie'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { createDb, type LinguaDb, type PoolWord, type ReviewLogRow } from '../../data/db'
import { saveSettings } from '../../data/repo'
import { CardState, type Grade } from '../../srs/scheduler'
import type { LessonRef } from '../../curriculum/curriculum'
import { buildHomeModel, loadHomeDbInput, type HomeInput } from './homeModel'

const NEXT: LessonRef = {
  level: 'B1',
  unitId: 'b1-u05',
  unitTitle: '辦公室',
  lessonId: 'b1-u05-l03',
  ordinal: 3,
  words: [
    'reschedule',
    'postpone',
    'agenda',
    'attendee',
    'confirm',
    'venue',
    'minutes',
    'deadline',
  ],
}

const base: HomeInput = {
  firstRun: false,
  dueCount: 0,
  dueTomorrow: 0,
  reviewsDoneToday: 0,
  lessonsDoneToday: 0,
  paused: false,
  pauseThreshold: 100,
  next: NEXT,
}

// 期望值取自設計 s01 各狀態的示意數字
describe('buildHomeModel（設計 s01）', () => {
  it('預設：到期 24 → 複習約 6 分鐘、主卡約 11 分鐘、今日 複習 0／24 新課 0／1', () => {
    expect(buildHomeModel({ ...base, dueCount: 24 })).toMatchObject({
      state: 'default',
      reviewMinutes: 6,
      totalMinutes: 11,
      reviewsDone: 0,
      reviewsTotal: 24,
      lessonsDone: 0,
      lessonsTarget: 1,
    })
  })

  it('今天都完成：到期 0 且今日已上 1 課 → done，複習 24／24、新課 1／1', () => {
    expect(
      buildHomeModel({ ...base, reviewsDoneToday: 24, lessonsDoneToday: 1, dueTomorrow: 18 }),
    ).toMatchObject({
      state: 'done',
      reviewsDone: 24,
      reviewsTotal: 24,
      lessonsDone: 1,
      dueTomorrow: 18,
    })
  })

  it('新課暫停：到期 132 → paused，複習約 33 分鐘，主卡不加上課時間', () => {
    expect(buildHomeModel({ ...base, dueCount: 132, paused: true })).toMatchObject({
      state: 'paused',
      reviewMinutes: 33,
      totalMinutes: 33,
      pauseThreshold: 100,
    })
  })

  it('第一次開啟優先於其他狀態', () => {
    expect(buildHomeModel({ ...base, firstRun: true, paused: true }).state).toBe('first')
  })

  it('沒有到期、今天還沒上課 → 預設，主卡只有上課 5 分鐘', () => {
    expect(buildHomeModel(base)).toMatchObject({ state: 'default', totalMinutes: 5 })
  })

  it('不足一分鐘的複習進位為 1 分鐘', () => {
    expect(buildHomeModel({ ...base, dueCount: 1 }).reviewMinutes).toBe(1)
  })
})

const at = (iso: string) => Date.parse(iso)
// 台北 2026-10-01 16:00；當地「今天」＝ 09-30T16:00Z～10-01T16:00Z，「明天」到 10-02T16:00Z
const NOW = at('2026-10-01T08:00:00Z')
const TZ = 'Asia/Taipei'

const word = (wordId: string, state: CardState, due: number): PoolWord => ({
  wordId,
  state,
  due,
  stability: 1,
  difficulty: 5,
  scheduledDays: 1,
  learningSteps: 0,
  reps: 1,
  lapses: 0,
  lastReview: null,
  courseRefs: ['a2-u01-l01'], // 有來源才算在池中（TASK-16 D3）
  favoritedAt: null,
  addedAt: 0,
})

const log = (id: string, state: CardState, review: number): ReviewLogRow => ({
  id,
  wordId: 'w1',
  rating: 3 as Grade,
  state,
  due: review,
  stability: 1,
  difficulty: 5,
  scheduledDays: 1,
  learningSteps: 0,
  review,
})

let db: LinguaDb
let n = 0
beforeEach(async () => {
  db = createDb(`home-test-${++n}`)
  await db.open()
})
afterEach(async () => {
  db.close()
  await Dexie.delete(db.name)
})

describe('loadHomeDbInput', () => {
  it('空資料庫＝第一次開啟、沒有級距', async () => {
    expect(await loadHomeDbInput(db, NOW, TZ)).toMatchObject({
      firstRun: true,
      level: null,
      dueCount: 0,
      dueTomorrow: 0,
      reviewsDoneToday: 0,
      lessonsDoneToday: 0,
      paused: false,
      pauseThreshold: 100,
    })
  })

  it('依裝置時區切「今天」「明天」，新字不算到期也不算複習', async () => {
    await db.wordPool.bulkPut([
      word('w1', CardState.Review, at('2026-10-01T07:00:00Z')), // 已到期
      word('w2', CardState.Review, at('2026-10-02T10:00:00Z')), // 明天到期
      word('w3', CardState.New, at('2026-10-01T07:00:00Z')), // 新字
      word('w4', CardState.Review, at('2026-10-03T00:00:00Z')), // 後天（台北 10-03 08:00）
    ])
    await db.reviewLogs.bulkPut([
      log('r1', CardState.Review, at('2026-10-01T01:00:00Z')), // 今天
      log('r2', CardState.Review, at('2026-09-30T15:00:00Z')), // 台北昨天 23:00
      log('r3', CardState.New, at('2026-10-01T02:00:00Z')), // 今天第一次學（新字）
    ])
    await db.courseProgress.bulkPut([
      { lessonId: 'b1-u01-l01', completedAt: at('2026-09-30T10:00:00Z'), updatedAt: 0 },
      { lessonId: 'a2-u01-l01', completedAt: at('2026-10-01T02:00:00Z'), updatedAt: 0 },
    ])

    const input = await loadHomeDbInput(db, NOW, TZ)
    expect(input).toMatchObject({
      firstRun: false,
      level: 'A2',
      dueCount: 1,
      dueTomorrow: 2,
      reviewsDoneToday: 1,
      lessonsDoneToday: 1,
      paused: false,
    })
    expect([...input.completedIds].sort()).toEqual(['a2-u01-l01', 'b1-u01-l01'])
  })

  it('設定有級距（分級或跳過）：不算第一次開啟，級距取設定', async () => {
    await saveSettings(db, { cefrLevel: 'B1' }, NOW)
    expect(await loadHomeDbInput(db, NOW, TZ)).toMatchObject({ firstRun: false, level: 'B1' })
  })

  it('設定級距優先於課程進度推導；沒有設定時才用推導', async () => {
    await db.courseProgress.put({ lessonId: 'a2-u01-l01', completedAt: NOW, updatedAt: 0 })
    expect((await loadHomeDbInput(db, NOW, TZ)).level).toBe('A2')
    await saveSettings(db, { cefrLevel: 'C1' }, NOW)
    expect((await loadHomeDbInput(db, NOW, TZ)).level).toBe('C1')
  })

  it('只有收藏字、沒有上過課也不算第一次開啟', async () => {
    await db.wordPool.put({ ...word('w1', CardState.New, NOW), courseRefs: [], favoritedAt: NOW })
    expect((await loadHomeDbInput(db, NOW, TZ)).firstRun).toBe(false)
  })

  // TASK-16 執行長代決：收藏後又按「復原」的字不在池中（inPool），仍算第一次開啟
  it('收藏後又復原（無來源）的字不算，仍是第一次開啟', async () => {
    await db.wordPool.put({ ...word('w1', CardState.New, NOW), courseRefs: [], favoritedAt: null })
    expect((await loadHomeDbInput(db, NOW, TZ)).firstRun).toBe(true)
  })
})
