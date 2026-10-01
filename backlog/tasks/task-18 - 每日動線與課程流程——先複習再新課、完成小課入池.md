---
id: TASK-18
title: 每日動線與課程流程——先複習再新課、完成小課入池
status: To Do
assignee: []
created_date: '2026-10-01 16:00'
labels:
  - app
dependencies:
  - TASK-10
  - TASK-12
priority: high
ordinal: 18000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
來源：docs/spec/requirements.md v0.1（2026-10-01 創辦人六輪釐清定案）
【需求】規格 §8：首頁一顆「今天的學習」→ 先複習到期單字，再接下一個小課；上完課的新字入池。
【範圍】做：今日學習組裝器（到期複習依 due 排序＋上限保護、接續下一小課、受每日新字上限與暫停門檻約束）；小課流程（穿插四類題型、依可用能力自動跳過：TTS／STT 不可用或無金鑰時的替代題）；完成結算頁；課程地圖解鎖規則（代決：同級內依序解鎖、可手動跳級）。不做：遊戲化（規格明定不做）。
【邊界】題型能力不可用時的替代規則要寫進 content 或 app 設定，不可讓使用者卡住。
【dev-flow】feat
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 組裝器單元測試：無到期、到期過多、新字上限為 0、暫停門檻觸發 四種情境
- [ ] #2 模擬 14 天每日使用的整合測試：入池字數、到期量合理
- [ ] #3 E2E：開 App→今天的學習→複習→小課→結算→首頁數字更新
- [ ] #4 TTS／STT／金鑰皆不可用時仍能完成一個小課
<!-- AC:END -->
