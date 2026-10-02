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

/** 本卡尚未支援的題型（聽說寫，TASK-13～15）：引擎只看 id 與 type */
export interface OtherItem {
  id: string
  type: Exclude<ItemType, 'wordCard' | 'mcq' | 'reading'>
}

export type LessonItem = WordCardItem | McqItem | ReadingItem | OtherItem

export interface LessonItemsDoc {
  schemaVersion: 1
  lessonId: string
  level: string
  items: LessonItem[]
}
