// 發音服務的引擎選擇與退回邏輯（以 mock 引擎驗）：TASK-35 起優先播預先產生的音檔，沒有或失敗才用手機內建聲音；
// 連按以最後一次為準（TASK-31）、離開畫面取消（TASK-32）的語意沿用
import { describe, expect, it, vi } from 'vitest'
import { createTts, type ClipSource, type VoiceEngine } from './tts'

function engine(fail = false): VoiceEngine & { speak: ReturnType<typeof vi.fn> } {
  return {
    speak: vi.fn(() => (fail ? Promise.reject(new Error('boom')) : Promise.resolve())),
    cancel: vi.fn(),
  }
}

/** 預產音檔：have 列出的文字有音檔；find／play 可改成手動控制 */
function clips(have: string[] = []) {
  const c = {
    find: vi.fn(async (text: string) => (have.includes(text) ? `clip:${text}` : null)),
    play: vi.fn<(clip: string, rate: number) => Promise<void>>(() => Promise.resolve()),
    stop: vi.fn(),
  }
  return c satisfies ClipSource<string>
}

/** find 等到手動放行才回（包還在下載） */
function slowFind(c: ReturnType<typeof clips>) {
  const pending: (() => void)[] = []
  c.find.mockImplementation(
    (text: string) => new Promise<string | null>((r) => pending.push(() => r(`clip:${text}`))),
  )
  return () => pending.splice(0).forEach((f) => f())
}

describe('createTts', () => {
  it('有預產音檔：播音檔、不用內建聲音', async () => {
    const system = engine()
    const c = clips(['Hello.'])
    const tts = createTts({ system, clips: c })
    expect(await tts.speak('Hello.')).toBe('clip')
    expect(c.play).toHaveBeenCalledWith('clip:Hello.', 1)
    expect(system.speak).not.toHaveBeenCalled()
  })

  it('慢速播放：音檔與內建聲音都用 0.8', async () => {
    const system = engine()
    const c = clips(['Slow.'])
    const tts = createTts({ system, clips: c })
    await tts.speak('Slow.', { rate: 0.8 })
    expect(c.play).toHaveBeenCalledWith('clip:Slow.', 0.8)
    await tts.speak('Other.', { rate: 0.8 })
    expect(system.speak).toHaveBeenCalledWith('Other.', 0.8)
  })

  it('沒有對應音檔：這一句用內建聲音；下一句有音檔照樣播音檔（逐句判斷）', async () => {
    const system = engine()
    const c = clips(['Two.'])
    const tts = createTts({ system, clips: c })
    expect(await tts.speak('One.')).toBe('system')
    expect(system.speak).toHaveBeenCalledWith('One.', 1)
    expect(await tts.speak('Two.')).toBe('clip')
  })

  it('音檔載入或播放失敗：這一句改用內建聲音、不出錯', async () => {
    const system = engine()
    const c = clips(['A.'])
    c.play.mockRejectedValueOnce(new Error('NotAllowedError'))
    const tts = createTts({ system, clips: c })
    expect(await tts.speak('A.')).toBe('system')
    c.find.mockRejectedValueOnce(new Error('network'))
    expect(await tts.speak('A.')).toBe('system')
    expect(system.speak.mock.calls).toEqual([
      ['A.', 1],
      ['A.', 1],
    ])
    expect(await tts.speak('A.')).toBe('clip')
  })

  it('不能播音檔的瀏覽器（clips＝null）：用內建聲音', async () => {
    const system = engine()
    const tts = createTts({ system, clips: null })
    expect(await tts.speak('Hi.')).toBe('system')
  })

  it('瀏覽器沒有內建聲音、也沒有音檔：靜默略過（發音鈕永遠可按）', async () => {
    const tts = createTts({ system: null, clips: clips() })
    expect(await tts.speak('Hi.')).toBe('none')
  })

  it('播放新的一句前先停掉正在念的（音檔與內建聲音）', async () => {
    const system = engine()
    const c = clips()
    const tts = createTts({ system, clips: c })
    await tts.speak('A.')
    expect(system.cancel).toHaveBeenCalled()
    expect(c.stop).toHaveBeenCalled()
  })

  describe('等待中重複按：以最後一次為準（TASK-31）', () => {
    it('音檔包下載中連按同一句三次：下載完只念一次', async () => {
      const c = clips()
      const release = slowFind(c)
      const tts = createTts({ system: engine(), clips: c })
      const all = [tts.speak('A.'), tts.speak('A.'), tts.speak('A.')]
      release()
      expect(await Promise.all(all)).toEqual(['superseded', 'superseded', 'clip'])
      expect(c.play).toHaveBeenCalledTimes(1)
    })

    it('下載中改按另一句：只念最後按的那一句，舊句不出聲', async () => {
      const c = clips()
      const release = slowFind(c)
      const system = engine()
      const tts = createTts({ system, clips: c })
      const all = [tts.speak('A.'), tts.speak('B.', { rate: 0.8 })]
      release()
      await Promise.all(all)
      expect(c.play.mock.calls).toEqual([['clip:B.', 0.8]])
      expect(system.speak).not.toHaveBeenCalled()
    })

    it('被取代的舊句查找失敗：不念舊句、不改用內建聲音，最後一句照念', async () => {
      const c = clips(['B.'])
      let failA = () => {}
      c.find.mockImplementationOnce(
        () => new Promise<string | null>((_, reject) => (failA = () => reject(new Error('x')))),
      )
      const system = engine()
      const tts = createTts({ system, clips: c })
      const a = tts.speak('A.')
      const b = tts.speak('B.')
      failA()
      expect(await a).toBe('superseded')
      expect(await b).toBe('clip')
      expect(system.speak).not.toHaveBeenCalled()
    })

    it('念到一半被新的一句取代：舊句回 superseded，新句照念', async () => {
      const c = clips(['A.', 'B.'])
      let endA = () => {}
      c.play.mockImplementationOnce(() => new Promise<void>((r) => (endA = r)))
      c.stop.mockImplementation(() => endA())
      const tts = createTts({ system: engine(), clips: c })
      const a = tts.speak('A.')
      await vi.waitFor(() => expect(c.play).toHaveBeenCalledTimes(1))
      const b = tts.speak('B.')
      expect(await a).toBe('superseded')
      expect(await b).toBe('clip')
    })
  })

  describe('取消（離開畫面，TASK-32）', () => {
    it('音檔包下載中取消：下載完不念、不改用內建聲音；下一次發音正常', async () => {
      const c = clips()
      const release = slowFind(c)
      const system = engine()
      const tts = createTts({ system, clips: c })
      const a = tts.speak('A.')
      tts.cancel()
      release()
      expect(await a).toBe('superseded')
      expect(c.play).not.toHaveBeenCalled()
      expect(system.speak).not.toHaveBeenCalled()
      c.find.mockImplementation(async (text: string) => `clip:${text}`)
      expect(await tts.speak('B.')).toBe('clip')
      expect(c.play.mock.calls).toEqual([['clip:B.', 1]])
    })

    it('音檔播放途中取消：立即停止；因取消而失敗也不改用內建聲音', async () => {
      const c = clips(['A.'])
      let failA = () => {}
      c.play.mockImplementationOnce(
        () => new Promise<void>((_, reject) => (failA = () => reject(new Error('stopped')))),
      )
      const system = engine()
      const tts = createTts({ system, clips: c })
      const a = tts.speak('A.')
      await vi.waitFor(() => expect(c.play).toHaveBeenCalledTimes(1))
      c.stop.mockClear()
      tts.cancel()
      expect(c.stop).toHaveBeenCalledTimes(1)
      failA()
      expect(await a).toBe('superseded')
      expect(system.speak).not.toHaveBeenCalled()
    })

    it('內建聲音念的途中取消：立即停止', async () => {
      const system = engine()
      const tts = createTts({ system, clips: null })
      await tts.speak('A.')
      vi.mocked(system.cancel).mockClear()
      tts.cancel()
      expect(system.cancel).toHaveBeenCalledTimes(1)
    })
  })
})
