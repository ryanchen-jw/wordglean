// @vitest-environment node
import 'fake-indexeddb/auto'
import Dexie from 'dexie'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { createDb, type LinguaDb } from './db'
import {
  addFavorite,
  addSpeechCorrection,
  addFromCourse,
  completeLesson,
  countDue,
  getSettings,
  getTodayQuota,
  inPool,
  recordReview,
  removeFavorite,
  saveSettings,
} from './repo'
import { CardState, Grade } from '../srs/scheduler'

const MIN = 60_000
const at = (iso: string) => Date.parse(iso)
const T = at('2026-10-01T08:00:00Z')

let db: LinguaDb
let n = 0
beforeEach(async () => {
  db = createDb(`repo-test-${++n}`)
  await db.open()
})
afterEach(async () => {
  db.close()
  await Dexie.delete(db.name)
})

describe('收藏與課程字共用同一個池（AC#4）', () => {
  it('課程字再收藏：仍只有一筆，來源同時有課程與收藏', async () => {
    await addFromCourse(db, 'apple', 'a1-u1-l1', T)
    await addFavorite(db, 'apple', T + MIN)
    expect(await db.wordPool.count()).toBe(1)
    expect(await db.wordPool.get('apple')).toMatchObject({
      courseRefs: ['a1-u1-l1'],
      favoritedAt: T + MIN,
      addedAt: T,
    })
  })

  it('收藏字再進課程：仍只有一筆，來源多重', async () => {
    await addFavorite(db, 'river', T)
    await addFromCourse(db, 'river', 'a1-u2-l1', T + MIN)
    expect(await db.wordPool.count()).toBe(1)
    expect(await db.wordPool.get('river')).toMatchObject({
      courseRefs: ['a1-u2-l1'],
      favoritedAt: T,
    })
  })

  it('已學過的字被收藏，FSRS 狀態不重置', async () => {
    await addFromCourse(db, 'apple', 'a1-u1-l1', T)
    await recordReview(db, 'apple', Grade.Good, T)
    await addFavorite(db, 'apple', T + 5 * MIN)
    expect(await db.wordPool.get('apple')).toMatchObject({
      state: CardState.Learning,
      due: T + 10 * MIN,
      reps: 1,
      lastReview: T,
      favoritedAt: T + 5 * MIN,
    })
  })

  it('同字出現在兩個小課：課程來源累加、同一小課不重複；重複收藏保留首次時間', async () => {
    await addFromCourse(db, 'apple', 'a1-u1-l1', T)
    await addFromCourse(db, 'apple', 'a1-u1-l2', T + MIN)
    await addFromCourse(db, 'apple', 'a1-u1-l1', T + 2 * MIN)
    await addFavorite(db, 'apple', T + 3 * MIN)
    await addFavorite(db, 'apple', T + 4 * MIN)
    expect(await db.wordPool.get('apple')).toMatchObject({
      courseRefs: ['a1-u1-l1', 'a1-u1-l2'],
      favoritedAt: T + 3 * MIN,
    })
  })

  it('大小寫與前後空白視為同一字', async () => {
    await addFromCourse(db, 'apple', 'a1-u1-l1', T)
    await addFavorite(db, ' Apple ', T)
    expect(await db.wordPool.count()).toBe(1)
  })
})

describe('取消收藏與來源歸零（TASK-16 D3）', () => {
  it('取消收藏：收藏時間清空、課程來源與 FSRS 狀態不動，記一筆待推項目', async () => {
    await addFromCourse(db, 'apple', 'a1-u1-l1', T)
    await recordReview(db, 'apple', Grade.Good, T + MIN)
    await addFavorite(db, 'apple', T + 2 * MIN)
    const before = await db.wordPool.get('apple')
    const queued = await db.outbox.count()
    await removeFavorite(db, 'Apple ', T + 3 * MIN)
    const after = await db.wordPool.get('apple')
    expect(after).toMatchObject({ favoritedAt: null, courseRefs: ['a1-u1-l1'] })
    expect(after?.stability).toBe(before?.stability)
    expect(after?.reps).toBe(1)
    expect(await db.outbox.count()).toBe(queued + 1)
  })

  it('收藏與取消都記下收藏狀態的修改時間（同步以最後修改者為準）；重複收藏不改', async () => {
    await addFavorite(db, 'kiwi', T)
    expect(await db.wordPool.get('kiwi')).toMatchObject({ favoritedAt: T, favoriteUpdatedAt: T })
    await addFavorite(db, 'kiwi', T + MIN)
    expect(await db.wordPool.get('kiwi')).toMatchObject({ favoritedAt: T, favoriteUpdatedAt: T })
    await removeFavorite(db, 'kiwi', T + 2 * MIN)
    expect(await db.wordPool.get('kiwi')).toMatchObject({
      favoritedAt: null,
      favoriteUpdatedAt: T + 2 * MIN,
    })
    await addFavorite(db, 'kiwi', T + 3 * MIN)
    expect(await db.wordPool.get('kiwi')).toMatchObject({
      favoritedAt: T + 3 * MIN,
      favoriteUpdatedAt: T + 3 * MIN,
    })
  })

  it('不在池中的字取消收藏：什麼都不做', async () => {
    await removeFavorite(db, 'ghost', T)
    expect(await db.wordPool.count()).toBe(0)
    expect(await db.outbox.count()).toBe(0)
  })

  it('inPool：有課程來源或已收藏才算在池中', () => {
    expect(inPool({ courseRefs: ['a1-u1-l1'], favoritedAt: null })).toBe(true)
    expect(inPool({ courseRefs: [], favoritedAt: T })).toBe(true)
    expect(inPool({ courseRefs: [], favoritedAt: null })).toBe(false)
  })

  it('收藏後又取消的已學字：不算待複習；再收藏時沿用原排程', async () => {
    await addFavorite(db, 'pear', T)
    await recordReview(db, 'pear', Grade.Again, T)
    const due = (await db.wordPool.get('pear'))!.due
    expect(await countDue(db, due)).toBe(1)
    await removeFavorite(db, 'pear', T + MIN)
    expect(await countDue(db, due)).toBe(0)
    await addFavorite(db, 'pear', T + 2 * MIN)
    expect(await countDue(db, due)).toBe(1)
    expect((await db.wordPool.get('pear'))!.due).toBe(due)
  })
})

describe('作答紀錄', () => {
  it('寫入一筆 review log（uuid、作答前狀態），池紀錄同步更新', async () => {
    await addFromCourse(db, 'apple', 'a1-u1-l1', T)
    await recordReview(db, 'apple', Grade.Again, T)
    const logs = await db.reviewLogs.toArray()
    expect(logs).toHaveLength(1)
    expect(logs[0]).toMatchObject({
      wordId: 'apple',
      rating: Grade.Again,
      state: CardState.New,
      review: T,
    })
    expect(logs[0].id).toMatch(/^[0-9a-f-]{36}$/)
    expect(await db.wordPool.get('apple')).toMatchObject({
      state: CardState.Learning,
      due: T + MIN,
    })
  })

  it('不在池中的字不可作答', async () => {
    await expect(recordReview(db, 'ghost', Grade.Good, T)).rejects.toThrow()
    expect(await db.reviewLogs.count()).toBe(0)
  })

  it('待複習數不含尚未學的新字、不含未到期的字', async () => {
    await addFromCourse(db, 'apple', 'l1', T)
    await addFromCourse(db, 'river', 'l1', T)
    await recordReview(db, 'apple', Grade.Good, T) // 10 分鐘後到期
    expect(await countDue(db, T + 9 * MIN)).toBe(0)
    expect(await countDue(db, T + 10 * MIN)).toBe(1)
  })
})

describe('今日新字額度：跨時區換日（AC#2）', () => {
  // 3 字於 2026-10-01T15:30Z 首學（台北 10/01 23:30、波哥大 10/01 10:30）
  // 2 字於 2026-10-01T16:30Z 首學（台北 10/02 00:30、波哥大 10/01 11:30）
  beforeEach(async () => {
    const words = ['a', 'b', 'c', 'd', 'e']
    for (const [i, w] of words.entries()) {
      await addFromCourse(db, w, 'l1', T)
      await recordReview(
        db,
        w,
        Grade.Good,
        i < 3 ? at('2026-10-01T15:30:00Z') : at('2026-10-01T16:30:00Z'),
      )
    }
  })

  it('預設設定：每日 10 字、暫停倍數 10、未分級', async () => {
    expect(await getSettings(db)).toMatchObject({
      dailyNewLimit: 10,
      pauseMultiplier: 10,
      desiredRetention: 0.9,
      cefrLevel: null,
    })
  })

  it('TASK-17 前存的設定列沒有 cefrLevel：讀出為 null（Dexie 不升版）；寫入級距後讀回', async () => {
    await db.settings.put({
      id: 'local',
      dailyNewLimit: 20,
      pauseMultiplier: 10,
      desiredRetention: 0.9,
      updatedAt: 1,
    } as never)
    expect(await getSettings(db)).toMatchObject({ dailyNewLimit: 20, cefrLevel: null })
    await saveSettings(db, { cefrLevel: 'B2' }, 2)
    expect(await getSettings(db)).toMatchObject({
      dailyNewLimit: 20,
      cefrLevel: 'B2',
      updatedAt: 2,
    })
  })

  it('UTC+8：台北已換到 10/02，只算 2 字', async () => {
    expect(await getTodayQuota(db, at('2026-10-01T17:00:00Z'), 'Asia/Taipei')).toEqual({
      remaining: 8,
      paused: false,
    })
  })

  it('UTC-5：波哥大仍是 10/01，算 5 字；換日後歸零', async () => {
    expect(await getTodayQuota(db, at('2026-10-01T17:00:00Z'), 'America/Bogota')).toEqual({
      remaining: 5,
      paused: false,
    })
    expect(await getTodayQuota(db, at('2026-10-02T05:30:00Z'), 'America/Bogota')).toEqual({
      remaining: 10,
      paused: false,
    })
  })

  it('待複習超過門檻（依使用者設定）時暫停出新字', async () => {
    await saveSettings(db, { dailyNewLimit: 2, pauseMultiplier: 2 }, T)
    // 5 字皆於 16:40Z 前到期 → 待複習 5 > 2×2
    expect(await getTodayQuota(db, at('2026-10-02T05:30:00Z'), 'America/Bogota')).toEqual({
      remaining: 0,
      paused: true,
    })
    await saveSettings(db, { pauseMultiplier: 3 }, T)
    expect(await getTodayQuota(db, at('2026-10-02T05:30:00Z'), 'America/Bogota')).toEqual({
      remaining: 2,
      paused: false,
    })
  })
})

describe('寫入同時進同步佇列（TASK-20 離線佇列）', () => {
  const queued = async () =>
    (await db.outbox.orderBy('seq').toArray()).map((e) => `${e.table}:${e.key}`)

  it('加課程字、收藏、作答、改設定都記一筆待推項目', async () => {
    await addFromCourse(db, 'Apple', 'a1-u1-l1', T)
    await addFavorite(db, 'apple', T + MIN)
    await recordReview(db, 'apple', Grade.Good, T + 2 * MIN)
    await saveSettings(db, { dailyNewLimit: 5 }, T + 3 * MIN)
    const logId = (await db.reviewLogs.toArray())[0].id
    expect(await queued()).toEqual([
      'wordPool:apple',
      'wordPool:apple',
      'wordPool:apple',
      `reviewLogs:${logId}`,
      'settings:local',
    ])
  })

  it('寫入失敗時佇列也不留紀錄（同一交易）', async () => {
    await expect(recordReview(db, 'ghost', Grade.Good, T)).rejects.toThrow()
    expect(await queued()).toEqual([])
  })
})

describe('完成小課（TASK-12）', () => {
  it('第一次完成記下時間並排入同步佇列', async () => {
    await completeLesson(db, 'a1-u01-l01', T)
    expect(await db.courseProgress.get('a1-u01-l01')).toEqual({
      lessonId: 'a1-u01-l01',
      completedAt: T,
      updatedAt: T,
    })
    expect(await db.outbox.toArray()).toMatchObject([
      { table: 'courseProgress', key: 'a1-u01-l01' },
    ])
  })

  it('再完成一次：完成時間保留第一次，更新時間往後', async () => {
    await completeLesson(db, 'a1-u01-l01', T)
    await completeLesson(db, 'a1-u01-l01', T + 5 * MIN)
    expect(await db.courseProgress.get('a1-u01-l01')).toEqual({
      lessonId: 'a1-u01-l01',
      completedAt: T,
      updatedAt: T + 5 * MIN,
    })
  })
})

describe('跟讀紀錄（TASK-14）', () => {
  it('每次送出記一筆辨識原文與送出句（uuid、時間），並排入同步佇列', async () => {
    const T = Date.parse('2026-10-02T08:00:00Z')
    const entry = {
      itemId: 'a1-u01-l01-q11',
      targetText: 'I have a cup of tea.',
      recognizedText: 'I have a cap of tea',
      correctedText: 'I have a cup of tea',
    }
    await addSpeechCorrection(db, entry, T)
    await addSpeechCorrection(db, { ...entry, correctedText: 'I have a cap of tea' }, T + 1)
    const rows = await db.speechCorrections.orderBy('createdAt').toArray()
    expect(rows).toEqual([
      { id: expect.any(String), ...entry, createdAt: T },
      { id: expect.any(String), ...entry, correctedText: 'I have a cap of tea', createdAt: T + 1 },
    ])
    expect(rows[0].id).toMatch(/^[0-9a-f-]{36}$/)
    expect(rows[0].id).not.toBe(rows[1].id)
    expect(await db.outbox.toArray()).toEqual([
      { seq: 1, table: 'speechCorrections', key: rows[0].id },
      { seq: 2, table: 'speechCorrections', key: rows[1].id },
    ])
  })
})
