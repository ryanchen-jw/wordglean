import { describe, expect, it } from 'vitest'
import messages from './zh-TW.json'
import { t } from './t'

// 允許出現在介面文案中的英文字（產品名、服務名、級距、單位）
const ALLOWED_LATIN = new Set([
  'LinguaApp',
  'OpenRouter',
  // 多益對照出處（TASK-17 結果頁「僅供參考」）
  'ETS',
  'CEFR',
  'A1',
  'A2',
  'B1',
  'B2',
  'C1',
  'ECDICT', // 字典彈層「資料來源：ECDICT」（設計 s08）
  'MB',
  'WebGPU',
  'AI',
  'Safari',
  // TASK-4 G3 定稿文案中的英文字
  'App',
  'Email',
  'Google',
  'ECDICT',
  'Wi',
  'Fi',
  'sk',
  'or',
  // TASK-21 隱私說明、授權頁：授權名、服務名、檔名
  'AGPL',
  'Supabase',
  'Hugging',
  'Face',
  'NOTICE',
])

// credits＝授權與致謝頁的出處條目（來源名、授權名、著作權行），依原文保留、不翻譯，不受英文字串檢查
const ATTRIBUTION_REGION = 'credits.'

// 底線開頭（_status、_pendingG3）是中繼欄位，不是文案
function allStrings(node: unknown, path = ''): [string, string][] {
  if (typeof node === 'string') return [[path, node]]
  return Object.entries(node as Record<string, unknown>)
    .filter(([k]) => !k.startsWith('_'))
    .flatMap(([k, v]) => allStrings(v, path ? `${path}.${k}` : k))
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
  it('頂層標記為 G3 第二輪定稿；沒有待審 key（_pendingG3）', () => {
    expect(messages._status).toBe('approved-CEO-G3r2-2026-10-03')
    expect('_pendingG3' in messages).toBe(false)
  })

  it('除允許清單外沒有英文介面字串', () => {
    const offenders = allStrings(messages)
      .filter(([path]) => !path.startsWith(ATTRIBUTION_REGION))
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
      .filter((p) => p.split('.').length !== 3)
    expect(bad).toEqual([])
  })
})
