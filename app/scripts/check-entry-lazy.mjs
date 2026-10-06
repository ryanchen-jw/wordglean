// 建置後守衛（TASK-24 W5）：下列兩份資料不得內嵌進首屏 JS（首屏 JS 預算：超過 200KB gzip 警告、300KB 失敗，見 e2e/perf-budget.spec.ts）：
//   ① 片語表（data/phrases/phrases.json）：必須是延遲載入的獨立資產
//   ② 題目檔對照表（src/lesson/itemUrls.ts，約 1000 課的檔名→網址）：只可由 load.ts 以 import() 取得
// 首屏 JS＝dist/index.html 的入口 module script、modulepreload，以及它們靜態 import 的 chunk（動態 import 不算）。
// 判定：① 片語表中 3 個字以上的片語原文（程式碼與介面文案不會出現）出現任何一個就失敗；
//       ② 首屏 JS 出現任何題目檔檔名（<級>-uNN-lNN.json／<級>-pNN-lNN.json）就失敗。
// npm run build 最後一步會跑；單獨跑：node scripts/check-entry-lazy.mjs
import { readFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const app = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const dist = join(app, 'dist')

const html = readFileSync(join(dist, 'index.html'), 'utf-8')
const entries = [
  ...html.matchAll(/<script[^>]*type="module"[^>]*src="\/([^"]+)"/g),
  ...html.matchAll(/<link[^>]*rel="modulepreload"[^>]*href="\/([^"]+)"/g),
].map((m) => m[1])
if (entries.length === 0) throw new Error('dist/index.html 找不到入口 module script')

// 靜態 import／export from（import("…") 是動態載入，不收）
const STATIC_IMPORT = /\b(?:import|export)\s*(?:[^"'()]*?\bfrom\s*)?["'](\.{1,2}\/[^"']+\.js)["']/g
const seen = new Map()
const queue = [...entries]
while (queue.length > 0) {
  const file = queue.shift()
  if (seen.has(file)) continue
  const code = readFileSync(join(dist, file), 'utf-8')
  seen.set(file, code)
  for (const m of code.matchAll(STATIC_IMPORT))
    queue.push(join(dirname(file), m[1]).replaceAll('\\', '/'))
}

const { phrases } = JSON.parse(readFileSync(join(app, '../data/phrases/phrases.json'), 'utf-8'))
const markers = phrases.map((p) => p.phrase).filter((p) => p.split(' ').length >= 3)
const hits = [...seen].flatMap(([file, code]) =>
  markers.filter((m) => code.includes(m)).map((m) => `${file}：${m}`),
)

const LESSON_FILE = /[abc][12]-[up]\d{2}-l\d{2}\.json/g
const itemHits = [...seen].flatMap(([file, code]) =>
  [...new Set(code.match(LESSON_FILE) ?? [])].map((m) => `${file}：${m}`),
)
if (itemHits.length > 0) {
  console.error(
    `✗ 題目檔對照表進了首屏 JS（應只由 lesson/load.ts 以 import() 取得 itemUrls）：命中 ${itemHits.length} 個題目檔，例：\n  ${itemHits.slice(0, 5).join('\n  ')}`,
  )
  process.exit(1)
}

if (hits.length > 0) {
  console.error(
    `✗ 片語表內嵌進首屏 JS（應以 ?url 延遲載入）：命中 ${hits.length} 個片語，例：\n  ${hits.slice(0, 5).join('\n  ')}`,
  )
  process.exit(1)
}
console.log(
  `✓ 首屏 JS（${[...seen.keys()].join('、')}）不含片語表（檢查 ${markers.length} 個片語）與題目檔對照表`,
)
