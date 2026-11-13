// TASK-35：舊版高音質發音的快取與旗標只清一次；語音辨識（Moonshine）在 transformers-cache 的條目保留
import { beforeEach, describe, expect, it } from 'vitest'
import { cleanupLegacyHqVoice } from './legacyCleanup'

const KOKORO =
  'https://huggingface.co/onnx-community/Kokoro-82M-v1.0-ONNX/resolve/main/onnx/model.onnx'
const MOONSHINE =
  'https://huggingface.co/onnx-community/moonshine-tiny-ONNX/resolve/main/onnx/encoder_model.onnx'

/** 只實作用到的 CacheStorage／Cache 方法；條目以網址字串存 */
function fakeCaches(init: Record<string, string[]>) {
  const store = new Map(Object.entries(init).map(([k, v]) => [k, new Set(v)]))
  const cacheOf = (urls: Set<string>) => ({
    keys: async () => [...urls].map((url) => ({ url }) as Request),
    delete: async (req: Request) => urls.delete(req.url),
  })
  const caches = {
    has: async (name: string) => store.has(name),
    delete: async (name: string) => store.delete(name),
    open: async (name: string) => {
      if (!store.has(name)) store.set(name, new Set())
      return cacheOf(store.get(name)!)
    },
  } as unknown as CacheStorage
  const snapshot = () => Object.fromEntries([...store].map(([k, v]) => [k, [...v]]))
  return { caches, snapshot }
}

beforeEach(() => localStorage.clear())

describe('cleanupLegacyHqVoice', () => {
  it('刪高音質專用快取與 transformers-cache 的 Kokoro 條目；Moonshine 條目與其他快取保留', async () => {
    const { caches, snapshot } = fakeCaches({
      'lg-tts-hq-code': ['/assets/kokoro.worker-abc.js'],
      'kokoro-voices': ['https://huggingface.co/x/voices/af_heart.bin'],
      'lg-tts-audio': ['https://app/__tts-audio/Hi'],
      'transformers-cache': [KOKORO, MOONSHINE],
      'lg-audio': ['/assets/a1-u01-l01-x.lga'],
      'lg-stt-runtime': ['/ort-wasm-simd-threaded.jsep.wasm'],
    })
    await cleanupLegacyHqVoice(localStorage, caches)
    expect(snapshot()).toEqual({
      'transformers-cache': [MOONSHINE],
      'lg-audio': ['/assets/a1-u01-l01-x.lga'],
      'lg-stt-runtime': ['/ort-wasm-simd-threaded.jsep.wasm'],
    })
  })

  it('刪 lg.ttsHq.*、lg.ttsHqHintSeen、lg.ttsVoice；其他設定保留', async () => {
    for (const k of [
      'lg.ttsHq.downloaded',
      'lg.ttsHq.lastFailure',
      'lg.ttsHqHintSeen',
      'lg.ttsVoice',
      'lg.textSize',
      'lg.installDismissed',
    ])
      localStorage.setItem(k, '1')
    await cleanupLegacyHqVoice(localStorage, fakeCaches({}).caches)
    expect(Object.keys(localStorage).sort()).toEqual([
      'lg.installDismissed',
      'lg.legacyHqCleaned',
      'lg.textSize',
    ])
  })

  it('沒有 transformers-cache 時不會為了檢查而建立它', async () => {
    const { caches, snapshot } = fakeCaches({})
    await cleanupLegacyHqVoice(localStorage, caches)
    expect(snapshot()).toEqual({})
  })

  it('只跑一次：清過之後再出現的條目不再動', async () => {
    await cleanupLegacyHqVoice(localStorage, fakeCaches({}).caches)
    const { caches, snapshot } = fakeCaches({ 'kokoro-voices': ['v'] })
    localStorage.setItem('lg.ttsVoice', 'hq')
    await cleanupLegacyHqVoice(localStorage, caches)
    expect(snapshot()).toEqual({ 'kokoro-voices': ['v'] })
    expect(localStorage.getItem('lg.ttsVoice')).toBe('hq')
  })
})
