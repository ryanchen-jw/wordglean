import { expect, test, type Page } from '@playwright/test'

const PLACEHOLDER = 'LinguaApp 骨架建置中'

// 開首頁並等 service worker 啟用、接管本頁
async function openWithServiceWorker(page: Page) {
  await page.goto('/')
  // 識別字串：確認打到的是本 checkout 的 app，而不是別人的 server
  await expect(page.getByTestId('app-placeholder')).toHaveText(PLACEHOLDER)

  // ready 在 activating 時就會 resolve，要再等 activated
  const swState = await page.evaluate(async () => {
    const sw = (await navigator.serviceWorker.ready).active!
    if (sw.state !== 'activated') {
      await new Promise((resolve) =>
        sw.addEventListener('statechange', () => sw.state === 'activated' && resolve(null)),
      )
    }
    return sw.state
  })
  expect(swState).toBe('activated')
  await page.waitForFunction(() => navigator.serviceWorker.controller !== null)
}

test('佔位頁可開、service worker 註冊成功並完成 precache', async ({ page }) => {
  await openWithServiceWorker(page)

  // workbox 以 ?__WB_REVISION__=… 存帶 revision 的項目，比對時忽略 query
  const indexCached = await page.evaluate(
    async () => !!(await caches.match('/index.html', { ignoreSearch: true })),
  )
  expect(indexCached).toBe(true)
})

test('離線重新載入仍可開', async ({ page, context, browserName }) => {
  // Playwright 的 WebKit（Windows build）在 setOffline 後 reload 會丟 internal error，
  // 與 app 無關；離線重載只在 chromium 驗
  test.skip(browserName === 'webkit', 'WebKit（Windows build）不支援離線重載模擬')

  await openWithServiceWorker(page)
  await context.setOffline(true)
  await page.reload()
  await expect(page.getByTestId('app-placeholder')).toHaveText(PLACEHOLDER)
})
