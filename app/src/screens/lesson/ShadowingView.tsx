// 跟讀（設計 s04、components.md §6）：待錄 → 錄音中 → 轉文字中 → 確認／修改 → 送出後逐字比對
// 分數以第一次送出的句子為準（規格 §6 G2）；之後「再唸一次」只當練習，但每次送出都寫紀錄（Round 1 D1、D3）
// 設計偏差：模型未下載時先顯示下載鈕、按了才下載（D4）；回饋條第二行為目標句＋中譯（D6）
// 本機辨識不能用（瀏覽器不能錄音、沒有 WebAssembly、模型載入失敗）時才提出瀏覽器語音辨識後備，需先同意（D8）
import { Download, Info, LoaderCircle, Mic, MicOff, Square, Volume2 } from 'lucide-react'
import { useEffect, useRef, useState, useSyncExternalStore, type ReactNode } from 'react'
import { EnglishText } from '../../dict/EnglishText'
import { t } from '../../i18n/t'
import type { ShadowingItem } from '../../lesson/items'
import { speak, ttsAvailable } from '../../speech/speak'
import { compareWords, type Comparison } from '../../speech/align'
import { MicDeniedError, type MicPermission } from '../../speech/mic'
import { useSpeech } from '../../speech/services'
import type { SttState } from '../../speech/stt'
import { Button } from '../../ui/Button'
import { Card } from '../../ui/Card'
import { ConfirmDialog } from '../../ui/ConfirmDialog'
import { FeedbackBar } from '../../ui/FeedbackBar'
import { LessonFoot, LessonMain } from './frame'
import type { QuestionProps } from './types'
import { ZhText } from './ZhText'

type Ui =
  | { kind: 'idle'; failed?: boolean }
  | { kind: 'recording'; startedAt: number }
  | { kind: 'busy' }
  | { kind: 'confirm'; recognized: string; text: string }
  | { kind: 'result'; comparison: Comparison }

// 音量條靜止時的高度（設計 s04 recording）；錄音中依音量縮放
const WAVE = [6, 12, 20, 14, 22, 10, 16, 6]

const recBase =
  'grid size-[76px] place-items-center rounded-full transition-transform duration-(--lg-duration-press) ease-standard active:scale-(--lg-press-scale) disabled:active:scale-100'
const recCls = {
  idle: `${recBase} bg-primary text-on-primary`,
  on: `${recBase} bg-error text-on-primary shadow-[0_0_0_6px_var(--lg-error-bg),0_0_0_8px_var(--lg-error)]`,
  busy: `${recBase} bg-disabled-bg text-disabled-text`,
  denied: `${recBase} border-2 border-error bg-surface text-error`,
}

const reducedMotion = () =>
  typeof window !== 'undefined' && !!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

const clock = (ms: number) => {
  const s = Math.floor(ms / 1000)
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`
}

export function ShadowingView({
  item,
  onAnswer,
  onContinue,
  onSpeech,
}: QuestionProps<ShadowingItem>) {
  const speech = useSpeech()
  const model = useSyncExternalStore(speech.stt.subscribe, speech.stt.get)
  const [mic, setMic] = useState<MicPermission | null>(null)
  const [ui, setUi] = useState<Ui>({ kind: 'idle' })
  const [answered, setAnswered] = useState(false)
  const [level, setLevel] = useState(0)
  const [now, setNow] = useState(0)
  const [asking, setAsking] = useState(false)
  const [, setConsents] = useState(0)
  // 一次錄音：結束後回傳辨識文字（本機辨識或瀏覽器語音辨識）
  const recording = useRef<{ finish(): Promise<string>; cancel(): void } | null>(null)
  // 正在取得麥克風（防連點）；離開這題（跳過／卸載）後才到的錄音要立刻停掉，不留 live 音軌
  const starting = useRef(false)
  const gone = useRef(false)

  const moonshineBlocked = mic === 'unsupported' || !speech.moonshineAvailable()
  const offerWeb = speech.webSpeech.supported() && (moonshineBlocked || model.kind === 'failed')
  const web = offerWeb && speech.webSpeech.consented()

  useEffect(() => {
    let alive = true
    void speech.micPermission().then((p) => alive && setMic(p))
    void speech.stt.refresh()
    gone.current = false
    return () => {
      alive = false
      gone.current = true
      recording.current?.cancel()
    }
  }, [speech])

  // 模型已在快取：進題目就載入（不用再問）；未下載則等使用者按「下載」（D4）
  useEffect(() => {
    if (model.kind === 'downloaded' && mic !== null && !moonshineBlocked)
      void speech.stt.load().catch(() => undefined)
  }, [model.kind, mic, moonshineBlocked, speech])

  useEffect(() => {
    if (ui.kind !== 'recording') return
    const id = setInterval(() => setNow(Date.now()), 250)
    return () => clearInterval(id)
  }, [ui.kind])

  // 已送出過（再唸一次只是練習）就只往下，不再計分；未作答才記為答錯（Round 1 D2、D3）
  const skip = () => {
    gone.current = true
    recording.current?.cancel()
    recording.current = null
    if (!answered) onAnswer({ correct: false, usedHint: false })
    onContinue()
  }

  const startRec = async () => {
    if (starting.current || recording.current) return
    starting.current = true
    try {
      let take: { finish(): Promise<string>; cancel(): void }
      if (web) {
        const t = await speech.webSpeech.start()
        take = { finish: () => t.stop(), cancel: () => t.cancel() }
      } else {
        const rec = await speech.startRecording(reducedMotion() ? undefined : setLevel)
        take = {
          finish: async () => speech.stt.transcribe(await rec.stop()),
          cancel: () => rec.cancel(),
        }
      }
      if (gone.current) {
        take.cancel()
        return
      }
      recording.current = take
      const at = Date.now()
      setNow(at)
      setUi({ kind: 'recording', startedAt: at })
    } catch (e) {
      if (gone.current) return
      if (e instanceof MicDeniedError) setMic('denied')
      else {
        console.error('[speech] 無法開始錄音', e)
        setUi({ kind: 'idle', failed: true })
      }
    } finally {
      starting.current = false
    }
  }

  const stopRec = async () => {
    const rec = recording.current
    if (!rec) return
    recording.current = null
    setUi({ kind: 'busy' })
    try {
      const recognized = await rec.finish()
      setUi({ kind: 'confirm', recognized, text: recognized })
    } catch (e) {
      if (e instanceof MicDeniedError) {
        setMic('denied')
        setUi({ kind: 'idle' })
      } else {
        console.error('[speech] 轉文字失敗', e)
        setUi({ kind: 'idle', failed: true })
      }
    }
  }

  const allowMic = async () => {
    if (await speech.requestMic()) setMic('granted')
  }

  const submit = (recognized: string, text: string) => {
    const comparison = compareWords(item.sentenceEn, text)
    onSpeech?.({ recognized, submitted: text })
    if (!answered) {
      setAnswered(true)
      onAnswer({ correct: comparison.perfect, usedHint: false })
    }
    setUi({ kind: 'result', comparison })
  }

  const listen = ttsAvailable() && (
    <Button
      variant="text"
      className="justify-self-start"
      onClick={() => void speak(item.sentenceEn)}
    >
      <Volume2 size={20} aria-hidden="true" />
      {t('speak.question.listenDemo')}
    </Button>
  )

  const sentence = (
    <EnglishText text={item.sentenceEn} className="font-en text-content break-words" />
  )
  const typeLabel = <span className="text-secondary text-muted">{t('lesson.type.speak')}</span>

  // 送出後的「錯字・漏字・得分」由 polite live region 念出：容器在每個狀態的同一位置常駐（先空著），送出後才填內容
  const tally =
    ui.kind === 'result'
      ? t('speak.result.score', {
          wrong: ui.comparison.wrong + ui.comparison.extra,
          missing: ui.comparison.missing,
          score: ui.comparison.correct,
          total: ui.comparison.total,
        })
      : ''
  const live = (
    <p data-testid="shadowing-live" aria-live="polite" className="sr-only">
      {tally}
    </p>
  )

  if (ui.kind === 'confirm')
    return (
      <>
        {live}
        <LessonMain>
          <TargetCard>{sentence}</TargetCard>
          <div className="grid gap-1.5">
            <label htmlFor="shadowing-said" className="text-caption text-muted">
              {t('speak.confirm.label')}
            </label>
            <textarea
              id="shadowing-said"
              lang="en"
              rows={3}
              value={ui.text}
              onChange={(e) => setUi({ ...ui, text: e.target.value })}
              autoCapitalize="none"
              autoCorrect="off"
              spellCheck={false}
              className="min-h-24 w-full resize-none rounded-control border border-border bg-surface px-3.5 py-3 font-en text-content text-text focus:outline-3 focus:outline-offset-1 focus:outline-focus"
            />
            <span className="text-caption text-muted">{t('speak.confirm.hint')}</span>
          </div>
        </LessonMain>
        <LessonFoot className="grid-cols-[minmax(max-content,1fr)_1.4fr]">
          <Button variant="secondary" onClick={() => setUi({ kind: 'idle' })}>
            {t('speak.question.retry')}
          </Button>
          <Button
            disabled={ui.text.trim() === ''}
            onClick={() => submit(ui.recognized, ui.text.trim())}
          >
            {t('speak.question.submit')}
          </Button>
        </LessonFoot>
      </>
    )

  if (ui.kind === 'result') {
    const c = ui.comparison
    const missed = c.target.filter((w) => w.mark !== 'ok').map((w) => w.text)
    const extra = c.shown.filter((w) => w.mark === 'extra').map((w) => w.text!)
    return (
      <>
        {live}
        <LessonMain>
          <TargetCard>{sentence}</TargetCard>
          <Card tight>
            <span className="text-caption text-muted">{t('speak.result.label')}</span>
            <p lang="en" data-testid="shadowing-said" className="font-en text-content break-words">
              {c.shown.map((w, i) => (
                <span key={i}>
                  {i > 0 && ' '}
                  {w.text === null ? (
                    <span
                      data-mark="missing"
                      aria-label={t('speak.result.missing')}
                      className="tracking-[.05em] whitespace-nowrap text-error"
                    >
                      ＿＿
                    </span>
                  ) : w.mark === 'ok' ? (
                    w.text
                  ) : (
                    <span
                      data-mark={w.mark}
                      className="rounded-[3px] bg-error-bg px-0.5 text-error underline decoration-2 underline-offset-3"
                    >
                      {w.text}
                    </span>
                  )}
                </span>
              ))}
            </p>
            {/* 念給螢幕閱讀器的是上方 live region，這行只給眼睛看，避免念兩次 */}
            <span
              data-testid="shadowing-tally"
              aria-hidden="true"
              className={`text-caption ${c.perfect ? 'text-correct' : 'text-error'}`}
            >
              {tally}
            </span>
          </Card>
        </LessonMain>
        <LessonFoot>
          <FeedbackBar
            tone={c.perfect ? 'ok' : 'no'}
            title={
              c.perfect ? (
                t('lesson.feedback.right')
              ) : (
                <>
                  {t('speak.result.almost')}
                  <span lang="en">{(missed.length ? missed : extra).join('、')}</span>
                </>
              )
            }
          >
            <EnglishText text={item.sentenceEn} className="font-en" />
            <ZhText text={item.sentenceZh} />
          </FeedbackBar>
          <div className="grid grid-cols-[minmax(max-content,1fr)_1.4fr] gap-2.5">
            <Button variant="secondary" onClick={() => setUi({ kind: 'idle' })}>
              {t('speak.question.retry')}
            </Button>
            <Button onClick={onContinue}>{t('lesson.feedback.continue')}</Button>
          </div>
        </LessonFoot>
      </>
    )
  }

  // 錄音鈕區：依麥克風與模型狀態決定
  const modelReady = model.kind === 'ready'
  const needsDownload =
    model.kind === 'notDownloaded' || model.kind === 'downloading' || model.kind === 'failed'
  const quiet = ui.kind === 'recording' || ui.kind === 'busy' || mic === 'denied'

  const offerBtn = offerWeb && !web && (
    <Button variant="text" className="justify-center" onClick={() => setAsking(true)}>
      {t('speak.fallback.offer')}
    </Button>
  )

  let control
  if (mic === 'denied')
    control = (
      <RecWrap skip={t('speak.denied.skip')} onSkip={skip}>
        <button
          type="button"
          className={recCls.denied}
          aria-label={t('speak.denied.aria')}
          onClick={allowMic}
        >
          <MicOff size={30} aria-hidden="true" />
        </button>
        <span className="flex items-center gap-1.5 text-secondary text-error">
          <Info size={18} aria-hidden="true" className="flex-none" />
          {t('speak.denied.body')}
        </span>
        <Button variant="secondary" onClick={allowMic}>
          {t('speak.denied.allow')}
        </Button>
      </RecWrap>
    )
  else if (ui.kind === 'recording') {
    const heights = reducedMotion()
      ? WAVE
      : WAVE.map((h) => Math.max(4, Math.round(h * (0.3 + level))))
    control = (
      <RecWrap>
        {/* 錄音鈕外圈光環向外延伸 8px，音量條再往上留 8px（間距刻度 mb-2），兩者不相貼 */}
        <div aria-hidden="true" className="mb-2 flex h-[22px] items-end gap-[3px]">
          {heights.map((h, i) => (
            <i key={i} className="w-1 rounded-[2px] bg-error" style={{ height: Math.min(22, h) }} />
          ))}
        </div>
        <button
          type="button"
          className={recCls.on}
          aria-label={t('speak.question.stop')}
          onClick={stopRec}
        >
          <Square size={30} aria-hidden="true" />
        </button>
        {/* 同音量條：光環向外 8px，下方文字再隔 8px（間距刻度 mt-2） */}
        <span className="mt-2 text-secondary text-error tabular-nums">
          {t('speak.question.recording', { time: clock(now - ui.startedAt) })}
        </span>
      </RecWrap>
    )
  } else if (ui.kind === 'busy')
    control = (
      <RecWrap>
        <button
          type="button"
          disabled
          aria-busy="true"
          className={recCls.busy}
          aria-label={t('speak.question.busyAria')}
        >
          <LoaderCircle
            size={30}
            aria-hidden="true"
            className="animate-spin motion-reduce:animate-none"
          />
        </button>
        <span className="text-secondary text-muted">
          {t(web ? 'speak.question.busyWeb' : 'speak.question.busy')}
        </span>
      </RecWrap>
    )
  else if (moonshineBlocked && !web)
    control = (
      <RecWrap skip={t('speak.denied.skip')} onSkip={skip}>
        <button
          type="button"
          disabled
          className={recCls.busy}
          aria-label={t('speak.question.unsupported')}
        >
          <MicOff size={30} aria-hidden="true" />
        </button>
        <span className="text-secondary text-muted">{t('speak.question.unsupported')}</span>
        {offerBtn}
      </RecWrap>
    )
  // 麥克風權限還沒查到（決定走本機或瀏覽器辨識之前）也先停用錄音鈕
  else if (mic === null || (!modelReady && !web))
    control = (
      <RecWrap
        skip={t(needsDownload ? 'speak.download.skip' : 'speak.question.skipNow')}
        onSkip={skip}
      >
        <button
          type="button"
          disabled
          className={recCls.busy}
          aria-label={t(needsDownload ? 'speak.download.aria' : 'speak.question.preparing')}
        >
          <Mic size={30} aria-hidden="true" />
        </button>
        <span className="text-secondary text-muted">
          {t(needsDownload ? 'speak.download.hint' : 'speak.question.preparing')}
        </span>
        {offerBtn}
      </RecWrap>
    )
  else
    control = (
      <RecWrap skip={t('speak.question.skipNow')} onSkip={skip}>
        <button
          type="button"
          className={recCls.idle}
          aria-label={t('speak.question.record')}
          onClick={startRec}
        >
          <Mic size={30} aria-hidden="true" />
        </button>
        <span className={`text-secondary ${ui.failed ? 'text-error' : 'text-muted'}`}>
          {t(ui.failed ? 'speak.question.failed' : 'speak.question.idleHint')}
        </span>
      </RecWrap>
    )

  return (
    <>
      {live}
      <LessonMain center>
        <Card>
          {typeLabel}
          {!quiet && <p className="text-secondary text-muted">{t('speak.question.instruction')}</p>}
          {sentence}
          {!quiet && listen}
        </Card>
        {needsDownload && !moonshineBlocked && !web && !quiet && (
          <ModelCard
            state={model}
            onDownload={() => void speech.stt.load().catch(() => undefined)}
          />
        )}
      </LessonMain>
      <LessonFoot plain>{control}</LessonFoot>
      {asking && (
        <ConfirmDialog
          title={t('speak.fallback.title')}
          body={t('speak.fallback.body')}
          safeLabel={t('speak.fallback.decline')}
          riskLabel={t('speak.fallback.accept')}
          onSafe={() => setAsking(false)}
          onRisk={() => {
            speech.webSpeech.consent()
            setAsking(false)
            setConsents((n) => n + 1)
          }}
        />
      )}
    </>
  )
}

function TargetCard({ children }: { children: ReactNode }) {
  return (
    <Card tight>
      <span className="text-caption text-muted">{t('speak.question.target')}</span>
      {children}
    </Card>
  )
}

function RecWrap({
  children,
  skip,
  onSkip,
}: {
  children: ReactNode
  skip?: string
  onSkip?: () => void
}) {
  return (
    <div className="grid justify-items-center gap-2 pt-2 text-center">
      {children}
      {skip && (
        // 窄螢幕特大字級時長文字可折行（e2e/measure.ts 的 data-multiline 慣例）
        <Button
          variant="text"
          data-multiline
          className="justify-center text-center"
          onClick={onSkip}
        >
          {skip}
        </Button>
      )}
    </div>
  )
}

/** 語音辨識模型：未下載＝下載鈕；下載中＝進度；失敗＝錯誤色＋重試（components.md §4 模型下載進度） */
function ModelCard({ state, onDownload }: { state: SttState; onDownload: () => void }) {
  const downloading = state.kind === 'downloading'
  const failed = state.kind === 'failed'
  const pct = downloading ? Math.round(state.progress * 100) : 0
  return (
    <Card tight className="gap-2.5">
      <div role="status" className="flex items-center justify-between gap-2">
        <span className="flex min-w-0 items-center gap-1.5 font-bold">
          <Download size={20} aria-hidden="true" className="flex-none" />
          {t(downloading || failed ? 'download.stt.title' : 'speak.download.titleIdle')}
        </span>
        {downloading && (
          <span className="text-caption text-muted tabular-nums">
            {t('download.status.percent', { n: pct })}
          </span>
        )}
        {state.kind === 'notDownloaded' && (
          <Button
            variant="text"
            className="-my-2 min-w-11 flex-none justify-center px-2"
            onClick={onDownload}
          >
            {t('download.action.start')}
          </Button>
        )}
      </div>
      {(downloading || failed) && (
        <div
          role="progressbar"
          aria-label={t('download.stt.title')}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={failed ? undefined : pct}
          className="h-1.5 overflow-hidden rounded-full bg-line"
        >
          <div
            className={`h-full rounded-full ${failed ? 'w-full bg-error' : 'bg-primary'}`}
            style={failed ? undefined : { width: `${pct}%` }}
          />
        </div>
      )}
      {failed && (
        <Button variant="text" className="-my-2 text-caption text-error!" onClick={onDownload}>
          {t('download.status.failedRetry')}
        </Button>
      )}
      <p className="text-caption text-muted">
        {t(downloading ? 'download.stt.body' : 'speak.download.bodyIdle')}
      </p>
    </Card>
  )
}
