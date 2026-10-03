// 顯示層大小寫（TASK-22 移交①）：題庫 word／單字池 wordId 是課綱小寫 headword，畫面要顯示英文原本的寫法
import { readdirSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'
import { displayWord } from './displayCase'

describe('displayWord', () => {
  it('代名詞 I、月份、星期、縮寫、連字號字還原大寫', () => {
    expect(
      ['i', 'tv', 't-shirt', 'monday', 'january', 'mr.', 'id card', 'ph'].map(displayWord),
    ).toEqual(['I', 'TV', 'T-shirt', 'Monday', 'January', 'Mr.', 'ID card', 'pH'])
  })

  it('一般字與大小寫有歧義的字（may／May、march／March、it／IT、miss／Miss）維持原樣', () => {
    expect(['the', 'have', 'may', 'march', 'it', 'miss'].map(displayWord)).toEqual([
      'the',
      'have',
      'may',
      'march',
      'it',
      'miss',
    ])
  })

  // 對照表手寫在程式碼裡（data/ 不得內嵌進 bundle）：以單字總表原形逐字核對，課綱改版時這裡會紅
  it('與單字總表一致：課綱裡原形唯一且不是全小寫的字都在表內，其餘不在', () => {
    const root = resolve(import.meta.dirname, '../../..')
    const lex = JSON.parse(readFileSync(resolve(root, 'data/lexicon/lexicon.json'), 'utf-8')) as {
      headword: string
    }[]
    const forms = new Map<string, Set<string>>()
    for (const { headword } of lex) {
      const k = headword.toLowerCase()
      if (!forms.has(k)) forms.set(k, new Set())
      forms.get(k)!.add(headword)
    }
    const dir = resolve(root, 'content/curriculum')
    const words = new Set<string>()
    for (const f of readdirSync(dir).filter((f) => /^[abc][12]\.json$/.test(f)))
      for (const u of JSON.parse(readFileSync(resolve(dir, f), 'utf-8')).units as {
        lessons: { words: string[] }[]
      }[])
        for (const l of u.lessons) for (const w of l.words) words.add(w)
    const want = new Map<string, string>()
    for (const w of words) {
      const f = [...(forms.get(w) ?? [])]
      if (f.length === 1 && f[0] !== w) want.set(w, f[0])
    }
    expect(want.size).toBeGreaterThan(0)
    for (const w of words) expect([w, displayWord(w)]).toEqual([w, want.get(w) ?? w])
  })
})
