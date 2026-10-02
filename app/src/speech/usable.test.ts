// 跟讀可用的判斷（TASK-18 capabilities 的 STT）：能錄音且有 WebAssembly，或已同意瀏覽器語音辨識
import { describe, expect, it } from 'vitest'
import { isSttUsable } from './usable'

describe('isSttUsable', () => {
  it.each([
    [true, true, false, true],
    [false, true, false, false],
    [true, false, false, false],
    [false, false, false, false],
    [false, false, true, true],
    [true, false, true, true],
  ])('能錄音=%s、WebAssembly=%s、已同意後備=%s → %s', (rec, wasm, web, expected) => {
    expect(isSttUsable(rec, wasm, web)).toBe(expected)
  })
})
