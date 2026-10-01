---
id: TASK-2
title: 設計 R1——方向探索：ASCII 線框＋三個視覺方向
status: In Progress
assignee: []
created_date: '2026-10-01 16:00'
updated_date: '2026-10-01 14:09'
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

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
2026-10-01 執行長：R1 產出在分支 worktree-task-2-design-r1（0771ddb 線框、7b40a43 方向＋對比度腳本、a5354ce 圈選頁）。圈選頁 Artifact：https://claude.ai/artifact/STt2PsWSU5c2VLKt4Vok7B（db 集合 picks，發佈後 list 正常、空）。對比度 63 組全過 AA。待 R2 修：線框首頁 (b) 寫『到期量回到 50 以下恢復』與代決門檻『每日新字×10』不一致；深色回饋疊色底未入腳本；Literata 音標字形。停 In Review 等 G1。

2026-10-01 G1 圈選結果（Artifact db picks）：7 條預設做法全部『同意建議』（深色模式第一版就做、只直向但橫向不壞版、主按鈕在下 1/3、App 內三段字級、不做吉祥物、顏色＋圖示＋文字、短動效＋尊重減少動態）。三個方向 A/B/C 皆未選。整體意見：『主要視覺與風格，使用 UIUXPRO skill 重新設計一次，一樣設計3版』。→ 視覺方向重做 R1b（3 版），線框沿用。
<!-- SECTION:NOTES:END -->
