// 可點英文字（components.md §12）：每個英文字包成按鈕、點了開字典彈層；平常無裝飾，
// 按下與彈層開啟期間（data-active）上 primary-soft 底；會洩漏答案的字作答前不可點、不可聚焦
// disabled 以原形比對（meetings、went 也算 meeting、go）；原形還原完成前整段先不可點，寧可多擋不漏擋
// disabled 含片語（give up）時，句中該片語的各字（gave it up 的 gave、up）都不可點
import { useEffect, useState, type MouseEvent } from 'react'
import { useDictionary } from './context'
import { baseForms } from './lookup'
import { splitOther, tokenize } from './tokenize'

export type EnglishTextProps = {
  /** 純文字；標點與數字不可點 */
  text: string
  /** 作答前會洩漏答案的字（小寫原形；變化形也一併不可點）；'all'＝整段不可點，例：分級測驗 */
  disabled?: ReadonlySet<string> | 'all'
  /** 每次開彈層回呼（查字次數記錄用） */
  onLookup?: (word: string) => void
  className?: string
}

// button 排版上是不可分割的行內方塊，方塊前後一律可斷行，字與緊鄰的標點會被拆到兩行。
// 緊鄰標點與字包進 inline-flex 同一列；標點在按鈕外，不可點也不進無障礙名稱。
// 字＋標點放不下一行時按鈕縮窄、字在按鈕內折行（min-w-0），標點留在最後一行末端，不溢出
const gluedCls = 'inline-flex max-w-full'

// 上下各 6px 透明點擊延伸（不影響行高），讓行內字的點擊高度接近 44px；比容器寬的長字在按鈕內折行
const wordCls =
  'relative max-w-full min-w-0 rounded-sm text-start wrap-break-word text-inherit before:absolute before:inset-x-0 before:-inset-y-1.5 before:content-[""] active:bg-primary-soft data-active:bg-primary-soft data-active:shadow-[inset_0_-2px_0_var(--lg-primary)] focus-visible:outline-3 focus-visible:outline-focus'

export function EnglishText({ text, disabled, onLookup, className = '' }: EnglishTextProps) {
  const dict = useDictionary()
  const tokens = tokenize(text)
  // 呼叫端每次渲染常建新的 Set：以內容當依賴，避免重算迴圈
  const disabledKey = disabled instanceof Set ? [...disabled].sort().join('|') : ''
  // 依原形比對後不可點的字（token 索引）；null＝還原中
  const [blocked, setBlocked] = useState<{ key: string; set: ReadonlySet<number> } | null>(null)
  const resolveKey = `${disabledKey}
${text}`

  // 畫面出現可點英文字才預先載入字典（第一次點字不用等）；首頁等沒有英文字的畫面不載（TASK-22 效能預算：字典延遲載入）
  useEffect(() => {
    dict?.deps().catch((e) => console.error(e))
  }, [dict])

  useEffect(() => {
    if (!dict || !disabledKey) return
    let alive = true
    const words = new Set(disabledKey.split('|'))
    dict
      .deps()
      .then(async (deps) => {
        const set = new Set<number>()
        const tks = tokenize(text)
        await Promise.all(
          tks.map(async (tk, i) => {
            if (tk.kind !== 'word') return
            for (const f of await baseForms(tk.text, deps)) if (words.has(f)) set.add(i)
          }),
        )
        // 片語（TASK-24）：句中出現的片語（含變化形、可分離）各字都不可點
        const phrases = [...words].filter((w) => w.includes(' '))
        if (phrases.length > 0) {
          const separable = new Map(deps.phrases.map((p) => [p.phrase, p.separable]))
          const { phraseSpans } = await import('./phrases')
          const spans = await phraseSpans(
            tks,
            phrases.map((phrase) => ({ phrase, separable: separable.get(phrase) ?? false })),
            deps.shards,
          )
          for (const s of spans) for (const i of s.at) set.add(i)
        }
        if (alive) setBlocked({ key: resolveKey, set })
      })
      .catch((e) => console.error(e))
    return () => {
      alive = false
    }
  }, [dict, disabledKey, text, resolveKey])

  const isDisabled = (w: string, i: number) => {
    if (!dict || disabled === 'all') return true
    if (!disabledKey) return false
    if (disabled instanceof Set && disabled.has(w.toLowerCase())) return true
    return blocked?.key !== resolveKey || blocked.set.has(i)
  }

  const parts = (i: number) => {
    const tk = tokens[i]
    return tk?.kind === 'other' ? splitOther(tk.text, i > 0, i < tokens.length - 1) : null
  }

  return (
    <span lang="en" className={`min-w-0 ${className}`}>
      {tokens.map((tk, i) => {
        if (tk.kind === 'other') return parts(i)!.mid
        const before = parts(i - 1)?.trail ?? ''
        const after = parts(i + 1)?.lead ?? ''
        if (isDisabled(tk.text, i)) return before + tk.text + after
        const onClick = (e: MouseEvent<HTMLButtonElement>) => {
          // Safari 點按鈕不會給焦點；先聚焦，彈層關閉時才能把焦點還給這個字
          e.currentTarget.focus()
          onLookup?.(tk.text)
          dict!.open({
            token: tk.text,
            sentenceStart: tk.sentenceStart,
            el: e.currentTarget,
            context: { tokens, index: i },
          })
        }
        const button = (
          <button key={i} type="button" data-en-word="" className={wordCls} onClick={onClick}>
            {tk.text}
          </button>
        )
        if (!before && !after) return button
        return (
          <span key={i} className={gluedCls}>
            {before && <span className="shrink-0">{before}</span>}
            {button}
            {after && <span className="shrink-0 self-end">{after}</span>}
          </span>
        )
      })}
    </span>
  )
}
