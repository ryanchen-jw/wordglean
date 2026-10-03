# B2 b2c 第 2 批（b2-u41～b2-u44，35 課）三關修正對照表

依據：t9/b2c2-rulings.md（先前裁示 b2cd1、b2d2、b1b4、c1b2 等全部有效），撰寫準則讀 main 的 `content/prompts/claude-dev.authoring-guide.md`。

審查來源：
- 第②關：b2c2-gate2-a.json（17 條）、b2c2-gate2-b.json（13 條）。盲答 175 個題位，0 多解。
- 第③關：b2c2-gate3-a.md（FIX 27、疑似 17）、b2c2-gate3-b.md（FIX 36、疑似 15）。

基準 commit 是 `6476e1e`（送審時的 HEAD）。

## 做法摘要

1. **先 merge main**（`0128781`）：
   - `_runs` 帳本取兩邊聯集：本分支 532 課、main 904 課，重疊 452 課內容完全相同，聯集 984 課。
   - 其餘檔案沒有衝突。
2. **判題**：
   - 35 課寫入 judge（judgedBy claude-reviewer、reviewedAt 2026-10-03T01:00:00Z）。
   - verdicts 依「選項文字」從基準檔對應到現行索引；正解文字有改的題，verdict 指向現行正解。
   - 第②關 30 條 issue 全部在 resolvedAfterFinalReview 結案，每條都是「已修正」；judge.issues 清空。
3. **第③關 FIX 63 條全修**：
   - 照報告的「建議改法」，下表理由欄寫「第③關 A／B FIX #n」。
   - 照建議改了之後，又和同課其他題撞到的，再改一次。理由欄另寫「修正輪自查」，例如 bid、seal、uncommon、underestimate、u41-l03-q12。
4. **疑似照裁示處理**：
   - 放寬評分要點類照建議改：keen on、ignorant of、indifferent to。
   - 語感類逐條判斷，理由見下方「疑似處理」。
5. **裁示點名的項目**：
   - 情境雷同：flame、cope、hook、grasp、hybrid、proponent、怕上台、顧客不滿、當地人捐助、歌迷對樂團，全部改寫。
   - 單字卡第一義：slam、boost、crawl、chop、cone、upright、grip、devote。
   - mcq 形式線索：
     - 冠詞洩題：a ambiguous、a honorable。
     - 可數性洩題：ease、proponent。
     - 混合詞性題放得進空格的干擾項補足兩個：u41-l04、u42-l06、u43-l04、u43-l09、u44-l08。
     - 殘句正解：u43-l07、u43-l08、u43-l10。
     - 選項答不上問法：u44-l08-q10。
     - 正解中譯：extension、acute。
   - 內容界線：
     - exploit 改教「利用；開發」。
     - 改成中性情境：每日喝水量、睡眠影響心情、夜班身心健康、賣房時機、花自己沒有的錢。
     - u43-l01 predictor 去掉健康暗示，u43-l02 underestimate 去掉飲水量。
   - 閱讀與事實：
     - u41-l02「球員為什麼停下來」改成問「比賽進行到一半時發生了什麼事」。
     - u44-l05 因果句改寫。
     - up to half price 改成 up to half off。
   - 參考答案：主詞或時間不符的已改（u43-l06、u44-l03、u44-l07）；去掉 completely。
   - 中文用字：
     - muse 譯「默想」。
     - psychologically 改「心理上」，干擾項同步去「地」。
   - u41-l08 q10：干擾項 Put it in a folder 改成 Copy it two times。
6. **情境表**：
   - 加上「同課題目互比」。
   - 腳本比對主詞時，先展開縮寫（It's → it is），並把 kids 和 children 視為同一主詞。
   - 腳本另外標出 3 組同課題目主詞、句型都相同，處理如下：
     - u44-l07 q15↔q17：改 q17。
     - u26-l01 q11↔q18：改 q18，屬第 1 批，只動參考答案。
     - u28-l04 q15↔q16：維持，理由見下方。

## 疑似處理

| 疑似 | 處理 | 理由 |
|---|---|---|
| A1 submit 三題都是期限前繳交 | 改卡 | 照建議 |
| A2 bid 競標舊物 | 改卡 | 照建議改成投標後，又和 q13「公司承包工程」同類，再改成「城市爭取主辦音樂節」 |
| A3 sail 船往返島嶼 | 改聽打 | 照建議 |
| A4 seal 教海豹 | 改卡，教封口義 | 照建議的「檢查罐子封口」和 q11「檢查瓶子封口」同事件，改成「舊信用紅色封印封口」 |
| A5 plead 同句型 | 改閱讀 | 照建議 |
| A6 peel 削蔬果 | 改翻譯 | 改成「牆上舊油漆剝落」；沒用建議的撕海報，因為和 q13 撕貼紙同類 |
| A7 carve 參考答案 | 改 | 照建議 |
| A8 tolerate 忍受氣溫 | 改卡 | 語感判斷：卡和閱讀確實同為「忍受氣溫」 |
| A9 grip | 改 | 第②關也點名，照改 |
| A10 fixed 像動詞被動 | 改卡 | 語感判斷：原句確實讀成 fix 的被動 |
| A11 uncommon 出勤 | 改卡 | 照建議改藍玫瑰後，和 q12、閱讀同為「某地少見」；改成「現在手寫信很少見」 |
| A12 l05、l07 泥濘小路 | 改 l07 閱讀結尾 | 照建議 |
| A13 reflective 夜間安全 | 改造句的題目和參考答案 | 改問「看過哪些會反光的東西」 |
| A14 mock camp | 改成 a mock tent made of old sheets | 不改成 practice camp：閱讀需要保留 mock 的情境（聽選音檔不算情境） |
| A15 predictor 健康暗示 | 改卡 | 裁示點名 |
| A16 keen 要點 | 改 | 放寬評分要點類 |
| A17 rim 一眼排除 | 維持 | 更正（最終複審指出原理由有誤）：A23 改完後 rim 還在 l01、l05、l08 的混合詞性題；l01、l05 的 rim 放不進空格，是一眼可排除的那個。三題放得進空格的干擾項都還有 2 個，不違反 §11.26，所以維持 |
| B1 reckon 中譯 | 改 | 照建議 |
| B2 exaggeration 參考答案 | 改 | 照建議 |
| B3 unforeseen 同搭配 | 改卡 | 照建議 |
| B4 referent 詞性 | 維持名詞 | 形容詞 referent 在英文極少見，屬課綱層面，請執行長列課綱待議 |
| B5 至少…以上 | 改 | 照建議 |
| B6 hardly decisive | 換成 unaware | 照建議 |
| B7 generalize 樣本太少 | 改卡 | 屬同單元重複事件類型，改成「孩子從聽到的字歸納文法規則」；不用「外國人」例句，以免刻板印象 |
| B8 bully 第一義 | 改成「欺負；脅迫」，換例句 | 閱讀用的是霸凌義，學習者最常遇到的也是這一義 |
| B9 ignorant of、indifferent to | 改 | 放寬評分要點類 |
| B10 frantically 高興的狗 | 改 mcq | 照建議 |
| B11 console 說得通 | 改題幹 | 照建議 |
| B12 breathtaking 第一義 | 改卡 | 改教「令人屏息」；不用登高望遠的例句，以免和 l01 閱讀的山頂雷同 |
| B13 跨單元事件重複 | 不處理 | 規則只禁同單元 |
| B14 peacefully 國際關係句 | 維持 | 沒有點名國家，語意中性；本課 q10 已是貓睡覺，換成嬰兒睡覺反而接近 |
| B15 coincide 第一義 | 維持 | 審查員也判可維持 |
| u28-l04 q15↔q16（timing，同課互比） | 維持 | 第 1 批已定稿；兩題的事件不同（政策推出的時機、提問的時機），只有表層句型 The timing of… 相同 |

## 第 1 批連帶修正（第 1 批已定稿，以下都不影響原本的盲答）

- u28-l04-q14：執行長裁示 2。干擾項 medieval、supernatural 換成 physical、outdoor，這題要重新盲答。
- zh-guard 已加入豁免：
  - u25-l06 cursor 改回「游標」。
  - u26-l01 orchestra 改回「管弦樂團」。
- u26-l01-q18 參考答案和評分要點：同課題目互比時，和 q11 同為 I … the soundtrack of。

## 最終複審修正（2026-10-03，依 t9/b2c2-final.md）

- 9 條 FIX 全部照「具體改法」修，理由欄寫「第 2 批最終複審 FIX #n」：
  - #1 u42-l06 閱讀拿掉「司機穿寬鬆襯衫」。loosely 仍由單字卡和 q10 提供情境。
  - #2～#5 換卡或參考答案：underestimate 卡、clumsy 參考答案、folly 卡、unforeseen 卡。
  - #6 bid 釋義改成「爭取；出價；投標」。
  - #7、#8 改參考答案：straightforward、reflective。
  - #9 u44-l09-q14 的 nervously 換成 vigorously。
- 執行長加一處：u43-l10-q10 音檔改成 highly recommended。
  - q17 參考答案 1 原本是 highly recommendable。直接改成 highly recommended 的話，參考答案就沒有目標字了，所以改寫成 "The bakery near my school is recommendable for a quick breakfast."
- 報告「不擋的提醒」只修了不影響盲答的幾處：
  - grip 干擾項改成名詞。
  - glamorous、generalize 的釋義順序對齊例句。
  - u43-l06-q17、u41-l03-q16 的評分要點。
- 其餘提醒維持，都會動到短文：u41-l02 的 he、u44-l02 的 but still、u41-l03 q09／q15、u44-l07 q13、carve、u44 的車與慷慨、optimist／pessimist 卡。
- **本輪待重新盲答 3 題**：b2-u42-l06-q15、b2-u43-l10-q10、b2-u44-l09-q14。

## 待重新盲答

- 第 2 批（三關修正輪）：共 40 題，清單在同目錄 `b2c-batch2-reblind.txt`，已重新盲答一致。
  - 37 題改到選項、題幹、音檔、短文或小題題目的內容。
  - 3 題（b2-u43-l03-q10、b2-u43-l04-q10、b2-u43-l04-q15）只是 place-answers 重排了選項順序，保守列入。
- 第 2 批（最終複審輪）：3 題，清單 `b2c-batch2-reblind-final.txt`。
- 第 1 批：1 題，b2-u28-l04-q14。

## 逐欄位改動對照

本表由現行檔與基準 `6476e1e` 逐欄比對產生，answer 索引的變動不列。

| 題 id | 欄位 | 改前 | 改後 | 理由 |
|---|---|---|---|---|
| b2-u41-l02-q15 | passageEn | Last Saturday, our town's football team played its most important game of the year. Before the match, workers made a few adjustments to the old pitch and filled a long crack near one of the goals, and the mayor pitched a ball into the crowd for fun. In the middle of the game, a dog ran onto the field with its tail in the air, and the crowd exploded with laughter. Our goalkeeper, who was converted from a defender last year, saved two difficult shots. The team could not sustain its early lead, and the game ended in a draw. Some fans fled the rain before the end and missed the best moments. | Last Saturday, our town's football team played its most important game of the year. Before the match, workers upgraded the lights, made a few adjustments to the old pitch and filled a long crack near one of the goals, and the mayor pitched a ball into the crowd for fun. In the middle of the game, a dog ran onto the field with its tail in the air, and the crowd exploded with laughter. Last year, the coach converted our best defender into a goalkeeper, and today he saved two difficult shots. The team could not sustain its early lead, and the game ended in a draw. When heavy rain started, some fans fled to their cars and missed the best moments. | 第③關 A FIX #1；第②關 issue：小題前提「球員停下來」短文沒寫；第③關 A FIX #2：閱讀帶入前面單元的字 upgrade；第③關 A FIX #2；第②關 issue：converted from a defender 指人生硬；第②關 issue；第②關 issue：fled the rain 牽強；第②關 issue |
| b2-u41-l02-q15 | passageZh | 上週六，我們鎮上的足球隊踢了今年最重要的一場比賽。賽前，工人稍微整修了老球場，把一個球門附近的長裂縫補好，市長還好玩地把一顆球拋向觀眾。比賽進行到一半，一隻狗翹著尾巴跑進場內，全場觀眾大笑。我們的守門員去年才從後衛改過來，他擋下了兩記很難的射門。球隊沒能保住一開始的領先，比賽最後以平手收場。有些球迷在比賽結束前就躲雨離開，錯過了最精采的時刻。 | 上週六，我們鎮上的足球隊踢了今年最重要的一場比賽。賽前，工人升級了球場照明，稍微整修了老球場，把一個球門附近的長裂縫補好，市長還好玩地把一顆球拋向觀眾。比賽進行到一半，一隻狗翹著尾巴跑進場內，全場觀眾大笑。教練去年把我們最好的後衛改成守門員，他今天擋下了兩記很難的射門。球隊沒能保住一開始的領先，比賽最後以平手收場。下起大雨時，有些球迷逃回車上，錯過了最精采的時刻。 | 第③關 A FIX #1；第②關 issue：小題前提「球員停下來」短文沒寫；第③關 A FIX #2：閱讀帶入前面單元的字 upgrade；第③關 A FIX #2；第②關 issue：converted from a defender 指人生硬；第②關 issue；第②關 issue：fled the rain 牽強；第②關 issue |
| b2-u41-l02-q15 | questions/0/questionZh | 比賽中為什麼球員必須停下來？ | 比賽進行到一半時發生了什麼事？ | 第③關 A FIX #1；第②關 issue：小題前提「球員停下來」短文沒寫；第③關 A FIX #2：閱讀帶入前面單元的字 upgrade；第③關 A FIX #2；第②關 issue：converted from a defender 指人生硬；第②關 issue；第②關 issue：fled the rain 牽強；第②關 issue |
| b2-u41-l03-q01 | exampleEn | Photos submitted after Friday will not be accepted in the contest. | Visitors can submit their ideas for the new park on the city website. | 第③關 A 疑似 1（裁示照建議改）：卡、聽打、閱讀都是期限前繳交 |
| b2-u41-l03-q01 | exampleZh | 星期五以後提交的照片，比賽將不予受理。 | 民眾可以在市府網站上提出新公園的點子。 | 第③關 A 疑似 1（裁示照建議改）：卡、聽打、閱讀都是期限前繳交 |
| b2-u41-l03-q07 | exampleZh | 整個晚上都用來表演音樂和跳舞。 | 整個晚上都用在音樂和跳舞上。 | 第②關 issue：中譯多了「表演」 |
| b2-u41-l03-q12 | sentenceEn | A small blue flame appeared when I lit the stove. | A candle flame moved gently in the wind. | 第③關 A FIX #5：跟讀和閱讀同為瓦斯爐小火；第③關 A FIX #5；修正輪自查：照建議改成燭火後，和單字卡同為 The flame(s) of…，改句型 |
| b2-u41-l03-q12 | sentenceZh | 我點爐子的時候，冒出一小簇藍色的火焰。 | 燭火在風中輕輕搖動。 | 第③關 A FIX #5：跟讀和閱讀同為瓦斯爐小火；第③關 A FIX #5；修正輪自查：照建議改成燭火後，和單字卡同為 The flame(s) of…，改句型 |
| b2-u41-l03-q13 | options/3 | ease | crack | 第③關 A FIX #3：ease 不可數，a new ease 文法洩題；第③關 A FIX #4：正解中譯和題意不符 |
| b2-u41-l03-q13 | optionGlossZh/2 | 延期 | 擴建（部分） | 第③關 A FIX #3：ease 不可數，a new ease 文法洩題；第③關 A FIX #4：正解中譯和題意不符 |
| b2-u41-l03-q13 | optionGlossZh/3 | 輕鬆 | 裂縫 | 第③關 A FIX #3：ease 不可數，a new ease 文法洩題；第③關 A FIX #4：正解中譯和題意不符 |
| b2-u41-l03-q16 | promptZh | 她很難應付這麼大的壓力。 | 她搬到新城市後，很快就學會應付一個人的生活。 | 第③關 A FIX #6：翻譯和閱讀同為她應付不了壓力或課業；第 2 批最終複審提醒 8：不寫死 cope with |
| b2-u41-l03-q16 | referenceEn/0 | She finds it hard to cope with so much pressure. | After she moved to a new city, she soon learned to cope with living alone. | 第③關 A FIX #6：翻譯和閱讀同為她應付不了壓力或課業；第 2 批最終複審提醒 8：不寫死 cope with |
| b2-u41-l03-q16 | referenceEn/1 | It is difficult for her to cope with so much stress. | She quickly learned to cope with life on her own after moving to a new city. | 第③關 A FIX #6：翻譯和閱讀同為她應付不了壓力或課業；第 2 批最終複審提醒 8：不寫死 cope with |
| b2-u41-l03-q16 | rubricZh/0 | cope 後面接 with（例如 cope with pressure 等） | cope 的用法，例如 cope with living alone、cope on her own 等 | 第③關 A FIX #6：翻譯和閱讀同為她應付不了壓力或課業；第 2 批最終複審提醒 8：不寫死 cope with |
| b2-u41-l03-q16 | rubricZh/1 | 「很難」可寫，例如 finds it hard to、it is difficult for her to 等 | 時態合理（例如 moved、learned 等） | 第③關 A FIX #6：翻譯和閱讀同為她應付不了壓力或課業；第 2 批最終複審提醒 8：不寫死 cope with |
| b2-u41-l03-q16 | rubricZh/2 | 時態配合內容（例如 finds、found 等） | （刪除） | 第③關 A FIX #6：翻譯和閱讀同為她應付不了壓力或課業；第 2 批最終複審提醒 8：不寫死 cope with |
| b2-u41-l04-q05 | glossZh | 猛力關上；用力摔 | 用力摔；猛力關上 | 第③關 A FIX #7：第一義改成例句詞義 |
| b2-u41-l04-q14 | options/1 | sustained | coped | 第③關 A FIX #8：放得進空格的干擾項不足兩個 |
| b2-u41-l04-q14 | optionGlossZh/1 | 維持 | 應付 | 第③關 A FIX #8：放得進空格的干擾項不足兩個 |
| b2-u41-l04-q15 | passageEn | When Leo moved from Brazil to Taiwan, he found it hard to integrate into his new school. In the first week, some boys excluded him from their basketball games because he spoke little Chinese. Leo did not plead with them to let him play. Instead, he practiced alone every evening, running lap after lap around the court. One evening, he could feel someone's gaze on him: the school coach had been watching him practice. The coach invited him to join the team and liked his innovative way of passing the ball. Today, Leo's old jeans have a patch on one knee from all the falls, but he is one of the best players on the team. | When Leo moved from Brazil to Taiwan, he found it hard to integrate into his new school. In the first week, some boys excluded him from their basketball games because he spoke little Chinese. Leo did not plead for a chance to play. Instead, he practiced alone every evening, running lap after lap around the court. One evening, he could feel someone's gaze on him: the school coach had been watching him practice. The coach invited him to join the team and liked his innovative way of passing the ball. Today, Leo's old jeans have a patch on one knee from all the falls, but he is one of the best players on the team. | 第③關 A 疑似 5（裁示照建議改）：和 mcq 同為 plead with X to let him V；第③關 A 疑似 5（裁示照建議改） |
| b2-u41-l04-q15 | passageZh | Leo 從巴西搬到台灣時，很難融入新學校。第一週，有些男生不讓他一起打籃球，因為他不太會說中文。Leo 沒有去求他們讓他打。他反而每天晚上獨自練習，繞著球場跑了一圈又一圈。有一天晚上，他感覺到有人在看他：原來學校的教練一直在看他練球。教練邀請他加入校隊，也很欣賞他富有創意的傳球方式。如今，Leo 的舊牛仔褲因為常跌倒，膝蓋上多了一塊補丁，但他已經是隊上最好的球員之一。 | Leo 從巴西搬到台灣時，很難融入新學校。第一週，有些男生不讓他一起打籃球，因為他不太會說中文。Leo 沒有去求別人給他上場的機會。他反而每天晚上獨自練習，繞著球場跑了一圈又一圈。有一天晚上，他感覺到有人在看他：原來學校的教練一直在看他練球。教練邀請他加入校隊，也很欣賞他富有創意的傳球方式。如今，Leo 的舊牛仔褲因為常跌倒，膝蓋上多了一塊補丁，但他已經是隊上最好的球員之一。 | 第③關 A 疑似 5（裁示照建議改）：和 mcq 同為 plead with X to let him V；第③關 A 疑似 5（裁示照建議改） |
| b2-u41-l05-q04 | exampleEn | Winning the first game gave the team a big boost. | The town hopes the new festival will boost tourism. | 第③關 A FIX #9；第②關 issue：例句是名詞義、釋義是動詞義 |
| b2-u41-l05-q04 | exampleZh | 贏得第一場比賽給了球隊很大的鼓舞。 | 鎮上希望新的節慶能帶動觀光。 | 第③關 A FIX #9；第②關 issue：例句是名詞義、釋義是動詞義 |
| b2-u41-l05-q05 | exampleZh | 舊鞋在濕地板上容易打滑。 | 舊鞋在濕地板上會失去抓地力。 | 第②關 issue（裁示照報告改）：例句是名詞「抓地力」；第 2 批最終複審提醒 6：第一義改名詞後，干擾項也改成名詞 |
| b2-u41-l05-q05 | glossZh | 抓牢；握力；緊握 | 抓地力；握力；緊握 | 第②關 issue（裁示照報告改）：例句是名詞「抓地力」；第 2 批最終複審提醒 6：第一義改名詞後，干擾項也改成名詞 |
| b2-u41-l05-q05 | distractorsZh/0 | 鬆手 | 彈性 | 第②關 issue（裁示照報告改）：例句是名詞「抓地力」；第 2 批最終複審提醒 6：第一義改名詞後，干擾項也改成名詞 |
| b2-u41-l05-q05 | distractorsZh/1 | 滑倒 | 重量 | 第②關 issue（裁示照報告改）：例句是名詞「抓地力」；第 2 批最終複審提醒 6：第一義改名詞後，干擾項也改成名詞 |
| b2-u41-l05-q05 | distractorsZh/2 | 發抖 | 光澤 | 第②關 issue（裁示照報告改）：例句是名詞「抓地力」；第 2 批最終複審提醒 6：第一義改名詞後，干擾項也改成名詞 |
| b2-u41-l05-q09 | sentenceEn | Hang your wet towel on the hook behind the door. | The picture fell down because the hook on the wall was too weak. | 第③關 A FIX #10：聽打和閱讀同為把衣物掛在掛鉤上 |
| b2-u41-l05-q09 | sentenceZh | 把你的濕毛巾掛在門後的掛鉤上。 | 牆上的掛鉤不夠牢，畫掉了下來。 | 第③關 A FIX #10：聽打和閱讀同為把衣物掛在掛鉤上 |
| b2-u41-l05-q17 | referenceEn/1 | My uncle carves small animals out of wood. | We carved our names into the sand at the beach. | 第③關 A 疑似 7（裁示照建議改）：參考答案 2 和閱讀同為木雕小動物 |
| b2-u41-l05-q17 | rubricZh/1 | carve 的用法，例如 carve … out of wood、carve … into … 等 | carve 的用法，例如 carve … into a pumpkin、carve … into the sand 等 | 第③關 A 疑似 7（裁示照建議改）：參考答案 2 和閱讀同為木雕小動物 |
| b2-u41-l05-q17 | rubricZh/2 | 時態配合內容（例如 carved、carves 等） | 時態合理（例如 carved 等） | 第③關 A 疑似 7（裁示照建議改）：參考答案 2 和閱讀同為木雕小動物 |
| b2-u41-l06-q01 | exampleEn | The traffic was so heavy that cars were crawling along the highway. | A small insect crawled across my notebook. | 第③關 A FIX #11；第②關 issue：例句是緩慢移動、第一義是爬行 |
| b2-u41-l06-q01 | exampleZh | 車流量大到汽車在公路上只能緩慢前進。 | 一隻小蟲爬過我的筆記本。 | 第③關 A FIX #11；第②關 issue：例句是緩慢移動、第一義是爬行 |
| b2-u41-l06-q07 | glossZh | 切碎；砍 | 砍；劈；切碎 | 第③關 A FIX #12：第一義改成例句詞義 |
| b2-u41-l06-q15 | passageZh | 每個星期天，我和爸爸都會一起做晚餐。上週，他教我做馬鈴薯煎餅。首先，我削了馬鈴薯的皮，又切了兩顆洋蔥，他則把鍋子加熱。他能把煎餅拋得高高的再接住，每次都讓我笑出來。我還是嬰兒的弟弟爬進廚房看我們，我們家的貓一聞到食物的味道就下樓來了。爸爸還有個很有創意的點子：加一點起司。第一批煎餅幾分鐘內就從盤子上消失了。做菜是他工作以外最喜歡的嗜好。 | 每個星期天，我和爸爸都會一起做晚餐。上週，他教我做馬鈴薯煎餅。首先，我削了馬鈴薯的皮，又切了兩顆洋蔥，他則把鍋子加熱。他能把煎餅拋得高高的再接住，每次都讓我笑出來。還在學爬的弟弟爬進廚房看我們，我們家的貓一聞到食物的味道就下樓來了。爸爸還有個很有創意的點子：加一點起司。第一批煎餅幾分鐘內就從盤子上消失了。做菜是他工作以外最喜歡的嗜好。 | 第②關 issue：中文不順 |
| b2-u41-l06-q16 | promptZh | 請幫我把這些蘋果削皮。 | 牆上的舊油漆開始剝落了。 | 第③關 A 疑似 6（裁示照建議改）：翻譯削蘋果和閱讀削馬鈴薯同為削蔬果；改成油漆剝落（和 q13 撕貼紙也不同） |
| b2-u41-l06-q16 | referenceEn/0 | Please peel these apples for me. | The old paint on the wall is starting to peel. | 第③關 A 疑似 6（裁示照建議改）：翻譯削蘋果和閱讀削馬鈴薯同為削蔬果；改成油漆剝落（和 q13 撕貼紙也不同） |
| b2-u41-l06-q16 | referenceEn/1 | Could you peel these apples for me? | The old paint on the wall has begun to peel. | 第③關 A 疑似 6（裁示照建議改）：翻譯削蘋果和閱讀削馬鈴薯同為削蔬果；改成油漆剝落（和 q13 撕貼紙也不同） |
| b2-u41-l06-q16 | rubricZh/0 | 「削皮」可寫，例如 peel 等 | peel 的用法，例如 is starting to peel、has begun to peel 等 | 第③關 A 疑似 6（裁示照建議改）：翻譯削蘋果和閱讀削馬鈴薯同為削蔬果；改成油漆剝落（和 q13 撕貼紙也不同） |
| b2-u41-l06-q16 | rubricZh/1 | 請求句（例如 Please…、Could you…? 等） | 時態合理（例如 is starting、has begun 等） | 第③關 A 疑似 6（裁示照建議改）：翻譯削蘋果和閱讀削馬鈴薯同為削蔬果；改成油漆剝落（和 q13 撕貼紙也不同） |
| b2-u41-l07-q01 | exampleEn | We saw a seal sleeping on the rocks near the beach. | The old letter was closed with a red seal. | 第③關 A 疑似 4（裁示照建議改）：單元是常用動作，改教封口義；第③關 A 疑似 4（裁示照建議改）；修正輪自查：改成檢查罐子封口後和 q11 同事件，再改成信件封印 |
| b2-u41-l07-q01 | exampleZh | 我們看到一隻海豹在海灘附近的岩石上睡覺。 | 那封舊信用紅色的封印封口。 | 第③關 A 疑似 4（裁示照建議改）：單元是常用動作，改教封口義；第③關 A 疑似 4（裁示照建議改）；修正輪自查：改成檢查罐子封口後和 q11 同事件，再改成信件封印 |
| b2-u41-l07-q01 | glossZh | 海豹；封條；封口 | 封口；密封條；海豹 | 第③關 A 疑似 4（裁示照建議改）：單元是常用動作，改教封口義；第③關 A 疑似 4（裁示照建議改）；修正輪自查：改成檢查罐子封口後和 q11 同事件，再改成信件封印 |
| b2-u41-l07-q01 | distractorsZh/0 | 海豚 | 標籤 | 第③關 A 疑似 4（裁示照建議改）：單元是常用動作，改教封口義；第③關 A 疑似 4（裁示照建議改）；修正輪自查：改成檢查罐子封口後和 q11 同事件，再改成信件封印 |
| b2-u41-l07-q01 | distractorsZh/1 | 海龜 | 價格 | 第③關 A 疑似 4（裁示照建議改）：單元是常用動作，改教封口義；第③關 A 疑似 4（裁示照建議改）；修正輪自查：改成檢查罐子封口後和 q11 同事件，再改成信件封印 |
| b2-u41-l07-q01 | distractorsZh/2 | 海鷗 | 把手 | 第③關 A 疑似 4（裁示照建議改）：單元是常用動作，改教封口義；第③關 A 疑似 4（裁示照建議改）；修正輪自查：改成檢查罐子封口後和 q11 同事件，再改成信件封印 |
| b2-u41-l07-q03 | exampleEn | Three people bid for the old painting at the sale. | Several cities are bidding to host next year's music festival. | 第③關 A 疑似 2（裁示照建議改）：卡和閱讀同為競標舊物；第③關 A 疑似 2（裁示照建議改）；修正輪自查：改成投標後和 q13 公司承包工程同類，再改成爭取主辦；第 2 批最終複審 FIX #6：第一義改成例句的「爭取」 |
| b2-u41-l07-q03 | exampleZh | 有三個人在拍賣會上出價競買那幅舊畫。 | 有好幾個城市在爭取主辦明年的音樂節。 | 第③關 A 疑似 2（裁示照建議改）：卡和閱讀同為競標舊物；第③關 A 疑似 2（裁示照建議改）；修正輪自查：改成投標後和 q13 公司承包工程同類，再改成爭取主辦；第 2 批最終複審 FIX #6：第一義改成例句的「爭取」 |
| b2-u41-l07-q03 | glossZh | 出價；投標 | 爭取；出價；投標 | 第③關 A 疑似 2（裁示照建議改）：卡和閱讀同為競標舊物；第③關 A 疑似 2（裁示照建議改）；修正輪自查：改成投標後和 q13 公司承包工程同類，再改成爭取主辦；第 2 批最終複審 FIX #6：第一義改成例句的「爭取」 |
| b2-u41-l07-q03 | distractorsZh/0 | 退款 | 放棄 | 第③關 A 疑似 2（裁示照建議改）：卡和閱讀同為競標舊物；第③關 A 疑似 2（裁示照建議改）；修正輪自查：改成投標後和 q13 公司承包工程同類，再改成爭取主辦；第 2 批最終複審 FIX #6：第一義改成例句的「爭取」 |
| b2-u41-l07-q03 | distractorsZh/1 | 借錢 | 拒絕 | 第③關 A 疑似 2（裁示照建議改）：卡和閱讀同為競標舊物；第③關 A 疑似 2（裁示照建議改）；修正輪自查：改成投標後和 q13 公司承包工程同類，再改成爭取主辦；第 2 批最終複審 FIX #6：第一義改成例句的「爭取」 |
| b2-u41-l07-q03 | distractorsZh/2 | 打折 | 延後 | 第③關 A 疑似 2（裁示照建議改）：卡和閱讀同為競標舊物；第③關 A 疑似 2（裁示照建議改）；修正輪自查：改成投標後和 q13 公司承包工程同類，再改成爭取主辦；第 2 批最終複審 FIX #6：第一義改成例句的「爭取」 |
| b2-u41-l07-q09 | sentenceEn | The ferry sails to the island twice a day. | The children sailed their paper boats on the pond. | 第③關 A 疑似 3（裁示照建議改）：聽打和單字卡同為船往返島嶼 |
| b2-u41-l07-q09 | sentenceZh | 渡輪每天兩班開往那座島。 | 孩子們在池塘上放他們的紙船。 | 第③關 A 疑似 3（裁示照建議改）：聽打和單字卡同為船往返島嶼 |
| b2-u41-l07-q15 | passageEn | Last summer, my uncle undertook a big challenge: he sailed alone around Taiwan in his small boat. Before leaving, he checked that every food box had a tight seal, so sea water could not get in. Safety was always his top priority. On the third day, a strong wind came, but he had a good grasp of sailing and tackled the problem calmly. He used a small computer to manipulate the sails. When he returned to the harbor after two weeks, his friends slapped him on the back and cheered. Now he wants to bid for an old wooden boat that will be sold next month. | Last summer, my uncle undertook a big challenge: he sailed alone around Taiwan in his small boat. Before leaving, he checked that every food box had a tight seal, so sea water could not get in. Safety was always his top priority. On the third day, a strong wind came, but he knew the sea well and tackled the problem calmly. He had learned to manipulate the boat's controls with just one hand. When he returned to the harbor after two weeks, his friends slapped him on the back and cheered. Now he wants to bid for an old wooden boat that will be sold next month. | 第③關 A FIX #13：閱讀和 mcq 同為 a good grasp of X；第③關 A FIX #13；第②關 issue：manipulate the sails 搭配不自然；第②關 issue |
| b2-u41-l07-q15 | passageZh | 去年夏天，我叔叔接下了一項大挑戰：他獨自駕著小船繞台灣一圈。出發前，他確認每個食物盒都密封好，海水才進不去。安全一直是他的第一優先。第三天颳起了強風，但他很懂航海，冷靜地處理了問題。他用一台小電腦操控船帆。兩週後他回到港口時，朋友們拍拍他的背，為他歡呼。現在他想出價買下一艘下個月要拍賣的舊木船。 | 去年夏天，我叔叔接下了一項大挑戰：他獨自駕著小船繞台灣一圈。出發前，他確認每個食物盒都密封好，海水才進不去。安全一直是他的第一優先。第三天颳起了強風，但他很熟悉大海，冷靜地處理了問題。他早就學會只用一隻手操控船上的控制裝置。兩週後他回到港口時，朋友們拍拍他的背，為他歡呼。現在他想出價買下一艘下個月要拍賣的舊木船。 | 第③關 A FIX #13：閱讀和 mcq 同為 a good grasp of X；第③關 A FIX #13；第②關 issue：manipulate the sails 搭配不自然；第②關 issue |
| b2-u41-l08-q02 | exampleEn | Some plants can tolerate very cold weather. | My teacher does not tolerate talking during tests. | 第③關 A 疑似 8（語感類，判斷要改）：卡植物耐寒和閱讀社員受不了熱同為忍受氣溫 |
| b2-u41-l08-q02 | exampleZh | 有些植物能忍受非常寒冷的天氣。 | 我的老師不容許考試時講話。 | 第③關 A 疑似 8（語感類，判斷要改）：卡植物耐寒和閱讀社員受不了熱同為忍受氣溫 |
| b2-u41-l08-q06 | exampleEn | Some companies exploit young workers by paying them very little. | She exploited every chance to practice her English. | 第③關 A FIX #14：內容界線，教「利用；開發」不教「剝削」 |
| b2-u41-l08-q06 | exampleZh | 有些公司付很少的錢來剝削年輕員工。 | 她利用每一個機會練習英文。 | 第③關 A FIX #14：內容界線，教「利用；開發」不教「剝削」 |
| b2-u41-l08-q06 | glossZh | 剝削；利用；開發 | 利用；開發；剝削 | 第③關 A FIX #14：內容界線，教「利用；開發」不教「剝削」 |
| b2-u41-l08-q06 | distractorsZh/0 | 保護 | 浪費 | 第③關 A FIX #14：內容界線，教「利用；開發」不教「剝削」 |
| b2-u41-l08-q06 | distractorsZh/1 | 照顧 | 放棄 | 第③關 A FIX #14：內容界線，教「利用；開發」不教「剝削」 |
| b2-u41-l08-q06 | distractorsZh/2 | 尊重 | 拒絕 | 第③關 A FIX #14：內容界線，教「利用；開發」不教「剝削」 |
| b2-u41-l08-q10 | options/3 | Put it in a folder | Copy it two times | 第③關 A FIX #15；第②關 issue：干擾項也說得通，換成音檔沒說的動作 |
| b2-u42-l01-q02 | exampleEn | The shelves are fixed to the wall with strong screws. | The museum has fixed opening hours. | 第③關 A 疑似 10（語感類，判斷要改）：原例句像動詞 fix 的被動 |
| b2-u42-l01-q02 | exampleZh | 架子用堅固的螺絲固定在牆上。 | 那間博物館的開放時間是固定的。 | 第③關 A 疑似 10（語感類，判斷要改）：原例句像動詞 fix 的被動 |
| b2-u42-l02-q14 | optionGlossZh/2 | 無禮的 | 離譜的 | 第③關 A FIX #16：正解中譯和題意不符；第③關 A FIX #16 |
| b2-u42-l02-q14 | optionGlossZh/3 | 敏銳的 | 嚴重的；迫切的 | 第③關 A FIX #16：正解中譯和題意不符；第③關 A FIX #16 |
| b2-u42-l03-q05 | exampleEn | Pine cones fell from the trees onto the path. | Many party hats are shaped like cones. | 第③關 A FIX #17；第②關 issue：例句是松果、釋義第一義是圓錐 |
| b2-u42-l03-q05 | exampleZh | 松果從樹上掉到小路上。 | 很多派對帽都是圓錐形的。 | 第③關 A FIX #17；第②關 issue：例句是松果、釋義第一義是圓錐 |
| b2-u42-l04-q15 | passageEn | Last month, my sister took part in her first chess tournament. The rules were straightforward, but the games were tricky, especially against players with years of experience. In the final, she faced a formidable opponent who had won the tournament three times. She sat erect in her chair and planned every move finely, like a painter adding small details. The match lasted four hours, and she persisted even when she was tired. In the end, she lost, but she played nicely and the crowd clapped for her. Her coach says her style is varied, which makes her hard to predict. | Last month, my sister took part in her first chess tournament. The rules were straightforward, but the games were tricky, especially against players with years of experience. In the final, she faced a formidable opponent who had won the tournament three times. She sat erect in her chair and thought carefully about every move, like a painter adding small details. The match lasted four hours, and she persisted even when she was tired. In the end, she lost, but she played well, thanked her opponent nicely, and the crowd clapped for her. Her coach says her style is varied, which makes her hard to predict. | 第③關 A FIX #18；第②關 issue：finely 修飾 plan 不道地；第③關 A FIX #18；第②關 issue：played nicely 易讀成守規矩；第②關 issue |
| b2-u42-l04-q15 | passageZh | 上個月，我姊姊參加了她的第一場西洋棋比賽。規則很簡單，但對局很棘手，尤其是遇到經驗豐富的棋手時。決賽中，她碰上一位很難對付的對手，對方已經贏過三次冠軍。她在椅子上坐得挺直，細細地規劃每一步，就像畫家在畫小細節。比賽持續了四個小時，她即使累了也堅持下去。最後她輸了，但她下得很好，觀眾都為她鼓掌。她的教練說她的棋風多變，讓人很難預測。 | 上個月，我姊姊參加了她的第一場西洋棋比賽。規則很簡單，但對局很棘手，尤其是遇到經驗豐富的棋手時。決賽中，她碰上一位很難對付的對手，對方已經贏過三次冠軍。她在椅子上坐得挺直，仔細思考每一步，就像畫家在畫小細節。比賽持續了四個小時，她即使累了也堅持下去。最後她輸了，但她下得很好，還很有禮貌地向對手道謝，觀眾都為她鼓掌。她的教練說她的棋風多變，讓人很難預測。 | 第③關 A FIX #18；第②關 issue：finely 修飾 plan 不道地；第③關 A FIX #18；第②關 issue：played nicely 易讀成守規矩；第②關 issue |
| b2-u42-l04-q17 | referenceEn/0 | Getting to my office is straightforward: I take one bus. | My teacher gave us straightforward instructions for the homework. | 第 2 批最終複審 FIX #7：參考答案 1 和單字卡主詞、句型相同 |
| b2-u42-l04-q17 | rubricZh/2 | 時態配合內容（例如 are、is 等） | 時態配合內容（例如 gave、is 等） | 第 2 批最終複審 FIX #7：參考答案 1 和單字卡主詞、句型相同 |
| b2-u42-l05-q07 | exampleEn | It is uncommon for him to miss work. | Letters written by hand are uncommon these days. | 第③關 A 疑似 11（裁示照建議改）：同課兩張卡都和出勤有關；第③關 A 疑似 11（裁示照建議改）；修正輪自查：改成藍玫瑰後和 q12、閱讀同為「某地少見」；修正輪自查：Handwritten 無級距 |
| b2-u42-l05-q07 | exampleZh | 他很少缺勤。 | 現在手寫信很少見了。 | 第③關 A 疑似 11（裁示照建議改）：同課兩張卡都和出勤有關；第③關 A 疑似 11（裁示照建議改）；修正輪自查：改成藍玫瑰後和 q12、閱讀同為「某地少見」；修正輪自查：Handwritten 無級距 |
| b2-u42-l05-q10 | options/3 | Quick and easy | Very quick | 第③關 A FIX #19：正解多了音檔沒說的 easy；第③關 A FIX #19；修正輪自查：Very fast 低於其餘平均的一半，改 Very quick |
| b2-u42-l05-q16 | promptZh | 她的英文有了逐漸的進步。 | 她的英文逐漸進步了。 | 第③關 A FIX #20；第②關 issue：中文翻譯腔 |
| b2-u42-l06-q07 | exampleEn | He is an upright man who never tells lies. | Please put your seat in the upright position before landing. | 第③關 A FIX #21：照單元主題教直立義 |
| b2-u42-l06-q07 | exampleZh | 他是個從不說謊的正直的人。 | 降落前請把椅背豎直。 | 第③關 A FIX #21：照單元主題教直立義 |
| b2-u42-l06-q07 | glossZh | 正直的；直立的 | 直立的；豎直的；正直的 | 第③關 A FIX #21：照單元主題教直立義 |
| b2-u42-l06-q07 | distractorsZh/0 | 狡猾的 | 傾斜的 | 第③關 A FIX #21：照單元主題教直立義 |
| b2-u42-l06-q07 | distractorsZh/1 | 懶惰的 | 彎曲的 | 第③關 A FIX #21：照單元主題教直立義 |
| b2-u42-l06-q07 | distractorsZh/2 | 害羞的 | 平躺的 | 第③關 A FIX #21：照單元主題教直立義 |
| b2-u42-l06-q13 | stemEn | Our new ____ car uses both petrol and electricity. | This ____ class lets students join either in the room or online. | 第③關 A FIX #22：mcq 和閱讀同為油電車；第③關 A FIX #22；第③關 A FIX #22：upright 改教直立義；第③關 A FIX #22；修正輪自查：opencc 把「在線上」改寫 |
| b2-u42-l06-q13 | stemZh | 我們的新油電混合車同時使用汽油和電。 | 這門混合式課程讓學生可以選擇到教室或從網路上參加。 | 第③關 A FIX #22：mcq 和閱讀同為油電車；第③關 A FIX #22；第③關 A FIX #22：upright 改教直立義；第③關 A FIX #22；修正輪自查：opencc 把「在線上」改寫 |
| b2-u42-l06-q13 | optionGlossZh/1 | 混合的 | 混合式的 | 第③關 A FIX #22：mcq 和閱讀同為油電車；第③關 A FIX #22；第③關 A FIX #22：upright 改教直立義；第③關 A FIX #22；修正輪自查：opencc 把「在線上」改寫 |
| b2-u42-l06-q13 | optionGlossZh/2 | 正直的 | 直立的 | 第③關 A FIX #22：mcq 和閱讀同為油電車；第③關 A FIX #22；第③關 A FIX #22：upright 改教直立義；第③關 A FIX #22；修正輪自查：opencc 把「在線上」改寫 |
| b2-u42-l06-q14 | options/1 | rim | ease | 第③關 A FIX #23：放得進 some ____ 的干擾項不足；第③關 A FIX #23 |
| b2-u42-l06-q14 | options/2 | triangle | pursuit | 第③關 A FIX #23：放得進 some ____ 的干擾項不足；第③關 A FIX #23 |
| b2-u42-l06-q14 | optionGlossZh/1 | 邊緣 | 輕鬆 | 第③關 A FIX #23：放得進 some ____ 的干擾項不足；第③關 A FIX #23 |
| b2-u42-l06-q14 | optionGlossZh/2 | 三角形 | 追求 | 第③關 A FIX #23：放得進 some ____ 的干擾項不足；第③關 A FIX #23 |
| b2-u42-l06-q15 | passageEn | Morning traffic in our city used to be chaotic, with cars, scooters and buses all fighting for space. The old buses could not cope with so many riders. Last year, the city bought fifty hybrid buses that use both electricity and petrol. Each bus has reflective paint on its sides, so drivers can see it easily at night. Riders can bring their bikes on board, but they must keep them upright in a special corner, held loosely by a soft belt. The drivers seem happier too, and many riders now chat casually with them. Some people said the plan would fail, but the numbers show that traffic is moving faster. | Morning traffic in our city used to be chaotic, with cars, scooters and buses all fighting for space. The old buses could not cope with so many riders. Last year, the city bought fifty hybrid buses that use both electricity and petrol. Each bus has reflective paint on its sides, so drivers can see it easily at night. Riders can bring their bikes on board, but they must keep them upright in a special corner. The drivers seem happier too, and many riders now chat casually with them. Some people said the plan would fail, but the numbers show that traffic is moving faster. | 第②關 issue：腳踏車鬆鬆地固定不合常理；第②關 issue；第 2 批最終複審 FIX #1：和 q10 同為襯衫寬鬆；第 2 批最終複審 FIX #1 |
| b2-u42-l06-q15 | passageZh | 我們城市早上的交通以前很混亂，汽車、機車和公車都在搶空間。舊公車應付不了這麼多乘客。去年，市政府買了五十輛同時使用電和汽油的油電公車。每輛公車側面都塗了反光漆，駕駛在夜裡也能看得很清楚。乘客可以帶腳踏車上車，但必須把車直立放在一個特別的角落，用一條軟帶子鬆鬆地固定。司機們看起來也比較開心，現在很多乘客會隨意地和他們聊天。有些人說這個計畫會失敗，但數字顯示交通變得比較順暢了。 | 我們城市早上的交通以前很混亂，汽車、機車和公車都在搶空間。舊公車應付不了這麼多乘客。去年，市政府買了五十輛同時使用電和汽油的油電公車。每輛公車側面都塗了反光漆，駕駛在夜裡也能看得很清楚。乘客可以帶腳踏車上車，但必須把車直立放在一個特別的角落。司機們看起來也比較開心，現在很多乘客會隨意地和他們聊天。有些人說這個計畫會失敗，但數字顯示交通變得比較順暢了。 | 第②關 issue：腳踏車鬆鬆地固定不合常理；第②關 issue；第 2 批最終複審 FIX #1：和 q10 同為襯衫寬鬆；第 2 批最終複審 FIX #1 |
| b2-u42-l06-q17 | instructionZh | 用 reflective 造一個句子，說說你會在什麼時候或什麼東西上用到反光的設計。 | 用 reflective 造一個句子，說說你看過哪些會反光的東西。 | 第③關 A 疑似 13（裁示照建議改）：造句和閱讀同為夜間辨識安全，改問會反光的東西；第 2 批最終複審 FIX #8：參考答案 1 沒寫到「我」 |
| b2-u42-l06-q17 | referenceEn/0 | I wear a reflective jacket when I ride my bike at night. | I often see reflective windows on new office buildings. | 第③關 A 疑似 13（裁示照建議改）：造句和閱讀同為夜間辨識安全，改問會反光的東西；第 2 批最終複審 FIX #8：參考答案 1 沒寫到「我」 |
| b2-u42-l06-q17 | referenceEn/1 | My running shoes have reflective strips for safety. | My watch has a reflective face that shines in the sun. | 第③關 A 疑似 13（裁示照建議改）：造句和閱讀同為夜間辨識安全，改問會反光的東西；第 2 批最終複審 FIX #8：參考答案 1 沒寫到「我」 |
| b2-u42-l06-q17 | rubricZh/1 | reflective 的用法，例如 a reflective jacket、reflective strips 等 | reflective 的用法，例如 reflective windows、a reflective face 等 | 第③關 A 疑似 13（裁示照建議改）：造句和閱讀同為夜間辨識安全，改問會反光的東西；第 2 批最終複審 FIX #8：參考答案 1 沒寫到「我」 |
| b2-u42-l06-q17 | rubricZh/2 | 時態合理（例如 wear、have 等） | 時態合理（例如 see、has 等） | 第③關 A 疑似 13（裁示照建議改）：造句和閱讀同為夜間辨識安全，改問會反光的東西；第 2 批最終複審 FIX #8：參考答案 1 沒寫到「我」 |
| b2-u42-l07-q15 | passageEn | Last weekend, my family went camping in the hills. We had done a mock camp in our garden first, but putting up the tent still took three tries. We persisted and finally got it right. That night, we cooked rice on a small stove and told stories. The bug spray we brought was ineffective, so the insects bit us all night. In the morning, my brother screamed when he saw a snake near the tent, but our guide said it was harmless, and soon it moved away. Around noon, the weather turned foul, with strong wind and heavy rain. Our guide rightly decided that we should walk back early, and we reached the car just before the path became muddy. | Last weekend, my family went camping in the hills. We had practiced in our garden with a mock tent made of old sheets, but putting up the tent still took three tries. We persisted and finally got it right. That night, we cooked rice on a small stove and told stories. The bug spray we brought was ineffective, so the insects bit us all night. In the morning, my brother screamed when he saw a snake near the tent, but our guide said it was harmless, and soon it moved away. Around noon, the weather turned foul, with strong wind and heavy rain. Our guide rightly decided that we should walk back early, and we reached the car just before the storm got even worse. | 第③關 A 疑似 14（裁示照建議改）：mock camp 搭配少見，改成 a mock tent；第③關 A 疑似 14（裁示照建議改）；第③關 A 疑似 12（裁示照建議改）：和 l05 閱讀同為下雨小路泥濘；第③關 A 疑似 12（裁示照建議改） |
| b2-u42-l07-q15 | passageZh | 上週末，我們全家去山上露營。我們事先在自家院子裡模擬露營過，但帳篷還是試了三次才搭好。我們沒有放棄，最後終於搭好了。那天晚上，我們用小爐子煮飯、講故事。我們帶去的防蚊液沒有效，蟲子咬了我們一整晚。早上，我弟弟看到帳篷旁邊有一條蛇，嚇得尖叫，但嚮導說那條蛇無害，沒多久牠就自己離開了。中午左右，天氣變得很惡劣，颳起強風、下起大雨。嚮導決定我們應該提早走回去，這個決定很正確；我們在小路變泥濘之前就回到了車上。 | 上週末，我們全家去山上露營。我們事先在院子裡用舊床單搭了一頂假帳篷練習過，但帳篷還是試了三次才搭好。我們沒有放棄，最後終於搭好了。那天晚上，我們用小爐子煮飯、講故事。我們帶去的防蚊液沒有效，蟲子咬了我們一整晚。早上，我弟弟看到帳篷旁邊有一條蛇，嚇得尖叫，但嚮導說那條蛇無害，沒多久牠就自己離開了。中午左右，天氣變得很惡劣，颳起強風、下起大雨。嚮導決定我們應該提早走回去，這個決定很正確；我們在暴風雨變得更猛烈之前就回到了車上。 | 第③關 A 疑似 14（裁示照建議改）：mock camp 搭配少見，改成 a mock tent；第③關 A 疑似 14（裁示照建議改）；第③關 A 疑似 12（裁示照建議改）：和 l05 閱讀同為下雨小路泥濘；第③關 A 疑似 12（裁示照建議改） |
| b2-u42-l08-q04 | exampleEn | She wore a glamorous red dress to the dinner. | The new shopping mall looks glamorous at night. | 第③關 A FIX #24：卡和 l01 翻譯幾乎相同；第 2 批最終複審提醒 7：釋義順序對齊例句 |
| b2-u42-l08-q04 | exampleZh | 她穿了一件迷人的紅色洋裝去參加晚宴。 | 新購物中心晚上看起來光鮮亮麗。 | 第③關 A FIX #24：卡和 l01 翻譯幾乎相同；第 2 批最終複審提醒 7：釋義順序對齊例句 |
| b2-u42-l08-q04 | glossZh | 迷人的；光鮮亮麗的 | 光鮮亮麗的；迷人的 | 第③關 A FIX #24：卡和 l01 翻譯幾乎相同；第 2 批最終複審提醒 7：釋義順序對齊例句 |
| b2-u42-l08-q06 | exampleZh | 因為噪音，我昨晚睡得很差。 | 因為噪音，我那晚睡得很差。 | 第②關 issue：中譯多了「昨晚」 |
| b2-u42-l08-q15 | passageEn | Last spring, our class visited an old palace in the mountains that was once the most glamorous home in the area. The walls were covered in exquisite paintings of birds and flowers, and the guide showed us a wooden door that an artist had carved by hand long ago. To reach the top of the tower, we climbed twisted stairs with very narrow steps. One boy slipped and narrowly avoided falling, so after that we all held the rope. In the café, the coffee was lousy, but the view of the valley was wonderful. Before we left, many of us bought novelty pens shaped like the tower. | Last spring, our class visited an old palace in the mountains that was once the most glamorous home in the area. The walls were covered in exquisite paintings of birds and flowers, and the guide showed us a wooden door that an artist had carved by hand long ago. To reach the top of the tower, we climbed narrow stairs and passed a twisted old iron gate. One boy slipped and narrowly avoided falling, so after that we all held the rope. In the café, the coffee was lousy, but the view of the valley was wonderful. Before we left, many of us bought novelty pens shaped like the tower. | 第②關 issue：twisted stairs 易讀成變形的樓梯；第②關 issue |
| b2-u42-l08-q15 | passageZh | 去年春天，我們班去參觀山上的一座古老宮殿，它曾經是這一帶最豪華氣派的住所。牆上畫滿了精緻的花鳥畫，導覽員還帶我們看一扇很久以前由一位藝術家親手雕刻的木門。為了爬到塔頂，我們走上彎彎曲曲、階面很窄的樓梯。有個男生滑了一下，差點跌倒，所以之後大家都抓著繩子走。咖啡館的咖啡很難喝，但山谷的景色很美。離開前，很多人買了做成塔的形狀的造型筆。 | 去年春天，我們班去參觀山上的一座古老宮殿，它曾經是這一帶最豪華氣派的住所。牆上畫滿了精緻的花鳥畫，導覽員還帶我們看一扇很久以前由一位藝術家親手雕刻的木門。為了爬到塔頂，我們走上窄窄的樓梯，經過一扇扭曲變形的舊鐵門。有個男生滑了一下，差點跌倒，所以之後大家都抓著繩子走。咖啡館的咖啡很難喝，但山谷的景色很美。離開前，很多人買了做成塔的形狀的造型筆。 | 第②關 issue：twisted stairs 易讀成變形的樓梯；第②關 issue |
| b2-u43-l01-q07 | exampleEn | Good sleep is a strong predictor of good grades. | Past sales are a useful predictor of future sales. | 第②關 issue；第③關 A 疑似 15（裁示照建議改）：內容界線，睡眠與成績的健康暗示 |
| b2-u43-l01-q07 | exampleZh | 睡得好是成績好的一項有力指標。 | 過去的銷售數字是預測未來銷售的好指標。 | 第②關 issue；第③關 A 疑似 15（裁示照建議改）：內容界線，睡眠與成績的健康暗示 |
| b2-u43-l01-q16 | promptZh | 她一直都支持騎腳踏車上班。 | 我叔叔一直都支持騎腳踏車上班。 | 第③關 A FIX #25：翻譯和單字卡主詞、句型相同 |
| b2-u43-l01-q16 | referenceEn/0 | She has always been a proponent of cycling to work. | My uncle has always been a proponent of cycling to work. | 第③關 A FIX #25：翻譯和單字卡主詞、句型相同 |
| b2-u43-l01-q16 | referenceEn/1 | She has long been a proponent of riding a bike to work. | My uncle has long been a proponent of riding a bike to work. | 第③關 A FIX #25：翻譯和單字卡主詞、句型相同 |
| b2-u43-l02-q07 | exampleEn | Many people underestimate how much water they need each day. | Many visitors underestimate how cold the desert gets at night. | 第③關 A FIX #26；第②關 issue：內容界線，每日飲水量；第③關 A FIX #26；修正輪自查：改成小看小團隊後和閱讀小看隊長同事件，再改成低估箱子重量；第 2 批最終複審 FIX #2：和 u43-l08 overestimate 卡同為搬重箱估錯力氣 |
| b2-u43-l02-q07 | exampleZh | 很多人低估了自己每天需要喝多少水。 | 很多遊客低估了沙漠晚上會有多冷。 | 第③關 A FIX #26；第②關 issue：內容界線，每日飲水量；第③關 A FIX #26；修正輪自查：改成小看小團隊後和閱讀小看隊長同事件，再改成低估箱子重量；第 2 批最終複審 FIX #2：和 u43-l08 overestimate 卡同為搬重箱估錯力氣 |
| b2-u43-l02-q17 | rubricZh/1 | keen 的用法，例如 keen to visit、keen to start 等 | keen 的用法，例如 keen to visit、keen on photography 等 | 第③關 A 疑似 16（裁示照建議改）：評分要點補 keen on |
| b2-u43-l03-q10 | options/0 | The exam ended late | The concert is too far away | 配合同題修改 |
| b2-u43-l03-q10 | options/1 | The concert is too far away | It's on the day of a test | 配合同題修改 |
| b2-u43-l03-q10 | options/3 | It's on the day of a test | The exam ended late | 配合同題修改 |
| b2-u43-l03-q13 | options/0 | wit | anticipation | 第③關 B FIX #2：proponent 可數，放不進 some ____ |
| b2-u43-l03-q13 | options/1 | ambiguity | wit | 第③關 B FIX #2：proponent 可數，放不進 some ____ |
| b2-u43-l03-q13 | options/2 | anticipation | ambiguity | 第③關 B FIX #2：proponent 可數，放不進 some ____ |
| b2-u43-l03-q13 | options/3 | proponent | novelty | 第③關 B FIX #2：proponent 可數，放不進 some ____ |
| b2-u43-l03-q13 | optionGlossZh/0 | 機智 | 期待 | 第③關 B FIX #2：proponent 可數，放不進 some ____ |
| b2-u43-l03-q13 | optionGlossZh/1 | 模稜兩可 | 機智 | 第③關 B FIX #2：proponent 可數，放不進 some ____ |
| b2-u43-l03-q13 | optionGlossZh/2 | 期待 | 模稜兩可 | 第③關 B FIX #2：proponent 可數，放不進 some ____ |
| b2-u43-l03-q13 | optionGlossZh/3 | 支持者 | 新奇 | 第③關 B FIX #2：proponent 可數，放不進 some ____ |
| b2-u43-l03-q14 | options/0 | coherent | unaware | 第③關 B 疑似 6（裁示照建議改）：hardly decisive 只看英文不是完全不通 |
| b2-u43-l03-q14 | options/1 | decisive | coherent | 第③關 B 疑似 6（裁示照建議改）：hardly decisive 只看英文不是完全不通 |
| b2-u43-l03-q14 | optionGlossZh/0 | 條理清楚的 | 沒察覺的 | 第③關 B 疑似 6（裁示照建議改）：hardly decisive 只看英文不是完全不通 |
| b2-u43-l03-q14 | optionGlossZh/1 | 果斷的 | 條理清楚的 | 第③關 B 疑似 6（裁示照建議改）：hardly decisive 只看英文不是完全不通 |
| b2-u43-l03-q15 | passageEn | In our media class last month, we learned to read advertisements critically. Our teacher showed us an ad for a fruit drink with glamorous people on a beach. The words said "Full of natural fruit," but the drink was mostly sugar, so the ad was misleading. We also found ambiguity in the phrase "up to half price": only a few things were really that cheap. It is understandable that people believe ads, because they look so nice. By the end, we could discriminate between facts and opinions, and each of us wrote a short, coherent review of an ad. The lesson happened to coincide with a big sale in town, so we had plenty of examples. | In our media class last month, we learned to read advertisements critically. Our teacher showed us an ad for a fruit drink with glamorous people on a beach. The words said "Full of natural fruit," but the drink was mostly sugar, so the ad was misleading. We also found ambiguity in the phrase "up to half off": only a few things were really that cheap. It is understandable that people believe ads, because they look so nice. By the end, we could discriminate between facts and opinions, and each of us wrote a short, coherent review of an ad. The lesson happened to coincide with a big sale in town, so we had plenty of examples. | 第②關 issue（裁示）：up to half price 改 up to half off |
| b2-u43-l03-q15 | questions/0/options/1 | 價格比廣告寫的貴 | 飲料大多是糖 | 第②關 issue（裁示）：up to half price 改 up to half off |
| b2-u43-l03-q15 | questions/0/options/3 | 飲料大多是糖 | 價格比廣告寫的貴 | 第②關 issue（裁示）：up to half price 改 up to half off |
| b2-u43-l03-q15 | questions/1/options/0 | 上課期間鎮上剛好有大型特賣 | 每個學生都帶了雜誌 | 第②關 issue（裁示）：up to half price 改 up to half off |
| b2-u43-l03-q15 | questions/1/options/2 | 每個學生都帶了雜誌 | 上課期間鎮上剛好有大型特賣 | 第②關 issue（裁示）：up to half price 改 up to half off |
| b2-u43-l03-q17 | referenceEn/0 | I try to think critically about the news I see online. | I think critically about advice before I follow it. | 第③關 B FIX #1：參考答案和單字卡、閱讀情境雷同 |
| b2-u43-l03-q17 | referenceEn/1 | I look at my own photos critically before I post them. | I compare prices critically before I buy a new phone. | 第③關 B FIX #1：參考答案和單字卡、閱讀情境雷同 |
| b2-u43-l03-q17 | rubricZh/1 | critically 的用法，例如 think critically、look at something critically 等 | critically 的用法，例如 think critically about、compare … critically 等 | 第③關 B FIX #1：參考答案和單字卡、閱讀情境雷同 |
| b2-u43-l03-q17 | rubricZh/2 | 時態合理（例如 try、look 等） | 時態合理（例如 think、compare 等） | 第③關 B FIX #1：參考答案和單字卡、閱讀情境雷同 |
| b2-u43-l04-q03 | exampleEn | Lack of sleep can affect your mood negatively. | The rainy weather affected ice cream sales negatively. | 第③關 B FIX #5：內容界線，睡眠影響心情 |
| b2-u43-l04-q03 | exampleZh | 睡眠不足會對心情造成負面影響。 | 下雨天對冰淇淋的銷量造成負面影響。 | 第③關 B FIX #5：內容界線，睡眠影響心情 |
| b2-u43-l04-q06 | exampleEn | This is a proven way to save money. | Her cooking skills are proven; she has won three contests. | 第③關 B FIX #4：卡和 q14 同為 It/This is a proven＋名詞 |
| b2-u43-l04-q06 | exampleZh | 這是一個經過證實的省錢方法。 | 她的廚藝是經過證實的，她贏過三次比賽。 | 第③關 B FIX #4：卡和 q14 同為 It/This is a proven＋名詞 |
| b2-u43-l04-q10 | options/0 | They didn't expect the busy roads | They went to the wrong place first | 配合同題修改 |
| b2-u43-l04-q10 | options/1 | They went to the wrong place first | They didn't expect the busy roads | 配合同題修改 |
| b2-u43-l04-q14 | options/0 | ambiguous | puzzled | 第③關 B FIX #3：a ambiguous 冠詞洩題 |
| b2-u43-l04-q14 | options/1 | proven | sensible | 第③關 B FIX #3：a ambiguous 冠詞洩題 |
| b2-u43-l04-q14 | options/2 | puzzled | proven | 第③關 B FIX #3：a ambiguous 冠詞洩題 |
| b2-u43-l04-q14 | optionGlossZh/0 | 模稜兩可的 | 困惑的 | 第③關 B FIX #3：a ambiguous 冠詞洩題 |
| b2-u43-l04-q14 | optionGlossZh/1 | 已證實的 | 明智的 | 第③關 B FIX #3：a ambiguous 冠詞洩題 |
| b2-u43-l04-q14 | optionGlossZh/2 | 困惑的 | 已證實的 | 第③關 B FIX #3：a ambiguous 冠詞洩題 |
| b2-u43-l04-q15 | questions/0/options/0 | 一盆植物的音樂開得比較大聲 | 房間裡的陽光照得不平均 | 配合同題修改 |
| b2-u43-l04-q15 | questions/0/options/1 | 其中一盆忘了澆水 | 一盆植物的音樂開得比較大聲 | 配合同題修改 |
| b2-u43-l04-q15 | questions/0/options/2 | 房間裡的陽光照得不平均 | 其中一盆忘了澆水 | 配合同題修改 |
| b2-u43-l04-q15 | questions/1/options/0 | 海報上的圖片印反了 | 標題寫得模稜兩可 | 配合同題修改 |
| b2-u43-l04-q15 | questions/1/options/1 | 標題寫得模稜兩可 | 老師講錯了報告的重點 | 配合同題修改 |
| b2-u43-l04-q15 | questions/1/options/3 | 老師講錯了報告的重點 | 海報上的圖片印反了 | 配合同題修改 |
| b2-u43-l05-q01 | exampleZh | 你估計這台舊腳踏車值多少錢？ | 你覺得這台舊腳踏車值多少錢？ | 第③關 B 疑似 1（裁示照建議改）：中譯和第一義「認為」一致 |
| b2-u43-l05-q02 | glossZh | 沉思；冥想 | 沉思；默想；反覆思索 | 第②關 issue（裁示）：muse 譯「默想」，不用「冥想」 |
| b2-u43-l06-q07 | exampleEn | It is conceivable that cars will drive themselves in ten years. | We tried every conceivable way to fix the old printer. | 第③關 B FIX #6：卡和 q13 同為 It is conceivable that…will |
| b2-u43-l06-q07 | exampleZh | 十年內車子能自動駕駛，是可以想像的。 | 我們試了所有想得到的方法來修那台舊印表機。 | 第③關 B FIX #6：卡和 q13 同為 It is conceivable that…will |
| b2-u43-l06-q16 | referenceEn/0 | This book completely changed my worldview. | Reading this book changed my worldview. | 第③關 B FIX #7；第②關 issue：參考答案多加 completely；第③關 B FIX #7；修正輪自查：句長 5 字低於下限 |
| b2-u43-l06-q16 | rubricZh/0 | worldview 的用法，例如 changed my worldview、completely changed 等 | worldview 的用法，例如 changed my worldview、has changed my worldview 等 | 第③關 B FIX #7；第②關 issue：參考答案多加 completely；第③關 B FIX #7；修正輪自查：句長 5 字低於下限 |
| b2-u43-l06-q17 | referenceEn/0 | It took a lot of persuasion to get my friend to join the club. | It took me a lot of persuasion to get my friend to join the club. | 第③關 B FIX #8：參考答案沒寫出「我」；第 2 批最終複審提醒 8：時態例子對齊參考答案 |
| b2-u43-l06-q17 | referenceEn/1 | With a little persuasion, my brother agreed to wash the dishes. | With a little persuasion, I got my brother to wash the dishes. | 第③關 B FIX #8：參考答案沒寫出「我」；第 2 批最終複審提醒 8：時態例子對齊參考答案 |
| b2-u43-l06-q17 | rubricZh/2 | 時態合理（例如 took、agreed 等） | 時態合理（例如 took、got 等） | 第③關 B FIX #8：參考答案沒寫出「我」；第 2 批最終複審提醒 8：時態例子對齊參考答案 |
| b2-u43-l07-q02 | exampleEn | Scientists cannot generalize from such a small study. | Children learn to generalize grammar rules from the words they hear. | 第③關 B 疑似 7（同單元重複事件類型，判斷要改；不用「外國人」例句以免刻板印象）；第 2 批最終複審提醒 7：釋義順序對齊例句 |
| b2-u43-l07-q02 | exampleZh | 科學家不能從這麼小的研究得出一般的結論。 | 孩子會從聽到的字詞中歸納出文法規則。 | 第③關 B 疑似 7（同單元重複事件類型，判斷要改；不用「外國人」例句以免刻板印象）；第 2 批最終複審提醒 7：釋義順序對齊例句 |
| b2-u43-l07-q02 | glossZh | 概括；歸納出一般結論 | 歸納出一般結論；概括 | 第③關 B 疑似 7（同單元重複事件類型，判斷要改；不用「外國人」例句以免刻板印象）；第 2 批最終複審提醒 7：釋義順序對齊例句 |
| b2-u43-l07-q10 | options/3 | Quite heavy | It's just very heavy | 第③關 B FIX #10：只有正解是殘句 |
| b2-u43-l07-q13 | stemEn | An ____ always sees the bright side of things. | Even after losing ten games in a row, the coach remained an ____ about the season. | 第③關 B FIX #9：題幹是單字卡定義的換句話說 |
| b2-u43-l07-q13 | stemZh | 樂觀的人總是看到事情光明的一面。 | 即使連輸十場，教練對這一季仍然很樂觀。 | 第③關 B FIX #9：題幹是單字卡定義的換句話說 |
| b2-u43-l07-q15 | passageEn | At a family dinner last week, my uncle said that young people never read books anymore. My cousin, who is an optimist and a big reader, said that was an exaggeration. "You can't generalize from one or two teenagers," she told him. She then refuted his point with numbers from the library: more young people borrowed books this year than last year. My uncle smiled knowingly and admitted that it was just a harmless way to start a lively talk. He also said it was improbable that he could ever win an argument against her. | At a family dinner last week, my uncle said that young people never read books anymore. My cousin, who is an optimist and a big reader, said that was an exaggeration. "You can't generalize from one or two teenagers," she told him. She then refuted his point with numbers from the library: more young people borrowed books this year than last year. My uncle smiled knowingly and admitted that it was just a harmless way to start a lively conversation. He also said it was improbable that he could ever win an argument against her. | 第②關 issue：lively talk 不自然 |
| b2-u43-l07-q17 | referenceEn/0 | My friend said he waited a hundred years, which was an exaggeration. | My brother said he ate a whole cake, which was an exaggeration. | 第③關 B 疑似 2（裁示照建議改）：參考答案 1 和單字卡同為誇大等待 |
| b2-u43-l08-q01 | distractorsZh/2 | 正好地 | 準時地 | 第②關 issue：干擾項「正好地」不自然 |
| b2-u43-l08-q07 | exampleEn | It is unwise to leave your bike without a lock. | Shouting at the referee was an unwise move. | 第③關 B FIX #11：卡和 q12 同為 It is unwise (of me) to |
| b2-u43-l08-q07 | exampleZh | 腳踏車不上鎖就離開是不明智的。 | 對裁判大吼是不明智的舉動。 | 第③關 B FIX #11：卡和 q12 同為 It is unwise (of me) to |
| b2-u43-l08-q08 | exampleEn | Because of unforeseen problems, the new mall opened a month late. | Unforeseen circumstances forced the team to cancel today's match. | 第③關 B 疑似 3（裁示照建議改）：三處都是 because of unforeseen problem(s)；第 2 批最終複審 FIX #5：和 q13 同為意外狀況讓花費超出預期 |
| b2-u43-l08-q08 | exampleZh | 因為一些意料之外的問題，新商場晚了一個月才開幕。 | 意料之外的狀況迫使球隊取消了今天的比賽。 | 第③關 B 疑似 3（裁示照建議改）：三處都是 because of unforeseen problem(s)；第 2 批最終複審 FIX #5：和 q13 同為意外狀況讓花費超出預期 |
| b2-u43-l08-q10 | options/0 | Not as many as planned | Not as many people came as we planned | 第③關 B FIX #13：只有正解是殘句（"Fewer" 檢查器判無級距，改用 Not as many…） |
| b2-u43-l08-q17 | referenceEn/1 | We overestimated how much pizza we needed for the party. | I overestimated my free time and said yes to too many plans. | 第③關 B FIX #12：參考答案 2 和 q10 同為辦活動估錯數量 |
| b2-u43-l08-q17 | rubricZh/1 | overestimate 的用法，例如 overestimated how fast、overestimated how much 等 | overestimate 的用法，例如 overestimated how fast、overestimated my free time 等 | 第③關 B FIX #12：參考答案 2 和 q10 同為辦活動估錯數量 |
| b2-u43-l09-q01 | exampleEn | She obsesses over every small detail of her work. | He obsesses about what other people think of him. | 第③關 B FIX #14：卡和 q14 同為 obsess over small＋名詞 |
| b2-u43-l09-q01 | exampleZh | 她對工作上的每個小細節都過分在意。 | 他過分在意別人怎麼看他。 | 第③關 B FIX #14：卡和 q14 同為 obsess over small＋名詞 |
| b2-u43-l09-q14 | options/0 | refute | coincide | 第③關 B FIX #15：放得進空格的干擾項不足；第③關 B FIX #15 |
| b2-u43-l09-q14 | options/1 | deduce | discriminate | 第③關 B FIX #15：放得進空格的干擾項不足；第③關 B FIX #15 |
| b2-u43-l09-q14 | optionGlossZh/0 | 反駁 | 同時發生 | 第③關 B FIX #15：放得進空格的干擾項不足；第③關 B FIX #15 |
| b2-u43-l09-q14 | optionGlossZh/1 | 推斷 | 區別 | 第③關 B FIX #15：放得進空格的干擾項不足；第③關 B FIX #15 |
| b2-u43-l09-q15 | questions/0/options/0 | 每天至少練習三個小時以上 | 每天晚上至少練習三個小時 | 第③關 B 疑似 5（裁示照建議改）：「至少…以上」語意重複 |
| b2-u43-l10-q06 | exampleEn | Many people are mistrustful of online shops. | Our old dog is mistrustful of strangers at first. | 第③關 B FIX #17：卡和 q12 同為不信任網路上的東西 |
| b2-u43-l10-q06 | exampleZh | 很多人不信任網路商店。 | 我們家的老狗一開始對陌生人不太信任。 | 第③關 B FIX #17：卡和 q12 同為不信任網路上的東西 |
| b2-u43-l10-q08 | exampleEn | This hotel is highly recommendable for families. | Which of these two dictionaries is more recommendable for students? | 第③關 B FIX #16：卡和 q10 句型、情境相同 |
| b2-u43-l10-q08 | exampleZh | 這家飯店非常值得推薦給家庭旅客。 | 這兩本字典哪一本比較值得推薦給學生？ | 第③關 B FIX #16：卡和 q10 句型、情境相同 |
| b2-u43-l10-q10 | audioEn | The science museum downtown is very recommendable if you have young kids. | The science museum downtown is highly recommended if you have young kids. | 第②關 issue：very recommendable 不自然；第③關 B FIX #19：只有正解是殘句；執行長裁示：highly recommendable 改成道地的 highly recommended |
| b2-u43-l10-q10 | options/0 | Well worth a visit | It's a great place for families | 第②關 issue：very recommendable 不自然；第③關 B FIX #19：只有正解是殘句；執行長裁示：highly recommendable 改成道地的 highly recommended |
| b2-u43-l10-q14 | stemEn | We shouldn't ____ the new student before we get to know her. | The judges promised not to ____ any dancer before the dance was over. | 第③關 B FIX #18：mcq 和閱讀同為還沒認識就先評斷人 |
| b2-u43-l10-q14 | stemZh | 還沒認識那位新同學之前，我們不應該先對她下定論。 | 評審答應在舞跳完之前不先評斷任何一位舞者。 | 第③關 B FIX #18：mcq 和閱讀同為還沒認識就先評斷人 |
| b2-u43-l10-q17 | referenceEn/0 | The bakery near my school is very recommendable. | The bakery near my school is recommendable for a quick breakfast. | 第②關 issue：very recommendable 不自然；執行長裁示：參考答案的 highly recommendable 改掉；改成 highly recommended 會讓參考答案沒有目標字，所以改寫成 recommendable for |
| b2-u43-l10-q17 | rubricZh/1 | recommendable 的用法，例如 very recommendable、recommendable to 等 | recommendable 的用法，例如 recommendable for、recommendable to 等 | 第②關 issue：very recommendable 不自然；執行長裁示：參考答案的 highly recommendable 改掉；改成 highly recommended 會讓參考答案沒有目標字，所以改寫成 recommendable for |
| b2-u44-l01-q01 | exampleZh | 謝謝你的幫忙，請接受我真誠的感謝。 | 對於你的幫忙，請接受我誠摯的謝意。 | 第②關 issue：中譯謝謝、感謝重複 |
| b2-u44-l01-q14 | stemEn | Living alone on the small island, the fisherman sometimes felt a deep ____. | The night guard slowly got used to the ____ of his job. | 第③關 B FIX #20：mcq 和閱讀同為獨自生活的孤單、同句型 |
| b2-u44-l01-q14 | stemZh | 那位漁夫獨自住在小島上，有時會感到深深的孤單。 | 那位夜班警衛漸漸習慣了工作上的孤單。 | 第③關 B FIX #20：mcq 和閱讀同為獨自生活的孤單、同句型 |
| b2-u44-l02-q04 | exampleEn | You can't bully me into agreeing with you. | Big fish sometimes bully smaller fish in the tank. | 第③關 B 疑似 8（判斷要改）：學習者最常遇到、閱讀也用的是「欺負」義 |
| b2-u44-l02-q04 | exampleZh | 你別想逼我同意你。 | 魚缸裡的大魚有時會欺負小魚。 | 第③關 B 疑似 8（判斷要改）：學習者最常遇到、閱讀也用的是「欺負」義 |
| b2-u44-l02-q04 | glossZh | 脅迫；欺負 | 欺負；脅迫 | 第③關 B 疑似 8（判斷要改）：學習者最常遇到、閱讀也用的是「欺負」義 |
| b2-u44-l02-q06 | exampleEn | The kids eagerly opened their presents. | She eagerly accepted the invitation to the party. | 第③關 B FIX #21：卡和 q10 主詞、句型相同 |
| b2-u44-l02-q06 | exampleZh | 孩子們迫不及待地打開禮物。 | 她迫不及待地接受了派對的邀請。 | 第③關 B FIX #21：卡和 q10 主詞、句型相同 |
| b2-u44-l02-q15 | passageEn | Last year, a survey at our school showed a worrying result: one in five students said that someone had tried to bully them. Many teachers admitted that they had been ignorant of the problem. So the school started a "buddy" program, in which older students look after new ones. My buddy, a youthful-looking senior with a big smile, eagerly showed me around on my first day and sat with me at lunch. The goal of no bullying at all may not be fully achievable, but students say that the school feels much friendlier now. | Last year, a survey at our school showed a worrying result: one in five students said that someone had tried to bully them. Many teachers admitted that they had been ignorant of the problem. So the school started a "buddy" program, in which older students look after new ones. It is run by our art teacher, who is over sixty but still has a youthful energy. My buddy, a cheerful senior with a big smile, eagerly showed me around on my first day and sat with me at lunch. The goal of no bullying at all may not be fully achievable, but students say that the school feels much friendlier now. | 第②關 issue：youthful-looking 形容高年級生不自然；第②關 issue |
| b2-u44-l02-q15 | passageZh | 去年，我們學校的一項調查顯示了令人擔心的結果：每五個學生就有一個說曾有人想欺負他們。很多老師承認，他們之前並不知道有這個問題。於是學校開始了「學伴」計畫，由高年級生照顧新生。我的學伴是一位看起來很年輕、笑容燦爛的高年級生，第一天就熱心地帶我參觀學校，午餐時也陪我坐。完全沒有霸凌的目標也許無法百分之百達成，但學生們說，現在學校的氣氛友善多了。 | 去年，我們學校的一項調查顯示了令人擔心的結果：每五個學生就有一個說曾有人想欺負他們。很多老師承認，他們之前並不知道有這個問題。於是學校開始了「學伴」計畫，由高年級生照顧新生。負責的是我們的美術老師，她六十多歲了，卻還是充滿朝氣。我的學伴是一位開朗、笑容燦爛的高年級生，第一天就熱心地帶我參觀學校，午餐時也陪我坐。完全沒有霸凌的目標也許無法百分之百達成，但學生們說，現在學校的氣氛友善多了。 | 第②關 issue：youthful-looking 形容高年級生不自然；第②關 issue |
| b2-u44-l02-q16 | rubricZh/0 | ignorant 的用法，例如 ignorant about、ignorant when it comes to 等 | ignorant 的用法，例如 ignorant about、ignorant of、ignorant when it comes to 等 | 第③關 B 疑似 9（裁示照建議改）：評分要點補 ignorant of |
| b2-u44-l03-q07 | exampleEn | It's irresponsible to spend money you don't have. | He was too irresponsible to look after the class plants. | 第③關 B FIX #22：內容界線（理財判斷）＋卡和 q11 同句型 |
| b2-u44-l03-q07 | exampleZh | 花自己沒有的錢是不負責任的。 | 他太不負責任了，照顧不好班上的植物。 | 第③關 B FIX #22：內容界線（理財判斷）＋卡和 q11 同句型 |
| b2-u44-l03-q17 | referenceEn/1 | My dog adores going to the beach. | I adore old movies, especially funny ones. | 第③關 B FIX #23：參考答案 2 主詞是狗不是你 |
| b2-u44-l03-q17 | rubricZh/1 | adore 的用法，例如 adore someone's cooking、adores going 等 | adore 的用法，例如 adore someone's cooking、adore old movies 等 | 第③關 B FIX #23：參考答案 2 主詞是狗不是你 |
| b2-u44-l03-q17 | rubricZh/2 | 時態合理（例如 adore、adores 等） | 時態合理（例如 adore 等） | 第③關 B FIX #23：參考答案 2 主詞是狗不是你 |
| b2-u44-l04-q03 | exampleEn | He spent an idle afternoon reading comics. | We had a few idle minutes before the film, so we bought popcorn. | 第③關 B FIX #24：卡和閱讀同為 spend＋時間＋idle |
| b2-u44-l04-q03 | exampleZh | 他看著漫畫，悠閒地度過一個下午。 | 電影開始前我們有幾分鐘空檔，就去買了爆米花。 | 第③關 B FIX #24：卡和閱讀同為 spend＋時間＋idle |
| b2-u44-l04-q16 | rubricZh/0 | indifferent 的用法，例如 indifferent when it comes to、indifferent about 等 | indifferent 的用法，例如 indifferent to、indifferent about 等 | 第③關 B 疑似 9（裁示照建議改）：評分要點補 indifferent to；第③關 B 疑似 9；修正輪自查：要點超過 80 字 |
| b2-u44-l05-q14 | stemEn | When its owner came home, the dog ran ____ around the garden. | When it started to rain, people ran ____ to find shelter. | 第③關 B 疑似 10（裁示照建議改）：frantically 用在高興的狗身上語感偏驚慌 |
| b2-u44-l05-q14 | stemZh | 主人一回家，那隻狗就在院子裡瘋狂地跑來跑去。 | 開始下雨時，大家慌忙地跑去找地方躲雨。 | 第③關 B 疑似 10（裁示照建議改）：frantically 用在高興的狗身上語感偏驚慌 |
| b2-u44-l05-q15 | passageEn | Last summer, my friends and I went to a big theme park. We had overestimated how many rides we could do in one day, because the longest line was a real nuisance: we waited almost two hours for one ride. The ride itself was terrifying, and my friend Rina started to freak out before we even reached the top of the first hill. Afterwards, I realized my phone was gone, and I searched frantically under every seat. Amazingly, a worker had found it and kept it safe. Some visitors complained bitterly about the high food prices, and the park later sent a survey to measure their dissatisfaction. Still, the night show amazed everyone, and we all agreed the trip was worth it. | Last summer, my friends and I went to a big theme park. We had overestimated how many rides we could do in one day: the longest line was a real nuisance, and we waited almost two hours for one ride. The ride itself was terrifying, and my friend Rina started to freak out before we even reached the top of the first hill. Afterwards, I realized my phone was gone, and I searched frantically under every seat. Amazingly, a worker had found it and kept it safe. Some visitors complained bitterly about the high food prices, and the park later sent a survey to measure their dissatisfaction. Still, the night show amazed everyone, and we all agreed the trip was worth it. | 第②關 issue（裁示）：首句因果不通；第②關 issue |
| b2-u44-l05-q15 | passageZh | 去年夏天，我和朋友去了一座大型主題樂園。我們高估了一天能玩幾項設施，因為最長的隊伍真的很煩人：我們為了一項設施排了將近兩個小時。那項設施本身很恐怖，我朋友 Rina 還沒爬到第一個坡頂就嚇壞了。之後，我發現手機不見了，在每個座位底下拚命地找。令人驚訝的是，有位工作人員撿到了，還幫我保管好。有些遊客強烈抱怨食物太貴，樂園之後也寄了問卷，了解遊客有多不滿。不過，夜間表演讓大家都很驚嘆，我們都覺得這趟很值得。 | 去年夏天，我和朋友去了一座大型主題樂園。我們高估了一天能玩幾項設施：最長的隊伍真的很煩人，我們為了一項設施排了將近兩個小時。那項設施本身很恐怖，我朋友 Rina 還沒爬到第一個坡頂就嚇壞了。之後，我發現手機不見了，在每個座位底下拚命地找。令人驚訝的是，有位工作人員撿到了，還幫我保管好。有些遊客強烈抱怨食物太貴，樂園之後也寄了問卷，了解遊客有多不滿。不過，夜間表演讓大家都很驚嘆，我們都覺得這趟很值得。 | 第②關 issue（裁示）：首句因果不通；第②關 issue |
| b2-u44-l06-q03 | glossZh | 心理上地 | 心理上；從心理層面 | 第③關 B FIX #25；第②關 issue：「心理上地」不通順 |
| b2-u44-l06-q03 | distractorsZh/0 | 經濟上地 | 經濟上 | 第③關 B FIX #25；第②關 issue：「心理上地」不通順 |
| b2-u44-l06-q03 | distractorsZh/1 | 技術上地 | 技術上 | 第③關 B FIX #25；第②關 issue：「心理上地」不通順 |
| b2-u44-l06-q03 | distractorsZh/2 | 法律上地 | 法律上 | 第③關 B FIX #25；第②關 issue：「心理上地」不通順 |
| b2-u44-l06-q11 | sentenceEn | I'm dreading tomorrow's speech, but I know I'll be fine. | I'm dreading cleaning out the garage this weekend, but it has to be done. | 第③關 B FIX #28：和 l05 q09 同為怕上台演講 |
| b2-u44-l06-q11 | sentenceZh | 我很怕明天的演講，但我知道我會沒事的。 | 我很怕這個週末要清車庫，但還是得做。 | 第③關 B FIX #28：和 l05 q09 同為怕上台演講 |
| b2-u44-l06-q13 | stemEn | Running a restaurant is a ____ job with very long hours. | Looking after a newborn baby is ____; parents hardly get any sleep. | 第③關 B FIX #27：mcq 和閱讀同為餐飲店工作辛苦 |
| b2-u44-l06-q13 | stemZh | 經營餐廳是一份辛苦、工時又很長的工作。 | 照顧新生兒很累人，爸媽幾乎沒得睡。 | 第③關 B FIX #27：mcq 和閱讀同為餐飲店工作辛苦 |
| b2-u44-l06-q14 | stemEn | Working night shifts is hard, both physically and ____. | The coach prepares his players both physically and ____ for big games. | 第③關 B FIX #26：mcq 和閱讀同為工時長身心疲憊（內容界線：夜班身心健康）；第③關 B FIX #25 |
| b2-u44-l06-q14 | stemZh | 上夜班很辛苦，身體和心理都是。 | 教練在大賽前讓球員在身體和心理上都做好準備。 | 第③關 B FIX #26：mcq 和閱讀同為工時長身心疲憊（內容界線：夜班身心健康）；第③關 B FIX #25 |
| b2-u44-l06-q14 | optionGlossZh/1 | 心理上地 | 心理上 | 第③關 B FIX #26：mcq 和閱讀同為工時長身心疲憊（內容界線：夜班身心健康）；第③關 B FIX #25 |
| b2-u44-l07-q02 | exampleEn | It would be folly to sell the house now, when prices are so low. | It was folly to buy a white carpet with three dogs in the house. | 第③關 B FIX #29：內容界線（賣房時機）；第 2 批最終複審 FIX #4：和 q13 同為上山健行的愚蠢決定 |
| b2-u44-l07-q02 | exampleZh | 房價這麼低，現在把房子賣掉是愚蠢的。 | 家裡養了三隻狗還買白色地毯，真是愚蠢。 | 第③關 B FIX #29：內容界線（賣房時機）；第 2 批最終複審 FIX #4：和 q13 同為上山健行的愚蠢決定 |
| b2-u44-l07-q14 | stemEn | The comedian never tries to ____ people in the audience. | The comedian never tries to ____ people in the audience by making jokes about their looks. | 第③關 B 疑似 11（裁示照建議改）：console 只看英文也說得通 |
| b2-u44-l07-q14 | stemZh | 那位喜劇演員從不試圖讓觀眾難堪。 | 那位喜劇演員從不拿觀眾的外表開玩笑，讓他們難堪。 | 第③關 B 疑似 11（裁示照建議改）：console 只看英文也說得通 |
| b2-u44-l07-q17 | referenceEn/0 | I was so clumsy that I spilled coffee on my shirt. | I was clumsy with the scissors and cut the birthday card in the wrong place. | 第③關 B FIX #30：參考答案 2 寫習慣，題目要一次經驗；第③關 B FIX #30；同課題目互比：參考答案 1 和閱讀同為 I was so clumsy that；第 2 批最終複審 FIX #3：參考答案 1 和 q10 同為笨手摔掉東西 |
| b2-u44-l07-q17 | referenceEn/1 | I'm clumsy in the kitchen and often drop eggs. | I felt clumsy in my first dance class and kept stepping on my partner's feet. | 第③關 B FIX #30：參考答案 2 寫習慣，題目要一次經驗；第③關 B FIX #30；同課題目互比：參考答案 1 和閱讀同為 I was so clumsy that；第 2 批最終複審 FIX #3：參考答案 1 和 q10 同為笨手摔掉東西 |
| b2-u44-l07-q17 | rubricZh/1 | clumsy 的用法，例如 so clumsy that、clumsy in the kitchen 等 | clumsy 的用法，例如 clumsy with the scissors、felt clumsy in 等 | 第③關 B FIX #30：參考答案 2 寫習慣，題目要一次經驗；第③關 B FIX #30；同課題目互比：參考答案 1 和閱讀同為 I was so clumsy that；第 2 批最終複審 FIX #3：參考答案 1 和 q10 同為笨手摔掉東西 |
| b2-u44-l07-q17 | rubricZh/2 | 時態合理（例如 was、am 等） | 時態合理（例如 was、felt 等） | 第③關 B FIX #30：參考答案 2 寫習慣，題目要一次經驗；第③關 B FIX #30；同課題目互比：參考答案 1 和閱讀同為 I was so clumsy that；第 2 批最終複審 FIX #3：參考答案 1 和 q10 同為笨手摔掉東西 |
| b2-u44-l08-q04 | exampleEn | The dancers moved at breathtaking speed. | The colors of the sunset were breathtaking. | 第③關 B 疑似 12（判斷要改）：改教最常用的「令人屏息」；不用登高望遠，以免和 l01 閱讀山頂雷同 |
| b2-u44-l08-q04 | exampleZh | 那些舞者的動作快得驚人。 | 夕陽的顏色美得令人屏息。 | 第③關 B 疑似 12（判斷要改）：改教最常用的「令人屏息」；不用登高望遠，以免和 l01 閱讀山頂雷同 |
| b2-u44-l08-q04 | glossZh | 驚人的；令人屏息的 | 令人屏息的；驚人的 | 第③關 B 疑似 12（判斷要改）：改教最常用的「令人屏息」；不用登高望遠，以免和 l01 閱讀山頂雷同 |
| b2-u44-l08-q10 | questionZh | 阿姨的訊息讓說話者有什麼感覺？ | 說話者覺得阿姨的訊息怎麼樣？ | 第③關 B FIX #33：題目問「感覺」，干擾項都在描述訊息 |
| b2-u44-l08-q13 | stemEn | A baby's fear of falling seems ____; nobody has to teach it. | His love of order seems ____; even as a baby he lined up his toys. | 第③關 B FIX #32：mcq 和閱讀同為不用教的本能，且嬰兒怕跌落有爭議 |
| b2-u44-l08-q13 | stemZh | 嬰兒怕跌落似乎是天生的，不需要任何人教。 | 他愛整齊似乎是天生的，還是嬰兒時就會把玩具排成一排。 | 第③關 B FIX #32：mcq 和閱讀同為不用教的本能，且嬰兒怕跌落有爭議 |
| b2-u44-l08-q14 | options/2 | honorable | breathtaking | 第③關 B FIX #31：a honorable 冠詞洩題 |
| b2-u44-l08-q14 | optionGlossZh/2 | 正直的 | 令人屏息的 | 第③關 B FIX #31：a honorable 冠詞洩題 |
| b2-u44-l09-q06 | exampleEn | The fans were ecstatic about the new album. | We were ecstatic to see our old friend at the airport. | 第③關 B FIX #34：和 l08 卡同為歌迷對樂團 |
| b2-u44-l09-q06 | exampleZh | 歌迷們對新專輯欣喜若狂。 | 在機場見到老朋友，我們欣喜若狂。 | 第③關 B FIX #34：和 l08 卡同為歌迷對樂團 |
| b2-u44-l09-q13 | stemEn | ____ with the service, we asked to speak to the manager. | ____ with his old haircut, he tried a completely new style. | 第③關 B FIX #35：和 l05 同為顧客不滿服務 |
| b2-u44-l09-q13 | stemZh | 我們對服務不滿意，所以要求和經理談。 | 他對舊髮型不滿意，就試了一個全新的造型。 | 第③關 B FIX #35：和 l05 同為顧客不滿服務 |
| b2-u44-l09-q14 | stemEn | Local businesses ____ donated food for the festival. | My neighbor ____ lent us his car for the whole weekend and said we didn't need to pay. | 第③關 B FIX #36：和 l03 q14 同為當地人慷慨捐助；第 2 批最終複審 FIX #9：nervously 只看英文也說得通 |
| b2-u44-l09-q14 | stemZh | 當地商家慷慨地為節慶捐贈食物。 | 鄰居很大方地把車借我們開整個週末，還說不用付錢。 | 第③關 B FIX #36：和 l03 q14 同為當地人慷慨捐助；第 2 批最終複審 FIX #9：nervously 只看英文也說得通 |
| b2-u44-l09-q14 | options/2 | nervously | vigorously | 第③關 B FIX #36：和 l03 q14 同為當地人慷慨捐助；第 2 批最終複審 FIX #9：nervously 只看英文也說得通 |
| b2-u44-l09-q14 | optionGlossZh/2 | 緊張地 | 用力地 | 第③關 B FIX #36：和 l03 q14 同為當地人慷慨捐助；第 2 批最終複審 FIX #9：nervously 只看英文也說得通 |
