---
id: TASK-14
title: 說——Moonshine STT 整合與跟讀題、兩欄修正
status: To Do
assignee: []
created_date: '2026-10-01 16:00'
updated_date: '2026-10-01 16:41'
labels:
  - app
dependencies:
  - TASK-12
  - TASK-1
priority: high
ordinal: 14000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
來源：docs/spec/requirements.md v0.1（2026-10-01 創辦人六輪釐清定案）
【需求】規格 §6：唸題目句→轉文字→逐字比對標出錯字與漏字；辨識結果與使用者修正兩欄並列，分數以辨識結果為準，修正只標記「模型聽錯」、該題不扣分不加分，修正紀錄保留。
【範圍】做：STT 服務（Web Worker、依 TASK-1 載入策略、麥克風權限流程與拒絕時的說明）；錄音 UI 狀態（待命／錄音中／辨識中／完成）；逐字對齊比對（正規化大小寫、標點、數字與縮寫）；兩欄修正 UI；修正紀錄寫入本機。Web Speech API 僅作最後後備，啟用前提示「將傳送到瀏覽器廠商伺服器」並需使用者同意。不做：音素級發音評分。
【邊界】錄音一律不上傳（隱私承諾）；測試以預錄音檔餵入，不依賴真麥克風。
【dev-flow】feat
【借鑑】STT 服務以 moonshine-web Worker 為底；逐字比對採字詞層級 Levenshtein 對齊（參考 ai-pronunciation-trainer 的漏字成本設計，不引入 OR-tools 與 DTW）。錄音只用按鈕開始／結束，不做 VAD 自動停錄（2026-10-01 裁示）。（參考 docs/research/oss-landscape.md）
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 逐字比對演算法單元測試（≥15 組含縮寫、數字、漏字、多字）
- [ ] #2 以預錄 10 句音檔跑 STT 的整合測試，逐字正確率記錄於卡
- [ ] #3 使用者修正後分數不變、該題標記「模型聽錯」且紀錄寫入，有測試
- [ ] #4 Web Speech 後備需同意才啟用，有測試；網路面板確認錄音無任何上傳請求
<!-- AC:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
2026-10-02 創辦人 G2 裁示（規格 §6 已改寫）：跟讀辨識完先讓使用者確認／修正，按送出後以送出句與目標句逐字比對計分；不再有『模型聽錯、不計分』標記。辨識結果與送出句差異仍要保留紀錄（speech_corrections）。
<!-- SECTION:NOTES:END -->
