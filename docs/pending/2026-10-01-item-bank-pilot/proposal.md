# TASK-8 題庫產生管線＋pilot 兩單元——proposal

> 2026-10-01 Round 1 計畫經執行長核准（6 題決策全照建議）。本檔＝SDD 簽核版；實作偏離時回改本檔並在回報說明。

## 範圍

- 做：題目 JSON schema、產題／判題 prompt（版本化）、自動檢查器、產題 CLI（乾跑＋真打）、成本估算、pilot（A1-u01 10 課＋B1-u01 6 課）、3 模型比較、抽審圈選頁。
- 不做：全量產生（TASK-9）、聽力音檔預產（TASK-1 建議，需另裁示）。

## 已拍板決策

| # | 決策 |
|---|---|
| 1 | 每課題量：單字卡＝該課每字一張（例句＋繁中）；聽打 1、聽選 1、跟讀 2、選擇題 2、閱讀 1 篇（2 題）、中翻英 1、造句 1 |
| 2 | 產題候選：`anthropic/claude-sonnet-5.5`、`google/gemini-3.8-flash`、`openai/gpt-6-luna`；判題＝與勝出模型不同家族的便宜模型；不列 deepseek |
| 3 | 簡體偵測兩層：手選簡體字表＋大陸用語表；第二層 opencc-js（MIT AND Apache-2.0）`cn→twp` 轉換後須不變 |
| 4 | lexicon 無級距的字一律擋；例外走 `content/items/allowlist.json`（人審） |
| 5 | pilot 照 AC 兩單元；模型比較抽 `a1-u01-l01`＋B1 第一個多益主題單元第 1 課 |
| 6 | 本檔於 Stage 0 落檔 |

## 檔案配置

| 路徑 | 內容 |
|---|---|
| `content/schema/lesson-items.schema.json` | 一課一檔的題目 schema |
| `content/items/<level>/<lessonId>.json` | 題目（產生，抽審後才可手改） |
| `content/items/allowlist.json` | 無級距字例外（人審） |
| `content/items/_runs/<runId>.json` | 每次產題的花費帳本（模型、token、金額、失敗） |
| `content/prompts/gen-lesson.v1.md`、`judge-mcq.v1.md` | 版本化 prompt；改內容＝新檔 v2，不覆寫 |
| `content/pricing/openrouter-<日期>.json` | 定價快照（含查詢網址與日期） |
| `content/scripts/lib/check-items.mjs` | 檢查器 |
| `content/scripts/lib/{zh-guard,english,item-rules}.mjs` | 繁中守衛、英文分詞與級距查找、題量與長度規則 |
| `content/scripts/lib/{openrouter,generate,fake-llm,prompts}.mjs` | API 用戶端、產題流程、乾跑假模型、prompt 組裝 |
| `content/scripts/gen-items.mjs`、`check-items.mjs`、`estimate-cost.mjs`、`fetch-prices.mjs` | CLI |

## 題目 schema（一課一檔）

頂層：`schemaVersion`(1)、`lessonId`、`level`、`promptVersion`、`model`、`properNouns`（產題端宣告的專有名詞，大小寫敏感）、`items`、`judge`（選填：`{model, promptVersion, verdicts: {<題號>: [正確選項索引…]}}`）。

題型（`type`）與欄位：

| type | 欄位 |
|---|---|
| `wordCard` | `word`、`exampleEn`、`exampleZh` |
| `listenType` | `sentenceEn`、`sentenceZh` |
| `listenChoice` | `audioEn`、`audioZh`、`questionZh`、`options`（英）、`answer` |
| `shadowing` | `sentenceEn`、`sentenceZh` |
| `mcq` | `stemEn`（含一個 `____`）、`stemZh`（完整句翻譯）、`options`（英，4 個）、`answer` |
| `reading` | `passageEn`、`passageZh`、`questions[]`：`{questionZh, options（中）, answer}` |
| `translate` | `promptZh`、`hintWords`、`referenceEn[]`、`rubricZh[]` |
| `makeSentence` | `targetWord`、`instructionZh`、`referenceEn[]`、`rubricZh[]` |

每題有 `id`（`<lessonId>-q<兩位數>`）。選擇題類＝`listenChoice`、`mcq`、`reading` 的每一小題；判題鍵：`<id>`，閱讀小題 `<id>#<小題索引>`。

## 檢查器（seam：`checkLessonItems(doc, ctx)` → 錯誤陣列 `{code, path, message}`）

`ctx`＝`{ lesson: {id, level, words}, levels: Map<小寫headword, CEFR>, lemmas(word)→原形[], allowlist: Set, requireJudge: bool }`。

| 代碼 | 規則 |
|---|---|
| `SCHEMA` | 不符 JSON Schema |
| `LESSON_MISMATCH` | lessonId／level 與課綱不符；題號重複或格式錯 |
| `COMPOSITION` | 題量不符決策 1；單字卡的字≠該課新字（一字一張） |
| `OVER_LEVEL` | 英文用字級距高於該課級距（多字詞先整段比對；其餘以 lexicon 小寫 headword 最低級，查不到再經 ECDICT 詞形對照取原形） |
| `UNLEVELED` | 英文字在 lexicon 無級距，且非宣告專有名詞（須大寫開頭、小寫不在 lexicon 有級距字中）、非白名單 |
| `SIMPLIFIED` | 繁中欄含手選簡體字（字表抄自 `data/tests/test_traditional.py`） |
| `MAINLAND_TERM` | 繁中欄含大陸用語表詞（如 視頻、軟件、信息） |
| `ZH_NOT_TW` | 繁中欄經 opencc `cn→twp` 轉換後改變（台／臺 視為相同） |
| `ZH_MISSING` | 繁中欄沒有任何中文字 |
| `LENGTH` | 英文句字數、短文字數超出該級範圍（`item-rules.mjs`） |
| `MCQ_OPTIONS` | 選項重複（不分大小寫）、答案索引越界、`mcq` 題幹沒有恰好一個 `____` |
| `MCQ_AMBIGUOUS` | 判題模型認為正確的選項不只一個 |
| `MCQ_WRONG_KEY` | 判題模型只選一個但≠答案，或一個都沒選 |
| `MCQ_UNJUDGED` | `requireJudge` 時缺判題結果 |
| `ANSWER_POSITION` | 單課所有選擇類題位（mcq＋聽選＋閱讀小題）合計，≥4 個正解在同一位置（第③關加） |
| `ANSWER_POSITION_UNIT` | 同一單元跨課合計，同題型 ≥6 題時，某位置的正解超過 50%（第③關加；CLI 全量檢查時才判） |
| `ANSWER_POSITION_LEVEL` | 同一級跨課合計，同題型 ≥6 題時，某位置的正解超過 50%（第③關加；CLI 全量檢查時才判） |
| `ANSWER_POSITION_PATTERN` | 同一級內，課內 mcq 第 2 題對第 1 題、閱讀第 2 小題對第 1 小題的正解位置差（mod 選項數）有固定規律：課數 ≥8 時，某個差值占比超過 60%，或某個差值從未出現但均勻時應出現 ≥5 次（TASK-9 執行長裁示 G1 加；CLI 全量檢查時才判） |

縮寫：`n't`→not、`'m`→am、`'re`→are、`'ll`→will、`'ve`→have（`can't`→can、`won't`→will）；`'s`、`'d` 不檢。數字不檢。

## 產題流程（seam：`runGeneration(opts)`、CLI `gen-items.mjs`）

1. 真打前置：金鑰取自環境變數或 repo 根 `.env` 的 `OPENROUTER_API_KEY`；缺 → exit 2 並印明確訊息（不靜默跳過）。必須帶 `--budget <USD>`；判題模型與產題模型同家族 → 拒跑。
2. 開跑前以定價快照估算本次金額，超過 budget → 拒跑。
3. 逐課：產題呼叫 → 解析 JSON（失敗記錄、不重跑）→ 判題呼叫（每課一次、題目不附答案，要模型列出所有正確選項）→ 檢查器 → 寫檔。已有輸出檔的課跳過。
4. 每次呼叫記帳：`usage.prompt_tokens`、`completion_tokens`、`cost`（OpenRouter 文件：usage 自動附在每個回應）；缺 cost 時以快照價自算並標示。
5. 每次呼叫前檢查「已花＋下一次預估 > budget」→ 停止；HTTP 錯誤 → 記錄並停止整批。**不做任何自動重試。**
6. `--fixture`：改用 `fake-llm.mjs` 決定性假模型（不碰網路、不需金鑰），走同一條解析、判題、檢查、寫檔、記帳路徑。

## 成本估算方法

- 輸入 token：對計畫中每一課實際組出 prompt，以「ASCII 字元／4＋非 ASCII 字元×1」估算。
- 輸出 token：以兩份手寫的真實樣本課（`a1-u01-l01`、`b1-u01-l01`）同法估算，A1–A2 用前者、B1–C1 用後者。
- 金額＝token × 定價快照；全量另列判題與重產緩衝。實際 pilot 跑完後以帳本實數校正。

## 實作偏離（Stage 1–3）

- 不送 `temperature`（gpt-6-luna 不支援）；改送 `reasoning.effort=low`——三個候選皆為推理模型、推理 token 按輸出計價。`max_tokens`：產題 12,000、判題 2,000，同時是預算檢查的最壞情況。
- opencc twp 會把台灣通行詞改寫（連接→連線、支持→支援、干擾→幹擾 等），比較前先移除 `TWP_ACCEPTED` 列表詞，台／臺視為相同。
- 題號由管線依模型輸出順序編，不要求模型輸出 id。
- 失敗的課寫 `<out>/_rejected/`（解析失敗留 `.raw.txt`），已有正式輸出檔的課跳過。
- 另增 `scripts/lib/pricing.mjs`（token 估算、計價）、`scripts/fetch-prices.mjs`（定價快照）。

## 實作偏離（Stage 4a，2026-10-02 創辦人裁示「不儲值、只用免費模型」＋執行長代決）

依據：`docs/research/free-models.md`（零儲值每日 50 次、每分鐘 20 次、上游 429 常見）。

1. **只准 `:free`**：`openrouter.mjs` 的 `assertFreeModel` 在每次呼叫前檢查模型 id 以 `:free` 結尾（`openrouter/free` 也擋）；CLI 前置同樣檢查、exit 2。OpenRouter 回報 `usage.cost` 非 0 → 記帳後中止整批（`paid`）。`--budget` 美元把關保留，免費模型設 0（快照單價 0、最壞金額 0）。
2. **模型**：產題主力 `qwen/qwen3.8-27b:free`（推理 low）；判題 `google/gemma-4-31b-it:free`（不送 reasoning，預設不推理）；模型比較改為 Qwen 對 Gemma（各 2 課：a1-u01-l01、b1-u14-l01），判題取對方。Nemotron 不用（見下節條款結論）；Inkling 403 已排除。
3. **429＝排隊延後，不算重試**：平台或上游 429（含 200＋error.code 429）→ 該課（或該課判題）放佇列尾、至少 60 秒後再輪；同一課延後超過 5 次列 `deferred_today`。每分鐘 ≤ 20 次（滑動視窗）。每日額度：啟動與每 10 次模型呼叫查 `GET /api/v1/key` 的 `free_model_daily_requests.remaining`，其間每次呼叫本地扣 1；剩 ≤ 2 即收工（`quota`），帳本列 `remaining` 未處理的課，同一指令下次再下即續（已完成跳過、`_pending/` 只補判題）。
4. **產題先落檔**：產題成功先寫 `_pending/<lessonId>.json` 再送判題；判題 429 只補判題；判題回應解析失敗列 `judge_failed`、題目留在 `_pending/`，下次手動執行只補判題，不重產。
5. 非 429 錯誤照原規則：HTTP 其他錯誤停止整批；產題解析失敗、檢查失敗進 `_rejected/`；皆不自動重跑。
6. 金鑰只讀進記憶體；帳本與 log 不含金鑰（測試以假金鑰字串比對）。帳本另記 `provider`、`servedModel`、`reasoningTokens`、429 的限流 header 與提供商。
7. CLI 結束碼：0 全部完成；1 有課解析／判題／檢查失敗；2 前置拒跑；3 錯誤、預算或花費非 0 而停止；4 額度收工或有課今日未完成（可續）。
8. `fetch-prices.mjs` 預設檔名改用台北日期（UTC 日期曾覆蓋前一天的快照，已以 git 還原）。新快照 `content/pricing/openrouter-2026-10-02.json`（兩個 `:free` 模型單價皆 0）。

9. （Stage 4b）真實產出撞到的檢查器誤擋，先寫紅測試再修：級距改取「本身與詞形原形的最低級」（found＝find 過去式 A1，不是動詞「創立」B2）；分詞改認所有字母並以去重音寫法查級距（café→cafe）；`TWP_ACCEPTED` 加「菜單」「對象」（opencc twp 誤轉為選單、物件）。AC#1 三案突變重跑仍轉紅。

10. （day1 收工後，執行長裁示 C＋B 準備）**判題備援**：`--judge-fallback <id>:free`；主判題連續 429 達 6 次（`LIMITS.judgeFallbackAfter`）→ 本次執行剩下的課改用備援判題，產題不重做；主判題成功即歸零；切換那一次不計入該課延後次數。備援同受 `:free` 守衛、不得與產題同家族（CLI exit 2）。帳本記 `judgeSwitches`；題目檔 `judge.model` 記實際判題的模型。備援候選依條款結論：`apodex/apodex-1.1-mini:free`（dots 排除）。
11. **prompt v2**（`content/prompts/gen-lesson.v2.md`，v1 不改）：針對 day1 實際問題——閱讀題選項必須繁中、禁簡體與大陸用語（外賣→外帶、牠、服務生）、明列可用級距（`allowedLevels`，例 B1＝A1, A2, B1）與自我檢查、英文欄位「總字數」上限、評分要點不得寫產題規則、新字照清單拼法。CLI `--gen-prompt gen-lesson.v2` 指定新產題版本。
12. **退件不再產題（修正既有漏洞）**：先前已進 `_rejected/` 的課在下次執行會被當成未產而重產（等於自動重跑），改為一律跳過（狀態 `rejected`）。唯一例外是**重產授權**（執行長 2026-10-02 代決）：`--regen-rejected` 時，「判題後檢查失敗（退件檔有 judge）、attempt≠2」的課以 `gen-lesson.v2` 重產一次，題目檔 `attempt: 2`、帳本每次呼叫記 `attempt`／`prompt`；v1 退件檔改名 `_rejected/<id>.v1.json` 保留供抽審頁並列；v2 仍失敗 → 退件（attempt 2），不再重產。解析失敗（`.raw.txt`）不在授權內。schema 新增選填 `attempt`（1／2）。
13. **美式拼法**：ECDICT 詞形表與 lexicon 都查不到時，才以規則還原（-ed／-ing／-s／-es／-ied／-ies，含不重複子音的美式拼法 traveled→travel、canceled→cancel），候選原形必須是 lexicon 有級距的字；查到的級距照常判越級。

14. （day3 準備，執行長 2026-10-02 裁示）**越級分析與檢查器修正**：見 `overlevel-analysis.md`（32 筆命中：真越級 75%、假陽性 2 筆、lexicon 缺級距 1 筆、其他規則違反 5 筆）。修正：片語級距＝min（片語級距, 組成字最高級）；序數 -th／-ieth 規則還原；英文欄位含中文改報 `NOT_ENGLISH`。
15. **prompt v3**（`gen-lesson.v3.md`，v1／v2 不動）：user 訊息附「本課可用字表」＝lexicon 級距 ≤ 本課級距的所有小寫 headword（全表不截斷）；輸入增量 A1 課 +2,020 token（1,063 字）、B1 課 +9,798 token（4,443 字）、C1 約 +18,000 token（7,773 字）；候選模型上下文 262k、免費制不影響花費。
16. **重產授權擴大**：產題解析失敗的課也可重產；已最終退件的課可用 v3 再產一次；每課累計產題最多 3 次（`--max-attempts 3`，預設 2）。累計次數從本輸出目錄所有帳本中該課「產題呼叫成功」次數計算；重產 prompt 由 `--regen-prompt` 指定（預設 gen-lesson.v2）。前一次的退件檔改名 `_rejected/<id>.a<N>.json`／`.a<N>.raw.txt` 保留（舊的 `.v1.json` 命名一併改為 `.a1.json`，避免被誤讀成 gen-lesson.v1）。
17. 判題輸出上限 12,000（執行長同意）；產題 16,000。
18. **TASK-12 欄位擴充**（執行長追加，day3 真打前）：wordCard 加 `glossZh`（本課語境的簡短繁中釋義）、`distractorsZh`（恰 3 個繁中干擾釋義）；mcq 加選填 `optionGlossZh`（與 options 等長）。schema 層為選填（舊檔仍合法）；檢查器：v3 起（含手寫樣本）缺欄 → `MISSING_FIELD` 阻擋；v1／v2 舊檔缺欄 → `MISSING_FIELD` 提示（`notice: true`，不阻擋，`blockingErrors()` 排除）。釋義長度上限 20 字元；新欄位都跑繁中守衛；干擾項與正解相同或彼此重複（去空白與標點後比較）→ `DISTRACTOR_DUP`；optionGlossZh 數量不符 → `OPTION_GLOSS`。「不得與正解同義」無法自動判定，交抽審。prompt v3 加規則 7 與輸出格式；手寫樣本課補欄位；乾跑假模型補欄位。抽審頁單字卡列出釋義與干擾項，舊格式標「v1／v2 格式、缺四選一欄位」。

19. （day3b 後，執行長管線隔離驗收 FAIL 修正）schema `attempt` 改為 1／2／3（原只允許 1、2，第 3 次產生的 5 課被誤判 SCHEMA 退件；修正後以新增的 `scripts/recheck-rejected.mjs` 本機重判已判題的退件檔，通過者移入合格，不打 API）；`--max-attempts` 硬上限 3（>3 或非整數 exit 2）；`LIMITS.perMinute` 以測試釘住 20；干擾項數量測試補「錯誤非空」斷言與 4 個干擾項反例。

20. （執行長裁示）測試／離線網路守衛：`NODE_ENV=test`（`npm test` 以 `--env-file=test/test.env` 設定）或 `LINGUAAPP_OFFLINE=1`（`--fixture` 會設）時，未明確注入 fetch 的 OpenRouter 用戶端在送出前拒絕（`NetworkBlockedError`）。
21. gloss-backfill.v1（`scripts/backfill-gloss.mjs`、`lib/backfill.mjs`、`prompts/gloss-backfill.v1.md`、`gloss-judge.v1.md`）：只替已合格、v1／v2、缺欄的課補三個欄位；合併後跑檢查器＋完整性；判題模型（不同家族）認為任一干擾項與正解同義即不寫入；題目檔記 `glossBackfill`（schema 新增）；帳本角色 gloss／gloss-judge，不計入產題次數。
22. 本地額度估算只扣成功請求（429 不扣）；`TWP_ACCEPTED` 加「消息」（opencc 誤轉訊息）。

### NVIDIA API Trial Terms 條款結論（Nemotron 不採用）

- 網址：https://assets.ngc.nvidia.com/products/api-catalog/legal/NVIDIA%20API%20Trial%20Terms%20of%20Service.pdf （OpenRouter `api/frontend/v1/all-providers` 中 NVIDIA 的 `termsOfServiceURL`）。
- 查詢：2026-10-01T18:05Z（台北 10-02 02:05）以 curl 下載 PDF（HTTP 200、214,700 bytes、sha256 `afd5df03…8b30`），pdftotext 抽全文 9 頁逐條讀；文末版本「v. September 19, 2025」。
- 關鍵條文：
  - §1.2「NVIDIA will provide you access to the API Service for limited trial purposes only and without use of the API Service or Generated Content in production.」
  - §1.4「Unless you purchase a Subscription … you may only use the API Service for internal testing and evaluation purposes, not in production.」
  - §4.2「Except as indicated in the Section 1.2 … you may not copy, sell, rent, sublicense, transfer or distribute or make available to others any portion of the API Service or Generated Content.」
  - §6.3 雖稱 Generated Content 歸使用者所有，但受上列使用限制。§3.3 會收集 User／Generated Content 改進 NVIDIA 產品（與 OpenRouter 標示「會訓練」一致）。
- 結論：題庫要隨開源 repo 散布、在官方站供公眾使用（production），與 §1.2、§1.4、§4.2 直接牴觸 → **Nemotron 系列（Super／Ultra 等 NVIDIA 端點的 `:free`）一律不用**。改用不訓練的 Gemma 4 31B（Google AI Studio）。
- Qwen 端點提供商 ModelRun（Modular）條款：https://www.modular.com/legal/terms （2026-10-01T18:19Z 抓，HTTP 200，頁面標「Last Modified: August 17, 2026」）。Stage 4b 逐條讀定義、§3（3.1–3.10）、§8（所有權）：
  - §3.1 使用限制針對**平台本身**（不得轉售平台、做競品、逆向工程、改作平台；(viii) 公開平台 benchmark 須附足以重現的方法）——沒有限制產出的散布或商用。
  - §3.7 Third-Party Models：底層模型屬原權利人、不授權權重；§3.8「You are solely responsible … before relying on, **publishing**, or otherwise using any output」——條款預設產出可發布。
  - §8.2 使用者送入的 User Generated Content 歸使用者；**產出（output）的歸屬沒有明文**。定義中「Modular IP」含「information, data, or other content derived from Modular’s provision of the Modular Platform」，字面可能涵蓋產出，但與 §3.8 並讀，應解為平台衍生資料（Derivative Data＝聚合匿名化的使用資料）而非個別產出。**風險：歸屬條文模糊、非明文授權**。
  - 我們是經 OpenRouter 呼叫（OpenRouter 才是 Modular 的直接客戶）；模型本身 Qwen/Qwen3.8-27B 為 Apache-2.0（Hugging Face API 2026-10-01T18:25Z 查 `cardData.license`）。
  - 結論：未見禁止產出散布或商用的條文 → **Qwen 可用於產題**；歸屬模糊一點列入 G5 報告供創辦人知情。
- **備援判題候選條款（Stage 4b day1 準備，2026-10-01T19:04–19:06Z 查）**：
  - `apodex/apodex-1.1-mini:free`（提供商 Novita，OpenRouter 端點 `novita/bf16`）：讀 https://novita.ai/legal/terms-of-service 全文（頁面標「Policy date: October 12, 2024／Updated: August 5, 2026」，HTTP 200）。§10.2「By Default, Novita AI will not use your Content to train our own models…Zero Data Retention」；§10.1 對 Output 的授權僅限「for the purpose of providing the Service to you」；全文無限制產出散布或商用的條文。注意 §3：「the Marketplace Offerings may not be used in connection with … (ii) alcoholic beverages」——課綱「餐敘與外食」單元會出現 pub／beer，判題送到 Novita 的題目若涉酒類字面上可能牴觸；pilot 兩單元（功能字）不涉。模型本身無 Hugging Face 頁、授權未見；判題結果不發布，影響低。**結論：可作判題備援。**
  - `dots-studio/dots-3-note-preview:free`（提供商 AtlasCloud）：OpenRouter 的 dataPolicy 只登記隱私政策、沒有條款網址；https://www.atlascloud.ai/terms-of-service 回 200 但內容是行銷首頁（單頁應用 fallback，非條款），/terms、/terms-of-use、/legal/terms、/tos、/user-agreement 皆 404；隱私頁唯一的 Termly 連結需 JavaScript 才顯示、抓不到內文。**讀不到條款全文 → 排除。**
- 未讀：Google AI Studio（cloud.google.com/terms）條款全文。Gemma 本輪主要當判題（判題結果不發布）；若 Gemma 在比較中勝出要當產題模型，先讀條款再用。

## 測試 seam 與真值來源

- `checkLessonItems`：fixture 為手寫課（真實 lexicon 字的級距由 `data/lexicon/lexicon.json` 字面值核對），每個錯誤代碼一個注入案例；AC#1 三案：越級字（A1 課放 B1 字）、雙答案（判題回兩個索引）、簡體字。
- `runGeneration`：注入假 `fetch`／假 client，驗金鑰缺席拒跑、預算停止、不重試、記帳。
- CLI：`--fixture` 乾跑 16 課 exit 0；無金鑰真打 exit 2。

## 實作偏離（G5 新流程，2026-10-02 創辦人裁示「題庫由開發端撰寫、免費 LLM 只用於批改」）

- 產題改由開發端 Claude 逐課撰寫（`author: claude-dev`、`promptVersion: claude-dev.gen-lesson.v3`），工具 `content/scripts/author-lesson.mjs`；OpenRouter 程式碼保留但不呼叫，舊產出封存 `archive-openrouter/`。
- 判題改由獨立審題員（新 context）寫入 `judge`（`judgedBy: claude-reviewer`、`verdicts`、`glossVerdicts`、`issues`）；檢查器新增 `GLOSS_SYNONYM`、`REVIEW_ISSUE`（`--require-judge` 下阻擋）。撰寫端不寫 judge。
- 三輪審題後的最後 6 條由撰寫端修正、移入 `judge.resolvedAfterFinalReview`（原文＋修正說明＋時間），**未再複審**；schema 支援該欄位，抽審頁與 `pilot-status.md` 標示。
- 撰寫準則 `content/prompts/claude-dev.authoring-guide.md`（給 TASK-9）。成本估算改為時程估算（`cost-estimate.md`，免費模型實測移附錄）；抽審頁由 `content/scripts/build-review.mjs` 改為每課一版＋三輪審題摘要（`review-rounds.json` 由 `extract-review-rounds.mjs` 從 git 歷史抽出），AC#2 原「儲值比較」不再需要。
