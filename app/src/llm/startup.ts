// App 啟動時（已連結才做）：用公開模型清單確認選定模型還在，下架就換回預設鏈（free-models.md §7 #6）
import type { LinguaDb } from '../data/db'
import { listModels } from './client'
import { getLink, setModel } from './keyStore'
import { availableModel } from './models'

export async function refreshModel(db: LinguaDb, fetchFn: typeof fetch = fetch): Promise<void> {
  const link = await getLink(db)
  if (!link) return
  const available = await listModels(fetchFn).then(
    (ms) => new Set(ms.map((m) => m.id)),
    () => null,
  )
  const model = availableModel(link.model, available)
  if (model !== link.model) await setModel(db, model)
}

/** OAuth 回呼失敗時留給設定頁顯示的一次性提示（跳回設定頁後讀一次就清） */
const OAUTH_FAILED = 'linguaapp.openrouter.oauthFailed'

export function markOauthFailed(storage: Storage = sessionStorage) {
  storage.setItem(OAUTH_FAILED, '1')
}

export function oauthFailed(storage: Storage = sessionStorage): boolean {
  return storage.getItem(OAUTH_FAILED) === '1'
}

export function clearOauthFailed(storage: Storage = sessionStorage) {
  storage.removeItem(OAUTH_FAILED)
}
