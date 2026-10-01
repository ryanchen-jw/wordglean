# ECDICT — 授權與欄位一手紀錄

- repo：https://github.com/skywind3000/ECDICT ，commit bc015ed2e24a7abef49fc6dbbb7fe32c1dadaf8b（2025-03-28）
- 授權：MIT，原文見同目錄 `ECDICT-MIT.txt`（同 commit 的 `LICENSE` 逐字下載）
- 使用：`ecdict.csv` 的 word、phonetic、translation、pos、bnc、frq、exchange 欄
- **丟棄**：`oxford`（牛津 3000 標記，規格禁用）、`collins`（柯林斯星級，出處有疑慮）、`tag`（中國考試標籤，非在地需求）、`definition`、`detail`、`audio`
- `frq` 欄 README 原文：「当代语料库词频顺序」（未指名語料庫）；`bnc`：「英国国家语料库词频顺序」
- `exchange` 欄 README 原文：「这个是根据 BNC 语料库和 NodeBox / WordNet 的语言处理工具生成的」——屬 `ecdict.csv` 本體，依 repo MIT 授權使用

## lemma.en.txt —— 授權有疑慮，預設排除

檔頭原文（同 commit 的 `lemma.en.txt` 第 1–10 行）：

```
; En Lemma Database (version 1.0.3)
; Compiled by Lin Wei (https://github.com/skywind3000), Mar 28, 2017
; by referencing the 100M+ words in the British National Corpus (BNC),
; NodeBox Linguistics and Yasumasa Someya's lemma list.
; This lemma list is provided "as is" and is free to use for any research
; and/or educational purposes.
```

檔頭條款只寫「research and/or educational purposes」，比 repo 的 MIT 窄，且參考了 Someya lemma list（第三方，其條款未核）。依任務卡「授權有疑慮即排除並記錄、不得自行放寬」，本管線**預設不輸出** lemma.en.txt 衍生切片；詞形還原改由 ECDICT 本體的 `exchange` 欄反查產生 `data/dict/` 切片內的 `forms` 對照表。lemma.en.txt 仍列在 `sources.lock.json`（下載備查），待創辦人裁示後再決定是否切片。
