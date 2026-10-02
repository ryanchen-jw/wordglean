// 測試用：讀樣本課 fixture（來源見 fixtures/items/README.md）；vitest 的 cwd 為 app/
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import type { LessonItemsDoc } from './items'

export function loadFixture(lessonId: 'a1-u01-l01' | 'a1-u01-l02' | 'b1-u01-l01'): LessonItemsDoc {
  const file = resolve(process.cwd(), 'src/lesson/fixtures/items', `${lessonId}.json`)
  return JSON.parse(readFileSync(file, 'utf-8')) as LessonItemsDoc
}
