import { act, fireEvent, render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'
import App from './App'

const go = (path: string) => history.replaceState(null, '', path)

describe('App 路由與底部導覽', () => {
  beforeEach(() => go('/'))

  it('首頁：標題「今天」、導覽「今天」為目前頁', () => {
    render(<App />)
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('今天')
    const nav = screen.getByRole('navigation', { name: '主要導覽' })
    expect(nav.querySelector('[aria-current="page"]')).toHaveTextContent('今天')
  })

  it('點導覽「單字庫」切換畫面與網址', async () => {
    render(<App />)
    fireEvent.click(screen.getByRole('link', { name: '單字庫' }))
    expect(location.pathname).toBe('/words')
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('單字庫')
    expect(screen.getByRole('link', { name: '單字庫' })).toHaveAttribute('aria-current', 'page')
  })

  it('設定：從首頁齒輪進入、無底部導覽、返回回首頁', async () => {
    render(<App />)
    fireEvent.click(screen.getByRole('link', { name: '設定' }))
    expect(location.pathname).toBe('/settings')
    expect(screen.queryByRole('navigation', { name: '主要導覽' })).toBeNull()
    fireEvent.click(screen.getByRole('button', { name: '返回' }))
    // history.back() 在 jsdom 為非同步，等 popstate
    await act(() => new Promise((r) => window.addEventListener('popstate', r, { once: true })))
    expect(location.pathname).toBe('/')
  })

  it('直接開啟子頁時返回鍵回首頁', async () => {
    go('/settings')
    render(<App />)
    fireEvent.click(screen.getByRole('button', { name: '返回' }))
    expect(location.pathname).toBe('/')
  })

  it('尚未開放的目的地顯示暫時頁', () => {
    go('/models')
    render(<App />)
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('尚未開放')
  })

  it('未知路徑導回首頁', () => {
    go('/nope')
    render(<App />)
    expect(location.pathname).toBe('/')
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('今天')
  })
})
