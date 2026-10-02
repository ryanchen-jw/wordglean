// 分級測驗計分（TASK-17，規格 §5；規則見 docs/verification/2026-10-02-task17-placement-evidence/proposal.md §2）
//
// 公式出處：Lemhöfer, K., & Broersma, M. (2012). Introducing LexTALE: A quick and valid Lexical Test for
// Advanced Learners of English. Behavior Research Methods, 44(2), 325–343. doi:10.3758/s13428-011-0146-0
// 原文以「真字正確率與假字正確率的平均」計分："a yes bias (creating high error rates in the nonwords) would be
// 'penalized' in the same way as a no bias would (causing high error rates for words)"。
// 原版是全卷一個總分；本 App 逐級套用：
//   每級分數 = (該級真字勾選率 × 100 + 假字沒勾的比率 × 100) ÷ 2
// ≥ 85 視為掌握——沒勾任何假字時等於該級認識 70%；每勾 1 個假字（共 10 個）各級降 5 分。
// 起點＝由 A1 往上第一個未掌握的級（全掌握＝C1）。假字勾超過一半時起點強制 A1 並提示重測。

import { LEVELS, type Level } from '../curriculum/curriculum'

export const MASTERY_SCORE = 85

/** 一題：level 為 null 表示假字 */
export interface PlacementItem {
  word: string
  level: Level | null
}

export interface PlacementResult {
  /** 各級真字勾選率 0–1（結果頁長條） */
  hitRate: Record<Level, number>
  /** 假字沒被勾的比率 0–1 */
  nonwordCorrect: number
  falseAlarms: number
  /** 各級 LexTALE 式分數 0–100 */
  levelScore: Record<Level, number>
  startLevel: Level
  retest: boolean
}

export function scorePlacement(
  form: readonly PlacementItem[],
  checked: ReadonlySet<string>,
): PlacementResult {
  const count = (items: readonly PlacementItem[]) => items.filter((i) => checked.has(i.word)).length
  const pseudo = form.filter((i) => i.level === null)
  const falseAlarms = count(pseudo)
  // 以「次數 × 100 ÷ 題數」算百分比，避免 0.8 + 0.9 這類浮點誤差落到門檻邊緣
  const nonwordPct = ((pseudo.length - falseAlarms) * 100) / pseudo.length

  const hitRate = {} as Record<Level, number>
  const levelScore = {} as Record<Level, number>
  for (const level of LEVELS) {
    const items = form.filter((i) => i.level === level)
    const hits = count(items)
    hitRate[level] = hits / items.length
    levelScore[level] = ((hits * 100) / items.length + nonwordPct) / 2
  }

  const retest = falseAlarms * 2 > pseudo.length
  const firstUnmastered = LEVELS.find((l) => levelScore[l] < MASTERY_SCORE)
  const startLevel = retest ? 'A1' : (firstUnmastered ?? 'C1')

  return {
    hitRate,
    nonwordCorrect: nonwordPct / 100,
    falseAlarms,
    levelScore,
    startLevel,
    retest,
  }
}
