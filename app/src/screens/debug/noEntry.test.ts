/// <reference types="node" />
// TASK-39 AC#2：原型頁 /debug/live-shadowing 在 App 內沒有入口——除了路由表，src 內（測試檔除外）
// 沒有任何地方提到 /debug 路徑（原型頁自己的資料夾除外）；路由表只以 import() 延遲載入（不進首屏）
import { readdirSync, readFileSync } from 'node:fs'
import { join, relative } from 'node:path'
import { describe, expect, it } from 'vitest'

const SRC = join(import.meta.dirname, '../..')

function walk(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((e) =>
    e.isDirectory() ? walk(join(dir, e.name)) : [join(dir, e.name)],
  )
}

describe('原型頁沒有入口', () => {
  it('只有路由表提到 /debug/ 路徑', () => {
    const hits = walk(SRC)
      .map((f) => relative(SRC, f).replaceAll('\\', '/'))
      .filter((f) => /\.(ts|tsx|json)$/.test(f) && !/\.test\.tsx?$/.test(f))
      .filter((f) => !f.startsWith('screens/debug/'))
      .filter((f) => /\/debug\b/.test(readFileSync(join(SRC, f), 'utf-8')))
    expect(hits).toEqual(['routes.tsx'])
  })

  it('路由表不靜態 import 原型頁', () => {
    const routes = readFileSync(join(SRC, 'routes.tsx'), 'utf-8')
    expect(routes).toContain("lazy(() => import('./screens/debug/LiveShadowingScreen'))")
    expect(routes).not.toMatch(/^import .*screens\/debug/m)
  })
})
