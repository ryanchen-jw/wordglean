---
id: TASK-13
title: 聽——Kokoro TTS 整合與聽音打字／聽音選答
status: Done
assignee: []
created_date: '2026-10-01 16:00'
updated_date: '2026-10-02 06:05'
labels:
  - app
dependencies:
  - TASK-12
  - TASK-1
priority: high
ordinal: 13000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
來源：docs/spec/requirements.md v0.1（2026-10-01 創辦人六輪釐清定案）
【需求】規格 §2、§6：預設 Kokoro，載不動時退回系統聲音。
【範圍】做：TTS 服務（Web Worker 內載模型、依 TASK-1 結論的載入策略、快取到 Cache Storage、下載進度、失敗或記憶體不足自動退回 speechSynthesis）；語速 0.8／1.0 切換；聽音打字（大小寫與標點寬鬆比對、拼字錯誤標示）、聽音選答。不做：發音評分。
【邊界】載入策略以 TASK-1 結論為準；若結論為不可行，改為「預設系統聲音、Kokoro 選配」並在卡 comment 記錄。
【dev-flow】feat
【借鑑】聽音打字的寬鬆比對移植 LibreLingo answer-corrector（AGPL，可直接搬成 TS）：正規化、多個正確答案、Levenshtein 距離 ≤1 視為正確但給提示。移植出處寫入程式註解與 NOTICE。（參考 docs/research/oss-landscape.md）
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 TTS 服務單元測試（以 mock 驗退回邏輯）；chromium 模擬下 Kokoro 實際合成一句成功
- [x] #2 強制模型載入失敗時自動退回系統聲音且 UI 有提示
- [x] #3 兩種聽力題型 E2E 通過；聽音打字的寬鬆比對規則有單元測試
- [x] #4 移植的比對器通過原規則的等價測試，另加本專案縮寫與數字案例
<!-- AC:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
2026-10-02 創辦人裁示：語音來源 A——預設手機系統聲音（speechSynthesis），Kokoro 為設定選配（僅 WebGPU＋fp32、約 310MB、下載前告知）；載入策略依 docs/research/voice-poc.md §5。G4 真機自測已略過，以模擬結論為準。

2026-10-02 派工代決：照『聽』A 裁示——預設系統聲音、Kokoro 選配（WebGPU fp32、310MB、下載前告知），取代卡片『預設 Kokoro』。

2026-10-02 Round 1 代決：聽音打字以設計 v1.0 為準——只寬鬆大小寫／標點／彎引號／縮寫／數字，拼錯算錯（取代卡片借鑑的 Levenshtein ≤1 算對；移植比對器保留並通過原等價測試）；kokoro-js 1.2.1＋transformers 3.8.1 鎖版（>6 個月未更新，選配路徑、原型實測可用）；實際合成只做本機選用測試；設定『發音』列用 OptionSheet；espeak-ng GPL-3.0 入 NOTICE；合併順序 TASK-16 先。

2026-10-02 Stage 0–1 審過（f1f01bb）：LibreLingo 原 5 例等價、check 25 例、突變 4 種皆紅。

2026-10-02 Stage 2–3 審過：TTS 服務（系統聲音、慢速、退回）、聽音打字／選答畫面與登記、e2e 兩 project 18/18、單元 331。偶發單元失敗 1/5 次待查。

2026-10-02 Stage 4 審過（7fbfebf）：Kokoro 選配（WebGPU fp32、下載告知 310MB、真進度、崩潰旗標、音檔快取）、AC#2 失敗退回＋提示 e2e、s03 computed 色、NOTICE 含 eSpeak NG GPL-3.0；發音入口統一 speech/speak.ts。偶發失敗根因：HomeScreen findByText 1 秒逾時（負載）。代決：setup.ts 調 asyncUtilTimeout；ort wasm 改本站與 TASK-14 一致；清除資料不清模型快取（非個人資料，記已知限制）。

2026-10-02 結案（b5b4e56）：asyncUtilTimeout 3000（全套 3 次穩定）、Kokoro 改本站 wasm（與 TASK-14 一致、dist 只一份）、AC#1 真模型合成（下載 44s、合成 5.3s、第二次走快取）、merge main 7fc6245、7 個自擬 key 改用定稿；unit 506、e2e 67＋63。待驗收（Playwright 名額排隊）。

2026-10-02 隔離驗收＋走查（b5b4e56）：AC#1–#4 ✅（LibreLingo 5 例逐字比對原檔、WAV 長度核對、第二次未連 HF）、守衛 3 組紅、走查無 P0；FAIL P1：Kokoro worker 載入失敗（404）時無退回、無提示、下載卡 0%。P2：NFKC、無 WebGPU 仍提示、aria-live、載入中等待狀態；Tom is dog 歧義列已知限制。退修並 merge main e0979c9。
2026-10-02 結案（a9d1490）：第二輪隔離驗收 PASS——P1 Worker 404／無回應退回內建聲音（突變 4 項轉紅、自寫 404／pending 探測 6/6）、P2 四項成立、e2e chromium 81 綠／webkit 76 綠、computed 色吻合 token。已知 P2 留 TASK-22：①播放時載入共用 90 秒逾時（worker 請求懸置時首播無聲約 90 秒，建議首次回音 10 秒）②全形逗號後無空白判錯（斷字只靠空白）③合成階段無逾時。另：HomeScreen.test 全套負載下偶發逾時（單跑綠），留 TASK-22。合併後一課 16 題（能播音時跟讀以聽音打字替代，TASK-14 併入後恢復）。
<!-- SECTION:NOTES:END -->
