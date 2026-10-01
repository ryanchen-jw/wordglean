import { describe, expect, it } from 'vitest'
import b1 from '../../../content/curriculum/b1.json'
import { currentLevel, levelOfLessonId, nextLesson, type LevelDoc } from './curriculum'

const B1 = b1 as LevelDoc

describe('levelOfLessonId', () => {
  it('取小課 ID 前綴為級距', () => {
    expect(levelOfLessonId('a1-u01-l03')).toBe('A1')
    expect(levelOfLessonId('c1-u39-l02')).toBe('C1')
    expect(levelOfLessonId('x9-u01-l01')).toBeNull()
  })
})

describe('currentLevel', () => {
  it('沒有進度時為 null', () => {
    expect(currentLevel([])).toBeNull()
  })

  it('取 completedAt 最晚的那一課的級距', () => {
    expect(
      currentLevel([
        { lessonId: 'b1-u01-l01', completedAt: 200, updatedAt: 200 },
        { lessonId: 'a2-u03-l02', completedAt: 300, updatedAt: 300 },
        { lessonId: 'b2-u01-l01', completedAt: 100, updatedAt: 100 },
      ]),
    ).toBe('A2')
  })
})

describe('nextLesson（真課綱 b1.json）', () => {
  it('沒有完成任何課時為第一單元第 1 課', () => {
    expect(nextLesson(B1, new Set())).toMatchObject({
      level: 'B1',
      unitId: 'b1-u01',
      unitTitle: '基礎常用字',
      lessonId: 'b1-u01-l01',
      ordinal: 1,
    })
  })

  it('跳過已完成的課（不要求依序）', () => {
    const next = nextLesson(B1, new Set(['b1-u01-l01', 'b1-u01-l03']))
    expect(next?.lessonId).toBe('b1-u01-l02')
    expect(next?.ordinal).toBe(2)
  })

  it('單元全部完成時跨到下一單元，序號從 1 重新起算', () => {
    const done = new Set(['l01', 'l02', 'l03', 'l04', 'l05', 'l06'].map((l) => `b1-u01-${l}`))
    expect(nextLesson(B1, done)).toEqual({
      level: 'B1',
      unitId: 'b1-u02',
      unitTitle: '數字、時間與日期',
      lessonId: 'b1-u02-l01',
      ordinal: 1,
      words: [
        'shortly',
        'annually',
        'lately',
        'deadline',
        'overnight',
        'sometime',
        'permanently',
        'timely',
        'former',
      ],
    })
  })

  it('整級完成時為 null', () => {
    const all = new Set(B1.units.flatMap((u) => u.lessons.map((l) => l.id)))
    expect(nextLesson(B1, all)).toBeNull()
  })
})
