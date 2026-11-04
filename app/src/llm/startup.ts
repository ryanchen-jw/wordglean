// App 啟動時（已連結才做）：用公開模型清單確認選定模型還在，下架就換回預設鏈（free-models.md §7 #6）
import type { LinguaDb } from '../data/db'
import { listModels } from './client'
import { getLink, setModel } from './keyStore'
import { availableModel } from './models'

const STALE_MS = 3_600_000

let lastList: ReadonlySet<string> | null = null
let lastListAt: number | null = null

/** 最近一次拿到的模型清單（批改組 models 陣列用）；還沒拿到為 null */
export const knownModels = () => lastList

export async function refreshModel(
  db: LinguaDb,
  fetchFn: typeof fetch = fetch,
  nowMs = Date.now(),
): Promise<void> {
  const link = await getLink(db)
  if (!link) return
  const available = await listModels(fetchFn).then(
    (ms) => new Set(ms.map((m) => m.id)),
    () => null,
  )
  if (available) {
    lastList = available
    lastListAt = nowMs
  }
  const model = availableModel(link.model, available)
  if (model !== link.model) await setModel(db, model)
}

/** App 開著回到前景時用：手機上 PWA 可連開數天，距上次成功檢查滿一小時才重查 */
export async function refreshModelIfStale(
  db: LinguaDb,
  nowMs = Date.now(),
  fetchFn: typeof fetch = fetch,
): Promise<void> {
  if (lastListAt !== null && nowMs - lastListAt < STALE_MS) return
  await refreshModel(db, fetchFn, nowMs)
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
