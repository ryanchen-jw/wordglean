import { act, fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { AccountPanel } from './AccountPanel'
import type { AuthApi } from './session'

function fakeAuth(over: Partial<AuthApi> = {}) {
  let listener: Parameters<AuthApi['subscribe']>[0] = () => {}
  const auth: AuthApi = {
    google: false,
    sendCode: vi.fn(async () => {}),
    verifyCode: vi.fn(async () => {}),
    signInWithGoogle: vi.fn(async () => {}),
    signOut: vi.fn(async () => true),
    requestSync: vi.fn(),
    subscribe: (cb) => {
      listener = cb
      cb(null)
      return () => {}
    },
    ...over,
  }
  return {
    auth,
    setUser: (email: string | null) => act(() => listener(email)),
    blockMismatch: () => act(() => listener(null, 'account-mismatch')),
  }
}

const type = (testId: string, value: string) =>
  fireEvent.change(screen.getByTestId(testId), { target: { value } })

describe('登入面板', () => {
  it('Email → 驗證碼 → 登入後顯示帳號', async () => {
    const { auth, setUser } = fakeAuth({
      verifyCode: vi.fn(async () => setUser('me@test.local')),
    })
    render(<AccountPanel auth={auth} />)

    fireEvent.click(screen.getByTestId('login-entry'))
    type('login-email', ' me@test.local ')
    fireEvent.click(screen.getByTestId('login-send'))
    expect(auth.sendCode).toHaveBeenCalledWith('me@test.local')

    await screen.findByTestId('login-code')
    type('login-code', '123456')
    fireEvent.click(screen.getByTestId('login-verify'))
    expect(auth.verifyCode).toHaveBeenCalledWith('me@test.local', '123456')

    expect(await screen.findByTestId('account-email')).toHaveTextContent('me@test.local')
    expect(screen.queryByTestId('login-entry')).not.toBeInTheDocument()
  })

  it('寄送失敗時顯示錯誤、停在 Email 步驟', async () => {
    const { auth } = fakeAuth({ sendCode: vi.fn(async () => Promise.reject(new Error('x'))) })
    render(<AccountPanel auth={auth} />)
    fireEvent.click(screen.getByTestId('login-entry'))
    type('login-email', 'me@test.local')
    fireEvent.click(screen.getByTestId('login-send'))
    expect(await screen.findByTestId('login-error')).toBeInTheDocument()
    expect(screen.queryByTestId('login-code')).not.toBeInTheDocument()
  })

  it('錯誤訊息緊接在 Email 輸入框之後；寄送中按鈕標 aria-busy', async () => {
    let fail: (e: Error) => void = () => {}
    const { auth } = fakeAuth({
      sendCode: vi.fn(() => new Promise<void>((_, rej) => (fail = rej))),
    })
    render(<AccountPanel auth={auth} />)
    fireEvent.click(screen.getByTestId('login-entry'))
    type('login-email', 'me@test.local')
    fireEvent.click(screen.getByTestId('login-send'))
    expect(screen.getByTestId('login-send')).toHaveAttribute('aria-busy', 'true')
    await act(async () => fail(new Error('x')))
    expect(screen.getByTestId('login-send')).toHaveAttribute('aria-busy', 'false')
    expect(screen.getByTestId('login-email').nextElementSibling).toBe(
      screen.getByTestId('login-error'),
    )
  })

  it('Google 按鈕只在設定開啟時出現', () => {
    const off = fakeAuth()
    const { unmount } = render(<AccountPanel auth={off.auth} />)
    fireEvent.click(screen.getByTestId('login-entry'))
    expect(screen.queryByTestId('login-google')).not.toBeInTheDocument()
    unmount()

    const on = fakeAuth({ google: true })
    render(<AccountPanel auth={on.auth} />)
    fireEvent.click(screen.getByTestId('login-entry'))
    fireEvent.click(screen.getByTestId('login-google'))
    expect(on.auth.signInWithGoogle).toHaveBeenCalled()
  })

  it('登出成功：回到未登入', async () => {
    const { auth, setUser } = fakeAuth({ signOut: vi.fn(async () => (setUser(null), true)) })
    render(<AccountPanel auth={auth} />)
    setUser('me@test.local')
    fireEvent.click(screen.getByTestId('logout'))
    expect(await screen.findByTestId('login-entry')).toBeInTheDocument()
  })

  it('換帳號被擋：回到未登入並顯示說明；重新點登入時說明消失', async () => {
    const { auth, setUser, blockMismatch } = fakeAuth()
    render(<AccountPanel auth={auth} />)
    setUser('y@test.local')
    blockMismatch()
    expect(screen.getByTestId('login-blocked')).toBeInTheDocument()
    expect(screen.queryByTestId('account-email')).not.toBeInTheDocument()
    fireEvent.click(screen.getByTestId('login-entry'))
    expect(screen.queryByTestId('login-blocked')).not.toBeInTheDocument()
  })

  it('登出時資料推不出去：顯示警告、維持登入', async () => {
    const { auth, setUser } = fakeAuth({ signOut: vi.fn(async () => false) })
    render(<AccountPanel auth={auth} />)
    setUser('me@test.local')
    fireEvent.click(screen.getByTestId('logout'))
    expect(await screen.findByTestId('logout-warning')).toBeInTheDocument()
    expect(screen.getByTestId('account-email')).toBeInTheDocument()
  })
})
