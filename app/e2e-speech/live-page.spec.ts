// TASK-39 AC#1：原型頁 /debug/live-shadowing（手機尺寸、真模型、假麥克風播放 LibriSpeech 0007
// 「YOU WILL BE FRANK WITH ME I ALWAYS AM」）：錄音中即時印出每輪文字與耗時、可在錄音中切視窗、目標句即時標記
import { expect, test } from '@playwright/test'
import { openLivePage, readRows } from './live.js'

test('原型頁：即時印每輪文字與耗時、錄音中切視窗、目標句即時標記', async ({ page }, info) => {
  test.setTimeout(15 * 60_000)
  await openLivePage(page)
  await page.getByRole('combobox').selectOption('You will be frank with me. I always am.')
  await page.getByRole('checkbox', { name: 'Two-round confirm' }).uncheck()
  await page.getByRole('button', { name: 'Continuous 60 s' }).click()
  await page.getByRole('button', { name: '4 s' }).click()
  await page.getByRole('button', { name: 'Start' }).click()

  await expect(page.getByTestId('live-round')).not.toHaveCount(0, { timeout: 30_000 })
  await expect
    .poll(async () => (await readRows(page)).length, { timeout: 30_000 })
    .toBeGreaterThanOrEqual(2)
  // 錄音中切到 3 秒視窗：之後的輪次以 3 秒辨識
  await page.getByRole('button', { name: '3 s' }).click()
  await expect
    .poll(async () => (await readRows(page)).some((r) => r.windowSec === 3), { timeout: 30_000 })
    .toBe(true)
  // 假麥克風從音檔開頭或中段開始播都有可能：等到聽見句中的 frank／always，且 frank 已標完成
  await expect
    .poll(async () => (await readRows(page)).some((r) => /frank|always/i.test(r.text)), {
      timeout: 30_000,
    })
    .toBe(true)
  await expect(
    page.getByTestId('live-target').locator('[data-mark="done"]', { hasText: 'frank' }),
  ).toBeVisible({ timeout: 30_000 })
  await page.screenshot({ path: info.outputPath('live-page.png'), fullPage: true })
  await page.getByRole('button', { name: 'Stop' }).click()
  await expect(page.getByText('Stopped: stopped')).toBeVisible()

  const rows = await readRows(page)
  info.annotations.push({
    type: '每輪',
    description: rows.map((r) => `#${r.index} ${r.ms}ms/${r.windowSec}s「${r.text}」`).join('；'),
  })
  expect(rows.every((r) => r.ms > 0)).toBe(true)
})
