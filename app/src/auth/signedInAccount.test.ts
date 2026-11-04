// 期望的鍵名與內容格式取自 supabase-js／auth-js 原始碼（SupabaseClient 的 defaultStorageKey、GoTrueClient._isValidSession）；
// 最後一組用真的 supabase-js 寫入，supabase-js 升級改了格式時會在這裡紅
import { createClient } from '@supabase/supabase-js'
import { beforeEach, describe, expect, it } from 'vitest'
import { readSignedInAccount } from './signedInAccount'

const config = { url: 'https://abcdefgh.supabase.co' }
const KEY = 'sb-abcdefgh-auth-token'

const session = (user: unknown) =>
  JSON.stringify({
    access_token: 'a',
    refresh_token: 'r',
    expires_at: 1,
    user,
  })

const read = () => readSignedInAccount(config)

beforeEach(() => localStorage.clear())

describe('readSignedInAccount：判斷有沒有登入', () => {
  it('沒設定 Supabase：即使存著 session 也視同未登入', () => {
    localStorage.setItem(KEY, session({ email: 'a@b.c' }))
    expect(readSignedInAccount(null)).toBeNull()
  })

  it('沒有 session 鍵：未登入', () => {
    expect(read()).toBeNull()
  })

  it('鍵名依專案網址主機名第一段：別的專案的 session 不算', () => {
    localStorage.setItem('sb-other-auth-token', session({ email: 'a@b.c' }))
    expect(read()).toBeNull()
  })

  it('本機 Supabase 的網址：鍵名是 sb-127-auth-token', () => {
    localStorage.setItem('sb-127-auth-token', session({ email: 'a@b.c' }))
    expect(readSignedInAccount({ url: 'http://127.0.0.1:54321' })?.initial).toBe('A')
  })

  it.each([
    ['壞 JSON', '{not json'],
    ['JSON 是 null', 'null'],
    ['JSON 是字串', '"abc"'],
    ['JSON 是陣列', '[]'],
    ['沒有 access_token', JSON.stringify({ refresh_token: 'r', expires_at: 1, user: {} })],
    ['沒有 refresh_token', JSON.stringify({ access_token: 'a', expires_at: 1, user: {} })],
    ['沒有 expires_at', JSON.stringify({ access_token: 'a', refresh_token: 'r', user: {} })],
    [
      '沒有 user',
      JSON.stringify({ access_token: 'a', refresh_token: 'r', expires_at: 1, email: 'a@b.c' }),
    ],
    ['user 是 null', session(null)],
    ['user 是字串', session('a@b.c')],
    ['名字與 email 都不是字串', session({ email: 1, user_metadata: { name: 2 } })],
    ['user_metadata 不是物件、email 也沒有', session({ user_metadata: 'x' })],
    ['user 是空物件', session({})],
  ])('格式不符（%s）：未登入', (_name, raw) => {
    localStorage.setItem(KEY, raw)
    expect(read()).toBeNull()
  })

  it('localStorage 拋錯（取用或讀取時）：未登入、不往外丟', () => {
    const throwingRead = {
      getItem() {
        throw new Error('blocked')
      },
    }
    expect(readSignedInAccount(config, () => throwingRead)).toBeNull()
    expect(
      readSignedInAccount(config, () => {
        throw new Error('SecurityError')
      }),
    ).toBeNull()
  })

  it('網址無法解析：未登入、不往外丟', () => {
    expect(readSignedInAccount({ url: 'not a url' })).toBeNull()
  })

  it('只讀不寫：讀完 localStorage 內容不變', () => {
    const raw = session({ email: 'a@b.c' })
    localStorage.setItem(KEY, raw)
    read()
    expect(localStorage.length).toBe(1)
    expect(localStorage.getItem(KEY)).toBe(raw)
  })

  it('token 過期但鍵還在：仍顯示（expires_at 不判斷）', () => {
    localStorage.setItem(KEY, session({ email: 'a@b.c' })) // expires_at: 1＝1970 年
    expect(read()?.initial).toBe('A')
  })
})

describe('readSignedInAccount：首字', () => {
  const initialOf = (user: unknown) => {
    localStorage.setItem(KEY, session(user))
    return read()?.initial
  }

  it('full_name 優先於 name 與 email', () => {
    expect(
      initialOf({ email: 'x@y.z', user_metadata: { full_name: '陳治平', name: '小明' } }),
    ).toBe('陳')
  })

  it('沒有 full_name 用 name', () => {
    expect(initialOf({ email: 'x@y.z', user_metadata: { name: '小明' } })).toBe('小')
  })

  it('空白的 full_name 跳過、前後空白不算', () => {
    expect(initialOf({ user_metadata: { full_name: '   ', name: '  小明' } })).toBe('小')
  })

  it('英文名維持原大小寫', () => {
    expect(initialOf({ email: 'x@y.z', user_metadata: { full_name: 'ryan' } })).toBe('r')
  })

  it('emoji 開頭不切壞字元', () => {
    expect(initialOf({ user_metadata: { full_name: '😀小明' } })).toBe('😀')
  })

  it('組合 emoji 與組合字元視為一個字', () => {
    expect(initialOf({ user_metadata: { full_name: '👨‍👩‍👧小明' } })).toBe('👨‍👩‍👧')
    expect(initialOf({ user_metadata: { full_name: '🇹🇼小明' } })).toBe('🇹🇼')
    expect(initialOf({ user_metadata: { full_name: 'élise' } })).toBe('é')
  })

  it('罕用字（BMP 外）不切壞', () => {
    expect(initialOf({ user_metadata: { full_name: '𠮷田' } })).toBe('𠮷')
  })

  it('只有 email：第一個字元轉大寫', () => {
    expect(initialOf({ email: 'ryan@example.com', user_metadata: {} })).toBe('R')
  })

  it('沒有 user_metadata 只有 email', () => {
    expect(initialOf({ email: 'ryan@example.com' })).toBe('R')
  })

  it('名字與 email 都沒有：不顯示頭像', () => {
    expect(initialOf({ user_metadata: {}, email: '' })).toBeUndefined()
  })
})

describe('readSignedInAccount：無障礙用的帳號文字', () => {
  const identityOf = (user: unknown) => {
    localStorage.setItem(KEY, session(user))
    return read()?.identity
  }

  it('有 email 用 email', () => {
    expect(identityOf({ email: 'x@y.z', user_metadata: { full_name: '陳治平' } })).toBe('x@y.z')
  })

  it('沒有 email 退回名字', () => {
    expect(identityOf({ user_metadata: { full_name: '陳治平' } })).toBe('陳治平')
  })
})

describe('與真的 supabase-js 對接', () => {
  const jwt = () => {
    const part = (o: object) => btoa(JSON.stringify(o)).replace(/=+$/, '')
    const exp = Math.floor(Date.now() / 1000) + 3600
    return `${part({ alg: 'HS256' })}.${part({ exp, sub: 'u1' })}.sig`
  }
  const user = {
    id: 'u1',
    email: 'ryan@example.com',
    aud: 'authenticated',
    user_metadata: { full_name: '陳治平' },
    app_metadata: {},
    created_at: '2026-01-01T00:00:00Z',
  }
  // 不連網：auth 的請求全由這裡回應
  const fakeFetch: typeof fetch = async (input) =>
    String(input instanceof Request ? input.url : input).includes('/logout')
      ? new Response(null, { status: 204 })
      : new Response(JSON.stringify(user), {
          status: 200,
          headers: { 'content-type': 'application/json' },
        })

  it('supabase-js 存進去的 session 讀得到；登出後讀不到', async () => {
    const client = createClient(config.url, 'anon-key', { global: { fetch: fakeFetch } })
    const { error } = await client.auth.setSession({ access_token: jwt(), refresh_token: 'r' })
    expect(error).toBeNull()
    expect(localStorage.getItem(KEY)).not.toBeNull()
    expect(read()).toEqual({ initial: '陳', identity: 'ryan@example.com' })

    await client.auth.signOut()
    expect(localStorage.getItem(KEY)).toBeNull()
    expect(read()).toBeNull()
  })
})
