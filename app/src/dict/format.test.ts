import { describe, expect, it } from 'vitest'
import { formatPhonetic, parseGloss, sharedPos } from './format'

describe('formatPhonetic', () => {
  it("ECDICT 'mi:tiŋ → /ˈmiːtiŋ/；次重音 , → ˌ", () => {
    expect(formatPhonetic("'mi:tiŋ")).toBe('/ˈmiːtiŋ/')
    expect(formatPhonetic(",æb'dʌlə")).toBe('/ˌæbˈdʌlə/')
    // postpone 的原始音標：schwa 為西里爾 ә（U+04D9）
    expect(formatPhonetic("pәust'pәun")).toBe('/pəustˈpəun/')
  })

  it('沒有音標回 null（彈層不顯示斜線）', () => {
    expect(formatPhonetic('')).toBeNull()
  })
})

describe('parseGloss／sharedPos', () => {
  it('拆出詞性；專業領域行、變化形說明無詞性', () => {
    expect(parseGloss(['n. 會議, 會面', '[法] 會議, 會談, 集會', 'go的過去式'])).toEqual([
      { pos: 'n.', text: '會議, 會面' },
      { pos: null, text: '[法] 會議, 會談, 集會' },
      { pos: null, text: 'go的過去式' },
    ])
  })

  it('單一詞性才放音標旁；多詞性各行自帶', () => {
    expect(sharedPos(parseGloss(['n. 會議, 會面', '[法] 會議']))).toBe('n.')
    expect(sharedPos(parseGloss(['a. 左邊的', 'adv. 在左面']))).toBeNull()
    expect(sharedPos(parseGloss(['go的過去式']))).toBeNull()
  })
})
