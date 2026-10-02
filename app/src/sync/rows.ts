// 雲端列 ↔ 本機資料的欄位換算；對照表見 supabase/CLAUDE.md（本機 UTC epoch ms ↔ 雲端 timestamptz）
import type { Level } from '../curriculum/curriculum'
import type { CourseProgress, PoolWord, ReviewLogRow, Settings, SpeechCorrection } from '../data/db'
import { createScheduler, type CardState, type Grade } from '../srs/scheduler'

const iso = (ms: number) => new Date(ms).toISOString()
const isoOrNull = (ms: number | null) => (ms === null ? null : iso(ms))
const ms = (s: string) => Date.parse(s)
const msOrNull = (s: string | null) => (s === null ? null : ms(s))

export interface SettingsRow {
  user_id: string
  daily_new_limit: number
  pause_multiplier: number
  desired_retention: number
  cefr_level: Level | null
  updated_at: string
}

// TASK-17 前寫入的本機列沒有 cefrLevel，推上去當 null
export const settingsToRow = (s: Settings, userId: string): SettingsRow => ({
  user_id: userId,
  daily_new_limit: s.dailyNewLimit,
  pause_multiplier: s.pauseMultiplier,
  desired_retention: s.desiredRetention,
  cefr_level: s.cefrLevel ?? null,
  updated_at: iso(s.updatedAt),
})

export const settingsFromRow = (r: SettingsRow): Settings => ({
  id: 'local',
  dailyNewLimit: r.daily_new_limit,
  pauseMultiplier: r.pause_multiplier,
  desiredRetention: r.desired_retention,
  cefrLevel: r.cefr_level,
  updatedAt: ms(r.updated_at),
})

export interface WordPoolRow {
  user_id: string
  word_id: string
  state: number
  due: string
  stability: number
  difficulty: number
  scheduled_days: number
  learning_steps: number
  reps: number
  lapses: number
  last_review: string | null
  course_refs: string[]
  added_at: string
}

export interface FavoriteRow {
  user_id: string
  word_id: string
  created_at: string
  deleted_at: string | null
  updated_at: string
}

/**
 * 已收藏推收藏列；取消過收藏（有修改時間）推墓碑列（deleted_at＝取消時間，TASK-16）；從未收藏不推。
 * updated_at＝收藏狀態修改時間，舊資料沒有時用推送時間
 */
export const wordToRows = (w: PoolWord, userId: string, nowIso: string) => ({
  pool: {
    user_id: userId,
    word_id: w.wordId,
    state: w.state,
    due: iso(w.due),
    stability: w.stability,
    difficulty: w.difficulty,
    scheduled_days: w.scheduledDays,
    learning_steps: w.learningSteps,
    reps: w.reps,
    lapses: w.lapses,
    last_review: isoOrNull(w.lastReview),
    course_refs: w.courseRefs,
    added_at: iso(w.addedAt),
  } satisfies WordPoolRow,
  favorite: favoriteRow(w, userId, nowIso),
})

function favoriteRow(w: PoolWord, userId: string, nowIso: string): FavoriteRow | null {
  const changed = w.favoriteUpdatedAt === undefined ? null : iso(w.favoriteUpdatedAt)
  if (w.favoritedAt !== null)
    return {
      user_id: userId,
      word_id: w.wordId,
      created_at: iso(w.favoritedAt),
      deleted_at: null,
      updated_at: changed ?? nowIso,
    }
  if (changed === null) return null
  return {
    user_id: userId,
    word_id: w.wordId,
    created_at: changed,
    deleted_at: changed,
    updated_at: changed,
  }
}

type FavoritePick = Pick<FavoriteRow, 'word_id' | 'created_at' | 'deleted_at'> &
  Partial<Pick<FavoriteRow, 'updated_at'>>

/** 單字池列與收藏列合成一筆本機單字；墓碑（deleted_at 非空）視為未收藏 */
export function wordFromRows(
  pool: Omit<WordPoolRow, 'user_id'> | undefined,
  fav: FavoritePick | undefined,
): PoolWord {
  const favoritedAt = fav && fav.deleted_at === null ? ms(fav.created_at) : null
  // 收藏狀態修改時間（TASK-16）：雲端列有 updated_at 才帶回
  const changed = fav?.updated_at ? { favoriteUpdatedAt: ms(fav.updated_at) } : {}
  if (!pool) {
    const at = ms(fav!.created_at)
    return {
      wordId: fav!.word_id,
      ...createScheduler().newCard(at),
      courseRefs: [],
      favoritedAt,
      ...changed,
      addedAt: at,
    }
  }
  return {
    wordId: pool.word_id,
    state: pool.state as CardState,
    due: ms(pool.due),
    stability: pool.stability,
    difficulty: pool.difficulty,
    scheduledDays: pool.scheduled_days,
    learningSteps: pool.learning_steps,
    reps: pool.reps,
    lapses: pool.lapses,
    lastReview: msOrNull(pool.last_review),
    courseRefs: pool.course_refs,
    favoritedAt,
    ...changed,
    addedAt: ms(pool.added_at),
  }
}

export interface ReviewLogDbRow {
  id: string
  user_id: string
  word_id: string
  rating: number
  state: number
  due: string
  stability: number
  difficulty: number
  scheduled_days: number
  learning_steps: number
  review: string
}

export const logToRow = (l: ReviewLogRow, userId: string): ReviewLogDbRow => ({
  id: l.id,
  user_id: userId,
  word_id: l.wordId,
  rating: l.rating,
  state: l.state,
  due: iso(l.due),
  stability: l.stability,
  difficulty: l.difficulty,
  scheduled_days: l.scheduledDays,
  learning_steps: l.learningSteps,
  review: iso(l.review),
})

export const logFromRow = (r: Omit<ReviewLogDbRow, 'user_id'>): ReviewLogRow => ({
  id: r.id,
  wordId: r.word_id,
  rating: r.rating as Grade,
  state: r.state as CardState,
  due: ms(r.due),
  stability: r.stability,
  difficulty: r.difficulty,
  scheduledDays: r.scheduled_days,
  learningSteps: r.learning_steps,
  review: ms(r.review),
})

export interface CourseProgressRow {
  user_id: string
  lesson_id: string
  completed_at: string | null
  updated_at: string
}

export const progressToRow = (p: CourseProgress, userId: string): CourseProgressRow => ({
  user_id: userId,
  lesson_id: p.lessonId,
  completed_at: iso(p.completedAt),
  updated_at: iso(p.updatedAt),
})

/** 本機的課程進度只記已完成；雲端未完成的列不帶回 */
export const progressFromRow = (r: Omit<CourseProgressRow, 'user_id'>): CourseProgress | null =>
  r.completed_at === null
    ? null
    : { lessonId: r.lesson_id, completedAt: ms(r.completed_at), updatedAt: ms(r.updated_at) }

export interface SpeechCorrectionRow {
  id: string
  user_id: string
  item_id: string
  target_text: string
  recognized_text: string
  corrected_text: string
  created_at: string
}

export const speechToRow = (c: SpeechCorrection, userId: string): SpeechCorrectionRow => ({
  id: c.id,
  user_id: userId,
  item_id: c.itemId,
  target_text: c.targetText,
  recognized_text: c.recognizedText,
  corrected_text: c.correctedText,
  created_at: iso(c.createdAt),
})

export const speechFromRow = (r: Omit<SpeechCorrectionRow, 'user_id'>): SpeechCorrection => ({
  id: r.id,
  itemId: r.item_id,
  targetText: r.target_text,
  recognizedText: r.recognized_text,
  correctedText: r.corrected_text,
  createdAt: ms(r.created_at),
})
