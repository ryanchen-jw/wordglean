// 底部彈層（components.md §7 外框）：遮罩、拖曳把手；下滑、點遮罩或 Esc 關閉；開啟時焦點移入、關閉後還原
import { useEffect, useRef, useState, type PointerEvent, type ReactNode } from 'react'

const CLOSE_DRAG_PX = 80

type Props = { label: string; onClose: () => void; children: ReactNode }

export function BottomSheet({ label, onClose, children }: Props) {
  const sheet = useRef<HTMLDivElement>(null)
  const dragStart = useRef<number | null>(null)
  const [dragY, setDragY] = useState(0)
  // 呼叫端常傳 inline 函式；存 ref 讓焦點與 Esc 監聽只在開關時各做一次
  const closeRef = useRef(onClose)
  useEffect(() => {
    closeRef.current = onClose
  })

  useEffect(() => {
    const opener = document.activeElement as HTMLElement | null
    sheet.current?.focus()
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && closeRef.current()
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('keydown', onKey)
      opener?.focus()
    }
  }, [])

  const onDown = (e: PointerEvent) => {
    dragStart.current = e.clientY
    e.currentTarget.setPointerCapture(e.pointerId)
  }
  const onMove = (e: PointerEvent) => {
    if (dragStart.current !== null) setDragY(Math.max(0, e.clientY - dragStart.current))
  }
  const onUp = () => {
    dragStart.current = null
    if (dragY > CLOSE_DRAG_PX) onClose()
    else setDragY(0)
  }

  return (
    <div className="fixed inset-0 z-20">
      <div
        data-testid="sheet-scrim"
        className="absolute inset-0 animate-[lg-fade-in_var(--lg-duration-feedback)_var(--lg-ease)] bg-scrim"
        onClick={onClose}
      />
      <div
        ref={sheet}
        role="dialog"
        aria-modal="true"
        aria-label={label}
        tabIndex={-1}
        style={dragY ? { transform: `translateY(${dragY}px)` } : undefined}
        className="absolute inset-x-0 bottom-0 grid max-h-[60dvh] animate-[lg-sheet-in_var(--lg-duration-feedback)_var(--lg-ease)] content-start gap-3 overflow-y-auto rounded-t-sheet bg-surface px-5 pb-[calc(env(safe-area-inset-bottom)+24px)] shadow-sheet outline-none"
      >
        <div
          className="-mx-5 flex h-6 cursor-grab touch-none items-center justify-center"
          onPointerDown={onDown}
          onPointerMove={onMove}
          onPointerUp={onUp}
          onPointerCancel={onUp}
        >
          <div className="h-1 w-9 rounded-sm bg-border" />
        </div>
        {children}
      </div>
    </div>
  )
}
