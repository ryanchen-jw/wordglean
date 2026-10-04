import { describe, expect, it } from 'vitest'
import { availableModel, DEFAULT_MODELS, modelChain } from './models'

describe('預設模型（free-models.md §7 #6：只用免費、提供商不訓練）', () => {
  it('評測選定（llm-eval.md §8）：預設 Qwen3.8 27B、fallback Apodex 1.1 Mini', () => {
    expect(DEFAULT_MODELS).toEqual(['qwen/qwen3.8-27b:free', 'apodex/apodex-1.1-mini:free'])
  })

  it('預設鏈全是 :free、不含 NVIDIA（執行長 D1）', () => {
    expect(DEFAULT_MODELS.length).toBeGreaterThanOrEqual(2)
    for (const m of DEFAULT_MODELS) {
      expect(m.endsWith(':free')).toBe(true)
      expect(m.startsWith('nvidia/')).toBe(false)
    }
  })

  it('modelChain：選的在前、預設補後、去重', () => {
    expect(modelChain('x/y:free')).toEqual(['x/y:free', ...DEFAULT_MODELS])
    expect(modelChain(DEFAULT_MODELS[1])).toEqual([DEFAULT_MODELS[1], DEFAULT_MODELS[0]])
  })

  it('availableModel：還在就不動；下架換回第一個還在的預設；清單拿不到或預設全不在就不動', () => {
    expect(availableModel('a', new Set(['a']))).toBe('a')
    expect(availableModel('gone', new Set([DEFAULT_MODELS[1]]))).toBe(DEFAULT_MODELS[1])
    expect(availableModel('gone', new Set(DEFAULT_MODELS))).toBe(DEFAULT_MODELS[0])
    expect(availableModel('gone', null)).toBe('gone')
    expect(availableModel('gone', new Set(['other']))).toBe('gone')
  })
})
