import { defineConfig, devices } from '@playwright/test'

// 有設定登入的建置（TASK-20）：登入畫面視覺 smoke 與跨裝置同步 e2e。不進 CI（CI 沒有 Supabase）。
// 跑法：repo 根先 supabase start，再
//   LINGUA_SYNC_ANON_KEY=<本機 anon key> LINGUA_SYNC_SERVICE_KEY=<本機 service_role key> npm run e2e:sync
// （兩把 key 由 `npx supabase@2.118.0 status -o env` 取得，本機公開示範值）
// 預設專屬埠 5298、輸出到 dist/sync，與一般 e2e（dist、5288）分開
const PORT = Number(process.env.E2E_SYNC_PORT ?? 5298)
const SUPABASE_URL = process.env.LINGUA_SYNC_SUPABASE_URL ?? 'http://127.0.0.1:55421'
const ANON_KEY = process.env.LINGUA_SYNC_ANON_KEY ?? ''

export default defineConfig({
  testDir: './e2e-sync',
  workers: 1,
  reporter: [['list'], ['html', { open: 'never', outputFolder: 'playwright-report/sync' }]],
  outputDir: 'test-results/sync',
  use: {
    baseURL: `http://localhost:${PORT}`,
    trace: 'retain-on-failure',
  },
  projects: [
    { name: 'webkit-iphone15', use: { ...devices['iPhone 15'] } },
    { name: 'chromium-pixel7', use: { ...devices['Pixel 7'] } },
  ],
  webServer: {
    command: `npx vite build --outDir dist/sync && npx vite preview --outDir dist/sync --port ${PORT}`,
    url: `http://localhost:${PORT}`,
    reuseExistingServer: false,
    timeout: 120_000,
    env: {
      VITE_SUPABASE_URL: SUPABASE_URL,
      VITE_SUPABASE_ANON_KEY: ANON_KEY || 'missing-anon-key',
      VITE_AUTH_GOOGLE: 'true',
      // 讓 e2e 以真實資料層模擬學習（學習畫面待 TASK-11 之後）
      VITE_E2E_HOOKS: 'true',
      // 題目來源換成樣本課 fixture（TASK-18 settle-sync.spec 走真實小課畫面）
      VITE_ITEM_FIXTURES: 'true',
    },
  },
})
