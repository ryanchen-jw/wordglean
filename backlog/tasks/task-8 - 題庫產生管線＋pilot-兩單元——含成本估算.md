---
id: TASK-8
title: 題庫產生管線＋pilot 兩單元——含成本估算
status: Done
assignee: []
created_date: '2026-10-01 16:00'
updated_date: '2026-10-02 04:37'
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
- [x] #2 pilot 兩單元產出且自動檢查全綠，實際花費與 token 數記錄
- [x] #3 全量成本估算報告（三個候選模型的品質抽樣比較＋金額）
- [x] #4 以 Artifact 圈選頁交付 pilot 抽審，停 In Review 等 G5；創辦人核准預算上限後才 Done
<!-- AC:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
2026-10-02 Stage 0–3 完成（分支 worktree-task-8-item-bank，752f50b→fb2e6cb）：題目 schema、自動檢查器（越級／無級距／簡體＋opencc s2twp 不變性／大陸用語／長度／選項／答案）、版本化產題與判題 prompt、產題程式（金鑰缺席 exit 2 拒跑、預算硬上限、最壞情況逐呼叫把關、失敗不重跑）、乾跑 16 課全綠、content 測試 73/73。代決：每課題量（單字卡 8、聽打 1、聽選 1、跟讀 2、選擇 2、閱讀 1 篇 2 題、寫作中翻英與造句各 1）；候選 sonnet-5.5／gemini-3.8-flash／gpt-6-luna、判題不同家族、deepseek 不列；無級距字一律擋、白名單人審；模型比較加抽 b1-u14-l01 補情境題代表性；opencc-js 1.4.2（MIT AND Apache-2.0）只用於產題管線、Stage 5 補 NOTICE。成本（2026-10-01 OpenRouter 價）：pilot 約 US/usr/bin/bash.40、最壞 US.34；全量 984 課 US.3（luna）～US8（sonnet）。卡點：本機無開發方 OpenRouter 金鑰→Stage 4 真打需創辦人放 .env 後放行。停 In Review（G5 前置）。

2026-10-02 免費模型調查完成（分支 worktree-free-models-research 220ea4c，docs/research/free-models.md）：零儲值每分鐘 20、每日 50 次（帳號共用）；pilot 44 次約 2 天、全量 40–50 天（儲值 US0 則每日 1,000、2–3 天）。候選（未實測）：產題 gemma-4-31b-it、nemotron-3-ultra、qwen3.8-27b；判題配不同家族。實測被 worker 分類器擋（0 次送出）；創辦人裁示 A：本人 attach 放行。代決：產題成功只補判題不算重跑；NVIDIA／Thinking Machines 訓練條款待讀一手後確認。

2026-10-02 免費模型實測完成（a088b88 docs/research/free-models.md §6，10 次 $0）。執行長代決：只准 :free 程式硬守衛；產題 Qwen3.8 27B、判題首選 Gemma 4 31B（不同家族、不訓練）；Nemotron 用前讀 NVIDIA Trial Terms 一手全文；429＝排隊延後（≥60 秒、同課 >5 次列今日未完成）、remaining≤2 收工續跑；產題輸出先落檔、判題失敗只補判題不重產。worker 01d9b374→7290ef09。bcc517b1 已 close。

2026-10-02 Stage 4a 審過（e27e9b3）：:free 硬守衛、花費非 0 中止、429 排隊、先落檔再判題，7 守衛突變紅證。NVIDIA Trial Terms 一手全文：§1.2 不得 production、§1.4 限內部評估、§4.2 不得散布產出 → 排除 Nemotron。模型比較改 Qwen vs Gemma 4 31B；勝出規則：檢查錯誤＋MCQ_AMBIGUOUS 少者勝、平手取 Qwen。放行 Stage 4b。

2026-10-02 pilot day1：Qwen 勝出（Gemma 產題 12 次全 429）；16 課產出 8 課、判題 Gemma 54 次全 429；130 請求成功 10、花費 $0、額度剩 36。ModelRun 條款逐條讀完，無禁止散布（產出歸屬未明文→G5 知情）。執行長代決：方案 C（明天重試）＋今天先讀 dots／apodex 條款、prompt v2（閱讀選項中文、禁大陸用語與簡體、級距限制）、判題備援機制；免費制下檢查失敗課允許 v2 各重產一次（帳本標 attempt=2，抽審頁並列 v1／v2）。

2026-10-02 備援判題：apodex（Novita 條款讀完：不訓練、零保留、產出不限散布；§3 禁酒類用途→比較課 b1-u14 不帶備援）；dots 排除（AtlasCloud 條款讀不到）。prompt v2、判題備援（連續 429×6 切換）、--regen-rejected（v2 一次、保留 v1）上線（17e4ba2）。未產題課用 v2。今日剩餘額度直接續跑。

2026-10-02 day2：4 課合格、5 課最終退件（含 3 課 JSON 壞）、3 課可重產、4 課待判；Gemma 57 次僅 1 成功，apodex 備援 16/16；v2 錯誤未減（4.4 vs 1.4/檔，越級為主）；全量估 52 天。執行長代決：AC#2 不改（創辦人主權），『合格課全綠＋退件清單』列 G5 選項；先做越級假陽性分析＋prompt v3（可用字表入 prompt）；JSON 壞課與最終退件課准 v3 再產（每課累計 ≤3 次）；apodex 判題上限 12,000；day3 台北 08:05 後由 worker 自行真打。

2026-10-02 執行長追加：schema 擴充 wordCard.glossZh、distractorsZh[3]、mcq.optionGlossZh（供 TASK-12 四選一），day3 前完成；舊檔不重產、列 MISSING_FIELD。

2026-10-02 day3（a5d15e8）：合格 6/16；v3 越級 0、錯誤 0.7/檔；Qwen 429 92%、Gemma 判題幾乎全擋、apodex 23/23；全量估 52–160 天。G5 抽審頁發佈：https://claude.ai/artifact/2LrFHGNiQtzJ6RCaiKobmN（db g5-review/decisions）。派管線隔離驗收；同日剩餘額度補跑 day3b。

2026-10-02 管線隔離驗收 FAIL 一條：distractorsZh 恰 3 個的測試為空斷言（.every 對空陣列恆真，突變存活）；另 --max-attempts 無硬上限、perMinute 常數未釘。其餘 :free／花費中止／429／先落檔／備援／重產授權／金鑰皆有程式位置與突變紅證；金鑰掃描僅測試假值；帳本數字重算吻合。已排修。

2026-10-02 day3b（f6b2984）：合格 9/16、最終退件 4、可重產 3；v3 越級 3 筆、主要問題轉為簡體字混入（18 筆）；全量估 52–150 天。驗收 FAIL 4 項已修（空斷言、max-attempts 硬上限 3、perMinute 釘住、累計標示）＋ schema attempt 1–3 bug 修正並本機重判。事件：突變測試以假金鑰打 /key 一次（401、$0），已加測試環境禁真網路守衛。放行 gloss-backfill（約 12 次）與 3 課最後重產。

2026-10-02 OpenRouter pilot 結案（3838d97）：合格 9／退件 7、$0；補欄 5 課；網路守衛、額度估算修正。**創辦人 G5 裁示（對話原話）**：題庫統一由開發端在開發時一次產好、照課綱脈絡與英文分級逐題產、量大沒關係；免費 LLM 只用在使用者當下需要處（批改）。→ 改由 Claude worker 撰寫題目＋檢查器＋新 context Claude 審題員取代第二家族判題；OpenRouter 產題程式保留作紀錄、舊產出存檔對照。重做 pilot 16 課後再送抽審，通過後全量（TASK-9）。

2026-10-02 Claude 撰寫 pilot（415268a→f71a796）：16 課 274 題、檢查器全綠、0 次 OpenRouter；每課約 1.5 分鐘；OpenRouter 產出封存 archive-openrouter/；檢查器支援 judgedBy: claude-reviewer（GLOSS_SYNONYM、REVIEW_ISSUE）。派獨立審題員。

2026-10-02 獨立審題（claude-reviewer）：80 題選擇類全單一正解且與答案一致、136 單字卡無同義干擾項、全台灣用語；13 條 REVIEW_ISSUE（7 課；B1 範文連接詞邏輯、A1 can not 分寫等）→ 撰寫者修、改到的課清 judge 後新審題員複審。

2026-10-02 第二輪審題（e9929be）7 issue → 修正 3207f9a，並依通則自查另修 9 處（評分要點放寬 8、b1-l03 Moreover 承接）；改到 12 課清 judge，派最後一輪複審。

2026-10-02 pilot 結案（f453e35→16917c4）：第三輪 6 條修正移 resolvedAfterFinalReview（標『最終審後修正、未再複審』）、--require-judge 16 課全綠、content 127；撰寫準則 content/prompts/claude-dev.authoring-guide.md；全量估：撰寫約 25 小時、端到端約 130 小時、建議約 20 批。G5 抽審頁重發佈（v2）：https://claude.ai/artifact/2LrFHGNiQtzJ6RCaiKobmN（db g5-review/decisions，version claude-dev-pilot）。停 In Review 等 G5；隔離驗收於 G5 後與 merge 一併做。
2026-10-02 結案（11ec9d7）：G5 由創辦人授權執行長代審。AC#2 16 課 274 題 check-items --require-judge 全綠，Claude 撰寫版 $0（OpenRouter 0 呼叫；token 未量測＝訂閱制無逐次計費）。AC#3 原意（三模型比較＋金額）被 G5 新方向取代：免費模型實測與付費定價估算留附錄，正文改 Claude 撰寫時程（三關合計約 18 分／課、全量上限約 300 小時、分約 20 批）。AC#4 原意（預算核准）被取代：花費 $0；抽審頁已交付，三關（檢查器、獨立審題員三輪、第③關課綱符合度審查）紀錄於 pilot-status.md。代決：詞性級距看詞義不看詞性（kind/aboard/cough 改、call/stand/one/help/home 保留）；正解位置題庫端重排＋檢查器三層規則；TSL 377 字無級距不排課。隔離驗收 PASS，P1/P2 已於 599a35b 補正。
<!-- SECTION:NOTES:END -->
