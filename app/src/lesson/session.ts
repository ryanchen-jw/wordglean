// 小課與本機資料庫的接點：開始／接續、作答（FSRS 寫入與存進度同一交易）、繼續、結算
import type { LinguaDb } from '../data/db'
import { addFromCourse, completeLesson, recordReview } from '../data/repo'
import { gradeFor, type AnswerInput } from './grade'
import type { Step } from './queue'
import {
  createRun,
  isAnswered,
  isComplete,
  matchesQueue,
  proceed,
  score,
  withAnswer,
  withRetryAnswer,
  type LessonRun,
} from './run'

export interface SettleSummary {
  lessonId: string
  total: number
  correct: number
  /** 本課寫入單字池的字（依出題順序） */
  newWords: string[]
  /** 答錯的步驟 key */
  wrongKeys: string[]
}

/** 有對得上的存檔就接續（目前步驟已作答則直接跳下一題，含錯題重做），否則重新開始 */
export async function startOrResume(
  db: LinguaDb,
  lessonId: string,
  steps: readonly Step[],
  nowMs: number,
): Promise<{ run: LessonRun; resumed: boolean }> {
  const saved = await db.lessonRuns.get(lessonId)
  if (saved && matchesQueue(saved, steps)) {
    const run = isAnswered(saved) ? proceed(saved, nowMs) : saved
    if (run !== saved) await db.lessonRuns.put(run)
    return { run, resumed: true }
  }
  const run = createRun(lessonId, steps, nowMs)
  await db.lessonRuns.put(run)
  return { run, resumed: false }
}

/** 記錄作答；單字卡同時入池（新字）並寫 FSRS 評分，與存進度在同一交易，不會重複寫 */
export async function answerStep(
  db: LinguaDb,
  run: LessonRun,
  step: Step,
  input: AnswerInput,
  nowMs: number,
): Promise<LessonRun> {
  const grade = step.srsWord === null ? null : gradeFor(input)
  const next = withAnswer(run, step.key, { ...input, grade }, nowMs)
  await db.transaction(
    'rw',
    [db.wordPool, db.reviewLogs, db.settings, db.outbox, db.lessonRuns],
    async () => {
      if (step.srsWord !== null && grade !== null) {
        await addFromCourse(db, step.srsWord, run.lessonId, nowMs)
        await recordReview(db, step.srsWord, grade, nowMs)
      }
      await db.lessonRuns.put(next)
    },
  )
  return next
}

/** 錯題重做的作答：只存進度，不寫 FSRS、不改第一次作答（創辦人試用 2026-10-04 ⑤） */
export async function answerRetry(
  db: LinguaDb,
  run: LessonRun,
  step: Step,
  answer: { correct: boolean; skipped?: boolean },
  nowMs: number,
): Promise<LessonRun> {
  const next = withRetryAnswer(run, step.key, answer, nowMs)
  await db.lessonRuns.put(next)
  return next
}

/** 按「繼續」：主輪最後一題之後有錯題就進重做 */
export async function continueRun(db: LinguaDb, run: LessonRun, nowMs: number): Promise<LessonRun> {
  const next = proceed(run, nowMs)
  await db.lessonRuns.put(next)
  return next
}

/** 全部作答後結算：記完成這一課、清掉進度，再呼叫 onSettle（同步接線屬 TASK-18） */
export async function settleLesson(
  db: LinguaDb,
  run: LessonRun,
  steps: readonly Step[],
  { nowMs, onSettle }: { nowMs: number; onSettle?: (summary: SettleSummary) => void },
): Promise<SettleSummary> {
  if (!matchesQueue(run, steps)) throw new Error('進度與題目不符')
  if (!isComplete(run)) throw new Error('還有題目沒作答')
  await db.transaction('rw', [db.courseProgress, db.outbox, db.lessonRuns], async () => {
    await completeLesson(db, run.lessonId, nowMs)
    await db.lessonRuns.delete(run.lessonId)
  })
  const summary: SettleSummary = {
    lessonId: run.lessonId,
    ...score(run),
    newWords: steps.flatMap((s) => (s.srsWord === null ? [] : [s.srsWord])),
    wrongKeys: run.stepKeys.filter((k) => !run.results[k].correct),
  }
  onSettle?.(summary)
  return summary
}

/**
 * 練習模式（示範課 /lesson/demo，創辦人 2026-10-05 裁示二）：進度只留在記憶體，
 * 不寫 FSRS、單字池、作答紀錄、小課進度、完成課，也不觸發同步；介面與上面寫資料庫的函式相同（少了 db）
 */
export const practiceSession = {
  start: async (lessonId: string, steps: readonly Step[], nowMs: number) =>
    createRun(lessonId, steps, nowMs),
  answer: async (run: LessonRun, step: Step, input: AnswerInput, nowMs: number) =>
    withAnswer(run, step.key, { ...input, grade: null }, nowMs),
  answerRetry: async (
    run: LessonRun,
    step: Step,
    answer: { correct: boolean; skipped?: boolean },
    nowMs: number,
  ) => withRetryAnswer(run, step.key, answer, nowMs),
  continueRun: async (run: LessonRun, nowMs: number) => proceed(run, nowMs),
  async settle(run: LessonRun): Promise<SettleSummary> {
    if (!isComplete(run)) throw new Error('還有題目沒作答')
    return {
      lessonId: run.lessonId,
      ...score(run),
      // 沒有字入池、沒有排進複習：完成頁不顯示「已加入單字庫」「已排進明天的複習」
      newWords: [],
      wrongKeys: run.stepKeys.filter((k) => !run.results[k].correct),
    }
  },
}
