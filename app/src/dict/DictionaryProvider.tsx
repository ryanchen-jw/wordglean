// 字典彈層的狀態與 Toast；掛在 App 根層，全 App 的 <EnglishText> 共用（設計 s08）
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
  const active = useRef<HTMLElement | null>(null)
  const seq = useRef(0)

  const open = useCallback(
    ({ token, sentenceStart, el }: OpenRequest) => {
      active.current?.removeAttribute('data-active')
      el.setAttribute('data-active', '')
      active.current = el
      const id = ++seq.current
      setView({ status: 'loading', token })
      deps()
        .then(async (d) => {
          const result = await lookupWord(token, { sentenceStart }, d)
          const info = result.found ? (d.lex.get(result.headword.toLowerCase()) ?? null) : null
          if (seq.current === id) setView({ status: 'done', result, info })
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

  const onFavorite = (headword: string, on: boolean) => {
    if (on) {
      void addFavorite(db, headword, Date.now())
      setToastWord(headword)
    } else {
      void removeFavorite(db, headword, Date.now())
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
              void removeFavorite(db, toastWord, Date.now())
              setToastWord(null)
            },
          }}
          placement={view ? 'top' : 'bottom'}
          onDismiss={() => setToastWord(null)}
        />
      )}
    </DictionaryContext.Provider>
  )
}
