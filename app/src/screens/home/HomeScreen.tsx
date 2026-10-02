// 首頁「今天」（設計 s01）：預設／今天都完成／新課暫停／第一次開啟；離線提示條由外框處理
import { ChevronRight, CircleCheck, Info, Settings } from 'lucide-react'
import { nextLesson, type Level } from '../../curriculum/curriculum'
import { levelLabel } from '../../curriculum/levelLabel'
import { useLevelDoc } from '../../curriculum/load'
import { db } from '../../data/appDb'
import { useLiveQuery } from '../../data/useLiveQuery'
import { t } from '../../i18n/t'
import { Link } from '../../Link'
import { navigate } from '../../router'
import { InstallCard } from '../../shell/InstallCard'
import { iconBtnCls, TabScreen } from '../../shell/Screen'
import { deviceTimeZone } from '../../srs/daily'
import { Button } from '../../ui/Button'
import { Card, CardLink, cardTitleCls } from '../../ui/Card'
import { buildHomeModel, LESSON_MINUTES, loadHomeDbInput, type HomeModel } from './homeModel'

const numCls = 'text-display leading-[1.1] font-bold tabular-nums'

function useHomeModel(): { model?: HomeModel; level: Level } {
  const input = useLiveQuery(() => loadHomeDbInput(db, Date.now(), deviceTimeZone()), [])
  const level = input?.level ?? 'A1'
  const doc = useLevelDoc(input && !input.firstRun ? level : null)
  if (!input || (!input.firstRun && !doc)) return { level }
  const next = doc ? nextLesson(doc, input.completedIds) : null
  return { model: buildHomeModel({ ...input, next }), level }
}

function TodayProgress({ m }: { m: HomeModel }) {
  return (
    <Card tight>
      <span className="text-secondary text-muted">{t('home.progress.label')}</span>
      <div className="flex gap-5 tabular-nums">
        <span>{t('home.progress.reviews', { done: m.reviewsDone, total: m.reviewsTotal })}</span>
        <span>{t('home.progress.lessons', { done: m.lessonsDone, total: m.lessonsTarget })}</span>
      </div>
    </Card>
  )
}

function DueTile({ m }: { m: HomeModel }) {
  return (
    <CardLink to="/review" tight>
      <span className="flex items-start justify-between text-secondary text-muted">
        {t('home.due.label')}
        <ChevronRight size={20} aria-hidden="true" />
      </span>
      <span className={numCls}>{m.dueCount}</span>
      <span className="text-caption text-muted">
        {t('home.due.minutes', { min: m.reviewMinutes })}
      </span>
    </CardLink>
  )
}

function NextTile({ m }: { m: HomeModel }) {
  if (!m.next)
    return (
      <Card tight>
        <span className="text-secondary text-muted">{t('home.next.label')}</span>
        <span className="font-bold">{t('home.next.levelDone')}</span>
      </Card>
    )
  return (
    <CardLink to={`/course?lesson=${m.next.lessonId}`} tight>
      <span className="flex items-start justify-between text-secondary text-muted">
        {t('home.next.label')}
        <ChevronRight size={20} aria-hidden="true" />
      </span>
      <span className="leading-[1.35] font-bold">
        {t('home.next.title', { unit: m.next.unitTitle, n: m.next.ordinal })}
      </span>
      <span className="text-caption text-muted">
        {t('home.next.meta', { min: LESSON_MINUTES, count: m.next.words.length })}
      </span>
    </CardLink>
  )
}

function PausedTile({ m }: { m: HomeModel }) {
  return (
    <div className="grid min-w-0 gap-1.5 rounded-card border border-hint-bg bg-hint-bg p-4 text-hint">
      <span className="flex items-center gap-1.5 font-bold">
        <Info size={20} aria-hidden="true" />
        {t('home.paused.title')}
      </span>
      <span className="text-secondary leading-normal">
        {t('home.paused.body', { n: m.pauseThreshold })}
      </span>
    </div>
  )
}

function HomeBody({ m }: { m: HomeModel }) {
  const startTarget = m.dueCount > 0 || !m.next ? '/review' : `/lesson/${m.next.lessonId}`

  if (m.state === 'first')
    return (
      <Card>
        <h2 className={cardTitleCls}>{t('home.first.title')}</h2>
        <p className="text-secondary text-muted">{t('home.first.body')}</p>
        <Button onClick={() => navigate('/placement')}>{t('home.first.startButton')}</Button>
        <Button variant="text" onClick={() => navigate('/course?level=A1')}>
          {t('home.first.skip')}
          <ChevronRight size={20} aria-hidden="true" />
        </Button>
      </Card>
    )

  if (m.state === 'done')
    return (
      <>
        <Card>
          <div className="flex items-center gap-2 text-correct">
            <CircleCheck size={20} aria-hidden="true" />
            <h2 className={`${cardTitleCls} text-text`}>{t('home.done.title')}</h2>
          </div>
          <p className="text-secondary text-muted">
            {t('home.done.tomorrow', { n: m.dueTomorrow })}
          </p>
          <Button
            variant="secondary"
            onClick={() => navigate(m.next ? `/lesson/${m.next.lessonId}` : '/course')}
          >
            {t('home.done.extraLesson')}
          </Button>
        </Card>
        <TodayProgress m={m} />
      </>
    )

  const paused = m.state === 'paused'
  const summary =
    paused || !m.next
      ? t('home.today.summaryReview', { min: m.totalMinutes })
      : m.dueCount > 0
        ? t('home.today.summaryReviewLesson', { min: m.totalMinutes })
        : t('home.today.summaryLesson', { min: m.totalMinutes })
  return (
    <>
      <Card>
        <h2 className={cardTitleCls}>{t('home.today.title')}</h2>
        <p className="text-secondary text-muted">{summary}</p>
        <Button onClick={() => navigate(startTarget)}>
          {paused ? t('home.today.startReview') : t('home.today.startButton')}
        </Button>
      </Card>
      <div className="grid grid-cols-2 gap-3">
        <DueTile m={m} />
        {paused ? <PausedTile m={m} /> : <NextTile m={m} />}
      </div>
      {!paused && <TodayProgress m={m} />}
    </>
  )
}

function HomeSkeleton() {
  return (
    <Card>
      <div className="h-6 w-32 rounded-md bg-line" />
      <div className="h-4 w-48 rounded-md bg-line" />
      <div className="h-13 rounded-control bg-line" />
    </Card>
  )
}

export function HomeScreen() {
  const { model, level } = useHomeModel()
  return (
    <TabScreen
      title={t('home.header.title')}
      subtitle={model && (model.state === 'first' ? t('home.header.unplaced') : levelLabel(level))}
      action={
        <Link
          to="/settings"
          className={`${iconBtnCls} text-text`}
          aria-label={t('home.header.settings')}
        >
          <Settings size={20} aria-hidden="true" />
        </Link>
      }
    >
      <div data-testid="screen-home" data-state={model?.state ?? 'loading'} className="contents">
        <InstallCard />
        {model ? <HomeBody m={model} /> : <HomeSkeleton />}
      </div>
    </TabScreen>
  )
}
