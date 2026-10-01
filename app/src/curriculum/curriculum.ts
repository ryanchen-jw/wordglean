// 課綱（content/curriculum，TASK-7）的型別與查詢；資料由 load.ts 在執行期以獨立 json 資產取得
import type { CourseProgress } from '../data/db'

export const LEVELS = ['A1', 'A2', 'B1', 'B2', 'C1'] as const
export type Level = (typeof LEVELS)[number]

export interface LessonDoc {
  id: string
  words: string[]
}

export interface UnitDoc {
  id: string
  topic: string
  titleZh: string
  lessons: LessonDoc[]
}

export interface LevelDoc {
  schemaVersion: number
  level: Level
  units: UnitDoc[]
}

/** 小課在課綱中的位置；ordinal＝單元內第幾課（從 1 起） */
export interface LessonRef {
  level: Level
  unitId: string
  unitTitle: string
  lessonId: string
  ordinal: number
  words: string[]
}

// ETS 官方 CEFR 對照的聽力門檻（規格 §4）；畫面上的「約多益 xxx+」為佔位，待 G3 定稿
export const TOEIC_LISTENING: Record<Level, number> = {
  A1: 60,
  A2: 110,
  B1: 275,
  B2: 400,
  C1: 490,
}

/** 小課 ID 的級距前綴（a1-u01-l03 → A1） */
export function levelOfLessonId(lessonId: string): Level | null {
  const prefix = lessonId.slice(0, 2).toUpperCase()
  return (LEVELS as readonly string[]).includes(prefix) ? (prefix as Level) : null
}

/** 目前級距＝最後完成那一課的級距；沒有任何進度時為 null（正式欄位留給 TASK-17） */
export function currentLevel(progress: readonly CourseProgress[]): Level | null {
  let latest: CourseProgress | null = null
  for (const p of progress) if (!latest || p.completedAt > latest.completedAt) latest = p
  return latest ? levelOfLessonId(latest.lessonId) : null
}

/** 依課綱順序找第一個未完成的小課；整級都完成時為 null */
export function nextLesson(doc: LevelDoc, completed: ReadonlySet<string>): LessonRef | null {
  for (const unit of doc.units) {
    const idx = unit.lessons.findIndex((l) => !completed.has(l.id))
    if (idx >= 0) return lessonRef(doc.level, unit, idx)
  }
  return null
}

export function lessonRef(level: Level, unit: UnitDoc, idx: number): LessonRef {
  const lesson = unit.lessons[idx]
  return {
    level,
    unitId: unit.id,
    unitTitle: unit.titleZh,
    lessonId: lesson.id,
    ordinal: idx + 1,
    words: lesson.words,
  }
}
