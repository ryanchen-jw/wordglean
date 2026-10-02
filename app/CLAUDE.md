# app/ — 手機版 PWA

React＋Vite＋TypeScript＋TailwindCSS；PWA 由 vite-plugin-pwa 產生 service worker。只做手機版。
產品規格以 `../docs/spec/requirements.md` 為準。

## 指令（皆在 `app/` 下執行）

| 指令                                                       | 用途                                                                                                                        |
| ---------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| `npm ci`                                                   | 安裝依賴（worktree 內各自安裝，禁 junction／symlink 連主 checkout 的 node_modules）                                         |
| `npm run dev`                                              | dev server，固定埠 **5287**（strictPort，被占用直接失敗）                                                                   |
| `npm run build`                                            | typecheck＋產出 `dist/`（含 `sw.js`、`manifest.webmanifest`）                                                               |
| `npm run preview`                                          | 以 build 產物起 server，固定埠 **5288**（strictPort）                                                                       |
| `npm run lint`                                             | ESLint＋Prettier 檢查                                                                                                       |
| `npm run format`                                           | Prettier 自動排版                                                                                                           |
| `npm run typecheck`                                        | `tsc -b`（app／node／e2e 三份 tsconfig）                                                                                    |
| `npm test`                                                 | Vitest 單元測試（jsdom）                                                                                                    |
| `npm run e2e`                                              | Playwright 手機模擬 e2e（自動 build＋preview）；`E2E_PORT` 可改埠                                                           |
| `npm run e2e:sync`                                         | 登入與同步 e2e（含結算後同步）＋登入畫面視覺 smoke（需本機 Supabase，跑法見 `playwright.sync.config.ts`；不進 CI）          |
| `npm run e2e:tts`                                          | 高音質發音真模型測試（下載約 310MB、需 WebGPU 與空閒記憶體 ≥3GB，見 `playwright.tts.config.ts`；不進 CI）                   |
| `npx playwright test --config playwright.speech.config.ts` | 跟讀 e2e：s04 視覺 smoke（假辨識）＋真模型整合測試（`--project=chromium-stt-real`，會自 Hugging Face 下載約 52MB；不進 CI） |

首次跑 e2e 前：`npx playwright install webkit chromium`（CI 用 `--with-deps`）。

## 資料夾結構

```
app/
├── src/
│   ├── App.tsx          只渲染 AppRoutes（路由表在 routes.tsx；router.ts／Link.tsx 為自寫 history 路由）
│   ├── main.tsx         進入點（字體、外觀偏好先套再渲染）
│   ├── i18n/            介面文案 zh-TW.json（key＝<畫面>.<區塊>.<用途>，TASK-4 G3 定稿；_pendingG3＝定稿後
│   │                    新增、待下輪審）＋ t()；noHardcoded.test.ts 守衛：src 內不得硬寫中文介面字串
│   ├── shell/           外框（頁首、底部導覽、離線條）、外觀／字級偏好、加到主畫面提示
│   ├── screens/         home／course／words／settings／lesson／review 畫面與其推導模型（*Model.ts）
│   ├── lesson/          題型引擎（TASK-12）：題目型別、佇列與題型登記、FSRS 評分對應、小課進度（續作）、
│   │                    結算；題目檔以獨立 json 資產載入（E2E 建置 VITE_ITEM_FIXTURES=true 改讀 fixtures/）
│   │                    能力替代規則與穿插（capabilities.ts、assemble.ts，TASK-18）
│   ├── today/           今日學習組裝（TASK-18）：到期複習＋下一課、受每日新字上限與暫停門檻約束
│   ├── review/          單字複習（TASK-18）：卡片取自來源課題目檔，收藏字以單字總表出卡；作答寫 FSRS；練習模式不寫
│   ├── dict/            字典（TASK-16）：可點英文字 EnglishText、字典彈層 DictionaryProvider、詞形還原與查找；
│   │                    字典切片（data/dict）與單字總表（data/lexicon）以獨立 json 資產預快取、不內嵌進 bundle
│   ├── curriculum/      課綱型別與查詢；課綱檔以獨立 json 資產載入（不併進程式碼 bundle）
│   ├── data/            Dexie 資料層、appDb.ts（App 唯一 db 實例）、匯出／清除
│   ├── download/        模型下載狀態型別與進度元件（高音質發音、語音辨識皆已接真下載）
│   ├── speech/          發音服務（TASK-13）：speak.ts＝App 唯一發音入口；預設手機內建聲音，高音質（Kokoro 選配，
│   │                    kokoro.worker.ts、僅 WebGPU）失敗自動退回並提示。
│   │                    跟讀（TASK-14）：逐字比對 align.ts、Moonshine Worker（stt*.ts）、錄音與權限 mic.ts、
│   │                    Web Speech 後備 webSpeech.ts（需同意）；畫面經 services.ts 的 SpeechContext 取用
│   ├── auth/、sync/     登入與同步（TASK-20）；帳號區塊掛在設定頁 AccountSection
│   ├── ui/              Button、Card、BottomSheet、OptionSheet、ChoiceOption、FeedbackBar、ConfirmDialog、Toast
│   ├── index.css        Tailwind 進入點（tailwindcss＋design/tokens.css＋design/theme.css）
│   ├── design/          設計 tokens（tokens.css 唯一數值來源、theme.css 接 Tailwind 4 @theme、
│   │                    tokens.test.ts 守 WCAG AA）；規格見 ../docs/design/
│   ├── *.test.tsx       單元測試與受測檔放在一起
│   └── test/setup.ts    Vitest 共用設定（jest-dom matchers）
├── e2e/                 Playwright 測試
├── e2e-sync/            需本機 Supabase 的 e2e（TASK-20 登入同步）
├── e2e-speech/          跟讀 e2e（TASK-14）；fixtures/librispeech 為 CC BY 4.0 測試音檔（不隨 app 散布，見 NOTICE）
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
  - `placement.spec`＝分級測驗 AC#3（TASK-17）：首次開啟 → 測驗 → 結果寫入設定 → 設定頁改級距；以「60 題 × 3 秒＋實測畫面耗時 < 300 秒」判定。`PLACEMENT_REALTIME=1` 時每題真等 3 秒（本機留證據用，約 3 分鐘）。題本查詢與逐組作答共用 `e2e/placementHelpers.ts`。
  - 已知（Windows）：webServer 的 preview 子程序在測試跑完後不會結束，Playwright 會卡在收尾、不印總結；輸出一律寫檔不接管道，跑完以 `netstat -ano` 找該埠的程序手動結束。
  - `narrow.spec`＝320 標準／320 特大／375 特大下單字庫、設定、清除確認、分級測驗不破版（含子元素不伸出卡片、主鈕不留孤字）。手機量測（溢出、單行控件、44px、英文字串、body 色、容器內溢出）一律用 `e2e/measure.ts`，e2e-sync 也共用。
  - `placement-cards.spec`＝分級測驗字卡：勾選底色（淺／深色系 computed 比對 token）、最長字題本在多種寬度／字級下不斷字不溢出。
  - `today.spec`＝今日動線（`page.clock` 固定時間：第一天上課、第二天先複習再接下一課、首頁數字更新）與三能力皆不可用仍完成一課；`review-visual.spec`＝複習各狀態截圖、狀態色 computed 斷言、窄螢幕／特大字級（共用 `e2e/today.ts`）。
  - `listen.spec`＝聽音打字／聽音選答；`tts-hq.spec`＝高音質發音強制失敗退回、下載失敗、崩潰旗標（攔下 Hugging Face／jsDelivr，不真的下載；WebKit 的 Cache Storage 不跨導覽保留，「已下載」狀態只在 chromium 驗）；內建聲音以 `e2e/speech.ts` 替身記錄呼叫。
  - `lesson.spec`＝小課讀類三題型走完一課與續作；`lesson-visual.spec`＝小課各狀態截圖與窄螢幕／特大字級量測。e2e 的 webServer 帶 `VITE_ITEM_FIXTURES=true`，題目來源為 `src/lesson/fixtures/items/` 的樣本課。
  - 已知：WebKit（Windows build）原生 IndexedDB 一次寫 5000 筆約 77 秒（測試準備成本），該案例時限放寬到 150 秒。
  - 已知限制：Playwright 的 WebKit（Windows build）在 `setOffline` 後 reload 會丟 internal error，離線重載只在 chromium 驗。
- **CI**：`../.github/workflows/ci.yml`——lint → typecheck → unit → e2e → build，不部署。
- 測試勿寫死 `toLocaleString('zh-TW')` 的輸出（新版 ICU 會出細空格，本機與 CI 不一致）。
