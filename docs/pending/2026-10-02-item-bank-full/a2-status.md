# A2 全量撰寫狀態（TASK-9）

> 撰寫者：開發端 Claude（author `claude-dev`），依 `content/prompts/claude-dev.authoring-guide.md`＋`gen-lesson.v3.md` 硬規則，另套用執行長 2026-10-02 兩次補充裁示（A1 第 1、2 批審查歸納）。不呼叫任何外部 LLM，花費 $0。
> 撰寫起訖時間以帳本 `content/items/_runs/claude-dev-pilot.json` 為準。

## 第 1 批：a2-u01～a2-u07（46 課、776 題）

| 單元 | 主題 | 課數 | 狀態 |
|---|---|---|---|
| a2-u01 | core-words 基礎常用字 | 9 | 撰寫完成、檢查器 0 錯 |
| a2-u02 | numbers-time 數字、時間與日期 | 4 | 同上 |
| a2-u03 | describing-things 描述事物（一） | 8 | 同上 |
| a2-u04 | everyday-actions 常用動作（一） | 9 | 同上 |
| a2-u05 | family-friends 家人與朋友 | 5 | 同上 |
| a2-u06 | feelings-personality 情緒與個性（一） | 7 | 同上 |
| a2-u07 | appearance-clothes 外表與衣著 | 4 | 同上 |

- 撰寫起訖：2026-10-02 10:58Z～12:35Z（含依兩次補充裁示回頭自查重寫 u01～u06）。
- 第②③關：已審（2026-10-02，`t9/a2b1-rulings.md`）。已寫入判題、修第②關 42 條（40 條修、2 條判定不改）、第③關 FIX 34 條、雙答案 1 題、新規則「每課至少一題 mcq 四選項同詞性」46 課全套用。對照表：`a2-batch1-changes.md`。
- 檢查器：`check-items --require-judge` 對本批 46 課全綠；`npm test` 148 項全過。
- 最終複審（`t9/a2b1-final.md`，FIX 12 條）：全修，記為「執行長最終複審修正：」，commit b79df44。依 a2b2 裁示複查 used to（u02-l03）、fix 動詞（u07-l01），題目內容已無。
- 狀態：最終複審修正完成，待執行長看 diff 定稿。

### 套用的補充裁示與自查方式

| 裁示 | 做法 |
|---|---|
| 評分要點一律「例如…」、列其他正確結構、不與參考答案矛盾 | 逐條撰寫時處理；第 1 批前 5 課回頭改寫 |
| 正解位置不可預測（S1／G1） | 每題位以 sha256(題 id) 取位置；單課違規整課改 sha256(題 id#n) 逐次重抽；單元違規時對該單元某一課提高 n 重抽（a2-u01-l09 n=1、a2-u04-l09 n=8；其餘多為 n=0，a2-u01-l05、a2-u02-l04、a2-u07-l03 為 n=1，a2-u04-l04 為 n=2）。重排腳本斷言選項集合、正解文字、optionGlossZh 不變。全級 mcq 第 2 題−第 1 題（mod 4）分布 {0:5, 1:7, 2:15, 3:19}（最高 41%）；閱讀第 2 小題−第 1 小題 {0:11, 1:22, 2:13}（最高 48%）——皆 <60% |
| 目標字除單字卡外至少 1 題句子情境（S2） | 乾跑工具逐課檢查 listenType／shadowing／mcq 題幹＋正解／閱讀／翻譯與造句參考答案（聽選音檔不計） |
| 補情境句不可與單字卡例句雷同；造句參考答案與要點必含目標字 | 稽核腳本以詞集合 Jaccard ≥0.45 抓雷同，改掉約 40 處；剩 2 處見下方「保留」 |
| 單字卡釋義與本課其他題詞義一致；名動兩義並列 | offer 改「提供；提議」、suit「西裝；適合（動詞）」且本課有動詞題；calendar、across、itself、exactly 等依課內用法調整釋義 |
| 避醫療建議、戰爭災難死亡等沉重題材 | 換掉「火勢控制住」「沒有人受傷」「小孩不懂火的危險」等句 |
| 專有名詞全列 properNouns、不用撞英文字的名字 | 避開 Lily、Max、Mark、Grace 類名字；稽核腳本檢查 properNouns 無一有 lexicon 級距 |

### 保留未改（請審查官判斷）

- a2-u01-l04 upon：單字卡「Once upon a time, a king lived in a castle.」與閱讀開頭「Once upon a time, a little bird…」同一固定片語。upon 在 A2 實際只會以 once upon a time 出現，故保留。
- a2-u01-l03：稽核抓到的 although／Actually 句屬詞集合巧合，不是雷同。

## 第 2 批：a2-u08～a2-u16（48 課、807 題）

| 單元 | 主題 | 課數 | 狀態 |
|---|---|---|---|
| a2-u08 | home 居家生活 | 6 | 撰寫完成、檢查器 0 錯 |
| a2-u09 | daily-routine 日常作息 | 4 | 同上 |
| a2-u10 | food-drink 食物與飲料 | 9 | 同上 |
| a2-u11 | shopping 購物 | 5 | 同上 |
| a2-u12 | places-town 城鎮與地點 | 5 | 同上 |
| a2-u13 | getting-around 交通與旅行 | 5 | 同上 |
| a2-u14 | body-health 身體與健康 | 4 | 同上 |
| a2-u15 | hobbies-leisure 休閒與嗜好 | 6 | 同上 |
| a2-u16 | sports 運動 | 4 | 同上 |

- 累計：u08～u15 為 44 課，未滿 45，所以延伸到 u16，共 48 課。
- 撰寫起訖：2026-10-02 12:42Z～14:18Z。中途收到第 1 批審查結果，先修第 1 批，再依同類問題自查第 2 批已寫的 11 課（u08、u09、u10-l01）並修正後才繼續寫。
- 檢查器：`node scripts/check-items.mjs` 對 a2 全部 94 課全綠，含 ANSWER_POSITION／_UNIT／_LEVEL；全 repo 110 課全綠。尚無判題，待第②關。
- 正解位置分布（全 A2 94 課）：mcq 第 2 題−第 1 題（mod 4）為 {0:18, 1:18, 2:30, 3:28}，最高 32%；閱讀第 2 小題−第 1 小題為 {0:24, 1:39, 2:31}，最高 41%。單元違規重抽：u08-l04 n=1、u09-l03 n=6、u12-l05 n=2、u15-l05 n=3；u10-l03、u13-l04、u16-l02、u16-l04 另因單課違規 n=1。
- 套用規則：除第 1 批的各項裁示外，每課至少一題 mcq 四個選項同詞性、都能填入空格，只能靠詞義判斷；非目標字一律檢查詞義級距（自寫掃描腳本，列出「某詞性 >A2、另一詞性 ≤A2」的字逐一人工判斷）。
- 第②③關：已審（2026-10-02，`t9/a2b2-rulings.md`）。
  - 已寫入判題 48 課；盲答 240 題位全一致。
  - 第②關 50 條：45 條修、4 條不改、1 條由同課他處解決。
  - 第③關 FIX 31 條全修。
  - 疑似依裁示處理。
  - 新裁示：主權表述、used to／fix、handicapped、drug、lyric、MP3、題幹洩題、exchange 換貨、參考答案主詞。
  - 情境句雷同自查：共同實詞 ≥60%，本批 99 處命中修到 0。
  - 對照表：`a2-batch2-changes.md`；commit 3e128c5。
- 檢查器：第 1、2 批 94 課 `--require-judge` 全綠；全量 244 課全綠；`npm test` 156 項全過。
- 盲答後內容有改的選擇題有 39 題，沒有再送盲審，題號列在對照表開頭。建議驗收時抽盲答。
- 最終複審（`t9/a2b2-final.md`）：72 條全修，另外修了重新盲答提出的 4 條語言問題，commit 35ae8af。
  - 其中 2 條報告建議句改上去後又和同課別題撞情境，再微調（u14-l03 ill、u10-l05 boil）。
  - lyrics 題改用換題幹。理由：照報告把選項改成複數，會讓檢查器的片語比對失效。
  - 執行長抽審後改了 u11-l02-q12 的雙答案：干擾項 budget 改成 gate，commit 4a58219。
- 狀態：執行長已定稿（2026-10-03）。之後只因「正解長度均衡」與「內容界線」兩項全級裁示再改，改法見 `a2-length-balance.md`。

### 第 2 批自評疑慮

- **u14 身體與健康**：pill、drug、patient、die、death、cigarette、handicapped 是課綱目標字。我盡量寫成中性情境，例如植物枯死、故事裡國王的死、藥廠生產藥品、停車場的身障車位，也沒有寫用藥或看醫生的建議。題材是否太沉重，請第③關確認。handicapped 是較舊的說法，照課綱教。
- **宗教相關字**：u12-l05 mosque 只寫成建築（古老清真寺、三百年歷史）；u13-l04 pilgrim 釋義寫「朝聖者；長途步行的旅人」，例句只說古道，不提信仰。
- **英式／美式用字並存**：petrol、motorway、car park、crisp、cheque、pence 照課綱教，釋義標「英式說法」。
- **u12-l03**：用台灣地理常識出題（基隆在北部、高雄在南部、花蓮在東岸）；mcq 用「東京是日本的首都」，避開台灣首都這類政治敏感說法。

## merge main 與 opencc 豁免（2026-10-02）

- **merge main**（837a688）：commit 830219f。
  - 帳本以 lessons 聯集合併：ours 110 課＋theirs 141 課，合計 235 課，無衝突。
  - Ms 已不需要列為專有名詞，從 u05-l05 的 properNouns 移除。
  - 合併後 A2 94 課全綠，含 ANSWER_POSITION_PATTERN。
- **opencc 誤擋豁免**（授權）：commit 14789f6。
  - TWP_ACCEPTED 新增 家具、攀岩、家什、祕書，只新增、未改既有內容。
  - 先寫會紅的測試再改到綠。
  - 加入的是撰寫時的輸入形，不是 opencc 的輸出形。

## 第 3 批：a2-u17～a2-u27（64 課，A2 寫完）

| 單元 | 主題 | 課數 | commit |
|---|---|---|---|
| a2-u17 | school-learning 學校與學習 | 6 | 2d1741c（自查 22dca2e） |
| a2-u18 | weather-nature 天氣與自然 | 7 | dad577d、2f93eab |
| a2-u19 | public-services 生活服務 | 7 | c7b9267 |
| a2-u20 | language-communication 語言與溝通 | 6 | 1bb12bf |
| a2-u21 | media-culture 媒體與文化 | 3 | c816f76 |
| a2-u22 | quantity-degree 數量與程度 | 6 | ca8ab2e |
| a2-u23 | thoughts-opinions 想法與意見 | 5 | 231bda3 |
| a2-u24 | change-cause 變化與因果 | 3 | 528a7e1 |
| a2-u25 | describing-things 描述事物（二） | 7 | fcf4a2e |
| a2-u26 | everyday-actions 常用動作（二） | 8 | 6eeb190 |
| a2-u27 | feelings-personality 情緒與個性（二） | 6 | 0783fc5 |

- A2 全級 158 課（課綱全部）都寫完了。第 3 批已寫入第②關判題並完成第②③關修正（見下方「第 3 批第②③關處理」）。
- **u19 敏感字**（attack、gun、murder、killer、slave、terrorist、invade、armed、violent、military、political 等）全部寫成中性情境：
  - 玩具槍、玩具士兵、球隊進攻。
  - 推理小說與電影裡的謀殺案、兇手。
  - 觀光客湧入小鎮、蟲子入侵廚房。
  - 「別當手機的奴隸」；機場安檢與電影情節裡的恐怖份子；政治學系、政治新聞。
  - 沒有寫戰爭、暴力過程或任何主權表述。
- **內容界線**（2026-10-03 追加：不寫理財投資、飲食建議、博弈；具體規定改中性）：u20 之後照寫。全級掃描結果見 `a2-length-balance.md`。
- **選項長度**（2026-10-03 追加：正解不可是唯一最長）：u27 起照寫；之前寫的課在全級修正時一併處理。
- **情境對照表**：全批（u17～u27）在 `a2-batch3-context-tables.md`，2026-10-03 依裁示以現行檔案逐組重判重做（含「換了哪幾項」）。

自查依據：a2b2 裁示，以及執行長追加的兩次規則（第 3 批起套用），內容如下。

- 雷同門檻：先詞形還原，共同實詞 ≥40% 的列入人工複查，主詞、情境、句型三者至少換兩項。
- 單元間複用：每單元第 2 課起，閱讀至少帶入 1 個前面單元的字。
- 參考答案也算情境句。
- 每課附情境對照表。

自查結果與改動：

- **雷同**：≥40% 初掃 39 組。人工複查後，改寫單字卡例句 30 餘處，加上 2 處跟讀與參考答案。改完再掃剩 14 組，逐組確認三者至少換兩項（見下表）。
- **情境對照表**逐列檢查時，另外改了下面這些字的單字卡：
  - u17-l01：campus、semester、education
  - u17-l02：explain
  - u17-l04：exam
  - u17-l06：plural、capital letter、high school
  - u18-l01：earthquake、recycle
  - u18-l02：thunderstorm、seaside、plant、nature、rock
  - u18-l03：heat、planet、wild
- **單元間複用**：只算前面 A2 單元的目標字，不算 next／last 這類功能性字。
  - 原本缺的 4 課已補：u17-l03 company（u09）、u17-l04 mug（u10）、u17-l05 sleepy（u09）、u18-l03 camping（u15）。
  - 其餘各課本來就有：u17-l02 simple、slowly（u03）；u17-l06 capital（u12）；u18-l02 fresh（u03）、interest（u15）。
- **評分要點寫死**：改成「例如」，共 8 處：u17-l01、l02、l03、l04×2、l05、l06，以及 u18-l01。
- **其他**：used to、fix 動詞、政治主權表述、參考答案主詞都已逐課檢查，無違規。u18-l03 拿掉 Mars 後，properNouns 清空。
- **驗證**：每課改完都重跑 sha256 重排、乾跑、稽核，再 write；檢查器 0 錯。

## 第 3 批第②③關處理（2026-10-03，裁示 a2b3-rulings.md）

- **判題**：盲答 320 題位以選項文字對應現行索引，全部一致、0 多解，寫入 64 課 judge。
- **第②關 92 條 issue**：全數處理。其中「單題正解最長」22 條依裁示不逐題修，交全級長度名次分布規則統一處理；其餘逐條修正或依裁示說明理由，記在各課 judge.resolvedAfterFinalReview（說明開頭「執行長第②③關裁示修正：」）。
- **第③關 FIX**：a 卷 17 條、b 卷 26 條（選項長度以外）全修；選項長度類同上，交名次分布規則。
- **疑似**：放寬評分要點類照建議改；語感類逐條判斷，採用的已修，不採用的理由：
  - a 卷 4（tradition）：單字卡與 mcq 主詞（動名詞 vs it）、情境（農曆新年 vs 家裡生日）都不同，合格。
  - a 卷 5（terrorist 跟讀）：機場安檢是日常情境，沒有描寫攻擊過程，維持。
  - a 卷 11（court、speaker、column 單字卡示範非主題義）：兩義都是 A2、釋義並列，其他題已示範主題義，維持。
  - b 卷 S19（lend 評分要點）、S27（amused 冠詞，混合詞性題）：維持。
- **u26 詞性與單元主題衝突**（裁示：教課綱該級列的詞性，動詞義高於 A2 不教）：
  - fix、knock、tear、escape、tip、rush、search、tie、slide、display、trick、float、spread、burn、wave 在 lexicon 都是名詞 A2、動詞 B1 以上，維持教名詞；tear 同課只取「眼淚」一義，escape 釋義改成名詞義「逃離；逃避的方式」。
  - **請執行長處理**：u26 單元名稱「常用動作（二）」和實際教的字（多為名詞）不符，屬課綱命名問題，我不得改 curriculum/。
- **其他**：weep（lexicon 只列名詞 A2）、principal（形容詞 A2）、kindly（形容詞 A2）照課綱該級詞性維持。祕／秘依檢查器的 opencc 台灣標準統一為「秘」。
- **長度改動重新盲答的 2 條 issue**（a1-u07-l03-q14#1、a2-u15-l01-q15#1）已在名次分布修正時一併改。

## A2 全級：聽選正解位置分布（執行長裁示 2026-10-03）

裁示：題數 ≥30 的位置若占比 <10%，就重抽。統計時間是 A2 全部 158 課寫完、長度均衡修正之後。

| 選項數 | 題數 | 位置 0 | 位置 1 | 位置 2 | 位置 3 |
|---|---|---|---|---|---|
| 3 選 1 | 152 | 60（39.5%） | 42（27.6%） | 50（32.9%） | — |
| 4 選 1 | 6 | 2 | 2 | 0 | 2 |

- 3 選 1：沒有位置低於 10%，不需重抽。
- 4 選 1：只有 6 題，未達題數門檻。
- 撰寫途中，單元層級規則（ANSWER_POSITION_UNIT）擋下時已重抽，見下列；各 n 都用 sha256(id#n) 找到能同時滿足單課、單元、全級規則的值。
  - u18：l06 n=3。
  - u19：l06、l07 n=1。
  - u25：l01 n=6、l03 n=8、l05 n=1、l07 n=4。
  - u26：l06 n=2。

## 正解長度均衡（執行長裁示 2026-10-03，最終版：長度名次分布）

- 規則與修正前後的分布表、改到選項的題 id，都在 `a2-length-balance.md`。
- 最終規則：選項依字元數排名次，正解落在每個名次的比例都在隨機 ±12pp 內（三選一 21–45%、四選一 13–37%，≥20 題）；reading、listenChoice 另有單題異常值限制（任一選項 >其餘平均 2 倍或 <一半），mcq 不套用。

## 備註

- a2-u01-l04 帳本缺 `startedAt`（漏跑 `start`；實際約 11:03Z 開始，接在 l03 之後）。
- 收到兩次補充裁示後重寫 u01～u06，帳本 `rounds` 多 1～3 輪、`finishedAt` 為最後重寫時間。

## 建議（給執行長）

1. **`ms.` 的檢查器斷詞**：headword 是 `ms.`（含句點），斷詞後是 `Ms`，查不到級距會報 UNLEVELED；a2-u05-l05 先把 `Ms` 列進 properNouns 過關。A1 的 `mr.`／`mrs.` 若有同樣情形，建議在 `english.mjs` 或 allowlist 處理，不要靠 properNouns 繞。
2. **不規則複數查不到級距**：`grandchildren`（grandchild 為 A2 目標字）報 UNLEVELED，撰寫時只好避開複數。
3. **opencc 誤擋的台灣常用詞**（都改寫繞過，未加豁免）：打開、圖像、查看、了解、通信、設備、高級。建議評估加入 `TWP_ACCEPTED`。
4. **lexicon 級距偏高、與語感不符的常用字**（撰寫時避開）：sometimes B1、friendly B2、proud B1、foot B1、suddenly B1、gym B1、loud B1、hopeful B1。
5. （第 2 批新增）**opencc 其他誤擋**：「你家什麼」被當成「家什→傢什」；「家具」被改成「傢俱」；「攀岩」被改成「攀巖」；「祕書」被改成「秘書」（但「祕密」已豁免）。撰寫時已照檢查器改寫，建議一併評估豁免。
6. （第 2 批新增）**T-shirt 斷詞**：tokenize 以連字號切字，T-shirt 會被切出 `T` 而報 UNLEVELED；a2-u11-l05 改用 shirts 避開。A1 裁示要求一律寫 T-shirt，建議檢查器把 T-shirt 當一個字。（第 1 點的 Ms 與本點已由 main 837a688 解決；第 5 點的 4 詞已依授權豁免。）
7. （第 2 批審查後新增）**課綱 headword `mp3 player`**：
   - word 欄位必須和課綱一致（檢查器 COMPOSITION），所以 a2-u15-l06 的 word 仍是小寫。
   - 學習者看得到的例句、閱讀、選項、釋義都已改成大寫 MP3。
   - 建議課綱改成 `MP3 player`（我不得改 curriculum/）。
8. （第 2 批審查後新增）**lexicon 詞性級距和裁示教法衝突的字**：
   - lyric：lexicon 只收形容詞 A2。依裁示改教名詞 lyrics「歌詞」，檢查器以最低級放行。
   - fry：名詞 A2、動詞 B1，維持名詞 fries。
   - joke（動詞 B1）、smile（動詞 B1）、loud（B1）、season（B1）、onto（B1）、friendly（B2）：撰寫時都避開了。
9. （第 2 批審查後新增）**聽選正解位置偏斜**：第 2 批 listenChoice 很少把正解放在中間（第③關 b S14）。ANSWER_POSITION 系列規則都綠，這次的裁示沒有指示要處理，請裁示要不要加「中間位置至少占 25%」之類的規則。
10. （新增）**雷同自查腳本**：我用的是 tmp 的 sim.mjs，未收進 repo，因為這次沒有授權改 scripts/。
    - 做法：詞形還原、片語目標字算一個詞、共同實詞 ÷ 卡片實詞，門檻可調 0.6／0.4。
    - B1 已獲授權收進 `content/scripts/selfcheck-similarity.mjs`，建議 A2 之後共用那支。
