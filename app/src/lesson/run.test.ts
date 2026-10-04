// @vitest-environment node
import { describe, expect, it } from 'vitest'
import type { Step } from './queue'
import {
  activeKey,
  advance,
  createRun,
  currentKey,
  isAnswered,
  isComplete,
  matchesQueue,
  proceed,
  retryProgress,
  score,
  withAnswer,
  withRetryAnswer,
} from './run'

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

describe('錯題重做（創辦人試用 2026-10-04 ⑤）', () => {
  /** 主輪依序作答到最後一題（最後一題答完、還沒按繼續）；answers[i]＝第 i 題對錯 */
  const mainRound = (answers: boolean[]) => {
    let run = createRun('a1-u01-l01', STEPS, T)
    answers.forEach((ok, i) => {
      run = withAnswer(run, STEPS[i].key, ok ? right : wrong, T)
      if (i < answers.length - 1) run = proceed(run, T)
    })
    return run
  }

  it('主輪全對：繼續＝做完，不進重做', () => {
    const run = proceed(mainRound([true, true, true]), T)
    expect(run.retry).toBeUndefined()
    expect(activeKey(run)).toBeNull()
  })

  it('主輪有錯：繼續＝進第 1 輪重做，依原順序只出錯題', () => {
    const run = proceed(mainRound([false, true, false]), T)
    expect(run.retry).toEqual({ round: 1, keys: ['q1', 'q3'], cursor: 0, passed: {} })
    expect(activeKey(run)).toBe('q1')
    expect(retryProgress(run)).toEqual({ n: 1, total: 2 })
  })

  it('重做不改第一次的作答（計分與 FSRS 只看第一次）', () => {
    let run = proceed(mainRound([false, true, false]), T)
    const first = run.results
    run = withRetryAnswer(run, 'q1', { correct: true }, T + 9)
    expect(run.results).toBe(first)
    expect(score(run)).toEqual({ total: 3, correct: 1 })
  })

  it('仍錯的再出一輪，直到全對才做完', () => {
    let run = proceed(mainRound([false, true, false]), T)
    run = proceed(withRetryAnswer(run, 'q1', { correct: true }, T), T)
    expect(activeKey(run)).toBe('q3')
    expect(retryProgress(run)).toEqual({ n: 2, total: 2 })
    run = proceed(withRetryAnswer(run, 'q3', { correct: false }, T), T)
    expect(run.retry).toEqual({ round: 2, keys: ['q3'], cursor: 0, passed: {} })
    expect(activeKey(run)).toBe('q3')
    run = proceed(withRetryAnswer(run, 'q3', { correct: true }, T), T)
    expect(activeKey(run)).toBeNull()
  })

  it('重做時跳過（跟讀「先跳過這題」）：不再出（避免不能錄音的人永遠做不完）', () => {
    let run = proceed(mainRound([false, true, true]), T)
    run = proceed(withRetryAnswer(run, 'q1', { correct: false, skipped: true }, T), T)
    expect(activeKey(run)).toBeNull()
  })

  it('重做時只能答目前這題、每題只答一次；沒作答不能繼續', () => {
    const run = proceed(mainRound([false, true, false]), T)
    expect(() => withRetryAnswer(run, 'q3', { correct: true }, T)).toThrow()
    expect(() => proceed(run, T)).toThrow()
    expect(isAnswered(run)).toBe(false)
    const answered = withRetryAnswer(run, 'q1', { correct: true }, T)
    expect(isAnswered(answered)).toBe(true)
    expect(() => withRetryAnswer(answered, 'q1', { correct: true }, T)).toThrow()
  })

  it('isAnswered：主輪看目前這題的第一次作答', () => {
    expect(isAnswered(createRun('a1-u01-l01', STEPS, T))).toBe(false)
    expect(isAnswered(mainRound([false]))).toBe(true)
  })
})
