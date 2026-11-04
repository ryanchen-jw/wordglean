---
id: TASK-9
title: 題庫全量產生——A1 至 C1
status: Done
assignee: []
created_date: '2026-10-01 16:00'
updated_date: '2026-10-03 05:42'
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
- [x] #1 全部小課都有題目，自動檢查全綠；不合格最終清單 ≤ 總題數 1%，且已附在報告供創辦人抽看
- [x] #2 實際花費 ≤ 核准上限，逐批花費記錄
- [x] #3 再隨機抽 40 題放進驗收報告供創辦人瀏覽（不擋 Done）
- [x] #4 content 授權說明寫入 NOTICE 與 content/README
<!-- AC:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
2026-10-02 進度：A1 全級 141 課 merge main（837a688），三關審定（檢查器、獨立盲審 0 多解、課綱符合度＋最終複審），剔除 0 題，花費 $0。A2 第 1 批 46 課修正中、第 2 批撰寫中（worktree-task-9-a2）。執行長代決（記於 scratchpad/t9/*-rulings.md，擬併入撰寫準則）：評分要點「例如」＋替代結構；正解位置 sha256 逐題獨立＋ANSWER_POSITION_PATTERN；目標字至少一題句子情境；詞義以 CEFR-J 該級詞性＋單元主題常用義為準；名動兩用字兩義並列；非目標字詞義不越級；A2 起每課至少一題 mcq 選項同詞性；不寫醫療建議與沉重題材；dollars 一律「美元」；大小寫（i、tv、月份）由 App 顯示層處理（移 TASK-22）。
<!-- SECTION:NOTES:END -->

## Comments

<!-- COMMENTS:BEGIN -->
created: 2026-10-03 02:49
---
執行長代決結果（goal-1002 v4／goal-1003）：題庫 984 課（A1 135、A2 158、B1 269、B2 304、C1 118；16,629 題）全數三關審定合入 main，剔除 0（豁免 8 處見 full-build.md）；花費 $0（題庫由開發端撰寫，帳本 content/items/_runs/claude-dev-pilot.json 逐課記錄）；40 題抽樣 docs/verification/2026-10-01-full-build-item-sample.md；授權 CC BY-SA 4.0 寫入 NOTICE 與 content/README（15661df）。後期補正：只看英文唯一可解（全級）、聽選換句話說（B1、B2、C1；A1/A2 維持字面辨認）、單字卡第一義＝最常用義（App 作答只顯示第一義 a60f26b）。隔離複驗 PASS（HEAD 8f46cc7）。待創辦人裁示：gook、retard 是否移出 B2 課綱；題庫整體授權表述（CEFR-J 非 BY-SA）是否維持 CC BY-SA 4.0。
---

created: 2026-10-03 05:42
---
創辦人裁示（2026-10-03）：① gook、retard 移出 B2 課綱（選 B）；② 題庫授權表述改寫為題目文字 CC BY-SA 4.0、選字分級依原來源授權（選 B）。已派 worker TASK-9-rulings-b 執行。
---
created: 2026-10-03 15:50
---
裁示 ①② 落實完成，已併入 main 215ae3e（驗收紀錄 5294333）。① 只動 b2-u45-l05（刪 gook 單字卡與選擇題，補 tortoiseshell 選擇題 q17）、b2-u53-l07（刪 retard 單字卡，閱讀短文改一句），其他 982 課不動；排課器新增課綱排除字（照常佔位、切好後剔除）、validator 新增 EXCLUDED_WORD。② NOTICE、content/README、content/CLAUDE.md 改為「題目文字 CC BY-SA 4.0；選字與分級依原來源授權」。改動題只看英文重新盲答全一致；check-items 984 課全綠、content 213/213、app 795 通過；重產課綱與檔案一致。代決：審題員「新題干擾項易排除」無錯不修（備查）；舊修正紀錄位置編號／時區維持現狀。worker 15072ee5 與 worktree 已清。
---
created: 2026-10-04 20:30
---
10-04 創辦人裁示「造句改翻譯」：五級完成（A1 4007f04、A2 55403e0、C1 773877f、B2 0c905ab、B1 c600765），984 課皆 2 翻譯 0 造句、沿用題 id。每級第③關獨立審查 FIX／SUS 全修、執行長親審；準則 §12、§12.11（無時間詞收完成式）。代決：舊翻譯同單元雷同一併補正；月份提示字大小寫交 App 顯示層。
---
<!-- COMMENTS:END -->
