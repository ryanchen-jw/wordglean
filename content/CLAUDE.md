# content/——課綱與題庫

課程結構（級距 → 主題單元 → 小課）與題庫 JSON，以及產生、校驗它們的腳本。上游＝`data/lexicon/lexicon.json`（TASK-6），下游＝`app/` 在 build 時讀取、TASK-8 依小課產題。

## 授權分界

| 路徑 | 授權 |
|---|---|
| `schema/`、`scripts/`、`test/` | AGPL-3.0（程式碼，同 repo 根 `LICENSE`） |
| `items/`（題庫 JSON） | 題目文字（例句、選項、短文、翻譯、評分要點）由開發端撰寫，採 **CC BY-SA 4.0**；選字與分級依據的來源不在此範圍，各依原授權（見 `data/LICENSES.md`）（同 repo 根 `NOTICE` 與 `content/README.md`） |
| `audio/`（預產發音音檔包，TASK-35） | **CC BY-SA 4.0**（句子音檔衍生自題目文字）；以 Kokoro-82M（Apache-2.0，音色 af_heart）在開發端產生，見 repo 根 `NOTICE` |
| `audio-gen/` | AGPL-3.0（產生音檔的程式碼） |
| `curriculum/*.json`、`curriculum/STATS.md`、`placement/placement.json`（課綱與分級題本） | 衍生自 lexicon 的級距與多益旗標，**依 `data/LICENSES.md` 各來源條款**（CEFR-J 衍生級距適用 CEFR-J 條款、不是 CC BY-SA；Octanove、TSL／NGSL 為 CC BY-SA 4.0） |

不要把課綱資料寫死成單一授權；整體授權表述已裁（2026-10-03）：題目文字採 CC BY-SA 4.0，選字與分級依據的來源各依原授權，以 `data/LICENSES.md` 為準。

## 檔案

| 路徑 | 內容 | 誰改 |
|---|---|---|
| `curriculum/topics.json` | 主題定義（中英標題、domain、涵蓋範圍、出處）＋各級依序使用的主題 | 人 |
| `curriculum/word-topics.json` | 字→主題人工分類：級距 → 主題 → 字（小寫 headword） | 人 |
| `curriculum/phrase-units.json` | 片語單元（TASK-24）：每級片語單元的插入點（`after` 主題單元）與各課片語；片語表在 `data/phrases/phrases.json` | 人 |
| `curriculum/{a1,a2,b1,b2,c1}.json` | 各級距檔（主題單元與片語單元、小課、每課新字或片語） | **產生，勿手改** |
| `curriculum/STATS.md` | 統計報告（規模、多益常考字覆蓋、C2 排除、大小寫合併） | **產生，勿手改** |
| `schema/*.schema.json` | 級距檔、主題清單、字→主題分類、片語單元、題目檔的 JSON Schema（2020-12） | 人 |
| `scripts/lib/lexicon.mjs` | 讀 lexicon 的唯一入口（lexicon 欄位變了只改這裡） | 人 |
| `scripts/lib/rules.mjs` | 數量規則：每課 6–10 字（目標 8）、每單元最多 10 課 | 人 |
| `scripts/lib/validate.mjs` | `validateCurriculum`、`validateTopics`、`validateWordTopics` | 人 |
| `scripts/lib/allocate.mjs` | 排課器 `allocate(wordTopics, lexicon, topics)`（規則見檔頭） | 人 |
| `scripts/lib/phrases.mjs` | 讀片語表的唯一入口 `phraseTable`、片語單元插入 `insertPhraseUnits(levels, phraseUnits)`（規則見檔頭） | 人 |
| `scripts/lib/stats.mjs` | `curriculumStats`、`renderStats` | 人 |
| `scripts/build-curriculum.mjs` | 檢查分類與 phrase-units → 排課 → 插入片語單元 → validator → 寫級距檔與 STATS.md | — |
| `scripts/validate-curriculum.mjs` | 只檢查現有級距檔 | — |
| `placement/placement.json` | 分級測驗題本（TASK-17）：A1–C1 各 30 個候選真字＋200 個假字池 | **產生，勿手改** |
| `scripts/lib/pseudoword.mjs` | 假字產生器（參考 Wuggy 方法自己實作，規則見檔頭與 `docs/verification/2026-10-02-task17-placement-evidence/proposal.md` §4） | 人 |
| `scripts/lib/offensive.mjs` | 分級測驗排除字：真字的冒犯／粗俗字名單（整字）、假字的不雅字串（子字串）；自訂名單、附分類理由。另有課綱排除字 `CURRICULUM_EXCLUDED_WORDS`（創辦人裁示 2026-10-03：gook、retard） | 人 |
| `scripts/lib/placement.mjs` | 題本組裝 `buildPlacement(lexicon, dictWords)`、讀 ECDICT 切片 `loadDictWords` | 人 |
| `scripts/build-placement.mjs` | 產生 `placement/placement.json` | — |
| `audio/<級>/<課>.lga`、`audio/dict/dNNN.lga` | 預產發音音檔包（TASK-35）：一課一包（單字卡的字或片語、聽打／跟讀句、聽選音檔）＋字典專用包（`data/dict` 中含連字號的字，依雜湊分 512 包）。MP3 單聲道 24 kHz 48 kbps、頭尾靜音裁切；格式見 `app/src/speech/clipPack.ts`，要發音的文字與正規化見 `app/src/speech/clipKey.ts` | **產生，勿手改** |
| `audio-gen/build-audio.mjs` | 產生音檔包（獨立 package，需 `npm ci` 與 PATH 上的 ffmpeg；不在 content 的依賴裡）：只補新增或變更的文字、文字沒變的課不重寫；空閒記憶體 <2.5 GB 停（重跑會接續）。單一行程最快（多行程互搶 CPU 反而慢） | — |
| `eval/llm-eval-set.json` | TASK-15 批改模型評測題組（40 句錯句＋必修錯誤點） | 人 |
| `scripts/lib/llm-eval.mjs`、`scripts/llm-eval.mjs` | 批改模型評測：`:free` 硬守衛、評分、分日接續；prompt 與解析器直接 import `app/src/llm/*.ts`（Node 22 型別剝除）。用法與規則見 `docs/research/llm-eval.md` | — |

## 規則

- 一個字＝小寫 headword；級距＝lexicon 中該字所有詞性的最低 CEFR 級；全課綱只引入一次。大小寫不同的同拼字（March／march）併為一字。
- 課綱只排 A1–C1；所有詞性都是 C2 的字不排（數量見 STATS.md）。lexicon 無級距的字（含部分多益常考字）不排。
- 排課：同主題內多益常考字優先、再依詞頻（ECDICT frq）高到低；每主題切成每課 6–10 字；超過 10 課的主題拆成多個單元（標題加（一）（二））；每級先排各主題第一單元，再排第二單元。
- **ID 上線後凍結**：單元 `a1-u01`、小課 `a1-u01-l03` 由排序位置產生，改分類或主題順序會讓 ID 對應的內容位移。上線（有使用者進度）後若要改課綱，必須另訂遷移方式，不可直接重排。
- 每個主題在某級的字數必須切得出合法小課：不能是 1–5 或 11 字（`TOPIC_SIZE`）。
- **片語單元**（TASK-24）：主題單元排好後，依 `phrase-units.json` 插在指定主題單元之後；ID `b1-p01`、`b1-p01-l01` 依該級片語單元順序產生，主題單元的 ID 與字一律不動（`test/curriculum.test.mjs` 以插入前的雜湊守住）。插入點與分課寫死在檔內、不隨主題課數重算。單元帶 `kind: "phrase"`、沒有 `topic`；每課 6–10 個片語；同級組成字必須在片語單元之前的主題課已引入。A1 沒有片語單元。
- 題庫過渡（TASK-24）：`check-items` 全量檢查時要求課綱每課都有題檔（`MISSING_ITEMS`），但 `item-rules.mjs` 的 `PHRASE_ITEMS_PENDING_LEVELS` 列出的級別，片語課沒題檔只計數不報錯；某級片語課題目寫完就從清單移除。
- **課綱排除字**（`offensive.mjs` 的 `CURRICULUM_EXCLUDED_WORDS`）：仍留在 `word-topics.json` 佔位、照常參與排序與切課，切好後才從所在小課剔除——只有那課少一字，其他字不跨課位移。不排進小課，也不報 `MISSING_WORD`。

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
| `EXCLUDED_WORD` | 課綱排除字被排進小課 |
| `UNKNOWN_PHRASE` | 片語單元的課有不在片語表的片語 |
| `PHRASE_PREREQ` | 片語的同級組成字在該片語單元之前還沒引入；或組成字高於片語級距但沒標 `downgradedFrom`；或組成字不在 A1–C1 課綱 |
| `MISSING_PHRASE` | 片語表中有片語沒排進任何片語單元 |

片語單元也套用 `DUPLICATE_ID`、`ID_MISMATCH`（另查 `kind: "phrase"`↔`-pNN`）、`LEVEL_MISMATCH`（片語級距≠所在級距）、`LESSON_SIZE`、`DUPLICATE_INTRO`。

## 片語課（TASK-24）的題庫檢查

片語課＝課號 `<級>-pNN-lNN`（plan：`docs/pending/2026-10-05-phrases/plan.md`）；片語表經 `phrases.mjs` 的 `phraseTable` 讀 `data/phrases/phrases.json`（`check-items --phrases` 可改路徑，檔案不存在＝空表）。題量同主題課：每片語一張卡＋9 題（配對題由 App 從單字卡組，不進題庫）。

**片語比對規則**（`scripts/lib/phrase-match.mjs`，檢查器與相似度骨架共用）：
1. 逐字比對，不跨子句（遇 `. , ; : ! ?`、引號、括號斷開）。
2. 每個成分接受詞形變化：ECDICT 詞形表或規則還原的原形＝成分即算（gave up、giving up、looked forward to）；小品詞沒有變化形，give in 不會對到 give up。
3. 片語裡的 `your`／`one's` 代表任一所有格（do your best ↔ did my best）；冠詞照原字。
4. 片語表標 `separable: true` 的，第 1 個成分後可插入 1–3 個字當受詞（pick it up、turn the light on、picked my little brother up）；插入 4 字以上或片語不可分離時不算。
5. 不收插入形容詞或省略冠詞（made an important decision 不算 make a decision）——撰寫時照片語原樣寫。

**檢查器代碼**（只在片語課）：

| 代碼 | 意思 |
|---|---|
| `PHRASE_MISSING` | 片語卡例句沒用到該片語；聽打、聽選音檔、跟讀句沒有任何本課片語；mcq 正解不是完整的本課片語（只填動詞或拆開都不算）；翻譯 hintWords 沒有本課片語，或某個參考答案沒用到提示片語。閱讀不要求 |
| `PHRASE_GLOSS` | 片語卡 glossZh：義項要用全形「；」分隔、受詞位置寫「⋯」（不用 `…`、`...`、半形 `;` `,`）；第一義去括號後不可為空，且要等於片語表 glossZh 的第一義（片語表本身用 `…`，比對時 `…`＝`⋯`） |
| `OVER_LEVEL`（擴充） | 片語課用到片語表中高於本課級距的片語（照片語自己的級距，組成字都低也一樣）。主題課不查片語表 |

所有課的用字級距檢查另加一輪：lexicon 含空格的多字詞也認詞形變化（pertains to＝pertain to）。相似度自查的句型骨架（`similarity-lemma.mjs` 的 `skeleton`）目標為多字詞時以整個片語為單位，後接類別取片語最後一字之後；只出現動詞（give up 卡 vs "gave the book"）不算同目標。

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
# 皆可加 --lexicon <file> --dir <curriculum dir>；build／validate 另可加 --phrases <file>

# 預產發音音檔（TASK-35）：改了題目檔或 data/dict 後補產生（npm test 的 audio.test.mjs 會列出待重產的課）
cd audio-gen && npm ci
node build-audio.mjs --check        # 不載模型，只列待產生／待重產
node build-audio.mjs                # 課程音檔
node build-audio.mjs --dict         # 字典專用包（含連字號的字）
node build-audio.mjs --items ../../app/src/lesson/fixtures/items --out ../../app/src/lesson/fixtures/audio   # e2e 樣本課
```

改分類的流程：編輯 `word-topics.json`（把字移到別的主題列）→ `node scripts/build-curriculum.mjs` → `npm test` → 一起提交分類檔、級距檔與 STATS.md。
