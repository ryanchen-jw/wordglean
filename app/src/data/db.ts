// 本機 IndexedDB（Dexie）；時間欄一律 UTC epoch ms
// 已出版的版本只能往後追加，不可就地修改（db.test.ts 以凍結 fixture 守住 v1）
import Dexie, { type EntityTable, type Transaction } from 'dexie'
import type { FsrsFields, ReviewEntry } from '../srs/scheduler'

export interface Settings {
  id: 'local'
  dailyNewLimit: number
  pauseMultiplier: number
  desiredRetention: number
  updatedAt: number
}

/** 單字池：一字一筆；收藏＝favoritedAt 非 null，課程來源＝courseRefs */
export interface PoolWord extends FsrsFields {
  wordId: string // 暫定小寫 headword，待 TASK-6 定案
  courseRefs: string[]
  favoritedAt: number | null
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

/** 跟讀修正：分數以辨識結果為準，使用者修正只標記「模型聽錯」（規格 §6） */
export interface SpeechCorrection {
  id: string
  itemId: string
  targetText: string
  recognizedText: string
  correctedText: string
  createdAt: number
}

export type LinguaDb = Dexie & {
  settings: EntityTable<Settings, 'id'>
  wordPool: EntityTable<PoolWord, 'wordId'>
  reviewLogs: EntityTable<ReviewLogRow, 'id'>
  courseProgress: EntityTable<CourseProgress, 'lessonId'>
  speechCorrections: EntityTable<SpeechCorrection, 'id'>
}

export interface SchemaVersion {
  version: number
  stores: Record<string, string | null>
  upgrade?: (tx: Transaction) => PromiseLike<unknown> | void
}

export const SCHEMA_VERSIONS: readonly SchemaVersion[] = Object.freeze([
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
