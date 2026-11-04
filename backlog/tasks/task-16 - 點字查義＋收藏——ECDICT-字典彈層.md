---
id: TASK-16
title: 點字查義＋收藏——ECDICT 字典彈層
status: Done
assignee: []
created_date: '2026-10-01 16:00'
updated_date: '2026-10-02 03:14'
labels:
  - app
dependencies:
  - TASK-6
  - TASK-11
priority: medium
ordinal: 16000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
來源：docs/spec/requirements.md v0.1（2026-10-01 創辦人六輪釐清定案）
【需求】規格 §2、§7：學習內容中任何英文字點一下即查 ECDICT（離線），可加入收藏進單字池。
【範圍】做：可點擊英文字的文字元件（處理標點、縮寫、詞形還原：複數、過去式、進行式至原形，代決用輕量規則＋ECDICT 詞形欄位）；字典彈層（音標、詞性、繁中釋義、CEFR 等級、多益常考標記、TTS 播放、加入收藏）；字典分片延遲載入與快取。不做：句子翻譯（規格明定不需要）。
【邊界】彈層樣式依定版設計。
【dev-flow】feat
【借鑑】詞形還原改為先查 ECDICT 的 lemma.en.txt 與 exchange 欄位（TASK-6 產出的切片），查不到才退回規則。（參考 docs/research/oss-landscape.md）
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 詞形還原單元測試 ≥ 30 例（不規則動詞與複數）
- [x] #2 點字→彈層→收藏→單字庫出現 的 E2E 通過；離線狀態可查
- [x] #3 彈層開啟延遲（chromium 模擬，字典已快取）< 150ms
- [x] #4 詞形還原命中來源（資料表／規則）統計列入報告，30 例中大多應由資料表命中
<!-- AC:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
2026-10-02 創辦人 G2 裁示：全 App 只要出現英文單字（題目、選項、短文、例句、回饋、單字卡、單字庫、批改結果）都要可點查義，作答中查字不影響題目狀態。規格見 docs/design 定版的『可點英文字』元件。

2026-10-02 Round 1 代決：字典 597 片＋lexicon 全部預快取（約 3.3MB）；取消收藏補同步墓碑（收藏以最後修改者為準，TASK-20 測試維持綠）；無課程來源且未收藏的字不在單字池（具名判斷函式供 TASK-18）；發音先用 speechSynthesis；EnglishText 介面定案轉 TASK-12；Dexie 不升版。

2026-10-02 Stage 1 審過（1d9cfa5）：65 例詞形還原全對，命中來源 table 60／rule 5；獨立成詞的變化形照本身顯示（found、lost…）；leaves→leave 不看上下文。代決：句中大寫字查無原樣時，只有小寫在 lexicon 內才退回小寫查，否則『查無此字』（Jenny 不再顯示紡紗機）。

2026-10-02 Stage 2–4 審過：彈層三態＋Toast 復原、inPool、字典預快取 619 項 12.9MB（小檔不內嵌以守資料授權分界）、單字庫中文顯示／搜尋、取消收藏墓碑（favoriteUpdatedAt，最後修改者勝、同毫秒收藏勝）；單元 333、e2e 50。代決：首頁首次判斷改用 inPool。Stage 5 須實跑 e2e:sync。

2026-10-02 Stage 5 結案（9dfa263）：AC#1 65 例、AC#2 兩 project＋chromium 離線查 zebra、AC#3 p50 5.6ms／p95 12ms（30 樣本、桌機未限速）、AC#4 table 60／rule 5；e2e:sync 12、整合 3 含墓碑往返；單元 334、e2e 56。派驗收兼走查。

2026-10-02 隔離驗收＋走查（9dfa263）FAIL：P1 發音鈕 computed 為 text 色（iconBtnCls 的 text-text 蓋掉 text-primary）。AC#1–#4 全 ✅（自量 p50 7.5ms／p95 15.7ms、n=30）、守衛 3 組皆紅、字典不進 JS bundle、e2e:sync 12/12。退修並 merge main（替換 TASK-12 EnglishText stub）。

2026-10-02 修正 a7d7c42：iconBtnCls 拆掉文字色（6 處各自給色）＋icon-color e2e（修前 8 紅）；已收藏鈕 text-balance；merge main（e89198b）以真 EnglishText 取代 TASK-12 stub、單字卡測驗字作答後可點。代決：安裝卡關閉鈕 muted；EnglishText disabled 改原形比對（防變化形洩漏答案）。

2026-10-02 修正 23cabcb：EnglishText disabled 原形比對（meetings／went 作答前不可點，突變 5 紅）。squash-merge main 7874889；證據 docs/verification/2026-10-02-task16-dictionary-evidence/。AC#2 離線僅 chromium 驗。
<!-- SECTION:NOTES:END -->
