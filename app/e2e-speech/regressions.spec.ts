// TASK-14 隔離驗收 P1-1 回歸（2026-10-02）：送出後「再唸一次」再「跳過」曾讓整課卡死（重複作答 → 存檔 reject → 題號停住、✕ 無反應）
// 辨識與麥克風為假（可錄音、模型已就緒）；內建聲音用替身
import { expect, test } from '@playwright/test'
import { LESSON } from '../e2e/lesson.js'
import { fakeSystemVoice } from '../e2e/speech.js'
import { countIs, FIRST_SHADOWING, toShadowing } from './helpers.js'

test('送出後再唸一次再跳過：前進到下一題、✕ 仍可叫出離開確認框、沒有頁面錯誤', async ({ page }) => {
  const errors: string[] = []
  page.on('pageerror', (e) => errors.push(String(e)))
  page.on('console', (m) => m.type() === 'error' && errors.push(m.text()))
  await fakeSystemVoice(page)
  await page.addInitScript(() => {
    localStorage.setItem('lg.installDismissed', '1')
    ;(window as unknown as { __lgSpeechConfig: unknown }).__lgSpeechConfig = {
      heard: ['I have a cup of tea'],
    }
  })
  await page.goto(`/lesson/${LESSON}`)
  await toShadowing(page)
  await page.getByRole('button', { name: '開始錄音' }).click()
  await page.getByRole('button', { name: '結束錄音' }).click()
  await page.getByRole('button', { name: '送出' }).click()
  await expect(
    page.getByTestId('shadowing-tally').filter({ hasText: '錯字 0・漏字 0・得分 6／6 字' }),
  ).toBeVisible()
  await page.getByRole('button', { name: '再唸一次' }).click()
  await page.getByRole('button', { name: '現在不方便說話（這題先跳過）' }).click()
  await countIs(page, FIRST_SHADOWING + 1)
  await page.getByRole('button', { name: '離開', exact: true }).first().click()
  await expect(page.getByRole('alertdialog')).toContainText('要離開這一課嗎？')
  expect(errors).toEqual([])
})
