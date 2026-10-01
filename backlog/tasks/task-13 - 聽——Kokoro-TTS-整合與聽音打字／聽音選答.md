---
id: TASK-13
title: 聽——Kokoro TTS 整合與聽音打字／聽音選答
status: To Do
assignee: []
created_date: '2026-10-01 16:00'
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
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 TTS 服務單元測試（以 mock 驗退回邏輯）；chromium 模擬下 Kokoro 實際合成一句成功
- [ ] #2 強制模型載入失敗時自動退回系統聲音且 UI 有提示
- [ ] #3 兩種聽力題型 E2E 通過；聽音打字的寬鬆比對規則有單元測試
<!-- AC:END -->
