# OpenRouter 免費模型調查（TASK-8 題庫產生／TASK-15 參考）

> 2026-10-02 調查（investigate-only）。所有一手資料抓取時間為 **2026-10-01T17:24–17:29Z（台北 2026-10-02 01:24–01:29）**，來源網址列在文末。
> 前提（創辦人裁示）：放開發方金鑰、**帳號零儲值**、只用免費模型。
> 標記：**未實測**＝沒有實際呼叫過；**未核**＝找不到一手來源，只是推論。

## TL;DR

- 零儲值帳號的免費模型額度是**每分鐘 20 次、每天 50 次，整個帳號共用**（多開金鑰或帳號無效）。pilot（44 次）一天塞得下但沒有餘裕；**全量 984 課約要 40–50 天**。只要曾經累計買過 US$10，每日上限就變成 1,000 次，全量約 2–3 天。
- 目前有 17 個真正可用的 `:free` 文字模型；值得試的產題候選是 Qwen3.8 27B、Nemotron 3 Super／Ultra、Gemma 4 31B。使用者放行後實測了 10 次（§6）：**Qwen 產的 A1 課通過檢查器、0 錯誤**；Ultra 產的課被判題抓出 2 題答案不唯一；Gemma 與 Qwen 都遇到**上游 429**；Inkling 免費版回 403（只開放給 agent 類應用），已排除。
- **上游 429 是最大的實務瓶頸**：送出的 9 次請求有 3 次被提供商端限流，其中 1 次讓已經產好的題目整份丟失。天數推算要再往上加，而且管線必須改。
- 現行管線要跑免費模型得改 5 處：額度預檢與分日批次、429 歸類成「延後」而不是錯誤、每個模型各自的推理強度、只准 `:free` 的護欄、帳本多記幾個欄位。「遇到 429 自動等待再送」等於重跑，需要執行長裁示。

## 1. 免費模型清單（GET https://openrouter.ai/api/v1/models，不需金鑰）

這次清單一共 464 個模型，其中 21 個的單價為 0。17:24Z 抓第一次時是 20 個，17:28Z 抓第二次已經多了 `apodex/apodex-1.1-mini:free`（2026-10-01 剛上架），可見**清單變動以分鐘計**。

欄位說明：SO＝`supported_parameters` 有 `structured_outputs`；RF＝有 `response_format`（JSON mode）；推理欄取自 `reasoning` 物件（強制／預設開／可選）。「提供商」與「訓練／保留」取自各模型的 `/endpoints` 與 `api/frontend/v1/all-providers` 的 `dataPolicy`，那是**提供商的預設政策**；官方文件說明單一端點的政策可能不同（見 §2.3）。

| id | context | 單次最大輸出 | SO | RF | 推理 | 提供商（量化） | 拿 prompt 訓練／保留 | 備註 |
|---|---|---|---|---|---|---|---|---|
| `google/gemma-4-31b-it:free` | 262,144 | 32,768 | – | ✓ | 可選（預設關） | Google AI Studio | 不訓練／保留 55 天 | 30.7B dense |
| `google/gemma-4-26b-a4b-it:free` | 262,144 | 32,768 | – | ✓ | 可選（預設關） | Google AI Studio | 不訓練／保留 55 天 | MoE、活躍 3.8B |
| `qwen/qwen3.8-27b:free` | 262,144 | 235,929 | ✓ | – | 預設開（xhigh/medium/low，預設 xhigh） | ModelRun（fp4） | 不訓練／不保留（列在 ZDR 清單） | |
| `nvidia/nemotron-3-ultra-550b-a55b:free` | 1,000,000 | 65,536 | – | – | 預設開（只有 high/medium） | NVIDIA | **會訓練**／保留 | 550B MoE、活躍 55B |
| `nvidia/nemotron-3-super-120b-a12b:free` | 262,144 | 235,929 | ✓ | ✓ | 預設開（medium/low） | NVIDIA | **會訓練**／保留 | |
| `thinkingmachines/inkling:free` | 1,048,576 | 262,144 | – | – | 預設開（max…none） | Thinking Machines（nvfp4） | **會訓練**（含 OpenRouter 側）／保留 | 適用「free research API tier」條款 |
| `thinkingmachines/inkling-small:free` | 1,048,576 | 262,144 | – | – | 預設開 | Thinking Machines（nvfp4） | **會訓練**／保留 | |
| `dots-studio/dots-3-note-preview:free` | 512,000 | 460,800 | ✓ | ✓ | 可選 | AtlasCloud（fp8） | 不訓練／保留 | preview、沒有模型卡 |
| `apodex/apodex-1.1-mini:free` | 262,144 | 235,929 | ✓ | ✓ | 可選 | Novita（bf16） | 不訓練／不保留（ZDR） | 2026-10-01 新上架，主打研究預測 |
| `inclusionai/ling-3.0-flash-sante:free` | 262,144 | 32,768 | – | – | 預設開 | Novita | 不訓練／不保留（ZDR） | 醫療專用 |
| `nvidia/nemotron-3.5-lightning:free` | 1,000,000 | 65,536 | – | – | 可選 | NVIDIA（nvfp4） | 會訓練 | 30B-A3B；端點 status −2、1 日可用率 89% |
| `nvidia/nemotron-3-nano-omni-30b-a3b-reasoning:free` | 256,000 | 65,536 | – | – | 預設開 | NVIDIA | 會訓練 | status −5、1 日可用率 76% |
| `nvidia/nemotron-3.5-content-safety:free` | 128,000 | 8,192 | – | – | 預設開 | NVIDIA | 會訓練 | 內容審查模型 |
| `poolside/laguna-s-2.1:free` | 262,144 | 32,768 | – | – | 預設開 | Poolside（fp4） | 不訓練／保留 | coding agent |
| `poolside/laguna-xs-2.1:free` | 262,144 | 32,768 | – | – | 預設開 | Poolside（fp8） | 不訓練／保留 | coding agent |
| `cohere/north-mini-code:free` | 256,000 | 64,000 | – | – | 可選 | Cohere | 不訓練／保留 30 天 | coding |
| `liquid/lfm-2.5-2.6b:free` | 65,536 | **8,192** | ✓ | ✓ | 強制 | Liquid（fp8） | 會訓練 | 2.6B |
| `stealth/space-bunny-alpha` | 1,000,000 | 524,288 | – | ✓ | 強制（預設 max） | Stealth | **會訓練**、要求 user ID | 匿名模型，**2026-10-05 到期** |
| `openrouter/free` | 200,000 | – | ✓ | ✓ | – | 路由器 | 依抽到的模型而定 | 每次隨機抽一個免費模型 |
| `google/lyria-3-pro-preview`、`google/lyria-3-clip-preview` | — | — | — | ✓ | – | — | — | 音樂生成，description 寫明按首計價（$0.08／$0.04），**不是免費** |

**全部都是推理模型或可開推理**，只有 Lyria 例外。

## 2. 使用限制與資料政策（OpenRouter 官方文件）

### 2.1 限流（docs/api_reference/limits）

| 帳號累計購買額度 | 每分鐘 | 每天 |
|---|---|---|
| < 10 credits（**零儲值屬於這一級**） | 20 | **50** |
| ≥ 10 credits（實際門檻是 9 credits，文件說保留手續費與四捨五入的空間） | 20 | 1,000 |

- 只適用 id 以 `:free` 結尾的模型。文件原文說「Making additional accounts or API keys will not affect your rate limits, as we govern capacity globally」，所以**多開金鑰或帳號沒用**。
- `GET /api/v1/key` 會回 `free_model_daily_requests {used, limit, remaining}`，可以在開跑前查剩餘額度；每分鐘的上限不會出現在這裡。計數以 **UTC 日**為單位，台北早上 08:00 重置。
- 50 次是**整個帳號共用一個計數器**還是各模型分開算：`/key` 只回一個計數器，比較像帳號共用；但文件另有一句「different rate limits for different models」。**未核**，本報告一律以帳號共用來規劃。
- 失敗的請求（429 或提供商錯誤）算不算進每日 50 次：**未核**。
- 429 有兩個來源：OpenRouter 平台限流（回應帶 `X-RateLimit-Limit/Remaining/Reset`），或上游提供商滿載（`error.metadata.provider_code`）。成功的回應**不帶**限流 header。官方建議用 exponential backoff 處理。

### 2.2 零儲值能不能呼叫

- 文件原文：「If your account has a **negative** credit balance, you may see 402 errors, including for free models.」也就是說，餘額為零（不是負數）時文件並沒有說會被擋，而且限流表本身就有「< 10 credits」這一級。**未實測**：只要一次 `GET /api/v1/key`，就能確認 `is_free_tier` 與 `free_model_daily_requests.limit` 是否等於 50。
- 「in-flight 預算」那類 402 不適用於免費模型（文件明載「It does not apply to requests to free models」）。

### 2.3 資料政策（provider-logging、data-collection、zdr、provider-selection）

- OpenRouter 本身預設**不存** prompt 與回應，記錄功能要使用者自己打開（opt-in），但會存 metadata（token 數、延遲等）。
- 每個提供商各有訓練與保留政策；帳號設定裡「允許路由到可能拿資料訓練的提供商」**付費與免費模型是分開兩個開關**。請求層可以帶 `provider.data_collection: "deny"` 或 `provider.zdr: true`。
- 文件原文：「a provider's general policy may differ from the specific policy for a given endpoint」，而且政策不明時「assume that the endpoint both retains and trains」。所以 §1 表格那一欄是提供商預設；單一免費端點的實際政策我找不到公開欄位（`/endpoints` 回應裡沒有），**未核**。ZDR 公開清單（`/api/v1/endpoints/zdr`）裡確定有 `qwen3.8-27b:free`（ModelRun）、`ling-3.0-flash-sante:free`、`apodex-1.1-mini:free`。
- 免費端點的提供商條款：NVIDIA 是「API Trial Terms」，Thinking Machines 是「free research API tier」條款與隱私聲明（PDF），Stealth 是 openrouter.ai/terms/stealth。**三份條款內文都沒讀**（未核），其中「產出能不能用於 AGPL 開源發布的題庫」是 Inkling 與 Nemotron 能不能入選的關鍵。

## 3. 時程推算（零儲值：每天 50 次、每分鐘 20 次）

每課 2 次請求（產題 1 次＋判題 1 次）。**每分鐘上限不會卡住**：依序執行時，一課產題就要輸出數千 token，遠超過 3 秒。

| 批次 | 請求數 | 零儲值（每天 50 次） | 若累計買過 US$10（每天 1,000 次） |
|---|---|---|---|
| 模型比較：3 個候選 × 2 課 | 12 | 1 天 | 同日 |
| pilot 16 課 | 32 | 1 天 | 同日 |
| 比較＋pilot 合計 | 44 | 理論上 1 天，但只剩 6 次餘裕；**建議分 2 天**（第 1 天比較、第 2 天 pilot） | 同日 |
| 全量 984 課 | 1,968 | **40 天**（39.4） | 2 天 |
| 全量＋重產緩衝 ×1.25 | 2,460 | **50 天** | 3 天 |
| TASK-15 預設模型評測（40 句 × 4 模型） | 160 | 4 天，**而且跟 TASK-8 搶同一個帳號的 50 次** | 同日 |

- 天數是理想值，前提是每天額度用滿。實測顯示失敗的請求看起來不扣額度（§6），但上游 429 在 9 次裡出現 3 次：每撞到一次，現行管線就停掉整批，當天得重新下指令。所以實際天數取決於多常有人去重開，很可能比表上的多。
- 註：US$10 是買進的額度，不會因為用免費模型而扣掉，之後還能拿來用付費模型；但這與創辦人「不儲值」的裁示相反，列入 §7 待裁示。

## 4. 推薦試用名單（全部**未實測**；理由取自模型卡與 OpenRouter 端點資料）

### 產題（3–5 個）

> 2026-10-02 實測後重排（§6）。只有 Qwen 與 Ultra 各實測 1 課，其餘標示未實測的仍未實測。

| 排序 | 模型 | 理由 | 疑慮 |
|---|---|---|---|
| 1 | `qwen/qwen3.8-27b:free` | **實測**：A1 課檢查器 0 錯誤、繁中用語符合台灣習慣、72 秒；模型卡 IFBench 79.5；支援 `structured_outputs`；端點在 ZDR 清單上（不保留） | 實測中過 1 次上游 429；簡體與大陸用語風險只看過 1 課；推理要改送 low（預設 xhigh）；fp4 量化 |
| 2 | `nvidia/nemotron-3-super-120b-a12b:free` | **實測**：B1 課產題成功（76 秒、6,476 token），但判題被 429 擋下、題目沒存到、品質未看；當判題用時表現正常（4 秒）；SO＋RF 都支援；模型卡 IFBench 72.6 | NVIDIA 會訓練 |
| 3 | `nvidia/nemotron-3-ultra-550b-a55b:free` | **實測**：A1 課合法 JSON，但有 2 題答案不唯一、1 處用語不自然；模型卡 IFBench 81.7、WMT24++ 83.7 | 171 秒最慢；NVIDIA 會訓練；推理只有 high/medium；不支援 SO/RF |
| 4 | `google/gemma-4-31b-it:free` | 模型卡：支援 140 種以上語言、MMMLU 88.4%；支援 RF；提供商不訓練 | **實測第一次就遇到上游 429**，品質未實測 |
| ✗ | `thinkingmachines/inkling:free` | — | **實測回 403**：「only available on agentic harnesses」，一般 API 呼叫用不了，**排除** |

**排除**：`liquid/lfm-2.5-2.6b`（單次最大輸出 8,192，低於管線的 12,000）、Lyria（不免費）、`stealth/space-bunny-alpha`（10-05 到期、匿名、會訓練）、`openrouter/free`（隨機抽模型，會破壞「不同家族判題」的規則，結果也無法重現）、coding 與醫療專用模型、兩個 status 異常的小型 NVIDIA 模型、`dots-3-note-preview` 和 `apodex`（沒有模型卡或剛上架，列為備選）。

### 判題（1–2 個，必須與產題模型不同家族；管線以 id 的前綴判斷家族）

| 產題用 | 判題建議 | 理由 |
|---|---|---|
| Gemma（google） | `qwen/qwen3.8-27b:free`，備選 `nvidia/nemotron-3-super-120b-a12b:free` | 判題輸出只有約 56 token，小模型就夠；Qwen 不保留資料 |
| Nemotron／Qwen／Inkling | `google/gemma-4-31b-it:free` | 不訓練、支援 RF |

## 5. 要讓 gen-items.mjs 穩定跑免費模型，需要的改動

（分支 `worktree-task-8-item-bank` 的現況：`content/scripts/lib/openrouter.mjs` 不重試，任何 HTTP 錯誤都直接拋出；`content/scripts/lib/generate.mjs` 一遇到 API 錯誤就停掉整批。）

| # | 改動 | 是否違反「失敗不自動重跑」 |
|---|---|---|
| 1 | **只准 `:free` 的護欄**：新增 `--free-only`，兩個模型 id 只要不是以 `:free` 結尾就 exit 2；禁用 `openrouter/free`。`--budget` 必須是正數的規則，在 free-only 下改成可以不帶 | 否 |
| 2 | **開跑前查額度並分日**：先打 `GET /api/v1/key` 讀 `free_model_daily_requests.remaining`，只跑前 ⌊remaining／2⌋ 課，其餘的課不動，隔天再下同一條指令。現有的「已有輸出檔就 skipped」機制本來就能接續 | 否（沒送的請求不算重跑） |
| 3 | **429 歸類成延後**：把 429 從 `api_error` 拆出來，新狀態 `rate_limited`，停掉整批並在帳本記下 `X-RateLimit-Reset`；該課不寫輸出也不放 `_rejected/`，下次執行自然會接上。另外每兩次請求之間至少間隔 3 秒，守住每分鐘 20 次 | 否（不會自動重送） |
| 4 | **產題成功但判題被 429 擋下時**，把產題結果存進 `_pending/`，下次只補判題、不重新產題（省額度） | **灰色地帶，需裁示**：產題請求本身沒有重送，但等於「接續」一課。**實測已發生**（§6 第 8–9 次）：產好的 6,476 token 題目整份丟失 |
| 5 | **每個模型各自設定推理強度**：現在固定送 `reasoning.effort: low`，但 Nemotron Ultra 只支援 high/medium，Gemma 預設不推理。改成用 config 或 CLI 逐模型設定（low、medium 或不送） | 否 |
| 6 | 帳本多記 `provider`、實際服務的 `model`、`usage.completion_tokens_details.reasoning_tokens`，以及 429 的 header | 否 |
| 7 | 定價快照：`fetch-prices.mjs` 本來就能抓 `:free` id（單價 0），每次真打前重抓一次，同時確認模型還在 | 否 |
| 8 | （選配）有支援的模型帶 `response_format: json_object` 或 structured outputs，降低解析失敗 | 否 |
| 9 | 遇到 429 自動等待後重送（官方建議 backoff） | **違反現行規則，需執行長裁示**；本報告不建議，#2＋#3 已足以不卡關 |

## 6. 實測（執行長追加授權：只限 `:free`、總數 ≤ 10 次）

**狀態：使用者放行後完成，共 10 次請求（9 次模型呼叫＋1 次 `/key`），時間 2026-10-01T17:48–17:56Z，花費 $0。**

方法：把 TASK-8 分支的 `runGeneration` 流程、`gen-lesson.v1`／`judge-mcq.v1` prompt 與檢查器原樣拿來用（解壓到 job 暫存區，不進 repo），只把呼叫端換成探針：強制只准 `:free`、請求計數、記錄限流 header。金鑰只讀進行程記憶體，沒有寫進任何輸出。產題每次上限 12,000 token。

| # | 課 | 產題模型（推理強度） | 判題模型 | 結果 | 產題耗時 | 產題輸出 token（其中推理） |
|---|---|---|---|---|---|---|
| 1 | a1-u01-l01 | gemma-4-31b-it（不送） | — | **上游 429**（Google AI Studio：「temporarily rate-limited upstream」） | 0.6 秒 | — |
| 2–3 | a1-u01-l01 | qwen3.8-27b（low） | nemotron-3-super（low） | **ok：合法 JSON、17 題、檢查器 0 錯誤** | 72 秒 | 4,226（2,957） |
| 4–5 | a1-u01-l01 | nemotron-3-ultra（medium） | qwen3.8-27b（low） | check_failed，3 個錯誤：2 題 `MCQ_AMBIGUOUS`、1 個 `UNLEVELED`（noodles） | 171 秒 | 3,937 |
| 6 | b1-u14-l01 | qwen3.8-27b（low） | — | **上游 429**（ModelRun） | 0.4 秒 | — |
| 7 | b1-u14-l01 | inkling（low） | — | **403**：「only available on agentic harnesses」 | 0.2 秒 | — |
| 8–9 | b1-u14-l01 | nemotron-3-super（low） | qwen3.8-27b | 產題 200 成功，**判題上游 429** → 依現行邏輯整批停止、**產好的題目沒有存下來** | 76 秒 | 6,476 |
| 10 | — | `GET /api/v1/key` | — | `is_free_tier: true`、`free_model_daily_requests: {used 4, limit 50, remaining 46}` | — | — |

觀察：
- **零儲值可以呼叫 `:free`**，每日上限確認是 **50**。送出 9 次、成功 5 次，計數器顯示 used 4，看起來**失敗的請求不扣額度**；第 5 次成功的請求沒算進去，可能是計數延遲（未核）。
- **上游 429 很常見**：3／9 次，Gemma 與 Qwen 都中過，而且是在 OpenRouter 50 次額度還遠沒用完的時候。錯誤訊息建議「add your own key to accumulate your rate limits」，指的是在 OpenRouter 綁定提供商自己的金鑰（BYOK），本報告未深入。
- 輸出長度：沒有任何一次被截斷（finish_reason 都是 stop）；推理 token 佔產題輸出約 70%（Qwen 2,957／4,226）。12,000 上限目前夠用，但 Super 的 B1 課已用到 6,476。
- 判題有鑑別力：Ultra 出的「____ cat sleeps on the sofa」選項有 The／A／My，判題模型正確指出不只一個答案。
- 繁中抽看（Qwen A1 課，全 17 題）：都是正體字；用語合乎台灣習慣（「搭公車去上班」）；翻譯自然，英中對齊（閱讀短文逐句對應）。Ultra 有一處不自然（「Tom 喜歡彈音樂」），另有一張單字卡例句不成句（「The cover of the book.」）。樣本只有 2 課，**不足以下品質結論**。
- 延遲：一課產題 72–171 秒，判題 4–27 秒。依序跑 50 次額度約 1–1.5 小時，速度不是瓶頸，限流才是。

## 7. 風險

| # | 風險 | 影響 | 緩解 |
|---|---|---|---|
| 1 | 免費模型隨時下架或改收費（清單 4 分鐘內就多一個；Stealth 標了 10-05 到期） | 全量 40–50 天的期間內，模型中途消失或換版的機率不低，前後題目的風格會不一致 | 每次跑前重抓清單；帳本記錄實際服務的 model；同一級距盡量用同一個模型跑完 |
| 2 | 額度：50 次／天、帳號共用 | 全量 40–50 天；TASK-15 評測會跟 TASK-8 搶額度 | §5 #2 分日；或改變儲值裁示 |
| 3 | 截斷：都是推理模型，推理 token 也算在 `max_tokens`（12k）裡 | 輸出 JSON 被截斷，判成 parse_failed，白花一次額度 | 推理設 low；帳本看 `finish_reason=length` 的比例 |
| 4 | 品質不穩與上游 429：量化版（fp4、nvfp4）、提供商滿載 | 實測 3／9 次被上游限流；品質只看過 2 課 | pilot 先比較；檢查器全量把關 |
| 5 | 資料政策：NVIDIA、Thinking Machines、Liquid、Stealth 會拿 prompt 訓練 | 題庫 prompt 只有課綱與單字表、本來就是開源，**對 TASK-8 影響低**；但條款可能限制產出的使用方式（未核） | 優先用不訓練的 Gemma、Qwen；Nemotron 入選前先讀條款（Inkling 已因 403 排除） |
| 6 | **TASK-15 的影響**：使用者自帶的金鑰若是零儲值，每天也只有 50 次免費（夠一般練習量）；使用者寫的句子可能被送到會訓練的提供商；預設模型可能哪天就下架 | 隱私與可用性 | 預設模型挑不訓練的（Gemma、Qwen）＋帶 `provider.data_collection: "deny"`；用 `models` 陣列設 fallback（docs/guides/routing/model-fallbacks）；啟動時用公開 models API 檢查預設模型還在 |

## 8. 需要裁示的問題

1. ~~（使用者本人）放行實測~~：已於 2026-10-02 放行並完成（§6）。
2. **（創辦人）全量 40–50 天能不能接受**？還是一次性儲值 US$10（不會被免費用量扣掉）換成 2–3 天？
3. **（執行長）§5 #4「判題補做」算不算重跑**？實測已證實會遇到這種情況。以及是否維持不採 #9 自動 backoff？
4. **（執行長）Nemotron、Inkling 會訓練，可以接受嗎**？若可接受，要先指派人讀 NVIDIA Trial Terms 與 TML research tier 條款，確認產出能否用於 AGPL 題庫。

## 一手來源（查詢時間皆為 2026-10-01 UTC）

- https://openrouter.ai/api/v1/models（17:24:16Z、17:28:25Z 兩次）
- https://openrouter.ai/api/v1/models/{id}/endpoints（17 個免費模型，17:25:43Z；apodex 17:28:25Z）
- https://openrouter.ai/api/frontend/v1/all-providers、https://openrouter.ai/api/v1/providers（17:27:34Z）
- https://openrouter.ai/api/v1/endpoints/zdr（17:28:10Z）
- https://openrouter.ai/docs/api_reference/limits.md、…/guides/routing/model-variants/free.md、…/guides/routing/routers/free-router.md、…/guides/privacy/provider-logging.md、…/guides/privacy/data-collection.md、…/guides/features/zdr.md、…/guides/features/structured-outputs.md（17:27:02Z）；…/guides/routing/provider-selection.md、…/guides/routing/model-fallbacks.md、…/api_reference/errors-and-debugging.md（17:27:55Z）
- Hugging Face 模型卡 README（17:29:16Z）：google/gemma-4-31B-it、google/gemma-4-26B-A4B-it、Qwen/Qwen3.8-27B、nvidia/NVIDIA-Nemotron-3-Ultra-550B-A55B-BF16、nvidia/NVIDIA-Nemotron-3-Super-120B-A12B-FP8、thinkingmachines/Inkling、thinkingmachines/Inkling-Small（網址格式 https://huggingface.co/{id}/raw/main/README.md）
- **未核**（只有網址、沒讀內文）：NVIDIA API Trial Terms PDF、TML free research API tier ToS／隱私 PDF、openrouter.ai/terms/stealth
