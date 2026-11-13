import { describe, expect, it } from 'vitest'
import { createLiveMatch, matchParts } from './liveMatch'

const marks = (s: { words: { text: string; mark: string }[] }) =>
  s.words.map((w) => `${w.text}:${w.mark}`).join(' ')

describe('matchParts（半全域對齊）', () => {
  it('只聽到句中一段時對到句中，不當成前後漏字', () => {
    const t = ['i', 'want', 'to', 'eat', 'dinner']
    expect([...matchParts(t, ['want', 'to'], [false, false, false, false, false])]).toEqual([2, 1])
  })

  it('只認完全相同的字（eats 不算 eat）', () => {
    expect(
      [...matchParts(['i', 'eat', 'rice'], ['i', 'eats', 'rice'], [false, false, false])].sort(),
    ).toEqual([0, 2])
  })

  it('單獨一個重複字：對到第一個未完成的', () => {
    const t = ['the', 'cat', 'saw', 'the', 'dog']
    expect([...matchParts(t, ['the'], [false, false, false, false, false])]).toEqual([0])
    expect([...matchParts(t, ['the'], [true, false, false, false, false])]).toEqual([3])
  })

  it('重複字有上下文時由上下文決定', () => {
    const t = ['the', 'cat', 'saw', 'the', 'dog']
    expect([...matchParts(t, ['the', 'dog'], [false, false, false, false, false])].sort()).toEqual([
      3, 4,
    ])
  })
})

describe('createLiveMatch', () => {
  it('不照順序：先唸後面再唸前面，兩輪確認關閉時唸到即完成', () => {
    const m = createLiveMatch('I want to eat dinner', { confirm: false })
    expect(marks(m.update('eat dinner'))).toBe('I:todo want:todo to:todo eat:done dinner:done')
    const s = m.update('I want')
    expect(marks(s)).toBe('I:done want:done to:light eat:done dinner:done')
    expect(s.complete).toBe(true)
    expect(s.doneCount).toBe(5)
  })

  it('兩輪確認：要相鄰兩輪都唸到才完成，中間斷一輪就退回', () => {
    const m = createLiveMatch('I want to eat dinner')
    expect(marks(m.update('eat'))).toBe('I:todo want:todo to:todo eat:heard dinner:todo')
    expect(marks(m.update('hello'))).toBe('I:todo want:todo to:todo eat:todo dinner:todo')
    m.update('eat dinner')
    expect(marks(m.update('eat dinner'))).toBe('I:todo want:todo to:todo eat:done dinner:done')
  })

  it('功能字不擋完成（B 版）：未唸到的標輕讀；functionWordsBlock 時要唸到', () => {
    const b = createLiveMatch('I go to the park', { confirm: false })
    expect(b.update('I go park').complete).toBe(true)
    expect(marks(b.state())).toBe('I:done go:done to:light the:light park:done')
    const a = createLiveMatch('I go to the park', { confirm: false, functionWordsBlock: true })
    expect(a.update('I go park').complete).toBe(false)
    expect(a.update('to the').complete).toBe(true)
  })

  it("縮寫互通：目標 I'm 聽到 I am、目標 I am 聽到 I'm 都算", () => {
    const a = createLiveMatch("I'm happy", { confirm: false })
    expect(marks(a.update('I am happy'))).toBe("I'm:done happy:done")
    const b = createLiveMatch('I am happy', { confirm: false })
    expect(marks(b.update("I'm happy"))).toBe('I:done am:done happy:done')
  })

  it("縮寫只聽到一半不算唸到（I'm 要 i、am 同一輪都對到）", () => {
    const m = createLiveMatch("I'm happy", { confirm: false })
    expect(marks(m.update('I happy'))).toBe("I'm:todo happy:done")
  })

  it('數字與英文互通：10 與 ten', () => {
    const m = createLiveMatch('I have 10 cats', { confirm: false })
    expect(marks(m.update('I have ten cats'))).toBe('I:done have:done 10:done cats:done')
  })

  it('重複字：單獨唸 the 依序收集兩個 the，都完成後再唸不變', () => {
    const m = createLiveMatch('the cat saw the dog', { confirm: false, functionWordsBlock: true })
    expect(marks(m.update('the'))).toBe('the:done cat:todo saw:todo the:todo dog:todo')
    expect(marks(m.update('the'))).toBe('the:done cat:todo saw:todo the:done dog:todo')
    expect(marks(m.update('the'))).toBe('the:done cat:todo saw:todo the:done dog:todo')
  })

  it('最長一口氣：單一輪按原句順序連續唸到的最多字數', () => {
    const m = createLiveMatch('I want to eat dinner now', { confirm: false })
    expect(m.update('want to').longestRun).toBe(2)
    expect(m.update('I dinner now').longestRun).toBe(2)
    expect(m.update('want to eat dinner').longestRun).toBe(4)
  })

  it('整句完成後不再變動', () => {
    const m = createLiveMatch('hello world', { confirm: false })
    expect(m.update('hello world').complete).toBe(true)
    expect(m.update('goodbye').round).toBe(1)
  })

  it('全是功能字的句子每個字都要唸到', () => {
    const m = createLiveMatch('to be or', { confirm: false })
    expect(m.update('to be').complete).toBe(false)
    expect(m.update('or').complete).toBe(true)
  })
})
