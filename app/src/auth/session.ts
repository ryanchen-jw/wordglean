// 登入工作階段：Supabase Auth＋同步引擎接線。由 AccountEntry 動態載入（獨立 chunk，不在首屏主檔）
import { createClient } from '@supabase/supabase-js'
import type { LinguaDb } from '../data/db'
import { AccountMismatchError, createSyncEngine, startAutoSync } from '../sync/engine'
import { createSupabaseRemote } from '../sync/supabaseRemote'
import type { AuthConfig } from './config'

export interface AuthApi {
  google: boolean
  email: boolean
  sendCode(email: string): Promise<void>
  verifyCode(email: string, code: string): Promise<void>
  signInWithGoogle(): Promise<void>
  /** 先推完佇列再清本機並登出；推不出去回傳 false、維持登入 */
  signOut(): Promise<boolean>
  /**
   * 帳號 email 變化（未登入為 null）；回傳解除訂閱。
   * notice＝'account-mismatch'：本機資料屬於另一個帳號，剛登入的帳號已被登出、未同步
   */
  subscribe(cb: (email: string | null, notice?: 'account-mismatch') => void): () => void
  /** 不等結果的同步（TASK-18：小課結算後）；未登入時不做事，失敗時資料留在佇列 */
  requestSync(): void
}

const check = async (p: Promise<{ error: unknown }>) => {
  const { error } = await p
  if (error) throw error
}

// db 由呼叫端傳入（app 全域單例屬 TASK-11）；client 依設定在此建立，Supabase 才能維持動態載入
export async function createAuthSession(config: AuthConfig, db: LinguaDb): Promise<AuthApi> {
  const client = createClient(config.url, config.anonKey)
  const engine = createSyncEngine({ db, remote: createSupabaseRemote(client) })
  startAutoSync(engine)

  return {
    google: config.google,
    email: config.email,
    sendCode: (email) =>
      check(client.auth.signInWithOtp({ email, options: { shouldCreateUser: true } })),
    verifyCode: (email, token) => check(client.auth.verifyOtp({ email, token, type: 'email' })),
    signInWithGoogle: () =>
      check(
        client.auth.signInWithOAuth({
          provider: 'google',
          // 回設定頁而非首頁：首頁不載入本模組（維持不進首屏），回首頁就沒有 client 能讀網址裡的 token
          options: { redirectTo: `${window.location.origin}/settings` },
        }),
      ),
    async signOut() {
      if (!(await engine.flushAndClear())) return false
      await check(client.auth.signOut())
      return true
    },
    requestSync: () => engine.requestSync(),
    subscribe(cb) {
      const { data } = client.auth.onAuthStateChange((event, session) => {
        cb(session?.user.email ?? null)
        // 登入當下、開啟時已登入：同步一次。延到回呼之外再呼叫 auth API（回呼內呼叫可能互鎖）
        if (session && (event === 'SIGNED_IN' || event === 'INITIAL_SESSION')) {
          setTimeout(() => {
            engine.sync().catch(async (e) => {
              // 其他失敗（離線等）資料留在佇列，下次再推
              if (!(e instanceof AccountMismatchError)) return
              await client.auth.signOut()
              cb(null, 'account-mismatch')
            })
          })
        }
      })
      return () => data.subscription.unsubscribe()
    },
  }
}
