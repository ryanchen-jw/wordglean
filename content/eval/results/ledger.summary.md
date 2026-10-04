<!-- 由 content/scripts/llm-eval.mjs 產生；prompt grade-writing.v2；題組 llm-eval-set.v1；帳本 content\eval\results\ledger.jsonl -->

| 模型 | 完成／總數 | 正確率（判錯且修對） | 有判出錯誤 | 解析成功 | 呼叫失敗 | 延遲中位數 | 花費（US$） |
|---|---|---|---|---|---|---|---|
| `qwen/qwen3.8-27b:free` | 40／40 | 40（100%） | 40 | 40 | 0 | 3.3 秒 | 0.0000 |
| `apodex/apodex-1.1-mini:free` | 40／40 | 2（5%） | 2 | 2 | 0 | 9.7 秒 | 0.0000 |

### qwen/qwen3.8-27b:free

| 題 | 錯誤類型 | 學習者句子 | 批改句 | 修對 | 繁中解釋 | 解釋分（0–2） |
|---|---|---|---|---|---|---|
| ev-01 | 冠詞 a／an | I have a apple. | I have an apple. | ✓ | 「apple」是以母音開頭的單字，前面應該用「an」而不是「a」。 在英語中，以母音開頭的單字（如 apple、egg、orange）前面要用不定冠詞「an」，而不是「a」。這是 A1 階段非常重要的一項語法規則。 |  |
| ev-02 | 主詞動詞一致（第三人稱單數） | She drink coffee every morning. | She drinks coffee every morning. | ✓ | 主詞是第三人稱單數 she，現在簡單式動詞要加 s。 第三人稱單數（he、she、it）搭配現在簡單式時，動詞要加 -s，所以 drink 要變成 drinks。 |  |
| ev-03 | 中文「有」直譯（There has） | There has a book on the table. | There is a book on the table. | ✓ | 表示「某處有某物」時，英文用 there is／there are，不能用 there has。there has 是錯誤的結構。 用 there is 或 there are 來表達「某處有某物」，這是 A1 的基本句型。中文的「有」在此類句子中對應的是 there is／there are，而不是 have／has。 |  |
| ev-04 | 副詞位置（very 修飾動詞） | I very like music. | I really like music. | ✓ | very 不能直接放在動詞前面修飾動詞，應該用 really 來修飾動詞，或改寫成 like … very much。 在英文中，very 只能修飾形容詞或副詞，不能直接放在動詞前面。要表達「非常喜歡」，可以用 really like 或 like … very much。 |  |
| ev-05 | 過去式 | Yesterday I go to the library. | Yesterday I went to the library. | ✓ | 因為句首有 yesterday 表示過去時間，動詞必須用過去式 went，不能用原形 go。 描述過去發生的事情時，動詞要用過去式。yesterday 是最常見的過去時間詞，搭配過去式 went 使用。 |  |
| ev-06 | 間接問句語序 | He doesn't know where does she live. | He doesn't know where she lives. | ✓ | 間接問句要用直述句語序（主詞＋動詞），不能像直接問句那樣把助動詞 does 放在主詞前面倒裝。 在間接問句（embedded question）中，where 後面必須接直述句語序，也就是「主詞＋動詞」，不能再用 does 來倒裝。正確寫法是 where she lives。 |  |
| ev-07 | Although 與 but 並用 | Although it was raining, but we still went to the park. | Although it was raining, we still went to the park. | ✓ | although 和 but 是兩個轉折連詞，英文中不能在同一句同時使用。用 although 開頭後，主句直接接下去，不需要再加 but。 Although 和 but 都是表示轉折的連詞，英文中同一句只能選一個使用。用 Although 放在句首表達讓步時，後面主句不能再出現 but。 |  |
| ev-08 | 時間介系詞（星期用 on） | We have a test in Monday. | We have a test on Monday. | ✓ | 星期幾前面要用介詞 on，例如 on Monday、on Tuesday，不能用 in。 在英文中，星期幾前面一律使用介詞 on，例如 on Monday、on Wednesday。in 通常用於較長的時間範圍，如月份或年份（in January、in 2025）。 |  |
| ev-09 | 不可數名詞加 s | The teacher gave us many advices. | The teacher gave us a lot of advice. | ✓ | advice 是不可數名詞，不能用 many 來修飾，應該用 a lot of 或 much。 advice 是不可數名詞，沒有複數形式，不能加 s。 advice 是不可數名詞，不能加 s 變複數，也不能用 many 來形容。要用 a lot of 或 much 來表達「很多」。 |  |
| ev-10 | look forward to＋動名詞 | I am looking forward to meet you. | I am looking forward to meeting you. | ✓ | look forward to 中的 to 是介系詞，不是不定式标记，因此後面要接動名詞（V-ing），而不是原形動詞。 「look forward to」的 to 是介系詞，不是不定式的 to，所以後面要接動名詞（meeting），而不是原形動詞（meet）。這是 B1 級很常見的錯誤，記住介系詞後面一定要接名詞或動名詞。 |  |
| ev-11 | 及物動詞多加介系詞（discuss about） | We will discuss about this problem tomorrow. | We will discuss this problem tomorrow. | ✓ | discuss 是及物動詞，後面直接接受詞，不需要加介詞 about。 discuss 是及物動詞，直接加上受詞即可，例如 discuss this problem。如果要使用 about，則應改用 talk about 或 speak about。 |  |
| ev-12 | -ing／-ed 形容詞（boring／bored） | I was very boring during the movie. | I was very bored during the movie. | ✓ | 形容人「覺得無聊」要用 bored（-ed 形容詞），boring（-ing 形容詞）是用來形容事物「讓人覺得無聊」，例如 the movie is boring。 -ed 結尾的形容詞（如 bored）用來描述人的感受，-ing 結尾的形容詞（如 boring）用來描述事物或情境的特性。這裡是描述「我」的感覺，所以要用 bored。 |  |
| ev-13 | 現在完成式（持續到現在） | I live in Taipei for five years. | I have lived in Taipei for five years. | ✓ | 表示「從過去持續到現在」的狀態，應該用現在完成式（have + 過去分詞），而不是簡單現在式。 「已經五年了」表示一個從過去持續到現在的狀態，英文要用現在完成式 have lived，而非簡單現在式 live。 |  |
| ev-14 | 比較級重複（more better） | Her English is more better than mine. | Her English is much better than mine. | ✓ | better 已經是比較級，不能再加 more 構成雙重比較級。若要加強語氣，應使用 much，例如 much better。 better 本身已是 good 的比較級形式，前面不能再加 more。要表達「好多了」，用 much better 來加強程度即可。 |  |
| ev-15 | 助動詞後接原形 | I didn't went to work yesterday. | I didn't go to work yesterday. | ✓ | did 是過去式的助動詞，後面的動詞要回到原形，所以用 go 而不是 went。 過去式否定句的结构是 didn't + 動詞原形。因為 did 已經帶有「過去」的意思，主動詞就不需要再變化為過去式了。 |  |
| ev-16 | suggest 的句型 | He suggested me to sleep earlier. | He suggested I sleep earlier. | ✓ | suggest 後面不能接「人＋to 不定詞」（不像 advise 或 tell）。正確用法是 suggest (that) 子句，主詞後直接接原形動詞。 suggest 跟 advise、tell 不一樣，它不能接「人＋to 不定詞」。正確結構是 suggest (that) 主詞＋原形動詞，例如 He suggested I sleep earlier。 |  |
| ev-17 | 中式搭配（開燈） | Please open the light. | Please turn on the light. | ✓ | 燈的「打開」要用 turn on 或 switch on，不能用 open。Open 通常搭配門、窗、盒子等可以「打開」的物件，電燈、電器等要用 turn on。 在英文中，打開電燈、電器用 turn on（或 switch on），不用 open。Open 是用來搭配門、窗、書等可以物理性打開的東西。 |  |
| ev-18 | 不及物動詞誤用被動（happen） | When was it happened? | When did it happen? | ✓ | happen 是不及物動詞，沒有被動式，不能說 was happened。問過去的事情要用 did + 動詞原形，即 did it happen。 happen 是不及物動詞，沒有被動式，不能說 was happened。問過去的時間要用 did + 主詞 + 動詞原形，所以正確說法是 When did it happen? |  |
| ev-19 | be 動詞＋一般動詞（am agree） | I am agree with you. | I agree with you. | ✓ | agree 是動詞，不是形容詞，所以前面不加 am。直接用「I agree with you」就可以了。 agree 在這裡是動詞（主動詞），不需要搭配 be 動詞。中文的「我同意你的看法」中，「同意」是動詞，英文也直接用動詞 agree，不需要加 am。 |  |
| ev-20 | spend 的句型 | I spent a lot of money to buy this phone. | I spent a lot of money buying this phone. | ✓ | spend 錢之後不能接不定式 to V，要用 spend 錢＋動名詞（V-ing）或 spend 錢 on 名詞。 spend 的用法是 spend 金錢（in）動名詞，例如 spend money buying something。不能說 spend money to buy，這是中文「花錢買」直譯造成的錯誤。也可以說 spend money on this phone。 |  |
| ev-21 | marry 多加介系詞 | She married with a doctor. | She married a doctor. | ✓ | marry 是及物動詞，直接接人當受詞，不需要加 with。正確說法是 married a doctor。 marry 是及物動詞，後面直接接人，例如 married a doctor。中文的「給」在這裡不要翻譯成 with。若想用 to，則要用 get married to a doctor 的形式。 |  |
| ev-22 | people 是複數 | The people here is very friendly. | The people here are very friendly. | ✓ | people 是複數名詞，動詞要用 are，不能用 is。 people 是複數名詞，所以要搭配複數動詞 are。中文說「人都很友善」，英文就是 The people here are very friendly. |  |
| ev-23 | 使役動詞後接原形 | He made me to wait for an hour. | He made me wait for an hour. | ✓ | make 作為使役動詞時，後面接「受詞＋原形動詞（bare infinitive）」，不能加 to。正確用法：make someone do something。 make 作使役動詞時，結構是 make＋受詞＋原形動詞，受詞後直接用動詞原形，不要加 to。類似結構還有 let、have（使役用法）。 |  |
| ev-24 | explain 的受詞位置 | Can you explain me this word? | Can you explain this word to me? | ✓ | explain 不可以直接接雙賓語，必須用 explain 東西 to 人的結構，不能說 explain 人 東西。 explain 和 give 不一樣，不能直接接兩個名詞（受事者＋聽者）。正確結構是 explain something to someone，中間要用 to 來標示聽者。 |  |
| ev-25 | already 與時態 | I already eat breakfast. | I have already eaten breakfast. | ✓ | 「已經完成的事」要用現在完成式（have + 過去分詞），不能用現在簡單式。另外，already 在現在完成式中要放在 have 和過去分詞之間。 「已經吃過早餐了」表示動作已完成，應該用現在完成式 have already eaten，而不是現在簡單式 eat。already 的位置也要放在助動詞 have 和過去分詞 eaten 之間。 |  |
| ev-26 | 不可數名詞加 s（homework） | We have a lot of homeworks to do. | We have a lot of homework to do. | ✓ | homework 是不可數名詞，後面不能加 s。 如同 information、furniture 等，homework 永遠以單形出現，不可加 -s 變成複數。 homework 在英文中是不可數名詞，無法加 s 變成複數。正確說法是 a lot of homework 或 some homework。 |  |
| ev-27 | because 與 so 並用 | Because it rained, so the game was cancelled. | Because it rained, the game was cancelled. | ✓ | 在英文中，because 和 so 不能同時出現在同一個句子裡。因為已經用了 because 來表達原因，後面就不需要再加 so 了。 因為中文可以用「因為……所以……」的結構，但英文中 because 和 so 只能擇其一。用了 because 之後，主句前面不要再加 so。 |  |
| ev-28 | despite 後接子句 | Despite she was tired, she finished the work. | Despite being tired, she finished the work. | ✓ | despite 是介系詞，後面不能接完整子句（主詞＋動詞），必須接名詞或動名詞。正確寫法是 Despite being tired 或 Despite feeling tired。 despite 是介系詞，後面只能接名詞或動名詞，不能接子句。如果要表達完整的子句，應該改用 although 或 even though。例如：Although she was tired, she finished the work. |  |
| ev-29 | 現在完成式配過去時間 | He has gone to Japan last month. | He went to Japan last month. | ✓ | 當有明確的過去時間（如 last month）時，必須使用過去式（went），不能用現在完成式（has gone）。 「上個月」是明確的過去時間，搭配過去式（went），不用現在完成式（has gone）。現在完成式通常不搭配具體的過去時間詞。 |  |
| ev-30 | can 與 able to 並用 | I can't able to attend tomorrow's meeting. | I can't attend tomorrow's meeting. | ✓ | can't 和 be able to 都有「能夠」的意思，不能疊在一起用。選「can't attend」或「won't be able to attend」即可。 can 本身已表達能力，再加 able to 屬於重複，語法上不能同時使用。選一種說法就好，例如 I can't attend 或 I won't be able to attend。 |  |
| ev-31 | 冠詞 a／an | I have an pen. | I have a pen. | ✓ | 「pen」是以母音字母 p（子音）開頭，所以前面要用 a，不用 an。 a 後面接以子音開頭的字，an 後面接以母音開頭的字。「pen」發音 /p/ 是子音開頭，所以正確用法是 a pen。 |  |
| ev-32 | 過去式 | Yesterday I watch a movie with my friends. | Yesterday I watched a movie with my friends. | ✓ | yesterday 表示過去，所以動詞必須用過去式。watch 的過去式是 watched。 yesterday 是一個過去的時間副詞，搭配它時動詞一定要用過去式。watch 是規則動詞，加上 -ed 變成 watched。 |  |
| ev-33 | enjoy＋動名詞 | I enjoy to swim in the summer. | I enjoy swimming in the summer. | ✓ | enjoy 後面一定要接動名詞（-ing 形式），不能接 to 不定詞。正確用法是 enjoy swimming。 enjoy 是動詞，後面接動名詞（-ing）當賓語，不可以接 to 不定詞。例如：I enjoy reading / swimming / cooking。 |  |
| ev-34 | whether 子句語序 | I am not sure whether should I call him. | I am not sure whether I should call him. | ✓ | whether 導引的名詞子句（作為補充語）必須使用直述句語序，即主詞在前、動詞在後，不能像疑問句那样倒裝。 whether 導引的名詞子句中，語序應為直述句（主詞＋動詞），而非疑問句的倒裝語序。正確的寫法是「whether I should call him」而非「whether should I call him」。 |  |
| ev-35 | since 與現在完成式 | I study English since 2020. | I have studied English since 2020. | ✓ | since 搭配「從過去持續到現在」的語義時，主句必須用現在完成式（have/has + 過去分詞），不能用一般現在式。 when we use since to mark the starting point of an action that continues up to now, the main clause must be in the present perfect tense. The correct form is "have/has + past participle." |  |
| ev-36 | 不可數名詞加 s（information） | Can you give me some informations about the tour? | Can you give me some information about the tour? | ✓ | information 是不可數名詞，不能加 s 變複數。要表示「一些資訊」用 some information 就好。 information 是不可數名詞，沒有複數形式，所以不能寫成 informations。要用 some 來表示「一些」。 |  |
| ev-37 | 介系詞後接動名詞 | I am afraid of speak English in public. | I am afraid of speaking English in public. | ✓ | 介系詞 of 後面必須接動名詞（-ing 形式），所以 speak 要改為 speaking。 「afraid of」中的 of 是介系詞，後面必須接名詞或動名詞（-ing），不能接動詞原形。例如：afraid of speaking, afraid of failing。 |  |
| ev-38 | listen 少了 to | I like to listen music at night. | I like to listen to music at night. | ✓ | listen 是不及物動詞，後面不能直接接名詞，必須加上介詞 to，寫成 listen to music。 listen 是不及物動詞，後面要接名詞時必須加介詞 to。例如：listen to music、listen to a song。 |  |
| ev-39 | used to＋原形 | I used to playing basketball after school. | I used to play basketball after school. | ✓ | used to 表示「過去常常做某事」時，後面要接原形動詞，不能接 -ing 形式。注意不要跟 be used to doing（習慣了做某事）混淆。 used to + 原形動詞用來表達過去的习惯或狀態，現在已不再如此。此處應寫成 used to play，而不是 used to playing。 |  |
| ev-40 | unless 多加否定 | Unless you don't hurry, you will miss the bus. | Unless you hurry, you will miss the bus. | ✓ | unless 本身已經含有「如果不」的否定意思，後面子句要用肯定式。加上 don't 會變成雙重否定，整句意思就反了。 unless 等於 if not（如果不），所以它接的子句要用肯定形式，不需要再加 don't。例如：Unless you hurry, you will miss the bus.（如果你不趕快，你會錯過公車。） |  |

### apodex/apodex-1.1-mini:free

| 題 | 錯誤類型 | 學習者句子 | 批改句 | 修對 | 繁中解釋 | 解釋分（0–2） |
|---|---|---|---|---|---|---|
| ev-01 | 冠詞 a／an | I have a apple. | — | ✗ | （parse_failed） |  |
| ev-02 | 主詞動詞一致（第三人稱單數） | She drink coffee every morning. | — | ✗ | （parse_failed） |  |
| ev-03 | 中文「有」直譯（There has） | There has a book on the table. | — | ✗ | （parse_failed） |  |
| ev-04 | 副詞位置（very 修飾動詞） | I very like music. | — | ✗ | （parse_failed） |  |
| ev-05 | 過去式 | Yesterday I go to the library. | — | ✗ | （parse_failed） |  |
| ev-06 | 間接問句語序 | He doesn't know where does she live. | — | ✗ | （parse_failed） |  |
| ev-07 | Although 與 but 並用 | Although it was raining, but we still went to the park. | — | ✗ | （parse_failed） |  |
| ev-08 | 時間介系詞（星期用 on） | We have a test in Monday. | — | ✗ | （parse_failed） |  |
| ev-09 | 不可數名詞加 s | The teacher gave us many advices. | — | ✗ | （parse_failed） |  |
| ev-10 | look forward to＋動名詞 | I am looking forward to meet you. | I am looking forward to meeting you. | ✓ | 在片語 "look forward to" 中，"to" 是介系詞而不是不定詞的 to，所以後面要接動名詞（V-ing），不能用動詞原形 meet。 因為 "to" 在這裡是介系詞，介系詞後面需要接動名詞。這個用法在 B1 等級很常見，改成 meeting 後句子才正確。 |  |
| ev-11 | 及物動詞多加介系詞（discuss about） | We will discuss about this problem tomorrow. | — | ✗ | （parse_failed） |  |
| ev-12 | -ing／-ed 形容詞（boring／bored） | I was very boring during the movie. | — | ✗ | （parse_failed） |  |
| ev-13 | 現在完成式（持續到現在） | I live in Taipei for five years. | — | ✗ | （parse_failed） |  |
| ev-14 | 比較級重複（more better） | Her English is more better than mine. | — | ✗ | （parse_failed） |  |
| ev-15 | 助動詞後接原形 | I didn't went to work yesterday. | — | ✗ | （parse_failed） |  |
| ev-16 | suggest 的句型 | He suggested me to sleep earlier. | — | ✗ | （parse_failed） |  |
| ev-17 | 中式搭配（開燈） | Please open the light. | — | ✗ | （parse_failed） |  |
| ev-18 | 不及物動詞誤用被動（happen） | When was it happened? | — | ✗ | （parse_failed） |  |
| ev-19 | be 動詞＋一般動詞（am agree） | I am agree with you. | — | ✗ | （parse_failed） |  |
| ev-20 | spend 的句型 | I spent a lot of money to buy this phone. | — | ✗ | （parse_failed） |  |
| ev-21 | marry 多加介系詞 | She married with a doctor. | — | ✗ | （parse_failed） |  |
| ev-22 | people 是複數 | The people here is very friendly. | — | ✗ | （parse_failed） |  |
| ev-23 | 使役動詞後接原形 | He made me to wait for an hour. | — | ✗ | （parse_failed） |  |
| ev-24 | explain 的受詞位置 | Can you explain me this word? | — | ✗ | （parse_failed） |  |
| ev-25 | already 與時態 | I already eat breakfast. | — | ✗ | （parse_failed） |  |
| ev-26 | 不可數名詞加 s（homework） | We have a lot of homeworks to do. | — | ✗ | （parse_failed） |  |
| ev-27 | because 與 so 並用 | Because it rained, so the game was cancelled. | — | ✗ | （parse_failed） |  |
| ev-28 | despite 後接子句 | Despite she was tired, she finished the work. | — | ✗ | （parse_failed） |  |
| ev-29 | 現在完成式配過去時間 | He has gone to Japan last month. | — | ✗ | （parse_failed） |  |
| ev-30 | can 與 able to 並用 | I can't able to attend tomorrow's meeting. | — | ✗ | （parse_failed） |  |
| ev-31 | 冠詞 a／an | I have an pen. | — | ✗ | （parse_failed） |  |
| ev-32 | 過去式 | Yesterday I watch a movie with my friends. | — | ✗ | （parse_failed） |  |
| ev-33 | enjoy＋動名詞 | I enjoy to swim in the summer. | I enjoy swimming in the summer. | ✓ | enjoy 後面必須接動名詞（v-ing 形式），不能接 to 不定詞。所以這裡的 to swim 要改成 swimming。記住 enjoy doing something 這個固定用法。 enjoy 是一個後接動名詞的動詞，所以 swim 要改成 swimming，不能加 to。例如：I enjoy reading. 請記住 enjoy 後面要接 -ing 形式。 |  |
| ev-34 | whether 子句語序 | I am not sure whether should I call him. | — | ✗ | （parse_failed） |  |
| ev-35 | since 與現在完成式 | I study English since 2020. | — | ✗ | （parse_failed） |  |
| ev-36 | 不可數名詞加 s（information） | Can you give me some informations about the tour? | — | ✗ | （parse_failed） |  |
| ev-37 | 介系詞後接動名詞 | I am afraid of speak English in public. | — | ✗ | （parse_failed） |  |
| ev-38 | listen 少了 to | I like to listen music at night. | — | ✗ | （parse_failed） |  |
| ev-39 | used to＋原形 | I used to playing basketball after school. | — | ✗ | （parse_failed） |  |
| ev-40 | unless 多加否定 | Unless you don't hurry, you will miss the bus. | — | ✗ | （parse_failed） |  |
