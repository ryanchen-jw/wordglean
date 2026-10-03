import { execSync } from 'node:child_process'
import { defineConfig, devices } from '@playwright/test'

// 有設定登入的建置（TASK-20）：登入畫面視覺 smoke 與跨裝置同步 e2e。不進 CI（CI 沒有 Supabase）。
// 跑法：repo 根先 supabase start，再 npm run e2e:sync
// 兩把 key（本機公開示範值）沒以 LINGUA_SYNC_ANON_KEY／LINGUA_SYNC_SERVICE_KEY 給定時，
// 自動由 `npx supabase@2.118.0 status -o env` 取得；Supabase 沒在跑則為空（測試 skip）
// 預設專屬埠 5298、輸出到 dist/sync，與一般 e2e（dist、5288）分開
if (!process.env.LINGUA_SYNC_ANON_KEY || !process.env.LINGUA_SYNC_SERVICE_KEY) {
  let status = ''
  try {
    status = execSync('npx --yes supabase@2.118.0 status -o env', {
      cwd: '..',
      encoding: 'utf-8',
      stdio: ['ignore', 'pipe', 'ignore'],
    })
  } catch {
    // Supabase 沒在跑
  }
  const read = (name: string) => new RegExp(`^${name}="?([^"\\r\\n]*)`, 'm').exec(status)?.[1]
  // 寫回 process.env：測試 worker 繼承（syncHelpers 讀 LINGUA_SYNC_SERVICE_KEY）
  process.env.LINGUA_SYNC_ANON_KEY ||= read('ANON_KEY') ?? ''
  process.env.LINGUA_SYNC_SERVICE_KEY ||= read('SERVICE_ROLE_KEY') ?? ''
}
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
      // 跟讀固定不可用（同 playwright.config.ts）：chromium 不出跟讀題，小課走「無 STT」替代路徑
      VITE_E2E_STT: 'off',
    },
  },
})
