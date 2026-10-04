import 'fake-indexeddb/auto'
import { fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { db } from '../../data/appDb'
import { getLink, saveLink } from '../../llm/keyStore'
import { markOauthFailed } from '../../llm/startup'
import { AiSection } from './AiSection'

// 期望文案取自設計 s11（預設、已連結）與 TASK-4 文案表
const KEY = 'sk-or-v1-0123456789abcdef0123456789abcdef'
const text = { input_modalities: ['text'], output_modalities: ['text'] }
const MODELS = {
  data: [
    {
      id: 'qwen/qwen3.8-27b:free',
      name: 'Qwen: Qwen3.8 27B (free)',
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

function fakeOpenRouter({ remaining = 37 }: { remaining?: number | null } = {}) {
  return vi.fn<typeof fetch>(async (input) => {
    const url = String(input)
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
    expect(screen.getByText('寫作題的句子只會送到你選的 OpenRouter 模型')).toBeInTheDocument()
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
      'Qwen: Qwen3.8 27B (free)・免費',
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
    fireEvent.click(await screen.findByRole('button', { name: /模型/ }))
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
