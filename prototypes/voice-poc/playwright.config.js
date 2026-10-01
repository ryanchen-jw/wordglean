import { defineConfig, devices } from '@playwright/test';
import { fileURLToPath } from 'node:url';

const fakeMic = fileURLToPath(new URL('./fixtures/librispeech/6930-75918-0007.wav', import.meta.url));
const PLAIN = 5317;
const COI = 5318;

const chromiumArgs = [
  '--enable-unsafe-webgpu',
  '--use-fake-ui-for-media-stream',
  '--use-fake-device-for-media-stream',
  `--use-file-for-fake-audio-capture=${fakeMic}%noloop`,
];

export default defineConfig({
  testDir: 'tests/e2e',
  workers: 1,
  fullyParallel: false,
  retries: 0,
  timeout: 30 * 60 * 1000,
  reporter: [['list']],
  webServer: [
    // 不重用既有 server：避免打到別的 checkout 的同埠服務
    { command: `npx vite preview --port ${PLAIN} --strictPort`, port: PLAIN, reuseExistingServer: false, timeout: 120000 },
    { command: `npx vite preview --port ${COI} --strictPort`, port: COI, reuseExistingServer: false, timeout: 120000, env: { COI: '1' } },
  ],
  projects: [
    { name: 'chromium-android', use: { ...devices['Pixel 7'], baseURL: `http://localhost:${PLAIN}`, launchOptions: { channel: 'chromium', args: chromiumArgs }, permissions: ['microphone'] } },
    { name: 'chromium-android-coi', grep: / (C|F)\. /, use: { ...devices['Pixel 7'], baseURL: `http://localhost:${COI}`, launchOptions: { channel: 'chromium', args: chromiumArgs } } },
    { name: 'webkit-ios', use: { ...devices['iPhone 15'], baseURL: `http://localhost:${PLAIN}` } },
  ],
});
