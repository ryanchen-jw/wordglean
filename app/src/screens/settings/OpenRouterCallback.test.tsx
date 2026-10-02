import 'fake-indexeddb/auto'
import { render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { db } from '../../data/appDb'
import { getLink } from '../../llm/keyStore'
import { oauthFailed } from '../../llm/startup'
import { OpenRouterCallback } from './OpenRouterCallback'

const VERIFIER = 'dBjftJeZ4CVP-mB92K27uhbUJU1p1r_wW1gFWFOEjXk'
const T = Date.parse('2026-10-02T08:00:00Z')

beforeEach(async () => {
  sessionStorage.clear()
  await db.delete()
  await db.open()
})

function at(search: string) {
  history.replaceState(null, '', `/openrouter/callback${search}`)
}

describe('OAuth PKCE 回呼', () => {
  it('用 code＋verifier 換金鑰、存起來、回設定頁；verifier 用完即刪', async () => {
    at('?code=abc123')
    sessionStorage.setItem('linguaapp.openrouter.pkce', VERIFIER)
    const fetchFn = vi.fn<typeof fetch>(async () => Response.json({ key: 'sk-or-v1-from-oauth' }))
    render(<OpenRouterCallback fetchFn={fetchFn} now={() => T} />)
    expect(screen.getByText('正在完成 OpenRouter 授權…')).toBeInTheDocument()
    await vi.waitFor(() => expect(location.pathname).toBe('/settings'))
    expect(fetchFn).toHaveBeenCalledOnce()
    expect(fetchFn.mock.calls[0][0]).toBe('https://openrouter.ai/api/v1/auth/keys')
    expect(JSON.parse(fetchFn.mock.calls[0][1]!.body as string)).toEqual({
      code: 'abc123',
      code_verifier: VERIFIER,
      code_challenge_method: 'S256',
    })
    expect(await getLink(db)).toMatchObject({ apiKey: 'sk-or-v1-from-oauth', via: 'oauth' })
    expect(sessionStorage.getItem('linguaapp.openrouter.pkce')).toBeNull()
    expect(oauthFailed()).toBe(false)
  })

  it.each([
    ['沒有 code（使用者取消）', '', VERIFIER, async () => Response.json({ key: 'x' })],
    ['verifier 不見了（換了分頁）', '?code=abc', null, async () => Response.json({ key: 'x' })],
    ['換金鑰被拒', '?code=abc', VERIFIER, async () => new Response('{}', { status: 403 })],
  ])('%s：不存金鑰、回設定頁並留下失敗提示', async (_, search, verifier, impl) => {
    vi.spyOn(console, 'error').mockImplementation(() => {})
    at(search)
    if (verifier) sessionStorage.setItem('linguaapp.openrouter.pkce', verifier)
    render(<OpenRouterCallback fetchFn={vi.fn<typeof fetch>(impl)} />)
    await vi.waitFor(() => expect(location.pathname).toBe('/settings'))
    expect(await getLink(db)).toBeNull()
    expect(oauthFailed()).toBe(true)
  })
})
