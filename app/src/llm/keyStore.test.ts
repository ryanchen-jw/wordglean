// @vitest-environment node
import 'fake-indexeddb/auto'
import Dexie from 'dexie'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { createDb, type LinguaDb } from '../data/db'
import { clearLocalData, exportData } from '../data/localData'
import { clearLink, getLink, looksLikeKey, saveLink, setModel } from './keyStore'

const T = Date.parse('2026-10-02T08:00:00Z')
const KEY = 'sk-or-v1-0123456789abcdef0123456789abcdef'

let db: LinguaDb
let n = 0
beforeEach(async () => {
  db = createDb(`key-store-test-${++n}`)
  await db.open()
})
afterEach(async () => {
  db.close()
  await Dexie.delete(db.name)
})

describe('looksLikeKey（設計 s11-keyerr：應以 sk-or- 開頭）', () => {
  it.each([
    [KEY, true],
    [`  ${KEY}\n`, true],
    ['sk-or-', false],
    ['sk-ant-0123456789abcdef', false],
    ['3f9a0123456789', false],
    ['', false],
  ])('%j → %s', (text, ok) => expect(looksLikeKey(text)).toBe(ok))
})

describe('貼金鑰／清除金鑰', () => {
  it('第一次存：去頭尾空白、預設模型 qwen/qwen3.8-27b:free、記來源與時間', async () => {
    await saveLink(db, `  ${KEY} `, 'paste', T)
    expect(await getLink(db)).toEqual({
      key: 'openrouter',
      apiKey: KEY,
      model: 'qwen/qwen3.8-27b:free',
      via: 'paste',
      linkedAt: T,
    })
  })

  it('重新連結保留已選的模型', async () => {
    await saveLink(db, KEY, 'paste', T)
    await setModel(db, 'apodex/apodex-1.1-mini:free')
    await saveLink(db, 'sk-or-v1-ffffffffffffffff', 'oauth', T + 1)
    expect(await getLink(db)).toMatchObject({
      apiKey: 'sk-or-v1-ffffffffffffffff',
      model: 'apodex/apodex-1.1-mini:free',
      via: 'oauth',
    })
  })

  it('解除連結後讀不到金鑰', async () => {
    await saveLink(db, KEY, 'paste', T)
    await clearLink(db)
    expect(await getLink(db)).toBeNull()
  })

  it('金鑰不進匯出檔、不進同步佇列', async () => {
    await saveLink(db, KEY, 'paste', T)
    expect(JSON.stringify(await exportData(db, T))).not.toContain(KEY)
    expect(await db.outbox.count()).toBe(0)
  })

  it('清除這支手機上的資料會一併刪掉金鑰', async () => {
    await saveLink(db, KEY, 'paste', T)
    await clearLocalData(db)
    const reopened = createDb(db.name)
    expect(await reopened.secrets.count()).toBe(0)
    reopened.close()
  })
})
