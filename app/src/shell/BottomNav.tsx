// 底部導覽（components.md §5）：今天／課程／單字庫
import { BookOpen, MapIcon, Sun, type LucideIcon } from 'lucide-react'
import { t, type MessageKey } from '../i18n/t'
import { Link } from '../Link'
import { usePathname } from '../router'

const TABS: { to: string; label: MessageKey; Icon: LucideIcon }[] = [
  { to: '/', label: 'nav.bar.today', Icon: Sun },
  { to: '/course', label: 'nav.bar.course', Icon: MapIcon },
  { to: '/words', label: 'nav.bar.words', Icon: BookOpen },
]

export function BottomNav() {
  const pathname = usePathname()
  return (
    <nav
      aria-label={t('nav.bar.label')}
      className="grid flex-none grid-cols-3 border-t border-line bg-surface pb-[env(safe-area-inset-bottom)]"
    >
      {TABS.map(({ to, label, Icon }) => {
        const active = pathname === to
        return (
          <Link
            key={to}
            to={to}
            aria-current={active ? 'page' : undefined}
            className={`relative grid min-h-14 justify-items-center gap-0.5 pt-2 pb-1 text-caption active:bg-primary-soft ${
              active
                ? 'font-bold text-primary after:absolute after:bottom-0 after:h-1 after:w-5 after:rounded-sm after:bg-primary'
                : 'text-muted'
            }`}
          >
            <Icon size={24} aria-hidden="true" />
            {t(label)}
          </Link>
        )
      })}
    </nav>
  )
}
