// 讀 out/report.json 印量測表（試產結果彙整）
import { readFileSync } from 'node:fs'
const r = JSON.parse(readFileSync(new URL('./out/report.json', import.meta.url)))
const avg = (a) => a.reduce((x, y) => x + y, 0) / (a.length || 1)
const kindOf = (x) => (x.kind === 'sentence' ? 'sentence' : x.text.includes(' ') ? 'phrase' : 'word')
const all = r.lessons.flatMap((l) => l.segments)
console.log(`model load+warmup ${r.loadMs} ms`)
for (const [name, segs] of [...r.lessons.map((l) => [l.id, l.segments]), ['ALL', all]])
  for (const kind of ['word', 'phrase', 'sentence']) {
    const s = segs.filter((x) => kindOf(x) === kind)
    if (!s.length) continue
    console.log(
      `${name} ${kind} n=${s.length} sec=${avg(s.map((x) => x.sec)).toFixed(2)} (raw ${avg(s.map((x) => x.rawSec)).toFixed(2)})` +
        ` 32k=${avg(s.map((x) => x.bytes['32k'])).toFixed(0)}B 48k=${avg(s.map((x) => x.bytes['48k'])).toFixed(0)}B` +
        ` gen=${avg(s.map((x) => x.genMs)).toFixed(0)}ms`,
    )
  }
for (const l of r.lessons)
  console.log(`${l.id} pack ${JSON.stringify(l.packBytes)} genTotal ${l.segments.reduce((a, x) => a + x.genMs, 0)} ms`)
