// 小課題目檔（content/items/<level>/<lessonId>.json）的型別；格式權威＝content/schema/lesson-items.schema.json（TASK-8）
// 讀類題型含 TASK-12 Round 1 D1 擴充欄位：wordCard.glossZh／distractorsZh、mcq.optionGlossZh（選填）

export type ItemType =
  | 'wordCard'
  | 'listenType'
  | 'listenChoice'
  | 'shadowing'
  | 'mcq'
  | 'reading'
  | 'translate'
  | 'makeSentence'

/** 單字卡：四選一中文釋義（設計 s07） */
export interface WordCardItem {
  id: string
  type: 'wordCard'
  word: string
  exampleEn: string
  exampleZh: string
  glossZh: string
  distractorsZh: string[]
}

/** 選擇題：題幹含一個 ____，選出最適合的字 */
export interface McqItem {
  id: string
  type: 'mcq'
  stemEn: string
  stemZh: string
  options: string[]
  answer: number
  optionGlossZh?: string[]
}

export interface ReadingQuestion {
  questionZh: string
  options: string[]
  answer: number
}

/** 閱讀理解：英文短文、繁中提問與選項 */
export interface ReadingItem {
  id: string
  type: 'reading'
  passageEn: string
  passageZh: string
  questions: ReadingQuestion[]
}

/** 聽音打字：播放 sentenceEn，使用者打出來（設計 s03） */
export interface ListenTypeItem {
  id: string
  type: 'listenType'
  sentenceEn: string
  sentenceZh: string
}

/** 跟讀（設計 s04、TASK-14）：唸出英文句，轉文字後與目標句逐字比對 */
export interface ShadowingItem {
  id: string
  type: 'shadowing'
  sentenceEn: string
  sentenceZh: string
}

/** 聽音選答：播放 audioEn，繁中提問、英文選項（設計 s03） */
export interface ListenChoiceItem {
  id: string
  type: 'listenChoice'
  audioEn: string
  audioZh: string
  questionZh: string
  options: string[]
  answer: number
}

/** 寫作題共同欄位（TASK-15）：referenceEn＝參考答案（無金鑰時自評用）、rubricZh＝批改要點 */
interface WritingFields {
  id: string
  referenceEn: string[]
  rubricZh: string[]
  /** 能力替代規則（TASK-18 applyCapabilities）標記：改用參考答案自評 */
  selfCheck?: true
}

/** 中翻英（設計 s06） */
export interface TranslateItem extends WritingFields {
  type: 'translate'
  promptZh: string
  hintWords: string[]
}

/** 造句：用 targetWord 造句 */
export interface MakeSentenceItem extends WritingFields {
  type: 'makeSentence'
  targetWord: string
  instructionZh: string
}

export type WritingItem = TranslateItem | MakeSentenceItem

export type LessonItem =
  | WordCardItem
  | McqItem
  | ReadingItem
  | ListenTypeItem
  | ListenChoiceItem
  | ShadowingItem
  | WritingItem

export interface LessonItemsDoc {
  schemaVersion: 1
  lessonId: string
  level: string
  items: LessonItem[]
}
