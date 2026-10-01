import 'fake-indexeddb/auto'
import { fireEvent, render, screen, within } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'
import { db } from '../../data/appDb'
import { stubCurriculumFetch } from '../../test/curriculumFetch'
import { CourseScreen } from './CourseScreen'

beforeEach(async () => {
  stubCurriculumFetch()
  history.replaceState(null, '', '/course')
  await db.delete()
  await db.open()
})

const completeLessons = (...ids: string[]) =>
  db.courseProgress.bulkPut(
    ids.map((lessonId, i) => ({ lessonId, completedAt: i + 1, updatedAt: 0 })),
  )

// 單元名、課數、字表取自真課綱 content/curriculum/{a1,b1}.json
describe('課程地圖（s02）', () => {
  it('級距取最後完成的課；目前單元展開並標出目前這課', async () => {
    await completeLessons('b1-u01-l01', 'b1-u01-l02')
    render(<CourseScreen />)
    expect(await screen.findByText('2／6 課')).toBeInTheDocument()
    expect(screen.getByRole('tab', { name: 'B1' })).toHaveAttribute('aria-selected', 'true')
    expect(screen.getByText('B1｜約多益 275+')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /基礎常用字/ })).toHaveAttribute(
      'aria-expanded',
      'true',
    )
    expect(screen.getByRole('button', { name: /第 3 課.*目前這課/ })).toBeInTheDocument()
    // 其他單元收合
    expect(screen.getByRole('button', { name: /數字、時間與日期/ })).toHaveAttribute(
      'aria-expanded',
      'false',
    )
  })

  it('點小課開詳情彈層：標題、新字數、字表；Esc 關閉', async () => {
    await completeLessons('b1-u01-l01', 'b1-u01-l02')
    render(<CourseScreen />)
    fireEvent.click(await screen.findByRole('button', { name: /第 3 課/ }))
    const sheet = screen.getByRole('dialog', { name: '小課詳情' })
    expect(within(sheet).getByRole('heading')).toHaveTextContent('基礎常用字 3')
    expect(within(sheet).getByText('新字 8 個')).toBeInTheDocument()
    expect(
      within(sheet).getByText('aside・beneath・merely・regarding・moreover・whenever・surely・via'),
    ).toBeInTheDocument()
    expect(within(sheet).getByRole('button', { name: '開始這一課' })).toBeInTheDocument()
    fireEvent.keyDown(document, { key: 'Escape' })
    expect(screen.queryByRole('dialog')).toBeNull()
  })

  it('沒有進度時從 A1 開始；可自由切換級距', async () => {
    render(<CourseScreen />)
    expect(await screen.findByRole('button', { name: /基礎常用字（一）/ })).toBeInTheDocument()
    expect(screen.getByRole('tab', { name: 'A1' })).toHaveAttribute('aria-selected', 'true')
    fireEvent.click(screen.getByRole('tab', { name: 'B1' }))
    expect(await screen.findByRole('button', { name: '基礎常用字 0／6 課' })).toHaveAttribute(
      'aria-expanded',
      'true',
    )
    expect(screen.getByRole('tab', { name: 'B1' })).toHaveAttribute('aria-selected', 'true')
  })

  it('從首頁帶 ?lesson= 進來直接開該課詳情', async () => {
    history.replaceState(null, '', '/course?lesson=b1-u02-l01')
    render(<CourseScreen />)
    const sheet = await screen.findByRole('dialog', { name: '小課詳情' })
    expect(within(sheet).getByRole('heading')).toHaveTextContent('數字、時間與日期 1')
    fireEvent.click(screen.getByTestId('sheet-scrim'))
    expect(screen.queryByRole('dialog')).toBeNull()
    expect(location.search).toBe('')
  })
})
