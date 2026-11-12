// 高音質發音診斷頁（TASK-34 AC#3）：顯示需求列的各項資訊；App 內沒有連到它的入口
/// <reference types="node" />
import { readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { VoiceDiagnosticsScreen } from './VoiceDiagnosticsScreen'

afterEach(() => {
  vi.unstubAllGlobals()
  localStorage.clear()
  sessionStorage.clear()
})

function stubBrowser() {
  Object.defineProperty(navigator, 'gpu', {
    configurable: true,
    value: {
      requestAdapter: async () => ({
        limits: { maxBufferSize: 268435456, maxStorageBufferBindingSize: 134217728 },
        info: { vendor: 'apple', architecture: 'common-3' },
        features: new Set(['shader-f16']),
      }),
    },
  })
  Object.defineProperty(navigator, 'storage', {
    configurable: true,
    value: {
      estimate: async () => ({ usage: 330 * 2 ** 20, quota: 1024 * 2 ** 20 }),
      persisted: async () => false,
    },
  })
  const model =
    'https://huggingface.co/onnx-community/Kokoro-82M-v1.0-ONNX/resolve/main/onnx/model.onnx'
  vi.stubGlobal('caches', {
    has: async () => true,
    open: async () => ({
      keys: async () => [new Request(model)],
      match: async () =>
        new Response('x', { headers: { 'content-length': String(310 * 2 ** 20) } }),
    }),
  })
}

describe('診斷頁 /debug/voice', () => {
  it('顯示 UA、WebGPU 限制、儲存空間、快取檔案、高音質旗標、最近一次失敗', async () => {
    stubBrowser()
    localStorage.setItem('lg.ttsHq.downloaded', '1')
    localStorage.setItem(
      'lg.ttsHq.lastFailure',
      '{"stage":"download","reason":"crashed","message":"m","at":"2026-11-13T00:00:00.000Z"}',
    )
    sessionStorage.setItem('lg.ttsHqLoading', '1')
    render(<VoiceDiagnosticsScreen />)
    const page = screen.getByTestId('screen-debug-voice')
    expect(page).toHaveTextContent(navigator.userAgent)
    expect(await screen.findByText(/268435456 \(256\.0 MB\)/)).toBeInTheDocument()
    expect(page).toHaveTextContent('maxStorageBufferBindingSize: 134217728 (128.0 MB)')
    expect(page).toHaveTextContent('apple common-3')
    expect(await screen.findByText('330.0 MB')).toBeInTheDocument()
    expect(page).toHaveTextContent('quota: 1024.0 MB')
    expect(page).toHaveTextContent('persisted: false')
    expect(
      await screen.findByText(
        /onnx-community\/Kokoro-82M-v1\.0-ONNX\/resolve\/main\/onnx\/model\.onnx/,
      ),
    ).toBeInTheDocument()
    expect(page).toHaveTextContent('header 310.0 MB')
    expect(page).toHaveTextContent('lg.ttsHq.downloaded: 1')
    expect(page).toHaveTextContent('lg.ttsHqLoading: 1')
    expect(page).toHaveTextContent('"reason":"crashed"')
  })

  it('沒有 WebGPU、沒有快取：照實顯示，不當掉', async () => {
    Object.defineProperty(navigator, 'gpu', { configurable: true, value: undefined })
    vi.stubGlobal('caches', { has: async () => false })
    render(<VoiceDiagnosticsScreen />)
    expect(await screen.findByText(/no \(navigator\.gpu missing\)/)).toBeInTheDocument()
    expect(await screen.findByText('cache not found')).toBeInTheDocument()
    expect(screen.getByTestId('screen-debug-voice')).toHaveTextContent('lg.ttsHq.lastFailure: none')
  })

  it('App 內沒有入口：除了路由表，src 裡沒有其他地方提到 /debug/voice', () => {
    const files = (dir: string): string[] =>
      readdirSync(dir, { withFileTypes: true }).flatMap((e) =>
        e.isDirectory() ? files(join(dir, e.name)) : [join(dir, e.name)],
      )
    const hits = files('src')
      .filter((f) => !/\.test\.tsx?$/.test(f))
      .filter((f) => readFileSync(f, 'utf-8').includes('/debug/voice'))
      .map((f) => f.replace(/\\/g, '/'))
    expect(hits.sort()).toEqual(['src/routes.tsx', 'src/screens/debug/VoiceDiagnosticsScreen.tsx'])
  })
})
