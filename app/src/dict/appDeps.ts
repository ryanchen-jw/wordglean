// App 執行期的字典來源：切片、單字總表、片語表皆為 PWA 預快取的獨立資產
import { loadLexIndex } from './lexicon'
import type { LookupDeps } from './lookup'
import { assetShardStore, type ShardStore } from './shards'

let shards: ShardStore | undefined

export async function appDictDeps(): Promise<LookupDeps> {
  shards ??= assetShardStore()
  // 片語表載入失敗時字典照常可用，只是點字不查片語
  const [lex, phrases] = await Promise.all([
    loadLexIndex(),
    import('./phrases').then((m) => m.loadPhrases()).catch(() => []),
  ])
  return { shards, lex, phrases }
}
