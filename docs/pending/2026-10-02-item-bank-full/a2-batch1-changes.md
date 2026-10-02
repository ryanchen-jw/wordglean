# A2 第 1 批（a2-u01～u07）第②③關修正對照表

> 依 `t9/a2b1-rulings.md`（2026-10-02）。做法：先寫第②關判題（judgedBy claude-reviewer），再修第②關 42 條、第③關 FIX 34 條、新規則（每課至少一題 mcq 四選項同詞性）與選定的疑似項；每處修改都記在該課 `judge.resolvedAfterFinalReview`（message 以「執行長第②③關裁示修正：」開頭，resolution 記改後與原文）。修正後 `check-items --require-judge` 對本批 46 課全綠、`npm test` 148 項全過。
> 正解索引全部未變；正解文字有變的只有內容改寫的 7 題（u01-l04-q13 改測 certainly、u04-l01-q10、u04-l06-q10、u05-l03-q15#1、u06-l02-q15#1、u06-l05-q10、u06-l07-q15#1），皆隨題目內容同步改寫。替換干擾項或改寫題幹的選擇題未再送盲審，判題沿用原判（正解索引不變）。

## 統計

- 寫入判題：46 課。雙答案 a2-u04-l08-q13 照實寫入 [2,0]，干擾項 admit 換成 remember，判題更新為 [2] 並記錄。
- 第②關 42 條：40 條照建議或等效改法修；2 條判定不改並記入 resolved（見下表「不改項目」前兩列）。
- 第③關 FIX 34 條：全修。
- 新規則 mcq 同詞性：46 課每課至少一題 mcq 的四個選項同詞性、都能填入空格。被點名的 9 題中 8 題已改；a2-u05-l05-q13（aged）見不改項目。
- 自查（雷同稽核）另改 3 處（u01-l08 round、u01-l09 been、u05-l02 male）。

## 不改項目與理由

| 題 id | 來源 | 理由 |
|---|---|---|
| a2-u04-l02-q03 | 第②關疑似：lead 應教動詞「帶領」 | CEFR-J A2 的 lead 是名詞（動詞 B1），依「詞義以 CEFR-J 該級詞性＋單元主題常用義為準」照課綱教名詞「領先」 |
| a2-u07-l02-q01 | 第②關：suit 釋義只寫「西裝；套裝」 | 本課聽打（That blue dress really suits you.）與 mcq 都用動詞「適合」，依「釋義要涵蓋本課題目用到的詞義，必要時兩義並列」保留兩義 |
| a2-u05-l05-q13 | 第③關系統性疑似：只靠詞性可選 | aged 後面只能接年齡數字，找不到能填入的同詞性干擾項；本課另一題 mcq（q14 orphans）四選項皆名詞，符合「每課至少一題」 |
| a2-u01-l04-q08／q15 | 第③關疑似：upon 單字卡與閱讀都用 once upon a time | upon 在 A2 實際只以這個固定片語出現；q13 原本用 upon 當干擾項的題目已因新規則改寫，不再有「在⋯之上」的不一致 |
| a2-u01-l06-q12 | 第③關疑似：anyway 句型與單字卡相同 | anyway 另有閱讀情境；跟讀句情境不同（上班 vs 購物），保留 |
| a2-u04-l02-q10 | 第③關疑似：include 半雷同 | 情境不同（票含午餐、不含飲料 vs 房價含早餐），題目考的是「不包含」的聽辨，保留 |
| a2-u04-l07-q11 | 第③關疑似：manage to 句型相同 | manage to 是本字的核心句型，情境不同（準時完成工作 vs 找到座位），保留 |
| a2-u05-l02-q01／q16 | 第③關疑似：senior 只在職場情境 | CEFR-J A2 senior 形容詞「資深的；年長的」，資深職稱是最常見用法；本課 elderly 已練「年長的」 |
| a2-u05-l03-q07 | 第③關疑似：lover 教「愛好者」 | 中性、成人學習者常用（music lover），維持 |
| a2-u06-l02-q01 | 第③關疑似：dislike 只教名詞 | CEFR-J A2 為名詞（動詞 B1），照課綱 |
| a2-u06-l04-q12 | 第③關疑似：honor 句型相近 | It's an honor 是 A2 名詞最常見用法，情境不同（見面 vs 獲得機會），保留 |
| a2-u07-l03 | 第③關疑似：overweight 只教行李超重 | 避開身材評論；行李超重是中性且常用的情境 |

## 改動對照表（題 id｜欄位｜原因｜改後與原文）

| 題 id | 欄位 | 原因 | 改後（原文） |
|---|---|---|---|
| a2-u01-l01-q14 | options | 新規則：mcq 四選項同詞性（介系詞），只能靠詞義判斷 | 改為 ["without","against","during","across"]（原 ["without","against","during","such"]） |
| a2-u01-l01-q14 | optionGlossZh | 選項釋義同步 | 改為 ["沒有","與⋯對抗","在⋯期間","越過"]（原 ["沒有","與⋯對抗","在⋯期間","如此的"]） |
| a2-u01-l02-q14 | options | 新規則：mcq 四選項同詞性（連接副詞），只能靠詞義判斷 | 改為 ["Therefore","Instead","Besides","However"]（原 ["Ever","Within","Among","However"]） |
| a2-u01-l02-q14 | optionGlossZh | 選項釋義同步 | 改為 ["因此","反而","此外","然而"]（原 ["曾經","在⋯之內","在⋯之中","然而"]） |
| a2-u01-l02-q16 | referenceEn/0 | 第②關："He lives far from his company." 中 company 指「公司（組織）」，far from his company 讀起來像離他自己開的公司很遠；表達通勤距離較自然是 far from his office／far from work。建議第一句改 office 或 work。 | 改為 "He lives far from work."（原 "He lives far from his company."） |
| a2-u01-l03-q13 | options | 新規則：mcq 四選項同詞性（介系詞），只能靠詞義判斷 | 改為 ["during","since","till","toward"]（原 ["although","perhaps","themselves","toward"]） |
| a2-u01-l03-q13 | optionGlossZh | 選項釋義同步 | 改為 ["在⋯期間","自從","直到","朝著"]（原 ["雖然","也許","他們自己","朝著"]） |
| a2-u01-l03-q15 | passageEn | 第②關：疑似：末句 "Actually, the food was very good!" 前文沒有鋪陳「原本以為自己煮會不好吃」的預期，actually 缺少對比對象，邏輯承接偏弱；可補一句如 "They thought it would not be very good." 或改 "And the food was very good!"。 | 改為 "Lisa and Kevin wanted to try the new restaurant across the river. Although it was raining, they walked there. When they arrived, the restaurant was full. \"Perhaps we can come back tomorrow,\" said Lisa. \"Yeah, but it will probably be full again,\" said Kevin. In the end, they went home and cooked dinner themselves. They thought it would not be very good, but actually it was great!"（原 "Lisa and Kevin wanted to try the new restaurant across the river. Although it was raining, they walked there. When they arrived, the restaurant was full. \"Perhaps we can come back tomorrow,\" said Lisa. \"Yeah, but it will probably be full again,\" said Kevin. In the end, they went home and cooked dinner themselves. Actually, the food was very good!"） |
| a2-u01-l03-q15 | passageZh | 中譯同步（actually 補上對比對象） | 改為 "Lisa 和 Kevin 想去河對岸那家新開的餐廳吃吃看。雖然在下雨，他們還是走路過去。到了以後，餐廳已經客滿了。Lisa 說：「也許我們明天可以再來。」Kevin 說：「對啊，不過明天大概又會客滿。」最後他們回家自己煮晚餐。他們原本以為不會太好吃，沒想到其實非常好吃！"（原 "Lisa 和 Kevin 想去河對岸那家新開的餐廳吃吃看。雖然在下雨，他們還是走路過去。到了以後，餐廳已經客滿了。Lisa 說：「也許我們明天可以再來。」Kevin 說：「對啊，不過明天大概又會客滿。」最後他們回家自己煮晚餐。其實，那頓飯很好吃！"） |
| a2-u01-l04-q13 | stemEn | 新規則：mcq 四選項同詞性（副詞），改測 certainly | 改為 "Can I borrow your pen? — ____! Here you are."（原 "I like all sports, ____ tennis."） |
| a2-u01-l04-q13 | stemZh | 題幹中譯同步 | 改為 "我可以借你的筆嗎？——當然！拿去吧。"（原 "我喜歡所有的運動，尤其是網球。"） |
| a2-u01-l04-q13 | options | 選項換成四個副詞 | 改為 ["Hardly","Certainly","Simply","Especially"]（原 ["itself","especially","upon","myself"]） |
| a2-u01-l04-q13 | optionGlossZh | 選項釋義同步 | 改為 ["幾乎不","當然；確實","只是","尤其"]（原 ["它自己","尤其","在⋯之上","我自己"]） |
| a2-u01-l04-q15 | passageZh | 第②關：疑似：寓言中的小鳥中譯用「她」「妳」，撰寫規則要求動物用「牠」；若刻意擬人化可保留，但需確認是否接受此例外（英文 she 也可，但中譯建議「牠」）。 | 改為 "從前從前，有一隻小鳥住在一棵高高的樹上。有一天，牠想看看山的另一邊有什麼。牠的朋友說：「那裡相當遠，你一定會累。」可是小鳥只說：「我想親眼看看。」牠飛了三天。在山的另一邊，牠發現了一座美麗的湖。牠很累，但是非常開心。"（原 "從前從前，有一隻小鳥住在一棵高高的樹上。有一天，她想看看山的另一邊有什麼。她的朋友說：「那裡相當遠，妳一定會累。」可是小鳥只說：「我想親眼看看。」她飛了三天。在山的另一邊，她發現了一座美麗的湖。她很累，但是非常開心。"）；動物一律用「牠」（執行長裁示） |
| a2-u01-l04-q09 | sentenceEn | 第③關疑似：聽打句與單字卡例句同句型（I love X, especially Y），換情境 | 改為 "Drive slowly, especially at night."（原 "I love summer, especially the long holidays."） |
| a2-u01-l04-q09 | sentenceZh | 中譯同步 | 改為 "開車要慢，尤其是晚上。"（原 "我很喜歡夏天，尤其是長長的假期。"） |
| a2-u01-l05-q13 | options | 新規則：mcq 四選項同詞性（副詞），只能靠詞義判斷 | 改為 ["forward","ahead","apart","instead"]（原 ["forward","herself","whatever","instead"]） |
| a2-u01-l05-q13 | optionGlossZh | 選項釋義同步 | 改為 ["向前","在前面","分開","作為替代"]（原 ["向前","她自己","無論什麼","作為替代"]） |
| a2-u01-l06-q14 | options | 新規則：mcq 四選項同詞性（副詞），只能靠詞義判斷 | 改為 ["However","Instead","Therefore","Mostly"]（原 ["Whom","Mostly","Therefore","Ahead"]） |
| a2-u01-l06-q14 | optionGlossZh | 選項釋義同步 | 改為 ["然而","反而","因此","大多"]（原 ["誰（受詞）","大多","因此","在前面"]） |
| a2-u01-l07-q13 | options | 新規則：mcq 四選項同詞性（副詞），只能靠詞義判斷 | 改為 ["easily","hardly","quickly","truly"]（原 ["anymore","hardly","anywhere","ourselves"]） |
| a2-u01-l07-q13 | optionGlossZh | 選項釋義同步 | 改為 ["輕易地","幾乎不","很快地","真正地"]（原 ["不再","幾乎不","任何地方","我們自己"]） |
| a2-u01-l07-q17 | referenceEn/1 | 第②關：題目要「說說某一類東西你都喜歡，只有一樣例外」，此範文 "I eat all kinds of fruit except bananas." 講的是「吃」不是「喜歡」，與題目要求不完全相符；建議改 "I like all kinds of fruit except bananas."。 | 改為 "I like all kinds of fruit except bananas."（原 "I eat all kinds of fruit except bananas."） |
| a2-u01-l08-q13 | options | 新規則：mcq 四選項同詞性（副詞），只能靠詞義判斷 | 改為 ["inside","apart","elsewhere","forward"]（原 ["mainly","latter","elsewhere","till"]） |
| a2-u01-l08-q13 | optionGlossZh | 選項釋義同步 | 改為 ["在裡面","分開","到別處","向前"]（原 ["主要地","後者","到別處","直到"]） |
| a2-u01-l08-q11 | sentenceEn | 第③關 FIX：round 唯一情境句與單字卡例句雷同 | 改為 "When I called her name, she looked round."（原 "He turned round and looked at me."） |
| a2-u01-l08-q11 | sentenceZh | 中譯同步 | 改為 "我叫她名字的時候，她回過頭來。"（原 "他轉過身來看著我。"） |
| a2-u01-l08-q04 | exampleEn | 自查：round 單字卡例句與修正後的跟讀句仍相近，改單字卡例句 | 改為 "Please turn round so I can see your back."（原 "He turned round when I called his name."） |
| a2-u01-l08-q04 | exampleZh | 中譯同步 | 改為 "請轉過身來，讓我看看你的背。"（原 "我叫他名字的時候，他轉過身來。"） |
| a2-u01-l09-q14 | stemEn | 新規則：mcq 四選項同詞性（介系詞），改題幹 | 改為 "Please get ____ the car. We're here."（原 "The cat jumped ____ the window."） |
| a2-u01-l09-q14 | stemZh | 題幹中譯同步 | 改為 "請下車，我們到了。"（原 "貓從窗戶跳了出去。"） |
| a2-u01-l09-q14 | options | 選項換成四個介系詞片語 | 改為 ["next to","out of","in front of","because of"]（原 ["alright","out of","been","no one"]） |
| a2-u01-l09-q14 | optionGlossZh | 選項釋義同步 | 改為 ["在⋯旁邊","從⋯裡面出來","在⋯前面","因為"]（原 ["沒問題的","從⋯裡面出來","去過","沒有人"]） |
| a2-u01-l09-q04 | glossZh | 第③關 FIX：been 釋義要涵蓋本課閱讀用到的 have been＋名詞（一直是） | 改為 "（have been to）去過；一直是"（原 "（have been to）去過"） |
| a2-u01-l09-q13 | optionGlossZh/3 | 選項釋義同步 | 改為 "去過；一直是"（原 "去過"） |
| a2-u01-l09-q12 | sentenceEn | 第③關 FIX：補一題練到 been「去過」的情境句（alright 另有閱讀情境） | 改為 "Have you ever been to Tainan?"（原 "Don't worry. Everything will be alright."） |
| a2-u01-l09-q12 | sentenceZh | 中譯同步 | 改為 "你去過台南嗎？"（原 "別擔心，一切都會沒事的。"） |
| a2-u01-l09-q12 | sentenceEn | 自查：跟讀句與單字卡例句同地點（台南），換情境 | 改為 "Have you ever been to a night market?"（原 "Have you ever been to Tainan?"） |
| a2-u01-l09-q12 | sentenceZh | 中譯同步 | 改為 "你去過夜市嗎？"（原 "你去過台南嗎？"） |
| a2-u02-l01-q13 | options | 新規則：mcq 四選項同詞性（名詞），只能靠詞義判斷 | 改為 ["midnight","night","noon","breakfast"]（原 ["someday","calendar","noon","finally"]） |
| a2-u02-l01-q13 | optionGlossZh | 選項釋義同步 | 改為 ["午夜","晚上","中午","早餐"]（原 ["總有一天","日曆","中午","終於"]） |
| a2-u02-l01-q04 | exampleZh | 第②關：「廚房牆上掛著一份大日曆」量詞不自然，台灣說「一本大日曆」或「一個大月曆」。 | 改為 "廚房牆上掛著一本大日曆。"（原 "廚房牆上掛著一份大日曆。"） |
| a2-u02-l01-q15 | passageZh | 第②關："She always checks the timetable first." 譯成「出門前一定先查時刻表」，多加了原文沒有的「出門前」；建議「她總是會先查時刻表」。 | 改為 "Nina 從星期一到星期五在辦公室上班。平日她七點起床、八點搭火車，也總是會先查時刻表。午餐時間，她和朋友在公司附近吃飯。上週五她因為工作很多，一直工作到午夜，終於在凌晨一點才到家。她說：「總有一天我要放個長假。」"（原 "Nina 從星期一到星期五在辦公室上班。平日她七點起床、八點搭火車，出門前一定先查時刻表。午餐時間，她和朋友在公司附近吃飯。上週五她因為工作很多，一直工作到午夜，終於在凌晨一點才到家。她說：「總有一天我要放個長假。」"） |
| a2-u02-l01-q16 | rubricZh/0 | 第③關疑似：要點前後矛盾，改成「例如」並列 | 改為 "「寫在行事曆上」可寫例如 on my calendar、in my calendar"（原 "「寫在行事曆上」用 on（例如 on my calendar、in my calendar 也可以）"） |
| a2-u02-l02-q12 | stemEn | 新規則：mcq 四選項同詞性（時間名詞），題幹加年份讓答案唯一 | 改為 "This bridge was built in 1930, so it is almost a ____ old."（原 "This bridge is more than a ____ old."） |
| a2-u02-l02-q12 | stemZh | 題幹中譯同步 | 改為 "這座橋建於 1930 年，所以已經快一百年了。"（原 "這座橋已經有一百多年的歷史了。"） |
| a2-u02-l02-q12 | options | 選項換成四個時間名詞 | 改為 ["year","month","week","century"]（原 ["final","beginning","third","century"]） |
| a2-u02-l02-q12 | optionGlossZh | 選項釋義同步 | 改為 ["年","月","星期","世紀"]（原 ["最後的","開始","第三的","世紀"]） |
| a2-u02-l02-q14 | passageEn | 第②關：疑似："a small farm house" 標準拼法為一個字 farmhouse；若 farmhouse 不在可用字表，可改 "a small house on a farm"。 | 改為 "My grandparents' house is almost a century old. At the beginning, it was just a small house on a farm. My grandfather was the third child in his family, and he has lived there all his life. Recently, my parents painted the whole house for him. We make regular visits to the house, and I always enjoy them."（原 "My grandparents' house is almost a century old. At the beginning, it was just a small farm house. My grandfather was the third child in his family, and he has lived there all his life. Recently, my parents painted the whole house for him. We make regular visits to the house, and I always enjoy them."） |
| a2-u02-l02-q14 | passageEn | 第②關：探望的對象應是人不是房子 | 改為 "My grandparents' house is almost a century old. At the beginning, it was just a small house on a farm. My grandfather was the third child in his family, and he has lived there all his life. Recently, my parents painted the whole house for him. We pay them regular visits, and I always enjoy seeing them."（原 "My grandparents' house is almost a century old. At the beginning, it was just a small house on a farm. My grandfather was the third child in his family, and he has lived there all his life. Recently, my parents painted the whole house for him. We make regular visits to the house, and I always enjoy them."） |
| a2-u02-l02-q14 | passageZh | 第②關：「我們定期去那棟房子探望」不通順——「探望」的對象是人不是房子；英文 "We make regular visits to the house" 也偏生硬。建議英文改 "We visit them there regularly"／中譯「我們定期去那裡探望他們」。 | 改為 "我爺爺奶奶的房子快一百年了。一開始，它只是一間小小的農舍。爺爺是家裡的第三個孩子，他一輩子都住在那裡。最近，我爸媽幫他把整棟房子重新油漆了一遍。我們定期去探望他們，每次見到他們我都很開心。"（原 "我爺爺奶奶的房子快一百年了。一開始，它只是一間小小的農舍。爺爺是家裡的第三個孩子，他一輩子都住在那裡。最近，我爸媽幫他把整棟房子重新油漆了一遍。我們定期去那棟房子探望，我每次都很開心。"） |
| a2-u02-l02-q14 | passageZh | 中譯同步（farm house 改寫） | 改為 "我爺爺奶奶的房子快一百年了。一開始，它只是農場上的一間小房子。爺爺是家裡的第三個孩子，他一輩子都住在那裡。最近，我爸媽幫他把整棟房子重新油漆了一遍。我們定期去探望他們，每次見到他們我都很開心。"（原 "我爺爺奶奶的房子快一百年了。一開始，它只是一間小小的農舍。爺爺是家裡的第三個孩子，他一輩子都住在那裡。最近，我爸媽幫他把整棟房子重新油漆了一遍。我們定期去探望他們，每次見到他們我都很開心。"） |
| a2-u02-l02-q16 | rubricZh/0 | 第③關疑似：要點寫死位置 | 改為 "regular 表示「規律的、定期的」，可放在名詞前（例如 regular exercise）或 be 動詞後"（原 "regular 放在名詞前，表示「規律的、定期的」（例如 regular exercise、a regular time）"） |
| a2-u02-l03-q13 | options | 新規則：mcq 四選項同詞性（副詞），只能靠詞義判斷 | 改為 ["gradually","regularly","forever","finally"]（原 ["sudden","regularly","forever","delay"]） |
| a2-u02-l03-q13 | optionGlossZh | 選項釋義同步 | 改為 ["逐漸地","經常；定期地","永遠","終於"]（原 ["突然的","經常","永遠","延誤"]） |
| a2-u02-l03-q14 | passageEn | 第③關疑似：used to work 與後文走路上班時間線矛盾 | 改為 "Leo works in a busy office. His schedule is always full, and he often stays late. He had no time for exercise, so one day he had a sudden idea: he would walk to work. At first it was hard, but gradually he started to enjoy it. Now he walks daily, and he feels much better. \"I will do this forever,\" he says."（原 "Leo used to work in a busy office. His schedule was always full, and he often stayed late. He had no time for exercise. Then one day, he had a sudden idea: he would walk to work. At first it was hard, but gradually he started to enjoy it. Now he walks daily, and he feels much better. \"I will do this forever,\" he says."） |
| a2-u02-l03-q14 | passageZh | 中譯同步 | 改為 "Leo 在一間很忙的公司上班。他的行程總是排得滿滿的，也常常加班到很晚。他以前完全沒時間運動，所以有一天他突然想到一個主意：走路上班。一開始很辛苦，但他漸漸開始喜歡上走路。現在他每天都走路，覺得身體好多了。他說：「我要永遠這樣走下去。」"（原 "Leo 以前在一間很忙的公司上班。他的行程總是排得滿滿的，也常常加班到很晚，完全沒時間運動。後來有一天，他突然想到一個主意：走路上班。一開始很辛苦，但他漸漸開始喜歡上走路。現在他每天都走路，覺得身體好多了。他說：「我要永遠這樣走下去。」"） |
| a2-u02-l04-q13 | options | 新規則：mcq 四選項同詞性（副詞），只能靠詞義判斷 | 改為 ["Weekly","Forever","Nowadays","Finally"]（原 ["Instant","Weekly","Nowadays","Ending"]） |
| a2-u02-l04-q13 | optionGlossZh | 選項釋義同步 | 改為 ["每週","永遠","現今","終於"]（原 ["立即的","每週的","現今","結局"]） |
| a2-u02-l04-q15 | rubricZh/0 | 第②關：評分要點寫死「用 an instant success（寫 an instant hit 也正確）」，屬封閉清單；同樣正確的 "was instantly popular"、"became popular right away" 會被判錯。依已裁原則改成「例如 an instant success、an instant hit」並註明其他正確說法也收。 | 改為 "instant 放在名詞前表示「立刻的」（例如 an instant success；寫 an instant hit 等其他正確說法也收）"（原 "用 an instant success 表示「馬上大受歡迎」（寫 an instant hit 也正確）"） |
| a2-u02-l04-q15 | referenceEn/1 | 第③關 FIX：hit 當名詞「暢銷作品」為 B1，非目標字詞義越級 | 改為 "The movie became an instant success."（原 "That movie was an instant hit."） |
| a2-u02-l04-q14 | passageEn | 第②關：疑似："before the daylight is gone" 加定冠詞 the 不自然；較道地為 "before the daylight is gone" 去掉 the（before daylight is gone）或 "before it gets dark"。 | 改為 "Mia's family has a weekly picnic on Sundays. They leave home in the morning and eat lunch in the park at midday. They always go home before it gets dark. Last Sunday, it started to rain during lunch. Everyone ran to the car with the food. It was not a happy ending, but they laughed all the way home."（原 "Mia's family has a weekly picnic on Sundays. They leave home in the morning and eat lunch in the park at midday. They always go home before the daylight is gone. Last Sunday, it started to rain during lunch. Everyone ran to the car with the food. It was not a happy ending, but they laughed all the way home."） |
| a2-u02-l04-q11 | sentenceEn | 第③關 FIX：latest 情境句與單字卡例句雷同 | 改為 "This is her latest book, and I love it."（原 "Have you seen her latest movie?"） |
| a2-u02-l04-q11 | sentenceZh | 中譯同步 | 改為 "這是她最新的書，我很喜歡。"（原 "你看過她最新的電影了嗎？"） |
| a2-u03-l01-q14 | options | 新規則：mcq 四選項同詞性（形容詞），只能靠詞義判斷 | 改為 ["automatic","colorful","noisy","unnecessary"]（原 ["wool","automatic","colorful","unnecessary"]） |
| a2-u03-l01-q14 | optionGlossZh | 選項釋義同步 | 改為 ["自動的","色彩鮮豔的","吵鬧的","不必要的"]（原 ["羊毛","自動的","色彩鮮豔的","不必要的"]） |
| a2-u03-l01-q04 | exampleEn | 第②關：疑似：單字卡 convenience 的例句只出現在固定複合名詞 convenience store，學習者看不到 convenience「便利」本身的用法，與釋義「便利；方便」對不太上；可改如 "I like the convenience of living near a station."。 | 改為 "I like the convenience of living near a station."（原 "There is a convenience store on every corner."） |
| a2-u03-l01-q04 | exampleZh | 中譯同步 | 改為 "我很喜歡住在車站附近的便利。"（原 "每個街角都有一家便利商店。"） |
| a2-u03-l01-q06 | exampleEn | convenience 新例句與 convenient 原例句雷同，convenient 換句 | 改為 "This bag is small and convenient to carry."（原 "Living near a station is very convenient."） |
| a2-u03-l01-q06 | exampleZh | 中譯同步 | 改為 "這個包包小巧，帶著很方便。"（原 "住在車站附近非常方便。"） |
| a2-u03-l01-q16 | rubricZh/1 | 第③關疑似：要點寫死句型 | 改為 "用問句（例如 Is this time…?、Is this a convenient time…?）"（原 "問句把 be 動詞放句首（例如 Is this time…?、Is this a convenient time…?）"） |
| a2-u03-l02-q13 | options | 新規則：mcq 四選項同詞性（副詞），只能靠詞義判斷 | 改為 ["loudly","quietly","silently","smoothly"]（原 ["loudly","noisy","system","major"]） |
| a2-u03-l02-q13 | optionGlossZh | 選項釋義同步 | 改為 ["大聲地","小聲地","安靜地","順利地"]（原 ["大聲地","吵鬧的","系統","主要的"]） |
| a2-u03-l02-q16 | rubricZh/0 | 第②關：評分要點「「太吵」用 too noisy」寫死單一字詞，"It's too loud here." 同樣正確會被判錯；依已裁原則改成「例如 too noisy」。 | 改為 "「太吵」可寫例如 too noisy、too loud"（原 "「太吵」用 too noisy"） |
| a2-u03-l02-q08 | glossZh | 第③關 FIX：閱讀用到 model「機型」，釋義兩義並列 | 改為 "模型；（產品的）機型"（原 "模型"） |
| a2-u03-l02-q14 | optionGlossZh/0 | 選項釋義同步 | 改為 "模型；機型"（原 "模型"） |
| a2-u03-l03-q14 | options | 新規則：mcq 四選項同詞性（形容詞），只能靠詞義判斷 | 改為 ["common","private","single","clear"]（原 ["common","private","single","certain"]） |
| a2-u03-l03-q14 | optionGlossZh | 選項釋義同步 | 改為 ["常見的","私人的","單一的","清楚的"]（原 ["常見的","私人的","單一的","確定的"]） |
| a2-u03-l03-q15 | passageEn | 第②關："she takes a clear image of it" 搭配不自然，英文拍照說 take a (clear) photo／picture，image 不與 take 搭配；本課 image 宜另找句子示範（如 "posts a clear image of it online"）。 | 改為 "Helen wants to sell her old camera online. First, she takes a photo of it. The image is very clear, and she writes the details. The camera is made of a strong material, and it is likely to work for many more years. Soon, a man sends her a private message: \"Are you certain it works well?\" \"Yes,\" she writes. \"It has no problems at all.\""（原 "Helen wants to sell her old camera online. First, she takes a clear image of it and writes the details. The camera is made of a strong material, and it is likely to work for many more years. Soon, a man sends her a private message: \"Are you certain it works well?\" \"Yes,\" she writes. \"It has no problems at all.\""） |
| a2-u03-l03-q15 | passageZh | 中譯同步 | 改為 "Helen 想在網路上賣掉她的舊相機。她先幫它拍照，照片很清楚，再寫下詳細資料。這台相機是用堅固的材料做的，很可能還可以用很多年。很快地，有一位男士傳私人訊息給她：「妳確定它很好用嗎？」她回覆：「是的，它完全沒有問題。」"（原 "Helen 想在網路上賣掉她的舊相機。她先拍了一張清楚的照片，寫下詳細資料。這台相機是用堅固的材料做的，很可能還可以用很多年。很快地，有一位男士傳私人訊息給她：「妳確定它很好用嗎？」她回覆：「是的，它完全沒有問題。」"） |
| a2-u03-l03-q17 | referenceEn/1 | 第③關疑似：參考答案講的是活動不是東西，eat outside 有歧義 | 改為 "Night markets are very common in Taiwan."（原 "In Taiwan, it is common to eat breakfast outside."） |
| a2-u03-l04-q13 | stemEn | 第③關 FIX：water 當動詞「澆水」為 B2，改回名詞用法 | 改為 "Give the plants some water, or they will be ____."（原 "Water the plants, or they will be ____."） |
| a2-u03-l04-q15 | passageEn | 第③關 FIX：care about（動詞「在乎」B1）非目標字詞義越級 | 改為 "Last year, two cafes opened on my street. At first, they looked similar. Both were small, with simple tables and chairs. But there was a significant difference in quality. One cafe's coffee was clearly better, and it soon became popular. The other cafe was often empty, and now it is closed."（原 "Last year, two cafes opened on my street. At first, they looked similar. Both were small, with simple tables and chairs. But there was a significant difference: one cafe really cared about quality. Its coffee was clearly better, and it soon became popular. The other cafe was often empty, and now it is closed."） |
| a2-u03-l04-q15 | passageZh | 中譯同步 | 改為 "去年，我家這條街開了兩家咖啡店。一開始，它們看起來很像，都很小，擺著簡單的桌椅。但兩家的品質差很多：其中一家的咖啡明顯比較好喝，很快就受到歡迎。另一家常常沒有客人，現在已經關門了。"（原 "去年，我家這條街開了兩家咖啡店。一開始，它們看起來很像，都很小，擺著簡單的桌椅。但兩家有一個很大的差別：其中一家非常重視品質。它的咖啡明顯比較好喝，很快就受到歡迎。另一家常常沒有客人，現在已經關門了。"） |
| a2-u03-l05-q14 | options | 新規則：mcq 四選項同詞性（形容詞），只能靠詞義判斷 | 改為 ["specific","modern","private","necessary"]（原 ["stuff","specific","deep","necessary"]） |
| a2-u03-l05-q14 | optionGlossZh | 選項釋義同步 | 改為 ["明確的","現代的","私人的","必要的"]（原 ["東西","明確的","深入地","必要的"]） |
| a2-u03-l06-q13 | options | 新規則：mcq 四選項同詞性（形容詞），只能靠詞義判斷 | 改為 ["safe","fresh","dangerous","noisy"]（原 ["safe","fresh","complete","original"]） |
| a2-u03-l06-q13 | optionGlossZh | 選項釋義同步 | 改為 ["安全的","新鮮的","危險的","吵鬧的"]（原 ["安全的","新鮮的","完整的","原本的"]） |
| a2-u03-l06-q12 | sentenceZh | 第②關：疑似："Our team is now complete." 指團隊成員已補齊（缺的人找齊了），譯成「人都到齊了」偏向「人已經抵達」，意思有落差；建議「我們的團隊現在人員齊全了」。 | 改為 "我們的團隊現在人員齊全了。"（原 "我們的團隊現在人都到齊了。"） |
| a2-u03-l06-q15 | passageEn | 第②關："serve basic home food" 搭配不自然，英文說 home cooking 或 home-style food；建議 "serve simple home cooking made with fresh vegetables"（若字表限制，可改 "basic food like you eat at home"）。 | 改為 "Linda opened a small restaurant last year. Her original idea was simple: serve basic home cooking made with fresh vegetables. The restaurant has one special feature. The kitchen is open, so customers can easily watch the cooks at work. Everything is clean and safe. \"It's not perfect yet,\" Linda says, \"but I am very happy with it.\""（原 "Linda opened a small restaurant last year. Her original idea was simple: serve basic home food made with fresh vegetables. The restaurant has one special feature. The kitchen is open, so customers can easily watch the cooks at work. Everything is clean and safe. \"It's not perfect yet,\" Linda says, \"but I am very happy with it.\""） |
| a2-u03-l07-q14 | options | 新規則：mcq 四選項同詞性（形容詞），只能靠詞義判斷 | 改為 ["fit","soft","normal","slow"]（原 ["fit","wood","shape","slowly"]） |
| a2-u03-l07-q14 | optionGlossZh | 選項釋義同步 | 改為 ["健康的","柔軟的","正常的","慢的"]（原 ["健康的","木頭","形狀","慢慢地"]） |
| a2-u03-l07-q05 | exampleZh | 第②關："Can I ask you a quick question?" 譯成「我可以很快地問你一個問題嗎？」是直譯、不道地；台灣說法為「我可以問你一個小問題嗎？」或「可以簡單問你一下嗎？」。 | 改為 "可以簡單問你一個問題嗎？"（原 "我可以很快地問你一個問題嗎？"） |
| a2-u03-l07-q15 | passageEn | 第②關：疑似：末句 "It keeps my hands busy and my body fit." ——做木頭小玩具「又慢又仔細」、坐著上色，說能讓身體保持 fit 邏輯偏弱；可補一句他走路去市集，或改成 "my mind happy"。 | 改為 "Ben makes small toys out of wood. He works slowly and carefully. First, he cuts the wood into the right shape. Then he paints it in bright colors. At the market, children can play with a sample toy before their parents buy one. \"For me, this is a normal day,\" Ben says. \"It keeps my hands busy and my mind happy.\""（原 "Ben makes small toys out of wood. He works slowly and carefully. First, he cuts the wood into the right shape. Then he paints it in bright colors. At the market, children can play with a sample toy before their parents buy one. \"For me, this is a normal day,\" Ben says. \"It keeps my hands busy and my body fit.\""） |
| a2-u03-l07-q15 | passageZh | 中譯同步 | 改為 "Ben 用木頭做小玩具。他做得又慢又仔細。他先把木頭切成合適的形狀，再漆上鮮豔的顏色。在市集裡，孩子們可以先玩樣品玩具，爸媽再決定要不要買。Ben 說：「對我來說，這就是平常的一天。它讓我的手有事做，心情也很好。」"（原 "Ben 用木頭做小玩具。他做得又慢又仔細。他先把木頭切成合適的形狀，再漆上鮮豔的顏色。在市集裡，孩子們可以先玩樣品玩具，爸媽再決定要不要買。Ben 說：「對我來說，這就是平常的一天。它讓我的手有事做，身體也保持健康。」"） |
| a2-u03-l07-q12 | sentenceEn | 第③關疑似：soft 唯一情境句與單字卡例句同句型 | 改為 "She speaks in a soft voice."（原 "This sweater is warm and soft."） |
| a2-u03-l07-q12 | sentenceZh | 中譯同步 | 改為 "她說話的聲音很輕柔。"（原 "這件毛衣又暖又軟。"） |
| a2-u03-l08-q14 | options | 新規則：mcq 四選項同詞性（名詞），只能靠詞義判斷 | 改為 ["importance","danger","noise","shape"]（原 ["importance","danger","plastic","direct"]） |
| a2-u03-l08-q14 | optionGlossZh | 選項釋義同步 | 改為 ["重要性","危險","噪音","形狀"]（原 ["重要性","危險","塑膠的","直達的"]） |
| a2-u03-l08-q17 | rubricZh/0 | 第②關：評分要點寫「be familiar with＋地方」，把 with 後面限縮成地方；題目明說「人、地方或東西」，"I am familiar with this song." 也正確。建議改「be familiar with＋人／地方／東西」。 | 改為 "familiar 表示「熟悉的」，可寫例如 look familiar、sound familiar、be familiar with＋人／地方／東西"（原 "familiar 表示「熟悉的」，可寫例如 look familiar、sound familiar、be familiar with＋地方"） |
| a2-u03-l08-q12 | sentenceEn | 第③關疑似：appropriate 唯一情境句與單字卡例句同情境（衣服適不適合場合） | 改為 "That joke was not appropriate."（原 "Is this dress appropriate for a wedding?"） |
| a2-u03-l08-q12 | sentenceZh | 中譯同步 | 改為 "那個玩笑不太恰當。"（原 "這件洋裝適合穿去參加婚禮嗎？"） |
| a2-u04-l01-q13 | options | 新規則：mcq 四選項同詞性（動詞過去式），只能靠詞義判斷 | 改為 ["spilled","lost","provided","quit"]（原 ["spilled","lost","provided","seemed"]） |
| a2-u04-l01-q13 | optionGlossZh | 選項釋義同步 | 改為 ["灑出","弄丟","提供","放棄"]（原 ["灑出","弄丟","提供","似乎"]） |
| a2-u04-l01-q03 | exampleZh | 第②關：tool kit 譯成「一組工具箱」不太通順（kit 是一組工具，不是箱子），建議「一組工具」或「一套工具」，與 glossZh「工具組」一致。 | 改為 "我爸爸在車上放了一套工具。"（原 "我爸爸在車上放了一組工具箱。"） |
| a2-u04-l01-q10 | audioEn | 第③關 FIX：provide 情境句與單字卡雷同（旅館提供免費東西） | 改為 "The school provides free lunch for all its students."（原 "The new hotel provides free bikes for all its guests."） |
| a2-u04-l01-q10 | audioZh | 中譯同步 | 改為 "那所學校為所有學生提供免費午餐。"（原 "那家新旅館為所有住客提供免費腳踏車。"） |
| a2-u04-l01-q10 | questionZh | 題目同步 | 改為 "那所學校提供什麼？"（原 "那家新旅館提供什麼？"） |
| a2-u04-l01-q10 | options | 選項同步（正解位置不變） | 改為 ["Free lunch","Free bikes","Free tickets"]（原 ["Free bikes","Free lunch","Free tickets"]） |
| a2-u04-l01-q11 | sentenceEn | 第③關 FIX：seem 情境句與單字卡雷同 | 改為 "It seems that nobody is at home."（原 "She seems very happy today."） |
| a2-u04-l01-q11 | sentenceZh | 中譯同步 | 改為 "好像沒有人在家。"（原 "她今天似乎很開心。"） |
| a2-u04-l01-q12 | sentenceEn | 第③關 FIX：quit 情境句與單字卡雷同（辭職） | 改為 "My father quit smoking ten years ago."（原 "I quit my job to travel."） |
| a2-u04-l01-q12 | sentenceZh | 中譯同步 | 改為 "我爸爸十年前就戒菸了。"（原 "我辭掉工作去旅行。"） |
| a2-u04-l02-q13 | stemEn | 新規則：mcq 四選項同詞性（過去分詞），改題幹讓四個選項都能填入 | 改為 "Dogs are not ____ in this park."（原 "Are we ____ to take photos here?"） |
| a2-u04-l02-q13 | stemZh | 題幹中譯同步 | 改為 "這座公園不准狗進入。"（原 "我們可以在這裡拍照嗎？"） |
| a2-u04-l02-q03 | glossZh | 第②關：疑似：lead 以名詞片語 in the lead「領先（地位）」當本課詞義，A2 學習者最常用的是動詞「帶領；引導」（lead the way、lead a team）；請依 CEFR-J 該級詞性核對，若 A2 是動詞，例句與釋義應改示範動詞用法（閱讀短文同用 in the lead）。 | 不改：CEFR-J A2 的 lead 是名詞（動詞為 B1），依執行長「詞義以 CEFR-J 該級詞性＋單元主題常用義為準」照課綱教名詞「領先」 |
| a2-u04-l02-q15 | passageEn | 第③關疑似：fight 動詞「奮戰」為 B1，非目標字詞義越級 | 改為 "Last Saturday, my older sister's basketball team played a big game. The other team was in the lead for most of the game. My sister didn't understand why her team was playing so badly. Then the coach offered some advice: \"Follow the plan and pass the ball more.\" The team kept trying, created more chances, and in the end they won!"（原 "Last Saturday, my older sister's basketball team played a big game. The other team was in the lead for most of the game. My sister didn't understand why her team was playing so badly. Then the coach offered some advice: \"Follow the plan and pass the ball more.\" The team continued to fight, created more chances, and in the end they won!"） |
| a2-u04-l02-q15 | passageZh | 中譯同步 | 改為 "上週六，我姊姊的籃球隊打了一場重要的比賽。整場比賽大部分時間都是對方領先。姊姊不懂為什麼她們隊打得這麼差。後來教練給了一些建議：「照計畫打，多傳球。」她們繼續努力，創造出更多機會，最後贏了！"（原 "上週六，我姊姊的籃球隊打了一場重要的比賽。整場比賽大部分時間都是對方領先。姊姊不懂為什麼她們隊打得這麼差。後來教練給了一些建議：「照計畫打，多傳球。」她們繼續奮戰，創造出更多機會，最後贏了！"） |
| a2-u04-l03-q13 | options | 新規則：mcq 四選項同詞性（動詞），只能靠詞義判斷 | 改為 ["serve","fall","appear","remain"]（原 ["serve","fall","reach","send"]） |
| a2-u04-l03-q13 | optionGlossZh | 選項釋義同步 | 改為 ["供應","跌倒","出現","保持"]（原 ["供應","跌倒","抵達","寄"]） |
| a2-u04-l03-q17 | rubricZh/1 | 第②關：括號不成對：「可寫例如 sent my mother some photos、sent a card to my friend）」多一個右括號、缺左括號。 | 改為 "送的東西和對象可寫在 sent 後面（例如 sent my mother some photos、sent a card to my friend）"（原 "可寫例如 sent my mother some photos、sent a card to my friend）"） |
| a2-u04-l03-q15 | passageEn | 第②關：疑似："at noon nobody appeared" 說客人沒來，英文較自然是 nobody came / nobody showed up；appear 用在「沒人出現」雖可懂但略生硬。 | 改為 "Amy's restaurant opened last week. She expected many people on the first day, but at noon nobody came. She did not give up. She sent messages to all her friends. By six o'clock, the restaurant was full, and Amy served dinner to forty people. Everything was under control. When the last guest left, she almost fell asleep on a chair."（原 "Amy's restaurant opened last week. She expected many people on the first day, but at noon nobody appeared. She did not give up. She sent messages to all her friends. By six o'clock, the restaurant was full, and Amy served dinner to forty people. Everything was under control. When the last guest left, she almost fell asleep on a chair."） |
| a2-u04-l03-q16 | rubricZh/0 | 第②關：疑似過嚴：「expect 後面接 to＋原形動詞」把 We expect that we will arrive… / We expect we'll arrive… 等同樣正確的子句寫法排除，建議改「例如 expect to arrive；接 that 子句也正確」。 | 改為 "expect 後面可接 to＋原形動詞（例如 expect to arrive）；接 that 子句也正確"（原 "expect 後面接 to＋原形動詞（例如 expect to arrive）"） |
| a2-u04-l03-q11 | sentenceEn | 閱讀的 appeared 改掉後，補 appear 的情境句（control 另有單字卡與閱讀） | 改為 "The sun appeared from behind the clouds."（原 "The teacher has the class under control."） |
| a2-u04-l03-q11 | sentenceZh | 中譯同步 | 改為 "太陽從雲後面露出來了。"（原 "老師把班上的秩序管得很好。"） |
| a2-u04-l04-q15 | passageZh | 第②關：「花了很多努力」中文搭配不自然，建議「下了很多功夫」或「付出了很多努力」。 | 改為 "Tom 去年開始學吉他，付出了很多努力。他每天都把自己彈的錄下來，再仔細聽。他犯了很多錯，但家人給了他很多支持。上個月，他在一場小型音樂會上表演。他彈完的時候，大家舉起手來歡呼。他說：「我明年會帶著新歌再回來。」"（原 "Tom 去年開始學吉他，花了很多努力。他每天都把自己彈的錄下來，再仔細聽。他犯了很多錯，但家人給了他很多支持。上個月，他在一場小型音樂會上表演。他彈完的時候，大家舉起手來歡呼。他說：「我明年會帶著新歌再回來。」"） |
| a2-u04-l04-q11 | sentenceEn | 第③關 FIX：raise 情境句與單字卡雷同（舉手） | 改為 "The cafe raised its prices last month."（原 "Please raise your hand."） |
| a2-u04-l04-q11 | sentenceZh | 中譯同步 | 改為 "那家咖啡店上個月漲價了。"（原 "請舉手。"） |
| a2-u04-l04-q14 | options | 新規則：mcq 四選項同詞性（祈使動詞），四個都能填入、只能靠詞義判斷 | 改為 ["Return","Pull","Raise","Record"]（原 ["Receive","Pull","Return","Effort"]） |
| a2-u04-l04-q14 | optionGlossZh | 選項釋義同步 | 改為 ["歸還","拉","舉起","錄下"]（原 ["收到","拉","歸還","努力"]） |
| a2-u04-l05-q11 | sentenceEn | 第③關 FIX：hit 情境句與單字卡雷同（球打到） | 改為 "He hit his head on the door."（原 "The ball hit me on the head."） |
| a2-u04-l05-q11 | sentenceZh | 中譯同步 | 改為 "他的頭撞到了門。"（原 "球打到我的頭。"） |
| a2-u04-l06-q14 | stemEn | 第③關：正解是唯一名詞、只靠詞性可選；改四選項同詞性並加情境 | 改為 "The new cafe was a great ____. It was full every day."（原 "The new cafe was a great ____."） |
| a2-u04-l06-q14 | stemZh | 題幹中譯同步 | 改為 "那家新咖啡店非常成功，每天都客滿。"（原 "那家新咖啡店非常成功。"） |
| a2-u04-l06-q14 | options | 選項換成四個名詞 | 改為 ["mistake","problem","success","danger"]（原 ["indicate","prepare","success","accept"]） |
| a2-u04-l06-q14 | optionGlossZh | 選項釋義同步 | 改為 ["錯誤","問題","成功","危險"]（原 ["指出","準備","成功","接受"]） |
| a2-u04-l06-q15 | passageEn | 第②關：疑似：教練說 "We accept you on the team." 不太道地，較自然為 "You're on the team." 或 "We'd like you to join the team."；若要保留 accept，可改 "We accept you onto the team" 或旁白 "The team accepted him." | 改為 "Kevin wanted to join the basketball team at his school. He prepared for weeks. On the big day, he shot the ball well, but he failed the running test. He felt so sad that he lay on his bed all evening. The next day, the coach called. \"Your shooting indicates real talent,\" he said. \"We have decided to accept you.\""（原 "Kevin wanted to join the basketball team at his school. He prepared for weeks. On the big day, he shot the ball well, but he failed the running test. He felt so sad that he lay on his bed all evening. The next day, the coach called. \"Your shooting indicates real talent,\" he said. \"We accept you on the team.\""） |
| a2-u04-l06-q15 | passageZh | 中譯同步 | 改為 "Kevin 想加入學校的籃球隊，他準備了好幾個星期。到了測驗那天，他投籃投得很好，但跑步測驗沒通過。他難過得整個晚上都躺在床上。隔天，教練打電話來說：「你的投籃顯示出你真的有天分。我們決定接受你加入球隊。」"（原 "Kevin 想加入學校的籃球隊，他準備了好幾個星期。到了測驗那天，他投籃投得很好，但跑步測驗沒通過。他難過得整個晚上都躺在床上。隔天，教練打電話來說：「你的投籃顯示出你真的有天分。我們接受你加入球隊。」"） |
| a2-u04-l06-q10 | audioEn | 第③關 FIX：fail 情境句與單字卡雷同（駕照考試） | 改為 "Our first plan failed, but the second one worked."（原 "She failed her first driving test, but she passed the second one."） |
| a2-u04-l06-q10 | audioZh | 中譯同步 | 改為 "我們的第一個計畫失敗了，但第二個成功了。"（原 "她第一次駕照考試沒過，但第二次通過了。"） |
| a2-u04-l06-q10 | questionZh | 題目同步 | 改為 "他們的計畫結果如何？"（原 "她的駕照考試結果如何？"） |
| a2-u04-l06-q10 | options | 選項同步（正解位置不變） | 改為 ["Both plans failed","The second plan worked","They did not make a plan"]（原 ["She failed both tests","She passed the second test","She did not take the test"]） |
| a2-u04-l07-q14 | stemEn | 新規則：mcq 四選項同詞性（接動名詞的動詞），題幹加情境讓答案唯一 | 改為 "It's dangerous. Please ____ driving in heavy rain."（原 "Please ____ driving in heavy rain."） |
| a2-u04-l07-q14 | stemZh | 題幹中譯同步 | 改為 "很危險，下大雨時請避免開車。"（原 "下大雨時請避免開車。"） |
| a2-u04-l07-q14 | options | 選項換成四個動詞 | 改為 ["enjoy","start","keep","avoid"]（原 ["act","apply","manage","avoid"]） |
| a2-u04-l07-q14 | optionGlossZh | 選項釋義同步 | 改為 ["享受","開始","繼續","避免"]（原 ["舉動","申請","設法做到","避免"]） |
| a2-u04-l07-q16 | rubricZh/0 | 第②關：疑似過嚴：寫「『成立於』用被動」，但 The company was founded in 2010 以外，主動寫法 The company started in 2010 也正確；建議改「例如 was established in」並註明其他正確寫法照收。 | 改為 "「成立於」可寫例如 was established in、was started in；寫 The company started in 2010 也正確"（原 "「成立於」用被動（例如 was established in＋年份）；寫 was started in、was set up in 也正確"） |
| a2-u04-l07-q12 | sentenceEn | 第③關 FIX：perform 情境句與單字卡雷同（樂團表演） | 改為 "The children performed a short play for their parents."（原 "The band performed three new songs."） |
| a2-u04-l07-q12 | sentenceZh | 中譯同步 | 改為 "孩子們為爸媽演出了一齣短劇。"（原 "樂團表演了三首新歌。"） |
| a2-u04-l07-q15 | passageEn | 第③關疑似：搭配不道地 | 改為 "Lucy has always loved music. Last year, she managed to establish a small music school in her town. She also performs at a cafe every Friday night. Recently, she applied to the city for money to buy new pianos. She revealed a secret: she was very shy as a child. \"I tried to avoid singing in front of people,\" she said. \"Starting this school was a brave act for me.\""（原 "Lucy has always loved music. Last year, she managed to establish a small music school in her town. She also performs at a cafe every Friday night. Recently, she applied for money from the city to buy new pianos. She revealed a secret: she was very shy as a child. \"I tried to avoid singing in front of people,\" she said. \"Starting this school was a brave act for me.\""） |
| a2-u04-l08-q13 | options | 第②關：雙答案：admit 有「讓…進入」之義，"The windows admit the sunlight."（窗戶讓陽光照進來）是合文法、可見於書面的正確英文；干擾項 admit 應換掉（例如換成 exist 以外的不及物或語意明顯不合的字）。 | 改為 ["remember","discover","reflect","forget"]（原 ["admit","exist","reflect","discover"]）；雙答案：干擾項 admit 換成填入後語意明顯不通的同詞性動詞（remember、forget）；四選項皆為及物動詞，只能靠詞義判斷 |
| a2-u04-l08-q13 | optionGlossZh | 選項釋義同步 | 改為 ["記得","發現","反射","忘記"]（原 ["承認","存在","反射","發現"]） |
| a2-u04-l08 | judge/verdicts/a2-u04-l08-q13 | 干擾項已替換，執行長裁示：判題更新為修正後的唯一正解（審題員原判 [2,0]） | 改為 [2]（原 [2,0]） |
| a2-u04-l08-q16 | rubricZh/0 | 第②關：寫死單一說法：「『上映日期』用 release date」未用「例如」；且第二條「問句可用 What 或 When 開頭」是封閉清單，When will this movie come out? / When is this movie released? 等也正確。建議改「例如 release date；寫 When is this movie released? 也正確」。 | 改為 "「上映日期」可寫例如 release date；寫 When does this movie come out? 等也正確"（原 "「上映日期」用 release date"） |
| a2-u04-l08-q16 | rubricZh/1 | 第②關同條：問句開頭不寫封閉清單 | 改為 "問句可寫例如 What is the release date…?、Do you know the release date…?"（原 "問句可用 What 或 When 開頭（例如 What is the release date…?）"） |
| a2-u04-l08-q16 | referenceEn/1 | 第②關："When is the release date of this movie?" 語意重複（When＋date），不夠道地，建議改 "When will this movie be released?" | 改為 "Do you know the release date of this movie?"（原 "When is the release date of this movie?"）；審題員建議的 be released 是 release 的動詞用法（B1），目標字照課綱只教名詞，故改成不重複的另一問法 |
| a2-u04-l08-q12 | sentenceEn | 第③關 FIX：admit 情境句與單字卡雷同 | 改為 "She admitted she forgot my birthday."（原 "I must admit I was wrong."） |
| a2-u04-l08-q12 | sentenceZh | 中譯同步 | 改為 "她承認她忘了我的生日。"（原 "我必須承認我錯了。"） |
| a2-u04-l09-q13 | options | 新規則：mcq 四選項同詞性（動詞），只能靠詞義判斷 | 改為 ["achieve","encourage","admire","replace"]（原 ["achieve","encourage","refer","replace"]） |
| a2-u04-l09-q13 | optionGlossZh | 選項釋義同步 | 改為 ["達成","鼓勵","欽佩","更換"]（原 ["達成","鼓勵","參閱","更換"]） |
| a2-u05-l01-q13 | options | 新規則：mcq 四選項同詞性（名詞），只能靠詞義判斷 | 改為 ["reunion","generation","member","anniversary"]（原 ["adult","generation","human","anniversary"]） |
| a2-u05-l01-q13 | optionGlossZh | 選項釋義同步 | 改為 ["團聚","世代","成員","週年紀念"]（原 ["成年人","世代","人類的","週年紀念"]） |
| a2-u05-l01-q15 | passageEn | 第②關：疑似："the most junior member, a baby girl" ——junior 是「資淺、職位較低」，用在家族裡指年紀最小的嬰兒不道地，應寫 the youngest member；passageZh 已譯「年紀最小」，與 junior 本課詞義（資淺的）不符。 | 改為 "Last month, the Chen family had a big reunion for the fiftieth anniversary of the grandparents' wedding. Four generations came, from the old couple to two little babies. Every family member brought some food. The adults talked and laughed all afternoon, while the youngest member, a baby girl, slept the whole time."（原 "Last month, the Chen family had a big reunion for the fiftieth anniversary of the grandparents' wedding. Four generations came, from the old couple to two little babies. Every family member brought some food. The adults talked and laughed all afternoon, while the most junior member, a baby girl, slept the whole time."） |
| a2-u05-l01-q05 | exampleEn | 第②關：疑似："some human words" 搭配不自然（human 多搭 language／speech／voice），建議 "Dogs can understand some human language." 或換例句 "This is a human voice." | 改為 "Dogs can understand some human language."（原 "Dogs can understand some human words."） |
| a2-u05-l01-q05 | exampleZh | 中譯同步 | 改為 "狗能聽懂一些人類的語言。"（原 "狗能聽懂人類的一些話。"） |
| a2-u05-l01-q12 | sentenceEn | 閱讀改用 youngest 後，補 junior「資淺的」情境句 | 改為 "She is a junior member of our tennis club."（原 "Every member of the team was there."） |
| a2-u05-l01-q12 | sentenceZh | 中譯同步 | 改為 "她是我們網球社的資淺成員。"（原 "團隊的每個成員都到了。"） |
| a2-u05-l01-q09 | sentenceEn | 第③關 FIX：adult 情境句與單字卡雷同（票價） | 改為 "This movie is only for adults."（原 "Tickets are cheaper for children than for adults."） |
| a2-u05-l01-q09 | sentenceZh | 中譯同步 | 改為 "這部電影只限成人觀看。"（原 "兒童票比成人票便宜。"） |
| a2-u05-l02-q14 | options | 新規則：mcq 四選項同詞性（動名詞），只能靠詞義判斷 | 改為 ["marrying","inviting","forgetting","crowding"]（原 ["senior","inviting","crowd","marrying"]） |
| a2-u05-l02-q14 | optionGlossZh | 選項釋義同步 | 改為 ["和⋯結婚","邀請","忘記","擠滿"]（原 ["資深的","邀請","人群","和⋯結婚"]） |
| a2-u05-l02-q11 | sentenceEn | 第③關疑似：male 情境句與單字卡同句型，改成問句 | 改為 "Is your new dog a male?"（原 "Our dog is a male, and his name is Coco."） |
| a2-u05-l02-q11 | sentenceZh | 中譯同步 | 改為 "你新養的狗是公的嗎？"（原 "我們的狗是公的，牠叫 Coco。"） |
| a2-u05-l02-q11 | sentenceEn | 自查：跟讀句與單字卡例句仍相近（新養的寵物），換情境 | 改為 "Is that bird a male?"（原 "Is your new dog a male?"） |
| a2-u05-l02-q11 | sentenceZh | 中譯同步 | 改為 "那隻鳥是公的嗎？"（原 "你新養的狗是公的嗎？"） |
| a2-u05-l03-q13 | options | 第③關：正解是唯一形容詞、只靠詞性可選；改四選項同詞性 | 改為 ["married","rich","elderly","teenage"]（原 ["gender","stranger","elderly","lover"]） |
| a2-u05-l03-q13 | optionGlossZh | 選項釋義同步 | 改為 ["已婚的","有錢的","年長的","十幾歲的"]（原 ["性別","陌生人","年長的","愛好者"]） |
| a2-u05-l03-q15 | questions/1/questionZh | 第②關：疑似：題目問「作者去年春天為什麼去日本？」，但短文只說主人邀請作者參加孫女婚禮、"It felt like going home"，沒有明說作者去了日本或婚禮在日本；建議短文補一句（例如 So I flew to Japan again.）或改問「主人去年春天邀請作者做什麼？」。 | 改為 "主人去年春天邀請作者做什麼？"（原 "作者去年春天為什麼去日本？"） |
| a2-u05-l03-q15 | questions/1/options | 選項同步（正解位置不變） | 改為 ["去她家讀書","參加她孫女的婚禮","去她家工作"]（原 ["去讀書","參加婚禮","去工作"]） |
| a2-u05-l03-q09 | sentenceEn | 第③關 FIX：childhood 情境句與單字卡雷同 | 改為 "I had a very happy childhood."（原 "I spent my childhood by the sea."） |
| a2-u05-l03-q09 | sentenceZh | 中譯同步 | 改為 "我有一個很快樂的童年。"（原 "我的童年是在海邊度過的。"） |
| a2-u05-l04-q13 | options | 新規則：mcq 四選項同詞性（形容詞），只能靠詞義判斷 | 改為 ["empty","quiet","crowded","clean"]（原 ["ancestor","teenage","crowded","bride"]） |
| a2-u05-l04-q13 | optionGlossZh | 選項釋義同步 | 改為 ["空的","安靜的","擁擠的","乾淨的"]（原 ["祖先","十幾歲的","擁擠的","新娘"]） |
| a2-u05-l04-q16 | rubricZh/2 | 第③關 FIX：要點寫死字詞 | 改為 "「二十年前」可寫例如 twenty years ago"（原 "「二十年前」用 twenty years ago"） |
| a2-u05-l05-q10 | audioEn | 第③關 FIX：penfriend 情境句與單字卡雷同（筆友在日本） | 改為 "My penfriend lives in Canada, and we write to each other every month."（原 "My penfriend lives in Japan, and we write to each other every month."） |
| a2-u05-l05-q10 | audioZh | 中譯同步 | 改為 "我的筆友住在加拿大，我們每個月都會寫信給對方。"（原 "我的筆友住在日本，我們每個月都會寫信給對方。"） |
| a2-u06-l01-q14 | options | 第③關：正解是唯一副詞、只靠詞性可選；改四選項同詞性 | 改為 ["Unfortunately","Silently","Correctly","Fortunately"]（原 ["Inspiration","Unhappy","Polite","Fortunately"]） |
| a2-u06-l01-q14 | optionGlossZh | 選項釋義同步 | 改為 ["不幸地","安靜地","正確地","幸好"]（原 ["靈感","不快樂的","有禮貌的","幸好"]） |
| a2-u06-l02-q13 | stemEn | 第③關：正解是唯一動詞、只靠詞性可選；改四選項同詞性並加情境 | 改為 "The noise from the street really ____ me. I can't sleep."（原 "The noise from the street really ____ me."） |
| a2-u06-l02-q13 | stemZh | 題幹中譯同步 | 改為 "街上的噪音真的讓我很煩，我都睡不著。"（原 "街上的噪音真的讓我很煩。"） |
| a2-u06-l02-q13 | options | 選項換成四個動詞 | 改為 ["pleases","annoys","helps","relaxes"]（原 ["energetic","annoys","trouble","ability"]） |
| a2-u06-l02-q13 | optionGlossZh | 選項釋義同步 | 改為 ["使高興","惹惱","幫助","使放鬆"]（原 ["精力充沛的","惹惱","麻煩","能力"]） |
| a2-u06-l02-q15 | passageZh | 第②關：狗 Coco 的代名詞譯成「她」，台灣書面慣用「牠」指動物（同單元 a2-u05-l02 已用「牠」），全段「她很愛跑、她怕水、幫她洗澡、她吵鬧的行為、對她不耐煩」應改「牠」。 | 改為 "我們家的狗 Coco 精力非常充沛。牠很愛跑，但有一個奇怪的恐懼：牠怕水。幫牠洗澡總是很麻煩。Coco 也討厭貓，牠吵鬧的行為常常惹惱鄰居。我爸爸會對牠不耐煩，但我媽媽說：「牠有學習的能力，別對牠不耐煩。」"（原 "我們家的狗 Coco 精力非常充沛。她很愛跑，但有一個奇怪的恐懼：她怕水。幫她洗澡總是很麻煩。Coco 也討厭貓，她吵鬧的行為常常惹惱鄰居。我爸爸會對她不耐煩，但我媽媽說：「她有學習的能力，要有耐心。」"）；動物一律用「牠」；末句隨 patient 修正同步 |
| a2-u06-l02-q15 | passageEn | 第③關 FIX：patient 形容詞「有耐心的」為 B1，非目標字詞義越級，改用本課目標字 impatient | 改為 "Our dog, Coco, is very energetic. She loves running, but she has one strange fear: she is afraid of water. Giving her a bath is always trouble. Coco also has a dislike of cats, and her noisy behavior often annoys our neighbors. My father gets impatient with her, but my mother says, \"She has the ability to learn. Don't be impatient with her.\""（原 "Our dog, Coco, is very energetic. She loves running, but she has one strange fear: she is afraid of water. Giving her a bath is always trouble. Coco also has a dislike of cats, and her noisy behavior often annoys our neighbors. My father gets impatient with her, but my mother says, \"She has the ability to learn. Be patient.\""） |
| a2-u06-l02-q15 | questions/1/options/1 | 選項同步短文 | 改為 "Coco 學得會，別對牠不耐煩"（原 "Coco 學得會，要有耐心"） |
| a2-u06-l02-q17 | rubricZh/0 | 第②關：疑似過嚴：「have trouble 後面接動詞 -ing」排除 have trouble with＋名詞（I have trouble with math.）這種同樣正確、也符合「做某件事有困難」的寫法；建議改「例如 have trouble getting up；have trouble with＋名詞也正確」。 | 改為 "have trouble 後面可接動詞 -ing 或 with＋名詞（例如 have trouble getting up、have trouble with math）"（原 "have trouble 後面接動詞 -ing（例如 have trouble getting up）"） |
| a2-u06-l02-q12 | sentenceEn | 第③關 FIX：impatient 情境句與單字卡雷同 | 改為 "He gets impatient when he has to wait."（原 "Please don't be impatient."） |
| a2-u06-l02-q12 | sentenceZh | 中譯同步 | 改為 "他只要一等就會不耐煩。"（原 "請不要不耐煩。"） |
| a2-u06-l02-q09 | sentenceEn | 第③關疑似：energetic 情境句與單字卡句型相近 | 改為 "We need an energetic person for this job."（原 "My little sister is always energetic."） |
| a2-u06-l02-q09 | sentenceZh | 中譯同步 | 改為 "這份工作需要一個有活力的人。"（原 "我妹妹總是精力充沛。"） |
| a2-u06-l02-q17 | rubricZh/0 | 前次修正後超過 80 字上限，縮短 | 改為 "have trouble 後面可接例如動詞 -ing、with＋名詞（have trouble getting up、have trouble with math）"（原 "have trouble 後面可接動詞 -ing 或 with＋名詞（例如 have trouble getting up、have trouble with math）"） |
| a2-u06-l02-q17 | rubricZh/0 | 仍超過 80 字上限，再縮短 | 改為 "have trouble 後可接例如動詞 -ing、with＋名詞（getting up、with math）"（原 "have trouble 後面可接例如動詞 -ing、with＋名詞（have trouble getting up、have trouble with math）"） |
| a2-u06-l03-q14 | options | 第③關：正解是唯一動詞、只靠詞性可選；改四選項同詞性 | 改為 ["hate","appreciate","avoid","lose"]（原 ["comfortable","appreciate","attitude","difficulty"]） |
| a2-u06-l03-q14 | optionGlossZh | 選項釋義同步 | 改為 ["討厭","感激","避免","弄丟"]（原 ["舒服的","感激","態度","困難"]） |
| a2-u06-l03-q15 | passageEn | 第②關：疑似："He has great intelligence" 描述同學不夠道地，口語會說 He is very intelligent/smart；另 "Later, he told me he hates being the new student" 時態宜一致為 hated（或改 "he told me he hated being new"）。 | 改為 "Sam is the new student in my class. At first, some students did not like his manner. He seemed cold, and he never smiled. But I soon learned he was just shy. Everyone was surprised by his intelligence, and he helps anyone who has difficulty with math. Later, he told me he hated being the new student. Now he feels comfortable in our class, and we are good friends."（原 "Sam is the new student in my class. At first, some students did not like his manner. He seemed cold, and he never smiled. But I soon learned he was just shy. He has great intelligence, and he helps anyone who has difficulty with math. Later, he told me he hates being the new student. Now he feels comfortable in our class, and we are good friends."） |
| a2-u06-l03-q15 | passageZh | 中譯同步 | 改為 "Sam 是我們班的新同學。一開始，有些同學不喜歡他的舉止。他看起來很冷淡，也從來不笑。但我很快就發現他只是害羞。他的聰明讓大家都很驚訝，他也會幫助任何數學有困難的人。後來他跟我說，他很討厭當新同學。現在他在我們班已經很自在了，我們也成了好朋友。"（原 "Sam 是我們班的新同學。一開始，有些同學不喜歡他的舉止。他看起來很冷淡，也從來不笑。但我很快就發現他只是害羞。他很聰明，會幫助任何數學有困難的人。後來他跟我說，他很討厭當新同學。現在他在我們班已經很自在了，我們也成了好朋友。"） |
| a2-u06-l03-q11 | sentenceEn | 第③關 FIX：hate 情境句與單字卡雷同（I hate V-ing） | 改為 "Most cats hate water."（原 "I hate getting up early."） |
| a2-u06-l03-q11 | sentenceZh | 中譯同步 | 改為 "大多數的貓都討厭水。"（原 "我討厭早起。"） |
| a2-u06-l04-q13 | stemEn | 第③關：正解是唯一形容詞、只靠詞性可選；改四選項同詞性並加情境 | 改為 "Nobody thought he could win, so everyone was ____ when he won."（原 "Everyone was ____ when he won the contest."） |
| a2-u06-l04-q13 | stemZh | 題幹中譯同步 | 改為 "沒人想到他會贏，所以他贏的時候大家都很驚訝。"（原 "他贏得比賽時，大家都很驚訝。"） |
| a2-u06-l04-q13 | options | 選項換成四個形容詞 | 改為 ["bored","sleepy","hungry","surprised"]（原 ["talent","personality","honor","surprised"]） |
| a2-u06-l04-q13 | optionGlossZh | 選項釋義同步 | 改為 ["無聊的","想睡的","餓的","驚訝的"]（原 ["天分","個性","榮幸","感到驚訝的"]） |
| a2-u06-l04-q15 | passageZh | 第②關：「Jenny 交了一幅畫她奶奶的作品」語序彆扭，建議「Jenny 交了一幅她奶奶的畫像參賽」。 | 改為 "上個月，我們學校舉辦了一場美術比賽。安靜的女孩 Jenny 為比賽畫了一幅她奶奶的畫像。老師唸出得獎者名字的時候，我們聽到一聲尖叫——是 Jenny！這個消息讓她非常震驚，因為她從沒想過自己有什麼天分。可惜她爸媽不在場。不過她的老師一點也不驚訝，他說：「妳非常有創意。」"（原 "上個月，我們學校舉辦了一場美術比賽。安靜的女孩 Jenny 交了一幅畫她奶奶的作品。老師唸出得獎者名字的時候，我們聽到一聲尖叫——是 Jenny！這個消息讓她非常震驚，因為她從沒想過自己有什麼天分。可惜她爸媽不在場。不過她的老師一點也不驚訝，他說：「妳非常有創意。」"） |
| a2-u06-l04-q15 | passageEn | 第③關疑似：enter 當「交出作品參賽」高於 A2 詞義 | 改為 "Last month, our school had an art contest. Jenny, a quiet girl, painted a picture of her grandmother for the contest. When the teacher read the winner's name, we heard a scream. It was Jenny! The news was a big shock to her, because she never thought she had any talent. Unfortunately, her parents were not there. But her teacher was not surprised. \"You are very creative,\" he said."（原 "Last month, our school had an art contest. Jenny, a quiet girl, entered a painting of her grandmother. When the teacher read the winner's name, we heard a scream. It was Jenny! The news was a big shock to her, because she never thought she had any talent. Unfortunately, her parents were not there. But her teacher was not surprised. \"You are very creative,\" he said."） |
| a2-u06-l04-q10 | audioEn | 第③關 FIX：surprised 情境句與單字卡雷同（I was surprised to…） | 改為 "I was surprised when my classmates gave me a birthday cake."（原 "I was surprised to get a birthday cake from my classmates."） |
| a2-u06-l04-q10 | audioZh | 中譯同步 | 改為 "同學送我生日蛋糕時，我很驚訝。"（原 "收到同學送的生日蛋糕，我很驚訝。"） |
| a2-u06-l05-q13 | options | 新規則：mcq 四選項同詞性（形容詞），只能靠詞義判斷 | 改為 ["attractive","mad","nervous","surprising"]（原 ["favor","mad","attractive","fortune"]） |
| a2-u06-l05-q13 | optionGlossZh | 選項釋義同步 | 改為 ["有吸引力的","生氣的","緊張的","令人驚訝的"]（原 ["幫忙","生氣的","有吸引力的","財富"]） |
| a2-u06-l05-q10 | audioEn | 第③關 FIX：nervous 情境句與單字卡雷同（feel nervous before…） | 改為 "He was so nervous that he forgot his phone number."（原 "He felt nervous before his first day at the new job."） |
| a2-u06-l05-q10 | audioZh | 中譯同步 | 改為 "他緊張到忘了自己的電話號碼。"（原 "他在新工作上班的第一天之前覺得很緊張。"） |
| a2-u06-l05-q10 | questionZh | 題目同步 | 改為 "他為什麼忘了自己的電話號碼？"（原 "他什麼時候覺得緊張？"） |
| a2-u06-l05-q10 | options | 選項同步（正解位置不變） | 改為 ["He was tired","He was sick","He was nervous"]（原 ["At a party","After a long trip","Before his first day at work"]） |
| a2-u06-l05-q16 | rubricZh/0 | 第③關 FIX：要點寫死句型 | 改為 "「心情很好」可寫例如 in a good mood（I'm in a good mood）"（原 "「心情很好」用 in a good mood（例如 I'm in a good mood）"） |
| a2-u06-l06-q14 | options | 新規則：mcq 四選項同詞性（動詞），只能靠詞義判斷 | 改為 ["work","run","dance","relax"]（原 ["satisfy","impress","confident","relax"]） |
| a2-u06-l06-q14 | optionGlossZh | 選項釋義同步 | 改為 ["工作","跑步","跳舞","放鬆"]（原 ["使滿意","使印象深刻","有信心的","放鬆"]） |
| a2-u06-l06-q17 | rubricZh/0 | 第③關疑似：要點未收其他正確結構 | 改為 "relax 後面可接例如 by＋動詞 -ing、地點、with＋東西（relax by listening、relax at home、relax with a book）"（原 "relax 是動詞「放鬆」，後面可接 by＋動詞 -ing 或地點（例如 relax by listening、relax at home）"） |
| a2-u06-l06-q17 | rubricZh/0 | 前次修正後超過 80 字上限，縮短 | 改為 "relax 後面可接例如 by＋動詞 -ing、地點、with＋東西（relax by listening、relax with a book）"（原 "relax 後面可接例如 by＋動詞 -ing、地點、with＋東西（relax by listening、relax at home、relax with a book）"） |
| a2-u06-l07-q14 | options | 第③關：正解是唯一動詞、只靠詞性可選；改四選項同詞性 | 改為 ["hate","annoy","admire","forget"]（原 ["horror","gentle","admire","pleased"]） |
| a2-u06-l07-q14 | optionGlossZh | 選項釋義同步 | 改為 ["討厭","惹惱","欽佩","忘記"]（原 ["恐怖","溫柔的","欽佩","高興的"]） |
| a2-u06-l07-q15 | passageEn | 第③關 FIX：英文搭配不道地 | 改為 "My grandparents have been married for fifty years. My grandfather is a gentle and wise man. Every year, he plans something romantic for their anniversary. Last year, he took Grandma to the restaurant where they had their first date. Grandma was very pleased. When it started to rain, she was worried about getting home. \"Don't be upset,\" Grandpa said, and he opened a big umbrella. I really admire them."（原 "My grandparents have been married for fifty years. My grandfather is a gentle and wise man. Every year, he plans something romantic for their anniversary. Last year, he took Grandma to the restaurant of their first date. Grandma was very pleased. When it started to rain, she was worried about getting home. \"Don't be upset,\" Grandpa said, and he opened a big umbrella. I really admire them."） |
| a2-u06-l07-q15 | passageEn | 第②關：疑似邏輯不貼：奶奶是「擔心怎麼回家」(worried)，爺爺卻回 "Don't be upset"（別心煩／別難過），回應對不上情緒；建議改 "Don't worry"，或把前句改成 she was upset about the rain。 | 改為 "My grandparents have been married for fifty years. My grandfather is a gentle and wise man. Every year, he plans something romantic for their anniversary. Last year, he took Grandma to the restaurant where they had their first date. Grandma was very pleased. When it started to rain, she was upset. \"Don't worry,\" Grandpa said, and he opened a big umbrella. I really admire them."（原 "My grandparents have been married for fifty years. My grandfather is a gentle and wise man. Every year, he plans something romantic for their anniversary. Last year, he took Grandma to the restaurant where they had their first date. Grandma was very pleased. When it started to rain, she was worried about getting home. \"Don't be upset,\" Grandpa said, and he opened a big umbrella. I really admire them."） |
| a2-u06-l07-q15 | passageZh | 中譯同步 | 改為 "我爺爺奶奶已經結婚五十年了。爺爺是個溫柔又有智慧的人。每年結婚紀念日，他都會安排浪漫的活動。去年，他帶奶奶去他們第一次約會的那家餐廳。奶奶非常高興。開始下雨的時候，她很心煩。爺爺說：「別擔心。」然後撐開一把大傘。我真的很欽佩他們。"（原 "我爺爺奶奶已經結婚五十年了。爺爺是個溫柔又有智慧的人。每年結婚紀念日，他都會安排浪漫的活動。去年，他帶奶奶去他們第一次約會的那家餐廳。奶奶非常高興。開始下雨的時候，她擔心要怎麼回家。爺爺說：「別心煩。」然後撐開一把大傘。我真的很欽佩他們。"） |
| a2-u06-l07-q15 | questions/1/questionZh | 短文改寫後題目同步 | 改為 "開始下雨時，爺爺做了什麼？"（原 "開始下雨時，奶奶擔心什麼？"） |
| a2-u06-l07-q15 | questions/1/options | 選項同步（正解位置不變） | 改為 ["叫了一輛計程車","撐開一把大傘","打電話給家人"]（原 ["餐廳會關門","要怎麼回家","衣服會弄濕"]） |
| a2-u07-l01-q13 | stemEn | 第③關 FIX：fix 動詞「整理」為 B1，非目標字詞義越級 | 改為 "Can I borrow your ____? I want to brush my hair."（原 "Can I borrow your ____? I want to fix my hair."） |
| a2-u07-l01-q13 | stemZh | 中譯同步 | 改為 "可以借我你的梳子嗎？我想梳一下頭髮。"（原 "可以借我你的梳子嗎？我想整理一下頭髮。"） |
| a2-u07-l01-q14 | passageEn | 第③關 FIX：敘事時態前後一致 | 改為 "Winter was coming, so Emma went shopping for warm clothes. She bought a thick sweater, a long scarf and a pair of gloves. She also needed some new socks. In another shop, she saw a beautiful diamond ring, but it was far too expensive. On her way home, it started to rain. Fortunately, she had her raincoat in her bag."（原 "Winter is coming, so Emma went shopping for warm clothes. She bought a thick sweater, a long scarf and a pair of gloves. She also needed some new socks. In another shop, she saw a beautiful diamond ring, but it was far too expensive. On her way home, it started to rain. Fortunately, she had her raincoat in her bag."） |
| a2-u07-l02-q13 | options | 第③關：正解是唯一動詞、只靠詞性可選；改四選項同詞性 | 改為 ["wears","misses","suits","borrows"]（原 ["uniform","appearance","suits","slim"]） |
| a2-u07-l02-q13 | optionGlossZh | 選項釋義同步 | 改為 ["穿","想念","適合","借"]（原 ["制服","外表","適合","苗條的"]） |
| a2-u07-l02-q01 | glossZh | 第②關：釋義「西裝；適合（動詞）」含兩個詞義，但例句 "He wears a dark suit to work." 只示範名詞「西裝」；依撰寫準則 §3 釋義要對得上例句用法，建議 glossZh 只寫「西裝；套裝」（動詞 suit 已在聽打與 mcq 練到）。 | 不改：本課聽打（That blue dress really suits you.）與 mcq 用 suit 動詞「適合」，依執行長「釋義要涵蓋本課題目用到的詞義，必要時兩義並列」保留兩義 |
| a2-u07-l02-q02 | exampleEn | 第③關 FIX：care about（動詞「在意」B1）非目標字詞義越級 | 改為 "Her appearance is very important to her."（原 "She cares a lot about her appearance."） |
| a2-u07-l02-q02 | exampleZh | 中譯同步 | 改為 "外表對她來說非常重要。"（原 "她非常在意自己的外表。"） |
| a2-u07-l03-q12 | options | 新規則：mcq 四選項同詞性（名詞），只能靠詞義判斷 | 改為 ["shampoo","raincoat","sunglasses","toothbrush"]（原 ["overweight","shampoo","sunglasses","blonde"]） |
| a2-u07-l03-q12 | optionGlossZh | 選項釋義同步 | 改為 ["洗髮精","雨衣","太陽眼鏡","牙刷"]（原 ["超重的","洗髮精","太陽眼鏡","金色的"]） |
| a2-u07-l03-q16 | rubricZh/1 | 第②關：疑似過嚴：「『戴』用 wear」寫死動詞，put on my sunglasses（戴上）也正確；建議「『戴』可寫例如 wear、put on」。 | 改為 "「戴」可寫例如 wear、put on（wear sunglasses、put on my sunglasses）"（原 "「戴」用 wear（例如 wear sunglasses）"） |
| a2-u07-l03-q14 | passageEn | 第②關：疑似：結尾 "gave one bottle to her host family" 的 host family 前文未交代（只說去日本旅行），讀者不知道她住寄宿家庭；建議前面補一句（例如 She was going to stay with a host family.）或改成 a friend。 | 改為 "Before her trip to Japan, Amy went shopping. She bought new sunglasses, a pair of gold earrings and three bottles of perfume. At the airport, her suitcase was overweight, so she had to pay more money. \"Maybe I didn't need so much perfume,\" she said and laughed. In Japan, she stayed with a host family and gave them one bottle."（原 "Before her trip to Japan, Amy went shopping. She bought new sunglasses, a pair of gold earrings and three bottles of perfume. At the airport, her suitcase was overweight, so she had to pay more money. \"Maybe I didn't need so much perfume,\" she said and laughed. In Japan, she gave one bottle to her host family."） |
| a2-u07-l03-q14 | passageZh | 中譯同步 | 改為 "去日本旅行之前，Amy 去購物。她買了一副新的太陽眼鏡、一對金耳環和三瓶香水。到了機場，她的行李箱超重，只好多付錢。她笑著說：「也許我不需要那麼多香水。」在日本，她住在寄宿家庭，還送了他們一瓶。"（原 "去日本旅行之前，Amy 去購物。她買了一副新的太陽眼鏡、一對金耳環和三瓶香水。到了機場，她的行李箱超重，只好多付錢。她笑著說：「也許我不需要那麼多香水。」到了日本，她送了一瓶給寄宿家庭。"） |
| a2-u07-l04-q12 | stemEn | 新規則：mcq 四選項同詞性（名詞），改題幹讓干擾項明顯不合 | 改為 "We're going swimming. Put on your ____."（原 "We're going swimming. Don't forget your ____."） |
| a2-u07-l04-q12 | stemZh | 題幹中譯同步 | 改為 "我們要去游泳了，穿上你的泳衣。"（原 "我們要去游泳，別忘了帶泳衣。"） |
| a2-u07-l04-q12 | options | 選項換成四個衣物名詞 | 改為 ["tights","raincoat","swimsuit","scarf"]（原 ["good-looking","dressed","swimsuit","tights"]） |
| a2-u07-l04-q12 | optionGlossZh | 選項釋義同步 | 改為 ["褲襪","雨衣","泳衣","圍巾"]（原 ["好看的","穿好衣服的","泳衣","褲襪"]） |
| a2-u07-l04-q14 | passageEn | 第②關：疑似：Kate "lent her an old swimming costume" 接著說 "You can keep it"——借出又說送給她，前後略矛盾；建議改 "Kate gave her an old swimming costume." 或把 lent 保留、刪掉 keep 那句。 | 改為 "Every Saturday, Nina goes swimming with her friends. Before she leaves, she puts her swimsuit, a towel and some make-up in her handbag. Last Saturday, she got dressed in a hurry and left her swimsuit at home. Her friend Kate gave her an old swimming costume."（原 "Every Saturday, Nina goes swimming with her friends. Before she leaves, she puts her swimsuit, a towel and some make-up in her handbag. Last Saturday, she got dressed in a hurry and left her swimsuit at home. Her friend Kate lent her an old swimming costume. \"You can keep it,\" Kate said."） |
| a2-u07-l04-q14 | passageZh | 中譯同步 | 改為 "每個星期六，Nina 都會和朋友去游泳。出門前，她會把泳衣、毛巾和一些化妝品放進手提包。上週六她匆忙穿好衣服，把泳衣忘在家裡了。她的朋友 Kate 給了她一件舊泳衣。"（原 "每個星期六，Nina 都會和朋友去游泳。出門前，她會把泳衣、毛巾和一些化妝品放進手提包。上週六她匆忙穿好衣服，把泳衣忘在家裡了。她的朋友 Kate 借給她一件舊泳衣。Kate 說：「妳就留著吧。」"） |
| a2-u07-l04-q14 | questions/1/questionZh | 短文改寫後題目同步 | 改為 "誰給了 Nina 一件泳衣？"（原 "誰借東西給 Nina？"） |
| a2-u07-l04-q16 | referenceEn/1 | 第②關：題目要「說說手提包裡放了什麼」，參考答案 "My mother's handbag is full of things." 沒說出放了什麼，不符題目要求；建議改例如 "My mother always has tissues and keys in her handbag." | 改為 "My mother always has keys and a mirror in her handbag."（原 "My mother's handbag is full of things."） |
| a2-u07-l04-q16 | rubricZh/1 | 第③關 FIX：要點寫死介系詞 | 改為 "可寫例如 in my handbag、inside my handbag；寫 My handbag has … 也正確"（原 "「放在包包裡」用 in（例如 in my handbag）"） |
| a2-u07-l04-q09 | audioEn | 第③關疑似：handbag 情境句與單字卡同樣提到鑰匙 | 改為 "I put my phone, my wallet and my make-up in my handbag."（原 "I put my phone, my keys and my make-up in my handbag."） |
| a2-u07-l04-q09 | audioZh | 中譯同步 | 改為 "我把手機、錢包和化妝品都放進手提包裡。"（原 "我把手機、鑰匙和化妝品都放進手提包裡。"） |
