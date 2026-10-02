import { act, fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { InstallCard } from './InstallCard'
import { createInstallPrompt, type InstallWindow } from './installPrompt'

function store(ua: string) {
  const handlers = new Map<string, (e: Event) => void>()
  const win: InstallWindow = {
    navigator: { userAgent: ua },
    matchMedia: () => ({ matches: false }),
    localStorage: { getItem: () => null, setItem: () => {} },
    addEventListener: (type, fn) => handlers.set(type, fn),
  }
  return { p: createInstallPrompt(win), handlers }
}

const IOS =
  'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1'

describe('加到主畫面卡片', () => {
  it('iOS Safari：顯示操作說明、沒有安裝鈕；按關閉後消失', () => {
    const { p } = store(IOS)
    render(<InstallCard store={p} />)
    expect(screen.getByText('在 Safari 點下方的「分享」，再選「加入主畫面」。')).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: '加到主畫面' })).toBeNull()
    fireEvent.click(screen.getByRole('button', { name: '關閉加到主畫面提示' }))
    expect(screen.queryByTestId('install-card')).toBeNull()
  })

  it('Android：事件到了才出現；按「加到主畫面」叫出系統安裝框', async () => {
    const { p, handlers } = store('Mozilla/5.0 (Linux; Android 14) Chrome/120.0.0.0 Mobile')
    render(<InstallCard store={p} />)
    expect(screen.queryByTestId('install-card')).toBeNull()
    const prompt = vi.fn(async () => {})
    act(() =>
      handlers.get('beforeinstallprompt')!(
        Object.assign(new Event('beforeinstallprompt', { cancelable: true }), {
          prompt,
          userChoice: Promise.resolve({ outcome: 'accepted' }),
        }),
      ),
    )
    expect(screen.getByText('之後從主畫面直接開啟，沒有網路也能複習。')).toBeInTheDocument()
    await act(async () => fireEvent.click(screen.getByRole('button', { name: '加到主畫面' })))
    expect(prompt).toHaveBeenCalledOnce()
    expect(screen.queryByTestId('install-card')).toBeNull()
  })
})
