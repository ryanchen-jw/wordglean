import { defineConfig } from 'vite';

// COI=1 時加 COOP/COEP（跨來源隔離）：chromium 才能用 measureUserAgentSpecificMemory，
// 但同時會開啟多執行緒 WASM，與一般部署行為不同 → 量測時兩種都跑。
const coi = process.env.COI === '1';
const headers = coi
  ? { 'Cross-Origin-Opener-Policy': 'same-origin', 'Cross-Origin-Embedder-Policy': 'require-corp' }
  : {};

export default defineConfig({
  publicDir: 'fixtures',
  server: { port: Number(process.env.PORT || 5317), strictPort: true, headers, allowedHosts: true },
  preview: { headers, allowedHosts: true },
  worker: { format: 'es' },
  optimizeDeps: { exclude: ['@huggingface/transformers', 'kokoro-js'] },
});
