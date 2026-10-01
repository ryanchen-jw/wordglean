// 登入畫面視覺 smoke（harness 06）：關鍵狀態逐一截圖附進報告；手機三件套斷言
// 寄驗證碼的回應以 page.route mock（成功／失敗），不需真的 Supabase 收信
import { expect, test, type Page, type TestInfo } from '@playwright/test'

// Service worker 接管後，WebKit 的 page.route 攔不到頁面請求（實測：mock 沒命中、直連 55421）；
// SW 本身由一般 e2e 驗，這裡封鎖 SW 讓 mock 生效
test.use({ serviceWorkers: 'block' })

async function shot(page: Page, info: TestInfo, name: string) {
  await info.attach(name, { body: await page.screenshot(), contentType: 'image/png' })
}

// 手機三件套：無橫向溢出、按鈕文字不折行、可點元素 ≥ 44×44
async function mobileChecks(page: Page) {
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  )
  expect(overflow).toBe(0)
  for (const button of await page.getByRole('button').all()) {
    const lines = await button.evaluate((el) => {
      const range = document.createRange()
      range.selectNodeContents(el)
      return new Set([...range.getClientRects()].map((r) => Math.round(r.top))).size
    })
    expect(lines, `按鈕「${await button.innerText()}」折行`).toBe(1)
    const box = (await button.boundingBox())!
    expect(box.width).toBeGreaterThanOrEqual(44)
    expect(box.height).toBeGreaterThanOrEqual(44)
  }
}

// 跨來源（App 5298 → Supabase 55421）：mock 回應照真實 Supabase 帶 CORS 標頭並回應預檢
function mockOtp(page: Page, status: number) {
  const cors = {
    'access-control-allow-origin': '*',
    'access-control-allow-headers': '*',
    'access-control-allow-methods': 'POST, OPTIONS',
  }
  return page.route('**/auth/v1/otp*', (r) =>
    r.request().method() === 'OPTIONS'
      ? r.fulfill({ status: 204, headers: cors })
      : r.fulfill({
          status,
          headers: cors,
          json: status === 200 ? {} : { code: status, msg: 'mock' },
        }),
  )
}

async function openForm(page: Page) {
  await page.goto('/')
  await expect(page.getByTestId('app-placeholder')).toHaveText('LinguaApp 骨架建置中')
  await page.getByTestId('login-entry').click()
  await page.getByTestId('login-email').fill('me@test.local')
}

test('登入入口與 Email 表單（含 Google 按鈕）', async ({ page }, info) => {
  await page.goto('/')
  await expect(page.getByTestId('login-entry')).toBeVisible()
  await mobileChecks(page)
  await shot(page, info, '1-入口')

  await page.getByTestId('login-entry').click()
  await expect(page.getByTestId('login-email')).toBeVisible()
  await expect(page.getByTestId('login-google')).toBeVisible()
  await mobileChecks(page)
  await shot(page, info, '2-Email 表單')
})

test('寄出成功 → 驗證碼步驟', async ({ page }, info) => {
  await mockOtp(page, 200)
  await openForm(page)
  await page.getByTestId('login-send').click()
  await expect(page.getByTestId('login-code')).toBeVisible()
  await expect(page.getByText('me@test.local')).toBeVisible()
  await expect(page.getByTestId('login-google')).toHaveCount(0)
  await mobileChecks(page)
  await shot(page, info, '3-驗證碼步驟')
})

test('寄出失敗 → 錯誤訊息、停在 Email 步驟', async ({ page }, info) => {
  await mockOtp(page, 500)
  await openForm(page)
  await page.getByTestId('login-send').click()
  await expect(page.getByTestId('login-error')).toBeVisible()
  await expect(page.getByTestId('login-email')).toBeVisible()
  await mobileChecks(page)
  await shot(page, info, '4-寄送失敗')
})

// 走查 P0：64 字元 email 在驗證碼說明與已登入列不可撐出橫向捲動
const LONG_EMAIL = `${'a'.repeat(52)}@example.com` // 64 字元

function mockVerify(page: Page) {
  const cors = {
    'access-control-allow-origin': '*',
    'access-control-allow-headers': '*',
    'access-control-allow-methods': 'POST, OPTIONS',
  }
  const now = Math.floor(Date.now() / 1000)
  return page.route('**/auth/v1/verify*', (r) =>
    r.request().method() === 'OPTIONS'
      ? r.fulfill({ status: 204, headers: cors })
      : r.fulfill({
          status: 200,
          headers: cors,
          json: {
            access_token: 'mock-access-token',
            token_type: 'bearer',
            expires_in: 3600,
            expires_at: now + 3600,
            refresh_token: 'mock-refresh-token',
            user: {
              id: '00000000-0000-0000-0000-000000000001',
              email: LONG_EMAIL,
              aud: 'authenticated',
            },
          },
        }),
  )
}

const overflowX = (page: Page) =>
  page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)

for (const width of [375, 320]) {
  test(`長 email（64 字元）在 ${width}px 不造成橫向溢出：驗證碼步驟、已登入`, async ({
    page,
  }, info) => {
    await page.setViewportSize({ width, height: 740 })
    await mockOtp(page, 200)
    await mockVerify(page)
    await page.goto('/')
    await page.getByTestId('login-entry').click()
    await page.getByTestId('login-email').fill(LONG_EMAIL)
    await page.getByTestId('login-send').click()
    await expect(page.getByTestId('login-code')).toBeVisible()
    await shot(page, info, `7-長 email 驗證碼步驟 ${width}px`)
    expect(await overflowX(page)).toBe(0)

    await page.getByTestId('login-code').fill('123456')
    await page.getByTestId('login-verify').click()
    await expect(page.getByTestId('account-email')).toHaveText(LONG_EMAIL)
    await shot(page, info, `8-長 email 已登入 ${width}px`)
    expect(await overflowX(page)).toBe(0)
  })
}
