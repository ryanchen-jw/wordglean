---
id: TASK-20
title: 登入與同步——Google＋Email 驗證碼、訪客資料合併
status: To Do
assignee: []
created_date: '2026-10-01 16:00'
updated_date: '2026-10-01 18:00'
labels:
  - app
  - supabase
dependencies:
  - TASK-19
  - TASK-10
priority: medium
ordinal: 20000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
來源：docs/spec/requirements.md v0.1（2026-10-01 創辦人六輪釐清定案）
【需求】規格 §3：不登入也能完整使用；登入方式 Google、Email 驗證碼（Supabase Auth）；登入後本機資料合併到雲端、跨裝置同步；自架者沒設定登入時 App 仍可用。
【範圍】做：Supabase Auth 整合（Email OTP 在本機用 Supabase 內建收信模擬器測、Google 以設定開關控制）；合併規則（代決：review_logs 取聯集去重，FSRS 卡片狀態以 review log 重放得出；收藏取聯集；設定以最後修改時間為準）；同步時機（登入當下、每次結算後、回到前景時）；離線佇列；未設定 Supabase 環境變數時隱藏登入入口。不做：真實 Google OAuth client 申請（G6）。
【邊界】Google 登入真實驗證在 G6 後補做一次（TASK-23 涵蓋）。
【dev-flow】feat
【借鑑】合併規則以 ts-fsrs 的 reschedule(card, reviews) 重播合併後的 review log 實作。fuzz 開啟時重播是否一致未核：須先驗證，不一致則合併重播時固定 enable_fuzz=false 或固定亂數種子。（參考 docs/research/oss-landscape.md）
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 合併規則單元測試：兩裝置各自離線學習後合併，FSRS 狀態與只在單一裝置作答的結果一致
- [ ] #2 E2E（本機 Supabase）：訪客學習→Email OTP 登入→資料上雲→另一個瀏覽器 context 登入看到相同進度
- [ ] #3 未設定 Supabase 時無登入入口且其餘功能正常，有測試
- [ ] #4 驗證並記錄 fuzz 對重播一致性的影響，合併結果在重跑時位元一致
<!-- AC:END -->
