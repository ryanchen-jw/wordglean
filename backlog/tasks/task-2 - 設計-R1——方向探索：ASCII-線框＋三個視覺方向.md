---
id: TASK-2
title: 設計 R1——方向探索：ASCII 線框＋三個視覺方向
status: To Do
assignee: []
created_date: '2026-10-01 16:00'
labels:
  - app
dependencies: []
priority: high
ordinal: 2000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
來源：docs/spec/requirements.md v0.1（2026-10-01 創辦人六輪釐清定案）
【需求】前端畫面設計定版是第一優先、最吃創辦人品味。R1 只對齊方向，不做高保真。
【範圍】做：(1) 主要畫面 ASCII 線框（首頁「今天的學習」、課程地圖、小課進行中×4 題型（聽／說／讀／寫）、單字卡複習、單字查義彈層、單字庫、新手分級測驗、設定含 OpenRouter 金鑰）；(2) 三個視覺方向提案，每個附：情緒關鍵字、配色、字體（中英搭配）、圓角與密度、參考產品，以及「價值／成本」欄；(3) 主動挑戰預設假設：深色模式要不要、只直向？單手操作熱區、無障礙字級、是否需要吉祥物或插畫系統。不做：HTML 高保真、任何程式碼。
【邊界】依記憶 feedback_ascii_before_html_for_design：R1 純文字線框寫在報告裡；三方向用 Artifact 單頁（色票與字體可實際渲染）讓創辦人圈選，圈選結果用 artifact db 收。手機 390×844 直向為基準，不做 RWD。
【dev-flow】non-dev（設計），留閘 G1
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 ASCII 線框涵蓋範圍所列 11 個畫面，每個標出主要互動與資訊層級
- [ ] #2 三個視覺方向各有：情緒關鍵字、配色（含對比度檢查 WCAG AA）、中英字體組合、圓角與密度、參考產品、價值／成本比
- [ ] #3 列出至少 5 個被挑戰的預設假設與各自建議（深色模式、方向、單手熱區、字級、插畫系統）
- [ ] #4 以 Artifact 圈選頁交付（每方向可選「採用／混搭某元素／否決」＋自由意見），停 In Review 等 G1
- [ ] #5 創辦人圈選結果記回本卡 comment 後才 Done
<!-- AC:END -->
