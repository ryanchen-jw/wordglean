// 高音質發音（Kokoro 選配）的狀態：支援偵測、下載進度、完成即選用、失敗可重試、崩潰旗標、合成與快取
// 規則來源：規格 §2（僅 WebGPU、下載前告知）、voice-poc §5（存 Cache Storage、分頁被殺以 sessionStorage 旗標偵測後退回）
import { describe, expect, it, vi } from 'vitest'
import { createHqVoice, type HqDeps } from './hqVoice'
import type { WorkerIn, WorkerLike, WorkerOut } from './kokoroProtocol'

class FakeWorker implements WorkerLike {
  sent: WorkerIn[] = []
  onmessage: ((e: MessageEvent<WorkerOut>) => void) | null = null
  onerror: ((e: ErrorEvent) => void) | null = null
  onmessageerror: ((e: MessageEvent) => void) | null = null
  terminated = false
  postMessage(m: WorkerIn) {
    this.sent.push(m)
  }
  terminate() {
    this.terminated = true
  }
  emit(m: WorkerOut) {
    this.onmessage!({ data: m } as MessageEvent<WorkerOut>)
  }
  /** Worker 腳本本身載不到（例如 404）時瀏覽器發的 error 事件 */
  fail() {
    this.onerror!(new ErrorEvent('error'))
  }
}

function memStorage(): Storage {
  const m = new Map<string, string>()
  return {
    getItem: (k) => m.get(k) ?? null,
    setItem: (k, v) => void m.set(k, v),
    removeItem: (k) => void m.delete(k),
    clear: () => m.clear(),
    key: (i) => [...m.keys()][i] ?? null,
    get length() {
      return m.size
    },
  }
}

function setup(over: Partial<HqDeps> = {}) {
  const workers: FakeWorker[] = []
  const played: ArrayBuffer[] = []
  const deps: HqDeps = {
    createWorker: () => {
      const w = new FakeWorker()
      workers.push(w)
      return w
    },
    hasWebGpu: async () => true,
    modelCached: async () => true,
    storage: memStorage(),
    session: memStorage(),
    play: (wav) => {
      played.push(wav)
      return { done: Promise.resolve(), stop: vi.fn() }
    },
    audioCache: new Map<string, ArrayBuffer>(),
    ...over,
  }
  return { hq: createHqVoice(deps), deps, workers, played }
}

const flush = () => new Promise((r) => setTimeout(r, 0))

describe('支援偵測與初始狀態', () => {
  it('沒有 WebGPU：不支援、不能選高音質', async () => {
    const { hq } = setup({ hasWebGpu: async () => false })
    await hq.init()
    expect(hq.status()).toEqual({ kind: 'unsupported' })
    expect(hq.wantHq()).toBe(false)
  })

  it('有 WebGPU、沒下載過：未下載，預設用內建聲音', async () => {
    const { hq } = setup()
    await hq.init()
    expect(hq.status()).toEqual({ kind: 'notDownloaded' })
    expect(hq.choice()).toBe('system')
    expect(hq.wantHq()).toBe(false)
  })

  it('記錄為已下載、但模型快取被瀏覽器清掉：改回未下載、改用內建聲音', async () => {
    const { hq, deps } = setup({ modelCached: async () => false })
    deps.storage.setItem('lg.ttsHq.downloaded', '1')
    deps.storage.setItem('lg.ttsVoice', 'hq')
    await hq.init()
    expect(hq.status()).toEqual({ kind: 'notDownloaded' })
    expect(hq.choice()).toBe('system')
  })
})

describe('下載', () => {
  it('進度 0 → 42% → 完成：記為已下載並改選高音質', async () => {
    const { hq, workers } = setup()
    await hq.init()
    const seen: unknown[] = []
    hq.subscribe(() => seen.push(hq.status()))
    hq.startDownload()
    expect(workers[0].sent).toEqual([{ type: 'load' }])
    workers[0].emit({ type: 'progress', progress: 0.42 })
    workers[0].emit({ type: 'ready' })
    await flush()
    expect(seen).toEqual([
      { kind: 'downloading', progress: 0 },
      { kind: 'downloading', progress: 0.42 },
      { kind: 'downloaded' },
    ])
    expect(hq.choice()).toBe('hq')
    expect(hq.wantHq()).toBe(true)
  })

  it('下載失敗：顯示失敗、結束 Worker；重試會開新的 Worker', async () => {
    const { hq, workers } = setup()
    await hq.init()
    hq.startDownload()
    workers[0].emit({ type: 'error', message: 'network' })
    await flush()
    expect(hq.status()).toEqual({ kind: 'failed' })
    expect(workers[0].terminated).toBe(true)
    expect(hq.choice()).toBe('system')
    hq.startDownload()
    expect(workers).toHaveLength(2)
  })

  it('下載中不重複開 Worker', async () => {
    const { hq, workers } = setup()
    await hq.init()
    hq.startDownload()
    hq.startDownload()
    expect(workers).toHaveLength(1)
  })
})

describe('Worker 本身載入失敗（驗收 P1：App 更新後離線開啟，Worker 檔不在快取）', () => {
  it('下載中 Worker 發 error：顯示失敗、結束 Worker，重試開新的', async () => {
    const { hq, workers } = setup()
    await hq.init()
    hq.startDownload()
    workers[0].fail()
    await flush()
    expect(hq.status()).toEqual({ kind: 'failed' })
    expect(workers[0].terminated).toBe(true)
    hq.startDownload()
    expect(workers).toHaveLength(2)
  })

  it('已下載、播放時載入 Worker 發 error：load reject（交給發音服務退回內建聲音）', async () => {
    const { hq, workers, deps } = setup()
    deps.storage.setItem('lg.ttsHq.downloaded', '1')
    await hq.init()
    const p = hq.load()
    workers[0].fail()
    await expect(p).rejects.toThrow()
    expect(deps.session.getItem('lg.ttsHqLoading')).toBeNull()
  })

  it('訊息無法解讀（messageerror）也算失敗', async () => {
    const { hq, workers } = setup()
    await hq.init()
    hq.startDownload()
    workers[0].onmessageerror!(new MessageEvent('messageerror'))
    await flush()
    expect(hq.status()).toEqual({ kind: 'failed' })
  })

  it('一段時間沒有任何回音（逾時）：失敗；有進度就重新計時', async () => {
    vi.useFakeTimers()
    try {
      const { hq, workers } = setup({ idleTimeoutMs: 1000 })
      await hq.init()
      hq.startDownload()
      await vi.advanceTimersByTimeAsync(900)
      workers[0].emit({ type: 'progress', progress: 0.1 })
      await vi.advanceTimersByTimeAsync(900)
      expect(hq.status()).toEqual({ kind: 'downloading', progress: 0.1 })
      await vi.advanceTimersByTimeAsync(200)
      expect(hq.status()).toEqual({ kind: 'failed' })
      expect(workers[0].terminated).toBe(true)
    } finally {
      vi.useRealTimers()
    }
  })
})

describe('載入與崩潰旗標', () => {
  async function downloaded() {
    const s = setup()
    s.deps.storage.setItem('lg.ttsHq.downloaded', '1')
    s.deps.storage.setItem('lg.ttsVoice', 'hq')
    await s.hq.init()
    return s
  }

  it('載入期間掛著旗標，載入完成就清掉', async () => {
    const { hq, workers, deps } = await downloaded()
    const p = hq.load()
    expect(deps.session.getItem('lg.ttsHqLoading')).toBe('1')
    workers[0].emit({ type: 'ready' })
    await p
    expect(deps.session.getItem('lg.ttsHqLoading')).toBeNull()
  })

  it('上次載入到一半分頁被關掉（旗標還在）：這次直接失敗，不再載入', async () => {
    const { hq, workers, deps } = await downloaded()
    deps.session.setItem('lg.ttsHqLoading', '1')
    await expect(hq.load()).rejects.toThrow()
    expect(workers).toHaveLength(0)
  })

  it('播放時載入：10 秒內沒有任何回音就失敗，不用等 90 秒（TASK-22 移交 TASK-13 P2）', async () => {
    vi.useFakeTimers()
    try {
      const { hq, workers } = await downloaded()
      const p = hq.load()
      const rejected = expect(p).rejects.toThrow('逾時')
      await vi.advanceTimersByTimeAsync(10_000)
      await rejected
      expect(workers[0].terminated).toBe(true)
    } finally {
      vi.useRealTimers()
    }
  })

  it('播放時載入：10 秒內有回音後改回一般逾時（90 秒沒進度才失敗）', async () => {
    vi.useFakeTimers()
    try {
      const { hq, workers } = await downloaded()
      let failed = false
      void hq.load().catch(() => (failed = true))
      await vi.advanceTimersByTimeAsync(9_000)
      workers[0].emit({ type: 'progress', progress: 0.5 })
      await vi.advanceTimersByTimeAsync(80_000)
      expect(failed).toBe(false)
      await vi.advanceTimersByTimeAsync(10_000)
      expect(failed).toBe(true)
    } finally {
      vi.useRealTimers()
    }
  })

  it('載入失敗：旗標清掉、狀態維持已下載（不是下載問題）', async () => {
    const { hq, workers, deps } = await downloaded()
    const p = hq.load()
    workers[0].emit({ type: 'error', message: 'webgpu device lost' })
    await expect(p).rejects.toThrow('webgpu device lost')
    expect(deps.session.getItem('lg.ttsHqLoading')).toBeNull()
    expect(hq.status()).toEqual({ kind: 'downloaded' })
  })
})

describe('合成與快取', () => {
  async function ready() {
    const s = setup()
    s.deps.storage.setItem('lg.ttsHq.downloaded', '1')
    await s.hq.init()
    const p = s.hq.load()
    s.workers[0].emit({ type: 'ready' })
    return { ...s, engine: await p }
  }

  it('念一句：送語速給 Worker、播放回傳的音檔', async () => {
    const { engine, workers, played } = await ready()
    const p = engine.speak('Hello.', 0.8)
    await flush()
    expect(workers[0].sent.at(-1)).toEqual({ type: 'speak', id: 1, text: 'Hello.', speed: 0.8 })
    const wav = new ArrayBuffer(8)
    workers[0].emit({ type: 'audio', id: 1, wav })
    await p
    expect(played).toEqual([wav])
  })

  it('同一句同語速第二次直接用快取，不再合成', async () => {
    const { engine, workers, played } = await ready()
    const p = engine.speak('Hello.', 1)
    await flush()
    workers[0].emit({ type: 'audio', id: 1, wav: new ArrayBuffer(4) })
    await p
    const before = workers[0].sent.length
    await engine.speak('Hello.', 1)
    expect(workers[0].sent).toHaveLength(before)
    expect(played).toHaveLength(2)
  })

  it('合成久無回應（30 秒）：reject 並結束 Worker，下次重開（TASK-22 移交 TASK-13 P2）', async () => {
    vi.useFakeTimers()
    try {
      const { engine, workers } = await ready()
      const p = engine.speak('Hello.', 1)
      const rejected = expect(p).rejects.toThrow('逾時')
      await vi.advanceTimersByTimeAsync(30_000)
      await rejected
      expect(workers[0].terminated).toBe(true)
    } finally {
      vi.useRealTimers()
    }
  })

  it('合成失敗：reject（交給發音服務退回內建聲音）', async () => {
    const { engine, workers } = await ready()
    const p = engine.speak('Hello.', 1)
    await flush()
    workers[0].emit({ type: 'speakError', id: 1, message: 'oom' })
    await expect(p).rejects.toThrow('oom')
  })
})
