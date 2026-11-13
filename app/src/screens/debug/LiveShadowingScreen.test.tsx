// 原型頁的錄音生命週期（TASK-39 驗收補件）：取得麥克風期間連按、按停止、離開頁面，都不能留下沒人管的錄音
import { act, fireEvent, render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { LiveMic } from '../../speech/liveMic'
import { SpeechContext, type SpeechServices } from '../../speech/services'
import type { SttClient } from '../../speech/stt'
import LiveShadowingScreen from './LiveShadowingScreen'

const startLiveMic = vi.fn<() => Promise<LiveMic>>()
vi.mock('../../speech/liveMic', async (orig) => ({
  ...(await orig<typeof import('../../speech/liveMic')>()),
  liveMicSupported: () => true,
  startLiveMic: () => startLiveMic(),
}))

function deferred<T>() {
  let resolve!: (v: T) => void
  const promise = new Promise<T>((r) => (resolve = r))
  return { promise, resolve }
}

const fakeMic = () => ({
  read: () => new Float32Array(0),
  elapsed: () => 0,
  level: () => 0,
  stop: vi.fn(),
})

const READY = { kind: 'ready' } as const
const release = vi.fn()
const stt: SttClient = {
  get: () => READY,
  subscribe: () => () => {},
  refresh: async () => {},
  load: async () => {},
  transcribe: () => new Promise(() => {}),
  acquire: () => release,
}

const renderPage = () =>
  render(
    <SpeechContext.Provider value={{ stt } as unknown as SpeechServices}>
      <LiveShadowingScreen />
    </SpeechContext.Provider>,
  )

beforeEach(() => {
  startLiveMic.mockReset()
  release.mockReset()
})

describe('原型頁錄音生命週期', () => {
  it('取得麥克風期間連按 Start 只建立一條錄音', async () => {
    const d = deferred<LiveMic>()
    startLiveMic.mockReturnValue(d.promise)
    renderPage()
    // 同一個 act 內連點兩下：第二下時畫面還沒重繪，仍是 Start 的處理函式
    const button = screen.getByRole('button', { name: 'Start' })
    act(() => {
      fireEvent.click(button)
      fireEvent.click(button)
    })
    const mic = fakeMic()
    await act(async () => d.resolve(mic))
    expect(startLiveMic).toHaveBeenCalledTimes(1)
    expect(mic.stop).not.toHaveBeenCalled()
    expect(screen.getByRole('button', { name: 'Stop' })).toBeVisible()
  })

  it('取得麥克風期間按 Stop：權限回來後立即釋放，不開始辨識', async () => {
    const d = deferred<LiveMic>()
    startLiveMic.mockReturnValue(d.promise)
    renderPage()
    fireEvent.click(screen.getByRole('button', { name: 'Start' }))
    fireEvent.click(screen.getByRole('button', { name: 'Stop' }))
    const mic = fakeMic()
    await act(async () => d.resolve(mic))
    expect(mic.stop).toHaveBeenCalledTimes(1)
    expect(screen.getByRole('button', { name: 'Start' })).toBeVisible()
  })

  it('取得麥克風期間離開頁面：權限回來後立即釋放', async () => {
    const d = deferred<LiveMic>()
    startLiveMic.mockReturnValue(d.promise)
    const { unmount } = renderPage()
    fireEvent.click(screen.getByRole('button', { name: 'Start' }))
    unmount()
    const mic = fakeMic()
    await act(async () => d.resolve(mic))
    expect(mic.stop).toHaveBeenCalledTimes(1)
    expect(release).toHaveBeenCalledTimes(1)
  })

  it('錄音中離開頁面：停止錄音並放開辨識模型', async () => {
    const mic = fakeMic()
    startLiveMic.mockResolvedValue(mic)
    const { unmount } = renderPage()
    await act(async () => fireEvent.click(screen.getByRole('button', { name: 'Start' })))
    expect(screen.getByRole('button', { name: 'Stop' })).toBeVisible()
    unmount()
    expect(mic.stop).toHaveBeenCalledTimes(1)
    expect(release).toHaveBeenCalledTimes(1)
  })

  it('錄音中按 Stop：只釋放一次', async () => {
    const mic = fakeMic()
    startLiveMic.mockResolvedValue(mic)
    renderPage()
    await act(async () => fireEvent.click(screen.getByRole('button', { name: 'Start' })))
    fireEvent.click(screen.getByRole('button', { name: 'Stop' }))
    expect(mic.stop).toHaveBeenCalledTimes(1)
    expect(screen.getByText('Stopped: stopped')).toBeVisible()
  })
})
