// OpenRouter 連結（金鑰＋選定模型）：只存這支手機的 IndexedDB（secrets 表），不同步、不匯出（規格 §2、§6）
import type { LinguaDb, SecretRow } from '../data/db'
import { DEFAULT_MODELS } from './models'

export type OpenRouterLink = SecretRow

const KEY = 'openrouter'

/** 金鑰格式：OpenRouter 金鑰以 sk-or- 開頭（設計 s11-keyerr 錯誤文案同此規則） */
export function looksLikeKey(text: string): boolean {
  return /^sk-or-[A-Za-z0-9-_]{8,}$/.test(text.trim())
}

export async function getLink(db: LinguaDb): Promise<OpenRouterLink | null> {
  return (await db.secrets.get(KEY)) ?? null
}

/** 存入新金鑰；已選過的模型保留，第一次連結用預設模型 */
export async function saveLink(
  db: LinguaDb,
  apiKey: string,
  via: OpenRouterLink['via'],
  nowMs: number,
): Promise<OpenRouterLink> {
  const prev = await getLink(db)
  const link: OpenRouterLink = {
    key: KEY,
    apiKey: apiKey.trim(),
    model: prev?.model ?? DEFAULT_MODELS[0],
    via,
    linkedAt: nowMs,
  }
  await db.secrets.put(link)
  return link
}

export async function setModel(db: LinguaDb, model: string): Promise<void> {
  await db.secrets.update(KEY, { model })
}

/** 解除連結：刪掉金鑰與模型選擇 */
export async function clearLink(db: LinguaDb): Promise<void> {
  await db.secrets.delete(KEY)
}
