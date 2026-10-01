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
    })
  })

  it('VITE_AUTH_GOOGLE=true 才顯示 Google 登入', () => {
    const base = { VITE_SUPABASE_URL: URL, VITE_SUPABASE_ANON_KEY: KEY }
    expect(authConfigFromEnv({ ...base, VITE_AUTH_GOOGLE: 'true' })?.google).toBe(true)
    expect(authConfigFromEnv({ ...base, VITE_AUTH_GOOGLE: '1' })?.google).toBe(false)
  })
})
