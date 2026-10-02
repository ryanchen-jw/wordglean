// TASK-17 走查 P1：分級測驗字卡
// P1-1 勾選中的字卡底色＝primary-soft、未勾選＝surface（淺／深兩色系，computed 比對 token）
// P1-2 字卡內英文不得斷字、不得溢出：題本換成「各級最長的字」，各寬度／字級逐組檢查
import { expect, test, type Page } from '@playwright/test'
import { BANK } from './placementHelpers.js'

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('lg.installDismissed', '1'))
})

/** 以 CSS 變數算出的實際顏色 */
const tokenColor = (page: Page, name: string) =>
  page.evaluate((n) => {
    const probe = document.createElement('div')
    probe.style.background = `var(${n})`
    document.body.append(probe)
    const c = getComputedStyle(probe).backgroundColor
    probe.remove()
    return c
  }, name)

for (const scheme of ['light', 'dark'] as const) {
  test(`P1-1 字卡底色（${scheme}）：勾選＝primary-soft、未勾選＝surface`, async ({ page }) => {
    await page.emulateMedia({ colorScheme: scheme })
    await page.goto('/placement')
    const boxes = page.getByRole('checkbox')
    await expect(boxes).toHaveCount(12)
    await boxes.nth(0).click()
    await expect(boxes.nth(0)).toHaveAttribute('aria-checked', 'true')
    const bg = (i: number) => boxes.nth(i).evaluate((el) => getComputedStyle(el).backgroundColor)
    const soft = await tokenColor(page, '--lg-primary-soft')
    const surface = await tokenColor(page, '--lg-surface')
    expect(soft).not.toBe(surface)
    expect(await bg(0), '勾選中').toBe(soft)
    expect(await bg(1), '未勾選').toBe(surface)
  })
}

// 每級最長的 10 個字＋最長的 10 個假字 → 整份測驗都是長字
const longest = (words: string[]) => [...words].sort((a, b) => b.length - a.length).slice(0, 10)
const LONG_BANK = {
  ...BANK,
  levels: Object.fromEntries(Object.entries(BANK.levels).map(([l, w]) => [l, longest(w)])),
  pseudowords: longest(BANK.pseudowords),
}

const VIEWPORTS = [
  { name: '320-md', width: 320, height: 640, textSize: null },
  { name: '375-md', width: 375, height: 812, textSize: null },
  { name: '393-md', width: 393, height: 852, textSize: null },
  { name: '412-md', width: 412, height: 915, textSize: null },
  { name: '320-xl', width: 320, height: 640, textSize: 'xl' },
  { name: '375-xl', width: 375, height: 812, textSize: 'xl' },
] as const

test('P1-2 長字不斷字、不溢出（最長字題本 × 六種寬度／字級，五組全查）', async ({ page }) => {
  test.setTimeout(120_000)
  await page.route('**/placement*.json', (route) => route.fulfill({ json: LONG_BANK }))
  const problems: string[] = []
  for (const v of VIEWPORTS) {
    await page.setViewportSize({ width: v.width, height: v.height })
    // 字級偏好在載入時套用：先進站寫入，再重新載入
    await page.goto('/placement')
    await page.evaluate((size) => {
      if (size) localStorage.setItem('lg.textSize', size)
      else localStorage.removeItem('lg.textSize')
    }, v.textSize)
    await page.reload()
    for (let g = 1; g <= 5; g++) {
      await expect(page.getByText(`第 ${g}／5 組`)).toBeVisible()
      const found = await page.evaluate(() => {
        const out: string[] = []
        for (const box of document.querySelectorAll('[role=checkbox]')) {
          const word = box.querySelector('[lang=en]')!
          const range = document.createRange()
          range.selectNodeContents(word)
          const lines = new Set([...range.getClientRects()].map((r) => Math.round(r.top))).size
          const cs = getComputedStyle(box)
          const innerRight =
            box.getBoundingClientRect().right -
            parseFloat(cs.paddingRight) -
            parseFloat(cs.borderRightWidth)
          const w = range.getBoundingClientRect()
          if (lines !== 1) out.push(`${word.textContent} 折成 ${lines} 行`)
          if (w.right > innerRight + 0.5)
            out.push(`${word.textContent} 超出字卡內緣 ${(w.right - innerRight).toFixed(1)}px`)
        }
        return out
      })
      problems.push(...found.map((p) => `${v.name} 第${g}組：${p}`))
      await page.getByRole('button', { name: g < 5 ? /^下一組/ : /^看結果/ }).click()
    }
  }
  expect(problems).toEqual([])
})
