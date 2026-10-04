// @vitest-environment node
import { describe, expect, it, vi } from 'vitest'
import { classify, complete, fetchKeyInfo, listModels, OpenRouterError } from './client'

const KEY = 'sk-or-v1-test'
const kindOf = (p: Promise<unknown>) =>
  p.then(
    () => 'resolved',
    (e: unknown) => (e instanceof OpenRouterError ? e.kind : `bad:${String(e)}`),
  )

describe('錯誤分類（官方錯誤碼表）', () => {
  it.each([
    [401, '', null, 'keyInvalid'],
    [403, '', null, 'keyInvalid'],
    [402, 'insufficient credits', null, 'quota'],
    [429, 'Rate limit exceeded: free-models-per-day. Add 10 credits…', null, 'quota'],
    [429, 'rate limited', '0', 'quota'],
    [429, 'google/gemma is temporarily rate-limited upstream', '12', 'other'],
    [502, '', null, 'other'],
    [503, '', null, 'other'],
  ] as const)('%i %s（剩餘 %s）→ %s', (status, msg, remaining, kind) => {
    expect(classify(status, msg, remaining)).toBe(kind)
  })
})

describe('fetchKeyInfo', () => {
  it('GET https://openrouter.ai/api/v1/key 帶 Bearer 金鑰，讀 free_model_daily_requests.remaining', async () => {
    const fetchFn = vi.fn(async () =>
      Response.json({
        data: { free_model_daily_requests: { used: 13, limit: 50, remaining: 37 } },
      }),
    )
    expect(await fetchKeyInfo(KEY, fetchFn)).toEqual({ freeRemaining: 37 })
    expect(fetchFn).toHaveBeenCalledWith('https://openrouter.ai/api/v1/key', {
      headers: { Authorization: 'Bearer sk-or-v1-test' },
    })
  })

  it('沒有額度欄位 → null；401 → keyInvalid', async () => {
    expect(await fetchKeyInfo(KEY, async () => Response.json({ data: {} }))).toEqual({
      freeRemaining: null,
    })
    expect(await kindOf(fetchKeyInfo(KEY, async () => new Response('{}', { status: 401 })))).toBe(
      'keyInvalid',
    )
  })
})

describe('listModels', () => {
  const text = { input_modalities: ['text'], output_modalities: ['text'] }
  const raw = {
    data: [
      {
        id: 'z/paid',
        name: 'Zeta',
        pricing: { prompt: '0.0000005', completion: '0.0000015' },
        architecture: text,
      },
      {
        id: 'a/free:free',
        name: 'Alpha (free)',
        pricing: { prompt: '0', completion: '0' },
        architecture: text,
      },
      {
        id: 'img/gen',
        name: 'Image',
        pricing: { prompt: '0', completion: '0' },
        architecture: { input_modalities: ['text'], output_modalities: ['image'] },
      },
      {
        id: 'openrouter/auto',
        name: 'Auto',
        pricing: { prompt: '-1', completion: '-1' },
        architecture: text,
      },
      {
        id: 'b/paid',
        name: 'Beta',
        pricing: { prompt: '0.000003', completion: '0.000015' },
        architecture: text,
      },
    ],
  }

  it('公開 API 不帶金鑰；只留文字模型、去掉無法標價的；免費在前、其餘依名稱；價格換成每百萬', async () => {
    const fetchFn = vi.fn(async () => Response.json(raw))
    expect(await listModels(fetchFn)).toEqual([
      { id: 'a/free:free', name: 'Alpha (free)', free: true, promptPerM: 0, completionPerM: 0 },
      { id: 'b/paid', name: 'Beta', free: false, promptPerM: 3, completionPerM: 15 },
      { id: 'z/paid', name: 'Zeta', free: false, promptPerM: 0.5, completionPerM: 1.5 },
    ])
    expect(fetchFn).toHaveBeenCalledWith('https://openrouter.ai/api/v1/models', {})
  })
})

describe('complete（批改請求）', () => {
  const ok = (content: unknown, model = 'qwen/qwen3.8-27b:free') =>
    Response.json({ model, choices: [{ message: { content }, finish_reason: 'stop' }] })

  it('送往 chat/completions：Bearer、models fallback、data_collection deny、JSON 輸出', async () => {
    const fetchFn = vi.fn<(url: string, init?: RequestInit) => Promise<Response>>(async () =>
      ok('{"a":1}', 'qwen/qwen3.8-27b:free'),
    )
    const r = await complete(
      { apiKey: KEY, models: ['m1:free', 'm2:free'], messages: [{ role: 'user', content: 'hi' }] },
      fetchFn as unknown as typeof fetch,
    )
    expect(r).toEqual({ text: '{"a":1}', model: 'qwen/qwen3.8-27b:free', finishReason: 'stop' })
    const [url, init] = fetchFn.mock.calls[0]
    expect(url).toBe('https://openrouter.ai/api/v1/chat/completions')
    expect(init!.headers).toMatchObject({ Authorization: 'Bearer sk-or-v1-test' })
    expect(JSON.parse(init!.body as string)).toEqual({
      models: ['m1:free', 'm2:free'],
      messages: [{ role: 'user', content: 'hi' }],
      max_tokens: 1500,
      response_format: { type: 'json_object' },
      reasoning: { effort: 'low' },
      provider: { data_collection: 'deny' },
    })
  })

  it('content 不是字串 → 空字串（交給解析器判失敗）', async () => {
    expect(
      (await complete({ apiKey: KEY, models: ['m'], messages: [] }, async () => ok(null))).text,
    ).toBe('')
  })

  it.each([
    [
      '401',
      async () => new Response('{"error":{"code":401,"message":"No auth"}}', { status: 401 }),
      'keyInvalid',
    ],
    [
      '429 每日免費額度',
      async () =>
        new Response(
          '{"error":{"code":429,"message":"Rate limit exceeded: free-models-per-day"}}',
          {
            status: 429,
          },
        ),
      'quota',
    ],
    [
      '200＋上游 error 物件',
      async () => Response.json({ error: { code: 429, message: 'upstream busy' } }),
      'other',
    ],
    ['200 但不是 JSON', async () => new Response('<html>', { status: 200 }), 'other'],
    [
      '網路中斷',
      async () => {
        throw new TypeError('Failed to fetch')
      },
      'network',
    ],
  ])('%s → %s', async (_, impl, kind) => {
    expect(await kindOf(complete({ apiKey: KEY, models: ['m'], messages: [] }, vi.fn(impl)))).toBe(
      kind,
    )
  })
})
