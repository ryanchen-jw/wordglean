# TASK-17 新手分級測驗——proposal（SDD）

> 執行長 2026-10-02 核准 Round 1 計畫，D1–D7 全照建議。本檔為實作契約；受測 seam 寫死於 §6。

## 1. 範圍與 AC 對應

| AC | 做法 | 驗證 |
|---|---|---|
| #1 假字產生器：抽 200 個無一在 lexicon／ECDICT | `content/scripts/lib/pseudoword.mjs` 產生器；題本 `content/placement/placement.json` 含 200 個假字池 | content 測試：產生器以另一個種子抽 200 個＋已提交的 200 個池，對 lexicon 與 repo 內 ECDICT 切片（詞條＋詞形）比對（CI）；data 測試：對 ECDICT 完整原檔 `data/raw/ecdict.csv` 比對（本機，無原檔時略過，D7） |
| #2 四種合成作答者推定正確 | `app/src/placement/score.ts` | 單元測試：誠實 A2→A2、誠實 B2→B2、全勾→A1＋提示重測、全不勾→A1；期望值為字面值 |
| #3 E2E <5 分鐘；結果寫入設定、設定頁可調 | Stage 3–5（待 TASK-11 併入後開工） | E2E（D6 (a)）＋本機實跑每題 3 秒一次（D6 (b)） |
| #4 公式與出處寫入報告與程式註解 | `score.ts` 檔頭註解＋`report.md` | 人工核對 |

## 2. 計分（LexTALE 平均正確率）

**出處（一手，2026-10-02 讀 PMC 全文 PMC3356522）**：Lemhöfer, K., & Broersma, M. (2012). Introducing LexTALE: A quick and valid Lexical Test for Advanced Learners of English. *Behavior Research Methods*, 44(2), 325–343. https://doi.org/10.3758/s13428-011-0146-0

> "a simple percentage correct measure, but corrected for the unequal proportion of words and nonwords by averaging the percentages correct for these two item types. This way, a yes bias (creating high error rates in the nonwords) would be 'penalized' in the same way as a no bias would (causing high error rates for words), independently of the different numbers of words versus nonwords."

原版 LexTALE 是單一總分（40 真字＋20 假字）。本 App 要推定級距，**改成逐級套用**：

- 每級分數 `score_L = (真字勾選率_L × 100 + 假字正確率 × 100) ÷ 2`
  - 真字勾選率_L＝該級真字被勾的比例；假字正確率＝假字**沒被勾**的比例（全卷共用）。
- **掌握門檻 `score_L ≥ 85`**。換算：沒勾任何假字時（假字正確率 100%），85 ⇔ 該級認識 70%，與卡片代決「校正後認識率 ≥ 70%」一致；每勾 1 個假字（共 10 個）假字正確率降 10 個百分點，等於各級分數降 5 分（相當於認識率降 10%）。
- **起點**＝由 A1 往上，第一個未掌握的級；五級都掌握＝C1。
- **灌水偵測**：假字被勾一半以上（假字正確率 < 50%）→ 起點強制 A1，結果頁提示重測。
- 結果頁長條顯示**各級真字勾選率**（設計 s10「每一級你認識的字的比例」）；有勾假字時顯示提示條「勾到 N 個假字，結果已向下修正」。
- 已知限制（Round 1 風險 #2，執行長裁示維持 60 題）：每級 10 個真字，比例以 10% 為單位，門檻附近可能差一級；設定頁可手動改。

## 3. 題本

- 每次測驗 60 題＝A1–C1 每級 10 個真字＋10 個假字（假字 16.7%，卡片 15–20%），打散後分 5 組、每組 12 格（設計 s10）。60 × 3 秒＝180 秒。
- `content/placement/placement.json`（產生，勿手改）：每級 30 個候選真字＋200 個假字池；每次測驗由 App 以亂數各抽 10（重測時換題）。
- 真字候選：lexicon 中該級（各詞性最低級，同課綱規則）的小寫純字母 headword、長度 3–12、排除只以大寫出現的字（專有名詞）；依詞頻名次分層等距抽樣（固定種子），涵蓋該級高低頻。

## 4. 假字產生器（參考 Wuggy 的方法，自己實作）

方法依據：Keuleers, E., & Brysbaert, M. (2010). Wuggy: A multilingual pseudoword generator. *Behavior Research Methods*, 42(3), 627–633. https://doi.org/10.3758/BRM.42.3.627——把字切成音節內的開頭（onset）、母音（nucleus）、結尾（coda）三段，依段與段之間的轉移產生「符合拼寫規律、但不是真字」的字。不使用 Wuggy 的程式碼與英文語言資料（無授權）、不使用原版 GPL Wuggy。

本專案的簡化版（拼寫層、非音位層）：

1. **切段**：語料＝lexicon 小寫純字母 headword。母音字母 a e i o u；y 在字首或接在母音後當子音、否則當母音；qu 的 u 當子音。連續母音＝一個 nucleus；兩個 nucleus 之間的子音串依「最大開頭原則」切：取最長的合法字首子音串（`pseudoword.mjs` 的固定清單：單一子音＋bl、str、thr 等常見子音群）當下一音節的 onset，其餘當前一音節的 coda。字尾「子音＋e」且前面還有音節時，e 併入前一音節 coda（不發音的 e）。
2. **轉移表**：記錄每個段在（角色、音節位置）槽位上接在哪個段之後；槽位＝角色（O/N/C）×音節位置（單音節／首／中／尾）。
3. **產生**：以 A1–B2 中 2–3 音節、5–9 字母的真字當範本；保留音節數，替換約一半的非空段（至少 2 段），每段換成「與前一段的轉移在語料中出現過、且與下一段的轉移也出現過」的段（依次數加權抽）。
4. **過濾**（任一不過即丟）：
   - 純字母、長度 4–9、無三連同字母、重新切段後音節數不變；
   - 不在 lexicon headword、ECDICT 切片詞條、ECDICT 切片詞形（皆小寫比對）；
   - 不是常見拼錯：與上述任何字的 Damerau–Levenshtein（OSA）距離 ≥ 2；與 6 字母以上的 lexicon 字距離 ≥ 3（第一版只要求 ≥2 時抽樣出現 cimittee、aficial 這類一眼看出原字的拼錯，加嚴）；
   - 不含不雅字串（`offensive.mjs`）；
   - 可唸性：連續 3 個以上子音字母（y 視為母音）的組合須在 lexicon 至少 20 個字出現過（走查 P2-2）。
5. 固定亂數種子，位元組可重現；`build-placement.mjs` 產生 placement.json，測試比對「已提交檔＝產生器輸出」。

## 5. 資料欄位（Stage 3，TASK-11 併入後）

- 本機 `Settings.cefrLevel: Level | null`；Dexie **不升版**（無索引；TASK-12 用 v3），讀取時缺欄位視為 null（D2）。
- 雲端新 migration：`settings.cefr_level text null check (in A1–C1)`＋pgTAP；`sync/rows.ts` 欄位對照＋`supabase/CLAUDE.md` 對照表；`profiles.cefr_level` 標為未用、不刪（D1）。
- 首頁／設定頁：欄位有值時以它為準，無值才退回「最後完成那一課的級距」推導（D3）；有值就不再是「第一次開啟」；「跳過，從 A1 開始」寫入 A1；設定頁「目前級距」開單選彈層（A1–C1，標「B1｜約多益 275+」）。

## 6. 受測 seam（寫死）

| Stage | seam | 測試 |
|---|---|---|
| 1 | `generatePseudowords({ corpus, real, seed, count })`（`content/scripts/lib/pseudoword.mjs`）；`buildPlacement(lexicon, dictWords)`；`content/placement/placement.json` | `content/test/pseudoword.test.mjs`、`content/test/placement.test.mjs`；`data/tests/test_placement_ecdict.py` |
| 2 | `drawForm(bank, rng)`、`scorePlacement(form, checked)`（`app/src/placement/`） | `app/src/placement/score.test.ts`、`form.test.ts` |
| 3 | `getSettings`／`saveSettings` 的 `cefrLevel`、`settingsToRow`／`settingsFromRow`；pgTAP | 既有測試檔追加 |
| 4 | `/placement` 畫面（使用者看得到的文字與 testid） | `PlacementScreen.test.tsx` |
| 5 | E2E 全流程＋設定頁改級距 | `app/e2e/placement.spec.ts`＋視覺 smoke |

## 7. 新文案（D5，佔位、待 G3）

- 結果頁多益行下方：「多益分數依 ETS 官方 CEFR 對照，僅供參考」
- 重測狀態提示條：「勾到 {n} 個假字，結果可能不準，建議重新測驗」；主要按鈕「重新測驗」
- 最後一組的按鈕：「看結果（已勾 {n} 個）」（設計只畫中間組的「下一組（已勾 N 個）」）
- 「ETS」「CEFR」加入介面英文白名單（`i18n/t.test.ts`、`e2e/measure.ts`），同 OpenRouter 屬機構／標準名

## 9. 實作偏差（Stage 3–4）

- 結果頁五條長條（含 C1；設計只畫到 B2，D4）。
- 單字格：兩欄，但欄寬下限 9.5em（`repeat(auto-fill, minmax(min(100%, 9.5em), 1fr))`），窄螢幕或大字級放不下最長的字時改一欄；字不截斷。
- 「從 X 開始」與「想自己選級距」選完後都寫入設定並回首頁（replace，返回鍵不會回到測驗）；離開鈕不寫設定。
- 設定頁「目前級距」列由導到課程地圖改為開選級距彈層（AC#3 可調整）；選級距彈層 `LevelSheet` 與結果頁共用。

## 8. 埠與環境

dev 5331、preview／E2E `E2E_PORT=5332`；Playwright workers=1。
