---
id: TASK-29
title: 設定頁新增 OpenRouter 模型測試按鈕
status: Done
assignee: []
created_date: '2026-11-04 18:24'
labels:
  - app
dependencies: []
priority: high
ordinal: 29000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
來源：2026-11-05 創辦人：「設定那邊新增 openrouter 模型測試按鈕之類的，才能馬上知道能不能用。」
【需求】已連結 OpenRouter 的使用者，在設定頁按一下就能知道目前的批改模型能不能用，不必走到寫作題才發現。
【現況（已實證）】設定入口在 app/src/screens/settings/AiSection.tsx；批改走 app/src/llm/grade.ts 的 gradeWriting；失敗原因 reason 已有分類。
【範圍】做：設定頁 AI 區塊新增測試按鈕，用與實際批改相同的程式真打一次；顯示進行中、成功（實際回應的模型、耗時）、失敗（原因）。不做：模型品質評測、改動自動切換邏輯。
【邊界】每按一次會消耗使用者 1 次免費額度，須防連點。對外新文案要創辦人逐字審後才合併。協調：與 TASK-27 自動切換同樣使用 llm 模組與 zh-TW.json，TASK-27 先合併、本卡再整合；首屏預算不受影響（設定頁）。
【dev-flow】feat
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 設定頁已連結狀態可按測試，以實際批改程式真打一次
- [x] #2 成功顯示實際回應的模型與耗時；失敗依原因分別顯示，不一律顯示同一句
- [x] #3 測試中不可重複送出，未連結時不顯示，離開畫面會中止請求
- [x] #4 新文案經創辦人逐字審；手機雙引擎模擬截圖；lint、typecheck、相關測試、build 通過
<!-- AC:END -->

## Comments
<!-- COMMENTS:BEGIN -->
---
created: 2026-11-05 05:00
---
結案（11-05）：按鈕上線，真機測試成功（回應模型與秒數正確顯示）；實測最慢 50.7 秒，創辦人裁示不加每批時限。
---
<!-- COMMENTS:END -->
