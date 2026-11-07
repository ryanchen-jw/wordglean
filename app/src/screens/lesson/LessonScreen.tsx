// 小課（設計 s03 外框＋讀類題型 s05／s07、離開確認 s12、完成頁 s14）；規則見 docs/verification/2026-10-02-task12-read-items-evidence/proposal.md
import { Info } from 'lucide-react'
import { useCallback, useContext, useEffect, useRef, useState } from 'react'
import { levelOfLessonId } from '../../curriculum/curriculum'
import { useLevelDoc } from '../../curriculum/load'
import { db as appDb } from '../../data/appDb'
import type { LinguaDb } from '../../data/db'
import { addSpeechCorrection } from '../../data/repo'
import { t } from '../../i18n/t'
import type { LessonItem, LessonItemsDoc } from '../../lesson/items'
import { loadLessonItems } from '../../lesson/load'
import { buildLessonQueue } from '../../lesson/assemble'
import { buildDemoQueue } from '../../lesson/demo'
import { withMatching } from '../../lesson/matching'
import { detectCapabilities, type Capabilities } from '../../lesson/capabilities'
import {
  createRegistry,
  LISTEN_TYPES,
  READ_TYPES,
  SPEAK_TYPES,
  WRITE_TYPES,
  type Step,
} from '../../lesson/queue'
import {
  activeKey,
  currentKey,
  isAnswered,
  proceed,
  retryProgress,
  type LessonRun,
} from '../../lesson/run'
import {
  answerRetry,
  answerStep,
  continueRun,
  practiceSession,
  settleLesson,
  startOrResume,
  type SettleSummary,
} from '../../lesson/session'
import { getLink } from '../../llm/keyStore'
import { useLiveQuery } from '../../data/useLiveQuery'
import { goBack, navigate } from '../../router'
import { playSfx } from '../../sound/sfx'
import { useSpeech } from '../../speech/services'
import { ttsAvailable } from '../../speech/speak'
import { Button } from '../../ui/Button'
import { Card } from '../../ui/Card'
import { ConfirmDialog } from '../../ui/ConfirmDialog'
import { LessonDone } from './LessonDone'
import { LessonHeader, LessonMain, lessonFrameCls } from './frame'
import { QUESTION_VIEWS } from './views'
import { WritingEnvContext, type GradeFn } from './writingEnv'

const registry = createRegistry([...READ_TYPES, ...LISTEN_TYPES, ...SPEAK_TYPES, ...WRITE_TYPES])

type Props = {
  lessonId: string
  db?: LinguaDb
  loadItems?: (lessonId: string) => Promise<LessonItemsDoc | null>
  now?: () => number
  /** 裝置能力（TTS／STT／金鑰）；不足時換題型、改自評或略過（TASK-18） */
  capabilities?: Capabilities
  /** 結算後（同步接線屬 TASK-18） */
  onSettle?: (summary: SettleSummary) => void
  /** 寫作題批改（TASK-15）；預設瀏覽器直呼 OpenRouter */
  grade?: GradeFn
  /** 示範課（創辦人 2026-10-05 裁示二）：lessonId＝題目來源課；練習模式、不寫任何資料；startType＝從該題型開始 */
  demo?: { startType: string | null }
}

type Phase =
  | { kind: 'loading' }
  | { kind: 'error' }
  | { kind: 'play'; items: Map<string, LessonItem>; steps: Step[]; run: LessonRun }
  | { kind: 'done'; summary: SettleSummary; wrongScheduled: number }

export function LessonScreen({
  lessonId,
  db = appDb,
  loadItems = loadLessonItems,
  now = Date.now,
  capabilities,
  onSettle,
  grade,
  demo,
}: Props) {
  const [phase, setPhase] = useState<Phase>({ kind: 'loading' })
  const [leaving, setLeaving] = useState(false)
  // 作答存檔或前進失敗：顯示提示，再按「繼續」重試（非安全來源 randomUUID 事故）
  const [stuck, setStuck] = useState(false)
  const busy = useRef(false)
  // 存檔結果；null＝存檔失敗，「繼續」會用 retrySave 重存一次
  const saving = useRef<Promise<LessonRun | null> | null>(null)
  const retrySave = useRef<(() => Promise<LessonRun>) | null>(null)
  const shownAt = useRef(0)
  const levelDoc = useLevelDoc(levelOfLessonId(lessonId))
  // 讀取中為 undefined；沒有金鑰為 null（寫作題據此決定 AI 批改或自評）
  const link = useLiveQuery(() => getLink(db), [db])
  const writingEnv = useContext(WritingEnvContext)
  const speech = useSpeech()
  // 示範課只在記憶體裡作答；一般小課寫資料庫（FSRS、進度、完成課）
  const session = demo
    ? practiceSession
    : {
        start: (id: string, steps: readonly Step[], nowMs: number) =>
          startOrResume(db, id, steps, nowMs).then((r) => r.run),
        answer: answerStep.bind(null, db),
        answerRetry: answerRetry.bind(null, db),
        continueRun: continueRun.bind(null, db),
        settle: (run: LessonRun, steps: readonly Step[]) =>
          settleLesson(db, run, steps, { nowMs: now(), onSettle }),
      }

  // 這一課有跟讀題：整課期間留著語音辨識 Worker，離開小課才釋放（分時載入，TASK-14）
  const hasShadowing = phase.kind === 'play' && phase.steps.some((s) => s.type === 'shadowing')
  useEffect(() => (hasShadowing ? speech.stt.acquire() : undefined), [hasShadowing, speech])

  const finish = useCallback(
    async (run: LessonRun, steps: Step[]) => {
      const summary = await session.settle(run, steps)
      playSfx('complete')
      const wordKeys = new Set(steps.filter((s) => s.srsWord !== null).map((s) => s.key))
      setPhase({
        kind: 'done',
        summary,
        wrongScheduled: demo ? 0 : summary.wrongKeys.filter((k) => wordKeys.has(k)).length,
      })
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps -- session 由 db、now、onSettle、demo 決定
    [db, now, onSettle, demo],
  )

  useEffect(() => {
    let alive = true
    ;(async () => {
      const doc = await loadItems(lessonId)
      if (!doc) throw new Error(`沒有這一課的題目：${lessonId}`)
      // 有無 OpenRouter 金鑰（TASK-15）：沒有時寫作題依替代規則改自評（selfCheck）
      const hasKey = (await getLink(db)) !== null
      const caps = capabilities ?? detectCapabilities(ttsAvailable, speech.sttUsable, () => hasKey)
      // 示範課：跟讀一律出（不換成聽音打字），不能錄音時由跟讀畫面引導或跳過
      const {
        steps,
        skipped,
        changes,
        doc: applied,
      } = demo
        ? buildDemoQueue(doc, registry, { ...caps, stt: true }, demo.startType)
        : (() => {
            const built = buildLessonQueue(doc, registry, caps)
            // 每 4 張單字卡後插一題配對（創辦人 2026-10-05 裁示一）
            return { ...built, steps: withMatching(built.steps, built.doc) }
          })()
      // 能力不足的替代、未支援的題型（聽說寫，TASK-13～15）略過；記錄供除錯
      if (changes.length) console.info('[lesson] 能力替代', changes)
      if (skipped.length) console.info('[lesson] 略過的題目', skipped)
      if (steps.length === 0) throw new Error(`這一課沒有可作答的題目：${lessonId}`)
      const run = await session.start(lessonId, steps, now())
      if (!alive) return
      if (activeKey(run) === null) await finish(run, steps)
      // 題目取替代後的版本（帶 selfCheck 標記、換過的題型）
      else
        setPhase({ kind: 'play', items: new Map(applied.items.map((i) => [i.id, i])), steps, run })
    })().catch((e) => {
      console.error(e)
      if (alive) setPhase({ kind: 'error' })
    })
    return () => {
      alive = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- 只在換課時重新載入
  }, [lessonId])

  const shown =
    phase.kind === 'play' ? `${phase.run.retry?.round ?? 0}:${activeKey(phase.run)}` : ''
  useEffect(() => {
    shownAt.current = now()
  }, [shown, now])

  const lessonTitle = (() => {
    for (const unit of levelDoc?.units ?? []) {
      const idx = unit.lessons.findIndex((l) => l.id === lessonId)
      if (idx >= 0) return t('lesson.done.subtitle', { unit: unit.titleZh, n: idx + 1 })
    }
    return null
  })()

  if (phase.kind === 'done')
    return (
      <LessonDone
        summary={phase.summary}
        subtitle={lessonTitle}
        wrongScheduled={phase.wrongScheduled}
        demo={demo !== undefined}
      />
    )

  if (phase.kind !== 'play')
    return (
      <div data-testid="lesson-screen" className={lessonFrameCls}>
        <LessonHeader onLeave={goBack} />
        <LessonMain>
          {phase.kind === 'loading' ? (
            <Card>
              <div aria-hidden="true" className="grid gap-2.5" data-testid="lesson-loading">
                {[100, 90, 60].map((w) => (
                  <div key={w} className="h-4 rounded-md bg-line" style={{ width: `${w}%` }} />
                ))}
              </div>
            </Card>
          ) : (
            <Card>
              <p role="alert" className="flex items-center gap-2">
                <Info size={20} aria-hidden="true" className="flex-none text-muted" />
                {t('lesson.error.body')}
              </p>
              <Button variant="secondary" onClick={() => navigate('/course', { replace: true })}>
                {t('lesson.error.back')}
              </Button>
            </Card>
          )}
        </LessonMain>
      </div>
    )

  const { items, steps, run } = phase
  // 主輪做完、有錯題時進入錯題重做（創辦人試用 2026-10-04 ⑤）
  const retrying = currentKey(run) === null
  const step = steps.find((s) => s.key === activeKey(run))!
  const View = QUESTION_VIEWS[step.type]!

  // 回饋在點選當下就顯示，存檔稍後完成；「繼續」先等這次存檔，再用存好的進度往下
  // 重做只存進度、不寫 FSRS、不改第一次作答；跳過（跟讀「先跳過這題」）在主輪算錯，重做時不再出
  const onAnswer = ({
    correct,
    usedHint,
    skipped,
    silent,
  }: {
    correct: boolean
    usedHint: boolean
    skipped?: boolean
    silent?: boolean
  }) => {
    const at = now()
    if (!silent) playSfx(correct ? 'correct' : 'wrong')
    const save = () =>
      (retrying
        ? session.answerRetry(run, step, { correct, skipped }, at)
        : session.answer(run, step, { correct, usedHint, elapsedMs: at - shownAt.current }, at)
      ).then((next) => {
        setPhase({ ...phase, run: next })
        return next
      })
    retrySave.current = save
    // 存檔失敗不可讓整課卡住：記錄後交給「繼續」重試（重複作答＝這題已存過，沿用目前進度），✕ 照常可用
    saving.current = save().catch((e: unknown) => {
      console.error('[lesson] 作答存檔失敗', e)
      return isAnswered(run) ? run : null
    })
  }

  const onContinue = async () => {
    if (busy.current || !saving.current) return
    busy.current = true
    try {
      let saved = await saving.current
      if (!saved) {
        saved = await retrySave.current!()
        saving.current = Promise.resolve(saved)
      }
      const next = await session.continueRun(saved, now())
      if (activeKey(next) === null) await finish(next, steps)
      else setPhase({ ...phase, run: next })
      saving.current = null
      setStuck(false)
    } catch (e) {
      // 例：重試存檔仍失敗、或前進寫入失敗；留在這題顯示提示，「繼續」可再試，✕ 仍可離開
      console.error('[lesson] 無法前進到下一題', e)
      setStuck(true)
    } finally {
      busy.current = false
    }
  }

  // ✕ 先等作答存檔，確認框才看得到最新進度；最後一題已作答且沒有錯題要重做＝這課做完了，離開即結算（走查 P2）
  // 只在確認框開著時才推算按下「繼續」後的狀態（決定文案與離開時是否結算）
  const afterContinue = () => (isAnswered(run) ? proceed(run, 0) : run)
  const pending = leaving ? afterContinue() : null
  const allAnswered = pending !== null && activeKey(pending) === null
  const retryLeft = pending?.retry
    ? pending.retry.keys.length - Object.keys(pending.retry.passed).length
    : 0
  const retryAt = retryProgress(run)
  const onLeave = async () => {
    await saving.current
    // 示範課不存進度也不記完成：直接離開，不問
    if (demo) goBack()
    else setLeaving(true)
  }
  const leave = async () => {
    if (allAnswered) {
      if (busy.current) return
      busy.current = true
      await finish(run, steps)
    }
    goBack()
  }

  return (
    <div data-testid="lesson-screen" className={lessonFrameCls}>
      {retryAt ? (
        <>
          <LessonHeader
            n={retryAt.n}
            total={retryAt.total}
            onLeave={onLeave}
            progressLabel={t('lesson.retry.title')}
          />
          <p className="flex-none px-5 pb-2 text-secondary font-bold text-primary">
            {t('lesson.retry.title')}
          </p>
        </>
      ) : (
        <LessonHeader n={run.cursor + 1} total={steps.length} onLeave={onLeave} />
      )}
      {stuck && (
        <p role="alert" className="flex flex-none items-center gap-2 px-5 pb-2 text-secondary">
          <Info size={20} aria-hidden="true" className="flex-none text-muted" />
          {t('system.error.generic')}
        </p>
      )}
      <WritingEnvContext
        value={{
          link,
          level: levelOfLessonId(lessonId),
          grade: grade ?? writingEnv.grade,
        }}
      >
        <View
          key={`${run.retry?.round ?? 0}:${step.key}`}
          item={items.get(step.itemId)!}
          step={step}
          onAnswer={onAnswer}
          onContinue={onContinue}
          onSpeech={({ recognized, submitted }) => {
            if (demo) return
            const it = items.get(step.itemId)!
            addSpeechCorrection(
              db,
              {
                itemId: step.itemId,
                targetText: 'sentenceEn' in it ? it.sentenceEn : '',
                recognizedText: recognized,
                correctedText: submitted,
              },
              now(),
            ).catch((e: unknown) => console.error('[lesson] 跟讀紀錄寫入失敗', e))
          }}
        />
      </WritingEnvContext>
      {leaving && (
        <ConfirmDialog
          title={t('lesson.leave.title')}
          body={
            allAnswered
              ? t('lesson.leave.bodyDone')
              : retryLeft > 0
                ? t('lesson.leave.bodyRetry', { left: retryLeft })
                : t('lesson.leave.body', {
                    done: Object.keys(run.results).length,
                    total: steps.length,
                    next: Object.keys(run.results).length + 1,
                  })
          }
          safeLabel={t('lesson.leave.stay')}
          riskLabel={t('lesson.leave.leave')}
          onSafe={() => setLeaving(false)}
          onRisk={leave}
        />
      )}
    </div>
  )
}
