// 設定的語音區（TASK-13 D5）：發音選擇、高音質未下載時選它＝先告知再下載、下載進度、不支援的手機
import 'fake-indexeddb/auto'
import { act, fireEvent, render, screen, within } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { DownloadStatus } from '../../download/download'
import { db } from '../../data/appDb'
import { SettingsScreen } from './SettingsScreen'

const state = vi.hoisted(() => ({
  status: { kind: 'notDownloaded' } as DownloadStatus,
  choice: 'system' as 'system' | 'hq',
  listeners: new Set<() => void>(),
}))
const startDownload = vi.fn()
const emit = () => state.listeners.forEach((l) => l())

vi.mock('../../speech/speak', () => ({
  hqVoice: {
    status: () => state.status,
    choice: () => state.choice,
    setChoice: (c: 'system' | 'hq') => {
      state.choice = c
      emit()
    },
    subscribe: (l: () => void) => {
      state.listeners.add(l)
      return () => state.listeners.delete(l)
    },
    startDownload: () => startDownload(),
  },
}))

beforeEach(async () => {
  state.status = { kind: 'notDownloaded' }
  state.choice = 'system'
  startDownload.mockClear()
  localStorage.clear()
  await db.delete()
  await db.open()
})

const voiceRow = () => screen.getByRole('button', { name: /^發音/ })

describe('設定・語音（s11）', () => {
  it('預設：發音＝手機內建聲音（預設）；高音質列有下載鈕', async () => {
    render(<SettingsScreen />)
    expect(await screen.findByRole('button', { name: /發音\s*手機內建聲音（預設）/ })).toBeVisible()
    expect(screen.getByRole('button', { name: '下載高音質發音（選配）' })).toBeInTheDocument()
  })

  it('按下載：先告知約 310MB；「之後再說」不下載、「下載」才開始', async () => {
    render(<SettingsScreen />)
    fireEvent.click(await screen.findByRole('button', { name: '下載高音質發音（選配）' }))
    const dialog = screen.getByRole('alertdialog')
    expect(dialog).toHaveTextContent('下載高音質發音？')
    expect(dialog).toHaveTextContent('約 310MB，建議連上 Wi-Fi 再下載。下載後不用網路也能用。')
    fireEvent.click(within(dialog).getByRole('button', { name: '之後再說' }))
    expect(startDownload).not.toHaveBeenCalled()
    fireEvent.click(screen.getByRole('button', { name: '下載高音質發音（選配）' }))
    fireEvent.click(within(screen.getByRole('alertdialog')).getByRole('button', { name: '下載' }))
    expect(startDownload).toHaveBeenCalledOnce()
    expect(screen.queryByRole('alertdialog')).toBeNull()
  })

  it('下載中顯示進度；失敗顯示「下載中斷・重試」，重試直接下載', async () => {
    render(<SettingsScreen />)
    await screen.findByRole('button', { name: '下載高音質發音（選配）' })
    act(() => {
      state.status = { kind: 'downloading', progress: 0.42 }
      emit()
    })
    expect(screen.getByRole('progressbar', { name: '高音質發音（選配）' })).toHaveAttribute(
      'aria-valuenow',
      '42',
    )
    act(() => {
      state.status = { kind: 'failed' }
      emit()
    })
    fireEvent.click(screen.getByRole('button', { name: '下載中斷・重試' }))
    expect(startDownload).toHaveBeenCalledOnce()
  })

  it('發音選單：高音質未下載時選它＝導向下載（先告知），不改選擇', async () => {
    render(<SettingsScreen />)
    fireEvent.click(await screen.findByRole('button', { name: /^發音/ }))
    fireEvent.click(screen.getByRole('option', { name: '高音質發音（選配）' }))
    expect(screen.getByRole('alertdialog')).toHaveTextContent('下載高音質發音？')
    expect(state.choice).toBe('system')
  })

  it('已下載：可在發音選單切換，列上顯示目前的選擇', async () => {
    state.status = { kind: 'downloaded' }
    state.choice = 'hq'
    render(<SettingsScreen />)
    expect(await screen.findByRole('button', { name: /發音\s*高音質發音/ })).toBeVisible()
    expect(screen.getByText('已下載')).toBeInTheDocument()
    fireEvent.click(voiceRow())
    fireEvent.click(screen.getByRole('option', { name: '手機內建聲音（預設）' }))
    expect(state.choice).toBe('system')
    expect(voiceRow()).toHaveTextContent('手機內建聲音（預設）')
  })

  it('不支援的手機：高音質列顯示「這支手機不支援高音質發音」、選單沒有高音質', async () => {
    state.status = { kind: 'unsupported' }
    render(<SettingsScreen />)
    expect(await screen.findByText('這支手機不支援高音質發音')).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: '下載高音質發音（選配）' })).toBeNull()
    fireEvent.click(voiceRow())
    expect(screen.getAllByRole('option').map((o) => o.textContent)).toEqual([
      '手機內建聲音（預設）',
    ])
  })
})
