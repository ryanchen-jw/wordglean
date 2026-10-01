// 登入設定：自架者沒設定 Supabase 時 App 照常可用、只是沒有登入入口（規格 §3）
export interface AuthConfig {
  url: string
  anonKey: string
  google: boolean
}

type Env = Record<string, string | boolean | undefined>

export function authConfigFromEnv(env: Env): AuthConfig | null {
  const url = String(env.VITE_SUPABASE_URL ?? '').trim()
  const anonKey = String(env.VITE_SUPABASE_ANON_KEY ?? '').trim()
  if (!url || !anonKey) return null
  // Google 需另申請 OAuth client（G6），預設不顯示
  return { url, anonKey, google: env.VITE_AUTH_GOOGLE === 'true' }
}
