// TASK-22 效能預算：首屏（第一次開首頁）JS ≤ 200KB gzip，以建置產物實測（回應內容在此 gzip 壓縮後計量）；
// 字典切片、單字總表、語音模型與其 Worker／推論引擎一律延遲載入——首屏的頁面請求不得出現。
// AI 批改的 opencc 簡轉繁字典（cn2t，TASK-15 v3）只在批改回應到達時載入
// 只量頁面發出的請求；service worker 在 load 之後背景預快取（含字典，TASK-16 D1 離線查字）不在首屏內
import { gzipSync } from 'node:zlib'
import { expect, test } from '@playwright/test'

const JS_BUDGET = 200_000
const LAZY = /lexicon|\/dict\/|cn2t|\.onnx|\.wasm|ort-wasm|kokoro|stt\.worker|huggingface|jsdelivr/

test('首屏 JS ≤ 200KB gzip，且不載字典、單字總表、語音模型', async ({ page }, info) => {
  await page.addInitScript(() => localStorage.setItem('lg.installDismissed', '1'))
  const got: { url: string; type: string; gz: number }[] = []
  page.on('response', async (res) => {
    const body = await res.body().catch(() => null)
    if (body)
      got.push({ url: res.url(), type: res.request().resourceType(), gz: gzipSync(body).length })
  })
  await page.goto('/')
  await expect(page.getByTestId('screen-home')).toBeVisible()
  await page.waitForLoadState('networkidle')

  const js = got.filter((r) => r.type === 'script')
  const total = js.reduce((n, r) => n + r.gz, 0)
  info.annotations.push({
    type: '首屏 JS（gzip）',
    description: `${total} bytes：${js.map((r) => `${new URL(r.url).pathname} ${r.gz}`).join('、')}`,
  })
  expect(total).toBeLessThanOrEqual(JS_BUDGET)
  expect(got.map((r) => r.url).filter((u) => LAZY.test(u))).toEqual([])
})
