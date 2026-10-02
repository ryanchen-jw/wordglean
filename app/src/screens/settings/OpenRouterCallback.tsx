// OAuth PKCE 回呼（/openrouter/callback?code=…）：用授權碼＋這個分頁存的 verifier 換金鑰，存好回設定頁；
// 失敗（沒有 code、verifier 不見、換金鑰被拒、網路）回設定頁顯示「授權沒有完成」
import { LoaderCircle } from 'lucide-react'
import { useEffect, useRef } from 'react'
import { db as appDb } from '../../data/appDb'
import type { LinguaDb } from '../../data/db'
import { t } from '../../i18n/t'
import { saveLink } from '../../llm/keyStore'
import { exchangeCode, takeVerifier } from '../../llm/pkce'
import { markOauthFailed } from '../../llm/startup'
import { navigate } from '../../router'
import { SubScreen } from '../../shell/Screen'

type Props = { db?: LinguaDb; fetchFn?: typeof fetch; now?: () => number }

export function OpenRouterCallback({ db = appDb, fetchFn = fetch, now = Date.now }: Props) {
  const started = useRef(false)
  useEffect(() => {
    // 授權碼只能用一次：StrictMode 重跑 effect 時不再送第二次
    if (started.current) return
    started.current = true
    const code = new URLSearchParams(location.search).get('code')
    const verifier = takeVerifier()
    ;(async () => {
      if (!code || !verifier) throw new Error('缺少授權碼或 verifier')
      const key = await exchangeCode(code, verifier, fetchFn)
      await saveLink(db, key, 'oauth', now())
    })()
      .catch((e: unknown) => {
        console.error(e)
        markOauthFailed()
      })
      .finally(() => navigate('/settings', { replace: true }))
  }, [db, fetchFn, now])

  return (
    <SubScreen title={t('settings.header.title')}>
      <p
        data-testid="screen-openrouter-callback"
        aria-busy="true"
        className="flex items-center gap-2 py-6 text-secondary text-muted"
      >
        <LoaderCircle size={20} aria-hidden="true" className="animate-spin" />
        {t('settings.ai.oauthPending')}
      </p>
    </SubScreen>
  )
}
