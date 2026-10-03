// TASK-13 AC#2：高音質發音（Kokoro 選配）強制失敗時自動退回手機內建聲音，且畫面有提示；
// 另驗設定頁「下載前告知 → 下載失敗 → 重試」與崩潰旗標。
// 模擬支援 WebGPU 的手機（navigator.gpu 替身）；Hugging Face／jsDelivr 一律攔下回失敗，絕不真的下載 310MB
import { expect, test, type BrowserContext, type Page } from '@playwright/test'
import { LESSON, playTo } from './lesson.js'
import { measureMobile } from './measure.js'
import { fakeSystemVoice, lastSpoken } from './speech.js'

// Service Worker 會接手請求、讓攔截失效；本檔不需要離線能力
test.use({ serviceWorkers: 'block' })

const MODEL_ONNX =
  'https://huggingface.co/onnx-community/Kokoro-82M-v1.0-ONNX/resolve/main/onnx/model.onnx'

/** 攔下所有模型與執行環境的下載；回傳被攔下的網址（證明攔截有作用、沒有漏到網路） */
async function blockModelHosts(context: BrowserContext) {
  const blocked: string[] = []
  await context.route(/^https:\/\/(huggingface\.co|cdn\.jsdelivr\.net|[^/]*\.hf\.co)\//, (r) => {
    blocked.push(r.request().url())
    return r.abort('internetdisconnected')
  })
  return blocked
}

async function webGpuPhone(page: Page) {
  await page.addInitScript(() => {
    localStorage.setItem('lg.installDismissed', '1')
    Object.defineProperty(navigator, 'gpu', { value: { requestAdapter: async () => ({}) } })
  })
  await fakeSystemVoice(page)
}

/** 設成「已下載、已選用高音質」：模型快取放一個壞掉的 model.onnx，載入必定失敗 */
async function chooseHq(page: Page, browserName: string) {
  // Playwright 的 WebKit（Windows build）Cache Storage 不跨導覽保留（2026-10-02 實測：put 後 reload，keys() 為空），
  // 「已下載」狀態在它上面做不出來；真機 Safari 無此問題，AC#2 以 chromium 驗
  test.skip(browserName === 'webkit', 'WebKit（Windows build）Cache Storage 不跨導覽保留')
  await page.goto('/settings')
  await page.evaluate(async (url) => {
    localStorage.setItem('lg.ttsHq.downloaded', '1')
    localStorage.setItem('lg.ttsVoice', 'hq')
    await (await caches.open('transformers-cache')).put(url, new Response('broken'))
  }, MODEL_ONNX)
}

test('高音質載入失敗：這一句改用手機內建聲音念、出現提示；說明改回「手機內建聲音」', async ({
  page,
  context,
  browserName,
}) => {
  const blocked = await blockModelHosts(context)
  await webGpuPhone(page)
  await chooseHq(page, browserName)
  await page.reload()
  await expect(page.getByRole('button', { name: /^發音\s*高音質發音$/ })).toBeVisible()

  await page.goto(`/lesson/${LESSON}`)
  await playTo(page, 9)
  // 選用高音質時不顯示「手機內建聲音」說明與第一次提示條
  await expect(page.getByText('手機內建聲音', { exact: true })).toHaveCount(0)
  await expect(page.getByTestId('hq-voice-hint')).toHaveCount(0)

  await page.getByRole('button', { name: '播放', exact: true }).click()
  await expect(page.getByTestId('hq-failed')).toHaveText('高音質發音無法使用，已改用手機內建聲音', {
    timeout: 30_000,
  })
  await expect
    .poll(() => lastSpoken(page))
    .toEqual({
      text: 'The book is in the bag.',
      rate: 1,
      lang: 'en-US',
    })
  await expect(page.getByText('手機內建聲音', { exact: true })).toBeVisible()
  expect(blocked.length).toBeGreaterThan(0)
})

test('上次載入到一半分頁被關掉（崩潰旗標還在）：不再載入，直接用內建聲音並提示', async ({
  page,
  context,
  browserName,
}) => {
  const blocked = await blockModelHosts(context)
  await webGpuPhone(page)
  await chooseHq(page, browserName)
  await page.evaluate(() => sessionStorage.setItem('lg.ttsHqLoading', '1'))
  await page.goto(`/lesson/${LESSON}`)
  await playTo(page, 9)
  await page.getByRole('button', { name: '播放', exact: true }).click()
  await expect(page.getByTestId('hq-failed')).toBeVisible()
  await expect.poll(() => lastSpoken(page)).toMatchObject({ text: 'The book is in the bag.' })
  expect(blocked).toEqual([])
})

test('設定：下載前告知 310MB；下載失敗顯示「下載中斷・重試」，發音仍是內建聲音', async ({
  page,
  context,
}) => {
  const blocked = await blockModelHosts(context)
  await webGpuPhone(page)
  await page.goto('/settings')
  // 保險：即使攔截漏掉，模型主檔也只會讀到這份壞檔、不會真的去下載 310MB
  await page.evaluate(async (url) => {
    await (await caches.open('transformers-cache')).put(url, new Response('broken'))
  }, MODEL_ONNX)
  await page.getByRole('button', { name: '下載高音質發音（選配）' }).click()
  const dialog = page.getByRole('alertdialog')
  await expect(dialog).toContainText('下載高音質發音？')
  await expect(dialog).toContainText('約 310MB，建議連上 Wi-Fi 再下載')
  // 定稿文案裡的英文（Wi-Fi）與 i18n 守衛同一份白名單，手機量測不誤判（TASK-22 移交）
  expect((await measureMobile(page)).latin).toEqual([])
  await dialog.getByRole('button', { name: '下載', exact: true }).click()
  await expect(page.getByRole('button', { name: '下載中斷・重試' })).toBeVisible({
    timeout: 30_000,
  })
  await expect(page.getByRole('button', { name: /^發音\s*手機內建聲音（預設）$/ })).toBeVisible()
  expect(blocked.length).toBeGreaterThan(0)
})

// 驗收 P1：App 更新後離線開啟，Worker 檔（不在預快取）載不到——不能整段無聲、下載不能卡在 0%
const workerNotFound = (context: BrowserContext) => {
  const hits: string[] = []
  return context
    .route(/\/assets\/kokoro\.worker-[^/]+\.js(\?.*)?$/, (r) => {
      hits.push(r.request().url())
      return r.fulfill({ status: 404, body: 'not found' })
    })
    .then(() => hits)
}

test('Worker 檔載不到（404）：已選高音質按播放，仍以內建聲音念出並提示', async ({
  page,
  context,
  browserName,
}) => {
  await blockModelHosts(context)
  const hits = await workerNotFound(context)
  await webGpuPhone(page)
  await chooseHq(page, browserName)
  await page.goto(`/lesson/${LESSON}`)
  await playTo(page, 9)
  await page.getByRole('button', { name: '播放', exact: true }).click()
  await expect(page.getByTestId('hq-failed')).toHaveText('高音質發音無法使用，已改用手機內建聲音', {
    timeout: 30_000,
  })
  await expect.poll(() => lastSpoken(page)).toMatchObject({ text: 'The book is in the bag.' })
  expect(hits.length).toBeGreaterThan(0)
})

test('Worker 檔載不到（404）：設定頁下載顯示「下載中斷・重試」', async ({ page, context }) => {
  await blockModelHosts(context)
  const hits = await workerNotFound(context)
  await webGpuPhone(page)
  await page.goto('/settings')
  await page.getByRole('button', { name: '下載高音質發音（選配）' }).click()
  await page.getByRole('alertdialog').getByRole('button', { name: '下載', exact: true }).click()
  await expect(page.getByRole('button', { name: '下載中斷・重試' })).toBeVisible({
    timeout: 30_000,
  })
  expect(hits.length).toBeGreaterThan(0)
})

test('沒有 WebGPU 的手機：高音質列顯示不支援、發音選單只有內建聲音', async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('lg.installDismissed', '1'))
  await page.addInitScript(() => Object.defineProperty(navigator, 'gpu', { value: undefined }))
  await page.goto('/settings')
  await expect(page.getByText('這支手機不支援高音質發音')).toBeVisible()
  await page.getByRole('button', { name: /^發音/ }).click()
  await expect(page.getByRole('option')).toHaveText(['手機內建聲音（預設）'])
})
