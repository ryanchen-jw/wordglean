---
id: TASK-18
title: 每日動線與課程流程——先複習再新課、完成小課入池
status: Done
assignee: []
created_date: '2026-10-01 16:00'
updated_date: '2026-10-02 05:44'
labels:
  - app
dependencies:
  - TASK-10
  - TASK-12
priority: high
ordinal: 18000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
來源：docs/spec/requirements.md v0.1（2026-10-01 創辦人六輪釐清定案）
【需求】規格 §8：首頁一顆「今天的學習」→ 先複習到期單字，再接下一個小課；上完課的新字入池。
【範圍】做：今日學習組裝器（到期複習依 due 排序＋上限保護、接續下一小課、受每日新字上限與暫停門檻約束）；小課流程（穿插四類題型、依可用能力自動跳過：TTS／STT 不可用或無金鑰時的替代題）；完成結算頁；課程地圖解鎖規則（代決：同級內依序解鎖、可手動跳級）。不做：遊戲化（規格明定不做）。
【邊界】題型能力不可用時的替代規則要寫進 content 或 app 設定，不可讓使用者卡住。
【dev-flow】feat
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 組裝器單元測試：無到期、到期過多、新字上限為 0、暫停門檻觸發 四種情境
- [x] #2 模擬 14 天每日使用的整合測試：入池字數、到期量合理
- [x] #3 E2E：開 App→今天的學習→複習→小課→結算→首頁數字更新
- [x] #4 TTS／STT／金鑰皆不可用時仍能完成一個小課
<!-- AC:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
2026-10-02 Round 1 代決：課程地圖照設計 s02 不鎖課（依序只決定推薦下一課，取代卡片『同級依序解鎖』代決）；共用 session 單例供結算後同步；額度 >0 照常上一課；一輪複習上限＝暫停門檻；『再複習剛學的字』只練習不寫排程；動線內複習後直接接課；能力替代：無 STT 有 TTS→跟讀改聽音打字、無 TTS→聽說略過、無金鑰→寫作參考答案自評。

2026-10-02 Stage 0–1 審過（a18cfab）：組裝器四情境、能力替代、穿插、複習卡；單元 301、3 突變紅。代決：每日新字 0 時複習上限退回 100；每日新字 0 時不顯示新課暫停提示（修既有行為）。

2026-10-02 Stage 2 審過（2cc6c3a）：共用 session 單例＋requestSync＋onSettle→syncAfterSettle；14 天模擬 112 字、每日到期 0–21；每日新字 0 不算暫停（偏差 #3）。Stage 4 須跑 e2e:sync。

2026-10-02 Stage 3 審過（ce9b02c）：/review 三種用法、今日動線、LessonScreen 改 buildLessonQueue、完成頁練習；單元 325；偏差 #4–#6。worker 自陳 Stage 2 回報『typecheck 0 錯』不實（grep 被色碼擋），本輪已修並改看 exit code。

2026-10-02 Stage 4 結案（7019a69）：AC#1–#4 全有證據（today.spec 推一天流程、三能力不可用完成一課、review-visual 含 computed 底色、settle-sync e2e 反證 25 筆未送紅）；inPool 複習、收藏字四選一卡（lexicon 中文＋同級干擾項）；unit 455、e2e 57＋55、e2e:sync 14。記憶體閘違規一次（1.23GB 仍跑）。merge main 7033aac 後派驗收。

2026-10-02 merge main 7033aac（88b4a17）：下一課規則 cefrLevel→最後完成級距→A1（先紅後綠）、/placement 與 /review 開放、review.* 10 key 列 _pendingG3；unit 485、e2e 66＋64。首跑偶發 2 紅（TASK-17 測試，負載下逾時；TASK-13 正以 asyncUtilTimeout 處理）。派驗收兼走查。

2026-10-02 隔離驗收＋走查 PASS（88b4a17）：AC#1–#4 ✅、守衛 4 組紅證、e2e:sync 14、兩引擎走查無 P0/P1。squash-merge main e0979c9；證據 docs/verification/2026-10-02-task18-daily-flow-evidence/。P2：例句可點字命中區小（TASK-16 樣式）、320 特大答錯回饋區佔滿、首頁『明天約有 N 個到期』與學習步驟 10 分鐘不符（文案 G3）、收藏字無中文時複習出不了卡。
<!-- SECTION:NOTES:END -->
