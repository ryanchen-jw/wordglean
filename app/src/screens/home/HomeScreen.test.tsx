import 'fake-indexeddb/auto'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'
import { db } from '../../data/appDb'
import { getSettings } from '../../data/repo'
import type { PoolWord } from '../../data/db'
import { CardState } from '../../srs/scheduler'
import { stubCurriculumFetch } from '../../test/curriculumFetch'
import { HomeScreen } from './HomeScreen'

const DAY = 86_400_000

const dueWord = (i: number): PoolWord => ({
  wordId: `w${i}`,
  state: CardState.Review,
  due: Date.now() - DAY,
  stability: 3,
  difficulty: 5,
  scheduledDays: 3,
  learningSteps: 0,
  reps: 2,
  lapses: 0,
  lastReview: Date.now() - 4 * DAY,
  courseRefs: ['b1-u01-l01'],
  favoritedAt: null,
  addedAt: 0,
})

beforeEach(async () => {
  stubCurriculumFetch()
  history.replaceState(null, '', '/')
  await db.delete()
  await db.open()
})

// 期望文案取自設計 s01 與 zh-TW.json；課程名稱取自真課綱 b1.json
describe('首頁（s01）', () => {
  it('第一次開啟：分級測驗入口、副標「還沒有分級」', async () => {
    render(<HomeScreen />)
    expect(await screen.findByText('先花 5 分鐘找出你的起點')).toBeInTheDocument()
    expect(screen.getByText('還沒有分級')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '開始分級測驗' })).toBeInTheDocument()
    expect(screen.getByTestId('screen-home')).toHaveAttribute('data-state', 'first')
  })

  it('跳過分級：寫入級距 A1、前往 A1 課程地圖；之後不再是第一次開啟', async () => {
    render(<HomeScreen />)
    fireEvent.click(await screen.findByRole('button', { name: '跳過，從 A1 開始' }))
    await waitFor(async () => expect((await getSettings(db)).cefrLevel).toBe('A1'))
    expect(location.pathname + location.search).toBe('/course?level=A1')
    await waitFor(() =>
      expect(screen.getByTestId('screen-home')).toHaveAttribute('data-state', 'default'),
    )
    expect(screen.getByText('A1｜約多益 60+')).toBeInTheDocument()
  })

  it('預設：到期 24、下一課為 B1 基礎常用字第 2 課', async () => {
    await db.courseProgress.put({
      lessonId: 'b1-u01-l01',
      completedAt: Date.now() - 2 * DAY,
      updatedAt: 0,
    })
    await db.wordPool.bulkPut(Array.from({ length: 24 }, (_, i) => dueWord(i)))
    render(<HomeScreen />)
    expect(await screen.findByText('先複習，再上一課・約 11 分鐘')).toBeInTheDocument()
    expect(screen.getByText('B1｜約多益 275+')).toBeInTheDocument()
    expect(screen.getByText('24')).toBeInTheDocument()
    expect(screen.getByText('約 6 分鐘')).toBeInTheDocument()
    expect(screen.getByText('基礎常用字・第 2 課')).toBeInTheDocument()
    expect(screen.getByText('約 5 分鐘・新字 9')).toBeInTheDocument()
    expect(screen.getByText('複習 0／24')).toBeInTheDocument()
    expect(screen.getByText('新課 0／1')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /下一課/ })).toHaveAttribute(
      'href',
      '/course?lesson=b1-u01-l02',
    )
    expect(screen.getByRole('link', { name: /到期複習/ })).toHaveAttribute('href', '/review')
    // TASK-18：今天的學習先複習、複習完接下一課
    fireEvent.click(screen.getByRole('button', { name: '開始今天的學習' }))
    expect(location.pathname + location.search).toBe('/review?flow=today')
  })

  it('沒有到期：開始今天的學習直接進下一課', async () => {
    await db.courseProgress.put({
      lessonId: 'b1-u01-l01',
      completedAt: Date.now() - 2 * DAY,
      updatedAt: 0,
    })
    render(<HomeScreen />)
    fireEvent.click(await screen.findByRole('button', { name: '開始今天的學習' }))
    expect(location.pathname).toBe('/lesson/b1-u01-l02')
  })

  it('新課暫停：待複習 101 > 10×10', async () => {
    await db.courseProgress.put({ lessonId: 'a1-u01-l01', completedAt: 1, updatedAt: 0 })
    await db.wordPool.bulkPut(Array.from({ length: 101 }, (_, i) => dueWord(i)))
    render(<HomeScreen />)
    expect(await screen.findByText('新課暫停')).toBeInTheDocument()
    expect(screen.getByText('待複習超過 100 個，降回 100 以下會自動恢復')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '開始複習' })).toBeInTheDocument()
    expect(screen.queryByText('今天已完成')).toBeNull()
  })

  it('今天都完成：沒有到期、今天上過一課', async () => {
    await db.courseProgress.put({ lessonId: 'a1-u01-l01', completedAt: Date.now(), updatedAt: 0 })
    render(<HomeScreen />)
    expect(await screen.findByText('今天的學習都完成了')).toBeInTheDocument()
    expect(screen.getByText('明天約有 0 個單字到期。')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '再上一課（選用）' })).toBeInTheDocument()
    expect(screen.getByText('新課 1／1')).toBeInTheDocument()
  })
})
