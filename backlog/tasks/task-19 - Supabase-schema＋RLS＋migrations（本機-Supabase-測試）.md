---
id: TASK-19
title: Supabase schema＋RLS＋migrations（本機 Supabase 測試）
status: To Do
assignee: []
created_date: '2026-10-01 16:00'
labels:
  - supabase
dependencies:
  - TASK-5
priority: medium
ordinal: 19000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
來源：docs/spec/requirements.md v0.1（2026-10-01 創辦人六輪釐清定案）
【需求】規格 §3：登入後同步；伺服器不收錄音、不碰金鑰。
【範圍】做：supabase/ 以 Supabase CLI 本機啟動（Docker）；schema：profiles、settings、word_pool、review_logs、course_progress、favorites、speech_corrections（僅文字與標記）；全表 RLS（只能讀寫自己的列）；migration 腳本；pgTAP 或等價的 RLS 負向測試。不做：雲端專案建立（G6，需創辦人帳號）。
【邊界】Docker 指令在 Git Bash 注意路徑轉換（記憶 reference_gitbash_docker_mount_trap）。
【dev-flow】feat
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 本機 supabase start 後 migration 可從零套用、可重跑
- [ ] #2 RLS 負向測試：A 使用者讀寫 B 的資料全部被拒
- [ ] #3 schema 與 app 本機資料層欄位對照表寫入 supabase/CLAUDE.md
<!-- AC:END -->
