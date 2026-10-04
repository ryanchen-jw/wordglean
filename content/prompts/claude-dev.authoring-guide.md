# 開發端撰寫準則（claude-dev.authoring-guide）

> 給 TASK-9 全量撰寫用。2026-10-02 創辦人 G5 裁示：題庫由開發端 Claude 逐課撰寫，經檢查器與獨立審題員把關；免費 LLM 只用於使用者端即時批改。
> 本檔＝`gen-lesson.v3.md` 的全部硬規則（題型與題數、用字限本課可用字表、繁體台灣用語、句長、選項語言、四選一欄位、專有名詞宣告）＋pilot（a1-u01、b1-u01，16 課）三輪獨立審題抓到的問題類型。每類附 pilot 實例：✗＝被審出的寫法，✓＝修正後。
> 工具：`node scripts/author-lesson.mjs start|write <lessonId> …`（記開始時間、補題號、跑檢查器、寫帳本）。檢查器 0 錯是撰寫的一部分；以下各類是檢查器抓不到、要靠撰寫時自己守住的。

## 1. 評分要點（rubricZh）

評分要點給批改者用：只寫語言重點，**不得比參考答案嚴、不得寫死單一字詞、要收常見正確變體**。寫完後自問：「有沒有一句正確的答案會被這條要點判錯？」

| 問題 | ✗ 原寫法 | ✓ 修正 |
|---|---|---|
| 寫死句型 | 「句子有主詞和 be 動詞」（than 造句） | 「句子有主詞和動詞（be 動詞或一般動詞都可以）」——I run faster than my brother. 也正確 |
| 寫死單一動詞 | 「昨天的事用過去式 went」 | 「昨天的事用過去式（例如 went to bed late、stayed up late）」 |
| 寫死位置 | 「only 放在數量前面」 | 「only 可放在數量前（only one pen）或動詞前（I only have…）」 |
| 排除省略寫法 | 「but 前後兩部分都有主詞和動詞」 | 「but 後面可以是完整句子，也可以是省略寫法（but not bananas）」 |
| 排除其他結構 | 「after 後面接名詞（school、dinner）」 | 「after 後面可接名詞、動名詞或子句（after eating、after I eat dinner）」 |
| 文法說明錯誤 | 「（meanwhile）兩件事的時態要一致」 | 「兩件同時進行的事時態要合理（可用過去簡單式或過去進行式）」 |
| 語意說明不精確 | 「（nevertheless）前後兩句意思相反」 | 「前一句是不利的情況，後一句是儘管如此仍然發生的事」 |
| 中文題目沒有時間卻要求時態 | 「因為大雨，我們留在家裡。」＋要點「用過去式」 | 中文題目加時間：「因為大雨，我們昨天留在家裡。」 |
| 最貼切的寫法高於本課級距 | A1 課「那些蛋糕非常好吃」要點只收 are | 要點寫「（例如 are；寫 taste very good 也正確）」——批改照收；參考答案仍限本課可用字（taste 為 B1，不放進 A1 參考答案） |

## 2. 參考答案（referenceEn）

參考答案必須完全符合題目的要求。

| ✗ | ✓ |
|---|---|
| 題目要「兩個理由」，範文 "I like this cafe. Moreover, the coffee is cheap."（前句只是表態，不是理由） | "This cafe is quiet. Moreover, the coffee is cheap."（兩句都是理由） |

## 3. 單字卡：例句要示範釋義的那個用法

釋義（glossZh）必須對得上例句中這個字的用法與詞性；例句本身要道地，不要語意重複。

| ✗ | ✓ |
|---|---|
| of：例句 "She has a cup of tea."（量詞結構），釋義「⋯的」 | "This is a picture of my family."（這是我家人的照片）——of＝「⋯的」 |
| farther：例句 "My school is farther from home than yours."（形容詞），釋義「更遠地」（副詞） | "Can you walk a little farther?"——副詞用法對上「更遠地」 |
| throughout：例句 "It rained throughout the whole weekend."（throughout 已含「整個」） | "The shop is open every day throughout the year." |

## 4. 閱讀範文：本課字的用法道地、邏輯交代清楚

- **連接詞要有正確的承接對象**：nevertheless／however 前面要有「不利情況」；moreover／furthermore 補充的是同方向的資訊，而且要接在被補充的那句後面；consequently 接「已發生的原因 → 已發生的結果」。
- **比較要交代基準**：farther／farthest 比的是誰和誰，讀者要看得出來。
- **感嘆詞要用在對的語氣**：gee、goodness 用來表驚訝，放在角色說的話或第一人稱裡最自然，不要硬塞在第三人稱敘述中。

| ✗ | ✓ |
|---|---|
| "…there was nowhere to park near it. Nevertheless, Daniel took the bus there."（沒地方停車和搭公車不構成轉折） | "The shop was far away, and the bus ride took over an hour. Nevertheless, Daniel went there." |
| "It was merely a short delay, but he was very worried. Moreover, she gave him a free meal ticket."（moreover 接在「他很擔心」後面） | 先寫 Helen 幫他換班機，再寫 "Moreover, she gave him a free meal ticket." |
| "Afterwards, she put it in a safe box. Consequently, she will not lose it again."（consequently 接未來推測） | "She had forgotten where she put it. Consequently, she spent three hours looking for it." |
| "Gee, she felt so much better!"（gee 用於鬆一口氣、又在第三人稱敘述裡） | "\"Gee, I never thought it would be there!\" she said." |
| "Of all her friends, she lives the farthest from the office, so she has to ride farther than they do."（沒交代朋友也在同公司、也騎車） | "…just like two friends from her office. Of the three of them, she lives the farthest from the office, so she has to ride farther than they do." |

## 5. 英文搭配與拼法

| ✗ | ✓ |
|---|---|
| "he takes the train instead of his car"（take the train 與 his car 不對稱） | "he takes the train instead of driving" |
| 聽打句 "She can not come today."（分寫，學習者照標準拼法打會被判錯） | "She can't come today."（cannot 不在單字表；聽打比對器需視 can't／cannot／can not 相同——TASK-13） |

## 6. 選擇題：干擾項在語法上也不能成立

審題員各輪的選擇類題目都判為單一正解（第一輪 16 課 80 題、第三輪 12 課 60 題）；以下是撰寫端自審時抓到、送審前修掉的：

| ✗（干擾項也合文法） | ✓ |
|---|---|
| "I visit ____ every month."，選項 them／there（visit there 口語可通） | "I love ____ very much." |
| "There are ____ students in the classroom."，選項 many／only（There are only students 合文法） | 干擾項換成 very |
| "I ____ live in a small town, but now…"，選項 used to／ought to | 干擾項換成 according to |

同義字（nevertheless／nonetheless、farthest／furthest、afterward／afterwards）不可同時出現在同一題選項中。

## 7. 中譯（各 Zh 欄）忠實、通順

| ✗ | ✓ |
|---|---|
| "The trip took two hours altogether." →「這趟來回總共花了兩個小時」（多了原文沒有的「來回」） | 「這趟路總共花了兩個小時。」 |
| "You can choose whichever color you like best." →「你可以選你最喜歡的任何一個顏色」（「最喜歡」與「任何一個」衝突，沒傳達 whichever） | 「你最喜歡哪個顏色，就選哪個。」 |
| "My school is farther from home than yours." →「我的學校離家比你的遠」（「你的」指什麼不清楚） | 改例句後重譯 |

## 8. 指令（instructionZh、promptZh）中文要通順

| ✗ | ✓ |
|---|---|
| 「用 only 造一個句子，說說你只有的某樣東西或某個人。」（「你只有的」不成語） | 「用 only 造一個句子，說說某樣東西你只有一個（或只有一點點）。」 |

## 9. 撰寫時檢查器常擋、先避開的

- **高於本級的日常字**：A1 課常誤用 A2 字（road、country、fridge、cheaper、send、snack、lake、last night 的 last）；B1 課常誤用 B2 字（seller、relief、conference、colleague、employee、project）。不確定就查可用字表或換字。
- **專有名詞要宣告**：人名、地名、語言名（Taipei、English）都要列進 properNouns；人名不要用剛好是單字的名字（Grace＝A2 字 grace）。
- **單字表沒有的寫法**：cannot、noodles、app 等不在單字表 → 換寫法。
- **正解位置要分散**：選擇類題（mcq、聽音選答、閱讀小題）不要習慣性把正解放第一個。檢查器有三條規則會擋：`ANSWER_POSITION`（單課所有選擇類題位合計，≥4 個正解在同一位置）、`ANSWER_POSITION_UNIT`（同一單元跨課合計，同題型 ≥6 題、同一位置超過 50%）、`ANSWER_POSITION_LEVEL`（同一級跨課合計，同題型 ≥6 題、同一位置超過 50%）。pilot 曾 16 題聽選有 15 題正解在第 1 個。
- **opencc 誤擋已豁免的台灣用詞**：連接、支持、項目、數據、點擊、文件、干擾、祕密、菜單、對象、消息、不准、只不過（`scripts/lib/zh-guard.mjs` 的 `TWP_ACCEPTED`）。遇到新的誤擋詞，先寫紅測試再加進豁免清單，不要為了過檢查器改成不道地的中文。

## 10. 執行長第③關（課綱符合度審查）補充

pilot 三輪審題後，執行長另做課綱符合度審查，以下四類是審題員沒抓到、TASK-9 撰寫時要自己守住的。

**① 參考答案主詞必須符合題目指定的對象。** 題目說「你」，參考答案就用 I（每一句都要）。

| ✗ | ✓ |
|---|---|
| 「說說你喜歡的另一樣東西」→ "My brother also likes ice cream." | "I like tea. I also like milk." |
| 「說說一件你還沒決定的事」→ "She is not sure whether she should call him." | "I am not sure whether I should call him." |
| 「說一個你以前常做、現在不做的習慣」→ "My father used to smoke, but he stopped last year." | "I used to drink a lot of coffee, but now I drink tea." |

**② 評分要點一律用「例如」，不寫死字詞或封閉清單。** 見 §1；第③關又抓到同類：「主要句用過去式 finished」→「主要句用過去式（例如 finished、completed）」；「用 give me 或 tell me」→「（例如 give me、tell me）」；「主要句用 will」→「主要句用表示未來的寫法（例如 will）」；「leave work early 表示『早點下班』」→「『早點下班』可寫 leave work early、get off work early 等」。

**③ 越級判斷看詞義、不看詞性。** 檢查器只看「該字所有詞性的最低級」。同一詞義只是詞性不同（call you、stand up、the red one、help 當名詞、go／come／stay home）可以用；**詞義不同或屬高級用法**的要換掉，即使檢查器沒擋：

| ✗ | ✓ |
|---|---|
| A1 課 "the people are very kind"（kind＝親切，形容詞 A2；A1 的 kind 是名詞「種類」） | "the people are very nice" |
| B1 課單字卡 "All the passengers are now aboard the plane."（aboard＋名詞是介系詞用法，C1） | "All the passengers are now aboard."（副詞用法，B1） |
| B1 課 "You ought to see a doctor about that cough."（cough 名詞 B2，又帶醫療建議） | "You ought to go to bed early tonight." |

**④ 正解位置要分散。** 見 §9；撰寫時就輪替位置，不要寫完再靠重排。

## 11. TASK-9 全量撰寫累積裁示

A1 第 1–3 批、A2 第 1–2 批、B1 第 1–2 批、B2 第 1 批三關審查後，執行長累積的裁示。各級沿用（「本級以內」＝該課所屬級距以內）；與 §1–§10 重疊處以本節為準。

1. **評分要點逐條自查、一律「例如」**：凡點名字詞、句型、位置的要點，都寫成「例如…」並明列也接受的其他正確結構（同義字、所有格變化、副詞句首／句尾、be going to 等未來式、look＋形容詞）。要點與參考答案不可互相矛盾。
   ✗「主要句用 will」 ✓「主要句用表示未來的寫法（例如 will、be going to）」
2. **正解位置不可預測**：每個選擇題位以 sha256(題 id) 取亂數決定正解位置；違反 ANSWER_POSITION／_UNIT／_LEVEL／_PATTERN 時，對該課改用 sha256(題 id＋"#"＋n) 逐次重抽。不得用固定位移輪替。重排＝正解與目標位置的選項互換（optionGlossZh 同步、已判題的 verdicts 重新對應）。
   ✗ mcq 第 2 題正解永遠＝第 1 題＋1（全級每課相鄰） ✓ 兩題各自由 sha256 決定，差值 0–3 都會出現
3. **目標字要有情境**：每個目標字除了單字卡，至少再出現在 1 題有句子情境的題目（聽打、跟讀、聽選音檔、mcq 題幹或正解、閱讀短文、翻譯／造句參考答案）；只出現在干擾項不算。
   ✗ shortly 只出現在單字卡與另一題 mcq 的干擾項 ✓ 再寫進跟讀句 "The bus will arrive shortly."
4. **情境句不可與單字卡例句雷同（mcq 題幹、翻譯與造句的參考答案都算）**：主詞、情境、句型三者至少換兩項，不能只換一兩個字，也不能換句話說、換同義詞。每課寫完跑 `node scripts/selfcheck-similarity.mjs <題目檔…>`（詞形還原、扣除目標字後算共同實詞÷較短句實詞數），≥40% 的句對逐一人工確認「三項至少換兩項」，不符就改寫。腳本只看字面，抓不到「同主詞同句型換情境」「換句話說同情境」「同義詞替換」，所以每課另在狀態檔附**情境對照表**：每個目標字一列，欄位＝單字卡情境（10 字內）｜其他用到該字的題的情境（10 字內）｜句型是否不同（是／否）；任何一列情境相同或句型相同就改寫。建議先寫其他題、最後寫單字卡例句，刻意選不同情境。
   ✗ 單字卡 "I keep my keys in the middle drawer." ＋跟讀 "She keeps her keys in the middle drawer." ✓ 跟讀改 "Please stand in the middle of the line."
   ✗ 單字卡 "Please turn down the volume of the TV." ＋mcq "Please turn up the ____; I can't hear the music." ✓ 單字卡改 "The volume of traffic is heavy in the morning."
5. **單字卡釋義＝本課用法；目標字照該級最常用義**：以 CEFR-J 該級詞性＋單元主題最常用義為準（lexicon 中文釋義不合理時不必照搬）；本課題目用到兩個詞義就在釋義並列。名詞、動詞都常用的字（try、hope、plan、worry 等）釋義並列兩義（常用的那義在前），且本課至少 1 題用動詞情境。大小寫合併字釋義兩者並列。
   ✗ line 釋義「線」，閱讀短文卻是 wait in line ✓ 釋義「隊伍；排」，例句 "There is a long line at the bank."
   ✗ may 只教「五月」 ✓ 釋義「五月（May）；可以、可能（may）」，另加 1 題 May I…? 情境題
6. **非目標字的詞義也不得越級（看詞義、不看詞性）**：非本課目標字的詞義，其 CEFR-J 級距不得高於本級；檢查器只看拼字，查不到詞義越級，要自己守住。本課目標字照課綱教該級詞義，不受此限。
   ✗ A2 課 "She waters the plants."（water 當「澆水」高於 A2） ✓ "She gives the plants some water."
   ✗ B1 課 "Spread the butter evenly."（spread 動詞 B2）、"our regulars"（名詞「老顧客」）、"cheap housing"（住房義由 house 動詞衍生） ✓ "Turn the meat often so it cooks evenly."、"our loyal customers"、"cheap apartments"
7. **mcq 至少一題只能靠詞義判斷**：每課兩題 mcq 中，至少一題的四個選項同詞性、都能放進空格且文法通順，只能靠詞義選對；另一題可混合詞性。逐一代入檢查文法線索：冠詞（a／an 對選項開頭音）、及物性（不及物動詞放不進「空格＋受詞」）、可數性（不可數名詞不能接 a）、介系詞搭配（dependent on、contribute to）都不能洩題。狀態檔逐課列出哪一題是「四選項同詞性、都放得進空格」。
   ✗ "Rising prices are a big ____ to small shops."，選項含 progress（不可數，不能接 a big） ✓ 換成 resource
   ✗ "She arrived ____."，選項 shortly／deadline／former／annual（只有副詞放得進去） ✓ 選項 shortly／annually／permanently／lately（皆副詞，靠詞義判斷）
8. **干擾項不可也成立**：填入後語意或文法必須明顯不通；同詞性題更要逐一代入檢查。
   ✗ "The windows ____ the sunlight."，干擾項 admit（admit the sunlight 也合文法） ✓ 換成代入後明顯不通的同詞性字
9. **造句題必用目標字**：參考答案與評分要點一律用到目標字，不收沒用目標字的句子。
   ✗ 造句 fall，參考答案 "The leaves come down in autumn." ✓ "The leaves fall in autumn."
10. **專有名詞全列、不撞字**：人名、地名、作物名一律列入 properNouns；名字或姓氏剛好是英文單字的換掉（Green、Grace、寵物名 Tiger）；地名描述要符合事實。
    ✗ "Mr. Green"、「花蓮是個小鎮（small town）」 ✓ "Mr. Lin"、「花蓮市（city）」
11. **醫療與題材**：只准一般生活建議（多喝水、早點睡、休息）；不得出現吃藥、診斷、該不該看醫生的建議。避開戰爭、災難、死亡等沉重題材與粗俗俚語。
    ✗ "You should take this medicine twice a day." ✓ "You should drink more water and rest."
12. **句型與標點**：直述句不可當問句用；動物一律用「牠」；T-shirt 照標準拼法，評分要點不以大小寫扣分。
    ✗ "It is raining?" ✓ "Is it raining?"
13. **單元間複用（規則）**：每個單元從第 2 課起，閱讀短文至少自然帶入 1 個前面單元（同級或下一級）學過的字，不硬塞；前面單元的字不可只當 mcq 干擾項。
    ✗ 描述形容詞單元之後的兩個單元完全不再出現那些形容詞 ✓ 短文寫 "The new office is bright and quiet."（bright、quiet 為前一單元目標字）
14. **不寫政治／主權表述**：不寫國家地位、主權、統獨相關句子。
    ✗ "Taiwan is a small nation." ✓ "Taiwan is a small island."
15. **題幹不可洩漏正解**：mcq 題幹不可出現正解字或它的明顯變形。
    ✗ "We stopped at the ____ station to buy petrol."（正解 petrol） ✓ "We stopped at the ____ station to fill up the car."
16. **易誤讀的字換情境、舊稱要加註**：可能被讀成負面意思的句子換情境（drug 用 medicine 情境，釋義寫「藥；藥物」，避免 "makes drugs"）；較舊的說法在單字卡加註現行說法，評分要點一併收（handicapped → disabled）。
17. **參考答案要照題目要求的對象與時間**：題目要「你」「平常的習慣」，參考答案就寫自己、寫現在的習慣，不寫別人，也不寫願望或未來打算。
    ✗ 「說說你平常週末做什麼」→ "I want to go hiking next weekend." ✓ "I usually go hiking on weekends."
18. **評分要點不寫死時態**：題目沒有明確時間標記時，收所有合理時態；「說說你曾經…」收過去式與現在完成式。
    ✗ 「說說你人生中的一段過渡時期」＋要點「過去的事用過去式」 ✓ 「時態配合內容（例如 was、is）」
19. **不寫刻板印象**：不把不會用新科技、抗拒改變、反對平等等特質歸給年長者或特定族群。
    ✗ "Some older guests stared at the doors for a long time." ✓ "Some guests stared at the doors for a long time."
20. **中譯不添加原文沒有的限定或資訊**：「只」「到處」「主食」這類字原文沒有就不要加；同一段落裡不同職稱要譯得分得出層級。
    ✗ "an exclusive watch that Mr. Ho makes annually" →「何先生每年只做一次」 ✓「何先生每年做一次」
21. **新內容界線**：比照醫療（第 11 條），不寫理財／投資建議、不寫飲食建議，不寫鼓勵博弈的情節（例如身無分文的人買彩券中獎）；這類目標字一律用中性事實句。涉及具體規定或可查證的事實（航空公司規定、某地房屋設備）時，改用不涉及規定的中性敘述。
    ✗ "Young people should start to invest early." ✓ "The company invested in new computers last year."
22. **情境對照表以現行檔案產生、逐列判定**：對照表要從**現行題目檔**抽出單字卡例句與所有用到該字的題，再逐列人工判定；修改後要重產，不可沿用舊表。欄位照第 4 條，另加「換了哪幾項」（主詞、情境、句型），只換主詞或只換句型的列不算通過。審後修正新寫的句子同樣要比。
23. **評分要點不寫封閉清單**：「可寫 A 或 B」「常用 X」「常說 X」一律改成「可寫，例如 A、B 等」；只列一種寫法的也要加「例如…等」。每批用腳本掃描全級要點中含「或／可寫／常用／常說／可用」卻沒有「等／例如」的條目。
    ✗ 「書店」可寫 bookshop 或 bookstore ✓ 「書店」可寫，例如 bookshop、bookstore 等
24. **選項長度不洩題（長度名次分布）**：同一題的選項具體程度相同，正解不可是唯一最完整的那個；改寫時補足干擾項細節或縮短正解，不改正解意思、不讓干擾項成立。撰寫時以題位 id 雜湊決定「這題正解要排第幾長」（和正解位置同一套做法），再調整措辭長度去配合。自查：把每題選項依字元長度排名次 1（最長）…n（最短），並列時正解平分到並列區間的各名次；同級、同題型、同選項數（題數 ≥20）每一個名次的命中率都要在隨機機率 ±12 個百分點內（三選一 21–45%、四選一 13–37%）。閱讀與聽選這類片語／句子選項，另外要求每個選項的長度介於其他選項平均長度的 0.5～2 倍（mcq 單字選項不套用這條，但仍要符合名次分布）。只管「最長」或「最短」會把正解擠到中間名次，不能只看兩端。
25. **詞性與詞義錯位的目標字照課綱詞性教**：課綱因某詞性是本級而排入、但單元主題常用義屬另一詞性且越級時（soil 動詞「弄髒」B1／名詞「土壤」B2、counter 動詞「反駁」B1／名詞「櫃台」B2），一律照課綱該級詞性教，釋義並列名詞義；越級的那一義不出現在情境題。
26. **mcq 干擾項的用字與品質**（全級適用）：
    - 干擾項只用本課、先前課，或低一級以下學過的字；**同級但還沒教的字不可以用**。
    - 不可用一眼就能排除、和題意明顯無關的低階字。不可為了湊長度名次拿冷僻的長字或短字充數。
    - 同一個非本單元的字，不可以在多課重複當干擾項。
    - 同一課的兩題 mcq 不可以共用干擾項，也不可以拿另一題的正解當干擾項。
    - 混合詞性的那題 mcq，三個干擾項中至少要有兩個在文法上放得進空格，只能靠詞義或搭配排除。
    - mcq 的長度名次只看全級分布是否合格，不必逐題照雜湊指定；閱讀與聽選仍照第 24 條逐題指定名次。
    - 換干擾項後要重新代入，確認沒有第二個正解。
    ✗ B1 前段課用 u30 才教的 fluently 當干擾項；"I love ____ activities like hiking."，選項 outdoor／artistic／jazz／sad ✓ 選項 outdoor／artistic／antique／mechanical（本課或先前課學過的形容詞）
27. **單字卡釋義的第一義＝本課例句所教的詞義**：App 的單字卡作答選項只顯示釋義第一義（作答後才顯示完整釋義），所以干擾項不必配合「X；Y」格式，但 glossZh 的第一義一定要是單字卡例句用的那個詞義；對不上就調換順序。
    ✗ settle 釋義「解決；結清；定居」＋例句 "We settled the bill and left the hotel." ✓ 釋義「結清；解決；定居」
28. **例句示範釋義所列的主要詞義**：單字卡例句要用到釋義第一個列出的詞義；釋義並列的其他詞義可以放在其他題。
29. **選項大小寫不可洩題**：mcq 選項只有一個是專有名詞（首字大寫）時就是洩題；要嘛四個選項都是專有名詞，要嘛都是普通名詞，不行就改考別的目標字。縮寫照實際寫法（HIV、DJ），課綱 word 欄位受 headword 限制的部分交給 App 顯示層。
    ✗ "…cross the ____ Ocean."，選項 Atlantic／vice／roadside／regional ✓ 改考 isle，四個選項都是普通名詞
30. **不寫健康迷思或保健建議**：比照第 11 條，「在暗處看書傷視力」「有氧運動讓心臟健康」這類句子刪掉或改成中性事實。
    ✗ "Reading in the dark is bad for your eyesight." ✓ "Cats have good eyesight at night."
31. **政治意涵字只用中性或歷史事實**：motherland 譯「故鄉；祖國」，只用「住在國外的人想念、回到故鄉」這類中性情境，不連結任何特定國家，也不把一段海岸或地區稱為 motherland；nationalist 只用歷史事實句，不評價。都不提兩岸或台灣。

## 12. 同課第二題翻譯（創辦人裁示 2026-10-04：造句改翻譯）

造句沒有標準答案，拿掉；每課改為 2 題翻譯、0 題造句（`item-rules.mjs` 的 `COMPOSITION`）。既有題庫逐級轉換：把造句題**原位**換成翻譯題、**沿用同一個題 id**（App 進度不位移）；尚未轉換的級別列在 `MS2TR_PENDING_LEVELS`，照舊題量檢查，該級轉換完就從清單移除。本節與 §1–§11 重疊處以本節為準；§11 其他規則照常適用（例如第 3、4、11、14、17、18、19、21、23、30 條）。

1. **目標字沿用被取代造句題的 targetWord**：放進 hintWords，參考答案每個變體都要用到它（比照 §11.9）。新寫課程沒有造句題時，選第一題翻譯沒練到的本課目標字。
2. **兩題翻譯的提示字不可練同一個本課目標字**：檢查器 `TRANSLATE_HINT_DUP` 會擋。第一題翻譯的 hintWords 已含該目標字時，從第一題的 hintWords 拿掉（第一題的題目、參考答案不動），並記入 resolvedAfterFinalReview。
3. **與同課第一題翻譯不雷同**（§11.4 標準）：主詞、情境、句型至少換兩項；不可只換一兩個字，也不可同一個情境換句話說。同單元其他課的翻譯也不可雷同。寫完跑 `node scripts/selfcheck-translate.mjs <同單元全部題目檔>`（同課比字面＋句型骨架、同單元跨課比字面），列出的組要改寫到 0。
4. **用字限本課可用字表**：參考答案只用級距 ≤ 本課級距的字＋本課新字＋已宣告的專有名詞；詞義也不得越級（§10③、§11.6）。
5. **句長照 `SENTENCE_WORDS`**（A1 3–12 字，依此類推），每個參考答案變體都要符合。
6. **參考答案至少 2 個自然變體**：常見的同義說法、縮寫與否、語序不同都可以（例如 "I am…"／"I'm…"、副詞句首／句尾）；每個變體都要完全對上中文題目的意思、對象與時間（§2、§11.17）。
7. **評分要點一律「例如…等」，不得比參考答案嚴**：凡點名字詞、句型、位置都寫成「例如 A、B 等」（§1、§11.1、§11.23）；要點不可判錯任何一個參考答案變體或其他正確譯法。寫完自問：「有沒有一句正確的英文會被這條要點判錯？」
8. **中文題目要能唯一導向一個合理的英文意思**：避開中文歧義——主詞、單複數、時間交代清楚（「他」「她」分開寫；要求時態就給時間詞，§1）；不用可以兩讀的詞（「我要」＝want 或 will）；不出現英文直譯才通的中文。
   ✗「我要喝茶。」（want 或 will 皆可、評分難定） ✓「我想喝一杯茶。」
9. **題材界線**：不寫醫療、理財、飲食建議，不寫災難、死亡，不寫刻板印象（§11.11、§11.19、§11.21、§11.30）。
10. **改動留痕**：每處改動記在該課 `judge.resolvedAfterFinalReview`，message 開頭寫「創辦人裁示：造句改翻譯：」。
