// AC#4：首次開啟 → 首頁 → 單字庫 → 設定（兩個手機引擎）
import { expect, test } from '@playwright/test'

test('首次開啟到首頁、單字庫、設定，返回首頁', async ({ page }) => {
  await page.goto('/')
  const home = page.getByTestId('screen-home')
  await expect(home).toHaveAttribute('data-state', 'first')
  await expect(page.getByText('先花 5 分鐘找出你的起點')).toBeVisible()
  await expect(page.getByText('還沒有分級')).toBeVisible()

  const nav = page.getByRole('navigation', { name: '主要導覽' })
  await nav.getByRole('link', { name: '單字庫' }).click()
  await expect(page).toHaveURL(/\/words$/)
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('單字庫')
  await expect(page.getByText('單字庫還是空的')).toBeVisible()
  await expect(nav.getByRole('link', { name: '單字庫' })).toHaveAttribute('aria-current', 'page')

  await nav.getByRole('link', { name: '今天' }).click()
  await expect(home).toBeAttached()
  await page.getByRole('link', { name: '設定' }).click()
  await expect(page).toHaveURL(/\/settings$/)
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('設定')
  await expect(page.getByRole('button', { name: /每日新字數\s*10/ })).toBeVisible()
  await expect(page.getByTestId('settings-account-slot')).toHaveText('未登入：進度只存在這支手機')
  await expect(nav).toHaveCount(0)

  await page.getByRole('button', { name: '返回' }).click()
  await expect(page).toHaveURL(/\/$/)
  await expect(home).toBeAttached()
})
