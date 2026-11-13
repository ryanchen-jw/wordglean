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
      includeAssets: [
        'favicon.svg',
        'icons/favicon-32.png',
        'icons/favicon-16.png',
        'icons/apple-touch-icon.png',
      ],
      workbox: {
        // 課綱、字典切片（597 片）、單字總表等 json 資產一併預快取：離線可開課程地圖、可查字（TASK-16 D1）
        // 預產發音音檔包（.lga，TASK-35）不在此列：首次開啟不下載全部，用到才抓（見下方 runtimeCaching）
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
          // 預產發音音檔包（TASK-35；一課一包約 0.1MB、字典專用包 512 包）：進課或點字時才抓，之後離線可播；
          // 檔名帶內容雜湊，內容變了網址就變，舊包由 maxEntries 淘汰
          {
            urlPattern: ({ url }) => url.pathname.endsWith('.lga'),
            handler: 'CacheFirst',
            options: {
              cacheName: 'lg-audio',
              expiration: { maxEntries: 2000, purgeOnQuotaError: true },
            },
          },
          // 推論引擎 ort wasm（約 21MB，放本站、不連 jsDelivr；TASK-14 語音辨識）：
          // 不預快取，第一次用到才抓、之後離線可用
          {
            urlPattern: ({ url }) => /\/ort-wasm-[^/]*\.(wasm|mjs)$/.test(url.pathname),
            handler: 'CacheFirst',
            options: { cacheName: 'lg-stt-runtime', expiration: { maxEntries: 4 } },
          },
        ],
      },
      // 品牌定版（TASK-25）：any＝圓角四角透明，maskable＝滿版、字卡縮進安全範圍；原檔與產生腳本見 scripts/brand-icons.mjs
      manifest: {
        name: '拾字',
        short_name: '拾字',
        lang: 'zh-Hant-TW',
        display: 'standalone',
        theme_color: '#f6f1e7',
        background_color: '#f6f1e7',
        icons: [
          { src: 'icons/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
          { src: 'icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
          {
            src: 'icons/icon-maskable-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
    }),
  ],
  // 課綱、題目檔、分級題本、字典資料在 app 之外，dev server 需明列允許
  server: {
    port: 5287,
    strictPort: true,
    fs: {
      allow: [
        '.',
        '../content/curriculum',
        '../content/items',
        '../content/placement',
        '../content/audio',
        '../data/dict',
        '../data/lexicon',
        '../data/phrases',
      ],
    },
  },
  // data/ 依來源授權分檔（data/LICENSES.md），小檔也不得內嵌進程式碼 bundle，一律輸出成獨立資產
  build: {
    // 預產音檔包（.lga）也一律是獨立資產
    assetsInlineLimit: (file) =>
      /\/data\/(dict|lexicon|phrases)\/[^/]+\.json$/.test(file) || file.endsWith('.lga')
        ? false
        : undefined,
  },
  preview: { port: 5288, strictPort: true },
  // 語音辨識 Worker（TASK-14）內有動態 import，需用 ES module worker
  worker: { format: 'es' },
  test: {
    environment: 'jsdom',
    include: ['src/**/*.test.{ts,tsx}'],
    setupFiles: ['./src/test/setup.ts'],
  },
})
