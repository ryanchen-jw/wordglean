---
id: TASK-22
title: 全面 QA——手機雙引擎 E2E、無障礙、效能預算
status: To Do
assignee: []
created_date: '2026-10-01 16:00'
labels:
  - app
dependencies:
  - TASK-13
  - TASK-14
  - TASK-15
  - TASK-16
  - TASK-17
  - TASK-18
  - TASK-20
priority: medium
ordinal: 22000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
來源：docs/spec/requirements.md v0.1（2026-10-01 創辦人六輪釐清定案）
【需求】上線前整體驗收。
【範圍】做：完整使用者旅程 E2E（新手測驗→首日學習→隔日複習→收藏→登入同步）在 webkit 與 chromium 手機模擬；qa skill 跑一輪報告並修；無障礙稽核（audit skill：對比、觸控目標 ≥ 44px、螢幕閱讀器標籤）；效能預算（首屏 JS ≤ 200KB gzip、模型與字典一律延遲載入、Lighthouse 以線上數字為準，本機只做成對比較——記憶 reference_local_lighthouse_lcp_bimodal）；離線全流程。
【邊界】驗收官隔離派工（harness 01／daily-brain 5.2）；真機項目依記憶以模擬代替時明列未驗項。
【dev-flow】fix（發現即修）
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 完整旅程 E2E 在兩引擎全綠且連跑 3 次穩定
- [ ] #2 qa 健康分數與修正清單入報告；P0／P1 全修
- [ ] #3 無障礙稽核 P0 全修
- [ ] #4 效能預算達標的量測證據
<!-- AC:END -->
