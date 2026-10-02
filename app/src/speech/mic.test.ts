// 麥克風權限：不支援、拒絕、還沒問過；拒絕時開始錄音丟 MicDeniedError（瀏覽器 API 為假）
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { MicDeniedError, micPermission, startRecording } from './mic'

const nav = navigator as unknown as Record<string, unknown>

function stubMedia(getUserMedia: () => Promise<MediaStream>) {
  Object.defineProperty(navigator, 'mediaDevices', {
    configurable: true,
    value: { getUserMedia },
  })
  vi.stubGlobal('MediaRecorder', class {})
  vi.stubGlobal('AudioContext', class {})
  vi.stubGlobal('OfflineAudioContext', class {})
}

beforeEach(() => {
  delete nav.mediaDevices
})

afterEach(() => {
  vi.unstubAllGlobals()
  delete nav.mediaDevices
  delete nav.permissions
})

describe('micPermission', () => {
  it('沒有 MediaRecorder（如 Windows 版 WebKit）＝不支援', async () => {
    stubMedia(async () => ({}) as MediaStream)
    vi.stubGlobal('MediaRecorder', undefined)
    await expect(micPermission()).resolves.toBe('unsupported')
  })

  it('沒有 getUserMedia＝不支援', async () => {
    await expect(micPermission()).resolves.toBe('unsupported')
  })

  it.each(['granted', 'prompt', 'denied'] as const)('權限查詢回 %s', async (state) => {
    stubMedia(async () => ({}) as MediaStream)
    Object.defineProperty(navigator, 'permissions', {
      configurable: true,
      value: { query: async () => ({ state }) },
    })
    await expect(micPermission()).resolves.toBe(state)
  })

  it('不支援查詢 microphone 權限＝還沒問過', async () => {
    stubMedia(async () => ({}) as MediaStream)
    Object.defineProperty(navigator, 'permissions', {
      configurable: true,
      value: {
        query: async () => {
          throw new TypeError('microphone is not a valid permission name')
        },
      },
    })
    await expect(micPermission()).resolves.toBe('prompt')
  })
})

describe('startRecording', () => {
  it('使用者拒絕麥克風 → MicDeniedError', async () => {
    stubMedia(async () => {
      throw new DOMException('Permission denied', 'NotAllowedError')
    })
    await expect(startRecording()).rejects.toBeInstanceOf(MicDeniedError)
  })

  it('其他錯誤（例如沒有麥克風）原樣丟出', async () => {
    stubMedia(async () => {
      throw new DOMException('Requested device not found', 'NotFoundError')
    })
    await expect(startRecording()).rejects.toMatchObject({ name: 'NotFoundError' })
  })
})
