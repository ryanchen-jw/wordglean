---
id: TASK-27
title: 上線試用回饋（11-05）——AI 批改失敗、閱讀題翻譯鈕、Google 登入
status: Done
assignee: []
created_date: '2026-11-04 18:02'
labels:
  - app
dependencies: []
priority: high
ordinal: 27000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
來源：2026-11-05 創辦人手機試用正式站（wordglean.pages.dev），上線流程 TASK-23 期間發現。
【需求】修復上線試用發現的三個問題，讓登入、AI 批改、閱讀理解在正式站可正常使用。
【現況（已實證）】
① AI 批改失敗，畫面顯示「AI 這次沒有給出可用的結果」。app/src/llm/models.ts:3 的預設模型 qwen/qwen3.8-27b:free 與 apodex/apodex-1.1-mini:free 已不在 OpenRouter 公開模型清單（11-05 查，453 個模型、12 個免費）。創辦人手動選 Google 免費模型後仍失敗，所以下架不是完整根因，真正原因待查。
② 閱讀理解作答後沒有「看中文翻譯」按鈕。app/src/screens/lesson/ReadingView.tsx:85-96，切換鈕只存在未作答分支。
③ Google 登入後未建立工作階段。原 redirectTo 回首頁，首頁不載入 session 模組（動態載入、不進首屏是刻意設計），網址裡的 token 沒被讀取。修正 2c37372 改回 /settings，Supabase Redirect URLs 已加入 /settings；修復後的本機端到端因記憶體不足未跑，待正式站實測。
【範圍】做：① 查明根因；預設模型換 Google 免費模型（google/gemma-4-31b-it:free 優先）；模型下架時自動切換，預設全下架時選仍存在的免費模型且 Google 優先；舊連結自動遷移。② 作答後仍可切換翻譯。③ 正式站驗證登入。不做：模型品質評測（創辦人 11-05 裁示不評測）；改動對外文案。
【邊界】① 模型資料政策須對照 docs/research/free-models.md 第 7 節第 6 點（提供商不拿 prompt 訓練）；若不符合，依裁示先換，並列出待創辦人決定事項與受影響的隱私說明文字。真打只限 smoke，上限 8 次，費用 US$0，不寫入 content/eval/results/。協調：③ 是 TASK-23 驗收 3 的前置，TASK-23 走查與公開 repo 排在本卡之後；① 與 TASK-15 同檔案但該卡已結案。
【dev-flow】fix
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 AI 批改以 App 同一份程式真打成功並解析出繁中結果，根因寫回本卡
- [x] #2 預設模型全部下架時會自動改用仍存在的免費模型且 Google 優先；手動選定且仍存在的模型不被更換；有對應測試
- [x] #3 閱讀理解答對與答錯後都能展開與收起中文翻譯，手機雙引擎截圖確認
- [x] #4 正式站 Google 登入成功：設定頁顯示已登入，重新整理後仍登入
- [x] #5 零回歸：lint、typecheck、相關單元測試、build 通過；正式站部署後走查登入與批改
<!-- AC:END -->

## Comments
<!-- COMMENTS:BEGIN -->
---
created: 2026-11-05 05:00
---
結案（11-05）：根因是舊預設模型下架、Gemma 被上游 429 且舊鏈無有效備援（用開發端金鑰重現，非手機紀錄）。預設鏈改 gemma31、xing4.0、openrouter/free，整批失敗自動換一批；創辦人裁示隱私不作條件，已更新隱私文案。真機驗過批改、閱讀翻譯、Google 登入。走查另見閱讀短文行首逗號：標點修正造成 axe 與 visual-smoke 回歸，已還原（de16a1b），候選修法存 docs/pending/candidate-nowrap-wbr.patch，未修。
---
<!-- COMMENTS:END -->
