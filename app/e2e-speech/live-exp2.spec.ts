// TASK-39 實驗 2（設計 §7）：補字誤標——LibriSpeech 測試音檔截掉句尾（只播前段），看沒播到的字被標成完成的比例；
// 兩輪確認開／關各一組（同一串辨識結果分別餵兩個比對器，辨識條件完全相同）。
// 截點：句中停頓（50 ms 一格 RMS 連續低於門檻 ≥ 100 ms）的中點，取 20%–85% 音長之間、彼此相隔 ≥ 1.5 秒，每句最多 4 個。
// 實際播到幾個字：截點前、後兩段各自整段辨識，取使「前段對目標前 k 字＋後段對其餘字」錯誤最少的 k；
// 兩段合計錯誤 > 2 的截點不夠可靠，捨棄。截點以真實時間播放（createFileSource）＋4 秒靜音，視窗 4 秒。
// 結果寫 test-results 的 exp2.json。跑法：E2E_PORT=<埠> npx playwright test --config playwright.speech.config.ts --project=chromium-live-real live-exp2
import { readFileSync } from 'node:fs'
import { writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { test } from '@playwright/test'
import { compareWords } from '../src/speech/align.js'
import { FIXTURES, openLivePage } from './live.js'

const WINDOW = 4
/** 視窗內至少多少秒音訊才送辨識（liveStt 的 minSeconds）；各跑一組比較：音訊太短時 tiny 會重複輸出（例「The English, the English…」） */
const MIN_SECONDS = (process.env.LIVE_EXP2_MIN ?? '0.5,1').split(',').map(Number)
const manifest = JSON.parse(readFileSync(resolve(FIXTURES, 'manifest.json'), 'utf-8')) as {
  file: string
  text: string
}[]

/** 16-bit 單聲道 WAV → 樣本（找 data chunk，略過 LIST 等） */
function readWav(file: string): { samples: Float32Array; rate: number } {
  const b = readFileSync(resolve(FIXTURES, file))
  const rate = b.readUInt32LE(24)
  let at = 12
  while (b.toString('ascii', at, at + 4) !== 'data') at += 8 + b.readUInt32LE(at + 4)
  const n = b.readUInt32LE(at + 4) / 2
  const samples = new Float32Array(n)
  for (let i = 0; i < n; i++) samples[i] = b.readInt16LE(at + 8 + i * 2) / 32768
  return { samples, rate }
}

/** 句中停頓的中點（秒） */
function pauses(samples: Float32Array, rate: number): number[] {
  const frame = rate / 20
  const rms: number[] = []
  for (let s = 0; s + frame <= samples.length; s += frame) {
    let sum = 0
    for (let k = s; k < s + frame; k++) sum += samples[k] ** 2
    rms.push(Math.sqrt(sum / frame))
  }
  const loud = Math.max(...rms)
  const quiet = rms.map((v) => v < loud * 0.05)
  const dur = samples.length / rate
  const mids: number[] = []
  for (let i = 0; i < quiet.length;) {
    if (!quiet[i]) {
      i++
      continue
    }
    let j = i
    while (j < quiet.length && quiet[j]) j++
    const mid = ((i + j) / 2) * 0.05
    if (j - i >= 2 && mid > dur * 0.2 && mid < dur * 0.85) mids.push(mid)
    i = j
  }
  const picked: number[] = []
  for (const m of mids) if (picked.every((p) => Math.abs(p - m) >= 1.5)) picked.push(m)
  return picked.slice(0, 4)
}

const errors = (ref: string, hyp: string) => {
  if (!ref.trim()) return hyp.trim() ? hyp.trim().split(/\s+/).length : 0
  const c = compareWords(ref, hyp)
  return c.wrong + c.missing + c.extra
}

type Lsh = {
  __liveShadowing: {
    runFile(
      u: string,
      o: { cutSec: number; tailSec: number; windowSec: number; minSeconds: number },
    ): Promise<{ at: number; ms: number; text: string }[]>
    /** 以原型頁的比對器（liveMatch）依序餵入每輪文字，回傳每個目標字是否完成 */
    marks(target: string, texts: string[], confirm: boolean): boolean[]
    transcribeRange(u: string, from: number, to: number): Promise<string>
  }
}

test('實驗 2：截掉句尾的誤標率（兩輪確認開／關）', async ({ page }, info) => {
  test.setTimeout(60 * 60_000)
  await openLivePage(page)
  type Cut = {
    file: string
    cutSec: number
    played: number
    unplayed: number
    variants: Record<string, Variant>
  }
  type Variant = {
    rounds: { at: number; ms: number; text: string }[]
    falseOn: string[]
    falseOff: string[]
    dupOn: number
    dupOff: number
    hitOn: number
    hitOff: number
  }
  const cuts: Cut[] = []
  const discarded: { file: string; cutSec: number; pre: string; post: string; errors: number }[] =
    []
  for (const m of manifest) {
    const { samples, rate } = readWav(m.file)
    const dur = samples.length / rate
    const ref = m.text.toLowerCase().split(' ')
    const url = `/__fixtures/librispeech/${m.file}`
    for (const cut of pauses(samples, rate)) {
      const [pre, post] = await page.evaluate(
        async ([u, c, d]) => {
          const l = (window as unknown as Lsh).__liveShadowing
          return [await l.transcribeRange(u, 0, c), await l.transcribeRange(u, c, d)]
        },
        [url, cut, dur] as const,
      )
      let best = { k: 0, err: Infinity }
      for (let k = 1; k < ref.length; k++) {
        const err = errors(ref.slice(0, k).join(' '), pre) + errors(ref.slice(k).join(' '), post)
        if (err < best.err) best = { k, err }
      }
      if (best.err > 2) {
        discarded.push({ file: m.file, cutSec: +cut.toFixed(2), pre, post, errors: best.err })
        continue
      }
      const k = best.k
      const variants: Record<string, Variant> = {}
      for (const minSec of MIN_SECONDS) {
        const rounds = await page.evaluate(
          ([u, c, w, ms]) =>
            (window as unknown as Lsh).__liveShadowing.runFile(u, {
              cutSec: c,
              tailSec: w,
              windowSec: w,
              minSeconds: ms,
            }),
          [url, cut, WINDOW, minSec] as const,
        )
        const marks = (confirm: boolean) =>
          page.evaluate(
            ([t, texts, c]) => (window as unknown as Lsh).__liveShadowing.marks(t, texts, c),
            [m.text, rounds.map((r) => r.text), confirm] as const,
          )
        const on = await marks(true)
        const off = await marks(false)
        const falseIdx = (done: boolean[]) => done.flatMap((d, i) => (d && i >= k ? [i] : []))
        // 誤標的字也出現在已播段＝重複字對錯位置，而非模型補字
        const dup = (done: boolean[]) =>
          falseIdx(done).filter((i) => ref.slice(0, k).includes(ref[i])).length
        variants[`min${minSec}`] = {
          rounds: rounds.map((r) => ({ at: +r.at.toFixed(2), ms: Math.round(r.ms), text: r.text })),
          falseOn: falseIdx(on).map((i) => ref[i]),
          falseOff: falseIdx(off).map((i) => ref[i]),
          dupOn: dup(on),
          dupOff: dup(off),
          hitOn: on.slice(0, k).filter(Boolean).length,
          hitOff: off.slice(0, k).filter(Boolean).length,
        }
      }
      cuts.push({
        file: m.file,
        cutSec: +cut.toFixed(2),
        played: k,
        unplayed: ref.length - k,
        variants,
      })
    }
  }
  const sum = (f: (c: Cut) => number) => cuts.reduce((s, c) => s + f(c), 0)
  const unplayed = sum((c) => c.unplayed)
  const played = sum((c) => c.played)
  const stat = (key: string, on: boolean) => {
    const v = (c: Cut) => c.variants[key]
    const falseMarks = sum((c) => (on ? v(c).falseOn : v(c).falseOff).length)
    return {
      falseMarks,
      rate: +(falseMarks / unplayed).toFixed(4),
      dupInduced: sum((c) => (on ? v(c).dupOn : v(c).dupOff)),
      playedHitRate: +(sum((c) => (on ? v(c).hitOn : v(c).hitOff)) / played).toFixed(4),
    }
  }
  const summary = {
    windowSec: WINDOW,
    cuts: cuts.length,
    discarded: discarded.length,
    unplayedWords: unplayed,
    playedWords: played,
    results: MIN_SECONDS.map((ms) => ({
      minSeconds: ms,
      confirmOn: stat(`min${ms}`, true),
      confirmOff: stat(`min${ms}`, false),
    })),
    cutsDetail: cuts,
    discardedDetail: discarded,
  }
  const json = JSON.stringify(summary, null, 2)
  await writeFile(info.outputPath('exp2.json'), json)
  await info.attach('exp2.json', { body: json, contentType: 'application/json' })
  for (const r of summary.results)
    info.annotations.push({
      type: `誤標率（最短送辨識 ${r.minSeconds} 秒）`,
      description: `兩輪確認開 ${(r.confirmOn.rate * 100).toFixed(1)}%、關 ${(r.confirmOff.rate * 100).toFixed(1)}%（${cuts.length} 個截點、未播 ${unplayed} 字）`,
    })
  console.log(
    JSON.stringify({ ...summary, cutsDetail: undefined, discardedDetail: undefined }, null, 2),
  )
})
