// TASK-39 實驗 1（設計 §7）：原型頁 3／4／6 秒視窗每輪辨識耗時（中位數、P90）。
// 真模型＋假麥克風（循環播放 LibriSpeech 0007），走原型頁的真實路徑（AudioWorklet → 環形緩衝 → 辨識迴圈）；
// 每個視窗取收音滿一個視窗之後的 ROUNDS 輪（第 1 輪另列、不計入統計，視同暖機）。
// chromium-live-real＝WASM、chromium-live-webgpu＝WebGPU；結果寫 test-results 的 exp1-<project>.json。
// 跑法：E2E_PORT=<埠> npx playwright test --config playwright.speech.config.ts --project=chromium-live-real live-exp1
import { writeFile } from 'node:fs/promises'
import { expect, test } from '@playwright/test'
import { openLivePage, readRows, webgpu, type Row } from './live.js'

/** 百分位數（線性內插，同 src/speech/liveStt.ts 的 percentile；該檔的相對 import 不合 e2e 的 node16 解析） */
function percentile(values: number[], p: number): number {
  const s = [...values].sort((a, b) => a - b)
  const idx = p * (s.length - 1)
  const lo = Math.floor(idx)
  return s[lo] + (s[Math.min(lo + 1, s.length - 1)] - s[lo]) * (idx - lo)
}

const ROUNDS = Number(process.env.LIVE_EXP1_ROUNDS ?? 21)

test('實驗 1：各視窗每輪耗時', async ({ page }, info) => {
  test.setTimeout(30 * 60_000)
  await openLivePage(page)
  const gpu = await webgpu(page)
  await page.getByRole('button', { name: 'Continuous 60 s' }).click()

  const result: Record<string, unknown>[] = []
  for (const win of [3, 4, 6]) {
    await page.getByRole('button', { name: `${win} s` }).click()
    await page.getByRole('button', { name: 'Start' }).click()
    // 等緩衝滿一個視窗再開始算
    await expect
      .poll(async () => (await readRows(page)).filter((r) => r.at >= win).length, {
        timeout: 120_000,
        intervals: [500],
      })
      .toBeGreaterThanOrEqual(ROUNDS)
    await page.getByRole('button', { name: 'Stop' }).click()
    const all: Row[] = await readRows(page)
    // 收音未滿一個視窗的輪次（音訊較短、較快）不計
    const rows = all.filter((r) => r.at >= win).slice(0, ROUNDS)
    const ms = rows.slice(1).map((r) => r.ms)
    result.push({
      windowSec: win,
      rounds: ms.length,
      warmupRounds: all.length - all.filter((r) => r.at >= win).length,
      firstRoundMs: rows[0].ms,
      medianMs: Math.round(percentile(ms, 0.5)),
      p90Ms: Math.round(percentile(ms, 0.9)),
      minMs: Math.min(...ms),
      maxMs: Math.max(...ms),
      texts: rows.map((r) => r.text),
    })
  }
  const summary = { project: info.project.name, webgpu: gpu, roundsPerWindow: ROUNDS - 1, result }
  const json = JSON.stringify(summary, null, 2)
  await writeFile(info.outputPath(`exp1-${info.project.name}.json`), json)
  await info.attach(`exp1-${info.project.name}.json`, {
    body: json,
    contentType: 'application/json',
  })
  for (const r of result)
    info.annotations.push({
      type: `${r.windowSec} 秒視窗`,
      description: `中位數 ${r.medianMs} ms、P90 ${r.p90Ms} ms（${r.rounds} 輪，${gpu ? 'WebGPU' : 'WASM'}）`,
    })
  console.log(json)
})
