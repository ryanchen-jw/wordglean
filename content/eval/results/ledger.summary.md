<!-- 由 content/scripts/llm-eval.mjs 產生；prompt grade-writing.v2；題組 llm-eval-set.v1；帳本 content\eval\results\ledger.jsonl -->

| 模型 | 完成／總數 | 正確率（判錯且修對） | 有判出錯誤 | 解析成功 | 呼叫失敗 | 延遲中位數 | 花費（US$） |
|---|---|---|---|---|---|---|---|
| `google/gemma-4-31b-it:free` | 0／40 | 0（0%） | 0 | 0 | 0 | — | 0.0000 |
| `qwen/qwen3.8-27b:free` | 0／40 | 0（0%） | 0 | 0 | 0 | — | 0.0000 |
| `google/gemma-4-26b-a4b-it:free` | 0／40 | 0（0%） | 0 | 0 | 0 | — | 0.0000 |
| `apodex/apodex-1.1-mini:free` | 0／40 | 0（0%） | 0 | 0 | 0 | — | 0.0000 |

### google/gemma-4-31b-it:free

| 題 | 錯誤類型 | 學習者句子 | 批改句 | 修對 | 繁中解釋 | 解釋分（0–2） |
|---|---|---|---|---|---|---|
| ev-01 | 冠詞 a／an | I have a apple. | — | ✗ | （未跑） |  |
| ev-02 | 主詞動詞一致（第三人稱單數） | She drink coffee every morning. | — | ✗ | （未跑） |  |
| ev-03 | 中文「有」直譯（There has） | There has a book on the table. | — | ✗ | （未跑） |  |
| ev-04 | 副詞位置（very 修飾動詞） | I very like music. | — | ✗ | （未跑） |  |
| ev-05 | 過去式 | Yesterday I go to the library. | — | ✗ | （未跑） |  |
| ev-06 | 間接問句語序 | He doesn't know where does she live. | — | ✗ | （未跑） |  |
| ev-07 | Although 與 but 並用 | Although it was raining, but we still went to the park. | — | ✗ | （未跑） |  |
| ev-08 | 時間介系詞（星期用 on） | We have a test in Monday. | — | ✗ | （未跑） |  |
| ev-09 | 不可數名詞加 s | The teacher gave us many advices. | — | ✗ | （未跑） |  |
| ev-10 | look forward to＋動名詞 | I am looking forward to meet you. | — | ✗ | （未跑） |  |
| ev-11 | 及物動詞多加介系詞（discuss about） | We will discuss about this problem tomorrow. | — | ✗ | （未跑） |  |
| ev-12 | -ing／-ed 形容詞（boring／bored） | I was very boring during the movie. | — | ✗ | （未跑） |  |
| ev-13 | 現在完成式（持續到現在） | I live in Taipei for five years. | — | ✗ | （未跑） |  |
| ev-14 | 比較級重複（more better） | Her English is more better than mine. | — | ✗ | （未跑） |  |
| ev-15 | 助動詞後接原形 | I didn't went to work yesterday. | — | ✗ | （未跑） |  |
| ev-16 | suggest 的句型 | He suggested me to sleep earlier. | — | ✗ | （未跑） |  |
| ev-17 | 中式搭配（開燈） | Please open the light. | — | ✗ | （未跑） |  |
| ev-18 | 不及物動詞誤用被動（happen） | When was it happened? | — | ✗ | （未跑） |  |
| ev-19 | be 動詞＋一般動詞（am agree） | I am agree with you. | — | ✗ | （未跑） |  |
| ev-20 | spend 的句型 | I spent a lot of money to buy this phone. | — | ✗ | （未跑） |  |
| ev-21 | marry 多加介系詞 | She married with a doctor. | — | ✗ | （未跑） |  |
| ev-22 | people 是複數 | The people here is very friendly. | — | ✗ | （未跑） |  |
| ev-23 | 使役動詞後接原形 | He made me to wait for an hour. | — | ✗ | （未跑） |  |
| ev-24 | explain 的受詞位置 | Can you explain me this word? | — | ✗ | （未跑） |  |
| ev-25 | already 與時態 | I already eat breakfast. | — | ✗ | （未跑） |  |
| ev-26 | 不可數名詞加 s（homework） | We have a lot of homeworks to do. | — | ✗ | （未跑） |  |
| ev-27 | because 與 so 並用 | Because it rained, so the game was cancelled. | — | ✗ | （未跑） |  |
| ev-28 | despite 後接子句 | Despite she was tired, she finished the work. | — | ✗ | （未跑） |  |
| ev-29 | 現在完成式配過去時間 | He has gone to Japan last month. | — | ✗ | （未跑） |  |
| ev-30 | can 與 able to 並用 | I can't able to attend tomorrow's meeting. | — | ✗ | （未跑） |  |
| ev-31 | 冠詞 a／an | I have an pen. | — | ✗ | （未跑） |  |
| ev-32 | 過去式 | Yesterday I watch a movie with my friends. | — | ✗ | （未跑） |  |
| ev-33 | enjoy＋動名詞 | I enjoy to swim in the summer. | — | ✗ | （未跑） |  |
| ev-34 | whether 子句語序 | I am not sure whether should I call him. | — | ✗ | （未跑） |  |
| ev-35 | since 與現在完成式 | I study English since 2020. | — | ✗ | （未跑） |  |
| ev-36 | 不可數名詞加 s（information） | Can you give me some informations about the tour? | — | ✗ | （未跑） |  |
| ev-37 | 介系詞後接動名詞 | I am afraid of speak English in public. | — | ✗ | （未跑） |  |
| ev-38 | listen 少了 to | I like to listen music at night. | — | ✗ | （未跑） |  |
| ev-39 | used to＋原形 | I used to playing basketball after school. | — | ✗ | （未跑） |  |
| ev-40 | unless 多加否定 | Unless you don't hurry, you will miss the bus. | — | ✗ | （未跑） |  |

### qwen/qwen3.8-27b:free

| 題 | 錯誤類型 | 學習者句子 | 批改句 | 修對 | 繁中解釋 | 解釋分（0–2） |
|---|---|---|---|---|---|---|
| ev-01 | 冠詞 a／an | I have a apple. | — | ✗ | （未跑） |  |
| ev-02 | 主詞動詞一致（第三人稱單數） | She drink coffee every morning. | — | ✗ | （未跑） |  |
| ev-03 | 中文「有」直譯（There has） | There has a book on the table. | — | ✗ | （未跑） |  |
| ev-04 | 副詞位置（very 修飾動詞） | I very like music. | — | ✗ | （未跑） |  |
| ev-05 | 過去式 | Yesterday I go to the library. | — | ✗ | （未跑） |  |
| ev-06 | 間接問句語序 | He doesn't know where does she live. | — | ✗ | （未跑） |  |
| ev-07 | Although 與 but 並用 | Although it was raining, but we still went to the park. | — | ✗ | （未跑） |  |
| ev-08 | 時間介系詞（星期用 on） | We have a test in Monday. | — | ✗ | （未跑） |  |
| ev-09 | 不可數名詞加 s | The teacher gave us many advices. | — | ✗ | （未跑） |  |
| ev-10 | look forward to＋動名詞 | I am looking forward to meet you. | — | ✗ | （未跑） |  |
| ev-11 | 及物動詞多加介系詞（discuss about） | We will discuss about this problem tomorrow. | — | ✗ | （未跑） |  |
| ev-12 | -ing／-ed 形容詞（boring／bored） | I was very boring during the movie. | — | ✗ | （未跑） |  |
| ev-13 | 現在完成式（持續到現在） | I live in Taipei for five years. | — | ✗ | （未跑） |  |
| ev-14 | 比較級重複（more better） | Her English is more better than mine. | — | ✗ | （未跑） |  |
| ev-15 | 助動詞後接原形 | I didn't went to work yesterday. | — | ✗ | （未跑） |  |
| ev-16 | suggest 的句型 | He suggested me to sleep earlier. | — | ✗ | （未跑） |  |
| ev-17 | 中式搭配（開燈） | Please open the light. | — | ✗ | （未跑） |  |
| ev-18 | 不及物動詞誤用被動（happen） | When was it happened? | — | ✗ | （未跑） |  |
| ev-19 | be 動詞＋一般動詞（am agree） | I am agree with you. | — | ✗ | （未跑） |  |
| ev-20 | spend 的句型 | I spent a lot of money to buy this phone. | — | ✗ | （未跑） |  |
| ev-21 | marry 多加介系詞 | She married with a doctor. | — | ✗ | （未跑） |  |
| ev-22 | people 是複數 | The people here is very friendly. | — | ✗ | （未跑） |  |
| ev-23 | 使役動詞後接原形 | He made me to wait for an hour. | — | ✗ | （未跑） |  |
| ev-24 | explain 的受詞位置 | Can you explain me this word? | — | ✗ | （未跑） |  |
| ev-25 | already 與時態 | I already eat breakfast. | — | ✗ | （未跑） |  |
| ev-26 | 不可數名詞加 s（homework） | We have a lot of homeworks to do. | — | ✗ | （未跑） |  |
| ev-27 | because 與 so 並用 | Because it rained, so the game was cancelled. | — | ✗ | （未跑） |  |
| ev-28 | despite 後接子句 | Despite she was tired, she finished the work. | — | ✗ | （未跑） |  |
| ev-29 | 現在完成式配過去時間 | He has gone to Japan last month. | — | ✗ | （未跑） |  |
| ev-30 | can 與 able to 並用 | I can't able to attend tomorrow's meeting. | — | ✗ | （未跑） |  |
| ev-31 | 冠詞 a／an | I have an pen. | — | ✗ | （未跑） |  |
| ev-32 | 過去式 | Yesterday I watch a movie with my friends. | — | ✗ | （未跑） |  |
| ev-33 | enjoy＋動名詞 | I enjoy to swim in the summer. | — | ✗ | （未跑） |  |
| ev-34 | whether 子句語序 | I am not sure whether should I call him. | — | ✗ | （未跑） |  |
| ev-35 | since 與現在完成式 | I study English since 2020. | — | ✗ | （未跑） |  |
| ev-36 | 不可數名詞加 s（information） | Can you give me some informations about the tour? | — | ✗ | （未跑） |  |
| ev-37 | 介系詞後接動名詞 | I am afraid of speak English in public. | — | ✗ | （未跑） |  |
| ev-38 | listen 少了 to | I like to listen music at night. | — | ✗ | （未跑） |  |
| ev-39 | used to＋原形 | I used to playing basketball after school. | — | ✗ | （未跑） |  |
| ev-40 | unless 多加否定 | Unless you don't hurry, you will miss the bus. | — | ✗ | （未跑） |  |

### google/gemma-4-26b-a4b-it:free

| 題 | 錯誤類型 | 學習者句子 | 批改句 | 修對 | 繁中解釋 | 解釋分（0–2） |
|---|---|---|---|---|---|---|
| ev-01 | 冠詞 a／an | I have a apple. | — | ✗ | （未跑） |  |
| ev-02 | 主詞動詞一致（第三人稱單數） | She drink coffee every morning. | — | ✗ | （未跑） |  |
| ev-03 | 中文「有」直譯（There has） | There has a book on the table. | — | ✗ | （未跑） |  |
| ev-04 | 副詞位置（very 修飾動詞） | I very like music. | — | ✗ | （未跑） |  |
| ev-05 | 過去式 | Yesterday I go to the library. | — | ✗ | （未跑） |  |
| ev-06 | 間接問句語序 | He doesn't know where does she live. | — | ✗ | （未跑） |  |
| ev-07 | Although 與 but 並用 | Although it was raining, but we still went to the park. | — | ✗ | （未跑） |  |
| ev-08 | 時間介系詞（星期用 on） | We have a test in Monday. | — | ✗ | （未跑） |  |
| ev-09 | 不可數名詞加 s | The teacher gave us many advices. | — | ✗ | （未跑） |  |
| ev-10 | look forward to＋動名詞 | I am looking forward to meet you. | — | ✗ | （未跑） |  |
| ev-11 | 及物動詞多加介系詞（discuss about） | We will discuss about this problem tomorrow. | — | ✗ | （未跑） |  |
| ev-12 | -ing／-ed 形容詞（boring／bored） | I was very boring during the movie. | — | ✗ | （未跑） |  |
| ev-13 | 現在完成式（持續到現在） | I live in Taipei for five years. | — | ✗ | （未跑） |  |
| ev-14 | 比較級重複（more better） | Her English is more better than mine. | — | ✗ | （未跑） |  |
| ev-15 | 助動詞後接原形 | I didn't went to work yesterday. | — | ✗ | （未跑） |  |
| ev-16 | suggest 的句型 | He suggested me to sleep earlier. | — | ✗ | （未跑） |  |
| ev-17 | 中式搭配（開燈） | Please open the light. | — | ✗ | （未跑） |  |
| ev-18 | 不及物動詞誤用被動（happen） | When was it happened? | — | ✗ | （未跑） |  |
| ev-19 | be 動詞＋一般動詞（am agree） | I am agree with you. | — | ✗ | （未跑） |  |
| ev-20 | spend 的句型 | I spent a lot of money to buy this phone. | — | ✗ | （未跑） |  |
| ev-21 | marry 多加介系詞 | She married with a doctor. | — | ✗ | （未跑） |  |
| ev-22 | people 是複數 | The people here is very friendly. | — | ✗ | （未跑） |  |
| ev-23 | 使役動詞後接原形 | He made me to wait for an hour. | — | ✗ | （未跑） |  |
| ev-24 | explain 的受詞位置 | Can you explain me this word? | — | ✗ | （未跑） |  |
| ev-25 | already 與時態 | I already eat breakfast. | — | ✗ | （未跑） |  |
| ev-26 | 不可數名詞加 s（homework） | We have a lot of homeworks to do. | — | ✗ | （未跑） |  |
| ev-27 | because 與 so 並用 | Because it rained, so the game was cancelled. | — | ✗ | （未跑） |  |
| ev-28 | despite 後接子句 | Despite she was tired, she finished the work. | — | ✗ | （未跑） |  |
| ev-29 | 現在完成式配過去時間 | He has gone to Japan last month. | — | ✗ | （未跑） |  |
| ev-30 | can 與 able to 並用 | I can't able to attend tomorrow's meeting. | — | ✗ | （未跑） |  |
| ev-31 | 冠詞 a／an | I have an pen. | — | ✗ | （未跑） |  |
| ev-32 | 過去式 | Yesterday I watch a movie with my friends. | — | ✗ | （未跑） |  |
| ev-33 | enjoy＋動名詞 | I enjoy to swim in the summer. | — | ✗ | （未跑） |  |
| ev-34 | whether 子句語序 | I am not sure whether should I call him. | — | ✗ | （未跑） |  |
| ev-35 | since 與現在完成式 | I study English since 2020. | — | ✗ | （未跑） |  |
| ev-36 | 不可數名詞加 s（information） | Can you give me some informations about the tour? | — | ✗ | （未跑） |  |
| ev-37 | 介系詞後接動名詞 | I am afraid of speak English in public. | — | ✗ | （未跑） |  |
| ev-38 | listen 少了 to | I like to listen music at night. | — | ✗ | （未跑） |  |
| ev-39 | used to＋原形 | I used to playing basketball after school. | — | ✗ | （未跑） |  |
| ev-40 | unless 多加否定 | Unless you don't hurry, you will miss the bus. | — | ✗ | （未跑） |  |

### apodex/apodex-1.1-mini:free

| 題 | 錯誤類型 | 學習者句子 | 批改句 | 修對 | 繁中解釋 | 解釋分（0–2） |
|---|---|---|---|---|---|---|
| ev-01 | 冠詞 a／an | I have a apple. | — | ✗ | （未跑） |  |
| ev-02 | 主詞動詞一致（第三人稱單數） | She drink coffee every morning. | — | ✗ | （未跑） |  |
| ev-03 | 中文「有」直譯（There has） | There has a book on the table. | — | ✗ | （未跑） |  |
| ev-04 | 副詞位置（very 修飾動詞） | I very like music. | — | ✗ | （未跑） |  |
| ev-05 | 過去式 | Yesterday I go to the library. | — | ✗ | （未跑） |  |
| ev-06 | 間接問句語序 | He doesn't know where does she live. | — | ✗ | （未跑） |  |
| ev-07 | Although 與 but 並用 | Although it was raining, but we still went to the park. | — | ✗ | （未跑） |  |
| ev-08 | 時間介系詞（星期用 on） | We have a test in Monday. | — | ✗ | （未跑） |  |
| ev-09 | 不可數名詞加 s | The teacher gave us many advices. | — | ✗ | （未跑） |  |
| ev-10 | look forward to＋動名詞 | I am looking forward to meet you. | — | ✗ | （未跑） |  |
| ev-11 | 及物動詞多加介系詞（discuss about） | We will discuss about this problem tomorrow. | — | ✗ | （未跑） |  |
| ev-12 | -ing／-ed 形容詞（boring／bored） | I was very boring during the movie. | — | ✗ | （未跑） |  |
| ev-13 | 現在完成式（持續到現在） | I live in Taipei for five years. | — | ✗ | （未跑） |  |
| ev-14 | 比較級重複（more better） | Her English is more better than mine. | — | ✗ | （未跑） |  |
| ev-15 | 助動詞後接原形 | I didn't went to work yesterday. | — | ✗ | （未跑） |  |
| ev-16 | suggest 的句型 | He suggested me to sleep earlier. | — | ✗ | （未跑） |  |
| ev-17 | 中式搭配（開燈） | Please open the light. | — | ✗ | （未跑） |  |
| ev-18 | 不及物動詞誤用被動（happen） | When was it happened? | — | ✗ | （未跑） |  |
| ev-19 | be 動詞＋一般動詞（am agree） | I am agree with you. | — | ✗ | （未跑） |  |
| ev-20 | spend 的句型 | I spent a lot of money to buy this phone. | — | ✗ | （未跑） |  |
| ev-21 | marry 多加介系詞 | She married with a doctor. | — | ✗ | （未跑） |  |
| ev-22 | people 是複數 | The people here is very friendly. | — | ✗ | （未跑） |  |
| ev-23 | 使役動詞後接原形 | He made me to wait for an hour. | — | ✗ | （未跑） |  |
| ev-24 | explain 的受詞位置 | Can you explain me this word? | — | ✗ | （未跑） |  |
| ev-25 | already 與時態 | I already eat breakfast. | — | ✗ | （未跑） |  |
| ev-26 | 不可數名詞加 s（homework） | We have a lot of homeworks to do. | — | ✗ | （未跑） |  |
| ev-27 | because 與 so 並用 | Because it rained, so the game was cancelled. | — | ✗ | （未跑） |  |
| ev-28 | despite 後接子句 | Despite she was tired, she finished the work. | — | ✗ | （未跑） |  |
| ev-29 | 現在完成式配過去時間 | He has gone to Japan last month. | — | ✗ | （未跑） |  |
| ev-30 | can 與 able to 並用 | I can't able to attend tomorrow's meeting. | — | ✗ | （未跑） |  |
| ev-31 | 冠詞 a／an | I have an pen. | — | ✗ | （未跑） |  |
| ev-32 | 過去式 | Yesterday I watch a movie with my friends. | — | ✗ | （未跑） |  |
| ev-33 | enjoy＋動名詞 | I enjoy to swim in the summer. | — | ✗ | （未跑） |  |
| ev-34 | whether 子句語序 | I am not sure whether should I call him. | — | ✗ | （未跑） |  |
| ev-35 | since 與現在完成式 | I study English since 2020. | — | ✗ | （未跑） |  |
| ev-36 | 不可數名詞加 s（information） | Can you give me some informations about the tour? | — | ✗ | （未跑） |  |
| ev-37 | 介系詞後接動名詞 | I am afraid of speak English in public. | — | ✗ | （未跑） |  |
| ev-38 | listen 少了 to | I like to listen music at night. | — | ✗ | （未跑） |  |
| ev-39 | used to＋原形 | I used to playing basketball after school. | — | ✗ | （未跑） |  |
| ev-40 | unless 多加否定 | Unless you don't hurry, you will miss the bus. | — | ✗ | （未跑） |  |
