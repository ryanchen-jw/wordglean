/// <reference types="node" />
import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

// Vitest 預設把 CSS 匯入清成空字串（含 ?raw），jsdom 下 import.meta.url 也不是 file:，所以從 app/ 根目錄讀檔
const css = readFileSync('src/design/tokens.css', 'utf8')

// WCAG 2.x 相對亮度與對比（https://www.w3.org/TR/WCAG22/#dfn-contrast-ratio）
function luminance(hex: string): number {
  const h = hex.replace('#', '')
  const [r, g, b] = [0, 2, 4].map((i) => {
    const c = parseInt(h.slice(i, i + 2), 16) / 255
    return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
  })
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

function contrast(a: string, b: string): number {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x)
  return (hi + 0.05) / (lo + 0.05)
}

// 取出某個選擇器區塊裡的 --lg-* 色碼
function block(selector: string): Record<string, string> {
  const start = css.indexOf(selector + ' {')
  if (start < 0) throw new Error(`tokens.css 找不到區塊：${selector}`)
  const body = css.slice(start, css.indexOf('}', start))
  const out: Record<string, string> = {}
  for (const m of body.matchAll(/--lg-([\w-]+):\s*(#[0-9a-fA-F]{6})\b/g)) out[m[1]] = m[2]
  return out
}

const light = block(':root')
const dark = block(":root[data-theme='dark']")
const darkBySystem = block(":root:not([data-theme='light'])")

// 一般文字 4.5、非文字 UI 元件（輸入框邊界、焦點框、進度條）3.0：WCAG 2.2 AA 1.4.3／1.4.11
const TEXT = 4.5
const UI = 3

const PAIRS: [fg: string, bg: string, min: number][] = [
  ['text', 'bg', TEXT],
  ['text', 'surface', TEXT],
  ['text', 'primary-soft', TEXT],
  ['muted', 'bg', TEXT],
  ['muted', 'surface', TEXT],
  ['muted', 'primary-soft', TEXT],
  ['primary', 'bg', TEXT],
  ['primary', 'surface', TEXT],
  ['primary', 'primary-soft', TEXT],
  ['on-primary', 'primary', TEXT],
  ['correct', 'correct-bg', TEXT],
  ['error', 'error-bg', TEXT],
  ['hint', 'hint-bg', TEXT],
  ['correct', 'surface', TEXT],
  ['error', 'surface', TEXT],
  ['hint', 'surface', TEXT],
  ['border', 'surface', UI],
  ['border', 'bg', UI],
  ['focus', 'bg', UI],
  ['focus', 'surface', UI],
]

describe('contrast()', () => {
  it('黑對白是 21:1', () => {
    expect(contrast('#000000', '#ffffff')).toBeCloseTo(21, 5)
  })
  it('#777777 對白約 4.48（WebAIM 已知值，未達 4.5）', () => {
    expect(contrast('#777777', '#FFFFFF')).toBeCloseTo(4.48, 2)
  })
})

describe('tokens.css 色彩組合全部通過 WCAG AA', () => {
  for (const [mode, pal] of [
    ['淺色', light],
    ['深色', dark],
  ] as const) {
    for (const [fg, bg, min] of PAIRS) {
      it(`${mode}：${fg} 對 ${bg} ≥ ${min}`, () => {
        expect(pal[fg], `缺 --lg-${fg}`).toBeDefined()
        expect(pal[bg], `缺 --lg-${bg}`).toBeDefined()
        expect(contrast(pal[fg], pal[bg])).toBeGreaterThanOrEqual(min)
      })
    }
  }

  it('跟隨系統的深色與手動深色是同一組色碼', () => {
    expect(darkBySystem).toEqual(dark)
  })
})
