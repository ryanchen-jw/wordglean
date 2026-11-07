// TASK-13 AC#1：發音服務的引擎選擇與退回邏輯（以 mock 引擎驗）
// 規則來源：規格 §2（預設手機內建聲音、高音質為選配）、voice-poc §5（載入失敗自動退回內建聲音並提示）
import { describe, expect, it, vi } from 'vitest'
import { createTts, type VoiceEngine } from './tts'

function engine(fail = false): VoiceEngine & { speak: ReturnType<typeof vi.fn> } {
  return {
    speak: vi.fn(() => (fail ? Promise.reject(new Error('boom')) : Promise.resolve())),
    cancel: vi.fn(),
  }
}

describe('createTts', () => {
  it('預設用內建聲音、正常語速 1.0', async () => {
    const system = engine()
    const tts = createTts({ system, wantHq: () => false })
    expect(await tts.speak('Hello.')).toBe('system')
    expect(system.speak).toHaveBeenCalledWith('Hello.', 1)
    expect(tts.engine()).toBe('system')
  })

  it('慢速播放用 0.8', async () => {
    const system = engine()
    const tts = createTts({ system, wantHq: () => false })
    await tts.speak('Hello.', { rate: 0.8 })
    expect(system.speak).toHaveBeenCalledWith('Hello.', 0.8)
  })

  it('沒選高音質時不載入高音質模型', async () => {
    const loadHq = vi.fn(() => Promise.resolve(engine()))
    const tts = createTts({ system: engine(), loadHq, wantHq: () => false })
    await tts.speak('Hi.')
    expect(loadHq).not.toHaveBeenCalled()
  })

  it('選了高音質且載入成功：用高音質、不用內建聲音、不提示', async () => {
    const system = engine()
    const hq = engine()
    const tts = createTts({ system, loadHq: () => Promise.resolve(hq), wantHq: () => true })
    const notice = vi.fn()
    tts.onNotice(notice)
    expect(await tts.speak('Hi.', { rate: 0.8 })).toBe('hq')
    expect(hq.speak).toHaveBeenCalledWith('Hi.', 0.8)
    expect(system.speak).not.toHaveBeenCalled()
    expect(notice).not.toHaveBeenCalled()
    expect(tts.engine()).toBe('hq')
  })

  it('高音質載入失敗：這一句改用內建聲音、提示一次；之後不再重試載入、不重複提示', async () => {
    const system = engine()
    const loadHq = vi.fn(() => Promise.reject(new Error('download failed')))
    const tts = createTts({ system, loadHq, wantHq: () => true })
    const notice = vi.fn()
    tts.onNotice(notice)

    expect(await tts.speak('One.')).toBe('system')
    expect(system.speak).toHaveBeenCalledWith('One.', 1)
    expect(notice).toHaveBeenCalledTimes(1)
    expect(notice).toHaveBeenCalledWith({ kind: 'hqFailed' })
    expect(tts.engine()).toBe('system')
    expect(tts.hqFailed()).toBe(true)

    expect(await tts.speak('Two.')).toBe('system')
    expect(loadHq).toHaveBeenCalledTimes(1)
    expect(notice).toHaveBeenCalledTimes(1)
  })

  it('高音質合成失敗（已載入）：同樣退回內建聲音並提示', async () => {
    const system = engine()
    const tts = createTts({
      system,
      loadHq: () => Promise.resolve(engine(true)),
      wantHq: () => true,
    })
    const notice = vi.fn()
    tts.onNotice(notice)
    expect(await tts.speak('Hi.')).toBe('system')
    expect(system.speak).toHaveBeenCalledWith('Hi.', 1)
    expect(notice).toHaveBeenCalledWith({ kind: 'hqFailed' })
  })

  it('同時按兩次只載入一次高音質模型', async () => {
    const loadHq = vi.fn(() => Promise.resolve(engine()))
    const tts = createTts({ system: engine(), loadHq, wantHq: () => true })
    await Promise.all([tts.speak('A.'), tts.speak('B.')])
    expect(loadHq).toHaveBeenCalledTimes(1)
  })

  describe('等待中重複按：以最後一次為準（TASK-31）', () => {
    function slowLoad() {
      const hq = engine()
      let finish: (ok: boolean) => void = () => {}
      const loadHq = vi.fn(
        () =>
          new Promise<VoiceEngine>((resolve, reject) => {
            finish = (ok) => (ok ? resolve(hq) : reject(new Error('load failed')))
          }),
      )
      return { hq, loadHq, finish: (ok: boolean) => finish(ok) }
    }

    it('模型載入中連按同一句三次：載入完只念一次', async () => {
      const { hq, loadHq, finish } = slowLoad()
      const tts = createTts({ system: engine(), loadHq, wantHq: () => true })
      const all = [tts.speak('A.'), tts.speak('A.'), tts.speak('A.')]
      finish(true)
      await Promise.all(all)
      expect(loadHq).toHaveBeenCalledTimes(1)
      expect(hq.speak).toHaveBeenCalledTimes(1)
    })

    it('模型載入中改按另一句：只念最後按的那一句，舊句不出聲', async () => {
      const { hq, loadHq, finish } = slowLoad()
      const tts = createTts({ system: engine(), loadHq, wantHq: () => true })
      const all = [tts.speak('A.'), tts.speak('B.', { rate: 0.8 })]
      finish(true)
      await Promise.all(all)
      expect(hq.speak.mock.calls).toEqual([['B.', 0.8]])
    })

    it('模型載入失敗：只有最後一句退回內建聲音、提示一次；舊請求的 promise 也正常結束', async () => {
      const { loadHq, finish } = slowLoad()
      const system = engine()
      const tts = createTts({ system, loadHq, wantHq: () => true })
      const notice = vi.fn()
      tts.onNotice(notice)
      const all = [tts.speak('A.'), tts.speak('B.'), tts.speak('C.')]
      finish(false)
      await Promise.all(all)
      expect(system.speak.mock.calls).toEqual([['C.', 1]])
      expect(notice).toHaveBeenCalledTimes(1)
      expect(tts.hqFailed()).toBe(true)
    })

    it('被取代的舊句合成失敗：不念舊句、不判高音質失敗，最後一句照念', async () => {
      const system = engine()
      const hq = engine()
      let failA = () => {}
      let finishB = () => {}
      hq.speak.mockImplementation((text: string) =>
        text === 'A.'
          ? new Promise<void>((_, reject) => (failA = () => reject(new Error('oom'))))
          : new Promise<void>((resolve) => (finishB = resolve)),
      )
      const tts = createTts({ system, loadHq: () => Promise.resolve(hq), wantHq: () => true })
      const notice = vi.fn()
      tts.onNotice(notice)
      const a = tts.speak('A.')
      await vi.waitFor(() => expect(hq.speak).toHaveBeenCalledTimes(1))
      const b = tts.speak('B.')
      await vi.waitFor(() => expect(hq.speak).toHaveBeenCalledTimes(2))
      failA()
      await a
      finishB()
      expect(await b).toBe('hq')
      expect(system.speak).not.toHaveBeenCalled()
      expect(notice).not.toHaveBeenCalled()
      expect(tts.hqFailed()).toBe(false)
    })

    it('最後一句合成失敗：這一句退回內建聲音並提示一次', async () => {
      const system = engine()
      const tts = createTts({
        system,
        loadHq: () => Promise.resolve(engine(true)),
        wantHq: () => true,
      })
      const notice = vi.fn()
      tts.onNotice(notice)
      await Promise.all([tts.speak('A.'), tts.speak('B.')])
      expect(system.speak.mock.calls).toEqual([['B.', 1]])
      expect(notice).toHaveBeenCalledTimes(1)
    })
  })

  describe('取消（離開畫面，TASK-32）', () => {
    it('模型載入中取消：載入完不念、不退回內建聲音、不提示；下一次發音正常', async () => {
      const hq = engine()
      let finish = () => {}
      const loadHq = vi.fn(() => new Promise<VoiceEngine>((r) => (finish = () => r(hq))))
      const system = engine()
      const tts = createTts({ system, loadHq, wantHq: () => true })
      const notice = vi.fn()
      tts.onNotice(notice)
      const a = tts.speak('A.')
      tts.cancel()
      finish()
      expect(await a).toBe('superseded')
      expect(hq.speak).not.toHaveBeenCalled()
      expect(system.speak).not.toHaveBeenCalled()
      expect(notice).not.toHaveBeenCalled()
      expect(tts.hqFailed()).toBe(false)
      expect(await tts.speak('B.')).toBe('hq')
      expect(hq.speak.mock.calls).toEqual([['B.', 1]])
    })

    it('高音質合成或念的途中取消：停止高音質；因取消而失敗也不退回、不判失敗', async () => {
      const system = engine()
      const hq = engine()
      let failA = () => {}
      hq.speak.mockImplementationOnce(
        () => new Promise<void>((_, reject) => (failA = () => reject(new Error('stopped')))),
      )
      const tts = createTts({ system, loadHq: () => Promise.resolve(hq), wantHq: () => true })
      const notice = vi.fn()
      tts.onNotice(notice)
      const a = tts.speak('A.')
      await vi.waitFor(() => expect(hq.speak).toHaveBeenCalledTimes(1))
      vi.mocked(hq.cancel).mockClear()
      tts.cancel()
      await vi.waitFor(() => expect(hq.cancel).toHaveBeenCalledTimes(1))
      failA()
      expect(await a).toBe('superseded')
      expect(system.speak).not.toHaveBeenCalled()
      expect(notice).not.toHaveBeenCalled()
      expect(tts.hqFailed()).toBe(false)
    })

    it('內建聲音念的途中取消：立即停止', async () => {
      const system = engine()
      const tts = createTts({ system, wantHq: () => false })
      await tts.speak('A.')
      vi.mocked(system.cancel).mockClear()
      tts.cancel()
      expect(system.cancel).toHaveBeenCalledTimes(1)
    })
  })

  it('播放新的一句前先停掉正在念的', async () => {
    const system = engine()
    const tts = createTts({ system, wantHq: () => false })
    await tts.speak('A.')
    expect(system.cancel).toHaveBeenCalled()
  })

  it('瀏覽器沒有內建聲音、也沒選高音質：靜默略過（發音鈕永遠可按）', async () => {
    const tts = createTts({ system: null, wantHq: () => false })
    expect(await tts.speak('Hi.')).toBe('none')
  })

  it('取消訂閱後不再收到提示', async () => {
    const tts = createTts({
      system: engine(),
      loadHq: () => Promise.reject(new Error('x')),
      wantHq: () => true,
    })
    const notice = vi.fn()
    tts.onNotice(notice)()
    await tts.speak('Hi.')
    expect(notice).not.toHaveBeenCalled()
  })
})
