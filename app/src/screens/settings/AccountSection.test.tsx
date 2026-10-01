// TASK-20 AC#3 的登入入口測試（原在 App.test，入口隨 TASK-11 搬到設定頁「帳號與同步」）
import 'fake-indexeddb/auto'
import { render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { AccountSection } from './AccountSection'

// 不連真的 Supabase：登入工作階段以假物件代替
vi.mock('../../auth/session', () => ({
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

describe('設定頁帳號區塊', () => {
  it('未設定 Supabase：沒有登入入口，顯示進度只存在本機（AC#3）', async () => {
    vi.stubEnv('VITE_SUPABASE_URL', '')
    vi.stubEnv('VITE_SUPABASE_ANON_KEY', '')
    render(<AccountSection />)
    expect(screen.getByText('未登入：進度只存在這支手機')).toBeInTheDocument()
    // 入口在動態載入後才出現：等足時間仍找不到才算「沒有」
    await expect(screen.findByTestId('login-entry', {}, { timeout: 1000 })).rejects.toThrow()
  })

  it('有設定 Supabase：出現登入入口', async () => {
    vi.stubEnv('VITE_SUPABASE_URL', 'http://127.0.0.1:55421')
    vi.stubEnv('VITE_SUPABASE_ANON_KEY', 'anon-key')
    render(<AccountSection />)
    expect(await screen.findByTestId('login-entry')).toBeInTheDocument()
    expect(screen.queryByText('未登入：進度只存在這支手機')).toBeNull()
  })
})
