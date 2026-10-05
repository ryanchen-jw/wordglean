import 'fake-indexeddb/auto'
import { fireEvent, render, screen, within } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { db } from '../../data/appDb'
import type { LessonItemsDoc, WordCardItem } from '../../lesson/items'
import { loadFixture } from '../../lesson/testFixtures'
import { stubCurriculumFetch } from '../../test/curriculumFetch'
import { playSfx } from '../../sound/sfx'
import { LessonScreen } from './LessonScreen'

vi.mock('../../sound/sfx', async (orig) => ({
  ...(await orig<typeof import('../../sound/sfx')>()),
  playSfx: vi.fn(),
}))

// 配對題接進小課（創辦人 2026-10-05 裁示一）：只留單字卡（8 張）→ 一課 10 步：卡 1–4、配對、卡 5–8、配對
const LESSON = 'a1-u01-l01'
const full = loadFixture(LESSON)
const cards = full.items.filter((i): i is WordCardItem => i.type === 'wordCard')
const doc: LessonItemsDoc = { ...full, items: cards }
const loadItems = async () => doc
const sense = (g: string) => g.split('；')[0].replace(/（[^）]*）/g, '')

beforeEach(async () => {
  vi.mocked(playSfx).mockClear()
  stubCurriculumFetch()
  history.replaceState(null, '', `/lesson/${LESSON}`)
  await db.delete()
  await db.open()
})

const header = () => document.querySelector('header')!
const count = (n: number, total = 10) =>
  vi.waitFor(() => expect(within(header()).getByText(`${n}／${total}`)).toBeInTheDocument())
const cont = () => fireEvent.click(screen.getByRole('button', { name: '繼續' }))
const btn = (name: string) => screen.getByRole('button', { name })

async function answerCard(c: WordCardItem) {
  fireEvent.click(await screen.findByRole('radio', { name: sense(c.glossZh) }))
  await screen.findByRole('status')
  cont()
}

/** 配完一題配對；miss＝先配錯一次（第一個字配第二個字的中文） */
async function match(group: WordCardItem[], miss = false) {
  await screen.findByText('把英文和中文配成一對')
  if (miss) {
    fireEvent.click(btn(group[0].word))
    fireEvent.click(btn(sense(group[1].glossZh)))
  }
  for (const c of group) {
    fireEvent.click(btn(c.word))
    fireEvent.click(btn(sense(c.glossZh)))
  }
  cont()
}

describe('小課的配對題（創辦人 2026-10-05 裁示一）', () => {
  it('第 4 張單字卡後出現配對（第 5 題），內容是剛學的 4 個字；第 8 張後再一題', async () => {
    render(<LessonScreen lessonId={LESSON} loadItems={loadItems} />)
    for (const [i, c] of cards.slice(0, 4).entries()) {
      await count(i + 1)
      await answerCard(c)
    }
    await count(5)
    expect(screen.getByText('配對')).toBeInTheDocument()
    for (const w of ['the', 'be', 'and', 'of']) expect(btn(w)).toBeEnabled()
    await match(cards.slice(0, 4))
    for (const [i, c] of cards.slice(4).entries()) {
      await count(i + 6)
      await answerCard(c)
    }
    await count(10)
    for (const w of ['a', 'in', 'to', 'have']) expect(btn(w)).toBeEnabled()
  })

  it('配錯過的配對進錯題重做（整題重配）；FSRS 只依單字卡；結算把配對算進題數與答對數', async () => {
    const onSettle = vi.fn()
    render(<LessonScreen lessonId={LESSON} loadItems={loadItems} onSettle={onSettle} />)
    for (const c of cards.slice(0, 4)) await answerCard(c)
    await match(cards.slice(0, 4), true)
    for (const c of cards.slice(4)) await answerCard(c)
    await match(cards.slice(4))
    // 錯題重做：只有第一題配對，整題重配（四個字都回到可點）
    await vi.waitFor(() => expect(screen.getByText('再練一次錯題')).toBeInTheDocument())
    await count(1, 1)
    for (const w of ['the', 'be', 'and', 'of']) expect(btn(w)).toBeEnabled()
    await match(cards.slice(0, 4))
    const done = await screen.findByTestId('lesson-done')
    expect(done).toHaveTextContent('10 題')
    expect(done).toHaveTextContent('答對 9 題')
    expect(onSettle).toHaveBeenCalledWith(
      expect.objectContaining({ total: 10, correct: 9, wrongKeys: ['matching#1'] }),
    )
    // 單字卡 8 張各寫一筆；配對不寫
    expect(await db.reviewLogs.count()).toBe(8)
    expect((await db.wordPool.toArray()).map((w) => w.wordId).sort()).toEqual([
      'a',
      'and',
      'be',
      'have',
      'in',
      'of',
      'the',
      'to',
    ])
    // 答錯的配對不算「已排進明天的複習」
    expect(done).not.toHaveTextContent('已排進明天的複習')
  })
})
