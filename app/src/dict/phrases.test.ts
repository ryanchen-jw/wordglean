// 片語比對（TASK-24 W5）：規則同 content/scripts/lib/phrase-match.mjs；片語、釋義取自真片語表 data/phrases
import { describe, expect, it } from 'vitest'
import { fsDictDeps } from '../test/dictFs'
import { glossLine } from './gloss'
import { phrasesAt, phraseSpans } from './phrases'
import { tokenize } from './tokenize'

const deps = fsDictDeps()

/** 點 text 裡第 n 個字（從 0 起，只數英文字）時對到的片語 */
async function at(text: string, n: number) {
  const tokens = tokenize(text)
  const index = tokens.map((t, i) => (t.kind === 'word' ? i : -1)).filter((i) => i >= 0)[n]
  return (await phrasesAt(tokens, index, deps.phrases, deps.shards)).map((p) => p.phrase)
}

describe('片語表', () => {
  it('載入 468 個片語；釋義的受詞位置改成 ⋯', () => {
    expect(deps.phrases).toHaveLength(468)
    expect(deps.phrases.find((p) => p.phrase === 'give up')).toEqual({
      phrase: 'give up',
      cefr: 'A2',
      glossZh: '放棄',
      separable: true,
    })
    expect(deps.phrases.some((p) => p.glossZh.includes('…'))).toBe(false)
  })

  it('單字總表的對照併入片語：片語也查得到中文（收藏片語的單字庫釋義）', async () => {
    expect(await glossLine('give up', deps)).toBe('放棄')
    expect(deps.lex.get('give up')).toMatchObject({ cefr: 'A2', phrase: true })
    // 單字本身不受影響
    expect(deps.lex.get('give')?.phrase).toBeUndefined()
  })
})

describe('phrasesAt：點片語中的任一字', () => {
  it('原形、詞形變化都對得到；點片語的每個字都算', async () => {
    expect(await at('I will give up.', 0)).toEqual([])
    expect(await at('I will give up.', 2)).toEqual(['give up'])
    expect(await at('I will give up.', 3)).toEqual(['give up'])
    expect(await at('She gave up smoking.', 1)).toEqual(['give up'])
    expect(await at('He gives up too easily.', 2)).toEqual(['give up'])
    expect(await at('We are looking forward to it.', 3)).toEqual(['look forward to'])
  })

  it('可分離片語：第 1 個成分後插入 1–3 個字仍對得到；插入的受詞本身不算片語', async () => {
    expect(await at('Please pick it up.', 1)).toEqual(['pick up'])
    expect(await at('Please pick it up.', 3)).toEqual(['pick up'])
    expect(await at('Please pick it up.', 2)).toEqual([])
    expect(await at('He picked my little brother up.', 1)).toEqual(['pick up'])
    // 插入 4 個字不算
    expect(await at('He picked my very little brother up.', 1)).toEqual([])
  })

  it('不可分離片語拆開不算；小品詞不同不算', async () => {
    expect(await at('I look it after.', 1)).toEqual([])
    expect(await at('Never give in.', 1)).not.toContain('give up')
  })

  it('不跨子句與分隔符號：標點、・ 斷開', async () => {
    expect(await at('I gave, up there.', 1)).toEqual([])
    expect(await at('clean・up', 0)).toEqual([])
    expect(await at('clean up・come in', 0)).toEqual(['clean up'])
    expect(await at('clean up・come in', 2)).toEqual(['come in'])
  })

  it('同時屬於長短兩個片語時，長的排前面（come up with 在 come up 之前）', async () => {
    expect(await at('She came up with a plan.', 1)).toEqual(['come up with', 'come up'])
    expect(await at('I need to keep up with the class.', 3)).toEqual(['keep up with', 'keep up'])
  })

  it('your 代表任一所有格', async () => {
    expect(await at('She did her best.', 1)).toEqual(['do your best'])
  })
})

describe('phraseSpans：作答前要隱藏的片語位置', () => {
  it('回傳片語成分的 token 索引（不含插入的受詞）', async () => {
    const tokens = tokenize('Please pick it up now.')
    const spans = await phraseSpans(tokens, [{ phrase: 'pick up', separable: true }], deps.shards)
    expect(spans.map((s) => s.at.map((i) => tokens[i].text))).toEqual([['pick', 'up']])
  })
})
