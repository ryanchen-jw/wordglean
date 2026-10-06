import 'fake-indexeddb/auto'
import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import App from '../../App'
import { AboutScreen } from './AboutScreen'

const go = (path: string) => history.replaceState(null, '', path)

describe('隱私說明・授權・原始碼（TASK-21）', () => {
  it('從設定頁進入，說明原始碼授權', async () => {
    go('/settings')
    render(<App />)
    fireEvent.click(await screen.findByRole('button', { name: /隱私說明・授權・原始碼/ }))
    expect(location.pathname).toBe('/about')
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('隱私說明・授權・原始碼')
    expect(screen.getByText(/程式碼以 AGPL-3\.0 授權公開/)).toBeInTheDocument()
  })

  it.each([
    ['隱私說明', '/about/privacy'],
    ['授權與致謝', '/about/licenses'],
  ])('點「%s」進入 %s', (label, path) => {
    go('/about')
    render(<App />)
    fireEvent.click(screen.getByRole('button', { name: label }))
    expect(location.pathname).toBe(path)
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(label)
  })
})

describe('品牌字樣（TASK-25）', () => {
  it('顯示「拾字」與英文名 Wordglean，圖示為裝飾（不進無障礙樹）', () => {
    render(<AboutScreen />)
    const brand = screen.getByTestId('about-brand')
    expect(brand).toHaveTextContent('拾字Wordglean')
    expect(brand.querySelector('.lg-brand-icon')).toHaveAttribute('aria-hidden', 'true')
  })
})

describe('原始碼連結（VITE_SOURCE_URL）', () => {
  it('有設定網址時顯示「查看原始碼」連結，另開分頁', () => {
    render(<AboutScreen sourceUrl="https://example.org/linguaapp" />)
    const link = screen.getByRole('link', { name: '查看原始碼' })
    expect(link).toHaveAttribute('href', 'https://example.org/linguaapp')
    expect(link).toHaveAttribute('target', '_blank')
    expect(link).toHaveAttribute('rel', 'noopener noreferrer')
  })

  it.each([[undefined], ['  ']])('沒有設定（%j）時不顯示連結，只有授權說明', (sourceUrl) => {
    render(<AboutScreen sourceUrl={sourceUrl} />)
    expect(screen.queryByRole('link')).toBeNull()
    expect(screen.getByText(/程式碼以 AGPL-3\.0 授權公開/)).toBeInTheDocument()
  })
})
