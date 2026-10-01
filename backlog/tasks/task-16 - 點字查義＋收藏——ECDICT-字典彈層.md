---
id: TASK-16
title: 點字查義＋收藏——ECDICT 字典彈層
status: To Do
assignee: []
created_date: '2026-10-01 16:00'
updated_date: '2026-10-01 16:41'
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
- [ ] #1 詞形還原單元測試 ≥ 30 例（不規則動詞與複數）
- [ ] #2 點字→彈層→收藏→單字庫出現 的 E2E 通過；離線狀態可查
- [ ] #3 彈層開啟延遲（chromium 模擬，字典已快取）< 150ms
- [ ] #4 詞形還原命中來源（資料表／規則）統計列入報告，30 例中大多應由資料表命中
<!-- AC:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
2026-10-02 創辦人 G2 裁示：全 App 只要出現英文單字（題目、選項、短文、例句、回饋、單字卡、單字庫、批改結果）都要可點查義，作答中查字不影響題目狀態。規格見 docs/design 定版的『可點英文字』元件。
<!-- SECTION:NOTES:END -->
