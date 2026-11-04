// 首頁判斷登入狀態（TASK-28）：直接讀 supabase-js 存在 localStorage 的 session，只讀不寫，不載入 supabase-js（維持不進首屏）。
// 鍵名與格式跟著 createClient 的預設值（session.ts 沒有自訂 storageKey），signedInAccount.test.ts 以真的 supabase-js 對接。
// 不驗 token 是否過期：過期但鍵還在時先顯示已登入，由設定頁的 supabase-js 續期或清除
import type { AuthConfig } from './config'

export interface SignedInAccount {
  /** 頭像顯示的首字 */
  initial: string
  /** 無障礙文案用的帳號文字：email，沒有時用名字 */
  identity: string
}

const text = (v: unknown) => (typeof v === 'string' ? v.trim() : '')

// 依字素切，emoji 與組合字元才不會被切壞
const firstChar = (s: string) =>
  new Intl.Segmenter().segment(s)[Symbol.iterator]().next().value!.segment

function parseAccount(raw: string): SignedInAccount | null {
  const s = JSON.parse(raw)
  if (!s || !('access_token' in s && 'refresh_token' in s && 'expires_at' in s)) return null
  const name = text(s.user?.user_metadata?.full_name) || text(s.user?.user_metadata?.name)
  const email = text(s.user?.email)
  if (!name && !email) return null
  return {
    initial: name ? firstChar(name) : firstChar(email).toUpperCase(),
    identity: email || name,
  }
}

/** 沒設定登入、沒有 session、內容壞掉、localStorage 不能用，一律回 null（視同未登入） */
export function readSignedInAccount(
  config: Pick<AuthConfig, 'url'> | null,
  getStorage: () => Pick<Storage, 'getItem'> = () => localStorage,
): SignedInAccount | null {
  if (!config) return null
  try {
    const ref = new URL(config.url).hostname.split('.')[0]
    const raw = getStorage().getItem(`sb-${ref}-auth-token`)
    return raw === null ? null : parseAccount(raw)
  } catch {
    return null
  }
}
