// 貼上 OpenRouter 金鑰（設計 s11 貼金鑰錯誤）：先檢查格式，再向 OpenRouter 驗證（GET /key）後才存；
// 錯誤訊息在欄位正下方，說明原因與怎麼修
import { CircleX, LoaderCircle } from 'lucide-react'
import { useState } from 'react'
import { db as appDb } from '../../data/appDb'
import type { LinguaDb } from '../../data/db'
import { t, type MessageKey } from '../../i18n/t'
import { fetchKeyInfo, OpenRouterError } from '../../llm/client'
import { looksLikeKey, saveLink } from '../../llm/keyStore'
import { navigate } from '../../router'
import { SubScreen } from '../../shell/Screen'
import { Button } from '../../ui/Button'

type Props = { db?: LinguaDb; fetchFn?: typeof fetch; now?: () => number }

const KEY_PREFIX = 'sk-or-'

function ErrorText({ error }: { error: MessageKey }) {
  // 金鑰前綴是英文代碼：拆出來標 lang="en"、不斷行
  const [before, ...rest] = t(error).split(KEY_PREFIX)
  return (
    <p id="key-error" role="alert" className="flex items-start gap-1.5 text-secondary text-error">
      <CircleX size={20} aria-hidden="true" className="mt-[2px] flex-none" />
      <span>
        {before}
        {rest.length > 0 && (
          <span lang="en" className="font-en whitespace-nowrap">
            {KEY_PREFIX}
          </span>
        )}
        {rest.join(KEY_PREFIX)}
      </span>
    </p>
  )
}

export function OpenRouterKeyScreen({ db = appDb, fetchFn = fetch, now = Date.now }: Props) {
  const [key, setKey] = useState('')
  const [error, setError] = useState<MessageKey | null>(null)
  const [busy, setBusy] = useState(false)

  const save = async () => {
    const value = key.trim()
    if (!looksLikeKey(value)) return setError('settings.key.invalid')
    setBusy(true)
    setError(null)
    try {
      await fetchKeyInfo(value, fetchFn)
      await saveLink(db, value, 'paste', now())
      navigate('/settings', { replace: true })
    } catch (e) {
      setError(
        e instanceof OpenRouterError && e.kind === 'keyInvalid'
          ? 'settings.key.rejected'
          : 'settings.key.unverified',
      )
      setBusy(false)
    }
  }

  return (
    <SubScreen title={t('settings.header.title')}>
      <section
        data-testid="screen-openrouter-key"
        className="grid gap-2.5 rounded-2xl border border-line bg-surface p-4"
      >
        <h2 className="font-heading text-title-sm font-bold">{t('settings.key.title')}</h2>
        <label htmlFor="openrouter-key" className="text-caption text-muted">
          {t('settings.key.label')}
        </label>
        <input
          id="openrouter-key"
          lang="en"
          value={key}
          autoComplete="off"
          autoCapitalize="off"
          spellCheck={false}
          aria-invalid={error !== null}
          aria-describedby={error ? 'key-error' : undefined}
          onChange={(e) => setKey(e.target.value)}
          className={`min-h-13 w-full min-w-0 rounded-control border bg-surface px-4 font-en text-body text-text focus-visible:outline-2 focus-visible:outline-focus ${
            error ? 'border-error' : 'border-border'
          }`}
        />
        {error && <ErrorText error={error} />}
        <Button disabled={busy || !key.trim()} aria-busy={busy} onClick={save}>
          {busy && <LoaderCircle size={20} aria-hidden="true" className="animate-spin" />}
          {t(busy ? 'settings.key.verifying' : 'settings.key.save')}
        </Button>
      </section>
    </SubScreen>
  )
}
