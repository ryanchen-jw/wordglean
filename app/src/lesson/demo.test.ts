// @vitest-environment node
import { describe, expect, it } from 'vitest'
import type { Capabilities } from './capabilities'
import { buildDemoQueue, DEMO_SOURCE } from './demo'
import { createRegistry, LISTEN_TYPES, READ_TYPES, SPEAK_TYPES, WRITE_TYPES } from './queue'
import { loadFixture } from './testFixtures'

const doc = loadFixture('a1-u01-l03')
const registry = createRegistry([...READ_TYPES, ...LISTEN_TYPES, ...SPEAK_TYPES, ...WRITE_TYPES])
const ALL: Capabilities = { tts: true, stt: true, llmKey: true }
const q = (n: number) => `${DEMO_SOURCE}-q${String(n).padStart(2, '0')}`

describe('示範課（創辦人 2026-10-05 裁示二）', () => {
  it('取自 a1-u01-l03：所有題型各一（翻譯兩題），依單字卡→配對→選擇→閱讀→聽打→聽選→跟讀→翻譯', () => {
    const { steps } = buildDemoQueue(doc, registry, ALL, null)
    expect(DEMO_SOURCE).toBe('a1-u01-l03')
    expect(steps.map((s) => s.key)).toEqual([
      ...[1, 2, 3, 4].map(q),
      'matching#1',
      q(13),
      `${q(15)}#0`,
      `${q(15)}#1`,
      q(9),
      q(10),
      q(11),
      q(16),
      q(17),
    ])
    expect(steps.map((s) => s.type)).toEqual([
      'wordCard',
      'wordCard',
      'wordCard',
      'wordCard',
      'matching',
      'mcq',
      'reading',
      'reading',
      'listenType',
      'listenChoice',
      'shadowing',
      'translate',
      'translate',
    ])
  })

  it('?type=：從該題型的第一題開始', () => {
    expect(buildDemoQueue(doc, registry, ALL, 'shadowing').steps.map((s) => s.key)).toEqual([
      q(11),
      q(16),
      q(17),
    ])
    expect(buildDemoQueue(doc, registry, ALL, 'matching').steps[0].key).toBe('matching#1')
  })

  it('不認得的題型：從頭開始', () => {
    expect(buildDemoQueue(doc, registry, ALL, 'nope').steps).toHaveLength(13)
  })

  it('沒有金鑰：翻譯改自評（沿用能力替代規則）', () => {
    const { doc: applied } = buildDemoQueue(doc, registry, { ...ALL, llmKey: false }, null)
    expect(applied.items.find((i) => i.id === q(16))).toMatchObject({ selfCheck: true })
  })
})
