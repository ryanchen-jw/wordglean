// 聽音打字判題（TASK-13 D1）：寬鬆大小寫、標點與彎引號、縮寫、數字；拼錯一律算錯並標錯字
// 期望值為手寫字面值（設計 s03 答錯例句、英文縮寫與數字唸法常識），不從實作重算
import { describe, expect, it } from 'vitest'
import { checkTyped } from './check'

const ok = (input: string, expected: string) =>
  expect(checkTyped(input, expected).correct).toBe(true)
const ng = (input: string, expected: string) =>
  expect(checkTyped(input, expected).correct).toBe(false)

describe('完全相同與大小寫、標點、空白', () => {
  it('句尾標點不用打', () => {
    expect(
      checkTyped('They moved the meeting to Friday', 'They moved the meeting to Friday.'),
    ).toEqual({
      correct: true,
      typed: ['They', 'moved', 'the', 'meeting', 'to', 'Friday'].map((text) => ({
        text,
        wrong: false,
      })),
      fixes: [],
    })
  })

  it('大小寫、前後與連續空白、多打的標點都不計', () => {
    ok('  they MOVED the meeting   to friday!! ', 'They moved the meeting to Friday.')
    ok('Lisa, stay calm', 'Lisa stay calm.')
    ok('"Really?" she asked.', 'Really, she asked')
  })

  it('彎引號與直引號相同（iPhone 鍵盤預設打彎引號）', () => {
    ok('I don’t know', "I don't know.")
    ok("I don't know", 'I don’t know.')
    ok('It’s Tom’s book', "It's Tom's book.")
  })

  it('連字號與空格相同', () => {
    ok('a well known company', 'a well-known company')
    ok('an e-mail', 'an e mail')
  })

  it('全形英文字母、數字、標點與空白（中文輸入法常見）等同半形', () => {
    ok('Ｔｈｅ　ｂｏｏｋ　ｉｓ　ｉｎ　ｔｈｅ　ｂａｇ．', 'The book is in the bag.')
    ok('I have ５ books', 'I have 5 books.')
    ok('Ｉ ｄｏｎ＇ｔ ｋｎｏｗ', "I don't know.")
    expect(
      checkTyped('Ｔｈｅ ｂｏｏｋ ｉｓ ｏｎ ｔｈｅ ｂａｇ', 'The book is in the bag.').fixes,
    ).toEqual([{ from: 'on', to: 'in' }])
  })
})

describe('拼錯一律算錯並標錯字（設計 s03 答錯）', () => {
  it('move → moved：差一個字母也算錯，標出使用者打的那個字', () => {
    expect(
      checkTyped('They move the meeting to Friday', 'They moved the meeting to Friday.'),
    ).toEqual({
      correct: false,
      typed: [
        { text: 'They', wrong: false },
        { text: 'move', wrong: true },
        { text: 'the', wrong: false },
        { text: 'meeting', wrong: false },
        { text: 'to', wrong: false },
        { text: 'Friday', wrong: false },
      ],
      fixes: [{ from: 'move', to: 'moved' }],
    })
  })

  it('改正清單去掉標點、保留原本大小寫', () => {
    expect(
      checkTyped('They moved the meeting to friday', 'They moved the meeting to Fryday.').fixes,
    ).toEqual([{ from: 'friday', to: 'Fryday' }])
  })

  it('漏打一個字：沒有字被標錯，改正清單列出漏的字', () => {
    const r = checkTyped('They moved meeting to Friday', 'They moved the meeting to Friday.')
    expect(r.correct).toBe(false)
    expect(r.typed.some((w) => w.wrong)).toBe(false)
    expect(r.fixes).toEqual([{ from: null, to: 'the' }])
  })

  it('多打一個字：標一個字錯，改正清單列出多的字', () => {
    const r = checkTyped('They moved the meeting to on Friday', 'They moved the meeting to Friday.')
    expect(r.correct).toBe(false)
    expect(r.typed.filter((w) => w.wrong)).toEqual([{ text: 'on', wrong: true }])
    expect(r.fixes).toEqual([{ from: 'on', to: null }])
  })

  it('兩處不相鄰的錯各自列出', () => {
    expect(checkTyped('The book is on the back', 'The book is in the bag.').fixes).toEqual([
      { from: 'on', to: 'in' },
      { from: 'back', to: 'bag' },
    ])
  })

  it('空白輸入算錯、沒有字被標', () => {
    const r = checkTyped('   ', 'The book is in the bag.')
    expect(r.correct).toBe(false)
    expect(r.typed).toEqual([])
  })

  it('整句只有標點的字不會被標錯', () => {
    const r = checkTyped('The book — is in the bag', 'The book is in the bag.')
    expect(r.correct).toBe(true)
  })
})

describe('縮寫（本專案案例）', () => {
  it('n’t 與 not', () => {
    ok('I do not know', "I don't know.")
    ok("I don't know", 'I do not know.')
    ok('She does not like it', "She doesn't like it.")
    ok("He isn't here", 'He is not here.')
    ok("We didn't go", 'We did not go.')
  })

  it('不規則的否定縮寫：can’t／cannot／can not、won’t、shan’t', () => {
    ok('I cannot swim', "I can't swim.")
    ok('I can not swim', "I can't swim.")
    ok("I can't swim", 'I cannot swim.')
    ok('I will not go', "I won't go.")
    ok("I won't go", 'I will not go.')
    ok('We shall not wait', "We shan't wait.")
  })

  it('’re、’ve、’ll、’m、let’s', () => {
    ok('They are late', "They're late.")
    ok('We have finished', "We've finished.")
    ok("I'll call you", 'I will call you.')
    ok('I am ready', "I'm ready.")
    ok('Let us go', "Let's go.")
  })

  it('’s 可展開成 is 或 has；’d 可展開成 would 或 had', () => {
    ok('She is busy', "She's busy.")
    ok('She has left', "She's left.")
    ok("She's left", 'She has left.')
    ok('I would like tea', "I'd like tea.")
    ok('I had seen it', "I'd seen it.")
  })

  it('所有格 ’s 照原樣才算對', () => {
    ok("Tom's dog is big", "Tom's dog is big.")
    expect(checkTyped('Toms dog is big', "Tom's dog is big.")).toMatchObject({
      correct: false,
      fixes: [{ from: 'Toms', to: "Tom's" }],
    })
  })

  it('意思相反不算對；縮寫少了撇號算拼錯', () => {
    ng("I don't know", 'I do know.')
    ng('I do know', "I don't know.")
    expect(checkTyped('I dont know', "I don't know.")).toMatchObject({
      correct: false,
      typed: [
        { text: 'I', wrong: false },
        { text: 'dont', wrong: true },
        { text: 'know', wrong: false },
      ],
      fixes: [{ from: 'dont', to: "don't" }],
    })
  })

  it('o’clock 不是縮寫，照原樣比', () => {
    ok("at five o'clock", "At 5 o'clock.")
  })
})

describe('數字（本專案案例）', () => {
  it('阿拉伯數字與英文字互通', () => {
    ok('I have five books', 'I have 5 books.')
    ok('I have 5 books', 'I have five books.')
    ok('There are 0 cars', 'There are zero cars.')
    ok('She is twelve', 'She is 12.')
  })

  it('十位與連字號：21＝twenty-one＝twenty one', () => {
    ok('twenty-one people', '21 people')
    ok('twenty one people', '21 people')
    ok('21 people', 'twenty-one people')
  })

  it('百、千、千分位逗點', () => {
    ok('one hundred five', '105')
    ok('three hundred forty-two', '342')
    ok('one thousand', '1,000')
    ok('1000', '1,000')
    ok('two thousand five', '2005')
    ok('twelve thousand three hundred', '12,300')
  })

  it('時間的冒號、錢與百分比', () => {
    ok('The meeting is at three thirty', 'The meeting is at 3:30.')
    ok('It costs fifty dollars', 'It costs $50.')
    ok('It costs $50', 'It costs fifty dollars.')
    ok('Sales rose twenty percent', 'Sales rose 20%.')
  })

  it('序數', () => {
    ok('the first floor', 'the 1st floor')
    ok('on the twenty-second', 'on the 22nd')
    ok('the 3rd time', 'the third time')
  })

  it('1100–1999 的四位數另接受年份讀法', () => {
    ok('in nineteen ninety', 'in 1990')
    ok('in one thousand nine hundred ninety', 'in 1990')
    ok('in nineteen hundred', 'in 1900')
    ok('in nineteen oh five', 'in 1905')
  })

  it('數字不同算錯，改正清單用原本的寫法', () => {
    expect(checkTyped('I have 6 books', 'I have 5 books.')).toMatchObject({
      correct: false,
      fixes: [{ from: '6', to: '5' }],
    })
    expect(checkTyped('I have six books', 'I have 5 books.')).toMatchObject({
      correct: false,
      fixes: [{ from: 'six', to: '5' }],
    })
  })
})
