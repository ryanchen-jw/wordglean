// @vitest-environment node
import { describe, expect, it } from 'vitest'
import type { Step } from './queue'
import { advance, createRun, currentKey, isComplete, matchesQueue, score, withAnswer } from './run'

const T = Date.parse('2026-10-02T08:00:00Z')
const step = (key: string): Step => ({ key, itemId: key, type: 'mcq', srsWord: null })
const STEPS = [step('q1'), step('q2'), step('q3')]
const right = { correct: true, elapsedMs: 1000, usedHint: false, grade: null }
const wrong = { ...right, correct: false }

describe('小課進度狀態', () => {
  it('新進度從第 1 題開始、沒有作答', () => {
    const run = createRun('a1-u01-l01', STEPS, T)
    expect(currentKey(run)).toBe('q1')
    expect(score(run)).toEqual({ total: 3, correct: 0 })
    expect(isComplete(run)).toBe(false)
  })

  it('答題、繼續、計分', () => {
    let run = createRun('a1-u01-l01', STEPS, T)
    run = withAnswer(run, 'q1', right, T + 1)
    run = advance(run, T + 2)
    run = withAnswer(run, 'q2', wrong, T + 3)
    run = advance(run, T + 4)
    run = withAnswer(run, 'q3', right, T + 5)
    expect(score(run)).toEqual({ total: 3, correct: 2 })
    expect(isComplete(run)).toBe(true)
    expect(run.results.q1.answeredAt).toBe(T + 1)
  })

  it('只能答目前這一題、每題只答一次', () => {
    const run = createRun('a1-u01-l01', STEPS, T)
    expect(() => withAnswer(run, 'q2', right, T)).toThrow()
    const answered = withAnswer(run, 'q1', right, T)
    expect(() => withAnswer(answered, 'q1', wrong, T)).toThrow()
  })

  it('沒作答不能繼續；最後一題之後不能再繼續', () => {
    const run = createRun('a1-u01-l01', [step('q1')], T)
    expect(() => advance(run, T)).toThrow()
    const done = advance(withAnswer(run, 'q1', right, T), T)
    expect(currentKey(done)).toBeNull()
    expect(() => advance(done, T)).toThrow()
  })

  it('題目變了就對不上存檔', () => {
    const run = createRun('a1-u01-l01', STEPS, T)
    expect(matchesQueue(run, STEPS)).toBe(true)
    expect(matchesQueue(run, [step('q1'), step('q2')])).toBe(false)
    expect(matchesQueue(run, [step('q1'), step('qX'), step('q3')])).toBe(false)
  })
})
