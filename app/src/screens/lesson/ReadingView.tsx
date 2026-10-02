// 閱讀理解（設計 s05）：短文在卡片內自己捲動、選項永遠看得到；每小題一步，「看中文翻譯」展開短文中譯
import { useEffect, useRef, useState } from 'react'
import { EnglishText } from '../../dict/EnglishText'
import { t } from '../../i18n/t'
import type { ReadingItem } from '../../lesson/items'
import { Button } from '../../ui/Button'
import { Card } from '../../ui/Card'
import { ChoiceOption } from '../../ui/ChoiceOption'
import { FeedbackBar } from '../../ui/FeedbackBar'
import { LessonFoot, LessonMain } from './frame'
import { ZhText } from './ZhText'
import { choiceState, LETTERS, type QuestionProps } from './types'

export function ReadingView({ item, step, onAnswer, onContinue }: QuestionProps<ReadingItem>) {
  const { options, answer } = step.choice!
  const qi = step.questionIndex ?? 0
  const [selected, setSelected] = useState<number | null>(null)
  const [picked, setPicked] = useState<number | null>(null)
  const [showZh, setShowZh] = useState(false)
  const zhRef = useRef<HTMLParagraphElement>(null)
  // 譯文接在限高短文卡底部；展開時捲進視野，否則要自己往下捲才看得到（走查 P1）
  useEffect(() => {
    if (showZh) zhRef.current?.scrollIntoView?.({ block: 'nearest' })
  }, [showZh])
  const answered = picked !== null

  const check = () => {
    if (selected === null) return
    setPicked(selected)
    onAnswer({ correct: selected === answer, usedHint: false })
  }

  return (
    <>
      <LessonMain>
        <Card tight className="max-h-[220px] overflow-y-auto overscroll-contain">
          <span className="text-secondary text-muted">{t('lesson.reading.type')}</span>
          <EnglishText text={item.passageEn} className="font-en text-content break-words" />
          {showZh && (
            <p
              ref={zhRef}
              data-testid="reading-translation"
              className="font-zh-tr text-secondary text-muted"
            >
              <ZhText text={item.passageZh} />
            </p>
          )}
        </Card>
        <p data-testid="reading-question" className="font-bold">
          <ZhText
            text={t('lesson.reading.question', {
              n: qi + 1,
              total: item.questions.length,
              question: item.questions[qi].questionZh,
            })}
          />
        </p>
        <div role={answered ? undefined : 'radiogroup'} className="grid gap-3">
          {options.map((o, i) => (
            <ChoiceOption
              key={i}
              letter={LETTERS[i]}
              state={choiceState(i, { selected, picked, answer })}
              onSelect={answered ? undefined : () => setSelected(i)}
            >
              <ZhText text={o} />
            </ChoiceOption>
          ))}
        </div>
      </LessonMain>
      {answered ? (
        <LessonFoot>
          {picked === answer ? (
            <FeedbackBar tone="ok" title={t('lesson.feedback.right')} />
          ) : (
            <FeedbackBar
              tone="no"
              title={
                <ZhText
                  text={`${t('lesson.feedback.answerIs', { letter: LETTERS[answer] })}${options[answer]}`}
                />
              }
            />
          )}
          <Button onClick={onContinue}>{t('lesson.feedback.continue')}</Button>
        </LessonFoot>
      ) : (
        // 設計比例 1:1.4；左欄至少容得下按鈕文字（窄螢幕特大字級不折行）
        <LessonFoot className="grid-cols-[minmax(max-content,1fr)_1.4fr]">
          <Button variant="secondary" aria-expanded={showZh} onClick={() => setShowZh((v) => !v)}>
            {t(showZh ? 'lesson.reading.hideTranslation' : 'lesson.reading.showTranslation')}
          </Button>
          <Button disabled={selected === null} onClick={check}>
            {t('lesson.choice.check')}
          </Button>
        </LessonFoot>
      )}
    </>
  )
}
