// 英文學習內容的文字渲染（components.md §12）。TASK-12 暫時版：純文字、不可點。
// TASK-16 以同名同 props 的可點查義版本取代本檔（disabled＝作答前會洩漏答案的字；onLookup＝查字次數記錄）
type Props = {
  text: string
  disabled?: ReadonlySet<string> | 'all'
  onLookup?: (word: string) => void
  className?: string
}

export function EnglishText({ text, className }: Props) {
  return (
    <span lang="en" className={className}>
      {text}
    </span>
  )
}
