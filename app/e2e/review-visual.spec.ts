// TASK-18 視覺 smoke（harness 06）：複習 s07（出題／答對／答錯）、完成卡、沒有到期的空狀態、練習；
// 每個狀態截圖 attach＋具名檔存 test-results/（gitignored），斷言 06 三件套＋英文介面字串＋body 色；
// 選項狀態色以 computed 色比對 token（TASK-12／16／17 都踩過共用 surface 底蓋掉狀態色）；
// 另在 320 標準／320 特大／375 特大下量溢出、折行與子元素溢出。資料＝樣本課 fixture 真實題目
import { writeFile } from 'node:fs/promises'
import { expect, test, type Page, type TestInfo } from '@playwright/test'
import { LESSON } from './lesson.js'
import { measureMobile, overflowingChildren } from './measure.js'
import { DAY1, GLOSS, learnThenNextDay, playLesson, REVIEW_ORDER } from './today.js'

async function check(page: Page, info: TestInfo, name: string, strict = true) {
  await page.waitForTimeout(300) // 等回饋動畫（200ms）結束
  const shot = await page.screenshot()
  await info.attach(name, { body: shot, contentType: 'image/png' })
  await writeFile(info.outputPath(`${info.project.name}-${name}.png`), shot)
  const m = await measureMobile(page)
  expect.soft(m.overflow, `${name}：橫向溢出`).toEqual([])
  expect.soft(m.wrapped, `${name}：單行控件折行`).toEqual([])
  expect.soft(m.small, `${name}：可點目標 <44px`).toEqual([])
  if (strict) {
    expect.soft(m.latin, `${name}：英文介面字串`).toEqual([])
    expect.soft(m.bodyColors, `${name}：body 未套 token 色`).toEqual([])
  }
  for (const sel of ['main', '[role="status"]'])
    if (await page.locator(sel).count())
      expect.soft(await overflowingChildren(page, sel), `${name}：${sel} 子元素溢出`).toEqual([])
}

const firstWrong =
  (word: string) =>
  // 正解以外的第一個選項（畫面上的順序）
  (page: Page) =>
    page
      .getByRole('radio')
      .filter({ hasNotText: GLOSS.get(word)! })
      .first()

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('lg.installDismissed', '1'))
})

test('複習：出題／答對／答錯／完成卡', async ({ page }, info) => {
  test.setTimeout(90_000)
  await learnThenNextDay(page)
  await page.goto('/review')
  await expect(page.getByText('複習 1／8', { exact: true })).toBeVisible()
  await check(page, info, 'review-question')
  await page.getByRole('radio', { name: GLOSS.get(REVIEW_ORDER[0])!, exact: true }).click()
  await check(page, info, 'review-right')
  await page.getByRole('button', { name: '繼續' }).click()
  await firstWrong(REVIEW_ORDER[1])(page).click()
  await expect(page.getByRole('status')).toContainText(`${REVIEW_ORDER[1]} 是「`)
  await check(page, info, 'review-wrong')
  await page.getByRole('button', { name: '繼續' }).click()
  for (const word of REVIEW_ORDER.slice(2)) {
    await page.getByRole('radio', { name: GLOSS.get(word)!, exact: true }).click()
    await page.getByRole('button', { name: '繼續' }).click()
  }
  const done = page.getByTestId('review-done')
  await expect(done).toContainText('複習完成')
  await expect(done).toContainText('8 個字')
  await expect(done).toContainText('答對 7 個')
  await check(page, info, 'review-done')
})

test('沒有到期的單字：空狀態完成卡', async ({ page }, info) => {
  await page.goto('/review')
  await expect(page.getByTestId('review-done')).toContainText('目前沒有到期的單字')
  await check(page, info, 'review-empty')
})

test('再複習一次剛學的字：練習出題', async ({ page }, info) => {
  await page.clock.setFixedTime(DAY1)
  await page.goto(`/lesson/${LESSON}`)
  await playLesson(page, LESSON)
  await page.getByRole('button', { name: '再複習一次剛學的字' }).click()
  await expect(page.getByText('複習 1／8', { exact: true })).toBeVisible()
  await check(page, info, 'practice-question')
})

// 狀態色守衛：答題後選項要有 correct-bg／error-bg 填色（components.md §3），不能被共用的 surface 底蓋掉
for (const theme of ['light', 'dark'] as const) {
  test(`複習答題後選項底色＝correct-bg／error-bg（${theme}）`, async ({ page }) => {
    await page.addInitScript((th) => localStorage.setItem('lg.theme', th), theme)
    await learnThenNextDay(page)
    await page.goto('/review')
    await firstWrong(REVIEW_ORDER[0])(page).click()
    const bg = (state: string) =>
      page
        .locator(`[data-choice="${state}"]`)
        .first()
        .evaluate((el) => getComputedStyle(el).backgroundColor)
    const token = (name: string) =>
      page.evaluate((n) => {
        const probe = document.createElement('div')
        probe.style.background = `var(${n})`
        document.body.append(probe)
        const c = getComputedStyle(probe).backgroundColor
        probe.remove()
        return c
      }, name)
    expect(await bg('correct')).toBe(await token('--lg-correct-bg'))
    expect(await bg('wrong')).toBe(await token('--lg-error-bg'))
    expect(await bg('dim')).toBe(await token('--lg-surface'))
    // 兩色系的 token 不同，避免「兩邊都是同一個顏色」的假綠
    expect(await token('--lg-correct-bg')).not.toBe(await token('--lg-surface'))
    expect(await token('--lg-error-bg')).not.toBe(await token('--lg-surface'))
  })
}

const NARROW = [
  { name: '320-md', width: 320, height: 640, textSize: null },
  { name: '320-xl', width: 320, height: 640, textSize: 'xl' },
  { name: '375-xl', width: 375, height: 812, textSize: 'xl' },
] as const

for (const c of NARROW) {
  test(`窄螢幕／特大字級 ${c.name}：複習答錯、完成卡、空狀態`, async ({ page }, info) => {
    test.setTimeout(90_000)
    await page.setViewportSize({ width: c.width, height: c.height })
    await page.addInitScript((size) => {
      if (size) localStorage.setItem('lg.textSize', size)
    }, c.textSize)
    await page.goto('/review')
    await expect(page.getByTestId('review-done')).toBeVisible()
    await check(page, info, `${c.name}-review-empty`, false)

    await learnThenNextDay(page)
    await page.goto('/review')
    await firstWrong(REVIEW_ORDER[0])(page).click()
    await check(page, info, `${c.name}-review-wrong`, false)
    await expect(page.getByRole('button', { name: '繼續' })).toBeInViewport()
    await page.getByRole('button', { name: '繼續' }).click()
    for (const word of REVIEW_ORDER.slice(1)) {
      await page.getByRole('radio', { name: GLOSS.get(word)!, exact: true }).click()
      await page.getByRole('button', { name: '繼續' }).click()
    }
    await expect(page.getByTestId('review-done')).toBeVisible()
    await check(page, info, `${c.name}-review-done`, false)
  })
}
