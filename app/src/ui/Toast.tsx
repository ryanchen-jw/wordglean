// Toast（components.md §8）：反色、role=status 不搶焦點、4 秒後消失、可帶一個文字動作；
// 有底部彈層開著時改出現在畫面上方，避免蓋住彈層內容
import { CircleCheck } from 'lucide-react'
import { useEffect, useRef } from 'react'

export const TOAST_MS = 4000

type Props = {
  message: string
  action?: { label: string; onClick: () => void }
  /** top＝底部彈層開著時；bottom＝浮在底部導覽上方 */
  placement: 'top' | 'bottom'
  onDismiss: () => void
}

export function Toast({ message, action, placement, onDismiss }: Props) {
  const dismissRef = useRef(onDismiss)
  useEffect(() => {
    dismissRef.current = onDismiss
  })
  useEffect(() => {
    const timer = setTimeout(() => dismissRef.current(), TOAST_MS)
    return () => clearTimeout(timer)
  }, [message])

  return (
    <div
      role="status"
      aria-live="polite"
      className={`fixed inset-x-4 z-30 flex min-h-11 items-center gap-2 rounded-control bg-text px-3.5 py-1 text-secondary text-bg shadow-toast ${
        placement === 'top'
          ? 'top-[calc(env(safe-area-inset-top)+12px)]'
          : 'bottom-[calc(env(safe-area-inset-bottom)+72px)]'
      }`}
    >
      <CircleCheck size={20} aria-hidden="true" className="flex-none" />
      <span className="min-w-0 flex-1">{message}</span>
      {action && (
        <button
          type="button"
          onClick={action.onClick}
          className="-mr-2 min-h-11 min-w-11 flex-none px-2 font-bold underline"
        >
          {action.label}
        </button>
      )}
    </div>
  )
}
