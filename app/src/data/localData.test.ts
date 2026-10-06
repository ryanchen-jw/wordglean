// @vitest-environment node
import 'fake-indexeddb/auto'
import Dexie from 'dexie'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { createDb, type LinguaDb } from './db'
import { clearLocalData, exportData } from './localData'
import { addFavorite, saveSettings } from './repo'

const T = Date.parse('2026-10-01T08:00:00Z')

let db: LinguaDb
let n = 0
beforeEach(async () => {
  db = createDb(`local-data-test-${++n}`)
  await db.open()
})
afterEach(async () => {
  db.close()
  await Dexie.delete(db.name)
})

describe('exportData', () => {
  it('匯出五張學習資料表與版本、時間', async () => {
    await saveSettings(db, { dailyNewLimit: 20 }, T)
    await addFavorite(db, 'Agenda', T)
    await db.courseProgress.put({ lessonId: 'a1-u01-l01', completedAt: T, updatedAt: T })

    const file = await exportData(db, T + 1)
    expect(file).toMatchObject({ app: 'linguaapp', schemaVersion: 5, exportedAt: T + 1 })
    expect(Object.keys(file.tables).sort()).toEqual([
      'courseProgress',
      'reviewLogs',
      'settings',
      'speechCorrections',
      'wordPool',
    ])
    expect(file.tables.settings).toMatchObject([{ id: 'local', dailyNewLimit: 20 }])
    expect(file.tables.wordPool).toMatchObject([{ wordId: 'agenda', favoritedAt: T }])
    expect(file.tables.courseProgress).toEqual([
      { lessonId: 'a1-u01-l01', completedAt: T, updatedAt: T },
    ])
    expect(file.tables.reviewLogs).toEqual([])
  })
})

describe('clearLocalData', () => {
  it('刪除整個本機資料庫', async () => {
    await addFavorite(db, 'agenda', T)
    await clearLocalData(db)
    expect(await Dexie.exists(db.name)).toBe(false)
  })
})
