// 手機版量測（harness 06 三件套＋介面字串）：一般 e2e、視覺 smoke、e2e-sync 共用同一套量法，避免標準不一
import type { Page } from '@playwright/test'

// 允許出現在介面文字中的英文（產品名、服務名、級距、單位）；英文學習內容以 lang="en" 標示、不掃
export const ALLOWED_LATIN = [
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
  // 選項字母標（components.md §3、設計 s05／s07）
  'A',
  'B',
  'C',
  'D',
]

export interface MobileMetrics {
  /** 文件與可橫捲容器的橫向溢出 */
  overflow: string[]
  /** 標為單行的控件（按鈕、分頁、選項、導覽）文字排成多行 */
  wrapped: string[]
  /** 可點目標小於 44×44 */
  small: string[]
  /** 白名單以外的英文介面字串 */
  latin: string[]
  /** body 背景／文字色不等於當下色系 token */
  bodyColors: string[]
}

export function measureMobile(page: Page): Promise<MobileMetrics> {
  return page.evaluate((allowed) => {
    const visible = (el: Element) => {
      const b = el.getBoundingClientRect()
      const cs = getComputedStyle(el)
      return b.width > 1 && b.height > 1 && cs.visibility !== 'hidden' && cs.display !== 'none'
    }
    const label = (el: Element) =>
      (el.textContent || el.getAttribute('aria-label') || '').trim().slice(0, 20)

    // (a) 文件與每個可橫捲容器沒有橫向溢出
    const overflow: string[] = []
    const de = document.documentElement
    if (de.scrollWidth - de.clientWidth > 0)
      overflow.push(`document +${de.scrollWidth - de.clientWidth}`)
    for (const el of document.querySelectorAll('*')) {
      const ox = getComputedStyle(el).overflowX
      if ((ox === 'auto' || ox === 'scroll') && el.scrollWidth - el.clientWidth > 0)
        overflow.push(`${el.tagName}.${el.className} +${el.scrollWidth - el.clientWidth}`)
    }

    // (b) 單行控件的文字只排一行：只數文字節點的排版行（圖示 svg 與文字的基線不同，不算行），
    //     行與行的間距需大於字級 0.6 倍才算新行（容差：同一行內中英混排的 top 會差幾 px）。
    //     標 data-multiline 的控件允許折行（例：文案未定稿、窄螢幕特大字級需折行的主要按鈕）
    const wrapped: string[] = []
    for (const el of document.querySelectorAll('button, [role=tab], [role=option], nav a')) {
      if (!visible(el) || el.closest('[data-multiline]')) continue
      const fontSize = parseFloat(getComputedStyle(el).fontSize)
      const tops: number[] = []
      const tw = document.createTreeWalker(el, NodeFilter.SHOW_TEXT)
      for (let n = tw.nextNode(); n; n = tw.nextNode()) {
        if (!n.textContent?.trim()) continue
        const range = document.createRange()
        range.selectNodeContents(n)
        for (const rect of range.getClientRects()) if (rect.height > 0) tops.push(rect.top)
      }
      tops.sort((a, b) => a - b)
      const lines = tops.filter((top, i) => i === 0 || top - tops[i - 1] > fontSize * 0.6).length
      if (lines > 1) wrapped.push(`${label(el)} 行數=${lines}`)
    }

    // (c) 可點目標 ≥44×44（行內英文字屬 WCAG 2.5.8 例外，目前沒有）
    const small: string[] = []
    for (const el of document.querySelectorAll('button, a, [role=tab], [role=option], label')) {
      if (!visible(el)) continue
      // 只有包住控制項的 label 才是觸控目標（如勾選列）；<label for> 欄位標題的目標是輸入框本身
      if (el.tagName === 'LABEL' && !el.querySelector('input, select, textarea')) continue
      const b = el.getBoundingClientRect()
      if (b.height < 44 || b.width < 44)
        small.push(`${label(el)} ${b.width.toFixed(0)}×${b.height.toFixed(0)}`)
    }

    // 英文介面字串（含 aria-label、placeholder）
    const latin: string[] = []
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT)
    for (let n = walker.nextNode(); n; n = walker.nextNode()) {
      const p = n.parentElement
      if (!p || p.closest('[lang="en"], script, style') || !visible(p)) continue
      for (const w of n.textContent?.match(/[A-Za-z][A-Za-z0-9]*/g) ?? [])
        if (!allowed.includes(w)) latin.push(w)
    }
    for (const el of document.querySelectorAll('[aria-label], [placeholder]'))
      for (const v of [el.getAttribute('aria-label'), el.getAttribute('placeholder')])
        for (const w of v?.match(/[A-Za-z][A-Za-z0-9]*/g) ?? [])
          if (!allowed.includes(w) && !el.closest('[lang="en"]')) latin.push(w)

    // body 的背景與文字色＝當下色系的 token
    const probe = document.createElement('div')
    probe.style.cssText = 'background:var(--lg-bg);color:var(--lg-text)'
    document.body.append(probe)
    const want = getComputedStyle(probe)
    const got = getComputedStyle(document.body)
    const bodyColors =
      got.backgroundColor === want.backgroundColor && got.color === want.color
        ? []
        : [`body ${got.backgroundColor}/${got.color} ≠ token ${want.backgroundColor}/${want.color}`]
    probe.remove()
    return { overflow, wrapped, small, latin, bodyColors }
  }, ALLOWED_LATIN)
}

/**
 * 容器內所有子孫元素的右緣不得超出容器內容區右緣（容差 1px）。
 * 補 measureMobile 的缺口：document 沒溢出時，子元素仍可能伸出卡片框（例：grid 隱含欄被最小內容寬撐大）
 */
export function overflowingChildren(page: Page, containerSelector: string): Promise<string[]> {
  return page.evaluate((sel) => {
    const box = document.querySelector(sel)
    if (!box) return [`找不到容器 ${sel}`]
    const cs = getComputedStyle(box)
    const r = box.getBoundingClientRect()
    const innerRight = r.right - parseFloat(cs.borderRightWidth) - parseFloat(cs.paddingRight)
    const out: string[] = []
    for (const el of box.querySelectorAll('*')) {
      const b = el.getBoundingClientRect()
      if (b.width === 0) continue
      if (b.right > innerRight + 1)
        out.push(
          `${el.tagName.toLowerCase()} 「${(el.textContent ?? '').trim().slice(0, 12)}」 +${(b.right - innerRight).toFixed(1)}px`,
        )
    }
    return out
  }, containerSelector)
}
