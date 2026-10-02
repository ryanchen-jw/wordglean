// 詞形還原的規則部分：縮寫與所有格去尾、be 動詞小表、去字尾候選
// 先查 ECDICT exchange 衍生的變化形表（lookup.ts），查不到才用這裡；lemma.en.txt 因條款限研究／教育用途不使用

const NEGATIVE_IRREGULAR: Record<string, string> = {
  "can't": 'can',
  "won't": 'will',
  "shan't": 'shall',
  "ain't": 'be',
}

/** 縮寫與所有格去尾：don't→do、she's→she、students'→students；彎引號一律視為 ' */
export function stripClitic(word: string): string {
  const w = word.replace(/[‘’]/g, "'")
  const irregular = NEGATIVE_IRREGULAR[w.toLowerCase()]
  if (irregular) return irregular
  if (/n't$/i.test(w) && w.length > 3) return w.slice(0, -3)
  const m = /^(.+)'(s|re|ve|ll|d|m)$/i.exec(w)
  if (m) return m[1]
  if (/s'$/i.test(w)) return w.slice(0, -1)
  return w
}

/** 變化形表漏列的 be 動詞形（ECDICT exchange 沒有 am／are／were） */
export const BE_FORMS: ReadonlySet<string> = new Set(['am', 'are', 'were'])

/** 去字尾的候選原形（依序；呼叫端只接受字典裡存在的候選） */
export function ruleCandidates(lower: string): string[] {
  const out: string[] = []
  const add = (stem: string, ...tails: string[]) => {
    for (const t of tails) out.push(stem + t)
    // 雙寫子音：stopped→stop、bigger→big
    if (stem.length >= 3 && stem.at(-1) === stem.at(-2) && !/[aeiouls]/.test(stem.at(-1)!))
      out.push(stem.slice(0, -1))
  }
  const strip = (suffix: string) => lower.slice(0, -suffix.length)
  if (lower.endsWith('ies')) add(strip('ies'), 'y')
  if (lower.endsWith('es')) add(strip('es'), '')
  if (lower.endsWith('s') && !lower.endsWith('ss')) add(strip('s'), '')
  if (lower.endsWith('ied')) add(strip('ied'), 'y')
  if (lower.endsWith('ed')) add(strip('ed'), '', 'e')
  if (lower.endsWith('ying')) add(strip('ying'), 'ie')
  if (lower.endsWith('ing')) add(strip('ing'), '', 'e')
  if (lower.endsWith('iest')) add(strip('iest'), 'y')
  if (lower.endsWith('est')) add(strip('est'), '', 'e')
  if (lower.endsWith('ier')) add(strip('ier'), 'y')
  if (lower.endsWith('er')) add(strip('er'), '', 'e')
  return [...new Set(out)].filter((c) => c !== lower && c.length >= 2 && /[aeiouy]/.test(c))
}
