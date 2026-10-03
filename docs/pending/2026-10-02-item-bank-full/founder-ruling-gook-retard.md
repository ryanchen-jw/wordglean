# 創辦人裁示（2026-10-03）：gook、retard 移出 B2 課綱

裁示選 B：兩個字移出課綱。題目檔的每一處改動都記在各課 `judge.resolvedAfterFinalReview`，說明開頭是「創辦人裁示：移出課綱：」。

## 機制

- `content/scripts/lib/offensive.mjs` 新增 `CURRICULUM_EXCLUDED_WORDS = ['gook', 'retard']`。
- 排課器（`allocate.mjs` 規則 6）：排除字照常參與排序與切課，切好之後才從所在的小課剔除。
- validator：排除字不會報 `MISSING_WORD`；如果排除字被排進小課，就報新的錯誤代碼 `EXCLUDED_WORD`。
- `word-topics.json` 不改，兩個字仍留在分類檔裡佔位。`data/` 不動。
- 為什麼不直接從分類檔刪掉：模擬過，直接刪會讓 barometer、beagle、moonscape、recollect 四個字跨課搬家，共 6 課受影響（b2-u45-l02～l05、b2-u53-l07～l08）。改用「佔位後剔除」，就只動含這兩個字的 2 課。
- 測試先紅後綠：新增 4 個測試，實作前 3 個失敗（第 4 個是預設清單檢查，跟著 import 一起失敗）。實作後 `npm test` 213／213 通過。

## 受影響課（課綱）

| 課 | 改前 | 改後 |
|---|---|---|
| b2-u45-l05 | tortoiseshell, gook, skylark, eagle, glacis, ox, polar bear（7 字） | tortoiseshell, skylark, eagle, glacis, ox, polar bear（6 字） |
| b2-u53-l07 | outdo, tramp, peep, standby, duplication, retard, attainable, repaint（8 字） | outdo, tramp, peep, standby, duplication, attainable, repaint（7 字） |

另外有兩個產生檔跟著改：`curriculum/STATS.md` 的 B2 字數 2417 → 2415，合計 7773 → 7771。其他級距檔、單元與小課 ID 都不變。

## 題目改動

### b2-u45-l05

| 題 id | 動作 | 改前 | 改後 |
|---|---|---|---|
| b2-u45-l05-q02 | 刪除（gook 單字卡） | "There was some green gook at the bottom of the pond." | — |
| b2-u45-l05-q13 | 刪除（mcq，正解 gook） | "After we cleaned out the old pipe, our hands were covered in black ____." 選項 gook／glacis／tortoiseshell／sunbeam | — |
| b2-u45-l05-q17 | 新增（mcq，補足 mcq 2 題的配比） | — | "The ____ butterfly that landed on our flowers had orange, brown and black wings." 選項 sandstone／breezy／undersea／**tortoiseshell**（答案 3，由 sha256(題 id) 決定） |

新的 q17 對照撰寫準則 §11：

- 四個選項詞性相同，都放得進空格，只能靠詞義判斷（第 7 條）。
- 干擾項取自本單元前面幾課：sandstone 在 l01，breezy 在 l02，undersea 在 l03（第 26 條）。
- 沒有和同課 q12 共用干擾項，也沒有用 q12 的正解當干擾項。
- 題幹沒有洩漏正解。
- 情境：單字卡是「博物館的玳瑁梳子」，q17 是「花園裡的蝴蝶」，主詞、情境、句型三項都換了（第 4 條）。
- `selfcheck-similarity` 沒有列出任何句對。
- 由獨立 subagent 只看英文盲答，結果只選 3，與答案一致。審題員附註：干擾項容易排除，鑑別力偏低，但題目沒有錯。

### b2-u53-l07

| 題 id | 動作 | 改前 | 改後 |
|---|---|---|---|
| b2-u53-l07-q06 | 刪除（retard 單字卡） | "Too much salt can retard the growth of some plants." | — |
| b2-u53-l07-q15 | 改閱讀短文（passageEn、passageZh 各一句） | "We chose a sunny day, because damp air would retard the drying of the paint."／「…因為潮濕的空氣會讓油漆乾得比較慢。」 | "We chose a sunny day, because paint dries slowly in damp air."／「…因為油漆在潮濕的空氣中乾得比較慢。」 |

- 小題與選項都沒改。
- 由獨立 subagent 重新盲答：q15#0 選 0、q15#1 選 2，與原答案一致。
- 本課的 mcq 原本就不考 retard，題型配比不受影響。

### 改到選項或題幹的題 id

- **選項／題幹**：b2-u45-l05-q17（新增的 mcq，題幹與選項都是新寫的）。
- **短文**：b2-u53-l07-q15。改的是閱讀短文，小題的題幹和選項沒動。
- **刪除**：b2-u45-l05-q02、b2-u45-l05-q13、b2-u53-l07-q06。

### 全庫檢查

- 在 `content/items/` 全部 984 課的題目欄位（不含 judge 紀錄）掃 `\b(gook|retard)`，命中 0。干擾項、句子、短文裡都沒有。
- judge 裡的歷史紀錄（resolvedAfterFinalReview 的 message／resolution）保留原文，沒有改。

### 索引注意

`resolvedAfterFinalReview` 的 path 用的是題目在陣列裡的索引（items/N）。這次刪掉了單字卡，後面題目的索引往前移一格，所以：

- 本次新增的紀錄裡，刪除那兩條用刪除前的索引，其餘用刪除後的索引，每條紀錄都有註明。
- 先前的紀錄沒有改寫，索引以刪除前為準。

## 驗證

- `node scripts/check-items.mjs --require-judge`：984 課全綠。
- `npm test`：213／213。
- 長度名次（每個名次都要在 13–37%），結果全部合格，0.5–2 倍異常 0：

| 範圍 | listenChoice | mcq | reading |
|---|---|---|---|
| B2 全級（304 課） | 26.3／26.3／26.1／21.3 | 27.7／27.8／22.1／22.4 | 26.3／24.8／22.1／26.8 |
| b2d 第 1 批 u45–u50（47 課，含 u45-l05） | 28.7／25.2／29.4／16.7 | 19.7／24.1／33.2／23.0 | 30.0／20.9／19.3／29.8 |
| b2d 第 2 批 u51–u53（24 課，含 u53-l07） | 22.9／33.3／22.9／20.8 | 34.7／23.6／20.5／21.2 | 29.2／20.8／29.2／20.8 |
