---
id: TASK-41
title: Supabase 喚醒排程改為會被認列的活動，避免再被暫停
status: In Progress
assignee: []
created_date: '2026-11-25 06:38'
labels:
  - supabase
dependencies: []
priority: high
ordinal: 38000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
來源：創辦人 2026-11-25 裁示。Supabase 專案 wordglean 於 2026-11-23 因閒置被暫停（11-22 有預告信），即使 .github/workflows/supabase-keepalive.yml 每日都成功；11-25 已由執行長在後台恢復。

【需求】
喚醒排程改成 Supabase 會認列為活動的請求，避免再被暫停。

【現況（已實證）】
- 現行排程以 anon 金鑰查 profiles，靠 RLS 拒絕（42501）或 [] 判定成功；11-17～11-23 每日成功，專案仍在 11-23 被暫停，推論被拒絕的請求不被認列為活動（Supabase 未公開判定標準，查官方文件確認並標證據等級）。
- migrations 在 supabase/migrations/；正式專案 ref ilmqkppheekmnvpralsi；migration 上正式站需創辦人在本機執行 supabase db push（對外動作，先問）。

【範圍】
做：
1. 查 Supabase 官方文件與社群（官方 issue、discussion）對免費方案暫停判定的說明，選出最可能被認列的做法，例如 anon 可執行的 security definer 函式經 /rest/v1/rpc 真正執行查詢並回傳成功、或寫入一列心跳紀錄；說明取捨與證據等級。
2. 依選定做法新增 migration（不得放寬既有表的 RLS、不得暴露使用者資料）與修改排程判定條件（只接受明確成功，失敗時 job 失敗）。
3. 本機用 supabase start 的本機資料庫驗證 migration 與排程指令（若本機無法啟動 Supabase，說明並以 SQL 單元測試代替）。
不做：不升級付費方案、不改 App 程式。

【邊界】
上正式站需要創辦人執行 db push 與後續觀察兩週；觀察結果寫回本卡。
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 官方文件與社群查證結論與證據等級寫進卡片
- [ ] #2 新 migration 不放寬既有 RLS、不暴露使用者資料；排程只在明確成功時通過
- [ ] #3 本機驗證 migration 與排程指令（或說明無法驗證的原因與替代驗證）
- [ ] #4 上正式站後連續 14 天排程成功且專案未被暫停
<!-- AC:END -->
