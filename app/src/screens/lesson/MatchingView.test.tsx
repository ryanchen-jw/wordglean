import { act, fireEvent, render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { WordCardItem } from '../../lesson/items'
import { matchingStep } from '../../lesson/matching'
import { playSfx } from '../../sound/sfx'
import { speak } from '../../speech/speak'
import { MatchingView } from './MatchingView'

vi.mock('../../sound/sfx', async (orig) => ({
  ...(await orig<typeof import('../../sound/sfx')>()),
  playSfx: vi.fn(),
}))
vi.mock('../../speech/speak', async (orig) => ({
  ...(await orig<typeof import('../../speech/speak')>()),
  speak: vi.fn(async () => {}),
  ttsAvailable: () => true,
}))

const card = (n: number, word: string, glossZh: string): WordCardItem => ({
  id: `c${n}`,
  type: 'wordCard',
  word,
  exampleEn: '',
  exampleZh: '',
  glossZh,
  distractorsZh: ['甲', '乙', '丙'],
})
const cards = [
  card(1, 'the', '那個、這個（指特定的人事物）'),
  card(2, 'be', '是；保持（某種狀態）'),
  card(3, 'and', '和、以及'),
  card(4, 'have', '有、擁有'),
]
const step = matchingStep('matching#1', cards)

const btn = (name: string) => screen.getByRole('button', { name })
const setup = () => {
  const onAnswer = vi.fn()
  const onContinue = vi.fn()
  render(<MatchingView step={step} onAnswer={onAnswer} onContinue={onContinue} />)
  return { onAnswer, onContinue }
}
const pair = (en: string, zh: string) => {
  fireEvent.click(btn(en))
  fireEvent.click(btn(zh))
}

beforeEach(() => {
  vi.mocked(playSfx).mockClear()
  vi.mocked(speak).mockClear()
})

describe('配對題（創辦人 2026-10-05 裁示一）', () => {
  it('初始：題型標題、說明、四個英文、四個中文第一義，沒有「繼續」', () => {
    setup()
    expect(screen.getByText('配對')).toBeInTheDocument()
    expect(screen.getByText('把英文和中文配成一對')).toBeInTheDocument()
    for (const w of ['the', 'be', 'and', 'have']) expect(btn(w)).toHaveAttribute('lang', 'en')
    for (const g of ['那個、這個', '是', '和、以及', '有、擁有']) expect(btn(g)).toBeEnabled()
    expect(screen.queryByRole('button', { name: '繼續' })).toBeNull()
  })

  it('點英文就發音並標為選取', () => {
    setup()
    fireEvent.click(btn('be'))
    expect(speak).toHaveBeenCalledExactlyOnceWith('be')
    expect(btn('be')).toHaveAttribute('aria-pressed', 'true')
  })

  it('配對成功：兩邊鎖定變灰、播答對音效', () => {
    setup()
    pair('the', '那個、這個')
    expect(btn('the')).toBeDisabled()
    expect(btn('那個、這個')).toBeDisabled()
    expect(btn('the')).toHaveAttribute('data-match', 'locked')
    expect(vi.mocked(playSfx).mock.calls).toEqual([['correct']])
  })

  it('先點中文再點英文也可以配', () => {
    setup()
    fireEvent.click(btn('是'))
    fireEvent.click(btn('be'))
    expect(btn('be')).toBeDisabled()
  })

  it('配錯：兩邊短暫標紅、播答錯音效，之後恢復可再選', () => {
    vi.useFakeTimers()
    try {
      setup()
      pair('the', '是')
      expect(btn('the')).toHaveAttribute('data-match', 'wrong')
      expect(btn('是')).toHaveAttribute('data-match', 'wrong')
      expect(vi.mocked(playSfx).mock.calls).toEqual([['wrong']])
      act(() => vi.advanceTimersByTime(1000))
      expect(btn('the')).toHaveAttribute('data-match', 'idle')
      expect(btn('是')).toHaveAttribute('data-match', 'idle')
      expect(btn('the')).toBeEnabled()
    } finally {
      vi.useRealTimers()
    }
  })

  it('4 對都配完才算完成：全對＝答對；最後一對的音效由本題自己播（silent），出現「繼續」', () => {
    const { onAnswer, onContinue } = setup()
    pair('the', '那個、這個')
    pair('be', '是')
    pair('and', '和、以及')
    expect(onAnswer).not.toHaveBeenCalled()
    pair('have', '有、擁有')
    expect(onAnswer).toHaveBeenCalledExactlyOnceWith({
      correct: true,
      usedHint: false,
      silent: true,
    })
    expect(vi.mocked(playSfx).mock.calls).toEqual([
      ['correct'],
      ['correct'],
      ['correct'],
      ['correct'],
    ])
    fireEvent.click(btn('繼續'))
    expect(onContinue).toHaveBeenCalledOnce()
  })

  it('配錯過一次：配完算答錯（進錯題重做）', () => {
    const { onAnswer } = setup()
    pair('the', '是')
    pair('the', '那個、這個')
    pair('be', '是')
    pair('and', '和、以及')
    pair('have', '有、擁有')
    expect(onAnswer).toHaveBeenCalledExactlyOnceWith({
      correct: false,
      usedHint: false,
      silent: true,
    })
  })
})
