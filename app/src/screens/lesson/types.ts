import type { LessonItem } from '../../lesson/items'
import type { Step } from '../../lesson/queue'
import type { ChoiceState } from '../../ui/ChoiceOption'

/** 題型畫面的共同介面：答完呼叫 onAnswer（計時由小課畫面負責），按「繼續」呼叫 onContinue */
export interface QuestionProps<I extends LessonItem = LessonItem> {
  item: I
  step: Step
  onAnswer: (answer: { correct: boolean; usedHint: boolean }) => void
  onContinue: () => void
  /** 跟讀每次送出（TASK-14）：辨識原文與送出句，由小課畫面寫入紀錄 */
  onSpeech?: (entry: { recognized: string; submitted: string }) => void
}

export const LETTERS = ['A', 'B', 'C', 'D', 'E', 'F']

/** 選項狀態：作答前＝未選／已選；作答後＝正解 ✓、選錯的 ✗、其餘停用 */
export function choiceState(
  i: number,
  { selected, picked, answer }: { selected: number | null; picked: number | null; answer: number },
): ChoiceState {
  if (picked === null) return i === selected ? 'selected' : 'default'
  if (i === answer) return 'correct'
  return i === picked ? 'wrong' : 'dim'
}
