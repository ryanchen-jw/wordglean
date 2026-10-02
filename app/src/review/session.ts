// 單字複習（設計 s07）：卡片取自字的來源課題目檔（沿用小課單字卡）；作答直接寫 FSRS，不存小課進度
import type { LinguaDb } from '../data/db'
import type { LexIndex } from '../dict/lexicon'
import { recordReview } from '../data/repo'
import { gradeFor, type AnswerInput } from '../lesson/grade'
import type { LessonItemsDoc, WordCardItem } from '../lesson/items'
import { lessonWordCardType, type Step } from '../lesson/queue'
import type { Grade } from '../srs/scheduler'
import { favoriteCard } from './favoriteCard'

export interface ReviewCard {
  wordId: string
  item: WordCardItem
  step: Step
}

const toCard = (item: WordCardItem): ReviewCard => {
  const step = lessonWordCardType.toSteps(item)[0]
  return { wordId: step.srsWord!, item, step }
}

const wordCardsOf = (doc: LessonItemsDoc) =>
  doc.items.filter((i): i is WordCardItem => i.type === 'wordCard' && lessonWordCardType.isValid(i))

/**
 * 依字的課程來源（依序）找原課單字卡；找不到時（收藏字）以單字總表出卡（loadLex 只在需要時載入）；
 * 都出不了卡的字列入 missing、不出題
 */
export async function loadReviewCards(
  db: LinguaDb,
  wordIds: readonly string[],
  loadItems: (lessonId: string) => Promise<LessonItemsDoc | null>,
  loadLex?: () => Promise<LexIndex>,
): Promise<{ cards: ReviewCard[]; missing: string[] }> {
  let lex: Promise<LexIndex> | undefined
  const docs = new Map<string, Promise<LessonItemsDoc | null>>()
  const load = (lessonId: string) => {
    if (!docs.has(lessonId)) docs.set(lessonId, loadItems(lessonId))
    return docs.get(lessonId)!
  }
  const rows = await db.wordPool.bulkGet([...wordIds])
  const cards: ReviewCard[] = []
  const missing: string[] = []
  for (const [i, wordId] of wordIds.entries()) {
    let found: WordCardItem | undefined
    for (const lessonId of rows[i]?.courseRefs ?? []) {
      const doc = await load(lessonId)
      found = doc
        ? wordCardsOf(doc).find((it) => it.word.trim().toLowerCase() === wordId)
        : undefined
      if (found) break
    }
    if (!found && loadLex && rows[i])
      found = favoriteCard(wordId, await (lex ??= loadLex())) ?? undefined
    if (found) cards.push(toCard(found))
    else missing.push(wordId)
  }
  return { cards, missing }
}

/** 本課的單字卡（完成頁「再複習一次剛學的字」） */
export function lessonWordCards(doc: LessonItemsDoc): ReviewCard[] {
  return wordCardsOf(doc).map(toCard)
}

/** 記錄一題複習；練習（D5）只回傳評分、不寫任何資料 */
export async function answerReview(
  db: LinguaDb,
  card: ReviewCard,
  input: AnswerInput,
  nowMs: number,
  { practice }: { practice: boolean },
): Promise<Grade> {
  const grade = gradeFor(input)
  if (!practice) await recordReview(db, card.wordId, grade, nowMs)
  return grade
}
