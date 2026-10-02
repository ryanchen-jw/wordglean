// 發音（App 唯一的發音入口：字典彈層、單字卡、聽題共用）：speak(text) 介面沿用 TASK-16，另可帶語速
// 設計規定發音鈕永遠可用（components.md §7），不支援的瀏覽器靜默略過
import { createHqVoice } from './hqVoice'
import { createTts, type Rate } from './tts'
import { systemVoice } from './systemVoice'

// 合成過的句子存這裡（同一句不重算）；只當快取鍵用的網址，不會真的被請求
const AUDIO_CACHE = 'lg-tts-audio'
const audioUrl = (key: string) => `${location.origin}/__tts-audio/${encodeURIComponent(key)}`

function playWav(wav: ArrayBuffer) {
  const url = URL.createObjectURL(new Blob([wav], { type: 'audio/wav' }))
  const audio = new Audio(url)
  let finish = () => {}
  const done = new Promise<void>((resolve, reject) => {
    finish = resolve
    audio.onended = () => resolve()
    audio.onerror = () => reject(new Error('高音質音檔無法播放'))
    audio.play().catch(reject)
  }).finally(() => URL.revokeObjectURL(url))
  return {
    done,
    stop: () => {
      audio.pause()
      finish()
    },
  }
}

export const hqVoice = createHqVoice({
  createWorker: () =>
    new Worker(new URL('./kokoro.worker.ts', import.meta.url), { type: 'module' }),
  hasWebGpu: async () => {
    const gpu = (navigator as Navigator & { gpu?: { requestAdapter(): Promise<unknown> } }).gpu
    return !!(await gpu?.requestAdapter())
  },
  modelCached: async () => {
    const keys = await (await caches.open('transformers-cache')).keys()
    return keys.some((r) => /Kokoro-82M-v1\.0-ONNX\/resolve\/main\/onnx\/model\.onnx$/.test(r.url))
  },
  storage: localStorage,
  session: sessionStorage,
  play: playWav,
  audioCache: {
    async get(key) {
      try {
        const hit = await (await caches.open(AUDIO_CACHE)).match(audioUrl(key))
        return hit ? await hit.arrayBuffer() : undefined
      } catch {
        return undefined
      }
    },
    async set(key, wav) {
      try {
        const body = wav.slice(0)
        const res = new Response(body, { headers: { 'content-type': 'audio/wav' } })
        await (await caches.open(AUDIO_CACHE)).put(audioUrl(key), res)
      } catch {
        // 快取寫不進去（空間不足等）：下次重算即可
      }
    },
  },
})

void hqVoice.init()

export const tts = createTts({
  system: systemVoice(),
  loadHq: () => hqVoice.load(),
  wantHq: () => hqVoice.wantHq(),
})

/** 念一句；回傳念完（或失敗退回後念完）的 promise，不需要等的呼叫端可忽略 */
export function speak(text: string, opts?: { rate?: Rate }): Promise<unknown> {
  return tts.speak(text, opts)
}

/** 能不能播音（TASK-18 能力偵測的 TTS）：有手機內建聲音，或選用了已下載的高音質發音 */
export function ttsAvailable(): boolean {
  return systemVoice() !== null || hqVoice.wantHq()
}
