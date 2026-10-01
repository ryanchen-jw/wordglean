---
id: TASK-21
title: 開源與法遵文件——README、自架指南、隱私說明、授權頁
status: To Do
assignee: []
created_date: '2026-10-01 16:00'
labels:
  - workspace
  - app
dependencies:
  - TASK-6
  - TASK-15
priority: medium
ordinal: 21000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
來源：docs/spec/requirements.md v0.1（2026-10-01 創辦人六輪釐清定案）
【需求】AGPL-3.0 開源＋官方站；資料 CC BY-SA；隱私承諾（錄音不上傳、金鑰只在瀏覽器、寫作內容只送使用者自選模型）。
【範圍】做：README（產品介紹、截圖、授權分界）、CONTRIBUTING、自架指南（Cloudflare Pages＋Supabase，含不設定登入的最小部署）、隱私說明（App 內頁＋repo）、App 內「授權與致謝」頁（列出所有資料與模型來源及授權）。
【邊界】對外文案：推薦版落檔可先跑，merge 前創辦人逐字審（留閘 G3 同類）。法律意見不在範圍，隱私說明標註「非法律文件」並建議上線前請專業者看過。
【dev-flow】docs
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 自架指南由一個乾淨環境照做一次可跑起來（本機模擬 Pages 與本機 Supabase）
- [ ] #2 授權與致謝頁涵蓋 NOTICE 全部條目，有測試比對兩者一致
- [ ] #3 Artifact 逐字審交付，停 In Review 等創辦人審定
<!-- AC:END -->
