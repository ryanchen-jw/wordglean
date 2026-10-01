// 兩份資料快照的合併（本機 ↔ 雲端）；純函式，規則見 docs/verification/2026-10-02-task20-sync-evidence/proposal.md
// 輸出一律依主鍵排序：merge(a,b) 與 merge(b,a) 相同、重跑逐位元一致（AC#4）
import type { CourseProgress, PoolWord, ReviewLogRow, Settings, SpeechCorrection } from '../data/db'
import { createScheduler, DEFAULT_RETENTION } from '../srs/scheduler'

export interface SyncSnapshot {
  settings: Settings | null
  words: PoolWord[]
  reviewLogs: ReviewLogRow[]
  courseProgress: CourseProgress[]
  speechCorrections: SpeechCorrection[]
}

const cmp = (x: string, y: string) => (x < y ? -1 : x > y ? 1 : 0)
const byReviewThenId = (x: ReviewLogRow, y: ReviewLogRow) => x.review - y.review || cmp(x.id, y.id)

function unionBy<T>(a: T[], b: T[], key: (t: T) => string, combine: (x: T, y: T) => T): T[] {
  const map = new Map<string, T>()
  for (const t of [...a, ...b]) {
    const k = key(t)
    const prev = map.get(k)
    map.set(k, prev === undefined ? t : combine(prev, t))
  }
  return [...map.entries()].sort(([x], [y]) => cmp(x, y)).map(([, t]) => t)
}

const minNullable = (x: number | null, y: number | null) =>
  x === null ? y : y === null ? x : Math.min(x, y)

// 鍵排序後的 JSON，與物件建立時的鍵順序無關
export const stableJson = (o: object) => JSON.stringify(o, Object.keys(o).sort())

// 設定：最後修改者勝；同時間取穩定序列化較大者，與參數順序無關
function mergeSettings(a: Settings | null, b: Settings | null): Settings | null {
  if (!a || !b) return a ?? b
  if (a.updatedAt !== b.updatedAt) return b.updatedAt > a.updatedAt ? b : a
  return stableJson(b) > stableJson(a) ? b : a
}

export function mergeSnapshots(a: SyncSnapshot, b: SyncSnapshot): SyncSnapshot {
  const settings = mergeSettings(a.settings, b.settings)
  const reviewLogs = unionBy(
    a.reviewLogs,
    b.reviewLogs,
    (l) => l.id,
    (x) => x,
  ).sort(byReviewThenId)

  const logsByWord = new Map<string, ReviewLogRow[]>()
  for (const l of reviewLogs) {
    const list = logsByWord.get(l.wordId) ?? []
    list.push(l)
    logsByWord.set(l.wordId, list)
  }

  const scheduler = createScheduler(settings?.desiredRetention ?? DEFAULT_RETENTION)
  const words = unionBy(
    a.words,
    b.words,
    (w) => w.wordId,
    (x, y) => {
      // 無作答紀錄時沿用加入較早那筆的 FSRS 欄位（同時間取第一個）
      const base = y.addedAt < x.addedAt ? y : x
      return {
        ...base,
        courseRefs: [...new Set([...x.courseRefs, ...y.courseRefs])],
        favoritedAt: minNullable(x.favoritedAt, y.favoritedAt),
        addedAt: Math.min(x.addedAt, y.addedAt),
      }
    },
  ).map((w) => {
    const logs = logsByWord.get(w.wordId)
    // logs 已依 (review, id) 排序；replay 的排序為穩定排序，同毫秒時保留 id 順序
    const fsrs = logs ? scheduler.replay(logs) : {}
    return { ...w, ...fsrs, courseRefs: [...w.courseRefs].sort(cmp) }
  })

  const courseProgress = unionBy(
    a.courseProgress,
    b.courseProgress,
    (p) => p.lessonId,
    (x, y) => ({
      lessonId: x.lessonId,
      completedAt: Math.min(x.completedAt, y.completedAt),
      updatedAt: Math.max(x.updatedAt, y.updatedAt),
    }),
  )

  const speechCorrections = unionBy(
    a.speechCorrections,
    b.speechCorrections,
    (c) => c.id,
    (x) => x,
  )

  return { settings, words, reviewLogs, courseProgress, speechCorrections }
}
