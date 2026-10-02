// 批改回應解析（AC#2）：模型常見的畸形輸出盡量救回，救不回就回 null（畫面轉「批改失敗」、保留參考答案）
// 能救：```json 圍欄、前後夾雜說明文字、尾逗號、布林寫成字串、缺 errors／corrected 欄
// 救不回：空回應、不是 JSON、被截斷（max_tokens 用完）、沒有任何可用的修正或說明

export interface GradeError {
  original: string
  corrected: string
  explanationZh: string
}

export interface GradeResult {
  isCorrect: boolean
  corrected: string
  errors: GradeError[]
  explanationZh: string
  /** 句子是否合乎目標級距；模型沒給為 null */
  levelOk: boolean | null
}

/** 取出第一個完整的 {…}（略過字串內的括號）；沒有完整物件回 null */
function firstObject(text: string): string | null {
  const start = text.indexOf('{')
  if (start < 0) return null
  let depth = 0
  let inString = false
  for (let i = start; i < text.length; i++) {
    const c = text[i]
    if (inString) {
      if (c === '\\') i++
      else if (c === '"') inString = false
    } else if (c === '"') inString = true
    else if (c === '{') depth++
    else if (c === '}' && --depth === 0) return text.slice(start, i + 1)
  }
  return null
}

/** 去掉字串外的尾逗號（{"a":1,} 或 [1,]）；字串內容原樣保留 */
function stripTrailingCommas(json: string): string {
  let out = ''
  let inString = false
  for (let i = 0; i < json.length; i++) {
    const c = json[i]
    if (inString) {
      out += c
      if (c === '\\') out += json[++i] ?? ''
      else if (c === '"') inString = false
    } else if (c === '"') {
      inString = true
      out += c
    } else if (c === ',' && /^\s*[}\]]/.test(json.slice(i + 1))) continue
    else out += c
  }
  return out
}

function parseLoose(json: string): unknown {
  try {
    return JSON.parse(json)
  } catch {
    try {
      return JSON.parse(stripTrailingCommas(json))
    } catch {
      return null
    }
  }
}

const str = (v: unknown) => (typeof v === 'string' ? v.trim() : '')

function bool(v: unknown): boolean | null {
  if (typeof v === 'boolean') return v
  if (v === 'true') return true
  if (v === 'false') return false
  return null
}

export function parseGrade(text: string, answer: string): GradeResult | null {
  const json = firstObject(text)
  if (!json) return null
  const raw = parseLoose(json)
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return null
  const o = raw as Record<string, unknown>

  const errors: GradeError[] = (Array.isArray(o.errors) ? o.errors : [])
    .map((e: unknown) => {
      const r = (e ?? {}) as Record<string, unknown>
      return {
        original: str(r.original),
        corrected: str(r.corrected),
        explanationZh: str(r.explanationZh),
      }
    })
    .filter((e) => e.original || e.corrected || e.explanationZh)

  // 模型自相矛盾（說對卻列出錯誤）以錯誤清單為準
  const claimed = bool(o.isCorrect)
  const isCorrect = errors.length > 0 ? false : claimed
  if (isCorrect === null) return null

  const corrected = str(o.corrected) || (isCorrect ? answer.trim() : '')
  const explanationZh =
    str(o.explanationZh) ||
    errors
      .map((e) => e.explanationZh)
      .filter(Boolean)
      .join('')
  // 判錯卻沒有修正句也沒有任何說明：對使用者沒有用處，當成失敗
  if (!isCorrect && !corrected && !explanationZh) return null

  return { isCorrect, corrected, errors, explanationZh, levelOk: bool(o.levelOk) }
}
