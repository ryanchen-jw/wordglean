// 首頁「我的成長」（TASK-26，創辦人 2026-10-06 裁示）：已學／記得字數、這週新學、程度估計；全在本機計算
import { LEVELS, type Level } from '../curriculum/curriculum'
import { localDayKey } from '../srs/daily'

const DAY_MS = 86_400_000
/** R≥0.9 算記得 */
export const REMEMBER_R = 0.9
/** 某級記得的字 ≥ 該級總字數 70% 算達到 */
export const LEVEL_UP_RATIO = 0.7

/** 達到過的最高程度（只升不降）；rank 0＝入門、1–5＝A1–C1；只存本機、不同步 */
export interface GrowthRecord {
  key: 'local'
  maxRank: number
  /** 記得的字讓程度升上 maxRank 的時間；起點（分級）帶來的程度為 null */
  reachedAt: number | null
}

export interface PoolMemory {
  wordId: string
  stability: number
  lastReview: number | null
}

export interface GrowthInput {
  /** 作答紀錄（wordId、作答時間）；練習模式不寫，故全數算數 */
  logs: readonly { wordId: string; review: number }[]
  pool: readonly PoolMemory[]
  /** 各級課綱字（小寫）；總字數＝其大小 */
  levelWords: Record<Level, ReadonlySet<string>>
  /** 分級測驗推薦級（設定的級距）；null＝未分級 */
  placed: Level | null
  record: GrowthRecord | undefined
  nowMs: number
  timeZone: string
}

export interface LevelProgress {
  level: Level
  remembered: number
  total: number
}

export interface GrowthModel {
  learned: number
  remembered: number
  thisWeek: number
  /** 目前程度；null＝入門 */
  level: Level | null
  /** 下一級與其記得比例（無條件捨去的百分比）；已達 C1 為 null */
  next: { level: Level; pct: number } | null
  levels: LevelProgress[]
  /** 今天剛升上的級距（升級提示）；沒有為 null */
  reachedToday: Level | null
}

/** FSRS 可提取率；t＝距上次複習天數、S＝stability */
export const retrievability = (t: number, s: number) => (1 + ((19 / 81) * t) / s) ** -0.5

export function isRemembered(w: Omit<PoolMemory, 'wordId'>, nowMs: number): boolean {
  if (w.lastReview === null || w.stability <= 0) return false
  return retrievability((nowMs - w.lastReview) / DAY_MS, w.stability) >= REMEMBER_R
}

/** 起點＝推薦級的前一級；未分級或推薦 A1＝入門（0） */
export const startRank = (placed: Level | null) =>
  placed ? Math.max(0, LEVELS.indexOf(placed)) : 0

const levelOfRank = (rank: number): Level | null => (rank > 0 ? LEVELS[rank - 1] : null)

export function computeGrowth(input: GrowthInput): { model: GrowthModel; record: GrowthRecord } {
  const { nowMs } = input
  const firstSeen = new Map<string, number>()
  for (const l of input.logs) {
    const prev = firstSeen.get(l.wordId)
    if (prev === undefined || l.review < prev) firstSeen.set(l.wordId, l.review)
  }
  let thisWeek = 0
  for (const t of firstSeen.values()) if (t > nowMs - 7 * DAY_MS) thisWeek++

  const remembered = input.pool.filter((w) => isRemembered(w, nowMs)).map((w) => w.wordId)
  const levels = LEVELS.map((level) => ({
    level,
    remembered: remembered.filter((id) => input.levelWords[level].has(id)).length,
    total: input.levelWords[level].size,
  }))
  const reached = (p: LevelProgress) => p.total > 0 && p.remembered >= p.total * LEVEL_UP_RATIO
  const memRank = levels.findLastIndex(reached) + 1

  const start = startRank(input.placed)
  const prev = input.record
  const base = Math.max(prev?.maxRank ?? 0, start)
  const record: GrowthRecord =
    memRank > base
      ? { key: 'local', maxRank: memRank, reachedAt: nowMs }
      : prev && prev.maxRank >= base
        ? prev
        : { key: 'local', maxRank: base, reachedAt: null }

  const rank = record.maxRank
  const nextP = levels[rank]
  const reachedToday =
    record.reachedAt !== null &&
    localDayKey(record.reachedAt, input.timeZone) === localDayKey(nowMs, input.timeZone)
      ? levelOfRank(rank)
      : null

  return {
    model: {
      learned: firstSeen.size,
      remembered: remembered.length,
      thisWeek,
      level: levelOfRank(rank),
      next: nextP
        ? {
            level: nextP.level,
            pct: nextP.total ? Math.floor((nextP.remembered / nextP.total) * 100) : 0,
          }
        : null,
      levels,
      reachedToday,
    },
    record,
  }
}
