// 預先產生課程發音（TASK-35）：Kokoro-82M（af_heart，fp32，本機 CPU）→ MP3 單聲道 24 kHz 48 kbps（ffmpeg libmp3lame），
// 頭尾靜音裁切，一課一包（格式見 app/src/speech/clipPack.ts；要發音的文字見 app/src/speech/clipKey.ts）。
//
// 只補新增或變更：讀既有的包，產生參數（GEN）相同且文字仍需要的片段原樣沿用，只產生缺的；
// 文字集合與順序都沒變的課不重寫（位元組不變）。中途停掉重跑會從沒寫完的課接續。
//
// 用法（在 content/audio-gen/，先 npm ci；PATH 上要有 ffmpeg）：
//   node build-audio.mjs                       全部課（content/items → content/audio）
//   node build-audio.mjs --level a1            只做一級（可分級平行跑）
//   node build-audio.mjs --lessons a1-u01-l03,b1-p01-l01
//   node build-audio.mjs --limit 20            只做前 20 個需要產生的課（量記憶體用）
//   node build-audio.mjs --check               不載模型，只列待產生／待重產／多餘的包
//   node build-audio.mjs --items ../../app/src/lesson/fixtures/items --out ../../app/src/lesson/fixtures/audio
//   node build-audio.mjs --dict                字典專用包：data/dict 中含連字號的字 → content/audio/dict/dNNN.lga
// 空閒記憶體低於 2.5 GB 就寫完目前這一課後停止（exit 2），不自動重跑。
import { spawn } from 'node:child_process'
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs'
import { freemem } from 'node:os'
import { dirname, join, relative, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { decodePack, encodePack } from '../../app/src/speech/clipPack.ts'
import { dictPackName, dictPackOf, isDictClipWord, lessonClipTexts, wordClipKey } from '../../app/src/speech/clipKey.ts'

const HERE = dirname(fileURLToPath(import.meta.url))
const SR = 24000
const TRIM = { threshold: 0.003, padMs: 60 }
export const GEN = {
  model: 'onnx-community/Kokoro-82M-v1.0-ONNX',
  dtype: 'fp32',
  voice: 'af_heart',
  speed: 1,
  kokoroJs: '1.2.1',
  format: 'mp3',
  sampleRate: SR,
  bitrate: '48k',
  trim: TRIM,
}
const MIN_FREE = 2.5 * 1024 ** 3

function arg(name) {
  const i = process.argv.indexOf(name)
  return i < 0 ? undefined : process.argv[i + 1]
}

/** 題目檔（遞迴）→ [{id, file, out}]；輸出路徑照題目檔的相對路徑、副檔名換 .lga */
export function listLessons(itemsDir, outDir) {
  const res = []
  const walk = (dir) => {
    for (const e of readdirSync(dir, { withFileTypes: true })) {
      const p = join(dir, e.name)
      if (e.isDirectory()) {
        if (!e.name.startsWith('_')) walk(p)
      } else if (/^[a-c][12]-[up]\d\d-l\d\d\.json$/.test(e.name)) {
        res.push({
          id: e.name.slice(0, -5),
          out: join(outDir, relative(itemsDir, p).replace(/\.json$/, '.lga')),
          texts: () => lessonClipTexts(JSON.parse(readFileSync(p, 'utf8')).items),
        })
      }
    }
  }
  walk(itemsDir)
  return res.sort((a, b) => a.id.localeCompare(b.id))
}

/** 字典專用包：data/dict 各切片詞條中含連字號的字（小寫、去重），依 dictPackOf 分包、包內依字母排序 */
export function listDictPacks(dictDir, outDir) {
  const manifest = JSON.parse(readFileSync(join(dictDir, 'manifest.json'), 'utf8'))
  const groups = new Map()
  for (const shard of Object.keys(manifest.shards))
    for (const w of Object.keys(JSON.parse(readFileSync(join(dictDir, `${shard}.json`), 'utf8')).e)) {
      if (!isDictClipWord(w)) continue
      const key = wordClipKey(w)
      const n = dictPackOf(key)
      if (!groups.has(n)) groups.set(n, new Set())
      groups.get(n).add(key)
    }
  return [...groups.entries()]
    .sort((a, b) => a[0] - b[0])
    .map(([n, set]) => {
      const texts = [...set].sort()
      return { id: dictPackName(n), out: join(outDir, `${dictPackName(n)}.lga`), texts: () => texts }
    })
}

/** 這課的包是否已是最新：產生參數相同、文字與順序相同 */
export function packStatus(lesson) {
  const texts = lesson.texts()
  if (!existsSync(lesson.out)) return { texts, status: 'missing', reuse: new Map() }
  let pack
  try {
    pack = decodePack(readFileSync(lesson.out))
  } catch {
    return { texts, status: 'missing', reuse: new Map() } // 寫到一半被停掉的壞檔：整包重產
  }
  const { header, clips } = pack
  if (JSON.stringify(header.gen) !== JSON.stringify(GEN)) return { texts, status: 'stale-gen', reuse: new Map() }
  const same = JSON.stringify(Object.keys(header.clips)) === JSON.stringify(texts)
  return { texts, status: same ? 'ok' : 'stale-texts', reuse: clips }
}

function trimSilence(pcm) {
  const pad = Math.round((SR * TRIM.padMs) / 1000)
  let a = 0
  let b = pcm.length - 1
  while (a < pcm.length && Math.abs(pcm[a]) < TRIM.threshold) a++
  while (b > a && Math.abs(pcm[b]) < TRIM.threshold) b--
  return pcm.subarray(Math.max(0, a - pad), Math.min(pcm.length, b + pad + 1))
}

function toMp3(pcm) {
  return new Promise((ok, fail) => {
    const ff = spawn('ffmpeg', [
      '-hide_banner', '-loglevel', 'error', '-f', 'f32le', '-ar', String(SR), '-ac', '1', '-i', 'pipe:0',
      '-c:a', 'libmp3lame', '-b:a', GEN.bitrate, '-ar', String(SR), '-ac', '1',
      '-map_metadata', '-1', '-fflags', '+bitexact', '-f', 'mp3', 'pipe:1',
    ])
    const chunks = []
    ff.stdout.on('data', (c) => chunks.push(c))
    ff.stderr.on('data', (c) => process.stderr.write(c))
    ff.on('error', fail)
    ff.on('close', (code) => (code === 0 ? ok(new Uint8Array(Buffer.concat(chunks))) : fail(new Error(`ffmpeg exit ${code}`))))
    ff.stdin.end(Buffer.from(pcm.buffer, pcm.byteOffset, pcm.byteLength))
  })
}

async function main() {
  const dict = process.argv.includes('--dict')
  const outDir = resolve(arg('--out') ?? join(HERE, dict ? '../audio/dict' : '../audio'))
  let lessons = dict
    ? listDictPacks(resolve(join(HERE, '../../data/dict')), outDir)
    : listLessons(resolve(arg('--items') ?? join(HERE, '../items')), outDir)
  const level = arg('--level')
  if (level) lessons = lessons.filter((l) => l.id.startsWith(`${level}-`))
  const only = arg('--lessons')?.split(',')
  if (only) lessons = lessons.filter((l) => only.includes(l.id))
  const todo = []
  const counts = { ok: 0, missing: 0, 'stale-gen': 0, 'stale-texts': 0 }
  for (const l of lessons) {
    const s = packStatus(l)
    counts[s.status]++
    if (s.status !== 'ok') todo.push({ ...l, ...s })
  }
  console.log(`課 ${lessons.length}：${JSON.stringify(counts)}`)
  if (process.argv.includes('--check')) {
    for (const t of todo) console.log(`${t.status} ${t.id}`)
    process.exit(todo.length ? 1 : 0)
  }
  const limit = Number(arg('--limit') ?? Infinity)
  const { KokoroTTS } = await import('kokoro-js')
  const t0 = performance.now()
  const tts = await KokoroTTS.from_pretrained(GEN.model, { dtype: GEN.dtype, device: 'cpu' })
  await tts.generate('Hi.', { voice: GEN.voice })
  console.log(`模型載入＋暖機 ${Math.round(performance.now() - t0)} ms`)
  const stats = { lessons: 0, generated: 0, reused: 0, genMs: 0, bytes: 0 }
  const started = performance.now()
  for (const t of todo.slice(0, limit)) {
    if (freemem() < MIN_FREE) {
      console.error(`空閒記憶體 ${(freemem() / 1024 ** 3).toFixed(2)} GB < 2.5 GB，停止（已完成 ${stats.lessons} 課，重跑會接續）`)
      process.exitCode = 2
      break
    }
    const clips = []
    for (const text of t.texts) {
      const old = t.reuse.get(text)
      if (old) {
        clips.push({ text, mp3: old })
        stats.reused++
        continue
      }
      const g0 = performance.now()
      const audio = await tts.generate(text, { voice: GEN.voice, speed: GEN.speed })
      clips.push({ text, mp3: await toMp3(trimSilence(audio.audio)) })
      stats.genMs += performance.now() - g0
      stats.generated++
    }
    const buf = encodePack(GEN, clips)
    mkdirSync(dirname(t.out), { recursive: true })
    writeFileSync(t.out, buf)
    stats.lessons++
    stats.bytes += buf.length
    const rss = process.resourceUsage().maxRSS / 1024
    if (stats.lessons % 10 === 0 || stats.lessons === todo.length)
      console.log(
        `${stats.lessons}/${todo.length} ${t.id} 段 ${stats.generated}（沿用 ${stats.reused}）` +
          ` ${((performance.now() - started) / 60000).toFixed(1)} 分 峰值 RSS ${rss.toFixed(0)} MB 空閒 ${(freemem() / 1024 ** 3).toFixed(1)} GB`,
      )
  }
  console.log(
    `完成 ${stats.lessons} 課、產生 ${stats.generated} 段、沿用 ${stats.reused} 段、寫入 ${(stats.bytes / 1e6).toFixed(1)} MB、` +
      `總耗時 ${((performance.now() - started) / 60000).toFixed(1)} 分、峰值 RSS ${(process.resourceUsage().maxRSS / 1024).toFixed(0)} MB`,
  )
}

if (fileURLToPath(import.meta.url) === process.argv[1]) await main()
