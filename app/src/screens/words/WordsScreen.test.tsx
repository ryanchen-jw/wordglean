import 'fake-indexeddb/auto'
import { fireEvent, render, screen, within } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'
import { db } from '../../data/appDb'
import type { PoolWord } from '../../data/db'
import { CardState } from '../../srs/scheduler'
import { WordsScreen } from './WordsScreen'

const DAY = 86_400_000

const word = (wordId: string, p: Partial<PoolWord> = {}): PoolWord => ({
  wordId,
  state: CardState.Review,
  due: Date.now() + 10 * DAY,
  stability: 5,
  difficulty: 5,
  scheduledDays: 5,
  learningSteps: 0,
  reps: 3,
  lapses: 0,
  lastReview: null,
  courseRefs: [],
  favoritedAt: null,
  addedAt: 0,
  ...p,
})

const listed = () =>
  within(screen.getByTestId('word-list'))
    .queryAllByRole('listitem')
    .map((li) => li.querySelector('[lang="en"]')?.textContent)

beforeEach(async () => {
  history.replaceState(null, '', '/words')
  await db.delete()
  await db.open()
})

// 期望文案取自設計 s09 與 zh-TW.json
describe('單字庫（s09）', () => {
  it('空的：空狀態與「去上第一課」', async () => {
    render(<WordsScreen />)
    expect(await screen.findByText('單字庫還是空的')).toBeInTheDocument()
    expect(screen.getByText('共 0 字')).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: '去上第一課' }))
    expect(location.pathname).toBe('/course')
  })

  it('預設：摘要、列表、收藏星號、今天到期標示', async () => {
    await db.wordPool.bulkPut([
      word('meeting', { due: Date.now() - DAY }),
      word('reschedule', { favoritedAt: 1 }),
      word('agenda', { state: CardState.New, due: 0 }),
    ])
    render(<WordsScreen />)
    expect(await screen.findByText('共 3 字・今天到期 1')).toBeInTheDocument()
    expect(listed()).toEqual(['meeting', 'reschedule', 'agenda'])
    expect(screen.getByText('今天到期')).toBeInTheDocument()
    expect(screen.getByLabelText('已收藏')).toBeInTheDocument()
    expect(screen.getByText('新字')).toBeInTheDocument()
  })

  it('分頁、熟悉度下拉、搜尋可疊加', async () => {
    await db.wordPool.bulkPut([
      word('meeting', { due: Date.now() - DAY }),
      word('reschedule', { favoritedAt: 1, stability: 30 }),
      word('rest', { favoritedAt: 2 }),
    ])
    render(<WordsScreen />)
    await screen.findByText('共 3 字・今天到期 1')

    fireEvent.click(screen.getByRole('button', { name: '到期' }))
    expect(screen.getByRole('button', { name: '到期' })).toHaveAttribute('aria-pressed', 'true')
    expect(listed()).toEqual(['meeting'])

    fireEvent.click(screen.getByRole('button', { name: '收藏' }))
    expect(listed()).toEqual(['reschedule', 'rest'])

    fireEvent.click(screen.getByRole('button', { name: '熟悉度：全部' }))
    fireEvent.click(screen.getByRole('option', { name: '熟悉' }))
    expect(screen.queryByRole('dialog')).toBeNull()
    expect(screen.getByRole('button', { name: '熟悉度：熟悉' })).toBeInTheDocument()
    expect(listed()).toEqual(['reschedule'])

    fireEvent.click(screen.getByRole('button', { name: '熟悉度：熟悉' }))
    fireEvent.click(screen.getByRole('option', { name: '全部' }))
    fireEvent.change(screen.getByRole('searchbox', { name: '搜尋英文單字' }), {
      target: { value: 'res' },
    })
    expect(listed()).toEqual(['reschedule', 'rest'])
    fireEvent.change(screen.getByRole('searchbox'), { target: { value: 'xyz' } })
    expect(screen.getByText('沒有符合條件的單字')).toBeInTheDocument()
  })

  it('大量單字只先畫第一批', async () => {
    await db.wordPool.bulkPut(
      Array.from({ length: 120 }, (_, i) => word(`w${String(i).padStart(3, '0')}`)),
    )
    render(<WordsScreen />)
    await screen.findByText('共 120 字・今天到期 0')
    expect(listed()).toHaveLength(50)
  })
})
