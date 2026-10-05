import 'fake-indexeddb/auto'
import { fireEvent, render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { db } from '../../data/appDb'
import type { PoolWord } from '../../data/db'
import type { LexIndex } from '../../dict/lexicon'
import type { LessonItemsDoc, WordCardItem } from '../../lesson/items'
import { loadFixture } from '../../lesson/testFixtures'
import { CardState } from '../../srs/scheduler'
import { afterSfx, playSfx } from '../../sound/sfx'
import { speak } from '../../speech/speak'
import { ReviewScreen } from './ReviewScreen'

vi.mock('../../sound/sfx', async (orig) => ({
  ...(await orig<typeof import('../../sound/sfx')>()),
  playSfx: vi.fn(),
  afterSfx: vi.fn(async () => {}),
}))
vi.mock('../../speech/speak', async (orig) => ({
  ...(await orig<typeof import('../../speech/speak')>()),
  speak: vi.fn(async () => {}),
  ttsAvailable: () => true,
}))

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

describe('音效與自動發音（創辦人試用 2026-10-04 ②④）', () => {
  it('答對、答錯各一聲，作答後念一次英文字；做完顯示完成卡時播完成音', async () => {
    vi.mocked(playSfx).mockClear()
    vi.mocked(speak).mockClear()
    vi.mocked(afterSfx).mockClear()
    await db.wordPool.bulkPut([due('have', 1), due('the', 2)])
    render(<ReviewScreen mode={{ kind: 'due', flow: false }} loadItems={loadItems} />)
    await screen.findByText('複習 1／2')
    fireEvent.click(option('那個、這個'))
    expect(vi.mocked(playSfx).mock.calls).toEqual([['correct']])
    await vi.waitFor(() => expect(speak).toHaveBeenCalledExactlyOnceWith('the'))
    expect(afterSfx).toHaveBeenCalledOnce()
    await screen.findByRole('status')
    cont()
    await screen.findByText('複習 2／2')
    fireEvent.click(option('是'))
    expect(vi.mocked(playSfx).mock.calls).toEqual([['correct'], ['wrong']])
    await vi.waitFor(() => expect(speak).toHaveBeenLastCalledWith('have'))
    await screen.findByRole('status')
    cont()
    await screen.findByTestId('review-done')
    expect(vi.mocked(playSfx).mock.calls.at(-1)).toEqual(['complete'])
  })

  it('沒有到期（空的完成卡）：不播完成音', async () => {
    vi.mocked(playSfx).mockClear()
    render(<ReviewScreen mode={{ kind: 'due', flow: false }} loadItems={loadItems} />)
    await screen.findByTestId('review-done')
    expect(playSfx).not.toHaveBeenCalled()
  })
})

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
    fireEvent.click(option('那個、這個'))
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
    fireEvent.click(option('那個、這個'))
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
    fireEvent.click(option('那個、這個'))
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
    fireEvent.click(option('那個、這個'))
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

describe('配對題（創辦人 2026-10-05 裁示一：複習也要加）', () => {
  const sense = (g: string) => g.split('；')[0].replace(/（[^）]*）/g, '')
  const glossOf = (w: string) =>
    (docs[L1].items.find((i) => i.type === 'wordCard' && i.word === w) as WordCardItem).glossZh
  const btn = (name: string) => screen.getByRole('button', { name })

  it('每做 4 張到期字卡插一題配對（那 4 個字）；配對不寫 FSRS；剩不足 4 張不出；完成卡只數字卡', async () => {
    await db.wordPool.bulkPut([
      due('the', 5),
      due('be', 4),
      due('and', 3),
      due('of', 2),
      due('have', 1),
    ])
    render(<ReviewScreen mode={{ kind: 'due', flow: false }} loadItems={loadItems} />)
    const words = ['the', 'be', 'and', 'of']
    for (const [i, w] of words.entries()) {
      await screen.findByText(`複習 ${i + 1}／6`)
      fireEvent.click(option(sense(glossOf(w))))
      await screen.findByRole('status')
      cont()
    }
    await screen.findByText('複習 5／6')
    expect(screen.getByText('把英文和中文配成一對')).toBeInTheDocument()
    expect(await db.reviewLogs.count()).toBe(4)
    vi.mocked(playSfx).mockClear()
    fireEvent.click(btn('the'))
    fireEvent.click(btn(sense(glossOf('be'))))
    for (const w of words) {
      fireEvent.click(btn(w))
      fireEvent.click(btn(sense(glossOf(w))))
    }
    // 每配一對各一聲（配錯一聲），完成時不再多播
    expect(vi.mocked(playSfx).mock.calls).toEqual([
      ['wrong'],
      ['correct'],
      ['correct'],
      ['correct'],
      ['correct'],
    ])
    cont()
    await screen.findByText('複習 6／6')
    expect(await db.reviewLogs.count()).toBe(4)
    fireEvent.click(option(sense(glossOf('have'))))
    await screen.findByRole('status')
    cont()
    const done = await screen.findByTestId('review-done')
    expect(done).toHaveTextContent('5 個字')
    expect(done).toHaveTextContent('答對 5 個')
    expect(await db.reviewLogs.count()).toBe(5)
  })

  it('不足 4 張到期字卡：不出配對', async () => {
    await db.wordPool.bulkPut([due('the', 3), due('be', 2), due('and', 1)])
    render(<ReviewScreen mode={{ kind: 'due', flow: false }} loadItems={loadItems} />)
    expect(await screen.findByText('複習 1／3')).toBeInTheDocument()
  })
})
