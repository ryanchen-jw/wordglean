// 首頁「今天」的資料與狀態推導（設計 s01）；推導規則見 docs/verification/2026-10-02-task11-shell-evidence/proposal.md
import type { LinguaDb } from '../../data/db'
import { countDue, getSettings, getTodayQuota, inPool } from '../../data/repo'
import { CardState } from '../../srs/scheduler'
import { dayBoundsUtc, localDayKey } from '../../srs/daily'
import { currentLevel, type Level, type LessonRef } from '../../curriculum/curriculum'

// 時間估算（佔位，交 G3）：複習每字 15 秒、每課 5 分鐘（規格 §8）
const REVIEW_SECONDS_PER_WORD = 15
export const LESSON_MINUTES = 5
const DAY_MS = 86_400_000

/** 只從本機資料庫取得的部分（可放進 liveQuery） */
export interface HomeDbInput {
  firstRun: boolean
  level: Level | null
  completedIds: Set<string>
  dueCount: number
  dueTomorrow: number
  reviewsDoneToday: number
  lessonsDoneToday: number
  paused: boolean
  pauseThreshold: number
}

export interface HomeInput extends Omit<HomeDbInput, 'level' | 'completedIds'> {
  next: LessonRef | null
}

export type HomeState = 'first' | 'paused' | 'done' | 'default'

export interface HomeModel {
  state: HomeState
  dueCount: number
  dueTomorrow: number
  reviewMinutes: number
  /** 主卡估計總時間：到期複習＋下一課（有的話） */
  totalMinutes: number
  reviewsDone: number
  reviewsTotal: number
  lessonsDone: number
  lessonsTarget: number
  pauseThreshold: number
  next: LessonRef | null
}

export function buildHomeModel(input: HomeInput): HomeModel {
  const reviewMinutes = Math.ceil((input.dueCount * REVIEW_SECONDS_PER_WORD) / 60)
  const state: HomeState = input.firstRun
    ? 'first'
    : input.paused
      ? 'paused'
      : input.dueCount === 0 && input.lessonsDoneToday >= 1
        ? 'done'
        : 'default'
  return {
    state,
    dueCount: input.dueCount,
    dueTomorrow: input.dueTomorrow,
    reviewMinutes,
    totalMinutes: reviewMinutes + (input.next && !input.paused ? LESSON_MINUTES : 0),
    reviewsDone: input.reviewsDoneToday,
    reviewsTotal: input.reviewsDoneToday + input.dueCount,
    lessonsDone: input.lessonsDoneToday,
    lessonsTarget: 1,
    pauseThreshold: input.pauseThreshold,
    next: input.next,
  }
}

export async function loadHomeDbInput(
  db: LinguaDb,
  nowMs: number,
  timeZone: string,
): Promise<HomeDbInput> {
  const { startMs, endMs } = dayBoundsUtc(localDayKey(nowMs, timeZone), timeZone)
  const tomorrowEnd = dayBoundsUtc(localDayKey(endMs + DAY_MS / 2, timeZone), timeZone).endMs
  const [progress, wordCount, dueCount, dueTomorrow, reviewsDoneToday, quota, settings] =
    await Promise.all([
      db.courseProgress.toArray(),
      // 收藏後又復原（無來源）的字不在池中，不影響「第一次開啟」（TASK-16 D3）
      db.wordPool.filter(inPool).count(),
      countDue(db, nowMs),
      countDue(db, tomorrowEnd - 1),
      db.reviewLogs
        .where('review')
        .between(startMs, endMs, true, false)
        .filter((l) => l.state !== CardState.New)
        .count(),
      getTodayQuota(db, nowMs, timeZone),
      getSettings(db),
    ])
  return {
    firstRun: progress.length === 0 && wordCount === 0,
    level: currentLevel(progress),
    completedIds: new Set(progress.map((p) => p.lessonId)),
    dueCount,
    dueTomorrow,
    reviewsDoneToday,
    lessonsDoneToday: progress.filter((p) => p.completedAt >= startMs && p.completedAt < endMs)
      .length,
    paused: quota.paused,
    pauseThreshold: settings.dailyNewLimit * settings.pauseMultiplier,
  }
}
