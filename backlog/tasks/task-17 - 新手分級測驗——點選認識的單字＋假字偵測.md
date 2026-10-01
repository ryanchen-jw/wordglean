---
id: TASK-17
title: 新手分級測驗——點選認識的單字＋假字偵測
status: To Do
assignee: []
created_date: '2026-10-01 16:00'
labels:
  - app
  - content
dependencies:
  - TASK-6
  - TASK-11
priority: high
ordinal: 17000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
來源：docs/spec/requirements.md v0.1（2026-10-01 創辦人六輪釐清定案）
【需求】規格 §5：約 5 分鐘純點選，混入假字抓灌水，依各級認識比例推定起始級距，之後可手動調整。
【範圍】做：假字產生器（可發音的非詞，須確認不在 lexicon 與 ECDICT、不是常見拼錯）；題組（每級抽樣字＋假字約 15–20%）；評分演算法（勾假字率校正的認識比例、逐級門檻推定，代決門檻：該級校正後認識率 ≥ 70% 視為已掌握）；模擬測試（以合成作答者：誠實 A2、誠實 B2、全勾灌水、全不勾，驗證推定正確）；測驗 UI 與結果頁（顯示「B1｜約多益 xxx+」）。不做：聽力分級。
【邊界】多益分數對照依 ETS 官方 CEFR 門檻（規格 §4），結果頁註明「僅供參考」。
【dev-flow】feat
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 假字產生器測試：抽 200 個無一在 lexicon／ECDICT
- [ ] #2 四種合成作答者的推定結果正確（灌水者被判為最低級或提示重測）
- [ ] #3 測驗全程 E2E < 5 分鐘（以平均每題 3 秒模擬）；結果寫入設定並可在設定頁調整
<!-- AC:END -->
