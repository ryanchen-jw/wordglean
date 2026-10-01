---
id: TASK-11
title: App 外殼與主要畫面——依定版設計實作導覽、首頁、單字庫、設定
status: To Do
assignee: []
created_date: '2026-10-01 16:00'
labels:
  - app
dependencies:
  - TASK-3
  - TASK-5
  - TASK-10
priority: high
ordinal: 11000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
來源：docs/spec/requirements.md v0.1（2026-10-01 創辦人六輪釐清定案）
【需求】依 TASK-3 定版設計（docs/design/ v1.0）實作 App 外殼。
【範圍】做：路由與底部導覽；首頁「今天的學習」（待複習數、今日進度、開始按鈕）、課程地圖、單字庫（全部／收藏／依熟悉度篩）、設定（每日新字數、OpenRouter 連結區塊佔位、語音模型下載狀態、資料匯出／清除）；PWA 安裝提示；離線可用；模型與字典的下載進度 UI 骨架。文案一律讀 zh-TW.json。不做：題型（TASK-12 起）、登入（TASK-20）。
【邊界】畫面與 docs/design/ 不一致時以設計為準，偏差須記錄理由；依 harness 05／06 做視覺 smoke（webkit＋chromium 截圖自檢）。
【dev-flow】feat
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 五個畫面實作完成，與定版截圖並排比對的差異清單 = 0 或每項附理由
- [ ] #2 視覺 smoke：webkit 與 chromium 手機模擬各截一輪，全部經 Read 檢查無破版、無殘留英文 UI 字串
- [ ] #3 離線：關網後重開可進入首頁與單字庫
- [ ] #4 E2E：首次開啟→首頁→單字庫→設定 流程通過
<!-- AC:END -->
