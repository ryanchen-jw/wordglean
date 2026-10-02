# pilot 各課狀態（G5 新流程：開發端 Claude 撰寫）

> 依 2026-10-02 創辦人 G5 裁示，題庫由開發端 Claude 撰寫（author `claude-dev`），經檢查器與獨立審題員（`judgedBy: claude-reviewer`）三輪審題；之後執行長加開第③關「課綱符合度審查」（G5 由執行長代審，2026-10-02 創辦人授權）。檢查器欄＝`check-items --require-judge` 的阻擋錯誤數（含新規則 ANSWER_POSITION／ANSWER_POSITION_UNIT／ANSWER_POSITION_LEVEL）。本表由題目檔與 `review-rounds.json` 產生。

| 課 | 題數 | 檢查器 | 各輪問題數（R1／R2／R3） | 最終審後修正 | 第③關裁示修正（其中正解位置） |
|---|---|---|---|---|---|
| a1-u01-l01 | 17 | 0 | 1／0／0 | — | 3（3） |
| a1-u01-l02 | 17 | 0 | 0／—／— | — | 4（2） |
| a1-u01-l03 | 17 | 0 | 0／—／1 | 1 條（第③關複審通過） | 4（4） |
| a1-u01-l04 | 17 | 0 | 2／0／— | — | 4（4） |
| a1-u01-l05 | 17 | 0 | 0／—／0 | — | 4（3） |
| a1-u01-l06 | 17 | 0 | 0／—／— | — | 4（4） |
| a1-u01-l07 | 17 | 0 | 1／0／0 | — | 7（3） |
| a1-u01-l08 | 17 | 0 | 0／—／1 | 1 條（第③關複審通過） | 8（4） |
| a1-u01-l09 | 17 | 0 | 1／1／1 | 1 條（第③關複審通過） | 7（2） |
| a1-u01-l10 | 17 | 0 | 0／—／1 | 1 條（第③關複審通過） | 4（4） |
| b1-u01-l01 | 18 | 0 | 0／—／— | — | 8（4） |
| b1-u01-l02 | 18 | 0 | 1／1／0 | — | 5（3） |
| b1-u01-l03 | 17 | 0 | 0／—／1 | 1 條（第③關複審通過） | 3（2） |
| b1-u01-l04 | 17 | 0 | 2／1／0 | — | 6（4） |
| b1-u01-l05 | 17 | 0 | 1／2／0 | — | 6（3） |
| b1-u01-l06 | 17 | 0 | 4／2／1 | 1 條（第③關複審通過） | 8（4） |

## 最終審後修正（第③關複審通過）

第三輪（最後一輪）審題提出的 6 條，由撰寫端修正後移入各課 `judge.resolvedAfterFinalReview`；執行長第③關逐條判定通過，條目加註 `rechecked: {by: "執行長第③關", at: "2026-10-02"}`。

| 課 | 位置 | 審題員原文 | 修正 | 複審 |
|---|---|---|---|---|
| a1-u01-l03 | `items/16/rubricZh/2` | 要求 but 前後兩部分都有主詞和動詞，會排除同樣正確的省略寫法（如 I like apples, but not bananas.） | 要點改為「but 後面可以是完整句子，也可以是省略寫法（例如 but not bananas）」 | 執行長第③關 2026-10-02 通過 |
| a1-u01-l08 | `items/15/rubricZh/1` | 規定昨天的事用過去式 went，會排除同樣正確的「很晚睡」譯法（如 I stayed up late last night.） | 要點改為「昨天的事用過去式（例如 went to bed late、stayed up late）」，不寫死單一動詞 | 執行長第③關 2026-10-02 通過 |
| a1-u01-l09 | `items/15/rubricZh/1` | 規定 be 動詞用 are，會排除「非常好吃」最貼切的寫法 Those cakes taste very good.（參考答案也未收此寫法） | 要點改為「名詞用複數 cakes，動詞配合複數（例如 are；寫 taste very good 也正確）」，批改時收 taste 寫法；taste 為 B1，A1 課參考答案不收，維持 are very good／nice | 執行長第③關 2026-10-02 通過 |
| a1-u01-l10 | `items/16/rubricZh/1` | 限定 after 後面接名詞或動名詞，會排除同樣正確的 after＋子句寫法（如 I watch TV after I eat dinner.） | 要點改為「after 後面可接名詞、動名詞或子句（after school、after eating、after I eat dinner）」 | 執行長第③關 2026-10-02 通過 |
| b1-u01-l03 | `items/16/referenceEn/0` | 前句 I like this cafe. 只是表態、不是理由，整組只給出一個理由，不符題目「兩個理由」的要求；moreover 接在非理由句之後補充理由，用法不道地 | 參考答案改為 "This cafe is quiet. Moreover, the coffee is cheap."（兩句都是理由，moreover 補充第二個理由） | 執行長第③關 2026-10-02 通過 |
| b1-u01-l06 | `items/14/passageEn` | Of all her friends, she lives the farthest from the office, so she has to ride farther than they do.：文中未交代朋友也在同一公司上班或也騎車上班，「離公司最遠」與「騎得比他們遠」的比較對象不成立 | 短文交代「兩位同公司的朋友也騎車上班」，比較改為「三人當中她住得離公司最遠，所以騎得比另外兩人遠」，中譯同步；兩道閱讀題不變、仍成立 | 執行長第③關 2026-10-02 通過 |

## 執行長第③關裁示修正（正解位置以外）

每處記入 `judge.resolvedAfterFinalReview`，message 以「執行長第③關裁示修正：」開頭、resolution 記改後與原文；未再送審題員複審。

| 課 | 位置 | 問題 |
|---|---|---|
| a1-u01-l02 | `items/14/passageEn` | "He is Leo." 不自然 |
| a1-u01-l02 | `items/14/passageZh` | 中譯同步 |
| a1-u01-l05 | `items/9/questionZh` | 音檔主詞是 we，題目卻問「他們」，人稱不一致 |
| a1-u01-l07 | `items/15/rubricZh/1` | 評分要點封閉清單，send me 等也正確（準則 §1） |
| a1-u01-l07 | `items/9/audioEn` | 與 q15 的 Jack（5 歲的弟弟）人設矛盾，換名字 |
| a1-u01-l07 | `items/9/audioZh` | 中譯同步 |
| a1-u01-l07 | `items/9/options/0` | 選項同步 |
| a1-u01-l08 | `items/16/referenceEn/1` | 參考答案 2 不是在說「你」（準則 §2） |
| a1-u01-l08 | `items/13/options/0` | 干擾項 because 合文法（"…, because I eat."）（準則 §6） |
| a1-u01-l08 | `items/13/optionGlossZh/0` | 選項釋義同步 |
| a1-u01-l08 | `items/15/rubricZh/2` | 要點寫成定義，批改者可能當成唯一寫法 |
| a1-u01-l09 | `items/14/passageEn` | kind（形容詞「親切」）為 A2，詞義不同於 A1 的名詞「種類」 |
| a1-u01-l09 | `items/14/passageZh` | 中譯同步 |
| a1-u01-l09 | `items/14/questions/1/options/1` | 選項同步短文 |
| a1-u01-l09 | `items/13/options/1` | 干擾項 those 合文法（"Do you have those brothers…"）（準則 §6） |
| a1-u01-l09 | `items/13/optionGlossZh/1` | 選項釋義同步 |
| b1-u01-l01 | `items/16/rubricZh/1` | 評分要點寫死單一動詞 finished（準則 §1） |
| b1-u01-l01 | `items/17/referenceEn/1` | 參考答案 2 主詞是 she，不是「你」（準則 §2） |
| b1-u01-l01 | `items/2/exampleEn` | aboard 介系詞用法（aboard the plane）為 C1，改示範 B1 副詞用法 |
| b1-u01-l01 | `items/2/exampleZh` | 中譯同步 |
| b1-u01-l02 | `items/16/rubricZh/2` | 評分要點過嚴，be going to 也正確（準則 §1） |
| b1-u01-l02 | `items/7/exampleZh` | 釋義「向前；向外」未說明例句片語 back and forth（釋義欄限 20 字，加註放在例句中譯） |
| b1-u01-l03 | `items/14/passageEn` | "use the company again" 不道地 |
| b1-u01-l04 | `items/15/rubricZh/1` | 評分要點寫死單一動詞 finish（準則 §1） |
| b1-u01-l04 | `items/15/rubricZh/2` | 評分要點寫死單一片語 leave work early（準則 §1） |
| b1-u01-l05 | `items/14/passageEn` | My goodness 放在第三人稱敘述、表達擔心而非驚訝（準則 §4） |
| b1-u01-l05 | `items/14/passageZh` | 中譯同步 |
| b1-u01-l05 | `items/15/rubricZh/0` | 評分要點過嚴，whichever one you want 也正確（準則 §1） |
| b1-u01-l06 | `items/16/referenceEn/1` | 參考答案 2 講的是爸爸，不是「你」（準則 §2） |
| b1-u01-l06 | `items/6/exampleEn` | cough 名詞為 B2，且含看醫生的醫療建議 |
| b1-u01-l06 | `items/6/exampleZh` | 中譯同步 |
| b1-u01-l06 | `items/14/passageZh` | 中譯「她們」加了原文沒有的性別 |

## 正解位置分布（G1 重排後）

每級每題型以「該級目前最少用的位置」分配、同課同題型不重複；正解與目標位置的選項互換（optionGlossZh 同步），審題員判題索引依同一互換重對應。A1 的聽選與閱讀題只有 3 個選項，所以位置 3 是 0。

| 範圍 | 題型 | 位置 0 | 位置 1 | 位置 2 | 位置 3 | 題數 |
|---|---|---|---|---|---|---|
| A1 | listenChoice | 3 | 4 | 3 | 0 | 10 |
| A1 | mcq | 5 | 5 | 5 | 5 | 20 |
| A1 | reading | 7 | 6 | 7 | 0 | 20 |
| a1-u01-l01 | listenChoice | 1 | 0 | 0 | 0 | 1 |
| a1-u01-l01 | mcq | 0 | 1 | 1 | 0 | 2 |
| a1-u01-l01 | reading | 0 | 1 | 1 | 0 | 2 |
| a1-u01-l02 | listenChoice | 0 | 1 | 0 | 0 | 1 |
| a1-u01-l02 | mcq | 1 | 0 | 0 | 1 | 2 |
| a1-u01-l02 | reading | 1 | 1 | 0 | 0 | 2 |
| a1-u01-l03 | listenChoice | 0 | 0 | 1 | 0 | 1 |
| a1-u01-l03 | mcq | 0 | 1 | 1 | 0 | 2 |
| a1-u01-l03 | reading | 1 | 0 | 1 | 0 | 2 |
| a1-u01-l04 | listenChoice | 0 | 1 | 0 | 0 | 1 |
| a1-u01-l04 | mcq | 1 | 0 | 0 | 1 | 2 |
| a1-u01-l04 | reading | 1 | 1 | 0 | 0 | 2 |
| a1-u01-l05 | listenChoice | 1 | 0 | 0 | 0 | 1 |
| a1-u01-l05 | mcq | 1 | 0 | 0 | 1 | 2 |
| a1-u01-l05 | reading | 1 | 0 | 1 | 0 | 2 |
| a1-u01-l06 | listenChoice | 0 | 0 | 1 | 0 | 1 |
| a1-u01-l06 | mcq | 0 | 1 | 1 | 0 | 2 |
| a1-u01-l06 | reading | 0 | 1 | 1 | 0 | 2 |
| a1-u01-l07 | listenChoice | 0 | 0 | 1 | 0 | 1 |
| a1-u01-l07 | mcq | 1 | 0 | 0 | 1 | 2 |
| a1-u01-l07 | reading | 1 | 1 | 0 | 0 | 2 |
| a1-u01-l08 | listenChoice | 0 | 1 | 0 | 0 | 1 |
| a1-u01-l08 | mcq | 0 | 1 | 1 | 0 | 2 |
| a1-u01-l08 | reading | 1 | 0 | 1 | 0 | 2 |
| a1-u01-l09 | listenChoice | 1 | 0 | 0 | 0 | 1 |
| a1-u01-l09 | mcq | 0 | 1 | 1 | 0 | 2 |
| a1-u01-l09 | reading | 0 | 1 | 1 | 0 | 2 |
| a1-u01-l10 | listenChoice | 0 | 1 | 0 | 0 | 1 |
| a1-u01-l10 | mcq | 1 | 0 | 0 | 1 | 2 |
| a1-u01-l10 | reading | 1 | 0 | 1 | 0 | 2 |
| B1 | listenChoice | 2 | 1 | 1 | 2 | 6 |
| B1 | mcq | 3 | 3 | 3 | 3 | 12 |
| B1 | reading | 3 | 3 | 3 | 3 | 12 |
| b1-u01-l01 | listenChoice | 0 | 1 | 0 | 0 | 1 |
| b1-u01-l01 | mcq | 1 | 0 | 0 | 1 | 2 |
| b1-u01-l01 | reading | 1 | 0 | 1 | 0 | 2 |
| b1-u01-l02 | listenChoice | 0 | 0 | 0 | 1 | 1 |
| b1-u01-l02 | mcq | 0 | 1 | 1 | 0 | 2 |
| b1-u01-l02 | reading | 0 | 1 | 0 | 1 | 2 |
| b1-u01-l03 | listenChoice | 1 | 0 | 0 | 0 | 1 |
| b1-u01-l03 | mcq | 0 | 1 | 1 | 0 | 2 |
| b1-u01-l03 | reading | 0 | 1 | 0 | 1 | 2 |
| b1-u01-l04 | listenChoice | 0 | 0 | 1 | 0 | 1 |
| b1-u01-l04 | mcq | 1 | 0 | 0 | 1 | 2 |
| b1-u01-l04 | reading | 1 | 0 | 1 | 0 | 2 |
| b1-u01-l05 | listenChoice | 1 | 0 | 0 | 0 | 1 |
| b1-u01-l05 | mcq | 1 | 0 | 0 | 1 | 2 |
| b1-u01-l05 | reading | 1 | 1 | 0 | 0 | 2 |
| b1-u01-l06 | listenChoice | 0 | 0 | 0 | 1 | 1 |
| b1-u01-l06 | mcq | 0 | 1 | 1 | 0 | 2 |
| b1-u01-l06 | reading | 0 | 0 | 1 | 1 | 2 |

---

# 附錄：免費模型（OpenRouter）pilot 狀態——已不採用，產出封存於 archive-openrouter/


> 16 課全部有結果：合格 9、最終退件 7。檢查器以 `checkLessonItems(…, requireJudge:false)` 重算、只計阻擋錯誤；「v1／v2 格式、缺四選一欄位」為 TASK-12 欄位提示（不阻擋）。合格課中 5 課的四選一欄位由 gloss-backfill.v1 補上（題目未重產），a1-u01-l08 尚未補（上游 429）。prompt 欄以題目檔內 promptVersion 為準；`前次（aN）`＝第 N 次產生的保留檔。

| 課 | 檔案 | prompt | attempt | 判題 | 檢查器阻擋錯誤 |
|---|---|---|---|---|---|
| a1-u01-l01 | 合格 | v1 | 1 | apodex | 0 |
| a1-u01-l02 | 前次（a2） | v1 | 1 | apodex | OVER_LEVEL×2（v1／v2 格式、缺四選一欄位） |
| a1-u01-l02 | 合格 | v3 | 3 | apodex | 0 |
| a1-u01-l02 | 解析失敗原文（a2.raw.txt） | — | — | — | 無題目 |
| a1-u01-l03 | 前次（a1） | v2 | 1 | apodex | SIMPLIFIED×5、ZH_NOT_TW×5、UNLEVELED×1（v1／v2 格式、缺四選一欄位） |
| a1-u01-l03 | 合格 | v2 | 2 | apodex | 0 |
| a1-u01-l04 | 合格 | v1 | 1 | apodex | 0 |
| a1-u01-l05 | 前次（a1） | v1 | 1 | apodex | OVER_LEVEL×1、ZH_MISSING×3（v1／v2 格式、缺四選一欄位） |
| a1-u01-l05 | 前次（a2） | v2 | 2 | apodex | SIMPLIFIED×1、ZH_NOT_TW×1、ZH_MISSING×2、OVER_LEVEL×1、MCQ_AMBIGUOUS×1（v1／v2 格式、缺四選一欄位） |
| a1-u01-l05 | 退件 | v3 | 3 | apodex | MCQ_AMBIGUOUS×2 |
| a1-u01-l06 | 前次（a1） | v1 | 1 | apodex | OVER_LEVEL×2、LENGTH×1（v1／v2 格式、缺四選一欄位） |
| a1-u01-l06 | 前次（a2） | v3 | 2 | apodex | MCQ_AMBIGUOUS×1 |
| a1-u01-l06 | 退件 | v3 | 3 | apodex | OVER_LEVEL×1、SIMPLIFIED×3、ZH_NOT_TW×3 |
| a1-u01-l07 | 前次（a1） | v2 | 1 | google | MCQ_AMBIGUOUS×1（v1／v2 格式、缺四選一欄位） |
| a1-u01-l07 | 前次（a2） | v3 | 2 | apodex | MCQ_AMBIGUOUS×1 |
| a1-u01-l07 | 退件 | v3 | 3 | apodex | ZH_NOT_TW×4、SIMPLIFIED×2、MCQ_AMBIGUOUS×1 |
| a1-u01-l08 | 合格 | v2 | 1 | apodex | 0（v1／v2 格式、缺四選一欄位） |
| a1-u01-l09 | 前次（a2） | v3 | 2 | apodex | ZH_NOT_TW×2 |
| a1-u01-l09 | 合格 | v3 | 3 | apodex | 0 |
| a1-u01-l09 | 解析失敗原文（a1.raw.txt） | — | — | — | 無題目 |
| a1-u01-l10 | 前次（a1） | v2 | 1 | apodex | OVER_LEVEL×2（v1／v2 格式、缺四選一欄位） |
| a1-u01-l10 | 前次（a2） | v2 | 2 | apodex | OVER_LEVEL×8（v1／v2 格式、缺四選一欄位） |
| a1-u01-l10 | 解析失敗原文（raw.txt） | — | — | — | 無題目 |
| b1-u01-l01 | 前次（a1） | v2 | 1 | apodex | NOT_ENGLISH×3、OVER_LEVEL×2、ZH_NOT_TW×2、SIMPLIFIED×1（v1／v2 格式、缺四選一欄位） |
| b1-u01-l01 | 合格 | v3 | 2 | apodex | 0 |
| b1-u01-l02 | 前次（a2） | v3 | 2 | apodex | SIMPLIFIED×2、ZH_NOT_TW×2、MCQ_AMBIGUOUS×1 |
| b1-u01-l02 | 退件 | v3 | 3 | apodex | ZH_NOT_TW×1、OVER_LEVEL×1 |
| b1-u01-l02 | 解析失敗原文（a1.raw.txt） | — | — | — | 無題目 |
| b1-u01-l03 | 前次（a2） | v3 | 2 | apodex | OVER_LEVEL×2 |
| b1-u01-l03 | 解析失敗原文（a1.raw.txt） | — | — | — | 無題目 |
| b1-u01-l03 | 解析失敗原文（raw.txt） | — | — | — | 無題目 |
| b1-u01-l04 | 前次（a1） | v1 | 1 | apodex | SIMPLIFIED×1、ZH_NOT_TW×1、MCQ_WRONG_KEY×1（v1／v2 格式、缺四選一欄位） |
| b1-u01-l04 | 解析失敗原文（a2.raw.txt） | — | — | — | 無題目 |
| b1-u01-l04 | 解析失敗原文（raw.txt） | — | — | — | 無題目 |
| b1-u01-l05 | 合格 | v1 | 1 | apodex | 0 |
| b1-u01-l06 | 合格 | v1 | 1 | apodex | 0 |

| prompt | 題目檔數 | 內容錯誤合計 | 每檔平均 | 判題類錯誤（MCQ_*） | 0 錯檔數 |
|---|---|---|---|---|---|
| v1 | 8 | 11 | 1.4 | 1 | 4 |
| v3 | 12 | 23 | 1.9 | 6 | 3 |
| v2 | 8 | 34 | 4.3 | 2 | 2 |
