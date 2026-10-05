// 寫作題（設計 s06）：中翻英／造句。有金鑰送 AI 批改；沒有金鑰（或題目標了 selfCheck）對照參考答案自評；
// 批改失敗保留參考答案讓這題能完成。對錯（執行長 D2）：AI 無錯誤＝對、自評照按鈕、跳過與失敗後繼續＝錯
import { CircleX, Info, LoaderCircle } from 'lucide-react'
import { Fragment, useContext, useEffect, useRef, useState, type ReactNode } from 'react'
import { displayWord } from '../../dict/displayCase'
import { EnglishText } from '../../dict/EnglishText'
import { t, type MessageKey } from '../../i18n/t'
import type { WritingItem } from '../../lesson/items'
import type { FailureKind } from '../../llm/client'
import type { GradeTask } from '../../llm/gradePrompt'
import type { GradeResult } from '../../llm/parseGrade'
import { navigate } from '../../router'
import { Button } from '../../ui/Button'
import { Card } from '../../ui/Card'
import { FeedbackBar } from '../../ui/FeedbackBar'
import { LessonFoot, LessonMain } from './frame'
import type { QuestionProps } from './types'
import { WritingEnvContext } from './writingEnv'
import { ZhText } from './ZhText'

const MAX_LENGTH = 300

// offline＝手機沒有網路（navigator.onLine 為 false）：送出時已離線不呼叫批改；批改途中斷網也顯示離線說明
type FailReason = FailureKind | 'offline'

const FAIL_TEXT: Record<FailReason, MessageKey> = {
  offline: 'write.fail.offline',
  quota: 'write.fail.quota',
  network: 'write.fail.network',
  keyInvalid: 'write.fail.keyInvalid',
  other: 'write.fail.other',
}

type Phase =
  | { kind: 'input' }
  | { kind: 'grading' }
  | { kind: 'ai'; result: GradeResult }
  | { kind: 'self' }
  | { kind: 'fail'; reason: FailReason }

/** 把 parts 在 text 中第一次出現的位置標出來（你的句子標錯處、建議寫法標改處）；key＝片段在句中的起點 */
function marked(text: string, parts: string[], mark: (s: string) => ReactNode): ReactNode[] {
  const ranges: [number, number][] = []
  for (const p of parts) {
    const at = p ? text.indexOf(p) : -1
    if (at >= 0 && ranges.every(([s, e]) => at + p.length <= s || at >= e))
      ranges.push([at, at + p.length])
  }
  ranges.sort((a, b) => a[0] - b[0])
  const out: ReactNode[] = []
  let pos = 0
  for (const [s, e] of ranges) {
    if (s > pos) out.push(text.slice(pos, s))
    out.push(<Fragment key={s}>{mark(text.slice(s, e))}</Fragment>)
    pos = e
  }
  if (pos < text.length) out.push(text.slice(pos))
  return out
}

function SentenceCard({
  label,
  className = '',
  children,
}: {
  label: string
  className?: string
  children: ReactNode
}) {
  return (
    <Card tight className={className}>
      <span className="text-caption text-muted">{label}</span>
      {children}
    </Card>
  )
}

function References({ item }: { item: WritingItem }) {
  return (
    <SentenceCard label={t('write.question.reference')}>
      {item.referenceEn.map((r) => (
        <EnglishText key={r} text={r} className="font-en text-content break-words" />
      ))}
    </SentenceCard>
  )
}

export function WritingView({ item, onAnswer, onContinue }: QuestionProps<WritingItem>) {
  const { link, level, grade } = useContext(WritingEnvContext)
  const [text, setText] = useState('')
  const [phase, setPhase] = useState<Phase>({ kind: 'input' })
  const answer = text.trim()
  const translate = item.type === 'translate'
  const words = translate ? item.hintWords : [item.targetWord]
  // 離開題目或畫面時中止批改請求（創辦人試用 2026-10-05）
  const leaving = useRef(new AbortController())
  useEffect(() => {
    const ctrl = new AbortController()
    leaving.current = ctrl
    return () => ctrl.abort()
  }, [])

  // 自評、跳過、失敗後繼續：先記作答再往下（LessonScreen 的「繼續」會等這次存檔）
  // 跳過與批改失敗後繼續＝沒判出對錯：算錯，錯題重做時不再出（創辦人試用 2026-10-04 ⑤）
  const finish = (correct: boolean, skipped = false) => {
    onAnswer({ correct, usedHint: false, skipped })
    onContinue()
  }

  const submit = async () => {
    if (!answer || link === undefined) return
    if (!link || item.selfCheck) return setPhase({ kind: 'self' })
    if (!navigator.onLine) return setPhase({ kind: 'fail', reason: 'offline' })
    setPhase({ kind: 'grading' })
    const task: GradeTask = {
      kind: item.type,
      promptZh: translate ? item.promptZh : item.instructionZh,
      words,
      referenceEn: item.referenceEn,
      rubricZh: item.rubricZh,
      level,
      answer,
    }
    const { signal } = leaving.current
    const out = await grade(link, task, signal).catch(() => ({
      ok: false as const,
      reason: 'other' as const,
    }))
    if (signal.aborted) return
    if (out.ok) {
      onAnswer({ correct: out.result.isCorrect, usedHint: false })
      setPhase({ kind: 'ai', result: out.result })
    } else
      setPhase({
        kind: 'fail',
        reason: out.reason === 'network' && !navigator.onLine ? 'offline' : out.reason,
      })
  }

  // 題目卡：作答時與三種結果畫面（AI 批改、自評、批改失敗）都放最上方，方便對照（創辦人試用 2026-10-05）
  const question = (
    <Card>
      <span className="text-secondary text-muted">
        {t(translate ? 'lesson.type.translate' : 'lesson.type.sentence')}
      </span>
      <p className="text-title-sm">
        <ZhText text={translate ? item.promptZh : item.instructionZh} />
      </p>
      {words.length > 0 && (
        <span className="text-caption text-muted">
          {t('write.question.hintWords')}
          <span lang="en" className="font-en">
            {words.map(displayWord).join('、')}
          </span>
        </span>
      )}
    </Card>
  )

  if (phase.kind === 'input' || phase.kind === 'grading') {
    const busy = phase.kind === 'grading'
    return (
      <>
        <LessonMain>
          {question}
          <textarea
            lang="en"
            aria-label={t('write.question.yours')}
            value={text}
            maxLength={MAX_LENGTH}
            rows={3}
            disabled={busy}
            autoCapitalize="sentences"
            spellCheck={false}
            onChange={(e) => setText(e.target.value)}
            className="min-h-24 w-full resize-none rounded-control border border-border bg-surface px-4 py-3 font-en text-content text-text focus-visible:outline-2 focus-visible:outline-focus"
          />
        </LessonMain>
        <LessonFoot className="grid-cols-2">
          <Button variant="secondary" disabled={busy} onClick={() => finish(false, true)}>
            {t('write.question.skip')}
          </Button>
          <Button
            disabled={!answer || busy || link === undefined}
            aria-busy={busy}
            onClick={submit}
          >
            {busy && <LoaderCircle size={20} aria-hidden="true" className="animate-spin" />}
            {t(busy ? 'write.question.grading' : 'write.question.submit')}
          </Button>
        </LessonFoot>
      </>
    )
  }

  const yours = (errorParts: string[] = []) => (
    <SentenceCard label={t('write.question.yours')}>
      <p lang="en" className="font-en text-content break-words">
        {marked(answer, errorParts, (s) => (
          <mark className="rounded-sm bg-error-bg text-error underline">{s}</mark>
        ))}
      </p>
    </SentenceCard>
  )

  if (phase.kind === 'ai') {
    const { result } = phase
    const points = [
      ...new Set([...result.errors.map((e) => e.explanationZh), result.explanationZh]),
    ].filter(Boolean)
    return (
      <>
        <LessonMain>
          {question}
          {yours(result.errors.map((e) => e.original))}
          {result.isCorrect ? (
            <FeedbackBar tone="ok" title={t('lesson.feedback.right')} />
          ) : (
            <SentenceCard label={t('write.ai.suggestion')} className="border-correct!">
              <p lang="en" className="font-en text-content break-words">
                {marked(
                  result.corrected,
                  result.errors.map((e) => e.corrected),
                  (s) => (
                    <strong>{s}</strong>
                  ),
                )}
              </p>
            </SentenceCard>
          )}
          <SentenceCard label={t('write.ai.explanation')}>
            {points.length > 0 && (
              <ul className="grid list-disc gap-1 pl-5 text-secondary">
                {points.map((p) => (
                  <li key={p}>
                    <ZhText text={p} />
                  </li>
                ))}
              </ul>
            )}
            <span className="text-caption text-muted">{t('write.ai.by')}</span>
          </SentenceCard>
        </LessonMain>
        <LessonFoot>
          <Button onClick={onContinue}>{t('write.ai.done')}</Button>
        </LessonFoot>
      </>
    )
  }

  if (phase.kind === 'self')
    return (
      <>
        <LessonMain>
          {question}
          {yours()}
          <References item={item} />
          <p className="font-bold">{t('write.nokey.prompt')}</p>
          {!link && (
            <p className="flex items-start gap-2 rounded-control bg-hint-bg px-3.5 py-3 text-secondary text-hint">
              <Info size={20} aria-hidden="true" className="mt-[3px] flex-none" />
              <span>
                {t('write.nokey.hint')}
                <button
                  type="button"
                  className="inline-flex min-h-11 items-center font-medium underline"
                  onClick={() => navigate('/settings')}
                >
                  {t('write.nokey.goSettings')}
                </button>
              </span>
            </p>
          )}
        </LessonMain>
        <LessonFoot className="grid-cols-2">
          <Button variant="secondary" onClick={() => finish(false)}>
            {t('write.nokey.wrong')}
          </Button>
          <Button onClick={() => finish(true)}>{t('write.nokey.right')}</Button>
        </LessonFoot>
      </>
    )

  return (
    <>
      <LessonMain>
        {question}
        {yours()}
        <div
          role="alert"
          className="grid gap-1 rounded-control bg-error-bg px-3.5 py-3 text-secondary text-error"
        >
          <strong className="flex items-start gap-1.5 text-body font-bold">
            <CircleX size={20} aria-hidden="true" className="mt-[3px] flex-none" />
            {t('write.fail.title')}
          </strong>
          <span className="text-text">{t(FAIL_TEXT[phase.reason])}</span>
        </div>
        <References item={item} />
      </LessonMain>
      <LessonFoot className="grid-cols-2">
        <Button variant="secondary" onClick={() => navigate('/settings')}>
          {t('write.fail.changeModel')}
        </Button>
        <Button onClick={() => finish(false, true)}>{t('lesson.feedback.continue')}</Button>
      </LessonFoot>
    </>
  )
}
