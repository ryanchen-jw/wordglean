// 課程地圖（設計 s02）：級距可自由切換、不鎖課；目前單元預設展開；點小課從底部彈出詳情
import { ChevronDown, ChevronRight, CircleCheck, Play } from 'lucide-react'
import { useState } from 'react'
import {
  currentLevel,
  lessonRef,
  levelOfLessonId,
  LEVELS,
  nextLesson,
  type Level,
  type LessonRef,
  type UnitDoc,
} from '../../curriculum/curriculum'
import { levelLabel } from '../../curriculum/levelLabel'
import { useLevelDoc } from '../../curriculum/load'
import { db } from '../../data/appDb'
import { useLiveQuery } from '../../data/useLiveQuery'
import { t } from '../../i18n/t'
import { navigate } from '../../router'
import { TabScreen } from '../../shell/Screen'
import { BottomSheet } from '../../ui/BottomSheet'
import { Button } from '../../ui/Button'
import { cardTitleCls } from '../../ui/Card'
import { LESSON_MINUTES } from '../home/homeModel'

// 從首頁進來時帶 ?lesson=（開該課詳情）或 ?level=（跳過分級，從指定級距開始）
function readQuery(): { level: Level | null; lesson: string | null } {
  const q = new URLSearchParams(location.search)
  const lesson = q.get('lesson')
  const level = q.get('level') as Level | null
  return {
    lesson,
    level: level && LEVELS.includes(level) ? level : lesson ? levelOfLessonId(lesson) : null,
  }
}

function LessonSheet({ lesson, onClose }: { lesson: LessonRef; onClose: () => void }) {
  return (
    <BottomSheet label={t('course.sheet.label')} onClose={onClose}>
      <div className="flex items-baseline justify-between gap-3">
        <h2 className={cardTitleCls}>
          {t('course.sheet.title', { unit: lesson.unitTitle, n: lesson.ordinal })}
        </h2>
        <span className="flex-none text-caption text-muted">
          {t('course.sheet.minutes', { min: LESSON_MINUTES })}
        </span>
      </div>
      <p className="text-secondary text-muted">
        {t('course.sheet.newWords', { n: lesson.words.length })}
      </p>
      <p lang="en" className="font-en leading-[1.6]">
        {lesson.words.join('・')}
      </p>
      <Button onClick={() => navigate(`/lesson/${lesson.lessonId}`)}>
        {t('course.sheet.startButton')}
      </Button>
    </BottomSheet>
  )
}

type UnitProps = {
  unit: UnitDoc
  level: Level
  completed: ReadonlySet<string>
  currentLessonId: string | null
  expanded: boolean
  onToggle: () => void
  onOpen: (lesson: LessonRef) => void
}

function UnitCard({
  unit,
  level,
  completed,
  currentLessonId,
  expanded,
  onToggle,
  onOpen,
}: UnitProps) {
  const done = unit.lessons.filter((l) => completed.has(l.id)).length
  const progress = t('course.unit.progress', { done, total: unit.lessons.length })
  return (
    <section
      className={`grid min-w-0 rounded-card border border-line bg-surface ${expanded ? 'gap-1 p-5' : 'p-4'}`}
    >
      <button
        type="button"
        aria-expanded={expanded}
        onClick={onToggle}
        className="-m-2 flex min-h-11 items-center justify-between gap-3 rounded-xl p-2 text-left active:bg-primary-soft"
      >
        <h2 className={cardTitleCls}>{unit.titleZh}</h2>
        <span className="inline-flex flex-none items-center gap-1 text-caption text-muted">
          {progress}
          {expanded ? (
            <ChevronDown size={20} aria-hidden="true" />
          ) : (
            <ChevronRight size={20} aria-hidden="true" />
          )}
        </span>
      </button>
      {expanded && (
        <ul className="grid">
          {unit.lessons.map((l, i) => {
            const isDone = completed.has(l.id)
            const isCurrent = l.id === currentLessonId
            const label = t('course.unit.lesson', { n: i + 1 })
            return (
              <li key={l.id} className="border-b border-line last:border-b-0">
                <button
                  type="button"
                  onClick={() => onOpen(lessonRef(level, unit, i))}
                  className={`flex min-h-13 items-center justify-between gap-3 text-left active:bg-primary-soft ${
                    isCurrent
                      ? '-mx-3 w-[calc(100%+24px)] rounded-xl bg-primary-soft px-3'
                      : 'w-full'
                  }`}
                >
                  {isDone ? (
                    <span className="flex items-center gap-2 text-correct">
                      <CircleCheck size={20} aria-hidden="true" />
                      <span className="text-text">{label}</span>
                    </span>
                  ) : isCurrent ? (
                    <span className="flex items-center gap-2 font-bold text-primary">
                      <Play size={20} aria-hidden="true" />
                      {label}
                    </span>
                  ) : (
                    <span className="pl-7">{label}</span>
                  )}
                  {isCurrent && (
                    <span className="text-secondary text-primary">{t('course.unit.current')}</span>
                  )}
                </button>
              </li>
            )
          })}
        </ul>
      )}
    </section>
  )
}

export function CourseScreen() {
  const [query] = useState(readQuery)
  const progress = useLiveQuery(() => db.courseProgress.toArray(), [])
  const [chosen, setChosen] = useState<Level | null>(query.level)
  const level = chosen ?? (progress ? (currentLevel(progress) ?? 'A1') : null)
  const doc = useLevelDoc(level)
  const [toggled, setToggled] = useState<ReadonlySet<string>>(new Set())
  const [openLessonId, setOpenLessonId] = useState<string | null>(query.lesson)

  const completed = new Set(progress?.map((p) => p.lessonId))
  const current = doc ? nextLesson(doc, completed) : null
  const open = doc && openLessonId ? findLesson(doc.units, doc.level, openLessonId) : null

  const pickLevel = (lv: Level) => {
    setChosen(lv)
    setToggled(new Set())
  }
  const toggle = (unitId: string) =>
    setToggled((prev) => {
      const next = new Set(prev)
      if (!next.delete(unitId)) next.add(unitId)
      return next
    })
  const closeSheet = () => {
    setOpenLessonId(null)
    if (location.search) navigate('/course', { replace: true })
  }

  return (
    <TabScreen title={t('course.header.title')}>
      <div data-testid="screen-course" className="contents">
        <div
          role="tablist"
          aria-label={t('course.level.tabsLabel')}
          className="flex flex-wrap gap-2"
        >
          {LEVELS.map((lv) => (
            <button
              key={lv}
              type="button"
              role="tab"
              aria-selected={lv === level}
              onClick={() => pickLevel(lv)}
              className={`inline-flex min-h-11 items-center rounded-chip border px-3.5 text-secondary active:scale-(--lg-press-scale) ${
                lv === level
                  ? 'border-primary bg-primary font-bold text-on-primary'
                  : 'border-border bg-surface text-text active:bg-primary-soft'
              }`}
            >
              {lv}
            </button>
          ))}
        </div>
        {level && <p className="text-secondary text-muted">{levelLabel(level)}</p>}
        {doc &&
          doc.units.map((unit) => (
            <UnitCard
              key={unit.id}
              unit={unit}
              level={doc.level}
              completed={completed}
              currentLessonId={current?.lessonId ?? null}
              expanded={(unit.id === current?.unitId) !== toggled.has(unit.id)}
              onToggle={() => toggle(unit.id)}
              onOpen={(l) => setOpenLessonId(l.lessonId)}
            />
          ))}
      </div>
      {open && <LessonSheet lesson={open} onClose={closeSheet} />}
    </TabScreen>
  )
}

function findLesson(units: UnitDoc[], level: Level, lessonId: string): LessonRef | null {
  for (const unit of units) {
    const idx = unit.lessons.findIndex((l) => l.id === lessonId)
    if (idx >= 0) return lessonRef(level, unit, idx)
  }
  return null
}
