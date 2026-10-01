// 首頁頂部「加到主畫面」卡片（D2，設計稿無此畫面，沿用卡片樣式）
import { X } from 'lucide-react'
import { t } from '../i18n/t'
import { Button } from '../ui/Button'
import { Card, cardTitleCls } from '../ui/Card'
import { installPrompt, useInstallPrompt, type InstallPrompt } from './installPrompt'
import { iconBtnCls } from './Screen'

export function InstallCard({ store = installPrompt }: { store?: InstallPrompt }) {
  const state = useInstallPrompt(store)
  if (state.kind === 'hidden') return null
  return (
    <Card>
      <div data-testid="install-card" className="flex items-start justify-between gap-2">
        <h2 className={`${cardTitleCls} pt-2`}>{t('install.card.title')}</h2>
        <button
          type="button"
          className={`${iconBtnCls} -mt-1 -mr-2 text-muted`}
          aria-label={t('install.card.close')}
          onClick={() => store.dismiss()}
        >
          <X size={20} aria-hidden="true" />
        </button>
      </div>
      <p className="text-secondary text-muted">
        {state.kind === 'ios' ? t('install.card.bodyIos') : t('install.card.bodyPrompt')}
      </p>
      {state.kind === 'prompt' && (
        <Button variant="secondary" onClick={() => store.install()}>
          {t('install.card.button')}
        </Button>
      )}
    </Card>
  )
}
