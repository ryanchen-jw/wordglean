// 題型登記表與題目佇列：題目檔 → 作答步驟；未登記的題型（說寫，TASK-14～15）或欄位不全的題目略過並回報
import type {
  ItemType,
  LessonItem,
  LessonItemsDoc,
  ListenChoiceItem,
  ListenTypeItem,
  MakeSentenceItem,
  McqItem,
  ReadingItem,
  ShadowingItem,
  TranslateItem,
  WordCardItem,
  WritingItem,
} from './items'

export interface Choice {
  options: string[]
  answer: number
}

/** 一個作答步驟；進度條與完成頁的題數都以步驟計（閱讀每小題一步） */
export interface Step {
  key: string
  itemId: string
  type: ItemType
  /** 作答後寫入 FSRS 的字（新字同時入池）；null＝只計分（D2：只有單字卡寫入） */
  srsWord: string | null
  choice?: Choice
  /** 閱讀小題索引 */
  questionIndex?: number
}

export interface ItemTypeDef<I extends LessonItem = LessonItem> {
  type: I['type']
  isValid(item: I): boolean
  toSteps(item: I): Step[]
}

export interface Skipped {
  itemId: string
  type: string
  reason: 'unsupported' | 'invalid'
}

export type Registry = ReadonlyMap<string, ItemTypeDef>

export function defineItemType<I extends LessonItem>(def: ItemTypeDef<I>): ItemTypeDef {
  return def as unknown as ItemTypeDef
}

export function createRegistry(defs: readonly ItemTypeDef[]): Registry {
  return new Map(defs.map((d) => [d.type, d]))
}

// FNV-1a 32 位元；只用來讓同一題的選項順序固定（續作時不變），不求亂度品質
function hash(s: string): number {
  let h = 0x811c9dc5
  for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 0x01000193)
  return h >>> 0
}

const nonEmpty = (s: unknown) => typeof s === 'string' && s.trim() !== ''
const distinct = (xs: string[]) => new Set(xs).size === xs.length
const validAnswer = (options: string[], answer: number) =>
  Number.isInteger(answer) && answer >= 0 && answer < options.length

/** 單字卡選項：正確釋義插在干擾項之間，位置由題號決定 */
export function wordCardChoice(
  item: WordCardItem,
  sense: (gloss: string) => string = (g) => g,
): Choice {
  const answer = hash(item.id) % (item.distractorsZh.length + 1)
  const options = item.distractorsZh.map(sense)
  options.splice(answer, 0, sense(item.glossZh))
  return { options, answer }
}

/**
 * 釋義的第一個意思：全形分號「；」前一段，再去掉全形括號註記「（…）」；去完是空的就保留原段。
 * 正解兩義並列或帶括號而干擾項沒有，都會因格式洩題（TASK-9）
 */
export function firstSense(gloss: string): string {
  const first = gloss.split('；')[0].trim()
  return first.replace(/（[^）]*）/g, '').trim() || first
}

export const wordCardType = defineItemType<WordCardItem>({
  type: 'wordCard',
  isValid: (it) =>
    nonEmpty(it.word) &&
    nonEmpty(it.glossZh) &&
    Array.isArray(it.distractorsZh) &&
    it.distractorsZh.length === 3 &&
    it.distractorsZh.every(nonEmpty) &&
    distinct([it.glossZh, ...it.distractorsZh]),
  toSteps: (it) => [
    {
      key: it.id,
      itemId: it.id,
      type: 'wordCard',
      srsWord: it.word.trim().toLowerCase(),
      choice: wordCardChoice(it),
    },
  ],
})

/** 小課與複習的單字卡：作答選項只顯示第一義（回饋仍顯示完整 glossZh） */
export const lessonWordCardType = defineItemType<WordCardItem>({
  type: 'wordCard',
  isValid: (it) =>
    wordCardType.isValid(it) && distinct([it.glossZh, ...it.distractorsZh].map(firstSense)),
  toSteps: (it) => [{ ...wordCardType.toSteps(it)[0], choice: wordCardChoice(it, firstSense) }],
})

export const mcqType = defineItemType<McqItem>({
  type: 'mcq',
  isValid: (it) =>
    Array.isArray(it.options) &&
    it.options.length >= 2 &&
    validAnswer(it.options, it.answer) &&
    (it.optionGlossZh === undefined || it.optionGlossZh.length === it.options.length),
  toSteps: (it) => [
    {
      key: it.id,
      itemId: it.id,
      type: 'mcq',
      srsWord: null,
      choice: { options: it.options, answer: it.answer },
    },
  ],
})

export const readingType = defineItemType<ReadingItem>({
  type: 'reading',
  isValid: (it) =>
    nonEmpty(it.passageEn) &&
    Array.isArray(it.questions) &&
    it.questions.length > 0 &&
    it.questions.every((q) => Array.isArray(q.options) && validAnswer(q.options, q.answer)),
  toSteps: (it) =>
    it.questions.map((q, i) => ({
      key: `${it.id}#${i}`,
      itemId: it.id,
      type: 'reading' as const,
      srsWord: null,
      choice: { options: q.options, answer: q.answer },
      questionIndex: i,
    })),
})

/** 讀類三題型（TASK-12）；聽說寫由 TASK-13～15 登記 */
export const READ_TYPES: readonly ItemTypeDef[] = [lessonWordCardType, mcqType, readingType]

export const listenTypeType = defineItemType<ListenTypeItem>({
  type: 'listenType',
  isValid: (it) => nonEmpty(it.sentenceEn),
  toSteps: (it) => [{ key: it.id, itemId: it.id, type: 'listenType', srsWord: null }],
})

export const listenChoiceType = defineItemType<ListenChoiceItem>({
  type: 'listenChoice',
  isValid: (it) =>
    nonEmpty(it.audioEn) &&
    Array.isArray(it.options) &&
    it.options.length >= 2 &&
    validAnswer(it.options, it.answer),
  toSteps: (it) => [
    {
      key: it.id,
      itemId: it.id,
      type: 'listenChoice',
      srsWord: null,
      choice: { options: it.options, answer: it.answer },
    },
  ],
})

/** 聽類兩題型（TASK-13）；只計分、不寫 FSRS（TASK-12 D2） */
export const LISTEN_TYPES: readonly ItemTypeDef[] = [listenTypeType, listenChoiceType]

/** 跟讀（TASK-14）：只計分、不寫 FSRS */
export const shadowingType = defineItemType<ShadowingItem>({
  type: 'shadowing',
  isValid: (it) => nonEmpty(it.sentenceEn) && /[a-z0-9]/i.test(it.sentenceEn),
  toSteps: (it) => [{ key: it.id, itemId: it.id, type: 'shadowing', srsWord: null }],
})

/** 說類題型（TASK-14） */
export const SPEAK_TYPES: readonly ItemTypeDef[] = [shadowingType]

const nonEmptyList = (xs: unknown) => Array.isArray(xs) && xs.length > 0 && xs.every(nonEmpty)
const writingValid = (it: WritingItem) => nonEmptyList(it.referenceEn) && nonEmptyList(it.rubricZh)
// 寫作不寫 FSRS（TASK-15 派工）：只計分
const writingStep = (it: WritingItem): Step[] => [
  { key: it.id, itemId: it.id, type: it.type, srsWord: null },
]

export const translateType = defineItemType<TranslateItem>({
  type: 'translate',
  isValid: (it) =>
    nonEmpty(it.promptZh) &&
    Array.isArray(it.hintWords) &&
    it.hintWords.every(nonEmpty) &&
    writingValid(it),
  toSteps: writingStep,
})

export const makeSentenceType = defineItemType<MakeSentenceItem>({
  type: 'makeSentence',
  isValid: (it) => nonEmpty(it.targetWord) && nonEmpty(it.instructionZh) && writingValid(it),
  toSteps: writingStep,
})

/** 寫類兩題型（TASK-15）：中翻英、造句 */
export const WRITE_TYPES: readonly ItemTypeDef[] = [translateType, makeSentenceType]

/** 依題目檔順序產生作答步驟；穿插排序屬 TASK-18 */
export function buildQueue(
  doc: LessonItemsDoc,
  registry: Registry,
): { steps: Step[]; skipped: Skipped[] } {
  const steps: Step[] = []
  const skipped: Skipped[] = []
  for (const item of doc.items) {
    const def = registry.get(item.type)
    if (!def) skipped.push({ itemId: item.id, type: item.type, reason: 'unsupported' })
    else if (!def.isValid(item))
      skipped.push({ itemId: item.id, type: item.type, reason: 'invalid' })
    else steps.push(...def.toSteps(item))
  }
  return { steps, skipped }
}
