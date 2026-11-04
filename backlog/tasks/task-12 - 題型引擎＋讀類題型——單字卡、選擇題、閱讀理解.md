---
id: TASK-12
title: 題型引擎＋讀類題型——單字卡、選擇題、閱讀理解
status: Done
assignee: []
created_date: '2026-10-01 16:00'
updated_date: '2026-10-02 01:07'
labels:
  - app
dependencies:
  - TASK-11
priority: high
ordinal: 12000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
來源：docs/spec/requirements.md v0.1（2026-10-01 創辦人六輪釐清定案）
【需求】規格 §6 讀類題型，且所有題型共用一個引擎。
【範圍】做：題型引擎（讀取 content JSON、題目佇列、作答、回饋、結算、寫入 FSRS 評分）；作答結果到 FSRS 評分的對應規則（代決：答錯＝Again、答對但用時 >15 秒或用了提示＝Hard、答對＝Good、單字卡由使用者自評四級）；單字卡（翻面、自評）、選擇題、閱讀理解。不做：聽說寫題型（TASK-13～15）。
【邊界】用 TASK-8 pilot 題庫開發與測試，不等全量。
【dev-flow】feat
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 題型引擎單元測試：佇列、計分、FSRS 寫入、中途離開可續
- [x] #2 三種讀類題型 E2E 在兩個手機 project 通過
- [x] #3 答對／答錯回饋符合定版設計（視覺 smoke 截圖）
<!-- AC:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
2026-10-02 創辦人 G2 裁示：單字卡改為四選一中文釋義（不翻面、不自評四級），FSRS 評分沿用本卡通用對應（答錯＝Again、答對但 >15 秒或用提示＝Hard、答對＝Good；不提供 Easy），取代本卡原代決『單字卡由使用者自評四級』。以 docs/design 定版為準。

2026-10-02 Round 1 代決：單字卡四選一資料由題庫預產（TASK-8 schema 加 glossZh、distractorsZh[3]、mcq 選填 optionGlossZh；ipa/toeic 由字典與 lexicon 取）；只有單字卡寫 FSRS；本卡做小課外框/完成頁/completeLesson/新字入池，今日組裝與 /review 歸 TASK-18；中途離開存 Dexie v3 lessonRuns（本機不同步）；E2E 以建置旗標讀樣本課。

2026-10-02 Stage 0–1 審過（818f8f4）：引擎佇列／計分（15.000s=Good、15.001s=Hard）／FSRS 單交易寫入／中途續作／結算 onSettle；Dexie v3 lessonRuns、completeLesson；182 單元綠、3 突變紅。Stage 2 待 TASK-11 併入。

2026-10-02 Stage 2–3 審過（89cfe59、b4e6719）：/lesson/:id、s03 外框、單字卡四選一／選擇題／閱讀、回饋條、s12、s14；小課 E2E＋視覺 20/20；單元 273；偏差 17 條。全套 e2e 回歸曾因記憶體被回收，授權拆 project 前景重跑。

2026-10-02 全套 e2e 66 項：64 過 2 略（webkit 離線既有 skip），TASK-11 既有測試無回歸。派隔離驗收兼走查。

2026-10-02 隔離驗收＋走查（b4e6719）FAIL：AC#3 選項答對／答錯底色被 bg-surface 蓋掉（CSS 順序），偏差清單未列；P1 閱讀譯文展開後在可視範圍外；P2 最後一題 ✕ 文案與行為不一致、spec 註解無斷言、單交易無失敗注入測試。AC#1（突變 5 種皆紅）、AC#2（兩 project）、正式建置不含 fixture、越界無：通過。退修。

2026-10-02 修正 3212a50：bg-surface 移到 default/selected/dim＋computed 底色 e2e（修前紅）、譯文捲入視野＋in-viewport e2e、最後一題 ✕ 文案與結算一致、課程地圖完成斷言、單交易失敗注入測試；e2e 68 過 2 略。squash-merge main 54301fc；證據 docs/verification/2026-10-02-task12-read-items-evidence/。偏差 19 條。
<!-- SECTION:NOTES:END -->
