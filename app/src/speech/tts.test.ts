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
