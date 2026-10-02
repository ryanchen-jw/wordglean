// 今日學習組裝（規格 §8：先複習到期單字，再接下一個小課）；規則見 docs/verification/2026-10-02-task18-daily-flow-evidence/proposal.md
import { currentLevel, nextLesson, type Level, type LevelDoc } from '../curriculum/curriculum'
import type { LinguaDb, Settings } from '../data/db'
import { DEFAULT_SETTINGS, getSettings, getTodayQuota, inPool } from '../data/repo'
import { CardState } from '../srs/scheduler'

export interface DueWord {
  wordId: string
  due: number
}

export interface TodayPlan {
  /** 這一輪要複習的字，到期早的在前 */
  reviews: string[]
  /** 超過一輪上限、留到下一輪的到期字數 */
  reviewOverflow: number
  lessonId: string | null
  lessonBlocked: 'paused' | 'quota' | 'levelDone' | null
}

/** 一輪複習上限＝暫停門檻（D4）；每日新字設 0 時退回預設門檻，複習才不會一題都出不來 */
export function reviewCapOf(s: Pick<Settings, 'dailyNewLimit' | 'pauseMultiplier'>): number {
  return (
    s.dailyNewLimit * s.pauseMultiplier ||
    DEFAULT_SETTINGS.dailyNewLimit * DEFAULT_SETTINGS.pauseMultiplier
  )
}

export function assembleToday(input: {
  due: readonly DueWord[]
  quota: { remaining: number; paused: boolean }
  nextLessonId: string | null
  reviewCap: number
}): TodayPlan {
  const sorted = [...input.due].sort((a, b) => a.due - b.due || (a.wordId < b.wordId ? -1 : 1))
  const reviews = sorted.slice(0, input.reviewCap).map((w) => w.wordId)
  // 額度 >0 就出一課，可能超出最多一課的字數（D3）
  const lessonBlocked = input.quota.paused
    ? 'paused'
    : input.quota.remaining <= 0
      ? 'quota'
      : input.nextLessonId === null
        ? 'levelDone'
        : null
  return {
    reviews,
    reviewOverflow: sorted.length - reviews.length,
    lessonId: lessonBlocked ? null : input.nextLessonId,
    lessonBlocked,
  }
}

/** 已到期、已開始學、在單字池（inPool：課程來源或收藏）的字 */
async function loadDueWords(db: LinguaDb, nowMs: number): Promise<DueWord[]> {
  const rows = await db.wordPool
    .where('due')
    .belowOrEqual(nowMs)
    .filter((w) => w.state !== CardState.New && inPool(w))
    .toArray()
  return rows.map(({ wordId, due }) => ({ wordId, due }))
}

export async function loadTodayPlan(
  db: LinguaDb,
  nowMs: number,
  timeZone: string,
  nextLessonId: string | null,
): Promise<TodayPlan> {
  const [due, quota, settings] = await Promise.all([
    loadDueWords(db, nowMs),
    getTodayQuota(db, nowMs, timeZone),
    getSettings(db),
  ])
  return assembleToday({ due, quota, nextLessonId, reviewCap: reviewCapOf(settings) })
}

/** 推薦的下一課：目前級距（設定的級距優先〔TASK-17〕，沒有再取最後完成那課的級距，都沒有為 A1）中第一個未完成的課；與首頁同規則 */
export async function loadNextLessonId(
  db: LinguaDb,
  loadLevel: (level: Level) => Promise<LevelDoc>,
): Promise<string | null> {
  const [progress, settings] = await Promise.all([db.courseProgress.toArray(), getSettings(db)])
  const doc = await loadLevel(settings.cefrLevel ?? currentLevel(progress) ?? 'A1')
  return nextLesson(doc, new Set(progress.map((p) => p.lessonId)))?.lessonId ?? null
}
