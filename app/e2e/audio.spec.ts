// TASK-35 AC#5：預產音檔按需載入——首次開啟不下載任何音檔包、service worker 預快取清單不含音檔包；
// 進入小課只抓這一課的包；抓過的包斷網後仍可播（題目與音檔為樣本課 fixture）
import { expect, test } from '@playwright/test'
import { LESSON } from './lesson.js'
import { fakeSystemVoice, lastSpoken } from './speech.js'
import { openWithServiceWorker } from './sw.js'

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('lg.installDismissed', '1'))
  await fakeSystemVoice(page)
})

test('首次開啟不下載音檔包；預快取清單不含音檔包；進課只抓這一課的包', async ({ page }) => {
  const packs: string[] = []
  page.on('request', (r) => {
    if (new URL(r.url()).pathname.endsWith('.lga')) packs.push(r.url())
  })
  await openWithServiceWorker(page)
  const sw = await page.evaluate(async () => (await fetch('/sw.js')).text())
  // 預快取清單＝precacheAndRoute 的 {url, revision} 項目；sw.js 內 runtimeCaching 的 .lga 比對規則不算
  const precached = [...sw.matchAll(/url:"([^"]+)"/g)].map((m) => m[1])
  expect(precached).toContain('index.html')
  expect(precached.length).toBeGreaterThan(100)
  expect(precached.filter((u) => u.endsWith('.lga'))).toEqual([])
  expect(packs).toEqual([])

  await page.goto(`/lesson/${LESSON}`)
  await page.getByRole('button', { name: '發音' }).click()
  await expect.poll(() => lastSpoken(page)).toMatchObject({ engine: 'clip', text: 'the' })
  expect(packs).toHaveLength(1)
  expect(packs[0]).toMatch(new RegExp(`/assets/${LESSON}-[^/]+\\.lga$`))
})

test('抓過的課，斷網後仍播預產音檔', async ({ page, context, browserName }) => {
  // Playwright 的 WebKit（Windows build）在 setOffline 後導覽會丟 internal error（app/CLAUDE.md 已知限制）
  test.skip(browserName === 'webkit', 'WebKit（Windows build）不支援離線導覽模擬')
  await openWithServiceWorker(page)
  await page.goto(`/lesson/${LESSON}`)
  await page.getByRole('button', { name: '發音' }).click()
  await expect.poll(() => lastSpoken(page)).toMatchObject({ engine: 'clip', text: 'the' })
  // 等 service worker 的 runtimeCaching 把包存進 lg-audio
  await expect
    .poll(() => page.evaluate(async () => (await (await caches.open('lg-audio')).keys()).length))
    .toBe(1)

  await context.setOffline(true)
  await page.reload()
  await page.getByRole('button', { name: '發音' }).click()
  await expect.poll(() => lastSpoken(page)).toMatchObject({ engine: 'clip', text: 'the' })
})
