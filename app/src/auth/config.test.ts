// @vitest-environment node
import { describe, expect, it } from 'vitest'
import { authConfigFromEnv } from './config'

const URL = 'http://127.0.0.1:55421'
const KEY = 'anon-key'

describe('登入設定（未設定 Supabase 時不提供登入，規格 §3）', () => {
  it('沒設定任何變數 → 無登入', () => {
    expect(authConfigFromEnv({})).toBeNull()
  })

  it('只設一半 → 無登入', () => {
    expect(authConfigFromEnv({ VITE_SUPABASE_URL: URL })).toBeNull()
    expect(authConfigFromEnv({ VITE_SUPABASE_ANON_KEY: KEY })).toBeNull()
  })

  it('空白字串視同未設定', () => {
    expect(authConfigFromEnv({ VITE_SUPABASE_URL: ' ', VITE_SUPABASE_ANON_KEY: KEY })).toBeNull()
  })

  it('兩個都設 → 可登入；Google 預設關閉', () => {
    expect(authConfigFromEnv({ VITE_SUPABASE_URL: URL, VITE_SUPABASE_ANON_KEY: KEY })).toEqual({
      url: URL,
      anonKey: KEY,
      google: false,
      email: true,
    })
  })

  it('VITE_AUTH_GOOGLE=true 才顯示 Google 登入', () => {
    const base = { VITE_SUPABASE_URL: URL, VITE_SUPABASE_ANON_KEY: KEY }
    expect(authConfigFromEnv({ ...base, VITE_AUTH_GOOGLE: 'true' })?.google).toBe(true)
    expect(authConfigFromEnv({ ...base, VITE_AUTH_GOOGLE: '1' })?.google).toBe(false)
  })

  describe('VITE_AUTH_EMAIL：只有明確等於 false 才關閉 Email 驗證碼', () => {
    const base = { VITE_SUPABASE_URL: URL, VITE_SUPABASE_ANON_KEY: KEY }

    it.each([undefined, '', 'true', '0', 'False', ' false '])('%j → 維持開啟', (value) => {
      expect(authConfigFromEnv({ ...base, VITE_AUTH_EMAIL: value })?.email).toBe(true)
    })

    it('官方站組合（Google 開、Email 關）→ 只有 Google', () => {
      expect(
        authConfigFromEnv({ ...base, VITE_AUTH_GOOGLE: 'true', VITE_AUTH_EMAIL: 'false' }),
      ).toEqual({ url: URL, anonKey: KEY, google: true, email: false })
    })

    it('Google 也開、Email 未設定 → 兩個都有（自架者行為不變）', () => {
      expect(authConfigFromEnv({ ...base, VITE_AUTH_GOOGLE: 'true' })).toEqual({
        url: URL,
        anonKey: KEY,
        google: true,
        email: true,
      })
    })

    it.each([undefined, '', '1'])(
      'Email 關且 VITE_AUTH_GOOGLE=%j → 沒有任何登入方式，等同未設定 Supabase',
      (google) => {
        expect(
          authConfigFromEnv({ ...base, VITE_AUTH_GOOGLE: google, VITE_AUTH_EMAIL: 'false' }),
        ).toBeNull()
      },
    )

    it('沒設定 Supabase 時，Email 開關不改變結果', () => {
      expect(authConfigFromEnv({ VITE_AUTH_GOOGLE: 'true', VITE_AUTH_EMAIL: 'false' })).toBeNull()
    })
  })
})
