// @vitest-environment jsdom
import 'fake-indexeddb/auto'
import Dexie from 'dexie'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { createDb, type LinguaDb } from '../data/db'
import { addFavorite, addFromCourse, recordReview, saveSettings } from '../data/repo'
import { Grade } from '../srs/scheduler'
import { AccountMismatchError, createSyncEngine, startAutoSync } from './engine'
import type { SyncSnapshot } from './merge'
import type { RemoteStore } from './remote'

const MIN = 60_000
const DAY = 86_400_000
const T = Date.parse('2026-10-01T08:00:00Z')
const USER = 'user-1'

/**
 * 假雲端：行為照 Supabase 實作——upsert 覆寫、作答紀錄與跟讀修正以 id 去重、
 * 收藏只會被設上不會被推空（推 null 不清雲端收藏）、作答紀錄依寫入順序給游標
 */
class FakeRemote implements RemoteStore {
  user: string | null = USER
  failNext = false
  pulls: (string | null)[] = []
  onPull: (() => Promise<void>) | null = null
  settings: SyncSnapshot['settings'] = null
  words = new Map<string, SyncSnapshot['words'][number]>()
  logs: { seq: number; log: SyncSnapshot['reviewLogs'][number] }[] = []
  progress = new Map<string, SyncSnapshot['courseProgress'][number]>()
  speech = new Map<string, SyncSnapshot['speechCorrections'][number]>()

  async userId() {
    return this.user
  }

  async pull(cursor: string | null) {
    this.pulls.push(cursor)
    if (this.failNext) {
      this.failNext = false
      throw new Error('offline')
    }
    await this.onPull?.()
    const since = cursor === null ? 0 : Number(cursor)
    const fresh = this.logs.filter((l) => l.seq > since).map((l) => l.log)
    const snapshot: SyncSnapshot = structuredClone({
      settings: this.settings,
      words: [...this.words.values()],
      reviewLogs: fresh,
      courseProgress: [...this.progress.values()],
      speechCorrections: [...this.speech.values()],
    })
    const last = this.logs.at(-1)?.seq
    return { snapshot, cursor: last === undefined ? cursor : String(last) }
  }

  async push(c: SyncSnapshot) {
    if (this.failNext) {
      this.failNext = false
      throw new Error('offline')
    }
    c = structuredClone(c)
    if (c.settings) this.settings = c.settings
    for (const w of c.words) {
      const prev = this.words.get(w.wordId)
      this.words.set(w.wordId, { ...w, favoritedAt: w.favoritedAt ?? prev?.favoritedAt ?? null })
    }
    for (const l of c.reviewLogs) {
      if (!this.logs.some((x) => x.log.id === l.id))
        this.logs.push({ seq: this.logs.length + 1, log: l })
    }
    for (const p of c.courseProgress) this.progress.set(p.lessonId, p)
    for (const s of c.speechCorrections) if (!this.speech.has(s.id)) this.speech.set(s.id, s)
  }
}

const dbs: LinguaDb[] = []
let n = 0
async function freshDb() {
  const db = createDb(`engine-test-${++n}`)
  await db.open()
  dbs.push(db)
  return db
}
afterEach(async () => {
  while (dbs.length) {
    const db = dbs.pop()!
    db.close()
    await Dexie.delete(db.name)
  }
})

const pool = async (db: LinguaDb) => db.wordPool.orderBy('wordId').toArray()
const logIds = async (db: LinguaDb) => (await db.reviewLogs.toArray()).map((l) => l.id).sort()

describe('同步引擎', () => {
  it('訪客資料在第一次同步時全部上雲，佇列清空', async () => {
    const db = await freshDb()
    const remote = new FakeRemote()
    await addFromCourse(db, 'apple', 'a1-u1-l1', T)
    await recordReview(db, 'apple', Grade.Good, T + MIN)
    await addFavorite(db, 'river', T + 2 * MIN)
    await saveSettings(db, { dailyNewLimit: 5 }, T + 3 * MIN)

    await createSyncEngine({ db, remote }).sync()

    expect([...remote.words.keys()].sort()).toEqual(['apple', 'river'])
    expect(remote.words.get('river')!.favoritedAt).toBe(T + 2 * MIN)
    expect(remote.logs).toHaveLength(1)
    expect(remote.settings).toMatchObject({ dailyNewLimit: 5, updatedAt: T + 3 * MIN })
    expect(await db.outbox.count()).toBe(0)
  })

  it('未登入時不連雲端、佇列保留', async () => {
    const db = await freshDb()
    const remote = new FakeRemote()
    remote.user = null
    await addFavorite(db, 'river', T)
    await createSyncEngine({ db, remote }).sync()
    expect(remote.pulls).toEqual([])
    expect(await db.outbox.count()).toBe(1)
  })

  it('兩裝置各自離線學習，輪流同步後兩邊單字池相同、作答紀錄齊全', async () => {
    const remote = new FakeRemote()
    const a = await freshDb()
    const b = await freshDb()
    await addFromCourse(a, 'apple', 'l1', T)
    await recordReview(a, 'apple', Grade.Good, T + MIN)
    await recordReview(a, 'apple', Grade.Good, T + 11 * MIN)
    await addFromCourse(b, 'apple', 'l2', T + 2 * MIN)
    await recordReview(b, 'apple', Grade.Again, T + 3 * MIN)
    await addFavorite(b, 'stone', T + 4 * MIN)

    const ea = createSyncEngine({ db: a, remote })
    const eb = createSyncEngine({ db: b, remote })
    await ea.sync()
    await eb.sync()
    await ea.sync()

    expect(await pool(a)).toEqual(await pool(b))
    expect(await logIds(a)).toEqual(await logIds(b))
    expect(await logIds(a)).toHaveLength(3)
    const apple = (await pool(a))[0]
    expect(apple).toMatchObject({ courseRefs: ['l1', 'l2'], reps: 3, lastReview: T + 11 * MIN })
  })

  it('斷線時同步失敗、佇列保留；恢復後補推', async () => {
    const db = await freshDb()
    const remote = new FakeRemote()
    const engine = createSyncEngine({ db, remote })
    await addFavorite(db, 'river', T)
    remote.failNext = true
    await expect(engine.sync()).rejects.toThrow('offline')
    expect(await db.outbox.count()).toBe(1)
    expect(remote.words.size).toBe(0)

    await engine.sync()
    expect(remote.words.has('river')).toBe(true)
    expect(await db.outbox.count()).toBe(0)
  })

  it('作答紀錄只拉游標之後的；游標＝上次拉到的最後一筆（自己推的下一輪才拉到，以 id 去重）', async () => {
    const db = await freshDb()
    const remote = new FakeRemote()
    const engine = createSyncEngine({ db, remote })
    await addFromCourse(db, 'apple', 'l1', T)
    await recordReview(db, 'apple', Grade.Good, T + MIN)
    await engine.sync() // 拉到 0 筆、推上 seq 1
    await recordReview(db, 'apple', Grade.Good, T + 11 * MIN)
    await engine.sync() // 拉到 seq 1、推上 seq 2
    await engine.sync()
    expect(remote.pulls).toEqual([null, null, '1'])
    expect(await db.reviewLogs.count()).toBe(2)
  })

  it('同步途中（等雲端回應時）的新作答不會被覆蓋，下次同步推上去', async () => {
    const db = await freshDb()
    const remote = new FakeRemote()
    const engine = createSyncEngine({ db, remote })
    await addFromCourse(db, 'apple', 'l1', T)
    await engine.sync()

    remote.onPull = async () => {
      remote.onPull = null
      await recordReview(db, 'apple', Grade.Good, T + DAY)
    }
    await engine.sync()
    expect((await db.wordPool.get('apple'))!.lastReview).toBe(T + DAY)
    await engine.sync()
    expect(remote.logs).toHaveLength(1)
    expect(await db.outbox.count()).toBe(0)
  })

  it('同時多次要求同步只排一次後續，不並行', async () => {
    const db = await freshDb()
    const remote = new FakeRemote()
    const engine = createSyncEngine({ db, remote })
    await Promise.all([engine.sync(), engine.sync(), engine.sync()])
    expect(remote.pulls).toHaveLength(2)
  })

  it('本機資料已同步給帳號 X，改以帳號 Y 登入：拒絕同步，不拉不推、本機不動', async () => {
    const db = await freshDb()
    const remote = new FakeRemote()
    await addFavorite(db, 'river', T)
    await createSyncEngine({ db, remote }).sync()
    await addFavorite(db, 'stone', T + MIN) // X 的未推資料也不可流到 Y

    const other = new FakeRemote()
    other.user = 'user-2'
    const engine = createSyncEngine({ db, remote: other })
    await expect(engine.sync()).rejects.toBeInstanceOf(AccountMismatchError)
    expect(other.pulls).toEqual([])
    expect(other.words.size).toBe(0)
    expect((await db.wordPool.toArray()).map((w) => w.wordId).sort()).toEqual(['river', 'stone'])
    expect((await db.syncMeta.get('userId'))?.value).toBe(USER)
    expect(await engine.flushAndClear()).toBe(false)
    expect(await db.wordPool.count()).toBe(2)
  })

  it('從未同步過的訪客資料：任何帳號首次登入照舊合併上雲', async () => {
    const db = await freshDb()
    const remote = new FakeRemote()
    remote.user = 'user-2'
    await addFavorite(db, 'river', T)
    await createSyncEngine({ db, remote }).sync()
    expect(remote.words.has('river')).toBe(true)
    expect((await db.syncMeta.get('userId'))?.value).toBe('user-2')
  })

  it('登出：推完佇列後清空本機，回傳 true', async () => {
    const db = await freshDb()
    const remote = new FakeRemote()
    await addFavorite(db, 'river', T)
    expect(await createSyncEngine({ db, remote }).flushAndClear()).toBe(true)
    expect(remote.words.has('river')).toBe(true)
    for (const t of db.tables) expect(await t.count()).toBe(0)
  })

  it('登出：推不出去時不清本機，回傳 false', async () => {
    const db = await freshDb()
    const remote = new FakeRemote()
    await addFavorite(db, 'river', T)
    remote.failNext = true
    expect(await createSyncEngine({ db, remote }).flushAndClear()).toBe(false)
    expect(await db.wordPool.count()).toBe(1)
    expect(await db.outbox.count()).toBe(1)
  })
})

describe('自動同步時機', () => {
  it('回到前景、恢復連線時要求同步；切到背景不同步', () => {
    const requestSync = vi.fn()
    const stop = startAutoSync({ requestSync }, window)
    let visibility: DocumentVisibilityState = 'hidden'
    vi.spyOn(document, 'visibilityState', 'get').mockImplementation(() => visibility)

    document.dispatchEvent(new Event('visibilitychange'))
    expect(requestSync).toHaveBeenCalledTimes(0)
    visibility = 'visible'
    document.dispatchEvent(new Event('visibilitychange'))
    expect(requestSync).toHaveBeenCalledTimes(1)
    window.dispatchEvent(new Event('online'))
    expect(requestSync).toHaveBeenCalledTimes(2)

    stop()
    window.dispatchEvent(new Event('online'))
    expect(requestSync).toHaveBeenCalledTimes(2)
  })
})
