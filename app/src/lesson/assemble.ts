// 小課出題順序（TASK-18）：能力替代 → 題目轉步驟（queue.ts）→ 穿插
import { applyCapabilities, type Capabilities, type CapabilityChange } from './capabilities'
import type { ItemType, LessonItemsDoc } from './items'
import { buildQueue, type Registry, type Skipped, type Step } from './queue'

const SKILL_ORDER: readonly ItemType[][] = [
  ['listenType', 'listenChoice'],
  ['shadowing'],
  ['mcq', 'reading'],
  ['translate', 'makeSentence'],
]

/** 單字卡先出（先學字）；其餘依聽→說→讀→寫輪流各出一題，同一題的多個步驟（閱讀小題）相連 */
export function interleave(steps: readonly Step[]): Step[] {
  const cards = steps.filter((s) => s.type === 'wordCard')
  const groups = SKILL_ORDER.map((types) => {
    const byItem = new Map<string, Step[]>()
    for (const s of steps)
      if (types.includes(s.type)) byItem.set(s.itemId, [...(byItem.get(s.itemId) ?? []), s])
    return [...byItem.values()]
  })
  const out = [...cards]
  for (let round = 0; groups.some((g) => round < g.length); round++)
    for (const g of groups) if (round < g.length) out.push(...g[round])
  return out
}

export function buildLessonQueue(
  doc: LessonItemsDoc,
  registry: Registry,
  caps: Capabilities,
): { steps: Step[]; skipped: Skipped[]; changes: CapabilityChange[] } {
  const applied = applyCapabilities(doc, caps)
  const { steps, skipped } = buildQueue(applied.doc, registry)
  return { steps: interleave(steps), skipped, changes: applied.changes }
}
