// @vitest-environment node
import 'fake-indexeddb/auto'
import Dexie from 'dexie'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { createDb, type LinguaDb } from '../data/db'
import { getLink, saveLink, setModel } from './keyStore'
import { gradeWriting } from './grade'
import { refreshModel, refreshModelIfStale } from './startup'

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
    await refreshModel(db, async () => models('google/gemma-4-26b-a4b-it:free', 'x/y'))
    expect((await getLink(db))?.model).toBe('google/gemma-4-26b-a4b-it:free')
  })

  it('舊 link 遷移：存檔還是已下架的 qwen，啟動後寫回新預設', async () => {
    await saveLink(db, 'sk-or-v1-abcdefghijkl', 'paste', 1)
    await setModel(db, 'qwen/qwen3.8-27b:free')
    await refreshModel(db, async () =>
      models('google/gemma-4-31b-it:free', 'google/gemma-4-26b-a4b-it:free', 'x/y'),
    )
    expect((await getLink(db))?.model).toBe('google/gemma-4-31b-it:free')
  })

  it('使用者手選的模型還在：不被預設蓋掉', async () => {
    await saveLink(db, 'sk-or-v1-abcdefghijkl', 'paste', 1)
    await setModel(db, 'x/y')
    await refreshModel(db, async () => models('google/gemma-4-31b-it:free', 'x/y'))
    expect((await getLink(db))?.model).toBe('x/y')
  })

  it('批改當下用最新清單組 models：手選的 Google 模型不再帶已下架的模型', async () => {
    await saveLink(db, 'sk-or-v1-abcdefghijkl', 'paste', 1)
    await setModel(db, 'google/gemma-4-26b-a4b-it:free')
    await refreshModel(db, async () =>
      models('google/gemma-4-26b-a4b-it:free', 'xingchen-agi/xing4.0-29b-a4b:free', 'a/b:free'),
    )
    const fetchFn = vi.fn<typeof fetch>(async () =>
      Response.json({
        choices: [{ message: { content: '{"isCorrect":true}' }, finish_reason: 'stop' }],
      }),
    )
    const link = { apiKey: 'sk-or-v1-abcdefghijkl', model: 'google/gemma-4-26b-a4b-it:free' }
    const task = {
      kind: 'translate' as const,
      promptZh: '我喜歡音樂。',
      words: [],
      referenceEn: ['I like music.'],
      rubricZh: [],
      level: 'A1' as const,
      answer: 'I like music.',
    }
    await gradeWriting(link, task, fetchFn)
    expect(JSON.parse(fetchFn.mock.calls[0][1]!.body as string).models).toEqual([
      'google/gemma-4-26b-a4b-it:free',
      'xingchen-agi/xing4.0-29b-a4b:free',
      'a/b:free',
    ])
  })

  it('App 開著回到前景：距上次檢查滿一小時才重查（模型中途下架）', async () => {
    await saveLink(db, 'sk-or-v1-abcdefghijkl', 'paste', 1)
    await setModel(db, 'x/y')
    await refreshModel(db, async () => models('x/y'), 1_000)

    const early = vi.fn<typeof fetch>(async () => models('google/gemma-4-31b-it:free'))
    await refreshModelIfStale(db, 1_000 + 3_599_000, early)
    expect(early).not.toHaveBeenCalled()
    expect((await getLink(db))?.model).toBe('x/y')

    const late = vi.fn<typeof fetch>(async () => models('google/gemma-4-31b-it:free'))
    await refreshModelIfStale(db, 1_000 + 3_600_000, late)
    expect(late).toHaveBeenCalledOnce()
    expect((await getLink(db))?.model).toBe('google/gemma-4-31b-it:free')
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
