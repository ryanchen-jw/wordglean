// 即時跟讀（TASK-40，設計 docs/pending/2026-11-13-live-shadowing/design.md §5、mockup.html）：課程跟讀題的預設流程。
// 錄音中每輪辨識（Moonshine 滑動視窗；本機不能用時經同意改瀏覽器語音辨識的中間結果）以 liveMatch 不照順序比對，
// 唸對的字立即變色；整句完成＝答對（自動停錄），跳過＝答錯；單次錄音 60 秒自動暫停，累計 20 秒未完成出現「改用整句錄音」。
// 完成後提示最長一口氣，「一口氣再唸一次」走整句錄音（ShadowingView practice，不改分數）。
// 作答紀錄只存每輪聽到的文字摘要（speechCorrections），不存錄音。
// 本機即時辨識與瀏覽器語音辨識都不能用時，沿用 ShadowingView（整句錄音）的退回方式
import { Info, Mic, MicOff, Pause, Volume2 } from 'lucide-react'
import { useEffect, useRef, useState, useSyncExternalStore, type ReactNode } from 'react'
import { EnglishText } from '../../dict/EnglishText'
import { t } from '../../i18n/t'
import type { ShadowingItem } from '../../lesson/items'
import { createLiveMatch, type LiveState } from '../../speech/liveMatch'
import { startLiveLoop } from '../../speech/liveStt'
import { MicDeniedError, type MicPermission } from '../../speech/mic'
import { useSpeech } from '../../speech/services'
import { ttsAvailable } from '../../speech/speak'
import { useSpeak } from '../../speech/useSpeak'
import { holdSfx } from '../../sound/sfx'
import { Button } from '../../ui/Button'
import { Card } from '../../ui/Card'
import { ConfirmDialog } from '../../ui/ConfirmDialog'
import { FeedbackBar } from '../../ui/FeedbackBar'
import { LessonFoot, LessonMain } from './frame'
import { clock, recCls, reducedMotion, WAVE } from './recControls'
import { ModelCard, RecWrap, ShadowingView } from './ShadowingView'
import type { QuestionProps } from './types'
import { ZhText } from './ZhText'

/** 單次錄音上限（耗電保護，不是靜音偵測；裁示 C） */
export const LIVE_LIMIT_MS = 60_000
/** 累計錄音這麼久仍未完成：出現「改用整句錄音」 */
export const LIVE_STUCK_MS = 20_000
const WINDOW_SEC = 4
/** 作答紀錄的每輪摘要上限（字元） */
const SUMMARY_MAX = 2000

type Phase = 'idle' | 'recording' | 'paused' | 'done'
type Mode = 'live' | 'whole' | 'practice'

/** 目標句切成「字」與字間的標點空白，字對應 liveMatch 的原字（tokenize 同序） */
function segments(sentence: string, words: string[]) {
  const s = sentence.replace(/[‘’]/g, "'")
  const out: ({ word: number } | { text: string })[] = []
  let at = 0
  words.forEach((w, k) => {
    const i = s.indexOf(w, at)
    if (i < 0) return
    if (i > at) out.push({ text: s.slice(at, i) })
    out.push({ word: k })
    at = i + w.length
  })
  if (at < s.length) out.push({ text: s.slice(at) })
  return out
}

/** 文案中的 {name} 換成強調元素 */
function withEm(text: string, name: string, em: ReactNode) {
  const [a, b = ''] = text.split(`{${name}}`)
  return (
    <>
      {a}
      {em}
      {b}
    </>
  )
}

export function LiveShadowingView(props: QuestionProps<ShadowingItem>) {
  const { item, onAnswer, onContinue, onSpeech } = props
  const speak = useSpeak()
  const speech = useSpeech()
  const model = useSyncExternalStore(speech.stt.subscribe, speech.stt.get)
  const [mode, setMode] = useState<Mode>('live')
  const [mic, setMic] = useState<MicPermission | null>(null)
  const [phase, setPhase] = useState<Phase>('idle')
  const [failed, setFailed] = useState(false)
  const matcher = useRef(createLiveMatch(item.sentenceEn))
  const [state, setState] = useState<LiveState>(() => matcher.current.state())
  const [fresh, setFresh] = useState<number[]>([])
  const [heard, setHeard] = useState('')
  const [announce, setAnnounce] = useState('')
  // 錄音時間：本次開始時刻、先前累計（暫停後再錄接著算）
  const [startedAt, setStartedAt] = useState(0)
  const [recordedMs, setRecordedMs] = useState(0)
  const [now, setNow] = useState(0)
  const [stuck, setStuck] = useState(false)
  const [level, setLevel] = useState(0)
  const [asking, setAsking] = useState(false)
  const [, setConsents] = useState(0)
  const session = useRef<{ stop(): void; level(): number } | null>(null)
  const starting = useRef(false)
  const gone = useRef(false)
  const answered = useRef(false)
  const rounds = useRef<string[]>([])
  const recorded = useRef(false)

  const localBlocked =
    mic === 'unsupported' || !speech.moonshineAvailable() || !speech.liveMicSupported()
  const offerWeb = speech.webSpeech.supported() && (localBlocked || model.kind === 'failed')
  const web = offerWeb && speech.webSpeech.consented()

  const endSession = () => {
    const s = session.current
    session.current = null
    s?.stop()
  }

  useEffect(() => {
    let alive = true
    void speech.micPermission().then((p) => alive && setMic(p))
    void speech.stt.refresh()
    gone.current = false
    return () => {
      alive = false
      gone.current = true
      endSession()
    }
  }, [speech])

  // 模型已在快取：進題目就載入；未下載則等使用者按「下載」（同整句錄音 D4）
  useEffect(() => {
    if (mode === 'live' && model.kind === 'downloaded' && mic !== null && !localBlocked)
      void speech.stt.load().catch(() => undefined)
  }, [mode, model.kind, mic, localBlocked, speech])

  // 錄音中不播音效（創辦人試用 2026-10-04 ④）；整句完成時先停錄才計分，答對音效才播得出來
  useEffect(() => (phase === 'recording' ? holdSfx() : undefined), [phase])

  useEffect(() => {
    if (phase !== 'recording') return
    const tick = () => {
      const at = Date.now()
      setNow(at)
      setLevel(reducedMotion() ? 0 : (session.current?.level() ?? 0))
      if (recordedMs + at - startedAt >= LIVE_STUCK_MS) setStuck(true)
      if (at - startedAt >= LIVE_LIMIT_MS) pause()
    }
    const id = setInterval(tick, 250)
    return () => clearInterval(id)
  })

  const record = () => {
    if (recorded.current || rounds.current.length === 0) return
    recorded.current = true
    const summary = rounds.current.join(' | ')
    onSpeech?.({
      recognized: summary.length > SUMMARY_MAX ? summary.slice(0, SUMMARY_MAX) : summary,
      submitted: '',
    })
  }

  const feed = (text: string) => {
    const said = text.trim()
    if (said && rounds.current.at(-1) !== said) rounds.current.push(said)
    const prev = matcher.current.state()
    const next = matcher.current.update(said)
    if (next.dropped > prev.dropped) return
    const newly = next.words.flatMap((w, k) =>
      w.mark === 'done' && prev.words[k].mark !== 'done' ? [k] : [],
    )
    setState(next)
    setHeard(said)
    setFresh(newly)
    if (next.complete) {
      endSession()
      setRecordedMs((ms) => ms + Date.now() - startedAtRef.current)
      // 「整句完成！」由回饋條（role=status）念出，live region 清空避免念兩次
      setPhase('done')
      setAnnounce('')
      record()
      if (!answered.current) {
        answered.current = true
        onAnswer({ correct: true, usedHint: false })
      }
    } else if (newly.length)
      setAnnounce(
        t('speak.live.srDone', {
          words: newly.map((k) => next.words[k].text).join('、'),
          left: next.words.filter((w, k) => w.mark !== 'done' && !next.words[k].functionWord)
            .length,
        }),
      )
  }
  // feed 由辨識回呼呼叫（閉包是開始錄音時的），開始時刻另存 ref
  const startedAtRef = useRef(0)

  const start = async () => {
    if (starting.current || session.current || phase === 'done') return
    gone.current = false
    starting.current = true
    setFailed(false)
    const stopWith = (error?: unknown) => {
      if (!session.current) return
      endSession()
      setRecordedMs((ms) => ms + Date.now() - startedAtRef.current)
      if (error instanceof MicDeniedError) setMic('denied')
      else if (error) {
        console.error('[speech] 即時辨識失敗', error)
        setFailed(true)
      }
      setPhase((p) => (p === 'done' ? p : 'paused'))
    }
    try {
      let s: { stop(): void; level(): number }
      if (web) {
        const live = await speech.webSpeech.startLive(feed, (e) => stopWith(e))
        s = { stop: () => live.stop(), level: () => 0.5 }
      } else {
        const m = await speech.startLiveMic()
        const loop = startLiveLoop({
          source: m,
          transcribe: (samples) => speech.stt.transcribe(samples),
          windowSec: () => WINDOW_SEC,
          maxSeconds: LIVE_LIMIT_MS / 1000,
          onRound: (r) => feed(r.text),
          onStop: (reason, e) => {
            if (reason !== 'stopped') stopWith(e)
          },
        })
        s = {
          stop: () => {
            loop.stop()
            m.stop()
          },
          level: () => m.level(),
        }
      }
      if (gone.current) return s.stop()
      session.current = s
      const at = Date.now()
      startedAtRef.current = at
      setStartedAt(at)
      setNow(at)
      setPhase('recording')
    } catch (e) {
      if (gone.current) return
      if (e instanceof MicDeniedError) setMic('denied')
      else {
        console.error('[speech] 無法開始錄音', e)
        setFailed(true)
      }
    } finally {
      starting.current = false
    }
  }

  function pause() {
    if (!session.current) return
    endSession()
    setRecordedMs((ms) => ms + Date.now() - startedAtRef.current)
    setPhase('paused')
  }

  const leaveLive = () => {
    gone.current = true
    endSession()
    record()
  }

  const skip = () => {
    leaveLive()
    if (!answered.current) {
      answered.current = true
      onAnswer({ correct: false, usedHint: false, skipped: true })
    }
    onContinue()
  }

  const switchTo = (next: Mode) => {
    leaveLive()
    setMode(next)
  }

  const allowMic = async () => {
    if (await speech.requestMic()) setMic('granted')
  }

  // 本機即時辨識與瀏覽器語音辨識都不能用：沿用整句錄音的退回方式
  if (mode === 'whole' || (localBlocked && !speech.webSpeech.supported() && mic !== null))
    return <ShadowingView {...props} />
  if (mode === 'practice') return <ShadowingView {...props} practice />

  const total = state.words.length
  const recording = phase === 'recording'
  const done = phase === 'done'
  const started = phase !== 'idle'
  const modelReady = model.kind === 'ready'
  const needsDownload =
    model.kind === 'notDownloaded' || model.kind === 'downloading' || model.kind === 'failed'

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

  const lights = state.words.some((w) => w.mark === 'light')
  const sentence = (
    <p
      lang="en"
      data-testid="live-sentence"
      className={`flex flex-wrap items-baseline font-en text-content break-words ${lights ? 'gap-y-5' : 'gap-y-0.5'}`}
    >
      {segments(
        item.sentenceEn,
        state.words.map((w) => w.text),
      ).map((seg, i) => {
        if ('text' in seg)
          return (
            <span key={i} className="whitespace-pre">
              {seg.text}
            </span>
          )
        const w = state.words[seg.word]
        const mark = w.mark === 'heard' ? 'todo' : w.mark
        return (
          <span
            key={i}
            data-testid="live-word"
            data-mark={mark}
            className={`relative rounded-[6px] px-[5px] transition-colors duration-(--lg-duration-feedback) ease-standard ${
              mark === 'done'
                ? 'border-b-2 border-transparent bg-correct-bg font-bold text-correct'
                : mark === 'light'
                  ? 'border-b-2 border-dotted border-line text-muted'
                  : 'border-b-2 border-dashed border-border'
            } ${fresh.includes(seg.word) ? 'motion-safe:animate-[lg-word-pop_420ms_var(--lg-ease)]' : ''}`}
          >
            {w.text}
            {mark === 'light' && (
              <span
                lang="zh-Hant-TW"
                className="absolute top-full left-1/2 -translate-x-1/2 font-ui text-[.6875rem] leading-none whitespace-nowrap text-muted"
              >
                {t('speak.live.light')}
              </span>
            )}
          </span>
        )
      })}
    </p>
  )

  const tally = started && (
    <div className="flex items-center justify-between gap-3 text-secondary">
      <span data-testid="live-tally">
        {withEm(
          t('speak.live.tally', { total }),
          'n',
          <b className="text-correct">{state.doneCount}</b>,
        )}
      </span>
      <span aria-hidden="true" className="flex min-w-0 justify-end gap-1">
        {state.words.map((w, k) => (
          <i
            key={k}
            className={`h-1.5 w-[22px] min-w-1 shrink rounded-full ${w.mark === 'done' || w.mark === 'light' ? 'bg-correct' : 'bg-line'}`}
          />
        ))}
      </span>
    </div>
  )

  const live = (
    <p data-testid="shadowing-live" aria-live="polite" className="sr-only">
      {announce}
    </p>
  )

  const offerBtn = offerWeb && !web && (
    <Button variant="text" className="justify-center" onClick={() => setAsking(true)}>
      {t('speak.fallback.offer')}
    </Button>
  )
  const wholeBtn = stuck && !done && (
    <Button
      variant="text"
      data-multiline
      className="justify-center text-center"
      onClick={() => switchTo('whole')}
    >
      {t('speak.live.whole')}
    </Button>
  )

  let control
  if (done)
    control = (
      <>
        <FeedbackBar tone="ok" title={t('speak.live.complete')}>
          <span data-testid="live-longest">
            {withEm(
              t('speak.live.longest'),
              'count',
              <em className="font-bold text-correct not-italic">
                {t('speak.live.count', { n: state.longestRun, total })}
              </em>,
            )}
          </span>
          <span className="text-caption text-muted">
            {t(state.longestRun >= total ? 'speak.live.tipFluent' : 'speak.live.tipRhythm')}
          </span>
          <EnglishText text={item.sentenceEn} className="font-en" />
          <ZhText text={item.sentenceZh} />
        </FeedbackBar>
        <div className="grid grid-cols-[minmax(max-content,1fr)_1.2fr] gap-2.5">
          <Button variant="secondary" onClick={() => switchTo('practice')}>
            {t('speak.live.again')}
          </Button>
          <Button onClick={onContinue}>{t('lesson.feedback.continue')}</Button>
        </div>
      </>
    )
  else if (mic === 'denied')
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
  else if (recording) {
    const heights = reducedMotion()
      ? WAVE
      : WAVE.map((h) => Math.max(4, Math.round(h * (0.3 + level))))
    control = (
      <RecWrap skip={t('speak.denied.skip')} onSkip={skip}>
        <div aria-hidden="true" className="mb-2 flex h-[22px] items-end gap-[3px]">
          {heights.map((h, i) => (
            <i key={i} className="w-1 rounded-[2px] bg-error" style={{ height: Math.min(22, h) }} />
          ))}
        </div>
        <button
          type="button"
          className={recCls.on}
          aria-label={t('speak.live.pause')}
          onClick={pause}
        >
          <Pause size={30} aria-hidden="true" fill="currentColor" />
        </button>
        <span className="mt-2 text-secondary text-error tabular-nums">
          {web
            ? t('speak.live.recordingWeb')
            : t('speak.live.recording', { time: clock(recordedMs + now - startedAt) })}
        </span>
        {wholeBtn}
      </RecWrap>
    )
  } else if (localBlocked && !web)
    control = (
      <RecWrap skip={t('speak.denied.skip')} onSkip={skip}>
        <button
          type="button"
          disabled
          className={recCls.busy}
          aria-label={t('speak.live.localUnavailable')}
        >
          <MicOff size={30} aria-hidden="true" />
        </button>
        <span className="text-secondary text-muted">{t('speak.live.localUnavailable')}</span>
        {offerBtn}
      </RecWrap>
    )
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
          aria-label={t(
            model.kind === 'downloading'
              ? 'speak.download.aria'
              : needsDownload
                ? 'speak.download.hint'
                : 'speak.question.preparing',
          )}
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
          aria-label={t('speak.live.start')}
          onClick={start}
        >
          <Mic size={30} aria-hidden="true" />
        </button>
        <span className={`text-secondary ${failed ? 'text-error' : 'text-muted'}`}>
          {t(
            failed
              ? 'speak.question.failed'
              : phase === 'paused'
                ? 'speak.live.pausedHint'
                : 'speak.live.idleHint',
          )}
        </span>
        {wholeBtn}
      </RecWrap>
    )

  return (
    <>
      {live}
      <LessonMain center>
        <Card>
          <span className="text-secondary text-muted">{t('lesson.type.speak')}</span>
          {!started && mic !== 'denied' && (
            <p className="text-secondary text-muted">{t('speak.question.instruction')}</p>
          )}
          {tally}
          {sentence}
          {(!started || done) && (
            <p className="text-secondary text-muted">
              <ZhText text={item.sentenceZh} />
            </p>
          )}
          {!recording && !done && listen}
          {(recording || phase === 'paused') && (
            <p data-testid="live-heard" className="min-h-[1.4em] text-caption text-muted">
              {t('speak.live.heard')}
              <span lang="en" className="font-en">
                {heard || '…'}
              </span>
            </p>
          )}
        </Card>
        {needsDownload && !localBlocked && !web && !started && mic !== 'denied' && (
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
