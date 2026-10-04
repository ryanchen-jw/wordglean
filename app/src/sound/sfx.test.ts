// 音效：Web Audio 合成（AudioContext 為假）、設定開關、未互動不播、錄音中不播、長度 ≤400ms
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import {
  afterSfx,
  holdSfx,
  playSfx,
  resetSfxForTest,
  setSfxEnabled,
  sfxDurationMs,
  sfxEnabled,
  type Sfx,
  watchFirstInteraction,
} from './sfx'

type Ramp = { kind: string; value: number; at: number }

class FakeAudioContext {
  static instances: FakeAudioContext[] = []
  state = 'running'
  currentTime = 0
  destination = {}
  oscillators: { type: string; freq: number; start: number; stop: number }[] = []
  gains: Ramp[][] = []
  constructor() {
    FakeAudioContext.instances.push(this)
  }
  resume = vi.fn(async () => {
    this.state = 'running'
  })
  createOscillator() {
    const o = { type: '', freq: 0, start: 0, stop: 0 }
    this.oscillators.push(o)
    return {
      set type(v: string) {
        o.type = v
      },
      frequency: {
        set value(v: number) {
          o.freq = v
        },
      },
      connect: (g: unknown) => g,
      start: (at: number) => (o.start = at),
      stop: (at: number) => (o.stop = at),
    }
  }
  createGain() {
    const ramps: Ramp[] = []
    this.gains.push(ramps)
    const node = {
      gain: {
        setValueAtTime: (value: number, at: number) => ramps.push({ kind: 'set', value, at }),
        linearRampToValueAtTime: (value: number, at: number) =>
          ramps.push({ kind: 'linear', value, at }),
        exponentialRampToValueAtTime: (value: number, at: number) =>
          ramps.push({ kind: 'exp', value, at }),
      },
      connect: () => node,
    }
    return node
  }
}

const played = () => FakeAudioContext.instances.flatMap((c) => c.oscillators)

beforeEach(() => {
  FakeAudioContext.instances = []
  vi.stubGlobal('AudioContext', FakeAudioContext)
  localStorage.clear()
  resetSfxForTest()
})
afterEach(() => {
  vi.unstubAllGlobals()
  vi.useRealTimers()
})

describe('playSfx', () => {
  it.each<[Sfx, number]>([
    ['correct', 2],
    ['wrong', 2],
    ['complete', 3],
  ])('%s：合成 %i 個音，整段 ≤400ms，音量柔和（峰值 ≤0.2）、淡入淡出', (kind, notes) => {
    playSfx(kind)
    const ac = FakeAudioContext.instances[0]
    expect(ac.oscillators).toHaveLength(notes)
    expect(sfxDurationMs(kind)).toBeLessThanOrEqual(400)
    const start = Math.min(...ac.oscillators.map((o) => o.start))
    const end = Math.max(...ac.oscillators.map((o) => o.stop))
    expect(end - start).toBeLessThanOrEqual(0.4 + 0.02)
    for (const ramps of ac.gains) {
      expect(Math.max(...ramps.map((r) => r.value))).toBeLessThanOrEqual(0.2)
      expect(ramps[0].value).toBeLessThan(0.001) // 從無聲開始
      expect(ramps[ramps.length - 1]).toMatchObject({ kind: 'exp', value: 0.0001 })
    }
  })

  it('答對上行、答錯下行', () => {
    playSfx('correct')
    const up = played().map((o) => o.freq)
    expect(up[1]).toBeGreaterThan(up[0])
    FakeAudioContext.instances = []
    resetSfxForTest()
    playSfx('wrong')
    const down = played().map((o) => o.freq)
    expect(down[1]).toBeLessThan(down[0])
  })

  it('同一個 AudioContext 重複使用；暫停中先 resume', () => {
    playSfx('correct')
    const ac = FakeAudioContext.instances[0]
    ac.state = 'suspended'
    playSfx('wrong')
    expect(FakeAudioContext.instances).toHaveLength(1)
    expect(ac.resume).toHaveBeenCalledOnce()
  })

  it('設定關掉就不播；預設開', () => {
    expect(sfxEnabled()).toBe(true)
    setSfxEnabled(false)
    expect(sfxEnabled()).toBe(false)
    playSfx('correct')
    expect(played()).toHaveLength(0)
    setSfxEnabled(true)
    expect(localStorage.getItem('lg.sfx')).toBeNull()
    playSfx('correct')
    expect(played()).toHaveLength(2)
  })

  it('使用者還沒互動過不播', () => {
    resetSfxForTest({ touched: false })
    playSfx('complete')
    expect(FakeAudioContext.instances).toHaveLength(0)
  })

  it('錄音中不播；放手後恢復（重複放手不影響）', () => {
    const release = holdSfx()
    playSfx('correct')
    expect(played()).toHaveLength(0)
    release()
    release()
    playSfx('correct')
    expect(played()).toHaveLength(2)
  })

  it('瀏覽器不支援 Web Audio：靜默略過', () => {
    vi.stubGlobal('AudioContext', undefined)
    expect(() => playSfx('correct')).not.toThrow()
  })
})

describe('第一次互動的監聽', () => {
  it('import 本模組不註冊任何全域監聽', async () => {
    vi.resetModules()
    const add = vi.spyOn(window, 'addEventListener')
    await import('./sfx')
    expect(add).not.toHaveBeenCalled()
    add.mockRestore()
  })

  it('watchFirstInteraction 後第一次點按才算互動過，之後才播', () => {
    resetSfxForTest({ touched: false })
    const target = new EventTarget()
    watchFirstInteraction(target as unknown as Window)
    playSfx('correct')
    expect(played()).toHaveLength(0)
    target.dispatchEvent(new Event('pointerdown'))
    playSfx('correct')
    expect(played()).toHaveLength(2)
  })
})

describe('afterSfx', () => {
  it('沒在播：馬上；正在播：等音效播完', async () => {
    vi.useFakeTimers()
    let done = false
    await afterSfx()
    playSfx('correct')
    void afterSfx().then(() => (done = true))
    await vi.advanceTimersByTimeAsync(sfxDurationMs('correct') - 10)
    expect(done).toBe(false)
    await vi.advanceTimersByTimeAsync(20)
    expect(done).toBe(true)
  })
})
