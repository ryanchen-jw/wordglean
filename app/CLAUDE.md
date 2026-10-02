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
│   ├── App.tsx          只渲染 AppRoutes（路由表在 routes.tsx；router.ts／Link.tsx 為自寫 history 路由）
│   ├── main.tsx         進入點（字體、外觀偏好先套再渲染）
│   ├── i18n/            介面文案 zh-TW.json（key＝<畫面>.<區塊>.<用途>，待 TASK-4 G3 定稿）＋ t()
│   ├── shell/           外框（頁首、底部導覽、離線條）、外觀／字級偏好、加到主畫面提示
│   ├── screens/         home／course／words／settings／lesson 畫面與其推導模型（*Model.ts）
│   ├── lesson/          題型引擎（TASK-12）：題目型別、佇列與題型登記、FSRS 評分對應、小課進度（續作）、
│   │                    結算；題目檔以獨立 json 資產載入（E2E 建置 VITE_ITEM_FIXTURES=true 改讀 fixtures/）
│   ├── dict/            字典（TASK-16）：可點英文字 EnglishText、字典彈層 DictionaryProvider、詞形還原與查找；
│   │                    字典切片（data/dict）與單字總表（data/lexicon）以獨立 json 資產預快取、不內嵌進 bundle
│   ├── curriculum/      課綱型別與查詢；課綱檔以獨立 json 資產載入（不併進程式碼 bundle）
│   ├── data/            Dexie 資料層、appDb.ts（App 唯一 db 實例）、匯出／清除
│   ├── download/        模型下載狀態型別與進度元件（骨架，TASK-13／14 接真下載）
│   ├── auth/、sync/     登入與同步（TASK-20）；帳號區塊掛在設定頁 AccountSection
│   ├── ui/              Button、Card、BottomSheet、OptionSheet、ChoiceOption、FeedbackBar、ConfirmDialog、Toast
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
  - smoke 先核對識別字串（`data-testid="screen-home"`）再斷言 service worker；`shell.spec`＝首次開啟流程，`offline.spec`＝離線重開首頁／單字庫／課程。
  - `visual-smoke.spec`＝06 視覺 smoke：五畫面全狀態兩引擎截圖（attach＋具名檔存 `test-results/`），斷言無溢出、單行控件不折行、可點 ≥44px、無英文介面字串、body 套 token 色。看報告：`PLAYWRIGHT_HTML_OUTPUT_DIR=playwright-report/visual-smoke npx playwright test e2e/visual-smoke.spec.ts --reporter=list,html` 後 `npx playwright show-report playwright-report/visual-smoke`。
  - `narrow.spec`＝320 標準／320 特大／375 特大下單字庫、設定、清除確認不破版（含子元素不伸出卡片、主鈕不留孤字）。手機量測（溢出、單行控件、44px、英文字串、body 色、容器內溢出）一律用 `e2e/measure.ts`，e2e-sync 也共用。
  - `lesson.spec`＝小課讀類三題型走完一課與續作；`lesson-visual.spec`＝小課各狀態截圖與窄螢幕／特大字級量測。e2e 的 webServer 帶 `VITE_ITEM_FIXTURES=true`，題目來源為 `src/lesson/fixtures/items/` 的樣本課。
  - 已知：WebKit（Windows build）原生 IndexedDB 一次寫 5000 筆約 77 秒（測試準備成本），該案例時限放寬到 150 秒。
  - 已知限制：Playwright 的 WebKit（Windows build）在 `setOffline` 後 reload 會丟 internal error，離線重載只在 chromium 驗。
- **CI**：`../.github/workflows/ci.yml`——lint → typecheck → unit → e2e → build，不部署。
- 測試勿寫死 `toLocaleString('zh-TW')` 的輸出（新版 ICU 會出細空格，本機與 CI 不一致）。
