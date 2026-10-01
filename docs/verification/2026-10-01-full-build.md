# TASK-1～23 驗證報告（2026-10-01 full-build）

> 可再現：每個數字都附「重跑指令」。本檔隨各卡 squash-merge 逐段 append。

## 總覽

| 卡 | 類型 | commit | 自動化證據 | UI 走查 |
|---|---|---|---|---|
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
