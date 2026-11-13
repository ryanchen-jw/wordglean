---
id: TASK-36
title: 英文審查修改套用到題庫＋中譯修正＋音檔重產
status: In Progress
assignee: []
created_date: '2026-11-13 15:21'
labels:
  - content
dependencies: []
priority: high
ordinal: 33000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
來源：創辦人 2026-11-13 裁示：英文審查全部照建議；不需創辦人檢視，改由驗收官把關（「你中文英文比我好」）。

【需求】
把英文全面審查的修改套用到題庫，連同片語拆開補句、中譯修正、題庫外品質問題，並重產受影響課程的音檔。

【現況（已實證）】
- 審查產出在 docs/pending/2026-11-13-english-review/：apply.jsonl（2,724 欄位、753 課，整欄改前改後）、changes.jsonl（2,433 條，必改 12）、verify.jsonl、zh-findings.jsonl（17 條中譯）、global/out-of-scope.txt、global/dialect.md、audio-lessons.txt（113 課、119 個有發音的欄位）、plan.md、standards.md。
- 裁示：統一美式（課綱英式目標字保留並標「（英式）」）；必改與建議都改；聽選選項句尾不加句號；片語課 27 句長受詞改不拆開，並在同課另一題補代名詞拆開句（如 step it up）；中譯長幼全庫修（brother、sister 等依上下文改為兄弟、姊妹或保留有依據的長幼）；題庫外品質問題（選項大小寫洩題、鹿港燈會史實、醫療字單字卡用字源句、newsroom 等）一併修；bishop 單字卡改教主教本義。
- 音檔腳本 content/audio-gen/build-audio.mjs 支援 --lessons 增量重產；TASK-35 已上線。

【範圍】
做：套用全部修改與補句、中譯修正、題庫外問題修正；跑題庫檢查器與 content 測試；重產受影響課程音檔；app 測試。
不做：不改課綱選字與分級、不新增或刪除題目（補句以改寫同課現有題為原則，若須新增要說明）、不動 app 介面文案。

【邊界】
動 content/items、content/audio；與 TASK-37（批改指令）、TASK-38（測試課程完成頁）無檔案重疊。
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 apply.jsonl 全部套用，套不上的為 0 或逐條說明；片語課補句、中譯長幼、題庫外問題、bishop 皆完成
- [ ] #2 獨立驗收官抽查（必改全數、建議每類至少 10%、中譯與補句全數）確認改寫正確、未改變考點與答案、同題選項與參考答案一致
- [ ] #3 題庫檢查器與 content npm test 全綠（含音檔最新）；受影響課程音檔已重產
- [ ] #4 app lint、typecheck、npm test、build 過；lesson、listen、phrases、demo e2e 兩引擎綠
<!-- AC:END -->
