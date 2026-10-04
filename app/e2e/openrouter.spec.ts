// TASK-15 AC#1／AC#3：OpenRouter 一鍵授權（PKCE，假端點）、貼金鑰、清除金鑰、寫作題 AI 批改與失敗；
// 全程記錄頁面請求，檢查金鑰只送往 openrouter.ai（網路面板）。openrouter.ai 全部由假端點回應、不真連網
import { expect, test } from '@playwright/test'
import { answer, LESSON, next, playTo, retryCount, STEPS, WRITE_STEPS } from './lesson.js'
import { fakeOpenRouter, FAKE_KEY, gradeOk, requestsCarryingKey } from './openrouter.js'
import { fakeSystemVoice } from './speech.js'

// service worker 發出的請求不經 page.route；封鎖它，確保每個請求都被假端點攔到、也都被記錄
test.use({ serviceWorkers: 'block' })

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('lg.installDismissed', '1'))
  // 聽類題要能播音才出（TASK-18 能力偵測）；固定用替身，題號才與 e2e/lesson.ts stepsOf 一致
  await fakeSystemVoice(page)
})

/** 金鑰只出現在送往 openrouter.ai 的請求；且確實出現過（證明檢查有鑑別力） */
function expectKeyOnlyToOpenRouter(urls: string[]) {
  expect(urls.length).toBeGreaterThan(0)
  for (const u of urls) expect(new URL(u).origin).toBe('https://openrouter.ai')
}

async function secretsInDb(page: import('@playwright/test').Page) {
  return page.evaluate(
    () =>
      new Promise<unknown[]>((res) => {
        const r = indexedDB.open('linguaapp')
        r.onsuccess = () => {
          const all = r.result.transaction('secrets').objectStore('secrets').getAll()
          all.onsuccess = () => res(all.result)
        }
      }),
  )
}

test('一鍵授權（PKCE）：授權頁 → 回呼換金鑰 → 已連結、額度；verifier 對得上 challenge', async ({
  page,
}) => {
  const fake = await fakeOpenRouter(page)
  await page.goto('/settings')
  await page.getByRole('button', { name: '用 OpenRouter 帳號一鍵授權' }).click()
  // 跳到授權頁 → 假端點帶 code 回到回呼頁 → 換好金鑰回設定頁
  await page.waitForURL(/\/openrouter\/callback\?code=/)
  await expect(page).toHaveURL(/\/settings$/)
  await expect(page.getByText('已連結')).toBeVisible()
  await expect(page.getByText('今日免費額度剩 37 次')).toBeVisible()
  await expect(page.getByRole('button', { name: /模型\s*免費模型/ })).toBeVisible()

  expect(fake.challenge).toMatch(/^[A-Za-z0-9_-]{43}$/)
  expect(fake.exchangedVerifierMatches).toBe(true)
  const auth = fake.requests.find((r) => r.url.startsWith('https://openrouter.ai/auth?'))!
  const callback = new URL(new URL(auth.url).searchParams.get('callback_url')!)
  expect(callback.pathname).toBe('/openrouter/callback')
  expect(await secretsInDb(page)).toMatchObject([{ apiKey: FAKE_KEY, via: 'oauth' }])
  expectKeyOnlyToOpenRouter(requestsCarryingKey(fake))
})

test('貼金鑰：格式錯 → 欄位下方紅字；正確 → 驗證後已連結，重新整理仍在', async ({ page }) => {
  const fake = await fakeOpenRouter(page)
  await page.goto('/settings')
  await page.getByRole('button', { name: '改用貼上金鑰' }).click()
  await expect(page).toHaveURL(/\/openrouter$/)
  await page.getByLabel('金鑰').fill('3f9a-not-a-key')
  await page.getByRole('button', { name: '驗證並儲存' }).click()
  await expect(page.getByRole('alert')).toHaveText(
    '金鑰無效：請確認是否完整貼上（應以 sk-or- 開頭）',
  )
  await page.getByLabel('金鑰').fill(FAKE_KEY)
  await page.getByRole('button', { name: '驗證並儲存' }).click()
  await expect(page).toHaveURL(/\/settings$/)
  await expect(page.getByText('已連結')).toBeVisible()
  await page.reload()
  await expect(page.getByText('已連結')).toBeVisible()
  expect(await secretsInDb(page)).toMatchObject([{ apiKey: FAKE_KEY, via: 'paste' }])
  expectKeyOnlyToOpenRouter(requestsCarryingKey(fake))
})

test('清除金鑰：解除連結（二次確認）→ 未設定、本機不再有金鑰', async ({ page }) => {
  await fakeOpenRouter(page)
  await page.goto('/openrouter')
  await page.getByLabel('金鑰').fill(FAKE_KEY)
  await page.getByRole('button', { name: '驗證並儲存' }).click()
  await expect(page.getByText('已連結')).toBeVisible()
  await page.getByRole('button', { name: '解除連結' }).click()
  const dialog = page.getByRole('alertdialog')
  await expect(dialog).toContainText('解除 OpenRouter 連結？')
  await dialog.getByRole('button', { name: '解除連結' }).click()
  await expect(page.getByText('狀態：未設定')).toBeVisible()
  expect(await secretsInDb(page)).toEqual([])
})

test('寫作題：AI 批改結果（假端點）→ 下一題額度用完 → 批改失敗保留參考答案', async ({ page }) => {
  test.setTimeout(90_000)
  const fake = await fakeOpenRouter(page)
  fake.grades = [
    gradeOk({
      isCorrect: false,
      corrected: 'I have an apple and a banana.',
      errors: [
        {
          original: 'a apple',
          corrected: 'an apple',
          explanationZh: 'apple 是母音開頭，前面用 an。',
        },
      ],
      explanationZh: '可數名詞單數前要加 a 或 an。',
      levelOk: true,
    }),
    {
      status: 429,
      body: { error: { code: 429, message: 'Rate limit exceeded: free-models-per-day' } },
    },
  ]
  await page.goto('/openrouter')
  await page.getByLabel('金鑰').fill(FAKE_KEY)
  await page.getByRole('button', { name: '驗證並儲存' }).click()
  await expect(page.getByText('已連結')).toBeVisible()

  await page.goto(`/lesson/${LESSON}`)
  await playTo(page, WRITE_STEPS[0])
  await expect(page.getByText('中翻英')).toBeVisible()
  await page.getByRole('textbox', { name: '你的句子' }).fill('I have a apple and a banana.')
  await page.getByRole('button', { name: '送出批改' }).click()
  await expect(page.getByText('建議寫法')).toBeVisible()
  await expect(page.locator('mark')).toHaveText('a apple')
  await expect(page.getByText('由你的 OpenRouter 帳號批改')).toBeVisible()
  const sent = fake.requests.find((r) => r.url === 'https://openrouter.ai/api/v1/chat/completions')!
  expect(JSON.parse(sent.body)).toMatchObject({
    models: ['qwen/qwen3.8-27b:free', 'apodex/apodex-1.1-mini:free'],
    provider: { data_collection: 'deny' },
  })
  await page.getByRole('button', { name: '我懂了，繼續' }).click()
  // 穿插順序：中翻英與造句之間還有聽、讀各一題
  for (let n = WRITE_STEPS[0] + 1; n < WRITE_STEPS[1]; n++) {
    await answer(page, n)
    await next(page)
  }

  await expect(page.getByText('造句')).toBeVisible()
  await page.getByRole('textbox', { name: '你的句子' }).fill('The pen is on the desk.')
  await page.getByRole('button', { name: '送出批改' }).click()
  const alert = page.getByRole('alert')
  await expect(alert).toContainText('AI 批改暫時無法使用')
  await expect(alert).toContainText('今日免費額度已用完。可以先對照參考答案，或到設定換一個模型。')
  await expect(page.getByText('The bag is under the chair.')).toBeVisible()
  await page.getByRole('button', { name: '繼續' }).click()
  for (let n = WRITE_STEPS[1] + 1; n <= STEPS.length; n++) {
    await answer(page, n)
    await next(page)
  }
  // 錯題重做（創辦人試用 2026-10-04 ⑤）：AI 判錯與批改失敗的兩題再出一輪；重做時跳過就不再出
  await retryCount(page, 1, 2)
  await page.getByRole('button', { name: '跳過' }).click()
  await retryCount(page, 2, 2)
  await page.getByRole('button', { name: '跳過' }).click()
  await expect(page.getByTestId('lesson-done')).toContainText(`${STEPS.length} 題`)
  expectKeyOnlyToOpenRouter(requestsCarryingKey(fake))
})

test('沒有金鑰：寫作題對照參考答案自評、提示去設定（AC#3）', async ({ page }) => {
  test.setTimeout(90_000)
  const fake = await fakeOpenRouter(page)
  await page.goto(`/lesson/${LESSON}`)
  await playTo(page, WRITE_STEPS[0])
  await page.getByRole('textbox', { name: '你的句子' }).fill('I have an apple and a banana.')
  await page.getByRole('button', { name: '送出批改' }).click()
  await expect(page.getByText('跟參考答案比一比，意思一樣嗎？')).toBeVisible()
  await expect(page.getByText('設定 OpenRouter 帳號後可以用 AI 批改')).toBeVisible()
  await page.getByRole('button', { name: '去設定' }).click()
  await expect(page).toHaveURL(/\/settings$/)
  expect(fake.requests.filter((r) => r.url.includes('/chat/completions'))).toEqual([])
})

// 走查 P2：回呼失敗路徑（單元測試見 OpenRouterCallback.test.tsx）——不存金鑰、回設定頁顯示「授權沒有完成」
for (const c of [
  { name: '授權碼錯（假端點換金鑰回 403）', code: 'wrong-code', verifier: 'v'.repeat(43) },
  { name: 'verifier 不見（換了分頁）', code: 'e2e-auth-code', verifier: null },
])
  test(`一鍵授權失敗：${c.name}`, async ({ page }) => {
    const fake = await fakeOpenRouter(page)
    await page.goto('/settings')
    await page.evaluate((v) => {
      if (v) sessionStorage.setItem('linguaapp.openrouter.pkce', v)
    }, c.verifier)
    await page.goto(`/openrouter/callback?code=${c.code}`)
    await expect(page).toHaveURL(/\/settings$/)
    await expect(page.getByRole('alert')).toHaveText('授權沒有完成，請再試一次。')
    await expect(page.getByText('狀態：未設定')).toBeVisible()
    expect(await secretsInDb(page)).toEqual([])
    expect(requestsCarryingKey(fake)).toEqual([])
  })
