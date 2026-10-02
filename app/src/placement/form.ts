// 分級測驗抽題：題本（content/placement/placement.json）各級抽 realPerForm 個真字、抽 pseudoPerForm 個假字，打散
import { LEVELS, type Level } from '../curriculum/curriculum'
import type { PlacementItem } from './score'

export interface PlacementBank {
  schemaVersion: number
  realPerForm: number
  pseudoPerForm: number
  levels: Record<Level, string[]>
  pseudowords: string[]
}

function shuffle<T>(items: T[], random: () => number): T[] {
  for (let i = items.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1))
    ;[items[i], items[j]] = [items[j], items[i]]
  }
  return items
}

/** 抽一份測驗；random 傳 Math.random（測試傳固定種子） */
export function drawForm(bank: PlacementBank, random: () => number): PlacementItem[] {
  const pick = (pool: string[], n: number) => shuffle([...pool], random).slice(0, n)
  const items: PlacementItem[] = [
    ...LEVELS.flatMap((level) =>
      pick(bank.levels[level], bank.realPerForm).map((word) => ({ word, level })),
    ),
    ...pick(bank.pseudowords, bank.pseudoPerForm).map((word) => ({ word, level: null })),
  ]
  return shuffle(items, random)
}
