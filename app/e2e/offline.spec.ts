// AC#3：關網後重開可進入首頁與單字庫（另驗課程地圖的課綱檔已預快取）
import { expect, test } from '@playwright/test'
import { openWithServiceWorker } from './sw.js'

test('離線重開：首頁、單字庫、課程地圖都可進入，首頁顯示離線提示', async ({
  page,
  context,
  browserName,
}) => {
  // Playwright 的 WebKit（Windows build）在 setOffline 後導覽會丟 internal error，
  // 與 app 無關；離線只在 chromium 驗（webkit 列為未驗）
  test.skip(browserName === 'webkit', 'WebKit（Windows build）不支援離線導覽模擬')

  await openWithServiceWorker(page)
  // 本機已有一個學過的字（直接寫 IndexedDB，結構同 data/db.ts v1）
  await page.evaluate(async () => {
    const db = await new Promise<IDBDatabase>((res, rej) => {
      const r = indexedDB.open('linguaapp')
      r.onsuccess = () => res(r.result)
      r.onerror = () => rej(r.error)
    })
    const tx = db.transaction('wordPool', 'readwrite')
    tx.objectStore('wordPool').put({
      wordId: 'meeting',
      state: 2,
      due: Date.now() + 3 * 86_400_000,
      stability: 5,
      difficulty: 5,
      scheduledDays: 3,
      learningSteps: 0,
      reps: 2,
      lapses: 0,
      lastReview: null,
      courseRefs: [],
      favoritedAt: null,
      addedAt: 0,
    })
    await new Promise((r) => (tx.oncomplete = r))
    db.close()
  })

  await context.setOffline(true)

  await page.goto('/')
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('今天')
  await expect(page.getByText('目前離線：複習與已下載的課程仍可使用')).toBeVisible()

  await page.goto('/words')
  await expect(page.getByTestId('screen-words')).toBeAttached()
  await expect(page.getByText('meeting')).toBeVisible()
  await expect(page.getByText('3 天後')).toBeVisible()

  await page.goto('/course')
  await expect(page.getByRole('button', { name: /基礎常用字（一）/ })).toBeVisible()
})
