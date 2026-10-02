// TASK-16 字典：AC#2 點字→彈層→收藏→單字庫出現（兩引擎）、離線查從未載入過的切片（chromium）、
// AC#3 彈層開啟延遲（chromium，字典已快取）。課程字表取自真課綱 content/curriculum/a1.json（a1-u01-l01）
import { writeFile } from 'node:fs/promises'
import { expect, test, type Page } from '@playwright/test'
import { openWithServiceWorker } from './sw.js'

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('lg.installDismissed', '1'))
})

// 直接寫 IndexedDB（結構同 data/db.ts）；先等 App 建好資料庫
async function seedWords(page: Page, words: string[]) {
  await page.waitForFunction(async () =>
    (await indexedDB.databases()).some((d) => d.name === 'linguaapp'),
  )
  await page.evaluate(async (words) => {
    const db = await new Promise<IDBDatabase>((res, rej) => {
      const r = indexedDB.open('linguaapp')
      r.onsuccess = () => res(r.result)
      r.onerror = () => rej(r.error)
    })
    const tx = db.transaction('wordPool', 'readwrite')
    words.forEach((wordId, i) =>
      tx.objectStore('wordPool').put({
        wordId,
        state: 2,
        due: Date.now() + (i + 1) * 86_400_000,
        stability: 5,
        difficulty: 5,
        scheduledDays: 3,
        learningSteps: 0,
        reps: 2,
        lapses: 0,
        lastReview: null,
        courseRefs: ['a1-u01-l01'],
        favoritedAt: null,
        addedAt: i,
      }),
    )
    await new Promise((r) => (tx.oncomplete = r))
    db.close()
  }, words)
}

test('AC#2：課程詳情點字→彈層→收藏→單字庫出現（有星號）', async ({ page }) => {
  await page.goto('/course')
  await expect(page.getByTestId('screen-course')).toBeVisible()
  await page
    .getByRole('button', { name: /第 1 課/ })
    .first()
    .click()
  const lesson = page.getByRole('dialog', { name: '小課詳情' })
  await lesson.getByRole('button', { name: 'have', exact: true }).click()

  const dict = page.getByRole('dialog', { name: '單字查義' })
  await expect(dict.getByRole('heading', { name: 'have' })).toBeVisible()
  await dict.getByRole('button', { name: '加入收藏單字庫' }).click()
  await expect(dict.getByRole('button', { name: '已在收藏單字庫（點一下取消）' })).toBeVisible()
  await expect(page.getByRole('status').filter({ hasText: '已加入收藏' })).toBeVisible()

  // Esc 先關字典、再關課程詳情
  await page.keyboard.press('Escape')
  await expect(dict).toHaveCount(0)
  await page.keyboard.press('Escape')
  await expect(lesson).toHaveCount(0)

  await page.getByRole('link', { name: '單字庫' }).click()
  const row = page.getByTestId('word-list').getByRole('listitem').filter({ hasText: 'have' })
  await expect(row).toHaveCount(1)
  await expect(row.getByLabel('已收藏')).toBeVisible()
})

test('離線：查從未載入過的切片（service worker 預快取）', async ({
  page,
  context,
  browserName,
}) => {
  // Playwright 的 WebKit（Windows build）不支援 setOffline 後導覽（app/CLAUDE.md 已知限制）
  test.skip(browserName === 'webkit', 'WebKit（Windows build）不支援離線導覽模擬')
  await openWithServiceWorker(page)
  // 預快取完成（install 階段抓齊）後才離線
  await page.evaluate(async () => {
    const keys = await caches.keys()
    const precache = keys.find((k) => k.includes('precache'))!
    const n = (await (await caches.open(precache)).keys()).length
    if (n < 600) throw new Error(`預快取只有 ${n} 項`)
  })
  await seedWords(page, ['zebra'])

  const shardRequests: string[] = []
  page.on('request', (r) => {
    if (/\/assets\/ze-[^/]+\.json$/.test(r.url())) shardRequests.push(r.url())
  })
  await context.setOffline(true)
  await page.goto('/words')
  await expect(page.getByText('目前離線：複習與已下載的課程仍可使用')).toBeVisible()
  expect(shardRequests, '離線前本頁未載入過 ze 切片').toEqual([])

  const responsePromise = page.waitForResponse((r) => /\/assets\/ze-[^/]+\.json$/.test(r.url()))
  await page.getByRole('button', { name: 'zebra', exact: true }).click()
  const res = await responsePromise
  expect(res.fromServiceWorker(), 'ze 切片由 service worker 快取回應').toBe(true)
  const dict = page.getByRole('dialog', { name: '單字查義' })
  await expect(dict.getByRole('heading', { name: 'zebra' })).toBeVisible()
  await expect(dict.getByText('斑馬', { exact: false })).toBeVisible()
  await context.setOffline(false)
})

// AC#3：點擊到彈層出現單字文字（不含滑入動畫）；字典已快取＝service worker 預快取完成、單字總表已載入。
// 30 個字各在不同切片（前兩字母皆不同），量的是「從快取取切片＋解析＋查找＋渲染」，不是記憶體內重複查同一字
const LATENCY_WORDS = [
  'postpone',
  'meeting',
  'agenda',
  'deadline',
  'invoice',
  'schedule',
  'budget',
  'client',
  'contract',
  'office',
  'report',
  'manager',
  'travel',
  'hotel',
  'flight',
  'ticket',
  'umbrella',
  'salary',
  'kitchen',
  'product',
  'quality',
  'job',
  'customer',
  'service',
  'payment',
  'discount',
  'warehouse',
  'factory',
  'yesterday',
  'zebra',
]

test('AC#3：彈層開啟延遲 <150ms（chromium，字典已快取）', async ({ page, browserName }, info) => {
  test.skip(browserName === 'webkit', 'AC#3 指定 chromium')
  await openWithServiceWorker(page)
  await seedWords(page, LATENCY_WORDS)
  await page.goto('/words')
  await expect(page.getByTestId('word-list')).toBeVisible()
  // 單字總表在 App 開啟時預載；等釋義出現＝單字總表已就緒
  await expect(page.getByText('延遲', { exact: true })).toBeVisible()

  const samples: { word: string; ms: number }[] = []
  for (const word of LATENCY_WORDS) {
    const btn = page.getByRole('button', { name: word, exact: true })
    await btn.scrollIntoViewIfNeeded()
    const ms = await btn.evaluate(
      (el, word) =>
        new Promise<number>((resolve) => {
          const done = () =>
            [...document.querySelectorAll('[data-testid="dict-sheet"] h2')].some(
              (h) => h.textContent === word,
            )
          const t0 = performance.now()
          const mo = new MutationObserver(() => {
            if (done()) {
              mo.disconnect()
              resolve(performance.now() - t0)
            }
          })
          mo.observe(document.body, { childList: true, subtree: true, characterData: true })
          ;(el as HTMLElement).click()
        }),
      word,
    )
    samples.push({ word, ms })
    await page.keyboard.press('Escape')
    await expect(page.getByRole('dialog', { name: '單字查義' })).toHaveCount(0)
  }

  const sorted = samples.map((s) => s.ms).sort((a, b) => a - b)
  const pct = (p: number) =>
    sorted[Math.min(sorted.length - 1, Math.ceil((p / 100) * sorted.length) - 1)]
  const summary = {
    device: 'chromium Pixel 7 emulation（Playwright devices），無 CPU／網路節流，vite preview',
    n: sorted.length,
    p50: +pct(50).toFixed(1),
    p95: +pct(95).toFixed(1),
    max: +sorted.at(-1)!.toFixed(1),
    samples: samples.map((s) => ({ word: s.word, ms: +s.ms.toFixed(1) })),
  }
  const body = JSON.stringify(summary, null, 2)
  await info.attach('latency.json', { body, contentType: 'application/json' })
  await writeFile(info.outputPath('latency.json'), body)
  console.info(
    `[latency] n=${summary.n} p50=${summary.p50}ms p95=${summary.p95}ms max=${summary.max}ms`,
  )
  expect(summary.p95, 'p95 開啟延遲').toBeLessThan(150)
})
