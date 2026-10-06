// 片語表（data/phrases/phrases.json，TASK-24；本專案自編，CC BY-SA 4.0）：點字查片語、片語的釋義與收藏複習卡
// 同單字總表以 ?url 輸出成獨立資產、用到才載（不進首屏 bundle）；本模組的程式碼也只以 import() 動態載入
// （首屏 JS 預算見 e2e/perf-budget.spec.ts），其他檔只可 import type
// 比對規則同 content/scripts/lib/phrase-match.mjs（content/CLAUDE.md「片語比對」）：
//   ① 只在同一子句內比對：字與字之間夾了空白以外的東西（標點、・、數字）就斷開
//   ② 每個成分接受詞形變化（gave up、looking forward to）；小品詞沒有變化形，give in 不會對到 give up
//   ③ 片語裡的 your／one's 代表任一所有格（did my best）；冠詞照原字
//   ④ 可分離片語：第 1 個成分後可插入 1–3 個字當受詞（pick it up），其餘成分接連出現
import phrasesUrl from '../../../data/phrases/phrases.json?url'
import { BE_FORMS, ruleCandidates, stripClitic } from './lemmatize'
import type { Cefr } from './lexicon'
import type { ShardStore } from './shards'
import type { Token } from './tokenize'

/** phrases.json 的一筆，只列本 app 用到的欄位；鍵＝小寫片語字串（同單字池 wordId） */
export interface Phrase {
  phrase: string
  cefr: Cefr
  /** 義項以全形「；」分隔；受詞位置統一成「⋯」（同題庫） */
  glossZh: string
  separable: boolean
}

export const MAX_GAP = 3
const POSSESSIVES: ReadonlySet<string> = new Set('my your his her its our their'.split(' '))
const isSlot = (part: string) => part === 'your' || part === "one's"

/** 片語表原文用「…」，App 與題庫用「⋯」 */
export const toPhrases = (rows: readonly Phrase[]): Phrase[] =>
  rows.map(({ phrase, cefr, glossZh, separable }) => ({
    phrase,
    cefr,
    glossZh: glossZh.replaceAll('…', '⋯'),
    separable,
  }))

let loaded: Promise<Phrase[]> | undefined

/** App 執行期用：載入一次後共用 */
export function loadPhrases(): Promise<Phrase[]> {
  if (!loaded) {
    loaded = fetch(phrasesUrl)
      .then((res) => {
        if (!res.ok) throw new Error(`片語表載入失敗：${res.status}`)
        return res.json() as Promise<{ phrases: Phrase[] }>
      })
      .then((doc) => toPhrases(doc.phrases))
    loaded.catch(() => (loaded = undefined))
  }
  return loaded
}

/** 一個字可對到的原形（小寫，含自己）：縮寫去尾、be 動詞、變化形表、去字尾規則 */
export async function wordForms(token: string, shards: ShardStore): Promise<Set<string>> {
  const lower = stripClitic(token).toLowerCase()
  const out = new Set([lower])
  if (BE_FORMS.has(lower)) out.add('be')
  for (const l of (await shards.get(lower))?.f[lower] ?? []) out.add(l)
  for (const c of ruleCandidates(lower)) out.add(c)
  return out
}

/** 子句：同一子句的字（token 索引），標點等夾在中間就斷開 */
export function clausesOf(tokens: readonly Token[]): number[][] {
  const out: number[][] = [[]]
  tokens.forEach((tk, i) => {
    if (tk.kind === 'word') out.at(-1)!.push(i)
    else if (/\S/.test(tk.text) && out.at(-1)!.length) out.push([])
  })
  return out.filter((c) => c.length > 0)
}

const matchesPart = (forms: ReadonlySet<string>, word: string, part: string) =>
  isSlot(part) ? POSSESSIVES.has(word) : forms.has(part)

/**
 * 在一個子句裡找片語；words＝各字小寫原字、forms＝各字可對到的原形。
 * 回傳每處符合時片語成分所在的位置（子句內索引；不含插入的受詞）
 */
export function findPhrase(
  words: readonly string[],
  forms: readonly ReadonlySet<string>[],
  { phrase, separable }: Pick<Phrase, 'phrase' | 'separable'>,
): number[][] {
  const parts = phrase.toLowerCase().split(/\s+/)
  const hits: number[][] = []
  const gaps =
    separable && parts.length > 1 ? [0, ...Array.from({ length: MAX_GAP }, (_, g) => g + 1)] : [0]
  for (let i = 0; i < words.length; i++) {
    if (!matchesPart(forms[i], words[i], parts[0])) continue
    for (const gap of gaps) {
      const at = parts.slice(1).map((_, k) => i + 1 + gap + k)
      if (at.every((j, k) => j < words.length && matchesPart(forms[j], words[j], parts[k + 1]))) {
        hits.push([i, ...at])
        break
      }
    }
  }
  return hits
}

/**
 * 一段文字中各片語出現的位置（token 索引）：candidates 中有出現的，每處一筆。
 * 先以「片語每個成分都對得到子句裡某字的原形」預篩，再逐字比對
 */
export async function phraseSpans(
  tokens: readonly Token[],
  candidates: readonly Pick<Phrase, 'phrase' | 'separable'>[],
  shards: ShardStore,
): Promise<{ phrase: string; at: number[] }[]> {
  const out: { phrase: string; at: number[] }[] = []
  for (const clause of clausesOf(tokens)) {
    if (clause.length < 2) continue
    const words = clause.map((i) => stripClitic(tokens[i].text).toLowerCase())
    const forms = await Promise.all(clause.map((i) => wordForms(tokens[i].text, shards)))
    const all = new Set(forms.flatMap((f) => [...f]))
    for (const c of candidates) {
      const parts = c.phrase.toLowerCase().split(/\s+/)
      if (parts.length < 2 || !parts.every((p) => isSlot(p) || all.has(p))) continue
      for (const hit of findPhrase(words, forms, c))
        out.push({ phrase: c.phrase, at: hit.map((k) => clause[k]) })
    }
  }
  return out
}

/** 點到的字（token 索引）屬於哪些片語：長的在前，同一片語只列一次 */
export async function phrasesAt(
  tokens: readonly Token[],
  index: number,
  phrases: readonly Phrase[],
  shards: ShardStore,
): Promise<Phrase[]> {
  const byKey = new Map(phrases.map((p) => [p.phrase, p]))
  const hits = (await phraseSpans(tokens, phrases, shards)).filter((s) => s.at.includes(index))
  return [...new Set(hits.map((h) => h.phrase))]
    .map((k) => byKey.get(k)!)
    .sort((a, b) => b.phrase.length - a.phrase.length)
}
