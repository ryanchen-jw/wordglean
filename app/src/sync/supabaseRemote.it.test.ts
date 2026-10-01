// @vitest-environment node
// 對本機 Supabase 的整合測試（真 PostgREST＋RLS）；未設環境變數時略過，CI 不跑。
// 跑法（repo 根先 supabase start）：
//   LINGUA_IT_SUPABASE_URL=http://127.0.0.1:55421 LINGUA_IT_ANON_KEY=… LINGUA_IT_SERVICE_KEY=… npx vitest run src/sync/supabaseRemote.it.test.ts
import 'fake-indexeddb/auto'
import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import Dexie from 'dexie'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { createDb, type LinguaDb } from '../data/db'
import { addFavorite, addFromCourse, recordReview, saveSettings } from '../data/repo'
import { Grade } from '../srs/scheduler'
import { createSyncEngine } from './engine'
import { createSupabaseRemote } from './supabaseRemote'

declare const process: { env: Record<string, string | undefined> }

const URL = process.env.LINGUA_IT_SUPABASE_URL
const ANON = process.env.LINGUA_IT_ANON_KEY
const SERVICE = process.env.LINGUA_IT_SERVICE_KEY
const MIN = 60_000
const T = Date.parse('2026-10-01T08:00:00Z')

describe.skipIf(!URL || !ANON || !SERVICE)('Supabase 同步（本機整合）', () => {
  const email = `it-${Date.now()}@test.local`
  const password = 'it-password-123456'
  let admin: SupabaseClient
  let userId: string
  const dbs: LinguaDb[] = []

  const signedIn = async () => {
    const c = createClient(URL!, ANON!, { auth: { persistSession: false } })
    const { error } = await c.auth.signInWithPassword({ email, password })
    if (error) throw error
    return c
  }
  const freshDb = async (name: string) => {
    const db = createDb(`it-${name}-${Date.now()}`)
    await db.open()
    dbs.push(db)
    return db
  }

  beforeAll(async () => {
    admin = createClient(URL!, SERVICE!, { auth: { persistSession: false } })
    const { data, error } = await admin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    })
    if (error) throw error
    userId = data.user.id
  })

  afterAll(async () => {
    for (const db of dbs) {
      db.close()
      await Dexie.delete(db.name)
    }
    if (userId) await admin.auth.admin.deleteUser(userId)
  })

  it('兩裝置各自離線學習後輪流同步：兩邊單字池相同、雲端資料齊全', async () => {
    const a = await freshDb('a')
    const b = await freshDb('b')
    await addFromCourse(a, 'apple', 'l1', T)
    await recordReview(a, 'apple', Grade.Good, T + MIN)
    await recordReview(a, 'apple', Grade.Good, T + 11 * MIN)
    await saveSettings(a, { dailyNewLimit: 7 }, T + 12 * MIN)
    await addFromCourse(b, 'apple', 'l2', T + 2 * MIN)
    await recordReview(b, 'apple', Grade.Again, T + 3 * MIN)
    await addFavorite(b, 'stone', T + 4 * MIN)

    const ea = createSyncEngine({ db: a, remote: createSupabaseRemote(await signedIn()) })
    const eb = createSyncEngine({ db: b, remote: createSupabaseRemote(await signedIn()) })
    await ea.sync()
    await eb.sync()
    await ea.sync()
    await eb.sync() // 再跑一輪：重推與游標重疊都不應出錯或重複

    const poolA = await a.wordPool.orderBy('wordId').toArray()
    expect(poolA).toEqual(await b.wordPool.orderBy('wordId').toArray())
    expect(poolA.map((w) => w.wordId)).toEqual(['apple', 'stone'])
    expect(poolA[0]).toMatchObject({ courseRefs: ['l1', 'l2'], reps: 3, lastReview: T + 11 * MIN })
    expect(poolA[1].favoritedAt).toBe(T + 4 * MIN)
    expect(await b.settings.get('local')).toMatchObject({ dailyNewLimit: 7 })
    expect(await a.outbox.count()).toBe(0)
    expect(await b.outbox.count()).toBe(0)

    const { count } = await admin
      .from('review_logs')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
    expect(count).toBe(3)
  })

  it('新裝置登入：從零拉回全部資料', async () => {
    const c = await freshDb('c')
    await createSyncEngine({ db: c, remote: createSupabaseRemote(await signedIn()) }).sync()
    expect((await c.wordPool.orderBy('wordId').toArray()).map((w) => w.wordId)).toEqual([
      'apple',
      'stone',
    ])
    expect(await c.reviewLogs.count()).toBe(3)
  })
})
