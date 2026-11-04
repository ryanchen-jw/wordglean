import 'fake-indexeddb/auto'
import { act, fireEvent, render, screen, within } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { db } from '../../data/appDb'
import { DictionaryProvider } from '../../dict/DictionaryProvider'
import type { LessonItemsDoc } from '../../lesson/items'
import { loadFixture } from '../../lesson/testFixtures'
import { stubCurriculumFetch } from '../../test/curriculumFetch'
import { fsDictDeps } from '../../test/dictFs'
import { playSfx } from '../../sound/sfx'
import { LessonScreen } from './LessonScreen'

vi.mock('../../sound/sfx', async (orig) => ({
  ...(await orig<typeof import('../../sound/sfx')>()),
  playSfx: vi.fn(),
}))

// 期望文案取自設計 s05／s07／s12／s14 與 zh-TW.json；題目與釋義取自樣本課 fixture（a1-u01-l01）
const LESSON = 'a1-u01-l01'
// 本檔只測讀類三題型：濾掉寫作題（TASK-15 登記；寫作題見 WritingView.test.tsx）
const full = loadFixture(LESSON)
const doc = {
  ...full,
  items: full.items.filter((it) => it.type !== 'translate' && it.type !== 'makeSentence'),
}
const loadItems = async () => doc

beforeEach(async () => {
  vi.mocked(playSfx).mockClear()
  stubCurriculumFetch()
  history.replaceState(null, '', `/lesson/${LESSON}`)
  await db.delete()
  await db.open()
})

const progress = () => screen.getByRole('progressbar', { name: '作答進度' })
const count = (n: number) => screen.findByText(`${n}／14`)
const option = (name: string) => screen.getByRole('radio', { name })
const cont = () => fireEvent.click(screen.getByRole('button', { name: '繼續' }))
/** 錯題重做的題號（頁首；閱讀題卡內也有「n／m」，只看頁首） */
const retryCount = (n: number, total: number) =>
  vi.waitFor(() => {
    const header = document.querySelector('header')!
    expect(within(header).getByText(`${n}／${total}`)).toBeInTheDocument()
    expect(within(header).getByRole('progressbar', { name: '再練一次錯題' })).toHaveAttribute(
      'aria-valuemax',
      String(total),
    )
  })

/** 依 fixture 的正解作答目前這題（wrong＝改選第一個錯誤選項） */
async function answerCurrent(n: number, wrong = false) {
  await count(n)
  await answerAt(n - 1, wrong)
}

const sense = (g: string) => g.split('；')[0].replace(/（[^）]*）/g, '')
const cardsOf = doc.items.filter((it) => it.type === 'wordCard')

/** 配完一題配對（創辦人 2026-10-05 裁示一）；wrong＝先配錯一次 */
async function matchAll(cards: typeof cardsOf, wrong = false) {
  await screen.findByText('把英文和中文配成一對')
  const btn = (name: string) => fireEvent.click(screen.getByRole('button', { name }))
  if (wrong) {
    btn(cards[0].word)
    btn(sense(cards[1].glossZh))
  }
  for (const c of cards) {
    btn(c.word)
    btn(sense(c.glossZh))
  }
  await screen.findByRole('button', { name: '繼續' })
}

/** 作答第 i 步（從 0 起；錯題重做時用原本的步驟位置）；第 5、10 步是配對（每 4 張單字卡後） */
async function answerAt(i: number, wrong = false) {
  if (i === 4 || i === 9) return matchAll(cardsOf.slice(i === 4 ? 0 : 4, i === 4 ? 4 : 8), wrong)
  const steps: { pick: string[]; check: boolean }[] = [
    ...doc.items.flatMap((it) => {
      // 選項只顯示第一義（全形分號前一段、去括號註記）
      if (it.type === 'wordCard')
        return [
          {
            pick: [it.glossZh, ...it.distractorsZh].map((g) =>
              g.split('；')[0].replace(/（[^）]*）/g, ''),
            ),
            check: false,
          },
        ]
      if (it.type === 'mcq') {
        const opts = [it.options[it.answer], ...it.options.filter((_, i) => i !== it.answer)]
        return [{ pick: opts, check: true }]
      }
      if (it.type === 'reading')
        return it.questions.map((q) => ({
          pick: [q.options[q.answer], ...q.options.filter((_, i) => i !== q.answer)],
          check: true,
        }))
      return []
    }),
  ]
  const s = steps[i - (i > 9 ? 2 : i > 4 ? 1 : 0)]
  fireEvent.click(option(s.pick[wrong ? 1 : 0]))
  if (s.check) fireEvent.click(screen.getByRole('button', { name: '檢查' }))
  await screen.findByRole('status')
}

describe('小課畫面（AC#2 單元層）', () => {
  it('單字卡出題：英文字、四個中文釋義、例句提示鈕、進度 1／14', async () => {
    render(<LessonScreen lessonId={LESSON} loadItems={loadItems} />)
    expect(await screen.findByText('the')).toHaveAttribute('lang', 'en')
    expect(screen.getByText('選出這個字的意思')).toBeInTheDocument()
    expect(screen.getAllByRole('radio')).toHaveLength(4)
    expect(screen.getByRole('button', { name: '看例句提示' })).toBeInTheDocument()
    expect(progress()).toHaveAttribute('aria-valuenow', '1')
    expect(progress()).toHaveAttribute('aria-valuemax', '14')
  })

  it('單字卡答對：點選即判定，回饋「正確：釋義」＋例句＋中譯，其他選項停用', async () => {
    render(<LessonScreen lessonId={LESSON} loadItems={loadItems} />)
    await screen.findByText('the')
    fireEvent.click(option('那個、這個'))
    const fb = await screen.findByRole('status')
    expect(fb).toHaveTextContent('正確：那個、這個（指特定的人事物）')
    expect(fb).toHaveTextContent('The cat is on the bed.')
    expect(fb).toHaveTextContent('那隻貓在床上。')
    expect(screen.queryAllByRole('radio')).toHaveLength(0)
    expect(document.querySelectorAll('[data-choice="correct"]')).toHaveLength(1)
    expect(document.querySelectorAll('[data-choice="dim"]')).toHaveLength(3)
    cont()
    await count(2)
  })

  it('單字卡答錯：選的標 ✗、正解標 ✓，回饋「the 是「釋義」」', async () => {
    render(<LessonScreen lessonId={LESSON} loadItems={loadItems} />)
    await screen.findByText('the')
    fireEvent.click(option('和、以及'))
    expect(await screen.findByRole('status')).toHaveTextContent(
      'the 是「那個、這個（指特定的人事物）」',
    )
    expect(document.querySelector('[data-choice="wrong"]')).toHaveTextContent('和、以及')
    expect(document.querySelector('[data-choice="correct"]')).toHaveTextContent('那個、這個')
    expect((await db.reviewLogs.toArray()).map((l) => l.rating)).toEqual([1])
  })

  it('看例句提示後答對＝Hard；顯示英文例句、提示鈕消失', async () => {
    render(<LessonScreen lessonId={LESSON} loadItems={loadItems} />)
    await screen.findByText('the')
    fireEvent.click(screen.getByRole('button', { name: '看例句提示' }))
    expect(screen.getByTestId('wordcard-hint')).toHaveTextContent('The cat is on the bed.')
    expect(screen.queryByRole('button', { name: '看例句提示' })).toBeNull()
    fireEvent.click(option('那個、這個'))
    await screen.findByRole('status')
    expect((await db.reviewLogs.toArray()).map((l) => l.rating)).toEqual([2])
  })

  it('答對但用時超過 15 秒＝Hard（計時從出題開始）', async () => {
    let clock = Date.parse('2026-10-02T08:00:00Z')
    render(<LessonScreen lessonId={LESSON} loadItems={loadItems} now={() => clock} />)
    await screen.findByText('the')
    clock += 15_001
    fireEvent.click(option('那個、這個'))
    await screen.findByRole('status')
    expect((await db.reviewLogs.toArray()).map((l) => l.rating)).toEqual([2])
  })

  it('選擇題：選了才能檢查；答錯回饋「答案是 A：of」＋兩個選項的釋義', async () => {
    render(<LessonScreen lessonId={LESSON} loadItems={loadItems} />)
    for (let n = 1; n <= 10; n++) {
      await answerCurrent(n)
      cont()
    }
    await count(11)
    expect(screen.getByText('選出最適合的字')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '檢查' })).toBeDisabled()
    fireEvent.click(option('in'))
    expect(option('in')).toHaveAttribute('aria-checked', 'true')
    fireEvent.click(screen.getByRole('button', { name: '檢查' }))
    const fb = await screen.findByRole('status')
    expect(fb).toHaveTextContent('答案是 A：of')
    expect(fb).toHaveTextContent('of＝⋯的（一杯⋯）；in＝在⋯裡面。')
  })

  it('閱讀理解：題號 1／2、看中文翻譯可展開收起、答錯回饋含正解', async () => {
    render(<LessonScreen lessonId={LESSON} loadItems={loadItems} />)
    for (let n = 1; n <= 12; n++) {
      await answerCurrent(n)
      cont()
    }
    await count(13)
    expect(screen.getByText('閱讀理解')).toBeInTheDocument()
    // 題號與題目以全形空白分隔；toHaveTextContent 會把它正規化成一般空白
    const question = screen.getByTestId('reading-question')
    expect(question).toHaveTextContent('1／2 Amy 有幾個兄弟姊妹？')
    // 中文裡的英文人名標 lang="en"
    expect(within(question).getByText('Amy')).toHaveAttribute('lang', 'en')
    fireEvent.click(screen.getByRole('button', { name: '看中文翻譯' }))
    expect(screen.getByTestId('reading-translation')).toHaveTextContent('Amy 十歲。')
    fireEvent.click(screen.getByRole('button', { name: '收起中文翻譯' }))
    expect(screen.queryByTestId('reading-translation')).toBeNull()
    fireEvent.click(option('一個'))
    fireEvent.click(screen.getByRole('button', { name: '檢查' }))
    expect(await screen.findByRole('status')).toHaveTextContent('答案是 B：兩個')
    cont()
    await count(14)
    expect(screen.getByTestId('reading-question')).toHaveTextContent('2／2 Amy 的妹妹早上在哪裡？')
  })

  it.each([
    ['答錯', '一個', '答案是 B：兩個'],
    ['答對', '兩個', '正確'],
  ])('閱讀理解：%s後仍可切換中文翻譯，aria-expanded 跟著變', async (_, pick, feedback) => {
    render(<LessonScreen lessonId={LESSON} loadItems={loadItems} />)
    for (let n = 1; n <= 12; n++) {
      await answerCurrent(n)
      cont()
    }
    await count(13)
    fireEvent.click(option(pick))
    fireEvent.click(screen.getByRole('button', { name: '檢查' }))
    expect(await screen.findByRole('status')).toHaveTextContent(feedback)
    expect(screen.queryByTestId('reading-translation')).toBeNull()

    const show = screen.getByRole('button', { name: '看中文翻譯' })
    expect(show).toHaveAttribute('aria-expanded', 'false')
    fireEvent.click(show)
    expect(screen.getByTestId('reading-translation')).toHaveTextContent('Amy 十歲。')
    const hide = screen.getByRole('button', { name: '收起中文翻譯' })
    expect(hide).toHaveAttribute('aria-expanded', 'true')
    fireEvent.click(hide)
    expect(screen.queryByTestId('reading-translation')).toBeNull()
    expect(screen.getByRole('button', { name: '看中文翻譯' })).toHaveAttribute(
      'aria-expanded',
      'false',
    )
    // 切換不影響回饋與「繼續」
    expect(screen.getByRole('status')).toHaveTextContent(feedback)
    cont()
    await count(14)
  })

  it.each([
    ['答錯', '一個'],
    ['答對', '兩個'],
  ])('閱讀理解：作答前展開的翻譯，%s後維持展開', async (_, pick) => {
    render(<LessonScreen lessonId={LESSON} loadItems={loadItems} />)
    for (let n = 1; n <= 12; n++) {
      await answerCurrent(n)
      cont()
    }
    await count(13)
    fireEvent.click(screen.getByRole('button', { name: '看中文翻譯' }))
    fireEvent.click(option(pick))
    fireEvent.click(screen.getByRole('button', { name: '檢查' }))
    await screen.findByRole('status')
    expect(screen.getByTestId('reading-translation')).toHaveTextContent('Amy 十歲。')
    expect(screen.getByRole('button', { name: '收起中文翻譯' })).toHaveAttribute(
      'aria-expanded',
      'true',
    )
  })

  it('全部做完 → 完成頁：單元名、新字 8 個、14 題（含配對 2 題）答對 12 題、答錯的單字卡 1 題進複習；onSettle 收到摘要', async () => {
    const onSettle = vi.fn()
    render(<LessonScreen lessonId={LESSON} loadItems={loadItems} onSettle={onSettle} />)
    for (let n = 1; n <= 14; n++) {
      await answerCurrent(n, n === 2 || n === 14)
      cont()
    }
    // 錯題重做（創辦人試用 2026-10-04 ⑤）：兩題都做對才完成
    await retryCount(1, 2)
    await answerAt(1)
    cont()
    await retryCount(2, 2)
    await answerAt(13)
    cont()
    const done = await screen.findByTestId('lesson-done')
    expect(within(done).getByRole('heading', { level: 1 })).toHaveTextContent('這一課完成了')
    expect(await within(done).findByText('基礎常用字（一）・第 1 課')).toBeInTheDocument()
    expect(done).toHaveTextContent('新學的 8 個字已加入單字庫，明天開始複習')
    expect(done).toHaveTextContent('the・be・and・of・a・in・to・have')
    expect(done).toHaveTextContent('14 題')
    expect(done).toHaveTextContent('答對 12 題')
    expect(done).toHaveTextContent('答錯的 1 題已排進明天的複習')
    expect(onSettle).toHaveBeenCalledOnce()
    expect(await db.courseProgress.get(LESSON)).toBeDefined()
    fireEvent.click(within(done).getByRole('button', { name: '回到今天' }))
    expect(location.pathname).toBe('/')
    // TASK-18 D5：只練習本課新字
    fireEvent.click(within(done).getByRole('button', { name: '再複習一次剛學的字' }))
    expect(location.pathname + location.search).toBe(`/review?lesson=${LESSON}`)
  })

  it('TTS／STT／金鑰皆不可用（AC#4）：聽說題略過，讀類 12 題（＋配對 2 題）照常出', async () => {
    render(
      <LessonScreen
        lessonId={LESSON}
        loadItems={loadItems}
        capabilities={{ tts: false, stt: false, llmKey: false }}
      />,
    )
    expect(await count(1)).toBeInTheDocument()
  })

  it('能播音（TASK-13）：聽類兩題進佇列，跟讀換成聽音打字（語音辨識未接上），穿插在第 11 題聽音打字、第 13 題聽音選答，一課 18 步（含配對 2 題）', async () => {
    render(
      <LessonScreen
        lessonId={LESSON}
        loadItems={loadItems}
        capabilities={{ tts: true, stt: false, llmKey: false }}
      />,
    )
    expect(await screen.findByText('1／18')).toBeInTheDocument()
    for (const [i, c] of cardsOf.entries()) {
      await screen.findByText(`${i + 1 + (i >= 4 ? 1 : 0)}／18`)
      fireEvent.click(option(sense(c.glossZh)))
      await screen.findByRole('status')
      cont()
      if (i === 3 || i === 7) {
        await matchAll(cardsOf.slice(i - 3, i + 1))
        cont()
      }
    }
    expect(await screen.findByText('11／18')).toBeInTheDocument()
    expect(screen.getByText('聽音打字')).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: '聽不出來' }))
    cont()
    expect(await screen.findByText('12／18')).toBeInTheDocument()
    expect(screen.getByText('選出最適合的字')).toBeInTheDocument()
    fireEvent.click(option('of'))
    fireEvent.click(screen.getByRole('button', { name: '檢查' }))
    await screen.findByRole('status')
    cont()
    expect(await screen.findByText('13／18')).toBeInTheDocument()
    expect(screen.getByText('聽音選答')).toBeInTheDocument()
  })
})

describe('音效（創辦人試用 2026-10-04 ④）', () => {
  it('答對、答錯各一聲', async () => {
    render(<LessonScreen lessonId={LESSON} loadItems={loadItems} />)
    await answerCurrent(1)
    expect(vi.mocked(playSfx).mock.calls).toEqual([['correct']])
    cont()
    await answerCurrent(2, true)
    expect(vi.mocked(playSfx).mock.calls).toEqual([['correct'], ['wrong']])
  })

  it('做完一課：完成音效一聲', async () => {
    render(<LessonScreen lessonId={LESSON} loadItems={loadItems} />)
    for (let n = 1; n <= 14; n++) {
      await answerCurrent(n)
      cont()
    }
    await screen.findByTestId('lesson-done')
    const calls = vi.mocked(playSfx).mock.calls
    // 12 題各一聲＋配對 2 題每對各一聲（4×2）＋完成
    expect(calls).toHaveLength(21)
    expect(calls.at(-1)).toEqual(['complete'])
  })
})

describe('離開與接續（s12）', () => {
  it('✕ → 確認框：焦點在「繼續上課」，按它回到題目', async () => {
    render(<LessonScreen lessonId={LESSON} loadItems={loadItems} />)
    await answerCurrent(1)
    cont()
    await count(2)
    fireEvent.click(screen.getByRole('button', { name: '離開' }))
    const dialog = await screen.findByRole('alertdialog')
    expect(dialog).toHaveTextContent('要離開這一課嗎？')
    expect(dialog).toHaveTextContent('已完成 1／14 題。進度會保留，下次從第 2 題繼續。')
    expect(within(dialog).getByRole('button', { name: '繼續上課' })).toHaveFocus()
    fireEvent.click(within(dialog).getByRole('button', { name: '繼續上課' }))
    expect(screen.queryByRole('alertdialog')).toBeNull()
  })

  it('離開後重開同一課：從第 3 題接續', async () => {
    const first = render(<LessonScreen lessonId={LESSON} loadItems={loadItems} />)
    for (let n = 1; n <= 2; n++) {
      await answerCurrent(n)
      cont()
    }
    await count(3)
    fireEvent.click(screen.getByRole('button', { name: '離開' }))
    fireEvent.click(
      within(await screen.findByRole('alertdialog')).getByRole('button', { name: '離開' }),
    )
    first.unmount()

    render(<LessonScreen lessonId={LESSON} loadItems={loadItems} />)
    expect(await screen.findByText('3／14')).toBeInTheDocument()
    expect(screen.getByText('and')).toBeInTheDocument()
  })
})

describe('最後一題答完、沒按繼續就按 ✕（走查 P2）', () => {
  it('確認框說明會記為完成；按離開即結算（記完成、清進度、呼叫 onSettle）', async () => {
    const onSettle = vi.fn()
    render(<LessonScreen lessonId={LESSON} loadItems={loadItems} onSettle={onSettle} />)
    for (let n = 1; n <= 13; n++) {
      await answerCurrent(n)
      cont()
    }
    await answerCurrent(14)
    fireEvent.click(screen.getByRole('button', { name: '離開' }))
    const dialog = await screen.findByRole('alertdialog')
    expect(dialog).toHaveTextContent('這一課已經做完了，離開後會記為完成。')
    fireEvent.click(within(dialog).getByRole('button', { name: '離開' }))
    await vi.waitFor(async () => expect(await db.courseProgress.get(LESSON)).toBeDefined())
    expect(await db.lessonRuns.count()).toBe(0)
    expect(onSettle).toHaveBeenCalledOnce()
  })
})

describe('錯題重做（創辦人試用 2026-10-04 ⑤）', () => {
  async function mainRoundWith2Wrong() {
    for (let n = 1; n <= 14; n++) {
      await answerCurrent(n, n === 2 || n === 14)
      cont()
    }
    await retryCount(1, 2)
  }

  it('主輪答錯 2 題 → 「再練一次錯題」只出這 2 題；仍錯的再出一輪；全對才完成；分數與 FSRS 只看第一次', async () => {
    const onSettle = vi.fn()
    render(<LessonScreen lessonId={LESSON} loadItems={loadItems} onSettle={onSettle} />)
    await mainRoundWith2Wrong()
    expect(screen.getByText('再練一次錯題')).toBeInTheDocument()
    expect(screen.getByText('be')).toBeInTheDocument()
    const logs = await db.reviewLogs.count()
    expect(onSettle).not.toHaveBeenCalled()

    await answerAt(1)
    cont()
    await retryCount(2, 2)
    await answerAt(13, true)
    cont()
    // 第 2 輪：只剩仍錯的那題
    await retryCount(1, 1)
    expect(screen.getByTestId('reading-question')).toHaveTextContent('Amy 的妹妹早上在哪裡？')
    await answerAt(13)
    cont()

    const done = await screen.findByTestId('lesson-done')
    expect(done).toHaveTextContent('答對 12 題')
    expect(done).toHaveTextContent('答錯的 1 題已排進明天的複習')
    expect(await db.reviewLogs.count()).toBe(logs)
    expect(onSettle).toHaveBeenCalledExactlyOnceWith(
      expect.objectContaining({ correct: 12, wrongKeys: ['a1-u01-l01-q02', 'a1-u01-l01-q15#1'] }),
    )
  })

  it('主輪最後一題答完、有錯題就按 ✕：不結算；確認框說還有錯題要練；重開後從重做接續', async () => {
    const onSettle = vi.fn()
    const first = render(
      <LessonScreen lessonId={LESSON} loadItems={loadItems} onSettle={onSettle} />,
    )
    for (let n = 1; n <= 13; n++) {
      await answerCurrent(n, n === 2)
      cont()
    }
    await answerCurrent(14)
    fireEvent.click(screen.getByRole('button', { name: '離開' }))
    const dialog = await screen.findByRole('alertdialog')
    expect(dialog).toHaveTextContent('還有 1 題錯題要再練一次。進度會保留，下次接著練。')
    fireEvent.click(within(dialog).getByRole('button', { name: '離開' }))
    first.unmount()
    expect(onSettle).not.toHaveBeenCalled()
    expect(await db.courseProgress.get(LESSON)).toBeUndefined()

    render(<LessonScreen lessonId={LESSON} loadItems={loadItems} onSettle={onSettle} />)
    await retryCount(1, 1)
    expect(screen.getByText('be')).toBeInTheDocument()
    await answerAt(1)
    cont()
    await screen.findByTestId('lesson-done')
    expect(onSettle).toHaveBeenCalledOnce()
  })
})

describe('載入失敗', () => {
  it('沒有這課的題目：顯示「這一課載入失敗」與回到課程', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {})
    const none = async (): Promise<LessonItemsDoc | null> => null
    render(<LessonScreen lessonId="a1-u99-l01" loadItems={none} />)
    expect(await screen.findByRole('alert')).toHaveTextContent('這一課載入失敗')
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: '回到課程' }))
    })
    expect(location.pathname).toBe('/course')
  })
})

describe('作答存檔失敗（非安全來源 randomUUID 事故）', () => {
  it('按「繼續」不可靜靜卡住：顯示錯誤提示、留在這題；再按「繼續」重試存檔即前進', async () => {
    const errors = vi.spyOn(console, 'error').mockImplementation(() => {})
    render(<LessonScreen lessonId={LESSON} loadItems={loadItems} />)
    await count(1)
    const tx = vi
      .spyOn(db, 'transaction')
      .mockImplementation((() => Promise.reject(new Error('寫入失敗'))) as never)
    await answerCurrent(1)
    await vi.waitFor(() => expect(errors).toHaveBeenCalled())
    await act(async () => cont())
    expect(await screen.findByRole('alert')).toHaveTextContent('出了點問題，請再試一次。')
    expect(screen.getByText('1／14')).toBeInTheDocument()
    tx.mockRestore()
    await act(async () => cont())
    await count(2)
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })
})

// TASK-16 接上可點查義版 EnglishText：G2 裁示「會洩漏答案的字作答前不可點，作答後全部改為可點」
describe('小課的可點英文字（G2）', () => {
  const loaded = fsDictDeps()
  const renderWithDict = () =>
    render(
      <DictionaryProvider deps={() => Promise.resolve(loaded)}>
        <LessonScreen lessonId={LESSON} loadItems={loadItems} />
      </DictionaryProvider>,
    )

  it('單字卡：作答前測驗字（含例句提示裡的）不可點；作答後可點查義', async () => {
    renderWithDict()
    await count(1)
    fireEvent.click(screen.getByRole('button', { name: '看例句提示' }))
    const hint = screen.getByTestId('wordcard-hint')
    expect((await within(hint).findAllByRole('button')).length).toBeGreaterThan(0)
    expect(screen.queryAllByRole('button', { name: 'the' })).toEqual([])
    await answerCurrent(1)
    const front = screen.getByText('the', { selector: '.text-display button' })
    fireEvent.click(front)
    expect(await screen.findByRole('dialog', { name: '單字查義' })).toBeInTheDocument()
  })

  it('選擇題：作答前選項是單選、字不可點；檢查後選項的字可點', async () => {
    renderWithDict()
    for (let n = 1; n <= 10; n++) {
      await answerCurrent(n)
      cont()
    }
    await count(11)
    const mcq = doc.items.find((it) => it.type === 'mcq')!
    const answerText = mcq.type === 'mcq' ? mcq.options[mcq.answer] : ''
    expect(screen.queryAllByRole('button', { name: answerText })).toEqual([])
    await answerCurrent(11)
    expect(screen.getAllByRole('button', { name: answerText }).length).toBeGreaterThan(0)
  })
})
