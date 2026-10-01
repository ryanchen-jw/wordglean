# TASK-1～23 驗證報告（2026-10-01 full-build）

> 可再現：每個數字都附「重跑指令」。本檔隨各卡 squash-merge 逐段 append。

## 總覽

| 卡 | 類型 | commit | 自動化證據 | UI 走查 |
|---|---|---|---|---|
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
