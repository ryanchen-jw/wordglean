// 字典彈層＋可點英文字（設計 s08、components.md §7／§8／§12）；期望文案取自設計稿與 zh-TW.json、
// 詞條內容取自真字典資料（data/dict、data/lexicon）
import 'fake-indexeddb/auto'
import { act, fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import { useState } from 'react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { db } from '../data/appDb'
import { fsDictDeps } from '../test/dictFs'
import { BottomSheet } from '../ui/BottomSheet'
import { TOAST_MS } from '../ui/Toast'
import { DictionaryProvider } from './DictionaryProvider'
import { EnglishText, type EnglishTextProps } from './EnglishText'

const loaded = fsDictDeps()
const deps = () => Promise.resolve(loaded)

function renderText(props: EnglishTextProps) {
  return render(
    <DictionaryProvider deps={deps}>
      <p>
        <EnglishText {...props} />
      </p>
    </DictionaryProvider>,
  )
}

const word = (name: string) => screen.getByRole('button', { name })
const sheet = () => screen.findByRole('dialog', { name: '單字查義' })

beforeEach(async () => {
  await db.delete()
  await db.open()
})

describe('可點英文字', () => {
  it('每個英文字是按鈕；標點不是', () => {
    renderText({ text: 'Dear team, see you.' })
    expect(screen.getAllByRole('button').map((b) => b.textContent)).toEqual([
      'Dear',
      'team',
      'see',
      'you',
    ])
  })

  it('標點跟字綁在一起但不進按鈕：按鈕名稱只有字、文字內容與原文相同', () => {
    const text = `Every Saturday, they (the "two") don't stop... red,blue well-known 5-day 3rd.`
    const { container } = renderText({ text })
    expect(screen.getAllByRole('button').map((b) => b.textContent)).toEqual([
      'Every',
      'Saturday',
      'they',
      'the',
      'two',
      "don't",
      'stop',
      'red',
      'blue',
      'well-known',
      'day',
      'rd',
    ])
    expect(container.querySelector('[lang=en]')?.textContent).toBe(text)
    expect(word('Saturday').parentElement?.textContent).toBe('Saturday,')
    expect(word('the').parentElement?.textContent).toBe('(the')
    expect(word('two').parentElement?.textContent).toBe('"two")')
    expect(word('rd').parentElement?.textContent).toBe('3rd.')
    // 沒有緊鄰標點的字不多包一層
    expect(word('they').parentElement).toHaveAttribute('lang', 'en')
  })

  it('點綁了標點的字：查的是字本身，開字典', async () => {
    const onLookup = vi.fn()
    renderText({ text: 'Every Saturday, they go.', onLookup })
    fireEvent.click(word('Saturday'))
    expect(onLookup).toHaveBeenCalledWith('Saturday')
    await sheet()
  })

  it('不可點的字：標點照常保留，沒有多餘的按鈕', () => {
    const { container } = renderText({ text: 'Every Saturday, they (go).', disabled: 'all' })
    expect(screen.queryAllByRole('button')).toEqual([])
    expect(container.querySelector('[lang=en]')?.textContent).toBe('Every Saturday, they (go).')
  })

  it('會洩漏答案的字作答前不可點、不可聚焦；all＝整段不可點', async () => {
    const { unmount } = renderText({
      text: 'The meeting was moved.',
      disabled: new Set(['meeting']),
    })
    expect(screen.queryByRole('button', { name: 'meeting' })).toBeNull()
    expect(screen.getByText(/meeting/)).toBeInTheDocument()
    // 原形比對為非同步：等其他字變可點後再斷言測驗字仍不可點
    expect(await screen.findByRole('button', { name: 'moved' })).toBeInTheDocument()
    unmount()
    renderText({ text: 'The meeting was moved.', disabled: 'all' })
    expect(screen.queryAllByRole('button')).toEqual([])
  })

  it('disabled 以原形比對：測驗字的變化形（meetings、went）也不可點', async () => {
    const { unmount } = renderText({
      text: 'Two meetings were moved.',
      disabled: new Set(['meeting']),
    })
    expect(await screen.findByRole('button', { name: 'moved' })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'meetings' })).toBeNull()
    unmount()
    renderText({ text: 'She went home.', disabled: new Set(['go']) })
    expect(await screen.findByRole('button', { name: 'home' })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'went' })).toBeNull()
  })

  it('沒有 Provider 時退回純文字', () => {
    render(<EnglishText text="hello world" />)
    expect(screen.queryAllByRole('button')).toEqual([])
    expect(screen.getByText('hello world')).toHaveAttribute('lang', 'en')
  })

  it('點字回呼 onLookup（查字次數記錄用）', async () => {
    const onLookup = vi.fn()
    renderText({ text: 'our weekly meeting', onLookup })
    fireEvent.click(word('weekly'))
    expect(onLookup).toHaveBeenCalledWith('weekly')
    await sheet()
  })
})

describe('字典彈層（s08）', () => {
  it('變化形：原形提示、單字、級距、音標、詞性、釋義、資料來源', async () => {
    renderText({ text: 'our weekly meetings will be moved' })
    fireEvent.click(word('meetings'))
    const dlg = within(await sheet())
    expect(await dlg.findByText('meetings → 原形 meeting')).toBeInTheDocument()
    expect(dlg.getByRole('heading', { name: 'meeting' })).toBeInTheDocument()
    expect(dlg.getByText('A1')).toBeInTheDocument()
    expect(dlg.queryByText('多益常考')).toBeNull()
    expect(dlg.getByText('/ˈmiːtiŋ/')).toBeInTheDocument()
    expect(dlg.getByText('n.')).toBeInTheDocument()
    expect(dlg.getByText('會議, 會面')).toBeInTheDocument()
    expect(dlg.getByText('資料來源：ECDICT')).toBeInTheDocument()
    expect(dlg.getByRole('button', { name: '發音' })).toBeInTheDocument()
  })

  it('多益常考標籤（TSL 收錄的字）', async () => {
    renderText({ text: 'before the deadline' })
    fireEvent.click(word('deadline'))
    const dlg = within(await sheet())
    await dlg.findByRole('heading', { name: 'deadline' })
    expect(dlg.queryByText('→', { exact: false })).toBeNull()
    expect(dlg.getByText('B1')).toBeInTheDocument()
    expect(dlg.getByText('多益常考')).toBeInTheDocument()
  })

  it('查無此字：說明行、無收藏鈕', async () => {
    renderText({ text: 'send it to Jenny by Friday' })
    fireEvent.click(word('Jenny'))
    const dlg = within(await sheet())
    expect(await dlg.findByText('字典裡沒有這個字（可能是人名或專有名詞）')).toBeInTheDocument()
    expect(dlg.getByRole('heading', { name: 'Jenny' })).toBeInTheDocument()
    expect(dlg.queryByRole('button', { name: /收藏/ })).toBeNull()
  })

  it('開啟期間被查的字標示；Esc 關閉後標示移除、焦點還給該字', async () => {
    renderText({ text: 'weekly meeting' })
    fireEvent.click(word('meeting'))
    await sheet()
    expect(word('meeting')).toHaveAttribute('data-active')
    fireEvent.keyDown(document, { key: 'Escape' })
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull())
    expect(word('meeting')).not.toHaveAttribute('data-active')
    expect(word('meeting')).toHaveFocus()
  })

  it('疊在其他彈層上：Esc 只關字典彈層', async () => {
    function Outer() {
      const [open, setOpen] = useState(true)
      return open ? (
        <BottomSheet label="小課詳情" onClose={() => setOpen(false)}>
          <EnglishText text="meeting agenda" />
        </BottomSheet>
      ) : null
    }
    render(
      <DictionaryProvider deps={deps}>
        <Outer />
      </DictionaryProvider>,
    )
    fireEvent.click(word('agenda'))
    await sheet()
    fireEvent.keyDown(document, { key: 'Escape' })
    await waitFor(() => expect(screen.queryByRole('dialog', { name: '單字查義' })).toBeNull())
    expect(screen.getByRole('dialog', { name: '小課詳情' })).toBeInTheDocument()
  })
})

describe('片語（TASK-24 W5）', () => {
  it('點片語中的字：先顯示片語的意思（片語、標籤、級距、釋義），再顯示單字的意思', async () => {
    renderText({ text: 'She gave it up last year.' })
    fireEvent.click(word('up'))
    const dlg = within(await sheet())
    const phrase = await dlg.findByTestId('dict-phrase')
    expect(within(phrase).getByRole('heading', { name: 'give up' })).toBeInTheDocument()
    expect(within(phrase).getByText('片語')).toBeInTheDocument()
    expect(within(phrase).getByText('A2')).toBeInTheDocument()
    expect(within(phrase).getByText('放棄')).toBeInTheDocument()
    expect(within(phrase).getByRole('button', { name: '發音' })).toBeInTheDocument()
    const headings = dlg.getAllByRole('heading').map((h) => h.textContent)
    expect(headings).toEqual(['give up', 'up'])
  })

  it('點變化形：片語照原形顯示，單字照常顯示原形提示', async () => {
    renderText({ text: 'She gave up smoking.' })
    fireEvent.click(word('gave'))
    const dlg = within(await sheet())
    expect(await dlg.findByRole('heading', { name: 'give up' })).toBeInTheDocument()
    expect(await dlg.findByText('gave → 原形 give')).toBeInTheDocument()
  })

  it('不屬於片語的字沒有片語區；資料來源維持原字樣', async () => {
    renderText({ text: 'She gave it up last year.' })
    fireEvent.click(word('year'))
    const dlg = within(await sheet())
    await dlg.findByRole('heading', { name: 'year' })
    expect(dlg.queryByTestId('dict-phrase')).toBeNull()
    expect(dlg.getByText('資料來源：ECDICT')).toBeInTheDocument()
  })

  it('有片語區時資料來源註明片語自編（創辦人核可文案 2026-10-06）', async () => {
    renderText({ text: 'She gave it up last year.' })
    fireEvent.click(word('up'))
    const dlg = within(await sheet())
    await dlg.findByTestId('dict-phrase')
    expect(dlg.getByText('資料來源：ECDICT；片語：拾字自編（CC BY-SA 4.0）')).toBeInTheDocument()
    expect(dlg.queryByText('資料來源：ECDICT')).toBeNull()
  })

  it('收藏片語：單字池以片語字串為鍵', async () => {
    renderText({ text: 'She gave up smoking.' })
    fireEvent.click(word('up'))
    const phrase = within(await within(await sheet()).findByTestId('dict-phrase'))
    fireEvent.click(phrase.getByRole('button', { name: '加入收藏單字庫' }))
    expect(
      await phrase.findByRole('button', { name: '已在收藏單字庫（點一下取消）' }),
    ).toBeInTheDocument()
    expect((await db.wordPool.get('give up'))?.favoritedAt).toEqual(expect.any(Number))
    expect(await db.wordPool.get('up')).toBeUndefined()
  })

  it('作答前隱藏片語：片語的各個字（含變化形、可分離）不可點，插入的受詞與其他字可點', async () => {
    renderText({ text: 'She gave it up last year.', disabled: new Set(['give up']) })
    expect(await screen.findByRole('button', { name: 'last' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'it' })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'gave' })).toBeNull()
    expect(screen.queryByRole('button', { name: 'up' })).toBeNull()
  })

  it('作答前隱藏片語：只出現片語的一部分時不擋（up 單獨出現）', async () => {
    renderText({ text: 'Look up there.', disabled: new Set(['give up']) })
    expect(await screen.findByRole('button', { name: 'up' })).toBeInTheDocument()
  })
})

describe('收藏（s08 已收藏＋提示）', () => {
  it('加入收藏：進單字池（原形）、按鈕變已收藏、Toast「已加入收藏」；復原後取消收藏', async () => {
    renderText({ text: 'our meetings' })
    fireEvent.click(word('meetings'))
    const dlg = within(await sheet())
    fireEvent.click(await dlg.findByRole('button', { name: '加入收藏單字庫' }))
    expect(
      await dlg.findByRole('button', { name: '已在收藏單字庫（點一下取消）' }),
    ).toBeInTheDocument()
    expect((await db.wordPool.get('meeting'))?.favoritedAt).toEqual(expect.any(Number))
    const toast = screen.getByRole('status')
    expect(toast).toHaveTextContent('已加入收藏')
    fireEvent.click(within(toast).getByRole('button', { name: '復原' }))
    await waitFor(async () => expect((await db.wordPool.get('meeting'))?.favoritedAt).toBeNull())
    expect(screen.queryByRole('status')).toBeNull()
    expect(await dlg.findByRole('button', { name: '加入收藏單字庫' })).toBeInTheDocument()
  })

  it('已收藏點一下取消', async () => {
    renderText({ text: 'agenda' })
    fireEvent.click(word('agenda'))
    const dlg = within(await sheet())
    fireEvent.click(await dlg.findByRole('button', { name: '加入收藏單字庫' }))
    fireEvent.click(await dlg.findByRole('button', { name: '已在收藏單字庫（點一下取消）' }))
    expect(await dlg.findByRole('button', { name: '加入收藏單字庫' })).toBeInTheDocument()
    expect((await db.wordPool.get('agenda'))?.favoritedAt).toBeNull()
  })

  it('Toast 4 秒後自動消失', async () => {
    renderText({ text: 'agenda' })
    fireEvent.click(word('agenda'))
    const dlg = within(await sheet())
    const add = await dlg.findByRole('button', { name: '加入收藏單字庫' })
    // 只假 Toast 用的 setTimeout。實測：連 setImmediate（fake-indexeddb 的排程）一起假時收藏寫入失敗 5／450 次，只假 setTimeout 時 0／450；確切機制未證實
    vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout'] })
    try {
      fireEvent.click(add)
      expect(screen.getByRole('status')).toHaveTextContent('已加入收藏')
      act(() => vi.advanceTimersByTime(TOAST_MS))
      expect(screen.queryByRole('status')).toBeNull()
    } finally {
      vi.useRealTimers()
    }
    // 等寫入完成才結束，不留交易給下一個測試
    await waitFor(async () =>
      expect((await db.wordPool.get('agenda'))?.favoritedAt).toEqual(expect.any(Number)),
    )
  })

  it('收藏寫入失敗：不留「已加入收藏」，改提示出錯；按鈕仍是未收藏', async () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})
    renderText({ text: 'agenda' })
    fireEvent.click(word('agenda'))
    const dlg = within(await sheet())
    const add = await dlg.findByRole('button', { name: '加入收藏單字庫' })
    db.close()
    fireEvent.click(add)
    await waitFor(() =>
      expect(screen.getByRole('status')).toHaveTextContent('出了點問題，請再試一次。'),
    )
    expect(within(screen.getByRole('status')).queryByRole('button', { name: '復原' })).toBeNull()
    expect(dlg.getByRole('button', { name: '加入收藏單字庫' })).toBeInTheDocument()
    expect(consoleError).toHaveBeenCalled()
    consoleError.mockRestore()
  })
})

describe('字典延遲載入（TASK-22 效能預算）', () => {
  it('畫面上沒有可點英文字時不載字典；第一個英文字出現才預先載入', async () => {
    const spy = vi.fn(deps)
    const { rerender } = render(
      <DictionaryProvider deps={spy}>
        <p>今天</p>
      </DictionaryProvider>,
    )
    await act(async () => {})
    expect(spy).not.toHaveBeenCalled()

    rerender(
      <DictionaryProvider deps={spy}>
        <EnglishText text="the" />
      </DictionaryProvider>,
    )
    await waitFor(() => expect(spy).toHaveBeenCalled())
  })
})
