---
id: TASK-39
title: 即時跟讀（一）原型測試頁與延遲、誤標實驗
status: In Progress
assignee: []
created_date: '2026-11-13 17:49'
labels:
  - app
dependencies: []
priority: medium
ordinal: 36000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
來源：創辦人 2026-11-13 需求「跟讀即時逐字辨識」，11-14 指示繼續做。設計與裁示：docs/pending/2026-11-13-live-shadowing/design.md（含末節裁示紀錄）、設計稿 Artifact「拾字・即時跟讀設計稿」。

【需求】
第一張卡（設計 §6 的 a）：做原型測試頁並完成實驗，坐實手機上的延遲與誤標率，決定是否進入正式開發。

【已定案】
判定用 B 建議版；主路線為 Moonshine tiny 滑動視窗重複辨識（錄音不離手機），後備為 Web Speech；整句完成算答對、跳過算答錯；I'm 與 I am 互通；保留舊跟讀流程。

【範圍】
做：
1. 原型頁 /debug/live-shadowing（App 內無入口，上線後創辦人以網址開啟）：即時取樣（AudioWorklet，16 kHz 環形緩衝）＋滑動視窗重複辨識；畫面印每輪辨識文字、每輪耗時、視窗長度切換（3／4／6 秒）、可選目標句並即時顯示不照順序的比對標記（設計 §3 的演算法雛形即可），另有「連續 60 秒」計時模式供耗電實驗。
2. 實驗 1、2（設計 §7）在桌機以模擬與測試音檔完成並回報數字。
3. 實驗 3、4 的操作說明寫成一頁，供創辦人用手機照做。
不做：不改現有跟讀題與課程流程、不做正式畫面、不加設定開關。

【邊界】
新增檔為主；不動 stt.ts 的既有對外介面（可新增匯出）。原型頁沿用 i18n 規則或以英文標示為內部工具。
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 原型頁 /debug/live-shadowing 可在手機開啟，錄音中即時印出每輪辨識文字與耗時，可切 3／4／6 秒視窗，並顯示目標句的即時標記
- [ ] #2 App 內沒有連到原型頁的入口（有測試）
- [ ] #3 實驗 1：桌機各視窗每輪耗時（中位數與 P90）；實驗 2：截掉句尾的誤標率，開與關兩輪確認各一組；數字附重跑方式
- [ ] #4 實驗 3、4 的手機操作說明完成
- [ ] #5 lint、typecheck、npm test、build 過；既有跟讀 e2e（假辨識）綠；首屏 JS 不受影響
<!-- AC:END -->
