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
  results: Record<string, StepResult>
  startedAt: number
  updatedAt: number
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
