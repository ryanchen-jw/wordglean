// ECDICT 字典切片（data/dict，MIT）：以 ?url 輸出成獨立 json 資產、執行期 fetch，不併進程式碼 bundle
// 切片格式與查找規則見 data/CLAUDE.md「產物與介面」；參考實作 data/bench/lookup.html

/** 一片字典：e＝詞條 {詞: [音標, 釋義（\n 分行）]}；f＝變化形 {變化形: [原形…]}（ECDICT exchange 衍生） */
export interface Shard {
  e: Record<string, [phonetic: string, gloss: string]>
  f: Record<string, string[]>
}

/** 前 n 個字母小寫、非 a–z 記 _、不足 n 補 _ */
export function shardKey(word: string, n: number): string {
  let k = ''
  for (const ch of word.toLowerCase().slice(0, n)) k += ch >= 'a' && ch <= 'z' ? ch : '_'
  return k.padEnd(n, '_')
}

export interface ShardStore {
  /** 該字所在的切片；沒有對應切片時為 null */
  get(word: string): Promise<Shard | null>
}

/** keys＝現有切片鍵；前綴長度由鍵長推得，由長到短取第一個存在的鍵 */
export function createShardStore(
  keys: Iterable<string>,
  load: (key: string) => Promise<Shard>,
): ShardStore {
  const keySet = new Set(keys)
  const lengths = [...new Set([...keySet].map((k) => k.length))].sort((a, b) => b - a)
  const cache = new Map<string, Promise<Shard>>()
  return {
    async get(word) {
      const key = lengths.map((n) => shardKey(word, n)).find((k) => keySet.has(k))
      if (key === undefined) return null
      let shard = cache.get(key)
      if (!shard) {
        shard = load(key)
        shard.catch(() => cache.delete(key))
        cache.set(key, shard)
      }
      return shard
    },
  }
}

// eager：只把檔名對照表放進 bundle（每片一個網址字串），不為每片另生一個 js chunk
const urls = import.meta.glob<string>(
  ['../../../data/dict/*.json', '!../../../data/dict/manifest.json'],
  {
    query: '?url',
    import: 'default',
    eager: true,
  },
)

const SHARD_PATH = /\/([^/]+)\.json$/

/** App 執行期用：切片走 PWA 預快取，離線可查 */
export function assetShardStore(): ShardStore {
  const byKey = new Map<string, string>()
  for (const [path, url] of Object.entries(urls)) {
    const key = SHARD_PATH.exec(path)?.[1]
    if (key) byKey.set(key, url)
  }
  return createShardStore(byKey.keys(), async (key) => {
    const res = await fetch(byKey.get(key)!)
    if (!res.ok) throw new Error(`字典切片載入失敗：${key} ${res.status}`)
    return (await res.json()) as Shard
  })
}
