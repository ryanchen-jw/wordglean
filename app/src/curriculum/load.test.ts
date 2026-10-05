import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { beforeEach, describe, expect, it } from 'vitest'
import { stubCurriculumFetch } from '../test/curriculumFetch'
import { nextLesson, type LevelDoc } from './curriculum'
import { loadLevel } from './load'

beforeEach(() => stubCurriculumFetch())

const raw = (level: string) =>
  JSON.parse(
    readFileSync(resolve(process.cwd(), '../content/curriculum', `${level}.json`), 'utf-8'),
  ) as LevelDoc

describe('loadLevel：片語單元（TASK-24）在 W5 前先略過', () => {
  it('課綱檔有片語單元，載入後只剩主題單元、順序與內容不變', async () => {
    const file = raw('a2')
    expect(file.units.some((u) => /-p\d{2}$/.test(u.id))).toBe(true)
    const doc = await loadLevel('A2')
    expect(doc.units.map((u) => u.id)).toEqual(
      file.units.filter((u) => /-u\d{2}$/.test(u.id)).map((u) => u.id),
    )
    expect(doc.units.reduce((n, u) => n + u.lessons.length, 0)).toBe(158)
  })

  it('上完插入點前的主題單元，「下一課」接下一個主題單元而不是片語課', async () => {
    const doc = await loadLevel('A2')
    const done = new Set(doc.units.slice(0, 6).flatMap((u) => u.lessons.map((l) => l.id)))
    expect(nextLesson(doc, done)?.lessonId).toBe('a2-u07-l01')
  })
})
