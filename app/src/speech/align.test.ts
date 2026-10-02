// TASK-14 AC#1：跟讀逐字比對；期望值為手算（設計 s04 result 範例＋縮寫、數字、漏字、多字）
import { describe, expect, it } from 'vitest'
import { compareWords, type Comparison } from './align'

/** 送出句的顯示：對的字照原樣，其餘標 [記號:字]，漏字佔位為 ＿ */
const show = (c: Comparison) =>
  c.shown
    .map((w) => (w.text === null ? '＿' : w.mark === 'ok' ? w.text : `[${w.mark}:${w.text}]`))
    .join(' ')

const tally = ({ wrong, missing, extra, correct, total, perfect }: Comparison) => ({
  wrong,
  missing,
  extra,
  correct,
  total,
  perfect,
})

const PERFECT = (n: number) => ({
  wrong: 0,
  missing: 0,
  extra: 0,
  correct: n,
  total: n,
  perfect: true,
})

describe('compareWords：設計 s04 範例', () => {
  it('錯字 1・漏字 1・得分 6／8 字', () => {
    const c = compareWords(
      'Could we push the meeting to next Monday?',
      'Could we push the meetings to next',
    )
    expect(show(c)).toBe('Could we push the [wrong:meetings] to next ＿')
    expect(tally(c)).toEqual({
      wrong: 1,
      missing: 1,
      extra: 0,
      correct: 6,
      total: 8,
      perfect: false,
    })
    expect(c.target.map((w) => `${w.text}:${w.mark}`)).toEqual([
      'Could:ok',
      'we:ok',
      'push:ok',
      'the:ok',
      'meeting:wrong',
      'to:ok',
      'next:ok',
      'Monday:missing',
    ])
  })
})

describe('compareWords：大小寫與標點', () => {
  it('大小寫、句點不同仍全對', () => {
    const c = compareWords('I have a cup of tea.', 'i have a cup of tea')
    expect(show(c)).toBe('i have a cup of tea')
    expect(tally(c)).toEqual(PERFECT(6))
  })

  it('彎撇號與直撇號視為相同', () => {
    expect(tally(compareWords('Don’t worry.', 'do not worry'))).toEqual(PERFECT(2))
  })

  it('字母間的連字號拆成兩個字', () => {
    expect(tally(compareWords('A well-known song.', 'a well known song'))).toEqual(PERFECT(4))
  })
})

describe('compareWords：縮寫', () => {
  it("I'm ↔ I am", () => {
    const c = compareWords("I'm fine.", 'I am fine')
    expect(show(c)).toBe('I am fine')
    expect(tally(c)).toEqual(PERFECT(2))
  })

  it("do not ↔ don't", () => {
    expect(tally(compareWords('We do not know.', "We don't know"))).toEqual(PERFECT(4))
  })

  it("can't ↔ cannot", () => {
    expect(tally(compareWords("I can't swim.", 'I cannot swim'))).toEqual(PERFECT(3))
  })

  it("It's ↔ it is", () => {
    expect(tally(compareWords("It's late.", 'it is late'))).toEqual(PERFECT(2))
  })

  it("縮寫只唸到一半（I'm → I）算錯字、不算漏字", () => {
    const c = compareWords("I'm here.", 'I here')
    expect(show(c)).toBe('[wrong:I] here')
    expect(tally(c)).toEqual({
      wrong: 1,
      missing: 0,
      extra: 0,
      correct: 1,
      total: 2,
      perfect: false,
    })
  })

  it('Mr. ↔ Mister、a.m. ↔ am', () => {
    expect(tally(compareWords('Mr. Smith is here.', 'Mister Smith is here'))).toEqual(PERFECT(4))
    expect(tally(compareWords('It opens at 9 a.m.', 'it opens at nine am'))).toEqual(PERFECT(5))
  })
})

describe('compareWords：數字', () => {
  it('2 ↔ two', () => {
    expect(tally(compareWords('I have 2 cats.', 'I have two cats'))).toEqual(PERFECT(4))
  })

  it('21 ↔ twenty-one（送出句拆成兩個字顯示）', () => {
    const c = compareWords('She is 21 years old.', 'She is twenty-one years old')
    expect(show(c)).toBe('She is twenty one years old')
    expect(tally(c)).toEqual(PERFECT(5))
  })

  it('時間 3:30 ↔ three thirty、5:00 ↔ five o’clock', () => {
    expect(
      tally(compareWords('The meeting is at 3:30.', 'The meeting is at three thirty')),
    ).toEqual(PERFECT(5))
    expect(tally(compareWords('Come at 5:00.', "come at five o'clock"))).toEqual(PERFECT(3))
  })

  it('$5 ↔ five dollars、50% ↔ fifty percent', () => {
    expect(tally(compareWords('It costs $5.', 'it costs five dollars'))).toEqual(PERFECT(3))
    expect(
      tally(compareWords('Everything is 50% off.', 'everything is fifty percent off')),
    ).toEqual(PERFECT(4))
  })

  it('序數 1st ↔ first、22nd ↔ twenty-second', () => {
    expect(tally(compareWords('It is May 1st.', 'it is May first'))).toEqual(PERFECT(4))
    expect(tally(compareWords('See you on the 22nd.', 'see you on the twenty-second'))).toEqual(
      PERFECT(5),
    )
  })

  it('小數 3.5 ↔ three point five、千分位 1,000 ↔ one thousand', () => {
    expect(tally(compareWords('It is about 3.5 km.', 'it is about three point five km'))).toEqual(
      PERFECT(5),
    )
    expect(tally(compareWords('1,000 people came.', 'one thousand people came'))).toEqual(
      PERFECT(3),
    )
  })

  it('數字唸錯（15 → 50）算一個錯字', () => {
    const c = compareWords('I need 15 minutes.', 'I need 50 minutes')
    expect(show(c)).toBe('I need [wrong:50] minutes')
    expect(tally(c)).toEqual({
      wrong: 1,
      missing: 0,
      extra: 0,
      correct: 3,
      total: 4,
      perfect: false,
    })
  })
})

describe('compareWords：漏字', () => {
  it('中間漏兩個字，各插一個佔位', () => {
    const c = compareWords('We go to the park on Sunday.', 'We go park on Sunday')
    expect(show(c)).toBe('We go ＿ ＿ park on Sunday')
    expect(tally(c)).toEqual({
      wrong: 0,
      missing: 2,
      extra: 0,
      correct: 5,
      total: 7,
      perfect: false,
    })
  })

  it('什麼都沒唸：全部是漏字、得分 0', () => {
    const c = compareWords('Good morning.', '')
    expect(show(c)).toBe('＿ ＿')
    expect(tally(c)).toEqual({
      wrong: 0,
      missing: 2,
      extra: 0,
      correct: 0,
      total: 2,
      perfect: false,
    })
  })

  it('相近的字優先配對：the meeting ← meetings（the 漏、meeting 錯）', () => {
    const c = compareWords('the meeting', 'meetings')
    expect(show(c)).toBe('＿ [wrong:meetings]')
    expect(tally(c)).toEqual({
      wrong: 1,
      missing: 1,
      extra: 0,
      correct: 0,
      total: 2,
      perfect: false,
    })
  })

  it('相近的字在句首也配得到：book a room ← books（book 錯、a room 漏）', () => {
    const c = compareWords('Book a room.', 'books')
    expect(show(c)).toBe('[wrong:books] ＿ ＿')
    expect(c.target.map((w) => w.mark)).toEqual(['wrong', 'missing', 'missing'])
  })
})

describe('compareWords：多字與錯字', () => {
  it('多唸的字標「多字」，不扣目標字的得分但不算全對', () => {
    const c = compareWords('I like tea.', 'I really like the tea')
    expect(show(c)).toBe('I [extra:really] like [extra:the] tea')
    expect(tally(c)).toEqual({
      wrong: 0,
      missing: 0,
      extra: 2,
      correct: 3,
      total: 3,
      perfect: false,
    })
  })

  it('一個字唸錯（cup → cap）', () => {
    const c = compareWords('I have a cup of tea.', 'I have a cap of tea.')
    expect(show(c)).toBe('I have a [wrong:cap] of tea')
    expect(tally(c)).toEqual({
      wrong: 1,
      missing: 0,
      extra: 0,
      correct: 5,
      total: 6,
      perfect: false,
    })
  })
})
