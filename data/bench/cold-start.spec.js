import { writeFileSync } from 'node:fs';
import { test, expect } from '@playwright/test';

// AC#4：瀏覽器端查一個字的冷啟動延遲 < 300ms（每次新 context＝空快取）。
// 量的是 lookup() 從呼叫到拿到結果：抓 manifest＋抓切片＋JSON 解析。
const WORDS = ['light', 'went', 'communication', 'zebra', 'a'];
const RUNS = 3;

test('cold lookup under 300ms', async ({ browser }, testInfo) => {
  const results = [];
  for (const word of WORDS) {
    for (let i = 0; i < RUNS; i++) {
      const context = await browser.newContext(testInfo.project.use);
      const page = await context.newPage();
      await page.goto('/bench/lookup.html');
      await expect(page).toHaveTitle('linguaapp-dict-bench'); // 確認打到的是本 checkout 的伺服器
      const r = await page.evaluate((w) => lookup(w), word);
      expect(r.entry ?? r.forms, word).not.toBeNull();
      results.push({ word, run: i + 1, ms: Math.round(r.ms * 10) / 10 });
      await context.close();
    }
  }
  const ms = results.map((r) => r.ms).sort((a, b) => a - b);
  const summary = {
    device: 'chromium Pixel 7 emulation, no network throttling, python http.server (no gzip)',
    runs: results.length,
    medianMs: ms[Math.floor(ms.length / 2)],
    maxMs: ms[ms.length - 1],
    results,
  };
  writeFileSync('../reports/bench-cold.json', JSON.stringify(summary, null, 2) + '\n');
  console.log(JSON.stringify(summary));
  expect(summary.maxMs).toBeLessThan(300);
});
