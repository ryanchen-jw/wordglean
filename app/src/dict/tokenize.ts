// 把英文學習內容切成「可點的字」與「其他文字」（標點、空白、數字）；給可點英文字元件用

export type Token =
  { kind: 'word'; text: string; sentenceStart: boolean } | { kind: 'other'; text: string }

// 字＝字母開頭，可含字中撇號（don't、she's）與連字號（well-known）
const WORD = /[A-Za-z]+(?:['’-][A-Za-z]+)*/g

const OPENING = /[([{“‘«]+$/

/**
 * 把字與字之間的「其他文字」切成三段：lead 緊貼前一個字、trail 緊貼後一個字、mid 其餘（照一般文字排）。
 * 沒有空白時（word,word、and/or、wait—now）：開標點歸後字，其餘歸前字；前或後沒有字就全歸另一邊。
 */
export function splitOther(text: string, hasPrev: boolean, hasNext: boolean) {
  const first = text.search(/\s/)
  if (first === -1) {
    if (!hasPrev && !hasNext) return { lead: '', mid: text, trail: '' }
    if (!hasPrev) return { lead: '', mid: '', trail: text }
    if (!hasNext) return { lead: text, mid: '', trail: '' }
    const open = text.match(OPENING)?.[0] ?? ''
    return { lead: text.slice(0, text.length - open.length), mid: '', trail: open }
  }
  const last = text.search(/\s\S*$/)
  const lead = hasPrev ? text.slice(0, first) : ''
  const trail = hasNext ? text.slice(last + 1) : ''
  return { lead, mid: text.slice(lead.length, text.length - trail.length), trail }
}

export function tokenize(text: string): Token[] {
  const out: Token[] = []
  let last = 0
  let sentenceStart = true
  for (const m of text.matchAll(WORD)) {
    if (m.index > last) {
      const other = text.slice(last, m.index)
      out.push({ kind: 'other', text: other })
      if (/[.!?]/.test(other)) sentenceStart = true
    }
    out.push({ kind: 'word', text: m[0], sentenceStart })
    sentenceStart = false
    last = m.index + m[0].length
  }
  if (last < text.length) out.push({ kind: 'other', text: text.slice(last) })
  return out
}
