// 登入／帳號最小 UI（TASK-20）；外殼與擺放位置由 TASK-11 決定
// 樣式依 docs/design/v1.0/components.md（按鈕、共通規則），用 --lg-* token 的 Tailwind 類別
// TODO(TASK-11)：按下時底色加深一階、錯誤訊息的圖示，待共用 Button／lucide-react 元件
import { useEffect, useState, type FormEvent } from 'react'
import type { AuthApi } from './session'

// 共通：鍵盤焦點外框、按下縮放（減少動態效果時不縮放）
const interactive =
  'focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-focus transition-transform duration-(--lg-duration-press) active:scale-(--lg-press-scale) motion-reduce:transition-none motion-reduce:active:scale-100'
const primary = `${interactive} h-[52px] w-full rounded-control bg-primary font-bold text-on-primary disabled:bg-disabled-bg disabled:text-disabled-text`
const secondary = `${interactive} h-[52px] w-full rounded-control border border-border bg-surface text-primary disabled:border-disabled-text disabled:text-disabled-text`
const textBtn = `${interactive} h-11 text-primary`
const field =
  'h-[52px] w-full rounded-control border border-border bg-surface px-4 text-body text-text focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-focus'

export function AccountPanel({ auth }: { auth: AuthApi }) {
  const [email, setEmail] = useState<string | null>(null)
  const [open, setOpen] = useState(false)
  const [step, setStep] = useState<'email' | 'code'>('email')
  const [address, setAddress] = useState('')
  const [code, setCode] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState(false)
  const [warning, setWarning] = useState(false)
  const [blocked, setBlocked] = useState(false)

  useEffect(
    () =>
      auth.subscribe((next, notice) => {
        setEmail(next)
        if (notice === 'account-mismatch') setBlocked(true)
      }),
    [auth],
  )

  async function run(action: () => Promise<void>) {
    setBusy(true)
    setError(false)
    try {
      await action()
    } catch {
      setError(true)
    } finally {
      setBusy(false)
    }
  }

  const send = (e: FormEvent) => {
    e.preventDefault()
    const to = address.trim()
    void run(async () => {
      await auth.sendCode(to)
      setAddress(to)
      setStep('code')
    })
  }

  const verify = (e: FormEvent) => {
    e.preventDefault()
    void run(async () => {
      await auth.verifyCode(address, code.trim())
      setOpen(false)
      setStep('email')
      setCode('')
    })
  }

  const logout = () =>
    void run(async () => {
      setWarning(!(await auth.signOut()))
    })

  if (email) {
    return (
      <section className="flex w-full flex-col gap-3">
        {/* TODO(TASK-4 文案) */}
        <p className="wrap-anywhere">
          已登入：<span data-testid="account-email">{email}</span>
        </p>
        {warning && (
          // TODO(TASK-4 文案)
          <p data-testid="logout-warning" role="alert" className="text-error">
            還有資料沒同步到雲端，連上網路後再登出。
          </p>
        )}
        <button
          type="button"
          data-testid="logout"
          className={secondary}
          disabled={busy}
          aria-busy={busy}
          onClick={logout}
        >
          {/* TODO(TASK-4 文案) */}
          登出
        </button>
      </section>
    )
  }

  if (!open) {
    return (
      <section className="flex w-full flex-col items-center gap-3">
        {blocked && (
          // TODO(TASK-4 文案)
          <p data-testid="login-blocked" role="alert" className="text-error">
            這支手機上有另一個帳號的學習資料。請先用原帳號登入並登出，或到設定清除這支手機上的資料。
          </p>
        )}
        <button
          type="button"
          data-testid="login-entry"
          className={textBtn}
          onClick={() => {
            setBlocked(false)
            setOpen(true)
          }}
        >
          {/* TODO(TASK-4 文案) */}› 登入以同步進度
        </button>
      </section>
    )
  }

  // 錯誤訊息放在觸發它的輸入框正下方（components.md 共通規則）；TODO(TASK-11)：錯誤圖示
  const errorText = error && (
    // TODO(TASK-4 文案)
    <p id="login-error" data-testid="login-error" role="alert" className="text-error">
      沒有成功，請再試一次。
    </p>
  )

  return (
    <section className="flex w-full flex-col gap-3">
      {step === 'email' ? (
        <form className="flex flex-col gap-3" onSubmit={send}>
          {/* TODO(TASK-4 文案) */}
          <label htmlFor="login-email">Email</label>
          <input
            id="login-email"
            data-testid="login-email"
            type="email"
            autoComplete="email"
            required
            aria-describedby={error ? 'login-error' : undefined}
            className={field}
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
          {errorText}
          <button
            type="submit"
            data-testid="login-send"
            className={primary}
            disabled={busy}
            aria-busy={busy}
          >
            {/* TODO(TASK-4 文案) */}
            {busy ? '處理中…' : '寄驗證碼'}
          </button>
        </form>
      ) : (
        <form className="flex flex-col gap-3" onSubmit={verify}>
          {/* TODO(TASK-4 文案) */}
          <label htmlFor="login-code" className="wrap-anywhere">
            輸入寄到 {address} 的驗證碼
          </label>
          <input
            id="login-code"
            data-testid="login-code"
            inputMode="numeric"
            autoComplete="one-time-code"
            required
            aria-describedby={error ? 'login-error' : undefined}
            className={field}
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />
          {errorText}
          <button
            type="submit"
            data-testid="login-verify"
            className={primary}
            disabled={busy}
            aria-busy={busy}
          >
            {/* TODO(TASK-4 文案) */}
            {busy ? '處理中…' : '登入'}
          </button>
          <button type="button" className={textBtn} onClick={() => setStep('email')}>
            {/* TODO(TASK-4 文案) */}
            重新輸入 Email
          </button>
        </form>
      )}
      {auth.google && step === 'email' && (
        <button
          type="button"
          data-testid="login-google"
          className={secondary}
          disabled={busy}
          aria-busy={busy}
          onClick={() => void run(auth.signInWithGoogle)}
        >
          {/* TODO(TASK-4 文案) */}
          使用 Google 登入
        </button>
      )}
    </section>
  )
}
