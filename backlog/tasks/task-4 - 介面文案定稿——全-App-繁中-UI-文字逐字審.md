---
id: TASK-4
title: 介面文案定稿——全 App 繁中 UI 文字逐字審
status: Done
assignee: []
created_date: '2026-10-01 16:00'
updated_date: '2026-10-02 03:59'
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
- [x] #1 zh-TW.json 涵蓋全部定版畫面的 UI 字串，每條附出現位置白話描述
- [x] #2 用語檢查：無簡體字、無中國大陸用語（以 OpenCC s2twp 反查＋人工清單），自動檢查腳本可重跑
- [x] #3 Artifact 圈選頁交付、創辦人逐列審完並回寫，停 In Review 等 G3
- [x] #4 審定版 merge 後 app 內不得出現未收錄於 zh-TW.json 的硬編碼 UI 字串（lint 規則或測試守衛）
<!-- AC:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
2026-10-02 執行長代決：為避免與 TASK-11 撞檔，文案表先產在 docs/pending/2026-10-02-task4-copy/copy-table.json；TASK-11 建 zh-TW.json 讀取機制與佔位字串（標 draft-pending-G3）；G3 審定後本卡再回寫 zh-TW.json 並做 AC#4 守衛。

2026-10-02 Round 1 裁示：檢查腳本放根 scripts/（自帶 package.json）；登入字串一起收（設計未畫）；PWA 提示與模型下載告知收錄；模型大小以規格為準、圈選頁標註設計稿差異。

2026-10-02 Stage 1–4 完成（分支 worktree-task-4-copy cc07208）：文案表 279 列（72 列設計未畫），覆蓋檢查 0 漏收、用語檢查 0 錯（根 scripts/，10 測試）。圈選頁 Artifact：https://claude.ai/artifact/PiCWobm9a6EMy6KwEatQQn（db：copy-review/decisions，執行長 ArtifactData 讀回）。停 In Review 等 G3。待創辦人確認：語音辨識模型大小（規格約 28MB vs 實測可用 52/76MB，文案寫 50–80MB；若確認需改規格 §2 數字）。AC#1 待 G3 定稿寫入 zh-TW.json、AC#4 G3 後做。

2026-10-02 G3 裁示：創辦人回覆『按照你的建議即可』，圈選頁 db 無改寫 → 279 列全部照推薦定稿；STT 大小規格改 50–80MB（cce1f2b）。續派：寫入 zh-TW.json（後續卡新增 key 標 _pendingG3）、登入字串改讀 json、AC#4 硬寫字串守衛。

2026-10-02 G3 後 stage（7aeade8）：定稿套用 119 同值／5 覆寫／152 新增；_status approved-G3、_pendingG3 32 key；登入字串改讀 json；AC#4 守衛 noHardcoded.test（AST 掃描、3 次反證）；用語檢查 311 條 0 錯。衝突：搜尋框定稿待 TASK-16 中文搜尋已併入→套用；離開小課說明（行為為可續、定稿寫從第 1 題）與課名格式（課綱無小課名）保留現值，列創辦人待裁示。

2026-10-02 merge main（TASK-16）後重產 json（3a891a3）：同值 130／覆寫 5／新增 143／衝突保留 4；搜尋框定稿已套用；_pendingG3 33 條；noHardcoded 加精確『檔案＋字串』例外清單（lookup.ts 的釋義比對字串）；單元 400、e2e 兩引擎綠、用語 314 條 0 錯。派驗收。

2026-10-02 隔離驗收 PASS（3a891a3）：全表 279 列比對 0 不一致、g3-apply 重跑產出相同、check-zh 314 條 0 錯、守衛三突變紅、無越界。squash-merge main 5b96f3d；證據 docs/verification/2026-10-02-task4-copy-evidence/。觀察（未擋）：白名單 sk/or 過寬、super() 例外不限 Error 子類。待創辦人：離開小課說明（行為為可續）、課名格式三處、後續卡新增 _pendingG3 字串。
<!-- SECTION:NOTES:END -->
