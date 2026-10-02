# C1 第 2 批（c1-u11～u35）兩關審查修正對照表

依執行長 c1b2 裁示（2026-10-03，t9/c1b2-rulings.md）與後續兩項裁示：
- 先把第②關判題寫入：盲答 195 題位，全部和正解一致、0 多解。
- 修正內容：
  - 第②關 77 條（含疑似）全修；第③關 FIX 91 條全修；兩份第③關疑似（A 15 條、B 20 條）照裁示與審查建議改。
  - 評分要點：第 2 批 103 條、第 1 批 171 條（執行長裁示一併改）全部改成「例如…等」，「常用 X」改成「X 的用法，例如…等」，不寫死位置與時態。
  - chauffer：曾依授權改課綱為 chauffeur，但 lexicon 沒有該字，npm test 的課綱測試擋下；依執行長裁示撤回，課綱、word-topics、allowlist 維持原狀，c1-u12-l02 照 ECDICT 教「小型輕便爐」，釋義第二段註明「舊式，罕用」。誤植由執行長列報告，之後在 data 層處理。
  - 中文欄人名一律保留英文；一般單字組成的專名換掉：Green Leaf→Torvan、Blue Door→Lumo、Elm Hill→Marlow、Riverside→Kelton、Reed→Kirwan、Lily→Nadia。
  - 聽選長度名次：u11～u20 這 20 題調成名次 1–4 各 25%（7 題調干擾項長度，正解位置不動）；第 2 批 39 題 25.6／25.6／28.2／20.5%。
- 每處修改都記在各課 judge.resolvedAfterFinalReview。
- 下表由腳本比對審查版（68c0865）與現行檔逐欄產生。

## 一、改到選項、題幹、音檔或短文的題 id（請安排重新盲答）

第 1 批只改評分要點，沒有改到選項或題幹。

### 選項有變動（36 題位）
c1-u11-l01-q15#1、c1-u13-l01-q08、c1-u13-l01-q11、c1-u13-l01-q13#0、c1-u13-l01-q13#1、c1-u14-l02-q12、c1-u15-l02-q11、c1-u15-l02-q14、c1-u15-l02-q16#1、c1-u16-l01-q09、c1-u17-l02-q09、c1-u17-l02-q12、c1-u18-l01-q10、c1-u18-l02-q13、c1-u19-l01-q09、c1-u19-l01-q12、c1-u20-l01-q16#1、c1-u20-l02-q13、c1-u20-l02-q14、c1-u20-l02-q15#0、c1-u20-l03-q10、c1-u20-l03-q15#0、c1-u20-l03-q15#1、c1-u22-l02-q10、c1-u23-l01-q09、c1-u25-l01-q11、c1-u26-l01-q09、c1-u26-l01-q12、c1-u27-l01-q12、c1-u28-l01-q11、c1-u29-l01-q16#1、c1-u30-l01-q11、c1-u32-l01-q15、c1-u34-l01-q13#1、c1-u34-l02-q11、c1-u35-l01-q11

### 題幹、音檔、短文或小題題目有變動（51 處）
c1-u11-l01-q10（audioEn）、c1-u11-l01-q15（passageEn）、c1-u13-l01-q11（stemEn）、c1-u13-l01-q13（passageEn）、c1-u15-l01-q14（stemEn）、c1-u15-l02-q15（stemEn）、c1-u17-l01-q14（questions/0/questionZh）、c1-u18-l03-q14（stemEn）、c1-u20-l01-q16（questions/1/questionZh）、c1-u20-l02-q15（passageEn）、c1-u20-l02-q15（questions/0/questionZh）、c1-u20-l02-q15（questions/1/questionZh）、c1-u20-l03-q10（audioEn）、c1-u20-l03-q10（questionZh）、c1-u20-l03-q13（stemEn）、c1-u21-l01-q15（passageEn）、c1-u22-l01-q14（stemEn）、c1-u22-l01-q16（passageEn）、c1-u22-l01-q16（questions/0/questionZh）、c1-u22-l02-q14（stemEn）、c1-u22-l02-q15（passageEn）、c1-u22-l03-q10（audioEn）、c1-u22-l03-q10（questionZh）、c1-u22-l03-q14（stemEn）、c1-u23-l01-q09（audioEn）、c1-u23-l01-q09（questionZh）、c1-u23-l01-q13（stemEn）、c1-u23-l01-q14（passageEn）、c1-u24-l01-q14（stemEn）、c1-u24-l01-q16（questions/0/questionZh）、c1-u24-l01-q16（questions/1/questionZh）、c1-u25-l02-q12（stemEn）、c1-u26-l01-q13（stemEn）、c1-u26-l01-q14（passageEn）、c1-u26-l01-q14（questions/0/questionZh）、c1-u27-l01-q13（questions/0/questionZh）、c1-u27-l01-q13（questions/1/questionZh）、c1-u28-l01-q12（stemEn）、c1-u28-l01-q13（passageEn）、c1-u29-l01-q14（stemEn）、c1-u29-l01-q15（stemEn）、c1-u29-l01-q16（passageEn）、c1-u29-l01-q16（questions/1/questionZh）、c1-u30-l01-q11（stemEn）、c1-u30-l01-q13（passageEn）、c1-u30-l01-q13（questions/1/questionZh）、c1-u31-l01-q13（stemEn）、c1-u31-l01-q14（passageEn）、c1-u34-l01-q13（passageEn）、c1-u34-l02-q12（stemEn）、c1-u34-l02-q13（passageEn）

## 二、不改或未照建議改的項目與理由

| 來源 | 題 id | 建議 | 處理與理由 |
|---|---|---|---|
| 第②關疑似 | c1-u21-l01-q07 repute | 若 CEFR-J 列名詞，第一義應為「名聲」 | 查 lexicon：repute 名詞列 C2、動詞列 C1；本課是 C1 課綱字，所以教動詞 be reputed to，不改 |
| 裁示 | demo、carrier、synthetic 第一義 | — | 依裁示維持 |
| 裁示 | c1-u12-l02 chauffer | 兩關都建議改教 chauffeur | 依執行長裁示撤回更正，照 ECDICT 教「小型輕便爐」並註明罕用；誤植改在 data 層處理 |
| 第③關 B 疑似 1 | c1-u22-l01 preach、salvation、preacher | 改成非宗教義 | 依裁示課綱照教、只用中性事實句；只改了 prophet「找先知問未來」那句 |
| 第③關 B 疑似 20 | c1-u35-l01 閱讀「剝削海外廉價勞工」 | 審查員說可保留 | 單字卡已改教「開發、利用」，閱讀保留（非童工、屬企業爭議的中性敘述） |
| 第③關 A 疑似 2 | c1-u12-l01 niche | 建議卡改 vase in the niche above the fireplace | 閱讀已有「客廳牆上壁龕擺花瓶」，改用「大門上方壁龕裡的小石像」避開雷同 |
| 第③關 A 2-C | c1-u12-l01 sedentary | 建議卡改爺爺退休後少活動 | 避免年長者刻板印象，改成「我的工作很少走動，一天大部分時間都坐著」 |
| 自查 | grandmother／grandfather 譯「奶奶／爺爺」 | — | 全級沿用的譯法，未逐一改成中性稱謂；brother、sister、cousin、uncle 這類會多加長幼或父系資訊的已全部改掉 |

## 三、逐欄改動：第 2 批（322 欄）

| 題 id | 欄位 | 改前 | 改後 |
|---|---|---|---|
| c1-u11-l01-q10 | audioEn | Wearing his team's jersey, my brother cheered loudly for two hours. | Wearing his team's jersey, my older brother cheered loudly for two hours. |
| c1-u11-l01-q10 | audioZh | 我哥哥穿著他支持球隊的球衣，大聲加油了兩個小時。 | 我哥哥穿著他球隊的球衣，大聲加油了兩個小時。 |
| c1-u11-l01-q15 | passageEn | For the school play, my sister needed a costume for the role of a queen. A local tailor offered to make a long red cloak for her, and her friends decorated a crown with plastic gems. During practice, the director kept reminding her about her posture: "A queen never looks at the floor!" On the night of the show, the stage lights turned her into a dark silhouette at the start of the first scene, and the audience went quiet. Her partner, a muscular boy from the basketball team, played the king and wore his basketball jersey under his long coat. It was an exhilarating evening for the whole family. | For the school play, my younger sister needed a costume for the role of a queen. A local tailor offered to make a long red cloak for her, and her friends decorated a crown with plastic gems. During practice, the director kept reminding her about her posture: "A queen never looks at the floor!" On the night of the show, the stage lights turned her into a dark silhouette at the start of the first scene, and the audience went quiet. Her partner, a muscular boy from the basketball team, played the king and wore his basketball jersey under his long coat. It was an exhilarating evening for the whole family. |
| c1-u11-l01-q15 | questions/1/options | 不要忘記台詞／說話要大聲一點／注意姿勢，皇后不會看地板／早點到排練場 | 千萬別忘記台詞／說話聲音要再大一點／要抬頭挺胸、注意姿勢／每天早點到排練場 |
| c1-u11-l01-q16 | rubricZh | tailor 當動詞表示「量身調整」，常用 tailor A to B（例如 tailor this course to…、be tailored to…）／「需要」可寫 needs 等 | tailor 當動詞表示「量身調整」，用法例如 tailor A to B、be tailored to… 等／「需要」可寫，例如 needs、what each student needs 等 |
| c1-u11-l01-q17 | rubricZh | gem 可比喻「珍貴的人或物」（例如 a hidden gem、a real gem）／句子要說到你自己知道的地方或東西 | gem 可比喻「珍貴的人或物」（例如 a hidden gem、a real gem 等）／句子要說到你自己知道的地方或東西 |
| c1-u12-l01-q03 | exampleEn | The shop has found a niche selling soap made by hand. | A small stone statue stands in a niche above the front door. |
| c1-u12-l01-q03 | exampleZh | 這家店靠賣手工肥皂找到了自己的市場利基。 | 一尊小石像立在大門上方的壁龕裡。 |
| c1-u12-l01-q03 | glossZh | 利基、合適的位置；壁龕 | 壁龕；合適的位置、利基 |
| c1-u12-l01-q03 | distractorsZh | 倉庫；屋頂／對手；地下室／廣告；陽台 | 屋簷；對手／閣樓；廣告／陽台；倉庫 |
| c1-u12-l01-q06 | exampleEn | A sedentary job can make it hard to stay fit. | My job is quite sedentary, so I sit for most of the day. |
| c1-u12-l01-q06 | exampleZh | 久坐不動的工作可能讓人很難保持好體態。 | 我的工作很少走動，一天大部分時間都坐著。 |
| c1-u12-l01-q15 | referenceEn | All the fixtures in the bathroom are new.／Every fixture in the bathroom is brand new. | All the fixtures in the bathroom are new.／Every fixture in the bathroom is new. |
| c1-u12-l01-q15 | rubricZh | fixture 表示「（屋內固定的）設備」，常用複數 fixtures（例如 all the fixtures）／主詞是複數就用 are、單數就用 is（例如 All the fixtures are、Every fixture is） | fixture 表示「（屋內固定的）設備」（例如 all the fixtures、the kitchen fixtures 等）／主詞與動詞要一致（例如 All the fixtures are、Every fixture is 等） |
| c1-u12-l01-q16 | rubricZh | appliance 表示「家電」（例如 the appliance I use most、a kitchen appliance）／句子要說到你自己家裡的家電 | appliance 表示「家電」（例如 the appliance I use most、a kitchen appliance 等）／句子要說到你自己家裡的家電 |
| c1-u12-l02-q07 | glossZh | 小型輕便爐（舊式） | 小型輕便爐；（舊式，罕用） |
| c1-u12-l02-q15 | rubricZh | lavatory 表示「廁所」，是較正式的說法／間接問句語序是 where the lavatory is（例如 could you tell me where the lavatory is） | lavatory 表示「廁所」，是較正式的說法／直接問句或間接問句都可以（例如 Where is the lavatory?、Could you tell me where it is? 等） |
| c1-u12-l02-q16 | rubricZh | conservatory 在這裡指「（附屬於住家的）玻璃溫室」／談假設的情況可用 If I had…, I would…、I would like… 等／句子要說到你自己 | conservatory 在這裡指「（附屬於住家的）玻璃溫室」／談假設的情況可寫，例如 If I had…, I would…、I would like… 等／句子要說到你自己 |
| c1-u13-l01-q07 | sentenceEn | Pour the batter into the pan and cook it for two minutes. | The batter was too thick, so she added more milk. |
| c1-u13-l01-q07 | sentenceZh | 把麵糊倒進鍋裡，煎兩分鐘。 | 麵糊太稠了，所以她又加了一些牛奶。 |
| c1-u13-l01-q08 | options | He eats a lot.／He reads books very quickly.／He writes stories.／He hates reading. | He eats a lot.／He reads books very quickly.／He writes long stories every week.／He hates reading. |
| c1-u13-l01-q11 | stemEn | This part of the box shows how many ____ are in one serving. | Each cookie gives you about ninety ____ of energy. |
| c1-u13-l01-q11 | stemZh | 盒子上的這個地方標示一份含有多少卡路里。 | 每片餅乾大約提供九十卡路里的熱量。 |
| c1-u13-l01-q11 | options | minutes／kilometers／calories／pages | degrees／liters／calories／kilograms |
| c1-u13-l01-q11 | optionGlossZh | 分鐘／公里／卡路里／頁 | 度／公升／卡路里／公斤 |
| c1-u13-l01-q13 | passageEn | Every Sunday, my father makes pancakes for the whole family. He mixes the batter the night before, so it is ready when we wake up. My little brother has a voracious appetite and can eat six pancakes in a row. My mother prefers half a grapefruit and some yogurt. Last week, my sister read the side of the chocolate sauce bottle and was surprised by the number of calories, so now she uses honey instead. My father also cooks sausages slowly until they are succulently juicy. We all sit together and munch happily for an hour. For us, Sunday breakfast is pure bliss. | Every Sunday, my father makes pancakes for the whole family. He mixes the batter the night before, so it is ready when we wake up. My little brother has a voracious appetite and can eat six pancakes in a row. My mother prefers half a grapefruit and some yogurt. Last week, my older sister read the side of the chocolate sauce bottle and was surprised by the number of calories, so she read it out loud to all of us. My father also cooks sausages slowly until they are succulently tender. We all sit together and munch happily for an hour. For us, Sunday breakfast is pure bliss. |
| c1-u13-l01-q13 | passageZh | 每個星期天，我爸爸都會為全家做鬆餅。他前一天晚上就先調好麵糊，這樣我們起床時就準備好了。我弟弟食量驚人，一口氣可以吃六片鬆餅。我媽媽比較喜歡吃半顆葡萄柚配優格。上週，我姊姊看了巧克力醬瓶身上的資訊，被它的熱量嚇了一跳，所以現在改用蜂蜜。爸爸也會把香腸慢慢煎到鮮嫩多汁。我們全家坐在一起，開心地吃上一個小時。對我們來說，星期天的早餐就是最大的幸福。 | 每個星期天，我爸爸都會為全家做鬆餅。他前一天晚上就先調好麵糊，這樣我們起床時就準備好了。我弟弟食量驚人，一口氣可以吃六片鬆餅。我媽媽比較喜歡吃半顆葡萄柚配優格。上週，我姊姊看了巧克力醬瓶身上的資訊，被它的熱量嚇了一跳，就大聲讀給我們全家聽。爸爸也會把香腸慢慢煎到鮮嫩多汁。我們全家坐在一起，開心地吃上一個小時。對我們來說，星期天的早餐就是最大的幸福。 |
| c1-u13-l01-q13 | questions/0/options | 這樣大家起床時就準備好了／他早上要上班／麵糊放冰箱比較好／媽媽要求的 | 早上起床就能直接拿來用／他早上要很早出門上班／麵糊放冰箱一晚比較好／媽媽要求他這麼做的 |
| c1-u13-l01-q13 | questions/1/options | 決定以後都不吃鬆餅了／改用蜂蜜來代替／告訴媽媽／丟掉瓶子 | 決定以後都不吃鬆餅了／大聲讀給全家人聽／拍照傳給朋友／把瓶子丟掉 |
| c1-u13-l01-q14 | rubricZh | calorie 是可數名詞，數量大於一用複數 calories／「大約」可寫 about、around 等／可寫 has…、There are…in… 等 | calorie 是可數名詞，數量大於一用複數 calories／「大約」可寫，例如 about、around 等／句型可寫，例如 has…、There are…in… 等 |
| c1-u13-l01-q15 | rubricZh | munch 表示「津津有味地吃、大聲嚼」，可接受詞或 on（例如 munch popcorn、munch on apples）／句子要說到你自己 | munch 表示「津津有味地吃、大聲嚼」（例如 munch popcorn、munch on apples 等）／句子要說到你自己 |
| c1-u14-l01-q11 | sentenceEn | Long hours at the computer can cause eye fatigue. | By the end of the long trip, fatigue showed on everyone's faces. |
| c1-u14-l01-q11 | sentenceZh | 長時間使用電腦可能會造成眼睛疲勞。 | 長途旅行快結束時，每個人臉上都露出疲態。 |
| c1-u14-l01-q15 | rubricZh | cavity 在牙齒上指「蛀牙洞」（例如 have a cavity）／「說」可寫 said、told me 等；時態可配合 said 用 have 或 had | cavity 在牙齒上指「蛀牙洞」（例如 have a cavity 等）／「說」可寫，例如 said、told me 等；時態配合 said 用 have 或 had 都可以 |
| c1-u14-l01-q16 | rubricZh | adrenaline 表示「腎上腺素；刺激感」（例如 a rush of adrenaline、gets my adrenaline going）／句子要說到你自己的經驗 | adrenaline 表示「腎上腺素；刺激感」（例如 a rush of adrenaline、gets my adrenaline going 等）／句子要說到你自己的經驗 |
| c1-u14-l02-q04 | glossZh | 身體素質；肢體表現 | 身體對抗；肢體表現 |
| c1-u14-l02-q05 | exampleEn | This salve can soothe dry and cracked lips. | She keeps a small tin of salve in her bag. |
| c1-u14-l02-q05 | exampleZh | 這種藥膏可以舒緩乾裂的嘴唇。 | 她包包裡放著一小罐藥膏。 |
| c1-u14-l02-q12 | options | incisor／incision／physicality／fatigue | incisor／incision／midwife／fatality |
| c1-u14-l02-q12 | optionGlossZh | 門牙／切口／肢體表現／疲勞 | 門牙／切口／助產士／死亡事故 |
| c1-u14-l02-q14 | passageZh | 接下第一個重要角色之前，那位年輕女演員和一位動作教練合作，加強她在舞台上的肢體表現。教練教她不假思索地對刺激做出反應，例如突然的聲響或光線的變化。首演當晚，她緊張得手心又冷又濕，但演出一開始，她就忘了害怕，觀眾也熱情洋溢。演出後，導演告訴她，怯場並不表示她缺乏天分，就連知名演員也會怯場。報上一篇溫暖的評論，是她辛苦好幾個星期之後一份令人欣慰的安慰。 | 接下第一個重要角色之前，那位年輕女演員和一位動作教練合作，加強她在舞台上的肢體表現。教練教她不假思索地對刺激做出反應，例如突然的聲響或光線的變化。首演當晚，她緊張得手心又冷又濕，但演出一開始，她就忘了害怕，觀眾也熱情洋溢。演出後，導演告訴她，怯場並不表示她缺乏天分，就連知名演員也會怯場。報上一篇溫暖的評論，對她辛苦了好幾個星期的努力是很大的安慰。 |
| c1-u14-l02-q15 | rubricZh | incisor 表示「門牙」（例如 one of his incisors、a front incisor）／時態可用過去式或現在完成式（例如 lost、has lost） | incisor 表示「門牙」（例如 one of his incisors、a front incisor 等）／時態可用過去式或現在完成式（例如 lost、has lost 等） |
| c1-u14-l02-q16 | rubricZh | stimuli 是 stimulus 的複數，表示「刺激」，動詞用複數（例如 stimuli that make…）／句子要說到你自己 | stimuli 是 stimulus 的複數，表示「刺激」，動詞要配合複數（例如 stimuli that make…、these stimuli are 等）／句子要說到你自己 |
| c1-u15-l01-q13 | sentenceEn | The protagonist of the novel is a lonely fisherman. | Readers quickly fall in love with the shy protagonist of this novel. |
| c1-u15-l01-q13 | sentenceZh | 這部小說的主角是一位孤單的漁夫。 | 讀者很快就愛上這部小說裡那位害羞的主角。 |
| c1-u15-l01-q14 | stemEn | The ____ of the film comes when the two brothers finally meet again. | The music grows louder and louder as the song reaches its ____. |
| c1-u15-l01-q14 | stemZh | 這部電影的高潮，是兩兄弟終於重逢的那一刻。 | 歌曲來到高潮時，音樂越來越大聲。 |
| c1-u15-l01-q17 | rubricZh | screenwriter 表示「（電影）編劇」／「得過獎」可寫 has won awards、has won prizes、award-winning 等 | screenwriter 表示「（電影）編劇」／「得過獎」可寫，例如 has won awards、has won prizes、award-winning 等 |
| c1-u15-l01-q18 | rubricZh | quest 表示「追尋、探索」，常用 be on a quest to＋原形動詞（例如 I am on a quest to find…）／句子要說到你自己 | quest 表示「追尋、探索」，用法例如 be on a quest to find…、my quest for… 等／句子要說到你自己 |
| c1-u15-l02-q03 | exampleEn | My uncle still has a darkroom in his basement. | My neighbor still has a darkroom in his basement. |
| c1-u15-l02-q03 | exampleZh | 我叔叔的地下室裡還有一間暗房。 | 我鄰居的地下室裡還有一間暗房。 |
| c1-u15-l02-q11 | options | Outside in the sun／In a bright studio／At a big factory／A dark room | Outside in the warm sun／In a studio／At a factory／In a dark room |
| c1-u15-l02-q12 | sentenceZh | 那位喜劇演員能把知名歌手模仿得唯妙唯肖。 | 那位喜劇演員能把知名歌手模仿得維妙維肖。 |
| c1-u15-l02-q14 | options | climactic／rudimentary／bearded／clammy | climactic／strapping／bearded／clammy |
| c1-u15-l02-q14 | optionGlossZh | 高潮的／簡陋的／留鬍子的／濕冷黏膩的 | 高潮的／高大結實的／留鬍子的／濕冷黏膩的 |
| c1-u15-l02-q15 | stemEn | His ____ of the head teacher made the whole class laugh. | The show included a funny ____ of a famous football coach. |
| c1-u15-l02-q15 | stemZh | 他模仿校長，讓全班哈哈大笑。 | 表演中有一段模仿知名足球教練的爆笑橋段。 |
| c1-u15-l02-q16 | passageZh | 學生的期末表演一開始完全是一場鬧劇，滿是搞笑的服裝和吵鬧的笑話。觀眾很喜歡一個男生模仿校長，他模仿得太像了，連校長本人都笑了。不過，下半場的感人之處讓大家意外：一個女孩朗讀她寫給住在遠方的奶奶的一封信，很多家長都哭了。表演最後，由學校最有天分的學生演奏小提琴協奏曲，把氣氛推到最高點，觀眾自發地熱烈鼓掌。就藝術表現而言，這是學校有史以來最好的一場表演。當晚的照片後來在學校的老暗房裡沖洗出來。 | 學生的期末表演一開始完全是一場鬧劇，滿是搞笑的服裝和吵鬧的笑話。觀眾很喜歡一個男生模仿校長，他模仿得太像了，連校長本人都笑了。不過，下半場的感人之處讓大家意外：一個女孩朗讀一封給住在遠方的奶奶的信，很多家長都哭了。表演最後，由學校最有天分的學生演奏小提琴協奏曲，把氣氛推到最高點，觀眾自發地熱烈鼓掌。就藝術表現而言，這是學校有史以來最好的一場表演。當晚的照片後來在學校的老暗房裡沖洗出來。 |
| c1-u15-l02-q16 | questions/1/options | 全體學生一起大合唱／最優秀的學生演奏小提琴協奏曲／校長上台致詞／播放一部短片 | 全體學生一起上台大合唱／一位學生演奏小提琴協奏曲／校長上台說了一段話／播放一部學生拍的短片 |
| c1-u15-l02-q17 | rubricZh | farce 可比喻「荒唐可笑的事、鬧劇」（例如 a complete farce）／「根本是」可寫 a complete…、nothing but… 等 | farce 可比喻「荒唐可笑的事、鬧劇」（例如 a complete farce 等）／「根本是」可寫，例如 a complete…、nothing but… 等 |
| c1-u15-l02-q18 | rubricZh | artistically 表示「在藝術上」，可放句首或形容詞前（例如 Artistically, …、artistically impressive）／句子要說出你自己的評論 | artistically 表示「在藝術上」，位置有彈性（例如 Artistically, …、is artistically designed 等）／句子要說出你自己的評論 |
| c1-u15-l03-q11 | sentenceEn | A street fiddler played cheerful tunes outside the station. | He became a fiddler in a small folk band after college. |
| c1-u15-l03-q11 | sentenceZh | 一位街頭提琴手在車站外拉著輕快的曲子。 | 他大學畢業後，成了一個小型民謠樂團的提琴手。 |
| c1-u15-l03-q12 | sentenceEn | I am completely unmusical; I can't even clap in time. | Even an unmusical person can enjoy a good concert. |
| c1-u15-l03-q12 | sentenceZh | 我完全不懂音樂，連跟著節拍拍手都不會。 | 就算是不懂音樂的人，也能欣賞一場好的音樂會。 |
| c1-u15-l03-q16 | rubricZh | poetess 是「女詩人」的舊稱，現多用 poet；兩種寫法都收／講過去的人用過去式（例如 was）／「十九世紀」可寫 in／of the nineteenth century 等 | poetess 是「女詩人」的舊稱，現多用 poet；兩種寫法都收／時態配合內容（例如 was、is remembered as 等）／「十九世紀」可寫，例如 in the nineteenth century、of the nineteenth century 等 |
| c1-u15-l03-q17 | referenceEn | My father is so unmusical that he can't tell two songs apart.／I used to think I was unmusical, but now I enjoy singing in a choir. | Nobody in my family is unmusical; we all play an instrument.／I used to think I was unmusical, but now I enjoy singing in a choir. |
| c1-u15-l03-q17 | rubricZh | unmusical 表示「不懂音樂的、沒有音樂細胞的」（例如 so unmusical that…、was unmusical）／句子要說到你自己或家人／時態配合內容（例如 is、used to think） | unmusical 表示「不懂音樂的、沒有音樂細胞的」（例如 so unmusical that…、was unmusical 等）／句子要說到你自己或家人／時態配合內容（例如 is、used to think 等） |
| c1-u16-l01-q09 | options | Swimming in the pool／Jumping on a trampoline outside／Watching cartoons inside／Playing cards at home | Swimming in the pool／Jumping on a trampoline／Watching cartoons inside all day／Playing cards at home with friends |
| c1-u16-l01-q15 | rubricZh | amateur 當形容詞放在名詞前，表示「業餘的」（例如 an amateur competition）／「不用付錢」可寫 it is free、you don't have to pay 等 | amateur 當形容詞表示「業餘的」（例如 an amateur competition、amateur players 等）／「不用付錢」可寫，例如 it is free、you don't have to pay 等 |
| c1-u16-l01-q16 | rubricZh | stamina 表示「耐力、體力」，是不可數名詞（例如 the stamina to…、more stamina）／句子要說到你自己 | stamina 表示「耐力、體力」，是不可數名詞（例如 the stamina to…、more stamina 等）／句子要說到你自己 |
| c1-u17-l01-q14 | passageZh | 去年，李家離開城裡的小公寓，搬到大約一小時車程外的郊區小鎮。他們的新房子坐落在一片安靜的土地上，旁邊是一座林木茂密的山丘。這裡地勢陡峭，所以孩子們騎腳踏車都很小心。山丘後面有一座舊採石場，已經改建成可以游泳的湖。週末時，一家人會去附近半島上的蘋果園，那裡的海景非常美。父母說，這次搬家對每個人都有好處，只是開車上班的路程變長了。 | 去年，Lee 家離開城裡的小公寓，搬到大約一小時車程外的郊區小鎮。他們的新房子坐落在一片安靜的土地上，旁邊是一座林木茂密的山丘。這裡地勢陡峭，所以孩子們騎腳踏車都很小心。山丘後面有一座舊採石場，已經改建成可以游泳的湖。週末時，一家人會去附近半島上的蘋果園，那裡的海景非常美。父母說，這次搬家對每個人都有好處，只是開車上班的路程變長了。 |
| c1-u17-l01-q14 | questions/0/questionZh | 李家的新房子在哪裡？ | Lee 家的新房子在哪裡？ |
| c1-u17-l01-q15 | rubricZh | peninsula 表示「半島」，住在半島上用 on（例如 live on a peninsula）／「風景很美」可寫 with beautiful views、very beautiful 等 | peninsula 表示「半島」（例如 live on a peninsula、a small peninsula 等）／「風景很美」可寫，例如 with beautiful views、very beautiful 等 |
| c1-u17-l01-q16 | rubricZh | suburban 是形容詞，放在名詞前（例如 suburban life、a suburban area）／句子要說出你自己的理由 | suburban 是形容詞，位置有彈性（例如 suburban life、a suburban area、is suburban 等）／句子要說出你自己的理由 |
| c1-u17-l02-q05 | glossZh | 路邊（的）；路旁 | 路邊（的）；半途被淘汰 |
| c1-u17-l02-q05 | distractorsZh | 山頂（的）／地下（的）／屋頂（的） | 山頂（的）；半途放棄／地下（的）；暗中進行／屋頂（的）；高高在上 |
| c1-u17-l02-q09 | options | A glass tunnel／A large outdoor pool／A cafe on the roof／Free boat rides | A tunnel of glass／A large outdoor pool／A cafe on the roof／Free boat rides |
| c1-u17-l02-q10 | sentenceEn | Our children could spend all day at the aquarium. | My neighbor keeps tropical fish in an aquarium in his bedroom. |
| c1-u17-l02-q10 | sentenceZh | 我們的孩子可以在水族館待上一整天。 | 我鄰居在他房間的魚缸裡養熱帶魚。 |
| c1-u17-l02-q12 | options | panorama／aquarium／suburbia／orchard | stamina／pathos／suburbia／unison |
| c1-u17-l02-q12 | optionGlossZh | 全景／水族館／郊區／果園 | 耐力／悲愴感／郊區／一致 |
| c1-u17-l02-q15 | rubricZh | waterfront 表示「海濱、濱水區」，常用 along the waterfront／時態配合內容（例如 walked、take a walk）／「看夕陽」可寫 watch the sunset 等 | waterfront 表示「海濱、濱水區」，用法例如 along the waterfront、by the waterfront 等／時態配合內容（例如 walked、take a walk 等）／「看夕陽」可寫，例如 watch the sunset、see the sunset 等 |
| c1-u17-l02-q16 | rubricZh | suburbia 是不可數名詞，表示「郊區（生活）」，前面不加冠詞（例如 in suburbia、life in suburbia）／句子要說到你自己的看法或經驗 | suburbia 是不可數名詞，表示「郊區（生活）」（例如 in suburbia、life in suburbia 等）／句子要說到你自己的看法或經驗 |
| c1-u18-l01-q10 | options | A farm cat／A big brown dog／A goose／A small pig | A farm cat／A big dog／A goose／A cow |
| c1-u18-l01-q11 | sentenceEn | It's a bit chilly this morning, so take a jacket. | The sea was still too chilly for swimming in May. |
| c1-u18-l01-q11 | sentenceZh | 今天早上有點冷，帶件外套吧。 | 五月的海水還是太冷，不適合游泳。 |
| c1-u18-l01-q16 | rubricZh | vegetation 是不可數名詞，表示「植被、植物」（例如 the vegetation on this island）／「茂密」可寫 thick、dense 等 | vegetation 是不可數名詞，表示「植被、植物」（例如 the vegetation on this island 等）／「茂密」可寫，例如 thick、dense 等 |
| c1-u18-l01-q17 | rubricZh | chilly 表示「寒冷的、涼颼颼的」，可放在 be、feel 後（例如 is always chilly、feel chilly）／句子要說到你自己 | chilly 表示「寒冷的、涼颼颼的」，位置有彈性（例如 is always chilly、feel chilly、a chilly morning 等）／句子要說到你自己 |
| c1-u18-l02-q13 | options | fissure／seedling／otter／resin | fissure／seedling／otter／goose |
| c1-u18-l02-q13 | optionGlossZh | 裂縫／幼苗／水獺／樹脂 | 裂縫／幼苗／水獺／鵝 |
| c1-u18-l02-q16 | rubricZh | seedling 是可數名詞，表示「幼苗」，通常用複數 seedlings／「種」可寫 plant、put…in 等／時態配合內容（例如 plant、planted） | seedling 是可數名詞，表示「幼苗」（例如 seedlings、tomato seedlings 等）／「種」可寫，例如 plant、put…in 等／時態配合內容（例如 plant、planted 等） |
| c1-u18-l02-q17 | rubricZh | pinnacle 可比喻「巔峰、頂點」，常用 the pinnacle of＋名詞（例如 the pinnacle of my career）／句子要說到你自己 | pinnacle 可比喻「巔峰、頂點」，用法例如 the pinnacle of my career、reach the pinnacle 等／句子要說到你自己 |
| c1-u18-l03-q08 | exampleEn | The morning grass shone damply in the sun. | After the swim, her hair hung damply around her face. |
| c1-u18-l03-q08 | exampleZh | 早晨的草地在陽光下閃著濕潤的光。 | 游完泳後，她的頭髮濕答答地垂在臉旁。 |
| c1-u18-l03-q14 | stemEn | In spring, each ____ on the farm gave birth to one or two lambs. | The farmer cut the wool from each ____ before the summer heat. |
| c1-u18-l03-q14 | stemZh | 春天時，農場上每隻母羊都生了一到兩隻小羊。 | 夏天變熱之前，農夫把每隻母羊的毛剪下來。 |
| c1-u18-l03-q16 | referenceEn | During hibernation, a hedgehog's heart beats very slowly.／A hedgehog's heart becomes very slow during hibernation. | During hibernation, a hedgehog's heart beats very slowly.／A hedgehog's heart rate becomes very slow during hibernation. |
| c1-u18-l03-q16 | rubricZh | hibernation 是名詞，表示「冬眠」，常用 during hibernation／「心跳變慢」可寫 the heart beats slowly、the heart becomes slow 等 | hibernation 是名詞，表示「冬眠」，用法例如 during hibernation、in hibernation 等／「心跳變慢」可寫，例如 the heart beats slowly、the heart rate slows down 等 |
| c1-u18-l03-q17 | rubricZh | peacock 是可數名詞，表示「孔雀」（例如 a peacock、a white peacock）／句子要說到你自己的經驗／時態配合內容（例如 saw、walked） | peacock 是可數名詞，表示「孔雀」（例如 a peacock、a white peacock 等）／句子要說到你自己的經驗／時態配合內容（例如 saw、walked 等） |
| c1-u19-l01-q02 | exampleEn | The park was created to conserve rare birds. | Volunteers work hard to conserve the old forest near our town. |
| c1-u19-l01-q02 | exampleZh | 這座公園是為了保護珍稀鳥類而設立的。 | 志工們努力保護我們鎮附近的那片老森林。 |
| c1-u19-l01-q09 | options | To help people sleep／To make rooms darker／Because bulbs are broken／To save energy | To sleep better／To make it dark／Because the bulbs are broken／To use less energy |
| c1-u19-l01-q12 | options | suburban／nocturnal／chilly／sustainable | climactic／panoramic／chilly／sustainable |
| c1-u19-l01-q12 | optionGlossZh | 郊區的／夜行性的／寒冷的／永續的 | 高潮的／全景的／寒冷的／永續的 |
| c1-u19-l01-q15 | rubricZh | conserve 表示「節約、保護」（例如 conserve water）／「乾季時」可寫 during／in the dry season 等／「需要」可寫 need to、should 等 | conserve 表示「節約、保護」（例如 conserve water 等）／「乾季時」可寫，例如 during the dry season、in the dry season 等／「需要」可寫，例如 need to、should 等 |
| c1-u19-l01-q16 | rubricZh | sustainable 表示「可持續的、永續的」，可放名詞前或 be 動詞後（例如 a sustainable habit）／句子要說到你自己的習慣 | sustainable 表示「可持續的、永續的」，位置有彈性（例如 a sustainable habit、is sustainable 等）／句子要說到你自己的習慣 |
| c1-u20-l01-q10 | sentenceEn | Anyone can report harassment at the front desk of the police station. | The singer spoke openly about the online harassment she faced. |
| c1-u20-l01-q10 | sentenceZh | 任何人都可以到警察局的櫃台通報騷擾事件。 | 那位歌手公開談論她在網路上遭受的騷擾。 |
| c1-u20-l01-q16 | passageZh | 上個月，米亞打電話到鎮公所，因為她家那條街的路燈已經壞了好幾週。一位職員說明，那條街不在本鎮的管轄範圍內，所以必須向隔壁區申請維修。米亞也知道了為什麼一直沒有進展：住戶協會分裂成兩派，一派想換新燈，另一派想把舊燈修好。最後，一支由退休電工組成的志工隊主動提供協助。他們確保每一盞燈都符合安全規定，區公所也同意負擔零件的費用。 | 上個月，Mia 打電話到鎮公所，因為她家那條街的路燈已經壞了好幾週。一位職員說明，那條街不在本鎮的管轄範圍內，所以必須向隔壁區申請維修。Mia 也知道了為什麼一直沒有進展：住戶協會分裂成兩派，一派想換新燈，另一派想把舊燈修好。最後，一支由退休電工組成的志工隊主動提供協助。他們確保每一盞燈都符合安全規定，區公所也同意負擔零件的費用。 |
| c1-u20-l01-q16 | questions/1/questionZh | 米亞得知事情一直沒有進展的原因是什麼？ | Mia 得知事情一直沒有進展的原因是什麼？ |
| c1-u20-l01-q16 | questions/1/options | 沒有人願意出席會議／協會的負責人搬到別的城市去了很久／兩派對換燈或修燈意見不合／鎮公所拒絕回信 | 沒有人願意出席會議／協會負責人早就搬到外地去住了／兩派對換燈或修燈意見不合／鎮公所拒絕回信 |
| c1-u20-l01-q17 | rubricZh | conform 常與 to 連用，表示「符合、遵守」（例如 conform to the rules 等）／「包裹」可寫 parcels、packages 等／「尺寸規定」可寫 size rules、size limits 等 | conform 表示「符合、遵守」，用法例如 conform to the rules、conform to standards 等／「包裹」可寫，例如 parcels、packages 等／「尺寸規定」可寫，例如 size rules、size limits 等 |
| c1-u20-l01-q18 | rubricZh | comply 常與 with 連用，表示「遵守」（例如 comply with the rules 等）／句子要說到你自己的生活 | comply 表示「遵守」，用法例如 comply with the rules、comply with the law 等／句子要說到你自己的生活 |
| c1-u20-l02-q04 | exampleZh | 鑑識專家研究了玻璃杯上留下的細小痕跡。 | 鑑識專家研究了玻璃上留下的細小痕跡。 |
| c1-u20-l02-q07 | exampleEn | Many families left the country to escape persecution. | In the seventeenth century, the scientist Galileo faced persecution for his ideas. |
| c1-u20-l02-q07 | exampleZh | 許多家庭離開那個國家，以逃避迫害。 | 十七世紀時，科學家 Galileo 因為自己的想法而遭受迫害。 |
| c1-u20-l02-q13 | options | sedentary／forensic／violet／ghostly | sedentary／forensic／impoverished／juvenile |
| c1-u20-l02-q13 | optionGlossZh | 久坐的／鑑識的／紫羅蘭色的／鬼魅般的 | 久坐的／鑑識的／貧困的／青少年的 |
| c1-u20-l02-q14 | options | bribe／scrutinize／flatter／injustice | bribe／scrutinize／tailor／injustice |
| c1-u20-l02-q14 | optionGlossZh | 賄賂／仔細審查／奉承／不公平 | 賄賂／仔細審查／量身調整／不公平 |
| c1-u20-l02-q15 | passageEn | Lena studies law at the country's premier university. On weekends, she volunteers at a free legal help center in an impoverished part of the city. Many visitors come with tedious, bureaucratic problems, such as forms that were rejected three times in a row. Others have more serious stories. One man said his landlord kept harassing him to leave his flat. Lena helped him write down every visit and phone call as evidence. She also reads history books about persecution, because she believes that small injustices, if ignored, can grow into large ones. | Lena studies law at the country's premier university. On weekends, she volunteers at a free legal help center in an impoverished part of the city. Many visitors come with tedious, bureaucratic problems, such as forms that were rejected three times in a row. Others have more serious stories. One man said his landlord kept harassing him to leave his flat. Lena listened carefully and helped him fill in a complaint form. She also reads history books about persecution, because she believes that small injustices, if ignored, can grow into large ones. |
| c1-u20-l02-q15 | passageZh | 莉娜在國內頂尖的大學讀法律。週末時，她在城裡一個貧困地區的免費法律諮詢中心當志工。許多來訪者帶著繁瑣又官僚的問題，例如表格連續被退件了三次。也有人的處境更嚴重。一名男子說，房東一直騷擾他，逼他搬出公寓。莉娜幫他把每一次來訪和電話都記下來，作為證據。她也會讀關於迫害的歷史書，因為她相信，小小的不公平如果被忽視，可能會演變成很大的不公。 | Lena 在國內頂尖的大學讀法律。週末時，她在城裡一個貧困地區的免費法律諮詢中心當志工。許多來訪者帶著繁瑣又官僚的問題，例如表格連續被退件了三次。也有人的處境更嚴重。一名男子說，房東一直騷擾他，逼他搬出公寓。Lena 仔細聽他說，並幫他填寫申訴表。她也會讀關於迫害的歷史書，因為她相信，小小的不公平如果被忽視，可能會演變成很大的不公。 |
| c1-u20-l02-q15 | questions/0/questionZh | 莉娜幫那名男子做了什麼？ | Lena 幫那名男子做了什麼？ |
| c1-u20-l02-q15 | questions/0/options | 去找房東當面談清楚／立刻搬出公寓、另外找一間新的住處／直接打電話報警／記下房東每次來訪和電話 | 去找房東當面談清楚／立刻搬出公寓、另外找一間新的住處／直接打電話報警／仔細聆聽並幫他填申訴表 |
| c1-u20-l02-q15 | questions/1/questionZh | 莉娜為什麼讀關於迫害的歷史書？ | Lena 為什麼讀關於迫害的歷史書？ |
| c1-u20-l02-q16 | rubricZh | bureaucratic 是形容詞，表示「官僚的、手續繁瑣的」（例如 a bureaucratic process 等）／「申請補助」可寫 applying for the grant 等／「等了半年」可寫 waited six months、waited half a year 等 | bureaucratic 是形容詞，表示「官僚的、手續繁瑣的」（例如 a bureaucratic process 等）／「申請補助」可寫，例如 applying for the grant、the grant application 等／「等了半年」可寫，例如 waited six months、waited half a year 等 |
| c1-u20-l03-q03 | exampleEn | Guests who cancel late will forfeit their deposit. | He forfeited his deposit when he canceled the trip. |
| c1-u20-l03-q03 | exampleZh | 太晚取消的房客會失去他們的訂金。 | 他取消了旅行，因此失去了訂金。 |
| c1-u20-l03-q05 | exampleZh | 那位經理被判行賄罪之後，丟了工作。 | 那位經理被判賄賂罪之後，丟了工作。 |
| c1-u20-l03-q05 | glossZh | 行賄；賄賂行為 | 賄賂行為；行賄、受賄 |
| c1-u20-l03-q05 | distractorsZh | 竊盜；偷竊行為／詐騙；欺詐行為／逃稅；漏稅行為 | 竊盜行為；偷竊／詐騙行為；欺詐／逃稅行為；漏稅 |
| c1-u20-l03-q10 | audioEn | The bird was kept in confinement for a week before it could fly again. | The prisoner was finally set free after twelve years in confinement. |
| c1-u20-l03-q10 | audioZh | 那隻鳥被關了一個星期，之後才又能飛。 | 那名囚犯被關了十二年，終於獲釋。 |
| c1-u20-l03-q10 | questionZh | 那隻鳥被關了多久？ | 那名囚犯被關了多久？ |
| c1-u20-l03-q10 | options | For a week, until it could fly／For a whole month／For only one day／For two years | For twelve years／For a whole month／For almost twenty years／For a week |
| c1-u20-l03-q13 | stemEn | The two clerks were sent to prison for ____. | Paying an officer to ignore a problem is a form of ____. |
| c1-u20-l03-q13 | stemZh | 那兩名職員因為行賄而入獄。 | 付錢給官員，讓他對問題視而不見，是一種賄賂行為。 |
| c1-u20-l03-q13 | optionGlossZh | 韌性／行賄／抽象概念／分裂 | 韌性／賄賂行為／抽象概念／分裂 |
| c1-u20-l03-q15 | questions/0/options | 可能失去每週一次的家人探視機會／必須多寫一封道歉信／整整一週不能吃晚餐／被調到另一座監獄去 | 失去每週的家人探視／必須寫一封很長的道歉信給家人／一週不能吃晚餐／被調到別的監獄 |
| c1-u20-l03-q15 | questions/1/options | 大家最喜歡哪一間牢房／這些人是否都受到了公正的對待／有沒有人想當導覽員／監獄是哪一年蓋的 | 大家最喜歡監獄裡的哪一間牢房／這些人是否受到公正對待／有沒有人以後想當博物館導覽員／監獄是哪一年蓋的 |
| c1-u20-l03-q16 | referenceEn | Your place in the race will be forfeited if you do not check in on time.／You will forfeit the right to compete if you are late to check in. | Your place in the race will be forfeited if you do not check in on time.／Runners who check in late will forfeit their place in the race. |
| c1-u20-l03-q16 | rubricZh | forfeit 是及物動詞，表示「喪失、被沒收」（例如 forfeit your place、forfeit the deposit 等）／「準時報到」可寫 check in on time、arrive on time 等／「比賽資格」可寫 your place in the race、the right to compete 等 | forfeit 是及物動詞，表示「喪失、被沒收」（例如 forfeit your place、forfeit the deposit 等）／「準時報到」可寫，例如 check in on time、arrive on time 等／「比賽資格」可寫，例如 your place in the race、the right to compete 等 |
| c1-u21-l01-q05 | exampleEn | The book gives a realistic depiction of life on a farm. | The children's drawings give a lovely depiction of their town. |
| c1-u21-l01-q05 | exampleZh | 這本書寫實地描寫了農場上的生活。 | 孩子們的畫把他們的小鎮描繪得很美。 |
| c1-u21-l01-q06 | exampleEn | Her portrayal of the queen won several awards. | Some readers did not like the novel's portrayal of teenagers. |
| c1-u21-l01-q06 | exampleZh | 她對女王一角的詮釋贏得了好幾個獎項。 | 有些讀者不喜歡這本小說對青少年的描寫。 |
| c1-u21-l01-q06 | glossZh | 詮釋；描繪 | 描寫；（演員的）詮釋 |
| c1-u21-l01-q15 | passageEn | Ana Lee won renown for her portrayal of a village doctor in a popular TV drama. The show depicts the doctor as tired, funny and sometimes wrong, and many viewers say this depiction feels more real than older dramas. Critics also praise the series for its part in the popularization of local history, since each episode is based on a true story. The show's director is reputed to rewrite scenes the night before filming. Still, he says that the media coverage after the first season was the biggest surprise of his career. | Ana Lee won renown for her portrayal of a village doctor in a popular TV drama. The show depicts the doctor as tired, funny and sometimes wrong, and many viewers say this depiction feels more real than older dramas. Critics also praise the series for its part in the popularization of local history, since each episode is based on a true story. The show's director is reputed to rewrite scenes the night before filming. He says that the media coverage after the first season was the biggest surprise of his career. |
| c1-u21-l01-q15 | passageZh | 安娜．李因為在一部熱門電視劇中飾演村醫而成名。這部劇把醫生描寫成會累、很有趣、有時也會犯錯的人，許多觀眾說，這樣的描寫比舊的戲劇更真實。評論家也稱讚這部影集讓地方歷史普及，因為每一集都改編自真實故事。據說這部劇的導演常在拍攝前一晚改寫場景。不過他說，第一季播出後的媒體報導，才是他職業生涯中最大的驚喜。 | Ana Lee 因為在一部熱門電視劇中飾演村醫而成名。這部劇把醫生描寫成會累、很有趣、有時也會犯錯的人，許多觀眾說，這樣的描寫比舊的戲劇更真實。評論家也稱讚這部影集讓地方歷史普及，因為每一集都改編自真實故事。據說這部劇的導演常在拍攝前一晚改寫場景。他說，第一季播出後的媒體報導，才是他職業生涯中最大的驚喜。 |
| c1-u21-l01-q16 | rubricZh | portray 常用 portray A as B，表示「把 A 描繪成 B」／「紀錄片」可寫 documentary 等／「友善的地方」可寫 a friendly place、a welcoming place 等 | portray 表示「把…描繪成」，用法例如 portray A as B、be portrayed as 等／「紀錄片」可寫，例如 documentary、film 等／「友善的地方」可寫，例如 a friendly place、a welcoming place 等 |
| c1-u22-l01-q06 | exampleEn | She grew up in a privileged family with servants. | Only privileged members can use the private garden on the roof. |
| c1-u22-l01-q06 | exampleZh | 她在一個有傭人的優渥家庭長大。 | 只有享有特權的會員，才能使用屋頂的私人花園。 |
| c1-u22-l01-q06 | glossZh | 享有特權的；優渥的 | 享有特權的；優渥的；榮幸的 |
| c1-u22-l01-q07 | exampleEn | Many people visited the prophet to ask about their future. | Ancient prophets were often seen as messengers of the gods. |
| c1-u22-l01-q07 | exampleZh | 許多人去拜訪那位先知，詢問自己的未來。 | 古代的先知常被視為眾神的使者。 |
| c1-u22-l01-q10 | sentenceZh | 她把遺產和兩個哥哥平分了。 | 她把遺產和兩個兄弟平分了。 |
| c1-u22-l01-q14 | stemEn | Her greatest ____ is the school she built for poor children. | The band's greatest ____ is a song that every child still sings. |
| c1-u22-l01-q14 | stemZh | 她留給後世最大的貢獻，是她為貧童蓋的那所學校。 | 這個樂團留給後世最大的貢獻，是一首至今每個孩子都會唱的歌。 |
| c1-u22-l01-q16 | passageEn | In the small town of Elm Hill, a statue honors Thomas Reed, a preacher who arrived in 1850. Although he was born into a privileged family, he gave away most of his inheritance to build a school and a clinic. Some people called him a prophet because he warned that the river would flood, and it did. For many poor families, his school was a kind of salvation. Today, it is still customary for students to leave flowers at the statue on his birthday. His greatest legacy is the town itself. | In the small town of Marlow, a statue honors Thomas Kirwan, a preacher who arrived in 1850. Although he was born into a privileged family, he gave away most of his inheritance to build a school and a clinic. Some people called him a prophet because he warned that the river would flood, and it did. For many poor families, his school was a kind of salvation. Today, it is still customary for students to leave flowers at the statue on his birthday. His greatest legacy is the town itself. |
| c1-u22-l01-q16 | passageZh | 在榆丘這個小鎮上，有一座雕像紀念湯瑪斯．瑞德，他是一位在 1850 年來到這裡的傳道人。雖然他出身優渥的家庭，卻把大部分的遺產捐了出來，蓋了一所學校和一間診所。有些人稱他為先知，因為他曾警告河水會氾濫，後來真的發生了。對許多貧窮的家庭來說，他的學校就像一種救贖。直到今天，學生們仍習慣在他生日那天到雕像前獻花。他留給後世最大的影響，就是這個小鎮本身。 | 在 Marlow 這個小鎮上，有一座雕像紀念 Thomas Kirwan，他是一位在 1850 年來到這裡的傳道人。雖然他出身優渥的家庭，卻把大部分的遺產捐了出來，蓋了一所學校和一間診所。有些人稱他為先知，因為他曾警告河水會氾濫，後來真的發生了。對許多貧窮的家庭來說，他的學校就像一種救贖。直到今天，學生們仍習慣在他生日那天到雕像前獻花。他留給後世最大的影響，就是這個小鎮本身。 |
| c1-u22-l01-q16 | questions/0/questionZh | 瑞德怎麼使用他繼承的遺產？ | Kirwan 怎麼使用他繼承的遺產？ |
| c1-u22-l01-q17 | rubricZh | customary 表示「習慣上的、依慣例的」，常用 it is customary to…／「紅包」可寫 red envelopes 等／「過年」可寫 Chinese New Year、the Lunar New Year 等 | customary 表示「習慣上的、依慣例的」，用法例如 it is customary to…、… is customary 等／「紅包」可寫，例如 red envelopes、red packets 等／「過年」可寫，例如 Chinese New Year、the Lunar New Year 等 |
| c1-u22-l02-q06 | exampleEn | The company sells its products both domestically and abroad. | This year, more families chose to travel domestically. |
| c1-u22-l02-q06 | exampleZh | 這家公司在國內外都有販售產品。 | 今年有更多家庭選擇在國內旅遊。 |
| c1-u22-l02-q10 | options | It comes from abroad／It is grown in their own country／It is bought online／It comes from a farm | It comes from abroad／It is grown in their own country／It is bought online／It comes from their own garden |
| c1-u22-l02-q14 | stemEn | Even today, people in the town ____ the man who built their first school. | Even today, young painters ____ her and copy her style. |
| c1-u22-l02-q14 | stemZh | 直到今天，鎮上的人仍崇敬那位為他們蓋了第一所學校的人。 | 直到今天，年輕畫家仍崇敬她、模仿她的畫風。 |
| c1-u22-l02-q15 | passageEn | Every spring, the people of a mountain village hold a festival for a river spirit from local mythology. Older villagers say the river has a kind of sanctity, so nobody is allowed to fish there during the festival. To a visiting professor, the event was clear testament to the village's profound respect for nature. She also pointed out its role in socialization: children learn the old songs from their grandparents and help prepare food for guests. Some villagers now sell their own crafts domestically, and much of the money goes back to the festival, an example of quiet altruism. | Every spring, the people of a mountain village hold a festival for a river spirit from local mythology. Older villagers say the river has a kind of sanctity, so nobody is allowed to fish there during the festival. To a visiting professor, the event was clear testament to the village's profound respect for nature. She also pointed out its role in socialization: children learn the old songs from their grandparents and help prepare food for guests. The village's small craft company now sells its products domestically, and much of the money goes back to the festival, an example of quiet altruism. |
| c1-u22-l02-q15 | passageZh | 每年春天，一座山村的居民都會為當地神話中的河神舉辦節慶。老一輩的村民說，這條河具有某種神聖性，所以節慶期間任何人都不可以在河裡捕魚。對一位來訪的教授來說，這個活動清楚證明村民對自然懷有深深的敬意。她也指出節慶在社會化上的作用：孩子們跟祖父母學唱老歌，也幫忙為客人準備食物。現在有些村民在國內販售自己的手工藝品，大部分收入都回饋給節慶，這是一種低調的利他精神。 | 每年春天，一座山村的居民都會為當地神話中的河神舉辦節慶。老一輩的村民說，這條河具有某種神聖性，所以節慶期間任何人都不可以在河裡捕魚。對一位來訪的教授來說，這個活動清楚證明村民對自然懷有深深的敬意。她也指出節慶在社會化上的作用：孩子們跟祖父母學唱老歌，也幫忙為客人準備食物。村裡的小型手工藝公司現在在國內販售產品，大部分收入都回饋給節慶，這是一種低調的利他精神。 |
| c1-u22-l02-q16 | rubricZh | prophetic 是形容詞，表示「有先見之明的、預言的」／「現在看來」可寫 now seems、now looks 等／「十年前說的話」可寫 what he said ten years ago、his words from ten years ago 等 | prophetic 是形容詞，表示「有先見之明的、預言的」（例如 seems prophetic、prophetic words 等）／「現在看來」可寫，例如 now seems、now looks 等／「十年前說的話」可寫，例如 what he said ten years ago、his words from ten years ago 等 |
| c1-u22-l02-q17 | referenceEn | My neighbor shows real altruism by cooking for elderly people every week.／Giving blood is a simple act of altruism. | My neighbor shows real altruism by cooking for elderly people every week.／Last year, I gave my umbrella to a stranger in the rain, a small act of altruism. |
| c1-u22-l03-q07 | exampleEn | Humans domesticated horses to carry people and goods. | Wild goats were domesticated in this area thousands of years ago. |
| c1-u22-l03-q07 | exampleZh | 人類馴養馬來載人和運送貨物。 | 這一帶的野山羊在幾千年前就被馴化了。 |
| c1-u22-l03-q09 | sentenceEn | The village venerates a famous doctor who lived there long ago. | Some ancient peoples venerated the sun as a god. |
| c1-u22-l03-q09 | sentenceZh | 這個村子敬奉一位很久以前住在那裡的名醫。 | 有些古代民族把太陽當成神來敬奉。 |
| c1-u22-l03-q10 | audioEn | My uncle bequeathed his old violin to me. | My teacher bequeathed his old violin to me. |
| c1-u22-l03-q10 | audioZh | 我叔叔把他的舊小提琴遺贈給了我。 | 我的老師把他的舊小提琴遺贈給了我。 |
| c1-u22-l03-q10 | questionZh | 叔叔把小提琴怎麼了？ | 老師把小提琴怎麼了？ |
| c1-u22-l03-q12 | sentenceZh | 貓大概是因為住在農場附近，自己被馴化的。 | 貓大概是因為住在農場附近，而自我馴化的。 |
| c1-u22-l03-q14 | stemEn | In her will, she ____ all her paintings to the city museum. | The old farmer ____ his land to the town, and it is now a public park. |
| c1-u22-l03-q14 | stemZh | 她在遺囑中把所有畫作遺贈給市立博物館。 | 那位老農夫把土地遺贈給鎮上，現在那裡是一座公園。 |
| c1-u22-l03-q16 | rubricZh | immortalize 是及物動詞，表示「使不朽、使永遠被記住」／「老漁夫的故事」可寫 the old fisherman's story、the story of the old fisherman 等 | immortalize 是及物動詞，表示「使不朽、使永遠被記住」（例如 immortalized the story 等）／「老漁夫的故事」可寫，例如 the old fisherman's story、the story of the old fisherman 等 |
| c1-u22-l03-q17 | rubricZh | brainwash 是及物動詞，表示「洗腦」，常用 brainwash someone into doing… 等／句子要說到你自己的看法 | brainwash 是及物動詞，表示「洗腦」，用法例如 brainwash someone、brainwash someone into doing… 等／句子要說到你自己的看法 |
| c1-u23-l01-q08 | sentenceZh | 湯姆不在的時候，誰來負責監督這個專案？ | Tom 不在的時候，誰來負責監督這個專案？ |
| c1-u23-l01-q09 | audioEn | The interview tomorrow is just a formality; the job is already yours. | After a few formalities at the front desk, we went up to our room. |
| c1-u23-l01-q09 | audioZh | 明天的面試只是個形式，這份工作已經是你的了。 | 在櫃台辦完幾項手續後，我們就上樓回房間了。 |
| c1-u23-l01-q09 | questionZh | 說話者認為明天的面試怎麼樣？ | 他們在櫃台做了什麼？ |
| c1-u23-l01-q09 | options | It is now canceled／It will be very hard to pass／It is only a formality／It is too early | Paid for dinner／Talked with the hotel manager／Filled in some forms／Asked for maps |
| c1-u23-l01-q13 | stemEn | You need a ____ with a tax expert before you open the business. | She had a ____ with a tax expert before opening her shop. |
| c1-u23-l01-q13 | stemZh | 開店之前，你需要找稅務專家諮詢。 | 開店之前，她找了稅務專家諮詢。 |
| c1-u23-l01-q14 | passageEn | Last year, Green Leaf, a small design company, hired a consultancy to fix its organizational problems. After several consultations with staff, the consultants found that nobody knew who should oversee each project. Weekly meetings were full of formality but produced very few real decisions. Their advice was simple: create a small advisory group of senior designers and choose one trusted person to act as a liaison between designers and clients. Six months later, projects were finishing on time again, staff said the office felt more relaxed, and clients were happier too. | Last year, Torvan, a small design company, hired a consultancy to fix its organizational problems. After several consultations with staff, the consultants found that nobody knew who should oversee each project. Weekly meetings were full of formality but produced very few real decisions. Their advice was simple: create a small advisory group of senior designers and choose one trusted person to act as a liaison between designers and clients. Six months later, projects were finishing on time again, staff said the office felt more relaxed, and clients were happier too. |
| c1-u23-l01-q14 | passageZh | 去年，小型設計公司「綠葉」聘請了一家顧問公司，來解決組織上的問題。和員工進行了幾次諮詢後，顧問們發現，沒有人知道每個專案該由誰來監督。每週的會議充滿了繁文縟節，卻很少做出真正的決定。他們的建議很簡單：由資深設計師組成一個小型諮詢小組，並選一位可靠的人擔任設計師與客戶之間的聯絡人。六個月後，專案又都能準時完成，員工說辦公室的氣氛輕鬆多了，客戶也更滿意了。 | 去年，小型設計公司 Torvan 聘請了一家顧問公司，來解決組織上的問題。和員工進行了幾次諮詢後，顧問們發現，沒有人知道每個專案該由誰來監督。每週的會議充滿了繁文縟節，卻很少做出真正的決定。他們的建議很簡單：由資深設計師組成一個小型諮詢小組，並選一位可靠的人擔任設計師與客戶之間的聯絡人。六個月後，專案又都能準時完成，員工說辦公室的氣氛輕鬆多了，客戶也更滿意了。 |
| c1-u23-l01-q15 | rubricZh | oversee 是及物動詞，表示「監督、管理」（例如 oversee the training 等）／「新進員工」可寫 new staff、new employees 等／「負責」可直接用 oversee，或寫 be responsible for 等 | oversee 是及物動詞，表示「監督、管理」（例如 oversee the training 等）／「新進員工」可寫，例如 new staff、new employees 等／「負責」可直接用 oversee，也可寫，例如 be responsible for、be in charge of 等 |
| c1-u24-l01-q09 | exampleEn | Three people are on the shortlist for the job. | Her first novel is on the shortlist for a national book prize. |
| c1-u24-l01-q09 | exampleZh | 有三個人進入了這份工作的最終候選名單。 | 她的第一本小說入圍了一個全國性圖書獎的決選名單。 |
| c1-u24-l01-q10 | sentenceEn | My brother started an apprenticeship at a car repair shop. | My older brother started an apprenticeship at a car repair shop. |
| c1-u24-l01-q14 | stemEn | She learned to build boats during a five-year ____. | Many electricians learn their skills during a four-year ____. |
| c1-u24-l01-q14 | stemZh | 她在五年的學徒期間學會了造船。 | 許多電工是在四年的學徒期間學會技術的。 |
| c1-u24-l01-q16 | passageZh | 林先生經營一間製作木椅的小工坊。上個月他需要一位新學徒，有三十多個年輕人來應徵。他不太在乎紙上的資格證明，而是從曾經親手做過東西的人當中，列出五人的最終候選名單。最後一次面試時，一位年輕女子表示自己非常熱愛木頭，但最讓他印象深刻的是她的專業態度：她提早到、問題問得很仔細，結束後還把工具清乾淨。她將跟著他當兩年的學徒，他希望她有一天也能帶領自己的部屬。 | Lin 先生經營一間製作木椅的小工坊。上個月他需要一位新學徒，有三十多個年輕人來應徵。他不太在乎紙上的資格證明，而是從曾經親手做過東西的人當中，列出五人的最終候選名單。最後一次面試時，一位年輕女子表示自己非常熱愛木頭，但最讓他印象深刻的是她的專業態度：她提早到、問題問得很仔細，結束後還把工具清乾淨。她將跟著他當兩年的學徒，他希望她有一天也能帶領自己的部屬。 |
| c1-u24-l01-q16 | questions/0/questionZh | 林先生怎麼挑選最終候選人？ | Lin 先生怎麼挑選最終候選人？ |
| c1-u24-l01-q16 | questions/1/questionZh | 最讓林先生印象深刻的是什麼？ | 最讓 Lin 先生印象深刻的是什麼？ |
| c1-u24-l01-q17 | promptZh | 長時間坐著是辦公室工作的職業風險之一。 | 噪音是建築工人的職業風險之一。 |
| c1-u24-l01-q17 | referenceEn | Sitting for long hours is one of the occupational risks of office work.／Long hours of sitting are an occupational risk for office workers. | Noise is one of the occupational risks for building workers.／Loud noise is an occupational risk for people who work on building sites. |
| c1-u24-l01-q17 | rubricZh | occupational 是形容詞，表示「職業的、職業上的」（例如 occupational risks、occupational safety 等）／「長時間坐著」可寫 sitting for long hours 等／「職業風險」可寫 occupational risk、occupational hazard 等 | occupational 是形容詞，表示「職業的、職業上的」（例如 occupational risks、occupational safety 等）／「噪音」可寫，例如 noise、loud noise 等／「職業風險」可寫，例如 occupational risk、occupational hazard 等 |
| c1-u25-l01-q11 | options | cloak／collaboration／hedgehog／somersault | depiction／collaboration／portrayal／coverage |
| c1-u25-l01-q11 | optionGlossZh | 斗篷／合作／刺蝟／翻筋斗 | 描寫／合作／詮釋／報導 |
| c1-u25-l01-q14 | rubricZh | collaborate 常與 on／with 連用，表示「合作」（例如 collaborate on an album 等）／「打算」可寫 plan to、are going to 等／「一張專輯」可寫 an album、a record 等 | collaborate 表示「合作」，用法例如 collaborate on an album、collaborate with someone 等／「打算」可寫，例如 plan to、are going to 等／「一張專輯」可寫，例如 an album、a record 等 |
| c1-u25-l01-q15 | rubricZh | swap 可當動詞，表示「交換」，常用 swap A for B、swap clothes 等／句子要說到你自己的經驗 | swap 當動詞表示「交換」，用法例如 swap A for B、swap clothes 等／句子要說到你自己的經驗 |
| c1-u25-l02-q06 | exampleZh | 你的密碼可能已經外洩了，請更換密碼。 | 你的密碼可能已經被盜用了，請更換密碼。 |
| c1-u25-l02-q06 | glossZh | 外洩的、被盜用的；受損的 | 遭入侵的；被盜用的、受損的 |
| c1-u25-l02-q06 | distractorsZh | 重設的、更新過的；新的／刪除的、移除的；空的／鎖住的、凍結的；暫停的 | 重設的；更新過的、新的／刪除的；移除的、空的／鎖住的；凍結的、暫停的 |
| c1-u25-l02-q12 | stemEn | The files were ____ when someone broke into the computer system. | The bridge's safety was ____ by years of poor repairs. |
| c1-u25-l02-q12 | stemZh | 有人入侵電腦系統時，這些檔案遭到外洩。 | 多年來修繕不當，使這座橋的安全受到損害。 |
| c1-u25-l02-q12 | optionGlossZh | 外洩的／遺贈／講道／大亨 | 受損的／遺贈／講道／大亨 |
| c1-u25-l02-q14 | rubricZh | commercially 是副詞，表示「在商業上」（例如 commercially successful 等）／「賣出一百萬套」可寫 sold a million copies 等 | commercially 是副詞，表示「在商業上」（例如 commercially successful 等）／「賣出一百萬套」可寫，例如 sold a million copies、sold one million copies 等 |
| c1-u26-l01-q05 | distractorsZh | 稍微地／意外地／合理地 | 稍微地、有一點地／意外地、出乎意料地／合理地、適當地 |
| c1-u26-l01-q09 | options | With money from a new job／With help from family／Using an overdraft／With some savings | With money from a new job／With help from the family／With a bank overdraft／With some savings |
| c1-u26-l01-q12 | options | hibernation／overdraft／socialization／domestication | hibernation／overdraft／salvation／legacy |
| c1-u26-l01-q12 | optionGlossZh | 冬眠／透支／社會化／馴化 | 冬眠／透支／救贖／留給後世的貢獻 |
| c1-u26-l01-q13 | stemEn | He ____ all his savings on a boat he never used. | The team ____ a two-goal lead in the last ten minutes. |
| c1-u26-l01-q13 | stemZh | 他把所有積蓄都浪費在一艘從沒用過的船上。 | 那支球隊在最後十分鐘白白浪費了兩球的領先。 |
| c1-u26-l01-q14 | passageEn | When the town of Riverside planned a new sports center, the cost of building an indoor pool turned out to be prohibitive. Some residents accused the town council of extravagance and said it had squandered money on an expensive design. The plan became so contested that one public meeting lasted more than four hours. In the end, the council chose a more cost-effective idea: an outdoor pool that would be much cheaper to build. Heating it in winter would be prohibitively expensive, so it will open only from May to October. | When the Kelton Sports Club planned a new club building, the cost of building an indoor pool turned out to be prohibitive. Some members accused the club's board of extravagance and said it had squandered money on an expensive design. The plan became so contested that one members' meeting lasted more than four hours. In the end, the board chose a more cost-effective idea: an outdoor pool that would be much cheaper to build. Heating it in winter would be prohibitively expensive, so it will open only from May to October. |
| c1-u26-l01-q14 | passageZh | 河畔鎮計畫興建新的運動中心時，發現蓋室內游泳池的費用高得驚人。有些居民指責鎮議會奢侈浪費，說它把錢揮霍在昂貴的設計上。這項計畫爭議太大，有一場公聽會開了四個多小時。最後，議會選擇了更划算的方案：一座造價便宜許多的戶外游泳池。由於冬天幫泳池加溫的費用高到難以負擔，泳池只會在五月到十月開放。 | Kelton 運動俱樂部計畫興建新會館時，發現蓋室內游泳池的費用高得令人卻步。有些會員指責俱樂部的董事會奢侈浪費，說它把錢揮霍在昂貴的設計上。這項計畫爭議太大，有一場會員大會開了四個多小時。最後，董事會選擇了更划算的方案：一座造價便宜許多的戶外游泳池。由於冬天幫泳池加溫的費用高到難以負擔，泳池只會在五月到十月開放。 |
| c1-u26-l01-q14 | questions/0/questionZh | 最後議會選擇了什麼方案？ | 最後董事會選擇了什麼方案？ |
| c1-u26-l01-q15 | rubricZh | cost-effective 是形容詞，表示「划算的、有成本效益的」，比較級用 more cost-effective／「用網路開會」可寫 online meetings、holding meetings online 等 | cost-effective 是形容詞，表示「划算的、有成本效益的」（例如 more cost-effective 等）／「用網路開會」可寫，例如 online meetings、holding meetings online 等 |
| c1-u27-l01-q02 | exampleZh | 請把發票寄到我們的會計部門。 | 請把請款單寄到我們的會計部門。 |
| c1-u27-l01-q02 | glossZh | 發票；請款單 | 請款單、帳單；發票 |
| c1-u27-l01-q02 | distractorsZh | 訂單；訂購單／合約；協議書／型錄；目錄 | 訂購單、訂單；採購／合約書、協議；契約／產品型錄、目錄；清單 |
| c1-u27-l01-q03 | exampleEn | Street sellers showed their wares on colorful blankets. | The shop's wares include cups, plates and bowls. |
| c1-u27-l01-q03 | exampleZh | 街頭小販把商品擺在色彩繽紛的毯子上展示。 | 這家店的商品包括杯子、盤子和碗。 |
| c1-u27-l01-q04 | exampleEn | Tourists often haggle over prices at the night market. | The two companies haggled for weeks over the final price. |
| c1-u27-l01-q04 | exampleZh | 觀光客常在夜市討價還價。 | 兩家公司為了最終價格討價還價了好幾週。 |
| c1-u27-l01-q07 | sentenceZh | 發票在送貨兩週之後才寄到。 | 請款單在送貨兩週之後才寄到。 |
| c1-u27-l01-q12 | options | hibernate／haggle／embark／invoice | hibernate／haggle／rotate／invoice |
| c1-u27-l01-q12 | optionGlossZh | 冬眠／討價還價／上船／發票 | 冬眠／討價還價／旋轉／請款單 |
| c1-u27-l01-q13 | passageZh | 安娜在網路上賣自己在家做的蠟燭。去年，她只在週末市集擺攤賣貨，那裡的顧客很愛討價還價。現在她大部分的訂單都來自自己的網站。她找了一家便宜的貨運公司，每週二到她家門口收件，她也會用電子郵件寄發票給每位顧客。她的加價幅度不高，大約兩成，因為她希望留住老顧客。她還在網站上寫製作蠟燭的熱門文章，但她決定不設付費牆。 | Anna 賣自己在家做的蠟燭。去年，她只在週末市集擺攤賣貨，那裡的顧客很愛討價還價。現在她大部分的訂單都來自自己的網站。她找了一家便宜的貨運公司，每週二到她家門口收件，她也會用電子郵件寄請款單給每位顧客。她的加價幅度不高，大約兩成，因為她希望留住老顧客。她還在網站上寫製作蠟燭的熱門文章，但她決定不設付費牆。 |
| c1-u27-l01-q13 | questions/0/questionZh | 安娜怎麼把蠟燭送到顧客手上？ | Anna 怎麼把蠟燭送到顧客手上？ |
| c1-u27-l01-q13 | questions/1/questionZh | 安娜為什麼加價不高？ | Anna 為什麼加價不高？ |
| c1-u27-l01-q14 | rubricZh | wares 是複數名詞，表示「（攤販的）商品、貨物」／「擺攤賣」可寫 sells、sets up a stall to sell 等 | wares 是複數名詞，表示「（攤販的）商品、貨物」（例如 his wares、sells his wares 等）／「擺攤賣」可寫，例如 sells、sets up a stall to sell 等 |
| c1-u27-l01-q15 | rubricZh | haggle 是不及物動詞，常用 haggle over／about the price、haggle with someone 等／句子要說到你自己的經驗 | haggle 是不及物動詞，用法例如 haggle over the price、haggle with someone 等／句子要說到你自己的經驗 |
| c1-u28-l01-q03 | exampleEn | My uncle is a connoisseur of fine tea. | My neighbor is a connoisseur of fine tea. |
| c1-u28-l01-q03 | exampleZh | 我叔叔是品茶的行家。 | 我的鄰居是品茶的行家。 |
| c1-u28-l01-q11 | options | overdraft／connoisseur／paywall／endorsement | tastebud／connoisseur／saloon／batter |
| c1-u28-l01-q11 | optionGlossZh | 透支／行家／付費牆／認可 | 味蕾／行家／酒館／麵糊 |
| c1-u28-l01-q12 | stemEn | This ____ steak was so juicy that I finished it in minutes. | This ____ steak was so good that I finished it in minutes. |
| c1-u28-l01-q12 | stemZh | 這塊牛排鮮嫩多汁，我幾分鐘就吃完了。 | 這塊牛排鮮嫩多汁，好吃到我幾分鐘就吃完了。 |
| c1-u28-l01-q13 | passageEn | Last weekend, our company held a dinner for clients in the restored saloon of an old hotel. The chef, known as a connoisseur of local ingredients, prepared a gourmet menu with six small courses, each served on a different plate. The highlight was a succulent piece of slow-cooked pork that delighted everyone's tastebuds. Some guests joked about the extravagance of the evening, but the boss smiled and said the restaurant had offered a fair price. After dinner, the chef explained that he buys all his provisions directly from farmers every morning. | Last weekend, our company held a dinner for clients in the restored saloon of an old hotel. The chef, known as a connoisseur of local ingredients, prepared a gourmet menu with six small courses, each served on a different plate. The highlight was a succulent piece of slow-cooked pork that delighted everyone's tastebuds. Some guests joked about the extravagance of the evening, but the boss smiled and said the hotel had offered a fair price. After dinner, the chef explained that he buys all his provisions directly from farmers every morning. |
| c1-u28-l01-q13 | passageZh | 上週末，我們公司在一家老飯店修復後的大廳裡宴請客戶。主廚以精通在地食材聞名，準備了一份有六道小菜的精緻美食套餐，每道菜都用不同的盤子盛裝。最精彩的是一塊慢火燉煮、鮮嫩多汁的豬肉，讓大家的味蕾都很滿足。有些客人開玩笑說這頓晚餐太奢侈了，但老闆笑著說餐廳開的價格很公道。晚餐後，主廚說明他每天早上都直接向農夫採買所有食材。 | 上週末，我們公司在一家老飯店修復後的大廳裡宴請客戶。主廚以精通在地食材聞名，準備了一份有六道小菜的精緻美食套餐，每道菜都用不同的盤子盛裝。最精彩的是一塊慢火燉煮、鮮嫩多汁的豬肉，讓大家的味蕾都很滿足。有些客人開玩笑說這頓晚餐太奢侈了，但老闆笑著說飯店開的價格很公道。晚餐後，主廚說明他每天早上都直接向農夫採買所有食材。 |
| c1-u28-l01-q14 | rubricZh | gourmet 當形容詞，表示「美食的、精緻料理的」（例如 gourmet restaurants 等）／「很多」可寫 many、a lot of 等 | gourmet 當形容詞，表示「美食的、精緻料理的」（例如 gourmet restaurants 等）／「很多」可寫，例如 many、a lot of 等 |
| c1-u28-l01-q15 | rubricZh | tastebud 是可數名詞，表示「味蕾」，常用複數 tastebuds／句子要說到你自己喜歡的食物 | tastebud 是可數名詞，表示「味蕾」（例如 my tastebuds、the tastebuds 等）／句子要說到你自己喜歡的食物 |
| c1-u29-l01-q05 | exampleEn | We crossed the quiet lake in a small canoe. | The canoe was made from a single tree. |
| c1-u29-l01-q05 | exampleZh | 我們乘著一艘小獨木舟橫渡平靜的湖面。 | 這艘獨木舟是用一整棵樹做成的。 |
| c1-u29-l01-q06 | exampleEn | The first transatlantic flight took over 33 hours. | She is nervous about her first transatlantic flight. |
| c1-u29-l01-q06 | exampleZh | 第一次橫越大西洋的飛行花了超過 33 個小時。 | 她對自己第一次橫越大西洋的飛行感到緊張。 |
| c1-u29-l01-q14 | stemEn | Passengers in ____ do not need a visa if they stay inside the airport. | The airport has a quiet area where passengers in ____ can rest. |
| c1-u29-l01-q14 | stemZh | 過境旅客只要待在機場內，就不需要簽證。 | 機場有一處安靜的區域，讓過境旅客休息。 |
| c1-u29-l01-q15 | stemEn | We ____ a boat to take the whole team around the islands. | The boat can be ____ for weddings and birthday parties. |
| c1-u29-l01-q15 | stemZh | 我們包了一艘船，帶全隊環遊各個島嶼。 | 這艘船可以包租來辦婚禮和生日派對。 |
| c1-u29-l01-q16 | passageEn | Last month, Ken planned a business trip to Norway for his team. He prepared a careful itinerary, chartered a small boat to visit a fishing company, and booked a hotel with a sauna. The trip began badly: their bags were delayed in transit, and a long line of taxis honked outside the airport while they waited. However, the visit itself went well. On the last day, a famous mountaineer gave a talk about teamwork, and the team took an unmanned train back to the airport. Later, Ken sent the invoice to the finance office. | Last month, Ken planned a business trip to Norway for his team. He prepared a careful itinerary, chartered a small boat to visit a fishing company, and booked a hotel with a sauna. The trip began badly: their bags were delayed in transit, and a long line of taxis honked outside the airport while they waited. However, the visit itself went well. On the last day, a famous mountaineer gave a talk about teamwork, and the team watched an unmanned aircraft take photos of the coast. Later, Ken checked the hotel invoice before paying. |
| c1-u29-l01-q16 | passageZh | 上個月，肯恩為團隊安排了一趟到挪威的出差。他準備了周詳的行程表，包了一艘小船去拜訪一家漁業公司，還訂了一間有三溫暖的飯店。旅程一開始很不順：他們的行李在運送途中延誤了，等候時，機場外一長排計程車不停按喇叭。不過，拜訪本身很順利。最後一天，一位知名的登山家演講談團隊合作，團隊再搭無人駕駛的列車回到機場。之後，肯恩把發票寄給了財務部。 | 上個月，Ken 為團隊安排了一趟到挪威的出差。他準備了周詳的行程表，包了一艘小船去拜訪一家漁業公司，還訂了一間有三溫暖的飯店。旅程一開始很不順：他們的行李在運送途中延誤了，等候時，機場外一長排計程車不停按喇叭。不過，拜訪本身很順利。最後一天，一位知名的登山家演講談團隊合作，團隊也看到一架無人駕駛的飛機拍攝海岸。之後，Ken 在付款前仔細核對了飯店的帳單。 |
| c1-u29-l01-q16 | questions/1/questionZh | 最後一天團隊怎麼回到機場？ | 最後一天團隊看到了什麼？ |
| c1-u29-l01-q16 | questions/1/options | 包了一艘小船沿著海岸回去／搭無人駕駛的列車／坐登山家朋友開的車子回去／搭一長排計程車中的一輛 | 一長排計程車在機場外按喇叭／無人飛機拍攝海岸／漁業公司的員工在港口捕魚／一艘從挪威開往日本的大船 |
| c1-u29-l01-q17 | rubricZh | canoe 是名詞，表示「獨木舟」（例如 by canoe、in a canoe 等）／「往下游」可寫 down the river 等 | canoe 是名詞，表示「獨木舟」（例如 by canoe、in a canoe 等）／「往下游」可寫，例如 down the river、downstream 等 |
| c1-u29-l01-q18 | referenceEn | My itinerary for next summer includes three days in Tokyo.／I always plan a simple itinerary before I travel. | My itinerary for next summer includes three days in Tokyo.／I am still planning the itinerary for my trip to the mountains next month. |
| c1-u30-l01-q02 | exampleEn | My cousin plays guitar at weekend gigs to earn extra money. | My friend plays guitar at weekend gigs to earn extra money. |
| c1-u30-l01-q02 | exampleZh | 我表哥週末去演出場合彈吉他，賺點外快。 | 我朋友週末去演出場合彈吉他，賺點外快。 |
| c1-u30-l01-q11 | stemEn | The ____ for the new film took two writers a whole year. | The actors read the ____ together before filming began. |
| c1-u30-l01-q11 | stemZh | 這部新電影的劇本花了兩位編劇整整一年。 | 開拍前，演員們一起讀了劇本。 |
| c1-u30-l01-q11 | options | screenplay／sauna／canoe／plaque | screenplay／darkroom／devotee／billiards |
| c1-u30-l01-q11 | optionGlossZh | 電影劇本／三溫暖／獨木舟／牌匾 | 電影劇本／暗房／愛好者／撞球 |
| c1-u30-l01-q13 | passageEn | Five years ago, the band Blue Door played small gigs in cafés and recorded a demo in a friend's bedroom. A film director heard the demo and asked them to write music for his new movie. The film became a surprise blockbuster, and the band's song was a number-one hit within a week of its debut. Now the director is working on a sequel, and the band's singer, Lily, has even helped with the screenplay. She says success has not changed them: they still play one free show in a café every month. | Five years ago, the band Lumo played small gigs in cafés and recorded a demo in a friend's bedroom. A film director heard the demo and asked them to write music for his new movie. The film became a surprise blockbuster, and the band's song was a number-one hit within a week of its debut. Now the director is working on a sequel, and the band's singer, Nadia, has even helped with the screenplay. She says success has not changed them: they still play one free show in a café every month. |
| c1-u30-l01-q13 | passageZh | 五年前，藍門樂團還在咖啡館做小型演出，並在朋友的臥室錄了一張試聽帶。一位電影導演聽到這張試聽帶後，請他們為他的新電影寫配樂。這部電影意外成為賣座大片，樂團的歌推出不到一週就登上排行榜第一名。現在導演正在拍續集，樂團主唱莉莉甚至幫忙寫了劇本。她說成功並沒有改變他們：他們每個月仍會在咖啡館免費演出一場。 | 五年前，Lumo 樂團還在咖啡館做小型演出，並在朋友的臥室錄了一張試聽帶。一位電影導演聽到這張試聽帶後，請他們為他的新電影寫配樂。這部電影意外成為賣座大片，樂團的歌推出不到一週就登上排行榜第一名。現在導演正在拍續集，樂團主唱 Nadia 甚至幫忙寫了劇本。她說成功並沒有改變他們：他們每個月仍會在咖啡館免費演出一場。 |
| c1-u30-l01-q13 | questions/1/questionZh | 莉莉說他們現在仍會做什麼？ | Nadia 說他們現在仍會做什麼？ |
| c1-u30-l01-q14 | rubricZh | debut 可當名詞或修飾名詞，表示「初次登場、首部作品」（例如 a debut novel、make a debut 等）／「出版」可寫 came out、was published 等／「非常成功」可寫 was a big success、was very successful 等 | debut 可當名詞或修飾名詞，表示「初次登場、首部作品」（例如 a debut novel、make a debut 等）／「出版」可寫，例如 came out、was published 等／「非常成功」可寫，例如 was a big success、was very successful 等 |
| c1-u30-l01-q15 | rubricZh | sequel 是可數名詞，常用 a sequel to…，表示「…的續集」／句子要說到你自己的喜好 | sequel 是可數名詞，表示「續集」，用法例如 a sequel to…、the sequel 等／句子要說到你自己的喜好 |
| c1-u31-l01-q01 | exampleEn | The new drug is still in clinical trials. | The new medicine is still in clinical trials. |
| c1-u31-l01-q02 | exampleEn | The children needed time to recover from the trauma of the flood. | For some people, moving house can be a real trauma. |
| c1-u31-l01-q02 | exampleZh | 孩子們需要時間從水災的創傷中恢復。 | 對某些人來說，搬家可能是一種真正的創傷。 |
| c1-u31-l01-q06 | exampleEn | Sleep is restorative for both body and mind. | Experts did careful restorative work on the old painting. |
| c1-u31-l01-q06 | exampleZh | 睡眠能讓身心都恢復元氣。 | 專家對那幅老畫做了細心的修復工作。 |
| c1-u31-l01-q06 | glossZh | 有助恢復的；修復的 | 修復的；有助恢復的 |
| c1-u31-l01-q06 | distractorsZh | 令人緊張的；有壓力的／令人疲倦的；累人的／令人厭煩的；無聊的 | 破壞的；令人緊張的／裝飾的；令人疲倦的／臨時的；令人厭煩的 |
| c1-u31-l01-q13 | stemEn | Many people who survived the earthquake still suffer from ____. | Psychologists study how childhood ____ can affect adult life. |
| c1-u31-l01-q13 | stemZh | 許多地震倖存者至今仍受創傷所苦。 | 心理學家研究童年創傷如何影響成年後的生活。 |
| c1-u31-l01-q14 | passageEn | Last year, a city hospital turned an empty roof into a garden. The idea came from a psychiatrist who noticed that many patients on the psychiatric ward rarely went outside. Clinical staff now take small groups to the garden every afternoon, and some patients say the fresh air feels restorative. Volunteers also run a remedial reading class there for children who are staying in the hospital for a long time. The garden is next to the dispensary, so visitors often stop there while waiting for medicine. The hospital hopes the garden can help people who have experienced trauma feel calmer. | Last year, a city hospital turned an empty roof into a garden. The idea came from a psychiatrist who noticed that many patients on the psychiatric ward rarely went outside. Clinical staff now take small groups to the garden every afternoon, and some patients say it is the best part of their day. Volunteers also run a remedial reading class there for children who are staying in the hospital for a long time. The garden is next to the dispensary, so visitors often stop there while waiting for medicine. The hospital hopes the garden will become a calm place for everyone. |
| c1-u31-l01-q14 | passageZh | 去年，一家市立醫院把空著的屋頂改造成花園。這個點子來自一位精神科醫師，他注意到精神科病房的許多病人很少到戶外。現在臨床人員每天下午會帶小組病人到花園，有些病人說新鮮空氣讓他們恢復了元氣。志工也在那裡為長期住院的孩子開設閱讀補救課程。花園就在藥局旁邊，所以訪客等領藥時常會去走走。醫院希望花園能幫助經歷過創傷的人感到平靜一些。 | 去年，一家市立醫院把空著的屋頂改造成花園。這個點子來自一位精神科醫師，他注意到精神科病房的許多病人很少到戶外。現在臨床人員每天下午會帶小組病人到花園，有些病人說那是他們一天中最喜歡的時光。志工也在那裡為長期住院的孩子開設閱讀補救課程。花園就在藥局旁邊，所以訪客等領藥時常會去走走。醫院希望花園能成為每個人都能放鬆的地方。 |
| c1-u31-l01-q15 | promptZh | 有些人壓力太大時，會去看精神科醫師。 | 她的哥哥是一位精神科醫師。 |
| c1-u31-l01-q15 | referenceEn | Some people see a psychiatrist when the stress becomes too much.／When they are under too much stress, some people go to a psychiatrist. | Her older brother is a psychiatrist.／Her older brother became a psychiatrist. |
| c1-u31-l01-q15 | rubricZh | psychiatrist 是可數名詞，表示「精神科醫師」（例如 see a psychiatrist、go to a psychiatrist 等）／「壓力太大」可寫 under too much stress、the stress becomes too much 等 | psychiatrist 是可數名詞，表示「精神科醫師」（例如 see a psychiatrist、go to a psychiatrist 等）／「哥哥」可寫，例如 older brother、elder brother 等 |
| c1-u32-l01-q01 | exampleEn | We hired a contractor to build the new kitchen. | The contractor promised to finish the new roof by Friday. |
| c1-u32-l01-q01 | exampleZh | 我們請了一家承包商來蓋新廚房。 | 承包商答應在星期五前完成新屋頂。 |
| c1-u32-l01-q08 | exampleEn | We drank tea on the verandah and watched the rain. | Their beach house has a wide verandah that faces the sea. |
| c1-u32-l01-q08 | exampleZh | 我們在門廊上一邊喝茶，一邊看雨。 | 他們的海邊小屋有一座面海的寬敞門廊。 |
| c1-u32-l01-q15 | options | screenplay／tastebud／plumbing／blockbuster | flask／bouquet／plumbing／utensil |
| c1-u32-l01-q15 | optionGlossZh | 電影劇本／味蕾／水管系統／賣座大片 | 保溫瓶／花束／水管系統／器具 |
| c1-u32-l01-q18 | rubricZh | demolition 是名詞，表示「拆除」（例如 the demolition of…、be due for demolition 等）／「下個月」可寫 next month 等 | demolition 是名詞，表示「拆除」（例如 the demolition of…、be due for demolition 等）／「下個月」可寫，例如 next month、in a month 等 |
| c1-u33-l01-q05 | exampleEn | The player received a three-game suspension for fighting. | The supplier's problems caused a suspension of deliveries to the factory. |
| c1-u33-l01-q05 | exampleZh | 那名球員因為打架被禁賽三場。 | 供應商出了問題，導致送往工廠的貨暫停了。 |
| c1-u33-l01-q05 | glossZh | 暫停、停職；懸吊系統 | 暫停、中止；停職、懸吊系統 |
| c1-u33-l01-q05 | distractorsZh | 升職、加薪；獎勵／罰款、罰金；處罰／轉隊、調職；移動 | 恢復、重啟；彈簧系統／延長、增加；煞車系統／加速、提前；排氣系統 |
| c1-u33-l01-q14 | rubricZh | stretching 是不可數名詞，表示「伸展」，常用 do some stretching／「跑步前」可寫 before they run、before running 等 | stretching 是不可數名詞，表示「伸展」，用法例如 do some stretching、do stretching 等／「跑步前」可寫，例如 before they run、before running 等 |
| c1-u33-l01-q15 | referenceEn | My grandfather's watch is so durable that it still works after forty years.／These durable shoes have lasted me three years. | My watch is so durable that it still works after twenty years.／My old suitcase is very durable; it has been to ten countries. |
| c1-u34-l01-q13 | passageEn | Our school library recently tested a new self-service machine for borrowing books. Students can personalize the screen with their favorite colors, and a magnetic reader checks each book's code. During the first week, the machine malfunctioned twice when too many students used it at once. The company that made it then added a small buffer of memory so that it could handle more requests at the same time. The library also bought portable reading lamps made of light synthetic material. Most students now prefer the machine to waiting in line at the front desk. | Our school library recently tested a new self-service machine for borrowing books. Students can personalize the screen with their favorite colors, and a reader checks the magnetic strip in each book. During the first week, the machine malfunctioned twice when too many students used it at once. The company that made it then added more buffer memory so that it could handle more requests at the same time. The library also bought portable reading lamps made of light synthetic material. Most students now prefer the machine to waiting in line at the front desk. |
| c1-u34-l01-q13 | passageZh | 我們學校圖書館最近試用了一台新的自助借書機。學生可以用自己喜歡的顏色設定專屬畫面，磁性讀取器會檢查每本書的條碼。第一週，太多學生同時使用時，機器故障了兩次。製造商隨後加了一小塊記憶體緩衝區，讓它能同時處理更多請求。圖書館還買了用輕巧合成材料製成的隨身閱讀燈。現在大多數學生都比較喜歡用機器，而不是在櫃台排隊。 | 我們學校圖書館最近試用了一台新的自助借書機。學生可以用自己喜歡的顏色設定專屬畫面，讀取器會檢查每本書裡的磁條。第一週，太多學生同時使用時，機器故障了兩次。製造商隨後增加了更多緩衝記憶體，讓它能同時處理更多請求。圖書館還買了用輕巧合成材料製成的隨身閱讀燈。現在大多數學生都比較喜歡用機器，而不是在櫃台排隊。 |
| c1-u34-l01-q13 | questions/1/options | 把機器搬到圖書館的另一個角落／加了一小塊記憶體緩衝區／換了一個新的螢幕／重新安裝了程式 | 把機器搬到圖書館的另一個角落／增加了更多緩衝記憶體／換了一個新螢幕／重新安裝程式 |
| c1-u34-l01-q14 | rubricZh | personalize 是及物動詞，表示「個人化、打造專屬」（例如 personalize your page 等）／「讓你」可寫 lets you、you can 等 | personalize 是及物動詞，表示「個人化、打造專屬」（例如 personalize your page 等）／「讓你」可寫，例如 lets you、allows you to、you can 等 |
| c1-u34-l01-q15 | referenceEn | My portable speaker goes with me to the beach every summer.／I use a small portable keyboard with my tablet. | I keep a small portable fan on my desk at work.／I use a small portable keyboard with my tablet. |
| c1-u34-l02-q11 | options | firewall／staple／ploy／itinerary | firewall／invoice／shortlist／specification |
| c1-u34-l02-q11 | optionGlossZh | 防火牆／主食／計策／行程表 | 防火牆／請款單／最終候選名單／規格 |
| c1-u34-l02-q12 | stemEn | Please ____ the batteries before the camping trip. | My phone takes two hours to ____ fully. |
| c1-u34-l02-q12 | stemZh | 露營之前，請先把電池充好電。 | 我的手機要兩個小時才能完全充飽電。 |
| c1-u34-l02-q13 | passageEn | My grandmother used to keep her recipes in old notebooks. Last year, my brother decided to digitalize them so the whole family could read them online. The digitalization took months, but now each recipe has photos and notes. He even added some personalization: every family member can save favorite dishes. My grandmother, who is not a fan of new gadgets, was surprised by how easy it was to use. Her only request was a durable tablet that she can recharge in the kitchen. My brother also set up a firewall to keep the family site safe. | My grandmother used to keep her recipes in old notebooks. Last year, my older brother decided to digitalize them so the whole family could read them online. The digitalization took months, but now each recipe has photos and notes. He even added some personalization: every family member can save favorite dishes. My grandmother was surprised by how easy the new site was to use. Her only request was a durable tablet that she can recharge in the kitchen. He also set up a firewall to keep the family site safe. |
| c1-u34-l02-q13 | passageZh | 我奶奶以前把食譜記在舊筆記本裡。去年，我哥哥決定把它們數位化，讓全家人都能在網路上看。數位化花了好幾個月，但現在每份食譜都有照片和註記。他甚至加入了一些個人化功能：每位家人都能收藏自己最愛的料理。不太喜歡新玩意兒的奶奶，對它這麼好用感到驚訝。她唯一的要求，是一台可以在廚房充電、耐用的平板。哥哥也設定了防火牆，保護家族網站的安全。 | 我奶奶以前把食譜記在舊筆記本裡。去年，我哥哥決定把它們數位化，讓全家人都能在網路上看。數位化花了好幾個月，但現在每份食譜都有照片和註記。他甚至加入了一些個人化功能：每位家人都能收藏自己最愛的料理。奶奶很驚訝新網站這麼好用。她唯一的要求，是一台可以在廚房充電、耐用的平板。哥哥也設定了防火牆，保護家族網站的安全。 |
| c1-u34-l02-q14 | rubricZh | recharge 可指幫電器充電，也可指人「恢復精力」（例如 go out to recharge 等）／「週末」可寫 on weekends 等／「去山上走走」可寫 go walking in the mountains 等 | recharge 可指幫電器充電，也可指人「恢復精力」（例如 go out to recharge 等）／「週末」可寫，例如 on weekends、at the weekend 等／「去山上走走」可寫，例如 go walking in the mountains、walk in the mountains 等 |
| c1-u35-l01-q03 | exampleEn | The film shows the exploitation of child workers in the past. | The exploitation of solar energy is growing fast. |
| c1-u35-l01-q03 | exampleZh | 這部電影呈現了過去童工遭受剝削的情形。 | 太陽能的開發利用正快速成長。 |
| c1-u35-l01-q03 | glossZh | 剝削；開發、利用 | 開發、利用；剝削 |
| c1-u35-l01-q03 | distractorsZh | 保護；照顧／教育；培訓／表揚；獎勵 | 保育、保護；照顧／浪費、耗損；破壞／禁止、限制；管制 |
| c1-u35-l01-q11 | options | premise／plumbing／gadget／carpentry | premise／exploitation／credential／renown |
| c1-u35-l01-q11 | optionGlossZh | 前提／水管系統／小裝置／木工 | 前提／開發、利用／資格證明／名聲 |
| c1-u35-l01-q14 | rubricZh | pioneer 是可數名詞，表示「先驅、開拓者」（例如 one of the pioneers of… 等）／「台灣電影」可寫 Taiwanese film、film in Taiwan 等 | pioneer 是可數名詞，表示「先驅、開拓者」（例如 one of the pioneers of… 等）／「台灣電影」可寫，例如 Taiwanese film、film in Taiwan、Taiwanese movies 等 |

## 四、逐欄改動：第 1 批評分要點（96 欄）

| 題 id | 欄位 | 改前 | 改後 |
|---|---|---|---|
| c1-u01-l01-q18 | rubricZh | principally 表示「主要地」，可放在介系詞片語前（例如 principally for new staff）／「新進員工」可寫 new staff、new employees、new workers 等／動詞可用 is、is held、is being held 等 | principally 表示「主要地」，位置有彈性（例如 principally for new staff 等）／「新進員工」可寫，例如 new staff、new employees、new workers 等／動詞可寫，例如 is、is held、is being held 等 |
| c1-u01-l01-q19 | rubricZh | 用 be apt to＋原形動詞表示「容易⋯、往往會⋯」（例如 am apt to forget）／句子說的是你自己的習慣或狀況 | 用 be apt to＋原形動詞表示「容易⋯、往往會⋯」（例如 am apt to forget 等）／句子說的是你自己的習慣或狀況 |
| c1-u02-l01-q15 | rubricZh | expire 表示「到期」，時態可用現在式或未來式（例如 expires、will expire）／「十二月底」可寫 at the end of December 等 | expire 表示「到期」，時態配合內容（例如 expires、will expire 等）／「十二月底」可寫，例如 at the end of December 等 |
| c1-u02-l01-q16 | rubricZh | 常用 for the duration of＋名詞表示「在⋯的整段期間」（例如 for the duration of the movie）／句子說的是你自己／時態配合內容即可（例如 turn off、stayed） | duration 的用法，例如 for the duration of the movie 等，表示「在⋯的整段期間」／句子說的是你自己／時態配合內容即可（例如 turn off、stayed 等） |
| c1-u02-l02-q15 | rubricZh | 「可以追溯到」可寫 date back to、date from 等（例如 dates back to antiquity）／antiquity 指「古代」，前面通常不加冠詞 | 「可以追溯到」可寫 date back to、date from 等（例如 dates back to antiquity 等）／antiquity 指「古代」，前面通常不加冠詞 |
| c1-u02-l02-q16 | rubricZh | antiquated 是形容詞，表示「過時的、老舊的」（例如 an antiquated habit、feels antiquated）／句子要說出你覺得過時的東西或做法 | antiquated 是形容詞，表示「過時的、老舊的」（例如 an antiquated habit、feels antiquated 等）／句子要說出你覺得過時的東西或做法 |
| c1-u03-l01-q16 | rubricZh | misplace 表示「放錯地方、一時找不到」（例如 misplaced my phone）／「結果發現」可寫 but then I found it、later I found it 等／時態配合內容（例如 misplaced、had misplaced） | misplace 表示「放錯地方、一時找不到」（例如 misplaced my phone 等）／「結果發現」可寫，例如 but then I found it、later I found it 等／時態配合內容（例如 misplaced、had misplaced 等） |
| c1-u03-l01-q17 | rubricZh | be obliged to、feel obliged to 後接原形動詞，表示「（因規定或情理）不得不」（例如 am obliged to wear）／句子說的是你自己／時態配合內容（例如 am、felt） | be obliged to、feel obliged to 後接原形動詞，表示「（因規定或情理）不得不」（例如 am obliged to wear 等）／句子說的是你自己／時態配合內容（例如 am、felt 等） |
| c1-u03-l02-q16 | rubricZh | render＋受詞＋形容詞表示「使變得⋯」（例如 rendered my computer useless）／「停電」可寫 power cut、power failure 等／時態配合內容（例如 rendered、has rendered） | render＋受詞＋形容詞表示「使變得⋯」（例如 rendered my computer useless 等）／「停電」可寫，例如 power cut、power failure 等／時態配合內容（例如 rendered、has rendered 等） |
| c1-u03-l02-q17 | rubricZh | clutch 當動詞表示「緊抓」（例如 clutched my bag）／句子說的是你自己／時態配合內容（例如 clutched、clutch） | clutch 當動詞表示「緊抓」（例如 clutched my bag 等）／句子說的是你自己／時態配合內容（例如 clutched、clutch 等） |
| c1-u03-l03-q16 | rubricZh | flourish 表示「興旺、蓬勃發展」（例如 has flourished、has been flourishing）／「這幾年」可寫 in recent years、over the past few years 等／時態可用現在完成式或現在進行式（例如 has flourished、has been flourishing、is flourishing） | flourish 表示「興旺、蓬勃發展」（例如 has flourished、has been flourishing 等）／「這幾年」可寫，例如 in recent years、over the past few years 等／時態配合內容（例如 has flourished、has been flourishing、is flourishing 等） |
| c1-u03-l03-q17 | rubricZh | rotate 表示「輪流（做）」，後面可接要輪流的工作（例如 rotate the cleaning）／句子要說到你自己（例如主詞含 I 或 we） | rotate 表示「輪流（做）」，後面可接要輪流的工作（例如 rotate the cleaning 等）／句子要說到你自己（例如主詞含 I 或 we） |
| c1-u03-l04-q16 | rubricZh | embark on＋名詞表示「著手、展開」（例如 embark on a new project）／「計畫（做）」可寫 plans to、is planning to、intends to 等／「研究計畫」可寫 research project、research program 等 | embark on＋名詞表示「著手、展開」（例如 embark on a new project 等）／「計畫（做）」可寫，例如 plans to、is planning to、intends to 等／「研究計畫」可寫，例如 research project、research program 等 |
| c1-u03-l04-q17 | rubricZh | maneuver 當動詞表示「小心地操控、移動」（例如 maneuvered my car into…）／句子說的是你自己／時態配合內容（例如 maneuvered、had to maneuver） | maneuver 當動詞表示「小心地操控、移動」（例如 maneuvered my car into… 等）／句子說的是你自己／時態配合內容（例如 maneuvered、had to maneuver 等） |
| c1-u03-l05-q16 | rubricZh | resonate with＋人表示「引起⋯的共鳴」（例如 resonates with many young people）／時態可用現在式或現在完成式（例如 resonates、has resonated） | resonate with＋人表示「引起⋯的共鳴」（例如 resonates with many young people 等）／時態配合內容（例如 resonates、has resonated 等） |
| c1-u03-l05-q17 | rubricZh | conjure up＋名詞表示「使浮現（腦海）、喚起」（例如 conjures up memories）／句子要說到你自己的聯想／時態配合內容（例如 conjures up、conjured up） | conjure up＋名詞表示「使浮現（腦海）、喚起」（例如 conjures up memories 等）／句子要說到你自己的聯想／時態配合內容（例如 conjures up、conjured up 等） |
| c1-u03-l06-q16 | rubricZh | be accustomed to 後接名詞或動名詞（例如 accustomed to getting up）／「還不」可寫 not yet、still not 等／「起床」可寫 get up、wake up 等 | be accustomed to 後接名詞或動名詞（例如 accustomed to getting up 等）／「還不」可寫，例如 not yet、still not 等／「起床」可寫，例如 get up、wake up 等 |
| c1-u03-l06-q17 | rubricZh | mingle with＋人表示「（在社交場合）和⋯交流、打成一片」（例如 mingled with the guests）／句子說的是你自己／時態配合內容（例如 mingled、mingle） | mingle with＋人表示「（在社交場合）和⋯交流、打成一片」（例如 mingled with the guests 等）／句子說的是你自己／時態配合內容（例如 mingled、mingle 等） |
| c1-u04-l01-q16 | rubricZh | spacious 表示「寬敞的」／「容納」可寫 hold、seat、fit 等／「體育館」可寫 gym、sports hall、stadium 等 | spacious 表示「寬敞的」／「容納」可寫，例如 hold、seat、fit 等／「體育館」可寫，例如 gym、sports hall、stadium 等 |
| c1-u04-l01-q17 | rubricZh | notable 表示「值得注意的、著名的」（例如 is notable for its night markets、one notable thing）／句子要說到你自己的城市或家鄉 | notable 表示「值得注意的、著名的」（例如 is notable for its night markets、one notable thing 等）／句子要說到你自己的城市或家鄉 |
| c1-u04-l02-q16 | rubricZh | simplicity 是名詞，表示「簡單、簡潔」（例如 the simplicity of the design）／「很喜歡」可寫 really like、love、like…a lot 等 | simplicity 是名詞，表示「簡單、簡潔」（例如 the simplicity of the design 等）／「很喜歡」可寫，例如 really like、love、like…a lot 等 |
| c1-u04-l02-q17 | rubricZh | elusive 表示「難以捉摸的、難以達到的」，常放在 be、remain、become 後（例如 remains elusive）／句子要說到你自己的經驗 | elusive 表示「難以捉摸的、難以達到的」，位置有彈性（例如 remains elusive、an elusive goal 等）／句子要說到你自己的經驗 |
| c1-u04-l03-q16 | rubricZh | phenomenal 表示「驚人的、非凡的」（例如 the service is phenomenal）／加強語氣可用 truly、really 等，不加也可以／「這間飯店的服務」可寫 the service at this hotel、this hotel's service 等 | phenomenal 表示「驚人的、非凡的」（例如 the service is phenomenal 等）／加強語氣可寫，例如 truly、really 等，不加也可以／「這間飯店的服務」可寫，例如 the service at this hotel、this hotel's service 等 |
| c1-u04-l03-q17 | rubricZh | versatile 表示「多用途的」，可放在名詞前或 be 動詞後（例如 a versatile knife、is versatile）／句子要說出你自己的看法或經驗 | versatile 表示「多用途的」，位置有彈性（例如 a versatile knife、is versatile 等）／句子要說出你自己的看法或經驗 |
| c1-u04-l04-q16 | rubricZh | not remotely＋形容詞表示「一點也不」（例如 not remotely interested）／「運動」可寫 sports、sport 等 | not remotely＋形容詞表示「一點也不」（例如 not remotely interested 等）／「運動」可寫，例如 sports、sport 等 |
| c1-u04-l04-q17 | rubricZh | closeness 是名詞，表示「親近、親密」（例如 the closeness I have with…、the closeness between…）／句子要說到你自己和某個人的關係 | closeness 是名詞，表示「親近、親密」（例如 the closeness I have with…、the closeness between… 等）／句子要說到你自己和某個人的關係 |
| c1-u04-l05-q16 | rubricZh | rudimentary 表示「基本的、初步的」（例如 rudimentary computer skills）／「需要」可寫 require、need 等 | rudimentary 表示「基本的、初步的」（例如 rudimentary computer skills 等）／「需要」可寫，例如 require、need 等 |
| c1-u04-l05-q17 | rubricZh | rarity 表示「罕見的事物」，常用 a rarity（例如 is a rarity）／句子要說到你自己的生活 | rarity 表示「罕見的事物」，用法例如 is a rarity、a real rarity 等／句子要說到你自己的生活 |
| c1-u04-l06-q16 | rubricZh | frosty 可表示「（態度）冷淡的」（例如 a frosty tone）／「回答」可寫 answer、reply 等／「相當」可寫 rather、quite 等 | frosty 可表示「（態度）冷淡的」（例如 a frosty tone 等）／「回答」可寫，例如 answer、reply 等／「相當」可寫，例如 rather、quite 等 |
| c1-u04-l06-q17 | rubricZh | oddity 表示「怪事、古怪的人或物」（例如 an oddity、a bit of an oddity）／句子要說到你身邊的人或東西 | oddity 表示「怪事、古怪的人或物」（例如 an oddity、a bit of an oddity 等）／句子要說到你身邊的人或東西 |
| c1-u04-l07-q16 | rubricZh | effortless 表示「不費力的」，可用 make＋受詞＋look effortless／「舞步」可寫 steps、dance steps、moves 等／時態配合內容（例如 makes、made） | effortless 表示「不費力的」，用法例如 make … look effortless、an effortless win 等／「舞步」可寫，例如 steps、dance steps、moves 等／時態配合內容（例如 makes、made 等） |
| c1-u04-l07-q17 | rubricZh | impervious to＋名詞表示「不受⋯影響、不透⋯」（例如 impervious to water）／句子要說到你自己或你的東西 | impervious to＋名詞表示「不受⋯影響、不透⋯」（例如 impervious to water 等）／句子要說到你自己或你的東西 |
| c1-u05-l01-q17 | rubricZh | the bulk of＋名詞表示「⋯的大部分」（例如 the bulk of the staff）／「員工」可寫 staff、employees、workers 等／動詞單複數依所指皆可接受（例如 live、lives） | the bulk of＋名詞表示「⋯的大部分」（例如 the bulk of the staff 等）／「員工」可寫，例如 staff、employees、workers 等／動詞單複數依所指皆可接受（例如 live、lives 等） |
| c1-u05-l01-q18 | rubricZh | plummet 表示「驟降、暴跌」，後面不接受詞（例如 my spending plummeted、plummeted to five percent）／句子要說到你自己的生活／時態配合內容（例如 plummeted、plummets） | plummet 表示「驟降、暴跌」，後面不接受詞（例如 my spending plummeted、plummeted to five percent 等）／句子要說到你自己的生活／時態配合內容（例如 plummeted、plummets 等） |
| c1-u05-l02-q17 | rubricZh | marginally＋比較級表示「稍微⋯一點」（例如 marginally higher）／「漲價」可寫 price rise、price increase 等／比較對象可寫 last year's、the one last year 等 | marginally＋比較級表示「稍微⋯一點」（例如 marginally higher 等）／「漲價」可寫，例如 price rise、price increase 等／比較對象可寫，例如 last year's、the one last year 等 |
| c1-u05-l02-q18 | rubricZh | limitless 表示「無限的」，可放在名詞前或 be、seem 後（例如 limitless energy、seem limitless）／句子要說出你自己的看法 | limitless 表示「無限的」，位置有彈性（例如 limitless energy、seem limitless 等）／句子要說出你自己的看法 |
| c1-u05-l03-q16 | rubricZh | amply 表示「充分地」，常放在過去分詞前（例如 amply rewarded）／「努力」可寫 hard work、efforts 等／「得到回報」可寫 has been rewarded、has paid off 等 | amply 表示「充分地」，用法例如 amply rewarded、amply paid 等／「努力」可寫，例如 hard work、efforts 等／「得到回報」可寫，例如 has been rewarded、has paid off 等 |
| c1-u05-l03-q17 | rubricZh | bulk up＋受詞表示「使變大、充實」（例如 bulk up my presentation）／句子要說到你自己的東西／時態配合內容（例如 want to bulk up、bulked up） | bulk up＋受詞表示「使變大、充實」（例如 bulk up my presentation 等）／句子要說到你自己的東西／時態配合內容（例如 want to bulk up、bulked up 等） |
| c1-u06-l01-q17 | rubricZh | discourse 表示「（公共的）討論、論述」（例如 public discourse）／「網路上的」可寫 online、on the internet 等／「太過情緒化」可寫 too emotional 等 | discourse 表示「（公共的）討論、論述」（例如 public discourse 等）／「網路上的」可寫，例如 online、on the internet 等／「太過情緒化」可寫，例如 too emotional 等 |
| c1-u06-l01-q18 | rubricZh | conviction 表示「堅定的信念」（例如 It is my conviction that…、a conviction that…）／句子說的是你自己的信念 | conviction 表示「堅定的信念」（例如 It is my conviction that…、a conviction that… 等）／句子說的是你自己的信念 |
| c1-u06-l02-q16 | rubricZh | likelihood 表示「可能性」（例如 a high likelihood that…、the likelihood of…）／「不出席」可寫 not attend、miss 等 | likelihood 表示「可能性」（例如 a high likelihood that…、the likelihood of… 等）／「不出席」可寫，例如 not attend、miss 等 |
| c1-u06-l02-q17 | rubricZh | speculate 表示「推測、猜測」，可接 about＋名詞或子句、that 子句（例如 speculate about why…）／句子要說到你自己的猜測 | speculate 表示「推測、猜測」，可接 about＋名詞或子句、that 子句（例如 speculate about why… 等）／句子要說到你自己的猜測 |
| c1-u06-l03-q16 | rubricZh | pros and cons 表示「優缺點」（con 指缺點，常用複數 cons）／「說說」可寫 tell me、explain、talk about 等 | pros and cons 表示「優缺點」（con 指缺點，例如 the pros and cons、the cons 等）／「說說」可寫，例如 tell me、explain、talk about 等 |
| c1-u06-l03-q17 | rubricZh | realism 可表示「寫實」或「務實的態度」（例如 the realism of the film、my mother's realism）／句子要說出你自己的看法 | realism 可表示「寫實」或「務實的態度」（例如 the realism of the film、my mother's realism 等）／句子要說出你自己的看法 |
| c1-u06-l04-q16 | rubricZh | concur with＋人或看法表示「同意」（例如 concur with your view）／「看法」可寫 view、opinion 等 | concur with＋人或看法表示「同意」（例如 concur with your view 等）／「看法」可寫，例如 view、opinion 等 |
| c1-u06-l04-q17 | rubricZh | intuition 表示「直覺」（例如 follow my intuition、my intuition told me…）／句子要說到你自己的經驗／時態配合內容（例如 followed、told） | intuition 表示「直覺」（例如 follow my intuition、my intuition told me… 等）／句子要說到你自己的經驗／時態配合內容（例如 followed、told 等） |
| c1-u06-l05-q16 | rubricZh | compare favorably with／to 表示「相比之下毫不遜色」（例如 compares favorably with the others）／「其他餐廳」可寫 the others、other restaurants 等 | compare favorably with／to 表示「相比之下毫不遜色」（例如 compares favorably with the others 等）／「其他餐廳」可寫，例如 the others、other restaurants 等 |
| c1-u06-l05-q17 | rubricZh | realist 表示「務實的人、現實主義者」（例如 I am a realist、very much a realist）／句子要說到你自己 | realist 表示「務實的人、現實主義者」（例如 I am a realist、very much a realist 等）／句子要說到你自己 |
| c1-u06-l06-q16 | rubricZh | insightful 表示「有見地的、有洞察力的」（例如 an insightful answer、was insightful）／可加 very、really 等加強語氣 | insightful 表示「有見地的、有洞察力的」（例如 an insightful answer、was insightful 等）／加強語氣可寫，例如 very、really 等 |
| c1-u06-l06-q17 | rubricZh | be conditional on＋名詞或動名詞表示「視⋯而定」（例如 is conditional on getting…）／句子要說到你自己的計畫 | be conditional on＋名詞或動名詞表示「視⋯而定」（例如 is conditional on getting… 等）／句子要說到你自己的計畫 |
| c1-u06-l07-q16 | rubricZh | credibly 是副詞，修飾動詞，表示「可信地」（例如 spoke credibly）／「大家都相信了」可寫 everyone believed him、all of us believed him 等 | credibly 是副詞，修飾動詞，表示「可信地」（例如 spoke credibly 等）／「大家都相信了」可寫，例如 everyone believed him、all of us believed him 等 |
| c1-u06-l07-q17 | rubricZh | envisage 可接名詞、動名詞或 that 子句，表示「設想」（例如 envisage living…、envisage that I will…）／句子要說到你自己 | envisage 可接名詞、動名詞或 that 子句，表示「設想」（例如 envisage living…、envisage that I will… 等）／句子要說到你自己 |
| c1-u06-l08-q16 | rubricZh | minutiae 表示「細枝末節」，是複數名詞（例如 the minutiae）／「操心」可寫 worry about、be worried about 等 | minutiae 表示「細枝末節」，是複數名詞（例如 the minutiae 等）／「操心」可寫，例如 worry about、be worried about 等 |
| c1-u06-l08-q17 | rubricZh | norms 指「（社會或團體的）規範」（例如 social norms、one of the norms）／句子要說到你自己的家鄉或工作場所 | norms 指「（社會或團體的）規範」（例如 social norms、one of the norms 等）／句子要說到你自己的家鄉或工作場所 |
| c1-u07-l01-q16 | rubricZh | inherent 表示「固有的、本身就有的」（例如 inherent risks）／可寫 There are…in…，也可寫 This method has… 等 | inherent 表示「固有的、本身就有的」（例如 inherent risks 等）／可寫，例如 There are…in…，也可寫 This method has… 等 |
| c1-u07-l01-q17 | rubricZh | diversity 表示「多元、多樣性」（例如 the diversity of the food）／句子要說到你自己的城市、學校或公司 | diversity 表示「多元、多樣性」（例如 the diversity of the food 等）／句子要說到你自己的城市、學校或公司 |
| c1-u07-l02-q16 | rubricZh | inherently 表示「本質上」，放在形容詞前（例如 inherently dangerous）／「危險」可寫 dangerous、risky 等 | inherently 表示「本質上」，用法例如 inherently dangerous、is inherently 等／「危險」可寫，例如 dangerous、risky 等 |
| c1-u07-l02-q17 | rubricZh | impede 是及物動詞，表示「妨礙、阻礙」（例如 impedes my work）／句子要說到你自己的學習或工作／時態配合內容（例如 impedes、impeded） | impede 是及物動詞，表示「妨礙、阻礙」（例如 impedes my work 等）／句子要說到你自己的學習或工作／時態配合內容（例如 impedes、impeded 等） |
| c1-u07-l03-q16 | rubricZh | 「睡眠不足」可寫，例如 sleep deprivation、deprivation of sleep 等／「會影響」可寫 can affect、may affect 等／「判斷力」可寫 judgment、ability to judge 等 | 「睡眠不足」可寫，例如 sleep deprivation、deprivation of sleep 等／「會影響」可寫，例如 can affect、may affect 等／「判斷力」可寫，例如 judgment、ability to judge 等 |
| c1-u07-l03-q17 | rubricZh | resilient 表示「有韌性的、能很快恢復的」（例如 more resilient、the most resilient person）／句子要說到你自己或你認識的人 | resilient 表示「有韌性的、能很快恢復的」（例如 more resilient、the most resilient person 等）／句子要說到你自己或你認識的人 |
| c1-u07-l04-q15 | rubricZh | diverge 是不及物動詞，表示「（意見）分歧」（例如 opinions often diverge）／「團隊成員」可寫 team members、the people on this team 等 | diverge 是不及物動詞，表示「（意見）分歧」（例如 opinions often diverge 等）／「團隊成員」可寫，例如 team members、the people on this team 等 |
| c1-u07-l04-q16 | rubricZh | degrading 表示「有辱人格的、貶低人的」（例如 it is degrading to…、I find it degrading when…）／句子要說出你自己的看法 | degrading 表示「有辱人格的、貶低人的」（例如 it is degrading to…、I find it degrading when… 等）／句子要說出你自己的看法 |
| c1-u08-l01-q16 | rubricZh | ethical 表示「道德的、合乎倫理的」（例如 ethical rules、ethical standards）／「有」可寫 has、follows 等 | ethical 表示「道德的、合乎倫理的」（例如 ethical rules、ethical standards 等）／「有」可寫，例如 has、follows 等 |
| c1-u08-l01-q17 | rubricZh | elaborate 當形容詞表示「精心的、精緻複雜的」（例如 an elaborate dinner）／句子要說到你自己／時態配合內容（例如 cooked、made） | elaborate 當形容詞表示「精心的、精緻複雜的」（例如 an elaborate dinner 等）／句子要說到你自己／時態配合內容（例如 cooked、made 等） |
| c1-u08-l02-q16 | rubricZh | atmospheric 可表示「有氣氛的」（例如 very atmospheric）／「配樂」可寫 music、soundtrack 等 | atmospheric 可表示「有氣氛的」（例如 very atmospheric 等）／「配樂」可寫，例如 music、soundtrack 等 |
| c1-u08-l02-q17 | rubricZh | anthropology 是不可數名詞，表示「人類學」，前面不加冠詞（例如 study anthropology）／句子要說到你自己的興趣或看法 | anthropology 是不可數名詞，表示「人類學」，前面不加冠詞（例如 study anthropology 等）／句子要說到你自己的興趣或看法 |
| c1-u08-l03-q16 | rubricZh | 「背景資訊」可寫，例如 contextual information、contextual details 等／「這段文字」可寫 this passage、this paragraph、this text 等 | 「背景資訊」可寫，例如 contextual information、contextual details 等／「這段文字」可寫，例如 this passage、this paragraph、this text 等 |
| c1-u08-l03-q17 | rubricZh | methodical 表示「有條理的、有系統的」（例如 am methodical when…、be methodical about…）／句子要說到你自己 | methodical 表示「有條理的、有系統的」（例如 am methodical when…、be methodical about… 等）／句子要說到你自己 |
| c1-u08-l04-q16 | rubricZh | geologically 表示「在地質上」，可放在形容詞前或句首（例如 geologically similar、Geologically, …）／「地區」可寫 areas、regions 等 | geologically 表示「在地質上」，位置有彈性（例如 geologically similar、Geologically, … 等）／「地區」可寫，例如 areas、regions 等 |
| c1-u08-l04-q17 | rubricZh | mythological 是形容詞，表示「神話的」，放在名詞前（例如 a mythological creature）／句子要說到你自己的喜好或認識 | mythological 是形容詞，表示「神話的」（例如 a mythological creature、mythological stories 等）／句子要說到你自己的喜好或認識 |
| c1-u08-l05-q15 | rubricZh | the rudiments of＋名詞或動名詞表示「⋯的基礎」（例如 the rudiments of playing the piano）／「只懂」可寫 only know、know just 等 | the rudiments of＋名詞或動名詞表示「⋯的基礎」（例如 the rudiments of playing the piano 等）／「只懂」可寫，例如 only know、know just 等 |
| c1-u08-l05-q16 | rubricZh | interjection 在這裡表示「插話」（例如 my quick interjection、made a short interjection）／句子要說到你自己的經驗／時態配合內容（例如 changed、made） | interjection 在這裡表示「插話」（例如 my quick interjection、made a short interjection 等）／句子要說到你自己的經驗／時態配合內容（例如 changed、made 等） |
| c1-u09-l01-q17 | rubricZh | maternal 表示「母系的、母親那邊的」（例如 my maternal relatives、on my maternal side）／「親戚」可寫 relatives、family members 等／「都」可寫，例如 all（放主詞前或動詞前皆可）、every one of 等 | maternal 表示「母系的、母親那邊的」（例如 my maternal relatives、on my maternal side 等）／「親戚」可寫，例如 relatives、family members 等／「都」可寫，例如 all（放主詞前或動詞前皆可）、every one of 等 |
| c1-u09-l01-q18 | rubricZh | be of＋形容詞＋descent 表示「有⋯血統」（例如 of Japanese descent）／句子要說到你自己或你的家族 | be of＋形容詞＋descent 表示「有⋯血統」（例如 of Japanese descent 等）／句子要說到你自己或你的家族 |
| c1-u09-l02-q16 | rubricZh | paternal 表示「父親般的」（例如 a paternal attitude、in a paternal way）／「照顧大家」可用 caring 等表達／「員工」可寫 staff、employees 等 | paternal 表示「父親般的」（例如 a paternal attitude、in a paternal way 等）／「照顧大家」可寫，例如 caring、looks after everyone 等／「員工」可寫，例如 staff、employees 等 |
| c1-u09-l02-q17 | rubricZh | rapport 表示「融洽的關係」（例如 built a good rapport with…、have a rapport with…）／句子要說到你自己和某個人的關係 | rapport 表示「融洽的關係」（例如 built a good rapport with…、have a rapport with… 等）／句子要說到你自己和某個人的關係 |
| c1-u10-l01-q16 | rubricZh | naive 表示「天真的」（例如 It is naive to…、is too naive）／「每一句話」可寫 everything、every word 等 | naive 表示「天真的」（例如 It is naive to…、is too naive 等）／「每一句話」可寫，例如 everything、every word 等 |
| c1-u10-l01-q17 | rubricZh | complimentary 可表示「免費贈送的」或「讚美的」（例如 a complimentary breakfast）／句子要說到你自己的經驗／時態配合內容（例如 gave、made） | complimentary 可表示「免費贈送的」或「讚美的」（例如 a complimentary breakfast 等）／句子要說到你自己的經驗／時態配合內容（例如 gave、made 等） |
| c1-u10-l02-q16 | rubricZh | benign 表示「和善的、溫和的」（例如 a benign smile）／「帶著」可寫 had…on her face、There was… 等 | benign 表示「和善的、溫和的」（例如 a benign smile 等）／「帶著」可寫，例如 had…on her face、There was… 等 |
| c1-u10-l02-q17 | rubricZh | spontaneous 表示「臨時起意的、自發的」（例如 a spontaneous decision、a spontaneous trip）／句子要說到你自己的經驗／時態配合內容（例如 made、took） | spontaneous 表示「臨時起意的、自發的」（例如 a spontaneous decision、a spontaneous trip 等）／句子要說到你自己的經驗／時態配合內容（例如 made、took 等） |
| c1-u10-l03-q16 | rubricZh | wicked 表示「邪惡的」，放在名詞前（例如 the wicked queen）／「把⋯變成」可寫 turn…into、change…into 等 | wicked 表示「邪惡的」（例如 the wicked queen、was wicked 等）／「把⋯變成」可寫，例如 turn…into、change…into 等 |
| c1-u10-l03-q17 | rubricZh | crave 是及物動詞，表示「渴望」（例如 crave something sweet）／句子要說到你自己 | crave 是及物動詞，表示「渴望」（例如 crave something sweet 等）／句子要說到你自己 |
| c1-u10-l04-q16 | rubricZh | temperament 表示「性情、脾氣」（例如 a gentle temperament）／「溫和」可寫 gentle、calm、mild 等 | temperament 表示「性情、脾氣」（例如 a gentle temperament 等）／「溫和」可寫，例如 gentle、calm、mild 等 |
| c1-u10-l04-q17 | rubricZh | sentimental 表示「念舊的、感傷的」（例如 for sentimental reasons、am sentimental about…）／句子要說到你自己保留的東西 | sentimental 表示「念舊的、感傷的」（例如 for sentimental reasons、am sentimental about… 等）／句子要說到你自己保留的東西 |
| c1-u10-l05-q16 | rubricZh | candid 表示「坦白的」，例如 To be candid, …、I'll be candid with you: … 等，放句首或句中皆可／「不太喜歡」可寫 don't really like、am not a big fan of 等 | candid 表示「坦白的」，例如 To be candid, …、I'll be candid with you: … 等，放句首或句中皆可／「不太喜歡」可寫，例如 don't really like、am not a big fan of 等 |
| c1-u10-l05-q17 | rubricZh | avid 表示「熱衷的」，常放在表示人的名詞前（例如 an avid fan、an avid reader）／句子要說到你自己的嗜好 | avid 表示「熱衷的」，用法例如 an avid fan、an avid reader 等／句子要說到你自己的嗜好 |
| c1-u10-l06-q16 | rubricZh | be／feel flattered 表示「受寵若驚、感到榮幸」（例如 I am flattered that…、feel flattered by…）／「唱得很好」可寫 sing well、my singing 等 | be／feel flattered 表示「受寵若驚、感到榮幸」（例如 I am flattered that…、feel flattered by… 等）／「唱得很好」可寫，例如 sing well、my singing 等 |
| c1-u10-l06-q17 | rubricZh | individuality 表示「個性、個人特色」（例如 show my individuality、express my individuality）／句子要說到你自己 | individuality 表示「個性、個人特色」（例如 show my individuality、express my individuality 等）／句子要說到你自己 |
| c1-u10-l07-q16 | rubricZh | timid 表示「膽小的」（例如 is very timid）／「看起來很兇」可寫 looks fierce、looks scary 等／「其實」可寫 actually、really 等 | timid 表示「膽小的」（例如 is very timid 等）／「看起來很兇」可寫，例如 looks fierce、looks scary 等／「其實」可寫，例如 actually、really 等 |
| c1-u10-l07-q17 | rubricZh | fanatic 當名詞表示「狂熱者、⋯迷」，常寫成「名詞＋fanatic」（例如 a coffee fanatic）／句子要說到你自己或你認識的人 | fanatic 當名詞表示「狂熱者、⋯迷」，常寫成「名詞＋fanatic」（例如 a coffee fanatic 等）／句子要說到你自己或你認識的人 |
| c1-u10-l08-q16 | rubricZh | scorn 當名詞表示「不屑、輕蔑」（例如 treat…with scorn、show scorn for…）／也可用動詞 scorn（例如 He scorns other people's criticism.） | scorn 當名詞表示「不屑、輕蔑」（例如 treat…with scorn、show scorn for… 等）／也可寫動詞 scorn，例如 He scorns other people's criticism. 等 |
| c1-u10-l08-q17 | rubricZh | conscientious 表示「認真負責的」（例如 am conscientious about…、a conscientious student）／句子要說到你自己 | conscientious 表示「認真負責的」（例如 am conscientious about…、a conscientious student 等）／句子要說到你自己 |
| c1-u10-l09-q16 | rubricZh | toughness 表示「堅韌、韌性」（例如 his toughness）／「撐過」可寫 get through、survive 等／「最艱難的」可寫 the hardest、the most difficult 等 | toughness 表示「堅韌、韌性」（例如 his toughness 等）／「撐過」可寫，例如 get through、survive 等／「最艱難的」可寫，例如 the hardest、the most difficult 等 |
| c1-u10-l09-q17 | rubricZh | quirk 表示「怪癖」（例如 one of my quirks、a strange quirk）／句子要說到你自己 | quirk 表示「怪癖」（例如 one of my quirks、a strange quirk 等）／句子要說到你自己 |
| c1-u10-l10-q16 | rubricZh | sarcastic 表示「諷刺的、挖苦的」（例如 is often sarcastic、in a sarcastic way）／「常常」可寫 often、usually 等 | sarcastic 表示「諷刺的、挖苦的」（例如 is often sarcastic、in a sarcastic way 等）／「常常」可寫，例如 often、usually 等 |
| c1-u10-l10-q17 | rubricZh | tranquil 表示「寧靜的」，可放在名詞前或 be、find…後（例如 a tranquil place、find…tranquil）／句子要說到你自己 | tranquil 表示「寧靜的」，位置有彈性（例如 a tranquil place、find…tranquil 等）／句子要說到你自己 |

## 五、最終複審修正（c1b2-final，基準 f5abe76）

依最終複審 11 條 FIX 的具體改法全修，另照提醒 4（中譯兩處）、提醒 5（第 1 批評分要點兩處）順手修正。u11-l02 漏改的原因：評分要點已寫進 spec，但這課沒有其他修正，題目檔沒有重寫；已全面比對 spec 與題目檔，只有這一課。

### 改到選項、題幹、音檔或短文的題 id（請安排重新盲答）
- 選項有變動（3 題位）：c1-u20-l03-q10、c1-u25-l01-q11、c1-u35-l01-q11
- 題幹、音檔或題目有變動（2 題）：c1-u20-l03-q10（audioEn、questionZh）、c1-u22-l03-q14（stemEn）

### 逐欄改動（27 欄）

| 題 id | 欄位 | 改前 | 改後 |
|---|---|---|---|
| c1-u02-l02-q15 | rubricZh | 「可以追溯到」可寫 date back to、date from 等（例如 dates back to antiquity 等）／antiquity 指「古代」，前面通常不加冠詞 | 「可以追溯到」可寫，例如 date back to、date from、dates back to antiquity 等／antiquity 指「古代」，前面通常不加冠詞 |
| c1-u03-l03-q17 | rubricZh | rotate 表示「輪流（做）」，後面可接要輪流的工作（例如 rotate the cleaning 等）／句子要說到你自己（例如主詞含 I 或 we） | rotate 表示「輪流（做）」，後面可接要輪流的工作（例如 rotate the cleaning 等）／句子要說到你自己（例如主詞含 I 或 we 等） |
| c1-u11-l02-q15 | rubricZh | bearded 表示「留鬍子的」，可放在 be 動詞後或名詞前（例如 is tall and bearded、a tall, bearded teacher）／「個子很高」可寫 tall 等 | bearded 表示「留鬍子的」，位置有彈性（例如 is tall and bearded、a tall, bearded teacher 等）／「個子很高」可寫，例如 tall、very tall 等 |
| c1-u11-l02-q16 | rubricZh | bouquet 表示「花束」，常用 a bouquet of＋花名（例如 a bouquet of roses）／句子要說到你自己的經驗／時態配合內容（例如 gave、received） | bouquet 表示「花束」，用法例如 a bouquet of roses、a bouquet of flowers 等／句子要說到你自己的經驗／時態配合內容（例如 gave、received 等） |
| c1-u12-l01-q06 | exampleEn | My job is quite sedentary, so I sit for most of the day. | Reading and watching TV are sedentary hobbies. |
| c1-u12-l01-q06 | exampleZh | 我的工作很少走動，一天大部分時間都坐著。 | 閱讀和看電視都是很少活動身體的嗜好。 |
| c1-u17-l02-q10 | sentenceZh | 我鄰居在他房間的魚缸裡養熱帶魚。 | 我鄰居在他臥室的魚缸裡養熱帶魚。 |
| c1-u20-l01-q10 | sentenceEn | The singer spoke openly about the online harassment she faced. | Many online games now let players report harassment from other players. |
| c1-u20-l01-q10 | sentenceZh | 那位歌手公開談論她在網路上遭受的騷擾。 | 現在很多線上遊戲都讓玩家檢舉其他玩家的騷擾。 |
| c1-u20-l03-q04 | exampleEn | In the past, some people were persecuted for their beliefs. | For centuries, farmers persecuted wolves because they feared them. |
| c1-u20-l03-q04 | exampleZh | 過去，有些人因為自己的信念而遭受迫害。 | 好幾個世紀以來，農民因為害怕狼而迫害牠們。 |
| c1-u20-l03-q10 | audioEn | The prisoner was finally set free after twelve years in confinement. | For Tom, two weeks of confinement to bed with a broken leg felt like a year. |
| c1-u20-l03-q10 | audioZh | 那名囚犯被關了十二年，終於獲釋。 | 對 Tom 來說，因為腿骨折而臥床兩週，感覺像過了一年。 |
| c1-u20-l03-q10 | questionZh | 那名囚犯被關了多久？ | Tom 臥床多久？ |
| c1-u20-l03-q10 | options | For twelve years／For a whole month／For almost twenty years／For a week | For two weeks／For a whole year／For almost two months／For a day |
| c1-u22-l03-q14 | stemEn | The old farmer ____ his land to the town, and it is now a public park. | Earlier generations ____ us many beautiful old buildings. |
| c1-u22-l03-q14 | stemZh | 那位老農夫把土地遺贈給鎮上，現在那裡是一座公園。 | 前人留給我們許多美麗的老建築。 |
| c1-u25-l01-q11 | options | depiction／collaboration／portrayal／coverage | depiction／collaboration／portrayal／flashback |
| c1-u25-l01-q11 | optionGlossZh | 描寫／合作／詮釋／報導 | 描寫／合作／詮釋／倒敘 |
| c1-u29-l01-q16 | passageZh | 上個月，Ken 為團隊安排了一趟到挪威的出差。他準備了周詳的行程表，包了一艘小船去拜訪一家漁業公司，還訂了一間有三溫暖的飯店。旅程一開始很不順：他們的行李在運送途中延誤了，等候時，機場外一長排計程車不停按喇叭。不過，拜訪本身很順利。最後一天，一位知名的登山家演講談團隊合作，團隊也看到一架無人駕駛的飛機拍攝海岸。之後，Ken 在付款前仔細核對了飯店的帳單。 | 上個月，Ken 為團隊安排了一趟到挪威的出差。他準備了周詳的行程表，包了一艘小船去拜訪一家漁業公司，還訂了一間有三溫暖的飯店。旅程一開始很不順：他們的行李在運送途中延誤了，等候時，機場外一長排計程車不停按喇叭。不過，拜訪本身很順利。最後一天，一位知名的登山家演講談團隊合作，團隊也看到一架無人駕駛的飛機拍攝海岸。之後，Ken 在付款前核對了飯店的帳單。 |
| c1-u31-l01-q15 | promptZh | 她的哥哥是一位精神科醫師。 | 那位精神科醫師寫了一本給青少年看的小說。 |
| c1-u31-l01-q15 | referenceEn | Her older brother is a psychiatrist.／Her older brother became a psychiatrist. | The psychiatrist wrote a novel for teenagers.／A psychiatrist wrote this novel for teenagers. |
| c1-u31-l01-q15 | rubricZh | psychiatrist 是可數名詞，表示「精神科醫師」（例如 see a psychiatrist、go to a psychiatrist 等）／「哥哥」可寫，例如 older brother、elder brother 等 | psychiatrist 是可數名詞，表示「精神科醫師」（例如 the psychiatrist、a psychiatrist 等）／「寫了一本小說」可寫，例如 wrote a novel、has written a novel 等／「給青少年看的」可寫，例如 for teenagers、for young people 等 |
| c1-u33-l01-q05 | exampleEn | The supplier's problems caused a suspension of deliveries to the factory. | The company announced a one-month suspension of sales of its new phone. |
| c1-u33-l01-q05 | exampleZh | 供應商出了問題，導致送往工廠的貨暫停了。 | 那家公司公告新手機暫停銷售一個月。 |
| c1-u35-l01-q11 | options | premise／exploitation／credential／renown | premise／pioneer／credential／subordinate |
| c1-u35-l01-q11 | optionGlossZh | 前提／開發、利用／資格證明／名聲 | 前提／先驅／資格證明／部屬 |
