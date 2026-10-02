<!-- 由 content/scripts/llm-eval.mjs 產生；prompt grade-writing.v1；題組 llm-eval-set.v1；帳本 C:\Projects\LinguaApp\.claude\worktrees\task-15-openrouter\docs\pending\2026-10-02-task15-openrouter\dry-run\ledger.jsonl -->

| 模型 | 完成／總數 | 正確率（判錯且修對） | 有判出錯誤 | 解析成功 | 呼叫失敗 | 延遲中位數 | 花費（US$） |
|---|---|---|---|---|---|---|---|
| `google/gemma-4-31b-it:free` | 40／40 | 35（87.5%） | 35 | 35 | 0 | 0.0 秒 | 0.0000 |
| `qwen/qwen3.8-27b:free` | 40／40 | 35（87.5%） | 35 | 35 | 0 | 0.0 秒 | 0.0000 |
| `google/gemma-4-26b-a4b-it:free` | 40／40 | 35（87.5%） | 35 | 35 | 0 | 0.0 秒 | 0.0000 |
| `apodex/apodex-1.1-mini:free` | 40／40 | 35（87.5%） | 35 | 35 | 0 | 0.0 秒 | 0.0000 |

### google/gemma-4-31b-it:free

| 題 | 錯誤類型 | 學習者句子 | 批改句 | 修對 | 繁中解釋 | 解釋分（0–2） |
|---|---|---|---|---|---|---|
| ev-01 | 冠詞 a／an | I have a apple. | I have an apple. | ✓ | 母音開頭的字前面用 an |  |
| ev-02 | 主詞動詞一致（第三人稱單數） | She drink coffee every morning. | She drinks coffee every morning. | ✓ | 第三人稱單數現在式動詞加 s |  |
| ev-03 | 中文「有」直譯（There has） | There has a book on the table. | There is a book on the table. | ✓ | 表示「某處有某物」用 there is／there are，不用 there has |  |
| ev-04 | 副詞位置（very 修飾動詞） | I very like music. | I really like music. | ✓ | very 不能直接修飾動詞，用 really like 或 like … very much |  |
| ev-05 | 過去式 | Yesterday I go to the library. | Yesterday I went to the library. | ✓ | yesterday 表示過去，動詞用過去式 went |  |
| ev-06 | 間接問句語序 | He doesn't know where does she live. | — | ✗ | （parse_failed） |  |
| ev-07 | Although 與 but 並用 | Although it was raining, but we still went to the park. | Although it was raining, we still went to the park. | ✓ | although 和 but 不能在同一句一起用 |  |
| ev-08 | 時間介系詞（星期用 on） | We have a test in Monday. | We have a test on Monday. | ✓ | 星期幾前面用 on |  |
| ev-09 | 不可數名詞加 s | The teacher gave us many advices. | The teacher gave us a lot of advice. | ✓ | advice 不可數，不加 s；many 改 a lot of 或 much |  |
| ev-10 | look forward to＋動名詞 | I am looking forward to meet you. | I am looking forward to meeting you. | ✓ | look forward to 的 to 是介系詞，後面接動名詞 |  |
| ev-11 | 及物動詞多加介系詞（discuss about） | We will discuss about this problem tomorrow. | We will discuss this problem tomorrow. | ✓ | discuss 是及物動詞，後面直接接受詞，不加 about |  |
| ev-12 | -ing／-ed 形容詞（boring／bored） | I was very boring during the movie. | I felt very bored during the movie. | ✓ | 描述人的感受用 bored；boring 是形容事物讓人無聊 |  |
| ev-13 | 現在完成式（持續到現在） | I live in Taipei for five years. | I have lived in Taipei for five years. | ✓ | 從過去持續到現在的狀態用現在完成式（have lived） |  |
| ev-14 | 比較級重複（more better） | Her English is more better than mine. | Her English is much better than mine. | ✓ | better 已經是比較級，不再加 more；加強用 much |  |
| ev-15 | 助動詞後接原形 | I didn't went to work yesterday. | I didn't go to work yesterday. | ✓ | didn't 後面接原形動詞 |  |
| ev-16 | suggest 的句型 | He suggested me to sleep earlier. | — | ✗ | （parse_failed） |  |
| ev-17 | 中式搭配（開燈） | Please open the light. | Please turn on the light. | ✓ | 開燈用 turn on／switch on，不用 open |  |
| ev-18 | 不及物動詞誤用被動（happen） | When was it happened? | When did it happen? | ✓ | happen 是不及物動詞，沒有被動式 |  |
| ev-19 | be 動詞＋一般動詞（am agree） | I am agree with you. | I agree with you. | ✓ | agree 是動詞，前面不加 am |  |
| ev-20 | spend 的句型 | I spent a lot of money to buy this phone. | I spent a lot of money on this phone. | ✓ | spend 金錢 on 東西，或 spend 金錢＋動名詞 |  |
| ev-21 | marry 多加介系詞 | She married with a doctor. | She married a doctor. | ✓ | marry 直接接人，不加 with；或用 get married to |  |
| ev-22 | people 是複數 | The people here is very friendly. | The people here are very friendly. | ✓ | people 是複數名詞，動詞用 are |  |
| ev-23 | 使役動詞後接原形 | He made me to wait for an hour. | — | ✗ | （parse_failed） |  |
| ev-24 | explain 的受詞位置 | Can you explain me this word? | Can you explain this word to me? | ✓ | explain 東西 to 人，不說 explain 人 東西 |  |
| ev-25 | already 與時態 | I already eat breakfast. | I have already eaten breakfast. | ✓ | 已經完成的事用現在完成式（have already eaten） |  |
| ev-26 | 不可數名詞加 s（homework） | We have a lot of homeworks to do. | — | ✗ | （parse_failed） |  |
| ev-27 | because 與 so 並用 | Because it rained, so the game was cancelled. | Because it rained, the game was cancelled. | ✓ | because 和 so 不能在同一句一起用 |  |
| ev-28 | despite 後接子句 | Despite she was tired, she finished the work. | Despite being tired, she finished the work. | ✓ | despite 是介系詞，後面接名詞或動名詞，不接完整子句 |  |
| ev-29 | 現在完成式配過去時間 | He has gone to Japan last month. | He went to Japan last month. | ✓ | 有明確過去時間（last month）用過去式，不用現在完成式 |  |
| ev-30 | can 與 able to 並用 | I can't able to attend tomorrow's meeting. | I can't attend tomorrow's meeting. | ✓ | can 和 be able to 意思相同，不能疊在一起用 |  |
| ev-31 | 冠詞 a／an | I have an pen. | I have a pen. | ✓ | 子音開頭的字前面用 a，母音開頭用 an |  |
| ev-32 | 過去式 | Yesterday I watch a movie with my friends. | Yesterday I watched a movie with my friends. | ✓ | yesterday 表示過去，動詞用過去式 |  |
| ev-33 | enjoy＋動名詞 | I enjoy to swim in the summer. | — | ✗ | （parse_failed） |  |
| ev-34 | whether 子句語序 | I am not sure whether should I call him. | I am not sure whether I should call him. | ✓ | whether 子句用直述句語序（主詞在前） |  |
| ev-35 | since 與現在完成式 | I study English since 2020. | I have studied English since 2020. | ✓ | since 表示「自從…到現在」，主要子句用現在完成式 |  |
| ev-36 | 不可數名詞加 s（information） | Can you give me some informations about the tour? | Can you give me some information about the tour? | ✓ | information 不可數，不加 s |  |
| ev-37 | 介系詞後接動名詞 | I am afraid of speak English in public. | I am afraid of speaking English in public. | ✓ | 介系詞 of 後面接動名詞 |  |
| ev-38 | listen 少了 to | I like to listen music at night. | I like to listen to music at night. | ✓ | listen 後面要接 to 再接受詞 |  |
| ev-39 | used to＋原形 | I used to playing basketball after school. | I used to play basketball after school. | ✓ | 表示過去習慣的 used to 後面接原形動詞 |  |
| ev-40 | unless 多加否定 | Unless you don't hurry, you will miss the bus. | Unless you hurry, you will miss the bus. | ✓ | unless 已經是「除非／如果不」，子句裡不再加 don't |  |

### qwen/qwen3.8-27b:free

| 題 | 錯誤類型 | 學習者句子 | 批改句 | 修對 | 繁中解釋 | 解釋分（0–2） |
|---|---|---|---|---|---|---|
| ev-01 | 冠詞 a／an | I have a apple. | I have an apple. | ✓ | 母音開頭的字前面用 an |  |
| ev-02 | 主詞動詞一致（第三人稱單數） | She drink coffee every morning. | She drinks coffee every morning. | ✓ | 第三人稱單數現在式動詞加 s |  |
| ev-03 | 中文「有」直譯（There has） | There has a book on the table. | There is a book on the table. | ✓ | 表示「某處有某物」用 there is／there are，不用 there has |  |
| ev-04 | 副詞位置（very 修飾動詞） | I very like music. | — | ✗ | （parse_failed） |  |
| ev-05 | 過去式 | Yesterday I go to the library. | Yesterday I went to the library. | ✓ | yesterday 表示過去，動詞用過去式 went |  |
| ev-06 | 間接問句語序 | He doesn't know where does she live. | He doesn't know where she lives. | ✓ | 間接問句用直述句語序，不用 does 倒裝 |  |
| ev-07 | Although 與 but 並用 | Although it was raining, but we still went to the park. | Although it was raining, we still went to the park. | ✓ | although 和 but 不能在同一句一起用 |  |
| ev-08 | 時間介系詞（星期用 on） | We have a test in Monday. | We have a test on Monday. | ✓ | 星期幾前面用 on |  |
| ev-09 | 不可數名詞加 s | The teacher gave us many advices. | The teacher gave us a lot of advice. | ✓ | advice 不可數，不加 s；many 改 a lot of 或 much |  |
| ev-10 | look forward to＋動名詞 | I am looking forward to meet you. | I am looking forward to meeting you. | ✓ | look forward to 的 to 是介系詞，後面接動名詞 |  |
| ev-11 | 及物動詞多加介系詞（discuss about） | We will discuss about this problem tomorrow. | — | ✗ | （parse_failed） |  |
| ev-12 | -ing／-ed 形容詞（boring／bored） | I was very boring during the movie. | I felt very bored during the movie. | ✓ | 描述人的感受用 bored；boring 是形容事物讓人無聊 |  |
| ev-13 | 現在完成式（持續到現在） | I live in Taipei for five years. | I have lived in Taipei for five years. | ✓ | 從過去持續到現在的狀態用現在完成式（have lived） |  |
| ev-14 | 比較級重複（more better） | Her English is more better than mine. | — | ✗ | （parse_failed） |  |
| ev-15 | 助動詞後接原形 | I didn't went to work yesterday. | I didn't go to work yesterday. | ✓ | didn't 後面接原形動詞 |  |
| ev-16 | suggest 的句型 | He suggested me to sleep earlier. | He suggested that I go to bed earlier. | ✓ | suggest 不接「人＋to 不定詞」，用 suggest (that) 子句 |  |
| ev-17 | 中式搭配（開燈） | Please open the light. | Please turn on the light. | ✓ | 開燈用 turn on／switch on，不用 open |  |
| ev-18 | 不及物動詞誤用被動（happen） | When was it happened? | When did it happen? | ✓ | happen 是不及物動詞，沒有被動式 |  |
| ev-19 | be 動詞＋一般動詞（am agree） | I am agree with you. | I agree with you. | ✓ | agree 是動詞，前面不加 am |  |
| ev-20 | spend 的句型 | I spent a lot of money to buy this phone. | I spent a lot of money on this phone. | ✓ | spend 金錢 on 東西，或 spend 金錢＋動名詞 |  |
| ev-21 | marry 多加介系詞 | She married with a doctor. | — | ✗ | （parse_failed） |  |
| ev-22 | people 是複數 | The people here is very friendly. | The people here are very friendly. | ✓ | people 是複數名詞，動詞用 are |  |
| ev-23 | 使役動詞後接原形 | He made me to wait for an hour. | He made me wait for an hour. | ✓ | make 人 做某事：make＋受詞＋原形動詞，不加 to |  |
| ev-24 | explain 的受詞位置 | Can you explain me this word? | Can you explain this word to me? | ✓ | explain 東西 to 人，不說 explain 人 東西 |  |
| ev-25 | already 與時態 | I already eat breakfast. | I have already eaten breakfast. | ✓ | 已經完成的事用現在完成式（have already eaten） |  |
| ev-26 | 不可數名詞加 s（homework） | We have a lot of homeworks to do. | We have a lot of homework to do. | ✓ | homework 不可數，不加 s |  |
| ev-27 | because 與 so 並用 | Because it rained, so the game was cancelled. | Because it rained, the game was cancelled. | ✓ | because 和 so 不能在同一句一起用 |  |
| ev-28 | despite 後接子句 | Despite she was tired, she finished the work. | Despite being tired, she finished the work. | ✓ | despite 是介系詞，後面接名詞或動名詞，不接完整子句 |  |
| ev-29 | 現在完成式配過去時間 | He has gone to Japan last month. | He went to Japan last month. | ✓ | 有明確過去時間（last month）用過去式，不用現在完成式 |  |
| ev-30 | can 與 able to 並用 | I can't able to attend tomorrow's meeting. | I can't attend tomorrow's meeting. | ✓ | can 和 be able to 意思相同，不能疊在一起用 |  |
| ev-31 | 冠詞 a／an | I have an pen. | — | ✗ | （parse_failed） |  |
| ev-32 | 過去式 | Yesterday I watch a movie with my friends. | Yesterday I watched a movie with my friends. | ✓ | yesterday 表示過去，動詞用過去式 |  |
| ev-33 | enjoy＋動名詞 | I enjoy to swim in the summer. | I enjoy swimming in the summer. | ✓ | enjoy 後面接動名詞，不接 to 不定詞 |  |
| ev-34 | whether 子句語序 | I am not sure whether should I call him. | I am not sure whether I should call him. | ✓ | whether 子句用直述句語序（主詞在前） |  |
| ev-35 | since 與現在完成式 | I study English since 2020. | I have studied English since 2020. | ✓ | since 表示「自從…到現在」，主要子句用現在完成式 |  |
| ev-36 | 不可數名詞加 s（information） | Can you give me some informations about the tour? | Can you give me some information about the tour? | ✓ | information 不可數，不加 s |  |
| ev-37 | 介系詞後接動名詞 | I am afraid of speak English in public. | I am afraid of speaking English in public. | ✓ | 介系詞 of 後面接動名詞 |  |
| ev-38 | listen 少了 to | I like to listen music at night. | I like to listen to music at night. | ✓ | listen 後面要接 to 再接受詞 |  |
| ev-39 | used to＋原形 | I used to playing basketball after school. | I used to play basketball after school. | ✓ | 表示過去習慣的 used to 後面接原形動詞 |  |
| ev-40 | unless 多加否定 | Unless you don't hurry, you will miss the bus. | Unless you hurry, you will miss the bus. | ✓ | unless 已經是「除非／如果不」，子句裡不再加 don't |  |

### google/gemma-4-26b-a4b-it:free

| 題 | 錯誤類型 | 學習者句子 | 批改句 | 修對 | 繁中解釋 | 解釋分（0–2） |
|---|---|---|---|---|---|---|
| ev-01 | 冠詞 a／an | I have a apple. | I have an apple. | ✓ | 母音開頭的字前面用 an |  |
| ev-02 | 主詞動詞一致（第三人稱單數） | She drink coffee every morning. | — | ✗ | （parse_failed） |  |
| ev-03 | 中文「有」直譯（There has） | There has a book on the table. | There is a book on the table. | ✓ | 表示「某處有某物」用 there is／there are，不用 there has |  |
| ev-04 | 副詞位置（very 修飾動詞） | I very like music. | I really like music. | ✓ | very 不能直接修飾動詞，用 really like 或 like … very much |  |
| ev-05 | 過去式 | Yesterday I go to the library. | Yesterday I went to the library. | ✓ | yesterday 表示過去，動詞用過去式 went |  |
| ev-06 | 間接問句語序 | He doesn't know where does she live. | He doesn't know where she lives. | ✓ | 間接問句用直述句語序，不用 does 倒裝 |  |
| ev-07 | Although 與 but 並用 | Although it was raining, but we still went to the park. | Although it was raining, we still went to the park. | ✓ | although 和 but 不能在同一句一起用 |  |
| ev-08 | 時間介系詞（星期用 on） | We have a test in Monday. | We have a test on Monday. | ✓ | 星期幾前面用 on |  |
| ev-09 | 不可數名詞加 s | The teacher gave us many advices. | — | ✗ | （parse_failed） |  |
| ev-10 | look forward to＋動名詞 | I am looking forward to meet you. | I am looking forward to meeting you. | ✓ | look forward to 的 to 是介系詞，後面接動名詞 |  |
| ev-11 | 及物動詞多加介系詞（discuss about） | We will discuss about this problem tomorrow. | We will discuss this problem tomorrow. | ✓ | discuss 是及物動詞，後面直接接受詞，不加 about |  |
| ev-12 | -ing／-ed 形容詞（boring／bored） | I was very boring during the movie. | I felt very bored during the movie. | ✓ | 描述人的感受用 bored；boring 是形容事物讓人無聊 |  |
| ev-13 | 現在完成式（持續到現在） | I live in Taipei for five years. | I have lived in Taipei for five years. | ✓ | 從過去持續到現在的狀態用現在完成式（have lived） |  |
| ev-14 | 比較級重複（more better） | Her English is more better than mine. | Her English is much better than mine. | ✓ | better 已經是比較級，不再加 more；加強用 much |  |
| ev-15 | 助動詞後接原形 | I didn't went to work yesterday. | I didn't go to work yesterday. | ✓ | didn't 後面接原形動詞 |  |
| ev-16 | suggest 的句型 | He suggested me to sleep earlier. | He suggested that I go to bed earlier. | ✓ | suggest 不接「人＋to 不定詞」，用 suggest (that) 子句 |  |
| ev-17 | 中式搭配（開燈） | Please open the light. | Please turn on the light. | ✓ | 開燈用 turn on／switch on，不用 open |  |
| ev-18 | 不及物動詞誤用被動（happen） | When was it happened? | When did it happen? | ✓ | happen 是不及物動詞，沒有被動式 |  |
| ev-19 | be 動詞＋一般動詞（am agree） | I am agree with you. | — | ✗ | （parse_failed） |  |
| ev-20 | spend 的句型 | I spent a lot of money to buy this phone. | I spent a lot of money on this phone. | ✓ | spend 金錢 on 東西，或 spend 金錢＋動名詞 |  |
| ev-21 | marry 多加介系詞 | She married with a doctor. | She married a doctor. | ✓ | marry 直接接人，不加 with；或用 get married to |  |
| ev-22 | people 是複數 | The people here is very friendly. | The people here are very friendly. | ✓ | people 是複數名詞，動詞用 are |  |
| ev-23 | 使役動詞後接原形 | He made me to wait for an hour. | He made me wait for an hour. | ✓ | make 人 做某事：make＋受詞＋原形動詞，不加 to |  |
| ev-24 | explain 的受詞位置 | Can you explain me this word? | Can you explain this word to me? | ✓ | explain 東西 to 人，不說 explain 人 東西 |  |
| ev-25 | already 與時態 | I already eat breakfast. | I have already eaten breakfast. | ✓ | 已經完成的事用現在完成式（have already eaten） |  |
| ev-26 | 不可數名詞加 s（homework） | We have a lot of homeworks to do. | We have a lot of homework to do. | ✓ | homework 不可數，不加 s |  |
| ev-27 | because 與 so 並用 | Because it rained, so the game was cancelled. | Because it rained, the game was cancelled. | ✓ | because 和 so 不能在同一句一起用 |  |
| ev-28 | despite 後接子句 | Despite she was tired, she finished the work. | Despite being tired, she finished the work. | ✓ | despite 是介系詞，後面接名詞或動名詞，不接完整子句 |  |
| ev-29 | 現在完成式配過去時間 | He has gone to Japan last month. | — | ✗ | （parse_failed） |  |
| ev-30 | can 與 able to 並用 | I can't able to attend tomorrow's meeting. | I can't attend tomorrow's meeting. | ✓ | can 和 be able to 意思相同，不能疊在一起用 |  |
| ev-31 | 冠詞 a／an | I have an pen. | I have a pen. | ✓ | 子音開頭的字前面用 a，母音開頭用 an |  |
| ev-32 | 過去式 | Yesterday I watch a movie with my friends. | Yesterday I watched a movie with my friends. | ✓ | yesterday 表示過去，動詞用過去式 |  |
| ev-33 | enjoy＋動名詞 | I enjoy to swim in the summer. | I enjoy swimming in the summer. | ✓ | enjoy 後面接動名詞，不接 to 不定詞 |  |
| ev-34 | whether 子句語序 | I am not sure whether should I call him. | I am not sure whether I should call him. | ✓ | whether 子句用直述句語序（主詞在前） |  |
| ev-35 | since 與現在完成式 | I study English since 2020. | I have studied English since 2020. | ✓ | since 表示「自從…到現在」，主要子句用現在完成式 |  |
| ev-36 | 不可數名詞加 s（information） | Can you give me some informations about the tour? | Can you give me some information about the tour? | ✓ | information 不可數，不加 s |  |
| ev-37 | 介系詞後接動名詞 | I am afraid of speak English in public. | I am afraid of speaking English in public. | ✓ | 介系詞 of 後面接動名詞 |  |
| ev-38 | listen 少了 to | I like to listen music at night. | I like to listen to music at night. | ✓ | listen 後面要接 to 再接受詞 |  |
| ev-39 | used to＋原形 | I used to playing basketball after school. | — | ✗ | （parse_failed） |  |
| ev-40 | unless 多加否定 | Unless you don't hurry, you will miss the bus. | Unless you hurry, you will miss the bus. | ✓ | unless 已經是「除非／如果不」，子句裡不再加 don't |  |

### apodex/apodex-1.1-mini:free

| 題 | 錯誤類型 | 學習者句子 | 批改句 | 修對 | 繁中解釋 | 解釋分（0–2） |
|---|---|---|---|---|---|---|
| ev-01 | 冠詞 a／an | I have a apple. | I have an apple. | ✓ | 母音開頭的字前面用 an |  |
| ev-02 | 主詞動詞一致（第三人稱單數） | She drink coffee every morning. | She drinks coffee every morning. | ✓ | 第三人稱單數現在式動詞加 s |  |
| ev-03 | 中文「有」直譯（There has） | There has a book on the table. | There is a book on the table. | ✓ | 表示「某處有某物」用 there is／there are，不用 there has |  |
| ev-04 | 副詞位置（very 修飾動詞） | I very like music. | I really like music. | ✓ | very 不能直接修飾動詞，用 really like 或 like … very much |  |
| ev-05 | 過去式 | Yesterday I go to the library. | Yesterday I went to the library. | ✓ | yesterday 表示過去，動詞用過去式 went |  |
| ev-06 | 間接問句語序 | He doesn't know where does she live. | He doesn't know where she lives. | ✓ | 間接問句用直述句語序，不用 does 倒裝 |  |
| ev-07 | Although 與 but 並用 | Although it was raining, but we still went to the park. | — | ✗ | （parse_failed） |  |
| ev-08 | 時間介系詞（星期用 on） | We have a test in Monday. | We have a test on Monday. | ✓ | 星期幾前面用 on |  |
| ev-09 | 不可數名詞加 s | The teacher gave us many advices. | The teacher gave us a lot of advice. | ✓ | advice 不可數，不加 s；many 改 a lot of 或 much |  |
| ev-10 | look forward to＋動名詞 | I am looking forward to meet you. | I am looking forward to meeting you. | ✓ | look forward to 的 to 是介系詞，後面接動名詞 |  |
| ev-11 | 及物動詞多加介系詞（discuss about） | We will discuss about this problem tomorrow. | We will discuss this problem tomorrow. | ✓ | discuss 是及物動詞，後面直接接受詞，不加 about |  |
| ev-12 | -ing／-ed 形容詞（boring／bored） | I was very boring during the movie. | I felt very bored during the movie. | ✓ | 描述人的感受用 bored；boring 是形容事物讓人無聊 |  |
| ev-13 | 現在完成式（持續到現在） | I live in Taipei for five years. | I have lived in Taipei for five years. | ✓ | 從過去持續到現在的狀態用現在完成式（have lived） |  |
| ev-14 | 比較級重複（more better） | Her English is more better than mine. | Her English is much better than mine. | ✓ | better 已經是比較級，不再加 more；加強用 much |  |
| ev-15 | 助動詞後接原形 | I didn't went to work yesterday. | I didn't go to work yesterday. | ✓ | didn't 後面接原形動詞 |  |
| ev-16 | suggest 的句型 | He suggested me to sleep earlier. | He suggested that I go to bed earlier. | ✓ | suggest 不接「人＋to 不定詞」，用 suggest (that) 子句 |  |
| ev-17 | 中式搭配（開燈） | Please open the light. | — | ✗ | （parse_failed） |  |
| ev-18 | 不及物動詞誤用被動（happen） | When was it happened? | When did it happen? | ✓ | happen 是不及物動詞，沒有被動式 |  |
| ev-19 | be 動詞＋一般動詞（am agree） | I am agree with you. | I agree with you. | ✓ | agree 是動詞，前面不加 am |  |
| ev-20 | spend 的句型 | I spent a lot of money to buy this phone. | I spent a lot of money on this phone. | ✓ | spend 金錢 on 東西，或 spend 金錢＋動名詞 |  |
| ev-21 | marry 多加介系詞 | She married with a doctor. | She married a doctor. | ✓ | marry 直接接人，不加 with；或用 get married to |  |
| ev-22 | people 是複數 | The people here is very friendly. | The people here are very friendly. | ✓ | people 是複數名詞，動詞用 are |  |
| ev-23 | 使役動詞後接原形 | He made me to wait for an hour. | He made me wait for an hour. | ✓ | make 人 做某事：make＋受詞＋原形動詞，不加 to |  |
| ev-24 | explain 的受詞位置 | Can you explain me this word? | Can you explain this word to me? | ✓ | explain 東西 to 人，不說 explain 人 東西 |  |
| ev-25 | already 與時態 | I already eat breakfast. | I have already eaten breakfast. | ✓ | 已經完成的事用現在完成式（have already eaten） |  |
| ev-26 | 不可數名詞加 s（homework） | We have a lot of homeworks to do. | We have a lot of homework to do. | ✓ | homework 不可數，不加 s |  |
| ev-27 | because 與 so 並用 | Because it rained, so the game was cancelled. | — | ✗ | （parse_failed） |  |
| ev-28 | despite 後接子句 | Despite she was tired, she finished the work. | Despite being tired, she finished the work. | ✓ | despite 是介系詞，後面接名詞或動名詞，不接完整子句 |  |
| ev-29 | 現在完成式配過去時間 | He has gone to Japan last month. | He went to Japan last month. | ✓ | 有明確過去時間（last month）用過去式，不用現在完成式 |  |
| ev-30 | can 與 able to 並用 | I can't able to attend tomorrow's meeting. | I can't attend tomorrow's meeting. | ✓ | can 和 be able to 意思相同，不能疊在一起用 |  |
| ev-31 | 冠詞 a／an | I have an pen. | I have a pen. | ✓ | 子音開頭的字前面用 a，母音開頭用 an |  |
| ev-32 | 過去式 | Yesterday I watch a movie with my friends. | Yesterday I watched a movie with my friends. | ✓ | yesterday 表示過去，動詞用過去式 |  |
| ev-33 | enjoy＋動名詞 | I enjoy to swim in the summer. | I enjoy swimming in the summer. | ✓ | enjoy 後面接動名詞，不接 to 不定詞 |  |
| ev-34 | whether 子句語序 | I am not sure whether should I call him. | — | ✗ | （parse_failed） |  |
| ev-35 | since 與現在完成式 | I study English since 2020. | I have studied English since 2020. | ✓ | since 表示「自從…到現在」，主要子句用現在完成式 |  |
| ev-36 | 不可數名詞加 s（information） | Can you give me some informations about the tour? | Can you give me some information about the tour? | ✓ | information 不可數，不加 s |  |
| ev-37 | 介系詞後接動名詞 | I am afraid of speak English in public. | — | ✗ | （parse_failed） |  |
| ev-38 | listen 少了 to | I like to listen music at night. | I like to listen to music at night. | ✓ | listen 後面要接 to 再接受詞 |  |
| ev-39 | used to＋原形 | I used to playing basketball after school. | I used to play basketball after school. | ✓ | 表示過去習慣的 used to 後面接原形動詞 |  |
| ev-40 | unless 多加否定 | Unless you don't hurry, you will miss the bus. | Unless you hurry, you will miss the bus. | ✓ | unless 已經是「除非／如果不」，子句裡不再加 don't |  |
