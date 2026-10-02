// 選擇題（設計 s05）：題幹空格選字，選好按「檢查」；答錯同時標出選的（✗）與正解（✓）
import { useState } from 'react'
import { EnglishText } from '../../dict/EnglishText'
import { t } from '../../i18n/t'
import type { McqItem } from '../../lesson/items'
import { Button } from '../../ui/Button'
import { Card } from '../../ui/Card'
import { ChoiceOption } from '../../ui/ChoiceOption'
import { FeedbackBar } from '../../ui/FeedbackBar'
import { LessonFoot, LessonMain } from './frame'
import { ZhText } from './ZhText'
import { choiceState, LETTERS, type QuestionProps } from './types'

const BLANK = /_{2,}/

export function McqView({ item, step, onAnswer, onContinue }: QuestionProps<McqItem>) {
  const { options, answer } = step.choice!
  const [selected, setSelected] = useState<number | null>(null)
  const [picked, setPicked] = useState<number | null>(null)
  const answered = picked !== null
  const filled = item.stemEn.replace(BLANK, options[answer])

  const check = () => {
    if (selected === null) return
    setPicked(selected)
    onAnswer({ correct: selected === answer, usedHint: false })
  }

  // 答錯回饋：有各選項釋義時照設計「正解＝釋義；選的＝釋義。」，否則顯示完整句＋中譯（偏差 #2）
  const glossLine =
    picked !== null && picked !== answer && item.optionGlossZh ? (
      <span>
        {[answer, picked].map((i, k) => (
          <span key={i}>
            {k > 0 && '；'}
            <span lang="en">{options[i]}</span>＝{item.optionGlossZh![i]}
          </span>
        ))}
        。
      </span>
    ) : null

  return (
    <>
      <LessonMain>
        <Card>
          <span className="text-secondary text-muted">{t('lesson.mcq.type')}</span>
          <EnglishText text={item.stemEn} className="font-en text-content break-words" />
        </Card>
        <div role={answered ? undefined : 'radiogroup'} className="grid gap-3">
          {options.map((o, i) => (
            <ChoiceOption
              key={i}
              letter={LETTERS[i]}
              state={choiceState(i, { selected, picked, answer })}
              onSelect={answered ? undefined : () => setSelected(i)}
            >
              <EnglishText
                text={o}
                disabled={answered ? undefined : 'all'}
                className="font-en text-content"
              />
            </ChoiceOption>
          ))}
        </div>
      </LessonMain>
      <LessonFoot>
        {answered ? (
          <>
            {picked === answer ? (
              <FeedbackBar tone="ok" title={t('lesson.feedback.right')}>
                <EnglishText text={filled} className="font-en" />
                <ZhText text={item.stemZh} />
              </FeedbackBar>
            ) : (
              <FeedbackBar
                tone="no"
                title={
                  <>
                    {t('lesson.feedback.answerIs', { letter: LETTERS[answer] })}
                    <span lang="en">{options[answer]}</span>
                  </>
                }
              >
                {glossLine ?? (
                  <>
                    <EnglishText text={filled} className="font-en" />
                    <ZhText text={item.stemZh} />
                  </>
                )}
              </FeedbackBar>
            )}
            <Button onClick={onContinue}>{t('lesson.feedback.continue')}</Button>
          </>
        ) : (
          <Button disabled={selected === null} onClick={check}>
            {t('lesson.choice.check')}
          </Button>
        )}
      </LessonFoot>
    </>
  )
}
