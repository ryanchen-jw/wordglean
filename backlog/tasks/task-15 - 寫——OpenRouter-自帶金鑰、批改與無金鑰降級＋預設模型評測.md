---
id: TASK-15
title: 寫——OpenRouter 自帶金鑰、批改與無金鑰降級＋預設模型評測
status: To Do
assignee: []
created_date: '2026-10-01 16:00'
labels:
  - app
dependencies:
  - TASK-12
priority: high
ordinal: 15000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
來源：docs/spec/requirements.md v0.1（2026-10-01 創辦人六輪釐清定案）
【需求】規格 §2、§6：使用者自帶 OpenRouter（OAuth PKCE 一鍵授權或貼金鑰），金鑰只存瀏覽器、瀏覽器直呼；可自選模型；寫作題 LLM 改錯並以繁中解釋語法；無金鑰時降級為對照參考答案自評。
【範圍】做：PKCE 授權流程與貼金鑰；金鑰存放（IndexedDB，提供一鍵清除）；模型清單（OpenRouter models API，標價格與是否免費）；批改 prompt（輸出結構化 JSON：修正後句子、逐處錯誤、繁中解釋、等級是否合宜）與解析容錯；中翻英、造句題 UI；無金鑰降級 UI；預設模型評測：準備 40 句台灣學習者常見錯句，比較 4 個候選模型的正確率與繁中解釋品質。不做：伺服器代呼（伺服器永不碰金鑰）。
【邊界】真錢：評測走開發方金鑰，預估 < US$2，超過即停（含在 G5 預算授權內，若 G5 未核則評測只用免費模型）。預設模型以評測結果代決（正確率最高且單次 < US$0.002 者）。
【dev-flow】feat
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 PKCE 流程以 mock OpenRouter 端點做 E2E；貼金鑰、清除金鑰有測試；網路面板確認金鑰只送往 openrouter.ai
- [ ] #2 批改回應解析對 5 種畸形輸出有容錯測試
- [ ] #3 無金鑰時寫作題可用參考答案自評，並顯示設定金鑰提示
- [ ] #4 評測報告 docs/research/llm-eval.md（40 句、4 模型、花費），預設模型依代決原則選定並記錄
<!-- AC:END -->
