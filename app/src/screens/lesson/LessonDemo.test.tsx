import 'fake-indexeddb/auto'
import { fireEvent, render, screen, within } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { db } from '../../data/appDb'
import { DEMO_SOURCE } from '../../lesson/demo'
import type { LessonItemsDoc, McqItem, ReadingItem, WordCardItem } from '../../lesson/items'
import { loadFixture } from '../../lesson/testFixtures'
import { stubCurriculumFetch } from '../../test/curriculumFetch'
import { LessonScreen } from './LessonScreen'

vi.mock('../../sound/sfx', async (orig) => ({
  ...(await orig<typeof import('../../sound/sfx')>()),
  playSfx: vi.fn(),
}))

// 示範課（創辦人 2026-10-05 裁示二）的練習模式：不寫 FSRS、作答紀錄、完成課、進度、同步。
// 單元層不跑聽說題（聽說題的畫面在各自測試；整課走過所有題型在 e2e/demo.spec）：來源課去掉聽說題
const full = loadFixture('a1-u01-l03')
const source: LessonItemsDoc = {
  ...full,
  items: full.items.filter((i) => !['listenType', 'listenChoice', 'shadowing'].includes(i.type)),
}
const loadItems = vi.fn(async () => source)
const cards = full.items.filter((i): i is WordCardItem => i.type === 'wordCard').slice(0, 4)
const mcq = full.items.find((i): i is McqItem => i.type === 'mcq')!
const reading = full.items.find((i): i is ReadingItem => i.type === 'reading')!
const sense = (g: string) => g.split('；')[0].replace(/（[^）]*）/g, '')
const CAPS = { tts: false, stt: false, llmKey: false }

beforeEach(async () => {
  stubCurriculumFetch()
  loadItems.mockClear()
  history.replaceState(null, '', '/lesson/demo')
  await db.delete()
  await db.open()
})

const header = () => document.querySelector('header')!
const count = (n: number, total: number) =>
  vi.waitFor(() => expect(within(header()).getByText(`${n}／${total}`)).toBeInTheDocument())
const click = (name: string) => fireEvent.click(screen.getByRole('button', { name }))
const radio = async (name: string) => fireEvent.click(await screen.findByRole('radio', { name }))

/** 本機資料表的筆數（示範課做完要全部不變） */
const tables = async () => ({
  wordPool: await db.wordPool.count(),
  reviewLogs: await db.reviewLogs.count(),
  lessonRuns: await db.lessonRuns.count(),
  courseProgress: await db.courseProgress.count(),
  speechCorrections: await db.speechCorrections.count(),
  outbox: await db.outbox.count(),
})
const EMPTY = {
  wordPool: 0,
  reviewLogs: 0,
  lessonRuns: 0,
  courseProgress: 0,
  speechCorrections: 0,
  outbox: 0,
}

async function write(ok: boolean) {
  fireEvent.change(await screen.findByRole('textbox', { name: '你的句子' }), {
    target: { value: 'I do it.' },
  })
  click('送出批改')
  fireEvent.click(await screen.findByRole('button', { name: ok ? '我寫對了' : '我寫錯了' }))
}

describe('示範課 /lesson/demo（創辦人 2026-10-05 裁示二）', () => {
  it('依序走完單字卡、配對、選擇、閱讀、翻譯兩題；含錯題重做；做完資料庫完全沒有變化', async () => {
    const onSettle = vi.fn()
    render(
      <LessonScreen
        lessonId={DEMO_SOURCE}
        loadItems={loadItems}
        capabilities={CAPS}
        onSettle={onSettle}
        demo={{ startType: null }}
      />,
    )
    // 4 張單字卡（第 1 張答錯）、配對、選擇、閱讀兩小題、翻譯兩題＝10 步
    for (const [i, c] of cards.entries()) {
      await count(i + 1, 10)
      await radio(i === 0 ? sense(c.distractorsZh[0]) : sense(c.glossZh))
      await screen.findByRole('status')
      click('繼續')
    }
    await count(5, 10)
    await screen.findByText('把英文和中文配成一對')
    for (const c of cards) {
      click(c.word)
      click(sense(c.glossZh))
    }
    click('繼續')
    await count(6, 10)
    await radio(mcq.options[mcq.answer])
    click('檢查')
    await screen.findByRole('status')
    click('繼續')
    for (const [k, q] of reading.questions.entries()) {
      await count(7 + k, 10)
      await radio(q.options[q.answer])
      click('檢查')
      await screen.findByRole('status')
      click('繼續')
    }
    await count(9, 10)
    expect(screen.getByText('中翻英')).toBeInTheDocument()
    expect(await tables()).toEqual(EMPTY)
    await write(true)
    await count(10, 10)
    await write(true)
    // 錯題重做：第 1 張單字卡
    await vi.waitFor(() => expect(screen.getByText('再練一次錯題')).toBeInTheDocument())
    await radio(sense(cards[0].glossZh))
    await screen.findByRole('status')
    click('繼續')
    const done = await screen.findByTestId('lesson-done')
    expect(done).toHaveTextContent('10 題')
    expect(done).toHaveTextContent('答對 9 題')
    expect(onSettle).not.toHaveBeenCalled()
    expect(await tables()).toEqual(EMPTY)
    expect(loadItems).toHaveBeenCalledWith(DEMO_SOURCE)
  })

  it('?type=translate：直接從翻譯第一題開始', async () => {
    render(
      <LessonScreen
        lessonId={DEMO_SOURCE}
        loadItems={loadItems}
        capabilities={CAPS}
        demo={{ startType: 'translate' }}
      />,
    )
    await count(1, 2)
    expect(screen.getByText('中翻英')).toBeInTheDocument()
  })

  it('從翻譯開始做完：顯示完成頁，資料庫完全沒有變化', async () => {
    render(
      <LessonScreen
        lessonId={DEMO_SOURCE}
        loadItems={loadItems}
        capabilities={CAPS}
        demo={{ startType: 'translate' }}
      />,
    )
    await count(1, 2)
    await write(true)
    await count(2, 2)
    await write(true)
    await screen.findByTestId('lesson-done')
    expect(await tables()).toEqual(EMPTY)
  })
})
