// @vitest-environment node
// 共用 session 單例（TASK-18 D2）：設定頁與結算後同步共用同一個 AuthApi；沒設定登入時不載入 Supabase
import { beforeEach, describe, expect, it, vi, type Mock } from 'vitest'
import type { LinguaDb } from '../data/db'

const fake = vi.hoisted(() => ({
  create: null as unknown as Mock<(...args: unknown[]) => Promise<unknown>>,
  requestSync: null as unknown as Mock<() => void>,
}))
vi.mock('./session', () => ({ createAuthSession: (...args: unknown[]) => fake.create(...args) }))

const config = { url: 'http://127.0.0.1:55421', anonKey: 'anon', google: false }
const db = {} as LinguaDb

let handle: typeof import('./sessionHandle')
beforeEach(async () => {
  vi.resetModules()
  fake.requestSync = vi.fn()
  fake.create = vi.fn(async () => ({ requestSync: fake.requestSync }))
  handle = await import('./sessionHandle')
})

describe('getAuthSession', () => {
  it('同一個 App 只建立一次', async () => {
    const a = await handle.getAuthSession(config, db)
    const b = await handle.getAuthSession(config, db)
    expect(a).toBe(b)
    expect(fake.create).toHaveBeenCalledTimes(1)
    expect(fake.create).toHaveBeenCalledWith(config, db)
  })

  it('建立失敗後下次重試', async () => {
    fake.create.mockRejectedValueOnce(new Error('offline'))
    await expect(handle.getAuthSession(config, db)).rejects.toThrow('offline')
    await handle.getAuthSession(config, db)
    expect(fake.create).toHaveBeenCalledTimes(2)
  })
})

describe('syncAfterSettle（結算後同步）', () => {
  it('有設定登入：要求同步一次', async () => {
    handle.syncAfterSettle(config, db)
    await vi.waitFor(() => expect(fake.requestSync).toHaveBeenCalledTimes(1))
  })

  it('沒設定登入（自架未設）：不建立 session', async () => {
    handle.syncAfterSettle(null, db)
    await new Promise((r) => setTimeout(r, 0))
    expect(fake.create).not.toHaveBeenCalled()
  })

  it('建立 session 失敗不丟錯（資料留在本機佇列）', async () => {
    fake.create.mockRejectedValueOnce(new Error('offline'))
    expect(() => handle.syncAfterSettle(config, db)).not.toThrow()
    await new Promise((r) => setTimeout(r, 0))
    expect(fake.requestSync).not.toHaveBeenCalled()
  })
})
