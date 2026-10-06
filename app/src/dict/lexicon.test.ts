// 片語表載入失敗時（TASK-24 W5 驗收退件 2）：單字總表與字典照常可用，只是沒有片語
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { beforeEach, describe, expect, it, vi } from 'vitest'

const DATA = resolve(process.cwd(), '../data')

/** lexicon 照常回應；phrases.json 依 phrasesOk 回應或 500 */
function stubFetch({ phrasesOk }: { phrasesOk: boolean }) {
  const calls: string[] = []
  vi.stubGlobal('fetch', async (url: string | URL) => {
    const u = String(url)
    calls.push(u)
    if (u.includes('phrases'))
      return phrasesOk
        ? new Response(readFileSync(resolve(DATA, 'phrases/phrases.json'), 'utf-8'))
        : new Response(null, { status: 500 })
    if (u.includes('lexicon'))
      return new Response(readFileSync(resolve(DATA, 'lexicon/lexicon.json'), 'utf-8'))
    return new Response(null, { status: 404 })
  })
  return calls
}

// 每個案例解析整份單字總表（約 2.5 秒），全套並行時會超過預設 5 秒
vi.setConfig({ testTimeout: 30_000 })

beforeEach(() => {
  // 各模組的載入快取每個案例重來
  vi.resetModules()
  vi.spyOn(console, 'error').mockImplementation(() => {})
})

describe('loadLexIndex：片語表載入失敗', () => {
  it('單字總表照常可用（沒有片語）；下次再載會重試片語表', async () => {
    const calls = stubFetch({ phrasesOk: false })
    const { loadLexIndex } = await import('./lexicon')
    const lex = await loadLexIndex()
    expect(lex.get('meeting')?.cefr).toBe('A1')
    expect(lex.has('give up')).toBe(false)

    stubFetch({ phrasesOk: true })
    const again = await loadLexIndex()
    expect(again.get('give up')?.glossZh).toBe('放棄')
    expect(calls.filter((u) => u.includes('phrases'))).toHaveLength(1)
  })

  it('片語表正常時併入片語', async () => {
    stubFetch({ phrasesOk: true })
    const { loadLexIndex } = await import('./lexicon')
    expect((await loadLexIndex()).get('give up')).toMatchObject({ cefr: 'A2', phrase: true })
  })
})

describe('appDictDeps：片語表載入失敗', () => {
  it('字典照常可用，片語為空', async () => {
    stubFetch({ phrasesOk: false })
    // 字典切片與本案無關；真模組的 import.meta.glob（約 600 個資產）在全套並行時轉譯很慢
    vi.doMock('./shards', () => ({ assetShardStore: () => ({ get: async () => undefined }) }))
    const { appDictDeps } = await import('./appDeps')
    const deps = await appDictDeps()
    expect(deps.phrases).toEqual([])
    expect(deps.lex.get('meeting')?.cefr).toBe('A1')
  })
})
