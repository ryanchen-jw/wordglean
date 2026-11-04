---
id: TASK-21
title: 開源與法遵文件——README、自架指南、隱私說明、授權頁
status: Done
assignee: []
created_date: '2026-10-01 16:00'
updated_date: '2026-10-03 11:14'
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
【借鑑】NOTICE 與 App 內授權致謝頁必列：eSpeak NG（GPL-3.0，經 kokoro-js → phonemizer 帶入）、transformers.js（Apache-2.0）、ECDICT 與 lemma.en.txt（MIT）、所有移植自 LibreLingo（AGPL）的程式碼出處、Moonshine 與 Kokoro 模型授權。（參考 docs/research/oss-landscape.md）
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 自架指南由一個乾淨環境照做一次可跑起來（本機模擬 Pages 與本機 Supabase）
- [x] #2 授權與致謝頁涵蓋 NOTICE 全部條目，有測試比對兩者一致
- [x] #3 Artifact 逐字審交付，停 In Review 等創辦人審定
<!-- AC:END -->

## Comments
<!-- COMMENTS:BEGIN -->
---
created: 2026-10-03 20:00
---
Done（main 5283f26）。AC#3：創辦人 10-03 裁示「TASK-21 不用我逐字審，先照你建議」→ 改由執行長審稿，不做 Artifact 逐字審。隔離驗收 PASS：乾淨副本照自架指南跑通最小部署與本機 Supabase（Email 驗證碼登入成功）；NOTICE 守衛雙向紅證；app 806／e2e 211／content 213 全綠。代決：①原始碼網址改建置變數 VITE_SOURCE_URL，官方站網址待 TASK-23 填；②新文案不加 _pendingG3；③「刪除雲端帳號資料」功能與隱私聯絡方式不在本卡，列上線前待辦。備查：NOTICE 開頭「骨架…待補」字樣已過時（P2）；全新 volume 首次啟動自動套 migration 未實測（共用 volume）。
---
<!-- COMMENTS:END -->
