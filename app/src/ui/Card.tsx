// 卡片（components.md §2／§10）：surface 底＋1px line 細線、不用陰影；可點的卡按下縮放＋primary-soft 底
import type { ReactNode } from 'react'
import { Link } from '../Link'

const base = 'grid min-w-0 rounded-card border border-line bg-surface'
const pad = { normal: 'gap-2.5 p-5', tight: 'gap-1.5 p-4' }

type Props = { tight?: boolean; className?: string; children: ReactNode }

export function Card({ tight, className = '', children }: Props) {
  return <div className={`${base} ${pad[tight ? 'tight' : 'normal']} ${className}`}>{children}</div>
}

const press =
  'transition-[transform,background-color] duration-(--lg-duration-press) ease-standard active:scale-(--lg-press-scale) active:bg-primary-soft'

export function CardLink({ to, tight, className = '', children }: Props & { to: string }) {
  return (
    <Link to={to} className={`${base} ${pad[tight ? 'tight' : 'normal']} ${press} ${className}`}>
      {children}
    </Link>
  )
}

/** 整張可點、開彈層（不換頁）的卡片 */
export function CardButton({
  onClick,
  tight,
  className = '',
  children,
}: Props & { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`${base} ${pad[tight ? 'tight' : 'normal']} ${press} text-left ${className}`}
    >
      {children}
    </button>
  )
}

export const cardTitleCls = 'font-heading text-title-sm font-bold'
