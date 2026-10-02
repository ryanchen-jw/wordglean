import { defineConfig } from '@playwright/test'

// 高音質發音（Kokoro）真模型測試（TASK-13 AC#1 後半）：本機選用、不進 CI。
// 走 chromium 真 GPU（channel: 'chromium'＋--enable-unsafe-webgpu，同 TASK-1 原型），下載約 310MB、單一行程約 1.7GB。
// 跑前先單獨量空閒記憶體 ≥3GB；模型檔第一次從 Hugging Face 抓下後存 gitignored 的 .tts-model-cache/，之後重跑不再連網。
// 跑法：E2E_TTS_PORT=<埠> npm run e2e:tts（預設 5308、輸出 dist/tts，與一般 e2e 分開）
const PORT = Number(process.env.E2E_TTS_PORT ?? 5308)

export default defineConfig({
  testDir: './e2e-tts',
  workers: 1,
  retries: 0,
  timeout: 20 * 60_000,
  reporter: [['list']],
  outputDir: 'test-results/tts',
  use: {
    baseURL: `http://localhost:${PORT}`,
    trace: 'retain-on-failure',
  },
  // 瀏覽器由測試自己以持久設定檔啟動（模型快取留在 .tts-model-cache/profile），見 e2e-tts/kokoro-real.spec.ts
  projects: [{ name: 'chromium-gpu' }],
  webServer: {
    command: `npx vite build --outDir dist/tts && npx vite preview --outDir dist/tts --port ${PORT}`,
    url: `http://localhost:${PORT}`,
    reuseExistingServer: false,
    timeout: 180_000,
    // 題目來源用樣本課（第 9 題為聽音打字）
    env: { VITE_ITEM_FIXTURES: 'true' },
  },
})
