// 小課完成頁（設計 s14、components.md §14）：整頁、只說學了什麼與答對幾題；無星星、分數動畫、連續天數
import { ChevronRight } from 'lucide-react'
import { displayWord } from '../../dict/displayCase'
import { EnglishText } from '../../dict/EnglishText'
import { t } from '../../i18n/t'
import type { SettleSummary } from '../../lesson/session'
import { goBack, navigate } from '../../router'
import { Button } from '../../ui/Button'
import { Card } from '../../ui/Card'
import { LessonFoot, LessonMain, lessonFrameCls } from './frame'

type Props = {
  summary: SettleSummary
  subtitle: string | null
  /** 答錯且已進複習排程的題數（只有單字卡會進排程，偏差 #3） */
  wrongScheduled: number
  /** 示範課：主按鈕回上一頁（從設定頁進來就回設定頁） */
  demo?: boolean
}

export function LessonDone({ summary, subtitle, wrongScheduled, demo }: Props) {
  return (
    <div data-testid="lesson-done" className={lessonFrameCls}>
      <header className="grid flex-none gap-0.5 px-5 pt-[calc(env(safe-area-inset-top)+6px)] pb-2.5">
        {/* 示範課不屬於任何一課：副標改顯示入口名稱（TASK-38） */}
        {demo ? (
          <p className="text-secondary text-muted">{t('settings.other.testLesson')}</p>
        ) : (
          subtitle && <p className="text-secondary text-muted">{subtitle}</p>
        )}
        <h1 className="font-heading text-title font-bold">{t('lesson.done.title')}</h1>
      </header>
      <LessonMain>
        {summary.newWords.length > 0 && (
          <Card tight>
            <span className="text-secondary text-muted">
              {t('lesson.done.newWords', { n: summary.newWords.length })}
            </span>
            <p className="font-en leading-[1.9] break-words">
              {summary.newWords.map((w, i) => (
                <span key={w}>
                  {i > 0 && '・'}
                  <EnglishText text={displayWord(w)} />
                </span>
              ))}
            </p>
          </Card>
        )}
        <Card tight>
          <span className="text-secondary text-muted">{t('lesson.done.summary')}</span>
          <div className="flex flex-wrap gap-x-5 tabular-nums">
            <span>{t('lesson.done.questions', { n: summary.total })}</span>
            <span>{t('lesson.done.correct', { n: summary.correct })}</span>
          </div>
          {wrongScheduled > 0 && (
            <span className="text-caption text-muted">
              {t('lesson.done.wrongScheduled', { n: wrongScheduled })}
            </span>
          )}
        </Card>
      </LessonMain>
      <LessonFoot>
        {demo ? (
          <Button onClick={goBack}>{t('common.action.back')}</Button>
        ) : (
          <Button onClick={() => navigate('/', { replace: true })}>{t('lesson.done.home')}</Button>
        )}
        {/* 只練習本課新字、不寫排程（TASK-18 D5）；示範課沒有「剛學的字」，不給（TASK-38） */}
        {!demo && (
          <Button
            variant="text"
            className="justify-center!"
            onClick={() => navigate(`/review?lesson=${summary.lessonId}`)}
          >
            {t('lesson.done.reviewAgain')}
            <ChevronRight size={20} aria-hidden="true" />
          </Button>
        )}
      </LessonFoot>
    </div>
  )
}
