---
id: TASK-5
title: 專案骨架——Vite＋React＋TS＋Tailwind、測試與 CI
status: In Progress
assignee: []
created_date: '2026-10-01 16:00'
updated_date: '2026-10-01 07:24'
labels:
  - app
  - workspace
dependencies: []
priority: high
ordinal: 5000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
來源：docs/spec/requirements.md v0.1（2026-10-01 創辦人六輪釐清定案）
【需求】所有實作卡的共同底座，可與設計卡平行進行。
【範圍】做：app/ 以 Vite＋React＋TypeScript＋TailwindCSS 建立；PWA（vite-plugin-pwa，manifest 先用佔位圖示）；Vitest＋Testing Library；Playwright 兩個 project：webkit iPhone 15、chromium Pixel（手機模擬）；ESLint＋Prettier；GitHub Actions CI（lint、typecheck、unit、e2e、build；不部署）；根目錄 LICENSE（AGPL-3.0）與 data/LICENSE（CC BY-SA 4.0）、NOTICE 歸屬清單骨架；.gitignore 補 node_modules 等。不做：任何畫面（等 TASK-3 定版）、Supabase（TASK-19）。
【邊界】函式庫版本用 context7 查當下文件，不憑記憶。dev server 用固定且不與他人共用的埠，Playwright 不重用既有 server（記憶 reference_playwright_shared_devserver_false_green）。
【dev-flow】feat
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 npm run dev／build／test／e2e 全部可跑，build 產物可離線開啟（PWA service worker 註冊成功）
- [ ] #2 Playwright 兩個手機 project 各有一支 smoke 測試通過
- [ ] #3 CI workflow 在本機以 act 或推分支前的等價指令驗證一次全綠（不 push 到遠端則記錄本機等價結果）
- [ ] #4 LICENSE、data/LICENSE、NOTICE 就位；README 骨架寫明授權分界
- [ ] #5 app/CLAUDE.md 寫好（指令、資料夾結構、測試方式）
<!-- AC:END -->
