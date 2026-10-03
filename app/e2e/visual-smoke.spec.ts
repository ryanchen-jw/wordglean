// 06 視覺 smoke（AC#1／AC#2）：七畫面（s01、s02、s08、s09、s10、s11、s13）全部狀態＋安裝卡，兩個手機引擎各一輪。
// 每個狀態：截圖 attach 進 HTML report；斷言 06 三件套（無橫向溢出、單行控件不折行、可點目標 ≥44×44）；
// 掃描畫面上的介面文字不得有白名單以外的英文（英文學習內容以 lang="en" 標示、排除）。
// 資料量級：單字庫 5000 字（課綱上限約 7,800 字的同量級）、到期 132（新課暫停門檻以上）。
import { writeFile } from 'node:fs/promises'
import { expect, test, type Page, type TestInfo } from '@playwright/test'
import { measureMobile } from './measure.js'
import { answerAll, BANK, isLevel } from './placementHelpers.js'

const DAY = 86_400_000

interface Seed {
  progress?: { lessonId: string; daysAgo: number }[]
  words?: number
  due?: number
  /** 指定字（wordId、課程來源、是否收藏），寫在合成字之後 */
  pool?: { wordId: string; courseRefs: string[]; favorited?: boolean }[]
}

// 直接寫 IndexedDB（結構同 data/db.ts v1）；先等 App 建好資料庫，避免搶先建出空庫
async function seed(page: Page, s: Seed) {
  await page.waitForFunction(async () =>
    (await indexedDB.databases()).some((d) => d.name === 'linguaapp'),
  )
  await page.evaluate(
    async ({ s, DAY }) => {
      const db = await new Promise<IDBDatabase>((res, rej) => {
        const r = indexedDB.open('linguaapp')
        r.onsuccess = () => res(r.result)
        r.onerror = () => rej(r.error)
      })
      const tx = db.transaction(['wordPool', 'courseProgress'], 'readwrite')
      for (const p of s.progress ?? [])
        tx.objectStore('courseProgress').put({
          lessonId: p.lessonId,
          completedAt: Date.now() - p.daysAgo * DAY,
          updatedAt: 0,
        })
      const real = [
        'postpone',
        'meeting',
        'reschedule',
        'agenda',
        'attendee',
        'internationalization',
        'jennyx', // 字典查無此字（s08）
      ]
      for (let i = 0; i < (s.words ?? 0); i++)
        tx.objectStore('wordPool').put({
          wordId: i < real.length ? real[i] : `word${i}`,
          state: i % 9 === 8 ? 0 : 2,
          due: i < (s.due ?? 0) ? Date.now() - DAY : Date.now() + ((i % 400) + 1) * DAY,
          stability: i % 50,
          difficulty: 5,
          scheduledDays: 3,
          learningSteps: 0,
          reps: 2,
          lapses: 0,
          lastReview: null,
          courseRefs: ['a1-u01-l01'], // 有來源才算在池中（TASK-16 D3）
          favoritedAt: i % 7 === 2 ? i : null,
          addedAt: i,
        })
      for (const [i, w] of (s.pool ?? []).entries())
        tx.objectStore('wordPool').put({
          wordId: w.wordId,
          state: 2,
          due: Date.now() + (i + 1) * DAY,
          stability: 5,
          difficulty: 5,
          scheduledDays: 3,
          learningSteps: 0,
          reps: 2,
          lapses: 0,
          lastReview: null,
          courseRefs: w.courseRefs,
          favoritedAt: w.favorited ? i + 1 : null,
          addedAt: i,
        })
      await new Promise((r) => (tx.oncomplete = r))
      db.close()
    },
    { s, DAY },
  )
}

async function check(page: Page, info: TestInfo, name: string) {
  await page.waitForTimeout(300) // 等彈層動畫（200ms）結束
  const shot = await page.screenshot()
  await info.attach(name, { body: shot, contentType: 'image/png' })
  // 逐張檢視用：另存具名檔到 gitignored 的 test-results/（不進 docs/）
  await writeFile(info.outputPath(`${info.project.name}-${name}.png`), shot)

  const r = await measureMobile(page)

  expect.soft(r.overflow, `${name}：橫向溢出`).toEqual([])
  expect.soft(r.wrapped, `${name}：單行控件折行`).toEqual([])
  expect.soft(r.small, `${name}：可點目標 <44px`).toEqual([])
  expect.soft(r.latin, `${name}：英文介面字串`).toEqual([])
  expect.soft(r.bodyColors, `${name}：body 未套 token 色`).toEqual([])
}

test.beforeEach(async ({ page }) => {
  // 主畫面比對時先關掉安裝卡（安裝卡另有一輪）
  await page.addInitScript(() => {
    if (!sessionStorage.getItem('lg.keepInstall')) localStorage.setItem('lg.installDismissed', '1')
  })
})

test('s01 首頁：第一次開啟／預設／新課暫停／今天都完成／離線', async ({ page, context }, info) => {
  await page.goto('/')
  await expect(page.getByTestId('screen-home')).toHaveAttribute('data-state', 'first')
  await check(page, info, 's01-first')

  await seed(page, {
    progress: [
      { lessonId: 'b1-u01-l01', daysAgo: 3 },
      { lessonId: 'b1-u01-l02', daysAgo: 2 },
    ],
    words: 24,
    due: 24,
  })
  await page.reload()
  await expect(page.getByTestId('screen-home')).toHaveAttribute('data-state', 'default')
  await check(page, info, 's01-default')

  await context.setOffline(true)
  await expect(page.getByText('目前離線：複習與已下載的課程仍可使用')).toBeVisible()
  await check(page, info, 's01-offline')
  await context.setOffline(false)

  await seed(page, { words: 132, due: 132 })
  await page.reload()
  await expect(page.getByTestId('screen-home')).toHaveAttribute('data-state', 'paused')
  await check(page, info, 's01-paused')

  // 今天都完成：清空單字、今天上過一課
  await page.evaluate(async () => {
    const db = await new Promise<IDBDatabase>((res) => {
      const r = indexedDB.open('linguaapp')
      r.onsuccess = () => res(r.result)
    })
    const tx = db.transaction('wordPool', 'readwrite')
    tx.objectStore('wordPool').clear()
    await new Promise((r) => (tx.oncomplete = r))
    db.close()
  })
  await seed(page, { progress: [{ lessonId: 'b1-u01-l03', daysAgo: 0 }] })
  await page.reload()
  await expect(page.getByTestId('screen-home')).toHaveAttribute('data-state', 'done')
  await check(page, info, 's01-done')
})

test('s02 課程地圖：預設／點開某一課', async ({ page }, info) => {
  await page.goto('/')
  await expect(page.getByTestId('screen-home')).toHaveAttribute('data-state', 'first')
  await seed(page, {
    progress: [
      { lessonId: 'b1-u01-l01', daysAgo: 3 },
      { lessonId: 'b1-u01-l02', daysAgo: 2 },
    ],
  })
  await page.goto('/course')
  await expect(page.getByText('目前這課')).toBeVisible()
  await check(page, info, 's02-default')
  await page.getByRole('button', { name: /第 3 課/ }).click()
  await expect(page.getByRole('dialog', { name: '小課詳情' })).toBeVisible()
  await check(page, info, 's02-detail')
})

test('s09 單字庫：空的／預設（5000 字）／熟悉度彈層', async ({ page }, info) => {
  // 測試準備：WebKit（Windows build）原生 IndexedDB 寫 5000 筆實測約 77 秒，與 App 讀取路徑無關
  test.setTimeout(150_000)
  await page.goto('/words')
  await expect(page.getByText('單字庫還是空的')).toBeVisible()
  await check(page, info, 's09-empty')
  await seed(page, { words: 5000, due: 3 })
  await page.reload()
  await expect(page.getByText('共 5000 字・今天到期 3')).toBeVisible()
  await check(page, info, 's09-default')
  await page.getByRole('button', { name: '熟悉度：全部' }).click()
  await check(page, info, 's09-familiarity-sheet')
})

// 創辦人裁示（2026-10-03）①B：上過課的字顯示小課單字卡第一義（樣本課 a1-u01-l01）；沒上課的收藏字顯示字典義
test('s09 單字庫：上過課的字顯示小課第一義、收藏字顯示字典義', async ({ page }, info) => {
  await page.goto('/words')
  await expect(page.getByText('單字庫還是空的')).toBeVisible()
  await seed(page, {
    pool: [
      { wordId: 'a', courseRefs: ['a1-u01-l01'] },
      { wordId: 'the', courseRefs: ['a1-u01-l01'] },
      { wordId: 'postpone', courseRefs: [], favorited: true },
    ],
  })
  await page.reload()
  const list = page.getByTestId('word-list')
  await expect(list.getByText('延遲', { exact: true })).toBeVisible()
  await check(page, info, 's09-course-gloss')
  await expect(list.getByText('一個、一', { exact: true })).toBeVisible()
  await expect(list.getByText('那個、這個', { exact: true })).toBeVisible()
  await expect(list.getByText('累加器')).toHaveCount(0)
})

// TASK-16：字典彈層三態＋疊在課程詳情上；jennyx 為假字（查無此字）
test('s08 字典彈層：查到／已收藏＋提示／查無此字／疊在課程詳情上', async ({ page }, info) => {
  await page.goto('/words')
  await expect(page.getByText('單字庫還是空的')).toBeVisible()
  await seed(page, { words: 12 })
  await page.reload()
  const dict = page.getByRole('dialog', { name: '單字查義' })
  await page.getByRole('button', { name: 'postpone', exact: true }).click()
  await expect(dict.getByRole('heading', { name: 'postpone' })).toBeVisible()
  await check(page, info, 's08-default')
  await dict.getByRole('button', { name: '加入收藏單字庫' }).click()
  await expect(page.getByRole('status').filter({ hasText: '已加入收藏' })).toBeVisible()
  await check(page, info, 's08-saved')
  await page.keyboard.press('Escape')
  await page.getByRole('button', { name: 'jennyx', exact: true }).click()
  await expect(dict.getByText('字典裡沒有這個字（可能是人名或專有名詞）')).toBeVisible()
  await check(page, info, 's08-notfound')
  await page.keyboard.press('Escape')
  await page.goto('/course')
  await page
    .getByRole('button', { name: /第 1 課/ })
    .first()
    .click()
  await page
    .getByRole('dialog', { name: '小課詳情' })
    .getByRole('button', { name: 'have', exact: true })
    .click()
  await expect(dict.getByRole('heading', { name: 'have' })).toBeVisible()
  await check(page, info, 's08-over-lesson')
})

test('s11 設定：預設（上／下半）／每日新字數彈層／深色', async ({ page }, info) => {
  await page.goto('/settings')
  await expect(page.getByTestId('settings-account-slot')).toBeVisible()
  await check(page, info, 's11-default-top')
  await page.getByRole('button', { name: /隱私說明/ }).scrollIntoViewIfNeeded()
  await check(page, info, 's11-default-bottom')
  await page.getByRole('button', { name: /每日新字數/ }).click()
  await check(page, info, 's11-daily-new-sheet')
  await page.getByRole('option', { name: '10' }).click()
  await page.getByRole('button', { name: /外觀/ }).click()
  await page.getByRole('option', { name: '深色' }).click()
  await page.evaluate(() => document.querySelector('main')?.scrollTo(0, 0))
  await check(page, info, 's11-dark')
})

test('s13 清除資料確認：未勾選／已勾選', async ({ page }, info) => {
  await page.goto('/settings')
  await page.getByRole('button', { name: '清除這支手機上的資料' }).click()
  await expect(page.getByRole('alertdialog')).toBeVisible()
  await check(page, info, 's13-default')
  await page.getByText('我了解資料無法復原').click()
  await expect(page.getByRole('button', { name: '清除資料' })).toBeEnabled()
  await check(page, info, 's13-checked')
})

test('安裝卡：iOS 說明（webkit）／安裝鈕（chromium）', async ({ page, browserName }, info) => {
  await page.addInitScript(() => {
    sessionStorage.setItem('lg.keepInstall', '1')
    localStorage.removeItem('lg.installDismissed')
  })
  await page.goto('/')
  if (browserName === 'chromium')
    await page.evaluate(() =>
      window.dispatchEvent(
        Object.assign(new Event('beforeinstallprompt', { cancelable: true }), {
          prompt: async () => {},
          userChoice: Promise.resolve({ outcome: 'dismissed' }),
        }),
      ),
    )
  await expect(page.getByTestId('install-card')).toBeVisible()
  await check(page, info, 'install-card')
})

test('s10 分級測驗：勾選中／結果（勾到假字）／選級距彈層／重測', async ({ page }, info) => {
  // 走兩輪 60 題（作答＋重測）；WebKit 在本機負載高時超過預設 30 秒（非 UI 逾時，AC#3 計時另驗）
  test.setTimeout(90_000)
  await page.goto('/placement')
  // 勾 A1、A2 真字＋第一個假字 → 起點 B1、提示「結果已向下修正」（同設計 s10 範例）
  let pseudo = 0
  await answerAll(
    page,
    (w) => isLevel(w, 'A1', 'A2') || (BANK.pseudowords.includes(w) && pseudo++ === 0),
    {
      onGroup: async (g) => {
        if (g === 2) await check(page, info, 's10-pick')
      },
    },
  )
  await expect(page.getByText('勾到 1 個假字，結果已向下修正')).toBeVisible()
  await expect(page.getByTestId('placement-level')).toHaveText('B1')
  await check(page, info, 's10-result')
  await page.getByRole('button', { name: '想自己選級距' }).click()
  await expect(page.getByRole('dialog', { name: '目前級距' })).toBeVisible()
  await check(page, info, 's10-levelsheet')
  await page.goto('/placement')
  await answerAll(page, () => true)
  await expect(
    page.getByText('勾到 10 個假字，這次結果不太準。建議重新測驗，或自己選級距。'),
  ).toBeVisible()
  await check(page, info, 's10-retest')
})

test.describe('系統深色模式', () => {
  test.use({ colorScheme: 'dark' })

  test('首頁、課程、單字庫（深色）', async ({ page }, info) => {
    await page.goto('/')
    await expect(page.getByTestId('screen-home')).toHaveAttribute('data-state', 'first')
    await check(page, info, 'dark-s01-first')
    await page.goto('/course')
    await expect(page.getByText('目前這課')).toBeVisible()
    await check(page, info, 'dark-s02-default')
    await page.goto('/words')
    await expect(page.getByText('單字庫還是空的')).toBeVisible()
    await check(page, info, 'dark-s09-empty')
  })

  test('分級測驗（深色）：勾選中、結果', async ({ page }, info) => {
    await page.goto('/placement')
    await answerAll(page, (w) => isLevel(w, 'A1'), {
      onGroup: async (g) => {
        if (g === 1) await check(page, info, 'dark-s10-pick')
      },
    })
    await expect(page.getByText('你的起點')).toBeVisible()
    await check(page, info, 'dark-s10-result')
  })
})
