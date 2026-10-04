import 'fake-indexeddb/auto'
import { act, fireEvent, render, screen, within } from '@testing-library/react'
import { beforeEach, describe, expect, it, onTestFinished, vi } from 'vitest'
import { db } from '../../data/appDb'
import type { LessonItemsDoc } from '../../lesson/items'
import { MicDeniedError, type MicPermission, type Recording } from '../../speech/mic'
import { SpeechContext, type SpeechServices } from '../../speech/services'
import { fakeRecognition } from '../../speech/fakeRecognition'
import { createSttClient, type SttClient, type SttState } from '../../speech/stt'
import { isSttUsable } from '../../speech/usable'
import { createWebSpeech, type WebSpeech } from '../../speech/webSpeech'
import { stubCurriculumFetch } from '../../test/curriculumFetch'
import { holdSfx } from '../../sound/sfx'
import { LessonScreen } from './LessonScreen'

const sfxRelease = vi.hoisted(() => ({ fn: () => {} }))
vi.mock('../../sound/sfx', async (orig) => ({
  ...(await orig<typeof import('../../sound/sfx')>()),
  holdSfx: vi.fn(() => sfxRelease.fn),
}))

// TASK-14 跟讀（設計 s04 七個狀態）；期望文案取自設計 s04 與 zh-TW.json。
// 規格 §6 G2：分數以送出句為準；每次送出都記一筆辨識原文 vs 送出句（Round 1 D1），第一次送出才計分（D3）
const LESSON = 'a1-u01-l01'
const TARGET = 'Could we push the meeting to next Monday?'
const doc: LessonItemsDoc = {
  schemaVersion: 1,
  lessonId: LESSON,
  level: 'a1',
  items: [
    {
      id: 'sh1',
      type: 'shadowing',
      sentenceEn: TARGET,
      sentenceZh: '我們可以把會議延到下週一嗎？',
    },
    {
      id: 'sh2',
      type: 'shadowing',
      sentenceEn: 'I have a cup of tea.',
      sentenceZh: '我有一杯茶。',
    },
  ],
}
const loadItems = async () => doc

function fakeSpeech({
  model = 'ready',
  mic = 'granted',
  heard = ['Could we push the meetings to next'],
  wasm = true,
  web = createWebSpeech(() => undefined),
}: {
  model?: SttState['kind']
  mic?: MicPermission
  heard?: (string | Error)[]
  wasm?: boolean
  web?: WebSpeech
} = {}) {
  let state = { kind: model } as SttState
  const listeners = new Set<() => void>()
  const set = (s: SttState) => {
    state = s
    listeners.forEach((l) => l())
  }
  const release = vi.fn()
  const queue = [...heard]
  const stt: SttClient = {
    get: () => state,
    subscribe: (l) => {
      listeners.add(l)
      return () => listeners.delete(l)
    },
    refresh: async () => {},
    load: vi.fn(async () => {}),
    transcribe: vi.fn(async () => {
      const next = queue.shift() ?? ''
      if (next instanceof Error) throw next
      return next
    }),
    acquire: vi.fn(() => release),
  }
  const cancel = vi.fn()
  const services: SpeechServices = {
    stt,
    moonshineAvailable: () => wasm,
    webSpeech: web,
    sttUsable: () => isSttUsable(mic !== 'unsupported', wasm, web.consented()),
    micPermission: async () => mic,
    requestMic: vi.fn(async () => true),
    startRecording: vi.fn(async () => ({ stop: async () => new Float32Array(16_000), cancel })),
  }
  return { services, stt, set, release, cancel }
}

function renderLesson(services: SpeechServices, load = loadItems) {
  return render(
    <SpeechContext.Provider value={services}>
      <LessonScreen lessonId={LESSON} loadItems={load} />
    </SpeechContext.Provider>,
  )
}

/** 結果卡上看得到的那行（同一段文字另在 live region 給螢幕閱讀器） */
const TALLY = { selector: '[data-testid="shadowing-tally"]' }
const button = (name: string | RegExp) => screen.getByRole('button', { name })
const click = (name: string | RegExp) => fireEvent.click(button(name))

async function recordAndStop() {
  fireEvent.click(await screen.findByRole('button', { name: '開始錄音' }))
  fireEvent.click(await screen.findByRole('button', { name: '結束錄音' }))
  return screen.findByRole('textbox', { name: '你唸的句子（辨識結果，聽錯的地方可以直接改）' })
}

const runResult = async (key: string) => (await db.lessonRuns.get(LESSON))?.results[key]

beforeEach(async () => {
  stubCurriculumFetch()
  history.replaceState(null, '', `/lesson/${LESSON}`)
  await db.delete()
  await db.open()
})

describe('跟讀：待錄與錄音（s04 idle／recording／busy）', () => {
  it('待錄：題型、說明、目標句、錄音鈕與跳過；整課持有語音辨識 Worker', async () => {
    const f = fakeSpeech()
    renderLesson(f.services)
    // 檔內第一個測試是冷啟動（載入字典等），全套併跑時可能超過預設 1 秒
    expect(
      await screen.findByRole('button', { name: '開始錄音' }, { timeout: 5_000 }),
    ).toBeEnabled()
    expect(screen.getByText('跟讀')).toBeInTheDocument()
    expect(screen.getByText('聽一次，再唸出這句')).toBeInTheDocument()
    expect(screen.getByText('點一下開始錄音')).toBeInTheDocument()
    expect(button('現在不方便說話（這題先跳過）')).toBeInTheDocument()
    await vi.waitFor(() => expect(f.stt.acquire).toHaveBeenCalledOnce())
  })

  it('錄音中：停止鈕與秒數，說明與跳過收起；結束後轉文字中、再進確認', async () => {
    let finish: (v: Float32Array) => void = () => {}
    const f = fakeSpeech()
    f.services.startRecording = vi.fn(async () => ({
      stop: () => new Promise<Float32Array>((r) => (finish = r)),
      cancel: vi.fn(),
    }))
    renderLesson(f.services)
    fireEvent.click(await screen.findByRole('button', { name: '開始錄音' }))
    expect(await screen.findByRole('button', { name: '結束錄音' })).toBeInTheDocument()
    expect(screen.getByText(/^錄音中・0:00\s點一下結束$/)).toBeInTheDocument()
    expect(screen.queryByText('聽一次，再唸出這句')).toBeNull()
    expect(screen.queryByRole('button', { name: /跳過/ })).toBeNull()
    click('結束錄音')
    expect(await screen.findByText('轉文字中…（錄音不會上傳）')).toBeInTheDocument()
    expect(button('辨識中')).toBeDisabled()
    await act(async () => finish(new Float32Array(16_000)))
    expect(await screen.findByRole('textbox')).toHaveValue('Could we push the meetings to next')
  })

  it('錄音中不播音效（創辦人試用 2026-10-04 ④）：開始錄音時壓住、結束錄音即放開', async () => {
    const release = vi.fn()
    sfxRelease.fn = release
    vi.mocked(holdSfx).mockClear()
    const f = fakeSpeech()
    renderLesson(f.services)
    fireEvent.click(await screen.findByRole('button', { name: '開始錄音' }))
    await screen.findByRole('button', { name: '結束錄音' })
    expect(holdSfx).toHaveBeenCalledOnce()
    expect(release).not.toHaveBeenCalled()
    click('結束錄音')
    await screen.findByRole('textbox')
    expect(release).toHaveBeenCalledOnce()
  })

  // 錄滿 2 秒才按結束（不足 1 秒算錄音太短，見下）
  const recordFor = async (ms: number) => {
    const t0 = Date.now()
    fireEvent.click(await screen.findByRole('button', { name: '開始錄音' }))
    const stop = await screen.findByRole('button', { name: '結束錄音' })
    vi.spyOn(Date, 'now').mockReturnValue(t0 + ms)
    onTestFinished(() => {
      vi.restoreAllMocks()
    })
    fireEvent.click(stop)
  }

  it('轉文字失敗：回到待錄並提示再唸一次', async () => {
    const f = fakeSpeech({ heard: [new Error('worker died')] })
    renderLesson(f.services)
    await recordFor(2000)
    expect(await screen.findByText('錄音或轉文字失敗，請再唸一次')).toBeInTheDocument()
    expect(button('開始錄音')).toBeEnabled()
  })

  // 創辦人裁示（2026-10-03）④A：按下錄音馬上結束時 MediaRecorder 偶發 EncodingError，改給專屬提示
  it('錄音太短：解碼丟 EncodingError 時提示唸完整句', async () => {
    const f = fakeSpeech()
    f.services.startRecording = vi.fn(async () => ({
      stop: () => Promise.reject(new DOMException('Unable to decode audio data', 'EncodingError')),
      cancel: vi.fn(),
    }))
    renderLesson(f.services)
    await recordFor(2000)
    expect(await screen.findByText('錄音太短了，唸完整句再按結束')).toBeInTheDocument()
    expect(screen.queryByText('錄音或轉文字失敗，請再唸一次')).toBeNull()
    expect(button('開始錄音')).toBeEnabled()
  })

  it('錄音太短：不到 1 秒就結束而失敗時提示唸完整句', async () => {
    const f = fakeSpeech({ heard: [new Error('worker died')] })
    renderLesson(f.services)
    await recordFor(500)
    expect(await screen.findByText('錄音太短了，唸完整句再按結束')).toBeInTheDocument()
  })
})

describe('跟讀：確認與送出（s04 confirm／result；AC#3 寫紀錄）', () => {
  it('修正後送出：以送出句計分（全對）；記一筆辨識原文 vs 送出句並排入同步；不寫 FSRS', async () => {
    const f = fakeSpeech()
    renderLesson(f.services)
    const box = await recordAndStop()
    expect(screen.getByText('目標句')).toBeInTheDocument()
    expect(screen.getByText('確認沒問題再按「送出」，送出後才會計分。')).toBeInTheDocument()
    fireEvent.change(box, { target: { value: 'Could we push the meeting to next Monday' } })
    click('送出')

    expect(await screen.findByText('錯字 0・漏字 0・得分 8／8 字', TALLY)).toBeInTheDocument()
    expect(screen.getByRole('status')).toHaveTextContent('正確')
    expect(screen.getByRole('status')).toHaveTextContent('我們可以把會議延到下週一嗎？')
    await vi.waitFor(async () => expect((await runResult('sh1'))?.correct).toBe(true))

    const rows = await db.speechCorrections.toArray()
    expect(rows).toHaveLength(1)
    expect(rows[0]).toMatchObject({
      itemId: 'sh1',
      targetText: TARGET,
      recognizedText: 'Could we push the meetings to next',
      correctedText: 'Could we push the meeting to next Monday',
    })
    const outbox = await db.outbox.toArray()
    expect(outbox).toContainEqual(
      expect.objectContaining({ table: 'speechCorrections', key: rows[0].id }),
    )
    expect(await db.reviewLogs.count()).toBe(0)
    expect(await db.wordPool.count()).toBe(0)
  })

  it('不修改就送出：逐字標出錯字與漏字、得分 6／8；回饋「差一點」＋目標句與中譯', async () => {
    renderLesson(fakeSpeech().services)
    await recordAndStop()
    click('送出')
    expect(await screen.findByText('錯字 1・漏字 1・得分 6／8 字', TALLY)).toBeInTheDocument()
    const said = screen.getByTestId('shadowing-said')
    expect(said).toHaveTextContent('Could we push the meetings to next ＿＿')
    expect(said.querySelector('[data-mark="wrong"]')).toHaveTextContent('meetings')
    expect(within(said).getByLabelText('漏字')).toHaveTextContent('＿＿')
    const fb = screen.getByRole('status')
    expect(fb).toHaveTextContent('差一點：meeting、Monday')
    expect(fb).toHaveTextContent(TARGET)
    expect(fb).toHaveTextContent('我們可以把會議延到下週一嗎？')
    await vi.waitFor(async () => expect((await runResult('sh1'))?.correct).toBe(false))
  })

  it('送出後再唸一次只當練習：分數維持第一次，但每次送出都記一筆', async () => {
    const f = fakeSpeech({
      heard: ['Could we push the meetings to next', 'Could we push the meeting to next Monday'],
    })
    renderLesson(f.services)
    await recordAndStop()
    click('送出')
    await screen.findByText('錯字 1・漏字 1・得分 6／8 字', TALLY)
    click('再唸一次')
    const box = await recordAndStop()
    expect(box).toHaveValue('Could we push the meeting to next Monday')
    click('送出')
    expect(await screen.findByText('錯字 0・漏字 0・得分 8／8 字', TALLY)).toBeInTheDocument()
    await vi.waitFor(async () => expect(await db.speechCorrections.count()).toBe(2))
    expect((await runResult('sh1'))?.correct).toBe(false)
    click('繼續')
    expect(await screen.findByText('I have a cup of tea.')).toBeInTheDocument()
  })

  it('確認畫面按「再唸一次」不寫紀錄；清空句子時不能送出', async () => {
    renderLesson(fakeSpeech().services)
    const box = await recordAndStop()
    fireEvent.change(box, { target: { value: '  ' } })
    expect(button('送出')).toBeDisabled()
    click('再唸一次')
    expect(await screen.findByRole('button', { name: '開始錄音' })).toBeInTheDocument()
    expect(await db.speechCorrections.count()).toBe(0)
  })
})

describe('跟讀：跳過、麥克風、模型下載', () => {
  it('跳過＝答錯並直接到下一題，不寫紀錄（Round 1 D2）', async () => {
    renderLesson(fakeSpeech().services)
    fireEvent.click(await screen.findByRole('button', { name: '現在不方便說話（這題先跳過）' }))
    expect(await screen.findByText('I have a cup of tea.')).toBeInTheDocument()
    expect(await screen.findByText('2／2')).toBeInTheDocument()
    expect((await runResult('sh1'))?.correct).toBe(false)
    expect(await db.speechCorrections.count()).toBe(0)
  })

  it('跳過的題目進錯題重做；重做時再跳過就不再出，能完成這課（不能錄音的人不會卡住，創辦人試用 2026-10-04 ⑤）', async () => {
    const SKIP = '現在不方便說話（這題先跳過）'
    renderLesson(fakeSpeech().services)
    fireEvent.click(await screen.findByRole('button', { name: SKIP }))
    await screen.findByText('2／2')
    fireEvent.click(await screen.findByRole('button', { name: SKIP }))
    expect(await screen.findByText('再練一次錯題')).toBeInTheDocument()
    expect(screen.getByText('1／2')).toBeInTheDocument()
    expect(screen.getByText(TARGET)).toBeInTheDocument()
    fireEvent.click(await screen.findByRole('button', { name: SKIP }))
    await screen.findByText('2／2')
    fireEvent.click(await screen.findByRole('button', { name: SKIP }))
    expect(await screen.findByTestId('lesson-done')).toHaveTextContent('答對 0 題')
  })

  it('未允許麥克風（s04 denied）：說明＋允許麥克風＋這題跳過；允許後回到待錄', async () => {
    const f = fakeSpeech({ mic: 'denied' })
    renderLesson(f.services)
    expect(await screen.findByText('需要麥克風才能跟讀')).toBeInTheDocument()
    expect(button('這題跳過')).toBeInTheDocument()
    expect(screen.queryByText('聽一次，再唸出這句')).toBeNull()
    click('允許麥克風')
    expect(await screen.findByRole('button', { name: '開始錄音' })).toBeEnabled()
    expect(f.services.requestMic).toHaveBeenCalledOnce()
  })

  it('開始錄音時被拒絕 → 未允許麥克風', async () => {
    const f = fakeSpeech({ mic: 'prompt' })
    f.services.startRecording = vi.fn(async () => {
      throw new MicDeniedError()
    })
    renderLesson(f.services)
    fireEvent.click(await screen.findByRole('button', { name: '開始錄音' }))
    expect(await screen.findByText('需要麥克風才能跟讀')).toBeInTheDocument()
  })

  it('模型未下載：先顯示下載鈕（D4），錄音鈕停用；按下載 → 進度 42% → 失敗可重試', async () => {
    const f = fakeSpeech({ model: 'notDownloaded' })
    renderLesson(f.services)
    expect(await screen.findByText('需要下載語音辨識模型')).toBeInTheDocument()
    expect(screen.getByText('約 50–80MB，只需下載一次，之後不用網路也能跟讀。')).toBeInTheDocument()
    // 還沒開始下載：錄音鈕不說「下載中」（TASK-22 移交 G3①）
    expect(button('模型下載完才能錄音')).toBeDisabled()
    expect(screen.getByText('模型下載完才能錄音', { selector: 'span' })).toBeInTheDocument()
    expect(screen.queryByText(/下載中/)).toBeNull()
    expect(button('先跳過這題')).toBeInTheDocument()
    expect(f.stt.load).not.toHaveBeenCalled()

    click('下載')
    expect(f.stt.load).toHaveBeenCalledOnce()
    act(() => f.set({ kind: 'downloading', progress: 0.42 }))
    // 換狀態後畫面在下一次 render 才更新（訂閱可能晚於 set），一律等畫面出現
    expect(await screen.findByText('語音辨識模型下載中')).toBeInTheDocument()
    expect(screen.getByText('42%')).toBeInTheDocument()
    expect(button('語音辨識模型下載中，暫時無法錄音')).toBeDisabled()
    expect(screen.getByRole('progressbar', { name: '語音辨識模型下載中' })).toHaveAttribute(
      'aria-valuenow',
      '42',
    )
    expect(
      screen.getByText(
        '約 50–80MB，只需下載一次，之後不用網路也能跟讀。下載時可以先做別題，下載會在背景繼續。',
      ),
    ).toBeInTheDocument()

    act(() => f.set({ kind: 'failed' }))
    // 下載失敗：標題與進度條、錄音鈕都不再說「下載中」（TASK-22 移交 G3①）
    await screen.findByRole('button', { name: '下載中斷・重試' })
    expect(screen.getByText('需要下載語音辨識模型')).toBeInTheDocument()
    expect(screen.getByRole('progressbar', { name: '下載中斷' })).toBeInTheDocument()
    expect(button('模型下載完才能錄音')).toBeDisabled()
    expect(screen.queryByText(/下載中(?!斷)/)).toBeNull()
    fireEvent.click(screen.getByRole('button', { name: '下載中斷・重試' }))
    expect(f.stt.load).toHaveBeenCalledTimes(2)
    act(() => f.set({ kind: 'ready' }))
    expect(await screen.findByRole('button', { name: '開始錄音' })).toBeEnabled()
  })

  it('真的語音辨識服務：下載走到 100% 並載入完 → 不用重整、不用換題，錄音鈕可按、下載提示消失（創辦人試用 2026-10-04 ①）', async () => {
    const posted: { id: number; cmd: string }[] = []
    const worker = {
      onmessage: null as ((e: MessageEvent) => void) | null,
      onerror: null,
      postMessage: (msg: { id: number; cmd: string }) => posted.push(msg),
      terminate: () => {},
    }
    const reply = (data: unknown) => act(() => worker.onmessage?.({ data } as MessageEvent))
    const f = fakeSpeech()
    const services = {
      ...f.services,
      stt: createSttClient({
        createWorker: () => worker as unknown as Worker,
        isCached: async () => false,
      }),
    }
    renderLesson(services)
    fireEvent.click(await screen.findByRole('button', { name: '下載' }))
    reply({ type: 'progress', fraction: 0.6 })
    expect(await screen.findByText('60%')).toBeInTheDocument()
    reply({ type: 'progress', fraction: 1 })
    // 下載完、還在建模型：不再說「下載中」，改說準備中
    expect(await screen.findByText('語音辨識準備中…')).toBeInTheDocument()
    expect(screen.queryByText('語音辨識模型下載中')).toBeNull()
    reply({ type: 'result', id: posted[0].id, result: { device: 'wasm' } })
    expect(await screen.findByRole('button', { name: '開始錄音' })).toBeEnabled()
    expect(screen.queryByText('模型下載完才能錄音')).toBeNull()
    expect(screen.queryByText(/語音辨識模型/)).toBeNull()
  })

  it('模型已下載：進題目就自動載入，載入中顯示準備中', async () => {
    const f = fakeSpeech({ model: 'downloaded' })
    renderLesson(f.services)
    await vi.waitFor(() => expect(f.stt.load).toHaveBeenCalledOnce())
    act(() => f.set({ kind: 'loading' }))
    expect(await screen.findByText('語音辨識準備中…')).toBeInTheDocument()
    expect(screen.queryByText('需要下載語音辨識模型')).toBeNull()
  })

  it('離開小課：放開語音辨識 Worker', async () => {
    const f = fakeSpeech()
    const view = renderLesson(f.services)
    await screen.findByRole('button', { name: '開始錄音' })
    view.unmount()
    expect(f.release).toHaveBeenCalledOnce()
  })
})

describe('跟讀：瀏覽器語音辨識後備（AC#4、Round 1 D8）', () => {
  const OFFER = '改用瀏覽器的語音辨識'

  it('模型載入失敗時提出後備；按「不用了」不建立辨識、錄音鈕仍停用', async () => {
    const rec = fakeRecognition({ texts: ['Could we push the meeting to next Monday'] })
    renderLesson(fakeSpeech({ model: 'failed', web: createWebSpeech(() => rec.Ctor) }).services)
    fireEvent.click(await screen.findByRole('button', { name: OFFER }))
    const dialog = await screen.findByRole('alertdialog')
    expect(dialog).toHaveTextContent('改用瀏覽器的語音辨識？')
    expect(dialog).toHaveTextContent('錄音可能會傳送到瀏覽器廠商的伺服器')
    expect(within(dialog).getByRole('button', { name: '不用了' })).toHaveFocus()
    fireEvent.click(within(dialog).getByRole('button', { name: '不用了' }))
    expect(screen.queryByRole('alertdialog')).toBeNull()
    expect(screen.queryByRole('button', { name: '開始錄音' })).toBeNull()
    expect(button('下載中斷・重試')).toBeInTheDocument()
    expect(rec.made).toHaveLength(0)
  })

  it('同意後才用瀏覽器辨識：錄音 → 確認 → 送出並寫紀錄；不經本機辨識', async () => {
    const rec = fakeRecognition({ texts: ['Could we push the meeting to next Monday'] })
    const f = fakeSpeech({ model: 'failed', web: createWebSpeech(() => rec.Ctor) })
    renderLesson(f.services)
    fireEvent.click(await screen.findByRole('button', { name: OFFER }))
    const dialog = await screen.findByRole('alertdialog')
    fireEvent.click(within(dialog).getByRole('button', { name: '同意並使用' }))
    expect(rec.made).toHaveLength(0)
    fireEvent.click(await screen.findByRole('button', { name: '開始錄音' }))
    fireEvent.click(await screen.findByRole('button', { name: '結束錄音' }))
    expect(await screen.findByRole('textbox')).toHaveValue(
      'Could we push the meeting to next Monday',
    )
    expect(rec.made).toHaveLength(1)
    expect(f.stt.transcribe).not.toHaveBeenCalled()
    click('送出')
    expect(await screen.findByText('錯字 0・漏字 0・得分 8／8 字', TALLY)).toBeInTheDocument()
    await vi.waitFor(async () => expect(await db.speechCorrections.count()).toBe(1))
  })

  it('轉文字中的說明改為「可能會傳送到瀏覽器廠商的伺服器」', async () => {
    const rec = fakeRecognition({ texts: ['hello'] })
    const web = createWebSpeech(() => rec.Ctor)
    web.consent()
    renderLesson(fakeSpeech({ mic: 'unsupported', web }).services)
    fireEvent.click(await screen.findByRole('button', { name: '開始錄音' }))
    await screen.findByRole('button', { name: '結束錄音' })
    rec.made[0].stop = () => {} // 攔住辨識結束，停在轉文字中
    click('結束錄音')
    expect(
      await screen.findByText('轉文字中…（錄音可能會傳送到瀏覽器廠商的伺服器）'),
    ).toBeInTheDocument()
  })

  it('模型載入失敗：保留重試，同時提出後備', async () => {
    const web = createWebSpeech(() => fakeRecognition().Ctor)
    renderLesson(fakeSpeech({ model: 'failed', web }).services)
    expect(await screen.findByRole('button', { name: '下載中斷・重試' })).toBeInTheDocument()
    expect(button(OFFER)).toBeInTheDocument()
  })

  it('本機辨識可用時不提出後備（即使瀏覽器支援）', async () => {
    const web = createWebSpeech(() => fakeRecognition().Ctor)
    renderLesson(fakeSpeech({ web }).services)
    await screen.findByRole('button', { name: '開始錄音' })
    expect(screen.queryByRole('button', { name: OFFER })).toBeNull()
  })

  it('瀏覽器也沒有語音辨識：模型失敗時不提出後備', async () => {
    renderLesson(fakeSpeech({ model: 'failed' }).services)
    await screen.findByRole('button', { name: '下載中斷・重試' })
    expect(screen.queryByRole('button', { name: OFFER })).toBeNull()
  })
})

describe('跟讀能力偵測（TASK-18 替代規則：無 STT → 跟讀改聽音打字）', () => {
  // 一題單字卡＋一題跟讀；聽音打字（TASK-13）尚未登記，換題型後略過，所以題數看得出有沒有跟讀
  const mixed: LessonItemsDoc = {
    ...doc,
    items: [
      {
        id: 'w1',
        type: 'wordCard',
        word: 'tea',
        exampleEn: 'I have a cup of tea.',
        exampleZh: '我有一杯茶。',
        glossZh: '茶',
        distractorsZh: ['咖啡', '水', '牛奶'],
      },
      doc.items[0],
    ],
  }
  const total = async () =>
    (await screen.findByRole('progressbar', { name: '作答進度' })).getAttribute('aria-valuemax')

  it('能錄音且有 WebAssembly：跟讀保留（2 題）', async () => {
    renderLesson(fakeSpeech().services, async () => mixed)
    expect(await total()).toBe('2')
  })

  it('瀏覽器不能錄音：跟讀換掉（只剩 1 題）', async () => {
    renderLesson(fakeSpeech({ mic: 'unsupported' }).services, async () => mixed)
    expect(await total()).toBe('1')
    expect(screen.queryByText('跟讀')).toBeNull()
  })

  it('沒有 WebAssembly：跟讀換掉（只剩 1 題）', async () => {
    renderLesson(fakeSpeech({ wasm: false }).services, async () => mixed)
    expect(await total()).toBe('1')
  })

  it('不能錄音但已同意瀏覽器語音辨識：跟讀保留（2 題）', async () => {
    const web = createWebSpeech(() => fakeRecognition().Ctor)
    web.consent()
    renderLesson(fakeSpeech({ mic: 'unsupported', web }).services, async () => mixed)
    expect(await total()).toBe('2')
  })
})

describe('驗收修正（2026-10-02 隔離驗收 P1／P2）', () => {
  it('P1-1 送出後「再唸一次」再跳過：直接到下一題、分數維持第一次、沒有錯誤', async () => {
    const errors = vi.spyOn(console, 'error').mockImplementation(() => {})
    renderLesson(fakeSpeech().services)
    const box = await recordAndStop()
    fireEvent.change(box, { target: { value: 'Could we push the meeting to next Monday' } })
    click('送出')
    await screen.findByText('錯字 0・漏字 0・得分 8／8 字', TALLY)
    // 第一次送出已存進進度（驗收官重現條件：存檔完成後才再唸、跳過）
    await vi.waitFor(async () => expect((await runResult('sh1'))?.correct).toBe(true))
    click('再唸一次')
    fireEvent.click(await screen.findByRole('button', { name: '現在不方便說話（這題先跳過）' }))
    expect(await screen.findByText('I have a cup of tea.')).toBeInTheDocument()
    expect(await screen.findByText('2／2')).toBeInTheDocument()
    expect((await runResult('sh1'))?.correct).toBe(true)
    expect(errors).not.toHaveBeenCalled()
  })

  it('P1-1 作答存檔失敗：記錄錯誤，✕ 仍叫得出離開確認框', async () => {
    const errors = vi.spyOn(console, 'error').mockImplementation(() => {})
    renderLesson(fakeSpeech().services)
    await recordAndStop()
    // 送出時先寫跟讀紀錄、再存作答：讓第二次寫入（作答存檔）失敗
    const real = db.transaction.bind(db) as (...a: unknown[]) => unknown
    let calls = 0
    vi.spyOn(db, 'transaction').mockImplementation(((...a: unknown[]) =>
      ++calls === 2 ? Promise.reject(new Error('寫入失敗')) : real(...a)) as never)
    click('送出')
    await screen.findByText('錯字 1・漏字 1・得分 6／8 字', TALLY)
    await vi.waitFor(() => expect(errors).toHaveBeenCalled())
    click('離開')
    expect(await screen.findByRole('alertdialog')).toHaveTextContent('要離開這一課嗎？')
  })

  it('移交（TASK-14 複驗 P2）跳過時存檔與前進都失敗：留在這題，之後仍能開始錄音', async () => {
    const errors = vi.spyOn(console, 'error').mockImplementation(() => {})
    const f = fakeSpeech()
    renderLesson(f.services)
    await screen.findByRole('button', { name: '開始錄音' })
    const tx = vi
      .spyOn(db, 'transaction')
      .mockImplementation((() => Promise.reject(new Error('寫入失敗'))) as never)
    click('現在不方便說話（這題先跳過）')
    await vi.waitFor(() =>
      expect(errors).toHaveBeenCalledWith('[lesson] 無法前進到下一題', expect.anything()),
    )
    tx.mockRestore()
    expect(screen.getByText('1／2')).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: '開始錄音' }))
    expect(await screen.findByRole('button', { name: '結束錄音' })).toBeInTheDocument()
  })

  function pendingMic() {
    const f = fakeSpeech()
    const cancel = vi.fn()
    let resolve: (r: Recording) => void = () => {}
    f.services.startRecording = vi.fn(() => new Promise<Recording>((r) => (resolve = r)))
    return { f, cancel, arrive: () => resolve({ stop: async () => new Float32Array(1), cancel }) }
  }

  it('P1-2 取得麥克風期間連點兩下：只要一次麥克風', async () => {
    const { f } = pendingMic()
    renderLesson(f.services)
    const start = await screen.findByRole('button', { name: '開始錄音' })
    fireEvent.click(start)
    fireEvent.click(start)
    expect(f.services.startRecording).toHaveBeenCalledTimes(1)
  })

  it('P1-2 取得麥克風前按跳過：之後才到的錄音立刻停止', async () => {
    const { f, cancel, arrive } = pendingMic()
    renderLesson(f.services)
    fireEvent.click(await screen.findByRole('button', { name: '開始錄音' }))
    click('現在不方便說話（這題先跳過）')
    expect(await screen.findByText('I have a cup of tea.')).toBeInTheDocument()
    await act(async () => arrive())
    expect(cancel).toHaveBeenCalledOnce()
  })

  it('P1-2 取得麥克風前離開小課：之後才到的錄音立刻停止', async () => {
    const { f, cancel, arrive } = pendingMic()
    const view = renderLesson(f.services)
    fireEvent.click(await screen.findByRole('button', { name: '開始錄音' }))
    view.unmount()
    await act(async () => arrive())
    expect(cancel).toHaveBeenCalledOnce()
  })

  it('P2-1 模型未下載、下載中：即使瀏覽器支援語音辨識也不提出後備', async () => {
    const web = createWebSpeech(() => fakeRecognition().Ctor)
    const f = fakeSpeech({ model: 'notDownloaded', web })
    renderLesson(f.services)
    await screen.findByText('需要下載語音辨識模型')
    expect(screen.queryByRole('button', { name: '改用瀏覽器的語音辨識' })).toBeNull()
    act(() => f.set({ kind: 'downloading', progress: 0.3 }))
    expect(await screen.findByText('30%')).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: '改用瀏覽器的語音辨識' })).toBeNull()
  })

  it('P2-2 錯字・漏字・得分在送出後由 polite live region 念出（容器先存在、送出後才填）', async () => {
    renderLesson(fakeSpeech().services)
    await screen.findByRole('button', { name: '開始錄音' })
    const live = screen.getByTestId('shadowing-live')
    expect(live).toHaveAttribute('aria-live', 'polite')
    expect(live).toHaveTextContent('')
    await recordAndStop()
    click('送出')
    await screen.findByText('錯字 1・漏字 1・得分 6／8 字', TALLY)
    expect(screen.getByTestId('shadowing-live')).toBe(live)
    expect(live).toHaveTextContent('錯字 1・漏字 1・得分 6／8 字')
  })
})
