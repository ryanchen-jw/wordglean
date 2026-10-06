// 成長卡的資料來源：作答紀錄、單字池記憶狀態、設定級距、成長紀錄（本機 Dexie）；各級字取課綱主題單元
import { LEVELS, type Level } from '../curriculum/curriculum'
import { loadLevel } from '../curriculum/load'
import type { LinguaDb } from '../data/db'
import { getSettings } from '../data/repo'
import type { GrowthInput } from './growth'

export type GrowthDbInput = Pick<GrowthInput, 'logs' | 'pool' | 'placed' | 'record'>

export async function loadGrowthDbInput(db: LinguaDb): Promise<GrowthDbInput> {
  const [logs, pool, settings, record] = await Promise.all([
    db.reviewLogs.toArray(),
    db.wordPool.toArray(),
    getSettings(db),
    db.growth.get('local'),
  ])
  return {
    logs: logs.map((l) => ({ wordId: l.wordId, review: l.review })),
    pool: pool.map((w) => ({ wordId: w.wordId, stability: w.stability, lastReview: w.lastReview })),
    placed: settings.cefrLevel,
    record,
  }
}

/** 各級總字數＝課綱該級主題單元的不重複字；片語單元（kind: 'phrase'）不計入級距門檻 */
export async function loadLevelWords(): Promise<Record<Level, Set<string>>> {
  const docs = await Promise.all(LEVELS.map(loadLevel))
  return Object.fromEntries(
    docs.map((d) => [
      d.level,
      new Set(
        d.units
          .filter((u) => u.kind !== 'phrase')
          .flatMap((u) => u.lessons.flatMap((l) => l.words.map((w) => w.toLowerCase()))),
      ),
    ]),
  ) as Record<Level, Set<string>>
}
