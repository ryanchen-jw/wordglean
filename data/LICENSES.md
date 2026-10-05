# data/ 分檔授權索引

`data/LICENSE`（CC BY-SA 4.0）是本目錄的預設授權；下表列出各檔實際適用的授權，例外以本表為準。條款原文與核對紀錄在 `data/licenses/`。

| 路徑 | 內容 | 授權 | 出處 |
|---|---|---|---|
| `sources/cefrj/levels.json` | CEFR-J 詞條、詞性、級距（A1–B2） | **CEFR-J 條款**：適切引用即可研究、教育、商用免費使用；**不是 CC BY-SA** | The CEFR-J Wordlist Version 1.5. Compiled by Yukio Tono, Tokyo University of Foreign Studies. Retrieved from https://github.com/openlanguageprofiles/olp-en-cefrj (commit d4e45b7) on 01/10/2026. |
| `sources/octanove/levels.json` | Octanove C1/C2 詞條、詞性、級距 | CC BY-SA 4.0 | Octanove Vocabulary Profile C1/C2 ver 1.0, Octanove Labs |
| `sources/ngsl-tsl/flags.json` | TSL 1.2 與 NGSL 1.2 的詞條清單 | CC BY-SA 4.0 | Browne, C., Culligan, B. (2013). The TOEIC SERVICE List／Browne, C., Culligan, B., Phillips, J. The New General Service List. www.newgeneralservicelist.com |
| `lexicon/lexicon.json` | 上列三者與 ECDICT 的建置時合併 | 逐欄位，見 `lexicon/lexicon.LICENSE.md` | 同上 |
| `dict/` | ECDICT 衍生字典切片（繁中化、截斷）與詞形對照 | MIT（ECDICT） | ECDICT, Copyright (c) 2025 Linwei, https://github.com/skywind3000/ECDICT (commit bc015ed) |
| `phrases/phrases.json`、`phrases/phrases.schema.json` | 片語動詞與常用搭配（片語、繁中釋義、級距、組成字、可分離、主題；TASK-24） | CC BY-SA 4.0 | **本專案自編**（開發端依一般語言知識選編與撰寫釋義，未複製任何既有片語清單；來源查證見 TASK-24 規劃）。組成字級距引自 lexicon，各依上列來源條款 |
| `scripts/`、`tests/`、`bench/` | 程式碼 | AGPL-3.0（同 repo 根 `LICENSE`） | 本專案 |
| `licenses/` | 各來源授權原文 | 各自原授權 | — |

## 修改說明

- 所有衍生檔只保留上表「內容」欄所列欄位；原始表（`data/raw/`）不進 git。
- ECDICT 中文釋義以 OpenCC 1.4.2 `s2twp`（簡體→台灣正體含慣用詞）轉換、以 `scripts/zh_fixups.tsv` 修正少數誤轉詞，並依 `data/CLAUDE.md` 所述規則截斷。
- ECDICT 的 `oxford`、`collins`、`tag` 欄一律丟棄（`oxford` 為牛津 3000 衍生資訊，規格禁用）。
- 不使用 ECDICT 的 `lemma.en.txt`（檔頭條款限研究／教育用途，見 `licenses/ECDICT-notes.md`）。
