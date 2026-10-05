// @vitest-environment node
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { gradeWriting } from './grade'
import { GRADE_PROMPT_VERSION, gradeMessages, type GradeTask } from './gradePrompt'

// 題目取自樣本課 b1-u01-l01 q17
const TASK: GradeTask = {
  kind: 'translate',
  promptZh: '儘管很累，她還是完成了工作。',
  words: ['despite'],
  referenceEn: [
    'Despite being tired, she finished the work.',
    'Despite feeling tired, she finished her work.',
  ],
  rubricZh: ['despite 後面接名詞或動名詞，不接完整子句', '主要子句時態用過去式'],
  level: 'B1',
  answer: 'Despite she was tired, she finished the work.',
}
const LINK = { apiKey: 'sk-or-v1-test', model: 'qwen/qwen3.8-27b:free' }

const reply = (content: string) =>
  Response.json({
    model: 'qwen/qwen3.8-27b:free',
    choices: [{ message: { content }, finish_reason: 'stop' }],
  })

describe('gradeMessages', () => {
  it(`${GRADE_PROMPT_VERSION}：system 要求只回 JSON 與台灣繁中；user 帶題目、提示字、級距、參考答案、要點、學習者句子`, () => {
    const [system, user] = gradeMessages(TASK)
    expect(system.role).toBe('system')
    for (const k of ['"isCorrect"', '"corrected"', '"errors"', '"explanationZh"', '"levelOk"'])
      expect(system.content).toContain(k)
    expect(system.content).toContain('Traditional Chinese with Taiwan vocabulary')
    expect(user.content).toBe(
      [
        'Task type: Translate the Chinese into English',
        'Chinese sentence: 儘管很累，她還是完成了工作。',
        'Hint words: despite',
        'Target CEFR level: B1',
        'Reference answers: "Despite being tired, she finished the work." / "Despite feeling tired, she finished her work."',
        'Grading points (Chinese): despite 後面接名詞或動名詞，不接完整子句；主要子句時態用過去式',
        'Learner\'s sentence: """Despite she was tired, she finished the work."""',
      ].join('\n'),
    )
  })

  // 創辦人 2026-10-04 裁示 2：v2 評測 qwen 有簡體字、大陸文法術語（介詞、賓語）、整段英文解釋（llm-eval.md §7）
  it('v3：明令台灣文法術語（點名不得用的大陸術語）、一律用中文解釋', () => {
    expect(GRADE_PROMPT_VERSION).toBe('grade-writing.v3')
    const system = gradeMessages(TASK)[0].content
    expect(system).toContain('介系詞 (never 介詞)')
    expect(system).toContain('受詞 (never 賓語)')
    expect(system).toContain('不定詞 (never 不定式)')
    expect(system).toContain('never Simplified Chinese characters')
    expect(system).toContain('Write every explanation in Chinese')
  })

  it('造句：說明與指定字的標籤不同；沒有提示字就不列', () => {
    const user = gradeMessages({ ...TASK, kind: 'makeSentence', words: [], level: null })[1].content
    expect(user).toContain('Task type: Write one English sentence as instructed')
    expect(user).toContain('Instruction (Chinese): ')
    expect(user).toContain('Target CEFR level: unknown')
    expect(user).not.toContain('Hint words')
    expect(user).not.toContain('Must use the word')
  })
})

describe('gradeWriting', () => {
  it('成功：選的模型在前、預設補後，回傳解析結果與實際服務的模型', async () => {
    const fetchFn = vi.fn<(url: string, init?: RequestInit) => Promise<Response>>(async () =>
      reply(
        '{"isCorrect":false,"corrected":"Despite being tired, she finished the work.","errors":[{"original":"Despite she was tired","corrected":"Despite being tired","explanationZh":"despite 後面要接名詞或動名詞。"}],"explanationZh":"despite 是介系詞，後面不能接完整子句。","levelOk":true}',
      ),
    )
    const out = await gradeWriting(LINK, TASK, fetchFn as unknown as typeof fetch)
    expect(out).toEqual({
      ok: true,
      model: 'qwen/qwen3.8-27b:free',
      result: {
        isCorrect: false,
        corrected: 'Despite being tired, she finished the work.',
        errors: [
          {
            original: 'Despite she was tired',
            corrected: 'Despite being tired',
            explanationZh: 'despite 後面要接名詞或動名詞。',
          },
        ],
        explanationZh: 'despite 是介系詞，後面不能接完整子句。',
        levelOk: true,
      },
    })
    expect(JSON.parse(fetchFn.mock.calls[0][1]!.body as string).models).toEqual([
      'qwen/qwen3.8-27b:free',
      'apodex/apodex-1.1-mini:free',
    ])
  })

  it('回應解析不了 → other；HTTP 錯誤照分類；只呼叫一次（不自動重試）', async () => {
    const bad = vi.fn(async () => reply('I think it is fine.'))
    expect(await gradeWriting(LINK, TASK, bad)).toEqual({ ok: false, reason: 'other' })
    const quota = vi.fn(
      async () =>
        new Response(
          '{"error":{"code":429,"message":"Rate limit exceeded: free-models-per-day"}}',
          {
            status: 429,
          },
        ),
    )
    expect(await gradeWriting(LINK, TASK, quota)).toEqual({ ok: false, reason: 'quota' })
    expect(quota).toHaveBeenCalledOnce()
  })
})

// 創辦人試用 2026-10-05：送出後一直停在「批改中…」。免費模型帶推理可能很慢、fallback 也可能排隊，請求要有上限
describe('gradeWriting 逾時與取消', () => {
  beforeEach(() => vi.useFakeTimers())
  afterEach(() => vi.useRealTimers())

  /** 永遠不回應；中止時照 fetch 規格以 AbortError 拒絕 */
  const hanging = vi.fn(
    (_url: string, init?: RequestInit) =>
      new Promise<Response>((_, reject) =>
        init?.signal?.addEventListener('abort', () =>
          reject(new DOMException('aborted', 'AbortError')),
        ),
      ),
  )

  it('60 秒沒回應 → 失敗（other），並中止請求', async () => {
    let done: unknown = null
    void gradeWriting(LINK, TASK, hanging as unknown as typeof fetch).then((o) => (done = o))
    await vi.advanceTimersByTimeAsync(59_000)
    expect(done).toBeNull()
    await vi.advanceTimersByTimeAsync(1_000)
    expect(done).toEqual({ ok: false, reason: 'other' })
    expect(hanging.mock.calls.at(-1)![1]!.signal!.aborted).toBe(true)
  })

  it('連中止都不理的 fetch（或回應本文讀不完）也在 60 秒轉失敗', async () => {
    const deaf = vi.fn(() => new Promise<Response>(() => {}))
    let done: unknown = null
    void gradeWriting(LINK, TASK, deaf as unknown as typeof fetch).then((o) => (done = o))
    await vi.advanceTimersByTimeAsync(60_000)
    expect(done).toEqual({ ok: false, reason: 'other' })
  })

  it('呼叫端取消（離開題目）：中止請求', async () => {
    const leave = new AbortController()
    void gradeWriting(LINK, TASK, hanging as unknown as typeof fetch, { signal: leave.signal })
    await vi.advanceTimersByTimeAsync(0)
    const sent = hanging.mock.calls.at(-1)![1]!.signal!
    expect(sent.aborted).toBe(false)
    leave.abort()
    expect(sent.aborted).toBe(true)
  })
})
