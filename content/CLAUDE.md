# content/——課綱與題庫

課程結構（級距 → 主題單元 → 小課）與題庫 JSON，以及產生、校驗它們的腳本。上游＝`data/lexicon/lexicon.json`（TASK-6），下游＝`app/` 在 build 時讀取、TASK-8 依小課產題。

## 授權分界

| 路徑 | 授權 |
|---|---|
| `schema/`、`scripts/`、`test/` | AGPL-3.0（程式碼，同 repo 根 `LICENSE`） |
| `items/`（題庫 JSON） | 一律 **CC BY-SA 4.0**（同 repo 根 `NOTICE` 與 `content/README.md`） |
| `curriculum/*.json`、`curriculum/STATS.md`、`placement/placement.json`（課綱與分級題本） | 衍生自 lexicon 的級距與多益旗標，**依 `data/LICENSES.md` 各來源條款**（CEFR-J 衍生級距適用 CEFR-J 條款、不是 CC BY-SA；Octanove、TSL／NGSL 為 CC BY-SA 4.0） |

不要把課綱資料寫死成單一授權；整體授權表述待創辦人裁示後以 `data/LICENSES.md` 為準。

## 檔案

| 路徑 | 內容 | 誰改 |
|---|---|---|
| `curriculum/topics.json` | 主題定義（中英標題、domain、涵蓋範圍、出處）＋各級依序使用的主題 | 人 |
| `curriculum/word-topics.json` | 字→主題人工分類：級距 → 主題 → 字（小寫 headword） | 人 |
| `curriculum/{a1,a2,b1,b2,c1}.json` | 各級距檔（單元、小課、每課新字） | **產生，勿手改** |
| `curriculum/STATS.md` | 統計報告（規模、多益常考字覆蓋、C2 排除、大小寫合併） | **產生，勿手改** |
| `schema/*.schema.json` | 級距檔、主題清單、字→主題分類三份 JSON Schema（2020-12） | 人 |
| `scripts/lib/lexicon.mjs` | 讀 lexicon 的唯一入口（lexicon 欄位變了只改這裡） | 人 |
| `scripts/lib/rules.mjs` | 數量規則：每課 6–10 字（目標 8）、每單元最多 10 課 | 人 |
| `scripts/lib/validate.mjs` | `validateCurriculum`、`validateTopics`、`validateWordTopics` | 人 |
| `scripts/lib/allocate.mjs` | 排課器 `allocate(wordTopics, lexicon, topics)`（規則見檔頭） | 人 |
| `scripts/lib/stats.mjs` | `curriculumStats`、`renderStats` | 人 |
| `scripts/build-curriculum.mjs` | 檢查分類 → 排課 → validator → 寫級距檔與 STATS.md | — |
| `scripts/validate-curriculum.mjs` | 只檢查現有級距檔 | — |
| `placement/placement.json` | 分級測驗題本（TASK-17）：A1–C1 各 30 個候選真字＋200 個假字池 | **產生，勿手改** |
| `scripts/lib/pseudoword.mjs` | 假字產生器（參考 Wuggy 方法自己實作，規則見檔頭與 `docs/verification/2026-10-02-task17-placement-evidence/proposal.md` §4） | 人 |
| `scripts/lib/offensive.mjs` | 分級測驗排除字：真字的冒犯／粗俗字名單（整字）、假字的不雅字串（子字串）；自訂名單、附分類理由 | 人 |
| `scripts/lib/placement.mjs` | 題本組裝 `buildPlacement(lexicon, dictWords)`、讀 ECDICT 切片 `loadDictWords` | 人 |
| `scripts/build-placement.mjs` | 產生 `placement/placement.json` | — |
| `eval/llm-eval-set.json` | TASK-15 批改模型評測題組（40 句錯句＋必修錯誤點） | 人 |
| `scripts/lib/llm-eval.mjs`、`scripts/llm-eval.mjs` | 批改模型評測：`:free` 硬守衛、評分、分日接續；prompt 與解析器直接 import `app/src/llm/*.ts`（Node 22 型別剝除）。用法與規則見 `docs/research/llm-eval.md` | — |

## 規則

- 一個字＝小寫 headword；級距＝lexicon 中該字所有詞性的最低 CEFR 級；全課綱只引入一次。大小寫不同的同拼字（March／march）併為一字。
- 課綱只排 A1–C1；所有詞性都是 C2 的字不排（數量見 STATS.md）。lexicon 無級距的字（含部分多益常考字）不排。
- 排課：同主題內多益常考字優先、再依詞頻（ECDICT frq）高到低；每主題切成每課 6–10 字；超過 10 課的主題拆成多個單元（標題加（一）（二））；每級先排各主題第一單元，再排第二單元。
- **ID 上線後凍結**：單元 `a1-u01`、小課 `a1-u01-l03` 由排序位置產生，改分類或主題順序會讓 ID 對應的內容位移。上線（有使用者進度）後若要改課綱，必須另訂遷移方式，不可直接重排。
- 每個主題在某級的字數必須切得出合法小課：不能是 1–5 或 11 字（`TOPIC_SIZE`）。

### validator 錯誤代碼

| 代碼 | 意思 |
|---|---|
| `SCHEMA` | 結構不符 JSON Schema |
| `DUPLICATE_ID` | 級距、單元、小課 ID 重複，或主題 id 重複 |
| `ID_MISMATCH` | 單元 ID 前綴≠所屬級距、小課 ID 前綴≠所屬單元；validate CLI 另查檔名≠檔內 level |
| `UNKNOWN_TOPIC` | 主題不在 topics.json，或未列在該級 |
| `UNKNOWN_WORD` | 字不是 lexicon 中有級距的 headword（含大寫寫法） |
| `DUPLICATE_INTRO` | 同一字出現超過一次 |
| `LEVEL_MISMATCH` | 字的級距≠所在級距 |
| `LESSON_SIZE` | 小課字數不在 6–10 |
| `MISSING_WORD` | A1–C1 有字沒被排課（或沒被分類）；少了整個級距檔或分類檔少一級也會報 |
| `TOPIC_SIZE` | 分類檔中某主題字數切不出合法小課 |

## 主題清單出處代碼（`sources`）

| 代碼 | 出處 | 一手核對 |
|---|---|---|
| `t90:<1–14>` | Threshold Level 1990 第 7 章主題，引自 Council of Europe《CEFR》(2001) §4.2 | 2026-10-01 讀 CEFR 2001 原文 PDF（rm.coe.int/1680459f97） |
| `ets-lr:<情境>` | ETS《TOEIC Listening and Reading Test Examinee Handbook》中「題目取材的情境」13 項 | 2026-10-01 讀 ETS 官方 PDF（ets.org/content/dam/ets-org/pdfs/toeic/toeic-listening-reading-test-examinee-handbook.pdf） |
| `cefr-domain:<personal／public／educational／occupational>` | CEFR 2001 §4.1.1 四個使用領域 | 同上 CEFR 原文 |
| `linguaapp` | 本專案自訂（功能字、描述、數量、時間等跨主題分類） | — |

CEFR-J 未找到公開的主題清單，生活主題改以 CEFR 原文引用的 Threshold Level 主題為據。A1–A2 只用生活與 general 主題，B1 起加入多益主題（`test/topics.test.mjs` 守住）。主題清單與字的分類屬內容取捨，創辦人可在 TASK-8 pilot 審核時調整。

## 指令

```bash
cd content
npm ci
npm test                         # 單元＋整合測試（含「已提交級距檔＝排課器產出」）
node scripts/build-curriculum.mjs   # 改了 topics.json／word-topics.json／lexicon 後重建；輸出位元組可重現
npm run validate                 # 只檢查現有級距檔
node scripts/build-placement.mjs    # 改了 lexicon／data/dict／產生器後重建分級測驗題本（位元組可重現）
# 皆可加 --lexicon <file> --dir <curriculum dir>
```

改分類的流程：編輯 `word-topics.json`（把字移到別的主題列）→ `node scripts/build-curriculum.mjs` → `npm test` → 一起提交分類檔、級距檔與 STATS.md。
