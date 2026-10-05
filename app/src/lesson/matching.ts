// 配對題（創辦人 2026-10-05 裁示一）：App 端以剛學的 4 個字組題（不改題庫）；英文配中文第一義，不寫 FSRS
// 小課：每 4 張單字卡後插一題，最後不足 4 個字用本課前面的字補滿；複習：每 4 張到期卡後插一題，不足 4 個字不出
import type { LessonItem, LessonItemsDoc, WordCardItem } from './items'
import { firstSense, hash, type Step } from './queue'

export const MATCH_SIZE = 4

/** 第 n 個字（從 0 起）之後插一題配對，members＝用到的字；fill＝最後不足一組時用前面的字補滿 */
export function matchingGroups(
  count: number,
  { fill }: { fill: boolean },
): { after: number; members: number[] }[] {
  const range = (from: number) => Array.from({ length: MATCH_SIZE }, (_, i) => from + i)
  const groups = []
  for (let from = 0; from + MATCH_SIZE <= count; from += MATCH_SIZE)
    groups.push({ after: from + MATCH_SIZE - 1, members: range(from) })
  if (fill && count > MATCH_SIZE && count % MATCH_SIZE)
    groups.push({ after: count - 1, members: range(count - MATCH_SIZE) })
  return groups
}

export function matchingStep(key: string, cards: readonly WordCardItem[]): Step {
  return {
    key,
    itemId: cards[0].id,
    type: 'matching',
    srsWord: null,
    pairs: cards.map((c) => ({ word: c.word, gloss: firstSense(c.glossZh) })),
  }
}

/** 中文欄的排列（pairs 的索引）：依題號與字固定，續作時不變 */
export function matchingOrder(step: Step): number[] {
  const pairs = step.pairs ?? []
  const rank = pairs.map((p, i) => hash(`${step.key}|${p.word}|${p.gloss}`) * 8 + i)
  return pairs.map((_, i) => i).sort((a, b) => rank[a] - rank[b])
}

/** 小課：在單字卡步驟之間插入配對（doc＝套用替代規則後的題目，用來取單字卡內容） */
export function withMatching(steps: readonly Step[], doc: LessonItemsDoc): Step[] {
  const items = new Map<string, LessonItem>(doc.items.map((i) => [i.id, i]))
  const cardSteps = steps.filter((s) => s.type === 'wordCard')
  const cards = cardSteps.map((s) => items.get(s.itemId) as WordCardItem)
  const inserts = new Map<string, Step>()
  matchingGroups(cards.length, { fill: true }).forEach((g, k) =>
    inserts.set(
      cardSteps[g.after].key,
      matchingStep(
        `matching#${k + 1}`,
        g.members.map((m) => cards[m]),
      ),
    ),
  )
  return steps.flatMap((s) => (inserts.has(s.key) ? [s, inserts.get(s.key)!] : [s]))
}
