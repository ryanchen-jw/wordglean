// TASK-17 AC#3：分級測驗全程 < 5 分鐘（以平均每題 3 秒模擬）；結果寫入設定、設定頁可調整。
// 預設（CI）：快速作答，以「題數 × 3 秒＋實測畫面耗時」判定 < 300 秒。
// PLACEMENT_REALTIME=1：每題真的等 3 秒，以實測總耗時判定（本機留證據用，不進 CI）。
import { expect, test } from '@playwright/test'
import { answerAll, isLevel } from './placementHelpers.js'

const SECONDS_PER_ITEM = 3
const LIMIT_SECONDS = 300
const realtime = process.env.PLACEMENT_REALTIME === '1'

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('lg.installDismissed', '1'))
})

test(`AC#3 首次開啟 → 分級測驗 → 結果寫入設定 → 設定頁改級距（${realtime ? '每題真等 3 秒' : '每題 3 秒模擬'}）`, async ({
  page,
}, info) => {
  test.setTimeout(realtime ? 420_000 : 120_000)
  await page.goto('/')
  await expect(page.getByTestId('screen-home')).toHaveAttribute('data-state', 'first')

  const t0 = Date.now()
  await page.getByRole('button', { name: '開始分級測驗' }).click()
  // 認識 A1、A2 的字、不勾假字：A1／A2 掌握、B1 未掌握 → 起點 B1（與抽到哪些字無關）
  const items = await answerAll(page, (w) => isLevel(w, 'A1', 'A2'), {
    onItem: realtime ? () => page.waitForTimeout(SECONDS_PER_ITEM * 1000) : undefined,
  })
  await expect(page.getByText('你的起點')).toBeVisible()
  const uiSeconds = (Date.now() - t0) / 1000
  const total = realtime ? uiSeconds : items * SECONDS_PER_ITEM + uiSeconds
  info.annotations.push({
    type: 'AC#3 計時',
    description: `${items} 題；${realtime ? `實測總耗時 ${uiSeconds.toFixed(1)} 秒` : `${items}×${SECONDS_PER_ITEM} 秒＋實測畫面耗時 ${uiSeconds.toFixed(1)} 秒＝${total.toFixed(1)} 秒`}`,
  })
  console.log(
    `[AC#3] items=${items} ui=${uiSeconds.toFixed(1)}s total=${total.toFixed(1)}s realtime=${realtime}`,
  )
  expect(items).toBe(60)
  expect(total).toBeLessThan(LIMIT_SECONDS)

  // 結果寫入設定 → 首頁與設定頁顯示
  await expect(page.getByTestId('placement-level')).toHaveText('B1')
  await page.getByRole('button', { name: '從 B1 開始' }).click()
  await expect(page.getByTestId('screen-home')).toHaveAttribute('data-state', 'default')
  await expect(page.getByText('B1｜約多益 275+')).toBeVisible()

  // 重新載入仍在（存在 IndexedDB），設定頁可調整
  await page.goto('/settings')
  const row = page.getByRole('button', { name: /目前級距\s*B1｜約多益 275\+/ })
  await expect(row).toBeVisible()
  await row.click()
  await page
    .getByRole('dialog', { name: '目前級距' })
    .getByRole('option', { name: 'B2｜約多益 400+' })
    .click()
  await expect(page.getByRole('button', { name: /目前級距\s*B2｜約多益 400\+/ })).toBeVisible()
  await page.goto('/')
  await expect(page.getByText('B2｜約多益 400+')).toBeVisible()
})
