# TASK-1～23 驗證報告（2026-10-01 full-build）

> 可再現：每個數字都附「重跑指令」。本檔隨各卡 squash-merge 逐段 append。
> 最後整併：2026-10-03（台北），main HEAD 為 8f46cc7 之後的 docs commit（TASK-9 隔離複驗於 `8f46cc7` 執行）。事實來源：`.claude/daily-plan/sessions/acceptance-report-1001-full-build.html`（決策用 HTML）、各卡 backlog、git log；HTML 較舊之處以執行長 10-03 補充為準。

## TL;DR

- 23 張卡：Done 19（含 TASK-9，隔離複驗 PASS）、In Review 1（TASK-15，只差 AC#4 免費模型評測）、未開工 3（TASK-21／22／23，等前置卡）。花費 $0。
- 題庫 984 課、16,629 題全數進 main（A1 135、A2 158、B1 269、B2 304、C1 118）；全庫 `--require-judge` 全綠。**剔除 0 題**（0／16,629）；豁免 8 處（見 TASK-9 節）。題庫花費 $0，授權 CC BY-SA 4.0，隨機 40 題抽樣已附。B1 聽選題 200 題改為「正解換句話說、干擾項沿用音檔字」（8f46cc7）；A1、A2 維持字面辨認。
- 每張 Done 卡都經隔離驗收官實跑＋突變紅證；有 UI 的卡另有兩引擎走查。題庫走三關（盲審、課綱審查、最終複審）＋執行長親審，全部由 Claude 進行，沒有人類語言專家複核。
- 全部 commit 只在本機 main，未 push、未部署（G7）。待創辦人裁示 2 項：①B2 的 gook、retard 有辱罵義，目前只教中性義並加警語，是否移出課綱；②課綱來源含 CEFR-J（不是 CC BY-SA），題庫整體標 CC BY-SA 4.0 的表述要不要維持。

## 總覽

| 卡 | 類型 | 狀態 | commit | 自動化證據 | UI 走查 |
|---|---|---|---|---|---|
| TASK-1 | investigate（語音原型） | Done | 5fe044a／規格 22ed253 | wer 單元 7/7；結論數字抽 6 處與 results JSON 吻合 | N/A（原型；G4 真機略過） |
| TASK-2 | design（R1 線框＋方向，含 R1b 重做） | Done | 8a3b0a0 | 對比度 R1 63 組／R1b 84 組全過 AA（腳本可重現、手算吻合、突變 exit 1） | 圈選頁 2 輪（G1） |
| TASK-3 | design（R2 設計系統＋高保真 v1.0） | Done | 8a2cb08（補件 afa0f77） | tokens 對比度測試 43 項、突變 2 紅；兩引擎淺色各 41 張破版 0 | G2 兩輪定版 |
| TASK-4 | content（介面文案定稿） | Done | 5b96f3d／規格 cce1f2b／G3 第二輪 9a86184 | 全表比對 0 不一致；check-zh 314 條 0 錯；守衛三突變紅 | G3 兩輪 |
| TASK-5 | feat（app 骨架） | Done | 2f867f0 | lint／typecheck／unit 1/1；e2e 3 passed、1 skipped（workers=1）；突變（關 SW 註冊）→ 3 紅 | N/A（佔位頁，非 has-ui） |
| TASK-6 | feat（單字資料管線） | Done | 2cc3f62／規格 22ed253 | data pytest 30/30（無原始檔模式 28＋2 skip）；重建 602 檔 sha256 0 差異；冷啟動最大 50.2ms；Oxford 守衛 4 種植入皆紅 | N/A |
| TASK-7 | feat（課綱骨架） | Done | 5474515 | content 測試 41/41；validator 全綠；重建 sha256 一致；獨立重算重複／越界／漏排皆 0 | N/A |
| TASK-8 | feat（題庫管線＋pilot） | Done | 11ec9d7 | pilot 16 課 274 題檢查器全綠；守衛突變皆紅 | N/A |
| TASK-9 | content（題庫全量） | Done（隔離複驗 PASS） | 837a688、61224a2、a201dd3、055c008、0461d4d、3901a67、9e10282、d4be088、541022a、15661df、8f46cc7（App 端 a60f26b） | 984／984 課、16,629 題；三關審定；剔除 0；check-items 全綠、npm test 209/209 | 執行長親審（見 TASK-9 節） |
| TASK-10 | feat（本機資料層＋FSRS） | Done | e4ee37f | vitest 40/40（預設、UTC、Asia/Taipei 三時區）；typecheck／lint／build 綠；4 突變皆紅 | N/A（無 UI） |
| TASK-11 | feat（App 外殼） | Done | a407e8b | 單元 219–220、e2e 42–44 過 2 跳、e2e:sync 12/12；守衛突變皆紅 | 兩引擎；P0×2＋320 寬溢出已修 |
| TASK-12 | feat（題型引擎＋讀類） | Done | 54301fc | e2e 68 過 2 略；引擎 5 種突變皆紅 | 兩引擎；第一輪 FAIL 後修正 |
| TASK-13 | feat（聽） | Done | a9d1490 | 退回邏輯突變 4 項紅；e2e chromium 81／webkit 76；真模型合成一句 | 兩引擎；顏色吻合設計 |
| TASK-14 | feat（說） | Done | f0e294a | 逐字比對 23 組；預錄 10 句真模型 98.8%；錄音期間 0 上傳 | 7 狀態 64 張 |
| TASK-15 | feat（寫） | In Review（AC#4 進行中） | 66914ed | App 端 AC#1–#3 PASS；整合驗收 openrouter.ai 以外外送 0；評測 0／160 | 走查 P0（AI 卡溢出）已修 |
| TASK-16 | feat（點字查義＋收藏） | Done | 7874889 | AC#1 65 例；p95 15.7ms（n=30）；e2e:sync 12/12 | 兩引擎；P1 已修 |
| TASK-17 | feat（分級測驗） | Done | 7033aac | 900 假字對 ECDICT 0 命中；四作答者手算；pgTAP 87 | P1×2 已修 |
| TASK-18 | feat（每日動線） | Done | e0979c9 | AC#2 14 天模擬；e2e:sync 14；四守衛紅證 | 兩引擎無 P0/P1 |
| TASK-19 | feat（Supabase schema＋RLS） | Done | d1b62a0 | pgTAP 74/74、HTTP smoke 8/8；突變（關 RLS／未上鎖新表／bytea 欄／TRUNCATE）皆轉紅 | N/A |
| TASK-20 | feat（登入與同步） | Done | a28af5d | 單元 135；pgTAP 81；e2e:sync 8/8 | P0（長 email 溢出）已修 |
| TASK-21 | docs（開源與法遵） | 未開工（等 TASK-15 Done） | — | — | — |
| TASK-22 | qa（全面 QA） | 未開工（等 TASK-13～16 全 Done） | — | — | — |
| TASK-23 | ops（上線） | 未開工（等 G6／G7） | — | — | — |

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
- **G3 第二輪**（授權執行長決定）：_pendingG3 81 條定稿——改寫 17、沿用 64（9a86184）。
- **證據**：`docs/verification/2026-10-02-task4-copy-evidence/`
- **重跑**：`cd scripts && npm test && node check-zh.mjs ../app/src/i18n/zh-TW.json`

## TASK-18 · 每日動線與課程流程——先複習再新課、完成小課入池

- **改了什麼**：app/src/today（組裝器：到期依 due＋一輪上限、每日新字與暫停門檻、下一課 cefrLevel→最後完成級距→A1）、app/src/review（/review 單獨複習／今日動線／練習不寫排程、收藏字四選一卡）、lesson/capabilities.ts＋assemble.ts（題型穿插與能力替代）、結算後同步（共用 session 單例＋requestSync）。課程地圖照設計不鎖課。
- **驗收**：PASS——AC#1 四情境字面值、AC#2 14 天模擬（112 字、到期 0–21）、AC#3 today.spec 推一天流程、AC#4 三能力不可用完成一課；e2e:sync 14（settle-sync 反證 25 筆未送紅）；四守衛紅證；走查兩引擎無 P0/P1。
- **證據**：`docs/verification/2026-10-02-task18-daily-flow-evidence/`
- **重跑**：`cd app && npm test && E2E_PORT=5372 npx playwright test --workers=1`

## TASK-8 · 題庫產生管線＋pilot 兩單元

- **改了什麼**：依 G5 方向改由開發端 Claude 撰寫題目（author `claude-dev`，0 次 OpenRouter）：pilot 16 課 274 題、題目格式與自動檢查器（越級字、雙答案、簡體與大陸用語、正解位置）、撰寫準則、三關審定流程、全量時程估算（約 20 批）。花費 $0。
- **驗收**：16 課檢查器全綠；隔離驗收 PASS，P1／P2 已補正。原 AC 的「三模型比較＋金額」「預算核准」因 G5 改方向而被取代，已記卡。
- **證據**：`docs/pending/2026-10-01-item-bank-pilot/`（evidence.md、cost-estimate.md；結案後搬 evidence 目錄）
- **重跑**：`npm test --prefix content && node content/scripts/check-items.mjs --require-judge`

## TASK-13 · 聽——Kokoro TTS 整合與聽音打字／聽音選答

- **改了什麼**：依「聽」A——預設手機系統聲音念題，高音質 Kokoro 為設定選配（約 310MB、下載前告知）；Kokoro 載入失敗或沒回應時自動退回系統聲音並提示、可重試；聽音打字（大小寫、標點寬鬆，拼錯算錯）、聽音選答；NFKC 判題；能力偵測接入每日動線。
- **驗收**：首輪 FAIL（Kokoro 載入失敗時沒有退回、下載卡 0%）→ 修正後第二輪 PASS：退回邏輯突變 4 項轉紅、e2e chromium 81／webkit 76 綠、真模型合成一句成功（下載 44s、合成 5.3s；第二次走快取、連線主機只有本站）、顏色吻合設計。
- **已知 P2**（移交 TASK-22）：首播最長等 90 秒、全形逗號後沒空白會判錯、合成階段無逾時。
- **證據**：`docs/pending/2026-10-02-task13-listen/`（proposal、evidence/kokoro-real-run*.json）
- **重跑**：`cd app && npm test && npx playwright test --workers=1`；真模型（本機、不進 CI）`npm run e2e:tts`

## TASK-14 · 說——Moonshine STT 整合與跟讀題、兩欄修正

- **改了什麼**：手機本機辨識語音（Moonshine，模型 50–80MB 按鈕下載、錄音不上傳）、跟讀題、辨識結果讓使用者確認／修正後送出；AC#3 依裁示改為「以使用者修正後送出的句子計分」，辨識原文與送出句差異記入 speech_corrections；Moonshine 不能用時才提出瀏覽器語音辨識，且需同意。
- **驗收**：首輪 FAIL（「再唸一次」→跳過會卡死整課；取得麥克風時連點留下未關的錄音）→ 修正後複驗 PASS：逐字比對 23 組；預錄 10 句真模型逐字正確率 98.8%（251 字錯 3，3 次重跑相同）；錄音期間 0 個上傳請求。走查 7 種狀態 64 張、顏色吻合設計。
- **已知 P2**：近零秒錄音偶發失敗、極端存檔失敗後的殘留狀態（移交 TASK-22）；辨識原文會同步雲端，隱私說明交 TASK-21。
- **證據**：`docs/pending/2026-10-02-task14-shadowing/`（proposal、evidence/run{1,2,3}-stt-accuracy.json）
- **重跑**：`cd app && npm test && npx playwright test --workers=1`；真模型正確率見 `app/e2e-speech/stt-real.spec.ts`

## TASK-15 · 寫——OpenRouter 自帶金鑰、批改與無金鑰降級＋預設模型評測（In Review）

- **改了什麼**：一鍵授權（PKCE）或貼金鑰、金鑰只存手機瀏覽器（IndexedDB）、寫作批改（翻譯／造句）、沒金鑰時改成對照參考答案自評、預設模型評測管線（只打 :free 模型的硬守衛）。
- **驗收**：App 端 AC#1–#3 PASS；併入 TASK-13／14 與 A1 題庫後的整合驗收 PASS（id/key 不錯位、FSRS 不受影響、三能力皆無仍可完成、openrouter.ai 以外真實外送 0）。走查 P0（AI 卡窄螢幕溢出 7–722px）已修並加 openrouter-narrow.spec 16 項（修前 12 紅）。
- **進行中**：AC#4 預設模型評測——40 句常見錯句 × 4 個免費模型＝160 次，目前 0／160（prompt v2）。免費額度每天約 50 次，每天台北 08:05 後放行、花費 $0，約需 4 天。跑完依代決原則 D4 選預設模型（不拿使用者資料訓練的免費模型中改錯正確率最高者，次高當備援）→ 勾 AC#4 → Done。
- **已知 P2**（移交 TASK-22）：e2e 測試輔助旗標可能跨測試殘留；作答紀錄不區分自評／AI 批改。
- **證據**：`docs/pending/2026-10-02-task15-openrouter/`（proposal、dry-run）
- **重跑**：`cd app && npm test && npx playwright test --workers=1`

## TASK-9 · 題庫全量產生——A1 至 C1（Done）

- **範圍**：課綱 984 課、16,629 題（A1 135 課 2,278 題、A2 158 課 2,663 題、B1 269 課 4,560 題、B2 304 課 5,153 題、C1 118 課 1,975 題），全部由開發端 Claude 撰寫。G5 授權執行長代審。
- **984 課全數進 main**：

  | 範圍 | 課數 | commit |
  |---|---|---|
  | A1 | 135 | 837a688 |
  | A2 | 158 | 61224a2 |
  | A1／A2 後期規則補正（修 86 題＋7 題雙答案） | — | a201dd3 |
  | B2 u01～u24 | 153 | 055c008 |
  | C1 u36～u39 | 31 | 0461d4d |
  | C1 u01～u35 | 87 | 3901a67 |
  | B1 全級 | 269 | 9e10282 |
  | B2 u45～u53 | 71 | d4be088 |
  | B2 u25～u44 | 80 | 541022a |
  | 授權（NOTICE、content/README）與 40 題抽樣 | — | 15661df |
  | B1 聽選換句話說補正（200 題 listenChoice 改選項） | — | 8f46cc7 |

  App 端配合：單字卡與複習卡作答選項只顯示第一義、去括號註記（a60f26b）。
- **自動檢查**：全庫 984 課 `check-items --require-judge` 全綠；content `npm test` 209／209；單字卡第一義去重 7,773 張 0 重複（541022a）。
- **花費**：$0。題庫流程不呼叫外部 LLM（0 次 OpenRouter），逐課逐輪記錄在帳本 `content/items/_runs/claude-dev-pilot.json`（984 課，每課含撰寫起訖與每輪檢查器錯誤數）。
- **授權**：題庫 JSON（`content/items/`）一律 CC BY-SA 4.0，寫入 repo 根 `NOTICE` 與 `content/README.md`（15661df）；課綱與分級題本依 `data/LICENSES.md`。
- **抽樣**：隨機 40 題（每級 8 題、八種題型各 1 題，固定種子）在 `docs/verification/2026-10-01-full-build-item-sample.md`。
- **狀態**：Done。backlog TASK-9 已標 Done、AC 全勾。
- **隔離複驗 verdict：PASS**（HEAD `8f46cc7`）——AC#1～#4 全部 ✅；984 課對應課綱、16,629 題、剔除 0；`check-items` 全綠、content `npm test` 209/209；40 題抽樣與現行 JSON 一致。
- **AC 進度**：#1 全部小課有題目、自動檢查全綠、剔除 ≤1%——剔除 0（0／16,629）｜#2 花費 ≤ 上限、逐批記錄——$0，帳本如上｜#3 隨機抽 40 題——已附｜#4 授權寫入 NOTICE 與 content/README——已寫（15661df）。

### 每級三關結果

第②關＝另一個 Claude 不看答案自己作答，看有沒有兩個以上說得通的選項（多解）；第③關＝對照課綱與撰寫規則逐題審，FIX＝必須修的條數；最終複審＝修完後再全面核對一次；執行長親審＝執行長自己抽題看。改到選項或題幹的題，修完後都再「只看英文」重新盲答，全部一致。

| 級別 | commit | 第②關 盲審多解 | 第③關 FIX | 最終複審 | 執行長親審 |
|---|---|---|---|---|---|
| A1（135 課） | 837a688 | 3 批共 625 題位，0 多解 | 17＋21＋22＝60 條（第 1 批另有第二輪複審 FIX 12）全修 | 第 1+2 批 FIX 5、第 3 批 FIX 8，全修 | 3 批各抽約 10%（13 課）：1 個問題（dollars 中譯統一「美元」）已修 |
| A2（158 課） | 61224a2 | 3 批共 790 題位，1 題雙答案（a2-u04-l08 q13，干擾項 admit 已換） | 34＋31＋79＝144 條全修 | FIX 12／72（其中 66 條為句子與單字卡例句雷同）／4，全修 | 第 2 批 7 題選項改動：1 題雙答案（budget）已改 |
| A1／A2 後期規則補正 | a201dd3 | 改動題重新盲答全一致；「只看英文」抓到 7 題第二解，已修 | — | 單字卡第一義、干擾項範圍等全級自查，修 86 題 | — |
| B1（269 課） | 9e10282 | 4 批共 1,315 題位（255／240／240／580），1 題雙答案（b1-u18-l05 q14，干擾項 transport 已換） | 30＋34＋34＋143＝241 條全修 | FIX 10／13／12／44，全修 | 第 1 批改動 5 題通過；合併前親審 |
| B2 u01～u24（153 課） | 055c008 | 260／270／235 題位，2 題雙答案（b2-u15-l01 q13 boil、b2-u19-l01 q13 seminar，皆已換） | 36＋55＋38＝129 條全修 | FIX 9／4／55，全修 | 改動選項 6 題＋干擾項更換 13 題通過；混合詞性 32 題親審；「只看英文」自查修 29 題，改動 73 題重新盲答全一致 |
| B2 u25～u44（80 課） | 541022a | 225／175 題位，0 多解 | 73＋63＝136 條全修 | FIX 22／9，全修 | 3 課 |
| B2 u45～u53（71 課） | d4be088 | 235／120 題位，0 多解 | 第 1 批修 352 處、第 2 批修 240 處，全修 | 第 1 批追加修 49 處、第 2 批 FIX 11，全修；改動 46 題重新盲答全一致 | 4 課 |
| C1 u01～u35（87 課） | 3901a67 | 240／195 題位，0 多解 | 64＋91＝155 條全修 | FIX 4／11，全修 | 7 課 |
| C1 u36～u39（31 課） | 0461d4d | 155 題位 0 多解（另 50 條意見全修） | 27 條全修 | FIX 6，全修；改動 48＋2 題只看英文重新盲答全一致 | 3 課 |
| B1 聽選換句話說補正（200 題） | 8f46cc7 | 三輪修正後，改動題只看英文重新盲答全一致 | 只改 listenChoice 選項：正解換句話說、干擾項沿用音檔字；音檔、題目、正解位置不動 | FIX 全修 | 3 課 |

A1、A2 聽選維持字面辨認（初級聽辨適性），不在補正範圍。

### 剔除清單

**0 題**（全 984 課、總題數 16,629 題，剔除 0／16,629＝0%）。唯一被建議剔除的 a1-u02-l03-q14 改以豁免處理（見下）。

### 豁免清單

規則衝突時以「只看英文唯一可解」優先，其次才是混合詞性與同詞性配比。執行長核准的豁免共 8 處，詳見 `docs/pending/2026-10-02-item-bank-full/a12-cleanup-changes.md`「二、規則衝突與豁免」：

- **規則衝突豁免 6 題**：
  - a1-u03-l06-q14、a1-u07-l01-q13、a1-u01-l10-q13、a2-u20-l05-q13（混合詞性題：放得進空格的干擾項只看英文都說得通，改用文法不通的字）
  - a1-u01-l06-q14、a1-u03-l05-q13（四選項同詞性題：干擾項只能用文法不通的字）
- **a1-u01-l01**（全課）：第一課可用字只有 8 個，免同詞性與混合詞性配比規則。
- **a1-u02-l03-q14**：A1 第 2 單元已教的動詞太少，免「混合詞性題至少兩個干擾項放得進空格」；把勉強說得通的干擾項 Need 換成明顯不通的已教字。

### 規則演進（審查中陸續新增，全部級別適用）

1. 寫作題評分要點一律寫「例如…等」，並列出其他也算對的寫法。
2. 正確答案的位置每題獨立隨機，檢查器會擋「位置有規律」。
3. 每個新字除了單字卡，至少再出現在一題有完整句子的題目裡。
4. 字義以該級最常用、貼合單元主題的意思為準；名詞動詞都常用的字兩義並列。
5. 不寫醫療建議與戰爭、災難、死亡等沉重題材。
6. 題目句子不可和單字卡例句雷同：主詞、情境、句型至少換兩項，並附對照表逐列人工核對。
7. 不是本課要教的字，不可用超過該級的意思。
8. 從 A2 起，每課至少一題選擇題四個選項同詞性，只能靠字義判斷。
9. 不寫國家地位、主權、統獨相關句子。
10. 不寫理財投資、飲食建議與鼓勵賭博的情節。
11. 選項中只有一個大寫的專有名詞也算洩題。
12. 每單元從第 2 課起，閱讀短文自然帶入前面學過的字。
13. 選項長度：正確答案落在「最長、第二長、第三長、最短」的比例都要接近隨機，單題選項長度不得差到兩倍以上。
14. 干擾項只用已經教過或低一級的字，不可一眼就排除，同一個字不可在多課重複當干擾項。
15. 混合詞性的那題，三個干擾項至少兩個放得進空格。
16. 同一課兩題選擇題不共用干擾項，也不拿另一題的答案當干擾項。
17. 選擇題只看英文就要只有一個答案（作答時不顯示中文題意）。
18. 單字卡第一個意思＝最常用的意思，例句要示範這個意思；作答選項只顯示第一個意思。
19. 聽選題的音檔句子也納入雷同比對。
20. 規則衝突時的優先序：「只看英文唯一可解」優先於混合詞性與同詞性配比；豁免 6 題已記錄於 `docs/pending/2026-10-02-item-bank-full/a12-cleanup-changes.md`（「規則衝突與豁免」節）。

### 備查事項

- 課綱命名與內容不符 3 處（備查、不動課綱）：
  - b2-u24「生活服務（一）」
  - a2-u26「常用動作（二）」
  - c1-u22 主題寫政府、政治、法律，實際是宗教字
- 課綱誤植 1 處：C1 的 chauffer 應為 chauffeur。曾授權改課綱，但 lexicon 沒有 chauffeur、課綱測試擋下，已撤回；c1-u12-l02 照現況教（ECDICT「小型輕便爐」，註明舊式、罕用），之後在 data 層處理。
- **待創辦人裁示 ①**：B2 的 gook、retard 有辱罵義，目前只教中性義（黏稠物；動詞「延緩」）並在釋義加警語、不放進人物情境；是否從課綱移除待裁示（d4be088）。
- **待創辦人裁示 ②**：題庫整體授權表述——課綱來源含 CEFR-J（不是 CC BY-SA），題庫整體標 CC BY-SA 4.0（15661df），是否維持。
- referent：lexicon 只標名詞，題目只教名詞（形容詞用法極少見，屬課綱層面）。
- wornout：lexicon 的 headword 寫成 wornout，單字卡保留 headword，例句與其他題寫 worn out，釋義註明「應寫 worn out」；lexicon 不動（data 層備查）。
- zh-guard 豁免累計 51 詞（`content/scripts/lib/zh-guard.mjs` 的 `TWP_ACCEPTED`；TASK-9 前 13 詞，TASK-9 期間新增 38 詞，B1、B2 新增者各附先紅後綠測試）。這些是 opencc 會改寫、但台灣本來就通行的寫法；其餘誤擋一律改寫迴避、沒有加豁免。豁免清單是否收斂移交 TASK-22。
- 題庫審查全部由 Claude 進行（撰寫者、盲審、課綱審查、最終複審為不同的獨立 session），沒有人類語言專家複核。
- 裁示與審查原始紀錄在 scratchpad（t9/*-rulings.md、t9/*-final.md、t9/ceo-spotcheck.md，transient）；各級狀態與改動清單在 `docs/pending/2026-10-02-item-bank-full/`（結案後搬 evidence 目錄）。
- **重跑**：
  ```
  npm test --prefix content && node content/scripts/check-items.mjs --require-judge
  ```
  題數：`node -e` 逐檔加總 `content/items/{a1,a2,b1,b2,c1}/*.json` 的 `items` 長度＝16,629。

## TASK-21 · 開源與法遵文件——未開工

- 等 TASK-15 Done。已累積待寫：辨識原文會同步雲端的隱私說明（TASK-14）、題庫授權說明（TASK-9 AC#4）。

## TASK-22 · 全面 QA——未開工

- 等 TASK-13～16 全 Done（目前只差 TASK-15）。
- 已累積移交項：單字顯示大小寫（i→I、tv→TV、月份）、TASK-13／14／15 的 P2、跟讀模型下載失敗時標題仍顯示「下載中」、未使用的文案 key、兩份英文字串白名單不一致、HomeScreen 測試負載下偶發逾時。

## TASK-23 · 上線——未開工

- 等 G6／G7。上線後依 `.claude/harness/07-verification-report.md` §7 做部署後唯讀走查。

## 誠實聲明

- 所有語音數字為桌機模擬（手機下限），iOS 真實記憶體上限與 WebGPU 未驗；G4 真機自測依裁示略過。
- CI workflow 未在 GitHub 實跑（無 remote），以本機等價指令代替。
- worker 內 context7 未登入，函式庫查證改用 npm／PyPI registry 與官方文件（每卡 comment 已註明偏離）。
- TASK-3 最終版只有淺色兩引擎截圖；深色、特大字級沿用第一輪（本機記憶體不足，執行長裁示）。
- TASK-8／13／14／15／9 的證據仍在 `docs/pending/`，結案時搬進 `docs/verification/*-evidence/`；scratchpad 內的審查紀錄為 transient。
- 全部 commit 只在本機 main、未 push、未部署。
