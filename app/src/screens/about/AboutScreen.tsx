// 設定 →「隱私說明・授權・原始碼」（TASK-21）：通往隱私說明與授權與致謝，並說明原始碼授權；
// 建置時設了 VITE_SOURCE_URL（AGPL-3.0 第 13 條：自架者填自己的 repo 網址）才顯示原始碼連結
import { ChevronRight, ExternalLink } from 'lucide-react'
import { t } from '../../i18n/t'
import { navigate } from '../../router'
import { SubScreen } from '../../shell/Screen'
import { Card, cardTitleCls } from '../../ui/Card'

// 列樣式同設定頁的設定列
const rowCls =
  'flex min-h-13 w-full items-center justify-between gap-3 border border-t-0 border-line bg-surface px-4 py-1.5 text-left first:rounded-t-2xl first:border-t last:rounded-b-2xl active:bg-primary-soft'

const LINKS = [
  { to: '/about/privacy', label: 'about.page.privacy' },
  { to: '/about/licenses', label: 'about.page.licenses' },
] as const

const ENV_SOURCE_URL = import.meta.env.VITE_SOURCE_URL as string | undefined

export function AboutScreen({ sourceUrl = ENV_SOURCE_URL }: { sourceUrl?: string }) {
  const url = sourceUrl?.trim()
  return (
    <SubScreen title={t('about.page.title')}>
      <div data-testid="screen-about" className="contents">
        <div className="grid">
          {LINKS.map((link) => (
            <button
              key={link.to}
              type="button"
              className={rowCls}
              onClick={() => navigate(link.to)}
            >
              {t(link.label)}
              <ChevronRight size={20} aria-hidden="true" className="flex-none text-muted" />
            </button>
          ))}
        </div>
        <Card tight>
          <h2 className={cardTitleCls}>{t('about.source.title')}</h2>
          <p className="text-secondary break-words">{t('about.source.body')}</p>
          {url && (
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 items-center gap-1 self-start font-bold text-primary"
            >
              {t('about.source.link')}
              <ExternalLink size={20} aria-hidden="true" className="flex-none" />
            </a>
          )}
        </Card>
      </div>
    </SubScreen>
  )
}
