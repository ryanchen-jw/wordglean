// 小課（設計 s03 外框＋讀類題型 s05／s07、離開確認 s12、完成頁 s14）；規則見 docs/verification/2026-10-02-task12-read-items-evidence/proposal.md
import { Info } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { levelOfLessonId } from '../../curriculum/curriculum'
import { useLevelDoc } from '../../curriculum/load'
import { db as appDb } from '../../data/appDb'
import type { LinguaDb } from '../../data/db'
import { t } from '../../i18n/t'
import type { LessonItem, LessonItemsDoc } from '../../lesson/items'
import { loadLessonItems } from '../../lesson/load'
import { buildLessonQueue } from '../../lesson/assemble'
import { detectCapabilities, type Capabilities } from '../../lesson/capabilities'
import { createRegistry, READ_TYPES, type Step } from '../../lesson/queue'
import { currentKey, type LessonRun } from '../../lesson/run'
import {
  answerStep,
  continueRun,
  settleLesson,
  startOrResume,
  type SettleSummary,
} from '../../lesson/session'
import { goBack, navigate } from '../../router'
import { Button } from '../../ui/Button'
import { Card } from '../../ui/Card'
import { ConfirmDialog } from '../../ui/ConfirmDialog'
import { LessonDone } from './LessonDone'
import { LessonHeader, LessonMain, lessonFrameCls } from './frame'
import { QUESTION_VIEWS } from './views'

const registry = createRegistry(READ_TYPES)

type Props = {
  lessonId: string
  db?: LinguaDb
  loadItems?: (lessonId: string) => Promise<LessonItemsDoc | null>
  now?: () => number
  /** 裝置能力（TTS／STT／金鑰）；不足時換題型、改自評或略過（TASK-18） */
  capabilities?: Capabilities
  /** 結算後（同步接線屬 TASK-18） */
  onSettle?: (summary: SettleSummary) => void
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
}: Props) {
  const [phase, setPhase] = useState<Phase>({ kind: 'loading' })
  const [leaving, setLeaving] = useState(false)
  const busy = useRef(false)
  const saving = useRef<Promise<LessonRun> | null>(null)
  const shownAt = useRef(0)
  const levelDoc = useLevelDoc(levelOfLessonId(lessonId))

  const finish = useCallback(
    async (run: LessonRun, steps: Step[]) => {
      const summary = await settleLesson(db, run, steps, { nowMs: now(), onSettle })
      const wordKeys = new Set(steps.filter((s) => s.srsWord !== null).map((s) => s.key))
      setPhase({
        kind: 'done',
        summary,
        wrongScheduled: summary.wrongKeys.filter((k) => wordKeys.has(k)).length,
      })
    },
    [db, now, onSettle],
  )

  useEffect(() => {
    let alive = true
    ;(async () => {
      const doc = await loadItems(lessonId)
      if (!doc) throw new Error(`沒有這一課的題目：${lessonId}`)
      const { steps, skipped, changes } = buildLessonQueue(
        doc,
        registry,
        capabilities ?? detectCapabilities(),
      )
      // 能力不足的替代、未支援的題型（聽說寫，TASK-13～15）略過；記錄供除錯
      if (changes.length) console.info('[lesson] 能力替代', changes)
      if (skipped.length) console.info('[lesson] 略過的題目', skipped)
      if (steps.length === 0) throw new Error(`這一課沒有可作答的題目：${lessonId}`)
      const { run } = await startOrResume(db, lessonId, steps, now())
      if (!alive) return
      if (currentKey(run) === null) await finish(run, steps)
      else setPhase({ kind: 'play', items: new Map(doc.items.map((i) => [i.id, i])), steps, run })
    })().catch((e) => {
      console.error(e)
      if (alive) setPhase({ kind: 'error' })
    })
    return () => {
      alive = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- 只在換課時重新載入
  }, [lessonId])

  const cursor = phase.kind === 'play' ? phase.run.cursor : -1
  useEffect(() => {
    shownAt.current = now()
  }, [cursor, now])

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
  const step = steps[run.cursor]
  const View = QUESTION_VIEWS[step.type]!

  // 回饋在點選當下就顯示，存檔稍後完成；「繼續」先等這次存檔，再用存好的進度往下
  const onAnswer = ({ correct, usedHint }: { correct: boolean; usedHint: boolean }) => {
    const at = now()
    saving.current = answerStep(
      db,
      run,
      step,
      { correct, usedHint, elapsedMs: at - shownAt.current },
      at,
    ).then((next) => {
      setPhase({ ...phase, run: next })
      return next
    })
  }

  const onContinue = async () => {
    if (busy.current || !saving.current) return
    busy.current = true
    try {
      const saved = await saving.current
      saving.current = null
      if (saved.cursor === steps.length - 1) await finish(saved, steps)
      else setPhase({ ...phase, run: await continueRun(db, saved, now()) })
    } finally {
      busy.current = false
    }
  }

  // ✕ 先等作答存檔，確認框才看得到最新進度；最後一題已作答＝這課做完了，離開即結算（走查 P2）
  const allAnswered = run.cursor === steps.length - 1 && !!run.results[step.key]
  const onLeave = async () => {
    await saving.current
    setLeaving(true)
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
      <LessonHeader n={run.cursor + 1} total={steps.length} onLeave={onLeave} />
      <View
        key={step.key}
        item={items.get(step.itemId)!}
        step={step}
        onAnswer={onAnswer}
        onContinue={onContinue}
      />
      {leaving && (
        <ConfirmDialog
          title={t('lesson.leave.title')}
          body={
            allAnswered
              ? t('lesson.leave.bodyDone')
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
