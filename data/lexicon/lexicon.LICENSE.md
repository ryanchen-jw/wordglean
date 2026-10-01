# lexicon.json — 逐欄位授權

`lexicon.json` 由 `data/scripts/build.py` 從各來源衍生檔在建置時合併而成。每個欄位的出處與授權：

| 欄位 | 出處 | 授權 |
|---|---|---|
| `headword`、`pos` | CEFR-J 1.5／Octanove C1/C2／TSL 1.2／NGSL 1.2（依該筆來源）；只出現在 TSL／NGSL 的字，`pos` 取自 ECDICT 第一個標了詞性的釋義行 | 依該筆來源 |
| `cefr` | `cefrSource` 為 `cefrj` → CEFR-J Wordlist 1.5；`octanove` → Octanove C1/C2 | `cefrj`：CEFR-J 條款（適切引用即可商用，**非 CC BY-SA**）；`octanove`：CC BY-SA 4.0 |
| `cefrSource` | 本專案標註 | — |
| `toeic` | TSL 1.2 | CC BY-SA 4.0 |
| `ngsl` | NGSL 1.2 | CC BY-SA 4.0 |
| `freqRank` | ECDICT `frq` 欄（README：「当代语料库词频顺序」） | MIT |
| `glossZh` | ECDICT `translation` 欄，OpenCC s2twp 轉台灣正體，取該詞性第一行的前 2 個義項、≤30 字 | MIT |
| `id` | 本專案標註（`headword#pos`） | — |

引用格式見 `data/LICENSES.md`。若需要把 CEFR-J 衍生值與 CC BY-SA 資料分開散布，改為建置時產生即可（`lexicon.json` 列入 `.gitignore`，由 `build.py` 重建）；檔案路徑與格式不變。
