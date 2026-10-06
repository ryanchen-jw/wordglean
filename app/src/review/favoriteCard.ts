// 收藏字（沒有課程來源）的複習卡：中文取單字總表（TASK-16 lexicon）、去掉詞性；
// 3 個干擾項取同級同詞性的字（不足再用同級其他詞性），依字雜湊挑選、每次相同。沒有例句（字典不含例句）
// 收藏片語（TASK-24）：中文取片語表（單字總表併入的片語），干擾項取同級其他片語
import type { LexIndex, LexInfo } from '../dict/lexicon'
import type { WordCardItem } from '../lesson/items'

// 單字總表中文的開頭詞性，例：「n. 河, 江」「vt. 延遲⋯」
const POS = /^((?:[a-z]+\.\s*)+)/

function split(glossZh: string): { pos: string; text: string } {
  const pos = POS.exec(glossZh)?.[1] ?? ''
  return { pos: pos.trim(), text: glossZh.slice(pos.length).trim() }
}

// FNV-1a 32 位元；只用來讓同一字的干擾項固定，不求亂度品質
function hash(s: string): number {
  let h = 0x811c9dc5
  for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 0x01000193)
  return h >>> 0
}

export function favoriteCard(wordId: string, lex: LexIndex): WordCardItem | null {
  const self = lex.get(wordId)
  if (!self?.glossZh) return null
  const { text } = split(self.glossZh)
  if (!text) return null
  // 片語（TASK-24）沒有詞性：同級其他片語當「同詞性」
  const posOf = (info: LexInfo, g: { pos: string }) => (info.phrase ? '#phrase' : g.pos)
  const pos = posOf(self, split(self.glossZh))

  const samePos: { key: string; text: string }[] = []
  const otherPos: { key: string; text: string }[] = []
  for (const [key, info] of lex) {
    if (key === wordId || info.cefr !== self.cefr || !info.glossZh) continue
    const g = split(info.glossZh)
    if (!g.text || g.text === text) continue
    ;(posOf(info, g) === pos ? samePos : otherPos).push({ key, text: g.text })
  }
  const byHash = (a: { key: string }, b: { key: string }) =>
    hash(`${wordId}|${a.key}`) - hash(`${wordId}|${b.key}`)
  const distractors: string[] = []
  for (const c of [...samePos.sort(byHash), ...otherPos.sort(byHash)]) {
    if (!distractors.includes(c.text)) distractors.push(c.text)
    if (distractors.length === 3) break
  }
  if (distractors.length < 3) return null

  return {
    id: `fav:${wordId}`,
    type: 'wordCard',
    word: wordId,
    exampleEn: '',
    exampleZh: '',
    glossZh: text,
    distractorsZh: distractors,
  }
}
