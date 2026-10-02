// 作答結果 → FSRS 評分（TASK-12 通用對應，創辦人 G2 裁示）：答錯＝Again；答對但超過 15 秒或用了提示＝Hard；其餘答對＝Good；不出 Easy
import { Grade } from '../srs/scheduler'

export const HARD_AFTER_MS = 15_000

export interface AnswerInput {
  correct: boolean
  elapsedMs: number
  /** 單字卡「看例句提示」；查其他字不算（components.md §12） */
  usedHint: boolean
}

export function gradeFor({ correct, elapsedMs, usedHint }: AnswerInput): Grade {
  if (!correct) return Grade.Again
  if (usedHint || elapsedMs > HARD_AFTER_MS) return Grade.Hard
  return Grade.Good
}
