---
id: TASK-23
title: 上線——外部帳號、Cloudflare Pages、Supabase 正式專案、公開 repo
status: To Do
assignee: []
created_date: '2026-10-01 16:00'
labels:
  - workspace
dependencies:
  - TASK-4
  - TASK-21
  - TASK-22
priority: medium
ordinal: 23000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
來源：docs/spec/requirements.md v0.1（2026-10-01 創辦人六輪釐清定案）
【需求】開源程式碼＋官方站上線。
【範圍】做：創辦人建立外部帳號後（留閘 G6：Supabase 專案、Google OAuth client 與授權網域、Cloudflare Pages 專案與網域、GitHub 公開 repo、OpenRouter OAuth callback 網址），完成：Pages 部署（GitHub Actions 或 Pages Git 整合）、Supabase 正式 migration、Supabase 閒置暫停的每日喚醒排程、Google 登入真實驗證一次、部署後唯讀走查（harness 07 §7）。
【邊界】push 到公開 repo 與正式上線＝留閘 G7，創辦人明示才做；push 前 rev-list 檢查與時間檢查分兩步（記憶 feedback_check_time_before_push_separately）。
【dev-flow】feat
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 G6 清單交付創辦人（每項附操作步驟截圖或連結），帳號就緒後填入環境變數（不進 repo）
- [ ] #2 正式站部署成功，部署後唯讀走查兩引擎截圖無異常
- [ ] #3 Google 與 Email 驗證碼登入在正式站各成功一次
- [ ] #4 每日喚醒排程設定並驗證觸發一次
- [ ] #5 G7 創辦人明示後 push 公開 repo；push 的 commit sha 記回卡
<!-- AC:END -->

## Comments
<!-- COMMENTS:BEGIN -->
---
created: 2026-10-03 23:55
---
創辦人裁示（10-03）：「刪除雲端帳號資料」功能與隱私聯絡方式不做，本卡不納入。上線部署必設 VITE_SOURCE_URL（AGPL §13，見 docs/self-hosting.md）。
---
<!-- COMMENTS:END -->
