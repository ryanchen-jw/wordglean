// TASK-26 首頁「我的成長」：新使用者上完一課、造資料模擬 A1 記得 70%（升級提示當天顯示、隔天消失）、展開各級進度；
// 手機視覺 smoke（淺／深色 × 375 標準／320 特大字級）：不破版、可點 ≥44px、狀態色 computed＝token；
// 截圖另存 docs/pending/2026-10-06-growth-shots/（本機給創辦人看，不上雲）。時間一律 page.clock 固定
import { mkdirSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { expect, test, type Page } from '@playwright/test'
import { LESSON } from './lesson.js'
import { measureMobile, overflowingChildren } from './measure.js'
import { DAY, DAY1, playLesson } from './today.js'

const SHOTS = resolve(import.meta.dirname, '../../docs/pending/2026-10-06-growth-shots')

// 真課綱 A1 主題單元（1063 字，70%＝745 字）
const A1_WORDS: string[] = (
  JSON.parse(
    readFileSync(resolve(import.meta.dirname, '../../content/curriculum/a1.json'), 'utf-8'),
  ) as { units: { lessons: { words: string[] }[] }[] }
).units.flatMap((u) => u.lessons.flatMap((l) => l.words))

const card = (page: Page) => page.getByTestId('growth-card')

// 造資料後重載：WebKit（Windows）IndexedDB 讀 1490 筆時首頁本身要約 12 秒才出來（拿掉成長卡實測同為約 12 秒，
// chromium 約 0.2 秒），成長卡只比「今天的學習」晚約 0.1 秒；首頁出現前的斷言放寬時限
const LOADED = { timeout: 30_000 }

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('lg.installDismissed', '1'))
})

/** 直接寫 IndexedDB：words 個字前一天作答過（S＝10 天，兩天內都記得）；先等 App 建好 v5 資料庫 */
async function seedRemembered(page: Page, words: string[]) {
  await page.waitForFunction(async () =>
    (await indexedDB.databases()).some((d) => d.name === 'linguaapp'),
  )
  await page.evaluate(
    async ({ words, DAY }) => {
      const db = await new Promise<IDBDatabase>((res, rej) => {
        const r = indexedDB.open('linguaapp')
        r.onsuccess = () => res(r.result)
        r.onerror = () => rej(r.error)
      })
      const tx = db.transaction(['wordPool', 'reviewLogs'], 'readwrite')
      const at = Date.now() - DAY
      words.forEach((wordId, i) => {
        tx.objectStore('wordPool').put({
          wordId,
          state: 2,
          due: at + 10 * DAY,
          stability: 10,
          difficulty: 5,
          scheduledDays: 10,
          learningSteps: 0,
          reps: 1,
          lapses: 0,
          lastReview: at,
          courseRefs: ['a1-u01-l01'],
          favoritedAt: null,
          addedAt: at,
        })
        tx.objectStore('reviewLogs').put({
          id: `seed-${i}`,
          wordId,
          rating: 3,
          state: 0,
          due: at,
          stability: 0,
          difficulty: 0,
          scheduledDays: 0,
          learningSteps: 0,
          review: at,
        })
      })
      await new Promise((res, rej) => {
        tx.oncomplete = res
        tx.onerror = () => rej(tx.error)
      })
      db.close()
    },
    { words, DAY },
  )
}

test('新使用者上完一課：首頁成長卡顯示入門與已學字數', async ({ page }) => {
  test.setTimeout(120_000)
  await page.clock.setFixedTime(DAY1)
  await page.goto(`/lesson/${LESSON}`)
  await playLesson(page, LESSON)
  await page.goto('/')
  await expect(card(page)).toContainText('我的成長', LOADED)
  await expect(card(page)).toContainText('入門')
  await expect(card(page)).toContainText('往 A1　0%')
  await expect(page.getByTestId('growth-learned')).toHaveText('8')
  await expect(page.getByTestId('growth-remembered')).toHaveText('8')
  await expect(card(page)).toContainText('這週新學 8 字')
})

test('A1 記得 70%：當天顯示「已達 A1」，隔天消失、程度仍是 A1；展開各級進度', async ({ page }) => {
  test.setTimeout(150_000) // WebKit（Windows）寫 IndexedDB 較慢
  await page.clock.setFixedTime(DAY1)
  await page.goto('/')
  await seedRemembered(page, A1_WORDS.slice(0, 745))
  await page.reload()
  await expect(page.getByTestId('growth-reached')).toHaveText('已達 A1', LOADED)
  await expect(card(page)).toContainText('A1｜約多益 120+')
  await expect(card(page)).toContainText('往 A2　0%')

  await card(page).getByRole('button').click()
  const sheet = page.getByRole('dialog', { name: '各級進度' })
  await expect(sheet).toBeVisible()
  await expect(sheet.getByTestId('growth-level-A1')).toContainText('745／1063')
  for (const [level, total] of [
    ['A2', 1241],
    ['B1', 2139],
    ['B2', 2415],
    ['C1', 913],
  ] as const)
    await expect(sheet.getByTestId(`growth-level-${level}`)).toContainText(`0／${total}`)
  await expect(sheet.locator('[data-bar="tick"]')).toHaveCount(5)
  await page.keyboard.press('Escape')
  await expect(sheet).toBeHidden()

  // 隔天：提示消失，程度不降
  await page.clock.setFixedTime(DAY1 + DAY)
  await page.reload()
  await expect(card(page)).toContainText('A1｜約多益 120+', LOADED)
  await expect(page.getByTestId('growth-reached')).toHaveCount(0)
})

// 視覺 smoke：狀態色以 computed 比對 token（共用 class 曾蓋掉狀態色）
const token = (page: Page, name: string, prop: 'color' | 'backgroundColor') =>
  page.evaluate(
    ({ name, prop }) => {
      const probe = document.createElement('div')
      probe.style.color = `var(${name})`
      probe.style.background = `var(${name})`
      document.body.append(probe)
      const c = getComputedStyle(probe)[prop]
      probe.remove()
      return c
    },
    { name, prop },
  )
const computed = (page: Page, selector: string, prop: 'color' | 'backgroundColor') =>
  page
    .locator(selector)
    .first()
    .evaluate((el, p) => getComputedStyle(el)[p], prop)

const VIEWS = [
  { name: '375-md', width: 375, height: 812, textSize: null },
  { name: '320-xl', width: 320, height: 640, textSize: 'xl' },
] as const

for (const theme of ['light', 'dark'] as const)
  for (const v of VIEWS)
    test(`視覺 smoke ${theme} ${v.name}：成長卡與各級進度不破版、可點 ≥44px、色＝token`, async ({
      page,
    }, info) => {
      test.setTimeout(150_000)
      mkdirSync(SHOTS, { recursive: true })
      await page.setViewportSize({ width: v.width, height: v.height })
      await page.addInitScript(
        ({ theme, size }) => {
          localStorage.setItem('lg.theme', theme)
          if (size) localStorage.setItem('lg.textSize', size)
        },
        { theme, size: v.textSize },
      )
      await page.clock.setFixedTime(DAY1)
      await page.goto('/')
      await seedRemembered(page, A1_WORDS.slice(0, 745))
      await page.reload()
      await expect(page.getByTestId('growth-reached')).toBeVisible(LOADED)

      const shot = async (name: string) => {
        const m = await measureMobile(page)
        expect.soft(m.overflow, name).toEqual([])
        expect.soft(m.wrapped, name).toEqual([])
        expect.soft(m.small, name).toEqual([])
        expect.soft(m.latin, name).toEqual([])
        expect.soft(m.bodyColors, name).toEqual([])
        const path = `${SHOTS}/${info.project.name}-${theme}-${v.name}-${name}.png`
        await page.screenshot({ path })
        await info.attach(name, { path, contentType: 'image/png' })
      }

      expect(await overflowingChildren(page, '[data-testid="growth-card"] > button')).toEqual([])
      const box = await card(page).getByRole('button').boundingBox()
      expect(box!.height).toBeGreaterThanOrEqual(44)
      expect(await computed(page, '[data-testid="growth-card"] > button', 'backgroundColor')).toBe(
        await token(page, '--lg-surface', 'backgroundColor'),
      )
      expect(await computed(page, '[data-testid="growth-reached"]', 'color')).toBe(
        await token(page, '--lg-correct', 'color'),
      )
      expect(await computed(page, '[data-bar="fill"]', 'backgroundColor')).toBe(
        await token(page, '--lg-primary', 'backgroundColor'),
      )
      expect(await computed(page, '[data-bar="tick"]', 'backgroundColor')).toBe(
        await token(page, '--lg-text', 'backgroundColor'),
      )
      // 進度條底與填色、刻度須可分辨
      expect(await token(page, '--lg-line', 'backgroundColor')).not.toBe(
        await token(page, '--lg-primary', 'backgroundColor'),
      )
      await shot('home')

      await card(page).getByRole('button').click()
      await expect(page.getByRole('dialog', { name: '各級進度' })).toBeVisible()
      expect(await overflowingChildren(page, '[role="dialog"] ul')).toEqual([])
      await shot('detail')
    })
