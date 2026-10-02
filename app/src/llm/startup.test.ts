// @vitest-environment node
import 'fake-indexeddb/auto'
import Dexie from 'dexie'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { createDb, type LinguaDb } from '../data/db'
import { getLink, saveLink, setModel } from './keyStore'
import { refreshModel } from './startup'

const text = { input_modalities: ['text'], output_modalities: ['text'] }
const models = (...ids: string[]) =>
  Response.json({
    data: ids.map((id) => ({
      id,
      name: id,
      pricing: { prompt: '0', completion: '0' },
      architecture: text,
    })),
  })

let db: LinguaDb
let n = 0
beforeEach(async () => {
  db = createDb(`startup-test-${++n}`)
  await db.open()
})
afterEach(async () => {
  db.close()
  await Dexie.delete(db.name)
})

describe('啟動時檢查選定模型還在（free-models.md §7 #6）', () => {
  it('沒有連結：不打任何網路', async () => {
    const fetchFn = vi.fn<typeof fetch>()
    await refreshModel(db, fetchFn)
    expect(fetchFn).not.toHaveBeenCalled()
  })

  it('選定模型下架：換回預設鏈中第一個還在的', async () => {
    await saveLink(db, 'sk-or-v1-abcdefghijkl', 'paste', 1)
    await setModel(db, 'gone/model:free')
    await refreshModel(db, async () => models('qwen/qwen3.8-27b:free', 'x/y'))
    expect((await getLink(db))?.model).toBe('qwen/qwen3.8-27b:free')
  })

  it('還在、或清單讀不到：不動', async () => {
    await saveLink(db, 'sk-or-v1-abcdefghijkl', 'paste', 1)
    await setModel(db, 'x/y')
    await refreshModel(db, async () => models('x/y'))
    expect((await getLink(db))?.model).toBe('x/y')
    await refreshModel(db, async () => {
      throw new TypeError('offline')
    })
    expect((await getLink(db))?.model).toBe('x/y')
  })
})
