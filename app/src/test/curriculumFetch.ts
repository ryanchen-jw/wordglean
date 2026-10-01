// 測試用：jsdom 沒有 dev server，以真課綱檔回應 loadLevel() 的 fetch
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { vi } from 'vitest'

export function stubCurriculumFetch() {
  vi.stubGlobal('fetch', async (url: string | URL) => {
    const level = /([abc][12])\.json/.exec(String(url))?.[1]
    if (!level) return new Response(null, { status: 404 })
    // vitest 下 import.meta.url 是 /@fs/ 形式，改以 app/ 為基準（npm test 的 cwd）
    const file = resolve(process.cwd(), '../content/curriculum', `${level}.json`)
    return new Response(readFileSync(file, 'utf-8'))
  })
}
