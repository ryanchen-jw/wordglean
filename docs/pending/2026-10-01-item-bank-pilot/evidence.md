# TASK-8 證據（2026-10-01）

環境：Windows 11、Git Bash、Node 22.20.0；worktree `worktree-task-8-item-bank`（基底 main 5474515）。

## Stage 1：AC#1 三種注入案例（紅→綠）

測試：`content/test/check-items.test.mjs`（18 例，真 lexicon＋dict）。注入案例：

| 案例 | 注入 | 被擋代碼 |
|---|---|---|
| 越級字 | A1 課例句放 `postpone`／`postponed`（lexicon：B2） | `OVER_LEVEL`（訊息 `postpone(B2)`、`postponed(B2)`） |
| 雙答案 | 判題模型回 `[0, 1]`；另測兩選項同文字 | `MCQ_AMBIGUOUS`；`MCQ_OPTIONS` |
| 簡體字 | `这是我的书。`；另測字表外的 `猫` | `SIMPLIFIED`＋`ZH_NOT_TW`；`ZH_NOT_TW` |

突變驗證（逐一關閉守衛、跑測試、還原；腳本在 job 暫存目錄，邏輯：字串替換→`node --test`→finally 還原）：

```
== 突變：越級判定關閉
not ok 2 - AC\#1 越級字：A1 課出現 B2 的 postpone（含變化形 postponed）→ OVER_LEVEL
not ok 11 - 專有名詞不能繞過 lexicon 有級距的字：宣告 Conference 仍報 OVER_LEVEL
# pass 16
# fail 2
== 突變：多答案判定關閉
not ok 3 - AC\#1 雙答案：判題模型認為兩個選項都對 → MCQ_AMBIGUOUS
# pass 17
# fail 1
== 突變：簡體字表關閉
not ok 5 - AC\#1 簡體字：繁中欄混入簡體 → SIMPLIFIED（opencc 層同時報 ZH_NOT_TW）
# pass 17
# fail 1
== 還原後
# pass 18
# fail 0
```

`npm test`（content 全套）：tests 59、pass 59、fail 0。

opencc-js 1.4.2 twp 誤擋實測（台灣通行詞被改寫）：連接→連線、支持→支援、項目→專案、數據→資料、點擊→點選、文件→檔案、干擾→幹擾（誤轉）、祕密→秘密、台灣→臺灣 → 列入 `TWP_ACCEPTED`／台臺等價。運行→執行、發送→傳送、在線→線上 等保留為擋（偏大陸用法）。

## Stage 2：產題管線乾跑與拒跑

乾跑 pilot 16 課（假模型，不連網、不需金鑰）：

```
$ node scripts/gen-items.mjs --fixture --lessons a1-u01,b1-u01 --out <job tmp>/dryrun1 --run-id dryrun-check
乾跑：16 課 → .../dryrun1
a1-u01-l01	ok  …（共 16 行 ok）… b1-u01-l06	ok
完成：ok 16、skipped 0、parse_failed 0、check_failed 0；呼叫 32 次、token 輸入 23624／輸出 19466、花費 US$0.0000（乾跑，token 為估算）
exit=0
$ node scripts/check-items.mjs --require-judge --dir <job tmp>/dryrun1
檢查 16 課：全綠
exit=0
```

金鑰缺席（repo 根無 .env、環境變數未設）：

```
$ node scripts/gen-items.mjs --lessons a1-u01,b1-u01 --model anthropic/claude-sonnet-5.5 --judge-model openai/gpt-6-luna --budget 3
拒絕執行：缺少 OPENROUTER_API_KEY：真打 API 需在環境變數或 <worktree>\.env 設定開發方金鑰（.env 不進 git）。本次未呼叫任何 API。只想乾跑請加 --fixture。
exit=2
```

突變（金鑰缺席改為靜默回傳空字串）：`not ok 2 readApiKey…`、`not ok 11 CLI 真打但沒有金鑰…`（pass 10／fail 2）；還原後 12／12。

`test/gen.test.mjs` 12 例：假 fetch 驗請求帶金鑰與 max_tokens、HTTP 500 只呼叫一次、預算不足零呼叫、第二課 500 後停止（共 3 次呼叫）、解析失敗保留原文且不重試、判題雙答案進 _rejected、已有輸出檔跳過、缺 cost 以快照自算（手算 0.022／0.003）、CLI 乾跑 16 課、CLI 拒跑四種前置。`npm test` 全套 71／71。

## Stage 3：成本估算與 token 估算校準

報告：`cost-estimate.md`（`node content/scripts/estimate-cost.mjs --out …` 產生）。定價快照：`content/pricing/openrouter-2026-10-01.json`，來源 https://openrouter.ai/api/v1/models（公開、不需金鑰），2026-10-01T15:52Z 抓取。

token 估算校準（job 暫存目錄裝 js-tiktoken 1.x，o200k_base；不進 repo）：

```
a1-u01-l01 輸出 JSON	估 1105	o200k 1214	比 1.10
a1-u01-l01 產題 prompt	估 1018	o200k 1075	比 1.06
a1-u01-l01 判題 prompt	估 416	o200k 490	比 1.18
a1-u01-l01 純中文	估 267	o200k 259	比 0.97
b1-u01-l01 輸出 JSON	估 1565	o200k 1557	比 0.99
b1-u01-l01 產題 prompt	估 1044	o200k 1087	比 1.04
b1-u01-l01 判題 prompt	估 604	o200k 625	比 1.03
b1-u01-l01 純中文	估 446	o200k 411	比 0.92
```

`npm test` 全套 73／73（新增 `test/pricing.test.mjs` 2 例，手算期望值）。

## Stage 4a：只准免費模型、429 排隊、額度、先落檔（2026-10-02，未真打）

`test/gen.test.mjs` 24 例（假 fetch＋假時鐘，不連網）。突變驗證（逐一拿掉守衛→跑測試→finally 還原；腳本在 job 暫存目錄）：

```
== 突變：:free 守衛拿掉
not ok 3 - :free 守衛：非 :free 模型與 openrouter/free 在呼叫前拒絕、零次 fetch
not ok 24 - CLI 真打的其他前置：非 :free、缺 budget、同家族判題皆 exit 2
== 突變：花費非 0 不中止
not ok 4 - 回報花費非 0：記帳後中止整批、不再呼叫
== 突變：429 改成停止整批（不排隊）
not ok 9 - 429 排隊延後：該課放佇列尾、至少 60 秒後再輪；不算重試、其他課先做
not ok 10 - 同一課 429 延後超過 5 次 → 今日未完成、不再排（共送 6 次）
== 突變：延後不等 60 秒
not ok 9 - 429 排隊延後：…
== 突變：判題前不落檔（判題 429 會重產）
not ok 11 - 產題先落檔；判題 429 只補判題、不重產
not ok 12 - 下次執行時 _pending/ 的課只補判題（不呼叫產題模型）
== 突變：每日額度不查
not ok 15 - 每日額度：開跑時剩 ≤ 2 → 零次模型呼叫、收工並列出未處理的課
not ok 16 - 每日額度：本地扣減到 ≤ 2 即停（剩 4 → 產題＋判題後停在第二課之前）
== 突變：每分鐘不節流
not ok 14 - 每分鐘節流：第 21 次呼叫等到第 1 次滿 60 秒
== 還原後
# pass 24
# fail 0
```

`npm test` 全套 85／85（6.7 秒）。金鑰不外洩：測試以假金鑰字串比對帳本與 log 皆不含。

條款：NVIDIA API Trial Terms PDF（2026-10-01T18:05Z 下載、sha256 `afd5df0322615ff95736f2f8b59fa952f5f4582dfe05f97213c0ae860f628b30`、v. September 19, 2025）全文逐條讀；結論與條文見 proposal「NVIDIA API Trial Terms 條款結論」。

## Stage 4b day1 收工後準備（不真打）

- 條款：Novita（apodex）全文讀；AtlasCloud（dots）讀不到條款全文 → 排除。結論見 proposal。
- 檢查器：美式拼法規則還原（紅：`lexicon 無級距：traveled, traveling` → 綠）；found／café／菜單／對象 誤擋修正（紅 3 項 → 綠）。AC#1 三案突變重跑仍轉紅（越級 3 紅、雙答案 1 紅、簡體 1 紅）。
- 判題備援、退件不再產題、v2 重產一次：先寫 6 個紅測試（not ok 22–27）→ 實作後綠。突變（逐一拿掉守衛）：退件也重產（3 紅）、重產不限一次（1 紅）、重產不用 v2（1 紅）、不切換備援（1 紅）、成功不歸零（1 紅，測試改為門檻 2 的確定性序列後才抓到）、CLI 不檢查備援家族（1 紅）；還原後 30／30。
- `npm test` 全套 95／95。

## day3 準備（不真打）

- 越級分析：overlevel-analysis.md。檢查器修正先紅（not ok 片語 out of／tenth、not ok NOT_ENGLISH）後綠。
- prompt v3：test/prompts.test.mjs（字表含 the、不含 road；B1 含 road／whether、不含 conference——lexicon 字面值）。
- 重產授權擴大：先紅（not ok 23、24）後綠。突變（day3 腳本）：重產不設上限（2 紅）、不從帳本計次（2 紅）、前次檔不改名（2 紅）、片語只看片語級距（1 紅）、片語只看組成字（2 紅）、不報 NOT_ENGLISH（1 紅）；還原後 gen 31／31、check-items 25／25。AC#1 突變重跑仍轉紅。
- `npm test` 全套 101／101。

## TASK-12 欄位擴充（day3 真打前）

- 紅：check-items 測試因 `blockingErrors` 未匯出整檔失敗（新增 5 例）→ 實作後 30／30。
- 突變：v3 缺欄也只當提示（1 紅）、舊檔缺欄也阻擋（1 紅）、不查干擾重複（1 紅）、不查 optionGlossZh 長度（1 紅）、新欄位不跑繁中守衛（1 紅）；還原後 30／30。
- v3 乾跑 16 課（假模型含新欄位）：ok 16、`check-items --require-judge` 全綠。
- `npm test` 全套 106／106。

## day3b 與驗收 FAIL 修正

- day3b 真打：pilot-day3b（38 請求、18 成功、20 次 429）、compare-qwen-day3b（12 次全被 Gemma 擋）。
- attempt 3 schema bug：紅 `not ok attempt：第 3 次產生…合法；4 不合法` → enum 加 3 後綠。recheck-rejected 先紅（腳本不存在）後綠；實跑重判 7 個退件檔，a1-u01-l02、l09 移入合格。
- 驗收 FAIL 四項單邊突變：distractorsZh 拿掉 minItems／maxItems（1 紅）、attempt enum 不含 3（1 紅）、--max-attempts 不設上限（1 紅）、perMinute 20→1000（1 紅）；還原後 check-items 31／31、gen 33／33。
- `npm test` 全套 110／110。

## 網路守衛、gloss-backfill、額度估算修正（2026-10-02 台北 09:00–09:50）

- 網路守衛：紅（NetworkBlockedError 未匯出）→ 綠 3／3；突變拿掉守衛 2 紅（全域 fetch 探針被呼叫、未真連網）。
- gloss-backfill：紅（模組不存在）→ 綠 8／8；突變：同義也寫入、不檢查完整性、不跑檢查器、新格式也補欄（補測試後才紅）、判題 429 重新補欄 —— 皆轉紅。真打 gloss-backfill-1：5／6 課補上、判題 0 同義。
- 額度估算：紅 `not ok 每日額度：429 不扣本地估算` → 綠。「消息」誤擋：紅 → 綠。
- 最後重產 b1-u01-l02／l03／l04：皆最終退件。recheck-rejected 重判 4 個退件檔：0 課移入。
- `npm test` 全套 121／121。
