---
id: TASK-1
title: 語音原型實測——Kokoro TTS＋Moonshine STT 在手機瀏覽器的可行性
status: In Review
assignee: []
created_date: '2026-10-01 16:00'
updated_date: '2026-10-01 15:14'
labels:
  - app
dependencies: []
priority: high
ordinal: 1000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
來源：docs/spec/requirements.md v0.1（2026-10-01 創辦人六輪釐清定案）
【需求】規格 §2 標記的最大技術風險：iOS Safari WASM 實務可用記憶體約 300MB，Kokoro（約 90MB）與 Moonshine tiny（約 28MB）同時常駐可能撐不住。先做最小原型量測，再定 TASK-13／14 的載入策略。
【現況】尚無程式碼。調查依據 docs/research/langapp-research.md §4。
【範圍】做：獨立原型頁 prototypes/voice-poc/（不進 app/）；Kokoro 合成、Moonshine 辨識、兩者同時載入、WebGPU→WASM 後備；自動化量測用 browser skill 的 webkit（iOS 代理）與 chromium（Android 代理）模擬。不做：正式 UI、整合進 app。
【邊界】模擬無法量真機記憶體上限 → 留閘 G4：產出一個可在手機開啟的原型頁與 5 分鐘自測步驟（需 HTTPS 才能用麥克風：本機用 vite --host＋mkcert 或 Cloudflare quick tunnel），由創辦人真機自測回填；創辦人略過時以模擬結論為準並明列未驗項。
【dev-flow】investigate-only
【借鑑】以 transformers.js-examples 的 moonshine-web（Apache-2.0）Worker 範本與 kokoro-js 為起點改寫，不從零寫 Worker；模型換成 Moonshine tiny。不使用 VAD 自動斷句（2026-10-01 裁示：跟讀只用按鈕）。（參考 docs/research/oss-landscape.md）
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 原型頁可載入 Kokoro 唸出指定英文句，記錄首次下載時間、載入時間、單句合成延遲
- [x] #2 原型頁可錄音並以 Moonshine tiny 轉文字，記錄載入時間、辨識延遲、10 句測試句的逐字正確率
- [x] #3 兩模型同時載入時，在 webkit 與 chromium 模擬下記錄記憶體與是否崩潰；WebGPU 不可用時的 WASM 後備路徑實測一次
- [ ] #4 產出手機自測步驟（含 HTTPS 開法、要回填的 6 個數字）並停 In Review 等 G4；創辦人回填或明示略過後才可 Done
- [x] #5 結論寫 docs/research/voice-poc.md：可行／需降級（系統聲音、分時載入、只載一個）／不可行，附數據與給 TASK-13／14 的載入策略建議
<!-- AC:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
2026-10-01 驗收 PASS（AC#1–3、#5；AC#4 自測步驟已備、待 G4 真機回填）。結論需降級：Moonshine 可行（98%）、Kokoro 手機即時合成不可行（q8 每句 11–32 s）。代決：transformers.js 直載 ONNX、共用 v3 引擎、LibriSpeech 真人錄音、webkit 閘門改看 working set（Windows WebKit 預留 private bytes 誤判）。給 TASK-13／14 的載入策略見 docs/research/voice-poc.md §5。需裁示：TTS 改預設系統聲音或產題時離線預產音檔（影響規格 §2）。
<!-- SECTION:NOTES:END -->
