// 聽音打字（設計 s03）：聽句子打出來，按「檢查」判題（寬鬆規則見 lesson/answer/check.ts）；
// 答錯標出打錯的字＋「差一點：A → B」＋英中解答；「聽不出來」直接看答案、記為答錯
import { useState } from 'react'
import { EnglishText } from '../../dict/EnglishText'
import { t } from '../../i18n/t'
import { checkTyped, type Fix, type TypedCheck } from '../../lesson/answer/check'
import type { ListenTypeItem } from '../../lesson/items'
import { Button } from '../../ui/Button'
import { FeedbackBar } from '../../ui/FeedbackBar'
import { LessonFoot, LessonMain } from './frame'
import { ListenCard } from './ListenParts'
import type { QuestionProps } from './types'
import { ZhText } from './ZhText'

const fieldCls =
  'min-h-24 w-full rounded-control border border-border bg-surface px-3.5 py-3 font-en text-content break-words'

function FixList({ fixes }: { fixes: Fix[] }) {
  const word = (w: string | null) =>
    w === null ? t('lesson.listen.missing') : <span lang="en">{w}</span>
  return (
    <>
      {fixes.map((f, i) => (
        <span key={i}>
          {i > 0 && '、'}
          {word(f.from)} → {word(f.to)}
        </span>
      ))}
    </>
  )
}

export function ListenTypeView({ item, onAnswer, onContinue }: QuestionProps<ListenTypeItem>) {
  const [input, setInput] = useState('')
  const [result, setResult] = useState<TypedCheck | 'gaveUp' | null>(null)
  const answered = result !== null

  const check = () => {
    if (!input.trim()) return
    const r = checkTyped(input, item.sentenceEn)
    setResult(r)
    onAnswer({ correct: r.correct, usedHint: false })
  }

  const giveUp = () => {
    setResult('gaveUp')
    onAnswer({ correct: false, usedHint: false, skipped: true })
  }

  const solution = (
    <>
      <EnglishText text={item.sentenceEn} className="font-en" />
      <span className="font-zh-tr">
        <ZhText text={item.sentenceZh} />
      </span>
    </>
  )

  return (
    <>
      <LessonMain>
        <ListenCard title={t('lesson.listen.typeTitle')} text={item.sentenceEn} answered={answered}>
          {!answered && (
            <p className="text-secondary text-muted">{t('lesson.listen.typePrompt')}</p>
          )}
        </ListenCard>
        {result && result !== 'gaveUp' ? (
          <p data-testid="listen-typed" lang="en" className={fieldCls}>
            {result.typed.map((w, i) => (
              <span key={i}>
                {i > 0 && ' '}
                {w.wrong ? (
                  <mark className="rounded-[3px] bg-error-bg px-0.5 text-error underline decoration-2 underline-offset-3">
                    {w.text}
                  </mark>
                ) : (
                  w.text
                )}
              </span>
            ))}
          </p>
        ) : (
          !answered && (
            <textarea
              lang="en"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              aria-label={t('lesson.listen.placeholder')}
              placeholder={t('lesson.listen.placeholder')}
              autoCapitalize="off"
              autoComplete="off"
              autoCorrect="off"
              spellCheck={false}
              rows={3}
              className={`${fieldCls} resize-none placeholder:font-sans placeholder:text-secondary placeholder:text-muted focus:outline-3 focus:outline-offset-1 focus:outline-focus`}
            />
          )
        )}
      </LessonMain>
      <LessonFoot>
        {answered ? (
          <>
            {result === 'gaveUp' ? (
              <FeedbackBar tone="no" title={t('lesson.listen.answerWas')}>
                {solution}
              </FeedbackBar>
            ) : result.correct ? (
              <FeedbackBar tone="ok" title={t('lesson.feedback.right')}>
                {solution}
              </FeedbackBar>
            ) : (
              <FeedbackBar
                tone="no"
                title={
                  <>
                    {t('lesson.listen.almost')}
                    <FixList fixes={result.fixes} />
                  </>
                }
              >
                {solution}
              </FeedbackBar>
            )}
            <Button onClick={onContinue}>{t('lesson.feedback.continue')}</Button>
          </>
        ) : (
          <div className="grid grid-cols-2 gap-2.5">
            <Button variant="secondary" onClick={giveUp}>
              {t('lesson.listen.giveUp')}
            </Button>
            <Button disabled={!input.trim()} onClick={check}>
              {t('lesson.choice.check')}
            </Button>
          </div>
        )}
      </LessonFoot>
    </>
  )
}
