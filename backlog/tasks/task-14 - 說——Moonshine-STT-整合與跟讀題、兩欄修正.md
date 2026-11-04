---
id: TASK-14
title: 說——Moonshine STT 整合與跟讀題、兩欄修正
status: Done
assignee: []
created_date: '2026-10-01 16:00'
updated_date: '2026-10-02 05:34'
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
- [x] #1 逐字比對演算法單元測試（≥15 組含縮寫、數字、漏字、多字）
- [x] #2 以預錄 10 句音檔跑 STT 的整合測試，逐字正確率記錄於卡
- [x] #3 以使用者確認／修正後送出的句子與目標句比對計分；辨識結果與送出句的差異寫入紀錄（speech_corrections），有測試
- [x] #4 Web Speech 後備需同意才啟用，有測試；網路面板確認錄音無任何上傳請求
<!-- AC:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
2026-10-02 創辦人 G2 裁示（規格 §6 已改寫）：跟讀辨識完先讓使用者確認／修正，按送出後以送出句與目標句逐字比對計分；不再有『模型聽錯、不計分』標記。辨識結果與送出句差異仍要保留紀錄（speech_corrections）。

2026-10-02 G4 真機自測已略過，以模擬結論為準；Moonshine 用範本精度（WebGPU encoder fp32＋decoder q4 約 76MB、WASM 約 52MB）、限輸出長度、分時載入，見 voice-poc.md §5。

2026-10-02 派工代決：計分照 G2 裁示（規格 §6：確認／修正後送出、以送出句計分、差異留紀錄），取代卡片『分數以辨識結果為準』；AC#3『修正後分數不變』與裁示衝突，待創辦人改 AC（實作照裁示、AC#3 不自行勾）。STT 用 52/76MB 組合、限制輸出長度、無 VAD。

2026-10-02 Round 1 代決：不做『模型聽錯』標記、每次送出寫 speechCorrections；跳過＝答錯；以第一次送出計分；模型先按鈕下載（50–80MB）；transformers.js 3.8.1；回饋第二行顯示目標句＋中譯；模型自 HF hub 下載（隱私說明交 TASK-21）；Web Speech 只在 Moonshine 不可用時提出、同意僅本次。

2026-10-02 Stage 0–1 審過（11198cd）：compareWords 23 組（縮寫、數字、漏字、多字）、突變 5 種皆紅；AC#1 可勾。

2026-10-02 Stage 2–3 審過（1ca3cfd、5bb3943）：STT 服務（WebGPU fp32+q4／WASM fp32+q8、輸出上限、單一辨識）、ort wasm 本站、麥克風四態、s04 七狀態、每次送出寫 speechCorrections；單元 347。e2e 因記憶體未跑成，授權前景補跑。

2026-10-02 Stage 4–5 結案：AC#2 預錄 10 句真模型逐字正確率 98.8%（251 字錯 3、3 次重跑一致）、錄音期間 0 請求；AC#4 Web Speech 需同意且僅 Moonshine 不可用時提出；s04 視覺 smoke 含 computed 色；13 則新文案 _pendingG3。已知限制：假麥克風循環錄音偶發空字串（tiny）；真機未驗。AC#3 文字與 G2 裁示衝突待創辦人改。

2026-10-02 merge main 7fc6245（4213b5d）：json 以 main 為底補回 13 則、_pendingG3 聯集；unit 516、e2e 53＋55、跟讀 e2e 17/17（真模型 98.8%、錄音 0 請求）。待驗收（Playwright 名額排隊）。
2026-10-02 創辦人裁示改 AC#3：「以使用者修正後送出的句子計分」（與 G2 一致）；舊文「修正後分數不變、標記模型聽錯」作廢。
2026-10-02 結案（f0e294a）：隔離驗收首輪 FAIL（P1 再唸一次→跳過卡死整課、取得麥克風期間連點／跳過留下 live 音軌）→ 修正 89c94be、afadca1 → 複驗 PASS。AC#1 align 23 組；AC#2 真模型 98.8%（251 字錯 3）；AC#3 依新文字，突變 2 項轉紅＋真瀏覽器 IndexedDB 紀錄；AC#4 同意閘＋netlog 錄音期間 0 POST／0 ws。走查 s04 七狀態 64 張、computed 色吻合 token。代決：e2e 主套件不帶跟讀題（能跟讀的出題順序由 lesson-order 兩引擎驗）；錄音中文字與光環拉開。移 TASK-22：近零秒錄音偶發 EncodingError、存檔失敗後 gone 旗標殘留的邊角。speech_corrections 含辨識原文同步雲端——隱私說明交 TASK-21（D7）。
<!-- SECTION:NOTES:END -->
