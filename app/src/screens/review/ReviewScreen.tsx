// 複習（設計 s07）：到期單字依到期先後出單字卡；今天的學習（flow）複習完直接接下一課（D6）；
// 完成頁「再複習一次剛學的字」只練習、不寫排程（D5）。規則見 docs/verification/2026-10-02-task18-daily-flow-evidence/proposal.md
import { Info } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { loadLevel } from '../../curriculum/load'
import { db as appDb } from '../../data/appDb'
import type { LinguaDb } from '../../data/db'
import { loadLexIndex, type LexIndex } from '../../dict/lexicon'
import { t } from '../../i18n/t'
import type { LessonItemsDoc } from '../../lesson/items'
import { loadLessonItems } from '../../lesson/load'
import {
  answerReview,
  lessonWordCards,
  loadReviewCards,
  withReviewMatching,
  type ReviewCard,
  type ReviewEntry,
} from '../../review/session'
import { goBack, navigate } from '../../router'
import { deviceTimeZone } from '../../srs/daily'
import { loadNextLessonId as loadNextFromCurriculum, loadTodayPlan } from '../../today/plan'
import { Button } from '../../ui/Button'
import { Card } from '../../ui/Card'
import { LessonFoot, LessonHeader, LessonMain, lessonFrameCls } from '../lesson/frame'
import { playSfx } from '../../sound/sfx'
import { prefetchAudio } from '../../speech/speak'
import { MatchingView } from '../lesson/MatchingView'
import { WordCardView } from '../lesson/WordCardView'

export type ReviewMode = { kind: 'due'; flow: boolean } | { kind: 'practice'; lessonId: string }

type Props = {
  mode: ReviewMode
  db?: LinguaDb
  loadItems?: (lessonId: string) => Promise<LessonItemsDoc | null>
  loadNextLessonId?: (db: LinguaDb) => Promise<string | null>
  /** 單字總表（收藏字的複習卡用，TASK-16） */
  loadLex?: () => Promise<LexIndex>
  now?: () => number
}

type Phase =
  | { kind: 'loading' }
  | { kind: 'error' }
  | { kind: 'play'; entries: ReviewEntry[]; index: number; correct: number }
  | { kind: 'done'; total: number; correct: number }
  | { kind: 'leaving' }

const nextFromCurriculum = (db: LinguaDb) => loadNextFromCurriculum(db, loadLevel)

export function ReviewScreen({
  mode,
  db = appDb,
  loadItems = loadLessonItems,
  loadNextLessonId = nextFromCurriculum,
  loadLex = loadLexIndex,
  now = Date.now,
}: Props) {
  const [phase, setPhase] = useState<Phase>({ kind: 'loading' })
  const saving = useRef<Promise<unknown> | null>(null)
  const busy = useRef(false)
  const shownAt = useRef(0)

  // 複習做完（或沒有可複習的字）：今天的學習還能上課就直接接下一課，否則顯示完成卡
  const finish = async (total: number, correct: number) => {
    if (mode.kind === 'due' && mode.flow) {
      const plan = await loadTodayPlan(db, now(), deviceTimeZone(), await loadNextLessonId(db))
      if (plan.lessonId) {
        setPhase({ kind: 'leaving' })
        navigate(`/lesson/${plan.lessonId}`, { replace: true })
        return
      }
    }
    // 有複習到字才播完成音（創辦人試用 2026-10-04 ④）；沒有到期的空完成卡不播
    if (total > 0) playSfx('complete')
    setPhase({ kind: 'done', total, correct })
  }

  useEffect(() => {
    let alive = true
    ;(async () => {
      let cards: ReviewCard[]
      if (mode.kind === 'practice') {
        prefetchAudio([mode.lessonId])
        const doc = await loadItems(mode.lessonId)
        if (!doc) throw new Error(`沒有這一課的題目：${mode.lessonId}`)
        cards = lessonWordCards(doc)
      } else {
        const plan = await loadTodayPlan(db, now(), deviceTimeZone(), null)
        const loaded = await loadReviewCards(db, plan.reviews, loadItems, loadLex)
        if (loaded.missing.length) console.info('[review] 找不到單字卡的字', loaded.missing)
        cards = loaded.cards
      }
      if (!alive) return
      if (cards.length === 0) await finish(0, 0)
      // 到期複習：每 4 張字卡後插一題配對（創辦人 2026-10-05 裁示一）；「再複習一次剛學的字」不插
      else
        setPhase({
          kind: 'play',
          entries:
            mode.kind === 'due'
              ? withReviewMatching(cards)
              : cards.map((card) => ({ kind: 'card', card })),
          index: 0,
          correct: 0,
        })
    })().catch((e) => {
      console.error(e)
      if (alive) setPhase({ kind: 'error' })
    })
    return () => {
      alive = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- 只在進入畫面時載入一次
  }, [])

  const index = phase.kind === 'play' ? phase.index : -1
  useEffect(() => {
    shownAt.current = now()
  }, [index, now])

  if (phase.kind === 'done') return <ReviewDone total={phase.total} correct={phase.correct} />

  if (phase.kind !== 'play')
    return (
      <div
        data-testid={phase.kind === 'leaving' ? 'review-leaving' : 'review-screen'}
        className={lessonFrameCls}
      >
        <LessonHeader onLeave={goBack} />
        <LessonMain>
          {phase.kind === 'error' ? (
            <Card>
              <p role="alert" className="flex items-center gap-2">
                <Info size={20} aria-hidden="true" className="flex-none text-muted" />
                {t('review.error.body')}
              </p>
              <Button variant="secondary" onClick={() => navigate('/', { replace: true })}>
                {t('review.error.back')}
              </Button>
            </Card>
          ) : (
            <Card>
              <div aria-hidden="true" className="grid gap-2.5" data-testid="review-loading">
                {[100, 90, 60].map((w) => (
                  <div key={w} className="h-4 rounded-md bg-line" style={{ width: `${w}%` }} />
                ))}
              </div>
            </Card>
          )}
        </LessonMain>
      </div>
    )

  const { entries, correct } = phase
  const entry = entries[phase.index]
  // 完成卡只數字卡（配對不是一個字、不寫 FSRS）
  const total = entries.filter((e) => e.kind === 'card').length

  const onAnswer = (a: { correct: boolean; usedHint: boolean; silent?: boolean }) => {
    if (entry.kind === 'matching') {
      saving.current = Promise.resolve()
      return
    }
    const at = now()
    if (!a.silent) playSfx(a.correct ? 'correct' : 'wrong')
    saving.current = answerReview(
      db,
      entry.card,
      { correct: a.correct, usedHint: a.usedHint, elapsedMs: at - shownAt.current },
      at,
      { practice: mode.kind === 'practice' },
    )
    setPhase({ ...phase, correct: correct + (a.correct ? 1 : 0) })
  }

  const onContinue = async () => {
    if (busy.current || !saving.current) return
    busy.current = true
    try {
      await saving.current
      saving.current = null
      if (phase.index === entries.length - 1) await finish(total, correct)
      else setPhase({ ...phase, index: phase.index + 1 })
    } finally {
      busy.current = false
    }
  }

  // 每題作答當下已存好，✕ 不需確認；先等這題存完再離開
  const onLeave = async () => {
    await saving.current
    goBack()
  }

  return (
    <div data-testid="review-screen" className={lessonFrameCls}>
      <LessonHeader
        n={phase.index + 1}
        total={entries.length}
        count={t('review.frame.count', { n: phase.index + 1, total: entries.length })}
        progressLabel={t('review.frame.progress')}
        onLeave={onLeave}
      />
      {entry.kind === 'card' ? (
        <WordCardView
          key={entry.card.step.key}
          item={entry.card.item}
          step={entry.card.step}
          onAnswer={onAnswer}
          onContinue={onContinue}
        />
      ) : (
        <MatchingView
          key={entry.step.key}
          step={entry.step}
          onAnswer={onAnswer}
          onContinue={onContinue}
        />
      )}
    </div>
  )
}

// 設計未畫：沿用小課完成頁（s14）的組合，只說複習了幾個字、答對幾個
function ReviewDone({ total, correct }: { total: number; correct: number }) {
  return (
    <div data-testid="review-done" className={lessonFrameCls}>
      <header className="grid flex-none gap-0.5 px-5 pt-[calc(env(safe-area-inset-top)+6px)] pb-2.5">
        <h1 className="font-heading text-title font-bold">{t('review.done.title')}</h1>
      </header>
      <LessonMain>
        <Card tight>
          {total === 0 ? (
            <span>{t('review.done.empty')}</span>
          ) : (
            <>
              <span className="text-secondary text-muted">{t('review.done.summary')}</span>
              <div className="flex flex-wrap gap-x-5 tabular-nums">
                <span>{t('review.done.words', { n: total })}</span>
                <span>{t('review.done.correct', { n: correct })}</span>
              </div>
            </>
          )}
        </Card>
      </LessonMain>
      <LessonFoot>
        <Button onClick={() => navigate('/', { replace: true })}>{t('review.done.home')}</Button>
      </LessonFoot>
    </div>
  )
}
