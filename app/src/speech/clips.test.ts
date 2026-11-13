// 預先產生的發音（TASK-35）：文字正規化、包格式、文字 → 包（已載入／課綱字→課／字典包）、等待上限、播放與慢速
import { describe, expect, it, vi } from 'vitest'
import { clipKey, dictPackName, dictPackOf, lessonClipTexts, wordClipKey } from './clipKey'
import { decodePack, encodePack } from './clipPack'
import { createClips, type ClipDeps } from './clips'

const mp3 = (s: string) => new TextEncoder().encode(s)

describe('clipKey', () => {
  it('NFC、彎引號換直引號、空白併成一個；句子保留大小寫與標點', () => {
    expect(clipKey('  It’s  “fine”? ')).toBe(`It's "fine"?`)
  })

  it('字與片語轉小寫', () => {
    expect(wordClipKey(' Look  Forward to ')).toBe('look forward to')
  })

  it('一課要發音的文字：單字卡的字、聽打／跟讀句、聽選音檔；同課重複只留一份；例句與其他題型不念', () => {
    expect(
      lessonClipTexts([
        { type: 'wordCard', word: 'March', sentenceEn: 'not me' },
        { type: 'listenType', sentenceEn: 'We have lunch.' },
        { type: 'listenChoice', audioEn: 'Tom is here.' },
        { type: 'shadowing', sentenceEn: 'We have lunch.' },
        { type: 'mcq', sentenceEn: 'ignored' },
      ]),
    ).toEqual(['march', 'We have lunch.', 'Tom is here.'])
  })

  it('字典包編號固定（content 產生與 App 播放必須算出同一包）', () => {
    expect(dictPackOf('well-known')).toBe(dictPackOf('well-known'))
    expect(dictPackOf('well-known')).toBeLessThan(512)
    expect(dictPackName(7)).toBe('d007')
    // 字面值（另以 Python 算 FNV-1a 32 位元核對）：0x43d5685b % 512 = 91
    expect(dictPackOf('well-known')).toBe(91)
  })
})

describe('clipPack', () => {
  it('寫入再讀回：標頭與每段位元組相同', () => {
    const buf = encodePack({ bitrate: '48k' }, [
      { text: 'a', mp3: mp3('AAA') },
      { text: 'b c', mp3: mp3('BB') },
    ])
    const { header, clips } = decodePack(buf.buffer as ArrayBuffer)
    expect(header.gen).toEqual({ bitrate: '48k' })
    expect(new TextDecoder().decode(clips.get('a'))).toBe('AAA')
    expect(new TextDecoder().decode(clips.get('b c'))).toBe('BB')
  })

  it('格式不符就丟錯', () => {
    expect(() => decodePack(new Uint8Array(12))).toThrow('音檔包格式不符')
  })
})

function fakeAudio() {
  const el = {
    src: '',
    dataset: {} as Record<string, string>,
    playbackRate: 1,
    defaultPlaybackRate: 1,
    onended: null as null | (() => void),
    onerror: null as null | (() => void),
    pause: vi.fn(),
    play: vi.fn(async () => {
      setTimeout(() => el.onended?.(), 0)
    }),
  }
  return el
}

function setup(over: Partial<ClipDeps> = {}) {
  const packs: Record<string, Uint8Array> = {
    'a1-u01-l01': encodePack({}, [
      { text: 'be', mp3: mp3('be') },
      { text: 'Tom is here.', mp3: mp3('s1') },
    ]),
    [dictPackName(dictPackOf('well-known'))]: encodePack({}, [
      { text: 'well-known', mp3: mp3('wk') },
    ]),
  }
  const fetchPack = vi.fn(async (url: string) => packs[url].slice().buffer as ArrayBuffer)
  const audio = fakeAudio()
  const engine = createClips({
    packUrl: async (id) => (packs[id] ? id : null),
    fetchPack,
    lessonOfWord: async (w) => (w === 'be' ? 'a1-u01-l01' : null),
    createAudio: () => audio as unknown as HTMLAudioElement,
    waitMs: 50,
    ...over,
  })
  return { engine, fetchPack, audio }
}

const text = (c: { bytes: Uint8Array } | null) => c && new TextDecoder().decode(c.bytes)

describe('createClips', () => {
  it('課綱的字：依字→課抓那課的包；大小寫不同也對得到', async () => {
    const { engine, fetchPack } = setup()
    expect(text(await engine.find('Be'))).toBe('be')
    expect(fetchPack).toHaveBeenCalledTimes(1)
  })

  it('已載入的包直接查、不重抓；句子要課先 prefetch 過', async () => {
    const { engine, fetchPack } = setup()
    expect(await engine.find('Tom is here.')).toBeNull()
    engine.prefetch(['a1-u01-l01'])
    expect(text(await engine.find('Tom  is here.'))).toBe('s1')
    expect(text(await engine.find('be'))).toBe('be')
    expect(fetchPack).toHaveBeenCalledTimes(1)
  })

  it('含連字號的字：從字典專用包找（不需字→課）', async () => {
    const { engine } = setup()
    expect(text(await engine.find('Well-known'))).toBe('wk')
  })

  it('課綱外、字典包也沒有的字：null（改用內建聲音）', async () => {
    const { engine } = setup()
    expect(await engine.find('zebra')).toBeNull()
    expect(await engine.find('half-baked')).toBeNull()
  })

  it('包抓太久：等到上限就回 null，包到了之後下一次就有', async () => {
    let release = () => {}
    const gate = new Promise<void>((r) => (release = r))
    const { engine, fetchPack } = setup()
    const slow = fetchPack.getMockImplementation()!
    fetchPack.mockImplementationOnce(async (url) => {
      await gate
      return slow(url)
    })
    expect(await engine.find('be')).toBeNull()
    release()
    await vi.waitFor(async () => expect(text(await engine.find('be'))).toBe('be'))
  })

  it('抓包失敗（離線）：null，下次再試', async () => {
    const { engine, fetchPack } = setup()
    fetchPack.mockRejectedValueOnce(new Error('offline'))
    expect(await engine.find('be')).toBeNull()
    expect(text(await engine.find('be'))).toBe('be')
  })

  it('播放：重用同一個 audio 元素、慢速設 playbackRate、標記播的文字', async () => {
    const { engine, audio } = setup()
    const clip = (await engine.find('be'))!
    await engine.play(clip, 0.8)
    expect(audio.playbackRate).toBe(0.8)
    expect(audio.defaultPlaybackRate).toBe(0.8)
    expect(audio.dataset.clip).toBe('be')
    await engine.play(clip, 1)
    expect(audio.playbackRate).toBe(1)
    expect(audio.play).toHaveBeenCalledTimes(2)
  })

  it('播放被擋（例如自動播放限制）：reject，由 tts 改用內建聲音', async () => {
    const { engine, audio } = setup()
    audio.play.mockRejectedValueOnce(new Error('NotAllowedError'))
    await expect(engine.play((await engine.find('be'))!, 1)).rejects.toThrow('NotAllowedError')
  })

  it('stop：暫停並讓正在播的 promise 結束', async () => {
    const { engine, audio } = setup()
    audio.play.mockImplementationOnce(async () => {})
    const p = engine.play((await engine.find('be'))!, 1)
    engine.stop()
    await expect(p).resolves.toBeUndefined()
    expect(audio.pause).toHaveBeenCalled()
  })
})
