// 可點英文字（components.md §12）：每個英文字包成按鈕、點了開字典彈層；平常無裝飾，
// 按下與彈層開啟期間（data-active）上 primary-soft 底；會洩漏答案的字作答前不可點、不可聚焦
// disabled 以原形比對（meetings、went 也算 meeting、go）；原形還原完成前整段先不可點，寧可多擋不漏擋
import { useEffect, useState, type MouseEvent } from 'react'
import { useDictionary } from './context'
import { baseForms } from './lookup'
import { tokenize } from './tokenize'

export type EnglishTextProps = {
  /** 純文字；標點與數字不可點 */
  text: string
  /** 作答前會洩漏答案的字（小寫原形；變化形也一併不可點）；'all'＝整段不可點，例：分級測驗 */
  disabled?: ReadonlySet<string> | 'all'
  /** 每次開彈層回呼（查字次數記錄用） */
  onLookup?: (word: string) => void
  className?: string
}

// 上下各 6px 透明點擊延伸（不影響行高），讓行內字的點擊高度接近 44px
const wordCls =
  'relative rounded-sm text-inherit before:absolute before:inset-x-0 before:-inset-y-1.5 before:content-[""] active:bg-primary-soft data-active:bg-primary-soft data-active:shadow-[inset_0_-2px_0_var(--lg-primary)] focus-visible:outline-3 focus-visible:outline-focus'

export function EnglishText({ text, disabled, onLookup, className = '' }: EnglishTextProps) {
  const dict = useDictionary()
  const tokens = tokenize(text)
  // 呼叫端每次渲染常建新的 Set：以內容當依賴，避免重算迴圈
  const disabledKey = disabled instanceof Set ? [...disabled].sort().join('|') : ''
  // 依原形比對後不可點的字（token 索引）；null＝還原中
  const [blocked, setBlocked] = useState<{ key: string; set: ReadonlySet<number> } | null>(null)
  const resolveKey = `${disabledKey}
${text}`

  useEffect(() => {
    if (!dict || !disabledKey) return
    let alive = true
    const words = new Set(disabledKey.split('|'))
    dict
      .deps()
      .then(async (deps) => {
        const set = new Set<number>()
        await Promise.all(
          tokenize(text).map(async (tk, i) => {
            if (tk.kind !== 'word') return
            for (const f of await baseForms(tk.text, deps)) if (words.has(f)) set.add(i)
          }),
        )
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

  return (
    <span lang="en" className={className}>
      {tokens.map((tk, i) => {
        if (tk.kind === 'other' || isDisabled(tk.text, i)) return tk.text
        const onClick = (e: MouseEvent<HTMLButtonElement>) => {
          // Safari 點按鈕不會給焦點；先聚焦，彈層關閉時才能把焦點還給這個字
          e.currentTarget.focus()
          onLookup?.(tk.text)
          dict!.open({ token: tk.text, sentenceStart: tk.sentenceStart, el: e.currentTarget })
        }
        return (
          <button key={i} type="button" data-en-word="" className={wordCls} onClick={onClick}>
            {tk.text}
          </button>
        )
      })}
    </span>
  )
}
