// 新手分級測驗（設計 s10：勾選中／結果）＋重測狀態（設計未畫，依元件規格組合）；計分見 placement/score.ts
import { Check, ChevronRight, Info, X } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'
import { LEVELS, TOEIC_LISTENING, type Level } from '../../curriculum/curriculum'
import { LevelSheet } from '../../curriculum/LevelSheet'
import { db } from '../../data/appDb'
import { saveSettings } from '../../data/repo'
import { t } from '../../i18n/t'
import { goBack, navigate } from '../../router'
import { FlowScreen, iconBtnCls } from '../../shell/Screen'
import { Button } from '../../ui/Button'
import { Card } from '../../ui/Card'
import { drawForm } from '../../placement/form'
import { loadBank } from '../../placement/load'
import { scorePlacement, type PlacementItem, type PlacementResult } from '../../placement/score'

const GROUP_SIZE = 12
// 375 寬兩欄時，11 字母以上的字（如 underground）放不進半欄；留一字餘裕
const LONG_WORD = 10

async function choose(level: Level) {
  await saveSettings(db, { cefrLevel: level }, Date.now())
  navigate('/', { replace: true })
}

function WordBox({ word, on, onToggle }: { word: string; on: boolean; onToggle: () => void }) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={on}
      onClick={onToggle}
      // 底色只在各狀態各給一次：共用 bg-surface 再覆寫 bg-primary-soft 時 CSS 順序會讓 surface 勝出（走查 P1-1）
      // 長字（≥ LONG_WORD 字母）佔滿整列，英文一律不斷字（走查 P1-2）
      className={`flex min-h-13 min-w-0 items-center gap-2.5 rounded-control text-left ${
        word.length >= LONG_WORD ? 'col-span-full' : ''
      } ${
        on
          ? 'border-2 border-primary bg-primary-soft px-[11px]'
          : 'border border-border bg-surface px-3'
      }`}
    >
      <span
        aria-hidden="true"
        className={`grid size-[22px] flex-none place-items-center rounded-md border-2 ${
          on ? 'border-primary bg-primary text-on-primary' : 'border-border'
        }`}
      >
        {on && <Check size={16} />}
      </span>
      <span lang="en" className="font-en text-body whitespace-nowrap">
        {word}
      </span>
    </button>
  )
}

function Pick({
  items,
  group,
  groups,
  checked,
  onToggle,
  onNext,
}: {
  items: PlacementItem[]
  group: number
  groups: number
  checked: ReadonlySet<string>
  onToggle: (word: string) => void
  onNext: () => void
}) {
  const n = items.filter((i) => checked.has(i.word)).length
  const last = group === groups - 1
  return (
    <FlowScreen
      header={
        <div className="flex min-h-11 items-center gap-2.5">
          <button
            type="button"
            className={`${iconBtnCls} text-text`}
            aria-label={t('placement.pick.exit')}
            onClick={goBack}
          >
            <X size={20} aria-hidden="true" />
          </button>
          <span
            role="progressbar"
            aria-label={t('placement.pick.group', { current: group + 1, total: groups })}
            aria-valuemin={0}
            aria-valuemax={groups}
            aria-valuenow={group + 1}
            className="h-1.5 flex-1 overflow-hidden rounded-full bg-line"
          >
            <span
              className="block h-full rounded-full bg-primary"
              style={{ width: `${((group + 1) / groups) * 100}%` }}
            />
          </span>
          <span className="text-caption text-muted tabular-nums">
            {t('placement.pick.group', { current: group + 1, total: groups })}
          </span>
        </div>
      }
      footer={
        <Button onClick={onNext}>
          {t(last ? 'placement.pick.finish' : 'placement.pick.next', { count: n })}
        </Button>
      }
    >
      <h1 className="font-heading text-title-sm font-bold">{t('placement.pick.instruction')}</h1>
      <p className="text-secondary text-muted">{t('placement.pick.hint')}</p>
      {/* 兩欄；窄螢幕、大字級自動改一欄；長字佔滿整列後以 dense 補位，不留空格 */}
      <div className="grid grid-flow-row-dense grid-cols-[repeat(auto-fill,minmax(min(100%,9.5em),1fr))] gap-2.5 font-en text-body">
        {items.map((i) => (
          <WordBox
            key={i.word}
            word={i.word}
            on={checked.has(i.word)}
            onToggle={() => onToggle(i.word)}
          />
        ))}
      </div>
    </FlowScreen>
  )
}

function Result({ r, onRetest }: { r: PlacementResult; onRetest: () => void }) {
  const [picking, setPicking] = useState(false)
  return (
    <FlowScreen
      header={
        <div className="flex min-h-11 items-center">
          <h1 className="font-heading text-title font-bold">{t('placement.result.title')}</h1>
        </div>
      }
      footer={
        <>
          {r.retest ? (
            <Button onClick={onRetest}>{t('placement.result.retest')}</Button>
          ) : (
            <Button onClick={() => choose(r.startLevel)}>
              {t('placement.result.start', { level: r.startLevel })}
            </Button>
          )}
          {/* 設計 s10 結果頁：文字鈕置中（文字變體預設靠左） */}
          <Button variant="text" className="justify-center!" onClick={() => setPicking(true)}>
            {t('placement.result.choose')}
            <ChevronRight size={20} aria-hidden="true" />
          </Button>
        </>
      }
    >
      <Card>
        <span
          data-testid="placement-level"
          className="font-heading text-display leading-[1.1] font-bold"
        >
          {r.startLevel}
        </span>
        <span className="text-secondary text-muted">
          {t('common.text.toeicApprox', { score: TOEIC_LISTENING[r.startLevel] })}
        </span>
        <span className="text-caption text-balance text-muted">
          {t('placement.result.toeicNote')}
        </span>
      </Card>
      <Card tight>
        <div data-testid="placement-bars" className="grid gap-2">
          {LEVELS.map((level) => {
            const pct = Math.round(r.hitRate[level] * 100)
            return (
              <div
                key={level}
                data-testid={`bar-${level}`}
                className="grid grid-cols-[2.2em_1fr_3.4em] items-center gap-2.5 text-secondary tabular-nums"
              >
                <span>{level}</span>
                <span className="h-2.5 overflow-hidden rounded-full bg-line">
                  <span className="block h-full bg-primary" style={{ width: `${pct}%` }} />
                </span>
                <span>{pct}%</span>
              </div>
            )
          })}
        </div>
        <span className="text-caption text-muted">{t('placement.result.chart')}</span>
      </Card>
      {r.falseAlarms > 0 && (
        <div
          role="status"
          className="flex items-center gap-2 rounded-control bg-hint-bg px-3.5 py-2.5 text-secondary text-hint"
        >
          <Info size={20} aria-hidden="true" className="flex-none" />
          {t(r.retest ? 'placement.result.retestHint' : 'placement.result.penalty', {
            count: r.falseAlarms,
          })}
        </div>
      )}
      {picking && (
        <LevelSheet selected={null} onSelect={choose} onClose={() => setPicking(false)} />
      )}
    </FlowScreen>
  )
}

export function PlacementScreen() {
  const [form, setForm] = useState<PlacementItem[] | null>(null)
  const [group, setGroup] = useState(0)
  const [checked, setChecked] = useState<Set<string>>(() => new Set())

  // 抽一份新題（進入時、重新測驗時）
  const start = useCallback(
    () =>
      loadBank().then(
        (bank) => {
          setForm(drawForm(bank, Math.random))
          setGroup(0)
          setChecked(new Set())
        },
        (e) => console.error(e),
      ),
    [],
  )
  useEffect(() => {
    start()
  }, [start])

  if (!form) return <div data-testid="screen-placement" className="h-dvh bg-bg" />
  const groups = Math.ceil(form.length / GROUP_SIZE)

  const toggle = (word: string) =>
    setChecked((prev) => {
      const next = new Set(prev)
      if (!next.delete(word)) next.add(word)
      return next
    })

  return (
    <div data-testid="screen-placement" className="contents">
      {group < groups ? (
        // 換組時重掛，捲動位置回到頂端
        <Pick
          key={group}
          items={form.slice(group * GROUP_SIZE, (group + 1) * GROUP_SIZE)}
          group={group}
          groups={groups}
          checked={checked}
          onToggle={toggle}
          onNext={() => setGroup(group + 1)}
        />
      ) : (
        <Result r={scorePlacement(form, checked)} onRetest={start} />
      )}
    </div>
  )
}
