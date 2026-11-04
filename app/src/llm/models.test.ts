import { describe, expect, it } from 'vitest'
import { availableModel, DEFAULT_MODELS, modelChain } from './models'

const G31 = 'google/gemma-4-31b-it:free'
const G26 = 'google/gemma-4-26b-a4b-it:free'
const XING = 'xingchen-agi/xing4.0-29b-a4b:free'

describe('預設模型（創辦人 2026-11-05 裁示：Google 優先、未經評測）', () => {
  it('預設鏈：Gemma 31B、Gemma 26B、不同提供商的備援', () => {
    expect(DEFAULT_MODELS).toEqual([G31, G26, XING])
  })

  it('預設鏈全是 :free、不含 NVIDIA（執行長 D1）', () => {
    for (const m of DEFAULT_MODELS) {
      expect(m.endsWith(':free')).toBe(true)
      expect(m.startsWith('nvidia/')).toBe(false)
    }
  })
})

describe('modelChain（OpenRouter 實測：models 超過 3 個整個請求 400；已下架的被略過但占名額）', () => {
  it('沒有清單：選的在前、去重；不超過 3 個，且留住不同提供商的備援', () => {
    expect(modelChain(G31)).toEqual([G31, G26, XING])
    expect(modelChain(G26)).toEqual([G26, G31, XING])
    expect(modelChain(XING)).toEqual([XING, G31, G26])
    expect(modelChain('x/y:free')).toEqual(['x/y:free', G31, XING])
    expect(modelChain('x/y:free', null)).toEqual(['x/y:free', G31, XING])
  })

  it('有清單：濾掉已下架的（選定的也濾），空出的名額由還在的 :free 補上、Google 優先', () => {
    const live = new Set([G31, 'a/b:free', 'google/new:free', 'paid/model'])
    expect(modelChain('qwen/qwen3.8-27b:free', live)).toEqual([G31, 'google/new:free', 'a/b:free'])
  })

  it('補位不選已知會拿 prompt 訓練的提供商（送 data_collection:deny 也一定被濾掉）', () => {
    const live = new Set([G31, 'nvidia/z:free', 'liquid/l:free', 'a/b:free'])
    expect(modelChain(G31, live)).toEqual([G31, 'a/b:free'])
  })

  it('使用者選的付費模型還在：排第一、補上免費備援', () => {
    const live = new Set(['anthropic/x', G31, G26, XING])
    expect(modelChain('anthropic/x', live)).toEqual(['anthropic/x', G31, XING])
  })

  it('清單裡一個可用的都沒有：退回不過濾，不送空陣列', () => {
    expect(modelChain('gone/m:free', new Set(['paid/model']))).toEqual(['gone/m:free', G31, XING])
    expect(modelChain('gone/m:free', new Set())).toEqual(['gone/m:free', G31, XING])
  })
})

describe('availableModel（啟動時選定模型的自動遷移）', () => {
  it('選定還在：不動（使用者手選優先）', () => {
    expect(availableModel('x/y', new Set(['x/y', G31]))).toBe('x/y')
  })

  it('選定下架：換成預設鏈第一個還在的', () => {
    expect(availableModel('gone', new Set(DEFAULT_MODELS))).toBe(G31)
    expect(availableModel('gone', new Set([G26, XING]))).toBe(G26)
  })

  it('預設鏈也全下架：選清單中的 :free，google/ 優先', () => {
    expect(availableModel('gone', new Set(['a/b:free', 'google/new:free', 'paid/x']))).toBe(
      'google/new:free',
    )
  })

  it('都沒有 google：選其他 :free，跳過已知會訓練的提供商', () => {
    expect(availableModel('gone', new Set(['nvidia/z:free', 'a/b:free', 'paid/x']))).toBe(
      'a/b:free',
    )
  })

  it('清單拿不到、或沒有任何可用的 :free：維持原選擇', () => {
    expect(availableModel('gone', null)).toBe('gone')
    expect(availableModel('gone', new Set(['paid/x']))).toBe('gone')
  })
})
