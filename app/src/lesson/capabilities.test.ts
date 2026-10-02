// @vitest-environment node
import { describe, expect, it } from 'vitest'
import { buildLessonQueue } from './assemble'
import { detectCapabilities } from './capabilities'
import type { WritingItem } from './items'
import { createRegistry, READ_TYPES, WRITE_TYPES } from './queue'
import { loadFixture } from './testFixtures'

// TASK-15：有無 OpenRouter 金鑰由呼叫端傳入，與 TTS／STT 同一個機制（TASK-18 替代規則）
describe('detectCapabilities：金鑰', () => {
  it('預設沒有金鑰；呼叫端回 true 才算有', () => {
    expect(
      detectCapabilities(
        () => true,
        () => true,
      ).llmKey,
    ).toBe(false)
    expect(
      detectCapabilities(
        () => true,
        () => true,
        () => true,
      ).llmKey,
    ).toBe(true)
    expect(
      detectCapabilities(
        () => false,
        () => false,
        () => false,
      ),
    ).toEqual({
      tts: false,
      stt: false,
      llmKey: false,
    })
  })
})

describe('buildLessonQueue 回傳替代後的題目（畫面以它取題目內容）', () => {
  const doc = loadFixture('a1-u01-l01')
  const registry = createRegistry([...READ_TYPES, ...WRITE_TYPES])
  const writing = (d: { items: { type: string }[] }) =>
    d.items.filter((i) => i.type === 'translate' || i.type === 'makeSentence') as WritingItem[]

  it('沒有金鑰：兩題寫作都帶 selfCheck、仍在佇列', () => {
    const out = buildLessonQueue(
      doc,
      registry,
      detectCapabilities(
        () => false,
        () => false,
        () => false,
      ),
    )
    expect(writing(out.doc).map((i) => [i.id, i.selfCheck])).toEqual([
      ['a1-u01-l01-q16', true],
      ['a1-u01-l01-q17', true],
    ])
    expect(
      out.steps.filter((s) => s.type === 'translate' || s.type === 'makeSentence'),
    ).toHaveLength(2)
  })

  it('有金鑰：寫作題不帶 selfCheck（走 AI 批改）', () => {
    const out = buildLessonQueue(
      doc,
      registry,
      detectCapabilities(
        () => false,
        () => false,
        () => true,
      ),
    )
    expect(writing(out.doc).every((i) => i.selfCheck === undefined)).toBe(true)
  })
})
