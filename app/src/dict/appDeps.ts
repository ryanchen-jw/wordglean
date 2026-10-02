// App 執行期的字典來源：切片與單字總表皆為 PWA 預快取的獨立資產
import { loadLexIndex } from './lexicon'
import type { LookupDeps } from './lookup'
import { assetShardStore, type ShardStore } from './shards'

let shards: ShardStore | undefined

export async function appDictDeps(): Promise<LookupDeps> {
  shards ??= assetShardStore()
  return { shards, lex: await loadLexIndex() }
}
