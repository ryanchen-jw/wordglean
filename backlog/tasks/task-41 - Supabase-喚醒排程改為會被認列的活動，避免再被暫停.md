---
id: TASK-41
title: Supabase 喚醒排程改為會被認列的活動，避免再被暫停
status: In Progress
assignee: []
created_date: '2026-11-25 06:38'
updated_date: '2026-11-25 06:49'
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
- [x] #1 官方文件與社群查證結論與證據等級寫進卡片
- [x] #2 新 migration 不放寬既有 RLS、不暴露使用者資料；排程只在明確成功時通過
- [x] #3 本機驗證 migration 與排程指令（或說明無法驗證的原因與替代驗證）
- [ ] #4 上正式站後連續 14 天排程成功且專案未被暫停
<!-- AC:END -->

## Comments

<!-- COMMENTS:BEGIN -->
created: 2026-11-25 06:49
---
2026-11-25 查證：官方明文（docs/guides/platform/free-project-pausing、kb/faqs/platform/free-project-pausing）——一週內資料庫活動不足即暫停、每天幾次使用者請求通常就夠，門檻未公開；社群經驗（github.com/orgs/supabase/discussions/13121）——只建連線不夠、需真的有交易；推測——RLS 拒絕（42501）的請求未執行查詢故不被認列。做法：private.keepalive 單列心跳表＋public.keepalive() security definer 函式（search_path 鎖定、僅 anon 與 service_role 可執行），排程 POST rpc 且只接受 200＋時間字串。獨立驗收 PASS（pgTAP 96 項全綠、500 次並行仍 1 列）。待：創辦人 db push、git push、觀察 14 天。
---
<!-- COMMENTS:END -->
