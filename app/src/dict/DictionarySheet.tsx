// 字典彈層內容（設計 s08、components.md §7）：原形提示、單字＋級距／多益標籤、音標＋詞性＋發音、
// 釋義、收藏鈕兩態、資料來源；查詢中顯示骨架線，查無此字隱藏收藏鈕
import { Info, Star, Volume2 } from 'lucide-react'
import { db } from '../data/appDb'
import { useLiveQuery } from '../data/useLiveQuery'
import { t } from '../i18n/t'
import { iconBtnCls } from '../shell/Screen'
import { speak } from '../speech/speak'
import { BottomSheet } from '../ui/BottomSheet'
import { Button } from '../ui/Button'
import { formatPhonetic, parseGloss, sharedPos } from './format'
import type { LexInfo } from './lexicon'
import type { LookupResult } from './lookup'
import type { Phrase } from './phrases'

export type SheetView =
  | { status: 'loading'; token: string }
  | { status: 'error'; token: string }
  | { status: 'done'; result: LookupResult; info: LexInfo | null; phrases: readonly Phrase[] }

type Props = {
  view: SheetView
  onClose: () => void
  onFavorite: (headword: string, on: boolean) => void
}

// 單字不從字中折斷：放不下時標籤換到下一行；只有比整行還長的字才斷字
const headCls = 'max-w-full font-en text-title font-semibold break-words'
const tagCls =
  'inline-flex items-center rounded-chip border border-primary px-2 py-1 text-caption leading-none text-primary'
const sourceCls = 'text-caption text-muted'

function FavoriteButton({
  headword,
  onFavorite,
}: { headword: string } & Pick<Props, 'onFavorite'>) {
  const row = useLiveQuery(() => db.wordPool.get(headword), [headword])
  const saved = row?.favoritedAt != null
  if (saved)
    return (
      // 已收藏態（設計 s08）：primary-soft 底、primary 字；按鈕規則同 Button（縮放＋不改尺寸）
      <button
        type="button"
        aria-pressed="true"
        data-multiline
        onClick={() => onFavorite(headword, false)}
        className="flex min-h-13 w-full items-center justify-center gap-2 rounded-control bg-primary-soft px-3 text-body font-bold text-balance text-primary transition-transform duration-(--lg-duration-press) ease-standard active:scale-(--lg-press-scale)"
      >
        <Star size={20} aria-hidden="true" className="flex-none fill-current" />
        {t('dict.favorite.saved')}
      </button>
    )
  return (
    <Button
      variant="secondary"
      aria-pressed="false"
      data-multiline
      onClick={() => onFavorite(headword, true)}
    >
      <Star size={20} aria-hidden="true" className="flex-none" />
      {t('dict.favorite.add')}
    </Button>
  )
}

/** 被點的字屬於片語時（TASK-24）：片語＋「片語」與級距標籤、發音、釋義、收藏（以片語為鍵），放在單字之前 */
function PhraseFound({ phrase, onFavorite }: { phrase: Phrase } & Pick<Props, 'onFavorite'>) {
  return (
    <section data-testid="dict-phrase" className="grid gap-3 border-b border-line pb-4">
      <div className="flex flex-wrap items-start justify-between gap-x-3 gap-y-1">
        <h2 lang="en" className={headCls}>
          {phrase.phrase}
        </h2>
        <span className="flex flex-none gap-1.5 pt-1.5">
          <span className={tagCls}>{t('dict.sheet.phrase')}</span>
          <span className={tagCls}>{phrase.cefr}</span>
        </span>
      </div>
      <div className="-my-1 flex items-center gap-x-3">
        <p className="min-w-0 flex-1 font-zh-tr text-body">{phrase.glossZh}</p>
        <button
          type="button"
          aria-label={t('dict.sheet.speak')}
          className={`${iconBtnCls} text-primary`}
          onClick={() => speak(phrase.phrase)}
        >
          <Volume2 size={20} aria-hidden="true" />
        </button>
      </div>
      <FavoriteButton headword={phrase.phrase} onFavorite={onFavorite} />
    </section>
  )
}

function Found({
  result,
  info,
  onFavorite,
}: Pick<Props, 'onFavorite'> & {
  result: Extract<LookupResult, { found: true }>
  info: LexInfo | null
}) {
  const { query, headword, entry } = result
  const lines = parseGloss(entry.lines)
  const pos = sharedPos(lines)
  const phonetic = formatPhonetic(entry.phonetic)
  return (
    <>
      {query.toLowerCase() !== headword.toLowerCase() && (
        <p className={sourceCls}>{t('dict.sheet.baseForm', { query, headword })}</p>
      )}
      <div className="flex flex-wrap items-start justify-between gap-x-3 gap-y-1">
        <h2 lang="en" className={headCls}>
          {headword}
        </h2>
        <span className="flex flex-none gap-1.5 pt-1.5">
          {info?.cefr && <span className={tagCls}>{info.cefr}</span>}
          {info?.toeic && <span className={tagCls}>{t('dict.sheet.toeic')}</span>}
        </span>
      </div>
      <div className="-my-1 flex flex-wrap items-center gap-x-1.5">
        {phonetic && (
          <span lang="en-fonipa" className="font-ipa text-secondary text-muted">
            {phonetic}
          </span>
        )}
        {pos && (
          <span lang="en" className="text-caption text-muted">
            {pos}
          </span>
        )}
        <button
          type="button"
          aria-label={t('dict.sheet.speak')}
          className={`${iconBtnCls} text-primary`}
          onClick={() => speak(headword)}
        >
          <Volume2 size={20} aria-hidden="true" />
        </button>
      </div>
      <ol className="grid list-decimal gap-1 pl-[1.4em] font-zh-tr text-body">
        {lines.map((l, i) => (
          <li key={i}>
            {l.pos && !pos && (
              <span lang="en" className="mr-1 text-caption text-muted">
                {l.pos}
              </span>
            )}
            {l.text}
          </li>
        ))}
      </ol>
      <FavoriteButton headword={headword} onFavorite={onFavorite} />
    </>
  )
}

export function DictionarySheet({ view, onClose, onFavorite }: Props) {
  let body
  if (view.status === 'loading') {
    body = (
      <div aria-busy="true" className="grid gap-3">
        <span className="sr-only">{t('dict.sheet.loading')}</span>
        <div className="h-8 w-2/5 animate-pulse rounded-sm bg-line" />
        <div className="h-4 w-1/3 animate-pulse rounded-sm bg-line" />
        <div className="h-4 w-4/5 animate-pulse rounded-sm bg-line" />
        <div className="h-4 w-3/5 animate-pulse rounded-sm bg-line" />
      </div>
    )
  } else if (view.status === 'done' && view.result.found) {
    body = <Found result={view.result} info={view.info} onFavorite={onFavorite} />
  } else {
    const token = view.status === 'done' ? view.result.query : view.token
    body = (
      <>
        <h2 lang="en" className={headCls}>
          {token}
        </h2>
        <p className="flex items-center gap-1.5 text-secondary text-muted">
          <Info size={20} aria-hidden="true" className="flex-none" />
          {view.status === 'error' ? t('dict.sheet.loadFailed') : t('dict.sheet.notFound')}
        </p>
      </>
    )
  }
  return (
    <BottomSheet label={t('dict.sheet.label')} onClose={onClose}>
      <div data-testid="dict-sheet" className="grid min-w-0 gap-3">
        {view.status === 'done' &&
          view.phrases.map((p) => (
            <PhraseFound key={p.phrase} phrase={p} onFavorite={onFavorite} />
          ))}
        {body}
        <p className={sourceCls}>
          {t(
            view.status === 'done' && view.phrases.length > 0
              ? 'dict.sheet.sourceWithPhrase'
              : 'dict.sheet.source',
          )}
        </p>
      </div>
    </BottomSheet>
  )
}
