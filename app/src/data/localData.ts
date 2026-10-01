// 設定頁「資料」區：匯出學習紀錄、清除這支手機上的資料（設計 s11／s13）
import type { LinguaDb } from './db'

// 學習資料表；同步用的內部表（TASK-20）不匯出
const LEARNING_TABLES = [
  'settings',
  'wordPool',
  'reviewLogs',
  'courseProgress',
  'speechCorrections',
] as const

export interface ExportFile {
  app: 'linguaapp'
  schemaVersion: number
  exportedAt: number
  tables: Record<(typeof LEARNING_TABLES)[number], unknown[]>
}

export async function exportData(db: LinguaDb, nowMs: number): Promise<ExportFile> {
  const rows = await Promise.all(LEARNING_TABLES.map((name) => db.table(name).toArray()))
  return {
    app: 'linguaapp',
    schemaVersion: db.verno,
    exportedAt: nowMs,
    tables: Object.fromEntries(
      LEARNING_TABLES.map((name, i) => [name, rows[i]]),
    ) as ExportFile['tables'],
  }
}

/** 刪掉整個本機資料庫（含同步佇列）；呼叫端隨後重新載入 App */
export async function clearLocalData(db: LinguaDb): Promise<void> {
  await db.delete()
}
