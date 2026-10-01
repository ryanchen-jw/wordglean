# app/ — 手機版 PWA

React＋Vite＋TypeScript＋TailwindCSS；PWA 由 vite-plugin-pwa 產生 service worker。只做手機版。
產品規格以 `../docs/spec/requirements.md` 為準。

## 指令（皆在 `app/` 下執行）

| 指令                | 用途                                                                                               |
| ------------------- | -------------------------------------------------------------------------------------------------- |
| `npm ci`            | 安裝依賴（worktree 內各自安裝，禁 junction／symlink 連主 checkout 的 node_modules）                |
| `npm run dev`       | dev server，固定埠 **5287**（strictPort，被占用直接失敗）                                          |
| `npm run build`     | typecheck＋產出 `dist/`（含 `sw.js`、`manifest.webmanifest`）                                      |
| `npm run preview`   | 以 build 產物起 server，固定埠 **5288**（strictPort）                                              |
| `npm run lint`      | ESLint＋Prettier 檢查                                                                              |
| `npm run format`    | Prettier 自動排版                                                                                  |
| `npm run typecheck` | `tsc -b`（app／node／e2e 三份 tsconfig）                                                           |
| `npm test`          | Vitest 單元測試（jsdom）                                                                           |
| `npm run e2e`       | Playwright 手機模擬 e2e（自動 build＋preview）；`E2E_PORT` 可改埠                                  |
| `npm run e2e:sync`  | 登入與同步 e2e＋登入畫面視覺 smoke（需本機 Supabase，跑法見 `playwright.sync.config.ts`；不進 CI） |

首次跑 e2e 前：`npx playwright install webkit chromium`（CI 用 `--with-deps`）。

## 資料夾結構

```
app/
├── src/
│   ├── App.tsx          佔位頁（設計定版 TASK-3 前不做畫面）
│   ├── main.tsx         進入點
│   ├── index.css        Tailwind 進入點（tailwindcss＋design/tokens.css＋design/theme.css）
│   ├── design/          設計 tokens（tokens.css 唯一數值來源、theme.css 接 Tailwind 4 @theme、
│   │                    tokens.test.ts 守 WCAG AA）；規格見 ../docs/design/
│   ├── *.test.tsx       單元測試與受測檔放在一起
│   └── test/setup.ts    Vitest 共用設定（jest-dom matchers）
├── e2e/                 Playwright 測試
├── e2e-sync/            需本機 Supabase 的 e2e（TASK-20 登入同步）
├── public/icons/        PWA 佔位圖示（192／512，TASK-3 後替換）
├── vite.config.ts       Vite＋Tailwind＋PWA＋Vitest 設定、dev／preview 埠
├── playwright.config.ts 兩個手機 project 與 webServer
└── tsconfig.{app,node,e2e}.json
```

## 測試方式

- **單元（Vitest＋Testing Library）**：`src/**/*.test.{ts,tsx}`；以使用者看得到的文字／testid 斷言，期望值寫字面值、不從實作重算。
- **e2e（Playwright）**：兩個 project——`webkit-iphone15`（iOS 模擬）、`chromium-pixel7`（Android 模擬）。
  - webServer 跑 `build && preview`（埠 5288），`reuseExistingServer: false`：埠被別人占用時直接失敗，避免打到別的 checkout。
  - smoke 先核對識別字串（`data-testid="app-placeholder"`、「LinguaApp 骨架建置中」）再斷言 service worker。
  - 已知限制：Playwright 的 WebKit（Windows build）在 `setOffline` 後 reload 會丟 internal error，離線重載只在 chromium 驗。
- **CI**：`../.github/workflows/ci.yml`——lint → typecheck → unit → e2e → build，不部署。
- 測試勿寫死 `toLocaleString('zh-TW')` 的輸出（新版 ICU 會出細空格，本機與 CI 不一致）。
