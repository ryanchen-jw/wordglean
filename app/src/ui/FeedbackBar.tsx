// 答對／答錯回饋條（components.md 微互動）：向上位移 16px＋淡入，✓／✗ 圖示 0.8→1；不搖晃、不閃爍
import { Check, X } from 'lucide-react'
import type { ReactNode } from 'react'

type Props = { tone: 'ok' | 'no'; title: ReactNode; children?: ReactNode }

export function FeedbackBar({ tone, title, children }: Props) {
  const Icon = tone === 'ok' ? Check : X
  return (
    <div
      role="status"
      data-feedback={tone}
      className={`grid animate-[lg-rise-in_var(--lg-duration-feedback)_var(--lg-ease)] gap-1 rounded-control px-3.5 py-3 text-secondary ${
        tone === 'ok' ? 'bg-correct-bg text-correct' : 'bg-error-bg text-error'
      }`}
    >
      <strong className="flex items-start gap-1.5 text-body font-bold">
        <Icon
          size={20}
          aria-hidden="true"
          className="mt-[3px] flex-none animate-[lg-pop-in_var(--lg-duration-feedback)_var(--lg-ease)]"
        />
        <span className="min-w-0">{title}</span>
      </strong>
      {children && <div className="grid gap-1 text-text">{children}</div>}
    </div>
  )
}
