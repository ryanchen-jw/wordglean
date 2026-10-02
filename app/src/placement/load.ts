// 分級題本以 ?url 產出獨立 json 資產（同課綱：不併進程式碼 bundle，符合 data 授權分界）、執行期 fetch；PWA 預快取
import bankUrl from '../../../content/placement/placement.json?url'
import type { PlacementBank } from './form'

let cached: Promise<PlacementBank> | null = null

export function loadBank(): Promise<PlacementBank> {
  if (!cached) {
    cached = fetch(bankUrl).then((res) => {
      if (!res.ok) throw new Error(`分級題本載入失敗：${res.status}`)
      return res.json() as Promise<PlacementBank>
    })
    cached.catch(() => (cached = null))
  }
  return cached
}
