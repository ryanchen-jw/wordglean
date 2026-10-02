import 'fake-indexeddb/auto'
import { fireEvent, render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { db } from '../../data/appDb'
import type { PoolWord } from '../../data/db'
import type { LexIndex } from '../../dict/lexicon'
import type { LessonItemsDoc } from '../../lesson/items'
import { loadFixture } from '../../lesson/testFixtures'
import { CardState } from '../../srs/scheduler'
import { ReviewScreen } from './ReviewScreen'

// 期望文案取自設計 s07（複習 8／24）與 zh-TW.json；題目與釋義取自樣本課 fixture（a1-u01-l01）
const L1 = 'a1-u01-l01'
const docs: Record<string, LessonItemsDoc> = { [L1]: loadFixture(L1) }
const loadItems = async (id: string) => docs[id] ?? null
const DAY = 86_400_000

const due = (wordId: string, daysAgo: number): PoolWord => ({
  wordId,
  state: CardState.Review,
  due: Date.now() - daysAgo * DAY,
  stability: 3,
  difficulty: 5,
  scheduledDays: 3,
  learningSteps: 0,
  reps: 2,
  lapses: 0,
  lastReview: Date.now() - (daysAgo + 3) * DAY,
  courseRefs: [L1],
  favoritedAt: null,
  addedAt: 0,
})

beforeEach(async () => {
  history.replaceState(null, '', '/review')
  await db.delete()
  await db.open()
})

const option = (name: string) => screen.getByRole('radio', { name })
const cont = () => fireEvent.click(screen.getByRole('button', { name: '繼續' }))
const noNext = async () => null

describe('單獨複習（從到期複習小卡進來）', () => {
  it('依到期先後出題，頁首「複習 n／總數」；答對記 Good、答錯記 Again；做完顯示完成卡', async () => {
    await db.wordPool.bulkPut([due('have', 1), due('the', 2)])
    render(<ReviewScreen mode={{ kind: 'due', flow: false }} loadItems={loadItems} />)

    expect(await screen.findByText('複習 1／2')).toBeInTheDocument()
    expect(screen.getByRole('progressbar', { name: '複習進度' })).toHaveAttribute(
      'aria-valuemax',
      '2',
    )
    expect(screen.getByText('the')).toHaveAttribute('lang', 'en')
    fireEvent.click(option('那個、這個（指特定的人事物）'))
    expect(await screen.findByRole('status')).toHaveTextContent(
      '正確：那個、這個（指特定的人事物）',
    )
    cont()

    expect(await screen.findByText('複習 2／2')).toBeInTheDocument()
    fireEvent.click(option('是'))
    await screen.findByRole('status')
    cont()

    const done = await screen.findByTestId('review-done')
    expect(done).toHaveTextContent('複習完成')
    expect(done).toHaveTextContent('2 個字')
    expect(done).toHaveTextContent('答對 1 個')
    const logs = await db.reviewLogs.orderBy('review').toArray()
    expect(logs.map((l) => [l.wordId, l.rating])).toEqual([
      ['the', 3],
      ['have', 1],
    ])
    fireEvent.click(screen.getByRole('button', { name: '回到今天' }))
    expect(location.pathname).toBe('/')
  })

  it('沒有到期的字：顯示「目前沒有到期的單字」', async () => {
    render(<ReviewScreen mode={{ kind: 'due', flow: false }} loadItems={loadItems} />)
    expect(await screen.findByTestId('review-done')).toHaveTextContent('目前沒有到期的單字')
  })

  it('✕ 直接離開（每題已即時存好，不需確認）', async () => {
    await db.wordPool.put(due('the', 1))
    history.replaceState({ idx: 0 }, '', '/review')
    render(<ReviewScreen mode={{ kind: 'due', flow: false }} loadItems={loadItems} />)
    await screen.findByText('複習 1／1')
    fireEvent.click(screen.getByRole('button', { name: '離開' }))
    await vi.waitFor(() => expect(location.pathname).toBe('/'))
  })
})

describe('今天的學習（先複習再上課）', () => {
  it('複習完直接接下一課', async () => {
    await db.wordPool.put(due('the', 1))
    render(
      <ReviewScreen
        mode={{ kind: 'due', flow: true }}
        loadItems={loadItems}
        loadNextLessonId={async () => 'a1-u01-l02'}
      />,
    )
    await screen.findByText('複習 1／1')
    fireEvent.click(option('那個、這個（指特定的人事物）'))
    await screen.findByRole('status')
    cont()
    await screen.findByTestId('review-leaving')
    expect(location.pathname).toBe('/lesson/a1-u01-l02')
  })

  it('沒有到期：直接進下一課', async () => {
    render(
      <ReviewScreen
        mode={{ kind: 'due', flow: true }}
        loadItems={loadItems}
        loadNextLessonId={async () => 'a1-u01-l02'}
      />,
    )
    await screen.findByTestId('review-leaving')
    expect(location.pathname).toBe('/lesson/a1-u01-l02')
  })

  it('每日新字設 0：複習完顯示完成卡，不進小課', async () => {
    await db.settings.put({
      id: 'local',
      dailyNewLimit: 0,
      pauseMultiplier: 10,
      desiredRetention: 0.9,
      cefrLevel: null,
      updatedAt: 0,
    })
    await db.wordPool.put(due('the', 1))
    render(
      <ReviewScreen
        mode={{ kind: 'due', flow: true }}
        loadItems={loadItems}
        loadNextLessonId={async () => 'a1-u01-l02'}
      />,
    )
    await screen.findByText('複習 1／1')
    fireEvent.click(option('那個、這個（指特定的人事物）'))
    await screen.findByRole('status')
    cont()
    expect(await screen.findByTestId('review-done')).toHaveTextContent('複習完成')
    expect(location.pathname).toBe('/review')
  })

  it('整級上完：複習完顯示完成卡', async () => {
    render(
      <ReviewScreen
        mode={{ kind: 'due', flow: true }}
        loadItems={loadItems}
        loadNextLessonId={noNext}
      />,
    )
    expect(await screen.findByTestId('review-done')).toHaveTextContent('目前沒有到期的單字')
  })
})

describe('再複習一次剛學的字（D5：只練習）', () => {
  it('出本課 8 個字、不寫任何資料', async () => {
    render(<ReviewScreen mode={{ kind: 'practice', lessonId: L1 }} loadItems={loadItems} />)
    expect(await screen.findByText('複習 1／8')).toBeInTheDocument()
    expect(screen.getByText('the')).toBeInTheDocument()
    fireEvent.click(option('那個、這個（指特定的人事物）'))
    await screen.findByRole('status')
    cont()
    await screen.findByText('複習 2／8')
    expect(await db.reviewLogs.count()).toBe(0)
    expect(await db.outbox.count()).toBe(0)
  })

  it('沒有這課的題目：顯示「複習載入失敗」', async () => {
    render(
      <ReviewScreen mode={{ kind: 'practice', lessonId: 'a1-u09-l09' }} loadItems={loadItems} />,
    )
    expect(await screen.findByRole('alert')).toHaveTextContent('複習載入失敗')
  })
})

describe('收藏字複習卡（沒有課程來源）', () => {
  const info = (glossZh: string) => ({ cefr: 'A1' as const, toeic: false, freqRank: null, glossZh })
  const lex: LexIndex = new Map([
    ['river', info('n. 河, 江')],
    ['stone', info('n. 石頭')],
    ['tree', info('n. 樹')],
    ['cat', info('n. 貓')],
  ])

  it('以單字總表出題；沒有例句時不顯示例句提示鈕與例句', async () => {
    await db.wordPool.put({ ...due('river', 1), courseRefs: [], favoritedAt: 1 })
    render(
      <ReviewScreen
        mode={{ kind: 'due', flow: false }}
        loadItems={loadItems}
        loadLex={async () => lex}
      />,
    )
    expect(await screen.findByText('複習 1／1')).toBeInTheDocument()
    expect(screen.getAllByRole('radio')).toHaveLength(4)
    expect(screen.queryByRole('button', { name: '看例句提示' })).toBeNull()
    fireEvent.click(option('河, 江'))
    const fb = await screen.findByRole('status')
    expect(fb).toHaveTextContent('正確：河, 江')
    expect(fb.querySelectorAll('[lang="en"]')).toHaveLength(0)
    expect((await db.reviewLogs.toArray()).map((l) => [l.wordId, l.rating])).toEqual([['river', 3]])
  })
})
