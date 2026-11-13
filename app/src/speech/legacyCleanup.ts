// 清掉舊版高音質發音（Kokoro，TASK-13～34，TASK-35 已移除）留在手機上的模型與快取（約 310MB）與設定旗標。
// 只跑一次（成功後記旗標）。transformers-cache 是語音辨識（Moonshine）也在用的快取：只刪 Kokoro 的條目，不刪整個
const DONE_KEY = 'lg.legacyHqCleaned'
/** 只屬於高音質發音的快取（kokoro-voices＝kokoro-js 的音色檔；lg-tts-*＝App 自己的 Worker 與合成結果） */
const HQ_CACHES = ['lg-tts-hq-code', 'kokoro-voices', 'lg-tts-audio']
const SHARED_CACHE = 'transformers-cache'
const KOKORO_URL = /Kokoro-82M/i
/** localStorage：lg.ttsHq.*（下載狀態、失敗紀錄）、lg.ttsHqHintSeen、lg.ttsVoice（發音選擇） */
const isHqKey = (k: string) => k.startsWith('lg.ttsHq') || k === 'lg.ttsVoice'

export async function cleanupLegacyHqVoice(
  storage: Storage = localStorage,
  cacheStorage: CacheStorage | undefined = globalThis.caches,
): Promise<void> {
  if (storage.getItem(DONE_KEY)) return
  if (cacheStorage) {
    for (const name of HQ_CACHES) await cacheStorage.delete(name)
    if (await cacheStorage.has(SHARED_CACHE)) {
      const cache = await cacheStorage.open(SHARED_CACHE)
      for (const req of await cache.keys()) if (KOKORO_URL.test(req.url)) await cache.delete(req)
    }
  }
  const keys = Array.from({ length: storage.length }, (_, i) => storage.key(i))
  for (const k of keys) if (k && isHqKey(k)) storage.removeItem(k)
  storage.setItem(DONE_KEY, '1')
}
