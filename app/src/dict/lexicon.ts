// 單字總表（data/lexicon/lexicon.json，逐欄位授權見 lexicon.LICENSE.md）：級距、多益常考、簡短中文
// 字典切片刻意不含這些欄位（data/CLAUDE.md），彈層與單字庫另查本表；同樣以 ?url 輸出成獨立資產
import lexiconUrl from '../../../data/lexicon/lexicon.json?url'

export type Cefr = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2'

/** lexicon.json 的一列（一個詞性一筆），只列本 app 用到的欄位 */
export interface LexRow {
  headword: string
  pos: string | null
  cefr: Cefr | null
  toeic: boolean
  freqRank: number | null
  glossZh: string | null
}

/** 同一字（不分大小寫）各詞性合併：級距取最低、多益任一詞性即算、中文取級距最低那個詞性的 */
export interface LexInfo {
  cefr: Cefr | null
  toeic: boolean
  freqRank: number | null
  glossZh: string | null
}

export type LexIndex = ReadonlyMap<string, LexInfo>

const CEFR_ORDER: readonly (Cefr | null)[] = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2', null]
export const cefrRank = (c: Cefr | null) => CEFR_ORDER.indexOf(c)

const minRank = (a: number | null, b: number | null) =>
  a === null ? b : b === null ? a : Math.min(a, b)

export function buildLexIndex(rows: readonly LexRow[]): LexIndex {
  const index = new Map<string, LexInfo>()
  for (const r of rows) {
    const key = r.headword.toLowerCase()
    const prev = index.get(key)
    if (!prev) {
      index.set(key, { cefr: r.cefr, toeic: r.toeic, freqRank: r.freqRank, glossZh: r.glossZh })
      continue
    }
    const lower = cefrRank(r.cefr) < cefrRank(prev.cefr)
    index.set(key, {
      cefr: lower ? r.cefr : prev.cefr,
      toeic: prev.toeic || r.toeic,
      freqRank: minRank(prev.freqRank, r.freqRank),
      glossZh: (lower ? (r.glossZh ?? prev.glossZh) : (prev.glossZh ?? r.glossZh)) ?? null,
    })
  }
  return index
}

let loaded: Promise<LexIndex> | undefined

/** App 執行期用：載入一次後共用 */
export function loadLexIndex(): Promise<LexIndex> {
  if (!loaded) {
    loaded = fetch(lexiconUrl)
      .then((res) => {
        if (!res.ok) throw new Error(`單字總表載入失敗：${res.status}`)
        return res.json() as Promise<LexRow[]>
      })
      .then(buildLexIndex)
    loaded.catch(() => (loaded = undefined))
  }
  return loaded
}
