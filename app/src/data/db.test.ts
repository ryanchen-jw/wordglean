// @vitest-environment node
import 'fake-indexeddb/auto'
import Dexie from 'dexie'
import { afterEach, describe, expect, it } from 'vitest'
import { createDb, SCHEMA_VERSIONS, type SchemaVersion } from './db'

// v1 已出版的 schema，凍結於此；改了正式 v1 定義，守衛測試會紅（舊版只能新增版本、不可就地修改）
const V1_STORES = {
  settings: 'id',
  wordPool: 'wordId, due, state, favoritedAt',
  reviewLogs: 'id, wordId, review, [wordId+review]',
  courseProgress: 'lessonId',
  speechCorrections: 'id, createdAt',
}

const T = Date.parse('2026-10-01T08:00:00Z')

const seed = {
  settings: [
    { id: 'local', dailyNewLimit: 15, pauseMultiplier: 8, desiredRetention: 0.9, updatedAt: T },
  ],
  wordPool: [
    {
      wordId: 'apple',
      state: 2,
      due: T + 3 * 86_400_000,
      stability: 3.2,
      difficulty: 5.1,
      scheduledDays: 3,
      learningSteps: 0,
      reps: 2,
      lapses: 0,
      lastReview: T,
      courseRefs: ['a1-u1-l1'],
      favoritedAt: T,
      addedAt: T - 600_000,
    },
    {
      wordId: 'river',
      state: 0,
      due: T,
      stability: 0,
      difficulty: 0,
      scheduledDays: 0,
      learningSteps: 0,
      reps: 0,
      lapses: 0,
      lastReview: null,
      courseRefs: [],
      favoritedAt: T,
      addedAt: T,
    },
  ],
  reviewLogs: [
    {
      id: '0b8f6a52-1111-4c3e-9a7e-000000000001',
      wordId: 'apple',
      rating: 3,
      state: 0,
      due: T - 600_000,
      stability: 0,
      difficulty: 0,
      scheduledDays: 0,
      learningSteps: 0,
      review: T - 600_000,
    },
  ],
  courseProgress: [{ lessonId: 'a1-u1-l1', completedAt: T, updatedAt: T }],
  speechCorrections: [
    {
      id: '0b8f6a52-2222-4c3e-9a7e-000000000002',
      itemId: 'a1-u1-l1-q3',
      targetText: 'I like apples.',
      recognizedText: 'I like apple.',
      correctedText: 'I like apples.',
      createdAt: T,
    },
  ],
} as const

const TABLES = Object.keys(seed) as (keyof typeof seed)[]

let n = 0
const names: string[] = []
const freshName = () => {
  const name = `test-db-${++n}`
  names.push(name)
  return name
}

afterEach(async () => {
  while (names.length) await Dexie.delete(names.pop()!)
})

async function seedAtV1(name: string) {
  const raw = new Dexie(name)
  raw.version(1).stores(V1_STORES)
  await raw.open()
  for (const t of TABLES) await raw.table(t).bulkAdd([...seed[t]])
  raw.close()
}

describe('schema 版本', () => {
  it('正式 v1 定義與凍結 fixture 一致', () => {
    expect(SCHEMA_VERSIONS[0]).toMatchObject({ version: 1, stores: V1_STORES })
  })

  it('v2 只追加同步用的兩張表', () => {
    expect(SCHEMA_VERSIONS[1]).toEqual({
      version: 2,
      stores: { outbox: '++seq', syncMeta: 'key' },
    })
  })

  it('全新開啟後各表可用', async () => {
    const db = createDb(freshName())
    await db.open()
    expect(db.tables.map((t) => t.name).sort()).toEqual([...TABLES, 'outbox', 'syncMeta'].sort())
    db.close()
  })
})

describe('migration：升版不掉資料', () => {
  // 測試專用的下一版：新增複合索引與一張表，並在 upgrade 動既有列
  const NEXT = SCHEMA_VERSIONS.length + 1
  const V2: SchemaVersion = {
    version: NEXT,
    stores: { wordPool: 'wordId, due, state, favoritedAt, [state+due]', notes: '++id' },
    upgrade: (tx) =>
      tx
        .table('settings')
        .toCollection()
        .modify((s) => {
          s.migratedToV2 = true
        }),
  }

  it('v1 寫入的全部資料在下一版開啟後原樣保留', async () => {
    const name = freshName()
    await seedAtV1(name)

    const db = createDb(name, [...SCHEMA_VERSIONS, V2])
    await db.open()
    expect(db.verno).toBe(NEXT)
    for (const t of TABLES) {
      const rows = await db.table(t).toArray()
      const expected =
        t === 'settings' ? seed.settings.map((s) => ({ ...s, migratedToV2: true })) : seed[t]
      expect(rows).toEqual(expected)
    }
    // 新索引可查
    const reviewing = await db
      .table('wordPool')
      .where('[state+due]')
      .between([2, 0], [2, Infinity])
      .toArray()
    expect(reviewing.map((w) => w.wordId)).toEqual(['apple'])
    db.close()
  })

  it('正式 createDb 以目前版本開啟既有 v1 資料不變', async () => {
    const name = freshName()
    await seedAtV1(name)
    const db = createDb(name)
    await db.open()
    for (const t of TABLES) expect(await db.table(t).toArray()).toEqual(seed[t])
    db.close()
  })
})
