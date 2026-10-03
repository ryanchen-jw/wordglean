# TASK-9 B1 聽選換句話說補正對照表（b1-listen-retrofit）

> 2026-10-03。依執行長裁示「聽選正解不可照抄音檔」（t9/b2cd1-rulings.md）補正 B1 全級 269 題聽選（listenChoice）。只改選項：音檔、題目、正解位置都沒動。每處改動已寫進該課 judge.resolvedAfterFinalReview（說明開頭「執行長裁示：聽選換句話說補正：」）。
>
> 找題方式：腳本先算「音檔實詞（去掉功能詞、粗略詞形還原）在各選項的命中數」，標出正解命中數嚴格高於所有干擾項（209 題）或正解實詞全部出自音檔（另 34 題），再逐題人工讀過 269 題判斷是否照抄、是否正解是唯一帶額外細節的選項。
>
> 改法：正解換句話說（同義詞、改結構、概括），不加音檔沒說的資訊、不設定說話者性別或身分；干擾項改用音檔裡的字做成「看起來像音檔、但意思不對」的選項；同時把選項長度調到符合長度名次分布與 0.5～2 倍規則。

## 結果

- 改到選項的題：**200 題**（清單見文末「改到選項的題 id」）。不改：69 題（理由見「不改的題」）。
- `node scripts/check-items.mjs --require-judge items/b1/*.json`：269 課全綠；五級 984 課 --require-judge 全綠；用字範圍（OVER_LEVEL／UNLEVELED）0 筆。
- `npm test`：209／209 通過。

### 聽選長度名次分布（四選一，每個名次應在 13%–37%）

批次以單元劃分：第 1 批＝u01（pilot）＋u02～u07，第 2 批＝u08～u15，第 3 批＝u16～u25，第 4 批＝u26～u43。

| 範圍 | 題數 | 改前 第1/2/3/4長 | 改後 第1/2/3/4長 |
|---|---|---|---|
| B1 全級 | 269 | 22.2% / 26.0% / 27.9% / 23.9% | 26.8% / 28.3% / 24.9% / 20.1% |
| 第 1 批 | 57 | 20.2% / 22.8% / 36.0% / 21.1% | 22.8% / 31.6% / 24.6% / 21.1% |
| 第 2 批 | 48 | 9.4% / 26.4% / 29.5% / 34.7% | 25.0% / 17.0% / 30.6% / 27.4% |
| 第 3 批 | 48 | 26.0% / 30.2% / 21.9% / 21.9% | 33.3% / 34.4% / 15.6% / 16.7% |
| 第 4 批 | 116 | 27.0% / 25.7% / 25.7% / 21.6% | 26.7% / 28.7% / 26.6% / 18.0% |

第 1 批不含 pilot u01（u02～u07，51 題）改後：18.6% / 32.4% / 27.5% / 21.6%。改前第 2 批「最長」只有 9.4%（低於 13%），這次一併修正。

0.5～2 倍規則：改後每題每個選項長度都在其他選項平均的 0.5～2 倍內（檢查器 ANSWER_LONGEST 單題異常值 0 筆）。

改後用同一支腳本複掃：200 題中仍有 23 題「正解的音檔實詞命中數高於干擾項」（多 1 個的 22 題；u08-l02 列舉題多 2 個），逐題看過都保留，理由如下：
- 數值或時間題，數字本身無法換掉（例如 u18-l05、u20-l03、u42-l09）。
- 列舉題，正解要列出音檔裡的每一項（例如 u08-l02）。
- 正解已經改寫，只剩一個核心名詞相同，干擾項也用到音檔的其他字（例如 u12-l01、u22-l03、u27-l03）。
- 腳本的詞形還原比較粗略，算出來的命中數偏多。

另有 9 題的干擾項沒有用到音檔的字（u08-l07、u13-l04、u22-l02、u25-l01、u29-l07、u33-l01、u36-l01、u37-l02、u43-l01）。這些題的音檔除了答案以外，沒有能做成合理錯誤選項的字；正解都已經換句話說，所以照現況保留。

## 改了哪些題（粗體＝正解；正解位置不變）

| 題 id | 音檔 | 改前 | 改後 |
|---|---|---|---|
| b1-u01-l01-q11 | Despite the long delay, Lisa stayed calm and waited for the next train. | She went home. ／ **She waited for the next train.** ／ She took a taxi. ／ She called her boss. | She got upset about the long delay. ／ **She waited quietly for another train.** ／ She left the station after a while. ／ She called her boss. |
| b1-u01-l02-q11 | Rachel called three shops, but none of them had the book she wanted. | No, she forgot to call. ／ Yes, the first shop had it. ／ Yes, she bought it online. ／ **No, none of the shops had it.** | No, she called only one shop. ／ Yes, one of the three shops had it. ／ Yes, she bought it online. ／ **No, she couldn't get it from any shop.** |
| b1-u01-l03-q10 | Whenever Helen feels stressed, she goes for a long walk beneath the trees. | **She goes for a walk.** ／ She calls her friends. ／ She goes to sleep. ／ She eats something sweet. | **She walks for a long time.** ／ She sits under the trees. ／ She goes for a long drive. ／ She eats something sweet. |
| b1-u01-l04-q10 | The weather was bad. Nevertheless, Daniel went running in the park. | He went shopping. ／ He stayed at home. ／ **He went running.** ／ He watched TV. | He went to a café. ／ He stayed at home. ／ **He still ran.** ／ He sat in the park. |
| b1-u01-l05-q10 | Peter forgot his umbrella and consequently got wet on the way home. | **He forgot his umbrella.** ／ He fell into the river. ／ He washed his car. ／ He went swimming. | **He didn't have his umbrella.** ／ He fell on the way home. ／ His umbrella was broken. ／ He went swimming. |
| b1-u01-l06-q10 | Tom used to drive to work, but now he takes the train instead of driving. | He rides a bike. ／ He drives his car. ／ He walks. ／ **He takes the train.** | He rides a bike. ／ He still drives to work. ／ He walks there. ／ **He goes by train.** |
| b1-u02-l01-q11 | The meeting has moved to Thursday, and the deadline is now next Monday. | Next Friday. ／ This Thursday. ／ **Next Monday.** ／ Tomorrow morning. | Next Thursday. ／ This Thursday. ／ **Monday of next week.** ／ Tomorrow morning. |
| b1-u02-l05-q10 | I'm working in a temporary office this month, but I'll move back to the main office in June. | Start a new job at another company. ／ Work from home. ／ Take a long vacation. ／ **Move back to the main office.** | Start in a temporary office. ／ Work from home. ／ Take a long vacation. ／ **Return to the head office.** |
| b1-u02-l06-q10 | Let's leave the beach after the sunset and have dinner in town. | Before the sunset. ／ **After the sunset.** ／ At sunrise tomorrow. ／ At noon after lunch. | Before the sunset. ／ **Once the sun has gone down.** ／ After dinner in town. ／ At noon after lunch. |
| b1-u03-l01-q10 | When the fire alarm rings, avoid the elevator and use the exit at the end of the hall. | Take the elevator down to the first floor. ／ **Use the exit at the end of the hall.** ／ Wait quietly in the office until help comes. ／ Call the front desk right away. | Take the elevator down to the first floor. ／ **Go out through the exit down the hall.** ／ Wait at the end of the hall for help. ／ Call the front desk right away. |
| b1-u03-l02-q10 | My gym membership ends this month, so I will renew it on Saturday. | Stop going to the gym. ／ Join a new gym. ／ **Renew the gym membership.** ／ Buy new sports clothes. | End the gym membership. ／ Join a new gym. ／ **Sign up for the gym again.** ／ Buy new sports clothes. |
| b1-u03-l03-q10 | The office will be closed on Monday because we need to rearrange all the furniture. | **To rearrange the furniture.** ／ To clean the windows. ／ Because it is a holiday. ／ To move to a new building. | **To change where the furniture goes.** ／ To buy all new furniture. ／ Because it is a holiday. ／ To move to a new building. |
| b1-u03-l04-q10 | Before the meeting, please remove the old posters and hang the new ones on the wall. | Clean the meeting room. ／ Paint the wall. ／ **Hang the new posters.** ／ Print the old posters again. | Hang the old posters again. ／ Clean the meeting room. ／ **Replace the old posters.** ／ Take the posters down after the meeting. |
| b1-u03-l05-q10 | Please press the green button, and the door will open. | Press the red button twice. ／ Use a key card. ／ **Press the green button.** ／ Call the front desk for help. | Press the red button twice. ／ Use a key card. ／ **Use the green button.** ／ Wait for the door to open. |
| b1-u03-l06-q10 | We will promote our new tea in big supermarkets next month. | In small shops near schools. ／ On the radio every morning. ／ **In big supermarkets.** ／ At the train station. | In small shops near schools. ／ In small supermarkets. ／ **In large food stores.** ／ At the train station. |
| b1-u03-l07-q10 | The library has extended its opening hours, so now it closes at ten. | **At ten.** ／ At eight. ／ At nine. ／ At six. | **Ten o'clock, later than before.** ／ Ten o'clock, the same as before. ／ Nine o'clock, earlier than before. ／ It opens at ten now. |
| b1-u03-l08-q10 | When I asked if he was ready, he answered with a nod. | He laughed. ／ He said no. ／ **He gave a nod.** ／ He shook his head. | He said he wasn't ready. ／ He said no. ／ **He nodded his head.** ／ He shook his head. |
| b1-u03-l10-q10 | I slipped on the stairs this morning, but luckily I was not hurt. | Missed the bus to work. ／ Lost a key at home. ／ Fell off a bike on the road. ／ **Slipped on the stairs.** | Got hurt on the stairs. ／ Lost a key at home. ／ Fell off a bike on the road. ／ **Slipped but didn't get hurt.** |
| b1-u04-l01-q11 | The machine stopped because of a mechanical problem, so the workers went home early. | It was a holiday. ／ The boss was away. ／ **The machine had a problem.** ／ It rained heavily all morning. | The workers had a holiday. ／ The boss went home early. ／ **The machine wasn't working.** ／ It rained heavily all morning. |
| b1-u04-l02-q11 | The new library is accessible to everyone, and it opens at seven every morning. | At eight. ／ At nine. ／ **At seven.** ／ At ten. | At seven in the evening. ／ At eight every morning. ／ **Seven in the morning.** ／ At nine every morning. |
| b1-u04-l03-q11 | Sorry, I have to leave now. There's an urgent problem at the office. | **A problem at the office.** ／ A train that he must catch soon. ／ A friend's birthday party. ／ A forgotten bag. | **An urgent matter at work.** ／ The office is closing now. ／ A friend's birthday party. ／ A forgotten bag. |
| b1-u04-l04-q10 | I'm not able to join the trip on Saturday because I have to work. | Because of money. ／ Because of the weather. ／ **Because of work.** ／ Because of a party. | Because of the money. ／ Because the trip is on Sunday. ／ **Because of a job.** ／ Because of a party. |
| b1-u04-l05-q10 | This sort of phone is popular with students because it's cheap. | Because it's new. ／ Because it's small. ／ **Because it's cheap.** ／ Because it's colorful. | Because it's new. ／ Because it's made for students. ／ **Because it doesn't cost much.** ／ Because it's colorful. |
| b1-u04-l06-q10 | You can call the manager directly. Her number is on the card. | **Call her directly.** ／ Send her a letter. ／ Ask the front desk. ／ Visit her office. | **Phone her yourself.** ／ Send her a card. ／ Ask the front desk. ／ Visit her office. |
| b1-u04-l07-q10 | Only staff can read this email because it is an internal message. | **Only the staff.** ／ All the customers. ／ Anyone online. ／ Only the manager. | **Only the workers.** ／ All the customers. ／ Anyone with an email. ／ Only the manager. |
| b1-u04-l08-q10 | This shop is definitely closed today, so let's come back tomorrow. | **Come back tomorrow.** ／ Wait outside. ／ Go to another shop. ／ Call the owner. | **Return the next day.** ／ Wait until it opens today. ／ Go to another shop. ／ Come back later today. |
| b1-u05-l01-q10 | The cake was divided evenly, so each child got the same size. | A bigger piece. ／ **The same size.** ／ Nothing at all. ／ Two pieces. | A bigger piece. ／ **An equal piece.** ／ A different size. ／ Two pieces. |
| b1-u05-l02-q10 | The majority of our customers are young people, particularly students. | Business people. ／ Older people. ／ **Young people.** ／ Tourists. | Older customers. ／ Business customers. ／ **Mostly the young.** ／ Customers from abroad. |
| b1-u05-l03-q10 | We need two dozen cups for the party, so please buy twenty-four. | Twelve. ／ **Twenty-four.** ／ Forty-two. ／ Twenty. | Two dozen and four. ／ **Two sets of twelve.** ／ Forty-two in all. ／ Just one dozen. |
| b1-u05-l04-q10 | The meeting room is small. It has a capacity of only ten people. | Twenty people. ／ **Ten people.** ／ Five people. ／ Fifteen people. | Twenty people. ／ **No more than ten.** ／ Only five people. ／ At least ten. |
| b1-u05-l06-q10 | The meeting will last approximately two hours, so let's start on time. | **About two hours.** ／ About one hour. ／ About three hours. ／ About thirty minutes. | **Around two hours.** ／ About one hour. ／ Exactly two hours. ／ About thirty minutes. |
| b1-u05-l10-q09 | The hotel is three miles from the airport, so a taxi takes about ten minutes. | **Three miles.** ／ Twenty miles. ／ Thirty miles. ／ Two miles. | **Three miles.** ／ Ten miles. ／ Thirty miles. ／ Two miles. |
| b1-u06-l01-q10 | I'm calling on behalf of Ms. Wang to change the meeting time. | The hotel. ／ The manager. ／ **Ms. Wang.** ／ The airline. | The hotel. ／ Ms. Wang's manager. ／ **Ms. Wang.** ／ The airline. |
| b1-u06-l03-q10 | I assumed the shop was open on Sunday, but it was closed. | The shop was very busy. ／ **The shop was closed.** ／ The shop had moved. ／ The shop had a sale. | The shop was open. ／ **The shop wasn't open.** ／ The shop had moved. ／ The shop had a sale. |
| b1-u06-l04-q10 | I'm concerned that we don't have enough chairs for the party. | Not enough food. ／ Too many guests came. ／ Bad weather. ／ **Not enough chairs.** | Not enough food. ／ The cost of the chairs. ／ Missing the party. ／ **Too few seats.** |
| b1-u06-l05-q10 | The manager refused our plan because it would cost too much. | **It would cost too much.** ／ It would take too long. ／ It was too simple. ／ Nobody liked it. | **It was too expensive.** ／ It would take too long. ／ The plan was too simple. ／ Nobody liked it. |
| b1-u06-l06-q10 | Please read my proposal and send me your comments by Friday. | **Send comments on the proposal.** ／ Write a new proposal for Friday. ／ Call the manager about the plan. ／ Book a meeting room. | **Say what they think of the plan.** ／ Write a new proposal for Friday. ／ Send the proposal to the manager. ／ Book a meeting room. |
| b1-u06-l07-q10 | I estimate that about fifty people will come to the party. | About five. ／ About fifteen. ／ About five hundred. ／ **About fifty.** | Exactly fifty. ／ About fifteen. ／ About five hundred. ／ **Close to fifty.** |
| b1-u07-l01-q10 | Our sales went up this year, but higher costs caused a small loss. | Fast growth. ／ No change at all. ／ **A small loss.** ／ A big success. | Sales went down this year. ／ No change at all. ／ **They lost a little money.** ／ Higher sales and no loss. |
| b1-u07-l04-q10 | The house has a strong foundation, so it's safe even in strong winds. | It is very new. ／ **It has a strong foundation.** ／ It is very small. ／ It is made of glass. | It has strong walls. ／ **It is built on a solid base.** ／ The winds are not strong. ／ It is made of glass. |
| b1-u07-l05-q10 | The town's tourism boom began when a new train station opened. | When a big hotel was built. ／ When a movie was made there. ／ When a music festival started. ／ **When a new train station opened.** | When a new hotel opened. ／ When a movie was made there. ／ When the old train station closed. ／ **After the town got a new station.** |
| b1-u07-l06-q09 | Sorry for the disturbance, but we need to check the lights in your room. | **To check the lights.** ／ To clean the room. ／ To bring towels. ／ To deliver food to the guests. | **To look at the lights.** ／ To clean the room. ／ To bring towels. ／ To check the heater in the room. |
| b1-u07-l07-q09 | The new manager's first year was disastrous, so the company asked him to leave. | He was always late. ／ He wanted more money from the company. ／ **His first year went very badly.** ／ He moved abroad. | He was new to the company. ／ He wanted more money from the company. ／ **His first year went very badly.** ／ He asked to leave the company. |
| b1-u08-l01-q11 | The landlord said we can keep a cat if we clean the apartment every week. | If the neighbors agree. ／ If they pay more rent. ／ If the cat stays outside. ／ **If they clean every week.** | If the landlord can visit every week. ／ If they pay more rent. ／ If the cat stays outside the apartment. ／ **If they clean the place weekly.** |
| b1-u08-l02-q10 | Our neighborhood has a small park, a bakery, and a very good school. | A big shopping mall and a cinema. ／ **A park, a bakery, and a school.** ／ A hospital and a bank. ／ A train station and a big hotel. | A small park and a cinema. ／ **A good school, a bakery, and a little park.** ／ A good school and a hospital. ／ A bakery and a train station. |
| b1-u08-l03-q10 | Ladies and gentlemen, the show will begin in five minutes. | **In five minutes.** ／ In fifteen minutes. ／ In one hour. ／ Right now. | **Five minutes from now.** ／ In fifteen minutes. ／ In one hour. ／ Five minutes ago. |
| b1-u08-l04-q10 | Most inhabitants of this village are farmers over sixty. | Young students. ／ **Farmers over sixty.** ／ Shop owners. ／ Tourists in summer. | Young farmers. ／ **Older people who farm.** ／ Shop owners over sixty. ／ Tourists in summer. |
| b1-u08-l05-q10 | My niece and nephew are coming to stay with us this weekend. | The speaker's parents and their dog. ／ Two friends from the speaker's work. ／ A new neighbor from next door. ／ **The speaker's niece and nephew.** | The speaker's niece and her friend. ／ Two friends from the speaker's work. ／ The speaker's nephew and his dog. ／ **The children of the speaker's sister or brother.** |
| b1-u08-l07-q10 | The first lady will visit our school on Friday, so classes will end at noon. | At ten. ／ At three. ／ **At noon.** ／ At two. | At one o'clock. ／ At three o'clock. ／ **At twelve o'clock.** ／ At two o'clock. |
| b1-u09-l01-q10 | I'm eager to start my new job, but I'm a little nervous too. | **Eager but a little nervous.** ／ Bored and tired. ／ Angry and sad. ／ Not interested in the new job at all. | **Excited but a bit worried.** ／ Not eager at all. ／ Angry and sad. ／ Not interested in the new job at all. |
| b1-u09-l02-q10 | The manager made an apology to the customers for the long wait. | **Because of the long wait.** ／ Because the food was cold. ／ Because of a wrong bill. ／ Because the shop closed early. | **Because customers waited a long time.** ／ Because the food was cold. ／ Because the manager had to wait. ／ Because the customers were rude. |
| b1-u09-l03-q10 | I'm sorry, but the noise from the street really irritates me tonight. | The cold weather this evening. ／ The TV show next door. ／ **The noise from the street.** ／ The neighbor's dog. | The cold weather this evening. ／ The TV show next door. ／ **The loud sounds outside.** ／ The street lights at night. |
| b1-u09-l04-q10 | He felt guilty because he broke his brother's toy. | **He broke his brother's toy.** ／ He ate his brother's cake. ／ He was late for school. ／ He lost his brother's book. | **He damaged his brother's toy.** ／ He ate his brother's cake. ／ His brother broke his toy. ／ He lost his brother's book. |
| b1-u09-l05-q10 | I'm sorry, but I'm unable to come to the meeting tomorrow morning. | Will be late for the meeting. ／ **Can't come to the meeting.** ／ Will lead the meeting. ／ Needs a ride to the meeting. | Will be late for the meeting. ／ **Won't be at the meeting.** ／ Will lead the meeting. ／ Needs a ride to the meeting. |
| b1-u09-l07-q10 | The hotel staff did everything for our comfort, so we had a great stay. | The room was too small. ／ **They had a great stay.** ／ The staff were rude. ／ The hotel was too far away. | The room was too small. ／ **They really enjoyed it.** ／ The staff did very little. ／ The hotel was too far away. |
| b1-u09-l10-q10 | The manager gave praise to the whole team for their hard work. | **For their hard work.** ／ For being on time. ／ For their new design. ／ For saving money. | **Because they worked very hard.** ／ Because they were on time. ／ Because the manager worked hard. ／ Because they saved money. |
| b1-u10-l03-q10 | She wore a long blue gown to the dinner, and everyone loved it. | **A long blue gown.** ／ A short red dress. ／ A white shirt. ／ A black suit. | **A long blue dress.** ／ A short blue gown. ／ A long red dress. ／ A blue shirt. |
| b1-u11-l02-q10 | We need new tiles for the kitchen floor, but they are expensive. | A new table for the kitchen. ／ New paint for the bedroom walls. ／ A new lamp for the living room. ／ **New tiles for the kitchen.** | A new table for the kitchen. ／ New paint for the kitchen floor. ／ Cheaper tiles for the bathroom. ／ **Tiles for the floor of the kitchen.** |
| b1-u11-l03-q10 | The dishwasher is broken, so we have to wash the dishes by hand tonight. | With a machine. ／ At a restaurant. ／ **By hand.** ／ Tomorrow morning. | With the dishwasher. ／ At a restaurant. ／ **Without the machine.** ／ Tomorrow morning. |
| b1-u11-l04-q10 | There's not enough storage in this apartment, so we keep boxes under the bed. | In the kitchen. ／ **Under the bed.** ／ On the roof. ／ In the car. | On the bed. ／ **Under where they sleep.** ／ In the storage room. ／ Outside the apartment. |
| b1-u11-l05-q10 | The steam from the kettle set off the fire alarm. | A burning candle. ／ Smoke from the oven. ／ **Steam from the kettle.** ／ A broken heater. | A fire in the kitchen. ／ Smoke from the kettle. ／ **The boiling kettle.** ／ A broken alarm. |
| b1-u11-l07-q10 | Cats that live indoors usually live longer. | They are bigger and heavier. ／ **They live longer.** ／ They sleep less at night. ／ They eat more food. | They usually go outdoors. ／ **They have longer lives.** ／ They live shorter lives. ／ They eat more food. |
| b1-u11-l08-q10 | The kettle is boiling, so I'll make the tea now. | Buy a kettle. ／ Wash the dishes. ／ **Make tea.** ／ Go to bed. | Buy a new kettle. ／ Wash the tea cups. ／ **Prepare some tea.** ／ Go to bed. |
| b1-u11-l10-q09 | The kids lost the remote control again, so we can't change the channel. | The TV in the living room is broken. ／ There is no power in the house. ／ The kids are asleep in their room. ／ **The remote control is lost.** | The TV in the living room is broken. ／ The kids broke the remote control. ／ The kids are asleep in their room. ／ **Nobody can find the remote.** |
| b1-u12-l01-q10 | The library needs people to volunteer on weekends. You can sign up at the front desk. | **At the front desk.** ／ On the website. ／ By calling them. ／ At the school office. | **At the library's front counter.** ／ On the library website. ／ By calling the library. ／ At the school office. |
| b1-u12-l02-q10 | The trip was tiring, so most of the kids fell into a doze on the bus home. | **They fell asleep.** ／ They sang songs together. ／ They ate lunch. ／ They played games. | **They fell asleep.** ／ They sang songs together. ／ They missed the bus home. ／ They played games. |
| b1-u13-l02-q10 | Sorry about the mess. We are painting the office this week, so please use the meeting room. | They are moving desks. ／ **They are painting it.** ／ They had a party. ／ They are cleaning the floor. | They are painting the meeting room. ／ **It's getting new paint.** ／ They had a party this week. ／ They are cleaning the floor. |
| b1-u13-l03-q10 | Our café no longer gives out plastic straws, but you can ask for a paper one. | Drink from the bottle. ／ Buy a plastic straw. ／ Use a spoon. ／ **Ask for a paper straw.** | Ask for a plastic one. ／ Buy a plastic straw. ／ Use a spoon. ／ **Request one made of paper.** |
| b1-u13-l04-q10 | I've lost my appetite since I caught a cold. I'll just have some soup tonight. | Some rice. ／ **Some soup.** ／ Nothing at all. ／ A salad. | Some rice. ／ **Only soup.** ／ Nothing at all. ／ A salad. |
| b1-u13-l05-q10 | We're out of fresh vegetables, but there is a cabbage in the fridge. | Some bacon. ／ Some lettuce. ／ Some spinach. ／ **A cabbage.** | Some bacon. ／ Lots of vegetables. ／ Some spinach. ／ **One cabbage.** |
| b1-u13-l06-q10 | The party has fruit juice and tea. There are no alcoholic drinks, so children are welcome. | Beer and wine. ／ **Juice and tea.** ／ Only water. ／ Coffee and milk. | Beer and fruit juice. ／ **Tea and some juice.** ／ Tea only, no juice. ／ Coffee and milk. |
| b1-u13-l07-q10 | On Fridays, our fried cod comes with a free jug of lemonade. | **A jug of lemonade.** ／ A salad. ／ Some ice cream. ／ Some gravy. | **Some lemonade.** ／ Some fried cod. ／ A jug of water. ／ Some ice cream. |
| b1-u13-l08-q09 | Don't put the frying pan in the dishwasher. Wash it by hand with warm water. | **By hand with warm water.** ／ In the dishwasher at night. ／ With cold water and soap only. ／ Leave it in water overnight. | **Yourself, using warm water.** ／ In the dishwasher at night. ／ By hand with cold water. ／ Leave it in water overnight. |
| b1-u15-l01-q10 | The printer is still under warranty, so the shop will repair it for free. | **It is still under warranty.** ／ It is the newest model in the shop. ／ The shop made a mistake with it. ／ The owner is a close friend of theirs. | **Its warranty hasn't ended yet.** ／ It is the newest model in the shop. ／ The shop broke the printer. ／ The owner is a close friend of theirs. |
| b1-u15-l04-q09 | To book the room, pay a fifty-dollar deposit. You'll get it back when you leave. | **When you leave.** ／ Right away. ／ After one month. ／ It is never returned. | **At the end of the stay.** ／ When you book the room. ／ After one month. ／ It is never returned. |
| b1-u16-l01-q09 | Your package will be delivered between nine and noon tomorrow, so someone should stay in the office. | Next week. ／ Tonight. ／ **Tomorrow morning.** ／ This afternoon. | Next week. ／ Tomorrow afternoon. ／ **Tomorrow morning.** ／ This afternoon. |
| b1-u17-l01-q11 | Meet me at the fountain in the town square at three. | At the library. ／ At the station. ／ At the monument. ／ **At the fountain.** | At the town library. ／ At the station. ／ At the monument. ／ **Beside the fountain.** |
| b1-u17-l02-q11 | The road to the airport is closed for construction, so please take the bus. | **Because of construction.** ／ Because of a big accident. ／ Because of heavy snow last night. ／ Because of a festival in town. | **Because of building work.** ／ Because of a big accident. ／ Because the airport is closed. ／ Because of a festival in town. |
| b1-u17-l04-q10 | The tourist bureau opens at nine and gives out free maps of the city. | Free coffee. ／ Free tickets. ／ Free bus rides. ／ **Free maps.** | Free city tours. ／ Free tickets. ／ Maps for sale. ／ **City maps at no cost.** |
| b1-u17-l05-q10 | The bus stop for the harbor is next to the crossing near the bakery. | At the harbor. ／ Inside the bakery. ／ Near the bank. ／ **Next to the crossing.** | At the harbor. ／ Inside the bakery. ／ Near the bank. ／ **Beside the crossing.** |
| b1-u17-l06-q10 | Tonight's film is about a nationalist leader and his early life. | A famous building in the city. ／ A football team's best season. ／ **A leader's early life.** ／ A cooking contest on TV. | A leader's last years. ／ A football team's best season. ／ **A leader's younger years.** ／ A cooking contest on TV. |
| b1-u18-l03-q10 | The motor on our boat stopped working, so we had to wait for help. | They lost their map. ／ **The motor stopped working.** ／ The weather was bad. ／ They ran out of food. | They lost their map. ／ **The boat's engine broke down.** ／ The boat was too small. ／ They ran out of food. |
| b1-u18-l04-q10 | To get to the hotel, take the first turning after the bridge. | Go straight on. ／ Take the second turning. ／ **Take the first turning.** ／ Turn around. | Go straight on. ／ Take the second turning. ／ **Turn at the first road.** ／ Turn around. |
| b1-u18-l05-q10 | Our plane will be ready for takeoff in five minutes, so please put on your seat belts. | In about one minute. ／ In ten more minutes. ／ In fifteen minutes. ／ **In five minutes.** | In about one minute. ／ In five hours. ／ In fifteen minutes. ／ **Five minutes from now.** |
| b1-u18-l06-q09 | Sorry I'm late. There was a traffic jam on the bridge. | **There was a traffic jam.** ／ His car broke down on the way. ／ He missed the early bus. ／ He woke up much too late. | **Too many cars on the bridge.** ／ The bridge was closed. ／ The speaker missed the bus. ／ The speaker woke up late. |
| b1-u20-l02-q11 | The basketball player hurt his finger, so he won't play on Saturday. | He is very sick. ／ He has a family trip. ／ **He hurt his finger.** ／ His team lost. | He hurt his foot. ／ He has a family trip. ／ **His finger is injured.** ／ His team won't play. |
| b1-u20-l03-q10 | Our swimming class for pregnant women starts on Monday at ten. | **Monday at ten.** ／ Monday at two. ／ Tuesday at ten. ／ Friday afternoon. | **Ten o'clock on Monday.** ／ Monday at two. ／ Tuesday at ten. ／ Friday afternoon. |
| b1-u20-l05-q10 | Show the stamp on your wrist to enter the concert again. | **Show the wrist stamp.** ／ Buy a new ticket at the door. ／ Call the front desk for help. ／ Wait outside the main gate. | **Hold up your stamped wrist.** ／ Show your concert ticket again. ／ Get a new stamp at the door. ／ Wait outside the main gate. |
| b1-u20-l07-q10 | Smokers can use the area behind the hotel, but not the garden. | Near the front door. ／ In the garden. ／ **Behind the hotel.** ／ On their balcony. | In front of the hotel. ／ In the garden. ／ **At the back of the hotel.** ／ On their balcony. |
| b1-u20-l08-q10 | The time capsule will be opened in twenty years, when the students are adults. | **In twenty years.** ／ In ten years. ／ Next summer. ／ In two years. | **Twenty years from now.** ／ When the students leave. ／ Next summer. ／ In two years. |
| b1-u20-l09-q10 | Please bring a bandage and some water; Tom cut his hand in the kitchen. | He has a fever. ／ He hurt his ankle. ／ **He cut his hand.** ／ He fell asleep. | He cut his foot. ／ He hurt his ankle. ／ **His hand has a cut.** ／ He burned his hand. |
| b1-u20-l10-q10 | I can't come to the meeting today; I have a terrible backache from lifting boxes. | **A bad backache.** ／ A bad earache. ／ A family trip. ／ A problem with their car. | **Their back hurts a lot.** ／ Too many boxes to lift. ／ A bad earache. ／ A problem with their car. |
| b1-u21-l01-q08 | The vet's office is closed on Sunday, but you can call this number if your pet is sick. | Wait until Monday morning. ／ **Call the number.** ／ Go to the pet shop nearby. ／ Email the vet. | Wait until Monday morning. ／ **Phone the number given.** ／ Go to the vet's office. ／ Email the vet. |
| b1-u22-l02-q11 | The circus starts at seven, but please come early to buy your tickets. | **To buy tickets.** ／ To meet the clowns. ／ To get a map. ／ To eat first. | **To pay for tickets.** ／ To get good seats. ／ To meet the clowns. ／ To eat first. |
| b1-u22-l03-q11 | The craft fair starts at ten on Saturday in the school hall. | At the library. ／ In the park near the station. ／ At the market next to the river. ／ **In the school hall.** | In the school library. ／ In the park near the station. ／ At the town hall. ／ **In a hall at the school.** |
| b1-u22-l04-q10 | The choir will practice on Tuesday and Thursday evenings this month. | Every Monday night. ／ **Tuesday and Thursday evenings.** ／ Saturday mornings. ／ Only on Fridays. | Tuesday and Thursday mornings. ／ **Tuesday and Thursday nights.** ／ Only on Tuesday evenings. ／ Every Monday night. |
| b1-u22-l06-q10 | The magician's show is for children, so it starts at four in the afternoon. | At seven o'clock in the evening. ／ **At four in the afternoon.** ／ At ten o'clock in the morning. ／ At noon on Sunday. | At four in the morning. ／ **At four p.m.** ／ At ten in the morning. ／ At seven in the evening. |
| b1-u23-l01-q10 | The city race starts at seven, so runners should arrive by half past six. | At seven o'clock. ／ At six o'clock. ／ **By half past six.** ／ By eight. | By seven o'clock. ／ By half past seven. ／ **No later than six thirty.** ／ At six o'clock. |
| b1-u23-l03-q09 | The swimming race is moved to Sunday because the pool needs cleaning. | There's no sponsor. ／ It will rain. ／ A swimmer is sick. ／ **The pool needs cleaning.** | The pool is closed on Sunday. ／ The weather will be bad that day. ／ A swimmer is sick and can't race. ／ **The pool has to be cleaned.** |
| b1-u24-l02-q08 | During the intermission, you can buy snacks in the hall but not take them inside. | Take photos of the actors onstage. ／ **Buy snacks in the hall.** ／ Leave the theater. ／ Meet the actors. | Take photos of the actors onstage. ／ **Get food in the hall.** ／ Eat snacks inside the theater. ／ Meet the actors in the hall. |
| b1-u25-l01-q10 | Please finish the questionnaire and give it to the front desk before you leave. | **The front desk.** ／ The teacher in Room 3. ／ Your boss. ／ The guard. | **The reception desk.** ／ The teacher in Room 3. ／ Your boss. ／ The guard. |
| b1-u25-l02-q10 | The chemistry test is moved from Tuesday to Friday because the lab is being cleaned. | The teacher is sick. ／ **The lab is being cleaned.** ／ It's a holiday. ／ Students asked for it. | The teacher is sick on Tuesday. ／ **There's cleaning in the lab.** ／ Friday is a holiday. ／ Students asked for it. |
| b1-u25-l03-q10 | The librarian says the library will close early today, at six, so please return your books before then. | At seven tonight. ／ **At six today.** ／ At nine tomorrow. ／ At noon on Sunday. | Six o'clock tomorrow. ／ **Six o'clock, earlier than usual.** ／ Nine o'clock, as usual. ／ At noon on Sunday. |
| b1-u25-l04-q10 | The professor's talk on nuclear power has moved to a bigger room because many more students signed up. | The lights are broken. ／ The old room is being painted this week. ／ **Many more students signed up.** ／ The room is too cold. | The lights are broken. ／ The old room is being painted this week. ／ **Lots more people want to attend.** ／ Not many students signed up. |
| b1-u25-l05-q10 | Before we start the experiment, please read the instructions carefully and wear your safety glasses. | Ask the teacher for help. ／ Clean all the tables. ／ Turn off the lights. ／ **Read the instructions and wear glasses.** | Read the instructions aloud. ／ Clean the safety glasses. ／ Turn off the lights. ／ **Check the directions and protect your eyes.** |
| b1-u25-l06-q10 | Please hand in the introduction of your composition by Friday; the rest is due next week. | **The introduction of the composition.** ／ The whole composition. ／ A list of new phrases. ／ A short book report. | **The first part of the composition.** ／ The whole composition. ／ The rest of the composition. ／ A short book report. |
| b1-u25-l07-q10 | Freshmen, please note: the welcome lecture starts at nine in the main hall, and lunch is at noon. | In the laboratory. ／ In the library. ／ In the gym at ten. ／ **In the main hall at nine.** | In the main hall at noon. ／ In the library at nine. ／ In the gym at ten. ／ **Nine o'clock, in the main hall.** |
| b1-u26-l01-q10 | Bring something for the mosquitoes tonight, because we're camping by the lake. | The guide asked everyone to. ／ It will rain all night long. ／ The shop is closed tomorrow. ／ **We'll camp by the lake.** | We'll swim in the lake tonight. ／ It will rain all night long. ／ The shop is closed tomorrow. ／ **We'll stay near the lake tonight.** |
| b1-u26-l02-q10 | This trail is short and flat, so it's good for families with small children. | Only expert climbers. ／ **Families with young kids.** ／ People riding bikes. ／ Owners of big dogs. | Only expert climbers. ／ **Families with young kids.** ／ People who like long trails. ／ Owners of big dogs. |
| b1-u26-l03-q10 | Climbers should reach the summit before three, because it gets dark early in winter. | **It gets dark early in winter.** ／ The weather will change. ／ The café closes then. ／ There is a strong wind. | **Night comes early in winter.** ／ It gets cold early in winter. ／ The summit closes at three. ／ There is a strong wind. |
| b1-u26-l04-q10 | The cave tour starts at ten. Wear good shoes, because the path is full of mud. | The tour is three hours long. ／ The cave floor is very cold. ／ **The path is full of mud.** ／ There are sharp rocks inside. | The tour is three hours long. ／ The cave path is full of water. ／ **The way is wet and dirty.** ／ There are sharp rocks inside. |
| b1-u26-l05-q10 | Don't walk on the beach after five today; the tide comes in fast and covers the sand. | **The tide comes in fast.** ／ The beach closes for cleaning. ／ There will be a big storm. ／ The lifeguards go home then. | **The sea rises quickly.** ／ The beach closes at five. ／ There will be a big storm. ／ The sand is too hot. |
| b1-u26-l06-q10 | My little brother is afraid of lightning, so he hides under his blanket during storms. | He runs to his parents' room. ／ He watches it from the window. ／ **He hides under his blanket.** ／ He turns on all the lights. | He hides under his bed. ／ He watches it from the window. ／ **He covers himself with a blanket.** ／ He turns on all the lights. |
| b1-u27-l03-q10 | This machine can purify sea water, so the island now has enough drinking water. | It keeps the island cool. ／ It cleans the plastic from the beaches. ／ **It makes sea water safe to drink.** ／ It checks the weather. | It keeps the island cool. ／ It cleans the plastic from the beaches. ／ **It makes sea water safe to drink.** ／ It checks the sea water. |
| b1-u28-l01-q10 | Children under six enter the zoo for free, but they need a ticket from the front desk. | Buy a ticket online a few days before. ／ **Get a free ticket at the front desk.** ／ Pay the full price at the door. ／ Bring a student card. | Buy a ticket online a few days before. ／ **Get a ticket from the desk without paying.** ／ Pay half price at the front desk. ／ Enter with no ticket at all. |
| b1-u28-l02-q10 | Our store's return policy has changed: you now have thirty days to bring things back. | Returns are not allowed. ／ You can return things only if they are not used. ／ You must pay a small fee. ／ **You have thirty days to return things.** | Returns are not allowed. ／ You have three days to return things. ／ You must pay a small fee. ／ **You can bring items back for a month.** |
| b1-u28-l03-q10 | Lost property can be collected at the main office until six p.m. | In the library. ／ At the bus station downtown. ／ At the front gate after six. ／ **At the main office.** | At the main gate. ／ At the bus station downtown. ／ At the front gate after six. ／ **At the central office.** |
| b1-u28-l05-q10 | If you witnessed what happened on the playground this morning, please talk to your teacher. | **Talk to their teacher.** ／ Write a short report. ／ Call the police at once. ／ Go home early. | **Tell their teacher about it.** ／ Write a short report. ／ Go back to the playground. ／ Call the police at once. |
| b1-u28-l06-q10 | Dogs are not permitted on the beach between May and September. | Before ten in the morning. ／ Only on weekends in summer. ／ **From May to September.** ／ When the lifeguards are working. | From September to May. ／ Only on weekends in summer. ／ **From May to September.** ／ When the lifeguards are working. |
| b1-u29-l02-q10 | You can check the status of your order on our website after six p.m. | Only on weekends. ／ Before noon today. ／ **After six in the evening.** ／ Tomorrow morning. | Only on weekends. ／ Before six p.m. ／ **After six in the evening.** ／ Tomorrow morning. |
| b1-u29-l03-q10 | The economics lecture has moved to Room 8, because Room 3 is too small. | The lights in Room 3 are broken. ／ **Room 3 is too small.** ／ It is too cold. ／ It's a holiday. | The lights in Room 3 are broken. ／ **Room 3 isn't big enough.** ／ Room 8 is too small. ／ It's a holiday. |
| b1-u29-l04-q10 | The old graves behind the church have names and dates on them, but some are hard to read. | Flowers and candles. ／ Photos and maps. ／ **Names and dates.** ／ Nothing at all. | Names and photos. ／ Dates and flowers. ／ **Dates and names.** ／ Nothing at all. |
| b1-u29-l05-q10 | The monks are having a quiet morning, so visitors can only enter after lunch. | Only on weekends. ／ Early in the morning. ／ Any time they like. ／ **After lunch.** | Only before lunch. ／ Early in the morning. ／ Any time they like. ／ **In the afternoon.** |
| b1-u29-l07-q10 | Our social networking class starts at seven, and you need to bring your own phone. | Some paper and a pen. ／ **Your own phone, please.** ／ A photo of yourself. ／ Your student card. | Some paper and a pen. ／ **Your personal phone.** ／ A photo of yourself. ／ Nothing; phones are given. |
| b1-u30-l01-q11 | If the caller can't hear you, hang up and dial the number again in five minutes. | Write the number down on a piece of paper. ／ Send a message to the office manager. ／ **Dial again in five minutes.** ／ Speak much more loudly. | Write the number down on a piece of paper. ／ Send a message to the office manager. ／ **End the call and try again later.** ／ Speak more loudly for five minutes. |
| b1-u30-l02-q10 | The library will announce the winners of the poster contest at noon on Friday. | On Monday. ／ Tomorrow morning. ／ **At noon on Friday.** ／ Tonight. | Friday morning. ／ Tomorrow at noon. ／ **Friday, at twelve o'clock.** ／ Monday at noon. |
| b1-u30-l03-q10 | Please inform the front desk if your room key stops working. | Call the manager's office at once. ／ **Tell the front desk.** ／ Wait until the next morning. ／ Use the stairs. | Call the manager's office at once. ／ **Let the front desk know.** ／ Wait until the next morning. ／ Stop using the room. |
| b1-u30-l04-q10 | Our presentation will start late because the room is not ready. | The speaker's train is running late. ／ **The room is not ready.** ／ The guests are late. ／ Lunch is late. | The speaker's train is running late. ／ **The room isn't set up yet.** ／ The guests are not ready. ／ The room is too small. |
| b1-u30-l05-q10 | Please update your phone tonight, because the old software will stop working tomorrow. | **The old software will stop working.** ／ The phone is too slow. ／ The battery is low. ／ It is free tonight. | **The old system won't work after today.** ／ The phone will stop working tonight. ／ The battery is low. ／ The new software is free tonight. |
| b1-u30-l06-q10 | Please read the instructions aloud so everyone can hear. | **So everyone can hear.** ／ Because the teacher can't see well. ／ Because it is a speaking test. ／ Because the room is very dark. | **So the whole group can hear.** ／ Because the teacher can't hear well. ／ Because it is a reading test. ／ Because the room is very dark. |
| b1-u30-l07-q10 | Please don't upload photos of the concert until the band says it's OK. | As soon as the concert begins tonight. ／ Only during the break between the songs. ／ **After the band says it's OK.** ／ Before the show starts. | As soon as the concert begins tonight. ／ Only during the break between the songs. ／ **Once the band allows it.** ／ Before the band says it's OK. |
| b1-u30-l08-q10 | I saw your advert on the message board, and I'd like to buy your old bike. | To ask the way. ／ To sell a bike. ／ **To buy the old bike.** ／ To find a job. | To put an advert on the board. ／ To sell a bike. ／ **To pay for the used bike.** ／ To find a job. |
| b1-u32-l01-q11 | Mr. Lee is absent today, so his meeting with the adviser has moved to Thursday this week. | To next Monday morning. ／ **To Thursday this week.** ／ To this afternoon at four. ／ To Friday evening. | To next Monday morning. ／ **This coming Thursday.** ／ To Thursday next week. ／ To Friday evening. |
| b1-u32-l02-q10 | Please sign the document and return it to the sales department by Monday. | **The sales department.** ／ The manager's home address. ／ The front desk downstairs. ／ The office next to the lift. | **The sales team's office.** ／ The manager's home address. ／ The manager, by Monday. ／ The office next to the lift. |
| b1-u32-l03-q10 | Please write your name on the noticeboard if you want a paid day off in May. | Fill in a form at the front desk. ／ Send an email to the manager's office. ／ Talk to the manager before the end of April. ／ **Write your name on the noticeboard.** | Write your name on a form. ／ Send an email to the manager's office. ／ Talk to the manager before the end of April. ／ **Add your name to the noticeboard.** |
| b1-u33-l01-q10 | We have a vacancy for an accountant, so please send your CV by the end of the month. | A cook for the café. ／ A driver for the manager. ／ A cleaner for the office. ／ **Someone to work as an accountant.** | A cook for the company. ／ A driver for the manager. ／ A cleaner for the office. ／ **An accountant for the company.** |
| b1-u34-l01-q10 | At ten, the mayor of the city will give a speech at the library's opening. | A young student. ／ The head of the new library. ／ A famous writer from the city. ／ **The mayor of the city.** | A young student. ／ The head of the new library. ／ A famous writer from the city. ／ **The city's leader.** |
| b1-u34-l02-q10 | If you need assistance with your bags, please ask the staff at the front desk. | Call a taxi company. ／ **Ask the staff at the front desk.** ／ Wait near the lift. ／ Carry them yourself. | Call a taxi company. ／ **Speak to the people at reception.** ／ Leave the bags at the front desk. ／ Carry them yourself. |
| b1-u34-l03-q10 | If you want to transfer to another class, please talk to the office before Friday. | **Talk to the office before Friday.** ／ Ask your parents to call. ／ Wait until next term. ／ Send an email. | **Go and see the office before Friday.** ／ Talk to the new class on Friday. ／ Wait until next term. ／ Ask your parents to call. |
| b1-u34-l04-q10 | Please attach this card to your bag before you get on the bus. | Show your ticket. ／ Turn off your phone. ／ **Put the card on your bag.** ／ Wash your hands. | Show the card to the driver. ／ Turn off your phone. ／ **Put the card on your bag.** ／ Wash your hands. |
| b1-u34-l05-q10 | A worker will come on Tuesday to install the new air conditioning. | Paint the bedroom. ／ Check all the windows in the house. ／ Clean the kitchen. ／ **Install the air conditioning.** | Fix the old air conditioning. ／ Check all the windows in the house. ／ Clean the kitchen. ／ **Put in a new cooling system.** |
| b1-u34-l08-q10 | Our store will distribute free bags to the first hundred customers this Saturday. | Open a new store. ／ Sell everything at half price. ／ Close at noon. ／ **Give away free bags.** | Sell bags to a hundred customers. ／ Sell everything at half price. ／ Close at noon. ／ **Give away free bags.** |
| b1-u34-l09-q10 | The elevator is under maintenance today, so please use the stairs. | Wait for the elevator to be fixed. ／ Leave the building now. ／ **Take the stairs for today.** ／ Call the front desk. | Wait for the elevator to be fixed. ／ Leave the building now. ／ **Take the stairs for today.** ／ Use the elevator today. |
| b1-u34-l10-q10 | If you leave the chocolate in the car, it will melt in this heat. | The car is locked all day. ／ Someone might steal it. ／ **It will melt in the heat.** ／ The dog will eat it. | The car is locked all day. ／ Someone might steal it. ／ **The heat will make it soft.** ／ The car will get dirty. |
| b1-u35-l01-q10 | Because of the severe weather, the roads are closed, and all classes will be online today. | **All online today.** ／ In the school hall, as usual. ／ There are no classes. ／ At the library. | **Over the internet.** ／ In the school hall, as usual. ／ There are no classes today. ／ At the library. |
| b1-u35-l02-q10 | The museum is normally open until six, but today it closes at four because of a special event. | It is closed all day. ／ At six, as usual. ／ At five thirty. ／ **At four, for a special event.** | It is closed all day. ／ At six, as usual. ／ At five thirty. ／ **Earlier, at four.** |
| b1-u35-l03-q10 | The ship goes to the distant island only twice a year, in spring and in fall. | Every weekend. ／ Once a month on Sundays. ／ **Twice a year.** ／ Once a year. | Only in spring. ／ Once a month on Sundays. ／ **Once in spring and once in fall.** ／ Once a year. |
| b1-u35-l04-q10 | Our new bus system is more efficient: buses now come every five minutes. | The buses are much bigger now. ／ **Buses come more often.** ／ Tickets are cheaper than before. ／ The drivers are much nicer now. | The buses are much bigger now. ／ **Buses come more often.** ／ Buses now come every fifteen minutes. ／ The drivers are much nicer now. |
| b1-u35-l08-q10 | Tie your shoes tightly before the race starts. | Run as fast as you can. ／ Drink some water. ／ Wear a hat. ／ **Tie your shoes well.** | Run as fast as you can. ／ Start the race slowly. ／ Wear new shoes. ／ **Tie your shoes well.** |
| b1-u35-l09-q10 | Don't swim here. The water looks deep, but it is very shallow, and there are rocks. | **The water is shallow.** ／ The water is too cold today. ／ There are too many fish here. ／ It's too deep. | **The water isn't deep enough.** ／ The water is too cold today. ／ There are too many fish here. ／ The water is too deep. |
| b1-u36-l01-q10 | I think fifty dollars is a reasonable price for these shoes. Let's buy them. | It is far too high. ／ **It is reasonable.** ／ It is a little low. ／ It will go down soon. | It is far too high. ／ **It is a fair price.** ／ It is a little low. ／ It will go down soon. |
| b1-u36-l02-q10 | Keep your receipt. It's your proof that you bought the phone here. | It has the price. ／ You can use it to win a prize next week. ／ To get free coffee. ／ **It proves where you bought it.** | It has the phone's price. ／ You can use it to win a prize next week. ／ To buy another phone here. ／ **It proves where you bought it.** |
| b1-u36-l03-q10 | My sister has a preference for window seats, so I booked one for her. | **A window seat.** ／ A seat near the door. ／ A seat in the middle row. ／ A seat next to her friend. | **One by the window.** ／ A window seat for the speaker. ／ A seat in the middle row. ／ A seat next to her friend. |
| b1-u36-l04-q10 | Sorry, I can't distinguish between the salt and the sugar in these jars. | Which bus goes to the park. ／ **Salt and sugar.** ／ The colors on the map. ／ The songs on the radio. | Where the salt jar is. ／ **Which jar has salt and which has sugar.** ／ The colors of the jars. ／ The songs on the radio. |
| b1-u36-l06-q10 | The team's refusal to play in the rain surprised the fans. | **The team wouldn't play in the rain.** ／ The team lost by ten points. ／ The game started an hour late. ／ The tickets were free. | **The team wouldn't play in the rain.** ／ The team lost by ten points. ／ The game started an hour late. ／ The fans played in the rain. |
| b1-u37-l01-q10 | The sea was calm this morning, so we went out in a small boat. | It was early. ／ A friend lent them a boat. ／ It was sunny. ／ **The sea was calm.** | It was early in the morning. ／ A friend lent them a boat. ／ The boat was small. ／ **There were no big waves.** |
| b1-u37-l02-q10 | Your work this term was very encouraging. Keep it up! | Hard to judge. ／ It was not good enough. ／ Much too slow. ／ **Very encouraging.** | Hard to judge. ／ It was not good enough. ／ Much too slow. ／ **It was very promising.** |
| b1-u37-l03-q10 | My little brother was so embarrassed when he called his teacher "Mom" in class. | He fell asleep during the math test. ／ He forgot his homework at home again. ／ **He called his teacher "Mom."** ／ He lost his shoes. | His mom came to his class. ／ He forgot his homework at home again. ／ **He used the wrong name for his teacher.** ／ He lost his shoes. |
| b1-u37-l04-q10 | The ending of the movie stunned everyone. Nobody expected the hero to be the bad guy. | The music was loud. ／ The movie was too long. ／ The theater was cold. ／ **The hero turned out to be the bad guy.** | Everyone expected the ending. ／ The movie was too long. ／ The hero died at the end. ／ **The good guy was really the bad one.** |
| b1-u37-l05-q10 | I'm so ashamed. I forgot my best friend's birthday again. | Broke a friend's phone. ／ **Forgot a birthday.** ／ Was late for a party. ／ Told a teacher a lie about homework. | Broke a friend's phone. ／ **Didn't remember a friend's birthday.** ／ Forgot a friend's name. ／ Was late for a birthday party. |
| b1-u37-l06-q10 | I was amazed by the magic show. The man made a car disappear! | He turned a bird into a cat. ／ **He made a car disappear.** ／ He flew over the people watching. ／ He sang a song. | He made a cat disappear. ／ **A car was there, then it wasn't.** ／ He flew over the people watching. ／ He drove a car on stage. |
| b1-u37-l07-q10 | This map is so confusing. Let's ask someone for directions instead. | Buy a better map. ／ **Ask someone for directions.** ／ Go back to the hotel. ／ Wait for a taxi. | Buy a better map. ／ **Ask a person the way.** ／ Read the map again. ／ Wait for a taxi. |
| b1-u37-l08-q10 | My cat gets jealous when I play with the neighbor's dog. She hides under the bed. | It cries loudly. ／ It climbs onto the kitchen table. ／ It bites the neighbor's dog. ／ **It hides under the bed.** | It plays with the dog. ／ It climbs onto the kitchen table. ／ It bites the neighbor's dog. ／ **It goes under the bed.** |
| b1-u37-l09-q10 | I'm so frustrated. I've tried to fix this bike for two hours, and it still doesn't work. | **The bike still doesn't work.** ／ The speaker lost the bike keys again. ／ The shop was closed for two hours. ／ It started to rain hard. | **The bike is still broken.** ／ The speaker lost the bike keys again. ／ The shop was closed for two hours. ／ It started to rain hard. |
| b1-u38-l02-q10 | The examiner will check your ID before you enter the room. | You will get a free pen and some paper. ／ **Your ID will be checked.** ／ Phones will be taken. ／ You must pay first. | You will get a free pen and some paper. ／ **Someone will look at your ID.** ／ You will get a new ID. ／ The examiner will enter first. |
| b1-u38-l05-q09 | I ran into an old schoolmate at the train station. We hadn't seen each other for ten years. | At a wedding in the next town. ／ **At the train station.** ／ At a coffee shop. ／ At the airport. | At a wedding in the next town. ／ **Where people catch trains.** ／ At a coffee shop. ／ At their old school. |
| b1-u38-l06-q09 | Today we'll learn about prepositions, like "in," "on," and "under." | **Prepositions such as "in" and "on."** ／ Words that describe people. ／ How to write a letter. ／ Some new action words. | **Words that show place, like "under."** ／ Words that describe people, like "tall." ／ Words that show actions, like "learn." ／ Words that ask questions, like "where." |
| b1-u38-l07-q09 | After primary school, I went to a secondary school near my house. | A big university. ／ A school in another city far away. ／ A music school in the next town. ／ **A secondary school near home.** | A primary school near home. ／ A school in another city far away. ／ A music school in the next town. ／ **A high school close to home.** |
| b1-u39-l01-q10 | Tonight you can see a comet in the east after nine o'clock. | Rain all night. ／ A full moon over the hills. ／ **A comet in the east.** ／ A big storm. | A comet in the west. ／ A full moon over the hills. ／ **A comet in the eastern sky.** ／ A big storm after nine. |
| b1-u39-l02-q10 | We can't swim near the reef today because the waves are too big. | There are fish. ／ The water is cold. ／ It is too late. ／ **The waves are too big.** | The reef is too big. ／ The water is cold. ／ It is too late today. ／ **The sea is too rough.** |
| b1-u39-l03-q10 | Stay inside! A tornado is coming, and it will be here in ten minutes. | Go out and take photos. ／ Drive to the next town. ／ **Stay inside.** ／ Close all the shops. | Go out in ten minutes. ／ Drive to the next town. ／ **Don't go outdoors.** ／ Close all the shops. |
| b1-u39-l04-q10 | During the quake, we hid under the table until the shaking stopped. | Called their friends to check. ／ Ran out of the house quickly. ／ **Hid under the table.** ／ Stood next to the windows. | Hid under the stairs. ／ Ran out of the house quickly. ／ **Took cover under a table.** ／ Stood next to the windows. |
| b1-u39-l05-q10 | It's hot and humid today, so remember to drink a lot of water. | Wear a warm coat. ／ **Drink enough water.** ／ Close all the windows. ／ Stay in bed all day. | Wear a warm coat. ／ **Have plenty to drink.** ／ Drink a lot of hot tea. ／ Stay in bed all day. |
| b1-u39-l06-q10 | The snowstorm stopped, so the children ran outside to play in the snow. | Went to bed early. ／ Watched TV at home. ／ Made some hot soup. ／ **Played in the snow.** | Stayed inside during the storm. ／ Watched TV at home. ／ Ran to the shop. ／ **Went out to have fun.** |
| b1-u40-l01-q10 | The city council will meet on Monday to talk about the new bus lines. | The price of parking. ／ Building a new school. ／ Cleaning the park. ／ **The new bus lines.** | The price of parking. ／ A new city hall. ／ The old bus station. ／ **Where new buses will run.** |
| b1-u40-l02-q10 | The school has free counseling on Wednesdays. You can talk to Ms. Wang about any problem. | Play in the gym. ／ Eat a free lunch. ／ Leave school early. ／ **Talk to Ms. Wang about problems.** | Play in the gym. ／ Eat a free lunch with Ms. Wang. ／ Leave school early. ／ **Get help with problems from Ms. Wang.** |
| b1-u40-l03-q09 | Registration for the swimming class opens on Monday. You can sign up online or at the front desk. | **Online or at the front desk.** ／ Only by calling the swimming teacher. ／ Only on Monday morning. ／ At the city library. | **On the internet or in person at the desk.** ／ Only by calling the swimming teacher. ／ Only at the front desk. ／ At the city library. |
| b1-u40-l04-q09 | A computer problem paralyzed the bank this morning, so nobody could take out money. | It closed for a holiday. ／ **Nobody could get their money.** ／ It moved to a new building. ／ It gave away free gifts. | It closed for a holiday. ／ **Nobody could get their money.** ／ It moved to a new building. ／ Its staff bought new computers. |
| b1-u40-l05-q09 | Swimming is forbidden here after six, because nobody is watching the pool. | **Nobody is watching the pool.** ／ The water becomes too cold at night. ／ The pool is cleaned every evening at six. ／ It gets too dark to see. | **No one is there to keep watch.** ／ The water becomes too cold at night. ／ The pool is cleaned every evening at six. ／ It gets too dark to see. |
| b1-u41-l03-q10 | My aunt is a lawyer who specializes in family problems. | Problems with old houses. ／ **Family problems.** ／ Car accidents. ／ Shop rules. | Problems with old houses. ／ **Trouble within families.** ／ Car accidents. ／ Shop rules. |
| b1-u41-l04-q10 | Be careful with my new car. There's already a scratch on the door. | The road is very wet. ／ The car belongs to a good friend. ／ **The car already has a scratch.** ／ The car is very old. | The road is very wet. ／ The car belongs to a good friend. ／ **The door has been damaged a little.** ／ The car is very old. |
| b1-u41-l05-q10 | I almost fell asleep. The movie bored me, so I left early. | It was too loud. ／ A friend needed help at home. ／ **The movie was boring.** ／ It was late. | The speaker fell asleep. ／ A friend needed help at home. ／ **The film wasn't interesting.** ／ The movie ended early. |
| b1-u41-l06-q10 | We don't have butter, so let's use oil as a substitute in the cake. | A little more sugar. ／ **Oil instead of butter.** ／ Some fresh milk. ／ Two more eggs. | A little more sugar. ／ **Oil instead of butter.** ／ Butter from the shop. ／ Two more eggs. |
| b1-u41-l07-q10 | Please don't tell me the ending. I don't want you to spoil the story. | Read the story aloud. ／ **Tell the ending.** ／ Close the book. ／ Borrow the book. | Read the story aloud. ／ **Say how the story ends.** ／ Tell the start of the story. ／ Borrow the book. |
| b1-u41-l08-q10 | After the long walk, my dog was limping, so I carried him home. | The dog lost its collar. ／ It started to rain very hard. ／ **The dog was limping.** ／ It got very dark. | The dog lost its collar. ／ It started to rain very hard. ／ **The dog had trouble walking.** ／ The dog wanted to go home. |
| b1-u41-l09-q09 | The outdoor concert was canceled owing to the strong wind. | The singer was ill. ／ Few tickets were sold. ／ **Because of the strong wind.** ／ The stage broke. | It was too cold outdoors. ／ Few tickets were sold. ／ **It was too windy.** ／ The stage broke. |
| b1-u42-l01-q10 | Our team won a bronze medal, which means we came third. | Fourth, with no medal. ／ First, with a gold medal. ／ Second, with a silver medal. ／ **Third place, with a bronze medal.** | Third, with no medal. ／ First, with a gold medal. ／ Second, with a silver medal. ／ **Behind two other teams.** |
| b1-u42-l02-q10 | Don't buy that watch. It looks shiny and new, but it's fake. | The store is closing very soon. ／ The watch is much too expensive. ／ **The watch is fake.** ／ It is too big. | The watch looks old. ／ The watch is much too expensive. ／ **The watch isn't real.** ／ It is too big. |
| b1-u42-l03-q10 | The rain will complicate our plans for the picnic, so let's eat at home. | Go to the park anyway. ／ **Have the picnic food at home.** ／ Wait until noon. ／ Buy umbrellas. | Have the picnic in the rain. ／ **Eat indoors instead.** ／ Wait until noon. ／ Buy umbrellas. |
| b1-u42-l04-q10 | Sorry, the table is sticky. Someone spilled juice on it. | **Someone spilled juice on it.** ／ A child dropped some ice cream on it. ／ The waiter put too much honey on it. ／ It was just painted. | **Some juice fell on it.** ／ A child dropped some ice cream on it. ／ Someone spilled honey on it. ／ It was just painted. |
| b1-u42-l05-q10 | Your phone number on the form is incorrect. Please write it again. | Sign at the bottom. ／ Bring the form back next Monday. ／ Call the office before five o'clock. ／ **Write the phone number again.** | Sign at the bottom of the form. ／ Bring the form back next Monday. ／ Call the office before five o'clock. ／ **Fix the wrong number on the form.** |
| b1-u42-l06-q10 | There's a fallen tree on the road by the park, so please take another way to school today. | **A tree is blocking the road.** ／ The road is being painted. ／ There is a big race. ／ The school moved. | **A tree is blocking the road.** ／ The road is being painted. ／ The park is closed. ／ The school moved. |
| b1-u42-l09-q10 | Sorry, Monday morning is inconvenient for me. Can we meet on Tuesday instead? | **On Tuesday instead.** ／ On Monday after lunch. ／ On Wednesday morning. ／ Next month. | **Tuesday, not Monday.** ／ On Monday after lunch. ／ On Wednesday morning. ／ Next month. |
| b1-u43-l01-q10 | My sister is so stubborn. She won't wear a coat, even in the snow. | She is very shy. ／ She is kind to everyone she meets. ／ She is often lazy. ／ **She is very stubborn.** | She is very shy. ／ She is kind to everyone she meets. ／ She is often lazy. ／ **She doesn't change her mind easily.** |
| b1-u43-l02-q10 | I was really annoyed. My brother used my computer without asking. | The brother ate all the cake in the fridge. ／ **The brother used the computer.** ／ The computer was broken. ／ The homework was lost. | The brother ate all the cake in the fridge. ／ **The computer was used without permission.** ／ The brother asked to use the computer. ／ The homework was lost. |
| b1-u43-l03-q10 | My little brother made a big fuss because his ice cream fell on the floor. | He wanted a new toy car. ／ He lost a game to his friend. ／ He was too tired to walk. ／ **His ice cream fell on the floor.** | He wanted a new toy car. ／ He lost a game to his friend. ／ He wanted more ice cream. ／ **He dropped his ice cream.** |
| b1-u43-l04-q10 | My little sister was terrified during the storm. She hid under her bed all night. | She stood at the window. ／ **She hid under her bed.** ／ She went outside. ／ She sang loudly. | She hid under the table. ／ **She got under her bed.** ／ She went outside. ／ She slept all night. |
| b1-u43-l05-q10 | Our new neighbors welcomed us warmly with a basket of fruit. | With a big dinner party. ／ With some fresh flowers. ／ With a short letter. ／ **With a basket of fruit.** | With a basket of flowers. ／ With a big dinner party. ／ With a short letter. ／ **With a gift of fruit.** |
| b1-u43-l08-q10 | She carelessly left her phone on the bus, and now she can't find it. | It was stolen at school. ／ It fell into the water. ／ **She left it on the bus by mistake.** ／ Her brother broke it. | Someone took it on the bus. ／ It fell into the water. ／ **She forgot it on the bus.** ／ Her brother broke it. |
| b1-u43-l09-q10 | I feel so stressed. My computer broke, and my report is due tomorrow. | **The computer broke, and the report is due.** ／ A friend is moving to another country soon. ／ The speaker has to move to a new house. ／ The weather is too hot. | **A broken computer and a report deadline.** ／ A friend is moving to another country soon. ／ The report was due yesterday. ／ The weather is too hot. |

## 不改的題與理由

理由代號：
- **A**：干擾項已經用到音檔裡的字、重疊程度不低於正解（例如音檔同時說了兩個時間或價格，干擾項就是另一個），不是「和音檔最像的就是正解」。
- **B**：正解已是換句話說（概括或改寫），干擾項也有音檔的字，選項長度與細節相當。
- **C**：答案是單一事實（月份、星期、名次、數值），英文沒有自然的換句話說；音檔裡也沒有其他同類的字可以拿來做干擾項，干擾項已是同類的其他值。

| 題 id | 理由 | 選項（粗體＝正解） |
|---|---|---|
| b1-u02-l02-q10 | A（A small kitchen 用到音檔的 kitchen） | Two meeting rooms. ／ A small kitchen. ／ A big garden. ／ **A big kitchen.** |
| b1-u02-l03-q10 | B | She often eats out at restaurants. ／ She never cooks. ／ She eats at her office. ／ **She usually cooks at home.** |
| b1-u02-l04-q10 | A（A part-time job at a bank 重疊更多） | **A permanent job at a bank.** ／ A part-time job at a bank. ／ A part-time job at a school. ／ She has no job now. |
| b1-u02-l07-q10 | B | The old one was too slow. ／ The office moved to a bigger new place. ／ **It kept having problems.** ／ Someone took the old one. |
| b1-u03-l09-q10 | A（The website design 用到 website） | The website design. ／ **The link.** ／ The new phone. ／ The meeting room. |
| b1-u04-l09-q10 | A（At nine 是音檔裡平常的關門時間） | At nine. ／ **At seven.** ／ At eight. ／ At ten. |
| b1-u05-l05-q10 | B | The shop is very small. ／ The shop is closing soon. ／ **It serves students.** ／ The shop is far from the town center. |
| b1-u05-l07-q09 | A（各選項都是金額，Two dollars 等用到 dollar） | Two dollars. ／ **One dollar.** ／ Ten dollars. ／ Fifty cents. |
| b1-u05-l08-q09 | B | Sales went up. ／ The boss left the shop. ／ **Sales went down.** ／ The shop moved away. |
| b1-u05-l09-q09 | C＋A（直徑數值；干擾項 Seventy meters、Seven centimeters 已用音檔的字） | Seven centimeters. ／ **Seventy centimeters.** ／ Seven meters. ／ Seventy meters. |
| b1-u06-l02-q10 | A（It is too expensive 用到音檔的問句） | It is too expensive. ／ **It will save money.** ／ It is too slow. ／ It needs more people. |
| b1-u06-l08-q10 | A（In the meeting room 用到音檔的字） | **In the cafe.** ／ In the meeting room. ／ At the hotel. ／ Online at home. |
| b1-u07-l02-q10 | C（開放月份 May；音檔沒有其他時間字） | In March. ／ **In May.** ／ Next year. ／ Next week. |
| b1-u07-l03-q10 | A（Paper books 用到音檔的字） | Paper books. ／ **Online sales.** ／ Paper magazines. ／ Newspapers. |
| b1-u08-l06-q10 | A（Last night 用到音檔的字） | In July. ／ Last night. ／ **In June.** ／ Next week. |
| b1-u09-l06-q10 | A（各選項都用到 window，只有動詞不同） | Who cleaned the window. ／ Who opened the window. ／ **Who broke the window.** ／ Who bought the window. |
| b1-u09-l08-q10 | A（One hundred、Nineteen 用到音檔的數字或近音） | Nineteen. ／ **Ninety.** ／ One hundred. ／ Eighty. |
| b1-u09-l09-q10 | B | They all cried. ／ They all left. ／ **They all laughed.** ／ They were silent. |
| b1-u10-l01-q10 | A（Twenty dollars 是音檔裡手鍊的價格） | Twenty dollars. ／ **Fifty dollars.** ／ Fifteen dollars. ／ Seventy dollars. |
| b1-u10-l02-q10 | A（It is cheaper 是音檔裡棉襯衫的優點） | It is cheaper. ／ **It is softer.** ／ It is warmer. ／ It is bigger. |
| b1-u10-l04-q10 | A（Ten pairs 用到音檔的 ten） | Three pairs. ／ One pair. ／ **Two pairs.** ／ Ten pairs. |
| b1-u10-l05-q09 | B | The speaker lost a bag. ／ **The speaker's own one broke.** ／ The speaker's hair is too long. ／ The speaker is going on a trip. |
| b1-u11-l01-q10 | A（Change the light 用到音檔的字） | **Hold the ladder.** ／ Change the light. ／ Turn off the light. ／ Bring a chair. |
| b1-u11-l06-q10 | A（In the tent 用到音檔的字） | At a hotel. ／ In the tent. ／ In the car. ／ **In the hut.** |
| b1-u11-l09-q10 | B | **Wait a moment.** ／ Clean the room. ／ Come back tomorrow. ／ Close the door. |
| b1-u13-l01-q10 | A（Bread 是音檔裡早上賣的） | Sandwiches. ／ Bread. ／ Coffee. ／ **Cakes.** |
| b1-u14-l01-q10 | A（In the training room 用到音檔的字） | In the training room. ／ **In Room 3.** ／ In the café. ／ At the front desk. |
| b1-u15-l02-q10 | C＋A（金額；Nothing at all 對應音檔「星期天免費」） | Nothing at all. ／ Twenty dollars. ／ **Five dollars.** ／ Twelve dollars. |
| b1-u15-l03-q10 | A（Free gas 用到 free） | Free gas. ／ **Repairs.** ／ Insurance. ／ Parking. |
| b1-u15-l05-q09 | A（Before passport control 用到音檔的字） | Before passport control. ／ **Near Gate 5.** ／ Outside the airport. ／ Next to the bank. |
| b1-u17-l03-q11 | A（Every hour 用到音檔的字） | **At six.** ／ At five. ／ At seven. ／ Every hour. |
| b1-u17-l07-q10 | A（Breakfast 是音檔裡免費的） | Maps. ／ Breakfast. ／ **Towels.** ／ Hot water. |
| b1-u18-l01-q10 | A（各選項都是登機門號碼，Gate 21 等） | Gate 2. ／ Gate 7. ／ Gate 21. ／ **Gate 12.** |
| b1-u18-l02-q10 | A（In front of the hotel 用到音檔的字） | Next to the station. ／ In front of the hotel. ／ On the street. ／ **Behind the building.** |
| b1-u19-l01-q08 | B | At ten tomorrow morning. ／ **At four p.m.** ／ At noon tomorrow. ／ At eight tonight. |
| b1-u20-l01-q11 | A（In Room 2 用到音檔的字） | In the park outside. ／ In Room 2. ／ **In Room 5.** ／ In the gym downstairs. |
| b1-u20-l04-q10 | B | The report isn't finished yet. ／ The speaker is sick today. ／ The internet is not working. ／ **The computer has a problem.** |
| b1-u20-l06-q10 | B | **It costs nothing.** ／ It costs ten dollars. ／ It costs five dollars. ／ It costs twenty dollars. |
| b1-u22-l01-q11 | C（日期 next Sunday；改寫成 this Sunday 等會有英文本身的歧義，不改） | Tomorrow. ／ Next Saturday. ／ **Next Sunday.** ／ Tonight. |
| b1-u22-l05-q10 | A（At nine 是音檔裡的開演時間） | At nine. ／ At eight thirty. ／ **At eight.** ／ At ten. |
| b1-u22-l07-q10 | A（This Friday at nine p.m. 用到音檔的字） | This Friday at nine p.m. ／ **Next Monday at nine.** ／ Next Saturday at seven. ／ Tonight at ten. |
| b1-u23-l02-q10 | C＋A（名次；In first place 對應音檔「去年拿冠軍」） | Second. ／ In first place. ／ **Third place.** ／ Fifth. |
| b1-u23-l04-q09 | A（Monday mornings as before 用到音檔的字） | **Wednesday evenings.** ／ Monday mornings as before. ／ Every weekend afternoon. ／ Friday nights. |
| b1-u23-l05-q09 | A（Ten dollars 用到音檔的 ten） | Ten dollars. ／ Twenty-five dollars. ／ **Fifteen dollars.** ／ It's free. |
| b1-u24-l01-q08 | B | It opens late. ／ The museum closes very early. ／ Tickets are cheaper at the door. ／ **It is very popular.** |
| b1-u25-l08-q10 | A（Five dollars each 用到音檔的字） | **It is free for students.** ／ Five dollars each. ／ Three dollars each. ／ Half the normal price. |
| b1-u27-l01-q10 | B | Tonight is the last day. ／ The phone store will close. ／ A new phone is coming. ／ **The power will be off tomorrow.** |
| b1-u27-l02-q10 | C（星期 Thursday；音檔沒有其他時間字） | Every other Monday. ／ On Tuesday morning. ／ **On Thursday.** ／ On Friday. |
| b1-u28-l04-q10 | B | The cards help visitors find rooms. ／ **It is a new safety rule.** ／ The guards can't remember faces. ／ It is for the photos. |
| b1-u29-l01-q11 | B | The river path is being repaired today. ／ The road is much shorter than the path. ／ **The river path isn't safe.** ／ The road has more shops and cafés. |
| b1-u29-l06-q10 | B（It is very old 是「兩千多年」的概括） | It is very hot. ／ **It is very old.** ／ It is not finished. ／ It belongs to a shop. |
| b1-u31-l01-q12 | A（By the end of next week、After the phone interview 用到音檔的字） | By the end of next week. ／ **Before Friday.** ／ After the phone interview. ／ On Monday morning. |
| b1-u33-l02-q09 | C（年數 two years；音檔沒有其他時間字） | Three months. ／ **Two years.** ／ Five years. ／ One year and a half. |
| b1-u34-l06-q10 | B | **Go to Gate 5.** ／ Wait for the next flight. ／ Call the airline's office. ／ Buy a new ticket. |
| b1-u34-l07-q10 | B | The floor is wet. ／ The glasses are very hot. ／ **The glasses may fall and break.** ／ The drinks will get cold. |
| b1-u35-l05-q10 | A（Only the small size 用到音檔的字） | All three sizes. ／ Only the small size. ／ The large one. ／ **Just the medium size.** |
| b1-u35-l06-q10 | B | At the end of the road. ／ Next to the big curve on the left. ／ Behind the school. ／ **On the right after the curve.** |
| b1-u35-l07-q10 | A（By phone, before Friday 用到音檔的字） | In person at the next meeting. ／ By phone, before Friday. ／ **In a written report.** ／ By text message tonight. |
| b1-u36-l05-q10 | B | It was built last century by a king. ／ It is three hundred years old for sure. ／ **It may be three hundred years old.** ／ Everyone knows it is new. |
| b1-u36-l07-q09 | B | **Always keep your bag with you.** ／ Keep your ticket in your bag. ／ Arrive early at the airport. ／ Ask someone to help you. |
| b1-u38-l01-q10 | A（Chapter five is the hardest one 用到音檔的字） | Chapter five is the hardest one. ／ The teacher was absent last week. ／ **The test is on Monday.** ／ The students asked for it yesterday. |
| b1-u38-l03-q10 | B | In red ink, at the top. ／ On the back of the form. ／ **Clearly, so it's easy to read.** ／ In very small letters. |
| b1-u38-l04-q10 | B | A driver for the school bus. ／ A teacher who speaks three languages. ／ **A teacher for the music classes.** ／ A cook for school lunches. |
| b1-u41-l01-q10 | B（modify 改寫成 change；Wash the dress 等已用 dress） | Sell you a bigger dress. ／ Give you your money back. ／ Wash the dress. ／ **Change the dress to fit.** |
| b1-u41-l02-q10 | B | Buy some new toys today. ／ Play outside after lunch. ／ Give the toys to a friend. ／ **Clean up the toys.** |
| b1-u42-l07-q10 | B | The library will close for a month. ／ New books will arrive. ／ The library will move. ／ **Some old books will be repaired.** |
| b1-u42-l08-q10 | B | Toward the north. ／ Back to the city. ／ Toward the east. ／ **Toward the west.** |
| b1-u43-l06-q10 | B | Someone who can cook dinner. ／ Someone who lives far away. ／ A person who loves dogs. ／ **Someone to trust.** |
| b1-u43-l07-q10 | B | **His sister came.** ／ The gift was broken. ／ His mom called him. ／ It started to rain. |

## 改到選項的題 id（200 題，供重新盲答）

b1-u01-l01-q11
b1-u01-l02-q11
b1-u01-l03-q10
b1-u01-l04-q10
b1-u01-l05-q10
b1-u01-l06-q10
b1-u02-l01-q11
b1-u02-l05-q10
b1-u02-l06-q10
b1-u03-l01-q10
b1-u03-l02-q10
b1-u03-l03-q10
b1-u03-l04-q10
b1-u03-l05-q10
b1-u03-l06-q10
b1-u03-l07-q10
b1-u03-l08-q10
b1-u03-l10-q10
b1-u04-l01-q11
b1-u04-l02-q11
b1-u04-l03-q11
b1-u04-l04-q10
b1-u04-l05-q10
b1-u04-l06-q10
b1-u04-l07-q10
b1-u04-l08-q10
b1-u05-l01-q10
b1-u05-l02-q10
b1-u05-l03-q10
b1-u05-l04-q10
b1-u05-l06-q10
b1-u05-l10-q09
b1-u06-l01-q10
b1-u06-l03-q10
b1-u06-l04-q10
b1-u06-l05-q10
b1-u06-l06-q10
b1-u06-l07-q10
b1-u07-l01-q10
b1-u07-l04-q10
b1-u07-l05-q10
b1-u07-l06-q09
b1-u07-l07-q09
b1-u08-l01-q11
b1-u08-l02-q10
b1-u08-l03-q10
b1-u08-l04-q10
b1-u08-l05-q10
b1-u08-l07-q10
b1-u09-l01-q10
b1-u09-l02-q10
b1-u09-l03-q10
b1-u09-l04-q10
b1-u09-l05-q10
b1-u09-l07-q10
b1-u09-l10-q10
b1-u10-l03-q10
b1-u11-l02-q10
b1-u11-l03-q10
b1-u11-l04-q10
b1-u11-l05-q10
b1-u11-l07-q10
b1-u11-l08-q10
b1-u11-l10-q09
b1-u12-l01-q10
b1-u12-l02-q10
b1-u13-l02-q10
b1-u13-l03-q10
b1-u13-l04-q10
b1-u13-l05-q10
b1-u13-l06-q10
b1-u13-l07-q10
b1-u13-l08-q09
b1-u15-l01-q10
b1-u15-l04-q09
b1-u16-l01-q09
b1-u17-l01-q11
b1-u17-l02-q11
b1-u17-l04-q10
b1-u17-l05-q10
b1-u17-l06-q10
b1-u18-l03-q10
b1-u18-l04-q10
b1-u18-l05-q10
b1-u18-l06-q09
b1-u20-l02-q11
b1-u20-l03-q10
b1-u20-l05-q10
b1-u20-l07-q10
b1-u20-l08-q10
b1-u20-l09-q10
b1-u20-l10-q10
b1-u21-l01-q08
b1-u22-l02-q11
b1-u22-l03-q11
b1-u22-l04-q10
b1-u22-l06-q10
b1-u23-l01-q10
b1-u23-l03-q09
b1-u24-l02-q08
b1-u25-l01-q10
b1-u25-l02-q10
b1-u25-l03-q10
b1-u25-l04-q10
b1-u25-l05-q10
b1-u25-l06-q10
b1-u25-l07-q10
b1-u26-l01-q10
b1-u26-l02-q10
b1-u26-l03-q10
b1-u26-l04-q10
b1-u26-l05-q10
b1-u26-l06-q10
b1-u27-l03-q10
b1-u28-l01-q10
b1-u28-l02-q10
b1-u28-l03-q10
b1-u28-l05-q10
b1-u28-l06-q10
b1-u29-l02-q10
b1-u29-l03-q10
b1-u29-l04-q10
b1-u29-l05-q10
b1-u29-l07-q10
b1-u30-l01-q11
b1-u30-l02-q10
b1-u30-l03-q10
b1-u30-l04-q10
b1-u30-l05-q10
b1-u30-l06-q10
b1-u30-l07-q10
b1-u30-l08-q10
b1-u32-l01-q11
b1-u32-l02-q10
b1-u32-l03-q10
b1-u33-l01-q10
b1-u34-l01-q10
b1-u34-l02-q10
b1-u34-l03-q10
b1-u34-l04-q10
b1-u34-l05-q10
b1-u34-l08-q10
b1-u34-l09-q10
b1-u34-l10-q10
b1-u35-l01-q10
b1-u35-l02-q10
b1-u35-l03-q10
b1-u35-l04-q10
b1-u35-l08-q10
b1-u35-l09-q10
b1-u36-l01-q10
b1-u36-l02-q10
b1-u36-l03-q10
b1-u36-l04-q10
b1-u36-l06-q10
b1-u37-l01-q10
b1-u37-l02-q10
b1-u37-l03-q10
b1-u37-l04-q10
b1-u37-l05-q10
b1-u37-l06-q10
b1-u37-l07-q10
b1-u37-l08-q10
b1-u37-l09-q10
b1-u38-l02-q10
b1-u38-l05-q09
b1-u38-l06-q09
b1-u38-l07-q09
b1-u39-l01-q10
b1-u39-l02-q10
b1-u39-l03-q10
b1-u39-l04-q10
b1-u39-l05-q10
b1-u39-l06-q10
b1-u40-l01-q10
b1-u40-l02-q10
b1-u40-l03-q09
b1-u40-l04-q09
b1-u40-l05-q09
b1-u41-l03-q10
b1-u41-l04-q10
b1-u41-l05-q10
b1-u41-l06-q10
b1-u41-l07-q10
b1-u41-l08-q10
b1-u41-l09-q09
b1-u42-l01-q10
b1-u42-l02-q10
b1-u42-l03-q10
b1-u42-l04-q10
b1-u42-l05-q10
b1-u42-l06-q10
b1-u42-l09-q10
b1-u43-l01-q10
b1-u43-l02-q10
b1-u43-l03-q10
b1-u43-l04-q10
b1-u43-l05-q10
b1-u43-l08-q10
b1-u43-l09-q10

## 最終複審後修正（第 2 輪，2026-10-03）

重新盲答 200 題：四份都和正解一致，0 多解。最終複審（t9/b1lr-final.md）提出 FIX 1 條，審題員另外指出 6 處形式線索或用語問題，共 7 處，都已修正。每處改動另寫一筆 judge.resolvedAfterFinalReview。這 6 題要再送一次盲答。

| 題 id | 問題 | 改前（粗體＝正解） | 改後 |
|---|---|---|---|
| b1-u25-l05-q10 | FIX：只有正解是兩件事，又最長 | Read the instructions aloud. ／ Clean the safety glasses. ／ Turn off the lights. ／ **Check the directions and protect your eyes.** | 干擾項 2 改成 Read the steps and clean your glasses. |
| b1-u04-l02-q11 | 只有正解不以 At 開頭 | At seven in the evening. ／ At eight every morning. ／ **Seven in the morning.** ／ At nine every morning. | Seven in the evening. ／ Eight every morning. ／ **Seven in the morning.** ／ Nine every morning.（四個都不用 At） |
| b1-u25-l07-q10 | 只有正解時間在前 | In the main hall at noon. ／ In the library at nine. ／ In the gym at ten. ／ **Nine o'clock, in the main hall.** | 正解改成 **In the main hall at nine.**（干擾項也有 main hall 和 nine） |
| b1-u32-l01-q11 | 只有正解不以 To 開頭 | To next Monday morning. ／ **This coming Thursday.** ／ To Thursday next week. ／ To Friday evening. | 正解改成 **To this coming Thursday.** |
| b1-u30-l02-q10 | 只有正解帶逗號、寫 twelve o'clock | Friday morning. ／ Tomorrow at noon. ／ **Friday, at twelve o'clock.** ／ Monday at noon. | Friday at ten. ／ Tomorrow at noon. ／ **Friday at twelve.** ／ Monday at noon.（統一成「X at Y」） |
| b1-u13-l08-q09 | 正解用語生硬 | **Yourself, using warm water.** ／ In the dishwasher at night. ／ By hand with cold water. ／ Leave it in water overnight. | 正解改成 **By hand, using warm water.** |

第 2 輪修完後的長度名次（第 1/2/3/4 長）：
- B1 全級：27.0 / 28.6 / 24.7 / 19.7%
- 第 1 批：23.7 / 32.5 / 24.6 / 19.3%
- 第 1 批不含 u01：19.6 / 33.3 / 27.5 / 19.6%
- 第 2 批：25.0 / 16.0 / 31.6 / 27.4%
- 第 3 批：32.3 / 35.4 / 15.6 / 16.7%
- 第 4 批：27.2 / 29.2 / 25.7 / 18.0%

全部在 13–37% 內，0.5～2 倍異常值 0 筆。`--require-judge` B1 269 課全綠，五級 984 課全綠；`npm test` 209／209 通過。

## 第 3 輪（重新盲答回饋，2026-10-03）

第 2 輪改過的 6 題重新盲答，都和正解一致。只剩一處要改：b1-u30-l02-q10 的干擾項「Tomorrow at noon.」。音檔沒說今天星期幾，如果今天是星期四，這個選項也成立。已改成「Thursday at noon.」，音檔明確說是 Friday，所以這個選項一定不成立。兩個寫法字數相同，長度名次分布和第 2 輪一樣，0.5～2 倍異常值 0 筆。`--require-judge` 全綠，`npm test` 209／209 通過。
