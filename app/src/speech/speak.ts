// 發音（App 唯一的發音入口：字典彈層、單字卡、聽題共用）：speak(text) 介面沿用 TASK-16，另可帶語速
// 設計規定發音鈕永遠可用（components.md §7），不支援的瀏覽器靜默略過
// TASK-35：優先播預先產生的音檔（clips.ts），沒有就用手機內建聲音
import { LEVELS } from '../curriculum/curriculum'
import { loadLevel } from '../curriculum/load'
import { createClips } from './clips'
import { systemVoice } from './systemVoice'
import { createTts, type Rate } from './tts'

let urlIndex: Promise<Map<string, string>> | null = null

/** 包名（課號或 dNNN）→ 網址；對照表第一次用到才 import() */
function packUrls() {
  urlIndex ??= import('./audioUrls').then(({ lessonAudioUrls, dictAudioUrls }) => {
    const map = new Map<string, string>()
    for (const [path, url] of Object.entries({ ...lessonAudioUrls, ...dictAudioUrls }))
      map.set(path.slice(path.lastIndexOf('/') + 1, -'.lga'.length), url)
    return map
  })
  return urlIndex
}

let wordIndex: Promise<Map<string, string>> | null = null

/** 課綱的字與片語（小寫）→ 引入它的課號；課綱檔已預快取，第一次查字時建表 */
function lessonOfWord(word: string) {
  wordIndex ??= Promise.all(LEVELS.map(loadLevel)).then((docs) => {
    const map = new Map<string, string>()
    for (const doc of docs)
      for (const unit of doc.units)
        for (const lesson of unit.lessons)
          for (const w of lesson.words) map.set(w.toLowerCase(), lesson.id)
    return map
  })
  wordIndex.catch(() => (wordIndex = null))
  return wordIndex.then((m) => m.get(word) ?? null)
}

const canPlayMp3 = (() => {
  try {
    return typeof Audio !== 'undefined' && new Audio().canPlayType('audio/mpeg') !== ''
  } catch {
    return false
  }
})()

export const clips = createClips({
  packUrl: async (id) => (await packUrls()).get(id) ?? null,
  fetchPack: async (url) => {
    const res = await fetch(url)
    if (!res.ok) throw new Error(`音檔載入失敗：${res.status}`)
    return res.arrayBuffer()
  },
  lessonOfWord,
  createAudio: () => new Audio(),
})

export const tts = createTts({ system: systemVoice(), clips: canPlayMp3 ? clips : null })

/** 念一句；回傳念完（或退回內建聲音後念完）的 promise，不需要等的呼叫端可忽略 */
export function speak(text: string, opts?: { rate?: Rate }): Promise<unknown> {
  return tts.speak(text, opts)
}

/** 先抓這些課的音檔（進入小課、開始複習時） */
export function prefetchAudio(lessonIds: readonly string[]) {
  if (canPlayMp3) clips.prefetch(lessonIds)
}

/** 能不能播音（TASK-18 能力偵測的 TTS）：能播預產音檔，或有手機內建聲音 */
export function ttsAvailable(): boolean {
  return canPlayMp3 || systemVoice() !== null
}
