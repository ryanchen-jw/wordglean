// 單字庫（設計 s09）：分頁（全部／到期／收藏）＋熟悉度下拉＋英文或中文搜尋；列出中文釋義、英文字可點查義（TASK-16）
import { BookOpen, ChevronDown, Search, Star } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { db } from '../../data/appDb'
import type { PoolWord } from '../../data/db'
import { inPool } from '../../data/repo'
import { useLiveQuery } from '../../data/useLiveQuery'
import { useDictionary } from '../../dict/context'
import { EnglishText } from '../../dict/EnglishText'
import { shortGloss } from '../../dict/format'
import { glossLine } from '../../dict/gloss'
import { t, type MessageKey } from '../../i18n/t'
import { navigate } from '../../router'
import { TabScreen } from '../../shell/Screen'
import { deviceTimeZone } from '../../srs/daily'
import { Button } from '../../ui/Button'
import { OptionSheet } from '../../ui/OptionSheet'
import { dueLabel, filterWords, isDue, type Familiarity, type Scope } from './wordsModel'

// 一次只畫一批，捲到底再補（單字池上限約數千字）
const PAGE = 50

const SCOPES: { value: Scope; label: MessageKey }[] = [
  { value: 'all', label: 'words.filter.all' },
  { value: 'due', label: 'words.filter.due' },
  { value: 'favorite', label: 'words.filter.favorite' },
]

const FAMILIARITY: { value: Familiarity | 'all'; label: MessageKey }[] = [
  { value: 'all', label: 'words.filter.familiarityAll' },
  { value: 'new', label: 'words.filter.familiarityNew' },
  { value: 'learning', label: 'words.filter.familiarityLearning' },
  { value: 'familiar', label: 'words.filter.familiarityFamiliar' },
]

const chipCls = (on: boolean) =>
  `inline-flex min-h-11 items-center gap-1 rounded-chip border px-3.5 text-secondary active:scale-(--lg-press-scale) ${
    on
      ? 'border-primary bg-primary font-bold text-on-primary'
      : 'border-border bg-surface text-text active:bg-primary-soft'
  }`

function EmptyState() {
  return (
    <div className="grid justify-items-center gap-2.5 px-3 py-12 text-center">
      <BookOpen size={28} aria-hidden="true" className="text-muted" />
      <h2 className="font-heading text-title-sm font-bold">{t('words.empty.title')}</h2>
      <p className="text-secondary text-muted">{t('words.empty.body')}</p>
      <Button className="max-w-60" onClick={() => navigate('/course')}>
        {t('words.empty.button')}
      </Button>
    </div>
  )
}

/** 單字池各字的中文釋義行（wordId → 釋義）；字典載入前為空表 */
function useGlosses(words: readonly PoolWord[] | undefined): ReadonlyMap<string, string> {
  const dict = useDictionary()
  const [glosses, setGlosses] = useState<ReadonlyMap<string, string>>(new Map())
  const key = words?.map((w) => w.wordId).join(' ')
  useEffect(() => {
    if (!dict || !key) return
    let alive = true
    dict
      .deps()
      .then(async (deps) => {
        const ids = key.split(' ')
        const lines = await Promise.all(ids.map((id) => glossLine(id, deps)))
        const map = new Map<string, string>()
        ids.forEach((id, i) => lines[i] !== null && map.set(id, lines[i]))
        if (alive) setGlosses(map)
      })
      .catch((e) => console.error(e))
    return () => {
      alive = false
    }
  }, [dict, key])
  return glosses
}

type ListProps = { words: PoolWord[]; nowMs: number; glosses: ReadonlyMap<string, string> }

function WordList({ words, nowMs, glosses }: ListProps) {
  const [shown, setShown] = useState(PAGE)
  const sentinel = useRef<HTMLLIElement>(null)
  const tz = deviceTimeZone()

  useEffect(() => {
    const el = sentinel.current
    if (!el || typeof IntersectionObserver === 'undefined') return
    const io = new IntersectionObserver((entries) => {
      if (entries.some((e) => e.isIntersecting)) setShown((n) => n + PAGE)
    })
    io.observe(el)
    return () => io.disconnect()
  }, [shown, words])

  if (words.length === 0)
    return <p className="py-6 text-center text-secondary text-muted">{t('words.list.noMatch')}</p>

  return (
    <div data-testid="word-card" className="rounded-card border border-line bg-surface px-4 py-1">
      {/* 欄寬 minmax(0,1fr)：列的最小內容寬（長英文字）不得撐大 grid 隱含欄而伸出卡片（走查 P0-1b） */}
      <ul className="grid grid-cols-[minmax(0,1fr)]" data-testid="word-list">
        {words.slice(0, shown).map((w) => {
          const due = isDue(w, nowMs)
          return (
            <li
              key={w.wordId}
              className="flex min-h-13 items-center justify-between gap-3 border-b border-line last:border-b-0"
            >
              {/* 英文字優先：同一行放不下時中文釋義換到下一行，各自過長才截斷 */}
              <span className="flex min-w-0 flex-wrap items-baseline gap-x-3 py-1.5">
                <EnglishText
                  text={w.wordId}
                  className="max-w-full truncate font-en font-semibold"
                />
                {glosses.has(w.wordId) && (
                  <span className="max-w-full truncate text-secondary text-muted">
                    {shortGloss(glosses.get(w.wordId)!)}
                  </span>
                )}
              </span>
              <span
                className={`inline-flex flex-none items-center gap-1 text-secondary tabular-nums ${
                  due ? 'font-bold text-primary' : 'text-muted'
                }`}
              >
                {w.favoritedAt !== null && (
                  <Star size={20} className="text-primary" aria-label={t('words.list.favorited')} />
                )}
                {dueLabel(w, nowMs, tz)}
              </span>
            </li>
          )
        })}
        {shown < words.length && <li ref={sentinel} aria-hidden="true" className="h-px" />}
      </ul>
    </div>
  )
}

export function WordsScreen() {
  // 「現在」跟著資料一起取，資料變動時一併更新（render 內不可呼叫 Date.now）
  const data = useLiveQuery(
    // 來源歸零（取消收藏、按了復原）的字不算在池中（TASK-16 D3）
    async () => ({ words: (await db.wordPool.toArray()).filter(inPool), nowMs: Date.now() }),
    [],
  )
  const words = data?.words
  const nowMs = data?.nowMs ?? 0
  const [scope, setScope] = useState<Scope>('all')
  const [familiarity, setFamiliarity] = useState<Familiarity | 'all'>('all')
  const [query, setQuery] = useState('')
  const [sheetOpen, setSheetOpen] = useState(false)
  const glosses = useGlosses(words)

  const dueCount = words?.filter((w) => isDue(w, nowMs)).length ?? 0
  const summary = !words
    ? undefined
    : words.length === 0
      ? t('words.header.summaryEmpty')
      : t('words.header.summary', { total: words.length, due: dueCount })
  const familiarityName = t(FAMILIARITY.find((f) => f.value === familiarity)!.label)
  const filterKey = `${scope}|${familiarity}|${query}`

  return (
    <TabScreen title={t('words.header.title')} subtitle={summary}>
      <div data-testid="screen-words" className="contents">
        {words?.length === 0 && <EmptyState />}
        {words && words.length > 0 && (
          <>
            <label className="flex min-h-12 items-center gap-2 rounded-control border border-border bg-surface px-3.5 text-muted focus-within:outline-3 focus-within:outline-offset-1 focus-within:outline-focus">
              <Search size={20} aria-hidden="true" className="flex-none" />
              {/* w-0：input 預設 20 字寬會在特大字級撐寬版面，由 flex-1 長回剩餘寬度 */}
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t('words.filter.search')}
                aria-label={t('words.filter.search')}
                autoCapitalize="none"
                autoCorrect="off"
                spellCheck={false}
                className="w-0 min-w-0 flex-1 appearance-none bg-transparent text-body text-text outline-none placeholder:font-sans placeholder:text-secondary placeholder:text-muted"
              />
            </label>
            <div role="group" aria-label={t('words.filter.scopeLabel')} className="flex gap-2">
              {SCOPES.map((s) => (
                <button
                  key={s.value}
                  type="button"
                  aria-pressed={scope === s.value}
                  onClick={() => setScope(s.value)}
                  className={chipCls(scope === s.value)}
                >
                  {t(s.label)}
                </button>
              ))}
            </div>
            <button
              type="button"
              aria-haspopup="listbox"
              onClick={() => setSheetOpen(true)}
              className={`${chipCls(false)} justify-self-start`}
            >
              {t('words.filter.familiarity', { name: familiarityName })}
              <ChevronDown size={20} aria-hidden="true" />
            </button>
            <WordList
              key={filterKey}
              words={filterWords(words, { scope, familiarity, query }, nowMs, glosses)}
              nowMs={nowMs}
              glosses={glosses}
            />
          </>
        )}
      </div>
      {sheetOpen && (
        <OptionSheet
          label={t('words.filter.familiaritySheet')}
          options={FAMILIARITY.map((f) => ({ value: f.value, label: t(f.label) }))}
          selected={familiarity}
          onSelect={setFamiliarity}
          onClose={() => setSheetOpen(false)}
        />
      )}
    </TabScreen>
  )
}
