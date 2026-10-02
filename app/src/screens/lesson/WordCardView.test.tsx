// G2：單字卡的測驗字作答前不可點——例句提示裡的變化形（meetings）也算；作答後全部可點
import 'fake-indexeddb/auto'
import { fireEvent, render, screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { DictionaryProvider } from '../../dict/DictionaryProvider'
import type { WordCardItem } from '../../lesson/items'
import { buildQueue, createRegistry, READ_TYPES } from '../../lesson/queue'
import { lessonWordCards } from '../../review/session'
import { fsDictDeps } from '../../test/dictFs'
import { WordCardView } from './WordCardView'

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
