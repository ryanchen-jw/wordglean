// 字典彈層的狀態與 Toast；掛在 App 根層，全 App 的 <EnglishText> 共用（設計 s08）
import { CircleAlert } from 'lucide-react'
import { useCallback, useMemo, useRef, useState, type ReactNode } from 'react'
import { db } from '../data/appDb'
import { addFavorite, removeFavorite } from '../data/repo'
import { t } from '../i18n/t'
import { Toast } from '../ui/Toast'
import { DictionaryContext, type DictionaryApi, type OpenRequest } from './context'
import { DictionarySheet, type SheetView } from './DictionarySheet'
import { appDictDeps } from './appDeps'
import { lookupWord, type LookupDeps } from './lookup'

type Props = { children: ReactNode; deps?: () => Promise<LookupDeps> }

export function DictionaryProvider({ children, deps = appDictDeps }: Props) {
  const [view, setView] = useState<SheetView | null>(null)
  const [toastWord, setToastWord] = useState<string | null>(null)
  const [writeFailed, setWriteFailed] = useState(false)
  const active = useRef<HTMLElement | null>(null)
  const seq = useRef(0)

  const open = useCallback(
    ({ token, sentenceStart, el, context }: OpenRequest) => {
      active.current?.removeAttribute('data-active')
      el.setAttribute('data-active', '')
      active.current = el
      const id = ++seq.current
      setView({ status: 'loading', token })
      deps()
        .then(async (d) => {
          const [result, phrases] = await Promise.all([
            lookupWord(token, { sentenceStart }, d),
            context
              ? import('./phrases').then((m) =>
                  m.phrasesAt(context.tokens, context.index, d.phrases, d.shards),
                )
              : [],
          ])
          const info = result.found ? (d.lex.get(result.headword.toLowerCase()) ?? null) : null
          if (seq.current === id) setView({ status: 'done', result, info, phrases })
        })
        .catch((e) => {
          console.error(e)
          if (seq.current === id) setView({ status: 'error', token })
        })
    },
    [deps],
  )

  const close = useCallback(() => {
    seq.current++
    active.current?.removeAttribute('data-active')
    active.current = null
    setView(null)
  }, [])

  // 收藏先樂觀提示；寫入失敗（例：IndexedDB 空間不足）時收回提示、改告知沒有存到
  const onWriteError = (e: unknown) => {
    console.error(e)
    setToastWord(null)
    setWriteFailed(true)
  }

  const onFavorite = (headword: string, on: boolean) => {
    setWriteFailed(false)
    if (on) {
      addFavorite(db, headword, Date.now()).catch(onWriteError)
      setToastWord(headword)
    } else {
      removeFavorite(db, headword, Date.now()).catch(onWriteError)
      setToastWord(null)
    }
  }

  const api = useMemo<DictionaryApi>(() => ({ open, deps }), [open, deps])

  return (
    <DictionaryContext.Provider value={api}>
      {children}
      {view && <DictionarySheet view={view} onClose={close} onFavorite={onFavorite} />}
      {toastWord && (
        <Toast
          key={toastWord}
          message={t('dict.favorite.added')}
          action={{
            label: t('dict.favorite.undo'),
            onClick: () => {
              removeFavorite(db, toastWord, Date.now()).catch(onWriteError)
              setToastWord(null)
            },
          }}
          placement={view ? 'top' : 'bottom'}
          onDismiss={() => setToastWord(null)}
        />
      )}
      {writeFailed && (
        <Toast
          icon={CircleAlert}
          message={t('system.error.generic')}
          placement={view ? 'top' : 'bottom'}
          onDismiss={() => setWriteFailed(false)}
        />
      )}
    </DictionaryContext.Provider>
  )
}
