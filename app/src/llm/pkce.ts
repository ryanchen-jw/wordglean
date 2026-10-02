// OpenRouter OAuth PKCE（S256）：https://openrouter.ai/docs/guides/overview/auth/oauth（2026-10-02 查）
// 流程：產生 verifier → 帶 challenge 跳到 openrouter.ai/auth → 回到 callback?code=… → 用 code＋verifier 換金鑰
import { OPENROUTER_API, OPENROUTER_ORIGIN, OpenRouterError } from './client'

export const CALLBACK_PATH = '/openrouter/callback'
const VERIFIER_KEY = 'linguaapp.openrouter.pkce'

function base64url(bytes: Uint8Array): string {
  let s = ''
  for (const b of bytes) s += String.fromCharCode(b)
  return btoa(s).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

/** RFC 7636 §4.1：32 個隨機位元組 → 43 字元 base64url */
export function createVerifier(): string {
  return base64url(crypto.getRandomValues(new Uint8Array(32)))
}

/** RFC 7636 §4.2：BASE64URL(SHA256(verifier)) */
export async function challengeFor(verifier: string): Promise<string> {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(verifier))
  return base64url(new Uint8Array(digest))
}

export function authUrl(callbackUrl: string, challenge: string): string {
  const q = new URLSearchParams({
    callback_url: callbackUrl,
    code_challenge: challenge,
    code_challenge_method: 'S256',
  })
  return `${OPENROUTER_ORIGIN}/auth?${q}`
}

/** 開始授權：verifier 存在這個分頁（sessionStorage），回到 callback 時取回；回傳要前往的授權網址 */
export async function beginAuth(
  origin: string,
  storage: Storage = sessionStorage,
): Promise<string> {
  const verifier = createVerifier()
  storage.setItem(VERIFIER_KEY, verifier)
  return authUrl(origin + CALLBACK_PATH, await challengeFor(verifier))
}

/** 取出並刪除 verifier（只能用一次） */
export function takeVerifier(storage: Storage = sessionStorage): string | null {
  const v = storage.getItem(VERIFIER_KEY)
  storage.removeItem(VERIFIER_KEY)
  return v
}

/** 用授權碼換金鑰：POST /api/v1/auth/keys → { key } */
export async function exchangeCode(
  code: string,
  verifier: string,
  fetchFn: typeof fetch = fetch,
): Promise<string> {
  let res: Response
  try {
    res = await fetchFn(`${OPENROUTER_API}/auth/keys`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code, code_verifier: verifier, code_challenge_method: 'S256' }),
    })
  } catch {
    throw new OpenRouterError('network')
  }
  if (!res.ok)
    throw new OpenRouterError(res.status === 401 || res.status === 403 ? 'keyInvalid' : 'other')
  const data = (await res.json().catch(() => null)) as { key?: unknown } | null
  if (typeof data?.key !== 'string' || !data.key) throw new OpenRouterError('other')
  return data.key
}
