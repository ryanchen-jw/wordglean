---
id: TASK-19
title: Supabase schema＋RLS＋migrations（本機 Supabase 測試）
status: Done
assignee: []
created_date: '2026-10-01 16:00'
updated_date: '2026-10-01 14:42'
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
- [x] #1 本機 supabase start 後 migration 可從零套用、可重跑
- [x] #2 RLS 負向測試：A 使用者讀寫 B 的資料全部被拒
- [x] #3 schema 與 app 本機資料層欄位對照表寫入 supabase/CLAUDE.md
<!-- AC:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
2026-10-01 驗收 PASS（隔離驗收官實跑）。代決：埠段 55420 起（避撞他專案）、CLI npx 鎖 2.118.0（2.119.0 剛發布）、『可重跑』＝db reset 連跑皆綠＋migration up 無變動；favorites 雲端獨立表含墓碑、本機為 word_pool.favoritedAt（投影交 TASK-20）；欄位對齊 TASK-10、不含已棄用 elapsed_days。驗收後補強：收回 authenticated 的 TRUNCATE／REFERENCES／TRIGGER（TRUNCATE 繞過 RLS），附紅綠證據。context7 worker 內未登入→查 npm（偏離）。給下游：TASK-20 收 OTP 需開 [local_smtp]；word_id／lesson_id 目前 text 無格式，TASK-6/7 定案後可收緊；TASK-17 需本機欄位對應 profiles.cefr_level。
<!-- SECTION:NOTES:END -->
