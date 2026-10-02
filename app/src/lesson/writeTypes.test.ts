// @vitest-environment node
import { describe, expect, it } from 'vitest'
import type { LessonItemsDoc, TranslateItem } from './items'
import { buildQueue, createRegistry, READ_TYPES, WRITE_TYPES } from './queue'
import { loadFixture } from './testFixtures'

const registry = createRegistry([...READ_TYPES, ...WRITE_TYPES])

describe('寫類題型登記（TASK-15）', () => {
  it('A1 樣本課：讀類 12 步之後接中翻英 q16、造句 q17＝14 步；只剩聽說略過', () => {
    const { steps, skipped } = buildQueue(loadFixture('a1-u01-l01'), registry)
    expect(steps).toHaveLength(14)
    expect(steps.slice(12)).toEqual([
      { key: 'a1-u01-l01-q16', itemId: 'a1-u01-l01-q16', type: 'translate', srsWord: null },
      { key: 'a1-u01-l01-q17', itemId: 'a1-u01-l01-q17', type: 'makeSentence', srsWord: null },
    ])
    expect(skipped.map((s) => s.type)).toEqual([
      'listenType',
      'listenChoice',
      'shadowing',
      'shadowing',
    ])
  })

  it('寫作不寫 FSRS：每一步 srsWord 都是 null', () => {
    const { steps } = buildQueue(loadFixture('b1-u01-l01'), registry)
    const writing = steps.filter((s) => s.type === 'translate' || s.type === 'makeSentence')
    expect(writing).toHaveLength(2)
    expect(writing.every((s) => s.srsWord === null)).toBe(true)
  })

  const translate: TranslateItem = {
    id: 'x-q01',
    type: 'translate',
    promptZh: '儘管很累，她還是完成了工作。',
    hintWords: ['despite'],
    referenceEn: ['Despite being tired, she finished the work.'],
    rubricZh: ['despite 後面接名詞或動名詞'],
  }
  const doc = (item: unknown): LessonItemsDoc => ({
    schemaVersion: 1,
    lessonId: 'x',
    level: 'B1',
    items: [item as TranslateItem],
  })

  it.each([
    ['沒有參考答案', { ...translate, referenceEn: [] }],
    ['參考答案有空字串', { ...translate, referenceEn: [' '] }],
    ['沒有批改要點', { ...translate, rubricZh: undefined }],
    ['中文題目空白', { ...translate, promptZh: '' }],
    ['提示字不是陣列', { ...translate, hintWords: 'despite' }],
    [
      '造句缺指定字',
      {
        id: 'x-q02',
        type: 'makeSentence',
        targetWord: '',
        instructionZh: '用 whether 造句',
        referenceEn: ['a'],
        rubricZh: ['b'],
      },
    ],
  ])('欄位不全略過（invalid）：%s', (_, item) => {
    expect(buildQueue(doc(item), registry)).toMatchObject({
      steps: [],
      skipped: [{ reason: 'invalid' }],
    })
  })

  it('提示字可以是空陣列', () => {
    expect(buildQueue(doc({ ...translate, hintWords: [] }), registry).steps).toHaveLength(1)
  })
})
