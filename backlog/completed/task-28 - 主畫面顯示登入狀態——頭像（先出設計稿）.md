---
id: TASK-28
title: 主畫面顯示登入狀態——頭像（先出設計稿）
status: Done
assignee: []
created_date: '2026-11-04 18:11'
labels:
  - app
dependencies: []
priority: medium
ordinal: 28000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
來源：2026-11-05 創辦人手機試用：「頁面要設計一個顯示登入狀態的頭像之類的，開卡，先給我設計稿再動工。」
【需求】使用者不必進設定頁，就能在主要畫面看出目前是否已登入。
【範圍】做：登入狀態顯示（頭像或同類元素）的設計稿，創辦人圈選定案後才實作。不做：設計定案前不改程式。
【邊界】依賴 TASK-27 的 Google 登入修好後才能實測。首屏預算要守：Supabase 與同步程式目前動態載入、首頁不載入，顯示狀態不可把它們拉進首屏。新增文案須逐字審。Google 頭像圖片來源會讓瀏覽器連到 Google，要對照隱私說明。
【dev-flow】feat
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 設計稿交創辦人圈選定案，定案前不動工
- [x] #2 已登入與未登入在主畫面一眼可分，淺色與深色模式皆正確
- [x] #3 開啟 App 時已登入者能正確顯示，首屏 JS 不含 Supabase，守住首屏預算
- [x] #4 手機雙引擎模擬截圖；新增文案逐字審過
<!-- AC:END -->

## Comments
<!-- COMMENTS:BEGIN -->
---
created: 2026-11-05 02:30
---
創辦人定案（11-05）：方案 B（保留齒輪，已登入時旁邊加頭像）、內容用帳號首字；未登入畫面不變。設計稿 docs/pending/2026-11-05-login-avatar/mockup.html。位置未回覆，採推薦預設只放首頁。
---
---
created: 2026-11-05 05:00
---
結案（11-05）：方案 B＋首字上線，真機確認頭像顯示。
---
<!-- COMMENTS:END -->
