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

describe('loadLevel：片語單元（TASK-24 W5）照課綱順序納入', () => {
  it('載入後單元與課綱檔完全相同（含片語單元、順序不變）', async () => {
    const file = raw('a2')
    const doc = await loadLevel('A2')
    expect(doc.units.map((u) => u.id)).toEqual(file.units.map((u) => u.id))
    expect(doc.units.find((u) => u.id === 'a2-p01')).toMatchObject({
      kind: 'phrase',
      titleZh: '常用片語（一）',
    })
    // 主題課 158＋片語課 15
    expect(doc.units.reduce((n, u) => n + u.lessons.length, 0)).toBe(173)
  })

  it('上完插入點前的主題單元，「下一課」接片語單元的第一課', async () => {
    const doc = await loadLevel('A2')
    const done = new Set(doc.units.slice(0, 6).flatMap((u) => u.lessons.map((l) => l.id)))
    expect(nextLesson(doc, done)?.lessonId).toBe('a2-p01-l01')
    expect(nextLesson(doc, done)?.words).toContain('clean up')
  })
})
