// 畫面外框：TabScreen＝有底部導覽的分頁（今天／課程／單字庫）；SubScreen＝有返回鍵、無導覽的子頁（設定等）
import { ArrowLeft, WifiOff } from 'lucide-react'
import { useId, type ReactNode } from 'react'
import { t } from '../i18n/t'
import { goBack } from '../router'
import { BottomNav } from './BottomNav'
import { useOnline } from './useOnline'

function OfflineStrip() {
  if (useOnline()) return null
  return (
    <div
      role="status"
      className="flex items-center gap-2 rounded-control bg-hint-bg px-3.5 py-2.5 text-secondary text-hint"
    >
      <WifiOff size={20} aria-hidden="true" className="flex-none" />
      {t('system.offline.strip')}
    </div>
  )
}

const frame = 'flex h-dvh flex-col bg-bg text-text'
const headerPad = 'px-5 pt-[calc(env(safe-area-inset-top)+6px)] pb-2.5'
// 欄寬 minmax(0,1fr)：內容（長英文字、輸入框固有寬度）的 min-content 不得撐寬版面（走查 P0-1）
const mainCls =
  'grid min-h-0 flex-1 grid-cols-[minmax(0,1fr)] content-start gap-3 overflow-y-auto px-5 pt-1 pb-5'
const titleCls = 'font-heading text-title font-bold'

// 不帶文字色：由使用處各自給（text-text／text-primary／text-muted），避免共用 class 的顏色在 CSS 順序上蓋掉覆寫
export const iconBtnCls =
  'inline-grid size-11 flex-none place-items-center rounded-xl active:bg-primary-soft'

type TabProps = { title: string; subtitle?: ReactNode; action?: ReactNode; children: ReactNode }

export function TabScreen({ title, subtitle, action, children }: TabProps) {
  return (
    <div className={frame}>
      <header className={`grid gap-0.5 ${headerPad}`}>
        <div className="flex min-h-11 items-center justify-between gap-3">
          <h1 className={titleCls}>{title}</h1>
          {action}
        </div>
        {subtitle != null && <p className="text-secondary text-muted">{subtitle}</p>}
      </header>
      <main className={mainCls}>
        <OfflineStrip />
        {children}
      </main>
      <BottomNav />
    </div>
  )
}

/** 流程頁（分級測驗等）：自訂頁首、可捲內容、固定在底部的動作區；無底部導覽 */
export function FlowScreen({
  header,
  footer,
  children,
}: {
  header: ReactNode
  footer: ReactNode
  children: ReactNode
}) {
  return (
    <div className={frame}>
      <header className={headerPad}>{header}</header>
      <main className={mainCls}>{children}</main>
      <footer className="grid flex-none gap-2.5 border-t border-line bg-bg px-5 pt-3 pb-[calc(env(safe-area-inset-bottom)+12px)]">
        {footer}
      </footer>
    </div>
  )
}

/**
 * reading：純閱讀的長文頁（隱私說明、授權與致謝）——捲動區裡沒有可聚焦的控件，鍵盤使用者捲不動；
 * 讓 main 本身可聚焦並以頁面標題命名（WCAG 2.1.1，axe scrollable-region-focusable）。其他子頁不變
 */
export function SubScreen({
  title,
  reading = false,
  children,
}: {
  title: string
  reading?: boolean
  children: ReactNode
}) {
  const id = useId()
  return (
    <div className={frame}>
      <header className={headerPad}>
        <div className="flex min-h-11 items-center gap-3">
          <button
            type="button"
            className={`${iconBtnCls} text-text`}
            aria-label={t('common.action.back')}
            onClick={goBack}
          >
            <ArrowLeft size={20} aria-hidden="true" />
          </button>
          <h1 id={id} className={titleCls}>
            {title}
          </h1>
        </div>
      </header>
      {reading ? (
        <main className={mainCls} tabIndex={0} aria-labelledby={id}>
          {children}
        </main>
      ) : (
        <main className={mainCls}>{children}</main>
      )}
    </div>
  )
}
