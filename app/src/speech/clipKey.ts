// 預先產生的發音（TASK-35）：哪些文字要產生音檔、文字怎麼對到音檔。content/audio-gen 產生時與 App 播放時共用本檔
// （content 端以 Node 型別剝除直接 import，所以本檔不可 import 其他模組、不可用 enum 等需轉譯的語法）

/** 正規化：NFC、彎引號換直引號、連續空白併成一個、去頭尾空白；大小寫與標點保留（句子的標點影響語調） */
export function clipKey(text: string): string {
  return text
    .normalize('NFC')
    .replace(/[‘’]/g, "'")
    .replace(/[“”]/g, '"')
    .replace(/\s+/g, ' ')
    .trim()
}

/** 單字與片語一律小寫（課綱已把 March／march 併為一字） */
export const wordClipKey = (text: string) => clipKey(text).toLowerCase()

/** 字典專用包（TASK-35）：字典詞條中含連字號的字（well-known、mother-in-law）不屬於任何課，依雜湊分進固定數目的包 */
export const DICT_PACKS = 512

export const isDictClipWord = (word: string) => word.includes('-')

/** 字（wordClipKey 之後）→ 字典包編號：FNV-1a 32 位元雜湊取餘數，不需對照表 */
export function dictPackOf(key: string): number {
  let h = 0x811c9dc5
  for (let i = 0; i < key.length; i++) {
    h ^= key.charCodeAt(i)
    h = Math.imul(h, 0x01000193) >>> 0
  }
  return h % DICT_PACKS
}

/** 字典包的檔名（不含副檔名），補零到三位 */
export const dictPackName = (n: number) => `d${String(n).padStart(3, '0')}`

/** 只列用到的欄位（結構同 src/lesson/items.ts 的題目） */
export interface ClipSourceItem {
  type: string
  word?: string
  sentenceEn?: string
  audioEn?: string
}

/**
 * 一課要產生音檔的文字（依題目順序、同課重複只留一份）：單字卡的字或片語（單字卡、配對、字典念它），
 * 聽音打字與跟讀的 sentenceEn、聽音選答的 audioEn。單字卡例句沒有發音鈕，不產生
 */
export function lessonClipTexts(items: readonly ClipSourceItem[]): string[] {
  const out: string[] = []
  for (const it of items) {
    let key: string | null = null
    if (it.type === 'wordCard' && it.word) key = wordClipKey(it.word)
    else if ((it.type === 'listenType' || it.type === 'shadowing') && it.sentenceEn)
      key = clipKey(it.sentenceEn)
    else if (it.type === 'listenChoice' && it.audioEn) key = clipKey(it.audioEn)
    if (key && !out.includes(key)) out.push(key)
  }
  return out
}
