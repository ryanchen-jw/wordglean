import 'fake-indexeddb/auto'
import { fireEvent, render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { db } from '../../data/appDb'
import { getLink } from '../../llm/keyStore'
import { OpenRouterKeyScreen } from './OpenRouterKeyScreen'

// 期望文案取自設計 s11 貼金鑰錯誤與 TASK-4 文案表
const KEY = 'sk-or-v1-0123456789abcdef0123456789abcdef'
const T = Date.parse('2026-10-02T08:00:00Z')

beforeEach(async () => {
  history.replaceState({ idx: 1 }, '', '/openrouter')
  await db.delete()
  await db.open()
})

function paste(value: string) {
  fireEvent.change(screen.getByLabelText('金鑰'), { target: { value } })
  fireEvent.click(screen.getByRole('button', { name: '驗證並儲存' }))
}

describe('貼上 OpenRouter 金鑰', () => {
  it('標題、欄位；沒輸入不能按', () => {
    render(<OpenRouterKeyScreen fetchFn={vi.fn()} />)
    expect(screen.getByRole('heading', { name: '貼上 OpenRouter 金鑰' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '驗證並儲存' })).toBeDisabled()
  })

  it('格式不對：欄位下方紅字、不送出驗證、不存', async () => {
    const fetchFn = vi.fn<typeof fetch>()
    render(<OpenRouterKeyScreen fetchFn={fetchFn} />)
    paste('3f9a-not-a-key')
    expect(await screen.findByRole('alert')).toHaveTextContent(
      '金鑰無效：請確認是否完整貼上（應以 sk-or- 開頭）',
    )
    expect(screen.getByLabelText('金鑰')).toHaveAttribute('aria-invalid', 'true')
    expect(fetchFn).not.toHaveBeenCalled()
    expect(await getLink(db)).toBeNull()
  })

  it('格式對：向 OpenRouter 驗證（只送往 openrouter.ai），通過才存、回設定頁', async () => {
    const fetchFn = vi.fn<typeof fetch>(async () => Response.json({ data: {} }))
    render(<OpenRouterKeyScreen fetchFn={fetchFn} now={() => T} />)
    paste(`  ${KEY}  `)
    await vi.waitFor(() => expect(location.pathname).toBe('/settings'))
    expect(fetchFn).toHaveBeenCalledOnce()
    expect(fetchFn.mock.calls[0][0]).toBe('https://openrouter.ai/api/v1/key')
    expect(await getLink(db)).toEqual({
      key: 'openrouter',
      apiKey: KEY,
      model: 'qwen/qwen3.8-27b:free',
      via: 'paste',
      linkedAt: T,
    })
  })

  it.each([
    [
      'OpenRouter 拒絕（401）',
      async () => new Response('{}', { status: 401 }),
      'OpenRouter 不接受這組金鑰，請到 OpenRouter 確認金鑰還有效。',
    ],
    [
      '網路中斷',
      async () => {
        throw new TypeError('Failed to fetch')
      },
      '現在連不到 OpenRouter 驗證金鑰，請稍後再試。',
    ],
  ])('%s：顯示原因、不存', async (_, impl, message) => {
    render(<OpenRouterKeyScreen fetchFn={vi.fn<typeof fetch>(impl)} />)
    paste(KEY)
    expect(await screen.findByRole('alert')).toHaveTextContent(message)
    expect(screen.getByRole('button', { name: '驗證並儲存' })).toBeEnabled()
    expect(await getLink(db)).toBeNull()
    expect(location.pathname).toBe('/openrouter')
  })
})
