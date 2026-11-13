import { describe, expect, it } from 'vitest'
import type { LiveSource } from './liveMic'
import {
  createFileSource,
  percentile,
  startLiveLoop,
  type LiveRound,
  type LiveStopReason,
} from './liveStt'

describe('percentile', () => {
  it('中位數與 P90（線性內插）', () => {
    const v = [500, 100, 300, 200, 400]
    expect(percentile(v, 0.5)).toBe(300)
    expect(percentile(v, 0.9)).toBe(460)
    expect(percentile([1, 2], 0.5)).toBe(1.5)
    expect(percentile([], 0.5)).toBeNaN()
  })
})

const loud = (seconds: number) => new Float32Array(seconds * 16_000).fill(0.3)

/** 假音源：elapsed 由測試控制；read 回傳 seconds 秒的有聲（或靜音）樣本 */
function fakeSource(opts: { quiet?: () => boolean; at?: () => number } = {}) {
  const reads: number[] = []
  const source: LiveSource = {
    elapsed: () => opts.at?.() ?? 5,
    read(seconds) {
      reads.push(seconds)
      return opts.quiet?.() ? new Float32Array(seconds * 16_000) : loud(seconds)
    },
  }
  return { source, reads }
}

const ticks = async (n: number) => {
  for (let i = 0; i < n; i++) await new Promise((r) => setTimeout(r, 0))
}

describe('startLiveLoop', () => {
  it('上一輪一結束就送下一輪，每輪讀當下的視窗長度，記錄文字與耗時', async () => {
    let clock = 0
    let win = 4
    const texts = ['want', 'want to', 'want to eat']
    const rounds: LiveRound[] = []
    const { source, reads } = fakeSource()
    const loop = startLiveLoop({
      source,
      windowSec: () => win,
      now: () => clock,
      transcribe: async () => {
        clock += 300
        win = 3
        return texts.shift() ?? ''
      },
      onRound: (r) => {
        rounds.push(r)
        if (rounds.length === 3) loop.stop()
      },
    })
    await ticks(10)
    expect(rounds.map((r) => [r.index, r.text, r.ms, r.windowSec])).toEqual([
      [1, 'want', 300, 4],
      [2, 'want to', 300, 3],
      [3, 'want to eat', 300, 3],
    ])
    expect(reads).toEqual([4, 3, 3])
  })

  it('音量閘：視窗內沒有夠大的聲音就不送辨識', async () => {
    let quiet = true
    const sent: number[] = []
    const loop = startLiveLoop({
      source: fakeSource({ quiet: () => quiet }).source,
      windowSec: () => 4,
      sleep: async () => {
        quiet = false
      },
      transcribe: async (s) => {
        sent.push(s.length)
        loop.stop()
        return 'hi'
      },
      onRound: () => {},
    })
    await ticks(10)
    expect(loop.skipped()).toBe(1)
    expect(sent).toEqual([64_000])
  })

  it('收音不到 1 秒不送辨識（太短時模型會重複輸出），也不算音量閘跳過', async () => {
    let len = 0.8
    const sent: number[] = []
    const loop = startLiveLoop({
      source: { elapsed: () => len, read: () => loud(len) },
      windowSec: () => 4,
      sleep: async () => {
        len = 1
      },
      transcribe: async (s) => {
        sent.push(s.length)
        loop.stop()
        return 'hi'
      },
      onRound: () => {},
    })
    await ticks(10)
    expect(sent).toEqual([16_000])
    expect(loop.skipped()).toBe(0)
  })

  it('收音滿上限秒數自動停（limit）', async () => {
    const stops: LiveStopReason[] = []
    let at = 59
    startLiveLoop({
      source: fakeSource({ at: () => at }).source,
      windowSec: () => 4,
      transcribe: async () => {
        at = 60
        return 'x'
      },
      onRound: () => {},
      onStop: (r) => stops.push(r),
    })
    await ticks(10)
    expect(stops).toEqual(['limit'])
  })

  it('辨識失敗就停（error）', async () => {
    const stops: LiveStopReason[] = []
    startLiveLoop({
      source: fakeSource().source,
      windowSec: () => 4,
      transcribe: async () => {
        throw new Error('boom')
      },
      onRound: () => {},
      onStop: (r) => stops.push(r),
    })
    await ticks(5)
    expect(stops).toEqual(['error'])
  })

  it('手動停只回報一次，停後到達的辨識結果不再回報', async () => {
    const stops: LiveStopReason[] = []
    const rounds: LiveRound[] = []
    let resolve: (t: string) => void = () => {}
    const loop = startLiveLoop({
      source: fakeSource().source,
      windowSec: () => 4,
      transcribe: () => new Promise((r) => (resolve = r)),
      onRound: (r) => rounds.push(r),
      onStop: (r) => stops.push(r),
    })
    await ticks(2)
    loop.stop()
    loop.stop()
    resolve('late')
    await ticks(3)
    expect(stops).toEqual(['stopped'])
    expect(rounds).toEqual([])
  })
})

describe('createFileSource', () => {
  it('依經過時間播放，播完接靜音', () => {
    let clock = 0
    const samples = new Float32Array(32_000).fill(1)
    const src = createFileSource(samples, () => clock)
    clock = 1000
    expect(src.elapsed()).toBe(1)
    expect(src.read(4)).toHaveLength(16_000)
    clock = 3000
    const tail = src.read(2)
    expect(tail).toHaveLength(32_000)
    expect(tail[0]).toBe(1)
    expect(tail[16_000 - 1]).toBe(1)
    expect(tail[16_000]).toBe(0)
  })
})
