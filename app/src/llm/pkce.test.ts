// @vitest-environment node
import { describe, expect, it, vi } from 'vitest'
import { OpenRouterError } from './client'
import {
  authUrl,
  beginAuth,
  challengeFor,
  createVerifier,
  exchangeCode,
  takeVerifier,
} from './pkce'

class MemoryStorage implements Storage {
  private m = new Map<string, string>()
  get length() {
    return this.m.size
  }
  clear() {
    this.m.clear()
  }
  getItem(k: string) {
    return this.m.get(k) ?? null
  }
  key(i: number) {
    return [...this.m.keys()][i] ?? null
  }
  removeItem(k: string) {
    this.m.delete(k)
  }
  setItem(k: string, v: string) {
    this.m.set(k, v)
  }
}

describe('PKCE S256', () => {
  it('RFC 7636 附錄 B 已知向量', async () => {
    expect(await challengeFor('dBjftJeZ4CVP-mB92K27uhbUJU1p1r_wW1gFWFOEjXk')).toBe(
      'E9Melhoa2OwvFrEMTJguCHaoeK1t8URWbuGJSstw-cM',
    )
  })

  it('verifier：43 字元 base64url、每次不同', () => {
    const a = createVerifier()
    expect(a).toMatch(/^[A-Za-z0-9_-]{43}$/)
    expect(createVerifier()).not.toBe(a)
  })

  it('授權網址（官方文件格式）', () => {
    expect(authUrl('http://localhost:5361/openrouter/callback', 'abc')).toBe(
      'https://openrouter.ai/auth?callback_url=http%3A%2F%2Flocalhost%3A5361%2Fopenrouter%2Fcallback&code_challenge=abc&code_challenge_method=S256',
    )
  })

  it('beginAuth 存 verifier、網址帶對應 challenge；takeVerifier 只能取一次', async () => {
    const storage = new MemoryStorage()
    const url = new URL(await beginAuth('https://lingua.example', storage))
    expect(url.origin + url.pathname).toBe('https://openrouter.ai/auth')
    expect(url.searchParams.get('callback_url')).toBe('https://lingua.example/openrouter/callback')
    const verifier = takeVerifier(storage)!
    expect(url.searchParams.get('code_challenge')).toBe(await challengeFor(verifier))
    expect(takeVerifier(storage)).toBeNull()
  })
})

describe('exchangeCode', () => {
  it('POST https://openrouter.ai/api/v1/auth/keys，body 帶 code／code_verifier／S256，回傳 key', async () => {
    const fetchFn = vi.fn(async () => Response.json({ key: 'sk-or-v1-new' }))
    expect(await exchangeCode('the-code', 'the-verifier', fetchFn)).toBe('sk-or-v1-new')
    expect(fetchFn).toHaveBeenCalledWith('https://openrouter.ai/api/v1/auth/keys', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        code: 'the-code',
        code_verifier: 'the-verifier',
        code_challenge_method: 'S256',
      }),
    })
  })

  it.each([
    ['403（授權碼錯或過期）', async () => new Response('{}', { status: 403 }), 'keyInvalid'],
    ['500', async () => new Response('', { status: 500 }), 'other'],
    ['200 但沒有 key', async () => Response.json({}), 'other'],
    [
      '網路中斷',
      async () => {
        throw new TypeError('Failed to fetch')
      },
      'network',
    ],
  ])('%s → %s', async (_, impl, kind) => {
    const err = await exchangeCode('c', 'v', vi.fn(impl)).catch((e: unknown) => e)
    expect(err).toBeInstanceOf(OpenRouterError)
    expect((err as OpenRouterError).kind).toBe(kind)
  })
})
