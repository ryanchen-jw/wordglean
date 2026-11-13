import { describe, expect, it } from 'vitest'
import { createRing, downsample, peakFrameRms } from './liveMic'

describe('createRing', () => {
  it('只留最近 capacity 個樣本，跨過結尾仍依序', () => {
    const r = createRing(5)
    r.push(new Float32Array([1, 2, 3]))
    expect([...r.latest(10)]).toEqual([1, 2, 3])
    r.push(new Float32Array([4, 5, 6, 7]))
    expect([...r.latest(10)]).toEqual([3, 4, 5, 6, 7])
    expect([...r.latest(2)]).toEqual([6, 7])
    expect(r.total()).toBe(7)
  })

  it('一次推超過容量只留尾端', () => {
    const r = createRing(3)
    r.push(new Float32Array([1]))
    r.push(new Float32Array([2, 3, 4, 5, 6]))
    expect([...r.latest(3)]).toEqual([4, 5, 6])
  })
})

describe('downsample', () => {
  it('48 kHz → 16 kHz：每 3 個取平均', () => {
    expect([...downsample(new Float32Array([0, 3, 6, 3, 3, 3, 1]), 48_000)]).toEqual([3, 3])
  })

  it('44.1 kHz：長度依比例', () => {
    expect(downsample(new Float32Array(44_100), 44_100)).toHaveLength(16_000)
  })

  it('同取樣率回傳複本', () => {
    const a = new Float32Array([1, 2])
    const b = downsample(a, 16_000)
    expect([...b]).toEqual([1, 2])
    expect(b).not.toBe(a)
  })
})

describe('peakFrameRms', () => {
  it('取 50 ms 格中最大的 RMS：大半靜音、一小段有聲仍過閘', () => {
    const s = new Float32Array(16_000)
    s.fill(0.5, 8_000, 8_800)
    expect(peakFrameRms(s)).toBeCloseTo(0.5)
    expect(peakFrameRms(new Float32Array(16_000))).toBe(0)
  })
})
