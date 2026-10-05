// 語音辨識服務（主執行緒端）：下載／載入狀態、分時載入（沒人持有就釋放 Worker）、辨識；Worker 為假
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { createSttClient, sttDownloadStatus, type SttState } from './stt'

class FakeWorker {
  sent: { msg: { id: number; cmd: string; samples?: Float32Array }; transfer: Transferable[] }[] =
    []
  terminated = false
  onmessage: ((e: MessageEvent) => void) | null = null
  onerror: ((e: ErrorEvent) => void) | null = null
  postMessage(msg: { id: number; cmd: string }, transfer: Transferable[] = []) {
    this.sent.push({ msg, transfer })
  }
  terminate() {
    this.terminated = true
  }
  reply(data: unknown) {
    this.onmessage?.({ data } as MessageEvent)
  }
  last() {
    return this.sent[this.sent.length - 1].msg
  }
}

function setup(cached = false) {
  const workers: FakeWorker[] = []
  const client = createSttClient({
    createWorker: () => {
      const w = new FakeWorker()
      workers.push(w)
      return w as unknown as Worker
    },
    isCached: async () => cached,
  })
  const states: SttState['kind'][] = []
  client.subscribe(() => states.push(client.get().kind))
  return { client, workers, states }
}

const flush = () => new Promise((r) => setTimeout(r, 0))

describe('createSttClient', () => {
  it('查快取：沒有＝未下載、有＝已下載', async () => {
    const a = setup(false)
    await a.client.refresh()
    expect(a.client.get()).toEqual({ kind: 'notDownloaded' })
    const b = setup(true)
    await b.client.refresh()
    expect(b.client.get()).toEqual({ kind: 'downloaded' })
  })

  it('第一次下載：進度 → 完成；沒人持有就在載入完後釋放 Worker（設定頁單純下載）', async () => {
    const { client, workers, states } = setup(false)
    await client.refresh()
    const loading = client.load()
    expect(client.get()).toEqual({ kind: 'downloading', progress: 0 })
    const w = workers[0]
    expect(w.last().cmd).toBe('load')
    w.reply({ type: 'progress', fraction: 0.42 })
    expect(client.get()).toEqual({ kind: 'downloading', progress: 0.42 })
    w.reply({ type: 'result', id: w.last().id, result: { device: 'wasm' } })
    await loading
    expect(w.terminated).toBe(true)
    expect(client.get()).toEqual({ kind: 'downloaded' })
    expect(states).toEqual(['notDownloaded', 'downloading', 'downloading', 'ready', 'downloaded'])
  })

  it('下載到 100%：改為「準備中」（不再是下載中）；載入完成即可用（創辦人試用 2026-10-04 ①）', async () => {
    const { client, workers, states } = setup(false)
    await client.refresh()
    client.acquire()
    const loading = client.load()
    const w = workers[0]
    w.reply({ type: 'progress', fraction: 0.5 })
    w.reply({ type: 'progress', fraction: 1 })
    expect(client.get()).toEqual({ kind: 'loading' })
    w.reply({ type: 'result', id: w.last().id, result: { device: 'wasm' } })
    await loading
    expect(client.get()).toEqual({ kind: 'ready' })
    expect(states).toEqual(['notDownloaded', 'downloading', 'downloading', 'loading', 'ready'])
  })

  it('已下載過：載入中 → 可用；持有期間留著 Worker，放手才釋放', async () => {
    const { client, workers } = setup(true)
    await client.refresh()
    const release = client.acquire()
    const loading = client.load()
    expect(client.get()).toEqual({ kind: 'loading' })
    const w = workers[0]
    w.reply({ type: 'progress', fraction: 1 }) // 讀快取時的進度不影響狀態
    expect(client.get()).toEqual({ kind: 'loading' })
    w.reply({ type: 'result', id: w.last().id, result: {} })
    await loading
    expect(client.get()).toEqual({ kind: 'ready' })
    expect(w.terminated).toBe(false)
    release()
    expect(w.terminated).toBe(true)
    expect(client.get()).toEqual({ kind: 'downloaded' })
  })

  it('載入進行中重複呼叫只送一次；載入中放手，等載入完再釋放', async () => {
    const { client, workers } = setup(true)
    await client.refresh()
    const release = client.acquire()
    const a = client.load()
    const b = client.load()
    expect(b).toBe(a)
    release()
    const w = workers[0]
    expect(w.sent).toHaveLength(1)
    expect(w.terminated).toBe(false)
    w.reply({ type: 'result', id: w.last().id, result: {} })
    await a
    expect(w.terminated).toBe(true)
  })

  it('下載失敗：狀態為失敗、釋放 Worker、promise 拒絕；之後可重試', async () => {
    const { client, workers } = setup(false)
    await client.refresh()
    const loading = client.load()
    workers[0].reply({ type: 'error', id: workers[0].last().id, error: 'network' })
    await expect(loading).rejects.toThrow('network')
    expect(client.get()).toEqual({ kind: 'failed' })
    expect(workers[0].terminated).toBe(true)
    void client.load().catch(() => undefined)
    expect(workers).toHaveLength(2)
    expect(client.get()).toEqual({ kind: 'downloading', progress: 0 })
  })

  it('辨識：可用前呼叫會失敗；可用時把樣本以 transfer 交給 Worker、回傳文字', async () => {
    const { client, workers } = setup(true)
    await client.refresh()
    await expect(client.transcribe(new Float32Array(4))).rejects.toThrow('尚未載入')
    client.acquire()
    const loading = client.load()
    const w = workers[0]
    w.reply({ type: 'result', id: w.last().id, result: {} })
    await loading
    const samples = new Float32Array(16_000)
    const text = client.transcribe(samples)
    const { msg, transfer } = w.sent[1]
    expect(msg.cmd).toBe('transcribe')
    expect(msg.samples).toBe(samples)
    expect(transfer).toEqual([samples.buffer])
    w.reply({ type: 'result', id: msg.id, result: 'I have a cup of tea' })
    await expect(text).resolves.toBe('I have a cup of tea')
  })

  it('Worker 當掉：進行中的辨識被拒絕', async () => {
    const { client, workers } = setup(true)
    await client.refresh()
    client.acquire()
    const loading = client.load()
    const w = workers[0]
    w.reply({ type: 'result', id: w.last().id, result: {} })
    await loading
    const text = client.transcribe(new Float32Array(1))
    w.onerror?.({} as ErrorEvent)
    await expect(text).rejects.toThrow('Worker')
    await flush()
  })
})

// 創辦人試用 2026-10-05：停在「準備中」不動。Worker 不回應（建模型或暖機卡住）不能無限等，比照 TASK-13 高音質發音的載入逾時
describe('載入逾時（準備中不無限停留）', () => {
  function timed(cached: boolean) {
    const workers: FakeWorker[] = []
    const client = createSttClient({
      createWorker: () => {
        const w = new FakeWorker()
        workers.push(w)
        return w as unknown as Worker
      },
      isCached: async () => cached,
    })
    return { client, workers }
  }

  beforeEach(() => vi.useFakeTimers())
  afterEach(() => vi.useRealTimers())

  it('已下載、載入後 Worker 一直不回應：60 秒轉失敗、釋放 Worker；之後可重試', async () => {
    const { client, workers } = timed(true)
    await client.refresh()
    client.acquire()
    const loading = client.load()
    const settled = loading.catch((e: Error) => e)
    expect(client.get()).toEqual({ kind: 'loading' })
    await vi.advanceTimersByTimeAsync(59_000)
    expect(client.get()).toEqual({ kind: 'loading' })
    await vi.advanceTimersByTimeAsync(1_000)
    expect(await settled).toBeInstanceOf(Error)
    expect(client.get()).toEqual({ kind: 'failed' })
    expect(workers[0].terminated).toBe(true)
    void client.load().catch(() => undefined)
    expect(workers).toHaveLength(2)
  })

  it('下載到 100% 後（準備中）一直不回應：從最後一次進度起 60 秒轉失敗', async () => {
    const { client, workers } = timed(false)
    await client.refresh()
    client.acquire()
    const settled = client.load().catch((e: Error) => e)
    const w = workers[0]
    await vi.advanceTimersByTimeAsync(50_000)
    w.reply({ type: 'progress', fraction: 0.5 })
    await vi.advanceTimersByTimeAsync(50_000)
    w.reply({ type: 'progress', fraction: 1 })
    expect(client.get()).toEqual({ kind: 'loading' })
    await vi.advanceTimersByTimeAsync(59_000)
    expect(client.get()).toEqual({ kind: 'loading' })
    await vi.advanceTimersByTimeAsync(1_000)
    expect(await settled).toBeInstanceOf(Error)
    expect(client.get()).toEqual({ kind: 'failed' })
    expect(w.terminated).toBe(true)
  })

  it('載入成功：可用，之後不會再逾時', async () => {
    const { client, workers } = timed(true)
    await client.refresh()
    client.acquire()
    const loading = client.load()
    const w = workers[0]
    w.reply({ type: 'result', id: w.last().id, result: { device: 'wasm' } })
    await loading
    await vi.advanceTimersByTimeAsync(120_000)
    expect(client.get()).toEqual({ kind: 'ready' })
    expect(w.terminated).toBe(false)
  })

  it('載入中 Worker 執行錯誤：轉失敗、釋放 Worker', async () => {
    const { client, workers } = timed(true)
    await client.refresh()
    client.acquire()
    const settled = client.load().catch((e: Error) => e)
    workers[0].onerror?.({} as ErrorEvent)
    expect(await settled).toBeInstanceOf(Error)
    expect(client.get()).toEqual({ kind: 'failed' })
    expect(workers[0].terminated).toBe(true)
  })
})

describe('sttDownloadStatus（設定頁的下載列）', () => {
  it.each<[SttState, string]>([
    [{ kind: 'unknown' }, 'notDownloaded'],
    [{ kind: 'notDownloaded' }, 'notDownloaded'],
    [{ kind: 'downloading', progress: 0.3 }, 'downloading'],
    [{ kind: 'downloaded' }, 'downloaded'],
    [{ kind: 'loading' }, 'downloaded'],
    [{ kind: 'ready' }, 'downloaded'],
    [{ kind: 'failed' }, 'failed'],
  ])('%o → %s', (s, kind) => {
    expect(sttDownloadStatus(s).kind).toBe(kind)
  })
})

describe('載入中旗標（分頁在載入時被系統關掉的偵測，D8）', () => {
  function withMark(initial: boolean) {
    let on = initial
    const history: boolean[] = []
    const workers: FakeWorker[] = []
    const client = createSttClient({
      createWorker: () => {
        const w = new FakeWorker()
        workers.push(w)
        return w as unknown as Worker
      },
      isCached: async () => true,
      mark: {
        get: () => on,
        set: (v) => {
          on = v
          history.push(v)
        },
      },
    })
    return { client, workers, history, isOn: () => on }
  }

  it('載入時立起、完成後放下', async () => {
    const m = withMark(false)
    await m.client.refresh()
    const loading = m.client.load()
    expect(m.isOn()).toBe(true)
    m.workers[0].reply({ type: 'result', id: m.workers[0].last().id, result: {} })
    await loading
    expect(m.history).toEqual([true, false])
  })

  it('重開時旗標還在＝上次載入到一半被關掉：當作載入失敗（可重試），並清掉旗標', async () => {
    const m = withMark(true)
    await m.client.refresh()
    expect(m.client.get()).toEqual({ kind: 'failed' })
    expect(m.isOn()).toBe(false)
  })
})
