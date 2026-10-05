import type { LessonItem } from '../../lesson/items'
import type { Step } from '../../lesson/queue'
import type { ChoiceState } from '../../ui/ChoiceOption'

/** 題型畫面的共同介面：答完呼叫 onAnswer（計時由小課畫面負責），按「繼續」呼叫 onContinue */
export interface QuestionProps<I extends LessonItem = LessonItem> {
  item: I
  step: Step
  /** skipped＝沒作答就跳過（跟讀「先跳過這題」）：算答錯；錯題重做時不再出
   *  silent＝題目自己播過音效（配對題每配一對各一聲），作答時不再播答對／答錯 */
  onAnswer: (answer: {
    correct: boolean
    usedHint: boolean
    skipped?: boolean
    silent?: boolean
  }) => void
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
