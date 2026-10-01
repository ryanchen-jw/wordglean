import { expect, type Page } from '@playwright/test'

// 開首頁並等 service worker 啟用、接管本頁
export async function openWithServiceWorker(page: Page) {
  await page.goto('/')
  // 識別字串：確認打到的是本 checkout 的 app，而不是別人的 server
  await expect(page.getByTestId('screen-home')).toBeAttached()

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
