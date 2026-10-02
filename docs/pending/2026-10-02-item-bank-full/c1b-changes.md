# C1 後段（c1-u36～u39，31 課）第②③關修正對照表

> 依 `t9/c1bb-rulings.md`（2026-10-03）。先寫入第②關判題（31 課，judgedBy claude-reviewer），再依裁示逐條修改。判題時以選項文字核對現行索引，盲答 155 個題位與正解全部一致、0 多解。
> 每處修改都記在該課的 `judge.resolvedAfterFinalReview`：message 以「執行長第②③關裁示修正：」開頭，resolution 記改後與原文。共 220 筆（含最終複審 12 筆，message 以「執行長最終複審修正：」開頭）。
> 修正後的結果：
> - `check-items --require-judge`：本批 31 課全綠。
> - 全量 `check-items`：330 課全綠。
> - `npm test`：全過。
> - 聽選與閱讀的長度名次：仍符合題 id 雜湊指定，0.5～2 倍 0 例外。
> - 干擾項自查（詞形還原，含 -ly、-ness 同詞族）：同課共用 0；拿另一題正解當干擾項 0。
> - 跨課重複：跨 worktree 與 C1 前段 73 課一起比，非本單元字在兩課以上當干擾項 0 組。
> - 所有選擇題的正解索引都沒有變。

## 統計

**第②關 50 條全修**
- 「疑似一眼排除」（混合詞性題的異詞性干擾項）22 條：全部換成同詞性、代入英文句子後明顯不通的字。31 課的 mcq 現在都是四選項同詞性。
- 其餘 28 條照建議或用等效改法修，包括：中譯 5 條、評分要點 6 條、例句不自然 4 條（tautly、dominantly、gruesomely、unscathing 加註）、閱讀情境 3 條（negligent、compliantly、raunchily）、釋義 3 條（aqua→水藍色、unenviable、fiendish 補「狡詐的」）、干擾項格式 2 條（bubbly、wickedly）。

**第③關 FIX 27 條全修**
- 2-A 雷同 6 條：照審查建議改。
- 2-B 跨課重複 4 條：isolated→stray、structurally→accurately、subtly→loosely、remotely→politely。remotely 不照建議換 evenly，因為「grew evenly」只看英文時說得通。
- 2-C 中譯 2 條、2-D 過嚴 2 條、2-E 評分要點 13 條：照建議改，其中幾條為了 80 字元上限把文字縮短。

**疑似**
- 3-A 第 1～10 條：全部照建議改。第 9、10 條屬於「聽選音檔算情境句」。
- 3-B：wickedly 補「邪惡地」；fiend、fiendish、fiendishly 照裁示通過。
- 3-C 第 12～15 條：照建議改。第 13 條改成「回家的那趟飛行」。
- 3-C 第 16 條（防蚊液）：照裁示通過、不改。
- 3-C 第 17 條（追加裁示）：新規則「同一單元內，不同課不可重複同一情境（看整句事件類型）」。本批修了①、②。
  - ① 午餐後提不起勁：u38-l08 q09 保留；u38-l09 q12 改成「星期天倦怠得賴床到中午」，避開 u38-l04 的球隊、u38-l10 的長途飛行；u39-l07 q08 改成「隊伍慢吞吞移向售票處」。
  - ② 員工無視經理指示：u39-l02 q02 卡保留（q13 前一輪已改成船員與船長）；u39-l06 q14 改成學生跟老師頂嘴；u39-l08 q13 改成志工不服從主辦人。
  - 同一原則自查：u39-l08 卡（球員頂撞教練）和 u39-l06 卡（不服從的球員被排除出賽）同為球員違抗教練，所以 u39-l08 卡改成演員與導演。
  - u39-l08 閱讀的「同事被經理叫去道歉、不服從地走開」和 u39-l02 卡同為員工違抗經理：最終複審時改 u39-l02 卡（見下節第 5 條）。
- 3-C 第 18 條：不擋，今後撰寫時注意。
- 3-D：照建議改了 u39-l09 中譯、u37-l04 閱讀選項、u38-l08 聽選（去掉遺產意味）。

**只看英文自查 11 題**：全部修，干擾項換掉或在英文句子裡補線索（例如 u39-l02-q14 加 as if it were rubbish）。

**聽選音檔算情境句**：除了 3-A 第 9、10 條，另外逐課比對 31 課聽選音檔與單字卡例句，再改 2 題：u37-l03 unassisted 從小孩拼圖改成機器人，u39-l06 monotonously 從鐘聲改成導覽員說話。情境對照表已把聽選音檔列為情境句。

## 最終複審修正（t9/c1bb-final.md，FIX 6 條全修）

1. u39-l09-q16 評分要點：先前誤貼 q15 的 remorsefully 要點，已改回 self-conscious 要點。judge 紀錄與本檔下方紀錄一併更正。
2. u37-l05-q12 選項 dominantly 的釋義同步為「支配性地」。
3. u39-l08 閱讀：raunchily 句改成「酒吧駐唱歌手穿得有點露骨，幾位年長客人向 Lin 抱怨」，避免與卡片同為表演露骨。兩個小題的選項不受影響。
4. u39-l08 insubordinately 卡：改成實習廚師違抗主廚，避免與 u39-l02 閱讀同為片場違抗導演。
5. u39-l02 insubordination 卡：改成「在軍中，抗命是非常嚴重的事」，清掉單元內「員工違抗經理」的同類事件。
6. u39-l06-q10 聽選：改成「平坦的沙漠公路單調綿延數小時」，避開單元內「講者無聊、聽者提不起精神」的同類事件。正解仍在位置 1、仍是最短。

這輪改到選項、題幹、音檔或短文的選擇題：u39-l06-q10、u39-l08-q14。兩題已在下方清單內。

重新盲答後的追加修正：u39-l06-q10 的正解是殘句「Flat and the same for hours.」，其他三個選項都是完整句，格式不一致會變成猜題線索，改成「It was flat and the same for hours.」。聽選題沒有選項釋義欄位，不用同步。改完後正解 35 字元，干擾項「It was closed for repairs all day.」34 字元，正解從最短變成第 3 長；這題的指定名次也跟著改成第 3 長。改後全批聽選的長度名次是 32／26／26／16%，仍在 13–37% 內。

## 改到選項、題幹、音檔或短文的選擇題（以 ca79846 為基準）

共 48 題（前綴 c1- 省略），建議全部用「只看英文」的盲答重審：

u36-l01-q13、u36-l03-q13、u36-l03-q15、u36-l04-q13、u36-l06-q13、u37-l01-q13、u37-l02-q13、u37-l02-q14、u37-l03-q10、u37-l03-q14、u37-l04-q13、u37-l04-q14、u37-l05-q12、u37-l05-q13、u37-l05-q14、u37-l06-q13、u38-l01-q10、u38-l01-q14、u38-l01-q15、u38-l02-q13、u38-l02-q14、u38-l03-q14、u38-l04-q13、u38-l04-q14、u38-l05-q14、u38-l06-q13、u38-l06-q14、u38-l07-q14、u38-l08-q10、u38-l08-q13、u38-l08-q14、u38-l09-q14、u38-l10-q14、u39-l01-q13、u39-l01-q14、u39-l02-q13、u39-l02-q14、u39-l03-q13、u39-l03-q14、u39-l04-q14、u39-l05-q13、u39-l05-q14、u39-l06-q10、u39-l06-q14、u39-l07-q13、u39-l08-q13、u39-l08-q14、u39-l09-q13

## 不改項目與理由

| 項目 | 理由 |
|---|---|
| 3-C 第 16 條 防蚊液（u37-l04-q15） | 執行長裁示通過 |
| 3-B fiend、fiendish、fiendishly 教法 | 執行長裁示通過 |
| 3-C 第 17 條 ③～⑦ | 執行長裁示不改 |
| 3-C 第 18 條 同課多題情境相近 | 執行長裁示不擋，今後撰寫時注意 |
| 3-D c1-u36-l06-q13 suds 一眼排除 | 已併入第②關同條處理（換成 annually），不另列 |

## 全部修改紀錄（由 judge.resolvedAfterFinalReview 產生）

| 題 id | 位置 | 說明 | 改後（原） |
|---|---|---|---|
| c1-u36-l01-q13 | `items/12/options` | 只看英文自查：干擾項放進英文句子也說得通（numbed his jaw 文法通） | 改為 ["polished","salvaged","eluded","clenched"]（原 ["numbed","salvaged","eluded","clenched"]） |
| c1-u36-l01-q13 | `items/12/optionGlossZh` | 選項釋義同步 | 改為 ["擦亮","搶救","躲避","咬緊"]（原 ["使麻木","搶救","躲避","咬緊"]） |
| c1-u36-l03-q17 | `items/16/referenceEn` | 第③關 2-A：參考答案 2 與單字卡雷同（鳥群／鴿子聚在水邊） | 改為 ["Students often congregate around the coffee machine before class.","On weekend mornings, I see runners congregate at the park gate before a race."]（原 ["Students often congregate around the coffee machine before class.","On hot days, I see pigeons congregate near the fountain in my town."]） |
| c1-u36-l03-q13 | `items/12/options` | 第③關 2-B：非本單元字跨課重複當干擾項（與 C1 前段合併比對） | 改為 ["exterior","cluttered","stray","adjoining"]（原 ["exterior","cluttered","isolated","adjoining"]） |
| c1-u36-l03-q13 | `items/12/optionGlossZh` | 選項釋義同步 | 改為 ["外部的","雜亂的","流浪的","相鄰的"]（原 ["外部的","雜亂的","孤立的","相鄰的"]） |
| c1-u36-l03-q15 | `items/14/passageEn` | 第③關 3-A#1：閱讀句與 gush 卡同主詞（水）同句型 | 改為 My grandfather spends most weekends tinkering with old radios in his garage. The place is full of clutter: boxes of wires, battered tools and newspapers he refuses to discard. Last winter, a mouse moved in and started to gnaw through the wires. Grandpa tried a spray that was supposed to repel mice, but it did not work. In the end, our cat solved the problem. She hid behind a box for an hour and then pounced. A week later, a pipe burst and sent water gushing across the floor. Neighbors congregated in the adjoining yard to watch Grandpa and my father carry everything outside.（原 My grandfather spends most weekends tinkering with old radios in his garage. The place is full of clutter: boxes of wires, battered tools and newspapers he refuses to discard. Last winter, a mouse moved in and started to gnaw through the wires. Grandpa tried a spray that was supposed to repel mice, but it did not work. In the end, our cat solved the problem. She hid behind a box for an hour and then pounced. A week later, a pipe burst and water gushed across the floor. Neighbors congregated in the adjoining yard to watch Grandpa and my father carry everything outside.） |
| c1-u36-l04-q13 | `items/12/options` | 只看英文自查：干擾項放進英文句子也說得通（rumble 也是聲音名詞） | 改為 ["sprawl","tangle","rustle","clutter"]（原 ["sprawl","rumble","rustle","clutter"]） |
| c1-u36-l04-q13 | `items/12/optionGlossZh` | 選項釋義同步 | 改為 ["蔓延","糾結的一團","沙沙聲","雜亂的東西"]（原 ["蔓延","隆隆聲","沙沙聲","雜亂的東西"]） |
| c1-u36-l04-q10 | `items/9/sentenceEn` | 第③關 3-A#2：跟讀與 transfix 卡情境、句型相近 | 改為 The bright lights of the car transfixed the deer in the road.（原 The children stood transfixed in front of the giant screen.） |
| c1-u36-l04-q10 | `items/9/sentenceZh` | 中譯同步 | 改為 車子刺眼的燈光讓路中間的鹿呆住不動。（原 孩子們站在巨大的螢幕前，看得目不轉睛。） |
| c1-u36-l05-q14 | `items/13/passageZh` | 第②關：visitors 譯成「路人」不準確 | 改為 林小姐經營一間小小的石雕工作室，就緊鄰著她家。因為雕刻會讓空氣充滿細小的粉塵，她總是開著兩台大電扇讓室內通風。上個月，一家飯店請她為大門入口雕一頭獅子。她猶豫了好幾個星期，擔心這份工作對一個人來說太大，但最後還是答應了。這項工作需要非常精確，來訪的人常隔著窗戶，目瞪口呆地看著那頭還沒完成的獅子。當地一家電台把她列入每週的藝文綜合報導後，來看的人更多了。她唯一的抱怨，是每天早上都得把一團亂的電線解開。（原 林小姐經營一間小小的石雕工作室，就緊鄰著她家。因為雕刻會讓空氣充滿細小的粉塵，她總是開著兩台大電扇讓室內通風。上個月，一家飯店請她為大門入口雕一頭獅子。她猶豫了好幾個星期，擔心這份工作對一個人來說太大，但最後還是答應了。這項工作需要非常精確，路人常隔著窗戶，目瞪口呆地看著那頭還沒完成的獅子。當地一家電台把她列入每週的藝文綜合報導後，來看的人更多了。她唯一的抱怨，是每天早上都得把一團亂的電線解開。） |
| c1-u36-l05-q15 | `items/14/rubricZh/0` | 第③關 2-E：評分要點「可寫」未用「例如」 | 改為 「雕出」用 chisel，例如 chisel this statue out of marble、chisel…from a piece of marble 等（原 「雕出」用 chisel，可寫 chisel＋作品＋out of／from＋材料） |
| c1-u36-l06-q13 | `items/12/options` | 第③關 2-B：非本單元字跨課重複當干擾項（與 C1 前段合併比對） | 改為 ["gushingly","marginally","accurately","suds"]（原 ["gushingly","marginally","structurally","suds"]） |
| c1-u36-l06-q13 | `items/12/optionGlossZh` | 選項釋義同步 | 改為 ["過分熱情地","些微地","準確地","肥皂泡沫"]（原 ["過分熱情地","些微地","結構上","肥皂泡沫"]） |
| c1-u36-l06-q13 | `items/12/options` | 第②關：疑似一眼排除（干擾項詞性與其他選項不同） | 改為 ["gushingly","marginally","accurately","annually"]（原 ["gushingly","marginally","accurately","suds"]） |
| c1-u36-l06-q13 | `items/12/optionGlossZh` | 選項釋義同步 | 改為 ["過分熱情地","些微地","準確地","每年地"]（原 ["過分熱情地","些微地","準確地","肥皂泡沫"]） |
| c1-u36-l06-q16 | `items/15/rubricZh/0` | 第②關：評分要點過嚴（只收名詞前用法） | 改為 gushing 可放名詞前（例如 gushing water），也可用進行式等（例如 water was gushing from…）（原 gushing 是形容詞，放在名詞前（例如 gushing water、a gushing river）） |
| c1-u37-l01-q13 | `items/12/options` | 第③關 2-B：非本單元字跨課重複當干擾項（與 C1 前段合併比對） | 改為 ["cleanly","crudely","startlingly","loosely"]（原 ["cleanly","crudely","startlingly","subtly"]） |
| c1-u37-l01-q13 | `items/12/optionGlossZh` | 選項釋義同步 | 改為 ["俐落地","粗糙地","驚人地","鬆散地"]（原 ["俐落地","粗糙地","驚人地","微妙地"]） |
| c1-u37-l01-q16 | `items/15/rubricZh/0` | 第③關 2-E：評分要點寫死位置 | 改為 「複雜難懂的」用 convoluted，位置例如 be 動詞後、名詞前（convoluted terms）等（原 「複雜難懂的」用 convoluted，可放在 be 動詞後或名詞前） |
| c1-u37-l02-q13 | `items/12/options` | 第③關 2-B：非本單元字跨課重複當干擾項（與 C1 前段合併比對） | 改為 ["gushingly","phenomenally","reluctantly","politely"]（原 ["gushingly","phenomenally","reluctantly","remotely"]） |
| c1-u37-l02-q13 | `items/12/optionGlossZh` | 選項釋義同步 | 改為 ["過分熱情地","驚人地","不情願地","有禮貌地"]（原 ["過分熱情地","驚人地","不情願地","遙遠地"]） |
| c1-u37-l02-q14 | `items/13/options` | 第②關：疑似一眼排除（干擾項詞性與其他選項不同） | 改為 ["superficially","fabulously","startlingly","generously"]（原 ["superficially","fabulously","startlingly","spartan"]） |
| c1-u37-l02-q14 | `items/13/optionGlossZh` | 選項釋義同步 | 改為 ["表面上","極其","驚人地","慷慨地"]（原 ["表面上","極其","驚人地","簡樸的"]） |
| c1-u37-l03-q14 | `items/13/options` | 第②關：疑似一眼排除（干擾項詞性與其他選項不同） | 改為 ["superficially","somberly","linearly","legally"]（原 ["superficially","somberly","linearly","blankness"]） |
| c1-u37-l03-q14 | `items/13/optionGlossZh` | 選項釋義同步 | 改為 ["表面上","嚴肅沉重地","線性地","合法地"]（原 ["表面上","嚴肅沉重地","線性地","空白"]） |
| c1-u37-l03-q17 | `items/16/rubricZh/2` | 第②關＋第③關 2-D：評分要點「內容和自己有關」比題目嚴 | 改為 可描述空白的事物或自己腦中的空白（例如 the blankness of the page、a sudden blankness）（原 內容和自己有關（例如 I、my mind）） |
| c1-u37-l03-q10 | `items/9/audioEn` | 聽選音檔算情境句：與 unassisted 卡同為小孩獨力完成事情（女兒拼圖 vs 寶寶站立），改機器人情境 | 改為 The new robot can clean the whole office floor unassisted.（原 My four-year-old daughter finished the whole puzzle unassisted this morning.） |
| c1-u37-l03-q10 | `items/9/audioZh` | 同步 | 改為 新機器人可以獨力把整間辦公室的地板清乾淨。（原 我四歲的女兒今天早上自己一個人完成了整幅拼圖。） |
| c1-u37-l03-q10 | `items/9/questionZh` | 同步 | 改為 新機器人能做什麼？（原 說話者的女兒今天早上做了什麼？） |
| c1-u37-l03-q10 | `items/9/options` | 同步 | 改為 ["Make coffee for the staff.","Clean the office floor without help.","Open the front door.","Answer the phone calls."]（原 ["She helped her dad cook.","She finished a puzzle without any help.","She read a short story.","She drew a picture of a cat."]） |
| c1-u37-l04-q13 | `items/12/options` | 第②關：疑似一眼排除（干擾項詞性與其他選項不同） | 改為 ["unoccupied","removed","repellant","pendulous"]（原 ["stuffiness","removed","repellant","pendulous"]） |
| c1-u37-l04-q13 | `items/12/optionGlossZh` | 選項釋義同步 | 改為 ["空著的","遠離的","令人反感的","下垂的"]（原 ["悶熱不通風","遠離的","令人反感的","下垂的"]） |
| c1-u37-l04-q06 | `items/5/exampleEn` | 第②關：pulled tautly 不道地，改示範副詞的典型用法 | 改為 She smiled tautly, trying to hide her anger.（原 The rope was pulled tautly between the two poles.） |
| c1-u37-l04-q06 | `items/5/exampleZh` | 中譯同步 | 改為 她繃著臉勉強笑了笑，想掩飾怒氣。（原 繩子被緊緊地拉在兩根柱子之間。） |
| c1-u37-l04-q15 | `items/14/rubricZh/2` | 第②關：評分要點寫死 remember to | 改為 「記得」可寫，例如 remember to、don't forget to 等（原 「記得」用 remember to＋原形動詞） |
| c1-u37-l04-q14 | `items/13/questions/1/options/1` | 第③關 3-D：正解多了原文沒有的「準備離開」 | 改為 所有人到大門口集合（原 所有人到大門口集合準備離開） |
| c1-u37-l05-q02 | `items/1/exampleEn` | 第②關：dominantly based on 不道地，改示範 behave dominantly | 改為 The older lion behaved dominantly toward the younger males.（原 The town's economy is dominantly based on fishing.） |
| c1-u37-l05-q02 | `items/1/exampleZh` | 中譯同步 | 改為 那頭年長的獅子對年輕的公獅表現出支配的姿態。（原 這個小鎮的經濟主要以漁業為基礎。） |
| c1-u37-l05-q02 | `items/1/glossZh` | 釋義配合例句 | 改為 支配性地；佔優勢地（原 主要地；佔優勢地） |
| c1-u37-l05-q02 | `items/1/distractorsZh` | 干擾項同步 | 改為 ["順從地；居劣勢地","暫時地；短期地","表面地；膚淺地"]（原 ["偶爾地；少數地","暫時地；短期地","表面地；膚淺地"]） |
| c1-u37-l05-q08 | `items/7/sentenceEn` | 第②關：dominantly 改在聽打示範自然用法（閱讀刪去 dominantly blue and green） | 改為 In meetings, my boss often acts dominantly and rarely lets others speak.（原 The shelter was primitively built from branches and an old sheet.） |
| c1-u37-l05-q08 | `items/7/sentenceZh` | 中譯同步 | 改為 開會時，我老闆常常很強勢，很少讓別人說話。（原 那個遮蔽處是用樹枝和一條舊床單簡陋搭成的。） |
| c1-u37-l05-q14 | `items/13/passageEn` | 第②關：dominantly blue and green 不道地，刪去 | 改為 The designers of the new play at the city theater faced a difficult task: the story takes place on a tropical island, but the budget was small. They used synthetically made palm leaves that look real from a distance, and they painted the back wall a bright aqua to suggest the sea. The costumes are exotically colorful, though the main character's simple clothes are primitively sewn on purpose. The lead actor, a versatile performer who usually plays cruel characters, plays a kind fisherman surprisingly believably. Critics were mostly positive, although one critic wrote frostily that the island "looked more like a hotel lobby."（原 The designers of the new play at the city theater faced a difficult task: the story takes place on a tropical island, but the budget was small. They used synthetically made palm leaves that look real from a distance, and they painted the back wall a bright aqua to suggest the sea. The whole set is dominantly blue and green. The costumes are exotically colorful, though the main character's simple clothes are primitively sewn on purpose. The lead actor, a versatile performer who usually plays cruel characters, plays a kind fisherman surprisingly believably. Critics were mostly positive, although one critic wrote frostily that the island "looked more like a hotel lobby."） |
| c1-u37-l05-q14 | `items/13/passageZh` | 中譯同步 | 改為 市立劇院新戲的設計團隊面臨一個難題：故事發生在熱帶島嶼上，但預算很少。他們用人工合成的棕櫚葉，遠看就像真的；又把背景牆漆成明亮的水綠色來代表大海。戲服色彩繽紛、充滿異國情調，不過主角的簡單衣服是刻意縫得很粗糙原始的。男主角是位戲路很廣、通常演壞人的演員，這次演一位善良的漁夫，卻出奇地令人信服。評論大多正面，不過有一位評論家冷冷地寫道，那座島「看起來比較像飯店大廳」。（原 市立劇院新戲的設計團隊面臨一個難題：故事發生在熱帶島嶼上，但預算很少。他們用人工合成的棕櫚葉，遠看就像真的；又把背景牆漆成明亮的水綠色來代表大海。整個舞台以藍色和綠色為主。戲服色彩繽紛、充滿異國情調，不過主角的簡單衣服是刻意縫得很粗糙原始的。男主角是位戲路很廣、通常演壞人的演員，這次演一位善良的漁夫，卻出奇地令人信服。評論大多正面，不過有一位評論家冷冷地寫道，那座島「看起來比較像飯店大廳」。） |
| c1-u37-l05-q12 | `items/11/options` | 只看英文自查：干擾項放進英文句子也說得通（primitively 與「觀眾感受到恐懼」不完全矛盾） | 改為 ["dominantly","superficially","linearly","believably"]（原 ["dominantly","primitively","linearly","believably"]） |
| c1-u37-l05-q12 | `items/11/optionGlossZh` | 選項釋義同步 | 改為 ["主要地","表面上","線性地","令人信服地"]（原 ["主要地","原始地","線性地","令人信服地"]） |
| c1-u37-l05-q13 | `items/12/options` | 第②關：疑似一眼排除（干擾項詞性與其他選項不同） | 改為 ["exotically","frostily","synthetically","cleanly"]（原 ["exotically","frostily","synthetically","aqua"]） |
| c1-u37-l05-q13 | `items/12/optionGlossZh` | 選項釋義同步 | 改為 ["具異國情調地","冷淡地","人工合成地","俐落地"]（原 ["具異國情調地","冷淡地","人工合成地","水綠色的"]） |
| c1-u37-l05-q07 | `items/6/glossZh` | 第②關：aqua 偏藍，台灣多說「水藍色」 | 改為 水藍色的；藍綠色的（原 水綠色的） |
| c1-u37-l05-q07 | `items/6/distractorsZh` | 干擾項同步雙義格式 | 改為 ["深紅色的；暗紅色的","咖啡色的；棕色的","灰黑色的；暗灰色的"]（原 ["深紅色的","咖啡色的","灰黑色的"]） |
| c1-u37-l05-q07 | `items/6/exampleZh` | 中譯同步 | 改為 她穿了一件水藍色的洋裝去參加夏日派對。（原 她穿了一件水綠色的洋裝去參加夏日派對。） |
| c1-u37-l05-q10 | `items/9/sentenceZh` | 中譯同步 | 改為 海灣裡的水是清澈明亮的水藍色。（原 海灣裡的水是清澈明亮的水綠色。） |
| c1-u37-l05-q14 | `items/13/passageZh` | 中譯同步 | 改為 市立劇院新戲的設計團隊面臨一個難題：故事發生在熱帶島嶼上，但預算很少。他們用人工合成的棕櫚葉，遠看就像真的；又把背景牆漆成明亮的水藍色來代表大海。戲服色彩繽紛、充滿異國情調，不過主角的簡單衣服是刻意縫得很粗糙原始的。男主角是位戲路很廣、通常演壞人的演員，這次演一位善良的漁夫，卻出奇地令人信服。評論大多正面，不過有一位評論家冷冷地寫道，那座島「看起來比較像飯店大廳」。（原 市立劇院新戲的設計團隊面臨一個難題：故事發生在熱帶島嶼上，但預算很少。他們用人工合成的棕櫚葉，遠看就像真的；又把背景牆漆成明亮的水綠色來代表大海。戲服色彩繽紛、充滿異國情調，不過主角的簡單衣服是刻意縫得很粗糙原始的。男主角是位戲路很廣、通常演壞人的演員，這次演一位善良的漁夫，卻出奇地令人信服。評論大多正面，不過有一位評論家冷冷地寫道，那座島「看起來比較像飯店大廳」。） |
| c1-u37-l05-q14 | `items/13/questions/0/options/2` | 選項同步 | 改為 水藍色，用來表現大海（原 水綠色，用來表現大海） |
| c1-u37-l05-q15 | `items/14/promptZh` | 中譯同步 | 改為 我想把浴室的牆漆成水藍色。（原 我想把浴室的牆漆成水綠色。） |
| c1-u37-l05-q15 | `items/14/rubricZh/0` | 第③關 2-E：封閉清單 | 改為 「漆成水藍色」用 aqua，例如 paint the walls aqua、paint the walls an aqua color 等（原 「漆成水綠色」用 paint＋東西＋aqua（也可寫 an aqua color）） |
| c1-u37-l05-q12 | `items/11/optionGlossZh` | 執行長最終複審修正：第 2 條：dominantly 卡片釋義已改為「支配性地」，選項釋義同步 | 改為 ["支配性地","表面上","線性地","令人信服地"]（原 ["主要地","表面上","線性地","令人信服地"]） |
| c1-u37-l06-q07 | `items/6/exampleZh` | 第②關：unscathing 罕用，註明與 unscathed 的區別 | 改為 她對我這篇文章的評語溫和，一點也不尖刻。（unscathing＝not scathing，別和 unscathed「毫髮無傷」混淆）（原 她對我這篇文章的評語溫和，一點也不尖刻。） |
| c1-u37-l06-q14 | `items/13/passageZh` | 第②關＋第③關 2-C：中譯添加「專賣老桌椅和擺飾」；chiselled 在此是「雕鑿成的」 | 改為 Leo 的家具店是個古靈精怪的地方，擺滿各個年代的東西，風格兼收並蓄：一座石雕獅子，就擺在 1970 年左右的塑膠椅旁邊。修理老東西是很費工的事，尤其是那些小小的抽屜把手，但 Leo 樂在其中。不過，他的網站運作很不穩定，訂單有時會不見。上個月，一位知名評論家來店裡參觀。Leo 原本以為會被狠狠批評，沒想到那篇文章出奇地溫和，只提到後面的房間悶熱不通風，窗簾鬆垮地掛在窗戶上。文章刊出後，銷售量增加了將近三分之一。（原 Leo 的店專賣老桌椅和擺飾，是個古靈精怪的地方，擺滿各個年代的東西，風格兼收並蓄：一座輪廓分明的石雕獅子，就擺在 1970 年左右的塑膠椅旁邊。修理老東西是很費工的事，尤其是那些小小的抽屜把手，但 Leo 樂在其中。不過，他的網站運作很不穩定，訂單有時會不見。上個月，一位知名評論家來店裡參觀。Leo 原本以為會被狠狠批評，沒想到那篇文章出奇地溫和，只提到後面的房間悶熱不通風，窗簾鬆垮地掛在窗戶上。文章刊出後，銷售量增加了將近三分之一。） |
| c1-u37-l06-q13 | `items/12/options` | 第②關：疑似一眼排除（干擾項詞性與其他選項不同） | 改為 ["chiselled","fiddly","unscathing","showy"]（原 ["chiselled","fiddly","unscathing","slackly"]） |
| c1-u37-l06-q13 | `items/12/optionGlossZh` | 選項釋義同步 | 改為 ["輪廓分明的","繁瑣費工的","不尖刻的","花俏的"]（原 ["輪廓分明的","繁瑣費工的","不尖刻的","鬆弛地"]） |
| c1-u38-l01-q15 | `items/14/passageEn` | 第②關：negligent 情境改成「不盡責」，與本課詞義一致 | 改為 Twenty years after high school, our class held a reunion at an agreeable little restaurant by the river. We spent hours reminiscing about our teachers. Mr. Chen, our old history teacher, came too, and his exuberance had not faded at all. Someone reminded him that he once called us the most negligent class in the school's history, because we never cleaned the classroom when it was our turn. He quipped that we had finally improved. Some old habits remained: Wendy still answered every question with gentle sarcasm. When Daniel, always a little eccentric, described his fanciful plan to sail around the world on a boat he built himself, everyone laughed, but nobody called it impossible. That would have been hypocritical, since most of us had once had the same dream.（原 Twenty years after high school, our class held a reunion at an agreeable little restaurant by the river. We spent hours reminiscing about our teachers. Mr. Chen, our old history teacher, came too, and his exuberance had not faded at all. Someone reminded him that he once called us the most negligent class in the school's history, because we kept losing our homework. He quipped that we had finally improved. Some old habits remained: Wendy still answered every question with gentle sarcasm. When Daniel, always a little eccentric, described his fanciful plan to sail around the world on a boat he built himself, everyone laughed, but nobody called it impossible. That would have been hypocritical, since most of us had once had the same dream.） |
| c1-u38-l01-q15 | `items/14/passageZh` | 中譯同步 | 改為 高中畢業二十年後，我們班在河邊一家氣氛宜人的小餐廳辦同學會。我們花了好幾個小時追憶老師們。我們以前的歷史老師陳老師也來了，他的熱情一點都沒減。有人提起，他以前說我們是全校史上最不盡責的班，因為輪到我們打掃時從來不掃。他打趣說我們終於進步了。有些老習慣還在：Wendy 回答每個問題時，還是帶著溫和的挖苦。一向有點古怪的 Daniel 說起他異想天開的計畫——要搭自己做的船環遊世界，大家都笑了，但沒有人說那不可能。那樣說就太虛偽了，因為我們大多數人以前也有過同樣的夢想。（原 高中畢業二十年後，我們班在河邊一家氣氛宜人的小餐廳辦同學會。我們花了好幾個小時追憶老師們。我們以前的歷史老師陳老師也來了，他的熱情一點都沒減。有人提起，他以前說我們是全校史上最粗心的班，因為我們老是弄丟作業。他打趣說我們終於進步了。有些老習慣還在：Wendy 回答每個問題時，還是帶著溫和的挖苦。一向有點古怪的 Daniel 說起他異想天開的計畫——要搭自己做的船環遊世界，大家都笑了，但沒有人說那不可能。那樣說就太虛偽了，因為我們大多數人以前也有過同樣的夢想。） |
| c1-u38-l01-q15 | `items/14/questions/0/options/0` | 選項同步 | 改為 全校史上最不盡責的班（原 全校史上最粗心的班） |
| c1-u38-l01-q10 | `items/9/audioEn` | 第③關 3-A#10：聽選音檔與 negligent 卡同為企業安全疏失（聽選音檔算情境句） | 改為 The babysitter was negligent and left the front door open all afternoon.（原 The report said the hotel was negligent because the pool had no lifeguard.） |
| c1-u38-l01-q10 | `items/9/audioZh` | 中譯同步 | 改為 那位保母很疏忽，整個下午都讓前門開著。（原 報告指出，飯店因為游泳池沒有救生員而有疏失。） |
| c1-u38-l01-q10 | `items/9/questionZh` | 題目同步 | 改為 保母做了什麼疏忽的事？（原 報告說飯店有什麼問題？） |
| c1-u38-l01-q10 | `items/9/options` | 選項同步（正解位置不變） | 改為 ["She made too much noise.","She left the front door open.","She came home very late.","She broke a glass."]（原 ["The rooms were too expensive.","There was no one watching the pool.","The food was not fresh.","The staff were rude."]） |
| c1-u38-l01-q14 | `items/13/options` | 第②關：疑似一眼排除（干擾項詞性與其他選項不同） | 改為 ["sarcasm","exuberance","bliss","gratitude"]（原 ["sarcasm","exuberance","bliss","reminisce"]） |
| c1-u38-l01-q14 | `items/13/optionGlossZh` | 選項釋義同步 | 改為 ["諷刺","熱情洋溢","極樂","感激"]（原 ["諷刺","熱情洋溢","極樂","追憶"]） |
| c1-u38-l01-q16 | `items/15/rubricZh/0` | 第③關 2-E：評分要點「常放」未用「例如」 | 改為 「失職的」用 negligent，例如 was negligent、was considered negligent、was found negligent 等（原 「失職的」用 negligent，常放 be 動詞或 was considered／was found 之後） |
| c1-u38-l01-q17 | `items/16/rubricZh/0` | 第③關 2-E：評分要點寫死位置 | 改為 agreeable 表示「令人愉快的」，位置例如名詞前（an agreeable afternoon）、be 動詞後等（原 agreeable 在這裡表示「令人愉快的」，可放名詞前或 be 動詞、find＋受詞之後） |
| c1-u38-l02-q05 | `items/4/distractorsZh` | 第②關：「無氣的」不通順 | 改為 ["沉默寡言的；沒氣的","脾氣差的；苦澀的","疲倦的；混濁的"]（原 ["沉默寡言的；無氣的","脾氣差的；苦澀的","疲倦的；混濁的"]） |
| c1-u38-l02-q13 | `items/12/stemEn` | 第③關 3-A#4：mcq 與 unsettling 卡同為「夜裡空蕩處令人不安」 | 改為 The long silence after his question was deeply ____.（原 The strange noises coming from the empty house were deeply ____.） |
| c1-u38-l02-q13 | `items/12/stemZh` | 中譯同步 | 改為 他提問之後那段長長的沉默，讓人非常不安。（原 從那間空屋傳出的奇怪聲響，讓人非常不安。） |
| c1-u38-l02-q13 | `items/12/options` | 只看英文自查：干擾項放進英文句子也說得通（the silence was deeply pleasurable 說得通） | 改為 ["compliant","bubbly","unsettling","instinctive"]（原 ["compliant","pleasurable","unsettling","instinctive"]） |
| c1-u38-l02-q13 | `items/12/optionGlossZh` | 選項釋義同步 | 改為 ["順從的","活潑開朗的","令人不安的","本能的"]（原 ["順從的","令人愉快的","令人不安的","本能的"]） |
| c1-u38-l02-q14 | `items/13/stemEn` | 第③關 3-A#3：mcq 與 wryly 卡同為「引述反話＋said wryly」 | 改為 He smiled ____ when his flight was delayed for the third time that week.（原 "Well, that went perfectly," she said ____, looking at the broken vase.） |
| c1-u38-l02-q14 | `items/13/stemZh` | 中譯同步 | 改為 他的班機那週第三次延誤時，他苦笑了一下。（原 「嗯，真是太完美了。」她看著破掉的花瓶，苦笑著說。） |
| c1-u38-l02-q14 | `items/13/options` | 第②關：疑似一眼排除（干擾項詞性與其他選項不同） | 改為 ["financially","voluntarily","mutually","wryly"]（原 ["tranquility","voluntarily","mutually","wryly"]） |
| c1-u38-l02-q14 | `items/13/optionGlossZh` | 選項釋義同步 | 改為 ["財務上","自願地","互相地","苦笑地"]（原 ["寧靜","自願地","互相地","苦笑地"]） |
| c1-u38-l02-q14 | `items/13/options` | 只看英文自查：干擾項放進英文句子也說得通（smiled voluntarily 不算明顯錯） | 改為 ["financially","officially","mutually","wryly"]（原 ["financially","voluntarily","mutually","wryly"]） |
| c1-u38-l02-q14 | `items/13/optionGlossZh` | 選項釋義同步 | 改為 ["財務上","正式地","互相地","苦笑地"]（原 ["財務上","自願地","互相地","苦笑地"]） |
| c1-u38-l03-q14 | `items/13/options` | 第②關：疑似一眼排除（干擾項詞性與其他選項不同） | 改為 ["engrossed","riveting","enterprising","altruistic"]（原 ["engrossed","riveting","enterprising","detest"]） |
| c1-u38-l03-q14 | `items/13/optionGlossZh` | 選項釋義同步 | 改為 ["全神貫注的","引人入勝的","有進取心的","無私的"]（原 ["全神貫注的","引人入勝的","有進取心的","厭惡"]） |
| c1-u38-l04-q13 | `items/12/stemEn` | 第③關 2-A：mcq 與 lackluster 卡同主詞（球隊）同情境 | 改為 Despite its famous cast, the film had a ____ story, and few people went to see it.（原 After a ____ first half, the team finally woke up and scored three goals.） |
| c1-u38-l04-q13 | `items/12/stemZh` | 中譯同步 | 改為 儘管卡司陣容堅強，這部電影的故事卻平淡無奇，沒什麼人去看。（原 上半場表現平平之後，這支球隊終於清醒過來，踢進三球。） |
| c1-u38-l04-q14 | `items/13/options` | 第②關：疑似一眼排除（干擾項詞性與其他選項不同） | 改為 ["trying","irate","astray","bubbly"]（原 ["trying","irate","astray","gusto"]） |
| c1-u38-l04-q14 | `items/13/optionGlossZh` | 選項釋義同步 | 改為 ["難熬的","憤怒的","迷路；遺失","活潑的；冒泡的"]（原 ["難熬的","憤怒的","迷路；遺失","熱情"]） |
| c1-u38-l04-q17 | `items/16/rubricZh/0` | 第③關 2-E：評分要點「常用 A 或 B」 | 改為 gusto 是名詞，例如 with gusto、with great gusto 等，用來修飾動作（原 gusto 是名詞，常用 with gusto 或 with great gusto 修飾動作） |
| c1-u38-l05-q02 | `items/1/exampleEn` | 第③關 3-A#5：卡片與閱讀同主詞 she、同句型 | 改為 Can I speak candidly? I think the plan will fail.（原 She candidly told us about her mistakes as a young manager.） |
| c1-u38-l05-q02 | `items/1/exampleZh` | 中譯同步 | 改為 我可以直說嗎？我覺得這個計畫會失敗。（原 她坦白地跟我們說了自己當年輕主管時犯的錯。） |
| c1-u38-l05-q14 | `items/13/options` | 第②關：疑似一眼排除（干擾項詞性與其他選項不同） | 改為 ["lackluster","sentient","unwavering","hypocritical"]（原 ["lackluster","sentient","unwavering","candidly"]） |
| c1-u38-l05-q14 | `items/13/optionGlossZh` | 選項釋義同步 | 改為 ["平淡無奇的","有知覺的","堅定不移的","虛偽的"]（原 ["平淡無奇的","有知覺的","堅定不移的","坦白地"]） |
| c1-u38-l05-q12 | `items/11/sentenceZh` | 第②關：「很大的圓融」搭配不當 | 改為 要告訴朋友他的點子不好，說話得很圓融才行。（原 要告訴朋友他的點子不好，需要很大的圓融。） |
| c1-u38-l06-q13 | `items/12/options` | 只看英文自查：干擾項放進英文句子也說得通（agreeable stories 文法語意都通，算雙答案） | 改為 ["macabre","docile","monotonous","instinctive"]（原 ["macabre","docile","agreeable","instinctive"]） |
| c1-u38-l06-q13 | `items/12/optionGlossZh` | 選項釋義同步 | 改為 ["陰森恐怖的","溫順的","單調的","本能的"]（原 ["陰森恐怖的","溫順的","令人愉快的","本能的"]） |
| c1-u38-l06-q14 | `items/13/options` | 第②關：疑似一眼排除（干擾項詞性與其他選項不同） | 改為 ["disillusionment","exhilaration","gusto","flattery"]（原 ["blithely","exhilaration","gusto","flattery"]） |
| c1-u38-l06-q14 | `items/13/optionGlossZh` | 選項釋義同步 | 改為 ["幻滅","興奮","熱情","奉承"]（原 ["滿不在乎地","興奮","熱情","奉承"]） |
| c1-u38-l06-q14 | `items/13/options` | 只看英文自查：Don't let his gusto fool you 勉強說得通 | 改為 ["disillusionment","exhilaration","sarcasm","flattery"]（原 ["disillusionment","exhilaration","gusto","flattery"]） |
| c1-u38-l06-q14 | `items/13/optionGlossZh` | 選項釋義同步 | 改為 ["幻滅","興奮","諷刺","奉承"]（原 ["幻滅","興奮","熱情","奉承"]） |
| c1-u38-l07-q14 | `items/13/options` | 第②關：疑似一眼排除（干擾項詞性與其他選項不同） | 改為 ["sarcastically","aimlessly","naively","viciously"]（原 ["sarcastically","aimlessly","naively","disquieting"]） |
| c1-u38-l07-q14 | `items/13/optionGlossZh` | 選項釋義同步 | 改為 ["諷刺地","漫無目的地","天真地","兇狠地"]（原 ["諷刺地","漫無目的地","天真地","令人不安的"]） |
| c1-u38-l08-q02 | `items/1/exampleEn` | 第②關：Her teammates／his 所指不清 | 改為 His teammates never forgave his desertion of the team before the final.（原 Her teammates never forgave his desertion of the team before the final.） |
| c1-u38-l08-q02 | `items/1/exampleZh` | 中譯同步 | 改為 他的隊友們始終無法原諒他在決賽前拋下球隊離開。（原 隊友們始終無法原諒他在決賽前拋下球隊離開。） |
| c1-u38-l08-q13 | `items/12/options` | 第③關 3-C#12＋只看英文自查：slow and beguiling 也說得通 | 改為 ["dutiful","irate","aimless","enviable"]（原 ["dutiful","beguiling","aimless","enviable"]） |
| c1-u38-l08-q13 | `items/12/optionGlossZh` | 選項釋義同步 | 改為 ["盡責的","憤怒的","漫無目的的","令人羨慕的"]（原 ["盡責的","迷人的","漫無目的的","令人羨慕的"]） |
| c1-u38-l08-q14 | `items/13/options` | 第②關：疑似一眼排除（干擾項詞性與其他選項不同） | 改為 ["wrangled","reminisced","daydreamed","sprawled"]（原 ["wrangled","reminisced","daydreamed","cleverness"]） |
| c1-u38-l08-q14 | `items/13/optionGlossZh` | 選項釋義同步 | 改為 ["爭吵","追憶","做白日夢","攤開四肢躺"]（原 ["爭吵","追憶","做白日夢","聰明"]） |
| c1-u38-l08-q10 | `items/9/audioEn` | 第③關 3-D：避免遺產（親人過世）意味 | 改為 The two brothers wrangled for months over who should keep the old car they had bought together.（原 The two brothers wrangled for months over who should keep their father's old car.） |
| c1-u38-l08-q10 | `items/9/audioZh` | 中譯同步 | 改為 兩兄弟為了誰該留下他們合買的那輛舊車，爭了好幾個月。（原 兩兄弟為了誰該留下父親的舊車，爭了好幾個月。） |
| c1-u38-l08-q10 | `items/9/options` | 干擾項同步（去掉遺產意味） | 改為 ["How to share the cost of a new house.","Who would get the old car.","Where to go on holiday.","Which school to attend."]（原 ["How to divide the money from the house.","Who would get the old car.","Where to go on holiday.","Which school to attend."]） |
| c1-u38-l09-q14 | `items/13/options` | 第②關：疑似一眼排除（干擾項詞性與其他選項不同） | 改為 ["inexcusable","zany","scornful","enviable"]（原 ["inexcusable","zany","scornful","lethargy"]） |
| c1-u38-l09-q14 | `items/13/optionGlossZh` | 選項釋義同步 | 改為 ["不可原諒的","滑稽古怪的","輕蔑的","令人羨慕的"]（原 ["不可原諒的","滑稽古怪的","輕蔑的","倦怠"]） |
| c1-u38-l09-q17 | `items/16/rubricZh/0` | 第②關＋第③關 2-E：刪去「可數名詞」、改用「例如」 | 改為 commendation 表示「表揚」，例如 receive a commendation for…、get a commendation 等（原 commendation 是可數名詞，常寫 receive／get a commendation for＋原因） |
| c1-u38-l09-q12 | `items/11/sentenceEn` | 執行長裁示修正（3-C 第 17 條：同單元不同課不重複同一情境）：①午餐後提不起勁重複（u38-l08 q09 保留），改成週日賴床（避開 u38-l04 球隊表現平平、u38-l10 長途飛行的情境） | 改為 On Sunday, a deep lethargy kept me in bed until noon.（原 After lunch, a wave of lethargy came over the whole office.） |
| c1-u38-l09-q12 | `items/11/sentenceZh` | 執行長裁示修正（3-C 第 17 條：同單元不同課不重複同一情境）：中譯同步 | 改為 星期天，一股濃濃的倦怠感讓我在床上賴到中午。（原 午餐後，一股倦怠感籠罩了整間辦公室。） |
| c1-u38-l10-q14 | `items/13/options` | 第②關：疑似一眼排除（干擾項詞性與其他選項不同） | 改為 ["refreshingly","smugly","wickedly","gamely"]（原 ["ruthlessness","smugly","wickedly","gamely"]） |
| c1-u38-l10-q14 | `items/13/optionGlossZh` | 選項釋義同步 | 改為 ["令人耳目一新地","沾沾自喜地","頑皮使壞地","勇敢地"]（原 ["無情","沾沾自喜地","頑皮使壞地","勇敢地"]） |
| c1-u38-l10-q14 | `items/13/options` | 只看英文自查：干擾項放進英文句子也說得通（smugly got up 不算錯句） | 改為 ["refreshingly","sarcastically","wickedly","gamely"]（原 ["refreshingly","smugly","wickedly","gamely"]） |
| c1-u38-l10-q14 | `items/13/optionGlossZh` | 選項釋義同步 | 改為 ["令人耳目一新地","諷刺地","頑皮使壞地","勇敢地"]（原 ["令人耳目一新地","沾沾自喜地","頑皮使壞地","勇敢地"]） |
| c1-u38-l10-q16 | `items/15/promptZh` | 第②關＋第③關 3-C#13：long and torturous road 易與 tortuous 混淆 | 改為 回家的那趟飛行又長又折磨人。（原 通往山頂的那條路又長又折磨人。） |
| c1-u38-l10-q16 | `items/15/referenceEn` | 參考答案同步 | 改為 ["The flight home was long and torturous.","The trip home by plane was long and torturous."]（原 ["The road to the top of the mountain was long and torturous.","The path up to the top of the mountain is long and torturous."]） |
| c1-u38-l10-q16 | `items/15/rubricZh` | 評分要點同步 | 改為 ["「折磨人的」用 torturous，例如放 be 動詞後（long and torturous）等","「回家的那趟飛行」可寫，例如 the flight home、the trip home by plane 等","時態配合內容（例如 was、is）"]（原 ["「折磨人的」用 torturous，可放 be 動詞後（例如 long and torturous）","「通往山頂的路」可寫，例如 the road to the top、the path up to the top 等","時態配合內容（例如 was、is）"]） |
| c1-u38-l10-q01 | `items/0/glossZh` | 第③關 3-B#11：釋義補核心詞義「邪惡地」 | 改為 頑皮使壞地；極其（好笑等）；邪惡地（原 頑皮使壞地；極其（好笑等）） |
| c1-u38-l10-q01 | `items/0/distractorsZh` | 第②關：干擾項詞性格式與正解不對稱 | 改為 ["乖巧地；稍微地；善良地","害怕地；勉強地；溫柔地","誠懇地；普通地；正直地"]（原 ["乖巧地；稍微","害怕地；勉強","誠懇地；普通"]） |
| c1-u39-l01-q13 | `items/12/options` | 只看英文自查：干擾項放進英文句子也說得通（story was tactful 說得通） | 改為 ["pleasurable","impish","neglectful","unconvincing"]（原 ["tactful","impish","neglectful","unconvincing"]） |
| c1-u39-l01-q13 | `items/12/optionGlossZh` | 選項釋義同步 | 改為 ["令人愉快的","頑皮的","疏忽的","沒有說服力的"]（原 ["圓融得體的","頑皮的","疏忽的","沒有說服力的"]） |
| c1-u39-l01-q14 | `items/13/options` | 第②關：疑似一眼排除（干擾項詞性與其他選項不同） | 改為 ["salvage","detest","glean","daunt"]（原 ["buffoon","detest","glean","daunt"]） |
| c1-u39-l01-q14 | `items/13/optionGlossZh` | 選項釋義同步 | 改為 ["搶救","厭惡","蒐集","嚇倒"]（原 ["小丑","厭惡","蒐集","嚇倒"]） |
| c1-u39-l01-q16 | `items/15/rubricZh/0` | 第③關 2-E：評分要點「常寫」未用「例如」 | 改為 「疏忽的」用 neglectful，例如 be neglectful of his family 等（原 「疏忽的」用 neglectful，常寫 be neglectful of＋對象） |
| c1-u39-l02-q07 | `items/6/glossZh` | 第②關：「吃力不討好」多加語意（那是 thankless） | 改為 不令人羨慕的；艱難的（原 不令人羨慕的；吃力不討好的） |
| c1-u39-l02-q07 | `items/6/exampleZh` | 中譯同步 | 改為 身為島上唯一的醫生，讓她處在一個艱難、不令人羨慕的處境。（原 身為島上唯一的醫生，讓她處在一個吃力不討好的處境。） |
| c1-u39-l02-q13 | `items/12/stemEn` | 第③關 2-A：mcq 題幹是 insubordination 卡的換句話說 | 改為 The sailor was punished for ____ after he refused the captain's orders.（原 Ignoring the manager's clear instructions was seen as ____.） |
| c1-u39-l02-q13 | `items/12/stemZh` | 中譯同步 | 改為 那名船員違抗船長的命令，因不服從上級而受罰。（原 無視經理明確的指示，被視為不服從上級。） |
| c1-u39-l02-q14 | `items/13/stemEn` | 只看英文自查：干擾項放進英文句子也說得通（缺「輕蔑」線索，tactfully、conscientiously 只靠語境排除） | 改為 He looked ____ at my old phone, as if it were rubbish, and then showed me his new one.（原 He looked ____ at my old phone and then showed me his new one.） |
| c1-u39-l02-q14 | `items/13/stemZh` | 中譯同步 | 改為 他輕蔑地看了看我的舊手機，好像那是垃圾一樣，然後秀出他的新手機。（原 他輕蔑地看了看我的舊手機，然後秀出他的新手機。） |
| c1-u39-l02-q14 | `items/13/options` | 第②關：疑似一眼排除（干擾項詞性與其他選項不同） | 改為 ["scornfully","conscientiously","tactfully","naively"]（原 ["scornfully","conscientiously","tactfully","unenviable"]） |
| c1-u39-l02-q14 | `items/13/optionGlossZh` | 選項釋義同步 | 改為 ["輕蔑地","認真盡責地","得體地","天真地"]（原 ["輕蔑地","認真盡責地","得體地","不令人羨慕的"]） |
| c1-u39-l02-q17 | `items/16/rubricZh/0` | 第③關 2-E：評分要點「常寫」未用「例如」 | 改為 naturalness 是名詞，例如 the naturalness of the actors、her naturalness 等（原 naturalness 是名詞，常寫 the naturalness of＋人或事物） |
| c1-u39-l02-q02 | `items/1/exampleEn` | 執行長最終複審修正：第 5 條：卡片「拒絕經理命令＝抗命」與 u39-l08 閱讀同為員工違抗經理（3-C 第 17 條②） | 改為 In the army, insubordination is taken very seriously.（原 Refusing a direct order from a manager can be treated as insubordination.） |
| c1-u39-l02-q02 | `items/1/exampleZh` | 執行長最終複審修正：中譯同步 | 改為 在軍中，抗命是非常嚴重的事。（原 拒絕主管的直接指示，可能會被視為不服從上級。） |
| c1-u39-l03-q07 | `items/6/exampleEn` | 第③關 3-A#6：卡片與翻譯參考答案同句型、同情境 | 改為 Only an exhibitionist would sing that loudly on a crowded train.（原 My cousin is a born exhibitionist who loves being on stage.） |
| c1-u39-l03-q07 | `items/6/exampleZh` | 中譯同步 | 改為 只有愛出風頭的人，才會在擁擠的火車上唱得那麼大聲。（原 我表哥天生愛出風頭，最喜歡站在舞台上。） |
| c1-u39-l03-q13 | `items/12/options` | 只看英文自查：干擾項放進英文句子也說得通（benign performance 勉強說得通） | 改為 ["remorseless","uninspiring","enviable","impish"]（原 ["remorseless","uninspiring","benign","impish"]） |
| c1-u39-l03-q13 | `items/12/optionGlossZh` | 選項釋義同步 | 改為 ["冷酷無情的","乏味的","令人羨慕的","頑皮的"]（原 ["冷酷無情的","乏味的","良性的；溫和的","頑皮的"]） |
| c1-u39-l03-q14 | `items/13/options` | 第②關：疑似一眼排除（干擾項詞性與其他選項不同）；換上的字改用本單元的 conscientiously（避免與 C1 前段 c1-u11-l02 的 linear 同詞族重複） | 改為 ["conscientiously","appallingly","voraciously","exuberantly"]（原 ["exhibitionist","appallingly","voraciously","exuberantly"]） |
| c1-u39-l03-q14 | `items/13/optionGlossZh` | 選項釋義同步 | 改為 ["認真盡責地","極差地","狼吞虎嚥地","興高采烈地"]（原 ["愛出風頭的人","極差地","狼吞虎嚥地","興高采烈地"]） |
| c1-u39-l04-q02 | `items/1/glossZh` | 第②關：補 fiendish 常見的「狡詐精巧」義 | 改為 極難的；狡詐的；惡毒的（原 極難的；惡毒的） |
| c1-u39-l04-q02 | `items/1/distractorsZh` | 干擾項同步格式 | 改為 ["簡單的；坦率的；善良的","有趣的；笨拙的；溫和的","普通的；誠實的；平凡的"]（原 ["簡單的；善良的","有趣的；溫和的","普通的；平凡的"]） |
| c1-u39-l04-q14 | `items/13/options` | 第②關：疑似一眼排除（干擾項詞性與其他選項不同） | 改為 ["pendulous","uneventful","fiendish","tactful"]（原 ["pendulous","uneventful","fiendish","dismally"]） |
| c1-u39-l04-q14 | `items/13/optionGlossZh` | 選項釋義同步 | 改為 ["下垂的","平靜無事的","極難的","圓融得體的"]（原 ["下垂的","平靜無事的","極難的","慘淡地"]） |
| c1-u39-l05-q12 | `items/11/sentenceEn` | 第③關 2-A：跟讀與 sedately 卡同為交通工具從容駛過 | 改為 The guests sat sedately at the long table, waiting for the speeches.（原 The car drove sedately through the quiet village.） |
| c1-u39-l05-q12 | `items/11/sentenceZh` | 中譯同步 | 改為 賓客們從容地坐在長桌旁，等著聽致詞。（原 那輛車從容緩慢地駛過寧靜的村莊。） |
| c1-u39-l05-q13 | `items/12/stemEn` | 第③關 3-A#7：mcq 與 remorselessly 卡同為天氣 | 改為 The questions came ____, one after another, until he gave up.（原 The rain fell ____ for three days, soaking every street in town.） |
| c1-u39-l05-q13 | `items/12/stemZh` | 中譯同步 | 改為 問題一個接一個毫不停歇地丟過來，直到他放棄為止。（原 雨毫不停歇地下了三天，鎮上每條街都濕透了。） |
| c1-u39-l05-q13 | `items/12/options` | 只看英文自查：新題幹下 questions came impersonally 說得通 | 改為 ["sedately","remorselessly","unconvincingly","fiendishly"]（原 ["impersonally","remorselessly","unconvincingly","fiendishly"]） |
| c1-u39-l05-q13 | `items/12/optionGlossZh` | 選項釋義同步 | 改為 ["從容緩慢地","毫不停歇地","不令人信服地","極其"]（原 ["冷淡地","毫不停歇地","不令人信服地","極其"]） |
| c1-u39-l05-q14 | `items/13/options` | 第②關：疑似一眼排除（干擾項詞性與其他選項不同） | 改為 ["spartan","engrossing","uninspiring","detestable"]（原 ["tediously","engrossing","uninspiring","detestable"]） |
| c1-u39-l05-q14 | `items/13/optionGlossZh` | 選項釋義同步 | 改為 ["簡樸的","引人入勝的","乏味的","可憎的"]（原 ["冗長乏味地","引人入勝的","乏味的","可憎的"]） |
| c1-u39-l05-q14 | `items/13/options` | 只看英文自查：干擾項放進英文句子也說得通（Bullying is uninspiring 勉強說得通） | 改為 ["spartan","engrossing","enterprising","detestable"]（原 ["spartan","engrossing","uninspiring","detestable"]） |
| c1-u39-l05-q14 | `items/13/optionGlossZh` | 選項釋義同步 | 改為 ["簡樸的","引人入勝的","有進取心的","可憎的"]（原 ["簡樸的","引人入勝的","乏味的","可憎的"]） |
| c1-u39-l06-q09 | `items/8/sentenceEn` | 第③關 3-A#8：聽打與 sentimentally 卡同為對紀念物念舊 | 改為 He spoke sentimentally about the town where he grew up.（原 She sentimentally kissed the old photo before putting it away.） |
| c1-u39-l06-q09 | `items/8/sentenceZh` | 中譯同步 | 改為 他感傷地談起自己長大的那個小鎮。（原 她感傷地親了一下那張老照片，才把它收起來。） |
| c1-u39-l06-q14 | `items/13/options` | 第②關：疑似一眼排除（干擾項詞性與其他選項不同）；換上本單元的 tactful（altruistic employee 只看英文不算明顯不通） | 改為 ["tactful","unenviable","engrossing","insubordinate"]（原 ["impishly","unenviable","engrossing","insubordinate"]） |
| c1-u39-l06-q14 | `items/13/optionGlossZh` | 選項釋義同步 | 改為 ["圓融得體的","不令人羨慕的","引人入勝的","不服從的"]（原 ["頑皮地","不令人羨慕的","引人入勝的","不服從的"]） |
| c1-u39-l06-q15 | `items/14/passageZh` | 第③關 2-C：中譯添加「常」 | 改為 我的伯公 Felix 是位多產的畫家，畫了兩千多幅作品。他的穿著也很古怪，常常左右腳穿不同的鞋。年輕時讀美術學校，他因為不肯臨摹古代大師的畫，被認為不服從，老師們也不重視他的個人特色。他討厭一成不變的創作，例如每天畫同一盤水果。晚年時，他感傷地談起那段學生時光。他有時會批評有錢的收藏家，不過也有人說他這樣很虛偽，因為他自己就賣了很多畫給他們。九十歲生日那天，他頑皮地笑著說要開始畫一系列新作品。這系列作品展出時，他得意地走過擠滿人潮的展覽廳。（原 我的伯公 Felix 是位多產的畫家，畫了兩千多幅作品。他的穿著也很古怪，常常左右腳穿不同的鞋。年輕時讀美術學校，他因為不肯臨摹古代大師的畫，被認為不服從，老師們也不重視他的個人特色。他討厭一成不變的創作，例如每天畫同一盤水果。晚年時，他常感傷地談起那段學生時光。他有時會批評有錢的收藏家，不過也有人說他這樣很虛偽，因為他自己就賣了很多畫給他們。九十歲生日那天，他頑皮地笑著說要開始畫一系列新作品。這系列作品展出時，他得意地走過擠滿人潮的展覽廳。） |
| c1-u39-l06-q16 | `items/15/rubricZh/0` | 第②關：評分要點寫死位置 | 改為 「虛偽地」用副詞 hypocritically，位置例如動詞前（hypocritically criticizes）、句中其他適當位置 等（原 「虛偽地」用副詞 hypocritically，放在動詞前（例如 hypocritically criticizes）） |
| c1-u39-l06-q10 | `items/9/audioEn` | 聽選音檔算情境句：與 monotonously 卡同句型、同為重複的聲響（雨聲 vs 鐘聲） | 改為 The tour guide spoke so monotonously that half the group fell asleep.（原 The old clock ticked monotonously in the empty hall all night.） |
| c1-u39-l06-q10 | `items/9/audioZh` | 同步 | 改為 導覽員說話單調得讓半團的人都睡著了。（原 那座老鐘整夜在空蕩的大廳裡單調地滴答作響。） |
| c1-u39-l06-q10 | `items/9/questionZh` | 同步 | 改為 導覽員說話怎麼樣？（原 那座老鐘整夜怎麼樣？） |
| c1-u39-l06-q10 | `items/9/options` | 同步 | 改為 ["With a lot of funny stories.","In a dull, flat voice.","Very quickly and very loudly.","In three different languages."]（原 ["It rang loudly every hour.","It ticked on and on.","It stopped working at midnight.","It played a short song."]） |
| c1-u39-l06-q14 | `items/13/stemEn` | 執行長裁示修正（3-C 第 17 條：同單元不同課不重複同一情境）：②員工無視經理指示重複（u39-l02 卡保留），改成學生與老師 | 改為 The ____ pupil kept talking back to the teacher, so he was sent to the head teacher's office.（原 The ____ employee kept ignoring his manager's instructions.） |
| c1-u39-l06-q14 | `items/13/stemZh` | 執行長裁示修正（3-C 第 17 條：同單元不同課不重複同一情境）：中譯同步 | 改為 那個不服從的學生一直跟老師頂嘴，所以被送到校長室。（原 那名不服從的員工一直無視經理的指示。） |
| c1-u39-l06-q10 | `items/9/audioEn` | 執行長最終複審修正：第 6 條：聽選與 u39-l03／l05／l07 同為講者無聊、聽者提不起精神（同單元不同課不重複同一情境） | 改為 The flat desert road stretched on monotonously for hours.（原 The tour guide spoke so monotonously that half the group fell asleep.） |
| c1-u39-l06-q10 | `items/9/audioZh` | 執行長最終複審修正：中譯同步 | 改為 平坦的沙漠公路單調地綿延了好幾個小時。（原 導覽員說話單調得讓半團的人都睡著了。） |
| c1-u39-l06-q10 | `items/9/questionZh` | 執行長最終複審修正：題目同步 | 改為 那條沙漠公路是什麼樣子？（原 導覽員說話怎麼樣？） |
| c1-u39-l06-q10 | `items/9/options` | 執行長最終複審修正：選項同步（正解仍在位置 1） | 改為 ["It had a lot of sharp, narrow turns.","Flat and the same for hours.","It was crowded with big, noisy trucks.","It was closed for repairs all day."]（原 ["With a lot of funny stories.","In a dull, flat voice.","Very quickly and very loudly.","In three different languages."]） |
| c1-u39-l06-q10 | `items/9/options` | 執行長最終複審修正：正解是殘句、其他選項是完整句，格式不一致成為猜題線索，改成完整句 | 改為 ["It had a lot of sharp, narrow turns.","It was flat and the same for hours.","It was crowded with big, noisy trucks.","It was closed for repairs all day."]（原 ["It had a lot of sharp, narrow turns.","Flat and the same for hours.","It was crowded with big, noisy trucks.","It was closed for repairs all day."]） |
| c1-u39-l07-q03 | `items/2/exampleEn` | 第③關 2-A：卡片與翻譯同句型、同情境（遲到） | 改為 The hotel room was inexcusably dirty for the price.（原 The train was inexcusably late for the third time this week.） |
| c1-u39-l07-q03 | `items/2/exampleZh` | 中譯同步 | 改為 以這個價格來說，飯店房間髒得實在說不過去。（原 這班火車本週第三次誤點，實在說不過去。） |
| c1-u39-l07-q02 | `items/1/exampleEn` | 第②關：gruesomely 形容爛水果不是典型用法 | 改為 The film's final scene was gruesomely realistic.（原 The fallen fruit had turned gruesomely black and soft in the hot sun.） |
| c1-u39-l07-q02 | `items/1/exampleZh` | 中譯同步 | 改為 那部電影的最後一幕逼真得令人毛骨悚然。（原 掉落的水果在烈日下變得又黑又軟，噁心駭人。） |
| c1-u39-l07-q13 | `items/12/options` | 第②關：疑似一眼排除（干擾項詞性與其他選項不同） | 改為 ["claustrophobia","insubordination","naivety","buffoon"]（原 ["claustrophobia","insubordination","naivety","beguilingly"]） |
| c1-u39-l07-q13 | `items/12/optionGlossZh` | 選項釋義同步 | 改為 ["幽閉恐懼","不服從","天真","小丑"]（原 ["幽閉恐懼","不服從","天真","迷人地"]） |
| c1-u39-l07-q16 | `items/15/rubricZh/0` | 第③關 2-E：評分要點「可放」未用「例如」 | 改為 gruelling 是形容詞，例如放名詞前（a gruelling day）、be 動詞後（was gruelling）等；美式拼法 grueling 也正確（原 gruelling 是形容詞，可放名詞前或 be 動詞後（美式拼法 grueling 也正確）） |
| c1-u39-l07-q08 | `items/7/sentenceEn` | 執行長裁示修正（3-C 第 17 條：同單元不同課不重複同一情境）：①午餐後提不起勁重複（u38-l08 q09 保留），改成排隊情境 | 改為 The long line moved lethargically toward the ticket office.（原 After the big lunch, the whole office worked lethargically until three.） |
| c1-u39-l07-q08 | `items/7/sentenceZh` | 執行長裁示修正（3-C 第 17 條：同單元不同課不重複同一情境）：中譯同步 | 改為 長長的隊伍慢吞吞地朝售票處移動。（原 吃完豐盛的午餐後，整間辦公室的人都懶洋洋地工作到三點。） |
| c1-u39-l08-q07 | `items/6/exampleEn` | 第③關 3-C#14：raunchily 與學校音樂會並列不妥 | 改為 Some of the dancers moved rather raunchily for a family TV show.（原 The singer danced rather raunchily for a school concert.） |
| c1-u39-l08-q07 | `items/6/exampleZh` | 中譯同步 | 改為 以闔家觀賞的電視節目來說，有些舞者的動作太露骨了。（原 以學校音樂會來說，那位歌手跳得有點太露骨了。） |
| c1-u39-l08-q14 | `items/13/passageEn` | 第②關：the guest accepted compliantly 語意不對；told jokes so raunchily 生硬，改較溫和的情境 | 改為 Working at a hotel front desk can be stressful. Last Friday, a guest complained irately that his room key did not work. A young colleague answered insensitively, saying it was probably the guest's own fault, which made things worse. When the manager told him to apologize, he responded insubordinately and walked away. Lin, the shift leader, kept her poise. She fixed the key, offered a free breakfast and asked the guest to sign a short form, which he did compliantly. Later, a sign that had been fixed insecurely to the wall fell down in the lobby, and at the bar a band sang rather raunchily, so some parents took their children to eat elsewhere. Still, the challenge of solving one problem after another exhilarated Lin.（原 Working at a hotel front desk can be stressful. Last Friday, a guest complained irately that his room key did not work. A young colleague answered insensitively, saying it was probably the guest's own fault, which made things worse. When the manager told him to apologize, he responded insubordinately and walked away. Lin, the shift leader, kept her poise. She fixed the key and offered a free breakfast, and the guest accepted compliantly. Later, a sign that had been fixed insecurely to the wall fell down in the lobby, and at the bar a comedian told jokes so raunchily that some families left early. Still, the challenge of solving one problem after another exhilarated Lin.） |
| c1-u39-l08-q14 | `items/13/passageZh` | 中譯同步 | 改為 在飯店櫃台工作可能壓力很大。上星期五，一位客人氣沖沖地抱怨房卡不能用。一位年輕同事很不體貼地回答說，大概是客人自己的錯，結果讓情況更糟。經理叫他道歉時，他不服從地頂了回去，然後走開。值班主管 Lin 保持鎮定。她修好房卡，送客人一份免費早餐，再請客人簽一張簡短的表格，客人也照做了。後來，大廳裡一塊沒釘牢的告示牌從牆上掉了下來；酒吧裡的樂團唱得有點露骨，有些家長就帶孩子到別處用餐。儘管如此，一個接一個解決問題的挑戰，還是讓 Lin 感到興奮。（原 在飯店櫃台工作可能壓力很大。上星期五，一位客人氣沖沖地抱怨房卡不能用。一位年輕同事很不體貼地回答說，大概是客人自己的錯，結果讓情況更糟。經理叫他道歉時，他不服從地頂了回去，然後走開。值班主管 Lin 保持鎮定。她修好房卡，還送客人一份免費早餐，客人也順從地接受了。後來，大廳裡一塊沒釘牢的告示牌從牆上掉了下來；酒吧裡一位喜劇演員講笑話講得太露骨，有些全家來的客人提早離開。儘管如此，一個接一個解決問題的挑戰，還是讓 Lin 感到興奮。） |
| c1-u39-l08-q13 | `items/12/options` | 第②關：疑似一眼排除（干擾項詞性與其他選項不同） | 改為 ["gruesomely","compliantly","victoriously","insubordinately"]（原 ["exhilarate","compliantly","victoriously","insubordinately"]） |
| c1-u39-l08-q13 | `items/12/optionGlossZh` | 選項釋義同步 | 改為 ["駭人地","順從地","勝利地","不服從地"]（原 ["使興奮","順從地","勝利地","不服從地"]） |
| c1-u39-l08-q15 | `items/14/rubricZh/0` | 第③關 2-E：評分要點「可放」未用「例如」 | 改為 「氣沖沖地」用副詞 irately，位置例如動詞前（irately pushed）、句尾（…to the waiter irately）等（原 「氣沖沖地」用副詞 irately，可放動詞前或句尾） |
| c1-u39-l08-q16 | `items/15/rubricZh` | 第②關＋第③關 2-D：要點限定受詞是 me，被動寫法會被判錯 | 改為 ["exhilarate 表示「使興奮」，例如 活動＋exhilarates me，或被動 I am exhilarated by＋活動 等","時態配合內容（例如 exhilarates、exhilarated）","說的是讓自己興奮的活動（例如 …exhilarates me、I am exhilarated by…）"]（原 ["exhilarate 是及物動詞，表示「使興奮」，主詞是活動、受詞是人（例如 …exhilarates me）","說的是平常的感受，時態配合內容（例如 exhilarates、exhilarated）","受詞是自己（me）"]） |
| c1-u39-l08-q13 | `items/12/stemEn` | 執行長裁示修正（3-C 第 17 條：同單元不同課不重複同一情境）：②員工無視經理指示重複（u39-l02 卡保留），改成志工與主辦人 | 改為 The volunteer ____ ignored the organizer's instructions and opened the gates an hour early.（原 The employee ____ refused to follow his manager's clear orders.） |
| c1-u39-l08-q13 | `items/12/stemZh` | 執行長裁示修正（3-C 第 17 條：同單元不同課不重複同一情境）：中譯同步 | 改為 那名志工不服從主辦人的指示，提早一小時就把大門打開。（原 那名員工不服從地拒絕執行經理明確的命令。） |
| c1-u39-l08-q05 | `items/4/exampleEn` | 執行長裁示修正（3-C 第 17 條：同單元不同課不重複同一情境）：同一原則自查：本卡（球員頂撞教練）與 u39-l06 卡（不服從的球員被排除出賽）同為球員違抗教練，改成演員與導演 | 改為 The young actor behaved insubordinately toward the director and was replaced.（原 The player argued insubordinately with the coach during practice.） |
| c1-u39-l08-q05 | `items/4/exampleZh` | 執行長裁示修正（3-C 第 17 條：同單元不同課不重複同一情境）：中譯同步 | 改為 那位年輕演員對導演態度不服從，結果被換掉了。（原 那名球員在練習時不服從地跟教練頂嘴。） |
| c1-u39-l08-q14 | `items/13/passageEn` | 執行長最終複審修正：第 3 條：閱讀與 raunchily 卡同為表演露骨、不適合家庭觀眾，句型相同 | 改為 Working at a hotel front desk can be stressful. Last Friday, a guest complained irately that his room key did not work. A young colleague answered insensitively, saying it was probably the guest's own fault, which made things worse. When the manager told him to apologize, he responded insubordinately and walked away. Lin, the shift leader, kept her poise. She fixed the key, offered a free breakfast and asked the guest to sign a short form, which he did compliantly. Later, a sign that had been fixed insecurely to the wall fell down in the lobby, and at the bar a singer was dressed rather raunchily, and a few older guests complained to Lin. Still, the challenge of solving one problem after another exhilarated Lin.（原 Working at a hotel front desk can be stressful. Last Friday, a guest complained irately that his room key did not work. A young colleague answered insensitively, saying it was probably the guest's own fault, which made things worse. When the manager told him to apologize, he responded insubordinately and walked away. Lin, the shift leader, kept her poise. She fixed the key, offered a free breakfast and asked the guest to sign a short form, which he did compliantly. Later, a sign that had been fixed insecurely to the wall fell down in the lobby, and at the bar a band sang rather raunchily, so some parents took their children to eat elsewhere. Still, the challenge of solving one problem after another exhilarated Lin.） |
| c1-u39-l08-q14 | `items/13/passageZh` | 執行長最終複審修正：中譯同步 | 改為 在飯店櫃台工作可能壓力很大。上星期五，一位客人氣沖沖地抱怨房卡不能用。一位年輕同事很不體貼地回答說，大概是客人自己的錯，結果讓情況更糟。經理叫他道歉時，他不服從地頂了回去，然後走開。值班主管 Lin 保持鎮定。她修好房卡，送客人一份免費早餐，再請客人簽一張簡短的表格，客人也照做了。後來，大廳裡一塊沒釘牢的告示牌從牆上掉了下來；酒吧的駐唱歌手穿得有點露骨，幾位年長的客人向 Lin 抱怨。儘管如此，一個接一個解決問題的挑戰，還是讓 Lin 感到興奮。（原 在飯店櫃台工作可能壓力很大。上星期五，一位客人氣沖沖地抱怨房卡不能用。一位年輕同事很不體貼地回答說，大概是客人自己的錯，結果讓情況更糟。經理叫他道歉時，他不服從地頂了回去，然後走開。值班主管 Lin 保持鎮定。她修好房卡，送客人一份免費早餐，再請客人簽一張簡短的表格，客人也照做了。後來，大廳裡一塊沒釘牢的告示牌從牆上掉了下來；酒吧裡的樂團唱得有點露骨，有些家長就帶孩子到別處用餐。儘管如此，一個接一個解決問題的挑戰，還是讓 Lin 感到興奮。） |
| c1-u39-l08-q05 | `items/4/exampleEn` | 執行長最終複審修正：第 4 條：卡片與 u39-l02 閱讀同為片場的人違抗導演而被撤換（同單元不同課不重複同一情境） | 改為 The trainee chef behaved insubordinately toward the head chef and was moved to washing dishes.（原 The young actor behaved insubordinately toward the director and was replaced.） |
| c1-u39-l08-q05 | `items/4/exampleZh` | 執行長最終複審修正：中譯同步 | 改為 那名實習廚師對主廚態度不服從，被調去洗碗。（原 那位年輕演員對導演態度不服從，結果被換掉了。） |
| c1-u39-l09-q03 | `items/2/exampleEn` | 第③關 3-C#15：卡片像心理保健建議，改中性事實句 | 改為 Losing the job hurt his sense of self-worth.（原 Your self-worth should not depend on what strangers say online.） |
| c1-u39-l09-q03 | `items/2/exampleZh` | 中譯同步 | 改為 失去那份工作，打擊了他的自我價值感。（原 你的自我價值不應該取決於陌生人在網路上說什麼。） |
| c1-u39-l09-q11 | `items/10/sentenceEn` | 第③關 3-C#15：跟讀像心理保健宣稱，改中性事實句 | 改為 The coach worked hard to build up the players' self-worth.（原 Helping others can give you a stronger sense of self-worth.） |
| c1-u39-l09-q11 | `items/10/sentenceZh` | 中譯同步 | 改為 教練很努力地幫球員建立自我價值感。（原 幫助別人可以讓你更有自我價值感。） |
| c1-u39-l09-q01 | `items/0/exampleEn` | 第③關 3-A#9：卡片與聽選音檔同主詞 he、同為看自己闖的禍（聽選音檔算情境句） | 改為 Years later, she spoke remorsefully about the friends she had lost touch with.（原 He looked remorsefully at the mess he had made in the kitchen.） |
| c1-u39-l09-q01 | `items/0/exampleZh` | 中譯同步 | 改為 多年後，她懊悔地談起那些失去聯絡的朋友。（原 他懊悔地看著自己在廚房弄出的一團亂。） |
| c1-u39-l09-q13 | `items/12/stemEn` | 第③關 2-A：mcq 與 withdrawn 卡同主詞（the boy）同句型 | 改為 Shy and ____, the new employee ate lunch alone at her desk every day.（原 Since moving to the city, the boy has become quiet and ____.） |
| c1-u39-l09-q13 | `items/12/stemZh` | 中譯同步 | 改為 那位新員工害羞又孤僻退縮，每天都一個人在座位上吃午餐。（原 搬到城市之後，那個男孩變得安靜又退縮。） |
| c1-u39-l09-q13 | `items/12/options` | 只看英文自查：干擾項放進英文句子也說得通（quiet and insubordinate 並不矛盾） | 改為 ["unconvincing","withdrawn","fiendish","self-worth"]（原 ["unconvincing","withdrawn","insubordinate","self-worth"]） |
| c1-u39-l09-q13 | `items/12/optionGlossZh` | 選項釋義同步 | 改為 ["沒有說服力的","孤僻退縮的","極難的","自我價值感"]（原 ["沒有說服力的","孤僻退縮的","不服從的","自我價值感"]） |
| c1-u39-l09-q13 | `items/12/options` | 第②關：疑似一眼排除（干擾項詞性與其他選項不同） | 改為 ["unconvincing","withdrawn","fiendish","gruelling"]（原 ["unconvincing","withdrawn","fiendish","self-worth"]） |
| c1-u39-l09-q13 | `items/12/optionGlossZh` | 選項釋義同步 | 改為 ["沒有說服力的","孤僻退縮的","極難的","累人的"]（原 ["沒有說服力的","孤僻退縮的","極難的","自我價值感"]） |
| c1-u39-l09-q14 | `items/13/passageZh` | 第②關＋第③關 3-D：「難得」容易誤讀 | 改為 Ella 十四歲轉到新學校時，變得很退縮，上課很少說話。她很在意自己的口音，也缺乏安全感，擔心別人會笑她。她的音樂老師 Kato 老師注意到了，邀她加入合唱團。一開始她唱得很小聲，沒人聽得到，但 Kato 老師始終堅定地支持她，告訴她她的聲音很重要。慢慢地，她的自我價值感增加了。春季演唱會前，她被分配到第一段獨唱，這份差事難度高，一點也不令人羨慕，練習的那幾週過得壓力重重。演出當晚，一位曾經取笑過她的同學在表演後走過來，懊悔地向她道歉。（原 Ella 十四歲轉到新學校時，變得很退縮，上課很少說話。她很在意自己的口音，也缺乏安全感，擔心別人會笑她。她的音樂老師 Kato 老師注意到了，邀她加入合唱團。一開始她唱得很小聲，沒人聽得到，但 Kato 老師始終堅定地支持她，告訴她她的聲音很重要。慢慢地，她的自我價值感增加了。春季演唱會前，她被分配到第一段獨唱，這份工作難得讓人一點都不羨慕，練習的那幾週過得壓力重重。演出當晚，一位曾經取笑過她的同學在表演後走過來，懊悔地向她道歉。） |
| c1-u39-l09-q15 | `items/14/rubricZh/0` | 第③關 2-E：評分要點「可放」未用「例如」 | 改為 「懊悔地」用副詞 remorsefully，位置例如 admitted 前、admitted 後、句尾 等（原 「懊悔地」用副詞 remorsefully，可放 admitted 前或後） |
| c1-u39-l09-q16 | `items/15/rubricZh/0` | 第③關 2-E：評分要點「常接」未用「例如」（最終複審更正：先前誤貼 q15 的 remorsefully 要點，已改回 self-conscious 要點） | 改為 self-conscious 是形容詞，例如 feel／be self-conscious、self-conscious about… 等（原 self-conscious 是形容詞，常接在 feel、get、be 之後（也可加 about＋事物）） |
