// 點字查義：把畫面上的一個英文字還原成要顯示的詞條（docs/verification/2026-10-02-task16-dictionary-evidence/proposal.md）
// 順序：be 動詞小表 → 本身是單字總表的字 → 變化形表（ECDICT exchange）→ 字典本身的條目 → 去字尾規則
import { cefrRank, type LexIndex } from './lexicon'
import { BE_FORMS, ruleCandidates, stripClitic } from './lemmatize'
import type { Phrase } from './phrases'
import type { Shard, ShardStore } from './shards'

/** 命中來源：self＝顯示的就是這個字本身；table＝變化形表還原；rule＝規則還原 */
export type LookupVia = 'self' | 'table' | 'rule'

export interface DictEntry {
  phonetic: string
  /** 釋義，一行一個詞性（ECDICT 原格式，如「n. 會議, 會面」） */
  lines: string[]
}

export type LookupResult =
  | { found: true; query: string; headword: string; via: LookupVia; entry: DictEntry }
  | { found: false; query: string }

export interface LookupDeps {
  shards: ShardStore
  lex: LexIndex
  /** 片語表（TASK-24）：點字查片語、作答前隱藏片語 */
  phrases: readonly Phrase[]
}

/** 去掉前後標點（保留 students' 的所有格撇號） */
function trimPunct(token: string): string {
  const t = token.replace(/^[^A-Za-z]+/, '').replace(/[^A-Za-z'’]+$/, '')
  return /[sS]['’]$/.test(t) ? t : t.replace(/['’]+$/, '')
}

/** 字典釋義第一行寫著「原形的…」（如「have的過去式」「v. 做（do的第三人稱單數形式）」）＝只是變化形 */
const isInflectionNote = (gloss: string, lemmas: readonly string[]) => {
  const first = gloss.split('\n')[0]
  return lemmas.some((l) => first.includes(`${l}的`))
}

/** 多個原形時：單字總表裡的優先，再比級距、詞頻（leaves → leaf／leave） */
function pickLemma(lemmas: readonly string[], lex: LexIndex): string {
  const score = (w: string) => {
    const info = lex.get(w)
    return info ? [0, cefrRank(info.cefr), info.freqRank ?? Infinity] : [1, 0, 0]
  }
  return [...lemmas].sort((a, b) => {
    const [x, y] = [score(a), score(b)]
    return x[0] - y[0] || x[1] - y[1] || x[2] - y[2]
  })[0]
}

const toEntry = ([phonetic, gloss]: Shard['e'][string]): DictEntry => ({
  phonetic,
  lines: gloss.split('\n'),
})

/**
 * @param token 畫面上的一個字（可帶標點、縮寫）
 * @param sentenceStart 句首的大寫字先當小寫查；句中大寫開頭的字（人名、月份）先照原樣查
 */
export async function lookupWord(
  token: string,
  { sentenceStart = false }: { sentenceStart?: boolean },
  { shards, lex }: LookupDeps,
): Promise<LookupResult> {
  const base = stripClitic(trimPunct(token))
  if (!/[A-Za-z]/.test(base)) return { found: false, query: token }
  const lower = base.toLowerCase()
  const allCaps = base.length > 1 && base === base.toUpperCase()
  const cases = base === lower ? [lower] : sentenceStart && !allCaps ? [lower, base] : [base, lower]

  const shard = await shards.get(lower)
  // 句中大寫字（人名、專有名詞）字典沒有原樣時，只有小寫在單字總表內才退回小寫（March→三月；Jenny 不顯示紡紗機）
  if (!sentenceStart && base !== lower && !shard?.e[base] && !lex.has(lower))
    return { found: false, query: base }
  const lemmas = shard?.f[lower] ?? []
  const found = (headword: string, via: LookupVia, e: Shard['e'][string]): LookupResult => ({
    found: true,
    query: base,
    headword,
    via,
    entry: toEntry(e),
  })
  const entryOf = async (w: string) => (await shards.get(w))?.e[w]

  if (BE_FORMS.has(lower)) {
    const e = await entryOf('be')
    if (e) return found('be', 'rule', e)
  }
  for (const c of cases) {
    const e = shard?.e[c]
    if (e && lex.has(lower) && !isInflectionNote(e[1], lemmas)) return found(c, 'self', e)
  }
  if (lemmas.length > 0) {
    const lemma = pickLemma(lemmas, lex)
    const e = await entryOf(lemma)
    if (e) return found(lemma, 'table', e)
  }
  for (const c of cases) {
    const e = shard?.e[c]
    if (e) return found(c, 'self', e)
  }
  const hits: string[] = []
  for (const c of ruleCandidates(lower)) if (await entryOf(c)) hits.push(c)
  if (hits.length > 0) {
    const lemma = pickLemma(hits, lex)
    return found(lemma, 'rule', (await entryOf(lemma))!)
  }
  return { found: false, query: base }
}

/**
 * 一個字所有可能的原形（小寫）：字本身、縮寫去尾、變化形表的原形、be 動詞小表、查字顯示的詞條。
 * 給可點英文字的 disabled 比對用（G2：測驗字的變化形作答前也不可點）；寧可多擋，不漏擋
 */
export async function baseForms(token: string, deps: LookupDeps): Promise<Set<string>> {
  const lower = stripClitic(trimPunct(token)).toLowerCase()
  const out = new Set([lower])
  if (BE_FORMS.has(lower)) out.add('be')
  for (const l of (await deps.shards.get(lower))?.f[lower] ?? []) out.add(l)
  const r = await lookupWord(token, {}, deps)
  if (r.found) out.add(r.headword.toLowerCase())
  return out
}
