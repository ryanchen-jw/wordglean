import { defineConfig, devices } from '@playwright/test'

// 對 build 產物（vite preview，預設專屬埠 5288）跑，才驗得到 PWA service worker
// E2E_PORT 可改埠：多個 worktree 並行時各用自己的埠（strictPort，被占用直接失敗）
const PORT = Number(process.env.E2E_PORT ?? 5288)

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [['list'], ['html', { open: 'never' }]] : 'list',
  use: {
    baseURL: `http://localhost:${PORT}`,
    trace: 'on-first-retry',
  },
  projects: [
    { name: 'webkit-iphone15', use: { ...devices['iPhone 15'] } },
    { name: 'chromium-pixel7', use: { ...devices['Pixel 7'] } },
  ],
  webServer: {
    command: `npm run build && npm run preview -- --port ${PORT}`,
    url: `http://localhost:${PORT}`,
    // 不重用既有 server：埠被別人占用時直接失敗，避免打到別的 checkout
    reuseExistingServer: false,
    timeout: 120_000,
  },
})
