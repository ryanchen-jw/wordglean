// @vitest-environment node
// 期望值依 supabase/CLAUDE.md 欄位對照表手寫
import { describe, expect, it } from 'vitest'
import {
  logFromRow,
  logToRow,
  progressFromRow,
  progressToRow,
  settingsFromRow,
  settingsToRow,
  speechFromRow,
  speechToRow,
  wordFromRows,
  wordToRows,
} from './rows'

const U = '11111111-1111-1111-1111-111111111111'
const ISO = '2026-10-01T08:00:00.000Z'
const MS = Date.parse(ISO)
// PostgREST 回傳的 timestamptz 格式
const PG = '2026-10-01T08:00:00+00:00'

describe('雲端列 ↔ 本機資料', () => {
  it('設定', () => {
    const local = {
      id: 'local' as const,
      dailyNewLimit: 15,
      pauseMultiplier: 8,
      desiredRetention: 0.85,
      updatedAt: MS,
    }
    const row = {
      user_id: U,
      daily_new_limit: 15,
      pause_multiplier: 8,
      desired_retention: 0.85,
      updated_at: ISO,
    }
    expect(settingsToRow(local, U)).toEqual(row)
    expect(settingsFromRow({ ...row, updated_at: PG })).toEqual(local)
  })

  const word = {
    wordId: 'apple',
    state: 2 as const,
    due: MS + 86_400_000,
    stability: 3.2,
    difficulty: 5.1,
    scheduledDays: 1,
    learningSteps: 0,
    reps: 2,
    lapses: 0,
    lastReview: MS,
    courseRefs: ['a1-u1-l1'],
    favoritedAt: MS,
    addedAt: MS,
  }
  const poolRow = {
    user_id: U,
    word_id: 'apple',
    state: 2,
    due: '2026-10-02T08:00:00.000Z',
    stability: 3.2,
    difficulty: 5.1,
    scheduled_days: 1,
    learning_steps: 0,
    reps: 2,
    lapses: 0,
    last_review: ISO,
    course_refs: ['a1-u1-l1'],
    added_at: ISO,
  }

  it('單字池＋收藏：推送時拆成 word_pool 與 favorites 兩列', () => {
    expect(wordToRows(word, U, '2026-10-03T00:00:00.000Z')).toEqual({
      pool: poolRow,
      favorite: {
        user_id: U,
        word_id: 'apple',
        created_at: ISO,
        deleted_at: null,
        updated_at: '2026-10-03T00:00:00.000Z',
      },
    })
    expect(wordToRows({ ...word, favoritedAt: null }, U, ISO).favorite).toBeNull()
    expect(wordToRows({ ...word, lastReview: null }, U, ISO).pool.last_review).toBeNull()
  })

  it('單字池＋收藏：拉回時合成一筆；收藏有墓碑視為未收藏', () => {
    const fav = { word_id: 'apple', created_at: PG, deleted_at: null }
    expect(wordFromRows(poolRow, fav)).toEqual(word)
    expect(wordFromRows(poolRow, { ...fav, deleted_at: PG }).favoritedAt).toBeNull()
    expect(wordFromRows(poolRow, undefined).favoritedAt).toBeNull()
    expect(wordFromRows({ ...poolRow, last_review: null }, undefined).lastReview).toBeNull()
  })

  // TASK-16 D2：取消收藏推墓碑；收藏狀態的修改時間（favoriteUpdatedAt）走 updated_at
  it('取消收藏：推墓碑列（deleted_at＝取消時間）；有修改時間時 updated_at 用它', () => {
    const T = '2026-10-05T00:00:00.000Z'
    const changed = Date.parse(T)
    expect(wordToRows({ ...word, favoritedAt: null, favoriteUpdatedAt: changed }, U, ISO)).toEqual({
      pool: poolRow,
      favorite: { user_id: U, word_id: 'apple', created_at: T, deleted_at: T, updated_at: T },
    })
    expect(wordToRows({ ...word, favoriteUpdatedAt: changed }, U, ISO).favorite).toEqual({
      user_id: U,
      word_id: 'apple',
      created_at: ISO,
      deleted_at: null,
      updated_at: T,
    })
  })

  it('拉回時帶回收藏狀態的修改時間（墓碑與收藏皆然）', () => {
    const fav = { word_id: 'apple', created_at: PG, deleted_at: null, updated_at: PG }
    expect(wordFromRows(poolRow, fav)).toEqual({ ...word, favoriteUpdatedAt: MS })
    expect(wordFromRows(poolRow, { ...fav, deleted_at: PG })).toMatchObject({
      favoritedAt: null,
      favoriteUpdatedAt: MS,
    })
  })

  it('只有收藏列、沒有單字池列：以收藏時間建新字', () => {
    expect(wordFromRows(undefined, { word_id: 'river', created_at: PG, deleted_at: null })).toEqual(
      {
        wordId: 'river',
        state: 0,
        due: MS,
        stability: 0,
        difficulty: 0,
        scheduledDays: 0,
        learningSteps: 0,
        reps: 0,
        lapses: 0,
        lastReview: null,
        courseRefs: [],
        favoritedAt: MS,
        addedAt: MS,
      },
    )
  })

  it('作答紀錄（不送 inserted_at，由伺服器決定）', () => {
    const local = {
      id: 'aaaaaaaa-0000-0000-0000-000000000001',
      wordId: 'apple',
      rating: 3 as const,
      state: 1 as const,
      due: MS,
      stability: 1.5,
      difficulty: 4,
      scheduledDays: 0,
      learningSteps: 1,
      review: MS,
    }
    const row = {
      id: 'aaaaaaaa-0000-0000-0000-000000000001',
      user_id: U,
      word_id: 'apple',
      rating: 3,
      state: 1,
      due: ISO,
      stability: 1.5,
      difficulty: 4,
      scheduled_days: 0,
      learning_steps: 1,
      review: ISO,
    }
    expect(logToRow(local, U)).toEqual(row)
    const pulled = { ...row, due: PG, review: PG, inserted_at: PG }
    expect(logFromRow(pulled)).toEqual(local)
  })

  it('課程進度：雲端未完成（completed_at 為空）的列不帶回本機', () => {
    const local = { lessonId: 'a1-u1-l1', completedAt: MS, updatedAt: MS }
    const row = { user_id: U, lesson_id: 'a1-u1-l1', completed_at: ISO, updated_at: ISO }
    expect(progressToRow(local, U)).toEqual(row)
    expect(progressFromRow(row)).toEqual(local)
    expect(progressFromRow({ ...row, completed_at: null })).toBeNull()
  })

  it('跟讀修正', () => {
    const local = {
      id: 'aaaaaaaa-0000-0000-0000-000000000002',
      itemId: 'q1',
      targetText: 'I like apples.',
      recognizedText: 'I like apple.',
      correctedText: 'I like apples.',
      createdAt: MS,
    }
    const row = {
      id: 'aaaaaaaa-0000-0000-0000-000000000002',
      user_id: U,
      item_id: 'q1',
      target_text: 'I like apples.',
      recognized_text: 'I like apple.',
      corrected_text: 'I like apples.',
      created_at: ISO,
    }
    expect(speechToRow(local, U)).toEqual(row)
    expect(speechFromRow({ ...row, created_at: PG })).toEqual(local)
  })
})
