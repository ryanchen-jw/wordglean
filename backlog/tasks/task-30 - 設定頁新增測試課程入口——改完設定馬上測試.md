---
id: TASK-30
title: 設定頁新增測試課程入口——改完設定馬上測試
status: In Progress
assignee: []
created_date: '2026-11-07 07:42'
labels:
  - app
dependencies: []
priority: medium
ordinal: 27000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
來源：創辦人 2026-11-07 指示（「把測試功能的課程放在設定裡面，方便改完設定馬上測試」）。

【需求】
設定頁加入測試課程入口。改完 AI 模型、發音等設定後，不必記網址，兩步內就能進到要測的題型。

【現況（已實證）】
- 示範課已存在：/lesson/demo，所有題型一課，練習模式不寫任何本機資料；?type= 從該題型開始（app/src/routes.tsx:56、app/src/lesson/demo.ts）。
- 目前刻意沒有入口：來自創辦人 10-05 裁示二（commit ca42edf），由 app/e2e/demo.spec.ts:157 守住，註解在 app/src/routes.tsx:56。本卡由創辦人明確改變此裁示：設定頁開入口，課程與首頁仍不連。
- 題型順序：單字卡、配對、選擇、閱讀、聽音打字、聽音選答、跟讀、中翻英（app/src/lesson/demo.ts:12）。中翻英排最後，只有一個從頭開始的入口會要走完 11 題才測得到 AI 批改，所以要能選題型。
- 設定頁「其他」群組在 app/src/screens/settings/SettingsScreen.tsx:279；單選彈層 app/src/ui/OptionSheet.tsx 可直接用。
- 離開示範課走 goBack（app/src/screens/lesson/LessonScreen.tsx:298）。

【範圍】
做：
1. 設定頁「其他」群組的「關於」上方新增一列「測試課程」，點開用 OptionSheet 選題型，選了就進 /lesson/demo（帶對應 ?type=）。
2. 選項依序：全部題型、配對、選擇題、閱讀、聽音打字、聽音選答、跟讀、中翻英（AI 批改）。「全部題型」不帶 ?type=。
3. 彈層標題：從哪個題型開始。
4. 更新 demo.spec.ts:157 的守衛與 routes.tsx、app/CLAUDE.md 中「App 內無入口」的敘述。
不做：不改示範課內容與題目、不改練習模式行為、不在首頁或課程頁加入口、不做開發者開關或隱藏、不新增設定項。

【邊界】
- 文案新增在 zh-TW.json，遵守 noHardcoded 守衛；文案由創辦人在回報時逐字確認。
- 不影響首屏 JS 預算。
- 無進行中的其他卡，無檔案衝突。

dev-flow 情境：小功能（UI 入口）。
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 設定頁「其他」群組有「測試課程」列，位於「關於」上方；首頁與課程頁仍沒有連到 /lesson/demo 的入口
- [ ] #2 點開彈層顯示八個選項，順序與文字符合描述；選中翻英會進 /lesson/demo?type=translate 並顯示中翻英題；選全部題型從第一題開始
- [ ] #3 從測試課程離開或走完後回到設定頁
- [ ] #4 走完測試課程後本機資料庫不變（沿用 demo.spec 的快照斷言）
- [ ] #5 e2e 守衛已改成新規則（設定頁有入口、其餘頁無）；受影響的單元與 e2e 兩引擎皆綠，lint、typecheck、build 皆過
- [ ] #6 兩引擎手機截圖含設定列與彈層，320 寬與特大字級無溢出、可點目標至少 44px
<!-- AC:END -->
