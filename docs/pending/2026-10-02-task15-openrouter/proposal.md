# TASK-15 寫——OpenRouter 自帶金鑰、批改與無金鑰降級＋預設模型評測｜SDD proposal

> 2026-10-02 Round 1 計畫經執行長核准（D1–D4 裁示如下）＝本 proposal 簽核。

## 執行長裁示

| # | 裁示 |
|---|---|
| D1 | 評測照 AC：40 句 × 4 模型；4 個候選從 `docs/research/free-models.md` 的免費模型選，**排除 NVIDIA**（Trial Terms 限內部評估、不得 production），優先不訓練提供商；真打等執行長放行、等 TASK-8 不用額度時分天跑 |
| D2 | 寫作題對錯：AI 批改＝無錯誤即對；自評＝照使用者按的鈕；「跳過」與「批改失敗→繼續」算錯。寫作不寫 FSRS |
| D3 | 預設模型＝**不訓練**的免費模型中正確率最高者，次高為 fallback（取代原卡「單次 < US$0.002」，免費制下不適用——**偏差，記錄於此**） |
| D4 | 評分：修正正確性以每句預寫的「必修錯誤點」自動比對；繁中解釋品質由 worker 逐句評、執行長抽審 |

## 受測公開 seam（寫死）

| seam | 位置 | 測什麼 |
|---|---|---|
| `keyStore`：`getLink(db)`／`saveLink(db, …)`／`setModel(db, …)`／`clearLink(db)` | `app/src/llm/keyStore.ts` | 貼金鑰、清除金鑰、不進匯出與同步佇列 |
| `pkce`：`createVerifier()`、`challengeFor(verifier)`、`authUrl(callback, challenge)`、`exchangeCode(code, verifier, fetch)` | `app/src/llm/pkce.ts` | RFC 7636 附錄 B 的已知向量；換金鑰請求形狀 |
| `client`：`fetchKeyInfo`、`listModels`、`requestGrade`、錯誤分類 `GradeFailure` | `app/src/llm/client.ts` | 只打 `https://openrouter.ai/api/v1/*`；401／402／429／網路分類；請求帶 `provider.data_collection:"deny"` 與 `models` fallback |
| `parseGrade(text)` | `app/src/llm/parseGrade.ts` | AC#2：5 種畸形輸出 |
| 題型登記 `WRITE_TYPES`（translate／makeSentence） | `app/src/lesson/queue.ts` | `srsWord: null`、欄位不全略過 |
| 寫作畫面四態（作答／AI 結果／無金鑰自評／批改失敗） | `app/src/screens/lesson/WritingView.tsx`（經 `LessonScreen`） | AC#3；D2 對錯 |
| 設定頁 AI 區、`/openrouter` 貼金鑰頁、`/openrouter/callback` | `app/src/screens/settings/` | AC#1 |
| e2e：全部請求攔截 | `app/e2e/openrouter.spec.ts` | 金鑰字串只出現在送往 `openrouter.ai` 的請求 |

## 設計決定

- **金鑰存放**：Dexie v4 新表 `secrets`（主鍵 `key`，本卡只用 `'openrouter'` 一筆：`apiKey`、`model`、`via: 'oauth'|'paste'`、`linkedAt`）。不列入 `LEARNING_TABLES`（不匯出）、不寫 outbox（不同步）；`clearLocalData`＝`db.delete()` 自然清掉。
- **PKCE**：S256；verifier 存 `sessionStorage`（跳轉到 openrouter.ai 再回來同分頁仍在），換完即刪；callback＝`location.origin + '/openrouter/callback'`（官方：localhost 任意埠可用，正式站需 https）。
- **批改請求**：`POST /api/v1/chat/completions`，`models: [選定模型, ...fallback]`（去重）、`provider: { data_collection: 'deny' }`、`response_format: { type: 'json_object' }`、`max_tokens` 上限、`reasoning: { effort: 'low' }`。不自動重試。
- **錯誤分類**：401／403＝`keyInvalid`；402 或 429 且訊息含 free-models-per-day＝`quota`；其他 429、5xx、無法解析＝`other`；`fetch` 拋錯＝`network`。
- **暫定預設模型**（評測前）：`google/gemma-4-31b-it:free`，fallback `qwen/qwen3.8-27b:free`（兩者提供商不訓練，free-models.md §4／§7 #6）；評測後回寫。
- **預設模型還在不在**：App 啟動時若已連結，打公開 models API；選定模型不在清單就換回預設鏈中第一個還在的。
- **對錯**（D2）：AI＝`isCorrect`；自評＝按鈕；跳過／失敗→繼續＝錯。`srsWord: null`。
- **TASK-18 接點**：題目可帶 `selfCheck: true`（TASK-18 `applyCapabilities` 會加）；寫作畫面「有標記或沒金鑰」都走自評。TASK-18 併入後把 `detectCapabilities().llmKey` 接到本卡的 `getLink`。
- **既有測試**：寫作題登記後樣本課 a1-u01-l01 由 12 步變 14 步。TASK-12 的元件測試只測讀類，改用「濾掉寫作題的 fixture」保持原斷言；e2e 共用 helper 補寫作步（無金鑰→我寫對了），字面題數改 14。

## 文案

一律取自 TASK-4 文案表（`worktree-task-4-copy:docs/pending/2026-10-02-task4-copy/copy-table.json`）的 s06／s11 與未畫列，key 依本 repo 規則（三層）換名。文案表沒有、本卡自擬的（標 G3 待審）：

| key | 自擬文案 | 理由 |
|---|---|---|
| `lesson.write.failOther` | AI 這次沒有給出可用的結果。可以先對照參考答案，或稍後再試。 | 上游忙碌（429）／回應無法解析；文案表只有額度、網路、金鑰失效 |
| `settings.ai.modelPrice` | 付費・每百萬詞元 {price} 美元 | 模型清單需標價格（AC／Description），設計未畫 |
| `settings.ai.modelFree` 等清單用字 | 見 zh-TW.json | 同上 |

## Stage 規劃

| Stage | 內容 |
|---|---|
| 1 | `llm/` 純邏輯（keyStore、pkce、client、errors、models）＋單元測試 |
| 2 | 批改 prompt＋`parseGrade` 容錯（AC#2） |
| 3 | 寫作題型登記＋WritingView 四態＋LessonScreen 接線（AC#3） |
| 4 | 設定頁 AI 區、貼金鑰頁、callback、模型清單、額度、解除連結 |
| 5 | e2e（PKCE mock、貼／清金鑰、請求去向、寫作題）＋06 視覺 smoke |
| 6 | 評測腳本（`:free` 硬守衛、單一模型、不重試）＋40 句題組＋mock 乾跑＋報告骨架 |
| 7 | **等放行**：真打評測、選定預設模型、回寫 |
