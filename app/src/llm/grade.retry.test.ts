// @vitest-environment node
// 同一次批改內自動換一批模型（創辦人 2026-11-05 裁示：要能自動切換）
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { gradeWriting } from './grade'
import type { GradeTask } from './gradePrompt'

const state = vi.hoisted(() => ({ known: null as ReadonlySet<string> | null }))
vi.mock('./startup', () => ({ knownModels: () => state.known }))

const G31 = 'google/gemma-4-31b-it:free'
const G26 = 'google/gemma-4-26b-a4b-it:free'
const XING = 'xingchen-agi/xing4.0-29b-a4b:free'
const ROUTER = 'openrouter/free'

const TASK: GradeTask = {
  kind: 'translate',
  promptZh: '我非常喜歡音樂。',
  words: ['music'],
  referenceEn: ['I like music very much.'],
  rubricZh: [],
  level: 'A1',
  answer: 'I very like music.',
}
const LINK = { apiKey: 'sk-or-v1-test', model: G31 }
const GOOD = JSON.stringify({
  isCorrect: false,
  corrected: 'I like music very much.',
  errors: [],
  explanationZh: 'very 不能直接修飾動詞。',
})

const good = (model = 'a/b:free') =>
  Response.json({ model, choices: [{ message: { content: GOOD }, finish_reason: 'stop' }] })
const upstream429 = () =>
  new Response(
    '{"error":{"code":429,"message":"Provider returned error","metadata":{"limit_source":"upstream_provider_shared_pool"}}}',
    { status: 429 },
  )
/** 實測：路由選到 nemotron-3.5-lightning，推理用光 4096、content 是 null、finish_reason=length */
const truncated = (model: string) =>
  Response.json({ model, choices: [{ message: { content: null }, finish_reason: 'length' }] })

const sequence = (...replies: (() => Response)[]) => {
  const fn = vi.fn<typeof fetch>(async () => {
    const next = replies.shift()
    if (!next) throw new Error('多打了一次')
    return next()
  })
  return fn
}
const sentModels = (fn: ReturnType<typeof sequence>, call: number) =>
  JSON.parse(fn.mock.calls[call][1]!.body as string).models as string[]

beforeEach(() => {
  state.known = new Set([G31, G26, XING, ROUTER, 'a/b:free', 'c/d:free'])
})

describe('gradeWriting 換下一批', () => {
  it('第一批成功：只送一次', async () => {
    const fetchFn = sequence(() => good(G31))
    expect(await gradeWriting(LINK, TASK, fetchFn)).toMatchObject({ ok: true, model: G31 })
    expect(fetchFn).toHaveBeenCalledOnce()
  })

  it('整批被上游 429：換還沒試過的免費模型再送一次，成功就回結果', async () => {
    const fetchFn = sequence(upstream429, () => good('a/b:free'))
    expect(await gradeWriting(LINK, TASK, fetchFn)).toMatchObject({ ok: true, model: 'a/b:free' })
    expect(fetchFn).toHaveBeenCalledTimes(2)
    expect(sentModels(fetchFn, 0)).toEqual([G31, XING, ROUTER])
    expect(sentModels(fetchFn, 1)).toEqual([G26, 'a/b:free', ROUTER])
  })

  it('實際服務的模型推理用光上限、沒有內容：下一批不再選它', async () => {
    const fetchFn = sequence(
      () => truncated('a/b:free'),
      () => good('c/d:free'),
    )
    expect(await gradeWriting(LINK, TASK, fetchFn)).toMatchObject({ ok: true, model: 'c/d:free' })
    expect(sentModels(fetchFn, 1)).toEqual([G26, 'c/d:free', ROUTER])
  })

  it('最多 2 批：第二批也失敗就回 other，不再送', async () => {
    const fetchFn = sequence(upstream429, upstream429)
    expect(await gradeWriting(LINK, TASK, fetchFn)).toEqual({ ok: false, reason: 'other' })
    expect(fetchFn).toHaveBeenCalledTimes(2)
  })

  it('沒有清單：第二批只送免費路由（它自己會選還在的模型）', async () => {
    state.known = null
    const fetchFn = sequence(upstream429, () => good('a/b:free'))
    expect(await gradeWriting(LINK, TASK, fetchFn)).toMatchObject({ ok: true })
    expect(sentModels(fetchFn, 1)).toEqual([ROUTER])
  })

  it('額度用完不重送', async () => {
    const fetchFn = sequence(
      () =>
        new Response(
          '{"error":{"code":429,"message":"Rate limit exceeded: free-models-per-day"}}',
          { status: 429 },
        ),
    )
    expect(await gradeWriting(LINK, TASK, fetchFn)).toEqual({ ok: false, reason: 'quota' })
    expect(fetchFn).toHaveBeenCalledOnce()
  })

  it('金鑰失效不重送', async () => {
    const fetchFn = sequence(() => new Response('{"error":{"code":401}}', { status: 401 }))
    expect(await gradeWriting(LINK, TASK, fetchFn)).toEqual({ ok: false, reason: 'keyInvalid' })
    expect(fetchFn).toHaveBeenCalledOnce()
  })

  it('斷網不重送', async () => {
    const fetchFn = vi.fn<typeof fetch>(async () => {
      throw new TypeError('Failed to fetch')
    })
    expect(await gradeWriting(LINK, TASK, fetchFn)).toEqual({ ok: false, reason: 'network' })
    expect(fetchFn).toHaveBeenCalledOnce()
  })

  it('第一批回來時呼叫端已離開題目：不送第二批', async () => {
    const leave = new AbortController()
    const fetchFn = vi.fn<typeof fetch>(async () => {
      leave.abort()
      return upstream429()
    })
    await gradeWriting(LINK, TASK, fetchFn, { signal: leave.signal })
    expect(fetchFn).toHaveBeenCalledOnce()
  })

  it('兩批共用同一個時間上限：第二批卡住也在上限內轉失敗，並中止請求', async () => {
    const second = vi.fn<typeof fetch>(
      (_url, init) =>
        new Promise<Response>((_, reject) =>
          init?.signal?.addEventListener('abort', () =>
            reject(new DOMException('aborted', 'AbortError')),
          ),
        ),
    )
    let calls = 0
    const fetchFn = vi.fn<typeof fetch>(async (url, init) =>
      ++calls === 1 ? upstream429() : second(url, init),
    )
    expect(await gradeWriting(LINK, TASK, fetchFn, { timeoutMs: 20 })).toEqual({
      ok: false,
      reason: 'other',
    })
    expect(second).toHaveBeenCalledOnce()
    expect(second.mock.calls[0][1]!.signal!.aborted).toBe(true)
  })
})
