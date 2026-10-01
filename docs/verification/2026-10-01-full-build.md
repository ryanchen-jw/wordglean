# TASK-1～23 驗證報告（2026-10-01 full-build）

> 可再現：每個數字都附「重跑指令」。本檔隨各卡 squash-merge 逐段 append。

## 總覽

| 卡 | 類型 | commit | 自動化證據 | UI 走查 |
|---|---|---|---|---|
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
