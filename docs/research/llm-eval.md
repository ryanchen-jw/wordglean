# 寫作批改預設模型評測（TASK-15 AC#4）

> 狀態：**已選定（2026-10-04）**——預設 `qwen/qwen3.8-27b:free`、fallback `apodex/apodex-1.1-mini:free`，見 §8。真打 2026-10-02 執行長放行，10-02～10-04 分日接續；Gemma 兩款連續兩天上游全數 429、無法完成，依創辦人 10-03 裁示③A 的授權「只在可完成評測的模型間比較」排除。結果見 §7。

## 1. 規則（執行長 2026-10-02 代決）

| 項目 | 規則 |
|---|---|
| 花費 | 創辦人裁示「不儲值、只用免費模型」→ **只打 `:free` 模型、花費必須 US$0**。腳本硬守衛：模型 id 不以 `:free` 結尾就拒絕（`openrouter/free` 隨機路由也擋） |
| 候選 | 4 個，從 `docs/research/free-models.md` §1 的免費模型選；**排除 NVIDIA**（免費端點適用 API Trial Terms，限內部評估、不得用於 production）；優先選不拿 prompt 訓練的提供商 |
| 選定（D3） | 預設＝**不訓練**的免費模型中正確率最高者；次高者為 fallback。原卡「正確率最高且單次 < US$0.002」在免費制下不適用——**偏差，依 D3 取代** |
| 評分（D4） | 修正正確性自動比對（§3）；繁中解釋品質由 worker 逐句評、執行長抽審 |
| 呼叫方式 | 與 App 同一份 prompt（`grade-writing.v1`，`app/src/llm/gradePrompt.ts`）、同一個解析器（`parseGrade.ts`）、同樣帶 `provider.data_collection: "deny"`；**每次只送單一模型、不帶 fallback**（否則不知道是哪個模型答的）；**不自動重試** |
| 額度 | 開跑前與每 10 次查 `GET /api/v1/key` 的今日剩餘次數，**剩 ≤2 收工**；隔天同一條指令接續（帳本自動略過已完成的 模型×題）。429：每日額度用完（`free-models-per-day`）→ 整批停；上游滿載／每分鐘上限 → 記 `rate_limited`、該題排到隊尾稍後再送（**排隊，不算重試**），連續 5 次 429 就停 |

## 2. 候選模型（2026-10-02 執行長確認）

| 模型 | 提供商 | 拿 prompt 訓練 | 理由 |
|---|---|---|---|
| `google/gemma-4-31b-it:free` | Google AI Studio | 不訓練（保留 55 天） | 多語言能力強（模型卡 MMMLU 88.4%）；支援 JSON 模式（`response_format`） |
| `qwen/qwen3.8-27b:free` | ModelRun | 不訓練、不保留（ZDR 清單） | TASK-8 實測繁中用語合乎台灣習慣；支援 structured outputs |
| `google/gemma-4-26b-a4b-it:free` | Google AI Studio | 不訓練（保留 55 天） | 同家族較小的 MoE，看速度與正確率的取捨 |
| `apodex/apodex-1.1-mini:free` | Novita | 不訓練、零保留（ZDR；TASK-8 查證 Novita 條款） | 支援 structured outputs＋JSON 模式；主打研究預測，語法批改能力未知。Novita 條款 §3 限制酒類用途——題組已查無酒類情境 |

排除：`dots-studio/dots-3-note-preview:free`（執行長裁示：提供商 AtlasCloud 條款讀不到全文）；NVIDIA 全系列（D1）；`thinkingmachines/inkling*`（會訓練，且免費版一般 API 回 403）；`liquid/lfm-2.5-2.6b`、`stealth/*`（會訓練）；coding／醫療專用模型；`openrouter/free`（隨機）。

## 3. 題組與評分

- 題組：`content/eval/llm-eval-set.json`（`llm-eval-set.v1`）——40 句台灣學習者常見錯句，中翻英 30、造句 10，級距 A1–B2。涵蓋：冠詞、主詞動詞一致、There has（「有」直譯）、very 修飾動詞、時態（過去式、現在完成式）、間接問句語序、although＋but、because＋so、介系詞、不可數名詞加 s、look forward to＋動名詞、discuss about、boring／bored、more better、suggest／make／explain 句型、open the light、被動誤用、am agree、spend、marry with、people is、can＋able to、enjoy to、used to＋-ing、unless＋否定。
- 每句附 `mustFix`：批改句**不得再含**錯誤寫法、且**須含**任一正確寫法（不分大小寫）。題組自我檢查（`validateSet`）確保錯句真的含錯誤、參考答案不含錯誤且含正確寫法。
- 一題算「正確」＝模型判為有錯（`isCorrect=false`）**且**每個必修錯誤點都修對。解析失敗、呼叫失敗都算錯；`rate_limited` 不計（補跑）。
- 繁中解釋品質（D4）：腳本產出評審表（每模型每題：學習者句子、批改句、是否修對、繁中解釋），worker 逐句給 0–2 分（0＝錯誤或誤導／簡體或大陸用語；1＝正確但不清楚；2＝正確、清楚、台灣用語），執行長抽審。

## 4. 乾跑（mock，不連網）

2026-10-02 以假端點跑完 4 模型 × 40 題，模擬每日 50 次、剩 2 次收工，分 4 輪接續（48＋48＋48＋20 次，含每輪 1 次模擬上游 429 後排到隊尾再送）。假端點回參考答案；每 7 次回一次非 JSON（測解析失敗）、每 11 次回一次 ```json 圍欄（測容錯）。

| 模型 | 完成／總數 | 正確率 | 解析成功 | 花費（US$） |
|---|---|---|---|---|
| `google/gemma-4-31b-it:free` | 40／40 | 35（87.5%） | 35 | 0 |
| `qwen/qwen3.8-27b:free` | 40／40 | 35（87.5%） | 35 | 0 |
| `google/gemma-4-26b-a4b-it:free` | 40／40 | 35（87.5%） | 35 | 0 |
| `apodex/apodex-1.1-mini:free` | 40／40 | 35（87.5%） | 35 | 0 |

**這些數字只驗證腳本流程，不代表模型表現**（未達 100% 是假端點刻意插入的非 JSON）。驗到的事：分日接續與剩 2 收工、429 排隊後補完、帳本略過已完成、解析失敗計錯、圍欄 JSON 救回、評審表產出、帳本不含金鑰。帳本與評審表：`docs/pending/2026-10-02-task15-openrouter/dry-run/`。

## 5. 暫定預設（評測前；已由 §8 取代）

`google/gemma-4-31b-it:free`，fallback `qwen/qwen3.8-27b:free`（`app/src/llm/models.ts`；兩者提供商都不訓練）。App 每次批改帶 `models: [使用者選的, ...預設鏈]` 與 `provider.data_collection: "deny"`；啟動時若已連結，用公開 models API 檢查選定模型還在，下架就換回預設鏈中第一個還在的。

## 6. 真打步驟（等執行長放行）

```bash
cd content
# 1. 確認 4 個候選 id 都還在、單價仍為 0（公開 models API，不需金鑰）
# 2. 真打（金鑰只讀進記憶體；每天跑到額度用完或遇 429 為止，隔天同一條指令接續）
node scripts/llm-eval.mjs --real --env ../.env --models google/gemma-4-31b-it:free,qwen/qwen3.8-27b:free,google/gemma-4-26b-a4b-it:free,apodex/apodex-1.1-mini:free
# 3. 彙總與評審表（不連網）
node scripts/llm-eval.mjs --report --models <同上>
```

需要 160 次請求；每日 50 次、每天留 2 次 → **至少 4 天**。帳本：`content/eval/results/ledger.jsonl`（不含金鑰）。

## 7. 進度與結果

### 第 1 天（2026-10-02 台北 12:03–12:05）

- 開跑時開發方帳號今日免費額度只剩 **8 次**（剩 ≤2 收工 → 可用 6 次）。送出 6 次：apodex 1 次成功；Gemma 31B、Qwen、Gemma 26B 共 5 次被**上游 429**（`Provider returned error`），依規則排到隊尾，用完 6 次即收工。花費 US$0，帳本不含金鑰。
- 同日稍後，main 的硬寫字串守衛（TASK-4）不允許程式碼裡有中文字，批改 prompt 裡的「台灣繁體中文用語」改以英文表達，**prompt 升為 `grade-writing.v2`**。腳本只採計目前版本的紀錄：第 1 天那 1 筆成功屬 v1，保留在帳本當歷史、**不計分**，明天以 v2 重跑。→ 有效進度 **0／160**。
- 觀察：免費模型上游 429 很頻繁（5／6），與 TASK-8 實測一致（free-models.md §6）。每天實際可完成的題數可能遠低於 48，160 次全部跑完可能要超過 4 天。

### 第 2～3 天（2026-10-03、10-04）與結果

帳本：`content/eval/results/ledger.jsonl`；彙總與評審表：`content/eval/results/ledger.summary.md`。只計 `grade-writing.v2` 的真打紀錄。

| 模型 | 完成／總數 | 正確率（判錯且修對） | 解析成功 | 上游 429（排隊，不計） | 延遲中位數 | 花費（US$） |
|---|---|---|---|---|---|---|
| `qwen/qwen3.8-27b:free` | 40／40 | **40（100%）** | 40 | 3 | 3.3 秒 | 0 |
| `apodex/apodex-1.1-mini:free` | 40／40 | 2（5%） | 2 | 0 | 9.7 秒 | 0 |
| `google/gemma-4-31b-it:free` | **0／40** | — | — | 26 | — | 0 |
| `google/gemma-4-26b-a4b-it:free` | **0／40** | — | — | 24 | — | 0 |

- **比較基準：只在完成 40 題的模型間比較**（qwen、apodex）。
- **Gemma 兩款排除的理由**：10-03、10-04 連續兩天，每一次請求都被上游回 429（`Provider returned error`，Google AI Studio 免費端點滿載），一題都沒完成，無從計算正確率。依創辦人 10-03 裁示③A 的授權，不再等待、不納入比較。這也說明它們當 App 預設不可靠：使用者實際批改時同樣會一直遇到 429。
- **apodex 的失敗型態**：38／40 為 `parse_failed`（HTTP 200，但回應不是解析器能讀的批改 JSON），不是呼叫失敗或限速；成功的 2 題（ev-10、ev-33）修正與解釋都正確。
- 花費：4 個模型都是 `:free`，帳本花費合計 **US$0**。

### 繁中解釋品質（D4，qwen 40 句逐句評）

評分規則見 §3（0＝錯誤或誤導／簡體或大陸用語；1＝正確但不清楚；2＝正確、清楚、台灣用語）。評的是批改結果裡的整體解釋＋各錯誤點解釋。

**評語**：40 句的文法說明本身幾乎都正確、切中錯誤點，常順帶給出替代說法（如 although／even though、won't be able to）與台灣學習者的中文直譯來源（「因為……所以……」「花錢買」），教學價值高。問題集中在**用字**：零星混入簡體字、大陸用語（介詞、賓語），1 句整段英文、1 句事實錯誤。平均 **1.38 分**（2 分 26 句、1 分 3 句、0 分 11 句）。

問題句（共 **14 句**；0 分 11 句、1 分 3 句）：

| 題 | 分 | 問題 |
|---|---|---|
| ev-10 | 0 | 混入簡體「标记」（不定式标记） |
| ev-15 | 0 | 混入簡體「结构」 |
| ev-34 | 0 | 混入簡體「那样」；「（作為補充語）」用詞不清 |
| ev-39 | 0 | 混入簡體「习惯」 |
| ev-35 | 0 | 第二段解釋整段是英文 |
| ev-31 | 0 | 事實錯誤：說「pen」以「母音字母 p（子音）」開頭，自相矛盾、會誤導 |
| ev-08 | 0 | 大陸用語「介詞」（台灣：介系詞） |
| ev-11 | 0 | 大陸用語「介詞」 |
| ev-38 | 0 | 大陸用語「介詞」 |
| ev-33 | 0 | 大陸用語「賓語」（台灣：受詞） |
| ev-24 | 0 | 大陸用語「雙賓語」；「受事者＋聽者」用詞生硬且順序說反 |
| ev-20 | 1 | 「spend 金錢（in）動名詞」括號裡的 in 讓人困惑 |
| ev-26 | 1 | 「永遠以單形出現」用詞不自然 |
| ev-09 | 1 | 兩個錯誤點說明重複；「或 much」在肯定句不自然 |

（解釋品質不改變選定：D3 以正確率選，且 apodex 只有 2 句可評。可能的改善方向——如在 prompt 加強「台灣用語、不得用簡體」、或 App 端偵測簡體字——列為觀察，不在本卡處理。）

## 8. 選定（2026-10-04，執行長依 D3 代決；創辦人 10-03 裁示③A 授權）

| 角色 | 模型 | 依據 |
|---|---|---|
| 預設 | `qwen/qwen3.8-27b:free`（Qwen3.8 27B） | 完成評測的模型中正確率最高（40／40）；提供商 ModelRun 不訓練、不保留（ZDR，`free-models.md`） |
| fallback | `apodex/apodex-1.1-mini:free`（Apodex 1.1 Mini） | 完成評測的模型中正確率次高（2／40）；提供商 Novita 不訓練、零保留（ZDR） |

已回寫 `app/src/llm/models.ts` 的 `DEFAULT_MODELS`；README、隱私說明（repo 與 App 內）同步寫明預設模型。

**fallback 風險（觀察，不改動選定）**：apodex 正確率只有 5%，失敗以解析失敗為主（38／40）。OpenRouter 只在前一個模型呼叫失敗（如 qwen 被上游 429）時才改用 fallback，而那時 apodex 多半回出解析不了的內容 → App 走既有的失敗處理（批改失敗提示、使用者可對照參考答案自己判斷），不會顯示錯誤的批改。也就是說，fallback 實際上只多一點點救回機會，主要可靠性仍取決於 qwen 的上游可用度（本次評測 qwen 43 次請求中 3 次 429）。若之後 Gemma 端點恢復可用，可補跑評測重新比較 fallback。
