// 期望原形取自英文文法（不規則動詞表、不規則複數），不從字典資料或實作推得
import { describe, expect, it } from 'vitest'
import { fsDictDeps } from '../test/dictFs'
import { baseForms, lookupWord, type LookupResult } from './lookup'

const deps = fsDictDeps()
const look = (token: string, sentenceStart = false) => lookupWord(token, { sentenceStart }, deps)

const headword = (r: LookupResult) => (r.found ? r.headword : null)

// AC#1：詞形還原（不規則動詞、不規則與規則複數、其他規則變化）
const LEMMA_CASES: [form: string, lemma: string][] = [
  // 不規則動詞
  ['went', 'go'],
  ['gone', 'go'],
  ['took', 'take'],
  ['gave', 'give'],
  ['spoke', 'speak'],
  ['chose', 'choose'],
  ['fell', 'fall'],
  ['caught', 'catch'],
  ['brought', 'bring'],
  ['sang', 'sing'],
  ['drank', 'drink'],
  ['flew', 'fly'],
  ['drove', 'drive'],
  ['ate', 'eat'],
  ['held', 'hold'],
  ['kept', 'keep'],
  ['slept', 'sleep'],
  ['sold', 'sell'],
  ['told', 'tell'],
  ['began', 'begin'],
  ['forgot', 'forget'],
  ['ran', 'run'],
  ['taught', 'teach'],
  ['bought', 'buy'],
  ['swum', 'swim'],
  ['had', 'have'],
  ['has', 'have'],
  ['did', 'do'],
  ['does', 'do'],
  ['was', 'be'],
  ['been', 'be'],
  ['is', 'be'],
  ['were', 'be'],
  ['am', 'be'],
  ['are', 'be'],
  // 不規則複數
  ['children', 'child'],
  ['mice', 'mouse'],
  ['men', 'man'],
  ['women', 'woman'],
  ['teeth', 'tooth'],
  ['feet', 'foot'],
  ['geese', 'goose'],
  ['knives', 'knife'],
  ['wolves', 'wolf'],
  ['halves', 'half'],
  ['oxen', 'ox'],
  ['cacti', 'cactus'],
  ['crises', 'crisis'],
  ['phenomena', 'phenomenon'],
  // 規則複數
  ['babies', 'baby'],
  ['cities', 'city'],
  ['boxes', 'box'],
  ['churches', 'church'],
  ['potatoes', 'potato'],
  ['heroes', 'hero'],
  ['meetings', 'meeting'],
  // 規則動詞與比較級
  ['stopped', 'stop'],
  ['planned', 'plan'],
  ['studying', 'study'],
  ['hoping', 'hope'],
  ['cried', 'cry'],
  ['happier', 'happy'],
  ['biggest', 'big'],
  // 變化形表沒收、靠去字尾規則
  ['emails', 'email'],
  ['texting', 'text'],
]

describe('詞形還原', () => {
  it.each(LEMMA_CASES)('%s → %s', async (form, lemma) => {
    expect(headword(await look(form))).toBe(lemma)
  })

  // AC#4：命中來源統計（大多應由變化形表命中）；明細列進 proposal.md
  it('命中來源：變化形表過半', async () => {
    const counts = { table: 0, rule: 0, self: 0 }
    for (const [form] of LEMMA_CASES) {
      const r = await look(form)
      if (r.found) counts[r.via]++
    }
    console.info(`[lemma-stats] ${LEMMA_CASES.length} 例：${JSON.stringify(counts)}`)
    expect(counts.table).toBeGreaterThan(LEMMA_CASES.length / 2)
  })
})

describe('顯示的詞條', () => {
  it('本身就是常用字的不往原形跳：meeting 不跳 meet、left 不跳 leave', async () => {
    expect(await look('meeting')).toMatchObject({ headword: 'meeting', via: 'self' })
    expect(await look('left')).toMatchObject({ headword: 'left', via: 'self' })
  })

  // 單字總表把 criteria、data 收成獨立詞條（有自己的級距），照本身顯示、不還原
  it('單字總表本身收錄的複數形照本身顯示：criteria、data', async () => {
    expect(await look('criteria')).toMatchObject({ headword: 'criteria', via: 'self' })
    expect(await look('data')).toMatchObject({ headword: 'data', via: 'self' })
  })

  it('變化形帶出原形與查的字（彈層「meetings → 原形 meeting」）', async () => {
    expect(await look('meetings')).toMatchObject({
      found: true,
      query: 'meetings',
      headword: 'meeting',
      via: 'table',
    })
  })

  it('帶音標與一行一個詞性的釋義', async () => {
    const r = await look('meeting')
    expect(r.found && r.entry.phonetic).toBe("'mi:tiŋ")
    expect(r.found && r.entry.lines[0]).toBe('n. 會議, 會面')
  })

  it('去掉前後標點與引號', async () => {
    expect(await look('holiday,')).toMatchObject({ query: 'holiday', headword: 'holiday' })
    expect(await look('"Hello!"', true)).toMatchObject({ query: 'Hello', headword: 'hello' })
  })

  it('縮寫與所有格：don’t → do、She’s → she、students’ → student', async () => {
    expect(headword(await look('don’t'))).toBe('do')
    expect(headword(await look("can't"))).toBe('can')
    expect(headword(await look("won't"))).toBe('will')
    expect(headword(await look("She's", true))).toBe('she')
    expect(headword(await look("students'"))).toBe('student')
  })

  it('句首大寫當一般字查', async () => {
    expect(headword(await look('The', true))).toBe('the')
  })

  // 執行長代決：句中大寫字查無原樣時，只有小寫在單字總表內才退回小寫
  it('句中大寫：March 退回小寫（三月）、Jenny 查無此字（不顯示紡紗機）', async () => {
    const march = await look('March')
    expect(march.found && march.entry.lines[0]).toBe('n. 三月, 進行, 行軍⋯')
    expect(await look('Jenny')).toEqual({ found: false, query: 'Jenny' })
    expect(await look('Jenny,')).toEqual({ found: false, query: 'Jenny' })
  })

  it('查無此字', async () => {
    expect(await look('Xyzzyq')).toEqual({ found: false, query: 'Xyzzyq' })
    expect((await look('123')).found).toBe(false)
  })
})

// 可點英文字的 disabled 原形比對（G2：測驗字的變化形作答前也不可點）
describe('baseForms', () => {
  const forms = async (t: string) => [...(await baseForms(t, deps))].sort()
  it('變化形帶出原形：meetings→meeting、went→go、children→child', async () => {
    expect(await forms('meetings')).toContain('meeting')
    expect(await forms('went')).toContain('go')
    expect(await forms('Children,')).toContain('child')
  })
  it('本身是獨立詞的變化形，也帶出變化形表的原形：left→leave、meeting→meet', async () => {
    expect(await forms('left')).toEqual(expect.arrayContaining(['left', 'leave']))
    expect(await forms('meeting')).toEqual(expect.arrayContaining(['meeting', 'meet']))
  })
  it('be 動詞小表與縮寫：were→be、don’t→do', async () => {
    expect(await forms('were')).toContain('be')
    expect(await forms('don’t')).toContain('do')
  })
})
