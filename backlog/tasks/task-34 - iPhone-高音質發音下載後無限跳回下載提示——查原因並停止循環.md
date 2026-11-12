---
id: TASK-34
title: iPhone 高音質發音下載後無限跳回下載提示——查原因並停止循環
status: In Progress
assignee: []
created_date: '2026-11-12 17:18'
labels:
  - app
dependencies: []
priority: high
ordinal: 31000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
來源：創辦人 2026-11-13 回報 iPhone 17 使用者（Safari 與 Chrome 皆同）：高音質發音下載到 100% 後，去選高音質發音又跳出下載提示；再按下載，進度立刻到 100%，之後又跳回下載提示，無限循環。

【需求】
第一階段：查出 iPhone 上高音質發音失敗的真正原因並停止循環。第二階段（另行裁示）依原因決定支援或不支援。

【現況與推斷（未在真機重現）】
- 再按下載進度立刻 100%，表示模型檔已在快取；問題比較像下載後的「載入」失敗（Kokoro fp32＋WebGPU，app/src/speech/kokoro.worker.ts:40），而非檔案沒存到。
- 下載流程：startDownload → boot 成功才寫入已下載旗標，失敗設 failed（app/src/speech/hqVoice.ts:198-213）。
- 設定頁選高音質時，只要狀態不是 downloaded 就跳下載確認框（app/src/screens/settings/SettingsScreen.tsx:185），所以 failed 或分頁重開後的 notDownloaded 都會表現成「又跳出下載提示」。
- App 啟動時 init 若找不到快取中的模型檔，會清掉已下載旗標（hqVoice.ts:186-194）。
- iOS 對分頁與 WebGPU 的記憶體限制嚴格，可能在載入時讓 Worker 或分頁被關。
- Playwright 的 WebKit 沒有 WebGPU，本機無法重現。

【範圍】
做：
1. 失敗時不再表現成「未下載」：載入或下載失敗要顯示明確的失敗狀態與原因類型，不重複跳下載確認框誘導無限重試。逐一核對各失敗路徑（Worker onerror、worker 回報 error、逾時、分頁被關後重開、啟動時找不到快取）在 UI 上各呈現什麼。
2. 診斷資訊：記錄最近一次高音質失敗（階段、錯誤訊息、時間）存 localStorage；新增不在 App 內連結的診斷頁 /debug/voice，顯示瀏覽器 UA、WebGPU 是否可用與 adapter 主要限制、navigator.storage.estimate 與 persisted、transformers-cache 內檔案清單與大小、高音質相關 localStorage 旗標、最近一次失敗紀錄，讓使用者截圖回傳。
3. 回報根因推斷與第二階段可選方案（含成本），不先改模型或精度。
不做：不換模型、不改 dtype 或 device、不移除 iPhone 支援、不動 TASK-31／32 的發音取代與取消機制。

【邊界】
動 speech 與設定頁語音區、路由；與 TASK-33（AI 設定區）無檔案重疊，可並行。新增使用者可見文案列出供創辦人逐字審；診斷頁屬內部工具，文字可用英文，但須符合 noHardcoded 守衛規則（不行就走 i18n）。

dev-flow 情境：調查＋修 bug。
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 各失敗路徑在設定頁的呈現已逐一列出，且沒有任何一條會在失敗後表現成未下載而無限跳回下載確認框（有單元測試）
- [ ] #2 失敗時顯示明確的失敗狀態；最近一次失敗紀錄（階段、訊息、時間）寫入 localStorage
- [ ] #3 C:/Program Files/Git/debug/voice 診斷頁顯示需求列出的各項資訊，App 內沒有連到它的入口
- [ ] #4 回報含根因推斷與第二階段方案（成本、取捨）
- [ ] #5 lint、typecheck、npm test、build 過；tts-hq、listen e2e 綠；TASK-31／32 測試全綠
<!-- AC:END -->
