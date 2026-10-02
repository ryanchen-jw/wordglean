import { describe, expect, it } from 'vitest'
import { parseGrade } from './parseGrade'

// 例句取自設計 s06（postpone 題）
const ANSWER = 'Can we postpone the meeting to next Monday?'
const GOOD = {
  isCorrect: false,
  corrected: 'Could we postpone the meeting until next Monday?',
  errors: [
    {
      original: 'to next Monday',
      corrected: 'until next Monday',
      explanationZh: 'until 表示「延到某時為止」，比 to 自然。',
    },
  ],
  explanationZh: 'until 表示「延到某時為止」，比 to 自然。Could 比 Can 更客氣，適合職場請求。',
  levelOk: true,
}
const EXPECTED = {
  isCorrect: false,
  corrected: 'Could we postpone the meeting until next Monday?',
  errors: [
    {
      original: 'to next Monday',
      corrected: 'until next Monday',
      explanationZh: 'until 表示「延到某時為止」，比 to 自然。',
    },
  ],
  explanationZh: 'until 表示「延到某時為止」，比 to 自然。Could 比 Can 更客氣，適合職場請求。',
  levelOk: true,
}

describe('parseGrade：正常輸出', () => {
  it('合法 JSON 原樣解析', () => {
    expect(parseGrade(JSON.stringify(GOOD), ANSWER)).toEqual(EXPECTED)
  })

  it('句子正確：errors 空、corrected 照抄', () => {
    expect(
      parseGrade(
        '{"isCorrect":true,"corrected":"I am not sure whether to go.","errors":[],"explanationZh":"whether to＋原形動詞用得正確。","levelOk":true}',
        'I am not sure whether to go.',
      ),
    ).toEqual({
      isCorrect: true,
      corrected: 'I am not sure whether to go.',
      errors: [],
      explanationZh: 'whether to＋原形動詞用得正確。',
      levelOk: true,
    })
  })
})

describe('parseGrade：五種畸形輸出（AC#2）', () => {
  it('① 包在 ```json 圍欄裡 → 救回', () => {
    expect(parseGrade('```json\n' + JSON.stringify(GOOD, null, 2) + '\n```', ANSWER)).toEqual(
      EXPECTED,
    )
  })

  it('② 前後夾雜說明文字（含字串裡的大括號）→ 救回第一個完整物件', () => {
    const withBrace = { ...GOOD, explanationZh: '把 {to} 換成 until。' }
    expect(
      parseGrade(
        `Sure! Here is the grading result:\n${JSON.stringify(withBrace)}\nHope this helps {smile}.`,
        ANSWER,
      ),
    ).toEqual({ ...EXPECTED, explanationZh: '把 {to} 換成 until。' })
  })

  it('②-2 物件被包在陣列裡 → 取第一個物件', () => {
    expect(parseGrade(`[${JSON.stringify(GOOD)}]`, ANSWER)).toEqual(EXPECTED)
  })

  it('③ 尾逗號 → 救回', () => {
    const text =
      '{"isCorrect": false, "corrected": "Could we postpone the meeting until next Monday?", "errors": [{"original": "to next Monday", "corrected": "until next Monday", "explanationZh": "until 表示「延到某時為止」，比 to 自然。",},], "explanationZh": "until 表示「延到某時為止」，比 to 自然。Could 比 Can 更客氣，適合職場請求。", "levelOk": true,}'
    expect(parseGrade(text, ANSWER)).toEqual(EXPECTED)
  })

  it('③-2 去尾逗號不得改到字串內容（字串裡的「, ]」「, }」原樣保留）', () => {
    const text =
      '{"isCorrect": false, "corrected": "Pick one of {a, } or [b, ].", "errors": [], "explanationZh": "寫成 [b, ] 或 {a, } 都不對。", "levelOk": true,}'
    expect(parseGrade(text, 'x')).toEqual({
      isCorrect: false,
      corrected: 'Pick one of {a, } or [b, ].',
      errors: [],
      explanationZh: '寫成 [b, ] 或 {a, } 都不對。',
      levelOk: true,
    })
  })

  it('④ 欄位型別錯或缺：布林寫成字串、缺 errors、缺總說明 → 補齊', () => {
    expect(
      parseGrade('{"isCorrect":"true","levelOk":"false"}', 'She is not sure whether to call.'),
    ).toEqual({
      isCorrect: true,
      corrected: 'She is not sure whether to call.',
      errors: [],
      explanationZh: '',
      levelOk: false,
    })
    // 缺總說明 → 用逐處說明；說對卻列了錯誤 → 以錯誤為準判錯；levelOk 不是布林 → null
    expect(
      parseGrade(
        '{"isCorrect":true,"corrected":"Could we postpone the meeting until next Monday?","errors":[{"original":"to next Monday","corrected":"until next Monday","explanationZh":"until 表示「延到某時為止」，比 to 自然。"}, null, 3],"levelOk":"maybe"}',
        ANSWER,
      ),
    ).toEqual({
      isCorrect: false,
      corrected: 'Could we postpone the meeting until next Monday?',
      errors: EXPECTED.errors,
      explanationZh: 'until 表示「延到某時為止」，比 to 自然。',
      levelOk: null,
    })
  })

  it('⑤ 被截斷（輸出上限用完）→ null', () => {
    const full = JSON.stringify(GOOD)
    expect(parseGrade(full.slice(0, full.length - 30), ANSWER)).toBeNull()
  })

  it.each([
    ['空字串', ''],
    ['只有空白', '  \n '],
    ['純文字', 'Your sentence is mostly correct, but use "until".'],
    ['壞掉的 JSON', '{isCorrect: no, corrected: ???}'],
    ['沒有 isCorrect', '{"corrected":"x","explanationZh":"y"}'],
    ['判錯但沒有修正也沒有說明', '{"isCorrect":false}'],
  ])('救不回：%s → null', (_, text) => {
    expect(parseGrade(text, ANSWER)).toBeNull()
  })
})
