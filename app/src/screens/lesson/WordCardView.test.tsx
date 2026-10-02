// G2：單字卡的測驗字作答前不可點——例句提示裡的變化形（meetings）也算；作答後全部可點
import 'fake-indexeddb/auto'
import { fireEvent, render, screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { DictionaryProvider } from '../../dict/DictionaryProvider'
import type { WordCardItem } from '../../lesson/items'
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
