# data/ — 單字資料

單字分級、多益旗標與英漢字典的衍生資料，供 content/（課綱、題庫）與 app/（查義、分級測驗）使用。**資料與程式碼分開授權**，見下方「授權分界」。

## 來源

| 來源 | 版本／鎖定 | 用途 |
|---|---|---|
| CEFR-J Wordlist | 1.5（olp-en-cefrj repo commit d4e45b7） | A1–B2 分級 |
| Octanove Vocabulary Profile C1/C2 | 1.0（同上 repo） | C1–C2 分級 |
| TSL（TOEIC Service List） | 1.2（newgeneralservicelist.com） | 多益常考旗標 `toeic` |
| NGSL（New General Service List） | 1.2（同站） | `ngsl` 旗標 |
| ECDICT | commit bc015ed | 音標、繁中釋義、詞頻 `frq`、詞形 `exchange` |
| OpenCC（工具） | PyPI opencc 1.4.2，`s2twp` | 簡體 → 台灣正體 |

下載網址與 sha256 鎖在 `scripts/sources.lock.json`。**不使用**：Oxford 3000/5000、English Vocabulary Profile（版權）、ECDICT 的 `oxford`／`collins`／`tag` 欄、ECDICT 的 `lemma.en.txt`（檔頭條款限研究／教育用途，見 `licenses/ECDICT-notes.md`）。

## 授權分界

- 預設：`data/LICENSE`（CC BY-SA 4.0）。逐檔例外以 `LICENSES.md` 為準。
- `sources/cefrj/` 與 lexicon 中 `cefrSource=cefrj` 的 `cefr` 值：**CEFR-J 條款**（適切引用即可商用），**不可標成 CC BY-SA**。
- `dict/`：MIT（ECDICT）。字典切片刻意不放 CEFR 級距與多益旗標，前端要顯示時另查 lexicon。
- `scripts/`、`tests/`、`bench/`：程式碼，AGPL-3.0。
- 原始下載檔放 `raw/`（gitignore），**不進 git**（CEFR-J 條款未明文允許原樣再散布）。
- 新增欄位前先看 `tests/test_guard_oxford.py`：lexicon 與切片的欄位是白名單，任何新欄位都會讓測試變紅。

## 產物與介面

- `lexicon/lexicon.json`：依 `id` 排序的陣列，一個詞性一筆。欄位：`id`（`headword#pos`，保留大小寫，March≠march）、`headword`、`pos`（n／v／adj／adv／prep／conj／pron／det／num／int／aux／part；只在 TSL／NGSL 且 ECDICT 無詞性者為 null、id 用 `#unk`）、`cefr`、`cefrSource`（cefrj／octanove／null）、`toeic`、`ngsl`、`freqRank`（ECDICT `frq`，0 → null）、`glossZh`。逐欄位授權見 `lexicon/lexicon.LICENSE.md`。
- `dict/manifest.json`＋`dict/<鍵>.json`：每片 `{"e": {詞: [音標, 釋義]}, "f": {變化形: [原形…]}}`。
  - 查找：對 `manifest.prefixLengths` 由長到短取鍵——前 n 個字母小寫、非 a–z 記 `_`、不足 n 補 `_`——第一個存在於 `manifest.shards` 的鍵即為切片。參考實作 `bench/lookup.html`。
  - 收錄（篩選）：不含空格，且有詞頻（frq 或 bnc）、或出現在 ECDICT `exchange` 詞形關係、或在 lexicon 內。
  - 單片 gzip 上限 200KB（超過會自動加長前綴再切；`build.py` 結尾 assert）。
- `phrases/phrases.json`（TASK-24，本專案自編、CC BY-SA 4.0，**人工維護**，不由 build.py 產生）：`{schemaVersion, phrases[]}`，依 `phrase` 排序。欄位：`phrase`（小寫、含空格，也是查表鍵）、`type`（pv／collocation）、`cefr`（A2–C1）、`glossZh`、`components`（依序對應每個字的 lexicon headword，詞形還原後）、`separable`（受詞可插中間）、`topic`（content 主題 id，只供例句情境）、`downgradedFrom`（人工下調前的級距，選填）。結構見 `phrases/phrases.schema.json`，語意規則與允許的下調清單見 `tests/test_phrases.py`。
  - 定級：級距 ≥ 組成字最高級距；人工下調只限生活常用片語（創辦人裁示 2026-10-05），必須標 `downgradedFrom`。
  - 不與 lexicon 已有的多字詞重複；組成字都要在 A1–C1 課綱。
- `reports/stats.json`：統計；`reports/sample30.md`、`reports/sample50-zh.md`：人工比對抽樣；`reports/bench-cold.json`：冷啟動延遲。

## 處理規則

- CEFR 表的 `a/b` 寫法（如 `adviser/advisor`）取第一個寫法為 headword，其餘寫法也用於比對 TSL／NGSL 與 ECDICT。
- 同一（詞, 詞性）重複時取較低級；Octanove 與 CEFR-J 重複時以 CEFR-J 為準。
- 詞性對映：be／do／have-verb → v、modal auxiliary → aux、infinitive-to → part。Octanove 原表筆誤人工修正：`remonstrate` 的 `vern` → verb、`batter` 空白 → noun（`build.py` 的 `OCTANOVE_POS_FIX`）。
- ECDICT 釋義：`[网络]` 行只在沒有其他釋義時保留；以 s2twp 轉台灣正體，但 `scripts/zh_fixups.tsv` 列出的簡體原詞改用表中正確詞（修 s2twp 誤套資訊用語，如「最高级」→最高級而非最高階）。只收語境確定的詞；「交互的」「对象」單獨出現等語境不確定者維持 s2twp。各條命中數見 `reports/stats.json` 的 `zhFixupEntries`。
- 截斷：字典每行（詞性）最多 3 個義項、整條最多 160 字；lexicon `glossZh` 取該詞性第一行的前 2 個義項、最多 30 字（限定詞退用形容詞行；找不到則為 null）。超出以「⋯」標示。

## 重建指令

```bash
python -m venv data/.venv
data/.venv/Scripts/python -m pip install -r data/requirements.txt   # Linux/macOS：data/.venv/bin/python
data/.venv/Scripts/python data/scripts/fetch.py     # 下載到 data/raw/ 並驗 sha256；失敗時手動放檔後重跑
data/.venv/Scripts/python data/scripts/build.py     # 產生 sources/、lexicon/、dict/、reports/stats.json（位元組可重現）
data/.venv/Scripts/python data/scripts/samples.py   # 重產抽樣報告
data/.venv/Scripts/python -m pytest data/tests -q   # 測試（需要 raw/ 的兩項在 CI 自動略過）
cd data/bench && npm ci && npx playwright test      # 冷啟動延遲（埠 5291）
```

Windows 的 Git Bash 下跑前設 `PYTHONUTF8=1`。CI：`.github/workflows/ci.yml` 的 `data` job 跑 pytest（含 Oxford 守衛）。
