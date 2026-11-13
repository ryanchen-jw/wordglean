// TASK-13 AC#3：聽音打字、聽音選答在兩個手機 project 作答（樣本課第 11、14 題；第 5、10 題是配對）。
// 發音以替身記錄呼叫（e2e/speech.ts）：斷言念的句子、語速與用預產音檔或手機內建聲音（TASK-35）
import { expect, test } from '@playwright/test'
import { answer, count, LESSON, next, playTo } from './lesson.js'
import { fakeSystemVoice, lastSpoken } from './speech.js'

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('lg.installDismissed', '1'))
  await fakeSystemVoice(page)
})

test('聽音打字：播放／慢速、拼錯算錯並標錯字、寬鬆比對算對；聽音選答：答錯與正解', async ({
  page,
}) => {
  await page.goto(`/lesson/${LESSON}`)
  await playTo(page, 11)

  // 出題：題型、說明；沒輸入時不能檢查
  await expect(page.getByText('聽音打字')).toBeVisible()
  await expect(page.getByText('聽句子，把聽到的英文打出來')).toBeVisible()
  await expect(page.getByRole('button', { name: '檢查' })).toBeDisabled()

  await page.getByRole('button', { name: '播放', exact: true }).click()
  await expect
    .poll(() => lastSpoken(page))
    .toEqual({ engine: 'clip', text: 'The book is in the bag.', rate: 1 })
  // 慢速：同一個預產音檔、播放速率 0.8
  await page.getByRole('button', { name: '慢速播放' }).click()
  await expect
    .poll(() => lastSpoken(page))
    .toEqual({ engine: 'clip', text: 'The book is in the bag.', rate: 0.8 })

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
  // TASK-18 穿插：第 12 題是選擇題、第 13 題寫作（TASK-15，自評），第 14 題才是聽音選答
  await answer(page, 12)
  await next(page)
  await answer(page, 13)
  await next(page)

  // 聽音選答
  await count(page, 14)
  await expect(page.getByText('聽音選答')).toBeVisible()
  await expect(page.getByText('Tom 有什麼？')).toBeVisible()
  await page.getByRole('button', { name: '播放', exact: true }).click()
  await expect
    .poll(() => lastSpoken(page))
    .toEqual({ engine: 'clip', text: 'Tom has a dog and a cat.', rate: 1 })
  await expect(page.getByRole('button', { name: '檢查' })).toBeDisabled()
  await page.getByRole('radio', { name: 'Two dogs', exact: true }).click()
  await page.getByRole('button', { name: '檢查' }).click()
  await expect(status).toContainText('答案是 A：A dog and a cat')
  await expect(status).toContainText('Tom 有一隻狗和一隻貓。')
  await next(page)
  await count(page, 15)
})

test('聽音打字：大小寫、標點、彎引號不計算對；聽音選答答對', async ({ page }) => {
  await page.goto(`/lesson/${LESSON}`)
  await playTo(page, 11)
  await page.getByRole('textbox', { name: '把聽到的英文打在這裡' }).fill('the BOOK is in the bag')
  await page.getByRole('button', { name: '檢查' }).click()
  await expect(page.getByRole('status')).toContainText('正確')
  await next(page)
  await answer(page, 12)
  await next(page)
  await answer(page, 13)
  await next(page)
  await count(page, 14)
  await page.getByRole('radio', { name: 'A dog and a cat', exact: true }).click()
  await page.getByRole('button', { name: '檢查' }).click()
  await expect(page.getByRole('status')).toContainText('正確')
})

test('聽不出來：直接看答案、可繼續下一題', async ({ page }) => {
  await page.goto(`/lesson/${LESSON}`)
  await playTo(page, 11)
  await page.getByRole('button', { name: '聽不出來' }).click()
  await expect(page.getByRole('status')).toContainText('答案是')
  await expect(page.getByRole('status')).toContainText('The book is in the bag.')
  await next(page)
  await count(page, 12)
})

test.describe('音檔抓不到（離線、沒有這包）', () => {
  // service worker 發的請求不經 page.route，封鎖 SW 才攔得到音檔
  test.use({ serviceWorkers: 'block' })

  test('改用手機內建聲音、不出錯；慢速同樣 0.8', async ({ page }) => {
    await page.route('**/*.lga', (route) => route.abort())
    await page.goto(`/lesson/${LESSON}`)
    await playTo(page, 11)
    await page.getByRole('button', { name: '播放', exact: true }).click()
    await expect
      .poll(() => lastSpoken(page))
      .toEqual({ engine: 'system', text: 'The book is in the bag.', rate: 1, lang: 'en-US' })
    await page.getByRole('button', { name: '慢速播放' }).click()
    await expect.poll(() => lastSpoken(page)).toMatchObject({ engine: 'system', rate: 0.8 })
    await expect(page.getByRole('button', { name: '檢查' })).toBeDisabled()
  })
})
