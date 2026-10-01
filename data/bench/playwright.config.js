import { defineConfig, devices } from '@playwright/test';

// 只量字典切片冷啟動延遲；以 data/ 為根起靜態伺服器，專屬埠 5291。
export default defineConfig({
  testDir: '.',
  testMatch: 'cold-start.spec.js',
  workers: 1,
  reporter: 'list',
  use: { baseURL: 'http://127.0.0.1:5291' },
  projects: [{ name: 'chromium-pixel7', use: { ...devices['Pixel 7'] } }],
  webServer: {
    command: 'python -m http.server 5291 --bind 127.0.0.1 --directory ..',
    url: 'http://127.0.0.1:5291/bench/lookup.html',
    reuseExistingServer: false,
    timeout: 30_000,
  },
});
