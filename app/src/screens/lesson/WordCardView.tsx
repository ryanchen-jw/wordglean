// 單字卡（設計 s07、components.md §11）：英文字＋發音，四個中文釋義點選即判定；「看例句提示」用過就評 Hard
import { Info, Volume2 } from 'lucide-react'
import { useState } from 'react'
import { displayWord } from '../../dict/displayCase'
import { EnglishText } from '../../dict/EnglishText'
import { t } from '../../i18n/t'
import type { WordCardItem } from '../../lesson/items'
import { speak, ttsAvailable } from '../../speech/speak'
import { iconBtnCls } from '../../shell/Screen'
import { Button } from '../../ui/Button'
import { Card } from '../../ui/Card'
import { ChoiceOption } from '../../ui/ChoiceOption'
import { FeedbackBar } from '../../ui/FeedbackBar'
import { LessonFoot, LessonMain } from './frame'
import { ZhText } from './ZhText'
import { choiceState, LETTERS, type QuestionProps } from './types'

export function WordCardView({ item, step, onAnswer, onContinue }: QuestionProps<WordCardItem>) {
  const { options, answer } = step.choice!
  const [picked, setPicked] = useState<number | null>(null)
  const [hint, setHint] = useState(false)
  const answered = picked !== null
  // 收藏字的複習卡沒有例句（TASK-18）：不給例句提示、回饋只有釋義
  const hasExample = item.exampleEn !== ''
  // 作答前測驗字本身不可點（會直接看到答案）
  const hide = answered ? undefined : new Set([item.word.toLowerCase()])

  const pick = (i: number) => {
    setPicked(i)
    onAnswer({ correct: i === answer, usedHint: hint })
  }

  return (
    <>
      <LessonMain>
        <Card className="justify-items-center gap-2 px-5 py-7 text-center">
          {/* 作答前不可點（會直接看到答案）；作答後改為可點查義（G2） */}
          <EnglishText
            text={displayWord(item.word)}
            disabled={answered ? undefined : 'all'}
            className="font-en text-display font-semibold break-words"
          />
          {/* 手機不能播音（沒有內建聲音、也沒用高音質）時不顯示發音鈕（TASK-18 能力偵測） */}
          {ttsAvailable() && (
            <button
              type="button"
              className={`${iconBtnCls} text-primary`}
              aria-label={t('lesson.wordCard.speak')}
              onClick={() => speak(item.word)}
            >
              <Volume2 size={24} aria-hidden="true" />
            </button>
          )}
        </Card>
        {hint && !answered && (
          <div
            data-testid="wordcard-hint"
            className="grid animate-[lg-rise-in_var(--lg-duration-feedback)_var(--lg-ease)] gap-1 rounded-control bg-hint-bg px-3.5 py-3 text-secondary text-hint"
          >
            <span className="font-bold">{t('lesson.wordCard.hintLabel')}</span>
            <EnglishText text={item.exampleEn} disabled={hide} className="font-en text-text" />
          </div>
        )}
        {!answered && (
          <p className="text-center text-secondary text-muted">{t('lesson.wordCard.prompt')}</p>
        )}
        <div role={answered ? undefined : 'radiogroup'} className="grid gap-3">
          {options.map((o, i) => (
            <ChoiceOption
              key={i}
              letter={LETTERS[i]}
              state={choiceState(i, { selected: null, picked, answer })}
              onSelect={answered ? undefined : () => pick(i)}
            >
              {o}
            </ChoiceOption>
          ))}
        </div>
      </LessonMain>
      {answered ? (
        <LessonFoot>
          <FeedbackBar
            tone={picked === answer ? 'ok' : 'no'}
            title={
              picked === answer ? (
                t('lesson.wordCard.right', { gloss: item.glossZh })
              ) : (
                <>
                  <span lang="en">{displayWord(item.word)}</span>
                  {t('lesson.wordCard.isGloss', { gloss: item.glossZh })}
                </>
              )
            }
          >
            {hasExample && (
              <>
                <EnglishText text={item.exampleEn} className="font-en" />
                <ZhText text={item.exampleZh} />
              </>
            )}
          </FeedbackBar>
          <Button onClick={onContinue}>{t('lesson.feedback.continue')}</Button>
        </LessonFoot>
      ) : (
        !hint &&
        hasExample && (
          <LessonFoot plain>
            <Button variant="text" className="justify-center!" onClick={() => setHint(true)}>
              <Info size={20} aria-hidden="true" />
              {t('lesson.wordCard.hint')}
            </Button>
          </LessonFoot>
        )
      )}
    </>
  )
}
