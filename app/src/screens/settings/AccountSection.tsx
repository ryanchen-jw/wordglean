// 設定頁「帳號與同步」：有設定 Supabase 時掛 TASK-20 的登入元件（傳 App 全域 db）；沒設定時只說明進度存在本機（規格 §3）
import { useState } from 'react'
import { AccountEntry } from '../../auth/AccountEntry'
import { authConfigFromEnv } from '../../auth/config'
import { db } from '../../data/appDb'
import { t } from '../../i18n/t'

export function AccountSection() {
  const [config] = useState(() => authConfigFromEnv(import.meta.env))
  return (
    <div data-testid="settings-account-slot" className="grid gap-2">
      {config ? (
        <AccountEntry config={config} db={db} />
      ) : (
        <div className="flex min-h-13 items-center rounded-2xl border border-line bg-surface px-4 text-secondary text-muted">
          {t('settings.account.signedOut')}
        </div>
      )}
    </div>
  )
}
