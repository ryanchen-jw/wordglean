// 釋義取自真資料（data/lexicon、data/dict）
import { describe, expect, it } from 'vitest'
import { fsDictDeps } from '../test/dictFs'
import { shortGloss } from './format'
import { glossLine } from './gloss'

const deps = fsDictDeps()

describe('glossLine', () => {
  it('單字總表有中文就用它', async () => {
    expect(await glossLine('postpone', deps)).toBe('vt. 延遲, 使延期⋯')
  })

  it('單字總表沒中文（attendee）退回字典條目第一行', async () => {
    expect(await glossLine('attendee', deps)).toBe('[計] 出席人, 參加者, 被照顧者⋯')
  })

  it('字典也沒有回 null', async () => {
    expect(await glossLine('xyzzyq', deps)).toBeNull()
  })
})

describe('shortGloss', () => {
  it('去詞性、取第一個義項、去刪節號', () => {
    expect(shortGloss('vt. 延遲, 使延期⋯')).toBe('延遲')
    expect(shortGloss('pl. 議程, 日常工作事項')).toBe('議程')
    expect(shortGloss('n. 會議, 會面')).toBe('會議')
    expect(shortGloss('be的過去式')).toBe('be的過去式')
    expect(shortGloss('n. 意志⋯')).toBe('意志')
    expect(shortGloss('[計] 出席人, 參加者, 被照顧者⋯')).toBe('出席人')
  })
})
