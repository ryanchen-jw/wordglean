// 單選選項（components.md §3）：整列可點、最小高 56px；左側字母標；作答後標示對錯，其餘停用
// 作答後改渲染成非按鈕：選項裡的英文字之後要能點查義（TASK-16），按鈕裡不能再包按鈕
import { Check, X } from 'lucide-react'
import type { ReactNode } from 'react'

export type ChoiceState = 'default' | 'selected' | 'correct' | 'wrong' | 'dim'

const box = 'flex min-h-14 w-full items-center gap-3 rounded-control text-left text-body'
// 底色只放在各狀態：共用的 bg-surface 在建置 CSS 裡排在 bg-correct-bg／bg-error-bg 之後，會蓋掉對錯填色
const byState: Record<ChoiceState, string> = {
  default: 'border border-border bg-surface px-3.5 py-2.5',
  selected: 'border-2 border-primary bg-surface px-[13px] py-[9px]',
  correct: 'border-2 border-correct bg-correct-bg px-[13px] py-[9px]',
  wrong: 'border-2 border-error bg-error-bg px-[13px] py-[9px]',
  dim: 'border border-line bg-surface px-3.5 py-2.5 text-disabled-text',
}
const badgeBy: Record<ChoiceState, string> = {
  default: 'border-border text-muted',
  selected: 'border-primary bg-primary text-on-primary',
  correct: 'border-correct text-correct',
  wrong: 'border-error text-error',
  dim: 'border-border text-muted',
}

type Props = {
  letter: string
  state: ChoiceState
  /** 有＝作答前可點的按鈕；無＝作答後的靜態列 */
  onSelect?: () => void
  children: ReactNode
}

export function ChoiceOption({ letter, state, onSelect, children }: Props) {
  const inner = (
    <>
      <b
        aria-hidden="true"
        className={`grid size-6.5 flex-none place-items-center rounded-full border font-sans text-caption font-semibold ${badgeBy[state]}`}
      >
        {letter}
      </b>
      <span className="min-w-0 flex-1">{children}</span>
      {state === 'correct' && (
        <Check size={20} aria-hidden="true" className="flex-none text-correct" />
      )}
      {state === 'wrong' && <X size={20} aria-hidden="true" className="flex-none text-error" />}
    </>
  )
  if (!onSelect)
    return (
      <div data-choice={state} className={`${box} ${byState[state]}`}>
        {inner}
      </div>
    )
  return (
    <button
      type="button"
      role="radio"
      aria-checked={state === 'selected'}
      data-choice={state}
      data-multiline
      onClick={onSelect}
      className={`${box} ${byState[state]} transition-[transform,background-color] duration-(--lg-duration-press) ease-standard active:scale-(--lg-press-scale) active:bg-primary-soft`}
    >
      {inner}
    </button>
  )
}
