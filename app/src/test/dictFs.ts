// 測試用：直接讀 repo 的真字典切片與單字總表（jsdom 沒有 dev server）
import { readFileSync, readdirSync } from 'node:fs'
import { resolve } from 'node:path'
import { buildLexIndex, type LexRow } from '../dict/lexicon'
import type { LookupDeps } from '../dict/lookup'
import { toPhrases, type Phrase } from '../dict/phrases'
import { createShardStore, type Shard } from '../dict/shards'

// npm test 的 cwd 是 app/
const DATA = resolve(process.cwd(), '../data')

export function fsDictDeps(): LookupDeps {
  const dir = resolve(DATA, 'dict')
  const keys = readdirSync(dir)
    .filter((f) => f.endsWith('.json') && f !== 'manifest.json')
    .map((f) => f.slice(0, -'.json'.length))
  const shards = createShardStore(
    keys,
    async (key) => JSON.parse(readFileSync(resolve(dir, `${key}.json`), 'utf-8')) as Shard,
  )
  const rows = JSON.parse(readFileSync(resolve(DATA, 'lexicon/lexicon.json'), 'utf-8')) as LexRow[]
  const phrases = toPhrases(
    (
      JSON.parse(readFileSync(resolve(DATA, 'phrases/phrases.json'), 'utf-8')) as {
        phrases: Phrase[]
      }
    ).phrases,
  )
  return { shards, lex: buildLexIndex(rows, phrases), phrases }
}
