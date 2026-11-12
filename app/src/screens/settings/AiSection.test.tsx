import 'fake-indexeddb/auto'
import { fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { db } from '../../data/appDb'
import { getLink, saveLink, setModel } from '../../llm/keyStore'
import { markOauthFailed } from '../../llm/startup'
import { AiSection } from './AiSection'

// 期望文案取自設計 s11（預設、已連結）與 TASK-4 文案表
const KEY = 'sk-or-v1-0123456789abcdef0123456789abcdef'
const text = { input_modalities: ['text'], output_modalities: ['text'] }
const MODELS = {
  data: [
    {
      id: 'google/gemma-4-31b-it:free',
      name: 'Google: Gemma 4 31B (free)',
      pricing: { prompt: '0', completion: '0' },
      architecture: text,
    },
    {
      id: 'openai/gpt-x',
      name: 'OpenAI: GPT X',
      pricing: { prompt: '0.0000025', completion: '0.00001' },
      architecture: text,
    },
  ],
}

function fakeOpenRouter({
  remaining = 37,
  chat,
}: { remaining?: number | null; chat?: typeof fetch } = {}) {
  return vi.fn<typeof fetch>(async (input, init) => {
    const url = String(input)
    if (url === 'https://openrouter.ai/api/v1/chat/completions' && chat) return chat(input, init)
    if (url === 'https://openrouter.ai/api/v1/key')
      return Response.json({
        data: remaining === null ? {} : { free_model_daily_requests: { remaining } },
      })
    if (url === 'https://openrouter.ai/api/v1/models') return Response.json(MODELS)
    return new Response('', { status: 404 })
  })
}

beforeEach(async () => {
  sessionStorage.clear()
  history.replaceState(null, '', '/settings')
  await db.delete()
  await db.open()
})

describe('未連結（s11 預設）', () => {
  it('狀態、一鍵授權、改用貼上金鑰、隱私說明兩行', async () => {
    render(<AiSection fetchFn={fakeOpenRouter()} />)
    expect(await screen.findByText('狀態：未設定')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '用 OpenRouter 帳號一鍵授權' })).toBeInTheDocument()
    expect(screen.getByText('金鑰只存在這支手機，不會傳到我們的伺服器')).toBeInTheDocument()
    expect(screen.getByText('寫作題的句子只會送到 OpenRouter')).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: '改用貼上金鑰' }))
    expect(location.pathname).toBe('/openrouter')
  })

  it('一鍵授權：前往 openrouter.ai/auth（S256、callback 指回本站），verifier 存在這個分頁', async () => {
    const go = vi.fn()
    render(<AiSection fetchFn={fakeOpenRouter()} go={go} />)
    fireEvent.click(await screen.findByRole('button', { name: '用 OpenRouter 帳號一鍵授權' }))
    await waitFor(() => expect(go).toHaveBeenCalledOnce())
    const url = new URL(go.mock.calls[0][0] as string)
    expect(url.origin + url.pathname).toBe('https://openrouter.ai/auth')
    expect(url.searchParams.get('callback_url')).toBe(`${location.origin}/openrouter/callback`)
    expect(url.searchParams.get('code_challenge_method')).toBe('S256')
    expect(sessionStorage.getItem('linguaapp.openrouter.pkce')).toMatch(/^[A-Za-z0-9_-]{43}$/)
  })

  it('授權回呼失敗：顯示一次「授權沒有完成」，再進來就不顯示', async () => {
    markOauthFailed()
    const first = render(<AiSection fetchFn={fakeOpenRouter()} />)
    expect(await screen.findByRole('alert')).toHaveTextContent('授權沒有完成，請再試一次。')
    first.unmount()
    render(<AiSection fetchFn={fakeOpenRouter()} />)
    await screen.findByText('狀態：未設定')
    expect(screen.queryByRole('alert')).toBeNull()
  })
})

describe('已連結（s11 已授權）', () => {
  beforeEach(async () => {
    await saveLink(db, KEY, 'oauth', 1)
  })

  it('已連結、模型「免費模型」、今日免費額度剩 37 次、解除連結', async () => {
    const fetchFn = fakeOpenRouter()
    render(<AiSection fetchFn={fetchFn} />)
    expect(await screen.findByText('已連結')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /模型\s*免費模型/ })).toBeInTheDocument()
    expect(await screen.findByText('今日免費額度剩 37 次')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '解除連結' })).toBeInTheDocument()
    expect(fetchFn).toHaveBeenCalledWith('https://openrouter.ai/api/v1/key', {
      headers: { Authorization: `Bearer ${KEY}` },
    })
  })

  it('OpenRouter 沒回額度欄位就不顯示額度列', async () => {
    render(<AiSection fetchFn={fakeOpenRouter({ remaining: null })} />)
    await screen.findByText('已連結')
    await waitFor(() => expect(screen.queryByText(/今日免費額度剩/)).toBeNull())
  })

  it('模型清單：標免費與價格；選付費模型後列上顯示模型 id', async () => {
    render(<AiSection fetchFn={fakeOpenRouter()} />)
    fireEvent.click(await screen.findByRole('button', { name: /模型\s*免費模型/ }))
    const list = await screen.findByRole('listbox', { name: '模型' })
    const options = within(list).getAllByRole('option')
    expect(options.map((o) => o.textContent)).toEqual([
      'Google: Gemma 4 31B (free)・免費',
      'OpenAI: GPT X・每百萬詞元 輸入 2.5／輸出 10 美元',
    ])
    expect(options[0]).toHaveAttribute('aria-selected', 'true')
    fireEvent.click(options[1])
    await waitFor(async () => expect((await getLink(db))?.model).toBe('openai/gpt-x'))
    expect(await screen.findByRole('button', { name: /模型\s*openai\/gpt-x/ })).toBeInTheDocument()
  })

  it('模型清單讀不到：顯示錯誤', async () => {
    const fetchFn = vi.fn<typeof fetch>(async (input) =>
      String(input).endsWith('/models')
        ? Promise.reject(new TypeError('Failed to fetch'))
        : Response.json({ data: {} }),
    )
    render(<AiSection fetchFn={fetchFn} />)
    fireEvent.click(await screen.findByRole('button', { name: /模型\s*免費模型/ }))
    expect(await screen.findByRole('alert')).toHaveTextContent('讀不到模型清單，請稍後再試。')
  })

  it('解除連結要二次確認：取消保留、確認後刪掉金鑰回到未設定', async () => {
    render(<AiSection fetchFn={fakeOpenRouter()} />)
    fireEvent.click(await screen.findByRole('button', { name: '解除連結' }))
    let dialog = await screen.findByRole('alertdialog')
    expect(dialog).toHaveTextContent('解除 OpenRouter 連結？')
    expect(dialog).toHaveTextContent('解除後，寫作題改成對照參考答案自己判斷。之後可以再連結。')
    expect(within(dialog).getByRole('button', { name: '取消' })).toHaveFocus()
    fireEvent.click(within(dialog).getByRole('button', { name: '取消' }))
    expect(await getLink(db)).not.toBeNull()

    fireEvent.click(screen.getByRole('button', { name: '解除連結' }))
    dialog = await screen.findByRole('alertdialog')
    fireEvent.click(within(dialog).getByRole('button', { name: '解除連結' }))
    expect(await screen.findByText('狀態：未設定')).toBeInTheDocument()
    expect(await getLink(db)).toBeNull()
  })
})

describe('已連結時改用另一種連結方式（TASK-33）', () => {
  it('帳號授權連結：顯示「改用貼上金鑰」、不顯示一鍵授權；按下前往貼金鑰頁、連結不變', async () => {
    await saveLink(db, KEY, 'oauth', 1)
    render(<AiSection fetchFn={fakeOpenRouter()} />)
    await screen.findByText('已連結')
    expect(screen.queryByRole('button', { name: '用 OpenRouter 帳號一鍵授權' })).toBeNull()
    fireEvent.click(screen.getByRole('button', { name: '改用貼上金鑰' }))
    expect(location.pathname).toBe('/openrouter')
    expect(await getLink(db)).toMatchObject({ apiKey: KEY, via: 'oauth' })
  })

  it('貼金鑰連結：顯示一鍵授權入口、不顯示「改用貼上金鑰」；按下前往授權頁、連結不變', async () => {
    await saveLink(db, KEY, 'paste', 1)
    const go = vi.fn()
    render(<AiSection fetchFn={fakeOpenRouter()} go={go} />)
    await screen.findByText('已連結')
    expect(screen.queryByRole('button', { name: '改用貼上金鑰' })).toBeNull()
    fireEvent.click(screen.getByRole('button', { name: '用 OpenRouter 帳號一鍵授權' }))
    await waitFor(() => expect(go).toHaveBeenCalledOnce())
    expect(new URL(go.mock.calls[0][0] as string).pathname).toBe('/auth')
    expect(await getLink(db)).toMatchObject({ apiKey: KEY, via: 'paste' })
  })

  it('改用帳號授權失敗回來：仍是已連結、顯示一次「授權沒有完成」', async () => {
    await saveLink(db, KEY, 'paste', 1)
    markOauthFailed()
    render(<AiSection fetchFn={fakeOpenRouter()} />)
    await screen.findByText('已連結')
    expect(screen.getByRole('alert')).toHaveTextContent('授權沒有完成，請再試一次。')
    expect(sessionStorage.getItem('linguaapp.openrouter.oauthFailed')).toBeNull()
  })
})

describe('測試目前模型（TASK-29）', () => {
  const CHAT = 'https://openrouter.ai/api/v1/chat/completions'
  const BUTTON = { name: '測試目前模型' }
  const GRADE = {
    isCorrect: false,
    corrected: 'I really like music.',
    errors: [{ original: 'very like', corrected: 'really like', explanationZh: '說明' }],
    explanationZh: '說明',
    levelOk: true,
  }
  const graded = (model = 'xingchen-agi/xing4.0-29b-a4b:free') =>
    Response.json({
      model,
      choices: [{ message: { content: JSON.stringify(GRADE) }, finish_reason: 'stop' }],
    })
  /** 像真 fetch：不回應，直到 signal 中止才拒絕 */
  const hanging = () =>
    vi.fn<typeof fetch>(
      (_input, init) =>
        new Promise((_resolve, reject) => {
          init?.signal?.addEventListener('abort', () =>
            reject(new DOMException('Aborted', 'AbortError')),
          )
        }),
    )
  const chatCalls = (fetchFn: ReturnType<typeof fakeOpenRouter>) =>
    fetchFn.mock.calls.filter(([url]) => String(url) === CHAT)
  const snapshot = async () =>
    Object.fromEntries(
      await Promise.all(db.tables.map(async (x) => [x.name, await x.toArray()] as const)),
    )

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('未連結：不顯示按鈕與說明', async () => {
    render(<AiSection fetchFn={fakeOpenRouter()} />)
    await screen.findByText('狀態：未設定')
    expect(screen.queryByRole('button', BUTTON)).toBeNull()
    expect(screen.queryByText('測試會實際送出批改，可能用掉免費額度或費用。')).toBeNull()
  })

  describe('已連結', () => {
    beforeEach(async () => {
      await saveLink(db, KEY, 'oauth', 1)
    })

    it('進頁只顯示按鈕與說明、不自動打；結果區已在畫面上且為空', async () => {
      const chat = vi.fn<typeof fetch>(async () => graded())
      render(<AiSection fetchFn={fakeOpenRouter({ chat })} />)
      expect(await screen.findByRole('button', BUTTON)).toBeEnabled()
      expect(screen.getByText('測試會實際送出批改，可能用掉免費額度或費用。')).toBeInTheDocument()
      expect(screen.getByRole('status')).toBeEmptyDOMElement()
      expect(chat).not.toHaveBeenCalled()
    })

    it('成功：走批改請求、固定測試句，顯示實際回應的模型與秒數', async () => {
      let clock = 1000
      vi.spyOn(performance, 'now').mockImplementation(() => clock)
      const chat = vi.fn<typeof fetch>(async () => {
        clock += 3240
        return graded()
      })
      render(<AiSection fetchFn={fakeOpenRouter({ chat })} />)
      fireEvent.click(await screen.findByRole('button', BUTTON))
      expect(screen.getByRole('status')).toHaveTextContent('測試中…')
      await waitFor(() =>
        expect(screen.getByRole('status').textContent).toBe(
          '可以使用：xingchen-agi/xing4.0-29b-a4b:free（3.2 秒）',
        ),
      )
      expect(screen.getByText('xingchen-agi/xing4.0-29b-a4b:free')).toHaveAttribute('lang', 'en')
      const [, init] = chat.mock.calls[0]
      expect((init?.headers as Record<string, string>).Authorization).toBe(`Bearer ${KEY}`)
      const body = JSON.parse(init?.body as string) as {
        models: string[]
        messages: { role: string; content: string }[]
      }
      expect(body.models[0]).toBe('google/gemma-4-31b-it:free')
      expect(body.messages[1].content).toContain('"""I very like music."""')
    })

    it('回應沒帶 model：顯示選定的模型', async () => {
      const chat: typeof fetch = async () =>
        Response.json({
          choices: [{ message: { content: JSON.stringify(GRADE) }, finish_reason: 'stop' }],
        })
      render(<AiSection fetchFn={fakeOpenRouter({ chat })} />)
      fireEvent.click(await screen.findByRole('button', BUTTON))
      await waitFor(() =>
        expect(screen.getByRole('status').textContent).toMatch(
          /^可以使用：google\/gemma-4-31b-it:free（\d+\.\d 秒）$/,
        ),
      )
    })

    it.each<[string, typeof fetch, string, number]>([
      [
        'quota（每日免費額度）',
        async () =>
          Response.json(
            { error: { code: 429, message: 'Rate limit exceeded: free-models-per-day' } },
            { status: 429 },
          ),
        '今日免費額度已用完。',
        1,
      ],
      [
        'keyInvalid',
        async () => Response.json({ error: { code: 401, message: 'No auth' } }, { status: 401 }),
        '金鑰無效，請重新連結 OpenRouter。',
        1,
      ],
      [
        'network',
        () => Promise.reject(new TypeError('Failed to fetch')),
        '連不上網路，請檢查連線後再試。',
        1,
      ],
      [
        'other（上游忙碌）',
        async () => Response.json({ error: { code: 503, message: 'busy' } }, { status: 503 }),
        '目前的模型都在忙碌或沒有回應，請稍後再試。',
        2,
      ],
      [
        'other（HTTP 200 但解析不出批改結果＝不算可用）',
        async () =>
          Response.json({
            model: 'google/gemma-4-31b-it:free',
            choices: [{ message: { content: 'not json' }, finish_reason: 'stop' }],
          }),
        '目前的模型都在忙碌或沒有回應，請稍後再試。',
        2,
      ],
    ])(
      '失敗 %s：顯示該原因的文案，按鈕恢復；只有批改流程本身的換一批會多送',
      async (_name, chat, message, sent) => {
        const log = (['log', 'info', 'warn', 'error', 'debug'] as const).map((m) =>
          vi.spyOn(console, m),
        )
        const fetchFn = fakeOpenRouter({ chat })
        render(<AiSection fetchFn={fetchFn} />)
        fireEvent.click(await screen.findByRole('button', BUTTON))
        await waitFor(() => expect(screen.getByRole('status').textContent).toBe(message))
        expect(screen.getByRole('button', BUTTON)).toBeEnabled()
        expect(chatCalls(fetchFn)).toHaveLength(sent)
        expect(JSON.stringify(log.flatMap((spy) => spy.mock.calls))).not.toContain(KEY)
      },
    )

    it('測試中不可重複送出；結果留到下次測試才換', async () => {
      const replies: ((r: Response) => void)[] = []
      const fetchFn = fakeOpenRouter({
        chat: () => new Promise((resolve) => replies.push(resolve)),
      })
      render(<AiSection fetchFn={fetchFn} />)
      const button = await screen.findByRole('button', BUTTON)
      fireEvent.click(button)
      fireEvent.click(button)
      expect(button).toBeDisabled()
      expect(button).toHaveAttribute('aria-busy', 'true')
      await waitFor(() => expect(replies).toHaveLength(1))
      fireEvent.click(button)
      expect(chatCalls(fetchFn)).toHaveLength(1)

      replies[0](graded())
      await waitFor(() => expect(button).toBeEnabled())
      expect(screen.getByRole('status')).toHaveTextContent('可以使用：')

      // 第二次：舊結果換成進行中，只多一次請求
      fireEvent.click(button)
      expect(screen.getByRole('status')).toHaveTextContent('測試中…')
      await waitFor(() => expect(replies).toHaveLength(2))
      replies[1](Response.json({ error: { code: 401, message: 'No auth' } }, { status: 401 }))
      await waitFor(() =>
        expect(screen.getByRole('status').textContent).toBe('金鑰無效，請重新連結 OpenRouter。'),
      )
    })

    it('卸載（離開設定頁）中止請求', async () => {
      const chat = hanging()
      const view = render(<AiSection fetchFn={fakeOpenRouter({ chat })} />)
      fireEvent.click(await screen.findByRole('button', BUTTON))
      await waitFor(() => expect(chat).toHaveBeenCalledOnce())
      const signal = chat.mock.calls[0][1]?.signal as AbortSignal
      expect(signal.aborted).toBe(false)
      view.unmount()
      expect(signal.aborted).toBe(true)
    })

    it('測試中換模型：中止舊請求、不把舊模型的結果算到新模型頭上', async () => {
      const chat = hanging()
      render(<AiSection fetchFn={fakeOpenRouter({ chat })} />)
      fireEvent.click(await screen.findByRole('button', BUTTON))
      await waitFor(() => expect(chat).toHaveBeenCalledOnce())
      await setModel(db, 'openai/gpt-x')
      await waitFor(() => expect(screen.getByRole('button', BUTTON)).toBeEnabled())
      expect((chat.mock.calls[0][1]?.signal as AbortSignal).aborted).toBe(true)
      expect(screen.getByRole('status')).toBeEmptyDOMElement()
    })

    it('測試不改選定模型、不寫入本機任何資料（回應的模型與選定不同時亦然）', async () => {
      const before = await snapshot()
      render(<AiSection fetchFn={fakeOpenRouter({ chat: async () => graded() })} />)
      fireEvent.click(await screen.findByRole('button', BUTTON))
      await waitFor(() => expect(screen.getByRole('status')).toHaveTextContent('可以使用：'))
      expect(await snapshot()).toEqual(before)
      expect((await getLink(db))?.model).toBe('google/gemma-4-31b-it:free')
    })
  })
})
