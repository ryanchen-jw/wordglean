// TASK-21 視覺 smoke（harness 06）：設定 →「隱私說明・授權・原始碼」→ 隱私說明／授權與致謝，兩個手機引擎＋320 特大字級＋深色。
// 每頁整頁截圖 attach＋具名檔存 test-results/（gitignored），斷言 06 三件套＋英文介面字串＋body 色＋main 子元素不溢出。
// 授權頁的出處條目（zh-TW.json credits：來源名、授權名、著作權行）依原文保留，其中的英文字放行；其餘英文仍照共用白名單。
// 資料：無 mock（頁面內容全為靜態文案，量級＝正式內容）
import { readFileSync } from 'node:fs'
import { writeFile } from 'node:fs/promises'
import { expect, test, type Page, type TestInfo } from '@playwright/test'
import { measureMobile, overflowingChildren } from './measure.js'

const messages = JSON.parse(readFileSync('src/i18n/zh-TW.json', 'utf8')) as {
  credits: Record<string, Record<string, string>>
}
const CREDIT_WORDS = new Set(
  Object.values(messages.credits)
    .flatMap((c) => Object.values(c))
    .flatMap((s) => s.match(/[A-Za-z][A-Za-z0-9]*/g) ?? []),
)

const PAGES = [
  { name: 'about', path: '/about', title: '隱私說明・授權・原始碼', testid: 'screen-about' },
  { name: 'privacy', path: '/about/privacy', title: '隱私說明', testid: 'screen-privacy' },
  { name: 'licenses', path: '/about/licenses', title: '授權與致謝', testid: 'screen-licenses' },
] as const

async function check(page: Page, info: TestInfo, name: string) {
  const shot = await page.screenshot({ fullPage: true })
  await info.attach(name, { body: shot, contentType: 'image/png' })
  await writeFile(info.outputPath(`${info.project.name}-${name}.png`), shot)
  const m = await measureMobile(page)
  expect.soft(m.overflow, `${name}：橫向溢出`).toEqual([])
  expect.soft(m.wrapped, `${name}：單行控件折行`).toEqual([])
  expect.soft(m.small, `${name}：可點目標 <44px`).toEqual([])
  expect
    .soft(
      m.latin.filter((w) => !CREDIT_WORDS.has(w)),
      `${name}：英文介面字串`,
    )
    .toEqual([])
  expect.soft(m.bodyColors, `${name}：body 未套 token 色`).toEqual([])
  expect.soft(await overflowingChildren(page, 'main'), `${name}：main 子元素溢出`).toEqual([])
}

async function open(page: Page, p: (typeof PAGES)[number]) {
  await page.goto(p.path)
  await expect(page.getByTestId(p.testid)).toBeAttached()
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(p.title)
}

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('lg.installDismissed', '1'))
})

test('從設定頁點進「隱私說明・授權・原始碼」，再進兩個子頁', async ({ page }, info) => {
  await page.goto('/settings')
  await page.getByRole('button', { name: '隱私說明・授權・原始碼' }).click()
  await expect(page).toHaveURL(/\/about$/)
  // e2e 建置沒設 VITE_SOURCE_URL：只有授權說明、沒有原始碼連結（有值時的連結由 AboutScreen.test.tsx 驗）
  await expect(page.getByRole('link', { name: '查看原始碼' })).toHaveCount(0)
  await check(page, info, 'about')
  await page.getByRole('button', { name: '隱私說明' }).click()
  await expect(page).toHaveURL(/\/about\/privacy$/)
  await expect(page.getByText(/不具法律效力/)).toBeVisible()
  await check(page, info, 'privacy')
  await page.getByRole('button', { name: '返回' }).click()
  await page.getByRole('button', { name: '授權與致謝' }).click()
  await expect(page).toHaveURL(/\/about\/licenses$/)
  // 頁面條目數＝NOTICE 條目數（逐條比對在單元測試 LicensesScreen.test.tsx）
  await expect(page.getByTestId('credit-name')).toHaveCount(30)
  await check(page, info, 'licenses')
})

test.describe('320 寬・特大字級', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 640 })
    await page.addInitScript(() => localStorage.setItem('lg.textSize', 'xl'))
  })
  for (const p of PAGES)
    test(p.name, async ({ page }, info) => {
      await open(page, p)
      await check(page, info, `${p.name}-320-xl`)
    })
})

test.describe('深色', () => {
  test.use({ colorScheme: 'dark' })
  for (const p of PAGES)
    test(p.name, async ({ page }, info) => {
      await open(page, p)
      await check(page, info, `${p.name}-dark`)
    })
})
