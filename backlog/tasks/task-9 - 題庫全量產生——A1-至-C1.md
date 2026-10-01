---
id: TASK-9
title: 題庫全量產生——A1 至 C1
status: To Do
assignee: []
created_date: '2026-10-01 16:00'
labels:
  - content
dependencies:
  - TASK-8
priority: medium
ordinal: 9000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
來源：docs/spec/requirements.md v0.1（2026-10-01 創辦人六輪釐清定案）
【需求】依 G5 核准的模型與預算上限產生全部題庫。
【範圍】做：依 TASK-8 管線分批產生（可續跑、已完成批不重產）；每批自動檢查，不合格題重產最多 2 次，仍不合格記入人工清單；全量統計；依 G5 抽審意見修正的 prompt 版本。不做：改動 schema（若需改要回 TASK-8 並重跑 pilot）。
【邊界】花費硬上限＝G5 核准金額，達 80% 先停下回報；超出任何上限即停（留閘）。產出的題庫 JSON 屬 AGPL 程式碼還是 CC BY-SA 資料：放 content/，以 CC BY-SA 4.0 授權（因衍生自 BY-SA 單字表），在 NOTICE 說明。
【dev-flow】feat
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 全部小課都有題目，自動檢查全綠；不合格最終清單 ≤ 總題數 1%，且已附在報告供創辦人抽看
- [ ] #2 實際花費 ≤ 核准上限，逐批花費記錄
- [ ] #3 再隨機抽 40 題放進驗收報告供創辦人瀏覽（不擋 Done）
- [ ] #4 content 授權說明寫入 NOTICE 與 content/README
<!-- AC:END -->
