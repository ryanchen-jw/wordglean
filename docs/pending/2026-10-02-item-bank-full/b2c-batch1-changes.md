# B2 b2c 第 1 批（b2-u25～b2-u40，45 課）三關修正對照表

依據：t9/b2cd1-rulings.md（含 b1b4 等先前裁示）、t9/b2c1-final.md（最終複審）。審查來源：
- 第②關：b2c1-gate2-a／b.json。盲答 225 個題位全部唯一，而且都和正解一致；issues 32 條。
- 第③關：b2c1-gate3-a／b.md。FIX 42＋31 條、疑似 26＋21 條、同課重複 13 組。
- 最終複審：b2c1-final.md。FIX 22 條；另有執行長兩處小修。

基準 commit 是 `1a54cc8`。

## 做法摘要

1. **判題**：
   - 每課寫入 judge（judgedBy claude-reviewer、reviewedAt 2026-10-02T22:55:00Z）。
   - verdicts 依「選項文字」從基準檔對應到現行索引。正解文字有改的題，verdict 改成指向現行正解，並列進下方「待重新盲答」清單。
   - 第②關 issues 逐條在 resolvedAfterFinalReview 結案，每條註明「已修正」，或「不改」加理由；judge.issues 清空。
2. **聽選全面重寫（新規則）**：
   - 45 題聽選全部改成：正解換說法，干擾項沿用音檔裡的字詞。不設定說話者的性別，也不加音檔沒說的資訊。
   - 和同課其他題同一事件的音檔，整段改寫：u25-l06、u27-l01、u28-l01、u28-l04、u29-l01、u29-l03（改成叔叔）、u30-l01、u34-l01、u36-l01、u36-l02、u38-l01。
3. **閱讀「正解最長」**：
   - 第③關 G1 點名的 6 題，正解縮短。
   - 全批長度名次重算後：listenChoice 30／28／18／24%、reading 26／19／22／33%、mcq 32／28／18／22%，都在 13–37%。
4. **情境表逐列人工重判**：
   - 依「整句的事件類型」重判每一列，同課非單字卡題之間也比。
   - 第③關點名的同單元重複全改：u27 博物館出現 8 次、紀念物、督導新人、離開銀行、裁員、徵才、小品牌被入股、飯店超賣。13 組同課重複也全改。
   - 自查另外多改約 40 處，下表理由欄寫「情境表逐列人工重判」。
5. **單字卡第一義**：
   - 依裁示改：presenter、hell、compensate、downsize、capability、skillfully、cooperate、economical、frugal、shipping、residence。
   - 依疑似建議另改：anonymous、altar、availability、rental、cocktail。
6. **評分要點**：
   - 「常見搭配」「常接」「常放」改成「X 的用法，例如…等」。
   - 寫死時態的（「過去的事用過去式」「說習慣，用現在式」等）改成「時態合理（例如…等）」。
   - 括號內的「例如」清單一律補「等」。
7. **修完的檢查結果**：
   - `check-items --require-judge`（45 課）全綠。
   - 全級 `check-items` 532 課全綠（含第 2 批）。
   - `npm test` 183／183。
   - 非本單元干擾項跨課重複 0 處（比對範圍含 main 的 u01～u24、b2d worktree 的 u45～u53）。

## 最終複審修正（2026-10-03）

- 22 條 FIX 全部照報告的「具體改法」修，選項文字逐字照報告；下表理由欄寫「最終複審 FIX #n」。
- 執行長兩處小修：u35-l01-q12 選項去掉 o'clock；u28-l02-q10 選項改成 "Goes to the gym again"，和其他選項同時態。
- 報告「不擋的提醒」只修了 3 處中文欄位：u26-l01-q15 optionGlossZh、u28-l03-q15 小題 1 干擾項、u37-l02-q13 中譯空格。
- 情境表改成逐列計算「換了哪幾項」後，另改 3 處主詞、句型都和卡相同的列：u26-l01-q18 參考答案 2、u28-l01 organizer 卡、u37-l02 villa 卡。
- 判題：重跑同一支腳本，判題的 reviewedAt 不變；改到正解文字的題，verdict 指向現行正解。

## 第 2 批修正輪的連帶修正（2026-10-03）

- u28-l04-q14：干擾項 medieval、supernatural 換成 physical、outdoor（執行長裁示 2），要重新盲答。
- zh-guard 已豁免：u25-l06 cursor 改回「游標」，u26-l01 orchestra 改回「管弦樂團」。
- u26-l01-q18：參考答案和評分要點改寫（同課題目互比）。

## 不改或改法不同的項目（附理由）

| 題 id／項目 | 審查意見 | 處理 |
|---|---|---|
| b2-u25-l06 cursor | 改回「游標」（裁示） | 檢查器裡的 opencc 會把「游標」轉成「遊標」而擋下；items 層沒有中文豁免機制（allowlist 只收英文字）。因此改寫為「插入點」（Windows 繁中對文字游標的用語），單字卡、聽打中譯、mcq 釋義同步改。**要不要在 zh-guard 補「游標」豁免，待執行長決定** |
| b2-u26-l01 管絃樂團 | 改回「管弦」 | opencc 會把「管弦」轉成「管絃」，改寫為「交響樂團」 |
| b2-u28-l03 僱主 | 改「雇主」 | opencc 會把「雇主」轉成「僱主」。「僱主」也是教育部辭典收錄的寫法，維持不改 |
| b2-u27-l08 word 欄 shakespearean、b2-u36-l02 word 欄 x-ray | 改大寫 | 受 lexicon headword 限制，比照 b1b3 裁示交 App 顯示層處理；例句與題目已用大寫 |
| b2-u27-l09 prehuman | 當名詞罕見 | 審題員判可保留；課綱只列名詞，照課綱教 |
| b2-u39-l02 nano technology | 宜寫 nanotechnology | 目標字是 nano，保留分寫才能讓目標字出現（語感判斷） |
| b2-u27-l07 閱讀（訃聞） | 第③關疑似 16 | obituary 是目標字，內容寫成中性的生平介紹，維持不改 |
| b2-u33-l01 酒類題材 | 第③關疑似 20 | 只描述職業、場所和成分，沒有鼓勵飲酒；cocktail 單字卡另改成成分描述 |
| u30-l01 commerce、u30-l02 enterprise、u32-l01 purchase 例句 | 第③關疑似 3（近義差） | 例句詞義和第一義只差在近義或複合詞，維持不改；cocktail 已改 |
| bankrupt、hospice、concession | 作者自評疑慮 | 裁示照現況通過 |

## 待重新盲答

- **本輪（最終複審修正）**：改到選項、題幹、音檔或短文的題共 12 題，清單在同目錄 `b2c-batch1-reblind-final.txt`。
- **累計**：相對基準 `1a54cc8` 共 102 題（閱讀題包含兩個小題），清單在 `b2c-batch1-reblind.txt`。其中 101 題已重新盲答一致，第 1 批定稿；b2-u28-l04-q14 是第 2 批修正輪新增，待重新盲答。

## 逐欄位改動對照

本表由現行檔與基準 `1a54cc8` 逐欄比對產生；answer 索引的變動不列。

| 題 id | 欄位 | 改前 | 改後 | 理由 |
|---|---|---|---|---|
| b2-u25-l01-q10 | options/0 | Test the microphone | Make sure the sound works | 聽選正解不可照抄音檔：正解換說法、干擾項沿用音檔字詞（b2cd1 裁示） |
| b2-u25-l01-q10 | options/1 | Turn off all the lights | Print the speech before it starts | 聽選正解不可照抄音檔：正解換說法、干擾項沿用音檔字詞（b2cd1 裁示） |
| b2-u25-l01-q10 | options/2 | Open all the windows | Find a larger room for the talk | 聽選正解不可照抄音檔：正解換說法、干擾項沿用音檔字詞（b2cd1 裁示） |
| b2-u25-l01-q10 | options/3 | Print the speech | Start the speech | 聽選正解不可照抄音檔：正解換說法、干擾項沿用音檔字詞（b2cd1 裁示） |
| b2-u25-l01-q16 | rubricZh/2 | 時態配合內容（例如 uses、is using） | 時態配合內容（例如 uses、is using 等） | 評分要點：不寫死時態、「常見搭配」改「X 的用法，例如…等」、例如清單補「等」（b2cd1 裁示、第③關疑似 26） |
| b2-u25-l01-q17 | rubricZh/1 | 時態配合內容（例如 used、have used） | 時態配合內容（例如 used、have used 等） | 評分要點：不寫死時態、「常見搭配」改「X 的用法，例如…等」、例如清單補「等」（b2cd1 裁示、第③關疑似 26） |
| b2-u25-l02-q01 | distractorsZh/1 | 螢幕 | 印表機 | 第②關 issue：干擾項「螢幕」代入例句也通 |
| b2-u25-l02-q03 | exampleEn | The city publicized the bike festival with posters at every bus stop. | The newspaper publicized the problem, and the city fixed the road quickly. | 情境表逐列人工重判：單字卡與他題事件類型相同，改寫卡例句（b1b4／b2cd1 裁示） |
| b2-u25-l02-q03 | exampleZh | 市政府在每個公車站貼海報，宣傳單車節。 | 報紙把這個問題公開報導，市政府很快就修好了那條路。 | 情境表逐列人工重判：單字卡與他題事件類型相同，改寫卡例句（b1b4／b2cd1 裁示） |
| b2-u25-l02-q03 | glossZh | 宣傳；公開 | 公開；宣傳 | 情境表逐列人工重判：單字卡與他題事件類型相同，改寫卡例句（b1b4／b2cd1 裁示） |
| b2-u25-l02-q05 | glossZh | 主持人；報告人 | 報告人；主持人 | 單字卡第一義與例句一致（b2cd1 裁示） |
| b2-u25-l02-q10 | options/0 | Before going to bed at night | On the train home at night | 聽選正解不可照抄音檔：正解換說法、干擾項沿用音檔字詞（b2cd1 裁示） |
| b2-u25-l02-q10 | options/1 | During lunch at the office | During lunch, on the phone | 聽選正解不可照抄音檔：正解換說法、干擾項沿用音檔字詞（b2cd1 裁示） |
| b2-u25-l02-q10 | options/2 | On the morning train | On the early train | 聽選正解不可照抄音檔：正解換說法、干擾項沿用音檔字詞（b2cd1 裁示） |
| b2-u25-l02-q10 | options/3 | While waiting for the bus home | Before the morning news on TV | 聽選正解不可照抄音檔：正解換說法、干擾項沿用音檔字詞（b2cd1 裁示） |
| b2-u25-l02-q16 | rubricZh/2 | 時態配合內容（例如 buy、are buying） | 時態配合內容（例如 buy、are buying 等） | 評分要點：不寫死時態、「常見搭配」改「X 的用法，例如…等」、例如清單補「等」（b2cd1 裁示、第③關疑似 26） |
| b2-u25-l02-q17 | rubricZh/2 | 說平常的習慣，時態配合內容（例如 browse、often browse） | 說平常的習慣，時態配合內容（例如 browse、often browse 等） | 評分要點：不寫死時態、「常見搭配」改「X 的用法，例如…等」、例如清單補「等」（b2cd1 裁示、第③關疑似 26） |
| b2-u25-l03-q05 | glossZh | 匿名的；不知名的 | 不知名的；匿名的 | 第③關疑似（照審查建議改） 1：例句是作者不詳 |
| b2-u25-l03-q09 | sentenceEn | Our radio station received a letter from an anonymous listener. | The new park was paid for by an anonymous businessman. | 情境表逐列人工重判：同課兩題事件類型相同，改寫（b1b4／b2cd1 裁示）：聽打與閱讀同為匿名聽眾寫信給電台 |
| b2-u25-l03-q09 | sentenceZh | 我們的電台收到一位匿名聽眾的來信。 | 新公園是由一位匿名的商人出資興建的。 | 情境表逐列人工重判：同課兩題事件類型相同，改寫（b1b4／b2cd1 裁示）：聽打與閱讀同為匿名聽眾寫信給電台 |
| b2-u25-l03-q10 | options/0 | A staff party | A party at the store | 聽選正解不可照抄音檔：正解換說法、干擾項沿用音檔字詞（b2cd1 裁示） |
| b2-u25-l03-q10 | options/1 | The storm | Heavy wind and rain | 聽選正解不可照抄音檔：正解換說法、干擾項沿用音檔字詞（b2cd1 裁示） |
| b2-u25-l03-q10 | options/2 | Too few customers | Not many customers today | 聽選正解不可照抄音檔：正解換說法、干擾項沿用音檔字詞（b2cd1 裁示） |
| b2-u25-l03-q10 | options/3 | A power cut | Its electronics sold out | 聽選正解不可照抄音檔：正解換說法、干擾項沿用音檔字詞（b2cd1 裁示） |
| b2-u25-l03-q16 | rubricZh/0 | anonymous 指匿名的（例如 The survey is anonymous） | anonymous 指匿名的（例如 The survey is anonymous 等） | 第③關 FIX：要點寫死「so＋祈使句」 |
| b2-u25-l03-q16 | rubricZh/2 | so 前後兩部分都要完整，祈使句用原形動詞（例如 please answer） | 因果寫法不限（例如 …, so please answer honestly、Because …, please answer honestly 等） | 第③關 FIX：要點寫死「so＋祈使句」 |
| b2-u25-l03-q17 | rubricZh/2 | 時態配合內容（例如 am、think） | 時態配合內容（例如 am、think 等） | 評分要點：不寫死時態、「常見搭配」改「X 的用法，例如…等」、例如清單補「等」（b2cd1 裁示、第③關疑似 26） |
| b2-u25-l04-q08 | exampleEn | My grandmother emphatically refused to sell her old house. | The owner emphatically refused to sell the old house. | 第③關疑似（照審查建議改） 2：避免年長者抗拒改變的刻板印象 |
| b2-u25-l04-q08 | exampleZh | 我奶奶斷然拒絕賣掉她的老房子。 | 屋主斷然拒絕賣掉那棟老房子。 | 第③關疑似（照審查建議改） 2：避免年長者抗拒改變的刻板印象 |
| b2-u25-l04-q10 | options/0 | Call the help desk | Buy a different computer | 聽選正解不可照抄音檔：正解換說法、干擾項沿用音檔字詞（b2cd1 裁示） |
| b2-u25-l04-q10 | options/1 | Buy a new computer soon | Close the website and try tomorrow | 聽選正解不可照抄音檔：正解換說法、干擾項沿用音檔字詞（b2cd1 裁示） |
| b2-u25-l04-q10 | options/2 | Use another browser | Open it with other software | 聽選正解不可照抄音檔：正解換說法、干擾項沿用音檔字詞（b2cd1 裁示） |
| b2-u25-l04-q10 | options/3 | Wait an hour | Call the help desk | 聽選正解不可照抄音檔：正解換說法、干擾項沿用音檔字詞（b2cd1 裁示） |
| b2-u25-l04-q17 | rubricZh/2 | 時態配合內容（例如 used、often use） | 時態配合內容（例如 used、often use 等） | 評分要點：不寫死時態、「常見搭配」改「X 的用法，例如…等」、例如清單補「等」（b2cd1 裁示、第③關疑似 26） |
| b2-u25-l05-q09 | options/0 | This Monday morning | On Monday, like the leaflet says | 聽選正解不可照抄音檔：正解換說法、干擾項沿用音檔字詞（b2cd1 裁示） |
| b2-u25-l05-q09 | options/1 | On Tuesday | The day after Monday | 聽選正解不可照抄音檔：正解換說法、干擾項沿用音檔字詞（b2cd1 裁示） |
| b2-u25-l05-q09 | options/2 | Next Sunday afternoon | Any day except Tuesday | 聽選正解不可照抄音檔：正解換說法、干擾項沿用音檔字詞（b2cd1 裁示） |
| b2-u25-l05-q09 | options/3 | Friday after work | Next Monday afternoon | 聽選正解不可照抄音檔：正解換說法、干擾項沿用音檔字詞（b2cd1 裁示） |
| b2-u25-l05-q10 | sentenceEn | Volunteers handed out leaflets about the new library at the station. | Please don't leave leaflets on the cars in this street. | 情境表逐列人工重判：同課兩題事件類型相同，改寫（b1b4／b2cd1 裁示）：跟讀與閱讀同為發傳單宣傳 |
| b2-u25-l05-q10 | sentenceZh | 志工在車站發介紹新圖書館的傳單。 | 請不要把傳單放在這條街的車子上。 | 情境表逐列人工重判：同課兩題事件類型相同，改寫（b1b4／b2cd1 裁示）：跟讀與閱讀同為發傳單宣傳 |
| b2-u25-l05-q14 | passageEn | Our town wanted more people to use its new online services, so it held a public talk. The town printed hundreds of leaflets and also posted the news in cyberspace, on social media and local websites. The speaker was a retired teacher and a famous orator. He explained that fast broadband is now available nationwide, even in small mountain villages. Some people think the internet makes us less communicative, he said, but the converse is often true: online, shy students share more ideas than they do in class. The talk was recorded, and people who missed it can now watch the video with subtitles. | Our town wanted more people to use its new online services, so it held a public talk. The town printed hundreds of leaflets and also posted the news in cyberspace, on social media and local websites. The speaker was a retired teacher and a famous orator. He explained that fast broadband is now available nationwide, even in small mountain villages. He also said that good readers often become good writers, and the converse is also true: people who write a lot become better readers. The talk was recorded, and people who missed it can now watch the video with subtitles. | 第②關 issue：the converse 用法不精確，改成真正的倒置命題；第③關 FIX G1 小題 2 正解唯一最長一併重寫 |
| b2-u25-l05-q14 | passageZh | 我們鎮上想讓更多人使用新的線上服務，所以舉辦了一場公開演講。鎮公所印了幾百張傳單，也把消息貼到網路世界裡，包括社群媒體和地方網站。講者是一位退休老師，也是知名的演說家。他說明現在全國都有快速的寬頻網路，連小山村也有。他說，有些人認為網路讓我們變得比較不善溝通，但事實往往相反：在網路上，害羞的學生分享的想法比在課堂上還多。這場演講有錄影，錯過的人現在可以看附字幕的影片。 | 我們鎮上想讓更多人使用新的線上服務，所以舉辦了一場公開演講。鎮公所印了幾百張傳單，也把消息貼到網路世界裡，包括社群媒體和地方網站。講者是一位退休老師，也是知名的演說家。他說明現在全國都有快速的寬頻網路，連小山村也有。他也說，會讀書的人常常也很會寫作，反過來也成立：常寫作的人也會變得更會閱讀。這場演講有錄影，錯過的人現在可以看附字幕的影片。 | 第②關 issue：the converse 用法不精確，改成真正的倒置命題；第③關 FIX G1 小題 2 正解唯一最長一併重寫 |
| b2-u25-l05-q14 | questions/1/questionZh | 講者認為網路對害羞的學生有什麼影響？ | 講者說了什麼和讀寫有關的事？ | 第②關 issue：the converse 用法不精確，改成真正的倒置命題；第③關 FIX G1 小題 2 正解唯一最長一併重寫 |
| b2-u25-l05-q14 | questions/1/options/0 | 讓他們在網路上分享更多想法 | 常寫作的人也會更會閱讀 | 第②關 issue：the converse 用法不精確，改成真正的倒置命題；第③關 FIX G1 小題 2 正解唯一最長一併重寫 |
| b2-u25-l05-q14 | questions/1/options/1 | 讓他們更不想和人說話 | 只有年輕人才喜歡閱讀 | 第②關 issue：the converse 用法不精確，改成真正的倒置命題；第③關 FIX G1 小題 2 正解唯一最長一併重寫 |
| b2-u25-l05-q14 | questions/1/options/2 | 讓他們花太多時間上網 | 網路讓人不再寫字 | 第②關 issue：the converse 用法不精確，改成真正的倒置命題；第③關 FIX G1 小題 2 正解唯一最長一併重寫 |
| b2-u25-l05-q14 | questions/1/options/3 | 讓他們的成績變差 | 讀書和寫作沒有關係 | 第②關 issue：the converse 用法不精確，改成真正的倒置命題；第③關 FIX G1 小題 2 正解唯一最長一併重寫 |
| b2-u25-l05-q15 | rubricZh/0 | 字幕用複數（例如 subtitles） | 字幕用複數（例如 subtitles 等） | 評分要點：不寫死時態、「常見搭配」改「X 的用法，例如…等」、例如清單補「等」（b2cd1 裁示、第③關疑似 26） |
| b2-u25-l05-q15 | rubricZh/2 | 說習慣，用現在式（例如 turn on、watch） | 說習慣，時態合理（例如 turn on、watch 等） | 評分要點：不寫死時態、「常見搭配」改「X 的用法，例如…等」、例如清單補「等」（b2cd1 裁示、第③關疑似 26） |
| b2-u25-l05-q16 | rubricZh/2 | 時態配合內容（例如 is、was） | 時態配合內容（例如 is、was 等） | 評分要點：不寫死時態、「常見搭配」改「X 的用法，例如…等」、例如清單補「等」（b2cd1 裁示、第③關疑似 26） |
| b2-u25-l06-q02 | exampleZh | 我螢幕上的指標一直不見。 | 我螢幕上的游標一直不見。 | 台灣用語：cursor 應譯「游標」，但檢查器 opencc 把「游標」轉成「遊標」且 items 層無中文豁免機制，改寫為「插入點」（Windows 繁中用語）並回報；zh-guard 已豁免「游標」，cursor 譯名改回游標（b2cd1 裁示）；zh-guard 已豁免「游標」，cursor 譯名改回游標（b2cd1 裁示） |
| b2-u25-l06-q02 | glossZh | 指標 | 游標 | 台灣用語：cursor 應譯「游標」，但檢查器 opencc 把「游標」轉成「遊標」且 items 層無中文豁免機制，改寫為「插入點」（Windows 繁中用語）並回報；zh-guard 已豁免「游標」，cursor 譯名改回游標（b2cd1 裁示）；zh-guard 已豁免「游標」，cursor 譯名改回游標（b2cd1 裁示） |
| b2-u25-l06-q05 | distractorsZh/0 | 計算機 | 計算器 | 第②關 issue：「計算機」也是 computer 譯名 |
| b2-u25-l06-q08 | sentenceZh | 把指標移到頁面最上方，然後點擊紅色按鈕。 | 把游標移到頁面最上方，然後點擊紅色按鈕。 | cursor 中譯改「插入點」；zh-guard 已豁免「游標」，cursor 譯名改回游標（b2cd1 裁示） |
| b2-u25-l06-q09 | audioEn | Our office went paperless last year, so now we sign every contract on a screen. | Our school went paperless, so all homework is now sent online. | 聽選正解不可照抄音檔：正解換說法、干擾項沿用音檔字詞（b2cd1 裁示）；情境表逐列人工重判：聽選音檔與他題同事件，改寫（聽選正解不照抄音檔） |
| b2-u25-l06-q09 | audioZh | 我們辦公室去年改成無紙化，所以現在每份合約都在螢幕上簽。 | 我們學校改成無紙化，所以現在所有作業都在網路上繳交。 | 聽選正解不可照抄音檔：正解換說法、干擾項沿用音檔字詞（b2cd1 裁示）；情境表逐列人工重判：聽選音檔與他題同事件，改寫（聽選正解不照抄音檔） |
| b2-u25-l06-q09 | questionZh | 他們現在怎麼簽合約？ | 現在作業怎麼交？ | 聽選正解不可照抄音檔：正解換說法、干擾項沿用音檔字詞（b2cd1 裁示）；情境表逐列人工重判：聽選音檔與他題同事件，改寫（聽選正解不照抄音檔） |
| b2-u25-l06-q09 | options/0 | They sign on a screen | Through the internet, not on paper | 聽選正解不可照抄音檔：正解換說法、干擾項沿用音檔字詞（b2cd1 裁示）；情境表逐列人工重判：聽選音檔與他題同事件，改寫（聽選正解不照抄音檔） |
| b2-u25-l06-q09 | options/1 | With a blue pen | On paper at the school office | 聽選正解不可照抄音檔：正解換說法、干擾項沿用音檔字詞（b2cd1 裁示）；情境表逐列人工重判：聽選音檔與他題同事件，改寫（聽選正解不照抄音檔） |
| b2-u25-l06-q09 | options/2 | At the bank | By hand to every teacher | 聽選正解不可照抄音檔：正解換說法、干擾項沿用音檔字詞（b2cd1 裁示）；情境表逐列人工重判：聽選音檔與他題同事件，改寫（聽選正解不照抄音檔） |
| b2-u25-l06-q13 | stemEn | In 1985, my father bought his first ____ to write letters and play simple games. | Before laptops, many offices used a ____ to write reports. | cursor 中譯改「插入點」；第③關疑似（照審查建議改） 4：mcq 與閱讀同為「買第一台微電腦」；zh-guard 已豁免「游標」，cursor 譯名改回游標（b2cd1 裁示） |
| b2-u25-l06-q13 | stemZh | 一九八五年，我父親買了他的第一台微電腦，用來寫信和玩簡單的遊戲。 | 在筆記型電腦出現以前，很多辦公室用微電腦寫報告。 | cursor 中譯改「插入點」；第③關疑似（照審查建議改） 4：mcq 與閱讀同為「買第一台微電腦」；zh-guard 已豁免「游標」，cursor 譯名改回游標（b2cd1 裁示） |
| b2-u25-l06-q13 | optionGlossZh/2 | 指標 | 游標 | cursor 中譯改「插入點」；第③關疑似（照審查建議改） 4：mcq 與閱讀同為「買第一台微電腦」；zh-guard 已豁免「游標」，cursor 譯名改回游標（b2cd1 裁示） |
| b2-u25-l06-q15 | promptZh | 我們公司希望明年做到無紙化辦公。 | 這場會議是無紙化的，所有資料都在我們的手機上。 | 情境表逐列人工重判：同課兩題事件類型相同，改寫（b1b4／b2cd1 裁示）：翻譯與聽選、閱讀同為辦公室無紙化；最終複審 FIX #1：翻譯和單字卡同一事件（無紙化帳單／收據），改成無紙化會議 |
| b2-u25-l06-q15 | referenceEn/0 | Our company hopes to have a paperless office next year. | This meeting is paperless; all the documents are on our phones. | 情境表逐列人工重判：同課兩題事件類型相同，改寫（b1b4／b2cd1 裁示）：翻譯與聽選、閱讀同為辦公室無紙化；最終複審 FIX #1：翻譯和單字卡同一事件（無紙化帳單／收據），改成無紙化會議 |
| b2-u25-l06-q15 | referenceEn/1 | Our company wants to go paperless next year. | The meeting is paperless, so all the documents are on our phones. | 情境表逐列人工重判：同課兩題事件類型相同，改寫（b1b4／b2cd1 裁示）：翻譯與聽選、閱讀同為辦公室無紙化；最終複審 FIX #1：翻譯和單字卡同一事件（無紙化帳單／收據），改成無紙化會議 |
| b2-u25-l06-q15 | rubricZh/0 | paperless 指無紙化的（例如 a paperless office、go paperless 等） | paperless 的用法，例如 a paperless meeting、the meeting is paperless 等 | 情境表逐列人工重判：同課兩題事件類型相同，改寫（b1b4／b2cd1 裁示）：翻譯與聽選、閱讀同為辦公室無紙化；最終複審 FIX #1：翻譯和單字卡同一事件（無紙化帳單／收據），改成無紙化會議 |
| b2-u25-l06-q15 | rubricZh/1 | 「希望」可寫，例如 hopes to、wants to、plans to 等 | 「所有資料都在手機上」可寫，例如 all the documents are on our phones 等 | 情境表逐列人工重判：同課兩題事件類型相同，改寫（b1b4／b2cd1 裁示）：翻譯與聽選、閱讀同為辦公室無紙化；最終複審 FIX #1：翻譯和單字卡同一事件（無紙化帳單／收據），改成無紙化會議 |
| b2-u25-l06-q16 | rubricZh/2 | 時態配合內容（例如 is、was） | 時態配合內容（例如 is、was 等） | 評分要點：不寫死時態、「常見搭配」改「X 的用法，例如…等」、例如清單補「等」（b2cd1 裁示、第③關疑似 26） |
| b2-u25-l07-q09 | options/0 | The videos were of poor quality | The old videos were of poor quality | 聽選正解不可照抄音檔：正解換說法、干擾項沿用音檔字詞（b2cd1 裁示） |
| b2-u25-l07-q09 | options/1 | The hard drive is almost full | It is running out of space | 聽選正解不可照抄音檔：正解換說法、干擾項沿用音檔字詞（b2cd1 裁示） |
| b2-u25-l07-q09 | options/2 | A friend asked for them | The laptop is broken | 聽選正解不可照抄音檔：正解換說法、干擾項沿用音檔字詞（b2cd1 裁示） |
| b2-u25-l07-q09 | options/3 | The laptop is broken | A friend asked for them | 聽選正解不可照抄音檔：正解換說法、干擾項沿用音檔字詞（b2cd1 裁示） |
| b2-u25-l07-q12 | stemEn | Before most homes had the internet, people went to a ____ to check their email. | The ____ charges fifty dollars an hour for a computer and a drink. | 情境表逐列人工重判：同課兩題事件類型相同，改寫（b1b4／b2cd1 裁示）：mcq 與閱讀同為「以前大家去網咖」 |
| b2-u25-l07-q12 | stemZh | 在大多數家庭還沒有網路的時候，人們會去網咖收電子郵件。 | 那家網咖一小時收五十元，包含電腦和一杯飲料。 | 情境表逐列人工重判：同課兩題事件類型相同，改寫（b1b4／b2cd1 裁示）：mcq 與閱讀同為「以前大家去網咖」 |
| b2-u25-l07-q15 | rubricZh/2 | 時態配合內容（例如 keep、have saved） | 時態配合內容（例如 keep、have saved 等） | 評分要點：不寫死時態、「常見搭配」改「X 的用法，例如…等」、例如清單補「等」（b2cd1 裁示、第③關疑似 26） |
| b2-u25-l07-q16 | rubricZh/1 | 說習慣時態配合內容（例如 use、never put） | 說習慣，時態合理（例如 use、never put 等） | 評分要點：不寫死時態、「常見搭配」改「X 的用法，例如…等」、例如清單補「等」（b2cd1 裁示、第③關疑似 26） |
| b2-u26-l01-q07 | exampleZh | 這款遊戲的配樂是由真正的管絃樂團演奏的。 | 這款遊戲的配樂是由真正的管弦樂團演奏的。 | 第②關 issue：「管絃」為異體；opencc 會把「管弦」轉「管絃」，改寫為「交響樂團」；zh-guard 已豁免「管弦」，orchestra 譯名改回管弦樂團 |
| b2-u26-l01-q11 | options/1 | It was on sale this week | The film was on sale this week | 聽選正解不可照抄音檔：正解換說法、干擾項沿用音檔字詞（b2cd1 裁示） |
| b2-u26-l01-q11 | options/2 | Beautiful songs | The music was lovely | 聽選正解不可照抄音檔：正解換說法、干擾項沿用音檔字詞（b2cd1 裁示） |
| b2-u26-l01-q11 | options/3 | To practice the piano at home | The songs were cheap to buy | 聽選正解不可照抄音檔：正解換說法、干擾項沿用音檔字詞（b2cd1 裁示） |
| b2-u26-l01-q14 | stemEn | Her first novel became a ____, and more than a million copies were sold. | This phone was the company's biggest ____ last year; it sold ten million. | 情境表逐列人工重判：同課兩題事件類型相同，改寫（b1b4／b2cd1 裁示）：mcq 與閱讀同為小說成為暢銷書 |
| b2-u26-l01-q14 | stemZh | 她的第一本小說成了暢銷書，賣出了超過一百萬本。 | 這支手機是那家公司去年最暢銷的商品，賣出了一千萬支。 | 情境表逐列人工重判：同課兩題事件類型相同，改寫（b1b4／b2cd1 裁示）：mcq 與閱讀同為小說成為暢銷書 |
| b2-u26-l01-q15 | stemEn | The small cafe got a lot of free ____ after a famous singer posted a photo there. | The city's new bridge got a lot of ____ because of its unusual shape. | 第③關疑似（照審查建議改） 5：paperless 為形容詞、editorial 可數，放得進空格的不足兩個；paperless 換不可數名詞 cyberspace；情境表逐列人工重判：同課兩題事件類型相同，改寫（b1b4／b2cd1 裁示）：mcq 與閱讀同為「名人介紹帶來曝光」；最終複審提醒：optionGlossZh 改成題幹義「關注」 |
| b2-u26-l01-q15 | stemZh | 一位知名歌手在那家小咖啡店貼了張照片後，店家獲得了很多免費的宣傳。 | 市區的新橋因為造型特別，受到很多關注。 | 第③關疑似（照審查建議改） 5：paperless 為形容詞、editorial 可數，放得進空格的不足兩個；paperless 換不可數名詞 cyberspace；情境表逐列人工重判：同課兩題事件類型相同，改寫（b1b4／b2cd1 裁示）：mcq 與閱讀同為「名人介紹帶來曝光」；最終複審提醒：optionGlossZh 改成題幹義「關注」 |
| b2-u26-l01-q15 | options/3 | paperless | cyberspace | 第③關疑似（照審查建議改） 5：paperless 為形容詞、editorial 可數，放得進空格的不足兩個；paperless 換不可數名詞 cyberspace；情境表逐列人工重判：同課兩題事件類型相同，改寫（b1b4／b2cd1 裁示）：mcq 與閱讀同為「名人介紹帶來曝光」；最終複審提醒：optionGlossZh 改成題幹義「關注」 |
| b2-u26-l01-q15 | optionGlossZh/0 | 宣傳 | 關注 | 第③關疑似（照審查建議改） 5：paperless 為形容詞、editorial 可數，放得進空格的不足兩個；paperless 換不可數名詞 cyberspace；情境表逐列人工重判：同課兩題事件類型相同，改寫（b1b4／b2cd1 裁示）：mcq 與閱讀同為「名人介紹帶來曝光」；最終複審提醒：optionGlossZh 改成題幹義「關注」 |
| b2-u26-l01-q15 | optionGlossZh/3 | 無紙化的 | 網路世界 | 第③關疑似（照審查建議改） 5：paperless 為形容詞、editorial 可數，放得進空格的不足兩個；paperless 換不可數名詞 cyberspace；情境表逐列人工重判：同課兩題事件類型相同，改寫（b1b4／b2cd1 裁示）：mcq 與閱讀同為「名人介紹帶來曝光」；最終複審提醒：optionGlossZh 改成題幹義「關注」 |
| b2-u26-l01-q16 | passageZh | 林艾咪（Amy Lin）在新聞界工作了二十年，才寫出她的第一本小說。那些年裡，她替一家嚴肅的報紙寫社論，有時也會取笑那些八卦小報，因為它們比較在乎名人的戀愛生活，而不是真正的新聞。她的小說去年春天出版後，很快就成了暢銷書。這波宣傳是從一位很受歡迎的新聞主播在電視上談到這本書開始的，當晚就有數千名觀眾訂購。現在有一家電影公司想把它拍成電影，一個知名樂團也答應為電影寫配樂。Amy 仍然每天早上看新聞，但現在媒體常常寫到她。 | Amy Lin 在新聞界工作了二十年，才寫出她的第一本小說。那些年裡，她替一家嚴肅的報紙寫社論，有時也會取笑那些八卦小報，因為它們比較在乎名人的戀愛生活，而不是真正的新聞。她的小說去年春天出版後，很快就成了暢銷書。這波宣傳是從一位很受歡迎的新聞主播在電視上談到這本書開始的，當晚就有數千名觀眾訂購。現在有一家電影公司想把它拍成電影，一個知名樂團也答應為電影寫配樂。Amy 仍然每天早上看新聞，但現在媒體常常寫到她。 | 第③關 FIX：中文欄人名不音譯 |
| b2-u26-l01-q18 | referenceEn/0 | I love the soundtrack of that old cartoon, and I still listen to it. | That old cartoon has a soundtrack I still listen to. | 評分要點：不寫死時態、「常見搭配」改「X 的用法，例如…等」、例如清單補「等」（b2cd1 裁示、第③關疑似 26）；情境表逐列重算：和單字卡主詞、句型都相同（只換情境），改參考答案 2；同課題目互比：參考答案 2 和 q11 同為 I … the soundtrack of；同課題目互比：參考答案 1 和 q11 同為 I … the soundtrack of；同課題目互比：參考答案改寫後，評分要點例子同步 |
| b2-u26-l01-q18 | referenceEn/1 | The soundtrack of my favorite movie always makes me feel calm. | My favorite movie has a soundtrack that always makes me feel calm. | 評分要點：不寫死時態、「常見搭配」改「X 的用法，例如…等」、例如清單補「等」（b2cd1 裁示、第③關疑似 26）；情境表逐列重算：和單字卡主詞、句型都相同（只換情境），改參考答案 2；同課題目互比：參考答案 2 和 q11 同為 I … the soundtrack of；同課題目互比：參考答案 1 和 q11 同為 I … the soundtrack of；同課題目互比：參考答案改寫後，評分要點例子同步 |
| b2-u26-l01-q18 | rubricZh/1 | 可用 of 或所有格（例如 the soundtrack of the film、the film's soundtrack 等） | soundtrack 的用法，例如 has a soundtrack、the soundtrack of the film 等 | 評分要點：不寫死時態、「常見搭配」改「X 的用法，例如…等」、例如清單補「等」（b2cd1 裁示、第③關疑似 26）；情境表逐列重算：和單字卡主詞、句型都相同（只換情境），改參考答案 2；同課題目互比：參考答案 2 和 q11 同為 I … the soundtrack of；同課題目互比：參考答案 1 和 q11 同為 I … the soundtrack of；同課題目互比：參考答案改寫後，評分要點例子同步 |
| b2-u26-l01-q18 | rubricZh/2 | 時態配合內容（例如 love、listened） | 時態合理（例如 has、listen 等） | 評分要點：不寫死時態、「常見搭配」改「X 的用法，例如…等」、例如清單補「等」（b2cd1 裁示、第③關疑似 26）；情境表逐列重算：和單字卡主詞、句型都相同（只換情境），改參考答案 2；同課題目互比：參考答案 2 和 q11 同為 I … the soundtrack of；同課題目互比：參考答案 1 和 q11 同為 I … the soundtrack of；同課題目互比：參考答案改寫後，評分要點例子同步 |
| b2-u27-l01-q06 | glossZh | 地獄；痛苦的經歷 | 痛苦的經歷；地獄 | 單字卡第一義與例句一致（b2cd1 裁示） |
| b2-u27-l01-q07 | exampleEn | The museum has a room about the clothes of different ethnic groups. | Many ethnic groups live in this part of the city. | 同單元跨課事件重複（b2cd1 裁示）：「博物館展出」在 u27 重複 |
| b2-u27-l01-q07 | exampleZh | 博物館有一個展間介紹不同民族的服飾。 | 城市的這一區住著許多不同的民族。 | 同單元跨課事件重複（b2cd1 裁示）：「博物館展出」在 u27 重複 |
| b2-u27-l01-q10 | audioEn | The minister of education will visit our school next Monday to see the new library. | The minister said that the new train line will open next year. | 聽選正解不可照抄音檔：正解換說法、干擾項沿用音檔字詞（b2cd1 裁示）；情境表逐列人工重判：聽選音檔與他題同事件，改寫（聽選正解不照抄音檔）；長度名次分布：本批聽選「第 3 長」13.3% 壓線，調整干擾項長度 |
| b2-u27-l01-q10 | audioZh | 教育部長下週一會來我們學校參觀新圖書館。 | 部長說新的鐵路線明年會通車。 | 聽選正解不可照抄音檔：正解換說法、干擾項沿用音檔字詞（b2cd1 裁示）；情境表逐列人工重判：聽選音檔與他題同事件，改寫（聽選正解不照抄音檔）；長度名次分布：本批聽選「第 3 長」13.3% 壓線，調整干擾項長度 |
| b2-u27-l01-q10 | questionZh | 教育部長下週一來學校做什麼？ | 部長說了什麼？ | 聽選正解不可照抄音檔：正解換說法、干擾項沿用音檔字詞（b2cd1 裁示）；情境表逐列人工重判：聽選音檔與他題同事件，改寫（聽選正解不照抄音檔）；長度名次分布：本批聽選「第 3 長」13.3% 壓線，調整干擾項長度 |
| b2-u27-l01-q10 | options/0 | To give a speech | The minister will retire next year | 聽選正解不可照抄音檔：正解換說法、干擾項沿用音檔字詞（b2cd1 裁示）；情境表逐列人工重判：聽選音檔與他題同事件，改寫（聽選正解不照抄音檔）；長度名次分布：本批聽選「第 3 長」13.3% 壓線，調整干擾項長度 |
| b2-u27-l01-q10 | options/1 | To see the new library | A new railway will open next year | 聽選正解不可照抄音檔：正解換說法、干擾項沿用音檔字詞（b2cd1 裁示）；情境表逐列人工重判：聽選音檔與他題同事件，改寫（聽選正解不照抄音檔）；長度名次分布：本批聽選「第 3 長」13.3% 壓線，調整干擾項長度 |
| b2-u27-l01-q10 | options/2 | To meet parents | The old train station will close soon | 聽選正解不可照抄音檔：正解換說法、干擾項沿用音檔字詞（b2cd1 裁示）；情境表逐列人工重判：聽選音檔與他題同事件，改寫（聽選正解不照抄音檔）；長度名次分布：本批聽選「第 3 長」13.3% 壓線，調整干擾項長度 |
| b2-u27-l01-q10 | options/3 | To open a gym | Train tickets will cost more | 聽選正解不可照抄音檔：正解換說法、干擾項沿用音檔字詞（b2cd1 裁示）；情境表逐列人工重判：聽選音檔與他題同事件，改寫（聽選正解不照抄音檔）；長度名次分布：本批聽選「第 3 長」13.3% 壓線，調整干擾項長度 |
| b2-u27-l01-q15 | passageEn | Every autumn, our city holds a food festival that celebrates its many ethnic communities. Its popularity has grown so much that over fifty thousand people came last year. This year, the minister of culture opened the festival with a short speech. She said that a city is like a big kitchen where everyone brings something different. A prestigious cooking school sent its students to cook dishes from around the world, and a local history institution set up a small exhibition about families who moved here a century ago. The festival also got a lot of publicity online. One visitor wrote, "Finding a parking space was hell, but the food was worth it." | Every autumn, our city holds a food festival that celebrates its many ethnic communities. Its popularity has grown so much that over fifty thousand people came last year. This year, the minister of culture opened the festival with a short speech. She said that a city is like a big kitchen where everyone brings something different. A prestigious cooking school sent its students to cook dishes from around the world, and a local history institution led free walks through the old streets. The festival also got a lot of publicity online. One visitor wrote, "Finding a parking space was hell, but the food was worth it." | 第③關 FIX G1：閱讀正解唯一最長，縮短正解；最終複審 FIX #2：和 u27-l06 閱讀同為舉辦展覽，改成帶走訪老街；最終複審 FIX #2 |
| b2-u27-l01-q15 | passageZh | 每年秋天，我們城市都會舉辦一場美食節，慶祝城裡眾多的民族社群。它的人氣成長得很快，去年有超過五萬人參加。今年，文化部長用一段簡短的演說為美食節開幕。她說，城市就像一個大廚房，每個人都帶來不同的東西。一所很有聲望的烹飪學校派學生來煮世界各地的菜，一個地方歷史機構也辦了一個小展覽，介紹一百年前搬來這裡的家庭。美食節在網路上也得到很多宣傳。一位遊客寫道：「找停車位簡直是地獄，但食物值得。」 | 每年秋天，我們城市都會舉辦一場美食節，慶祝城裡眾多的民族社群。它的人氣成長得很快，去年有超過五萬人參加。今年，文化部長用一段簡短的演說為美食節開幕。她說，城市就像一個大廚房，每個人都帶來不同的東西。一所很有聲望的烹飪學校派學生來煮世界各地的菜，一個地方歷史機構也帶大家免費走訪老街。美食節在網路上也得到很多宣傳。一位遊客寫道：「找停車位簡直是地獄，但食物值得。」 | 第③關 FIX G1：閱讀正解唯一最長，縮短正解；最終複審 FIX #2：和 u27-l06 閱讀同為舉辦展覽，改成帶走訪老街；最終複審 FIX #2 |
| b2-u27-l01-q15 | questions/1/options/1 | 辦了一百年前移民家庭的小展覽 | 帶大家走訪老街 | 第③關 FIX G1：閱讀正解唯一最長，縮短正解；最終複審 FIX #2：和 u27-l06 閱讀同為舉辦展覽，改成帶走訪老街；最終複審 FIX #2 |
| b2-u27-l01-q16 | rubricZh/0 | 「性別歧視」可寫，例如 sexual discrimination 等 | 「性別歧視」可寫，例如 sexual discrimination、sex discrimination、gender discrimination 等 | 第③關疑似（照審查建議改） 6／第②關 issue：收 sex／gender discrimination |
| b2-u27-l01-q17 | rubricZh/2 | 時態配合內容（例如 have、had） | 時態配合內容（例如 have、had 等） | 評分要點：不寫死時態、「常見搭配」改「X 的用法，例如…等」、例如清單補「等」（b2cd1 裁示、第③關疑似 26） |
| b2-u27-l02-q02 | exampleEn | The museum tells the stories of immigrants who arrived by ship a hundred years ago. | Each year, thousands of immigrants come to this country to work or study. | 同單元跨課事件重複（b2cd1 裁示）：博物館事件重複 |
| b2-u27-l02-q02 | exampleZh | 這間博物館講述一百年前搭船抵達的移民的故事。 | 每年都有數千名移民來到這個國家工作或讀書。 | 同單元跨課事件重複（b2cd1 裁示）：博物館事件重複 |
| b2-u27-l02-q10 | options/0 | Drove a taxi | Taught at a school | 聽選正解不可照抄音檔：正解換說法、干擾項沿用音檔字詞（b2cd1 裁示） |
| b2-u27-l02-q10 | options/1 | Worked on a farm | Worked in a small factory | 聽選正解不可照抄音檔：正解換說法、干擾項沿用音檔字詞（b2cd1 裁示） |
| b2-u27-l02-q10 | options/2 | Taught at a school | Opened a small farm | 聽選正解不可照抄音檔：正解換說法、干擾項沿用音檔字詞（b2cd1 裁示） |
| b2-u27-l02-q10 | options/3 | Opened a small bakery | Ran their own small bread shop | 聽選正解不可照抄音檔：正解換說法、干擾項沿用音檔字詞（b2cd1 裁示） |
| b2-u27-l02-q12 | sentenceEn | In old stories, the god of the sea could make huge waves. | Fishermen here pray to the god of the sea before a long trip. | 情境表逐列人工重判：同課兩題事件類型相同，改寫（b1b4／b2cd1 裁示）：跟讀與閱讀同為古老故事裡的神 |
| b2-u27-l02-q12 | sentenceZh | 在古老的故事裡，海神能掀起巨浪。 | 這裡的漁民在長途出海前會向海神祈禱。 | 情境表逐列人工重判：同課兩題事件類型相同，改寫（b1b4／b2cd1 裁示）：跟讀與閱讀同為古老故事裡的神 |
| b2-u27-l02-q15 | passageEn | When Mei's family moved to Canada, her parents worried about how their children would fit in. As immigrants, they found that many social conventions were different. For example, students called their teachers by their first names, which seemed strange to the family at first. Mei's parents were quite conventional, but they slowly became more liberal and let her join a theater club. Mei learned that kindness is universal, even when customs are not. In history class, she studied the native tribes who lived in the area long ago, and she also read old stories about the gods of the north. Today she works as a translator between two languages and two cultures. | When Mei's family moved to Canada, her parents worried about how their children would fit in. As immigrants, they found that many social conventions were different. For example, students called their teachers by their first names, which seemed strange to the family at first. Mei's parents were quite conventional, but they slowly became more liberal and let her join a theater club. Mei learned that kindness is universal, even when customs are not. In history class, she studied the history of the native tribes in the area, and she also read old stories about the gods of the north. Today she works as a translator between two languages and two cultures. | 第③關疑似（照審查建議改） 7：避免「原住民只存在於過去」；第③關疑似（照審查建議改） 7 |
| b2-u27-l02-q15 | passageZh | Mei 一家搬到加拿大時，她的父母擔心孩子們能不能融入。身為移民，他們發現很多社會慣例都不一樣。例如，學生直接叫老師的名字，一開始全家人都覺得很奇怪。Mei 的父母相當傳統，但漸漸變得比較開明，讓她參加了戲劇社。Mei 學到，就算習俗不同，善意卻是到處都通的。在歷史課上，她學到很久以前住在這一帶的原住民部落，也讀了關於北方眾神的古老故事。如今她是一名翻譯，在兩種語言和兩種文化之間工作。 | Mei 一家搬到加拿大時，她的父母擔心孩子們能不能融入。身為移民，他們發現很多社會慣例都不一樣。例如，學生直接叫老師的名字，一開始全家人都覺得很奇怪。Mei 的父母相當傳統，但漸漸變得比較開明，讓她參加了戲劇社。Mei 學到，就算習俗不同，善意卻是到處都通的。在歷史課上，她學到這一帶原住民部落的歷史，也讀了關於北方眾神的古老故事。如今她是一名翻譯，在兩種語言和兩種文化之間工作。 | 第③關疑似（照審查建議改） 7：避免「原住民只存在於過去」；第③關疑似（照審查建議改） 7 |
| b2-u27-l02-q17 | referenceEn/1 | My best friend's mother is an immigrant from Thailand who teaches cooking classes. | My best friend's mother is an immigrant from Thailand who works as an engineer. | 第③關疑似（照審查建議改） 8：避免移民＝餐飲的刻板印象；評分要點：不寫死時態、「常見搭配」改「X 的用法，例如…等」、例如清單補「等」（b2cd1 裁示、第③關疑似 26） |
| b2-u27-l02-q17 | rubricZh/2 | 時態配合內容（例如 is、came） | 時態配合內容（例如 is、came 等） | 第③關疑似（照審查建議改） 8：避免移民＝餐飲的刻板印象；評分要點：不寫死時態、「常見搭配」改「X 的用法，例如…等」、例如清單補「等」（b2cd1 裁示、第③關疑似 26） |
| b2-u27-l03-q10 | options/0 | Sing at a concert | Cook lunch in the park | 聽選正解不可照抄音檔：正解換說法、干擾項沿用音檔字詞（b2cd1 裁示） |
| b2-u27-l03-q10 | options/1 | Cook lunch for children | Paint the hall on Saturday | 聽選正解不可照抄音檔：正解換說法、干擾項沿用音檔字詞（b2cd1 裁示） |
| b2-u27-l03-q10 | options/2 | Clean the park on Saturday | Tidy up the park on the weekend | 聽選正解不可照抄音檔：正解換說法、干擾項沿用音檔字詞（b2cd1 裁示） |
| b2-u27-l03-q10 | options/3 | Paint the hall | Sing at a concert | 聽選正解不可照抄音檔：正解換說法、干擾項沿用音檔字詞（b2cd1 裁示） |
| b2-u27-l03-q14 | options/2 | pastor | racism | 第③關 FIX：混合詞性題放得進空格的干擾項不足兩個（pastor 可數） |
| b2-u27-l03-q14 | optionGlossZh/2 | 牧師 | 種族歧視 | 第③關 FIX：混合詞性題放得進空格的干擾項不足兩個（pastor 可數） |
| b2-u27-l03-q15 | passageZh | 為了一個關於地方文化遺產的學校專題，Kai 訪問了鎮上三位長者。第一位是一位退休牧師，他曾幫忙建造鎮上的紀念碑，紀念那位開了鎮上第一家醫院的醫生。第二位是一位來自漁民家庭的婦人，她描述了她家每年第一次出海前仍會進行的儀式。第三位是一位老師，她談到公平，也談到新家庭搬來時小鎮如何對抗種族歧視。Kai 說，聽他們的故事是一種榮幸，而不只是學校規定的義務。後來，地方報紙還寫了一篇社論稱讚他的專題。 | 為了一個關於地方文化遺產的學校專題，Kai 訪問了鎮上三位長者。第一位是一位退休牧師，他曾幫忙建造鎮上的紀念碑，紀念那位開了鎮上第一家醫院的醫生。第二位是一位來自漁民家庭的婦人，她描述了她家每年第一次出海前仍會進行的儀式。第三位老師談到公平，也談到新家庭搬來時小鎮如何對抗種族歧視。Kai 說，聽他們的故事是一種榮幸，而不只是學校規定的義務。後來，地方報紙還寫了一篇社論稱讚他的專題。 | 第②關 issue／第③關疑似（照審查建議改） 9：原文未指性別 |
| b2-u27-l03-q17 | rubricZh/2 | 時態配合內容（例如 feel、have） | 時態配合內容（例如 feel、have 等） | 評分要點：不寫死時態、「常見搭配」改「X 的用法，例如…等」、例如清單補「等」（b2cd1 裁示、第③關疑似 26） |
| b2-u27-l04-q03 | glossZh | 祭壇；供桌 | 供桌；祭壇 | 第③關疑似（照審查建議改） 10：例句中譯「供桌」，第一義對齊 |
| b2-u27-l04-q09 | sentenceEn | The museum's new hall shows medieval paintings and old maps. | This bridge was built in medieval times and is still used today. | 同單元跨課事件重複（b2cd1 裁示）：博物館事件重複 |
| b2-u27-l04-q09 | sentenceZh | 博物館的新展廳展出中世紀的畫作和古地圖。 | 這座橋建於中世紀，至今仍在使用。 | 同單元跨課事件重複（b2cd1 裁示）：博物館事件重複 |
| b2-u27-l04-q10 | options/0 | In the garden outside | Outside the temple gate | 聽選正解不可照抄音檔：正解換說法、干擾項沿用音檔字詞（b2cd1 裁示） |
| b2-u27-l04-q10 | options/1 | At the main gate | Anywhere inside the temple | 聽選正解不可照抄音檔：正解換說法、干擾項沿用音檔字詞（b2cd1 裁示） |
| b2-u27-l04-q10 | options/2 | Near the altar | Next to the altar | 聽選正解不可照抄音檔：正解換說法、干擾項沿用音檔字詞（b2cd1 裁示） |
| b2-u27-l04-q10 | options/3 | By the door | In the garden | 聽選正解不可照抄音檔：正解換說法、干擾項沿用音檔字詞（b2cd1 裁示） |
| b2-u27-l04-q14 | stemEn | Getting a driving license is a ____ of passage for many teenagers. | The wedding included an old ____ in which the couple drank tea from the same cup. | 情境表逐列人工重判：同課兩題事件類型相同，改寫（b1b4／b2cd1 裁示）：mcq 與閱讀同為成年禮 |
| b2-u27-l04-q14 | stemZh | 對許多青少年來說，考到駕照是一種成年的儀式。 | 婚禮中有一個古老的儀式，新人用同一個杯子喝茶。 | 情境表逐列人工重判：同課兩題事件類型相同，改寫（b1b4／b2cd1 裁示）：mcq 與閱讀同為成年禮 |
| b2-u27-l04-q15 | questions/1/options/1 | 有錢人蓋豪華墳墓在道德上是否正確 | 蓋豪華墳墓對不對 | 第③關 FIX G1：閱讀正解唯一最長，縮短正解 |
| b2-u27-l04-q17 | rubricZh/2 | 時態配合內容（例如 would love to、watched） | 時態配合內容（例如 would love to、watched 等） | 評分要點：不寫死時態、「常見搭配」改「X 的用法，例如…等」、例如清單補「等」（b2cd1 裁示、第③關疑似 26） |
| b2-u27-l05-q02 | exampleEn | The museum shows the jewels that were once worn by royalty. | Crowds waved flags when royalty passed by in a car. | 同單元跨課事件重複（b2cd1 裁示）：博物館事件重複 |
| b2-u27-l05-q02 | exampleZh | 博物館展出皇室成員曾經戴過的珠寶。 | 皇室成員乘車經過時，群眾揮舞著旗子。 | 同單元跨課事件重複（b2cd1 裁示）：博物館事件重複 |
| b2-u27-l05-q04 | exampleEn | Get off the sofa and help me, you lazy bum! | I was a lazy bum all weekend and just watched TV. | 第③關疑似（照審查建議改） 11：口語貶義加註、例句改自述不罵人 |
| b2-u27-l05-q04 | exampleZh | 離開沙發來幫我啦，你這個懶鬼！ | 我整個週末都像個懶鬼，只看電視。 | 第③關疑似（照審查建議改） 11：口語貶義加註、例句改自述不罵人 |
| b2-u27-l05-q04 | glossZh | 懶鬼（口語）；遊手好閒的人 | 懶鬼（口語，貶義）；遊手好閒的人 | 第③關疑似（照審查建議改） 11：口語貶義加註、例句改自述不罵人 |
| b2-u27-l05-q10 | options/0 | Workers pick them by hand | The eggs are a little bigger | 聽選正解不可照抄音檔：正解換說法、干擾項沿用音檔字詞（b2cd1 裁示） |
| b2-u27-l05-q10 | options/1 | The farm is far from the city center | The animals eat more food than on other farms | 聽選正解不可照抄音檔：正解換說法、干擾項沿用音檔字詞（b2cd1 裁示） |
| b2-u27-l05-q10 | options/2 | The eggs are very large | The farm is far from the city | 聽選正解不可照抄音檔：正解換說法、干擾項沿用音檔字詞（b2cd1 裁示） |
| b2-u27-l05-q10 | options/3 | The animals are treated well | The animals are looked after kindly | 聽選正解不可照抄音檔：正解換說法、干擾項沿用音檔字詞（b2cd1 裁示） |
| b2-u27-l05-q13 | stemEn | The museum keeps a ____ from the old ship: a small bell that the sailors rang every morning. | Divers found a ____ of the old ship: a small bell that the sailors once rang. | 同單元跨課事件重複（b2cd1 裁示）：博物館事件重複 |
| b2-u27-l05-q13 | stemZh | 博物館收藏了那艘老船的一件遺物：水手們每天早上敲的一口小鐘。 | 潛水員找到那艘老船的一件遺物：一口水手們以前敲的小鐘。 | 同單元跨課事件重複（b2cd1 裁示）：博物館事件重複 |
| b2-u27-l05-q14 | stemEn | Many people are asking for more ____ treatment of animals on farms. | The new law calls for more ____ treatment of animals in zoos. | 第③關疑似（照審查建議改） 12：同課三題都是農場動物 |
| b2-u27-l05-q14 | stemZh | 許多人要求農場以更人道的方式對待動物。 | 新法要求動物園以更人道的方式對待動物。 | 第③關疑似（照審查建議改） 12：同課三題都是農場動物 |
| b2-u27-l05-q15 | passageEn | High in the mountains of Spain stands a small monastery that is over eight hundred years old. The man who started it was a disciple of a famous teacher, and his old walking stick is kept there as a relic. The monastery does not have the prestige of the great cathedral in the capital, but many visitors come for peace and quiet. Even members of royalty have stayed there. The monks run a small farm and are known for their humane care of animals: their goats walk freely on the hills. My brother, who is usually a lazy bum at home, got up at five every morning when we stayed there, just to watch the sunrise. | High in the mountains of Spain stands a small monastery that is over eight hundred years old. The man who started it was a disciple of a famous teacher, and his old walking stick is kept there as a relic. The monastery does not have the prestige of the great cathedral in the capital, but many visitors come for peace and quiet. Even members of royalty have stayed there. The monks run a small farm where goats walk freely on the hills, and they are known for being humane: they never turn away a hungry traveler. My brother, who is usually a lazy bum at home, got up at five every morning when we stayed there, just to watch the sunrise. | 情境表逐列人工重判：同課兩題事件類型相同，改寫（b1b4／b2cd1 裁示）：閱讀與聽選同為農場人道對待動物 |
| b2-u27-l05-q15 | passageZh | 在西班牙的高山上，有一座八百多年歷史的小修道院。創立它的人是一位知名老師的弟子，他的舊手杖被當作遺物收藏在那裡。這座修道院沒有首都那座大教堂的名氣，但仍有許多訪客為了平靜而來，連皇室成員都曾在那裡住過。僧侶們經營一座小農場，以人道照顧動物聞名：他們的山羊可以在山坡上自由走動。我哥哥在家通常是個懶鬼，但我們住在那裡時，他每天早上五點就起床，只為了看日出。 | 在西班牙的高山上，有一座八百多年歷史的小修道院。創立它的人是一位知名老師的弟子，他的舊手杖被當作遺物收藏在那裡。這座修道院沒有首都那座大教堂的名氣，但仍有許多訪客為了平靜而來，連皇室成員都曾在那裡住過。僧侶們經營一座小農場，山羊在山坡上自由走動；他們也以仁慈聞名，從不拒絕飢餓的旅人。我哥哥在家通常是個懶鬼，但我們住在那裡時，他每天早上五點就起床，只為了看日出。 | 情境表逐列人工重判：同課兩題事件類型相同，改寫（b1b4／b2cd1 裁示）：閱讀與聽選同為農場人道對待動物 |
| b2-u27-l05-q16 | rubricZh/2 | 說每年的情況，時態配合內容（例如 earns、makes） | 說每年的情況，時態配合內容（例如 earns、makes 等） | 評分要點：不寫死時態、「常見搭配」改「X 的用法，例如…等」、例如清單補「等」（b2cd1 裁示、第③關疑似 26） |
| b2-u27-l05-q17 | rubricZh/1 | 時態配合內容（例如 visited、hope to） | 時態配合內容（例如 visited、hope to 等） | 評分要點：不寫死時態、「常見搭配」改「X 的用法，例如…等」、例如清單補「等」（b2cd1 裁示、第③關疑似 26） |
| b2-u27-l06-q04 | exampleEn | In the story, the princess falls in love with a mortal man. | In the video game, your mortal hero can die, so you must play carefully. | 第③關疑似（照審查建議改） 14：「在古老故事裡」反覆出現；最終複審 FIX #3：卡和閱讀命題相同（人終有一死），改成電玩英雄 |
| b2-u27-l06-q04 | exampleZh | 在故事裡，公主愛上了一個凡人。 | 在這款電玩裡，你的凡人英雄會死，所以你得小心玩。 | 第③關疑似（照審查建議改） 14：「在古老故事裡」反覆出現；最終複審 FIX #3：卡和閱讀命題相同（人終有一死），改成電玩英雄 |
| b2-u27-l06-q09 | sentenceEn | The town built a statue to commemorate the first teacher of its school. | Every spring, the town holds a festival to commemorate a famous poet who was born there. | 同單元跨課事件重複（b2cd1 裁示）：與 l03「為地方先驅立紀念物」同事件 |
| b2-u27-l06-q09 | sentenceZh | 小鎮立了一座雕像，紀念鎮上學校的第一位老師。 | 小鎮每年春天舉辦節慶，紀念一位在當地出生的知名詩人。 | 同單元跨課事件重複（b2cd1 裁示）：與 l03「為地方先驅立紀念物」同事件 |
| b2-u27-l06-q10 | options/0 | Becoming invisible at night | Flying high over the city | 聽選正解不可照抄音檔：正解換說法、干擾項沿用音檔字詞（b2cd1 裁示） |
| b2-u27-l06-q10 | options/1 | Flying over the city | Turning into an animal | 聽選正解不可照抄音檔：正解換說法、干擾項沿用音檔字詞（b2cd1 裁示） |
| b2-u27-l06-q10 | options/2 | Talking to animals | Speaking with animals | 聽選正解不可照抄音檔：正解換說法、干擾項沿用音檔字詞（b2cd1 裁示） |
| b2-u27-l06-q13 | stemEn | In the old story, the hero drinks a special water and becomes ____, so he can never die. | In the old story, the hero drinks some magic water and becomes ____, so he can never die. | 第③關疑似（照審查建議改） 13：a special water 不自然 |
| b2-u27-l06-q13 | stemZh | 在那個古老的故事裡，英雄喝了一種特別的水後就長生不死，永遠不會死。 | 在那個古老的故事裡，英雄喝了一些神奇的水後就長生不死，永遠不會死。 | 第③關疑似（照審查建議改） 13：a special water 不自然 |
| b2-u27-l06-q15 | passageEn | This year, our city museum opened a new exhibition to commemorate its hundredth birthday. The first room shows prehistoric tools found near the river. The next room is about old legends full of supernatural creatures, such as giants and talking trees. In many of these stories, the gods are immortal, while humans are mortal and must accept that life is short. One story tells of a king who became so worldly that he cared only about gold. The gods thought his behavior was immoral and turned his palace into stone. The exhibition has already attracted thousands of viewers, and it will travel to three other cities next year. | This year, our city museum opened a new exhibition to commemorate its hundredth birthday. The first room shows prehistoric tools found near the river. The next room is about old legends full of supernatural creatures, such as giants and talking trees. In many of these stories, the gods are immortal, while humans are mortal and must accept that life is short. One story tells of a king who became so worldly that he cared only about gold. The gods thought his behavior was immoral and turned his palace into stone. The exhibition has already received a lot of publicity, and it will travel to three other cities next year. | 第③關 FIX G1：閱讀正解唯一最長，縮短正解；第②關 issue／第③關疑似（照審查建議改） 15：展覽觀眾宜用 visitors，改帶入 u26 的 publicity；第②關 issue |
| b2-u27-l06-q15 | passageZh | 今年，我們的市立博物館推出一個新展覽，紀念博物館成立一百週年。第一個展間展出在河邊發現的史前工具。下一個展間介紹充滿超自然生物的古老傳說，例如巨人和會說話的樹。在許多這類故事裡，神長生不死，而人類終有一死，必須接受人生短暫。有一個故事講一位國王變得非常世俗，只在乎金子。眾神認為他的行為不道德，就把他的宮殿變成了石頭。這個展覽已經吸引了好幾千名觀眾，明年還會到另外三個城市巡迴展出。 | 今年，我們的市立博物館推出一個新展覽，紀念博物館成立一百週年。第一個展間展出在河邊發現的史前工具。下一個展間介紹充滿超自然生物的古老傳說，例如巨人和會說話的樹。在許多這類故事裡，神長生不死，而人類終有一死，必須接受人生短暫。有一個故事講一位國王變得非常世俗，只在乎金子。眾神認為他的行為不道德，就把他的宮殿變成了石頭。這個展覽已經得到很多宣傳，明年還會到另外三個城市巡迴展出。 | 第③關 FIX G1：閱讀正解唯一最長，縮短正解；第②關 issue／第③關疑似（照審查建議改） 15：展覽觀眾宜用 visitors，改帶入 u26 的 publicity；第②關 issue |
| b2-u27-l06-q15 | questions/1/options/0 | 國王只在乎金子、行為不道德 | 國王行為不道德 | 第③關 FIX G1：閱讀正解唯一最長，縮短正解；第②關 issue／第③關疑似（照審查建議改） 15：展覽觀眾宜用 visitors，改帶入 u26 的 publicity；第②關 issue |
| b2-u27-l06-q17 | rubricZh/2 | 時態配合內容（例如 love、don't enjoy） | 時態配合內容（例如 love、don't enjoy 等） | 評分要點：不寫死時態、「常見搭配」改「X 的用法，例如…等」、例如清單補「等」（b2cd1 裁示、第③關疑似 26） |
| b2-u27-l07-q09 | options/0 | Leave the stadium before the match | Support the hometown team quietly | 聽選正解不可照抄音檔：正解換說法、干擾項沿用音檔字詞（b2cd1 裁示） |
| b2-u27-l07-q09 | options/1 | Stay fair to both teams | Treat both teams the same | 聽選正解不可照抄音檔：正解換說法、干擾項沿用音檔字詞（b2cd1 裁示） |
| b2-u27-l07-q09 | options/2 | Wear a different color | Stay away from the match | 聽選正解不可照抄音檔：正解換說法、干擾項沿用音檔字詞（b2cd1 裁示） |
| b2-u27-l07-q12 | stemEn | In the legend, the king searched everywhere for a fruit that would give him ____. | In the film, a rich man spends his money searching for ____, but he learns that a short life can be happy. | 第③關 FIX：同詞性題可數性洩題（obituary、subculture），且與 l06 q13「神物使人長生」同事件；句長 |
| b2-u27-l07-q12 | stemZh | 在傳說中，國王到處尋找能讓他長生不死的果實。 | 在那部電影裡，一個有錢人花錢尋找永生，最後卻明白短暫的人生也能很快樂。 | 第③關 FIX：同詞性題可數性洩題（obituary、subculture），且與 l06 q13「神物使人長生」同事件；句長 |
| b2-u27-l07-q12 | options/0 | obituary | sexism | 第③關 FIX：同詞性題可數性洩題（obituary、subculture），且與 l06 q13「神物使人長生」同事件；句長 |
| b2-u27-l07-q12 | options/3 | subculture | morality | 第③關 FIX：同詞性題可數性洩題（obituary、subculture），且與 l06 q13「神物使人長生」同事件；句長 |
| b2-u27-l07-q12 | optionGlossZh/0 | 訃聞 | 性別歧視 | 第③關 FIX：同詞性題可數性洩題（obituary、subculture），且與 l06 q13「神物使人長生」同事件；句長 |
| b2-u27-l07-q12 | optionGlossZh/3 | 次文化 | 道德 | 第③關 FIX：同詞性題可數性洩題（obituary、subculture），且與 l06 q13「神物使人長生」同事件；句長 |
| b2-u27-l07-q14 | passageEn | Last week, our local newspaper printed an obituary of Ms. Wu, a painter who lived to ninety-five. She was born into a family of the old nobility, but she chose a simple life. In her twenties, she joined the city's young artists' subculture and painted on the walls of old factories. Later, she spoke out against sexism in the art world, where women's paintings were often ignored. Many people remember her as an impartial judge at art competitions, because she never cared who the artist was. Every morning, she burned incense and sat quietly for an hour before painting. Her last exhibition attracted thousands of viewers. She once said that art was her only path to immortality. | Last week, our local newspaper printed an obituary of Ms. Wu, a painter who lived to ninety-five. She was born into a family of the old nobility, but she chose a simple life. In her twenties, she joined the city's young artists' subculture and painted on the walls of old factories. Later, she spoke out against sexism in the art world, where women's paintings were often ignored. Many people remember her as an impartial judge at art competitions, because she never cared who the artist was. Every morning, she burned incense and sat quietly for an hour before painting. A book about her life later became a bestseller. She once said that art was her only path to immortality. | 第②關 issue／第③關疑似（照審查建議改） 15：展覽觀眾宜用 visitors，改帶入 u26 的 bestseller；第②關 issue |
| b2-u27-l07-q14 | passageZh | 上週，我們的地方報紙刊登了吳女士的訃聞，她是一位活到九十五歲的畫家。她出身舊貴族家庭，卻選擇了簡樸的生活。二十幾歲時，她加入了城裡年輕藝術家的次文化圈，在老工廠的牆上作畫。後來，她公開反對藝術界的性別歧視，因為當時女性的畫作常被忽視。很多人記得她是藝術比賽中公正的評審，因為她從不在乎作品是誰畫的。每天早上，她都會燒香、安靜坐一個小時再開始畫畫。她最後一次展覽吸引了數千名觀眾。她曾說，藝術是她通往不朽的唯一道路。 | 上週，我們的地方報紙刊登了吳女士的訃聞，她是一位活到九十五歲的畫家。她出身舊貴族家庭，卻選擇了簡樸的生活。二十幾歲時，她加入了城裡年輕藝術家的次文化圈，在老工廠的牆上作畫。後來，她公開反對藝術界的性別歧視，因為當時女性的畫作常被忽視。很多人記得她是藝術比賽中公正的評審，因為她從不在乎作品是誰畫的。每天早上，她都會燒香、安靜坐一個小時再開始畫畫。後來，一本關於她生平的書成了暢銷書。她曾說，藝術是她通往不朽的唯一道路。 | 第②關 issue／第③關疑似（照審查建議改） 15：展覽觀眾宜用 visitors，改帶入 u26 的 bestseller；第②關 issue |
| b2-u27-l07-q15 | rubricZh/0 | 「貴族家庭」可寫，例如 a family of the nobility、a noble family 等 | 「貴族家庭」要用到 nobility（例如 a family of the nobility、a family from the nobility 等） | 第②關 issue：hint 指定 nobility，要點不收不用目標字的寫法 |
| b2-u27-l07-q16 | rubricZh/2 | 時態配合內容（例如 am、is） | 時態配合內容（例如 am、is 等） | 評分要點：不寫死時態、「常見搭配」改「X 的用法，例如…等」、例如清單補「等」（b2cd1 裁示、第③關疑似 26） |
| b2-u27-l08-q07 | exampleEn | She loves Shakespearean comedies more than his sad plays. | She prefers Shakespearean comedies to Shakespearean tragedies. | 第②關 issue／第③關疑似（照審查建議改） 18：his 沒有先行詞 |
| b2-u27-l08-q07 | exampleZh | 比起莎士比亞的悲劇，她更喜歡他的喜劇。 | 比起莎士比亞的悲劇，她更喜歡莎士比亞的喜劇。 | 第②關 issue／第③關疑似（照審查建議改） 18：his 沒有先行詞 |
| b2-u27-l08-q08 | sentenceEn | The museum tried to humanize history by telling the stories of ordinary people. | Our history teacher humanizes the past by telling stories of ordinary families. | 同單元跨課事件重複（b2cd1 裁示）：博物館事件重複 |
| b2-u27-l08-q08 | sentenceZh | 博物館藉由講述平凡人的故事，讓歷史更有人情味。 | 我們的歷史老師講平凡家庭的故事，讓過去更有人情味。 | 同單元跨課事件重複（b2cd1 裁示）：博物館事件重複 |
| b2-u27-l08-q09 | options/1 | Opened restaurants in every city | Opened Thai restaurants in every city | 聽選正解不可照抄音檔：正解換說法、干擾項沿用音檔字詞（b2cd1 裁示） |
| b2-u27-l08-q09 | options/2 | Made Thai food popular | Made more people like Thai dishes | 聽選正解不可照抄音檔：正解換說法、干擾項沿用音檔字詞（b2cd1 裁示） |
| b2-u27-l08-q09 | options/3 | Grew his own herbs | Cooked only on TV | 聽選正解不可照抄音檔：正解換說法、干擾項沿用音檔字詞（b2cd1 裁示） |
| b2-u27-l08-q11 | sentenceEn | Some music videos glorify fast cars and expensive clothes. | The old song glorifies the hard work of farmers. | 第③關疑似（照審查建議改） 17：卡與跟讀同為「影視美化飆車」，改用「讚頌」義 |
| b2-u27-l08-q11 | sentenceZh | 有些音樂錄影帶美化跑車和昂貴的衣服。 | 那首老歌讚頌農民的辛勤工作。 | 第③關疑似（照審查建議改） 17：卡與跟讀同為「影視美化飆車」，改用「讚頌」義 |
| b2-u27-l08-q12 | stemEn | Scientists on TV can ____ difficult ideas, so ordinary people understand them. | Cheap flights have helped ____ travel to small islands. | 情境表逐列人工重判：同課兩題事件類型相同，改寫（b1b4／b2cd1 裁示）：mcq 與聽選同為「電視上的人把某事普及」 |
| b2-u27-l08-q12 | stemZh | 上電視的科學家可以把艱深的概念普及化，讓一般人也能理解。 | 便宜的機票讓去小島旅行變得普及。 | 情境表逐列人工重判：同課兩題事件類型相同，改寫（b1b4／b2cd1 裁示）：mcq 與聽選同為「電視上的人把某事普及」 |
| b2-u27-l08-q15 | rubricZh/2 | 過去的情況用過去式（例如 could、were able to） | 時態合理（例如 could、were able to 等） | 評分要點：不寫死時態、「常見搭配」改「X 的用法，例如…等」、例如清單補「等」（b2cd1 裁示、第③關疑似 26）；評分要點：不寫死時態（b2cd1 裁示） |
| b2-u27-l08-q16 | rubricZh/2 | 時態配合內容（例如 tried、help） | 時態配合內容（例如 tried、help 等） | 評分要點：不寫死時態、「常見搭配」改「X 的用法，例如…等」、例如清單補「等」（b2cd1 裁示、第③關疑似 26） |
| b2-u27-l09-q03 | exampleEn | The village pastor was a kind and godly man. | People in the village respected her simple and godly way of life. | 第③關 FIX：卡與閱讀只換主詞 |
| b2-u27-l09-q03 | exampleZh | 村裡的牧師是一位善良又虔誠的人。 | 村裡的人尊敬她簡樸又虔誠的生活方式。 | 第③關 FIX：卡與閱讀只換主詞 |
| b2-u27-l09-q09 | options/0 | An early flight | To catch an early plane | 聽選正解不可照抄音檔：正解換說法、干擾項沿用音檔字詞（b2cd1 裁示） |
| b2-u27-l09-q09 | options/1 | To finish some work | To finish some work first | 聽選正解不可照抄音檔：正解換說法、干擾項沿用音檔字詞（b2cd1 裁示） |
| b2-u27-l09-q09 | options/2 | To watch a soccer game | To watch a game at three | 聽選正解不可照抄音檔：正解換說法、干擾項沿用音檔字詞（b2cd1 裁示） |
| b2-u27-l09-q09 | options/3 | To drive a friend home | To drive a friend to the airport | 聽選正解不可照抄音檔：正解換說法、干擾項沿用音檔字詞（b2cd1 裁示） |
| b2-u27-l09-q10 | sentenceEn | The country began to industrialize quickly after it built new railways. | The region industrialized faster than its neighbors. | 第③關疑似（照審查建議改） 19：跟讀與翻譯參考答案幾乎同句 |
| b2-u27-l09-q10 | sentenceZh | 那個國家蓋了新鐵路之後，開始快速工業化。 | 那個地區工業化的速度比鄰近地區快。 | 第③關疑似（照審查建議改） 19：跟讀與翻譯參考答案幾乎同句 |
| b2-u27-l09-q11 | sentenceEn | In the story, the nobleman gave his land to the poor farmers. | A nobleman from the north married the king's youngest daughter. | 第③關疑似（照審查建議改） 14：「在古老故事裡」反覆出現；最終複審 FIX #4：跟讀和閱讀同一事件（山谷土地屬於貴族），改成貴族娶公主 |
| b2-u27-l09-q11 | sentenceZh | 在故事裡，那位貴族把他的土地送給了貧窮的農夫。 | 一位北方的貴族娶了國王最小的女兒。 | 第③關疑似（照審查建議改） 14：「在古老故事裡」反覆出現；最終複審 FIX #4：跟讀和閱讀同一事件（山谷土地屬於貴族），改成貴族娶公主 |
| b2-u27-l09-q12 | stemEn | Treating workers like machines can ____ them and make them unhappy. | Calling students by numbers instead of their names can ____ them. | 最終複審 FIX #5：mcq 和閱讀同為工廠把工人當機器，改成用號碼叫學生 |
| b2-u27-l09-q12 | stemZh | 把工人當機器對待，會讓他們失去人性、變得不快樂。 | 用號碼而不是名字叫學生，可能會讓他們失去人性。 | 最終複審 FIX #5：mcq 和閱讀同為工廠把工人當機器，改成用號碼叫學生 |
| b2-u27-l09-q14 | passageZh | 兩百年前，我們的山谷是一個寧靜、尚未工業化的地方，大多數人種稻、養豬。這片土地屬於一位貴族，他以虔誠聞名，每年冬天都會送食物給窮人。後來國家開始工業化，河邊出現了大型工廠。工人必須在天還沒亮的時候上工，一天站在吵鬧的機器旁十二個小時，工廠也汙染了河水。當時有些作家說，工廠讓人失去了人性。如今，那座老工廠成了博物館。在它的地下室，參觀者甚至可以看到早期人類祖先留下的石器，那是蓋工廠時發現的。 | 兩百年前，我們的山谷是一個寧靜、尚未工業化的地方，大多數人種稻、養豬。這片土地屬於一位貴族，他以虔誠聞名，每年冬天都會送食物給窮人。後來國家開始工業化，河邊出現了大型工廠。工人必須在早得離譜的時間上工，一天站在吵鬧的機器旁十二個小時，工廠也汙染了河水。當時有些作家說，工廠讓人失去了人性。如今，那座老工廠成了博物館。在它的地下室，參觀者甚至可以看到早期人類祖先留下的石器，那是蓋工廠時發現的。 | 第③關 FIX：小題與短文不符（短文說他以虔誠聞名）；第②關 issue：中譯多加資訊；長度名次微調 |
| b2-u27-l09-q14 | questions/0/questionZh | 那位貴族以什麼聞名？ | 那位貴族每年冬天會做什麼？ | 第③關 FIX：小題與短文不符（短文說他以虔誠聞名）；第②關 issue：中譯多加資訊；長度名次微調 |
| b2-u27-l09-q14 | questions/0/options/0 | 每年冬天送食物給窮人 | 送食物給窮人 | 第③關 FIX：小題與短文不符（短文說他以虔誠聞名）；第②關 issue：中譯多加資訊；長度名次微調 |
| b2-u27-l09-q14 | questions/0/options/3 | 養了很多頭豬 | 養了很多豬 | 第③關 FIX：小題與短文不符（短文說他以虔誠聞名）；第②關 issue：中譯多加資訊；長度名次微調 |
| b2-u27-l09-q15 | promptZh | 這個國家大約一百年前開始工業化。 | 那個城市工業化之後，空氣變得很髒。 | 評分要點：不寫死時態、「常見搭配」改「X 的用法，例如…等」、例如清單補「等」（b2cd1 裁示、第③關疑似 26）；情境表逐列人工重判：同課兩題事件類型相同，改寫（b1b4／b2cd1 裁示）：翻譯與閱讀同為「國家開始工業化」 |
| b2-u27-l09-q15 | referenceEn/0 | This country began to industrialize about a hundred years ago. | After the city industrialized, its air became very dirty. | 評分要點：不寫死時態、「常見搭配」改「X 的用法，例如…等」、例如清單補「等」（b2cd1 裁示、第③關疑似 26）；情境表逐列人工重判：同課兩題事件類型相同，改寫（b1b4／b2cd1 裁示）：翻譯與閱讀同為「國家開始工業化」 |
| b2-u27-l09-q15 | referenceEn/1 | The country started industrializing around one hundred years ago. | The air in that city became very dirty after it industrialized. | 評分要點：不寫死時態、「常見搭配」改「X 的用法，例如…等」、例如清單補「等」（b2cd1 裁示、第③關疑似 26）；情境表逐列人工重判：同課兩題事件類型相同，改寫（b1b4／b2cd1 裁示）：翻譯與閱讀同為「國家開始工業化」 |
| b2-u27-l09-q15 | rubricZh/0 | 寫法不限（例如 began to industrialize、started industrializing 等） | industrialize 的用法，例如 the city industrialized、after it industrialized 等 | 評分要點：不寫死時態、「常見搭配」改「X 的用法，例如…等」、例如清單補「等」（b2cd1 裁示、第③關疑似 26）；情境表逐列人工重判：同課兩題事件類型相同，改寫（b1b4／b2cd1 裁示）：翻譯與閱讀同為「國家開始工業化」 |
| b2-u27-l09-q15 | rubricZh/1 | 過去的事用過去式（例如 began、started） | 時態合理（例如 industrialized、became 等） | 評分要點：不寫死時態、「常見搭配」改「X 的用法，例如…等」、例如清單補「等」（b2cd1 裁示、第③關疑似 26）；情境表逐列人工重判：同課兩題事件類型相同，改寫（b1b4／b2cd1 裁示）：翻譯與閱讀同為「國家開始工業化」 |
| b2-u27-l09-q16 | referenceEn/0 | I once had to catch a train at an ungodly hour, at four in the morning. | I once finished an essay at an ungodly hour, just before sunrise. | 第③關 FIX：要點「常見搭配」改寫；第③關疑似（照審查建議改） 19：參考答案與聽選同為趕交通工具 |
| b2-u27-l09-q16 | rubricZh/1 | 常見搭配（例如 at an ungodly hour 等） | ungodly 的用法，例如 at an ungodly hour、ungodly hours 等 | 第③關 FIX：要點「常見搭配」改寫；第③關疑似（照審查建議改） 19：參考答案與聽選同為趕交通工具 |
| b2-u27-l09-q16 | rubricZh/2 | 說過去的經驗，時態配合內容（例如 had to、woke up、have woken up） | 說過去的經驗，時態合理（例如 finished、woke up、have woken up 等） | 第③關 FIX：要點「常見搭配」改寫；第③關疑似（照審查建議改） 19：參考答案與聽選同為趕交通工具 |
| b2-u28-l01-q06 | glossZh | 可取得性；有空 | 供應情況；有空 | 第③關疑似（照審查建議改） 25：「可取得性」翻譯腔 |
| b2-u28-l01-q07 | exampleEn | The organizers of the marathon thanked all the volunteers. | Every big event needs a good organizer. | 情境表逐列重算：和單字卡主詞、句型都相同（只換情境）（和 q13 同為 The organizer(s) of…），改卡 |
| b2-u28-l01-q07 | exampleZh | 馬拉松的主辦單位感謝所有的志工。 | 每個大型活動都需要一位好的籌辦人。 | 情境表逐列重算：和單字卡主詞、句型都相同（只換情境）（和 q13 同為 The organizer(s) of…），改卡 |
| b2-u28-l01-q11 | audioEn | I'll send everyone a reminder about the meeting on Thursday afternoon. | The library sent me a reminder that my books are due on Friday. | 聽選正解不可照抄音檔：正解換說法、干擾項沿用音檔字詞（b2cd1 裁示）；情境表逐列人工重判：聽選音檔與他題同事件，改寫（聽選正解不照抄音檔） |
| b2-u28-l01-q11 | audioZh | 我會寄一封關於週四下午會議的提醒給大家。 | 圖書館寄了提醒給我，說我的書星期五到期。 | 聽選正解不可照抄音檔：正解換說法、干擾項沿用音檔字詞（b2cd1 裁示）；情境表逐列人工重判：聽選音檔與他題同事件，改寫（聽選正解不照抄音檔） |
| b2-u28-l01-q11 | questionZh | 說話者會寄什麼給大家？ | 圖書館提醒說話者什麼？ | 聽選正解不可照抄音檔：正解換說法、干擾項沿用音檔字詞（b2cd1 裁示）；情境表逐列人工重判：聽選音檔與他題同事件，改寫（聽選正解不照抄音檔） |
| b2-u28-l01-q11 | options/0 | A reminder about the meeting | The books must go back by Friday | 聽選正解不可照抄音檔：正解換說法、干擾項沿用音檔字詞（b2cd1 裁示）；情境表逐列人工重判：聽選音檔與他題同事件，改寫（聽選正解不照抄音檔） |
| b2-u28-l01-q11 | options/1 | The new office rules | The library will close on Friday | 聽選正解不可照抄音檔：正解換說法、干擾項沿用音檔字詞（b2cd1 裁示）；情境表逐列人工重判：聽選音檔與他題同事件，改寫（聽選正解不照抄音檔） |
| b2-u28-l01-q11 | options/2 | A list of phone numbers | New books will arrive on Friday | 聽選正解不可照抄音檔：正解換說法、干擾項沿用音檔字詞（b2cd1 裁示）；情境表逐列人工重判：聽選音檔與他題同事件，改寫（聽選正解不照抄音檔） |
| b2-u28-l01-q11 | options/3 | The sales report | A talk is held at the library | 聽選正解不可照抄音檔：正解換說法、干擾項沿用音檔字詞（b2cd1 裁示）；情境表逐列人工重判：聽選音檔與他題同事件，改寫（聽選正解不照抄音檔） |
| b2-u28-l01-q18 | rubricZh/2 | 說過去的經驗，時態配合內容（例如 picked up、have read） | 說過去的經驗，時態配合內容（例如 picked up、have read 等） | 評分要點：不寫死時態、「常見搭配」改「X 的用法，例如…等」、例如清單補「等」（b2cd1 裁示、第③關疑似 26） |
| b2-u28-l02-q06 | exampleEn | The conference room is on the third floor. | The conference ended with a short speech by the mayor. | 第②關 issue：原例句只用到 conference room，未呈現 conference 本身詞義；情境表逐列人工重判：單字卡與他題事件類型相同，改寫卡例句（b1b4／b2cd1 裁示） |
| b2-u28-l02-q06 | exampleZh | 會議室在三樓。 | 研討會最後由市長發表簡短演說作結。 | 第②關 issue：原例句只用到 conference room，未呈現 conference 本身詞義；情境表逐列人工重判：單字卡與他題事件類型相同，改寫卡例句（b1b4／b2cd1 裁示） |
| b2-u28-l02-q07 | exampleEn | The procedure for getting a visa can take weeks. | The procedure for opening a bank account is quite simple. | 第③關疑似（照審查建議改） 21：避免具體簽證規定 |
| b2-u28-l02-q07 | exampleZh | 辦簽證的手續可能要花好幾個星期。 | 開銀行帳戶的手續相當簡單。 | 第③關疑似（照審查建議改） 21：避免具體簽證規定 |
| b2-u28-l02-q09 | sentenceEn | All new employees must attend a safety training on Monday. | All new employees must attend safety training on Monday. | 第③關疑似（照審查建議改） 22：training 不可數 |
| b2-u28-l02-q10 | options/0 | Doesn't like the place | Goes to the gym again | 聽選正解不可照抄音檔：正解換說法、干擾項沿用音檔字詞（b2cd1 裁示）；執行長小修：選項 Joined the gym again 改成和其他選項同時態 |
| b2-u28-l02-q10 | options/1 | A family dinner | Has another dinner tonight | 聽選正解不可照抄音檔：正解換說法、干擾項沿用音檔字詞（b2cd1 裁示）；執行長小修：選項 Joined the gym again 改成和其他選項同時態 |
| b2-u28-l02-q10 | options/2 | Going to the gym | Doesn't like the place | 聽選正解不可照抄音檔：正解換說法、干擾項沿用音檔字詞（b2cd1 裁示）；執行長小修：選項 Joined the gym again 改成和其他選項同時態 |
| b2-u28-l02-q10 | options/3 | Working late | Has to stay at work | 聽選正解不可照抄音檔：正解換說法、干擾項沿用音檔字詞（b2cd1 裁示）；執行長小修：選項 Joined the gym again 改成和其他選項同時態 |
| b2-u28-l02-q11 | sentenceEn | My colleague answered my phone calls while I was out at lunch. | Two of my colleagues are getting married next month. | 情境表逐列人工重判：同課兩題事件類型相同，改寫（b1b4／b2cd1 裁示）：跟讀與造句同為同事幫我做事 |
| b2-u28-l02-q11 | sentenceZh | 我出去吃午餐時，同事幫我接了電話。 | 我有兩位同事下個月要結婚了。 | 情境表逐列人工重判：同課兩題事件類型相同，改寫（b1b4／b2cd1 裁示）：跟讀與造句同為同事幫我做事 |
| b2-u28-l02-q14 | stemEn | If there is a fire, follow the safety ____ on the back of your door. | Before you use the new machine, read the safety ____ on the wall next to it. | 第③關 FIX：火災逃生情境（內容界線） |
| b2-u28-l02-q14 | stemZh | 如果發生火災，請按照你房門背面的安全步驟行動。 | 使用新機器前，請先讀旁邊牆上的安全操作步驟。 | 第③關 FIX：火災逃生情境（內容界線） |
| b2-u28-l02-q15 | questions/1/options/0 | 晚點下班應該是選擇而不是義務 | 晚下班該自己選 | 第③關 FIX G1：閱讀正解唯一最長，縮短正解 |
| b2-u28-l02-q17 | rubricZh/2 | 時態配合內容（例如 helped、taught） | 時態配合內容（例如 helped、taught 等） | 評分要點：不寫死時態、「常見搭配」改「X 的用法，例如…等」、例如清單補「等」（b2cd1 裁示、第③關疑似 26） |
| b2-u28-l03-q01 | exampleEn | The TV show has a panel of three famous chefs. | A panel of teachers chose the new textbooks for next year. | 最終複審 FIX #6：卡和閱讀同為評審團評比賽，改成老師小組選課本 |
| b2-u28-l03-q01 | exampleZh | 那個電視節目有一個由三位名廚組成的評審團。 | 一個由老師組成的小組選出了明年的新課本。 | 最終複審 FIX #6：卡和閱讀同為評審團評比賽，改成老師小組選課本 |
| b2-u28-l03-q09 | sentenceEn | The factory employs about three hundred people from nearby towns. | She was employed as a tour guide for two summers. | 第③關 FIX：聽打與卡只換主詞 |
| b2-u28-l03-q09 | sentenceZh | 這家工廠僱用了大約三百位來自附近鄉鎮的人。 | 她曾受僱當了兩個暑假的導遊。 | 第③關 FIX：聽打與卡只換主詞 |
| b2-u28-l03-q10 | options/1 | The manager's personal phone | The operator's own desk upstairs | 聽選正解不可照抄音檔：正解換說法、干擾項沿用音檔字詞（b2cd1 裁示） |
| b2-u28-l03-q10 | options/3 | The sales department | The team that sells products | 聽選正解不可照抄音檔：正解換說法、干擾項沿用音檔字詞（b2cd1 裁示） |
| b2-u28-l03-q13 | stemEn | A ____ of five experts will choose the winner of the design contest. | The city formed a ____ of experts to study the traffic problem. | 第③關疑似（照審查建議改） 23：同課三題皆「評審比賽」；情境表逐列人工重判：單字卡與他題事件類型相同，改寫卡例句（b1b4／b2cd1 裁示）：卡與 mcq 同為電視節目小組 |
| b2-u28-l03-q13 | stemZh | 一個由五位專家組成的小組將選出設計比賽的冠軍。 | 市政府成立了一個專家小組來研究交通問題。 | 第③關疑似（照審查建議改） 23：同課三題皆「評審比賽」；情境表逐列人工重判：單字卡與他題事件類型相同，改寫卡例句（b1b4／b2cd1 裁示）：卡與 mcq 同為電視節目小組 |
| b2-u28-l03-q15 | passageZh | Linda 在銀行業工作了十年，之後成為一名顧問，現在協助小公司規劃未來。上個月，一家大型飯店集團邀請她加入一場商業比賽的評審團。比賽前，她讀了每一個參賽隊伍的簡介。獲勝的隊伍設計出一台簡單的機器，能幫飯店清潔人員搬運沉重的床單，操作員只要用一隻手就能控制它。比賽結束後，飯店集團的副總經理給了這個隊伍一份合約。Linda 認為，好的僱主應該歡迎新點子，而僱用年輕發明家的公司往往成長得更快。這場比賽現在已經相當有聲望了。 | Linda 在銀行業工作了十年，之後成為一名顧問，現在協助小公司規劃未來。上個月，一家大型飯店集團邀請她加入一場商業比賽的評審團。比賽前，她讀了每一個參賽隊伍的簡介。獲勝的隊伍設計出一台簡單的機器，能幫飯店清潔人員搬運沉重的床單，操作員只要用一隻手就能控制它。比賽結束後，飯店集團的副主任給了這個隊伍一份合約。Linda 認為，好的僱主應該歡迎新點子，而僱用年輕發明家的公司往往成長得更快。這場比賽現在已經相當有聲望了。 | 第②關 issue：deputy director 譯名；最終複審提醒：干擾項「副總經理」配合短文改成「副主任」 |
| b2-u28-l03-q15 | questions/0/options/0 | 和副總經理開會 | 和副主任開會 | 第②關 issue：deputy director 譯名；最終複審提醒：干擾項「副總經理」配合短文改成「副主任」 |
| b2-u28-l03-q16 | rubricZh/2 | 說每年的情況，時態配合內容（例如 gives、provides） | 說每年的情況，時態配合內容（例如 gives、provides 等） | 評分要點：不寫死時態、「常見搭配」改「X 的用法，例如…等」、例如清單補「等」（b2cd1 裁示、第③關疑似 26） |
| b2-u28-l03-q17 | rubricZh/1 | 常見搭配（例如 work in the … sector、the public sector 等） | sector 的用法，例如 work in the … sector、the public sector 等 | 第③關 FIX：要點「常見搭配」改寫 |
| b2-u28-l03-q17 | rubricZh/2 | 時態配合內容（例如 work、would like to） | 時態合理（例如 work、would like to 等） | 第③關 FIX：要點「常見搭配」改寫 |
| b2-u28-l04-q03 | exampleEn | The new workers need close supervision during their first week. | The building work is under the supervision of an experienced engineer. | 第③關 FIX：與 u28-l01 q15「督導新進員工」同事件 |
| b2-u28-l04-q03 | exampleZh | 新進員工在第一週需要密切的督導。 | 這項工程由一位經驗豐富的工程師監督。 | 第③關 FIX：與 u28-l01 q15「督導新進員工」同事件 |
| b2-u28-l04-q06 | exampleZh | 進會議室時請拿一份資料。 | 進會議室時請拿一份講義。 | 第③關疑似（照審查建議改） 10：例句中譯對齊第一義「講義」 |
| b2-u28-l04-q09 | sentenceEn | The new office has excellent facilities, including a gym and a quiet room. | The hotel's facilities include a pool, a gym and a small library. | 情境表逐列人工重判：同課兩題事件類型相同，改寫（b1b4／b2cd1 裁示）：聽打與閱讀同為公司辦公設施 |
| b2-u28-l04-q09 | sentenceZh | 新辦公室的設施很完善，包括健身房和一間安靜的房間。 | 這家飯店的設施包括游泳池、健身房和一間小圖書室。 | 情境表逐列人工重判：同課兩題事件類型相同，改寫（b1b4／b2cd1 裁示）：聽打與閱讀同為公司辦公設施 |
| b2-u28-l04-q10 | audioEn | Before you sign the contract, please consult your manager. | Before you buy a used car, consult someone who knows about engines. | 聽選正解不可照抄音檔：正解換說法、干擾項沿用音檔字詞（b2cd1 裁示）；情境表逐列人工重判：聽選音檔與他題同事件，改寫（聽選正解不照抄音檔） |
| b2-u28-l04-q10 | audioZh | 簽合約之前，請先和你的經理商量。 | 買二手車之前，先請教懂引擎的人。 | 聽選正解不可照抄音檔：正解換說法、干擾項沿用音檔字詞（b2cd1 裁示）；情境表逐列人工重判：聽選音檔與他題同事件，改寫（聽選正解不照抄音檔） |
| b2-u28-l04-q10 | questionZh | 簽合約前應該先做什麼？ | 買二手車之前應該怎麼做？ | 聽選正解不可照抄音檔：正解換說法、干擾項沿用音檔字詞（b2cd1 裁示）；情境表逐列人工重判：聽選音檔與他題同事件，改寫（聽選正解不照抄音檔） |
| b2-u28-l04-q10 | options/0 | Ask your manager | Ask a car expert for advice | 聽選正解不可照抄音檔：正解換說法、干擾項沿用音檔字詞（b2cd1 裁示）；情境表逐列人工重判：聽選音檔與他題同事件，改寫（聽選正解不照抄音檔） |
| b2-u28-l04-q10 | options/1 | Read every page twice | Buy the car at once | 聽選正解不可照抄音檔：正解換說法、干擾項沿用音檔字詞（b2cd1 裁示）；情境表逐列人工重判：聽選音檔與他題同事件，改寫（聽選正解不照抄音檔） |
| b2-u28-l04-q10 | options/2 | Call the lawyer | Check the price online | 聽選正解不可照抄音檔：正解換說法、干擾項沿用音檔字詞（b2cd1 裁示）；情境表逐列人工重判：聽選音檔與他題同事件，改寫（聽選正解不照抄音檔） |
| b2-u28-l04-q10 | options/3 | Pay the fee | Drive it for a week first | 聽選正解不可照抄音檔：正解換說法、干擾項沿用音檔字詞（b2cd1 裁示）；情境表逐列人工重判：聽選音檔與他題同事件，改寫（聽選正解不照抄音檔） |
| b2-u28-l04-q14 | options/0 | medieval | physical | 最終複審提醒＋執行長裁示 2：干擾項 medieval、supernatural 一眼可排除，換成 physical、outdoor（放得進空格、和「打信件」語意相衝） |
| b2-u28-l04-q14 | options/2 | supernatural | outdoor | 最終複審提醒＋執行長裁示 2：干擾項 medieval、supernatural 一眼可排除，換成 physical、outdoor（放得進空格、和「打信件」語意相衝） |
| b2-u28-l04-q14 | optionGlossZh/0 | 中世紀的 | 體力的 | 最終複審提醒＋執行長裁示 2：干擾項 medieval、supernatural 一眼可排除，換成 physical、outdoor（放得進空格、和「打信件」語意相衝） |
| b2-u28-l04-q14 | optionGlossZh/2 | 超自然的 | 戶外的 | 最終複審提醒＋執行長裁示 2：干擾項 medieval、supernatural 一眼可排除，換成 physical、outdoor（放得進空格、和「打信件」語意相衝） |
| b2-u28-l04-q15 | passageEn | Our school recently upgraded its facilities for online classes. Each classroom now has a camera and a microphone for video conferencing, so students who are sick at home can still join lessons. After every class, the system makes a transcript of what the teacher said, and students can download the handout too. The timing of this change was perfect, because many students had a cold last winter. Some parents were worried about safety, so younger children must use the system under supervision. Teachers can consult the technical staff when there is a problem, and the clerical staff send the transcripts to parents. A local institution paid for the project. | Our company recently upgraded its facilities for online meetings. Each meeting room now has a camera and a microphone for video conferencing, so staff who work from home can still join. After every meeting, the system makes a transcript of what people said, and everyone can download the handout too. The timing of this change was perfect, because many staff stayed home with colds last winter. Some managers were worried about privacy, so new staff must use the system under supervision at first. Workers can consult the technical team when there is a problem, and the clerical staff send the transcripts to clients. A local institution helped pay for the project. | 第③關疑似（照審查建議改） 24：辦公室單元閱讀場景改為公司；第③關疑似（照審查建議改） 24；第③關 FIX G1：閱讀正解唯一最長，縮短正解 |
| b2-u28-l04-q15 | passageZh | 我們學校最近升級了線上課程的設施。現在每間教室都有一台攝影機和一支麥克風可以進行視訊會議，所以生病在家的學生仍然可以上課。每堂課結束後，系統會把老師說的話做成文字紀錄，學生也可以下載講義。這次改變的時機剛剛好，因為去年冬天很多學生感冒。有些家長擔心安全問題，所以年紀較小的孩子必須在有人監督的情況下使用這套系統。老師遇到問題時可以請教技術人員，文書人員則負責把文字紀錄寄給家長。這個計畫由地方上的一個機構出資。 | 我們公司最近升級了線上會議的設施。現在每間會議室都有一台攝影機和一支麥克風可以進行視訊會議，所以在家工作的員工也能參加。每場會議結束後，系統會把大家說的話做成文字紀錄，每個人也都可以下載講義。這次改變的時機剛剛好，因為去年冬天很多員工感冒在家。有些主管擔心隱私問題，所以新進員工一開始必須在有人監督的情況下使用這套系統。員工遇到問題時可以請教技術團隊，文書人員則負責把文字紀錄寄給客戶。地方上的一個機構也出資協助這個計畫。 | 第③關疑似（照審查建議改） 24：辦公室單元閱讀場景改為公司；第③關疑似（照審查建議改） 24；第③關 FIX G1：閱讀正解唯一最長，縮短正解 |
| b2-u28-l04-q15 | questions/0/options/0 | 家長一直要求學校增加線上課 | 主管一直要求增加線上會議 | 第③關疑似（照審查建議改） 24：辦公室單元閱讀場景改為公司；第③關疑似（照審查建議改） 24；第③關 FIX G1：閱讀正解唯一最長，縮短正解 |
| b2-u28-l04-q15 | questions/0/options/1 | 去年冬天很多學生感冒 | 去年冬天很多人感冒在家 | 第③關疑似（照審查建議改） 24：辦公室單元閱讀場景改為公司；第③關疑似（照審查建議改） 24；第③關 FIX G1：閱讀正解唯一最長，縮短正解 |
| b2-u28-l04-q15 | questions/0/options/2 | 政府今年剛好給學校一筆錢 | 政府今年剛好給公司一筆錢 | 第③關疑似（照審查建議改） 24：辦公室單元閱讀場景改為公司；第③關疑似（照審查建議改） 24；第③關 FIX G1：閱讀正解唯一最長，縮短正解 |
| b2-u28-l04-q15 | questions/0/options/3 | 老師想在家上課 | 老闆想在家工作 | 第③關疑似（照審查建議改） 24：辦公室單元閱讀場景改為公司；第③關疑似（照審查建議改） 24；第③關 FIX G1：閱讀正解唯一最長，縮短正解 |
| b2-u28-l04-q15 | questions/1/questionZh | 年紀較小的孩子使用系統有什麼規定？ | 新進員工使用系統有什麼規定？ | 第③關疑似（照審查建議改） 24：辦公室單元閱讀場景改為公司；第③關疑似（照審查建議改） 24；第③關 FIX G1：閱讀正解唯一最長，縮短正解 |
| b2-u28-l04-q15 | questions/1/options/1 | 只能在放學後使用 | 只能在下班後使用 | 第③關疑似（照審查建議改） 24：辦公室單元閱讀場景改為公司；第③關疑似（照審查建議改） 24；第③關 FIX G1：閱讀正解唯一最長，縮短正解 |
| b2-u28-l04-q15 | questions/1/options/2 | 必須在有人監督的情況下使用 | 起初要有人監督 | 第③關疑似（照審查建議改） 24：辦公室單元閱讀場景改為公司；第③關疑似（照審查建議改） 24；第③關 FIX G1：閱讀正解唯一最長，縮短正解 |
| b2-u28-l04-q15 | questions/1/options/3 | 需要付額外費用 | 需要另外付費 | 第③關疑似（照審查建議改） 24：辦公室單元閱讀場景改為公司；第③關疑似（照審查建議改） 24；第③關 FIX G1：閱讀正解唯一最長，縮短正解 |
| b2-u28-l04-q16 | rubricZh/2 | 時態配合內容（例如 was、is） | 時態配合內容（例如 was、is 等） | 評分要點：不寫死時態、「常見搭配」改「X 的用法，例如…等」、例如清單補「等」（b2cd1 裁示、第③關疑似 26） |
| b2-u28-l04-q17 | rubricZh/2 | 說習慣，時態配合內容（例如 consult、always consult） | 說習慣，時態配合內容（例如 consult、always consult 等） | 評分要點：不寫死時態、「常見搭配」改「X 的用法，例如…等」、例如清單補「等」（b2cd1 裁示、第③關疑似 26） |
| b2-u29-l01-q05 | glossZh | 補償；彌補 | 彌補；補償 | 單字卡第一義與例句一致（b2cd1 裁示） |
| b2-u29-l01-q08 | exampleEn | Many families downsize to a smaller home when their children move out. | The bank downsized its staff by moving many services online. | 單字卡第一義與例句一致（b2cd1 裁示） |
| b2-u29-l01-q08 | exampleZh | 孩子搬出去後，很多家庭會換到較小的房子。 | 那家銀行把許多服務移到網路上，藉此縮編人力。 | 單字卡第一義與例句一致（b2cd1 裁示） |
| b2-u29-l01-q10 | audioEn | Workers who have been here for one year are eligible for an extra week of holiday. | Only players under eighteen are eligible to join the city's youth team. | 聽選正解不可照抄音檔：正解換說法、干擾項沿用音檔字詞（b2cd1 裁示）；情境表逐列人工重判：聽選音檔與他題同事件，改寫（聽選正解不照抄音檔）；長度名次分布：本批聽選「第 3 長」13.3% 壓線，調整干擾項長度；最終複審 FIX #7：音檔和單字卡同為「符合條件可免費得到某物」，改成青年隊年齡資格 |
| b2-u29-l01-q10 | audioZh | 在這裡工作滿一年的員工，有資格多放一週假。 | 只有未滿十八歲的球員才有資格加入市立青年隊。 | 聽選正解不可照抄音檔：正解換說法、干擾項沿用音檔字詞（b2cd1 裁示）；情境表逐列人工重判：聽選音檔與他題同事件，改寫（聽選正解不照抄音檔）；長度名次分布：本批聽選「第 3 長」13.3% 壓線，調整干擾項長度；最終複審 FIX #7：音檔和單字卡同為「符合條件可免費得到某物」，改成青年隊年齡資格 |
| b2-u29-l01-q10 | questionZh | 工作滿一年的員工可以得到什麼？ | 誰有資格加入青年隊？ | 聽選正解不可照抄音檔：正解換說法、干擾項沿用音檔字詞（b2cd1 裁示）；情境表逐列人工重判：聽選音檔與他題同事件，改寫（聽選正解不照抄音檔）；長度名次分布：本批聽選「第 3 長」13.3% 壓線，調整干擾項長度；最終複審 FIX #7：音檔和單字卡同為「符合條件可免費得到某物」，改成青年隊年齡資格 |
| b2-u29-l01-q10 | options/0 | A new computer | Players aged eighteen or older | 聽選正解不可照抄音檔：正解換說法、干擾項沿用音檔字詞（b2cd1 裁示）；情境表逐列人工重判：聽選音檔與他題同事件，改寫（聽選正解不照抄音檔）；長度名次分布：本批聽選「第 3 長」13.3% 壓線，調整干擾項長度；最終複審 FIX #7：音檔和單字卡同為「符合條件可免費得到某物」，改成青年隊年齡資格 |
| b2-u29-l01-q10 | options/1 | A higher salary next year | Anyone who pays the fee | 聽選正解不可照抄音檔：正解換說法、干擾項沿用音檔字詞（b2cd1 裁示）；情境表逐列人工重判：聽選音檔與他題同事件，改寫（聽選正解不照抄音檔）；長度名次分布：本批聽選「第 3 長」13.3% 壓線，調整干擾項長度；最終複審 FIX #7：音檔和單字卡同為「符合條件可免費得到某物」，改成青年隊年齡資格 |
| b2-u29-l01-q10 | options/2 | A free trip with their family | Only last year's team members | 聽選正解不可照抄音檔：正解換說法、干擾項沿用音檔字詞（b2cd1 裁示）；情境表逐列人工重判：聽選音檔與他題同事件，改寫（聽選正解不照抄音檔）；長度名次分布：本批聽選「第 3 長」13.3% 壓線，調整干擾項長度；最終複審 FIX #7：音檔和單字卡同為「符合條件可免費得到某物」，改成青年隊年齡資格 |
| b2-u29-l01-q10 | options/3 | An extra week off | Players younger than eighteen | 聽選正解不可照抄音檔：正解換說法、干擾項沿用音檔字詞（b2cd1 裁示）；情境表逐列人工重判：聽選音檔與他題同事件，改寫（聽選正解不照抄音檔）；長度名次分布：本批聽選「第 3 長」13.3% 壓線，調整干擾項長度；最終複審 FIX #7：音檔和單字卡同為「符合條件可免費得到某物」，改成青年隊年齡資格 |
| b2-u29-l01-q13 | stemEn | After losing money for three years, the company decided to ____ and close two of its factories. | When their children moved out, my parents decided to ____ to a small apartment. | 情境表逐列人工重判：同課兩題事件類型相同，改寫（b1b4／b2cd1 裁示）：mcq 與閱讀同為公司縮編 |
| b2-u29-l01-q13 | stemZh | 連續虧損三年後，公司決定縮編並關閉兩座工廠。 | 孩子們搬出去後，我爸媽決定換到一間小公寓。 | 情境表逐列人工重判：同課兩題事件類型相同，改寫（b1b4／b2cd1 裁示）：mcq 與閱讀同為公司縮編 |
| b2-u29-l01-q16 | rubricZh/0 | enroll 後面常接介系詞（例如 enrolled in a class、enrolled on a course 等） | enroll 的用法，例如 enrolled in a class、enrolled on a course 等 | 第③關 FIX：要點「常接」改寫 |
| b2-u29-l01-q16 | rubricZh/2 | 時態配合內容（例如 enrolled、has enrolled） | 時態合理（例如 enrolled、has enrolled 等） | 第③關 FIX：要點「常接」改寫 |
| b2-u29-l01-q17 | referenceEn/0 | My first manager was a great mentor who taught me to stay calm. | My uncle was my mentor when I started my own small business. | 評分要點：不寫死時態、「常見搭配」改「X 的用法，例如…等」、例如清單補「等」（b2cd1 裁示、第③關疑似 26）；情境表逐列人工重判：同課兩題事件類型相同，改寫（b1b4／b2cd1 裁示）：造句參考答案與跟讀同為「導師教我…」 |
| b2-u29-l01-q17 | rubricZh/1 | 時態配合內容（例如 was、has been） | 時態配合內容（例如 was、has been 等） | 評分要點：不寫死時態、「常見搭配」改「X 的用法，例如…等」、例如清單補「等」（b2cd1 裁示、第③關疑似 26）；情境表逐列人工重判：同課兩題事件類型相同，改寫（b1b4／b2cd1 裁示）：造句參考答案與跟讀同為「導師教我…」 |
| b2-u29-l02-q10 | options/0 | Living by the sea and relaxing | Taking it easy near the beach | 聽選正解不可照抄音檔：正解換說法、干擾項沿用音檔字詞（b2cd1 裁示） |
| b2-u29-l02-q10 | options/1 | Teaching part-time | Still teaching part-time | 聽選正解不可照抄音檔：正解換說法、干擾項沿用音檔字詞（b2cd1 裁示） |
| b2-u29-l02-q10 | options/2 | Writing a book | Writing a book on teaching | 聽選正解不可照抄音檔：正解換說法、干擾項沿用音檔字詞（b2cd1 裁示） |
| b2-u29-l02-q14 | stemEn | She left the bank because the ____ was too low to pay her rent. | The new job offers a higher ____ and more holidays, so she is happy to change companies. | 第③關 FIX：與 u29-l01 q14「離開銀行工作」同事件 |
| b2-u29-l02-q14 | stemZh | 她離開那家銀行，因為薪水太低，付不起房租。 | 新工作提供更高的薪水和更多假期，所以她很樂意換公司。 | 第③關 FIX：與 u29-l01 q14「離開銀行工作」同事件 |
| b2-u29-l02-q15 | passageEn | After thirty-five years at the same factory, Mr. Ho is a true veteran. Next month, he will begin his retirement, and the personnel office is planning a small party for him. Mr. Ho started as a trainee earning a very low wage, but he worked hard and became a supervisor. Over the years, his salary grew, and he saved part of his earnings every month. He remembers a time when the factory almost had to dismiss half of its workers, but the owners found new customers in Japan and saved everyone's jobs. Now he wants to travel with his wife and spend more time with his family. | After thirty-five years at the same factory, Mr. Ho is a true veteran. Next month, he will begin his retirement, and the personnel office is planning a small party for him. Mr. Ho started as a trainee earning a very low wage, but he worked hard and became a supervisor. Over the years, his salary grew, and he saved part of his earnings every month. In all those years, the factory never had to dismiss a single worker, and Mr. Ho is proud of that. Now he wants to travel with his wife and spend more time with his family. | 第③關 FIX：閱讀與 u29-l01 同為「公司差點裁員」 |
| b2-u29-l02-q15 | passageZh | 在同一家工廠工作了三十五年，何先生是個名副其實的老手。下個月他就要退休了，人事室正在為他籌備一場小型派對。何先生從工資很低的實習生做起，但他工作努力，後來當上了主管。這些年來，他的薪水逐漸增加，他每個月都會存下一部分收入。他記得有一段時間，工廠差點得解僱一半的員工，但老闆們在日本找到了新客戶，保住了大家的工作。現在他想和太太一起旅行，多花點時間陪家人。 | 在同一家工廠工作了三十五年，何先生是個名副其實的老手。下個月他就要退休了，人事室正在為他籌備一場小型派對。何先生從工資很低的實習生做起，但他工作努力，後來當上了主管。這些年來，他的薪水逐漸增加，他每個月都會存下一部分收入。這些年來，工廠從來不必解僱任何一位員工，何先生對此感到很驕傲。現在他想和太太一起旅行，多花點時間陪家人。 | 第③關 FIX：閱讀與 u29-l01 同為「公司差點裁員」 |
| b2-u29-l02-q15 | questions/1/questionZh | 工廠為什麼最後不必解僱一半員工？ | 何先生對工廠的哪一點感到驕傲？ | 第③關 FIX：閱讀與 u29-l01 同為「公司差點裁員」 |
| b2-u29-l02-q15 | questions/1/options/0 | 員工同意減薪 | 產品賣到很多國家 | 第③關 FIX：閱讀與 u29-l01 同為「公司差點裁員」 |
| b2-u29-l02-q15 | questions/1/options/1 | 老闆在日本找到了新客戶 | 沒解僱過任何人 | 第③關 FIX：閱讀與 u29-l01 同為「公司差點裁員」 |
| b2-u29-l02-q15 | questions/1/options/2 | 政府提供補助 | 是全鎮最大的工廠 | 第③關 FIX：閱讀與 u29-l01 同為「公司差點裁員」 |
| b2-u29-l02-q15 | questions/1/options/3 | 何先生借錢給工廠 | 老闆每年都會發獎金 | 第③關 FIX：閱讀與 u29-l01 同為「公司差點裁員」 |
| b2-u29-l02-q16 | rubricZh/2 | 時態配合內容（例如 are、rose） | 時態配合內容（例如 are、rose 等） | 評分要點：不寫死時態、「常見搭配」改「X 的用法，例如…等」、例如清單補「等」（b2cd1 裁示、第③關疑似 26） |
| b2-u29-l02-q17 | referenceEn/1 | My uncle spends his retirement growing vegetables in the countryside. | I want to travel around the world after my retirement. | 第③關 FIX：要點「常見搭配」改寫；情境表逐列人工重判：同課兩題事件類型相同，改寫（b1b4／b2cd1 裁示）：造句參考答案與聽選同為親人退休後的活動 |
| b2-u29-l02-q17 | rubricZh/1 | 常見搭配（例如 after my retirement、in retirement、spend his retirement 等） | retirement 的用法，例如 after my retirement、in retirement、spend his retirement 等 | 第③關 FIX：要點「常見搭配」改寫；情境表逐列人工重判：同課兩題事件類型相同，改寫（b1b4／b2cd1 裁示）：造句參考答案與聽選同為親人退休後的活動 |
| b2-u29-l02-q17 | rubricZh/2 | 時態配合內容（例如 hope、spends） | 時態合理（例如 hope、spends 等） | 第③關 FIX：要點「常見搭配」改寫；情境表逐列人工重判：同課兩題事件類型相同，改寫（b1b4／b2cd1 裁示）：造句參考答案與聽選同為親人退休後的活動 |
| b2-u29-l03-q01 | exampleEn | The capability of this old computer is very limited. | The company does not have the capability to build such large ships. | 單字卡第一義與例句一致（b2cd1 裁示） |
| b2-u29-l03-q01 | exampleZh | 這台舊電腦的效能非常有限。 | 這家公司沒有能力建造這麼大的船。 | 單字卡第一義與例句一致（b2cd1 裁示） |
| b2-u29-l03-q10 | audioEn | My aunt resigned from her job at the bank to take care of her new baby. | My uncle resigned from his job at the hotel to take care of his new baby. | 聽選正解不可照抄音檔：正解換說法、干擾項沿用音檔字詞（b2cd1 裁示）；音檔改叔叔、飯店，避免性別刻板印象與「辭去銀行工作」跨課重複（第③關疑似 1） |
| b2-u29-l03-q10 | audioZh | 我阿姨辭去銀行的工作，好照顧她剛出生的寶寶。 | 我叔叔辭去飯店的工作，好照顧他剛出生的寶寶。 | 聽選正解不可照抄音檔：正解換說法、干擾項沿用音檔字詞（b2cd1 裁示）；音檔改叔叔、飯店，避免性別刻板印象與「辭去銀行工作」跨課重複（第③關疑似 1） |
| b2-u29-l03-q10 | questionZh | 說話者的阿姨為什麼辭職？ | 說話者的叔叔為什麼辭職？ | 聽選正解不可照抄音檔：正解換說法、干擾項沿用音檔字詞（b2cd1 裁示）；音檔改叔叔、飯店，避免性別刻板印象與「辭去銀行工作」跨課重複（第③關疑似 1） |
| b2-u29-l03-q10 | options/0 | To move away | To study abroad | 聽選正解不可照抄音檔：正解換說法、干擾項沿用音檔字詞（b2cd1 裁示）；音檔改叔叔、飯店，避免性別刻板印象與「辭去銀行工作」跨課重複（第③關疑似 1） |
| b2-u29-l03-q10 | options/1 | To start her own small business | To start his own small hotel | 聽選正解不可照抄音檔：正解換說法、干擾項沿用音檔字詞（b2cd1 裁示）；音檔改叔叔、飯店，避免性別刻板印象與「辭去銀行工作」跨課重複（第③關疑似 1） |
| b2-u29-l03-q10 | options/2 | To study abroad | To move to a new city | 聽選正解不可照抄音檔：正解換說法、干擾項沿用音檔字詞（b2cd1 裁示）；音檔改叔叔、飯店，避免性別刻板印象與「辭去銀行工作」跨課重複（第③關疑似 1） |
| b2-u29-l03-q10 | options/3 | To look after her baby | To look after his child | 聽選正解不可照抄音檔：正解換說法、干擾項沿用音檔字詞（b2cd1 裁示）；音檔改叔叔、飯店，避免性別刻板印象與「辭去銀行工作」跨課重複（第③關疑似 1） |
| b2-u29-l03-q13 | stemEn | The ____ for the cancelled flight was a free hotel night and dinner. | The ____ for the cancelled flight was a free night at a hotel and a dinner. | 第③關疑似（照審查建議改） 21：搭配生硬 |
| b2-u29-l03-q15 | passageEn | A small robot company in Taichung wants to recruit twenty skilled engineers this year. The boss says that a degree is not enough; she looks for real competence. Each applicant must show what their own robot can do, and a panel tests its capability in a real factory. The company also tries to keep its workers happy. Its compensation is higher than average, and it pays extra into each worker's pension. Last year, only one engineer chose to resign, and she left to start her own company. "A competent engineer can find a job anywhere," the boss says, "so we must give them reasons to stay." | Mrs. Tsai is a bus mechanic, and this year she won the city's award for skilled workers. Ten years ago, the bus company recruited her straight from school. Today, her colleagues trust her competence: she can find a problem in an engine just by listening to it. Last year, a bigger company offered her a higher salary, but she did not resign. "My team is competent, and the compensation here is fair," she said. The company even pays extra into her pension. Now she helps test the capability of every new electric bus before it goes on the road. | 第③關 FIX：閱讀與 l04 同為徵才、「辭職創業」與 l01／l04 重複，改寫成得獎技工；第③關 FIX：閱讀改寫；用語 |
| b2-u29-l03-q15 | passageZh | 台中一家小型機器人公司今年想招募二十位熟練的工程師。老闆說光有學位是不夠的，她要找的是真正的能力。每位應徵者都必須展示自己的機器人能做什麼，評審小組會在真正的工廠裡測試它的效能。這家公司也努力讓員工開心。它的薪資報酬高於平均，還會為每位員工額外提撥退休金。去年只有一位工程師選擇辭職，她離開是為了自己創業。老闆說：「能幹的工程師到哪裡都找得到工作，所以我們必須給他們留下來的理由。」 | 蔡太太是一位公車技師，今年她得到了市政府頒給熟練技術人員的獎。十年前，公車公司在她一畢業就招募了她。如今，同事們都信任她的能力：她光聽引擎的聲音就能找出問題。去年，一家更大的公司開出更高的薪水，但她沒有辭職。她說：「我的團隊很能幹，這裡的薪資報酬也很公道。」公司甚至額外為她提撥退休金。現在她負責在每一輛新電動公車上路前，幫忙測試它的效能。 | 第③關 FIX：閱讀與 l04 同為徵才、「辭職創業」與 l01／l04 重複，改寫成得獎技工；第③關 FIX：閱讀改寫；用語 |
| b2-u29-l03-q15 | questions/0/questionZh | 應徵者需要做什麼？ | 去年另一家公司開出更高的薪水時，蔡太太怎麼做？ | 第③關 FIX：閱讀與 l04 同為徵才、「辭職創業」與 l01／l04 重複，改寫成得獎技工；第③關 FIX：閱讀改寫；用語 |
| b2-u29-l03-q15 | questions/0/options/0 | 展示自己的機器人能做什麼 | 沒有辭職，留了下來 | 第③關 FIX：閱讀與 l04 同為徵才、「辭職創業」與 l01／l04 重複，改寫成得獎技工；第③關 FIX：閱讀改寫；用語 |
| b2-u29-l03-q15 | questions/0/options/1 | 拿出大學的學位證書和成績單 | 馬上辭職，換到新公司上班 | 第③關 FIX：閱讀與 l04 同為徵才、「辭職創業」與 l01／l04 重複，改寫成得獎技工；第③關 FIX：閱讀改寫；用語 |
| b2-u29-l03-q15 | questions/0/options/2 | 通過英文考試 | 要求老闆替她加薪 | 第③關 FIX：閱讀與 l04 同為徵才、「辭職創業」與 l01／l04 重複，改寫成得獎技工；第③關 FIX：閱讀改寫；用語 |
| b2-u29-l03-q15 | questions/0/options/3 | 到工廠工作一天 | 去報名進修課程 | 第③關 FIX：閱讀與 l04 同為徵才、「辭職創業」與 l01／l04 重複，改寫成得獎技工；第③關 FIX：閱讀改寫；用語 |
| b2-u29-l03-q15 | questions/1/questionZh | 去年唯一辭職的工程師為什麼離開？ | 蔡太太現在還幫公司做什麼？ | 第③關 FIX：閱讀與 l04 同為徵才、「辭職創業」與 l01／l04 重複，改寫成得獎技工；第③關 FIX：閱讀改寫；用語 |
| b2-u29-l03-q15 | questions/1/options/0 | 和老闆吵架了 | 設計公車的新行駛路線 | 第③關 FIX：閱讀與 l04 同為徵才、「辭職創業」與 l01／l04 重複，改寫成得獎技工；第③關 FIX：閱讀改寫；用語 |
| b2-u29-l03-q15 | questions/1/options/1 | 想搬到國外住 | 招募剛從學校畢業的學生 | 第③關 FIX：閱讀與 l04 同為徵才、「辭職創業」與 l01／l04 重複，改寫成得獎技工；第③關 FIX：閱讀改寫；用語 |
| b2-u29-l03-q15 | questions/1/options/2 | 自己創業 | 測試新的電動公車 | 第③關 FIX：閱讀與 l04 同為徵才、「辭職創業」與 l01／l04 重複，改寫成得獎技工；第③關 FIX：閱讀改寫；用語 |
| b2-u29-l03-q15 | questions/1/options/3 | 要回學校念書 | 管理全公司員工的退休金 | 第③關 FIX：閱讀與 l04 同為徵才、「辭職創業」與 l01／l04 重複，改寫成得獎技工；第③關 FIX：閱讀改寫；用語 |
| b2-u29-l03-q16 | rubricZh/2 | 說習慣，時態配合內容（例如 is、always finishes） | 說習慣，時態配合內容（例如 is、always finishes 等） | 評分要點：不寫死時態、「常見搭配」改「X 的用法，例如…等」、例如清單補「等」（b2cd1 裁示、第③關疑似 26） |
| b2-u29-l03-q17 | rubricZh/2 | 時態配合內容（例如 wants to recruit、is recruiting） | 時態配合內容（例如 wants to recruit、is recruiting 等） | 評分要點：不寫死時態、「常見搭配」改「X 的用法，例如…等」、例如清單補「等」（b2cd1 裁示、第③關疑似 26） |
| b2-u29-l04-q01 | exampleZh | 他在泰國度假時考到了潛水證照。 | 他在泰國度假時取得了潛水資格。 | 第③關疑似（照審查建議改） 2：中譯對齊第一義「資格」 |
| b2-u29-l04-q04 | exampleEn | She skillfully avoided answering the reporter's difficult question. | The girl skillfully folded the paper into a bird. | 單字卡第一義與例句一致（b2cd1 裁示） |
| b2-u29-l04-q04 | exampleZh | 她巧妙地避開了記者的難題。 | 那個女孩熟練地把紙摺成一隻鳥。 | 單字卡第一義與例句一致（b2cd1 裁示） |
| b2-u29-l04-q09 | options/0 | Working on most weekends | Busy on most Saturdays and Sundays | 聽選正解不可照抄音檔：正解換說法、干擾項沿用音檔字詞（b2cd1 裁示） |
| b2-u29-l04-q09 | options/1 | A long trip to work | The pay is not good | 聽選正解不可照抄音檔：正解換說法、干擾項沿用音檔字詞（b2cd1 裁示） |
| b2-u29-l04-q09 | options/2 | A strict boss | A long trip to work | 聽選正解不可照抄音檔：正解換說法、干擾項沿用音檔字詞（b2cd1 裁示） |
| b2-u29-l04-q09 | options/3 | Not much pay | A very strict boss | 聽選正解不可照抄音檔：正解換說法、干擾項沿用音檔字詞（b2cd1 裁示） |
| b2-u29-l04-q13 | stemEn | A teaching ____ is required for this job. | This short course gives you a ____ in computer skills. | 情境表逐列人工重判：同課兩題事件類型相同，改寫（b1b4／b2cd1 裁示）：mcq 與閱讀同為「工作需要資格」 |
| b2-u29-l04-q13 | stemZh | 這份工作需要教師資格。 | 這門短期課程能讓你取得電腦技能的資格。 | 情境表逐列人工重判：同課兩題事件類型相同，改寫（b1b4／b2cd1 裁示）：mcq 與閱讀同為「工作需要資格」 |
| b2-u29-l04-q15 | promptZh | 他辭掉了一份高薪的工作，去鄉下開民宿。 | 她希望找到一份高薪又有趣的工作。 | 第③關 FIX：翻譯與 l01 q14 同為「辭職開店」，要點寫死位置；情境表逐列人工重判：同課兩題事件類型相同，改寫（b1b4／b2cd1 裁示）：翻譯與聽選同為「得到一份高薪工作」 |
| b2-u29-l04-q15 | referenceEn/0 | He quit a well-paid job to open a small hotel in the countryside. | She hopes to find a well-paid and interesting job. | 第③關 FIX：翻譯與 l01 q14 同為「辭職開店」，要點寫死位置；情境表逐列人工重判：同課兩題事件類型相同，改寫（b1b4／b2cd1 裁示）：翻譯與聽選同為「得到一份高薪工作」 |
| b2-u29-l04-q15 | referenceEn/1 | He left his well-paid job and opened a small guest house in the countryside. | She hopes to get a job that is interesting and well-paid. | 第③關 FIX：翻譯與 l01 q14 同為「辭職開店」，要點寫死位置；情境表逐列人工重判：同課兩題事件類型相同，改寫（b1b4／b2cd1 裁示）：翻譯與聽選同為「得到一份高薪工作」 |
| b2-u29-l04-q15 | rubricZh/0 | well-paid 放在名詞前（例如 a well-paid job 等） | well-paid 可放在名詞前或 be 動詞後（例如 a well-paid job、a job that is well-paid 等） | 第③關 FIX：翻譯與 l01 q14 同為「辭職開店」，要點寫死位置；情境表逐列人工重判：同課兩題事件類型相同，改寫（b1b4／b2cd1 裁示）：翻譯與聽選同為「得到一份高薪工作」 |
| b2-u29-l04-q15 | rubricZh/1 | 「辭掉」可寫，例如 quit、left、gave up 等 | 「希望」可寫，例如 hopes to、wants to 等 | 第③關 FIX：翻譯與 l01 q14 同為「辭職開店」，要點寫死位置；情境表逐列人工重判：同課兩題事件類型相同，改寫（b1b4／b2cd1 裁示）：翻譯與聽選同為「得到一份高薪工作」 |
| b2-u29-l04-q15 | rubricZh/2 | 「民宿」可寫，例如 a small hotel、a guest house 等 | （刪除） | 第③關 FIX：翻譯與 l01 q14 同為「辭職開店」，要點寫死位置；情境表逐列人工重判：同課兩題事件類型相同，改寫（b1b4／b2cd1 裁示）：翻譯與聽選同為「得到一份高薪工作」 |
| b2-u29-l04-q16 | referenceEn/0 | My grandmother is a skillful cook who never uses a recipe. | My cousin is a skillful dancer who has won many prizes. | 評分要點：不寫死時態、「常見搭配」改「X 的用法，例如…等」、例如清單補「等」（b2cd1 裁示、第③關疑似 26）；情境表逐列人工重判：同課兩題事件類型相同，改寫（b1b4／b2cd1 裁示）：造句參考答案與閱讀同為熟練廚師 |
| b2-u29-l04-q16 | rubricZh/2 | 時態配合內容（例如 is、was） | 時態配合內容（例如 is、was 等） | 評分要點：不寫死時態、「常見搭配」改「X 的用法，例如…等」、例如清單補「等」（b2cd1 裁示、第③關疑似 26）；情境表逐列人工重判：同課兩題事件類型相同，改寫（b1b4／b2cd1 裁示）：造句參考答案與閱讀同為熟練廚師 |
| b2-u30-l01-q02 | exampleEn | The police asked the public to cooperate with the investigation. | Farmers in the village cooperate to buy seeds at a lower price. | 單字卡第一義與例句一致（b2cd1 裁示） |
| b2-u30-l01-q02 | exampleZh | 警方請民眾配合調查。 | 村裡的農民合作，用比較低的價格買種子。 | 單字卡第一義與例句一致（b2cd1 裁示） |
| b2-u30-l01-q09 | audioEn | Our new distributor in Japan will start selling our tea next month. | Our distributor wants a lower price, so we will meet them on Monday to talk about it. | 聽選正解不可照抄音檔：正解換說法、干擾項沿用音檔字詞（b2cd1 裁示）；原音檔「日本經銷商賣我們的茶」與 l03 閱讀同事件，改寫（第③關 FIX） |
| b2-u30-l01-q09 | audioZh | 我們在日本的新經銷商下個月會開始賣我們的茶。 | 我們的經銷商想要更低的價格，所以我們星期一會和他們見面討論。 | 聽選正解不可照抄音檔：正解換說法、干擾項沿用音檔字詞（b2cd1 裁示）；原音檔「日本經銷商賣我們的茶」與 l03 閱讀同事件，改寫（第③關 FIX） |
| b2-u30-l01-q09 | questionZh | 新經銷商下個月會開始做什麼？ | 經銷商想要什麼？ | 聽選正解不可照抄音檔：正解換說法、干擾項沿用音檔字詞（b2cd1 裁示）；原音檔「日本經銷商賣我們的茶」與 l03 閱讀同事件，改寫（第③關 FIX） |
| b2-u30-l01-q09 | options/0 | Selling the tea | To pay less | 聽選正解不可照抄音檔：正解換說法、干擾項沿用音檔字詞（b2cd1 裁示）；原音檔「日本經銷商賣我們的茶」與 l03 閱讀同事件，改寫（第③關 FIX） |
| b2-u30-l01-q09 | options/1 | Building a new office | More time to pay | 聽選正解不可照抄音檔：正解換說法、干擾項沿用音檔字詞（b2cd1 裁示）；原音檔「日本經銷商賣我們的茶」與 l03 閱讀同事件，改寫（第③關 FIX） |
| b2-u30-l01-q09 | options/2 | Hiring more workers | A bigger order | 聽選正解不可照抄音檔：正解換說法、干擾項沿用音檔字詞（b2cd1 裁示）；原音檔「日本經銷商賣我們的茶」與 l03 閱讀同事件，改寫（第③關 FIX） |
| b2-u30-l01-q09 | options/3 | Opening a tea shop | A meeting on Monday | 聽選正解不可照抄音檔：正解換說法、干擾項沿用音檔字詞（b2cd1 裁示）；原音檔「日本經銷商賣我們的茶」與 l03 閱讀同事件，改寫（第③關 FIX） |
| b2-u30-l01-q13 | stemEn | The small bakery became ____ in its second year and now has three shops. | The new bus route was not ____, so the company stopped it after a year. | 同課兩題情境重複（第③關同課重複表）：mcq 與閱讀同為「小店第二年開始賺錢」 |
| b2-u30-l01-q13 | stemZh | 那家小麵包店在第二年開始賺錢，現在有三家店。 | 新的公車路線不賺錢，所以公司一年後就停駛了。 | 同課兩題情境重複（第③關同課重複表）：mcq 與閱讀同為「小店第二年開始賺錢」 |
| b2-u30-l01-q14 | passageZh | 五年前，陳妮娜（Nina Chen）創立了一家做天然肥皂的小公司。身為年輕的創業家，她沒什麼錢，所以她在網路上賣肥皂。網路商務幫助她接觸到全台灣的客戶，她的生意才兩年就開始賺錢。去年，一家大型經銷商提議把她的肥皂賣進超市，她答應了。後來，一家更大的公司提議合併。Nina 拒絕了，因為她想保有自己品牌的控制權。兩家公司反而決定合作推出一系列新的禮盒。現在 Nina 打算再招募五名員工。 | 五年前，Nina Chen 創立了一家做天然肥皂的小公司。身為年輕的創業家，她沒什麼錢，所以她在網路上賣肥皂。網路商務幫助她接觸到全台灣的客戶，她的生意才兩年就開始賺錢。去年，一家大型經銷商提議把她的肥皂賣進超市，她答應了。後來，一家更大的公司提議合併。Nina 拒絕了，因為她想保有自己品牌的控制權。兩家公司反而決定合作推出一系列新的禮盒。現在 Nina 打算再招募五名員工。 | 第②關 issue／第③關 FIX：中文欄人名不音譯 |
| b2-u30-l01-q15 | rubricZh/2 | 過去的事用過去式（例如 became、was） | 時態合理（例如 became、was 等） | 評分要點：不寫死時態、「常見搭配」改「X 的用法，例如…等」、例如清單補「等」（b2cd1 裁示、第③關疑似 26） |
| b2-u30-l01-q16 | rubricZh/1 | 常見搭配（例如 cooperate with someone、cooperate to do something 等） | cooperate 的用法，例如 cooperate with someone、cooperate to do something 等 | 評分要點：不寫死時態、「常見搭配」改「X 的用法，例如…等」、例如清單補「等」（b2cd1 裁示、第③關疑似 26） |
| b2-u30-l01-q16 | rubricZh/2 | 說過去的經驗，時態配合內容（例如 cooperated、have cooperated） | 說過去的經驗，時態配合內容（例如 cooperated、have cooperated 等） | 評分要點：不寫死時態、「常見搭配」改「X 的用法，例如…等」、例如清單補「等」（b2cd1 裁示、第③關疑似 26） |
| b2-u30-l02-q09 | options/0 | The budget for May | The new prices | 聽選正解不可照抄音檔：正解換說法、干擾項沿用音檔字詞（b2cd1 裁示）；最終複審 FIX #8：正解加了音檔沒說的「電視」 |
| b2-u30-l02-q09 | options/2 | A plan for the summer party | A plan for Thursday's party | 聽選正解不可照抄音檔：正解換說法、干擾項沿用音檔字詞（b2cd1 裁示）；最終複審 FIX #8：正解加了音檔沒說的「電視」 |
| b2-u30-l02-q09 | options/3 | The new advertisements | Their latest ads | 聽選正解不可照抄音檔：正解換說法、干擾項沿用音檔字詞（b2cd1 裁示）；最終複審 FIX #8：正解加了音檔沒說的「電視」 |
| b2-u30-l02-q13 | options/2 | prehistoric | merger | 第③關 FIX：干擾項 prehistoric 一眼可排除 |
| b2-u30-l02-q13 | optionGlossZh/2 | 史前的 | 合併 | 第③關 FIX：干擾項 prehistoric 一眼可排除 |
| b2-u30-l02-q14 | passageEn | Last year, a small drink enterprise in Tainan signed a contract with a large supermarket chain. To sell more, its marketing team created a contest: customers could design a new bottle label online. Participation was much higher than expected, with over ten thousand designs. The winning design came from a nurse who drew her hometown's old train station. Sales rose quickly, and the company's profit doubled. A bigger drink company then bought a small stake in the business. The owner says she will use the money to raise every worker's salary and to sponsor corporate events for charities. | Every year, a large shoe enterprise in Tainan holds a charity run, and its marketing team plans the whole event. This year, over five thousand people took part, and participation by families doubled. Each runner paid a small fee, and the company promised to give all the profit from the day to a children's library. Several corporate teams also ran together, wearing the same T-shirts. A local radio station signed a contract to report the race live. A nearby gym, in which the company has a small stake, let the runners use its showers for free. Some workers even spent part of their salary on drinks for the runners. | 第③關 FIX：閱讀與 l01 同為「小品牌→大通路→大公司入股」，改寫成企業公益路跑；第③關 FIX：閱讀改寫 |
| b2-u30-l02-q14 | passageZh | 去年，台南一家小型飲料企業和一家大型連鎖超市簽了約。為了提高銷量，它的行銷團隊辦了一場比賽：顧客可以上網設計新的瓶身標籤。參與的人遠比預期多，收到超過一萬件設計。獲勝的作品來自一位護理師，她畫了家鄉的老火車站。銷量很快上升，公司的利潤也翻了一倍。後來，一家更大的飲料公司買下了這家企業的一小部分股份。老闆說，她會用這筆錢替每位員工加薪，並贊助公益性質的企業活動。 | 每年，台南一家大型製鞋企業都會舉辦公益路跑，由行銷團隊規劃整個活動。今年有超過五千人參加，家庭的參與人數增加了一倍。每位跑者付一小筆報名費，公司承諾把當天的所有利潤捐給一間兒童圖書館。還有好幾支企業隊伍穿著同樣的 T 恤一起跑。一家地方電台簽了合約，現場轉播這場路跑。附近一家健身房（公司持有它的一小部分股份）免費讓跑者使用淋浴間。有些員工甚至花了部分薪水買飲料給跑者。 | 第③關 FIX：閱讀與 l01 同為「小品牌→大通路→大公司入股」，改寫成企業公益路跑；第③關 FIX：閱讀改寫 |
| b2-u30-l02-q14 | questions/0/questionZh | 行銷團隊辦的比賽內容是什麼？ | 今年的路跑有什麼不同？ | 第③關 FIX：閱讀與 l01 同為「小品牌→大通路→大公司入股」，改寫成企業公益路跑；第③關 FIX：閱讀改寫 |
| b2-u30-l02-q14 | questions/0/options/0 | 請員工拍一支介紹自家飲料的短影片 | 改在晚上才開始跑 | 第③關 FIX：閱讀與 l01 同為「小品牌→大通路→大公司入股」，改寫成企業公益路跑；第③關 FIX：閱讀改寫 |
| b2-u30-l02-q14 | questions/0/options/1 | 幫新飲料取個好名字 | 獎金比往年多了很多 | 第③關 FIX：閱讀與 l01 同為「小品牌→大通路→大公司入股」，改寫成企業公益路跑；第③關 FIX：閱讀改寫 |
| b2-u30-l02-q14 | questions/0/options/2 | 讓顧客上網設計新的瓶身標籤 | 參加的家庭增加了一倍 | 第③關 FIX：閱讀與 l01 同為「小品牌→大通路→大公司入股」，改寫成企業公益路跑；第③關 FIX：閱讀改寫 |
| b2-u30-l02-q14 | questions/0/options/3 | 到超市試喝並寫心得 | 路線經過台南市的每一個區 | 第③關 FIX：閱讀與 l01 同為「小品牌→大通路→大公司入股」，改寫成企業公益路跑；第③關 FIX：閱讀改寫 |
| b2-u30-l02-q14 | questions/1/questionZh | 公司的利潤有什麼變化？ | 公司答應把當天的利潤怎麼處理？ | 第③關 FIX：閱讀與 l01 同為「小品牌→大通路→大公司入股」，改寫成企業公益路跑；第③關 FIX：閱讀改寫 |
| b2-u30-l02-q14 | questions/1/options/0 | 掉到只剩三成 | 買新的跑鞋送給跑者 | 第③關 FIX：閱讀與 l01 同為「小品牌→大通路→大公司入股」，改寫成企業公益路跑；第③關 FIX：閱讀改寫 |
| b2-u30-l02-q14 | questions/1/options/1 | 比前年少了一點 | 分給所有參加的員工 | 第③關 FIX：閱讀與 l01 同為「小品牌→大通路→大公司入股」，改寫成企業公益路跑；第③關 FIX：閱讀改寫 |
| b2-u30-l02-q14 | questions/1/options/2 | 和去年差不多 | 存起來辦明年的活動 | 第③關 FIX：閱讀與 l01 同為「小品牌→大通路→大公司入股」，改寫成企業公益路跑；第③關 FIX：閱讀改寫 |
| b2-u30-l02-q14 | questions/1/options/3 | 變成兩倍 | 捐給兒童圖書館 | 第③關 FIX：閱讀與 l01 同為「小品牌→大通路→大公司入股」，改寫成企業公益路跑；第③關 FIX：閱讀改寫 |
| b2-u30-l02-q15 | referenceEn/0 | She works in marketing at a large company. | She is in charge of marketing at a large company. | 第②關 issue：work in 不等於「負責」 |
| b2-u30-l02-q15 | referenceEn/1 | She is in charge of marketing for a big company. | She is responsible for marketing at a big company. | 第②關 issue：work in 不等於「負責」 |
| b2-u30-l02-q15 | rubricZh/1 | 「負責」可寫，例如 be in charge of、work in 等 | 「負責」可寫，例如 be in charge of、be responsible for、handle 等 | 第②關 issue：work in 不等於「負責」 |
| b2-u30-l02-q16 | rubricZh/1 | 常見搭配（例如 sign a contract、a one-year contract 等） | contract 的用法，例如 sign a contract、a one-year contract 等 | 評分要點：不寫死時態、「常見搭配」改「X 的用法，例如…等」、例如清單補「等」（b2cd1 裁示、第③關疑似 26） |
| b2-u30-l02-q16 | rubricZh/2 | 說過去的經驗，時態配合內容（例如 signed、have signed） | 說過去的經驗，時態配合內容（例如 signed、have signed 等） | 評分要點：不寫死時態、「常見搭配」改「X 的用法，例如…等」、例如清單補「等」（b2cd1 裁示、第③關疑似 26） |
| b2-u30-l03-q08 | sentenceEn | Read the label carefully to see where the shirt was made. | The label on this bottle has fallen off. | 情境表逐列人工重判：同課兩題事件類型相同，改寫（b1b4／b2cd1 裁示）：聽打與造句同為看標籤找資訊 |
| b2-u30-l03-q08 | sentenceZh | 仔細看標籤，就知道這件襯衫是在哪裡製造的。 | 這個瓶子上的標籤掉了。 | 情境表逐列人工重判：同課兩題事件類型相同，改寫（b1b4／b2cd1 裁示）：聽打與造句同為看標籤找資訊 |
| b2-u30-l03-q09 | options/0 | The new office was very close | The workers moved very fast | 聽選正解不可照抄音檔：正解換說法、干擾項沿用音檔字詞（b2cd1 裁示） |
| b2-u30-l03-q09 | options/1 | The workers were very fast | The new office was very close | 聽選正解不可照抄音檔：正解換說法、干擾項沿用音檔字詞（b2cd1 裁示） |
| b2-u30-l03-q09 | options/2 | Everyone helped | Everyone worked together | 聽選正解不可照抄音檔：正解換說法、干擾項沿用音檔字詞（b2cd1 裁示） |
| b2-u30-l03-q09 | options/3 | Good weather | Nice weather that day | 聽選正解不可照抄音檔：正解換說法、干擾項沿用音檔字詞（b2cd1 裁示） |
| b2-u30-l03-q15 | promptZh | 感謝各位的合作，活動非常成功。 | 這個計畫需要所有家長的合作。 | 評分要點：不寫死時態、「常見搭配」改「X 的用法，例如…等」、例如清單補「等」（b2cd1 裁示、第③關疑似 26）；情境表逐列人工重判：同課兩題事件類型相同，改寫（b1b4／b2cd1 裁示）：翻譯與聽選同為「多虧大家合作，事情很順利」 |
| b2-u30-l03-q15 | referenceEn/0 | Thank you for your cooperation; the event was a great success. | This project needs the cooperation of all the parents. | 評分要點：不寫死時態、「常見搭配」改「X 的用法，例如…等」、例如清單補「等」（b2cd1 裁示、第③關疑似 26）；情境表逐列人工重判：同課兩題事件類型相同，改寫（b1b4／b2cd1 裁示）：翻譯與聽選同為「多虧大家合作，事情很順利」 |
| b2-u30-l03-q15 | referenceEn/1 | Thanks to everyone's cooperation, the event was very successful. | This plan needs cooperation from every parent. | 評分要點：不寫死時態、「常見搭配」改「X 的用法，例如…等」、例如清單補「等」（b2cd1 裁示、第③關疑似 26）；情境表逐列人工重判：同課兩題事件類型相同，改寫（b1b4／b2cd1 裁示）：翻譯與聽選同為「多虧大家合作，事情很順利」 |
| b2-u30-l03-q15 | rubricZh/1 | 「非常成功」可寫，例如 a great success、very successful 等 | 「需要」可寫，例如 needs、requires 等 | 評分要點：不寫死時態、「常見搭配」改「X 的用法，例如…等」、例如清單補「等」（b2cd1 裁示、第③關疑似 26）；情境表逐列人工重判：同課兩題事件類型相同，改寫（b1b4／b2cd1 裁示）：翻譯與聽選同為「多虧大家合作，事情很順利」 |
| b2-u30-l03-q15 | rubricZh/2 | 時態配合內容（例如 was、has been） | （刪除） | 評分要點：不寫死時態、「常見搭配」改「X 的用法，例如…等」、例如清單補「等」（b2cd1 裁示、第③關疑似 26）；情境表逐列人工重判：同課兩題事件類型相同，改寫（b1b4／b2cd1 裁示）：翻譯與聽選同為「多虧大家合作，事情很順利」 |
| b2-u30-l03-q16 | rubricZh/1 | 常見搭配（例如 read the label、the label on… 等） | label 的用法，例如 read the label、the label on… 等 | 評分要點：不寫死時態、「常見搭配」改「X 的用法，例如…等」、例如清單補「等」（b2cd1 裁示、第③關疑似 26） |
| b2-u30-l03-q16 | rubricZh/2 | 說習慣，時態配合內容（例如 read、always check） | 說習慣，時態配合內容（例如 read、always check 等） | 評分要點：不寫死時態、「常見搭配」改「X 的用法，例如…等」、例如清單補「等」（b2cd1 裁示、第③關疑似 26） |
| b2-u30-l04-q02 | exampleEn | Many sports stars endorse products they never use. | Products endorsed by famous people often sell better. | 第③關 FIX：卡與聽選同為運動員代言 |
| b2-u30-l04-q02 | exampleZh | 很多運動明星替自己從來不用的產品代言。 | 由名人代言的產品通常賣得比較好。 | 第③關 FIX：卡與聽選同為運動員代言 |
| b2-u30-l04-q04 | exampleEn | The two brothers became rivals when they both opened bakeries on the same street. | She beat her old rival in the final of the chess competition. | 第③關 FIX：卡與 mcq 同為兩家店互為對手 |
| b2-u30-l04-q04 | exampleZh | 那兩兄弟都在同一條街上開了麵包店，就此成了競爭對手。 | 她在西洋棋比賽的決賽中擊敗了老對手。 | 第③關 FIX：卡與 mcq 同為兩家店互為對手 |
| b2-u30-l04-q09 | options/0 | Promote the new running shoes | Help sell the shoes by promoting them | 聽選正解不可照抄音檔：正解換說法、干擾項沿用音檔字詞（b2cd1 裁示） |
| b2-u30-l04-q09 | options/1 | Play in a charity game | Buy a pair of the new shoes | 聽選正解不可照抄音檔：正解換說法、干擾項沿用音檔字詞（b2cd1 裁示） |
| b2-u30-l04-q09 | options/2 | Open a tennis school | Play in a charity game | 聽選正解不可照抄音檔：正解換說法、干擾項沿用音檔字詞（b2cd1 裁示） |
| b2-u30-l04-q09 | options/3 | Write a book | Open a tennis school | 聽選正解不可照抄音檔：正解換說法、干擾項沿用音檔字詞（b2cd1 裁示） |
| b2-u30-l04-q10 | sentenceEn | After a long meeting, the company made a small concession and raised wages by two percent. | The shop offers a concession of ten percent to students. | 同課兩題情境重複（第③關同課重複表）：跟讀與閱讀同為「公司讓步」 |
| b2-u30-l04-q10 | sentenceZh | 開了很久的會之後，公司稍微讓步，把工資調高了百分之二。 | 那家店給學生打九折的優惠。 | 同課兩題情境重複（第③關同課重複表）：跟讀與閱讀同為「公司讓步」 |
| b2-u30-l04-q13 | stemEn | Thanks to her excellent ____, she sold more cars than anyone else this year. | Her ____ is so good that customers often buy more than they planned. | 同課兩題情境重複（第③關同課重複表）：mcq 與閱讀同為 Thanks to … salesmanship；只看英文自查：新題幹 "Her label is so good…" 勉強說得通，label 換 merger |
| b2-u30-l04-q13 | stemZh | 多虧她出色的推銷技巧，她今年賣的車比誰都多。 | 她的推銷技巧好到顧客常常買得比原本打算的還多。 | 同課兩題情境重複（第③關同課重複表）：mcq 與閱讀同為 Thanks to … salesmanship；只看英文自查：新題幹 "Her label is so good…" 勉強說得通，label 換 merger |
| b2-u30-l04-q13 | options/2 | label | merger | 同課兩題情境重複（第③關同課重複表）：mcq 與閱讀同為 Thanks to … salesmanship；只看英文自查：新題幹 "Her label is so good…" 勉強說得通，label 換 merger |
| b2-u30-l04-q13 | optionGlossZh/2 | 標籤 | 合併 | 同課兩題情境重複（第③關同課重複表）：mcq 與閱讀同為 Thanks to … salesmanship；只看英文自查：新題幹 "Her label is so good…" 勉強說得通，label 換 merger |
| b2-u30-l04-q15 | rubricZh/1 | 「最重要的」用最高級（例如 the most important 等） | 「最重要的」可寫，例如 the most important、the main、the top 等 | 第③關 FIX：要點寫死最高級 |
| b2-u30-l04-q16 | referenceEn/1 | The two phone companies are rivals, so their prices are always similar. | My best friend became my rival when we both wanted the same role in a play. | 評分要點：不寫死時態、「常見搭配」改「X 的用法，例如…等」、例如清單補「等」（b2cd1 裁示、第③關疑似 26）；情境表逐列人工重判：同課兩題事件類型相同，改寫（b1b4／b2cd1 裁示）：造句參考答案與 mcq 同為兩家公司互為對手 |
| b2-u30-l04-q16 | rubricZh/2 | 時態配合內容（例如 has、are） | 時態配合內容（例如 has、are 等） | 評分要點：不寫死時態、「常見搭配」改「X 的用法，例如…等」、例如清單補「等」（b2cd1 裁示、第③關疑似 26）；情境表逐列人工重判：同課兩題事件類型相同，改寫（b1b4／b2cd1 裁示）：造句參考答案與 mcq 同為兩家公司互為對手 |
| b2-u31-l01-q03 | exampleEn | Many fans donated money to help rebuild the old temple. | Many people in the town donated money to help rebuild the old temple. | 第②關 issue／第③關 FIX：中譯多加「信眾」、fans 語意不明 |
| b2-u31-l01-q03 | exampleZh | 很多信眾和粉絲捐錢幫忙重建那座老廟。 | 鎮上很多人捐錢幫忙重建那座老廟。 | 第②關 issue／第③關 FIX：中譯多加「信眾」、fans 語意不明 |
| b2-u31-l01-q04 | exampleEn | Withdrawals of more than a thousand dollars need a manager's signature. | There were long lines for withdrawals before the holiday. | 第③關疑似（照審查建議改） 5：避免具體銀行規定 |
| b2-u31-l01-q04 | exampleZh | 提款超過一千元需要經理簽名。 | 放假前提款的人大排長龍。 | 第③關疑似（照審查建議改） 5：避免具體銀行規定 |
| b2-u31-l01-q05 | exampleEn | High rents pushed many small shops into bankruptcy. | Bankruptcy means that a company cannot pay what it owes. | 同課兩題情境重複（第③關同課重複表）：卡、mcq、閱讀都寫小店破產 |
| b2-u31-l01-q05 | exampleZh | 高昂的租金讓許多小店走向破產。 | 破產就是一家公司無法償還它欠的錢。 | 同課兩題情境重複（第③關同課重複表）：卡、mcq、閱讀都寫小店破產 |
| b2-u31-l01-q11 | options/0 | To pay for a meal | To shop at the airport | 聽選正解不可照抄音檔：正解換說法、干擾項沿用音檔字詞（b2cd1 裁示） |
| b2-u31-l01-q11 | options/1 | To have cash for the taxi | To pay for the taxi ride | 聽選正解不可照抄音檔：正解換說法、干擾項沿用音檔字詞（b2cd1 裁示） |
| b2-u31-l01-q11 | options/2 | To buy a gift | To pay for a meal | 聽選正解不可照抄音檔：正解換說法、干擾項沿用音檔字詞（b2cd1 裁示） |
| b2-u31-l01-q11 | options/3 | To pay a fee | To buy a gift | 聽選正解不可照抄音檔：正解換說法、干擾項沿用音檔字詞（b2cd1 裁示） |
| b2-u31-l01-q14 | stemEn | After years of losses, the airline went into ____ and stopped flying. | Without new customers, the small bookshop is close to ____. | 同課兩題情境重複（第③關同課重複表）：mcq 與閱讀同為 went into bankruptcy |
| b2-u31-l01-q14 | stemZh | 多年虧損之後，那家航空公司宣告破產，停止飛行。 | 沒有新客人的話，那家小書店就快破產了。 | 同課兩題情境重複（第③關同課重複表）：mcq 與閱讀同為 went into bankruptcy |
| b2-u31-l01-q15 | options/1 | profitable | skilled | 第③關疑似（照審查建議改） 6：profitable 只看英文勉強說得通 |
| b2-u31-l01-q15 | optionGlossZh/1 | 賺錢的 | 熟練的 | 第③關疑似（照審查建議改） 6：profitable 只看英文勉強說得通 |
| b2-u31-l01-q18 | referenceEn/1 | I have donated books to the library near my home. | I donated my old bicycle to a children's home last year. | 評分要點：不寫死時態、「常見搭配」改「X 的用法，例如…等」、例如清單補「等」（b2cd1 裁示、第③關疑似 26）；情境表逐列人工重判：同課兩題事件類型相同，改寫（b1b4／b2cd1 裁示）：造句參考答案與聽打同為捐書 |
| b2-u31-l01-q18 | rubricZh/1 | 常見搭配（例如 donate something to someone 等） | donate 的用法，例如 donate something to someone 等 | 評分要點：不寫死時態、「常見搭配」改「X 的用法，例如…等」、例如清單補「等」（b2cd1 裁示、第③關疑似 26）；情境表逐列人工重判：同課兩題事件類型相同，改寫（b1b4／b2cd1 裁示）：造句參考答案與聽打同為捐書 |
| b2-u31-l01-q18 | rubricZh/2 | 說過去的經驗，時態配合內容（例如 donated、have donated） | 說過去的經驗，時態配合內容（例如 donated、have donated 等） | 評分要點：不寫死時態、「常見搭配」改「X 的用法，例如…等」、例如清單補「等」（b2cd1 裁示、第③關疑似 26）；情境表逐列人工重判：同課兩題事件類型相同，改寫（b1b4／b2cd1 裁示）：造句參考答案與聽打同為捐書 |
| b2-u31-l02-q01 | exampleEn | My old washing machine is not very economical with water. | We stayed in an economical hotel near the station. | 單字卡第一義與例句一致（b2cd1 裁示） |
| b2-u31-l02-q01 | exampleZh | 我那台舊洗衣機不太省水。 | 我們住在車站附近一家經濟實惠的旅館。 | 單字卡第一義與例句一致（b2cd1 裁示） |
| b2-u31-l02-q11 | options/0 | Buy a new car | Buy a new family car | 聽選正解不可照抄音檔：正解換說法、干擾項沿用音檔字詞（b2cd1 裁示）；0.5–2 倍 |
| b2-u31-l02-q11 | options/1 | Move to a bigger apartment | Pay back the bank loan in full | 聽選正解不可照抄音檔：正解換說法、干擾項沿用音檔字詞（b2cd1 裁示）；0.5–2 倍 |
| b2-u31-l02-q11 | options/2 | Open a small cafe | Move to a new apartment | 聽選正解不可照抄音檔：正解換說法、干擾項沿用音檔字詞（b2cd1 裁示）；0.5–2 倍 |
| b2-u31-l02-q11 | options/3 | Build the new kitchen | Begin making a new kitchen | 聽選正解不可照抄音檔：正解換說法、干擾項沿用音檔字詞（b2cd1 裁示）；0.5–2 倍 |
| b2-u31-l02-q14 | options/0 | investor | banker | 第③關疑似（照審查建議改） 7：revenue 不可數，接 a 是文法線索 |
| b2-u31-l02-q14 | options/2 | revenue | investor | 第③關疑似（照審查建議改） 7：revenue 不可數，接 a 是文法線索 |
| b2-u31-l02-q14 | optionGlossZh/0 | 投資人 | 銀行家 | 第③關疑似（照審查建議改） 7：revenue 不可數，接 a 是文法線索 |
| b2-u31-l02-q14 | optionGlossZh/2 | 收入 | 投資人 | 第③關疑似（照審查建議改） 7：revenue 不可數，接 a 是文法線索 |
| b2-u31-l02-q17 | rubricZh/2 | 時態配合內容（例如 was、is） | 時態配合內容（例如 was、is 等） | 評分要點：不寫死時態、「常見搭配」改「X 的用法，例如…等」、例如清單補「等」（b2cd1 裁示、第③關疑似 26） |
| b2-u31-l02-q18 | rubricZh/1 | 常見搭配（例如 make a payment、cash payment、payment by card 等） | payment 的用法，例如 make a payment、cash payment、payment by card 等 | 評分要點：不寫死時態、「常見搭配」改「X 的用法，例如…等」、例如清單補「等」（b2cd1 裁示、第③關疑似 26） |
| b2-u31-l02-q18 | rubricZh/2 | 說習慣，用現在式（例如 make、prefer） | 說習慣，時態合理（例如 make、prefer 等） | 評分要點：不寫死時態、「常見搭配」改「X 的用法，例如…等」、例如清單補「等」（b2cd1 裁示、第③關疑似 26） |
| b2-u31-l03-q07 | exampleEn | We had a frugal dinner of bread and soup. | My frugal roommate cuts his own hair to save money. | 單字卡第一義與例句一致（b2cd1 裁示） |
| b2-u31-l03-q07 | exampleZh | 我們吃了一頓只有麵包和湯的簡單晚餐。 | 我那位節儉的室友自己剪頭髮來省錢。 | 單字卡第一義與例句一致（b2cd1 裁示） |
| b2-u31-l03-q09 | sentenceEn | My parents finally paid off their mortgage after twenty years. | Paying the mortgage takes almost half of my salary. | 同課兩題情境重複（第③關同課重複表）：聽打與閱讀同為「還清房貸」；情境表逐列人工重判：單字卡與他題事件類型相同，改寫卡例句（b1b4／b2cd1 裁示）：卡與聽打同為「申請／取得房貸」 |
| b2-u31-l03-q09 | sentenceZh | 我爸媽二十年後終於還清了房貸。 | 付房貸幾乎用掉我一半的薪水。 | 同課兩題情境重複（第③關同課重複表）：聽打與閱讀同為「還清房貸」；情境表逐列人工重判：單字卡與他題事件類型相同，改寫卡例句（b1b4／b2cd1 裁示）：卡與聽打同為「申請／取得房貸」 |
| b2-u31-l03-q10 | options/0 | Close two public libraries | Close two public libraries this year | 聽選正解不可照抄音檔：正解換說法、干擾項沿用音檔字詞（b2cd1 裁示） |
| b2-u31-l03-q10 | options/1 | Delay the new pool | Build the pool later than planned | 聽選正解不可照抄音檔：正解換說法、干擾項沿用音檔字詞（b2cd1 裁示） |
| b2-u31-l03-q10 | options/2 | Raise bus fares | Cut the budget for parks | 聽選正解不可照抄音檔：正解換說法、干擾項沿用音檔字詞（b2cd1 裁示） |
| b2-u31-l03-q10 | options/3 | Cut staff pay | Raise the bus fares | 聽選正解不可照抄音檔：正解換說法、干擾項沿用音檔字詞（b2cd1 裁示） |
| b2-u31-l03-q16 | rubricZh/2 | 說習慣，用現在式（例如 watches、reads） | 說習慣，時態合理（例如 watches、reads 等） | 評分要點：不寫死時態、「常見搭配」改「X 的用法，例如…等」、例如清單補「等」（b2cd1 裁示、第③關疑似 26） |
| b2-u31-l03-q17 | rubricZh/2 | 時態配合內容（例如 has、drives） | 時態配合內容（例如 has、drives 等） | 評分要點：不寫死時態、「常見搭配」改「X 的用法，例如…等」、例如清單補「等」（b2cd1 裁示、第③關疑似 26） |
| b2-u32-l01-q08 | exampleEn | The shipping costs more than the book itself. | The company pays extra for faster shipping. | 單字卡第一義與例句一致（b2cd1 裁示）；與跟讀同主詞同情境 |
| b2-u32-l01-q08 | exampleZh | 運費比書本身還貴。 | 那家公司多付錢，讓貨送得更快。 | 單字卡第一義與例句一致（b2cd1 裁示）；與跟讀同主詞同情境 |
| b2-u32-l01-q10 | options/0 | Made of real leather | Half price this week only | 聽選正解不可照抄音檔：正解換說法、干擾項沿用音檔字詞（b2cd1 裁示） |
| b2-u32-l01-q10 | options/1 | Half price this week | Can't be ordered any more | 聽選正解不可照抄音檔：正解換說法、干擾項沿用音檔字詞（b2cd1 裁示） |
| b2-u32-l01-q10 | options/2 | None in that size | Sold out in that size | 聽選正解不可照抄音檔：正解換說法、干擾項沿用音檔字詞（b2cd1 裁示） |
| b2-u32-l01-q10 | options/3 | Available only in red | Available only in dark red | 聽選正解不可照抄音檔：正解換說法、干擾項沿用音檔字詞（b2cd1 裁示） |
| b2-u32-l01-q11 | sentenceEn | We import most of our coffee beans from South America. | The country imports more oil than any other product. | 情境表逐列人工重判：同課兩題事件類型相同，改寫（b1b4／b2cd1 裁示）：跟讀與閱讀同為「商品從某國進口」 |
| b2-u32-l01-q11 | sentenceZh | 我們大部分的咖啡豆都是從南美洲進口的。 | 這個國家進口最多的產品是石油。 | 情境表逐列人工重判：同課兩題事件類型相同，改寫（b1b4／b2cd1 裁示）：跟讀與閱讀同為「商品從某國進口」 |
| b2-u32-l01-q14 | stemEn | You can ____ tickets online or at the station. | You can ____ tickets from the machine at the station. | 情境表逐列人工重判：同課兩題事件類型相同，改寫（b1b4／b2cd1 裁示）：mcq 與閱讀同為網路購買 |
| b2-u32-l01-q14 | stemZh | 你可以在網路上或車站購買車票。 | 你可以在車站的機器購買車票。 | 情境表逐列人工重判：同課兩題事件類型相同，改寫（b1b4／b2cd1 裁示）：mcq 與閱讀同為網路購買 |
| b2-u32-l01-q15 | passageEn | Every Monday, Ms. Su checks the stock in her small kitchen shop. If something is running low, she places an order with her supplier. Most of her pots and knives are imported from Japan, so shipping can take two weeks. Last month, a big order arrived on a Friday evening, and her son helped her unload the boxes. One box was full of small packets of tea, which she had not ordered. When she called the supplier, they told her to keep the tea as a gift. Ms. Su is also thinking of opening a second shop in the new outlet mall near the airport, where customers can make a purchase online and pick it up the same day. She will pay for it with a small loan. | Every Monday, Ms. Su checks the stock in her small kitchen shop. If something is running low, she places an order with her supplier. Most of her pots and knives are imported from Japan, so shipping can take two weeks. Last month, a big order arrived on a Friday evening, and her son helped her unload the boxes. One box was full of small packets of tea, which she had not ordered. When she called the supplier, they told her to keep the tea as a gift. Ms. Su is also thinking of opening a second shop in the new outlet mall near the airport, where customers can make a purchase online and collect it at the shop the same day. She will pay for it with a small loan. | 第②關 issue：邏輯補清楚（網購、店取）；第②關 issue |
| b2-u32-l01-q15 | passageZh | 每個星期一，蘇小姐都會檢查她那家小廚具店的存貨。如果有東西快賣完了，她就向供應商下訂單。她的鍋子和刀子大多是從日本進口的，所以運送可能要兩個星期。上個月，一批大訂單在星期五晚上送到，她兒子幫她卸下箱子。其中一箱裝滿了小包的茶葉，那是她沒有訂的。她打電話給供應商，對方說茶葉就留著當禮物。蘇小姐也在考慮到機場附近新開的暢貨中心開第二家店，顧客可以在網路上購買，當天取貨。她會用一筆小額貸款來支付開店費用。 | 每個星期一，蘇小姐都會檢查她那家小廚具店的存貨。如果有東西快賣完了，她就向供應商下訂單。她的鍋子和刀子大多是從日本進口的，所以運送可能要兩個星期。上個月，一批大訂單在星期五晚上送到，她兒子幫她卸下箱子。其中一箱裝滿了小包的茶葉，那是她沒有訂的。她打電話給供應商，對方說茶葉就留著當禮物。蘇小姐也在考慮到機場附近新開的暢貨中心開第二家店，顧客可以在網路上購買，當天到店取貨。她會用一筆小額貸款來支付開店費用。 | 第②關 issue：邏輯補清楚（網購、店取）；第②關 issue |
| b2-u32-l01-q16 | promptZh | 這是我這個月最大的一筆購買。 | 這是我這個月買過最貴的東西。 | 第②關 issue／第③關疑似（照審查建議改） 15：中文不自然 |
| b2-u32-l01-q16 | referenceEn/0 | This is my biggest purchase this month. | This is my most expensive purchase this month. | 第②關 issue／第③關疑似（照審查建議改） 15：中文不自然 |
| b2-u32-l01-q16 | referenceEn/1 | This is the biggest purchase I have made this month. | This is the most expensive purchase I have made this month. | 第②關 issue／第③關疑似（照審查建議改） 15：中文不自然 |
| b2-u32-l01-q16 | rubricZh/0 | 「購買（的東西）」可寫，例如 purchase 等 | 「買過的東西」要用到 purchase（例如 my most expensive purchase、my biggest purchase 等） | 第②關 issue／第③關疑似（照審查建議改） 15：中文不自然 |
| b2-u32-l01-q16 | rubricZh/1 | 最高級（例如 my biggest purchase、the largest purchase 等） | 最高級寫法不限（例如 the most expensive、the biggest 等） | 第②關 issue／第③關疑似（照審查建議改） 15：中文不自然 |
| b2-u32-l01-q17 | rubricZh/1 | 常見搭配（例如 an outlet mall、an outlet store 等） | outlet 的用法，例如 an outlet mall、an outlet store 等 | 評分要點：不寫死時態、「常見搭配」改「X 的用法，例如…等」、例如清單補「等」（b2cd1 裁示、第③關疑似 26） |
| b2-u32-l01-q17 | rubricZh/2 | 時態配合內容（例如 bought、like） | 時態配合內容（例如 bought、like 等） | 評分要點：不寫死時態、「常見搭配」改「X 的用法，例如…等」、例如清單補「等」（b2cd1 裁示、第③關疑似 26） |
| b2-u33-l01-q03 | exampleEn | The hotel holds a cocktail party for new guests every Friday. | This cocktail is made with orange juice and lemon. | 第③關疑似（照審查建議改） 3：例句是 cocktail party（第二義） |
| b2-u33-l01-q03 | exampleZh | 飯店每週五都會為新房客舉辦雞尾酒會。 | 這杯雞尾酒是用柳橙汁和檸檬調成的。 | 第③關疑似（照審查建議改） 3：例句是 cocktail party（第二義） |
| b2-u33-l01-q08 | sentenceEn | Thank you for your warm hospitality during our visit to Tainan. | Many hospitality workers have to work on holidays. | 情境表逐列人工重判：單字卡與他題事件類型相同，改寫卡例句（b1b4／b2cd1 裁示）：卡與聽打同為「旅途中受到熱情款待」；最終複審 FIX #9：聽打和閱讀同為店家以熱情款待聞名，改成餐旅業員工假日上班 |
| b2-u33-l01-q08 | sentenceZh | 謝謝你們在我們到台南期間的熱情款待。 | 很多餐旅業的工作人員假日都得上班。 | 情境表逐列人工重判：單字卡與他題事件類型相同，改寫卡例句（b1b4／b2cd1 裁示）：卡與聽打同為「旅途中受到熱情款待」；最終複審 FIX #9：聽打和閱讀同為店家以熱情款待聞名，改成餐旅業員工假日上班 |
| b2-u33-l01-q09 | options/0 | Bring lunch for fifty people | Deliver food for a large group | 聽選正解不可照抄音檔：正解換說法、干擾項沿用音檔字詞（b2cd1 裁示） |
| b2-u33-l01-q09 | options/1 | Set up a coffee bar in the lobby | Set up a coffee bar in the meeting room | 聽選正解不可照抄音檔：正解換說法、干擾項沿用音檔字詞（b2cd1 裁示） |
| b2-u33-l01-q09 | options/2 | Clean the kitchen | Cook dinner for fifty | 聽選正解不可照抄音檔：正解換說法、干擾項沿用音檔字詞（b2cd1 裁示） |
| b2-u33-l01-q09 | options/3 | Cook a dinner | Clean the kitchen | 聽選正解不可照抄音檔：正解換說法、干擾項沿用音檔字詞（b2cd1 裁示） |
| b2-u33-l01-q10 | sentenceEn | The bartender made me a fruit drink without any alcohol. | The bartender has worked at this hotel for twenty years. | 同課兩題情境重複（第③關同課重複表）：跟讀與閱讀同為調酒師調無酒精果汁 |
| b2-u33-l01-q10 | sentenceZh | 調酒師幫我調了一杯不含酒精的果汁飲料。 | 那位調酒師已經在這家飯店工作了二十年。 | 同課兩題情境重複（第③關同課重複表）：跟讀與閱讀同為調酒師調無酒精果汁 |
| b2-u33-l01-q11 | sentenceEn | My grandmother's recipe for pineapple cake is a family secret. | This recipe for pineapple cake uses very little sugar. | 同課兩題情境重複（第③關同課重複表）：跟讀與閱讀同為奶奶的食譜 |
| b2-u33-l01-q11 | sentenceZh | 我奶奶的鳳梨酥食譜是家族祕密。 | 這份鳳梨酥食譜只用很少的糖。 | 同課兩題情境重複（第③關同課重複表）：跟讀與閱讀同為奶奶的食譜 |
| b2-u33-l01-q12 | stemEn | The company hired a ____ service to provide food for the wedding. | The concert hall has its own ____ service for parties after the show. | 同課兩題情境重複（第③關同課重複表）：mcq 與閱讀同為婚宴請外燴；情境表逐列人工重判：同課兩題事件類型相同，改寫（b1b4／b2cd1 裁示）：mcq 與聽選同為公司會議請外燴 |
| b2-u33-l01-q12 | stemZh | 那家公司請了外燴服務來提供婚禮的餐點。 | 那座音樂廳有自己的外燴服務，供演出後的派對使用。 | 同課兩題情境重複（第③關同課重複表）：mcq 與閱讀同為婚宴請外燴；情境表逐列人工重判：同課兩題事件類型相同，改寫（b1b4／b2cd1 裁示）：mcq 與聽選同為公司會議請外燴 |
| b2-u33-l01-q15 | rubricZh/1 | 常見搭配（例如 the recipe for this soup 等） | recipe 的用法，例如 the recipe for this soup 等 | 評分要點：不寫死時態、「常見搭配」改「X 的用法，例如…等」、例如清單補「等」（b2cd1 裁示、第③關疑似 26） |
| b2-u33-l01-q16 | rubricZh/1 | 時態配合內容（例如 visited、makes） | 時態配合內容（例如 visited、makes 等） | 評分要點：不寫死時態、「常見搭配」改「X 的用法，例如…等」、例如清單補「等」（b2cd1 裁示、第③關疑似 26） |
| b2-u34-l01-q09 | sentenceEn | Our flight to Paris includes a two-day stopover in Dubai. | The ferry makes a short stopover at a small island. | 第③關疑似（照審查建議改） 17：聽打與卡同為轉機停留 |
| b2-u34-l01-q09 | sentenceZh | 我們飛巴黎的行程包括在杜拜停留兩天。 | 渡輪會在一座小島短暫停靠。 | 第③關疑似（照審查建議改） 17：聽打與卡同為轉機停留 |
| b2-u34-l01-q10 | audioEn | The hotel was overbooked, so they gave us a free room at a nicer hotel nearby. | Our flight was overbooked, so the airline asked us to take the next one in the afternoon. | 聽選正解不可照抄音檔：正解換說法、干擾項沿用音檔字詞（b2cd1 裁示）；原音檔「飯店超賣換好房」與閱讀同事件，改成班機超賣（第③關 FIX）；最終複審 FIX #10：三個干擾項都沒用音檔字，改一個干擾項沿用 afternoon、flight |
| b2-u34-l01-q10 | audioZh | 那家飯店超賣了，所以他們免費讓我們住附近一家更好的飯店。 | 我們的班機超賣了，所以航空公司請我們改搭下午的下一班。 | 聽選正解不可照抄音檔：正解換說法、干擾項沿用音檔字詞（b2cd1 裁示）；原音檔「飯店超賣換好房」與閱讀同事件，改成班機超賣（第③關 FIX）；最終複審 FIX #10：三個干擾項都沒用音檔字，改一個干擾項沿用 afternoon、flight |
| b2-u34-l01-q10 | questionZh | 飯店超賣後怎麼處理？ | 班機超賣後，航空公司請說話者怎麼做？ | 聽選正解不可照抄音檔：正解換說法、干擾項沿用音檔字詞（b2cd1 裁示）；原音檔「飯店超賣換好房」與閱讀同事件，改成班機超賣（第③關 FIX）；最終複審 FIX #10：三個干擾項都沒用音檔字，改一個干擾項沿用 afternoon、flight |
| b2-u34-l01-q10 | options/0 | Offered a free dinner | Fly to another city first | 聽選正解不可照抄音檔：正解換說法、干擾項沿用音檔字詞（b2cd1 裁示）；原音檔「飯店超賣換好房」與閱讀同事件，改成班機超賣（第③關 FIX）；最終複審 FIX #10：三個干擾項都沒用音檔字，改一個干擾項沿用 afternoon、flight |
| b2-u34-l01-q10 | options/1 | Gave them a cash refund | Pay more for the afternoon flight | 聽選正解不可照抄音檔：正解換說法、干擾項沿用音檔字詞（b2cd1 裁示）；原音檔「飯店超賣換好房」與閱讀同事件，改成班機超賣（第③關 FIX）；最終複審 FIX #10：三個干擾項都沒用音檔字，改一個干擾項沿用 afternoon、flight |
| b2-u34-l01-q10 | options/2 | Asked them to wait a day | Wait at the airport hotel | 聽選正解不可照抄音檔：正解換說法、干擾項沿用音檔字詞（b2cd1 裁示）；原音檔「飯店超賣換好房」與閱讀同事件，改成班機超賣（第③關 FIX）；最終複審 FIX #10：三個干擾項都沒用音檔字，改一個干擾項沿用 afternoon、flight |
| b2-u34-l01-q10 | options/3 | Moved them to a better hotel for free | Take a later flight that day | 聽選正解不可照抄音檔：正解換說法、干擾項沿用音檔字詞（b2cd1 裁示）；原音檔「飯店超賣換好房」與閱讀同事件，改成班機超賣（第③關 FIX）；最終複審 FIX #10：三個干擾項都沒用音檔字，改一個干擾項沿用 afternoon、flight |
| b2-u34-l01-q13 | stemEn | The price of the tour includes ____ in a three-star hotel. | The price of the tour includes the ____ at a three-star hotel. | 第③關 FIX：可數性洩題（route、outlet 不加冠詞放不進空格） |
| b2-u34-l01-q15 | passageEn | For our tenth wedding anniversary, my husband and I planned a trip to an exotic island in the Indian Ocean. The cheapest route had a long stopover in Singapore, so we spent a night there and walked around the city. When we arrived at the island, we found that our hotel was overbooked. The manager apologized and moved us to a beach house with its own small spa, at no extra cost. The landing on the island was a little scary, because the airport is very small. The accommodation was simple but clean, and the local hospitality made us feel at home. After so many long-distance flights, though, we promised that our next holiday would be closer to home. | For our tenth wedding anniversary, my husband and I planned a trip to an exotic island in the Indian Ocean. The cheapest route had a long stopover in Singapore, so we spent a night there and walked around the city. The landing on the island was a little scary, because the airport is very small. When we arrived at the island, we found that our hotel was overbooked. The manager apologized and moved us to a beach house with its own small spa, at no extra cost. The accommodation was simple but clean, and the local hospitality made us feel at home. After so many long-distance flights, though, we promised that our next holiday would be closer to home. | 第②關 issue／第③關疑似（照審查建議改） 16：敘事時序，降落句移到抵達之前 |
| b2-u34-l01-q15 | passageZh | 為了慶祝結婚十週年，我和先生計畫到印度洋上一座充滿異國風情的島嶼旅行。最便宜的路線要在新加坡停留很久，所以我們在那裡住了一晚，到市區走走。抵達小島時，我們發現飯店超賣了。經理向我們道歉，並讓我們免費改住一間附有小型水療池的海灘小屋。在島上降落時有點可怕，因為機場非常小。住處簡單但乾淨，當地人的熱情款待讓我們覺得像在家一樣。不過，搭了這麼多趟長途飛機之後，我們約定下次度假要離家近一點。 | 為了慶祝結婚十週年，我和先生計畫到印度洋上一座充滿異國風情的島嶼旅行。最便宜的路線要在新加坡停留很久，所以我們在那裡住了一晚，到市區走走。在島上降落時有點可怕，因為機場非常小。抵達小島時，我們發現飯店超賣了。經理向我們道歉，並讓我們免費改住一間附有小型水療池的海灘小屋。住處簡單但乾淨，當地人的熱情款待讓我們覺得像在家一樣。不過，搭了這麼多趟長途飛機之後，我們約定下次度假要離家近一點。 | 第②關 issue／第③關疑似（照審查建議改） 16：敘事時序，降落句移到抵達之前 |
| b2-u34-l01-q17 | rubricZh/2 | 說習慣，用現在式（例如 prefer、look for） | 說習慣，時態合理（例如 prefer、look for 等） | 評分要點：不寫死時態、「常見搭配」改「X 的用法，例如…等」、例如清單補「等」（b2cd1 裁示、第③關疑似 26） |
| b2-u35-l01-q11 | sentenceEn | The museum will exhibit paintings by young local artists next month. | A rare golden car will be exhibited at the station for one week. | 情境表逐列人工重判：同課兩題事件類型相同，改寫（b1b4／b2cd1 裁示）：聽打與閱讀同為藝術家展出畫作；最終複審 FIX #11：聽打和閱讀同為展出畫作，改成車站展出金色汽車 |
| b2-u35-l01-q11 | sentenceZh | 博物館下個月將展出當地年輕藝術家的畫作。 | 一輛罕見的金色汽車將在車站展出一週。 | 情境表逐列人工重判：同課兩題事件類型相同，改寫（b1b4／b2cd1 裁示）：聽打與閱讀同為藝術家展出畫作；最終複審 FIX #11：聽打和閱讀同為展出畫作，改成車站展出金色汽車 |
| b2-u35-l01-q12 | options/0 | Just before seven o'clock | At a quarter to six | 聽選正解不可照抄音檔：正解換說法、干擾項沿用音檔字詞（b2cd1 裁示）；執行長小修：選項 At a quarter to six o'clock 去掉 o'clock |
| b2-u35-l01-q12 | options/1 | At a quarter to six | Just after the rehearsal starts | 聽選正解不可照抄音檔：正解換說法、干擾項沿用音檔字詞（b2cd1 裁示）；執行長小修：選項 At a quarter to six o'clock 去掉 o'clock |
| b2-u35-l01-q12 | options/2 | By half past five | Thirty minutes before six | 聽選正解不可照抄音檔：正解換說法、干擾項沿用音檔字詞（b2cd1 裁示）；執行長小修：選項 At a quarter to six o'clock 去掉 o'clock |
| b2-u35-l01-q15 | stemEn | Hundreds of young singers came to the ____ for the new musical, but only three were chosen. | Only three dancers passed the ____ and joined the company. | 情境表逐列人工重判：同課兩題事件類型相同，改寫（b1b4／b2cd1 裁示）：mcq 與閱讀同為音樂劇試演 |
| b2-u35-l01-q15 | stemZh | 幾百位年輕歌手來參加新音樂劇的試鏡，但只有三位被選上。 | 只有三位舞者通過試鏡，加入了舞團。 | 情境表逐列人工重判：同課兩題事件類型相同，改寫（b1b4／b2cd1 裁示）：mcq 與閱讀同為音樂劇試演 |
| b2-u35-l01-q18 | rubricZh/1 | 過去的事用過去式（例如 went） | 時態合理（例如 went 等） | 評分要點：不寫死時態、「常見搭配」改「X 的用法，例如…等」、例如清單補「等」（b2cd1 裁示、第③關疑似 26） |
| b2-u35-l01-q19 | rubricZh/1 | 常見搭配（例如 for recreation、a form of recreation 等） | recreation 的用法，例如 for recreation、a form of recreation 等 | 評分要點：不寫死時態、「常見搭配」改「X 的用法，例如…等」、例如清單補「等」（b2cd1 裁示、第③關疑似 26） |
| b2-u35-l01-q19 | rubricZh/2 | 說習慣，用現在式（例如 go、is） | 說習慣，時態合理（例如 go、is 等） | 評分要點：不寫死時態、「常見搭配」改「X 的用法，例如…等」、例如清單補「等」（b2cd1 裁示、第③關疑似 26） |
| b2-u36-l01-q03 | exampleEn | He had six months of speech therapy after the accident. | He goes to speech therapy every Tuesday after school. | 第③關疑似（照審查建議改） 8：避免意外傷病情境 |
| b2-u36-l01-q03 | exampleZh | 那次意外之後，他做了六個月的語言治療。 | 他每週二放學後去上語言治療課。 | 第③關疑似（照審查建議改） 8：避免意外傷病情境 |
| b2-u36-l01-q04 | exampleEn | Therapists often work in schools as well as hospitals. | A good therapist listens carefully and never laughs at your problems. | 第③關疑似（照審查建議改） 10：卡與跟讀同在講治療師在哪工作；最終複審 FIX #12：卡和閱讀同為讀書成為治療師，改成好治療師的樣子 |
| b2-u36-l01-q04 | exampleZh | 治療師除了在醫院，也常在學校工作。 | 好的治療師會仔細傾聽，從不嘲笑你的問題。 | 第③關疑似（照審查建議改） 10：卡與跟讀同在講治療師在哪工作；最終複審 FIX #12：卡和閱讀同為讀書成為治療師，改成好治療師的樣子 |
| b2-u36-l01-q06 | exampleEn | The singer was hospitalized and had to cancel her concert. | Most patients who are hospitalized here stay for less than three days. | 最終複審 FIX #13：卡和聽選同為有人住院→活動取消或改期，改卡 |
| b2-u36-l01-q06 | exampleZh | 那位歌手住院了，只好取消演唱會。 | 在這裡住院的病人大多住不到三天。 | 最終複審 FIX #13：卡和聽選同為有人住院→活動取消或改期，改卡 |
| b2-u36-l01-q08 | audioEn | My grandfather was hospitalized for a week, but he is back home now and feeling fine. | Our manager was hospitalized for two days, so the meeting has been moved to next Monday. | 聽選正解不可照抄音檔：正解換說法、干擾項沿用音檔字詞（b2cd1 裁示）；原音檔「爺爺住院」與閱讀「奶奶住院」同事件，改寫（第③關 FIX） |
| b2-u36-l01-q08 | audioZh | 我爺爺住院一個星期，不過他現在已經回家，感覺很好。 | 我們經理住院兩天，所以會議改到下星期一。 | 聽選正解不可照抄音檔：正解換說法、干擾項沿用音檔字詞（b2cd1 裁示）；原音檔「爺爺住院」與閱讀「奶奶住院」同事件，改寫（第③關 FIX） |
| b2-u36-l01-q08 | questionZh | 說話者的爺爺現在怎麼樣？ | 會議為什麼改期？ | 聽選正解不可照抄音檔：正解換說法、干擾項沿用音檔字詞（b2cd1 裁示）；原音檔「爺爺住院」與閱讀「奶奶住院」同事件，改寫（第③關 FIX） |
| b2-u36-l01-q08 | options/0 | Still staying in the hospital | The manager was on a trip abroad | 聽選正解不可照抄音檔：正解換說法、干擾項沿用音檔字詞（b2cd1 裁示）；原音檔「爺爺住院」與閱讀「奶奶住院」同事件，改寫（第③關 FIX） |
| b2-u36-l01-q08 | options/1 | Home and feeling well | The manager was in hospital | 聽選正解不可照抄音檔：正解換說法、干擾項沿用音檔字詞（b2cd1 裁示）；原音檔「爺爺住院」與閱讀「奶奶住院」同事件，改寫（第③關 FIX） |
| b2-u36-l01-q08 | options/2 | Moving to a new city | The room was being cleaned | 聽選正解不可照抄音檔：正解換說法、干擾項沿用音檔字詞（b2cd1 裁示）；原音檔「爺爺住院」與閱讀「奶奶住院」同事件，改寫（第③關 FIX） |
| b2-u36-l01-q08 | options/3 | Living abroad | Too many people were away | 聽選正解不可照抄音檔：正解換說法、干擾項沿用音檔字詞（b2cd1 裁示）；原音檔「爺爺住院」與閱讀「奶奶住院」同事件，改寫（第③關 FIX） |
| b2-u36-l01-q11 | stemEn | Scientists are working on a new ____ against the flu. | The ____ must be kept cold, so the truck that carries it has a fridge. | 第③關疑似（照審查建議改） 9：mcq 與閱讀同為科學家研發疫苗；用語 |
| b2-u36-l01-q11 | stemZh | 科學家正在研發一種新的流感疫苗。 | 疫苗必須冷藏，所以運送疫苗的卡車有冰箱。 | 第③關疑似（照審查建議改） 9：mcq 與閱讀同為科學家研發疫苗；用語 |
| b2-u36-l01-q12 | stemEn | After the car accident, the driver was ____ for three days. | Last winter, about two hundred people in our town were ____ because of the flu. | 第③關疑似（照審查建議改） 8：避免車禍情境；情境表逐列人工重判：同課兩題事件類型相同，改寫（b1b4／b2cd1 裁示）：mcq 與閱讀同為家人住院 |
| b2-u36-l01-q12 | stemZh | 車禍之後，那位司機住院了三天。 | 去年冬天，我們鎮上約有兩百人因流感住院。 | 第③關疑似（照審查建議改） 8：避免車禍情境；情境表逐列人工重判：同課兩題事件類型相同，改寫（b1b4／b2cd1 裁示）：mcq 與閱讀同為家人住院 |
| b2-u36-l01-q15 | referenceEn/0 | The pharmacist near my home always remembers my name. | The pharmacist near my home opens her shop at seven every morning. | 評分要點：不寫死時態、「常見搭配」改「X 的用法，例如…等」、例如清單補「等」（b2cd1 裁示、第③關疑似 26）；情境表逐列人工重判：同課兩題事件類型相同，改寫（b1b4／b2cd1 裁示）：造句參考答案與聽打同為藥師認識大家 |
| b2-u36-l01-q15 | rubricZh/1 | 時態配合內容（例如 remembers、is） | 時態配合內容（例如 remembers、is 等） | 評分要點：不寫死時態、「常見搭配」改「X 的用法，例如…等」、例如清單補「等」（b2cd1 裁示、第③關疑似 26）；情境表逐列人工重判：同課兩題事件類型相同，改寫（b1b4／b2cd1 裁示）：造句參考答案與聽打同為藥師認識大家 |
| b2-u36-l02-q06 | exampleEn | The X-ray showed that nothing was broken. | Airports use X-ray machines to check bags. | 第③關疑似（照審查建議改） 11：避免傷病看診情境 |
| b2-u36-l02-q06 | exampleZh | X 光片顯示沒有任何骨折。 | 機場用 X 光機檢查行李。 | 第③關疑似（照審查建議改） 11：避免傷病看診情境 |
| b2-u36-l02-q08 | audioEn | Please install the new antivirus software on all office computers before Friday. | My computer is running slowly, so I'll check it with my antivirus program tonight. | 聽選正解不可照抄音檔：正解換說法、干擾項沿用音檔字詞（b2cd1 裁示）；情境表逐列人工重判：聽選音檔與他題同事件，改寫（聽選正解不照抄音檔） |
| b2-u36-l02-q08 | audioZh | 請在星期五前把新的防毒軟體安裝到所有辦公室電腦上。 | 我的電腦跑得很慢，所以我今晚要用防毒軟體檢查一下。 | 聽選正解不可照抄音檔：正解換說法、干擾項沿用音檔字詞（b2cd1 裁示）；情境表逐列人工重判：聽選音檔與他題同事件，改寫（聽選正解不照抄音檔） |
| b2-u36-l02-q08 | questionZh | 星期五前要做什麼？ | 說話者今晚要做什麼？ | 聽選正解不可照抄音檔：正解換說法、干擾項沿用音檔字詞（b2cd1 裁示）；情境表逐列人工重判：聽選音檔與他題同事件，改寫（聽選正解不照抄音檔） |
| b2-u36-l02-q08 | options/0 | Change every password | Turn off the slow computer | 聽選正解不可照抄音檔：正解換說法、干擾項沿用音檔字詞（b2cd1 裁示）；情境表逐列人工重判：聽選音檔與他題同事件，改寫（聽選正解不照抄音檔） |
| b2-u36-l02-q08 | options/1 | Buy new office computers | Buy a faster computer | 聽選正解不可照抄音檔：正解換說法、干擾項沿用音檔字詞（b2cd1 裁示）；情境表逐列人工重判：聽選音檔與他題同事件，改寫（聽選正解不照抄音檔） |
| b2-u36-l02-q08 | options/2 | Install the new antivirus software | Scan the computer for problems | 聽選正解不可照抄音檔：正解換說法、干擾項沿用音檔字詞（b2cd1 裁示）；情境表逐列人工重判：聽選音檔與他題同事件，改寫（聽選正解不照抄音檔） |
| b2-u36-l02-q08 | options/3 | Clean the keyboards | Play a new game | 聽選正解不可照抄音檔：正解換說法、干擾項沿用音檔字詞（b2cd1 裁示）；情境表逐列人工重判：聽選音檔與他題同事件，改寫（聽選正解不照抄音檔） |
| b2-u36-l02-q11 | stemEn | My computer stopped working properly, so I bought ____ software to protect it. | The ____ program found a virus in the email and removed it. | 情境表逐列人工重判：同課兩題事件類型相同，改寫（b1b4／b2cd1 裁示）：mcq 與聽選同為電腦怪怪的就用防毒軟體；最終複審 FIX #14：mcq 和單字卡命題相同（防毒軟體免費），改成防毒程式刪除病毒 |
| b2-u36-l02-q11 | stemZh | 我的電腦開始不太正常，所以我買了防毒軟體來保護它。 | 防毒程式在那封電子郵件裡發現病毒，並把它刪除了。 | 情境表逐列人工重判：同課兩題事件類型相同，改寫（b1b4／b2cd1 裁示）：mcq 與聽選同為電腦怪怪的就用防毒軟體；最終複審 FIX #14：mcq 和單字卡命題相同（防毒軟體免費），改成防毒程式刪除病毒 |
| b2-u36-l02-q12 | options/0 | pharmacist | commerce | 第③關 FIX：混合詞性題放得進空格的干擾項不足兩個（pharmacist 可數） |
| b2-u36-l02-q12 | optionGlossZh/0 | 藥師 | 商業 | 第③關 FIX：混合詞性題放得進空格的干擾項不足兩個（pharmacist 可數） |
| b2-u36-l02-q13 | passageZh | 每個星期六，我姊姊都在我們家附近的一家醫院當志工。早上，她在門診區幫忙，告訴大家抽血或照 X 光要去哪裡。她從在那裡認識的護理師和急救人員身上，學到很多醫療照護的知識。下午，她到隔壁的安寧照護機構，為住在那裡的人念書、放音樂。上個月，她和朋友們甚至穿上戲服辦了一場小遊行，大家都說非常有趣。醫院的電腦曾經被病毒攻擊過，所以現在我姊姊也會提醒工作人員更新防毒軟體。 | 每個星期六，我姊姊都在我們家附近的一家醫院當志工。早上，她在門診區幫忙，告訴大家抽血或照 X 光要去哪裡。她從在那裡認識的護理師和急救人員身上，學到很多醫療照護的知識。下午，她到隔壁的安寧照護機構，念書給住在那裡的人聽，也放音樂給他們聽。上個月，她和朋友們甚至穿上戲服辦了一場小遊行，大家都說非常有趣。醫院的電腦曾經被病毒攻擊過，所以現在我姊姊也會提醒工作人員更新防毒軟體。 | 第③關 FIX：「念書」有歧義 |
| b2-u36-l02-q14 | promptZh | 醫生幫我的手照了 X 光。 | 科學家用 X 光發現這幅畫底下還有另一幅畫。 | 第③關疑似（照審查建議改） 11：避免傷病看診情境；最終複審 FIX #15：翻譯和單字卡同為 X 光機檢查容器，改成 X 光發現畫底下的畫 |
| b2-u36-l02-q14 | referenceEn/0 | The doctor took an X-ray of my hand. | Scientists used X-rays to find another painting under this one. | 第③關疑似（照審查建議改） 11：避免傷病看診情境；最終複審 FIX #15：翻譯和單字卡同為 X 光機檢查容器，改成 X 光發現畫底下的畫 |
| b2-u36-l02-q14 | referenceEn/1 | The doctor did an X-ray of my hand. | With X-rays, scientists found a second painting under this one. | 第③關疑似（照審查建議改） 11：避免傷病看診情境；最終複審 FIX #15：翻譯和單字卡同為 X 光機檢查容器，改成 X 光發現畫底下的畫 |
| b2-u36-l02-q14 | rubricZh/0 | 「照 X 光」可寫，例如 take an X-ray、do an X-ray 等 | 「X 光」可寫，例如 X-rays、an X-ray 等 | 第③關疑似（照審查建議改） 11：避免傷病看診情境；最終複審 FIX #15：翻譯和單字卡同為 X 光機檢查容器，改成 X 光發現畫底下的畫 |
| b2-u36-l02-q14 | rubricZh/1 | 過去的事用過去式（例如 took、did） | 「發現」可寫，例如 found、discovered 等 | 第③關疑似（照審查建議改） 11：避免傷病看診情境；最終複審 FIX #15：翻譯和單字卡同為 X 光機檢查容器，改成 X 光發現畫底下的畫 |
| b2-u36-l02-q15 | rubricZh/2 | 時態配合內容（例如 should be、is） | 時態配合內容（例如 should be、is 等） | 評分要點：不寫死時態、「常見搭配」改「X 的用法，例如…等」、例如清單補「等」（b2cd1 裁示、第③關疑似 26） |
| b2-u37-l01-q01 | exampleEn | You need proof of residence to borrow books from the city library. | Their new residence is on the tenth floor of a quiet building. | 單字卡第一義與例句一致（b2cd1 裁示）；原例句是借書規定 |
| b2-u37-l01-q01 | exampleZh | 要向市立圖書館借書，你需要居住證明。 | 他們的新住所在一棟安靜大樓的十樓。 | 單字卡第一義與例句一致（b2cd1 裁示）；原例句是借書規定 |
| b2-u37-l01-q02 | exampleEn | The rental for this apartment is fifteen thousand dollars a month. | Rental prices near the university are very high. | 第②關 issue／第③關疑似（照審查建議改） 19：rental 當租金金額較少見；釋義補「出租房」 |
| b2-u37-l01-q02 | exampleZh | 這間公寓的租金每個月一萬五千元。 | 大學附近的租金非常高。 | 第②關 issue／第③關疑似（照審查建議改） 19：rental 當租金金額較少見；釋義補「出租房」 |
| b2-u37-l01-q02 | glossZh | 租金；租賃；出租的 | 租金；租賃；出租房 | 第②關 issue／第③關疑似（照審查建議改） 19：rental 當租金金額較少見；釋義補「出租房」 |
| b2-u37-l01-q07 | sentenceEn | We called a plumber because the kitchen pipe was leaking. | The plumber charged us fifty dollars just to come to the house. | 情境表逐列人工重判：同課兩題事件類型相同，改寫（b1b4／b2cd1 裁示）：聽打與閱讀同為叫水電工修水管 |
| b2-u37-l01-q07 | sentenceZh | 因為廚房的水管漏水，我們叫了水電工。 | 水電工光是上門就收了我們五十元。 | 情境表逐列人工重判：同課兩題事件類型相同，改寫（b1b4／b2cd1 裁示）：聽打與閱讀同為叫水電工修水管 |
| b2-u37-l01-q08 | options/1 | The rent is going up next year | The rent will go up in March | 聽選正解不可照抄音檔：正解換說法、干擾項沿用音檔字詞（b2cd1 裁示） |
| b2-u37-l01-q08 | options/3 | The lease is ending | The contract ends soon | 聽選正解不可照抄音檔：正解換說法、干擾項沿用音檔字詞（b2cd1 裁示） |
| b2-u37-l01-q09 | sentenceEn | The family bought a small plot of land to grow vegetables. | Each plot in this new area is about the size of a tennis court. | 同課兩題情境重複（第③關同課重複表）：跟讀與閱讀同為一小塊地種菜 |
| b2-u37-l01-q09 | sentenceZh | 那家人買了一小塊地來種菜。 | 這個新區的每一塊地大約是一個網球場的大小。 | 同課兩題情境重複（第③關同課重複表）：跟讀與閱讀同為一小塊地種菜 |
| b2-u37-l01-q13 | passageZh | Jason 為了工作搬到城裡時，買不起房子，所以找了出租的房子。他在一間門診診所旁邊找到一間小公寓，簽了一年的租約。這棟建築以前是一戶有錢人家的宅邸，到現在還保有漂亮的老窗戶。不過，水管非常老舊，Jason 今年已經叫了三次水電工。大樓後面有一小塊地，住戶可以在那裡種菜，Jason 下班後很喜歡在那裡種種花草。雖然他喜歡這間公寓，但他希望下一個住處能離公司近一點。 | Jason 為了工作搬到城裡時，買不起房子，所以找了出租的房子。他在一間門診診所旁邊找到一間小公寓，簽了一年的租約。這棟建築以前是一戶有錢人家的宅邸，到現在還保有漂亮的老窗戶。不過，水管非常老舊，Jason 今年已經叫了三次水電工。大樓後面有一小塊地，住戶可以在那裡種菜，Jason 下班後很喜歡在那裡種菜。雖然他喜歡這間公寓，但他希望下一個住處能離公司近一點。 | 第②關 issue：中英不一致 |
| b2-u37-l01-q14 | promptZh | 我們的租約明年六月到期。 | 我們打算把租約再延長一年。 | 第③關 FIX：翻譯與聽選同主詞同事件（租約到期）；情境表逐列人工重判：同課兩題事件類型相同，改寫（b1b4／b2cd1 裁示）：翻譯與閱讀同為簽租約 |
| b2-u37-l01-q14 | referenceEn/0 | Our lease ends in June next year. | We plan to extend the lease for another year. | 第③關 FIX：翻譯與聽選同主詞同事件（租約到期）；情境表逐列人工重判：同課兩題事件類型相同，改寫（b1b4／b2cd1 裁示）：翻譯與閱讀同為簽租約 |
| b2-u37-l01-q14 | referenceEn/1 | Our lease runs out in June next year. | We are going to extend our lease for one more year. | 第③關 FIX：翻譯與聽選同主詞同事件（租約到期）；情境表逐列人工重判：同課兩題事件類型相同，改寫（b1b4／b2cd1 裁示）：翻譯與閱讀同為簽租約 |
| b2-u37-l01-q14 | rubricZh/1 | 「到期」可寫，例如 ends、runs out、expires 等 | 「延長」可寫，例如 extend、renew 等 | 第③關 FIX：翻譯與聽選同主詞同事件（租約到期）；情境表逐列人工重判：同課兩題事件類型相同，改寫（b1b4／b2cd1 裁示）：翻譯與閱讀同為簽租約 |
| b2-u37-l01-q14 | rubricZh/2 | 時態配合內容（例如 ends、will end） | 表示打算的寫法不限（例如 plan to、are going to 等） | 第③關 FIX：翻譯與聽選同主詞同事件（租約到期）；情境表逐列人工重判：同課兩題事件類型相同，改寫（b1b4／b2cd1 裁示）：翻譯與閱讀同為簽租約 |
| b2-u37-l01-q15 | referenceEn/0 | We called a plumber when the toilet stopped working. | We needed a plumber last winter because the kitchen sink was blocked. | 同課兩題情境重複（第③關同課重複表）：造句參考答案與聽打同為 We called a plumber；評分要點：不寫死時態、「常見搭配」改「X 的用法，例如…等」、例如清單補「等」（b2cd1 裁示、第③關疑似 26）；情境表逐列人工重判：同課兩題事件類型相同，改寫（b1b4／b2cd1 裁示）：造句參考答案與聽打同為漏水找水電工；最終複審 FIX #16：參考答案 1 沒回應題目 |
| b2-u37-l01-q15 | rubricZh/1 | 常見搭配（例如 call a plumber、need a plumber 等） | plumber 的用法，例如 call a plumber、need a plumber 等 | 同課兩題情境重複（第③關同課重複表）：造句參考答案與聽打同為 We called a plumber；評分要點：不寫死時態、「常見搭配」改「X 的用法，例如…等」、例如清單補「等」（b2cd1 裁示、第③關疑似 26）；情境表逐列人工重判：同課兩題事件類型相同，改寫（b1b4／b2cd1 裁示）：造句參考答案與聽打同為漏水找水電工；最終複審 FIX #16：參考答案 1 沒回應題目 |
| b2-u37-l01-q15 | rubricZh/2 | 時態配合內容（例如 called、need） | 時態配合內容（例如 called、need 等） | 同課兩題情境重複（第③關同課重複表）：造句參考答案與聽打同為 We called a plumber；評分要點：不寫死時態、「常見搭配」改「X 的用法，例如…等」、例如清單補「等」（b2cd1 裁示、第③關疑似 26）；情境表逐列人工重判：同課兩題事件類型相同，改寫（b1b4／b2cd1 裁示）：造句參考答案與聽打同為漏水找水電工；最終複審 FIX #16：參考答案 1 沒回應題目 |
| b2-u37-l02-q03 | exampleEn | The villa has three bedrooms and a garden full of roses. | They rented a small villa by the sea for the summer. | 情境表逐列重算：和單字卡主詞、句型都相同（只換情境）（和閱讀同為 The villa has…），改卡 |
| b2-u37-l02-q03 | exampleZh | 這棟別墅有三間臥室和一座開滿玫瑰的花園。 | 他們夏天在海邊租了一棟小別墅。 | 情境表逐列重算：和單字卡主詞、句型都相同（只換情境）（和閱讀同為 The villa has…），改卡 |
| b2-u37-l02-q08 | options/2 | Put nails in the walls | Make small holes in the walls | 聽選正解不可照抄音檔：正解換說法、干擾項沿用音檔字詞（b2cd1 裁示） |
| b2-u37-l02-q08 | options/3 | Cook fish | Keep a pet cat | 聽選正解不可照抄音檔：正解換說法、干擾項沿用音檔字詞（b2cd1 裁示） |
| b2-u37-l02-q10 | sentenceEn | Swimming lessons are compulsory at my daughter's school. | Wearing a helmet is compulsory on this bike path. | 同課兩題情境重複（第③關同課重複表）：跟讀與 mcq 同為學校必修；用語 |
| b2-u37-l02-q10 | sentenceZh | 我女兒的學校規定一定要上游泳課。 | 在這條腳踏車道上騎車一定要戴安全帽。 | 同課兩題情境重複（第③關同課重複表）：跟讀與 mcq 同為學校必修；用語 |
| b2-u37-l02-q13 | passageZh | 上個月，我阿姨賣掉了城裡的公寓，搬進山上一棟老別墅。一位從事房地產工作的朋友幫她找到這棟房子。別墅有一個可以眺望山谷的大露台，阿姨很喜歡在那裡喝茶。搬家很辛苦：她花了三天才把所有物品打包好。她學生時代的女房東太田太太也來幫忙，兩人笑談阿姨四十年前租的那間小房間。在山上，垃圾分類是強制的，所以阿姨現在都很仔細地分類。她兒子在附近的醫院從事醫療照護工作，所以每個週末都會來看她。 | 上個月，我阿姨賣掉了城裡的公寓，搬進山上一棟老別墅。一位從事房地產工作的朋友幫她找到這棟房子。別墅有一個可以眺望山谷的大露台，阿姨很喜歡在那裡喝茶。搬家很辛苦：她花了三天才把所有物品打包好。她學生時代的女房東 Ota 太太也來幫忙，兩人笑談阿姨四十年前租的那間小房間。在山上，垃圾分類是強制的，所以阿姨現在都很仔細地分類。她兒子在附近的醫院從事醫療照護工作，所以每個週末都會來看她。 | 第③關疑似（照審查建議改） 12：日本名保留英文；第③關疑似（照審查建議改） 12；最終複審提醒：中譯補空格 |
| b2-u37-l02-q13 | questions/1/questionZh | 太田太太是誰？ | Ota 太太是誰？ | 第③關疑似（照審查建議改） 12：日本名保留英文；第③關疑似（照審查建議改） 12；最終複審提醒：中譯補空格 |
| b2-u37-l02-q14 | rubricZh/1 | 時態配合內容（例如 worked、has worked） | 時態配合內容（例如 worked、has worked 等） | 評分要點：不寫死時態、「常見搭配」改「X 的用法，例如…等」、例如清單補「等」（b2cd1 裁示、第③關疑似 26） |
| b2-u37-l02-q15 | rubricZh/1 | 時態配合內容（例如 is、lived） | 時態配合內容（例如 is、lived 等） | 評分要點：不寫死時態、「常見搭配」改「X 的用法，例如…等」、例如清單補「等」（b2cd1 裁示、第③關疑似 26） |
| b2-u38-l01-q04 | exampleEn | The manufacturer called back thousands of phones with a battery problem. | The manufacturer recalled thousands of phones with a battery problem. | 第②關 issue：召回應為 recalled |
| b2-u38-l01-q09 | audioEn | The inspector will visit the factory on Tuesday to check the safety equipment. | A building inspector will come on Tuesday to check our new house. | 聽選正解不可照抄音檔：正解換說法、干擾項沿用音檔字詞（b2cd1 裁示）；原音檔「檢查員來工廠查安全」與閱讀同事件，改寫（第③關同課重複） |
| b2-u38-l01-q09 | audioZh | 檢查員星期二會到工廠檢查安全設備。 | 星期二會有一位建築檢查員來檢查我們的新房子。 | 聽選正解不可照抄音檔：正解換說法、干擾項沿用音檔字詞（b2cd1 裁示）；原音檔「檢查員來工廠查安全」與閱讀同事件，改寫（第③關同課重複） |
| b2-u38-l01-q09 | options/0 | Give a talk about cleaning | Paint our new house | 聽選正解不可照抄音檔：正解換說法、干擾項沿用音檔字詞（b2cd1 裁示）；原音檔「檢查員來工廠查安全」與閱讀同事件，改寫（第③關同課重複） |
| b2-u38-l01-q09 | options/1 | Meet the new manager and workers | Build a new house next door | 聽選正解不可照抄音檔：正解換說法、干擾項沿用音檔字詞（b2cd1 裁示）；原音檔「檢查員來工廠查安全」與閱讀同事件，改寫（第③關同課重複） |
| b2-u38-l01-q09 | options/2 | Choose the best new product | Sell the house on Tuesday | 聽選正解不可照抄音檔：正解換說法、干擾項沿用音檔字詞（b2cd1 裁示）；原音檔「檢查員來工廠查安全」與閱讀同事件，改寫（第③關同課重複） |
| b2-u38-l01-q09 | options/3 | Check safety equipment | Examine the home | 聽選正解不可照抄音檔：正解換說法、干擾項沿用音檔字詞（b2cd1 裁示）；原音檔「檢查員來工廠查安全」與閱讀同事件，改寫（第③關同課重複） |
| b2-u38-l01-q13 | stemEn | The new machines doubled the factory's daily ____. | The writer's ____ is amazing: more than eighty books in forty years. | 同課兩題情境重複（第③關同課重複表）：mcq 與聽打同為新機器讓產量增加；最終複審 FIX #19：mcq 和聽打同為這家工廠的產量，改成作家的產量 |
| b2-u38-l01-q13 | stemZh | 新機器讓工廠的每日產量加倍。 | 那位作家的產量驚人：四十年寫了八十多本書。 | 同課兩題情境重複（第③關同課重複表）：mcq 與聽打同為新機器讓產量增加；最終複審 FIX #19：mcq 和聽打同為這家工廠的產量，改成作家的產量 |
| b2-u38-l01-q14 | passageEn | For over a century, the paper mill was the biggest employer in our town. Forty years ago, its output was so large that trains carried paper from the town every day. Later, the mill was bought by a large manufacturer from Japan. The new owners replaced the old machines with modern ones made of high-quality components. A government inspector visits twice a year to make sure the factory is safe and clean. Because manufacturing needs a lot of water and power, the mill also has its own small utility company. Some people wanted to sell the land for real estate, but the town decided to keep the mill and the jobs it brings. | For over a century, the paper mill was the biggest employer in our town. Forty years ago, its output was so large that trains carried paper from the town every day. Later, the mill was bought by a large manufacturer from Japan. The new owners replaced the old machines with modern ones made of high-quality components. The mill's manager first came to the town as a young inspector who checked the quality of its paper. Because manufacturing needs a lot of water and power, utility bills are the mill's biggest cost. Some people wanted to sell the land for real estate, but the town decided to keep the mill and the jobs it brings. | 第②關 issue：自有公用事業公司不常見；第②關 issue；最終複審 FIX #17：閱讀和聽選同為檢查員到場檢查，改閱讀這一句；最終複審 FIX #17 |
| b2-u38-l01-q14 | passageZh | 一百多年來，這座紙廠一直是我們鎮上最大的僱主。四十年前，它的產量大到每天都有火車把紙運出鎮外。後來，紙廠被一家日本的大型製造商買下。新老闆把舊機器換成用高品質零件做成的新式機器。政府的檢查員每年來兩次，確保工廠安全又乾淨。因為製造業需要大量的水和電，紙廠也有自己的小型公用事業公司。有些人想把土地賣掉做房地產，但鎮上決定保留紙廠和它帶來的工作機會。 | 一百多年來，這座紙廠一直是我們鎮上最大的僱主。四十年前，它的產量大到每天都有火車把紙運出鎮外。後來，紙廠被一家日本的大型製造商買下。新老闆把舊機器換成用高品質零件做成的新式機器。紙廠的經理當年是以年輕檢查員的身分來到鎮上，負責檢查紙的品質。因為製造業需要大量的水和電，水電等公用事業費用是紙廠最大的開銷。有些人想把土地賣掉做房地產，但鎮上決定保留紙廠和它帶來的工作機會。 | 第②關 issue：自有公用事業公司不常見；第②關 issue；最終複審 FIX #17：閱讀和聽選同為檢查員到場檢查，改閱讀這一句；最終複審 FIX #17 |
| b2-u38-l01-q15 | promptZh | 一位食品檢查員每個月來這家餐廳檢查一次。 | 我叔叔當了二十年的警察督察。 | 評分要點：不寫死時態、「常見搭配」改「X 的用法，例如…等」、例如清單補「等」（b2cd1 裁示、第③關疑似 26）；評分要點：不寫死時態（b2cd1 裁示）；最終複審 FIX #18：翻譯和聽選同為檢查員到場檢查，改成叔叔當警察督察 |
| b2-u38-l01-q15 | referenceEn/0 | A food inspector checks this restaurant once a month. | My uncle has been a police inspector for twenty years. | 評分要點：不寫死時態、「常見搭配」改「X 的用法，例如…等」、例如清單補「等」（b2cd1 裁示、第③關疑似 26）；評分要點：不寫死時態（b2cd1 裁示）；最終複審 FIX #18：翻譯和聽選同為檢查員到場檢查，改成叔叔當警察督察 |
| b2-u38-l01-q15 | referenceEn/1 | A food inspector comes to check the restaurant every month. | My uncle worked as a police inspector for twenty years. | 評分要點：不寫死時態、「常見搭配」改「X 的用法，例如…等」、例如清單補「等」（b2cd1 裁示、第③關疑似 26）；評分要點：不寫死時態（b2cd1 裁示）；最終複審 FIX #18：翻譯和聽選同為檢查員到場檢查，改成叔叔當警察督察 |
| b2-u38-l01-q15 | rubricZh/0 | 「檢查員」可寫，例如 inspector 等 | 「督察」可寫，例如 inspector、police inspector 等 | 評分要點：不寫死時態、「常見搭配」改「X 的用法，例如…等」、例如清單補「等」（b2cd1 裁示、第③關疑似 26）；評分要點：不寫死時態（b2cd1 裁示）；最終複審 FIX #18：翻譯和聽選同為檢查員到場檢查，改成叔叔當警察督察 |
| b2-u38-l01-q15 | rubricZh/1 | 「每個月一次」可寫，例如 once a month、every month 等 | 時態合理（例如 has been、worked 等） | 評分要點：不寫死時態、「常見搭配」改「X 的用法，例如…等」、例如清單補「等」（b2cd1 裁示、第③關疑似 26）；評分要點：不寫死時態（b2cd1 裁示）；最終複審 FIX #18：翻譯和聽選同為檢查員到場檢查，改成叔叔當警察督察 |
| b2-u38-l01-q15 | rubricZh/2 | 說固定的情況，用現在式（例如 checks、comes） | （刪除） | 評分要點：不寫死時態、「常見搭配」改「X 的用法，例如…等」、例如清單補「等」（b2cd1 裁示、第③關疑似 26）；評分要點：不寫死時態（b2cd1 裁示）；最終複審 FIX #18：翻譯和聽選同為檢查員到場檢查，改成叔叔當警察督察 |
| b2-u38-l01-q16 | rubricZh/1 | 常見搭配（例如 a car manufacturer、a toy manufacturer 等） | manufacturer 的用法，例如 a car manufacturer、a toy manufacturer 等 | 評分要點：不寫死時態、「常見搭配」改「X 的用法，例如…等」、例如清單補「等」（b2cd1 裁示、第③關疑似 26） |
| b2-u38-l01-q16 | rubricZh/2 | 時態配合內容（例如 was made、makes） | 時態配合內容（例如 was made、makes 等） | 評分要點：不寫死時態、「常見搭配」改「X 的用法，例如…等」、例如清單補「等」（b2cd1 裁示、第③關疑似 26） |
| b2-u38-l02-q04 | exampleEn | The workmen left a lot of dust after fixing the stairs. | A workman painted the white lines on the new road. | 第③關 FIX：卡與跟讀同為工人修房子 |
| b2-u38-l02-q04 | exampleZh | 工人修好樓梯後留下了很多灰塵。 | 一位工人在新馬路上畫白線。 | 第③關 FIX：卡與跟讀同為工人修房子 |
| b2-u38-l02-q08 | options/0 | The teacher was too strict | Spoke it only for ten days | 聽選正解不可照抄音檔：正解換說法、干擾項沿用音檔字詞（b2cd1 裁示） |
| b2-u38-l02-q08 | options/3 | Moved to Spain last year | Moved to France last year | 聽選正解不可照抄音檔：正解換說法、干擾項沿用音檔字詞（b2cd1 裁示） |
| b2-u38-l02-q12 | stemEn | The old gate was so ____ that it made a loud noise when we opened it. | The old bicycle was so ____ that the chain would not move. | 同課兩題情境重複（第③關同課重複表）：mcq 與閱讀同為生鏽大門 |
| b2-u38-l02-q12 | stemZh | 那扇舊大門鏽得很厲害，我們一打開就發出很大的聲音。 | 那輛舊腳踏車鏽得很嚴重，鏈條都轉不動了。 | 同課兩題情境重複（第③關同課重複表）：mcq 與閱讀同為生鏽大門 |
| b2-u38-l02-q14 | promptZh | 這位工匠用傳統方法做木椅。 | 村裡那位工匠常常受邀到國外教課。 | 同課兩題情境重複（第③關同課重複表）：翻譯與閱讀同為工匠用傳統方法手工製作；情境表逐列人工重判：同課兩題事件類型相同，改寫（b1b4／b2cd1 裁示）：翻譯與 mcq 同為工匠花三個月做東西；最終複審 FIX #20：翻譯和閱讀、q11 同為手工製作，改成工匠受邀出國教課 |
| b2-u38-l02-q14 | referenceEn/0 | This craftsman makes wooden chairs in the traditional way. | The craftsman in the village is often invited to teach abroad. | 同課兩題情境重複（第③關同課重複表）：翻譯與閱讀同為工匠用傳統方法手工製作；情境表逐列人工重判：同課兩題事件類型相同，改寫（b1b4／b2cd1 裁示）：翻譯與 mcq 同為工匠花三個月做東西；最終複審 FIX #20：翻譯和閱讀、q11 同為手工製作，改成工匠受邀出國教課 |
| b2-u38-l02-q14 | referenceEn/1 | The craftsman uses traditional methods to make wooden chairs. | The village craftsman is often asked to teach in other countries. | 同課兩題情境重複（第③關同課重複表）：翻譯與閱讀同為工匠用傳統方法手工製作；情境表逐列人工重判：同課兩題事件類型相同，改寫（b1b4／b2cd1 裁示）：翻譯與 mcq 同為工匠花三個月做東西；最終複審 FIX #20：翻譯和閱讀、q11 同為手工製作，改成工匠受邀出國教課 |
| b2-u38-l02-q14 | rubricZh/1 | 「用傳統方法」可寫，例如 in the traditional way、with traditional methods 等 | 「受邀」可寫，例如 is invited to、is asked to 等 | 同課兩題情境重複（第③關同課重複表）：翻譯與閱讀同為工匠用傳統方法手工製作；情境表逐列人工重判：同課兩題事件類型相同，改寫（b1b4／b2cd1 裁示）：翻譯與 mcq 同為工匠花三個月做東西；最終複審 FIX #20：翻譯和閱讀、q11 同為手工製作，改成工匠受邀出國教課 |
| b2-u38-l02-q14 | rubricZh/2 | 說習慣，用現在式（例如 makes、uses） | （刪除） | 同課兩題情境重複（第③關同課重複表）：翻譯與閱讀同為工匠用傳統方法手工製作；情境表逐列人工重判：同課兩題事件類型相同，改寫（b1b4／b2cd1 裁示）：翻譯與 mcq 同為工匠花三個月做東西；最終複審 FIX #20：翻譯和閱讀、q11 同為手工製作，改成工匠受邀出國教課 |
| b2-u38-l02-q15 | referenceEn/1 | This company manufactures paper bags from old newspapers. | My grandfather manufactured furniture in a small workshop. | 評分要點：不寫死時態、「常見搭配」改「X 的用法，例如…等」、例如清單補「等」（b2cd1 裁示、第③關疑似 26）；情境表逐列人工重判：同課兩題事件類型相同，改寫（b1b4／b2cd1 裁示）：造句參考答案與聽打同為「公司製造某物」 |
| b2-u38-l02-q15 | rubricZh/2 | 時態配合內容（例如 was manufactured、manufactures） | 時態配合內容（例如 was manufactured、manufactures 等） | 評分要點：不寫死時態、「常見搭配」改「X 的用法，例如…等」、例如清單補「等」（b2cd1 裁示、第③關疑似 26）；情境表逐列人工重判：同課兩題事件類型相同，改寫（b1b4／b2cd1 裁示）：造句參考答案與聽打同為「公司製造某物」 |
| b2-u39-l01-q10 | options/2 | The glass plates | Plates made of glass | 聽選正解不可照抄音檔：正解換說法、干擾項沿用音檔字詞（b2cd1 裁示） |
| b2-u39-l01-q12 | sentenceEn | We called an electrician because the lights kept going off. | My cousin is learning to be an electrician at a night school. | 同課兩題情境重複（第③關同課重複表）：跟讀與閱讀同為燈熄找電工；最終複審 FIX #21：跟讀和單字卡同為電工修東西，改成在夜校學當電工 |
| b2-u39-l01-q12 | sentenceZh | 因為燈一直熄掉，我們叫了電工。 | 我表哥在夜校學當電工。 | 同課兩題情境重複（第③關同課重複表）：跟讀與閱讀同為燈熄找電工；最終複審 FIX #21：跟讀和單字卡同為電工修東西，改成在夜校學當電工 |
| b2-u39-l01-q13 | stemEn | I keep all our monthly costs in a ____ so I can see how much we spend. | I put all the students' test scores in a ____ so I can compare them. | 同課兩題情境重複（第③關同課重複表）：mcq 與閱讀同為用試算表記開銷 |
| b2-u39-l01-q13 | stemZh | 我把我們每個月的開銷都記在試算表裡，這樣就能看出我們花了多少錢。 | 我把所有學生的考試成績放進試算表，方便比較。 | 同課兩題情境重複（第③關同課重複表）：mcq 與閱讀同為用試算表記開銷 |
| b2-u39-l01-q16 | rubricZh/2 | 過去的事用過去式（例如 heated、warmed up） | 時態合理（例如 heated、warmed up 等） | 評分要點：不寫死時態、「常見搭配」改「X 的用法，例如…等」、例如清單補「等」（b2cd1 裁示、第③關疑似 26） |
| b2-u39-l01-q17 | referenceEn/0 | I once saw the rings of Saturn through a telescope. | I want to buy a small telescope to watch birds. | 評分要點：不寫死時態、「常見搭配」改「X 的用法，例如…等」、例如清單補「等」（b2cd1 裁示、第③關疑似 26）；情境表逐列人工重判：同課兩題事件類型相同，改寫（b1b4／b2cd1 裁示）：造句參考答案與閱讀同為用望遠鏡看天空 |
| b2-u39-l01-q17 | rubricZh/1 | 常見搭配（例如 through a telescope、use a telescope 等） | telescope 的用法，例如 through a telescope、use a telescope 等 | 評分要點：不寫死時態、「常見搭配」改「X 的用法，例如…等」、例如清單補「等」（b2cd1 裁示、第③關疑似 26）；情境表逐列人工重判：同課兩題事件類型相同，改寫（b1b4／b2cd1 裁示）：造句參考答案與閱讀同為用望遠鏡看天空 |
| b2-u39-l01-q17 | rubricZh/2 | 時態配合內容（例如 saw、would like to） | 時態配合內容（例如 saw、would like to 等） | 評分要點：不寫死時態、「常見搭配」改「X 的用法，例如…等」、例如清單補「等」（b2cd1 裁示、第③關疑似 26）；情境表逐列人工重判：同課兩題事件類型相同，改寫（b1b4／b2cd1 裁示）：造句參考答案與閱讀同為用望遠鏡看天空 |
| b2-u39-l02-q04 | exampleEn | I bought a thermometer to check the water in my fish tank. | A thermometer in the fish tank tells us if the water is warm enough. | 第③關 FIX：卡與閱讀同主詞同句型 |
| b2-u39-l02-q04 | exampleZh | 我買了一支溫度計來測魚缸裡的水溫。 | 魚缸裡的溫度計告訴我們水夠不夠溫暖。 | 第③關 FIX：卡與閱讀同主詞同句型 |
| b2-u39-l02-q08 | exampleEn | Pilots practice flying in virtual reality before they fly real planes. | Some pilots now practice in virtual reality before they fly real planes. | 第③關疑似（照審查建議改） 13：事實精確 |
| b2-u39-l02-q08 | exampleZh | 飛行員在駕駛真正的飛機之前，會先在虛擬實境中練習飛行。 | 現在有些飛行員在駕駛真正的飛機前，會先在虛擬實境中練習。 | 第③關疑似（照審查建議改） 13：事實精確 |
| b2-u39-l02-q10 | options/3 | The warmest coat you have | The thickest coat they have | 聽選正解不可照抄音檔：正解換說法、干擾項沿用音檔字詞（b2cd1 裁示） |
| b2-u39-l02-q11 | sentenceEn | My son wants to learn programming so he can make his own games. | Jobs in programming are well-paid in this city. | 情境表逐列人工重判：同課兩題事件類型相同，改寫（b1b4／b2cd1 裁示）：跟讀與閱讀同為孩子學寫程式 |
| b2-u39-l02-q11 | sentenceZh | 我兒子想學寫程式，這樣他就能做自己的遊戲。 | 在這個城市，程式設計的工作薪水很高。 | 情境表逐列人工重判：同課兩題事件類型相同，改寫（b1b4／b2cd1 裁示）：跟讀與閱讀同為孩子學寫程式 |
| b2-u39-l02-q15 | passageEn | Last weekend, I visited a technology fair in Taipei. At the first stand, a manufacturer showed a tiny transistor made with nano technology, so small that we needed a special camera to see it. Next, I tried a virtual reality game in which I walked on the moon. A company that makes weather radar explained how it can follow storms from hundreds of kilometers away. Another stand sold laser tools that measure a room in seconds. Children could join a short programming class and make a robot dance. I also bought a smart thermometer for my kitchen. Every computer component on display was kept in an antistatic bag. | Last weekend, I visited a technology fair in Taipei. At the first stand, a manufacturer showed a tiny transistor made with nano technology, so small that we needed a special camera to see it. Next, I tried a virtual reality game in which I walked on the moon. A company that makes weather radar explained how it can follow storms from hundreds of kilometers away. Another stand sold laser tools that measure a room in seconds. Children could join a short programming class and make a robot dance. I also bought a smart thermometer for my kitchen. Visitors had to wear antistatic gloves before touching the components on display. | 同課兩題情境重複（第③關同課重複表）：閱讀與 mcq 同為零件裝抗靜電袋；同課兩題情境重複（第③關同課重複表） |
| b2-u39-l02-q15 | passageZh | 上週末，我去參觀了台北的一場科技展。在第一個攤位，一家製造商展示了用奈米技術做成的微小電晶體，小到我們得用特殊的相機才看得到。接著，我玩了一個虛擬實境遊戲，在遊戲裡我在月球上走路。一家生產氣象雷達的公司解釋了雷達如何追蹤幾百公里外的暴風雨。另一個攤位賣能在幾秒內量出房間大小的雷射工具。孩子們可以參加簡短的程式課，讓機器人跳舞。我還買了一支廚房用的智慧溫度計。每一個展出的電腦零件都裝在抗靜電袋裡。 | 上週末，我去參觀了台北的一場科技展。在第一個攤位，一家製造商展示了用奈米技術做成的微小電晶體，小到我們得用特殊的相機才看得到。接著，我玩了一個虛擬實境遊戲，在遊戲裡我在月球上走路。一家生產氣象雷達的公司解釋了雷達如何追蹤幾百公里外的暴風雨。另一個攤位賣能在幾秒內量出房間大小的雷射工具。孩子們可以參加簡短的程式課，讓機器人跳舞。我還買了一支廚房用的智慧溫度計。參觀者摸展示的零件前，必須先戴上抗靜電手套。 | 同課兩題情境重複（第③關同課重複表）：閱讀與 mcq 同為零件裝抗靜電袋；同課兩題情境重複（第③關同課重複表） |
| b2-u39-l02-q17 | referenceEn/1 | My teacher uses a laser light to point at words on the board. | The shop used a laser to cut my name into a wooden sign. | 第③關 FIX：要點「常放在名詞前」改寫；同課兩題情境重複（第③關同課重複表）：參考答案與聽打同為雷射光指螢幕 |
| b2-u39-l02-q17 | rubricZh/1 | laser 常放在名詞前（例如 a laser show、a laser light 等） | laser 的用法，例如 a laser show、use a laser 等（可當名詞，也可放在名詞前） | 第③關 FIX：要點「常放在名詞前」改寫；同課兩題情境重複（第③關同課重複表）：參考答案與聽打同為雷射光指螢幕 |
| b2-u39-l02-q17 | rubricZh/2 | 時態配合內容（例如 saw、uses） | 時態合理（例如 saw、used 等） | 第③關 FIX：要點「常放在名詞前」改寫；同課兩題情境重複（第③關同課重複表）：參考答案與聽打同為雷射光指螢幕 |
| b2-u40-l01-q11 | sentenceEn | Safety is our first priority when we design new products. | The city has made cleaner air its top priority this year. | 情境表逐列人工重判：同課兩題事件類型相同，改寫（b1b4／b2cd1 裁示）：聽打與閱讀同為公司的第一優先 |
| b2-u40-l01-q11 | sentenceZh | 我們設計新產品時，安全是第一優先。 | 市政府今年把改善空氣品質列為第一優先。 | 情境表逐列人工重判：同課兩題事件類型相同，改寫（b1b4／b2cd1 裁示）：聽打與閱讀同為公司的第一優先 |
| b2-u40-l01-q12 | options/0 | The screen is broken | It takes three hours to charge | 聽選正解不可照抄音檔：正解換說法、干擾項沿用音檔字詞（b2cd1 裁示）；最終複審 FIX #22：三個干擾項都沒用音檔字，改一個干擾項沿用 three hours |
| b2-u40-l01-q12 | options/1 | The battery runs out too fast | The battery doesn't last long | 聽選正解不可照抄音檔：正解換說法、干擾項沿用音檔字詞（b2cd1 裁示）；最終複審 FIX #22：三個干擾項都沒用音檔字，改一個干擾項沿用 three hours |
| b2-u40-l01-q12 | options/2 | It is too heavy | It costs too much now | 聽選正解不可照抄音檔：正解換說法、干擾項沿用音檔字詞（b2cd1 裁示）；最終複審 FIX #22：三個干擾項都沒用音檔字，改一個干擾項沿用 three hours |
| b2-u40-l01-q12 | options/3 | It is the wrong color | It is too heavy | 聽選正解不可照抄音檔：正解換說法、干擾項沿用音檔字詞（b2cd1 裁示）；最終複審 FIX #22：三個干擾項都沒用音檔字，改一個干擾項沿用 three hours |
| b2-u40-l01-q15 | stemEn | The judges loved the ____ of her design; nobody had ever seen anything like it. | Teachers want students to show ____ in their stories, not copy ideas from books. | 同課兩題情境重複（第③關同課重複表）：mcq 與閱讀同為評審稱讚設計原創性 |
| b2-u40-l01-q15 | stemZh | 評審們很喜歡她設計的原創性；從來沒有人看過類似的東西。 | 老師希望學生在故事裡展現原創性，而不是照抄書上的點子。 | 同課兩題情境重複（第③關同課重複表）：mcq 與閱讀同為評審稱讚設計原創性 |
| b2-u40-l01-q17 | passageEn | Lin Meihua is an inventor who works for a small company in Hsinchu. Her latest project is a cheap robot that helps farmers pick fruit. The company's top priority is to keep the price low, so the team utilizes simple parts that farmers can repair themselves. Many experts praised the robot's originality, and a magazine called it one of the most innovative designs of the year. The company's projection is to sell five thousand robots in the first year. Next spring, the team will upgrade the software, and each farmer will receive a corresponding user guide in Chinese or English. The boss says that real innovation means solving problems for ordinary people. | Lin Meihua is an inventor who works for a small company in Hsinchu. Her latest project is a cheap robot that helps farmers pick fruit. The company's top priority is to keep the price low, so the team utilizes simple parts that farmers can repair themselves. Many experts praised the robot's originality, and a magazine called it one of the most innovative designs of the year. The company's projection is that it will sell five thousand robots in the first year. Next spring, the team will upgrade the software, and each farmer will receive a corresponding user guide in Chinese or English. The boss says that real innovation means solving problems for ordinary people. | 第②關 issue／第③關疑似（照審查建議改） 14：projection 不接 is to do |
| b2-u40-l01-q19 | rubricZh/2 | 時態配合內容（例如 am working on、started） | 時態配合內容（例如 am working on、started 等） | 評分要點：不寫死時態、「常見搭配」改「X 的用法，例如…等」、例如清單補「等」（b2cd1 裁示、第③關疑似 26） |
