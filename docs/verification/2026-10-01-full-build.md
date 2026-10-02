# TASK-1～23 驗證報告（2026-10-01 full-build）

> 可再現：每個數字都附「重跑指令」。本檔隨各卡 squash-merge 逐段 append。

## 總覽

| 卡 | 類型 | commit | 自動化證據 | UI 走查 |
|---|---|---|---|---|
| TASK-7 | feat（課綱骨架） | 見 git log「TASK-7」 | content 測試 41/41；validator 全綠；重建 sha256 一致；獨立重算重複／越界／漏排皆 0 | N/A |
| TASK-1 | investigate（語音原型） | 見 git log「TASK-1」 | wer 單元 7/7；結論數字抽 6 處與 results JSON 吻合 | N/A（原型；真機待 G4） |
| TASK-6 | feat（單字資料管線） | 見 git log「TASK-6」 | data pytest 30/30（無原始檔模式 28＋2 skip）；重建 602 檔 sha256 0 差異；冷啟動最大 50.2ms；Oxford 守衛 4 種植入皆紅 | N/A |
| TASK-2 | design（R1 線框＋方向，含 R1b 重做） | 見 git log「TASK-2」 | 對比度 R1 63 組／R1b 84 組全過 AA（腳本可重現、手算吻合、突變 exit 1） | 圈選頁 2 輪（G1） |
| TASK-10 | feat（本機資料層＋FSRS） | 見 git log「TASK-10」 | vitest 40/40（預設、UTC、Asia/Taipei 三時區）；typecheck／lint／build 綠；4 突變皆紅 | N/A（無 UI） |
| TASK-19 | feat（Supabase schema＋RLS） | 見 git log「TASK-19」 | pgTAP 74/74、HTTP smoke 8/8；突變（關 RLS／未上鎖新表／bytea 欄／TRUNCATE）皆轉紅 | N/A |
| TASK-5 | feat（app 骨架） | 見 git log「TASK-5」 | lint／typecheck／unit 1/1；e2e 3 passed、1 skipped（workers=1）；突變（關 SW 註冊）→ 3 紅 | N/A（佔位頁，非 has-ui） |

## TASK-5 · 專案骨架——Vite＋React＋TS＋Tailwind、PWA、測試與 CI

- **改了什麼**：建立 app/（Vite 8、React 19、TS 6.0、Tailwind 4、vite-plugin-pwa、Vitest＋RTL、Playwright webkit iPhone 15／chromium Pixel 7、ESLint／Prettier）、GitHub Actions CI（不部署）、根 LICENSE（AGPL-3.0）、data/LICENSE（CC BY-SA 4.0）、NOTICE 骨架、README 授權分界、app/CLAUDE.md。
- **驗收官實跑**（隔離、PASS）：
  - 4 個 npm 指令皆 rc=0；build 產出 sw.js／manifest；e2e 3 passed、1 skipped（webkit 離線重載：Windows WebKit 限制，刻意 skip）。
  - LICENSE／data/LICENSE 與 gnu.org、creativecommons.org 官方原文 sha256 相同（0d96a4ff…／28a9529c…）。
  - 突變：injectRegister:false → smoke 3 紅（rc=1），斷言有鑑別力。
  - 守衛紅證：假 server 占 5288 → Playwright 直接 rc=1 拒用，不會打到別人的 server；smoke 另核對識別字串。
- **未驗**：ci.yml 未在 GitHub／act 實跑（無 remote，以本機等價指令全綠代替：`docs/verification/2026-10-01-app-skeleton-evidence/ci-local.log`）；webkit 離線重載。
- **觀察（不擋）**：埠 5288 重複寫在兩個 config；CI 的 E2E 與 Build step 重複 build；本機 Node 22.20 對 jsdom@30 有 EBADENGINE 警告；favicon 仍為 Vite 預設圖（TASK-3 替換）。
- **重跑**：
  ```
  cd app && npm ci && npm run lint && npm run typecheck && npm test && npm run build && npx playwright test --workers=1
  ```

## TASK-19 · Supabase schema＋RLS＋migrations（本機）

- **改了什麼**：supabase/（CLI 2.118.0、project_id linguaapp、埠 55420–55429、只開 db／auth／rest）；init migration 建 7 表（profiles、settings、word_pool、review_logs、course_progress、favorites（含 deleted_at 墓碑）、speech_corrections（僅文字））、註冊自動建 profile、全表 RLS 綁 `(select auth.uid())`、anon 全收回、authenticated 收回 TRUNCATE／REFERENCES／TRIGGER；supabase/CLAUDE.md 含本機↔雲端欄位對照表。
- **驗收官實跑**（隔離、PASS）：start 後 db reset ×2 rc=0、migration up `{"applied":[]}`；test db 72/72＋smoke 8/8；驗收官自製突變（關 word_pool RLS、新增未上鎖表、加 bytea 欄）皆轉紅、reset 後全綠；docker ps 回到開跑前狀態。
- **驗收後補強**（執行長代決、親審 diff）：驗收官發現 authenticated 保有 TRUNCATE（不受 RLS 管，A 可清空 B 的列）→ 收回並加目錄守衛＋行為測試；紅證：舊 schema 下 B 的收藏被 A 清空（have 0 / want 1）；改後 74/74、smoke 8/8。
- **觀察（不擋）**：七表名單分散 4 處（schema_guard 會擋漏改）；smoke 以 sed 解析 JSON（有空 token 檢查）。
- **證據**：`docs/verification/2026-10-01-supabase-schema-evidence/`
- **重跑**（Git Bash）：
  ```
  MSYS_NO_PATHCONV=1 npx --yes supabase@2.118.0 start && npx --yes supabase@2.118.0 db reset && npx --yes supabase@2.118.0 test db && bash supabase/tests/smoke-rls-http.sh && npx --yes supabase@2.118.0 stop
  ```

## TASK-10 · 本機資料層＋FSRS 排程

- **改了什麼**：app/src/srs（ts-fsrs 5.4.2 封裝：retention 0.9、learning 1m/10m、relearning 10m 皆用內建參數、fuzz 關閉、log 可 reschedule 重播；裝置時區換日、每日新字額度、暫停門檻「待複習 > 每日新字×倍數」預設 10×10 可設定）＋app/src/data（Dexie 4.4.6 schema v1 五表、UTC epoch ms、入池／收藏同字一筆來源多重、作答紀錄）。NOTICE 補 Dexie 歸屬。
- **驗收官實跑**（隔離、PASS）：typecheck／lint 綠；vitest 預設／TZ=UTC／TZ=Asia/Taipei 各 40 passed；build rc=0。驗收官自製突變：門檻 > 改 >=（1 紅）、learning 10m→5m（3 紅）、relearning（1 紅）、凍結 v1 少索引（守衛紅）。
- **觀察（不擋）**：凍結 v1 守衛用 toMatchObject 比子集，「就地往 v1 加表」偵測不到；FsrsFields／ReviewEntry 7 欄重疊；3 處雙重轉型；真瀏覽器 IndexedDB 留 TASK-11 以 Playwright webkit 補驗。
- **證據**：`docs/verification/2026-10-01-local-data-fsrs-evidence/`
- **重跑**：
  ```
  cd app && npm run typecheck && npm run lint && TZ=UTC npx vitest run && TZ=Asia/Taipei npx vitest run
  ```

## TASK-2 · 設計 R1——ASCII 線框＋三個視覺方向（含 R1b 重做）

- **改了什麼**：docs/design/r1/（11 畫面線框 wireframes.md、A/B/C 三方向、7 條挑戰假設、contrast_check.py、圈選頁）；docs/design/r1b/（以 ui-ux-pro-max 重做 1/2/3 三方向、圈選頁）。
- **G1 圈選**：第一輪 7 條預設做法全同意、A/B/C 未採用、指示用 ui-ux-pro-max 重做；第二輪「方向 3＋第一版 A 的色系與質感」。圈選頁：R1 https://claude.ai/artifact/STt2PsWSU5c2VLKt4Vok7B 、R1b https://claude.ai/artifact/HsKbpbhqcAs8AR712kUFoi
- **驗收官**（隔離、PASS）：contrast_check.py 兩模式 exit 0、輸出 63／84 列與 directions.md 逐列吻合；手算 #FFFFFF/#C2410C＝5.178、#1E2329/#F6F1E7＝14.051 與腳本一致；改不達標色 → exit 1；pick.html 內嵌色碼與腳本差異 0。
- **觀察**：R1 舊圈選頁的跟讀線框仍為「按住說話」（歷史頁、刻意不改；wireframes.md 為準）。
- **證據**：`docs/verification/2026-10-01-design-r1-evidence/`（390 寬截圖）
- **重跑**：
  ```
  PYTHONUTF8=1 python docs/design/r1/contrast_check.py && PYTHONUTF8=1 python docs/design/r1/contrast_check.py r1b
  ```

## TASK-6 · 單字資料管線——CEFR-J／Octanove／TSL／NGSL／ECDICT 匯入與繁中化

- **改了什麼**：data/scripts（下載鎖檔＋sha256、建置、OpenCC s2twp＋19 條誤轉修正表）、data/sources（各來源分檔、各自授權；CEFR-J 1.5 衍生級距不標 CC BY-SA、原表不進 git）、data/lexicon（10,202 筆／9,073 詞）、data/dict（12.4 萬詞、596 片、gzip 3.29MB、最大片 113KB；詞形對照取自 ECDICT exchange 欄）、data/licenses、data/LICENSES.md、NOTICE、CI 新增 data job。
- **驗收官實跑**（隔離、PASS）：pytest 30 passed；raw 改名後 28 passed／2 skipped；重建 602 產物逐檔 sha256 一致；自抽 10 字回原始 CSV 10/10 一致；自抽 20 條釋義 0 簡體；冷啟動親跑 15 次中位 12.5ms、最大 50.2ms；Oxford 守衛 4 種植入皆轉紅。
- **代決**：CEFR-J 用 1.5（1.6 需填表）；lemma.en.txt 因條款限研究／教育用途排除；CEFR-J 官網自述曾參照 EVP 補字→維持採用（規格明文來源），列報告告知；s2twp 誤轉以修正表處理，語境不確定者不改。
- **觀察（不擋）**：ECDICT 原文殘留簡體「于」6、「云」3 處（守衛字表未涵蓋）；NOTICE 第 9 行舊句；proposal 的 id 描述未同步（data/CLAUDE.md 為準）。
- **重跑**：
  ```
  PYTHONUTF8=1 data/.venv/Scripts/python.exe -m pytest data/tests -q
  ```

## TASK-1 · 語音原型實測——Kokoro TTS＋Moonshine STT（G4 待真機）

- **結論：需降級**。STT（Moonshine tiny）可行：LibriSpeech 10 句逐字正確率 98.0%（WebGPU）／98.8%（WASM），每句 1.5–1.9 s。TTS（Kokoro）手機即時合成不可行：q8 每句 11–32 s（RTF 5–9），fp32 夠快但 310 MB、單行程 1.7 GB。兩者同載 chromium／webkit 皆未崩潰（webkit working set 合計 1.67 GB）。
- **建議**：TASK-13 預設系統聲音、Kokoro 選配（僅 WebGPU＋fp32）或改產題時離線預產音檔（需裁示）；TASK-14 用範本精度、限輸出長度、分時載入、不與 Kokoro 同常駐。
- **驗收官**（隔離、PASS）：抽 6+ 個數字回 results JSON 吻合；wer 7/7＋手算一例一致；未量項如實標示；LibriSpeech CC BY 4.0、moonshine-web Apache-2.0 出處齊；無 VAD、無 token、無大檔。驗收後修：§3 數字對齊 JSON、下載量統一、刪舊冒煙 log、自測例外清旗標。
- **未量**：webkit A／B／B2／F、chromium B、D、COI、webkit WebGPU（Windows WebKit 無）。
- **重跑**：
  ```
  cd prototypes/voice-poc && npm ci && node --test && node tests/summarize.mjs
  ```

## TASK-7 · 課綱骨架——級距→主題單元→小課與單字分配

- **改了什麼**：content/schema（級距檔、主題清單、字→主題分類）、validator（10 種錯誤代碼）、分配器、A1–C1 課綱：185 單元、984 小課、7,773 字（A1 23/135/1063、A2 27/158/1241、B1 43/269/2139、B2 53/304/2417、C1 39/118/913）；41 個主題（多益情境對 ETS 手冊、生活主題對 CEFR 2001 一手原文）；STATS.md；content/CLAUDE.md。
- **驗收官實跑**（隔離、PASS）：npm test 41/41；validator exit 0；重建 sha256 逐檔一致；獨立腳本重算重複引入 0、字數越界 0、級距不符 0、漏排 0、TSL B1–C1 覆蓋 51.7%；植入重複字與越級字 → DUPLICATE_INTRO／LEVEL_MISMATCH、exit 1。
- **代決**：以小寫 headword 為單位、取最低級、引入一次；C2 不排課（875 字只有 C2）；大小寫合併 4 組（IT/it、March/march、May/may、Miss/miss）。
- **待 G5 一併裁示**：TSL 多益常考字 30.2%（377 字）在單字表無級距、未排課；總課數 984 決定 TASK-9 成本。
- **證據**：`docs/verification/2026-10-01-curriculum-evidence/smoke.md`
- **重跑**：
  ```
  npm test --prefix content && node content/scripts/validate-curriculum.mjs
  ```

## TASK-3 · 設計 R2——設計系統＋高保真畫面 v1.0 定版

- **改了什麼**：`docs/design/v1.0/`（審閱頁 review.html／review.src.html＋build_review.py、components.md、self-review.md、icons/）：14 畫面、41 狀態、143 圖示；`app/src/design/` tokens.css＋theme.css（Tailwind 4 `@theme inline`，淺／深兩色系）＋對比度測試；`app/src/index.css` 引入、`App.tsx` text-lg→text-body、PWA theme_color 改設計底色。創辦人 G2 兩輪 14 畫面全 OK 後定版。
- **驗收官實跑**（隔離，第一輪 FAIL→補件後 PASS）：
  - 第一輪：lint／typecheck／build exit 0；test 83 passed；tokens 測試 43 綠、單邊突變（淺色 hint 改淺）2 紅後還原；清單外實際用到的色對另算皆 ≥4.5；兩引擎各 40 張截圖破版 0、<44px 0。**FAIL 一條**：範圍要求的「模型下載中」狀態在第二輪被移除（Kokoro 改選配時一起拿掉，但 Moonshine 仍需下載）。
  - 補件（afa0f77）：s04 新增「語音辨識模型下載中」（進度 42%、錄音鈕停用、可跳過）；複驗以 git archive 重建審閱頁與提交版逐位元組相同；兩引擎各 41 張、新截圖目視無破版；diff 只限設計檔與截圖。**PASS**。
- **未補**（執行長裁示，本機記憶體不足）：最終版只有淺色兩引擎；深色（chromium／webkit）、chromium 特大字級沿用第一輪修改前畫面；webkit 特大字級兩輪皆未拍。
- **觀察（交 TASK-11）**：間距無 `--lg-space` token（沿用 Tailwind 4px 基準）；s07-right 的「meeting」查字標示疑似示範殘留；兩組 metrics.tsv 為同一 blob（值全 0，無法證明分別量測）。
- **證據**：`docs/verification/2026-10-02-task-3-design-v1-evidence/`（shots-r2b 最終版、shots 第一輪深色／特大、tokens 紅綠 log、app 檢查 log）
- **重跑**：
  ```
  cd app && npm run lint && npm run typecheck && npm test && npm run build
  PYTHONUTF8=1 python docs/design/v1.0/build_review.py   # 與提交的 review.html cmp 應相同
  ```

## TASK-20 · 登入與同步——Google＋Email 驗證碼、訪客資料合併

- **改了什麼**：`app/src/sync/`（合併純函式 mergeSnapshots、同步引擎、離線佇列 outbox、Supabase 遠端）、`app/src/auth/`（AccountEntry／AccountPanel：Email→驗證碼→登入／登出、Google 依設定顯示、換帳號阻擋）、Dexie v2（outbox、syncMeta）、`supabase/migrations/20261002000000_review_logs_inserted_at.sql`（伺服器時間游標＋觸發器）＋pgTAP、本機 OTP 信件範本、`npm run e2e:sync`（本機 Supabase 真收信、不進 CI）。
- **代決**：登出先推完佇列再清本機；拉取用 inserted_at 游標＋重疊窗＋id 去重；收藏取聯集（取消收藏上線後改最後修改者勝）；設定同時間取穩定序列化較大者（交換律）；本機資料已屬帳號 X 時以 Y 登入→不合併、阻擋並登出 Y。
- **驗收官實跑**（隔離、PASS）：lint／typecheck／build 0；單元 135 passed；pgTAP 81；e2e:sync 8/8（訪客學習→Mailpit 取碼登入→雲端核對→B context 進度相同→B 作答 A 拉到→登出清本機）；未設定時入口守衛突變 config.test 3 紅＋e2e 兩裝置紅；`__linguaTest` 不在一般 build；RLS 寫他人 user_id 被擋、自帶 inserted_at 被觸發器覆寫。
- **UI 走查**：P0 長 email（64 字元）不折行水平溢出（375 34px／320 89px）→ 修為 overflow-wrap:anywhere＋375／320 回歸測試（修前 233／288px 紅、修後 0）；P2 錯誤圖示、讀取轉圈、文字鈕 › 留 TODO(TASK-11)。
- **已知限制**：AC#2 的「學習」步驟暫用測試掛鉤（學習畫面上線後改從 UI 操作）；結算後同步需 AuthApi 暴露 requestSync（交 TASK-18）；同步表清單在 4 處重複；特大字級未另測。
- **證據**：`docs/verification/2026-10-02-task20-sync-evidence/proposal.md`
- **重跑**：
  ```
  cd app && npm run lint && npm run typecheck && npm test && npm run build && E2E_PORT=5298 npx playwright test --workers=1
  npx supabase@2.118.0 start && npx supabase@2.118.0 test db
  cd app && LINGUA_SYNC_ANON_KEY=… LINGUA_SYNC_SERVICE_KEY=… npm run e2e:sync -- --workers=1   # key 取自 supabase status -o env
  npx supabase@2.118.0 stop
  ```

## TASK-11 · App 外殼與主要畫面——依定版

- **改了什麼**：自寫 history 路由（app/src/router.ts、routes.tsx）＋底部三格導覽、離線提示條；首頁 s01（預設／今天完成／新課暫停／第一次開啟）、課程地圖 s02（級距切換、小課彈層）、單字庫 s09（全部／到期／收藏、熟悉度、英文搜尋、50 筆分批）、設定 s11（每日新字數、外觀／字級 localStorage、模型下載 UI 骨架、匯出、帳號與同步接 TASK-20 AccountEntry）、清除確認 s13；加到主畫面卡（Android 一鍵／iOS 說明）；workbox 預快取 22 項＋SPA fallback＋字體 runtime 快取；app/src/i18n/zh-TW.json＋型別化 t()（draft-pending-G3）；共用 Button／Card／BottomSheet／OptionSheet；appDb 單例。
- **代決**：五畫面＝s01/s02/s09/s11/s13；目前級距暫由課程進度推導（正式欄位 TASK-17）；小課顯示單元名＋序號；單字庫中文釋義交 TASK-16；熟悉＝穩定度 ≥21 天；偏差 22 項附理由（以 s13 畫面為準、分隔符號維持 muted——設計截圖色邊為 ClearType）。
- **驗收**：第一輪 FAIL（e2e:sync 6/12 紅：折行量法不一；差異清單漏 1 項）＋走查 P0×2 → 修正後複驗 PASS：lint／typecheck／build 0、單元 219–220、e2e 42–44 過 2 跳（Windows webkit 無法模擬離線）、e2e:sync 12/12；守衛突變皆紅（英文字串、預快取、折行量測、停用鈕圖示）。走查重驗再抓到 320 特大列表伸出卡片 +39px → 加子元素溢出守衛（修前紅）後修正。
- **未驗**：AC#3 webkit 離線重開（工具限制）。
- **證據**：`docs/verification/2026-10-02-task11-shell-evidence/`（proposal、design-diff）
- **重跑**：
  ```
  cd app && npm run lint && npm run typecheck && npm test && npm run build && E2E_PORT=5302 npx playwright test --workers=1
  ```

## TASK-12 · 題型引擎＋讀類題型——單字卡四選一、選擇題、閱讀理解

- **改了什麼**：app/src/lesson（佇列、計分、單一交易寫入、中途續作、結算 onSettle）、/lesson/:id 小課外框 s03、單字卡 s07（G2：四選一、FSRS 自動評分 Again／Hard／Good）、選擇題／閱讀 s05、離開確認 s12、完成頁 s14；Dexie v3 lessonRuns；completeLesson。題目 fixture 以建置旗標載入（正式建置不含）。
- **驗收**：第一輪 FAIL（AC#3 選項答對／答錯底色被 bg-surface 蓋掉；譯文展開後不在視野）→ 修正並加 computed 底色與 in-viewport 守衛；e2e 68 過 2 略；引擎 5 種突變皆紅。
- **證據**：`docs/verification/2026-10-02-task12-read-items-evidence/`（proposal、偏差 19 條）
- **重跑**：`cd app && npm test && E2E_PORT=5312 npx playwright test --workers=1`

## TASK-16 · 點字查義＋收藏——ECDICT 字典彈層

- **改了什麼**：app/src/dict（tokenize、lemmatize、lookup、EnglishText、DictionarySheet、Toast）、字典 597 片預快取且不內嵌 bundle、收藏／取消／復原、inPool、單字庫中文顯示與搜尋、取消收藏同步墓碑（最後修改者勝）。
- **驗收**：AC#1 65 例（table 60／rule 5）、AC#2 兩引擎＋chromium 離線、AC#3 p95 15.7ms（n=30）、e2e:sync 12/12；走查 P1（iconBtnCls 文字色蓋掉發音鈕主色）修正並加 icon-color 守衛（修前 8 紅）；EnglishText 禁點改原形比對。
- **證據**：`docs/verification/2026-10-02-task16-dictionary-evidence/`
- **重跑**：`cd app && npm test && E2E_PORT=5322 npx playwright test --workers=1`

## TASK-17 · 新手分級測驗——點選認識的單字＋假字偵測

- **改了什麼**：content 假字產生器（自實作 Wuggy 式、lexicon／ECDICT 完整原檔過濾、拼錯距離、可唸性、冒犯字黑名單）與題本；app/src/placement（LexTALE 計分、≥85 掌握、灌水重測）；s10 畫面；settings.cefr_level migration＋pgTAP＋同步；設定頁級距選單。
- **驗收**：AC 全過（自產 900 假字對 ECDICT 原檔 0 命中、四作答者手算、實等 182 秒、pgTAP 87）；走查 P1×2（勾選底色、長字斷字）修正並加守衛。
- **證據**：`docs/verification/2026-10-02-task17-placement-evidence/`（report.md 含公式出處）
- **重跑**：`cd content && node --test`；`data/.venv/Scripts/python.exe -m pytest data/tests/test_placement_ecdict.py`（需 data/raw）

## TASK-4 · 介面文案定稿——全 App 繁中 UI

- **改了什麼**：copy-table 279 列（位置白話描述）→ 創辦人 G3「照建議」全數定稿 → g3-apply 寫入 app/src/i18n/zh-TW.json（後續卡新增與 4 處行為衝突 key 列 _pendingG3）；登入元件改讀文案；noHardcoded 守衛；scripts/ 繁中用語檢查；規格 §2 STT 大小改 50–80MB（cce1f2b）。
- **驗收**：PASS——全表比對 0 不一致、腳本重跑產出相同、check-zh 314 條 0 錯、守衛三突變紅。
- **證據**：`docs/verification/2026-10-02-task4-copy-evidence/`
- **重跑**：`cd scripts && npm test && node check-zh.mjs ../app/src/i18n/zh-TW.json`
