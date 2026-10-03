# TASK-9 B2 撰寫狀態（b2c：b2-u25～b2-u44）

> 依 2026-10-02 創辦人 G5 裁示，題庫由開發端 Claude 逐課撰寫（author `claude-dev`）：
> - 不呼叫任何外部 LLM，花費 $0，也不讀 .env。
> - 工具：`scripts/author-lesson.mjs`（start／write）、`scripts/place-answers.mjs`（正解位置以 sha256(題位 id) 決定）。
> - 帳本：`content/items/_runs/claude-dev-pilot.json`。
> - 分支：`worktree-task-9-b2c`（基底 main `055c008`）。
>
> 本 worker 只負責 b2-u25～b2-u44（80 課）；u01～u24 已在 main，u45～u53 由另一位 B2 worker 負責。

## 各批

| 批 | 單元 | 課數 | 撰寫起訖（UTC，帳本） | 檢查器 | 狀態 |
|---|---|---|---|---|---|
| 1 | b2-u25～b2-u40 | 45 | 撰寫 2026-10-02 21:05 → 22:17；三關修正與最終複審修正 2026-10-03 | `check-items --require-judge`（u25～u44 共 80 課）全綠；merge main 後全級 984 課全綠；`npm test` 209／209 | **定稿**（重新盲答全部一致）。第 2 批修正輪連帶改了 u28-l04-q14（執行長裁示 2），這題待重新盲答；cursor、orchestra 改回「游標」「管弦樂團」。對照表 `b2c-batch1-changes.md` |
| 2 | b2-u41～b2-u44 | 35 | 撰寫 2026-10-02 22:54 → 2026-10-03 00:20；三關修正與最終複審修正 2026-10-03 | 同上 | **已依 b2c2-rulings 與最終複審（t9/b2c2-final.md）修完、已寫判題**。三關修正輪 40 題已重新盲答一致；最終複審輪 3 題待重新盲答（`b2c-batch2-reblind-final.txt`）；對照表 `b2c-batch2-changes.md` |

## 第 2 批：三關修正（2026-10-03，依 t9/b2c2-rulings.md）

詳見 `b2c-batch2-changes.md`：做法摘要、疑似逐條處理與理由、逐欄位改動對照。要點：

- **先 merge main**（`0128781`）：帳本取兩邊聯集，984 課；其餘沒有衝突。
- **第②關 30 條、第③關 FIX 63 條全修**。照建議改完又和同課其他題撞到的，再改一次（bid、seal、uncommon、underestimate、u41-l03-q12）。
- **疑似 32 條**：照建議改 27 條，維持 5 條（rim 分散、referent 詞性、跨單元重複、peacefully、coincide），理由都寫在對照表。
- **情境表加上「同課題目互比」**，腳本也改進了，見下方情境表說明。
- **長度名次（第 2 批改後）**：listenChoice 30／23／30／17%、mcq 26／29／22／23%、reading 25／25／26／24%。
- **其他檢查**：
  - 非本單元干擾項跨課重複 0 處，比對範圍是 merge 後的全部 B2（304 課）。
  - 0.5–2 倍、同課共用、用字範圍：lint 0 處。
- **最終複審修正**：9 條 FIX，加上執行長指定的 highly recommended，都已修，詳見對照表；本輪 3 題待重新盲答。

## 第 1 批：三關修正（2026-10-03，依 t9/b2cd1-rulings.md）

詳見 `b2c-batch1-changes.md`：做法摘要、不改項目與理由、逐欄位改動對照。要點：

- **聽選正解不照抄音檔**：
  - 45 題全部重寫成「正解換說法、干擾項沿用音檔字詞」。
  - 11 題的音檔和同課閱讀或其他題同事件，整段改寫。
- **情境表逐列人工重判**：
  - 依「整句的事件類型」重判，同課非單字卡題之間也比。
  - 第③關點名的同單元重複、13 組同課重複，加上自查另外找到的約 40 處，全部改寫。
- **其他修正**：
  - 單字卡第一義 16 張。
  - 評分要點：寫死時態、「常見搭配」改成「例如…等」。
  - 閱讀正解最長的 6 題。
  - 混合詞性題干擾項 3 題。
  - 可數性洩題 2 題。
  - 內容界線：火災情境、傷病看診、年長者、移民刻板印象。
- **cursor 的譯名**：維持「插入點」（執行長已接受；zh-guard 豁免列入 TASK-22 移交）。

## 第 1 批：最終複審修正（2026-10-03，依 t9/b2c1-final.md）

- **22 條 FIX 全部照「具體改法」修**，選項文字逐字照報告。
- **執行長兩處小修**：
  - u35-l01-q12 選項改成 "At a quarter to six"。
  - u28-l02-q10 選項 "Joined the gym again" 改成 "Goes to the gym again"，和其他選項同為現在式。
- **報告「不擋的提醒」順手修的 3 處**（只動中文欄位，不影響盲答）：
  - u26-l01-q15 optionGlossZh 改「關注」。
  - u28-l03-q15 小題 1 干擾項改「和副主任開會」。
  - u37-l02-q13 中譯補空格。
- **情境表逐列重算**後，另外改 4 處「主詞、句型都和卡相同」的列（見下方情境表說明）：
  - 第 1 批 3 處：u26-l01-q18 參考答案 2、u28-l01 organizer 卡、u37-l02 villa 卡。
  - 第 2 批 1 處：u41-l03-q12 跟讀。
- **其餘提醒沒有改**（聽選正解偏長、情境偏近、用語建議、u28-l04-q14 一眼可排除的干擾項）：
  - 這些都會動到選項或題幹，會增加重新盲答量，所以等執行長決定。
- **待重新盲答**：12 題，見 `b2c-batch1-reblind-final.txt`。
  - 22 條裡其餘的改動都在單字卡、跟讀、聽打、翻譯、造句，不影響盲答。
- **長度名次（第 1 批 45 課，改後）**：listenChoice 26／36／14／24%、mcq 32／28／18／22%、reading 26／19／22／33%，都在 13–37%。

## 第 2 批撰寫時的自查（u41～u44，35 課）

- **撰寫時已套用的規則**：
  - b1b4、b2cd1 規則：情境表逐列判、評分要點寫「例如…等」不寫死時態、內容界線、專名不用一般英文字。
  - 聽選：正解換說法，干擾項沿用音檔字詞。
- **依最終複審的問題型態自查**：
  - 聽選逐題比對選項和音檔的字詞重疊，改 5 題：
    - u41-l06、u42-l04、u42-l06 原本三個干擾項都沒用到音檔字。
    - u41-l05、u44-l01 原本正解照用音檔字最多。
  - 同課情境：同課非單字卡題之間也比過。
  - 單元內事件類型：每單元列出各課閱讀、聽選、卡片的事件，避免同單元重複。例如 u43 十課閱讀依序是爺爺看天氣、選籃球隊長、媒體課看廣告、植物音樂實驗、寵物店的魚、在家養雞、家庭聚餐爭論、辦公室蛋糕、阿姨學琴、訪問主廚。
- **長度名次（第 2 批 35 課）**：listenChoice 26／23／26／26%、mcq 26／27／25／22%、reading 25／25／26／24%，都在 13–37%。
- **其他**：
  - 非本單元干擾項跨課重複 0 處。比對範圍含 main 的 u01～u24、b2d worktree 的 u45～u53。
  - 每單元從第 2 課起，閱讀都沿用前一單元的字。
- **帳本時間說明**：u43-l01、u44-l01 是先擬好題目才記 start，所以這兩課在帳本上的耗時偏短。

### 每課「四選項同詞性、都放得進空格」的 mcq

依 lexicon 詞性腳本列出，再人工確認。標＊者 lexicon 列有次要詞性，但四個選項在句中詞性相同。

```
第 1 批
u25-l01 q13 / l02 q13 / l03 q13 / l04 q13 / l05 q12 / l06 q12 / l07 q12
u26-l01 q14＊
u27-l01 q13 / l02 q13 / l03 q13 / l04 q13 / l05 q13 / l06 q13 / l07 q12 / l08 q12 / l09 q12
u28-l01 q14 / l02 q13 / l03 q13 / l04 q13
u29-l01 q13 / l02 q13 / l03 q13 / l04 q12
u30-l01 q12 / l02 q12＊ / l03 q12 / l04 q12＊
u31-l01 q14＊ / l02 q14 / l03 q13
u32-l01 q13＊   u33-l01 q12   u34-l01 q13   u35-l01 q15
u36-l01 q11 / l02 q11＊（四個都作名詞修飾語）
u37-l01 q11 / l02 q11   u38-l01 q12 / l02 q11＊
u39-l01 q13 / l02 q13   u40-l01 q15
第 2 批（每課都是 q13）
u41-l01 動詞 / l02 名詞＊ / l03 名詞＊ / l04 動詞 / l05 動詞＊ / l06 動詞＊ / l07 動詞＊ / l08 動詞＊
u42-l01～l03 形容詞 / l04 副詞 / l05 形容詞 / l06 形容詞＊ / l07、l08 形容詞
u43-l01 名詞 / l02 形容詞 / l03 名詞 / l04～l06 形容詞 / l07 名詞 / l08～l10 形容詞
u44-l01 副詞 / l02、l03 形容詞 / l04 名詞＊ / l05 名詞＊ / l06 形容詞 / l07 名詞 / l08、l09 形容詞
```

## 建議（工具／準則，交執行長）

1. **opencc 誤擋**：`zh-guard` 的 opencc twp 會改寫一批台灣通行寫法，本批都改寫避開，沒有動 scripts（豁免已由執行長列入 TASK-22）：
   - 游標→遊標、程序→程式、管弦→管絃、雇主→僱主
   - 說明了→說明瞭、發明了→發明瞭
   - 宣布→宣佈、公布→公佈
   - 保存→儲存、創建→建立、念書→唸書
   - 社區→社群、添加→新增、掛斷→結束通話、發送→傳送、蒙蔽→矇蔽
2. **tokenizer**：檢查器把 `X-rayed`、`1980s`、`halfway` 判為無級距；本批改寫避開。
3. **缺少的自動檢查**：`author-lesson` 不會檢查以下項目，本批用 job tmp 裡的自查腳本做，沒有放進分支：
   - 只看英文唯一可解
   - 干擾項未教字
   - 非本單元字跨課重複
   - 聽選正解照抄音檔、干擾項沒用音檔字
   - 情境表主詞與句型是否和單字卡相同

   若要收進 repo，可考慮 additive 的 selfcheck 規則。

## 情境對照表（以現行檔案產生）

- **欄位**：目標字｜單字卡情境（摘要＋原句）｜其他用到該字的題（題號：摘要＋原句）｜換了哪幾項｜判定。
- **比較範圍**：聽打、聽選音檔、跟讀、mcq 題幹（填入正解）、閱讀短文逐句、翻譯和造句參考答案。
- **「換了哪幾項」逐列計算**（上一版一律填「主詞、情境、句型」，和實際不符，這版改掉）：
  - **主詞**：腳本比卡句和該句句首的主詞，跳過限定詞和數量詞；祈使句記為「祈使」。比對前先展開縮寫（It's → it is），kids 和 children 視為同一主詞。
  - **句型**：腳本比目標字前後各一個字，詞形還原後比較，兩個都相同才算句型沒換。
  - **情境**：整句的事件類型，撰寫時逐列人工判定為不同。
  - 同一題有多句時（閱讀、兩個參考答案），取變化最少的那一句來判。
- **判定**：三項至少換兩項才算「通過」。
  - 目前 1213 列全部通過；notes 列出的題號和實際用到目標字的題號，不一致 0 處。
- **同課題目互比**（第 2 批裁示新增，每課表格下方）：
  - 列出每一題非單字卡題的事件摘要，逐題人工判定互不相同。
  - 腳本另外找出「同一目標字、主詞和句型都相同」的兩題，80 課共標出 3 組：u44-l07、u26-l01 已改；u28-l04 q15↔q16 維持（第 1 批已定稿，兩題事件不同，只有表層句型 The timing of… 相同）。
- **限制**：主詞和句型是表層比對，只能抓出「主詞、句型都相同」的列。例如審查員指出的定義句換句話說（optimist），腳本抓不到，事件類型仍以人工判斷為準。

### 第 1 批

#### b2-u25-l01

| 目標字 | 單字卡情境 | 其他題情境 | 換了哪幾項 | 判定 |
|---|---|---|---|---|
| media | 歌手新歌受媒體關注<br>　The singer's new song got a lot of attention in the media. | q15：線上會議談社群媒體行銷<br>　They also talked about how social media could help sell it in Taiwan.<br>q16：報社用社群媒體分享新聞<br>　This newspaper uses social media to share news with young readers. / The newspaper shares news with young readers through social media. | q15：主詞、情境、句型<br>q16：主詞、情境、句型 | 通過 |
| transmission | 山上影片傳輸清楚<br>　The transmission of the video was clear, even from the top of the mountain. | q13：電視台停播球賽<br>　The TV station stopped the transmission of the game because of a power problem.<br>q15：線上會議傳輸不良<br>　At first, the transmission was poor, and the Japanese team could not hear us. | q13：主詞、情境<br>q15：情境、句型 | 通過 |
| feedback | 老師批改作文給回饋<br>　Our teacher writes helpful feedback at the end of every essay. | q12：感謝顧客意見改善服務<br>　Thank you for your feedback; we will use it to improve our service.<br>q15：日方請大家對產品給意見<br>　During the meeting, the Japanese partners asked for feedback on their new product. | q12：主詞、情境、句型<br>q15：主詞、情境、句型 | 通過 |
| transmit | 資料每小時傳到辦公室（被動）<br>　The weather data is transmitted to the main office every hour. | q14：衛星把電視訊號送到各地<br>　Satellites transmit TV signals to homes all over the world.<br>q15：系統清楚傳送聲音<br>　After that, the system could transmit our voices clearly. | q14：主詞、情境、句型<br>q15：主詞、情境、句型 | 通過 |
| microphone | 請對方靠近麥克風說話<br>　Could you speak a little closer to the microphone, please? | q10：演講前請測試麥克風<br>　Please test the microphone before the speech starts, because this room is very large.<br>q15：經理麥克風壞了向我借<br>　Our manager's microphone was broken, so he borrowed mine.<br>q17：我在婚禮／生日派對用麥克風<br>　I used a microphone when I gave a speech at my sister's wedding. / I once sang into a microphone at a friend's birthday party. | q10：主詞、情境、句型<br>q15：主詞、情境、句型<br>q17：主詞、情境、句型 | 通過 |
| interpreter | 她當日本訪客的口譯員<br>　She works as an interpreter for business visitors from Japan. | q09：口譯員幫兩位經理溝通<br>　The interpreter helped the two managers understand each other.<br>q15：口譯員在線上會議翻譯中日文<br>　Everyone joined from a laptop, and an interpreter translated between Chinese and Japanese. | q09：主詞、情境、句型<br>q15：主詞、情境、句型 | 通過 |
| laptop | 我用小背包背筆電<br>　I carry my laptop to work in a small backpack. | q11：我們的筆電舊、軟體跑很慢<br>　Our laptops are quite old, so the new software runs slowly.<br>q15：大家用筆電參加會議<br>　Everyone joined from a laptop, and an interpreter translated between Chinese and Japanese. | q11：主詞、情境、句型<br>q15：主詞、情境、句型 | 通過 |
| messenger | 古時信差騎馬送信<br>　Long ago, messengers rode horses to carry letters between cities. | q15：會後信差送來產品樣品<br>　When the meeting ended, a messenger arrived at our office with samples of the product, and we tried them right away. | q15：情境、句型 | 通過 |

同課題目互比（9 題；事件摘要逐題人工判定互不相同；腳本找「同目標字且主詞、句型都相同」的兩題：0 組）

| 題號 | 事件摘要 |
|---|---|
| q09 | interpreter：口譯員幫兩位經理溝通 |
| q10 | microphone：演講前請測試麥克風 |
| q11 | laptop：我們的筆電舊、軟體跑很慢 |
| q12 | feedback：感謝顧客意見改善服務 |
| q13 | transmission：電視台停播球賽 |
| q14 | transmit：衛星把電視訊號送到各地 |
| q15 | media：線上會議談社群媒體行銷；transmission：線上會議傳輸不良；feedback：日方請大家對產品給意見；transmit：系統清楚傳送聲音；microphone：經理麥克風壞了向我借；interpreter：口譯員在線上會議翻譯中日文；laptop：大家用筆電參加會議；messenger：會後信差送來產品樣品 |
| q16 | media：報社用社群媒體分享新聞 |
| q17 | microphone：我在婚禮／生日派對用麥克風 |

#### b2-u25-l02

| 目標字 | 單字卡情境 | 其他題情境 | 換了哪幾項 | 判定 |
|---|---|---|---|---|
| desktop | 我的電腦桌面滿是圖示<br>　My desktop is full of icons, so I can never find anything. | q15：Mia 在辦公室桌上型電腦寫稿<br>　Mia wrote the first draft of the announcement on her desktop computer at work, and her manager made a few changes. | q15：主詞、情境、句型 | 通過 |
| browse | 訪客可在網站瀏覽博物館照片<br>　Visitors can browse the museum's old photos on its website. | q10：我搭早班火車用手機看新聞<br>　I usually browse the news on my phone during my morning train ride.<br>q15：年輕人晚上上網瀏覽<br>　Then the team looked at data about their audience and found that most of them were young people who browse the internet late at night.<br>q17：我買衣服前逛網路商店／週末逛書店<br>　I often browse online shops before I buy new clothes. / I like to browse in bookstores on weekends. | q10：主詞、情境、句型<br>q15：主詞、情境、句型<br>q17：主詞、情境、句型 | 通過 |
| publicize | 報紙公開問題、市府修路<br>　The newspaper publicized the problem, and the city fixed the road quickly. | q14：樂團用社群媒體宣傳演唱會<br>　The band used social media to publicize their new concert.<br>q15：電台團隊想宣傳新節目<br>　Last month, her team wanted to publicize a new program about local food. | q14：主詞、情境、句型<br>q15：主詞、情境、句型 | 通過 |
| electronically | 票券都改電子販售<br>　All the tickets are now sold electronically, so there are no paper tickets. | q09：請在週五前以電子方式寄回表格<br>　Please send the signed form back electronically by Friday.<br>q15：團隊以電子方式寄公告給報社<br>　They also sent the announcement electronically to several newspapers. | q09：主詞、情境、句型<br>q15：主詞、情境、句型 | 通過 |
| presenter | 團隊選 Lisa 當業務會議報告人<br>　Our team chose Lisa as the presenter for the sales meeting. | q11：烹飪節目主持人總以笑話開場<br>　The presenter of the cooking show always starts with a joke.<br>q15：Mia 是網路電台主持人<br>　Mia is a presenter on a small online radio show. | q11：主詞、情境、句型<br>q15：主詞、情境、句型 | 通過 |
| data | 科學家十年收集海溫數據<br>　Scientists collected data on the sea temperature for ten years. | q15：團隊看聽眾資料<br>　Then the team looked at data about their audience and found that most of them were young people who browse the internet late at night.<br>q16：報告數據顯示更多人網購書<br>　The data in this report shows that more and more people buy books online. / According to the data in this report, more people are buying books online. | q15：主詞、情境、句型<br>q16：主詞、情境、句型 | 通過 |
| cable | 手機的線太短搆不到床<br>　The cable for my phone is too short to reach the bed. | q12：我覺得這條線壞了、螢幕變黑<br>　I think this cable is broken, because the screen keeps going black.<br>q15：錄音室一條線壞了被修好<br>　On the first night of the program, a cable in the studio stopped working, but someone fixed it within minutes, and the show started as scheduled. | q12：主詞、情境、句型<br>q15：主詞、情境、句型 | 通過 |
| draft | 老闆把草稿退回、滿是紅字<br>　My boss returned the draft with red notes all over it. | q13：請對方看我的草稿再定稿<br>　Please read my draft and tell me what to change before I send the final version.<br>q15：Mia 寫公告初稿<br>　Mia wrote the first draft of the announcement on her desktop computer at work, and her manager made a few changes. | q13：主詞、情境、句型<br>q15：主詞、情境、句型 | 通過 |

同課題目互比（9 題；事件摘要逐題人工判定互不相同；腳本找「同目標字且主詞、句型都相同」的兩題：0 組）

| 題號 | 事件摘要 |
|---|---|
| q09 | electronically：請在週五前以電子方式寄回表格 |
| q10 | browse：我搭早班火車用手機看新聞 |
| q11 | presenter：烹飪節目主持人總以笑話開場 |
| q12 | cable：我覺得這條線壞了、螢幕變黑 |
| q13 | draft：請對方看我的草稿再定稿 |
| q14 | publicize：樂團用社群媒體宣傳演唱會 |
| q15 | desktop：Mia 在辦公室桌上型電腦寫稿；browse：年輕人晚上上網瀏覽；publicize：電台團隊想宣傳新節目；electronically：團隊以電子方式寄公告給報社；presenter：Mia 是網路電台主持人；data：團隊看聽眾資料；cable：錄音室一條線壞了被修好；draft：Mia 寫公告初稿 |
| q16 | data：報告數據顯示更多人網購書 |
| q17 | browse：我買衣服前逛網路商店／週末逛書店 |

#### b2-u25-l03

| 目標字 | 單字卡情境 | 其他題情境 | 換了哪幾項 | 判定 |
|---|---|---|---|---|
| correspondent | 電視台特派記者在機場現場連線<br>　The TV station's correspondent gave a live report from the airport. | q15：Tom 是電台記者、報導電子產品<br>　Tom is a correspondent for a radio station in Taipei, and every week he reports on new electronics. | q15：主詞、情境、句型 | 通過 |
| database | 圖書館資料庫藏書百萬<br>　The library's database lists more than a million books. | q13：公司把顧客資料存在資料庫<br>　The company keeps the names and addresses of all its customers in a database.<br>q15：Tom 搜尋聽眾留言資料庫<br>　Tom wanted to know if other people had the same problem, so he searched the station's database of listener messages. | q13：主詞、情境、句型<br>q15：主詞、情境、句型 | 通過 |
| input | 做決定前需要各部門意見<br>　We need input from every department before we make a decision. | q14：謝謝你的意見幫了專案<br>　Thank you for your input; your ideas really helped the project.<br>q15：兩位工程師提供意見<br>　With input from two engineers, he wrote a report and edited it carefully. | q14：主詞、情境、句型<br>q15：主詞、情境、句型 | 通過 |
| edit | 她編一本園藝小雜誌<br>　She edits a small magazine about gardening. | q12：我要花一小時剪輯影片<br>　I need about an hour to edit the video before we post it online.<br>q15：Tom 仔細修改報導<br>　With input from two engineers, he wrote a report and edited it carefully. | q12：主詞、情境、句型<br>q15：主詞、情境、句型 | 通過 |
| anonymous | 這首古詩作者不詳<br>　The writer of this famous old poem is anonymous. | q09：匿名商人出資蓋新公園（被動）<br>　The new park was paid for by an anonymous businessman.<br>q15：匿名聽眾寄信給 Tom<br>　Last month, an anonymous listener sent him an email about a phone that often got very hot.<br>q16：問卷匿名、請誠實回答<br>　This survey is anonymous, so please answer honestly. / The survey is anonymous, so please be honest in your answers. | q09：主詞、情境、句型<br>q15：主詞、情境、句型<br>q16：主詞、情境、句型 | 通過 |
| listener | 歌手唱完聽眾大聲鼓掌<br>　The listeners clapped loudly when the singer finished her last song. | q15：電台聽眾留言資料庫<br>　Last month, an anonymous listener sent him an email about a phone that often got very hot. / Tom wanted to know if other people had the same problem, so he searched the station's database of listener messages.<br>q17：我是不是好的傾聽者<br>　I think I am a good listener because I never stop people while they are talking. / I am not a very good listener, because I often look at my phone. | q15：主詞、情境、句型<br>q17：主詞、情境、句型 | 通過 |
| electronics | 假期後電子產品降價<br>　Prices of electronics usually drop after the holidays. | q10：轉角電子產品店因暴風雨早關<br>　The electronics store on the corner is closing early today because of the storm.<br>q15：Tom 每週報導新電子產品<br>　Tom is a correspondent for a radio station in Taipei, and every week he reports on new electronics. | q10：主詞、情境、句型<br>q15：主詞、情境、句型 | 通過 |
| correspond | 我們通信多年才見面<br>　We corresponded by letter for years before we finally met. | q11：經理要我用西班牙文和客戶往來<br>　The manager asked me to correspond with our clients in Spanish.<br>q15：Tom 用 email 和手機公司聯絡<br>　However, after Tom corresponded with the company by email, it finally admitted the problem. | q11：主詞、情境、句型<br>q15：主詞、情境、句型 | 通過 |

同課題目互比（9 題；事件摘要逐題人工判定互不相同；腳本找「同目標字且主詞、句型都相同」的兩題：0 組）

| 題號 | 事件摘要 |
|---|---|
| q09 | anonymous：匿名商人出資蓋新公園（被動） |
| q10 | electronics：轉角電子產品店因暴風雨早關 |
| q11 | correspond：經理要我用西班牙文和客戶往來 |
| q12 | edit：我要花一小時剪輯影片 |
| q13 | database：公司把顧客資料存在資料庫 |
| q14 | input：謝謝你的意見幫了專案 |
| q15 | correspondent：Tom 是電台記者、報導電子產品；database：Tom 搜尋聽眾留言資料庫；input：兩位工程師提供意見；edit：Tom 仔細修改報導；anonymous：匿名聽眾寄信給 Tom；listener：電台聽眾留言資料庫；electronics：Tom 每週報導新電子產品；correspond：Tom 用 email 和手機公司聯絡 |
| q16 | anonymous：問卷匿名、請誠實回答 |
| q17 | listener：我是不是好的傾聽者 |

#### b2-u25-l04

| 目標字 | 單字卡情境 | 其他題情境 | 換了哪幾項 | 判定 |
|---|---|---|---|---|
| mumble | 叫人別含糊、說清楚（祈使）<br>　Stop mumbling and speak clearly, please. | q09：他咕噥說累了就回房<br>　He mumbled something about being tired and went to his room.<br>q15：記者講快時會含糊<br>　Some reporters also mumble when they speak quickly, so the captions help everyone. | q09：主詞、情境、句型<br>q15：主詞、情境、句型 | 通過 |
| broadcaster | 幾家電視台想轉播決賽<br>　Several broadcasters want to show the final game this year. | q15：國家電視台為新聞加字幕<br>　Last year, a national broadcaster started adding captions to all of its news programs. / The broadcaster's manager emphatically promised to fix the problem, and the team hired more editors to check unfamiliar names and words. | q15：情境、句型 | 通過 |
| buzz | 舊冰箱嗡嗡聲吵得睡不著<br>　The buzz of the old fridge kept me awake all night. | q12：開會時手機震動兩次<br>　My phone buzzed twice during the meeting, but I didn't answer it.<br>q15：蜜蜂報導 buzz 被誤植<br>　In one report about bees, the word "buzz" appeared as "bus." | q12：主詞、情境、句型<br>q15：主詞、情境、句型 | 通過 |
| overhear | 她無意中聽到老闆說公司要搬<br>　She overheard her boss saying that the company might move. | q11：在火車上說話小心被別人聽到<br>　Be careful what you say on the train, because other people can overhear you.<br>q14：我不是故意聽到你們談話<br>　I didn't mean to overhear your conversation, but you were talking quite loudly. | q11：主詞、情境、句型<br>q14：主詞、情境、句型 | 通過 |
| zoom | 這台相機變焦很強<br>　This camera has a powerful zoom, so you can see faces from far away. | q15：觀眾用螢幕縮放放大字幕<br>　Now viewers can even use the zoom on their screens to make the captions bigger.<br>q17：我用手機變焦拍月亮／公園鳥<br>　I used the zoom on my phone to take a photo of the moon. / I often use the zoom to take pictures of birds in the park. | q15：主詞、情境、句型<br>q17：主詞、情境、句型 | 通過 |
| caption | 幫貓咪照片寫好笑說明（祈使）<br>　Please write a funny caption for this picture of our cat. | q13：報紙照片下的說明介紹人物<br>　The photo in the newspaper had a short caption under it explaining who the people were.<br>q15：電視台新聞加字幕<br>　Last year, a national broadcaster started adding captions to all of its news programs. / Some reporters also mumble when they speak quickly, so the captions help everyone. / At first, the captions were often wrong. / Now viewers can even use the zoom on their screens to make the captions bigger. | q13：主詞、情境、句型<br>q15：主詞、情境、句型 | 通過 |
| browser | 問對方用哪個瀏覽器<br>　Which browser do you use on your computer? | q10：網站怪怪的就換瀏覽器開<br>　If the website looks strange, try opening it in a different browser.<br>q15：觀眾用手機瀏覽器看新聞<br>　The idea came from a viewer who often watched the news on her phone's browser in quiet places like the library, where she could not turn the sound on. | q10：主詞、情境、句型<br>q15：主詞、情境、句型 | 通過 |
| emphatically | 屋主斷然拒絕賣老房子<br>　The owner emphatically refused to sell the old house. | q15：經理強調會修正問題<br>　The broadcaster's manager emphatically promised to fix the problem, and the team hired more editors to check unfamiliar names and words.<br>q16：她斷然說不再去那家餐廳<br>　She said emphatically that she would never go back to that restaurant. / She emphatically said she would never return to that restaurant. | q15：主詞、情境、句型<br>q16：主詞、情境、句型 | 通過 |

同課題目互比（9 題；事件摘要逐題人工判定互不相同；腳本找「同目標字且主詞、句型都相同」的兩題：0 組）

| 題號 | 事件摘要 |
|---|---|
| q09 | mumble：他咕噥說累了就回房 |
| q10 | browser：網站怪怪的就換瀏覽器開 |
| q11 | overhear：在火車上說話小心被別人聽到 |
| q12 | buzz：開會時手機震動兩次 |
| q13 | caption：報紙照片下的說明介紹人物 |
| q14 | overhear：我不是故意聽到你們談話 |
| q15 | mumble：記者講快時會含糊；broadcaster：國家電視台為新聞加字幕；buzz：蜜蜂報導 buzz 被誤植；zoom：觀眾用螢幕縮放放大字幕；caption：電視台新聞加字幕；browser：觀眾用手機瀏覽器看新聞；emphatically：經理強調會修正問題 |
| q16 | emphatically：她斷然說不再去那家餐廳 |
| q17 | zoom：我用手機變焦拍月亮／公園鳥 |

#### b2-u25-l05

| 目標字 | 單字卡情境 | 其他題情境 | 換了哪幾項 | 判定 |
|---|---|---|---|---|
| converse | 貓都是動物、反之不成立<br>　All cats are animals, but the converse is not true: not all animals are cats. | q14：講者說會讀的人會寫、反之亦然<br>　He also said that good readers often become good writers, and the converse is also true: people who write a lot become better readers. | q14：主詞、情境 | 通過 |
| subtitle | 這部片有十二種語言字幕<br>　This film has subtitles in twelve languages. | q14：演講影片加字幕供錯過者看<br>　The talk was recorded, and people who missed it can now watch the video with subtitles.<br>q15：我看韓劇都開中文字幕<br>　I always turn on Chinese subtitles when I watch Korean dramas. / When I watch Korean dramas, I always use Chinese subtitles. | q14：主詞、情境、句型<br>q15：主詞、情境、句型 | 通過 |
| cyberspace | 每天很多照片在網路上分享（被動）<br>　A huge number of photos are shared in cyberspace every day. | q11：人在網路上說出當面不會說的話<br>　In cyberspace, people sometimes say things they would never say face to face.<br>q14：鎮公所把消息貼上網路<br>　The town printed hundreds of leaflets and also posted the news in cyberspace, on social media and local websites. | q11：主詞、情境、句型<br>q14：主詞、情境、句型 | 通過 |
| broadband | 我們家寬頻每月很貴<br>　We pay quite a lot for our home broadband every month. | q08：飯店每間房免費寬頻<br>　The hotel offers free broadband in every room.<br>q14：全國都有快速寬頻<br>　He explained that fast broadband is now available nationwide, even in small mountain villages. | q08：主詞、情境、句型<br>q14：主詞、情境、句型 | 通過 |
| leaflet | 傳單說明怎麼回收電池<br>　The leaflet explains how to recycle old batteries. | q09：傳單說博物館週一休館、改週二去<br>　The museum is closed on Mondays, the leaflet says, so let's go on Tuesday.<br>q10：請別把傳單放在街上車子（祈使）<br>　Please don't leave leaflets on the cars in this street.<br>q14：鎮公所印數百張傳單<br>　The town printed hundreds of leaflets and also posted the news in cyberspace, on social media and local websites. | q09：主詞、情境、句型<br>q10：主詞、情境、句型<br>q14：主詞、情境、句型 | 通過 |
| communicative | 孩子有安全感時更願意溝通<br>　Children usually become more communicative when they feel safe. | q13：新經理很善於溝通、會解釋決定<br>　Our new manager is very communicative and always explains her decisions to the team.<br>q16：我姊姊／老闆很善於溝通<br>　My sister is very communicative, so she makes friends easily. / My boss is a communicative person who listens to everyone's ideas. | q13：主詞、情境、句型<br>q16：主詞、情境、句型 | 通過 |
| orator | 演說家不用麥克風聲音傳遍大廳<br>　The orator's voice filled the whole hall without a microphone. | q12：大家都說他是傑出演說家<br>　Everyone agreed that he was a brilliant orator; his speeches made crowds cry and cheer.<br>q14：講者是退休老師、知名演說家<br>　The speaker was a retired teacher and a famous orator. | q12：主詞、情境、句型<br>q14：主詞、情境、句型 | 通過 |

同課題目互比（9 題；事件摘要逐題人工判定互不相同；腳本找「同目標字且主詞、句型都相同」的兩題：0 組）

| 題號 | 事件摘要 |
|---|---|
| q08 | broadband：飯店每間房免費寬頻 |
| q09 | leaflet：傳單說博物館週一休館、改週二去 |
| q10 | leaflet：請別把傳單放在街上車子（祈使） |
| q11 | cyberspace：人在網路上說出當面不會說的話 |
| q12 | orator：大家都說他是傑出演說家 |
| q13 | communicative：新經理很善於溝通、會解釋決定 |
| q14 | converse：講者說會讀的人會寫、反之亦然；subtitle：演講影片加字幕供錯過者看；cyberspace：鎮公所把消息貼上網路；broadband：全國都有快速寬頻；leaflet：鎮公所印數百張傳單；orator：講者是退休老師、知名演說家 |
| q15 | subtitle：我看韓劇都開中文字幕 |
| q16 | communicative：我姊姊／老闆很善於溝通 |

#### b2-u25-l06

| 目標字 | 單字卡情境 | 其他題情境 | 換了哪幾項 | 判定 |
|---|---|---|---|---|
| newsworthy | 每天搭公車的貓很有新聞價值<br>　A cat that rides the bus every day is quite newsworthy. | q12：記者認為故事不夠格上晚間新聞<br>　The reporter decided the story was not newsworthy enough to be on the evening news.<br>q14：有新聞價值的事幾分鐘就上網<br>　A newsworthy event can be online within minutes, but he worries that some reports are now written too quickly.<br>q16：我覺得鎮上新夜市／新橋值得上新聞<br>　I think the new night market in my town is newsworthy. / The opening of the new bridge in my city was really newsworthy. | q12：主詞、情境、句型<br>q14：主詞、情境、句型<br>q16：主詞、情境、句型 | 通過 |
| cursor | 螢幕上指標一直消失<br>　The cursor on my screen keeps disappearing. | q08：把指標移到頁面上方按紅鈕（祈使）<br>　Move the cursor to the top of the page and click the red button. | q08：主詞、情境、句型 | 通過 |
| anchorman | 男主播直播出錯趕快道歉<br>　The anchorman made a small mistake during the live news and quickly apologized. | q14：陳先生當了三十年晚間新聞主播<br>　Chen was the anchorman of the evening news on a local TV station. | q14：主詞、情境、句型 | 通過 |
| keystroke | 按一個鍵就能存檔<br>　You can save the file with a single keystroke. | q11：舊鍵盤每次按鍵都很吵<br>　Every keystroke on this old keyboard makes a loud noise.<br>q14：陳先生記得每次敲鍵的聲音<br>　In 1984, the station bought its first microcomputers, and he still remembers the sound of every keystroke. | q11：主詞、情境、句型<br>q14：主詞、情境、句型 | 通過 |
| microcomputer | 現在手機比早期微電腦強<br>　Today's phones are far more powerful than the first microcomputers. | q13：筆電出現前辦公室用微電腦寫報告<br>　Before laptops, many offices used a microcomputer to write reports.<br>q14：電視台八四年買微電腦<br>　In 1984, the station bought its first microcomputers, and he still remembers the sound of every keystroke. | q13：主詞、情境、句型<br>q14：主詞、情境、句型 | 通過 |
| paperless | 銀行提供電子帳單<br>　Many banks now offer paperless bills by email. | q09：學校無紙化、作業網路繳交<br>　Our school went paperless, so all homework is now sent online.<br>q14：新聞室完全無紙化<br>　Today, the office is completely paperless: reporters share stories on screens, and the anchorperson reads from a screen in front of the camera.<br>q15：這場會議無紙化、資料都在手機上<br>　This meeting is paperless; all the documents are on our phones. / The meeting is paperless, so all the documents are on our phones. | q09：主詞、情境、句型<br>q14：主詞、情境、句型<br>q15：主詞、情境、句型 | 通過 |
| anchorperson | 電視台在找晨間節目新主播<br>　The station is looking for a new anchorperson for its morning show. | q10：主播微笑向觀眾說晚安<br>　The anchorperson smiled and said good evening to everyone at home.<br>q14：主播看鏡頭前的螢幕播報<br>　Today, the office is completely paperless: reporters share stories on screens, and the anchorperson reads from a screen in front of the camera. | q10：主詞、情境、句型<br>q14：主詞、情境、句型 | 通過 |

同課題目互比（9 題；事件摘要逐題人工判定互不相同；腳本找「同目標字且主詞、句型都相同」的兩題：0 組）

| 題號 | 事件摘要 |
|---|---|
| q08 | cursor：把指標移到頁面上方按紅鈕（祈使） |
| q09 | paperless：學校無紙化、作業網路繳交 |
| q10 | anchorperson：主播微笑向觀眾說晚安 |
| q11 | keystroke：舊鍵盤每次按鍵都很吵 |
| q12 | newsworthy：記者認為故事不夠格上晚間新聞 |
| q13 | microcomputer：筆電出現前辦公室用微電腦寫報告 |
| q14 | newsworthy：有新聞價值的事幾分鐘就上網；anchorman：陳先生當了三十年晚間新聞主播；keystroke：陳先生記得每次敲鍵的聲音；microcomputer：電視台八四年買微電腦；paperless：新聞室完全無紙化；anchorperson：主播看鏡頭前的螢幕播報 |
| q15 | paperless：這場會議無紙化、資料都在手機上 |
| q16 | newsworthy：我覺得鎮上新夜市／新橋值得上新聞 |

#### b2-u25-l07

| 目標字 | 單字卡情境 | 其他題情境 | 換了哪幾項 | 判定 |
|---|---|---|---|---|
| cyberaddict | 學校為想少上網的人開課<br>　The school offers classes for cyberaddicts who want to spend less time online. | q14：表哥常泡網咖被父母叫網路成癮<br>　My cousin spent so many nights there that his parents called him a cyberaddict. | q14：主詞、情境、句型 | 通過 |
| cybercafe | 我們在飯店附近網咖印票<br>　We found a small cybercafe near the hotel and printed our tickets there. | q12：網咖一小時五十元含飲料<br>　The cybercafe charges fifty dollars an hour for a computer and a drink.<br>q14：二十年前到處都有網咖<br>　Twenty years ago, there was a cybercafe on almost every street in my town. | q12：主詞、情境、句型<br>q14：主詞、情境、句型 | 通過 |
| cyberpet | 女兒陪電子寵物玩會發出開心聲<br>　My daughter's cyberpet makes a happy sound when she plays with it. | q11：我小時候每天要餵電子寵物<br>　When I was a child, I had a cyberpet that I had to feed every day. | q11：主詞、情境、句型 | 通過 |
| exclamation mark | 一句感嘆句以驚嘆號結尾<br>　The sentence "What a beautiful day!" ends with an exclamation mark. | q08：工作信別每句都用驚嘆號（祈使）<br>　Don't use an exclamation mark in every sentence of a work email.<br>q14：網友寄滿是驚嘆號的信<br>　Netsurfers paid by the hour to play games, chat with friends and send emails with an exclamation mark in every line.<br>q16：我寫訊息給朋友時用驚嘆號<br>　I use an exclamation mark when I write a happy message to my friends. / I never put an exclamation mark in emails to my boss. | q08：主詞、情境、句型<br>q14：主詞、情境、句型<br>q16：主詞、情境、句型 | 通過 |
| hard drive | 電腦硬碟壞了檔案全沒了<br>　The computer's hard drive stopped working, and I lost all my files. | q09：筆電硬碟快滿、刪舊影片<br>　My laptop's hard drive is almost full, so I'm deleting some old videos.<br>q14：老闆保留舊電腦的原始硬碟<br>　The owner even keeps an old computer with its original hard drive, so visitors can see what the internet looked like two decades ago.<br>q15：我把照片都存在這個硬碟<br>　I keep all my photos on this hard drive. / I have saved all my photos on this hard drive. | q09：主詞、情境、句型<br>q14：主詞、情境、句型<br>q15：主詞、情境、句型 | 通過 |
| high-tech | 台灣高科技產業有名<br>　Taiwan is famous for its high-tech industry. | q10：新火車站很高科技、有機器人<br>　The new train station is very high-tech, with robots that answer questions.<br>q13：工廠用高科技機器<br>　The factory uses high-tech machines that can work without people.<br>q14：網咖變成高科技遊戲中心<br>　It has become a high-tech gaming center with huge screens. | q10：主詞、情境、句型<br>q13：主詞、情境、句型<br>q14：主詞、情境、句型 | 通過 |
| netsurfer | 網友在搞笑影片下留言<br>　Netsurfers left thousands of comments under the funny video. | q14：網友按小時付費上網<br>　Netsurfers paid by the hour to play games, chat with friends and send emails with an exclamation mark in every line. | q14：情境、句型 | 通過 |

同課題目互比（9 題；事件摘要逐題人工判定互不相同；腳本找「同目標字且主詞、句型都相同」的兩題：0 組）

| 題號 | 事件摘要 |
|---|---|
| q08 | exclamation mark：工作信別每句都用驚嘆號（祈使） |
| q09 | hard drive：筆電硬碟快滿、刪舊影片 |
| q10 | high-tech：新火車站很高科技、有機器人 |
| q11 | cyberpet：我小時候每天要餵電子寵物 |
| q12 | cybercafe：網咖一小時五十元含飲料 |
| q13 | high-tech：工廠用高科技機器 |
| q14 | cyberaddict：表哥常泡網咖被父母叫網路成癮；cybercafe：二十年前到處都有網咖；exclamation mark：網友寄滿是驚嘆號的信；hard drive：老闆保留舊電腦的原始硬碟；high-tech：網咖變成高科技遊戲中心；netsurfer：網友按小時付費上網 |
| q15 | hard drive：我把照片都存在這個硬碟 |
| q16 | exclamation mark：我寫訊息給朋友時用驚嘆號 |

#### b2-u26-l01

| 目標字 | 單字卡情境 | 其他題情境 | 換了哪幾項 | 判定 |
|---|---|---|---|---|
| journalism | 好的新聞工作會查證事實<br>　Good journalism checks every fact before it is printed. | q10：她念新聞、現在替地方報寫稿<br>　She studied journalism and now writes for a local newspaper.<br>q16：Amy 做了二十年新聞工作<br>　Amy Lin worked in journalism for twenty years before she wrote her first novel. | q10：主詞、情境、句型<br>q16：主詞、情境、句型 | 通過 |
| publicity | 那位演員討厭媒體關注、很少受訪<br>　The actor hates publicity and rarely gives interviews. | q15：新橋造型特別受到關注<br>　The city's new bridge got a lot of publicity because of its unusual shape.<br>q16：主播介紹後小說開始受關注<br>　The publicity started when a popular newscaster talked about the book on TV, and thousands of viewers ordered it that night. | q15：主詞、情境、句型<br>q16：主詞、情境、句型 | 通過 |
| editorial | 父親讀報先看社論<br>　My father reads the editorials before any other page of the newspaper. | q16：Amy 曾替報社寫社論<br>　During those years, she wrote editorials for a serious newspaper and sometimes laughed at the tabloids, which cared more about famous people's love lives than real news.<br>q17：今天的社論談空氣汙染<br>　Today's editorial in the newspaper is about air pollution. / The newspaper's editorial today discusses air pollution. | q16：主詞、情境、句型<br>q17：主詞、情境、句型 | 通過 |
| publication | 字典出版花了十年<br>　The publication of the new dictionary took ten years. | q16：小說去年春天出版後<br>　After its publication last spring, her novel quickly became a bestseller. | q16：主詞、情境、句型 | 通過 |
| viewer | 頻道的年輕觀眾流向網路影片<br>　This channel has lost many young viewers to online videos. | q13：很多觀眾打電話抱怨結局<br>　Many viewers called the station to complain about the ending.<br>q16：數千名觀眾當晚訂書<br>　The publicity started when a popular newscaster talked about the book on TV, and thousands of viewers ordered it that night. | q13：主詞、情境、句型<br>q16：主詞、情境、句型 | 通過 |
| tabloid | 別全信八卦小報（祈使）<br>　Don't believe everything you read in the tabloids. | q16：Amy 曾笑八卦小報只關心名人戀情<br>　During those years, she wrote editorials for a serious newspaper and sometimes laughed at the tabloids, which cared more about famous people's love lives than real news. | q16：主詞、情境、句型 | 通過 |
| soundtrack | 遊戲配樂由真的管弦樂團演奏（被動）<br>　The soundtrack of this game was played by a real orchestra. | q11：我因歌好聽買電影原聲帶<br>　I bought the soundtrack of the film because the songs were so beautiful.<br>q16：樂團答應為電影寫配樂<br>　Now a film company wants to make it into a movie, and a famous band has agreed to write the soundtrack.<br>q18：喜歡老卡通配樂還會聽／最愛電影的配樂讓我放鬆<br>　That old cartoon has a soundtrack I still listen to. / My favorite movie has a soundtrack that always makes me feel calm. | q11：主詞、情境<br>q16：主詞、情境、句型<br>q18：主詞、情境、句型 | 通過 |
| newscaster | 主播見狗跑進攝影棚突然笑出來<br>　The newscaster suddenly laughed when a dog ran into the studio. | q12：阿姨在台南電台當播報員<br>　My aunt worked as a newscaster for a radio station in Tainan.<br>q16：知名主播在電視上介紹這本書<br>　The publicity started when a popular newscaster talked about the book on TV, and thousands of viewers ordered it that night. | q12：主詞、情境、句型<br>q16：主詞、情境、句型 | 通過 |
| bestseller | 這本烹飪書暢銷三年<br>　This book about home cooking has been a bestseller for three years. | q14：手機是公司去年最暢銷商品<br>　This phone was the company's biggest bestseller last year; it sold ten million.<br>q16：小說很快成為暢銷書<br>　After its publication last spring, her novel quickly became a bestseller. | q14：主詞、情境、句型<br>q16：主詞、情境、句型 | 通過 |

同課題目互比（9 題；事件摘要逐題人工判定互不相同；腳本找「同目標字且主詞、句型都相同」的兩題：0 組）

| 題號 | 事件摘要 |
|---|---|
| q10 | journalism：她念新聞、現在替地方報寫稿 |
| q11 | soundtrack：我因歌好聽買電影原聲帶 |
| q12 | newscaster：阿姨在台南電台當播報員 |
| q13 | viewer：很多觀眾打電話抱怨結局 |
| q14 | bestseller：手機是公司去年最暢銷商品 |
| q15 | publicity：新橋造型特別受到關注 |
| q16 | journalism：Amy 做了二十年新聞工作；publicity：主播介紹後小說開始受關注；editorial：Amy 曾替報社寫社論；publication：小說去年春天出版後；viewer：數千名觀眾當晚訂書；tabloid：Amy 曾笑八卦小報只關心名人戀情；soundtrack：樂團答應為電影寫配樂；newscaster：知名主播在電視上介紹這本書；bestseller：小說很快成為暢銷書 |
| q17 | editorial：今天的社論談空氣汙染 |
| q18 | soundtrack：喜歡老卡通配樂還會聽／最愛電影的配樂讓我放鬆 |

#### b2-u27-l01

| 目標字 | 單字卡情境 | 其他題情境 | 換了哪幾項 | 判定 |
|---|---|---|---|---|
| popularity | 夜市越來越受歐洲遊客歡迎<br>　Night markets are gaining popularity with tourists from Europe. | q09：電動滑板車在本市越來越普及<br>　The popularity of electric scooters has grown quickly in our city.<br>q15：美食節人氣大增、五萬人來<br>　Its popularity has grown so much that over fifty thousand people came last year. | q09：主詞、情境、句型<br>q15：主詞、情境、句型 | 通過 |
| prestigious | 他第一部片得到重要大獎<br>　He won a prestigious prize for his first film. | q13：哈佛是最有聲望的大學之一<br>　Harvard is one of the most prestigious universities in the world, and many students dream of studying there.<br>q15：知名烹飪學校派學生做菜<br>　A prestigious cooking school sent its students to cook dishes from around the world, and a local history institution led free walks through the old streets. | q13：主詞、情境、句型<br>q15：主詞、情境、句型 | 通過 |
| institution | 銀行是保管錢的金融機構<br>　Banks are financial institutions that keep people's money safe. | q14：市立博物館是最老的文化機構之一<br>　The city museum is one of the oldest cultural institutions in the country.<br>q15：地方歷史機構帶大家免費走訪老街<br>　A prestigious cooking school sent its students to cook dishes from around the world, and a local history institution led free walks through the old streets. | q14：主詞、情境、句型<br>q15：主詞、情境、句型 | 通過 |
| sexual | 很多鳥類性別差異明顯<br>　In many birds, sexual differences are easy to see, because the males are more colorful. | q16：許多國家工作上性別歧視違法<br>　In many countries, sexual discrimination at work is against the law. / Sexual discrimination at work is illegal in many countries. | q16：情境、句型 | 通過 |
| faith | 醜聞後大家不再信任公司<br>　After the scandal, many people lost faith in the company. | q11：父母一直相信我的決定<br>　My parents have always had faith in my decisions.<br>q17：我對朋友的建議／球隊很有信心<br>　I have great faith in my best friend's advice. / I have faith that our team will win the next game. | q11：主詞、情境、句型<br>q17：主詞、情境、句型 | 通過 |
| hell | 我新工作第一週很痛苦<br>　My first week at the new job was hell. | q12：我們吃盡苦頭才買到演唱會票<br>　We went through hell to get tickets for the concert.<br>q15：遊客說找停車位像地獄<br>　One visitor wrote, "Finding a parking space was hell, but the food was worth it." | q12：主詞、情境、句型<br>q15：主詞、情境、句型 | 通過 |
| ethnic | 城市這一區住著許多民族<br>　Many ethnic groups live in this part of the city. | q15：美食節慶祝各民族社群<br>　Every autumn, our city holds a food festival that celebrates its many ethnic communities. | q15：主詞、情境、句型 | 通過 |
| minister | 部長回答記者問題一小時<br>　The minister answered questions from reporters for an hour. | q10：部長說新鐵路明年通車<br>　The minister said that the new train line will open next year.<br>q15：文化部長演講開幕<br>　This year, the minister of culture opened the festival with a short speech. | q10：情境、句型<br>q15：情境、句型 | 通過 |

同課題目互比（9 題；事件摘要逐題人工判定互不相同；腳本找「同目標字且主詞、句型都相同」的兩題：0 組）

| 題號 | 事件摘要 |
|---|---|
| q09 | popularity：電動滑板車在本市越來越普及 |
| q10 | minister：部長說新鐵路明年通車 |
| q11 | faith：父母一直相信我的決定 |
| q12 | hell：我們吃盡苦頭才買到演唱會票 |
| q13 | prestigious：哈佛是最有聲望的大學之一 |
| q14 | institution：市立博物館是最老的文化機構之一 |
| q15 | popularity：美食節人氣大增、五萬人來；prestigious：知名烹飪學校派學生做菜；institution：地方歷史機構帶大家免費走訪老街；hell：遊客說找停車位像地獄；ethnic：美食節慶祝各民族社群；minister：文化部長演講開幕 |
| q16 | sexual：許多國家工作上性別歧視違法 |
| q17 | faith：我對朋友的建議／球隊很有信心 |

#### b2-u27-l02

| 目標字 | 單字卡情境 | 其他題情境 | 換了哪幾項 | 判定 |
|---|---|---|---|---|
| liberal | 學校服裝規定相當寬鬆<br>　Our school has fairly liberal rules about what students can wear. | q15：Mei 的父母漸漸變開明讓她參加劇團<br>　Mei's parents were quite conventional, but they slowly became more liberal and let her join a theater club. | q15：主詞、情境、句型 | 通過 |
| immigrant | 每年數千移民來工作讀書<br>　Each year, thousands of immigrants come to this country to work or study. | q10：祖父母以移民身分來、開麵包店<br>　My grandparents came to this country as immigrants and opened a small bakery.<br>q15：Mei 一家以移民身分發現習俗不同<br>　As immigrants, they found that many social conventions were different.<br>q17：鄰居是越南移民會做菜／朋友媽媽是泰國移民工程師<br>　My neighbor is an immigrant from Vietnam, and she cooks amazing food. / My best friend's mother is an immigrant from Thailand who works as an engineer. | q10：主詞、情境、句型<br>q15：主詞、情境、句型<br>q17：主詞、情境、句型 | 通過 |
| convention | 許多國家見面握手是慣例<br>　It is a convention in many countries to shake hands when you meet someone. | q09：市中心每年辦動漫展<br>　Every year, the city hosts a large comic convention downtown.<br>q15：加拿大的社會慣例不同<br>　As immigrants, they found that many social conventions were different. | q09：主詞、情境、句型<br>q15：主詞、情境、句型 | 通過 |
| conventional | 這支手機外表普通但功能新<br>　This phone looks conventional, but it has many new features. | q13：她不穿傳統白紗改穿紅色<br>　Instead of the conventional white dress, she wore a bright red one at her wedding.<br>q15：Mei 的父母很傳統<br>　Mei's parents were quite conventional, but they slowly became more liberal and let her join a theater club. | q13：主詞、情境、句型<br>q15：主詞、情境、句型 | 通過 |
| universal | 音樂是共通語言<br>　People often say that music is a universal language. | q11：大家一致同意老橋要修<br>　There is universal agreement that the old bridge needs repairs.<br>q15：善意是普世的、習俗卻不是<br>　Mei learned that kindness is universal, even when customs are not. | q11：主詞、情境、句型<br>q15：主詞、情境、句型 | 通過 |
| god | 台灣很多店擺財神像<br>　Many shops in Taiwan keep a small statue of the god of wealth. | q12：漁民出海前向海神祈禱<br>　Fishermen here pray to the god of the sea before a long trip.<br>q15：Mei 讀北方眾神的故事<br>　In history class, she studied the history of the native tribes in the area, and she also read old stories about the gods of the north. | q12：主詞、情境<br>q15：主詞、情境 | 通過 |
| politically | 爺爺退休後開始參與政治<br>　My grandfather became politically active after he retired. | q16：話題政治敏感、節目不討論<br>　This topic is politically sensitive, so our show does not discuss it. / Because the topic is politically sensitive, our program avoids it. | q16：主詞、情境、句型 | 通過 |
| tribe | 兩個部落沿河以魚換水果<br>　The two tribes used to trade fish for fruit along the river. | q14：部落在雨林住了幾千年<br>　The tribe has lived in the rainforest for thousands of years and speaks its own language.<br>q15：Mei 在歷史課學當地原住部落<br>　In history class, she studied the history of the native tribes in the area, and she also read old stories about the gods of the north. | q14：情境、句型<br>q15：主詞、情境、句型 | 通過 |

同課題目互比（9 題；事件摘要逐題人工判定互不相同；腳本找「同目標字且主詞、句型都相同」的兩題：0 組）

| 題號 | 事件摘要 |
|---|---|
| q09 | convention：市中心每年辦動漫展 |
| q10 | immigrant：祖父母以移民身分來、開麵包店 |
| q11 | universal：大家一致同意老橋要修 |
| q12 | god：漁民出海前向海神祈禱 |
| q13 | conventional：她不穿傳統白紗改穿紅色 |
| q14 | tribe：部落在雨林住了幾千年 |
| q15 | liberal：Mei 的父母漸漸變開明讓她參加劇團；immigrant：Mei 一家以移民身分發現習俗不同；convention：加拿大的社會慣例不同；conventional：Mei 的父母很傳統；universal：善意是普世的、習俗卻不是；god：Mei 讀北方眾神的故事；tribe：Mei 在歷史課學當地原住部落 |
| q16 | politically：話題政治敏感、節目不討論 |
| q17 | immigrant：鄰居是越南移民會做菜／朋友媽媽是泰國移民工程師 |

#### b2-u27-l03

| 目標字 | 單字卡情境 | 其他題情境 | 換了哪幾項 | 判定 |
|---|---|---|---|---|
| obligation | 簽這張紙不代表要買東西<br>　Signing this paper puts you under no obligation to buy anything. | q13：父母有法定義務送小孩上學<br>　Parents have a legal obligation to send their children to school.<br>q15：聽故事是榮幸不只是學校義務<br>　Kai said that hearing their stories was a privilege, not just a school obligation.<br>q17：我覺得有義務探望祖父母／保持社區乾淨<br>　I feel an obligation to visit my grandparents every weekend. / I think I have an obligation to keep my neighborhood clean. | q13：主詞、情境、句型<br>q15：主詞、情境、句型<br>q17：主詞、情境、句型 | 通過 |
| heritage | 節慶讓年輕人透過音樂認識傳統<br>　The festival helps young people learn about their heritage through music. | q09：老茶廠成為鎮上文化遺產<br>　The old tea factory is now part of the town's cultural heritage.<br>q15：Kai 做地方文化遺產專題<br>　For a school project on local heritage, Kai interviewed three older people in his town. | q09：主詞、情境、句型<br>q15：主詞、情境、句型 | 通過 |
| ritual | 選手每場賽前做同樣怪儀式<br>　Before every game, the player does the same strange ritual. | q11：週日和奶奶喝茶成了家庭習慣<br>　Drinking tea with my grandmother on Sundays has become a family ritual.<br>q15：漁家每年首次出海前的儀式<br>　The second, a woman from a fishing family, described a ritual her family still performs before the first boat trip of each year. | q11：主詞、情境、句型<br>q15：主詞、情境、句型 | 通過 |
| privilege | 免費停車是遠住員工的特權<br>　Free parking is a privilege for staff who live far away. | q12：能和優秀團隊共事是榮幸<br>　It was a privilege to work with such a talented team.<br>q15：Kai 說聽故事是榮幸<br>　Kai said that hearing their stories was a privilege, not just a school obligation. | q12：主詞、情境、句型<br>q15：主詞、情境、句型 | 通過 |
| pastor | 牧師叫得出村裡每個孩子的名字<br>　The pastor knows the name of every child in the village. | q10：牧師請志工週六掃公園<br>　Our pastor asked volunteers to help clean the park on Saturday morning.<br>q15：退休牧師曾幫忙建紀念碑<br>　The first was a retired pastor who had helped build the town's memorial to the doctor who opened its first hospital. | q10：情境、句型<br>q15：主詞、情境、句型 | 通過 |
| equity | 公平是給每個學生需要的幫助<br>　Equity means giving each student the help they need. | q14：公司為了公平男女同工同酬<br>　To create equity, the company now pays men and women the same for the same job.<br>q15：老師談公平<br>　The third was a teacher who spoke about equity and about how the town fought racism when new families arrived. | q14：主詞、情境、句型<br>q15：主詞、情境、句型 | 通過 |
| racism | 教練說運動容不下種族歧視<br>　"Racism has no place in sports," the coach told his players. | q15：小鎮在新家庭搬來時對抗種族歧視<br>　The third was a teacher who spoke about equity and about how the town fought racism when new families arrived.<br>q16：學校教學生對抗種族歧視<br>　This school teaches students how to fight racism. / The school teaches its students to stand up against racism. | q15：主詞、情境、句型<br>q16：主詞、情境、句型 | 通過 |
| memorial | 舊車站原址立著小紀念碑<br>　A small memorial stands where the old train station used to be. | q15：鎮上紀念第一位醫生的紀念碑<br>　The first was a retired pastor who had helped build the town's memorial to the doctor who opened its first hospital. | q15：主詞、情境、句型 | 通過 |

同課題目互比（9 題；事件摘要逐題人工判定互不相同；腳本找「同目標字且主詞、句型都相同」的兩題：0 組）

| 題號 | 事件摘要 |
|---|---|
| q09 | heritage：老茶廠成為鎮上文化遺產 |
| q10 | pastor：牧師請志工週六掃公園 |
| q11 | ritual：週日和奶奶喝茶成了家庭習慣 |
| q12 | privilege：能和優秀團隊共事是榮幸 |
| q13 | obligation：父母有法定義務送小孩上學 |
| q14 | equity：公司為了公平男女同工同酬 |
| q15 | obligation：聽故事是榮幸不只是學校義務；heritage：Kai 做地方文化遺產專題；ritual：漁家每年首次出海前的儀式；privilege：Kai 說聽故事是榮幸；pastor：退休牧師曾幫忙建紀念碑；equity：老師談公平；racism：小鎮在新家庭搬來時對抗種族歧視；memorial：鎮上紀念第一位醫生的紀念碑 |
| q16 | racism：學校教學生對抗種族歧視 |
| q17 | obligation：我覺得有義務探望祖父母／保持社區乾淨 |

#### b2-u27-l04

| 目標字 | 單字卡情境 | 其他題情境 | 換了哪幾項 | 判定 |
|---|---|---|---|---|
| medieval | 老城區有些街道仍像中世紀<br>　Some streets in the old part of the city still look medieval. | q09：中世紀建的橋至今仍在用（被動）<br>　This bridge was built in medieval times and is still used today.<br>q15：全班到義大利中世紀小鎮校外教學<br>　Last summer, our class went on an excursion to a medieval town in Italy.<br>q17：我想去中世紀城堡／看了中世紀電影<br>　I would love to visit a medieval castle in Scotland. / I watched a film about medieval castles last weekend. | q09：主詞、情境、句型<br>q15：主詞、情境、句型<br>q17：主詞、情境、句型 | 通過 |
| morality | 老故事教孩子道德<br>　Many old stories teach children about morality. | q15：老師問道德問題<br>　Later, our teacher asked us a hard question about morality: was it morally right for rich families to build such grand tombs while many people were poor?<br>q16：電影探討道德與法律差異<br>　This film explores the difference between morality and the law. / This movie is about the difference between morality and the law. | q15：主詞、情境、句型<br>q16：主詞、情境、句型 | 通過 |
| altar | 過年全家在供桌放水果鮮花<br>　The family put fruit and flowers on the altar for the New Year. | q10：遊客不能在祭壇旁拍照<br>　Visitors can take photos inside the temple, but not near the altar.<br>q15：教堂裡有美麗石祭壇<br>　Inside, there was a beautiful stone altar and the tomb of a rich family from seven hundred years ago. | q10：主詞、情境、句型<br>q15：主詞、情境、句型 | 通過 |
| culturally | 城市文化豐富、博物館多<br>　The city is culturally rich, with many museums and theaters. | q13：兩個鄰鎮文化上很像<br>　The two neighboring towns are culturally very similar: they share the same festivals and food.<br>q15：小鎮文化上變化很少<br>　Culturally, the town has changed very little. | q13：主詞、情境、句型<br>q15：主詞、情境、句型 | 通過 |
| worship | 建築不再作禮拜場所（被動）<br>　The building is no longer used as a place of worship. | q15：人們每週日來教堂做禮拜<br>　Our guide showed us a small church where people still come for worship every Sunday. | q15：主詞、情境、句型 | 通過 |
| tomb | 科學家在農場下發現兩千年古墓<br>　Scientists found a two-thousand-year-old tomb under a farm. | q11：古墓裡滿是金幣和陶罐<br>　The ancient tomb was full of gold coins and old pots.<br>q15：富有家族的墳墓、蓋豪華墓<br>　Inside, there was a beautiful stone altar and the tomb of a rich family from seven hundred years ago. / Later, our teacher asked us a hard question about morality: was it morally right for rich families to build such grand tombs while many people were poor? | q11：主詞、情境、句型<br>q15：主詞、情境、句型 | 通過 |
| morally | 對朋友說謊在道德上是錯的<br>　Lying to a friend is morally wrong, even if it seems small. | q12：我認為道德上該歸還撿到的錢<br>　Morally, I think we should return the money we found.<br>q15：有錢人蓋豪華墓道德上對嗎<br>　Later, our teacher asked us a hard question about morality: was it morally right for rich families to build such grand tombs while many people were poor? | q12：主詞、情境、句型<br>q15：主詞、情境、句型 | 通過 |
| rite | 有些文化在嬰兒滿月舉行儀式<br>　In some cultures, a special rite is held when a baby is one month old. | q14：婚禮中新人同杯喝茶的古老儀式<br>　The wedding included an old rite in which the couple drank tea from the same cup.<br>q15：小鎮春天年輕人繞城牆的儀式<br>　The guide explained that the town once held an unusual rite every spring: young people walked around the town walls at night to show they were adults. | q14：主詞、情境、句型<br>q15：主詞、情境、句型 | 通過 |

同課題目互比（9 題；事件摘要逐題人工判定互不相同；腳本找「同目標字且主詞、句型都相同」的兩題：0 組）

| 題號 | 事件摘要 |
|---|---|
| q09 | medieval：中世紀建的橋至今仍在用（被動） |
| q10 | altar：遊客不能在祭壇旁拍照 |
| q11 | tomb：古墓裡滿是金幣和陶罐 |
| q12 | morally：我認為道德上該歸還撿到的錢 |
| q13 | culturally：兩個鄰鎮文化上很像 |
| q14 | rite：婚禮中新人同杯喝茶的古老儀式 |
| q15 | medieval：全班到義大利中世紀小鎮校外教學；morality：老師問道德問題；altar：教堂裡有美麗石祭壇；culturally：小鎮文化上變化很少；worship：人們每週日來教堂做禮拜；tomb：富有家族的墳墓、蓋豪華墓；morally：有錢人蓋豪華墓道德上對嗎；rite：小鎮春天年輕人繞城牆的儀式 |
| q16 | morality：電影探討道德與法律差異 |
| q17 | medieval：我想去中世紀城堡／看了中世紀電影 |

#### b2-u27-l05

| 目標字 | 單字卡情境 | 其他題情境 | 換了哪幾項 | 判定 |
|---|---|---|---|---|
| prestige | 工作薪水不高但有聲望<br>　The job does not pay well, but it brings prestige. | q12：奪金提升小國聲望<br>　Winning the gold medal raised the small country's prestige.<br>q15：修道院沒有大教堂的名氣<br>　The monastery does not have the prestige of the great cathedral in the capital, but many visitors come for peace and quiet. | q12：主詞、情境、句型<br>q15：主詞、情境、句型 | 通過 |
| royalty | 皇室乘車經過群眾揮旗<br>　Crowds waved flags when royalty passed by in a car. | q15：皇室成員也在修道院住過<br>　Even members of royalty have stayed there.<br>q16：作家每年賺不少版稅<br>　This writer earns a lot of royalties from her books every year. / Every year, the writer makes good money in royalties from her books. | q15：主詞、情境、句型<br>q16：主詞、情境、句型 | 通過 |
| cathedral | 遊客爬大教堂塔頂看全市<br>　Tourists climbed the tower of the cathedral to see the whole city. | q09：大教堂蓋了一百多年<br>　The cathedral took more than a hundred years to build.<br>q15：首都的大教堂很有名<br>　The monastery does not have the prestige of the great cathedral in the capital, but many visitors come for peace and quiet.<br>q17：我去過／想去某座大教堂<br>　I visited a huge cathedral in Barcelona when I traveled in Spain. / I hope to see the famous cathedral in Paris one day. | q09：主詞、情境、句型<br>q15：主詞、情境、句型<br>q17：主詞、情境、句型 | 通過 |
| bum | 我整個週末當懶鬼看電視（自述）<br>　I was a lazy bum all weekend and just watched TV. | q15：哥哥在家是懶鬼、在修道院早起<br>　My brother, who is usually a lazy bum at home, got up at five every morning when we stayed there, just to watch the sunrise. | q15：主詞、情境、句型 | 通過 |
| disciple | 孔子教弟子仁慈與尊重<br>　Confucius taught his disciples about kindness and respect. | q15：修道院創立者是名師的弟子<br>　The man who started it was a disciple of a famous teacher, and his old walking stick is kept there as a relic. | q15：主詞、情境、句型 | 通過 |
| monastery | 有些訪客住修道院享受寧靜<br>　Some visitors stay at the monastery to enjoy the silence. | q11：年輕僧侶住在山上修道院<br>　The young monk lived in a monastery high in the mountains.<br>q15：西班牙山上八百年修道院<br>　High in the mountains of Spain stands a small monastery that is over eight hundred years old. / The monastery does not have the prestige of the great cathedral in the capital, but many visitors come for peace and quiet. | q11：主詞、情境、句型<br>q15：主詞、情境、句型 | 通過 |
| relic | 石器是史前時代遺物<br>　This stone tool is a relic from prehistoric times. | q13：潛水員找到老船的鐘<br>　Divers found a relic of the old ship: a small bell that the sailors once rang.<br>q15：創立者手杖當遺物收藏<br>　The man who started it was a disciple of a famous teacher, and his old walking stick is kept there as a relic. | q13：主詞、情境、句型<br>q15：主詞、情境、句型 | 通過 |
| humane | 市政府用人道方式處理街貓<br>　The city found a humane way to deal with the cats living on its streets. | q10：農場人道對待動物、蛋較貴<br>　The farm treats its animals in a humane way, so its eggs cost a little more.<br>q14：新法要求動物園更人道<br>　The new law calls for more humane treatment of animals in zoos.<br>q15：僧侶仁慈、從不拒絕飢餓旅人<br>　The monks run a small farm where goats walk freely on the hills, and they are known for being humane: they never turn away a hungry traveler. | q10：主詞、情境<br>q14：主詞、情境、句型<br>q15：主詞、情境、句型 | 通過 |

同課題目互比（9 題；事件摘要逐題人工判定互不相同；腳本找「同目標字且主詞、句型都相同」的兩題：0 組）

| 題號 | 事件摘要 |
|---|---|
| q09 | cathedral：大教堂蓋了一百多年 |
| q10 | humane：農場人道對待動物、蛋較貴 |
| q11 | monastery：年輕僧侶住在山上修道院 |
| q12 | prestige：奪金提升小國聲望 |
| q13 | relic：潛水員找到老船的鐘 |
| q14 | humane：新法要求動物園更人道 |
| q15 | prestige：修道院沒有大教堂的名氣；royalty：皇室成員也在修道院住過；cathedral：首都的大教堂很有名；bum：哥哥在家是懶鬼、在修道院早起；disciple：修道院創立者是名師的弟子；monastery：西班牙山上八百年修道院；relic：創立者手杖當遺物收藏；humane：僧侶仁慈、從不拒絕飢餓旅人 |
| q16 | royalty：作家每年賺不少版稅 |
| q17 | cathedral：我去過／想去某座大教堂 |

#### b2-u27-l06

| 目標字 | 單字卡情境 | 其他題情境 | 換了哪幾項 | 判定 |
|---|---|---|---|---|
| canon | 學生要從世界文學經典讀十本<br>　Students must read ten books from the canon of world literature. | q14：她的小說成為文學經典、大學教<br>　Her novels are now part of the literary canon and are taught in many universities. | q14：主詞、情境、句型 | 通過 |
| supernatural | 有人相信湖有超自然力量<br>　Some people believe the lake has supernatural powers. | q10：新電影女孩有超能力能和動物說話<br>　The new film is about a girl with supernatural powers who can talk to animals.<br>q15：古老傳說滿是超自然生物<br>　The next room is about old legends full of supernatural creatures, such as giants and talking trees.<br>q17：我喜歡／不喜歡超自然故事<br>　I love films about supernatural creatures like ghosts. / I don't enjoy supernatural stories, because they scare me at night. | q10：主詞、情境、句型<br>q15：主詞、情境、句型<br>q17：主詞、情境、句型 | 通過 |
| commemorate | 新郵票紀念大橋通車（主動、主要動詞）<br>　These new stamps commemorate the opening of the bridge. | q09：小鎮每年辦節慶紀念當地出生的詩人<br>　Every spring, the town holds a festival to commemorate a famous poet who was born there.<br>q15：博物館辦展紀念百歲生日<br>　This year, our city museum opened a new exhibition to commemorate its hundredth birthday. | q09：主詞、情境、句型<br>q15：主詞、情境、句型 | 通過 |
| mortal | 電玩裡的凡人英雄會死、要小心玩<br>　In the video game, your mortal hero can die, so you must play carefully. | q15：故事裡神不死、人終有一死<br>　In many of these stories, the gods are immortal, while humans are mortal and must accept that life is short. | q15：主詞、情境、句型 | 通過 |
| immoral | 很多人認為廣告說謊不道德<br>　Many people think it is immoral to lie in advertisements. | q12：欺騙顧客違法又不道德<br>　Cheating customers is not only illegal but also immoral.<br>q15：神認為國王行為不道德<br>　The gods thought his behavior was immoral and turned his palace into stone. | q12：主詞、情境、句型<br>q15：主詞、情境、句型 | 通過 |
| prehistoric | 有些史前動物比公車大<br>　Some prehistoric animals were bigger than buses. | q11：科學家在洞穴發現史前壁畫<br>　Scientists found prehistoric drawings of horses on the cave walls.<br>q15：第一展間展出河邊史前工具<br>　The first room shows prehistoric tools found near the river. | q11：主詞、情境、句型<br>q15：主詞、情境、句型 | 通過 |
| worldly | 住過五國的她見多識廣<br>　After living in five countries, she is very worldly. | q15：國王變得世俗只在乎金子<br>　One story tells of a king who became so worldly that he cared only about gold.<br>q16：他對世俗成功沒興趣<br>　He is not interested in worldly success, such as money and fame. / He doesn't care about worldly success like money and fame. | q15：主詞、情境、句型<br>q16：主詞、情境、句型 | 通過 |
| immortal | 歌迷說她的歌不朽<br>　Her songs are so famous that many fans call them immortal. | q13：英雄喝特別的水長生不死<br>　In the old story, the hero drinks some magic water and becomes immortal, so he can never die.<br>q15：故事裡神長生不死<br>　In many of these stories, the gods are immortal, while humans are mortal and must accept that life is short. | q13：主詞、情境、句型<br>q15：主詞、情境、句型 | 通過 |

同課題目互比（9 題；事件摘要逐題人工判定互不相同；腳本找「同目標字且主詞、句型都相同」的兩題：0 組）

| 題號 | 事件摘要 |
|---|---|
| q09 | commemorate：小鎮每年辦節慶紀念當地出生的詩人 |
| q10 | supernatural：新電影女孩有超能力能和動物說話 |
| q11 | prehistoric：科學家在洞穴發現史前壁畫 |
| q12 | immoral：欺騙顧客違法又不道德 |
| q13 | immortal：英雄喝特別的水長生不死 |
| q14 | canon：她的小說成為文學經典、大學教 |
| q15 | supernatural：古老傳說滿是超自然生物；commemorate：博物館辦展紀念百歲生日；mortal：故事裡神不死、人終有一死；immoral：神認為國王行為不道德；prehistoric：第一展間展出河邊史前工具；worldly：國王變得世俗只在乎金子；immortal：故事裡神長生不死 |
| q16 | worldly：他對世俗成功沒興趣 |
| q17 | supernatural：我喜歡／不喜歡超自然故事 |

#### b2-u27-l07

| 目標字 | 單字卡情境 | 其他題情境 | 換了哪幾項 | 判定 |
|---|---|---|---|---|
| incense | 奶奶每年過年在廟裡點香<br>　My grandmother lights incense at the temple every New Year. | q08：香味瀰漫老廟<br>　The smell of incense filled the old temple.<br>q14：吳女士每天早上燒香靜坐<br>　Every morning, she burned incense and sat quietly for an hour before painting. | q08：主詞、情境、句型<br>q14：主詞、情境、句型 | 通過 |
| sexism | 公司徵才廣告有性別歧視被批評<br>　The company was criticized for sexism in its job ads. | q11：職場性別歧視仍是問題<br>　Sexism in the workplace is still a problem in many industries.<br>q14：吳女士公開反對藝術界性別歧視<br>　Later, she spoke out against sexism in the art world, where women's paintings were often ignored. | q11：主詞、情境、句型<br>q14：主詞、情境、句型 | 通過 |
| obituary | 有些報紙請家屬自己寫訃聞<br>　Some newspapers ask families to write the obituary themselves. | q14：地方報刊登吳女士訃聞<br>　Last week, our local newspaper printed an obituary of Ms. | q14：主詞、情境、句型 | 通過 |
| nobility | 過去只有貴族能擁有土地<br>　In the past, only the nobility could own land in this country. | q14：吳女士出身舊貴族家庭<br>　She was born into a family of the old nobility, but she chose a simple life.<br>q15：城堡以前屬於貴族家庭<br>　This castle once belonged to a family of the nobility. / This castle used to belong to a family from the nobility. | q14：主詞、情境、句型<br>q15：主詞、情境、句型 | 通過 |
| impartial | 報告公正呈現辯論雙方<br>　The report gives an impartial view of both sides of the debate. | q09：家鄉隊比賽裁判仍要公正<br>　A good referee must stay impartial, even when his hometown team is playing.<br>q13：法官必須公正<br>　Judges must be impartial and treat everyone in court the same way.<br>q14：大家記得她是公正的評審<br>　Many people remember her as an impartial judge at art competitions, because she never cared who the artist was. | q09：主詞、情境、句型<br>q13：主詞、情境、句型<br>q14：主詞、情境、句型 | 通過 |
| subculture | 老車迷形成熱鬧次文化<br>　Fans of old cars have created a lively subculture with their own magazines. | q10：滑板起初是加州小次文化<br>　Skateboarding started as a small subculture in California.<br>q14：吳女士加入年輕藝術家次文化<br>　In her twenties, she joined the city's young artists' subculture and painted on the walls of old factories.<br>q16：我對日本遊戲次文化有興趣／表哥收集舊相機<br>　I am interested in the gaming subculture in Japan. / My cousin is part of a small subculture of people who collect old cameras. | q10：主詞、情境、句型<br>q14：主詞、情境、句型<br>q16：主詞、情境、句型 | 通過 |
| immortality | 科學家研究小型海洋動物似乎不死<br>　Some scientists study small sea animals that seem to achieve immortality. | q12：電影裡富人花光錢找永生<br>　In the film, a rich man spends his money searching for immortality, but he learns that a short life can be happy.<br>q14：藝術是她通往不朽的路<br>　She once said that art was her only path to immortality. | q12：主詞、情境、句型<br>q14：主詞、情境、句型 | 通過 |

同課題目互比（9 題；事件摘要逐題人工判定互不相同；腳本找「同目標字且主詞、句型都相同」的兩題：0 組）

| 題號 | 事件摘要 |
|---|---|
| q08 | incense：香味瀰漫老廟 |
| q09 | impartial：家鄉隊比賽裁判仍要公正 |
| q10 | subculture：滑板起初是加州小次文化 |
| q11 | sexism：職場性別歧視仍是問題 |
| q12 | immortality：電影裡富人花光錢找永生 |
| q13 | impartial：法官必須公正 |
| q14 | incense：吳女士每天早上燒香靜坐；sexism：吳女士公開反對藝術界性別歧視；obituary：地方報刊登吳女士訃聞；nobility：吳女士出身舊貴族家庭；impartial：大家記得她是公正的評審；subculture：吳女士加入年輕藝術家次文化；immortality：藝術是她通往不朽的路 |
| q15 | nobility：城堡以前屬於貴族家庭 |
| q16 | subculture：我對日本遊戲次文化有興趣／表哥收集舊相機 |

#### b2-u27-l08

| 目標字 | 單字卡情境 | 其他題情境 | 換了哪幾項 | 判定 |
|---|---|---|---|---|
| popularize | 手機相機讓拍食物普及<br>　Phone cameras have popularized taking photos of food. | q09：電視廚師讓泰國菜普及<br>　This TV chef helped popularize Thai food in our country.<br>q12：便宜機票讓小島旅行普及<br>　Cheap flights have helped popularize travel to small islands.<br>q14：導演想把老戲推廣給年輕人<br>　The director, a humanist who believes art belongs to everyone, wanted to popularize old plays among young people. | q09：主詞、情境、句型<br>q12：主詞、情境、句型<br>q14：主詞、情境、句型 | 通過 |
| glorify | 電影因美化危險駕駛被批評（被動）<br>　The movie was criticized for glorifying dangerous driving. | q11：老歌讚頌農民的辛勞<br>　The old song glorifies the hard work of farmers.<br>q14：評論家說戲美化有錢人<br>　Some critics said the play glorified rich people, but most viewers loved it. | q11：主詞、情境、句型<br>q14：主詞、情境、句型 | 通過 |
| aristocracy | 貴族成員常請人畫像<br>　Members of the aristocracy often had their pictures painted. | q14：戲講英國貴族的故事<br>　This year they chose a story about the English aristocracy, full of kings, princes and secret love.<br>q15：那時代只有貴族能受教育<br>　At that time, only the aristocracy could get an education. / In those days, only members of the aristocracy were able to receive an education. | q14：主詞、情境、句型<br>q15：主詞、情境、句型 | 通過 |
| humanist | 人文主義者寫書談人的尊嚴<br>　The humanist wrote many books about human dignity. | q14：導演是相信藝術屬於大家的人文主義者<br>　The director, a humanist who believes art belongs to everyone, wanted to popularize old plays among young people. | q14：情境、句型 | 通過 |
| humanize | 小說連反派都被寫得有人性（被動）<br>　In her novel, even the bad guy is humanized: we learn about his lonely childhood. | q08：歷史老師講平凡家庭故事讓過去有人味<br>　Our history teacher humanizes the past by telling stories of ordinary families.<br>q14：導演讓角色傳簡訊、像普通家庭<br>　So she humanized the characters: the proud princes sent text messages and argued about money like normal families.<br>q16：銀行讓客戶和真人說話／可愛機器人<br>　The bank tried to humanize its service by letting customers talk to real people. / Cute robots help humanize technology for children. | q08：主詞、情境、句型<br>q14：主詞、情境、句型<br>q16：主詞、情境、句型 | 通過 |
| gravestone | 遊客來看知名詩人的墓碑<br>　Tourists come to see the gravestone of the famous poet. | q13：兩百年墓碑上名字難辨<br>　The name on the two-hundred-year-old gravestone was almost impossible to read.<br>q14：演員在墓地念墓碑上的字<br>　The final scene took place in an old cemetery next to a church, where an actor read the words on a gravestone aloud, and the whole audience went silent. | q13：主詞、情境、句型<br>q14：主詞、情境、句型 | 通過 |
| shakespearean | 她愛莎翁喜劇勝過悲劇<br>　She prefers Shakespearean comedies to Shakespearean tragedies. | q10：演員用莎翁腔逗笑觀眾<br>　The actor spoke in a Shakespearean style that made the audience laugh.<br>q14：劇團夏天在公園演莎翁戲<br>　Every summer, a small theater group in our city performs a Shakespearean play in the park. | q10：主詞、情境、句型<br>q14：主詞、情境、句型 | 通過 |

同課題目互比（9 題；事件摘要逐題人工判定互不相同；腳本找「同目標字且主詞、句型都相同」的兩題：0 組）

| 題號 | 事件摘要 |
|---|---|
| q08 | humanize：歷史老師講平凡家庭故事讓過去有人味 |
| q09 | popularize：電視廚師讓泰國菜普及 |
| q10 | shakespearean：演員用莎翁腔逗笑觀眾 |
| q11 | glorify：老歌讚頌農民的辛勞 |
| q12 | popularize：便宜機票讓小島旅行普及 |
| q13 | gravestone：兩百年墓碑上名字難辨 |
| q14 | popularize：導演想把老戲推廣給年輕人；glorify：評論家說戲美化有錢人；aristocracy：戲講英國貴族的故事；humanist：導演是相信藝術屬於大家的人文主義者；humanize：導演讓角色傳簡訊、像普通家庭；gravestone：演員在墓地念墓碑上的字；shakespearean：劇團夏天在公園演莎翁戲 |
| q15 | aristocracy：那時代只有貴族能受教育 |
| q16 | humanize：銀行讓客戶和真人說話／可愛機器人 |

#### b2-u27-l09

| 目標字 | 單字卡情境 | 其他題情境 | 換了哪幾項 | 判定 |
|---|---|---|---|---|
| dehumanize | 有人擔心科技過多會讓生活失去人性<br>　Some people worry that too much technology will dehumanize our lives. | q12：用號碼代替名字叫學生使人失去人性<br>　Calling students by numbers instead of their names can dehumanize them.<br>q14：當時作家說工廠讓人失去人性<br>　Some writers at that time said the factories dehumanized people. | q12：主詞、情境、句型<br>q14：主詞、情境、句型 | 通過 |
| nobleman | 貴族的城堡現在是飯店<br>　The nobleman's old castle is now a hotel. | q11：北方貴族娶了國王最小的女兒<br>　A nobleman from the north married the king's youngest daughter.<br>q14：山谷土地屬於一位貴族<br>　The land belonged to a nobleman, who was known as a godly man and gave food to the poor every winter. | q11：情境、句型<br>q14：主詞、情境、句型 | 通過 |
| godly | 村民尊敬她簡樸虔誠的生活<br>　People in the village respected her simple and godly way of life. | q13：爺爺很虔誠、每天早上讀聖書<br>　My grandfather was very godly and read the holy book every morning.<br>q14：貴族以虔誠聞名<br>　The land belonged to a nobleman, who was known as a godly man and gave food to the poor every winter. | q13：主詞、情境、句型<br>q14：主詞、情境、句型 | 通過 |
| industrialize | 公司想讓種菜方式工業化<br>　The company wants to industrialize the way it grows vegetables. | q10：那地區工業化比鄰近地區快<br>　The region industrialized faster than its neighbors.<br>q14：國家開始工業化、河邊出現工廠<br>　Then the country began to industrialize, and large factories appeared along the river.<br>q15：城市工業化後空氣變髒<br>　After the city industrialized, its air became very dirty. / The air in that city became very dirty after it industrialized. | q10：主詞、情境、句型<br>q14：主詞、情境、句型<br>q15：主詞、情境、句型 | 通過 |
| ungodly | 質問對方為何這種時間打來<br>　Why are you calling me at this ungodly hour? | q09：班機起飛太早得三點起床<br>　My flight leaves at an ungodly hour, so I have to get up at three.<br>q14：工人得在很早的時間上工<br>　Workers had to start at an ungodly hour and stand at noisy machines for twelve hours a day, and the factories contaminated the river.<br>q16：我在很晚時寫完作文／很早起看球賽<br>　I once finished an essay at an ungodly hour, just before sunrise. / I woke up at an ungodly hour to watch the World Cup final. | q09：主詞、情境、句型<br>q14：主詞、情境、句型<br>q16：主詞、情境、句型 | 通過 |
| prehuman | 科學家發現三百萬年前的早期人類骨頭<br>　Scientists found the bones of a prehuman that lived three million years ago. | q14：博物館地下室展示前人類留下的石器<br>　In its basement, visitors can even see stone tools left by prehumans, which were found when the factory was built. | q14：主詞、情境、句型 | 通過 |
| preindustrial | 工業化前的城市比現在小又安靜<br>　Preindustrial cities were much smaller and quieter than today's. | q08：工業化前多數家庭住農場<br>　Most families lived on farms in preindustrial times.<br>q14：兩百年前山谷是工業化前的寧靜地方<br>　Two hundred years ago, our valley was a quiet preindustrial place where most people grew rice and raised pigs. | q08：主詞、情境、句型<br>q14：主詞、情境、句型 | 通過 |

同課題目互比（9 題；事件摘要逐題人工判定互不相同；腳本找「同目標字且主詞、句型都相同」的兩題：0 組）

| 題號 | 事件摘要 |
|---|---|
| q08 | preindustrial：工業化前多數家庭住農場 |
| q09 | ungodly：班機起飛太早得三點起床 |
| q10 | industrialize：那地區工業化比鄰近地區快 |
| q11 | nobleman：北方貴族娶了國王最小的女兒 |
| q12 | dehumanize：用號碼代替名字叫學生使人失去人性 |
| q13 | godly：爺爺很虔誠、每天早上讀聖書 |
| q14 | dehumanize：當時作家說工廠讓人失去人性；nobleman：山谷土地屬於一位貴族；godly：貴族以虔誠聞名；industrialize：國家開始工業化、河邊出現工廠；ungodly：工人得在很早的時間上工；prehuman：博物館地下室展示前人類留下的石器；preindustrial：兩百年前山谷是工業化前的寧靜地方 |
| q15 | industrialize：城市工業化後空氣變髒 |
| q16 | ungodly：我在很晚時寫完作文／很早起看球賽 |

#### b2-u28-l01

| 目標字 | 單字卡情境 | 其他題情境 | 換了哪幾項 | 判定 |
|---|---|---|---|---|
| administrative | 學校行政辦公室五點關<br>　The school's administrative office closes at five. | q16：李小姐是行政經理、主辦搬遷<br>　Lee, the administrative manager, is the main organizer of the move.<br>q17：她負責公司行政工作<br>　She is in charge of the administrative work in the company. / She handles the company's administrative tasks. | q16：主詞、情境、句型<br>q17：主詞、情境、句型 | 通過 |
| supervisor | 她兩年就升主管（被動）<br>　She was promoted to supervisor after only two years. | q12：主管要我午餐前完成報告<br>　My supervisor asked me to finish the report before lunch.<br>q16：每組主管監督自己部門打包<br>　She has asked each team supervisor to supervise the packing in their own department. | q12：主詞、情境、句型<br>q16：情境、句型 | 通過 |
| lobby | 飯店大廳擠滿等房的遊客<br>　The hotel lobby was full of tourists waiting for their rooms. | q10：請在一樓大廳等訪客（祈使）<br>　Please wait for your visitor in the lobby on the first floor.<br>q16：新大樓大廳有咖啡店<br>　The new building has a large lobby with a cafe, and workers will finish the assembly of the new desks before we arrive. | q10：主詞、情境、句型<br>q16：主詞、情境、句型 | 通過 |
| assembly | 全校每週一早上集會<br>　The whole school meets for an assembly every Monday morning. | q16：工人搬家前組裝好新桌子（組裝義）<br>　The new building has a large lobby with a cafe, and workers will finish the assembly of the new desks before we arrive. | q16：主詞、情境、句型 | 通過 |
| reminder | 手機提醒我姊姊生日<br>　My phone gave me a reminder about my sister's birthday. | q11：圖書館提醒我書週五到期<br>　The library sent me a reminder that my books are due on Friday.<br>q16：李小姐搬家前一週寄提醒給全體員工<br>　Lee has made a brochure that explains where everything is, and she will send a reminder to all staff one week before the move. | q11：主詞、情境、句型<br>q16：主詞、情境、句型 | 通過 |
| availability | 價格取決於鮮魚供應<br>　Prices depend on the availability of fresh fish. | q14：詢問下週二會議室是否有空<br>　Could you tell me about the availability of the meeting rooms next Tuesday? I need one for the afternoon.<br>q16：電梯可用時間有限、分天搬<br>　Because of the limited availability of the elevators, each team will move on a different day. | q14：主詞、情境<br>q16：主詞、情境、句型 | 通過 |
| organizer | 大型活動都需要好的籌辦人<br>　Every big event needs a good organizer. | q13：業務研討會籌辦人替講者訂飯店<br>　The organizer of the sales conference booked a hotel for all the speakers.<br>q16：李小姐是搬遷主要籌辦人<br>　Lee, the administrative manager, is the main organizer of the move. | q13：主詞、情境、句型<br>q16：主詞、情境、句型 | 通過 |
| supervise | 兩位老師午餐時看管孩子<br>　Two teachers supervise the children during lunch. | q15：李小姐會在第一個月指導新進員工<br>　Ms. Lee will supervise the new workers during their first month.<br>q16：主管監督部門打包<br>　She has asked each team supervisor to supervise the packing in their own department. | q15：主詞、情境、句型<br>q16：主詞、情境、句型 | 通過 |
| brochure | 旅行社給我們滿是海灘照的小冊子<br>　The travel agency gave us a brochure full of beach photos. | q16：李小姐做小冊子說明位置<br>　Lee has made a brochure that explains where everything is, and she will send a reminder to all staff one week before the move.<br>q18：我在車站拿城市導覽小冊子／看飯店簡介<br>　I picked up a brochure about city tours at the train station. / I read a hotel brochure before I booked my room. | q16：主詞、情境、句型<br>q18：主詞、情境、句型 | 通過 |

同課題目互比（9 題；事件摘要逐題人工判定互不相同；腳本找「同目標字且主詞、句型都相同」的兩題：0 組）

| 題號 | 事件摘要 |
|---|---|
| q10 | lobby：請在一樓大廳等訪客（祈使） |
| q11 | reminder：圖書館提醒我書週五到期 |
| q12 | supervisor：主管要我午餐前完成報告 |
| q13 | organizer：業務研討會籌辦人替講者訂飯店 |
| q14 | availability：詢問下週二會議室是否有空 |
| q15 | supervise：李小姐會在第一個月指導新進員工 |
| q16 | administrative：李小姐是行政經理、主辦搬遷；supervisor：每組主管監督自己部門打包；lobby：新大樓大廳有咖啡店；assembly：工人搬家前組裝好新桌子（組裝義）；reminder：李小姐搬家前一週寄提醒給全體員工；availability：電梯可用時間有限、分天搬；organizer：李小姐是搬遷主要籌辦人；supervise：主管監督部門打包；brochure：李小姐做小冊子說明位置 |
| q17 | administrative：她負責公司行政工作 |
| q18 | brochure：我在車站拿城市導覽小冊子／看飯店簡介 |

#### b2-u28-l02

| 目標字 | 單字卡情境 | 其他題情境 | 換了哪幾項 | 判定 |
|---|---|---|---|---|
| paperwork | 醫生每週花好幾小時做文書<br>　Doctors spend hours on paperwork every week. | q13：新工作意味著一堆文件手續<br>　Starting a new job usually means a lot of paperwork: forms, contracts and copies of your passport.<br>q15：員工時間都花在文書上<br>　They often worked overtime, and much of their time went to paperwork instead of real tasks. | q13：主詞、情境、句型<br>q15：主詞、情境、句型 | 通過 |
| overtime | 工廠付加班費給工人<br>　The factory pays workers extra for overtime. | q10：我又要加班不能吃晚餐<br>　Sorry, I can't join you for dinner tonight, because I have to work overtime again.<br>q15：員工常加班<br>　They often worked overtime, and much of their time went to paperwork instead of real tasks. | q10：主詞、情境、句型<br>q15：主詞、情境、句型 | 通過 |
| booklet | 博物館發每位訪客畫作小冊<br>　The museum gives each visitor a free booklet about the paintings. | q15：新員工拿到工時規定小冊<br>　Then they gave every new worker a short booklet with clear rules about working hours. | q15：主詞、情境、句型 | 通過 |
| executive | 她爸是汽車公司高階主管<br>　Her father is a top executive at a car company. | q12：主管飛東京簽約<br>　The executive flew to Tokyo to sign a deal with a new partner.<br>q15：主管們決定改變<br>　After a survey, the executives decided to change things. | q12：主詞、情境、句型<br>q15：主詞、情境、句型 | 通過 |
| employee | 超市有兩百多名員工<br>　The supermarket has more than two hundred employees. | q09：新員工週一要上安全訓練<br>　All new employees must attend safety training on Monday.<br>q15：去年很多員工不開心<br>　Last year, many employees at our company were unhappy. | q09：主詞、情境、句型<br>q15：主詞、情境、句型 | 通過 |
| conference | 研討會以市長致詞結束<br>　The conference ended with a short speech by the mayor. | q15：今年業務大會老闆說話<br>　At this year's sales conference, the boss said that working late should be a choice, not an obligation.<br>q16：我下個月去新加坡參加研討會<br>　Next month, I am going to a conference in Singapore. / I will attend a conference in Singapore next month. | q15：主詞、情境、句型<br>q16：主詞、情境、句型 | 通過 |
| procedure | 開銀行帳戶手續很簡單<br>　The procedure for opening a bank account is quite simple. | q14：使用新機器前讀牆上安全步驟<br>　Before you use the new machine, read the safety procedure on the wall next to it.<br>q15：主管簡化採購流程<br>　First, they made the procedure for buying office supplies much simpler. | q14：主詞、情境、句型<br>q15：主詞、情境 | 通過 |
| colleague | 我常和設計組同事吃午餐<br>　I often have lunch with my colleagues from the design team. | q11：兩位同事下月結婚<br>　Two of my colleagues are getting married next month.<br>q15：現在多數同事六點前下班<br>　Now most of my colleagues go home by six, and they seem much happier.<br>q17：同事幫我修電腦／教我新軟體<br>　My colleague helped me fix my computer when it stopped working. / A colleague of mine taught me how to use the new software. | q11：主詞、情境、句型<br>q15：主詞、情境、句型<br>q17：主詞、情境、句型 | 通過 |

同課題目互比（9 題；事件摘要逐題人工判定互不相同；腳本找「同目標字且主詞、句型都相同」的兩題：0 組）

| 題號 | 事件摘要 |
|---|---|
| q09 | employee：新員工週一要上安全訓練 |
| q10 | overtime：我又要加班不能吃晚餐 |
| q11 | colleague：兩位同事下月結婚 |
| q12 | executive：主管飛東京簽約 |
| q13 | paperwork：新工作意味著一堆文件手續 |
| q14 | procedure：使用新機器前讀牆上安全步驟 |
| q15 | paperwork：員工時間都花在文書上；overtime：員工常加班；booklet：新員工拿到工時規定小冊；executive：主管們決定改變；employee：去年很多員工不開心；conference：今年業務大會老闆說話；procedure：主管簡化採購流程；colleague：現在多數同事六點前下班 |
| q16 | conference：我下個月去新加坡參加研討會 |
| q17 | colleague：同事幫我修電腦／教我新軟體 |

#### b2-u28-l03

| 目標字 | 單字卡情境 | 其他題情境 | 換了哪幾項 | 判定 |
|---|---|---|---|---|
| panel | 老師小組選出明年的新課本<br>　A panel of teachers chose the new textbooks for next year. | q13：市府成立專家小組研究交通<br>　The city formed a panel of experts to study the traffic problem.<br>q15：Linda 受邀加入商業比賽評審團<br>　Last month, a large hotel group asked her to join a panel of judges for a business contest. | q13：主詞、情境<br>q15：主詞、情境 | 通過 |
| employ | 這家飯店僱用會說五種語言的員工<br>　This hotel employs staff who speak five languages. | q09：她兩個暑假受僱當導遊（被動）<br>　She was employed as a tour guide for two summers.<br>q15：僱用年輕發明家的公司也得到新點子<br>　Linda believes a good employer should welcome new ideas, and companies that employ young inventors often grow faster. | q09：主詞、情境、句型<br>q15：主詞、情境、句型 | 通過 |
| sector | 新機場啟用後觀光業成長快<br>　The tourism sector grew quickly after the new airport opened. | q15：Linda 在銀行業工作十年<br>　Linda worked in the banking sector for ten years before she became a consultant.<br>q17：我在教育界工作／想進科技業<br>　I work in the education sector as an English teacher. / I would like to work in the technology sector after I graduate. | q15：主詞、情境、句型<br>q17：主詞、情境、句型 | 通過 |
| employer | 我第一個僱主是學校附近麵包店<br>　My first employer was a small bakery near my school. | q15：好僱主不只是付高薪<br>　Linda believes a good employer should welcome new ideas, and companies that employ young inventors often grow faster.<br>q16：我的僱主每年提供兩週訓練<br>　My employer gives employees two weeks of training every year. / Every year, my employer provides two weeks of training for its staff. | q15：主詞、情境、句型<br>q16：主詞、情境、句型 | 通過 |
| consultant | 她當旅遊顧問替忙碌家庭規劃旅程<br>　As a travel consultant, she plans trips for busy families. | q14：公司請外部顧問建議如何省錢<br>　The company hired an outside consultant to give advice on cutting costs.<br>q15：Linda 轉行當顧問<br>　Linda worked in the banking sector for ten years before she became a consultant. | q14：主詞、情境、句型<br>q15：主詞、情境、句型 | 通過 |
| deputy | 副市長為新圖書館揭幕<br>　The deputy mayor opened the new library. | q12：經理休假時副手做決定<br>　While the manager is on holiday, her deputy will make the decisions.<br>q15：飯店集團副總給隊伍合約<br>　After the contest, the hotel group's deputy director offered the team a contract. | q12：主詞、情境、句型<br>q15：主詞、情境、句型 | 通過 |
| profile | 雜誌刊登年輕廚師的簡介<br>　The magazine published a short profile of the young chef. | q11：我更新網路個人檔案<br>　I updated my online profile with a new photo and my latest job.<br>q15：Linda 讀每隊的簡介<br>　Before the event, she read the profile of every team. | q11：主詞、情境、句型<br>q15：主詞、情境、句型 | 通過 |
| operator | 機器操作員為安全戴特殊手套<br>　The machine operator wears special gloves for safety. | q10：接線生幫來電轉接業務部<br>　Please hold the line; the operator will connect you to the sales department.<br>q15：操作員單手就能控制機器<br>　The winning team had invented a simple machine that helps hotel cleaners carry heavy sheets, and its operator can control it with one hand. | q10：主詞、情境、句型<br>q15：主詞、情境、句型 | 通過 |

同課題目互比（9 題；事件摘要逐題人工判定互不相同；腳本找「同目標字且主詞、句型都相同」的兩題：0 組）

| 題號 | 事件摘要 |
|---|---|
| q09 | employ：她兩個暑假受僱當導遊（被動） |
| q10 | operator：接線生幫來電轉接業務部 |
| q11 | profile：我更新網路個人檔案 |
| q12 | deputy：經理休假時副手做決定 |
| q13 | panel：市府成立專家小組研究交通 |
| q14 | consultant：公司請外部顧問建議如何省錢 |
| q15 | panel：Linda 受邀加入商業比賽評審團；employ：僱用年輕發明家的公司也得到新點子；sector：Linda 在銀行業工作十年；employer：好僱主不只是付高薪；consultant：Linda 轉行當顧問；deputy：飯店集團副總給隊伍合約；profile：Linda 讀每隊的簡介；operator：操作員單手就能控制機器 |
| q16 | employer：我的僱主每年提供兩週訓練 |
| q17 | sector：我在教育界工作／想進科技業 |

#### b2-u28-l04

| 目標字 | 單字卡情境 | 其他題情境 | 換了哪幾項 | 判定 |
|---|---|---|---|---|
| consult | 律師常互相請教難題<br>　Lawyers often consult each other about difficult problems. | q10：買二手車前請教懂引擎的人（祈使）<br>　Before you buy a used car, consult someone who knows about engines.<br>q15：員工有問題可請教技術團隊<br>　Workers can consult the technical team when there is a problem, and the clerical staff send the transcripts to clients.<br>q17：我做決定前請教父母／查字典<br>　I always consult my parents before I make a big decision. / I consult a dictionary when I am not sure about a word. | q10：主詞、情境、句型<br>q15：主詞、情境、句型<br>q17：主詞、情境、句型 | 通過 |
| timing | 說笑話時機很重要<br>　Good timing is important when you tell a joke. | q15：去年冬天很多員工感冒、時機剛好<br>　The timing of this change was perfect, because many staff stayed home with colds last winter.<br>q16：你提問的時機不太好<br>　The timing of your question was not very good. / Your timing for asking this question wasn't great. | q15：主詞、情境、句型<br>q16：主詞、情境、句型 | 通過 |
| supervision | 工程由資深工程師監督<br>　The building work is under the supervision of an experienced engineer. | q11：十歲以下要成人看管才能游泳<br>　Children under ten may only use the pool under adult supervision.<br>q15：新進員工起初要有人監督才能用系統<br>　Some managers were worried about privacy, so new staff must use the system under supervision at first. | q11：主詞、情境、句型<br>q15：主詞、情境、句型 | 通過 |
| transcript | 網站上可讀訪談逐字稿<br>　You can read a transcript of the interview on our website. | q15：系統把會議發言做成紀錄、寄給客戶<br>　After every meeting, the system makes a transcript of what people said, and everyone can download the handout too. / Workers can consult the technical team when there is a problem, and the clerical staff send the transcripts to clients. | q15：主詞、情境 | 通過 |
| clerical | 他畢業後在市政府找到文書工作<br>　He got a clerical job at the city hall after he graduated. | q14：她做打字回信等文書工作<br>　She does clerical work, such as typing letters and answering emails.<br>q15：文書人員寄紀錄給客戶<br>　Workers can consult the technical team when there is a problem, and the clerical staff send the transcripts to clients. | q14：主詞、情境、句型<br>q15：主詞、情境、句型 | 通過 |
| handout | 進會議室請拿一份資料（祈使）<br>　Please take a handout as you enter the meeting room. | q12：老師發了有生字的講義<br>　The teacher gave us a handout with all the new words from the lesson.<br>q15：員工可下載講義<br>　After every meeting, the system makes a transcript of what people said, and everyone can download the handout too. | q12：主詞、情境、句型<br>q15：主詞、情境、句型 | 通過 |
| conferencing | 會議軟體讓人不出門就能開會<br>　Conferencing software lets people meet without leaving home. | q13：我們每週用視訊和東京開會<br>　We hold weekly meetings with the Tokyo office through video conferencing.<br>q15：會議室有視訊會議用的鏡頭<br>　Each meeting room now has a camera and a microphone for video conferencing, so staff who work from home can still join. | q13：主詞、情境、句型<br>q15：主詞、情境、句型 | 通過 |
| facilities | 市府打算改善各區運動設施<br>　The city plans to improve sports facilities in every district. | q09：飯店設施有泳池健身房圖書室<br>　The hotel's facilities include a pool, a gym and a small library.<br>q15：公司升級線上會議設施<br>　Our company recently upgraded its facilities for online meetings. | q09：主詞、情境、句型<br>q15：主詞、情境、句型 | 通過 |

同課題目互比（9 題；事件摘要逐題人工判定互不相同；腳本找「同目標字且主詞、句型都相同」的兩題：q15↔q16（timing））

| 題號 | 事件摘要 |
|---|---|
| q09 | facilities：飯店設施有泳池健身房圖書室 |
| q10 | consult：買二手車前請教懂引擎的人（祈使） |
| q11 | supervision：十歲以下要成人看管才能游泳 |
| q12 | handout：老師發了有生字的講義 |
| q13 | conferencing：我們每週用視訊和東京開會 |
| q14 | clerical：她做打字回信等文書工作 |
| q15 | consult：員工有問題可請教技術團隊；timing：去年冬天很多員工感冒、時機剛好；supervision：新進員工起初要有人監督才能用系統；transcript：系統把會議發言做成紀錄、寄給客戶；clerical：文書人員寄紀錄給客戶；handout：員工可下載講義；conferencing：會議室有視訊會議用的鏡頭；facilities：公司升級線上會議設施 |
| q16 | timing：你提問的時機不太好 |
| q17 | consult：我做決定前請教父母／查字典 |

#### b2-u29-l01

| 目標字 | 單字卡情境 | 其他題情境 | 換了哪幾項 | 判定 |
|---|---|---|---|---|
| enroll | 今年五百多名學生入學<br>　More than five hundred students enrolled at the university this year. | q15：經理建議 Kevin 報名免費課程<br>　Instead, his manager suggested that he enroll in a free training course in data design.<br>q16：妹妹報名週末烹飪班<br>　My sister enrolled in a weekend cooking class. / My younger sister has enrolled in a cooking course on weekends. | q15：主詞、情境、句型<br>q16：主詞、情境、句型 | 通過 |
| specialty | 這位律師專長家事法<br>　The lawyer's specialty is family law. | q15：導師幫 Kevin 找到專長：做圖表<br>　During the course, an experienced colleague became his mentor and helped him find his specialty: making clear charts for reports. | q15：主詞、情境、句型 | 通過 |
| mentor | 每位新護士前六個月配一位導師（被動）<br>　Every new nurse is given a mentor for the first six months. | q11：我的導師教我應付難纏客人<br>　My mentor taught me how to deal with difficult customers.<br>q15：資深同事成為 Kevin 的導師<br>　During the course, an experienced colleague became his mentor and helped him find his specialty: making clear charts for reports.<br>q17：我創業時叔叔是導師／鋼琴老師是導師<br>　My uncle was my mentor when I started my own small business. / My piano teacher has been my mentor for many years. | q11：主詞、情境、句型<br>q15：主詞、情境、句型<br>q17：主詞、情境、句型 | 通過 |
| eligible | 六歲以下兒童可免費入動物園<br>　Children under six are eligible for free entry to the zoo. | q10：未滿十八歲才有資格加入市立青年隊<br>　Only players under eighteen are eligible to join the city's youth team.<br>q15：Kevin 待滿三年有資格上課<br>　Kevin was eligible because he had worked there for more than three years. | q10：主詞、情境、句型<br>q15：主詞、情境、句型 | 通過 |
| compensate | 什麼都彌補不了我失去的時間<br>　Nothing can compensate for the time I lost. | q12：商店補償收到破損商品的顧客<br>　The shop will compensate customers who received broken items.<br>q15：公司加薪補償額外工作<br>　The company also raised his salary to compensate for the extra work. | q12：主詞、情境、句型<br>q15：主詞、情境、句型 | 通過 |
| applicant | 每位應徵者和經理短暫面談<br>　Each applicant will have a short interview with the manager. | q09：所有申請人月底前寄表格<br>　All applicants must send their forms before the end of the month.<br>q15：二十多位應徵者、Kevin 錄取<br>　There were more than twenty applicants, but Kevin got the job. | q09：情境、句型<br>q15：主詞、情境、句型 | 通過 |
| resignation | 她突然辭職讓辦公室大家驚訝<br>　Her sudden resignation surprised everyone in the office. | q14：王先生遞辭呈開咖啡店<br>　After twenty years at the bank, Mr. Wang handed in his resignation and opened a cafe.<br>q15：資深設計師遞辭呈<br>　Six months later, a senior designer handed in her resignation, and the company looked for someone to replace her. | q14：主詞、情境、句型<br>q15：主詞、情境、句型 | 通過 |
| downsize | 銀行把服務移到網路藉此縮編<br>　The bank downsized its staff by moving many services online. | q13：孩子搬出後爸媽換小公寓<br>　When their children moved out, my parents decided to downsize to a small apartment.<br>q15：Kevin 的公司去年縮編<br>　When Kevin's company decided to downsize last year, he was afraid of losing his job. | q13：主詞、情境、句型<br>q15：主詞、情境、句型 | 通過 |

同課題目互比（9 題；事件摘要逐題人工判定互不相同；腳本找「同目標字且主詞、句型都相同」的兩題：0 組）

| 題號 | 事件摘要 |
|---|---|
| q09 | applicant：所有申請人月底前寄表格 |
| q10 | eligible：未滿十八歲才有資格加入市立青年隊 |
| q11 | mentor：我的導師教我應付難纏客人 |
| q12 | compensate：商店補償收到破損商品的顧客 |
| q13 | downsize：孩子搬出後爸媽換小公寓 |
| q14 | resignation：王先生遞辭呈開咖啡店 |
| q15 | enroll：經理建議 Kevin 報名免費課程；specialty：導師幫 Kevin 找到專長：做圖表；mentor：資深同事成為 Kevin 的導師；eligible：Kevin 待滿三年有資格上課；compensate：公司加薪補償額外工作；applicant：二十多位應徵者、Kevin 錄取；resignation：資深設計師遞辭呈；downsize：Kevin 的公司去年縮編 |
| q16 | enroll：妹妹報名週末烹飪班 |
| q17 | mentor：我創業時叔叔是導師／鋼琴老師是導師 |

#### b2-u29-l02

| 目標字 | 單字卡情境 | 其他題情境 | 換了哪幾項 | 判定 |
|---|---|---|---|---|
| trainee | 見習飛行員第一次開小飛機<br>　The trainee pilot flew a small plane for the first time. | q09：新實習生第一週在廚房<br>　The new trainees will spend their first week in the kitchen.<br>q15：何先生從低薪實習生做起<br>　Ho started as a trainee earning a very low wage, but he worked hard and became a supervisor. | q09：主詞、情境、句型<br>q15：主詞、情境、句型 | 通過 |
| veteran | 球隊需要年輕球員和老將<br>　The team needs a mix of young players and veterans. | q15：何先生是工廠真正的老手<br>　Ho is a true veteran. | q15：主詞、情境、句型 | 通過 |
| personnel | 所有人員在大樓內須戴識別證<br>　All personnel must wear a badge inside the building. | q13：人事部門負責招人和訓練<br>　The company's personnel department is in charge of hiring new staff and planning training.<br>q15：人事室為何先生辦派對<br>　Next month, he will begin his retirement, and the personnel office is planning a small party for him. | q13：主詞、情境、句型<br>q15：主詞、情境、句型 | 通過 |
| retirement | 公司在他退休時送金錶<br>　The company gave him a gold watch on his retirement. | q10：父親教書四十年後在海邊享受退休<br>　After forty years of teaching, my father is enjoying his retirement by the sea.<br>q15：何先生下個月退休<br>　Next month, he will begin his retirement, and the personnel office is planning a small party for him.<br>q17：我退休後想開書店／環遊世界<br>　After my retirement, I hope to open a small bookshop. / I want to travel around the world after my retirement. | q10：主詞、情境、句型<br>q15：主詞、情境、句型<br>q17：主詞、情境、句型 | 通過 |
| salary | 她的薪水每月最後一天發（被動）<br>　Her salary is paid on the last day of every month. | q14：新工作薪水更高、她樂意換公司<br>　The new job offers a higher salary and more holidays, so she is happy to change companies.<br>q15：何先生的薪水逐年增加<br>　Over the years, his salary grew, and he saved part of his earnings every month. | q14：主詞、情境、句型<br>q15：情境、句型 | 通過 |
| wage | 這裡餐廳員工領時薪加小費<br>　Restaurant workers here earn an hourly wage plus tips. | q11：他工資低所以兼兩份工<br>　He works two jobs because his wage is quite low.<br>q15：何先生從低工資做起<br>　Ho started as a trainee earning a very low wage, but he worked hard and became a supervisor. | q11：主詞、情境、句型<br>q15：主詞、情境、句型 | 通過 |
| dismiss | 公司解僱兩名偷竊員工<br>　The company dismissed two workers for stealing. | q12：經理沒聽就否定我的點子<br>　The manager dismissed my idea without even listening to it.<br>q15：工廠從沒解僱過任何人<br>　In all those years, the factory never had to dismiss a single worker, and Mr. | q12：主詞、情境、句型<br>q15：主詞、情境、句型 | 通過 |
| earnings | 她開店的收入足以養家<br>　Her earnings from the shop are enough to support her family. | q15：何先生每月存一部分收入<br>　Over the years, his salary grew, and he saved part of his earnings every month.<br>q16：公司今年收入比去年高一成<br>　The company's earnings this year are ten percent higher than last year. / This year, the company's earnings rose by ten percent compared with last year. | q15：主詞、情境、句型<br>q16：主詞、情境、句型 | 通過 |

同課題目互比（9 題；事件摘要逐題人工判定互不相同；腳本找「同目標字且主詞、句型都相同」的兩題：0 組）

| 題號 | 事件摘要 |
|---|---|
| q09 | trainee：新實習生第一週在廚房 |
| q10 | retirement：父親教書四十年後在海邊享受退休 |
| q11 | wage：他工資低所以兼兩份工 |
| q12 | dismiss：經理沒聽就否定我的點子 |
| q13 | personnel：人事部門負責招人和訓練 |
| q14 | salary：新工作薪水更高、她樂意換公司 |
| q15 | trainee：何先生從低薪實習生做起；veteran：何先生是工廠真正的老手；personnel：人事室為何先生辦派對；retirement：何先生下個月退休；salary：何先生的薪水逐年增加；wage：何先生從低工資做起；dismiss：工廠從沒解僱過任何人；earnings：何先生每月存一部分收入 |
| q16 | earnings：公司今年收入比去年高一成 |
| q17 | retirement：我退休後想開書店／環遊世界 |

#### b2-u29-l03

| 目標字 | 單字卡情境 | 其他題情境 | 換了哪幾項 | 判定 |
|---|---|---|---|---|
| capability | 公司沒有能力造這麼大的船<br>　The company does not have the capability to build such large ships. | q12：新手機能即時翻譯語音<br>　The new phone has the capability to translate speech instantly.<br>q15：蔡太太測試新電動公車的性能<br>　Now she helps test the capability of every new electric bus before it goes on the road. | q12：主詞、情境<br>q15：主詞、情境、句型 | 通過 |
| recruit | 大學向全世界招收學生<br>　Universities recruit students from all over the world. | q09：醫院想從別的城市招募護理師<br>　The hospital is trying to recruit more nurses from other cities.<br>q15：公車公司在她畢業時招募她（被動語意）<br>　Ten years ago, the bus company recruited her straight from school.<br>q17：社團想招募愛健行的成員／餐廳招廚師<br>　Our club wants to recruit more members who love hiking. / The restaurant is recruiting cooks for its new branch. | q09：主詞、情境、句型<br>q15：主詞、情境、句型<br>q17：主詞、情境、句型 | 通過 |
| resign | 球隊連輸十場後教練辭職<br>　The coach resigned after the team lost ten games in a row. | q10：叔叔辭去飯店工作照顧寶寶<br>　My uncle resigned from his job at the hotel to take care of his new baby.<br>q15：大公司開高薪她仍沒辭職<br>　Last year, a bigger company offered her a higher salary, but she did not resign. | q10：主詞、情境、句型<br>q15：主詞、情境、句型 | 通過 |
| pension | 奶奶每月領一小筆退休金<br>　My grandmother gets a small pension every month. | q14：她退休後靠政府年金過得舒適<br>　After she retired, she lived comfortably on her pension from the government.<br>q15：公司額外替她提撥退休金<br>　The company even pays extra into her pension. | q14：主詞、情境、句型<br>q15：主詞、情境、句型 | 通過 |
| compensation | 工作受傷可要求賠償<br>　Workers who are hurt at work can ask for compensation. | q13：航班取消的補償是一晚住宿和晚餐<br>　The compensation for the cancelled flight was a free night at a hotel and a dinner.<br>q15：她說這裡的報酬公道<br>　"My team is competent, and the compensation here is fair," she said. | q13：主詞、情境、句型<br>q15：主詞、情境、句型 | 通過 |
| skilled | 手工做小提琴是需要技術的工作<br>　Making violins by hand is a skilled job. | q11：我們需要會修舊機器的熟練工人<br>　We need skilled workers who can repair old machines.<br>q15：她得到熟練技術人員獎<br>　Tsai is a bus mechanic, and this year she won the city's award for skilled workers. | q11：主詞、情境、句型<br>q15：主詞、情境、句型 | 通過 |
| competence | 考試檢驗讀寫能力<br>　The test checks your competence in reading and writing. | q15：同事信任她的能力<br>　Today, her colleagues trust her competence: she can find a problem in an engine just by listening to it. | q15：主詞、情境、句型 | 通過 |
| competent | 他能幹到可以獨自顧店<br>　He is competent enough to run the shop alone. | q15：她說她的團隊很能幹<br>　"My team is competent, and the compensation here is fair," she said.<br>q16：她是很能幹的翻譯、準時交稿<br>　She is a very competent translator who always finishes her work on time. / She is a very competent translator, and she always delivers her work on time. | q15：主詞、情境、句型<br>q16：主詞、情境、句型 | 通過 |

同課題目互比（9 題；事件摘要逐題人工判定互不相同；腳本找「同目標字且主詞、句型都相同」的兩題：0 組）

| 題號 | 事件摘要 |
|---|---|
| q09 | recruit：醫院想從別的城市招募護理師 |
| q10 | resign：叔叔辭去飯店工作照顧寶寶 |
| q11 | skilled：我們需要會修舊機器的熟練工人 |
| q12 | capability：新手機能即時翻譯語音 |
| q13 | compensation：航班取消的補償是一晚住宿和晚餐 |
| q14 | pension：她退休後靠政府年金過得舒適 |
| q15 | capability：蔡太太測試新電動公車的性能；recruit：公車公司在她畢業時招募她（被動語意）；resign：大公司開高薪她仍沒辭職；pension：公司額外替她提撥退休金；compensation：她說這裡的報酬公道；skilled：她得到熟練技術人員獎；competence：同事信任她的能力；competent：她說她的團隊很能幹 |
| q16 | competent：她是很能幹的翻譯、準時交稿 |
| q17 | recruit：社團想招募愛健行的成員／餐廳招廚師 |

#### b2-u29-l04

| 目標字 | 單字卡情境 | 其他題情境 | 換了哪幾項 | 判定 |
|---|---|---|---|---|
| qualification | 他在泰國度假時考到潛水證照<br>　He got his diving qualification during a holiday in Thailand. | q13：短期課程給你電腦技能資格<br>　This short course gives you a qualification in computer skills.<br>q14：主廚需要烹飪資格<br>　We need someone with a cooking qualification and at least five years of experience in a busy kitchen, so inexperienced cooks should not apply. | q13：主詞、情境、句型<br>q14：主詞、情境、句型 | 通過 |
| inexperienced | 經驗不足的球員大賽前很緊張<br>　The inexperienced players were nervous before the big game. | q12：新服務生經驗不足第一天摔盤<br>　Because the new waiter was inexperienced, he dropped two plates on his first day.<br>q14：沒經驗的廚師別應徵<br>　We need someone with a cooking qualification and at least five years of experience in a busy kitchen, so inexperienced cooks should not apply. | q12：主詞、情境、句型<br>q14：主詞、情境、句型 | 通過 |
| skillful | 熟練的技工二十分鐘修好車<br>　The skillful mechanic fixed my car in twenty minutes. | q14：愛教學的熟練主廚會自在<br>　A skillful chef who enjoys teaching will feel at home here.<br>q16：表妹是得獎的熟練舞者／理髮師剪刀靈巧<br>　My cousin is a skillful dancer who has won many prizes. / The barber near my home is very skillful with scissors. | q14：情境、句型<br>q16：主詞、情境、句型 | 通過 |
| skillfully | 女孩熟練地把紙摺成鳥<br>　The girl skillfully folded the paper into a bird. | q08：司機熟練地把巴士停進小空位<br>　The driver skillfully parked the large bus in a very small space.<br>q14：主廚要在壓力下熟練工作<br>　The chef must work skillfully under pressure and lead a team of ten. | q08：主詞、情境、句型<br>q14：主詞、情境、句型 | 通過 |
| workaholic | 工作狂姊姊常在桌前吃晚餐<br>　My workaholic sister often eats dinner at her desk. | q10：老闆是工作狂、度假也回信<br>　My boss is a workaholic who answers emails even on holiday.<br>q14：飯店不找工作狂<br>　We are not looking for a workaholic: our employees work fixed hours and have two days off every week. | q10：主詞、情境、句型<br>q14：主詞、情境、句型 | 通過 |
| nonprofessional | 書用簡單文字寫給非專業讀者<br>　The book was written in simple words for nonprofessional readers. | q11：照片由村裡業餘攝影師拍攝<br>　The photos were taken by nonprofessional photographers from the village.<br>q14：招牌菜來自業餘廚師的比賽<br>　Many of our best dishes were first created by nonprofessional cooks in our annual family recipe contest, and the new chef will judge it. | q11：主詞、情境、句型<br>q14：主詞、情境、句型 | 通過 |
| well-paid | 這國家工程師通常高薪<br>　Engineers are usually well-paid in this country. | q09：我因高薪接工作但週末要上班<br>　I took the job because it's well-paid, but I have to work most weekends.<br>q14：主廚職位高薪但不適合每個人<br>　This is a well-paid position, but it is not for everyone.<br>q15：她希望找到高薪又有趣的工作<br>　She hopes to find a well-paid and interesting job. / She hopes to get a job that is interesting and well-paid. | q09：主詞、情境、句型<br>q14：主詞、情境、句型<br>q15：主詞、情境、句型 | 通過 |

同課題目互比（9 題；事件摘要逐題人工判定互不相同；腳本找「同目標字且主詞、句型都相同」的兩題：0 組）

| 題號 | 事件摘要 |
|---|---|
| q08 | skillfully：司機熟練地把巴士停進小空位 |
| q09 | well-paid：我因高薪接工作但週末要上班 |
| q10 | workaholic：老闆是工作狂、度假也回信 |
| q11 | nonprofessional：照片由村裡業餘攝影師拍攝 |
| q12 | inexperienced：新服務生經驗不足第一天摔盤 |
| q13 | qualification：短期課程給你電腦技能資格 |
| q14 | qualification：主廚需要烹飪資格；inexperienced：沒經驗的廚師別應徵；skillful：愛教學的熟練主廚會自在；skillfully：主廚要在壓力下熟練工作；workaholic：飯店不找工作狂；nonprofessional：招牌菜來自業餘廚師的比賽；well-paid：主廚職位高薪但不適合每個人 |
| q15 | well-paid：她希望找到高薪又有趣的工作 |
| q16 | skillful：表妹是得獎的熟練舞者／理髮師剪刀靈巧 |

#### b2-u30-l01

| 目標字 | 單字卡情境 | 其他題情境 | 換了哪幾項 | 判定 |
|---|---|---|---|---|
| client | 律師在市中心小辦公室見客戶<br>　The lawyer meets her clients in a small office downtown. | q12：客戶不滿意設計只好重來<br>　The client was unhappy with our design, so we had to start again.<br>q14：網路讓 Nina 接觸全台客戶<br>　Online commerce helped her reach clients all over Taiwan, and her business became profitable after only two years. | q12：主詞、情境、句型<br>q14：主詞、情境、句型 | 通過 |
| cooperate | 村裡農民合作低價買種子<br>　Farmers in the village cooperate to buy seeds at a lower price. | q10：兩組合作就能週五前完成<br>　If both teams cooperate, we can finish the project by Friday.<br>q14：兩家公司合作推禮盒<br>　Instead, the two companies decided to cooperate on a new line of gift sets.<br>q16：我和同學合作規劃旅行／和鄰居清街道<br>　My classmates and I cooperated to plan a school trip. / I cooperated with my neighbors to clean up our street. | q10：主詞、情境、句型<br>q14：主詞、情境、句型<br>q16：主詞、情境、句型 | 通過 |
| entrepreneur | 市府為年輕創業家開免費課<br>　The city offers free training for young entrepreneurs. | q14：Nina 年輕創業沒什麼錢<br>　As a young entrepreneur, she had little money, so she sold her soap online.<br>q15：她二十五歲成為成功創業家<br>　She became a successful entrepreneur at the age of twenty-five. / At twenty-five, she was already a successful entrepreneur. | q14：主詞、情境、句型<br>q15：主詞、情境、句型 | 通過 |
| commerce | 城市靠和鄰近港口貿易致富<br>　The city grew rich through commerce with nearby ports. | q11：網路商務改變買書方式<br>　Online commerce has changed the way people buy books.<br>q14：網路商務幫 Nina 接觸客戶<br>　Online commerce helped her reach clients all over Taiwan, and her business became profitable after only two years. | q11：主詞、情境、句型<br>q14：主詞、情境、句型 | 通過 |
| merger | 合併後新公司超過一萬名員工<br>　After the merger, the new company had over ten thousand workers. | q08：兩家銀行週五宣佈合併<br>　The two banks announced their merger on Friday morning.<br>q14：大公司提議合併、Nina 拒絕<br>　Then a bigger company proposed a merger. | q08：主詞、情境、句型<br>q14：主詞、情境、句型 | 通過 |
| profitable | 雨季賣傘很賺錢<br>　Selling umbrellas can be very profitable during the rainy season. | q13：新公車路線不賺錢一年後停駛<br>　The new bus route was not profitable, so the company stopped it after a year.<br>q14：Nina 的生意兩年就賺錢<br>　Online commerce helped her reach clients all over Taiwan, and her business became profitable after only two years. | q13：主詞、情境、句型<br>q14：主詞、情境、句型 | 通過 |
| distributor | 經銷商每天早上送鮮奶到四十家店<br>　The distributor delivers fresh milk to forty shops every morning. | q09：經銷商想降價、週一見面談<br>　Our distributor wants a lower price, so we will meet them on Monday to talk about it.<br>q14：大經銷商要把肥皂賣進超市<br>　Last year, a large distributor offered to sell her soap in supermarkets, and she agreed. | q09：情境、句型<br>q14：主詞、情境、句型 | 通過 |

同課題目互比（9 題；事件摘要逐題人工判定互不相同；腳本找「同目標字且主詞、句型都相同」的兩題：0 組）

| 題號 | 事件摘要 |
|---|---|
| q08 | merger：兩家銀行週五宣佈合併 |
| q09 | distributor：經銷商想降價、週一見面談 |
| q10 | cooperate：兩組合作就能週五前完成 |
| q11 | commerce：網路商務改變買書方式 |
| q12 | client：客戶不滿意設計只好重來 |
| q13 | profitable：新公車路線不賺錢一年後停駛 |
| q14 | client：網路讓 Nina 接觸全台客戶；cooperate：兩家公司合作推禮盒；entrepreneur：Nina 年輕創業沒什麼錢；commerce：網路商務幫 Nina 接觸客戶；merger：大公司提議合併、Nina 拒絕；profitable：Nina 的生意兩年就賺錢；distributor：大經銷商要把肥皂賣進超市 |
| q15 | entrepreneur：她二十五歲成為成功創業家 |
| q16 | cooperate：我和同學合作規劃旅行／和鄰居清街道 |

#### b2-u30-l02

| 目標字 | 單字卡情境 | 其他題情境 | 換了哪幾項 | 判定 |
|---|---|---|---|---|
| contract | 歌手和日本唱片公司簽約<br>　The singer has a contract with a record company in Japan. | q08：簽合約前請仔細讀（祈使）<br>　Please read the contract carefully before you sign it.<br>q14：地方電台簽約轉播路跑<br>　A local radio station signed a contract to report the race live.<br>q16：我租房／辦手機簽約<br>　I signed a one-year contract when I rented my apartment. / I signed a two-year phone contract last spring. | q08：主詞、情境、句型<br>q14：主詞、情境、句型<br>q16：主詞、情境、句型 | 通過 |
| corporate | 很多公司辦公室週末沒人<br>　Many corporate offices are empty on weekends. | q13：很多企業客戶開會訂便當<br>　Many corporate customers order lunch boxes for their staff meetings.<br>q14：企業隊伍穿同樣 T 恤一起跑<br>　Several corporate teams also ran together, wearing the same T-shirts. | q13：情境、句型<br>q14：情境、句型 | 通過 |
| profit | 麵包店大部分利潤來自婚禮蛋糕<br>　The bakery makes most of its profit from wedding cakes. | q10：公司去年獲利兩百萬<br>　The company made a profit of two million dollars last year.<br>q14：當天利潤捐給兒童圖書館<br>　Each runner paid a small fee, and the company promised to give all the profit from the day to a children's library. | q10：主詞、情境、句型<br>q14：主詞、情境、句型 | 通過 |
| participation | 你參與問卷能幫我們改進<br>　Your participation in the survey will help us improve. | q11：學生參加打掃日人數創新高<br>　Student participation in the cleaning day was higher than ever.<br>q14：家庭參與人數增加一倍<br>　This year, over five thousand people took part, and participation by families doubled. | q11：主詞、情境、句型<br>q14：主詞、情境、句型 | 通過 |
| marketing | 好行銷能把簡單產品變暢銷<br>　Good marketing can turn a simple product into a bestseller. | q09：行銷團隊週四會議展示新廣告<br>　Our marketing team will show the new advertisements at Thursday's meeting.<br>q14：行銷團隊規劃公益路跑<br>　Every year, a large shoe enterprise in Tainan holds a charity run, and its marketing team plans the whole event.<br>q15：她在大公司負責行銷<br>　She is in charge of marketing at a large company. / She is responsible for marketing at a big company. | q09：主詞、情境、句型<br>q14：主詞、情境、句型<br>q15：主詞、情境、句型 | 通過 |
| enterprise | 農場是三代家族事業<br>　The farm has been a family enterprise for three generations. | q14：台南製鞋企業每年辦公益路跑<br>　Every year, a large shoe enterprise in Tainan holds a charity run, and its marketing team plans the whole event. | q14：主詞、情境、句型 | 通過 |
| stake | 她父親持有飯店大量股份<br>　Her father owns a large stake in the hotel. | q12：運動公司買下鞋牌三成股份<br>　The sports company bought a thirty percent stake in the new shoe brand.<br>q14：公司持有附近健身房一小部分股份<br>　A nearby gym, in which the company has a small stake, let the runners use its showers for free. | q12：主詞、情境、句型<br>q14：主詞、情境、句型 | 通過 |

同課題目互比（9 題；事件摘要逐題人工判定互不相同；腳本找「同目標字且主詞、句型都相同」的兩題：0 組）

| 題號 | 事件摘要 |
|---|---|
| q08 | contract：簽合約前請仔細讀（祈使） |
| q09 | marketing：行銷團隊週四會議展示新廣告 |
| q10 | profit：公司去年獲利兩百萬 |
| q11 | participation：學生參加打掃日人數創新高 |
| q12 | stake：運動公司買下鞋牌三成股份 |
| q13 | corporate：很多企業客戶開會訂便當 |
| q14 | contract：地方電台簽約轉播路跑；corporate：企業隊伍穿同樣 T 恤一起跑；profit：當天利潤捐給兒童圖書館；participation：家庭參與人數增加一倍；marketing：行銷團隊規劃公益路跑；enterprise：台南製鞋企業每年辦公益路跑；stake：公司持有附近健身房一小部分股份 |
| q15 | marketing：她在大公司負責行銷 |
| q16 | contract：我租房／辦手機簽約 |

#### b2-u30-l03

| 目標字 | 單字卡情境 | 其他題情境 | 換了哪幾項 | 判定 |
|---|---|---|---|---|
| corporation | 這家大企業有五萬多名員工<br>　The corporation has more than fifty thousand employees. | q13：她在二十國有辦公室的大公司上班<br>　She works for a large corporation with offices in twenty countries.<br>q14：日本企業和台灣茶園合資<br>　Two years ago, a Japanese corporation and a small Taiwanese tea farm started a joint venture. / The partnership was simple: the farm grew the tea, and the corporation sold it in Japan with a beautiful label designed by local artists. | q13：主詞、情境、句型<br>q14：主詞、情境、句型 | 通過 |
| label | 她在標籤寫名字貼在便當盒<br>　She wrote her name on a label and put it on her lunch box. | q08：瓶子上的標籤掉了<br>　The label on this bottle has fallen off.<br>q14：企業用藝術家設計的標籤賣茶<br>　The partnership was simple: the farm grew the tea, and the corporation sold it in Japan with a beautiful label designed by local artists.<br>q16：我看標籤確認價格尺寸／生產日期<br>　I always read the label to check the price and size. / I check the label on food to see when it was made. | q08：主詞、情境、句型<br>q14：主詞、情境、句型<br>q16：主詞、情境、句型 | 通過 |
| cooperation | 兩校今年合作大幅改善<br>　Cooperation between the two schools has improved a lot this year. | q09：多虧員工合作搬辦公室很順<br>　Thanks to the cooperation of all our staff, the move to the new office went smoothly.<br>q14：雙方密切合作找到便宜運法<br>　But with close cooperation, the two partners found cheaper ways to send the tea.<br>q15：這個計畫需要所有家長合作<br>　This project needs the cooperation of all the parents. / This plan needs cooperation from every parent. | q09：主詞、情境、句型<br>q14：主詞、情境、句型<br>q15：主詞、情境、句型 | 通過 |
| partnership | 兩個朋友合夥開店二十年<br>　The two friends ran the shop as a partnership for twenty years. | q10：兩所大學合作研究氣候變遷<br>　The two universities formed a partnership to study climate change.<br>q14：合作關係很簡單：茶園種、企業賣<br>　The partnership was simple: the farm grew the tea, and the corporation sold it in Japan with a beautiful label designed by local artists. | q10：主詞、情境、句型<br>q14：主詞、情境、句型 | 通過 |
| scheme | 學校回收計畫讓垃圾減半<br>　The school's recycling scheme has reduced waste by half. | q11：市府推計畫送學生免費單車<br>　The city started a scheme to give free bikes to students.<br>q14：他們為年輕農民辦訓練計畫<br>　They also started a training scheme for young farmers, and the farm recruited ten skilled workers. | q11：主詞、情境、句型<br>q14：主詞、情境、句型 | 通過 |
| venture | 他最新的事業是城市寵物旅館<br>　His latest business venture is a pet hotel in the city. | q14：合資事業被說太冒險、去年賺錢<br>　Two years ago, a Japanese corporation and a small Taiwanese tea farm started a joint venture. / Some people said the venture was too risky, but last year it made more money than anyone expected. | q14：主詞、情境、句型 | 通過 |
| margin | 商店賣瓶裝水利潤不錯<br>　Shops make a good margin on bottled water. | q12：我們以一分險勝<br>　We won the game by a narrow margin of just one point.<br>q14：一開始運費貴利潤率低<br>　At first, the profit margin was small because shipping was expensive. | q12：主詞、情境、句型<br>q14：主詞、情境、句型 | 通過 |

同課題目互比（9 題；事件摘要逐題人工判定互不相同；腳本找「同目標字且主詞、句型都相同」的兩題：0 組）

| 題號 | 事件摘要 |
|---|---|
| q08 | label：瓶子上的標籤掉了 |
| q09 | cooperation：多虧員工合作搬辦公室很順 |
| q10 | partnership：兩所大學合作研究氣候變遷 |
| q11 | scheme：市府推計畫送學生免費單車 |
| q12 | margin：我們以一分險勝 |
| q13 | corporation：她在二十國有辦公室的大公司上班 |
| q14 | corporation：日本企業和台灣茶園合資；label：企業用藝術家設計的標籤賣茶；cooperation：雙方密切合作找到便宜運法；partnership：合作關係很簡單：茶園種、企業賣；scheme：他們為年輕農民辦訓練計畫；venture：合資事業被說太冒險、去年賺錢；margin：一開始運費貴利潤率低 |
| q15 | cooperation：這個計畫需要所有家長合作 |
| q16 | label：我看標籤確認價格尺寸／生產日期 |

#### b2-u30-l04

| 目標字 | 單字卡情境 | 其他題情境 | 換了哪幾項 | 判定 |
|---|---|---|---|---|
| export | 今年鮮果出口增加一成<br>　Exports of fresh fruit rose by ten percent this year. | q08：台灣出口大量電腦零件（動詞）<br>　Taiwan exports a lot of computer parts to other countries.<br>q14：高先生公司出口單車到三十國<br>　His company now exports bikes to more than thirty countries.<br>q15：茶是本地區最重要出口品<br>　Tea is the most important export of this region. / Tea is this region's most important export. | q08：主詞、情境、句型<br>q14：主詞、情境、句型<br>q15：主詞、情境、句型 | 通過 |
| endorse | 名人代言的產品賣得較好（分詞被動）<br>　Products endorsed by famous people often sell better. | q09：網球選手同意代言新跑鞋<br>　The famous tennis player agreed to endorse our new running shoes.<br>q14：高先生請歌手代言電動單車<br>　Kao asked a popular singer to endorse his electric bikes. | q09：主詞、情境、句型<br>q14：主詞、情境、句型 | 通過 |
| cooperative | 合作的態度對任何工作有幫助<br>　A cooperative attitude will help you in any job. | q11：孩子們很配合、很快整理房間<br>　The children were very cooperative and cleaned up the room quickly.<br>q14：兩家公司最近變得比較合作<br>　For years, its main rival was a company in Japan, but the two firms have recently become more cooperative and even share some parts. | q11：主詞、情境、句型<br>q14：主詞、情境、句型 | 通過 |
| rival | 她在棋賽決賽擊敗老對手<br>　She beat her old rival in the final of the chess competition. | q12：兩家咖啡連鎖多年來互搶客人<br>　The two coffee chains have been rivals for years, always trying to steal each other's customers.<br>q14：主要對手是日本公司<br>　For years, its main rival was a company in Japan, but the two firms have recently become more cooperative and even share some parts.<br>q16：學校籃球隊的宿敵／好友搶同一角色成對手<br>　My school's basketball team has a long-time rival across the river. / My best friend became my rival when we both wanted the same role in a play. | q12：主詞、情境、句型<br>q14：主詞、情境、句型<br>q16：主詞、情境、句型 | 通過 |
| concession | 雙方都不願讓步<br>　Neither side was willing to make a concession. | q10：店家給學生九折優惠（優惠義）<br>　The shop offers a concession of ten percent to students.<br>q14：高先生讓步多給三天假<br>　When workers asked for more holidays, he made a concession and gave everyone three extra days off. | q10：主詞、情境、句型<br>q14：主詞、情境、句型 | 通過 |
| mogul | 電影大亨擁有三座片廠<br>　The movie mogul owns three film studios in Hollywood. | q14：高先生被稱為單車大亨<br>　Thanks to his salesmanship, the shop grew into a large company, and today he is known as a bicycle mogul. | q14：主詞、情境、句型 | 通過 |
| salesmanship | 在雪地賣冰需要高超推銷術<br>　Selling ice to people in the snow would take great salesmanship. | q13：她推銷技巧好、顧客多買<br>　Her salesmanship is so good that customers often buy more than they planned.<br>q14：高先生靠推銷術讓店成長<br>　Thanks to his salesmanship, the shop grew into a large company, and today he is known as a bicycle mogul. | q13：主詞、情境、句型<br>q14：主詞、情境、句型 | 通過 |

同課題目互比（9 題；事件摘要逐題人工判定互不相同；腳本找「同目標字且主詞、句型都相同」的兩題：0 組）

| 題號 | 事件摘要 |
|---|---|
| q08 | export：台灣出口大量電腦零件（動詞） |
| q09 | endorse：網球選手同意代言新跑鞋 |
| q10 | concession：店家給學生九折優惠（優惠義） |
| q11 | cooperative：孩子們很配合、很快整理房間 |
| q12 | rival：兩家咖啡連鎖多年來互搶客人 |
| q13 | salesmanship：她推銷技巧好、顧客多買 |
| q14 | export：高先生公司出口單車到三十國；endorse：高先生請歌手代言電動單車；cooperative：兩家公司最近變得比較合作；rival：主要對手是日本公司；concession：高先生讓步多給三天假；mogul：高先生被稱為單車大亨；salesmanship：高先生靠推銷術讓店成長 |
| q15 | export：茶是本地區最重要出口品 |
| q16 | rival：學校籃球隊的宿敵／好友搶同一角色成對手 |

#### b2-u31-l01

| 目標字 | 單字卡情境 | 其他題情境 | 換了哪幾項 | 判定 |
|---|---|---|---|---|
| economist | 她念數學後成為經濟學家<br>　She studied math before she became an economist. | q12：經濟學家預期明年物價緩漲<br>　The economist expects prices to rise slowly next year.<br>q16：經濟學家說線上遊戲傷了獲利<br>　Economists said that online games had hurt its profit. | q12：主詞、情境、句型<br>q16：主詞、情境、句型 | 通過 |
| fiscal | 政府財政計畫週一公佈（被動）<br>　The government's new fiscal plan was announced on Monday. | q15：公司會計年度四月開始<br>　The company's fiscal year starts in April and ends in March.<br>q16：審計顯示每個會計年度都虧<br>　For years, its bankers had warned that the company was spending too much, and an audit later showed that it had lost money in every fiscal year since 2015. | q15：主詞、情境、句型<br>q16：主詞、情境、句型 | 通過 |
| donate | 鎮上很多人捐錢重建老廟<br>　Many people in the town donated money to help rebuild the old temple. | q10：學校請家長捐舊書<br>　The school asked parents to donate old books to the library.<br>q16：公司把剩下玩具捐給兒童醫院<br>　Before closing, the company decided to donate its remaining toys to children's hospitals.<br>q18：我捐舊衣給慈善商店／捐舊腳踏車給兒童之家<br>　I donated my old clothes to a charity shop last month. / I donated my old bicycle to a children's home last year. | q10：主詞、情境、句型<br>q16：主詞、情境、句型<br>q18：主詞、情境、句型 | 通過 |
| withdrawal | 放假前提款大排長龍<br>　There were long lines for withdrawals before the holiday. | q11：我在機場提款付計程車<br>　I made a withdrawal at the airport so I would have cash for the taxi.<br>q16：老闆沒從公司帳戶提任何錢<br>　Many people were surprised that the owner refused to make any withdrawal from the company's accounts for himself. | q11：主詞、情境、句型<br>q16：主詞、情境、句型 | 通過 |
| bankruptcy | 破產的定義<br>　Bankruptcy means that a company cannot pay what it owes. | q14：沒有新客人小書店快破產<br>　Without new customers, the small bookshop is close to bankruptcy.<br>q16：知名玩具公司去年春天破產<br>　Last spring, a famous toy company went into bankruptcy. | q14：主詞、情境、句型<br>q16：主詞、情境、句型 | 通過 |
| donation | 博物館靠訪客捐款<br>　The museum depends on donations from visitors. | q16：捐的玩具裝滿三輛卡車<br>　The donation filled three trucks.<br>q17：我們收到老顧客一大筆捐款<br>　We received a large donation from a loyal customer. / A loyal customer gave us a big donation. | q16：主詞、情境、句型<br>q17：主詞、情境、句型 | 通過 |
| banker | 她爺爺曾是倫敦銀行家<br>　Her grandfather was a banker in London. | q16：銀行業者多年警告公司花太多<br>　For years, its bankers had warned that the company was spending too much, and an audit later showed that it had lost money in every fiscal year since 2015. | q16：主詞、情境、句型 | 通過 |
| audit | 審計是仔細檢查公司帳目（定義）<br>　An audit is a careful check of how a business spends its money. | q13：公司審計發現幾個小錯<br>　The company's audit found a few small mistakes in last year's records.<br>q16：審計顯示公司年年虧錢<br>　For years, its bankers had warned that the company was spending too much, and an audit later showed that it had lost money in every fiscal year since 2015. | q13：主詞、情境、句型<br>q16：主詞、情境、句型 | 通過 |
| bankrupt | 昂貴新工廠差點讓公司破產<br>　The expensive new factory nearly bankrupted the company. | q16：老闆說一個壞決定就能讓企業破產<br>　"One bad decision can bankrupt a business," he said, "but it should not change who you are." | q16：主詞、情境、句型 | 通過 |

同課題目互比（9 題；事件摘要逐題人工判定互不相同；腳本找「同目標字且主詞、句型都相同」的兩題：0 組）

| 題號 | 事件摘要 |
|---|---|
| q10 | donate：學校請家長捐舊書 |
| q11 | withdrawal：我在機場提款付計程車 |
| q12 | economist：經濟學家預期明年物價緩漲 |
| q13 | audit：公司審計發現幾個小錯 |
| q14 | bankruptcy：沒有新客人小書店快破產 |
| q15 | fiscal：公司會計年度四月開始 |
| q16 | economist：經濟學家說線上遊戲傷了獲利；fiscal：審計顯示每個會計年度都虧；donate：公司把剩下玩具捐給兒童醫院；withdrawal：老闆沒從公司帳戶提任何錢；bankruptcy：知名玩具公司去年春天破產；donation：捐的玩具裝滿三輛卡車；banker：銀行業者多年警告公司花太多；audit：審計顯示公司年年虧錢；bankrupt：老闆說一個壞決定就能讓企業破產 |
| q17 | donation：我們收到老顧客一大筆捐款 |
| q18 | donate：我捐舊衣給慈善商店／捐舊腳踏車給兒童之家 |

#### b2-u31-l02

| 目標字 | 單字卡情境 | 其他題情境 | 換了哪幾項 | 判定 |
|---|---|---|---|---|
| economical | 住車站附近經濟實惠的旅館<br>　We stayed in an economical hotel near the station. | q10：這台車很省油<br>　This car is economical because it uses very little gas.<br>q15：買大袋米比小包划算<br>　Buying rice in large bags is more economical than buying small packets.<br>q16：他們選省錢的太陽能燈<br>　To keep costs down, they chose economical solar lights and hired local workers. | q10：主詞、情境、句型<br>q15：主詞、情境、句型<br>q16：主詞、情境、句型 | 通過 |
| debit | 電話費每月自動扣款<br>　The money for the phone bill is taken by automatic debit each month. | q16：客人可用金融卡付款<br>　Guests can pay by cash, credit card or debit card. | q16：主詞、情境、句型 | 通過 |
| investment | 市府大筆投資公園<br>　The city made a big investment in public parks. | q16：兩位投資人各投資五百萬<br>　Two investors from Taipei also joined the venture, each making an investment of five million dollars.<br>q17：買新電腦對公司是好投資<br>　Buying new computers was a good investment for our company. / The new computers were a great investment for our company. | q16：主詞、情境、句型<br>q17：主詞、情境、句型 | 通過 |
| revenue | 觀光帶來島上大部分收入<br>　Tourism brings in most of the island's revenue. | q12：博物館門票收入去年增加<br>　The museum's revenue from ticket sales rose last year.<br>q16：一開始營收很低<br>　At first, revenue was low, and the couple worried about the monthly payments to the bank. | q12：主詞、情境、句型<br>q16：主詞、情境、句型 | 通過 |
| loan | 我六個月內還清哥哥的借款<br>　I paid back the loan from my brother in six months. | q11：銀行核准貸款、下月蓋新廚房<br>　The bank approved my loan, so we can start building the new kitchen next month.<br>q14：公司用銀行貸款買兩輛卡車<br>　The company used a bank loan to buy two new trucks.<br>q16：夫婦向地方銀行貸款<br>　They used their savings and took out a loan from a local bank. | q11：主詞、情境、句型<br>q14：主詞、情境、句型<br>q16：主詞、情境、句型 | 通過 |
| investor | 投資人對新電動車很興奮<br>　Investors were excited about the new electric car. | q16：兩位台北投資人加入<br>　Two investors from Taipei also joined the venture, each making an investment of five million dollars. | q16：情境、句型 | 通過 |
| estate | 老莊園有大房子、花園和小湖<br>　The old estate has a big house, a garden and a small lake. | q16：呂家在山上有大茶園<br>　Lu own a large tea estate in the mountains. | q16：主詞、情境、句型 | 通過 |
| payment | 昨天收到客戶第一筆款項<br>　We received the first payment from the client yesterday. | q13：請在月底前付款（祈使）<br>　Please make your payment before the end of the month.<br>q16：擔心每月付銀行的錢<br>　At first, revenue was low, and the couple worried about the monthly payments to the bank.<br>q18：我在超商用手機付款／夜市付現<br>　I usually make payments with my phone at convenience stores. / I prefer cash payment at night markets. | q13：主詞、情境、句型<br>q16：主詞、情境、句型<br>q18：主詞、情境、句型 | 通過 |
| saving | 關燈讓帳單省一成<br>　Turning off the lights brought a saving of ten percent on our bill. | q16：夫婦用存款蓋飯店<br>　They used their savings and took out a loan from a local bank. | q16：主詞、情境、句型 | 通過 |

同課題目互比（9 題；事件摘要逐題人工判定互不相同；腳本找「同目標字且主詞、句型都相同」的兩題：0 組）

| 題號 | 事件摘要 |
|---|---|
| q10 | economical：這台車很省油 |
| q11 | loan：銀行核准貸款、下月蓋新廚房 |
| q12 | revenue：博物館門票收入去年增加 |
| q13 | payment：請在月底前付款（祈使） |
| q14 | loan：公司用銀行貸款買兩輛卡車 |
| q15 | economical：買大袋米比小包划算 |
| q16 | economical：他們選省錢的太陽能燈；debit：客人可用金融卡付款；investment：兩位投資人各投資五百萬；revenue：一開始營收很低；loan：夫婦向地方銀行貸款；investor：兩位台北投資人加入；estate：呂家在山上有大茶園；payment：擔心每月付銀行的錢；saving：夫婦用存款蓋飯店 |
| q17 | investment：買新電腦對公司是好投資 |
| q18 | payment：我在超商用手機付款／夜市付現 |

#### b2-u31-l03

| 目標字 | 單字卡情境 | 其他題情境 | 換了哪幾項 | 判定 |
|---|---|---|---|---|
| deficit | 這國家連三年貿易赤字<br>　The country has had a trade deficit for three years. | q10：市府預算赤字、延後蓋泳池<br>　The city has a budget deficit this year, so it will delay building the new swimming pool.<br>q15：叔叔公司出現大赤字<br>　A few years ago, my uncle's company had a big deficit, and he was heavily indebted for a while. | q10：主詞、情境、句型<br>q15：主詞、情境、句型 | 通過 |
| wealthy | 百年前只有富裕家庭買得起車<br>　A hundred years ago, only wealthy families could afford cars. | q15：叔叔三十幾歲致富<br>　My uncle, a successful entrepreneur, became wealthy in his thirties.<br>q17：河邊富人區房子大／有錢鄰居開舊車<br>　The wealthy area near the river has many large houses. / My wealthy neighbor still drives a very old car. | q15：主詞、情境、句型<br>q17：主詞、情境、句型 | 通過 |
| mortgage | 他們申請房貸買第一間公寓<br>　They took out a mortgage to buy their first apartment. | q09：付房貸用掉我一半薪水（動名詞主詞）<br>　Paying the mortgage takes almost half of my salary.<br>q15：阿姨靠煮飯騎車提早還清房貸<br>　She paid off her mortgage early by cooking at home and riding a bike to work. | q09：主詞、情境、句型<br>q15：主詞、情境、句型 | 通過 |
| financially | 開咖啡店很辛苦但財務上成功<br>　Running the cafe was hard, but financially it was a success. | q14：她找到好工作後經濟獨立<br>　After she got a better job, she became financially independent.<br>q15：兩人都說經濟上過得不錯<br>　Today, they both say they are financially comfortable. | q14：主詞、情境、句型<br>q15：主詞、情境、句型 | 通過 |
| lucrative | 她辭掉銀行高薪工作去當畫家<br>　She left a lucrative job at a bank to become a painter. | q13：在車站旁賣咖啡很賺錢<br>　Selling coffee near the train station turned out to be very lucrative; the shop earned more than expected.<br>q15：叔叔開了賺錢的網路生意<br>　He started a lucrative online business, and later he sold part of the company on the stock market. | q13：主詞、情境、句型<br>q15：主詞、情境、句型 | 通過 |
| indebted | 農場兩次歉收後負債累累<br>　The farm became deeply indebted after two bad harvests. | q12：我深深感激老師的支持<br>　I am deeply indebted to my teacher for her support.<br>q15：叔叔一度負債<br>　A few years ago, my uncle's company had a big deficit, and he was heavily indebted for a while. | q12：主詞、情境、句型<br>q15：主詞、情境、句型 | 通過 |
| frugal | 節儉室友自己剪頭髮省錢<br>　My frugal roommate cuts his own hair to save money. | q11：奶奶很節儉從不丟舊衣<br>　My grandmother was very frugal and never threw away old clothes.<br>q15：阿姨是護理師仍很節儉<br>　My aunt is a nurse and is still very frugal. | q11：主詞、情境、句型<br>q15：主詞、情境、句型 | 通過 |
| stock market | 假日股市休市<br>　The stock market was closed for the holiday. | q15：叔叔把部分公司在股市賣出<br>　He started a lucrative online business, and later he sold part of the company on the stock market.<br>q16：爺爺每天早上看股市新聞<br>　My grandfather watches the stock market news every morning. / Every morning, my grandfather reads news about the stock market. | q15：主詞、情境、句型<br>q16：主詞、情境、句型 | 通過 |

同課題目互比（9 題；事件摘要逐題人工判定互不相同；腳本找「同目標字且主詞、句型都相同」的兩題：0 組）

| 題號 | 事件摘要 |
|---|---|
| q09 | mortgage：付房貸用掉我一半薪水（動名詞主詞） |
| q10 | deficit：市府預算赤字、延後蓋泳池 |
| q11 | frugal：奶奶很節儉從不丟舊衣 |
| q12 | indebted：我深深感激老師的支持 |
| q13 | lucrative：在車站旁賣咖啡很賺錢 |
| q14 | financially：她找到好工作後經濟獨立 |
| q15 | deficit：叔叔公司出現大赤字；wealthy：叔叔三十幾歲致富；mortgage：阿姨靠煮飯騎車提早還清房貸；financially：兩人都說經濟上過得不錯；lucrative：叔叔開了賺錢的網路生意；indebted：叔叔一度負債；frugal：阿姨是護理師仍很節儉；stock market：叔叔把部分公司在股市賣出 |
| q16 | stock market：爺爺每天早上看股市新聞 |
| q17 | wealthy：河邊富人區房子大／有錢鄰居開舊車 |

#### b2-u32-l01

| 目標字 | 單字卡情境 | 其他題情境 | 換了哪幾項 | 判定 |
|---|---|---|---|---|
| outlet | 品牌去年在台中開第一家暢貨店<br>　The brand opened its first outlet in Taichung last year. | q15：蘇小姐考慮在機場附近暢貨中心開分店<br>　Su is also thinking of opening a second shop in the new outlet mall near the airport, where customers can make a purchase online and collect it at the shop the same day.<br>q17：我在暢貨中心買便宜跑鞋／喜歡逛暢貨中心<br>　I bought cheap running shoes at an outlet near the highway. / I like shopping at the outlet mall because the prices are lower. | q15：主詞、情境、句型<br>q17：主詞、情境、句型 | 通過 |
| packet | 每包花種子五十元<br>　Each packet of flower seeds costs fifty dollars. | q15：一箱裝滿小包的茶<br>　One box was full of small packets of tea, which she had not ordered. | q15：主詞、情境、句型 | 通過 |
| unload | 卸下那艘船花了三小時<br>　It took three hours to unload the ship. | q09：工人每天早上在超市後面卸貨<br>　Workers unload the trucks at the back of the supermarket every morning.<br>q15：兒子幫她卸箱子<br>　Last month, a big order arrived on a Friday evening, and her son helped her unload the boxes. | q09：主詞、情境、句型<br>q15：主詞、情境、句型 | 通過 |
| stock | 店裡冬季外套庫存很多<br>　The shop keeps a large stock of winter coats. | q10：店員說夾克你的尺寸缺貨<br>　Sorry, that jacket is out of stock in your size, but we can order one for you.<br>q15：蘇小姐每週一檢查店裡存貨<br>　Su checks the stock in her small kitchen shop. | q10：主詞、情境、句型<br>q15：主詞、情境、句型 | 通過 |
| purchase | 想退貨請留好收據<br>　Please keep your receipt in case you want to return your purchase. | q14：在車站機器購買車票（動詞）<br>　You can purchase tickets from the machine at the station.<br>q15：顧客購買後當天取貨<br>　Su is also thinking of opening a second shop in the new outlet mall near the airport, where customers can make a purchase online and collect it at the shop the same day.<br>q16：這是我本月最貴的一筆購買<br>　This is my most expensive purchase this month. / This is the most expensive purchase I have made this month. | q14：主詞、情境、句型<br>q15：主詞、情境、句型<br>q16：主詞、情境、句型 | 通過 |
| import | 進口起司在這裡很貴（分詞形容詞）<br>　Imported cheese is quite expensive here. | q11：這國家進口最多的是石油<br>　The country imports more oil than any other product.<br>q15：鍋具刀具大多從日本進口<br>　Most of her pots and knives are imported from Japan, so shipping can take two weeks. | q11：主詞、情境、句型<br>q15：主詞、情境、句型 | 通過 |
| supplier | 餐廳上個月換了魚貨供應商<br>　The restaurant changed its fish supplier last month. | q13：主要紙張供應商漲價<br>　Our main supplier of paper raised its prices, so we are looking for a cheaper one.<br>q15：蘇小姐向供應商下單、打電話問茶<br>　If something is running low, she places an order with her supplier. / When she called the supplier, they told her to keep the tea as a gift. | q13：主詞、情境、句型<br>q15：主詞、情境、句型 | 通過 |
| shipping | 公司多付錢讓貨送更快<br>　The company pays extra for faster shipping. | q12：訂單滿千元免運<br>　Shipping is free for orders over one thousand dollars.<br>q15：日本來的貨運送要兩週<br>　Most of her pots and knives are imported from Japan, so shipping can take two weeks. | q12：主詞、情境、句型<br>q15：主詞、情境、句型 | 通過 |

同課題目互比（9 題；事件摘要逐題人工判定互不相同；腳本找「同目標字且主詞、句型都相同」的兩題：0 組）

| 題號 | 事件摘要 |
|---|---|
| q09 | unload：工人每天早上在超市後面卸貨 |
| q10 | stock：店員說夾克你的尺寸缺貨 |
| q11 | import：這國家進口最多的是石油 |
| q12 | shipping：訂單滿千元免運 |
| q13 | supplier：主要紙張供應商漲價 |
| q14 | purchase：在車站機器購買車票（動詞） |
| q15 | outlet：蘇小姐考慮在機場附近暢貨中心開分店；packet：一箱裝滿小包的茶；unload：兒子幫她卸箱子；stock：蘇小姐每週一檢查店裡存貨；purchase：顧客購買後當天取貨；import：鍋具刀具大多從日本進口；supplier：蘇小姐向供應商下單、打電話問茶；shipping：日本來的貨運送要兩週 |
| q16 | purchase：這是我本月最貴的一筆購買 |
| q17 | outlet：我在暢貨中心買便宜跑鞋／喜歡逛暢貨中心 |

#### b2-u33-l01

| 目標字 | 單字卡情境 | 其他題情境 | 換了哪幾項 | 判定 |
|---|---|---|---|---|
| recipe | 我照食譜做蛋糕還是失敗<br>　I followed the recipe exactly, but the cake still failed. | q11：這份鳳梨酥食譜用很少糖<br>　This recipe for pineapple cake uses very little sugar.<br>q14：外燴照奶奶食譜做菜<br>　A catering team cooked dishes from my grandmother's recipes, which my cousin had sent them a month before.<br>q15：請對方寄湯的食譜給我<br>　Could you send me the recipe for this soup? / Can you send me this soup's recipe? | q11：主詞、情境、句型<br>q14：主詞、情境、句型<br>q15：主詞、情境、句型 | 通過 |
| hospitality | 村民熱情款待請我們吃晚餐<br>　The villagers showed us great hospitality and invited us for dinner. | q08：很多餐旅業員工假日要上班<br>　Many hospitality workers have to work on holidays.<br>q13：她念餐旅管理、經營海邊飯店<br>　She studied hospitality management and now runs a hotel by the sea.<br>q14：老闆以熱情款待聞名<br>　The owners are famous for their hospitality: every guest was welcomed at the door with a smile. | q08：主詞、情境、句型<br>q13：主詞、情境、句型<br>q14：主詞、情境、句型 | 通過 |
| cocktail | 這杯雞尾酒用柳橙汁和檸檬調<br>　This cocktail is made with orange juice and lemon. | q14：調酒師調出繽紛雞尾酒<br>　Near the windows, a young bartender made colorful cocktails, and he also had fruit drinks for the children. | q14：主詞、情境、句型 | 通過 |
| bartender | 當調酒師常凌晨三點下班<br>　Working as a bartender, he often finishes work at three a.m. | q10：調酒師在飯店工作二十年<br>　The bartender has worked at this hotel for twenty years.<br>q14：年輕調酒師在窗邊調酒<br>　Near the windows, a young bartender made colorful cocktails, and he also had fruit drinks for the children. | q10：主詞、情境、句型<br>q14：主詞、情境、句型 | 通過 |
| nightclub | 阿姨三十年前在夜店認識姨丈<br>　My aunt met my uncle at a nightclub thirty years ago. | q14：表姊的朋友想去夜店<br>　After dinner, some of my cousin's friends wanted to go to a nightclub, but most guests stayed and danced in the garden. | q14：主詞、情境、句型 | 通過 |
| brewery | 啤酒廠開放導覽看釀造<br>　The brewery offers tours where visitors can see how beer is made. | q14：婚宴在老釀酒廠改的餐廳<br>　Last weekend, my cousin held her wedding party at an old brewery that has been turned into a restaurant.<br>q16：我參觀過德國老啤酒廠／鎮上小酒廠用米釀<br>　I once visited an old brewery in Germany with my friends. / There is a small brewery in my town that makes beer from local rice. | q14：主詞、情境、句型<br>q16：主詞、情境、句型 | 通過 |
| catering | 學校餐飲人員每天做八百份午餐<br>　The school's catering staff prepare eight hundred lunches a day. | q09：外燴公司中午送五十人午餐<br>　The catering company will bring lunch for fifty people to the meeting room at noon.<br>q12：音樂廳有自己的外燴服務<br>　The concert hall has its own catering service for parties after the show.<br>q14：外燴團隊照食譜做菜<br>　A catering team cooked dishes from my grandmother's recipes, which my cousin had sent them a month before. | q09：主詞、情境、句型<br>q12：主詞、情境、句型<br>q14：主詞、情境、句型 | 通過 |

同課題目互比（9 題；事件摘要逐題人工判定互不相同；腳本找「同目標字且主詞、句型都相同」的兩題：0 組）

| 題號 | 事件摘要 |
|---|---|
| q08 | hospitality：很多餐旅業員工假日要上班 |
| q09 | catering：外燴公司中午送五十人午餐 |
| q10 | bartender：調酒師在飯店工作二十年 |
| q11 | recipe：這份鳳梨酥食譜用很少糖 |
| q12 | catering：音樂廳有自己的外燴服務 |
| q13 | hospitality：她念餐旅管理、經營海邊飯店 |
| q14 | recipe：外燴照奶奶食譜做菜；hospitality：老闆以熱情款待聞名；cocktail：調酒師調出繽紛雞尾酒；bartender：年輕調酒師在窗邊調酒；nightclub：表姊的朋友想去夜店；brewery：婚宴在老釀酒廠改的餐廳；catering：外燴團隊照食譜做菜 |
| q15 | recipe：請對方寄湯的食譜給我 |
| q16 | brewery：我參觀過德國老啤酒廠／鎮上小酒廠用米釀 |

#### b2-u34-l01

| 目標字 | 單字卡情境 | 其他題情境 | 換了哪幾項 | 判定 |
|---|---|---|---|---|
| exotic | 餐廳菜單混合泰墨異國風味<br>　The restaurant's menu has an exotic mix of Thai and Mexican flavors. | q14：市場賣東南亞異國水果<br>　The market sells exotic fruits from Southeast Asia that I had never seen before.<br>q15：去印度洋異國小島度週年<br>　For our tenth wedding anniversary, my husband and I planned a trip to an exotic island in the Indian Ocean. | q14：主詞、情境、句型<br>q15：主詞、情境、句型 | 通過 |
| spa | 健行後在溫泉水療放鬆<br>　After the long hike, we relaxed at a hot spring spa. | q15：海灘小屋有自己的小水療池<br>　The manager apologized and moved us to a beach house with its own small spa, at no extra cost. | q15：主詞、情境、句型 | 通過 |
| route | 我們選海岸路線因為風景好<br>　We chose the coast route because the views are better. | q15：最便宜路線在新加坡停很久<br>　The cheapest route had a long stopover in Singapore, so we spent a night there and walked around the city.<br>q16：公車路線經過車站和醫院<br>　This bus route goes past the train station and the city hospital. / The route of this bus passes the train station and the city hospital. | q15：主詞、情境、句型<br>q16：主詞、情境、句型 | 通過 |
| landing | 降落後乘客鼓掌<br>　The passengers clapped after the landing. | q11：機長在強風中平穩降落<br>　The pilot made a smooth landing despite the strong wind.<br>q15：島上機場小、降落有點可怕<br>　The landing on the island was a little scary, because the airport is very small. | q11：主詞、情境、句型<br>q15：主詞、情境、句型 | 通過 |
| accommodation | 節慶期間在城裡很難找住處<br>　Finding accommodation in the city during the festival is very hard. | q13：團費含三星級飯店住宿<br>　The price of the tour includes the accommodation at a three-star hotel.<br>q15：住宿簡單但乾淨<br>　The accommodation was simple but clean, and the local hospitality made us feel at home.<br>q17：我旅行喜歡住車站附近／有廚房的住處<br>　I prefer cheap accommodation near the train station when I travel. / When I travel, I look for accommodation with a kitchen. | q13：主詞、情境、句型<br>q15：主詞、情境、句型<br>q17：主詞、情境、句型 | 通過 |
| stopover | 去倫敦途中在曼谷短暫停留<br>　We had a short stopover in Bangkok on the way to London. | q09：渡輪在小島短暫停靠<br>　The ferry makes a short stopover at a small island.<br>q15：最便宜路線在新加坡長時間停留<br>　The cheapest route had a long stopover in Singapore, so we spent a night there and walked around the city. | q09：主詞、情境、句型<br>q15：主詞、情境、句型 | 通過 |
| overbook | 航空公司有時超賣機位因有人不來<br>　Airlines sometimes overbook flights because some people don't show up. | q10：班機超賣、航空公司請改搭下午班（被動）<br>　Our flight was overbooked, so the airline asked us to take the next one in the afternoon.<br>q15：抵達發現飯店超賣<br>　When we arrived at the island, we found that our hotel was overbooked. | q10：主詞、情境、句型<br>q15：主詞、情境、句型 | 通過 |
| long-distance | 遠距離戀愛可能很辛苦<br>　Long-distance relationships can be difficult for young couples. | q12：長途客運票早訂比較便宜<br>　Long-distance bus tickets are cheaper if you book them early.<br>q15：長途飛行後決定下次近一點<br>　After so many long-distance flights, though, we promised that our next holiday would be closer to home. | q12：情境、句型<br>q15：主詞、情境、句型 | 通過 |

同課題目互比（9 題；事件摘要逐題人工判定互不相同；腳本找「同目標字且主詞、句型都相同」的兩題：0 組）

| 題號 | 事件摘要 |
|---|---|
| q09 | stopover：渡輪在小島短暫停靠 |
| q10 | overbook：班機超賣、航空公司請改搭下午班（被動） |
| q11 | landing：機長在強風中平穩降落 |
| q12 | long-distance：長途客運票早訂比較便宜 |
| q13 | accommodation：團費含三星級飯店住宿 |
| q14 | exotic：市場賣東南亞異國水果 |
| q15 | exotic：去印度洋異國小島度週年；spa：海灘小屋有自己的小水療池；route：最便宜路線在新加坡停很久；landing：島上機場小、降落有點可怕；accommodation：住宿簡單但乾淨；stopover：最便宜路線在新加坡長時間停留；overbook：抵達發現飯店超賣；long-distance：長途飛行後決定下次近一點 |
| q16 | route：公車路線經過車站和醫院 |
| q17 | accommodation：我旅行喜歡住車站附近／有廚房的住處 |

#### b2-u35-l01

| 目標字 | 單字卡情境 | 其他題情境 | 換了哪幾項 | 判定 |
|---|---|---|---|---|
| parade | 遊行因大雨取消（被動）<br>　The parade was cancelled because of the heavy rain. | q13：全鎮出來看新年遊行<br>　The whole town came out to watch the New Year parade.<br>q17：春季節慶以遊行開場、路線經過老市場<br>　It begins with a colorful parade, and the route goes through the old market. / This year, a famous actor from the world of showbiz led the parade. | q13：主詞、情境、句型<br>q17：主詞、情境、句型 | 通過 |
| rehearsal | 婚禮前還需要再排練一次<br>　We need one more rehearsal before the wedding. | q12：最後彩排六點開始、五點半到<br>　The final rehearsal starts at six, so please arrive at the theater by half past five.<br>q17：最後彩排時主唱失聲<br>　During the final rehearsal, the lead singer lost her voice, but she got better just in time. | q12：主詞、情境、句型<br>q17：主詞、情境、句型 | 通過 |
| recreation | 公園供各年齡的人休閒（被動）<br>　The park is used for recreation by people of all ages. | q17：鎮上開了家庭休閒中心<br>　This year, the town also opened a new recreation center for families.<br>q19：我週末游泳當休閒／最愛在公園看書<br>　For recreation, I usually go swimming on weekends. / My favorite form of recreation is reading in the park. | q17：主詞、情境、句型<br>q19：主詞、情境、句型 | 通過 |
| audition | 他第一次電視試鏡前很緊張<br>　He was nervous before his first audition for a TV show. | q15：只有三位舞者通過試鏡加入舞團<br>　Only three dancers passed the audition and joined the company.<br>q17：高中生一月辦試演<br>　They held auditions in January, and the cast practiced every weekend. | q15：主詞、情境、句型<br>q17：主詞、情境、句型 | 通過 |
| cast | 電影演員陣容有幾位大明星<br>　The cast of the movie includes several famous actors. | q14：她被選演學校話劇的皇后（動詞）<br>　She was cast as the queen in the school play.<br>q17：全體演員每週末練習<br>　They held auditions in January, and the cast practiced every weekend. | q14：主詞、情境、句型<br>q17：主詞、情境、句型 | 通過 |
| exhibit | 新手機六月會在科技展展出（被動）<br>　The new phone will be exhibited at the technology fair in June. | q11：罕見金色汽車在車站展出一週<br>　A rare golden car will be exhibited at the station for one week.<br>q17：藝術家在市政廳展出河景畫<br>　At the town hall, local artists exhibited paintings of the river, and at night there was a fireworks spectacle over the lake. | q11：主詞、情境<br>q17：主詞、情境、句型 | 通過 |
| spectacle | 數千隻鳥齊飛成了天空奇觀<br>　Thousands of birds flying together made a great spectacle in the sky. | q17：夜晚湖上煙火盛大場面<br>　At the town hall, local artists exhibited paintings of the river, and at night there was a fireworks spectacle over the lake. | q17：主詞、情境、句型 | 通過 |
| entertaining | 這本書有趣又有教育意義<br>　The book is both entertaining and educational. | q16：講者很有趣、一小時沒人看手機<br>　The speaker was so entertaining that nobody looked at their phones for an hour. | q16：主詞、情境、句型 | 通過 |
| prom | 學生常租西裝禮服參加舞會<br>　Students often rent suits and dresses for the prom. | q17：對青少年來說節慶比舞會更刺激<br>　For many teenagers, the festival is even more exciting than their prom.<br>q18：她和好友去參加畢業舞會<br>　She went to the prom with her best friend. / She and her best friend went to the prom together. | q17：主詞、情境、句型<br>q18：主詞、情境、句型 | 通過 |
| showbiz | 很多年輕人夢想進演藝圈<br>　Many young people dream of a career in showbiz. | q17：演藝圈知名演員帶領遊行<br>　This year, a famous actor from the world of showbiz led the parade. | q17：主詞、情境、句型 | 通過 |

同課題目互比（9 題；事件摘要逐題人工判定互不相同；腳本找「同目標字且主詞、句型都相同」的兩題：0 組）

| 題號 | 事件摘要 |
|---|---|
| q11 | exhibit：罕見金色汽車在車站展出一週 |
| q12 | rehearsal：最後彩排六點開始、五點半到 |
| q13 | parade：全鎮出來看新年遊行 |
| q14 | cast：她被選演學校話劇的皇后（動詞） |
| q15 | audition：只有三位舞者通過試鏡加入舞團 |
| q16 | entertaining：講者很有趣、一小時沒人看手機 |
| q17 | parade：春季節慶以遊行開場、路線經過老市場；rehearsal：最後彩排時主唱失聲；recreation：鎮上開了家庭休閒中心；audition：高中生一月辦試演；cast：全體演員每週末練習；exhibit：藝術家在市政廳展出河景畫；spectacle：夜晚湖上煙火盛大場面；prom：對青少年來說節慶比舞會更刺激；showbiz：演藝圈知名演員帶領遊行 |
| q18 | prom：她和好友去參加畢業舞會 |
| q19 | recreation：我週末游泳當休閒／最愛在公園看書 |

#### b2-u36-l01

| 目標字 | 單字卡情境 | 其他題情境 | 換了哪幾項 | 判定 |
|---|---|---|---|---|
| physician | 鎮上只有一位醫師、總是很忙<br>　The town has only one physician, so she is always busy. | q13：醫師每天早上幫奶奶檢查<br>　The physician checked her grandmother each morning, and a pharmacist explained her medicine to the family.<br>q14：她父親在鄉下行醫三十年<br>　Her father is a physician who has worked in the countryside for thirty years. / Her father has been a physician in the countryside for thirty years. | q13：主詞、情境、句型<br>q14：主詞、情境、句型 | 通過 |
| pharmacist | 我們的藥師會說三種語言<br>　Our pharmacist speaks English, Japanese and Chinese. | q07：街角藥局藥師認識附近每個人<br>　The pharmacist at the corner shop knows everyone in the neighborhood.<br>q13：藥師向家屬說明用藥<br>　The physician checked her grandmother each morning, and a pharmacist explained her medicine to the family.<br>q15：我家附近藥師每天七點開店／辦公室旁藥師很親切<br>　The pharmacist near my home opens her shop at seven every morning. / There is a friendly pharmacist at the shop next to my office. | q07：主詞、情境、句型<br>q13：主詞、情境、句型<br>q15：主詞、情境、句型 | 通過 |
| therapy | 他每週二放學後上語言治療<br>　He goes to speech therapy every Tuesday after school. | q09：醫院週三下午有藝術治療課<br>　The hospital offers art therapy classes on Wednesday afternoons.<br>q13：奶奶的治療花了三個月<br>　The therapy took three months, and it was slow and tiring, but the therapist always made the exercises entertaining. | q09：主詞、情境、句型<br>q13：主詞、情境、句型 | 通過 |
| therapist | 好治療師仔細傾聽、不嘲笑你的問題<br>　A good therapist listens carefully and never laughs at your problems. | q10：表哥在運動中心當物理治療師<br>　My cousin works as a physical therapist at a sports center.<br>q13：治療師幫奶奶重新走路<br>　But Amy was most interested in the therapist who helped her grandmother walk again. / The therapy took three months, and it was slow and tiring, but the therapist always made the exercises entertaining. / Today, Amy is studying to become a therapist herself. | q10：主詞、情境、句型<br>q13：主詞、情境、句型 | 通過 |
| vaccine | 第一種疫苗兩百多年前就有了<br>　The first vaccine was made more than two hundred years ago. | q11：疫苗要冷藏、運送卡車有冰箱<br>　The vaccine must be kept cold, so the truck that carries it has a fridge.<br>q13：班級參觀研發疫苗的實驗室<br>　Last week, her class visited a lab where scientists are developing a new vaccine, and Amy said it was the most interesting day of the year. | q11：主詞、情境、句型<br>q13：主詞、情境、句型 | 通過 |
| hospitalize | 這裡住院的病人大多住不到三天<br>　Most patients who are hospitalized here stay for less than three days. | q08：經理住院兩天、會議延期<br>　Our manager was hospitalized for two days, so the meeting has been moved to next Monday.<br>q12：去年冬天鎮上兩百人因流感住院<br>　Last winter, about two hundred people in our town were hospitalized because of the flu.<br>q13：奶奶跌倒後住院<br>　When Amy was twelve, her grandmother was hospitalized after a fall. | q08：主詞、情境、句型<br>q12：主詞、情境、句型<br>q13：主詞、情境、句型 | 通過 |

同課題目互比（9 題；事件摘要逐題人工判定互不相同；腳本找「同目標字且主詞、句型都相同」的兩題：0 組）

| 題號 | 事件摘要 |
|---|---|
| q07 | pharmacist：街角藥局藥師認識附近每個人 |
| q08 | hospitalize：經理住院兩天、會議延期 |
| q09 | therapy：醫院週三下午有藝術治療課 |
| q10 | therapist：表哥在運動中心當物理治療師 |
| q11 | vaccine：疫苗要冷藏、運送卡車有冰箱 |
| q12 | hospitalize：去年冬天鎮上兩百人因流感住院 |
| q13 | physician：醫師每天早上幫奶奶檢查；pharmacist：藥師向家屬說明用藥；therapy：奶奶的治療花了三個月；therapist：治療師幫奶奶重新走路；vaccine：班級參觀研發疫苗的實驗室；hospitalize：奶奶跌倒後住院 |
| q14 | physician：她父親在鄉下行醫三十年 |
| q15 | pharmacist：我家附近藥師每天七點開店／辦公室旁藥師很親切 |

#### b2-u36-l02

| 目標字 | 單字卡情境 | 其他題情境 | 換了哪幾項 | 判定 |
|---|---|---|---|---|
| hospice | 安寧機構有安靜花園供家人坐<br>　The hospice has a quiet garden where families can sit together. | q13：姊姊下午到隔壁安寧機構念書放音樂<br>　In the afternoon, she visits a hospice next door, where she reads books and plays music for the people who stay there. | q13：主詞、情境、句型 | 通過 |
| paramedic | 急救人員受訓在送醫前救人<br>　Paramedics are trained to help people before they reach the hospital. | q07：打電話後五分鐘急救人員就到<br>　The paramedics arrived only five minutes after we called.<br>q13：姊姊從護理師和急救人員學醫療知識<br>　She has learned a lot about health care from the nurses and paramedics she meets there. | q07：情境、句型<br>q13：主詞、情境、句型 | 通過 |
| outpatient | 多數門診病人當天回家<br>　Most outpatients go home on the same day. | q09：門診平日八點到五點<br>　The outpatient clinic is open from eight to five on weekdays.<br>q13：姊姊早上在門診區指路<br>　In the morning, she helps in the outpatient area, showing people where to go for blood tests or an X-ray. | q09：情境、句型<br>q13：主詞、情境、句型 | 通過 |
| antivirus | 很多防毒軟體家用免費<br>　Many antivirus programs are free for home users. | q08：電腦變慢今晚用防毒軟體檢查<br>　My computer is running slowly, so I'll check it with my antivirus program tonight.<br>q11：防毒程式在郵件裡找到病毒並刪除<br>　The antivirus program found a virus in the email and removed it.<br>q13：姊姊提醒員工更新防毒軟體<br>　The hospital's computers were once attacked by a virus, so now my sister also reminds the staff to update their antivirus software. | q08：主詞、情境、句型<br>q11：情境、句型<br>q13：主詞、情境、句型 | 通過 |
| health care | 很多國家醫療費用上升<br>　The cost of health care has risen in many countries. | q10：阿姨在醫療業工作二十多年<br>　My aunt has worked in health care for over twenty years.<br>q12：員工和子女享免費醫療<br>　Workers at the company get free health care for themselves and their children.<br>q13：姊姊學到很多醫療照護知識<br>　She has learned a lot about health care from the nurses and paramedics she meets there.<br>q15：好的醫療應離住家近／鎮上診所多<br>　I think good health care should be close to where people live. / In my town, health care is easy to get because there are many clinics. | q10：主詞、情境、句型<br>q12：主詞、情境、句型<br>q13：主詞、情境、句型<br>q15：主詞、情境、句型 | 通過 |
| x-ray | 機場用X光機檢查行李<br>　Airports use X-ray machines to check bags. | q13：姊姊指引民眾去照X光<br>　In the morning, she helps in the outpatient area, showing people where to go for blood tests or an X-ray.<br>q14：科學家用 X 光發現畫底下另一幅畫<br>　Scientists used X-rays to find another painting under this one. / With X-rays, scientists found a second painting under this one. | q13：主詞、情境、句型<br>q14：主詞、情境、句型 | 通過 |

同課題目互比（9 題；事件摘要逐題人工判定互不相同；腳本找「同目標字且主詞、句型都相同」的兩題：0 組）

| 題號 | 事件摘要 |
|---|---|
| q07 | paramedic：打電話後五分鐘急救人員就到 |
| q08 | antivirus：電腦變慢今晚用防毒軟體檢查 |
| q09 | outpatient：門診平日八點到五點 |
| q10 | health care：阿姨在醫療業工作二十多年 |
| q11 | antivirus：防毒程式在郵件裡找到病毒並刪除 |
| q12 | health care：員工和子女享免費醫療 |
| q13 | hospice：姊姊下午到隔壁安寧機構念書放音樂；paramedic：姊姊從護理師和急救人員學醫療知識；outpatient：姊姊早上在門診區指路；antivirus：姊姊提醒員工更新防毒軟體；health care：姊姊學到很多醫療照護知識；x-ray：姊姊指引民眾去照X光 |
| q14 | x-ray：科學家用 X 光發現畫底下另一幅畫 |
| q15 | health care：好的醫療應離住家近／鎮上診所多 |

#### b2-u37-l01

| 目標字 | 單字卡情境 | 其他題情境 | 換了哪幾項 | 判定 |
|---|---|---|---|---|
| residence | 他們新住所在安靜大樓十樓<br>　Their new residence is on the tenth floor of a quiet building. | q12：作家故居現在是小博物館<br>　The writer's former residence is now a small museum about his life.<br>q13：Jason 希望下個住處離公司近<br>　Although he likes the apartment, he hopes his next residence will be a little closer to his office. | q12：主詞、情境、句型<br>q13：主詞、情境、句型 | 通過 |
| rental | 大學附近租金很高<br>　Rental prices near the university are very high. | q10：早一週訂租車比較便宜<br>　Car rental is cheaper if you book it a week ahead.<br>q13：Jason 買不起房所以找出租房<br>　When Jason moved to the city for work, he could not afford to buy a home, so he looked for a rental. | q10：主詞、情境、句型<br>q13：主詞、情境、句型 | 通過 |
| lease | 租約不准養寵物<br>　The lease does not allow pets in the apartment. | q08：租約三月到期、要找新公寓<br>　Our lease ends in March, so we need to find a new apartment soon.<br>q13：Jason 簽了一年租約<br>　He found a small apartment next to an outpatient clinic and signed a one-year lease.<br>q14：我們打算租約再延一年<br>　We plan to extend the lease for another year. / We are going to extend our lease for one more year. | q08：主詞、情境、句型<br>q13：主詞、情境、句型<br>q14：主詞、情境、句型 | 通過 |
| plumber | 水電工二十分鐘修好淋浴<br>　The plumber fixed the shower in twenty minutes. | q07：水電工光上門就收五十元<br>　The plumber charged us fifty dollars just to come to the house.<br>q13：Jason 今年叫了三次水電工<br>　However, the pipes are very old, and Jason has called the plumber three times this year.<br>q15：去年冬天水槽塞住請水電工／水槽下漏水要請水電工<br>　We needed a plumber last winter because the kitchen sink was blocked. / I need a plumber because water is coming out from under the sink. | q07：情境、句型<br>q13：主詞、情境、句型<br>q15：主詞、情境、句型 | 通過 |
| plot | 他們在湖邊一塊地蓋房子<br>　They are building a house on a plot near the lake. | q09：新區每塊地約一個網球場大<br>　Each plot in this new area is about the size of a tennis court.<br>q13：大樓後面有塊地讓房客種菜<br>　Behind the building, there is a small plot of land where people who live there can grow vegetables, and Jason enjoys gardening after work. | q09：主詞、情境、句型<br>q13：主詞、情境、句型 | 通過 |
| mansion | 只有很有錢的人買得起這區豪宅<br>　Only the very rich can afford a mansion in this area. | q11：知名歌手住十二房大豪宅<br>　The famous singer lives in a huge mansion with twelve bedrooms and a pool.<br>q13：大樓以前是有錢人家的宅邸<br>　The building was once a rich family's mansion, and it still has beautiful old windows. | q11：主詞、情境、句型<br>q13：主詞、情境、句型 | 通過 |

同課題目互比（9 題；事件摘要逐題人工判定互不相同；腳本找「同目標字且主詞、句型都相同」的兩題：0 組）

| 題號 | 事件摘要 |
|---|---|
| q07 | plumber：水電工光上門就收五十元 |
| q08 | lease：租約三月到期、要找新公寓 |
| q09 | plot：新區每塊地約一個網球場大 |
| q10 | rental：早一週訂租車比較便宜 |
| q11 | mansion：知名歌手住十二房大豪宅 |
| q12 | residence：作家故居現在是小博物館 |
| q13 | residence：Jason 希望下個住處離公司近；rental：Jason 買不起房所以找出租房；lease：Jason 簽了一年租約；plumber：Jason 今年叫了三次水電工；plot：大樓後面有塊地讓房客種菜；mansion：大樓以前是有錢人家的宅邸 |
| q14 | lease：我們打算租約再延一年 |
| q15 | plumber：去年冬天水槽塞住請水電工／水槽下漏水要請水電工 |

#### b2-u37-l02

| 目標字 | 單字卡情境 | 其他題情境 | 換了哪幾項 | 判定 |
|---|---|---|---|---|
| terrace | 我們在露台種番茄香草<br>　We grow tomatoes and herbs on our terrace. | q09：在露台吃早餐看日出<br>　We had breakfast on the terrace and watched the sun rise.<br>q13：別墅大露台看山谷、阿姨喝茶<br>　The villa has a big terrace with a view of the valley, and my aunt loves drinking tea there. | q09：情境、句型<br>q13：主詞、情境、句型 | 通過 |
| belongings | 參觀者進場前把隨身物品寄放服務台<br>　Visitors must leave their belongings at the front desk before entering. | q07：下火車請帶走隨身物品（祈使）<br>　Please take all your belongings with you when you leave the train.<br>q11：小偷偷走我的護照手機等財物<br>　The thief took all my belongings, including my passport and my phone.<br>q13：阿姨花三天打包物品<br>　Moving was hard work: it took three days to pack all her belongings. | q07：主詞、情境、句型<br>q11：主詞、情境、句型<br>q13：主詞、情境、句型 | 通過 |
| villa | 夏天在海邊租小別墅<br>　They rented a small villa by the sea for the summer. | q13：阿姨搬進山上老別墅<br>　Last month, my aunt sold her apartment in the city and moved into an old villa in the hills. / The villa has a big terrace with a view of the valley, and my aunt loves drinking tea there. | q13：主詞、情境、句型 | 通過 |
| compulsory | 新員工必須參加安全訓練<br>　Attending the safety training is compulsory for all new workers. | q10：這條自行車道一定要戴安全帽<br>　Wearing a helmet is compulsory on this bike path.<br>q12：英文是必修科目<br>　In this school, English is a compulsory subject, so every student must take it.<br>q13：山上垃圾分類是強制的<br>　In the hills, sorting trash is compulsory, so my aunt now does it carefully. | q10：主詞、情境、句型<br>q12：主詞、情境、句型<br>q13：主詞、情境、句型 | 通過 |
| landlady | 女房東把房租調高百分之五<br>　The landlady raised our rent by five percent. | q08：女房東說可粉刷不能釘釘子<br>　Our landlady said we can paint the walls, but we must not put nails in them.<br>q13：學生時代的女房東來幫忙搬家<br>　Her landlady from her student days, Mrs.<br>q15：我的女房東很好／第一位女房東送餅乾<br>　My landlady is very kind and fixes things quickly. / My first landlady lived downstairs and often gave me cookies. | q08：情境、句型<br>q13：情境、句型<br>q15：情境、句型 | 通過 |
| real estate | 市中心房價持續上漲<br>　Real estate prices in the city center keep rising. | q13：從事房地產的朋友幫她找房<br>　A friend who works in real estate helped her find it.<br>q14：他在房地產公司工作十年<br>　He worked for a real estate company for ten years. / He has worked at a real estate company for ten years. | q13：主詞、情境、句型<br>q14：主詞、情境、句型 | 通過 |

同課題目互比（9 題；事件摘要逐題人工判定互不相同；腳本找「同目標字且主詞、句型都相同」的兩題：0 組）

| 題號 | 事件摘要 |
|---|---|
| q07 | belongings：下火車請帶走隨身物品（祈使） |
| q08 | landlady：女房東說可粉刷不能釘釘子 |
| q09 | terrace：在露台吃早餐看日出 |
| q10 | compulsory：這條自行車道一定要戴安全帽 |
| q11 | belongings：小偷偷走我的護照手機等財物 |
| q12 | compulsory：英文是必修科目 |
| q13 | terrace：別墅大露台看山谷、阿姨喝茶；belongings：阿姨花三天打包物品；villa：阿姨搬進山上老別墅；compulsory：山上垃圾分類是強制的；landlady：學生時代的女房東來幫忙搬家；real estate：從事房地產的朋友幫她找房 |
| q14 | real estate：他在房地產公司工作十年 |
| q15 | landlady：我的女房東很好／第一位女房東送餅乾 |

#### b2-u38-l01

| 目標字 | 單字卡情境 | 其他題情境 | 換了哪幾項 | 判定 |
|---|---|---|---|---|
| utility | 水電等公用事業費含在房租裡（被動）<br>　Utilities such as water and electricity are included in the rent. | q14：水電費是紙廠最大開銷<br>　Because manufacturing needs a lot of water and power, utility bills are the mill's biggest cost. | q14：主詞、情境、句型 | 通過 |
| inspector | 查票員要看我們的車票<br>　The ticket inspector asked to see our train tickets. | q09：建築檢查員週二來看新房子<br>　A building inspector will come on Tuesday to check our new house.<br>q14：紙廠經理當年以年輕檢查員身分來鎮上<br>　The mill's manager first came to the town as a young inspector who checked the quality of its paper.<br>q15：叔叔當了二十年警察督察<br>　My uncle has been a police inspector for twenty years. / My uncle worked as a police inspector for twenty years. | q09：主詞、情境、句型<br>q14：主詞、情境、句型<br>q15：主詞、情境、句型 | 通過 |
| component | 公司生產電動車零件<br>　The company makes components for electric cars. | q12：少一個小零件機器無法啟動<br>　One small component was missing, so the machine would not start.<br>q14：新老闆用高品質零件的機器<br>　The new owners replaced the old machines with modern ones made of high-quality components. | q12：主詞、情境、句型<br>q14：主詞、情境、句型 | 通過 |
| manufacturer | 廠商召回數千支電池有問題的手機<br>　The manufacturer recalled thousands of phones with a battery problem. | q10：這家車廠大多在墨西哥造車<br>　This car manufacturer builds most of its cars in Mexico.<br>q14：紙廠被日本大廠商買下（被動）<br>　Later, the mill was bought by a large manufacturer from Japan.<br>q16：我的筆電是台灣廠商做的／家附近玩具廠<br>　My laptop was made by a manufacturer in Taiwan. / There is a toy manufacturer near my home that makes wooden toys. | q10：主詞、情境、句型<br>q14：主詞、情境、句型<br>q16：主詞、情境、句型 | 通過 |
| manufacturing | 她大半輩子在製造業工作<br>　She has worked in manufacturing for most of her life. | q11：製造業仍是鎮上經濟重要部分<br>　Manufacturing is still an important part of the town's economy.<br>q14：製造業需要大量水電<br>　Because manufacturing needs a lot of water and power, utility bills are the mill's biggest cost. | q11：主詞、情境、句型<br>q14：主詞、情境、句型 | 通過 |
| output | 乾旱讓農場稻米產量下降<br>　The farm's output of rice fell because of the dry weather. | q08：工廠買新機器後產量增加兩成<br>　The factory's output rose by twenty percent after it bought new machines.<br>q13：作家四十年寫八十多本書、產量驚人<br>　The writer's output is amazing: more than eighty books in forty years.<br>q14：四十年前紙廠產量大到每天火車運紙<br>　Forty years ago, its output was so large that trains carried paper from the town every day. | q08：主詞、情境、句型<br>q13：主詞、情境、句型<br>q14：主詞、情境、句型 | 通過 |
| mill | 河邊老磨坊曾為全村磨麵粉<br>　The old mill by the river once made flour for the whole village. | q14：紙廠一百多年來是鎮上最大僱主<br>　For over a century, the paper mill was the biggest employer in our town. / Later, the mill was bought by a large manufacturer from Japan. / The mill's manager first came to the town as a young inspector who checked the quality of its paper. / Because manufacturing needs a lot of water and power, utility bills are the mill's biggest cost. / Some people wanted to sell the land for real estate, but the town decided to keep the mill and the jobs it brings. | q14：主詞、情境、句型 | 通過 |

同課題目互比（9 題；事件摘要逐題人工判定互不相同；腳本找「同目標字且主詞、句型都相同」的兩題：0 組）

| 題號 | 事件摘要 |
|---|---|
| q08 | output：工廠買新機器後產量增加兩成 |
| q09 | inspector：建築檢查員週二來看新房子 |
| q10 | manufacturer：這家車廠大多在墨西哥造車 |
| q11 | manufacturing：製造業仍是鎮上經濟重要部分 |
| q12 | component：少一個小零件機器無法啟動 |
| q13 | output：作家四十年寫八十多本書、產量驚人 |
| q14 | utility：水電費是紙廠最大開銷；inspector：紙廠經理當年以年輕檢查員身分來鎮上；component：新老闆用高品質零件的機器；manufacturer：紙廠被日本大廠商買下（被動）；manufacturing：製造業需要大量水電；output：四十年前紙廠產量大到每天火車運紙；mill：紙廠一百多年來是鎮上最大僱主 |
| q15 | inspector：叔叔當了二十年警察督察 |
| q16 | manufacturer：我的筆電是台灣廠商做的／家附近玩具廠 |

#### b2-u38-l02

| 目標字 | 單字卡情境 | 其他題情境 | 換了哪幾項 | 判定 |
|---|---|---|---|---|
| manufacture | 製造玻璃需要很高溫（名詞）<br>　The manufacture of glass needs very high temperatures. | q07：公司在台中小工廠製造腳踏車<br>　This company manufactures bicycles in a small factory in Taichung.<br>q13：現在窗戶多在工廠製造（被動）<br>　He told us that most windows today are manufactured in factories, because the work has been mechanized.<br>q15：我手機在越南製造／爺爺在小工坊製造家具<br>　My phone was manufactured in a factory in Vietnam. / My grandfather manufactured furniture in a small workshop. | q07：主詞、情境、句型<br>q13：主詞、情境、句型<br>q15：主詞、情境、句型 | 通過 |
| rusty | 我在花園找到生鏽舊鑰匙<br>　I found a rusty old key in the garden. | q08：我十年沒說法文、變生疏<br>　My French is a bit rusty, because I haven't spoken it for ten years.<br>q12：舊腳踏車鏽到鏈條不動<br>　The old bicycle was so rusty that the chain would not move.<br>q13：大門生鏽、爸爸手藝生疏<br>　The stonework was in good shape, but the iron gate was rusty and the windows were broken. / My father also wanted to help, but his skills were rusty, so he mostly made coffee for everyone. | q08：主詞、情境、句型<br>q12：主詞、情境、句型<br>q13：主詞、情境、句型 | 通過 |
| craftsman | 每個碗都由熟練工匠製作（被動）<br>　Each bowl is made by a skilled craftsman. | q11：工匠花三個月手雕木門<br>　The craftsman spent three months carving the wooden door by hand.<br>q13：爸爸請當地工匠手工做窗戶<br>　My father hired a local craftsman who still makes windows by hand, the old way.<br>q14：村裡工匠常受邀出國教課<br>　The craftsman in the village is often invited to teach abroad. / The village craftsman is often asked to teach in other countries. | q11：主詞、情境、句型<br>q13：主詞、情境、句型<br>q14：主詞、情境、句型 | 通過 |
| workman | 工人在新馬路畫白線<br>　A workman painted the white lines on the new road. | q09：兩個工人今天在修屋頂<br>　Two workmen are repairing the roof of our building today.<br>q13：兩名工人幫工匠一個月<br>　Two workmen helped him for a month. | q09：情境、句型<br>q13：情境、句型 | 通過 |
| mechanize | 公司打算明年把包裝線機械化<br>　The company plans to mechanize its packing line next year. | q10：農場機械化後需要的工人變少（被動）<br>　The farm was mechanized, so it needed only a few workers.<br>q13：工匠說這種工作已經機械化<br>　He told us that most windows today are manufactured in factories, because the work has been mechanized. | q10：主詞、情境、句型<br>q13：主詞、情境、句型 | 通過 |
| stonework | 教堂以美麗石造工藝聞名<br>　The church is famous for its beautiful stonework. | q13：石屋的石造部分狀況良好<br>　The stonework was in good shape, but the iron gate was rusty and the windows were broken. | q13：主詞、情境、句型 | 通過 |

同課題目互比（9 題；事件摘要逐題人工判定互不相同；腳本找「同目標字且主詞、句型都相同」的兩題：0 組）

| 題號 | 事件摘要 |
|---|---|
| q07 | manufacture：公司在台中小工廠製造腳踏車 |
| q08 | rusty：我十年沒說法文、變生疏 |
| q09 | workman：兩個工人今天在修屋頂 |
| q10 | mechanize：農場機械化後需要的工人變少（被動） |
| q11 | craftsman：工匠花三個月手雕木門 |
| q12 | rusty：舊腳踏車鏽到鏈條不動 |
| q13 | manufacture：現在窗戶多在工廠製造（被動）；rusty：大門生鏽、爸爸手藝生疏；craftsman：爸爸請當地工匠手工做窗戶；workman：兩名工人幫工匠一個月；mechanize：工匠說這種工作已經機械化；stonework：石屋的石造部分狀況良好 |
| q14 | craftsman：村裡工匠常受邀出國教課 |
| q15 | manufacture：我手機在越南製造／爺爺在小工坊製造家具 |

#### b2-u39-l01

| 目標字 | 單字卡情境 | 其他題情境 | 換了哪幾項 | 判定 |
|---|---|---|---|---|
| hardware | 軟體免費但要買新硬體才能跑<br>　The software is free, but you need to buy new hardware to run it. | q15：社員用便宜硬體做機器人<br>　Then we built a small robot with cheap hardware and components from an electronics shop. | q15：主詞、情境、句型 | 通過 |
| interactive | 老師用互動影片讓學生有興趣<br>　The teacher uses interactive videos to keep students interested. | q09：博物館互動室小孩可摸所有東西<br>　The museum has an interactive room where children can touch everything.<br>q15：程式設計師教做簡單互動遊戲<br>　Last month, a programmer from a local company came to teach us how to make a simple interactive game. | q09：主詞、情境、句型<br>q15：主詞、情境、句型 | 通過 |
| microwave | 辦公室微波爐午餐時間總是很忙<br>　Our office microwave is always busy at lunchtime. | q10：別把金屬盤放微波爐（祈使）<br>　Please don't put metal plates in the microwave; use the glass ones instead.<br>q16：我用微波爐加熱昨天的菜<br>　I heated yesterday's food in the microwave. / I warmed up yesterday's dinner in the microwave. | q10：主詞、情境、句型<br>q16：主詞、情境、句型 | 通過 |
| programmer | 好的程式設計師常花幾小時找一個錯<br>　Good programmers often spend hours finding a single mistake. | q11：哥哥在遊戲公司當程式設計師<br>　My brother works as a programmer for a game company.<br>q15：程式設計師來社團教課<br>　Last month, a programmer from a local company came to teach us how to make a simple interactive game. | q11：主詞、情境、句型<br>q15：主詞、情境、句型 | 通過 |
| spreadsheet | 她做試算表規劃婚禮賓客桌次<br>　She made a spreadsheet to plan the wedding guests and tables. | q13：我把學生成績放進試算表比較<br>　I put all the students' test scores in a spreadsheet so I can compare them.<br>q15：老師用試算表記社團的錢<br>　Our teacher keeps track of the club's money in a spreadsheet, and she was happy that every part cost less than expected. | q13：主詞、情境、句型<br>q15：主詞、情境、句型 | 通過 |
| electrician | 電工修好牆後的電線<br>　The electrician fixed the wires behind the wall. | q12：表哥在夜校學當電工<br>　My cousin is learning to be an electrician at a night school.<br>q15：接錯線燈全熄、學校電工來幫忙<br>　One student connected the wrong cable, and all the lights in the room went out, so the school electrician had to help us. | q12：主詞、情境、句型<br>q15：主詞、情境、句型 | 通過 |
| user | 網站要每位使用者設密碼<br>　The website asks every user to choose a password. | q14：新手機連第一次使用的人都好用<br>　The new phone is easy to use, even for a first-time user.<br>q15：五十多位使用者玩過我們的遊戲<br>　Over fifty users have already played our game online. | q14：主詞、情境、句型<br>q15：主詞、情境、句型 | 通過 |
| telescope | 博物館的舊望遠鏡屬於知名科學家<br>　The old telescope in the museum belonged to a famous scientist. | q15：晚上在屋頂用望遠鏡看月亮<br>　At night, we sometimes look at the moon through a telescope on the roof.<br>q17：我想買小望遠鏡賞鳥／想看星星<br>　I want to buy a small telescope to watch birds. / I would like to look at the stars through a big telescope. | q15：主詞、情境、句型<br>q17：主詞、情境、句型 | 通過 |

同課題目互比（9 題；事件摘要逐題人工判定互不相同；腳本找「同目標字且主詞、句型都相同」的兩題：0 組）

| 題號 | 事件摘要 |
|---|---|
| q09 | interactive：博物館互動室小孩可摸所有東西 |
| q10 | microwave：別把金屬盤放微波爐（祈使） |
| q11 | programmer：哥哥在遊戲公司當程式設計師 |
| q12 | electrician：表哥在夜校學當電工 |
| q13 | spreadsheet：我把學生成績放進試算表比較 |
| q14 | user：新手機連第一次使用的人都好用 |
| q15 | hardware：社員用便宜硬體做機器人；interactive：程式設計師教做簡單互動遊戲；programmer：程式設計師來社團教課；spreadsheet：老師用試算表記社團的錢；electrician：接錯線燈全熄、學校電工來幫忙；user：五十多位使用者玩過我們的遊戲；telescope：晚上在屋頂用望遠鏡看月亮 |
| q16 | microwave：我用微波爐加熱昨天的菜 |
| q17 | telescope：我想買小望遠鏡賞鳥／想看星星 |

#### b2-u39-l02

| 目標字 | 單字卡情境 | 其他題情境 | 換了哪幾項 | 判定 |
|---|---|---|---|---|
| laser | 雷射切金屬像切紙<br>　The laser cuts metal as easily as paper. | q09：老師用雷射光指螢幕上的地圖<br>　The teacher used a laser light to point at the map on the screen.<br>q15：攤位賣幾秒量好房間的雷射工具<br>　Another stand sold laser tools that measure a room in seconds.<br>q17：我看過演唱會雷射秀／店家用雷射把名字刻在木牌<br>　I saw an amazing laser show at a concert last year. / The shop used a laser to cut my name into a wooden sign. | q09：主詞、情境、句型<br>q15：主詞、情境、句型<br>q17：主詞、情境、句型 | 通過 |
| programming | 很多小學現在教程式設計（被動）<br>　Programming is now taught in many primary schools. | q11：這城市程式設計工作薪水高<br>　Jobs in programming are well-paid in this city.<br>q15：小孩可上簡短程式課讓機器人跳舞<br>　Children could join a short programming class and make a robot dance. | q11：主詞、情境、句型<br>q15：主詞、情境、句型 | 通過 |
| radar | 警察用雷達抓超速<br>　The police use radar to catch drivers who go too fast. | q12：船在濃霧中用雷達找路<br>　Ships use radar to find their way in thick fog.<br>q15：氣象雷達追蹤幾百公里外暴風雨<br>　A company that makes weather radar explained how it can follow storms from hundreds of kilometers away. | q12：主詞、情境<br>q15：主詞、情境、句型 | 通過 |
| thermometer | 魚缸裡的溫度計顯示水溫<br>　A thermometer in the fish tank tells us if the water is warm enough. | q10：外面溫度計兩度、穿最暖外套<br>　The thermometer outside shows only two degrees, so wear your warmest coat.<br>q15：我買了廚房用智慧溫度計<br>　I also bought a smart thermometer for my kitchen. | q10：情境、句型<br>q15：主詞、情境、句型 | 通過 |
| transistor | 現代晶片有幾十億個電晶體<br>　A modern computer chip has billions of transistors. | q13：第一台電晶體收音機小到能放口袋<br>　The first transistor radio was small enough to carry in a pocket.<br>q15：廠商展示奈米技術做的微小電晶體<br>　At the first stand, a manufacturer showed a tiny transistor made with nano technology, so small that we needed a special camera to see it. | q13：主詞、情境、句型<br>q15：主詞、情境、句型 | 通過 |
| antistatic | 工廠工人穿抗靜電衣服<br>　Workers in the factory wear antistatic clothes. | q14：電腦零件裝在抗靜電袋<br>　Computer parts are packed in antistatic bags to protect them from electricity.<br>q15：參觀者摸零件前要戴抗靜電手套<br>　Visitors had to wear antistatic gloves before touching the components on display. | q14：主詞、情境、句型<br>q15：主詞、情境、句型 | 通過 |
| nano | 奈米材料可比頭髮薄幾千倍<br>　Nano materials can be thousands of times thinner than a hair. | q15：電晶體用奈米技術製成<br>　At the first stand, a manufacturer showed a tiny transistor made with nano technology, so small that we needed a special camera to see it. | q15：主詞、情境、句型 | 通過 |
| virtual reality | 飛行員先用虛擬實境練習<br>　Some pilots now practice in virtual reality before they fly real planes. | q15：我玩虛擬實境遊戲在月球散步<br>　Next, I tried a virtual reality game in which I walked on the moon.<br>q16：博物館用虛擬實境讓遊客看古城<br>　This museum uses virtual reality to show visitors ancient cities. / The museum lets visitors see an ancient city through virtual reality. | q15：主詞、情境、句型<br>q16：主詞、情境、句型 | 通過 |

同課題目互比（9 題；事件摘要逐題人工判定互不相同；腳本找「同目標字且主詞、句型都相同」的兩題：0 組）

| 題號 | 事件摘要 |
|---|---|
| q09 | laser：老師用雷射光指螢幕上的地圖 |
| q10 | thermometer：外面溫度計兩度、穿最暖外套 |
| q11 | programming：這城市程式設計工作薪水高 |
| q12 | radar：船在濃霧中用雷達找路 |
| q13 | transistor：第一台電晶體收音機小到能放口袋 |
| q14 | antistatic：電腦零件裝在抗靜電袋 |
| q15 | laser：攤位賣幾秒量好房間的雷射工具；programming：小孩可上簡短程式課讓機器人跳舞；radar：氣象雷達追蹤幾百公里外暴風雨；thermometer：我買了廚房用智慧溫度計；transistor：廠商展示奈米技術做的微小電晶體；antistatic：參觀者摸零件前要戴抗靜電手套；nano：電晶體用奈米技術製成；virtual reality：我玩虛擬實境遊戲在月球散步 |
| q16 | virtual reality：博物館用虛擬實境讓遊客看古城 |
| q17 | laser：我看過演唱會雷射秀／店家用雷射把名字刻在木牌 |

#### b2-u40-l01

| 目標字 | 單字卡情境 | 其他題情境 | 換了哪幾項 | 判定 |
|---|---|---|---|---|
| innovative | 她創新的教法讓數學變有趣<br>　Her innovative teaching methods make math fun. | q16：公司以創新產品聞名、像可折手機<br>　The company is famous for its innovative products, such as a phone that folds like paper.<br>q17：雜誌稱機器人是年度最創新設計<br>　Many experts praised the robot's originality, and a magazine called it one of the most innovative designs of the year. | q16：主詞、情境、句型<br>q17：主詞、情境、句型 | 通過 |
| projection | 我們預測錯了、賣了兩倍<br>　Our projection was wrong: we sold twice as many as we expected. | q17：公司預計第一年賣五千台<br>　The company's projection is that it will sell five thousand robots in the first year. | q17：主詞、情境、句型 | 通過 |
| upgrade | 航空公司免費升等商務艙<br>　The airline gave us a free upgrade to business class. | q12：手機電池只撐三小時要升級（動詞）<br>　I need to upgrade my phone, because the battery only lasts three hours.<br>q17：團隊明年春天升級軟體（動詞）<br>　Next spring, the team will upgrade the software, and each farmer will receive a corresponding user guide in Chinese or English. | q12：主詞、情境、句型<br>q17：主詞、情境、句型 | 通過 |
| project | 造橋工程要三年才完成<br>　The bridge project will take three years to finish. | q14：預計明年銷售成長一成（動詞被動）<br>　Sales are projected to grow by ten percent next year.<br>q17：她最新的計畫是採果機器人<br>　Her latest project is a cheap robot that helps farmers pick fruit.<br>q19：我在做清河川計畫／上月開始做網站專案<br>　I am working on a project to clean up the river in my town. / Last month, I started a project to design a new website for my team. | q14：主詞、情境、句型<br>q17：主詞、情境、句型<br>q19：主詞、情境、句型 | 通過 |
| priority | 完成報告是我本週優先事項<br>　Finishing the report is my priority this week. | q11：市府今年把空氣品質列第一優先<br>　The city has made cleaner air its top priority this year.<br>q17：公司最優先是保持低價<br>　The company's top priority is to keep the price low, so the team utilizes simple parts that farmers can repair themselves.<br>q18：對我來說家人永遠第一<br>　For me, my family is always the top priority. / To me, my family always comes first; it is my first priority. | q11：主詞、情境、句型<br>q17：主詞、情境、句型<br>q18：主詞、情境、句型 | 通過 |
| innovation | 網路是上世紀最大發明之一<br>　The internet was one of the biggest innovations of the last century. | q17：老闆說真正的創新是替一般人解決問題<br>　The boss says that real innovation means solving problems for ordinary people. | q17：主詞、情境、句型 | 通過 |
| utilize | 老工廠改作藝術中心（被動）<br>　The old factory is now utilized as an art center. | q13：公司打算所有工廠都用太陽能<br>　The company plans to utilize solar power in all its factories.<br>q17：團隊用農民能自修的簡單零件<br>　The company's top priority is to keep the price low, so the team utilizes simple parts that farmers can repair themselves. | q13：主詞、情境、句型<br>q17：主詞、情境、句型 | 通過 |
| corresponding | 每張圖下有對應的字<br>　Each picture has a corresponding word under it. | q17：每位農民會收到對應的使用手冊<br>　Next spring, the team will upgrade the software, and each farmer will receive a corresponding user guide in Chinese or English. | q17：主詞、情境、句型 | 通過 |
| inventor | 班上每個孩子都夢想當發明家<br>　Every child in the class dreamed of becoming an inventor. | q17：林美華是新竹小公司的發明家<br>　Lin Meihua is an inventor who works for a small company in Hsinchu. | q17：主詞、情境、句型 | 通過 |
| originality | 老師為原創性加分<br>　The teacher gave extra points for originality. | q15：老師要學生故事展現原創性<br>　Teachers want students to show originality in their stories, not copy ideas from books.<br>q17：專家稱讚機器人的原創性<br>　Many experts praised the robot's originality, and a magazine called it one of the most innovative designs of the year. | q15：情境、句型<br>q17：主詞、情境、句型 | 通過 |

同課題目互比（9 題；事件摘要逐題人工判定互不相同；腳本找「同目標字且主詞、句型都相同」的兩題：0 組）

| 題號 | 事件摘要 |
|---|---|
| q11 | priority：市府今年把空氣品質列第一優先 |
| q12 | upgrade：手機電池只撐三小時要升級（動詞） |
| q13 | utilize：公司打算所有工廠都用太陽能 |
| q14 | project：預計明年銷售成長一成（動詞被動） |
| q15 | originality：老師要學生故事展現原創性 |
| q16 | innovative：公司以創新產品聞名、像可折手機 |
| q17 | innovative：雜誌稱機器人是年度最創新設計；projection：公司預計第一年賣五千台；upgrade：團隊明年春天升級軟體（動詞）；project：她最新的計畫是採果機器人；priority：公司最優先是保持低價；innovation：老闆說真正的創新是替一般人解決問題；utilize：團隊用農民能自修的簡單零件；corresponding：每位農民會收到對應的使用手冊；inventor：林美華是新竹小公司的發明家；originality：專家稱讚機器人的原創性 |
| q18 | priority：對我來說家人永遠第一 |
| q19 | project：我在做清河川計畫／上月開始做網站專案 |

### 第 2 批

#### b2-u41-l01

| 目標字 | 單字卡情境 | 其他題情境 | 換了哪幾項 | 判定 |
|---|---|---|---|---|
| spin | 洗衣機轉動衣服脫水<br>　The washing machine spins the clothes to make them dry faster. | q11：孩子們笑看輪子越轉越快<br>　The children laughed as the wheel spun faster and faster.<br>q15：曾祖母在後屋用木輪手紡羊毛<br>　In the back room, she used to spin wool by hand on an old wooden wheel. | q11：主詞、情境、句型<br>q15：主詞、情境、句型 | 通過 |
| yield | 蘋果樹每年秋天結很多果<br>　These apple trees yield a lot of fruit every autumn. | q15：線上編織課賺的錢比店還多<br>　She started online classes that teach people how to knit, and the classes soon yielded more money than the shop itself. | q15：主詞、情境、句型 | 通過 |
| found | 他希望有天創辦音樂學校<br>　He wants to found a small music school one day. | q13：小鎮三百多年前由農民建立（被動）<br>　The town was founded by farmers more than three hundred years ago.<br>q15：曾祖母1950年在鎮上開毛線店<br>　My great-grandmother founded a small wool shop in our town in 1950. | q13：主詞、情境、句型<br>q15：主詞、情境、句型 | 通過 |
| detect | 新相機在暗處也能偵測人臉<br>　The new camera can detect faces even in the dark. | q12：狗能察覺人聞不到的氣味<br>　Dogs can detect smells that people cannot notice at all.<br>q15：店裡的機器偵測到空氣太潮濕<br>　A small machine in the shop also detects when the air is too wet for the wool. | q12：主詞、情境、句型<br>q15：主詞、情境、句型 | 通過 |
| withdraw | 兩名選手因高溫退出比賽<br>　Two players withdrew from the race because of the heat. | q14：她去銀行提錢準備旅行<br>　She went to the bank to withdraw some money for the trip. | q14：主詞、情境、句型 | 通過 |
| rub | 用肥皂溫水搓汙漬（祈使）<br>　Rub the stain with a little soap and warm water. | q15：阿姨每次上課前搓雙手<br>　My aunt still rubs her hands together before every class, a habit she learned from her grandmother.<br>q17：我想睡時揉眼睛／冷天搓手<br>　I rub my eyes when I feel sleepy at work. / I rub my hands together on cold mornings. | q15：主詞、情境、句型<br>q17：主詞、情境、句型 | 通過 |
| alter | 新橋通車後市府更改公車路線<br>　The city altered the bus routes after the new bridge opened. | q10：襯衫太長要拿去店裡改<br>　This shirt is too long, so I'm taking it to a shop to have it altered.<br>q15：阿姨決定改變店的經營方式<br>　Last winter, sales were falling, so she decided to alter the way the shop works. | q10：主詞、情境、句型<br>q15：主詞、情境、句型 | 通過 |
| squeeze | 車上能再擠一個人嗎<br>　Can you squeeze one more person into the car? | q09：上菜前在魚上擠檸檬（祈使）<br>　Squeeze some lemon over the fish before you serve it.<br>q16：她握緊我的手叫我別擔心<br>　She squeezed my hand and told me not to worry. / She gave my hand a squeeze and told me not to worry. | q09：主詞、情境、句型<br>q16：主詞、情境、句型 | 通過 |

同課題目互比（9 題；事件摘要逐題人工判定互不相同；腳本找「同目標字且主詞、句型都相同」的兩題：0 組）

| 題號 | 事件摘要 |
|---|---|
| q09 | squeeze：上菜前在魚上擠檸檬（祈使） |
| q10 | alter：襯衫太長要拿去店裡改 |
| q11 | spin：孩子們笑看輪子越轉越快 |
| q12 | detect：狗能察覺人聞不到的氣味 |
| q13 | found：小鎮三百多年前由農民建立（被動） |
| q14 | withdraw：她去銀行提錢準備旅行 |
| q15 | spin：曾祖母在後屋用木輪手紡羊毛；yield：線上編織課賺的錢比店還多；found：曾祖母1950年在鎮上開毛線店；detect：店裡的機器偵測到空氣太潮濕；rub：阿姨每次上課前搓雙手；alter：阿姨決定改變店的經營方式 |
| q16 | squeeze：她握緊我的手叫我別擔心 |
| q17 | rub：我想睡時揉眼睛／冷天搓手 |

#### b2-u41-l02

| 目標字 | 單字卡情境 | 其他題情境 | 換了哪幾項 | 判定 |
|---|---|---|---|---|
| convert | 在機場可把錢換成當地貨幣<br>　You can convert your money into the local currency at the airport. | q09：農夫把舊穀倉改成小咖啡館<br>　The farmers converted the old barn into a small cafe.<br>q15：教練去年把最好的後衛改成守門員<br>　Last year, the coach converted our best defender into a goalkeeper, and today he saved two difficult shots. | q09：主詞、情境、句型<br>q15：主詞、情境、句型 | 通過 |
| flee | 小偷在警察到前逃走<br>　The thief fled before the police arrived. | q10：煙火一開始貓逃到床底<br>　The cat fled under the bed as soon as the fireworks started.<br>q15：下大雨時有些球迷逃回車上<br>　When heavy rain started, some fans fled to their cars and missed the best moments. | q10：主詞、情境、句型<br>q15：主詞、情境、句型 | 通過 |
| tail | 狐狸有又長又粗的尾巴<br>　A fox has a long, thick tail. | q13：小狗繞圈追自己的尾巴<br>　The puppy chased its own tail around in circles.<br>q15：狗翹著尾巴跑進球場<br>　In the middle of the game, a dog ran onto the field with its tail in the air, and the crowd exploded with laughter. | q13：主詞、情境、句型<br>q15：主詞、情境、句型 | 通過 |
| sustain | 長會議中很難維持精神<br>　It is hard to sustain your energy during a long meeting. | q14：小農場無法養活六口之家<br>　The small farm cannot sustain a family of six without other income.<br>q15：球隊沒能保住領先<br>　The team could not sustain its early lead, and the game ended in a draw. | q14：主詞、情境、句型<br>q15：主詞、情境、句型 | 通過 |
| crack | 水從牆上的裂縫滲進來<br>　Water came in through a crack in the wall. | q12：湖上的冰開始裂了（動詞）<br>　Be careful: the ice on the lake has started to crack.<br>q15：工人補好球門附近的長裂縫<br>　Before the match, workers upgraded the lights, made a few adjustments to the old pitch and filled a long crack near one of the goals, and the mayor pitched a ball into the crowd for fun.<br>q17：我手機螢幕有裂痕／杯子用熱水洗裂了<br>　There is a long crack in my phone screen. / My favorite cup cracked when I washed it in hot water. | q12：主詞、情境、句型<br>q15：主詞、情境、句型<br>q17：主詞、情境、句型 | 通過 |
| explode | 玉米很熱時會爆開成爆米花<br>　Popcorn explodes when the corn gets very hot. | q15：觀眾爆笑<br>　In the middle of the game, a dog ran onto the field with its tail in the air, and the crowd exploded with laughter.<br>q16：孩子看煙火在河上空爆開<br>　The children watched the fireworks explode over the river. / The children watched as fireworks exploded above the river. | q15：主詞、情境、句型<br>q16：主詞、情境、句型 | 通過 |
| adjustment | 新眼鏡會滑下鼻子要小調整<br>　My new glasses need a small adjustment because they slide down my nose. | q11：小小調整後老鐘又準了<br>　After a few small adjustments, the old clock worked perfectly again.<br>q15：賽前工人調整老球場<br>　Before the match, workers upgraded the lights, made a few adjustments to the old pitch and filled a long crack near one of the goals, and the mayor pitched a ball into the crowd for fun. | q11：主詞、情境、句型<br>q15：主詞、情境、句型 | 通過 |
| pitch | 球員在歡呼聲中走進球場<br>　The players walked onto the pitch to loud cheers. | q15：市長開賽前把球拋向觀眾（動詞）／工人整修球場<br>　Before the match, workers upgraded the lights, made a few adjustments to the old pitch and filled a long crack near one of the goals, and the mayor pitched a ball into the crowd for fun. | q15：主詞、情境、句型 | 通過 |

同課題目互比（9 題；事件摘要逐題人工判定互不相同；腳本找「同目標字且主詞、句型都相同」的兩題：0 組）

| 題號 | 事件摘要 |
|---|---|
| q09 | convert：農夫把舊穀倉改成小咖啡館 |
| q10 | flee：煙火一開始貓逃到床底 |
| q11 | adjustment：小小調整後老鐘又準了 |
| q12 | crack：湖上的冰開始裂了（動詞） |
| q13 | tail：小狗繞圈追自己的尾巴 |
| q14 | sustain：小農場無法養活六口之家 |
| q15 | convert：教練去年把最好的後衛改成守門員；flee：下大雨時有些球迷逃回車上；tail：狗翹著尾巴跑進球場；sustain：球隊沒能保住領先；crack：工人補好球門附近的長裂縫；explode：觀眾爆笑；adjustment：賽前工人調整老球場；pitch：市長開賽前把球拋向觀眾（動詞）／工人整修球場 |
| q16 | explode：孩子看煙火在河上空爆開 |
| q17 | crack：我手機螢幕有裂痕／杯子用熱水洗裂了 |

#### b2-u41-l03

| 目標字 | 單字卡情境 | 其他題情境 | 換了哪幾項 | 判定 |
|---|---|---|---|---|
| submit | 民眾在市府網站提出新公園點子<br>　Visitors can submit their ideas for the new park on the city website. | q09：週末前繳交申請表（祈使）<br>　Please submit your application form before the end of the week.<br>q15：Ming 週五前要交稻作報告<br>　Ming is a university student who had to submit a long report on rice farming by Friday. | q09：主詞、情境、句型<br>q15：主詞、情境、句型 | 通過 |
| extension | 捷運延伸線明年通車<br>　The extension of the subway line will open next year. | q13：飯店蓋多二十間房的擴建樓<br>　The hotel is building a new extension with twenty more rooms.<br>q15：Ming 向教授要求延期<br>　On Wednesday, she asked her professor for an extension. | q13：主詞、情境、句型<br>q15：主詞、情境、句型 | 通過 |
| shrug | 聳肩可表示不知道（動名詞主詞）<br>　Shrugging your shoulders can mean "I don't know." | q11：我問鑰匙放哪她聳聳肩<br>　She shrugged when I asked where she had put the keys.<br>q15：教授聳肩說沒關係<br>　He shrugged and said it was fine, as long as the report arrived by Monday. | q11：主詞、情境、句型<br>q15：主詞、情境、句型 | 通過 |
| cope | 假期小車站應付不了這麼多旅客<br>　The small station cannot cope with so many travelers during the holidays. | q15：Ming 應付不了所有課<br>　But the project was harder than she expected, and she was struggling to cope with all her classes.<br>q16：搬到新城市後學會應付獨居生活<br>　After she moved to a new city, she soon learned to cope with living alone. / She quickly learned to cope with life on her own after moving to a new city. | q15：主詞、情境、句型<br>q16：主詞、情境、句型 | 通過 |
| flame | 營火的火焰讓我們整晚溫暖<br>　The flames of the fire kept us warm all night at the camp. | q12：燭火在風中輕輕搖動<br>　A candle flame moved gently in the wind.<br>q15：Ming 用小瓦斯火煮晚餐<br>　That evening, she cooked dinner over a small gas flame and finally felt at ease. | q12：主詞、情境、句型<br>q15：主詞、情境、句型 | 通過 |
| grain | 一粒米掉在桌上<br>　A single grain of rice fell on the table. | q15：爺爺一輩子種穀物<br>　Her grandfather had devoted his whole life to growing grain, so she chose the topic. | q15：主詞、情境、句型 | 通過 |
| devote | 整晚都用來音樂跳舞（被動）<br>　The whole evening was devoted to music and dancing. | q14：她把空閒時間都花在動物收容所<br>　She devotes most of her free time to helping at the animal shelter, even on holidays.<br>q15：爺爺一生投入種穀物<br>　Her grandfather had devoted his whole life to growing grain, so she chose the topic. | q14：主詞、情境、句型<br>q15：主詞、情境、句型 | 通過 |
| ease | 她輕鬆通過考試（名詞）<br>　She passed the difficult exam with ease. | q10：新橋可望紓解尖峰市中心交通<br>　The new bridge should ease traffic in the city center during rush hour.<br>q15：Ming 終於覺得放鬆<br>　That evening, she cooked dinner over a small gas flame and finally felt at ease.<br>q17：公園散步減輕我工作壓力／音樂緩解考前擔心<br>　A walk in the park helps ease my stress after work. / Listening to music eases my worries before a test. | q10：主詞、情境、句型<br>q15：情境、句型<br>q17：主詞、情境、句型 | 通過 |

同課題目互比（9 題；事件摘要逐題人工判定互不相同；腳本找「同目標字且主詞、句型都相同」的兩題：0 組）

| 題號 | 事件摘要 |
|---|---|
| q09 | submit：週末前繳交申請表（祈使） |
| q10 | ease：新橋可望紓解尖峰市中心交通 |
| q11 | shrug：我問鑰匙放哪她聳聳肩 |
| q12 | flame：燭火在風中輕輕搖動 |
| q13 | extension：飯店蓋多二十間房的擴建樓 |
| q14 | devote：她把空閒時間都花在動物收容所 |
| q15 | submit：Ming 週五前要交稻作報告；extension：Ming 向教授要求延期；shrug：教授聳肩說沒關係；cope：Ming 應付不了所有課；flame：Ming 用小瓦斯火煮晚餐；grain：爺爺一輩子種穀物；devote：爺爺一生投入種穀物；ease：Ming 終於覺得放鬆 |
| q16 | cope：搬到新城市後學會應付獨居生活 |
| q17 | ease：公園散步減輕我工作壓力／音樂緩解考前擔心 |

#### b2-u41-l04

| 目標字 | 單字卡情境 | 其他題情境 | 換了哪幾項 | 判定 |
|---|---|---|---|---|
| patch | 她耳朵上方有一小撮白髮<br>　She has a small patch of white hair above her ear. | q12：帳篷搭過的地方有一塊乾草地<br>　There is a dry patch of grass where the tent was.<br>q15：Leo 的舊牛仔褲膝蓋有補丁<br>　Today, Leo's old jeans have a patch on one knee from all the falls, but he is one of the best players on the team. | q12：主詞、情境、句型<br>q15：主詞、情境、句型 | 通過 |
| gaze | 嬰兒的目光跟著紅氣球<br>　The baby's gaze followed the red balloon. | q15：Leo 感覺到教練的目光<br>　One evening, he could feel someone's gaze on him: the school coach had been watching him practice. | q15：主詞、情境、句型 | 通過 |
| lap | 跑者還有三圈要跑<br>　The runners have three more laps to go. | q11：貓坐在我腿上睡著<br>　The cat sat on my lap and fell asleep.<br>q15：Leo 每晚繞球場跑一圈又一圈<br>　Instead, he practiced alone every evening, running lap after lap around the court. | q11：主詞、情境、句型<br>q15：主詞、情境、句型 | 通過 |
| integrate | 新軟體把信件和行事曆整合<br>　The new software integrates email and calendars in one place. | q15：Leo 很難融入新學校<br>　When Leo moved from Brazil to Taiwan, he found it hard to integrate into his new school.<br>q16：把兩個團隊整合成一個部門<br>　We need to integrate the two teams into one department. / We have to integrate the two teams into a single department. | q15：主詞、情境、句型<br>q16：主詞、情境、句型 | 通過 |
| slam | 她生氣地把書摔在桌上<br>　She slammed the book down on the desk in anger. | q10：別用力關門、寶寶在樓上睡<br>　Please don't slam the door; the baby is sleeping upstairs.<br>q17：哥哥輸球甩門／風把窗戶甩上<br>　My brother slammed the door when he lost the game. / The wind slammed the window shut last night. | q10：主詞、情境、句型<br>q17：主詞、情境、句型 | 通過 |
| exclude | 五歲以下兒童不列入調查（被動）<br>　Children under five were excluded from the survey. | q13：房價不含早餐要另付<br>　The price excludes breakfast, so you have to pay extra for it.<br>q15：有些男生不讓 Leo 打球<br>　In the first week, some boys excluded him from their basketball games because he spoke little Chinese. | q13：主詞、情境、句型<br>q15：主詞、情境、句型 | 通過 |
| reverse | 把數字順序倒過來（祈使）<br>　Reverse the order of the numbers, so 1, 2, 3 becomes 3, 2, 1. | q09：卡車司機慢慢倒車進窄巷<br>　The truck driver slowly reversed into the narrow street. | q09：主詞、情境、句型 | 通過 |
| plead | 工人懇求多給時間完工<br>　The workers pleaded for more time to finish the job. | q14：男孩求媽媽讓他晚睡<br>　The boy pleaded with his mother to let him stay up late.<br>q15：Leo 沒有去求別人給他上場機會<br>　Leo did not plead for a chance to play. | q14：主詞、情境、句型<br>q15：主詞、情境、句型 | 通過 |

同課題目互比（9 題；事件摘要逐題人工判定互不相同；腳本找「同目標字且主詞、句型都相同」的兩題：0 組）

| 題號 | 事件摘要 |
|---|---|
| q09 | reverse：卡車司機慢慢倒車進窄巷 |
| q10 | slam：別用力關門、寶寶在樓上睡 |
| q11 | lap：貓坐在我腿上睡著 |
| q12 | patch：帳篷搭過的地方有一塊乾草地 |
| q13 | exclude：房價不含早餐要另付 |
| q14 | plead：男孩求媽媽讓他晚睡 |
| q15 | patch：Leo 的舊牛仔褲膝蓋有補丁；gaze：Leo 感覺到教練的目光；lap：Leo 每晚繞球場跑一圈又一圈；integrate：Leo 很難融入新學校；exclude：有些男生不讓 Leo 打球；plead：Leo 沒有去求別人給他上場機會 |
| q16 | integrate：把兩個團隊整合成一個部門 |
| q17 | slam：哥哥輸球甩門／風把窗戶甩上 |

#### b2-u41-l05

| 目標字 | 單字卡情境 | 其他題情境 | 換了哪幾項 | 判定 |
|---|---|---|---|---|
| rip | 強風把旗子撕成兩半<br>　The strong wind ripped the flag in half. | q13：開信封小心別撕破紙（祈使）<br>　Be careful not to rip the paper when you open the envelope.<br>q15：我的袖子被桌角勾破<br>　On the first day, I ripped my sleeve on a sharp corner of the table, but nobody laughed. | q13：主詞、情境、句型<br>q15：主詞、情境、句型 | 通過 |
| drain | 落葉堵住屋外排水管<br>　Leaves blocked the drain outside our house. | q10：廚房水槽不排水、叫水電工<br>　The kitchen sink won't drain, so I've called a plumber to come this afternoon.<br>q15：下課後倒掉清潔水桶的水（動詞）<br>　After each class, we had to drain the water from the cleaning bucket. | q10：主詞、情境、句型<br>q15：主詞、情境、句型 | 通過 |
| suck | 寶寶吸著拇指睡著<br>　The baby fell asleep while sucking her thumb. | q12：植物用根吸水<br>　Plants suck up water through their roots. | q12：主詞、情境、句型 | 通過 |
| boost | 鎮上希望新節慶帶動觀光<br>　The town hopes the new festival will boost tourism. | q15：課程提升了我的信心（動詞）<br>　Ho praised the originality of my design, which really boosted my confidence.<br>q16：廣告讓銷售額提升兩成<br>　This advertisement boosted our sales by twenty percent. / Our sales rose by twenty percent thanks to the boost from this ad. | q15：主詞、情境、句型<br>q16：主詞、情境、句型 | 通過 |
| grip | 舊鞋在濕地板上不止滑<br>　Old shoes lose their grip on wet floors. | q11：船晃時抓緊欄杆<br>　Hold on to the rail and keep a firm grip as the boat moves.<br>q15：老師示範如何握緊刀子（動詞）<br>　Ho, showed us how to grip the knife firmly and carve slowly, always moving the blade away from the body. | q11：主詞、情境、句型<br>q15：主詞、情境、句型 | 通過 |
| suspend | 燈用細鐵絲吊在天花板（被動）<br>　The lamp is suspended from the ceiling by a thin wire. | q14：大雪讓火車停駛兩小時<br>　The train service was suspended for two hours because of heavy snow.<br>q15：停電課程暫停半小時<br>　During the third lesson, the lights went out, and the class was suspended for half an hour. | q14：主詞、情境、句型<br>q15：主詞、情境、句型 | 通過 |
| hook | 他用小魚鉤釣到大魚<br>　He caught a big fish with a small hook. | q09：牆上掛鉤不夠牢、畫掉下來<br>　The picture fell down because the hook on the wall was too weak.<br>q15：學員把外套掛在水槽上方的鉤子<br>　The class was held in an old kitchen, so we hung our coats on metal hooks above the old sink. | q09：主詞、情境、句型<br>q15：主詞、情境、句型 | 通過 |
| carve | 他們的名字刻在老石橋上（被動）<br>　Their names are carved into the old stone bridge. | q15：老師教握刀慢慢雕、我正雕小鳥<br>　Ho, showed us how to grip the knife firmly and carve slowly, always moving the blade away from the body. / Now I am carving a small bird for my mother.<br>q17：萬聖節在南瓜上刻鬼臉／在沙灘上刻名字<br>　I carved a funny face into a pumpkin last Halloween. / We carved our names into the sand at the beach. | q15：主詞、情境、句型<br>q17：主詞、情境、句型 | 通過 |

同課題目互比（9 題；事件摘要逐題人工判定互不相同；腳本找「同目標字且主詞、句型都相同」的兩題：0 組）

| 題號 | 事件摘要 |
|---|---|
| q09 | hook：牆上掛鉤不夠牢、畫掉下來 |
| q10 | drain：廚房水槽不排水、叫水電工 |
| q11 | grip：船晃時抓緊欄杆 |
| q12 | suck：植物用根吸水 |
| q13 | rip：開信封小心別撕破紙（祈使） |
| q14 | suspend：大雪讓火車停駛兩小時 |
| q15 | rip：我的袖子被桌角勾破；drain：下課後倒掉清潔水桶的水（動詞）；boost：課程提升了我的信心（動詞）；grip：老師示範如何握緊刀子（動詞）；suspend：停電課程暫停半小時；hook：學員把外套掛在水槽上方的鉤子；carve：老師教握刀慢慢雕、我正雕小鳥 |
| q16 | boost：廣告讓銷售額提升兩成 |
| q17 | carve：萬聖節在南瓜上刻鬼臉／在沙灘上刻名字 |

#### b2-u41-l06

| 目標字 | 單字卡情境 | 其他題情境 | 換了哪幾項 | 判定 |
|---|---|---|---|---|
| crawl | 小蟲爬過我的筆記本<br>　A small insect crawled across my notebook. | q12：嬰兒通常先會爬再會走<br>　Babies usually start to crawl before they can walk.<br>q15：弟弟爬進廚房看我們<br>　My baby brother crawled into the kitchen to watch us, and our cat descended the stairs as soon as it smelled the food. | q12：主詞、情境、句型<br>q15：主詞、情境、句型 | 通過 |
| acquisition | 博物館最新購得的是1890年畫作<br>　The museum's latest acquisition is a painting from 1890. | q09：公司宣布收購較小的對手<br>　The company's acquisition of a smaller rival was announced on Monday. | q09：主詞、情境、句型 | 通過 |
| pursuit | 警車追趕被偷的機車<br>　The police car drove off in pursuit of the stolen motorbike. | q14：他為追求當廚師的夢想搬到巴黎<br>　He moved to Paris in pursuit of his dream to become a chef.<br>q15：做菜是爸爸工作外最愛的嗜好<br>　Cooking is his favorite pursuit outside work. | q14：主詞、情境<br>q15：主詞、情境、句型 | 通過 |
| peel | 有人把香蕉皮丟在樓梯上<br>　Someone left a banana peel on the stairs. | q13：小心撕下窗上貼紙（祈使）<br>　Please peel the stickers off the window carefully.<br>q15：我削馬鈴薯皮（動詞）<br>　First, I peeled the potatoes and chopped two onions while he heated the pan.<br>q16：牆上舊油漆開始剝落<br>　The old paint on the wall is starting to peel. / The old paint on the wall has begun to peel. | q13：主詞、情境、句型<br>q15：主詞、情境、句型<br>q16：主詞、情境、句型 | 通過 |
| flip | 她按了開關但沒反應<br>　She flipped the light switch, but nothing happened. | q15：爸爸把煎餅拋到空中翻面<br>　He can flip a pancake high in the air and catch it again, which always makes me laugh.<br>q17：我拿不定主意就擲硬幣／等車時翻雜誌<br>　I flip a coin when I can't decide what to eat. / I flipped through a magazine while I was waiting for the bus. | q15：主詞、情境、句型<br>q17：主詞、情境、句型 | 通過 |
| vanish | 太陽消失在雲後<br>　The sun vanished behind the clouds. | q11：魔術師一揮手硬幣不見了<br>　The magician waved his hand, and the coin vanished.<br>q15：第一批煎餅幾分鐘內就不見了<br>　The first pancakes vanished from the plate within minutes. | q11：主詞、情境、句型<br>q15：主詞、情境、句型 | 通過 |
| chop | 他劈柴給壁爐用<br>　He chopped wood for the fireplace. | q15：我切了兩顆洋蔥<br>　First, I peeled the potatoes and chopped two onions while he heated the pan. | q15：主詞、情境、句型 | 通過 |
| descend | 飛機開始朝機場下降<br>　The plane began to descend toward the airport. | q10：燈壞了下樓梯小心<br>　Be careful as you descend the stairs; the lights are broken.<br>q15：貓一聞到食物就下樓<br>　My baby brother crawled into the kitchen to watch us, and our cat descended the stairs as soon as it smelled the food. | q10：主詞、情境、句型<br>q15：主詞、情境、句型 | 通過 |

同課題目互比（9 題；事件摘要逐題人工判定互不相同；腳本找「同目標字且主詞、句型都相同」的兩題：0 組）

| 題號 | 事件摘要 |
|---|---|
| q09 | acquisition：公司宣布收購較小的對手 |
| q10 | descend：燈壞了下樓梯小心 |
| q11 | vanish：魔術師一揮手硬幣不見了 |
| q12 | crawl：嬰兒通常先會爬再會走 |
| q13 | peel：小心撕下窗上貼紙（祈使） |
| q14 | pursuit：他為追求當廚師的夢想搬到巴黎 |
| q15 | crawl：弟弟爬進廚房看我們；pursuit：做菜是爸爸工作外最愛的嗜好；peel：我削馬鈴薯皮（動詞）；flip：爸爸把煎餅拋到空中翻面；vanish：第一批煎餅幾分鐘內就不見了；chop：我切了兩顆洋蔥；descend：貓一聞到食物就下樓 |
| q16 | peel：牆上舊油漆開始剝落 |
| q17 | flip：我拿不定主意就擲硬幣／等車時翻雜誌 |

#### b2-u41-l07

| 目標字 | 單字卡情境 | 其他題情境 | 換了哪幾項 | 判定 |
|---|---|---|---|---|
| seal | 舊信用紅色封印封口<br>　The old letter was closed with a red seal. | q11：檢查果汁瓶封口沒破（祈使）<br>　Please check that the seal on the juice bottle is not broken.<br>q15：叔叔確認食物盒都密封<br>　Before leaving, he checked that every food box had a tight seal, so sea water could not get in. | q11：主詞、情境、句型<br>q15：主詞、情境、句型 | 通過 |
| undertake | 她接下寫校史的工作<br>　She undertook the job of writing the school's history. | q13：公司將承接蓋新醫院的大計畫<br>　The company will undertake a big project to build a new hospital.<br>q15：叔叔挑戰獨自繞台航行<br>　Last summer, my uncle undertook a big challenge: he sailed alone around Taiwan in his small boat. | q13：主詞、情境、句型<br>q15：主詞、情境、句型 | 通過 |
| bid | 幾個城市爭取主辦明年音樂節<br>　Several cities are bidding to host next year's music festival. | q15：叔叔想出價買舊木船<br>　Now he wants to bid for an old wooden boat that will be sold next month. | q15：主詞、情境、句型 | 通過 |
| slap | 海浪拍打船身<br>　The waves slapped against the side of the boat. | q12：他拍死手臂上的蚊子<br>　He slapped a mosquito on his arm.<br>q15：朋友拍他的背歡呼<br>　When he returned to the harbor after two weeks, his friends slapped him on the back and cheered. | q12：主詞、情境、句型<br>q15：主詞、情境、句型 | 通過 |
| tackle | 對付氣候變遷需要各國幫忙（動名詞主詞）<br>　Tackling climate change needs help from every country. | q10：團隊午餐前先處理最難的問題<br>　Our team will tackle the most difficult problem first, before lunch.<br>q15：叔叔冷靜處理強風問題<br>　On the third day, a strong wind came, but he knew the sea well and tackled the problem calmly.<br>q17：我上週整理亂櫥櫃／正在解數學難題<br>　Last week, I tackled the messy cupboard in my kitchen. / I am tackling a difficult math problem for my class. | q10：主詞、情境、句型<br>q15：主詞、情境、句型<br>q17：主詞、情境、句型 | 通過 |
| sail | 幾百年來船隻往來這些島<br>　Ships have sailed between these islands for hundreds of years. | q09：孩子們在池塘放紙船<br>　The children sailed their paper boats on the pond.<br>q15：叔叔獨自駕船繞台灣<br>　Last summer, my uncle undertook a big challenge: he sailed alone around Taiwan in his small boat. | q09：主詞、情境、句型<br>q15：主詞、情境、句型 | 通過 |
| grasp | 孩子緊抓媽媽的手<br>　The child had a firm grasp on her mother's hand. | q14：她很懂日文能看菜單<br>　She has a good grasp of Japanese, so she can read the menu easily. | q14：主詞、情境、句型 | 通過 |
| manipulate | 有些廣告操縱人買不需要的東西<br>　Some ads manipulate people into buying things they don't need. | q15：叔叔學會單手操控船上的控制裝置<br>　He had learned to manipulate the boat's controls with just one hand.<br>q16：機器手臂能操作很小的零件<br>　This robot arm can manipulate very small parts. / The robot arm is able to manipulate tiny parts. | q15：主詞、情境、句型<br>q16：主詞、情境、句型 | 通過 |

同課題目互比（9 題；事件摘要逐題人工判定互不相同；腳本找「同目標字且主詞、句型都相同」的兩題：0 組）

| 題號 | 事件摘要 |
|---|---|
| q09 | sail：孩子們在池塘放紙船 |
| q10 | tackle：團隊午餐前先處理最難的問題 |
| q11 | seal：檢查果汁瓶封口沒破（祈使） |
| q12 | slap：他拍死手臂上的蚊子 |
| q13 | undertake：公司將承接蓋新醫院的大計畫 |
| q14 | grasp：她很懂日文能看菜單 |
| q15 | seal：叔叔確認食物盒都密封；undertake：叔叔挑戰獨自繞台航行；bid：叔叔想出價買舊木船；slap：朋友拍他的背歡呼；tackle：叔叔冷靜處理強風問題；sail：叔叔獨自駕船繞台灣；manipulate：叔叔學會單手操控船上的控制裝置 |
| q16 | manipulate：機器手臂能操作很小的零件 |
| q17 | tackle：我上週整理亂櫥櫃／正在解數學難題 |

#### b2-u41-l08

| 目標字 | 單字卡情境 | 其他題情境 | 換了哪幾項 | 判定 |
|---|---|---|---|---|
| whip | 奶奶總是手工打蛋<br>　My grandmother always whipped eggs by hand, without a machine. | q09：把鮮奶油打到變稠再加糖（祈使）<br>　Whip the cream until it is thick, then add the sugar.<br>q15：山頂吃加了打發鮮奶油的蛋糕<br>　Before going down, we ate cake with whipped cream that someone had carried up in a cool box. | q09：主詞、情境、句型<br>q15：主詞、情境、句型 | 通過 |
| tolerate | 老師不容許考試時講話<br>　My teacher does not tolerate talking during tests. | q12：我想睡時受不了大聲音樂<br>　I can't tolerate loud music when I'm trying to sleep.<br>q15：一位隊員受不了熱想停下<br>　One member could not tolerate the heat and wanted to stop, but the rest of us persisted, and she joined us again after a short rest. | q12：主詞、情境、句型<br>q15：主詞、情境、句型 | 通過 |
| scramble | 問對方蛋要煎的還是炒的<br>　Would you like your eggs fried or scrambled? | q15：快到山頂要手腳並用爬過大石<br>　Near the top, we had to scramble over large rocks using our hands.<br>q17：車門一開大家搶座位／特賣搶便宜鞋子<br>　People scrambled for seats when the train doors opened. / Shoppers scrambled for cheap shoes on the first day of the sale. | q15：主詞、情境、句型<br>q17：主詞、情境、句型 | 通過 |
| punch | 他在拳擊課用力打沙包<br>　He punched the bag hard during his boxing class. | q10：每頁打兩個洞放進資料夾<br>　Please punch two holes in each page so we can put them in the folder.<br>q15：有人在山頂開心地揮拳<br>　At the top, someone punched the air with joy. | q10：主詞、情境、句型<br>q15：主詞、情境、句型 | 通過 |
| persist | 她鋼琴練習再難也堅持<br>　She persisted with her piano practice even when it was hard. | q13：雨若持續比賽就取消<br>　If the rain persists, the match will be cancelled.<br>q15：其他隊員堅持往上爬<br>　One member could not tolerate the heat and wanted to stop, but the rest of us persisted, and she joined us again after a short rest. | q13：主詞、情境、句型<br>q15：主詞、情境、句型 | 通過 |
| exploit | 她利用每個機會練英文<br>　She exploited every chance to practice her English. | q14：公司想利用海岸的風發電<br>　The company wants to exploit the wind on the coast to make electricity.<br>q15：山下小鎮以前開採山上石頭<br>　Our leader explained that the town below once exploited the hill for its stone, but today a city project protects the area. | q14：主詞、情境、句型<br>q15：主詞、情境、句型 | 通過 |
| stimulate | 鮮豔顏色引起嬰兒對玩具的興趣<br>　Bright colors stimulate babies' interest in toys. | q11：新公園將刺激地方經濟<br>　The new park will stimulate the local economy.<br>q15：美景引發保護自然的討論<br>　The beautiful view stimulated a long discussion about protecting nature. | q11：主詞、情境、句型<br>q15：主詞、情境、句型 | 通過 |
| sack | 他因老是遲到被開除（被動）<br>　He was sacked for always arriving late. | q16：工廠上個月開除十名員工<br>　The factory sacked ten workers last month. / Last month, the factory sacked ten of its workers. | q16：主詞、情境、句型 | 通過 |

同課題目互比（9 題；事件摘要逐題人工判定互不相同；腳本找「同目標字且主詞、句型都相同」的兩題：0 組）

| 題號 | 事件摘要 |
|---|---|
| q09 | whip：把鮮奶油打到變稠再加糖（祈使） |
| q10 | punch：每頁打兩個洞放進資料夾 |
| q11 | stimulate：新公園將刺激地方經濟 |
| q12 | tolerate：我想睡時受不了大聲音樂 |
| q13 | persist：雨若持續比賽就取消 |
| q14 | exploit：公司想利用海岸的風發電 |
| q15 | whip：山頂吃加了打發鮮奶油的蛋糕；tolerate：一位隊員受不了熱想停下；scramble：快到山頂要手腳並用爬過大石；punch：有人在山頂開心地揮拳；persist：其他隊員堅持往上爬；exploit：山下小鎮以前開採山上石頭；stimulate：美景引發保護自然的討論 |
| q16 | sack：工廠上個月開除十名員工 |
| q17 | scramble：車門一開大家搶座位／特賣搶便宜鞋子 |

#### b2-u42-l01

| 目標字 | 單字卡情境 | 其他題情境 | 換了哪幾項 | 判定 |
|---|---|---|---|---|
| functional | 老收音機五十年後還能用<br>　The old radio is still functional after fifty years. | q15：舊汽車零件做的椅子完全能坐<br>　It looked strange, but it was fully functional, and visitors could sit on it.<br>q17：我的舊背包不好看但實用／偏好實用家具<br>　My old backpack is not pretty, but it is very functional. / I prefer functional furniture with lots of storage space. | q15：主詞、情境、句型<br>q17：主詞、情境、句型 | 通過 |
| fixed | 博物館開放時間固定<br>　The museum has fixed opening hours. | q10：公車固定時間每二十分鐘一班<br>　The bus leaves at fixed times, every twenty minutes from seven a.m.<br>q15：椅子以固定價格一萬元出售<br>　The designer, a young woman known for her use of recycled materials, sells her chairs at a fixed price of ten thousand dollars. | q10：主詞、情境、句型<br>q15：主詞、情境、句型 | 通過 |
| known | 他的確切生日無人知道<br>　The exact date of his birth is not known. | q14：村裡人人都知道她父親很善良<br>　Her father is known to everyone in the village as a kind man.<br>q15：設計師以回收材料聞名<br>　The designer, a young woman known for her use of recycled materials, sells her chairs at a fixed price of ten thousand dollars. | q14：主詞、情境、句型<br>q15：主詞、情境、句型 | 通過 |
| fierce | 兩隊激烈爭奪第一名<br>　The two teams had a fierce fight for first place. | q09：遊客太靠近時獅子兇猛吼叫<br>　The lion gave a fierce roar when the visitors came too close.<br>q15：設計師之間競爭激烈<br>　Competition between designers is fierce, she told me privately, so she works seven days a week. | q09：主詞、情境、句型<br>q15：主詞、情境、句型 | 通過 |
| striking | 兩張照片差異很明顯<br>　There is a striking difference between the two photos. | q15：最醒目的是舊車零件做的紅椅<br>　The most striking piece was a red chair made from old car parts.<br>q16：她穿搶眼紅洋裝去派對<br>　She wore a striking red dress to the party. / She went to the party in a striking red dress. | q15：主詞、情境、句型<br>q16：主詞、情境、句型 | 通過 |
| rim | 湖邊長滿高草<br>　Tall grass grows along the rim of the lake. | q12：我的杯緣有咖啡漬<br>　There is a coffee stain on the rim of my cup.<br>q15：檯燈有金色邊框<br>　Another room showed lamps with gold rims and tables made of dense, heavy wood, some of them carved by hand. | q12：主詞、情境<br>q15：主詞、情境、句型 | 通過 |
| privately | 兩位教練賽前私下談<br>　The two coaches talked privately before the game. | q11：有些畫私人收藏不公開展出（私人義）<br>　Some of the paintings are privately owned and not shown to the public.<br>q15：設計師私下告訴我競爭激烈<br>　Competition between designers is fierce, she told me privately, so she works seven days a week. | q11：主詞、情境、句型<br>q15：主詞、情境、句型 | 通過 |
| dense | 濃霧讓機場關閉三小時<br>　Dense fog closed the airport for three hours. | q13：森林茂密到陽光照不到地面<br>　The forest is so dense that very little sunlight reaches the ground.<br>q15：桌子用密實的重木頭做<br>　Another room showed lamps with gold rims and tables made of dense, heavy wood, some of them carved by hand. | q13：主詞、情境、句型<br>q15：主詞、情境、句型 | 通過 |

同課題目互比（9 題；事件摘要逐題人工判定互不相同；腳本找「同目標字且主詞、句型都相同」的兩題：0 組）

| 題號 | 事件摘要 |
|---|---|
| q09 | fierce：遊客太靠近時獅子兇猛吼叫 |
| q10 | fixed：公車固定時間每二十分鐘一班 |
| q11 | privately：有些畫私人收藏不公開展出（私人義） |
| q12 | rim：我的杯緣有咖啡漬 |
| q13 | dense：森林茂密到陽光照不到地面 |
| q14 | known：村裡人人都知道她父親很善良 |
| q15 | functional：舊汽車零件做的椅子完全能坐；fixed：椅子以固定價格一萬元出售；known：設計師以回收材料聞名；fierce：設計師之間競爭激烈；striking：最醒目的是舊車零件做的紅椅；rim：檯燈有金色邊框；privately：設計師私下告訴我競爭激烈；dense：桌子用密實的重木頭做 |
| q16 | striking：她穿搶眼紅洋裝去派對 |
| q17 | functional：我的舊背包不好看但實用／偏好實用家具 |

#### b2-u42-l02

| 目標字 | 單字卡情境 | 其他題情境 | 換了哪幾項 | 判定 |
|---|---|---|---|---|
| balanced | 桌子不平、一隻腳較短<br>　The table is not balanced because one leg is shorter. | q13：報紙每篇報導都力求平衡呈現雙方<br>　The newspaper tries to give a balanced view of both sides in every story.<br>q15：演講內容有趣與嚴肅兼顧<br>　Her talk was well balanced, with funny stories and serious information. | q13：主詞、情境、句型<br>q15：主詞、情境、句型 | 通過 |
| bizarre | 晚上戴墨鏡看起來有點怪<br>　Wearing sunglasses at night looks a bit bizarre. | q15：科學家開場講青蛙結凍的怪事<br>　She began with a bizarre fact: some frogs freeze in winter and come back to life in spring.<br>q17：我看過有人在公園遛豬／做了飛魚怪夢<br>　I once saw a man walking a pet pig in the park, which was bizarre. / I had a bizarre dream about flying fish last night. | q15：主詞、情境、句型<br>q17：主詞、情境、句型 | 通過 |
| reasonably | 考試相當簡單、多數人及格<br>　The test was reasonably easy, so most students passed. | q10：新手機還算好用但電池弱<br>　The new phone works reasonably well, but the battery is weak.<br>q15：票價合理、下次還能去<br>　Luckily, the tickets for her next talk are reasonably priced, so we can attend it too. | q10：主詞、情境、句型<br>q15：主詞、情境、句型 | 通過 |
| remarkably | 那對雙胞胎長得出奇地像<br>　The twins look remarkably alike, even to their parents. | q15：狗的嗅覺比人強得多<br>　She also explained that dogs have an acute sense of smell, remarkably stronger than ours.<br>q16：這間小餐廳的菜出奇便宜<br>　The food at this small restaurant is remarkably cheap. / This small restaurant's food is remarkably cheap. | q15：主詞、情境、句型<br>q16：主詞、情境、句型 | 通過 |
| abruptly | 她沒道別就突然離開派對<br>　She left the party abruptly without a word to anyone. | q09：狗衝上路、車子突然停下<br>　The car stopped abruptly when a dog ran into the road.<br>q15：火警響起演講突然結束<br>　Then the fire alarm went off for a test, and the talk ended abruptly. | q09：主詞、情境、句型<br>q15：主詞、情境、句型 | 通過 |
| acute | 又兩人離職問題更嚴重<br>　The problem became more acute when two more workers left. | q14：小村莊迫切需要老師<br>　There is an acute need for more teachers in small villages.<br>q15：狗有敏銳的嗅覺<br>　She also explained that dogs have an acute sense of smell, remarkably stronger than ours. | q14：主詞、情境、句型<br>q15：主詞、情境、句型 | 通過 |
| grim | 老工廠外觀陰沉灰暗<br>　The old factory looks grim and dark from the outside. | q11：今晚電視新聞相當沉重<br>　The news on TV tonight was rather grim.<br>q15：科學家放森林被砍照片時神情凝重<br>　Near the end, her face became grim as she showed photos of forests that had been cut down. | q11：主詞、情境、句型<br>q15：主詞、情境、句型 | 通過 |
| distinguished | 他當飛行員的生涯很傑出<br>　He had a distinguished career as a pilot. | q12：我爺爺是得過很多獎的傑出畫家<br>　My grandfather is a distinguished painter who has won many prizes.<br>q15：傑出的科學家來學校演講<br>　Last Friday, a distinguished scientist who has devoted thirty years to studying animals gave a talk at our school. | q12：主詞、情境、句型<br>q15：主詞、情境、句型 | 通過 |

同課題目互比（9 題；事件摘要逐題人工判定互不相同；腳本找「同目標字且主詞、句型都相同」的兩題：0 組）

| 題號 | 事件摘要 |
|---|---|
| q09 | abruptly：狗衝上路、車子突然停下 |
| q10 | reasonably：新手機還算好用但電池弱 |
| q11 | grim：今晚電視新聞相當沉重 |
| q12 | distinguished：我爺爺是得過很多獎的傑出畫家 |
| q13 | balanced：報紙每篇報導都力求平衡呈現雙方 |
| q14 | acute：小村莊迫切需要老師 |
| q15 | balanced：演講內容有趣與嚴肅兼顧；bizarre：科學家開場講青蛙結凍的怪事；reasonably：票價合理、下次還能去；remarkably：狗的嗅覺比人強得多；abruptly：火警響起演講突然結束；acute：狗有敏銳的嗅覺；grim：科學家放森林被砍照片時神情凝重；distinguished：傑出的科學家來學校演講 |
| q16 | remarkably：這間小餐廳的菜出奇便宜 |
| q17 | bizarre：我看過有人在公園遛豬／做了飛魚怪夢 |

#### b2-u42-l03

| 目標字 | 單字卡情境 | 其他題情境 | 換了哪幾項 | 判定 |
|---|---|---|---|---|
| triangle | 把三明治切成兩個三角形（祈使）<br>　Cut the sandwich into two triangles for the children. | q14：三角形有三個邊三個角（定義）<br>　A triangle has three sides and three corners.<br>q15：一座塔頂有個像屋頂的三角形<br>　One tower had a triangle on top like a roof, and we carved windows into the walls with a stick. | q14：主詞、情境、句型<br>q15：主詞、情境、句型 | 通過 |
| dim | 蠟燭發出昏暗溫暖的光<br>　The candles gave a dim, warm light. | q09：會議室太暗只好開所有燈<br>　The meeting room was so dim that we turned on all the lights.<br>q15：傍晚光線變暗、走路回家<br>　In the evening, the light became dim, and we walked home. | q09：主詞、情境、句型<br>q15：主詞、情境、句型 | 通過 |
| fabulous | 你穿那件藍外套很好看<br>　You look fabulous in that blue jacket! | q15：外甥說今天棒極了<br>　My nephew said it was a fabulous day.<br>q17：夜市海鮮很棒／音樂節玩得很開心<br>　The seafood at that night market was fabulous. / We had a fabulous time at the music festival last summer. | q15：主詞、情境、句型<br>q17：主詞、情境、句型 | 通過 |
| technically | 新手機技術上比舊的好<br>　The new phone is technically better than the old one. | q11：嚴格說番茄是水果<br>　Technically, tomatoes are fruit, not vegetables.<br>q15：嚴格說店已打烊、老闆仍賣冰<br>　Technically, the shop was already closed, but the owner sold us two cones anyway. | q11：主詞、情境、句型<br>q15：主詞、情境、句型 | 通過 |
| cone | 派對帽是圓錐形<br>　Many party hats are shaped like cones. | q10：在洞旁放三角錐免得有人掉進去<br>　Put a traffic cone next to the hole so nobody falls in.<br>q15：用紙圓錐做城堡、買甜筒冰淇淋<br>　He wanted to build a mighty castle, so we used a plastic cup and a paper cone to make the towers. / Later, we bought ice cream cones from a tiny shop with transparent walls. / Technically, the shop was already closed, but the owner sold us two cones anyway. | q10：主詞、情境、句型<br>q15：主詞、情境、句型 | 通過 |
| transparent | 有些海洋動物身體幾乎透明<br>　Some sea animals have almost transparent bodies. | q13：盒子窗用透明塑膠做、看得見裡面<br>　The window is made of transparent plastic, so you can see what's inside the box.<br>q15：小店有透明的牆<br>　Later, we bought ice cream cones from a tiny shop with transparent walls. | q13：主詞、情境、句型<br>q15：主詞、情境、句型 | 通過 |
| absurd | 計畫一開始聽起來荒謬但成功了<br>　The plan sounded absurd at first, but it worked. | q15：城堡永遠不倒的想法很荒謬<br>　Of course, the idea of a sand castle that lasts forever is absurd: the sea took it away by morning.<br>q16：說他十分鐘跑十公里太荒謬<br>　It is absurd to say that he can run ten kilometers in ten minutes. / Saying he can run ten kilometers in ten minutes is absurd. | q15：主詞、情境、句型<br>q16：主詞、情境、句型 | 通過 |
| mighty | 強大的國王統治四十年<br>　The mighty king ruled the land for forty years. | q12：大河流經三國入海<br>　The mighty river runs through three countries before reaching the sea.<br>q15：外甥想蓋雄偉的城堡<br>　He wanted to build a mighty castle, so we used a plastic cup and a paper cone to make the towers. | q12：情境、句型<br>q15：主詞、情境、句型 | 通過 |

同課題目互比（9 題；事件摘要逐題人工判定互不相同；腳本找「同目標字且主詞、句型都相同」的兩題：0 組）

| 題號 | 事件摘要 |
|---|---|
| q09 | dim：會議室太暗只好開所有燈 |
| q10 | cone：在洞旁放三角錐免得有人掉進去 |
| q11 | technically：嚴格說番茄是水果 |
| q12 | mighty：大河流經三國入海 |
| q13 | transparent：盒子窗用透明塑膠做、看得見裡面 |
| q14 | triangle：三角形有三個邊三個角（定義） |
| q15 | triangle：一座塔頂有個像屋頂的三角形；dim：傍晚光線變暗、走路回家；fabulous：外甥說今天棒極了；technically：嚴格說店已打烊、老闆仍賣冰；cone：用紙圓錐做城堡、買甜筒冰淇淋；transparent：小店有透明的牆；absurd：城堡永遠不倒的想法很荒謬；mighty：外甥想蓋雄偉的城堡 |
| q16 | absurd：說他十分鐘跑十公里太荒謬 |
| q17 | fabulous：夜市海鮮很棒／音樂節玩得很開心 |

#### b2-u42-l04

| 目標字 | 單字卡情境 | 其他題情境 | 換了哪幾項 | 判定 |
|---|---|---|---|---|
| finely | 她的洋裝做工精細、有小花<br>　Her dress was finely made, with tiny flowers sewn by hand. | q13：大蒜切細才能和醬汁拌勻（祈使）<br>　Chop the garlic finely so that it mixes well with the sauce. | q13：主詞、情境、句型 | 通過 |
| nicely | 植物在新盆裡長得很好<br>　The plants are growing nicely in the new pots. | q15：棋賽輸了仍有禮貌地向對手道謝<br>　In the end, she lost, but she played well, thanked her opponent nicely, and the crowd clapped for her.<br>q16：這件襯衫你穿起來很合身<br>　This shirt fits you really nicely. / The shirt fits you very nicely. | q15：主詞、情境、句型<br>q16：主詞、情境、句型 | 通過 |
| straightforward | 辦借書證很簡單<br>　Getting a library card is straightforward. | q10：食譜簡單、材料小店就買得到<br>　The recipe is straightforward, and you can buy everything at a small shop.<br>q15：比賽規則很簡單<br>　The rules were straightforward, but the games were tricky, especially against players with years of experience.<br>q17：去辦公室很簡單搭一班公車／老闆很直率<br>　My teacher gave us straightforward instructions for the homework. / My boss is straightforward and always tells us what she thinks. | q10：主詞、情境、句型<br>q15：主詞、情境、句型<br>q17：主詞、情境、句型 | 通過 |
| formidable | 冬天爬那座山是艱鉅任務<br>　Climbing that mountain in winter is a formidable task. | q15：決賽對手是贏過三次的強敵<br>　In the final, she faced a formidable opponent who had won the tournament three times. | q15：主詞、情境、句型 | 通過 |
| potent | 她的演講有力地提醒老師的重要<br>　Her speech was a potent reminder of how much teachers matter. | q09：這起司氣味很重要放密封盒<br>　This cheese has a potent smell, so keep it in a closed box. | q09：主詞、情境、句型 | 通過 |
| erect | 狗聽到聲音耳朵豎起來<br>　Our dog's ears stay erect when it hears a strange sound. | q12：小長頸鹿出生一小時就站直<br>　The baby giraffe stood erect only an hour after it was born.<br>q15：姊姊在椅子上坐得挺直<br>　She sat erect in her chair and thought carefully about every move, like a painter adding small details. | q12：主詞、情境、句型<br>q15：主詞、情境、句型 | 通過 |
| varied | 她的工作多樣、從不無聊<br>　Her job is varied, so she never gets bored. | q11：菜單很多樣、有各國菜<br>　The menu is quite varied, with dishes from many countries.<br>q15：教練說她的棋風多變<br>　Her coach says her style is varied, which makes her hard to predict. | q11：主詞、情境、句型<br>q15：主詞、情境、句型 | 通過 |
| tricky | 這題很棘手、要讀兩次<br>　This question is tricky, so read it twice. | q14：在窄街停大車可能很難<br>　Parking a big car in this narrow street can be tricky.<br>q15：比賽對局很棘手<br>　The rules were straightforward, but the games were tricky, especially against players with years of experience. | q14：主詞、情境、句型<br>q15：主詞、情境、句型 | 通過 |

同課題目互比（9 題；事件摘要逐題人工判定互不相同；腳本找「同目標字且主詞、句型都相同」的兩題：0 組）

| 題號 | 事件摘要 |
|---|---|
| q09 | potent：這起司氣味很重要放密封盒 |
| q10 | straightforward：食譜簡單、材料小店就買得到 |
| q11 | varied：菜單很多樣、有各國菜 |
| q12 | erect：小長頸鹿出生一小時就站直 |
| q13 | finely：大蒜切細才能和醬汁拌勻（祈使） |
| q14 | tricky：在窄街停大車可能很難 |
| q15 | nicely：棋賽輸了仍有禮貌地向對手道謝；straightforward：比賽規則很簡單；formidable：決賽對手是贏過三次的強敵；erect：姊姊在椅子上坐得挺直；varied：教練說她的棋風多變；tricky：比賽對局很棘手 |
| q16 | nicely：這件襯衫你穿起來很合身 |
| q17 | straightforward：去辦公室很簡單搭一班公車／老闆很直率 |

#### b2-u42-l05

| 目標字 | 單字卡情境 | 其他題情境 | 換了哪幾項 | 判定 |
|---|---|---|---|---|
| genuinely | 我真心相信這計畫可行<br>　I genuinely believe this plan will work. | q11：她見到老朋友真的很開心<br>　She was genuinely happy to see her old friends again.<br>q15：老師對塑膠垃圾真的很震驚<br>　Our teacher said that throwing rubbish into the river is unacceptable, and she was genuinely shocked by how much plastic we found. | q11：主詞、情境、句型<br>q15：主詞、情境、句型 | 通過 |
| appropriately | 孩子在博物館舉止得體<br>　The children behaved appropriately at the museum. | q09：客人抱怨時飯店員工應對得當<br>　The hotel staff responded appropriately when the guest complained.<br>q15：我們穿雨鞋舊衣服適當打扮<br>　It had rained all week, so the path was muddy, and we had to dress appropriately in boots and old clothes. | q09：主詞、情境、句型<br>q15：主詞、情境、句型 | 通過 |
| muddy | 狗帶著沾泥的腳掌進來<br>　The dog came in with muddy paws. | q15：下了一週雨、河邊小路很泥濘<br>　It had rained all week, so the path was muddy, and we had to dress appropriately in boots and old clothes.<br>q17：雨後走公園鞋子沾泥／去爺爺農場的路冬天泥濘<br>　My shoes got muddy when I walked through the park after the rain. / The road to my grandparents' farm becomes muddy every winter. | q15：主詞、情境、句型<br>q17：主詞、情境、句型 | 通過 |
| unacceptable | 一週遲到三次無法接受<br>　Being late three times a week is unacceptable. | q13：打其他球員是不可接受的行為<br>　Hitting other players is unacceptable behavior, and the referee sent him off.<br>q15：老師說把垃圾丟進河裡不可接受<br>　Our teacher said that throwing rubbish into the river is unacceptable, and she was genuinely shocked by how much plastic we found. | q13：主詞、情境、句型<br>q15：主詞、情境、句型 | 通過 |
| swift | 公司迅速決定關店<br>　The company made a swift decision to close the store. | q10：公車很快、二十分鐘到機場<br>　The bus service was swift: we got to the airport in twenty minutes.<br>q15：天氣變化很快、太陽出來曬乾小路<br>　The change in weather, however, was swift: after lunch, the sun came out and dried the path. | q10：主詞、情境、句型<br>q15：主詞、情境、句型 | 通過 |
| decorative | 牆上的裝飾磁磚來自西班牙<br>　The decorative tiles on the kitchen wall came from Spain. | q14：這些小燈只是裝飾、不太亮<br>　These small lights are only decorative; they don't give much light.<br>q15：撿到有人掉的裝飾盤<br>　We also found a decorative plate that someone had lost, which made everyone laugh. | q14：主詞、情境、句型<br>q15：主詞、情境、句型 | 通過 |
| uncommon | 現在手寫信很少見<br>　Letters written by hand are uncommon these days. | q12：這一帶很少下雪<br>　Snow is uncommon in this part of the country.<br>q15：城市裡河邊看到野鴨很少見<br>　Seeing wild ducks is uncommon in the city, but we saw two. | q12：主詞、情境、句型<br>q15：主詞、情境、句型 | 通過 |
| gradual | 去年物價逐漸上漲<br>　There was a gradual rise in prices last year. | q15：河水在變乾淨但很慢<br>　The river is getting cleaner, but the change is gradual.<br>q16：她的英文逐漸進步<br>　There has been a gradual improvement in her English. / Her English is showing gradual improvement. | q15：主詞、情境、句型<br>q16：情境、句型 | 通過 |

同課題目互比（9 題；事件摘要逐題人工判定互不相同；腳本找「同目標字且主詞、句型都相同」的兩題：0 組）

| 題號 | 事件摘要 |
|---|---|
| q09 | appropriately：客人抱怨時飯店員工應對得當 |
| q10 | swift：公車很快、二十分鐘到機場 |
| q11 | genuinely：她見到老朋友真的很開心 |
| q12 | uncommon：這一帶很少下雪 |
| q13 | unacceptable：打其他球員是不可接受的行為 |
| q14 | decorative：這些小燈只是裝飾、不太亮 |
| q15 | genuinely：老師對塑膠垃圾真的很震驚；appropriately：我們穿雨鞋舊衣服適當打扮；muddy：下了一週雨、河邊小路很泥濘；unacceptable：老師說把垃圾丟進河裡不可接受；swift：天氣變化很快、太陽出來曬乾小路；decorative：撿到有人掉的裝飾盤；uncommon：城市裡河邊看到野鴨很少見；gradual：河水在變乾淨但很慢 |
| q16 | gradual：她的英文逐漸進步 |
| q17 | muddy：雨後走公園鞋子沾泥／去爺爺農場的路冬天泥濘 |

#### b2-u42-l06

| 目標字 | 單字卡情境 | 其他題情境 | 換了哪幾項 | 判定 |
|---|---|---|---|---|
| casually | 她隨口提到要搬去日本<br>　She casually mentioned that she was moving to Japan. | q15：乘客和司機隨意聊天<br>　The drivers seem happier too, and many riders now chat casually with them.<br>q16：他穿得很隨便去參加婚禮<br>　He went to the wedding dressed very casually. / He dressed very casually for the wedding. | q15：主詞、情境、句型<br>q16：主詞、情境、句型 | 通過 |
| hybrid | 花園裡有聞起來像檸檬的混種玫瑰<br>　The garden has a hybrid rose that smells of lemon. | q13：混合式課程可到教室或線上<br>　This hybrid class lets students join either in the room or online.<br>q15：市府買了五十輛油電公車<br>　Last year, the city bought fifty hybrid buses that use both electricity and petrol. | q13：主詞、情境、句型<br>q15：主詞、情境、句型 | 通過 |
| reflective | 平靜的湖水像鏡子一樣反光<br>　The calm water of the lake was reflective like a mirror. | q15：公車側面塗了反光漆<br>　Each bus has reflective paint on its sides, so drivers can see it easily at night.<br>q17：常在新辦公大樓看到反光窗／手錶錶面在陽光下反光<br>　I often see reflective windows on new office buildings. / My watch has a reflective face that shines in the sun. | q15：主詞、情境、句型<br>q17：主詞、情境、句型 | 通過 |
| loosely | 把繩子綁鬆一點讓樹能長（祈使）<br>　Tie the rope loosely so the young tree can still grow. | q10：襯衫寬鬆熱天穿舒服<br>　The shirt fits loosely, so it's comfortable on hot days. | q10：主詞、情境、句型 | 通過 |
| chaotic | 特賣第一天一片混亂<br>　The first day of the sale was chaotic. | q09：雙胞胎出生後家裡一團亂<br>　Life at home became chaotic when the twins were born.<br>q15：以前早上交通很混亂<br>　Morning traffic in our city used to be chaotic, with cars, scooters and buses all fighting for space. | q09：主詞、情境、句型<br>q15：主詞、情境、句型 | 通過 |
| hollow | 巧克力蛋通常是空心的<br>　Chocolate eggs are usually hollow inside. | q12：樹幹是空的、鳥一家住裡面<br>　The tree trunk was hollow, and a family of birds lived inside. | q12：主詞、情境、句型 | 通過 |
| upright | 降落前把椅背豎直<br>　Please put your seat in the upright position before landing. | q11：請站直看鏡頭（祈使）<br>　Stand upright and look at the camera, please.<br>q15：腳踏車要直立放在特別角落<br>　Riders can bring their bikes on board, but they must keep them upright in a special corner. | q11：主詞、情境、句型<br>q15：主詞、情境、句型 | 通過 |
| distortion | 新聞報導扭曲了事實<br>　The news report was a distortion of what really happened. | q14：舊鏡子讓臉看起來變寬<br>　The old mirror causes some distortion, so your face looks wider than it is. | q14：主詞、情境、句型 | 通過 |

同課題目互比（9 題；事件摘要逐題人工判定互不相同；腳本找「同目標字且主詞、句型都相同」的兩題：0 組）

| 題號 | 事件摘要 |
|---|---|
| q09 | chaotic：雙胞胎出生後家裡一團亂 |
| q10 | loosely：襯衫寬鬆熱天穿舒服 |
| q11 | upright：請站直看鏡頭（祈使） |
| q12 | hollow：樹幹是空的、鳥一家住裡面 |
| q13 | hybrid：混合式課程可到教室或線上 |
| q14 | distortion：舊鏡子讓臉看起來變寬 |
| q15 | casually：乘客和司機隨意聊天；hybrid：市府買了五十輛油電公車；reflective：公車側面塗了反光漆；chaotic：以前早上交通很混亂；upright：腳踏車要直立放在特別角落 |
| q16 | casually：他穿得很隨便去參加婚禮 |
| q17 | reflective：常在新辦公大樓看到反光窗／手錶錶面在陽光下反光 |

#### b2-u42-l07

| 目標字 | 單字卡情境 | 其他題情境 | 換了哪幾項 | 判定 |
|---|---|---|---|---|
| mock | 兄弟拿枕頭假裝打架<br>　The two brothers had a mock fight with pillows. | q10：學校辦模擬面試讓學生練習<br>　Our school held mock interviews so students could practice before applying for real jobs.<br>q15：先在院子用舊床單搭假帳篷練習<br>　We had practiced in our garden with a mock tent made of old sheets, but putting up the tent still took three tries. | q10：主詞、情境、句型<br>q15：主詞、情境、句型 | 通過 |
| harmless | 只是無害的玩笑、大家都笑了<br>　It was just a harmless joke, and everyone laughed. | q15：嚮導說帳篷旁的蛇無害<br>　In the morning, my brother screamed when he saw a snake near the tent, but our guide said it was harmless, and soon it moved away. | q15：主詞、情境、句型 | 通過 |
| rightly | 她理所當然以第一本書為榮<br>　She was rightly proud of her first book. | q11：球迷賽後為年輕守門員歡呼<br>　The fans rightly cheered for the young goalkeeper after the game.<br>q15：嚮導正確決定提早走回去<br>　Our guide rightly decided that we should walk back early, and we reached the car just before the storm got even worse. | q11：主詞、情境、句型<br>q15：主詞、情境、句型 | 通過 |
| boiling | 水滾了再放米（祈使）<br>　Add the rice when the water is boiling. | q09：外面熱得要命、帶瓶水<br>　It's boiling outside today, so take a bottle of water with you. | q09：主詞、情境、句型 | 通過 |
| foul | 冰箱傳出難聞的味道<br>　A foul smell was coming from the fridge. | q15：中午天氣變得很惡劣<br>　Around noon, the weather turned foul, with strong wind and heavy rain. | q15：主詞、情境、句型 | 通過 |
| unsuccessful | 找走失的貓沒有結果<br>　The search for the missing cat was unsuccessful. | q13：失敗兩次後終於考過駕照<br>　After two unsuccessful attempts, he finally passed his driving test.<br>q17：第一次烤麵包失敗／修腳踏車沒修好<br>　My first attempt to bake bread was unsuccessful. / I tried to fix my bike myself, but I was unsuccessful. | q13：主詞、情境、句型<br>q17：主詞、情境 | 通過 |
| ineffective | 對狗大吼沒用、牠繼續叫<br>　Shouting at the dog was ineffective; it kept barking. | q14：便宜的傘遇強風沒用<br>　The cheap umbrella was completely ineffective against the strong wind.<br>q15：帶去的防蚊液沒效<br>　The bug spray we brought was ineffective, so the insects bit us all night. | q14：主詞、情境、句型<br>q15：主詞、情境、句型 | 通過 |
| coarse | 他的頭髮又粗又黑<br>　He has coarse, dark hair like his father. | q12：這種麵包用粗麵粉做<br>　This brown bread is made from coarse flour.<br>q16：舊毛巾摸起來很粗糙<br>　This old towel feels very coarse. / This old towel is coarse to the touch. | q12：主詞、情境、句型<br>q16：主詞、情境、句型 | 通過 |

同課題目互比（9 題；事件摘要逐題人工判定互不相同；腳本找「同目標字且主詞、句型都相同」的兩題：0 組）

| 題號 | 事件摘要 |
|---|---|
| q09 | boiling：外面熱得要命、帶瓶水 |
| q10 | mock：學校辦模擬面試讓學生練習 |
| q11 | rightly：球迷賽後為年輕守門員歡呼 |
| q12 | coarse：這種麵包用粗麵粉做 |
| q13 | unsuccessful：失敗兩次後終於考過駕照 |
| q14 | ineffective：便宜的傘遇強風沒用 |
| q15 | mock：先在院子用舊床單搭假帳篷練習；harmless：嚮導說帳篷旁的蛇無害；rightly：嚮導正確決定提早走回去；foul：中午天氣變得很惡劣；ineffective：帶去的防蚊液沒效 |
| q16 | coarse：舊毛巾摸起來很粗糙 |
| q17 | unsuccessful：第一次烤麵包失敗／修腳踏車沒修好 |

#### b2-u42-l08

| 目標字 | 單字卡情境 | 其他題情境 | 換了哪幾項 | 判定 |
|---|---|---|---|---|
| shaky | 演講前他雙手發抖<br>　His hands were shaky before the speech. | q12：梯子看起來不穩、我幫忙扶著<br>　The ladder looked shaky, so I held it for my neighbor. | q12：主詞、情境、句型 | 通過 |
| novelty | 二十年前電動車還是新奇的東西<br>　Electric cars were a novelty twenty years ago. | q14：對孩子來說騎馬很新鮮<br>　For the city children, riding a horse was a real novelty.<br>q15：離開前買了塔形的新奇筆<br>　Before we left, many of us bought novelty pens shaped like the tower. | q14：主詞、情境、句型<br>q15：主詞、情境、句型 | 通過 |
| twisted | 餅乾烤成扭轉的形狀<br>　These cookies are baked in a twisted shape. | q11：電話線全纏在一起<br>　The long phone cable was all twisted and hard to use.<br>q15：爬塔時經過扭曲變形的舊鐵門<br>　To reach the top of the tower, we climbed narrow stairs and passed a twisted old iron gate. | q11：主詞、情境、句型<br>q15：主詞、情境、句型 | 通過 |
| glamorous | 新購物中心晚上光鮮亮麗<br>　The new shopping mall looks glamorous at night. | q10：當電影明星看起來光鮮但工時很長<br>　Being a film star looks glamorous, but the working hours are very long.<br>q15：宮殿曾是當地最豪華的住所<br>　Last spring, our class visited an old palace in the mountains that was once the most glamorous home in the area. | q10：主詞、情境、句型<br>q15：主詞、情境、句型 | 通過 |
| narrowly | 新公園計畫在投票中險勝<br>　The plan for a new park narrowly won the town vote. | q15：一個男生滑倒、差點摔下去<br>　One boy slipped and narrowly avoided falling, so after that we all held the rope.<br>q17：差點錯過公車／數學考試勉強及格<br>　I narrowly missed the bus this morning. / I narrowly passed my math test last year. | q15：主詞、情境、句型<br>q17：主詞、情境、句型 | 通過 |
| lousy | 因為噪音睡得很差<br>　I had a lousy night's sleep because of the noise. | q15：咖啡館的咖啡很難喝<br>　In the café, the coffee was lousy, but the view of the valley was wonderful.<br>q16：這部電影結局很爛<br>　The ending of this movie is lousy. / This movie has a really lousy ending. | q15：主詞、情境、句型<br>q16：主詞、情境、句型 | 通過 |
| uneven | 牆上的漆看起來不均勻<br>　The paint on the wall looks uneven. | q13：舊路不平、到處是洞<br>　The old road is uneven and full of holes, so ride carefully. | q13：主詞、情境、句型 | 通過 |
| exquisite | 那套茶具很精緻<br>　The tea set on the table was exquisite. | q09：那位歌手的嗓音很優美<br>　The singer has an exquisite voice that fills the whole hall.<br>q15：牆上畫滿精緻的花鳥畫<br>　The walls were covered in exquisite paintings of birds and flowers, and the guide showed us a wooden door that an artist had carved by hand long ago. | q09：主詞、情境、句型<br>q15：主詞、情境、句型 | 通過 |

同課題目互比（9 題；事件摘要逐題人工判定互不相同；腳本找「同目標字且主詞、句型都相同」的兩題：0 組）

| 題號 | 事件摘要 |
|---|---|
| q09 | exquisite：那位歌手的嗓音很優美 |
| q10 | glamorous：當電影明星看起來光鮮但工時很長 |
| q11 | twisted：電話線全纏在一起 |
| q12 | shaky：梯子看起來不穩、我幫忙扶著 |
| q13 | uneven：舊路不平、到處是洞 |
| q14 | novelty：對孩子來說騎馬很新鮮 |
| q15 | novelty：離開前買了塔形的新奇筆；twisted：爬塔時經過扭曲變形的舊鐵門；glamorous：宮殿曾是當地最豪華的住所；narrowly：一個男生滑倒、差點摔下去；lousy：咖啡館的咖啡很難喝；exquisite：牆上畫滿精緻的花鳥畫 |
| q16 | lousy：這部電影結局很爛 |
| q17 | narrowly：差點錯過公車／數學考試勉強及格 |

#### b2-u43-l01

| 目標字 | 單字卡情境 | 其他題情境 | 換了哪幾項 | 判定 |
|---|---|---|---|---|
| predictable | 故事結局從第一頁就猜得到<br>　The ending of the story was predictable from the first page. | q10：家裡的貓每天傍晚六點在門邊等<br>　Our cat is very predictable: it waits by the door at six every evening.<br>q17：平日早晨很固定／弟弟的回答總是猜得到<br>　My weekday mornings are very predictable. / My little brother's answers are always predictable. | q10：主詞、情境、句型<br>q17：主詞、情境、句型 | 通過 |
| proponent | 她大力支持學校供應免費午餐<br>　She is a strong proponent of free school meals. | q15：爺爺支持用老方法看天氣<br>　My grandfather is a proponent of old ways of guessing the weather.<br>q16：叔叔一直支持騎腳踏車上班<br>　My uncle has always been a proponent of cycling to work. / My uncle has long been a proponent of riding a bike to work. | q15：主詞、情境、句型<br>q16：主詞、情境、句型 | 通過 |
| wit | 他以反應快、風趣出名<br>　He is known for his quick wit. | q12：她的機智讓冗長會議變有趣<br>　Her sharp wit made the long meeting much more fun.<br>q15：爺爺用一貫的風趣回答手機沒出過門<br>　When I told him the weather report on the radio was more reliable, he answered with his usual wit: "The radio has never been outside." | q12：主詞、情境、句型<br>q15：主詞、情境、句型 | 通過 |
| coincidence | 真巧，我們訂了同一家飯店<br>　What a coincidence! We booked the same hotel. | q15：爺爺說隔天天氣差、果然下雨，也許只是巧合<br>　Maybe it was just a coincidence, but I had to admit he was right. | q15：主詞、情境、句型 | 通過 |
| analogy | 把大腦比作電腦是常見的比喻<br>　Comparing the brain to a computer is a common analogy. | q13：老師把電和水管裡的水做類比<br>　The teacher made a clever analogy between electricity and water moving through pipes.<br>q15：爺爺說看天空就像看朋友的臉<br>　He explained his ideas with an analogy: reading the sky is like reading a friend's face. | q13：主詞、情境、句型<br>q15：主詞、情境、句型 | 通過 |
| unaware | 我不知道那家店已經關了<br>　I was unaware that the shop had closed. | q09：很多駕駛不知道新的速限<br>　Many drivers are still unaware of the new speed limit.<br>q14：戴耳機完全沒聽到後面的喇叭聲<br>　Wearing headphones, he was completely unaware of the car horn behind him. | q09：主詞、情境、句型<br>q14：主詞、情境、句型 | 通過 |
| predictor | 過去銷售數字預測未來銷售<br>　Past sales are a useful predictor of future sales. | q15：傍晚紅色天空預示隔天晴天<br>　He says that a red sky in the evening is a good predictor of a sunny day, and that cows lie down before rain. | q15：主詞、情境、句型 | 通過 |
| sensible | 春天帶把傘是明智的<br>　It's sensible to carry an umbrella in spring. | q11：騎腳踏車戴安全帽是明智的選擇<br>　Wearing a helmet on a bike is the sensible choice.<br>q15：最明智的是兩邊都參考<br>　Still, I think the sensible thing is to listen to both him and the radio. | q11：主詞、情境、句型<br>q15：主詞、情境、句型 | 通過 |

同課題目互比（9 題；事件摘要逐題人工判定互不相同；腳本找「同目標字且主詞、句型都相同」的兩題：0 組）

| 題號 | 事件摘要 |
|---|---|
| q09 | unaware：很多駕駛不知道新的速限 |
| q10 | predictable：家裡的貓每天傍晚六點在門邊等 |
| q11 | sensible：騎腳踏車戴安全帽是明智的選擇 |
| q12 | wit：她的機智讓冗長會議變有趣 |
| q13 | analogy：老師把電和水管裡的水做類比 |
| q14 | unaware：戴耳機完全沒聽到後面的喇叭聲 |
| q15 | proponent：爺爺支持用老方法看天氣；wit：爺爺用一貫的風趣回答手機沒出過門；coincidence：爺爺說隔天天氣差、果然下雨，也許只是巧合；analogy：爺爺說看天空就像看朋友的臉；predictor：傍晚紅色天空預示隔天晴天；sensible：最明智的是兩邊都參考 |
| q16 | proponent：叔叔一直支持騎腳踏車上班 |
| q17 | predictable：平日早晨很固定／弟弟的回答總是猜得到 |

#### b2-u43-l02

| 目標字 | 單字卡情境 | 其他題情境 | 換了哪幾項 | 判定 |
|---|---|---|---|---|
| anticipation | 孩子們滿心期待假期<br>　The children waited for the holiday with great anticipation. | q09：新手機期待了好幾週、幾小時就賣光<br>　After weeks of anticipation, the new phone sold out in hours.<br>q15：球隊選新隊長前大家很期待<br>　There was a lot of anticipation before our basketball team chose a new captain. | q09：主詞、情境、句型<br>q15：主詞、情境、句型 | 通過 |
| unwilling | 他不願意把車借我<br>　He was unwilling to lend me his car. | q10：叔叔不願晚上開車、眼睛會累<br>　My uncle is unwilling to drive at night because his eyes get tired.<br>q15：一開始有些隊員不願聽新隊長的話<br>　At first, some players were unwilling to listen to her, and they clearly underestimated her. | q10：主詞、情境、句型<br>q15：主詞、情境、句型 | 通過 |
| exaggerate | 別誇張，那條魚沒那麼大（祈使）<br>　Don't exaggerate; the fish wasn't that big. | q12：朋友講好笑的故事時常誇大<br>　My friend tends to exaggerate when he tells funny stories.<br>q15：Tomas 承認以前會誇大自己的實力<br>　Tomas is now keen to play better, and he admits that he used to exaggerate how good he was. | q12：主詞、情境、句型<br>q15：主詞、情境、句型 | 通過 |
| decisive | 她的演講是贏得投票的關鍵<br>　Her speech was decisive in winning the vote. | q13：找到舊地圖是解開謎團的關鍵一步<br>　Finding the old map was the decisive step in solving the mystery.<br>q15：Mia 安靜但很果斷<br>　Mia is a quiet thinker, but she is also decisive. | q13：主詞、情境、句型<br>q15：主詞、情境、句型 | 通過 |
| deliberate | 刻意決定不買車過生活<br>　It was a deliberate decision to live without a car. | q14：那個錯不是故意的、他只是忘了<br>　The mistake was not deliberate; he simply forgot to send the email.<br>q15：那次調整是事先想好的計畫<br>　She told me later that it was a deliberate plan, not luck. | q14：主詞、情境、句型<br>q15：主詞、情境、句型 | 通過 |
| thinker | 她是愛讀歷史的深度思考者<br>　She is a deep thinker who reads a lot of history. | q15：Mia 是安靜的思考者<br>　Mia is a quiet thinker, but she is also decisive. | q15：主詞、情境、句型 | 通過 |
| underestimate | 遊客低估沙漠夜晚有多冷<br>　Many visitors underestimate how cold the desert gets at night. | q15：隊員小看了新隊長<br>　At first, some players were unwilling to listen to her, and they clearly underestimated her.<br>q16：我們低估了搬家的花費<br>　We underestimated how much moving house would cost. / We underestimated the cost of moving house. | q15：主詞、情境、句型<br>q16：主詞、情境、句型 | 通過 |
| keen | 哥哥熱衷攝影<br>　My brother is keen on photography. | q11：她對好設計眼光很敏銳<br>　She has a keen eye for good design.<br>q15：Tomas 現在很想打得更好<br>　Tomas is now keen to play better, and he admits that he used to exaggerate how good he was.<br>q17：很想今年夏天去山上／和朋友想組樂團<br>　I'm keen to visit the mountains this summer. / My friends and I are keen to start a band. | q11：主詞、情境、句型<br>q15：主詞、情境、句型<br>q17：主詞、情境、句型 | 通過 |

同課題目互比（9 題；事件摘要逐題人工判定互不相同；腳本找「同目標字且主詞、句型都相同」的兩題：0 組）

| 題號 | 事件摘要 |
|---|---|
| q09 | anticipation：新手機期待了好幾週、幾小時就賣光 |
| q10 | unwilling：叔叔不願晚上開車、眼睛會累 |
| q11 | keen：她對好設計眼光很敏銳 |
| q12 | exaggerate：朋友講好笑的故事時常誇大 |
| q13 | decisive：找到舊地圖是解開謎團的關鍵一步 |
| q14 | deliberate：那個錯不是故意的、他只是忘了 |
| q15 | anticipation：球隊選新隊長前大家很期待；unwilling：一開始有些隊員不願聽新隊長的話；exaggerate：Tomas 承認以前會誇大自己的實力；decisive：Mia 安靜但很果斷；deliberate：那次調整是事先想好的計畫；thinker：Mia 是安靜的思考者；underestimate：隊員小看了新隊長；keen：Tomas 現在很想打得更好 |
| q16 | underestimate：我們低估了搬家的花費 |
| q17 | keen：很想今年夏天去山上／和朋友想組樂團 |

#### b2-u43-l03

| 目標字 | 單字卡情境 | 其他題情境 | 換了哪幾項 | 判定 |
|---|---|---|---|---|
| critically | 她挑剔地看自己的畫、重畫<br>　She looked critically at her drawing and started again. | q15：媒體課學批判地看廣告<br>　In our media class last month, we learned to read advertisements critically.<br>q17：聽建議前批判思考／買手機前仔細比價<br>　I think critically about advice before I follow it. / I compare prices critically before I buy a new phone. | q15：主詞、情境、句型<br>q17：主詞、情境、句型 | 通過 |
| misleading | 他的笑容會騙人、其實很生氣<br>　His smile was misleading; he was actually very angry. | q11：車站指標誤導、我們搭錯車<br>　The signs at the station were misleading, so we took the wrong train.<br>q15：果汁廣告說天然、其實大多是糖<br>　The words said "Full of natural fruit," but the drink was mostly sugar, so the ad was misleading. | q11：主詞、情境、句型<br>q15：主詞、情境、句型 | 通過 |
| coincide | 我和姊姊的答案完全一致<br>　My answer and my sister's answer coincided exactly. | q10：音樂會和考試撞期<br>　The concert coincides with my exam, so I can't go.<br>q15：這堂課剛好碰上鎮上大特賣<br>　The lesson happened to coincide with a big sale in town, so we had plenty of examples. | q10：主詞、情境、句型<br>q15：主詞、情境、句型 | 通過 |
| paradox | 選擇越多越難選<br>　Here's a paradox: the more choices a shop offers, the harder it is to choose. | q09：空閒時間多了卻覺得更忙<br>　Having more free time but feeling busier is a strange paradox. | q09：主詞、情境、句型 | 通過 |
| discriminate | 好廚師分辨得出多種鹽<br>　Good cooks can discriminate between many kinds of salt. | q15：學會分辨事實和意見<br>　By the end, we could discriminate between facts and opinions, and each of us wrote a short, coherent review of an ad.<br>q16：這隻狗能分辨不同的車聲<br>　This dog can discriminate between the sounds of different cars. / This dog is able to discriminate between different car sounds. | q15：主詞、情境、句型<br>q16：主詞、情境 | 通過 |
| understandable | 等了三小時生氣可以理解<br>　His anger was understandable after waiting three hours. | q12：上班第一天緊張可以理解<br>　It's understandable to feel nervous before your first day at work.<br>q15：人們相信廣告可以理解<br>　It is understandable that people believe ads, because they look so nice. | q12：主詞、情境、句型<br>q15：主詞、情境、句型 | 通過 |
| coherent | 球隊明年需要一套連貫的計畫<br>　The team needs a coherent plan for the next year. | q14：他睏到說話幾乎不成句<br>　He was so sleepy that what he said was hardly coherent.<br>q15：每人寫一篇條理清楚的短評<br>　By the end, we could discriminate between facts and opinions, and each of us wrote a short, coherent review of an ad. | q14：主詞、情境、句型<br>q15：主詞、情境、句型 | 通過 |
| ambiguity | 遊戲規則有些地方不明確<br>　There is some ambiguity in the rules of the game. | q13：訊息模稜兩可、大家理解不同<br>　The message had some ambiguity, so we each understood it differently.<br>q15：「最低半價」這句話有歧義<br>　We also found ambiguity in the phrase "up to half off": only a few things were really that cheap. | q13：主詞、情境、句型<br>q15：主詞、情境、句型 | 通過 |

同課題目互比（9 題；事件摘要逐題人工判定互不相同；腳本找「同目標字且主詞、句型都相同」的兩題：0 組）

| 題號 | 事件摘要 |
|---|---|
| q09 | paradox：空閒時間多了卻覺得更忙 |
| q10 | coincide：音樂會和考試撞期 |
| q11 | misleading：車站指標誤導、我們搭錯車 |
| q12 | understandable：上班第一天緊張可以理解 |
| q13 | ambiguity：訊息模稜兩可、大家理解不同 |
| q14 | coherent：他睏到說話幾乎不成句 |
| q15 | critically：媒體課學批判地看廣告；misleading：果汁廣告說天然、其實大多是糖；coincide：這堂課剛好碰上鎮上大特賣；discriminate：學會分辨事實和意見；understandable：人們相信廣告可以理解；coherent：每人寫一篇條理清楚的短評；ambiguity：「最低半價」這句話有歧義 |
| q16 | discriminate：這隻狗能分辨不同的車聲 |
| q17 | critically：聽建議前批判思考／買手機前仔細比價 |

#### b2-u43-l04

| 目標字 | 單字卡情境 | 其他題情境 | 換了哪幾項 | 判定 |
|---|---|---|---|---|
| ambiguous | 考題模稜兩可、老師給大家分<br>　One question on the test was ambiguous, so the teacher gave everyone the point. | q15：海報標題模稜兩可<br>　Some classmates misunderstood our poster and thought we said music was bad for plants, because the title was ambiguous. | q15：主詞、情境、句型 | 通過 |
| puzzled | 廚房怪聲讓他一臉困惑<br>　He looked puzzled by the strange noise from the kitchen. | q15：兩盆植物結果不同、我們很困惑<br>　We were puzzled until we noticed that the sunlight in the room was uneven. | q15：主詞、情境、句型 | 通過 |
| negatively | 下雨天讓冰淇淋銷量變差<br>　The rainy weather affected ice cream sales negatively. | q12：多數學生對新規定看法負面<br>　The new rule was viewed negatively by most students.<br>q15：沒有人負面反應<br>　Even so, nobody reacted negatively, and the teacher liked our honest report. | q12：主詞、情境、句型<br>q15：主詞、情境、句型 | 通過 |
| contradictory | 爸媽選校的建議互相矛盾<br>　My parents gave me contradictory advice about which school to choose. | q13：兩份報告一說河乾淨一說髒<br>　The two reports were contradictory: one said the river was clean, and the other said it was dirty.<br>q15：植物實驗結果互相矛盾<br>　Two plants listened to music every day, but the results were contradictory: one grew fast, while the other hardly grew at all. | q13：主詞、情境、句型<br>q15：主詞、情境、句型 | 通過 |
| foresee | 沒人預料到遊戲會這麼紅<br>　Nobody could foresee how popular the game would become. | q10：沒料到會塞車、晚一小時到<br>　We didn't foresee the heavy traffic, so we arrived an hour late.<br>q15：沒料到一扇窗陽光多很多<br>　We had not foreseen that one window got much more sun. | q10：主詞、情境、句型<br>q15：主詞、情境、句型 | 通過 |
| proven | 她的廚藝經證實、贏過三次比賽<br>　Her cooking skills are proven; she has won three contests. | q14：地球繞太陽是已證實的事實<br>　It is a proven fact that the earth goes around the sun.<br>q15：兩盆植物證明不了什麼<br>　Our teacher said that two plants had not proven anything, and that we should test twenty next time. | q14：主詞、情境、句型<br>q15：主詞、情境、句型 | 通過 |
| irrational | 對電腦生氣是不理性的<br>　Getting angry at a computer is irrational. | q09：擔心改變不了的事不理性<br>　It's irrational to worry about things you cannot change.<br>q16：妹妹怕打雷、知道不理性<br>　My sister's fear of thunder is irrational, and she knows it. / My sister knows that her fear of thunder is irrational. | q09：主詞、情境、句型<br>q16：主詞、情境 | 通過 |
| misunderstand | 別誤會，我喜歡你的點子（祈使）<br>　Please don't misunderstand me; I like your idea. | q11：很多人誤解我的工作<br>　Many people misunderstand what my job really is.<br>q15：同學誤解海報意思<br>　Some classmates misunderstood our poster and thought we said music was bad for plants, because the title was ambiguous.<br>q17：朋友誤會我的玩笑／記錯派對時間早到<br>　My friend misunderstood my joke and got upset. / I once misunderstood the time of the party and arrived early. | q11：主詞、情境、句型<br>q15：主詞、情境、句型<br>q17：主詞、情境、句型 | 通過 |

同課題目互比（9 題；事件摘要逐題人工判定互不相同；腳本找「同目標字且主詞、句型都相同」的兩題：0 組）

| 題號 | 事件摘要 |
|---|---|
| q09 | irrational：擔心改變不了的事不理性 |
| q10 | foresee：沒料到會塞車、晚一小時到 |
| q11 | misunderstand：很多人誤解我的工作 |
| q12 | negatively：多數學生對新規定看法負面 |
| q13 | contradictory：兩份報告一說河乾淨一說髒 |
| q14 | proven：地球繞太陽是已證實的事實 |
| q15 | ambiguous：海報標題模稜兩可；puzzled：兩盆植物結果不同、我們很困惑；negatively：沒有人負面反應；contradictory：植物實驗結果互相矛盾；foresee：沒料到一扇窗陽光多很多；proven：兩盆植物證明不了什麼；misunderstand：同學誤解海報意思 |
| q16 | irrational：妹妹怕打雷、知道不理性 |
| q17 | misunderstand：朋友誤會我的玩笑／記錯派對時間早到 |

#### b2-u43-l05

| 目標字 | 單字卡情境 | 其他題情境 | 換了哪幾項 | 判定 |
|---|---|---|---|---|
| reckon | 問對方估計舊腳踏車值多少<br>　How much do you reckon this old bike is worth? | q10：認為新咖啡店會很忙、因為咖啡便宜<br>　I reckon the new café will be busy, because the coffee there is cheap.<br>q15：寵物店老闆認為魚能記好幾個月<br>　The owner of our local pet shop, who is very attentive to his fish, reckons they can remember things for months.<br>q17：我猜這週末會出太陽／我猜弟弟又會遲到<br>　I reckon it will be sunny this weekend. / I reckon my brother will be late again. | q10：主詞、情境、句型<br>q15：主詞、情境、句型<br>q17：主詞、情境、句型 | 通過 |
| muse | 他常想著要搬去鄉下<br>　He often muses about moving to the countryside. | q15：妹妹坐在魚缸旁想魚還記得什麼<br>　Now she sits by the tank and muses about what else they might remember. | q15：主詞、情境、句型 | 通過 |
| discredit | 一名球員犯錯讓全隊失去信用<br>　The whole team was discredited by one player's mistake. | q14：有人在網路散播謊言抹黑小麵包店<br>　Someone spread lies online to discredit the small bakery.<br>q15：科學家做的測試推翻舊說法<br>　Some scientists have also done tests that discredit the old idea. | q14：主詞、情境、句型<br>q15：主詞、情境、句型 | 通過 |
| doubtful | 我對他開餐廳的計畫存疑<br>　I'm doubtful about his plan to open a restaurant. | q13：事情還很多、懷疑能準時完成<br>　I'm doubtful that we'll finish on time; there's still so much to do.<br>q15：妹妹一開始不太相信<br>　My little sister was doubtful at first, but after watching the fish for ten minutes, she willingly changed her mind. | q13：情境、句型<br>q15：主詞、情境、句型 | 通過 |
| disregard | 他完全無視規則<br>　He showed a total disregard for the rules. | q09：在海灘亂丟垃圾是不尊重自然<br>　Throwing rubbish on the beach shows a disregard for nature. | q09：主詞、情境、句型 | 通過 |
| willingly | 她心甘情願讓座給抱嬰兒的媽媽<br>　She willingly gave up her seat to a mother with a baby. | q15：妹妹看了十分鐘後願意改變想法<br>　My little sister was doubtful at first, but after watching the fish for ten minutes, she willingly changed her mind.<br>q16：他心甘情願週六留下來加班<br>　He willingly stayed late at work on Saturday. / On Saturday, he willingly stayed at work after hours. | q15：主詞、情境、句型<br>q16：主詞、情境、句型 | 通過 |
| misconception | 以為成年人學不會語言是常見誤解<br>　A common misconception is that adults cannot learn a new language. | q12：以為便宜的食物一定不好是誤解<br>　There's a misconception that cheap food is always bad.<br>q15：魚只能記三秒是常見誤解<br>　Many people believe that pet fish can only remember things for three seconds, but this is a common misconception. | q12：主詞、情境、句型<br>q15：主詞、情境、句型 | 通過 |
| attentive | 服務生很周到、常幫我們加水<br>　The waiter was very attentive and filled our glasses again and again. | q11：好的聽者很專心、不看手機<br>　Good listeners are attentive and don't look at their phones.<br>q15：老闆很用心照顧他的魚<br>　The owner of our local pet shop, who is very attentive to his fish, reckons they can remember things for months. | q11：主詞、情境、句型<br>q15：主詞、情境、句型 | 通過 |

同課題目互比（9 題；事件摘要逐題人工判定互不相同；腳本找「同目標字且主詞、句型都相同」的兩題：0 組）

| 題號 | 事件摘要 |
|---|---|
| q09 | disregard：在海灘亂丟垃圾是不尊重自然 |
| q10 | reckon：認為新咖啡店會很忙、因為咖啡便宜 |
| q11 | attentive：好的聽者很專心、不看手機 |
| q12 | misconception：以為便宜的食物一定不好是誤解 |
| q13 | doubtful：事情還很多、懷疑能準時完成 |
| q14 | discredit：有人在網路散播謊言抹黑小麵包店 |
| q15 | reckon：寵物店老闆認為魚能記好幾個月；muse：妹妹坐在魚缸旁想魚還記得什麼；discredit：科學家做的測試推翻舊說法；doubtful：妹妹一開始不太相信；willingly：妹妹看了十分鐘後願意改變想法；misconception：魚只能記三秒是常見誤解；attentive：老闆很用心照顧他的魚 |
| q16 | willingly：他心甘情願週六留下來加班 |
| q17 | reckon：我猜這週末會出太陽／我猜弟弟又會遲到 |

#### b2-u43-l06

| 目標字 | 單字卡情境 | 其他題情境 | 換了哪幾項 | 判定 |
|---|---|---|---|---|
| persuasion | 廣告是一種說服<br>　Advertising is a form of persuasion. | q15：弟弟用盡各種說服方法<br>　My brother used every kind of persuasion he could think of.<br>q17：費了好大功夫說服朋友入社／稍微勸一下弟弟就洗碗<br>　It took me a lot of persuasion to get my friend to join the club. / With a little persuasion, I got my brother to wash the dishes. | q15：主詞、情境、句型<br>q17：主詞、情境、句型 | 通過 |
| pessimistic | 她對今年找到工作很悲觀<br>　She is pessimistic about finding a job this year. | q11：別那麼悲觀、考試可能比想像簡單（祈使）<br>　Don't be so pessimistic; the test might be easier than you think.<br>q15：爸爸悲觀地說雞會太吵<br>　Dad was pessimistic and said the birds would make too much noise, and Mom worried about a foul smell. | q11：主詞、情境、句型<br>q15：主詞、情境、句型 | 通過 |
| worldview | 每個文化有自己的世界觀<br>　Every culture has its own worldview. | q10：爺爺世界觀不同但仍愛一起聊天<br>　My grandfather's worldview is very different from mine, but we still enjoy talking.<br>q16：這本書改變了我的世界觀<br>　Reading this book changed my worldview. / This book has changed my worldview. | q10：主詞、情境、句型<br>q16：主詞、情境、句型 | 通過 |
| obsessive | 他對保持書桌整齊很執著<br>　He is obsessive about keeping his desk tidy. | q14：整天數步數還記下來、越來越著迷<br>　He counts his steps all day and writes down every number; it's becoming obsessive.<br>q15：弟弟近乎著迷地讀養雞資料<br>　He made a chart showing how many eggs we could get, and he read about chickens in an almost obsessive way. | q14：情境、句型<br>q15：情境、句型 | 通過 |
| disapproval | 關閉圖書館的計畫遭民眾強烈反對<br>　The plan to close the library met with strong disapproval. | q15：雞吵醒爸爸、他只輕嘆一聲表示不滿<br>　Now we have three chickens, and Dad's only sign of disapproval is a small sigh when they wake him up early. | q15：主詞、情境、句型 | 通過 |
| predictive | 手機的預測輸入會猜下一個字<br>　My phone has predictive text that guesses my next word. | q09：商店用預測工具猜顧客會買什麼<br>　Shops use predictive tools to guess what customers will buy. | q09：主詞、情境、句型 | 通過 |
| conceivable | 試了所有想得到的方法修印表機<br>　We tried every conceivable way to fix the old printer. | q13：那家店可能會關、但希望不會<br>　It's conceivable that the shop will close, but I hope it won't.<br>q15：爸媽漸漸覺得計畫可能行得通<br>　In the end, it became conceivable to my parents that the plan might work. | q13：主詞、情境、句型<br>q15：主詞、情境、句型 | 通過 |
| disapprove | 有些老師不贊成上課用手機<br>　Some teachers disapprove of using phones in class. | q12：鄰居很不贊成十點後放大聲音樂<br>　Loud music after ten is something our neighbors strongly disapprove of.<br>q15：爸媽一開始不贊成養雞<br>　My parents disapproved at first. | q12：主詞、情境、句型<br>q15：主詞、情境、句型 | 通過 |

同課題目互比（9 題；事件摘要逐題人工判定互不相同；腳本找「同目標字且主詞、句型都相同」的兩題：0 組）

| 題號 | 事件摘要 |
|---|---|
| q09 | predictive：商店用預測工具猜顧客會買什麼 |
| q10 | worldview：爺爺世界觀不同但仍愛一起聊天 |
| q11 | pessimistic：別那麼悲觀、考試可能比想像簡單（祈使） |
| q12 | disapprove：鄰居很不贊成十點後放大聲音樂 |
| q13 | conceivable：那家店可能會關、但希望不會 |
| q14 | obsessive：整天數步數還記下來、越來越著迷 |
| q15 | persuasion：弟弟用盡各種說服方法；pessimistic：爸爸悲觀地說雞會太吵；obsessive：弟弟近乎著迷地讀養雞資料；disapproval：雞吵醒爸爸、他只輕嘆一聲表示不滿；conceivable：爸媽漸漸覺得計畫可能行得通；disapprove：爸媽一開始不贊成養雞 |
| q16 | worldview：這本書改變了我的世界觀 |
| q17 | persuasion：費了好大功夫說服朋友入社／稍微勸一下弟弟就洗碗 |

#### b2-u43-l07

| 目標字 | 單字卡情境 | 其他題情境 | 換了哪幾項 | 判定 |
|---|---|---|---|---|
| improbable | 一個會說話的狗的離奇故事在學校流傳<br>　An improbable story about a talking dog went around the school. | q15：舅舅說反正不太可能贏過她<br>　He also said it was improbable that he could ever win an argument against her.<br>q16：他準時到的可能性不大<br>　It is improbable that he will arrive on time. / It's improbable that he will be on time. | q15：主詞、情境、句型<br>q16：主詞、情境、句型 | 通過 |
| generalize | 孩子從聽到的字歸納文法規則<br>　Children learn to generalize grammar rules from the words they hear. | q11：別只去一次就對城市下定論（祈使）<br>　Try not to generalize about a city after one short visit.<br>q15：不能從一兩個青少年推論全部<br>　"You can't generalize from one or two teenagers," she told him. | q11：主詞、情境、句型<br>q15：主詞、情境、句型 | 通過 |
| exaggeration | 說隊伍排了一英里長是誇張<br>　Saying the line was a mile long is an exaggeration. | q15：表妹說舅舅的話太誇張<br>　My cousin, who is an optimist and a big reader, said that was an exaggeration.<br>q17：弟弟說吃了整個蛋糕是誇張／說房間亂七八糟有點誇張<br>　My brother said he ate a whole cake, which was an exaggeration. / Calling my room a mess is a bit of an exaggeration. | q15：主詞、情境<br>q17：主詞、情境 | 通過 |
| refute | 公司駁斥文章裡的說法<br>　The claims in the article were refuted by the company. | q14：哥哥想反駁我卻拿不出事實<br>　My brother tried to refute my point, but he had no facts.<br>q15：表妹用圖書館數字反駁舅舅<br>　She then refuted his point with numbers from the library: more young people borrowed books this year than last year. | q14：主詞、情境、句型<br>q15：主詞、情境、句型 | 通過 |
| knowingly | 他明知故犯賣出壞掉的手機<br>　He knowingly sold a broken phone to a customer. | q15：舅舅會意地笑了<br>　My uncle smiled knowingly and admitted that it was just a harmless way to start a lively conversation. | q15：主詞、情境、句型 | 通過 |
| coherence | 那場演講缺乏條理、想法跳來跳去<br>　The speech lacked coherence; the ideas jumped around. | q09：電影畫面美但故事不連貫<br>　The film had beautiful pictures but little coherence in its story. | q09：主詞、情境、句型 | 通過 |
| optimist | 爸爸是凡事往好處想的樂觀者<br>　My father is an optimist who always expects the best. | q13：連輸十場教練仍對本季樂觀<br>　Even after losing ten games in a row, the coach remained an optimist about the season.<br>q15：表妹是樂觀又愛讀書的人<br>　My cousin, who is an optimist and a big reader, said that was an exaggeration. | q13：主詞、情境、句型<br>q15：主詞、情境、句型 | 通過 |
| figurative | 「下貓下狗」是比喻的說法<br>　"It's raining cats and dogs" is a figurative expression. | q10：說包包重一噸是比喻<br>　When I said my bag weighs a ton, I was being figurative.<br>q12：詩人用比喻語言寫愛情<br>　Poets often use figurative language to describe love. | q10：主詞、情境、句型<br>q12：主詞、情境、句型 | 通過 |

同課題目互比（9 題；事件摘要逐題人工判定互不相同；腳本找「同目標字且主詞、句型都相同」的兩題：0 組）

| 題號 | 事件摘要 |
|---|---|
| q09 | coherence：電影畫面美但故事不連貫 |
| q10 | figurative：說包包重一噸是比喻 |
| q11 | generalize：別只去一次就對城市下定論（祈使） |
| q12 | figurative：詩人用比喻語言寫愛情 |
| q13 | optimist：連輸十場教練仍對本季樂觀 |
| q14 | refute：哥哥想反駁我卻拿不出事實 |
| q15 | improbable：舅舅說反正不太可能贏過她；generalize：不能從一兩個青少年推論全部；exaggeration：表妹說舅舅的話太誇張；refute：表妹用圖書館數字反駁舅舅；knowingly：舅舅會意地笑了；optimist：表妹是樂觀又愛讀書的人 |
| q16 | improbable：他準時到的可能性不大 |
| q17 | exaggeration：弟弟說吃了整個蛋糕是誇張／說房間亂七八糟有點誇張 |

#### b2-u43-l08

| 目標字 | 單字卡情境 | 其他題情境 | 換了哪幾項 | 判定 |
|---|---|---|---|---|
| suspiciously | 價格低得可疑<br>　The price of the watch was suspiciously low. | q15：老闆走來走去懷疑地看每個人<br>　Our boss walked around looking at everyone suspiciously.<br>q16：貓懷疑地聞新食物<br>　The cat smelled the new food suspiciously. / The cat suspiciously smelled its new food. | q15：主詞、情境、句型<br>q16：主詞、情境、句型 | 通過 |
| purposeful | 書裡每個練習都簡短而有目的<br>　Each exercise in the book is short and purposeful. | q15：同事朝會議室堅定地走去<br>　She found chocolate on the door handle of the meeting room and walked toward it in a purposeful way. | q15：主詞、情境、句型 | 通過 |
| impossibility | 一天做完這份工作是不可能的事<br>　Finishing the job in one day is an impossibility. | q09：小孩靜坐一小時幾乎不可能<br>　For a small child, sitting still for an hour is almost an impossibility. | q09：主詞、情境 | 通過 |
| overestimate | 別高估自己的力氣、搬重箱要找人幫（祈使）<br>　Don't overestimate your strength; ask for help with the heavy box. | q10：高估來的人數、一半椅子空著<br>　We overestimated how many people would come, so half the chairs were empty.<br>q17：高估寫功課速度／高估空閒時間答應太多事<br>　I overestimated how fast I could finish my homework. / I overestimated my free time and said yes to too many plans. | q10：主詞、情境、句型<br>q17：主詞、情境、句型 | 通過 |
| deduce | 你能從三條線索推出答案嗎<br>　Can you deduce the answer from these three clues? | q14：從門邊沾泥的鞋推斷兒子出去過<br>　From the muddy shoes by the door, she could deduce that her son had been outside.<br>q15：同事想推理是誰拿了蛋糕<br>　One of my colleagues loves mystery stories, so she tried to deduce who had taken it. | q14：主詞、情境、句型<br>q15：主詞、情境、句型 | 通過 |
| predicate | 他的論點建立在舊資料上<br>　His argument is predicated on old information. | q11：整個創業計畫以便宜房租為前提<br>　The two friends predicated their whole business plan on cheap rent. | q11：主詞、情境、句型 | 通過 |
| unwise | 對裁判大吼是不明智的舉動<br>　Shouting at the referee was an unwise move. | q12：第一天就把錢花光很不明智<br>　It was unwise of me to spend all my money on the first day.<br>q15：老闆承認那麼快怪人不明智<br>　Everyone laughed, and the boss admitted that it had been unwise to blame people so quickly. | q12：主詞、情境、句型<br>q15：主詞、情境、句型 | 通過 |
| unforeseen | 意外狀況迫使球隊取消比賽<br>　Unforeseen circumstances forced the team to cancel today's match. | q13：車子出了意外的問題、旅費變多<br>　The trip cost more than planned because of unforeseen problems with the car.<br>q15：冰箱出了沒料到的問題<br>　It turned out that the cleaning team had moved it because of an unforeseen problem with our lousy old fridge: it had stopped working overnight. | q13：主詞、情境、句型<br>q15：主詞、情境、句型 | 通過 |

同課題目互比（9 題；事件摘要逐題人工判定互不相同；腳本找「同目標字且主詞、句型都相同」的兩題：0 組）

| 題號 | 事件摘要 |
|---|---|
| q09 | impossibility：小孩靜坐一小時幾乎不可能 |
| q10 | overestimate：高估來的人數、一半椅子空著 |
| q11 | predicate：整個創業計畫以便宜房租為前提 |
| q12 | unwise：第一天就把錢花光很不明智 |
| q13 | unforeseen：車子出了意外的問題、旅費變多 |
| q14 | deduce：從門邊沾泥的鞋推斷兒子出去過 |
| q15 | suspiciously：老闆走來走去懷疑地看每個人；purposeful：同事朝會議室堅定地走去；deduce：同事想推理是誰拿了蛋糕；unwise：老闆承認那麼快怪人不明智；unforeseen：冰箱出了沒料到的問題 |
| q16 | suspiciously：貓懷疑地聞新食物 |
| q17 | overestimate：高估寫功課速度／高估空閒時間答應太多事 |

#### b2-u43-l09

| 目標字 | 單字卡情境 | 其他題情境 | 換了哪幾項 | 判定 |
|---|---|---|---|---|
| obsess | 他過分在意別人怎麼看他<br>　He obsesses about what other people think of him. | q14：別為小錯糾結、每個人都會犯（祈使）<br>　Try not to obsess over small mistakes; everyone makes them.<br>q15：阿姨一心想為奶奶生日彈難曲<br>　Now she obsesses over playing a difficult piece for my grandmother's birthday. | q14：主詞、情境、句型<br>q15：主詞、情境、句型 | 通過 |
| referent | 這句裡 she 指的是老師<br>　In this sentence, the referent of "she" is the teacher. | q12：問自己每個代名詞指的是什麼（祈使）<br>　Ask yourself what the referent of each pronoun is. | q12：主詞、情境 | 通過 |
| achievable | 這麼短時間這計畫做得到嗎<br>　Is this plan achievable in such a short time? | q13：多練習就能贏得歌唱比賽<br>　With more practice, winning the school singing contest is achievable.<br>q15：老師要阿姨定小而做得到的目標<br>　Her teacher told her to set small, achievable goals, like learning one short song a month.<br>q17：夏天前跑五公里／存錢買新手機做得到<br>　Running five kilometers by summer is an achievable goal for me. / I think saving enough money for a new phone is achievable. | q13：主詞、情境、句型<br>q15：主詞、情境、句型<br>q17：主詞、情境、句型 | 通過 |
| regrettably | 很遺憾博物館週一休館<br>　The museum, regrettably, is closed on Mondays. | q09：很遺憾班機因霧取消<br>　Our flight has regrettably been cancelled because of fog.<br>q15：可惜舊鋼琴不穩又走音<br>　Regrettably, her old piano was a bit shaky and out of tune, so she bought a new one. | q09：主詞、情境、句型<br>q15：主詞、情境、句型 | 通過 |
| unconcerned | 貓對巨響毫不在意<br>　The cat seemed unconcerned by the loud noise. | q15：表哥說她會放棄、阿姨不在意<br>　My cousin, who is a pessimist, said she would give up within a month, but my aunt seemed unconcerned.<br>q16：他對明天的考試毫不在意<br>　He is unconcerned about tomorrow's exam. / He seems completely unconcerned about the exam tomorrow. | q15：主詞、情境、句型<br>q16：主詞、情境、句型 | 通過 |
| mystify | 天空的怪光讓大家困惑<br>　The strange lights in the sky mystified everyone. | q10：魔術師的戲法到現在還想不通<br>　How the magician did the trick still mystifies me.<br>q15：她進步那麼快讓大家想不通<br>　What mystified all of us was how fast she got better. | q10：主詞、情境、句型<br>q15：主詞、情境、句型 | 通過 |
| pessimist | 悲觀的人總預期最壞的事<br>　A pessimist expects the worst to happen. | q11：別聽他的、他什麼事都悲觀（祈使）<br>　Don't listen to him; he's a pessimist about everything.<br>q15：表哥是悲觀的人<br>　My cousin, who is a pessimist, said she would give up within a month, but my aunt seemed unconcerned. | q11：主詞、情境、句型<br>q15：主詞、情境、句型 | 通過 |
| attentively | 她簽約前仔細讀合約<br>　She read the contract attentively before signing it. | q15：阿姨每堂課都專心聽<br>　My aunt listened attentively in every lesson, and she practiced every evening. | q15：主詞、情境、句型 | 通過 |

同課題目互比（9 題；事件摘要逐題人工判定互不相同；腳本找「同目標字且主詞、句型都相同」的兩題：0 組）

| 題號 | 事件摘要 |
|---|---|
| q09 | regrettably：很遺憾班機因霧取消 |
| q10 | mystify：魔術師的戲法到現在還想不通 |
| q11 | pessimist：別聽他的、他什麼事都悲觀（祈使） |
| q12 | referent：問自己每個代名詞指的是什麼（祈使） |
| q13 | achievable：多練習就能贏得歌唱比賽 |
| q14 | obsess：別為小錯糾結、每個人都會犯（祈使） |
| q15 | obsess：阿姨一心想為奶奶生日彈難曲；achievable：老師要阿姨定小而做得到的目標；regrettably：可惜舊鋼琴不穩又走音；unconcerned：表哥說她會放棄、阿姨不在意；mystify：她進步那麼快讓大家想不通；pessimist：表哥是悲觀的人；attentively：阿姨每堂課都專心聽 |
| q16 | unconcerned：他對明天的考試毫不在意 |
| q17 | achievable：夏天前跑五公里／存錢買新手機做得到 |

#### b2-u43-l10

| 目標字 | 單字卡情境 | 其他題情境 | 換了哪幾項 | 判定 |
|---|---|---|---|---|
| thoughtless | 忘了你生日是我不體貼<br>　It was thoughtless of me to forget your birthday. | q09：一句欠考慮的話能傷人好幾年<br>　A thoughtless comment can hurt someone for years.<br>q15：聽說主廚對年輕記者不太體貼<br>　I was nervous because some people say she can be thoughtless with young reporters, but I tried not to prejudge her. | q09：主詞、情境、句型<br>q15：主詞、情境、句型 | 通過 |
| overemphasize | 那份報告過分強調小問題<br>　The report overemphasizes small problems and ignores big ones. | q15：主廚說烹飪節目太強調高級廚具<br>　She told me that cooking shows overemphasize fancy tools, and that, from her point of view, a sharp knife is all you need.<br>q16：老師說不該過分強調分數<br>　The teacher said that we shouldn't overemphasize grades. / Our teacher told us not to overemphasize scores. | q15：主詞、情境、句型<br>q16：主詞、情境、句型 | 通過 |
| offhand | 她隨口提到要離職<br>　She mentioned offhand that she was leaving the company. | q15：主廚說菜單有幾道菜一時說不上來<br>　When I asked how many dishes were on her menu, she said she couldn't tell me offhand. | q15：主詞、情境、句型 | 通過 |
| prejudge | 別只看第一頁就評斷一本書（祈使）<br>　Don't prejudge a book by its first page. | q14：評審答應舞跳完前不先評斷舞者<br>　The judges promised not to prejudge any dancer before the dance was over.<br>q15：作者試著不先對主廚下定論<br>　I was nervous because some people say she can be thoughtless with young reporters, but I tried not to prejudge her. | q14：主詞、情境、句型<br>q15：主詞、情境、句型 | 通過 |
| quotable | 她的新書好笑又有很多金句<br>　Her new book is funny and very quotable. | q13：演講短但金句多、報紙引用很多<br>　The speech was short but very quotable; newspapers printed many of its lines.<br>q15：主廚說的話很值得引用<br>　She was friendly and very quotable: "Good food is just honest food," she said. | q13：主詞、情境、句型<br>q15：主詞、情境、句型 | 通過 |
| mistrustful | 老狗一開始不信任陌生人<br>　Our old dog is mistrustful of strangers at first. | q12：她在網路上被騙錢後不再相信求助信<br>　After losing money online, she became mistrustful of emails asking for help.<br>q15：不信任名人的朋友也想讀<br>　Even my friend Kai, who is mistrustful of famous people, wanted to read the interview. | q12：主詞、情境、句型<br>q15：主詞、情境 | 通過 |
| point of view | 試著從我的角度看問題（祈使）<br>　Try to see the problem from my point of view. | q11：從孩子的角度來看旅程太長<br>　From a child's point of view, the trip was far too long.<br>q15：主廚認為一把利刀就夠<br>　She told me that cooking shows overemphasize fancy tools, and that, from her point of view, a sharp knife is all you need. | q11：主詞、情境、句型<br>q15：主詞、情境、句型 | 通過 |
| recommendable | 兩本字典哪本較值得推薦給學生<br>　Which of these two dictionaries is more recommendable for students? | q15：主廚說鎮上哪些便宜小店值得推薦<br>　She also gave me some of her exquisite little cakes and told me which cheap places in town were recommendable.<br>q17：學校旁麵包店適合當快速早餐／這本書值得推薦給學英文的人<br>　The bakery near my school is recommendable for a quick breakfast. / I find this book recommendable to anyone learning English. | q15：主詞、情境、句型<br>q17：主詞、情境、句型 | 通過 |

同課題目互比（8 題；事件摘要逐題人工判定互不相同；腳本找「同目標字且主詞、句型都相同」的兩題：0 組）

| 題號 | 事件摘要 |
|---|---|
| q09 | thoughtless：一句欠考慮的話能傷人好幾年 |
| q11 | point of view：從孩子的角度來看旅程太長 |
| q12 | mistrustful：她在網路上被騙錢後不再相信求助信 |
| q13 | quotable：演講短但金句多、報紙引用很多 |
| q14 | prejudge：評審答應舞跳完前不先評斷舞者 |
| q15 | thoughtless：聽說主廚對年輕記者不太體貼；overemphasize：主廚說烹飪節目太強調高級廚具；offhand：主廚說菜單有幾道菜一時說不上來；prejudge：作者試著不先對主廚下定論；quotable：主廚說的話很值得引用；mistrustful：不信任名人的朋友也想讀；point of view：主廚認為一把利刀就夠；recommendable：主廚說鎮上哪些便宜小店值得推薦 |
| q16 | overemphasize：老師說不該過分強調分數 |
| q17 | recommendable：學校旁麵包店適合當快速早餐／這本書值得推薦給學英文的人 |

#### b2-u44-l01

| 目標字 | 單字卡情境 | 其他題情境 | 換了哪幾項 | 判定 |
|---|---|---|---|---|
| sincere | 請接受我真誠的感謝<br>　Please accept my sincere thanks for your help. | q11：他的道歉聽起來真誠、我原諒他<br>　His apology sounded sincere, so I forgave him.<br>q15：表姊說社員的善意是真心的<br>　My cousin now has many friends, and she says their kindness was sincere. | q11：主詞、情境、句型<br>q15：主詞、情境、句型 | 通過 |
| calmly | 大家匆忙時他平靜吃完早餐<br>　He calmly finished his breakfast while everyone else rushed. | q13：燈熄了機長仍冷靜對乘客說話<br>　Even when the lights went out, the pilot spoke calmly to the passengers.<br>q15：有社員走失時領隊冷靜應對<br>　When one member got lost, he calmly called him and soon found him. | q13：主詞、情境、句型<br>q15：情境、句型 | 通過 |
| vigorously | 使用前用力搖瓶子（祈使）<br>　Shake the bottle vigorously before use. | q10：用力刷鍋但黑印沒掉<br>　I cleaned the pan vigorously, but the black marks didn't come off.<br>q15：每週日精力充沛地健行好幾小時<br>　Every Sunday, they hike vigorously for hours. | q10：主詞、情境、句型<br>q15：主詞、情境、句型 | 通過 |
| loneliness | 這首歌唱長途旅程的孤單<br>　The song is about the loneliness of a long journey. | q14：夜班警衛漸漸習慣工作的孤單<br>　The night guard slowly got used to the loneliness of his job.<br>q15：表姊到大城市第一個月很孤單<br>　When my cousin moved to a big city for university, she felt a deep loneliness in her first month. | q14：主詞、情境<br>q15：主詞、情境、句型 | 通過 |
| honorable | 他是信守每個承諾的正直的人<br>　He was an honorable man who kept every promise. | q09：承認錯誤是正直的選擇<br>　Admitting your mistake is always the honorable choice. | q09：主詞、情境、句型 | 通過 |
| nervously | 面試前他緊張地笑<br>　He laughed nervously before the interview. | q12：小狗在新家緊張地東張西望<br>　The puppy looked around nervously in its new home.<br>q15：表姊在課堂上說話很緊張<br>　She did not know anyone, spoke nervously in class, and became pessimistic about making friends.<br>q17：緊張地等考試結果／手發抖地拆信<br>　I waited nervously for my test results. / My hands shook as I nervously opened the letter. | q12：主詞、情境、句型<br>q15：主詞、情境、句型<br>q17：主詞、情境、句型 | 通過 |
| awe | 她對姊姊的天分佩服不已<br>　She is in awe of her older sister's talent. | q15：站在山頂驚嘆地看雲海<br>　On the first trip, she stood in awe at the top of a mountain, looking at the clouds below. | q15：情境、句型 | 通過 |
| disposition | 我們的狗天性溫和<br>　Our dog has a gentle disposition. | q16：弟弟天性開朗很少生氣<br>　My brother has a cheerful disposition and rarely gets angry. / My little brother has a happy disposition and is rarely angry. | q16：主詞、情境、句型 | 通過 |

同課題目互比（9 題；事件摘要逐題人工判定互不相同；腳本找「同目標字且主詞、句型都相同」的兩題：0 組）

| 題號 | 事件摘要 |
|---|---|
| q09 | honorable：承認錯誤是正直的選擇 |
| q10 | vigorously：用力刷鍋但黑印沒掉 |
| q11 | sincere：他的道歉聽起來真誠、我原諒他 |
| q12 | nervously：小狗在新家緊張地東張西望 |
| q13 | calmly：燈熄了機長仍冷靜對乘客說話 |
| q14 | loneliness：夜班警衛漸漸習慣工作的孤單 |
| q15 | sincere：表姊說社員的善意是真心的；calmly：有社員走失時領隊冷靜應對；vigorously：每週日精力充沛地健行好幾小時；loneliness：表姊到大城市第一個月很孤單；nervously：表姊在課堂上說話很緊張；awe：站在山頂驚嘆地看雲海 |
| q16 | disposition：弟弟天性開朗很少生氣 |
| q17 | nervously：緊張地等考試結果／手發抖地拆信 |

#### b2-u44-l02

| 目標字 | 單字卡情境 | 其他題情境 | 換了哪幾項 | 判定 |
|---|---|---|---|---|
| sob | 小女孩弄丟氣球啜泣<br>　The little girl sobbed when she lost her balloon. | q12：聽到隔壁房間有人小聲哭<br>　I heard someone sobbing quietly in the next room. | q12：主詞、情境、句型 | 通過 |
| ignorant | 那句無知的話讓很多人不高興<br>　It was an ignorant comment that upset many people. | q15：很多老師承認之前不知道這個問題<br>　Many teachers admitted that they had been ignorant of the problem.<br>q16：我對車子一無所知<br>　I am completely ignorant about cars. / I'm totally ignorant when it comes to cars. | q15：主詞、情境、句型<br>q16：主詞、情境、句型 | 通過 |
| worrying | 食物價格上漲令人擔心<br>　There has been a worrying rise in food prices. | q13：河水位低對農夫來說令人擔心<br>　The low water level in the river is worrying for farmers this year.<br>q15：學校調查結果令人擔心<br>　Last year, a survey at our school showed a worrying result: one in five students said that someone had tried to bully them. | q13：主詞、情境、句型<br>q15：主詞、情境、句型 | 通過 |
| bully | 魚缸裡大魚欺負小魚<br>　Big fish sometimes bully smaller fish in the tank. | q15：五分之一學生說有人想欺負他們<br>　Last year, a survey at our school showed a worrying result: one in five students said that someone had tried to bully them. / The goal of no bullying at all may not be fully achievable, but students say that the school feels much friendlier now. | q15：主詞、情境、句型 | 通過 |
| youthful | 她穿著打扮很年輕<br>　She dresses in a youthful style. | q11：老戲院整修後有年輕的新面貌<br>　The old theater got a youthful new look after the repairs.<br>q15：負責的美術老師六十多歲仍充滿朝氣<br>　It is run by our art teacher, who is over sixty but still has a youthful energy. | q11：主詞、情境、句型<br>q15：主詞、情境、句型 | 通過 |
| eagerly | 她迫不及待接受派對邀請<br>　She eagerly accepted the invitation to the party. | q10：孩子們在窗邊熱切等爸爸回家<br>　The children waited eagerly at the window for their father to come home.<br>q15：學伴熱心帶作者參觀學校<br>　My buddy, a cheerful senior with a big smile, eagerly showed me around on my first day and sat with me at lunch. | q10：主詞、情境、句型<br>q15：主詞、情境、句型 | 通過 |
| desperation | 他要求多一點時間時聲音透著絕望<br>　There was desperation in his voice when he asked for more time. | q09：她急得挨家挨戶敲門找貓<br>　She knocked on every door in the street in desperation, looking for her cat. | q09：主詞、情境、句型 | 通過 |
| agony | 看我們隊最後一秒輸球很煎熬<br>　Watching our team lose in the last second was agony. | q14：比賽最後一公里對累腿是折磨<br>　The last kilometer of the race was pure agony for my tired legs.<br>q17：班機延誤十二小時的等待／三小時無聊會議很煎熬<br>　Waiting at the airport during a twelve-hour delay was agony. / Sitting through the boring three-hour meeting was agony for me. | q14：主詞、情境、句型<br>q17：主詞、情境 | 通過 |

同課題目互比（9 題；事件摘要逐題人工判定互不相同；腳本找「同目標字且主詞、句型都相同」的兩題：0 組）

| 題號 | 事件摘要 |
|---|---|
| q09 | desperation：她急得挨家挨戶敲門找貓 |
| q10 | eagerly：孩子們在窗邊熱切等爸爸回家 |
| q11 | youthful：老戲院整修後有年輕的新面貌 |
| q12 | sob：聽到隔壁房間有人小聲哭 |
| q13 | worrying：河水位低對農夫來說令人擔心 |
| q14 | agony：比賽最後一公里對累腿是折磨 |
| q15 | ignorant：很多老師承認之前不知道這個問題；worrying：學校調查結果令人擔心；bully：五分之一學生說有人想欺負他們；youthful：負責的美術老師六十多歲仍充滿朝氣；eagerly：學伴熱心帶作者參觀學校 |
| q16 | ignorant：我對車子一無所知 |
| q17 | agony：班機延誤十二小時的等待／三小時無聊會議很煎熬 |

#### b2-u44-l03

| 目標字 | 單字卡情境 | 其他題情境 | 換了哪幾項 | 判定 |
|---|---|---|---|---|
| arrogant | 他傲慢到從不聽人說話<br>　He is so arrogant that he never listens to anyone. | q12：別自大、每個人都會犯錯（祈使）<br>　Don't be arrogant; everyone makes mistakes.<br>q15：學生以為當過名演員的老師會很傲慢<br>　Our new drama teacher used to be a famous actor, so at first some students thought she might be arrogant. | q12：主詞、情境、句型<br>q15：主詞、情境、句型 | 通過 |
| humiliation | 當著全辦公室被糾正讓他很丟臉<br>　Being corrected in front of the whole office was a humiliation for him. | q15：男生忘詞、老師沒讓他難堪<br>　When one boy forgot his lines on stage, she did not let him feel any humiliation; she made a joke and helped him continue. | q15：主詞、情境、句型 | 通過 |
| adore | 妹妹超愛她的新小貓<br>　My little sister adores her new kitten. | q10：奶奶熱愛園藝、每天早上照顧花<br>　My grandmother adores gardening; she spends every morning outside with her flowers.<br>q15：老師非常喜歡和年輕人一起工作<br>　She is compassionate and patient, and she adores working with young people.<br>q17：超愛奶奶做的菜／超愛老電影<br>　I absolutely adore my grandmother's cooking. / I adore old movies, especially funny ones. | q10：主詞、情境、句型<br>q15：主詞、情境、句型<br>q17：主詞、情境、句型 | 通過 |
| compassionate | 熱心的鄰居在我們搬來時送食物<br>　A compassionate neighbor brought us food when we moved in. | q15：老師有同情心又有耐心<br>　She is compassionate and patient, and she adores working with young people.<br>q16：她是很有同情心的人<br>　She is very compassionate toward others. / She is a very compassionate person. | q15：主詞、情境、句型<br>q16：主詞、情境、句型 | 通過 |
| aspire | 她立志當飛行員<br>　She aspires to become a pilot. | q09：很多年輕球員渴望進國家隊<br>　Many young players aspire to play for the national team.<br>q15：很多學生希望能演得像老師<br>　How she remembers all eighty of our names still mystifies us, and many of us now aspire to act like her. | q09：主詞、情境、句型<br>q15：主詞、情境、句型 | 通過 |
| generosity | 車壞了、陌生人的慷慨讓我們感動<br>　We were touched by the generosity of strangers when our car broke down. | q14：靠當地人慷慨捐款、學校募到蓋圖書館的錢<br>　Thanks to the generosity of local people, the school raised enough money for a new library.<br>q15：老師自己出錢買戲服<br>　She even buys our costumes with her own money, and we are all thankful for her generosity. | q14：主詞、情境<br>q15：主詞、情境、句型 | 通過 |
| irresponsible | 他太不負責、照顧不好班上植物<br>　He was too irresponsible to look after the class plants. | q11：他弄丟辦公室鑰匙很不負責<br>　It was irresponsible of him to lose the keys to the office.<br>q13：整晚把小孩單獨留在家不負責任<br>　Leaving young children alone at home all night is irresponsible.<br>q15：老師說沒準備就讓人上台不負責任<br>　She says it would be irresponsible to send anyone on stage before they are ready. | q11：主詞、情境、句型<br>q13：主詞、情境、句型<br>q15：主詞、情境、句型 | 通過 |
| expressive | 舞蹈是很有表現力的藝術<br>　Dance is a very expressive art form. | q15：老師示範臉不說話也能很有表情<br>　In her first class, she showed us how expressive a face can be without any words. | q15：主詞、情境、句型 | 通過 |

同課題目互比（9 題；事件摘要逐題人工判定互不相同；腳本找「同目標字且主詞、句型都相同」的兩題：0 組）

| 題號 | 事件摘要 |
|---|---|
| q09 | aspire：很多年輕球員渴望進國家隊 |
| q10 | adore：奶奶熱愛園藝、每天早上照顧花 |
| q11 | irresponsible：他弄丟辦公室鑰匙很不負責 |
| q12 | arrogant：別自大、每個人都會犯錯（祈使） |
| q13 | irresponsible：整晚把小孩單獨留在家不負責任 |
| q14 | generosity：靠當地人慷慨捐款、學校募到蓋圖書館的錢 |
| q15 | arrogant：學生以為當過名演員的老師會很傲慢；humiliation：男生忘詞、老師沒讓他難堪；adore：老師非常喜歡和年輕人一起工作；compassionate：老師有同情心又有耐心；aspire：很多學生希望能演得像老師；generosity：老師自己出錢買戲服；irresponsible：老師說沒準備就讓人上台不負責任；expressive：老師示範臉不說話也能很有表情 |
| q16 | compassionate：她是很有同情心的人 |
| q17 | adore：超愛奶奶做的菜／超愛老電影 |

#### b2-u44-l04

| 目標字 | 單字卡情境 | 其他題情境 | 換了哪幾項 | 判定 |
|---|---|---|---|---|
| yearn | 在國外好幾個月後他很想見家人<br>　After months abroad, he yearned to see his family. | q15：國王後來常嚮往村裡簡單的生活<br>　In the end, he often yearned for the simple life he had seen in the village.<br>q17：渴望有天環遊世界／想念童年的長暑假<br>　I yearn to travel around the world one day. / I sometimes yearn for the long summer holidays of my childhood. | q15：情境、句型<br>q17：主詞、情境、句型 | 通過 |
| brag | 他很愛吹噓自己的廚藝<br>　He loves to brag about his cooking. | q14：他贏了比賽卻一點也不炫耀<br>　He won the race, but he didn't brag at all.<br>q15：國王愛炫耀財富<br>　Proud of his gold, he would brag to every visitor, and he spent his days idle in the palace while his people worked hard. | q14：情境、句型<br>q15：情境、句型 | 通過 |
| idle | 電影前幾分鐘空檔去買爆米花<br>　We had a few idle minutes before the film, so we bought popcorn. | q09：腳踏車整個冬天閒置在車庫<br>　My bike has been sitting idle in the garage all winter.<br>q15：國王整天在宮裡無所事事<br>　Proud of his gold, he would brag to every visitor, and he spent his days idle in the palace while his people worked hard. | q09：主詞、情境、句型<br>q15：主詞、情境、句型 | 通過 |
| patiently | 她在雨中耐心等公車<br>　She waited patiently for the bus in the rain. | q12：老師耐心講解三遍<br>　The teacher patiently explained the problem three times.<br>q15：國王回宮後耐心聽人民說話<br>　When he went back, he patiently listened to his people for the first time. | q12：主詞、情境、句型<br>q15：主詞、情境、句型 | 通過 |
| cruelty | 法律保護動物免受虐待<br>　The law protects animals from cruelty. | q13：電影呈現把野生動物關小籠子的殘忍<br>　The film shows the cruelty of keeping wild animals in small cages.<br>q15：國王看見高稅的殘酷<br>　Out in the fields, the king finally saw the cruelty of the high taxes he had set, and he felt real anguish. | q13：主詞、情境、句型<br>q15：主詞、情境、句型 | 通過 |
| indifferent | 他一臉無所謂地看完比賽<br>　He watched the end of the game with an indifferent look. | q10：哥哥對時尚沒興趣、天天穿同件外套<br>　My brother is indifferent to fashion; he wears the same jacket every day.<br>q15：國王對人民的問題漠不關心<br>　He was indifferent to their problems until a clever servant deceived him into dressing as a poor farmer for a day.<br>q16：室友對打掃完全不在乎<br>　My roommate is totally indifferent when it comes to cleaning. / My roommate couldn't be more indifferent about cleaning. | q10：主詞、情境、句型<br>q15：情境、句型<br>q16：主詞、情境、句型 | 通過 |
| deceive | 廣告用假價格欺騙顧客<br>　The ad deceived customers with false prices. | q11：別被友善的笑容騙了（祈使）<br>　Don't let a friendly smile deceive you.<br>q15：聰明的僕人騙國王扮成農夫<br>　He was indifferent to their problems until a clever servant deceived him into dressing as a poor farmer for a day. | q11：主詞、情境、句型<br>q15：主詞、情境、句型 | 通過 |
| anguish | 他為對朋友說的傷人話感到痛苦<br>　He felt anguish over the unkind words he had said to his friend. | q15：國王感到真正的痛苦<br>　Out in the fields, the king finally saw the cruelty of the high taxes he had set, and he felt real anguish. | q15：主詞、情境、句型 | 通過 |

同課題目互比（9 題；事件摘要逐題人工判定互不相同；腳本找「同目標字且主詞、句型都相同」的兩題：0 組）

| 題號 | 事件摘要 |
|---|---|
| q09 | idle：腳踏車整個冬天閒置在車庫 |
| q10 | indifferent：哥哥對時尚沒興趣、天天穿同件外套 |
| q11 | deceive：別被友善的笑容騙了（祈使） |
| q12 | patiently：老師耐心講解三遍 |
| q13 | cruelty：電影呈現把野生動物關小籠子的殘忍 |
| q14 | brag：他贏了比賽卻一點也不炫耀 |
| q15 | yearn：國王後來常嚮往村裡簡單的生活；brag：國王愛炫耀財富；idle：國王整天在宮裡無所事事；patiently：國王回宮後耐心聽人民說話；cruelty：國王看見高稅的殘酷；indifferent：國王對人民的問題漠不關心；deceive：聰明的僕人騙國王扮成農夫；anguish：國王感到真正的痛苦 |
| q16 | indifferent：室友對打掃完全不在乎 |
| q17 | yearn：渴望有天環遊世界／想念童年的長暑假 |

#### b2-u44-l05

| 目標字 | 單字卡情境 | 其他題情境 | 換了哪幾項 | 判定 |
|---|---|---|---|---|
| bitterly | 他憤恨地談起以前的工作<br>　He spoke bitterly about his old job. | q11：兩個鄰居為花園間的樹激烈爭吵<br>　The two neighbors argued bitterly about the tree between their gardens.<br>q15：有些遊客強烈抱怨食物太貴<br>　Some visitors complained bitterly about the high food prices, and the park later sent a survey to measure their dissatisfaction. | q11：主詞、情境、句型<br>q15：主詞、情境、句型 | 通過 |
| dissatisfaction | 大家對公車服務越來越不滿<br>　There is growing dissatisfaction with the bus service. | q13：顧客在網路留負評表達不滿<br>　Customers showed their dissatisfaction by leaving bad reviews online.<br>q15：樂園寄問卷了解遊客的不滿<br>　Some visitors complained bitterly about the high food prices, and the park later sent a survey to measure their dissatisfaction. | q13：主詞、情境、句型<br>q15：主詞、情境、句型 | 通過 |
| terrifying | 在結冰的山路開車很嚇人<br>　Driving on the icy mountain road was terrifying. | q09：在一千人面前演講很可怕<br>　Speaking in front of a thousand people was terrifying.<br>q15：雲霄飛車很恐怖<br>　The ride itself was terrifying, and my friend Rina started to freak out before we even reached the top of the first hill.<br>q16：那部電影最後一幕很嚇人<br>　The last scene of the film was terrifying. / The final scene of that movie is terrifying. | q09：主詞、情境<br>q15：主詞、情境、句型<br>q16：主詞、情境 | 通過 |
| amaze | 她的畫技總是讓我驚訝<br>　Her drawing skills never fail to amaze me. | q12：新火車的速度會讓你驚訝<br>　The speed of the new train will amaze you.<br>q15：夜間表演讓大家驚嘆<br>　Still, the night show amazed everyone, and we all agreed the trip was worth it. | q12：主詞、情境、句型<br>q15：主詞、情境、句型 | 通過 |
| amazingly | 那台舊車居然還很好開<br>　The old car, amazingly, still runs well. | q10：小小的店竟賣兩百多種茶<br>　Amazingly, the tiny shop sells over two hundred kinds of tea.<br>q15：工作人員居然撿到手機保管好<br>　Amazingly, a worker had found it and kept it safe. | q10：主詞、情境、句型<br>q15：主詞、情境、句型 | 通過 |
| nuisance | 夏天蚊子很煩人<br>　Mosquitoes are a nuisance in summer. | q15：排最久的隊伍真的很煩<br>　We had overestimated how many rides we could do in one day: the longest line was a real nuisance, and we waited almost two hours for one ride.<br>q17：隔壁工地噪音很煩／手機一天要充兩次電很麻煩<br>　The noise from the building site next door is a nuisance. / Having to charge my phone twice a day is a real nuisance. | q15：主詞、情境、句型<br>q17：主詞、情境、句型 | 通過 |
| frantically | 午餐尖峰時服務生忙得團團轉<br>　The waiters worked frantically during the lunch rush. | q14：下雨時大家慌忙跑去躲雨<br>　When it started to rain, people ran frantically to find shelter.<br>q15：作者在每個座位底下拚命找手機<br>　Afterwards, I realized my phone was gone, and I searched frantically under every seat. | q14：主詞、情境、句型<br>q15：主詞、情境、句型 | 通過 |
| freak | 別慌、只是一隻小蜘蛛（祈使）<br>　Don't freak out; it's only a small spider. | q15：朋友還沒到第一個坡頂就嚇壞了<br>　The ride itself was terrifying, and my friend Rina started to freak out before we even reached the top of the first hill. | q15：主詞、情境、句型 | 通過 |

同課題目互比（9 題；事件摘要逐題人工判定互不相同；腳本找「同目標字且主詞、句型都相同」的兩題：0 組）

| 題號 | 事件摘要 |
|---|---|
| q09 | terrifying：在一千人面前演講很可怕 |
| q10 | amazingly：小小的店竟賣兩百多種茶 |
| q11 | bitterly：兩個鄰居為花園間的樹激烈爭吵 |
| q12 | amaze：新火車的速度會讓你驚訝 |
| q13 | dissatisfaction：顧客在網路留負評表達不滿 |
| q14 | frantically：下雨時大家慌忙跑去躲雨 |
| q15 | bitterly：有些遊客強烈抱怨食物太貴；dissatisfaction：樂園寄問卷了解遊客的不滿；terrifying：雲霄飛車很恐怖；amaze：夜間表演讓大家驚嘆；amazingly：工作人員居然撿到手機保管好；nuisance：排最久的隊伍真的很煩；frantically：作者在每個座位底下拚命找手機；freak：朋友還沒到第一個坡頂就嚇壞了 |
| q16 | terrifying：那部電影最後一幕很嚇人 |
| q17 | nuisance：隔壁工地噪音很煩／手機一天要充兩次電很麻煩 |

#### b2-u44-l06

| 目標字 | 單字卡情境 | 其他題情境 | 換了哪幾項 | 判定 |
|---|---|---|---|---|
| despise | 她一向鄙視不誠實的行為<br>　She has always despised dishonest behavior. | q09：故事主角痛恨不公平的規定<br>　The hero of the story despises unfair rules.<br>q17：討厭有人插隊／討厭週末早起<br>　I despise it when people cut in line. / I despise waking up early on weekends. | q09：主詞、情境、句型<br>q17：主詞、情境、句型 | 通過 |
| peacefully | 兩國和平解決問題<br>　The two countries solved the problem peacefully. | q10：孩子們吵鬧時貓在沙發上安穩地睡<br>　The cat slept peacefully on the sofa while the kids played loudly around it.<br>q15：暑假結束時店裡客滿也能平靜工作<br>　By the end of the summer, I could work peacefully even when the shop was full. | q10：主詞、情境、句型<br>q15：主詞、情境、句型 | 通過 |
| psychologically | 這款遊戲在心理上設計得很巧妙<br>　The game is psychologically clever: it makes you want to keep playing. | q14：教練讓球員身心都準備好比賽<br>　The coach prepares his players both physically and psychologically for big games.<br>q15：長時間工作讓人心理上很累<br>　At first, I dreaded going to work, and the long hours were psychologically tiring. | q14：主詞、情境、句型<br>q15：主詞、情境、句型 | 通過 |
| demanding | 這門課要求很高、每晚都有作業<br>　The course is very demanding, with homework every night. | q13：照顧新生兒很累、爸媽幾乎沒得睡<br>　Looking after a newborn baby is demanding; parents hardly get any sleep.<br>q15：麵包店老闆要求很高<br>　The owner was demanding: every cake had to be perfect, and she noticed every small mistake. | q13：主詞、情境、句型<br>q15：主詞、情境、句型 | 通過 |
| irritation | 火車又誤點讓他很惱火<br>　Much to his irritation, the train was late again. | q15：打翻麵包時看到老闆臉上的不耐煩<br>　One day I dropped a whole tray of bread, and I could see the irritation on her face. | q15：主詞、情境、句型 | 通過 |
| console | 他的狗走失後什麼都安慰不了他<br>　Nothing could console him after his dog went missing. | q12：妹妹駕照沒考過、我泡茶安慰她<br>　I made tea to console my sister after she failed her driving test.<br>q15：老闆後來安慰作者<br>　Later, though, she consoled me and said that she had dropped many trays when she was young. | q12：主詞、情境、句型<br>q15：主詞、情境、句型 | 通過 |
| tolerant | 爸媽能容忍我大聲放音樂<br>　My parents are tolerant of my loud music. | q15：老闆其實比看起來寬容<br>　After that, I realized she was more tolerant than she seemed.<br>q16：我們應該對不同意見更寬容<br>　We should be more tolerant of different opinions. / We need to be more tolerant of other people's opinions. | q15：主詞、情境、句型<br>q16：主詞、情境、句型 | 通過 |
| dread | 很多學生害怕考試週<br>　Many students dread the week of final exams. | q11：很怕週末要清車庫<br>　I'm dreading cleaning out the garage this weekend, but it has to be done.<br>q15：作者一開始很怕去上班<br>　At first, I dreaded going to work, and the long hours were psychologically tiring. | q11：主詞、情境、句型<br>q15：主詞、情境、句型 | 通過 |

同課題目互比（9 題；事件摘要逐題人工判定互不相同；腳本找「同目標字且主詞、句型都相同」的兩題：0 組）

| 題號 | 事件摘要 |
|---|---|
| q09 | despise：故事主角痛恨不公平的規定 |
| q10 | peacefully：孩子們吵鬧時貓在沙發上安穩地睡 |
| q11 | dread：很怕週末要清車庫 |
| q12 | console：妹妹駕照沒考過、我泡茶安慰她 |
| q13 | demanding：照顧新生兒很累、爸媽幾乎沒得睡 |
| q14 | psychologically：教練讓球員身心都準備好比賽 |
| q15 | peacefully：暑假結束時店裡客滿也能平靜工作；psychologically：長時間工作讓人心理上很累；demanding：麵包店老闆要求很高；irritation：打翻麵包時看到老闆臉上的不耐煩；console：老闆後來安慰作者；tolerant：老闆其實比看起來寬容；dread：作者一開始很怕去上班 |
| q16 | tolerant：我們應該對不同意見更寬容 |
| q17 | despise：討厭有人插隊／討厭週末早起 |

#### b2-u44-l07

| 目標字 | 單字卡情境 | 其他題情境 | 換了哪幾項 | 判定 |
|---|---|---|---|---|
| clumsy | 他手很笨但數學很好<br>　He is clumsy with his hands but great at math. | q10：笨手笨腳的哥哥去派對路上把蛋糕摔了<br>　My clumsy brother dropped the cake on the way to the party.<br>q15：作者滑雪笨拙、幾公尺就跌倒<br>　I was so clumsy that I fell over every few meters, and I watched in amazement as small children skied past me.<br>q17：剪生日卡時拿剪刀笨手剪錯／第一堂舞蹈課一直踩到舞伴<br>　I was clumsy with the scissors and cut the birthday card in the wrong place. / I felt clumsy in my first dance class and kept stepping on my partner's feet. | q10：主詞、情境、句型<br>q15：主詞、情境、句型<br>q17：主詞、情境、句型 | 通過 |
| folly | 養三隻狗還買白地毯很蠢<br>　It was folly to buy a white carpet with three dogs in the house. | q13：這種天氣上山是愚蠢的<br>　Going up the mountain in such weather would be folly. | q13：主詞、情境、句型 | 通過 |
| dreadful | 飯店的食物糟透了<br>　The food at the hotel was dreadful. | q12：今天早上交通糟透了<br>　The traffic on my way to work this morning was dreadful.<br>q15：第二天天氣很糟<br>　On the second day, the weather was dreadful: snow fell furiously, and we could hardly see, so we all stayed inside. | q12：主詞、情境<br>q15：主詞、情境、句型 | 通過 |
| amazement | 大家驚訝的是害羞男孩贏了歌唱比賽<br>　To everyone's amazement, the shy boy won the singing contest. | q09：魔術師最後的戲法讓觀眾驚奇<br>　The magician's last trick filled the audience with amazement.<br>q15：作者驚訝地看小孩輕鬆滑過<br>　I was so clumsy that I fell over every few meters, and I watched in amazement as small children skied past me. | q09：主詞、情境、句型<br>q15：主詞、情境、句型 | 通過 |
| humiliate | 別把朋友的蠢照片放網路讓他們丟臉（祈使）<br>　Don't humiliate your friends by sharing their silly photos online. | q14：喜劇演員從不拿觀眾外表開玩笑讓人難堪<br>　The comedian never tries to humiliate people in the audience by making jokes about their looks.<br>q15：有個小孩笑作者、讓作者有點丟臉<br>　One child laughed at me, which humiliated me a little. | q14：主詞、情境、句型<br>q15：主詞、情境、句型 | 通過 |
| vanity | 她愛照鏡子、出於虛榮<br>　Her vanity made her check the mirror every few minutes. | q15：出於虛榮買了昂貴的紅色滑雪裝<br>　Out of vanity, I bought an expensive red outfit, thinking I would look like a professional. | q15：主詞、情境、句型 | 通過 |
| vigor | 她精力充沛地打掃整間房子<br>　She cleaned the whole house with great vigor. | q15：最後一天作者重新振作練習<br>　On the last day, I practiced with new vigor and finally reached the bottom of the hill without falling. | q15：主詞、情境、句型 | 通過 |
| furiously | 他拚命打字趕在中午前交報告<br>　He typed furiously to finish the report before noon. | q11：狗對送貨卡車狂吠<br>　The dog barked furiously at the delivery truck.<br>q15：雪下得猛烈<br>　On the second day, the weather was dreadful: snow fell furiously, and we could hardly see, so we all stayed inside.<br>q16：他氣沖沖地把門關上<br>　He furiously shut the door behind him. / He shut the door behind him furiously. | q11：主詞、情境、句型<br>q15：主詞、情境、句型<br>q16：情境、句型 | 通過 |

同課題目互比（9 題；事件摘要逐題人工判定互不相同；腳本找「同目標字且主詞、句型都相同」的兩題：0 組）

| 題號 | 事件摘要 |
|---|---|
| q09 | amazement：魔術師最後的戲法讓觀眾驚奇 |
| q10 | clumsy：笨手笨腳的哥哥去派對路上把蛋糕摔了 |
| q11 | furiously：狗對送貨卡車狂吠 |
| q12 | dreadful：今天早上交通糟透了 |
| q13 | folly：這種天氣上山是愚蠢的 |
| q14 | humiliate：喜劇演員從不拿觀眾外表開玩笑讓人難堪 |
| q15 | clumsy：作者滑雪笨拙、幾公尺就跌倒；dreadful：第二天天氣很糟；amazement：作者驚訝地看小孩輕鬆滑過；humiliate：有個小孩笑作者、讓作者有點丟臉；vanity：出於虛榮買了昂貴的紅色滑雪裝；vigor：最後一天作者重新振作練習；furiously：雪下得猛烈 |
| q16 | furiously：他氣沖沖地把門關上 |
| q17 | clumsy：剪生日卡時拿剪刀笨手剪錯／第一堂舞蹈課一直踩到舞伴 |

#### b2-u44-l08

| 目標字 | 單字卡情境 | 其他題情境 | 換了哪幾項 | 判定 |
|---|---|---|---|---|
| grieve | 最愛的樂團解散、歌迷很難過<br>　The fans grieved when their favorite band broke up. | q09：好朋友搬到遠方會難過是正常的<br>　It's normal to grieve when a close friend moves far away. | q09：主詞、情境、句型 | 通過 |
| gloomy | 這消息讓大家心情低落<br>　The news made everyone feel gloomy. | q12：老房子在雨中看起來陰沉<br>　The old house looked gloomy in the rain.<br>q15：出海那天天色陰沉<br>　The sky was gloomy, and before we left, the captain gave us a stern warning to stay seated when the sea was rough. | q12：主詞、情境、句型<br>q15：主詞、情境、句型 | 通過 |
| witty | 他在姊姊婚禮上的致詞很風趣<br>　He gave a witty speech at his sister's wedding. | q10：阿姨風趣的訊息讓我心情變好<br>　My aunt's witty messages always make my day better.<br>q15：賞鯨嚮導很風趣<br>　Our guide was witty, and she spoke passionately about whales. | q10：主詞、情境、句型<br>q15：主詞、情境、句型 | 通過 |
| breathtaking | 夕陽顏色美得令人屏息<br>　The colors of the sunset were breathtaking. | q15：鯨魚躍出水面的景象令人屏息<br>　It was breathtaking.<br>q16：那位歌手的聲音美得令人屏息<br>　The singer's voice was absolutely breathtaking. / That singer has a truly breathtaking voice. | q15：主詞、情境、句型<br>q16：主詞、情境、句型 | 通過 |
| passionately | 他拉小提琴很投入<br>　He plays the violin very passionately. | q15：嚮導熱情地介紹鯨魚<br>　Our guide was witty, and she spoke passionately about whales. | q15：主詞、情境、句型 | 通過 |
| stern | 教練嚴格但公平<br>　Our coach is stern but fair. | q14：半夜兩點回家、爸爸嚴厲地看我<br>　My father gave me a stern look when I came home at two in the morning.<br>q15：船長出發前嚴厲警告要坐好<br>　The sky was gloomy, and before we left, the captain gave us a stern warning to stay seated when the sea was rough. | q14：主詞、情境、句型<br>q15：主詞、情境、句型 | 通過 |
| innate | 她有天生的音樂天分<br>　She has an innate talent for music. | q11：有人認為語言能力是天生的<br>　Some people believe that language ability is innate.<br>q13：他愛整齊像是天生的、嬰兒時就排玩具<br>　His love of order seems innate; even as a baby he lined up his toys.<br>q15：小鯨魚游泳是天生的<br>　She told us that young whales do not have to be taught to swim; it is innate. | q11：主詞、情境、句型<br>q13：主詞、情境、句型<br>q15：情境、句型 | 通過 |
| consolation | 得第二名算是小小的安慰<br>　Winning second place was a small consolation. | q15：船長請熱巧克力當作受寒的安慰<br>　On the way back, the captain gave everyone hot chocolate as a consolation for the cold.<br>q17：唯一的安慰是比賽前雨停了／心情不好時狗陪著是安慰<br>　The only consolation was that the rain stopped before the game. / My dog's company is a great consolation when I feel sad. | q15：主詞、情境、句型<br>q17：主詞、情境、句型 | 通過 |

同課題目互比（9 題；事件摘要逐題人工判定互不相同；腳本找「同目標字且主詞、句型都相同」的兩題：0 組）

| 題號 | 事件摘要 |
|---|---|
| q09 | grieve：好朋友搬到遠方會難過是正常的 |
| q10 | witty：阿姨風趣的訊息讓我心情變好 |
| q11 | innate：有人認為語言能力是天生的 |
| q12 | gloomy：老房子在雨中看起來陰沉 |
| q13 | innate：他愛整齊像是天生的、嬰兒時就排玩具 |
| q14 | stern：半夜兩點回家、爸爸嚴厲地看我 |
| q15 | gloomy：出海那天天色陰沉；witty：賞鯨嚮導很風趣；breathtaking：鯨魚躍出水面的景象令人屏息；passionately：嚮導熱情地介紹鯨魚；stern：船長出發前嚴厲警告要坐好；innate：小鯨魚游泳是天生的；consolation：船長請熱巧克力當作受寒的安慰 |
| q16 | breathtaking：那位歌手的聲音美得令人屏息 |
| q17 | consolation：唯一的安慰是比賽前雨停了／心情不好時狗陪著是安慰 |

#### b2-u44-l09

| 目標字 | 單字卡情境 | 其他題情境 | 換了哪幾項 | 判定 |
|---|---|---|---|---|
| dissatisfied | 不滿的員工一個個離職<br>　Dissatisfied workers left the company one after another. | q13：對舊髮型不滿意改試新造型<br>　Dissatisfied with his old haircut, he tried a completely new style.<br>q15：另一隊一開始不滿意結果<br>　The other team was dissatisfied with the result at first, but their captain generously shook hands with Mina and praised her speech. | q13：情境、句型<br>q15：主詞、情境、句型 | 通過 |
| eloquent | 爺爺很會說故事<br>　My grandfather is an eloquent storyteller. | q15：安靜的 Mina 辯論時口才出奇地好<br>　Mina, a quiet girl from my class, was surprisingly eloquent, and her arguments were clear and coherent. | q15：主詞、情境、句型 | 通過 |
| misfortune | 我們同情他們的不幸<br>　We felt sorry for them in their misfortune. | q09：我們倒楣、剛好碰上店關門<br>　It was our misfortune to arrive just as the shop closed.<br>q17：倒楣錯過末班車／手機不幸掉進湖裡<br>　I had the misfortune of missing the last train home. / By some misfortune, my phone fell into the lake. | q09：主詞、情境、句型<br>q17：主詞、情境、句型 | 通過 |
| reverence | 她的畫都表現出對大自然的崇敬<br>　Her reverence for nature shows in all her paintings. | q10：村民非常敬重那座老橋<br>　In this village, people treat the old bridge with great reverence.<br>q11：遊客懷著崇敬走過古寺<br>　Visitors walked quietly through the ancient temple, full of reverence. | q10：主詞、情境、句型<br>q11：主詞、情境、句型 | 通過 |
| disgrace | 球隊的行為讓學校蒙羞<br>　The team's behavior was a disgrace to the school. | q15：校長說盡力了輸了不丟臉<br>　At the end, our principal said that losing is no disgrace if you have done your best.<br>q16：考試作弊是丟臉的事<br>　Cheating on a test is a disgrace. / It is a disgrace to cheat in an exam. | q15：主詞、情境、句型<br>q16：主詞、情境 | 通過 |
| ecstatic | 在機場見到老朋友欣喜若狂<br>　We were ecstatic to see our old friend at the airport. | q12：開始下雪時孩子們樂翻了<br>　The kids were ecstatic when it started to snow.<br>q15：評審宣布獲勝時 Mina 欣喜若狂<br>　When the judges named her team the winner, she was ecstatic and hugged everyone. | q12：主詞、情境、句型<br>q15：主詞、情境、句型 | 通過 |
| admirable | 她對孩子們的耐心令人欽佩<br>　Her patience with the children is admirable. | q15：大家都認為對手隊長的風度令人欽佩<br>　Everyone agreed that this was admirable. | q15：主詞、情境、句型 | 通過 |
| generously | 他大方地請大家吃晚餐<br>　He generously paid for everyone's dinner. | q14：鄰居大方借車一整個週末<br>　My neighbor generously lent us his car for the whole weekend and said we didn't need to pay.<br>q15：對手隊長大方地握手稱讚<br>　The other team was dissatisfied with the result at first, but their captain generously shook hands with Mina and praised her speech. | q14：主詞、情境、句型<br>q15：主詞、情境、句型 | 通過 |

同課題目互比（9 題；事件摘要逐題人工判定互不相同；腳本找「同目標字且主詞、句型都相同」的兩題：0 組）

| 題號 | 事件摘要 |
|---|---|
| q09 | misfortune：我們倒楣、剛好碰上店關門 |
| q10 | reverence：村民非常敬重那座老橋 |
| q11 | reverence：遊客懷著崇敬走過古寺 |
| q12 | ecstatic：開始下雪時孩子們樂翻了 |
| q13 | dissatisfied：對舊髮型不滿意改試新造型 |
| q14 | generously：鄰居大方借車一整個週末 |
| q15 | dissatisfied：另一隊一開始不滿意結果；eloquent：安靜的 Mina 辯論時口才出奇地好；disgrace：校長說盡力了輸了不丟臉；ecstatic：評審宣布獲勝時 Mina 欣喜若狂；admirable：大家都認為對手隊長的風度令人欽佩；generously：對手隊長大方地握手稱讚 |
| q16 | disgrace：考試作弊是丟臉的事 |
| q17 | misfortune：倒楣錯過末班車／手機不幸掉進湖裡 |
