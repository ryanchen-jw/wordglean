---
id: TASK-4
title: 介面文案定稿——全 App 繁中 UI 文字逐字審
status: To Do
assignee: []
created_date: '2026-10-01 16:00'
labels:
  - app
dependencies:
  - TASK-3
priority: medium
ordinal: 4000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
來源：docs/spec/requirements.md v0.1（2026-10-01 創辦人六輪釐清定案）
【需求】依記憶 feedback_copy_always_needs_user_review：對外文案一律創辦人逐字審過才 merge。
【範圍】做：盤點定版畫面上全部 UI 文字（按鈕、標題、說明、錯誤訊息、空狀態、Toast、權限請求說明、無金鑰提示、隱私短句），集中成 app/src/i18n/zh-TW.json；以 Artifact 圈選頁逐列「保留／改寫」交付（依記憶 feedback_copy_review_via_artifact_page，位置要白話說明在哪個畫面）。不做：學習內容本身（題庫歸 TASK-8／9）、法遵文件（TASK-21）。
【邊界】實作可先用此檔的推薦版跑，merge 前須創辦人審過。語氣：友善、簡短、不幼稚、不用簡體用語。
【dev-flow】docs，留閘 G3
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 zh-TW.json 涵蓋全部定版畫面的 UI 字串，每條附出現位置白話描述
- [ ] #2 用語檢查：無簡體字、無中國大陸用語（以 OpenCC s2twp 反查＋人工清單），自動檢查腳本可重跑
- [ ] #3 Artifact 圈選頁交付、創辦人逐列審完並回寫，停 In Review 等 G3
- [ ] #4 審定版 merge 後 app 內不得出現未收錄於 zh-TW.json 的硬編碼 UI 字串（lint 規則或測試守衛）
<!-- AC:END -->
