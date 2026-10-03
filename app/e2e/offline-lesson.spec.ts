// TASK-22 離線全流程：裝好（service worker 預快取完成）之後斷網，從首頁開始今天的學習、完成一課、
// 首頁更新為今天完成，重新載入後進度仍在（存在 IndexedDB）。題目為樣本課 fixture（playwright.config.ts 的 VITE_ITEM_FIXTURES）
import { expect, test } from '@playwright/test'
import { LESSON } from './lesson.js'
import { openWithServiceWorker } from './sw.js'
import { playLesson } from './today.js'

test('斷網後從首頁上完一課，首頁顯示今天完成，重新載入仍在', async ({
  page,
  context,
  browserName,
}) => {
  // Playwright 的 WebKit（Windows build）在 setOffline 後導覽會丟 internal error（app/CLAUDE.md 已知限制）
  test.skip(browserName === 'webkit', 'WebKit（Windows build）不支援離線導覽模擬')
  test.setTimeout(90_000)
  await page.addInitScript(() => localStorage.setItem('lg.installDismissed', '1'))
  await openWithServiceWorker(page)

  await context.setOffline(true)
  await page.goto('/')
  await expect(page.getByText('目前離線：複習與已下載的課程仍可使用')).toBeVisible()
  // 第一次開啟：離線也能略過分級（課程地圖的課綱檔已預快取）
  await page.getByRole('button', { name: '跳過，從 A1 開始' }).click()
  await expect(page.getByRole('button', { name: /基礎常用字（一）/ })).toBeVisible()
  await page.getByRole('link', { name: '今天' }).click()
  await page.getByRole('button', { name: '開始今天的學習' }).click()
  await expect(page).toHaveURL(new RegExp(`/lesson/${LESSON}$`))
  await playLesson(page, LESSON)
  await page.getByTestId('lesson-done').getByRole('button', { name: '回到今天' }).click()
  const home = page.getByTestId('screen-home')
  await expect(home).toHaveAttribute('data-state', 'done')

  await page.reload()
  await expect(home).toHaveAttribute('data-state', 'done')
  await expect(page.getByText('新課 1／1')).toBeVisible()
  await page.goto('/words')
  await expect(page.getByTestId('word-list').locator('[lang="en"]')).toHaveCount(8)
})
