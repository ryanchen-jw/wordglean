// @vitest-environment jsdom
// 登入接線：以假的 Supabase client 驗「換帳號時不同步、把新帳號登出」與「訪客首次登入照常同步」
import 'fake-indexeddb/auto'
import Dexie from 'dexie'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { createDb, type LinguaDb } from '../data/db'
import { addFavorite } from '../data/repo'

type Listener = (event: string, session: { user: { id: string; email: string } } | null) => void

const fake = vi.hoisted(() => ({
  listener: null as Listener | null,
  userId: 'user-y',
  signOut: null as unknown as ReturnType<typeof vi.fn>,
  from: null as unknown as ReturnType<typeof vi.fn>,
  signInWithOAuth: null as unknown as ReturnType<typeof vi.fn>,
}))

vi.mock('@supabase/supabase-js', () => ({
  createClient: () => ({
    auth: {
      getSession: async () => ({
        data: { session: { user: { id: fake.userId, email: 'y@test.local' } } },
      }),
      onAuthStateChange: (cb: Listener) => {
        fake.listener = cb
        return { data: { subscription: { unsubscribe() {} } } }
      },
      signOut: fake.signOut,
      signInWithOAuth: fake.signInWithOAuth,
    },
    from: fake.from,
  }),
}))

const { createAuthSession } = await import('./session')

const dbs: LinguaDb[] = []
let n = 0
async function freshDb() {
  const db = createDb(`session-test-${++n}`)
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

const config = { url: 'http://127.0.0.1:55421', anonKey: 'anon', google: false, email: true }
const signedInAsY = { user: { id: 'user-y', email: 'y@test.local' } }

function reset() {
  fake.listener = null
  fake.signOut = vi.fn(async () => {
    fake.listener?.('SIGNED_OUT', null)
    return { error: null }
  })
  // 任何雲端讀寫都會經過 from()；換帳號時不應被呼叫
  fake.from = vi.fn(() => {
    throw new Error('offline')
  })
}

describe('登入接線：登入方式', () => {
  it('把設定的登入方式帶給畫面', async () => {
    reset()
    const db = await freshDb()
    const auth = await createAuthSession({ ...config, google: true, email: false }, db)
    expect(auth.google).toBe(true)
    expect(auth.email).toBe(false)
  })
})

describe('登入接線：Google 登入', () => {
  it('登入完成後回到設定頁：首頁不載入 Supabase，回首頁會讀不到網址裡的 token', async () => {
    reset()
    fake.signInWithOAuth = vi.fn(async () => ({ error: null }))
    const db = await freshDb()
    const auth = await createAuthSession({ ...config, google: true }, db)

    await auth.signInWithGoogle()

    expect(fake.signInWithOAuth).toHaveBeenCalledWith({
      provider: 'google',
      options: { redirectTo: 'http://localhost:3000/settings' },
    })
  })
})

describe('登入接線：換帳號保護', () => {
  it('本機資料已綁定帳號 X，以 Y 登入：不連雲端、把 Y 登出並通知畫面', async () => {
    reset()
    const db = await freshDb()
    await addFavorite(db, 'river', 0)
    await db.syncMeta.put({ key: 'userId', value: 'user-x' })

    const auth = await createAuthSession(config, db)
    const seen: [string | null, string | undefined][] = []
    auth.subscribe((email, notice) => seen.push([email, notice]))
    fake.listener!('SIGNED_IN', signedInAsY)

    await vi.waitFor(() => expect(seen.at(-1)).toEqual([null, 'account-mismatch']))
    expect(fake.signOut).toHaveBeenCalledTimes(1)
    expect(fake.from).not.toHaveBeenCalled()
    expect(await db.wordPool.count()).toBe(1)
  })

  it('從未同步過的訪客：首次登入照常同步（會連雲端）、不登出', async () => {
    reset()
    const db = await freshDb()
    await addFavorite(db, 'river', 0)

    const auth = await createAuthSession(config, db)
    auth.subscribe(() => {})
    fake.listener!('SIGNED_IN', signedInAsY)

    await vi.waitFor(() => expect(fake.from).toHaveBeenCalled())
    expect(fake.signOut).not.toHaveBeenCalled()
  })
})

describe('結算後同步（TASK-18）', () => {
  it('requestSync：已登入時同步一次（會連雲端），失敗不丟錯', async () => {
    reset()
    const db = await freshDb()
    await addFavorite(db, 'river', 0)

    const auth = await createAuthSession(config, db)
    expect(() => auth.requestSync()).not.toThrow()
    await vi.waitFor(() => expect(fake.from).toHaveBeenCalled())
  })
})
