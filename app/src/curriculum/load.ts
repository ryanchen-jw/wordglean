// 課綱檔以 ?url 產出獨立 json 資產（不併進程式碼 bundle，符合 data 授權分界）、執行期 fetch；PWA 預快取
import { useEffect, useState } from 'react'
import type { Level, LevelDoc } from './curriculum'

const urls = import.meta.glob<string>('../../../content/curriculum/{a1,a2,b1,b2,c1}.json', {
  query: '?url',
  import: 'default',
})

const cache = new Map<Level, Promise<LevelDoc>>()

export function loadLevel(level: Level): Promise<LevelDoc> {
  let doc = cache.get(level)
  if (!doc) {
    const load = urls[`../../../content/curriculum/${level.toLowerCase()}.json`]
    doc = load()
      .then((url) => fetch(url))
      .then((res) => {
        if (!res.ok) throw new Error(`課綱載入失敗：${level} ${res.status}`)
        return res.json() as Promise<LevelDoc>
      })
    doc.catch(() => cache.delete(level))
    cache.set(level, doc)
  }
  return doc
}

/** 取某級課綱；載入中或 level 為 null 時回傳 undefined */
export function useLevelDoc(level: Level | null): LevelDoc | undefined {
  const [loaded, setLoaded] = useState<LevelDoc>()
  useEffect(() => {
    if (!level) return
    let alive = true
    loadLevel(level).then(
      (doc) => alive && setLoaded(doc),
      (e) => console.error(e),
    )
    return () => {
      alive = false
    }
  }, [level])
  return loaded?.level === level ? loaded : undefined
}
