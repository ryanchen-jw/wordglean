import { resolve } from 'node:path'
import { defineConfig, devices } from '@playwright/test'

// 跟讀（TASK-14）e2e：建置帶 VITE_E2E_SPEECH（可換假辨識／假麥克風）與樣本課題目，輸出到 dist/speech。不進 CI。
// - lesson-order：能跟讀時一課的出題順序（TASK-18 穿插，含跟讀）
// - speech-visual：06 視覺 smoke，s04 各狀態兩引擎截圖（假辨識，不下載模型）
// - stt-real：真模型（Hugging Face 下載約 52MB）辨識 10 句預錄音檔（AC#2）＋假麥克風錄音全程無上傳（AC#4）；只跑 chromium
// 跑法：E2E_PORT=<埠> npx playwright test --config playwright.speech.config.ts [--project=…]
const PORT = Number(process.env.E2E_PORT ?? 5308)
const MIC_WAV = resolve(import.meta.dirname, 'e2e-speech/fixtures/librispeech/6930-75918-0007.wav')

export default defineConfig({
  testDir: './e2e-speech',
  workers: 1,
  reporter: [['list'], ['html', { open: 'never', outputFolder: 'playwright-report/speech' }]],
  outputDir: 'test-results/speech',
  use: {
    baseURL: `http://localhost:${PORT}`,
    trace: 'retain-on-failure',
  },
  projects: [
    {
      name: 'webkit-iphone15',
      testMatch: ['speech-visual.spec.ts', 'lesson-order.spec.ts', 'regressions.spec.ts'],
      use: { ...devices['iPhone 15'] },
    },
    {
      name: 'chromium-pixel7',
      testMatch: ['speech-visual.spec.ts', 'lesson-order.spec.ts', 'regressions.spec.ts'],
      use: { ...devices['Pixel 7'] },
    },
    {
      name: 'chromium-stt-real',
      testMatch: 'stt-real.spec.ts',
      use: {
        ...devices['Pixel 7'],
        permissions: ['microphone'],
        launchOptions: {
          // 假麥克風：播放預錄音檔（LibriSpeech 0007），不需真人錄音
          args: [
            '--use-fake-ui-for-media-stream',
            '--use-fake-device-for-media-stream',
            `--use-file-for-fake-audio-capture=${MIC_WAV}`,
          ],
        },
      },
    },
  ],
  webServer: {
    command: `npx vite build --outDir dist/speech && npx vite preview --outDir dist/speech --port ${PORT} --strictPort`,
    url: `http://localhost:${PORT}`,
    reuseExistingServer: false,
    timeout: 240_000,
    env: { VITE_E2E_SPEECH: 'true', VITE_ITEM_FIXTURES: 'true' },
  },
})
