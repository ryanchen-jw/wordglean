---
id: TASK-12
title: 題型引擎＋讀類題型——單字卡、選擇題、閱讀理解
status: To Do
assignee: []
created_date: '2026-10-01 16:00'
updated_date: '2026-10-01 16:41'
labels:
  - app
dependencies:
  - TASK-11
priority: high
ordinal: 12000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
來源：docs/spec/requirements.md v0.1（2026-10-01 創辦人六輪釐清定案）
【需求】規格 §6 讀類題型，且所有題型共用一個引擎。
【範圍】做：題型引擎（讀取 content JSON、題目佇列、作答、回饋、結算、寫入 FSRS 評分）；作答結果到 FSRS 評分的對應規則（代決：答錯＝Again、答對但用時 >15 秒或用了提示＝Hard、答對＝Good、單字卡由使用者自評四級）；單字卡（翻面、自評）、選擇題、閱讀理解。不做：聽說寫題型（TASK-13～15）。
【邊界】用 TASK-8 pilot 題庫開發與測試，不等全量。
【dev-flow】feat
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 題型引擎單元測試：佇列、計分、FSRS 寫入、中途離開可續
- [ ] #2 三種讀類題型 E2E 在兩個手機 project 通過
- [ ] #3 答對／答錯回饋符合定版設計（視覺 smoke 截圖）
<!-- AC:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
2026-10-02 創辦人 G2 裁示：單字卡改為四選一中文釋義（不翻面、不自評四級），FSRS 評分沿用本卡通用對應（答錯＝Again、答對但 >15 秒或用提示＝Hard、答對＝Good；不提供 Easy），取代本卡原代決『單字卡由使用者自評四級』。以 docs/design 定版為準。
<!-- SECTION:NOTES:END -->
