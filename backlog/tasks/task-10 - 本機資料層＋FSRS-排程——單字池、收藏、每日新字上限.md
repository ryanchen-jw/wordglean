---
id: TASK-10
title: 本機資料層＋FSRS 排程——單字池、收藏、每日新字上限
status: In Progress
assignee: []
created_date: '2026-10-01 16:00'
updated_date: '2026-10-01 07:54'
labels:
  - app
dependencies:
  - TASK-5
priority: high
ordinal: 10000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
來源：docs/spec/requirements.md v0.1（2026-10-01 創辦人六輪釐清定案）
【需求】規格 §3、§7：不登入也能完整使用，資料存 IndexedDB；FSRS（ts-fsrs 5.x）排程；每日新字數使用者自訂（預設 10）、待複習過多自動暫停出新字；收藏進同一個池。
【範圍】做：IndexedDB 層（Dexie 或等價，版本化 migration）：使用者設定、單字池（stability、difficulty、reps、lapses、last/due、state、來源 course/favorite）、複習紀錄（review log，供日後同步合併）、課程進度、跟讀修正紀錄；FSRS 封裝（desired retention 0.9、learning steps 1m/10m、relearning 10m）；「今天」以裝置時區換日；暫停新字門檻（待複習 > 每日新字 ×10 時暫停，代決值，可設定）。不做：UI（TASK-11 起）、雲端同步（TASK-20）。
【邊界】時間一律存 UTC epoch，顯示與換日才轉本地（harness 09 時區規約）。
【dev-flow】feat
【借鑑】直接使用 ts-fsrs v5 內建的 learning_steps、relearning_steps、forgetting_curve，不自寫步驟邏輯；複習紀錄格式需能餵給 reschedule 重播（TASK-20 依賴）。（參考 docs/research/oss-landscape.md）
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 FSRS 封裝單元測試：新字→學習步驟→複習的完整狀態轉換、答錯重學、模擬 60 天作答的到期分布合理（無負間隔、無 NaN）
- [ ] #2 每日新字上限與暫停門檻的單元測試，含跨時區換日（UTC+8 與 UTC-5 各一）
- [ ] #3 DB migration 測試：v1→v2 升版不掉資料
- [ ] #4 收藏既有課程字不重複建卡（同一字只有一筆池紀錄、來源可多重）
<!-- AC:END -->
