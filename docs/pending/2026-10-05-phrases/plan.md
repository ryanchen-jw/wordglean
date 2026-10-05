# TASK-24 片語學習——第 1 階段規劃

日期：2026-10-05。範圍依創辦人裁示（10-05，選 A）：A2–C1 各級新增片語單元，內容為片語動詞加常用搭配，總量 400–500 個、60–70 課；片語單元插在主題單元之間，要進複習排程，既有 984 課課號不位移；A1 不加。

本階段只產出文件與清單草稿，沒有改動 lexicon、課綱、題庫或 app。

同目錄檔案：
- `phrases-draft.csv`：完整清單草稿，共 468 個。
- `sample.md`：各級 15 個樣本，給創辦人看。

---

## 1. 來源與授權查證

判定規則：查不到授權條款的一律當作不可用；不可用的清單內容，不複製進 repo。

| 來源 | 查到的條款與出處 | 能否商用／改作 | 結論 |
|---|---|---|---|
| PHaVE List（Garnier & Schmitt 2015, *Language Teaching Research* 19(6)） | ① 作者網站 norbertschmitt.co.uk/vocabulary-resources 的 PHaVE 區沒有授權聲明；同頁只有 Vocabulary Levels Test 寫了 "freely available for research and pedagogical purposes"，不涵蓋 PHaVE。② 論文在 SAGE（doi 10.1177/1362168814559798），Nottingham 典藏庫的頁面與檔案回 403，查不到 CC 條款。③ 使用手冊鏡像（meyda.education.gov.il）回 403。 | 查不到 | **不可用** |
| 其他片語動詞頻率表：Gardner & Davies 2007（TESOL Quarterly）、Liu 2011（TESOL Quarterly 45） | 只有期刊論文，查不到附表的授權 | 查不到 | **不可用** |
| PHRASE List（Martinez & Schmitt 2012） | 只在 Text Inspector 的頁面提到（textinspector.com 回 403），查不到授權 | 查不到 | **不可用** |
| Academic Collocation List（Ackermann & Chen 2013） | pearsonpte.com/organizations/researchers/academic-collocation-list/ 頁尾寫 "© 1996–2026 Pearson. All rights reserved, including those for text and data mining and training of artificial intelligence"；官方 PDF（teacherhub.pearsonpte.com，VERSION 3/2026）全文沒有任何授權條款。EAP Foundation 轉載頁也沒有授權。 | 保留所有權利 | **不可用** |
| NGSL 系列（newgeneralservicelist.com） | 寫明 "licensed under a Creative Commons Attribution-ShareAlike 4.0 International License"（NGSL 頁）。但站上列出的 NGSL／NAWL／TSL／BSL／NGSL-Spoken 等都是單字表，**沒有片語或搭配清單**。 | CC BY-SA 4.0 | 可用，但沒有片語可用 |
| Wiktionary「Category:English phrasal verbs」 | en.wiktionary.org/wiki/Wiktionary:Copyrights：CC BY-SA 4.0＋GFDL 雙授權；分類共 5,169 頁 | 可商用、可改作；要 share-alike | 授權可用，但**沒有頻率資訊**，不能拿來挑選或定級。可以在第 2 階段用來交叉核對「這個片語存在、語意對」（只核對，不複製釋義）。 |
| R 套件 `phrases`（github.com/sumanstats/phrases） | 資料爬自 EnglishClub 網站；repo 沒有寫明來源資料的授權 | 來源授權不明 | **不可用** |
| ECDICT（已在用，MIT） | data/CLAUDE.md 規定字典切片「不含空格」，代表原始檔裡有多字詞條目 | MIT | 第 2 階段可以拿來交叉核對中文釋義；本草稿沒有用到 |

**結論：沒有一份查得到授權、又帶頻率的開放片語清單。依規則改由開發端自編**，做法見 §2。

- 草稿是開發端依一般語言知識自己列的，沒有複製任何上面的清單。哪些片語常用、意思是什麼，屬於語言事實；受著作權保護的是特定清單的選編與表述。
- 中文釋義由開發端以台灣用語撰寫。
- 授權建議：自編片語表比照題目文字，採 **CC BY-SA 4.0**。第 2 階段在 `data/LICENSES.md` 加一列，標明「本專案自編」（任務卡 AC #1）。

## 2. 定級方法

**級距＝max(A2, 組成字最高級距, 常見度下限)**

1. **組成字級距**：片語裡每個字取 lexicon 中該字所有詞性的最低級距，也就是它在課綱被排入的那一級。複數和過去分詞先還原成原形（dishes→dish、granted→grant）。片語的級距不低於組成字中最高的那一級，保證學到片語時，每個組成字都已經學過。
2. **常見度下限**：開發端判斷的四層常見度。
   - 核心（下限 A2）：日常口語必備，如 get up、look for、take a photo。
   - 常用（下限 B1）：如 figure out、run out of、make a decision。
   - 進階（下限 B2）：職場、多益、語意較抽象，如 lay off、meet a deadline。
   - 正式（下限 C1）：書面或學術，如 stem from、shed light on。
3. 兩者取高；最低 A2，因為 A1 不加。
4. CSV 的「定級依據」欄寫出計算過程，例如：`組成字最高 B1（decision）；常見度 常用（下限 B1）→ B1`。

調整只往上，不往下，所以組成字一定先學過。代價是像 `do the laundry`（laundry 在 CEFR-J 屬 B2）這類生活片語會被排到 B2，見 §7 第 3 點。

**剔除規則**：組成字不在 lexicon、沒有級距，或屬 C2（課綱不排）的片語不收，因為學習者沒學過那個字。原稿因此剔除 17 個：abide by、adhere to、clamp down on、delve into、dwell on、fend off、gloss over、hinge on、in accordance with、in the meantime、lash out、lay the groundwork、opt out、rein in、set a precedent、sift through、zero in on。

**常見度是開發端判斷，沒有語料庫數字佐證**，因為沒有可用的授權頻率表。第 2 階段如果要客觀佐證，可以查 Google Books Ngram 的公開資料（授權須先確認，本階段未查）。

**去重**：已在課綱裡的多字詞一律不列，例如 fed up、turn to、according to、because of、instead of、used to、have to、each other、next to、out of、owing to、apt to、pertain to、bulk up。lexicon 裡屬 C2 的多字詞（dole out、eke out、mull over、glory in 等）也不列。清單內部沒有重複，這兩點都已用腳本核對。

## 3. 各級數量與比例

| 級距 | 片語動詞 | 搭配 | 合計 | 約幾課（每課 6–8 個） | 主題課數 |
|---|---|---|---|---|---|
| A2 | 71 | 31 | **102** | 15 | 158 |
| B1 | 85 | 54 | **139** | 20 | 269 |
| B2 | 92 | 60 | **152** | 22 | 304 |
| C1 | 54 | 21 | **75** | 11 | 118 |
| 合計 | 302 | 166 | **468** | **68** | 849 |

比例理由：
- **A2 偏多**（相對主題課數）。最常用的片語動詞都是 A1 動詞加小品詞，例如 get up、look for、give up；學習者越早學到，聽說越不卡。
- **B1、B2 最多**。B1 是日常片語動詞的主力；B2 加入多益與職場搭配，例如 meet a deadline、place an order，配合本 app 的多益定位。
- **C1 較少**。這一級以書面、學術片語為主，數量本來就少；C1 主題課也只有 118 課。
- **搭配約占三分之一**。片語動詞是台灣學習者最常卡關的地方，所以占多數；搭配挑「中文直譯會講錯」的，例如 take a photo、make a decision、heavy traffic。也收了少量固定介系詞片語，例如 on time、in advance、on behalf of；這是否算「常用搭配」，見 §7 第 4 點。

## 4. 排課設計

### 4.1 插入方式

**建議：每級 3–6 個片語單元，每單元 3–4 課，依「主題課累計課數」等距插入。** 第 k 個片語單元插在累計主題課數第一次達到「該級主題課數 × k ÷ 片語單元數」的那個主題單元之後，所以最後一個片語單元會落在該級結尾。不採用「每 4 個主題單元插 1 個」，理由：
- 主題單元大小差很多，1 到 10 課都有（例如 b1-u14 只有 1 課、b1-u03 有 10 課）。按單元數插，間距會忽長忽短。
- 每 4 單元插 1 個，B1 就要 10 個片語單元、平均每單元不到 2 課，課程地圖會很碎。

以目前課綱模擬的插入點（插在該主題單元之後）：

| 級距 | 片語單元數 | 插在哪些主題單元之後（括號＝之前累計主題課數） |
|---|---|---|
| A2 | 4（4+4+4+3 課） | a2-u06(42)、a2-u13(80)、a2-u20(120)、a2-u27(158，級末) |
| B1 | 5（各 4 課） | b1-u07(57)、b1-u17(113)、b1-u27(162)、b1-u37(224)、b1-u43(269，級末) |
| B2 | 6（4+4+4+4+3+3 課） | b2-u08(52)、b2-u16(106)、b2-u24(153)、b2-u41(206)、b2-u47(255)、b2-u53(304，級末) |
| C1 | 3（4+4+3 課） | c1-u10(48)、c1-u28(79)、c1-u39(118，級末) |

共 18 個片語單元、68 課。

**先修規則（排課器硬性檢查）**：片語只能排在「它的同級組成字所在的課」之後的片語單元。模擬結果（`phrases-draft.csv` 對照目前課綱）：
- 468 個中有 449 個，在該級第一個片語單元時組成字就都已教過。
- 其餘 19 個要排得晚一點。最晚的例子：A2 的 belong to（belong 在第 147 課）和 get lost（lost 在 141 課）只能排進級末的片語單元；B1 的 calm down（216）要排到第 4 個片語單元。
- 最後一個片語單元一定要放在級末，否則這類片語排不進去。曾試過把最後一個插入點放在 a2-u22（129 課），belong to 和 get lost 就沒有位置可排，所以改成現在的算法。
- 先修規則可行，不會讓單元排不滿。

**單元內排法**：同級片語先依先修規則決定最早能排哪個單元，再依「片語動詞先、同一動詞放同一課做對比（give up／give in／give out）、常見度高者先」排序後切課。單元標題用「常用片語（一）（二）⋯」。主題欄只用來寫例句情境，不用來分單元，因為每個主題在一級裡只有幾個片語，切不出合法的課。

### 4.2 ID 方案

**建議：片語單元用獨立編號 `b1-p01`，小課 `b1-p01-l01`，題目 `b1-p01-l01-q01`。** 既有 `-uNN` 課號全部不動。

App 端已核對（背景調查結果，以下行號為調查時的位置）：
- 只有 `levelOfLessonId` 用到 `slice(0,2)`（app/src/curriculum/curriculum.ts:45-48），`-p` 編號不影響。
- 路由 `/^\/lesson\/([a-z0-9-]+)$/`（routes.tsx:23）可以接受 `-p` 編號。
- 題目檔用檔名比對（lesson/load.ts:15-16）。
- 進度用完整課號當鍵（Dexie `courseProgress`、Supabase `course_progress.lesson_id text`，沒有格式限制）。
- 「下一課」取陣列順序中第一個沒上過的課（curriculum.ts:58-64），「第 N 課」也取陣列位置。

所以**級距檔 `units` 陣列直接依顯示順序排**，片語單元放在對應的主題單元之後即可，App 不必另外處理排序。

其他方案為何不選：
- 接在後面編號（b1-u44⋯）：編號順序和顯示順序不一致，之後再增刪主題單元時會撞號，會讓人誤以為是主題單元。
- 子編號（b1-u06a）：同樣要改 schema，語意又更模糊。

**排課器做法**：
- 新增人工維護的 `content/curriculum/phrase-units.json`，內容是每級片語單元的插入點（`after: "b1-u06"`）與片語分課。
- 插入點寫死，不在每次建置時重算，避免主題課數一變，片語單元就跟著移動。
- `allocate()` 的主題單元編號邏輯完全不動；另寫插入與驗證函式，產物照樣是「級距檔＝排課器產出」。這符合「架構改動走 additive 路線」的原則。

**要改的地方**：
- schema 正規式：curriculum-level 單元與小課、lesson-items 的 lessonId 與題目 id，都改成 `-(u|p)[0-9]{2}`。
- 單元新增欄位 `kind: "phrase"`；`additionalProperties:false` 要一起放寬。
- validator：片語課的字改查片語表，新增 `UNKNOWN_PHRASE`、`PHRASE_PREREQ`；`DUPLICATE_INTRO` 範圍擴及片語。

**App 端影響與處理**：
- 課程地圖：片語單元加「片語」標籤即可，渲染邏輯不用改。
- 今日動線：在中段插入新單元後，已經上到後面的使用者，「下一課」會跳回前面還沒上的片語課；已完成整級的使用者會從 levelDone 變回有下一課。目前**還沒上線**（只有創辦人測試帳號），建議接受這個行為，不另外處理。上線後若再追加，再另訂規則，例如「下一課」略過最遠進度之前的片語課。
- 進度：沒有「整級完成百分比」，只有單元 done/total，不受影響。

### 4.3 資料形狀

**建議：片語另存 `data/phrases/phrases.json`，不併入 `lexicon.json`。**

| 方案 | 優點 | 缺點 |
|---|---|---|
| **A. 獨立檔（建議）** | 授權清楚（自編、CC BY-SA 4.0，自成一列）。lexicon 仍是「來源表的位元組可重現衍生物」，Oxford 白名單守衛不必動。 | App 和 content 要多讀一個檔 |
| B. 併入 lexicon（`cefrSource:"linguaapp"`） | App 的 `lex.get` 自動有釋義與收藏 | lexicon 會混入自編資料，逐欄位授權變複雜；而且 validator 的 `MISSING_WORD` 會要求片語也進 word-topics，排課器會把片語排進主題單元，必須另外排除 |

欄位草案：
```json
{ "phrase": "give up", "type": "pv", "cefr": "A2", "glossZh": "放棄", "components": ["give", "up"], "separable": true, "topic": "feelings-personality" }
```
- `separable` 用來處理受詞可插在中間的情況（give it up），影響題目檢查。
- 鍵就是小寫的片語字串。

**沿用既有多字詞機制的可行性**：
- 課綱 `words` 本來就允許空格（已有 141 個多字詞）。
- FSRS 卡片鍵是 `word.trim().toLowerCase()`（repo.ts:36），"give up" 可以直接當鍵，Supabase `word_pool.word_id text` 也沒問題。
- TTS 會整串唸，STT 和答案比對是整句比對。
- 唯一要補的是 App 的查表入口：釋義、收藏卡、大小寫顯示目前都查 `lex.get`，要改成查「lexicon ∪ 片語表」合併的對照表，只改入口一處。

**字典查詢（點字查義）**：
- 目前斷詞只切單字（dict/tokenize.ts:8），字典切片也不收含空格的詞條。
- 建議另做片語索引，約 470 筆、很小，可以整包載入。使用者點句子裡的某個字時，如果它和相鄰的字（含詞形變化，例如 gave up、gives up，以及可分離的 give it up）組成已知片語，彈窗先顯示片語義，再顯示單字義；收藏鍵用片語。

**既有 bug（第 2 階段順手修，不另開卡，等執行長決定）**：WordsScreen.tsx:80/84 用空格 `join` 後再 `split`，會把 "ice cream"、"fed up" 這類多字詞拆開，導致查不到釋義。現有 141 個多字詞已經受影響。

## 5. 題型對應

目前題型（item-rules.mjs:5-13）：每課 listenType 1、listenChoice 1、shadowing 2、mcq 2、reading 1、translate 2、makeSentence 0，再加每個新字一張 wordCard。**App 沒有「配對」題型**，見 §7 第 5 點。

| 題型 | 套用到片語 | 要調整的地方 |
|---|---|---|
| 單字卡 wordCard（中文四選一） | 直接可用，整串顯示、整串發音 | 干擾選項優先挑**同動詞的其他片語**的中文義（give up／give in／give out），學習效果最好 |
| 選擇 mcq（一個 `____`） | 空格填整個片語（已有先例：b2-u52-l08 的 fed up） | 題幹裡的片語要允許詞形變化；可分離片語不出「拆開」的句子 |
| 聽打 listenType、聽選 listenChoice | 句子層級，不用改 | 句子要含目標片語 |
| 跟讀 shadowing | 句子層級，不用改 | 同上 |
| 閱讀 reading | 不用改 | — |
| 翻譯 translate（`hintWords`） | 提示詞放整個片語（已有先例：c1-u36-l06 的 turn to） | 參考答案要含目標片語，允許詞形變化 |

內容工具要補的三個缺口：
1. **`english.mjs` 的 `extractMultiwords`（47-61）不處理詞形變化**。"gave up"、"gives up" 對不到片語，會退回逐字定級。要加入對應詞形變化（含可分離片語）的比對，否則級距檢查和「本課片語有出現」都會失準。
2. **`similarity-lemma.mjs:88-89` 的 `skeleton()` 只取目標詞的第一個字**。"give up" 和 "give in" 會被視為同一個目標，相似度自檢會誤判。要改成用整個片語。
3. **產題 prompt**：要另寫片語課版本，指定使用 `glossZh` 那個義項、可分離片語的位置規則，並加上同動詞片語對比。

## 6. 第 2 階段之後的工作量與分工

| 工作包 | 內容 | 估計 | 依賴 |
|---|---|---|---|
| W1 資料 | 依創辦人回饋定稿清單；`data/phrases/phrases.json`＋schema＋測試；`data/LICENSES.md` 加一列；可選：用 Wiktionary 與 ECDICT 交叉核對語意 | 0.5 天 | 創辦人看完樣本 |
| W2 排課器 | `phrase-units.json`、插入與先修檢查、schema 正規式、validator 新錯誤代碼、STATS、「級距檔＝排課器產出」測試 | 1 天 | W1 |
| W3 內容工具 | 支援詞形變化的片語比對、相似度 skeleton 改用整個片語、check-items 片語課規則、片語課 prompt | 0.5–1 天 | W1（可與 W2 並行） |
| W4 題庫 | 68 課出題（開發端撰寫），走三關審查（`check-items --require-judge`） | 1.5–2 天 | W2、W3 |
| W5 App | 合併對照表入口、片語單元標籤、點字查片語、答題前隱藏答案改成支援片語、收藏片語、修 WordsScreen bug、e2e（webkit＋chromium 模擬） | 1–1.5 天 | W2（可與 W4 並行） |

- 合計約 **4.5–6 個工作天**（worker 時間）。課綱報告原估「2–3 天」，偏低：當時沒算到內容工具的三個缺口和 App 的點字查片語。
- 建議派法：W1 單獨先跑；W2 與 W3 並行，兩個 worker、不撞檔；W4 依級拆 2–3 個 worker；W5 一個 worker，等 W2 合併後開工。
- 成本：W4 的第三關 judge 若走 app 的 OpenRouter 金鑰，跑前要先報成本估計並設確認閘。

## 7. 待裁示

**給創辦人**
1. 看 `sample.md` 的 60 個樣本：中文意思、級距、有沒有要加或要拿掉的。
2. 插入方式：建議 18 個片語單元、每單元 3–4 課、依課數等距插入；原草案是「每 4 個主題單元插 1 個」，約 38 個小單元。
3. 定級要不要允許手動下調。例如 `do the laundry` 因為 laundry 屬 B2 被排到 B2。允許下調的代價是：學到片語時，組成字可能還沒學過。
4. 收錄範圍：on time、in advance、on behalf of 這類固定介系詞片語，算不算「常用搭配」？草稿約收 40 個。
5. 題型：App 沒有「配對」題型。建議沿用現有的單字卡、選擇、聽、跟讀、翻譯、閱讀，不新增配對題。

**給執行長**
6. 資料形狀：獨立 `data/phrases/phrases.json`（建議）或併入 lexicon。
7. 自編片語表的授權：CC BY-SA 4.0（建議）。
8. 中段插入後，已上到後面的帳號「下一課」會跳回前面的片語課。建議上線前接受、不處理。
9. WordsScreen 的多字詞 bug：併入 W5 一起修，或另外處理。

---

## 8. 第 2 階段 W1／W2 定稿（2026-10-05）

依創辦人裁示（10-05「照建議」）與執行長裁示：資料獨立放 `data/phrases/phrases.json`（CC BY-SA 4.0，已登記 `data/LICENSES.md`）；18 個片語單元、68 課；固定介系詞片語納入；中段插入造成「下一課」跳回片語課，上線前接受。

### 8.1 手動下調清單

逐一檢查 468 個片語：只有 2 個的級距是被組成字拉高的（定級依據寫「依組成字上調」），其餘 466 個的級距都由常見度下限決定、組成字不高於片語級距，不在下調範圍。兩個都屬生活常用，全部下調：

| 片語 | 原級距 | 下調後 | 拉高它的組成字 | 理由 |
|---|---|---|---|---|
| do the laundry | B2 | A2 | laundry（B2） | 日常家務，和已在 A2 的 do the dishes、do homework 同一類；整個片語當一個單位教，學習者不必先學 laundry |
| hang out | B1 | A2 | hang（B1） | 青少年與朋友間最常用的說法之一（約朋友出去玩），A2 的家人朋友主題就會用到；整個片語當一個單位教 |

資料上以 `downgradedFrom` 標示；validator 只對有標的片語放行「組成字級距高於片語」（`PHRASE_PREREQ`），`data/tests/test_phrases.py` 鎖住下調清單只有這兩個。課綱單字不搬動。

### 8.2 資料欄位定稿

- `components`：依序對應片語每個字的 lexicon headword；字本身有級距就用本身（lay off 用 lay，不還原成 lie），否則用 ECDICT 詞形表的原形（dishes→dish、costs→cost）。
- `separable`：受詞可插在片語中間（give it up、take it into account、give sb a ride）。依片語釋義所指的義項判斷，共 146 個；屬開發端判斷，W3 寫題目檢查時可再調整。
- `topic`：沿用草稿，只供例句情境；content 測試確認都是 topics.json 的主題。

### 8.3 排課結果

- 插入點照 §4.1 公式重算，與 §4.1 的表完全一致；`content/curriculum/phrase-units.json` 寫死插入點與分課。
- 分課做法（一次性產生，之後人工維護）：先算每個片語最早能排的片語單元（同級組成字已教過）；依單元順序填課，晚到的片語先占位，其餘照草稿順序（常見度高者先）；單元內片語動詞在前、同動詞相鄰，再平均切成每課 6–7 個。
- 先修規則讓 18 個片語排得比第一個片語單元晚（§4.1 估 19 個，差異來自組成字改用詞形還原後的實際 headword）：A2 的 belong to、get lost（級末）、make a mistake（第 3）、get dressed（第 2）；B1 的 calm down、get rid of、waste time（第 4）、make a reservation、on foot（第 3）；B2 的 go bankrupt、make a profit、out of stock、sign a contract、stock up on、submit an application、work overtime（第 4）、phase out、wipe out（第 2）。
- 各級：A2 4 單元 15 課 104 個、B1 5 單元 20 課 138 個、B2 6 單元 22 課 151 個、C1 3 單元 11 課 75 個。
