import { render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import App from './App'

// 不連真的 Supabase：登入工作階段以假物件代替
vi.mock('./auth/session', () => ({
  createAuthSession: async () => ({
    google: false,
    sendCode: async () => {},
    verifyCode: async () => {},
    signInWithGoogle: async () => {},
    signOut: async () => true,
    subscribe: (cb: (email: string | null) => void) => {
      cb(null)
      return () => {}
    },
  }),
}))

afterEach(() => {
  vi.unstubAllEnvs()
})

describe('App 佔位頁', () => {
  it('顯示骨架識別字串', () => {
    render(<App />)
    expect(screen.getByTestId('app-placeholder')).toHaveTextContent('LinguaApp 骨架建置中')
  })

  it('未設定 Supabase：沒有登入入口，其餘照常（AC#3）', async () => {
    vi.stubEnv('VITE_SUPABASE_URL', '')
    vi.stubEnv('VITE_SUPABASE_ANON_KEY', '')
    render(<App />)
    expect(screen.getByTestId('app-placeholder')).toBeInTheDocument()
    // 入口在動態載入後才出現：等足時間仍找不到才算「沒有」（有設定時下一案例約數十毫秒內出現）
    await expect(screen.findByTestId('login-entry', {}, { timeout: 1000 })).rejects.toThrow()
  })

  it('有設定 Supabase：出現登入入口', async () => {
    vi.stubEnv('VITE_SUPABASE_URL', 'http://127.0.0.1:55421')
    vi.stubEnv('VITE_SUPABASE_ANON_KEY', 'anon-key')
    render(<App />)
    expect(await screen.findByTestId('login-entry')).toBeInTheDocument()
  })
})
