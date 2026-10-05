import 'fake-indexeddb/auto'
import { cleanup, fireEvent, render, screen, within } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { db } from '../../data/appDb'
import type { LessonItemsDoc, WritingItem } from '../../lesson/items'
import { loadFixture } from '../../lesson/testFixtures'
import { gradeWriting, type GradeOutcome } from '../../llm/grade'
import { saveLink } from '../../llm/keyStore'
import type { GradeResult } from '../../llm/parseGrade'
import { stubCurriculumFetch } from '../../test/curriculumFetch'
import { LessonScreen } from './LessonScreen'
import type { GradeFn } from './writingEnv'

// 期望文案取自設計 s06 與 TASK-4 文案表；題目取自樣本課 a1-u01-l01 的 q16（中翻英）、q17（造句）
const LESSON = 'a1-u01-l01'
const full = loadFixture(LESSON)
const writing = full.items.filter(
  (it): it is WritingItem => it.type === 'translate' || it.type === 'makeSentence',
)
const docOf = (items: WritingItem[]): LessonItemsDoc => ({ ...full, items })
const KEY = 'sk-or-v1-0123456789abcdef0123456789abcdef'

beforeEach(async () => {
  stubCurriculumFetch()
  history.replaceState(null, '', `/lesson/${LESSON}`)
  await db.delete()
  await db.open()
})

function start(items: WritingItem[] = writing, grade?: GradeFn) {
  const onSettle = vi.fn()
  render(
    <LessonScreen
      lessonId={LESSON}
      loadItems={async () => docOf(items)}
      grade={grade}
      onSettle={onSettle}
    />,
  )
  return onSettle
}

const box = () => screen.findByRole('textbox', { name: '你的句子' })
async function write(text: string) {
  fireEvent.change(await box(), { target: { value: text } })
  fireEvent.click(screen.getByRole('button', { name: '送出批改' }))
}
const click = (name: string) => fireEvent.click(screen.getByRole('button', { name }))

const WRONG: GradeResult = {
  isCorrect: false,
  corrected: 'I have an apple and a banana.',
  errors: [
    {
      original: 'a apple',
      corrected: 'an apple',
      explanationZh: 'apple 是母音開頭，前面用 an。',
    },
  ],
  explanationZh: '可數名詞單數前要加 a 或 an。',
  levelOk: true,
}
const ok = (result: GradeResult): GradeOutcome => ({ ok: true, result, model: 'm:free' })

describe('作答中（s06 input）', () => {
  it('中翻英：題型、中文題目、提示字；沒寫字不能送出', async () => {
    start()
    expect(await screen.findByText('中翻英')).toBeInTheDocument()
    expect(screen.getByText('我有一個蘋果和一根香蕉。')).toBeInTheDocument()
    expect(screen.getByText('have、and').parentElement).toHaveTextContent(/^提示字：have、and$/)
    expect(screen.getByText('1／2')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '送出批改' })).toBeDisabled()
    fireEvent.change(await box(), { target: { value: '   ' } })
    expect(screen.getByRole('button', { name: '送出批改' })).toBeDisabled()
  })

  it('提示字顯示英文原本的大小寫（july → July；A.M. 原樣）；送去批改的仍是題庫原字（執行長審稿補項②）', async () => {
    const grade = vi.fn<GradeFn>(async () => ok(WRONG))
    await saveLink(db, KEY, 'paste', Date.now())
    const tr = writing.find((w) => w.type === 'translate')!
    start([{ ...tr, hintWords: ['july', 'august', 'A.M.'] } as WritingItem], grade)
    expect(await screen.findByText('July、August、A.M.')).toBeInTheDocument()
    expect(screen.queryByText(/july/)).toBeNull()
    await write('It is July.')
    await vi.waitFor(() => expect(grade).toHaveBeenCalledOnce())
    expect(grade.mock.calls[0][1].words).toEqual(['july', 'august', 'A.M.'])
  })

  it('造句：題型「造句」、說明、指定字當提示字', async () => {
    start([writing[1]])
    expect(await screen.findByText('造句')).toBeInTheDocument()
    // 中文裡的英文字另包 lang="en"，以整段文字比對
    const byText = (text: string) =>
      screen.getByText(
        (_, el) => el?.textContent === text && el.firstChild?.nodeType === Node.TEXT_NODE,
      )
    expect(byText('用 the 造一個句子，說說房間裡的一樣東西在哪裡。')).toBeInTheDocument()
    expect(byText('提示字：the')).toBeInTheDocument()
  })
})

describe('沒有金鑰：對照參考答案自評（AC#3、s06 nokey）', () => {
  it('送出後顯示你的句子、參考答案（全部）、問句與設定金鑰提示；不呼叫批改', async () => {
    const grade = vi.fn<GradeFn>()
    start([writing[1]], grade)
    await write('The pen is in the bag.')
    expect(await screen.findByText('跟參考答案比一比，意思一樣嗎？')).toBeInTheDocument()
    expect(screen.getByText('你的句子')).toBeInTheDocument()
    expect(screen.getByText('The pen is in the bag.')).toBeInTheDocument()
    expect(screen.getByText('參考答案')).toBeInTheDocument()
    expect(screen.getByText('The pen is on the desk.')).toBeInTheDocument()
    expect(screen.getByText('The bag is under the chair.')).toBeInTheDocument()
    expect(screen.getByText(/設定 OpenRouter 帳號後可以用 AI 批改/)).toBeInTheDocument()
    expect(grade).not.toHaveBeenCalled()
  })

  it('「去設定」到設定頁', async () => {
    start()
    await write('I have a apple and a banana.')
    fireEvent.click(await screen.findByRole('button', { name: '去設定' }))
    expect(location.pathname).toBe('/settings')
  })

  it('我寫對了＝對、我寫錯了＝錯；完成頁 2 題答對 1 題；寫作不寫入單字池與作答紀錄', async () => {
    const onSettle = start()
    await write('I have an apple and a banana.')
    fireEvent.click(await screen.findByRole('button', { name: '我寫對了' }))
    expect(await screen.findByText('2／2')).toBeInTheDocument()
    await write('The pen on desk.')
    fireEvent.click(await screen.findByRole('button', { name: '我寫錯了' }))
    // 錯題重做（創辦人試用 2026-10-04 ⑤）：自評寫錯的那題再出一次，寫對才完成；分數看第一次
    expect(await screen.findByText('再練一次錯題')).toBeInTheDocument()
    await write('The pen is on the desk.')
    fireEvent.click(await screen.findByRole('button', { name: '我寫對了' }))
    const done = await screen.findByTestId('lesson-done')
    expect(done).toHaveTextContent('2 題')
    expect(done).toHaveTextContent('答對 1 題')
    expect(onSettle).toHaveBeenCalledOnce()
    expect(await db.wordPool.count()).toBe(0)
    expect(await db.reviewLogs.count()).toBe(0)
  })
})

describe('有金鑰：AI 批改（s06 ai）', () => {
  beforeEach(async () => {
    await saveLink(db, KEY, 'paste', Date.now())
  })

  it('送出時按鈕變「批改中…」；批改收到連結、題目、級距與句子', async () => {
    let resolve!: (o: GradeOutcome) => void
    const grade = vi.fn<GradeFn>(() => new Promise((r) => (resolve = r)))
    start(writing, grade)
    await write('I have a apple and a banana.')
    const busy = await screen.findByRole('button', { name: '批改中…' })
    expect(busy).toBeDisabled()
    expect(busy).toHaveAttribute('aria-busy', 'true')
    expect(grade).toHaveBeenCalledWith(
      expect.objectContaining({ apiKey: KEY }),
      {
        kind: 'translate',
        promptZh: '我有一個蘋果和一根香蕉。',
        words: ['have', 'and'],
        referenceEn: ['I have an apple and a banana.'],
        rubricZh: ['用 have 表示「有」', 'apple 前用 an、banana 前用 a', '用 and 連接兩樣東西'],
        level: 'A1',
        answer: 'I have a apple and a banana.',
      },
      expect.any(AbortSignal),
    )
    resolve(ok(WRONG))
    expect(await screen.findByText('建議寫法')).toBeInTheDocument()
  })

  it('判錯：你的句子標出錯處、建議寫法、逐點說明、來源小字；我懂了繼續＝錯', async () => {
    start(writing, async () => ok(WRONG))
    await write('I have a apple and a banana.')
    expect(await screen.findByText('建議寫法')).toBeInTheDocument()
    expect(screen.getByText('a apple', { selector: 'mark' })).toBeInTheDocument()
    expect(screen.getByText('an apple', { selector: 'strong' })).toBeInTheDocument()
    const items = screen.getAllByRole('listitem').map((li) => li.textContent)
    expect(items).toEqual(['apple 是母音開頭，前面用 an。', '可數名詞單數前要加 a 或 an。'])
    expect(screen.getByText('由你的 OpenRouter 帳號批改')).toBeInTheDocument()
    click('我懂了，繼續')
    expect(await screen.findByText('2／2')).toBeInTheDocument()
    click('跳過')
    // 判錯與跳過的都進錯題重做；重做時再跳過就不再出
    expect(await screen.findByText('再練一次錯題')).toBeInTheDocument()
    expect(screen.getByText('1／2')).toBeInTheDocument()
    click('跳過')
    expect(await screen.findByText('2／2')).toBeInTheDocument()
    click('跳過')
    expect(await screen.findByTestId('lesson-done')).toHaveTextContent('答對 0 題')
  })

  it('判對：顯示「正確」、不顯示建議寫法；算對', async () => {
    const right: GradeResult = {
      isCorrect: true,
      corrected: 'I have an apple and a banana.',
      errors: [],
      explanationZh: 'an apple、a banana 都用得正確。',
      levelOk: true,
    }
    start([writing[0]], async () => ok(right))
    await write('I have an apple and a banana.')
    expect(await screen.findByText('正確')).toBeInTheDocument()
    expect(screen.queryByText('建議寫法')).toBeNull()
    click('我懂了，繼續')
    expect(await screen.findByTestId('lesson-done')).toHaveTextContent('答對 1 題')
  })

  it('題目標了 selfCheck（TASK-18 替代規則）：有金鑰也走自評、不顯示設定提示', async () => {
    const grade = vi.fn<GradeFn>()
    start([{ ...writing[0], selfCheck: true }], grade)
    await write('I have an apple and a banana.')
    expect(await screen.findByText('跟參考答案比一比，意思一樣嗎？')).toBeInTheDocument()
    expect(screen.queryByText(/設定 OpenRouter 帳號後可以用 AI 批改/)).toBeNull()
    expect(grade).not.toHaveBeenCalled()
  })
})

describe('批改失敗（s06 fail）：保留參考答案、這題仍能完成', () => {
  beforeEach(async () => {
    await saveLink(db, KEY, 'paste', Date.now())
  })

  it.each([
    ['quota', '今日免費額度已用完。可以先對照參考答案，或到設定換一個模型。'],
    ['network', '網路好像斷了。可以先對照參考答案，或稍後再試。'],
    ['keyInvalid', 'OpenRouter 連結已失效，請到設定重新連結。'],
    ['other', 'AI 這次沒有給出可用的結果。可以先對照參考答案，或稍後再試。'],
  ] as const)('%s → 說明文字', async (reason, text) => {
    start([writing[0]], async () => ({ ok: false, reason }))
    await write('I have a apple.')
    const alert = await screen.findByRole('alert')
    expect(alert).toHaveTextContent('AI 批改暫時無法使用')
    expect(alert).toHaveTextContent(text)
    expect(screen.getByText('I have an apple and a banana.')).toBeInTheDocument()
  })

  describe('離線（main 定稿文案 write.fail.offline）', () => {
    const offline = () => vi.spyOn(navigator, 'onLine', 'get').mockReturnValue(false)
    afterEach(() => vi.restoreAllMocks())

    it('送出時已離線：不呼叫批改，直接顯示離線說明與參考答案', async () => {
      offline()
      const grade = vi.fn<GradeFn>()
      start([writing[0]], grade)
      await write('I have a apple.')
      expect(await screen.findByRole('alert')).toHaveTextContent(
        '目前離線，AI 批改需要網路。可以先對照參考答案。',
      )
      expect(screen.getByText('I have an apple and a banana.')).toBeInTheDocument()
      expect(grade).not.toHaveBeenCalled()
    })

    it('批改途中斷網（回 network 且此時離線）：顯示離線說明', async () => {
      start([writing[0]], async () => {
        offline()
        return { ok: false, reason: 'network' }
      })
      await write('I have a apple.')
      expect(await screen.findByRole('alert')).toHaveTextContent(
        '目前離線，AI 批改需要網路。可以先對照參考答案。',
      )
    })
  })

  it('批改一直沒回應：逾時轉批改失敗（保留參考答案、可繼續），不停在批改中（創辦人試用 2026-10-05）', async () => {
    const hanging = (() => new Promise<Response>(() => {})) as unknown as typeof fetch
    start([writing[0]], (link, task, signal) =>
      gradeWriting(link, task, hanging, { signal, timeoutMs: 50 }),
    )
    await write('I have a apple.')
    expect(screen.getByRole('button', { name: '批改中…' })).toBeDisabled()
    expect(await screen.findByRole('alert')).toHaveTextContent(
      'AI 這次沒有給出可用的結果。可以先對照參考答案，或稍後再試。',
    )
    expect(screen.getByText('I have an apple and a banana.')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '繼續' })).toBeEnabled()
  })

  it('批改中離開畫面：取消批改請求', async () => {
    let sent: AbortSignal | undefined
    start([writing[0]], (_link, _task, signal) => {
      sent = signal
      return new Promise<GradeOutcome>(() => {})
    })
    await write('I have a apple.')
    await screen.findByRole('button', { name: '批改中…' })
    expect(sent?.aborted).toBe(false)
    cleanup()
    expect(sent?.aborted).toBe(true)
  })

  it('批改函式拋例外也當失敗', async () => {
    start([writing[0]], async () => {
      throw new Error('boom')
    })
    await write('I have a apple.')
    expect(await screen.findByRole('alert')).toHaveTextContent(
      'AI 這次沒有給出可用的結果。可以先對照參考答案，或稍後再試。',
    )
  })

  it('繼續＝錯；換模型到設定頁', async () => {
    start(writing, async () => ({ ok: false, reason: 'quota' }))
    await write('I have a apple.')
    await screen.findByRole('alert')
    click('繼續')
    expect(await screen.findByText('2／2')).toBeInTheDocument()
    await write('The pen.')
    within(await screen.findByRole('alert')).getByText('AI 批改暫時無法使用')
    click('換模型')
    expect(location.pathname).toBe('/settings')
  })

  it('完成頁：失敗後繼續算錯', async () => {
    start([writing[0]], async () => ({ ok: false, reason: 'network' }))
    await write('I have a apple.')
    await screen.findByRole('alert')
    click('繼續')
    // 批改失敗後繼續＝算錯、進重做；重做時批改又失敗，繼續後不再出（AI 不能用時不會卡住）
    expect(await screen.findByText('再練一次錯題')).toBeInTheDocument()
    await write('I have an apple.')
    await screen.findByRole('alert')
    click('繼續')
    expect(await screen.findByTestId('lesson-done')).toHaveTextContent('答對 0 題')
  })
})

// 創辦人試用 2026-10-05：批改結果畫面看不到原本的中文題目，沒辦法對照。三種結果畫面最上方都留作答時那張題目卡
describe('結果畫面保留原題（題型、中文題目、提示字）', () => {
  async function questionCardOnTop() {
    const zh = await screen.findByText('我有一個蘋果和一根香蕉。')
    let card = zh.parentElement!
    while (!card.textContent?.includes('中翻英')) card = card.parentElement!
    expect(card).not.toHaveTextContent('你的句子')
    expect(within(card).getByText('have、and').parentElement).toHaveTextContent(
      /^提示字：have、and$/,
    )
    // 題目卡在「你的句子」之前
    const yours = screen.getByText('你的句子')
    expect(card.compareDocumentPosition(yours) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
  }

  it('AI 批改結果', async () => {
    await saveLink(db, KEY, 'paste', Date.now())
    start([writing[0]], async () => ok(WRONG))
    await write('I have a apple and a banana.')
    await screen.findByText('建議寫法')
    await questionCardOnTop()
  })

  it('批改失敗', async () => {
    await saveLink(db, KEY, 'paste', Date.now())
    start([writing[0]], async () => ({ ok: false, reason: 'other' }))
    await write('I have a apple and a banana.')
    await screen.findByRole('alert')
    await questionCardOnTop()
  })

  it('沒有金鑰自評', async () => {
    start([writing[0]])
    await write('I have a apple and a banana.')
    await screen.findByText('跟參考答案比一比，意思一樣嗎？')
    await questionCardOnTop()
  })
})

describe('跳過', () => {
  it('不用寫字就能跳過，算錯', async () => {
    start([writing[0]])
    await box()
    click('跳過')
    // 算錯、進錯題重做；重做時再跳過就不再出
    expect(await screen.findByText('再練一次錯題')).toBeInTheDocument()
    await box()
    click('跳過')
    expect(await screen.findByTestId('lesson-done')).toHaveTextContent('答對 0 題')
  })
})
