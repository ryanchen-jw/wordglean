// @vitest-environment node
import { describe, expect, it } from 'vitest'
import { gradeFor } from './grade'

// 期望值：ts-fsrs Rating 字面值 Again=1、Hard=2、Good=3（創辦人 G2 裁示的對應表）
describe('作答 → FSRS 評分（AC#1 計分）', () => {
  it.each([
    ['答錯', { correct: false, elapsedMs: 3_000, usedHint: false }, 1],
    ['答錯且用了提示', { correct: false, elapsedMs: 3_000, usedHint: true }, 1],
    ['答錯且超時', { correct: false, elapsedMs: 30_000, usedHint: false }, 1],
    ['答對、3 秒', { correct: true, elapsedMs: 3_000, usedHint: false }, 3],
    ['答對、剛好 15 秒（不算超過）', { correct: true, elapsedMs: 15_000, usedHint: false }, 3],
    ['答對、15.001 秒', { correct: true, elapsedMs: 15_001, usedHint: false }, 2],
    ['答對但看了例句提示', { correct: true, elapsedMs: 2_000, usedHint: true }, 2],
  ])('%s', (_, input, expected) => {
    expect(gradeFor(input)).toBe(expected)
  })

  it('不會出 Easy（4）', () => {
    for (const correct of [true, false])
      for (const usedHint of [true, false])
        for (const elapsedMs of [0, 15_000, 60_000])
          expect(gradeFor({ correct, usedHint, elapsedMs })).not.toBe(4)
  })
})
