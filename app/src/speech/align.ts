// 跟讀逐字比對（規格 §6、設計 s04 result）：送出句對目標句，標出錯字、漏字、多的字並計分
// 字詞層級 Levenshtein 對齊；替換成本依兩字的字母差異（0–1），漏字與多字各 1，讓相近的字優先配對
// 正規化：大小寫、標點、縮寫（I'm／can't、Mr.／a.m.）、數字（10↔ten、3:30、$5、50%）；一個原字可展開成多個比對字

export type WordMark = 'ok' | 'wrong' | 'missing' | 'extra'

/** 畫面上依序顯示的一個字：送出句的原字，或漏字佔位（text 為 null） */
export interface ShownWord {
  text: string | null
  mark: WordMark
}

export interface Comparison {
  /** 送出句逐字（保留使用者原本的寫法），漏字處插入佔位 */
  shown: ShownWord[]
  /** 目標句逐字的結果（與目標句原字一一對應） */
  target: { text: string; mark: Exclude<WordMark, 'extra'> }[]
  /** 目標字裡唸錯的數目（被換成別的字，或縮寫／數字只對一部分） */
  wrong: number
  /** 目標字裡整個沒唸到的數目 */
  missing: number
  /** 送出句裡多出來、對不到目標字的數目 */
  extra: number
  /** 得分＝唸對的目標字數／目標字數 */
  correct: number
  total: number
  /** 全對：沒有錯字、漏字、多字 */
  perfect: boolean
}

const CONTRACTIONS: Record<string, string> = {
  "i'm": 'i am',
  "can't": 'can not',
  cannot: 'can not',
  "won't": 'will not',
  "shan't": 'shall not',
  "let's": 'let us',
}
const N_T = /^(do|does|did|is|are|was|were|have|has|had|would|could|should|must|need)n't$/
const PRONOUN_S = /^(he|she|it|that|what|there|here|who|where|how)'s$/
const SUFFIX: Record<string, string> = { "'re": 'are', "'ll": 'will', "'ve": 'have', "'d": 'would' }
const ABBREV: Record<string, string> = {
  mr: 'mister',
  mrs: 'missus',
  ms: 'miz',
  dr: 'doctor',
  ok: 'okay',
}

const ONES = [
  'zero',
  'one',
  'two',
  'three',
  'four',
  'five',
  'six',
  'seven',
  'eight',
  'nine',
  'ten',
  'eleven',
  'twelve',
  'thirteen',
  'fourteen',
  'fifteen',
  'sixteen',
  'seventeen',
  'eighteen',
  'nineteen',
]
const TENS = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety']
const ORDINAL: Record<string, string> = {
  one: 'first',
  two: 'second',
  three: 'third',
  five: 'fifth',
  eight: 'eighth',
  nine: 'ninth',
  twelve: 'twelfth',
}

/** 0–9999 的英文唸法；超出範圍保留數字 */
function numberWords(n: number): string[] {
  if (n < 20) return [ONES[n]]
  if (n < 100) return n % 10 ? [TENS[Math.floor(n / 10)], ONES[n % 10]] : [TENS[n / 10]]
  if (n < 1000) {
    const rest = n % 100
    return [ONES[Math.floor(n / 100)], 'hundred', ...(rest ? numberWords(rest) : [])]
  }
  if (n < 10000) {
    const rest = n % 1000
    return [ONES[Math.floor(n / 1000)], 'thousand', ...(rest ? numberWords(rest) : [])]
  }
  return [String(n)]
}

function ordinalWords(n: number): string[] {
  const ws = numberWords(n)
  const last = ws[ws.length - 1]
  const ord = ORDINAL[last] ?? (last.endsWith('y') ? `${last.slice(0, -1)}ieth` : `${last}th`)
  return [...ws.slice(0, -1), ord]
}

const digitWords = (s: string) => [...s].map((d) => ONES[Number(d)])

/** 一個原字（已小寫、去頭尾標點）→ 比對用的字 */
function expandWord(w: string): string[] {
  if (CONTRACTIONS[w]) return CONTRACTIONS[w].split(' ')
  let m = N_T.exec(w)
  if (m) return [m[1], 'not']
  m = PRONOUN_S.exec(w)
  if (m) return [m[1], 'is']
  const suffix = /^([a-z]+)('re|'ll|'ve|'d)$/.exec(w)
  if (suffix) return [suffix[1], SUFFIX[suffix[2]]]

  m = /^\$(\d+)$/.exec(w)
  if (m) return [...numberWords(Number(m[1])), m[1] === '1' ? 'dollar' : 'dollars']
  m = /^(\d+)%$/.exec(w)
  if (m) return [...numberWords(Number(m[1])), 'percent']
  m = /^(\d{1,2}):(\d{2})$/.exec(w)
  if (m) {
    const min = Number(m[2])
    const tail = min === 0 ? ['oclock'] : min < 10 ? ['oh', ONES[min]] : numberWords(min)
    return [...numberWords(Number(m[1])), ...tail]
  }
  m = /^(\d+)\.(\d+)$/.exec(w)
  if (m) return [...numberWords(Number(m[1])), 'point', ...digitWords(m[2])]
  m = /^(\d+)(st|nd|rd|th)$/.exec(w)
  if (m) return ordinalWords(Number(m[1]))
  if (/^\d{1,3}(,\d{3})+$/.test(w) || /^\d+$/.test(w))
    return numberWords(Number(w.replace(/,/g, '')))

  // 縮寫的點與其餘撇號（所有格、o'clock）拿掉
  const bare = w.replace(/[.']/g, '')
  return [ABBREV[bare] ?? bare]
}

interface Word {
  text: string
  parts: string[]
}

// 結尾的點要留下的縮寫：a.m.、U.S.、Mr.
const DOTTED = /^(?:[a-z]\.){2,}$|^(?:mr|mrs|ms|dr)\.$/i

/** 去掉頭尾標點；數字前的 $、後面的 %、縮寫的點與字中撇號留著 */
function trimPunct(raw: string): string {
  const w = raw
    .replace(/^[^A-Za-z0-9$']+/, '')
    .replace(/[^A-Za-z0-9%.']+$/, '')
    .replace(/^'+|'+$/g, '')
  return DOTTED.test(w) ? w : w.replace(/\.+$/, '')
}

/** 句子 → 原字（以空白與字母間的連字號斷開）＋各自的比對字；純標點不成字 */
export function tokenize(sentence: string): Word[] {
  return sentence
    .replace(/[‘’]/g, "'")
    .split(/\s+|(?<=[a-z])-(?=[a-z])/i)
    .map(trimPunct)
    .filter((w) => /[A-Za-z0-9]/.test(w))
    .map((w) => ({ text: w, parts: expandWord(w.toLowerCase()) }))
}

/** 兩字的字母編輯距離÷較長字長（0＝相同，1＝完全不同） */
export function charDistance(a: string, b: string): number {
  if (a === b) return 0
  let prev = Array.from({ length: b.length + 1 }, (_, j) => j)
  for (let i = 1; i <= a.length; i++) {
    const cur = [i]
    for (let j = 1; j <= b.length; j++)
      cur[j] = Math.min(prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1), prev[j] + 1, cur[j - 1] + 1)
    prev = cur
  }
  return prev[b.length] / Math.max(a.length, b.length)
}

const GAP = 1

type Op =
  | { kind: 'pair'; t: number; s: number }
  | { kind: 'missing'; t: number }
  | { kind: 'extra'; s: number }

function align(target: string[], said: string[]): Op[] {
  const n = target.length
  const m = said.length
  const cost: number[][] = Array.from({ length: n + 1 }, (_, i) =>
    Array.from({ length: m + 1 }, (_, j) => (i === 0 ? j : j === 0 ? i : 0) * GAP),
  )
  for (let i = 1; i <= n; i++)
    for (let j = 1; j <= m; j++)
      cost[i][j] = Math.min(
        cost[i - 1][j - 1] + charDistance(target[i - 1], said[j - 1]),
        cost[i - 1][j] + GAP,
        cost[i][j - 1] + GAP,
      )
  // 回溯：同分時優先配對，其次漏字，最後多字
  const ops: Op[] = []
  let i = n
  let j = m
  const eq = (a: number, b: number) => Math.abs(a - b) < 1e-9
  while (i > 0 || j > 0) {
    if (
      i > 0 &&
      j > 0 &&
      eq(cost[i][j], cost[i - 1][j - 1] + charDistance(target[i - 1], said[j - 1]))
    ) {
      ops.push({ kind: 'pair', t: --i, s: --j })
    } else if (i > 0 && eq(cost[i][j], cost[i - 1][j] + GAP)) {
      ops.push({ kind: 'missing', t: --i })
    } else {
      ops.push({ kind: 'extra', s: --j })
    }
  }
  return ops.reverse()
}

/** 送出句與目標句逐字比對 */
export function compareWords(targetSentence: string, saidSentence: string): Comparison {
  const tWords = tokenize(targetSentence)
  const sWords = tokenize(saidSentence)
  // 比對字 → 所屬原字的索引
  const tOwner = tWords.flatMap((w, k) => w.parts.map(() => k))
  const sOwner = sWords.flatMap((w, k) => w.parts.map(() => k))
  const tParts = tWords.flatMap((w) => w.parts)
  const sParts = sWords.flatMap((w) => w.parts)
  const ops = align(tParts, sParts)
  const same = (op: Op) => op.kind === 'pair' && tParts[op.t] === sParts[op.s]

  // 目標字：每個比對字都配對且相同＝對；全部漏掉＝漏字；其餘＝錯字
  const tState = tWords.map(() => ({ ok: 0, missing: 0 }))
  for (const op of ops) {
    if (op.kind === 'missing') tState[tOwner[op.t]].missing++
    else if (op.kind === 'pair' && same(op)) tState[tOwner[op.t]].ok++
  }
  const target = tWords.map((w, k) => ({
    text: w.text,
    mark:
      tState[k].ok === w.parts.length
        ? ('ok' as const)
        : tState[k].missing === w.parts.length
          ? ('missing' as const)
          : ('wrong' as const),
  }))

  // 送出字：配到的目標字整個對、自己的比對字也都相同＝對；全部對不到＝多字；其餘＝錯字
  const sState = sWords.map(() => ({ ok: 0, extra: 0 }))
  for (const op of ops) {
    if (op.kind === 'extra') sState[sOwner[op.s]].extra++
    else if (op.kind === 'pair' && same(op) && target[tOwner[op.t]].mark === 'ok')
      sState[sOwner[op.s]].ok++
  }
  const sMark = sWords.map((w, k): WordMark =>
    sState[k].ok === w.parts.length ? 'ok' : sState[k].extra === w.parts.length ? 'extra' : 'wrong',
  )

  // 顯示順序：依對齊走，送出字在它第一個比對字的位置出現；整個漏掉的目標字插一個佔位
  const shown: ShownWord[] = []
  const seenS = new Set<number>()
  const seenT = new Set<number>()
  for (const op of ops) {
    if (op.kind === 'missing') {
      const k = tOwner[op.t]
      if (target[k].mark === 'missing' && !seenT.has(k)) {
        seenT.add(k)
        shown.push({ text: null, mark: 'missing' })
      }
    } else {
      const k = sOwner[op.s]
      if (!seenS.has(k)) {
        seenS.add(k)
        shown.push({ text: sWords[k].text, mark: sMark[k] })
      }
    }
  }

  const count = (mark: WordMark) => target.filter((w) => w.mark === mark).length
  const extra = sMark.filter((m) => m === 'extra').length
  const wrong = count('wrong')
  const missing = count('missing')
  const correct = count('ok')
  return {
    shown,
    target,
    wrong,
    missing,
    extra,
    correct,
    total: tWords.length,
    perfect: wrong === 0 && missing === 0 && extra === 0,
  }
}
