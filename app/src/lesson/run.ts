// 小課進度（純函式）：目前步驟、各步作答結果；存進 IndexedDB lessonRuns 供中途離開後接續
import type { Grade } from '../srs/scheduler'
import type { Step } from './queue'

export interface StepResult {
  correct: boolean
  elapsedMs: number
  usedHint: boolean
  /** 寫入 FSRS 的評分；只計分的步驟為 null */
  grade: Grade | null
  answeredAt: number
}

export interface LessonRun {
  lessonId: string
  stepKeys: string[]
  /** 目前步驟索引；等於 stepKeys.length 表示全部做完 */
  cursor: number
  /** 第一次作答（計分、FSRS 只看這裡；重做不改） */
  results: Record<string, StepResult>
  startedAt: number
  updatedAt: number
  /** 錯題重做：主輪做完有錯題才有；舊存檔沒有此欄 */
  retry?: RetryState
}

/**
 * 錯題重做（創辦人試用 2026-10-04 ⑤）：主輪做完後把答錯的題目（依原順序）再出一輪，仍錯的再出，直到全對才算做完。
 * 只是練習：不寫 FSRS、不改 results。重做時跳過（跟讀「先跳過這題」）的題目不再出，免得不能錄音的人永遠做不完
 */
export interface RetryState {
  /** 第幾輪重做（從 1 起） */
  round: number
  /** 這一輪要重做的步驟 key */
  keys: string[]
  /** 這一輪目前第幾題；等於 keys.length 表示做完 */
  cursor: number
  /** 這一輪已作答：true＝做對或跳過（不再出） */
  passed: Record<string, boolean>
}

export function createRun(lessonId: string, steps: readonly Step[], nowMs: number): LessonRun {
  return {
    lessonId,
    stepKeys: steps.map((s) => s.key),
    cursor: 0,
    results: {},
    startedAt: nowMs,
    updatedAt: nowMs,
  }
}

export function currentKey(run: LessonRun): string | null {
  return run.stepKeys[run.cursor] ?? null
}

/** 記錄目前步驟的作答；只能答目前這一步、且每步只答一次 */
export function withAnswer(
  run: LessonRun,
  key: string,
  result: Omit<StepResult, 'answeredAt'>,
  nowMs: number,
): LessonRun {
  if (currentKey(run) !== key) throw new Error(`不是目前的題目：${key}`)
  if (run.results[key]) throw new Error(`這題已作答：${key}`)
  return {
    ...run,
    results: { ...run.results, [key]: { ...result, answeredAt: nowMs } },
    updatedAt: nowMs,
  }
}

/** 按「繼續」：目前步驟答完才能往下 */
export function advance(run: LessonRun, nowMs: number): LessonRun {
  const key = currentKey(run)
  if (key === null) throw new Error('已經是最後一題')
  if (!run.results[key]) throw new Error(`這題還沒作答：${key}`)
  return { ...run, cursor: run.cursor + 1, updatedAt: nowMs }
}

/** 重做中目前的步驟；不在重做或這一輪做完為 null */
export function retryKey(run: LessonRun): string | null {
  return run.retry?.keys[run.retry.cursor] ?? null
}

/** 現在要作答的步驟（主輪或重做）；null＝這一課做完了 */
export function activeKey(run: LessonRun): string | null {
  return currentKey(run) ?? retryKey(run)
}

/** 現在這一題答過了沒（主輪看第一次作答、重做看這一輪） */
export function isAnswered(run: LessonRun): boolean {
  const main = currentKey(run)
  if (main !== null) return !!run.results[main]
  const key = retryKey(run)
  return key !== null && key in run.retry!.passed
}

/** 重做的題號與這一輪題數；不在重做為 null */
export function retryProgress(run: LessonRun): { n: number; total: number } | null {
  return retryKey(run) === null ? null : { n: run.retry!.cursor + 1, total: run.retry!.keys.length }
}

/** 記錄重做的作答；只能答目前這一題、每題只答一次 */
export function withRetryAnswer(
  run: LessonRun,
  key: string,
  { correct, skipped = false }: { correct: boolean; skipped?: boolean },
  nowMs: number,
): LessonRun {
  if (retryKey(run) !== key) throw new Error(`不是目前的重做題目：${key}`)
  const retry = run.retry!
  if (key in retry.passed) throw new Error(`這題已重做：${key}`)
  return {
    ...run,
    retry: { ...retry, passed: { ...retry.passed, [key]: correct || skipped } },
    updatedAt: nowMs,
  }
}

/** 按「繼續」：主輪往下；主輪做完有錯題就進重做；重做一輪做完，仍錯的再出一輪 */
export function proceed(run: LessonRun, nowMs: number): LessonRun {
  const retry = run.retry
  if (!retry) {
    const next = advance(run, nowMs)
    if (currentKey(next) !== null) return next
    const wrong = next.stepKeys.filter((k) => !next.results[k].correct)
    return wrong.length
      ? { ...next, retry: { round: 1, keys: wrong, cursor: 0, passed: {} } }
      : next
  }
  const key = retryKey(run)
  if (key === null) throw new Error('已經是最後一題')
  if (!(key in retry.passed)) throw new Error(`這題還沒作答：${key}`)
  if (retry.cursor + 1 < retry.keys.length)
    return { ...run, retry: { ...retry, cursor: retry.cursor + 1 }, updatedAt: nowMs }
  const still = retry.keys.filter((k) => !retry.passed[k])
  return {
    ...run,
    retry: still.length
      ? { round: retry.round + 1, keys: still, cursor: 0, passed: {} }
      : { ...retry, cursor: retry.keys.length },
    updatedAt: nowMs,
  }
}

export function isComplete(run: LessonRun): boolean {
  return run.stepKeys.every((k) => run.results[k])
}

export function score(run: LessonRun): { total: number; correct: number } {
  return {
    total: run.stepKeys.length,
    correct: run.stepKeys.filter((k) => run.results[k]?.correct).length,
  }
}

/** 存檔的進度是否對得上目前的題目（題目更新過就不接續） */
export function matchesQueue(run: LessonRun, steps: readonly Step[]): boolean {
  return run.stepKeys.length === steps.length && run.stepKeys.every((k, i) => k === steps[i].key)
}
