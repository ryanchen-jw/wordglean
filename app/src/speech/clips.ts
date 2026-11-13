// 預先產生的發音（TASK-35）：一課一包（content/audio）＋字典專用包（含連字號的字，content/audio/dict），
// 用到才抓（不在 service worker 預快取清單；抓過的由 runtimeCaching 存 lg-audio，離線可播）。
// 文字 → 包：已載入的包先查；字或片語依課綱（字→課）找課的包；含連字號的字依 dictPackOf 找字典包；
// 句子只在小課中播，進課時已 prefetch。最多等 waitMs，等不到就回 null（這一句用內建聲音），包照樣在背景抓完
import { clipKey, dictPackName, dictPackOf, isDictClipWord } from './clipKey'
import { decodePack } from './clipPack'
import type { ClipSource, Rate } from './tts'

export interface Clip {
  key: string
  bytes: Uint8Array
}

export interface ClipEngine extends ClipSource<Clip> {
  /** 先抓這些課的包（進入小課、開始複習時） */
  prefetch(lessonIds: readonly string[]): void
}

export interface ClipDeps {
  /** 課號或字典包名（dNNN）→ 包的網址；沒有這個包＝null */
  packUrl(id: string): Promise<string | null>
  fetchPack(url: string): Promise<ArrayBuffer>
  /** 小寫的字或片語 → 引入它的課號（課綱）；不在課綱＝null */
  lessonOfWord(word: string): Promise<string | null>
  createAudio(): HTMLAudioElement
  waitMs?: number
  /** 記憶體內最多留幾包（約 0.1MB／包） */
  maxPacks?: number
}

export function createClips({
  packUrl,
  fetchPack,
  lessonOfWord,
  createAudio,
  waitMs = 1500,
  maxPacks = 40,
}: ClipDeps): ClipEngine {
  const ready = new Map<string, Map<string, Uint8Array>>()
  const loading = new Map<string, Promise<void>>()

  function load(id: string): Promise<void> {
    if (ready.has(id)) return Promise.resolve()
    let p = loading.get(id)
    if (!p) {
      p = packUrl(id)
        .then(async (url) => {
          if (!url) return
          ready.set(id, decodePack(await fetchPack(url)).clips)
          while (ready.size > maxPacks) ready.delete(ready.keys().next().value!)
        })
        .catch(() => {}) // 抓不到（離線、沒有這包）：這次用內建聲音，下次再試
        .finally(() => loading.delete(id))
      loading.set(id, p)
    }
    return p
  }

  function lookup(keys: readonly string[]): Clip | null {
    for (const clips of ready.values())
      for (const key of keys) {
        const bytes = clips.get(key)
        if (bytes) return { key, bytes }
      }
    return null
  }

  let audio: HTMLAudioElement | null = null
  let objectUrl: string | null = null
  let finish = () => {}

  return {
    async find(text) {
      const key = clipKey(text)
      const word = key.toLowerCase()
      const keys = key === word ? [key] : [key, word]
      const hit = lookup(keys)
      if (hit) return hit
      const ids = [...loading.keys()]
      const lesson = await lessonOfWord(word).catch(() => null)
      if (lesson) ids.push(lesson)
      if (isDictClipWord(word) && !word.includes(' ')) ids.push(dictPackName(dictPackOf(word)))
      if (ids.length === 0) return null
      let timer: ReturnType<typeof setTimeout> | undefined
      await Promise.race([
        Promise.all(ids.map(load)),
        new Promise<void>((r) => (timer = setTimeout(r, waitMs))),
      ])
      clearTimeout(timer)
      return lookup(keys)
    },
    play(clip, rate: Rate) {
      // 重用同一個 audio 元素：iOS 的自動播放限制以元素為單位，使用者點過一次後同一元素才能由程式播放
      audio ??= createAudio()
      const el = audio
      finish()
      el.pause()
      if (objectUrl) URL.revokeObjectURL(objectUrl)
      objectUrl = URL.createObjectURL(new Blob([clip.bytes.slice()], { type: 'audio/mpeg' }))
      el.src = objectUrl
      el.dataset.clip = clip.key
      // 換 src 會把 playbackRate 重設為 defaultPlaybackRate，兩個都設；慢速以播放速率調整（音高不變）
      el.defaultPlaybackRate = rate
      el.playbackRate = rate
      return new Promise<void>((resolve, reject) => {
        finish = resolve
        el.onended = () => resolve()
        el.onerror = () => reject(new Error('音檔無法播放'))
        el.play().catch(reject)
      })
    },
    stop() {
      audio?.pause()
      finish()
    },
    prefetch(lessonIds) {
      for (const id of lessonIds) void load(id)
    },
  }
}
