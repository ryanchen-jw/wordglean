import { describe, expect, it } from 'vitest'
import messages from './zh-TW.json'
import { t } from './t'

// 允許出現在介面文案中的英文字（產品名、服務名、級距、單位）
const ALLOWED_LATIN = new Set([
  'LinguaApp',
  'OpenRouter',
  'A1',
  'A2',
  'B1',
  'B2',
  'C1',
  'MB',
  'WebGPU',
  'AI',
  'Safari',
])

function allStrings(node: unknown, path = ''): [string, string][] {
  if (typeof node === 'string') return [[path, node]]
  return Object.entries(node as Record<string, unknown>).flatMap(([k, v]) =>
    allStrings(v, path ? `${path}.${k}` : k),
  )
}

describe('t()', () => {
  it('依 key 取出 json 文案', () => {
    expect(t('nav.bar.today')).toBe('今天')
    expect(t('system.offline.strip')).toBe('目前離線：複習與已下載的課程仍可使用')
  })

  it('以 params 替換 {name}（同名參數全部替換），未提供的參數保留原樣', () => {
    expect(t('home.progress.reviews', { done: 0, total: 24 })).toBe('複習 0／24')
    expect(t('home.paused.body', { n: 100 })).toBe('待複習超過 100 個，降回 100 以下會自動恢復')
    expect(t('home.progress.reviews', { done: 3 })).toBe('複習 3／{total}')
  })
})

describe('zh-TW.json', () => {
  it('頂層標記為草稿、待 G3 審定', () => {
    expect(messages._status).toBe('draft-pending-G3')
  })

  it('除允許清單外沒有英文介面字串', () => {
    const offenders = allStrings(messages)
      .filter(([path]) => path !== '_status')
      .flatMap(([path, text]) =>
        (text.replace(/\{\w+\}/g, '').match(/[A-Za-z][A-Za-z0-9]*/g) ?? [])
          .filter((w) => !ALLOWED_LATIN.has(w))
          .map((w) => `${path}: ${w}`),
      )
    expect(offenders).toEqual([])
  })

  it('key 遵守 <畫面>.<區塊>.<用途> 三層', () => {
    const bad = allStrings(messages)
      .map(([path]) => path)
      .filter((p) => p !== '_status' && p.split('.').length !== 3)
    expect(bad).toEqual([])
  })
})
