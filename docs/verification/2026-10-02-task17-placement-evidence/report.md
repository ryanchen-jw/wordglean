# TASK-17 新手分級測驗——結案報告

> 分支 `worktree-task-17-placement`；規格與受測 seam 見同目錄 `proposal.md`。2026-10-02。

## 1. AC 對照與證據

| AC | 結果 | 證據（本輪實跑） |
|---|---|---|
| #1 假字產生器：抽 200 個無一在 lexicon／ECDICT | ✅ | `content/test/pseudoword.test.mjs`：以種子 `ac1-sample` 抽 200 個，對 lexicon 與 ECDICT 切片（12.4 萬詞條＋5.7 萬詞形）0 命中；`data/tests/test_placement_ecdict.py`：已提交的 200 個假字池＋上述 200 個樣本對 **ECDICT 完整原檔**（`ecdict.csv` 全部列）0 命中。突變對照：拿掉產生器的真字過濾 → 轉紅；樣本塞入 zymurgy → 轉紅 |
| #2 四種合成作答者推定正確 | ✅ | `app/src/placement/score.test.ts`（固定題本、手算字面值）＋`form.test.ts`（正式題本、3 個亂數種子）：誠實 A2→A2、誠實 B2→B2、全勾→A1＋提示重測、全不勾→A1。突變：門檻改 80 → 5 紅；拿掉假字項 → 10 紅 |
| #3 E2E < 5 分鐘；結果寫入設定、設定頁可調整 | ✅ | `app/e2e/placement.spec.ts`：首次開啟 → 分級 → 「從 B1 開始」→ 首頁／設定頁顯示 B1 → 設定頁改 B2 → 首頁 B2。計時：60 題 × 3 秒＋實測畫面耗時＝webkit 183.9 秒、chromium 181.7 秒（< 300）；本機每題真等 3 秒一次：見 §6 |
| #4 計分公式與文獻出處寫入報告與程式註解 | ✅ | 本報告 §2；`app/src/placement/score.ts` 檔頭；假字方法出處 `content/scripts/lib/pseudoword.mjs` 檔頭 |

## 2. 計分公式與出處

**一手出處**（2026-10-02 讀 PMC 全文 PMC3356522）：Lemhöfer, K., & Broersma, M. (2012). Introducing LexTALE: A quick and valid Lexical Test for Advanced Learners of English. *Behavior Research Methods*, 44(2), 325–343. https://doi.org/10.3758/s13428-011-0146-0

> "a simple percentage correct measure, but corrected for the unequal proportion of words and nonwords by averaging the percentages correct for these two item types. This way, a yes bias (creating high error rates in the nonwords) would be 'penalized' in the same way as a no bias would (causing high error rates for words), independently of the different numbers of words versus nonwords."

原版 LexTALE 為全卷一個總分（40 真字＋20 假字）。本 App 逐級套用：

- 每級分數 = (該級真字勾選率 × 100 + 假字沒勾的比率 × 100) ÷ 2
- **≥ 85 視為掌握**。換算：沒勾任何假字時（假字正確率 100%），85 ⇔ 該級認識 70%，即卡片代決的「校正後認識率 ≥ 70%」。每勾 1 個假字（共 10 個），各級分數降 5 分，相當於該級認識率要多 10%。
- 起點＝由 A1 往上第一個未掌握的級；五級都掌握＝C1。
- 假字勾超過一半（≥ 6 個）→ 起點強制 A1、提示重測（灌水偵測）。
- 結果頁長條顯示各級**未校正**的勾選率（設計 s10「每一級你認識的字的比例」），有勾假字時另以提示條說明已向下修正。

## 3. 門檻附近可能差一級（已知限制，執行長裁示維持 60 題）

每級只有 10 個真字，勾選率以 10% 為一格：

| 勾到的假字 | 該級要認識幾個字才算掌握 |
|---|---|
| 0 | 7／10 |
| 1 | 8／10 |
| 2 | 9／10 |
| 3 | 10／10 |
| ≥ 4 | 無法掌握任何級（起點 A1） |

真實程度剛好在門檻上的人，多認得或少認得一個字就會差一級；抽到的 10 個字難易也會影響。結果頁的「想自己選級距」與設定頁「目前級距」都可以手動改（規格 §5「之後可在設定手動調整」）。

## 4. 題本與假字

- 題本 `content/placement/placement.json`（產生，勿手改；`node scripts/build-placement.mjs` 位元組可重現）：A1–C1 各 30 個候選真字＋200 個假字；每次測驗各級抽 10＋假字 10（16.7%），打散分 5 組 × 12 格；重測換題。
- 真字候選：lexicon 該級（各詞性最低級）、小寫有出現（排除專有名詞）、4–12 字母、排除功能詞（冠詞／限定詞、介系詞、代名詞、連接詞、助動詞）與冒犯／粗俗字（`content/scripts/lib/offensive.mjs`，自訂名單、附分類理由）；依詞頻分層抽樣。
- 假字方法：參考 Wuggy（Keuleers, E., & Brysbaert, M. (2010). Wuggy: A multilingual pseudoword generator. *Behavior Research Methods*, 42(3), 627–633. https://doi.org/10.3758/BRM.42.3.627）的音節段轉移法，自己實作拼寫層簡化版；語料＝自家 lexicon。不使用 Wuggy 程式碼與語言資料、不使用原版 GPL Wuggy。過濾：不在 lexicon／ECDICT 切片（含詞形）、與任何真字距離 ≥ 2、與 6 字母以上 lexicon 字距離 ≥ 3（排除一眼看出原字的拼錯）、不含不雅字串、可唸性（連續 3 個以上子音字母的組合須在 lexicon 至少 20 個字出現過，y 視為母音；擋下 eduptcy、upightnin、awsponker 這類，走查 P2-2）。過濾器 `pseudowordFilter` 另以「已知必須擋掉的候選」直接測（lexicon 真字、只在 ECDICT 的字、差一個字母的拼錯、難唸子音串各一組），拿掉任一道過濾即轉紅（走查 P2-1）。

**假字樣本（題本前 30 個，加可唸性過濾後重產）**：ertio, ewsall, mydryer, bondapse, hinallas, sixcola, rangiant, uckound, femfonse, renquing, seekdible, prupnifu, ompin, irnandea, wanosdote, hentriet, higow, feymete, rempesree, shisdess, imamore, penunter, ouquache, avorcar, gratlyte, pridiance, detfuss, pedvay, ouyatight, skamalcym

**已知限制**：可唸性過濾只看子音串；母音與 y 的組合造成的生硬拼法（如 ilymmil、mydryer、skamalcym）與不常見的字母排列（seekdible、sixcola）仍可能出現——拼寫層方法的限制（非音位層）。不影響「不是真字」的要求；若要再壓低，需改用音位層（發音字典）產生，成本高，暫不做。

## 5. 資料欄位與同步

- 本機 `Settings.cefrLevel`（Dexie 不升版，舊列讀為 null）↔ 雲端 `settings.cefr_level`（migration `20261002060000_settings_cefr_level.sql`，A1–C1、可空；pgTAP `settings_cefr_level.test.sql`）。`profiles.cefr_level` 標為未使用、不刪。
- 本機 Supabase 整合測試（`supabaseRemote.it.test.ts`）實測 cefrLevel 兩裝置同步 2/2 綠。
- 首頁／設定頁：設定有值以設定為準，無值才依最後完成的課推導；「跳過」寫入 A1；設定頁級距列開選級距彈層。

## 6. 本機每題真等 3 秒（D6 (b)）

2026-10-02 本機實跑：`PLACEMENT_REALTIME=1 E2E_PORT=5332 npx playwright test e2e/placement.spec.ts --project=chromium-pixel7 --workers=1`

```
[AC#3] items=60 ui=182.0s total=182.0s realtime=true
ok 1 [chromium-pixel7] › e2e\placement.spec.ts:15:1 › AC#3 首次開啟 → 分級測驗 → 結果寫入設定 → 設定頁改級距（每題真等 3 秒）(3.1m)
1 passed
```

首次開啟按「開始分級測驗」到出現結果頁，實測 182.0 秒（60 題 × 3 秒＝180 秒＋畫面操作約 2 秒），< 300 秒。快速模式（CI）：webkit 183.9 秒、chromium 181.7 秒（60×3＋實測畫面耗時 3.9／1.7 秒）。

## 7. 設計偏差（執行長已接受）

1. 結果頁五條長條（含 C1；設計只畫到 B2）。
2. 單字格兩欄、欄寬下限 9.5em：320 寬或大字級時改一欄（設計為 390 寬兩欄）；375 標準字級仍兩欄。10 個字母以上的字佔滿整列（設計未畫長字），英文一律不斷字，空位以 dense 排列補上（走查 P1-2：原本 375 兩欄時 underground、inflammation 等會從中間切斷）。
3. 「想自己選級距」置中（照設計）；「僅供參考」一行以 text-balance 避免孤字。
4. 設計未畫：重測狀態（提示條＋「重新測驗」主鈕，依元件規格組合）、多益「僅供參考」小字。文案：分級畫面沿用 TASK-4 G3 已定稿的 `placement.*` key（含最後一組「看結果（已勾 N 個）」）與 `common.text.toeicApprox`；本卡新增的 `placement.pick.exit`、`placement.result.toeicNote`、`placement.result.retestHint`、`placement.result.retest` 列入 zh-TW.json 頂層 `_pendingG3` 待下輪審。
5. 「ETS」「CEFR」加入介面英文白名單（機構／標準名，執行長已接受）。

## 8. 走查修正（2026-10-02）

- P1-1 勾選中字卡底色：原本共用 bg-surface 又覆寫 bg-primary-soft，CSS 順序讓 surface 勝出；改為底色只在各狀態給一次。`e2e/placement-cards.spec.ts` 以 computed 底色比對 token（淺／深色系、兩引擎），修前紅、修後綠。全卡掃描「共用 class＋狀態色覆寫」：本卡其他狀態樣式（勾選框、結果頁按鈕）皆為狀態分支各給一次，無同型問題。
- P1-2 長字斷字：同上 spec 以「各級最長的字」題本在 320／375／393／412 標準與 320／375 特大逐組檢查單行、不超出字卡內緣，修前紅（375 標準 underground 等折成 2 行）、修後綠。
- P2-1、P2-2：見 §4。
- 兩個 s10 e2e（作答＋重測兩輪 60 題）在 WebKit 本機負載高時超過預設 30 秒逾時，改設 90 秒；重跑 23–32 秒全綠。AC#3 的 5 分鐘判定另由 placement.spec 計時，不受影響。

## 9. 視覺 smoke（06）

`e2e/visual-smoke.spec.ts` 新增 s10 勾選中／結果（勾到假字）／選級距彈層／重測＋深色勾選中／結果，兩引擎；`e2e/narrow.spec.ts` 新增 320 標準、320 特大、375 特大三組 s10 四狀態。斷言：無橫向溢出、單行控件不折行、可點 ≥44px、無白名單外英文、body 套 token 色。報告與截圖只留本機（gitignored），未上雲。
