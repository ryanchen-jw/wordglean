// 共用登入工作階段（TASK-18 D2）：設定頁帳號區塊與小課結算後同步共用同一個 AuthApi，
// 不必先開過設定頁也能同步；Supabase 與同步程式仍在 session 動態載入（不在首屏主檔）
import type { LinguaDb } from '../data/db'
import type { AuthConfig } from './config'
import type { AuthApi } from './session'

let pending: Promise<AuthApi> | null = null

export function getAuthSession(config: AuthConfig, db: LinguaDb): Promise<AuthApi> {
  if (!pending) {
    const created = import('./session').then((m) => m.createAuthSession(config, db))
    created.catch(() => {
      if (pending === created) pending = null
    })
    pending = created
  }
  return pending
}

/** 小課結算後：有設定登入才要求同步（不等結果；未登入或失敗時資料留在本機佇列） */
export function syncAfterSettle(config: AuthConfig | null, db: LinguaDb): void {
  if (!config) return
  getAuthSession(config, db).then(
    (auth) => auth.requestSync(),
    () => {},
  )
}
