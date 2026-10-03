# B2d 第 2 批（b2-u51～u53）審查修正對照表

依據：執行長裁示 t9/b2d2-rulings.md（並沿用 b2cd1、b1b4 等先前裁示）；第②關 b2d2-gate2-a.json、第③關 b2d2-gate3-a.md。
每處修改都記在各課 `judge.resolvedAfterFinalReview`；第②關每條 issue 另有「第②關 issue 結案」紀錄。判題（盲答 120 題位，全部等於正解）已寫入各課 `judge.verdicts`。

## 改到選項、題幹、音檔或短文的題 id（相對送審版 ea5c56b，供重新盲答）

b2-u51-l03-q13、b2-u51-l04-q10、b2-u51-l05-q15、b2-u51-l07-q10、b2-u51-l07-q13、b2-u51-l07-q14、b2-u51-l08-q09、b2-u51-l08-q13、b2-u51-l08-q14、b2-u52-l01-q10、b2-u52-l02-q13、b2-u52-l03-q14、b2-u52-l04-q13、b2-u52-l05-q12、b2-u52-l06-q09、b2-u52-l07-q09、b2-u52-l07-q12、b2-u52-l07-q13、b2-u52-l08-q14、b2-u53-l01-q10、b2-u53-l01-q13、b2-u53-l01-q15、b2-u53-l02-q15、b2-u53-l03-q13、b2-u53-l04-q10、b2-u53-l04-q13、b2-u53-l04-q14、b2-u53-l04-q15、b2-u53-l05-q10、b2-u53-l05-q14、b2-u53-l06-q13、b2-u53-l06-q15、b2-u53-l07-q14、b2-u53-l07-q15、b2-u53-l08-q10、b2-u53-l08-q13、b2-u53-l08-q15（共 37 題）

## 修改明細

| 題 id | 路徑 | 改前 | 改後 | 依據 |
|---|---|---|---|---|
| b2-u51-l01-q16 | items/15/promptZh | 她穿得很優雅地去參加晚宴。 | 她的文章寫得很優雅。 | 第③關 FIX 1：中文不通順，且「為晚宴打扮」與 l04 重複 |
| b2-u51-l01-q16 | items/15/referenceEn | ["She was elegantly dressed for the dinner party.", "She went to the dinner party elegantly dressed."] | ["Her essays are always elegantly written.", "She writes her essays very elegantly."] | 第③關 FIX 1： |
| b2-u51-l01-q16 | items/15/rubricZh | ["要用 elegantly（例如 elegantly dressed）", "「晚宴」可寫，例如 the dinner party、the dinner 等", "時態合理即可（例如 was、went、is 等）"] | ["要用 elegantly（例如 elegantly written、writes elegantly 等）", "「文章」可寫，例如 essays、articles 等", "時態合理即可（例如 are、writes 等）"] | 第③關 FIX 1： |
| b2-u51-l02-q03 | items/2/glossZh | 柔軟；柔和 | 柔和；柔軟 | 第③關 FIX 2：第一義對上例句（聲音的柔和） |
| b2-u51-l02-q17 | items/16/rubricZh/0 | 句子要用到 posh 修飾名詞（例如 a posh hotel、a posh restaurant） | 句子要用到 posh（例如 a posh hotel、The restaurant was posh 等） | 第③關 FIX 3：評分要點不寫死結構 |
| b2-u51-l03-q01 | items/0/exampleEn | It is atypical for him to be late; he is usually early. | A cat that loves playing in water is quite atypical. | 第③關 FIX 4：與 l05 uncharacteristic 句型、事件相同 |
| b2-u51-l03-q01 | items/0/exampleZh | 他遲到很不尋常，他通常都很早到。 | 愛玩水的貓相當少見。 | 第③關 FIX 4：與 l05 uncharacteristic 句型、事件相同 |
| b2-u51-l03-q13 | items/12/stemEn | Penguins are not very ____; they can only live in cold places. | This plant is not very ____; it can only grow in warm, wet places. | 第③關 FIX 5：企鵝並非只能住在寒冷地方（事實） |
| b2-u51-l03-q13 | items/12/stemZh | 企鵝的適應力不太強，只能住在寒冷的地方。 | 這種植物適應力不強，只能長在溫暖潮濕的地方。 | 第③關 FIX 5： |
| b2-u51-l03-q16 | items/15/promptZh | 他從海邊回來，曬得黝黑又很放鬆。 | 打了一整個夏天的網球後，她的手臂曬黑了。 | 第③關 FIX 6：與閱讀「從海邊回來曬黑」重複 |
| b2-u51-l03-q16 | items/15/referenceEn | ["He came back from the beach tanned and relaxed.", "He returned from the beach looking tanned and relaxed."] | ["After a whole summer of tennis, her arms were tanned.", "Her arms got tanned from playing tennis all summer."] | 第③關 FIX 6： |
| b2-u51-l03-q16 | items/15/rubricZh | ["要用 tanned（例如 tanned and relaxed）", "可搭配動詞，例如 came back、returned、looked 等"] | ["要用 tanned（例如 were tanned、got tanned 等）", "時態合理即可（例如 were、got 等）"] | 第③關 FIX 6： |
| b2-u51-l03-q08 | items/7/glossZh | 生動地；用圖表地 | 生動地；以圖像方式 | 第②關：第二義「用圖表地」不成語 |
| b2-u51-l03-q14 | items/13/optionGlossZh/0 | 用圖表地 | 生動地 | 第②關：graphically 釋義改通順 |
| b2-u51-l06-q14 | items/13/optionGlossZh/2 | 用圖表地 | 生動地 | 第②關：graphically 釋義改通順 |
| b2-u51-l04-q05 | items/4/exampleEn | Outwardly the house looks old, but inside it is very modern. | Outwardly, the two phones look the same, but one is much faster. | 第③關 FIX 7：「外表舊、裡面新」與 l02、l07 重複 |
| b2-u51-l04-q05 | items/4/exampleZh | 那棟房子外表看起來很老舊，但裡面非常現代化。 | 這兩支手機外表看起來一樣，但其中一支快得多。 | 第③關 FIX 7：「外表舊、裡面新」與 l02、l07 重複 |
| b2-u51-l04-q10 | items/9/audioEn | Please dress suitably for the dinner; jeans and T-shirts are not allowed. | Please bring suitably warm clothes; it snows up there in the evening. | 第③關 FIX 8：與翻譯題同為「穿著得體赴會」；干擾項沿用音檔的 snow 並被音檔否定 |
| b2-u51-l04-q10 | items/9/audioZh | 晚宴請穿著得體，不可以穿牛仔褲和T恤。 | 請帶適當的保暖衣物，那裡傍晚會下雪。 | 第③關 FIX 8：與翻譯題同為「穿著得體赴會」；干擾項沿用音檔的 snow 並被音檔否定 |
| b2-u51-l04-q10 | items/9/questionZh | 晚宴不可以穿什麼？ | 說話者要對方帶什麼？ | 第③關 FIX 8：與翻譯題同為「穿著得體赴會」；干擾項沿用音檔的 snow 並被音檔否定 |
| b2-u51-l04-q10 | items/9/options | ["Dresses and long skirts", "Suits for the dinner", "Casual jeans and tops", "Jackets and coats"] | ["Light summer shirts", "Only a raincoat", "Warm things to wear", "Nothing for the snow"] | 第③關 FIX 8：與翻譯題同為「穿著得體赴會」；干擾項沿用音檔的 snow 並被音檔否定 |
| b2-u51-l04-q16 | items/15/promptZh | 請穿著得體地去參加面試。 | 請穿著得體去參加面試。 | 第②關：「得體地去」狀語彆扭 |
| b2-u51-l05-q11 | items/10/sentenceEn | The cost of the repairs was almost ruinous for the old theater. | Too much sun can be ruinous for old paintings. | 第③關 FIX 9：與單字卡同句型同事件 |
| b2-u51-l05-q11 | items/10/sentenceZh | 維修費用對那間老劇院來說幾乎是毀滅性的負擔。 | 太多陽光可能會毀了老畫作。 | 第③關 FIX 9：與單字卡同句型同事件 |
| b2-u51-l05-q12 | items/11/sentenceEn | The solidity of the old stone house kept it standing for two hundred years. | I like the solidity of this heavy wooden table. | 第③關 FIX 10：與聽選同為老建物屹立多年 |
| b2-u51-l05-q12 | items/11/sentenceZh | 那棟老石屋十分堅固，讓它屹立了兩百年。 | 我喜歡這張厚重木桌的結實感。 | 第③關 FIX 10：與聽選同為老建物屹立多年 |
| b2-u51-l05-q15 | items/14/passageEn | Last year, Mr. Lin opened a small bakery on our street. At first, the shop was disorganized: the bread was never ready on time, and his patrons waited in lon… | Last year, Mr. Lin opened a small bakery on our street. At first, the shop was disorganized: the bread was never ready on time, and his patrons waited in lon… | 第③關 FIX 11：shaken 不用來形容得獎 |
| b2-u51-l05-q15 | items/14/passageZh | 去年，林先生在我們這條街開了一家小麵包店。一開始店裡亂七八糟：麵包從來沒有準時出爐，常客們都要排很久的隊。不過林先生學得很快。現在他的麵包外酥內軟，價格也無人能比。早上的香味難以形容。他贏得全市烘焙獎時，起初看起來很震驚，接著就笑了，還請大家吃免費的蛋糕。 | 去年，林先生在我們這條街開了一家小麵包店。一開始店裡亂七八糟：麵包從來沒有準時出爐，常客們都要排很久的隊。不過林先生學得很快。現在他的麵包外酥內軟，價格也無人能比。早上的香味難以形容。他贏得全市烘焙獎時，起初幾乎不敢相信，接著就笑了，還請大家吃免費的蛋糕。 | 第③關 FIX 11： |
| b2-u51-l06-q08 | items/7/exampleEn | Fashion is mutable; what is popular today may be forgotten tomorrow. | The rules of this game are mutable; players can change them together. | 第③關 FIX 12：「流行多變」與聽選、l07 重複 |
| b2-u51-l06-q08 | items/7/exampleZh | 流行是多變的，今天流行的東西明天可能就被遺忘。 | 這個遊戲的規則是可變的，玩家可以一起修改。 | 第③關 FIX 12：「流行多變」與聽選、l07 重複 |
| b2-u51-l06-q17 | items/16/referenceEn/1 | I still listen to songs that my friends think are unfashionable. | I still listen to some unfashionable songs from my school days because I love them. | 第③關疑似 17：題目要「你覺得過時」，參考答案的判斷者改成自己 |
| b2-u51-l07-q02 | items/1/exampleEn | Breakable toys are not suitable for very young children. | Glass is breakable, so we use plastic cups at the pool. | 第③關疑似 13：與 u51-l04 都是「不適合小孩」 |
| b2-u51-l07-q02 | items/1/exampleZh | 易碎的玩具不適合年紀很小的孩子。 | 玻璃容易破，所以我們在泳池邊用塑膠杯。 | 第③關疑似 13：與 u51-l04 都是「不適合小孩」 |
| b2-u51-l07-q04 | items/3/exampleEn | The mutability of fashion keeps designers busy. | The mutability of language means that new words appear every year. | 第③關 FIX 13：「流行多變」與 l06 重複 |
| b2-u51-l07-q04 | items/3/exampleZh | 流行的多變讓設計師一直很忙。 | 語言的多變，代表每年都有新字出現。 | 第③關 FIX 13：「流行多變」與 l06 重複 |
| b2-u51-l07-q10 | items/9/audioEn | The unusualness of the building's shape attracts many tourists, but the inside is quite plain. | The unusualness of the cafe's furniture attracts many visitors, but the food is quite ordinary. | 第③關 FIX 14：「建築外觀 vs 內部」與 l02、l04 重複；干擾項沿用音檔的 food、ordinary 並被音檔否定 |
| b2-u51-l07-q10 | items/9/audioZh | 那棟建築外型的與眾不同吸引了許多遊客，但裡面很普通。 | 那家咖啡館家具的與眾不同吸引了許多客人，不過餐點很普通。 | 第③關 FIX 14：「建築外觀 vs 內部」與 l02、l04 重複；干擾項沿用音檔的 food、ordinary 並被音檔否定 |
| b2-u51-l07-q10 | items/9/questionZh | 什麼吸引了遊客？ | 什麼吸引了客人？ | 第③關 FIX 14：「建築外觀 vs 內部」與 l02、l04 重複；干擾項沿用音檔的 food、ordinary 並被音檔否定 |
| b2-u51-l07-q10 | items/9/options | ["Its long history", "Its plain inside", "Its low prices", "Its odd shape"] | ["Its delicious food", "Its very normal chairs", "Its cheap, ordinary meals", "Its odd furniture"] | 第③關 FIX 14：「建築外觀 vs 內部」與 l02、l04 重複；干擾項沿用音檔的 food、ordinary 並被音檔否定 |
| b2-u51-l07-q13 | items/12/stemEn | Pack the plates carefully; they are ____. | Don't play ball in the living room; the vase on the table is ____. | 第③關 FIX 15：與閱讀同為搬家打包易碎餐具 |
| b2-u51-l07-q13 | items/12/stemZh | 盤子要小心打包，它們很容易碎。 | 別在客廳玩球，桌上的花瓶很容易碎。 | 第③關 FIX 15： |
| b2-u51-l07-q14 | items/13/stemEn | The ____ of the water was so great that we could see fish at the bottom. | On a day like this, the ____ of the sky lets you see the mountains far away. | 第③關 FIX 16：與閱讀同為水清澈 |
| b2-u51-l07-q14 | items/13/stemZh | 水清澈到我們看得見底下的魚。 | 在這樣的日子裡，天空很清澈，可以看見遠方的山。 | 第③關 FIX 16： |
| b2-u51-l07-q12 | items/11/sentenceEn | In the past, crossing the ocean in one day was unthinkably fast. | The concert tickets sold out unthinkably quickly. | 第③關 FIX 17：與單字卡同為「過去某事 was unthinkably＋形容詞」 |
| b2-u51-l07-q12 | items/11/sentenceZh | 在過去，一天之內橫越大海是快得不可思議的事。 | 演唱會門票賣完的速度快得不可思議。 | 第③關 FIX 17：與單字卡同為「過去某事 was unthinkably＋形容詞」 |
| b2-u51-l07-q17 | items/16/rubricZh/0 | 句子要用到 untrimmed 修飾名詞（例如 the untrimmed bushes、untrimmed fur） | 句子要用到 untrimmed（例如 the untrimmed bushes、The grass is untrimmed 等） | 第③關 FIX 18：評分要點不寫死結構 |
| b2-u51-l08-q15 | items/14/promptZh | 開車時請雙手握住方向盤。 | 這輛車的方向盤在右邊。 | 第③關 FIX 19：與閱讀同為「雙手握方向盤」 |
| b2-u51-l08-q15 | items/14/referenceEn | ["Please keep both hands on the steering wheel when you drive.", "When driving, please hold the steering wheel with both hands."] | ["The steering wheel of this car is on the right.", "This car has its steering wheel on the right side."] | 第③關 FIX 19： |
| b2-u51-l08-q15 | items/14/rubricZh | ["要用 steering wheel（例如 on the steering wheel）", "「握住」可寫，例如 keep … on、hold 等"] | ["要用 steering wheel（例如 the steering wheel of this car、its steering wheel 等）", "「在右邊」可寫，例如 on the right、on the right side 等"] | 第③關 FIX 19： |
| b2-u51-l08-q13 | items/12/stemEn | The man on the phone spoke so ____ that I had to ask him to repeat his name. | The singer sang the words so ____ that nobody knew what the song was about. | 第③關 FIX 20：與閱讀同為「說話含糊→請他重說」 |
| b2-u51-l08-q13 | items/12/stemZh | 電話裡的男子說話太含糊，我只好請他再說一次名字。 | 那位歌手把歌詞唱得很含糊，沒人知道這首歌在唱什麼。 | 第③關 FIX 20： |
| b2-u51-l08-q14 | items/13/passageEn | My sister started driving lessons last month. Her teacher is calm and well-organized, and every lesson has a clear plan. On the first day, she held the steer… | My sister started driving lessons last month. Her teacher is calm and well-organized, and every lesson has a clear plan. On the first day, she held the steer… | 第②關：噪音不會讓教練「說得不清楚」，因果不順 |
| b2-u51-l08-q14 | items/13/passageZh | 我姊姊上個月開始上駕訓課。她的教練冷靜又有條理，每堂課都有清楚的計畫。第一天，她把方向盤握得太緊，手都痛了。在車多的十字路口，教練有時因為交通噪音說話聽不清楚，她只好請他再說一遍。她也得留意每一位行人。兩個小時後，她回到家累壞了，但很得意。 | 我姊姊上個月開始上駕訓課。她的教練冷靜又有條理，每堂課都有清楚的計畫。第一天，她把方向盤握得太緊，手都痛了。在車多的十字路口，教練有時低頭看筆記，說話不太清楚，她只好請他再說一遍。她也得留意每一位行人。兩個小時後，她回到家累壞了，但很得意。 | 第②關： |
| b2-u51-l08-q14 | items/13/questions/1/questionZh | 為什麼教練說話有時聽不清楚？ | 為什麼教練說話有時不清楚？ | 第②關：配合閱讀改寫 |
| b2-u51-l08-q14 | items/13/questions/1/options | ["交通噪音太大", "他說得太快", "他口音重", "車窗一直沒有關上"] | ["他低頭看筆記", "他說得太快", "他口音重", "車窗一直沒有關上"] | 第②關：配合閱讀改寫 |
| b2-u51-l08-q07 | items/6/exampleEn | He finally threw away his wornout running shoes. | The runners were worn out after the long race. | 裁示：wornout 是非標準拼法；headword 受課綱限制保留，例句與其他題改寫 worn out，釋義註明 |
| b2-u51-l08-q07 | items/6/exampleZh | 他終於把那雙穿壞的跑鞋丟掉了。 | 長跑比賽後，選手們都累壞了。 | 裁示：wornout 是非標準拼法；headword 受課綱限制保留，例句與其他題改寫 worn out，釋義註明 |
| b2-u51-l08-q07 | items/6/glossZh | 破舊的；累壞的（常寫 worn-out） | 累壞的；破舊的（應寫 worn out） | 裁示：wornout 是非標準拼法；headword 受課綱限制保留，例句與其他題改寫 worn out，釋義註明 |
| b2-u51-l08-q10 | items/9/sentenceEn | After the long hike, I felt completely wornout. | After the long hike, I felt completely worn out. | 裁示：wornout 改寫 worn out |
| b2-u51-l08-q14 | items/13/passageEn | My sister started driving lessons last month. Her teacher is calm and well-organized, and every lesson has a clear plan. On the first day, she held the steer… | My sister started driving lessons last month. Her teacher is calm and well-organized, and every lesson has a clear plan. On the first day, she held the steer… | 裁示：wornout 改寫 worn out |
| b2-u51-l08-q09 | items/8/options | ["Old and dark", "Neat and easy to use", "Its labels are unclear", "Big but quite messy inside"] | ["Old and dark", "Tidy and well marked", "Messy, with unclear labels", "Big but quite messy inside"] | 第③關疑似 18：正解 easy to use 是推論；改成同義改寫，干擾項沿用音檔的 labels |
| b2-u52-l01-q08 | items/7/exampleEn | The narcissistic singer talked only about himself during the interview. | Her narcissistic friend posts photos of herself online every day. | 第③關 FIX 21：與閱讀同為「節目中只講自己」 |
| b2-u52-l01-q08 | items/7/exampleZh | 那位自戀的歌手在訪問中只談論他自己。 | 她那個自戀的朋友每天都在網路上貼自己的照片。 | 第③關 FIX 21：與閱讀同為「節目中只講自己」 |
| b2-u52-l01-q10 | items/9/audioEn | It was unkind of him to laugh, but he said sorry to her the next day. | It was unkind of him to forget her birthday, but he said sorry to her the next day. | 第③關 FIX 22：與造句參考、閱讀同為「嘲笑別人」；干擾項沿用音檔的 say sorry 並被音檔否定 |
| b2-u52-l01-q10 | items/9/audioZh | 他笑出來很不厚道，不過隔天他向她道歉了。 | 他忘了她的生日，很不應該，不過隔天他向她道歉了。 | 第③關 FIX 22：與造句參考、閱讀同為「嘲笑別人」；干擾項沿用音檔的 say sorry 並被音檔否定 |
| b2-u52-l01-q10 | items/9/options | ["He gave her a gift", "He laughed at her again", "He left town", "He apologized to her"] | ["He waited a week to say sorry", "He never said sorry", "He said nothing", "He apologized to her"] | 第③關 FIX 22：與造句參考、閱讀同為「嘲笑別人」；干擾項沿用音檔的 say sorry 並被音檔否定 |
| b2-u52-l01-q17 | items/16/referenceEn/0 | It was unkind of my classmate to laugh at my new haircut. | It was unkind of my classmate to read my diary without asking. | 第③關 FIX 23：同上 |
| b2-u52-l01-q16 | items/15/referenceEn | ["Dishonesty can destroy even a long friendship.", "Dishonesty can easily ruin a friendship between two people."] | ["A friendship can be destroyed by dishonesty.", "A friendship can be ruined by dishonesty."] | 第③關疑似 14：參考答案不加原文沒有的資訊 |
| b2-u52-l01-q16 | items/15/rubricZh/0 | 要用 dishonesty 當主詞（例如 Dishonesty can…） | 要用 dishonesty（例如 Dishonesty can…、be ruined by dishonesty 等），主動句、被動句都可以 | 第③關 FIX 24：評分要點不寫死主詞 |
| b2-u52-l01-q07 | items/6/exampleEn | In the fairy tale, the prince is cruelly treated by his stepmother. | In the fairy tale, the giant cruelly locks the prince in a tower. | 第③關疑似 5：避免「壞繼母」刻板印象 |
| b2-u52-l01-q07 | items/6/exampleZh | 在那個童話故事裡，王子遭到繼母殘忍對待。 | 在那個童話故事裡，巨人殘忍地把王子關在塔裡。 | 第③關疑似 5：避免「壞繼母」刻板印象 |
| b2-u52-l02-q13 | items/12/stemEn | She is so ____ that she gives everyone orders, even her boss. | He's so ____ that he even tells his older brothers how to do their jobs. | 第③關 FIX 25：與閱讀同為「對大家發號施令」 |
| b2-u52-l02-q13 | items/12/stemZh | 她愛指使人到對每個人發號施令，連老闆也不例外。 | 他愛指使人到連哥哥們該怎麼做事都要管。 | 第③關 FIX 25： |
| b2-u52-l03-q07 | items/6/exampleEn | He jealously guarded his special cooking method from his rivals. | She looked jealously at her sister's new bike. | 第③關 FIX 26：例句示範第一義「嫉妒地」 |
| b2-u52-l03-q07 | items/6/exampleZh | 他小心翼翼地守住獨門做法，不讓對手知道。 | 她嫉妒地看著姊姊的新腳踏車。 | 第③關 FIX 26：例句示範第一義「嫉妒地」 |
| b2-u52-l03-q14 | items/13/stemEn | Thoughts of the coming exam ____ her all weekend, so she couldn't relax. | Planning her garden ____ my mother all spring; she could talk about nothing else. | 第③關 FIX 27：與單字卡同句型同為「擔心即將到來的事」 |
| b2-u52-l03-q14 | items/13/stemZh | 即將到來的考試佔據了她整個週末的心思，讓她無法放鬆。 | 規劃花園佔據了我媽媽整個春天的心思，她什麼別的都不談。 | 第③關 FIX 27： |
| b2-u52-l03-q17 | items/16/referenceEn/0 | I read a heartwarming story about a boy who helped his neighbor. | My grandparents' fiftieth wedding anniversary was a heartwarming day. | 第③關疑似 11：與 mcq 同為 heartwarming story |
| b2-u52-l03-q17 | items/16/rubricZh | ["句子要用到 heartwarming（例如 a heartwarming story、was heartwarming）", "時態配合內容（例如 read、was 等）"] | ["句子要用到 heartwarming（例如 a heartwarming day、was heartwarming 等）", "時態配合內容（例如 was、is 等）"] | 第③關疑似 11： |
| b2-u52-l04-q06 | items/5/exampleEn | Some people believe that shy feelings are inborn. | Some people believe that being shy is inborn. | 第③關 FIX 28：shy feelings 不道地 |
| b2-u52-l04-q06 | items/5/exampleZh | 有些人認為害羞的感覺是天生的。 | 有些人認為害羞是天生的。 | 第③關 FIX 28：shy feelings 不道地 |
| b2-u52-l04-q13 | items/12/stemEn | It's ____ to look at your phone while someone is talking to you. | My little brother was ____ to our guests and didn't even say hello. | 第③關 FIX 29：與翻譯題同句型，且「看手機失禮」與 l07、l08 重複 |
| b2-u52-l04-q13 | items/12/stemZh | 別人跟你說話時看手機是不禮貌的。 | 我弟弟對客人很沒禮貌，連招呼都沒打。 | 第③關 FIX 29： |
| b2-u52-l05-q12 | items/11/stemEn | The ____ fans sang and danced in the streets after their team won. | She was ____ when she heard that she had passed her driving test. | 第③關 FIX 30：與閱讀同為「球隊贏球後狂喜」 |
| b2-u52-l05-q12 | items/11/stemZh | 欣喜若狂的球迷在球隊獲勝後，在街上又唱又跳。 | 她得知自己通過駕照考試時欣喜若狂。 | 第③關 FIX 30： |
| b2-u52-l05-q16 | items/15/referenceEn/0 | I'm not bothered if people think my clothes are old. | I was quite bothered when my friend was late for our lunch. | 第③關 FIX 31：與聽選同為 I'm not bothered about… |
| b2-u52-l05-q16 | items/15/rubricZh | ["句子要用到 bothered（例如 I'm not bothered…、get bothered when…）", "時態配合內容（例如 am、get 等）"] | ["句子要用到 bothered（例如 I was bothered when…、get bothered when… 等）", "時態配合內容（例如 was、get 等）"] | 第③關 FIX 31： |
| b2-u52-l06-q02 | items/1/exampleEn | My uncle is such a scrooge that he never turns on the heater. | The shop owner was a real scrooge and never gave his workers a day off. | 第③關 FIX 32：與 l02 聽選同為「我叔叔小氣到…」 |
| b2-u52-l06-q02 | items/1/exampleZh | 我叔叔是個大吝嗇鬼，從來不開暖氣。 | 那個店老闆是個不折不扣的吝嗇鬼，從不讓員工放假。 | 第③關 FIX 32：與 l02 聽選同為「我叔叔小氣到…」 |
| b2-u52-l06-q09 | items/8/options/0 | In third place | Just inside the top three | 第③關疑似 3：正解是唯一不用 In X place 格式的選項，干擾項改成相同格式（被音檔「第五名」否定） |
| b2-u52-l07-q09 | items/8/audioEn | The meeting was so wearisome that half of us were looking at our phones. | The train ride was so wearisome that half of the passengers fell asleep. | 第③關 FIX 33：與單字卡同為冗長演講或會議，「開會看手機」與 l04、l08 重複；干擾項沿用音檔的 train、ride |
| b2-u52-l07-q09 | items/8/audioZh | 那場會議無聊到我們有一半的人都在看手機。 | 那趟火車旅程無聊到一半的乘客都睡著了。 | 第③關 FIX 33：與單字卡同為冗長演講或會議，「開會看手機」與 l04、l08 重複；干擾項沿用音檔的 train、ride |
| b2-u52-l07-q09 | items/8/questionZh | 會議中有一半的人在做什麼？ | 一半的乘客做了什麼？ | 第③關 FIX 33：與單字卡同為冗長演講或會議，「開會看手機」與 l04、l08 重複；干擾項沿用音檔的 train、ride |
| b2-u52-l07-q09 | items/8/options | ["Checking their screens", "Taking notes", "Talking about the meeting", "Leaving the room early"] | ["Took a nap on the way", "Got off the train early", "Talked about the long ride", "Stayed wide awake"] | 第③關 FIX 33：與單字卡同為冗長演講或會議，「開會看手機」與 l04、l08 重複；干擾項沿用音檔的 train、ride |
| b2-u52-l07-q12 | items/11/stemEn | Having lived on a quiet farm all his life, my uncle was so ____ that he believed every stranger's story. | Having grown up with very protective parents, my cousin was so ____ that he believed every stranger's story. | 裁示：「農場長大＝天真」屬刻板印象（第②關、第③關疑似 4） |
| b2-u52-l07-q12 | items/11/stemZh | 我叔叔一輩子住在安靜的農場，不諳世事到相信每個陌生人說的故事。 | 我表哥從小被父母保護得很好，不諳世事到相信每個陌生人說的故事。 | 裁示：「農場長大＝天真」屬刻板印象 |
| b2-u52-l07-q13 | items/12/stemEn | The ballet dancer moved across the stage with great ____. | The swan moved across the lake with great ____. | 第③關 FIX 34：與閱讀同為芭蕾；混合詞性題干擾項不足 |
| b2-u52-l07-q13 | items/12/stemZh | 那位芭蕾舞者以極優雅的姿態滑過舞台。 | 那隻天鵝以極優雅的姿態滑過湖面。 | 第③關 FIX 34： |
| b2-u52-l07-q13 | items/12/options/0 | layabout | benevolence | 第③關 FIX 34：layabout 放不進空格，換成放得進空格但語意不通的 benevolence |
| b2-u52-l07-q13 | items/12/optionGlossZh/0 | 懶漢 | 仁慈 | 第③關 FIX 34：layabout 放不進空格，換成放得進空格但語意不通的 benevolence |
| b2-u52-l08-q02 | items/1/exampleEn | Many drivers are fed up with the traffic on this road. | Many students are fed up with having tests every week. | 第③關 FIX 35：兩張單字卡都是駕駛與塞車 |
| b2-u52-l08-q02 | items/1/exampleZh | 許多駕駛受夠了這條路的交通。 | 許多學生受夠了每週都要考試。 | 第③關 FIX 35：兩張單字卡都是駕駛與塞車 |
| b2-u52-l08-q15 | items/14/referenceEn/0 | I always have nerves before a competition. | My nerves are always bad before a competition. | 第②關：I always have nerves 不自然 |
| b2-u52-l08-q15 | items/14/rubricZh | ["要用 nerves（例如 have nerves、suffer from nerves）", "「比賽」可寫，例如 a competition、a race、a game 等", "always 放在一般動詞前"] | ["要用 nerves（例如 my nerves are bad、suffer from nerves 等）", "「比賽」可寫，例如 a competition、a race、a game 等", "頻率副詞位置正確即可（例如放在一般動詞前 always suffer、be 動詞後 are always 等）"] | 第③關 FIX 36：評分要點不寫死位置 |
| b2-u52-l08-q14 | items/13/passageEn | Last month, I gave my first presentation at work. The night before, my nerves were so bad that I couldn't sleep. My manager, a self-confident woman who is an… | Last month, I gave my first presentation at work. The night before, my nerves were so bad that I couldn't sleep. My manager, a self-confident woman who is an… | 第③關 FIX 37：「場合中用手機」與同單元多課重複；改「中途離場」以免與跟讀「打斷講者」雷同 |
| b2-u52-l08-q14 | items/13/passageZh | 上個月，我在公司做了第一次簡報。前一晚我緊張到睡不著。我的經理是一位很有自信、經驗豐富的簡報者，她要我對著鏡子練習。簡報中，後排有個男人很沒禮貌地接起電話，但我繼續講下去。這需要膽量，但我講完了，之後我感覺到自己的自信心在增長。 | 上個月，我在公司做了第一次簡報。前一晚我緊張到睡不著。我的經理是一位很有自信、經驗豐富的簡報者，她要我對著鏡子練習。簡報中，後排有個男人很沒禮貌地中途離場，但我繼續講下去。這需要膽量，但我講完了，之後我感覺到自己的自信心在增長。 | 第③關 FIX 37： |
| b2-u52-l08-q14 | items/13/questions/1/options | ["突然停電", "投影機突然壞掉了", "有人接電話", "經理中途離開會議室"] | ["突然停電", "投影機突然壞掉了", "有人中途離場", "經理中途離開會議室"] | 第③關 FIX 37： |
| b2-u53-l01-q03 | items/2/exampleEn | The nurse put a cold compress on my swollen ankle. | He compressed all his clothes into one small bag. | 裁示：改教常用動詞義；compress 改教動詞「壓縮」，不碰醫療情境（第③關 FIX 38） |
| b2-u53-l01-q03 | items/2/exampleZh | 護理師在我腫起來的腳踝上放了冷敷布。 | 他把所有衣服都壓進一個小袋子裡。 | 裁示：改教常用動詞義；compress 改教動詞「壓縮」，不碰醫療情境（第③關 FIX 38） |
| b2-u53-l01-q03 | items/2/glossZh | 敷布（冷敷或熱敷用） | 壓縮；壓緊 | 裁示：改教常用動詞義；compress 改教動詞「壓縮」，不碰醫療情境（第③關 FIX 38） |
| b2-u53-l01-q03 | items/2/distractorsZh | ["藥膏", "枕頭", "毛毯"] | ["攤開", "洗淨", "晾乾"] | 裁示：改教常用動詞義；compress |
| b2-u53-l01-q10 | items/9/audioEn | Put a warm compress on your eye twice a day, and the swelling should go down. | Please compress the photos before you email them; the files are too big. | 第③關 FIX 39：醫療建議改成壓縮檔案；干擾項沿用音檔的字並被音檔否定 |
| b2-u53-l01-q10 | items/9/audioZh | 每天在眼睛上熱敷兩次，腫應該就會消了。 | 寄照片前請先壓縮，檔案太大了。 | 第③關 FIX 39：醫療建議改成壓縮檔案；干擾項沿用音檔的字並被音檔否定 |
| b2-u53-l01-q10 | items/9/questionZh | 說話者建議怎麼做？ | 說話者要對方先做什麼？ | 第③關 FIX 39：醫療建議改成壓縮檔案；干擾項沿用音檔的字並被音檔否定 |
| b2-u53-l01-q10 | items/9/options | ["Wash the eye twice a day", "Put a cold cloth on the eye twice a day", "Rest the eye once a day", "Keep something warm on the eye"] | ["Email the photos as they are", "Keep the files big", "Send them right away", "Make the files smaller"] | 第③關 FIX 39：醫療建議改成壓縮檔案；干擾項沿用音檔的字並被音檔否定 |
| b2-u53-l01-q12 | items/11/sentenceEn | After the long run, she wrapped a cold compress around her knee. | This machine compresses old cans into small blocks. | 第③關 FIX 40：運動傷害冷敷改成中性情境 |
| b2-u53-l01-q12 | items/11/sentenceZh | 長跑之後，她在膝蓋上包了一塊冷敷布。 | 這台機器把舊罐子壓成小方塊。 | 第③關 FIX 40：運動傷害冷敷改成中性情境 |
| b2-u53-l01-q06 | items/5/exampleEn | The traverse of the snowy mountain took the climbers two days. | It took the climbers two days to traverse the snowy mountain. | 裁示：改教常用動詞義；traverse（第③關 FIX 41） |
| b2-u53-l01-q06 | items/5/glossZh | 橫越（的路線） | 橫越；穿過 | 裁示：改教常用動詞義；traverse |
| b2-u53-l01-q06 | items/5/distractorsZh | ["休息", "地圖", "營地"] | ["搬運", "拍攝", "描述"] | 裁示：改教常用動詞義；traverse |
| b2-u53-l01-q15 | items/14/passageEn | On Saturday, our hiking club began a traverse of the long ridge above the lake. Thick fog soon engulfed the trail, and the cold permeated our thin jackets. M… | On Saturday, our hiking club set out to traverse the long ridge above the lake. Thick fog soon engulfed the trail, and the cold permeated our thin jackets. M… | 裁示：改教常用動詞義；traverse |
| b2-u53-l01-q15 | items/14/passageZh | 星期六，我們的健行社開始橫越湖上方那道長長的山脊。濃霧很快籠罩了步道，寒氣也滲進我們單薄的外套。泥巴塞滿了靴子，所以我們走得很慢。我的手機震動時，是領隊傳來的訊息：大家到山脊上的舊小屋等。我們在那裡休息到霧散，然後走完全程，雖然累但很開心。 | 星期六，我們的健行社出發橫越湖上方那道長長的山脊。濃霧很快籠罩了步道，寒氣也滲進我們單薄的外套。泥巴塞滿了靴子，所以我們走得很慢。我的手機震動時，是領隊傳來的訊息：大家到山脊上的舊小屋等。我們在那裡休息到霧散，然後走完全程，雖然累但很開心。 | 裁示：改教常用動詞義；traverse |
| b2-u53-l01-q13 | items/12/stemEn | The smell of smoke can ____ your clothes, so I never sit close to the fire. | Water from the rain needs time to ____ the hard, dry soil. | 第③關 FIX 42：與單字卡同為 The smell of X permeate Y |
| b2-u53-l01-q13 | items/12/stemZh | 煙味會滲進衣服裡，所以我從不坐在火堆旁邊。 | 雨水需要時間才能滲進又硬又乾的土壤。 | 第③關 FIX 42： |
| b2-u53-l01-q17 | items/16/referenceEn/0 | My little sister laughs when I tickle her. | My cat's soft tail tickles my face in the morning. | 第③關 FIX 43：與單字卡同為搔小孩癢 |
| b2-u53-l01-q17 | items/16/rubricZh/0 | 句子要用到 tickle（例如 tickle someone、tickles my neck） | 句子要用到 tickle（例如 tickles my face、tickles my neck 等） | 第③關 FIX 43： |
| b2-u53-l02-q05 | items/4/exampleEn | His blurt of "No way!" broke the silence of the meeting. | He blurted out the answer before the teacher finished the question. | 裁示：改教常用動詞義；blurt（第③關 FIX 44） |
| b2-u53-l02-q05 | items/4/exampleZh | 他脫口而出的一句「不可能！」打破了會議的安靜。 | 老師還沒問完，他就脫口說出答案。 | 裁示：改教常用動詞義；blurt（第③關 FIX 44） |
| b2-u53-l02-q05 | items/4/glossZh | 脫口而出（的話） | 脫口而出 | 裁示：改教常用動詞義；blurt（第③關 FIX 44） |
| b2-u53-l02-q05 | items/4/distractorsZh | ["嘆氣", "歌聲", "掌聲"] | ["低聲說", "寫下", "忘記"] | 裁示：改教常用動詞義；blurt |
| b2-u53-l02-q09 | items/8/sentenceEn | I heard a blurt of laughter from the back of the bus. | Please don't blurt out the ending of the movie! | 裁示：改教常用動詞義；blurt；a blurt of laughter 不道地 |
| b2-u53-l02-q09 | items/8/sentenceZh | 我聽到公車後面有人忍不住笑出聲來。 | 拜託別把電影結局說出來！ | 裁示：改教常用動詞義；blurt；a blurt of laughter 不道地 |
| b2-u53-l02-q15 | items/14/passageEn | Last Friday, our school held a charity sale for the library, and people could bid for every item. Before it began, volunteers tacked a list of the items to t… | Last Friday, our school held a charity sale for the library, and people could bid for every item. Before it began, volunteers tacked a list of the items to t… | 裁示：改教常用動詞義；blurt；let out a blurt of surprise 不道地 |
| b2-u53-l02-q15 | items/14/passageZh | 上星期五，我們學校替圖書館辦了一場義賣會，每件物品都可以競標。開始前，志工把義賣品清單用圖釘釘在牆上。第一件是一個小手工藝品，接著是一位名畫家隨手畫的塗鴉。這件作品的出價非常快。價格到五百元時，前排一個女孩驚訝得脫口叫出聲，大家都笑了。最後，一位安靜的老先生買下了它，眼裡閃著喜悅的光芒。 | 上星期五，我們學校替圖書館辦了一場義賣會，每件物品都可以競標。開始前，志工把義賣品清單用圖釘釘在牆上。第一件是一個小手工藝品，接著是一位名畫家隨手畫的塗鴉。這件作品的出價非常快。價格到五百元時，前排一個女孩脫口喊出「哇！」，大家都笑了。最後，一位安靜的老先生買下了它，眼裡閃著喜悅的光芒。 | 裁示：改教常用動詞義；blurt |
| b2-u53-l02-q14 | items/13/optionGlossZh/3 | 脫口而出的話 | 脫口而出 | 裁示：改教常用動詞義；blurt |
| b2-u53-l02-q03 | items/2/exampleEn | Our puppy is going to obedience classes every Saturday. | Good teachers want understanding, not just obedience, from their students. | 第③關 FIX 45：與聽選同為狗上服從訓練課 |
| b2-u53-l02-q03 | items/2/exampleZh | 我們的小狗每個星期六都去上服從訓練課。 | 好老師希望學生理解，而不只是服從。 | 第③關 FIX 45：與聽選同為狗上服從訓練課 |
| b2-u53-l02-q03 | items/2/distractorsZh | ["跳舞", "美容", "跑步"] | ["創意", "幽默", "熱情"] | 第③關 FIX 45： |
| b2-u53-l02-q15 | items/14/passageEn | Last Friday, our school held a charity sale for the library, and people could bid for every item. Before it began, volunteers tacked a list of the items to t… | Last Friday, our school held a charity sale for the library, and people could bid for every item. Before it began, volunteers tacked a list of the items to t… | 第③關 FIX 46：結尾「眼中閃著喜悅」與 l05 重複 |
| b2-u53-l02-q15 | items/14/passageZh | 上星期五，我們學校替圖書館辦了一場義賣會，每件物品都可以競標。開始前，志工把義賣品清單用圖釘釘在牆上。第一件是一個小手工藝品，接著是一位名畫家隨手畫的塗鴉。這件作品的出價非常快。價格到五百元時，前排一個女孩脫口喊出「哇！」，大家都笑了。最後，一位安靜的老先生買下了它，眼裡閃著喜悅的光芒。 | 上星期五，我們學校替圖書館辦了一場義賣會，每件物品都可以競標。開始前，志工把義賣品清單用圖釘釘在牆上。第一件是一個小手工藝品，接著是一位名畫家隨手畫的塗鴉。這件作品的出價非常快。價格到五百元時，前排一個女孩脫口喊出「哇！」，大家都笑了。最後，一位安靜的老先生買下了它，開心地笑了。 | 第③關 FIX 46： |
| b2-u53-l03-q01 | items/0/exampleEn | Good food and enough sleep nourish a growing child. | The mother bird brings worms to nourish her babies. | 第③關 FIX 47：刪去保健說法 |
| b2-u53-l03-q01 | items/0/exampleZh | 好的食物和充足的睡眠能滋養成長中的孩子。 | 鳥媽媽帶蟲回來餵養雛鳥。 | 第③關 FIX 47：刪去保健說法 |
| b2-u53-l03-q17 | items/16/instructionZh | 用 nourish 造一個句子，說明什麼東西能滋養身體、心靈或植物。 | 用 nourish 造一個句子，說明什麼東西能滋養心靈、植物或動物。 | 第③關 FIX 48：刪去飲食說法 |
| b2-u53-l03-q17 | items/16/referenceEn/0 | Fresh fruit and vegetables nourish our bodies. | Good music always nourishes my soul. | 第③關 FIX 48： |
| b2-u53-l03-q17 | items/16/rubricZh | ["句子要用到 nourish（例如 nourish our bodies、nourishes the mind）", "主詞與動詞要一致（例如 fruit and vegetables nourish、reading nourishes 等）"] | ["句子要用到 nourish（例如 nourishes my soul、nourishes the mind 等）", "主詞與動詞要一致（例如 music nourishes、books nourish 等）"] | 第③關 FIX 48： |
| b2-u53-l03-q16 | items/15/referenceEn/1 | It took us five years to reach the attainment of this goal. | Five years of hard work led to the attainment of this goal. | 第③關 FIX 49：reach the attainment 語意重複 |
| b2-u53-l03-q13 | items/12/options/3 | scribble | attainment | 第③關 FIX 50：scribble 是可數名詞，無冠詞放不進空格（文法線索） |
| b2-u53-l03-q13 | items/12/optionGlossZh/3 | 塗鴉 | 成就 | 第③關 FIX 50：scribble 是可數名詞，無冠詞放不進空格（文法線索） |
| b2-u53-l03-q02 | items/1/exampleEn | The new design improved the website's accessibility for older users. | The new design improved the website's accessibility for users who cannot see well. | 第③關疑似 6：避免「年長者不會用網站」 |
| b2-u53-l03-q02 | items/1/exampleZh | 新設計讓年長的使用者更容易使用這個網站。 | 新設計讓視力不好的使用者也更容易使用這個網站。 | 第③關疑似 6：避免「年長者不會用網站」 |
| b2-u53-l04-q01 | items/0/exampleEn | We heard the trample of horses outside the gate. | Please don't trample the flowers when you walk across the garden. | 裁示：改教常用動詞義；trample（第③關 FIX 51） |
| b2-u53-l04-q01 | items/0/exampleZh | 我們聽到大門外有馬匹踩踏的聲音。 | 走過花園時請不要踩到花。 | 裁示：改教常用動詞義；trample（第③關 FIX 51） |
| b2-u53-l04-q01 | items/0/glossZh | 踩踏（聲） | 踩踏；踐踏 | 裁示：改教常用動詞義；trample（第③關 FIX 51） |
| b2-u53-l04-q01 | items/0/distractorsZh | ["嘶叫", "氣味", "影子"] | ["澆水", "摘取", "種植"] | 裁示：改教常用動詞義；trample |
| b2-u53-l04-q09 | items/8/sentenceEn | The trample of feet on the stairs woke the baby. | The cows trampled the grass near the gate. | 裁示：改教常用動詞義；trample |
| b2-u53-l04-q09 | items/8/sentenceZh | 樓梯上咚咚咚的腳步聲吵醒了寶寶。 | 牛群把大門附近的草踩平了。 | 裁示：改教常用動詞義；trample |
| b2-u53-l04-q13 | items/12/options/1 | trample | scribble | 裁示：改教常用動詞義；trample 改教動詞，名詞題的干擾項換成名詞 scribble |
| b2-u53-l04-q13 | items/12/optionGlossZh/1 | 踩踏聲 | 塗鴉 | 裁示：改教常用動詞義；trample 改教動詞，名詞題的干擾項換成名詞 scribble |
| b2-u53-l04-q02 | items/1/exampleEn | A small tremor shook the town last night, but nobody was hurt. | There was a slight tremor in her voice as she said goodbye. | 第③關 FIX 52：與跟讀同為有感地震，且帶傷亡聯想 |
| b2-u53-l04-q02 | items/1/exampleZh | 昨晚鎮上發生了輕微的地震，但沒有人受傷。 | 她說再見時，聲音微微顫抖。 | 第③關 FIX 52：與跟讀同為有感地震，且帶傷亡聯想 |
| b2-u53-l04-q02 | items/1/glossZh | 輕微地震；顫抖 | 顫抖；輕微地震 | 第③關 FIX 52：與跟讀同為有感地震，且帶傷亡聯想 |
| b2-u53-l04-q02 | items/1/distractorsZh | ["大雨", "停電", "噪音"] | ["笑意", "回音", "怒氣"] | 第③關 FIX 52： |
| b2-u53-l04-q04 | items/3/exampleEn | My new sweater makes my arms itch. | Dry winter air often makes my skin itch. | 第③關 FIX 53：與 l01 毛衣刺癢雷同，手臂發癢又和閱讀重複 |
| b2-u53-l04-q04 | items/3/exampleZh | 我的新毛衣讓我的手臂發癢。 | 冬天乾燥的空氣常讓我的皮膚發癢。 | 第③關 FIX 53：與 l01 毛衣刺癢雷同，手臂發癢又和閱讀重複 |
| b2-u53-l04-q10 | items/9/audioEn | Don't scratch the bite, or it'll itch even more; put some cream on it instead. | My dog keeps scratching his ears because they itch, so I'm giving him a bath tonight. | 第③關 FIX 54：擦藥膏屬醫療建議；干擾項沿用音檔的 scratching、ears |
| b2-u53-l04-q10 | items/9/audioZh | 別抓蚊子咬的包，不然會更癢；改擦點藥膏吧。 | 我的狗一直抓耳朵，因為耳朵癢，所以我今晚要幫牠洗澡。 | 第③關 FIX 54：擦藥膏屬醫療建議；干擾項沿用音檔的 scratching、ears |
| b2-u53-l04-q10 | items/9/questionZh | 說話者建議怎麼做？ | 說話者今晚打算做什麼？ | 第③關 FIX 54：擦藥膏屬醫療建議；干擾項沿用音檔的 scratching、ears |
| b2-u53-l04-q10 | items/9/options | ["Put something on the bite", "Scratch the bite to stop the itch", "Leave the bite alone and do nothing", "Scratch it a little more"] | ["Give the dog a wash", "Take the dog for a walk", "Scratch the dog's ears", "Feed the dog"] | 第③關 FIX 54：擦藥膏屬醫療建議；干擾項沿用音檔的 scratching、ears |
| b2-u53-l04-q06 | items/5/exampleEn | The captain bellowed orders across the windy deck. | From the top of the hill, he bellowed his friend's name, but nobody answered. | 第③關 FIX 55：與閱讀同為領隊大聲下命令 |
| b2-u53-l04-q06 | items/5/exampleZh | 船長在風很大的甲板上大聲吼著下命令。 | 他在山頂大聲喊朋友的名字，但沒人回應。 | 第③關 FIX 55：與閱讀同為領隊大聲下命令 |
| b2-u53-l04-q07 | items/6/exampleEn | I forgot my umbrella and got soaked on the way home. | The kids were soaked after their water fight in the yard. | 第③關 FIX 56：「淋雨濕透」與閱讀、l08 重複 |
| b2-u53-l04-q07 | items/6/exampleZh | 我忘了帶傘，回家路上全身濕透了。 | 孩子們在院子裡打完水仗後全身濕透。 | 第③關 FIX 56：「淋雨濕透」與閱讀、l08 重複 |
| b2-u53-l04-q15 | items/14/passageEn | On the first day of summer camp, heavy rain fell all afternoon, and we were soaked by the time we reached our cabins. That night, my arms began to itch from … | On the first day of summer camp, we had to cross a shallow river, and we were soaked by the time we reached our cabins. That night, my arms began to itch fro… | 第③關 FIX 57：「淋雨濕透」與 l08 重複 |
| b2-u53-l04-q15 | items/14/passageZh | 夏令營第一天，整個下午都下著大雨，我們走到小木屋時已經全身濕透。那天晚上，我的手臂被蟲咬得開始發癢。隔天早上，領隊在門外大吼：「全部起床！」他說夏令營不只是為了玩，而是要培養我們的團隊合作和耐心。到了週末，那片荒野已經讓我們覺得像家一樣。 | 夏令營第一天，我們得涉水過一條淺淺的河，走到小木屋時已經全身濕透。那天晚上，我的手臂被蟲咬得開始發癢。隔天早上，領隊在門外大吼：「全部起床！」他說夏令營不只是為了玩，而是要培養我們的團隊合作和耐心。到了週末，那片荒野已經讓我們覺得像家一樣。 | 第③關 FIX 57： |
| b2-u53-l04-q15 | items/14/questions/0/options | ["雨在中午前就停了", "衣服還是乾的", "全身濕透了", "他們迷了路，很晚才到"] | ["衣服還是乾的", "河水太深，只好繞路", "全身濕透了", "他們迷了路，很晚才到"] | 第③關 FIX 57： |
| b2-u53-l04-q14 | items/13/stemEn | A few funny stories can ____ a quiet class and get everyone talking. | A new puppy can ____ a quiet home and make everyone laugh. | 第③關 FIX 58：與單字卡同為讓課堂熱鬧 |
| b2-u53-l04-q14 | items/13/stemZh | 幾個好笑的故事就能讓安靜的班級活絡起來，大家開始聊天。 | 一隻小狗就能讓安靜的家熱鬧起來，逗大家笑。 | 第③關 FIX 58： |
| b2-u53-l04-q16 | items/15/promptZh | 這棟老房子撐過了歲月的摧殘。 | 這張老照片看得出歲月的摧殘。 | 第③關疑似 9：與單字卡同為舊物件＋the ravages of time，換成照片 |
| b2-u53-l04-q16 | items/15/referenceEn | ["This old house has survived the ravages of time.", "This old house has lasted through the ravages of time."] | ["This old photo shows the ravages of time.", "You can see the ravages of time in this old photo."] | 第③關疑似 9： |
| b2-u53-l04-q16 | items/15/rubricZh | ["要用 ravage 的複數形（例如 the ravages of time）", "「撐過」可寫，例如 survive、last through 等"] | ["要用 ravage 的複數形（例如 the ravages of time）", "「看得出」可寫，例如 shows、you can see 等"] | 第③關疑似 9： |
| b2-u53-l05-q04 | items/3/exampleEn | I felt a sharp prick when the nurse gave me the shot. | I felt a sharp prick when I touched the rose. | 第③關 FIX 59：護理師打針屬醫療情境 |
| b2-u53-l05-q04 | items/3/exampleZh | 護理師幫我打針時，我感到一陣刺痛。 | 我碰到玫瑰時，感到一陣刺痛。 | 第③關 FIX 59：護理師打針屬醫療情境 |
| b2-u53-l05-q14 | items/13/options | ["bustle", "permeate", "tiptoe", "outgrow"] | ["rejoin", "permeate", "reorganize", "outgrow"] | 第③關 FIX 60：tiptoe、bustle 不及物，放不進「空格＋受詞」（文法線索）；改成及物動詞 |
| b2-u53-l05-q14 | items/13/optionGlossZh | ["忙碌地奔走", "滲透", "踮著腳走", "長大後不再…"] | ["重新加入", "滲透", "重新整理", "長大後不再…"] | 第③關 FIX 60： |
| b2-u53-l05-q10 | items/9/options | ["Hand it down to a younger relative", "Wear it again next winter", "Sell it to a classmate", "Throw it in the trash"] | ["Give it to a younger relative", "Wear the overcoat again next winter", "Sell it to an older cousin", "Throw it in the trash"] | 第③關 FIX 61：干擾項沒有沿用音檔的字，正解是唯一最長 |
| b2-u53-l06-q12 | items/11/sentenceEn | My grandmother outlived all of her brothers and sisters. | This small shop has outlived all the big stores on its street. | 第③關 FIX 62：親人過世題材 |
| b2-u53-l06-q12 | items/11/sentenceZh | 我祖母比她所有的兄弟姊妹都長壽。 | 這家小店比同一條街上的大商店都撐得久。 | 第③關 FIX 62：親人過世題材 |
| b2-u53-l06-q07 | items/6/exampleEn | The droop of the flowers showed they needed water. | The flowers began to droop because nobody had watered them. | 裁示：改教常用動詞義；droop（第③關 FIX 63） |
| b2-u53-l06-q07 | items/6/exampleZh | 花朵垂下來，表示它們需要澆水了。 | 花因為沒人澆水，開始垂下來。 | 裁示：改教常用動詞義；droop（第③關 FIX 63） |
| b2-u53-l06-q07 | items/6/distractorsZh | ["香味", "顏色", "生長"] | ["開花", "發芽", "搖動"] | 裁示：改教常用動詞義；droop |
| b2-u53-l06-q13 | items/12/options/0 | droop | snore | 裁示：改教常用動詞義；droop 改教動詞，名詞題的干擾項換成名詞 snore |
| b2-u53-l06-q13 | items/12/optionGlossZh/0 | 下垂 | 鼾聲 | 裁示：改教常用動詞義；droop 改教動詞，名詞題的干擾項換成名詞 snore |
| b2-u53-l06-q15 | items/14/passageEn | Our old dog is fourteen and has always been gentle and obedient. Last Monday he looked weak, with a sad droop in his ears, so we wrapped him in a cozy blanke… | Our old dog is fourteen and has always been gentle and obedient. Last Sunday we took him to a pet show in the park, wrapped in a cozy blanket because the mor… | 第③關疑似 7：看獸醫屬醫療情境且帶離別聯想，改成寵物比賽；droop 改動詞（FIX 63）；刪去與聽選重複的塞車句（FIX 64） |
| b2-u53-l06-q15 | items/14/passageZh | 我們家的老狗十四歲了，一直都很溫和又聽話。上星期一牠看起來很虛弱，耳朵難過地垂著，所以我們用溫暖的毯子把牠包起來，帶牠去看獸醫。路上車流完全停住不動。我弟弟非常依戀這隻狗，一直摸著牠的頭。最後，獸醫告訴我們只是胃的問題。我們希望牠還能陪我們很多年。 | 我們家的老狗十四歲了，一直都很溫和又聽話。上星期日，我們帶牠去公園參加寵物比賽，因為早上很冷，就用溫暖的毯子把牠包起來。其他狗表演把戲時，牠得坐著等，過了一會兒，牠的耳朵難過地垂了下來。我弟弟非常依戀這隻狗，一直摸著牠的頭。最後，評審頒給牠一個獎，因為牠是全場最冷靜的狗。我們都歡呼了。 | 第③關疑似 7：看獸醫屬醫療情境且帶離別聯想，改成寵物比賽；droop 改動詞（FIX 63）；刪去與聽選重複的塞車句（FIX 64） |
| b2-u53-l06-q15 | items/14/questions/0/questionZh | 為什麼要帶狗去看獸醫？ | 他們上星期日帶狗去哪裡？ | 第③關疑似 7： |
| b2-u53-l06-q15 | items/14/questions/0/options | ["牠在公園跟別的狗打架", "牠看起來沒精神", "牠咬了人", "要打疫苗"] | ["海邊散步", "公園的寵物比賽", "寵物美容店", "朋友家的生日派對"] | 第③關疑似 7： |
| b2-u53-l06-q15 | items/14/questions/1/questionZh | 獸醫說狗怎麼了？ | 評審為什麼給狗一個獎？ | 第③關疑似 7： |
| b2-u53-l06-q15 | items/14/questions/1/options | ["年紀太大，需要開刀", "需要住院一個星期", "只是胃不舒服", "耳朵受到細菌感染"] | ["牠表演了很多把戲", "牠跑得比其他狗快", "牠最冷靜", "牠的毛最漂亮"] | 第③關疑似 7： |
| b2-u53-l06-q16 | items/15/promptZh | 這棵老樹活得比種下它的人還久。 | 這個老牌子比它的競爭對手都撐得久。 | 第③關疑似 8：樹比種它的人活得久隱含人過世 |
| b2-u53-l06-q16 | items/15/referenceEn | ["This old tree has outlived the man who planted it.", "This old tree outlived the people who planted it."] | ["This old brand has outlived all its competitors.", "This old brand outlived all of its rivals."] | 第③關疑似 8： |
| b2-u53-l06-q16 | items/15/rubricZh | ["要用 outlive（例如 has outlived、outlived）", "「種下它的人」可寫，例如 the man who planted it、the people who planted it 等"] | ["要用 outlive（例如 has outlived、outlived 等）", "「競爭對手」可寫，例如 competitors、rivals 等"] | 第③關疑似 8： |
| b2-u53-l06-q17 | items/16/rubricZh/1 | to 後面接名詞（例如 the new baby、her first phone 等） | to 後面接名詞或動名詞（例如 the new baby、living here 等） | 第③關疑似 16：接動名詞也正確 |
| b2-u53-l06-q09 | items/8/sentenceZh | 她解開鞋帶，赤腳走在沙灘上。 | 她解開鞋帶，走在沙灘上。 | 第②關：中譯多加「赤腳」 |
| b2-u53-l06-q06 | items/5/exampleZh | 她非常喜愛祖母留下的那架舊鋼琴。 | 她非常喜愛祖母那架舊鋼琴。 | 第②關：「留下的」暗示祖母已過世，原文沒有 |
| b2-u53-l07-q02 | items/1/glossZh | 長途跋涉；沉重的腳步聲 | 長途跋涉 | 裁示：tramp 只教「長途跋涉」（第③關 FIX 65） |
| b2-u53-l07-q09 | items/8/sentenceEn | We could hear the tramp of the marching band from far away. | The tramp from the station to the farm took my grandfather two hours. | 裁示：tramp 只教「長途跋涉」，聽打句原為腳步聲義 |
| b2-u53-l07-q09 | items/8/sentenceZh | 我們從很遠的地方就聽得到樂隊行進的沉重腳步聲。 | 從車站走到農場，花了爺爺兩個小時。 | 裁示：tramp 只教「長途跋涉」，聽打句原為腳步聲義 |
| b2-u53-l07-q08 | items/7/exampleEn | The old fence needs a repaint before winter. | We need to repaint the old fence before winter. | 裁示：改教常用動詞義；repaint（第③關 FIX 66） |
| b2-u53-l07-q08 | items/7/exampleZh | 那道舊籬笆在冬天前需要重新粉刷。 | 我們得在冬天前把舊籬笆重新粉刷。 | 裁示：改教常用動詞義；repaint（第③關 FIX 66） |
| b2-u53-l07-q15 | items/14/passageEn | Last Saturday, twenty volunteers met at the park to give the old playground a fresh repaint. Thanks to the generosity of a local shop, the paint was free. Th… | Last Saturday, twenty volunteers met at the park to repaint the old playground. Thanks to the generosity of a local shop, the paint was free. The leader divi… | 裁示：改教常用動詞義；repaint |
| b2-u53-l07-q17 | items/16/rubricZh | ["句子要用到 standby 當形容詞（例如 a standby battery、a standby player）", "名詞前要有冠詞（例如 a、the 等）"] | ["句子要用到 standby（例如 a standby battery、standby players、keep … on standby 等）", "時態配合內容（例如 keep、has 等）"] | 第③關 FIX 67：評分要點不寫死詞性與冠詞 |
| b2-u53-l07-q14 | items/13/stemEn | If you practice every day, a score of ninety is quite ____. | After months of training, finishing the marathon now seems ____. | 第③關疑似 15：與單字卡同為「努力→學業目標可達成」 |
| b2-u53-l07-q14 | items/13/stemZh | 如果你每天練習，考到九十分是很有可能的。 | 經過幾個月的訓練，跑完馬拉松現在看起來是做得到的。 | 第③關疑似 15： |
| b2-u53-l08-q03 | items/2/exampleEn | The horse crossed the field with a proud prance. | The horse pranced proudly across the field. | 裁示：改教常用動詞義；prance（第③關 FIX 68） |
| b2-u53-l08-q03 | items/2/glossZh | 騰躍；得意的蹦跳 | 騰躍；昂首闊步地走 | 裁示：改教常用動詞義；prance |
| b2-u53-l08-q15 | items/14/passageEn | Last month I went to my ten-year class reunion at a cozy café. At first, I could hardly recollect some of the faces. Then my old best friend arrived, soaking… | Last month I went to my ten-year class reunion at a cozy café. At first, I could hardly recollect some of the faces. Then my old best friend arrived, soaking… | 裁示：改教常用動詞義；prance |
| b2-u53-l08-q15 | items/14/passageZh | 上個月，我去參加在一家溫馨咖啡館舉辦的十年同學會。一開始，有些面孔我幾乎想不起來。接著我以前最要好的朋友到了，被雨淋得全身濕透，我們兩個都笑了出來。我們聊起學校的才藝表演，那次她跳了一段滿是滑稽蹦跳的搞笑舞蹈，比所有人都出色。有人說，如果能重來一次學生時代，我們會少念點書、多笑一點。現在有了群組聊天，我們終於有了… | 上個月，我去參加在一家溫馨咖啡館舉辦的十年同學會。一開始，有些面孔我幾乎想不起來。接著我以前最要好的朋友到了，被雨淋得全身濕透，我們兩個都笑了出來。我們聊起學校的才藝表演，那次她在臺上滑稽地蹦蹦跳跳，比所有人都出色。有人說，如果能重來一次學生時代，我們會少念點書、多笑一點。現在有了群組聊天，我們終於有了方便的方式… | 裁示：改教常用動詞義；prance |
| b2-u53-l08-q06 | items/5/exampleEn | Take off your soaking clothes before you catch a cold. | After playing in the sea, she wrapped her soaking hair in a towel. | 第③關 FIX 69：「濕衣服會感冒」屬健康迷思 |
| b2-u53-l08-q06 | items/5/exampleZh | 快把濕透的衣服脫掉，免得感冒。 | 在海裡玩完水後，她用毛巾包住濕透的頭髮。 | 第③關 FIX 69：「濕衣服會感冒」屬健康迷思 |
| b2-u53-l08-q10 | items/9/audioEn | It's soaking outside, so let's take a taxi instead of walking to the station. | My socks are soaking from the wet grass, so I'll change them before we go in. | 第②關：It's soaking outside 不自然；且與閱讀同為淋雨濕透，改成濕襪子；干擾項沿用音檔的字並被音檔否定 |
| b2-u53-l08-q10 | items/9/audioZh | 外面雨下得很大，我們別走路去車站了，搭計程車吧。 | 我的襪子被濕草地弄得濕透了，所以進去前我要先換掉。 | 第②關：It's soaking outside 不自然；且與閱讀同為淋雨濕透，改成濕襪子；干擾項沿用音檔的字並被音檔否定 |
| b2-u53-l08-q10 | items/9/questionZh | 說話者建議怎麼去車站？ | 說話者打算做什麼？ | 第②關：It's soaking outside 不自然；且與閱讀同為淋雨濕透，改成濕襪子；干擾項沿用音檔的字並被音檔否定 |
| b2-u53-l08-q10 | items/9/options | ["Ride a bike to the station", "Walk there in the rain", "Walk with an umbrella", "Take a cab there"] | ["Keep the wet socks on", "Go in with wet socks", "Change them after dinner", "Put on dry socks"] | 第②關：It's soaking outside 不自然；且與閱讀同為淋雨濕透，改成濕襪子；干擾項沿用音檔的字並被音檔否定 |
| b2-u53-l08-q13 | items/12/stemEn | With his amazing voice, the new student will ____ the other singers in the contest. | At night, the bright new lamps easily ____ the old street lights. | 第③關 FIX 70：與閱讀同為才藝比賽勝過別人 |
| b2-u53-l08-q13 | items/12/stemZh | 那位新同學的歌聲很驚人，會在比賽中勝過其他歌手。 | 晚上，明亮的新路燈輕易就比舊路燈亮得多。 | 第③關 FIX 70： |
| b2-u53-l08-q11 | items/10/sentenceEn | The coach overstepped the rules by shouting at the referee. | The coach overstepped the mark when he shouted at the referee. | 第③關 FIX 71：overstep 不接 the rules |
| b2-u53-l08-q11 | items/10/sentenceZh | 那位教練對裁判大吼，已經違反了規定。 | 那位教練對裁判大吼，已經越界了。 | 第③關 FIX 71：overstep 不接 the rules |
| b2-u53-l08-q15 | items/14/passageEn | Last month I went to my ten-year class reunion at a cozy café. At first, I could hardly recollect some of the faces. Then my old best friend arrived, soaking… | Last month I went to my ten-year class reunion at a cozy cafe. At first, I could hardly recollect some of the faces. Then my old best friend arrived, soaking… | 第③關疑似 21：拼法統一成 cafe |
| b2-u53-l02-q15 | items/14/passageEn | Last Friday, our school held a charity sale for the library, and people could bid for every item. Before it began, volunteers tacked a list of the items to t… | Last Friday, our school held a charity sale for the library, and people could bid for every item. Before it began, volunteers tacked a list of the items to t… | 修正後補修：Wow 不在 lexicon |
| b2-u53-l02-q15 | items/14/passageZh | 上星期五，我們學校替圖書館辦了一場義賣會，每件物品都可以競標。開始前，志工把義賣品清單用圖釘釘在牆上。第一件是一個小手工藝品，接著是一位名畫家隨手畫的塗鴉。這件作品的出價非常快。價格到五百元時，前排一個女孩脫口喊出「哇！」，大家都笑了。最後，一位安靜的老先生買下了它，開心地笑了。 | 上星期五，我們學校替圖書館辦了一場義賣會，每件物品都可以競標。開始前，志工把義賣品清單用圖釘釘在牆上。第一件是一個小手工藝品，接著是一位名畫家隨手畫的塗鴉。這件作品的出價非常快。價格到五百元時，前排一個女孩脫口喊出「太棒了！」，大家都笑了。最後，一位安靜的老先生買下了它，開心地笑了。 | 修正後補修：Wow 不在 lexicon |
| b2-u53-l04-q02 | items/1/exampleEn | There was a slight tremor in her voice as she said goodbye. | There was a slight tremor in her voice as she spoke about her old home. | 修正後補修：goodbye 不在 lexicon |
| b2-u53-l04-q02 | items/1/exampleZh | 她說再見時，聲音微微顫抖。 | 她談起老家時，聲音微微顫抖。 | 修正後補修：goodbye 不在 lexicon |
| b2-u53-l04-q02 | items/1/distractorsZh | ["笑意", "回音", "怒氣"] | ["笑意", "歌聲", "怒氣"] | 修正後補修：「回音」被中文檢查器改寫，換字 |
| b2-u53-l06-q15 | items/14/passageEn | Our old dog is fourteen and has always been gentle and obedient. Last Sunday we took him to a pet show in the park, wrapped in a cozy blanket because the mor… | Our old dog is fourteen and has always been gentle and obedient. Last Sunday we took him to a pet show in the park, wrapped in a cozy blanket because the mor… | 修正後補修：calmest 不在 lexicon；閱讀刪去塞車句後補一個非交通情境的 standstill 計分情境 |
| b2-u53-l06-q15 | items/14/passageZh | 我們家的老狗十四歲了，一直都很溫和又聽話。上星期日，我們帶牠去公園參加寵物比賽，因為早上很冷，就用溫暖的毯子把牠包起來。其他狗表演把戲時，牠得坐著等，過了一會兒，牠的耳朵難過地垂了下來。我弟弟非常依戀這隻狗，一直摸著牠的頭。最後，評審頒給牠一個獎，因為牠是全場最冷靜的狗。我們都歡呼了。 | 我們家的老狗十四歲了，一直都很溫和又聽話。上星期日，我們帶牠去公園參加寵物比賽，因為早上很冷，就用溫暖的毯子把牠包起來。其他狗表演把戲時，牠得坐著等，過了一會兒，牠的耳朵難過地垂了下來。我弟弟非常依戀這隻狗，一直摸著牠的頭。有一次，一隻貓跑過場地，整場比賽停頓了下來。最後，評審頒給牠一個獎，因為牠是全場最有耐心的… | 修正後補修： |
| b2-u53-l06-q15 | items/14/questions/1/options | ["牠表演了很多把戲", "牠跑得比其他狗快", "牠最冷靜", "牠的毛最漂亮"] | ["牠表演了很多把戲", "牠跑得比其他狗快", "牠最有耐心", "牠的毛最漂亮"] | 修正後補修：配合閱讀改寫 |
| b2-u53-l08-q10 | items/9/audioEn | My socks are soaking from the wet grass, so I'll change them before we go in. | My socks are soaking because I stepped in a puddle, so I'll change them before we go in. | 情境表重判：與 l04 跟讀「走過濕草地鞋子濕透」同單元跨課同事件 |
| b2-u53-l08-q10 | items/9/audioZh | 我的襪子被濕草地弄得濕透了，所以進去前我要先換掉。 | 我踩到水坑，襪子濕透了，所以進去前我要先換掉。 | 情境表重判：與 l04 跟讀「走過濕草地鞋子濕透」同單元跨課同事件 |
| b2-u53-l08-q10 | items/9/audioEn | My socks are soaking because I stepped in a puddle, so I'll change them before we go in. | My socks are soaking because I stepped into the pond, so I'll change them before we go in. | 修正後補修：puddle 不在 lexicon |
| b2-u53-l08-q10 | items/9/audioZh | 我踩到水坑，襪子濕透了，所以進去前我要先換掉。 | 我踩進池塘，襪子濕透了，所以進去前我要先換掉。 | 修正後補修：puddle 不在 lexicon |

## 不改的項目與理由

| 來源 | 項目 | 理由 |
|---|---|---|
| 第③關疑似 2 | u53-l01 健行與 l04 夏令營都是戶外團體活動加領隊 | 兩課事件不同（濃霧中健行等待、夏令營涉水與早上被叫起床）；l04 已依 FIX 57 拿掉下雨，兩篇不再共用天氣情節 |
| 第③關疑似 10 | u53-l02 tack 三題都是把紙釘在牆或板上 | 詞義本身限制情境；三題主詞與場合不同（媽媽、請求別人、義賣志工） |
| 第③關疑似 12 | u52-l08 self-confident 與 self-confidence 都是「做了某件事後自信提升」 | 建議的新題幹 "She looked calm and ____" 代入 unworldly 也說得通，會破壞「只看英文唯一可解」；維持現題（主詞、句型已換） |
| 第③關疑似 19 | 閱讀正解位置單批偏斜 | 審查員建議下批以 sha256 抽籤自然打散，本批不重排 |
| 第③關疑似 20 | u52-l04 與 u51-l03 閱讀開頭都是 Last summer, my cousin … worked at a small … | 跨單元、非同單元規則；改開頭需連帶改整篇時態，收益小 |
| 第③關疑似 21 | 「十美元」與「五百元」譯法 | dollars 譯法請執行長裁示；cafe 拼法已統一 |
| 第③關疑似 1 | compress | 已依裁示改教動詞「壓縮」（見明細） |

## 修正後自查

- wornout：例句與其他題都改寫成 worn out；自查腳本以 wornout 比對，抓不到 worn out 的計分情境（跟讀 q10、閱讀都有），屬工具限制。
- 長度名次、0.5–2 倍、用字範圍、同課共用、跨課重複（main、b2c 一起比）、只看英文唯一可解、聽選正解不照抄音檔：見 b2d-status.md。
