import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { DownloadProgress } from './DownloadProgress'

const noop = () => {}

// 期望文案取自 components.md §4（「42%」「下載中斷・重試」）與設計 s11（「下載」「已下載」）
describe('DownloadProgress 四態', () => {
  it('未下載：下載鈕', () => {
    const onStart = vi.fn()
    render(
      <DownloadProgress
        status={{ kind: 'notDownloaded' }}
        label="語音辨識模型"
        onStart={onStart}
        onRetry={noop}
      />,
    )
    const btn = screen.getByRole('button', { name: '下載語音辨識模型' })
    expect(btn).toHaveTextContent('下載')
    fireEvent.click(btn)
    expect(onStart).toHaveBeenCalledOnce()
  })

  it('下載中：進度條與百分比', () => {
    render(
      <DownloadProgress
        status={{ kind: 'downloading', progress: 0.42 }}
        label="語音辨識模型"
        onStart={noop}
        onRetry={noop}
      />,
    )
    expect(screen.getByRole('progressbar', { name: '語音辨識模型' })).toHaveAttribute(
      'aria-valuenow',
      '42',
    )
    expect(screen.getByText('42%')).toBeInTheDocument()
  })

  it('已下載', () => {
    render(
      <DownloadProgress status={{ kind: 'downloaded' }} label="x" onStart={noop} onRetry={noop} />,
    )
    expect(screen.getByText('已下載')).toBeInTheDocument()
  })

  it('失敗：下載中斷・重試', () => {
    const onRetry = vi.fn()
    render(
      <DownloadProgress status={{ kind: 'failed' }} label="x" onStart={noop} onRetry={onRetry} />,
    )
    fireEvent.click(screen.getByRole('button', { name: '下載中斷・重試' }))
    expect(onRetry).toHaveBeenCalledOnce()
  })
})
