// TASK-39 即時跟讀原型頁 e2e 共用：開原型頁、下載並載入真模型（第一次自 Hugging Face 下載）、讀每輪紀錄
import { resolve } from 'node:path'
import { expect, type Page } from '@playwright/test'

export const FIXTURES = resolve(import.meta.dirname, 'fixtures/librispeech')

export interface Row {
  index: number
  ms: number
  windowSec: number
  /** 送出時已收音的秒數 */
  at: number
  text: string
}

/** 開原型頁並等模型可用；測試音檔以 /__fixtures/librispeech/<檔名> 提供 */
export async function openLivePage(page: Page) {
  await page.addInitScript(() => localStorage.setItem('lg.installDismissed', '1'))
  await page.route('**/__fixtures/librispeech/*.wav', (route) =>
    route.fulfill({
      path: resolve(FIXTURES, new URL(route.request().url()).pathname.split('/').pop()!),
      contentType: 'audio/wav',
    }),
  )
  await page.goto('/debug/live-shadowing')
  await expect(page.getByTestId('screen-live-shadowing')).toBeVisible()
  await page.getByRole('button', { name: /Download model|Load model/ }).click()
  await expect(page.getByTestId('live-model')).toHaveText('Model: ready', { timeout: 10 * 60_000 })
}

/** 畫面上的每輪紀錄（舊到新） */
export async function readRows(page: Page): Promise<Row[]> {
  const rows = await page
    .getByTestId('live-round')
    .evaluateAll((lis) =>
      lis.map((li) => [
        (li as HTMLElement).dataset.at ?? '',
        ...[...li.children].map((c) => c.textContent ?? ''),
      ]),
    )
  return rows
    .map(([at, idx, timing, text]) => {
      const m = /(\d+) ms · (\d+)s/.exec(timing)!
      return {
        index: Number(idx.slice(1)),
        ms: Number(m[1]),
        windowSec: Number(m[2]),
        at: Number(at),
        text,
      }
    })
    .reverse()
}

/** 本頁的 WebGPU 是否可用（辨識 Worker 以同一判斷選 WebGPU 或 WASM） */
export const webgpu = (page: Page) =>
  page.evaluate(async () => {
    const gpu = (navigator as Navigator & { gpu?: { requestAdapter(): Promise<unknown> } }).gpu
    return !!(gpu && (await gpu.requestAdapter().catch(() => null)))
  })
