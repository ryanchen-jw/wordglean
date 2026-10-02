// 確認框（components.md §13）：安全選項在上、主要按鈕、開啟時取得焦點；Esc 或點遮罩＝選安全選項
import { useEffect, useRef } from 'react'
import { Button } from './Button'

type Props = {
  title: string
  body: string
  safeLabel: string
  riskLabel: string
  onSafe: () => void
  onRisk: () => void
}

export function ConfirmDialog({ title, body, safeLabel, riskLabel, onSafe, onRisk }: Props) {
  const safeBtn = useRef<HTMLButtonElement>(null)
  const safeRef = useRef(onSafe)
  useEffect(() => {
    safeRef.current = onSafe
  })

  useEffect(() => {
    const opener = document.activeElement as HTMLElement | null
    safeBtn.current?.focus()
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && safeRef.current()
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('keydown', onKey)
      opener?.focus()
    }
  }, [])

  return (
    <div className="fixed inset-0 z-30 grid place-items-center px-5">
      <div
        data-testid="dialog-scrim"
        className="absolute inset-0 animate-[lg-fade-in_var(--lg-duration-feedback)_var(--lg-ease)] bg-scrim"
        onClick={onSafe}
      />
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-title"
        aria-describedby="confirm-desc"
        className="relative grid max-h-[calc(100dvh-40px)] w-full gap-3 overflow-y-auto overscroll-contain rounded-card bg-surface px-5 pt-6 pb-5 shadow-sheet"
      >
        <h2 id="confirm-title" className="font-heading text-title-sm font-bold text-balance">
          {title}
        </h2>
        <p id="confirm-desc" className="text-secondary text-muted">
          {body}
        </p>
        <Button ref={safeBtn} onClick={onSafe}>
          {safeLabel}
        </Button>
        <Button variant="secondary" onClick={onRisk}>
          {riskLabel}
        </Button>
      </div>
    </div>
  )
}
