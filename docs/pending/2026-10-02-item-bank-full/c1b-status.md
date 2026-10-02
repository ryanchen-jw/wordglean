# TASK-9 C1 後段（c1-u36～u39）撰寫狀態

> 依 2026-10-02 創辦人 G5 裁示，題庫由開發端 Claude 逐課撰寫（author `claude-dev`），不呼叫任何外部 LLM，花費 $0。本 worker 只負責 C1 後段 c1-u36～c1-u39（前段 u01～u35 由 task-9-c1 worker 負責，狀態見 c1-status.md）。撰寫工具 `scripts/author-lesson.mjs`，帳本 `content/items/_runs/claude-dev-pilot.json`。分支 `worktree-task-9-c1b`。

## 各批

| 批 | 單元 | 課數 | 題數 | 撰寫起訖（UTC） | 檢查器 | 待審狀態 |
|---|---|---|---|---|---|---|
| 1 | c1-u36～c1-u39 | 31 | 518 | 2026-10-02 19:22 → 20:16 | `check-items` 本分支 C1 31 課全綠（含 ANSWER_POSITION／_UNIT／_LEVEL／_PATTERN、ANSWER_LONGEST）；`npm test` 全綠 | 第②③關已審，修正完成（2026-10-03）；改到選項或題幹的 48 題待只看英文盲答重審 |

## 第 1 批

### 第②③關審查與修正（2026-10-03）

- 第②關：盲答 155 題位全部一致、0 多解，判題已寫入各課 judge。issues 50 條全修。
- 第③關：FIX 27 條全修；疑似項依 c1bb-rulings.md 處理。
- 只看英文自查的 11 題：全修。
- 新規則「聽選音檔算情境句」：已逐課比對，另外改了 2 題。
- 追加裁示 3-C 第 17 條（同單元不同課不重複同一情境）：修了①午餐後提不起勁、②員工無視經理指示，並依同一原則改 u39-l08 卡。
- 最終複審（t9/c1bb-final.md）FIX 6 條全修，詳見 c1b-changes.md。
- 重新盲答後，u39-l06-q10 的正解從殘句改成完整句（指定名次改第 3 長）。
- 全部修改記入 judge.resolvedAfterFinalReview（220 筆）。對照表、不改項目與「改到選項或題幹的題 id」（48 題）見 c1b-changes.md。
- 修正後的檢查：--require-judge 31 課全綠；全量 330 課全綠；npm test 全綠；長度名次符合指定；干擾項跨 worktree 自查 0 違規。
- mcq 全部改為四選項同詞性。下方每課明細的「mcq 選項」欄已更新為現行選項。

### 單元與 commit

| 單元 | 主題 | 課 | commit |
|---|---|---|---|
| c1-u36 | 常用動作（二） | l01–l06 | `6ba10fd` |
| c1-u37 | 描述事物（二） | l01–l06（另含 u36 依補充裁示自查） | `e56bef8` |
| c1-u38 | 情緒與個性（二） | l01–l10（另含 u36–u37 自查） | `87d7671` |
| c1-u39 | 情緒與個性（三） | l01–l09（另含 u36–u38 自查） | `535ee33` |

### 撰寫中套用的執行長補充裁示（2026-10-02～03 跨 session 訊息）

撰寫期間陸續收到下列補充，已寫的課全部回頭自查並修改（修改都在送審前，未經任何判題）：

1. mcq 長度名次只看全級分布，閱讀與聽選仍以題 id 雜湊逐題指定名次。
2. 干擾項只用本課、先前課（C1 u01～u35 課綱字）或 B2 以下的字；不可一眼排除；非本單元字不在多課重複當干擾項；混合詞性那題至少兩個干擾項文法上放得進空格（c1b1-rulings.md）。
3. 同一課兩題 mcq 干擾項不共用、不拿另一題的正解當干擾項；比對先做詞形還原（含 -ly、-ness 同詞族）。
4. 單字卡雙義釋義的干擾項同格式（§11.27）；glossZh 第一義＝例句示範的詞義（§11.28、App 只顯示第一義）；不用「（使）」「（的）」「（地）」等詞性標記格式。

5. **執行長裁示①（2026-10-03）**：單字卡一律「該級最常用、最符合單元主題的詞義放第一義，例句示範這個詞義」。先前為遷就舊例句而把次要義排前的卡全部改回，並改寫例句：elude、sprawl、gush、clutter、stoke、graft、gape、untangle、crudely、linearly、blankness、untangled、stuffiness、agreeable、compliant、astray、viciously（17 張改例句＋釋義改序）、transfix（只改序，原例句即示範「使呆住」）；另依同一原則改 rendering（演出、詮釋）、turn to（求助於）、salivate（流口水）三張。gush 的舊水流情境聽打改成「熱烈稱讚」義以免與新卡雷同。gushing、somberly 經查第一義即最常用義，維持。改完重跑雷同自查、情境對照表、長度名次與檢查器。
6. **裁示②**：dither 教「猶豫不決」（lexicon 釋義「發抖」不採用）。

自查結果（以現行檔、詞形還原後比對）：同課共用 0、交叉當正解 0、非本單元字跨課重複當干擾項 0（glean、detest 各只在 u39-l01 當過一次非本單元干擾項）；同單元內的課綱字會在不同課重複當干擾項，依裁示屬允許範圍。

### 撰寫耗時（帳本）

- 全批牆鐘時間：19:22 → 20:16，約 54 分鐘（含中途回頭自查 u36–u38 依補充裁示修改的時間）。
- 計到第一次 0 錯（start → 第一次 0 錯）：31 課合計 46.6 分，平均 1.5 分，中位數 1.3 分，最短 0.9 分，最長 5.2 分（c1-u39-l01：中途遇 API 連線中斷，重新確認狀態後才寫入）。
- 這是帳本的牆鐘時間，從 start 算到第一次 write 0 錯；構思、讀裁示、寫文件的時間不在內。寫入輪次較多的課，多半是回頭套用補充裁示（換干擾項、釋義改序）造成的重寫，不是檢查器錯誤。

### 長度名次與正解位置（本分支 C1 31 課）

| 題型 | 正解是第 1／2／3／4 長 | 題數 | 正解位置 0／1／2／3 |
|---|---|---|---|
| listenChoice | 32%／26%／26%／16% | 31 | 5／15／2／9 |
| mcq | 24%／25%／33%／19% | 62 | 14／13／12／23 |
| reading | 23%／23%／32%／23% | 62 | 9／16／21／16 |

聽選與閱讀以 sha256(題鍵＋"|len") mod 4 指定長度名次；聽選雜湊結果第 1 長佔 12/31（38.7%，超過 37%），故 c1-u38-l10-q10、c1-u39-l08-q09 兩題改指定第 3 長。重新盲答後 c1-u39-l06-q10 正解改成完整句，也改指定第 3 長。正解位置以 sha256(題 id) 決定，單課違反 ANSWER_POSITION 時以 sha256(題 id＋"#"＋n) 重抽（c1-u38-l04 第 2 輪、c1-u39-l08 第 1 輪）。所有聽選與閱讀選項皆在其他選項平均長度的 0.5～2 倍內。

### 每課明細

mcq 選項欄＝現行兩題 mcq 的四個選項（正解在前）；第②③關修正後，兩題都是四選項同詞性、都放得進空格，只能靠詞義判斷（§11.7、只看英文規則）。「閱讀短文帶入的前面單元字」＝§11.13 單元間複用（各單元第 1 課不要求，本批仍有帶入）。

| 課 | 題數 | 開始（UTC） | 到第一次 0 錯（分） | 寫入輪次 | mcq 選項 | 閱讀短文帶入的前面單元字 |
|---|---|---|---|---|---|---|
| c1-u36-l01 | 17 | 19:22 | 2.1 | 5 | q13（clenched／salvaged／eluded／polished）；q14（twitched／strayed／rumbled／sprawled） | —（單元第 1 課） |
| c1-u36-l02 | 17 | 19:25 | 1.3 | 6 | q13（fuse／glean／stiffen／relinquish）；q14（tangled／salvaged／numbed／unsettled，皆可接在 get 後） | robust（c1-u04） |
| c1-u36-l03 | 17 | 19:26 | 1.6 | 8 | q13（adjoining／cluttered／stray／exterior）；q14（pounced／congregated／gnawed／tinkered） | battered（c1-u04）、discard（c1-u03） |
| c1-u36-l04 | 16 | 19:28 | 1.6 | 6 | q12（retraced／grafted／stoked／transfixed）；q13（rustle／tangle／sprawl／clutter） | flicker（c1-u03，flickering） |
| c1-u36-l05 | 16 | 19:30 | 1.3 | 9 | q12（ventilate／chisel／untangle／unplug）；q13（adjoins／relinquishes／dithers／gleans） | precision（c1-u04） |
| c1-u36-l06 | 16 | 19:31 | 1.4 | 9 | q12（coupled／anchored／salvaged／ventilated）；q13（gushingly／marginally／accurately／annually） | restoration（c1-u03） |
| c1-u37-l01 | 17 | 19:33 | 1.9 | 6 | q13（cleanly／crudely／startlingly／loosely）；q14（convoluted／homely／staccato／readable） | simplicity（c1-u04） |
| c1-u37-l02 | 17 | 19:35 | 0.9 | 3 | q13（phenomenally／gushingly／reluctantly／politely）；q14（superficially／fabulously／startlingly／generously） | elusive（c1-u04） |
| c1-u37-l03 | 17 | 19:36 | 1.1 | 9 | q13（wizened／untangled／unassisted／unoccupied）；q14（linearly／somberly／superficially／legally） | rudimentary（c1-u04） |
| c1-u37-l04 | 16 | 19:38 | 1.1 | 6 | q12（robustly／chaotically／explosively／somberly）；q13（pendulous／removed／repellant／unoccupied） | mingle（c1-u03） |
| c1-u37-l05 | 16 | 19:39 | 1.4 | 3 | q12（believably／superficially／linearly／dominantly）；q13（frostily／exotically／synthetically／cleanly） | versatile（c1-u04） |
| c1-u37-l06 | 16 | 19:40 | 1.3 | 2 | q12（unreliably／eclectically／stuffily／frostily）；q13（fiddly／chiselled／unscathing／showy） | quirky（c1-u04） |
| c1-u38-l01 | 17 | 19:44 | 1.1 | 5 | q13（hypocritical／agreeable／fanciful／negligent）；q14（sarcasm／exuberance／bliss／gratitude） | eccentric（c1-u10） |
| c1-u38-l02 | 17 | 19:45 | 1.3 | 4 | q13（unsettling／bubbly／compliant／instinctive）；q14（wryly／financially／officially／mutually） | apprehensive（c1-u10） |
| c1-u38-l03 | 17 | 19:46 | 1.0 | 2 | q13（deceit／disillusionment／tranquility／exuberance）；q14（engrossed／riveting／enterprising／altruistic） | dismay（c1-u10） |
| c1-u38-l04 | 17 | 19:47 | 1.3 | 5 | q13（lackluster／sentient／altruistic／riveting）；q14（astray／irate／trying／bubbly，皆可接在 went 後） | vitality（c1-u10） |
| c1-u38-l05 | 17 | 19:48 | 1.2 | 4 | q13（undaunted／claustrophobic／monotonous／enviable）；q14（unwavering／sentient／lackluster／hypocritical） | spontaneous（c1-u10） |
| c1-u38-l06 | 17 | 19:50 | 1.1 | 2 | q13（macabre／docile／monotonous／instinctive）；q14（flattery／exhilaration／sarcasm／disillusionment） | candid（c1-u10） |
| c1-u38-l07 | 17 | 19:51 | 2.6 | 3 | q13（monotony／fiend／slob／flattery）；q14（naively／aimlessly／sarcastically／viciously） | grumble（c1-u10） |
| c1-u38-l08 | 17 | 19:53 | 1.6 | 3 | q13（aimless／irate／dutiful／enviable）；q14（wrangled／reminisced／daydreamed／sprawled） | commend（c1-u10） |
| c1-u38-l09 | 17 | 19:55 | 1.3 | 3 | q13（tedium／verve／commendation／cleverness）；q14（inexcusable／zany／scornful／enviable） | antics（c1-u10） |
| c1-u38-l10 | 17 | 19:56 | 1.5 | 1 | q13（headstrong／torturous／docile／inexcusable）；q14（gamely／refreshingly／sarcastically／wickedly） | provocative（c1-u10） |
| c1-u39-l01 | 17 | 19:59 | 5.2 | 2 | q13（unconvincing／impish／neglectful／pleasurable）；q14（daunt／detest／glean／salvage） | timid（c1-u10） |
| c1-u39-l02 | 17 | 20:05 | 1.4 | 3 | q13（insubordination／naturalness／claustrophobia／tedium）；q14（scornfully／conscientiously／tactfully／naively） | reassure（c1-u06） |
| c1-u39-l03 | 17 | 20:06 | 1.8 | 2 | q13（uninspiring／remorseless／enviable／impish）；q14（exuberantly／appallingly／voraciously／conscientiously） | avid（c1-u10） |
| c1-u39-l04 | 17 | 20:08 | 1.6 | 1 | q13（ludicrously／temperamentally／negligently／ecstatically）；q14（fiendish／uneventful／pendulous／tactful） | spontaneously（c1-u10） |
| c1-u39-l05 | 17 | 20:10 | 1.1 | 2 | q13（remorselessly／sedately／unconvincingly／fiendishly）；q14（detestable／engrossing／spartan／enterprising） | insightful（c1-u06） |
| c1-u39-l06 | 17 | 20:11 | 1.2 | 2 | q13（eccentrically／victoriously／hypocritically／prolifically）；q14（insubordinate／tactful／unenviable／engrossing） | individuality（c1-u10） |
| c1-u39-l07 | 16 | 20:12 | 1.2 | 4 | q12（docilely／gruesomely／inexcusably／prolifically）；q13（naivety／insubordination／claustrophobia／buffoon） | toughness（c1-u10） |
| c1-u39-l08 | 16 | 20:13 | 1.1 | 1 | q12（insecurely／irately／raunchily／docilely）；q13（insubordinately／compliantly／victoriously／gruesomely） | poise（c1-u10） |
| c1-u39-l09 | 16 | 20:15 | 1.0 | 2 | q12（unwaveringly／remorsefully／stressfully／unenviably）；q13（withdrawn／unconvincing／fiendish／gruelling） | insecure（c1-u10） |
### 「只看英文」mcq 自查（執行長新規則 2026-10-03，待與第②③關結果一起修）

App 作答時只顯示英文句子，所以干擾項放進英文句子後必須在文法或語意上明顯不通；要靠中文題幹才能排除的，算雙答案。62 題逐題只看英文代入，結果：

| 風險 | 題 | 題幹 | 可疑干擾項 | 理由 |
|---|---|---|---|---|
| 高 | c1-u38-l06-q13 | Many readers enjoy her ____ stories about ghosts and old graves. | agreeable | agreeable stories（令人愉快的故事）文法、語意都通，算雙答案 |
| 中 | c1-u38-l08-q13 | Without any plan, the long weekend felt slow and ____. | beguiling | 沒有計畫的悠閒週末「緩慢又迷人」也說得通 |
| 中 | c1-u39-l01-q13 | The witness's story was ____, so the police kept asking more questions. | tactful | 說法很圓融（避重就輕），警方因此追問，也說得通 |
| 中 | c1-u39-l09-q13 | Since moving to the city, the boy has become quiet and ____. | insubordinate | 「安靜但不服管教」在英文裡並不矛盾 |
| 低 | c1-u38-l02-q13 | The strange noises coming from the empty house were deeply ____. | pleasurable | 語意上很牽強，但文法通 |
| 低 | c1-u38-l10-q14 | Even after falling twice, the young dancer ____ got up and finished her show. | smugly | 跌倒兩次後「得意地」站起來不合常理，但不算錯句 |
| 低 | c1-u39-l02-q14 | He looked ____ at my old phone and then showed me his new one. | tactfully、conscientiously | 沒有「輕蔑」的線索時，只靠「秀新手機」排除，線索偏弱 |
| 低 | c1-u39-l03-q13 | The team's ____ performance gave the fans little reason to cheer. | benign | benign performance（溫和、無害的表現）勉強說得通 |
| 低 | c1-u37-l05-q12 | Even the youngest actor delivered her lines ____, and the audience truly felt her fear. | primitively | 「演得很原始粗糙」與「觀眾感受到恐懼」不完全矛盾 |
| 低 | c1-u36-l04-q13 | The only sound in the library was the ____ of pages being turned. | rumble | rumble 也是聲音名詞，只靠「翻書不會隆隆響」排除 |
| 低 | c1-u36-l01-q13 | Tom ____ his jaw as the referee walked away, but he said nothing. | numbed | 「讓下巴麻木」不是自主動作，但文法通 |

其餘 51 題只看英文時，每個干擾項代入後都明顯不通。上表 11 題已在第②③關修正時全部處理（換干擾項或在英文句子補線索，見 c1b-changes.md），並重跑長度名次、干擾項詞形還原自查（含 C1 前段）與檢查器。


### 自評疑慮（請審查官優先看）

1. **課綱字本身冷僻或語域敏感**：raunchy、raunchily、macabre、gruesomely、fiend、slob、salivate、hypocrite 等。已全部用中性情境（歌詞太露骨不適合電台、喜劇表演、黑色幽默電影、填字狂／健身狂、車迷垂涎），未寫性、暴力或死亡細節；但這幾課是否「適合成人日常學習」仍請第③關判斷。
2. **罕用或語感存疑的字**：unscathing（＝不尖刻的，非常見的 unscathed）、dominantly（一般多用 predominantly）、stressfully、unenviably、repellant（拼法照課綱，評分要點註明 repellent 也正確）。例句已盡量自然，但母語者語感可能仍覺生硬。
3. **第一義是否最常用仍可議的卡**：fiend（課綱字典第一義是「惡魔」，本課教 C1 常見的「⋯狂、狂熱者」）、wickedly（教「頑皮使壞地」，另一義「邪惡地」）、fiendish／fiendishly（教「極難的／極其」，另一義「惡毒的」）。依單元主題與現代用法判斷，若審查官認為應改，請點名。
4. **例句改寫後最接近雷同門檻的列**：c1-u36-l05 gape（新卡用 gape in surprise，避開與閱讀 gaped at 雕像同情境）、c1-u38-l05 viciously（新卡狂風撕扯帳篷，與 u36-l01 閱讀的暴風雨帳篷屬不同課，未列入比對）。
5. **雷同自查列出但判定通過的句對**：多為固定搭配造成的同句型骨架（pounce on、tinker with、coupled with、far removed from、receive a commendation for、retrace my steps、fiendishly＋形容詞），主詞與情境都已換；c1-u38-l09 commendation 卡與 q17 參考答案 2 句型相同（主詞、情境不同），是最接近門檻的一列。
6. **聽選正解位置偏 1**：雜湊結果位置 1 有 15/31（48%，上限 50%），合格但接近上限；與 C1 前段合併後若 ANSWER_POSITION_LEVEL 超標，需再重抽。

### 建議（準則／工具）

- **opencc 誤擋**（皆為台灣通行寫法，撰寫時改寫避開）：無精打采→「無精打採」、社區→「社群」、宣布→「宣佈」、扣人心弦→「扣人心絃」、舞台→「舞臺」（只在部分句中觸發）、塑膠布→「塑膠佈」、循環→「迴圈」、兼容並蓄→「相容並蓄」、複製→誤判。前五個建議加入 `TWP_ACCEPTED`（照 B1 worktree 做法先寫紅測試）。
- **lexicon 缺的常用字**（UNLEVELED，撰寫時換字）：fist、halfway、footstep、glue、hillside、villain、storytelling、homemade、flatmate、coworker、forum、uphill、steeply、restlessly、dragon、paragliding、speedboat、crossword、purely、harsh、neatly、shyness、hiker、rehearse、drift、growl、rot、wag、guesthouse、pianist、takeout、cannot。其中 harsh、purely、neatly 屬 B 級常用字，疑為 lexicon 漏收，建議查 TASK-6 來源。
- **長度名次指定工具**：本批用 job tmp 的輔助腳本（依題 id 雜湊指定聽選／閱讀名次、互換正解位置、檢查 0.5～2 倍）。各 worker 各寫一份，建議收進 repo 統一（B2 worktree 已有 place-answers.mjs，可擴充名次指定）。
- **情境對照表自動核對**：本批對照表由現行檔擷取原句，並以腳本核對「人工摘要提到的題號＝實際用到該字的題號」（31 課 0 不一致）。建議這個核對併入各級共用的自查腳本。

## 情境對照表（第 1 批，31 課）

**產生方式**（第②③關修正後重產）：「其他用到該字的題」欄由現行題目檔自動擷取原句（聽打、聽選音檔、跟讀、mcq 題幹填入正解、閱讀短文逐句、翻譯與造句參考答案；聽選音檔依新裁示算情境句）；「單字卡情境」「其他題情境」兩欄是撰寫時逐列寫的人工摘要。腳本另核對摘要列的題號與現行檔實際出現該字的題號一致（31 課全部一致）。

**判定**：每列逐一人工判定單字卡例句與每個其他句子「主詞、情境、句型」至少換兩項，最後一欄寫實際換了哪幾項。雷同自查腳本（B1 worktree 的 selfcheck-similarity，詞形還原、門檻 40%＋句型骨架）列出的句對已逐項判定；判定為雷同的已改寫（relinquish、adjoin、linearly、blankness、turn to、hypocritical、scathing、fiend、scornfully、gush／pounce 等），其餘見「自評疑慮」第 5 點。

#### c1-u36-l01

| 目標字 | 單字卡例句 | 單字卡情境 | 其他題情境（人工摘要） | 其他用到該字的題（現行檔原句） | 換了哪幾項 |
|---|---|---|---|---|---|
| rumble | We could hear trucks rumbling along the highway all night. | 卡車整晚在公路隆隆駛過 | q15 雷聲在山丘上隆隆響；q10 聽選音檔會議中肚子叫 | q10（聽選音檔）：In the middle of the meeting, my stomach began to rumble so loudly that everyone turned around.<br>q15/s0：On the last night of our camping trip, thunder began to rumble over the hills. | 主詞、情境、句型 |
| clench | She clenched the railing as the boat rocked from side to side. | 船晃時她抓緊欄杆 | q13 Tom 看裁判走開咬緊牙關；q12 他咬牙推開重門（同為 PRON+clench+NP，但受詞、情境不同） | q12：He clenched his teeth and pushed the heavy door open.<br>q13：Tom [clenched] his jaw as the referee walked away, but he said nothing. | 主詞、情境 |
| salvage | Workers salvaged old bricks from the building before it was pulled down. | 拆樓前工人搶救舊磚 | q15 暴風雨後搶救露營用品；q16 從失敗計畫挽救點子 | q15/s5：The storm had damaged our tent badly, so the next morning we salvaged what we could, including two blankets and the stove, and walked back to the car.<br>q16/ref0：We managed to salvage some good ideas from the failed project.<br>q16/ref1：We were able to salvage a few good ideas from that failed plan. | 主詞、情境、句型 |
| stray | A stray cat has been sleeping in our garden all week. | 流浪貓睡在花園（形容詞） | q09 講者偏離主題；q15 狗離開帳篷走失；q17 我偏離購物清單／步道（動詞） | q09：The speaker kept straying from the topic, and we soon lost interest.<br>q15/s2：Suddenly our dog strayed away from the tent and disappeared into the dark.<br>q17/ref0：I sometimes stray from my shopping list when I see something on sale.<br>q17/ref1：During the hike, I strayed from the path and got lost for a while. | 主詞、情境、句型 |
| elude | The suspect eluded the police by hiding in a crowded market. | 嫌犯躲進市場逃過警方（躲避義） | q11 想不起他的名字（難以想起義）；q15 狗一再溜走不讓我們抓到 | q11：His name eludes me, but I remember his face clearly.<br>q15/s3：We searched for an hour, but she eluded us every time we got close. | 主詞、情境、句型 |
| sprawl | The teenagers sprawled across the sofa, watching TV. | 青少年攤在沙發上看電視（across） | q15 哥哥累得攤在睡袋上（on、分詞構句 too tired to move） | q15/s1：My brother sprawled on his sleeping bag, too tired to move, while I tried to light the stove with fingers that were numb from the cold. | 主詞、情境 |
| twitch | My left eye has been twitching all day. | 我的左眼跳一整天 | q14 她嘴角抽動忍笑（填空）；q15 狗耳朵隨聲響抽動 | q14：Her mouth [twitched] slightly, as if she were trying not to laugh.<br>q15/s4：At last we found her under a fallen tree, her ears twitching at every sound. | 主詞、情境、句型 |
| numb | My leg went numb after I sat on the floor for an hour. | 坐地上一小時腿麻 | q15 手指凍僵還要點爐子 | q15/s1：My brother sprawled on his sleeping bag, too tired to move, while I tried to light the stove with fingers that were numb from the cold. | 主詞、情境、句型 |

#### c1-u36-l02

| 目標字 | 單字卡例句 | 單字卡情境 | 其他題情境（人工摘要） | 其他用到該字的題（現行檔原句） | 換了哪幾項 |
|---|---|---|---|---|---|
| tangle | The kitten tangled itself in a ball of wool. | 小貓被毛線纏住（動詞反身） | q14 耳機線在包裡纏在一起（填空）；q15 抽屜裡一團舊繩子（名詞） | q14：My headphone cables always get [tangled] at the bottom of my bag.<br>q15/s3：Inside, under a tangle of old string, she found her father's notebooks. | 主詞、情境、句型 |
| relinquish | Few people willingly relinquish a comfortable habit. | 很少人肯放棄舒服的習慣（泛指） | q15 何先生把工作坊交給女兒；q16 她同意讓出靠窗座位 | q15/s1：Ho finally relinquished control of his furniture workshop to his daughter, Mei.<br>q16/ref0：After some discussion, she agreed to relinquish the window seat.<br>q16/ref1：She agreed to relinquish her window seat after a short discussion. | 主詞、情境、句型 |
| unsettle | Strange noises at night unsettle our old dog. | 夜裡怪聲讓老狗不安 | q15 新想法讓老顧客不安；q10 聽選音檔行程改變讓團隊不安 | q10（聽選音檔）：The sudden change in the schedule unsettled the whole team for days.<br>q15/s5：Mei wanted to fuse her father's traditional designs with a cleaner, modern style, and at first the idea unsettled some loyal customers. | 主詞、情境 |
| stiffen | Her whole body stiffened when she heard steps behind her. | 聽到腳步聲她全身僵住 | q09 混合物冷卻後變硬 | q09：The mixture will stiffen as it cools overnight. | 主詞、情境、句型 |
| fuse | The heat fused the two pieces of metal together. | 高溫把兩塊金屬熔合 | q13 兩家公司合併研究團隊（填空、plan to）；q15 傳統與現代設計融合 | q13：The two companies plan to [fuse] their research teams into one larger group.<br>q15/s5：Mei wanted to fuse her father's traditional designs with a cleaner, modern style, and at first the idea unsettled some loyal customers. | 主詞、情境 |
| wrench | The wind wrenched the umbrella out of my hand. | 風把傘從手中扯走 | q11 他猛轉方向盤避開貓；q15 她用力扭開卡住的抽屜 | q11：He wrenched the steering wheel to the left to miss the cat.<br>q15/s2：On her first day, she had to wrench open a drawer that had been stuck for years. | 主詞、情境、句型 |
| glean | Little can be gleaned from such a short report. | 短報告蒐集不到資訊（被動） | q12 我從計程車司機聽來當地知識；q15 她從筆記本學到技巧 | q12：I gleaned most of my local knowledge from the taxi drivers.<br>q15/s4：Over the next few months, she gleaned many useful tips from them. | 主詞、情境、句型 |
| rendering | The actor's rendering of the old king was praised by critics. | 演員詮釋老國王一角獲讚（演出義、主詞） | q15 她給顧客看新椅子示意圖（示意圖義）；q17 樂團演出老民謠／鋼琴版流行歌（rendering of＋作品） | q15/s6：However, when she showed them a rendering of a new chair, most of them changed their minds.<br>q17/ref0：I loved the band's rendering of an old folk song.<br>q17/ref1：I once heard a slow piano rendering of my favorite pop song. | 主詞、情境、句型 |

#### c1-u36-l03

| 目標字 | 單字卡例句 | 單字卡情境 | 其他題情境（人工摘要） | 其他用到該字的題（現行檔原句） | 換了哪幾項 |
|---|---|---|---|---|---|
| repel | Bright lights repel some insects but attract others. | 燈光趕走某些昆蟲卻吸引另一些（驅除義） | q12 外套防水層把水擋開；q15 據說能驅鼠的噴劑（不定詞） | q12：This jacket has a special layer that repels water.<br>q15/s3：Grandpa tried a spray that was supposed to repel mice, but it did not work. | 主詞、情境、句型 |
| gush | Hot water gushes from the rocks at this famous spring. | 熱水從溫泉岩石間湧出（現在式） | q09 影評人對新片讚不絕口（稱讚義）；q15 水管破裂讓水湧滿地（主詞水管、send＋O＋V-ing） | q09：Every critic gushed over the young actor's first film.<br>q15/s6：A week later, a pipe burst and sent water gushing across the floor. | 主詞、情境、句型 |
| tinker | The chef tinkered with the recipe until it was just right. | 主廚反覆調整食譜 | q11 別再亂動印表機設定（祈使）；q15 爺爺週末擺弄舊收音機（tinker with 為固定搭配） | q11：Please stop tinkering with the settings; the printer works fine.<br>q15/s0：My grandfather spends most weekends tinkering with old radios in his garage. | 主詞、情境 |
| adjoining | Noise from the adjoining office made it hard to concentrate. | 隔壁辦公室噪音難專心 | q13 訂兩間相連房讓孩子睡隔壁（填空）；q15 鄰居聚在隔壁院子 | q13：We booked two [adjoining] rooms so the children could sleep right next to us.<br>q15/s7：Neighbors congregated in the adjoining yard to watch Grandpa and my father carry everything outside. | 主詞、情境、句型 |
| clutter | We gave away old clothes to reduce the clutter in our cupboards. | 舊衣送人減少櫃子雜物（名詞） | q15 車庫堆滿雜物（full of clutter）；q16 書桌堆滿文件找不到東西（動詞） | q15/s1：The place is full of clutter: boxes of wires, battered tools and newspapers he refuses to discard.<br>q16/ref0：My desk is cluttered with papers, and I can't find anything.<br>q16/ref1：Papers clutter my desk, so I can't find anything. | 主詞、情境、句型 |
| pounce | The goalkeeper pounced on the loose ball. | 守門員撲向球 | q14 業務員撲上去招呼第一位客人（pounce on 固定搭配）；q15 貓躲一小時後猛撲 | q14：The salesman [pounced] on the first customer who walked through the door.<br>q15/s5：She hid behind a box for an hour and then pounced. | 主詞、情境 |
| congregate | Birds congregate around the lake in early spring. | 初春鳥群聚在湖邊 | q15 鄰居聚在隔壁院子看搬東西；q17 學生聚在咖啡機旁／跑者賽前聚在公園大門；q10 聽選音檔 歌迷聚在飯店外 | q10（聽選音檔）：Fans began to congregate outside the hotel hours before the singer arrived.<br>q15/s7：Neighbors congregated in the adjoining yard to watch Grandpa and my father carry everything outside.<br>q17/ref0：Students often congregate around the coffee machine before class.<br>q17/ref1：On weekend mornings, I see runners congregate at the park gate before a race. | 主詞、情境 |
| gnaw | The dog gnawed happily on an old bone. | 狗開心啃舊骨頭（gnaw on） | q15 老鼠住進車庫啃穿電線（gnaw through） | q15/s2：Last winter, a mouse moved in and started to gnaw through the wires. | 主詞、情境、句型 |

#### c1-u36-l04

| 目標字 | 單字卡例句 | 單字卡情境 | 其他題情境（人工摘要） | 其他用到該字的題（現行檔原句） | 換了哪幾項 |
|---|---|---|---|---|---|
| rustle | Someone in the audience kept rustling a paper bag. | 觀眾一直弄響紙袋（動詞及物） | q13 圖書館翻書的沙沙聲（名詞、填空）；q14 身後枯葉沙沙作響 | q13：The only sound in the library was the [rustle] of pages being turned.<br>q14/s2：Suddenly the dry leaves behind us rustled. | 主詞、情境、句型 |
| prowl | Reporters prowled the hotel lobby, hoping to see the star. | 記者在飯店大廳徘徊等明星 | q14 狐狸在雞舍附近徘徊；q15 貓整晚在房子四周徘徊 | q14/s3：A fox was prowling near the chicken house, its eyes shining in the flickering light.<br>q15/ref0：The cat prowled around the house all night.<br>q15/ref1：All night long, the cat was prowling around the house. | 主詞、情境、句型 |
| stoke | The cook stoked the old iron stove with wood every hour. | 廚師每小時往老鐵爐添柴 | q11 我們輪流添柴讓小木屋溫暖（take turns＋-ing）；q14 叔叔在戶外往小火堆添柴 | q11：We took turns stoking the fire to keep the cabin warm.<br>q14/s1：One evening after work, we sat outside while he stoked a small fire. | 主詞、情境、句型 |
| dislodge | The storm dislodged several tiles from the roof. | 暴風雨吹鬆屋瓦 | q08 兩人合力把石頭挪開小路（It took…to）；q14 樹枝打鬆牆上石頭（關係子句） | q08：It took two of us to dislodge the rock from the path.<br>q14/s5：My uncle threw a stick, which dislodged a stone from the wall, and the noise sent the fox running. | 主詞、情境、句型 |
| retrace | Historians retraced the explorer's journey across the desert. | 歷史學家重走探險家沙漠路線 | q12 老城迷路循原路回廣場（填空）；q14 循原路回果園找手機；q16 我在台南迷路走回車站；q09 聽選音檔回車站找傘（同為 retrace＋路線，主詞與情境皆不同） | q09（聽選音檔）：After the meeting, I retraced my route to the station, but I never found my umbrella.<br>q12：Lost in the old town, we [retraced] our steps to the last square we recognized.<br>q14/s6：Later, I realized I had dropped my phone, so I retraced my steps to the orchard with a torch and found it under a tree.<br>q16/ref0：When I got lost in Tainan, I retraced my route back to the train station.<br>q16/ref1：I retraced my steps to the café and found my wallet on the table. | 主詞、情境 |
| transfix | The audience sat transfixed by the dancer's performance. | 觀眾看舞者表演看呆了（被動 sat transfixed by） | q10 車燈讓路中間的鹿呆住（主動及物）；q14 表妹看到狐狸嚇得不敢動（so…that） | q10：The bright lights of the car transfixed the deer in the road.<br>q14/s4：My little cousin was so transfixed that she could not move. | 主詞、情境、句型 |
| graft | Most roses sold in shops have been grafted onto wild roots. | 店裡的玫瑰多嫁接在野生根上（被動） | q14 叔叔把蘋果樹枝嫁接到年輕的樹（主動） | q14/s0：Every spring, my uncle grafts branches from his best apple trees onto younger ones, and last year he let me help. | 主詞、情境、句型 |

#### c1-u36-l05

| 目標字 | 單字卡例句 | 單字卡情境 | 其他題情境（人工摘要） | 其他用到該字的題（現行檔原句） | 換了哪幾項 |
|---|---|---|---|---|---|
| gape | The driver gaped in surprise as the bridge ahead rose to let a ship pass. | 橋升起時駕駛驚訝得目瞪口呆（gape in surprise） | q11 我們看到帳單金額目瞪口呆；q14 路人隔窗呆看獅子（gape at） | q11：We gaped at the size of the bill.<br>q14/s5：The work required great precision, and visitors often gaped at the half-finished lion through her window. | 主詞、情境、句型 |
| roundup | At the end of the meeting, Ken gave a quick roundup of what we had agreed. | Ken 會後總整理共識 | q14 電台每週藝文綜合報導；q16 我通勤聽新聞摘要／週日讀體育摘要；q09 聽選音檔早晨新聞摘要 | q09（聽選音檔）：Here is our morning news roundup: traffic is heavy downtown, and rain is expected this afternoon.<br>q14/s6：When a local radio station included her in its weekly arts roundup, even more people came to watch.<br>q16/ref0：I listen to a short news roundup on my way to work.<br>q16/ref1：Every Sunday, I read a roundup of the week's sports news. | 主詞、情境、句型 |
| chisel | He chiseled his name into the old wooden door. | 他把名字刻在木門上 | q14 飯店請她雕獅子；q15 藝術家花三年用大理石雕雕像（It took…to） | q14/s3：Last month, a hotel asked her to chisel a lion for its entrance.<br>q15/ref0：The artist spent three years chiseling this statue out of a block of marble.<br>q15/ref1：It took the artist three years to chisel this statue from a piece of marble. | 主詞、情境、句型 |
| adjoin | Our two farms adjoin each other along the river. | 兩家農場沿河彼此相鄰（adjoin each other） | q13 辦公室緊鄰咖啡館所以有咖啡香（填空）；q14 工作室緊鄰她家（關係子句） | q13：Our office [adjoins] a busy café, so it always smells of fresh coffee.<br>q14/s1：Lin runs a small stone-carving studio that adjoins her house. | 主詞、情境、句型 |
| untangle | It took me ten minutes to untangle the dog's leash. | 我花十分鐘解開狗的牽繩（It took me…to） | q08 請幫我解開項鍊（問句）；q14 每天早上解開電線 | q08：Can you help me untangle this necklace before we go out?<br>q14/s7：Her only complaint was the mess of power cables she had to untangle every morning. | 主詞、情境、句型 |
| ventilate | Schools were told to keep classrooms well ventilated. | 學校須讓教室通風（被動） | q12 油漆後開窗讓房間通風（填空）；q14 開兩台電扇讓工作室通風 | q12：Please open the windows to [ventilate] the room after painting it.<br>q14/s2：Because carving fills the air with fine dust, she keeps two large fans running to ventilate the room. | 主詞、情境、句型 |
| dither | Stop dithering and choose a dessert! | 別再猶豫快選甜點（祈使） | q10 經理猶豫到期限過了；q14 她猶豫數週才接案 | q10：The manager dithered over the decision until the deadline had passed.<br>q14/s4：She dithered for weeks, worried that the job was too big for one person, but she finally said yes. | 主詞、情境、句型 |

#### c1-u36-l06

| 目標字 | 單字卡例句 | 單字卡情境 | 其他題情境（人工摘要） | 其他用到該字的題（現行檔原句） | 換了哪幾項 |
|---|---|---|---|---|---|
| coupled | Low prices coupled with friendly service keep customers coming back. | 低價加上親切服務讓顧客回流 | q12 工時長加上回家路遠讓他很累（填空；coupled with 為固定搭配）；q14 強風加上大雨差點停辦 | q12：Long working hours, [coupled] with a long trip home, left him tired every evening.<br>q14/s2：This year the weather was cold, and the wind, coupled with heavy rain, nearly ended the show. | 主詞、情境 |
| gushing | Her gushing praise made the shy student blush. | 她過分熱情的讚美讓學生臉紅（熱情義） | q14 從長水管湧出的水洗船；q16 暴雨後湧流的河／破水管湧出的水（湧出義）；q09 聽選音檔奶奶寫熱情的感謝信；q13 的 gushingly 是另一目標字（擷取時字首相同，非本字） | q09（聽選音檔）：My grandmother writes gushing thank-you letters for even the smallest gift.<br>q13：The host thanked us so [gushingly] that we felt a little embarrassed.<br>q14/s4：Afterwards, a visiting reporter wrote gushingly about the event.<br>q14/s5：The children's favorite part, however, was washing the old boat on Sunday morning, with buckets of suds and gushing water from a long pipe.<br>q16/ref0：The gushing river was too dangerous to cross after the storm.<br>q16/ref1：I could hear gushing water from the broken pipe upstairs. | 主詞、情境、句型 |
| anchored | The shelves are firmly anchored to the wall. | 架子牢牢固定在牆上 | q08 風變大前確認帳篷固定好（祈使）；q14 修復的木船整個週末停泊（停泊義） | q08：Make sure the tent is properly anchored before the wind picks up.<br>q14/s1：Volunteers dress in old clothes and wait by the water, where a wooden boat, recently saved through careful restoration, stays anchored for the whole weekend. | 主詞、情境、句型 |
| gushingly | She spoke gushingly about her new boss. | 她熱情過頭地談新老闆 | q13 主人熱情過頭地道謝讓我們不好意思（so…that、填空）；q14 記者熱情洋溢地報導活動 | q13：The host thanked us so [gushingly] that we felt a little embarrassed.<br>q14/s4：Afterwards, a visiting reporter wrote gushingly about the event. | 主詞、情境、句型 |
| reenact | The children reenacted their favorite scene from the movie. | 孩子重演電影最愛的一幕 | q10 博物館每年為遊客重現傳統婚禮；q14 小鎮每年重現蒸汽船抵達 | q10：Every year, the museum reenacts a traditional wedding for visitors.<br>q14/s0：Every October, the people of our small harbor town reenact the arrival of the first steam ship in 1890. | 主詞、情境 |
| suds | Wash the suds off the dishes before you dry them. | 擦乾碗盤前沖掉泡沫（祈使） | q11 放太多洗衣精洗衣機滿是泡沫；q14 孩子用一桶桶泡沫洗船 | q11：The washing machine was full of suds because I used too much soap.<br>q14/s5：The children's favorite part, however, was washing the old boat on Sunday morning, with buckets of suds and gushing water from a long pipe. | 主詞、情境、句型 |
| turn to | Many students turn to online videos when they don't understand a lesson. | 學生聽不懂課時求助網路影片 | q14 主辦單位向消防隊求助（過去式）；q15 她遇到問題總向姊姊求助（turn to＋人） | q14/s3：The organizers turned to the local fire station for help, and firefighters put up large tents in an hour.<br>q15/ref0：When she has a problem, she always turns to her sister.<br>q15/ref1：She always turns to her older sister for help when she has problems. | 主詞、情境、句型 |

#### c1-u37-l01

| 目標字 | 單字卡例句 | 單字卡情境 | 其他題情境（人工摘要） | 其他用到該字的題（現行檔原句） | 換了哪幾項 |
|---|---|---|---|---|---|
| cleanly | This knife cuts cleanly through frozen meat. | 刀切冷凍肉很俐落 | q13 盤子俐落裂成兩半好修（填空）；q15 照片乾淨地排在白底上 | q13：The plate broke [cleanly] into two halves, so Dad could fix it easily.<br>q15/s4：In the end, she chose simplicity: short, clear text and a few photos, cleanly arranged on a white background. | 主詞、情境、句型 |
| readable | Her new novel is light and very readable. | 她的新小說好讀（值得讀義） | q11 大字讓菜單更好讀（make＋受詞＋形容詞）；q15 文字在手機上幾乎無法閱讀 | q11：Large print makes the menu more readable for everyone.<br>q15/s2：The photos were crudely cut from magazines, and the text was hardly readable on a phone. | 主詞、情境、句型 |
| homely | My grandmother cooks simple, homely meals. | 奶奶煮家常菜 | q15 Amy 想要溫馨樸實的網站風格；q17 阿姨家溫馨的廚房／小旅館 | q15/s3：A designer suggested a showy new style with moving pictures and bright colors, but Amy wanted something homely that matched the quiet rooms.<br>q17/ref0：I love the homely kitchen at my aunt's house.<br>q17/ref1：I prefer small, homely hotels to big modern ones. | 主詞、情境、句型 |
| showy | He drives a showy red sports car. | 他開招搖的紅跑車 | q12 大廳裝潢花俏滿牆金色；q15 設計師建議花俏網站風格 | q12：The hall was decorated in a showy style, with gold on every wall.<br>q15/s3：A designer suggested a showy new style with moving pictures and bright colors, but Amy wanted something homely that matched the quiet rooms. | 主詞、情境、句型 |
| crudely | The sign was crudely painted on a piece of old wood. | 招牌粗糙地畫在舊木板上（被動） | q15 照片從雜誌粗糙剪下 | q15/s2：The photos were crudely cut from magazines, and the text was hardly readable on a phone. | 主詞、情境 |
| staccato | The piano teacher played the opening notes staccato. | 鋼琴老師斷奏彈開頭 | q09 雨在鐵皮屋頂敲出斷續節奏；q15 父親興奮時說話短促斷續 | q09：Rain beat a staccato rhythm on the metal roof all night.<br>q15/s6：Her father, who speaks in a staccato way when he is excited, kept saying, "Good. | 主詞、情境、句型 |
| convoluted | The film's convoluted plot left many viewers confused. | 電影情節曲折觀眾一頭霧水 | q14 退款步驟複雜沒人看懂（填空）；q15 訂房說明複雜客人放棄；q16 合約條款太複雜看不懂 | q14：The steps for getting a refund were so [convoluted] that nobody could follow them.<br>q15/s1：Its instructions for booking a room were so convoluted that many guests gave up in the middle.<br>q16/ref0：The terms of this contract are too convoluted for me to understand.<br>q16/ref1：This contract is so convoluted that I can't understand it. | 主詞、情境、句型 |
| startlingly | Her eyes were a startlingly bright blue. | 她的眼睛亮得驚人的藍 | q15 改版結果好得驚人；q10 聽選音檔新市場價格低得驚人 | q10（聽選音檔）：The prices at the new market were startlingly low, so we filled two bags with fruit.<br>q15/s5：The results were startlingly good, and bookings doubled within two months. | 主詞、情境、句型 |

#### c1-u37-l02

| 目標字 | 單字卡例句 | 單字卡情境 | 其他題情境（人工摘要） | 其他用到該字的題（現行檔原句） | 換了哪幾項 |
|---|---|---|---|---|---|
| superficially | The two plans are only superficially similar. | 兩個計畫只是表面相似 | q14 只從表面看問題錯過原因（填空）；q15 表面上看是完美寫作地點（句首） | q14：We only looked at the problem [superficially], so we missed its real cause.<br>q15/s2：Superficially, it seemed like the perfect place to write. | 主詞、情境、句型 |
| unoccupied | Please do not leave your bags on unoccupied seats. | 別把包放在空座位上（祈使） | q12 這層樓辦公室多半還空著；q15 兩旁小屋沒人住 | q12：Most of the offices on this floor are still unoccupied.<br>q15/s1：The place was spartan, with just a bed, a desk and a small stove, and the cabins on either side were unoccupied. | 主詞、情境、句型 |
| uneventful | She led a quiet, uneventful life in a small village. | 她在小村過平淡生活（名詞前） | q15 頭兩週平靜無事；q10 聽選音檔回家旅程平靜 | q10（聽選音檔）：The trip home was uneventful; the train left on time and arrived ten minutes early.<br>q15/s3：The views were fabulously beautiful, and the first two weeks were pleasantly uneventful. | 主詞、情境、句型 |
| unmanageable | My thick hair becomes unmanageable in wet weather. | 潮濕時我的頭髮難整理 | q09 假期市中心交通難控制；q15 工作信件多到難以處理 | q09：Traffic in the city center becomes almost unmanageable during the holidays.<br>q15/s4：However, the right ending remained elusive, and without internet, his work emails piled up until they became unmanageable. | 主詞、情境 |
| spartan | She prefers a spartan office with nothing on the walls. | 她偏好牆上無物的簡樸辦公室 | q15 山上小屋很簡樸；q16 旅館房間簡樸但乾淨 | q15/s1：The place was spartan, with just a bed, a desk and a small stove, and the cabins on either side were unoccupied.<br>q16/ref0：The rooms in this hotel are spartan but clean.<br>q16/ref1：This hotel has spartan but clean rooms. | 主詞、情境、句型 |
| fabulously | The family became fabulously rich from selling tea. | 家族靠賣茶變得極富有 | q11 飯店貴得驚人但服務好；q15 風景美得不得了 | q11：The hotel was fabulously expensive, but the service was perfect.<br>q15/s3：The views were fabulously beautiful, and the first two weeks were pleasantly uneventful. | 主詞、情境、句型 |
| phenomenally | The young swimmer is phenomenally talented. | 年輕泳將天分驚人 | q13 新手機銷量驚人成長（填空）；q15 小說賣得非常好 | q13：Sales of the new phone grew [phenomenally], reaching ten million in a single month.<br>q15/s6：The effort paid off: the novel sold phenomenally well, and critics praised the way it moved dynamically between past and present. | 主詞、情境、句型 |
| dynamically | The website changes dynamically as you type. | 網站隨打字即時變動 | q15 小說在過去現在之間生動切換；q17 老師教得有活力／教練帶隊有活力 | q15/s6：The effort paid off: the novel sold phenomenally well, and critics praised the way it moved dynamically between past and present.<br>q17/ref0：Our teacher teaches so dynamically that no one falls asleep in class.<br>q17/ref1：I like coaches who lead their teams dynamically. | 主詞、情境、句型 |

#### c1-u37-l03

| 目標字 | 單字卡例句 | 單字卡情境 | 其他題情境（人工摘要） | 其他用到該字的題（現行檔原句） | 換了哪幾項 |
|---|---|---|---|---|---|
| explosively | He laughed explosively at the joke and nearly fell off his chair. | 他聽笑話爆笑出聲 | q11 電影得獎後票房爆炸性成長；q15 照片展出後網路關注暴增 | q11：Ticket sales grew explosively after the film won a major award.<br>q15/s7：When the photo went on display, interest grew explosively online. | 主詞、情境、句型 |
| wizened | A wizened old tree stood alone on the hill. | 山丘上乾枯的老樹 | q13 箱底乾癟起皺的蘋果（填空）；q15 攤位上一排乾癟的蘋果 | q13：At the bottom of the box we found a few [wizened] apples, dry and full of lines.<br>q15/s6：A row of wizened apples sat on one stall, and a man in a dark coat stood somberly beside it. | 主詞、情境、句型 |
| linearly | Our sales have not grown linearly; they jumped in some months and fell in others. | 銷售額不是線性成長（否定＋說明） | q12 故事不按時間順序講；q14 成本隨使用者人數線性增加（填空）；q15 她不是從左到右按順序修 | q12：The story is not told linearly, so pay close attention to the dates.<br>q14：The data shows that costs increase [linearly] with the number of users.<br>q15/s4：She did not work linearly from left to right; instead, she started with the clearest parts. | 主詞、情境、句型 |
| recognizably | Each of the three singers has a recognizably different style. | 三位歌手風格明顯不同（修飾形容詞＋名詞） | q15 市場明顯就是今天那條街（be＋recognizably＋名詞片語） | q15/s5：After a month, the market was recognizably the same street that still exists today. | 主詞、情境、句型 |
| somberly | The news was received somberly by the whole team. | 團隊沉重地接受消息（被動） | q09 教練連輸三場後語氣沉重地發言；q15 深色外套男子神情嚴肅地站著 | q09：The coach spoke somberly after the team's third loss in a row.<br>q15/s6：A row of wizened apples sat on one stall, and a man in a dark coat stood somberly beside it. | 主詞、情境、句型 |
| blankness | The blankness of the white walls made the room feel cold. | 白牆的空白讓房間冷冰冰（主詞） | q15 照片人臉處一片空白（saw only blankness）；q17 考試時腦中一片空白／盯著空白頁 | q15/s2：At first she saw only blankness where the faces should be.<br>q17/ref0：During the exam, a sudden blankness filled my mind.<br>q17/ref1：I stared at the blankness of the empty page for an hour. | 主詞、情境、句型 |
| unassisted | The baby can now stand unassisted for a few seconds. | 寶寶能不靠扶持站幾秒 | q15 Nora 幾乎獨力修照片；q16 登山者無協助登頂；q10 聽選音檔 新機器人獨力清辦公室地板 | q10（聽選音檔）：The new robot can clean the whole office floor unassisted.<br>q15/s3：Working slowly with fairly rudimentary software, and largely unassisted, she rebuilt the image piece by piece.<br>q16/ref0：The climber reached the top of the mountain alone and unassisted.<br>q16/ref1：Alone and unassisted, the climber made it to the top of the mountain. | 主詞、情境、句型 |
| untangled | Her hair was untangled and shiny after she brushed it. | 她梳過頭髮不再打結（be 動詞後） | q15 舊相框纏住的鐵絲解開（獨立分詞構句） | q15/s8：Even the old frame, its wires finally untangled, was cleaned and kept. | 主詞、情境、句型 |

#### c1-u37-l04

| 目標字 | 單字卡例句 | 單字卡情境 | 其他題情境（人工摘要） | 其他用到該字的題（現行檔原句） | 換了哪幾項 |
|---|---|---|---|---|---|
| robustly | She robustly defended her decision at the meeting. | 她在會議上有力地為決定辯護（堅定義） | q12 新橋建得很堅固抗強風（被動、填空）；q14 植物長得強健撐過暴風雨 | q12：The new bridge is [robustly] built to stand up to strong winds.<br>q14/s3：Huge, pendulous fruits hung from the trees, and a guide explained that the plants were robustly built to survive heavy storms. | 主詞、情境、句型 |
| pendulous | The old dog has long, pendulous ears. | 老狗下垂的長耳朵 | q13 樹枝被果實壓得下垂（填空）；q14 樹上垂掛巨大果實 | q13：The tree's [pendulous] branches almost touched the ground under the weight of the fruit.<br>q14/s3：Huge, pendulous fruits hung from the trees, and a guide explained that the plants were robustly built to survive heavy storms. | 主詞、情境、句型 |
| removed | Living on a farm, she felt removed from the noise of city life. | 住農場她覺得遠離城市喧囂 | q14 這一天和平常辦公室生活截然不同；q16 工作／最終設計和我想像差很多；q09 聽選音檔新經理想法與公司做法相差甚遠 | q09（聽選音檔）：Our new manager's ideas are far removed from the way this company has always worked.<br>q14/s7：The day felt far removed from our usual office routine, and everyone agreed it was a success.<br>q16/ref0：The job was far removed from what I had imagined.<br>q16/ref1：The final design was far removed from my first sketch. | 主詞、情境、句型 |
| repellant | Many people find the smell of this cheese repellant. | 很多人覺得這起司的味道令人反感（形容詞） | q14 手臂擦防蚊液；q15 爬山前記得擦防蚊液（名詞） | q14/s4：Mosquitoes were everywhere, so we covered our arms with insect repellant.<br>q15/ref0：Remember to put on insect repellant before you go hiking.<br>q15/ref1：Before you go hiking, remember to use some insect repellant. | 主詞、情境、句型 |
| stuffiness | There was an unpleasant stuffiness in the old library. | 老圖書館裡讓人不舒服的悶熱（There was） | q10 打開門讓會議室悶熱散出（祈使）；q14 巴士悶熱大家想睡（主詞） | q10：Open the door and let out some of the stuffiness from the meeting room.<br>q14/s1：The bus was crowded, and its stuffiness made everyone sleepy. | 主詞、情境、句型 |
| tautly | She smiled tautly, trying to hide her anger. | 她繃著臉勉強笑想掩飾怒氣（繃緊義） | q08 驚悚小說寫得緊湊；q14 導覽安排緊湊（緊湊義） | q08：This thriller is tautly written, with no wasted scenes.<br>q14/s5：The tour was tautly organized, and it ended exactly on time. | 主詞、情境、句型 |
| chaotically | Cars were parked chaotically along the narrow street. | 車子亂停在窄街上（被動） | q11 孩子午餐後在遊樂場亂跑；q14 大家亂散開去買飲料 | q11：The children ran chaotically around the playground after lunch.<br>q14/s6：Afterwards, we were supposed to meet at the gate, but people wandered off chaotically to buy drinks, take photos and mingle with other visitors. | 主詞、情境、句型 |

#### c1-u37-l05

| 目標字 | 單字卡例句 | 單字卡情境 | 其他題情境（人工摘要） | 其他用到該字的題（現行檔原句） | 換了哪幾項 |
|---|---|---|---|---|---|
| synthetically | Most of the flavor in this candy is created synthetically. | 糖果味道多是人工合成（被動） | q11 橡膠現在可人工合成不必取自樹；q14 人工合成的棕櫚葉（made 前修飾） | q11：Rubber can now be made synthetically instead of from trees.<br>q14/s1：They used synthetically made palm leaves that look real from a distance, and they painted the back wall a bright aqua to suggest the sea. | 主詞、情境、句型 |
| dominantly | The older lion behaved dominantly toward the younger males. | 年長獅子對年輕公獅展現支配姿態 | q08 開會時老闆很強勢很少讓人說話 | q08：In meetings, my boss often acts dominantly and rarely lets others speak. | 主詞、情境、句型 |
| exotically | The dish was exotically spiced with ginger and lemon grass. | 菜用薑和香茅調出異國風味 | q14 戲服色彩異國繽紛；q16 阿姨客廳異國裝飾／夜市買異國花紋圍巾 | q14/s2：The costumes are exotically colorful, though the main character's simple clothes are primitively sewn on purpose.<br>q16/ref0：My aunt's living room is exotically decorated with lamps from Morocco.<br>q16/ref1：I bought an exotically patterned scarf at the night market. | 主詞、情境、句型 |
| believably | She explained her absence believably, so nobody asked more questions. | 她把缺席原因解釋得可信 | q12 最年輕演員台詞說得令人信服（填空）；q14 演惡人的演員把漁夫演得可信 | q12：Even the youngest actor delivered her lines [believably], and the audience truly felt her fear.<br>q14/s3：The lead actor, a versatile performer who usually plays cruel characters, plays a kind fisherman surprisingly believably. | 主詞、情境 |
| primitively | By today's standards, the first computers were primitively designed. | 最早的電腦設計原始（以今日標準） | q14 主角衣服刻意縫得粗糙（閱讀） | q14/s2：The costumes are exotically colorful, though the main character's simple clothes are primitively sewn on purpose. | 主詞、情境 |
| frostily | She smiled frostily and said nothing. | 她冷冷一笑不說話 | q13 我遲到經理冷冷打招呼（填空）；q14 評論家冷冷寫島像飯店大廳；q09 聽選音檔櫃台冷冷回應 | q09（聽選音檔）：When I asked about the delay, the receptionist answered frostily and turned back to her computer.<br>q13：My manager greeted me [frostily] after I arrived an hour late.<br>q14/s4：Critics were mostly positive, although one critic wrote frostily that the island "looked more like a hotel lobby." | 主詞、情境、句型 |
| aqua | She wore an aqua dress to the summer party. | 她穿水藍色洋裝去派對（名詞前） | q10 海灣的水是水藍色（名詞）；q14 背景牆漆成水藍色；q15 把浴室牆漆成水藍色（paint＋受詞＋aqua） | q10：The water in the bay was a clear, bright aqua.<br>q14/s1：They used synthetically made palm leaves that look real from a distance, and they painted the back wall a bright aqua to suggest the sea.<br>q15/ref0：I want to paint the bathroom walls aqua.<br>q15/ref1：I'd like to paint the walls of my bathroom aqua. | 主詞、情境、句型 |

#### c1-u37-l06

| 目標字 | 單字卡例句 | 單字卡情境 | 其他題情境（人工摘要） | 其他用到該字的題（現行檔原句） | 換了哪幾項 |
|---|---|---|---|---|---|
| chiselled | The actor is famous for his chiselled jaw. | 演員輪廓分明的下巴（外貌義） | q08 石階數百年前手工鑿成（被動、鑿刻義）；q14 店裡鑿刻的石獅 | q08：These stone steps were chiselled by hand hundreds of years ago.<br>q14/s0：Leo's furniture shop is a quirky place, eclectically furnished with pieces from every period: a chiselled stone lion sits next to plastic chairs from around 1970. | 主詞、情境、句型 |
| eclectically | She reads eclectically, from science to poetry. | 她閱讀兼收並蓄（修飾動詞） | q11 爺爺公寓用旅行物品多元佈置；q14 店裡擺滿各年代家具（修飾過去分詞） | q11：My grandfather's flat is eclectically decorated with things from his travels.<br>q14/s0：Leo's furniture shop is a quirky place, eclectically furnished with pieces from every period: a chiselled stone lion sits next to plastic chairs from around 1970. | 主詞、情境、句型 |
| fiddly | This tiny phone keyboard is too fiddly for my thumbs. | 手機小鍵盤太難按 | q13 縫小鈕扣很費工（填空）；q14 修舊家具很費工；q16 穿針／包小禮物很費工 | q13：Sewing these tiny buttons onto the shirt is really [fiddly].<br>q14/s1：Repairing old pieces is fiddly work, especially the tiny drawer handles, but Leo enjoys it.<br>q16/ref0：I find threading a needle really fiddly.<br>q16/ref1：Wrapping small gifts nicely is a fiddly job for me. | 主詞、情境、句型 |
| slackly | The team played slackly in the second half and lost. | 球隊下半場打得鬆散（懈怠義） | q10 繩子鬆垮垂在兩船間；q14 窗簾鬆垮掛著（鬆弛義） | q10：The rope hung slackly between the two boats.<br>q14/s5：It only noted that the back room was stuffily warm and that the curtains hung slackly over the windows. | 主詞、情境、句型 |
| stuffily | The waiter spoke stuffily, as if we did not belong there. | 服務生說話古板拘謹（古板義） | q14 後面房間悶熱不通風（悶熱義） | q14/s5：It only noted that the back room was stuffily warm and that the curtains hung slackly over the windows. | 主詞、情境、句型 |
| unreliably | The weather website predicts rain unreliably in the mountains. | 天氣網站預測山區下雨不可靠 | q12 舊印表機運作不穩定（填空）；q14 Leo 的網站運作不穩定；q15 舊電梯不穩定要走樓梯；q09 聽選音檔火車班次不可靠 | q09（聽選音檔）：The trains on this line run so unreliably that I always leave home an hour early.<br>q12：The old printer works [unreliably], so we never know if a page will come out.<br>q14/s2：His website, however, runs unreliably, and orders sometimes disappear.<br>q15/ref0：This old lift works so unreliably that we'd better take the stairs.<br>q15/ref1：The old elevator runs unreliably, so we should take the stairs. | 主詞、情境 |
| unscathing | Her comments on my essay were gentle and unscathing. | 她對我文章的評語溫和 | q14 知名評論家的文章出奇溫和（店家評論） | q14/s4：Leo expected a very critical review, but the article was surprisingly unscathing. | 主詞、情境 |

#### c1-u38-l01

| 目標字 | 單字卡例句 | 單字卡情境 | 其他題情境（人工摘要） | 其他用到該字的題（現行檔原句） | 換了哪幾項 |
|---|---|---|---|---|---|
| sarcasm | Sarcasm can be hard to understand in a second language. | 用第二語言時諷刺難懂（泛論） | q14 她的回答充滿挖苦（填空）；q15 Wendy 回答時帶溫和挖苦 | q14：Her reply was full of [sarcasm], so I knew she was not really pleased.<br>q15/s6：Some old habits remained: Wendy still answered every question with gentle sarcasm. | 主詞、情境、句型 |
| fanciful | Her story about meeting a famous singer on the bus sounded fanciful. | 她說公車上遇到歌手聽來像編的 | q09 海上漂浮城市曾看似異想天開；q15 Daniel 自造船環遊世界的計畫 | q09：The idea of a city floating on the sea once seemed fanciful.<br>q15/s7：When Daniel, always a little eccentric, described his fanciful plan to sail around the world on a boat he built himself, everyone laughed, but nobody called it impossible. | 主詞、情境、句型 |
| quip | The speaker opened with a quick quip about the weather. | 講者開場拿天氣說俏皮話（名詞） | q11 她打趣說貓才是老大（動詞＋that）；q15 老師打趣說我們終於進步 | q11：She quipped that her cat was the real boss of the house.<br>q15/s5：He quipped that we had finally improved. | 主詞、情境、句型 |
| agreeable | Her husband is an agreeable man who gets along with everyone. | 她先生隨和跟誰都處得來（形容人） | q15 河邊氣氛宜人的小餐廳；q17 河邊愉快的下午／秋天天氣宜人（形容地方、時光） | q15/s0：Twenty years after high school, our class held a reunion at an agreeable little restaurant by the river.<br>q17/ref0：We had an agreeable afternoon walking along the river.<br>q17/ref1：I find the weather in autumn very agreeable. | 主詞、情境、句型 |
| reminisce | My grandparents love to reminisce about their first home. | 爺爺奶奶追憶第一個家 | q15 同學會花數小時追憶老師（spent hours＋-ing） | q15/s1：We spent hours reminiscing about our teachers. | 主詞、情境、句型 |
| exuberance | The puppy's exuberance made everyone laugh. | 小狗活潑把大家逗笑（所有格主詞） | q12 他們在婚禮上熱情洋溢地跳舞（with＋名詞）；q15 陳老師的熱情沒減 | q12：They danced with great exuberance at their friend's wedding.<br>q15/s3：Chen, our old history teacher, came too, and his exuberance had not faded at all. | 主詞、情境、句型 |
| hypocritical | The film takes a funny look at hypocritical attitudes in a small town. | 電影看小鎮的虛偽態度（名詞前） | q13 自己不準時卻批評別人遲到（It is…of him to、填空）；q15 說不可能就太虛偽 | q13：It is [hypocritical] of him to criticize others for being late when he is never on time himself.<br>q15/s8：That would have been hypocritical, since most of us had once had the same dream. | 主詞、情境、句型 |
| negligent | The company was found negligent for not repairing the broken stairs. | 公司沒修樓梯被認定疏失 | q15 老師說我們是最不盡責的班（輪到打掃從不掃）；q16 保全值班睡著被認為失職；q10 聽選音檔 保母疏忽讓前門開著 | q10（聽選音檔）：The babysitter was negligent and left the front door open all afternoon.<br>q15/s4：Someone reminded him that he once called us the most negligent class in the school's history, because we never cleaned the classroom when it was our turn.<br>q16/ref0：The security guard was considered negligent because he fell asleep on duty.<br>q16/ref1：Because he fell asleep at work, the guard was seen as negligent. | 主詞、情境 |

#### c1-u38-l02

| 目標字 | 單字卡例句 | 單字卡情境 | 其他題情境（人工摘要） | 其他用到該字的題（現行檔原句） | 換了哪幾項 |
|---|---|---|---|---|---|
| pleasurable | Reading in the bath is a simple but pleasurable habit. | 泡澡看書是愉快習慣 | q15 新工作比每天提心吊膽愉快多了（比較級） | q15/s7：When old colleagues asked about her new job, she smiled wryly and said it was far more pleasurable than being afraid every day. | 主詞、情境、句型 |
| instinctive | Cats have an instinctive fear of deep water. | 貓天生怕深水 | q09 她本能的善意讓新同學受歡迎；q15 Joy 本能反應是想開口 | q09：Her instinctive kindness made the new students feel welcome.<br>q15/s3：Joy's instinctive reaction was to speak up, but she decided to wait. | 主詞、情境、句型 |
| tranquility | Nothing could disturb her tranquility, not even the crying baby next door. | 什麼都打擾不了她的平靜（內心） | q12 平靜海面為沙灘帶來寧靜；q15 山上的寧靜讓她清楚思考（環境） | q12：The calm sea brought a feeling of tranquility to the whole beach.<br>q15/s5：Weekends became her escape: she hiked in the hills, where the tranquility helped her think clearly. | 主詞、情境、句型 |
| compliant | As a child, she was quiet and compliant, always doing what she was told. | 她小時候安靜順從（形容人） | q15 經理要求員工服從（expected staff to be） | q15/s1：Her manager expected staff to be compliant and never to question his ideas. | 主詞、情境、句型 |
| bubbly | Her bubbly laugh filled the whole room. | 她活潑的笑聲充滿房間（修飾笑聲） | q11 妹妹活潑開朗到處交朋友（so…that）；q15 活潑的年輕設計師（同位語） | q11：My sister is so bubbly that she makes friends everywhere she goes.<br>q15/s0：When Joy, a bubbly young designer, joined a large advertising company, she found the office strangely quiet. | 主詞、情境、句型 |
| wryly | "At least it can't get any worse," he said wryly. | 「至少不會更糟」他自嘲地說 | q14 班機第三次延誤他苦笑（smiled ____ when、填空）；q15 Joy 苦笑說新工作愉快；q17 傘壞了我苦笑／公車開走我苦笑 | q14：He smiled [wryly] when his flight was delayed for the third time that week.<br>q15/s7：When old colleagues asked about her new job, she smiled wryly and said it was far more pleasurable than being afraid every day.<br>q17/ref0：I smiled wryly when my umbrella broke after five minutes of rain.<br>q17/ref1：When the bus left without me, I laughed wryly and started walking. | 主詞、情境、句型 |
| unsettling | There was something unsettling about the empty streets at night. | 夜裡空街令人不安（something＋形容詞） | q13 提問後的長長沉默令人不安（填空）；q15 會議後的沉默令人不安 | q13：The long silence after his question was deeply [unsettling].<br>q15/s2：At her first meeting, he gave a scathing review of a colleague's work in front of everyone, and the silence afterwards was unsettling. | 主詞、情境、句型 |
| scathing | A scathing article in the paper blamed the city for its lack of parks. | 報上尖刻文章怪市府公園少 | q15 經理當眾嚴厲批評同事作品；q16 老師對我的報告嚴厲批評；q10 聽選音檔評論家批餐廳 | q10（聽選音檔）：The critic wrote a scathing review, calling the new restaurant's food cold and its prices silly.<br>q15/s2：At her first meeting, he gave a scathing review of a colleague's work in front of everyone, and the silence afterwards was unsettling.<br>q16/ref0：My teacher was scathing about my report.<br>q16/ref1：The teacher made some scathing comments on my report. | 主詞、情境、句型 |

#### c1-u38-l03

| 目標字 | 單字卡例句 | 單字卡情境 | 其他題情境（人工摘要） | 其他用到該字的題（現行檔原句） | 換了哪幾項 |
|---|---|---|---|---|---|
| hypocrite | Nobody likes to be called a hypocrite. | 沒人喜歡被叫偽君子（泛論、被動） | q15 負責人嘴上說善良只想自己；q16 他嘴上說省錢卻天天買衣服（What a hypocrite） | q15/s4：Kai detested deceit, and he felt the director was a hypocrite who talked about kindness while thinking only of himself.<br>q16/ref0：He talks about saving money but buys new clothes every day. What a hypocrite!<br>q16/ref1：He tells everyone to save money, yet he buys new clothes every day; he is such a hypocrite! | 主詞、情境、句型 |
| altruistic | Not every act of giving is truly altruistic. | 不是每種付出都真正無私（泛論） | q11 科學家認為海豚有利他行為；q15 Kai 滿懷無私理想 | q11：Some scientists believe that dolphins can show altruistic behavior.<br>q15/s1：He was full of altruistic hopes. | 主詞、情境、句型 |
| deceit | Their whole business was built on deceit. | 他們的生意建立在欺騙上 | q13 調查揭露經理多年欺騙（填空）；q15 Kai 痛恨欺騙 | q13：The investigation revealed years of [deceit] by the company's managers.<br>q15/s4：Kai detested deceit, and he felt the director was a hypocrite who talked about kindness while thinking only of himself. | 主詞、情境、句型 |
| riveting | The final match was riveting from start to finish. | 決賽從頭到尾精彩 | q09 深海魚紀錄片精彩；q15 讀者覺得 Kai 的書吸引人（find＋受詞＋形容詞） | q09：The documentary about deep-sea fish was absolutely riveting.<br>q15/s7：Readers found it riveting, and many said they were so engrossed that they finished it in one night. | 主詞、情境、句型 |
| disillusionment | Her disillusionment with city life led her to move to the coast. | 她對城市生活幻滅搬去海邊 | q15 幾個月內 Kai 的理想幻滅（set in） | q15/s2：Within months, however, disillusionment set in. | 主詞、情境、句型 |
| engross | The puzzle engrossed the children for hours. | 拼圖讓孩子專注幾小時（主動） | q14 我看電影太投入忘了吃爆米花（被動、填空）；q15 讀者太入迷一晚讀完；q10 聽選音檔看書入迷坐過站 | q10（聽選音檔）：I was so engrossed in my book that I missed my stop on the train.<br>q14：I was so [engrossed] in the film that I forgot to eat my popcorn.<br>q15/s7：Readers found it riveting, and many said they were so engrossed that they finished it in one night. | 主詞、情境、句型 |
| enterprising | Enterprising farmers in the area now sell their fruit online. | 當地農民網路賣水果 | q15 有進取心的 Kai 自己教村童讀書；q17 表姊把嗜好變烘焙店／鄰居六十歲創業 | q15/s5：Instead of giving up, the enterprising young man started his own small project, teaching village children to read on weekends.<br>q17/ref0：My enterprising cousin turned her hobby into a small bakery.<br>q17/ref1：I admire my enterprising neighbor, who started a cleaning business at sixty. | 主詞、情境 |
| detest | I detest waiting in long lines. | 我討厭排長隊 | q12 她討厭講手機大聲的人；q15 Kai 痛恨欺騙 | q12：She detests people who talk loudly on their phones.<br>q15/s4：Kai detested deceit, and he felt the director was a hypocrite who talked about kindness while thinking only of himself. | 主詞、情境 |

#### c1-u38-l04

| 目標字 | 單字卡例句 | 單字卡情境 | 其他題情境（人工摘要） | 其他用到該字的題（現行檔原句） | 換了哪幾項 |
|---|---|---|---|---|---|
| trying | The long wait at the airport was trying for everyone. | 機場漫長等待令人煎熬 | q15 對 Mia 來說是難熬的一週（a trying week）；q10 聽選音檔照顧三個病童的週末 | q10（聽選音檔）：Looking after three sick children at once made it a very trying weekend for Ben.<br>q15/s0：It had been a trying week for Mia, who works at a customer service center. | 主詞、情境、句型 |
| daydream | His daydream of opening a café finally came true. | 他開咖啡館的白日夢實現（名詞） | q15 Mia 整個星期四在做白日夢（in a daydream）；q16 上課別再做白日夢（動詞、祈使） | q15/s3：Mia spent most of Thursday in a daydream about her weekend plans.<br>q16/ref0：Stop daydreaming in class and listen to the teacher.<br>q16/ref1：Don't daydream during class anymore; listen to your teacher. | 主詞、情境、句型 |
| exhilaration | The exhilaration of winning the race lasted for days. | 贏比賽的興奮持續數天（主詞） | q11 遊樂設施衝下時興奮尖叫（with＋名詞）；q15 熱氣球升空感到無比興奮 | q11：We screamed with exhilaration as the ride dropped toward the ground.<br>q15/s5：As she rose above the hills, she felt pure exhilaration and a new sense of vitality. | 主詞、情境、句型 |
| gusto | The children ate their pizza with gusto. | 孩子津津有味吃披薩（with gusto 為固定搭配） | q15 Mia 和朋友興致勃勃唱卡拉 OK；q17 我在婚禮唱歌／派對前打掃 | q15/s6：That evening, after a rather lackluster dinner at a hotel, she and her friends sang karaoke with great gusto until midnight.<br>q17/ref0：I sang my favorite song with gusto at my sister's wedding.<br>q17/ref1：I cleaned the whole house with gusto before the party. | 主詞、情境 |
| astray | The walkers went astray in the fog and had to call for help. | 健行的人在霧中迷路求救（人迷路） | q14 行李轉機時弄丟（填空）；q15 包裹寄丟（物品遺失） | q14：Our luggage went [astray] during the change of flights and arrived two days later.<br>q15/s1：On Monday, an irate customer shouted at her for twenty minutes because his parcel had gone astray. | 主詞、情境 |
| lackluster | The team gave a lackluster performance in the final. | 球隊決賽表現平平 | q13 卡司堅強但電影故事平淡（填空）；q15 飯店晚餐相當平淡 | q13：Despite its famous cast, the film had a [lackluster] story, and few people went to see it.<br>q15/s6：That evening, after a rather lackluster dinner at a hotel, she and her friends sang karaoke with great gusto until midnight. | 主詞、情境、句型 |
| sentient | Most scientists agree that fish are sentient beings. | 科學家同意魚是有感知的生物 | q12 有人相信機器人會有知覺；q15 同事開玩笑說程式有了知覺 | q12：Some people believe that robots will one day be sentient.<br>q15/s2：On Wednesday, the company's new answering program gave strange replies, and a colleague joked that it had become sentient. | 主詞、情境、句型 |
| irate | Irate drivers honked at the slow bus. | 憤怒駕駛對慢公車按喇叭 | q09 鄰居半夜因噪音來敲門；q15 客人因包裹寄丟對 Mia 吼 | q09：An irate neighbor knocked on our door at midnight because of the noise.<br>q15/s1：On Monday, an irate customer shouted at her for twenty minutes because his parcel had gone astray. | 主詞、情境、句型 |

#### c1-u38-l05

| 目標字 | 單字卡例句 | 單字卡情境 | 其他題情境（人工摘要） | 其他用到該字的題（現行檔原句） | 換了哪幾項 |
|---|---|---|---|---|---|
| monotonous | The speaker's monotonous voice put half the audience to sleep. | 講者單調的聲音讓聽眾睡著 | q09 每天回一樣的郵件很單調；q15 一天講六遍可能變單調 | q09：Answering the same emails every day can be very monotonous.<br>q15/s4：Repeating the same facts six times a day could become monotonous, but she keeps her talks fresh and a little spontaneous. | 主詞、情境、句型 |
| candidly | Can I speak candidly? I think the plan will fail. | 「我可以直說嗎？」覺得計畫會失敗（問句） | q15 Lena 坦白承認仍愛這份工作 | q15/s1：Friends say she has an enviable job, and she candidly admits that she still loves it. | 主詞、情境、句型 |
| viciously | The wind tore viciously at our tent all night. | 狂風整晚兇猛撕扯帳篷 | q11 兩隻貓為魚兇狠打架；q10 聽選音檔看門狗兇狠吠叫 | q10（聽選音檔）：The guard dog barked viciously at us until its owner called it back.<br>q11：The two cats fought viciously over the last piece of fish. | 主詞、情境、句型 |
| undaunted | She was undaunted by the size of the task. | 她沒被任務規模嚇倒（be undaunted by） | q13 考兩次沒過仍不氣餒再報名（remained＋形容詞、填空）；q15 洞穴關閉 Lena 不氣餒（句首） | q13：Even after failing the exam twice, he remained [undaunted] and signed up again.<br>q15/s6：Undaunted, Lena used the time to study the rocks and plan a new tour. | 主詞、情境、句型 |
| enviable | The hotel is in an enviable position right next to the beach. | 飯店就在海灘旁地點令人羨慕 | q15 朋友說她工作令人羨慕；q16 她在家工作又常旅行令人羨慕 | q15/s1：Friends say she has an enviable job, and she candidly admits that she still loves it.<br>q16/ref0：She can work from home and travel abroad often; her life is enviable.<br>q16/ref1：She has an enviable life: she works from home and often travels abroad. | 主詞、情境 |
| tact | He handled his friend's mistake with tact and kindness. | 他圓融處理朋友的錯（with tact） | q12 告訴朋友點子不好需要圓融（require＋名詞）；q15 Lena 需要圓融安撫遊客 | q12：Telling a friend that his idea is bad requires a lot of tact.<br>q15/s3：Some visitors find the narrow tunnels claustrophobic and want to turn back, so she needs great tact to keep them calm. | 主詞、情境、句型 |
| unwavering | Thank you for your unwavering support over the years. | 謝謝你多年來堅定的支持 | q14 她堅定的支持給我創業勇氣（填空）；q15 她堅定的熱情；q17 我的信念堅定／父母的支持一直堅定（be 動詞後） | q14：Her [unwavering] support gave me the courage to start my own business.<br>q15/s7：Her unwavering passion has made her one of the most popular guides in the area.<br>q17/ref0：My belief that hard work pays off is unwavering.<br>q17/ref1：My parents' support for my dream has always been unwavering. | 主詞、情境 |
| claustrophobic | The tiny apartment felt claustrophobic after their big house. | 住過大房子後小公寓顯得壓迫 | q15 遊客覺得狹窄通道壓迫想回頭 | q15/s3：Some visitors find the narrow tunnels claustrophobic and want to turn back, so she needs great tact to keep them calm. | 主詞、情境、句型 |

#### c1-u38-l06

| 目標字 | 單字卡例句 | 單字卡情境 | 其他題情境（人工摘要） | 其他用到該字的題（現行檔原句） | 換了哪幾項 |
|---|---|---|---|---|---|
| blithely | She blithely assumed that the train would wait for her. | 她滿不在乎以為火車會等她 | q15 Rosa 滿不在乎不理會教練的話 | q15/s4：Rosa blithely ignored the comment and kept trying. | 主詞、情境、句型 |
| sarcastically | The article sarcastically praised the city for its beautiful traffic jams. | 文章諷刺稱讚城市塞車 | q12 他語帶諷刺回答我知道他不高興；q15 教練諷刺說馬讀過她的書 | q12：He answered sarcastically, so I knew he was annoyed.<br>q15/s3：Her instructor said sarcastically that Kiko must have read her books. | 主詞、情境、句型 |
| aimlessly | The small boat moved aimlessly with the wind on the lake. | 小船在湖上隨風漂動 | q09 遊客在老市場閒逛；q15 Rosa 寫不出時在鎮上亂走 | q09：The tourists wandered aimlessly through the old market.<br>q15/s5：When she is stuck on a story, she walks aimlessly around town until an idea comes. | 主詞、情境、句型 |
| temperamental | The famous chef was talented but temperamental. | 知名主廚有才華但喜怒無常 | q15 馬對大人喜怒無常；q17 筆電時好時壞／弟弟餓了就鬧脾氣；q10 聽選音檔舊車時好時壞 | q10（聽選音檔）：My old car is temperamental: some mornings it starts at once, and some mornings it won't start at all.<br>q15/s2：Her horse, Kiko, is docile with children but temperamental with adults, and on Rosa's first day he refused to move.<br>q17/ref0：My laptop is temperamental and sometimes shuts down for no reason.<br>q17/ref1：My little brother becomes temperamental when he is hungry. | 主詞、情境、句型 |
| gutsy | It was a gutsy decision to leave a safe job and travel the world. | 辭職環遊世界是大膽決定（It was…to） | q11 要有膽量的球員才敢那樣出手（It takes…）；q15 Rosa 開朗又有膽量 | q11：It takes a gutsy player to try a shot like that.<br>q15/s1：In person, though, she is cheerful and gutsy: at sixty, she learned to ride a horse. | 主詞、情境、句型 |
| macabre | The film has a dark, macabre sense of humor. | 電影有陰森的幽默感 | q13 讀者喜歡她關於鬼魂古墓的故事（填空）；q15 Rosa 略帶陰森的短篇 | q13：Many readers enjoy her [macabre] stories about ghosts and old graves.<br>q15/s0：My aunt Rosa is a writer known for her slightly macabre short stories, which usually take place in old houses at night. | 主詞、情境、句型 |
| flattery | Flattery will get you nowhere with this teacher. | 對這位老師拍馬屁沒用（主詞） | q14 別被他的奉承騙了（填空）；q15 比起奉承她更喜歡坦白意見 | q14：Don't let his [flattery] fool you; he only says nice things when he wants something.<br>q15/s6：She prefers candid opinions to flattery, so when a fan once called her the best writer alive, she just laughed. | 主詞、情境、句型 |
| docile | The once docile class became noisy after lunch. | 原本乖巧的班級午餐後吵鬧 | q15 馬對小孩很溫順；q16 這隻狗看起來兇其實溫順 | q15/s2：Her horse, Kiko, is docile with children but temperamental with adults, and on Rosa's first day he refused to move.<br>q16/ref0：This dog looks fierce, but it is actually very docile.<br>q16/ref1：The dog may look scary, but in fact it is very docile. | 主詞、情境、句型 |

#### c1-u38-l07

| 目標字 | 單字卡例句 | 單字卡情境 | 其他題情境（人工摘要） | 其他用到該字的題（現行檔原句） | 換了哪幾項 |
|---|---|---|---|---|---|
| dutiful | The dutiful student finished every assignment on time. | 盡責學生準時交作業 | q12 盡責員工有時也需休假（Even…needs）；q15 Sam 是每週打給父母的孝順兒子 | q12：Even a dutiful employee needs a day off sometimes.<br>q15/s3：Sam, a dutiful son who phoned his parents every Sunday, did not want to worry them, so he only grumbled to himself. | 主詞、情境、句型 |
| naively | Some tourists naively hand their passports to strangers. | 有些遊客天真地把護照交給陌生人 | q14 我天真以為便宜航班附餐（填空）；q15 Sam 天真以為大家會保持廚房乾淨 | q14：I [naively] believed that the cheap flight would include free meals.<br>q15/s0：When Sam moved into a shared flat, he naively believed that everyone would keep the kitchen clean. | 主詞、情境、句型 |
| sedate | The film moves at a sedate pace, so be patient. | 電影節奏從容要有耐心 | q09 小鎮從容的魅力讓遊客放鬆；q15 公寓生活平靜多了；q10 聽選音檔悠閒的遊河行程 | q09：The small town has a sedate charm that many visitors find relaxing.<br>q10（聽選音檔）：We chose a sedate river cruise instead of the exciting fast boat tour.<br>q15/s7：Life in the flat has been far more sedate ever since. | 主詞、情境、句型 |
| glum | Why do you look so glum? Did something happen? | 你怎麼看起來悶悶不樂（問句） | q11 球員輸掉決賽後悶悶不樂；q15 情況讓 Sam 沮喪數週（left him glum） | q11：The players looked glum after losing the final.<br>q15/s4：Together with the monotony of his office job, the situation left him glum for weeks. | 主詞、情境、句型 |
| fiend | My dad is a fresh-air fiend who opens every window, even in winter. | 我爸愛新鮮空氣冬天也開窗 | q15 Ellie 是健身狂早上五點跑步；q17 叔叔是園藝狂／好友是電影狂 | q15/s2：Ellie, who lived across the hall, was a fitness fiend who went running at five every morning and slammed the door on her way out.<br>q17/ref0：My uncle is a gardening fiend who spends every weekend outside.<br>q17/ref1：My best friend is a movie fiend; she watches at least three films a week. | 主詞、情境 |
| monotony | Music helps break the monotony of a long drive. | 音樂打破長途開車的單調 | q13 每晚洗碗的單調讓她討厭下廚（填空、主詞）；q15 辦公室工作的單調 | q13：The [monotony] of washing dishes every night made her start to hate cooking.<br>q15/s4：Together with the monotony of his office job, the situation left him glum for weeks. | 主詞、情境、句型 |
| slob | I'm a bit of a slob at home, but my desk at work is tidy. | 我在家有點邋遢但辦公桌整齊（a bit of a slob） | q15 Leon 髒盤子亂放；q16 哥哥襪子丟到處都是 | q15/s1：He soon found out that Leon, who had the room next to his, was a complete slob who left dirty plates everywhere.<br>q16/ref0：My brother is a slob; he leaves his socks everywhere.<br>q16/ref1：My older brother is such a slob that his socks are all over the place. | 主詞、情境、句型 |
| disquieting | There has been a disquieting rise in online fraud. | 網路詐騙令人不安地增加 | q15 冰箱上令人不安的紙條 | q15/s5：Then one evening he found a disquieting note on the fridge: "We need to talk." | 主詞、情境、句型 |

#### c1-u38-l08

| 目標字 | 單字卡例句 | 單字卡情境 | 其他題情境（人工摘要） | 其他用到該字的題（現行檔原句） | 換了哪幾項 |
|---|---|---|---|---|---|
| ferociously | The tiger roared ferociously at the visitors. | 老虎對遊客兇猛咆哮（兇猛義） | q12 她在研討會激烈為研究辯護；q15 Hana 拚命爭取預算（激烈義） | q12：She defended her research ferociously at the conference.<br>q15/s5：Hana fought ferociously for a small budget, and with real cleverness she turned the empty shops into stages. | 主詞、情境、句型 |
| desertion | His teammates never forgave his desertion of the team before the final. | 他決賽前拋下球隊，隊友無法原諒（desertion of the team） | q15 年輕人一個個離開讓村子空了一半（主詞） | q15/s0：After the paper factory closed, the slow desertion of young people left the village of Marlow half empty. | 主詞、情境、句型 |
| glumly | He stared glumly at the rain outside the window. | 他悶悶不樂盯著窗外的雨 | q15 鄰居悶悶不樂預言沒人來；q17 我錯過末班車悶悶走回家／看考卷 | q15/s4：Some neighbors glumly predicted that nobody would come.<br>q17/ref0：I walked home glumly after missing the last bus.<br>q17/ref1：I glumly looked at my test score and put the paper away. | 主詞、情境、句型 |
| beguiling | The island has a beguiling mix of old temples and quiet beaches. | 小島寺廟海灘令人著迷的組合 | q11 她迷人的笑容讓人難拒絕；q15 Hana 說故事的方式很迷人 | q11：Her beguiling smile made it hard to say no to her.<br>q15/s2：Then Hana, a former teacher with a beguiling way of telling stories, returned home. | 主詞、情境、句型 |
| lethargic | The lethargic cat barely lifted its head when I came in. | 懶洋洋的貓幾乎不抬頭 | q09 午餐後長會議讓員工提不起勁（leave＋受詞＋feeling）；q15 留下來的人提不起勁 | q09：Long meetings after lunch leave many staff feeling lethargic.<br>q15/s1：Those who stayed felt lethargic, and the village council spent years wrangling over plans that never happened. | 主詞、情境、句型 |
| wrangle | The two companies are still wrangling about the price. | 兩家公司為價格爭執（wrangle about） | q14 鄰居為圍籬高度爭吵多年（填空）；q15 議會多年爭論計畫；q10 聽選音檔 兄弟爭合買的舊車 | q10（聽選音檔）：The two brothers wrangled for months over who should keep the old car they had bought together.<br>q14：The neighbors [wrangled] for years over the height of the fence between their gardens.<br>q15/s1：Those who stayed felt lethargic, and the village council spent years wrangling over plans that never happened. | 主詞、情境 |
| aimless | We took an aimless drive along the coast on Sunday. | 週日沿海岸漫無目的兜風 | q13 沒計畫的長週末緩慢又漫無目的（填空）；q15 青少年漫無目的閒晃 | q13：Without any plan, the long weekend felt slow and [aimless].<br>q15/s3：She noticed teenagers wandering about with aimless looks and decided to give them a project: a festival of stories. | 主詞、情境、句型 |
| cleverness | The cleverness of the design surprised everyone. | 設計的巧妙讓大家驚訝（主詞） | q15 Hana 巧妙地把空店面變表演場地（with cleverness）；q16 大家佩服她解決問題的聰明 | q15/s5：Hana fought ferociously for a small budget, and with real cleverness she turned the empty shops into stages.<br>q16/ref0：Everyone admired her cleverness in solving this problem.<br>q16/ref1：Everyone was impressed by the cleverness she showed in solving the problem. | 主詞、情境、句型 |

#### c1-u38-l09

| 目標字 | 單字卡例句 | 單字卡情境 | 其他題情境（人工摘要） | 其他用到該字的題（現行檔原句） | 換了哪幾項 |
|---|---|---|---|---|---|
| lethargy | A long, gray winter can bring a feeling of lethargy. | 漫長陰冬帶來倦怠感（a feeling of） | q12 星期天倦怠得賴床到中午（kept me in bed）；q15 劇團擺脫過去的倦怠 | q12：On Sunday, a deep lethargy kept me in bed until noon.<br>q15/s5：Still, by the end of the season the group had shaken off its old lethargy and even received a commendation from the city council. | 主詞、情境、句型 |
| tedium | The tedium of filling in forms made him want to quit. | 填表格的單調讓他想放棄（主詞） | q13 幽默感讓我們撐過六小時會議（填空）；q15 週日演出一直很沉悶（suffered from） | q13：Only his sense of humor saved us from the [tedium] of the six-hour meeting.<br>q15/s0：For years, the Sunday show at our community theater suffered from tedium: the same old plays, performed with little energy. | 主詞、情境、句型 |
| commendation | The nurse received a commendation for her quick thinking. | 護理師因反應機敏獲表揚 | q15 劇團獲市議會表揚；q17 姊姊幫助新生獲學校表揚／團隊提早完成獲表揚（同為 receive a commendation for，主詞與情境不同） | q15/s5：Still, by the end of the season the group had shaken off its old lethargy and even received a commendation from the city council.<br>q17/ref0：My sister received a commendation from her school for helping new students.<br>q17/ref1：Our team got a commendation for finishing the project early. | 主詞、情境 |
| inexcusable | Such rude behavior toward customers is inexcusable. | 對客人無禮是不可原諒的 | q14 為遲到說謊就不可原諒（填空）；q15 演員首演遲到一小時導演說不可原諒；q10 聽選音檔忘了好友婚禮 | q10（聽選音檔）：Forgetting your best friend's wedding is simply inexcusable, no matter how busy you are.<br>q14：Being late is one thing, but lying about it is [inexcusable].<br>q15/s4：Not everything went smoothly: one actor arrived an hour late on opening night, which the director called inexcusable. | 主詞、情境、句型 |
| scornful | She gave a scornful laugh when he offered to help. | 他說要幫忙她輕蔑一笑（a scornful laugh） | q11 她輕蔑的言論傷了團隊；q15 一向瞧不起地方劇場的評論家（scornful of） | q11：Her scornful remarks hurt the whole team.<br>q15/s3：The cast performed with such verve that even a critic who had been scornful of local theater wrote a warm review. | 主詞、情境、句型 |
| zany | The film's zany humor is perfect for children. | 電影滑稽古怪的幽默適合小孩 | q15 新導演古怪有趣的點子；q16 叔叔總想出古怪好笑的點子 | q15/s1：Then a new director arrived with zany ideas, such as a play in which the actors cooked real soup in front of the audience.<br>q16/ref0：My uncle always comes up with zany ideas.<br>q16/ref1：My uncle always has some zany and funny ideas. | 主詞、情境、句型 |
| salivate | Babies salivate a lot when their first teeth are coming in. | 嬰兒長牙時流很多口水（泛論） | q09 狗聽到飼料袋就流口水；q15 煮湯香味讓觀眾流口水（make＋受詞＋salivate） | q09：The dog began to salivate as soon as it heard the food bag.<br>q15/s2：The smell made people salivate, and the actors' antics kept everyone laughing. | 主詞、情境、句型 |
| verve | She told the story with great verve and humor. | 她說故事生動有勁又幽默 | q15 演員演得活力十足（with such verve that） | q15/s3：The cast performed with such verve that even a critic who had been scornful of local theater wrote a warm review. | 主詞、情境 |

#### c1-u38-l10

| 目標字 | 單字卡例句 | 單字卡情境 | 其他題情境（人工摘要） | 其他用到該字的題（現行檔原句） | 換了哪幾項 |
|---|---|---|---|---|---|
| wickedly | He smiled wickedly as he hid his sister's shoes. | 他藏妹妹鞋子壞壞地笑（使壞義） | q15 Ivy 好笑得不得了的笑話（wickedly funny，極其義） | q15/s4：Many other acts were provocative or even raunchy, so the judges found her clean, wickedly funny jokes refreshingly different. | 主詞、情境、句型 |
| smugly | "I told you so," she said smugly. | 「我早說了吧」她得意地說 | q11 他答對後得意往後一靠；q15 對手晉級時得意地笑 | q11：He leaned back smugly after answering the question correctly.<br>q15/s6：One rival smiled smugly when he got through, but he lost to Ivy in the final. | 主詞、情境、句型 |
| gamely | The tired runner gamely finished the race in last place. | 疲憊跑者不服輸跑完拿最後 | q09 孩子勇敢嘗試派對每道怪菜；q14 舞者跌倒兩次仍勇敢站起（填空）；q15 Ivy 不服輸繼續表演 | q09：The children gamely tried every strange dish at the party.<br>q14：Even after falling twice, the young dancer [gamely] got up and finished her show.<br>q15/s3：Ivy gamely carried on, telling her stories without it. | 主詞、情境 |
| refreshingly | The hotel staff were refreshingly honest about the noise. | 飯店員工對噪音坦白得難得 | q12 新咖啡館安靜得令人耳目一新；q15 評審覺得她的笑話耳目一新（find＋受詞） | q12：The new café is refreshingly quiet compared with the busy shops nearby.<br>q15/s4：Many other acts were provocative or even raunchy, so the judges found her clean, wickedly funny jokes refreshingly different. | 主詞、情境、句型 |
| headstrong | As a headstrong teenager, he ignored all advice. | 他十幾歲固執不聽建議（As a…） | q13 女兒冬天也不穿外套（填空）；q15 Ivy 固執不肯改表演；q17 弟弟固執不問路／貓只吃魚 | q13：My [headstrong] daughter refuses to wear a coat, even in the middle of winter.<br>q15/s1：She is headstrong, so when friends told her to change her act, she refused.<br>q17/ref0：My younger brother is too headstrong to ask anyone for directions.<br>q17/ref1：My headstrong cat refuses to eat anything except fish. | 主詞、情境、句型 |
| raunchy | Some of the song's lyrics are too raunchy for the radio. | 歌詞太露骨不能在電台播 | q15 其他參賽者的表演粗俗露骨 | q15/s4：Many other acts were provocative or even raunchy, so the judges found her clean, wickedly funny jokes refreshingly different. | 主詞、情境、句型 |
| torturous | Waiting for the exam results was torturous. | 等考試結果真折磨人 | q15 第一輪比賽很折磨人；q16 回家的那趟飛行又長又折磨人；q10 聽選音檔 漫長的攀爬 | q10（聽選音檔）：After the long, torturous climb, the view from the top made it all worthwhile.<br>q15/s2：The first round was torturous: the microphone kept cutting out, and the audience grew impatient.<br>q16/ref0：The flight home was long and torturous.<br>q16/ref1：The trip home by plane was long and torturous. | 主詞、情境、句型 |
| ruthlessness | The company is known for its ruthlessness toward competitors. | 公司對競爭對手毫不留情（known for） | q15 評審毫不留情刷掉一半表演者（with complete ruthlessness） | q15/s5：In the second round, they cut half of the performers with complete ruthlessness. | 主詞、情境、句型 |

#### c1-u39-l01

| 目標字 | 單字卡例句 | 單字卡情境 | 其他題情境（人工摘要） | 其他用到該字的題（現行檔原句） | 換了哪幾項 |
|---|---|---|---|---|---|
| unconvincing | The ending of the film felt rushed and unconvincing. | 電影結局倉促沒說服力 | q13 證人說法沒說服力警方追問（填空）；q15 Lucas 演技一開始沒說服力；q10 聽選音檔缺席會議的藉口 | q10（聽選音檔）：His excuse for missing the meeting was so unconvincing that nobody believed him.<br>q13：The witness's story was [unconvincing], so the police kept asking more questions.<br>q15/s5：At first his acting was unconvincing, because he kept laughing at his own jokes. | 主詞、情境、句型 |
| buffoon | He played the buffoon at parties to hide how shy he was. | 他在派對扮小丑掩飾害羞（play the buffoon） | q15 喜劇裡舉止像小丑的國王（behave like a buffoon） | q15/s3：She chose a comedy about a king who behaves like a buffoon, and even the most timid students joined. | 主詞、情境、句型 |
| daunt | Bad weather never daunts the town's fishermen. | 壞天氣嚇不倒漁夫 | q09 陡峭山路沒嚇倒年輕健行者；q14 別被專案規模嚇倒（let＋受詞＋daunt、填空）；q15 工作量沒嚇倒 Park 老師 | q09：The long, steep climb did not daunt the young walkers at all.<br>q14：Don't let the size of the project [daunt] you; we'll do it step by step.<br>q15/s1：Park took over the school drama club, the size of the task did not daunt her. | 主詞、情境 |
| tactful | It was tactful of you not to mention her new haircut. | 你沒提她新髮型很得體（It was…of you） | q12 得體的回應能讓生氣客人冷靜；q15 Park 老師很得體私下談 | q12：A tactful reply can calm down an angry customer.<br>q15/s7：Park was tactful: instead of criticizing him in front of others, she spoke to him after class. | 主詞、情境、句型 |
| provocatively | The article was provocatively titled "Why Homework Should End." | 文章下了挑釁的標題（被動） | q15 最後一幕挑釁地提出問題 | q15/s9：On opening night, the final scene, which asked provocatively whether a foolish king is worse than a cruel one, started long conversations among the parents. | 主詞、情境、句型 |
| neglectful | The owners were neglectful, and the garden turned into a jungle. | 屋主疏於照顧花園變叢林 | q15 前任老師疏於管理戲服破洞；q16 他太忙對家人疏忽（neglectful of） | q15/s2：The previous teacher had been neglectful, and the costumes were full of holes.<br>q16/ref0：He is so busy with work that he has been a little neglectful of his family.<br>q16/ref1：Because he is very busy at work, he is somewhat neglectful of his family. | 主詞、情境、句型 |
| conscientiously | She conscientiously checked every figure in the report. | 她認真檢查報告數字 | q11 兒子沒人看也認真工作；q15 Lucas 每天認真練台詞 | q11：My son works conscientiously, even when no one is watching.<br>q15/s8：From then on, he practiced his lines conscientiously every day. | 主詞、情境 |
| impish | She gave me an impish grin and ran off with my hat. | 她頑皮一笑拿走我的帽子 | q15 頑皮愛逗笑的 Lucas；q17 姪子策劃惡作劇時的頑皮笑容／小狗把襪子藏沙發下 | q15/s4：Lucas, an impish boy who loved to make others laugh, got the main role.<br>q17/ref0：My nephew gets an impish smile whenever he is planning a joke.<br>q17/ref1：Our impish puppy hides my socks under the sofa. | 主詞、情境、句型 |

#### c1-u39-l02

| 目標字 | 單字卡例句 | 單字卡情境 | 其他題情境（人工摘要） | 其他用到該字的題（現行檔原句） | 換了哪幾項 |
|---|---|---|---|---|---|
| tactfully | He tactfully changed the subject when money came up. | 談到錢他得體地轉移話題 | q11 經理得體冷靜回應生氣客人；q15 Nina 得體建議分段拍 | q11：The manager answered the angry customer tactfully and calmly.<br>q15/s1：Her lead actor, Max, suffered from claustrophobia, so she reassured him and tactfully suggested short takes with the doors opened between them. | 主詞、情境、句型 |
| insubordination | In the army, insubordination is taken very seriously. | 軍中抗命是很嚴重的事（泛論、被動） | q13 船員違抗船長命令因不服從受罰（punished for、填空）；q15 製片稱劇組人員的行為是不服從 | q13：The sailor was punished for [insubordination] after he refused the captain's orders.<br>q15/s3：The producer called it insubordination and sent him home. | 主詞、情境、句型 |
| naturalness | The garden was designed to keep the naturalness of the hills around it. | 花園設計保留周圍山丘的自然 | q15 影評稱讚演出自然；q17 影集演員的自然／她聲音的自然 | q15/s5：Critics later praised the naturalness of the acting, and the producer smiled benignly when Nina won an award for the film.<br>q17/ref0：I like the naturalness of the actors in this TV series.<br>q17/ref1：The naturalness of her voice makes the song special. | 主詞、情境、句型 |
| claustrophobia | Crowded trains can bring on claustrophobia in some passengers. | 擁擠火車可能引發乘客幽閉恐懼（泛論） | q15 男主角 Max 有幽閉恐懼症；q16 我有幽閉恐懼所以走樓梯 | q15/s1：Her lead actor, Max, suffered from claustrophobia, so she reassured him and tactfully suggested short takes with the doors opened between them.<br>q16/ref0：I have claustrophobia, so I always take the stairs.<br>q16/ref1：Because I suffer from claustrophobia, I always use the stairs. | 主詞、情境、句型 |
| scornfully | "Is that all you can do?" the coach asked scornfully. | 「你就只會這樣？」教練輕蔑地問 | q14 他把我的舊手機看成垃圾、再秀新手機（填空）；q15 劇組人員輕蔑嘲笑導演計畫 | q14：He looked [scornfully] at my old phone, as if it were rubbish, and then showed me his new one.<br>q15/s2：One crew member, however, refused to follow her schedule and laughed scornfully at her plan. | 主詞、情境、句型 |
| imp | Her youngest son is a real imp who hides everyone's keys. | 她小兒子是會藏鑰匙的小淘氣鬼 | q12 那個小淘氣鬼又吃光餅乾（感嘆）；q15 片中開朗的童星 | q12：That little imp has eaten all the cookies again!<br>q15/s4：The child actor in the film, a cheerful little imp, kept everyone's spirits up between takes. | 主詞、情境、句型 |
| unenviable | Being the only doctor on the island puts her in an unenviable position. | 島上唯一醫生處境艱難不令人羨慕 | q09 沒人想告訴老闆壞消息；q15 Nina 要在電梯裡拍整場戲 | q09：Nobody wanted the unenviable job of telling the boss the bad news.<br>q15/s0：The young director Nina had the unenviable job of shooting a whole scene inside a tiny elevator. | 主詞、情境、句型 |
| benignly | The afternoon sun shone benignly on the quiet village. | 午後陽光溫和照在村莊 | q15 Nina 得獎時製片和藹地笑；q10 聽選音檔櫃台和藹地笑 | q10（聽選音檔）：The receptionist smiled benignly and told us not to worry about our late arrival.<br>q15/s5：Critics later praised the naturalness of the acting, and the producer smiled benignly when Nina won an award for the film. | 主詞、情境、句型 |

#### c1-u39-l03

| 目標字 | 單字卡例句 | 單字卡情境 | 其他題情境（人工摘要） | 其他用到該字的題（現行檔原句） | 換了哪幾項 |
|---|---|---|---|---|---|
| placidly | The lake lay placidly under the morning mist. | 湖面在晨霧下平靜 | q12 老狗在門口平靜看街；q15 家長安靜坐在角落 | q12：The old dog watched the busy street placidly from the door.<br>q15/s6：The heat outside was remorseless, but the library stayed cool, and parents sat placidly in a corner. | 主詞、情境、句型 |
| exuberantly | She waved exuberantly from the top of the hill. | 她在山頂興高采烈揮手 | q14 遊行經過孩子興奮揮手（填空）；q15 孩子領獎時興奮歡呼 | q14：The kids waved [exuberantly] as the colorful parade passed by.<br>q15/s7：On the final day, the children cheered exuberantly when they received their prizes. | 主詞、情境 |
| uninspiring | The hotel breakfast was uninspiring: dry bread and weak coffee. | 飯店早餐很乏味（冒號列舉） | q13 球隊乏味表現讓球迷沒理由歡呼（填空）；q15 官員開幕致詞很乏味 | q13：The team's [uninspiring] performance gave the fans little reason to cheer.<br>q15/s1：Last year, the opening speech by a local official was uninspiring, and the children kept moving around in their seats. | 主詞、情境、句型 |
| animatedly | My grandfather speaks animatedly whenever football comes up. | 一聊足球爺爺就眉飛色舞 | q15 圖書館員眉飛色舞講怪獸海盜；q17 我和朋友熱烈聊演唱會／和姊姊聊假期；q10 聽選音檔兩個朋友晚餐聊旅行 | q10（聽選音檔）：The two friends talked animatedly about their trip all through dinner.<br>q15/s3：Tan, took the microphone and talked so animatedly about monsters and pirates that everyone woke up.<br>q17/ref0：My friends and I talked animatedly about the concert on the way home.<br>q17/ref1：I chatted animatedly with my sister about our holiday plans. | 主詞、情境、句型 |
| appallingly | The service at the restaurant was appallingly slow. | 餐廳服務慢得令人傻眼（修飾形容詞） | q09 老公車在山路表現糟透（修飾動詞）；q15 老冷氣表現糟透 | q09：The old bus performed appallingly on the steep mountain road.<br>q15/s8：Only the old cooling system performed appallingly, breaking down twice. | 主詞、情境、句型 |
| remorseless | The main bad character in the film is cold and remorseless. | 電影大反派冷酷無悔意（無情義） | q15 外面熱得毫不留情（毫不停歇義） | q15/s6：The heat outside was remorseless, but the library stayed cool, and parents sat placidly in a corner. | 主詞、情境、句型 |
| exhibitionist | Only an exhibitionist would sing that loudly on a crowded train. | 只有愛出風頭的人會在火車上大聲唱（Only…would） | q15 男孩堅持對全場朗讀；q16 他總想成為注意的焦點（He is an exhibitionist who） | q15/s5：One boy, a bit of an exhibitionist, insisted on reading aloud to the whole room.<br>q16/ref0：He is an exhibitionist who always wants to be the center of attention.<br>q16/ref1：He is such an exhibitionist; he always wants everyone to look at him. | 主詞、情境、句型 |
| voraciously | The baby birds ate voraciously as soon as their mother returned. | 雛鳥狼吞虎嚥地吃（吃義） | q11 我十幾歲如飢似渴讀科幻；q15 孩子如飢似渴讀書（讀義） | q11：As a teenager, I read voraciously, especially science fiction.<br>q15/s4：Over the next six weeks, even children who were not avid readers read voraciously, some finishing a book a day. | 主詞、情境、句型 |

#### c1-u39-l04

| 目標字 | 單字卡例句 | 單字卡情境 | 其他題情境（人工摘要） | 其他用到該字的題（現行檔原句） | 換了哪幾項 |
|---|---|---|---|---|---|
| baldly | The report baldly states that the project has failed. | 報告直截了當寫明專案失敗 | q15 Owen 在信中直截了當說票價離譜 | q15/s4：In it, he stated baldly that the ticket prices were ludicrously high for such poor football. | 主詞、情境、句型 |
| fiendish | The final exam had some fiendish questions. | 期末考有幾題難得要命 | q14 謎題難到三人解三小時（填空）；q15 極度緊湊的賽程 | q14：The puzzle was [fiendish]: it took the three of us over three hours to solve.<br>q15/s5：The last match of the season was against the league leaders, and a fiendish schedule meant the players had only two days to rest. | 主詞、情境、句型 |
| dismally | Our first attempt to bake bread failed dismally. | 第一次烤麵包慘敗（failed dismally） | q11 小店第一年生意慘淡；q15 球隊表現慘淡連輸八場 | q11：Our small shop did dismally in its first year.<br>q15/s1：Last season, however, the team played dismally and lost eight games in a row. | 主詞、情境、句型 |
| ludicrously | The plot of the film is ludicrously complicated. | 電影情節複雜得荒謬 | q13 新手機貴得離譜比房租還貴（填空）；q15 票價高得離譜；q10 聽選音檔外套貴得離譜 | q10（聽選音檔）：The new jacket was ludicrously expensive, so I bought a cheaper one online.<br>q13：The new phone is [ludicrously] expensive; it costs more than my monthly rent.<br>q15/s4：In it, he stated baldly that the ticket prices were ludicrously high for such poor football. | 主詞、情境、句型 |
| fanatically | She cleans her kitchen fanatically every evening. | 她每晚狂熱地打掃廚房 | q12 麵包師傅狂熱遵照奶奶食譜；q15 Owen 狂熱支持球隊 | q12：The baker followed his grandmother's recipe almost fanatically.<br>q15/s0：My brother Owen supports our local football team fanatically. | 主詞、情境 |
| negligently | The driver acted negligently by using his phone while driving. | 駕駛邊開車邊用手機（acted negligently by） | q15 後衛防守疏忽；q16 員工疏忽弄丟文件 | q15/s2：The coach blamed the defenders, who had marked their opponents negligently.<br>q16/ref0：The employee negligently lost some important documents.<br>q16/ref1：Acting negligently, the worker lost the important files. | 主詞、情境、句型 |
| temperamentally | The two sisters are temperamentally very different. | 兩姊妹性情不同 | q09 他的個性適合圖書館工作（suited to）；q15 Owen 天性沒辦法保持沉默（unable to） | q09：He is temperamentally suited to a quiet job in a library.<br>q15/s3：Owen, who is temperamentally unable to stay quiet, wrote a letter to the club. | 主詞、情境、句型 |
| ecstatically | The crowd cheered ecstatically when the band came on stage. | 樂團上台觀眾狂喜歡呼 | q15 Owen 在客廳狂喜亂跑；q17 我考過時狂喜跳起／機場狂喜擁抱好友 | q15/s7：Owen ran around the living room ecstatically and spontaneously hugged our grandmother.<br>q17/ref0：I jumped ecstatically when I heard that I had passed the exam.<br>q17/ref1：I hugged my best friend ecstatically at the airport after two years apart. | 主詞、情境、句型 |

#### c1-u39-l05

| 目標字 | 單字卡例句 | 單字卡情境 | 其他題情境（人工摘要） | 其他用到該字的題（現行檔原句） | 換了哪幾項 |
|---|---|---|---|---|---|
| fiendishly | The new board game is fiendishly clever. | 新桌遊巧妙極了（fiendishly clever） | q15 每週測驗難得要命（fiendishly hard） | q15/s2：The weekly tests were fiendishly hard, and the deadlines came remorselessly, one after another. | 主詞、情境 |
| tediously | He explained the rules tediously, one by one, for an hour. | 他花一小時冗長地逐條講規則 | q09 會議冗長開了三小時；q15 前幾堂課冗長乏味（修飾形容詞） | q09：The meeting went on tediously for three hours without any decision.<br>q15/s1：The first lectures were tediously long, and the professor spoke impersonally, as if he were reading from a script. | 主詞、情境、句型 |
| detestable | Lying to a close friend is a detestable act. | 對好友說謊很可惡（a detestable act） | q14 霸凌是可憎的學校不容許（填空）；q15 學生的無禮留言比測驗可惡（比較級） | q14：Bullying is [detestable], and our school will not accept it.<br>q15/s7：In my view, the rude comments that some students posted on the course website were far more detestable than any test. | 主詞、情境、句型 |
| sedately | The old boat moved sedately down the river. | 老船從容順河而下 | q12 賓客從容坐在長桌旁等致詞；q15 講師從容講每個主題；q17 我週日從容繞公園散步／從容吃早餐 | q12：The guests sat sedately at the long table, waiting for the speeches.<br>q15/s4：Her insightful stories about life in ancient cities were engrossing, and she moved sedately through each topic, never rushing.<br>q17/ref0：On Sundays, I walk sedately around the park with my coffee.<br>q17/ref1：I like to eat breakfast sedately before a busy day. | 主詞、情境、句型 |
| engrossing | It was such an engrossing book that I forgot to sleep. | 書太好看忘了睡（such…that） | q11 紀錄片吸引人沒人提早離開（so…that）；q15 古代城市故事引人入勝 | q11：The documentary was so engrossing that nobody left early.<br>q15/s4：Her insightful stories about life in ancient cities were engrossing, and she moved sedately through each topic, never rushing. | 主詞、情境 |
| impersonally | The letter was written impersonally, without even using my name. | 信寫得冷冰冰連名字都沒用（被動） | q15 教授說話冷冰冰像照稿唸；q10 聽選音檔客服冷冰冰唸規定 | q10（聽選音檔）：The customer service agent answered impersonally, reading the same rules again and again.<br>q15/s1：The first lectures were tediously long, and the professor spoke impersonally, as if he were reading from a script. | 主詞、情境、句型 |
| unconvincingly | He smiled unconvincingly and said he was fine. | 他勉強笑說自己沒事 | q15 同學說課太難但沒說服力；q16 他解釋遲到原因沒說服力 | q15/s5：One student argued, rather unconvincingly, that the course was still too difficult.<br>q16/ref0：He explained, rather unconvincingly, why he was late.<br>q16/ref1：He explained why he was late, but he did it unconvincingly. | 主詞、情境、句型 |
| remorselessly | The sun beat down remorselessly on the dry fields. | 太陽毫不留情曬乾田 | q13 問題一個接一個毫不停歇（填空）；q15 截止日期一個接一個 | q13：The questions came [remorselessly], one after another, until he gave up.<br>q15/s2：The weekly tests were fiendishly hard, and the deadlines came remorselessly, one after another. | 主詞、情境、句型 |

#### c1-u39-l06

| 目標字 | 單字卡例句 | 單字卡情境 | 其他題情境（人工摘要） | 其他用到該字的題（現行檔原句） | 換了哪幾項 |
|---|---|---|---|---|---|
| sentimentally | He sentimentally kept every letter his wife had ever written to him. | 他念舊地保留妻子的每封信 | q09 他感傷談起長大的小鎮；q15 Felix 晚年感傷談學生時光 | q09：He spoke sentimentally about the town where he grew up.<br>q15/s4：Late in life, he talked sentimentally about those student years. | 主詞、情境、句型 |
| monotonously | The rain fell monotonously on the roof all afternoon. | 雨整個下午單調地落在屋頂 | q11 他像機器人單調重複同一句；q15 一成不變的創作（被動）；q10 聽選音檔 平坦的沙漠公路單調綿延數小時 | q10（聽選音檔）：The flat desert road stretched on monotonously for hours.<br>q11：He repeated the same sentence monotonously, like a robot.<br>q15/s3：He hated art that was done monotonously, like painting the same bowl of fruit every day. | 主詞、情境、句型 |
| insubordinate | The insubordinate player was left out of the next match. | 不服從的球員被排除出賽 | q14 不服從的學生一直跟老師頂嘴（填空）；q15 Felix 被認為不服從（be considered） | q14：The [insubordinate] pupil kept talking back to the teacher, so he was sent to the head teacher's office.<br>q15/s2：As a young art student, he was considered insubordinate because he refused to copy the paintings of the old masters, and his teachers did not value his individuality. | 主詞、情境、句型 |
| impishly | The boy grinned impishly and hid behind the door. | 男孩頑皮咧嘴笑躲門後 | q15 九十歲 Felix 頑皮地笑著說要畫新系列；q17 姪女把眼鏡藏冰箱／小貓把杯子推下桌 | q15/s6：On his ninetieth birthday, he smiled impishly and announced that he was starting a new series.<br>q17/ref0：My niece impishly hid my glasses in the fridge.<br>q17/ref1：The kitten looked at me impishly before it pushed my cup off the table. | 主詞、情境、句型 |
| prolifically | This author writes prolifically, finishing three novels a year. | 作家一年寫三本小說 | q12 莫札特從小大量作曲；q15 Felix 畫了兩千多幅 | q12：Mozart composed music prolifically from a very young age.<br>q15/s0：My great-uncle Felix was a painter who worked prolifically, producing over two thousand paintings. | 主詞、情境、句型 |
| hypocritically | The company hypocritically talks about nature while polluting the river. | 公司污染河川還大談自然 | q15 有人說 Felix 批評收藏家很虛偽；q16 她批評別人亂花錢自己卻天天叫外送 | q15/s5：He sometimes criticized rich collectors, though some said he did so hypocritically, since he had sold them many paintings himself.<br>q16/ref0：She hypocritically criticizes others for wasting money, yet she orders food delivery every day.<br>q16/ref1：She hypocritically blames other people for wasting money, but she has food delivered every day. | 主詞、情境、句型 |
| eccentrically | Our neighbor decorates his house eccentrically, with old bicycles on the roof. | 鄰居把舊腳踏車擺屋頂 | q13 他戴紫帽穿綠靴（填空）；q15 Felix 常穿不同的兩隻鞋 | q13：He dressed [eccentrically], with a purple hat and bright green boots.<br>q15/s1：He also dressed eccentrically, often wearing two different shoes. | 主詞、情境、句型 |
| victoriously | The team returned victoriously from the final. | 球隊從決賽凱旋 | q15 Felix 得意走過擠滿人的展覽廳 | q15/s7：When it opened, he walked victoriously through the crowded hall. | 主詞、情境、句型 |

#### c1-u39-l07

| 目標字 | 單字卡例句 | 單字卡情境 | 其他題情境（人工摘要） | 其他用到該字的題（現行檔原句） | 換了哪幾項 |
|---|---|---|---|---|---|
| docilely | The children sat docilely while the photographer set up his camera. | 攝影師架相機時孩子乖乖坐著 | q12 小狗乖乖跟主人穿過市場（填空）；q14 嚮導的狗乖乖跟在後面 | q12：The puppy followed its owner [docilely] through the crowded market.<br>q14/s2：By the second morning, we were moving lethargically, and even our guide's dog followed docilely behind us instead of running ahead. | 主詞、情境、句型 |
| gruesomely | The film's final scene was gruesomely realistic. | 電影最後一幕逼真得駭人（修飾 realistic） | q14 嚮導講細節駭人的鬼故事（修飾 detailed） | q14/s5：Around the fire, our guide told gruesomely detailed ghost stories to keep us awake. | 主詞、情境 |
| inexcusably | The hotel room was inexcusably dirty for the price. | 以價格來說飯店房間髒得說不過去 | q14 隊員竟忘了帶帳篷支架；q15 他遲到得離譜還不道歉 | q14/s4：One member had inexcusably forgotten to pack the poles for the tents, so we slept under a plastic sheet.<br>q15/ref0：He arrived inexcusably late and didn't even say sorry.<br>q15/ref1：He was inexcusably late, and he did not even apologize. | 主詞、情境、句型 |
| lethargically | The lion lay lethargically in the shade all afternoon. | 獅子整個下午懶洋洋躺在樹蔭 | q08 長長的隊伍慢吞吞移向售票處；q14 第二天早上大家有氣無力地走；q09 聽選音檔 學生懶洋洋聽課 | q08：The long line moved lethargically toward the ticket office.<br>q09（聽選音檔）：The students listened lethargically to the last lecture of the day.<br>q14/s2：By the second morning, we were moving lethargically, and even our guide's dog followed docilely behind us instead of running ahead. | 主詞、情境、句型 |
| naivety | His naivety about money made him easy to fool. | 他對金錢天真容易被騙（主詞） | q13 我太天真相信業務員（In my naivety、填空）；q14 我天真以為像在公園散步 | q13：In my [naivety], I believed everything the salesman told me.<br>q14/s1：In my naivety, I thought it would be like a long walk in the park. | 主詞、情境、句型 |
| gruelling | Nurses often work gruelling twelve-hour shifts. | 護理師常輪十二小時累人的班 | q10 那次考驗很累人但學到很多；q14 三天健行很累人；q16 一整天考試／夏天搬家很累 | q10：The test was gruelling, but I learned a lot from it.<br>q14/s0：Last autumn, I joined a gruelling three-day hike across the mountains to raise money for a children's hospital.<br>q16/ref0：I had a gruelling day of exams and went to bed at eight.<br>q16/ref1：Moving house in the summer heat was gruelling for me. | 主詞、情境、句型 |
| beguilingly | The small café is beguilingly simple, with just five tables. | 小咖啡館簡單得迷人 | q11 她迷人地笑著請求再一次機會；q14 地圖上看起來簡單得誘人的步道 | q11：She smiled beguilingly and asked for one more chance.<br>q14/s3：The trail, which had looked beguilingly easy on the map, rose sharply for hours and tested our toughness. | 主詞、情境、句型 |

#### c1-u39-l08

| 目標字 | 單字卡例句 | 單字卡情境 | 其他題情境（人工摘要） | 其他用到該字的題（現行檔原句） | 換了哪幾項 |
|---|---|---|---|---|---|
| compliantly | The dog sat compliantly as soon as it was told to. | 狗一被叫就乖乖坐下 | q08 工人順從遵守新安全規定；q14 客人照 Lin 的要求簽表格 | q08：The workers followed the new safety rules compliantly.<br>q14/s5：She fixed the key, offered a free breakfast and asked the guest to sign a short form, which he did compliantly. | 主詞、情境、句型 |
| exhilarate | Fast rides exhilarate some people and frighten others. | 刺激遊樂設施讓有些人興奮有些人害怕 | q10 山頂看日出讓大家興奮（動名詞主詞）；q14 一個接一個解決問題讓 Lin 興奮；q16 騎車下長坡／冷海游泳讓我興奮 | q10：Watching the sunrise from the mountain top exhilarated all of us.<br>q14/s7：Still, the challenge of solving one problem after another exhilarated Lin.<br>q16/ref0：Riding my bike down a long hill always exhilarates me.<br>q16/ref1：Swimming in the cold sea in the morning exhilarates me. | 主詞、情境 |
| insecurely | The ladder stood insecurely on the wet floor. | 梯子不穩立在濕地板 | q12 畫掛得不牢當晚砸地（被動、填空）；q14 沒釘牢的告示牌掉下；q09 聽選音檔架子沒裝牢 | q09（聽選音檔）：The shelf had been fixed insecurely, and it fell as soon as I put my books on it.<br>q12：The picture was hung [insecurely], and it crashed to the floor that night.<br>q14/s6：Later, a sign that had been fixed insecurely to the wall fell down in the lobby, and at the bar a singer was dressed rather raunchily, and a few older guests complained to Lin. | 主詞、情境、句型 |
| insensitively | The article insensitively joked about people who had lost their jobs. | 文章拿失業者開玩笑 | q11 請別不體貼地談別人的難處（祈使）；q14 年輕同事不體貼地回答客人 | q11：Please don't speak insensitively about other people's problems.<br>q14/s2：A young colleague answered insensitively, saying it was probably the guest's own fault, which made things worse. | 主詞、情境、句型 |
| insubordinately | The trainee chef behaved insubordinately toward the head chef and was moved to washing dishes. | 實習廚師對主廚不服從被調去洗碗 | q13 志工不服從主辦人提早開門（填空）；q14 同事被叫道歉時頂回去走開 | q13：The volunteer [insubordinately] ignored the organizer's instructions and opened the gates an hour early.<br>q14/s3：When the manager told him to apologize, he responded insubordinately and walked away. | 主詞、情境 |
| irately | He shook his head irately when the shop refused his card. | 店家拒收卡他氣憤搖頭 | q14 客人氣沖沖抱怨房卡；q15 客人氣沖沖把湯推回給服務生 | q14/s1：Last Friday, a guest complained irately that his room key did not work.<br>q15/ref0：The customer irately pushed the soup back to the waiter.<br>q15/ref1：The guest pushed the soup back to the waiter irately. | 主詞、情境、句型 |
| raunchily | Some of the dancers moved rather raunchily for a family TV show. | 有些舞者在闔家電視節目上動作太露骨 | q14 酒吧駐唱歌手穿得有點露骨，年長客人向 Lin 抱怨（被動 was dressed） | q14/s6：Later, a sign that had been fixed insecurely to the wall fell down in the lobby, and at the bar a singer was dressed rather raunchily, and a few older guests complained to Lin. | 主詞、情境、句型 |

#### c1-u39-l09

| 目標字 | 單字卡例句 | 單字卡情境 | 其他題情境（人工摘要） | 其他用到該字的題（現行檔原句） | 換了哪幾項 |
|---|---|---|---|---|---|
| remorsefully | Years later, she spoke remorsefully about the friends she had lost touch with. | 多年後她懊悔談起失聯的朋友 | q14 曾取笑她的同學懊悔道歉；q15 她懊悔承認弄壞同事筆電；q09 聽選音檔 他看著破花瓶向奶奶懊悔道歉 | q09（聽選音檔）：He looked at the broken vase and apologized remorsefully to his grandmother.<br>q14/s8：On the night, a classmate who had once teased her came up after the show and apologized remorsefully.<br>q15/ref0：She remorsefully admitted that she had broken her colleague's laptop.<br>q15/ref1：She admitted remorsefully that she was the one who broke her colleague's laptop. | 主詞、情境、句型 |
| self-conscious | He was self-conscious about his new glasses at first. | 他起初在意自己的新眼鏡（about＋事物） | q10 我在別人面前唱歌難為情（when 子句）；q14 Ella 在意自己的口音；q16 別人看我吃東西／有人拍我照片 | q10：I feel self-conscious when I sing in front of other people.<br>q14/s1：She was self-conscious about her accent and felt insecure, worried that others would laugh.<br>q16/ref0：I feel self-conscious when people watch me eat.<br>q16/ref1：I get self-conscious whenever someone takes a photo of me. | 主詞、情境、句型 |
| self-worth | Losing the job hurt his sense of self-worth. | 失業打擊他的自我價值感（中性事實） | q11 教練努力幫球員建立自我價值感；q14 Ella 的自我價值感增加 | q11：The coach worked hard to build up the players' self-worth.<br>q14/s6：Slowly, her sense of self-worth grew. | 主詞、情境、句型 |
| stressfully | We spent the last day of the trip stressfully searching for our passports. | 旅程最後一天壓力重重找護照 | q14 練習的幾週過得壓力重重 | q14/s7：Before the spring concert, she was given the unenviably difficult job of singing the first solo, and the weeks of practice passed stressfully. | 主詞、情境、句型 |
| unenviably | The new manager was placed in an unenviably tough position. | 新經理處境艱難到令人同情 | q14 Ella 被分配到難得不令人羨慕的第一段獨唱 | q14/s7：Before the spring concert, she was given the unenviably difficult job of singing the first solo, and the weeks of practice passed stressfully. | 主詞、情境 |
| unwaveringly | She has remained unwaveringly loyal to her old friends. | 她對老朋友始終忠誠（修飾形容詞） | q08 球迷十季輸球仍堅定支持；q12 她堅定相信兒子（填空）；q14 Kato 老師堅定支持 Ella（修飾動詞） | q08：The fans supported their team unwaveringly through ten losing seasons.<br>q12：She [unwaveringly] believed in her son, even when others doubted him.<br>q14/s5：Kato supported her unwaveringly, telling her that her voice mattered. | 主詞、情境、句型 |
| withdrawn | The usually lively boy seemed withdrawn all week. | 平常活潑的男孩整週顯得退縮 | q13 害羞孤僻的新員工獨自在座位吃午餐（句首形容詞、填空）；q14 Ella 轉學後變得退縮 | q13：Shy and [withdrawn], the new employee ate lunch alone at her desk every day.<br>q14/s0：When Ella moved to a new school at fourteen, she became withdrawn and rarely spoke in class. | 主詞、情境、句型 |
