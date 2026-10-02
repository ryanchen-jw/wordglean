# A1／A2 後期規則補正（task-9-a12-cleanup）

> 2026-10-03。基準 main 61224a2。依據：t9/a1a2-firstsense.md（單字卡第一義稽核）、c1b1-rulings.md、b2b3-rulings.md、longest-rule.md 最後一節，以及執行長三則補充（詞性標記統一「X；Y」、干擾項比對先還原詞形、第一義＝該級最常用義）。
> 每處改動都已寫進各課 `judge.resolvedAfterFinalReview`，說明開頭是「執行長裁示：後期規則補正：」。

## 一、修正前後統計

### mcq 干擾項（A1 135 課 270 題、A2 158 課 316 題）

比對一律先還原詞形：選項本身、ECDICT 原形、規則還原（只收 lexicon 有的字）、be 動詞變化收成一組，兩組有交集就算同一個字。

| 規則 | 修正前 | 修正後 |
|---|---|---|
| 用字範圍（同級未教字當干擾項） | 27 個題位（A2） | 0 |
| 不在課綱的干擾項 | 1（schoolchildren） | 0 |
| 同課兩題共用干擾項、拿另一題正解當干擾項 | 634 個題位，235 課 | 0 |
| 非本單元字跨課重複當干擾項 | 6 個字，15 個題位 | 0 |
| 混合詞性題放得進空格的干擾項不足兩個 | 人工逐課判定，修了 141 題 | 逐課複核（無解題見第五節） |
| 每課至少一題四選項同詞性 | 人工判定，修了 65 題（含原本兩題都不合格的課） | 除 a1-u01-l01 外全數達成（見第五節） |
| 一眼排除、干擾項也成立 | 人工判定，修了 1 題，實作端複核又改 5 題 | — |

共改 mcq 388 題（每題可能同時修好幾條）：同課共用／交叉當正解 304、混合詞性題放得進空格 141、四選項同詞性 65、用字範圍 24、跨課重複 10、一眼排除 1。正解的文字與位置一律沒動，題幹沒改，所以 ANSWER_POSITION 系列不受影響。

### 長度名次分布（mcq 只看全級；四選一合格範圍 13–37%）

| 級別 | 修正前 第1／2／3／4 長 | 修正後 第1／2／3／4 長 |
|---|---|---|
| A1 mcq（270 題） | 29.0／26.7／22.8／21.4% | 29.3／26.9／22.4／21.4% |
| A2 mcq（316 題） | 31.4／23.9／20.9／23.7% | 31.0／25.9／21.0／22.0% |

reading、listenChoice 沒改，名次分布與 0.5–2 倍單題異常值維持原狀；`check-items --require-judge`（A1、A2 全級）全綠。

### 單字卡（共 2304 張；第一義＝App 作答時唯一顯示的「；」前第一段）

| 項目 | 張數 |
|---|---|
| 稽核列出的「需調換」 | 159 |
| ├ 調換後第一段即最常用義或近義，照調換 | 89 |
| └ 調換後第一段是次要義 → 釋義維持最常用義在前，改寫例句 | 70 |
| 切開後可能洩題（稽核 44 張＋改寫後新發現 unpleasant 1 張）：最後實際改了釋義或干擾項 | 29（其餘 16 張：14 張改為釋義維持原順序、第一段本來就不洩題；smith、may 歸入下一列改內容） |
| 改內容：self、smith、may（cup、bottle 因改寫例句，不再需要改干擾項） | 3 |
| 詞性標記改成「X；Y」：order、move、plan、fight、suit、tidy、cost、rent | 8 |

詞性標記：A1、A2 沒有任何一張是「（n）X（v）Y」這種不帶「；」的格式。同類的「（動詞）」「（動詞、名詞）」標記共 8 張，全部拿掉。verb、noun、adjective 這 3 張的釋義本身就是「動詞」等字，不算標記，沒動。

修正後掃描：所有含「；」的卡，第一段都沒有「括號但干擾項沒有括號」「比干擾項長或短 ≥3 字寬」「干擾項含『；』」的情形（0 張）。

## 二、單字卡：調換或改寫的判準

執行長澄清：第一義放該級最常用、也最貼合單元主題的詞義，例句示範的就是這個詞義。159 張逐張判定如下：
- **照調換（89 張）**：調換後排第一的，與原本第一義是近義詞（工人／員工、記憶／回憶），或者就是該單元主題的常用義（sale「特價」在購物單元、board「黑板」在學校單元）。
- **改寫例句（70 張）**：原第一義明顯才是基本義、最常用義（be「是」、hello「你好」、minute「分鐘」、get「得到」、basic「基本的」、seed「種子」等），所以釋義不調換，改寫例句去示範它。
- 例句由 3 個子代理改寫，每句都跑過兩項：檢查器（越級字、句長、繁中守衛），以及 task-9-b1 的 `selfcheck-similarity.mjs`（同課情境不雷同）。實作端複核時另外改了 1 句：them 例句原本用 kind（形容詞「親切」屬 A2 詞義），改成 nice。
- 改寫例句的 70 張清單見第三節「例句改寫」。

## 三、單字卡改動明細（以 61224a2 為基準）

| 題 id | 單字 | 欄位 | 改前 | 改後 | 類別 |
|---|---|---|---|---|---|
| a1-u01-l01-q01 | the | glossZh | "這個；那個（特指）" | "那個；這個" | 切開後第一段與干擾項長度、格式一致（括號註記移到第二段或刪除 |
| a1-u01-l01-q02 | be | exampleEn | "Please be quiet in the library." | "We are good friends." | 例句改寫 |
| a1-u01-l01-q02 | be | exampleZh | "在圖書館裡請保持安靜。" | "我們是好朋友。" | 例句改寫 |
| a1-u01-l06-q06 | them | exampleEn | "I have two cats. I love them." | "My friends are very nice. I often play with them." | 例句改寫 |
| a1-u01-l06-q06 | them | exampleZh | "我有兩隻貓，我很愛牠們。" | "我的朋友人都很好，我常常和他們一起玩。" | 例句改寫 |
| a1-u01-l08-q03 | its | exampleEn | "The dog is playing with its ball." | "The house is old, but its door is new." | 例句改寫 |
| a1-u01-l08-q03 | its | exampleZh | "那隻狗在玩牠的球。" | "這間房子很舊，但它的門是新的。" | 例句改寫 |
| a1-u02-l02-q06 | guy | glossZh | "（口語）男生；人" | "男生；人（口語）" | 切開後第一段與干擾項長度、格式一致（括號註記移到第二段或刪除 |
| a1-u02-l04-q07 | self | distractorsZh | ["別人", "朋友", "家人"] | ["別人的樣子", "新的習慣", "以前的朋友"] | 調換也解不了，改釋義內容 |
| a1-u02-l04-q07 | self | glossZh | "自己；自我" | "本來的樣子；自己；自我" | 調換也解不了，改釋義內容 |
| a1-u02-l05-q01 | hello | exampleEn | "Hello, is this Amy?" | "Hello! Nice to meet you." | 例句改寫 |
| a1-u02-l05-q01 | hello | exampleZh | "喂，請問是 Amy 嗎？" | "你好！很高興認識你。" | 例句改寫 |
| a1-u02-l06-q07 | smith | distractorsZh | ["鄰居", "老師", "記者"] | ["男生名字", "城市名稱", "國家名稱"] | 調換也解不了，改釋義內容 |
| a1-u02-l06-q07 | smith | glossZh | "鐵匠；（大寫 Smith）常見英文姓氏" | "英文姓氏；鐵匠" | 調換也解不了，改釋義內容 |
| a1-u03-l01-q09 | may | glossZh | "五月（May）；可以、可能（may）" | "五月；可以、可能" | 調換也解不了，改釋義內容 |
| a1-u03-l03-q06 | minute | exampleEn | "Please wait a minute." | "It takes me twenty minutes to walk to school." | 例句改寫 |
| a1-u03-l03-q06 | minute | exampleZh | "請等一下。" | "我走路上學要花二十分鐘。" | 例句改寫 |
| a1-u03-l04-q01 | early | distractorsZh | ["晚；遲", "很快", "剛才"] | ["晚", "很快", "剛才"] | 切開後第一段與干擾項長度、格式一致（括號註記移到第二段或刪除 |
| a1-u03-l04-q08 | period | glossZh | "（上課的）一節；時段" | "一節課；時段" | 切開後第一段與干擾項長度、格式一致（括號註記移到第二段或刪除 |
| a1-u04-l02-q01 | parent | distractorsZh | ["兄弟", "子女", "鄰居"] | ["兄弟或姊妹", "兒子或女兒", "叔叔或阿姨"] | 切開後第一段與干擾項長度、格式一致（括號註記移到第二段或刪除 |
| a1-u04-l03-q03 | share | exampleEn | "Can I share your umbrella?" | "My little brother likes to share his toys with me." | 例句改寫 |
| a1-u04-l03-q03 | share | exampleZh | "我可以跟你共用雨傘嗎？" | "我弟弟喜歡和我分享他的玩具。" | 例句改寫 |
| a1-u04-l06-q05 | grandma | glossZh | "（口語）奶奶；外婆" | "奶奶；外婆（口語）" | 切開後第一段與干擾項長度、格式一致（括號註記移到第二段或刪除 |
| a1-u04-l06-q07 | grandpa | glossZh | "（口語）爺爺；外公" | "爺爺；外公（口語）" | 切開後第一段與干擾項長度、格式一致（括號註記移到第二段或刪除 |
| a1-u06-l04-q01 | noise | glossZh | "噪音；聲響" | "聲響；噪音" | 只調換釋義順序 |
| a1-u06-l05-q04 | toilet | glossZh | "馬桶；廁所" | "廁所；馬桶" | 只調換釋義順序 |
| a1-u07-l01-q02 | work | exampleEn | "I go to work by bus." | "My mother works at a hospital." | 例句改寫 |
| a1-u07-l01-q02 | work | exampleZh | "我搭公車上班。" | "我媽媽在醫院工作。" | 例句改寫 |
| a1-u07-l01-q04 | business | exampleEn | "My uncle has a small business." | "My uncle sells shoes. His business is very good." | 例句改寫 |
| a1-u07-l01-q04 | business | exampleZh | "我叔叔經營一家小公司。" | "我叔叔賣鞋子，他的生意很好。" | 例句改寫 |
| a1-u07-l02-q01 | phone | glossZh | "電話；手機" | "手機；電話" | 只調換釋義順序 |
| a1-u07-l02-q02 | worker | glossZh | "工人；員工" | "員工；工人" | 只調換釋義順序 |
| a1-u07-l02-q04 | message | exampleEn | "Please leave me a message." | "I read your message this morning." | 例句改寫 |
| a1-u07-l02-q04 | message | exampleZh | "請留言給我。" | "我今天早上看了你的訊息。" | 例句改寫 |
| a1-u08-l03-q06 | cup | exampleEn | "Would you like a cup of tea?" | "Please wash your cup after lunch." | 例句改寫 |
| a1-u08-l03-q06 | cup | exampleZh | "你要來一杯茶嗎？" | "午餐後請洗你的杯子。" | 例句改寫 |
| a1-u08-l05-q04 | bottle | exampleEn | "I buy a bottle of water every day." | "Can you open this bottle for me?" | 例句改寫 |
| a1-u08-l05-q04 | bottle | exampleZh | "我每天買一瓶水。" | "你可以幫我打開這個瓶子嗎？" | 例句改寫 |
| a1-u08-l05-q08 | dish | glossZh | "盤子；碗盤" | "碗盤；盤子" | 只調換釋義順序 |
| a1-u09-l04-q04 | haircut | exampleEn | "I like your new haircut!" | "I get a haircut every month." | 例句改寫 |
| a1-u09-l04-q04 | haircut | exampleZh | "我喜歡你的新髮型！" | "我每個月理一次髮。" | 例句改寫 |
| a1-u10-l02-q02 | order | glossZh | "點餐；訂單（也當動詞：點）" | "點餐；訂單" | 釋義拿掉詞性標記，統一「X；Y」格式、例句詞義在前 |
| a1-u10-l03-q04 | sale | glossZh | "出售；特價" | "特價；出售" | 只調換釋義順序 |
| a1-u11-l02-q07 | officer | glossZh | "（機場、警察等）人員；官員" | "官員；人員（機場、警察等）" | 切開後第一段與干擾項長度、格式一致（括號註記移到第二段或刪除 |
| a1-u12-l01-q02 | vacation | exampleEn | "We go to Japan on vacation every summer." | "Our vacation is very short this year." | 例句改寫 |
| a1-u12-l01-q02 | vacation | exampleZh | "我們每年夏天去日本度假。" | "今年我們的假期很短。" | 例句改寫 |
| a1-u12-l02-q01 | drive | exampleEn | "Let's go for a drive." | "My father drives to work every day." | 例句改寫 |
| a1-u12-l02-q01 | drive | exampleZh | "我們開車去兜風吧。" | "我爸爸每天開車上班。" | 例句改寫 |
| a1-u14-l02-q08 | art | glossZh | "藝術；美術" | "美術；藝術" | 只調換釋義順序 |
| a1-u14-l04-q04 | goal | glossZh | "（球賽）得分；進球" | "進球；（球賽）得分" | 只調換釋義順序 |
| a1-u14-l05-q03 | radio | glossZh | "收音機；廣播" | "廣播；收音機" | 只調換釋義順序 |
| a1-u15-l02-q01 | hot | exampleEn | "This tea is too hot." | "The children play in the water on hot days." | 例句改寫 |
| a1-u15-l02-q01 | hot | exampleZh | "這杯茶太燙了。" | "天氣熱的時候，孩子們在水裡玩。" | 例句改寫 |
| a1-u16-l01-q03 | underline | distractorsZh | ["句號", "標題", "箭頭"] | ["在⋯旁邊寫字", "把⋯圈起來", "把⋯擦掉"] | 切開後第一段與干擾項長度、格式一致（括號註記移到第二段或刪除 |
| a1-u16-l04-q06 | board | glossZh | "板子；黑板" | "黑板；板子" | 只調換釋義順序 |
| a1-u16-l05-q08 | science | glossZh | "科學；自然科" | "自然科；科學" | 只調換釋義順序 |
| a1-u16-l07-q07 | copy | glossZh | "副本；影本" | "影本；副本" | 只調換釋義順序 |
| a1-u17-l01-q03 | get | exampleEn | "Where can I get a ticket?" | "The kids get presents on their birthdays." | 例句改寫 |
| a1-u17-l01-q03 | get | exampleZh | "我在哪裡可以買到票？" | "孩子們生日時會得到禮物。" | 例句改寫 |
| a1-u17-l01-q07 | take | exampleEn | "Take your umbrella with you." | "Which pen do you want to take?" | 例句改寫 |
| a1-u17-l01-q07 | take | exampleZh | "帶著你的雨傘。" | "你想拿哪一支筆？" | 例句改寫 |
| a1-u17-l03-q02 | leave | exampleEn | "The bus leaves at eight." | "Turn off the lights when you leave the room." | 例句改寫 |
| a1-u17-l03-q02 | leave | exampleZh | "公車八點開。" | "離開房間時要關燈。" | 例句改寫 |
| a1-u17-l04-q06 | move | exampleEn | "Our move to Taipei was easy." | "Can you help me move this table?" | 例句改寫 |
| a1-u17-l04-q06 | move | exampleZh | "我們搬到台北很順利。" | "你可以幫我移動這張桌子嗎？" | 例句改寫 |
| a1-u17-l04-q06 | move | glossZh | "移動；搬家（動詞、名詞）" | "移動；搬家" | 釋義拿掉詞性標記，統一「X；Y」格式、例句詞義在前；釋義拿掉詞性標記，統一「X；Y」格式、例句詞義在前 |
| a1-u17-l06-q08 | plan | glossZh | "計畫；打算（動詞）" | "計畫；打算" | 釋義拿掉詞性標記，統一「X；Y」格式、例句詞義在前 |
| a1-u18-l01-q08 | memory | glossZh | "記憶；回憶" | "回憶；記憶" | 只調換釋義順序 |
| a1-u18-l02-q01 | worry | exampleEn | "Money is my biggest worry." | "My mother worries when I come home late." | 例句改寫 |
| a1-u18-l02-q01 | worry | exampleZh | "錢是我最大的煩惱。" | "我晚回家時，媽媽會擔心。" | 例句改寫 |
| a1-u18-l02-q04 | smile | glossZh | "微笑；笑容" | "笑容；微笑" | 只調換釋義順序 |
| a1-u18-l04-q06 | lovely | glossZh | "可愛的；美好的" | "美好的；可愛的" | 只調換釋義順序 |
| a1-u19-l01-q06 | another | glossZh | "另一個；再一個" | "再一個；另一個" | 只調換釋義順序 |
| a1-u19-l03-q05 | around | exampleEn | "We walk around the park." | "There are tall trees around the house." | 例句改寫 |
| a1-u19-l03-q05 | around | exampleZh | "我們繞著公園走。" | "房子周圍有高大的樹。" | 例句改寫 |
| a1-u19-l03-q08 | yet | glossZh | "（否定句）還；尚" | "還；尚（用於否定句）" | 切開後第一段與干擾項長度、格式一致（括號註記移到第二段或刪除 |
| a1-u19-l05-q07 | past | glossZh | "（時間）過了；經過" | "過了；經過（指時間）" | 切開後第一段與干擾項長度、格式一致（括號註記移到第二段或刪除 |
| a1-u19-l06-q03 | ok | glossZh | "好；可以" | "可以；好" | 只調換釋義順序 |
| a1-u21-l06-q06 | closed | glossZh | "關閉的；沒營業的" | "沒營業的；關閉的" | 只調換釋義順序 |
| a1-u22-l01-q08 | paint | glossZh | "畫（顏料畫）；油漆" | "畫；用顏料畫；油漆" | 切開後第一段與干擾項長度、格式一致（括號註記移到第二段或刪除 |
| a1-u22-l02-q01 | pool | glossZh | "水池；游泳池" | "游泳池；水池" | 只調換釋義順序 |
| a1-u22-l04-q08 | festival | glossZh | "節日；慶典" | "慶典；節日" | 只調換釋義順序 |
| a1-u23-l01-q03 | care | glossZh | "小心；照顧" | "照顧；小心" | 只調換釋義順序 |
| a1-u23-l03-q02 | fight | glossZh | "吵架；打架（動詞、名詞）" | "吵架；打架" | 釋義拿掉詞性標記，統一「X；Y」格式、例句詞義在前 |
| a1-u23-l03-q07 | save | glossZh | "存（錢）；救" | "存；救" | 切開後第一段與干擾項長度、格式一致（括號註記移到第二段或刪除 |
| a1-u23-l06-q01 | repeat | exampleEn | "Can you repeat that, please?" | "The teacher repeats the new words three times." | 例句改寫 |
| a1-u23-l06-q01 | repeat | exampleZh | "可以請你再說一次嗎？" | "老師把新單字重複了三次。" | 例句改寫 |
| a1-u23-l06-q02 | carefully | glossZh | "小心地；仔細地" | "仔細地；小心地" | 只調換釋義順序 |
| a1-u23-l06-q06 | pray | exampleEn | "Many people pray at the temple." | "We pray for good weather before our trip." | 例句改寫 |
| a1-u23-l06-q06 | pray | exampleZh | "很多人在廟裡拜拜。" | "出遊前，我們祈禱有好天氣。" | 例句改寫 |
| a2-u01-l03-q06 | yeah | glossZh | "（口語）是；對啊" | "對啊；（口語）是" | 只調換釋義順序 |
| a2-u01-l06-q06 | anyway | glossZh | "無論如何；還是" | "還是；無論如何" | 只調換釋義順序 |
| a2-u01-l06-q07 | apparently | glossZh | "看來；聽說" | "聽說；看來" | 只調換釋義順序 |
| a2-u01-l07-q02 | anymore | glossZh | "（不）再；已經（不）" | "不再；再也（用於否定句）" | 切開後第一段與干擾項長度、格式一致（括號註記移到第二段或刪除 |
| a2-u02-l03-q01 | daily | glossZh | "每天的；日常的" | "日常的；每天的" | 只調換釋義順序 |
| a2-u02-l04-q02 | instant | glossZh | "立即的；即溶的" | "即溶的；立即的" | 只調換釋義順序 |
| a2-u03-l03-q06 | material | glossZh | "材料；材質" | "材質；材料" | 只調換釋義順序 |
| a2-u03-l04-q01 | significant | exampleEn | "There was a significant change in prices this year." | "Getting my first job was a significant event in my life." | 例句改寫 |
| a2-u03-l04-q01 | significant | exampleZh | "今年的物價有很明顯的變化。" | "得到第一份工作是我人生中的重大事件。" | 例句改寫 |
| a2-u03-l05-q02 | style | glossZh | "風格；款式" | "款式；風格" | 只調換釋義順序 |
| a2-u03-l06-q04 | basic | exampleEn | "The hotel room is basic but clean." | "You need basic computer skills for this job." | 例句改寫 |
| a2-u03-l06-q04 | basic | exampleZh | "這間飯店房間很簡單，但很乾淨。" | "這份工作需要基本的電腦技能。" | 例句改寫 |
| a2-u03-l06-q05 | perfect | exampleEn | "The weather is perfect for a picnic." | "Your drawing is perfect!" | 例句改寫 |
| a2-u03-l06-q05 | perfect | exampleZh | "這種天氣最適合野餐了。" | "你的畫完美極了！" | 例句改寫 |
| a2-u03-l06-q06 | feature | exampleEn | "This phone has many useful features." | "The old bridge is a famous feature of this town." | 例句改寫 |
| a2-u03-l06-q06 | feature | exampleZh | "這支手機有很多實用的功能。" | "這座舊橋是這個小鎮有名的特色。" | 例句改寫 |
| a2-u03-l07-q05 | quick | exampleEn | "Can I ask you a quick question?" | "Taking the train is the quickest way to get there." | 例句改寫 |
| a2-u03-l07-q05 | quick | exampleZh | "可以簡單問你一個問題嗎？" | "搭火車是去那裡最快的方法。" | 例句改寫 |
| a2-u03-l07-q06 | sample | glossZh | "樣品；試用品" | "試用品；樣品" | 只調換釋義順序 |
| a2-u03-l08-q02 | negative | glossZh | "負面的；悲觀的" | "悲觀的；負面的" | 只調換釋義順序 |
| a2-u03-l08-q04 | familiar | exampleEn | "Your face looks familiar." | "Children feel safe in a familiar place." | 例句改寫 |
| a2-u03-l08-q04 | familiar | exampleZh | "你看起來很面熟。" | "孩子在熟悉的地方會覺得安心。" | 例句改寫 |
| a2-u04-l06-q02 | shoot | glossZh | "投（籃）；射（門）" | "投籃；射門" | 切開後第一段與干擾項長度、格式一致（括號註記移到第二段或刪除 |
| a2-u04-l06-q04 | accept | glossZh | "接受；收下" | "收下；接受" | 只調換釋義順序 |
| a2-u04-l07-q03 | establish | glossZh | "建立；創立" | "創立；建立" | 只調換釋義順序 |
| a2-u04-l07-q04 | avoid | glossZh | "避免；避開" | "避開；避免" | 只調換釋義順序 |
| a2-u04-l07-q06 | apply | glossZh | "申請；應徵" | "應徵；申請" | 只調換釋義順序 |
| a2-u04-l08-q02 | reflect | glossZh | "反射；映出" | "映出；反射" | 只調換釋義順序 |
| a2-u05-l01-q08 | generation | glossZh | "一代（人）；世代" | "一代人；世代" | 切開後第一段與干擾項長度、格式一致（括號註記移到第二段或刪除 |
| a2-u05-l02-q06 | male | exampleEn | "Our new cat is a male." | "In our office, only two workers are male." | 例句改寫 |
| a2-u05-l02-q06 | male | exampleZh | "我們新養的貓是公的。" | "在我們辦公室裡，只有兩位員工是男性。" | 例句改寫 |
| a2-u06-l01-q02 | inspiration | exampleEn | "My grandmother is my inspiration." | "I get inspiration for my stories from my dreams." | 例句改寫 |
| a2-u06-l01-q02 | inspiration | exampleZh | "我奶奶是激勵我的人。" | "我寫故事的靈感來自我的夢。" | 例句改寫 |
| a2-u06-l01-q03 | creativity | glossZh | "創造力；創意" | "創意；創造力" | 只調換釋義順序 |
| a2-u06-l01-q08 | unpleasant | distractorsZh | ["香的", "新鮮的", "熟悉的"] | ["令人興奮的", "讓人放心的", "令人好奇的"] | 切開後第一段與干擾項長度、格式一致（括號註記移到第二段或刪除 |
| a2-u06-l01-q08 | unpleasant | exampleEn | "There is an unpleasant smell in the kitchen." | "The long wait at the airport was unpleasant." | 例句改寫 |
| a2-u06-l01-q08 | unpleasant | exampleZh | "廚房裡有一股難聞的味道。" | "在機場的漫長等待令人不愉快。" | 例句改寫 |
| a2-u06-l04-q02 | unfortunately | glossZh | "不幸地；可惜" | "可惜；不幸地" | 只調換釋義順序 |
| a2-u07-l02-q01 | suit | glossZh | "西裝；適合（動詞）" | "西裝；適合" | 釋義拿掉詞性標記，統一「X；Y」格式、例句詞義在前 |
| a2-u08-l02-q07 | downstairs | glossZh | "在樓下；往樓下" | "往樓下；在樓下" | 只調換釋義順序 |
| a2-u08-l03-q02 | tidy | glossZh | "整理（動詞）；整齊的" | "整理；整齊的" | 切開後第一段與干擾項長度、格式一致（括號註記移到第二段或刪除 |
| a2-u08-l05-q02 | alarm | glossZh | "警報（器）；鬧鈴" | "警報器；鬧鈴" | 切開後第一段與干擾項長度、格式一致（括號註記移到第二段或刪除 |
| a2-u08-l06-q08 | washing-up | glossZh | "洗碗；待洗的碗盤" | "待洗的碗盤；洗碗" | 只調換釋義順序 |
| a2-u09-l03-q01 | chairman | glossZh | "主席；董事長" | "董事長；主席" | 只調換釋義順序 |
| a2-u09-l03-q08 | appointment | glossZh | "約會；預約" | "預約；約會" | 只調換釋義順序 |
| a2-u09-l04-q08 | businesswoman | glossZh | "女商人；女企業家" | "女企業家；女商人" | 只調換釋義順序 |
| a2-u10-l01-q04 | chef | glossZh | "廚師；主廚" | "主廚；廚師" | 只調換釋義順序 |
| a2-u10-l02-q02 | snack | glossZh | "點心；零食" | "零食；點心" | 只調換釋義順序 |
| a2-u10-l04-q01 | tablespoon | glossZh | "大湯匙；一大匙" | "一大匙；大湯匙" | 只調換釋義順序 |
| a2-u10-l05-q04 | boil | glossZh | "煮沸；用水煮" | "用水煮；煮沸" | 只調換釋義順序 |
| a2-u10-l07-q06 | napkin | glossZh | "餐巾；餐巾紙" | "餐巾紙；餐巾" | 只調換釋義順序 |
| a2-u10-l07-q07 | roast | exampleEn | "My uncle roasts coffee beans in his shop." | "We roasted fish over a small fire on the beach." | 例句改寫 |
| a2-u10-l07-q07 | roast | exampleZh | "我叔叔在他的店裡烘焙咖啡豆。" | "我們在海灘上用小火堆烤魚。" | 例句改寫 |
| a2-u10-l08-q05 | melon | glossZh | "甜瓜；哈密瓜" | "哈密瓜；甜瓜" | 只調換釋義順序 |
| a2-u10-l09-q07 | soft drink | glossZh | "不含酒精的飲料；汽水" | "汽水；不含酒精的飲料" | 只調換釋義順序 |
| a2-u11-l01-q08 | cost | glossZh | "花費（動詞）；費用" | "花費；費用" | 切開後第一段與干擾項長度、格式一致（括號註記移到第二段或刪除 |
| a2-u11-l02-q03 | trade | glossZh | "貿易；買賣" | "買賣；貿易" | 只調換釋義順序 |
| a2-u11-l03-q01 | credit | glossZh | "信用；（credit card）信用卡" | "信用卡；信用" | 切開後第一段與干擾項長度、格式一致（括號註記移到第二段或刪除 |
| a2-u11-l03-q02 | exchange | exampleEn | "Keep the receipt if you want to make an exchange." | "The two students exchanged phone numbers after class." | 例句改寫 |
| a2-u11-l03-q02 | exchange | exampleZh | "如果想換貨，請留著收據。" | "兩個學生下課後交換了電話號碼。" | 例句改寫 |
| a2-u11-l04-q01 | rent | glossZh | "租（動詞）；租金" | "租；租金" | 切開後第一段與干擾項長度、格式一致（括號註記移到第二段或刪除 |
| a2-u12-l02-q02 | national | exampleEn | "This is the national museum." | "Today is a national holiday, so the banks are closed." | 例句改寫 |
| a2-u12-l02-q02 | national | exampleZh | "這是國立博物館。" | "今天是國定假日，所以銀行沒有開。" | 例句改寫 |
| a2-u12-l02-q03 | nation | exampleEn | "The whole nation watched the game on TV." | "This sport is popular in many nations." | 例句改寫 |
| a2-u12-l02-q03 | nation | exampleZh | "全國人民都在看電視轉播這場比賽。" | "這項運動在很多國家都很受歡迎。" | 例句改寫 |
| a2-u12-l03-q01 | south | exampleEn | "Many birds fly south in winter." | "The weather is usually warmer in the south." | 例句改寫 |
| a2-u12-l03-q01 | south | exampleZh | "很多鳥在冬天往南飛。" | "南部的天氣通常比較溫暖。" | 例句改寫 |
| a2-u12-l04-q03 | abroad | glossZh | "到國外；在國外" | "在國外；到國外" | 只調換釋義順序 |
| a2-u12-l04-q04 | architecture | glossZh | "建築（風格）；建築學" | "建築學；建築風格" | 切開後第一段與干擾項長度、格式一致（括號註記移到第二段或刪除 |
| a2-u12-l05-q01 | overseas | glossZh | "在海外；到國外" | "到國外；在海外" | 只調換釋義順序 |
| a2-u13-l01-q02 | traveler | glossZh | "旅行者；旅客" | "旅客；旅行者" | 只調換釋義順序 |
| a2-u13-l05-q02 | bus station | glossZh | "公車總站；客運站" | "客運站；公車總站" | 只調換釋義順序 |
| a2-u14-l01-q05 | die | glossZh | "死；（植物）枯死" | "枯死；死" | 切開後第一段與干擾項長度、格式一致（括號註記移到第二段或刪除 |
| a2-u14-l01-q09 | medical | glossZh | "醫學的；醫療的" | "醫療的；醫學的" | 只調換釋義順序 |
| a2-u14-l02-q05 | temperature | glossZh | "溫度；氣溫" | "氣溫；溫度" | 只調換釋義順序 |
| a2-u14-l02-q06 | accident | glossZh | "意外；事故" | "事故；意外" | 只調換釋義順序 |
| a2-u14-l02-q09 | stomach | glossZh | "胃；肚子" | "肚子；胃" | 只調換釋義順序 |
| a2-u14-l03-q03 | psychologist | glossZh | "心理學家；心理師" | "心理師；心理學家" | 只調換釋義順序 |
| a2-u14-l04-q08 | stomachache | glossZh | "胃痛；肚子痛" | "肚子痛；胃痛" | 只調換釋義順序 |
| a2-u15-l04-q05 | singing | exampleEn | "We heard singing from the next room." | "Singing is a good way to learn new words." | 例句改寫 |
| a2-u15-l04-q05 | singing | exampleZh | "我們聽到隔壁房間傳來歌聲。" | "唱歌是學新單字的好方法。" | 例句改寫 |
| a2-u17-l03-q01 | educational | distractorsZh | ["無聊的", "危險的", "昂貴的"] | ["沒有意義的", "讓人害怕的", "價格昂貴的"] | 切開後第一段與干擾項長度、格式一致（括號註記移到第二段或刪除 |
| a2-u17-l03-q04 | explanation | glossZh | "解釋；說明" | "說明；解釋" | 只調換釋義順序 |
| a2-u18-l02-q07 | natural | glossZh | "天然的；自然的" | "自然的；天然的" | 只調換釋義順序 |
| a2-u18-l02-q08 | rock | glossZh | "岩石；石頭" | "石頭；岩石" | 只調換釋義順序 |
| a2-u18-l04-q02 | seed | exampleEn | "This apple has five seeds inside." | "Birds carry seeds to new places." | 例句改寫 |
| a2-u18-l04-q02 | seed | exampleZh | "這顆蘋果裡面有五顆籽。" | "鳥會把種子帶到新的地方。" | 例句改寫 |
| a2-u18-l06-q01 | oak | exampleEn | "Our table is made of oak." | "We had a picnic under a big oak." | 例句改寫 |
| a2-u18-l06-q01 | oak | exampleZh | "我們的桌子是橡木做的。" | "我們在一棵大橡樹下野餐。" | 例句改寫 |
| a2-u18-l06-q06 | sandy | exampleEn | "Your shoes are sandy. Leave them outside." | "The path to the lake is sandy, so walk slowly." | 例句改寫 |
| a2-u18-l06-q06 | sandy | exampleZh | "你的鞋子沾滿了沙，放在外面吧。" | "通往湖邊的小路是沙地，所以要慢慢走。" | 例句改寫 |
| a2-u19-l01-q04 | public | glossZh | "（the public）大眾；民眾" | "大眾；民眾（the public）" | 切開後第一段與干擾項長度、格式一致（括號註記移到第二段或刪除 |
| a2-u19-l01-q06 | military | glossZh | "軍事的；軍用的" | "軍用的；軍事的" | 只調換釋義順序 |
| a2-u19-l03-q05 | murder | glossZh | "謀殺；謀殺案" | "謀殺案；謀殺" | 只調換釋義順序 |
| a2-u19-l04-q04 | violent | glossZh | "暴力的；猛烈的" | "猛烈的；暴力的" | 只調換釋義順序 |
| a2-u19-l05-q06 | repair | exampleEn | "The road is closed for repairs." | "The old clock in our hall was repaired in one day." | 例句改寫 |
| a2-u19-l05-q06 | repair | exampleZh | "這條路因為整修而封閉。" | "我們走廊上那座舊時鐘一天就修好了。" | 例句改寫 |
| a2-u19-l06-q01 | invade | glossZh | "入侵；湧入" | "湧入；入侵" | 只調換釋義順序 |
| a2-u19-l06-q06 | robbery | glossZh | "搶劫；搶案" | "搶案；搶劫" | 只調換釋義順序 |
| a2-u20-l01-q03 | suggest | exampleEn | "My friend suggested a good restaurant." | "What do you suggest I buy for my mom?" | 例句改寫 |
| a2-u20-l01-q03 | suggest | exampleZh | "我朋友推薦了一家好餐廳。" | "你建議我買什麼給我媽媽？" | 例句改寫 |
| a2-u20-l01-q06 | sound | distractorsZh | ["顏色；看起來", "味道；嚐起來", "形狀；摸起來"] | ["看起來", "嚐起來", "摸起來"] | 切開後第一段與干擾項長度、格式一致（括號註記移到第二段或刪除 |
| a2-u20-l01-q06 | sound | glossZh | "聲音；聽起來" | "聽起來；聲音" | 只調換釋義順序 |
| a2-u20-l01-q08 | argue | glossZh | "爭論；吵架" | "吵架；爭論" | 只調換釋義順序 |
| a2-u20-l02-q04 | debate | exampleEn | "The new road started a debate in our town." | "Our team won the debate last Friday." | 例句改寫 |
| a2-u20-l02-q04 | debate | exampleZh | "這條新道路在我們鎮上引起了爭論。" | "我們隊上週五贏了那場辯論。" | 例句改寫 |
| a2-u20-l02-q08 | text | glossZh | "簡訊；傳簡訊" | "傳簡訊；簡訊" | 只調換釋義順序 |
| a2-u20-l03-q04 | tape | exampleEn | "My grandfather still listens to old music tapes." | "I put the poster on the wall with tape." | 例句改寫 |
| a2-u20-l03-q04 | tape | exampleZh | "我爺爺還在聽舊的音樂錄音帶。" | "我用膠帶把海報貼在牆上。" | 例句改寫 |
| a2-u20-l04-q03 | shout | exampleEn | "With a shout, he jumped into the pool." | "Don't shout at the dog. Be nice to it." | 例句改寫 |
| a2-u20-l04-q03 | shout | exampleZh | "他大叫一聲，跳進了游泳池。" | "不要對那隻狗大叫，要對牠好一點。" | 例句改寫 |
| a2-u20-l04-q04 | description | glossZh | "描述；描寫" | "描寫；描述" | 只調換釋義順序 |
| a2-u20-l05-q01 | complaint | glossZh | "抱怨；投訴" | "投訴；抱怨" | 只調換釋義順序 |
| a2-u20-l05-q02 | speaker | exampleEn | "These speakers make the music sound great." | "Everyone listened quietly to the speaker." | 例句改寫 |
| a2-u20-l05-q02 | speaker | exampleZh | "這組喇叭讓音樂聽起來很棒。" | "大家都安靜地聽演講者說話。" | 例句改寫 |
| a2-u21-l01-q08 | scene | glossZh | "（電影等的）一幕；場面" | "一幕；場面（電影等）" | 切開後第一段與干擾項長度、格式一致（括號註記移到第二段或刪除 |
| a2-u21-l02-q07 | column | exampleEn | "The old temple has six red columns." | "I read her cooking column in the paper each week." | 例句改寫 |
| a2-u21-l02-q07 | column | exampleZh | "那座老廟有六根紅色柱子。" | "我每週都會看她在報紙上的烹飪專欄。" | 例句改寫 |
| a2-u21-l03-q02 | advertising | glossZh | "廣告業；廣告" | "廣告；廣告業" | 只調換釋義順序 |
| a2-u21-l03-q03 | portrait | glossZh | "肖像；畫像" | "畫像；肖像" | 只調換釋義順序 |
| a2-u21-l03-q04 | fiction | exampleEn | "This book is fiction, not a true story." | "My aunt writes fiction for young readers." | 例句改寫 |
| a2-u21-l03-q04 | fiction | exampleZh | "這本書是虛構的，不是真實的故事。" | "我阿姨為年輕讀者寫小說。" | 例句改寫 |
| a2-u22-l01-q06 | part | exampleEn | "Cut the cake into eight parts." | "Part of the road is closed today." | 例句改寫 |
| a2-u22-l01-q06 | part | exampleZh | "把蛋糕切成八塊。" | "今天這條路有一部分封閉了。" | 例句改寫 |
| a2-u22-l02-q02 | level | exampleEn | "The water level in the lake is very low this year." | "This test checks your reading level." | 例句改寫 |
| a2-u22-l02-q02 | level | exampleZh | "今年湖的水位很低。" | "這個測驗會檢查你的閱讀程度。" | 例句改寫 |
| a2-u22-l03-q04 | range | exampleEn | "This shop sells a wide range of phones." | "Tickets in this price range sell quickly." | 例句改寫 |
| a2-u22-l03-q04 | range | exampleZh | "這家店賣各式各樣的手機。" | "這個價格範圍的票賣得很快。" | 例句改寫 |
| a2-u22-l04-q04 | divide | glossZh | "分；除" | "除；分" | 只調換釋義順序 |
| a2-u22-l04-q07 | addition | exampleEn | "In addition to English, she speaks Japanese." | "Can you do this addition in your head?" | 例句改寫 |
| a2-u22-l04-q07 | addition | exampleZh | "除了英文，她還會說日文。" | "你能心算這題加法嗎？" | 例句改寫 |
| a2-u22-l05-q01 | deeply | exampleEn | "She is deeply interested in music." | "The kids breathed deeply before they jumped into the pool." | 例句改寫 |
| a2-u22-l05-q01 | deeply | exampleZh | "她對音樂非常有興趣。" | "孩子們跳進泳池前深深吸了一口氣。" | 例句改寫 |
| a2-u22-l06-q01 | load | glossZh | "（一次的）載量；一批" | "一批；一次的量" | 切開後第一段與干擾項長度、格式一致（括號註記移到第二段或刪除 |
| a2-u23-l02-q05 | concern | glossZh | "擔心；關心" | "關心；擔心" | 只調換釋義順序 |
| a2-u23-l03-q03 | purpose | exampleEn | "This room has no real purpose." | "Every rule in our class has a purpose." | 例句改寫 |
| a2-u23-l03-q03 | purpose | exampleZh | "這個房間沒有什麼實際用途。" | "我們班上的每條規定都有它的目的。" | 例句改寫 |
| a2-u23-l04-q02 | commitment | exampleEn | "Thank you for your commitment to the team." | "He made a commitment to call his mom every week." | 例句改寫 |
| a2-u23-l04-q02 | commitment | exampleZh | "謝謝你對球隊的投入。" | "他承諾每週都會打電話給媽媽。" | 例句改寫 |
| a2-u23-l04-q05 | secret | exampleEn | "The secret of this cake is fresh butter." | "Our surprise party for Dad is a secret." | 例句改寫 |
| a2-u23-l04-q05 | secret | exampleZh | "這個蛋糕的秘訣是新鮮奶油。" | "我們要給爸爸的驚喜派對是個秘密。" | 例句改寫 |
| a2-u24-l01-q04 | effect | glossZh | "影響；效果" | "效果；影響" | 只調換釋義順序 |
| a2-u24-l01-q05 | develop | exampleEn | "She developed a love of music at a young age." | "The small shop slowly developed into a big business." | 例句改寫 |
| a2-u24-l01-q05 | develop | exampleZh | "她從小就培養出對音樂的熱愛。" | "那家小店慢慢發展成一家大公司。" | 例句改寫 |
| a2-u25-l02-q01 | seriously | exampleEn | "Seriously? You ate the whole cake?" | "My grandpa plays chess very seriously." | 例句改寫 |
| a2-u25-l02-q01 | seriously | exampleZh | "真的假的？你把整個蛋糕吃掉了？" | "我爺爺下棋非常認真。" | 例句改寫 |
| a2-u25-l02-q03 | unusual | glossZh | "不尋常的；特別的" | "特別的；不尋常的" | 只調換釋義順序 |
| a2-u25-l02-q08 | symbol | exampleEn | "The bear is the symbol of our school team." | "To my grandma, this old ring is a symbol of family." | 例句改寫 |
| a2-u25-l02-q08 | symbol | exampleZh | "熊是我們學校球隊的標誌。" | "對我奶奶來說，這枚舊戒指是家人的象徵。" | 例句改寫 |
| a2-u25-l04-q02 | square | exampleEn | "We met in the town square." | "We sat at a small square table by the window." | 例句改寫 |
| a2-u25-l04-q02 | square | exampleZh | "我們在鎮上的廣場碰面。" | "我們坐在窗邊一張小方桌旁。" | 例句改寫 |
| a2-u26-l01-q04 | spread | glossZh | "傳播；普及；蔓延" | "普及；傳播；蔓延" | 只調換釋義順序 |
| a2-u26-l02-q01 | function | exampleEn | "This room functions as a library." | "The old clock still functions after a hundred years." | 例句改寫 |
| a2-u26-l02-q01 | function | exampleZh | "這個房間被當作圖書室使用。" | "那座老時鐘過了一百年還能運作。" | 例句改寫 |
| a2-u26-l03-q04 | mark | exampleEn | "The teacher marked my test in red." | "I put a mark next to each word I don't know." | 例句改寫 |
| a2-u26-l03-q04 | mark | exampleZh | "老師用紅筆批改我的考卷。" | "我在每個不認識的字旁邊做個記號。" | 例句改寫 |
| a2-u26-l04-q02 | pour | exampleEn | "It's pouring outside. Take an umbrella." | "He poured the rice into a big bowl." | 例句改寫 |
| a2-u26-l04-q02 | pour | exampleZh | "外面下著傾盆大雨，帶把傘吧。" | "他把米倒進一個大碗裡。" | 例句改寫 |
| a2-u26-l04-q07 | escape | exampleEn | "Reading is my escape from a busy day." | "The dog escaped from the garden this morning." | 例句改寫 |
| a2-u26-l04-q07 | escape | exampleZh | "閱讀是我暫時逃離忙碌一天的方式。" | "那隻狗今天早上從花園逃走了。" | 例句改寫 |
| a2-u26-l05-q02 | slide | glossZh | "溜滑梯；投影片" | "投影片；溜滑梯" | 只調換釋義順序 |
| a2-u26-l05-q07 | pack | exampleEn | "I bought a pack of cards." | "Before we moved, it took us a whole week to pack." | 例句改寫 |
| a2-u26-l05-q07 | pack | exampleZh | "我買了一副撲克牌。" | "搬家前，我們花了整整一週打包。" | 例句改寫 |
| a2-u26-l06-q03 | string | exampleEn | "One string on my guitar is broken." | "The kite flew away when its string broke." | 例句改寫 |
| a2-u26-l06-q03 | string | exampleZh | "我吉他上有一根弦斷了。" | "風箏的線斷了，風箏就飛走了。" | 例句改寫 |
| a2-u26-l06-q04 | freeze | exampleEn | "My computer froze, and I lost my work." | "It was so cold that the water in the dog's bowl froze." | 例句改寫 |
| a2-u26-l06-q04 | freeze | exampleZh | "我的電腦當機了，我做的東西都不見了。" | "天氣冷到連狗碗裡的水都結冰了。" | 例句改寫 |
| a2-u27-l02-q01 | silly | glossZh | "愚蠢的；滑稽的" | "滑稽的；愚蠢的" | 只調換釋義順序 |
| a2-u27-l02-q03 | ambition | glossZh | "志向；抱負；企圖心" | "企圖心；志向；抱負" | 只調換釋義順序 |
| a2-u27-l03-q06 | weep | exampleEn | "She had a little weep after the sad phone call." | "My grandpa wept at my sister's wedding." | 例句改寫 |
| a2-u27-l03-q06 | weep | exampleZh | "接到那通令人難過的電話後，她小哭了一下。" | "我爺爺在我姊姊的婚禮上哭了。" | 例句改寫 |
| a2-u27-l05-q05 | playful | glossZh | "愛玩的；調皮的" | "調皮的；愛玩的" | 只調換釋義順序 |
| a2-u27-l06-q02 | pleasing | exampleEn | "The music in this cafe is very pleasing." | "It was a pleasing day: sunny, warm and quiet." | 例句改寫 |
| a2-u27-l06-q02 | pleasing | exampleZh | "這家咖啡店的音樂很悅耳。" | "那是令人愉快的一天：晴朗、溫暖又安靜。" | 例句改寫 |

## 四、mcq 改動明細（以 61224a2 為基準）

| 題 id | 題幹 | 改前選項（★正解） | 改後選項 | 規則 | 說明 |
|---|---|---|---|---|---|
| a1-u01-l01-q13 | Can I have a cup ____ coffee, please? | to／in／and／★of | a／the／and／★of | 同課共用／交叉當正解 | to、and 與 q14 共用、in 是 q14 正解，改用 a、the；保留 and（a cup and coffee 文法可通）。本課僅 8 字、其他介系詞只有 to，無法做到同詞性題 |
| a1-u01-l01-q14 | My mother is ____ the kitchen now. | of／to／and／★in | be／to／have／★in | 同課共用／交叉當正解 | of 是 q13 正解、and 與 q13 共用，改 be、have；保留 to。全課可用字只有 8 個，同詞性與混合題兩條件無解（見回報） |
| a1-u01-l02-q13 | I play ball ____ my friends after school. | it／on／that／★with | it／in／and／★with | 同課共用／交叉當正解、混合詞性題放得進空格 | on 是 q14 正解，改 in；that 放不進空格改 and（in／and 文法可通）；避開 for（play ball for my friends 也通） |
| a1-u01-l02-q14 | Your phone is ____ the chair. | for／★on／with／he | for／★on／to／of | 同課共用／交叉當正解、四選項同詞性 | with 是 q13 正解改 to；he 改 of，使四選項皆介系詞 |
| a1-u01-l03-q13 | I like milk, ____ my sister does not. | this／from／★but／at | this／for／★but／that | 同課共用／交叉當正解、混合詞性題放得進空格 | from 是 q14 正解、at 與 q14 共用，改 for、that（兩者文法可通、語意不對）；避開 and（也通） |
| a1-u01-l03-q14 | This letter is ____ my grandmother. | at／but／★from／we | at／in／★from／on | 同課共用／交叉當正解、四選項同詞性 | but 是 q13 正解改 in；we 改 on，使四選項皆介系詞；避開 for／to（也通） |
| a1-u01-l04-q13 | Would you like rice ____ bread? | as／★or／not／by | of／★or／not／from | 同課共用／交叉當正解、混合詞性題放得進空格 | as 是 q14 正解改 of；by 讓給 q14 改 from（of／from 文法可通）；避開 and、with（也通） |
| a1-u01-l04-q14 | My mother works ____ a teacher. | can／what／or／★as | in／at／by／★as | 同課共用／交叉當正解、四選項同詞性 | or 是 q13 正解；can、what 放不進空格；改 in、at、by 四選項皆介系詞；避開 with、for（也通） |
| a1-u01-l05-q13 | ____ is your English teacher? | If／My／★Who／All | What／His／★Who／All | 混合詞性題放得進空格 | If、My 放不進空格，改 What、His（文法可通、語意不符「誰」） |
| a1-u01-l05-q14 | This movie is ____ a family and their cat. | ★about／will／her／would | ★about／with／at／from | 四選項同詞性 | will、her、would 放不進空格，改 with、at、from 使四選項皆介系詞；避開 for、on（也通） |
| a1-u01-l06-q14 | My grandparents live near the sea. I love ____ very much. | some／there／so／★them | her／you／me／★them | 同課共用／交叉當正解、四選項同詞性 | so 是 q13 正解；改成四個受格代名詞（只靠前句祖父母判斷）；避開 it（可指海） |
| a1-u01-l07-q13 | This bag is bigger ____ that one. | out／into／just／★than | out／for／in／★than | 同課共用／交叉當正解、混合詞性題放得進空格 | into 是 q14 正解改 for；just 放不進空格改 in（for／in 文法可通） |
| a1-u01-l07-q14 | The dog runs ____ the house when it rains. | than／other／★into／your | from／with／★into／by | 同課共用／交叉當正解、四選項同詞性 | than 是 q13 正解；other、your 放不進空格；改 from、with、by 使四選項皆介系詞；避開 to、in、out（也通） |
| a1-u01-l08-q13 | I stay home ____ it is raining. | these／then／★because／how | so／or／★because／how | 同課共用／交叉當正解、混合詞性題放得進空格 | these 與 q14 共用、then 是 q14 正解，改 so、or（文法可通、語意不對）；避開 when、if（也通） |
| a1-u01-l08-q14 | First I wash my hands, ____ I eat. | these／its／★then／our | when／if／★then／but | 同課共用／交叉當正解、四選項同詞性 | these 與 q13 共用；its、our 放不進空格；改 when、if、but 四選項皆連接詞；避開 and、because |
| a1-u01-l09-q13 | There are ____ students in the classroom. | here／very／back／★many | these／more／those／★many | 同課共用／交叉當正解、四選項同詞性 | here、very、back 與 q14 共用且放不進空格；改 these、more、those 使四選項皆限定詞；避開 some（也通） |
| a1-u01-l09-q14 | Do you have ____ brothers or sisters? | very／★any／here／back | very／★any／only／their | 同課共用／交叉當正解、混合詞性題放得進空格 | here、back 與 q13 共用，改 only、their（文法可通、語意不對）；避開 some、no（也通） |
| a1-u01-l10-q13 | You look tired. You ____ go to bed early. | through／★should／after／over | still／★should／will／over | 同課共用／交叉當正解、混合詞性題放得進空格 | after 是 q14 正解改 will；through 放不進空格改 still（兩者文法可通）；避開 could、can（語意太近） |
| a1-u01-l10-q14 | I brush my teeth ____ breakfast. | ★after／still／down／us | ★after／with／into／from | 四選項同詞性 | still、down、us 放不進空格；改 with、into、from 使四選項皆介系詞；避開 at、over、before（也通） |
| a1-u02-l01-q13 | My ____ is on July 4. | people／world／★birthday／life | man／woman／★birthday／them | 同課共用／交叉當正解、混合詞性題放得進空格 | people 是 q14 正解、life／world 讓給 q14；改 man、woman（文法可通）、them |
| a1-u02-l01-q14 | Many ____ in my town ride bikes. | woman／man／★people／life | byes／worlds／★people／lives | 同課共用／交叉當正解、四選項同詞性 | woman、man 單數放不進 Many ___（文法洩題）；改成複數名詞 byes、worlds、lives；避開 men、women（也通） |
| a1-u02-l02-q13 | Hi, my ____ is Amy. | age／job／★name／person | age／kid／★name／person | 同課共用／交叉當正解 | job 是 q14 正解，改同課名詞 kid |
| a1-u02-l03-q13 | Please write your home ____ here. | reporter／★address／sorry／thank | reporter／★address／name／birth | 同課共用／交叉當正解、四選項同詞性 | thank 是 q14 正解、sorry 與 q14 共用，改 name、birth 使四選項皆名詞 |
| a1-u02-l03-q14 | ____ you very much! | ★Thank／Sorry／Personal／Introduce | ★Thank／Need／Personal／Introduce | 同課共用／交叉當正解、混合詞性題放得進空格 | Sorry 與 q13 共用，改 Need（文法可通，與 Introduce 共兩個放得進） |
| a1-u02-l04-q13 | ____ to our party! | Sorry／★Welcome／Engineer／Cop | Thanks／★Welcome／Engineer／Hi | 混合詞性題放得進空格 | Sorry、Cop 放不進空格，改 Thanks、Hi（文法可通、語意不符歡迎） |
| a1-u02-l04-q14 | Excuse me, ____. Is this your phone? | welcome／self／★sir／thanks | person／self／★sir／world | 同課共用／交叉當正解、四選項同詞性 | welcome 是 q13 正解、thanks 讓給 q13；改 person、world 四選項皆名詞 |
| a1-u02-l05-q14 | ____ me, is this seat free? | Hello／Greet／★Excuse／Spy | Hello／Greet／★Excuse／Thank | 同課共用／交叉當正解、混合詞性題放得進空格 | Spy 與 q13 共用，改 Thank（祈使句文法可通，與 Greet 共兩個）；避開 Pardon（也通） |
| a1-u02-l06-q12 | I am going to bed. ____, Mom! | ★Good night／Good morning／Good afternoon／Last name | ★Good night／Good morning／Good afternoon／Welcome | 同課共用／交叉當正解、四選項同詞性 | Last name 是 q13 正解，改 Welcome 使四選項皆招呼語；good morning 讓給本題 |
| a1-u02-l06-q13 | My first name is Tom, and my ____ is Smith. | Mrs.／★last name／good morning／nationality | Mrs.／★last name／hometown／nationality | 同課共用／交叉當正解 | good morning 與 q12 共用，改同單元名詞 hometown |
| a1-u03-l01-q14 | What ____ is it now? | two／first／o'clock／★time | job／address／age／★time | 同課共用／交叉當正解、四選項同詞性 | two 與 q15 共用、first 是 q15 正解，o'clock 非名詞；改 job、address、age 四選項皆名詞，只能靠「幾點」詞義選 time（實作端複核：year、day 代入也是正常問句，不用） |
| a1-u03-l01-q15 | Today is the ____ day of my new job. | now／one／two／★first | now／one／only／★first | 同課共用／交叉當正解、混合詞性題放得進空格 | two 與 q14 共用且放不進空格，改 only（與 one 共兩個文法可通） |
| a1-u03-l02-q14 | I ____ eat meat. I only eat vegetables. | ★never／always／today／month | ★never／always／today／now | 同課共用／交叉當正解、四選項同詞性 | month 是 q15 正解，改 now，四選項皆副詞；today 留本題、q15 改用 year |
| a1-u03-l02-q15 | There are about four weeks in a ____. | today／night／number／★month | year／night／number／★month | 同課共用／交叉當正解、四選項同詞性 | today 與 q14 共用，改 year，四選項皆名詞 |
| a1-u03-l03-q13 | He left ten minutes ____. | ★ago／often／once／morning | ★ago／often／later／after | 同課共用／交叉當正解、混合詞性題放得進空格 | once、morning 與 q14 共用，改 later、after（ten minutes later／after 文法可通、與「前」意思相反）；避開 back（也對） |
| a1-u03-l03-q14 | There are sixty minutes in one ____. | morning／minute／★hour／once | morning／minute／★hour／day | 同課共用／交叉當正解、四選項同詞性 | once 與 q13 共用且非名詞，改 day，四選項皆名詞 |
| a1-u03-l04-q13 | The train leaves at six. Please don't be ____. | moment／half／★late／second | early／first／★late／second | 同課共用／交叉當正解、四選項同詞性 | moment 是 q14 正解、half 與 q14 共用，改 early、first，四選項皆形容詞；避開 sorry |
| a1-u03-l05-q13 | I ____ have tea in the morning. | summer／tonight／★usually／future | never／always／★usually／often | 同課共用／交叉當正解、四選項同詞性 | tonight 是 q14 正解、future 與 q14 共用、summer 放不進；改頻率副詞 never、always、often，只靠「通常」詞義選 |
| a1-u03-l05-q14 | Let's watch a movie ____. | future／usually／spring／★tonight | later／today／spring／★tonight | 同課共用／交叉當正解、混合詞性題放得進空格 | usually 是 q13 正解、future 與 q13 共用且放不進；改 later、today（文法可通、與「今晚」不符） |
| a1-u03-l06-q14 | I will see you ____ morning. | evening／★tomorrow／afternoon／nine | this／★tomorrow／afternoon／one | 同課共用／交叉當正解、混合詞性題放得進空格 | evening 與 q13 共用改 this；nine 放不進改 one（this／one morning 文法可通、非「明天」） |
| a1-u04-l01-q13 | I want you to ____ my parents. | family／social／together／★meet | thank／social／introduce／★meet | 同課共用／交叉當正解、混合詞性題放得進空格 | together 是 q14 正解、family 放不進；改動詞 thank、introduce（文法可通）；避開 greet、visit（語意太近） |
| a1-u04-l01-q14 | My brother and I often play ____. | social／★together／child／meet | early／★together／today／there | 同課共用／交叉當正解、四選項同詞性 | social 與 q13 共用、meet 是 q13 正解、child 放不進；改副詞 early、today、there，四選項皆副詞 |
| a1-u04-l04-q13 | We ____ the New Year with our family. | kiss／★celebrate／neighbor／cousin | kiss／★celebrate／visit／love | 同課共用／交叉當正解、四選項同詞性 | neighbor 是 q14 正解、cousin 非動詞；改 visit、love，四選項皆動詞；避開 share（也通） |
| a1-u04-l04-q14 | Mr. Lee lives in the house near ours. He is our ____. | kiss／gift／mom／★neighbor | party／gift／mom／★neighbor | 同課共用／交叉當正解 | kiss 與 q13 共用，改同單元名詞 party |
| a1-u04-l05-q12 | My mother's brother is my ____. | aunt／★uncle／grandfather／boyfriend | cousin／★uncle／grandfather／father | 同課共用／交叉當正解 | boyfriend 與 q13 共用改 father；aunt 讓給 q13 改 cousin，四選項皆名詞 |
| a1-u04-l05-q13 | ____ Tom, how are you? | Celebration／★Dear／Girlfriend／Boyfriend | Aunt／★Dear／Girlfriend／Sorry | 同課共用／交叉當正解、混合詞性題放得進空格 | Boyfriend 與 q12 共用、Celebration 放不進；改 Aunt、Sorry（Aunt Tom／Sorry Tom 文法可通）；避開 Hi、Hello（也通） |
| a1-u04-l06-q12 | We say "____ Christmas" in December. | Grandpa／Mum／Daddy／★Merry | Dear／Mum／Social／★Merry | 同課共用／交叉當正解、混合詞性題放得進空格 | Grandpa 是 q13 正解、Daddy 與 q13 共用，改形容詞 Dear、Social（文法可通） |
| a1-u04-l06-q13 | My father's father is my ____. | mum／mommy／★grandpa／daddy | aunt／grandma／★grandpa／daddy | 同課共用／交叉當正解、四選項同詞性 | mum 與 q12 共用改 aunt；mommy 改 grandma，四選項皆名詞；避開 grandparent（也對） |
| a1-u05-l01-q14 | My grandfather is eighty. He is very ____. | ★old／new／own／thing | ★old／new／good／great | 四選項同詞性 | own、thing 放不進 He is very ___，改 good、great，四選項皆形容詞 |
| a1-u05-l01-q15 | She plays the piano very ____. | high／big／★well／old | high／big／★well／often | 同課共用／交叉當正解、混合詞性題放得進空格 | old 是 q14 正解，改 often（plays very often 文法可通，與 high 共兩個）；避開 good（常見錯誤） |
| a1-u05-l02-q15 | My son is only five. He is very ____. | side／case／★young／thing | old／big／★young／thing | 同課共用／交叉當正解、混合詞性題放得進空格 | side、case 與 q14 共用，改 old、big（文法可通、語意不對）；避開 small（年紀小也可能被當對） |
| a1-u05-l03-q13 | This is not a toy. It is a ____ car. | important／line／best／★real | different／long／bad／★real | 同課共用／交叉當正解、四選項同詞性 | line 是 q14 正解；important 配 a 冠詞洩題、best 配 a 不通；改 different、long、bad，四選項皆子音開頭形容詞 |
| a1-u05-l03-q14 | We waited in a long ____ for the bus. | ★line／white／real／little | ★line／white／side／thing | 同課共用／交叉當正解、混合詞性題放得進空格 | real 是 q13 正解改 side；little 放不進改 thing（side／thing 文法可通） |
| a1-u05-l04-q13 | This bag is very ____. I can carry it with one hand. | sure／★light／true／difference | sure／★light／true／different | 同課共用／交叉當正解 | difference 與 q14 共用且非形容詞，改 different，四選項皆形容詞；sure、true 留本題 |
| a1-u05-l04-q14 | I feel ____ today. Yesterday I was sick. | difference／★better／true／sure | important／★better／free／bad | 同課共用／交叉當正解、四選項同詞性 | difference、true、sure 與 q13 共用；改 important、free、bad，四選項皆形容詞；避開 good、well（也對）、different（語意模糊） |
| a1-u05-l05-q13 | My glass is ____ of water. | type／easy／special／★full | free／sure／special／★full | 混合詞性題放得進空格 | type、easy 放不進 ___ of water，改 free、sure（free of／sure of 文法可通、語意不對） |
| a1-u05-l06-q13 | Sorry, this is the ____ bus. I want the number 5 bus. | ★wrong／top／quickly／color | ★wrong／red／short／close | 同課共用／交叉當正解、四選項同詞性 | top 與 q14 共用、quickly 是 q14 正解；改 red、short、close，四選項皆形容詞 |
| a1-u05-l06-q14 | Please walk ____. We are late. | top／difficult／short／★quickly | well／difficult／hard／★quickly | 同課共用／交叉當正解、混合詞性題放得進空格 | top 與 q13 共用、short 讓給 q13；改副詞 well、hard（walk well／hard 文法可通） |
| a1-u06-l01-q15 | Please open the ____. Someone is here. | vase／towel／garbage／★door | room／towel／house／★door | 同課共用／交叉當正解 | vase、garbage 與 q14 共用，改同課名詞 room、house |
| a1-u06-l02-q13 | I drink a ____ of milk every morning. | window／wall／floor／★glass | towel／wall／floor／★glass | 同課共用／交叉當正解 | window 是 q14 正解，改同單元名詞 towel；避開 box（a box of milk 也對） |
| a1-u06-l03-q13 | I cook dinner in the ____. | tool／key／★kitchen／machine | tool／yard／★kitchen／machine | 同課共用／交叉當正解 | key 是 q14 正解，改同課名詞 yard |
| a1-u06-l03-q14 | I use a ____ to open the door. | kitchen／garden／★key／hall | bedroom／garden／★key／hall | 同課共用／交叉當正解 | kitchen 是 q13 正解，改同課名詞 bedroom；避開 tool（也對） |
| a1-u06-l04-q13 | Please ____ the cups. They are dirty. | bell／noise／shelf／★wash | bell／kiss／close／★wash | 同課共用／交叉當正解、混合詞性題放得進空格 | noise 是 q14 正解、shelf 與 q14 共用；改動詞 kiss、close（文法可通、語意不對）；避開 brush（刷杯子也可能被當對） |
| a1-u06-l05-q14 | We have dinner in the ____. | toilet／★dining room／bucket／saw | toilet／★dining room／bucket／bathroom | 同課共用／交叉當正解 | saw 與 q13 共用，改同單元名詞 bathroom；避開 living room、kitchen（也通） |
| a1-u07-l01-q13 | Can you ____ here for a minute? | role／★wait／group／leader | work／★wait／meet／business | 同課共用／交叉當正解、混合詞性題放得進空格 | role、group 與 q14 共用、leader 是 q14 正解；改 work、meet（文法可通）、business；避開 stay（也對） |
| a1-u07-l02-q14 | He works hard, and his business is very ____. | ★successful／sleep／meeting／skill | ★successful／special／meeting／different | 同課共用／交叉當正解、混合詞性題放得進空格 | sleep、skill 與 q13 共用且放不進，改形容詞 special、different（文法可通） |
| a1-u07-l03-q12 | I ____ up at six every morning. | shower／★wake／habit／code | shower／★wake／stay／wait | 同課共用／交叉當正解、混合詞性題放得進空格 | habit 與 q13 共用、code 是 q13 正解；改 stay、wait（stay up／wait up 文法可通、語意不對） |
| a1-u07-l03-q13 | Do you know the ____ for this door? | habit／mail／busy／★code | habit／mail／skill／★code | 四選項同詞性 | busy 非名詞，改同單元名詞 skill，四選項皆名詞 |
| a1-u07-l04-q12 | It is twelve at night, but the baby is ____. | hurry／★awake／email／interviewer | hurry／★awake／busy／mobile | 同課共用／交叉當正解、混合詞性題放得進空格 | email 是 q13 正解、interviewer 與 q13 共用；改形容詞 busy、mobile（文法可通） |
| a1-u07-l04-q13 | Write me an ____ when you get home. | ★email／mobile／interviewer／everyday | ★email／interview／interviewer／event | 四選項同詞性 | mobile 配 an 洩題、everyday 非名詞；改母音開頭名詞 interview、event，四選項皆可接 an |
| a1-u08-l01-q13 | I am ____. Can we eat now? | ★hungry／butter／salad／apple | ★hungry／full／free／apple | 混合詞性題放得進空格 | butter、salad 放不進 I am ___，改 full、free（文法可通、語意不對） |
| a1-u08-l01-q14 | I drink a glass of apple ____ every day. | soup／★juice／hungry／bean | soup／★juice／tomato／bean | 同課共用／交叉當正解、四選項同詞性 | hungry 是 q13 正解，改同課名詞 tomato，四選項皆名詞 |
| a1-u08-l02-q14 | This pizza is ____! Can I have one more piece? | cookie／cafe／★delicious／sandwich | hungry／bad／★delicious／sandwich | 同課共用／交叉當正解、混合詞性題放得進空格 | cafe 與 q13 共用、cookie 放不進；改形容詞 hungry、bad（文法可通、語意不對） |
| a1-u08-l03-q13 | We usually ____ dinner at seven. | water／food／cup／★eat | water／soup／love／★eat | 同課共用／交叉當正解、混合詞性題放得進空格 | cup 與 q14 共用、food 是 q14 正解，換 soup/love；water（動詞）、love 可放進空格 |
| a1-u08-l03-q14 | Fish is my favorite ____. | water／cup／eat／★food | juice／candy／salad／★food | 同課共用／交叉當正解、四選項同詞性 | water/cup 與 q13 共用、eat 是 q13 正解，換 juice/candy/salad，四選項皆名詞 |
| a1-u08-l04-q13 | This cake has a lot of sugar. It is very ____. | cook／lunch／egg／★sweet | busy／hungry／old／★sweet | 同課共用／交叉當正解、四選項同詞性 | cook 是 q14 正解；改為四個形容詞，靠詞義選 sweet |
| a1-u08-l04-q14 | My father likes to ____ for the family on Sunday. | chicken／drink／restaurant／★cook | chicken／drink／celebrate／★cook | 混合詞性題放得進空格 | 混合詞性題原只有 drink 放得進空格，restaurant 換 celebrate |
| a1-u08-l05-q14 | Apples and bananas are ____. | meat／vegetable／★fruit／meal | candy／chicken／★fruit／juice | 同課共用／交叉當正解、四選項同詞性 | meat/vegetable 與 q13 共用，換 candy/chicken；meal 可數用法不通換 juice，四項皆可放進空格 |
| a1-u08-l06-q13 | Would you like ____ or sugar in your coffee? | bread／★cream／potato／knife | cheese／★cream／butter／juice | 同課共用／交叉當正解、四選項同詞性 | potato 與 q12 共用、knife 是 q12 正解，換 cheese/butter/juice（皆不可數名詞） |
| a1-u08-l07-q12 | Good morning! ____ is ready. Come and eat. | Smell／★Breakfast／Morning／Hungry | Lunch／★Breakfast／Morning／Hungry | 同課共用／交叉當正解 | Smell 是 q13 正解，換 Lunch（Good morning 排除） |
| a1-u08-l07-q13 | I love the ____ of hot bread. | breakfast／corn／rice／★smell | chocolate／corn／rice／★smell | 同課共用／交叉當正解 | breakfast 是 q12 正解，換 chocolate |
| a1-u08-l08-q13 | Can I have a glass of ____ with my burger? | biscuit／beef／grape／★coke | butter／beef／rice／★coke | 同課共用／交叉當正解 | biscuit/grape 與 q12 共用，換 butter/rice（不可數，皆能放進 a glass of） |
| a1-u09-l01-q14 | I like to ____ jeans and a white shirt. | bag／pretty／★wear／hair | cook／pretty／★wear／share | 同課共用／交叉當正解、混合詞性題放得進空格 | hair 與 q13 共用；混合詞性題原無干擾項放得進空格，bag/hair 換動詞 cook/share |
| a1-u09-l02-q13 | This ____ has two pockets. | tall／★shirt／fat／clothes | hat／★shirt／shoe／clothes | 同課共用／交叉當正解、混合詞性題放得進空格 | tall 是 q14 正解、fat 與 q14 共用，換 hat/shoe（可放進 This ____ has） |
| a1-u09-l02-q14 | He is very ____, so his bed is very long. | hat／fat／pocket／★tall | kind／fat／pretty／★tall | 四選項同詞性 | hat/pocket 是名詞放不進 very ____，換 kind/pretty，四項皆形容詞 |
| a1-u09-l03-q13 | It is very cold today. Wear a warm ____. | ugly／button／★coat／cute | ugly／umbrella／★coat／bag | 同課共用／交叉當正解、混合詞性題放得進空格 | button 是 q14 正解；換 umbrella，cute 換 bag，兩個名詞可放進 a warm ____ |
| a1-u09-l03-q14 | I can't close my jacket. A ____ is gone. | ★button／skirt／cap／handsome | ★button／skirt／cap／pocket | 四選項同詞性 | handsome 是形容詞放不進 A ____ is gone，換 pocket，四項皆名詞 |
| a1-u09-l04-q12 | I can't see well. Where are my ____? | apron／★glasses／haircut／ribbon | pants／★glasses／jeans／shoes | 同課共用／交叉當正解、四選項同詞性 | apron 與 q13 共用、haircut 是 q13 正解，換成複數名詞 pants/jeans/shoes，皆合 are my ____ |
| a1-u09-l04-q13 | Your hair is too long. Go and get a ____. | trousers／apron／★haircut／glasses | trousers／apron／★haircut／ribbon | 同課共用／交叉當正解 | glasses 是 q12 正解，換 ribbon |
| a1-u10-l01-q13 | This store ____ milk and bread. | ★sells／money／supermarket／bookstore | ★sells／money／spends／pays | 同課共用／交叉當正解、混合詞性題放得進空格 | bookstore 與 q14 共用；supermarket/bookstore 換動詞 spends/pays，兩個干擾項可放進空格 |
| a1-u10-l01-q14 | Here is ten dollars. Please keep the ____. | ★change／bookstore／spend／sell | ★change／bookstore／phone／key | 同課共用／交叉當正解、四選項同詞性 | sell 是 q13 正解、spend 為動詞，換名詞 phone/key，四項皆名詞 |
| a1-u10-l02-q12 | The ____ of these shoes is fifty dollars. | ★price／owner／item／store | ★price／change／item／store | 同課共用／交叉當正解 | owner 是 q13 正解，換 change |
| a1-u10-l02-q13 | Mr. Lin has a small shop. He is the ____. | card／price／order／★owner | card／waiter／order／★owner | 同課共用／交叉當正解 | price 是 q12 正解，換 waiter（人物名詞，靠詞義排除） |
| a1-u10-l03-q12 | Everything in this store is on ____ today. | dollar／shopping／★sale／rich | order／shopping／★sale／time | 同課共用／交叉當正解、混合詞性題放得進空格 | dollar 與 q13 共用換 order；rich 放不進 on ____ 換 time，兩個干擾項可放進空格 |
| a1-u10-l03-q13 | I don't have any money with me, but I have a ____. | dollar／sale／shopping／★credit card | dollar／store／bookstore／★credit card | 同課共用／交叉當正解、四選項同詞性 | sale 是 q12 正解、shopping 與 q12 共用，換 store/bookstore，四項皆可放進 I have a ____ |
| a1-u11-l01-q13 | Let's take the kids to the ____ to see the animals. | office／war／★zoo／building | town／cafe／★zoo／building | 同課共用／交叉當正解 | office/war 與 q14 共用，換 town/cafe（地點名詞，靠詞義排除） |
| a1-u11-l02-q13 | I put my money in the ____. | sign／street／★bank／officer | field／street／★bank／town | 同課共用／交叉當正解 | sign/officer 與 q14 共用，換 field/town（地點名詞） |
| a1-u11-l03-q13 | Turn left at the ____. | ★corner／peace／vote／farmer | ★corner／peace／vote／officer | 同課共用／交叉當正解 | farmer 是 q14 正解，換 officer |
| a1-u11-l04-q13 | I go to the ____ to read books for free. | factory／★library／palace／flag | hospital／★library／temple／bank | 同課共用／交叉當正解 | factory/flag 與 q14 共用、palace 是 q14 正解，換 hospital/temple/bank |
| a1-u12-l01-q13 | Excuse me, can you tell me the ____ to the bank? | ★way／jet／vacation／car | ★way／jet／airplane／car | 同課共用／交叉當正解 | vacation 是 q14 正解，換 airplane |
| a1-u12-l02-q13 | What time does the plane ____ in Taipei? | seat／★arrive／hotel／trip | stay／★arrive／visit／change | 同課共用／交叉當正解、四選項同詞性 | seat 與 q14 共用；兩題原都無四選項同詞性，改為四個動詞 stay/visit/change |
| a1-u12-l03-q13 | Can you ____ a horse? | driver／★ride／boat／bus | drive／★ride／boat／fly | 同課共用／交叉當正解、混合詞性題放得進空格 | driver 是 q14 正解換 drive，bus 換 fly，兩個動詞可放進空格 |
| a1-u12-l04-q12 | You must buy a ____ before you get on the train. | wheel／★ticket／sailor／holiday | truck／★ticket／sailor／holiday | 同課共用／交叉當正解 | wheel 是 q13 正解，換 truck |
| a1-u13-l01-q13 | I have a ____. I want to go to bed. | hand／health／face／★headache | body／health／face／★headache | 同課共用／交叉當正解 | hand 與 q14 共用，換 body |
| a1-u13-l02-q14 | My arm ____. I can't carry this box. | ★hurts／doctor／brain／shoulder | ★hurts／smells／lives／shoulder | 混合詞性題放得進空格 | 混合詞性題原無干擾項放得進 My arm ____，doctor/brain 換動詞 smells/lives |
| a1-u13-l03-q14 | My grandpa is very ____. He walks for an hour every day. | medicine／★healthy／bone／neck | handsome／★healthy／ugly／cute | 同課共用／交叉當正解、四選項同詞性 | medicine 是 q13 正解；改為四個形容詞 handsome/ugly/cute，靠詞義選 healthy |
| a1-u13-l04-q13 | I worked for ten hours. I am very ____. | ★tired／smoke／tooth／nurse | ★tired／healthy／pretty／young | 四選項同詞性 | 兩題原都沒有四選項同詞性，smoke/tooth/nurse 換形容詞 healthy/pretty/young |
| a1-u13-l04-q14 | Please open the window. I can't ____. | smoking／fever／★breathe／sick | exercise／fever／★breathe／drive | 混合詞性題放得進空格 | 混合詞性題原無干擾項放得進 I can't ____，smoking/sick 換動詞 exercise/drive |
| a1-u14-l01-q13 | What is your ____? I like to sing. | picnic／poster／drum／★hobby | name／poster／drum／★hobby | 同課共用／交叉當正解 | picnic 是 q14 正解，換 name |
| a1-u14-l01-q14 | Let's take some sandwiches and have a ____ in the park. | ★picnic／surf／hobby／baseball | ★picnic／surf／bath／baseball | 同課共用／交叉當正解 | hobby 是 q13 正解，換 bath |
| a1-u14-l02-q14 | Can you read me a ____ before bed? | team／game／★story／cinema | poster／game／★story／picnic | 同課共用／交叉當正解 | team 是 q13 正解、cinema 與 q13 共用，換 poster/picnic |
| a1-u14-l03-q13 | Our team played well and ____ the game. | ★won／music／picture／news | ★won／caught／spent／news | 同課共用／交叉當正解、混合詞性題放得進空格 | music 與 q14 共用、picture 是 q14 正解，換過去式動詞 caught/spent，兩個可放進空格 |
| a1-u14-l03-q14 | Look here! I want to take a ____ of you. | star／news／★picture／music | star／poster／★picture／story | 同課共用／交叉當正解、四選項同詞性 | news/music 與 q13 共用且不可數放不進 a ____，換可數名詞 poster/story |
| a1-u14-l04-q13 | Can you ____ a picture of your family? | throw／★draw／goal／stage | throw／★draw／goal／catch | 同課共用／交叉當正解、混合詞性題放得進空格 | stage 與 q14 共用，換動詞 catch，兩個干擾項可放進空格 |
| a1-u14-l05-q13 | We ____ the party very much. | ball／song／radio／★enjoy | win／song／play／★enjoy | 同課共用／交叉當正解、混合詞性題放得進空格 | radio 與 q14 共用；混合詞性題原無干擾項放得進空格，ball/radio 換動詞 win/play |
| a1-u14-l06-q13 | I read about the game in the ____. | coach／★newspaper／camp／fan | video／★newspaper／camp／song | 同課共用／交叉當正解 | coach 是 q14 正解、fan 與 q14 共用，換 video/song |
| a1-u15-l01-q13 | Take an umbrella. It is ____ today. | ★rainy／pet／tree／fire | ★rainy／sunny／snowy／fire | 同課共用／交叉當正解、混合詞性題放得進空格 | pet 是 q14 正解、tree 與 q14 共用，換形容詞 sunny/snowy，兩個可放進空格 |
| a1-u15-l01-q14 | A dog or a cat can be a good ____. | tree／fire／★pet／cloudy | tree／coach／★pet／driver | 同課共用／交叉當正解、四選項同詞性 | fire 與 q13 共用換 coach；cloudy 是形容詞放不進 a good ____ 換 driver，四項皆名詞 |
| a1-u15-l02-q14 | Put on your coat. It is ____ outside. | sea／hot／★cold／bird | sea／hot／★cold／sunny | 混合詞性題放得進空格 | 混合詞性題原只有 hot 放得進空格，bird 換 sunny |
| a1-u15-l03-q14 | It is not hot, and it is not cold. It is ____. | river／ice／★cool／horse | hot／cold／★cool／snowy | 同課共用／交叉當正解、四選項同詞性 | ice 是 q13 正解；改為四個形容詞 hot/cold/snowy，靠詞義選 cool |
| a1-u15-l04-q13 | The ____ is nice today. Let's go to the beach. | leaf／rain／bear／★weather | horse／rain／bear／★weather | 同課共用／交叉當正解 | leaf 與 q12 共用，換 horse |
| a1-u15-l05-q13 | We swim in the sea and play at the ____. | moon／★beach／cow／grass | hill／★beach／cow／stone | 同課共用／交叉當正解 | moon 與 q12 共用、grass 是 q12 正解，換 hill/stone |
| a1-u15-l06-q12 | A ____ has long ears and likes to jump. | lion／snake／★rabbit／bee | lion／bear／★rabbit／bee | 同課共用／交叉當正解 | snake 是 q13 正解，換 bear |
| a1-u15-l07-q13 | It is very ____. I can't see the other side of the street. | rose／★foggy／tiger／frog | cold／★foggy／sunny／cool | 同課共用／交叉當正解、四選項同詞性 | frog 與 q12 共用；兩題原都無四選項同詞性，改為四個形容詞 cold/sunny/cool |
| a1-u16-l01-q14 | Tom and I are in the same class. He is my ____. | ★classmate／homework／problem／school | ★classmate／homework／problem／player | 同課共用／交叉當正解 | school 與 q13 共用，換 player（人物名詞，靠詞義排除） |
| a1-u16-l02-q13 | I don't know this ____. What does it mean? | read／history／★word／learn | school／history／★word／student | 同課共用／交叉當正解、四選項同詞性 | history 與 q14 共用改由 q14 換掉；read/learn 是動詞放不進 this ____，換 school/student，四項皆名詞 |
| a1-u16-l02-q14 | Going to the beach is a good ____. | information／★idea／book／history | information／★idea／book／question | 同課共用／交叉當正解、混合詞性題放得進空格 | history 與 q13 共用，換 question；book、question 可放進 a good ____ |
| a1-u16-l03-q14 | Mr. Lin ____ English at our school. | paper／class／★teaches／result | eats／class／★teaches／underlines | 同課共用／交叉當正解、混合詞性題放得進空格 | result 與 q13 共用；混合詞性題原無干擾項放得進空格，paper/result 換動詞 reads/writes（實作端複核：reads、writes English 代入也說得通，改 eats、underlines——文法成立、詞義不通） |
| a1-u16-l04-q13 | I write a ____ to my friend in Japan. | rule／★letter／board／subject | rule／★letter／class／course | 同課共用／交叉當正解 | board 是 q14 正解、subject 與 q14 共用，換 class/course |
| a1-u16-l05-q13 | For ____, apples and bananas are fruit. | ★example／list／science／page | ★example／word／science／page | 同課共用／交叉當正解 | list 與 q14 的 lists 同字共用，換 word |
| a1-u16-l06-q14 | Before the test, we have a ____ of all the lessons. | scientist／writer／★review／conversation | scientist／letter／★review／conversation | 同課共用／交叉當正解 | writer 是 q13 正解，換 letter |
| a1-u16-l07-q12 | Students sit at their ____ in the classroom. | grades／topics／copies／★desks | grades／tests／boards／★desks | 同課共用／交叉當正解 | topics 是 q13 正解、copies 與 q13 共用，換 tests/boards |
| a1-u16-l07-q13 | Today's ____ is music. Let's talk about it. | copy／file／★topic／desk | copy／file／★topic／rule | 同課共用／交叉當正解 | desk 是 q12 正解，換 rule |
| a1-u16-l08-q12 | The ____ of four and six is ten. | pen／★sum／sentence／suggestion | list／★sum／sentence／question | 同課共用／交叉當正解 | pen 與 q13 共用改 list；suggestion 是 q13 正解改 question |
| a1-u16-l08-q13 | Thank you for your ____. It is a good idea. | sum／math／pen／★suggestion | desk／math／pen／★suggestion | 同課共用／交叉當正解 | sum 是 q12 正解改 desk；pen 留本題、q12 改掉 |
| a1-u16-l09-q12 | How do you ____ your last name? | pencil／ruler／★spell／paragraph | pencil／copy／★spell／underline | 同課共用／交叉當正解、混合詞性題放得進空格 | ruler 是 q13 正解、paragraph 與 q13 共用，改動詞 copy、underline，使兩個干擾項能放進動詞空格 |
| a1-u17-l01-q14 | I don't ____ his phone number. | make／come／go／★know | make／take／go／★know | 同課共用／交叉當正解 | come 是 q15 正解改 take |
| a1-u17-l01-q15 | Can you ____ to my house for dinner? | ★come／know／think／say | ★come／see／think／say | 同課共用／交叉當正解 | know 是 q14 正解改 see |
| a1-u17-l02-q14 | Please ____ me your name again. | want／look／find／★tell | want／look／ask／★tell | 同課共用／交叉當正解 | find 是 q15 正解改 ask |
| a1-u17-l02-q15 | I can't ____ my glasses. Where are they? | tell／give／★find／call | try／give／★find／call | 同課共用／交叉當正解 | tell 是 q14 正解改 try |
| a1-u17-l04-q13 | ____ left at the corner. | ★Turn／Hear／Start／Hold | ★Turn／Show／Point／Call | 同課共用／交叉當正解 | Start 是 q14 正解、Hear／Hold 與 q14 共用，改 Show、Point、Call（避開 Look／Keep 等也通的字） |
| a1-u17-l04-q14 | The movie ____ at nine. Don't be late. | holds／hears／turns／★starts | holds／hears／moves／★starts | 同課共用／交叉當正解 | turns 是 q13 正解改 moves |
| a1-u17-l05-q14 | Turn right at the ____ of this street. | happen／set／watch／★end | stand／stop／point／★end | 同課共用／交叉當正解、混合詞性題放得進空格 | happen、watch 與 q13 共用且動詞放不進名詞空格，三個干擾項改名詞 stand、stop、point |
| a1-u17-l06-q14 | I can't ____ where I put my keys. | build／open／speak／★remember | plan／open／speak／★remember | 同課共用／交叉當正解 | build 與 q13 共用改 plan |
| a1-u18-l01-q13 | I ____ sick today. I want to stay in bed. | hope／believe／★feel／memory | like／believe／★feel／memory | 同課共用／交叉當正解 | hope 是 q14 正解改 like；believe 留本題、q14 改掉 |
| a1-u18-l01-q14 | Where there is life, there is ____. | ★hope／character／happy／believe | ★hope／character／money／music | 同課共用／交叉當正解、四選項同詞性 | believe 與 q13 共用、happy 放不進空格，改名詞 money、music，使本題四選項同為名詞 |
| a1-u18-l02-q12 | I am ____ in history. I read history books every day. | interesting／★interested／alone／worry | interesting／★interested／alone／happy | 同課共用／交叉當正解 | worry 與 q13 共用改形容詞 happy；alone 留本題 |
| a1-u18-l02-q13 | My ____ is to become a singer one day. | ★dream／smile／worry／alone | ★dream／smile／worry／memory | 同課共用／交叉當正解、四選項同詞性 | alone 與 q12 共用改名詞 memory，四選項同為名詞 |
| a1-u18-l03-q12 | My dog is ____ of cats. | funny／angry／★afraid／smart | funny／angry／★afraid／happy | 同課共用／交叉當正解 | smart 是 q13 正解改 happy |
| a1-u18-l03-q13 | He is very ____. He always gets good grades. | pleasure／★smart／cry／surprise | interested／★smart／alone／surprise | 混合詞性題放得進空格 | pleasure、cry 為名詞放不進 very ____，改形容詞 interested、alone，使兩個干擾項文法成立 |
| a1-u18-l04-q12 | The children are very ____ about the party tomorrow. | lucky／exciting／★excited／luck | lovely／exciting／★excited／funny | 同課共用／交叉當正解 | lucky 是 q13 正解改 lovely；luck 與 q13 共用改 funny |
| a1-u18-l04-q13 | I found ten dollars on the street. I am very ____! | luck／★lucky／sad／exciting | angry／★lucky／sad／interested | 同課共用／交叉當正解、四選項同詞性 | luck、exciting 與 q12 共用，改形容詞 angry、interested，四選項同為形容詞 |
| a1-u18-l05-q13 | Our coach is very ____. We must be on time. | lazy／shy／lonely／★strict | funny／sad／clever／★strict | 同課共用／交叉當正解 | lazy、shy、lonely 三字皆與 q12 共用，改 funny、sad、clever |
| a1-u19-l01-q13 | ____ are you sad? Tell me. | Much／★Why／Most／Too | Really／★Why／How／Very | 同課共用／交叉當正解 | Much、Most、Too 皆與 q14 共用，改副詞 Really、How、Very（How 文法可放入，避開也通的 When） |
| a1-u19-l02-q14 | I brush my teeth ____ I go to bed. | must／every／same／★before | where／every／same／★before | 同課共用／交叉當正解 | must 是 q13 正解改連接詞 where（文法可放入、靠詞義排除） |
| a1-u19-l03-q13 | Are you ready? Not ____. | ★yet／both／around／under | ★yet／off／around／under | 同課共用／交叉當正解 | both 是 q14 正解改 off（避開 really 也通） |
| a1-u19-l04-q13 | It is ____ seven. Let's go home. | ★almost／nothing／anything／someone | ★almost／behind／between／under | 同課共用／交叉當正解 | nothing、anything、someone 與 q14 共用，改 behind、between、under（避開 already、around、maybe 也通） |
| a1-u19-l04-q14 | I don't want ____ now. I am not hungry. | nothing／★anything／someone／behind | nothing／★anything／someone／already | 同課共用／交叉當正解 | behind 移給 q13，本題改 already |
| a1-u19-l05-q13 | ____ book is this? Is it yours? | Else／Either／Anyone／★Whose | Each／Either／Anyone／★Whose | 同課共用／交叉當正解 | Else 是 q14 正解改 Each（避開 What 也通） |
| a1-u19-l07-q13 | Is this umbrella ____? No, it is not mine. | beside／below／★yours／everywhere | above／below／★yours／everywhere | 同課共用／交叉當正解 | beside 是 q14 正解改 above |
| a1-u19-l08-q13 | ____ your brother play the guitar? | ★Does／Are／Do／An | ★Does／Are／Do／Am | 同課共用／交叉當正解 | An 是 q14 正解改 Am（避開 Did 也通）；Are 留本題 |
| a1-u19-l08-q14 | I want to eat ____ orange. | are／★an／did／does | a／★an／much／each | 同課共用／交叉當正解 | are 與 q13 共用改 a（a／an 辨析）；does 是 q13 正解改 each；did 與 q13 Does／Do 同詞元改 much |
| a1-u19-l09-q14 | The two friends often help ____. | has／★each other／was／doing | ours／★each other／mine／doing | 同課共用／交叉當正解、混合詞性題放得進空格 | has 與 q13 共用、was 是 q13 正解，改代名詞 ours、mine，可放進受詞位置 |
| a1-u20-l01-q13 | I was at home ____. | due／★yesterday／twelve／March | soon／★yesterday／twelve／always | 同課共用／交叉當正解、混合詞性題放得進空格 | due 是 q14 正解、March 與 q14 共用，改副詞 soon、always，使兩個干擾項文法可放入（避開 then、early 也通） |
| a1-u20-l01-q14 | The library book is ____ on Monday. | yesterday／fifty／★due／March | expensive／open／★due／new | 同課共用／交叉當正解、四選項同詞性 | yesterday 是 q13 正解、March 與 q13 共用，改形容詞 expensive、open、new，四選項同為形容詞 |
| a1-u20-l02-q14 | Spring, summer, ____, and winter. | ★autumn／eighteen／thirteen／sixteen | ★autumn／evening／thirteen／March | 一眼排除 | 三個數字干擾項與四季列舉明顯無關，eighteen、sixteen 改時間名詞 evening、March |
| a1-u20-l03-q13 | My grandpa is very old. He is ____. | seventeen／★eighty／nineteen／August | seventeen／★eighty／nineteen／twelve | 同課共用／交叉當正解 | August 與 q14 共用改 twelve（避開 seventy、ninety 也算很老） |
| a1-u20-l03-q14 | The month after March is ____. | ★April／August／eighty／ninety | ★April／August／autumn／ninety | 同課共用／交叉當正解、混合詞性題放得進空格 | eighty 是 q13 正解改 autumn，使兩個干擾項可放入空格 |
| a1-u20-l04-q14 | The first month of the year is ____. | December／February／★January／Monday | December／February／★January／November | 同課共用／交叉當正解 | Monday 與 q13 共用改 November |
| a1-u20-l05-q13 | The day after Saturday is ____. | ★Sunday／Tuesday／October／September | ★Sunday／Tuesday／October／December | 同課共用／交叉當正解 | September 是 q14 正解改 December |
| a1-u21-l01-q13 | Wait a minute. I am not ____ yet. | left／★ready／size／blue | left／★ready／nice／blue | 同課共用／交叉當正解 | size 是 q14 正解改 nice |
| a1-u21-l01-q14 | Do you have this shirt in a bigger ____? | ★size／dark／green／nice | ★size／color／green／room | 同課共用／交叉當正解、混合詞性題放得進空格 | nice 移給 q13；dark、nice 為形容詞放不進名詞空格，改 color、room，四選項同為名詞 |
| a1-u21-l02-q13 | I can't carry this bag. It is too ____. | living／fast／gold／★heavy | bright／fast／dark／★heavy | 同課共用／交叉當正解 | living 與 q14 共用改 bright，gold 改 dark；fast 留本題 |
| a1-u21-l02-q14 | Open the ____ door. Someone is there. | fast／★front／living／quickly | gold／★front／living／quickly | 同課共用／交叉當正解 | fast 與 q13 共用改 gold |
| a1-u21-l03-q13 | Read the ____ sentences and answer the questions. | circle／fair／★following／pair | warm／fair／★following／heavy | 同課共用／交叉當正解 | circle 與 q14 共用、pair 是 q14 正解，改形容詞 warm、heavy，四選項同為形容詞 |
| a1-u21-l04-q13 | It is not raining now. The ground is ____. | straight／slow／★dry／yellow | strange／slow／★dry／yellow | 同課共用／交叉當正解 | straight 是 q14 正解改 strange |
| a1-u21-l04-q14 | Go ____ for two blocks. | strange／thick／thin／★straight | clean／thick／thin／★straight | 同課共用／交叉當正解 | strange 移給 q13，本題改 clean（避開 slow 也通） |
| a1-u21-l05-q13 | Choose true or ____. | correct／★false／pink／row | terrible／★false／fair／row | 同課共用／交叉當正解、混合詞性題放得進空格 | correct 是 q14 正解、pink 與 q14 共用，改形容詞 terrible、fair；row 留本題 |
| a1-u21-l05-q14 | Three and four is eight. That is not ____. | ★correct／pink／row／gray | ★correct／pink／brown／gray | 同課共用／交叉當正解、四選項同詞性 | row 與 q13 共用且放不進空格，改形容詞 brown，四選項同為形容詞（避開 excellent 也通） |
| a1-u21-l06-q13 | Don't use that cup. It is ____. | blank／★dirty／super／tight | orange／★dirty／super／tight | 同課共用／交叉當正解 | blank 是 q14 正解改 orange（避開 broken 也通）；tight 留本題 |
| a1-u21-l06-q14 | Start on a ____ page. | orange／closed／★blank／tight | purple／closed／★blank／broken | 同課共用／交叉當正解、四選項同詞性 | tight 與 q13 共用改 broken；orange 搭 a 會洩題，改 purple（避開 clean 也通） |
| a1-u22-l01-q14 | I ____ toy cars. I have fifty of them. | actor／photo／famous／★collect | paint／photo／wash／★collect | 同課共用／交叉當正解、混合詞性題放得進空格 | actor 是 q13 正解改動詞 paint，famous 放不進動詞空格改 wash，使兩個干擾項文法成立 |
| a1-u22-l03-q13 | This singer has a new ____ with ten songs. | poem／toy／★album／drama | poem／toy／★album／photo | 同課共用／交叉當正解 | drama 與 q14 共用改 photo |
| a1-u22-l04-q14 | In baseball, players use a ____. | ★bat／guitar／ghost／contest | ★bat／guitar／piano／contest | 同課共用／交叉當正解 | ghost 與 q13 共用改 piano |
| a1-u22-l05-q13 | The king's son is a ____. | cartoon／doll／opera／★prince | concert／doll／opera／★prince | 同課共用／交叉當正解 | cartoon 是 q12 正解改 concert（避開 actor、singer、musician 也通） |
| a1-u22-l06-q12 | The wind is strong today. Let's fly a ____. | DVD／fairy／princess／★kite | ghost／fairy／princess／★kite | 同課共用／交叉當正解 | DVD 是 q13 正解改 ghost；fairy、princess 留本題 |
| a1-u22-l06-q13 | You can watch this movie on ____. | ★DVD／kite／fairy／princess | ★DVD／photo／album／festival | 同課共用／交叉當正解 | kite 是 q12 正解、fairy／princess 與 q12 共用，改 photo、album、festival |
| a1-u23-l01-q13 | Can I ____ your club? | action／mind／★join／care | action／mind／★join／break | 同課共用／交叉當正解、混合詞性題放得進空格 | care 與 q14 共用改動詞 break，使 mind、break 兩個干擾項文法可放入 |
| a1-u23-l01-q14 | My bag is heavy. Can you help me ____ it? | ★carry／mind／action／care | ★carry／cut／kill／care | 同課共用／交叉當正解、四選項同詞性 | mind、action 與 q13 共用，改動詞 cut、kill；care 留本題 |
| a1-u23-l02-q14 | You can ____ one cake from the box. | agree／★choose／practice／activity | break／★choose／practice／activity | 同課共用／交叉當正解 | agree 是 q13 正解改 break（避開 pick、carry 也通） |
| a1-u23-l03-q14 | I can't ____ on my homework. My brother is playing music. | drop／fill／push／★focus | listen／fight／agree／★focus | 同課共用／交叉當正解 | drop、fill、push 三字皆與 q13 共用，改 listen、fight、agree |
| a1-u23-l04-q13 | ____ you can fly. Where do you want to go? | Laugh／Finish／★Imagine／Check | Forget／Shake／★Imagine／Discuss | 同課共用／交叉當正解 | Laugh 與 q14 共用、Check 是 q14 正解，改 Forget、Discuss；Finish 讓給 q14 改 Shake |
| a1-u23-l04-q14 | Waiter, can we have the ____, please? We want to pay. | guess／★check／laugh／imagine | guess／★check／laugh／finish | 同課共用／交叉當正解 | imagine 是 q13 正解改 finish（避開 shake 可指奶昔也通） |
| a1-u23-l05-q13 | The children ____ behind the door. Can you find them? | blow／★hide／judge／feed | jump／★hide／judge／feed | 同課共用／交叉當正解 | blow 是 q14 正解改 jump；judge 留本題 |
| a1-u23-l05-q14 | The wind ____ the leaves around the yard. | judges／hides／★blows／climbs | kills／fills／★blows／climbs | 同課共用／交叉當正解 | hides 是 q13 正解、judges 與 q13 共用，改 kills、fills（避開 carries、pushes 也通） |
| a1-u23-l06-q13 | Can I ____ your umbrella? I will give it back tomorrow. | pray／solve／★borrow／dig | fill／cover／★borrow／dig | 同課共用／交叉當正解 | solve 是 q14 正解改 cover，pray 與 q14 共用改 fill；dig 留本題 |
| a1-u23-l06-q14 | This math problem is hard. Can you ____ it? | ★solve／ring／pray／dig | ★solve／ring／feed／push | 同課共用／交叉當正解 | pray、dig 與 q13 共用，改 feed、push（避開 check、guess 也通） |
| a2-u01-l01-q14 | Please don't use your phone ____ the movie. | without／against／★during／across | without／behind／★during／above | 同課共用／交叉當正解、用字範圍 | against 是 q15 正解改 behind；across 超範圍改 above |
| a2-u01-l01-q15 | We played ____ a very strong team last Sunday. | ★against／during／might／while | ★against／beside／near／while | 同課共用／交叉當正解、混合詞性題放得進空格 | during 是 q14 正解改 beside；might 放不進空格改 near，使兩個干擾項文法成立 |
| a2-u01-l02-q14 | The food was good. ____, it was too expensive. | Therefore／Instead／Besides／★However | Usually／Also／Besides／★However | 用字範圍 | Therefore、Instead 超範圍，改 Usually、Also（皆副詞，可放句首） |
| a2-u01-l03-q13 | Look! A big dog is running ____ us. | during／since／till／★toward | among／without／against／★toward | 用字範圍、同課共用／交叉當正解、四選項同詞性 | till 超範圍；since 改給 q14 用；during 放不進 running ___ us；三者改本單元介系詞 among、without、against |
| a2-u01-l03-q14 | ____ he was tired, he still finished his homework. | Actually／★Although／Perhaps／Yeah | Actually／★Although／Because／Since | 混合詞性題放得進空格 | Perhaps、Yeah 是副詞放不進子句前，改連接詞 Because、Since（文法成立，語意與 still 衝突） |
| a2-u01-l04-q13 | She is the best player on our team, so she will ____ win. | hardly／★certainly／nearly／especially | never／★certainly／almost／especially | 用字範圍 | hardly、nearly 超範圍，改 never、almost |
| a2-u01-l05-q13 | There was no rice, so we ate bread ____. | forward／ahead／apart／★instead | forward／later／alone／★instead | 用字範圍 | ahead、apart 超範圍，改 later、alone |
| a2-u01-l05-q14 | Is ____ sitting in this seat? | exactly／★somebody／rather／herself | everyone／★somebody／nothing／herself | 混合詞性題放得進空格 | exactly、rather 放不進 Is ___ sitting，改代名詞 everyone、nothing（文法成立，靠語意排除） |
| a2-u01-l06-q13 | ____ came to the meeting, so we went home. | ★Nobody／Whom／Hey／Mostly | ★Nobody／Whom／All／Somebody | 同課共用／交叉當正解、混合詞性題放得進空格 | Mostly 與 q14 共用改 Somebody；Hey 放不進主詞位改 All，使兩個干擾項文法成立 |
| a2-u01-l07-q13 | I was so tired that I could ____ walk. | easily／★hardly／quickly／truly | possibly／★hardly／still／truly | 用字範圍、跨課重複 | easily 超範圍改本單元 possibly；quickly 他課已用改 still |
| a2-u01-l07-q14 | We cooked the whole dinner ____. | anymore／himself／★ourselves／except | somewhere／himself／★ourselves／except | 混合詞性題放得進空格 | anymore 放不進句尾，改本單元 somewhere（文法成立，靠語意排除） |
| a2-u01-l08-q14 | We can stay here ____ Sunday. | elsewhere／★till／latter／shall | beyond／★till／latter／during | 同課共用／交叉當正解、混合詞性題放得進空格 | elsewhere 是 q13 正解改 beyond；shall 放不進空格改 during，使兩個干擾項文法成立 |
| a2-u01-l09-q13 | I'm almost ____ with my work. | ★done／further／theirs／been | ★done／further／alright／been | 混合詞性題放得進空格 | theirs 放不進 I am almost ___，改本單元形容詞 alright |
| a2-u02-l01-q14 | Let me check the train ____ before we go. | midnight／★timetable／weekday／lunchtime | calendar／★timetable／weekday／lunchtime | 同課共用／交叉當正解 | midnight 與 q13 共用，改本單元 calendar |
| a2-u02-l02-q13 | Have you seen any good movies ____? | final／recent／regular／★recently | finally／recent／again／★recently | 混合詞性題放得進空格 | final、regular 是形容詞放不進句尾，改副詞 finally、again |
| a2-u02-l03-q12 | Because of the heavy rain, there was a two-hour ____. | gradually／★delay／sudden／daily | schedule／★delay／final／daily | 同課共用／交叉當正解、混合詞性題放得進空格 | gradually 與 q13 共用改 schedule；sudden 放不進 a two-hour ___ 改名詞 final，使兩個干擾項文法成立 |
| a2-u03-l01-q13 | It's cold today. Wear your ____ hat. | convenience／★wool／silently／correctly | convenience／★wool／automatic／correctly | 混合詞性題放得進空格 | silently 放不進 your ___ hat，改形容詞 automatic |
| a2-u03-l01-q14 | You don't need to bring food. It's ____. | automatic／colorful／noisy／★unnecessary | important／colorful／sunny／★unnecessary | 用字範圍、同課共用／交叉當正解 | noisy 超範圍改 sunny；automatic 讓給 q13 用，改 important |
| a2-u03-l02-q13 | Please speak more ____. I can't hear you. | ★loudly／quietly／silently／smoothly | ★loudly／correctly／silently／smoothly | 用字範圍 | quietly 超範圍，改本單元 correctly |
| a2-u03-l03-q13 | Paper is a cheap ____. | private／★material／single／image | system／★material／model／image | 同課共用／交叉當正解 | private、single 與 q14 共用，改本單元名詞 system、model |
| a2-u03-l04-q14 | I can't read your writing. Please write more ____. | ★clearly／simple／similar／quality | ★clearly／simple／smoothly／loudly | 同課共用／交叉當正解、混合詞性題放得進空格 | similar 與 q13 共用改 smoothly；quality 放不進 write more ___ 改副詞 loudly，使兩個干擾項文法成立 |
| a2-u03-l06-q13 | Keep your money in a ____ place. | ★safe／fresh／dangerous／noisy | ★safe／fresh／popular／noisy | 用字範圍 | dangerous 超範圍，改本單元形容詞 popular |
| a2-u03-l06-q14 | The ____ plan was to go by train, but we drove instead. | fresh／feature／easily／★original | complete／feature／modern／★original | 同課共用／交叉當正解、混合詞性題放得進空格 | fresh 與 q13 共用改 complete；easily 放不進 The ___ plan 改形容詞 modern |
| a2-u03-l07-q13 | Everything is ____ today. Nothing strange happened. | slowly／★normal／sample／wood | quick／★normal／noisy／wood | 混合詞性題放得進空格 | slowly、sample 放不進 Everything is ___，改本單元形容詞 quick、noisy |
| a2-u03-l07-q14 | My grandfather swims every day, so he is very ____. | ★fit／soft／normal／slow | ★fit／soft／popular／slow | 同課共用／交叉當正解 | normal 是 q13 正解，改本單元 popular |
| a2-u03-l08-q13 | Don't play near the busy road. It's ____. | plastic／★dangerous／familiar／importance | plastic／★dangerous／familiar／appropriate | 同課共用／交叉當正解 | importance 是 q14 正解，改本課形容詞 appropriate |
| a2-u04-l01-q14 | Smoking is ____ in this building. | seemed／quit／spilled／★forbidden | seemed／taught／ordered／★forbidden | 同課共用／交叉當正解 | quit、spilled 與 q13 共用，改過去分詞 taught、ordered |
| a2-u04-l02-q14 | He ____ to help me with my bags. | included／understood／★offered／created | seemed／understood／★offered／quit | 同課共用／交叉當正解 | included、created 與 q13 共用，改本單元 seemed、quit（可接不定詞，靠語意排除） |
| a2-u04-l03-q14 | I'll ____ you a message when I get home. | ★send／appear／remain／expect | ★send／draw／throw／expect | 同課共用／交叉當正解 | appear、remain 與 q13 共用，改可接雙受詞的 draw、throw |
| a2-u04-l04-q13 | Can you ____ me the salt, please? | record／pull／★pass／raise | send／allow／★pass／spill | 同課共用／交叉當正解 | record、raise 與 q14 共用、pull 是 q14 正解，改本單元 send、allow、spill |
| a2-u04-l05-q13 | Our plane will ____ in Taipei in one hour. | seek／★land／produce／represent | fall／★land／produce／continue | 同課共用／交叉當正解 | seek 與 q14 共用、represent 是 q14 正解，改本單元 fall、continue |
| a2-u04-l05-q14 | Each color on this map ____ a different country. | hits／seeks／lands／★represents | hits／seeks／pulls／★represents | 同課共用／交叉當正解 | lands 是 q13 正解，改本單元 pulls |
| a2-u04-l06-q13 | You must have a ticket to ____ the museum. | lie／success／fail／★enter | lie／prepare／fail／★enter | 同課共用／交叉當正解、混合詞性題放得進空格 | success 是 q14 正解，改本課動詞 prepare |
| a2-u04-l06-q14 | The new cafe was a great ____. It was full every day. | mistake／problem／★success／danger | effort／problem／★success／danger | 用字範圍 | mistake 超範圍，改本單元名詞 effort |
| a2-u04-l08-q13 | The windows ____ the sunlight. | remember／discover／★reflect／forget | remember／discover／★reflect／avoid | 跨課重複 | forget 為非本單元字且他課已用，改本單元 avoid |
| a2-u04-l09-q13 | The old TV doesn't work. We should ____ it. | achieve／encourage／admire／★replace | achieve／encourage／reveal／★replace | 用字範圍 | admire 超範圍，改本單元 reveal |
| a2-u04-l09-q14 | Please ____ to the map on page five. | roll／handle／attempt／★refer | roll／listen／attempt／★refer | 混合詞性題放得進空格 | handle 放不進 Please ___ to，改不及物動詞 listen，使 roll、listen 兩個干擾項文法成立 |
| a2-u05-l01-q13 | Today is our tenth wedding ____. | reunion／generation／member／★anniversary | reunion／birthday／member／★anniversary | 同課共用／交叉當正解 | generation 是 q14 正解改 birthday；reunion 保留（q14 改掉 reunions） |
| a2-u05-l01-q14 | My grandparents, my parents and I are three different ____. | ★generations／anniversaries／reunions／juniors | ★generations／classmates／adults／juniors | 同課共用／交叉當正解 | anniversaries 是 q13 正解改 classmates；reunions 與 q13 共用改 adults |
| a2-u05-l02-q13 | My parents got ____ in 1990. | female／crowd／★married／youth | sick／crowd／★married／hurt | 混合詞性題放得進空格 | female、youth 放不進 got ___，改 sick、hurt（文法成立，靠語意排除） |
| a2-u05-l02-q14 | Thank you for ____ me. I'd love to come to your wedding. | marrying／★inviting／forgetting／losing | checking／★inviting／following／pushing | 跨課重複、同課共用／交叉當正解 | forget、lose 為非本單元字且他課已用，改 following、pushing；marrying 與 q13 正解 married 同字，改 checking |
| a2-u05-l03-q13 | There are special seats for ____ people on the bus. | married／rich／★elderly／teenage | married／poor／★elderly／junior | 用字範圍、跨課重複 | teenage 超範圍改本單元 junior；rich 他課已用改 poor |
| a2-u05-l04-q13 | The bus was so ____ that I couldn't find a seat. | empty／quiet／★crowded／clean | cold／quiet／★crowded／clean | 用字範圍 | empty 超範圍，改 cold（文法成立，與找不到位子無因果） |
| a2-u05-l05-q13 | This course is for people ____ sixty and over. | ★aged／orphan／granny／penfriend | ★aged／called／from／granddad | 同課共用／交叉當正解、混合詞性題放得進空格 | orphan 與 q14 正解同字、granny、penfriend 與 q14 共用；改 around、from（可放進 people ___ sixty）與本單元 granddad（實作端複核：people around sixty and over 也說得通，around 改 called） |
| a2-u06-l01-q13 | He always says please and thank you. He is very ____. | creativity／★polite／unpleasant／fortunately | creativity／★polite／unpleasant／uncomfortable | 同課共用／交叉當正解、混合詞性題放得進空格 | fortunately 是 q14 正解，改本課形容詞 uncomfortable，使兩個干擾項文法成立 |
| a2-u06-l01-q14 | I lost my wallet. ____, a kind man found it and gave it back. | Unfortunately／Silently／Correctly／★Fortunately | Certainly／Silently／Correctly／★Fortunately | 用字範圍 | Unfortunately 超範圍，改副詞 Certainly |
| a2-u06-l02-q13 | The noise from the street really ____ me. I can't sleep. | pleases／★annoys／helps／relaxes | pleases／★annoys／helps／cheers | 用字範圍 | relaxes 超範圍，改本單元 cheers |
| a2-u06-l03-q13 | My little brother is ____ about cars. | intelligence／comfortable／★crazy／manner | impatient／comfortable／★crazy／manner | 混合詞性題放得進空格 | intelligence 放不進 is ___ about，改形容詞 impatient，使兩個干擾項文法成立 |
| a2-u06-l03-q14 | Thank you so much. I really ____ it. | hate／★appreciate／avoid／lose | hate／★appreciate／avoid／fear | 跨課重複 | lose 為非本單元字且他課已用，改本單元 fear |
| a2-u06-l04-q13 | Nobody thought he could win, so everyone was ____ when he won. | bored／sleepy／hungry／★surprised | creative／polite／hungry／★surprised | 用字範圍 | bored、sleepy 超範圍，改本單元 creative、polite |
| a2-u06-l05-q14 | She felt great ____ when her son finished school. | surprising／mood／nervous／★pride | difficulty／mood／shock／★pride | 同課共用／交叉當正解、混合詞性題放得進空格 | surprising、nervous 與 q13 共用，改本單元名詞 difficulty、shock，使干擾項放得進 felt great ___ |
| a2-u06-l06-q13 | I was ____ by his English. It was very good. | wisdom／joy／★impressed／helpful | annoyed／hated／★impressed／helpful | 混合詞性題放得進空格 | wisdom、joy 放不進 I was ___ by，改本單元過去分詞 annoyed、hated（文法成立，靠語意排除） |
| a2-u06-l06-q14 | After a long day at work, I like to ____ in a hot bath. | work／run／dance／★relax | work／run／study／★relax | 跨課重複 | dance 為非本單元字且他課已用，改 study |
| a2-u06-l07-q13 | Don't be ____. Everything will be fine. | ★worried／wise／romantic／admire | ★worried／wise／romantic／gentle | 同課共用／交叉當正解 | admire 是 q14 正解，改本課形容詞 gentle |
| a2-u07-l01-q12 | It's raining. Put on your ____. | comb／★raincoat／diamond／sock | sweater／★raincoat／diamond／sock | 同課共用／交叉當正解 | comb 是 q13 正解，改本課 sweater |
| a2-u07-l01-q13 | Can I borrow your ____? I want to brush my hair. | ★comb／glove／scarf／raincoat | ★comb／glove／scarf／umbrella | 同課共用／交叉當正解 | raincoat 是 q12 正解，改 umbrella |
| a2-u07-l03-q12 | It's very sunny. Put on your ____. | shampoo／raincoat／★sunglasses／toothbrush | shampoo／raincoat／★sunglasses／sweater | 用字範圍 | toothbrush 超範圍，改本單元 sweater |
| a2-u07-l03-q13 | She wears a little ____ when she goes out. It smells nice. | ★perfume／earring／bra／sunglasses | ★perfume／earring／bra／diamond | 同課共用／交叉當正解 | sunglasses 是 q12 正解，改本單元 diamond |
| a2-u08-l01-q14 | The cake is still in the ____. It needs ten more minutes. | battery／lamp／★oven／elevator | basket／lamp／★oven／elevator | 同課共用／交叉當正解 | battery 是 q15 正解，改本課 basket |
| a2-u08-l02-q15 | My room is ____, on the second floor. | ★upstairs／drawer／sew／bulb | ★upstairs／outside／downstairs／bulb | 混合詞性題放得進空格 | drawer、sew 放不進 My room is ___，改 outside、本課 downstairs（文法成立，與二樓／樓上語意衝突） |
| a2-u08-l03-q14 | Can you help me ____ my desk? I can't find anything. | mirror／★tidy／gate／apartment | drill／★tidy／carry／apartment | 混合詞性題放得進空格 | mirror、gate 放不進 help me ___ my desk，改動詞 drill、carry（文法成立，與找不到東西語意不合） |
| a2-u08-l04-q14 | The bathroom ____ is full of dirty water. | electric／furniture／★sink／lock | electric／furniture／★sink／mirror | 同課共用／交叉當正解 | lock 是 q13 正解，改本單元 mirror |
| a2-u08-l05-q13 | I heard the ____ ring at six and got up. | cupboard／stove／screw／★alarm | cupboard／fridge／screw／★alarm | 同課共用／交叉當正解 | stove 是 q14 正解，改本課 fridge |
| a2-u09-l01-q13 | She was so tired that she fell ____ on the bus. | ★asleep／sleepy／bonus／clerk | ★asleep／sleepy／awake／clerk | 同課共用／交叉當正解、混合詞性題放得進空格 | bonus 與 q14 共用，改形容詞 awake（fell ___ 靠搭配排除） |
| a2-u09-l02-q13 | Hi, where is the ____? I need to check in. | labor／★receptionist／training／fisherman | bonus／★receptionist／training／captain | 同課共用／交叉當正解、用字範圍 | labor 與 q14 共用改 bonus；fisherman 為 a2-u09-l04 超範圍改 captain |
| a2-u09-l02-q14 | She works hard and ____ a lot of money. | ★earns／labor／staff／manager | ★earns／sells／buys／manager | 同課共用／交叉當正解、混合詞性題放得進空格 | labor 與 q13 共用且原本無干擾項放得進動詞空格，labor 改 sells、staff 改 buys（能代入、靠搭配排除） |
| a2-u09-l03-q13 | He is sixty-five and tired of working, so he wants to ____. | work／train／★retire／hurry | earn／train／★retire／hurry | 跨課重複 | work 已在他課當非本單元干擾項，改本單元字 earn |
| a2-u09-l04-q13 | Yesterday I read my old ____ from when I was ten. | ★diary／barber／hunter／pro | ★diary／barber／hunter／boss | 同課共用／交叉當正解 | pro 是 q14 正解不可當干擾項，改本單元字 boss |
| a2-u09-l04-q14 | He's not a beginner. He plays like a ____. | diary／★pro／retired／sleepless | clerk／★pro／manager／secretary | 同課共用／交叉當正解、混合詞性題放得進空格 | diary 是 q13 正解改 clerk；retired、sleepless 為形容詞放不進 a ____，改 manager、secretary 成四選項同詞性 |
| a2-u10-l01-q14 | I like to ____ cookies for my friends. | chef／★bake／pepper／pasta | drink／★bake／pepper／spill | 混合詞性題放得進空格 | chef、pasta 為名詞放不進 to ____ 動詞空格，改 drink、spill（能代入、靠搭配排除） |
| a2-u10-l02-q13 | Do you want some ____ on your toast? | ★jam／cafeteria／cooler／snack | ★jam／dessert／pasta／snack | 同課共用／交叉當正解 | cafeteria 是 q14 正解改 dessert；cooler 與 q14 共用改 pasta |
| a2-u10-l03-q13 | I'm so ____. Can I have a glass of water? | sleepy／★thirsty／angry／rich | happy／★thirsty／angry／sad | 跨課重複 | sleepy、rich 已在他課當非本單元干擾項，改 happy、sad（仍為形容詞，靠詞義排除） |
| a2-u10-l03-q14 | Do you want some tomato ____ on your pasta? | thirsty／diet／beer／★sauce | plate／diet／beer／★sauce | 同課共用／交叉當正解 | thirsty 是 q13 正解，改本單元名詞 plate，四選項同為名詞 |
| a2-u10-l04-q14 | Add two ____ of sugar to the cake. | raw／★tablespoons／lemon／honey | pans／★tablespoons／plates／forks | 同課共用／交叉當正解、混合詞性題放得進空格 | honey 與 q13 共用；raw 為形容詞、lemon／honey 單數不可數放不進 two ____ of，改複數名詞 pans、plates、forks，只能靠詞義排除 |
| a2-u10-l05-q14 | ____ the water before you make the tea. | Slice／★Boil／Soda／Cooking | Slice／★Boil／Bake／Cooking | 混合詞性題放得進空格 | 原本只有 Slice 放得進祈使句動詞位置，Soda 改本單元動詞 Bake，湊足兩個可代入的干擾項 |
| a2-u10-l06-q12 | We won the game! Let's have a glass of ____. | cereal／★champagne／toast／ham | cereal／★champagne／toast／jam | 同課共用／交叉當正解 | ham 與 q13 共用，改本單元字 jam |
| a2-u10-l07-q13 | She made a big ____ of cookies. | ★batch／grilled／roast／pear | ★batch／dessert／roast／slice | 同課共用／交叉當正解、混合詞性題放得進空格 | pear 是 q12 正解改 slice；grilled 放不進 a big ____ of，改名詞 dessert，湊足兩個可代入的干擾項 |
| a2-u10-l08-q13 | Do you want your potatoes ____ or fried? | ★boiled／chili／melon／jelly | ★boiled／raw／melon／thirsty | 同課共用／交叉當正解、混合詞性題放得進空格 | jelly 與 q12 共用改 thirsty；chili 放不進 potatoes ____ or fried，改形容詞 raw，兩個干擾項可代入、靠詞義排除 |
| a2-u10-l09-q12 | I'm thirsty. Can I have a bottle of ____? | fast food／olive oil／main course／★mineral water | spaghetti／olive oil／main course／★mineral water | 同課共用／交叉當正解 | 三個干擾項全與 q13 共用；fast food 改本單元字 spaghetti，olive oil、main course 留在本題、q13 另換 |
| a2-u10-l09-q13 | Would you like a ____ with your burger? | olive oil／★cola／fast food／main course | barbecue／★cola／fast food／tablespoon | 同課共用／交叉當正解 | olive oil、main course 與 q12 共用，改本單元字 barbecue、tablespoon；fast food 已自 q12 移除 |
| a2-u11-l01-q14 | This old lamp only ____ me five dollars. | mall／euro／★cost／inexpensive | told／gave／★cost／inexpensive | 同課共用／交叉當正解、混合詞性題放得進空格 | mall 與 q13 共用；原本無干擾項放得進動詞空格，mall、euro 改 told、gave（能代入、靠詞義排除） |
| a2-u11-l02-q13 | Two for the price of one? That's a great ____! | ★deal／production／budget／account | ★deal／receipt／budget／wallet | 同課共用／交叉當正解 | production 是 q12 正解改 receipt；account 與 q12 共用改 wallet |
| a2-u11-l03-q13 | This bag was ____, but it broke after a week. | ★cheap／exchange／wealth／credit | ★cheap／terrible／broken／credit | 同課共用／交叉當正解、混合詞性題放得進空格 | wealth 與 q12 共用；原本無干擾項放得進形容詞空格，wealth、exchange 改 broken、terrible（與 but 轉折矛盾而排除） |
| a2-u11-l04-q13 | We always ____ a car when we travel. | drugstore／coin／banking／★rent | paint／exchange／banking／★rent | 同課共用／交叉當正解、混合詞性題放得進空格 | coin 與 q12 共用；原本無干擾項放得進動詞空格，coin、drugstore 改 paint、exchange（能代入、靠詞義排除） |
| a2-u11-l05-q12 | The ____ helped me find the right size. | department store／cheque／★shop assistant／grocery store | department store／wallet／★shop assistant／grocery store | 同課共用／交叉當正解 | cheque 是 q13 正解，改本單元名詞 wallet |
| a2-u12-l01-q15 | This brand is famous ____. | ★worldwide／statue／indoor／aisle | ★worldwide／easily／indoor／carefully | 同課共用／交叉當正解、混合詞性題放得進空格 | statue、aisle 與 q14 共用且放不進 famous ____ 的副詞位置，改 easily、carefully（能代入、靠詞義排除；地點副詞如 downtown 會變也對故不用） |
| a2-u12-l02-q15 | We should buy fruit from ____ farmers. | space／★local／nation／position | indoor／★local／nation／national | 同課共用／交叉當正解、混合詞性題放得進空格 | space、position 與 q14 共用；原本無干擾項放得進形容詞位置，改 indoor、national（能代入、靠詞義排除） |
| a2-u12-l03-q14 | Is Chinese your ____ language? | ★native／west／direction／capital | ★native／west／worldwide／indoor | 同課共用／交叉當正解、混合詞性題放得進空格 | direction 與 q13 共用、capital 是 q13 正解，改本單元形容詞 worldwide、indoor（能代入、靠詞義排除） |
| a2-u12-l04-q14 | Please use the side ____. The front door is closed. | abroad／★entrance／royal／architecture | bench／★entrance／statue／architecture | 混合詞性題放得進空格 | abroad、royal 放不進 the side ____ 名詞位置，改本單元名詞 bench、statue，成四選項同詞性 |
| a2-u12-l05-q14 | We drove along the ____ coast for two days. | ★Pacific／overseas／crown／queen | ★Pacific／overseas／royal／national | 同課共用／交叉當正解、混合詞性題放得進空格 | crown、queen 與 q13 共用且放不進 the ____ coast 形容詞位置，改本單元形容詞 royal、national |
| a2-u13-l01-q13 | I can't stop my bike! The ____ are broken. | lanes／fares／★brakes／suitcases | lanes／cabs／★brakes／suitcases | 同課共用／交叉當正解 | fares 是 q14 正解 fare 的變化形，改本課字 cabs |
| a2-u13-l02-q14 | We need to stop and buy ____ for the car. | express／speed／★gas／path | express／speed／★gas／lane | 同課共用／交叉當正解 | path 與 q13 共用，改本單元名詞 lane |
| a2-u13-l03-q14 | Climbing that mountain was a big ____. | traffic／astronaut／passenger／★adventure | traffic／astronaut／suitcase／★adventure | 同課共用／交叉當正解 | passenger 與 q13 共用，改本單元名詞 suitcase |
| a2-u13-l04-q12 | Let's go ____ in the old town this afternoon. | roundabout／petrol／tram／★sightseeing | downtown／abroad／tram／★sightseeing | 同課共用／交叉當正解、混合詞性題放得進空格 | petrol 是 q13 正解；原本干擾項都放不進 go ____，roundabout、petrol 改副詞 downtown、abroad（能代入、與 in the old town 矛盾而排除） |
| a2-u13-l04-q13 | The car needs ____. Let's stop at the next town. | guidebook／spaceship／★petrol／sightseeing | traffic／adventure／★petrol／speed | 同課共用／交叉當正解、四選項同詞性 | sightseeing 是 q12 正解；guidebook、spaceship 為可數單數放不進 needs ____，改不可數名詞 traffic、adventure、speed，成四選項同詞性且都能代入 |
| a2-u13-l05-q12 | Wait for the bus at the ____ over there. | tour guide／★bus stop／driver's license／motorway | traffic light／★bus stop／petrol station／motorway | 同課共用／交叉當正解 | tour guide 是 q13 正解改 traffic light；driver's license 改 petrol station（地點類放得進 at the ____）；motorway 留本題、q13 另換 |
| a2-u13-l05-q13 | Our ____ told us about the history of the castle. | petrol station／★tour guide／bus stop／motorway | bus station／★tour guide／roundabout／highway | 同課共用／交叉當正解 | bus stop 是 q12 正解改 roundabout；petrol station、motorway 與 q12 共用改 bus station、highway |
| a2-u14-l01-q15 | Some flowers ____ in the cold winter. | harmful／medical／★die／patient | boil／bake／★die／patient | 混合詞性題放得進空格 | harmful、medical 放不進 flowers ____ 動詞位置，改 boil、bake（能代入、與 cold winter 矛盾而排除；grow、open 會變也對故不用） |
| a2-u14-l02-q15 | Nobody was hurt in the ____. | ★accident／physical／temperature／lip | ★accident／physical／temperature／weight | 同課共用／交叉當正解 | lip 與 q14 共用，改本課名詞 weight |
| a2-u14-l03-q13 | She stayed home because she was ____. | rich／★ill／tall／blonde | harmful／★ill／tall／blonde | 跨課重複 | rich 已在他課當非本單元干擾項，改本單元形容詞 harmful |
| a2-u14-l03-q14 | He fell and ____ his arm. | cheek／physically／★injured／psychologist | cheek／exercised／★injured／practiced | 混合詞性題放得進空格 | physically、psychologist 放不進 ____ his arm 動詞位置，改 exercised、practiced（能代入、靠詞義排除；hurt、broke 會變也對故不用） |
| a2-u14-l04-q14 | I stood up too fast and felt ____. | belly／ankle／toothache／★dizzy | belly／lazy／thirsty／★dizzy | 同課共用／交叉當正解、混合詞性題放得進空格 | ankle 與 q13 共用；原本無干擾項放得進 felt ____，ankle、toothache 改形容詞 lazy、thirsty（能代入、靠詞義排除） |
| a2-u15-l02-q14 | Do you have any ____ in sports? | hero／musical／★interest／rhythm | hike／musical／★interest／rhythm | 同課共用／交叉當正解 | hero 與 q13 共用，改本單元名詞 hike |
| a2-u15-l03-q13 | Nobody knows who he is. He is a ____ man. | tune／★mysterious／romance／dancer | magic／★mysterious／musical／balloon | 同課共用／交叉當正解、混合詞性題放得進空格 | tune、romance 與 q12 共用、dancer 是 q12 正解；改本單元 magic、musical（形容詞可代入）與 balloon |
| a2-u15-l04-q12 | Beethoven was a great ____. | amusement／clown／comic／★composer | amusement／clown／dancer／★composer | 同課共用／交叉當正解 | comic 是 q13 正解，改本單元名詞 dancer |
| a2-u15-l04-q13 | The clown told a ____ story, and everyone laughed. | singing／★comic／audio／composer | singing／★comic／audio／lonely | 同課共用／交叉當正解、混合詞性題放得進空格 | composer 是 q12 正解，改形容詞 lonely（能代入、與 everyone laughed 矛盾而排除），湊足兩個可代入的干擾項 |
| a2-u15-l05-q13 | We slept in the forest when we went ____. | ★camping／cassette／chess／symphony | ★camping／shopping／dancing／singing | 同課共用／交叉當正解、四選項同詞性 | chess 是 q12 正解、symphony 與 q12 共用；改 -ing 名詞 shopping、dancing、singing，四項都放得進 went ____，靠 slept in the forest 排除（hiking 會變也對故不用） |
| a2-u15-l06-q13 | I really like the ____ in this new song. | ★lyrics／MP3 player／board game／digital camera | ★lyrics／MP3 player／drawing／digital camera | 同課共用／交叉當正解 | board game 與 q12 共用，改本單元名詞 drawing（rhythm、tune 會變也對故不用） |
| a2-u16-l01-q13 | The fastest ____ crossed the line first. | stadium／★runner／skate／golf | challenge／★runner／skate／golf | 同課共用／交叉當正解 | stadium 與 q14 共用，改本課名詞 challenge（athlete 會變也對故不用） |
| a2-u16-l03-q14 | You need a ____ to play badminton. | skating／cricket／★racket／rugby | skating／cricket／★racket／medal | 同課共用／交叉當正解 | rugby 與 q13 共用，改本單元名詞 medal |
| a2-u16-l04-q12 | You play ____ on a table with a small white ball. | badminton／★table tennis／surfing／footballer | badminton／★table tennis／hockey／cricket | 同課共用／交叉當正解、四選項同詞性 | footballer 是 q13 正解、surfing 與 q13 共用；改本單元球類 hockey、cricket，四項都能接 play |
| a2-u17-l01-q15 | Your idea is good and very ____. | textbook／research／education／★logical | textbook／harmful／dangerous／★logical | 混合詞性題放得進空格 | research、education 放不進 very ____ 形容詞位置，改 harmful、dangerous（能代入、與 good and 矛盾而排除） |
| a2-u17-l02-q14 | Could you ____ how this machine works? | knowledge／★explain／writing／mistake | hate／★explain／writing／judge | 混合詞性題放得進空格 | knowledge、mistake 放不進 Could you ____ how 動詞位置，改 imagine、judge（能代入、靠詞義排除；show、describe 會變也對故不用）（實作端複核：Could you imagine how… 本身是通順問句，改 hate） |
| a2-u17-l03-q13 | Your answer is wrong. There is an ____ in the third line. | atom／essay／explanation／★error | idea／essay／explanation／★error | 用字範圍 | atom 為 a2-u17-l04 超範圍，改母音開頭 idea（保住 an 不洩題） |
| a2-u17-l03-q14 | After four years at university, she will ____ in June. | chemical／★graduate／meaning／scientific | explain／★graduate／retire／scientific | 混合詞性題放得進空格 | chemical、meaning 放不進 will ____ 動詞位置，改 explain、retire（能代入、靠詞義排除；marry 會變也對故不用） |
| a2-u17-l04-q13 | The book has twelve ____, and each one is about a different country. | learners／atoms／exams／★chapters | semesters／errors／folders／★chapters | 同課共用／交叉當正解 | learners、atoms 與 q14 共用、exams 是 q14 正解；改本單元複數名詞 semesters、errors、folders（charts、essays 會變也對故不用） |
| a2-u17-l05-q13 | Run, eat and sleep are all ____. | schoolchildren／nouns／adjectives／★verbs | comparatives／nouns／adjectives／★verbs | 用字範圍 | schoolchildren 不在課綱可辨識詞形，改本課字 comparatives |
| a2-u17-l05-q14 | We have a ____ in math class every Monday. | noun／singular／★quiz／adjective | campus／singular／★quiz／semester | 同課共用／交叉當正解 | noun、adjective 與 q13 共用，改本單元名詞 campus、semester |
| a2-u18-l01-q13 | Don't throw away the bottles. Please ____ them. | lose／pollute／★recycle／hide | drop／pollute／★recycle／hide | 跨課重複 | lose 已在他課當非本單元干擾項，改 drop |
| a2-u18-l01-q14 | It's very ____ today. My umbrella broke. | ray／★windy／scenery／elephant | foggy／★windy／scenery／cloudy | 混合詞性題放得進空格 | ray、elephant 放不進 very ____ 形容詞位置，改 foggy、cloudy（能代入、靠 umbrella broke 排除；rainy 會變也對故不用） |
| a2-u18-l02-q14 | This cream is made only from plants. It's all ____. | thunderstorm／seaside／★natural／rock | windy／seaside／★natural／fried | 同課共用／交叉當正解、混合詞性題放得進空格 | thunderstorm、rock 與 q13 共用，改形容詞 windy、fried（能代入、靠 made only from plants 排除） |
| a2-u18-l03-q14 | Please don't give food to the ____ animals in the park. | heat／earth／★wild／planet | heat／earth／★wild／natural | 同課共用／交叉當正解、混合詞性題放得進空格 | planet 與 q13 planets 共用，改本單元形容詞 natural，湊足兩個可代入的干擾項 |
| a2-u18-l04-q13 | A river runs through the green ____ between the hills. | seed／desert／★valley／shell | seed／shadow／★valley／shell | 同課共用／交叉當正解 | desert 是 q14 正解，改本單元名詞 shadow；seed、shell 留本題、q14 另換 |
| a2-u18-l04-q14 | It is very hot and dry in the ____. | shell／creature／seed／★desert | lake／creature／fog／★desert | 同課共用／交叉當正解 | shell、seed 與 q13 共用，改本單元名詞 lake、fog（與 hot and dry 矛盾而排除） |
| a2-u18-l05-q14 | Plants need ____ to grow. | duck／★sunlight／flood／dam | duck／★sunlight／flood／fog | 同課共用／交叉當正解 | dam 是 q13 正解，改本單元名詞 fog |
| a2-u18-l06-q14 | Tigers are ____, so we must keep them safe. | underwater／harvest／★endangered／sandy | underwater／insects／★endangered／sandy | 同課共用／交叉當正解 | harvest 與 q13 共用，改本單元複數名詞 insects（Tigers are insects 可代入、靠詞義排除；creatures、wild 會變也對故不用） |
| a2-u18-l07-q12 | The ____ climbed the tree and ate a banana. | bush／★chimpanzee／bay／sunflower | duck／★chimpanzee／robin／sunflower | 同課共用／交叉當正解 | bush、bay 與 q13 共用，改 duck、robin（本單元動物，靠詞義排除） |
| a2-u19-l01-q13 | If you see someone stealing a bike, call the ____. | law／society／★police／government | nurse／public／★police／government | 同課共用／交叉當正解 | law、society 與 q14 共用，改 nurse、public（皆名詞可放 call the ___） |
| a2-u19-l02-q13 | If you have a problem with the law, talk to a ____. | population／soldier／agency／★lawyer | population／teacher／doctor／★lawyer | 同課共用／交叉當正解、四選項同詞性 | soldier 與 q14 共用改 teacher；agency 接 a 冠詞洩題改 doctor |
| a2-u19-l03-q13 | The ____ will meet on Friday to plan the school trip. | emergency／freedom／murder／★committee | emergency／freedom／crime／★committee | 同課共用／交叉當正解 | murder 是 q14 正解，改 crime |
| a2-u19-l04-q14 | I don't let my children watch ____ movies with a lot of blood. | armed／endangered／★violent／killer | armed／endangered／★violent／public | 同課共用／交叉當正解、四選項同詞性 | killer 與 q13 共用，改形容詞 public，四選項同為形容詞 |
| a2-u19-l05-q12 | Please write the address on the ____. | ★envelope／liberty／permission／fighter | ★envelope／liberty／population／fighter | 同課共用／交叉當正解 | permission 是 q13 正解，改 population |
| a2-u19-l05-q13 | You can't take photos here without ____. | ★permission／envelope／fighter／repair | ★permission／freedom／society／repair | 同課共用／交叉當正解 | envelope 是 q12 正解改 freedom；fighter 與 q12 共用（且可數名詞無冠詞）改 society |
| a2-u19-l06-q13 | Two men tried to ____ the bank, but the police came quickly. | stamp／★rob／surname／policeman | steal／★rob／repair／policeman | 同課共用／交叉當正解、混合詞性題放得進空格 | stamp、surname 與 q12 共用，改動詞 steal、repair，使兩個干擾項放得進 to ___ the bank |
| a2-u19-l07-q12 | I want to send this box to my aunt. Where is the ____? | ★post office／police station／id card／first name | ★post office／police station／id card／policewoman | 同課共用／交叉當正解 | first name 是 q13 正解，改 policewoman |
| a2-u19-l07-q13 | My ____ is Kevin, and my surname is Lee. | post office／id／★first name／police officer | policeman／id／★first name／police officer | 同課共用／交叉當正解 | post office 是 q12 正解，改 policeman |
| a2-u20-l01-q14 | The weather ____ says it will rain tomorrow. | sound／voice／★report／rumor | sound／song／★report／rumor | 同課共用／交叉當正解 | voice 是 q15 正解，改 song |
| a2-u20-l02-q14 | They had a big ____ about money and stopped talking. | screen／★argument／text／notice | report／★argument／text／rumor | 同課共用／交叉當正解 | screen、notice 與 q13 共用，改本單元 report、rumor |
| a2-u20-l03-q13 | My teacher gave me some good ____ about my essay. | ★advice／tape／silence／context | ★advice／sound／silence／context | 同課共用／交叉當正解 | tape 是 q14 正解，改本單元不可數名詞 sound |
| a2-u20-l04-q14 | You can buy tickets ____ or at the station. | print／★online／complain／reply | slowly／★online／loudly／reply | 混合詞性題放得進空格 | print、complain 是動詞放不進空格，改副詞 slowly、loudly，使兩個干擾項文法成立 |
| a2-u20-l05-q13 | My teacher ____ me to read more English books. | web／script／pc／★advised | paid／chose／pc／★advised | 同課共用／交叉當正解、混合詞性題放得進空格 | web、script 與 q14 共用且為名詞，改動詞過去式 paid、chose（可接 me to read，靠詞義排除） |
| a2-u20-l06-q13 | He ____ to his teacher for being late. | website／★apologized／printer／clone | chatted／★apologized／shouted／clone | 同課共用／交叉當正解、混合詞性題放得進空格 | website 是 q14 正解、printer 與 q14 共用，改動詞 chatted、shouted，可接 to his teacher |
| a2-u21-l01-q15 | At New Year, we eat ____ food with our family. | bug／author／publish／★traditional | bug／boring／plastic／★traditional | 混合詞性題放得進空格 | author、publish 放不進 ___ food，改形容詞 boring、plastic |
| a2-u21-l02-q14 | She writes a weekly ____ about food for the newspaper. | editor／★column／audience／tradition | editor／★column／scene／performance | 同課共用／交叉當正解 | audience 與 q15 共用、tradition 是 q15 正解，改本單元 scene、performance |
| a2-u21-l03-q14 | My sister works in ____. She makes posters for new products. | portrait／classic／★advertising／episode | publishing／classic／★advertising／fiction | 同課共用／交叉當正解、混合詞性題放得進空格 | portrait 是 q13 正解、episode 與 q13 共用，改 publishing、fiction（可放 works in ___） |
| a2-u22-l01-q14 | The baby is only fifty ____ long. | grams／liters／★centimeters／kilometers | minutes／liters／★centimeters／kilometers | 同課共用／交叉當正解 | grams 是 q15 正解改 minutes；liters 由 q15 移除後不再共用 |
| a2-u22-l01-q15 | This letter is very light. It is only twenty ____. | liters／★grams／few／least | parts／★grams／hours／least | 同課共用／交叉當正解、混合詞性題放得進空格 | liters 與 q14 共用改 parts；few 放不進 twenty ___ 改 hours，使兩個干擾項文法成立 |
| a2-u22-l02-q14 | This class is for students at a beginner ____. | kilometer／million／centimeter／★level | kilometer／kilogram／centimeter／★level | 四選項同詞性 | million 是數詞，改名詞 kilogram，使本題四選項同為名詞 |
| a2-u22-l02-q15 | I was so hungry that I ate the ____ cake by myself! | nearly／★whole／less／several | wrong／★whole／same／several | 混合詞性題放得進空格 | nearly、less 放不進 the ___ cake，改形容詞 wrong、same |
| a2-u22-l03-q14 | Today we finished ____ five in our English book. | ★unit／range／scale／degree | ★unit／range／bit／degree | 同課共用／交叉當正解 | scale 是 q15 正解，改 bit |
| a2-u22-l03-q15 | On a ____ of one to ten, how much do you like this movie? | twice／★scale／additional／count | rate／★scale／kilometer／count | 混合詞性題放得進空格 | twice、additional 放不進 on a ___ of（additional 且有冠詞洩題），改名詞 rate、kilometer |
| a2-u22-l04-q13 | Look at that ____ ship! It's as big as a building. | average／extra／★enormous／additional | average／whole／★enormous／additional | 同課共用／交叉當正解 | extra 是 q14 正解，改形容詞 whole |
| a2-u22-l04-q14 | Can I have ____ sauce on my pizza? | fully／divide／plus／★extra | enough／divide／dry／★extra | 混合詞性題放得進空格 | fully、plus 放不進 have ___ sauce，改 enough、dry，使兩個干擾項文法成立 |
| a2-u22-l05-q14 | She speaks Japanese ____. Nobody knows she is from Taiwan. | ★perfectly／double／weigh／partly | ★perfectly／deeply／roughly／partly | 同課共用／交叉當正解、四選項同詞性 | weigh 是 q13 正解改 roughly；double 放不進空格改 deeply，四選項同為副詞 |
| a2-u22-l06-q14 | He played ____ and lost the game. | max／greatly／pile／★badly | max／greatly／fully／★badly | 混合詞性題放得進空格 | pile 放不進 played ___，改副詞 fully，使兩個干擾項文法成立 |
| a2-u23-l01-q14 | Please ____ my idea before you say no. | possible／★consider／sense／fact | possible／★consider／sense／copy | 同課共用／交叉當正解、混合詞性題放得進空格 | fact 與 q13 共用，改動詞 copy，連同 sense 共兩個干擾項可接 ___ my idea |
| a2-u23-l02-q12 | Studying abroad is a great ____ to learn a new language. | attention／evidence／concern／★opportunity | attention／prediction／concern／★opportunity | 同課共用／交叉當正解 | evidence 是 q13 正解，改本單元 prediction |
| a2-u23-l03-q13 | One ____ of living near school is that you can sleep longer. | affair／impossible／★advantage／opinion | concern／impossible／★advantage／opinion | 同課共用／交叉當正解 | affair 與 q12 共用，改本單元名詞 concern（語意相反，靠詞義排除） |
| a2-u23-l04-q13 | There is no ____ that she is the best singer in our school. | commitment／prefer／oppose／★doubt | commitment／prefer／concern／★doubt | 同課共用／交叉當正解、混合詞性題放得進空格 | oppose 與 q12 共用，改名詞 concern，使兩個干擾項可放 no ___ that |
| a2-u23-l05-q13 | My brother and I often ____ about what to watch on TV. | concentrate／fault／sake／★disagree | concentrate／fault／sing／★disagree | 混合詞性題放得進空格 | sake 放不進 often ___ about，改動詞 sing，連同 concentrate 共兩個干擾項文法成立 |
| a2-u24-l01-q13 | The ____ of the wind was so strong that it broke the window. | situation／★force／source／chance | situation／★force／source／cause | 用字範圍 | chance 為下一課字超範圍，改本課 cause |
| a2-u24-l01-q14 | Reading every day helps children ____ good language skills. | impact／★develop／power／situation | impact／★develop／explain／describe | 同課共用／交叉當正解、混合詞性題放得進空格 | situation 與 q13 共用、power 放不進 helps children ___，改動詞 explain、describe |
| a2-u24-l02-q14 | My new computer is very ____. It can run big games. | ★powerful／pressure／chance／condition | ★powerful／uncertain／heavy／condition | 混合詞性題放得進空格 | pressure、chance 為名詞放不進 very ___，改形容詞 uncertain、heavy |
| a2-u24-l03-q14 | This school has ____ ideas about learning, like no tests. | ★progressive／lack／depend／solution | ★progressive／cheap／depend／traditional | 同課共用／交叉當正解、混合詞性題放得進空格 | solution 與 q13 共用、lack 放不進 has ___ ideas，改形容詞 traditional、cheap |
| a2-u25-l01-q14 | Put the photo in a ____ and put it on your desk. | basically／★frame／empty／metal | pocket／★frame／empty／metal | 混合詞性題放得進空格 | basically 放不進 in a ___，改名詞 pocket，連同 metal 共兩個干擾項文法成立 |
| a2-u25-l02-q14 | English is ____ used around the world. | proper／symbol／weak／★widely | seriously／symbol／badly／★widely | 同課共用／交叉當正解、混合詞性題放得進空格 | proper 是 q13 正解、weak 與 q13 共用，改副詞 seriously、badly（可放 is ___ used） |
| a2-u25-l03-q13 | My grandfather made this ____ chair from an old tree. | inner／silver／★wooden／usual | golden／silver／★wooden／usual | 同課共用／交叉當正解 | inner 是 q14 正解，改本單元形容詞 golden |
| a2-u25-l03-q14 | She keeps her money in the ____ pocket of her jacket. | unlike／★inner／strongly／quietly | unlike／★inner／smooth／ancient | 混合詞性題放得進空格 | strongly、quietly 放不進 the ___ pocket，改形容詞 smooth、ancient |
| a2-u25-l04-q14 | The ____ weight of the rice is five kilos, without the bag. | ★net／lost／split／unknown | ★net／inner／split／unknown | 同課共用／交叉當正解 | lost 與 q13 共用，改本單元形容詞 inner |
| a2-u25-l05-q14 | My new shoes are made of ____. | precise／★leather／principal／differently | water／★leather／weather／differently | 混合詞性題放得進空格 | precise、principal 放不進 made of ___，改名詞 water、weather（實作端複核：metal、paper 代入也成立，不用） |
| a2-u25-l06-q14 | The lights turn off ____ at midnight. | suitable／fancy／artificial／★automatically | strongly／widely／differently／★automatically | 同課共用／交叉當正解、混合詞性題放得進空格、四選項同詞性 | suitable、fancy 與 q13 共用、artificial 是 q13 正解，且形容詞放不進 turn off ___，改本單元副詞，四選項同為副詞 |
| a2-u25-l07-q13 | It was the ____ day of my life. Everything went wrong. | ★worst／marvelous／left-hand／right-hand | ★worst／fascinating／fantastic／right-hand | 同課共用／交叉當正解 | marvelous、left-hand 與 q12 共用，改本單元 fascinating、fantastic |
| a2-u26-l01-q13 | Every year, my whole family ____ at Grandma's house for New Year. | disappears／operates／survives／★gathers | spreads／operates／survives／★gathers | 用字範圍 | disappears 為下一課字超範圍，改本課 spreads |
| a2-u26-l01-q14 | I got a small ____ on my hand from the hot pan. | gather／survive／★burn／operate | wave／cross／★burn／star | 同課共用／交叉當正解、混合詞性題放得進空格、四選項同詞性 | gather（q13 正解）、survive、operate 與 q13 共用且為動詞，改名詞 wave、cross、star，四選項同為名詞 |
| a2-u26-l02-q14 | We spent the afternoon ____ the old town. | ★exploring／instrument／tie／search | ★exploring／destroying／burning／gathering | 同課共用／交叉當正解、混合詞性題放得進空格、四選項同詞性 | tie 是 q13 正解、instrument、search 與 q13 共用，改本單元動詞 -ing 形，四選項同詞性 |
| a2-u26-l03-q14 | My bike ____ came off, so I had to walk home. | ★chain／belong／blame／organize | ★chain／belong／mark／instrument | 同課共用／交叉當正解、混合詞性題放得進空格 | blame 與 q13 共用、organize 是 q13 正解，改名詞 mark、instrument（可放 My bike ___） |
| a2-u26-l04-q14 | If you work hard, you will ____. | tip／★succeed／tear／fix | pour／★succeed／escape／fix | 同課共用／交叉當正解 | tip 與 q13 共用、tear 是 q13 正解，改本課動詞 pour、escape |
| a2-u26-l05-q12 | Read the ____ and answer the questions below. | rope／pack／★passage／chain | tie／pack／★passage／chain | 用字範圍 | rope 為後面課字超範圍，改本單元 tie |
| a2-u26-l05-q13 | The test ____ of three parts. | display／★consists／slide／passage | speaks／★consists／slide／thinks | 同課共用／交叉當正解、混合詞性題放得進空格 | passage 是 q12 正解；display 放不進空格，改可接 of 的動詞 speaks、thinks（靠詞義排除） |
| a2-u26-l06-q12 | The kids ____ a box of old toys in the garden. | ★buried／adjusted／froze／invented | ★buried／adjusted／froze／operated | 用字範圍 | invented 為下一課字超範圍，改本單元 operated |
| a2-u26-l06-q13 | He showed us a card ____, and everyone was surprised. | float／★trick／string／bury | float／★trick／string／chain | 同課共用／交叉當正解 | bury 是 q12 正解，改本單元名詞 chain |
| a2-u26-l07-q13 | Hold on to the ____ and climb up slowly. | shine／★rope／invent／successfully | float／★rope／wave／successfully | 混合詞性題放得進空格 | shine、invent 放不進 the ___，改本單元名詞 float、wave |
| a2-u26-l08-q13 | We put a ____ in the kitchen to catch the mouse. | lend／★trap／splash／organized | pack／★trap／splash／organized | 同課共用／交叉當正解 | lend 與 q12 lent 同字，改本單元名詞 pack |
| a2-u27-l01-q13 | After a busy week, I love the ____ mornings at the lake. | anxious／★peaceful／disappointed／intelligent | anxious／★peaceful／grateful／intelligent | 同課共用／交叉當正解 | disappointed 是 q14 正解，改本課形容詞 grateful |
| a2-u27-l01-q14 | I was ____ because our team lost the game. | happiness／★disappointed／confuse／pleasant | happiness／★disappointed／excited／pleasant | 混合詞性題放得進空格 | confuse 放不進 I was ___，改形容詞 excited，連同 pleasant 共兩個干擾項文法成立 |
| a2-u27-l02-q13 | Her ____ is to become a famous singer one day. | panic／harmony／★ambition／fool | panic／habit／★ambition／fool | 同課共用／交叉當正解 | harmony 是 q14 正解，改名詞 habit |
| a2-u27-l02-q14 | The singers sang together in perfect ____. | unfair／regret／★harmony／happily | silence／regret／★harmony／happily | 混合詞性題放得進空格 | unfair 放不進 in perfect ___，改名詞 silence，連同 regret 共兩個干擾項文法成立 |
| a2-u27-l03-q14 | In the story, an old woman put a ____ on the princess. | brave／sadly／frighten／★curse | weep／panic／harmony／★curse | 同課共用／交叉當正解、混合詞性題放得進空格、四選項同詞性 | brave 與 q13 共用、frighten 與 q13 正解同字，且三者放不進 a ___，改本單元名詞，四選項同為名詞 |
| a2-u27-l04-q14 | Big dogs ____ my little brother. | uneasy／pity／★terrify／lively | confuse／pity／★terrify／regret | 混合詞性題放得進空格 | uneasy、lively 放不進 Big dogs ___ my brother，改本單元動詞 confuse、regret |
| a2-u27-l05-q13 | My little brother is so ____. He wants all the snacks for himself. | ★greedy／envy／angrily／frank | ★greedy／envy／playful／frank | 同課共用／交叉當正解 | angrily 是 q12 正解，改本課形容詞 playful |
| a2-u27-l06-q12 | It's ____ to copy your friend's homework. | pleasing／unforgettable／★dishonest／kindly | pleasing／unforgettable／★dishonest／brave | 同課共用／交叉當正解 | kindly 是 q13 正解，改本單元形容詞 brave |
| a2-u27-l06-q13 | A ____ old woman showed me the way to the station. | grace／laziness／★kindly／amused | greedy／laziness／★kindly／silly | 混合詞性題放得進空格 | grace 放不進、amused 接 A 冠詞洩題，改子音開頭形容詞 greedy、silly |

## 五、無解或拿不準、待執行長裁示

1. **a1-u01-l01（q13、q14）做不到「四選項同詞性」與「混合題兩個放得進」**：這是第一課，可用字只有 the、be、and、of、a、in、to、have 八個。介系詞只有 of、in、to 三個，而 of、in 是兩題的正解。目前只修好共用問題：q13＝a／the／and／★of，q14＝be／to／have／★in。be、have 一眼就能刪。要徹底解決，得改題幹或改考別的字。
2. **a1-u18-l01-q13**「I ____ sick today.」（like／believe／★feel／memory）：能放進空格的連綴動詞（look、get）代入後也都成立，所以混合題「兩個放得進」做不到。同課 q14 已改成四選項同詞性。
3. **a1-u19 功能字單元**（l01、l02、l04、l05、l08）：選項都是功能字，同詞性與「放得進空格」很難同時成立。只修了共用問題。例：l01-q14「Can I have ____ sandwich?」任何放得進的限定詞代入後句子都對。
4. **實作端複核後改掉的「干擾項也成立」**（已修）：
   - a1-u03-l01-q14：year、day 改成 job、address
   - a2-u25-l05-q14：metal、paper 改成 water、weather
   - a1-u16-l03-q14：reads、writes 改成 eats、underlines
   - a2-u17-l02-q14：imagine 改成 hate
   - a2-u05-l05-q13：around 改成 called
5. **子代理列為語感偏弱、但判定合規的題**（建議盲答時特別留意）：
   - A1：a1-u12-l03-q13（drive a horse）、a1-u09-l03-q13（warm umbrella／bag）、a1-u13-l02-q14、a1-u09-l01-q14、a1-u14-l05-q13、a1-u02-l01-q14（byes）
   - A2：a2-u17-l02-q14（judge）、a2-u08-l02-q15（downstairs）、a2-u10-l08-q13（raw）、a2-u22-l02-q15（the wrong cake）、a2-u26-l05-q13（speaks／thinks of）、a2-u27-l06-q13、a2-u14-l01-q15
6. **稽核範圍外的發現（沒改）**：沒有「；」的單一釋義卡，有 105 張的釋義帶括號註記、或比干擾項長 3 字寬以上。例：at「在（某時間或地點）」、me「我（受詞）」、mum「（英式）媽媽」。App 只顯示第一段，這些卡同樣有格式洩題的可能。是否比照處理，請裁示。

## 六、改到選項或題幹的題 id（以 61224a2 為基準，供重新盲答）

### mcq 選項（388 題；題幹都沒改）

a1-u01-l01-q13、a1-u01-l01-q14、a1-u01-l02-q13、a1-u01-l02-q14、a1-u01-l03-q13、a1-u01-l03-q14、a1-u01-l04-q13、a1-u01-l04-q14、a1-u01-l05-q13、a1-u01-l05-q14、a1-u01-l06-q14、a1-u01-l07-q13、a1-u01-l07-q14、a1-u01-l08-q13、a1-u01-l08-q14、a1-u01-l09-q13、a1-u01-l09-q14、a1-u01-l10-q13、a1-u01-l10-q14、a1-u02-l01-q13、a1-u02-l01-q14、a1-u02-l02-q13、a1-u02-l03-q13、a1-u02-l03-q14、a1-u02-l04-q13、a1-u02-l04-q14、a1-u02-l05-q14、a1-u02-l06-q12、a1-u02-l06-q13、a1-u03-l01-q14、a1-u03-l01-q15、a1-u03-l02-q14、a1-u03-l02-q15、a1-u03-l03-q13、a1-u03-l03-q14、a1-u03-l04-q13、a1-u03-l05-q13、a1-u03-l05-q14、a1-u03-l06-q14、a1-u04-l01-q13、a1-u04-l01-q14、a1-u04-l04-q13、a1-u04-l04-q14、a1-u04-l05-q12、a1-u04-l05-q13、a1-u04-l06-q12、a1-u04-l06-q13、a1-u05-l01-q14、a1-u05-l01-q15、a1-u05-l02-q15、a1-u05-l03-q13、a1-u05-l03-q14、a1-u05-l04-q13、a1-u05-l04-q14、a1-u05-l05-q13、a1-u05-l06-q13、a1-u05-l06-q14、a1-u06-l01-q15、a1-u06-l02-q13、a1-u06-l03-q13、a1-u06-l03-q14、a1-u06-l04-q13、a1-u06-l05-q14、a1-u07-l01-q13、a1-u07-l02-q14、a1-u07-l03-q12、a1-u07-l03-q13、a1-u07-l04-q12、a1-u07-l04-q13、a1-u08-l01-q13、a1-u08-l01-q14、a1-u08-l02-q14、a1-u08-l03-q13、a1-u08-l03-q14、a1-u08-l04-q13、a1-u08-l04-q14、a1-u08-l05-q14、a1-u08-l06-q13、a1-u08-l07-q12、a1-u08-l07-q13、a1-u08-l08-q13、a1-u09-l01-q14、a1-u09-l02-q13、a1-u09-l02-q14、a1-u09-l03-q13、a1-u09-l03-q14、a1-u09-l04-q12、a1-u09-l04-q13、a1-u10-l01-q13、a1-u10-l01-q14、a1-u10-l02-q12、a1-u10-l02-q13、a1-u10-l03-q12、a1-u10-l03-q13、a1-u11-l01-q13、a1-u11-l02-q13、a1-u11-l03-q13、a1-u11-l04-q13、a1-u12-l01-q13、a1-u12-l02-q13、a1-u12-l03-q13、a1-u12-l04-q12、a1-u13-l01-q13、a1-u13-l02-q14、a1-u13-l03-q14、a1-u13-l04-q13、a1-u13-l04-q14、a1-u14-l01-q13、a1-u14-l01-q14、a1-u14-l02-q14、a1-u14-l03-q13、a1-u14-l03-q14、a1-u14-l04-q13、a1-u14-l05-q13、a1-u14-l06-q13、a1-u15-l01-q13、a1-u15-l01-q14、a1-u15-l02-q14、a1-u15-l03-q14、a1-u15-l04-q13、a1-u15-l05-q13、a1-u15-l06-q12、a1-u15-l07-q13、a1-u16-l01-q14、a1-u16-l02-q13、a1-u16-l02-q14、a1-u16-l03-q14、a1-u16-l04-q13、a1-u16-l05-q13、a1-u16-l06-q14、a1-u16-l07-q12、a1-u16-l07-q13、a1-u16-l08-q12、a1-u16-l08-q13、a1-u16-l09-q12、a1-u17-l01-q14、a1-u17-l01-q15、a1-u17-l02-q14、a1-u17-l02-q15、a1-u17-l04-q13、a1-u17-l04-q14、a1-u17-l05-q14、a1-u17-l06-q14、a1-u18-l01-q13、a1-u18-l01-q14、a1-u18-l02-q12、a1-u18-l02-q13、a1-u18-l03-q12、a1-u18-l03-q13、a1-u18-l04-q12、a1-u18-l04-q13、a1-u18-l05-q13、a1-u19-l01-q13、a1-u19-l02-q14、a1-u19-l03-q13、a1-u19-l04-q13、a1-u19-l04-q14、a1-u19-l05-q13、a1-u19-l07-q13、a1-u19-l08-q13、a1-u19-l08-q14、a1-u19-l09-q14、a1-u20-l01-q13、a1-u20-l01-q14、a1-u20-l02-q14、a1-u20-l03-q13、a1-u20-l03-q14、a1-u20-l04-q14、a1-u20-l05-q13、a1-u21-l01-q13、a1-u21-l01-q14、a1-u21-l02-q13、a1-u21-l02-q14、a1-u21-l03-q13、a1-u21-l04-q13、a1-u21-l04-q14、a1-u21-l05-q13、a1-u21-l05-q14、a1-u21-l06-q13、a1-u21-l06-q14、a1-u22-l01-q14、a1-u22-l03-q13、a1-u22-l04-q14、a1-u22-l05-q13、a1-u22-l06-q12、a1-u22-l06-q13、a1-u23-l01-q13、a1-u23-l01-q14、a1-u23-l02-q14、a1-u23-l03-q14、a1-u23-l04-q13、a1-u23-l04-q14、a1-u23-l05-q13、a1-u23-l05-q14、a1-u23-l06-q13、a1-u23-l06-q14、a2-u01-l01-q14、a2-u01-l01-q15、a2-u01-l02-q14、a2-u01-l03-q13、a2-u01-l03-q14、a2-u01-l04-q13、a2-u01-l05-q13、a2-u01-l05-q14、a2-u01-l06-q13、a2-u01-l07-q13、a2-u01-l07-q14、a2-u01-l08-q14、a2-u01-l09-q13、a2-u02-l01-q14、a2-u02-l02-q13、a2-u02-l03-q12、a2-u03-l01-q13、a2-u03-l01-q14、a2-u03-l02-q13、a2-u03-l03-q13、a2-u03-l04-q14、a2-u03-l06-q13、a2-u03-l06-q14、a2-u03-l07-q13、a2-u03-l07-q14、a2-u03-l08-q13、a2-u04-l01-q14、a2-u04-l02-q14、a2-u04-l03-q14、a2-u04-l04-q13、a2-u04-l05-q13、a2-u04-l05-q14、a2-u04-l06-q13、a2-u04-l06-q14、a2-u04-l08-q13、a2-u04-l09-q13、a2-u04-l09-q14、a2-u05-l01-q13、a2-u05-l01-q14、a2-u05-l02-q13、a2-u05-l02-q14、a2-u05-l03-q13、a2-u05-l04-q13、a2-u05-l05-q13、a2-u06-l01-q13、a2-u06-l01-q14、a2-u06-l02-q13、a2-u06-l03-q13、a2-u06-l03-q14、a2-u06-l04-q13、a2-u06-l05-q14、a2-u06-l06-q13、a2-u06-l06-q14、a2-u06-l07-q13、a2-u07-l01-q12、a2-u07-l01-q13、a2-u07-l03-q12、a2-u07-l03-q13、a2-u08-l01-q14、a2-u08-l02-q15、a2-u08-l03-q14、a2-u08-l04-q14、a2-u08-l05-q13、a2-u09-l01-q13、a2-u09-l02-q13、a2-u09-l02-q14、a2-u09-l03-q13、a2-u09-l04-q13、a2-u09-l04-q14、a2-u10-l01-q14、a2-u10-l02-q13、a2-u10-l03-q13、a2-u10-l03-q14、a2-u10-l04-q14、a2-u10-l05-q14、a2-u10-l06-q12、a2-u10-l07-q13、a2-u10-l08-q13、a2-u10-l09-q12、a2-u10-l09-q13、a2-u11-l01-q14、a2-u11-l02-q13、a2-u11-l03-q13、a2-u11-l04-q13、a2-u11-l05-q12、a2-u12-l01-q15、a2-u12-l02-q15、a2-u12-l03-q14、a2-u12-l04-q14、a2-u12-l05-q14、a2-u13-l01-q13、a2-u13-l02-q14、a2-u13-l03-q14、a2-u13-l04-q12、a2-u13-l04-q13、a2-u13-l05-q12、a2-u13-l05-q13、a2-u14-l01-q15、a2-u14-l02-q15、a2-u14-l03-q13、a2-u14-l03-q14、a2-u14-l04-q14、a2-u15-l02-q14、a2-u15-l03-q13、a2-u15-l04-q12、a2-u15-l04-q13、a2-u15-l05-q13、a2-u15-l06-q13、a2-u16-l01-q13、a2-u16-l03-q14、a2-u16-l04-q12、a2-u17-l01-q15、a2-u17-l02-q14、a2-u17-l03-q13、a2-u17-l03-q14、a2-u17-l04-q13、a2-u17-l05-q13、a2-u17-l05-q14、a2-u18-l01-q13、a2-u18-l01-q14、a2-u18-l02-q14、a2-u18-l03-q14、a2-u18-l04-q13、a2-u18-l04-q14、a2-u18-l05-q14、a2-u18-l06-q14、a2-u18-l07-q12、a2-u19-l01-q13、a2-u19-l02-q13、a2-u19-l03-q13、a2-u19-l04-q14、a2-u19-l05-q12、a2-u19-l05-q13、a2-u19-l06-q13、a2-u19-l07-q12、a2-u19-l07-q13、a2-u20-l01-q14、a2-u20-l02-q14、a2-u20-l03-q13、a2-u20-l04-q14、a2-u20-l05-q13、a2-u20-l06-q13、a2-u21-l01-q15、a2-u21-l02-q14、a2-u21-l03-q14、a2-u22-l01-q14、a2-u22-l01-q15、a2-u22-l02-q14、a2-u22-l02-q15、a2-u22-l03-q14、a2-u22-l03-q15、a2-u22-l04-q13、a2-u22-l04-q14、a2-u22-l05-q14、a2-u22-l06-q14、a2-u23-l01-q14、a2-u23-l02-q12、a2-u23-l03-q13、a2-u23-l04-q13、a2-u23-l05-q13、a2-u24-l01-q13、a2-u24-l01-q14、a2-u24-l02-q14、a2-u24-l03-q14、a2-u25-l01-q14、a2-u25-l02-q14、a2-u25-l03-q13、a2-u25-l03-q14、a2-u25-l04-q14、a2-u25-l05-q14、a2-u25-l06-q14、a2-u25-l07-q13、a2-u26-l01-q13、a2-u26-l01-q14、a2-u26-l02-q14、a2-u26-l03-q14、a2-u26-l04-q14、a2-u26-l05-q12、a2-u26-l05-q13、a2-u26-l06-q12、a2-u26-l06-q13、a2-u26-l07-q13、a2-u26-l08-q13、a2-u27-l01-q13、a2-u27-l01-q14、a2-u27-l02-q13、a2-u27-l02-q14、a2-u27-l03-q14、a2-u27-l04-q14、a2-u27-l05-q13、a2-u27-l06-q12、a2-u27-l06-q13

### 單字卡四選一選項（glossZh 或 distractorsZh 有變，121 張）

a1-u01-l01-q01、a1-u02-l02-q06、a1-u02-l04-q07、a1-u02-l06-q07、a1-u03-l01-q09、a1-u03-l04-q01、a1-u03-l04-q08、a1-u04-l02-q01、a1-u04-l06-q05、a1-u04-l06-q07、a1-u06-l04-q01、a1-u06-l05-q04、a1-u07-l02-q01、a1-u07-l02-q02、a1-u08-l05-q08、a1-u10-l02-q02、a1-u10-l03-q04、a1-u11-l02-q07、a1-u14-l02-q08、a1-u14-l04-q04、a1-u14-l05-q03、a1-u16-l01-q03、a1-u16-l04-q06、a1-u16-l05-q08、a1-u16-l07-q07、a1-u17-l04-q06、a1-u17-l06-q08、a1-u18-l01-q08、a1-u18-l02-q04、a1-u18-l04-q06、a1-u19-l01-q06、a1-u19-l03-q08、a1-u19-l05-q07、a1-u19-l06-q03、a1-u21-l06-q06、a1-u22-l01-q08、a1-u22-l02-q01、a1-u22-l04-q08、a1-u23-l01-q03、a1-u23-l03-q02、a1-u23-l03-q07、a1-u23-l06-q02、a2-u01-l03-q06、a2-u01-l06-q06、a2-u01-l06-q07、a2-u01-l07-q02、a2-u02-l03-q01、a2-u02-l04-q02、a2-u03-l03-q06、a2-u03-l05-q02、a2-u03-l07-q06、a2-u03-l08-q02、a2-u04-l06-q02、a2-u04-l06-q04、a2-u04-l07-q03、a2-u04-l07-q04、a2-u04-l07-q06、a2-u04-l08-q02、a2-u05-l01-q08、a2-u06-l01-q03、a2-u06-l01-q08、a2-u06-l04-q02、a2-u07-l02-q01、a2-u08-l02-q07、a2-u08-l03-q02、a2-u08-l05-q02、a2-u08-l06-q08、a2-u09-l03-q01、a2-u09-l03-q08、a2-u09-l04-q08、a2-u10-l01-q04、a2-u10-l02-q02、a2-u10-l04-q01、a2-u10-l05-q04、a2-u10-l07-q06、a2-u10-l08-q05、a2-u10-l09-q07、a2-u11-l01-q08、a2-u11-l02-q03、a2-u11-l03-q01、a2-u11-l04-q01、a2-u12-l04-q03、a2-u12-l04-q04、a2-u12-l05-q01、a2-u13-l01-q02、a2-u13-l05-q02、a2-u14-l01-q05、a2-u14-l01-q09、a2-u14-l02-q05、a2-u14-l02-q06、a2-u14-l02-q09、a2-u14-l03-q03、a2-u14-l04-q08、a2-u17-l03-q01、a2-u17-l03-q04、a2-u18-l02-q07、a2-u18-l02-q08、a2-u19-l01-q04、a2-u19-l01-q06、a2-u19-l03-q05、a2-u19-l04-q04、a2-u19-l06-q01、a2-u19-l06-q06、a2-u20-l01-q06、a2-u20-l01-q08、a2-u20-l02-q08、a2-u20-l04-q04、a2-u20-l05-q01、a2-u21-l01-q08、a2-u21-l03-q02、a2-u21-l03-q03、a2-u22-l04-q04、a2-u22-l06-q01、a2-u23-l02-q05、a2-u24-l01-q04、a2-u25-l02-q03、a2-u26-l01-q04、a2-u26-l05-q02、a2-u27-l02-q01、a2-u27-l02-q03、a2-u27-l05-q05

### 單字卡例句改寫（題幹類，70 張）

a1-u01-l01-q02、a1-u01-l06-q06、a1-u01-l08-q03、a1-u02-l05-q01、a1-u03-l03-q06、a1-u04-l03-q03、a1-u07-l01-q02、a1-u07-l01-q04、a1-u07-l02-q04、a1-u08-l03-q06、a1-u08-l05-q04、a1-u09-l04-q04、a1-u12-l01-q02、a1-u12-l02-q01、a1-u15-l02-q01、a1-u17-l01-q03、a1-u17-l01-q07、a1-u17-l03-q02、a1-u17-l04-q06、a1-u18-l02-q01、a1-u19-l03-q05、a1-u23-l06-q01、a1-u23-l06-q06、a2-u03-l04-q01、a2-u03-l06-q04、a2-u03-l06-q05、a2-u03-l06-q06、a2-u03-l07-q05、a2-u03-l08-q04、a2-u05-l02-q06、a2-u06-l01-q02、a2-u06-l01-q08、a2-u10-l07-q07、a2-u11-l03-q02、a2-u12-l02-q02、a2-u12-l02-q03、a2-u12-l03-q01、a2-u15-l04-q05、a2-u18-l04-q02、a2-u18-l06-q01、a2-u18-l06-q06、a2-u19-l05-q06、a2-u20-l01-q03、a2-u20-l02-q04、a2-u20-l03-q04、a2-u20-l04-q03、a2-u20-l05-q02、a2-u21-l02-q07、a2-u21-l03-q04、a2-u22-l01-q06、a2-u22-l02-q02、a2-u22-l03-q04、a2-u22-l04-q07、a2-u22-l05-q01、a2-u23-l03-q03、a2-u23-l04-q02、a2-u23-l04-q05、a2-u24-l01-q05、a2-u25-l02-q01、a2-u25-l02-q08、a2-u25-l04-q02、a2-u26-l02-q01、a2-u26-l03-q04、a2-u26-l04-q02、a2-u26-l04-q07、a2-u26-l05-q07、a2-u26-l06-q03、a2-u26-l06-q04、a2-u27-l03-q06、a2-u27-l06-q02

---

# 第二輪（基準 9010ffa，依 t9/a12-rulings2.md）

新規則：mcq 只看英文就要唯一可解（App 作答前不顯示 stemZh）。說明開頭同樣是「執行長裁示：後期規則補正：」。

## 一、統計

- A1、A2 全級 mcq 586 題，逐題把每個干擾項代入英文句（6 個子代理分段做，拿不準的題由實作端逐題裁定）。
- **只看英文雙答案：86 題**，已全部換掉干擾項。其中包含盲答抓到的 7 題、複審提示的 4 題、a1-u02-l03-q14 的 Need，以及 a2-u20-l05-q13 的 paid／chose。
- 其他：縮寫大寫 3 題（ID card、ID、PC）；bra 換 scarf 1 題；連動修正 2 題四選項同詞性、1 題同課共用、1 題跨課重複。
- 題幹都沒改，正解的文字與位置也都沒動。
- 換字後重查：用字範圍 0、同課共用 0、跨課重複 0（比對先還原詞形）。
- 長度名次分布：A1 mcq 29.5／27.1／22.8／20.6%；A2 mcq 31.0／25.7／21.0／22.3%（合格範圍 13–37%）。
- reading、listenChoice 沒動；`check-items --require-judge`（A1、A2）全綠；npm test 169／169。
- 單字卡：FIX 1～9 照複審表的具體改法修，只有兩處調整：
  - effect 例句沒用複審建議的「Too much sugar…」（屬保健題材，§11-30），改成「Her kind words had a big effect on me.」
  - invade 中譯用「軍人」，因為「北方來的士兵」會被繁中守衛誤判成「的士」。
  - spread 的第一義改成動詞，干擾項同步改成動詞。
- 雷同自查列出 invade、effect 兩張與同課句子同句型骨架；主詞與情境都換了，人工判定通過。

## 二、規則衝突與豁免（執行長已裁示）

**優先順序**：兩條規則衝突時，「mcq 只看英文唯一可解」優先；「混合詞性題至少兩個干擾項放得進空格」與「每課至少一題四選項同詞性」可以讓步。

| 題 id | 衝突情形 | 目前干擾項 | 裁示 |
|---|---|---|---|
| a1-u03-l06-q14 | 混合詞性題：「I will see you ____ morning.」放得進空格的字只看英文都說得通 | ago、half（文法不通） | 執行長核准豁免 |
| a1-u07-l01-q13 | 混合詞性題：「Can you ____ here for a minute?」同上 | excuse、thank（文法不通） | 執行長核准豁免 |
| a1-u01-l10-q13 | 混合詞性題：只有一個干擾項放得進空格 | still、also 中只有一個放得進 | 執行長核准豁免 |
| a2-u20-l05-q13 | 混合詞性題：「My teacher ____ me to read more English books.」能接「動詞＋me to」的字只看英文都說得通 | argued、shouted、PC（文法不通） | 執行長核准豁免 |
| a1-u01-l06-q14 | 四選項同詞性題：任何受格代名詞只看英文都成立，干擾項只能用文法不通的字 | we、they、me | 執行長核准豁免（a1-u01-l06 整課沒有合格的同詞性題，一併豁免） |
| a1-u03-l05-q13 | 四選項同詞性題：干擾項文法不通；該課同詞性題改由 q14 擔任 | soon、early、late | 執行長核准豁免 |

第一輪已豁免：a1-u01-l01（全課）、a1-u02-l03-q14（混合詞性題放得進空格的條件）。

## 三、單字卡改動（第二輪）

| 題 id | 單字 | 欄位 | 改前 | 改後 |
|---|---|---|---|---|
| a2-u14-l01-q05 | die | glossZh | "枯死；死" | "死；枯死" |
| a2-u14-l01-q05 | die | exampleZh | "我的植物枯死了，因為我忘了給它們澆水。" | "我的植物死了，因為我忘了給它們澆水。" |
| a2-u19-l04-q04 | violent | glossZh | "猛烈的；暴力的" | "暴力的；猛烈的" |
| a2-u19-l04-q04 | violent | exampleEn | "Last night there was a violent storm." | "The police are looking for a violent man." |
| a2-u19-l04-q04 | violent | exampleZh | "昨晚有一場猛烈的暴風雨。" | "警察正在找一名行為暴力的男子。" |
| a2-u19-l06-q01 | invade | glossZh | "湧入；入侵" | "入侵；湧入" |
| a2-u19-l06-q01 | invade | exampleEn | "On weekends, tourists invade our small town." | "Long ago, soldiers from the north invaded this town." |
| a2-u19-l06-q01 | invade | exampleZh | "每到週末，觀光客就會湧入我們的小鎮。" | "很久以前，一群從北方來的軍人入侵了這座小鎮。" |
| a2-u24-l01-q04 | effect | glossZh | "效果；影響" | "影響；效果" |
| a2-u24-l01-q04 | effect | exampleEn | "Special effects make this movie exciting." | "Her kind words had a big effect on me." |
| a2-u24-l01-q04 | effect | exampleZh | "特效讓這部電影很刺激。" | "她親切的話對我影響很大。" |
| a2-u26-l01-q04 | spread | glossZh | "普及；傳播；蔓延" | "傳播；普及；蔓延" |
| a2-u26-l01-q04 | spread | exampleEn | "The spread of phones changed our lives." | "The news spread quickly around the school." |
| a2-u26-l01-q04 | spread | exampleZh | "手機的普及改變了我們的生活。" | "這個消息很快就在學校傳開了。" |
| a2-u03-l08-q02 | negative | glossZh | "悲觀的；負面的" | "負面的；悲觀的" |
| a2-u03-l08-q02 | negative | exampleZh | "別對每件事都那麼悲觀！" | "別對每件事都那麼負面！" |
| a2-u26-l04-q02 | pour | exampleEn | "He poured the rice into a big bowl." | "My little sister poured too much sauce on her rice." |
| a2-u26-l04-q02 | pour | exampleZh | "他把米倒進一個大碗裡。" | "我妹妹在飯上倒了太多醬汁。" |
| a2-u27-l06-q02 | pleasing | exampleEn | "It was a pleasing day: sunny, warm and quiet." | "My parents found my test results very pleasing." |
| a2-u27-l06-q02 | pleasing | exampleZh | "那是令人愉快的一天：晴朗、溫暖又安靜。" | "我爸媽對我的考試成績很滿意。" |
| a1-u23-l06-q01 | repeat | exampleZh | "老師把新單字重複了三次。" | "老師會把新單字重複唸三次。" |
| a2-u26-l01-q04 | spread | distractorsZh | ["價格", "顏色", "聲音"] | ["收集", "打破", "藏起來"] |

## 四、mcq 改動（第二輪）

| 題 id | 題幹 | 改前（★正解） | 改後 | 規則 | 說明 |
|---|---|---|---|---|---|
| a1-u01-l04-q13 | Would you like rice ____ bread? | of／★or／not／from | of／★or／the／from | 只看英文雙答案 | not 代入成 Would you like rice not bread?（要飯不要麵包）只看英文可成立；換成 the，rice the bread 文法不通 |
| a1-u01-l05-q13 | ____ is your English teacher? | What／His／★Who／All | Her／His／★Who／All | 只看英文雙答案 | What 代入成 What is your English teacher?（問國籍、身分）只看英文可成立；換成 Her，Her is your English teacher? 文法不通 |
| a1-u01-l06-q14 | My grandparents live near the sea. I love ____ very much. | her／you／me／★them | we／they／me／★them | 只看英文雙答案 | 主 session 裁定：you、her 代入成 I love you/her very much. 只看英文本身成立；換成主格 we、they，I love we/they very much 文法不通 |
| a1-u01-l07-q14 | The dog runs ____ the house when it rains. | from／with／★into／by | of／with／★into／on | 只看英文雙答案 | from／by 代入成 The dog runs from the house／runs by the house when it rains 都說得通；換成 of（文法不通）、on（狗在屋子上跑，語意不通） |
| a1-u01-l09-q13 | There are ____ students in the classroom. | these／more／those／★many | these／its／those／★many | 只看英文雙答案 | more 代入成 There are more students in the classroom. 說得通；換成 its，There are its students… 無指涉、語意不通 |
| a1-u01-l09-q14 | Do you have ____ brothers or sisters? | very／★any／only／their | very／★any／our／their | 只看英文雙答案 | only 代入成 Do you have only brothers or sisters? 說得通；換成 our，Do you have our brothers or sisters? 語意不通 |
| a1-u01-l10-q13 | You look tired. You ____ go to bed early. | still／★should／will／over | still／★should／also／over | 只看英文雙答案 | will 代入成 You look tired. You will go to bed early.（命令語氣）說得通；換成 also，前後句接不上、語意不通 |
| a1-u02-l02-q13 | Hi, my ____ is Amy. | age／kid／★name／person | age／man／★name／person | 只看英文雙答案 | kid 代入成 Hi, my kid is Amy.（家長介紹孩子）說得通；換成 man，my man is Amy（Amy 是女生名）語意不通 |
| a1-u02-l03-q14 | ____ you very much! | ★Thank／Need／Personal／Introduce | ★Thank／Sorry／Personal／Introduce | 只看英文雙答案 | 指定必修：Need 換成本課已教的 Sorry，Sorry you very much! 明顯不通（本題免「兩個放得進」） |
| a1-u03-l01-q15 | Today is the ____ day of my new job. | now／one／only／★first | now／one／two／★first | 只看英文雙答案 | 主 session 裁定：only 代入成 Today is the only day of my new job.（一日工作）說得通；換成 two，the two day 文法不通 |
| a1-u03-l03-q13 | He left ten minutes ____. | ★ago／often／later／after | ★ago／often／once／now | 只看英文雙答案 | later、after 代入成 He left ten minutes later／ten minutes after. 都說得通；換成 once（文法勉強、語意不通）、now（不通） |
| a1-u03-l05-q13 | I ____ have tea in the morning. | never／always／★usually／often | soon／early／★usually／late | 只看英文雙答案 | always／often／never 代入成 I always/often/never have tea in the morning. 都說得通；頻率副詞與 usually 同義無法排除，全換成 soon、early、late，放在主詞後文法不通 |
| a1-u03-l05-q14 | Let's watch a movie ____. | later／today／spring／★tonight | never／always／spring／★tonight | 只看英文雙答案、同課共用、四選項同詞性 | later、today 代入成 Let's watch a movie later／today. 都說得通；換成 never、always，Let's watch a movie never/always 文法通但語意不通（never／always 從 q13 移來，免同課共用） |
| a1-u03-l06-q14 | I will see you ____ morning. | this／★tomorrow／afternoon／one | ago／★tomorrow／afternoon／half | 只看英文雙答案 | this、one 代入成 I will see you this morning／one morning. 都說得通；換成 ago、half，see you ago/half morning 文法不通 |
| a1-u04-l01-q13 | I want you to ____ my parents. | thank／social／introduce／★meet | need／social／have／★meet | 只看英文雙答案 | thank、introduce 代入成 I want you to thank/introduce my parents. 都說得通；換成 need、have，I want you to need/have my parents 文法通、語意不通 |
| a1-u04-l01-q14 | My brother and I often play ____. | early／★together／today／there | once／★together／today／always | 只看英文雙答案 | there、early 代入成 My brother and I often play there／play early. 說得通；換成 once、always，與 often 矛盾、語意不通 |
| a1-u05-l01-q14 | My grandfather is eighty. He is very ____. | ★old／new／good／great | ★old／new／foreign／great | 只看英文雙答案 | good 代入成 My grandfather is eighty. He is very good.（身體很好）說得通；換成 foreign，He is very foreign 語意不通 |
| a1-u05-l01-q15 | She plays the piano very ____. | high／big／★well／often | high／big／★well／own | 只看英文雙答案 | 指定必修：often 代入成 She plays the piano very often. 說得通；換成 own，plays the piano very own 文法不通 |
| a1-u05-l02-q15 | My son is only five. He is very ____. | old／big／★young／thing | old／new／★young／thing | 只看英文雙答案 | big 代入成 My son is only five. He is very big.（以年齡來說很高大）說得通；換成 new，He is very new 語意不通 |
| a1-u05-l04-q14 | I feel ____ today. Yesterday I was sick. | important／★better／free／bad | important／★better／white／long | 只看英文雙答案 | bad、free 代入成 I feel bad today／I feel free today. Yesterday I was sick. 說得通；換成 white、long，I feel white/long today 語意不通 |
| a1-u05-l05-q13 | My glass is ____ of water. | free／sure／special／★full | true／sure／special／★full | 只看英文雙答案 | free 代入成 My glass is free of water.（杯裡沒水）說得通；換成 true，My glass is true of water 語意不通 |
| a1-u05-l06-q13 | Sorry, this is the ____ bus. I want the number 5 bus. | ★wrong／red／short／close | ★wrong／easy／short／close | 只看英文雙答案 | red 代入成 Sorry, this is the red bus. I want the number 5 bus. 說得通；換成 easy，the easy bus 語意不通 |
| a1-u06-l03-q13 | I cook dinner in the ____. | tool／yard／★kitchen／machine | tool／box／★kitchen／machine | 只看英文雙答案 | yard 代入成 I cook dinner in the yard.（院子烤肉）說得通；換成 box，cook dinner in the box 語意不通 |
| a1-u07-l01-q13 | Can you ____ here for a minute? | work／★wait／meet／business | excuse／★wait／thank／business | 只看英文雙答案 | work、meet 代入成 Can you work here for a minute?／Can you meet here for a minute? 說得通；換成 excuse、thank（及物動詞缺受詞，文法不通） |
| a1-u07-l02-q14 | He works hard, and his business is very ____. | ★successful／special／meeting／different | ★successful／short／meeting／wrong | 只看英文雙答案 | special、different 代入成 his business is very special/different 說得通；換成 short、wrong，his business is very short/wrong 文法通、語意不通 |
| a1-u07-l04-q12 | It is twelve at night, but the baby is ____. | hurry／★awake／busy／mobile | hurry／★awake／true／mobile | 只看英文雙答案 | busy 代入成 It is twelve at night, but the baby is busy.（還在玩）說得通；換成 true，the baby is true 語意不通 |
| a1-u08-l01-q13 | I am ____. Can we eat now? | ★hungry／full／free／apple | ★hungry／full／sure／apple | 只看英文雙答案 | free 代入成 I am free. Can we eat now?（有空了）說得通；換成 sure，I am sure. Can we eat now? 前後接不上 |
| a1-u08-l04-q14 | My father likes to ____ for the family on Sunday. | chicken／drink／celebrate／★cook | chicken／drink／shower／★cook | 只看英文雙答案 | My father likes to celebrate for the family on Sunday. 只看英文勉強說得通，celebrate 換成 shower（文法可放、為家人淋浴語意不通），drink、shower 兩個動詞放得進空格 |
| a1-u08-l06-q13 | Would you like ____ or sugar in your coffee? | cheese／★cream／butter／juice | cheese／★cream／tomato／juice | 只看英文雙答案 | Would you like butter or sugar in your coffee? 只看英文也說得通（奶油咖啡確有其事），butter 換成 tomato，番茄加咖啡語意不通 |
| a1-u08-l07-q12 | Good morning! ____ is ready. Come and eat. | Lunch／★Breakfast／Morning／Hungry | Dinner／★Breakfast／Morning／Hungry | 只看英文雙答案 | Good morning! Lunch is ready. Come and eat. 上午近中午時也說得通，Lunch 換成 Dinner，早上說晚餐好了語意不通 |
| a1-u09-l01-q14 | I like to ____ jeans and a white shirt. | cook／pretty／★wear／share | cook／pretty／★wear／greet | 只看英文雙答案 | I like to share jeans and a white shirt.（和家人共穿）只看英文勉強說得通，share 換成 greet，向牛仔褲打招呼語意不通，cook、greet 兩個動詞放得進空格 |
| a1-u12-l03-q13 | Can you ____ a horse? | drive／★ride／boat／fly | email／★ride／boat／fly | 只看英文雙答案 | Can you drive a horse? 英文可指駕馬（車），只看英文也成立；drive 換成 email（文法可放、語意不通），仍有 email、fly 兩個動詞放得進空格 |
| a1-u15-l01-q13 | Take an umbrella. It is ____ today. | ★rainy／sunny／snowy／fire | ★rainy／tired／sweet／fire | 只看英文雙答案 | Take an umbrella. It is snowy today.（下雪也撐傘）與 It is sunny today.（撐傘遮陽）只看英文都說得通；snowy 換 sweet、sunny 換 tired，形容詞文法可放但天氣語意不通 |
| a1-u15-l05-q13 | We swim in the sea and play at the ____. | hill／★beach／cow／stone | sky／★beach／cow／stone | 只看英文雙答案 | We swim in the sea and play at the hill. 海邊有山丘時勉強說得通，hill 換成 sky，在天空玩語意不通 |
| a1-u16-l04-q14 | The teacher writes the new words on the ____. | ★board／test／technology／subject | ★board／idea／technology／subject | 只看英文雙答案 | The teacher writes the new words on the test. 只看英文也成立（把新單字出在考卷上），test 換成 idea，寫在主意上語意不通 |
| a1-u16-l09-q12 | How do you ____ your last name? | pencil／copy／★spell／underline | pencil／wash／★spell／underline | 只看英文雙答案 | copy 代入「How do you copy your last name?」情境上說得通，換成 wash（How do you wash your last name? 語意不通） |
| a1-u17-l01-q14 | I don't ____ his phone number. | make／take／go／★know | make／brush／go／★know | 只看英文雙答案 | take 代入「I don't take his phone number.」情境上說得通（不記下他的號碼），換成 brush（I don't brush his phone number. 語意不通） |
| a1-u17-l04-q13 | ____ left at the corner. | ★Turn／Show／Point／Call | ★Turn／Show／Know／Call | 只看英文雙答案 | Point 代入「Point left at the corner.」文法通、勉強可解為在轉角往左指，換成 Know（Know left at the corner. 語意不通） |
| a1-u20-l01-q13 | I was at home ____. | soon／★yesterday／twelve／always | soon／★yesterday／twelve／now | 只看英文雙答案 | always 代入「I was at home always.」文法與語意皆可成立，換成 now（I was at home now. 過去式配 now 語意矛盾；tomorrow 已被他課使用） |
| a1-u21-l02-q14 | Open the ____ door. Someone is there. | gold／★front／living／quickly | glad／★front／living／quickly | 只看英文雙答案 | gold 代入「Open the gold door. Someone is there.」完全說得通（金色的門），換成 glad（the glad door 語意不通） |
| a1-u21-l06-q13 | Don't use that cup. It is ____. | orange／★dirty／super／tight | quiet／★dirty／super／tight | 只看英文雙答案 | orange 代入「Don't use that cup. It is orange.」在合理情境下可成立（指認那個橘色杯子），換成 quiet（杯子安靜，語意不通） |
| a1-u21-l06-q14 | Start on a ____ page. | purple／closed／★blank／broken | rude／closed／★blank／broken | 只看英文雙答案 | purple 代入「Start on a purple page.」說得通（彩色頁的筆記本），換成 rude（a rude page 語意不通） |
| a1-u22-l01-q14 | I ____ toy cars. I have fifty of them. | paint／photo／wash／★collect | spell／photo／answer／★collect | 只看英文雙答案 | paint 代入「I paint toy cars. I have fifty of them.」說得通（模型塗裝嗜好），換成 spell；wash 代入「I wash toy cars.」情境上也說得通，換成 answer（I answer toy cars 文法通、語意不通）（實作端複核：smoke 涉及抽菸題材，改 answer） |
| a2-u01-l01-q15 | We played ____ a very strong team last Sunday. | ★against／beside／near／while | ★against／along／into／while | 只看英文雙答案 | We played near／beside a very strong team last Sunday. 只看英文勉強說得通（在隔壁場地比賽）；換成 along、into，介系詞片語文法通但語意不通 |
| a2-u01-l02-q14 | The food was good. ____, it was too expensive. | Usually／Also／Besides／★However | Together／Tomorrow／Besides／★However | 只看英文雙答案、四選項同詞性 | The food was good. Also, it was too expensive.／Usually, it was too expensive. 只看英文都說得通；換成 Together、Tomorrow（Tomorrow 與過去式 was 衝突），文法通但語意不通 |
| a2-u01-l03-q13 | Look! A big dog is running ____ us. | among／without／against／★toward | while／without／against／★toward | 只看英文雙答案 | A big dog is running among us. 只看英文說得通（狗在我們之間跑）；among 換成 while，後面不能接 us，文法不通 |
| a2-u01-l05-q13 | There was no rice, so we ate bread ____. | forward／later／alone／★instead | forward／rather／exactly／★instead | 只看英文雙答案 | so we ate bread later.／so we ate bread alone.（＝只吃麵包）只看英文都說得通；換成 rather、exactly，放句尾不成句 |
| a2-u01-l06-q13 | ____ came to the meeting, so we went home. | ★Nobody／Whom／All／Somebody | ★Nobody／Whom／All／Himself | 只看英文雙答案 | Somebody came to the meeting, so we went home. 只看英文勉強可成立；換成 Himself，反身代名詞不能當主詞，文法不通 |
| a2-u01-l07-q14 | We cooked the whole dinner ____. | somewhere／himself／★ourselves／except | anymore／himself／★ourselves／except | 只看英文雙答案 | We cooked the whole dinner somewhere. 只看英文文法語意都可成立；換成 anymore，只能用於否定句，文法不通 |
| a2-u01-l08-q14 | We can stay here ____ Sunday. | beyond／★till／latter／during | against／★till／latter／without | 只看英文雙答案 | We can stay here during Sunday.／beyond Sunday. 只看英文都說得通；換成 against、without，介系詞片語文法通但語意不通 |
| a2-u02-l01-q13 | We usually eat lunch at ____. | midnight／night／★noon／breakfast | first／birth／★noon／breakfast | 只看英文雙答案 | We usually eat lunch at midnight／at night. 只看英文勉強說得通（夜班）；換成 at first、at birth，文法通但語意不通 |
| a2-u03-l04-q14 | I can't read your writing. Please write more ____. | ★clearly／simple／smoothly／loudly | ★clearly／simple／silently／loudly | 只看英文雙答案 | I can't read your writing. Please write more smoothly. 只看英文可說得通（字寫得流暢一點）；換成 silently，寫得安靜與看不懂字無關，語意不通 |
| a2-u04-l02-q14 | He ____ to help me with my bags. | seemed／understood／★offered／quit | spilled／understood／★offered／quit | 只看英文雙答案 | He seemed to help me with my bags. 只看英文文法語意都通；換成 spilled，He spilled to help me 語意不通 |
| a2-u04-l04-q13 | Can you ____ me the salt, please? | send／allow／★pass／spill | lose／allow／★pass／spill | 只看英文雙答案 | Can you send me the salt, please? 只看英文可成立（寄鹽給我）；換成 lose，Can you lose me the salt 語意不通 |
| a2-u05-l02-q13 | My parents got ____ in 1990. | sick／crowd／★married／hurt | female／crowd／★married／senior | 只看英文雙答案 | My parents got sick in 1990.／got hurt in 1990. 只看英文都說得通；換成本課 female、senior，get＋形容詞文法通但語意不通 |
| a2-u06-l05-q14 | She felt great ____ when her son finished school. | difficulty／mood／shock／★pride | difficulty／mood／favor／★pride | 只看英文雙答案 | She felt great shock when her son finished school. 只看英文可成立（沒想到他能畢業）；換成 favor，felt great favor 語意不通 |
| a2-u07-l01-q12 | It's raining. Put on your ____. | sweater／★raincoat／diamond／sock | apron／★raincoat／diamond／sock | 只看英文雙答案 | It's raining. Put on your sweater. 只看英文說得通（下雨天冷）；換成 apron，與下雨無關，語意不通 |
| a2-u07-l03-q12 | It's very sunny. Put on your ____. | shampoo／raincoat／★sunglasses／sweater | shampoo／raincoat／★sunglasses／belt | 只看英文雙答案 | 只看英文：It's very sunny. Put on your sweater. 天冷的晴天也說得通，sweater 換成本單元的 belt（晴天要戴的不是皮帶） |
| a2-u07-l03-q13 | She wears a little ____ when she goes out. It smells nice. | ★perfume／earring／bra／diamond | ★perfume／earring／scarf／diamond | 一眼排除 | 指定：bra 換成本單元 scarf；She wears a little scarf... It smells nice. 圍巾不會有香味，語意不通 |
| a2-u08-l02-q15 | My room is ____, on the second floor. | ★upstairs／outside／downstairs／bulb | ★upstairs／outside／yesterday／bulb | 只看英文雙答案 | My room is downstairs, on the second floor. 只看英文可成立（說話者在三樓）；換成 yesterday，My room is yesterday 語意不通 |
| a2-u09-l02-q13 | Hi, where is the ____? I need to check in. | bonus／★receptionist／training／captain | bonus／★receptionist／training／labor | 只看英文雙答案 | captain 代入「Hi, where is the captain? I need to check in.」在郵輪情境說得通，換成本課 labor：「where is the labor」文法通、語意不通 |
| a2-u10-l03-q13 | I'm so ____. Can I have a glass of water? | happy／★thirsty／angry／sad | happy／★thirsty／clever／rich | 只看英文雙答案 | angry／sad 代入「I'm so angry/sad. Can I have a glass of water?」情境上說得通（情緒激動要杯水），換成 clever、rich：「I'm so rich. Can I have a glass of water?」文法通、因果不通 |
| a2-u10-l08-q13 | Do you want your potatoes ____ or fried? | ★boiled／raw／melon／thirsty | ★boiled／wet／melon／thirsty | 只看英文雙答案 | raw 代入「Do you want your potatoes raw or fried?」英文也可成立（生／炸二選一），換成 wet：「potatoes wet or fried」文法通但不是烹調選項，語意不通 |
| a2-u13-l04-q12 | Let's go ____ in the old town this afternoon. | downtown／abroad／tram／★sightseeing | tonight／abroad／tram／★sightseeing | 只看英文雙答案 | downtown 代入「Let's go downtown in the old town this afternoon.」英文說得通（老城區可能就是市中心），換成 tonight：「go tonight ... this afternoon」時間自相矛盾，語意不通 |
| a2-u13-l05-q12 | Wait for the bus at the ____ over there. | traffic light／★bus stop／petrol station／motorway | guidebook／★bus stop／petrol station／motorway | 只看英文雙答案 | traffic light 代入「Wait for the bus at the traffic light over there.」情境上說得通，換成本單元 guidebook：「wait for the bus at the guidebook」文法通、語意不通 |
| a2-u16-l03-q13 | In winter, we go ____ in the snowy mountains. | ★skiing／sailing／cycling／rugby | ★skiing／sailing／swimming／rugby | 只看英文雙答案 | cycling 代入「In winter, we go cycling in the snowy mountains.」英文可能成立（冬季山地騎車），換成 swimming：冬天去積雪山上游泳語意不通 |
| a2-u17-l02-q14 | Could you ____ how this machine works? | hate／★explain／writing／judge | hate／★explain／writing／celebrate | 只看英文雙答案 | judge 代入「Could you judge how this machine works?」情境上說得通（評估運作情形），換成 celebrate：「Could you celebrate how this machine works?」文法通、作為請求語意不通 |
| a2-u17-l03-q13 | Your answer is wrong. There is an ____ in the third line. | idea／essay／explanation／★error | idea／essay／education／★error | 只看英文雙答案 | explanation 代入「Your answer is wrong. There is an explanation in the third line.」英文說得通（第三行有解說），換成本單元 education：「an education in the third line」文法通、語意不通 |
| a2-u18-l01-q13 | Don't throw away the bottles. Please ____ them. | drop／pollute／★recycle／hide | drop／pollute／★recycle／marry | 只看英文雙答案 | hide 代入「Don't throw away the bottles. Please hide them.」情境上說得通，換成 marry：「Please marry them.」（指瓶子）文法通、語意不通 |
| a2-u19-l02-q13 | If you have a problem with the law, talk to a ____. | population／teacher／doctor／★lawyer | population／window／doctor／★lawyer | 只看英文雙答案 | 「If you have a problem with the law, talk to a teacher.」對學生而言勉強說得通，teacher 換成 window，「找窗戶談」語意不通 |
| a2-u19-l07-q12 | I want to send this box to my aunt. Where is the ____? | ★post office／police station／id card／policewoman | ★post office／police station／ID card／policewoman | 縮寫大寫 | 縮寫照實際寫法：id card 改 ID card |
| a2-u19-l07-q13 | My ____ is Kevin, and my surname is Lee. | policeman／id／★first name／police officer | policeman／ID／★first name／police officer | 縮寫大寫 | 縮寫照實際寫法：id 改 ID |
| a2-u20-l03-q13 | My teacher gave me some good ____ about my essay. | ★advice／sound／silence／context | ★advice／sound／silence／screen | 只看英文雙答案 | 「My teacher gave me some good context about my essay.」只看英文說得通（老師給背景說明），context 換成 screen，給作文「好螢幕」語意不通 |
| a2-u20-l05-q13 | My teacher ____ me to read more English books. | paid／chose／pc／★advised | argued／shouted／PC／★advised | 只看英文雙答案、縮寫大寫 | 只看英文：My teacher paid／chose me to read more English books 都說得通，換成本單元的 argued、shouted（後面不能直接接 me to，文法不通）；pc 照實際寫法改 PC。能接「動詞＋me to 讀書」的字代入都說得通，這題做不到「兩個干擾項放得進空格」，比照 a1-u02-l03-q14 請求豁免 |
| a2-u21-l01-q15 | At New Year, we eat ____ food with our family. | bug／boring／plastic／★traditional | bug／rainy／plastic／★traditional | 只看英文雙答案 | 「At New Year, we eat boring food with our family.」文法語意皆可成立，boring 換成 rainy，「下雨的食物」語意不通 |
| a2-u21-l03-q14 | My sister works in ____. She makes posters for new products. | publishing／classic／★advertising／fiction | tradition／classic／★advertising／fiction | 只看英文雙答案 | 「My sister works in publishing. She makes posters for new products.」出版業也做宣傳海報，說得通；publishing 換成 tradition，「works in tradition」文法可放但語意不通 |
| a2-u22-l02-q15 | I was so hungry that I ate the ____ cake by myself! | wrong／★whole／same／several | windy／★whole／same／several | 只看英文雙答案 | 「I was so hungry that I ate the wrong cake by myself!」餓到拿錯蛋糕吃情境可成立，wrong 換成 windy，「風大的蛋糕」語意不通 |
| a2-u22-l04-q14 | Can I have ____ sauce on my pizza? | enough／divide／dry／★extra | social／divide／dry／★extra | 只看英文雙答案 | 「Can I have enough sauce on my pizza?」文法通、語意勉強可成立，enough 換成 social，「社交的醬」語意不通 |
| a2-u23-l03-q12 | The coach told us our ____ for the next game. | truth／purpose／★strategy／affair | truth／evidence／★strategy／affair | 只看英文雙答案 | 「The coach told us our purpose for the next game.」教練說明下場比賽的目標，說得通；purpose 換成 evidence，「下場比賽的證據」語意不通 |
| a2-u24-l02-q14 | My new computer is very ____. It can run big games. | ★powerful／uncertain／heavy／condition | ★powerful／uncertain／sleepy／condition | 只看英文雙答案 | 「My new computer is very heavy. It can run big games.」電競電腦很重也成立，heavy 換成 sleepy，電腦「很睏」語意不通 |
| a2-u25-l02-q13 | You need ____ shoes for hiking in the mountains. | weak／★proper／unusual／opposite | weak／★proper／ancient／opposite | 只看英文雙答案 | 「You need unusual shoes for hiking in the mountains.」可理解為需要特殊的鞋，說得通；unusual 換成 ancient，「古代的鞋」語意不通 |
| a2-u25-l02-q14 | English is ____ used around the world. | seriously／symbol／badly／★widely | seriously／symbol／deeply／★widely | 只看英文雙答案 | 「English is badly used around the world.」英文在全球被用得很差，文法語意皆成立；badly 換成 deeply，「深深地被使用」語意不通 |
| a2-u25-l03-q13 | My grandfather made this ____ chair from an old tree. | golden／silver／★wooden／usual | metal／stone／★wooden／usual | 只看英文雙答案 | 「My grandfather made this golden chair from an old tree.」（塗成金色）勉強成立，silver 同理；golden 換 metal、silver 換 stone，用老樹做出金屬／石頭椅子語意不通 |
| a2-u25-l07-q12 | This singer is ____ in Asia. Everyone knows her. | ★well-known／marvelous／left-hand／unimportant | ★well-known／separate／left-hand／unimportant | 只看英文雙答案 | 「This singer is marvelous in Asia. Everyone knows her.」勉強說得通，marvelous 換成 separate，「歌手在亞洲是分開的」語意不通 |
| a2-u26-l07-q12 | We ____ around the old market for hours. | ★wandered／swam／flew／begged | ★wandered／rained／flew／shone | 只看英文雙答案、跨課重複 | 「We begged around the old market for hours.」在市場乞討幾小時情境可成立，begged 換成 shone，「我們在市場發光」語意不通；swam 因 e5 補丁讓 a2-u16-l03 也用 swim 而跨課重複，改 rained（We rained around… 語意不通） |
| a2-u26-l07-q13 | Hold on to the ____ and climb up slowly. | float／★rope／wave／successfully | knock／★rope／wave／successfully | 只看英文雙答案 | 「Hold on to the float and climb up slowly.」泳池抓著浮板爬上去說得通，float 換成 knock，「抓住敲擊聲」語意不通 |
| a2-u27-l04-q14 | Big dogs ____ my little brother. | confuse／pity／★terrify／regret | invent／pity／★terrify／regret | 只看英文雙答案 | 「Big dogs confuse my little brother.」完全成立，confuse 換成 invent，「大狗發明我弟弟」語意不通 |
| a2-u27-l05-q12 | "Who ate my cake?" she shouted ____. | happily／luckily／softly／★angrily | partly／luckily／softly／★angrily | 只看英文雙答案 | 「"Who ate my cake?" she shouted happily.」開玩笑情境勉強成立，happily 換成 partly，「部分地大叫」語意不通 |
| a2-u27-l06-q13 | A ____ old woman showed me the way to the station. | greedy／laziness／★kindly／silly | square／laziness／★kindly／wooden | 只看英文雙答案 | 「A silly old woman showed me the way…」與「A greedy old woman…」都成立；silly 換 wooden、greedy 換 square，用於人語意不通 |

## 五、這輪改到選項或題幹的題 id（以 9010ffa 為基準）

- mcq 選項（89 題，題幹都沒改）：a1-u01-l04-q13、a1-u01-l05-q13、a1-u01-l06-q14、a1-u01-l07-q14、a1-u01-l09-q13、a1-u01-l09-q14、a1-u01-l10-q13、a1-u02-l02-q13、a1-u02-l03-q14、a1-u03-l01-q15、a1-u03-l03-q13、a1-u03-l05-q13、a1-u03-l05-q14、a1-u03-l06-q14、a1-u04-l01-q13、a1-u04-l01-q14、a1-u05-l01-q14、a1-u05-l01-q15、a1-u05-l02-q15、a1-u05-l04-q14、a1-u05-l05-q13、a1-u05-l06-q13、a1-u06-l03-q13、a1-u07-l01-q13、a1-u07-l02-q14、a1-u07-l04-q12、a1-u08-l01-q13、a1-u08-l04-q14、a1-u08-l06-q13、a1-u08-l07-q12、a1-u09-l01-q14、a1-u12-l03-q13、a1-u15-l01-q13、a1-u15-l05-q13、a1-u16-l04-q14、a1-u16-l09-q12、a1-u17-l01-q14、a1-u17-l04-q13、a1-u20-l01-q13、a1-u21-l02-q14、a1-u21-l06-q13、a1-u21-l06-q14、a1-u22-l01-q14、a2-u01-l01-q15、a2-u01-l02-q14、a2-u01-l03-q13、a2-u01-l05-q13、a2-u01-l06-q13、a2-u01-l07-q14、a2-u01-l08-q14、a2-u02-l01-q13、a2-u03-l04-q14、a2-u04-l02-q14、a2-u04-l04-q13、a2-u05-l02-q13、a2-u06-l05-q14、a2-u07-l01-q12、a2-u07-l03-q12、a2-u07-l03-q13、a2-u08-l02-q15、a2-u09-l02-q13、a2-u10-l03-q13、a2-u10-l08-q13、a2-u13-l04-q12、a2-u13-l05-q12、a2-u16-l03-q13、a2-u17-l02-q14、a2-u17-l03-q13、a2-u18-l01-q13、a2-u19-l02-q13、a2-u19-l07-q12、a2-u19-l07-q13、a2-u20-l03-q13、a2-u20-l05-q13、a2-u21-l01-q15、a2-u21-l03-q14、a2-u22-l02-q15、a2-u22-l04-q14、a2-u23-l03-q12、a2-u24-l02-q14、a2-u25-l02-q13、a2-u25-l02-q14、a2-u25-l03-q13、a2-u25-l07-q12、a2-u26-l07-q12、a2-u26-l07-q13、a2-u27-l04-q14、a2-u27-l05-q12、a2-u27-l06-q13
- 單字卡四選一選項（glossZh 或 distractorsZh 有變，6 張）：a2-u03-l08-q02、a2-u14-l01-q05、a2-u19-l04-q04、a2-u19-l06-q01、a2-u24-l01-q04、a2-u26-l01-q04
- 單字卡例句（exampleEn 或 exampleZh 有變，9 張）：a1-u23-l06-q01、a2-u03-l08-q02、a2-u14-l01-q05、a2-u19-l04-q04、a2-u19-l06-q01、a2-u24-l01-q04、a2-u26-l01-q04、a2-u26-l04-q02、a2-u27-l06-q02
- 改了 glossZh 的卡：a2-u03-l08-q02、a2-u14-l01-q05、a2-u19-l04-q04、a2-u19-l06-q01、a2-u24-l01-q04、a2-u26-l01-q04

## 六、盲答後補修（基準 63f6152）

| 題 id | 題幹 | 改前（★正解） | 改後 | 說明 |
|---|---|---|---|---|
| a1-u01-l09-q13 | There are ____ students in the classroom. | these／its／those／★many | into／its／than／★many | 重新盲答提示 these、those 勉強合文法；換成本單元已教、放進空格明顯不通的 into、than。適用「只看英文唯一可解」優先（執行長裁示） |
