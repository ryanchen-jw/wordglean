// TASK-20 AC#3 的登入入口測試（原在 App.test，入口隨 TASK-11 搬到設定頁「帳號與同步」）
import 'fake-indexeddb/auto'
import { fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import type { AuthConfig } from '../../auth/config'

// 不連真的 Supabase：登入工作階段以假物件代替（登入方式照設定帶，同 createAuthSession）
const createAuthSession = vi.hoisted(() => vi.fn())
vi.mock('../../auth/session', () => ({ createAuthSession }))

// 工作階段是模組單例（sessionHandle），每個測試各自重載才讀得到自己的設定
async function renderSection() {
  vi.resetModules()
  const { AccountSection } = await import('./AccountSection')
  render(<AccountSection />)
}

beforeEach(() => {
  createAuthSession.mockReset()
  createAuthSession.mockImplementation(async (config: AuthConfig) => ({
    google: config.google,
    email: config.email,
    sendCode: async () => {},
    verifyCode: async () => {},
    signInWithGoogle: async () => {},
    signOut: async () => true,
    subscribe: (cb: (email: string | null) => void) => {
      cb(null)
      return () => {}
    },
  }))
})

afterEach(() => {
  vi.unstubAllEnvs()
})

describe('設定頁帳號區塊', () => {
  it('未設定 Supabase：沒有登入入口，顯示進度只存在本機（AC#3）', async () => {
    vi.stubEnv('VITE_SUPABASE_URL', '')
    vi.stubEnv('VITE_SUPABASE_ANON_KEY', '')
    await renderSection()
    expect(screen.getByText('未登入：進度只存在這支手機')).toBeInTheDocument()
    // 入口在動態載入後才出現：等足時間仍找不到才算「沒有」
    await expect(screen.findByTestId('login-entry', {}, { timeout: 1000 })).rejects.toThrow()
  })

  it('有設定 Supabase：出現登入入口，點開後是 Email 表單（自架者預設不變）', async () => {
    vi.stubEnv('VITE_SUPABASE_URL', 'http://127.0.0.1:55421')
    vi.stubEnv('VITE_SUPABASE_ANON_KEY', 'anon-key')
    await renderSection()
    fireEvent.click(await screen.findByTestId('login-entry'))
    expect(screen.queryByText('未登入：進度只存在這支手機')).toBeNull()
    expect(screen.getByTestId('login-email')).toBeInTheDocument()
    expect(screen.queryByTestId('login-google')).toBeNull()
  })

  it('官方站組合（Google 開、Email 關）：入口點開後只有 Google', async () => {
    vi.stubEnv('VITE_SUPABASE_URL', 'http://127.0.0.1:55421')
    vi.stubEnv('VITE_SUPABASE_ANON_KEY', 'anon-key')
    vi.stubEnv('VITE_AUTH_GOOGLE', 'true')
    vi.stubEnv('VITE_AUTH_EMAIL', 'false')
    await renderSection()
    fireEvent.click(await screen.findByTestId('login-entry'))
    expect(screen.getByTestId('login-google')).toBeInTheDocument()
    expect(screen.queryByTestId('login-email')).toBeNull()
    expect(screen.queryByText('寄驗證碼')).toBeNull()
  })

  it('沒有任何登入方式（Email 關、Google 未開）：與未設定 Supabase 相同，不建工作階段', async () => {
    vi.stubEnv('VITE_SUPABASE_URL', 'http://127.0.0.1:55421')
    vi.stubEnv('VITE_SUPABASE_ANON_KEY', 'anon-key')
    vi.stubEnv('VITE_AUTH_EMAIL', 'false')
    await renderSection()
    expect(screen.getByText('未登入：進度只存在這支手機')).toBeInTheDocument()
    await expect(screen.findByTestId('login-entry', {}, { timeout: 1000 })).rejects.toThrow()
    expect(createAuthSession).not.toHaveBeenCalled()
  })
})
