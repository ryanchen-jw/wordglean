// 字典彈層的顯示格式：ECDICT 音標轉 IPA 符號、釋義行拆詞性

/**
 * ECDICT 音標以 ' , : 標重音與長音，轉成 IPA 的 ˈ ˌ ː 並加斜線；空字串回 null。
 * ECDICT 部分詞條的 schwa 是西里爾字母 ә（U+04D9），改成 IPA 的 ə（U+0259）
 */
export function formatPhonetic(raw: string): string | null {
  if (!raw.trim()) return null
  const ipa = raw.trim().replace(/'/g, 'ˈ').replace(/,/g, 'ˌ').replace(/:/g, 'ː')
  return `/${ipa.replace(/ә/g, 'ə')}/`
}

export interface GlossLine {
  pos: string | null
  text: string
}

const POS = /^([a-z]+\.)\s*(.+)$/

/** 「n. 會議, 會面」→ { pos: 'n.', text: '會議, 會面' }；「[法] 會議」「go的過去式」無詞性 */
export function parseGloss(lines: readonly string[]): GlossLine[] {
  return lines.map((line) => {
    const m = POS.exec(line)
    return m ? { pos: m[1], text: m[2] } : { pos: null, text: line }
  })
}

/** 全部有詞性的行都是同一詞性時，詞性放音標旁、各行不重複標 */
export function sharedPos(lines: readonly GlossLine[]): string | null {
  const set = new Set(lines.map((l) => l.pos).filter((p) => p !== null))
  return set.size === 1 ? [...set][0] : null
}

/** 單字庫列表用的短釋義：去詞性與領域標記、取第一個義項（「vt. 延遲, 使延期⋯」→「延遲」） */
export function shortGloss(line: string): string {
  const { text } = parseGloss([line])[0]
  return text
    .replace(/^\[[^\]]+\]\s*/, '')
    .split(/[,，;；]/)[0]
    .replace(/⋯$/, '')
    .trim()
}
