// 示範課（創辦人 2026-10-05 裁示二）：/lesson/demo 一課走過所有題型，供測試；題目取自現有一課、不新寫內容
// 練習模式（不寫 FSRS、作答紀錄、完成課、同步）由小課畫面負責，本檔只組題
import { applyCapabilities, type Capabilities, type CapabilityChange } from './capabilities'
import type { ItemType, LessonItem, LessonItemsDoc } from './items'
import { MATCH_SIZE, withMatching } from './matching'
import { buildQueue, type Registry, type Skipped, type Step, type StepType } from './queue'

/** 題目來源課：所有題型都有、翻譯兩題 */
export const DEMO_SOURCE = 'a1-u01-l03'

/** 出題順序與各題型取幾題（依題目檔順序取前幾題）；配對由前面的單字卡組成 */
const PICK: readonly [ItemType, number][] = [
  ['wordCard', MATCH_SIZE],
  ['mcq', 1],
  ['reading', 1],
  ['listenType', 1],
  ['listenChoice', 1],
  ['shadowing', 1],
  ['translate', 2],
]

/** 示範課步驟；startType＝?type=：從該題型的第一題開始（不認得或沒有就從頭） */
export function buildDemoQueue(
  source: LessonItemsDoc,
  registry: Registry,
  caps: Capabilities,
  startType: string | null,
): { steps: Step[]; skipped: Skipped[]; changes: CapabilityChange[]; doc: LessonItemsDoc } {
  const items: LessonItem[] = PICK.flatMap(([type, n]) =>
    source.items.filter((i) => i.type === type).slice(0, n),
  )
  const { doc: applied, changes } = applyCapabilities({ ...source, items }, caps)
  const built = buildQueue(applied, registry)
  const steps = withMatching(built.steps, applied)
  const from = steps.findIndex((s) => s.type === (startType as StepType))
  return {
    steps: from > 0 ? steps.slice(from) : steps,
    skipped: built.skipped,
    changes,
    doc: applied,
  }
}
