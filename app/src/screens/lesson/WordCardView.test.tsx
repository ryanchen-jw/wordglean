// G2：單字卡的測驗字作答前不可點——例句提示裡的變化形（meetings）也算；作答後全部可點
import 'fake-indexeddb/auto'
import { act, fireEvent, render, screen, within } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { DictionaryProvider } from '../../dict/DictionaryProvider'
import type { WordCardItem } from '../../lesson/items'
import { buildQueue, createRegistry, READ_TYPES } from '../../lesson/queue'
import { lessonWordCards } from '../../review/session'
import { fsDictDeps } from '../../test/dictFs'
import { afterSfx } from '../../sound/sfx'
import { speak, ttsAvailable } from '../../speech/speak'
import { WordCardView } from './WordCardView'

vi.mock('../../speech/speak', () => ({
  speak: vi.fn(async () => {}),
  ttsAvailable: vi.fn(() => true),
}))
vi.mock('../../sound/sfx', async (orig) => ({
  ...(await orig<typeof import('../../sound/sfx')>()),
  afterSfx: vi.fn(async () => {}),
}))
const sfxGate = { open: () => {} }

const loaded = fsDictDeps()

const item: WordCardItem = {
  id: 'wc-meeting',
  type: 'wordCard',
  word: 'meeting',
  exampleEn: 'Two meetings were moved to Friday.',
  exampleZh: '兩場會議改到星期五。',
  glossZh: '會議',
  distractorsZh: ['行李', '發票', '倉庫'],
}

describe('單字卡：測驗字的變化形作答前不可點（G2）', () => {
  it('例句提示的 meetings 作答前不可點、其他字可點；作答後可點', async () => {
    render(
      <DictionaryProvider deps={() => Promise.resolve(loaded)}>
        <WordCardView
          item={item}
          step={{
            key: 'k',
            itemId: item.id,
            type: 'wordCard',
            srsWord: 'meeting',
            choice: { options: ['會議', '行李', '發票', '倉庫'], answer: 0 },
          }}
          onAnswer={() => {}}
          onContinue={() => {}}
        />
      </DictionaryProvider>,
    )
    fireEvent.click(screen.getByRole('button', { name: '看例句提示' }))
    const hint = screen.getByTestId('wordcard-hint')
    expect(await within(hint).findByRole('button', { name: 'moved' })).toBeInTheDocument()
    expect(within(hint).queryByRole('button', { name: 'meetings' })).toBeNull()
    expect(screen.queryByRole('button', { name: 'meeting' })).toBeNull()

    fireEvent.click(screen.getByRole('radio', { name: /會議/ }))
    expect(await screen.findByRole('button', { name: 'meeting' })).toBeInTheDocument()
    expect(await screen.findByRole('button', { name: 'meetings' })).toBeInTheDocument()
  })
})

describe('單字卡：選項只顯示第一義、回饋顯示完整釋義（TASK-9 格式洩題）', () => {
  const be: WordCardItem = {
    id: 'a1-u01-l01-q02',
    type: 'wordCard',
    word: 'be',
    exampleEn: 'Be quiet.',
    exampleZh: '安靜。',
    glossZh: '是；保持（某種狀態）',
    distractorsZh: ['去', '有', '給'],
  }

  it('四個選項都不含「；」；答對後回饋含完整「是；保持（某種狀態）」', () => {
    const { steps } = buildQueue(
      { schemaVersion: 1, lessonId: 'a1-u01-l01', level: 'A1', items: [be] },
      createRegistry(READ_TYPES),
    )
    render(
      <DictionaryProvider deps={() => Promise.resolve(loaded)}>
        <WordCardView item={be} step={steps[0]} onAnswer={() => {}} onContinue={() => {}} />
      </DictionaryProvider>,
    )
    const radios = screen.getAllByRole('radio')
    expect(radios).toHaveLength(4)
    expect(radios.filter((r) => r.textContent!.includes('；'))).toEqual([])

    fireEvent.click(screen.getByRole('radio', { name: /是/ }))
    expect(screen.getByText('正確：是；保持（某種狀態）')).toBeInTheDocument()
  })

  it('複習卡：四個選項都不含「；」；答錯後回饋含完整「是；保持（某種狀態）」', () => {
    const [card] = lessonWordCards({
      schemaVersion: 1,
      lessonId: 'a1-u01-l01',
      level: 'A1',
      items: [be],
    })
    render(
      <DictionaryProvider deps={() => Promise.resolve(loaded)}>
        <WordCardView item={card.item} step={card.step} onAnswer={() => {}} onContinue={() => {}} />
      </DictionaryProvider>,
    )
    const radios = screen.getAllByRole('radio')
    expect(radios).toHaveLength(4)
    expect(radios.filter((r) => r.textContent!.includes('；'))).toEqual([])

    fireEvent.click(screen.getByRole('radio', { name: /去/ }))
    expect(screen.getByRole('status')).toHaveTextContent('be 是「是；保持（某種狀態）」')
  })
})

describe('單字卡：顯示英文原本的大小寫（TASK-22 移交①）', () => {
  it('題庫 word＝i：卡面與答錯回饋都顯示 I', async () => {
    const i: WordCardItem = {
      id: 'a1-u01-l02-q02',
      type: 'wordCard',
      word: 'i',
      exampleEn: 'I like tea.',
      exampleZh: '我喜歡茶。',
      glossZh: '我',
      distractorsZh: ['你', '他', '它'],
    }
    render(
      <DictionaryProvider deps={() => Promise.resolve(loaded)}>
        <WordCardView
          item={i}
          step={{
            key: 'k',
            itemId: i.id,
            type: 'wordCard',
            srsWord: 'i',
            choice: { options: ['我', '你', '他', '它'], answer: 0 },
          }}
          onAnswer={() => {}}
          onContinue={() => {}}
        />
      </DictionaryProvider>,
    )
    const card = screen.getByText('I', { selector: '[lang="en"], [lang="en"] *' })
    expect(card).toBeInTheDocument()
    expect(screen.queryByText('i', { exact: true })).toBeNull()
    fireEvent.click(screen.getByRole('radio', { name: /你/ }))
    expect(await screen.findByRole('status')).toHaveTextContent(/^I/)
  })
})

describe('單字卡：作答後自動念一次英文字（創辦人試用 2026-10-04 ②）', () => {
  const step = {
    key: 'k',
    itemId: item.id,
    type: 'wordCard' as const,
    srsWord: 'meeting',
    choice: { options: ['會議', '行李', '發票', '倉庫'], answer: 0 },
  }
  const renderCard = (onAnswer = vi.fn()) =>
    render(
      <DictionaryProvider deps={() => Promise.resolve(loaded)}>
        <WordCardView item={item} step={step} onAnswer={onAnswer} onContinue={() => {}} />
      </DictionaryProvider>,
    )

  beforeEach(() => {
    vi.mocked(speak).mockClear()
    vi.mocked(ttsAvailable).mockReturnValue(true)
    sfxGate.open = () => {}
    vi.mocked(afterSfx).mockImplementation(() => new Promise<void>((r) => (sfxGate.open = r)))
  })

  it.each([
    ['答對', /會議/],
    ['答錯', /行李/],
  ])('%s：等音效播完才念（同一條發音路徑），只念一次', async (_, option) => {
    const onAnswer = vi.fn()
    renderCard(onAnswer)
    fireEvent.click(screen.getByRole('radio', { name: option }))
    expect(onAnswer).toHaveBeenCalledOnce()
    expect(speak).not.toHaveBeenCalled()
    await act(async () => sfxGate.open())
    expect(speak).toHaveBeenCalledExactlyOnceWith('meeting')
  })

  it('手機不能播音（沒有喇叭鈕）：不念', async () => {
    vi.mocked(ttsAvailable).mockReturnValue(false)
    renderCard()
    fireEvent.click(screen.getByRole('radio', { name: /會議/ }))
    await act(async () => sfxGate.open())
    expect(speak).not.toHaveBeenCalled()
  })

  it('音效還沒播完就離開這題：不再念', async () => {
    const view = renderCard()
    fireEvent.click(screen.getByRole('radio', { name: /會議/ }))
    view.unmount()
    await act(async () => sfxGate.open())
    expect(speak).not.toHaveBeenCalled()
  })
})
