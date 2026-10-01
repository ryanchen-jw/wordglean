import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import { defineConfig } from 'vitest/config'

// dev／preview 用固定專屬埠，被占用就直接失敗，避免打到別人的 server
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg'],
      workbox: {
        // 課綱 json 資產一併預快取，離線可開課程地圖
        globPatterns: ['**/*.{js,css,html,json,svg,png}'],
        // 站內路由（/words、/settings…）離線時都回 index.html
        navigateFallback: 'index.html',
        // 字體依 unicode-range 分片、總量大，不預快取；用到哪片快取哪片
        runtimeCaching: [
          {
            urlPattern: ({ request }) => request.destination === 'font',
            handler: 'CacheFirst',
            options: { cacheName: 'lg-fonts', expiration: { maxEntries: 300 } },
          },
        ],
      },
      // 佔位圖示，設計定版（TASK-3）後替換
      manifest: {
        name: 'LinguaApp',
        short_name: 'LinguaApp',
        lang: 'zh-Hant-TW',
        display: 'standalone',
        theme_color: '#f6f1e7',
        background_color: '#f6f1e7',
        icons: [
          { src: 'icons/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icons/icon-512.png', sizes: '512x512', type: 'image/png' },
        ],
      },
    }),
  ],
  // 課綱檔在 app 之外（../content/curriculum），dev server 需明列允許
  server: { port: 5287, strictPort: true, fs: { allow: ['.', '../content/curriculum'] } },
  preview: { port: 5288, strictPort: true },
  test: {
    environment: 'jsdom',
    include: ['src/**/*.test.{ts,tsx}'],
    setupFiles: ['./src/test/setup.ts'],
  },
})
