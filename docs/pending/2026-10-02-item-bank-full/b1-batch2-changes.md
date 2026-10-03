# TASK-9 B1 第 2 批（b1-u08～u15）第②③關修正＋全級裁示修正對照表

> 來源：t9/b1b2-gate2-a.json、b1b2-gate2-b.json（第②關 41 條）、b1b2-gate3-a.md、b1b2-gate3-b.md（第③關 FIX 34 條＋疑似 20 條＋建議）、裁示 b1b2-rulings.md、longest-rule.md 與執行長更正（挑最長的期望命中率）。
> 每處修改都記在該課 `judge.resolvedAfterFinalReview`（說明開頭「執行長 b1b2 裁示修正：」），本表由題目檔產生，共 561 個欄位改動＋1 筆不改。第 1 批（u02～u07）只因全級裁示（評分要點封閉清單、正解長度偏差）而改動，也列在本表。
> 判題：第②關盲答 240 題位以「選項文字」對應現行索引寫入（commit 4216221），全部與正解一致、0 多解。修正時正解位置不動，換掉的干擾項以文字重對應 verdicts。
> 依類別的欄位數：正解長度偏差（全級） 305、評分要點封閉清單（全級） 52、第③關 FIX 39、第②關 67、第③關疑似 19、連動／其他 38、情境對照表重做 31、第③關建議 11。

## 改動明細（課｜位置｜原因｜改前｜改後）

| 課 | 位置 | 原因 | 改前 | 改後 |
|---|---|---|---|---|
| b1-u02-l01 | `items/15/questions/1/options/0` | 執行長裁示（正解最長偏差）：正解不可是唯一最長選項——縮短正解或補足干擾項細節，不改正解意思、不讓干擾項成立 | "去台北旅行一星期" | "去台北旅行一個星期" |
| b1-u02-l01 | `items/15/questions/1/options/1` | 執行長裁示（正解最長偏差）：正解不可是唯一最長選項——縮短正解或補足干擾項細節，不改正解意思、不讓干擾項成立 | "拿到一筆獎金" | "換到別家公司去上班" |
| b1-u02-l01 | `items/15/questions/1/options/2` | 執行長裁示（正解最長偏差）：正解不可是唯一最長選項——縮短正解或補足干擾項細節，不改正解意思、不讓干擾項成立 | "換到別家公司上班" | "拿到一筆獎金" |
| b1-u02-l01 | `items/15/questions/1/options/3` | 執行長裁示（正解最長偏差）：正解不可是唯一最長選項——縮短正解或補足干擾項細節，不改正解意思、不讓干擾項成立 | "永久搬到台北的總公司" | "永久調到台北總公司" |
| b1-u02-l01 | `items/16/rubricZh/2` | 執行長裁示（b1b2）：評分要點封閉清單——「可寫 A 或 B」「常用 X」一律改成「例如…等」，全級腳本掃描修正 | "lately 可放句首或句尾" | "lately 可放在句首、句尾等位置" |
| b1-u02-l02 | `items/14/questions/0/options/0` | 執行長裁示（正解最長偏差）：正解不可是唯一最長選項——縮短正解或補足干擾項細節，不改正解意思、不讓干擾項成立 | "經理請假在家休息" | "經理請了假在家休息" |
| b1-u02-l02 | `items/14/questions/0/options/3` | 執行長裁示（正解最長偏差）：正解不可是唯一最長選項——縮短正解或補足干擾項細節，不改正解意思、不讓干擾項成立 | "同事們都去旅行了" | "同事們全都去旅行了" |
| b1-u02-l02 | `items/14/questions/1/options/0` | 執行長裁示（正解最長偏差）：正解不可是唯一最長選項——縮短正解或補足干擾項細節，不改正解意思、不讓干擾項成立 | "請經理教他" | "請經理一步一步教他" |
| b1-u02-l02 | `items/14/questions/1/options/1` | 執行長裁示（正解最長偏差）：正解不可是唯一最長選項——縮短正解或補足干擾項細節，不改正解意思、不讓干擾項成立 | "讀上次會議的筆記並在家練習" | "讀上次會議筆記，在家練習" |
| b1-u02-l02 | `items/14/questions/1/options/2` | 執行長裁示（正解最長偏差）：正解不可是唯一最長選項——縮短正解或補足干擾項細節，不改正解意思、不讓干擾項成立 | "和同事一起練習" | "每天和同事一起練習報告" |
| b1-u02-l02 | `items/14/questions/1/options/3` | 執行長裁示（正解最長偏差）：正解不可是唯一最長選項——縮短正解或補足干擾項細節，不改正解意思、不讓干擾項成立 | "上網找別人的報告" | "上網找別人做過的報告來看" |
| b1-u02-l03 | `items/15/rubricZh/0` | 執行長裁示（b1b2）：評分要點封閉清單——「可寫 A 或 B」「常用 X」一律改成「例如…等」，全級腳本掃描修正 | "era 表示「時代」，常說 in that era" | "era 表示「時代」，例如 in that era 等說法" |
| b1-u02-l03 | `items/9/options/0` | 執行長更正（挑最長的期望命中率）：讓正解不落在最長選項集合裡——補足干擾項細節或縮短正解，不改正解意思、不讓干擾項成立 | "She eats at her office." | "She often eats out at restaurants." |
| b1-u02-l03 | `items/9/options/1` | 執行長更正（挑最長的期望命中率）：讓正解不落在最長選項集合裡——補足干擾項細節或縮短正解，不改正解意思、不讓干擾項成立 | "She often eats out." | "She never cooks." |
| b1-u02-l03 | `items/9/options/2` | 執行長更正（挑最長的期望命中率）：讓正解不落在最長選項集合裡——補足干擾項細節或縮短正解，不改正解意思、不讓干擾項成立 | "She never cooks." | "She eats at her office." |
| b1-u02-l04 | `items/14/questions/1/options/0` | 執行長裁示（正解最長偏差）：正解不可是唯一最長選項——縮短正解或補足干擾項細節，不改正解意思、不讓干擾項成立 | "銷售公司的鞋子" | "到各地銷售公司的鞋子" |
| b1-u02-l04 | `items/15/rubricZh/0` | 執行長裁示（b1b2）：評分要點封閉清單——「可寫 A 或 B」「常用 X」一律改成「例如…等」，全級腳本掃描修正 | "initially 表示「起初、一開始」，可放句首或句尾" | "initially 表示「起初、一開始」，可放在句首、句尾等位置" |
| b1-u02-l04 | `items/16/rubricZh/2` | 執行長裁示（b1b2）：評分要點封閉清單——「可寫 A 或 B」「常用 X」一律改成「例如…等」，全級腳本掃描修正 | "可用現在簡單式或現在進行式" | "時態配合內容（例如現在簡單式、現在進行式等）" |
| b1-u02-l05 | `items/9/options/0` | 執行長更正（挑最長的期望命中率）：讓正解不落在最長選項集合裡——補足干擾項細節或縮短正解，不改正解意思、不讓干擾項成立 | "Take a long vacation." | "Start a new job at another company." |
| b1-u02-l05 | `items/9/options/1` | 執行長更正（挑最長的期望命中率）：讓正解不落在最長選項集合裡——補足干擾項細節或縮短正解，不改正解意思、不讓干擾項成立 | "Start a new job." | "Work from home." |
| b1-u02-l05 | `items/9/options/2` | 執行長更正（挑最長的期望命中率）：讓正解不落在最長選項集合裡——補足干擾項細節或縮短正解，不改正解意思、不讓干擾項成立 | "Work from home." | "Take a long vacation." |
| b1-u02-l06 | `items/15/rubricZh/3` | 執行長裁示（b1b2）：評分要點封閉清單——「可寫 A 或 B」「常用 X」一律改成「例如…等」，全級腳本掃描修正 | "every summer 可放句首或句尾" | "every summer 可放在句首、句尾等位置" |
| b1-u02-l07 | `items/16/rubricZh/0` | 執行長裁示（b1b2）：評分要點封閉清單——「可寫 A 或 B」「常用 X」一律改成「例如…等」，全級腳本掃描修正 | "chronological 常用在 in chronological order「按時間順序」" | "chronological 例如 in chronological order「按時間順序」等說法" |
| b1-u02-l07 | `items/9/options/0` | 執行長更正（挑最長的期望命中率）：讓正解不落在最長選項集合裡——補足干擾項細節或縮短正解，不改正解意思、不讓干擾項成立 | "The office moved to a new place." | "The old one was too slow." |
| b1-u02-l07 | `items/9/options/1` | 執行長更正（挑最長的期望命中率）：讓正解不落在最長選項集合裡——補足干擾項細節或縮短正解，不改正解意思、不讓干擾項成立 | "The old one was too slow." | "The office moved to a bigger new place." |
| b1-u03-l01 | `items/14/questions/1/options/1` | 執行長裁示（正解最長偏差）：正解不可是唯一最長選項——縮短正解或補足干擾項細節，不改正解意思、不讓干擾項成立 | "到側門等候並打電話給櫃台" | "到側門打電話給櫃台" |
| b1-u03-l01 | `items/14/questions/1/options/3` | 執行長裁示（正解最長偏差）：正解不可是唯一最長選項——縮短正解或補足干擾項細節，不改正解意思、不讓干擾項成立 | "在大門口等警衛" | "在大門口那裡等警衛" |
| b1-u03-l01 | `items/9/options/0` | 執行長更正（挑最長的期望命中率）：讓正解不落在最長選項集合裡——補足干擾項細節或縮短正解，不改正解意思、不讓干擾項成立 | "Take the elevator down." | "Take the elevator down to the first floor." |
| b1-u03-l01 | `items/9/options/1` | 執行長更正（挑最長的期望命中率）：讓正解不落在最長選項集合裡——補足干擾項細節或縮短正解，不改正解意思、不讓干擾項成立 | "Go to the exit at the end of the hall." | "Use the exit at the end of the hall." |
| b1-u03-l02 | `items/14/questions/0/options/0` | 執行長裁示（正解最長偏差）：正解不可是唯一最長選項——縮短正解或補足干擾項細節，不改正解意思、不讓干擾項成立 | "用當地商店買的東西慢慢布置" | "用當地買的東西慢慢布置" |
| b1-u03-l02 | `items/14/questions/0/options/1` | 執行長裁示（正解最長偏差）：正解不可是唯一最長選項——縮短正解或補足干擾項細節，不改正解意思、不讓干擾項成立 | "從台北搬家具過去" | "請朋友幫他設計" |
| b1-u03-l02 | `items/14/questions/0/options/2` | 執行長裁示（正解最長偏差）：正解不可是唯一最長選項——縮短正解或補足干擾項細節，不改正解意思、不讓干擾項成立 | "請朋友幫他設計" | "從台北搬家具過去" |
| b1-u03-l02 | `items/14/questions/0/options/3` | 執行長裁示（正解最長偏差）：正解不可是唯一最長選項——縮短正解或補足干擾項細節，不改正解意思、不讓干擾項成立 | "屋主已經布置好了" | "屋主早就已經都布置好了" |
| b1-u03-l02 | `items/15/rubricZh/1` | 執行長裁示（b1b2）：評分要點封閉清單——「可寫 A 或 B」「常用 X」一律改成「例如…等」，全級腳本掃描修正 | "to 後面接名詞或動名詞" | "to 後面接名詞、動名詞等" |
| b1-u03-l02 | `items/9/options/0` | 執行長更正（挑最長的期望命中率）：讓正解不落在最長選項集合裡——補足干擾項細節或縮短正解，不改正解意思、不讓干擾項成立 | "Join a new gym." | "Stop going to the gym." |
| b1-u03-l02 | `items/9/options/1` | 執行長更正（挑最長的期望命中率）：讓正解不落在最長選項集合裡——補足干擾項細節或縮短正解，不改正解意思、不讓干擾項成立 | "Stop going to the gym." | "Join a new gym." |
| b1-u03-l02 | `items/9/options/3` | 執行長更正（挑最長的期望命中率）：讓正解不落在最長選項集合裡——補足干擾項細節或縮短正解，不改正解意思、不讓干擾項成立 | "Buy new sports clothes." | "Buy some new sports clothes for the gym." |
| b1-u03-l03 | `items/14/questions/0/options/1` | 執行長裁示（正解最長偏差）：正解不可是唯一最長選項——縮短正解或補足干擾項細節，不改正解意思、不讓干擾項成立 | "鄰居要求他這樣做" | "因為鄰居要求他這樣做" |
| b1-u03-l03 | `items/16/rubricZh/2` | 執行長裁示（b1b2）：評分要點封閉清單——「可寫 A 或 B」「常用 X」一律改成「例如…等」，全級腳本掃描修正 | "可用 to＋原形動詞說明目的" | "例如用 to＋原形動詞說明目的，其他合理寫法也接受" |
| b1-u03-l03 | `items/9/options/3` | 執行長更正（挑最長的期望命中率）：讓正解不落在最長選項集合裡——補足干擾項細節或縮短正解，不改正解意思、不讓干擾項成立 | "To move to a new building." | "To move to a new building next month." |
| b1-u03-l05 | `items/9/options/0` | 執行長更正（挑最長的期望命中率）：讓正解不落在最長選項集合裡——補足干擾項細節或縮短正解，不改正解意思、不讓干擾項成立 | "Use a key card." | "Press the red button." |
| b1-u03-l05 | `items/9/options/1` | 執行長更正（挑最長的期望命中率）：讓正解不落在最長選項集合裡——補足干擾項細節或縮短正解，不改正解意思、不讓干擾項成立 | "Press the red button." | "Use a key card." |
| b1-u03-l05 | `items/9/options/3` | 執行長更正（挑最長的期望命中率）：讓正解不落在最長選項集合裡——補足干擾項細節或縮短正解，不改正解意思、不讓干擾項成立 | "Call the front desk." | "Call the front desk for help." |
| b1-u03-l06 | `items/14/questions/0/options/0` | 執行長裁示（正解最長偏差）：正解不可是唯一最長選項——縮短正解或補足干擾項細節，不改正解意思、不讓干擾項成立 | "開了一家旅行社" | "自己開了一家小旅行社" |
| b1-u03-l06 | `items/14/questions/0/options/1` | 執行長裁示（正解最長偏差）：正解不可是唯一最長選項——縮短正解或補足干擾項細節，不改正解意思、不讓干擾項成立 | "在山區附近的小村子定居" | "在山區附近的村子定居" |
| b1-u03-l06 | `items/14/questions/0/options/2` | 執行長裁示（正解最長偏差）：正解不可是唯一最長選項——縮短正解或補足干擾項細節，不改正解意思、不讓干擾項成立 | "寫了一本關於鳥的書" | "寫了一本和鳥有關的書" |
| b1-u03-l07 | `items/16/rubricZh/0` | 執行長裁示（b1b2）：評分要點封閉清單——「可寫 A 或 B」「常用 X」一律改成「例如…等」，全級腳本掃描修正 | "combine 表示「結合」，常用 combine A and B 或 combine A with B" | "combine 表示「結合」，例如 combine A and B、combine A with B 等說法" |
| b1-u03-l07 | `items/16/rubricZh/1` | 執行長裁示（b1b2）：評分要點封閉清單——「可寫 A 或 B」「常用 X」一律改成「例如…等」，全級腳本掃描修正 | "說的是自己的喜好或習慣（主詞用 I）" | "說的是自己的喜好、習慣等（例如 I、my）" |
| b1-u03-l07 | `items/14/questions/1/options/1` | 執行長更正（挑最長的期望命中率）：讓正解不落在最長選項集合裡——補足干擾項細節或縮短正解，不改正解意思、不讓干擾項成立 | "開了第二家店" | "在別的地方開了第二家店" |
| b1-u03-l08 | `items/14/questions/0/options/0` | 執行長裁示（正解最長偏差）：正解不可是唯一最長選項——縮短正解或補足干擾項細節，不改正解意思、不讓干擾項成立 | "公園附近的房子比較貴" | "城市裡的公園實在是太少了" |
| b1-u03-l08 | `items/14/questions/0/options/1` | 執行長裁示（正解最長偏差）：正解不可是唯一最長選項——縮短正解或補足干擾項細節，不改正解意思、不讓干擾項成立 | "城市裡的公園太少" | "很多人不喜歡騎腳踏車" |
| b1-u03-l08 | `items/14/questions/0/options/2` | 執行長裁示（正解最長偏差）：正解不可是唯一最長選項——縮短正解或補足干擾項細節，不改正解意思、不讓干擾項成立 | "很多人不喜歡騎腳踏車" | "公園附近的房子價格比較貴" |
| b1-u03-l08 | `items/14/questions/0/options/3` | 執行長裁示（正解最長偏差）：正解不可是唯一最長選項——縮短正解或補足干擾項細節，不改正解意思、不讓干擾項成立 | "住在被樹圍繞的公園附近的人壓力比較小" | "住在綠地公園旁的人壓力小" |
| b1-u03-l08 | `items/16/rubricZh/0` | 執行長裁示（b1b2）：評分要點封閉清單——「可寫 A 或 B」「常用 X」一律改成「例如…等」，全級腳本掃描修正 | "adopt 可表示「採用（方法、習慣）」或「收養（動物）」" | "adopt 可表示「採用（方法、習慣）」、「收養（動物）」等意思" |
| b1-u03-l09 | `items/14/questions/0/options/3` | 執行長更正（挑最長的期望命中率）：讓正解不落在最長選項集合裡——補足干擾項細節或縮短正解，不改正解意思、不讓干擾項成立 | "在火車上找到的" | "後來在火車座位上找到的" |
| b1-u03-l10 | `items/14/questions/0/options/0` | 執行長裁示（正解最長偏差）：正解不可是唯一最長選項——縮短正解或補足干擾項細節，不改正解意思、不讓干擾項成立 | "延長營業時間" | "延長整個夜市的營業時間" |
| b1-u03-l10 | `items/14/questions/0/options/1` | 執行長裁示（正解最長偏差）：正解不可是唯一最長選項——縮短正解或補足干擾項細節，不改正解意思、不讓干擾項成立 | "增加賣台日料理組合的攤位" | "增加台日料理組合攤位" |
| b1-u03-l10 | `items/14/questions/0/options/2` | 執行長裁示（正解最長偏差）：正解不可是唯一最長選項——縮短正解或補足干擾項細節，不改正解意思、不讓干擾項成立 | "降低所有價格" | "降低所有攤位的價格" |
| b1-u03-l10 | `items/14/questions/1/options/0` | 執行長裁示（正解最長偏差）：正解不可是唯一最長選項——縮短正解或補足干擾項細節，不改正解意思、不讓干擾項成立 | "雨後石頭地面容易滑倒" | "雨後石頭地很滑" |
| b1-u03-l10 | `items/14/questions/1/options/1` | 執行長裁示（正解最長偏差）：正解不可是唯一最長選項——縮短正解或補足干擾項細節，不改正解意思、不讓干擾項成立 | "晚上人多容易走散" | "晚上人很多容易走散" |
| b1-u03-l10 | `items/14/questions/1/options/2` | 執行長裁示（正解最長偏差）：正解不可是唯一最長選項——縮短正解或補足干擾項細節，不改正解意思、不讓干擾項成立 | "攤位只收現金" | "每個攤位都只收現金" |
| b1-u03-l10 | `items/15/rubricZh/0` | 執行長裁示（b1b2）：評分要點封閉清單——「可寫 A 或 B」「常用 X」一律改成「例如…等」，全級腳本掃描修正 | "rely on＋人或事物，表示「依賴」，on 不可少" | "rely on＋人、事物等，表示「依賴」，on 不可少" |
| b1-u03-l10 | `items/9/options/0` | 執行長更正（挑最長的期望命中率）：讓正解不落在最長選項集合裡——補足干擾項細節或縮短正解，不改正解意思、不讓干擾項成立 | "Fell off a bike." | "Missed the bus." |
| b1-u03-l10 | `items/9/options/1` | 執行長更正（挑最長的期望命中率）：讓正解不落在最長選項集合裡——補足干擾項細節或縮短正解，不改正解意思、不讓干擾項成立 | "Missed the bus." | "Lost a key." |
| b1-u03-l10 | `items/9/options/2` | 執行長更正（挑最長的期望命中率）：讓正解不落在最長選項集合裡——補足干擾項細節或縮短正解，不改正解意思、不讓干擾項成立 | "Lost a key." | "Fell off a bike on the road." |
| b1-u04-l01 | `items/15/questions/1/options/0` | 執行長裁示（正解最長偏差）：正解不可是唯一最長選項——縮短正解或補足干擾項細節，不改正解意思、不讓干擾項成立 | "他打算把店賣掉" | "他打算要把店賣掉" |
| b1-u04-l01 | `items/15/questions/1/options/2` | 執行長裁示（正解最長偏差）：正解不可是唯一最長選項——縮短正解或補足干擾項細節，不改正解意思、不讓干擾項成立 | "他很明顯熱愛自己的工作" | "他熱愛自己的工作" |
| b1-u04-l01 | `items/10/options/0` | 執行長更正（挑最長的期望命中率）：讓正解不落在最長選項集合裡——補足干擾項細節或縮短正解，不改正解意思、不讓干擾項成立 | "The boss was away." | "It was a holiday." |
| b1-u04-l01 | `items/10/options/1` | 執行長更正（挑最長的期望命中率）：讓正解不落在最長選項集合裡——補足干擾項細節或縮短正解，不改正解意思、不讓干擾項成立 | "It was a holiday." | "The boss was away." |
| b1-u04-l01 | `items/10/options/3` | 執行長更正（挑最長的期望命中率）：讓正解不落在最長選項集合裡——補足干擾項細節或縮短正解，不改正解意思、不讓干擾項成立 | "It rained heavily." | "It rained heavily all morning." |
| b1-u04-l02 | `items/17/rubricZh/2` | 執行長裁示（b1b2）：評分要點封閉清單——「可寫 A 或 B」「常用 X」一律改成「例如…等」，全級腳本掃描修正 | "說的是自己的習慣或喜好（主詞用 I）" | "說的是自己的習慣、喜好等（例如 I、my）" |
| b1-u04-l02 | `items/15/questions/1/options/2` | 執行長更正（挑最長的期望命中率）：讓正解不落在最長選項集合裡——補足干擾項細節或縮短正解，不改正解意思、不讓干擾項成立 | "兩支都沒買" | "兩支手錶都一起買了" |
| b1-u04-l02 | `items/15/questions/1/options/3` | 執行長更正（挑最長的期望命中率）：讓正解不落在最長選項集合裡——補足干擾項細節或縮短正解，不改正解意思、不讓干擾項成立 | "兩支都買了" | "兩支都沒買" |
| b1-u04-l03 | `items/15/questions/1/options/0` | 執行長裁示（正解最長偏差）：正解不可是唯一最長選項——縮短正解或補足干擾項細節，不改正解意思、不讓干擾項成立 | "來訪的人只問拐彎抹角的問題" | "來訪的人問題都拐彎抹角" |
| b1-u04-l03 | `items/15/questions/1/options/1` | 執行長裁示（正解最長偏差）：正解不可是唯一最長選項——縮短正解或補足干擾項細節，不改正解意思、不讓干擾項成立 | "老闆生氣了" | "房間還沒打掃完" |
| b1-u04-l03 | `items/15/questions/1/options/2` | 執行長裁示（正解最長偏差）：正解不可是唯一最長選項——縮短正解或補足干擾項細節，不改正解意思、不讓干擾項成立 | "房間還沒打掃完" | "老闆生氣了" |
| b1-u04-l03 | `items/15/questions/1/options/3` | 執行長裁示（正解最長偏差）：正解不可是唯一最長選項——縮短正解或補足干擾項細節，不改正解意思、不讓干擾項成立 | "來訪的人遲到了" | "來訪的人比預定時間晚到" |
| b1-u04-l03 | `items/10/options/2` | 執行長更正（挑最長的期望命中率）：讓正解不落在最長選項集合裡——補足干擾項細節或縮短正解，不改正解意思、不讓干擾項成立 | "A friend's party." | "A friend's birthday party." |
| b1-u04-l04 | `items/14/questions/1/options/0` | 執行長裁示（正解最長偏差）：正解不可是唯一最長選項——縮短正解或補足干擾項細節，不改正解意思、不讓干擾項成立 | "很多人加入會員" | "很多人加入付費會員" |
| b1-u04-l04 | `items/14/questions/1/options/1` | 執行長裁示（正解最長偏差）：正解不可是唯一最長選項——縮短正解或補足干擾項細節，不改正解意思、不讓干擾項成立 | "有公司贊助" | "有一家大公司贊助" |
| b1-u04-l04 | `items/14/questions/1/options/2` | 執行長裁示（正解最長偏差）：正解不可是唯一最長選項——縮短正解或補足干擾項細節，不改正解意思、不讓干擾項成立 | "鎮公所負擔大部分費用" | "鎮公所出大部分的錢" |
| b1-u04-l04 | `items/14/questions/0/options/0` | 執行長更正（挑最長的期望命中率）：讓正解不落在最長選項集合裡——補足干擾項細節或縮短正解，不改正解意思、不讓干擾項成立 | "職業運動員" | "年輕的職業運動員" |
| b1-u04-l04 | `items/14/questions/0/options/1` | 執行長更正（挑最長的期望命中率）：讓正解不落在最長選項集合裡——補足干擾項細節或縮短正解，不改正解意思、不讓干擾項成立 | "大學生" | "上班族" |
| b1-u04-l04 | `items/14/questions/0/options/2` | 執行長更正（挑最長的期望命中率）：讓正解不落在最長選項集合裡——補足干擾項細節或縮短正解，不改正解意思、不讓干擾項成立 | "上班族" | "大學生" |
| b1-u04-l05 | `items/14/questions/1/options/1` | 執行長裁示（正解最長偏差）：正解不可是唯一最長選項——縮短正解或補足干擾項細節，不改正解意思、不讓干擾項成立 | "都是用機器做的" | "每個包包都是用機器做的" |
| b1-u04-l05 | `items/14/questions/0/options/0` | 執行長更正（挑最長的期望命中率）：讓正解不落在最長選項集合裡——補足干擾項細節或縮短正解，不改正解意思、不讓干擾項成立 | "價格很便宜" | "價格比別家便宜很多" |
| b1-u04-l06 | `items/14/questions/1/options/1` | 執行長裁示（正解最長偏差）：正解不可是唯一最長選項——縮短正解或補足干擾項細節，不改正解意思、不讓干擾項成立 | "考試成績變高了" | "大家的考試成績都變高了" |
| b1-u04-l06 | `items/15/rubricZh/2` | 執行長裁示（b1b2）：評分要點封閉清單——「可寫 A 或 B」「常用 X」一律改成「例如…等」，全級腳本掃描修正 | "可用 but 連接兩句" | "例如用 but 連接兩句，其他合理寫法也接受" |
| b1-u04-l06 | `items/14/questions/0/options/0` | 執行長更正（挑最長的期望命中率）：讓正解不落在最長選項集合裡——補足干擾項細節或縮短正解，不改正解意思、不讓干擾項成立 | "每天讀一本書" | "每天在家讀一本英文書" |
| b1-u04-l07 | `items/14/questions/0/options/0` | 執行長裁示（正解最長偏差）：正解不可是唯一最長選項——縮短正解或補足干擾項細節，不改正解意思、不讓干擾項成立 | "是全國最大的車站" | "是全國規模最大的車站" |
| b1-u04-l07 | `items/14/questions/0/options/1` | 執行長裁示（正解最長偏差）：正解不可是唯一最長選項——縮短正解或補足干擾項細節，不改正解意思、不讓干擾項成立 | "是這一帶唯一用紅色石頭蓋的車站" | "是這帶唯一的紅石車站" |
| b1-u04-l07 | `items/14/questions/0/options/3` | 執行長裁示（正解最長偏差）：正解不可是唯一最長選項——縮短正解或補足干擾項細節，不改正解意思、不讓干擾項成立 | "是用玻璃蓋的" | "整棟都是用玻璃蓋的" |
| b1-u04-l07 | `items/16/rubricZh/0` | 執行長裁示（b1b2）：評分要點封閉清單——「可寫 A 或 B」「常用 X」一律改成「例如…等」，全級腳本掃描修正 | "unique 表示「獨特的」，可放在名詞前或 be 動詞後" | "unique 表示「獨特的」，例如放在名詞前、be 動詞後等" |
| b1-u04-l07 | `items/16/rubricZh/2` | 執行長裁示（b1b2）：評分要點封閉清單——「可寫 A 或 B」「常用 X」一律改成「例如…等」，全級腳本掃描修正 | "句子要介紹一樣東西或地方" | "句子要介紹一樣東西、一個地方等" |
| b1-u04-l07 | `items/14/questions/1/options/3` | 執行長更正（挑最長的期望命中率）：讓正解不落在最長選項集合裡——補足干擾項細節或縮短正解，不改正解意思、不讓干擾項成立 | "改成停車場" | "拆掉改成停車場" |
| b1-u04-l08 | `items/14/questions/1/options/1` | 執行長裁示（正解最長偏差）：正解不可是唯一最長選項——縮短正解或補足干擾項細節，不改正解意思、不讓干擾項成立 | "少數熱愛大自然的朋友" | "幾個愛大自然的朋友" |
| b1-u04-l08 | `items/14/questions/1/options/3` | 執行長裁示（正解最長偏差）：正解不可是唯一最長選項——縮短正解或補足干擾項細節，不改正解意思、不讓干擾項成立 | "公司同事" | "公司裡比較熟的同事" |
| b1-u04-l08 | `items/14/questions/0/options/1` | 執行長更正（挑最長的期望命中率）：讓正解不落在最長選項集合裡——補足干擾項細節或縮短正解，不改正解意思、不讓干擾項成立 | "和朋友野餐" | "和朋友在草地上野餐" |
| b1-u04-l09 | `items/14/questions/0/options/0` | 執行長裁示（正解最長偏差）：正解不可是唯一最長選項——縮短正解或補足干擾項細節，不改正解意思、不讓干擾項成立 | "只用一種水果" | "整個蛋糕只用一種水果" |
| b1-u04-l09 | `items/14/questions/0/options/1` | 執行長裁示（正解最長偏差）：正解不可是唯一最長選項——縮短正解或補足干擾項細節，不改正解意思、不讓干擾項成立 | "不含奶油" | "又大又重" |
| b1-u04-l09 | `items/14/questions/0/options/2` | 執行長裁示（正解最長偏差）：正解不可是唯一最長選項——縮短正解或補足干擾項細節，不改正解意思、不讓干擾項成立 | "又大又重" | "不含奶油" |
| b1-u04-l09 | `items/15/rubricZh/0` | 執行長裁示（b1b2）：評分要點封閉清單——「可寫 A 或 B」「常用 X」一律改成「例如…等」，全級腳本掃描修正 | "typically 表示「通常」，可放在一般動詞前或句首" | "typically 表示「通常」，例如放在一般動詞前、句首等位置" |
| b1-u05-l01 | `items/14/questions/1/options/1` | 執行長裁示（正解最長偏差）：正解不可是唯一最長選項——縮短正解或補足干擾項細節，不改正解意思、不讓干擾項成立 | "水費降了一半" | "水費完全沒變" |
| b1-u05-l01 | `items/14/questions/1/options/2` | 執行長裁示（正解最長偏差）：正解不可是唯一最長選項——縮短正解或補足干擾項細節，不改正解意思、不讓干擾項成立 | "水費完全沒變" | "水費降了一半" |
| b1-u05-l01 | `items/14/questions/1/options/3` | 執行長裁示（正解最長偏差）：正解不可是唯一最長選項——縮短正解或補足干擾項細節，不改正解意思、不讓干擾項成立 | "他們不再澆花了" | "他們從此不再澆花了" |
| b1-u05-l02 | `items/14/questions/1/options/2` | 執行長更正（挑最長的期望命中率）：讓正解不落在最長選項集合裡——補足干擾項細節或縮短正解，不改正解意思、不讓干擾項成立 | "新辦公室太遠" | "新辦公室離大家家裡太遠" |
| b1-u05-l04 | `items/15/rubricZh/1` | 執行長裁示（b1b2）：評分要點封閉清單——「可寫 A 或 B」「常用 X」一律改成「例如…等」，全級腳本掃描修正 | "entirely 可放在 agree 前或句尾" | "entirely 例如放在 agree 前、句尾等位置" |
| b1-u05-l05 | `items/14/questions/0/options/1` | 執行長裁示（正解最長偏差）：正解不可是唯一最長選項——縮短正解或補足干擾項細節，不改正解意思、不讓干擾項成立 | "新開的飯店" | "一家新開的大飯店" |
| b1-u05-l05 | `items/14/questions/0/options/2` | 執行長裁示（正解最長偏差）：正解不可是唯一最長選項——縮短正解或補足干擾項細節，不改正解意思、不讓干擾項成立 | "一部有名的電影在那裡拍攝" | "有名電影在那裡拍攝" |
| b1-u05-l05 | `items/14/questions/0/options/3` | 執行長裁示（正解最長偏差）：正解不可是唯一最長選項——縮短正解或補足干擾項細節，不改正解意思、不讓干擾項成立 | "一位名人寫的書" | "一位名人寫的一本書" |
| b1-u05-l05 | `items/16/rubricZh/1` | 執行長裁示（b1b2）：評分要點封閉清單——「可寫 A 或 B」「常用 X」一律改成「例如…等」，全級腳本掃描修正 | "可以寫人或建築" | "可以寫人、建築等" |
| b1-u05-l05 | `items/9/options/0` | 執行長更正（挑最長的期望命中率）：讓正解不落在最長選項集合裡——補足干擾項細節或縮短正解，不改正解意思、不讓干擾項成立 | "The shop is closing soon." | "The shop is very small." |
| b1-u05-l05 | `items/9/options/1` | 執行長更正（挑最長的期望命中率）：讓正解不落在最長選項集合裡——補足干擾項細節或縮短正解，不改正解意思、不讓干擾項成立 | "The shop is very small." | "The shop is closing soon." |
| b1-u05-l05 | `items/9/options/3` | 執行長更正（挑最長的期望命中率）：讓正解不落在最長選項集合裡——補足干擾項細節或縮短正解，不改正解意思、不讓干擾項成立 | "The shop is far from town." | "The shop is far from the town center." |
| b1-u05-l06 | `items/14/questions/1/options/1` | 執行長更正（挑最長的期望命中率）：讓正解不落在最長選項集合裡——補足干擾項細節或縮短正解，不改正解意思、不讓干擾項成立 | "湖水完全乾了" | "湖裡的水一下子完全乾了" |
| b1-u05-l07 | `items/13/questions/0/options/1` | 執行長裁示（正解最長偏差）：正解不可是唯一最長選項——縮短正解或補足干擾項細節，不改正解意思、不讓干擾項成立 | "很大比例的工作是一個五人小組完成的" | "很多工作是五人小組做的" |
| b1-u05-l07 | `items/13/questions/0/options/3` | 執行長裁示（正解最長偏差）：正解不可是唯一最長選項——縮短正解或補足干擾項細節，不改正解意思、不讓干擾項成立 | "每個團隊人數都太少" | "每個團隊的人數都實在太少" |
| b1-u05-l07 | `items/13/questions/1/options/1` | 執行長裁示（正解最長偏差）：正解不可是唯一最長選項——縮短正解或補足干擾項細節，不改正解意思、不讓干擾項成立 | "一趟出國旅遊" | "一個長假" |
| b1-u05-l07 | `items/13/questions/1/options/2` | 執行長裁示（正解最長偏差）：正解不可是唯一最長選項——縮短正解或補足干擾項細節，不改正解意思、不讓干擾項成立 | "一間新辦公室" | "一趟免費的出國旅遊" |
| b1-u05-l07 | `items/13/questions/1/options/3` | 執行長裁示（正解最長偏差）：正解不可是唯一最長選項——縮短正解或補足干擾項細節，不改正解意思、不讓干擾項成立 | "一個長假" | "一間新辦公室" |
| b1-u05-l07 | `items/14/rubricZh/1` | 執行長裁示（b1b2）：評分要點封閉清單——「可寫 A 或 B」「常用 X」一律改成「例如…等」，全級腳本掃描修正 | "可用 to＋原形動詞或 for＋名詞說明用途" | "例如用 to＋原形動詞、for＋名詞等說明用途" |
| b1-u05-l08 | `items/13/questions/1/options/0` | 執行長裁示（正解最長偏差）：正解不可是唯一最長選項——縮短正解或補足干擾項細節，不改正解意思、不讓干擾項成立 | "因為天冷，客人變少了" | "天冷，客人變少了" |
| b1-u05-l08 | `items/13/questions/1/options/1` | 執行長裁示（正解最長偏差）：正解不可是唯一最長選項——縮短正解或補足干擾項細節，不改正解意思、不讓干擾項成立 | "店面擴大了" | "因為咖啡豆漲價了" |
| b1-u05-l08 | `items/13/questions/1/options/2` | 執行長裁示（正解最長偏差）：正解不可是唯一最長選項——縮短正解或補足干擾項細節，不改正解意思、不讓干擾項成立 | "老客人都不來了" | "店面擴大了" |
| b1-u05-l08 | `items/13/questions/1/options/3` | 執行長裁示（正解最長偏差）：正解不可是唯一最長選項——縮短正解或補足干擾項細節，不改正解意思、不讓干擾項成立 | "咖啡豆漲價了" | "老客人都不來了" |
| b1-u05-l08 | `items/8/options/0` | 執行長更正（挑最長的期望命中率）：讓正解不落在最長選項集合裡——補足干擾項細節或縮短正解，不改正解意思、不讓干擾項成立 | "The boss left." | "Sales went up." |
| b1-u05-l08 | `items/8/options/1` | 執行長更正（挑最長的期望命中率）：讓正解不落在最長選項集合裡——補足干擾項細節或縮短正解，不改正解意思、不讓干擾項成立 | "Sales went up." | "The boss left the shop." |
| b1-u05-l08 | `items/13/questions/0/options/2` | 執行長更正（挑最長的期望命中率）：讓正解不落在最長選項集合裡——補足干擾項細節或縮短正解，不改正解意思、不讓干擾項成立 | "每天換新口味" | "每天都換新的口味" |
| b1-u05-l09 | `items/13/questions/1/options/0` | 執行長裁示（正解最長偏差）：正解不可是唯一最長選項——縮短正解或補足干擾項細節，不改正解意思、不讓干擾項成立 | "把柳丁做成果汁" | "把柳丁全部做成果汁" |
| b1-u05-l09 | `items/13/questions/1/options/2` | 執行長裁示（正解最長偏差）：正解不可是唯一最長選項——縮短正解或補足干擾項細節，不改正解意思、不讓干擾項成立 | "上課學習直接賣給顧客" | "上課學直接賣給顧客" |
| b1-u05-l09 | `items/13/questions/1/options/3` | 執行長裁示（正解最長偏差）：正解不可是唯一最長選項——縮短正解或補足干擾項細節，不改正解意思、不讓干擾項成立 | "減少種植的面積" | "減少柳丁種植的面積" |
| b1-u05-l09 | `items/14/rubricZh/0` | 執行長裁示（b1b2）：評分要點封閉清單——「可寫 A 或 B」「常用 X」一律改成「例如…等」，全級腳本掃描修正 | "terribly 在這裡表示「非常」，常用 terribly sorry" | "terribly 在這裡表示「非常」，例如 terribly sorry 等說法" |
| b1-u05-l09 | `items/13/questions/0/options/1` | 執行長更正（挑最長的期望命中率）：讓正解不落在最長選項集合裡——補足干擾項細節或縮短正解，不改正解意思、不讓干擾項成立 | "柳丁品質變差" | "柳丁的品質變差了" |
| b1-u05-l10 | `items/14/rubricZh/1` | 執行長裁示（b1b2）：評分要點封閉清單——「可寫 A 或 B」「常用 X」一律改成「例如…等」，全級腳本掃描修正 | "「打八折」是減價百分之二十，可寫 twenty percent off" | "「打八折」是減價百分之二十，可寫，例如 twenty percent off、20% off 等" |
| b1-u06-l01 | `items/15/rubricZh/0` | 執行長裁示（b1b2）：評分要點封閉清單——「可寫 A 或 B」「常用 X」一律改成「例如…等」，全級腳本掃描修正 | "on behalf of＋人或團體，表示「代表⋯」" | "on behalf of＋人、團體等，表示「代表⋯」" |
| b1-u06-l01 | `items/15/rubricZh/1` | 執行長裁示（b1b2）：評分要點封閉清單——「可寫 A 或 B」「常用 X」一律改成「例如…等」，全級腳本掃描修正 | "on behalf of 可放句首或句尾" | "on behalf of 可放在句首、句尾等位置" |
| b1-u06-l01 | `items/16/rubricZh/0` | 執行長裁示（b1b2）：評分要點封閉清單——「可寫 A 或 B」「常用 X」一律改成「例如…等」，全級腳本掃描修正 | "meaningful 表示「有意義的」，可放在名詞前或 be 動詞後" | "meaningful 表示「有意義的」，例如放在名詞前、be 動詞後等" |
| b1-u06-l01 | `items/14/questions/0/options/0` | 執行長更正（挑最長的期望命中率）：讓正解不落在最長選項集合裡——補足干擾項細節或縮短正解，不改正解意思、不讓干擾項成立 | "每個人關注的面向不同" | "大家關注的面向不同" |
| b1-u06-l01 | `items/14/questions/0/options/1` | 執行長更正（挑最長的期望命中率）：讓正解不落在最長選項集合裡——補足干擾項細節或縮短正解，不改正解意思、不讓干擾項成立 | "經理不在場" | "預算根本就不夠大家用" |
| b1-u06-l01 | `items/14/questions/0/options/2` | 執行長更正（挑最長的期望命中率）：讓正解不落在最長選項集合裡——補足干擾項細節或縮短正解，不改正解意思、不讓干擾項成立 | "預算不夠用" | "經理不在場" |
| b1-u06-l02 | `items/14/questions/1/options/1` | 執行長更正（挑最長的期望命中率）：讓正解不落在最長選項集合裡——補足干擾項細節或縮短正解，不改正解意思、不讓干擾項成立 | "找朋友一起合夥" | "找好朋友一起合夥開店" |
| b1-u06-l03 | `items/14/questions/0/options/1` | 執行長裁示（正解最長偏差）：正解不可是唯一最長選項——縮短正解或補足干擾項細節，不改正解意思、不讓干擾項成立 | "興趣不同的人比較合得來" | "年輕人比較會交朋友" |
| b1-u06-l03 | `items/14/questions/0/options/2` | 執行長裁示（正解最長偏差）：正解不可是唯一最長選項——縮短正解或補足干擾項細節，不改正解意思、不讓干擾項成立 | "年輕人比較會交朋友" | "興趣不同的人反而比較合得來" |
| b1-u06-l03 | `items/14/questions/0/options/3` | 執行長裁示（正解最長偏差）：正解不可是唯一最長選項——縮短正解或補足干擾項細節，不改正解意思、不讓干擾項成立 | "人比較容易和興趣相同的人有共鳴" | "人和興趣相同的人較有共鳴" |
| b1-u06-l03 | `items/14/questions/1/options/0` | 執行長裁示（正解最長偏差）：正解不可是唯一最長選項——縮短正解或補足干擾項細節，不改正解意思、不讓干擾項成立 | "證實她的理論完全正確" | "證實她原本的理論完全正確" |
| b1-u06-l03 | `items/14/questions/1/options/2` | 執行長裁示（正解最長偏差）：正解不可是唯一最長選項——縮短正解或補足干擾項細節，不改正解意思、不讓干擾項成立 | "沒那麼簡單，很多人更常回應興趣不同的朋友" | "更常回應興趣不同的人" |
| b1-u06-l03 | `items/14/questions/1/options/3` | 執行長裁示（正解最長偏差）：正解不可是唯一最長選項——縮短正解或補足干擾項細節，不改正解意思、不讓干擾項成立 | "大家都不回訊息" | "大家幾乎都不回朋友的訊息" |
| b1-u06-l03 | `items/16/rubricZh/0` | 執行長裁示（b1b2）：評分要點封閉清單——「可寫 A 或 B」「常用 X」一律改成「例如…等」，全級腳本掃描修正 | "recognize 表示「認出」，後面直接接人或東西" | "recognize 表示「認出」，後面直接接受詞（例如人、東西等）" |
| b1-u06-l04 | `items/9/options/0` | 執行長更正（挑最長的期望命中率）：讓正解不落在最長選項集合裡——補足干擾項細節或縮短正解，不改正解意思、不讓干擾項成立 | "Bad weather." | "Not enough food." |
| b1-u06-l04 | `items/9/options/1` | 執行長更正（挑最長的期望命中率）：讓正解不落在最長選項集合裡——補足干擾項細節或縮短正解，不改正解意思、不讓干擾項成立 | "Not enough food." | "Too many guests came." |
| b1-u06-l04 | `items/9/options/2` | 執行長更正（挑最長的期望命中率）：讓正解不落在最長選項集合裡——補足干擾項細節或縮短正解，不改正解意思、不讓干擾項成立 | "Too many guests." | "Bad weather." |
| b1-u06-l04 | `items/14/questions/0/options/0` | 執行長更正（挑最長的期望命中率）：讓正解不落在最長選項集合裡——補足干擾項細節或縮短正解，不改正解意思、不讓干擾項成立 | "學生人數太少" | "學生人數比去年少了很多" |
| b1-u06-l05 | `items/14/questions/0/options/1` | 執行長更正（挑最長的期望命中率）：讓正解不落在最長選項集合裡——補足干擾項細節或縮短正解，不改正解意思、不讓干擾項成立 | "只在早上營業" | "每天推出新口味" |
| b1-u06-l05 | `items/14/questions/0/options/2` | 執行長更正（挑最長的期望命中率）：讓正解不落在最長選項集合裡——補足干擾項細節或縮短正解，不改正解意思、不讓干擾項成立 | "價格一定要最低" | "只在早上營業" |
| b1-u06-l05 | `items/14/questions/0/options/3` | 執行長更正（挑最長的期望命中率）：讓正解不落在最長選項集合裡——補足干擾項細節或縮短正解，不改正解意思、不讓干擾項成立 | "每天推出新口味" | "價格一定要是最低的" |
| b1-u06-l05 | `items/14/questions/1/options/0` | 執行長更正（挑最長的期望命中率）：讓正解不落在最長選項集合裡——補足干擾項細節或縮短正解，不改正解意思、不讓干擾項成立 | "搬到別的城市" | "準備要把店關掉了" |
| b1-u06-l05 | `items/14/questions/1/options/1` | 執行長更正（挑最長的期望命中率）：讓正解不落在最長選項集合裡——補足干擾項細節或縮短正解，不改正解意思、不讓干擾項成立 | "準備要關門" | "只在網路上賣" |
| b1-u06-l05 | `items/14/questions/1/options/2` | 執行長更正（挑最長的期望命中率）：讓正解不落在最長選項集合裡——補足干擾項細節或縮短正解，不改正解意思、不讓干擾項成立 | "只在網路上賣" | "搬到別的城市" |
| b1-u06-l06 | `items/14/questions/1/options/0` | 執行長裁示（正解最長偏差）：正解不可是唯一最長選項——縮短正解或補足干擾項細節，不改正解意思、不讓干擾項成立 | "下個月起報告都放在網路上" | "下月起報告都放網路上" |
| b1-u06-l06 | `items/14/questions/1/options/1` | 執行長裁示（正解最長偏差）：正解不可是唯一最長選項——縮短正解或補足干擾項細節，不改正解意思、不讓干擾項成立 | "不再使用電腦" | "改買比較便宜的影印紙" |
| b1-u06-l06 | `items/14/questions/1/options/2` | 執行長裁示（正解最長偏差）：正解不可是唯一最長選項——縮短正解或補足干擾項細節，不改正解意思、不讓干擾項成立 | "暫時關閉辦公室" | "不再使用電腦" |
| b1-u06-l06 | `items/14/questions/1/options/3` | 執行長裁示（正解最長偏差）：正解不可是唯一最長選項——縮短正解或補足干擾項細節，不改正解意思、不讓干擾項成立 | "買更便宜的紙" | "暫時關閉整個辦公室" |
| b1-u06-l06 | `items/16/rubricZh/0` | 執行長裁示（b1b2）：評分要點封閉清單——「可寫 A 或 B」「常用 X」一律改成「例如…等」，全級腳本掃描修正 | "aware 常用 be aware of＋名詞，或 be aware that＋子句" | "aware 例如 be aware of＋名詞、be aware that＋子句等說法" |
| b1-u06-l06 | `items/9/options/2` | 執行長更正（挑最長的期望命中率）：讓正解不落在最長選項集合裡——補足干擾項細節或縮短正解，不改正解意思、不讓干擾項成立 | "Call the manager." | "Call the manager about the plan." |
| b1-u06-l06 | `items/14/questions/0/options/1` | 執行長更正（挑最長的期望命中率）：讓正解不落在最長選項集合裡——補足干擾項細節或縮短正解，不改正解意思、不讓干擾項成立 | "換新的印表機" | "換一台更快的新印表機" |
| b1-u06-l07 | `items/14/questions/0/options/3` | 執行長更正（挑最長的期望命中率）：讓正解不落在最長選項集合裡——補足干擾項細節或縮短正解，不改正解意思、不讓干擾項成立 | "一座停車場" | "一座大型停車場" |
| b1-u06-l08 | `items/14/questions/0/options/0` | 執行長裁示（正解最長偏差）：正解不可是唯一最長選項——縮短正解或補足干擾項細節，不改正解意思、不讓干擾項成立 | "公司規定不允許" | "公司的規定不允許這樣" |
| b1-u06-l08 | `items/14/questions/0/options/1` | 執行長裁示（正解最長偏差）：正解不可是唯一最長選項——縮短正解或補足干擾項細節，不改正解意思、不讓干擾項成立 | "其他同事反對" | "Mia 的工作表現不好" |
| b1-u06-l08 | `items/14/questions/0/options/2` | 執行長裁示（正解最長偏差）：正解不可是唯一最長選項——縮短正解或補足干擾項細節，不改正解意思、不讓干擾項成立 | "Mia 的工作表現不好" | "其他同事反對" |
| b1-u06-l08 | `items/14/questions/0/options/3` | 執行長裁示（正解最長偏差）：正解不可是唯一最長選項——縮短正解或補足干擾項細節，不改正解意思、不讓干擾項成立 | "他認為在辦公室上班很重要" | "他認為進辦公室很重要" |
| b1-u06-l08 | `items/15/rubricZh/1` | 執行長裁示（b1b2）：評分要點封閉清單——「可寫 A 或 B」「常用 X」一律改成「例如…等」，全級腳本掃描修正 | "說的是現在的看法，可用現在簡單式或現在完成式" | "說的是現在的看法，時態配合內容（例如現在簡單式、現在完成式等）" |
| b1-u07-l01 | `items/14/questions/0/options/2` | 執行長裁示（正解最長偏差）：正解不可是唯一最長選項——縮短正解或補足干擾項細節，不改正解意思、不讓干擾項成立 | "工作機會不足，年輕人離開" | "工作少，年輕人離開" |
| b1-u07-l01 | `items/14/questions/0/options/3` | 執行長裁示（正解最長偏差）：正解不可是唯一最長選項——縮短正解或補足干擾項細節，不改正解意思、不讓干擾項成立 | "空氣汙染嚴重" | "空氣汙染問題很嚴重" |
| b1-u07-l01 | `items/14/questions/1/options/3` | 執行長更正（挑最長的期望命中率）：讓正解不落在最長選項集合裡——補足干擾項細節或縮短正解，不改正解意思、不讓干擾項成立 | "一年一度的音樂節" | "一年一度的大型音樂節" |
| b1-u07-l02 | `items/14/questions/0/options/0` | 執行長裁示（正解最長偏差）：正解不可是唯一最長選項——縮短正解或補足干擾項細節，不改正解意思、不讓干擾項成立 | "老闆身體不舒服" | "老闆的身體不太舒服" |
| b1-u07-l02 | `items/14/questions/0/options/1` | 執行長裁示（正解最長偏差）：正解不可是唯一最長選項——縮短正解或補足干擾項細節，不改正解意思、不讓干擾項成立 | "房租大幅上漲" | "店面的房租大幅上漲" |
| b1-u07-l02 | `items/14/questions/0/options/2` | 執行長裁示（正解最長偏差）：正解不可是唯一最長選項——縮短正解或補足干擾項細節，不改正解意思、不讓干擾項成立 | "附近開了一家新的連鎖店" | "附近開了新的連鎖店" |
| b1-u07-l02 | `items/14/questions/1/options/0` | 執行長更正（挑最長的期望命中率）：讓正解不落在最長選項集合裡——補足干擾項細節或縮短正解，不改正解意思、不讓干擾項成立 | "延長營業時間" | "把價格降低" |
| b1-u07-l02 | `items/14/questions/1/options/1` | 執行長更正（挑最長的期望命中率）：讓正解不落在最長選項集合裡——補足干擾項細節或縮短正解，不改正解意思、不讓干擾項成立 | "把價格降低" | "搬到人比較多的新地點" |
| b1-u07-l02 | `items/14/questions/1/options/2` | 執行長更正（挑最長的期望命中率）：讓正解不落在最長選項集合裡——補足干擾項細節或縮短正解，不改正解意思、不讓干擾項成立 | "搬到新地點" | "延長營業時間" |
| b1-u07-l02 | `items/14/questions/1/options/3` | 執行長更正（挑最長的期望命中率）：讓正解不落在最長選項集合裡——補足干擾項細節或縮短正解，不改正解意思、不讓干擾項成立 | "每週舉辦免費音樂之夜" | "每週辦免費音樂夜" |
| b1-u07-l03 | `items/14/questions/1/options/0` | 執行長裁示（正解最長偏差）：正解不可是唯一最長選項——縮短正解或補足干擾項細節，不改正解意思、不讓干擾項成立 | "大型商場進駐" | "有大型購物商場進駐" |
| b1-u07-l03 | `items/14/questions/1/options/1` | 執行長裁示（正解最長偏差）：正解不可是唯一最長選項——縮短正解或補足干擾項細節，不改正解意思、不讓干擾項成立 | "年輕人開小咖啡店和藝術小店" | "年輕人開咖啡店和藝術店" |
| b1-u07-l03 | `items/14/questions/1/options/2` | 執行長裁示（正解最長偏差）：正解不可是唯一最長選項——縮短正解或補足干擾項細節，不改正解意思、不讓干擾項成立 | "街道改成停車場" | "老店全部關門" |
| b1-u07-l03 | `items/14/questions/1/options/3` | 執行長裁示（正解最長偏差）：正解不可是唯一最長選項——縮短正解或補足干擾項細節，不改正解意思、不讓干擾項成立 | "老店全部關門" | "整條老街道改建成停車場" |
| b1-u07-l03 | `items/15/rubricZh/0` | 執行長裁示（b1b2）：評分要點封閉清單——「可寫 A 或 B」「常用 X」一律改成「例如…等」，全級腳本掃描修正 | "depression 在這裡指「經濟不景氣」，前面常加 the 或 economic" | "depression 在這裡指「經濟不景氣」，前面例如加 the、economic 等" |
| b1-u07-l03 | `items/9/options/2` | 執行長更正（挑最長的期望命中率）：讓正解不落在最長選項集合裡——補足干擾項細節或縮短正解，不改正解意思、不讓干擾項成立 | "Magazines." | "Paper magazines." |
| b1-u07-l04 | `items/9/options/3` | 執行長更正（挑最長的期望命中率）：讓正解不落在最長選項集合裡——補足干擾項細節或縮短正解，不改正解意思、不讓干擾項成立 | "It is made of glass." | "It is made of glass and wood." |
| b1-u07-l05 | `items/9/options/0` | 執行長更正（挑最長的期望命中率）：讓正解不落在最長選項集合裡——補足干擾項細節或縮短正解，不改正解意思、不讓干擾項成立 | "When a music festival started." | "When a big hotel was built." |
| b1-u07-l05 | `items/9/options/1` | 執行長更正（挑最長的期望命中率）：讓正解不落在最長選項集合裡——補足干擾項細節或縮短正解，不改正解意思、不讓干擾項成立 | "When a big hotel was built." | "When a famous movie was made there." |
| b1-u07-l05 | `items/9/options/2` | 執行長更正（挑最長的期望命中率）：讓正解不落在最長選項集合裡——補足干擾項細節或縮短正解，不改正解意思、不讓干擾項成立 | "When a movie was made there." | "When a music festival started." |
| b1-u07-l06 | `items/13/questions/1/options/0` | 執行長裁示（正解最長偏差）：正解不可是唯一最長選項——縮短正解或補足干擾項細節，不改正解意思、不讓干擾項成立 | "一家科技公司決定在鎮上設辦公室" | "科技公司在鎮上設點" |
| b1-u07-l06 | `items/13/questions/1/options/1` | 執行長裁示（正解最長偏差）：正解不可是唯一最長選項——縮短正解或補足干擾項細節，不改正解意思、不讓干擾項成立 | "政府發錢給居民" | "鎮上的老工廠重新開張" |
| b1-u07-l06 | `items/13/questions/1/options/2` | 執行長裁示（正解最長偏差）：正解不可是唯一最長選項——縮短正解或補足干擾項細節，不改正解意思、不讓干擾項成立 | "老工廠重新開張" | "政府每個月發錢給居民" |
| b1-u07-l06 | `items/15/rubricZh/2` | 執行長裁示（b1b2）：評分要點封閉清單——「可寫 A 或 B」「常用 X」一律改成「例如…等」，全級腳本掃描修正 | "說的是自己對家鄉或城市的希望（主詞用 I）" | "說的是自己對家鄉、城市等的希望（例如 I hope…）" |
| b1-u07-l06 | `items/8/options/3` | 執行長更正（挑最長的期望命中率）：讓正解不落在最長選項集合裡——補足干擾項細節或縮短正解，不改正解意思、不讓干擾項成立 | "To deliver food." | "To deliver food to the guests." |
| b1-u07-l06 | `items/13/questions/0/options/0` | 執行長更正（挑最長的期望命中率）：讓正解不落在最長選項集合裡——補足干擾項細節或縮短正解，不改正解意思、不讓干擾項成立 | "觀光客變多了" | "人口大幅增加" |
| b1-u07-l06 | `items/13/questions/0/options/1` | 執行長更正（挑最長的期望命中率）：讓正解不落在最長選項集合裡——補足干擾項細節或縮短正解，不改正解意思、不讓干擾項成立 | "人口大幅增加" | "開了很多新的商店和餐廳" |
| b1-u07-l06 | `items/13/questions/0/options/2` | 執行長更正（挑最長的期望命中率）：讓正解不落在最長選項集合裡——補足干擾項細節或縮短正解，不改正解意思、不讓干擾項成立 | "開了很多新商店" | "觀光客變多了" |
| b1-u07-l07 | `items/8/options/0` | 執行長更正（挑最長的期望命中率）：讓正解不落在最長選項集合裡——補足干擾項細節或縮短正解，不改正解意思、不讓干擾項成立 | "He wanted more money." | "He was always late." |
| b1-u07-l07 | `items/8/options/1` | 執行長更正（挑最長的期望命中率）：讓正解不落在最長選項集合裡——補足干擾項細節或縮短正解，不改正解意思、不讓干擾項成立 | "He was always late." | "He wanted more money from the company." |
| b1-u07-l07 | `items/13/questions/0/options/1` | 執行長更正（挑最長的期望命中率）：讓正解不落在最長選項集合裡——補足干擾項細節或縮短正解，不改正解意思、不讓干擾項成立 | "辦公室太老舊" | "產品的價格實在太貴" |
| b1-u07-l07 | `items/13/questions/0/options/2` | 執行長更正（挑最長的期望命中率）：讓正解不落在最長選項集合裡——補足干擾項細節或縮短正解，不改正解意思、不讓干擾項成立 | "產品價格太貴" | "辦公室太老舊" |
| b1-u08-l01 | `items/15/questions/0/options/1` | 執行長裁示（正解最長偏差）：正解不可是唯一最長選項——縮短正解或補足干擾項細節，不改正解意思、不讓干擾項成立 | "要去鄉下住在兒子附近" | "要搬到鄉下兒子附近" |
| b1-u08-l01 | `items/15/questions/0/options/2` | 執行長裁示（正解最長偏差）：正解不可是唯一最長選項——縮短正解或補足干擾項細節，不改正解意思、不讓干擾項成立 | "要出國旅行" | "要出國去旅行很久" |
| b1-u08-l01 | `items/15/questions/0/options/3` | 執行長裁示（正解最長偏差）：正解不可是唯一最長選項——縮短正解或補足干擾項細節，不改正解意思、不讓干擾項成立 | "要搬去市中心" | "要搬去熱鬧的市中心" |
| b1-u08-l01 | `items/17/rubricZh/0` | 第③關 FIX：評分要點寫死 relationship with＋人，改「例如」並收 A and B have a … relationship | "relationship with＋人，表示「和某人的關係」" | "relationship 表示「關係」，可用 relationship with＋人、A and B have a … relationship 等說法（例如 a good relationship with my sister）" |
| b1-u08-l01 | `items/17/rubricZh/0` | 第③關 FIX（同上，縮短到 80 字內） | "relationship 表示「關係」，可用 relationship with＋人、A and B have a … relationship 等說法（例如 a good relationship with my sister）" | "relationship 表示「關係」，例如 relationship with＋人、A and B have a … relationship 等說法" |
| b1-u08-l01 | `items/15/questions/1/options/3` | 執行長更正（挑最長的期望命中率）：讓正解不落在最長選項集合裡——補足干擾項細節或縮短正解，不改正解意思、不讓干擾項成立 | "張家的兒子" | "張家住在國外的兒子" |
| b1-u08-l02 | `items/2/exampleEn` | 第②關＋第③關疑似（採納）：resident 單字卡和閱讀都是「店家的常駐貓」，單字卡換成常駐藝術家 | "The hotel has a resident cat that sleeps by the front door." | "The museum has a resident artist who paints in the garden." |
| b1-u08-l02 | `items/2/exampleZh` | 第②關＋第③關疑似（採納）：resident 單字卡和閱讀都是「店家的常駐貓」，單字卡換成常駐藝術家 | "這家飯店有一隻常駐的貓，睡在大門旁邊。" | "這家博物館有一位駐館藝術家，在花園裡作畫。" |
| b1-u08-l02 | `items/15/rubricZh/0` | 第③關疑似（採納）：要點只收動詞 respect，改成動詞、名詞都收 | "respect 當動詞「尊重」，後面直接接受詞" | "respect 可當動詞（例如 respect other people's opinions）或名詞（例如 show respect for…）" |
| b1-u08-l02 | `items/9/options/3` | 執行長更正（挑最長的期望命中率）：讓正解不落在最長選項集合裡——補足干擾項細節或縮短正解，不改正解意思、不讓干擾項成立 | "A train station and a hotel." | "A train station and a big hotel." |
| b1-u08-l03 | `items/5/exampleZh` | 第②關＋第③關建議：dollars 未指美國，「美元」改「元」 | "這個俱樂部的會員資格一年五十美元。" | "這個俱樂部的會員資格一年五十元。" |
| b1-u08-l03 | `items/14/passageEn` | 第②關：閱讀 fellow 句和單字卡同句型（He is a＋形容詞＋fellow），換主詞與句型 | "Last month, my grandmother turned ninety. We sent invitations to all our relatives, and more than fifty people came. My twin cousins even flew in from Japan. One special guest was Mr. Lee, a kind old gentleman who has been her companion on morning walks for twenty years. He gave a brief, funny speech, and everyone agreed that he is a funny fellow. His gift was a free membership to his walking club, so now Grandma can join more walks!" | "Last month, my grandmother turned ninety. We sent invitations to all our relatives, and more than fifty people came. My twin cousins even flew in from Japan. One special guest was Mr. Lee, a kind old gentleman who has been her companion on morning walks for twenty years. He gave a brief, funny speech, and Grandma says she has never met a more cheerful fellow. His gift was a free membership to his walking club, so now Grandma can join more walks!" |
| b1-u08-l03 | `items/14/passageZh` | 中譯同步；twin cousins 不譯成「表兄弟」（原文沒有性別） | "上個月，我奶奶滿九十歲了。我們寄邀請函給所有親戚，來了五十多個人。我那對雙胞胎表兄弟甚至從日本飛回來。有一位特別的客人是李先生，他是一位親切的老紳士，二十年來一直是奶奶晨間散步的同伴。他的致詞簡短又幽默，大家都說他是個有趣的人。他送的禮物是他健走社的免費會員資格，所以現在奶奶可以參加更多次健走了！" | "上個月，我奶奶滿九十歲了。我們寄邀請函給所有親戚，來了五十多個人。我那對雙胞胎表親甚至從日本飛回來。有一位特別的客人是李先生，他是一位親切的老紳士，二十年來一直是奶奶晨間散步的同伴。他的致詞簡短又幽默，奶奶說她從沒見過比他更開朗的人。他送的禮物是他健走社的免費會員資格，所以現在奶奶可以參加更多次健走了！" |
| b1-u08-l03 | `items/14/questions/1/options/0` | 執行長裁示（正解最長偏差）：正解不可是唯一最長選項——縮短正解或補足干擾項細節，不改正解意思、不讓干擾項成立 | "她的親戚" | "她的一位遠房親戚" |
| b1-u08-l03 | `items/14/questions/1/options/1` | 執行長裁示（正解最長偏差）：正解不可是唯一最長選項——縮短正解或補足干擾項細節，不改正解意思、不讓干擾項成立 | "二十年來一起晨間散步的同伴" | "晨間散步的同伴" |
| b1-u08-l04 | `items/14/passageEn` | 第②關：parents 給 parental advice 冗贅，改 parental worries | "When Amy moved to a small island last year, she was a newcomer among its two thousand inhabitants. Initially, she knew only a few acquaintances from her job. Then she joined the island's volleyball team. Her teammates gave her a nickname, \"Sunny,\" because she always smiled. One of them, Kate, soon became her best buddy. Now Amy calls the island her beloved second home. Even her parents have stopped giving parental advice, because they can see she is happy." | "When Amy moved to a small island last year, she was a newcomer among its two thousand inhabitants. Initially, she knew only a few acquaintances from her job. Then she joined the island's volleyball team. Her teammates gave her a nickname, \"Sunny,\" because she always smiled. One of them, Kate, soon became her best buddy. Now Amy calls the island her beloved second home. Her mother has fewer parental worries now, because she can see Amy is happy." |
| b1-u08-l04 | `items/14/passageZh` | 中譯同步 | "去年 Amy 搬到一座小島時，她是島上兩千名居民中的新來者。一開始，她只認識幾個工作上的人。後來她加入島上的排球隊。隊友們給她取了個綽號叫「Sunny」，因為她總是笑咪咪的。其中一位隊友 Kate 很快成了她最好的朋友。現在 Amy 把這座島稱為她心愛的第二個家。連她爸媽都不再給她父母式的叮嚀了，因為他們看得出她很快樂。" | "去年 Amy 搬到一座小島時，她是島上兩千名居民中的新來者。一開始，她只認識幾個工作上的人。後來她加入島上的排球隊。隊友們給她取了個綽號叫「Sunny」，因為她總是笑咪咪的。其中一位隊友 Kate 很快成了她最好的朋友。現在 Amy 把這座島稱為她心愛的第二個家。她媽媽現在也少了許多為人父母的擔心，因為看得出 Amy 很快樂。" |
| b1-u08-l04 | `items/14/questions/0/options/1` | 執行長裁示（正解最長偏差）：正解不可是唯一最長選項——縮短正解或補足干擾項細節，不改正解意思、不讓干擾項成立 | "很多老朋友" | "很多從小認識的老朋友" |
| b1-u08-l04 | `items/14/questions/1/options/2` | 執行長裁示（正解最長偏差）：正解不可是唯一最長選項——縮短正解或補足干擾項細節，不改正解意思、不讓干擾項成立 | "因為她很會打排球" | "因為她排球打得非常好" |
| b1-u08-l04 | `items/14/passageEn` | 第②關（同上；fewer 無級距，改寫） | "When Amy moved to a small island last year, she was a newcomer among its two thousand inhabitants. Initially, she knew only a few acquaintances from her job. Then she joined the island's volleyball team. Her teammates gave her a nickname, \"Sunny,\" because she always smiled. One of them, Kate, soon became her best buddy. Now Amy calls the island her beloved second home. Her mother has fewer parental worries now, because she can see Amy is happy." | "When Amy moved to a small island last year, she was a newcomer among its two thousand inhabitants. Initially, she knew only a few acquaintances from her job. Then she joined the island's volleyball team. Her teammates gave her a nickname, \"Sunny,\" because she always smiled. One of them, Kate, soon became her best buddy. Now Amy calls the island her beloved second home. Her mother no longer has parental worries, because she can see Amy is happy." |
| b1-u08-l04 | `items/14/passageZh` | 中譯同步 | "去年 Amy 搬到一座小島時，她是島上兩千名居民中的新來者。一開始，她只認識幾個工作上的人。後來她加入島上的排球隊。隊友們給她取了個綽號叫「Sunny」，因為她總是笑咪咪的。其中一位隊友 Kate 很快成了她最好的朋友。現在 Amy 把這座島稱為她心愛的第二個家。她媽媽現在也少了許多為人父母的擔心，因為看得出 Amy 很快樂。" | "去年 Amy 搬到一座小島時，她是島上兩千名居民中的新來者。一開始，她只認識幾個工作上的人。後來她加入島上的排球隊。隊友們給她取了個綽號叫「Sunny」，因為她總是笑咪咪的。其中一位隊友 Kate 很快成了她最好的朋友。現在 Amy 把這座島稱為她心愛的第二個家。她媽媽也不再有為人父母的擔心，因為看得出 Amy 很快樂。" |
| b1-u08-l04 | `items/9/options/0` | 執行長更正（挑最長的期望命中率）：讓正解不落在最長選項集合裡——補足干擾項細節或縮短正解，不改正解意思、不讓干擾項成立 | "Young students." | "Young students from the city." |
| b1-u08-l05 | `items/0/exampleEn` | 第③關 FIX：greeting 單字卡和造句參考答案同為「用電子管道寄祝福」，單字卡換情境 | "She sent me a birthday greeting by email." | "Our teacher started the class with a short greeting." |
| b1-u08-l05 | `items/0/exampleZh` | 第③關 FIX：greeting 單字卡和造句參考答案同為「用電子管道寄祝福」，單字卡換情境 | "她用電子郵件寄生日祝福給我。" | "老師用簡短的問候開始上課。" |
| b1-u08-l05 | `items/14/questions/1/options/1` | 執行長裁示（正解最長偏差）：正解不可是唯一最長選項——縮短正解或補足干擾項細節，不改正解意思、不讓干擾項成立 | "新郎的朋友" | "新郎從小到大的朋友" |
| b1-u08-l05 | `items/14/questions/1/options/2` | 執行長裁示（正解最長偏差）：正解不可是唯一最長選項——縮短正解或補足干擾項細節，不改正解意思、不讓干擾項成立 | "作者的小姪女和小姪子" | "作者的姪女和姪子" |
| b1-u08-l05 | `items/14/questions/1/options/3` | 執行長裁示（正解最長偏差）：正解不可是唯一最長選項——縮短正解或補足干擾項細節，不改正解意思、不讓干擾項成立 | "請來的樂團" | "婚禮請來的樂團成員" |
| b1-u08-l05 | `items/9/options/0` | 執行長更正（挑最長的期望命中率）：讓正解不落在最長選項集合裡——補足干擾項細節或縮短正解，不改正解意思、不讓干擾項成立 | "A new neighbor." | "The speaker's parents." |
| b1-u08-l05 | `items/9/options/1` | 執行長更正（挑最長的期望命中率）：讓正解不落在最長選項集合裡——補足干擾項細節或縮短正解，不改正解意思、不讓干擾項成立 | "The speaker's parents." | "Two friends from the speaker's work." |
| b1-u08-l05 | `items/9/options/2` | 執行長更正（挑最長的期望命中率）：讓正解不落在最長選項集合裡——補足干擾項細節或縮短正解，不改正解意思、不讓干擾項成立 | "Two friends from work." | "A new neighbor." |
| b1-u08-l06 | `items/14/passageEn` | 第②關：兩人之間不說 share a brotherhood，改成「球隊的兄弟情誼」（群體義） | "Last month, my old classmate Ben got married. The groom wore a dark blue suit, and he was very nervous. His best friend from college, an Englishman named Harry, gave a funny speech. \"Hey, dude, don't worry!\" he shouted, and everyone laughed. Ben and Harry played on the same football team in college, and they still share a strong brotherhood. Harry said their teamwork on the field was essential, and it taught them a lot about friendship. At the end, he gave Ben a warm handshake." | "Last month, my old classmate Ben got married. The groom wore a dark blue suit, and he was very nervous. His best friend from college, an Englishman named Harry, gave a funny speech. \"Hey, dude, don't worry!\" he shouted, and everyone laughed. Ben and Harry played on the same football team in college, and the brotherhood of that team is still strong. Harry said their teamwork on the field was essential, and it taught them a lot about friendship. At the end, he gave Ben a warm handshake." |
| b1-u08-l06 | `items/14/passageZh` | 中譯同步 | "上個月，我的老同學 Ben 結婚了。新郎穿著深藍色西裝，非常緊張。他大學時最好的朋友——一位名叫 Harry 的英國人——致了一段有趣的詞。他大喊：「嘿，老兄，別緊張！」大家都笑了。Ben 和 Harry 大學時在同一支足球隊踢球，到現在還保有深厚的兄弟情誼。Harry 說，他們在球場上的團隊合作非常重要，也讓他們學到很多關於友誼的事。最後，他和 Ben 熱情地握了手。" | "上個月，我的老同學 Ben 結婚了。新郎穿著深藍色西裝，非常緊張。他大學時最好的朋友——一位名叫 Harry 的英國人——致了一段有趣的詞。他大喊：「嘿，老兄，別緊張！」大家都笑了。Ben 和 Harry 大學時在同一支足球隊踢球，那支球隊的兄弟情誼至今依然深厚。Harry 說，他們在球場上的團隊合作非常重要，也讓他們學到很多關於友誼的事。最後，他和 Ben 熱情地握了手。" |
| b1-u08-l06 | `items/14/questions/0/options/1` | 執行長裁示（正解最長偏差）：正解不可是唯一最長選項——縮短正解或補足干擾項細節，不改正解意思、不讓干擾項成立 | "新郎的哥哥" | "新郎唯一的親哥哥" |
| b1-u08-l06 | `items/14/questions/0/options/3` | 執行長裁示（正解最長偏差）：正解不可是唯一最長選項——縮短正解或補足干擾項細節，不改正解意思、不讓干擾項成立 | "婚禮的主持人" | "婚禮請來的專業主持人" |
| b1-u08-l06 | `items/14/questions/1/options/0` | 執行長裁示（正解最長偏差）：正解不可是唯一最長選項——縮短正解或補足干擾項細節，不改正解意思、不讓干擾項成立 | "一起住宿舍" | "一起住同一間宿舍" |
| b1-u08-l06 | `items/14/questions/1/options/1` | 執行長裁示（正解最長偏差）：正解不可是唯一最長選項——縮短正解或補足干擾項細節，不改正解意思、不讓干擾項成立 | "一起打工" | "一起在餐廳打工" |
| b1-u08-l06 | `items/14/questions/1/options/2` | 執行長裁示（正解最長偏差）：正解不可是唯一最長選項——縮短正解或補足干擾項細節，不改正解意思、不讓干擾項成立 | "一起學音樂" | "一起在社團學音樂" |
| b1-u08-l06 | `items/14/questions/1/options/3` | 執行長裁示（正解最長偏差）：正解不可是唯一最長選項——縮短正解或補足干擾項細節，不改正解意思、不讓干擾項成立 | "在同一支足球隊踢球" | "在同一隊踢足球" |
| b1-u08-l06 | `items/15/rubricZh/1` | 第③關疑似（採納）：中文沒有時間標記，要點不寫死過去式 | "過去的事用過去式（例如 were engaged、got married）" | "時態配合內容（例如 were engaged、got married、will get married）" |
| b1-u08-l06 | `items/16/rubricZh/0` | 執行長裁示（b1b2）：評分要點封閉清單——「可寫 A 或 B」「常用 X」一律改成「例如…等」，全級腳本掃描修正 | "teamwork 是不可數名詞，不加 a 或 s" | "teamwork 是不可數名詞，不加 a，也不加 s" |
| b1-u08-l06 | `items/1/exampleEn` | 執行長裁示（b1b2）：情境對照表以現行檔案重做、逐列判定——新郎單字卡和閱讀同為「新郎很緊張」，只換句型，改單字卡 | "The groom looked nervous before the wedding." | "The groom thanked everyone for coming." |
| b1-u08-l06 | `items/1/exampleZh` | 執行長裁示（b1b2）：情境對照表以現行檔案重做、逐列判定——新郎單字卡和閱讀同為「新郎很緊張」，只換句型，改單字卡 | "新郎在婚禮前看起來很緊張。" | "新郎感謝大家前來。" |
| b1-u08-l06 | `items/10/sentenceEn` | 執行長裁示（b1b2）：情境對照表以現行檔案重做、逐列判定——handshake 跟讀和單字卡同為「a handshake＋動詞＋受詞」的通論，只換情境，改跟讀 | "A firm handshake can make a good first impression." | "He greeted each guest with a firm handshake." |
| b1-u08-l06 | `items/10/sentenceZh` | 執行長裁示（b1b2）：情境對照表以現行檔案重做、逐列判定——handshake 跟讀和單字卡同為「a handshake＋動詞＋受詞」的通論，只換情境，改跟讀 | "有力的握手能給人良好的第一印象。" | "他和每位客人有力地握手打招呼。" |
| b1-u08-l07 | `items/9/audioEn` | 第②關：「年度好鄰居」由第一夫人頒獎不合常理，閱讀改市長頒獎；first lady 的情境改到聽選（參訪學校） | "The babysitter will arrive at six, so we can leave for dinner at half past six." | "The first lady will visit our school on Friday, so classes will end at noon." |
| b1-u08-l07 | `items/9/audioZh` | 第②關：「年度好鄰居」由第一夫人頒獎不合常理，閱讀改市長頒獎；first lady 的情境改到聽選（參訪學校） | "保母六點會到，所以我們六點半可以出門吃晚餐。" | "第一夫人星期五會來我們學校參訪，所以那天課上到中午。" |
| b1-u08-l07 | `items/9/questionZh` | 第②關：「年度好鄰居」由第一夫人頒獎不合常理，閱讀改市長頒獎；first lady 的情境改到聽選（參訪學校） | "他們幾點可以出門吃晚餐？" | "星期五的課上到幾點？" |
| b1-u08-l07 | `items/9/options/0` | 第②關：「年度好鄰居」由第一夫人頒獎不合常理，閱讀改市長頒獎；first lady 的情境改到聽選（參訪學校） | "At seven." | "At ten." |
| b1-u08-l07 | `items/9/options/1` | 第②關：「年度好鄰居」由第一夫人頒獎不合常理，閱讀改市長頒獎；first lady 的情境改到聽選（參訪學校） | "At six." | "At three." |
| b1-u08-l07 | `items/9/options/2` | 第②關：「年度好鄰居」由第一夫人頒獎不合常理，閱讀改市長頒獎；first lady 的情境改到聽選（參訪學校） | "At half past six." | "At noon." |
| b1-u08-l07 | `items/9/options/3` | 第②關：「年度好鄰居」由第一夫人頒獎不合常理，閱讀改市長頒獎；first lady 的情境改到聽選（參訪學校） | "At half past seven." | "At two." |
| b1-u08-l07 | `items/13/stemZh` | 第②關＋第③關建議：dollars 未指美國，「美元」改「元」 | "我們付保母每小時十美元照顧孩子。" | "我們付保母每小時十元照顧孩子。" |
| b1-u08-l07 | `items/14/passageEn` | 第②關：改市長頒獎（mayor 是 B1 字） | "Mrs. Wang is our next-door neighbor. She is a middle-aged teacher, and she is famous on our street for her friendliness. On weekends, she frequently babysits for young families, and she never asks for money. Last year, the city chose her as \"Neighbor of the Year.\" At the event, the first lady herself gave her the prize! Mrs. Wang was a latecomer to the event because her bus was slow, but nobody minded." | "Mrs. Wang is our next-door neighbor. She is a middle-aged teacher, and she is famous on our street for her friendliness. On weekends, she frequently babysits for young families, and she never asks for money. Last year, the city chose her as \"Neighbor of the Year.\" At the event, the mayor herself gave her the prize! Mrs. Wang was a latecomer to the event because her bus was slow, but nobody minded." |
| b1-u08-l07 | `items/14/passageZh` | 中譯同步 | "王太太是我們隔壁的鄰居。她是一位中年老師，以友善在我們這條街上出名。週末時，她常常幫年輕家庭照顧小孩，而且從不收錢。去年，市政府選她為「年度好鄰居」。在頒獎活動上，第一夫人親自頒獎給她！王太太因為公車開得慢而晚到，但沒有人介意。" | "王太太是我們隔壁的鄰居。她是一位中年老師，以友善在我們這條街上出名。週末時，她常常幫年輕家庭照顧小孩，而且從不收錢。去年，市政府選她為「年度好鄰居」。在頒獎活動上，市長親自頒獎給她！王太太因為公車開得慢而晚到，但沒有人介意。" |
| b1-u08-l07 | `items/14/questions/0/options/0` | 執行長裁示（正解最長偏差）：正解不可是唯一最長選項——縮短正解或補足干擾項細節，不改正解意思、不讓干擾項成立 | "免費幫年輕家庭照顧小孩" | "免費幫人照顧小孩" |
| b1-u08-l07 | `items/14/questions/0/options/2` | 執行長裁示（正解最長偏差）：正解不可是唯一最長選項——縮短正解或補足干擾項細節，不改正解意思、不讓干擾項成立 | "到市場賣東西" | "到市場賣自己做的東西" |
| b1-u08-l07 | `items/14/questions/0/options/3` | 執行長裁示（正解最長偏差）：正解不可是唯一最長選項——縮短正解或補足干擾項細節，不改正解意思、不讓干擾項成立 | "帶鄰居去旅行" | "帶鄰居的小孩去旅行" |
| b1-u08-l07 | `items/4/exampleEn` | 執行長裁示（b1b2）：情境對照表以現行檔案重做、逐列判定——first lady 單字卡和聽選同為「第一夫人參訪某處」，改單字卡 | "The first lady visited a children's hospital today." | "The first lady wrote a book about her childhood." |
| b1-u08-l07 | `items/4/exampleZh` | 執行長裁示（b1b2）：情境對照表以現行檔案重做、逐列判定——first lady 單字卡和聽選同為「第一夫人參訪某處」，改單字卡 | "第一夫人今天去參觀了一家兒童醫院。" | "第一夫人寫了一本關於她童年的書。" |
| b1-u09-l01 | `items/14/questions/1/options/0` | 執行長裁示（正解最長偏差）：正解不可是唯一最長選項——縮短正解或補足干擾項細節，不改正解意思、不讓干擾項成立 | "報紙的報導" | "報紙上的一篇長篇報導" |
| b1-u09-l01 | `items/14/questions/1/options/2` | 執行長裁示（正解最長偏差）：正解不可是唯一最長選項——縮短正解或補足干擾項細節，不改正解意思、不讓干擾項成立 | "一位熟客在網路上分享他們的故事" | "熟客在網路上的分享" |
| b1-u09-l01 | `items/14/questions/1/options/3` | 執行長裁示（正解最長偏差）：正解不可是唯一最長選項——縮短正解或補足干擾項細節，不改正解意思、不讓干擾項成立 | "新口味的麵包" | "店裡新推出的口味麵包" |
| b1-u09-l01 | `items/15/referenceEn/1` | 第②關：I really thank you 不道地，改 appreciate | "I really thank you for your patience." | "I really appreciate your patience." |
| b1-u09-l01 | `items/15/rubricZh/2` | 連動：參考答案已用 appreciate，要點改列其他也正確的說法 | "寫 I appreciate your patience. 也正確" | "其他表達感謝的寫法也正確（例如 I appreciate your patience.、Thanks for being so patient.）" |
| b1-u09-l01 | `items/9/options/3` | 執行長更正（挑最長的期望命中率）：讓正解不落在最長選項集合裡——補足干擾項細節或縮短正解，不改正解意思、不讓干擾項成立 | "Not interested at all." | "Not interested in the new job at all." |
| b1-u09-l02 | `items/10/sentenceEn` | 第②關：每晚讀書只說明用功，不足以說明有抱負，補目標 | "My brother is very ambitious; he studies every night." | "My brother is very ambitious; he wants to become a doctor." |
| b1-u09-l02 | `items/10/sentenceZh` | 第②關：每晚讀書只說明用功，不足以說明有抱負，補目標 | "我哥哥很有抱負，每天晚上都在讀書。" | "我哥哥很有抱負，他想當醫生。" |
| b1-u09-l02 | `items/14/passageEn` | 第③關建議（採納）：ambitious about it 不自然 | "Last week, our team leader, Nora, left the company after ten years. She had always been loyal and hard-working. Her new job is in Singapore, and she is very ambitious about it. Many of us felt disappointment when we heard the news. At her farewell lunch, we gave her a card to show our appreciation. Honestly, it was a terrific party. Nora even made a short apology for leaving so suddenly. Some of us are still cautious about the new team leader, but he seems nice." | "Last week, our team leader, Nora, left the company after ten years. She had always been loyal and hard-working. She has always been ambitious, and her new job is in Singapore. Many of us felt disappointment when we heard the news. At her farewell lunch, we gave her a card to show our appreciation. Honestly, it was a terrific party. Nora even made a short apology for leaving so suddenly. Some of us are still cautious about the new team leader, but he seems nice." |
| b1-u09-l02 | `items/14/passageZh` | 中譯同步 | "上星期，我們的組長 Nora 在待了十年之後離開了公司。她一直都很忠誠又努力。她的新工作在新加坡，她對這份工作很有抱負。我們很多人聽到消息時都很失望。在她的歡送午餐上，我們送她一張卡片表達感謝。老實說，那是一場很棒的派對。Nora 甚至為自己這麼突然離開而簡短地道歉。我們有些人對新組長還是有點保留，但他看起來人不錯。" | "上星期，我們的組長 Nora 在待了十年之後離開了公司。她一直都很忠誠又努力。她一向很有抱負，她的新工作在新加坡。我們很多人聽到消息時都很失望。在她的歡送午餐上，我們送她一張卡片表達感謝。老實說，那是一場很棒的派對。Nora 甚至為自己這麼突然離開而簡短地道歉。我們有些人對新組長還是有點保留，但他看起來人不錯。" |
| b1-u09-l02 | `items/15/rubricZh/1` | 執行長裁示（b1b2）：評分要點封閉清單——「可寫 A 或 B」「常用 X」一律改成「例如…等」，全級腳本掃描修正 | "可用 a disappointment to／for me" | "例如 a disappointment to／for me 等說法" |
| b1-u09-l02 | `items/16/rubricZh/0` | 第②關：要點只寫放句首，"I honestly think…" 也正確 | "honestly 放句首時後面加逗號，表示「老實說」" | "honestly 表示「老實說」，例如放句首加逗號（Honestly, …），也可放在動詞前（I honestly think…）" |
| b1-u09-l02 | `items/16/rubricZh/1` | 第③關疑似（採納）：「主詞用 I」過嚴 | "說的是自己的看法（主詞用 I）" | "說的是自己的看法（例如 I think…，或直接評論某件事）" |
| b1-u09-l02 | `items/14/questions/0/options/2` | 執行長更正（挑最長的期望命中率）：讓正解不落在最長選項集合裡——補足干擾項細節或縮短正解，不改正解意思、不讓干擾項成立 | "她在新加坡找到新工作" | "她在新加坡找到工作" |
| b1-u09-l02 | `items/14/questions/0/options/3` | 執行長更正（挑最長的期望命中率）：讓正解不落在最長選項集合裡——補足干擾項細節或縮短正解，不改正解意思、不讓干擾項成立 | "她想休息一年" | "她想先休息一年去旅行" |
| b1-u09-l02 | `items/14/questions/1/options/0` | 執行長更正（挑最長的期望命中率）：讓正解不落在最長選項集合裡——補足干擾項細節或縮短正解，不改正解意思、不讓干擾項成立 | "一張表達感謝的卡片" | "一張感謝卡" |
| b1-u09-l02 | `items/14/questions/1/options/1` | 執行長更正（挑最長的期望命中率）：讓正解不落在最長選項集合裡——補足干擾項細節或縮短正解，不改正解意思、不讓干擾項成立 | "一支手錶" | "一束花" |
| b1-u09-l02 | `items/14/questions/1/options/2` | 執行長更正（挑最長的期望命中率）：讓正解不落在最長選項集合裡——補足干擾項細節或縮短正解，不改正解意思、不讓干擾項成立 | "一束花" | "一支手錶" |
| b1-u09-l02 | `items/14/questions/1/options/3` | 執行長更正（挑最長的期望命中率）：讓正解不落在最長選項集合裡——補足干擾項細節或縮短正解，不改正解意思、不讓干擾項成立 | "一本書" | "一本好看的書" |
| b1-u09-l02 | `items/10/sentenceEn` | 執行長裁示（b1b2）：情境對照表以現行檔案重做、逐列判定——ambitious 跟讀和單字卡同為「某人有抱負＋想當／想開…」，只換主詞，改跟讀 | "My brother is very ambitious; he wants to become a doctor." | "Ambitious people often set high goals for themselves." |
| b1-u09-l02 | `items/10/sentenceZh` | 執行長裁示（b1b2）：情境對照表以現行檔案重做、逐列判定——ambitious 跟讀和單字卡同為「某人有抱負＋想當／想開…」，只換主詞，改跟讀 | "我哥哥很有抱負，他想當醫生。" | "有抱負的人常給自己訂下很高的目標。" |
| b1-u09-l03 | `items/14/passageEn` | 第③關 FIX：principal 名詞「校長」是 B2 詞義，改 head of the school | "Our school's sports day is always full of spirit. This year, the students were enthusiastic, and the teachers joined the races too. The weather was hot, so the coach told everyone to run with caution. One careless runner fell, but luckily it was not serious. Food stands tempted the children with ice cream. Some loud music irritated a few parents, but most people had fun. At the end, the principal gave every class a compliment on their teamwork." | "Our school's sports day is always full of spirit. This year, the students were enthusiastic, and the teachers joined the races too. The weather was hot, so the coach told everyone to run with caution. One careless runner fell, but luckily it was not serious. Food stands tempted the children with ice cream. Some loud music irritated a few parents, but most people had fun. At the end, the head of the school gave every class a compliment on their teamwork." |
| b1-u09-l03 | `items/16/rubricZh/0` | 第②關：要點寫死 serious about＋名詞或動名詞，改「例如」 | "serious about＋名詞或動名詞，表示「認真看待⋯」" | "serious 表示「認真的」，例如 be serious about＋名詞或動名詞，也可用 a serious goal 等說法" |
| b1-u09-l03 | `items/16/rubricZh/1` | 連動：主詞不限 I（例如 Learning English is a serious goal for me.） | "主詞是自己（I）" | "說的是自己（例如 I、my、for me）" |
| b1-u09-l03 | `items/9/options/0` | 執行長更正（挑最長的期望命中率）：讓正解不落在最長選項集合裡——補足干擾項細節或縮短正解，不改正解意思、不讓干擾項成立 | "The TV show." | "The cold weather this evening." |
| b1-u09-l03 | `items/9/options/1` | 執行長更正（挑最長的期望命中率）：讓正解不落在最長選項集合裡——補足干擾項細節或縮短正解，不改正解意思、不讓干擾項成立 | "The cold weather." | "The TV show." |
| b1-u09-l03 | `items/14/questions/0/options/1` | 執行長更正（挑最長的期望命中率）：讓正解不落在最長選項集合裡——補足干擾項細節或縮短正解，不改正解意思、不讓干擾項成立 | "忘了帶鞋子" | "迷路了" |
| b1-u09-l03 | `items/14/questions/0/options/2` | 執行長更正（挑最長的期望命中率）：讓正解不落在最長選項集合裡——補足干擾項細節或縮短正解，不改正解意思、不讓干擾項成立 | "迷路了" | "跑步時忘了帶運動鞋" |
| b1-u09-l04 | `items/14/passageEn` | 第②關：結尾 guilty 的原因前文沒交代，補「他一直沒告訴父母這個夢想」 | "Owen was always shy. He had a strong desire to sing on stage, but he had no confidence. His friend Leo told him, \"Just be yourself.\" So Owen practiced constantly, and singing became good mental exercise for him. At the school concert, he sang with all his heart and soul. It was an emotional night. His parents felt very proud, and Owen no longer felt guilty about hiding his dream from them." | "Owen was always shy. He had a strong desire to sing on stage, but he had no confidence, so he kept this dream from his parents. His friend Leo told him, \"Just be yourself.\" So Owen practiced constantly, and singing became good mental exercise for him. At the school concert, he sang with all his heart and soul. It was an emotional night. His parents felt very proud, and Owen no longer felt guilty about hiding his dream from them." |
| b1-u09-l04 | `items/14/passageZh` | 中譯同步 | "Owen 一直很害羞。他非常渴望站上舞台唱歌，但他沒有自信。他的朋友 Leo 對他說：「做你自己就好。」於是 Owen 不斷地練習，唱歌也成了他很好的心理鍛鍊。在學校音樂會上，他全心全意地唱。那是一個令人感動的夜晚。他的父母非常驕傲，Owen 也不再因為對他們隱瞞夢想而感到內疚。" | "Owen 一直很害羞。他非常渴望站上舞台唱歌，但他沒有自信，所以一直沒讓父母知道這個夢想。他的朋友 Leo 對他說：「做你自己就好。」於是 Owen 不斷地練習，唱歌也成了他很好的心理鍛鍊。在學校音樂會上，他全心全意地唱。那是一個令人感動的夜晚。他的父母非常驕傲，Owen 也不再因為對他們隱瞞夢想而感到內疚。" |
| b1-u09-l04 | `items/15/rubricZh/0` | 執行長裁示（b1b2）：評分要點封閉清單——「可寫 A 或 B」「常用 X」一律改成「例如…等」，全級腳本掃描修正 | "be proud of＋人或事物，of 不可少" | "be proud of＋人、事物等，of 不可少" |
| b1-u09-l04 | `items/15/rubricZh/1` | 執行長裁示（b1b2）：評分要點封閉清單——「可寫 A 或 B」「常用 X」一律改成「例如…等」，全級腳本掃描修正 | "也可用 feel proud of" | "也可寫，例如 feel proud of 等" |
| b1-u09-l05 | `items/14/questions/1/options/1` | 執行長裁示（正解最長偏差）：正解不可是唯一最長選項——縮短正解或補足干擾項細節，不改正解意思、不讓干擾項成立 | "很累" | "非常累，只想睡覺" |
| b1-u09-l05 | `items/14/questions/1/options/2` | 執行長裁示（正解最長偏差）：正解不可是唯一最長選項——縮短正解或補足干擾項細節，不改正解意思、不讓干擾項成立 | "平靜，幾乎像心靈體驗" | "很平靜，像心靈體驗" |
| b1-u09-l05 | `items/14/questions/1/options/3` | 執行長裁示（正解最長偏差）：正解不可是唯一最長選項——縮短正解或補足干擾項細節，不改正解意思、不讓干擾項成立 | "很緊張" | "很緊張，一直在發抖" |
| b1-u09-l05 | `items/15/rubricZh/1` | 第②關：要點寫死 was unable to，與要點 3 矛盾 | "昨天的事用 was unable to" | "過去的事用過去式（例如 was unable to、couldn't）" |
| b1-u09-l05 | `items/16/rubricZh/0` | 第②關＋第③關 FIX：要點寫死 inspire＋人＋to，"My mother inspires me." 也正確 | "inspire＋人＋to＋原形動詞，表示「激勵某人做⋯」" | "inspire 表示「激勵、啟發」，可接人（例如 inspires me），也可再加 to＋原形動詞（例如 inspired me to learn Japanese）" |
| b1-u09-l05 | `items/16/rubricZh/0` | 第②關＋第③關 FIX（同上，縮短到 80 字內） | "inspire 表示「激勵、啟發」，可接人（例如 inspires me），也可再加 to＋原形動詞（例如 inspired me to learn Japanese）" | "inspire 表示「激勵、啟發」，可只接人（例如 inspires me），也可再加 to＋原形動詞" |
| b1-u09-l06 | `items/7/exampleZh` | 第②關：personally 此處＝本人，「私下」不精確 | "我私下不認識她，但我喜歡她的歌。" | "我跟她本人不認識，但我喜歡她的歌。" |
| b1-u09-l06 | `items/14/questions/0/options/1` | 執行長裁示（正解最長偏差）：正解不可是唯一最長選項——縮短正解或補足干擾項細節，不改正解意思、不讓干擾項成立 | "一個較高大的男孩推了他" | "一個大男孩推了他" |
| b1-u09-l06 | `items/14/questions/0/options/2` | 執行長裁示（正解最長偏差）：正解不可是唯一最長選項——縮短正解或補足干擾項細節，不改正解意思、不讓干擾項成立 | "他弄丟了書包" | "他在學校弄丟了書包" |
| b1-u09-l06 | `items/14/questions/0/options/3` | 執行長裁示（正解最長偏差）：正解不可是唯一最長選項——縮短正解或補足干擾項細節，不改正解意思、不讓干擾項成立 | "老師罵了他" | "老師當著全班罵了他" |
| b1-u09-l06 | `items/16/rubricZh/0` | 第②關＋第③關 FIX：要點 be honest with＋人與參考答案 2 矛盾 | "be honest with＋人，表示「對某人誠實」" | "honest 表示「誠實的、坦白的」，可用 be honest with＋人、be honest about＋事、be honest at work 等說法" |
| b1-u09-l06 | `items/16/rubricZh/2` | 連動：「主詞用 I」改「例如」 | "說的是自己的看法或習慣（主詞用 I）" | "說的是自己的看法或習慣（例如 I think…、I always try…）" |
| b1-u09-l07 | `items/1/exampleEn` | 第②關：have a terror of 少見，改 fills her with terror | "She has a terror of deep water." | "Deep water fills her with terror." |
| b1-u09-l07 | `items/1/exampleZh` | 第②關：have a terror of 少見，改 fills her with terror | "她非常害怕深水。" | "深水讓她充滿恐懼。" |
| b1-u09-l07 | `items/11/sentenceZh` | 第③關建議（採納）：looked innocent 是「一臉無辜」，不是「天真」 | "那個小男孩看起來很天真，但他把餅乾全吃光了。" | "那個小男孩一臉無辜，但他其實把餅乾全吃光了。" |
| b1-u09-l07 | `items/16/rubricZh/0` | 執行長裁示（b1b2）：評分要點封閉清單——「可寫 A 或 B」「常用 X」一律改成「例如…等」，全級腳本掃描修正 | "humor 表示「幽默」，常用 a sense of humor" | "humor 表示「幽默」，例如 a sense of humor 等說法" |
| b1-u09-l07 | `items/14/questions/1/options/0` | 執行長更正（挑最長的期望命中率）：讓正解不落在最長選項集合裡——補足干擾項細節或縮短正解，不改正解意思、不讓干擾項成立 | "很嚴格" | "對大家很嚴格" |
| b1-u09-l07 | `items/5/exampleEn` | 執行長裁示（b1b2）：情境對照表以現行檔案重做、逐列判定——scared 單字卡和閱讀同為「小女孩怕打雷／怕黑」，改單字卡 | "My little sister is scared of thunder." | "Many people are scared of flying." |
| b1-u09-l07 | `items/5/exampleZh` | 執行長裁示（b1b2）：情境對照表以現行檔案重做、逐列判定——scared 單字卡和閱讀同為「小女孩怕打雷／怕黑」，改單字卡 | "我妹妹很怕打雷。" | "很多人害怕搭飛機。" |
| b1-u09-l08 | `items/12/stemEn` | 第③關建議（採納）：mcq 和造句參考答案同為 It took courage for…，又和 u09-l04 閱讀（害羞男孩上台唱歌）重複，換情境 | "It took great ____ for the shy boy to sing on stage." | "The young climber showed great ____ on the dangerous mountain." |
| b1-u09-l08 | `items/12/stemZh` | 第③關建議（採納）：mcq 和造句參考答案同為 It took courage for…，又和 u09-l04 閱讀（害羞男孩上台唱歌）重複，換情境 | "那個害羞的男孩鼓起很大的勇氣才上台唱歌。" | "那位年輕的登山者在危險的山上表現出很大的勇氣。" |
| b1-u09-l08 | `items/14/passageZh` | 第②關＋第③關建議：art student 不一定是大學科系，「美術系學生」改「學美術的學生」 | "Mina 是一位很有天分的美術系學生，但去年她差點放棄。她非常沮喪，因為她的畫從來沒得過獎。老師給了她一些實際的建議：「別失去動力。保持好奇，試試新的風格。」Mina 鼓起勇氣把作品放上網路。有幾則留言很冒犯人，但很多人覺得她的畫令人印象深刻。現在她發誓再也不放棄了。" | "Mina 是一位很有天分的學美術的學生，但去年她差點放棄。她非常沮喪，因為她的畫從來沒得過獎。老師給了她一些實際的建議：「別失去動力。保持好奇，試試新的風格。」Mina 鼓起勇氣把作品放上網路。有幾則留言很冒犯人，但很多人覺得她的畫令人印象深刻。現在她發誓再也不放棄了。" |
| b1-u09-l08 | `items/14/questions/1/options/0` | 執行長裁示（正解最長偏差）：正解不可是唯一最長選項——縮短正解或補足干擾項細節，不改正解意思、不讓干擾項成立 | "保持好奇、嘗試新風格" | "保持好奇，試新風格" |
| b1-u09-l08 | `items/14/questions/1/options/1` | 執行長裁示（正解最長偏差）：正解不可是唯一最長選項——縮短正解或補足干擾項細節，不改正解意思、不讓干擾項成立 | "換一位老師" | "換一位更好的老師" |
| b1-u09-l08 | `items/14/questions/1/options/3` | 執行長裁示（正解最長偏差）：正解不可是唯一最長選項——縮短正解或補足干擾項細節，不改正解意思、不讓干擾項成立 | "參加更多比賽" | "多參加一些繪畫比賽" |
| b1-u09-l08 | `items/16/rubricZh/1` | 第③關疑似 S8 同型：「常用」改「例如」 | "常用 It takes courage to…、have the courage to… 等說法" | "可用 It takes courage to…、have the courage to… 等說法（例如 It took courage for me to…）" |
| b1-u09-l08 | `items/14/questions/0/options/0` | 執行長更正（挑最長的期望命中率）：讓正解不落在最長選項集合裡——補足干擾項細節或縮短正解，不改正解意思、不讓干擾項成立 | "沒有時間畫畫" | "一直沒有時間好好畫畫" |
| b1-u09-l08 | `items/12/stemEn` | 執行長裁示（b1b2）：情境對照表以現行檔案重做、逐列判定——courage 選擇題幹和單字卡同為「某人表現出很大的勇氣」，只換主詞，再改題幹 | "The young climber showed great ____ on the dangerous mountain." | "Telling the truth sometimes needs a lot of ____." |
| b1-u09-l08 | `items/12/stemZh` | 執行長裁示（b1b2）：情境對照表以現行檔案重做、逐列判定——courage 選擇題幹和單字卡同為「某人表現出很大的勇氣」，只換主詞，再改題幹 | "那位年輕的登山者在危險的山上表現出很大的勇氣。" | "說實話有時候需要很大的勇氣。" |
| b1-u09-l09 | `items/7/exampleEn` | 第②關＋第③關疑似（採納）：警方查火災動機是犯罪＋災害情境，fire 也不會有 motive，換中性情境 | "The police are trying to find the motive for the fire." | "We still don't know her motive for selling the house." |
| b1-u09-l09 | `items/7/exampleZh` | 第②關＋第③關疑似（採納）：警方查火災動機是犯罪＋災害情境，fire 也不會有 motive，換中性情境 | "警方正在找出這場火災的動機。" | "我們還是不知道她賣房子的動機。" |
| b1-u09-l10 | `items/0/glossZh` | 執行長裁示：bitter 照 lexicon 該級詞義（苦的、痛苦的）與單元主題（情緒），釋義以「痛苦的」為先 | "苦的；怨恨的；痛苦的" | "（心裡）痛苦的；怨恨的；（味道）苦的" |
| b1-u09-l10 | `items/14/questions/0/options/1` | 執行長裁示（正解最長偏差）：正解不可是唯一最長選項——縮短正解或補足干擾項細節，不改正解意思、不讓干擾項成立 | "跑回家，誰也沒說" | "跑回家沒告訴人" |
| b1-u09-l10 | `items/14/questions/0/options/2` | 執行長裁示（正解最長偏差）：正解不可是唯一最長選項——縮短正解或補足干擾項細節，不改正解意思、不讓干擾項成立 | "請媽媽賠錢" | "請媽媽幫他賠錢" |
| b1-u09-l10 | `items/14/questions/0/options/3` | 執行長裁示（正解最長偏差）：正解不可是唯一最長選項——縮短正解或補足干擾項細節，不改正解意思、不讓干擾項成立 | "把球藏起來" | "把球藏在草叢裡" |
| b1-u09-l10 | `items/14/questions/1/options/1` | 執行長裁示（正解最長偏差）：正解不可是唯一最長選項——縮短正解或補足干擾項細節，不改正解意思、不讓干擾項成立 | "要他賠錢" | "要他把錢賠出來" |
| b1-u09-l10 | `items/14/questions/1/options/2` | 執行長裁示（正解最長偏差）：正解不可是唯一最長選項——縮短正解或補足干擾項細節，不改正解意思、不讓干擾項成立 | "告訴他的父母" | "把事情告訴他的父母" |
| b1-u09-l10 | `items/14/questions/1/options/3` | 執行長裁示（正解最長偏差）：正解不可是唯一最長選項——縮短正解或補足干擾項細節，不改正解意思、不讓干擾項成立 | "原諒他，還稱讚他誠實" | "原諒他並稱讚他誠實" |
| b1-u09-l10 | `items/16/instructionZh` | 執行長裁示：bitter 造句改成情緒義（本單元主題），不再只考味道 | "用 bitter 造一個句子，說說你覺得很苦的食物或飲料。" | "用 bitter 造一個句子，說說一件讓你心裡很難受、覺得不公平的事。" |
| b1-u09-l10 | `items/16/referenceEn/0` | 執行長裁示：bitter 造句改成情緒義（本單元主題），不再只考味道 | "I don't like bitter vegetables." | "I felt bitter when my friend told everyone my secret." |
| b1-u09-l10 | `items/16/referenceEn/1` | 執行長裁示：bitter 造句改成情緒義（本單元主題），不再只考味道 | "Black coffee is too bitter for me." | "It was a bitter moment for me when I failed my driving test." |
| b1-u09-l10 | `items/16/rubricZh/0` | 執行長裁示：bitter 造句改成情緒義（本單元主題），不再只考味道 | "bitter 在這裡表示「苦的」，可放在名詞前或 be 動詞後" | "bitter 在這裡表示「（心裡）痛苦的、難受的」，例如 feel bitter、a bitter moment 等說法" |
| b1-u09-l10 | `items/16/rubricZh/1` | 執行長裁示：bitter 造句改成情緒義（本單元主題），不再只考味道 | "說的是自己的喜好（例如 I、me）" | "說的是自己的經驗（例如 I、me）" |
| b1-u09-l10 | `items/16/rubricZh/2` | 執行長裁示：bitter 造句改成情緒義（本單元主題），不再只考味道 | "時態配合內容（多用現在簡單式）" | "時態配合內容（例如說過去的事用過去式）" |
| b1-u10-l01 | `items/6/exampleEn` | 第②關＋第③關 FIX：wristwatch 單字卡和閱讀同為「長輩把舊手錶送我」，單字卡換情境 | "My grandfather gave me his old wristwatch." | "He looked at his wristwatch and started to run." |
| b1-u10-l01 | `items/6/exampleZh` | 第②關＋第③關 FIX：wristwatch 單字卡和閱讀同為「長輩把舊手錶送我」，單字卡換情境 | "爺爺把他的舊手錶送給我。" | "他看了一眼手錶，就開始跑了起來。" |
| b1-u10-l01 | `items/9/audioZh` | 第③關建議：dollars 未指美國，「美元」改「元」 | "這條項鍊五十美元，但手環只要二十美元。" | "這條項鍊五十元，但手環只要二十元。" |
| b1-u10-l01 | `items/11/sentenceEn` | 第③關 FIX：accessory 跟讀和單字卡同為「某物是配件」，換情境與句型 | "Shoes, bags, and belts are all accessories." | "She chose a few small accessories to go with her black dress." |
| b1-u10-l01 | `items/11/sentenceZh` | 第③關 FIX：accessory 跟讀和單字卡同為「某物是配件」，換情境與句型 | "鞋子、包包和皮帶都是配件。" | "她挑了幾件小配件來搭配黑色洋裝。" |
| b1-u10-l01 | `items/13/stemEn` | 第②關：衣服縮水不說 get smaller（shrink 是 B2），改 keeps its size | "Wash this ____ in cold water so it doesn't get smaller." | "Wash this ____ in cold water so it keeps its size." |
| b1-u10-l01 | `items/14/questions/0/questionZh` | 第③關建議（採納）：「她們」預設作者是女性 | "她們在盒子裡找到什麼？" | "作者和阿姨在盒子裡找到什麼？" |
| b1-u10-l01 | `items/14/questions/0/options/0` | 執行長更正（挑最長的期望命中率）：讓正解不落在最長選項集合裡——補足干擾項細節或縮短正解，不改正解意思、不讓干擾項成立 | "舊照片和信件" | "很多舊照片和幾封信" |
| b1-u10-l01 | `items/14/questions/1/options/2` | 執行長更正（挑最長的期望命中率）：讓正解不落在最長選項集合裡——補足干擾項細節或縮短正解，不改正解意思、不讓干擾項成立 | "衣服是別人的" | "那些衣服是別人的" |
| b1-u10-l02 | `items/3/glossZh` | 執行長裁示：naked 釋義補最常用義「赤裸的」；干擾項「閉上的」與題意不相干，換掉 | "光禿的；（naked eye）肉眼" | "赤裸的；光禿的；（naked eye）肉眼" |
| b1-u10-l02 | `items/3/distractorsZh/2` | 執行長裁示：naked 釋義補最常用義「赤裸的」；干擾項「閉上的」與題意不相干，換掉 | "閉上的" | "有遮蓋的" |
| b1-u10-l02 | `items/14/questions/0/options/0` | 執行長裁示（正解最長偏差）：正解不可是唯一最長選項——縮短正解或補足干擾項細節，不改正解意思、不讓干擾項成立 | "只賣靴子" | "一年四季都只賣靴子" |
| b1-u10-l02 | `items/14/questions/0/options/1` | 執行長裁示（正解最長偏差）：正解不可是唯一最長選項——縮短正解或補足干擾項細節，不改正解意思、不讓干擾項成立 | "帽子和手套" | "冬天用的帽子和手套" |
| b1-u10-l02 | `items/14/questions/0/options/2` | 執行長裁示（正解最長偏差）：正解不可是唯一最長選項——縮短正解或補足干擾項細節，不改正解意思、不讓干擾項成立 | "棉和絲做的襯衫，冬天也賣靴子" | "棉、絲襯衫和靴子" |
| b1-u10-l02 | `items/14/questions/0/options/3` | 執行長裁示（正解最長偏差）：正解不可是唯一最長選項——縮短正解或補足干擾項細節，不改正解意思、不讓干擾項成立 | "二手衣服" | "便宜的二手衣服" |
| b1-u10-l02 | `items/14/questions/1/options/3` | 執行長裁示（正解最長偏差）：正解不可是唯一最長選項——縮短正解或補足干擾項細節，不改正解意思、不讓干擾項成立 | "比較好洗" | "比較好洗也好整理" |
| b1-u10-l02 | `items/15/promptZh` | 第②關＋第③關 FIX：中文沒有時間標記卻寫死 pinned；name card 多指名片，name tag 的 tag 是 B2，改成別花 | "她用別針把名牌別在襯衫上。" | "她用別針把一朵花別在襯衫上。" |
| b1-u10-l02 | `items/15/referenceEn/0` | 第②關＋第③關 FIX：中文沒有時間標記卻寫死 pinned；name card 多指名片，name tag 的 tag 是 B2，改成別花 | "She pinned her name card to her shirt." | "She pinned a flower to her shirt." |
| b1-u10-l02 | `items/15/referenceEn/1` | 第②關＋第③關 FIX：中文沒有時間標記卻寫死 pinned；name card 多指名片，name tag 的 tag 是 B2，改成別花 | "She pinned her name card onto her shirt." | "She pins a flower onto her shirt." |
| b1-u10-l02 | `items/15/rubricZh/0` | 第②關＋第③關 FIX：中文沒有時間標記卻寫死 pinned；name card 多指名片，name tag 的 tag 是 B2，改成別花 | "pin 當動詞「用別針別住」，常用 pin A to／on B" | "pin 當動詞「用別針別住」，例如 pin A to／on B 等說法" |
| b1-u10-l02 | `items/15/rubricZh/1` | 第②關＋第③關 FIX：中文沒有時間標記卻寫死 pinned；name card 多指名片，name tag 的 tag 是 B2，改成別花 | "過去的事用過去式 pinned（n 要重複）" | "時態配合內容（例如 pinned、pins）；寫過去式時 n 要重複（pinned）" |
| b1-u10-l02 | `items/15/rubricZh/2` | 第②關＋第③關 FIX：中文沒有時間標記卻寫死 pinned；name card 多指名片，name tag 的 tag 是 B2，改成別花 | "「名牌」可寫 name card 等" | "「一朵花」可寫 a flower 等" |
| b1-u10-l02 | `items/3/glossZh` | 執行長裁示（同上，縮短到 20 字內） | "赤裸的；光禿的；（naked eye）肉眼" | "赤裸；光禿；（naked eye）肉眼" |
| b1-u10-l03 | `items/1/exampleEn` | 第②關：nightgown 標準拼法為一個字 | "She put on her night gown and went to bed." | "She put on her nightgown and went to bed." |
| b1-u10-l03 | `items/15/rubricZh/0` | 執行長裁示（b1b2）：評分要點封閉清單——「可寫 A 或 B」「常用 X」一律改成「例如…等」，全級腳本掃描修正 | "fashionable 表示「時髦的」，可放在 be 動詞後或名詞前" | "fashionable 表示「時髦的」，例如放在 be 動詞後、名詞前等" |
| b1-u10-l03 | `items/1/exampleEn` | 第②關：night gown 拼法不標準、nightgown 無級距，改用 dressing gown（晨袍） | "She put on her nightgown and went to bed." | "She put on her dressing gown and made some tea." |
| b1-u10-l03 | `items/1/exampleZh` | 第②關：night gown 拼法不標準、nightgown 無級距，改用 dressing gown（晨袍） | "她換上睡袍，上床睡覺。" | "她穿上晨袍，泡了一杯茶。" |
| b1-u10-l03 | `items/1/exampleEn` | 第②關：night gown 拼法不標準、nightgown 無級距，改用 dressing gown（晨袍） | "She put on her dressing gown and made some tea." | "A warm dressing gown is nice on winter mornings." |
| b1-u10-l03 | `items/1/exampleZh` | 第②關：night gown 拼法不標準、nightgown 無級距，改用 dressing gown（晨袍） | "她穿上晨袍，泡了一杯茶。" | "冬天早上有件暖和的晨袍很舒服。" |
| b1-u10-l04 | `items/9/audioZh` | 第③關建議：dollars 未指美國，「美元」改「元」 | "這雙涼鞋特價十美元，所以我買了兩雙。" | "這雙涼鞋特價十元，所以我買了兩雙。" |
| b1-u10-l04 | `items/14/questions/0/options/2` | 執行長裁示（正解最長偏差）：正解不可是唯一最長選項——縮短正解或補足干擾項細節，不改正解意思、不讓干擾項成立 | "不能穿涼鞋" | "上班不能穿涼鞋" |
| b1-u10-l04 | `items/14/questions/0/options/3` | 執行長裁示（正解最長偏差）：正解不可是唯一最長選項——縮短正解或補足干擾項細節，不改正解意思、不讓干擾項成立 | "一定要穿外套" | "一定要穿正式外套" |
| b1-u10-l04 | `items/16/rubricZh/1` | 執行長裁示（b1b2）：評分要點封閉清單——「可寫 A 或 B」「常用 X」一律改成「例如…等」，全級腳本掃描修正 | "可以寫人或地方" | "可以寫人、地方等" |
| b1-u10-l05 | `items/9/sentenceEn` | 第③關建議（採納）：跟讀和閱讀都是「婚禮上大家穿得很體面」，換情境 | "Everyone at the wedding was well-dressed." | "My uncle is always well-dressed, even at home." |
| b1-u10-l05 | `items/9/sentenceZh` | 第③關建議（採納）：跟讀和閱讀都是「婚禮上大家穿得很體面」，換情境 | "婚禮上每個人都穿得很體面。" | "我叔叔總是穿得很體面，連在家也是。" |
| b1-u10-l05 | `items/13/passageEn` | 第②關：穿薄毛衣覺得冷是預期結果，but still 不成立，改 so | "Last Sunday, my family went to my cousin's wedding. In the morning, my mother went to the hairdresser, and my father finally put away his old tracksuit and wore a suit. Everyone looked well-dressed. My grandmother wore her favorite jade necklace, which is more than fifty years old. I wore a light pullover, but I still felt slightly cold at night." | "Last Sunday, my family went to my cousin's wedding. In the morning, my mother went to the hairdresser, and my father finally put away his old tracksuit and wore a suit. Everyone looked well-dressed. My grandmother wore her favorite jade necklace, which is more than fifty years old. I wore only a light pullover, so I felt slightly cold at night." |
| b1-u10-l05 | `items/13/passageZh` | 中譯同步；my cousin 不譯成「表姊」（原文沒有性別、長幼） | "上星期天，我們全家去參加表姊的婚禮。早上，媽媽去了美髮店，爸爸終於收起他那套舊運動服，穿上了西裝。大家都穿得很體面。奶奶戴著她最喜歡的玉項鍊，那條項鍊已經五十多年了。我穿了一件薄的套頭毛衣，但晚上還是覺得有點冷。" | "上星期天，我們全家去參加表親的婚禮。早上，媽媽去了美髮店，爸爸終於收起他那套舊運動服，穿上了西裝。大家都穿得很體面。奶奶戴著她最喜歡的玉項鍊，那條項鍊已經五十多年了。我只穿了一件薄的套頭毛衣，所以晚上覺得有點冷。" |
| b1-u11-l01 | `items/14/questions/1/options/0` | 執行長裁示（正解最長偏差）：正解不可是唯一最長選項——縮短正解或補足干擾項細節，不改正解意思、不讓干擾項成立 | "木屋的主人" | "木屋原本的主人" |
| b1-u11-l01 | `items/14/questions/1/options/1` | 執行長裁示（正解最長偏差）：正解不可是唯一最長選項——縮短正解或補足干擾項細節，不改正解意思、不讓干擾項成立 | "一位學生" | "一位來露營的學生" |
| b1-u11-l01 | `items/14/questions/1/options/3` | 執行長裁示（正解最長偏差）：正解不可是唯一最長選項——縮短正解或補足干擾項細節，不改正解意思、不讓干擾項成立 | "一位無家可歸的男士" | "一位無家可歸的人" |
| b1-u11-l01 | `items/16/rubricZh/1` | 第③關疑似 S8（採納）：「常用」改「例如」 | "常用 take out the trash" | "例如 take out the trash、put the trash outside 等說法" |
| b1-u11-l02 | `items/6/exampleEn` | 第②關＋執行長裁示（事實正確）：上機規定因航空公司而異，改不涉及規定的中性敘述 | "You can't take a lighter on the plane." | "Dad keeps a lighter in the kitchen drawer." |
| b1-u11-l02 | `items/6/exampleZh` | 第②關＋執行長裁示（事實正確）：上機規定因航空公司而異，改不涉及規定的中性敘述 | "你不能帶打火機上飛機。" | "爸爸把打火機放在廚房的抽屜裡。" |
| b1-u11-l02 | `items/14/questions/1/options/1` | 執行長裁示（正解最長偏差）：正解不可是唯一最長選項——縮短正解或補足干擾項細節，不改正解意思、不讓干擾項成立 | "用來煮飯" | "她會抽菸" |
| b1-u11-l02 | `items/14/questions/1/options/2` | 執行長裁示（正解最長偏差）：正解不可是唯一最長選項——縮短正解或補足干擾項細節，不改正解意思、不讓干擾項成立 | "她會抽菸" | "用來煮飯" |
| b1-u11-l02 | `items/14/questions/1/options/3` | 執行長裁示（正解最長偏差）：正解不可是唯一最長選項——縮短正解或補足干擾項細節，不改正解意思、不讓干擾項成立 | "用來點暖爐" | "用來點家裡的暖爐" |
| b1-u11-l02 | `items/16/rubricZh/0` | 執行長裁示（b1b2）：評分要點封閉清單——「可寫 A 或 B」「常用 X」一律改成「例如…等」，全級腳本掃描修正 | "nap 表示「小睡」，常用 take a nap、have a nap" | "nap 表示「小睡」，例如 take a nap、have a nap 等說法" |
| b1-u11-l02 | `items/9/options/0` | 執行長更正（挑最長的期望命中率）：讓正解不落在最長選項集合裡——補足干擾項細節或縮短正解，不改正解意思、不讓干擾項成立 | "A new lamp." | "A new table for the kitchen." |
| b1-u11-l02 | `items/9/options/1` | 執行長更正（挑最長的期望命中率）：讓正解不落在最長選項集合裡——補足干擾項細節或縮短正解，不改正解意思、不讓干擾項成立 | "A new kitchen table." | "New paint for the walls." |
| b1-u11-l02 | `items/9/options/2` | 執行長更正（挑最長的期望命中率）：讓正解不落在最長選項集合裡——補足干擾項細節或縮短正解，不改正解意思、不讓干擾項成立 | "New paint for the walls." | "A new lamp." |
| b1-u11-l02 | `items/6/exampleEn` | 執行長裁示（b1b2）：情境對照表以現行檔案重做、逐列判定——lighter 單字卡和閱讀同為「把打火機放在抽屜」，只換主詞，改單字卡 | "Dad keeps a lighter in the kitchen drawer." | "This old lighter doesn't work anymore." |
| b1-u11-l02 | `items/6/exampleZh` | 執行長裁示（b1b2）：情境對照表以現行檔案重做、逐列判定——lighter 單字卡和閱讀同為「把打火機放在抽屜」，只換主詞，改單字卡 | "爸爸把打火機放在廚房的抽屜裡。" | "這個舊打火機已經不能用了。" |
| b1-u11-l03 | `items/14/questions/1/options/0` | 執行長裁示（正解最長偏差）：正解不可是唯一最長選項——縮短正解或補足干擾項細節，不改正解意思、不讓干擾項成立 | "洗碗機" | "廚房裡的洗碗機" |
| b1-u11-l03 | `items/14/questions/1/options/1` | 執行長裁示（正解最長偏差）：正解不可是唯一最長選項——縮短正解或補足干擾項細節，不改正解意思、不讓干擾項成立 | "臥室一條鬆掉的電線" | "臥室鬆掉的電線" |
| b1-u11-l03 | `items/14/questions/1/options/2` | 執行長裁示（正解最長偏差）：正解不可是唯一最長選項——縮短正解或補足干擾項細節，不改正解意思、不讓干擾項成立 | "陽台的門" | "水箱" |
| b1-u11-l03 | `items/14/questions/1/options/3` | 執行長裁示（正解最長偏差）：正解不可是唯一最長選項——縮短正解或補足干擾項細節，不改正解意思、不讓干擾項成立 | "水箱" | "陽台的門" |
| b1-u11-l03 | `items/15/rubricZh/2` | 執行長裁示（b1b2）：評分要點封閉清單——「可寫 A 或 B」「常用 X」一律改成「例如…等」，全級腳本掃描修正 | "時間片語可放句首或句尾" | "時間片語可放在句首、句尾等位置" |
| b1-u11-l03 | `items/14/questions/0/options/1` | 執行長更正（挑最長的期望命中率）：讓正解不落在最長選項集合裡——補足干擾項細節或縮短正解，不改正解意思、不讓干擾項成立 | "熨斗" | "鍋子、盤子和熨斗" |
| b1-u11-l03 | `items/14/questions/0/options/2` | 執行長更正（挑最長的期望命中率）：讓正解不落在最長選項集合裡——補足干擾項細節或縮短正解，不改正解意思、不讓干擾項成立 | "鍋子和盤子" | "熨斗" |
| b1-u11-l04 | `items/0/glossZh` | 第③關 FIX：本課聽打用 switch off（關掉），釋義補上 | "開關；（動詞）切換" | "開關；（動詞）打開、關掉；切換" |
| b1-u11-l04 | `items/6/exampleEn` | 第③關建議（採納）：a spoon of milk powder 偏口語 | "Add a spoon of milk powder to the water." | "Add some milk powder to the water." |
| b1-u11-l04 | `items/6/exampleZh` | 第③關建議（採納）：a spoon of milk powder 偏口語 | "在水裡加一湯匙奶粉。" | "在水裡加一些奶粉。" |
| b1-u11-l04 | `items/14/questions/0/options/3` | 執行長裁示（正解最長偏差）：正解不可是唯一最長選項——縮短正解或補足干擾項細節，不改正解意思、不讓干擾項成立 | "一個電燈開關" | "一個舊的電燈開關" |
| b1-u11-l04 | `items/15/rubricZh/0` | 第③關 FIX：要點把片語寫成定義，改「可寫，例如…等」 | "tissue 表示「面紙」，是可數名詞；a pack of tissues 是「一包面紙」" | "tissue 表示「面紙」，是可數名詞；「一包面紙」可寫，例如 a pack of tissues、a packet of tissues 等" |
| b1-u11-l04 | `items/14/questions/1/options/3` | 執行長更正（挑最長的期望命中率）：讓正解不落在最長選項集合裡——補足干擾項細節或縮短正解，不改正解意思、不讓干擾項成立 | "屋子裡有很多狗" | "屋子裡有很多流浪狗" |
| b1-u11-l05 | `items/7/exampleEn` | 第②關：緊的是蓋子，This jar is too tight 不自然，換說法 | "This jar is too tight to open." | "I can't open this jar of honey." |
| b1-u11-l05 | `items/7/exampleZh` | 第②關：緊的是蓋子，This jar is too tight 不自然，換說法 | "這個罐子太緊了，打不開。" | "我打不開這罐蜂蜜。" |
| b1-u11-l05 | `items/14/questions/0/options/1` | 執行長裁示（正解最長偏差）：正解不可是唯一最長選項——縮短正解或補足干擾項細節，不改正解意思、不讓干擾項成立 | "打掃地毯" | "把客廳地毯打掃乾淨" |
| b1-u11-l05 | `items/16/referenceEn/1` | 第③關疑似 S1（採納）：題目要「你」，參考答案 2 改用 I | "We light candles on birthday cakes." | "I light candles on my friends' birthday cakes." |
| b1-u11-l05 | `items/16/rubricZh/1` | 第③關疑似 S8（採納）：「常說」改「例如」 | "「點蠟燭」常說 light a candle" | "「點蠟燭」可寫，例如 light a candle、light candles 等" |
| b1-u11-l05 | `items/9/options/0` | 執行長更正（挑最長的期望命中率）：讓正解不落在最長選項集合裡——補足干擾項細節或縮短正解，不改正解意思、不讓干擾項成立 | "Smoke from the oven." | "A candle." |
| b1-u11-l05 | `items/9/options/1` | 執行長更正（挑最長的期望命中率）：讓正解不落在最長選項集合裡——補足干擾項細節或縮短正解，不改正解意思、不讓干擾項成立 | "A candle." | "Smoke from the oven door." |
| b1-u11-l05 | `items/14/questions/1/options/0` | 執行長更正（挑最長的期望命中率）：讓正解不落在最長選項集合裡——補足干擾項細節或縮短正解，不改正解意思、不讓干擾項成立 | "讀書" | "在火爐旁邊讀故事書" |
| b1-u11-l06 | `items/13/optionGlossZh/1` | 第②關：naked 是「赤裸的」，不是「光禿的」 | "光禿的" | "赤裸的" |
| b1-u11-l06 | `items/14/questions/0/options/0` | 執行長裁示（正解最長偏差）：正解不可是唯一最長選項——縮短正解或補足干擾項細節，不改正解意思、不讓干擾項成立 | "在浴室" | "在家裡的浴室" |
| b1-u11-l06 | `items/14/questions/0/options/1` | 執行長裁示（正解最長偏差）：正解不可是唯一最長選項——縮短正解或補足干擾項細節，不改正解意思、不讓干擾項成立 | "在餐廳" | "在屋外的河邊" |
| b1-u11-l06 | `items/14/questions/0/options/2` | 執行長裁示（正解最長偏差）：正解不可是唯一最長選項——縮短正解或補足干擾項細節，不改正解意思、不讓干擾項成立 | "在河邊" | "在餐廳" |
| b1-u11-l06 | `items/14/questions/0/options/3` | 執行長裁示（正解最長偏差）：正解不可是唯一最長選項——縮短正解或補足干擾項細節，不改正解意思、不讓干擾項成立 | "在一個金屬臉盆裡" | "在金屬臉盆裡" |
| b1-u11-l06 | `items/16/rubricZh/1` | 第③關疑似 S8（採納）：「常用」改「例如」 | "常用 use a hammer to…" | "例如 use a hammer to…、fix… with a hammer 等說法" |
| b1-u11-l06 | `items/14/questions/1/options/0` | 執行長更正（挑最長的期望命中率）：讓正解不落在最長選項集合裡——補足干擾項細節或縮短正解，不改正解意思、不讓干擾項成立 | "新鮮的水果" | "一些新鮮的水果" |
| b1-u11-l07 | `items/11/sentenceEn` | 第③關 FIX：filling 跟讀和單字卡同句型（This＋食物＋has a … filling），換主詞、情境、句型 | "This bread has a sweet pork filling." | "My mother makes the pork filling herself." |
| b1-u11-l07 | `items/11/sentenceZh` | 第③關 FIX：filling 跟讀和單字卡同句型（This＋食物＋has a … filling），換主詞、情境、句型 | "這種麵包包著甜甜的豬肉餡。" | "我媽媽自己做豬肉內餡。" |
| b1-u11-l07 | `items/16/rubricZh/0` | 執行長裁示（b1b2）：評分要點封閉清單——「可寫 A 或 B」「常用 X」一律改成「例如…等」，全級腳本掃描修正 | "gardening 是名詞「園藝」，可當主詞或接在 enjoy、like 後" | "gardening 是名詞「園藝」，例如當主詞、接在 enjoy、like 後等" |
| b1-u11-l07 | `items/9/options/2` | 執行長更正（挑最長的期望命中率）：讓正解不落在最長選項集合裡——補足干擾項細節或縮短正解，不改正解意思、不讓干擾項成立 | "They sleep less." | "They sleep less at night." |
| b1-u11-l07 | `items/14/questions/1/options/3` | 執行長更正（挑最長的期望命中率）：讓正解不落在最長選項集合裡——補足干擾項細節或縮短正解，不改正解意思、不讓干擾項成立 | "去超市買東西" | "去超市買很多東西" |
| b1-u11-l08 | `items/1/exampleEn` | 第②關＋第③關建議：gives light at the bedside 生硬；改一般說法（避開閱讀的 bedside table＋一杯水） | "A small lamp gives light at the bedside." | "She always keeps a book at her bedside." |
| b1-u11-l08 | `items/1/exampleZh` | 第②關＋第③關建議：gives light at the bedside 生硬；改一般說法（避開閱讀的 bedside table＋一杯水） | "床邊有一盞小燈照明。" | "她床邊總是放著一本書。" |
| b1-u11-l08 | `items/5/exampleZh` | 第②關：中譯拆成兩件事，改貼近原文 | "這種牙膏適合兒童使用，對牙齒很好。" | "這種牙膏對兒童的牙齒很好。" |
| b1-u11-l08 | `items/6/exampleEn` | 第③關疑似 S2（採納）：gall 單字卡和閱讀主詞都是 he、同句型，單字卡換主詞與情境 | "He had the gall to ask me for more money." | "My neighbor had the gall to park in my space." |
| b1-u11-l08 | `items/6/exampleZh` | 第③關疑似 S2（採納）：gall 單字卡和閱讀主詞都是 he、同句型，單字卡換主詞與情境 | "他竟然還有臉跟我要更多錢。" | "我的鄰居竟然好意思把車停在我的車位上。" |
| b1-u11-l08 | `items/13/options/0` | 第③關疑似 S3（採納）：干擾項 sponge 墊在杯子下也能讓桌子保持乾燥，換成 kettle | "sponge" | "kettle" |
| b1-u11-l08 | `items/13/optionGlossZh/0` | 第③關疑似 S3（採納）：干擾項 sponge 墊在杯子下也能讓桌子保持乾燥，換成 kettle | "海綿" | "水壺" |
| b1-u11-l08 | `items/16/rubricZh/0` | 執行長裁示（b1b2）：評分要點封閉清單——「可寫 A 或 B」「常用 X」一律改成「例如…等」，全級腳本掃描修正 | "knit 表示「編織」，過去式可寫 knitted" | "knit 表示「編織」，過去式例如 knitted、knit 等都可以" |
| b1-u11-l08 | `items/14/questions/0/options/1` | 執行長更正（挑最長的期望命中率）：讓正解不落在最長選項集合裡——補足干擾項細節或縮短正解，不改正解意思、不讓干擾項成立 | "洗浴室" | "洗家裡的整間浴室" |
| b1-u11-l08 | `items/14/questions/1/options/0` | 執行長更正（挑最長的期望命中率）：讓正解不落在最長選項集合裡——補足干擾項細節或縮短正解，不改正解意思、不讓干擾項成立 | "泡一壺茶" | "幫作者泡一壺熱熱的茶" |
| b1-u11-l08 | `items/1/exampleEn` | 執行長裁示（b1b2）：情境對照表以現行檔案重做、逐列判定——bedside 單字卡和閱讀同為「在床邊放東西」，只換主詞，改單字卡 | "She always keeps a book at her bedside." | "Grandma sat at my bedside and told me a story." |
| b1-u11-l08 | `items/1/exampleZh` | 執行長裁示（b1b2）：情境對照表以現行檔案重做、逐列判定——bedside 單字卡和閱讀同為「在床邊放東西」，只換主詞，改單字卡 | "她床邊總是放著一本書。" | "奶奶坐在我床邊講故事給我聽。" |
| b1-u11-l09 | `items/1/glossZh` | 第③關 FIX：例句的 ironing 是「待燙的衣服」，釋義補上 | "燙衣服（這件事）" | "燙衣服（這件事）；待燙的衣物" |
| b1-u11-l09 | `items/7/exampleEn` | 第②關＋第③關疑似 S9＋執行長裁示（事實正確）：改不涉及可查證事實的中性敘述 | "Old houses in Taiwan rarely have central heating." | "Our hotel room had central heating, so it was warm." |
| b1-u11-l09 | `items/7/exampleZh` | 第②關＋第③關疑似 S9＋執行長裁示（事實正確）：改不涉及可查證事實的中性敘述 | "台灣的老房子很少有中央暖氣。" | "我們的飯店房間有中央暖氣，所以很暖和。" |
| b1-u11-l09 | `items/14/questions/0/options/2` | 執行長裁示（正解最長偏差）：正解不可是唯一最長選項——縮短正解或補足干擾項細節，不改正解意思、不讓干擾項成立 | "倒垃圾，並把瓶子放進回收桶" | "倒垃圾、回收瓶子" |
| b1-u11-l09 | `items/14/questions/0/options/3` | 執行長裁示（正解最長偏差）：正解不可是唯一最長選項——縮短正解或補足干擾項細節，不改正解意思、不讓干擾項成立 | "整理弟弟的房間" | "幫忙整理弟弟的房間" |
| b1-u11-l09 | `items/15/rubricZh/1` | 第③關 FIX：要點封閉清單，改「例如…等」 | "「做家事」可寫 do housework、do the housework" | "「做家事」可寫，例如 do housework、do the housework、do the chores 等" |
| b1-u11-l09 | `items/7/exampleEn` | 執行長裁示（b1b2）：情境對照表以現行檔案重做、逐列判定——central heating 單字卡和閱讀同句型（Our … has/had … central heating, so…），改單字卡 | "Our hotel room had central heating, so it was warm." | "Central heating keeps the whole building warm." |
| b1-u11-l09 | `items/7/exampleZh` | 執行長裁示（b1b2）：情境對照表以現行檔案重做、逐列判定——central heating 單字卡和閱讀同句型（Our … has/had … central heating, so…），改單字卡 | "我們的飯店房間有中央暖氣，所以很暖和。" | "中央暖氣讓整棟大樓保持溫暖。" |
| b1-u11-l10 | `items/13/questions/1/options/0` | 執行長裁示（正解最長偏差）：正解不可是唯一最長選項——縮短正解或補足干擾項細節，不改正解意思、不讓干擾項成立 | "一台新電視" | "一台很大的新電視" |
| b1-u11-l10 | `items/13/questions/1/options/1` | 執行長裁示（正解最長偏差）：正解不可是唯一最長選項——縮短正解或補足干擾項細節，不改正解意思、不讓干擾項成立 | "前一家人留下的舊五斗櫃" | "一個舊五斗櫃" |
| b1-u11-l10 | `items/13/questions/1/options/3` | 執行長裁示（正解最長偏差）：正解不可是唯一最長選項——縮短正解或補足干擾項細節，不改正解意思、不讓干擾項成立 | "一組攪拌碗" | "一組全新的攪拌碗" |
| b1-u11-l10 | `items/8/options/0` | 執行長更正（挑最長的期望命中率）：讓正解不落在最長選項集合裡——補足干擾項細節或縮短正解，不改正解意思、不讓干擾項成立 | "The kids are asleep." | "The TV in the living room is broken." |
| b1-u11-l10 | `items/8/options/1` | 執行長更正（挑最長的期望命中率）：讓正解不落在最長選項集合裡——補足干擾項細節或縮短正解，不改正解意思、不讓干擾項成立 | "The TV is broken." | "There is no power." |
| b1-u11-l10 | `items/8/options/2` | 執行長更正（挑最長的期望命中率）：讓正解不落在最長選項集合裡——補足干擾項細節或縮短正解，不改正解意思、不讓干擾項成立 | "There is no power." | "The kids are asleep." |
| b1-u11-l10 | `items/0/exampleEn` | 執行長裁示（b1b2）：情境對照表以現行檔案重做、逐列判定——chest of drawers 單字卡和選擇題同為「把衣物放進五斗櫃」，改單字卡 | "I keep my socks in the chest of drawers." | "We need a chest of drawers for the baby's room." |
| b1-u11-l10 | `items/0/exampleZh` | 執行長裁示（b1b2）：情境對照表以現行檔案重做、逐列判定——chest of drawers 單字卡和選擇題同為「把衣物放進五斗櫃」，改單字卡 | "我把襪子放在五斗櫃裡。" | "我們需要一個五斗櫃放在寶寶的房間。" |
| b1-u12-l01 | `items/2/glossZh` | 第②關＋第③關建議：釋義重複 | "休息；（名詞）休息" | "休息（動詞、名詞）" |
| b1-u12-l01 | `items/14/passageZh` | 第②關＋第③關建議：a long illness 是「病了很久」，不是「大病」 | "去年 Sara 的日常作息改變了很多。生了一場大病之後，她決定找一份離家近一點的工作。一家小麵包店雇用了她，新的工作地點離她的公寓只有五分鐘。她七點開始工作，十點休息一下。週末時，她在兒童烹飪工作坊當志工。她說，在家附近找到工作讓她有更多時間陪家人。她的生活忙得不得了，但她很快樂。" | "去年 Sara 的日常作息改變了很多。病了很長一段時間之後，她決定找一份離家近一點的工作。一家小麵包店雇用了她，新的工作地點離她的公寓只有五分鐘。她七點開始工作，十點休息一下。週末時，她在兒童烹飪工作坊當志工。她說，在家附近找到工作讓她有更多時間陪家人。她的生活忙得不得了，但她很快樂。" |
| b1-u12-l01 | `items/14/questions/0/options/2` | 執行長裁示（正解最長偏差）：正解不可是唯一最長選項——縮短正解或補足干擾項細節，不改正解意思、不讓干擾項成立 | "離她家五分鐘的麵包店" | "家附近的麵包店" |
| b1-u12-l01 | `items/14/questions/0/options/3` | 執行長裁示（正解最長偏差）：正解不可是唯一最長選項——縮短正解或補足干擾項細節，不改正解意思、不讓干擾項成立 | "一家餐廳" | "市中心的一家大餐廳" |
| b1-u12-l01 | `items/14/questions/1/options/0` | 執行長裁示（正解最長偏差）：正解不可是唯一最長選項——縮短正解或補足干擾項細節，不改正解意思、不讓干擾項成立 | "繼續去麵包店上班" | "繼續去麵包店加班工作" |
| b1-u12-l01 | `items/14/questions/1/options/3` | 執行長裁示（正解最長偏差）：正解不可是唯一最長選項——縮短正解或補足干擾項細節，不改正解意思、不讓干擾項成立 | "在兒童烹飪工作坊當志工" | "在烹飪工作坊當志工" |
| b1-u12-l01 | `items/15/rubricZh/0` | 執行長裁示（b1b2）：評分要點封閉清單——「可寫 A 或 B」「常用 X」一律改成「例如…等」，全級腳本掃描修正 | "rest 可當動詞（rest for…）或名詞（take a rest）" | "rest 可當動詞（例如 rest for…）、名詞（例如 take a rest）等" |
| b1-u12-l01 | `items/15/rubricZh/1` | 第③關 FIX：要點寫死 rests，和參考答案 2 的 takes 矛盾 | "說習慣多用現在簡單式，主詞第三人稱單數用 rests" | "說習慣多用現在簡單式，動詞配合第三人稱單數（例如 rests、takes a rest）" |
| b1-u12-l01 | `items/9/options/3` | 執行長更正（挑最長的期望命中率）：讓正解不落在最長選項集合裡——補足干擾項細節或縮短正解，不改正解意思、不讓干擾項成立 | "At the school." | "At the school office." |
| b1-u12-l02 | `items/15/referenceEn/0` | 第②關：tire 很少接 a lot，改 really tire me out | "Long drives tire me a lot." | "Long drives really tire me out." |
| b1-u12-l02 | `items/16/rubricZh/0` | 執行長裁示（b1b2）：評分要點封閉清單——「可寫 A 或 B」「常用 X」一律改成「例如…等」，全級腳本掃描修正 | "hard-working 表示「勤奮的」，可放在名詞前或 be 動詞後" | "hard-working 表示「勤奮的」，例如放在名詞前、be 動詞後等" |
| b1-u12-l02 | `items/14/questions/1/options/1` | 執行長更正（挑最長的期望命中率）：讓正解不落在最長選項集合裡——補足干擾項細節或縮短正解，不改正解意思、不讓干擾項成立 | "遇到老朋友" | "掉了錢包" |
| b1-u12-l02 | `items/14/questions/1/options/2` | 執行長更正（挑最長的期望命中率）：讓正解不落在最長選項集合裡——補足干擾項細節或縮短正解，不改正解意思、不讓干擾項成立 | "掉了錢包" | "在車上遇到老朋友" |
| b1-u13-l01 | `items/15/rubricZh/0` | 執行長裁示（b1b2）：評分要點封閉清單——「可寫 A 或 B」「常用 X」一律改成「例如…等」，全級腳本掃描修正 | "tasty 表示「好吃的」，可放在 be 動詞後或名詞前" | "tasty 表示「好吃的」，例如放在 be 動詞後、名詞前等" |
| b1-u13-l01 | `items/16/referenceEn/1` | 第③關疑似 S6（採納）：參考答案 2 要寫出是自己最喜歡的菜 | "Rice is the most important ingredient in fried rice." | "Rice is the most important ingredient in my favorite dish, fried rice." |
| b1-u13-l01 | `items/6/exampleEn` | 執行長裁示（b1b2）：情境對照表以現行檔案重做、逐列判定——bakery 單字卡和聽選主詞都是 the bakery、句型相同，改單字卡 | "The bakery on the corner opens at six." | "My aunt runs a bakery in a small town." |
| b1-u13-l01 | `items/6/exampleZh` | 執行長裁示（b1b2）：情境對照表以現行檔案重做、逐列判定——bakery 單字卡和聽選主詞都是 the bakery、句型相同，改單字卡 | "轉角那家麵包店六點開門。" | "我阿姨在一個小鎮開麵包店。" |
| b1-u13-l01 | `items/11/sentenceEn` | 執行長裁示（b1b2）：情境對照表以現行檔案重做、逐列判定——grill 跟讀和單字卡同為「某人在戶外烤東西」，只換主詞，改跟讀 | "We grilled some corn and meat at the beach." | "Grilled corn is a popular snack at night markets." |
| b1-u13-l01 | `items/11/sentenceZh` | 執行長裁示（b1b2）：情境對照表以現行檔案重做、逐列判定——grill 跟讀和單字卡同為「某人在戶外烤東西」，只換主詞，改跟讀 | "我們在海邊烤了一些玉米和肉。" | "烤玉米是夜市很受歡迎的小吃。" |
| b1-u13-l02 | `items/14/questions/0/options/1` | 執行長裁示（正解最長偏差）：正解不可是唯一最長選項——縮短正解或補足干擾項細節，不改正解意思、不讓干擾項成立 | "Leo 建議的" | "因為起司捲成本比較低" |
| b1-u13-l02 | `items/14/questions/0/options/2` | 執行長裁示（正解最長偏差）：正解不可是唯一最長選項——縮短正解或補足干擾項細節，不改正解意思、不讓干擾項成立 | "起司捲比較便宜" | "Leo 建議的" |
| b1-u13-l02 | `items/14/questions/1/options/2` | 執行長裁示（正解最長偏差）：正解不可是唯一最長選項——縮短正解或補足干擾項細節，不改正解意思、不讓干擾項成立 | "做明天的爆米花" | "先做好明天要賣的爆米花" |
| b1-u13-l02 | `items/15/rubricZh/1` | 第③關 FIX：要點封閉清單，改「例如…等」 | "「裝滿了」可寫 is full of 或 is filled with" | "「裝滿了」可寫，例如 is full of、is filled with 等" |
| b1-u13-l02 | `items/16/rubricZh/0` | 執行長裁示（b1b2）：評分要點封閉清單——「可寫 A 或 B」「常用 X」一律改成「例如…等」，全級腳本掃描修正 | "taste 可當名詞（the taste of…）或動詞（tastes＋形容詞）" | "taste 可當名詞（例如 the taste of…）、動詞（例如 tastes＋形容詞）等" |
| b1-u13-l02 | `items/13/stemEn` | 執行長裁示（b1b2）：情境對照表以現行檔案重做、逐列判定——alcohol 選擇題和單字卡同為「X 含有（不含）酒精」，改題幹 | "Beer and wine both contain ____." | "You must be eighteen to buy ____ in this shop." |
| b1-u13-l02 | `items/13/stemZh` | 執行長裁示（b1b2）：情境對照表以現行檔案重做、逐列判定——alcohol 選擇題和單字卡同為「X 含有（不含）酒精」，改題幹 | "啤酒和葡萄酒都含有酒精。" | "在這家店要滿十八歲才能買酒。" |
| b1-u13-l03 | `items/15/rubricZh/1` | 第③關 FIX：要點封閉清單，改「例如…等」 | "「弟弟」可寫 younger brother 或 little brother" | "「弟弟」可寫，例如 younger brother、little brother 等" |
| b1-u13-l03 | `items/16/referenceEn/1` | 第③關 FIX：題目要「你」，參考答案 2 主詞是 My mom（又和單字卡同為第三人稱女性＋blends），改 I | "My mom blends carrots and apples into juice." | "I sometimes blend carrots and apples into juice." |
| b1-u13-l03 | `items/14/questions/1/options/0` | 執行長更正（挑最長的期望命中率）：讓正解不落在最長選項集合裡——補足干擾項細節或縮短正解，不改正解意思、不讓干擾項成立 | "一杯果汁" | "一杯新鮮果汁" |
| b1-u13-l03 | `items/14/questions/1/options/1` | 執行長更正（挑最長的期望命中率）：讓正解不落在最長選項集合裡——補足干擾項細節或縮短正解，不改正解意思、不讓干擾項成立 | "一些麵包" | "一盤沙拉" |
| b1-u13-l03 | `items/14/questions/1/options/2` | 執行長更正（挑最長的期望命中率）：讓正解不落在最長選項集合裡——補足干擾項細節或縮短正解，不改正解意思、不讓干擾項成立 | "一盤沙拉" | "一些麵包" |
| b1-u13-l03 | `items/16/referenceEn/1` | 執行長裁示（b1b2）：情境對照表以現行檔案重做、逐列判定——blend 造句參考 2 和單字卡同句型（blend A and B into／to make…），換情境與句型 | "I sometimes blend carrots and apples into juice." | "I use a machine to blend soup for my baby." |
| b1-u13-l04 | `items/6/exampleEn` | 第③關 FIX：feast 單字卡和閱讀同句型（地方＋holds a … feast），換主詞、情境、句型 | "The village holds a big feast after the harvest." | "My grandmother cooked a feast for the whole family." |
| b1-u13-l04 | `items/6/exampleZh` | 第③關 FIX：feast 單字卡和閱讀同句型（地方＋holds a … feast），換主詞、情境、句型 | "收成之後，村子會辦一場大宴席。" | "奶奶為全家人煮了一桌大餐。" |
| b1-u13-l04 | `items/13/stemEn` | 第③關 FIX：soil 名詞「土壤」是 B2 詞義，改 ground | "Plants get ____ from the soil and water." | "Plants get ____ from the ground and water." |
| b1-u13-l04 | `items/13/stemZh` | 中譯同步 | "植物從土壤和水中獲得養分。" | "植物從土地和水中獲得養分。" |
| b1-u13-l04 | `items/15/rubricZh/1` | 第③關 FIX：要點封閉清單，且漏收參考答案 2 的寫法 | "「胃口很好」可寫 have a good／big appetite" | "「胃口很好」可寫，例如 have a good／big appetite、my appetite is good 等" |
| b1-u13-l04 | `items/16/rubricZh/0` | 執行長裁示（b1b2）：評分要點封閉清單——「可寫 A 或 B」「常用 X」一律改成「例如…等」，全級腳本掃描修正 | "nutrient 表示「營養素」，常用複數 nutrients" | "nutrient 表示「營養素」，單數、複數都可以（例如 nutrients）" |
| b1-u13-l05 | `items/15/rubricZh/0` | 執行長裁示（b1b2）：評分要點封閉清單——「可寫 A 或 B」「常用 X」一律改成「例如…等」，全級腳本掃描修正 | "cabbage 可當不可數（cabbage）或可數（cabbages）" | "cabbage 可數、不可數都可以（例如 cabbage、cabbages）" |
| b1-u13-l05 | `items/15/rubricZh/1` | 第③關 FIX：要點封閉清單，改「例如…等」 | "「菜園」可寫 garden 或 vegetable garden" | "「菜園」可寫，例如 garden、vegetable garden 等" |
| b1-u13-l05 | `items/16/referenceEn/1` | 第③關疑似 S7（採納）：參考答案 2 要表態喜不喜歡 | "I often eat spinach with rice." | "I like spinach, so I often eat it with rice." |
| b1-u13-l05 | `items/14/questions/0/options/3` | 執行長更正（挑最長的期望命中率）：讓正解不落在最長選項集合裡——補足干擾項細節或縮短正解，不改正解意思、不讓干擾項成立 | "雞肉和萵苣" | "雞肉和一些新鮮萵苣" |
| b1-u13-l05 | `items/14/questions/1/options/2` | 執行長更正（挑最長的期望命中率）：讓正解不落在最長選項集合裡——補足干擾項細節或縮短正解，不改正解意思、不讓干擾項成立 | "自己種菜" | "自己在後院種一些菜" |
| b1-u13-l05 | `items/1/exampleEn` | 執行長裁示（b1b2）：情境對照表以現行檔案重做、逐列判定——bacon 單字卡和跟讀同為「I like／I'd like＋bacon…」，改單字卡 | "I like bacon and eggs for breakfast." | "The smell of bacon filled the kitchen." |
| b1-u13-l05 | `items/1/exampleZh` | 執行長裁示（b1b2）：情境對照表以現行檔案重做、逐列判定——bacon 單字卡和跟讀同為「I like／I'd like＋bacon…」，改單字卡 | "我早餐喜歡吃培根和蛋。" | "培根的香味充滿了廚房。" |
| b1-u13-l06 | `items/10/sentenceEn` | 第③關疑似 S4（採納）：juicy 跟讀和單字卡同句型（食物＋be＋juicy and…），換句型 | "The chicken was juicy and full of flavor." | "Choose the juicy pieces of meat for the soup." |
| b1-u13-l06 | `items/10/sentenceZh` | 第③關疑似 S4（採納）：juicy 跟讀和單字卡同句型（食物＋be＋juicy and…），換句型 | "這雞肉多汁又很有味道。" | "挑多汁的肉塊來煮湯。" |
| b1-u13-l06 | `items/12/stemEn` | 第③關 FIX：stuffed 題幹和單字卡同主詞 I、同情境（飽到吃不下），換主詞與情境 | "After the big dinner, I was too ____ to eat dessert." | "After eating two pizzas, my brother was too ____ to move." |
| b1-u13-l06 | `items/12/stemZh` | 第③關 FIX：stuffed 題幹和單字卡同主詞 I、同情境（飽到吃不下），換主詞與情境 | "吃完那頓大餐，我飽到吃不下甜點。" | "吃了兩個披薩之後，我弟弟撐到動不了。" |
| b1-u13-l06 | `items/16/rubricZh/0` | 執行長裁示（b1b2）：評分要點封閉清單——「可寫 A 或 B」「常用 X」一律改成「例如…等」，全級腳本掃描修正 | "juicy 表示「多汁的」，常放在名詞前或 be 動詞後" | "juicy 表示「多汁的」，例如放在名詞前、be 動詞後等" |
| b1-u13-l06 | `items/16/rubricZh/1` | 執行長裁示（b1b2）：評分要點封閉清單——「可寫 A 或 B」「常用 X」一律改成「例如…等」，全級腳本掃描修正 | "寫出是哪一種水果或食物" | "寫出是哪一種水果、食物等" |
| b1-u13-l06 | `items/10/sentenceEn` | 改後自查：新跟讀和 butcher 單字卡共用 pieces of meat，再換句型與情境 | "Choose the juicy pieces of meat for the soup." | "The chicken stayed juicy because we cooked it slowly." |
| b1-u13-l06 | `items/10/sentenceZh` | 改後自查：新跟讀和 butcher 單字卡共用 pieces of meat，再換句型與情境 | "挑多汁的肉塊來煮湯。" | "因為我們用慢火煮，雞肉保持多汁。" |
| b1-u13-l06 | `items/14/questions/0/options/0` | 執行長更正（挑最長的期望命中率）：讓正解不落在最長選項集合裡——補足干擾項細節或縮短正解，不改正解意思、不讓干擾項成立 | "柳橙" | "新鮮柳橙" |
| b1-u13-l06 | `items/14/questions/1/options/2` | 執行長更正（挑最長的期望命中率）：讓正解不落在最長選項集合裡——補足干擾項細節或縮短正解，不改正解意思、不讓干擾項成立 | "圖書館規定" | "圖書館規定不能喝" |
| b1-u13-l07 | `items/13/stemEn` | 第②關：thirst for 是比喻用法，用在真的想喝飲料不自然，題幹改比喻義（thirst 照課綱教動詞，B1 只列動詞） | "After the long hike, we ____ for a cold drink." | "After years in a small village, she ____ for life in a big city." |
| b1-u13-l07 | `items/13/stemZh` | 第②關：thirst for 是比喻用法，用在真的想喝飲料不自然，題幹改比喻義（thirst 照課綱教動詞，B1 只列動詞） | "走了很長的山路後，我們渴望來杯冷飲。" | "在小村子住了好幾年後，她渴望大城市的生活。" |
| b1-u13-l07 | `items/14/questions/0/options/1` | 執行長裁示（正解最長偏差）：正解不可是唯一最長選項——縮短正解或補足干擾項細節，不改正解意思、不讓干擾項成立 | "鱈魚賣得不好" | "新來的廚師不會炸魚" |
| b1-u13-l07 | `items/14/questions/0/options/2` | 執行長裁示（正解最長偏差）：正解不可是唯一最長選項——縮短正解或補足干擾項細節，不改正解意思、不讓干擾項成立 | "廚師不會炸魚" | "炸鱈魚最近賣得不好" |
| b1-u13-l07 | `items/14/questions/0/options/3` | 執行長裁示（正解最長偏差）：正解不可是唯一最長選項——縮短正解或補足干擾項細節，不改正解意思、不讓干擾項成立 | "有些客人說炸魚太油了" | "客人說炸魚太油" |
| b1-u13-l07 | `items/15/rubricZh/1` | 第③關 FIX：要點封閉清單，改「例如…等」 | "「太……吃不下」可寫 too oily, so I can't eat it 或 too oily for me to eat" | "「太……吃不下」可寫，例如 too oily, so I can't eat it、too oily for me to eat、I can't eat it because it is too oily 等" |
| b1-u13-l07 | `items/15/rubricZh/1` | 第③關 FIX（同上，縮短到 80 字內） | "「太……吃不下」可寫，例如 too oily, so I can't eat it、too oily for me to eat、I can't eat it because it is too oily 等" | "「太……吃不下」可寫，例如 too oily for me to eat、so oily that I can't eat it 等" |
| b1-u13-l07 | `items/9/options/2` | 執行長更正（挑最長的期望命中率）：讓正解不落在最長選項集合裡——補足干擾項細節或縮短正解，不改正解意思、不讓干擾項成立 | "Some ice cream." | "Some ice cream for dessert." |
| b1-u13-l08 | `items/13/passageEn` | 第③關 FIX：counter 名詞「櫃台」是 B2 詞義，拿掉 | "Kai works in the staff canteen of a large company. Every morning, he cuts courgettes and heats oil in a huge frying pan. Some workers say the food is tasteless, so Kai now adds more spices. In the afternoon, he stands behind a long counter like a barman and sells drinks. His favorite is a sweet drink made with flower nectar and lemon. His workplace is noisy, but he loves it." | "Kai works in the staff canteen of a large company. Every morning, he cuts courgettes and heats oil in a huge frying pan. Some workers say the food is tasteless, so Kai now adds more spices. In the afternoon, he works like a barman and sells drinks. His favorite is a sweet drink made with flower nectar and lemon. His workplace is noisy, but he loves it." |
| b1-u13-l08 | `items/13/passageZh` | 中譯同步 | "Kai 在一家大公司的員工餐廳工作。每天早上，他切櫛瓜，在一個巨大的平底鍋裡熱油。有些員工說菜沒味道，所以 Kai 現在會多加一些香料。下午，他像酒保一樣站在長長的櫃台後面賣飲料。他最喜歡的是一種用花蜜和檸檬做的甜飲料。他的工作場所很吵，但他很喜歡。" | "Kai 在一家大公司的員工餐廳工作。每天早上，他切櫛瓜，在一個巨大的平底鍋裡熱油。有些員工說菜沒味道，所以 Kai 現在會多加一些香料。下午，他像酒保一樣賣飲料。他最喜歡的是一種用花蜜和檸檬做的甜飲料。他的工作場所很吵，但他很喜歡。" |
| b1-u13-l08 | `items/13/questions/1/options/0` | 連動：第 2 小題正解改「像酒保一樣賣飲料」，干擾項補足細節使長度相近 | "煮晚餐" | "幫忙煮員工晚餐" |
| b1-u13-l08 | `items/13/questions/1/options/1` | 連動：第 2 小題正解改「像酒保一樣賣飲料」，干擾項補足細節使長度相近 | "在櫃台後面賣飲料" | "像酒保一樣賣飲料" |
| b1-u13-l08 | `items/13/questions/1/options/2` | 連動：第 2 小題正解改「像酒保一樣賣飲料」，干擾項補足細節使長度相近 | "去市場買菜" | "去市場買新鮮蔬菜" |
| b1-u13-l08 | `items/13/questions/1/options/3` | 連動：第 2 小題正解改「像酒保一樣賣飲料」，干擾項補足細節使長度相近 | "打掃廚房" | "把廚房打掃乾淨" |
| b1-u13-l08 | `items/14/rubricZh/1` | 第③關 FIX：要點封閉清單，改「例如…等」 | "「用……煮湯」可寫 make soup with…，或用 courgette soup" | "「用……煮湯」可寫，例如 make／cook soup with…、cook courgette soup 等" |
| b1-u13-l08 | `items/15/referenceEn/1` | 第③關 FIX：chewing gum 當動名詞「嚼口香糖」用到 chew（B2），且和要點「不可數名詞」矛盾 | "I think chewing gum on the bus is rude." | "I buy chewing gum before long bus trips." |
| b1-u14-l01 | `items/14/questions/0/options/0` | 執行長裁示（正解最長偏差）：正解不可是唯一最長選項——縮短正解或補足干擾項細節，不改正解意思、不讓干擾項成立 | "先放在門口" | "大家排隊自己去拿" |
| b1-u14-l01 | `items/14/questions/0/options/1` | 執行長裁示（正解最長偏差）：正解不可是唯一最長選項——縮短正解或補足干擾項細節，不改正解意思、不讓干擾項成立 | "大家自己去拿" | "先放在門口" |
| b1-u14-l01 | `items/15/rubricZh/1` | 第③關 FIX：要點封閉清單，改「例如…等」 | "「叫外帶」可寫 get／order a takeaway" | "「叫外帶」可寫，例如 get／order／have a takeaway 等" |
| b1-u14-l01 | `items/15/rubricZh/2` | 第③關 FIX：寫死 Let's… 句型 | "用 Let's… 表示提議" | "表示提議的寫法都可以（例如 Let's…、Shall we…?、Why don't we…?）" |
| b1-u14-l01 | `items/16/rubricZh/0` | 執行長裁示（b1b2）：評分要點封閉清單——「可寫 A 或 B」「常用 X」一律改成「例如…等」，全級腳本掃描修正 | "refreshments 表示「茶點」，通常用複數" | "refreshments 表示「茶點」，一般用複數形" |
| b1-u15-l01 | `items/0/exampleEn` | 第③關 FIX：consumption 單字卡和 mcq 同句型（X consumption is high），換情境與句型 | "Water consumption is higher in summer." | "This new car has low fuel consumption." |
| b1-u15-l01 | `items/0/exampleZh` | 第③關 FIX：consumption 單字卡和 mcq 同句型（X consumption is high），換情境與句型 | "夏天的用水量比較高。" | "這輛新車很省油。" |
| b1-u15-l01 | `items/15/rubricZh/1` | 第③關 FIX：要點封閉清單 | "問地點可用 Where is…? 或 Where can I find…?" | "問地點的寫法都可以（例如 Where is…?、Where can I find…?）" |
| b1-u15-l01 | `items/16/referenceEn/0` | 第③關疑似 S5（採納）：參考答案 1 和單字卡同主詞 The merchant、同為商人買賣貨物，換主詞 | "The merchant buys rice from farmers and sells it in the city." | "My uncle is a rice merchant, so he knows many farmers." |
| b1-u15-l01 | `items/9/options/2` | 執行長更正（挑最長的期望命中率）：讓正解不落在最長選項集合裡——補足干擾項細節或縮短正解，不改正解意思、不讓干擾項成立 | "The shop made a mistake." | "The shop made a mistake with it." |
| b1-u15-l02 | `items/15/rubricZh/0` | 執行長裁示（b1b2）：評分要點封閉清單——「可寫 A 或 B」「常用 X」一律改成「例如…等」，全級腳本掃描修正 | "tax 表示「稅」，常用不可數" | "tax 表示「稅」，一般當不可數名詞" |
| b1-u15-l02 | `items/15/rubricZh/1` | 第③關 FIX：要點封閉清單，改「例如…等」 | "「含稅」可寫 include tax 或 tax is included" | "「含稅」可寫，例如 include tax、tax is included 等" |
| b1-u15-l02 | `items/9/options/0` | 執行長更正（挑最長的期望命中率）：讓正解不落在最長選項集合裡——補足干擾項細節或縮短正解，不改正解意思、不讓干擾項成立 | "Ten dollars." | "Nothing." |
| b1-u15-l02 | `items/9/options/1` | 執行長更正（挑最長的期望命中率）：讓正解不落在最長選項集合裡——補足干擾項細節或縮短正解，不改正解意思、不讓干擾項成立 | "Nothing." | "Twenty dollars." |
| b1-u15-l02 | `items/6/exampleEn` | 執行長裁示（b1b2）：情境對照表以現行檔案重做、逐列判定——afford 單字卡和選擇題同為「買不起車／房」，只換主詞，改單字卡 | "We can't afford a new car this year." | "I can't afford to take a long holiday this year." |
| b1-u15-l02 | `items/6/exampleZh` | 執行長裁示（b1b2）：情境對照表以現行檔案重做、逐列判定——afford 單字卡和選擇題同為「買不起車／房」，只換主詞，改單字卡 | "我們今年買不起新車。" | "我今年負擔不起長假。" |
| b1-u15-l03 | `items/0/exampleEn` | 第②關＋執行長裁示（新內容界線）：不寫理財／投資建議，invest 例句改中性事實 | "Young people should start to invest early." | "The company invested in new computers last year." |
| b1-u15-l03 | `items/0/exampleZh` | 第②關＋執行長裁示（新內容界線）：不寫理財／投資建議，invest 例句改中性事實 | "年輕人應該及早開始投資。" | "公司去年投資購買了新電腦。" |
| b1-u15-l03 | `items/5/exampleEn` | 第③關疑似 S13（採納）：finance 單字卡和上一課 fund 單字卡同句型、同情境（機構出資蓋設施），換情境 | "A local bank will finance the new sports center." | "My parents helped me finance my studies." |
| b1-u15-l03 | `items/5/exampleZh` | 第③關疑似 S13（採納）：finance 單字卡和上一課 fund 單字卡同句型、同情境（機構出資蓋設施），換情境 | "一家本地銀行將出資興建新的運動中心。" | "我爸媽幫我支付學業的費用。" |
| b1-u15-l03 | `items/7/exampleEn` | 第②關＋執行長裁示（新內容界線）：不寫飲食建議，consume 例句改中性事實 | "We should consume less sugar and salt." | "Our family consumes a lot of rice." |
| b1-u15-l03 | `items/7/exampleZh` | 第②關＋執行長裁示（新內容界線）：不寫飲食建議，consume 例句改中性事實 | "我們應該少吃一點糖和鹽。" | "我們家吃很多米飯。" |
| b1-u15-l03 | `items/14/questions/1/options/2` | 執行長裁示（正解最長偏差）：正解不可是唯一最長選項——縮短正解或補足干擾項細節，不改正解意思、不讓干擾項成立 | "請他們來工作" | "請他們來餐館工作" |
| b1-u15-l03 | `items/15/rubricZh/2` | 第③關 FIX：要點封閉清單（energy 是 B2，只放在要點讓批改照收） | "「電」可寫 electricity 或 power" | "「電」可寫，例如 electricity、power、energy 等" |
| b1-u15-l03 | `items/16/rubricZh/1` | 執行長裁示（b1b2）：評分要點封閉清單——「可寫 A 或 B」「常用 X」一律改成「例如…等」，全級腳本掃描修正 | "可放在名詞前或 be 動詞後" | "例如放在名詞前、be 動詞後等" |
| b1-u15-l03 | `items/7/exampleEn` | 改後自查：新 consume 單字卡和翻譯同句型（X consumes a lot of Y），改被動句、換情境 | "Our family consumes a lot of rice." | "Most of the fruit from this farm is consumed in the city." |
| b1-u15-l03 | `items/7/exampleZh` | 改後自查：新 consume 單字卡和翻譯同句型（X consumes a lot of Y），改被動句、換情境 | "我們家吃很多米飯。" | "這座農場的水果大多在城市裡被吃掉。" |
| b1-u15-l03 | `items/14/questions/0/options/2` | 執行長更正（挑最長的期望命中率）：讓正解不落在最長選項集合裡——補足干擾項細節或縮短正解，不改正解意思、不讓干擾項成立 | "銀行職員" | "一家銀行的職員" |
| b1-u15-l04 | `items/13/passageEn` | 第③關 FIX：counter 名詞「櫃台」是 B2 詞義，改 staff | "Lena works in retail at a gift shop near the airport. Many tourists pay in foreign currency, and the shop changes it at the counter. Members get a ten percent discount on most items. Some customers buy expensive watches, which are a luxury for most people. Before New Year, the shop looks very festive. It also sells lottery tickets. Last year, a young traveler who was almost penniless bought a ticket there and won a small prize." | "Lena works in retail at a gift shop near the airport. Many tourists pay in foreign currency, and the staff can change it for them. Members get a ten percent discount on most items. Some customers buy expensive watches, which are a luxury for most people. Before New Year, the shop looks very festive. It also sells lottery tickets, but Lena never buys them. Last year, a young traveler lost his wallet there, and Lena helped him call home." |
| b1-u15-l04 | `items/13/passageZh` | 中譯同步 | "Lena 在機場附近的一家禮品店從事零售工作。許多觀光客用外幣付款，店家會在櫃台幫忙換錢。會員大部分商品可以打九折。有些客人會買昂貴的手錶，對大多數人來說那是奢侈品。新年前，這家店看起來很有節慶氣氛。店裡也賣彩券。去年，一位幾乎身無分文的年輕旅客在那裡買了一張彩券，中了一個小獎。" | "Lena 在機場附近的一家禮品店從事零售工作。許多觀光客用外幣付款，店員可以幫他們換錢。會員大部分商品可以打九折。有些客人會買昂貴的手錶，對大多數人來說那是奢侈品。新年前，這家店看起來很有節慶氣氛。店裡也賣彩券，但 Lena 從來不買。去年，一位年輕旅客在店裡掉了錢包，Lena 幫他打電話回家。" |
| b1-u15-l04 | `items/13/questions/1/options/0` | 連動：第 2 小題正解改「掉了錢包」 | "掉了錢包" | "找到工作" |
| b1-u15-l04 | `items/13/questions/1/options/1` | 連動：第 2 小題正解改「掉了錢包」 | "買彩券中了小獎" | "掉了錢包" |
| b1-u15-l04 | `items/13/questions/1/options/2` | 連動：第 2 小題正解改「掉了錢包」 | "找到工作" | "買彩券中獎" |
| b1-u15-l04 | `items/14/rubricZh/1` | 第③關 FIX：要點封閉清單，改「例如…等」 | "「付訂金」可寫 pay a deposit" | "「付訂金」可寫，例如 pay a deposit、put down a deposit 等" |
| b1-u15-l04 | `items/15/referenceEn/1` | 執行長裁示（新內容界線）：不寫鼓勵博弈的內容，「中樂透就去環遊世界」改中性 | "If I won the lottery, I would travel around the world." | "I have never bought a lottery ticket in my life." |
| b1-u15-l04 | `items/15/rubricZh/1` | 連動：要點不再示範 win the lottery | "可用 buy lottery tickets、win the lottery 等說法" | "可用 buy lottery tickets、play the lottery 等說法" |
| b1-u15-l04 | `items/15/rubricZh/2` | 連動：參考答案不再用假設語氣 | "說假設的情況可用 If I won…, I would…" | "時態配合內容（例如說經驗可用現在完成式 have never bought）" |
| b1-u15-l05 | `items/14/rubricZh/1` | 第③關 FIX：要點封閉清單，改「例如…等」 | "「書店」可寫 bookshop 或 bookstore" | "「書店」可寫，例如 bookshop、bookstore 等" |
| b1-u15-l05 | `items/13/questions/1/options/3` | 執行長更正（挑最長的期望命中率）：讓正解不落在最長選項集合裡——補足干擾項細節或縮短正解，不改正解意思、不讓干擾項成立 | "一頓大餐" | "一頓豐盛的大餐" |

## 不改的項目與理由

| 課 | 位置 | 理由 |
|---|---|---|
| b1-u13-l07 | `items/7` | 第②關：thirst 詞性疑慮——lexicon 中 thirst 名詞是 B2、動詞是 B1，照課綱教動詞「渴望」，維持 |
