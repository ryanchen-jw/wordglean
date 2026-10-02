// 單字庫（設計 s09）的篩選、熟悉度、到期標示；規則見 docs/verification/2026-10-02-task11-shell-evidence/proposal.md
import type { PoolWord } from '../../data/db'
import { t } from '../../i18n/t'
import { dayBoundsUtc, localDayKey } from '../../srs/daily'
import { CardState } from '../../srs/scheduler'

export type Scope = 'all' | 'due' | 'favorite'
export type Familiarity = 'new' | 'learning' | 'familiar'

/** 記憶穩定度達此天數視為熟悉（D6，沿用 Anki「成熟卡」慣例） */
export const FAMILIAR_STABILITY_DAYS = 21

export function familiarityOf(w: Pick<PoolWord, 'state' | 'stability'>): Familiarity {
  if (w.state === CardState.New || w.state === CardState.Relearning) return 'new'
  if (w.state === CardState.Review && w.stability >= FAMILIAR_STABILITY_DAYS) return 'familiar'
  return 'learning'
}

/** 已開始學且已到期（與 countDue 同義） */
export const isDue = (w: PoolWord, nowMs: number) => w.state !== CardState.New && w.due <= nowMs

export interface WordFilter {
  scope: Scope
  familiarity: Familiarity | 'all'
  query: string
}

/**
 * 篩選後依到期時間排序（最急的在前），還沒開始學的新字排最後；
 * 搜尋比對英文與中文釋義（glosses：wordId → 釋義行，TASK-16）
 */
export function filterWords(
  words: readonly PoolWord[],
  f: WordFilter,
  nowMs: number,
  glosses?: ReadonlyMap<string, string>,
): PoolWord[] {
  const q = f.query.trim().toLowerCase()
  return words
    .filter(
      (w) =>
        (f.scope === 'all' || (f.scope === 'due' ? isDue(w, nowMs) : w.favoritedAt !== null)) &&
        (f.familiarity === 'all' || familiarityOf(w) === f.familiarity) &&
        (q === '' || w.wordId.includes(q) || (glosses?.get(w.wordId)?.includes(q) ?? false)),
    )
    .sort((a, b) => {
      const an = a.state === CardState.New
      const bn = b.state === CardState.New
      if (an !== bn) return an ? 1 : -1
      return an ? a.addedAt - b.addedAt : a.due - b.due || a.wordId.localeCompare(b.wordId)
    })
}

const daysBetween = (fromKey: string, toKey: string) =>
  Math.round((Date.parse(toKey) - Date.parse(fromKey)) / 86_400_000)

/** 列表右側的到期標示：今天到期／N 天後／N 個月後／N 年後；新字標「新字」 */
export function dueLabel(w: Pick<PoolWord, 'state' | 'due'>, nowMs: number, timeZone: string) {
  if (w.state === CardState.New) return t('words.due.newWord')
  const today = localDayKey(nowMs, timeZone)
  if (w.due < dayBoundsUtc(today, timeZone).endMs) return t('words.due.today')
  const days = daysBetween(today, localDayKey(w.due, timeZone))
  if (days < 30) return t('words.due.days', { n: days })
  if (days < 365) return t('words.due.months', { n: Math.floor(days / 30) })
  return t('words.due.years', { n: Math.floor(days / 365) })
}
