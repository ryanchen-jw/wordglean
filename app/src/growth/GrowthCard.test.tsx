import 'fake-indexeddb/auto'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import {
  fireEvent,
  getDefaultNormalizer,
  render,
  screen,
  waitFor,
  within,
} from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'
import { db } from '../data/appDb'
import type { PoolWord } from '../data/db'
import { saveSettings } from '../data/repo'
import { HomeScreen } from '../screens/home/HomeScreen'
import { CardState } from '../srs/scheduler'
import { stubCurriculumFetch } from '../test/curriculumFetch'

const DAY = 86_400_000

// 真課綱 A1 主題單元的字（A1 共 1063 字，70%＝745 字）
const A1_WORDS: string[] = (
  JSON.parse(readFileSync(resolve(process.cwd(), '../content/curriculum/a1.json'), 'utf-8')) as {
    units: { lessons: { words: string[] }[] }[]
  }
).units.flatMap((u) => u.lessons.flatMap((l) => l.words))

const reviewed = (wordId: string): PoolWord => ({
  wordId,
  state: CardState.Review,
  due: Date.now() + 5 * DAY,
  stability: 10,
  difficulty: 5,
  scheduledDays: 5,
  learningSteps: 0,
  reps: 1,
  lapses: 0,
  lastReview: Date.now() - DAY,
  courseRefs: ['a1-u01-l01'],
  favoritedAt: null,
  addedAt: 0,
})

async function seedLearned(words: string[]) {
  await db.wordPool.bulkPut(words.map(reviewed))
  await db.reviewLogs.bulkPut(
    words.map((wordId, i) => ({
      id: `log${i}`,
      wordId,
      rating: 3 as const,
      state: CardState.New,
      due: 0,
      stability: 0,
      difficulty: 0,
      scheduledDays: 0,
      learningSteps: 0,
      review: Date.now() - DAY,
    })),
  )
}

// 「往 A1（全形空白）0%」；預設比對會把查詢字串的全形空白收成半形、對不上畫面文字
const exact = { normalizer: getDefaultNormalizer({ collapseWhitespace: false }) }

const card = async () => screen.findByRole('button', { name: /我的成長/ })

beforeEach(async () => {
  stubCurriculumFetch()
  history.replaceState(null, '', '/')
  await db.delete()
  await db.open()
})

describe('首頁「我的成長」卡（TASK-26）', () => {
  it('第一次開啟不顯示', async () => {
    render(<HomeScreen />)
    expect(await screen.findByText('先花 5 分鐘找出你的起點')).toBeInTheDocument()
    expect(screen.queryByText('我的成長')).toBeNull()
  })

  it('未分級、學了 3 個字（1 個收藏未複習不算）：入門、往 A1　0%、已學 3、記得 3、這週新學 3 字', async () => {
    await seedLearned(['the', 'be', 'and'])
    await db.wordPool.put({
      ...reviewed('zebra'),
      lastReview: null,
      stability: 0,
      courseRefs: [],
      favoritedAt: 1,
    })
    render(<HomeScreen />)
    const c = within(await card())
    expect(await c.findByText('入門')).toBeInTheDocument()
    expect(c.getByText('往 A1　0%', exact)).toBeInTheDocument()
    expect(c.getByTestId('growth-learned')).toHaveTextContent('3')
    expect(c.getByTestId('growth-remembered')).toHaveTextContent('3')
    expect(c.getByText('已學單字')).toBeInTheDocument()
    expect(c.getByText('記得的字')).toBeInTheDocument()
    expect(c.getByText('這週新學 3 字')).toBeInTheDocument()
  })

  it('推薦 B1：程度 A2 與多益對照', async () => {
    await saveSettings(db, { cefrLevel: 'B1' }, 1)
    render(<HomeScreen />)
    const c = within(await card())
    expect(await c.findByText('A2｜約多益 225+')).toBeInTheDocument()
    expect(c.getByText('往 B1　0%', exact)).toBeInTheDocument()
  })

  it('點卡片展開各級進度：五級記得字數／總數與說明', async () => {
    await seedLearned(['the', 'be'])
    render(<HomeScreen />)
    fireEvent.click(await card())
    const sheet = within(await screen.findByRole('dialog', { name: '各級進度' }))
    expect(
      sheet.getByText(
        '根據記憶曲線，現在想得起來的機會在九成以上的字。太久沒複習會減少，複習後會回來。',
      ),
    ).toBeInTheDocument()
    expect(sheet.getByTestId('growth-level-A1')).toHaveTextContent('A12／1063')
    expect(sheet.getByTestId('growth-level-A2')).toHaveTextContent('A20／1241')
    expect(sheet.getByTestId('growth-level-B1')).toHaveTextContent('B10／2139')
    expect(sheet.getByTestId('growth-level-B2')).toHaveTextContent('B20／2415')
    expect(sheet.getByTestId('growth-level-C1')).toHaveTextContent('C10／913')
  })

  it('A1 記得 745 字（≥70%）：升到 A1、當天顯示「已達 A1」，並記下最高程度', async () => {
    expect(A1_WORDS).toHaveLength(1063)
    await seedLearned(A1_WORDS.slice(0, 745))
    render(<HomeScreen />)
    const c = within(await card())
    expect(await c.findByText('已達 A1')).toBeInTheDocument()
    expect(c.getByText('A1｜約多益 120+')).toBeInTheDocument()
    expect(c.getByText('往 A2　0%', exact)).toBeInTheDocument()
    await waitFor(async () => expect((await db.growth.get('local'))?.maxRank).toBe(1))
  })

  it('A1 記得 744 字（未滿 70%）：仍是入門、往 A1　69%', async () => {
    await seedLearned(A1_WORDS.slice(0, 744))
    render(<HomeScreen />)
    const c = within(await card())
    expect(await c.findByText('往 A1　69%', exact)).toBeInTheDocument()
    expect(c.getByText('入門')).toBeInTheDocument()
    expect(c.queryByText(/^已達/)).toBeNull()
  })

  it('已達 C1：顯示「已達最高級距 C1」、不顯示往下一級', async () => {
    await db.growth.put({ key: 'local', maxRank: 5, reachedAt: null })
    await saveSettings(db, { cefrLevel: 'A1' }, 1)
    render(<HomeScreen />)
    const c = within(await card())
    expect(await c.findByText('已達最高級距 C1')).toBeInTheDocument()
    expect(c.getByText('C1｜約多益 945+')).toBeInTheDocument()
    expect(c.queryByText(/^往 /)).toBeNull()
  })
})
