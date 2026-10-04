import { afterEach, describe, expect, it, vi } from 'vitest'
import { uuid } from './uuid'

const V4 = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('uuid', () => {
  it('有 randomUUID 時直接用它', () => {
    const randomUUID = vi.fn(() => '11111111-1111-4111-8111-111111111111')
    vi.stubGlobal('crypto', { randomUUID, getRandomValues: crypto.getRandomValues.bind(crypto) })
    expect(uuid()).toBe('11111111-1111-4111-8111-111111111111')
    expect(randomUUID).toHaveBeenCalledOnce()
  })

  it('非安全來源（沒有 randomUUID）：改用 getRandomValues 產生合法 v4 且不重複', () => {
    vi.stubGlobal('crypto', { getRandomValues: crypto.getRandomValues.bind(crypto) })
    expect(crypto.randomUUID).toBeUndefined()
    const ids = Array.from({ length: 1000 }, uuid)
    for (const id of ids) expect(id).toMatch(V4)
    expect(new Set(ids).size).toBe(ids.length)
  })
})
