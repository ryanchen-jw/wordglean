// 小課外框（設計 s03）：頁首 ✕＋進度條＋題數、可捲的內容區、固定的底部動作區
import { X } from 'lucide-react'
import type { ReactNode } from 'react'
import { t } from '../../i18n/t'
import { iconBtnCls } from '../../shell/Screen'

export const lessonFrameCls = 'flex h-dvh flex-col bg-bg text-text'

export function LessonHeader({
  n,
  total,
  onLeave,
}: {
  n?: number
  total?: number
  onLeave: () => void
}) {
  return (
    <header className="flex-none px-5 pt-[calc(env(safe-area-inset-top)+6px)] pb-2.5">
      <div className="flex min-h-11 items-center gap-2.5">
        <button
          type="button"
          className={iconBtnCls}
          aria-label={t('lesson.frame.leave')}
          onClick={onLeave}
        >
          <X size={24} aria-hidden="true" />
        </button>
        {n !== undefined && total !== undefined && (
          <>
            <div
              role="progressbar"
              aria-label={t('lesson.frame.progress')}
              aria-valuenow={n}
              aria-valuemin={0}
              aria-valuemax={total}
              className="h-1.5 flex-1 overflow-hidden rounded-full bg-line"
            >
              <div
                className="h-full rounded-full bg-primary transition-[width] duration-(--lg-duration-feedback) ease-standard"
                style={{ width: `${(n / total) * 100}%` }}
              />
            </div>
            <span className="text-caption text-muted tabular-nums">
              {t('lesson.frame.count', { n, total })}
            </span>
          </>
        )}
      </div>
    </header>
  )
}

export function LessonMain({ children }: { children: ReactNode }) {
  // auto-rows-max：內容超過畫面時整區捲動，不把自己會捲的閱讀卡壓到最小（320 特大字級實測）
  return (
    <main className="grid min-h-0 flex-1 auto-rows-max grid-cols-[minmax(0,1fr)] content-start gap-3 overflow-y-auto px-5 pt-1 pb-5">
      {children}
    </main>
  )
}

export function LessonFoot({
  children,
  plain,
  className = '',
}: {
  children: ReactNode
  /** 設計 s07 出題狀態：底部只有文字按鈕、無分隔線 */
  plain?: boolean
  className?: string
}) {
  return (
    <div
      className={`grid flex-none gap-2.5 bg-bg px-5 pt-3 pb-[calc(env(safe-area-inset-bottom)+12px)] ${plain ? '' : 'border-t border-line'} ${className}`}
    >
      {children}
    </div>
  )
}
