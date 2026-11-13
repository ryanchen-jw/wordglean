import { afterEach, describe, expect, it, vi } from 'vitest'
import { createRing, downsample, peakFrameRms, startLiveMic } from './liveMic'

/** 假的 getUserMedia／AudioContext／AudioWorkletNode，記錄釋放動作 */
function fakeAudio({ addModuleFails = false } = {}) {
  const track = { stop: vi.fn() }
  const ctx = {
    sampleRate: 48_000,
    audioWorklet: {
      addModule: vi.fn(() => (addModuleFails ? Promise.reject(new Error('x')) : Promise.resolve())),
    },
    resume: vi.fn(async () => {}),
    close: vi.fn(async () => {}),
    destination: {},
    createMediaStreamSource: vi.fn(() => ({ connect: vi.fn() })),
  }
  const node = {
    port: { onmessage: null as unknown },
    connect: vi.fn(),
    disconnect: vi.fn(),
  }
  vi.stubGlobal('navigator', {
    mediaDevices: { getUserMedia: vi.fn(async () => ({ getTracks: () => [track] })) },
  })
  vi.stubGlobal(
    'AudioContext',
    vi.fn(function () {
      return ctx
    }),
  )
  vi.stubGlobal(
    'AudioWorkletNode',
    vi.fn(function () {
      return node
    }),
  )
  URL.createObjectURL = vi.fn(() => 'blob:x')
  URL.revokeObjectURL = vi.fn()
  return { track, ctx, node }
}

afterEach(() => vi.unstubAllGlobals())

describe('startLiveMic 釋放資源', () => {
  it('stop()：音軌停止、worklet 斷開、AudioContext 關閉', async () => {
    const { track, ctx, node } = fakeAudio()
    const mic = await startLiveMic()
    expect(node.connect).toHaveBeenCalledWith(ctx.destination)
    mic.stop()
    expect(track.stop).toHaveBeenCalledTimes(1)
    expect(node.disconnect).toHaveBeenCalledTimes(1)
    expect(node.port.onmessage).toBeNull()
    expect(ctx.close).toHaveBeenCalledTimes(1)
  })

  it('載入 worklet 失敗：音軌停止、AudioContext 關閉', async () => {
    const { track, ctx } = fakeAudio({ addModuleFails: true })
    await expect(startLiveMic()).rejects.toThrow('x')
    expect(track.stop).toHaveBeenCalledTimes(1)
    expect(ctx.close).toHaveBeenCalledTimes(1)
  })
})

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
