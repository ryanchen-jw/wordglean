import 'fake-indexeddb/auto'
import { act, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { db } from '../../data/appDb'
import type { LessonItemsDoc } from '../../lesson/items'
import { fakeRecognition } from '../../speech/fakeRecognition'
import type { LiveMic } from '../../speech/liveMic'
import { MicDeniedError, type MicPermission } from '../../speech/mic'
import { SpeechContext, type SpeechServices } from '../../speech/services'
import type { SttClient, SttState } from '../../speech/stt'
import { isSttUsable } from '../../speech/usable'
import { createWebSpeech, type WebSpeech } from '../../speech/webSpeech'
import { stubCurriculumFetch } from '../../test/curriculumFetch'
import { LessonScreen } from './LessonScreen'

// TASK-40 即時跟讀（設計 docs/pending/2026-11-13-live-shadowing/ design.md §5、mockup.html 各狀態）；期望文案取自 mockup 與 zh-TW.json。
// 計分：整句完成＝答對、跳過＝答錯；紀錄只存每輪聽到的文字摘要
const LESSON = 'a1-u01-l01'
const TARGET = 'I want to eat dinner.'
const doc: LessonItemsDoc = {
  schemaVersion: 1,
  lessonId: LESSON,
  level: 'a1',
  items: [
    { id: 'sh1', type: 'shadowing', sentenceEn: TARGET, sentenceZh: '我想吃晚餐。' },
    {
      id: 'sh2',
      type: 'shadowing',
      sentenceEn: 'I have a cup of tea.',
      sentenceZh: '我有一杯茶。',
    },
  ],
}

/** 假辨識：每輪等 say() 給一句；假即時麥克風：一直有聲音（過音量閘） */
function fakeLive({
  model = 'ready',
  mic = 'granted',
  wasm = true,
  liveMic = true,
  web = createWebSpeech(() => undefined),
}: {
  model?: SttState['kind']
  mic?: MicPermission
  wasm?: boolean
  liveMic?: boolean
  web?: WebSpeech
} = {}) {
  let state = { kind: model } as SttState
  const listeners = new Set<() => void>()
  let pending: ((text: string) => void) | null = null
  const stt: SttClient = {
    get: () => state,
    subscribe: (l) => {
      listeners.add(l)
      return () => listeners.delete(l)
    },
    refresh: async () => {},
    load: vi.fn(async () => {}),
    transcribe: vi.fn(() => new Promise<string>((r) => (pending = r))),
    acquire: vi.fn(() => () => {}),
  }
  const mics: { stop: ReturnType<typeof vi.fn> }[] = []
  const services: SpeechServices = {
    stt,
    moonshineAvailable: () => wasm,
    webSpeech: web,
    sttUsable: () => isSttUsable(mic !== 'unsupported', wasm, web.consented()),
    micPermission: async () => mic,
    requestMic: vi.fn(async () => true),
    startRecording: vi.fn(async () => ({
      stop: async () => new Float32Array(16_000),
      cancel: vi.fn(),
    })),
    liveMicSupported: () => liveMic,
    startLiveMic: vi.fn(async (): Promise<LiveMic> => {
      const m = {
        elapsed: () => 2,
        read: () => new Float32Array(32_000).fill(0.1),
        level: () => 0.5,
        stop: vi.fn(),
      }
      mics.push(m)
      return m
    }),
  }
  /** 這一輪辨識出 text（等辨識迴圈送出下一輪） */
  const say = async (text: string) => {
    await vi.waitFor(() => expect(pending).not.toBeNull())
    const p = pending!
    pending = null
    await act(async () => p(text))
  }
  return {
    services,
    stt,
    mics,
    say,
    set: (s: SttState) => {
      state = s
      listeners.forEach((l) => l())
    },
  }
}

const renderLesson = (services: SpeechServices) =>
  render(
    <SpeechContext.Provider value={services}>
      <LessonScreen lessonId={LESSON} loadItems={async () => doc} />
    </SpeechContext.Provider>,
  )

const button = (name: string | RegExp) => screen.getByRole('button', { name })
const marks = () =>
  screen
    .getAllByTestId('live-word')
    .map((w) => `${w.firstChild?.textContent}:${w.dataset.mark}`)
    .join(' ')
const runResult = async (key: string) => (await db.lessonRuns.get(LESSON))?.results[key]
const startLive = async () =>
  fireEvent.click(await screen.findByRole('button', { name: '開始唸' }, { timeout: 5_000 }))

let clock = 1_000_000
beforeEach(async () => {
  stubCurriculumFetch()
  history.replaceState(null, '', `/lesson/${LESSON}`)
  await db.delete()
  await db.open()
  clock = 1_000_000
  vi.spyOn(Date, 'now').mockImplementation(() => clock)
})
afterEach(() => vi.restoreAllMocks())

describe('即時跟讀：各狀態（mockup ①–④）', () => {
  it('開始前：題型、說明、每個字未完成、中譯、聽示範、開始唸與跳過', async () => {
    renderLesson(fakeLive().services)
    expect(await screen.findByRole('button', { name: '開始唸' }, { timeout: 5_000 })).toBeEnabled()
    expect(screen.getByText('跟讀')).toBeInTheDocument()
    expect(screen.getByText('聽一次，再唸出這句')).toBeInTheDocument()
    expect(marks()).toBe('I:todo want:todo to:todo eat:todo dinner:todo')
    expect(screen.getByTestId('live-sentence')).toHaveTextContent('I want to eat dinner.')
    expect(screen.getByText('我想吃晚餐。')).toBeInTheDocument()
    expect(screen.getByText('點一下開始唸。一個字一個字唸也可以，唸對就會變色')).toBeInTheDocument()
    expect(button('現在不方便說話（這題先跳過）')).toBeInTheDocument()
    expect(screen.queryByTestId('live-tally')).toBeNull()
  })

  it('錄音中：唸對的字（最近 3 輪中 2 輪）變色、已完成計數、聽到什麼；暫停後保留、再按繼續', async () => {
    const f = fakeLive()
    renderLesson(f.services)
    await startLive()
    expect(await screen.findByRole('button', { name: '暫停' })).toBeInTheDocument()
    expect(screen.getByText(/^錄音中・0:00\s點一下暫停$/)).toBeInTheDocument()
    expect(button('這題跳過')).toBeInTheDocument()
    expect(screen.queryByText('聽一次，再唸出這句')).toBeNull()
    await f.say('want to')
    expect(screen.getByTestId('live-heard')).toHaveTextContent('聽到：want to')
    expect(marks()).toBe('I:todo want:todo to:todo eat:todo dinner:todo')
    await f.say('I want to')
    expect(marks()).toBe('I:todo want:done to:done eat:todo dinner:todo')
    expect(screen.getByTestId('live-tally')).toHaveTextContent('已完成 2／5 個字')
    expect(screen.getByTestId('shadowing-live')).toHaveTextContent('完成 want、to，還差 3 個字')
    // 剛唸對的字播放回彈（減少動態效果時 motion-safe 不播）
    expect(screen.getAllByTestId('live-word')[1].className).toContain('lg-word-pop')

    fireEvent.click(button('暫停'))
    expect(await screen.findByText('已暫停，唸對的字都留著。點一下繼續')).toBeInTheDocument()
    expect(f.mics[0].stop).toHaveBeenCalledOnce()
    expect(marks()).toBe('I:todo want:done to:done eat:todo dinner:todo')
    await startLive()
    expect(f.services.startLiveMic).toHaveBeenCalledTimes(2)
  })

  it('幻聽輪次（阿拉伯文、中文、重複迴圈）不顯示在「聽到」、不打斷確認', async () => {
    const f = fakeLive()
    renderLesson(f.services)
    await startLive()
    await f.say('eat')
    for (const junk of [
      'مرحبا',
      '我想吃',
      'all all all',
      'I always use. I always use. I always use.',
    ])
      await f.say(junk)
    expect(screen.getByTestId('live-heard')).toHaveTextContent('聽到：eat')
    await f.say('eat dinner')
    expect(marks()).toBe('I:todo want:todo to:todo eat:done dinner:todo')
  })

  it('整句完成：自動停錄、答對、輕讀字淡色、最長一口氣、紀錄只存每輪文字', async () => {
    const f = fakeLive()
    renderLesson(f.services)
    await startLive()
    await f.say('I want')
    await f.say('I want eat')
    await f.say('eat dinner')
    await f.say('dinner')
    expect(await screen.findByText('整句完成！')).toBeInTheDocument()
    expect(f.mics[0].stop).toHaveBeenCalledOnce()
    expect(marks()).toBe('I:done want:done to:light eat:done dinner:done')
    expect(screen.getByText('輕讀')).toBeInTheDocument()
    expect(screen.getByTestId('live-longest')).toHaveTextContent('最長一口氣：2／5 個字')
    expect(screen.getByText('想練節奏的話，試著一口氣唸完整句。')).toBeInTheDocument()
    expect(button('一口氣再唸一次')).toBeInTheDocument()
    await vi.waitFor(async () => expect((await runResult('sh1'))?.correct).toBe(true))
    const rows = await db.speechCorrections.toArray()
    expect(rows).toHaveLength(1)
    expect(rows[0]).toMatchObject({
      itemId: 'sh1',
      targetText: TARGET,
      recognizedText: 'I want | I want eat | eat dinner | dinner',
      correctedText: '',
    })
    // 完成後不再送辨識
    const calls = vi.mocked(f.stt.transcribe).mock.calls.length
    await new Promise((r) => setTimeout(r, 150))
    expect(vi.mocked(f.stt.transcribe).mock.calls.length).toBe(calls)
    fireEvent.click(button('繼續'))
    expect(await screen.findByText('2／2')).toBeInTheDocument()
  })

  it('一口氣唸完整句：提示很流暢', async () => {
    const f = fakeLive()
    renderLesson(f.services)
    await startLive()
    await f.say('I want to eat dinner')
    await f.say('I want to eat dinner')
    expect(await screen.findByText('整句一口氣唸完，很流暢。')).toBeInTheDocument()
    expect(screen.getByTestId('live-longest')).toHaveTextContent('最長一口氣：5／5 個字')
  })

  it('「一口氣再唸一次」走整句錄音、只當練習：送出不改分數，但記一筆', async () => {
    const f = fakeLive()
    f.stt.transcribe = vi
      .fn()
      .mockResolvedValueOnce('I want to eat dinner')
      .mockResolvedValueOnce('I want to eat dinner')
      .mockResolvedValue('I want lunch')
    renderLesson(f.services)
    await startLive()
    fireEvent.click(await screen.findByRole('button', { name: '一口氣再唸一次' }))
    fireEvent.click(await screen.findByRole('button', { name: '開始錄音' }))
    fireEvent.click(await screen.findByRole('button', { name: '結束錄音' }))
    await screen.findByRole('textbox')
    fireEvent.click(button('送出'))
    expect(await screen.findByText(/差一點/)).toBeInTheDocument()
    expect((await runResult('sh1'))?.correct).toBe(true)
    await vi.waitFor(async () => expect(await db.speechCorrections.count()).toBe(2))
  })
})

describe('即時跟讀：上限、退路、跳過與釋放（AC#3、AC#4）', () => {
  it('累計 20 秒仍未完成：出現「改用整句錄音」→ 停錄、進整句錄音（行為不變）', async () => {
    const f = fakeLive()
    renderLesson(f.services)
    await startLive()
    await f.say('I want')
    expect(screen.queryByRole('button', { name: '改用整句錄音' })).toBeNull()
    clock += 19_000
    await new Promise((r) => setTimeout(r, 300))
    expect(screen.queryByRole('button', { name: '改用整句錄音' })).toBeNull()
    clock += 1_000
    fireEvent.click(await screen.findByRole('button', { name: '改用整句錄音' }))
    expect(f.mics[0].stop).toHaveBeenCalledOnce()
    expect(await screen.findByRole('button', { name: '開始錄音' })).toBeInTheDocument()
    expect(screen.getByText('點一下開始錄音')).toBeInTheDocument()
    // 即時那段的每輪文字記一筆；整句錄音照舊以送出句計分
    expect(await db.speechCorrections.count()).toBe(1)
    fireEvent.click(button('開始錄音'))
    fireEvent.click(await screen.findByRole('button', { name: '結束錄音' }))
    await f.say('I want to eat')
    fireEvent.change(await screen.findByRole('textbox'), { target: { value: TARGET } })
    fireEvent.click(button('送出'))
    await vi.waitFor(async () => expect((await runResult('sh1'))?.correct).toBe(true))
  })

  it('暫停後再錄，20 秒以累計錄音時間計', async () => {
    const f = fakeLive()
    renderLesson(f.services)
    await startLive()
    await screen.findByRole('button', { name: '暫停' })
    clock += 12_000
    fireEvent.click(button('暫停'))
    clock += 60_000
    await startLive()
    await screen.findByRole('button', { name: '暫停' })
    clock += 8_000
    expect(await screen.findByRole('button', { name: '改用整句錄音' })).toBeInTheDocument()
  })

  it('單次錄音 60 秒自動暫停：麥克風與辨識都停', async () => {
    const f = fakeLive()
    renderLesson(f.services)
    await startLive()
    await screen.findByRole('button', { name: '暫停' })
    clock += 60_000
    expect(await screen.findByText('已暫停，唸對的字都留著。點一下繼續')).toBeInTheDocument()
    expect(f.mics[0].stop).toHaveBeenCalledOnce()
  })

  it('錄音中按「這題跳過」：答錯、停錄、記一筆每輪文字，到下一題', async () => {
    const f = fakeLive()
    renderLesson(f.services)
    await startLive()
    await f.say('I want')
    fireEvent.click(button('這題跳過'))
    expect(await screen.findByText('2／2')).toBeInTheDocument()
    expect(f.mics[0].stop).toHaveBeenCalledOnce()
    expect(await runResult('sh1')).toMatchObject({ correct: false })
    expect((await db.speechCorrections.toArray())[0].recognizedText).toBe('I want')
  })

  it('沒開始就跳過：答錯、不寫紀錄', async () => {
    renderLesson(fakeLive().services)
    fireEvent.click(
      await screen.findByRole(
        'button',
        { name: '現在不方便說話（這題先跳過）' },
        { timeout: 5_000 },
      ),
    )
    expect(await screen.findByText('2／2')).toBeInTheDocument()
    expect(await runResult('sh1')).toMatchObject({ correct: false })
    expect(await db.speechCorrections.count()).toBe(0)
  })

  it('錄音中離開畫面：麥克風停、辨識迴圈不再送下一輪', async () => {
    const f = fakeLive()
    const view = renderLesson(f.services)
    await startLive()
    await f.say('I want')
    const calls = vi.mocked(f.stt.transcribe).mock.calls.length
    view.unmount()
    expect(f.mics[0].stop).toHaveBeenCalledOnce()
    await new Promise((r) => setTimeout(r, 150))
    expect(vi.mocked(f.stt.transcribe).mock.calls.length).toBe(calls)
  })

  it('取得麥克風期間離開：之後才到的麥克風立刻停掉', async () => {
    const f = fakeLive()
    let grant: () => void = () => {}
    const m = { elapsed: () => 2, read: () => new Float32Array(0), level: () => 0, stop: vi.fn() }
    f.services.startLiveMic = () => new Promise((r) => (grant = () => r(m)))
    const view = renderLesson(f.services)
    await startLive()
    view.unmount()
    await act(async () => grant())
    expect(m.stop).toHaveBeenCalledOnce()
  })

  it('開始時麥克風被拒 → 未允許麥克風畫面（沿用）', async () => {
    const f = fakeLive()
    f.services.startLiveMic = async () => {
      throw new MicDeniedError()
    }
    renderLesson(f.services)
    await startLive()
    expect(await screen.findByText('需要麥克風才能跟讀')).toBeInTheDocument()
    expect(button('允許麥克風')).toBeInTheDocument()
  })

  it('模型未下載：下載卡、開始鈕停用（沿用）', async () => {
    renderLesson(fakeLive({ model: 'notDownloaded' }).services)
    expect(
      await screen.findByText('需要下載語音辨識模型', {}, { timeout: 5_000 }),
    ).toBeInTheDocument()
    expect(button('模型下載完才能錄音')).toBeDisabled()
  })
})

describe('即時跟讀：辨識不可用的退回（AC#5）', () => {
  it('模型載入失敗：保留重試，同時提出瀏覽器語音辨識', async () => {
    const web = createWebSpeech(() => fakeRecognition().Ctor)
    renderLesson(fakeLive({ model: 'failed', web }).services)
    expect(
      await screen.findByRole('button', { name: '改用瀏覽器的語音辨識' }, { timeout: 5_000 }),
    ).toBeInTheDocument()
    expect(button('下載中斷・重試')).toBeInTheDocument()
  })

  it('本機不能即時辨識（不支援 AudioWorklet）、瀏覽器有語音辨識：提出後備，同意後以中間結果即時標記', async () => {
    const rec = fakeRecognition()
    const web = createWebSpeech(() => rec.Ctor)
    renderLesson(fakeLive({ liveMic: false, web }).services)
    expect(
      await screen.findByText('這支手機無法在本機辨識語音', {}, { timeout: 5_000 }),
    ).toBeInTheDocument()
    fireEvent.click(button('改用瀏覽器的語音辨識'))
    expect(rec.made).toHaveLength(0)
    fireEvent.click(await screen.findByRole('button', { name: '同意並使用' }))
    await startLive()
    expect(
      await screen.findByText('錄音中・錄音可能會傳送到瀏覽器廠商的伺服器'),
    ).toBeInTheDocument()
    expect(rec.made[0].interimResults).toBe(true)
    act(() => rec.made[0].emit([{ text: 'I want', isFinal: false }]))
    act(() => rec.made[0].emit([{ text: 'I want to eat', isFinal: false }]))
    expect(marks()).toBe('I:done want:done to:todo eat:todo dinner:todo')
    act(() => rec.made[0].emit([{ text: 'eat dinner', isFinal: false }]))
    act(() => rec.made[0].emit([{ text: 'eat dinner', isFinal: true }]))
    expect(await screen.findByText('整句完成！')).toBeInTheDocument()
    expect(rec.made[0].aborted).toBe(true)
  })

  it('不支援即時取樣（AudioWorklet）也沒有瀏覽器語音辨識：沿用整句錄音', async () => {
    renderLesson(fakeLive({ liveMic: false }).services)
    expect(
      await screen.findByRole('button', { name: '開始錄音' }, { timeout: 5_000 }),
    ).toBeInTheDocument()
  })
})
