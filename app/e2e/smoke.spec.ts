import { expect, test } from '@playwright/test'
import { openWithServiceWorker } from './sw.js'

test('首頁可開、service worker 註冊成功並完成 precache', async ({ page }) => {
  await openWithServiceWorker(page)

  // workbox 以 ?__WB_REVISION__=… 存帶 revision 的項目，比對時忽略 query
  const indexCached = await page.evaluate(
    async () => !!(await caches.match('/index.html', { ignoreSearch: true })),
  )
  expect(indexCached).toBe(true)
})

test('未設定 Supabase 的建置：設定頁沒有登入入口（TASK-20 AC#3）', async ({ page }) => {
  await page.goto('/settings')
  await expect(page.getByTestId('settings-account-slot')).toHaveText('未登入：進度只存在這支手機')
  // 登入入口是動態載入後才出現；等網路靜止再斷言不存在，避免太早判定
  await page.waitForLoadState('networkidle')
  await expect(page.getByTestId('login-entry')).toHaveCount(0)
})

test('離線重新載入仍可開', async ({ page, context, browserName }) => {
  // Playwright 的 WebKit（Windows build）在 setOffline 後 reload 會丟 internal error，
  // 與 app 無關；離線重載只在 chromium 驗
  test.skip(browserName === 'webkit', 'WebKit（Windows build）不支援離線重載模擬')

  await openWithServiceWorker(page)
  await context.setOffline(true)
  await page.reload()
  await expect(page.getByTestId('screen-home')).toBeAttached()
})
