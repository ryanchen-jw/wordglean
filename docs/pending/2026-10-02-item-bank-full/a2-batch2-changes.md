# A2 第 2 批（a2-u08～u16）第②③關修正對照表

> 依 `t9/a2b2-rulings.md`（2026-10-02）。先寫入第②關判題（48 課，judgedBy claude-reviewer；盲答 240 題位全部一致、0 多解）。然後修第②關 50 條、第③關 FIX 31 條、選定的疑似項，以及新裁示的情境句雷同自查。每處修改都記在該課的 `judge.resolvedAfterFinalReview`：message 以「執行長第②③關裁示修正：」開頭，resolution 記改後與原文。
> 修正後，`check-items --require-judge` 對第 1、2 批 94 課全綠，全量 244 課全綠，`npm test` 156 項全過。
> 所有選擇題的正解索引都沒有變。正解文字有變的有 4 題，都是隨題目內容同步改寫的：a2-u09-l02-q10 改考訓練開始時間、a2-u11-l03-q14#0 改成學校旅行、a2-u11-l04-q14#0 帳單改收據、a2-u15-l06-q13 lyric 改成名詞 lyrics。
> 盲答之後，題幹、音檔、選項或短文有改的選擇題共 39 題，都沒有再送盲審，判題沿用原本的正解索引。題號：u08-l01-q15、u08-l02-q16、u08-l03-q14、u08-l05-q15、u08-l06-q13、u09-l01-q15、u09-l02-q10、u09-l03-q14、u09-l03-q15、u09-l04-q13、u10-l02-q15、u10-l03-q15、u10-l05-q13、u10-l06-q12、u10-l06-q13、u10-l08-q13、u10-l09-q14、u11-l02-q12、u11-l02-q14、u11-l03-q13、u11-l03-q14、u11-l04-q13、u11-l04-q14、u11-l05-q14、u12-l02-q14、u12-l02-q16、u12-l03-q15、u12-l05-q15、u13-l04-q13、u14-l01-q16、u14-l04-q15、u15-l03-q14、u15-l04-q13、u15-l06-q12、u15-l06-q13、u15-l06-q14、u16-l01-q15、u16-l03-q15、u16-l04-q14（前綴 a2- 省略）。建議驗收時抽盲答。

## 統計

- **判題**：寫入 48 課。
- **第②關 50 條**：
  - 45 條照建議或用等效改法修。
  - 4 條判定不改，記入 resolved（見「不改項目」）。
  - 1 條由同課另一處修改解決：u15-l03 Q1 的表演者依據，已把短文改成 by a mysterious man。
- **第③關 FIX 31 條**：全修。其中 a2-u10-l07-q15（翻譯題和 grilled 單字卡同為點餐）改的是單字卡那一側，翻譯題不動，見「不改項目」。
- **疑似**：
  - 照裁示修了 S1（exchange 換貨）、S2、S4、S5、S6、S8–S13、S15–S20、S22–S25、S27–S29、G1、G2，以及第③關 b 的 S1–S5、S8–S13、S15。
  - 不改的列在下表。
- **新裁示**：
  - 主權表述：u12-l02 的 nation 改 island，nation 改在中性情境出現。
  - used to：u09-l01、u12-l05 已改；第 1 批 u02-l03 在上一輪已改，複查題目內容已無 used to。
  - fix 動詞：u08-l05 已改；第 1 批 u07-l01 複查已無。
  - handicapped、drug、lyric、MP3、題幹洩題、exchange 換貨、參考答案主詞，都照裁示改。
- **情境句雷同自查**：
  - 腳本是 tmp 的 sim.mjs。它拿每課單字卡例句，和同課其他英文句子比對：聽打、跟讀、聽選、mcq 題幹（空格填入正解）、閱讀逐句、參考答案。
  - 計算方式：去掉功能詞、做詞形還原，片語目標字算一個詞；「共同實詞數 ÷ 單字卡實詞數 ≥ 60%，且共同實詞 ≥ 2」就算雷同。
  - 本批初掃命中 99 處，修完 0 處。多數改的是單字卡例句（改一處可以同時解掉多題），也照第③關的建議改了情境題。

## 不改項目與理由

| 題 id | 來源 | 理由 |
|---|---|---|
| a2-u10-l02-q07 | 第②關疑似：fry 應示範動詞 | lexicon 的 fry 是名詞 A2、動詞 B1，第③關也確認名詞＝A2。依「照 CEFR-J 該級詞性教」，維持名詞「薯條」 |
| a2-u10-l07-q01 | 第②關疑似：crisp 詞性 | 核對過 lexicon，crisp 只有名詞 A2，維持「洋芋片」 |
| a2-u12-l05-q11、a2-u15-l01-q15 | 第②關疑似：cousin 譯「表哥」多了性別與長幼資訊 | 屬語感類，由我判斷。中文沒有不分性別長幼又自然的 cousin 譯法，「表親」很生硬，所以沿用「表哥」的慣例；題目也不考性別 |
| a2-u15-l06-q06 | 第②關：word「mp3 player」要大寫 | word 欄位必須和課綱 headword 一致：試改成 MP3 player 後，檢查器 COMPOSITION 擋下（課綱寫 mp3 player），而這次不得改 curriculum/。學習者看得到的例句、閱讀、選項、釋義都已改大寫。建議課綱改 headword（列入狀態檔建議） |
| a2-u10-l07-q15 | 第③關 FIX：翻譯題和 grilled 單字卡同為點餐 | 改單字卡（烤肉時的烤玉米），翻譯題保留點餐句，效果等同 |
| a2-u08-l06-q15／q16 | 第③關疑似 S7：take turns、my turn 的 turn | 「輪到、輪流」是 A2 最常見的 turn 用法（It's my turn），lexicon 名詞 A1，不算越級 |
| a2-u08-l01-q14 | 第③關疑似 S14：oven 情境相近 | 主詞和句型都不同（祈使句烤麵包 vs 蛋糕還在烤箱），腳本也沒命中 |
| a2-u09-l04-q11 | 第③關疑似 S21：a sleepless night | 這是 sleepless 唯一自然的搭配，主詞和句型不同。barber 改了單字卡 |
| a2-u11-l01-q16 | 第③關疑似 S26：How much does … cost? | 這是翻譯題最自然的譯法。主詞（襯衫 vs 去日本旅行）和情境都不同 |
| a2-u12-l05-q14、a2-u16-l02-q13 | 第③關 b 疑似 S6：專有形容詞大寫成為線索 | 專有形容詞必須大寫，移空格也無法讓選項清單不露大寫。兩課另有一題四選項同詞性的 mcq（u12-l05 q13、u16-l02 q14）負責詞義判斷 |
| 全批 listenChoice | 第③關 b 疑似 S14：正解很少在中間 | 這次裁示沒有指示要處理；ANSWER_POSITION 系列規則都綠。列入狀態檔建議，等執行長裁示 |
| a2-u14-l04-q06 | 裁示：handicapped 單字卡加註「（較舊的說法，現多用 disabled）」 | 全文超過釋義 20 字上限，所以釋義寫「身心障礙的（較舊說法）」，全文註記放在例句中譯 |

## 改動對照表（題 id｜欄位｜原因｜改後與原文）

| 題 id | 欄位 | 原因 | 改後與原文 |
|---|---|---|---|
| a2-u08-l01-q05 | exampleZh | 第②關：「好冷，你需要再一條毯子嗎？」少了動詞，不通順；宜作「好冷，你要不要再多拿一條毯子？」 | 改為 "好冷，你要不要再多拿一條毯子？"（原 "好冷，你需要再一條毯子嗎？"）；照建議補上動詞 |
| a2-u08-l01-q15 | stemEn | 第③關 FIX：題幹和 battery 單字卡雷同（needs a new battery），換主詞、情境與句型；選項與正解不變 | 改為 "I put a new ____ in the clock, and now it works again."（原 "This clock stopped. It needs a new ____."） |
| a2-u08-l01-q15 | stemZh | 題幹中譯同步 | 改為 "我在時鐘裡放了一顆新電池，現在它又會走了。"（原 "這個時鐘停了，需要換新電池。"） |
| a2-u08-l01-q03 | exampleEn | 雷同自查：單字卡（park his car in the garage）和閱讀（park their car on the street）共用停車情境，改單字卡 | 改為 "We keep our bikes in the garage."（原 "My dad parks his car in the garage."） |
| a2-u08-l01-q03 | exampleZh | 中譯同步 | 改為 "我們把腳踏車放在車庫裡。"（原 "我爸爸把車停在車庫裡。"） |
| a2-u08-l01-q07 | exampleEn | 雷同自查：單字卡（take the elevator to the tenth floor）和閱讀（eleventh floor, take the elevator）雷同，改單字卡 | 改為 "The elevator in our building is very slow."（原 "Let's take the elevator to the tenth floor."） |
| a2-u08-l01-q07 | exampleZh | 中譯同步 | 改為 "我們大樓的電梯很慢。"（原 "我們搭電梯到十樓吧。"） |
| a2-u08-l01-q03 | exampleEn | 雷同自查：前一版單字卡和 q13 跟讀句相同，再換 | 改為 "Our garage is big enough for two cars."（原 "We keep our bikes in the garage."） |
| a2-u08-l01-q03 | exampleZh | 中譯同步 | 改為 "我們的車庫大到可以停兩台車。"（原 "我們把腳踏車放在車庫裡。"） |
| a2-u08-l02-q16 | passageEn | 第②關：時態邏輯不連貫：全文以 Every spring 寫習慣（現在式），中間插入 Last weekend she also changed…（單次過去事件），接著又回到 When everything is done, she sits…；讀者無法判斷換燈泡是否每年春天的一部分。建議統一為「今年春天」的過去式敘事，或刪掉 Last weekend | 改為 "Every spring, Tina cleans her whole house. Upstairs, she empties every drawer and throws away old junk. Downstairs, she cleans the floor with soap and water. She also changes all the old light bulbs. When everything is done, she sits on her balcony and sews buttons on old shirts."（原 "Every spring, Tina cleans her whole house. Upstairs, she empties every drawer and throws away old junk. Downstairs, she cleans the floor with soap and water. Last weekend, she also changed all the old light bulbs. When everything is done, she sits on her balcony and sews buttons on old shirts."）；統一為每年春天的習慣（現在式） |
| a2-u08-l02-q16 | passageZh | 中譯同步 | 改為 "每年春天，Tina 都會把整間房子打掃一遍。在樓上，她清空每個抽屜，把舊的沒用東西丟掉。在樓下，她用肥皂和水清洗地板。她也會把舊燈泡全部換掉。全部做完後，她就坐在陽台上，替舊襯衫縫釦子。"（原 "每年春天，Tina 都會把整間房子打掃一遍。在樓上，她清空每個抽屜，把舊的沒用東西丟掉。在樓下，她用肥皂和水清洗地板。上週末她還把舊燈泡全部換掉。全部做完後，她就坐在陽台上，替舊襯衫縫釦子。"） |
| a2-u08-l02-q05 | exampleEn | 雷同自查：單字卡（This light bulb…）與閱讀（old light bulbs）共用 light bulb，改單字卡 | 改為 "We need a new bulb for the kitchen lamp."（原 "This light bulb doesn't work."） |
| a2-u08-l02-q05 | exampleZh | 中譯同步 | 改為 "廚房的燈需要換一顆新燈泡。"（原 "這顆燈泡不亮了。"） |
| a2-u08-l02-q02 | exampleEn | 第③關疑似 S15：單字卡和 q14 都是洗手情境，改單字卡情境與句型 | 改為 "Don't forget to buy soap at the supermarket."（原 "Wash your hands with soap and water."） |
| a2-u08-l02-q02 | exampleZh | 中譯同步 | 改為 "別忘了在超市買肥皂。"（原 "用肥皂和水洗手。"） |
| a2-u08-l02-q01 | exampleEn | 第③關疑似 S16：單字卡和 q11 同為「X are in the drawer」句型與「東西放哪」情境，改單字卡 | 改為 "This drawer is full of old letters."（原 "The scissors are in the kitchen drawer."） |
| a2-u08-l02-q01 | exampleZh | 中譯同步 | 改為 "這個抽屜裝滿了舊信件。"（原 "剪刀在廚房的抽屜裡。"） |
| a2-u08-l03-q01 | glossZh | 第②關：釋義「清潔工；清潔劑」：例句是人（A cleaner comes to our office），「清潔劑」是例句沒示範的另一義，且與干擾項（警衛／司機／郵差，都是人）詞類不對稱；建議只寫「清潔工；清潔人員」 | 改為 "清潔工；清潔人員"（原 "清潔工；清潔劑"）；照建議只留人義 |
| a2-u08-l03-q15 | passageZh | 第②關：「屋頂上有個小花園」：原文 a garden 沒有「小」，多加資訊 | 改為 "Amy 的新公寓很小，但很整齊。客廳裡有一個高高的書櫃，門邊有一面大鏡子。屋外有一道小門，就在一條安靜的街旁邊。屋頂上有個花園，Amy 在那裡種菜。每週五會有清潔人員來，不過 Amy 每天晚上都自己整理廚房。"（原 "Amy 的新公寓很小，但很整齊。客廳裡有一個高高的書櫃，門邊有一面大鏡子。屋外有一道小門，就在一條安靜的街旁邊。屋頂上有個小花園，Amy 在那裡種菜。每週五會有清潔人員來，不過 Amy 每天晚上都自己整理廚房。"）；刪去原文沒有的「小」 |
| a2-u08-l03-q14 | stemEn | 第③關 FIX：題幹和 tidy 單字卡雷同（Please tidy the room），換情境與句型；選項與正解不變 | 改為 "Your toys are all over the floor. Please ____ them up."（原 "Please ____ the living room. Guests are coming."） |
| a2-u08-l03-q14 | stemZh | 題幹中譯同步 | 改為 "你的玩具丟得滿地都是，請把它們收好。"（原 "請把客廳整理一下，客人要來了。"） |
| a2-u08-l04-q13 | stemZh | 第②關：「門鎖好像有問題」：原文 Something is wrong with the lock 是肯定語氣，「好像」多加了推測語氣；宜作「門鎖有問題」 | 改為 "我打不開門，門鎖有問題。"（原 "我打不開門，門鎖好像有問題。"）；刪去原文沒有的推測語氣 |
| a2-u08-l04-q16 | rubricZh/1 | 第②關：疑似寫死：「『還是』用 still」未用「例如」；雖然 still 是最常見寫法，依已裁原則應寫成「『還是』可寫例如 still（is still wet）」 | 改為 "「還是」可寫例如 still，常放在 be 動詞後面（is still wet）"（原 "「還是」用 still，放在 be 動詞後面（例如 is still wet）"）；改成「例如」 |
| a2-u08-l04-q01 | exampleEn | 第③關 FIX：單字卡（the lock on the front door is broken）和閱讀（the lock on the back door was broken）雷同，改單字卡 | 改為 "I need a new lock for my bike."（原 "The lock on the front door is broken."） |
| a2-u08-l04-q01 | exampleZh | 中譯同步 | 改為 "我的腳踏車需要一個新的鎖。"（原 "前門的鎖壞了。"） |
| a2-u08-l04-q17 | referenceEn | 第③關 FIX：參考答案 2 和 furniture 單字卡雷同（buy new furniture for…room）；參考答案 1 也共用 living room，一併換 | 改為 ["We don't have much furniture in our small apartment.","Our furniture is old, but it is very comfortable."]（原 ["We don't have much furniture in our living room.","I want to buy some new furniture for my bedroom."]） |
| a2-u08-l04-q04 | exampleEn | 雷同自查：單字卡和閱讀都是 fence around the garden，改單字卡 | 改為 "Our dog jumped over the fence."（原 "There is a white fence around the garden."） |
| a2-u08-l04-q04 | exampleZh | 中譯同步 | 改為 "我們的狗跳過了圍籬。"（原 "花園四周有一道白色圍籬。"） |
| a2-u08-l04-q03 | exampleEn | 第③關疑似 S17：單字卡和 q09 都是「警告句＋X is wet」，改單字卡 | 改為 "The baby's shirt is wet. Can you bring a dry one?"（原 "Don't sit there. The chair is wet."） |
| a2-u08-l04-q03 | exampleZh | 中譯同步 | 改為 "寶寶的上衣濕了，可以拿一件乾的來嗎？"（原 "別坐那裡，椅子是濕的。"） |
| a2-u08-l05-q15 | passageEn | 第③關 FIX：fix 動詞（B1）越級，依裁示不用 | 改為 "My grandfather's house is very old. The heating doesn't work well, so in winter he often cooks soup on the stove to keep warm. Last week, a cupboard door fell off because one screw was missing. Grandpa put in a new screw himself, and the door was fine again. \"This house is old, but so am I,\" he said and laughed."（原 "My grandfather's house is very old. The heating doesn't work well, so in winter he often cooks soup on the stove to keep warm. Last week, a cupboard door fell off because one screw was missing. Grandpa found a new screw and fixed it himself. \"This house is old, but so am I,\" he said and laughed."） |
| a2-u08-l05-q15 | passageZh | 中譯同步 | 改為 "我爺爺的房子很老舊。暖氣不太好用，所以冬天他常在爐子上煮湯來取暖。上週，有一扇櫥櫃門掉了下來，因為少了一顆螺絲。爺爺自己裝上一顆新螺絲，櫥櫃門就好了。他笑著說：「這房子很老，我也一樣老啊。」"（原 "我爺爺的房子很老舊。暖氣不太好用，所以冬天他常在爐子上煮湯來取暖。上週，有一扇櫥櫃門掉了下來，因為少了一顆螺絲。爺爺找到一顆新螺絲，自己把它修好了。他笑著說：「這房子很老，我也一樣老啊。」"） |
| a2-u08-l05-q16 | promptZh | 第③關 FIX：翻譯題和 heating 單字卡、閱讀都是「暖氣壞了」，換情境與句型 | 改為 "請把暖氣關掉。"（原 "我們家的暖氣壞了。"） |
| a2-u08-l05-q16 | referenceEn | 參考答案同步（switch 是 B1，不用） | 改為 ["Please turn off the heating.","Please turn the heating off."]（原 ["The heating in our house is broken.","Our heating doesn't work."]） |
| a2-u08-l05-q16 | rubricZh | 評分要點同步 | 改為 ["「暖氣」用 heating","「關掉」可寫例如 turn off","請求句用原形動詞開頭（例如 Please turn off…）"]（原 ["「暖氣」用 heating","「壞了」可寫例如 is broken、doesn't work、isn't working"]） |
| a2-u08-l05-q05 | exampleEn | 雷同自查：單字卡（heating isn't working, so the house is cold）和閱讀（heating doesn't work well…keep warm）同情境同句型，改單字卡 | 改為 "Our school has no heating, so we wear coats in class."（原 "The heating isn't working, so the house is cold."） |
| a2-u08-l05-q05 | exampleZh | 中譯同步 | 改為 "我們學校沒有暖氣，所以上課時大家都穿外套。"（原 "暖氣壞了，所以屋子裡很冷。"） |
| a2-u08-l05-q04 | exampleEn | 雷同自查：單字卡（One screw is missing…）和閱讀（because one screw was missing）雷同，改單字卡 | 改為 "I need a small screw for my glasses."（原 "One screw is missing from this chair."） |
| a2-u08-l05-q04 | exampleZh | 中譯同步 | 改為 "我的眼鏡需要一顆小螺絲。"（原 "這張椅子少了一顆螺絲。"） |
| a2-u08-l06-q03 | exampleEn | 第②關：疑似誤導：cooker（英式＝爐具）的例句寫 Turn off the cooker when the rice is ready，台灣學習者極易理解成「電鍋／電子鍋（rice cooker）」；建議改成不涉及煮飯的情境，例如 Put the pan on the cooker. | 改為 "Put the pan on the cooker."（原 "Turn off the cooker when the rice is ready."）；照建議改成不涉及煮飯的情境，避免讀成電鍋 |
| a2-u08-l06-q03 | exampleZh | 中譯同步 | 改為 "把平底鍋放到爐子上。"（原 "飯煮好了就把爐子關掉。"） |
| a2-u08-l06-q13 | stemEn | 第③關疑似 S18：題幹和 toothbrush 單字卡都寫 new toothbrush，拿掉 new | 改為 "I brush my teeth with a soft ____."（原 "I brush my teeth with a new ____."） |
| a2-u08-l06-q13 | stemZh | 題幹中譯同步 | 改為 "我用一支軟毛牙刷刷牙。"（原 "我用一支新牙刷刷牙。"） |
| a2-u08-l06-q17 | referenceEn/1 | 第③關疑似 S8：set（設定鬧鐘）的詞義高於 A2，參考答案不用 | 改為 "I always put my alarm clock far from my bed."（原 "I always set my alarm clock for six thirty."） |
| a2-u08-l06-q17 | rubricZh/1 | 參考答案不再用 set，評分要點改成「例如」並照收 set | 改為 "說習慣用現在式（例如 My alarm clock rings at…）；寫 set my alarm clock for＋時間也正確"（原 "「設鬧鐘」可寫 set my alarm clock for＋時間；說習慣用現在式"） |
| a2-u08-l06-q17 | referenceEn/1 | 雷同自查：前一版參考答案和 alarm clock 單字卡相同，再換 | 改為 "I don't use an alarm clock. I use my phone."（原 "I always put my alarm clock far from my bed."） |
| a2-u09-l01-q15 | passageEn | 第③關 FIX：used to（B1）越級，依裁示不用 | 改為 "David is a businessman. For many years, he worked long hours and slept only five hours a night. He was always sleepy at work, and he often fell asleep in meetings. Last year, he got a big bonus, but he wasn't happy. So he changed his lifestyle. Now he goes to bed early and walks every morning. \"Money isn't everything,\" he says."（原 "David is a businessman. He used to work long hours and slept only five hours a night. He was always sleepy at work, and he often fell asleep in meetings. Last year, he got a big bonus, but he wasn't happy. So he changed his lifestyle. Now he goes to bed early and walks every morning. \"Money isn't everything,\" he says."） |
| a2-u09-l01-q15 | passageZh | 中譯同步 | 改為 "David 是個生意人。他有很多年都工作很長的時間，每晚只睡五個小時。他上班時總是很睏，開會時還常常睡著。去年他拿到一大筆獎金，卻不快樂。於是他改變了生活方式。現在他很早上床睡覺，每天早上去散步。他說：「錢不是一切。」"（原 "David 是個生意人。他以前工作時間很長，每晚只睡五個小時。他上班時總是很睏，開會時還常常睡著。去年他拿到一大筆獎金，卻不快樂。於是他改變了生活方式。現在他很早上床睡覺，每天早上去散步。他說：「錢不是一切。」"） |
| a2-u09-l01-q07 | exampleEn | 雷同自查：單字卡（got a bonus at the end of the year）和閱讀（Last year, he got a big bonus）雷同，改單字卡 | 改為 "The boss gave us a bonus for our hard work."（原 "Everyone got a bonus at the end of the year."） |
| a2-u09-l01-q07 | exampleZh | 中譯同步 | 改為 "老闆因為我們工作認真，發給我們獎金。"（原 "年底每個人都拿到了獎金。"） |
| a2-u09-l01-q09 | sentenceEn | 第③關疑似 S19：聽打句和 asleep 單字卡同為「X is/are asleep」句型，換句型與情境 | 改為 "I was asleep when you called me."（原 "The kids are already asleep."） |
| a2-u09-l01-q09 | sentenceZh | 中譯同步 | 改為 "你打電話給我的時候，我已經睡著了。"（原 "孩子們已經睡著了。"） |
| a2-u09-l01-q04 | exampleZh | 第③關疑似 S12：刪去原文沒有的「上船」 | 改為 "那艘船的船長歡迎我們。"（原 "船長歡迎我們上船。"） |
| a2-u09-l02-q16 | promptZh | 第②關：This job needs a lot of labor. 英文不自然，且 need labor 易被理解為「需要很多人手（工人）」而非「很耗體力」；中文「需要很多勞力」宜對應 This job takes a lot of hard work／This job is hard physical labor. 第二句 takes a lot of labor 也偏生硬。建議改題目或改參考答案 | 改為 "這個城市的勞力成本很高。"（原 "做這份工作需要很多勞力。"）；need labor 不自然且易誤解，改題目為 labor 的常用搭配 the cost of labor |
| a2-u09-l02-q16 | referenceEn | 參考答案同步 | 改為 ["The cost of labor is high in this city.","Labor is expensive in this city."]（原 ["This job needs a lot of labor.","This job takes a lot of labor."]） |
| a2-u09-l02-q16 | rubricZh | 評分要點同步 | 改為 ["「勞力」用 labor（不可數，不加 s）","「成本很高」可寫例如 the cost of labor is high、labor is expensive"]（原 ["「勞力」用 labor（不可數，不加 s）","「需要」可寫例如 needs、takes"]） |
| a2-u09-l02-q10 | audioEn | 第③關 FIX：聽選句和 training 單字卡雷同（新員工＋一段時間的訓練），換情境與句型 | 改為 "The training starts at nine, so please don't be late."（原 "All new staff must finish one month of training."） |
| a2-u09-l02-q10 | audioZh | 中譯同步 | 改為 "訓練九點開始，請不要遲到。"（原 "所有新進員工都必須完成一個月的訓練。"） |
| a2-u09-l02-q10 | questionZh | 題目同步 | 改為 "訓練幾點開始？"（原 "新進員工必須完成什麼？"） |
| a2-u09-l02-q10 | options | 選項同步（正解位置不變） | 改為 ["At ten","At eight","At nine"]（原 ["A long trip","A big test","A month of training"]） |
| a2-u09-l02-q02 | exampleEn | 雷同自查：單字卡（works for a small company）和閱讀（works as a receptionist at a big company）雷同，改單字卡 | 改為 "My uncle started his own company last year."（原 "She works for a small company."） |
| a2-u09-l02-q02 | exampleZh | 中譯同步 | 改為 "我叔叔去年自己開了一家公司。"（原 "她在一家小公司上班。"） |
| a2-u09-l02 | properNouns | 第③關建議：English 沒有用到，移出專有名詞宣告 | 改為 ["Jenny"]（原 ["Jenny","English"]） |
| a2-u09-l03-q07 | glossZh | 第②關：assistant 釋義「助理的；副的」當形容詞，干擾項也全是形容詞（退休的／臨時的／前任的）：assistant 在 CEFR-J 的常用義是名詞「助理」，assistant manager 是名詞修飾名詞而非形容詞；建議例句改示範名詞（She is my assistant.）、釋義寫「助理」 | 改為 "助理"（原 "助理的；副的"）；改教名詞「助理」 |
| a2-u09-l03-q07 | exampleEn | 改示範名詞 assistant；也避開與 q14 雷同 | 改為 "She is looking for an assistant for her shop."（原 "She is the assistant manager of the shop."） |
| a2-u09-l03-q07 | exampleZh | 中譯同步 | 改為 "她正在為她的店找一位助理。"（原 "她是這家店的副理。"） |
| a2-u09-l03-q07 | distractorsZh | 干擾項改成同為名詞（人） | 改為 ["老闆","客戶","司機"]（原 ["退休的","臨時的","前任的"]） |
| a2-u09-l03-q14 | stemEn | 第②關：承上：mcq 以 assistant manager 為考點、optionGlossZh 寫「助理的」，教的是複合詞用法而非本課詞義；疑似應改考名詞 assistant | 改為 "My ____ helps me with my work. She writes my emails and answers the phone."（原 "She is our new ____ manager."）；改考名詞 assistant，且不再照抄單字卡（第③關 FIX 雷同一併解決）；選項與正解位置不變 |
| a2-u09-l03-q14 | stemZh | 題幹中譯同步 | 改為 "我的助理幫我處理工作，她幫我寫電子郵件、接電話。"（原 "她是我們新來的副理。"） |
| a2-u09-l03-q14 | optionGlossZh/3 | 選項釋義改為名詞 | 改為 "助理"（原 "助理的"） |
| a2-u09-l03-q15 | passageEn | 閱讀改用名詞 assistant，與單字卡詞義一致 | 改為 "Grandpa Lin was the chairman of a small toy maker for thirty years. Last month, he finally retired. At a party on his last day, his secretary and his assistant gave short speeches. \"He was a kind boss,\" they said. Now Grandpa Lin plays chess with his friends every afternoon."（原 "Grandpa Lin was the chairman of a small toy maker for thirty years. Last month, he finally retired. At a party on his last day, his secretary and his assistant manager gave short speeches. \"He was a kind boss,\" they said. Now Grandpa Lin plays chess with his friends every afternoon."） |
| a2-u09-l03-q15 | passageZh | 中譯同步 | 改為 "林爺爺當了一家小型玩具製造商的董事長三十年。上個月，他終於退休了。在他最後一天上班的派對上，他的秘書和助理都簡短致詞。他們說：「他是個很親切的老闆。」現在林爺爺每天下午都和朋友下棋。"（原 "林爺爺當了一家小型玩具製造商的董事長三十年。上個月，他終於退休了。在他最後一天上班的派對上，他的秘書和副理都簡短致詞。他們說：「他是個很親切的老闆。」現在林爺爺每天下午都和朋友下棋。"） |
| a2-u09-l03-q16 | promptZh | 第③關 FIX：翻譯題和 appointment 單字卡雷同（I have an appointment at…），換情境與句型 | 改為 "我忘了今天的約。"（原 "我今天下午三點有個約，不能遲到。"） |
| a2-u09-l03-q16 | referenceEn | 參考答案同步 | 改為 ["I forgot my appointment today.","I forgot about my appointment today."]（原 ["I have an appointment at three this afternoon, so I can't be late.","I can't be late because I have an appointment at three."]） |
| a2-u09-l03-q16 | rubricZh | 評分要點同步 | 改為 ["「約」用 appointment","「忘了」用過去式（例如 forgot、forgot about）"]（原 ["「有約」用 have an appointment","時間用 at＋時刻（例如 at three）","「不能遲到」可寫例如 can't be late"]） |
| a2-u09-l03-q09 | sentenceEn | 第③關疑似 S20：聽打句和 retire 單字卡同為「家人＋退休＋時間」，換句型與情境 | 改為 "After he retired, he started to learn the piano."（原 "My grandfather retired at sixty-five."） |
| a2-u09-l03-q09 | sentenceZh | 中譯同步 | 改為 "他退休後開始學鋼琴。"（原 "我爺爺六十五歲退休。"） |
| a2-u09-l03-q14 | stemEn | 自查：前一版題幹干擾項 boss 勉強也說得通，改成題幹排除 boss，只剩 assistant 一個正解；選項與正解位置不變 | 改為 "I'm the boss here, and Tom is my ____. He helps me every day."（原 "My ____ helps me with my work. She writes my emails and answers the phone."） |
| a2-u09-l03-q14 | stemZh | 題幹中譯同步 | 改為 "我是這裡的老闆，Tom 是我的助理，他每天都協助我。"（原 "我的助理幫我處理工作，她幫我寫電子郵件、接電話。"） |
| a2-u09-l03 | properNouns | 新增 Tom | 改為 ["Lin","Tom"]（原 ["Lin"]） |
| a2-u09-l04-q13 | stemEn | 第③關 FIX：題幹和 diary 單字卡雷同（write in diary every night），換情境與句型；選項與正解不變 | 改為 "I found my old ____ from when I was ten. It was fun to read it."（原 "I write about my day in my ____ every night."） |
| a2-u09-l04-q13 | stemZh | 題幹中譯同步 | 改為 "我找到十歲時寫的舊日記，讀起來很有趣。"（原 "我每天晚上都把一天的事寫在日記裡。"） |
| a2-u09-l04-q06 | exampleEn | 雷同自查：單字卡和 q10、q16 都是 barber cut hair，改單字卡（情境題保留最自然的搭配） | 改為 "My barber is very friendly and talks a lot."（原 "My barber has cut my hair for ten years."） |
| a2-u09-l04-q06 | exampleZh | 中譯同步 | 改為 "我的理髮師很親切，話也很多。"（原 "我的理髮師已經幫我剪頭髮剪了十年。"） |
| a2-u09-l04-q06 | exampleEn | friendly 在 lexicon 是 B2，改用 kind | 改為 "My barber is very kind and talks a lot."（原 "My barber is very friendly and talks a lot."） |
| a2-u09-l04-q13 | stemEn | 前一版題幹 15 字超過 A2 句長上限，再改 | 改為 "Last night I read my old ____ from when I was ten."（原 "I found my old ____ from when I was ten. It was fun to read it."） |
| a2-u09-l04-q13 | stemZh | 題幹中譯同步 | 改為 "昨晚我讀了我十歲時寫的舊日記。"（原 "我找到十歲時寫的舊日記，讀起來很有趣。"） |
| a2-u09-l04-q13 | stemEn | 雷同自查：避開單字卡的 every night | 改為 "Yesterday I read my old ____ from when I was ten."（原 "Last night I read my old ____ from when I was ten."） |
| a2-u09-l04-q13 | stemZh | 題幹中譯同步 | 改為 "昨天我讀了我十歲時寫的舊日記。"（原 "昨晚我讀了我十歲時寫的舊日記。"） |
| a2-u10-l01-q01 | exampleEn | 第③關疑似 S22：單字卡（a little salt and pepper）和閱讀雷同，改單字卡 | 改為 "I don't like pepper on my eggs."（原 "Add a little salt and pepper."） |
| a2-u10-l01-q01 | exampleZh | 中譯同步 | 改為 "我不喜歡在蛋上加胡椒。"（原 "加一點鹽和胡椒。"） |
| a2-u10-l01-q08 | exampleEn | 第③關全域 G1：pasta 單字卡和 u10-l08 spaghetti 單字卡幾乎同一句（with tomato sauce），兩邊都改 | 改為 "Pasta is my favorite food."（原 "We had pasta with tomato sauce for dinner."） |
| a2-u10-l01-q08 | exampleZh | 中譯同步 | 改為 "義大利麵是我最喜歡的食物。"（原 "我們晚餐吃了番茄醬汁義大利麵。"） |
| a2-u10-l02-q07 | glossZh | 第②關：疑似詞義不符：wordCard 字是 fry，但例句只用名詞 fries、釋義「薯條」；CEFR-J A2 的 fry 主要是動詞「（油）炸、煎」。依已裁原則應示範動詞（例如 Fry the eggs in a little oil.） | 不改：lexicon 的 fry 是名詞 A2、動詞 B1（第③關也確認 fry 名詞＝A2）；依「照該級詞性教」維持名詞「薯條」，不示範 B1 的動詞義 |
| a2-u10-l02-q15 | passageEn | 第③關疑似 S23：閱讀和 cooler 單字卡雷同（put drinks in the cooler），換句型 | 改為 "Last Saturday, Ben's family had a barbecue by the sea. They brought a big cooler full of cold drinks. Ben's father cooked steak, and his uncle brought fresh seafood from the market. Ben's little sister only wanted fries! In the afternoon, they had bread with jam as a snack."（原 "Last Saturday, Ben's family had a barbecue by the sea. They put cold drinks in a big cooler. Ben's father cooked steak, and his uncle brought fresh seafood from the market. Ben's little sister only wanted fries! In the afternoon, they had bread with jam as a snack."） |
| a2-u10-l02-q15 | passageZh | 中譯同步 | 改為 "上週六，Ben 一家人在海邊烤肉。他們帶了一個裝滿冰飲料的大保冷箱。Ben 的爸爸烤牛排，叔叔從市場帶來新鮮的海鮮。Ben 的妹妹只想吃薯條！下午，他們吃麵包配果醬當點心。"（原 "上週六，Ben 一家人在海邊烤肉。他們把冰飲料放進一個大保冷箱。Ben 的爸爸烤牛排，叔叔從市場帶來新鮮的海鮮。Ben 的妹妹只想吃薯條！下午，他們吃麵包配果醬當點心。"） |
| a2-u10-l02-q08 | exampleEn | 雷同自查：閱讀改寫後仍和單字卡共用 drinks，改單字卡 | 改為 "Our cooler keeps food cold all day."（原 "Put the drinks in the cooler."） |
| a2-u10-l02-q08 | exampleZh | 中譯同步 | 改為 "我們的保冷箱能讓食物冰一整天。"（原 "把飲料放進保冷箱。"） |
| a2-u10-l03 | properNouns | 第③關疑似 S2：Lin 同時像姓又像名，改名 Sara | 改為 ["Sara"]（原 ["Lin"]） |
| a2-u10-l03-q15 | passageEn | Lin 改 Sara | 改為 "Sara's family is trying a new diet this month. They eat more fish and vegetables, and they use less oil and salt. Sara's father stopped drinking beer, and her mother only has a little wine on Saturdays. They also make their own sauces without sugar. \"At first, I missed fried chicken,\" Sara says, \"but now I feel great.\""（原 "Lin's family is trying a new diet this month. They eat more fish and vegetables, and they use less oil and salt. Lin's father stopped drinking beer, and her mother only has a little wine on Saturdays. They also make their own sauces without sugar. \"At first, I missed fried chicken,\" Lin says, \"but now I feel great.\""） |
| a2-u10-l03-q15 | passageZh | 中譯同步 | 改為 "Sara 家這個月在嘗試新的飲食方式。他們多吃魚和蔬菜，少用油和鹽。Sara 的爸爸不再喝啤酒，媽媽只在星期六喝一點葡萄酒。他們也自己做不加糖的醬汁。Sara 說：「一開始我很想念炸雞，但現在我覺得身體很好。」"（原 "林家這個月在嘗試新的飲食方式。他們多吃魚和蔬菜，少用油和鹽。林的爸爸不再喝啤酒，媽媽只在星期六喝一點葡萄酒。他們也自己做不加糖的醬汁。林說：「一開始我很想念炸雞，但現在我覺得身體很好。」"） |
| a2-u10-l03-q15 | questions/0/questionZh | 題目同步 | 改為 "Sara 家這個月在飲食上做了什麼改變？"（原 "林家這個月在飲食上做了什麼改變？"） |
| a2-u10-l03-q15 | questions/1/questionZh | 題目同步 | 改為 "Sara 的媽媽什麼時候喝一點葡萄酒？"（原 "林的媽媽什麼時候喝一點葡萄酒？"） |
| a2-u10-l03-q17 | referenceEn | 第③關 FIX：參考答案 2 是願望不是平常習慣；參考答案 1 也避開新單字卡的 rice | 改為 ["My diet has a lot of fruit and vegetables.","I don't eat much meat in my diet."]（原 ["My diet has a lot of rice and vegetables.","I want to eat a healthier diet."]） |
| a2-u10-l03-q07 | exampleEn | 雷同自查：單字卡（diet includes lots of vegetables）和參考答案（diet has a lot of…vegetables）雷同，改單字卡 | 改為 "Rice is a big part of our diet."（原 "A healthy diet includes lots of vegetables."） |
| a2-u10-l03-q07 | exampleZh | 中譯同步 | 改為 "米飯是我們飲食中很重要的一部分。"（原 "健康的飲食包含大量蔬菜。"） |
| a2-u10-l03-q08 | exampleEn | 雷同自查：單字卡（tomato sauce）和 q14（tomato sauce on your pasta）雷同，改單字卡 | 改為 "This chicken comes with a sweet sauce."（原 "I love this tomato sauce."） |
| a2-u10-l03-q08 | exampleZh | 中譯同步 | 改為 "這道雞肉附一種甜甜的醬汁。"（原 "我好喜歡這個番茄醬汁。"） |
| a2-u10-l03-q16 | referenceEn/1 | 第③關疑似 S13：參考答案 2 多了題目沒有的 a little，改成同義改寫 | 改為 "This plate isn't big enough."（原 "This plate is a little too small."） |
| a2-u10-l03-q16 | rubricZh/1 | 評分要點同步 | 改為 "「太小」可寫例如 too small、isn't big enough"（原 "「太小」可寫例如 too small"） |
| a2-u10-l04-q17 | referenceEn/1 | 第③關 FIX：參考答案 2 的主詞是媽媽，不符題目「你怎麼吃」 | 改為 "I eat honey with bread for breakfast."（原 "My mother puts honey in hot milk."） |
| a2-u10-l04-q17 | rubricZh/1 | 評分要點同步 | 改為 "說吃法可寫例如 on my toast、with bread"（原 "「加在⋯上／裡」可寫例如 on my toast、in hot milk"） |
| a2-u10-l04-q01 | exampleEn | 雷同自查：單字卡（tablespoon of oil）和閱讀（tablespoons of oil）雷同，改單字卡 | 改為 "Add two tablespoons of sugar to the milk."（原 "Use one tablespoon of oil."） |
| a2-u10-l04-q01 | exampleZh | 中譯同步 | 改為 "在牛奶裡加兩大匙糖。"（原 "用一大匙的油。"） |
| a2-u10-l04-q01 | exampleEn | 雷同自查：前一版單字卡和 q14 題幹相同，再換 | 改為 "Mix one tablespoon of honey with warm water."（原 "Add two tablespoons of sugar to the milk."） |
| a2-u10-l04-q01 | exampleZh | 中譯同步 | 改為 "把一大匙蜂蜜和溫水混合。"（原 "在牛奶裡加兩大匙糖。"） |
| a2-u10-l04-q01 | exampleEn | 雷同自查：前一版單字卡和 q10 聽選句共用 mix honey with water，再換 | 改為 "One tablespoon of this sauce is enough."（原 "Mix one tablespoon of honey with warm water."） |
| a2-u10-l04-q01 | exampleZh | 中譯同步 | 改為 "這種醬汁一大匙就夠了。"（原 "把一大匙蜂蜜和溫水混合。"） |
| a2-u10-l05-q01 | exampleEn | 第②關：疑似不自然：She learned cooking from her grandmother. 母語者多說 learned to cook from…；若要示範名詞 cooking，可改 Cooking is her hobby.／She loves her grandmother's cooking. | 改為 "She loves her grandmother's cooking."（原 "She learned cooking from her grandmother."）；照建議改示範名詞 cooking |
| a2-u10-l05-q01 | exampleZh | 中譯同步 | 改為 "她很愛奶奶做的菜。"（原 "她跟奶奶學做菜。"） |
| a2-u10-l05-q01 | glossZh | 釋義對上例句用法 | 改為 "烹飪；廚藝；做的菜"（原 "烹飪；廚藝"） |
| a2-u10-l05-q05 | exampleEn | 第③關疑似 S24：單字卡、q13、閱讀三處都是用湯匙喝湯，改單字卡 | 改為 "This baby can't use a spoon yet."（原 "Eat your soup with a spoon."） |
| a2-u10-l05-q05 | exampleZh | 中譯同步 | 改為 "這個寶寶還不會用湯匙。"（原 "用湯匙喝湯。"） |
| a2-u10-l05-q13 | stemEn | 第③關疑似 S24：q13 也改情境；選項與正解不變 | 改為 "I need a ____ for my ice cream."（原 "Please give me a ____. I want to eat my soup."） |
| a2-u10-l05-q13 | stemZh | 題幹中譯同步 | 改為 "我需要一支湯匙來吃冰淇淋。"（原 "請給我一支湯匙，我要喝湯。"） |
| a2-u10-l05-q01 | exampleEn | 雷同自查：前一版單字卡和 q17 參考答案相同（grandmother's cooking），改用複審建議的另一句 | 改為 "Cooking is her hobby."（原 "She loves her grandmother's cooking."） |
| a2-u10-l05-q01 | exampleZh | 中譯同步 | 改為 "做菜是她的嗜好。"（原 "她很愛奶奶做的菜。"） |
| a2-u10-l05-q01 | glossZh | 釋義回到原本（例句已不是「做的菜」） | 改為 "烹飪；廚藝"（原 "烹飪；廚藝；做的菜"） |
| a2-u10-l05-q01 | exampleEn | 雷同自查：前一版單字卡和 q12 跟讀句相同，再換 | 改為 "My dad does all the cooking at home."（原 "Cooking is her hobby."） |
| a2-u10-l05-q01 | exampleZh | 中譯同步 | 改為 "我家的菜都是爸爸煮的。"（原 "做菜是她的嗜好。"） |
| a2-u10-l06-q12 | stemEn | 第③關 FIX：題幹和 champagne 單字卡雷同（open a bottle of champagne），換情境與句型；選項與正解不變 | 改為 "We won the game! Let's have a glass of ____."（原 "Let's open a bottle of ____ to celebrate!"） |
| a2-u10-l06-q12 | stemZh | 題幹中譯同步 | 改為 "我們贏了比賽！來喝一杯香檳吧。"（原 "我們開一瓶香檳來慶祝吧！"） |
| a2-u10-l06-q13 | stemEn | 第③關 FIX：題幹和 mug 單字卡雷同（drink coffee from a mug），換情境與句型；選項與正解不變 | 改為 "I need a clean ____ for my hot chocolate."（原 "I drink my coffee from a ____ every morning."） |
| a2-u10-l06-q13 | stemZh | 題幹中譯同步 | 改為 "我需要一個乾淨的馬克杯來裝熱可可。"（原 "我每天早上都用馬克杯喝咖啡。"） |
| a2-u10-l06-q04 | exampleEn | 雷同自查：單字卡（drinks coffee from a big mug）和閱讀（drinks coffee or tea from their own mug）雷同，改單字卡 | 改為 "This mug was a gift from my best friend."（原 "He drinks coffee from a big mug."） |
| a2-u10-l06-q04 | exampleZh | 中譯同步 | 改為 "這個馬克杯是我最好的朋友送的禮物。"（原 "他用一個大馬克杯喝咖啡。"） |
| a2-u10-l06-q16 | referenceEn/1 | 第③關 FIX：參考答案 2 的主詞是哥哥，不符題目「你喜歡或不喜歡」 | 改為 "I don't like fried fish."（原 "My brother orders fried rice every time."） |
| a2-u10-l06-q16 | rubricZh | 第③關疑似 S10：放寬位置；第二條隨參考答案改 | 改為 ["fried 常放在食物名稱前（例如 fried chicken、fried rice），也可以放在 be 動詞後面（例如 The chicken was fried.）","說喜不喜歡可寫例如 I love…、I don't like…"]（原 ["fried 放在食物名稱前（例如 fried chicken、fried rice）","主詞和動詞要搭配（例如 My brother orders）"]） |
| a2-u10-l06-q03 | exampleEn | 第③關全域 G2：單字卡和 u10-l09 聽打句幾乎同一句（I don't eat … food very often），改這邊 | 改為 "The fried potatoes at this restaurant are very good."（原 "I don't eat fried food very often."） |
| a2-u10-l06-q03 | exampleZh | 中譯同步 | 改為 "這家餐廳的炸馬鈴薯很好吃。"（原 "我不常吃油炸食物。"） |
| a2-u10-l06-q16 | rubricZh/0 | 前一版超過 80 字元，縮短 | 改為 "fried 常放在食物前（例如 fried chicken），也可放在 be 動詞後（例如 The chicken was fried.）"（原 "fried 常放在食物名稱前（例如 fried chicken、fried rice），也可以放在 be 動詞後面（例如 The chicken was fried.）"） |
| a2-u10-l07-q01 | glossZh | 第②關：疑似詞義選擇：crisp 以英式名詞 crisps（洋芋片）示範；若 CEFR-J A2 的 crisp 是形容詞「脆的」，則與已裁原則（該級詞性）不符，建議核對 lexicon 詞性後再定 | 不改：已核對 lexicon，crisp 只有名詞 A2（第③關也確認），維持名詞「洋芋片」 |
| a2-u10-l07-q05 | exampleEn | 第③關 FIX：q15 翻譯和 grilled 單字卡都是點餐情境；改單字卡的情境與句型（翻譯題不必改成比較健康與否的句子） | 改為 "Dad made grilled corn at the barbecue."（原 "I'll have the grilled fish, please."） |
| a2-u10-l07-q05 | exampleZh | 中譯同步 | 改為 "爸爸在烤肉時做了烤玉米。"（原 "我要烤魚，謝謝。"） |
| a2-u10-l07-q07 | exampleEn | 雷同自查：單字卡（roast a chicken）和 q09、閱讀（roasted a chicken）雷同，改單字卡 | 改為 "Let's roast some potatoes for dinner."（原 "We roast a chicken every Sunday."） |
| a2-u10-l07-q07 | exampleZh | 中譯同步 | 改為 "我們晚餐來烤些馬鈴薯吧。"（原 "我們每個星期天都烤一隻雞。"） |
| a2-u10-l07-q01 | exampleEn | 雷同自查：單字卡（a bag of crisps）和閱讀（bags of crisps）雷同，改單字卡 | 改為 "My brother eats crisps while he watches TV."（原 "I bought a bag of crisps."） |
| a2-u10-l07-q01 | exampleZh | 中譯同步 | 改為 "我弟弟邊看電視邊吃洋芋片。"（原 "我買了一包洋芋片。"） |
| a2-u10-l07-q07 | exampleEn | 雷同自查：前一版單字卡和 q16 參考答案共用 roast potatoes，再換 | 改為 "My uncle roasts coffee beans in his shop."（原 "Let's roast some potatoes for dinner."） |
| a2-u10-l07-q07 | exampleZh | 中譯同步 | 改為 "我叔叔在他的店裡烘焙咖啡豆。"（原 "我們晚餐來烤些馬鈴薯吧。"） |
| a2-u10-l07-q07 | glossZh | 釋義對上例句用法 | 改為 "烤；烘焙（肉、咖啡豆等）"（原 "烤（肉等）"） |
| a2-u10-l08-q11 | sentenceEn | 第③關 FIX：跟讀句和 chili 單字卡雷同（too much chili in…），換句型 | 改為 "Do you want some chili on your rice?"（原 "Don't put too much chili in the curry."） |
| a2-u10-l08-q11 | sentenceZh | 中譯同步 | 改為 "你的飯要不要加點辣椒？"（原 "咖哩裡別放太多辣椒。"） |
| a2-u10-l08-q13 | stemEn | 第③關 FIX：題幹和 boiled 單字卡雷同（two boiled eggs），換情境與句型；選項與正解不變 | 改為 "Do you want your potatoes ____ or fried?"（原 "I'd like two ____ eggs, please."） |
| a2-u10-l08-q13 | stemZh | 題幹中譯同步 | 改為 "你的馬鈴薯要水煮的還是炸的？"（原 "我要兩顆水煮蛋。"） |
| a2-u10-l08-q04 | exampleEn | 第③關全域 G1：和 u10-l01 pasta 單字卡幾乎同一句，改這邊 | 改為 "My little brother eats spaghetti with his hands!"（原 "We cooked spaghetti with tomato sauce."） |
| a2-u10-l08-q04 | exampleZh | 中譯同步 | 改為 "我弟弟用手抓義大利麵吃！"（原 "我們煮了番茄醬汁義大利麵。"） |
| a2-u10-l09-q14 | questions/0/questionZh | 第③關疑似 S11：補量詞，中文較順 | 改為 "他們那天為什麼去一家不錯的餐廳？"（原 "他們那天為什麼去不錯的餐廳？"） |
| a2-u10-l09-q06 | exampleEn | 第③關疑似 S25：單字卡（cook the fish in olive oil）和閱讀（fish cooked in olive oil）雷同，改單字卡 | 改為 "I like bread with olive oil."（原 "Cook the fish in a little olive oil."） |
| a2-u10-l09-q06 | exampleZh | 中譯同步 | 改為 "我喜歡麵包沾橄欖油。"（原 "用一點橄欖油煎魚。"） |
| a2-u10-l09-q04 | exampleEn | 雷同自查：單字卡（main course was steak）和閱讀（main course…steak）雷同，改單字卡 | 改為 "The main course will be ready in ten minutes."（原 "The main course was steak with vegetables."） |
| a2-u10-l09-q04 | exampleZh | 中譯同步 | 改為 "主菜再十分鐘就好了。"（原 "主菜是牛排配蔬菜。"） |
| a2-u10-l09-q07 | exampleEn | 第③關疑似 S25：單字卡（soft drinks…for the kids）和 q15 參考答案雷同，改單字卡 | 改為 "This shop sells soft drinks and ice cream."（原 "We have soft drinks and juice for the kids."） |
| a2-u10-l09-q07 | exampleZh | 中譯同步 | 改為 "這家店賣汽水和冰淇淋。"（原 "我們為孩子們準備了汽水和果汁。"） |
| a2-u11-l01-q10 | audioZh | 第②關：「東西很便宜」：原文是 the food is inexpensive（食物便宜），中譯擴大成「東西」，且題目問的正是「食物」；宜作「而且食物很便宜」 | 改為 "夜市每天都有開，而且食物很便宜。"（原 "夜市每天都有開，而且東西很便宜。"）；「東西」改「食物」，忠於原文 |
| a2-u11-l01-q17 | rubricZh/1 | 第②關：過嚴：「放名詞前時冠詞用 an」會把 the inexpensive cafe、inexpensive hotels 等正確寫法判錯；宜改「用不定冠詞時要用 an（例如 an inexpensive hotel）」 | 改為 "用不定冠詞時要用 an（例如 an inexpensive hotel）"（原 "放名詞前時冠詞用 an（an inexpensive…）"）；照建議放寬 |
| a2-u11-l01-q05 | exampleEn | 雷同自查：單字卡（Please keep your receipt）和 q11 跟讀句（Can I have the receipt, please?）同為店家對話的請求句，改單字卡 | 改為 "I can't find the receipt for these shoes."（原 "Please keep your receipt."） |
| a2-u11-l01-q05 | exampleZh | 中譯同步 | 改為 "我找不到這雙鞋的收據。"（原 "請保留你的收據。"） |
| a2-u11-l02-q14 | passageEn | 第②關：Now Lisa has three workers and a busy business. 中 a busy business 不自然；宜作 …and her business is doing well／her shop is very busy | 改為 "Lisa has a small shop that sells soap and other beauty products. Her customers love them because they are made from natural things. Last year, she had a small budget, so production was slow. Then a big company offered her a deal: they wanted to sell her products in their stores. Now Lisa has three workers, and her shop is very busy."（原 "Lisa has a small shop that sells soap and other beauty products. Her customers love them because they are made from natural things. Last year, she had a small budget, so production was slow. Then a big company offered her a deal: they wanted to sell her products in their stores. Now Lisa has three workers and a busy business."）；照建議改自然說法 |
| a2-u11-l02-q14 | passageZh | 中譯同步 | 改為 "Lisa 開了一家小店，賣肥皂和其他美容產品。她的顧客很喜歡這些產品，因為都是用天然的東西做的。去年她的預算不多，所以生產得很慢。後來一家大公司跟她談了一筆交易：他們想在自己的店裡賣她的產品。現在 Lisa 有三名員工，店裡生意很忙。"（原 "Lisa 開了一家小店，賣肥皂和其他美容產品。她的顧客很喜歡這些產品，因為都是用天然的東西做的。去年她的預算不多，所以生產得很慢。後來一家大公司跟她談了一筆交易：他們想在自己的店裡賣她的產品。現在 Lisa 有三名員工，生意也很忙碌。"） |
| a2-u11-l02-q12 | stemEn | 第③關 FIX：題幹和 production 單字卡雷同（The production of this … started/stopped），換句型；用 bikes 避開單字卡的 car；選項與正解不變 | 改為 "The ____ at this factory is about two hundred bikes a day."（原 "The ____ of this phone stopped last year."） |
| a2-u11-l02-q12 | stemZh | 題幹中譯同步 | 改為 "這家工廠的產量大約是每天兩百輛腳踏車。"（原 "這款手機去年就停產了。"） |
| a2-u11-l02-q10 | sentenceEn | 第③關疑似 S5：come out（上市）是片語引申義，可能高於 A2，改寫；中譯不變 | 改為 "Their new product will be in the shops in May."（原 "Their new product will come out in May."） |
| a2-u11-l02-q01 | exampleEn | 第③關疑似 S27：單字卡（This shop sells beauty products）和閱讀（shop that sells…beauty products）雷同，改單字卡 | 改為 "This company makes products for babies."（原 "This shop sells beauty products."） |
| a2-u11-l02-q01 | exampleZh | 中譯同步 | 改為 "這家公司生產嬰兒用品。"（原 "這家店賣美容產品。"） |
| a2-u11-l03-q02 | exampleEn | 第②關：exchange 的例句只出現複合詞 exchange rate（匯率），沒有示範釋義「交換；兌換」本身的用法；建議改如 I want to exchange this shirt for a bigger one.／Where can I exchange money? | 改為 "The shop said no to my exchange because I lost the receipt."（原 "The bank has a good exchange rate today."）；依裁示：購物單元的 exchange 教「換貨」名詞義（lexicon：exchange 名詞 A2、動詞 B1），單字卡改示範換貨 |
| a2-u11-l03-q02 | exampleZh | 中譯同步 | 改為 "我把收據弄丟了，所以店家不讓我換貨。"（原 "這家銀行今天的匯率很好。"） |
| a2-u11-l03-q02 | glossZh | 依裁示兩義並列，含換貨 | 改為 "交換；兌換；換貨"（原 "交換；兌換"） |
| a2-u11-l03-q14 | passageEn | 第③關疑似 S1＋裁示：student exchange 和購物單元無關，改 school trip，並補一句換貨情境 | 改為 "Last year, Ben went to Japan on a school trip. His father gave him some cash and a credit card. In Japan, Ben found that famous brands were very expensive, but food in small shops was cheap. He bought a shirt, but it was too big, so he made an exchange for a smaller one. He also visited a museum with no entrance fee. \"You don't need great wealth to have a good time,\" he wrote to his father."（原 "Last year, Ben went to Japan on a student exchange. Before he left, his father gave him some cash and a credit card. In Japan, Ben found that famous brands were very expensive, but food in small shops was cheap. He also visited a museum with no entrance fee. \"You don't need great wealth to have a good time,\" he wrote to his father."） |
| a2-u11-l03-q14 | passageZh | 中譯同步 | 改為 "去年，Ben 參加學校旅行去了日本。爸爸給了他一些現金和一張信用卡。在日本，Ben 發現名牌很貴，但小店裡的食物很便宜。他買了一件襯衫，可是太大了，所以去換了一件小一點的。他還去了一間不收門票的博物館。他寫信跟爸爸說：「不需要很多財富，也能過得很開心。」"（原 "去年，Ben 參加交換學生去了日本。出發前，爸爸給了他一些現金和一張信用卡。在日本，Ben 發現名牌很貴，但小店裡的食物很便宜。他還去了一間不收門票的博物館。他寫信跟爸爸說：「不需要很多財富，也能過得很開心。」"） |
| a2-u11-l03-q14 | questions/0/options | Q1 選項隨短文改（正解位置不變） | 改為 ["參加學校旅行","去工作","去看朋友"]（原 ["參加交換學生","去工作","去度假"]） |
| a2-u11-l03-q11 | sentenceEn | 第③關 FIX：跟讀句和 cheap 單字卡雷同（X at the market is cheap），換句型與情境 | 改為 "Is there a cheap hotel near the station?"（原 "The shoes at the market are cheap but good."） |
| a2-u11-l03-q11 | sentenceZh | 中譯同步 | 改為 "車站附近有便宜的旅館嗎？"（原 "市場賣的鞋子便宜又好。"） |
| a2-u11-l03-q13 | stemEn | 第③關全域 G2：和 u11-l01 q13（These shoes were only ten dollars）幾乎同一情境，改這邊；選項與正解不變 | 改為 "This bag was ____, but it broke after a week."（原 "These shoes were very ____. They only cost ten dollars."） |
| a2-u11-l03-q13 | stemZh | 題幹中譯同步 | 改為 "這個包包很便宜，可是用一個星期就壞了。"（原 "這雙鞋很便宜，只要十塊錢。"） |
| a2-u11-l03-q01 | exampleEn | 雷同自查：單字卡（Can I pay by credit card?）和 q09 聽選句（if you pay by credit card）雷同，改單字卡 | 改為 "I lost my credit card yesterday."（原 "Can I pay by credit card?"） |
| a2-u11-l03-q01 | exampleZh | 中譯同步 | 改為 "我昨天弄丟了我的信用卡。"（原 "我可以刷信用卡嗎？"） |
| a2-u11-l03-q06 | exampleEn | 第③關全域 G2：和 u11-l02 trade 單字卡都用 tea trade，改這邊 | 改為 "Health is more important than wealth."（原 "The family's wealth came from the tea trade."） |
| a2-u11-l03-q06 | exampleZh | 中譯同步 | 改為 "健康比財富更重要。"（原 "這個家族的財富來自茶葉買賣。"） |
| a2-u11-l03-q06 | distractorsZh | 例句出現「健康」，干擾項拿掉「健康」 | 改為 ["名聲","知識","友誼"]（原 ["健康","名聲","知識"]） |
| a2-u11-l04-q14 | passageEn | 第②關：an old bill from a bookshop 不自然：書店買書留下的應是 receipt（收據），bill 多指待付帳單；且中譯「書店的舊帳單」也怪。建議改成其他場景的 bill，或改寫 | 改為 "Last week, we helped Grandpa clean his house and found an old box. Inside were some old coins and an old receipt from a bookshop. \"This is my treasure,\" Grandpa said. When he was young, he worked at a drugstore. With the first money he earned, he paid the rent for a small room and bought his first book."（原 "Last week, we helped Grandpa clean his house and found an old box. Inside were some old coins and an old bill from a bookshop. \"This is my treasure,\" Grandpa said. When he was young, he worked at a drugstore. With his first money, he paid the rent for a small room and bought his first book."）；bill 改 receipt（第③關疑似 S3 同建議）；With his first money 改 With the first money he earned |
| a2-u11-l04-q14 | passageZh | 中譯同步 | 改為 "上週，我們幫爺爺打掃房子，發現了一個舊盒子。裡面有一些舊硬幣和一張書店的舊收據。爺爺說：「這是我的寶物。」他年輕的時候在藥房工作。他用第一筆薪水付了一個小房間的租金，還買了人生第一本書。"（原 "上週，我們幫爺爺打掃房子，發現了一個舊盒子。裡面有一些舊硬幣和一張書店的舊帳單。爺爺說：「這是我的寶物。」他年輕的時候在藥房工作。他用第一筆薪水付了一個小房間的租金，還買了人生第一本書。"） |
| a2-u11-l04-q14 | questions/0/options/2 | 選項同步（正解位置不變） | 改為 "舊硬幣和一張舊收據"（原 "舊硬幣和一張舊帳單"） |
| a2-u11-l04-q13 | options/0 | 第③關疑似 S4：干擾項 treasure 當動詞填入仍合文法，換成名詞 drugstore | 改為 "drugstore"（原 "treasure"） |
| a2-u11-l04-q13 | optionGlossZh/0 | 選項釋義同步 | 改為 "藥妝店"（原 "寶物"） |
| a2-u11-l04-q07 | exampleEn | 第③關疑似 S28：單字卡（There is a … bookshop next to…）和 q12（Is there a bookshop near here?）句型相近，改單字卡 | 改為 "My aunt has a bookshop in a small town."（原 "There is a small bookshop next to the cafe."） |
| a2-u11-l04-q07 | exampleZh | 中譯同步 | 改為 "我阿姨在一個小鎮開了一家書店。"（原 "咖啡店旁邊有一家小書店。"） |
| a2-u11-l04-q01 | exampleEn | 第③關疑似 S28：單字卡（We rent a small apartment…）和 q13（We always rent a car…）同主詞同句型，改單字卡 | 改為 "Many students rent rooms near the school."（原 "We rent a small apartment near the station."） |
| a2-u11-l04-q01 | exampleZh | 中譯同步 | 改為 "很多學生在學校附近租房間。"（原 "我們在車站附近租了一間小公寓。"） |
| a2-u11-l05-q15 | promptZh | 第②關：「這顆糖果要五十分錢」：「分錢」不是台灣用語（台灣說「美分」或直接用「元」），題目中文不自然；建議改「這顆糖果要五十美分」，評分要點也一併調整 | 改為 "我口袋裡只剩幾美分。"（原 "這顆糖果要五十分錢。"）；「分錢」改台灣說法「美分」；同時依第③關 FIX 換掉和 pence 單字卡雷同的「X costs fifty …」情境 |
| a2-u11-l05-q15 | referenceEn | 參考答案同步 | 改為 ["I only have a few cents in my pocket.","There are only a few cents in my pocket."]（原 ["This candy costs fifty cents.","This candy is fifty cents."]） |
| a2-u11-l05-q15 | rubricZh | 評分要點同步 | 改為 ["「美分」用 cents（複數）","「只有幾⋯」可寫例如 only a few"]（原 ["「分錢」用 cents（複數）","「要⋯錢」可寫例如 costs、is"]） |
| a2-u11-l05-q02 | exampleZh | 第②關：「一美元等於一百分」：原文 One dollar 未指明美元，「美元」屬補充，可接受但嚴格說不忠實；若保留「美元」，「一百分」宜作「一百美分」以免與分數混淆 | 改為 "一美元等於一百美分。"（原 "一美元等於一百分。"）；「一百分」改「一百美分」，避免與分數混淆 |
| a2-u11-l05-q02 | glossZh | 釋義與中譯一致 | 改為 "分；美分（貨幣單位）"（原 "分（貨幣單位）"） |
| a2-u11-l05-q14 | passageEn | 第③關疑似 S29：閱讀和 department store 單字卡都是在百貨公司買外套 | 改為 "Emma lives in London. Last Saturday, the department store near her home had a big sale. Everything was half-price! Emma bought a sweater and some shoes. A kind shop assistant helped her find the right size. On her way home, she stopped at a grocery store and bought some milk for ninety pence."（原 "Emma lives in London. Last Saturday, the department store near her home had a big sale. Everything was half-price! Emma bought a coat and some shoes. A kind shop assistant helped her find the right size. On her way home, she stopped at a grocery store and bought some milk for ninety pence."） |
| a2-u11-l05-q14 | passageZh | 中譯同步 | 改為 "Emma 住在倫敦。上週六，她家附近的百貨公司辦大特價，所有東西都半價！Emma 買了一件毛衣和幾雙鞋。一位親切的店員幫她找到合適的尺寸。回家路上，她順道去了雜貨店，花九十便士買了一些牛奶。"（原 "Emma 住在倫敦。上週六，她家附近的百貨公司辦大特價，所有東西都半價！Emma 買了一件外套和幾雙鞋。一位親切的店員幫她找到合適的尺寸。回家路上，她順道去了雜貨店，花九十便士買了一些牛奶。"） |
| a2-u11-l05-q01 | exampleEn | 雷同自查：單字卡（pays his bills by cheque）和 q13（Can I pay by cheque?）雷同，改單字卡 | 改為 "My grandfather still writes cheques."（原 "My grandfather still pays his bills by cheque."） |
| a2-u11-l05-q01 | exampleZh | 中譯同步 | 改為 "我爺爺到現在還在開支票。"（原 "我爺爺到現在還用支票付帳單。"） |
| a2-u11-l05-q04 | exampleEn | 雷同自查：單字卡（milk…from the grocery store）和閱讀（grocery store…bought some milk）雷同，改單字卡 | 改為 "There is a grocery store under our apartment."（原 "I need milk and eggs from the grocery store."） |
| a2-u11-l05-q04 | exampleZh | 中譯同步 | 改為 "我們公寓樓下有一家雜貨店。"（原 "我需要去雜貨店買牛奶和蛋。"） |
| a2-u11-l05-q05 | exampleEn | 雷同自查：單字卡（All shirts are half-price today）和閱讀（Everything was half-price!）雷同，改單字卡 | 改為 "Children's tickets are half-price."（原 "All shirts are half-price today."） |
| a2-u11-l05-q05 | exampleZh | 中譯同步 | 改為 "兒童票半價。"（原 "今天所有襯衫都半價。"） |
| a2-u12-l01-q01 | exampleEn | 雷同自查：單字卡（sit on that bench in the park）和 q12、閱讀（sitting / sat on a bench）雷同，改單字卡 | 改為 "There are three benches near the bus stop."（原 "Let's sit on that bench in the park."） |
| a2-u12-l01-q01 | exampleZh | 中譯同步 | 改為 "公車站附近有三張長椅。"（原 "我們去公園那張長椅坐坐吧。"） |
| a2-u12-l01-q02 | exampleEn | 雷同自查：單字卡和閱讀都用 took＋downtown，改單字卡 | 改為 "My office is downtown."（原 "We took a bus downtown."） |
| a2-u12-l01-q02 | exampleZh | 中譯同步 | 改為 "我的辦公室在市中心。"（原 "我們搭公車去市中心。"） |
| a2-u12-l01-q07 | exampleEn | 雷同自查：單字卡（an indoor pool）和 q11 聽選句（the indoor pool）雷同，改單字卡 | 改為 "Basketball is an indoor sport."（原 "The hotel has an indoor pool."） |
| a2-u12-l01-q07 | exampleZh | 中譯同步 | 改為 "籃球是室內運動。"（原 "這家飯店有室內游泳池。"） |
| a2-u12-l01-q09 | exampleEn | 雷同自查：單字卡（How many countries have you visited?）和 q18 參考答案（visit a country）雷同，改單字卡 | 改為 "Which country are you from?"（原 "How many countries have you visited?"） |
| a2-u12-l01-q09 | exampleZh | 中譯同步 | 改為 "你來自哪個國家？"（原 "你去過幾個國家？"） |
| a2-u12-l02-q16 | passageEn | 第②關：疑似：開頭 "Taiwan is a small nation" 把台灣定位為 nation，屬政治敏感表述（規則 9 不碰政治）；建議改 "Taiwan is a small island" 之類，nation 改用在別句（例如 the whole nation）。 | 改為 "Taiwan is a small island, but it has a lot to see. In the north, Taipei is a big international city. In the center of the island, there are high mountains. Every area has its own local food. The national parks are beautiful, and there are many places for hiking."（原 "Taiwan is a small nation, but it has a lot to see. In the north, Taipei is a big international city. In the center of the island, there are high mountains. Every area has its own local food. The national parks are beautiful, and there are many places for hiking."）；依裁示不寫國家地位相關表述 |
| a2-u12-l02-q16 | passageZh | 中譯同步 | 改為 "台灣是座小島，但有很多值得看的東西。北部的台北是一座國際大城市。島的中央有高山。每個地區都有自己的在地美食。國家公園很漂亮，也有很多地方可以健行。"（原 "台灣是個小國家，但有很多值得看的東西。北部的台北是一座國際大城市。島的中央有高山。每個地區都有自己的在地美食。國家公園很漂亮，也有很多地方可以健行。"） |
| a2-u12-l02-q10 | sentenceEn | 閱讀拿掉 nation 後補一題 nation 的中性情境（space 仍有 q17 翻譯） | 改為 "People from every nation come to this festival."（原 "Is there enough space for my bike?"） |
| a2-u12-l02-q10 | sentenceZh | 中譯同步 | 改為 "來自各國的人都會來參加這個節慶。"（原 "有足夠的空間放我的腳踏車嗎？"） |
| a2-u12-l02-q14 | options/0 | 第③關 FIX：干擾項 center 填入也通，只能靠地理常識排除；換成填入不成句的 position | 改為 "position"（原 "center"） |
| a2-u12-l02-q14 | optionGlossZh/0 | 選項釋義同步 | 改為 "位置"（原 "中心"） |
| a2-u12-l02-q05 | exampleEn | 雷同自查：單字卡（Taipei has an international airport）和閱讀（Taipei is a big international city）雷同，改單字卡 | 改為 "This is an international school, so students come from many countries."（原 "Taipei has an international airport."） |
| a2-u12-l02-q05 | exampleZh | 中譯同步 | 改為 "這是一所國際學校，學生來自很多國家。"（原 "台北有國際機場。"） |
| a2-u12-l03-q04 | exampleEn | 第②關：疑似：「Which direction is the station?」口語勉強可通，但較道地是 "Which direction is the station in?" 或 "Which way is the station?"；當單字卡範例宜用標準句。 | 改為 "Which direction is the station in?"（原 "Which direction is the station?"）；照建議改標準句 |
| a2-u12-l03-q17 | referenceEn/0 | 第②關："Can you tell me the direction to the museum?" 不道地：問路要用 directions（複數，指路線說明）或 the way to；單數 the direction to 是錯誤示範。 | 改為 "Is the museum in this direction?"（原 "Can you tell me the direction to the museum?"）；the direction to 不道地，改用 in this direction 問路 |
| a2-u12-l03-q17 | rubricZh/1 | 第②關：「「往這個方向」用 in this direction」寫死；Go this direction（美式常見）也正確，且題目不一定要寫「往這個方向」；建議改「例如 in this direction、the wrong direction」並不作必要條件。 | 改為 "介系詞可寫例如 in this direction、in the wrong direction（寫 go this direction 也可以）"（原 "「往這個方向」用 in this direction"）；改成「例如」，不當必要條件 |
| a2-u12-l03-q15 | passageEn | 第②關：疑似：「the business zone」不自然，一般說 business district／business area；zone 搭配宜改用 quiet zone、time zone 等常見用法。 | 改為 "Amy grew up in a small village in the south of Taiwan. When she was eighteen, she moved north to study in a big city. At first, she often got lost because she had no sense of direction. Now she works in an office in the east of the city. But every New Year, she goes back to her village."（原 "Amy grew up in a small village in the south of Taiwan. When she was eighteen, she moved north to study in a big city. At first, she often got lost because she had no sense of direction. Now she works in the business zone in the east of the city. But every New Year, she goes back to her village."）；business zone 不自然；zone 改在 q11 跟讀句用常見搭配 |
| a2-u12-l03-q15 | passageZh | 中譯同步 | 改為 "Amy 在台灣南部的一個小村莊長大。十八歲時，她搬到北部的大城市讀書。一開始她常常迷路，因為她完全沒有方向感。現在她在城市東區的一間辦公室工作。不過每年過年，她都會回到她的村莊。"（原 "Amy 在台灣南部的一個小村莊長大。十八歲時，她搬到北部的大城市讀書。一開始她常常迷路，因為她完全沒有方向感。現在她在城市東區的商業區工作。不過每年過年，她都會回到她的村莊。"） |
| a2-u12-l03-q11 | sentenceEn | 閱讀拿掉 zone 後補 zone 的常見搭配情境（direction 仍有閱讀與 q17） | 改為 "You can't park here. It's a no-parking zone."（原 "We walked in the wrong direction."） |
| a2-u12-l03-q11 | sentenceZh | 中譯同步 | 改為 "這裡不能停車，這是禁止停車區。"（原 "我們走錯方向了。"） |
| a2-u12-l03-q01 | exampleEn | 雷同自查：單字卡（Kaohsiung is in the south of Taiwan）和閱讀（in the south of Taiwan）雷同，改單字卡 | 改為 "Many birds fly south in winter."（原 "Kaohsiung is in the south of Taiwan."） |
| a2-u12-l03-q01 | exampleZh | 中譯同步 | 改為 "很多鳥在冬天往南飛。"（原 "高雄在台灣南部。"） |
| a2-u12-l03-q01 | glossZh | 釋義對上例句用法 | 改為 "南方；南部；往南"（原 "南方；南部"） |
| a2-u12-l03-q07 | exampleEn | 雷同自查：單字卡（not my native language）和 q14（your native language?）雷同，改單字卡 | 改為 "My teacher's native country is Canada."（原 "English is not my native language."） |
| a2-u12-l03-q07 | exampleZh | 中譯同步 | 改為 "我老師的祖國是加拿大。"（原 "英文不是我的母語。"） |
| a2-u12-l03 | properNouns | 新增 Canada | 改為 ["Kaohsiung","Taiwan","Hualien","Tokyo","Japan","English","Chinese","Amy","Seoul","Korea","Canada"]（原 ["Kaohsiung","Taiwan","Hualien","Tokyo","Japan","English","Chinese","Amy","Seoul","Korea"]） |
| a2-u12-l04-q03 | exampleEn | 雷同自查：單字卡（wants to study abroad next year）和 q16 參考答案（work abroad next year）雷同，改單字卡 | 改為 "My uncle lives abroad, so I only see him once a year."（原 "She wants to study abroad next year."） |
| a2-u12-l04-q03 | exampleZh | 中譯同步 | 改為 "我叔叔住在國外，所以我一年只見到他一次。"（原 "她明年想出國留學。"） |
| a2-u12-l04-q04 | exampleEn | 雷同自查：單字卡（love the architecture of this old city）和閱讀（loved the old architecture）雷同，改單字卡 | 改為 "My sister studies architecture at university."（原 "I love the architecture of this old city."） |
| a2-u12-l04-q04 | exampleZh | 中譯同步 | 改為 "我姊姊在大學念建築。"（原 "我很喜歡這座古城的建築。"） |
| a2-u12-l05-q15 | passageEn | 第②關：疑似：「our school trip went to an old castle」主詞搭配生硬，較自然寫法 "On our school trip, we went to…" 或 "our school took us on a trip to…"。 | 改為 "Last month, we went on a school trip to an old castle by the sea. Long ago, the castle was the home of a queen. In one room, we saw her gold crown. Near the castle, there was a playground for children and a big car park for buses. On the way back, our teacher said, \"Next year, we can go overseas!\""（原 "Last month, our school trip went to an old castle by the sea. The castle used to be the home of a queen. In one room, we saw her gold crown. Near the castle, there was a playground for children and a big car park for buses. On the way back, our teacher said, \"Next year, we can go overseas!\""）；主詞搭配改自然；同時依第③關 FIX 拿掉 used to（B1） |
| a2-u12-l05-q15 | passageZh | 中譯同步 | 改為 "上個月，我們學校校外教學去了海邊的一座古堡。很久以前，這座城堡是一位女王的家。在其中一個房間裡，我們看到了她的金色王冠。城堡附近有一座兒童遊樂場和一個供遊覽車停的大停車場。回程的路上，老師說：「明年我們可以出國去！」"（原 "上個月，我們學校校外教學去了海邊的一座古堡。這座城堡以前是一位女王的家。在其中一個房間裡，我們看到了她的金色王冠。城堡附近有一座兒童遊樂場和一個供遊覽車停的大停車場。回程的路上，老師說：「明年我們可以出國去！」"） |
| a2-u12-l05-q11 | sentenceZh | 第②關：疑似：cousin 未示性別，譯「表哥」多加了資訊；可用「我表哥」以外的中性說法或接受此慣例（輕微）。 | 不改（語感類，執行長授權判斷）：中文沒有不分性別長幼又自然的 cousin 譯法（「表親」生硬），沿用「表哥」慣例；題目不考性別 |
| a2-u12-l05-q03 | exampleEn | 雷同自查：單字卡（children are playing in the playground）和 q13、閱讀雷同，改單字卡 | 改為 "Our school has a big playground."（原 "The children are playing in the playground."） |
| a2-u12-l05-q03 | exampleZh | 中譯同步 | 改為 "我們學校有一個很大的操場。"（原 "孩子們在遊樂場玩。"） |
| a2-u12-l05-q05 | exampleEn | 雷同自查：單字卡（visited an old castle）和 q17 參考答案（visit an old castle）雷同，改單字卡 | 改為 "A king built this castle five hundred years ago."（原 "We visited an old castle on the hill."） |
| a2-u12-l05-q05 | exampleZh | 中譯同步 | 改為 "這座城堡是一位國王在五百年前建造的。"（原 "我們參觀了山丘上的一座古堡。"） |
| a2-u12-l05-q03 | exampleEn | 雷同自查：前一版單字卡仍和 q13（school）、閱讀（big playground）共用實詞，再換 | 改為 "Is there a playground near your home?"（原 "Our school has a big playground."） |
| a2-u12-l05-q03 | exampleZh | 中譯同步 | 改為 "你家附近有遊樂場嗎？"（原 "我們學校有一個很大的操場。"） |
| a2-u12-l05-q03 | exampleEn | 雷同自查：前一版單字卡和閱讀共用 near，再換 | 改為 "The playground is closed today because of the rain."（原 "Is there a playground near your home?"） |
| a2-u12-l05-q03 | exampleZh | 中譯同步 | 改為 "遊樂場今天因為下雨關閉。"（原 "你家附近有遊樂場嗎？"） |
| a2-u13-l01-q01 | exampleEn | 雷同自查：單字卡（drove on the highway to…）和閱讀（drove on the highway for three hours）雷同，改單字卡 | 改為 "The highway is busy on Friday evenings."（原 "We drove on the highway to Taichung."） |
| a2-u13-l01-q01 | exampleZh | 中譯同步 | 改為 "星期五傍晚公路上車很多。"（原 "我們走公路開到台中。"） |
| a2-u13-l01-q04 | exampleEn | 雷同自查：單字卡（take a cab to the airport）和閱讀（took a cab to the station）雷同，改單字卡 | 改為 "Can you call a cab for me?"（原 "Let's take a cab to the airport."） |
| a2-u13-l01-q04 | exampleZh | 中譯同步 | 改為 "你可以幫我叫一台計程車嗎？"（原 "我們搭計程車去機場吧。"） |
| a2-u13-l01-q06 | exampleEn | 雷同自查：單字卡（brakes on my bike don't work）和 q13、閱讀（brakes are broken / stopped working）雷同，改單字卡 | 改為 "Check your brakes before a long ride."（原 "The brakes on my bike don't work."） |
| a2-u13-l01-q06 | exampleZh | 中譯同步 | 改為 "長途騎車前先檢查煞車。"（原 "我腳踏車的煞車壞了。"） |
| a2-u13-l01-q07 | exampleEn | 雷同自查：單字卡（The bus fare is…）和 q14（How much is the bus fare…?）雷同，改單字卡 | 改為 "I paid the fare with my card."（原 "The bus fare is fifteen dollars."） |
| a2-u13-l01-q07 | exampleZh | 中譯同步 | 改為 "我用卡付了車資。"（原 "公車票價是十五元。"） |
| a2-u13-l01-q08 | exampleEn | 雷同自查：單字卡（My suitcase is too heavy）和閱讀（suitcase was very heavy）雷同，改單字卡 | 改為 "I put my name on my suitcase."（原 "My suitcase is too heavy."） |
| a2-u13-l01-q08 | exampleZh | 中譯同步 | 改為 "我把名字寫在行李箱上。"（原 "我的行李箱太重了。"） |
| a2-u13-l02-q04 | glossZh | 第②關：釋義「快車；快遞」中的「快遞」與例句（Take the express＝搭快車）用法不符，違反「釋義對得上例句用法」；建議只留「快車」。 | 改為 "快車"（原 "快車；快遞"）；刪去例句沒有的「快遞」 |
| a2-u13-l02-q03 | exampleEn | 雷同自查：單字卡（train tracks）和 q13、閱讀（train…track）雷同，改單字卡 | 改為 "The tracks go over a long bridge."（原 "Don't walk on the train tracks."） |
| a2-u13-l02-q03 | exampleZh | 中譯同步 | 改為 "鐵軌經過一座長長的橋。"（原 "不要走在鐵軌上。"） |
| a2-u13-l03-q05 | exampleEn | 雷同自查：單字卡（tourists visit the night market）和 q12（Tourists love the night markets）雷同，改單字卡 | 改為 "In summer, the beach is full of tourists."（原 "Many tourists visit the night market every day."） |
| a2-u13-l03-q05 | exampleZh | 中譯同步 | 改為 "夏天海灘上滿是觀光客。"（原 "每天都有很多觀光客去逛夜市。"） |
| a2-u13-l03-q08 | exampleEn | 雷同自查：單字卡（wants to be an astronaut when she grows up）和閱讀（wanted to be an astronaut）雷同，改單字卡 | 改為 "The astronaut stayed in space for six months."（原 "She wants to be an astronaut when she grows up."） |
| a2-u13-l03-q08 | exampleZh | 中譯同步 | 改為 "那位太空人在太空待了六個月。"（原 "她長大想當太空人。"） |
| a2-u13-l04-q13 | stemEn | 第②關：題幹第二句 "Let's find a petrol station." 直接出現正解 petrol，等於洩題；建議改 "Let's find a place to fill up." 之類或換掉後句。 | 改為 "The car needs ____. Let's stop at the next town."（原 "The car needs ____. Let's find a petrol station."）；依裁示：題幹不可出現正解字；選項與正解不變 |
| a2-u13-l04-q13 | stemZh | 題幹中譯同步 | 改為 "車子需要加油了，我們在下一個城鎮停一下吧。"（原 "車子需要加油了，我們找個加油站吧。"） |
| a2-u13-l04-q07 | exampleEn | 雷同自查：單字卡（The car is out of petrol）和 q13、閱讀（car needs petrol / ran out of petrol）雷同，改單字卡 | 改為 "Petrol is expensive in this country."（原 "The car is out of petrol."） |
| a2-u13-l04-q07 | exampleZh | 中譯同步 | 改為 "這個國家的汽油很貴。"（原 "車子沒油了。"） |
| a2-u13-l04-q16 | referenceEn/1 | 第③關疑似 S9：參考答案 2 在描述指南，沒回答「怎麼用」 | 改為 "I use my guidebook to find good restaurants."（原 "My guidebook has good maps of the city."） |
| a2-u13-l04-q16 | rubricZh/1 | 評分要點同步 | 改為 "時態配合句意（例如 read、use）"（原 "時態配合句意（例如 read、has）"） |
| a2-u13-l04-q01 | exampleEn | 雷同自查：單字卡（Long ago, pilgrims walked along this old road）和閱讀（a road that pilgrims used long ago）雷同，改單字卡 | 改為 "Many pilgrims visit this old town every year."（原 "Long ago, pilgrims walked along this old road."） |
| a2-u13-l04-q01 | exampleZh | 中譯同步 | 改為 "每年都有很多朝聖者來這座古鎮。"（原 "很久以前，朝聖者沿著這條古道步行。"） |
| a2-u13-l04-q04 | exampleEn | 雷同自查：單字卡（take the tram to the city center）和閱讀（took an old tram to the center）雷同，改單字卡 | 改為 "The tram is slower than the bus."（原 "You can take the tram to the city center."） |
| a2-u13-l04-q04 | exampleZh | 中譯同步 | 改為 "路面電車比公車慢。"（原 "你可以搭路面電車到市中心。"） |
| a2-u13-l05-q03 | exampleEn | 雷同自查：單字卡（waited at the bus stop）和 q12（Wait for the bus at the bus stop）雷同，改單字卡 | 改為 "There is a new bus stop in front of my school."（原 "I waited at the bus stop for twenty minutes."） |
| a2-u13-l05-q03 | exampleZh | 中譯同步 | 改為 "我學校前面有一個新的公車站牌。"（原 "我在公車站牌等了二十分鐘。"） |
| a2-u14-l01-q16 | passageEn | 第②關："After school, she wants to work in her hometown." 的 After school 一般理解為「放學後」，與 passageZh「畢業後」不符；英文宜改 "After she finishes school"／"After she graduates"。 | 改為 "Amy is a medical student. On weekends, she helps at a hospital. She pushes patients in wheelchairs and talks with them. She also helps the nurses carry things. Many of the patients are old and lonely. \"Talking with them makes me happy,\" she says. After she finishes school, she wants to work in her hometown."（原 "Amy is a medical student. On weekends, she helps at a hospital. She pushes patients in wheelchairs and talks with them. She also helps the nurses count pills. Many of the patients are old and lonely. \"Talking with them makes me happy,\" she says. After school, she wants to work in her hometown."）；After school 改 After she finishes school（第③關 FIX 同）；清點藥物改搬東西 |
| a2-u14-l01-q16 | passageZh | 中譯同步 | 改為 "Amy 是醫學系的學生。週末她會去醫院幫忙。她幫病人推輪椅、陪他們聊天，也幫護理師搬東西。很多病人年紀大了，又很寂寞。她說：「跟他們聊天讓我很開心。」畢業後，她想回家鄉工作。"（原 "Amy 是醫學系的學生。週末她會去醫院幫忙。她幫病人推輪椅、陪他們聊天，也幫護理師清點藥丸。很多病人年紀大了，又很寂寞。她說：「跟他們聊天讓我很開心。」畢業後，她想回家鄉工作。"） |
| a2-u14-l01-q10 | sentenceEn | 閱讀拿掉 pills 後補 pill 的情境（dentist 仍有 q14） | 改為 "My grandfather keeps his pills in the kitchen."（原 "My appointment with the dentist is at three."） |
| a2-u14-l01-q10 | sentenceZh | 中譯同步 | 改為 "我爺爺把他的藥丸放在廚房。"（原 "我和牙醫約在三點。"） |
| a2-u14-l01-q07 | exampleEn | 依裁示：避免 makes drugs 這類易讀成毒品的句子，改藥妝店情境 | 改為 "This drug is sold in every drugstore."（原 "This company makes drugs."） |
| a2-u14-l01-q07 | exampleZh | 中譯同步 | 改為 "這種藥每家藥妝店都買得到。"（原 "這家公司生產藥品。"） |
| a2-u14-l02-q04 | exampleZh | 第③關疑似 S13：cream 是乳霜，不是護唇膏，改忠實譯法 | 改為 "她在乾燥的嘴唇上擦了點乳霜。"（原 "她在乾燥的嘴唇上擦了點護唇膏。"） |
| a2-u14-l02-q18 | referenceEn/0 | 雷同自查：參考答案（physical exercise every morning）和單字卡（good physical exercise）共用 physical exercise，換搭配 | 改為 "I like physical activities like hiking."（原 "I do some physical exercise every morning."） |
| a2-u14-l02-q18 | rubricZh/0 | 評分要點的例子隨參考答案改 | 改為 "physical 放在名詞前，表示「身體的」（例如 physical activities、physical work）"（原 "physical 放在名詞前，表示「身體的」（例如 physical exercise、physical work）"） |
| a2-u14-l02-q06 | exampleEn | 雷同自查：單字卡（small accident…nobody was hurt）和 q15（Nobody was hurt in the accident）雷同，改單字卡 | 改為 "The accident happened at a busy corner."（原 "There was a small accident on the road, but nobody was hurt."） |
| a2-u14-l02-q06 | exampleZh | 中譯同步 | 改為 "事故發生在一個繁忙的路口。"（原 "路上發生了一起小事故，但沒有人受傷。"） |
| a2-u14-l03-q17 | rubricZh/0 | 第②關：「ill 放在 be 動詞後（例如 was ill、is ill）」寫死句型位置：I felt ill、She got ill、He became ill 也正確；建議改「ill 當形容詞表示生病（例如 was ill、felt ill）」。 | 改為 "ill 是形容詞「生病的」，可放在 be 動詞或 feel、get 等動詞後（例如 was ill、felt ill、got ill）"（原 "ill 放在 be 動詞後，表示「生病的」（例如 was ill、is ill）"）；放寬位置（第③關 FIX 同） |
| a2-u14-l03-q05 | exampleEn | 雷同自查：單字卡（hit my toe on the door）和閱讀（hit his toe on a stone）雷同，改單字卡 | 改為 "The baby has ten small toes."（原 "I hit my toe on the door."） |
| a2-u14-l03-q05 | exampleZh | 中譯同步 | 改為 "寶寶有十隻小小的腳趾。"（原 "我的腳趾撞到門了。"） |
| a2-u14-l03-q07 | exampleEn | 雷同自查：單字卡（sweat a lot when I run）和閱讀（running…sweating a lot）雷同，改單字卡 | 改為 "I always sweat when I am nervous."（原 "I sweat a lot when I run."） |
| a2-u14-l03-q07 | exampleZh | 中譯同步 | 改為 "我一緊張就會流汗。"（原 "我跑步時會流很多汗。"） |
| a2-u14-l04-q15 | passageEn | 第③關 FIX：joke 動詞是 B1，改 laugh | 改為 "Last weekend, Mia went on a boat trip with her friends. The boat moved up and down a lot, and Mia felt dizzy. Then she ate some fried snacks and got a stomachache. Her friend Kate laughed and said, \"Your belly isn't happy today!\" On the way home, Mia fell and hurt her ankle. It was not her day."（原 "Last weekend, Mia went on a boat trip with her friends. The boat moved up and down a lot, and Mia felt dizzy. Then she ate some fried snacks and got a stomachache. Her friend Kate joked, \"Your belly isn't happy today!\" On the way home, Mia fell and hurt her ankle. It was not her day."） |
| a2-u14-l04-q15 | passageZh | 中譯同步；「那天真不是她的日子」直譯不通順，改「那天她真是諸事不順」（第③關 FIX） | 改為 "上週末，Mia 和朋友們去搭船出遊。船一直上下晃動，Mia 覺得頭暈。後來她吃了一些炸的點心，結果肚子痛了。她的朋友 Kate 笑著說：「妳的肚子今天不太開心喔！」回家的路上，Mia 又跌倒扭傷了腳踝。那天她真是諸事不順。"（原 "上週末，Mia 和朋友們去搭船出遊。船一直上下晃動，Mia 覺得頭暈。後來她吃了一些炸的點心，結果肚子痛了。她的朋友 Kate 開玩笑說：「妳的肚子今天不太開心喔！」回家的路上，Mia 又跌倒扭傷了腳踝。那天真不是她的日子。"） |
| a2-u14-l04-q02 | exampleEn | 雷同自查：單字卡（hurt my ankle when I fell）和閱讀、q09 雷同，改單字卡 | 改為 "These shoes cover your ankles."（原 "I hurt my ankle when I fell."） |
| a2-u14-l04-q02 | exampleZh | 中譯同步 | 改為 "這雙鞋會包住腳踝。"（原 "我跌倒時扭傷了腳踝。"） |
| a2-u14-l04-q06 | glossZh | 第②關：疑似：handicapped 在現代英語多被視為過時、可能冒犯的用語（現多用 disabled／accessible parking）；既是課綱字可保留，但建議單字卡釋義或例句註明「較舊的說法，現多用 disabled」。 | 改為 "身心障礙的（較舊說法）"（原 "身心障礙的"）；依裁示加註較舊說法；完整註記放在例句中譯（釋義上限 20 字放不下） |
| a2-u14-l04-q06 | exampleZh | 依裁示加註「（較舊的說法，現多用 disabled）」 | 改為 "這個停車場有身障駕駛專用的車位。（handicapped 是較舊的說法，現多用 disabled）"（原 "這個停車場有身障駕駛專用的車位。"） |
| a2-u14-l04-q16 | rubricZh/0 | 第②關：疑似：把 people in wheelchairs 列為「身障人士」的可接受寫法，範圍窄於原意（身障不限坐輪椅）；建議改例如 disabled people。 | 改為 "「身障人士」可寫例如 handicapped people（寫 disabled people、people with disabilities 也正確）"（原 "「身障人士」可寫例如 handicapped people、people in wheelchairs"）；依裁示收 disabled；拿掉範圍較窄的 people in wheelchairs |
| a2-u14-l04-q17 | rubricZh | 第③關疑似 S3：放寬可數與時態的寫死條件 | 改為 ["toothache 常說 a toothache（例如 have a toothache）","時態配合句意（例如 had、kept）"]（原 ["toothache 是可數名詞（例如 a toothache、have a toothache）","說過去的經驗用過去式（例如 had、kept）"]） |
| a2-u15-l01-q16 | rubricZh/0 | 第②關：疑似過嚴：「play the violin（the 不可省略）」——美式口語 play violin 亦常見；建議改「例如 play the violin」，不把 the 當必要條件，或僅作提醒。 | 改為 "「拉小提琴」可寫例如 play the violin（寫 play violin、learn the violin 也正確）"（原 "「拉小提琴」用 play the violin（the 不可省略）"）；放寬，不把 the 當必要條件（第③關疑似 S4 一併收 learn the violin） |
| a2-u15-l01-q15 | passageZh | 第②關：疑似：cousin 譯為「表哥」多加性別與長幼資訊（輕微）。 | 不改（語感類，執行長授權判斷）：中文沒有不分性別長幼又自然的 cousin 譯法，沿用「表哥」慣例；兩道閱讀題都不考這一點 |
| a2-u15-l01-q01 | exampleEn | 雷同自查：單字卡（took pictures of the wedding）和 q13（takes pictures for magazines）、閱讀（wedding…photographer）雷同，改單字卡 | 改為 "The photographer told everyone to stand in a line."（原 "The photographer took pictures of the wedding."） |
| a2-u15-l01-q01 | exampleZh | 中譯同步 | 改為 "攝影師叫大家站成一排。"（原 "攝影師拍了婚禮的照片。"） |
| a2-u15-l01-q06 | exampleEn | 雷同自查：單字卡（in your leisure time）和閱讀、q17 參考答案（leisure time）雷同，改單字卡 | 改為 "The hotel has a leisure center with a pool."（原 "What do you do in your leisure time?"） |
| a2-u15-l01-q06 | exampleZh | 中譯同步 | 改為 "這家飯店有附游泳池的休閒中心。"（原 "你空閒時間都做些什麼？"） |
| a2-u15-l01-q05 | exampleEn | 雷同自查：單字卡（balloons at the party）和 q09（balloons for the party）雷同，改單字卡 | 改為 "The balloon flew up into the sky."（原 "The kids played with red balloons at the party."） |
| a2-u15-l01-q05 | exampleZh | 中譯同步 | 改為 "氣球飛上了天空。"（原 "孩子們在派對上玩紅色氣球。"） |
| a2-u15-l03-q14 | passageEn | 第②關："Ben went home walking along the river" 不自然，應為 "Ben walked home along the river." | 改為 "Every Friday night, Ben goes to a small theater. Last week, there was a magic show by a mysterious man in a black hat. Then three dancers danced to a happy tune. The show ended with a short romance about an angel and a farmer. After the show, Ben walked home along the river."（原 "Every Friday night, Ben goes to a small theater. Last week, there was a magic show with a mysterious man in a black hat. Then three dancers danced to a happy tune. The show ended with a short romance about an angel and a farmer. After the show, Ben went home walking along the river."）；went home walking 改 walked home（第③關 FIX 同）；with 改 by，讓「表演者」有英文依據 |
| a2-u15-l03-q14 | questions/0 | 第②關：疑似：英文只說 "a magic show with a mysterious man in a black hat"，未明說此人是表演者；passageZh 補了「表演者是」，題目「魔術表演的表演者是誰」答案依賴中譯加的資訊。建議英文改 "a magic show by a mysterious man…"。 | 英文改為 a magic show by a mysterious man，Q1「表演者是誰」已有英文依據，題目不必改 |
| a2-u15-l03-q10 | sentenceEn | 第③關 FIX：relaxing 形容詞是 B1，改用 help＋relax | 改為 "Walking along the beach helps me relax."（原 "Walking along the beach is very relaxing."） |
| a2-u15-l03-q10 | sentenceZh | 中譯同步 | 改為 "沿著海邊散步能讓我放鬆。"（原 "沿著海邊散步非常放鬆。"） |
| a2-u15-l03-q02 | exampleEn | 雷同自查：跟讀句改成 helps me relax 後和單字卡（Walking is my favorite way to relax）同情境，改單字卡 | 改為 "Walking to school takes me ten minutes."（原 "Walking is my favorite way to relax."） |
| a2-u15-l03-q02 | exampleZh | 中譯同步 | 改為 "我走路上學要花十分鐘。"（原 "散步是我最喜歡的放鬆方式。"） |
| a2-u15-l04-q13 | stemEn | 第②關："made a comic face" 不道地，慣用說法是 made a funny face；comic 作形容詞多用於 comic story／comic actor；建議換題幹（例如 "He told a ____ story, and everyone laughed."）。 | 改為 "The clown told a ____ story, and everyone laughed."（原 "The clown made a ____ face, and everyone laughed."）；made a comic face 不道地，改 comic story；選項與正解不變 |
| a2-u15-l04-q13 | stemZh | 題幹中譯同步 | 改為 "小丑講了一個滑稽的故事，大家都笑了。"（原 "小丑做了一個滑稽的表情，大家都笑了。"） |
| a2-u15-l04-q07 | exampleEn | 雷同自查：單字卡（The clown made the children laugh）和 q13（everyone laughed）雷同，改單字卡 | 改為 "The clown had a red nose and big shoes."（原 "The clown made the children laugh."） |
| a2-u15-l04-q07 | exampleZh | 中譯同步 | 改為 "那個小丑有紅鼻子和一雙大鞋子。"（原 "小丑逗得孩子們哈哈大笑。"） |
| a2-u15-l05-q05 | exampleEn | 雷同自查：單字卡（still keeps his old cassettes）和閱讀（keeps hundreds of old cassettes）雷同，改單字卡 | 改為 "You can't play a cassette on a phone."（原 "My father still keeps his old cassettes."） |
| a2-u15-l05-q05 | exampleZh | 中譯同步 | 改為 "手機沒辦法放錄音帶。"（原 "我爸爸還留著他的舊錄音帶。"） |
| a2-u15-l05-q01 | exampleEn | 雷同自查：單字卡（grandfather taught me to play chess）和 q12（grandpa plays chess）雷同，改單字卡 | 改為 "Chess is a game for two players."（原 "My grandfather taught me to play chess."） |
| a2-u15-l05-q01 | exampleZh | 中譯同步 | 改為 "西洋棋是兩個人玩的遊戲。"（原 "我爺爺教我下西洋棋。"） |
| a2-u15-l05-q01 | exampleEn | 雷同自查：前一版單字卡和 q08（a game of chess）共用 game，再換 | 改為 "My grandfather is very good at chess."（原 "Chess is a game for two players."） |
| a2-u15-l05-q01 | exampleZh | 中譯同步 | 改為 "我爺爺很會下西洋棋。"（原 "西洋棋是兩個人玩的遊戲。"） |
| a2-u15-l06-q01 | exampleEn | 第②關："a slow, lyric song" 不自然：lyric 作形容詞極少用於歌曲（一般說 lyrical 或 ballad）；本單元主題常用義是名詞 lyrics（歌詞），建議單字卡改教名詞，例如 "I can't remember the lyrics of this song."，glossZh 改「歌詞」。 | 改為 "I can't remember the lyrics of this song."（原 "This is a slow, lyric song."）；依裁示：lyric 改教名詞「歌詞」，刪除形容詞用法（lexicon 只收 lyric 形容詞 A2，此為執行長裁示的教法） |
| a2-u15-l06-q01 | exampleZh | 中譯同步 | 改為 "我記不得這首歌的歌詞。"（原 "這是一首緩慢的抒情歌。"） |
| a2-u15-l06-q01 | glossZh | 釋義改名詞 | 改為 "歌詞（常用複數 lyrics）"（原 "抒情的"） |
| a2-u15-l06-q01 | distractorsZh | 干擾項改成同為名詞 | 改為 ["旋律","節奏","歌手"]（原 ["吵鬧的","快節奏的","搞笑的"]） |
| a2-u15-l06-q13 | stemEn | 第②關：同上，"She sang a slow, ____ song about love."（正解 lyric）用法不道地；且其他三選項皆名詞片語，此題實際只考詞性。建議配合單字卡改名詞用法重出。 | 改為 "This song has beautiful ____. They tell a sad story about love."（原 "She sang a slow, ____ song about love."）；配合單字卡改考名詞 lyrics；三個干擾項填入都不成句，只能靠詞義判斷 |
| a2-u15-l06-q13 | stemZh | 題幹中譯同步 | 改為 "這首歌的歌詞很美，講的是一個悲傷的愛情故事。"（原 "她唱了一首關於愛情的緩慢抒情歌。"） |
| a2-u15-l06-q13 | options | 正解改名詞複數 lyrics；MP3 大寫（正解位置不變） | 改為 ["lyrics","MP3 player","board game","digital camera"]（原 ["lyric","mp3 player","board game","digital camera"]） |
| a2-u15-l06-q13 | optionGlossZh/0 | 選項釋義同步 | 改為 "歌詞"（原 "抒情的"） |
| a2-u15-l06-q12 | stemEn | 第②關：疑似：「Mozart and other ____」→ other classical music，Mozart 是人、classical music 是音樂類別，並列不對稱；建議題幹改 "My grandfather loves ____, like Mozart."。 | 改為 "My grandfather loves ____, like Mozart."（原 "My grandfather loves Mozart and other ____."）；人與音樂類別並列不對稱，照建議改題幹；選項與正解不變 |
| a2-u15-l06-q12 | stemZh | 題幹中譯同步 | 改為 "我爺爺很愛古典音樂，像是莫札特的作品。"（原 "我爺爺很愛莫札特和其他古典音樂。"） |
| a2-u15-l06-q09 | audioZh | 第②關：「我的姊妹」不通順（台灣口語不這樣指單一 sister）；建議譯「我姊姊」或「我妹妹」，questionZh 同步改。 | 改為 "我爸爸喜歡古典音樂，但我姊姊只聽嘻哈。"（原 "我爸爸喜歡古典音樂，但我的姊妹只聽嘻哈。"）；「我的姊妹」不通順，改「我姊姊」 |
| a2-u15-l06-q09 | questionZh | 題目同步 | 改為 "說話的人的姊姊聽什麼音樂？"（原 "說話的人的姊妹聽什麼音樂？"） |
| a2-u15-l06-q06 | word | 第②關：「mp3 player」小寫不合標準寫法（MP3 player）；items/5/exampleEn 與 items/13/passageEn 同樣小寫，聽打／顯示時易誤導。 | 改為 "MP3 player"（原 "mp3 player"）；依裁示 MP3 大寫 |
| a2-u15-l06-q06 | exampleEn | MP3 大寫；同時避開和閱讀（keeps his old mp3 player）雷同 | 改為 "My MP3 player can hold a thousand songs."（原 "I listened to songs on my old mp3 player."） |
| a2-u15-l06-q06 | exampleZh | 中譯同步 | 改為 "我的 MP3 播放器可以存一千首歌。"（原 "我用舊的 MP3 播放器聽歌。"） |
| a2-u15-l06-q14 | passageEn | MP3 大寫 | 改為 "When my grandmother was young, she listened to music on the radio. Now my cousin listens to hip hop on his phone, but he still keeps his old MP3 player. My uncle takes photos with a digital camera. On weekends, our whole family plays board games instead of video games."（原 "When my grandmother was young, she listened to music on the radio. Now my cousin listens to hip hop on his phone, but he still keeps his old mp3 player. My uncle takes photos with a digital camera. On weekends, our whole family plays board games instead of video games."） |
| a2-u15-l06-q16 | referenceEn/1 | 第③關 FIX：參考答案 2 在說喜歡哪款遊戲，不是習慣 | 改為 "My brother plays video games every weekend."（原 "My favorite video game is about cooking."） |
| a2-u15-l06-q16 | rubricZh/1 | 評分要點同步 | 改為 "說習慣用現在式（例如 play、plays）"（原 "說習慣用現在式（例如 play、is）"） |
| a2-u15-l06-q07 | exampleEn | 雷同自查：單字卡（My brother plays video games all weekend）和閱讀、q16 參考答案雷同，改單字卡 | 改為 "I got a new video game for my birthday."（原 "My brother plays video games all weekend."） |
| a2-u15-l06-q07 | exampleZh | 中譯同步 | 改為 "我生日時收到一款新電玩。"（原 "我弟弟整個週末都在打電玩。"） |
| a2-u15-l06-q02 | exampleEn | 雷同自查：單字卡（Our family plays a board game every Friday night）和閱讀（our whole family plays board games）雷同，改單字卡 | 改為 "This board game is easy to learn."（原 "Our family plays a board game every Friday night."） |
| a2-u15-l06-q02 | exampleZh | 中譯同步 | 改為 "這款桌遊很容易學。"（原 "我們家每週五晚上都玩桌遊。"） |
| a2-u15-l06-q03 | exampleEn | 雷同自查：單字卡（I listen to classical music when I study）和 q15 參考答案（listens to classical music）雷同，改單字卡 | 改為 "Classical music helps me study."（原 "I listen to classical music when I study."） |
| a2-u15-l06-q03 | exampleZh | 中譯同步 | 改為 "古典音樂能幫助我讀書。"（原 "我讀書時會聽古典音樂。"） |
| a2-u15-l06-q04 | exampleEn | 雷同自查：單字卡（took these photos with my new digital camera）和閱讀（takes photos with a digital camera）雷同，改單字卡 | 改為 "Can I borrow your digital camera for my trip?"（原 "I took these photos with my new digital camera."） |
| a2-u15-l06-q04 | exampleZh | 中譯同步 | 改為 "我旅行時可以借你的數位相機嗎？"（原 "這些照片是我用新的數位相機拍的。"） |
| a2-u15-l06-q06 | word | 還原：word 必須與課綱 headword 一致（檢查器 COMPOSITION 擋下 MP3 player），課綱寫 mp3 player 而本次不得改 curriculum/；學習者看得到的例句、閱讀、選項、釋義已全部改成大寫 MP3（列入狀態檔建議） | 改為 "mp3 player"（原 "MP3 player"） |
| a2-u15-l06-q01 | exampleEn | 雷同自查：前一版單字卡和 q13（This song has beautiful lyrics）共用 song，再換 | 改為 "I always forget the lyrics when I sing."（原 "I can't remember the lyrics of this song."） |
| a2-u15-l06-q01 | exampleZh | 中譯同步 | 改為 "我唱歌時老是忘詞。"（原 "我記不得這首歌的歌詞。"） |
| a2-u16-l01-q15 | passageEn | 第②關：疑似：大熱天賽跑完「After that, I rented a pair of skates and went skating with him」，跑完比賽立刻去溜冰的銜接突兀、邏輯薄弱；建議改為隔天或另起情境。 | 改為 "Last month, our city had a big sports competition at the new stadium. Athletes came from all over the country. My friend Kevin was one of the runners. It was a real challenge for him because the weather was very hot, but he finished third. The next weekend, I rented a pair of skates and went skating with him."（原 "Last month, our city had a big sports competition at the new stadium. Athletes came from all over the country. My friend Kevin was one of the runners. It was a real challenge for him because the weather was very hot, but he finished third. After that, I rented a pair of skates and went skating with him."）；跑完比賽立刻去溜冰銜接突兀，改成隔週（第③關疑似 S15 同） |
| a2-u16-l01-q15 | passageZh | 中譯同步 | 改為 "上個月，我們市在新的體育場舉辦了一場大型運動比賽，運動員來自全國各地。我的朋友 Kevin 是參賽的跑者之一。天氣非常熱，對他來說是一大挑戰，不過他還是跑了第三名。隔週週末，我租了一雙溜冰鞋，跟他一起去溜冰。"（原 "上個月，我們市在新的體育場舉辦了一場大型運動比賽，運動員來自全國各地。我的朋友 Kevin 是參賽的跑者之一。天氣非常熱，對他來說是一大挑戰，不過他還是跑了第三名。之後，我租了一雙溜冰鞋，跟他一起去溜冰。"） |
| a2-u16-l01-q02 | exampleEn | 雷同自查：單字卡（the fastest runner in our school）和 q13（The fastest runner crossed the line）雷同，改單字卡 | 改為 "My dad is a slow runner, but he never stops."（原 "She is the fastest runner in our school."） |
| a2-u16-l01-q02 | exampleZh | 中譯同步 | 改為 "我爸爸跑得很慢，但他從不停下來。"（原 "她是我們學校跑得最快的人。"） |
| a2-u16-l02-q17 | rubricZh/1 | 第②關：「「贏得獎牌」用 win（過去式 won）」寫死動詞；題目說「誰得過獎牌」，got／received a medal 也正確；建議改「例如 win／won、get a medal」。 | 改為 "「得到獎牌」可寫例如 win／won a medal、get／got a medal"（原 "「贏得獎牌」用 win（過去式 won）"）；放寬動詞（第③關 FIX 同） |
| a2-u16-l02-q07 | exampleEn | 雷同自查：單字卡（won three gold medals）和 q09、閱讀、q17 參考答案（won…medal）雷同，改單字卡 | 改為 "Her medals are on the wall of her room."（原 "He won three gold medals."） |
| a2-u16-l02-q07 | exampleZh | 中譯同步 | 改為 "她的獎牌掛在她房間的牆上。"（原 "他贏得了三面金牌。"） |
| a2-u16-l02-q04 | exampleEn | 雷同自查：單字卡（dreams of going to the Olympic Games）和閱讀（Her dream is to go to the Olympic Games）雷同，改單字卡 | 改為 "The Olympic flag has five rings."（原 "He dreams of going to the Olympic Games."） |
| a2-u16-l02-q04 | exampleZh | 中譯同步 | 改為 "奧運會旗上有五個圓環。"（原 "他夢想參加奧運。"） |
| a2-u16-l03-q13 | stemZh | 第②關：「去雪山滑雪」中「雪山」在台灣易被讀成專有山名（雪山），原文 snowy mountains 宜譯「積雪的山上」。 | 改為 "冬天時，我們會去積雪的山上滑雪。"（原 "冬天時，我們會去雪山滑雪。"）；「雪山」易讀成專有山名，改「積雪的山上」 |
| a2-u16-l03-q15 | questions/1/options/2 | 第②關：疑似：干擾項「想交女朋友」帶不必要的性別／戀愛假設，與文意無關，建議換中性選項（例如「社團費比較便宜」）。 | 改為 "想認識新朋友"（原 "想交女朋友"）；拿掉帶性別與戀愛假設的干擾項 |
| a2-u16-l03-q15 | questions/1/options/1 | 第③關疑似 S10：「朋友邀請他」預設作者是男生，拿掉「他」 | 改為 "朋友邀請"（原 "朋友邀請他"） |
| a2-u16-l03-q02 | exampleZh | 第③關疑似 S11：「攀巖」改台灣通行寫法「攀岩」（opencc 誤擋已依授權豁免） | 改為 "攀岩很難，但很刺激。"（原 "攀巖很難，但很刺激。"） |
| a2-u16-l03-q02 | glossZh | 攀巖→攀岩 | 改為 "攀登；攀岩"（原 "攀登；攀巖"） |
| a2-u16-l03-q12 | sentenceZh | 攀巖→攀岩 | 改為 "攀岩能讓你的手臂變強壯。"（原 "攀巖能讓你的手臂變強壯。"） |
| a2-u16-l03-q15 | passageZh | 攀巖→攀岩 | 改為 "我們學校有很多運動社團。有些學生打板球或橄欖球，有些週末會去騎腳踏車。我最好的朋友 Tim 很愛水上運動，尤其是帆船。冬天時，學校會帶學生去滑雪和溜冰。我參加了攀岩社，因為我喜歡待在離地面很高的地方。"（原 "我們學校有很多運動社團。有些學生打板球或橄欖球，有些週末會去騎腳踏車。我最好的朋友 Tim 很愛水上運動，尤其是帆船。冬天時，學校會帶學生去滑雪和溜冰。我參加了攀巖社，因為我喜歡待在離地面很高的地方。"） |
| a2-u16-l03-q15 | questions/0/options/2 | 攀巖→攀岩 | 改為 "攀岩"（原 "攀巖"） |
| a2-u16-l03-q15 | questions/1/questionZh | 攀巖→攀岩 | 改為 "作者為什麼參加攀岩社？"（原 "作者為什麼參加攀巖社？"） |
| a2-u16-l03-q17 | instructionZh | 攀巖→攀岩 | 改為 "用 climbing 造一個句子，說說你對攀岩或爬山的想法或經驗。"（原 "用 climbing 造一個句子，說說你對攀巖或爬山的想法或經驗。"） |
| a2-u16-l03-q17 | rubricZh/0 | 攀巖→攀岩 | 改為 "climbing 當名詞表示「攀登；攀岩」（例如 rock climbing、Climbing is…）"（原 "climbing 當名詞表示「攀登；攀巖」（例如 rock climbing、Climbing is…）"） |
| a2-u16-l03-q01 | exampleEn | 雷同自查：單字卡（went skiing in Japan last winter）和 q13（In winter, we go skiing）雷同，改單字卡 | 改為 "Skiing is an expensive sport."（原 "We went skiing in Japan last winter."） |
| a2-u16-l03-q01 | exampleZh | 中譯同步 | 改為 "滑雪是一項花費很高的運動。"（原 "我們去年冬天去日本滑雪。"） |
| a2-u16-l03-q05 | exampleEn | 雷同自查：單字卡（a new tennis racket）和 q09（your tennis racket）雷同，改單字卡 | 改為 "My racket is too heavy for me."（原 "I need a new tennis racket."） |
| a2-u16-l03-q05 | exampleZh | 中譯同步 | 改為 "我的球拍對我來說太重了。"（原 "我需要一支新的網球拍。"） |
| a2-u16-l04-q14 | passageEn | 第②關：疑似：運動中心只提到羽球、桌球、滑板場，卻說哥哥想當足球員「所以每天去那裡練習」，未交代有足球場地，因果銜接不清。 | 改為 "Our town opened a new sports center last month. Inside, you can play badminton and table tennis. Outside, there is a place for skateboarding and a football field. My brother wants to be a footballer, so he goes there to practice every day. In summer, the center also takes people surfing at the beach."（原 "Our town opened a new sports center last month. Inside, you can play badminton and table tennis. Outside, there is a place for skateboarding. My brother wants to be a footballer, so he goes there to practice every day. In summer, the center also takes people surfing at the beach."）；補上室外足球場，交代哥哥去練習的因果 |
| a2-u16-l04-q14 | passageZh | 中譯同步 | 改為 "我們鎮上個月開了一間新的運動中心。室內可以打羽毛球和桌球，室外有玩滑板的場地和一座足球場。我哥哥想當足球員，所以他每天都去那裡練習。夏天時，運動中心也會帶大家去海邊衝浪。"（原 "我們鎮上個月開了一間新的運動中心。室內可以打羽毛球和桌球，室外有玩滑板的場地。我哥哥想當足球員，所以他每天都去那裡練習。夏天時，運動中心也會帶大家去海邊衝浪。"） |
| a2-u16-l04-q03 | exampleEn | 雷同自查：單字卡（wants to be a famous footballer）和閱讀（wants to be a footballer）雷同，改單字卡 | 改為 "That footballer can kick the ball very far."（原 "He wants to be a famous footballer."） |
| a2-u16-l04-q03 | exampleZh | 中譯同步 | 改為 "那位足球員能把球踢得很遠。"（原 "他想成為有名的足球員。"） |
| a2-u16-l04-q06 | exampleEn | 雷同自查：單字卡（The new sports center has a big pool）和閱讀（opened a new sports center）雷同，改單字卡 | 改為 "The sports center is open until ten at night."（原 "The new sports center has a big pool."） |
| a2-u16-l04-q06 | exampleZh | 中譯同步 | 改為 "運動中心開到晚上十點。"（原 "新的運動中心有一座大游泳池。"） |
| a2-u16-l04-q07 | exampleEn | 雷同自查：單字卡（play table tennis every morning）和 q12、閱讀（play table tennis）雷同，改單字卡 | 改為 "Table tennis is my grandmother's favorite sport."（原 "My grandparents play table tennis every morning."） |
| a2-u16-l04-q07 | exampleZh | 中譯同步 | 改為 "桌球是我奶奶最喜歡的運動。"（原 "我爺爺奶奶每天早上打桌球。"） |

## 最終複審修正（2026-10-03，`t9/a2b2-final.md`＋`t9/a2re-gate2.json`）

> 每處修改都記在該課的 `judge.resolvedAfterFinalReview`，message 以「執行長最終複審修正：」開頭。
> 修正後，`check-items --require-judge` 對第 1、2 批 94 課全綠，`npm test` 全過。
> 所有選擇題的正解索引都沒變。

修正內容：

- **3a 語言與裁示類 6 條**：全照報告修。只有 u15-l06-q13 的改法不同：照報告把干擾項改成複數（MP3 players、digital cameras）後，檢查器的片語比對失效，報 UNLEVELED／OVER_LEVEL。所以選項改回單數，改成換題幹 "I really like the ____ in this new song."：單複數都合文法，四個選項都放得進空格。
- **3b 雷同 66 條**：全照報告修。其中 2 條的報告建議句又和同課別題撞情境，再微調了一次：
  - u14-l03 ill：建議句 He looks ill today 和 q17 參考答案 2 的 is ill today 同情境，改成 He looked ill after the long trip.
  - u10-l05 boil：建議句 Water boils… 和 q09 The water is boiling now 主詞與情境都相同，改成 Can you boil some eggs for breakfast?
- **重新盲答的 4 條語言問題**：
  - u04-l01-q10：中譯刪掉「每人」。
  - u09-l03-q15：toy maker 改成 a small company, a maker of wooden toys，保留 maker 的情境。
  - u11-l02-q12：production 題幹改成 This year, the factory's ____ went up a lot.
  - u11-l03-q14：made an exchange for… 改成 went back to the shop for an exchange。exchange 的動詞是 B1，所以仍用名詞。

### 改到選項或題幹的選擇題（逐題）

| 題 id | 改了什麼 |
|---|---|
| a2-u12-l02-q14 | options[3] nation → statue（optionGlossZh 雕像） |
| a2-u09-l03-q14 | 題幹改成 "I'm the boss here, and Tom is my ____ manager. He helps me every day."；optionGlossZh[3] 改回「助理的」 |
| a2-u15-l06-q13 | 題幹改成 "I really like the ____ in this new song."（選項不變） |
| a2-u11-l02-q12 | 題幹改成 "This year, the factory's ____ went up a lot." |
| a2-u08-l03-q14 | 題幹改成 "Can you help me ____ my desk? I can't find anything." |
| a2-u08-l04-q14 | 題幹改成 "The bathroom ____ is full of dirty water." |
| a2-u14-l01-q15 | 題幹改成 "Some flowers ____ in the cold winter." |
| a2-u09-l03-q15（閱讀） | 短文改成 a small company, a maker of wooden toys；his assistant 改回 his assistant manager（兩道小題不受影響） |
| a2-u11-l03-q14（閱讀） | 短文改成 went back to the shop for an exchange（兩道小題不受影響） |

### 情境對照表（這次改到的目標字；每列都確認主詞、情境、句型三項至少換了兩項）

| 課｜字 | 卡情境 | 其他題情境 | 句型不同 |
|---|---|---|---|
| u08-l01 container | 玻璃容器 | q17 把湯倒進容器 | 是 |
| u08-l01 elevator | 大樓有兩部電梯 | q10 今天電梯故障；q16 每天搭電梯 | 是 |
| u08-l03 cleaner | 學校清潔人員親切 | q15 每週五清潔人員來 | 是 |
| u08-l03 tidy | 晚餐前整理房間 | q11 書桌整齊；q14 幫忙整理書桌；q15 公寓整齊、自己整理廚房 | 是 |
| u08-l04 sink | 髒碗盤放水槽 | q14 浴室洗手檯滿是髒水；q15 水槽沒水龍頭 | 是 |
| u08-l06 alarm clock | 鬧鐘放離床遠 | q09 鬧鐘沒響；q17 鬧鐘七點響、需要兩個鬧鐘 | 是 |
| u09-l01 businessman | 商人常出差 | q15 David 是商人 | 是 |
| u09-l03 secretary | 秘書接電話 | q10 找秘書談；q15 秘書致詞 | 是 |
| u09-l03 assistant | 助理廚師切菜 | q14 Tom 是副理；q15 副理致詞 | 是 |
| u09-l04 retired | 退休的人空閒多 | q09 爺爺退休仍種花；q15 退休漁夫；q17 退休爸爸做菜、奶奶住海邊 | 是 |
| u09-l04 sleepless | 新手爸媽常失眠 | q11 失眠後很累；q15 女企業家因工作失眠 | 是 |
| u09-l04 businesswoman | 女企業家整天開會 | q15 Lucy 的媽媽很忙 | 是 |
| u10-l02 snack | 買零食路上吃 | q11 放學吃點心；q15 下午麵包配果醬；q17 最愛的點心、餓了吃點心 | 是 |
| u10-l02 barbecue | 公園烤肉好玩 | q10 烤肉吃了什麼；q15 海邊烤肉 | 是 |
| u10-l05 boil | 請對方煮蛋當早餐 | q09 水滾了；q14 泡茶前煮水；q15 老師教燒開水 | 是 |
| u10-l06 supper | 奶奶煮晚飯 | q08 晚飯吃炒飯；q14 晚飯吃很少；q15 今晚吃什麼 | 是 |
| u10-l06 mug | 打破最愛的杯子 | q10 杯子是姊姊送的；q13 要乾淨杯子裝可可；q14 各用自己的杯子 | 是 |
| u10-l06 cereal | 穀片太甜 | q14 妹妹只吃穀片 | 是 |
| u10-l08 lemonade | 媽媽用檸檬做 | q12 熱天喝一杯冰的；q14 孩子們喝檸檬水 | 是 |
| u10-l09 omelet | 歐姆蛋好做 | q14 隔天早上做歐姆蛋；q16 加火腿起司、爸爸做的 | 是 |
| u10-l09 cola | 爸爸每天喝 | q13 點漢堡要不要可樂；q14 朋友喝可樂 | 是 |
| u11-l01 wallet | 皮夾塞滿收據 | q09 找不到皮夾；q15 在商場掉皮夾 | 是 |
| u11-l01 inexpensive | 餐廳好吃不貴 | q15 市場水果不貴；q17 店賣便宜衣服、台南的平價旅館 | 是 |
| u11-l02 customer | 店送顧客袋子 | q08 顧客找經理；q14 顧客喜歡產品；q16 常客、咖啡店客人多 | 是 |
| u11-l02 production | 車款 2020 年開始生產 | q12 今年工廠產量增加；q14 預算少生產慢 | 是 |
| u11-l03 exchange | 要換貨請留收據 | q14 襯衫太大回店換貨 | 是 |
| u11-l03 cheap | 哥哥只買便宜衣服 | q11 問有沒有便宜旅館；q13 包包便宜但壞了；q14 小店食物便宜 | 是 |
| u11-l05 department store | 在百貨公司迷路 | q11 百貨公司在街角；q14 百貨公司特價 | 是 |
| u12-l02 area | 這區晚上安靜 | q16 各地有在地美食 | 是 |
| u12-l03 village | 村子只有一家店 | q12 年輕人搬到首都；q15 在村子長大、過年回村 | 是 |
| u12-l03 zone | 安靜區別大聲 | q11 學校區開慢點 | 是 |
| u12-l04 branch | 問在哪間分店上班 | q12 台北有五間分店 | 是 |
| u12-l04 continent | 世界有七大洲 | q13 非洲是大洲；q15 想去每一洲 | 是 |
| u12-l04 globe | 用地球儀找日本 | q15 城堡入口有地球儀 | 是 |
| u13-l02 flight | 長途班機都在睡 | q16 班機誤點兩小時 | 是 |
| u13-l02 tour | 行程九點出發 | q15 茶園導覽；q17 搭船遊覽、夜市美食團 | 是 |
| u13-l03 traffic | 這城市交通很糟 | q09 橋上車多；q15 去機場路上塞車 | 是 |
| u13-l03 pilot | 飛行員要多年訓練 | q13 機師開飛機；q15 Tom 是機師 | 是 |
| u13-l03 adventure | 愛看冒險書 | q14 爬山是大冒險；q15 每趟旅程是小冒險 | 是 |
| u13-l04 sightseeing | 觀光是旅行最愛 | q11 觀光一整天很累；q12 下午去老城觀光；q14 用指南規劃觀光 | 是 |
| u13-l05 tour guide | 阿姨當了十年導遊 | q13 導遊講城堡歷史；q14 導遊風趣；q16 日本導遊好笑、想當導遊 | 是 |
| u14-l01 die | 忘了澆水植物枯死 | q15 冬天有些花會死 | 是 |
| u14-l01 drug | 科學家研發感冒新藥 | q13 這藥只限成人 | 是 |
| u14-l02 temperature | 問外面氣溫 | q16 山上氣溫很低 | 是 |
| u14-l02 stomach | 餓了肚子叫 | q16 喝湯後肚子暖又飽 | 是 |
| u14-l03 ill | 長途旅行後看來病了 | q13 生病待在家；q17 上週末生病躺床、弟弟生病不能上學 | 是 |
| u14-l03 harm | 強光傷眼 | q12 塑膠袋傷害海洋動物 | 是 |
| u14-l03 injure | 每年很多球員受傷 | q09 小心傷到背；q14 跌倒傷到手臂；q15 沒傷得很重 | 是 |
| u14-l04 dizzy | 從高樓往下看頭暈 | q12 熱到頭暈；q14 站太快頭暈；q15 船晃頭暈 | 是 |
| u14-l04 unhealthy | 叔叔生活方式不健康 | q11 糖果吃太多不健康 | 是 |
| u14-l04 handicapped | 別停身障車位 | q16 大樓有身障入口 | 是 |
| u14-l04 toothache | 兒子牙痛哭整晚 | q10 牙痛不能去派對；q17 牙痛不能吃冰、牙痛睡不著 | 是 |
| u15-l01 painter | 畫家以海景聞名 | q11 畫家用鮮豔顏色；q15 姊姊是畫家 | 是 |
| u15-l02 hero | 救男孩被稱英雄 | q12 故事裡女孩成英雄；q15 最喜歡的主角；q17 奶奶是英雄、書中主角 | 是 |
| u15-l02 musical | 來自音樂世家 | q15 Nina 有音樂天分 | 是 |
| u15-l02 mystery | 警方解謎 | q13 誰牽走腳踏車是謎；q15 愛看推理小說 | 是 |
| u15-l04 composer | 作曲家為太太寫歌 | q12 貝多芬是偉大的作曲家 | 是 |
| u15-l04 comic | 漫畫講貓狗 | q10 週末看漫畫；q13 小丑講滑稽故事；q14 滑稽的故事 | 是 |
| u15-l04 singing | 聽到隔壁的歌聲 | q11 妹妹愛唱歌跳舞；q14 孩子跟著唱；q16 媽媽唱得好、洗澡唱歌 | 是 |
| u15-l05 chess | 西洋棋難學但好玩 | q08 來下一盤；q12 爺爺在公園下棋 | 是 |
| u15-l05 superstar | 大家想合照 | q10 歌手是亞洲巨星；q15 她是韓國巨星 | 是 |
| u15-l05 camping | 露營比住飯店便宜 | q13 露營睡在森林 | 是 |
| u15-l05 symphony | 貝多芬寫九首交響曲 | q14 爸媽去聽交響曲 | 是 |
| u15-l05 hiking | 山上健行是週末最愛 | q16 每月和朋友健行、健行看到鳥 | 是 |
| u15-l06 lyric | 唱歌老是忘詞 | q13 喜歡新歌的歌詞 | 是 |
| u16-l01 skate | 溜冰鞋太小了 | q15 租溜冰鞋去溜冰 | 是 |
| u16-l02 award | 學校每年頒獎給優秀學生 | q14 她贏得最佳電影獎；q15 市政府頒獎給她 | 是 |
| u16-l03 sailing | 大風天難駕帆船 | q15 Tim 最愛帆船 | 是 |
| u16-l03 climbing | 攀岩難但刺激 | q12 攀岩讓手臂強壯；q15 參加攀岩社；q17 去年試過攀岩、每週六去攀岩 | 是 |
| u16-l04 badminton | 買新羽球拍 | q11 雨天適合打羽球；q14 室內打羽球；q15 每週五晚上打羽球 | 是 |
| u16-l04 snowboarding | 表哥在日本教滑雪 | q16 想試試單板、比雙板難 | 是 |
