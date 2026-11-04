import { describe, expect, it } from 'vitest'
import { shardKey } from './shards'
import { splitOther, tokenize } from './tokenize'

describe('splitOther（緊鄰單字的標點要跟著字走）', () => {
  const cases: [string, boolean, boolean, [string, string, string]][] = [
    [', ', true, true, [',', ' ', '']],
    [',', true, true, [',', '', '']], // word,word
    ['/', true, true, ['/', '', '']], // and/or
    ['—', true, true, ['—', '', '']], // wait—now
    ['... ', true, true, ['...', ' ', '']],
    ['...', true, false, ['...', '', '']],
    [' (', true, true, ['', ' ', '(']],
    ['(', false, true, ['', '', '(']],
    [')(', true, true, [')', '', '(']],
    [', "', true, true, [',', ' ', '"']], // said, "hello
    ['," ', true, true, [',"', ' ', '']], // hello," he
    ['“', true, true, ['', '', '“']],
    [' 3', true, true, ['', ' ', '3']], // 3rd
    [' 5-', true, true, ['', ' ', '5-']], // 5-day
    ['. 7. ', true, true, ['.', ' 7. ', '']], // 數字留在中段，照一般文字斷行
    [' — ', true, true, ['', ' — ', '']], // 前後有空白的破折號
    ['123', false, false, ['', '123', '']],
    ['. 7', true, false, ['.', ' 7', '']],
    ['5 ', false, true, ['', '5 ', '']],
  ]
  it.each(cases)('%j', (text, hasPrev, hasNext, [lead, mid, trail]) => {
    expect(splitOther(text, hasPrev, hasNext)).toEqual({ lead, mid, trail })
  })
})

describe('tokenize', () => {
  it('字與標點分開，原文可完整拼回', () => {
    const text = 'Dear team, due to the public holiday, our weekly meeting will be moved…'
    const tokens = tokenize(text)
    expect(tokens.map((t) => t.text).join('')).toBe(text)
    expect(tokens.filter((t) => t.kind === 'word').map((t) => t.text)).toEqual([
      'Dear',
      'team',
      'due',
      'to',
      'the',
      'public',
      'holiday',
      'our',
      'weekly',
      'meeting',
      'will',
      'be',
      'moved',
    ])
  })

  it('縮寫、所有格、連字號算一個字；數字不是字', () => {
    const words = tokenize("I don’t know Jenny's well-known 3 cats.").filter(
      (t) => t.kind === 'word',
    )
    expect(words.map((t) => t.text)).toEqual([
      'I',
      'don’t',
      'know',
      "Jenny's",
      'well-known',
      'cats',
    ])
  })

  it('標出句首：開頭與 . ! ? 之後', () => {
    const starts = tokenize('Hi Tom. Are you OK? Yes!')
      .filter((t) => t.kind === 'word')
      .map((t) => [t.text, t.sentenceStart])
    expect(starts).toEqual([
      ['Hi', true],
      ['Tom', false],
      ['Are', true],
      ['you', false],
      ['OK', false],
      ['Yes', true],
    ])
  })
})

describe('shardKey（data/CLAUDE.md 查找規則）', () => {
  it('前 n 字母小寫、非 a–z 記 _、不足補 _', () => {
    expect(shardKey('Meeting', 2)).toBe('me')
    expect(shardKey('a', 2)).toBe('a_')
    expect(shardKey("o'clock", 2)).toBe('o_')
    expect(shardKey('3D', 2)).toBe('_d')
  })
})
