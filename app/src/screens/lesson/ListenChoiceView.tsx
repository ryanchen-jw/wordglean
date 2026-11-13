// 聽音選答（設計 s03）：聽一段英文，依繁中提問選英文答案；作答流程同選擇題（選了才能檢查）
import { useState } from 'react'
import { EnglishText } from '../../dict/EnglishText'
import { t } from '../../i18n/t'
import type { ListenChoiceItem } from '../../lesson/items'
import { Button } from '../../ui/Button'
import { ChoiceOption } from '../../ui/ChoiceOption'
import { FeedbackBar } from '../../ui/FeedbackBar'
import { LessonFoot, LessonMain } from './frame'
import { ListenCard } from './ListenParts'
import { choiceState, LETTERS, type QuestionProps } from './types'
import { ZhText } from './ZhText'

export function ListenChoiceView({
  item,
  step,
  onAnswer,
  onContinue,
}: QuestionProps<ListenChoiceItem>) {
  const { options, answer } = step.choice!
  const [selected, setSelected] = useState<number | null>(null)
  const [picked, setPicked] = useState<number | null>(null)
  const answered = picked !== null

  const check = () => {
    if (selected === null) return
    setPicked(selected)
    onAnswer({ correct: selected === answer, usedHint: false })
  }

  return (
    <>
      <LessonMain>
        <ListenCard
          title={t('lesson.listen.choiceTitle')}
          text={item.audioEn}
          answered={answered}
          after={
            <p className="font-bold">
              <ZhText text={item.questionZh} />
            </p>
          }
        />
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
                <EnglishText text={item.audioEn} className="font-en" />
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
                <EnglishText text={item.audioEn} className="font-en" />
                <span className="font-zh-tr">
                  <ZhText text={item.audioZh} />
                </span>
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
