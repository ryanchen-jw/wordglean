// 首頁「我的成長」卡（TASK-26）：首頁以 lazy 載入本檔，計算與明細不進首屏 bundle；點卡片開各級進度彈層
import { ChevronRight } from 'lucide-react'
import { lazy, Suspense, useEffect, useState } from 'react'
import { levelLabel } from '../curriculum/levelLabel'
import { db } from '../data/appDb'
import { useLiveQuery } from '../data/useLiveQuery'
import { t } from '../i18n/t'
import { deviceTimeZone } from '../srs/daily'
import { CardButton, cardTitleCls } from '../ui/Card'
import { computeGrowth, LEVEL_UP_RATIO } from './growth'
import { loadGrowthDbInput, loadLevelWords } from './growthDb'
import { GrowthSkeleton } from './GrowthSkeleton'

const GrowthSheet = lazy(() => import('./GrowthSheet'))

/** 進度條：填色＝比例，70% 處畫刻度線（升級門檻） */
export function GrowthBar({ ratio }: { ratio: number }) {
  return (
    <span className="relative block h-2 rounded-full bg-line" aria-hidden="true">
      <span
        data-bar="fill"
        className="absolute inset-y-0 left-0 rounded-full bg-primary"
        style={{ width: `${Math.min(1, ratio) * 100}%` }}
      />
      <span
        data-bar="tick"
        className="absolute -inset-y-1 w-0.5 rounded-sm bg-text"
        style={{ left: `${LEVEL_UP_RATIO * 100}%` }}
      />
    </span>
  )
}

const numCls = 'text-title-sm leading-[1.1] font-bold tabular-nums'

export default function GrowthCard() {
  // 先讀完本機資料（liveQuery 追蹤這些表）再取課綱字（loadLevel 有快取）
  const result = useLiveQuery(async () => {
    const input = await loadGrowthDbInput(db)
    const levelWords = await loadLevelWords()
    const growth = computeGrowth({
      ...input,
      levelWords,
      nowMs: Date.now(),
      timeZone: deviceTimeZone(),
    })
    return { ...growth, stored: input.record }
  }, [])
  const [open, setOpen] = useState(false)

  // 只升不降：達到的最高程度寫回本機；寫入會觸發重算，結果沿用已存紀錄時不再寫
  useEffect(() => {
    if (result && result.record !== result.stored)
      db.growth.put(result.record).catch((e) => console.error(e))
  }, [result])

  if (!result) return <GrowthSkeleton />
  const m = result.model
  return (
    <>
      {/* 整張卡是按鈕、內容多行：標 data-multiline 讓單行控件量測略過（e2e/measure.ts） */}
      <div data-multiline data-testid="growth-card" className="grid">
        <CardButton onClick={() => setOpen(true)}>
          <span className="flex items-start justify-between">
            <span className={cardTitleCls}>{t('home.growth.title')}</span>
            <ChevronRight size={20} aria-hidden="true" className="text-muted" />
          </span>
          <span className="font-bold">
            {m.level ? levelLabel(m.level) : t('home.growth.beginner')}
          </span>
          {m.reachedToday && (
            <span data-testid="growth-reached" className="text-secondary font-bold text-correct">
              {t('home.growth.reached', { level: m.reachedToday })}
            </span>
          )}
          {m.next ? (
            <span className="grid gap-1.5">
              <span className="text-secondary text-muted tabular-nums">
                {t('home.growth.toNext', { level: m.next.level, pct: `${m.next.pct}%` })}
              </span>
              <GrowthBar ratio={m.next.pct / 100} />
            </span>
          ) : (
            <span className="text-secondary text-muted">{t('home.growth.maxed')}</span>
          )}
          <span className="grid grid-cols-2 gap-3 pt-1">
            <span className="grid gap-0.5">
              <span data-testid="growth-learned" className={numCls}>
                {m.learned}
              </span>
              <span className="text-caption text-muted">{t('home.growth.learned')}</span>
            </span>
            <span className="grid gap-0.5">
              <span data-testid="growth-remembered" className={numCls}>
                {m.remembered}
              </span>
              <span className="text-caption text-muted">{t('home.growth.remembered')}</span>
            </span>
          </span>
          <span className="text-caption text-muted">
            {t('home.growth.thisWeek', { n: m.thisWeek })}
          </span>
        </CardButton>
      </div>
      {open && (
        <Suspense fallback={null}>
          <GrowthSheet levels={m.levels} onClose={() => setOpen(false)} />
        </Suspense>
      )}
    </>
  )
}
