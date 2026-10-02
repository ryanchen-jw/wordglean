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
