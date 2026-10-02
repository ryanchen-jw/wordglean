// 本機 IndexedDB（Dexie）；時間欄一律 UTC epoch ms
// 已出版的版本只能往後追加，不可就地修改（db.test.ts 以凍結 fixture 守住 v1）
import Dexie, { type EntityTable, type Transaction } from 'dexie'
import type { Level } from '../curriculum/curriculum'
import type { LessonRun } from '../lesson/run'
import type { FsrsFields, ReviewEntry } from '../srs/scheduler'

export interface Settings {
  id: 'local'
  dailyNewLimit: number
  pauseMultiplier: number
  desiredRetention: number
  /** 目前級距（分級測驗結果、跳過＝A1、設定頁手動改）；null＝未分級。無索引，Dexie 不升版；舊列缺此欄由 getSettings 補 null（TASK-17） */
  cefrLevel: Level | null
  updatedAt: number
}

/** 單字池：一字一筆；收藏＝favoritedAt 非 null，課程來源＝courseRefs */
export interface PoolWord extends FsrsFields {
  wordId: string // 暫定小寫 headword，待 TASK-6 定案
  courseRefs: string[]
  favoritedAt: number | null
  /** 收藏狀態（收藏／取消）最後修改時間；同步以最後修改者為準（TASK-16）。非索引欄位、不升版，舊資料沒有此欄 */
  favoriteUpdatedAt?: number
  addedAt: number
}

export interface ReviewLogRow extends ReviewEntry {
  id: string // uuid，同步去重用
  wordId: string
}

export interface CourseProgress {
  lessonId: string
  completedAt: number
  updatedAt: number
}

/** 跟讀紀錄：每次送出一筆；recognizedText＝辨識原文、correctedText＝使用者送出的句子（分數以送出句為準，規格 §6 G2） */
export interface SpeechCorrection {
  id: string
  itemId: string
  targetText: string
  recognizedText: string
  correctedText: string
  createdAt: number
}

/** 同步佇列：本機寫入後待推到雲端的列（表名＋主鍵）；同步成功後刪除 */
export interface OutboxEntry {
  seq?: number
  table: 'settings' | 'wordPool' | 'reviewLogs' | 'courseProgress' | 'speechCorrections'
  key: string
}

/** 同步狀態：userId（本機資料已綁定的帳號）、cursor（作答紀錄拉取游標） */
export interface SyncMeta {
  key: 'userId' | 'cursor'
  value: string | null
}

export type LinguaDb = Dexie & {
  settings: EntityTable<Settings, 'id'>
  wordPool: EntityTable<PoolWord, 'wordId'>
  reviewLogs: EntityTable<ReviewLogRow, 'id'>
  courseProgress: EntityTable<CourseProgress, 'lessonId'>
  speechCorrections: EntityTable<SpeechCorrection, 'id'>
  outbox: EntityTable<OutboxEntry, 'seq'>
  syncMeta: EntityTable<SyncMeta, 'key'>
  lessonRuns: EntityTable<LessonRun, 'lessonId'>
}

export interface SchemaVersion {
  version: number
  stores: Record<string, string | null>
  upgrade?: (tx: Transaction) => PromiseLike<unknown> | void
}

export const SCHEMA_VERSIONS: readonly SchemaVersion[] = Object.freeze<SchemaVersion[]>([
  {
    version: 1,
    stores: {
      settings: 'id',
      wordPool: 'wordId, due, state, favoritedAt',
      reviewLogs: 'id, wordId, review, [wordId+review]',
      courseProgress: 'lessonId',
      speechCorrections: 'id, createdAt',
    },
  },
  // TASK-20：登入同步的離線佇列與同步狀態
  { version: 2, stores: { outbox: '++seq', syncMeta: 'key' } },
  // TASK-12：小課進度（中途離開可續）；只存本機、不同步、不匯出
  { version: 3, stores: { lessonRuns: 'lessonId' } },
])

export const DB_NAME = 'linguaapp'

export function createDb(
  name = DB_NAME,
  versions: readonly SchemaVersion[] = SCHEMA_VERSIONS,
): LinguaDb {
  const db = new Dexie(name) as LinguaDb
  for (const v of versions) {
    const ver = db.version(v.version).stores(v.stores)
    if (v.upgrade) ver.upgrade(v.upgrade)
  }
  return db
}
