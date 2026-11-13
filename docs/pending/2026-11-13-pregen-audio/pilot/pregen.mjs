// TASK-35 第一階段試產：以 Kokoro-82M（af_heart，與 app/src/speech/kokoro.worker.ts 同模型同音色）在本機 CPU
// 產生課程發音，編成 MP3（單聲道 24 kHz CBR），並打包成「一課一包」量測大小與耗時。
//
// 用法（在本資料夾）：
//   node pregen.mjs --count                         統計全課程範圍要發音的文字（不產生）
//   node pregen.mjs a1-u01-l03 b1-p01-l01           試產指定課，輸出到 out/
//   node pregen.mjs --calibrate                     全課程等距抽樣量測（供 estimate.mjs 推估全量）
// 需要 PATH 上有 ffmpeg（libmp3lame）。模型由 transformers.js 自 Hugging Face 下載並快取在 node_modules 內。
import { spawn } from 'node:child_process'
import { createHash } from 'node:crypto'
import { mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs'
import { freemem } from 'node:os'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const HERE = dirname(fileURLToPath(import.meta.url))
const ITEMS = join(HERE, '../../../../content/items')
const OUT = join(HERE, 'out')
const MODEL_ID = 'onnx-community/Kokoro-82M-v1.0-ONNX'
const VOICE = 'af_heart'
const SR = 24000
const BITRATES = ['32k', '48k']
const MIN_FREE = 2.5 * 1024 ** 3

// ---- 要發音的文字（與 app 呼叫端一致：WordCardView／MatchingView／DictionarySheet 念 word，
//      ListenParts 念 sentenceEn／audioEn，ShadowingView 念 sentenceEn） ----
export function normalize(text, kind) {
  let s = text
    .normalize('NFC')
    .replace(/[‘’]/g, "'")
    .replace(/[“”]/g, '"')
    .replace(/\s+/g, ' ')
    .trim()
  if (kind === 'word') s = s.toLowerCase()
  return s
}

function lessonTexts(doc) {
  const out = []
  for (const it of doc.items) {
    if (it.type === 'wordCard') out.push({ kind: 'word', text: normalize(it.word, 'word') })
    else if (it.type === 'listenType' || it.type === 'shadowing')
      out.push({ kind: 'sentence', text: normalize(it.sentenceEn, 'sentence') })
    else if (it.type === 'listenChoice')
      out.push({ kind: 'sentence', text: normalize(it.audioEn, 'sentence') })
  }
  // 同課相同文字只留一份
  const seen = new Set()
  return out.filter((t) => !seen.has(t.text) && seen.add(t.text))
}

function allLessons() {
  const res = []
  for (const lvl of ['a1', 'a2', 'b1', 'b2', 'c1'])
    for (const f of readdirSync(join(ITEMS, lvl)).filter((f) => f.endsWith('.json')))
      res.push(JSON.parse(readFileSync(join(ITEMS, lvl, f), 'utf8')))
  return res
}

function count() {
  const lessons = allLessons()
  const byText = new Map()
  let words = 0, phrases = 0, sentences = 0, chars = 0
  for (const doc of lessons)
    for (const t of lessonTexts(doc)) {
      const k = `${t.kind}:${t.text}`
      byText.set(k, (byText.get(k) ?? 0) + 1)
      if (t.kind === 'word') t.text.includes(' ') ? phrases++ : words++
      else sentences++
      chars += t.text.length
    }
  const dup = [...byText.values()].filter((n) => n > 1).length
  console.log(JSON.stringify({ lessons: lessons.length, words, phrases, sentences, segments: words + phrases + sentences, uniqueTexts: byText.size, textsInMoreThanOneLesson: dup, totalChars: chars }, null, 1))
}

// ---- 產生 ----
function trimSilence(pcm, thr = 0.003, padMs = 60) {
  const pad = Math.round((SR * padMs) / 1000)
  let a = 0, b = pcm.length - 1
  while (a < pcm.length && Math.abs(pcm[a]) < thr) a++
  while (b > a && Math.abs(pcm[b]) < thr) b--
  return pcm.subarray(Math.max(0, a - pad), Math.min(pcm.length, b + pad + 1))
}

function toMp3(pcm, bitrate) {
  return new Promise((resolve, reject) => {
    const ff = spawn('ffmpeg', ['-hide_banner', '-loglevel', 'error', '-f', 'f32le', '-ar', String(SR), '-ac', '1', '-i', 'pipe:0',
      '-c:a', 'libmp3lame', '-b:a', bitrate, '-ar', String(SR), '-ac', '1', '-map_metadata', '-1', '-fflags', '+bitexact', '-f', 'mp3', 'pipe:1'])
    const chunks = []
    ff.stdout.on('data', (c) => chunks.push(c))
    ff.stderr.on('data', (c) => process.stderr.write(c))
    ff.on('error', reject)
    ff.on('close', (code) => (code === 0 ? resolve(Buffer.concat(chunks)) : reject(new Error(`ffmpeg ${code}`))))
    ff.stdin.end(Buffer.from(pcm.buffer, pcm.byteOffset, pcm.byteLength))
  })
}

// 一課一包：'LGA1' + uint32LE 標頭長度 + 標頭 JSON {v, clips:{文字:[位移, 長度]}} + 依序串接的 MP3
function pack(clips) {
  const header = { v: 1, clips: {} }
  let off = 0
  for (const c of clips) {
    header.clips[c.text] = [off, c.mp3.length]
    off += c.mp3.length
  }
  const h = Buffer.from(JSON.stringify(header), 'utf8')
  const len = Buffer.alloc(4)
  len.writeUInt32LE(h.length)
  return Buffer.concat([Buffer.from('LGA1'), len, h, ...clips.map((c) => c.mp3)])
}

async function waitForMemory() {
  while (freemem() < MIN_FREE) {
    console.error(`空閒記憶體 ${(freemem() / 1024 ** 3).toFixed(2)} GB < 2.5 GB，暫停 30 秒`)
    await new Promise((r) => setTimeout(r, 30000))
  }
}

async function generate(ids) {
  const { KokoroTTS } = await import('kokoro-js')
  const t0 = performance.now()
  const tts = await KokoroTTS.from_pretrained(MODEL_ID, { dtype: 'fp32', device: 'cpu' })
  await tts.generate('Hi.', { voice: VOICE })
  const loadMs = performance.now() - t0
  const report = { model: MODEL_ID, dtype: 'fp32', device: 'cpu', voice: VOICE, loadMs: Math.round(loadMs), lessons: [] }
  for (const id of ids) {
    const lvl = id.slice(0, 2)
    const doc = JSON.parse(readFileSync(join(ITEMS, lvl, `${id}.json`), 'utf8'))
    const dir = join(OUT, id)
    mkdirSync(dir, { recursive: true })
    const segs = []
    const clipsBy = Object.fromEntries(BITRATES.map((b) => [b, []]))
    for (const [i, t] of lessonTexts(doc).entries()) {
      await waitForMemory()
      const g0 = performance.now()
      const audio = await tts.generate(t.text, { voice: VOICE })
      const genMs = performance.now() - g0
      const raw = audio.audio
      const pcm = trimSilence(raw)
      const seg = { kind: t.kind, text: t.text, genMs: Math.round(genMs), rawSec: +(raw.length / SR).toFixed(3), sec: +(pcm.length / SR).toFixed(3), bytes: {} }
      const name = `${String(i + 1).padStart(2, '0')}-${t.kind}-${createHash('sha1').update(t.text).digest('hex').slice(0, 8)}`
      for (const b of BITRATES) {
        const mp3 = await toMp3(pcm, b)
        seg.bytes[b] = mp3.length
        clipsBy[b].push({ text: t.text, mp3 })
        writeFileSync(join(dir, `${name}.${b}.mp3`), mp3)
      }
      segs.push(seg)
      console.log(`${id} ${seg.kind} ${seg.sec}s gen ${seg.genMs}ms ${JSON.stringify(seg.bytes)} ${t.text}`)
    }
    const packs = {}
    for (const b of BITRATES) {
      const buf = pack(clipsBy[b])
      writeFileSync(join(OUT, `${id}.${b}.lga`), buf)
      packs[b] = buf.length
    }
    report.lessons.push({ id, segments: segs, packBytes: packs })
  }
  writeFileSync(join(OUT, 'report.json'), JSON.stringify(report, null, 1))
  console.log(`report: ${join(OUT, 'report.json')}`)
}

// 校準樣本：兩課試產偏 A1 短字，全量推估另取全課程等距抽樣（單字 40、片語 15、句子 30），只量不打包
async function calibrate() {
  const { KokoroTTS } = await import('kokoro-js')
  const tts = await KokoroTTS.from_pretrained(MODEL_ID, { dtype: 'fp32', device: 'cpu' })
  await tts.generate('Hi.', { voice: VOICE })
  const texts = allLessons().flatMap(lessonTexts)
  const pick = (arr, n) => Array.from({ length: n }, (_, i) => arr[Math.floor(((i + 0.5) * arr.length) / n)])
  const sample = [
    ...pick(texts.filter((t) => t.kind === 'word' && !t.text.includes(' ')), 40),
    ...pick(texts.filter((t) => t.kind === 'word' && t.text.includes(' ')), 15),
    ...pick(texts.filter((t) => t.kind === 'sentence'), 30),
  ]
  const segs = []
  mkdirSync(join(OUT, 'calib'), { recursive: true })
  for (const [i, t] of sample.entries()) {
    await waitForMemory()
    const g0 = performance.now()
    const audio = await tts.generate(t.text, { voice: VOICE })
    const genMs = performance.now() - g0
    const pcm = trimSilence(audio.audio)
    const mp3 = await toMp3(pcm, '32k')
    writeFileSync(join(OUT, 'calib', `${String(i + 1).padStart(2, '0')}-${t.kind}.32k.mp3`), mp3)
    segs.push({ kind: t.kind, text: t.text, genMs: Math.round(genMs), sec: +(pcm.length / SR).toFixed(3), bytes32: mp3.length })
    console.log(`calib ${t.kind} ${segs.at(-1).sec}s gen ${segs.at(-1).genMs}ms ${mp3.length}B ${t.text}`)
  }
  writeFileSync(join(OUT, 'calib.json'), JSON.stringify(segs, null, 1))
}

const args = process.argv.slice(2)
if (fileURLToPath(import.meta.url) !== process.argv[1]) {
  // 被 import（estimate.mjs 取 normalize）時不跑 CLI
} else if (args[0] === '--count') count()
else if (args[0] === '--calibrate') await calibrate()
else if (args.length) await generate(args)
else console.error('用法：node pregen.mjs --count | node pregen.mjs <lessonId>...')
