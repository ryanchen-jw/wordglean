// 設定頁 AI 批改區（設計 s11 預設／已連結）：一鍵授權（PKCE）、改用貼上金鑰、模型選擇（標價格與是否免費）、
// 今日免費額度、測試目前模型、解除連結（二次確認）。金鑰只存這支手機
import { Check, ChevronRight, CircleCheck, KeyRound, LoaderCircle, Lock } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { db as appDb } from '../../data/appDb'
import type { LinguaDb } from '../../data/db'
import { useLiveQuery } from '../../data/useLiveQuery'
import { t, type MessageKey } from '../../i18n/t'
import { fetchKeyInfo, listModels, type FailureKind, type ModelInfo } from '../../llm/client'
import { gradeWriting } from '../../llm/grade'
import type { GradeTask } from '../../llm/gradePrompt'
import { clearLink, getLink, setModel, type OpenRouterLink } from '../../llm/keyStore'
import { beginAuth } from '../../llm/pkce'
import { clearOauthFailed, oauthFailed } from '../../llm/startup'
import { navigate } from '../../router'
import { BottomSheet } from '../../ui/BottomSheet'
import { Button } from '../../ui/Button'
import { ConfirmDialog } from '../../ui/ConfirmDialog'
import modelTestTask from './modelTestTask.json'

type Props = {
  db?: LinguaDb
  fetchFn?: typeof fetch
  /** 前往授權頁（測試替換；預設整頁跳轉） */
  go?: (url: string) => void
}

// 欄寬 minmax(0,1fr)：付費模型 id 很長時（不含空白）不得以 min-content 撐寬卡片（走查 P0）
const sectionCls =
  'grid grid-cols-[minmax(0,1fr)] gap-2.5 rounded-2xl border border-line bg-surface p-4'
const titleCls = 'text-caption tracking-[0.04em] text-muted'

function price(n: number) {
  return String(Math.round(n * 100) / 100)
}

function ModelSheet({
  selected,
  fetchFn,
  onSelect,
  onClose,
}: {
  selected: string
  fetchFn: typeof fetch
  onSelect: (id: string) => void
  onClose: () => void
}) {
  const [models, setModels] = useState<ModelInfo[] | null | 'failed'>(null)
  useEffect(() => {
    listModels(fetchFn).then(setModels, () => setModels('failed'))
  }, [fetchFn])
  const label = t('settings.ai.model')
  return (
    <BottomSheet label={label} onClose={onClose}>
      <h2 className="font-heading text-title-sm font-bold">{label}</h2>
      {models === null && (
        <p className="flex items-center gap-2 text-secondary text-muted" aria-busy="true">
          <LoaderCircle size={20} aria-hidden="true" className="animate-spin" />
          {t('settings.ai.modelsLoading')}
        </p>
      )}
      {models === 'failed' && (
        <p role="alert" className="text-secondary text-error">
          {t('settings.ai.modelsFailed')}
        </p>
      )}
      {Array.isArray(models) && (
        <ul role="listbox" aria-label={label} className="grid">
          {models.map((m) => {
            // 模型名稱是服務方的英文名稱：標 lang="en"
            const [before, after] = (
              m.free
                ? t('settings.ai.modelFree', { name: '\n' })
                : t('settings.ai.modelPrice', {
                    name: '\n',
                    input: price(m.promptPerM),
                    output: price(m.completionPerM),
                  })
            ).split('\n')
            const on = m.id === selected
            return (
              <li key={m.id} className="border-b border-line last:border-b-0">
                <button
                  type="button"
                  role="option"
                  aria-selected={on}
                  data-multiline
                  onClick={() => {
                    onSelect(m.id)
                    onClose()
                  }}
                  className={`flex min-h-13 w-full items-center justify-between gap-3 py-1.5 text-left active:bg-primary-soft ${
                    on ? 'font-bold text-primary' : ''
                  }`}
                >
                  <span className="min-w-0 break-words">
                    {before}
                    <span lang="en">{m.name}</span>
                    {after}
                  </span>
                  {on && <Check size={20} aria-hidden="true" className="flex-none" />}
                </button>
              </li>
            )
          })}
        </ul>
      )}
    </BottomSheet>
  )
}

const TEST_FAILURE: Record<FailureKind, MessageKey> = {
  quota: 'settings.ai.testQuota',
  keyInvalid: 'settings.ai.testKeyInvalid',
  network: 'settings.ai.testNetwork',
  other: 'settings.ai.testOther',
}

type TestState =
  | { kind: 'running' }
  | { kind: 'ok'; model: string; seconds: string }
  | { kind: 'fail'; reason: FailureKind }

/** 測試目前模型（TASK-29）：與實際批改同一條路徑真打一次，解析成功才算可用；不重試、不寫任何本機資料 */
function ModelTest({
  link: { apiKey, model },
  fetchFn,
}: {
  link: Pick<OpenRouterLink, 'apiKey' | 'model'>
  fetchFn: typeof fetch
}) {
  const [state, setState] = useState<TestState | null>(null)
  const running = useRef<AbortController | null>(null)

  // 離開畫面、換金鑰或換模型就中止：舊請求的結果不能算到新選擇頭上
  useEffect(() => () => running.current?.abort(), [apiKey, model])

  const run = async () => {
    if (running.current) return
    const controller = new AbortController()
    const { signal } = controller
    running.current = controller
    setState({ kind: 'running' })
    const start = performance.now()
    const out = await gradeWriting({ apiKey, model }, modelTestTask as GradeTask, fetchFn, {
      signal,
    }).catch(() => ({ ok: false as const, reason: 'other' as const }))
    running.current = null
    if (signal.aborted) setState(null)
    else if (out.ok)
      setState({
        kind: 'ok',
        model: out.model ?? model,
        seconds: ((performance.now() - start) / 1000).toFixed(1),
      })
    else setState({ kind: 'fail', reason: out.reason })
  }

  const busy = state?.kind === 'running'
  // 模型 id 是服務方的英文名稱：標 lang="en"，切開文案前後段
  const [before, after] =
    state?.kind === 'ok'
      ? t('settings.ai.testOk', { model: '\n', seconds: state.seconds }).split('\n')
      : []
  const tone =
    state?.kind === 'ok' ? 'text-correct' : state?.kind === 'fail' ? 'text-error' : 'text-muted'
  return (
    <div>
      <Button variant="secondary" disabled={busy} aria-busy={busy} onClick={run}>
        {t('settings.ai.testButton')}
      </Button>
      <p className="mt-1.5 text-caption text-muted">{t('settings.ai.testNote')}</p>
      {/* 結果區常駐（空的時不占位）：live region 要先在畫面上，內容變動才念得出來 */}
      <p role="status" className={`mt-1.5 text-secondary break-words empty:mt-0 ${tone}`}>
        {busy && (
          <span className="flex items-center gap-2">
            <LoaderCircle size={20} aria-hidden="true" className="flex-none animate-spin" />
            {t('settings.ai.testRunning')}
          </span>
        )}
        {state?.kind === 'ok' && (
          <>
            {before}
            <span lang="en">{state.model}</span>
            {after}
          </>
        )}
        {state?.kind === 'fail' && t(TEST_FAILURE[state.reason])}
      </p>
    </div>
  )
}

export function AiSection({
  db = appDb,
  fetchFn = fetch,
  go = (url) => location.assign(url),
}: Props) {
  const link = useLiveQuery(() => getLink(db), [db])
  // 授權回呼失敗的提示只顯示一次：進頁時讀、讀完清掉旗標
  const [failed] = useState(oauthFailed)
  const [starting, setStarting] = useState(false)
  const [info, setInfo] = useState<{ apiKey: string; remaining: number | null } | null>(null)
  const [picking, setPicking] = useState(false)
  const [confirming, setConfirming] = useState(false)
  const apiKey = link?.apiKey

  useEffect(() => clearOauthFailed(), [])

  // 今日免費額度：只顯示目前這把金鑰查到的值
  useEffect(() => {
    if (!apiKey) return
    let alive = true
    fetchKeyInfo(apiKey, fetchFn).then(
      (k) => alive && setInfo({ apiKey, remaining: k.freeRemaining }),
      () => {},
    )
    return () => {
      alive = false
    }
  }, [apiKey, fetchFn])

  const authorize = async () => {
    setStarting(true)
    go(await beginAuth(location.origin))
  }

  if (link === undefined)
    return (
      <section className={sectionCls}>
        <h2 className={titleCls}>{t('settings.ai.title')}</h2>
      </section>
    )

  if (link === null)
    return (
      <section className={sectionCls}>
        <h2 className={titleCls}>{t('settings.ai.title')}</h2>
        <span className="text-secondary text-muted">{t('settings.ai.status')}</span>
        {/* 文案待 G3；窄螢幕特大字級允許折兩行、置中（走查 P1-2） */}
        <Button
          data-multiline
          className="py-2 text-center"
          disabled={starting}
          aria-busy={starting}
          onClick={authorize}
        >
          {/* 圖示與文字同一段行內內容：折行時圖示跟著第一行、整段置中 */}
          <span className="text-balance">
            <KeyRound size={20} aria-hidden="true" className="mr-2 inline align-[-0.2em]" />
            {t('settings.ai.oauthButton')}
          </span>
        </Button>
        {failed && (
          <p role="alert" className="text-secondary text-error">
            {t('settings.ai.oauthFail')}
          </p>
        )}
        <Button variant="text" onClick={() => navigate('/openrouter')}>
          {t('settings.ai.pasteKey')}
          <ChevronRight size={20} aria-hidden="true" />
        </Button>
        <span className="flex gap-1.5 text-caption text-muted">
          <Lock size={20} aria-hidden="true" className="flex-none" />
          {t('settings.ai.privacy')}
        </span>
        <span className="pl-[26px] text-caption text-muted">{t('settings.ai.writingPrivacy')}</span>
      </section>
    )

  const free = link.model.endsWith(':free')
  const remaining = info?.apiKey === link.apiKey ? info.remaining : null
  return (
    <section className={sectionCls} data-testid="ai-linked">
      <h2 className={titleCls}>{t('settings.ai.title')}</h2>
      <span className="flex items-center gap-1.5 text-correct">
        <CircleCheck size={20} aria-hidden="true" className="flex-none" />
        {t('settings.ai.linked')}
      </span>
      <button
        type="button"
        onClick={() => setPicking(true)}
        className="flex min-h-13 w-full items-center justify-between gap-3 rounded-control border border-line px-4 py-1.5 text-left active:bg-primary-soft"
      >
        <span className="flex-none">{t('settings.ai.model')}</span>
        <span className="inline-flex min-w-0 items-center gap-1 text-right text-secondary text-muted">
          {free ? (
            t('settings.ai.freeModel')
          ) : (
            <span lang="en" className="min-w-0 truncate">
              {link.model}
            </span>
          )}
          <ChevronRight size={20} aria-hidden="true" className="flex-none" />
        </span>
      </button>
      {remaining !== null && (
        <span className="text-secondary text-muted">
          {t('settings.ai.quota', { count: remaining })}
        </span>
      )}
      <ModelTest link={link} fetchFn={fetchFn} />
      {/* 改用另一種連結方式（TASK-33）：成功才覆寫金鑰（saveLink 保留模型）；取消或失敗原連結不動 */}
      {link.via === 'oauth' ? (
        <Button variant="text" onClick={() => navigate('/openrouter')}>
          {t('settings.ai.pasteKey')}
          <ChevronRight size={20} aria-hidden="true" />
        </Button>
      ) : (
        <Button
          variant="text"
          data-multiline
          className="text-left"
          disabled={starting}
          aria-busy={starting}
          onClick={authorize}
        >
          {t('settings.ai.oauthButton')}
          <ChevronRight size={20} aria-hidden="true" className="flex-none" />
        </Button>
      )}
      {failed && (
        <p role="alert" className="text-secondary text-error">
          {t('settings.ai.oauthFail')}
        </p>
      )}
      <Button variant="danger" onClick={() => setConfirming(true)}>
        {t('settings.ai.unlink')}
      </Button>
      {picking && (
        <ModelSheet
          selected={link.model}
          fetchFn={fetchFn}
          onSelect={(id) => setModel(db, id)}
          onClose={() => setPicking(false)}
        />
      )}
      {confirming && (
        <ConfirmDialog
          title={t('settings.ai.unlinkConfirmTitle')}
          body={t('settings.ai.unlinkConfirmBody')}
          safeLabel={t('settings.ai.unlinkCancel')}
          riskLabel={t('settings.ai.unlink')}
          onSafe={() => setConfirming(false)}
          onRisk={async () => {
            await clearLink(db)
            setConfirming(false)
          }}
        />
      )}
    </section>
  )
}
