// 聽音打字判題（TASK-13 D1，以設計 v1.0 s03 為準）：寬鬆大小寫、標點與彎引號、縮寫、數字；拼錯一律算錯
// 不用 LibreLingo「距離 ≤1 算對」（corrector.ts）：設計 s03 把 move → moved 畫成答錯
import { align, distance } from './levenshtein'

export interface TypedWord {
  text: string
  wrong: boolean
}

/** 改正：from＝使用者打的字（null＝漏打），to＝正確的字（null＝多打）；皆去掉前後標點 */
export interface Fix {
  from: string | null
  to: string | null
}

export interface TypedCheck {
  correct: boolean
  typed: TypedWord[]
  fixes: Fix[]
}

/** 正規化後的一個字，記著它來自原句第幾個字（縮寫、數字展開後多個字對回同一個原字） */
interface Word {
  w: string
  src: number
}

// 每個原字的寫法候選：先列原樣，再列展開；整句候選數超過上限就只取第一種，避免組合爆量
const MAX_VARIANTS = 64

const ONES =
  'zero one two three four five six seven eight nine ten eleven twelve thirteen fourteen fifteen sixteen seventeen eighteen nineteen'.split(
    ' ',
  )
const TENS = ' ten twenty thirty forty fifty sixty seventy eighty ninety'.split(' ')
const ORDINALS: Record<string, string> = {
  one: 'first',
  two: 'second',
  three: 'third',
  five: 'fifth',
  eight: 'eighth',
  nine: 'ninth',
  twelve: 'twelfth',
}

function under100(n: number): string[] {
  if (n < 20) return [ONES[n]]
  return n % 10 ? [TENS[Math.floor(n / 10)], ONES[n % 10]] : [TENS[n / 10]]
}

function under1000(n: number): string[] {
  const h = Math.floor(n / 100)
  const rest = n % 100
  if (!h) return under100(n)
  return [ONES[h], 'hundred', ...(rest ? under100(rest) : [])]
}

/** 基數 0–999,999；超出範圍回 null（照原樣比） */
function cardinal(n: number): string[] | null {
  if (n >= 1_000_000) return null
  if (n < 1000) return under1000(n)
  const k = Math.floor(n / 1000)
  const rest = n % 1000
  return [...under1000(k), 'thousand', ...(rest ? under1000(rest) : [])]
}

function ordinal(n: number): string[] | null {
  const words = cardinal(n)
  if (!words) return null
  const last = words[words.length - 1]
  const ord = ORDINALS[last] ?? (last.endsWith('y') ? `${last.slice(0, -1)}ieth` : `${last}th`)
  return [...words.slice(0, -1), ord]
}

/** 1100–1999 的年份讀法：1990＝nineteen ninety、1900＝nineteen hundred、1905＝nineteen oh five */
function yearReading(n: number): string[] | null {
  if (n < 1100 || n > 1999) return null
  const lo = n % 100
  const hi = under100(Math.floor(n / 100))
  if (!lo) return [...hi, 'hundred']
  return [...hi, ...(lo < 10 ? ['oh', ONES[lo]] : under100(lo))]
}

const NEGATIVE_IRREGULAR: Record<string, string[]> = {
  "can't": ['can', 'not'],
  "won't": ['will', 'not'],
  "shan't": ['shall', 'not'],
  cannot: ['can', 'not'],
}
const SUFFIXES: [string, string[]][] = [
  ["'re", ['are']],
  ["'ve", ['have']],
  ["'ll", ['will']],
  ["'m", ['am']],
  ["'d", ['would', 'had']],
  ["'s", ['is', 'has']],
]

function contraction(p: string): string[][] {
  if (NEGATIVE_IRREGULAR[p]) return [[p], NEGATIVE_IRREGULAR[p]]
  if (p === "let's") return [[p], ['let', 'us']]
  if (p.endsWith("n't") && p.length > 3) return [[p], [p.slice(0, -3), 'not']]
  for (const [suf, exps] of SUFFIXES)
    if (p.endsWith(suf) && p.length > suf.length) {
      const base = p.slice(0, -suf.length)
      return [[p], ...exps.map((e) => [base, e])]
    }
  return [[p]]
}

/** 一個子字（已拆掉連字號與時間冒號）的寫法候選 */
function partVariants(raw: string): string[][] {
  const dollars = /\$\d/.test(raw)
  const percent = /\d%/.test(raw)
  const p = raw.replace(/[^a-z0-9']/g, '').replace(/^'+|'+$/g, '')
  if (!p) return [[]]
  const unit = [...(dollars ? ['dollars'] : []), ...(percent ? ['percent'] : [])]
  if (/^\d+$/.test(p)) {
    const n = Number(p)
    const words = cardinal(n)
    if (!words) return [[p, ...unit]]
    const year = yearReading(n)
    return [[...words, ...unit], ...(year ? [[...year, ...unit]] : [])]
  }
  const ord = /^(\d+)(st|nd|rd|th)$/.exec(p)
  if (ord) {
    const words = ordinal(Number(ord[1]))
    return [words ?? [p]]
  }
  return contraction(p)
}

/** 原字 → 寫法候選（每個候選是一串正規化後的字） */
function tokenVariants(token: string): string[][] {
  const t = token
    .toLowerCase()
    .replace(/[’‘ʼ]/g, "'")
    .replace(/(\d),(?=\d{3})/g, '$1')
    .replace(/(\d):(\d)/g, '$1 $2')
    .replace(/[-–—/]/g, ' ')
  let out: string[][] = [[]]
  for (const part of t.split(/\s+/).filter(Boolean)) {
    const vs = partVariants(part)
    out = out.flatMap((prefix) => vs.map((v) => [...prefix, ...v]))
  }
  return out
}

const splitWords = (s: string) => s.split(/\s+/).filter(Boolean)

function sentenceVariants(tokens: string[]): Word[][] {
  let out: Word[][] = [[]]
  tokens.forEach((token, src) => {
    const vs = tokenVariants(token).map((v) => v.map((w) => ({ w, src })))
    out =
      out.length * vs.length > MAX_VARIANTS
        ? out.map((prefix) => [...prefix, ...vs[0]])
        : out.flatMap((prefix) => vs.map((v) => [...prefix, ...v]))
  })
  return out
}

/** 改正清單顯示用：去掉前後標點，保留大小寫與字內撇號 */
const bare = (token: string) => token.replace(/^[^\p{L}\p{N}$]+|[^\p{L}\p{N}%]+$/gu, '')

export function checkTyped(input: string, expected: string): TypedCheck {
  // NFKC：全形英數、標點與全形空白（中文輸入法常見）先轉半形；標點後緊接著字（中文輸入法的「，」「。」常不留空白）也斷開，
  // 數字間的千分位逗點與時間冒號不斷
  const words = (s: string) =>
    splitWords(s.normalize('NFKC').replace(/([,;:!?。、])(?=[^\s\d])/g, '$1 '))
  const inTokens = words(input)
  const exTokens = words(expected)
  const ins = sentenceVariants(inTokens)
  const exs = sentenceVariants(exTokens)

  // 字數差最小的一組候選；同分取先列的（原樣優先）
  let best: { a: Word[]; b: Word[]; d: number } | null = null
  for (const a of ins) {
    if (best?.d === 0) break
    for (const b of exs) {
      const d = distance(
        a.map((x) => x.w),
        b.map((x) => x.w),
      )
      if (!best || d < best.d) best = { a, b, d }
      if (d === 0) break
    }
  }
  const { a, b, d } = best!

  const wrong = new Set<number>()
  const groups: { from: Set<number>; to: Set<number> }[] = []
  let open: { from: Set<number>; to: Set<number> } | null = null
  for (const op of align(
    a.map((x) => x.w),
    b.map((x) => x.w),
  )) {
    if (op.kind === 'equal') {
      open = null
      continue
    }
    const from = op.kind === 'ins' ? null : a[op.a].src
    const to = op.kind === 'del' ? null : b[op.b].src
    if (from !== null) wrong.add(from)
    // 同一個原字展開出的多個字（如 don't → do not）合成一筆改正
    const shares =
      open && ((from !== null && open.from.has(from)) || (to !== null && open.to.has(to)))
    if (!shares) {
      open = { from: new Set(), to: new Set() }
      groups.push(open)
    }
    if (from !== null) open!.from.add(from)
    if (to !== null) open!.to.add(to)
  }

  const join = (idx: Set<number>, tokens: string[]) =>
    idx.size
      ? [...idx]
          .sort((x, y) => x - y)
          .map((i) => bare(tokens[i]))
          .join(' ')
      : null

  return {
    correct: inTokens.length > 0 && d === 0,
    typed: inTokens.map((text, i) => ({ text, wrong: wrong.has(i) })),
    fixes: groups.map((g) => ({ from: join(g.from, inTokens), to: join(g.to, exTokens) })),
  }
}
