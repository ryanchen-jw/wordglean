// 登入設定：自架者沒設定 Supabase 時 App 照常可用、只是沒有登入入口（規格 §3）
export interface AuthConfig {
  url: string
  anonKey: string
  google: boolean
  email: boolean
}

type Env = Record<string, string | boolean | undefined>

export function authConfigFromEnv(env: Env): AuthConfig | null {
  const url = String(env.VITE_SUPABASE_URL ?? '').trim()
  const anonKey = String(env.VITE_SUPABASE_ANON_KEY ?? '').trim()
  if (!url || !anonKey) return null
  // Google 需另申請 OAuth client（G6），預設不顯示
  const google = env.VITE_AUTH_GOOGLE === 'true'
  // Email 驗證碼預設開啟；只有明確設成 false 才關（官方站只用 Google）
  const email = env.VITE_AUTH_EMAIL !== 'false'
  // 沒有任何登入方式：等同沒設定 Supabase（不顯示入口、不建工作階段、不同步）
  if (!google && !email) return null
  return { url, anonKey, google, email }
}
