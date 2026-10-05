// @vitest-environment node
// 創辦人 2026-10-04 裁示 2：v2 評測 qwen 的解釋夾簡體字（ev-10「标记」、ev-15「结构」、ev-39「习惯」）
// 與大陸文法術語（ev-08「介詞」、ev-33「賓語」、ev-24「雙賓語」）；批改結果的解釋轉台灣繁體與台灣術語。
// 期望值為 opencc-js 1.4.2 cn→twp 實際輸出再換術語
import { afterEach, describe, expect, it, vi } from 'vitest'
import { localizeGrade, toTaiwanZh } from './zhTw'

const RI_ZHANG_IN_SIMPLIFIED = '這位里長'

describe('toTaiwanZh：簡體 → 台灣繁體（詞級）', () => {
  it.each([
    ['头发', '頭髮'],
    ['恢复', '恢復'],
    ['合并', '合併'],
    ['这个句子里', '這個句子裡'],
    [
      '复数、词汇、闹钟、签名、以后、什么、跟着、对于',
      '複數、詞彙、鬧鐘、簽名、以後、什麼、跟著、對於',
    ],
    // twp：當主語是第三人稱單數時 → 再換術語 主語→主詞
    ['当主语是第三人称单数时', '當主詞是第三人稱單數時'],
    ['这里的 to 是介词，不是不定式标记', '這裡的 to 是介系詞，不是不定詞標記'],
  ])('%s → %s', async (input, want) => {
    expect(await toTaiwanZh(input)).toBe(want)
  })
})

describe('toTaiwanZh：台灣用語（twp，不只是 tw 的字形）', () => {
  // tw 只換字形（視頻、軟件）；twp 另換台灣慣用詞
  it.each([
    ['视频', '影片'],
    ['软件', '軟體'],
  ])('%s → %s', async (input, want) => {
    expect(await toTaiwanZh(input)).toBe(want)
  })
})

describe('toTaiwanZh：含簡體時整句轉換，句中簡繁同形字照 opencc 詞典處理', () => {
  it('里长 在含簡體的句子裡', async () => {
    expect(await toTaiwanZh('这位里长')).toBe(RI_ZHANG_IN_SIMPLIFIED)
  })
})

describe('toTaiwanZh：大陸文法術語 → 台灣術語', () => {
  it.each([
    ['定语从句', '形容詞子句'],
    ['宾语从句', '受詞子句'],
    ['谓语动词', '述語動詞'],
    ['give 後面接雙賓語，介詞 to 引出間接賓語。', 'give 後面接雙受詞，介系詞 to 引出間接受詞。'],
  ])('%s → %s', async (input, want) => {
    expect(await toTaiwanZh(input)).toBe(want)
  })
})

describe('toTaiwanZh：原本正確的台灣繁體不被改', () => {
  it.each([
    '皇后、英里、干擾、方面、頭髮',
    '先了解句子結構：這裡的 for 是介系詞，後面接受詞。',
    'until 表示「延到某時為止」，比 to 自然。',
    // 簡繁同形字（里、余、于、丑、么）：純繁體輸入不做 cn→twp（執行長複驗：里長→裡長、余先生→餘先生）
    '里長',
    '鄰里',
    '丑時',
    '余先生',
    '于小姐',
    '么',
  ])('%s', async (tw) => {
    expect(await toTaiwanZh(tw)).toBe(tw)
  })
})

describe('字典 chunk 載入失敗（離線、部署換版後舊 chunk 不在）', () => {
  afterEach(() => {
    vi.doUnmock('opencc-js/preset/cn2t')
    vi.resetModules()
  })

  it('localizeGrade 與 gradeWriting 不 throw、解釋保留原文（術語仍換）；下次呼叫重新載入', async () => {
    vi.resetModules()
    let attempts = 0
    let chunkAvailable = false
    vi.doMock('opencc-js/preset/cn2t', async (importOriginal) => {
      attempts++
      if (!chunkAvailable) throw new Error('Failed to fetch dynamically imported module')
      return importOriginal()
    })
    const zhTw = await import('./zhTw')
    const result = {
      isCorrect: false,
      corrected: 'I look forward to meeting you.',
      errors: [{ original: 'to meet', corrected: 'to meeting', explanationZh: '这种结构' }],
      explanationZh: '介詞 to 后面接动名词',
      levelOk: true,
    }
    expect(await zhTw.localizeGrade(result)).toEqual({
      ...result,
      errors: [{ ...result.errors[0], explanationZh: '这种结构' }],
      explanationZh: '介系詞 to 后面接动名词',
    })

    const { gradeWriting } = await import('./grade')
    const reply = Response.json({
      model: 'qwen/qwen3.8-27b:free',
      choices: [{ message: { content: JSON.stringify(result) }, finish_reason: 'stop' }],
    })
    const graded = await gradeWriting(
      { apiKey: 'sk-or-v1-test', model: 'qwen/qwen3.8-27b:free' },
      {
        kind: 'translate',
        promptZh: 'x',
        words: [],
        referenceEn: ['I look forward to meeting you.'],
        rubricZh: [],
        level: 'B1',
        answer: 'I look forward to meet you.',
      },
      (async () => reply) as unknown as typeof fetch,
    )
    expect(graded).toMatchObject({ ok: true, result: { explanationZh: '介系詞 to 后面接动名词' } })

    // chunk 恢復可取得後，同一個模組實例下次呼叫會重新載入並轉換
    chunkAvailable = true
    expect(await zhTw.toTaiwanZh('这种结构')).toBe('這種結構')
    expect(attempts).toBeGreaterThan(1)
  })
})

describe('字典 chunk 一直載不完（網路很慢）：不卡住批改（創辦人試用 2026-10-05）', () => {
  afterEach(() => {
    vi.useRealTimers()
    vi.doUnmock('opencc-js/preset/cn2t')
    vi.resetModules()
  })

  it('最多等 5 秒，之後解釋保留原文（術語仍換）', async () => {
    vi.resetModules()
    vi.doMock('opencc-js/preset/cn2t', () => new Promise(() => {}))
    vi.useFakeTimers()
    const zhTw = await import('./zhTw')
    let out: string | null = null
    void zhTw.toTaiwanZh('介詞 to 后面接动名词').then((s) => (out = s))
    await vi.advanceTimersByTimeAsync(4_900)
    expect(out).toBeNull()
    await vi.advanceTimersByTimeAsync(100)
    expect(out).toBe('介系詞 to 后面接动名词')
  })
})

describe('localizeGrade', () => {
  it('整體說明與各錯誤點的解釋都轉；英文欄位、isCorrect、levelOk 不動', async () => {
    const r = await localizeGrade({
      isCorrect: false,
      corrected: 'I look forward to meeting you.',
      errors: [
        { original: 'to meet', corrected: 'to meeting', explanationZh: '这种结构是习惯用法' },
      ],
      explanationZh: '介词 to 后面接动名词',
      levelOk: true,
    })
    expect(r).toEqual({
      isCorrect: false,
      corrected: 'I look forward to meeting you.',
      errors: [
        { original: 'to meet', corrected: 'to meeting', explanationZh: '這種結構是習慣用法' },
      ],
      explanationZh: '介系詞 to 後面接動名詞',
      levelOk: true,
    })
  })
})
