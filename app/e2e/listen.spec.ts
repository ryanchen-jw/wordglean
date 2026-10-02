// TASK-13 AC#3：聽音打字、聽音選答在兩個手機 project 作答（樣本課第 9、10 題）。
// 手機內建聲音以替身記錄呼叫（e2e/speech.ts）：斷言念的句子、語速與語言
import { expect, test } from '@playwright/test'
import { answer, count, LESSON, next, playTo } from './lesson.js'
import { fakeSystemVoice, fakeWebGpu, lastSpoken } from './speech.js'

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('lg.installDismissed', '1'))
  await fakeSystemVoice(page)
  // 首次提示「到設定開啟高音質」只在支援 WebGPU 的手機出現（headless chromium 沒有）
  await fakeWebGpu(page)
})

test('聽音打字：播放／慢速、拼錯算錯並標錯字、寬鬆比對算對；聽音選答：答錯與正解', async ({
  page,
}) => {
  await page.goto(`/lesson/${LESSON}`)
  await playTo(page, 9)

  // 出題：題型、說明、內建聲音、第一次的高音質提示；沒輸入時不能檢查
  await expect(page.getByText('聽音打字')).toBeVisible()
  await expect(page.getByText('聽句子，把聽到的英文打出來')).toBeVisible()
  await expect(page.getByText('手機內建聲音', { exact: true })).toBeVisible()
  await expect(page.getByTestId('hq-voice-hint')).toBeVisible()
  await expect(page.getByRole('button', { name: '檢查' })).toBeDisabled()

  await page.getByRole('button', { name: '播放', exact: true }).click()
  await expect
    .poll(() => lastSpoken(page))
    .toEqual({
      text: 'The book is in the bag.',
      rate: 1,
      lang: 'en-US',
    })
  await page.getByRole('button', { name: '慢速播放' }).click()
  await expect.poll(() => lastSpoken(page)).toMatchObject({ rate: 0.8 })

  // 少打一個字母也算錯：標出打錯的字＋改正＋英中解答
  const field = page.getByRole('textbox', { name: '把聽到的英文打在這裡' })
  await field.fill('The book is in the bags')
  await page.getByRole('button', { name: '檢查' }).click()
  const status = page.getByRole('status')
  await expect(status).toContainText('差一點：bags → bag')
  await expect(status).toContainText('The book is in the bag.')
  await expect(status).toContainText('那本書在包包裡。')
  await expect(page.getByTestId('listen-typed').locator('mark')).toHaveText(['bags'])
  await expect(page.getByRole('button', { name: '再聽一次' })).toBeVisible()
  await next(page)
  // TASK-18 穿插：第 10 題是選擇題，第 11 題才是聽音選答
  await answer(page, 10)
  await next(page)

  // 聽音選答
  await count(page, 11)
  await expect(page.getByText('聽音選答')).toBeVisible()
  await expect(page.getByText('Tom 有什麼？')).toBeVisible()
  await expect(page.getByTestId('hq-voice-hint')).toHaveCount(0)
  await page.getByRole('button', { name: '播放', exact: true }).click()
  await expect.poll(() => lastSpoken(page)).toMatchObject({ text: 'Tom has a dog and a cat.' })
  await expect(page.getByRole('button', { name: '檢查' })).toBeDisabled()
  await page.getByRole('radio', { name: 'Two dogs', exact: true }).click()
  await page.getByRole('button', { name: '檢查' }).click()
  await expect(status).toContainText('答案是 A：A dog and a cat')
  await expect(status).toContainText('Tom 有一隻狗和一隻貓。')
  await next(page)
  await count(page, 12)
})

test('聽音打字：大小寫、標點、彎引號不計算對；聽音選答答對', async ({ page }) => {
  await page.goto(`/lesson/${LESSON}`)
  await playTo(page, 9)
  await page.getByRole('textbox', { name: '把聽到的英文打在這裡' }).fill('the BOOK is in the bag')
  await page.getByRole('button', { name: '檢查' }).click()
  await expect(page.getByRole('status')).toContainText('正確')
  await next(page)
  await answer(page, 10)
  await next(page)
  await count(page, 11)
  await page.getByRole('radio', { name: 'A dog and a cat', exact: true }).click()
  await page.getByRole('button', { name: '檢查' }).click()
  await expect(page.getByRole('status')).toContainText('正確')
})

test('聽不出來：直接看答案、可繼續下一題', async ({ page }) => {
  await page.goto(`/lesson/${LESSON}`)
  await playTo(page, 9)
  await page.getByRole('button', { name: '聽不出來' }).click()
  await expect(page.getByRole('status')).toContainText('這一句是')
  await expect(page.getByRole('status')).toContainText('The book is in the bag.')
  await next(page)
  await count(page, 10)
})

test('沒有 WebGPU 的手機：不顯示「到設定開啟高音質」的首次提示', async ({ page }) => {
  await page.addInitScript(() => Object.defineProperty(navigator, 'gpu', { value: undefined }))
  await page.goto('/settings')
  await expect(page.getByText('這支手機不支援高音質發音')).toBeVisible()
  await page.goto(`/lesson/${LESSON}`)
  await playTo(page, 9)
  await expect(page.getByText('聽音打字')).toBeVisible()
  await expect(page.getByTestId('hq-voice-hint')).toHaveCount(0)
})
