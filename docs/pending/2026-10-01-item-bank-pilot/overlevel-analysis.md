# 越級字分析（day1–2 全部題目檔）

> 範圍：`content/items/{a1,b1,_rejected,_pending}` 與 `compare/qwen/_pending` 所有題目檔（含 `.v1.json` 第一次產生檔），以 day2 收工時的檢查器重算 `OVER_LEVEL`／`UNLEVELED`。收集腳本在 job 暫存目錄（以 `checkLessonItems(…, requireJudge:false)` 逐檔重算、逐字展開）。級距一律取 `data/lexicon/lexicon.json` 字面值。

## 結論

| 類別 | 筆數 | 比例 | 處理 |
|---|---|---|---|
| 真越級（lexicon 級距確實高於課級距） | 24 | 75% | 不是檢查器問題 → prompt v3 直接附「本課可用字表」 |
| 檢查器假陽性 | 2 | 6% | 已 TDD 修（見下） |
| lexicon 缺級距 | 1 | 3% | 白名單候選，交人審（不自動加） |
| 其他規則違反、被誤標成無級距 | 5 | 16% | 4 筆改報 `NOT_ENGLISH`；1 筆屬產題端漏宣告專有名詞 |
| **合計** | **32** | | 修正後重算剩 26 筆（24 真越級＋Korea＋buffet） |

**主因是 A1 字表太小**：24 筆真越級有 17 筆出現在 A1 課，都是很日常的 A2 字（road×6、send×2、stairs×2、snacks、report、lake、lost）或 B1 字（rest×3）。模型對「A1 有哪些字」沒有可靠的概念，只在 prompt 寫「只用 A1 字」壓不住（v2 加強措辭後反而更多：a1-u01-l10 重產後 8 個）。B1 課的 7 筆是職場常用 B2 字（employees×2、project、conference、colleagues、decorations、lobby）。

## 逐筆判定

| 命中字 | 課級 | 次數 | lexicon | 判定 |
|---|---|---|---|---|
| road | A1 | 6 | road n:A2 | 真越級 |
| rest | A1 | 3 | rest n／v:B1 | 真越級 |
| send | A1 | 2 | send v:A2 | 真越級 |
| stairs | A1 | 2 | stair n:A2（stairs 經複數還原） | 真越級 |
| snacks | A1 | 1 | snack n:A2 | 真越級 |
| report | A1 | 1 | report n:A2 | 真越級 |
| lake | A1 | 1 | lake n:A2 | 真越級 |
| lost | A1 | 1 | lost adj:A2；lose v:A2 | 真越級（原形也是 A2，非屈折誤判） |
| employees | B1 | 2 | employee n:B2 | 真越級 |
| project、conference、colleagues、decorations、lobby | B1 | 各 1 | 皆 B2 | 真越級 |
| out of | A1 | 1 | out of prep:A2；out、of 皆 A1 | **假陽性**：片語由兩個 A1 字組成 |
| tenth | B1 | 1 | 無（只收 ten A1） | **假陽性**：序數未收 |
| buffet | B1 | 1 | buffet n:null（只在 TSL） | lexicon 缺級距；餐敘主題合理用字 → 白名單候選 |
| Korea | A1 | 1 | 無 | 產題端沒列進 properNouns（規則違反，非越級） |
| 他建議大家多留一下 等 | B1 | 4 | — | 聽選題選項寫成中文（應為英文），被誤報成無級距 → 改報 `NOT_ENGLISH` |

## 檢查器修正（TDD，紅→綠）

1. 片語級距＝min（片語級距, 組成字最高級）；組成字有任一無級距就照片語級距（according to 仍是 B1）。
2. 規則還原加序數：-th → 基數（tenth→ten）、-ieth → -y（twentieth→twenty）；只在 lexicon 與詞形表都查不到時才用。fifth／twelfth 這類不規則序數仍會報無級距（未處理，罕見）。
3. 英文欄位出現中文字 → 新代碼 `NOT_ENGLISH`（原本被當成無級距的字）。

紅：`not ok 越級分析假陽性：片語 out of…`、`not ok 英文欄位寫成中文 → NOT_ENGLISH`；修正後 content 全套 98／98，AC#1 三案突變重跑仍轉紅（越級 3 紅、雙答案 1 紅、簡體 1 紅）。

## day3 結果：prompt v3（附本課可用字表）

day3 以 v3 產生 3 份題目（a1-u01-l06、l07、l09，皆為第 2 次產生）：**越級字 0、無級距字 0**（同一批課的前一版：l06 的 v1 版越級 2 筆；l07 的 v2 版無越級；l09 第一次是解析失敗、無題目）。剩下的錯誤為判題抓出的真雙答案 2 題（「____ do you go to work?」Where／Why／When 皆通；聽選 A 與 C 皆合理）與「哪里」簡體 2 處。樣本小（3 份），但方向與分析結論一致：給模型明確字表比只寫「只用 A1 字」有效。

### day3b 後累計（v3 共 11 份）

v3 累計 11 份題目：越級 3 筆（a1-u01-l06 第 3 次 1 筆；b1-u01-l03 的 project（B2）2 筆）、無級距 0 筆；day1–2 的 v1／v2 題目檔（含比較課 b1-u14 的 5 筆）共 24 筆真越級。v3 的主要錯誤已轉為簡體字混入（SIMPLIFIED＋ZH_NOT_TW 共 18 筆，集中在「里／这／确」等字）與判題抓到的真雙答案。字表策略有效；下一步若要再壓錯誤，應針對簡體字（例如 prompt 列常見誤用字對照，或改用繁中能力更穩的模型）。
