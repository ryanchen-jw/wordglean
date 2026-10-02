// TASK-18 AC#3：開 App → 今天的學習 → 複習 → 小課 → 結算 → 首頁數字更新；AC#4：TTS／STT／金鑰皆不可用仍能完成一課
// 時間以 page.clock 固定：第一天上完 a1-u01-l01，第二天早上開 App（樣本課 fixture，見 playwright.config.ts）
import { expect, test } from '@playwright/test'
import { LESSON } from './lesson.js'
import { DAY1, GLOSS, learnThenNextDay, NEXT, playLesson, REVIEW_ORDER } from './today.js'

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('lg.installDismissed', '1'))
})

test('AC#3：今天的學習——先複習到期的 8 個字，再接下一課，結算後首頁數字更新', async ({ page }) => {
  test.setTimeout(120_000)
  await learnThenNextDay(page)

  // 第二天早上開 App：到期 8、下一課是第 2 課、今天尚未完成任何事
  await page.goto('/')
  const home = page.getByTestId('screen-home')
  await expect(home).toHaveAttribute('data-state', 'default')
  await expect(page.getByText('先複習，再上一課・約 7 分鐘')).toBeVisible()
  await expect(page.getByRole('link', { name: /到期複習/ })).toContainText('8')
  await expect(page.getByRole('link', { name: /下一課/ })).toContainText('基礎常用字（一） 2')
  await expect(page.getByText('複習 0／8')).toBeVisible()
  await expect(page.getByText('新課 0／1')).toBeVisible()

  await page.getByRole('button', { name: '開始今天的學習' }).click()
  await expect(page).toHaveURL(/\/review\?flow=today$/)
  for (const [i, word] of REVIEW_ORDER.entries()) {
    await expect(page.getByText(`複習 ${i + 1}／8`, { exact: true })).toBeVisible()
    await expect(page.getByTestId('review-screen').locator('[lang="en"]').first()).toHaveText(word)
    await page.getByRole('radio', { name: GLOSS.get(word)!, exact: true }).click()
    await expect(page.getByRole('status')).toContainText('正確')
    await page.getByRole('button', { name: '繼續' }).click()
  }

  // 複習完直接接下一課
  await expect(page).toHaveURL(new RegExp(`/lesson/${NEXT}$`))
  await playLesson(page, NEXT)
  await page.getByTestId('lesson-done').getByRole('button', { name: '回到今天' }).click()

  await expect(home).toHaveAttribute('data-state', 'done')
  await expect(page.getByText('今天的學習都完成了')).toBeVisible()
  await expect(page.getByText('複習 8／8')).toBeVisible()
  await expect(page.getByText('新課 1／1')).toBeVisible()
  await page.goto('/words')
  await expect(page.getByTestId('word-list').locator('[lang="en"]')).toHaveCount(16)
})

test('AC#4：手機不能播音、不能辨識語音、沒有金鑰時仍能完成一課', async ({ page }) => {
  await page.addInitScript(() => {
    // 模擬沒有 speechSynthesis 的瀏覽器（e2e 建置 STT 固定不可用；沒有連結 OpenRouter→寫作題改自評）
    Reflect.deleteProperty(window, 'speechSynthesis')
    Reflect.deleteProperty(Object.getPrototypeOf(window), 'speechSynthesis')
  })
  await page.goto(`/lesson/${LESSON}`)
  expect(await page.evaluate(() => 'speechSynthesis' in window)).toBe(false)
  await expect(page.getByRole('button', { name: '發音' })).toHaveCount(0)
  await expect(page.getByRole('progressbar', { name: '作答進度' })).toHaveAttribute(
    'aria-valuemax',
    '14',
  )
  await playLesson(page, LESSON)
  await expect(page.getByTestId('lesson-done')).toContainText('答對 14 題')
})

test('完成頁「再複習一次剛學的字」：練習本課 8 個字，不影響今天的複習數', async ({ page }) => {
  await page.clock.setFixedTime(DAY1)
  await page.goto(`/lesson/${LESSON}`)
  await playLesson(page, LESSON)
  await page.getByRole('button', { name: '再複習一次剛學的字' }).click()
  await expect(page).toHaveURL(new RegExp(`/review\\?lesson=${LESSON}$`))
  await expect(page.getByText('複習 1／8', { exact: true })).toBeVisible()
  await page.getByRole('radio', { name: GLOSS.get('the')!, exact: true }).click()
  await page.getByRole('button', { name: '繼續' }).click()
  await page.getByRole('button', { name: '離開' }).click()
  await page.goto('/')
  await expect(page.getByText('複習 0／0')).toBeVisible()
})
