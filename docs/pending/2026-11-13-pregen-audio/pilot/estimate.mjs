// 全量推估：以試產的「每字元」耗時與大小，乘上全課程範圍各類文字的總字元數（推估，非實測）
// 另驗證一課一包的格式可解析、取出的片段是完整 MP3（ffprobe）
import { execFileSync } from 'node:child_process'
import { readdirSync, readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { normalize } from './pregen.mjs'

const HERE = new URL('.', import.meta.url).pathname.replace(/^\/([A-Z]:)/, '$1')
const ITEMS = join(HERE, '../../../../content/items')
const r = JSON.parse(readFileSync(join(HERE, 'out/report.json'), 'utf8'))
const kindOf = (kind, text) => (kind === 'sentence' ? 'sentence' : text.includes(' ') ? 'phrase' : 'word')

const corpus = { word: { n: 0, chars: 0 }, phrase: { n: 0, chars: 0 }, sentence: { n: 0, chars: 0 } }
for (const lvl of ['a1', 'a2', 'b1', 'b2', 'c1'])
  for (const f of readdirSync(join(ITEMS, lvl)).filter((f) => f.endsWith('.json')))
    for (const it of JSON.parse(readFileSync(join(ITEMS, lvl, f), 'utf8')).items) {
      const [kind, raw] =
        it.type === 'wordCard' ? ['word', it.word]
        : it.type === 'listenType' || it.type === 'shadowing' ? ['sentence', it.sentenceEn]
        : it.type === 'listenChoice' ? ['sentence', it.audioEn]
        : []
      if (!kind) continue
      const text = normalize(raw, kind)
      const k = kindOf(kind, text)
      corpus[k].n++
      corpus[k].chars += text.length
    }

const pilot = { word: {}, phrase: {}, sentence: {} }
for (const s of r.lessons.flatMap((l) => l.segments)) {
  const p = pilot[kindOf(s.kind, s.text)]
  p.n = (p.n ?? 0) + 1
  p.chars = (p.chars ?? 0) + s.text.length
  p.genMs = (p.genMs ?? 0) + s.genMs
  p.sec = (p.sec ?? 0) + s.sec
  p.b32 = (p.b32 ?? 0) + s.bytes['32k']
  p.b48 = (p.b48 ?? 0) + s.bytes['48k']
}
const out = {}
let tot = { genH: 0, mb32: 0, mb48: 0, audioH: 0 }
for (const k of Object.keys(corpus)) {
  const p = pilot[k], c = corpus[k]
  // 單字與片語很短，固定開銷為主：以「每段」平均推估；句子長度隨級距增加：以「每字元」推估
  const f = k === 'sentence' ? c.chars / p.chars : c.n / p.n
  out[k] = {
    corpusSegments: c.n, corpusAvgChars: +(c.chars / c.n).toFixed(1), pilotAvgChars: +(p.chars / p.n).toFixed(1),
    estGenH: +((p.genMs * f) / 3.6e6).toFixed(2), estAudioH: +((p.sec * f) / 3600).toFixed(2),
    estMB32: +((p.b32 * f) / 1e6).toFixed(1), estMB48: +((p.b48 * f) / 1e6).toFixed(1),
  }
  tot.genH += out[k].estGenH; tot.mb32 += out[k].estMB32; tot.mb48 += out[k].estMB48; tot.audioH += out[k].estAudioH
}
out.total = Object.fromEntries(Object.entries(tot).map(([k, v]) => [k, +v.toFixed(2)]))
console.log('--- 以兩課試產推估（樣本偏 A1，僅供對照）')
console.log(JSON.stringify(out, null, 1))

// 主推估：全課程等距抽樣（out/calib.json）的每段平均 × 全量段數；48k 以兩課試產的 48k/32k 比例換算
const calib = JSON.parse(readFileSync(join(HERE, 'out/calib.json'), 'utf8'))
const ratio48 = r.lessons.reduce((a, l) => a + l.packBytes['48k'], 0) / r.lessons.reduce((a, l) => a + l.packBytes['32k'], 0)
const est = {}
const t2 = { genH: 0, audioH: 0, mb32: 0 }
for (const k of Object.keys(corpus)) {
  const s = calib.filter((x) => kindOf(x.kind, x.text) === k)
  const n = corpus[k].n
  const avg = (f) => s.reduce((a, x) => a + f(x), 0) / s.length
  est[k] = {
    sampleN: s.length, corpusN: n, avgSec: +avg((x) => x.sec).toFixed(2), avgBytes32: Math.round(avg((x) => x.bytes32)),
    avgGenMs: Math.round(avg((x) => x.genMs)), estGenH: +((avg((x) => x.genMs) * n) / 3.6e6).toFixed(2),
    estAudioH: +((avg((x) => x.sec) * n) / 3600).toFixed(2), estMB32: +((avg((x) => x.bytes32) * n) / 1e6).toFixed(1),
  }
  t2.genH += est[k].estGenH; t2.audioH += est[k].estAudioH; t2.mb32 += est[k].estMB32
}
est.total = { genH: +t2.genH.toFixed(2), audioH: +t2.audioH.toFixed(2), mb32: +t2.mb32.toFixed(1), mb48: +(t2.mb32 * ratio48).toFixed(1), ratio48: +ratio48.toFixed(3) }
console.log('--- 以全課程等距抽樣推估（主推估）')
console.log(JSON.stringify(est, null, 1))

// 包格式自檢：解析 a1-u01-l03 的 32k 包，取出第一段寫檔並以 ffprobe 量長度
const buf = readFileSync(join(HERE, 'out/a1-u01-l03.32k.lga'))
if (buf.subarray(0, 4).toString() !== 'LGA1') throw new Error('magic 不符')
const hlen = buf.readUInt32LE(4)
const header = JSON.parse(buf.subarray(8, 8 + hlen).toString('utf8'))
const [off, len] = header.clips['do']
const clip = buf.subarray(8 + hlen + off, 8 + hlen + off + len)
writeFileSync(join(HERE, 'out/extracted-do.mp3'), clip)
const dur = execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration:stream=sample_rate,channels,bit_rate', '-of', 'compact', join(HERE, 'out/extracted-do.mp3')]).toString().trim()
console.log(`pack clips=${Object.keys(header.clips).length} headerBytes=${hlen} extracted 'do': ${dur}`)
