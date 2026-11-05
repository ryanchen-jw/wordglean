// 把英文學習內容切成「可點的字」與「其他文字」（標點、空白、數字）；給可點英文字元件用

export type Token =
  { kind: 'word'; text: string; sentenceStart: boolean } | { kind: 'other'; text: string }

// 字＝字母開頭，可含字中撇號（don't、she's）與連字號（well-known）
const WORD = /[A-Za-z]+(?:['’-][A-Za-z]+)*/g

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
