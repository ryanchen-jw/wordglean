---
id: TASK-17
title: 新手分級測驗——點選認識的單字＋假字偵測
status: Done
assignee: []
created_date: '2026-10-01 16:00'
updated_date: '2026-10-02 04:24'
labels:
  - app
  - content
dependencies:
  - TASK-6
  - TASK-11
priority: high
ordinal: 17000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
來源：docs/spec/requirements.md v0.1（2026-10-01 創辦人六輪釐清定案）
【需求】規格 §5：約 5 分鐘純點選，混入假字抓灌水，依各級認識比例推定起始級距，之後可手動調整。
【範圍】做：假字產生器（可發音的非詞，須確認不在 lexicon 與 ECDICT、不是常見拼錯）；題組（每級抽樣字＋假字約 15–20%）；評分演算法（勾假字率校正的認識比例、逐級門檻推定，代決門檻：該級校正後認識率 ≥ 70% 視為已掌握）；模擬測試（以合成作答者：誠實 A2、誠實 B2、全勾灌水、全不勾，驗證推定正確）；測驗 UI 與結果頁（顯示「B1｜約多益 xxx+」）。不做：聽力分級。
【邊界】多益分數對照依 ETS 官方 CEFR 門檻（規格 §4），結果頁註明「僅供參考」。
【dev-flow】feat
【借鑑】計分改用 LexTALE 公式（真字正確率與假字正確率的平均），取代自訂的勾假字率校正；分級門檻以此分數換算。假字產生器參考 Wuggy 新版（MIT）的音節轉移法，搭配自家 lexicon；不得使用 Wuggy 的英文語言資料（無授權）或原版 Wuggy（GPL-2.0）。LexTALE 題目字表授權未核，不直接使用其字表。（參考 docs/research/oss-landscape.md）
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 假字產生器測試：抽 200 個無一在 lexicon／ECDICT
- [x] #2 四種合成作答者的推定結果正確（灌水者被判為最低級或提示重測）
- [x] #3 測驗全程 E2E < 5 分鐘（以平均每題 3 秒模擬）；結果寫入設定並可在設定頁調整
- [x] #4 計分公式與文獻出處寫入報告與程式註解
<!-- AC:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
2026-10-02 Round 1 代決：settings 新增 cefr_level migration（profiles.cefr_level 未用不刪）；Dexie 不升版；正式欄位優先、無值退回課程進度推導；結果頁五條長條含 C1；『僅供參考』與重測文案佔位待 G3；AC#3 以題數×3 秒＋實測耗時驗並本機實等一次；授權本機下載 ECDICT 原檔做完整假字檢查；門檻 LexTALE 平均 ≥85（＝無誤勾時認識 70%）。

2026-10-02 Stage 0–2 審過（a82febc）：論文公式讀 PMC 全文；假字過濾（lexicon/ECDICT 切片＋完整原檔、編輯距離 ≥2、6 字母以上 ≥3、不雅字）；計分 ≥85、勾過半假字強制 A1＋重測；content 50、app 155 綠、突變紅。代決：真字池排除 ≤3 字母與功能詞（低鑑別力）。

2026-10-02 Stage 3–4 審過（af55492、52857f3）：settings.cefr_level migration＋pgTAP 87、同步 2/2、首頁／設定改讀正式欄位、跳過寫 A1、s10 三畫面；單元 249、e2e 50。代決：真字池加冒犯字黑名單；ETS／CEFR 入英文白名單；320 寬單欄、五條長條、置中等偏差接受。

2026-10-02 Stage 5 結案（65c8072）：AC#1 400 假字 0 命中（含 ECDICT 原檔）、AC#2 四作答者正確、AC#3 實等 182 秒（<300）、AC#4 公式出處（PMC 全文）；冒犯字 16 個排除；視覺 smoke 4/4。派驗收兼走查。

2026-10-02 隔離驗收＋走查（65c8072）有條件 PASS：AC#1–#4 ✅（自產 900 假字對 ECDICT 原檔 0 命中、四作答者手算、181–185 秒、pgTAP 87、同步 cefrLevel）；P1 勾選底色被 bg-surface 蓋掉、P1 長字在兩欄被切斷；P2 AC#1 測試鑑別力弱、少數假字難唸。退修。

2026-10-02 走查修正 c49c33e：勾選底色各狀態給一次＋computed 底色 e2e（修前紅）；長字不斷字、≥10 字母佔整列＋各級最長字窄螢幕 e2e；pseudowordFilter 直接測（突變 3 種皆紅）；可唸性過濾（ECDICT 原檔仍 0 命中）；WebKit 兩支長測試時限 90 秒。核准，merge main 後併。

2026-10-02 merge main 5b96f3d（8d8aac0）：首次判斷保留 inPool＋級距、json 雙 placement 區塊改以 main 定稿為底、新 key 列 _pendingG3、pgTAP 87、整合 3/3、e2e 兩引擎綠。squash-merge main 7033aac；證據 docs/verification/2026-10-02-task17-placement-evidence/。
<!-- SECTION:NOTES:END -->
