---
id: TASK-8
title: 題庫產生管線＋pilot 兩單元——含成本估算
status: In Review
assignee: []
created_date: '2026-10-01 16:00'
updated_date: '2026-10-01 16:01'
labels:
  - content
dependencies:
  - TASK-7
priority: high
ordinal: 8000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
來源：docs/spec/requirements.md v0.1（2026-10-01 創辦人六輪釐清定案）
【需求】規格 §4：開發方用 LLM 批次產生題庫（例句、閱讀短文、選項、參考答案、繁中翻譯），自動檢查後創辦人抽審。
【範圍】做：題目 JSON schema（四類題型全部欄位，含寫作題的參考答案與評分要點、閱讀題的短文與問題）；產題 prompt（版本化存檔）；自動檢查器：用字不超過該課級距（以 lexicon 判定，允許清單外專有名詞）、選擇題答案唯一（第二個 LLM 判題交叉驗證）、繁中無簡體與大陸用語、長度範圍；pilot 產生 A1 第 1 單元與 B1 第 1 單元全部小課。全量成本估算（模型、token 數、金額、時間）。不做：全量產生（TASK-9）。
【邊界】真錢：產題走開發方的 OpenRouter 金鑰（.env，不進 repo）。pilot 先報估算再跑，pilot 本身上限 US$3；失敗不自動重跑（記憶 feedback_app_api_cost_gate_for_real_runs）。抽審用 Artifact 圈選頁（每題 OK／修改／刪除）。
【dev-flow】feat，留閘 G5（pilot 抽審＋全量預算核准）
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 schema 與自動檢查器有單元測試，含刻意注入的越級字、雙答案、簡體字三種負向案例被擋
- [ ] #2 pilot 兩單元產出且自動檢查全綠，實際花費與 token 數記錄
- [ ] #3 全量成本估算報告（三個候選模型的品質抽樣比較＋金額）
- [ ] #4 以 Artifact 圈選頁交付 pilot 抽審，停 In Review 等 G5；創辦人核准預算上限後才 Done
<!-- AC:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
2026-10-02 Stage 0–3 完成（分支 worktree-task-8-item-bank，752f50b→fb2e6cb）：題目 schema、自動檢查器（越級／無級距／簡體＋opencc s2twp 不變性／大陸用語／長度／選項／答案）、版本化產題與判題 prompt、產題程式（金鑰缺席 exit 2 拒跑、預算硬上限、最壞情況逐呼叫把關、失敗不重跑）、乾跑 16 課全綠、content 測試 73/73。代決：每課題量（單字卡 8、聽打 1、聽選 1、跟讀 2、選擇 2、閱讀 1 篇 2 題、寫作中翻英與造句各 1）；候選 sonnet-5.5／gemini-3.8-flash／gpt-6-luna、判題不同家族、deepseek 不列；無級距字一律擋、白名單人審；模型比較加抽 b1-u14-l01 補情境題代表性；opencc-js 1.4.2（MIT AND Apache-2.0）只用於產題管線、Stage 5 補 NOTICE。成本（2026-10-01 OpenRouter 價）：pilot 約 US/usr/bin/bash.40、最壞 US.34；全量 984 課 US.3（luna）～US8（sonnet）。卡點：本機無開發方 OpenRouter 金鑰→Stage 4 真打需創辦人放 .env 後放行。停 In Review（G5 前置）。
<!-- SECTION:NOTES:END -->
