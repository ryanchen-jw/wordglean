# B2 第 2 批（u09～u16）三關修正對照表

> 依 t9/b2b2-rulings.md、longest-rule.md（最終版：長度名次分布＋單題 0.5–2 倍離群限制）、執行長 2026-10-03 各則補充裁示。
> 每處修改都記入該課 `judge.resolvedAfterFinalReview`，下表由紀錄自動產生。

## 摘要

- **判題**：第②關 270 題位以選項文字對應現行索引寫入 `judge.verdicts`。
  - 例外 1：u15-l01 q13 雙答案（chew／boil）。照實寫入審題員作答；干擾項 boil 換成 spill 後，verdict 更新為唯一正解。
  - 例外 2：u15-l06 q14#1 盲審後已改選項（chip→炸來吃），verdict 依現行正解寫入。
- **第②關 issues**：74 條全部結案，結案紀錄寫在 `resolvedAfterFinalReview`，訊息以「第②關 issue 結案」開頭。其中 72 條已修正，2 條不改，理由見下。
- **第③關**：FIX 55 條全修，疑似項目逐條照裁示處理。
  - 情境相同即算雷同（嚴格標準）。
  - G1：單字卡改教該級主要詞義，醫療類用中性事實句。
- **情境對照表**：依 §11.4 格式（10 字摘要＋句型是否不同）以現行檔案重製，逐列判定，共 437 列。
  - 第一輪判「需改」的有 162 列：u09～u12 102 列、u13～u16 60 列，已全部改寫。第二輪重判又改了 9 列。最終全部判為通過或通過（已改）。
- **正解長度**：B2 全級（第 1～3 批）都修到符合最終版規則。
  - 正解落在各長度名次的比例：reading 24／29／22／25%，listenChoice 23／23／26／27%，mcq 25／31／21／23%，全部在 13–37% 內。
  - 單題 0.5–2 倍離群：0 題。
- **檢查器**：第 1、2 批 `--require-judge` 106 課全綠；B2 133 課全綠（全部級別合計 266 課也全綠）；`npm test` 169／169。

## 不改的項目與理由

| 課 | 位置 | 審查意見 | 決定與理由 |
|---|---|---|---|
| b2-u09-l05 | 閱讀 | 辦公室爆發流感是否屬已裁可用的公衛情境 | 不改：執行長已裁定 outbreak 可用新聞、公衛語氣；本段沒有傷亡，也沒有醫療建議 |
| b2-u16-l01 | items/6/word | word 寫成小寫 dna | 不改：schema 規定 word 為小寫 headword，課綱即 dna；例句與各題一律寫 DNA |
| 第③關 S2 | 多課 | 只有句型相同 | 依新的情境對照表重判處理：句型相同的列都已改寫 |
| 名次分布 | b2-u07-l02 閱讀 q0、b2-u15-l05 閱讀 q0 | 雜湊分派的名次無法嚴格達成 | 保留原樣：選項本身是數字或二字詞，硬改會變成新的線索；整體分布仍合格 |

## 盲審後改到選項或題幹的題位（請安排重新盲答）

```
第 2 批（對盲審版本）175 題位：
b2-u09-l01-q11（選項）
b2-u09-l01-q16#0（選項）
b2-u09-l01-q16#1（選項）
b2-u09-l02-q11（選項）
b2-u09-l02-q16#0（選項）
b2-u09-l02-q16#1（選項）
b2-u09-l03-q11（選項）
b2-u09-l03-q16#0（短文、選項）
b2-u09-l03-q16#1（短文、選項）
b2-u09-l04-q14（題幹）
b2-u09-l04-q15#0（選項）
b2-u09-l04-q15#1（選項）
b2-u09-l05-q10（選項）
b2-u09-l05-q15#0（短文、選項）
b2-u09-l05-q15#1（短文、選項）
b2-u09-l06-q10（選項）
b2-u09-l06-q13（題幹）
b2-u09-l06-q15#0（短文、選項）
b2-u09-l06-q15#1（短文、選項）
b2-u09-l07-q10（選項）
b2-u09-l07-q15#0（選項）
b2-u09-l07-q15#1（選項）
b2-u09-l08-q10（選項）
b2-u09-l08-q15#0（選項）
b2-u09-l08-q15#1（選項）
b2-u10-l01-q11（選項）
b2-u10-l01-q16#0（短文、選項）
b2-u10-l01-q16#1（短文、選項）
b2-u10-l02-q11（選項）
b2-u10-l02-q16#0（選項）
b2-u10-l02-q16#1（選項）
b2-u10-l03-q10（選項）
b2-u10-l03-q15#0（選項）
b2-u10-l03-q15#1（選項）
b2-u10-l04-q10（選項）
b2-u10-l04-q15#0（選項）
b2-u10-l04-q15#1（選項）
b2-u11-l01-q10（選項）
b2-u11-l01-q15#0（短文、選項）
b2-u11-l01-q15#1（短文、選項）
b2-u11-l02-q10（選項）
b2-u11-l02-q15#0（選項）
b2-u11-l02-q15#1（選項）
b2-u11-l03-q10（選項）
b2-u11-l03-q13（題幹）
b2-u11-l03-q15#0（選項）
b2-u11-l03-q15#1（選項）
b2-u11-l04-q10（選項）
b2-u11-l04-q13（題幹）
b2-u11-l04-q14（題幹）
b2-u11-l04-q15#0（選項）
b2-u11-l04-q15#1（選項）
b2-u11-l05-q10（選項）
b2-u11-l05-q15#0（短文、選項）
b2-u11-l05-q15#1（短文、選項）
b2-u11-l06-q10（選項）
b2-u11-l06-q15#0（選項）
b2-u11-l06-q15#1（選項）
b2-u11-l07-q09（選項）
b2-u11-l07-q14#0（短文、選項）
b2-u11-l07-q14#1（短文、選項）
b2-u12-l01-q10（選項）
b2-u12-l01-q14（選項）
b2-u12-l01-q15#0（選項）
b2-u12-l01-q15#1（選項）
b2-u12-l02-q10（選項）
b2-u12-l02-q13（題幹、選項）
b2-u12-l02-q15#0（選項）
b2-u12-l02-q15#1（選項）
b2-u12-l03-q10（選項）
b2-u12-l03-q13（題幹）
b2-u12-l03-q14（題幹）
b2-u12-l03-q15#1（選項）
b2-u12-l04-q10（選項）
b2-u12-l04-q15#0（短文、選項）
b2-u12-l04-q15#1（短文、選項）
b2-u12-l05-q10（選項）
b2-u12-l05-q15#0（短文、選項）
b2-u12-l05-q15#1（短文、選項）
b2-u12-l06-q10（選項）
b2-u12-l06-q13（題幹、選項）
b2-u12-l06-q15#0（短文、選項）
b2-u12-l06-q15#1（短文、選項）
b2-u12-l07-q10（選項）
b2-u12-l07-q15#0（短文、選項）
b2-u12-l07-q15#1（短文、選項）
b2-u12-l08-q10（選項）
b2-u12-l08-q13（選項）
b2-u12-l08-q15#0（短文、選項）
b2-u12-l08-q15#1（短文、選項）
b2-u12-l09-q10（選項）
b2-u12-l09-q13（題幹）
b2-u12-l09-q14（題幹）
b2-u12-l09-q15#0（選項）
b2-u12-l09-q15#1（選項）
b2-u13-l01-q11（選項）
b2-u13-l01-q16#0（短文、選項）
b2-u13-l01-q16#1（短文、選項）
b2-u13-l02-q10（選項）
b2-u13-l02-q14（選項）
b2-u13-l02-q15#0（選項）
b2-u13-l02-q15#1（選項）
b2-u13-l03-q10（選項）
b2-u13-l03-q13（選項）
b2-u13-l03-q15#0（選項）
b2-u13-l04-q15#1（選項）
b2-u13-l05-q10（選項）
b2-u13-l05-q13（選項）
b2-u13-l05-q15#0（選項）
b2-u13-l05-q15#1（選項）
b2-u14-l01-q16#0（選項）
b2-u14-l01-q16#1（選項）
b2-u14-l02-q11（選項）
b2-u14-l02-q16#0（選項）
b2-u14-l02-q16#1（選項）
b2-u14-l03-q11（選項）
b2-u14-l03-q16#0（短文、選項）
b2-u14-l03-q16#1（短文、選項）
b2-u14-l04-q10（選項）
b2-u14-l04-q15#0（選項）
b2-u14-l04-q15#1（選項）
b2-u14-l05-q10（選項）
b2-u14-l05-q15#0（短文、選項）
b2-u14-l05-q15#1（短文、選項）
b2-u15-l01-q10（選項）
b2-u15-l01-q13（選項）
b2-u15-l01-q15#0（選項）
b2-u15-l01-q15#1（選項）
b2-u15-l02-q10（選項）
b2-u15-l02-q13（選項）
b2-u15-l02-q15#0（短文、選項）
b2-u15-l02-q15#1（短文、選項）
b2-u15-l03-q09（選項）
b2-u15-l03-q13（題幹）
b2-u15-l03-q14#0（選項）
b2-u15-l03-q14#1（選項）
b2-u15-l04-q09（選項）
b2-u15-l04-q14#0（短文、選項）
b2-u15-l04-q14#1（短文、選項）
b2-u15-l05-q12（題幹）
b2-u15-l05-q13（題幹）
b2-u15-l05-q14#1（選項）
b2-u15-l06-q09（選項）
b2-u15-l06-q14#0（短文、題目、選項）
b2-u15-l06-q14#1（短文、選項）
b2-u16-l01-q11（選項）
b2-u16-l01-q16#0（選項）
b2-u16-l02-q10（選項）
b2-u16-l02-q15#0（短文、選項）
b2-u16-l02-q15#1（短文、選項）
b2-u16-l03-q10（選項）
b2-u16-l03-q15#0（選項）
b2-u16-l03-q15#1（選項）
b2-u16-l04-q15#0（短文、選項）
b2-u16-l04-q15#1（短文）
b2-u16-l05-q10（選項）
b2-u16-l05-q15#0（選項）
b2-u16-l05-q15#1（選項）
b2-u16-l06-q10（選項）
b2-u16-l06-q15#0（選項）
b2-u16-l06-q15#1（選項）
b2-u16-l07-q10（選項）
b2-u16-l07-q15#0（選項）
b2-u16-l07-q15#1（選項）
b2-u16-l08-q10（選項）
b2-u16-l08-q15#0（選項）
b2-u16-l08-q15#1（選項）
b2-u16-l09-q10（選項）
b2-u16-l09-q14（選項）
b2-u16-l09-q15#0（短文、選項）
b2-u16-l09-q15#1（短文、選項）
b2-u16-l10-q10（選項）
b2-u16-l10-q14（題幹）
b2-u16-l10-q15#0（選項）
b2-u16-l10-q15#1（選項）

第 1 批（本輪正解長度修正）147 題位：
b2-u01-l01-q10
b2-u01-l01-q15#0
b2-u01-l01-q15#1
b2-u01-l02-q10
b2-u01-l02-q15#1
b2-u01-l02-q15#0
b2-u01-l03-q14#0
b2-u01-l03-q14#1
b2-u01-l04-q09
b2-u01-l04-q14#0
b2-u01-l04-q14#1
b2-u01-l05-q09
b2-u01-l05-q14#0
b2-u01-l05-q14#1
b2-u02-l01-q15#0
b2-u02-l01-q15#1
b2-u02-l02-q15#1
b2-u02-l02-q10
b2-u02-l02-q15#0
b2-u02-l03-q15#0
b2-u02-l03-q15#1
b2-u02-l04-q15#0
b2-u02-l04-q15#1
b2-u02-l04-q10
b2-u02-l05-q09
b2-u02-l05-q14#1
b2-u02-l05-q14#0
b2-u02-l06-q14#0
b2-u02-l06-q14#1
b2-u02-l06-q09
b2-u03-l01-q11
b2-u03-l01-q16#0
b2-u03-l01-q16#1
b2-u04-l01-q10
b2-u04-l01-q15#0
b2-u04-l01-q15#1
b2-u04-l02-q15#0
b2-u04-l02-q15#1
b2-u04-l02-q10
b2-u04-l03-q09
b2-u04-l03-q14#0
b2-u04-l03-q14#1
b2-u05-l01-q10
b2-u05-l01-q15#0
b2-u05-l01-q15#1
b2-u05-l02-q10
b2-u05-l02-q15#0
b2-u05-l02-q15#1
b2-u05-l03-q15#0
b2-u05-l03-q15#1
b2-u05-l03-q10
b2-u05-l04-q10
b2-u05-l04-q15#0
b2-u05-l04-q15#1
b2-u05-l05-q15#0
b2-u05-l05-q15#1
b2-u05-l05-q10
b2-u05-l06-q15#1
b2-u05-l06-q10
b2-u05-l06-q15#0
b2-u05-l07-q10
b2-u05-l07-q15#0
b2-u05-l07-q15#1
b2-u05-l08-q15#0
b2-u05-l08-q15#1
b2-u05-l08-q10
b2-u05-l09-q10
b2-u05-l09-q15#0
b2-u05-l09-q15#1
b2-u06-l01-q15#0
b2-u06-l01-q15#1
b2-u06-l01-q10
b2-u06-l02-q15#1
b2-u06-l02-q15#0
b2-u06-l02-q10
b2-u06-l03-q15#0
b2-u06-l03-q10
b2-u06-l03-q15#1
b2-u06-l04-q15#1
b2-u06-l04-q10
b2-u06-l04-q15#0
b2-u06-l05-q15#0
b2-u06-l06-q10
b2-u06-l06-q15#0
b2-u06-l06-q15#1
b2-u06-l07-q15#0
b2-u06-l07-q15#1
b2-u06-l08-q15#0
b2-u06-l08-q15#1
b2-u06-l08-q10
b2-u06-l09-q15#0
b2-u06-l09-q15#1
b2-u07-l01-q10
b2-u07-l01-q15#0
b2-u07-l01-q15#1
b2-u07-l02-q10
b2-u07-l02-q15#1
b2-u07-l03-q15#0
b2-u07-l03-q10
b2-u07-l03-q15#1
b2-u07-l04-q10
b2-u07-l04-q15#1
b2-u07-l04-q15#0
b2-u07-l05-q10
b2-u07-l05-q15#1
b2-u07-l05-q15#0
b2-u07-l06-q10
b2-u07-l06-q15#0
b2-u07-l06-q15#1
b2-u07-l07-q10
b2-u07-l07-q15#0
b2-u07-l07-q15#1
b2-u07-l08-q10
b2-u07-l08-q15#0
b2-u07-l08-q15#1
b2-u07-l09-q14#0
b2-u07-l09-q14#1
b2-u08-l01-q11
b2-u08-l01-q16#0
b2-u08-l01-q16#1
b2-u08-l02-q16#0
b2-u08-l02-q16#1
b2-u08-l02-q11
b2-u08-l03-q11
b2-u08-l03-q16#0
b2-u08-l03-q16#1
b2-u08-l04-q10
b2-u08-l04-q15#0
b2-u08-l04-q15#1
b2-u08-l05-q10
b2-u08-l05-q15#0
b2-u08-l05-q15#1
b2-u08-l06-q15#0
b2-u08-l06-q15#1
b2-u08-l06-q10
b2-u08-l07-q15#0
b2-u08-l07-q10
b2-u08-l07-q15#1
b2-u08-l08-q10
b2-u08-l08-q15#0
b2-u08-l08-q15#1
b2-u08-l09-q10
b2-u08-l09-q15#0
b2-u08-l09-q15#1
b2-u08-l10-q10
b2-u08-l10-q15#0
b2-u08-l10-q15#1
```

## 第 2 批修改明細

| 課 | 位置 | 來源 | 改前 | 改後 |
|---|---|---|---|---|
| b2-u09-l01 | items/8/exampleZh | 第②關 issue | "大雨差點毀了我們的野餐。" | "大雨眼看就要毀了我們的野餐。" |
| b2-u09-l01 | items/10/options/0 | 執行長正解長度裁示修正 | "It is faster than driving" | "It is faster than driving a car to work" |
| b2-u09-l01 | items/10/options/3 | 執行長正解長度裁示修正 | "It helps you meet people" | "It helps you meet new people on the way" |
| b2-u09-l01 | items/15/questions/0/options/0 | 執行長正解長度裁示修正 | "快速的修圖服務" | "當天就能拿到的修圖服務" |
| b2-u09-l01 | items/15/questions/0/options/1 | 執行長正解長度裁示修正 | "便宜的相機" | "價格便宜的數位相機" |
| b2-u09-l01 | items/15/questions/1/options/1 | 執行長正解長度裁示修正 | "失去很多顧客" | "失去很多老顧客" |
| b2-u09-l01 | items/15/questions/1/options/2 | 執行長正解長度裁示修正 | "必須把店搬走" | "必須把店搬到別處" |
| b2-u09-l01 | items/8/exampleZh | 第②關 issue 結案 |  | 已修正：見本檔 resolvedAfterFinalReview 中 items/8 的 1 筆修正紀錄。 |
| b2-u09-l01 | items/0/exampleEn | 情境對照表重判 | "Many small shops closed during the recession." | "Fewer families took trips abroad during the last recession." |
| b2-u09-l01 | items/0/exampleZh | 情境對照表重判 | "經濟衰退期間，許多小店倒閉了。" | "上次經濟衰退期間，出國旅遊的家庭變少了。" |
| b2-u09-l01 | items/2/exampleEn | 情境對照表重判 | "Regular breaks are beneficial for both workers and companies." | "The team trip had a beneficial effect on everyone's mood." |
| b2-u09-l01 | items/2/exampleZh | 情境對照表重判 | "規律的休息對員工和公司都有益處。" | "這趟團隊旅行對每個人的心情都有好處。" |
| b2-u09-l01 | items/3/exampleEn | 情境對照表重判 | "This job offers good chances for advancement." | "Advancements in technology have made solar power much cheaper." |
| b2-u09-l01 | items/3/exampleZh | 情境對照表重判 | "這份工作有很好的升遷機會。" | "科技的進步讓太陽能便宜了很多。" |
| b2-u09-l01 | items/4/exampleEn | 情境對照表重判 | "If you return the car late, you will incur an extra charge." | "No extra fees will be incurred if you cancel before Friday." |
| b2-u09-l01 | items/4/exampleZh | 情境對照表重判 | "如果你晚還車，就會產生額外費用。" | "如果你在星期五前取消，就不會產生額外費用。" |
| b2-u09-l01 | items/5/exampleEn | 情境對照表重判 | "Online banking has revolutionized how people manage money." | "Housework was revolutionized by the invention of the washing machine." |
| b2-u09-l01 | items/5/exampleZh | 情境對照表重判 | "網路銀行徹底改變了人們管理金錢的方式。" | "家務因為洗衣機的發明而徹底改變。" |
| b2-u09-l01 | items/6/exampleEn | 情境對照表重判 | "Price is an important factor when people choose a hotel." | "Lack of sleep was one factor behind his poor test results." |
| b2-u09-l01 | items/6/exampleZh | 情境對照表重判 | "價格是人們選飯店時的重要因素。" | "睡眠不足是他考試成績不好的因素之一。" |
| b2-u09-l01 | items/8/exampleEn | 情境對照表重判 | "Heavy rain threatened to ruin our picnic." | "Many sea birds are threatened by plastic waste in the ocean." |
| b2-u09-l01 | items/8/exampleZh | 情境對照表重判 | "大雨眼看就要毀了我們的野餐。" | "許多海鳥受到海洋中塑膠垃圾的威脅。" |
| b2-u09-l01 | items/0/exampleEn | 情境對照表重判提案修正 | "Fewer families took trips abroad during the last recession." | "Not many families took trips abroad during the last recession." |
| b2-u09-l01 | items/6/exampleEn | 情境對照表重判 | "Lack of sleep was one factor behind his poor test results." | "Several factors can affect how well a plant grows." |
| b2-u09-l01 | items/6/exampleZh | 情境對照表重判 | "睡眠不足是他考試成績不好的因素之一。" | "有好幾個因素會影響植物長得好不好。" |
| b2-u09-l01 | items/15/questions/0/options/1 | 執行長正解長度裁示修正 | "價格便宜的數位相機" | "便宜的數位相機" |
| b2-u09-l01 | items/15/questions/1/options/3 | 執行長正解長度裁示修正 | "員工都離職了" | "員工離職了" |
| b2-u09-l01 | items/15/questions/0/options/3 | 執行長正解長度裁示修正 | "證件照" | "拍證件照的服務" |
| b2-u09-l02 | items/4/glossZh | 第②關 issue | "決心；解決" | "解決；決心" |
| b2-u09-l02 | items/10/options/1 | 執行長正解長度裁示修正 | "Watch another game" | "Watch another game at home" |
| b2-u09-l02 | items/10/options/2 | 執行長正解長度裁示修正 | "Go home early" | "Go home and rest early" |
| b2-u09-l02 | items/15/questions/0/options/0 | 執行長正解長度裁示修正 | "擔心客戶會抱怨" | "擔心客戶週五找不到人會打來抱怨" |
| b2-u09-l02 | items/15/questions/0/options/2 | 執行長正解長度裁示修正 | "覺得員工會偷懶" | "覺得員工多放一天假就會偷懶" |
| b2-u09-l02 | items/15/questions/1/options/1 | 執行長正解長度裁示修正 | "業績大幅下滑" | "業績大幅下滑，加班的人變多" |
| b2-u09-l02 | items/15/questions/1/options/3 | 執行長正解長度裁示修正 | "會議變得更多" | "會議變得更多，下班時間更晚" |
| b2-u09-l02 | items/4/glossZh | 第②關 issue 結案 |  | 已修正：見本檔 resolvedAfterFinalReview 中 items/4 的 1 筆修正紀錄。 |
| b2-u09-l02 | items/0/exampleEn | 情境對照表重判 | "There is growing interest in electric cars." | "The growing number of tourists has made the old town noisy." |
| b2-u09-l02 | items/0/exampleZh | 情境對照表重判 | "大家對電動車的興趣越來越高。" | "越來越多的觀光客讓老城區變得很吵。" |
| b2-u09-l02 | items/2/exampleEn | 情境對照表重判 | "Ultimately, it is your decision whether to accept the offer." | "Hard work is ultimately more important than talent." |
| b2-u09-l02 | items/2/exampleZh | 情境對照表重判 | "說到底，要不要接受這份工作由你決定。" | "說到底，努力比天分更重要。" |
| b2-u09-l02 | items/5/exampleEn | 情境對照表重判 | "The transition to the new computer system went smoothly." | "Spring is a time of transition from cold to warm weather." |
| b2-u09-l02 | items/5/exampleZh | 情境對照表重判 | "轉換到新電腦系統的過程很順利。" | "春天是天氣由冷轉暖的過渡時期。" |
| b2-u09-l02 | items/6/exampleEn | 情境對照表重判 | "There was little resistance to the idea of a longer lunch break." | "Our cat shows strong resistance to having a bath." |
| b2-u09-l02 | items/6/exampleZh | 情境對照表重判 | "延長午休這個點子幾乎沒有人反對。" | "我們家的貓非常抗拒洗澡。" |
| b2-u09-l02 | items/7/exampleEn | 情境對照表重判 | "The project is now in its final phase." | "My son is going through a phase where he asks 'why' about everything." |
| b2-u09-l02 | items/7/exampleZh | 情境對照表重判 | "這個專案現在進入最後階段。" | "我兒子正處在什麼事都要問「為什麼」的階段。" |
| b2-u09-l02 | items/10/options/1 | 執行長正解長度裁示修正 | "Watch another game at home" | "Watch another game" |
| b2-u09-l02 | items/10/options/2 | 執行長正解長度裁示修正 | "Go home and rest early" | "Go home and rest" |
| b2-u09-l02 | items/15/questions/0/options/2 | 執行長正解長度裁示修正 | "覺得員工多放一天假就會偷懶" | "覺得員工放假多就會偷懶" |
| b2-u09-l02 | items/15/questions/0/options/3 | 執行長正解長度裁示修正 | "怕薪水會減少" | "怕員工的薪水會減少" |
| b2-u09-l02 | items/15/questions/1/options/0 | 執行長正解長度裁示修正 | "員工紛紛離職" | "很多員工紛紛離職" |
| b2-u09-l03 | items/11/sentenceEn | 第③關 FIX1 | "My desk is always in disorder at the end of a busy week." | "Working from home has been a quiet revolution for many parents." |
| b2-u09-l03 | items/11/sentenceZh | 第③關 FIX1 | "忙碌的一週結束時，我的桌子總是亂七八糟。" | "在家工作對許多父母來說是一場安靜的革命。" |
| b2-u09-l03 | items/8/exampleEn | 第②關 issue＋第③關 S5 | "In a dictionary, Chinese characters are often grouped by their radical." | "The new manager made radical changes to the menu." |
| b2-u09-l03 | items/8/exampleZh | 第②關 issue＋第③關 S5 | "字典裡的中文字常常按部首分類。" | "新經理對菜單做了徹底的改變。" |
| b2-u09-l03 | items/8/glossZh | 第②關 issue＋第③關 S5 | "部首；詞根" | "徹底的；根本的" |
| b2-u09-l03 | items/8/distractorsZh | 第②關 issue | ["筆畫","標點","發音"] | ["輕微的","暫時的","傳統的"] |
| b2-u09-l03 | items/15/passageEn | 第②關 issue | "When Ben took over his father's bakery, the kitchen was in disorder and the business was losing money. He decided to change its fate. First, he studied the market and found that the main barrier to growth was the shop's dull image. So he started a small revolution: he added coffee, free internet, and seasonal variations of the classic breads. The bakery slowly evolved into a popular meeting place, and sales rose considerably. Two years later, Ben planned an expansion into a second shop in a developing part of the city. He even printed a Chinese character on the paper bags, and customers love to guess what its radical means." | "When Ben took over his father's bakery, the kitchen was in disorder and the business was losing money. He decided to change its fate. First, he studied the market and found that the main barrier to growth was the shop's dull image. So he started a small revolution: he added coffee, free internet, and seasonal variations of the classic breads. The bakery slowly evolved into a popular meeting place, and sales rose considerably. Two years later, Ben planned an expansion into a second shop in a developing part of the city. Many customers say these radical changes saved the shop." |
| b2-u09-l03 | items/15/passageZh | 第②關 issue | "Ben 接手父親的麵包店時，廚房一團亂，生意也在虧錢。他決定改變麵包店的命運。首先，他研究市場，發現成長的主要障礙是店面形象太沉悶。於是他發起一場小小的革命：增加咖啡、免費網路，還推出經典麵包的季節變化款。麵包店慢慢變成熱門的聚會場所，業績也大幅成長。兩年後，Ben 計畫擴張，在城裡一個發展中的地區開第二家店。他甚至在紙袋上印了一個中文字，顧客都喜歡猜它的部首代表什麼意思。" | "Ben 接手父親的麵包店時，廚房一團亂，生意也在虧錢。他決定改變麵包店的命運。首先，他研究市場，發現成長的主要障礙是店面形象太沉悶。於是他發起一場小小的革命：增加咖啡、免費網路，還推出經典麵包的季節變化款。麵包店慢慢變成熱門的聚會場所，業績也大幅成長。兩年後，Ben 計畫擴張，在城裡一個發展中的地區開第二家店。很多顧客說，這些徹底的改變救了這家店。" |
| b2-u09-l03 | properNouns | 第②關 issue | ["Chinese","Ben","Japan"] | ["Ben","Japan"] |
| b2-u09-l03 | items/2/exampleEn | 第③關 S6 | "Our developing business needs more staff every month." | "A developing baby needs plenty of sleep." |
| b2-u09-l03 | items/2/exampleZh | 第③關 S6 | "我們發展中的事業每個月都需要更多人手。" | "發育中的寶寶需要充足的睡眠。" |
| b2-u09-l03 | items/2/glossZh | 第③關 S6 | "發展中的" | "發展中的；發育中的" |
| b2-u09-l03 | items/15/questions/0/options/1 | 執行長正解長度裁示修正 | "租金太貴" | "店面的租金太貴了" |
| b2-u09-l03 | items/15/questions/0/options/3 | 執行長正解長度裁示修正 | "麵包不好吃" | "麵包的口味不好吃" |
| b2-u09-l03 | items/8/word | 第②關 issue 結案 |  | 已修正：見本檔 resolvedAfterFinalReview 中 items/8 的 4 筆修正紀錄。 |
| b2-u09-l03 | items/8/glossZh | 第②關 issue 結案 |  | 已修正：見本檔 resolvedAfterFinalReview 中 items/8 的 4 筆修正紀錄。 |
| b2-u09-l03 | items/15/passageEn | 第②關 issue 結案 |  | 已修正：見本檔 resolvedAfterFinalReview 中 items/15 的 4 筆修正紀錄。 |
| b2-u09-l03 | items/0/exampleEn | 情境對照表重判 | "After the storm, the garden was in complete disorder." | "Disorder broke out at the station when all the trains were cancelled." |
| b2-u09-l03 | items/0/exampleZh | 情境對照表重判 | "暴風雨過後，花園一片凌亂。" | "所有列車都取消時，車站裡一片混亂。" |
| b2-u09-l03 | items/2/exampleEn | 情境對照表重判 | "A developing baby needs plenty of sleep." | "She has a developing interest in photography." |
| b2-u09-l03 | items/2/exampleZh | 情境對照表重判 | "發育中的寶寶需要充足的睡眠。" | "她對攝影的興趣正在逐漸發展。" |
| b2-u09-l03 | items/3/exampleEn | 情境對照表重判 | "The expansion of the airport will take five years." | "After the expansion, the park has room for twice as many visitors." |
| b2-u09-l03 | items/3/exampleZh | 情境對照表重判 | "機場的擴建工程需要五年。" | "擴建之後，這座公園能容納的遊客多了一倍。" |
| b2-u09-l03 | items/4/exampleEn | 情境對照表重判 | "The invention of the car caused a revolution in transportation." | "Many people were slow to accept the digital revolution." |
| b2-u09-l03 | items/4/exampleZh | 情境對照表重判 | "汽車的發明帶來了交通運輸的革命。" | "許多人很晚才接受數位革命。" |
| b2-u09-l03 | items/7/exampleEn | 情境對照表重判 | "The singer added a small variation to the old song." | "Good storytellers use variation in their voice to keep listeners interested." |
| b2-u09-l03 | items/7/exampleZh | 情境對照表重判 | "那位歌手在老歌裡加入了一點變化。" | "會說故事的人會讓聲音有所變化，讓聽眾保持興趣。" |
| b2-u09-l03 | items/8/exampleEn | 情境對照表重判 | "The new manager made radical changes to the menu." | "Our old roof needs a radical solution, not more small repairs." |
| b2-u09-l03 | items/8/exampleZh | 情境對照表重判 | "新經理對菜單做了徹底的改變。" | "我們的舊屋頂需要徹底的解決辦法，而不是再做小修補。" |
| b2-u09-l03 | items/4/exampleEn | 情境對照表重判 | "Many people were slow to accept the digital revolution." | "The farming revolution happened thousands of years ago." |
| b2-u09-l03 | items/4/exampleZh | 情境對照表重判 | "許多人很晚才接受數位革命。" | "農業革命發生在幾千年前。" |
| b2-u09-l03 | items/10/options/0 | 執行長正解長度裁示修正 | "The food" | "The local food" |
| b2-u09-l03 | items/10/options/1 | 執行長正解長度裁示修正 | "The weather" | "The hot weather" |
| b2-u09-l03 | items/15/questions/0/options/0 | 執行長正解長度裁示修正 | "店面形象太沉悶" | "店面給人的形象太沉悶" |
| b2-u09-l03 | items/15/questions/1/options/1 | 執行長正解長度裁示修正 | "把麵包店賣掉" | "賣掉麵包店" |
| b2-u09-l03 | items/15/questions/1/options/2 | 執行長正解長度裁示修正 | "開第二家店" | "開第二家分店" |
| b2-u09-l03 | items/15/questions/0/options/2 | 執行長正解長度裁示修正 | "員工不夠" | "店裡的員工不夠" |
| b2-u09-l04 | items/11/sentenceEn | 第③關 S21 | "Shops put candy near the exit because many people buy on impulse." | "Try not to make big decisions on impulse." |
| b2-u09-l04 | items/11/sentenceZh | 第③關 S21 | "商店把糖果放在出口附近，因為很多人會一時衝動購買。" | "盡量不要一時衝動做重大決定。" |
| b2-u09-l04 | items/13/stemEn | 第③關 S21 | "Her ____ idea of a four-day work week surprised the whole company." | "Her ____ idea of letting customers pay what they want surprised everyone." |
| b2-u09-l04 | items/13/stemZh | 第③關 S21 | "她提出每週上班四天的革命性點子，讓全公司都很驚訝。" | "她讓顧客自由決定付多少錢的革命性點子，讓大家都很驚訝。" |
| b2-u09-l04 | items/14/questions/1/options/1 | 執行長正解長度裁示修正 | "新的購物中心" | "讓居民買便宜蔬菜的購物中心" |
| b2-u09-l04 | items/14/questions/1/options/2 | 執行長正解長度裁示修正 | "免費公車" | "讓居民免費搭乘的公車路線" |
| b2-u09-l04 | items/14/questions/0/options/0 | 執行長正解長度裁示修正 | "降低稅金" | "降低食物的稅金" |
| b2-u09-l04 | items/14/questions/0/options/2 | 執行長正解長度裁示修正 | "免費發放食物" | "免費發放食物給各個家庭" |
| b2-u09-l04 | items/0/exampleEn | 情境對照表重判 | "Scientists study the evolution of birds." | "In biology class, we learned how evolution works." |
| b2-u09-l04 | items/0/exampleZh | 情境對照表重判 | "科學家研究鳥類的演化。" | "我們在生物課上學到演化是怎麼進行的。" |
| b2-u09-l04 | items/2/exampleEn | 情境對照表重判 | "The formation of ice on the road made driving difficult." | "The children watched the formation of clouds over the mountain." |
| b2-u09-l04 | items/2/exampleZh | 情境對照表重判 | "路面結冰讓開車變得很困難。" | "孩子們看著山上的雲慢慢形成。" |
| b2-u09-l04 | items/3/exampleEn | 情境對照表重判 | "There is a speed restriction on this old bridge." | "Because of water restrictions, people cannot wash their cars this summer." |
| b2-u09-l04 | items/3/exampleZh | 情境對照表重判 | "這座老橋有速度限制。" | "因為限水措施，今年夏天大家不能洗車。" |
| b2-u09-l04 | items/4/exampleEn | 情境對照表重判 | "Inflation makes it harder for families to save money." | "The bank expects inflation to stay low next year." |
| b2-u09-l04 | items/4/exampleZh | 情境對照表重判 | "通貨膨脹讓家庭更難存錢。" | "銀行預計明年的通貨膨脹會維持在低點。" |
| b2-u09-l04 | items/3/exampleEn | 情境對照表重判 | "Because of water restrictions, people cannot wash their cars this summer." | "Some apartment buildings have a restriction on keeping large dogs." |
| b2-u09-l04 | items/3/exampleZh | 情境對照表重判 | "因為限水措施，今年夏天大家不能洗車。" | "有些公寓大樓限制住戶飼養大型狗。" |
| b2-u09-l04 | items/14/questions/0/options/1 | 執行長正解長度裁示修正 | "限制房租漲幅" | "限制房租上漲的幅度" |
| b2-u09-l04 | items/14/questions/0/options/2 | 執行長正解長度裁示修正 | "免費發放食物給各個家庭" | "免費提供食物" |
| b2-u09-l04 | items/14/questions/1/options/2 | 執行長正解長度裁示修正 | "讓居民免費搭乘的公車路線" | "讓居民免費搭的公車路線" |
| b2-u09-l04 | items/14/questions/1/options/0 | 執行長正解長度裁示修正 | "新的學校" | "讓居民上課的新學校" |
| b2-u09-l05 | items/10/sentenceEn | 第③關 FIX2 | "Better trains have improved the mobility of workers in this region." | "Job mobility is high in this field; people change companies every two years." |
| b2-u09-l05 | items/10/sentenceZh | 第③關 FIX2 | "更好的火車提升了這個地區勞工的移動能力。" | "這一行的工作流動性很高，大家每兩年就換一家公司。" |
| b2-u09-l05 | items/14/passageZh | 第②關 issue | "去年冬天，辦公室爆發流感，迫使公司改變工作方式。很多員工待在家裡，團隊之間的溝通也中斷了。經理們起初不太願意，但最後理性勝出：他們徹底改了規定，讓大家可以在家工作。新的線上工具興起讓這件事更容易，員工的流動性也提高了，因為大家在哪裡都能工作。有些人認為在辦公室上班是公司的宿命，但這個改變對業績並沒有不利影響。如今，大部分員工每週有兩天在家工作。" | "去年冬天，辦公室爆發流感，迫使公司改變工作方式。很多員工待在家裡，團隊之間的溝通也中斷了。經理們起初不太願意，但最後理性勝出：他們徹底改了規定，讓大家可以在家工作。新的線上工具興起讓這件事更容易，員工的工作地點也更有彈性，因為大家在哪裡都能工作。有些人認為在辦公室上班是公司的宿命，但這個改變對業績並沒有不利影響。如今，大部分員工每週有兩天在家工作。" |
| b2-u09-l05 | items/14/passageEn | 第②關 issue＋第③關 S7 | "Last winter, an outbreak of flu in our office forced the company to change how we work. Many staff stayed home, and there was a breakdown in communication between teams. Managers were reluctant at first, but common sense prevailed: they radically changed the rules and allowed people to work from home. The emergence of new online tools made this easier, and staff mobility improved, since people could work from anywhere. Some believed that working in the office was the company's destiny, but the change had no adverse effect on sales. Today, most staff work from home two days a week." | "Last winter, an outbreak of flu in our office forced the company to change how we work. Many staff stayed home, and there was a breakdown in communication between teams. Managers were reluctant at first, but common sense prevailed: they radically changed the rules and allowed people to work from home. The emergence of new online tools made this easier, and staff mobility improved, since people could work from anywhere. Some managers worried that sales would fall, but the change had no adverse effect on them. Today, most staff work from home two days a week." |
| b2-u09-l05 | items/14/passageZh | 第②關 issue | "去年冬天，辦公室爆發流感，迫使公司改變工作方式。很多員工待在家裡，團隊之間的溝通也中斷了。經理們起初不太願意，但最後理性勝出：他們徹底改了規定，讓大家可以在家工作。新的線上工具興起讓這件事更容易，員工的工作地點也更有彈性，因為大家在哪裡都能工作。有些人認為在辦公室上班是公司的宿命，但這個改變對業績並沒有不利影響。如今，大部分員工每週有兩天在家工作。" | "去年冬天，辦公室爆發流感，迫使公司改變工作方式。很多員工待在家裡，團隊之間的溝通也中斷了。經理們起初不太願意，但最後理性勝出：他們徹底改了規定，讓大家可以在家工作。新的線上工具興起讓這件事更容易，員工的工作地點也更有彈性，因為大家在哪裡都能工作。有些經理擔心業績會下滑，但這個改變對業績並沒有不利影響。如今，大部分員工每週有兩天在家工作。" |
| b2-u09-l05 | items/16/instructionZh | 第②關 issue＋第③關 S21 | "用 destiny 造一個句子，說說一件你覺得是命運安排的事。" | "用 destiny 造一個句子，說說你是否相信人有天命，以及你的理由。" |
| b2-u09-l05 | items/16/referenceEn | 第②關 issue | ["I think it was my destiny to work with children.","I believe my destiny is to open my own restaurant one day."] | ["I don't believe in destiny, because I think we make our own choices.","I believe destiny brought my parents together, so I trust it."] |
| b2-u09-l05 | items/16/rubricZh | 第②關 issue | ["句子要用到 destiny（例如 my destiny、it was my destiny to…）","句子要說到你自己"] | ["句子要用到 destiny（例如 believe in destiny、destiny brought…）","句子要說到你自己的看法；時態合理即可"] |
| b2-u09-l05 | items/9/options/0 | 執行長正解長度裁示修正 | "There is no water" | "There is no hot water today" |
| b2-u09-l05 | items/9/options/2 | 執行長正解長度裁示修正 | "The manager likes tea" | "The manager likes tea much better" |
| b2-u09-l05 | items/14/questions/0/options/1 | 執行長正解長度裁示修正 | "大樓停電" | "辦公大樓停電一週" |
| b2-u09-l05 | items/14/questions/0/options/3 | 執行長正解長度裁示修正 | "電腦系統故障" | "公司電腦系統故障" |
| b2-u09-l05 | items/14/questions/1/options/1 | 執行長正解長度裁示修正 | "業績大幅下滑" | "業績大幅下滑三成" |
| b2-u09-l05 | items/14/questions/1/options/2 | 執行長正解長度裁示修正 | "業績翻了一倍" | "業績很快翻了一倍" |
| b2-u09-l05 | items/14/passageZh | 第②關 issue 結案 |  | 已修正：見本檔 resolvedAfterFinalReview 中 items/14 的 7 筆修正紀錄。 |
| b2-u09-l05 | items/14/passageEn | 第②關 issue 結案 |  | 已修正：見本檔 resolvedAfterFinalReview 中 items/14 的 7 筆修正紀錄。 |
| b2-u09-l05 | items/16/instructionZh | 第②關 issue 結案 |  | 已修正：見本檔 resolvedAfterFinalReview 中 items/16 的 3 筆修正紀錄。 |
| b2-u09-l05 | items/14/passageEn | 第②關 issue 結案 |  | 不改：執行長已裁 outbreak 可用新聞或公衛語氣；本段無傷亡、無醫療建議，屬已裁範圍。 |
| b2-u09-l05 | items/3/exampleEn | 情境對照表重判 | "Health officials are watching an outbreak of flu in the north." | "Farmers are worried about an outbreak of disease among their pigs." |
| b2-u09-l05 | items/3/exampleZh | 情境對照表重判 | "衛生官員正在關注北部爆發的流感。" | "農夫們擔心他們養的豬會爆發疾病。" |
| b2-u09-l05 | items/5/exampleEn | 情境對照表重判 | "The emergence of online shops changed how we buy books." | "We noticed the emergence of a new cafe culture in our town." |
| b2-u09-l05 | items/5/exampleZh | 情境對照表重判 | "網路商店的興起改變了我們買書的方式。" | "我們注意到鎮上興起了一股新的咖啡館文化。" |
| b2-u09-l05 | items/14/questions/0/options/0 | 執行長正解長度裁示修正 | "辦公室爆發流感" | "辦公室裡爆發了流感" |
| b2-u09-l05 | items/14/questions/1/options/0 | 執行長正解長度裁示修正 | "沒有不利的影響" | "對業績沒有不利的影響" |
| b2-u09-l05 | items/9/options/1 | 執行長正解長度裁示修正 | "Tea is cheaper" | "Tea is much cheaper" |
| b2-u09-l05 | items/14/questions/0/options/2 | 執行長正解長度裁示修正 | "公司搬家" | "公司搬到新大樓" |
| b2-u09-l06 | items/12/stemEn | 第③關 FIX3 | "Regular cleaning and checks are ____ measures that keep your car running well." | "To avoid fires, the company put ____ rules in place, such as no cooking in the office." |
| b2-u09-l06 | items/12/stemZh | 第③關 FIX3 | "定期清潔和檢查是讓車子保持良好狀態的預防措施。" | "為了避免火災，公司訂了預防性的規定，例如辦公室裡不准煮東西。" |
| b2-u09-l06 | items/11/sentenceZh | 第②關 issue＋第③關 FIX4 | "警方正在調查一幅名畫失竊的事。" | "警方正在調查一幅名畫失蹤的事。" |
| b2-u09-l06 | items/14/passageEn | 第②關 issue | "For many years, the old harbor town was full of tourists. Then a series of setbacks hit: a new highway took visitors elsewhere, and a catastrophic storm damaged the main bridge. Local newspapers were full of talk of doom, and one writer called the empty shops a plague on the main street. But the disappearance of tourists became a catalyst for new ideas. Young people opened small cafes and art shops, and the town took preventive steps, such as repairing old buildings before they fell apart. Within five years, the number of visitors had risen dramatically." | "For many years, the old harbor town was full of tourists. Then a series of setbacks hit: a new highway took visitors elsewhere, and a catastrophic storm damaged the main bridge. Local newspapers were full of talk of doom, and one writer said empty shops were spreading like a plague along the main street. But the disappearance of tourists became a catalyst for new ideas. Young people opened small cafes and art shops, and the town took preventive steps, such as repairing old buildings before they fell apart. Within five years, the number of visitors had risen dramatically." |
| b2-u09-l06 | items/14/passageZh | 第②關 issue | "多年來，這個老港口小鎮總是擠滿遊客。後來接連遇到挫折：一條新公路把遊客帶往別處，一場極嚴重的暴風雨又毀損了主要的橋。地方報紙上滿是悲觀的末日言論，有位作者把那些空店面形容成主街上的瘟疫。不過，遊客的消失反而成了新點子的催化劑。年輕人開了小咖啡店和藝術商店，小鎮也採取預防措施，例如在老建築倒塌之前先整修。不到五年，遊客人數就大幅增加了。" | "多年來，這個老港口小鎮總是擠滿遊客。後來接連遇到挫折：一條新公路把遊客帶往別處，一場極嚴重的暴風雨又毀損了主要的橋。地方報紙上滿是悲觀的末日言論，有位作者說，空店面像瘟疫一樣在主街上蔓延。不過，遊客的消失反而成了新點子的催化劑。年輕人開了小咖啡店和藝術商店，小鎮也採取預防措施，例如在老建築倒塌之前先整修。不到五年，遊客人數就大幅增加了。" |
| b2-u09-l06 | items/9/options/0 | 執行長正解長度裁示修正 | "The bridge was never finished" | "The bridge was never finished in the end" |
| b2-u09-l06 | items/9/options/1 | 執行長正解長度裁示修正 | "It caused problems, but the work finished on time" | "It was a problem, but they finished on time" |
| b2-u09-l06 | items/9/options/2 | 執行長正解長度裁示修正 | "The builders stopped for a month" | "The builders stopped working for a whole month" |
| b2-u09-l06 | items/14/questions/0/options/1 | 執行長正解長度裁示修正 | "物價太高" | "鎮上的物價和房租變得太高" |
| b2-u09-l06 | items/14/questions/0/options/2 | 執行長正解長度裁示修正 | "海水受到汙染" | "港口的海水受到嚴重汙染" |
| b2-u09-l06 | items/14/questions/1/options/1 | 執行長正解長度裁示修正 | "居民全都搬走了" | "居民全都搬到大城市去了" |
| b2-u09-l06 | items/14/questions/1/options/2 | 執行長正解長度裁示修正 | "蓋了大型工廠" | "主街上新蓋了好幾座大型的工廠" |
| b2-u09-l06 | items/11/sentenceZh | 第②關 issue 結案 |  | 已修正：見本檔 resolvedAfterFinalReview 中 items/11 的 1 筆修正紀錄。 |
| b2-u09-l06 | items/14/passageEn | 第②關 issue 結案 |  | 已修正：見本檔 resolvedAfterFinalReview 中 items/14 的 6 筆修正紀錄。 |
| b2-u09-l06 | items/0/exampleEn | 情境對照表重判 | "The sudden disappearance of the bees worries local farmers." | "After the disappearance of the old market, the street became quiet." |
| b2-u09-l06 | items/0/exampleZh | 情境對照表重判 | "蜜蜂突然消失，讓當地農夫很擔心。" | "老市場消失之後，這條街變得很冷清。" |
| b2-u09-l06 | items/2/exampleEn | 情境對照表重判 | "The first night of the play was a complete catastrophe: the lights failed twice." | "Quick thinking by the pilot helped avoid a catastrophe." |
| b2-u09-l06 | items/2/exampleZh | 情境對照表重判 | "這齣戲的首演夜簡直是場災難：燈光故障了兩次。" | "機長臨機應變，避免了一場大災難。" |
| b2-u09-l06 | items/4/exampleEn | 情境對照表重判 | "Don't listen to all that talk of doom; things will get better." | "I had a sense of doom when I saw the exam questions." |
| b2-u09-l06 | items/4/exampleZh | 情境對照表重判 | "別聽那些末日般的悲觀言論，情況會好轉的。" | "一看到考題，我就有種大難臨頭的感覺。" |
| b2-u09-l06 | items/5/exampleEn | 情境對照表重判 | "A catastrophic computer failure stopped all the trains for a day." | "Our first attempt at baking bread was catastrophic: it was as hard as a rock." |
| b2-u09-l06 | items/5/exampleZh | 情境對照表重判 | "一次災難性的電腦故障，讓所有火車停駛了一整天。" | "我們第一次烤麵包的結果慘不忍睹：硬得像石頭一樣。" |
| b2-u09-l06 | items/6/exampleEn | 情境對照表重判 | "Checking the machines every month is a preventive step that saves money later." | "Wearing a helmet is a simple preventive measure for cyclists." |
| b2-u09-l06 | items/6/exampleZh | 情境對照表重判 | "每個月檢查機器是一種預防措施，之後能省下不少錢。" | "對騎單車的人來說，戴安全帽是簡單的預防措施。" |
| b2-u09-l06 | items/7/exampleEn | 情境對照表重判 | "In this experiment, heat acts as a catalyst for the chemical reaction." | "Without a catalyst, this reaction would take many hours." |
| b2-u09-l06 | items/7/exampleZh | 情境對照表重判 | "在這個實驗中，熱是化學反應的催化劑。" | "沒有催化劑的話，這個反應要花好幾個小時。" |
| b2-u09-l06 | items/9/options/1 | 執行長正解長度裁示修正 | "It was a problem, but they finished on time" | "It was a problem, but it ended on time" |
| b2-u09-l06 | items/9/options/3 | 執行長正解長度裁示修正 | "Nothing changed at all" | "The rain did not change anything at all" |
| b2-u09-l06 | items/14/questions/0/options/2 | 執行長正解長度裁示修正 | "港口的海水受到嚴重汙染" | "港口的海水被汙染" |
| b2-u09-l06 | items/14/questions/1/options/1 | 執行長正解長度裁示修正 | "居民全都搬到大城市去了" | "鎮上的居民全都搬到大城市去了" |
| b2-u09-l06 | items/14/questions/1/options/3 | 執行長正解長度裁示修正 | "港口被關閉了" | "港口被政府關閉了" |
| b2-u09-l07 | items/3/glossZh | 第③關 S15 | "不利條件；障礙" | "不利條件；障礙（指身心障礙屬舊式用語）" |
| b2-u09-l07 | items/9/options/0 | 執行長正解長度裁示修正 | "The office is closing early" | "The office is going to close early this evening" |
| b2-u09-l07 | items/9/options/1 | 執行長正解長度裁示修正 | "The client is visiting today" | "The client is coming to visit the office today" |
| b2-u09-l07 | items/14/questions/1/options/1 | 執行長正解長度裁示修正 | "把公司賣掉" | "把公司賣給一家大型茶廠" |
| b2-u09-l07 | items/14/questions/1/options/2 | 執行長正解長度裁示修正 | "把公司搬到國外" | "把公司和工廠搬到國外" |
| b2-u09-l07 | items/14/questions/0/options/1 | 執行長正解長度裁示修正 | "茶葉品質不好" | "茶葉的品質不夠好" |
| b2-u09-l07 | items/0/exampleEn | 情境對照表重判 | "Weeks of heavy rain could jeopardize this year's rice harvest." | "This year's rice harvest was jeopardized by weeks of heavy rain." |
| b2-u09-l07 | items/0/exampleZh | 情境對照表重判 | "連續幾週的大雨可能會危及今年的稻米收成。" | "今年的稻米收成因為連續幾週的大雨而陷入危險。" |
| b2-u09-l07 | items/3/exampleEn | 情境對照表重判 | "Being short can be a handicap for a basketball player." | "She overcame the handicap of a late start and still won the race." |
| b2-u09-l07 | items/3/exampleZh | 情境對照表重判 | "身高不高對籃球員來說可能是不利條件。" | "她克服了起步太慢的不利條件，最後還是贏了比賽。" |
| b2-u09-l07 | items/4/exampleEn | 情境對照表重判 | "News that the factory would close caused unrest in the small town." | "The third flight delay caused unrest in the crowded waiting area." |
| b2-u09-l07 | items/4/exampleZh | 情境對照表重判 | "工廠即將關閉的消息在小鎮引起了不安。" | "班機第三次延誤，讓擁擠的候機區騷動不安。" |
| b2-u09-l07 | items/5/exampleEn | 情境對照表重判 | "He was in a predicament: two important meetings were at the same time." | "My friend's advice helped me get out of a difficult predicament." |
| b2-u09-l07 | items/5/exampleZh | 情境對照表重判 | "他陷入困境：兩場重要的會議撞期了。" | "朋友的建議幫我擺脫了一個棘手的困境。" |
| b2-u09-l07 | items/6/exampleEn | 情境對照表重判 | "Her brother's success often overshadowed her own achievements." | "The singer's new album was overshadowed by news of his wedding." |
| b2-u09-l07 | items/6/exampleZh | 情境對照表重判 | "她哥哥的成就常常讓她自己的成就黯然失色。" | "那位歌手的新專輯被他結婚的新聞搶走了風采。" |
| b2-u09-l07 | items/6/exampleZh | 情境對照表重判提案修正 | "那位歌手的新專輯被他結婚的新聞搶走了風采。" | "那位歌手的新專輯，被他結婚的新聞蓋過了鋒頭。" |
| b2-u09-l07 | items/9/options/1 | 執行長正解長度裁示修正 | "The client is coming to visit the office today" | "The client is coming today" |
| b2-u09-l07 | items/14/questions/0/options/1 | 執行長正解長度裁示修正 | "茶葉的品質不夠好" | "茶葉品質差" |
| b2-u09-l07 | items/14/questions/1/options/2 | 執行長正解長度裁示修正 | "把公司和工廠搬到國外" | "把公司和工廠都搬到國外" |
| b2-u09-l07 | items/14/questions/1/options/0 | 執行長正解長度裁示修正 | "裁減員工" | "裁減一半的員工" |
| b2-u09-l08 | items/5/exampleEn | 第②關 issue | "Sugar crystallizes when the water in it dries up." | "Honey can crystallize in cold weather." |
| b2-u09-l08 | items/5/exampleZh | 第②關 issue | "糖水裡的水分乾掉後，糖就會結晶。" | "蜂蜜在冷天可能會結晶。" |
| b2-u09-l08 | items/14/questions/0/options/0 | 執行長正解長度裁示修正 | "已經有很多顧客" | "已經有很多顧客和店家支持" |
| b2-u09-l08 | items/14/questions/0/options/3 | 執行長正解長度裁示修正 | "有大公司投資" | "有大公司投資，還開了兩家店" |
| b2-u09-l08 | items/14/questions/1/options/0 | 執行長正解長度裁示修正 | "一次免費的宣傳" | "一次免費的電視宣傳機會" |
| b2-u09-l08 | items/14/questions/1/options/1 | 執行長正解長度裁示修正 | "她品牌的失敗" | "她品牌第一次的失敗" |
| b2-u09-l08 | items/5/exampleEn | 第②關 issue 結案 |  | 已修正：見本檔 resolvedAfterFinalReview 中 items/5 的 2 筆修正紀錄。 |
| b2-u09-l08 | items/2/exampleEn | 情境對照表重判 | "The long strike adversely affected the airline's profits." | "Some students' sleep is adversely affected by late-night phone use." |
| b2-u09-l08 | items/2/exampleZh | 情境對照表重判 | "長時間的罷工對航空公司的利潤造成不利影響。" | "有些學生的睡眠受到深夜滑手機的不利影響。" |
| b2-u09-l08 | items/3/exampleEn | 情境對照表重判 | "In the novel, a series of bad decisions leads to the downfall of a rich family." | "The story follows the rise and downfall of a young boxer." |
| b2-u09-l08 | items/3/exampleZh | 情境對照表重判 | "在那本小說裡，一連串錯誤的決定導致一個富有家族的沒落。" | "這個故事講述一位年輕拳擊手的崛起與沒落。" |
| b2-u09-l08 | items/6/exampleEn | 情境對照表重判 | "The decomposition of plastic takes hundreds of years." | "Heat speeds up the decomposition of this chemical." |
| b2-u09-l08 | items/6/exampleZh | 情境對照表重判 | "塑膠要好幾百年才能分解。" | "加熱會加快這種化學物質的分解。" |
| b2-u09-l08 | items/7/exampleEn | 情境對照表重判 | "With three goals already, the young player seemed unstoppable." | "The team went on an unstoppable run of ten wins in a row." |
| b2-u09-l08 | items/7/exampleZh | 情境對照表重判 | "已經進了三球，那位年輕球員似乎勢不可擋。" | "這支隊伍勢不可擋，連贏了十場。" |
| b2-u09-l08 | items/9/options/3 | 執行長正解長度裁示修正 | "They are not available yet" | "They are not out yet" |
| b2-u09-l08 | items/14/questions/0/options/2 | 執行長正解長度裁示修正 | "積蓄用光，還被兩家店拒絕" | "積蓄已經用光，還被兩家店拒絕" |
| b2-u09-l08 | items/14/questions/1/options/1 | 執行長正解長度裁示修正 | "她品牌第一次的失敗" | "品牌第一次的失敗" |
| b2-u09-l08 | items/14/questions/0/options/1 | 執行長正解長度裁示修正 | "有一大筆存款" | "銀行裡有一大筆存款" |
| b2-u10-l01 | items/6/glossZh | 第②關 issue | "智力的；知識分子" | "智力的；腦力的" |
| b2-u10-l01 | items/14/stemZh | 第②關 issue＋第③關 S16 | "作者用了非常生動的描述性語言，讓你幾乎能看見故事裡的地方。" | "作者用了非常有描述性的語言，讓你幾乎能看見故事裡的地方。" |
| b2-u10-l01 | items/5/exampleEn | 第②關 issue | "You can find the topic quickly by using the index at the back of the book." | "The price index rose for the third month in a row." |
| b2-u10-l01 | items/5/exampleZh | 第②關 issue | "用書後面的索引，就能很快找到那個主題。" | "物價指數連續第三個月上升。" |
| b2-u10-l01 | items/5/glossZh | 第②關 issue | "索引；指標" | "索引；指數；指標" |
| b2-u10-l01 | items/15/passageEn | 第②關 issue | "Irene, a data analyst at our company, was asked to write a comprehensive report on customer habits. Her first version was very descriptive, with long paragraphs about each shop. Her manager said it was essentially correct but far too long. In the second version, Irene created a simple index that ranked every shop by sales, and she gave a short verbal summary at the weekly meeting. Her manager praised one trait in particular: she can explain complex numbers in plain words. Irene enjoys the intellectual challenge of her work, and she hopes to lead her own team one day." | "Irene, a data analyst at our company, was asked to write a comprehensive report on customer habits. Her first version was very descriptive, with long paragraphs about each shop. Her manager said it was essentially correct but far too long. In the second version, Irene added an index so that readers could find each shop quickly, and she gave a short verbal summary at the weekly meeting. Her manager praised one trait in particular: she can explain complex numbers in plain words. Irene enjoys the intellectual challenge of her work, and she hopes to lead her own team one day." |
| b2-u10-l01 | items/15/passageZh | 第②關 issue | "Irene 是我們公司的資料分析師，她被要求寫一份關於顧客習慣的全面報告。她的第一版寫得非常詳細，每家店都有一大段描述。經理說內容基本上正確，但太長了。在第二版裡，Irene 做了一個簡單的指標，依業績替每家店排名，並在每週會議上做了簡短的口頭摘要。經理特別稱讚她的一項特質：她能用淺白的話解釋複雜的數字。Irene 很享受工作上的腦力挑戰，也希望有一天能帶領自己的團隊。" | "Irene 是我們公司的資料分析師，她被要求寫一份關於顧客習慣的全面報告。她的第一版寫得非常詳細，每家店都有一大段描述。經理說內容基本上正確，但太長了。在第二版裡，Irene 加了一個索引，讓讀者能很快找到每家店，並在每週會議上做了簡短的口頭摘要。經理特別稱讚她的一項特質：她能用淺白的話解釋複雜的數字。Irene 很享受工作上的腦力挑戰，也希望有一天能帶領自己的團隊。" |
| b2-u10-l01 | items/8/exampleEn | 第③關 FIX5 | "Red hair is a family trait in my wife's family." | "Red hair is a common trait in my wife's family." |
| b2-u10-l01 | items/8/exampleZh | 第③關 FIX5 | "紅頭髮是我太太家族的遺傳特徵。" | "紅頭髮是我太太家族常見的特徵。" |
| b2-u10-l01 | items/16/promptZh | 第③關 S16 | "我認為這份報告基本上是正確的。" | "這份工作基本上就是回覆顧客的電子郵件。" |
| b2-u10-l01 | items/16/referenceEn | 第③關 S16 | ["I think this report is essentially correct.","In my opinion, the report is essentially right."] | ["This job is essentially answering customers' emails.","Essentially, this job is about replying to customer emails."] |
| b2-u10-l01 | items/16/rubricZh | 第③關 S16 | ["essentially 表示「基本上」，放在形容詞前或句首（例如 essentially correct、Essentially, …）","「我認為」可寫 I think、In my opinion 等"] | ["essentially 表示「基本上」（例如 is essentially…、Essentially, …）","「回覆」可寫 answer、reply to 等；時態合理即可"] |
| b2-u10-l01 | items/10/options/2 | 執行長正解長度裁示修正 | "It is more colorful" | "It is more colorful and fun to use" |
| b2-u10-l01 | items/10/options/3 | 執行長正解長度裁示修正 | "It is free for everyone" | "It is free for everyone to use" |
| b2-u10-l01 | items/15/questions/0/options/0 | 執行長正解長度裁示修正 | "數字都算錯了" | "數字都算錯了，要全部重寫" |
| b2-u10-l01 | items/15/questions/0/options/2 | 執行長正解長度裁示修正 | "寫得太短" | "寫得太短，內容不夠" |
| b2-u10-l01 | items/15/questions/1/options/1 | 執行長正解長度裁示修正 | "打字很快" | "打字很快，報告總是提早幾天交出" |
| b2-u10-l01 | items/15/questions/1/options/2 | 執行長正解長度裁示修正 | "非常準時" | "做事非常準時，開會從不遲到" |
| b2-u10-l01 | items/6/glossZh | 第②關 issue 結案 |  | 已修正：見本檔 resolvedAfterFinalReview 中 items/6 的 1 筆修正紀錄。 |
| b2-u10-l01 | items/14/stemZh | 第②關 issue 結案 |  | 已修正：見本檔 resolvedAfterFinalReview 中 items/14 的 1 筆修正紀錄。 |
| b2-u10-l01 | items/15/passageEn | 第②關 issue 結案 |  | 已修正：見本檔 resolvedAfterFinalReview 中 items/15 的 6 筆修正紀錄。 |
| b2-u10-l01 | items/11/sentenceEn | 第③關 S21 | "The two companies made a verbal agreement before signing the contract." | "Some people remember verbal instructions better than written ones." |
| b2-u10-l01 | items/11/sentenceZh | 第③關 S21 | "兩家公司在簽約前先達成了口頭協議。" | "有些人比較記得住口頭指示，而不是書面指示。" |
| b2-u10-l01 | items/3/exampleEn | 情境對照表重判 | "My cousin works as a financial analyst in a bank." | "The analyst predicted that house prices would fall next year." |
| b2-u10-l01 | items/3/exampleZh | 情境對照表重判 | "我表哥在銀行擔任財務分析師。" | "那位分析師預測明年房價會下跌。" |
| b2-u10-l01 | items/4/exampleEn | 情境對照表重判 | "The two phones are essentially the same, except for the color." | "The new rules essentially ban phones in class." |
| b2-u10-l01 | items/4/exampleZh | 情境對照表重判 | "這兩支手機基本上一樣，只有顏色不同。" | "新規定基本上就是禁止在課堂上使用手機。" |
| b2-u10-l01 | items/8/exampleEn | 情境對照表重判 | "Red hair is a common trait in my wife's family." | "This dog breed is known for traits such as loyalty and calmness." |
| b2-u10-l01 | items/8/exampleZh | 情境對照表重判 | "紅頭髮是我太太家族常見的特徵。" | "這個品種的狗以忠誠、沉穩等特質聞名。" |
| b2-u10-l01 | items/10/options/3 | 執行長正解長度裁示修正 | "It is free for everyone to use" | "It is free for everyone" |
| b2-u10-l01 | items/15/questions/1/options/0 | 執行長正解長度裁示修正 | "很會畫圖" | "報告裡的圖表都畫得很漂亮" |
| b2-u10-l01 | items/15/questions/1/options/3 | 執行長正解長度裁示修正 | "能用淺白的話解釋複雜的數字" | "能用白話解釋複雜的數字" |
| b2-u10-l01 | items/10/options/1 | 執行長正解長度裁示修正 | "It is cheaper" | "It is much cheaper" |
| b2-u10-l01 | items/15/questions/0/options/1 | 執行長正解長度裁示修正 | "完全錯誤" | "內容完全錯誤" |
| b2-u10-l01 | items/15/questions/1/options/0 | 執行長正解長度裁示修正 | "報告裡的圖表都畫得很漂亮" | "很會用英文寫正式的書信" |
| b2-u10-l02 | items/3/exampleEn | 第②關 issue＋第③關 FIX6 | "The earth's axis is not perfectly straight; it leans a little." | "The earth turns on its axis once a day." |
| b2-u10-l02 | items/3/exampleZh | 第②關 issue＋第③關 FIX6 | "地球的自轉軸不是完全直的，而是有點傾斜。" | "地球每天繞著自轉軸轉一圈。" |
| b2-u10-l02 | items/2/glossZh | 第②關 issue＋第③關 S14 | "意象；比喻" | "意象；形象化的描寫" |
| b2-u10-l02 | items/2/exampleZh | 第②關 issue | "廣告常用強烈的意象讓人產生購買的慾望。" | "廣告常用強烈的影像，讓人產生購買的慾望。" |
| b2-u10-l02 | items/15/passageZh | 第②關 issue＋第③關 S14 | "Lena 正在寫論文，主題是一位研究城市如何成長的知名理論家。她的教授要她在動筆之前，先用一句話精確地說出她的主要想法。Lena 覺得這很難，因為那位理論家的書裡充滿複雜的方程式和豐富的比喻。她決定先把城市清楚地分成三類。她也畫了一張圖表，一個軸是時間，另一個軸是人口。她的教授因為給的建議總是很沉穩，學生都叫他「智者」，他說 Lena 的工作態度非常好。" | "Lena 正在寫論文，主題是一位研究城市如何成長的知名理論家。她的教授要她在動筆之前，先用一句話精確地說出她的主要想法。Lena 覺得這很難，因為那位理論家的書裡充滿複雜的方程式和豐富的意象。她決定先把城市清楚地分成三類。她也畫了一張圖表，一個軸是時間，另一個軸是人口。她的教授因為給的建議總是很沉穩，學生都叫他「智者」，他說 Lena 的工作態度非常好。" |
| b2-u10-l02 | items/10/options/0 | 執行長正解長度裁示修正 | "Give a test" | "Give a short test to the class" |
| b2-u10-l02 | items/10/options/3 | 執行長正解長度裁示修正 | "Hand out books" | "Hand out new books to everyone" |
| b2-u10-l02 | items/15/questions/0/options/1 | 執行長正解長度裁示修正 | "讀完所有的書" | "先讀完那位理論家寫過的所有書" |
| b2-u10-l02 | items/15/questions/0/options/3 | 執行長正解長度裁示修正 | "訪問城市居民" | "訪問城市居民並記下想法" |
| b2-u10-l02 | items/15/questions/1/options/0 | 執行長正解長度裁示修正 | "年份和收入" | "年份和家庭收入" |
| b2-u10-l02 | items/3/exampleEn | 第②關 issue 結案 |  | 已修正：見本檔 resolvedAfterFinalReview 中 items/3 的 2 筆修正紀錄。 |
| b2-u10-l02 | items/2/glossZh | 第②關 issue 結案 |  | 已修正：見本檔 resolvedAfterFinalReview 中 items/2 的 2 筆修正紀錄。 |
| b2-u10-l02 | items/2/exampleZh | 第②關 issue 結案 |  | 已修正：見本檔 resolvedAfterFinalReview 中 items/2 的 2 筆修正紀錄。 |
| b2-u10-l02 | items/1/exampleEn | 情境對照表重判 | "The new manager articulated her plans for the year at the first meeting." | "The report clearly articulates why the bus routes need to change." |
| b2-u10-l02 | items/1/exampleZh | 情境對照表重判 | "新經理在第一次會議上清楚說出她今年的計畫。" | "這份報告清楚表達出公車路線需要調整的原因。" |
| b2-u10-l02 | items/2/exampleEn | 情境對照表重判 | "Advertising often uses powerful imagery to make people want things." | "The imagery in this poem reminds me of my childhood summers." |
| b2-u10-l02 | items/2/exampleZh | 情境對照表重判 | "廣告常用強烈的影像，讓人產生購買的慾望。" | "這首詩裡的意象讓我想起小時候的夏天。" |
| b2-u10-l02 | items/4/exampleEn | 情境對照表重判 | "The classification of animals into groups began long ago." | "This plant's classification is still a topic of debate among scientists." |
| b2-u10-l02 | items/4/exampleZh | 情境對照表重判 | "把動物分門別類的工作很早就開始了。" | "這種植物該怎麼分類，科學家至今仍有爭論。" |
| b2-u10-l02 | items/8/exampleEn | 情境對照表重判 | "People came from far away to ask the old sage for advice." | "In the old story, a sage lived alone on top of a mountain." |
| b2-u10-l02 | items/8/exampleZh | 情境對照表重判 | "人們從遠方來，向那位老智者請教。" | "在那個古老的故事裡，一位智者獨自住在山頂上。" |
| b2-u10-l02 | items/2/exampleEn | 情境對照表重判 | "The imagery in this poem reminds me of my childhood summers." | "The film's dark imagery stayed in my mind for days." |
| b2-u10-l02 | items/2/exampleZh | 情境對照表重判 | "這首詩裡的意象讓我想起小時候的夏天。" | "這部電影陰暗的影像在我腦中縈繞了好幾天。" |
| b2-u10-l02 | items/10/options/3 | 執行長正解長度裁示修正 | "Hand out new books to everyone" | "Hand out new books" |
| b2-u10-l02 | items/15/questions/0/options/1 | 執行長正解長度裁示修正 | "先讀完那位理論家寫過的所有書" | "先讀完理論家所有的書" |
| b2-u10-l02 | items/15/questions/1/options/3 | 執行長正解長度裁示修正 | "時間和人口" | "時間和城市的人口" |
| b2-u10-l03 | items/15/rubricZh/0 | 第③關 S17 | "personification 是不可數名詞（例如 a lot of personification）" | "personification 常當不可數名詞（例如 a lot of personification、many examples of personification）" |
| b2-u10-l03 | items/15/rubricZh/0 | 第③關 S17 | "personification 常當不可數名詞（例如 a lot of personification、many examples of personification）" | "personification 常不可數（例如 a lot of personification）；寫 examples of… 也可" |
| b2-u10-l03 | items/9/options/1 | 執行長正解長度裁示修正 | "Check the spelling" | "Check the spelling of every word" |
| b2-u10-l03 | items/9/options/3 | 執行長正解長度裁示修正 | "Print two copies" | "Print two copies for the class" |
| b2-u10-l03 | items/14/questions/1/options/1 | 執行長正解長度裁示修正 | "用電子郵件" | "用電子郵件寄送" |
| b2-u10-l03 | items/14/questions/1/options/2 | 執行長正解長度裁示修正 | "寫在作業上" | "寫在每份作業上" |
| b2-u10-l03 | items/14/questions/0/options/3 | 執行長正解長度裁示修正 | "一位嚴格的老師" | "一位很嚴格的老師" |
| b2-u10-l03 | items/0/exampleEn | 情境對照表重判 | "My father reads a short news digest every morning." | "The teacher gave us a digest of the main points from last week." |
| b2-u10-l03 | items/0/exampleZh | 情境對照表重判 | "我爸每天早上看一份簡短的新聞摘要。" | "老師給了我們一份上週重點的摘要。" |
| b2-u10-l03 | items/3/exampleEn | 情境對照表重判 | "Some children find it easier to express themselves verbally than in writing." | "The referee warned the player verbally before giving him a yellow card." |
| b2-u10-l03 | items/3/exampleZh | 情境對照表重判 | "有些孩子覺得用說的比用寫的更容易表達自己。" | "裁判先口頭警告那名球員，之後才給他黃牌。" |
| b2-u10-l03 | items/4/exampleEn | 情境對照表重判 | "In many stories, the moon is personified as a kind old woman." | "My son likes to personify his toys and talks to them like friends." |
| b2-u10-l03 | items/4/exampleZh | 情境對照表重判 | "在許多故事裡，月亮被擬人化成一位慈祥的老婦人。" | "我兒子喜歡把玩具擬人化，像跟朋友一樣和它們說話。" |
| b2-u10-l03 | items/5/exampleEn | 情境對照表重判 | "The categorization of books by color looks nice but is not practical." | "This program helps with the categorization of your photos by date." |
| b2-u10-l03 | items/5/exampleZh | 情境對照表重判 | "把書依顏色分類看起來漂亮，但不實用。" | "這個程式可以幫你把照片依日期分類。" |
| b2-u10-l03 | items/6/exampleEn | 情境對照表重判 | "The ad's claim that the soap lasts forever is pure hyperbole." | "Don't take his words too seriously; he loves hyperbole." |
| b2-u10-l03 | items/6/exampleZh | 情境對照表重判 | "廣告說這塊肥皂永遠用不完，根本是誇大其詞。" | "別把他的話太當真，他就是愛誇大其詞。" |
| b2-u10-l03 | items/6/exampleEn | 情境對照表重判 | "Don't take his words too seriously; he loves hyperbole." | "Hyperbole can make a speech funnier, but too much of it sounds false." |
| b2-u10-l03 | items/6/exampleZh | 情境對照表重判 | "別把他的話太當真，他就是愛誇大其詞。" | "誇飾能讓演講更有趣，但用太多聽起來就很假。" |
| b2-u10-l03 | items/9/options/0 | 執行長正解長度裁示修正 | "Add a footnote for each number" | "Add a footnote for each number you quote" |
| b2-u10-l03 | items/14/questions/0/options/1 | 執行長正解長度裁示修正 | "一個疲倦的巨人" | "一個疲倦不堪的巨人" |
| b2-u10-l04 | items/4/exampleEn | 情境對照表重判 | "Scholasticism was a way of thinking in European universities long ago." | "Scholasticism tried to bring faith and reason together." |
| b2-u10-l04 | items/4/exampleZh | 情境對照表重判 | "經院哲學是很久以前歐洲大學裡的一種思考方式。" | "經院哲學試圖結合信仰與理性。" |
| b2-u10-l04 | items/9/options/0 | 執行長正解長度裁示修正 | "Weigh the cups" | "Weigh three cups of water" |
| b2-u10-l04 | items/9/options/3 | 執行長正解長度裁示修正 | "Count the bottles" | "Count the empty bottles" |
| b2-u10-l04 | items/14/questions/0/options/0 | 執行長正解長度裁示修正 | "畫一張圖" | "在黑板上畫一張圖" |
| b2-u10-l04 | items/14/questions/0/options/3 | 執行長正解長度裁示修正 | "帶學生去博物館" | "帶學生去科學博物館" |
| b2-u10-l04 | items/14/questions/1/options/2 | 執行長正解長度裁示修正 | "英文歌曲" | "最新流行的英文歌曲" |
| b2-u10-l04 | items/14/questions/1/options/3 | 執行長正解長度裁示修正 | "寫信的格式" | "正式寫信的格式" |
| b2-u10-l04 | items/0/exampleEn | 情境對照表重判 | "This map is a simplification, so it does not show every street." | "The simplification of the online form has saved users a lot of time." |
| b2-u10-l04 | items/0/exampleZh | 情境對照表重判 | "這張地圖是簡化版，所以沒有標出每一條街。" | "線上表單簡化後，替使用者省下了很多時間。" |
| b2-u10-l04 | items/1/exampleEn | 情境對照表重判 | "Pi is a number that is a little more than three." | "The symbol for pi looks a little like a small table." |
| b2-u10-l04 | items/1/exampleZh | 情境對照表重判 | "圓周率是一個比三大一點的數。" | "圓周率的符號看起來有點像一張小桌子。" |
| b2-u10-l04 | items/3/exampleEn | 情境對照表重判 | "My teacher was so pedantic that she checked every comma." | "Our pedantic tour guide corrected every date we got wrong." |
| b2-u10-l04 | items/3/exampleZh | 情境對照表重判 | "我的老師非常吹毛求疵，連每個逗號都要檢查。" | "我們那位吹毛求疵的導遊，把我們說錯的每個日期都糾正了。" |
| b2-u10-l04 | items/9/options/1 | 執行長正解長度裁示修正 | "Make new drinks" | "Make new kinds of drinks" |
| b2-u10-l04 | items/14/questions/0/options/1 | 執行長正解長度裁示修正 | "播放一段影片" | "播放一段科學影片" |
| b2-u10-l04 | items/14/questions/0/options/2 | 執行長正解長度裁示修正 | "從窗戶丟下兩顆球" | "從窗口丟兩顆球" |
| b2-u10-l04 | items/14/questions/1/options/3 | 執行長正解長度裁示修正 | "正式寫信的格式" | "寫信的格式" |
| b2-u10-l04 | items/14/questions/0/options/2 | 執行長正解長度裁示修正 | "從窗口丟兩顆球" | "從樓上丟兩顆球" |
| b2-u11-l01 | items/5/exampleEn | 第②關 issue＋第③關 S3 | "The adoption of the new software took several months." | "Adoption can take years, so many couples wait a long time." |
| b2-u11-l01 | items/5/exampleZh | 第②關 issue＋第③關 S3 | "公司花了好幾個月才採用新軟體。" | "收養可能要花好幾年，所以很多夫妻要等很久。" |
| b2-u11-l01 | items/1/exampleZh | 第②關 issue | "飯店的房務主管會在客人入住前檢查每個房間。" | "飯店的房務人員會在客人入住前檢查每個房間。" |
| b2-u11-l01 | items/14/passageEn | 第②關 issue | "My grandparents' engagement lasted three years because they were saving for a house. After they married, my grandmother worked as a housekeeper for a rich family that still had several servants. When my mother was an infant, my grandparents also decided on the adoption of a little boy from a relative's family: my uncle Tom. Some neighbors were reluctant to accept the idea at first, but my grandparents raised both children with love. My uncle says his school mates never treated him differently. Today, many of my peers find it hard to believe that my grandparents never even considered divorce in sixty years." | "My grandparents' engagement lasted three years because they were saving for a house. After they married, my grandmother worked as a housekeeper for a rich family that still had several servants. When my mother was an infant, my grandparents also decided to adopt a little boy from a relative's family: my uncle Tom. Some neighbors were reluctant to accept the idea at first, but my grandparents raised both children with love. My uncle says his school mates never treated him differently. Today, many of my peers find it hard to believe that my grandparents never even considered divorce in sixty years." |
| b2-u11-l01 | items/14/questions/0/options/1 | 執行長正解長度裁示修正 | "家人反對" | "雙方的家人都反對" |
| b2-u11-l01 | items/14/questions/0/options/2 | 執行長正解長度裁示修正 | "祖父在國外工作" | "祖父在國外工作賺錢" |
| b2-u11-l01 | items/14/questions/1/options/1 | 執行長正解長度裁示修正 | "常常取笑他" | "常常拿他的身世取笑他" |
| b2-u11-l01 | items/14/questions/1/options/2 | 執行長正解長度裁示修正 | "不跟他說話" | "有些人從不跟他說話" |
| b2-u11-l01 | items/5/exampleZh | 第②關 issue 結案 |  | 已修正：見本檔 resolvedAfterFinalReview 中 items/5 的 2 筆修正紀錄。 |
| b2-u11-l01 | items/1/exampleZh | 第②關 issue 結案 |  | 已修正：見本檔 resolvedAfterFinalReview 中 items/1 的 1 筆修正紀錄。 |
| b2-u11-l01 | items/14/passageEn | 第②關 issue 結案 |  | 已修正：見本檔 resolvedAfterFinalReview 中 items/14 的 5 筆修正紀錄。 |
| b2-u11-l01 | items/5/exampleEn | 情境對照表重判 | "Adoption can take years, so many couples wait a long time." | "The animal shelter holds an adoption day every Saturday." |
| b2-u11-l01 | items/5/exampleZh | 情境對照表重判 | "收養可能要花好幾年，所以很多夫妻要等很久。" | "動物收容所每週六都會舉辦領養日。" |
| b2-u11-l01 | items/9/options/0 | 執行長正解長度裁示修正 | "A driver" | "A driver for the family" |
| b2-u11-l01 | items/9/options/1 | 執行長正解長度裁示修正 | "Someone to cook and clean" | "A cook and cleaner" |
| b2-u11-l01 | items/9/options/2 | 執行長正解長度裁示修正 | "A gardener" | "A gardener for the house" |
| b2-u11-l01 | items/14/questions/0/options/1 | 執行長正解長度裁示修正 | "雙方的家人都反對" | "雙方家人反對" |
| b2-u11-l01 | items/14/questions/1/options/3 | 執行長正解長度裁示修正 | "從來沒有不同的眼光" | "從來沒有用不同的眼光看他" |
| b2-u11-l02 | items/10/sentenceEn | 第③關 FIX7 | "Many kinds of birds inhabit the forest near our house." | "Three generations of my family have inhabited this old house." |
| b2-u11-l02 | items/10/sentenceZh | 第③關 FIX7 | "我們家附近的森林裡住著許多種鳥類。" | "我們家三代人都住過這棟老房子。" |
| b2-u11-l02 | items/0/exampleEn | 第③關 S18 | "Only a few intimate friends were invited to the wedding." | "We had an intimate dinner with just our closest family." |
| b2-u11-l02 | items/0/exampleZh | 第③關 S18 | "婚禮只邀請了幾位親密的朋友。" | "我們只和最親近的家人吃了一頓溫馨的私人晚餐。" |
| b2-u11-l02 | items/9/options/0 | 執行長正解長度裁示修正 | "Clean the streets" | "Clean the streets of the village" |
| b2-u11-l02 | items/9/options/2 | 執行長正解長度裁示修正 | "Go to the city" | "Go to the city to buy food" |
| b2-u11-l02 | items/14/questions/0/options/2 | 執行長正解長度裁示修正 | "覺得很害怕" | "覺得村民讓人害怕" |
| b2-u11-l02 | items/14/questions/0/options/3 | 執行長正解長度裁示修正 | "覺得很無聊" | "覺得山上生活很無聊" |
| b2-u11-l02 | items/14/questions/1/options/1 | 執行長正解長度裁示修正 | "一間新工廠" | "山腳下新蓋的一間大工廠" |
| b2-u11-l02 | items/14/questions/1/options/2 | 執行長正解長度裁示修正 | "一家大飯店" | "村口的一家大型飯店" |
| b2-u11-l02 | items/3/exampleEn | 情境對照表重判 | "The house belongs to a widow who lives alone with her cat." | "The widow joined a hiking club and made many new friends." |
| b2-u11-l02 | items/3/exampleZh | 情境對照表重判 | "這棟房子屬於一位和她的貓獨居的寡婦。" | "那位寡婦參加了登山社，交到很多新朋友。" |
| b2-u11-l02 | items/4/exampleEn | 情境對照表重判 | "The new fashion trend has many followers among teenagers." | "As a loyal follower of the team, he has never missed a home game." |
| b2-u11-l02 | items/4/exampleZh | 情境對照表重判 | "這股新時尚潮流在青少年中有很多追隨者。" | "身為這支球隊的忠實追隨者，他從沒錯過任何一場主場比賽。" |
| b2-u11-l02 | items/5/exampleEn | 情境對照表重判 | "We leave our son at the nursery while we are at work." | "The company opened a nursery so staff can bring their babies to work." |
| b2-u11-l02 | items/5/exampleZh | 情境對照表重判 | "我們上班時，會把兒子送到托兒所。" | "公司設了一間托兒所，讓員工可以帶寶寶來上班。" |
| b2-u11-l02 | items/7/exampleEn | 情境對照表重判 | "The villagers welcomed us with tea and cake." | "The villagers built the small bridge together with their own hands." |
| b2-u11-l02 | items/7/exampleZh | 情境對照表重判 | "村民用茶和蛋糕歡迎我們。" | "村民們齊心協力，親手蓋了這座小橋。" |
| b2-u11-l02 | items/9/options/0 | 執行長正解長度裁示修正 | "Clean the streets of the village" | "Clean the streets" |
| b2-u11-l02 | items/14/questions/0/options/0 | 執行長正解長度裁示修正 | "覺得非常自在" | "覺得一切都很自在" |
| b2-u11-l02 | items/14/questions/0/options/1 | 執行長正解長度裁示修正 | "覺得自己像個外人" | "覺得像個外人" |
| b2-u11-l02 | items/14/questions/1/options/1 | 執行長正解長度裁示修正 | "山腳下新蓋的一間大工廠" | "山腳下的一間大工廠" |
| b2-u11-l02 | items/14/questions/1/options/3 | 執行長正解長度裁示修正 | "一座新橋" | "河上的一座新橋" |
| b2-u11-l03 | items/11/sentenceEn | 第③關 FIX8 | "Come here, darling, and help me carry these bags." | "Madame Dubois teaches French at the language school near my office." |
| b2-u11-l03 | items/11/sentenceZh | 第③關 FIX8 | "親愛的，過來幫我提這些袋子。" | "Dubois 女士在我辦公室附近的語言學校教法文。" |
| b2-u11-l03 | items/12/stemEn | 第③關 FIX9 | "My ____ and I share the kitchen, so we take turns cleaning it." | "My ____ is from Canada, so we often speak English at home." |
| b2-u11-l03 | items/12/stemZh | 第③關 FIX9 | "我和室友共用廚房，所以我們輪流打掃。" | "我的室友是加拿大人，所以我們在家常講英文。" |
| b2-u11-l03 | properNouns | 第③關 FIX8、FIX9（專有名詞同步） | ["Laurent","French","Martin","Paula"] | ["Laurent","French","Martin","Paula","Dubois","Canada","English"] |
| b2-u11-l03 | items/6/exampleEn | 第③關 S3 | "The breakup of the company into three smaller firms surprised everyone." | "Their breakup was friendly, and they still have lunch together sometimes." |
| b2-u11-l03 | items/6/exampleZh | 第③關 S3 | "公司被拆分成三家小公司，讓大家都很驚訝。" | "他們和平分手，現在偶爾還會一起吃午餐。" |
| b2-u11-l03 | items/14/questions/0/options/1 | 執行長正解長度裁示修正 | "作者工作太忙" | "作者每天工作太忙，很晚才回家" |
| b2-u11-l03 | items/14/questions/0/options/3 | 執行長正解長度裁示修正 | "Paula 常常出差" | "Paula 常常出差，很少待在那間公寓裡" |
| b2-u11-l03 | items/14/questions/1/options/1 | 執行長正解長度裁示修正 | "住在城市太貴了" | "住在城市的開銷實在太貴了" |
| b2-u11-l03 | items/14/questions/1/options/2 | 執行長正解長度裁示修正 | "不該跟別人合租" | "以後最好不要再跟別人合租房子" |
| b2-u11-l03 | items/4/exampleEn | 情境對照表重判 | "The workshop teaches interpersonal communication to new managers." | "Good interpersonal relationships make school life much happier." |
| b2-u11-l03 | items/4/exampleZh | 情境對照表重判 | "這場研習會教新任經理人際溝通。" | "良好的人際關係會讓學校生活快樂得多。" |
| b2-u11-l03 | items/5/exampleEn | 情境對照表重判 | "Madame Laurent owns the small French bakery on our street." | "'Madame, may I carry your bags?' asked the young driver." |
| b2-u11-l03 | items/5/exampleZh | 情境對照表重判 | "Laurent 夫人在我們這條街上開了一家法式小麵包店。" | "年輕的司機問：「夫人，我可以幫您提行李嗎？」" |
| b2-u11-l03 | items/6/exampleEn | 情境對照表重判 | "Their breakup was friendly, and they still have lunch together sometimes." | "Many pop songs are about the pain of a breakup." |
| b2-u11-l03 | items/6/exampleZh | 情境對照表重判 | "他們和平分手，現在偶爾還會一起吃午餐。" | "很多流行歌都在唱分手的痛苦。" |
| b2-u11-l03 | items/9/options/3 | 執行長正解長度裁示修正 | "Her car is outside" | "Her car is waiting outside" |
| b2-u11-l03 | items/14/questions/0/options/3 | 執行長正解長度裁示修正 | "Paula 常常出差，很少待在那間公寓裡" | "Paula 常常出差不在家" |
| b2-u11-l03 | items/14/questions/1/options/2 | 執行長正解長度裁示修正 | "以後最好不要再跟別人合租房子" | "以後不要再跟別人合租" |
| b2-u11-l03 | items/14/questions/0/options/2 | 執行長正解長度裁示修正 | "她們吵過架" | "她們剛搬進去就吵過架" |
| b2-u11-l04 | items/12/stemEn | 第③關 FIX10 | "The new shop gave away free coffee to build ____ with its neighbors." | "After the argument, the two brothers shook hands to show their ____." |
| b2-u11-l04 | items/12/stemZh | 第③關 FIX10 | "新開的店請大家喝免費咖啡，和鄰居建立友好關係。" | "吵架之後，兩兄弟握手表示善意。" |
| b2-u11-l04 | items/13/stemEn | 第③關 FIX11 | "The couple plan to ____ next June in her hometown." | "She plans to ____ her college boyfriend this autumn." |
| b2-u11-l04 | items/13/stemZh | 第③關 FIX11 | "這對情侶打算明年六月在她的家鄉結婚。" | "她打算今年秋天和大學時的男朋友結婚。" |
| b2-u11-l04 | items/0/exampleEn | 第③關 S1（執行長裁示 | "My aunt was a housewife for twenty years before she opened a cafe." | "Being a housewife can be as busy as an office job." |
| b2-u11-l04 | items/0/exampleZh | 第③關 S1（執行長裁示 | "我阿姨當了二十年家庭主婦，後來開了一家咖啡店。" | "當家庭主婦可能和上班一樣忙。" |
| b2-u11-l04 | items/12/stemZh | 第③關 FIX10 | "吵架之後，兩兄弟握手表示善意。" | "吵架之後，兩兄弟握手，表達彼此的善意。" |
| b2-u11-l04 | items/14/questions/0/options/1 | 執行長正解長度裁示修正 | "經營一家生意很好的麵包店" | "經營一家麵包店" |
| b2-u11-l04 | items/14/questions/0/options/3 | 執行長正解長度裁示修正 | "修理腳踏車" | "開店修理腳踏車" |
| b2-u11-l04 | items/14/questions/0/options/2 | 執行長正解長度裁示修正 | "在學校教書" | "在附近的小學教書" |
| b2-u11-l04 | items/14/questions/0/options/3 | 執行長正解長度裁示修正 | "開店修理腳踏車" | "在附近的花店當店員" |
| b2-u11-l04 | items/1/exampleEn | 情境對照表重判 | "The company gave books to local schools as a sign of goodwill." | "The festival builds goodwill between the two towns." |
| b2-u11-l04 | items/1/exampleZh | 情境對照表重判 | "公司捐書給當地學校，以示善意。" | "這個節慶增進了兩個小鎮之間的友好情誼。" |
| b2-u11-l04 | items/2/exampleEn | 情境對照表重判 | "The teacher chose two helpers to hand out the papers." | "Volunteer helpers at the race handed water to the runners." |
| b2-u11-l04 | items/2/exampleZh | 情境對照表重判 | "老師選了兩個小幫手發考卷。" | "比賽中的志工幫手把水遞給跑者。" |
| b2-u11-l04 | items/4/exampleEn | 情境對照表重判 | "He is a caring father who reads to his kids every night." | "Nurses need to be caring as well as skilled." |
| b2-u11-l04 | items/4/exampleZh | 情境對照表重判 | "他是個體貼的父親，每晚都念故事給孩子聽。" | "護理師不但要技術好，也要有愛心。" |
| b2-u11-l04 | items/6/exampleEn | 情境對照表重判 | "She loved her old house dearly and never wanted to sell it." | "This dearly loved cartoon has been on TV for thirty years." |
| b2-u11-l04 | items/6/exampleZh | 情境對照表重判 | "她深愛她的老房子，從來不想把它賣掉。" | "這部深受喜愛的卡通已經在電視上播了三十年。" |
| b2-u11-l04 | items/9/options/3 | 執行長正解長度裁示修正 | "Go fishing" | "Go fishing together" |
| b2-u11-l04 | items/14/questions/0/options/2 | 執行長正解長度裁示修正 | "在附近的小學教書" | "在小學教書" |
| b2-u11-l04 | items/14/questions/1/options/0 | 執行長正解長度裁示修正 | "開車" | "開車技術" |
| b2-u11-l04 | items/14/questions/1/options/1 | 執行長正解長度裁示修正 | "煮飯" | "煮飯技巧" |
| b2-u11-l04 | items/14/questions/1/options/2 | 執行長正解長度裁示修正 | "耐心" | "有耐心" |
| b2-u11-l05 | items/0/exampleEn | 第②關 issue＋第③關 FIX12 | "The adopted plan will save the city a lot of money." | "Our adopted cat sleeps on my bed every night." |
| b2-u11-l05 | items/0/exampleZh | 第②關 issue＋第③關 FIX12 | "被採用的方案將為市政府省下一大筆錢。" | "我們領養的貓每晚都睡在我床上。" |
| b2-u11-l05 | items/0/glossZh | 第②關 issue＋第③關 FIX12 | "被收養的；被採用的" | "被收養的；被領養的" |
| b2-u11-l05 | items/0/distractorsZh | 第③關 FIX12 | ["被拒絕的","親生的","被延後的"] | ["被拒絕的","親生的","被賣掉的"] |
| b2-u11-l05 | items/10/sentenceEn | 第③關 FIX13 | "The old man spoke affectionately about his first car." | "My stepmother helped me choose my first suit for work." |
| b2-u11-l05 | items/10/sentenceZh | 第③關 FIX13 | "那位老先生深情地談起他的第一輛車。" | "我的繼母幫我挑了第一套上班穿的西裝。" |
| b2-u11-l05 | items/15/rubricZh/0 | 第②關 issue＋第③關 FIX14 | "inseparable 表示「形影不離、分不開的」，放在 be 動詞後" | "inseparable 表示「形影不離、分不開的」（例如 are always inseparable；寫 have become inseparable 也正確）" |
| b2-u11-l05 | items/14/passageEn | 第②關 issue＋第③關 S8 | "Mr. and Mrs. Wang have two children: a son and an adopted daughter from Vietnam. The children grew up as playmates and quickly became inseparable. Last year, the family traveled to their daughter's birthplace, a small village near the coast. The villagers were affectionate and welcomed the family warmly, and the daughter met several countrymen who still remembered her as a baby. Her brother, always thoughtful, took hundreds of photos for her. Now the whole family affectionately calls it the best trip ever." | "Mr. and Mrs. Wang have two children: a son and an adopted daughter from Vietnam. The children grew up as playmates and quickly became inseparable. Last year, the family traveled to their daughter's birthplace, a small village near the coast. The villagers were warm and friendly, and the daughter met several neighbors who still remembered her as a baby. Her brother, always thoughtful, took hundreds of photos for her. Now the whole family affectionately calls it the best trip ever." |
| b2-u11-l05 | items/14/passageEn | 第③關 S8 | "Mr. and Mrs. Wang have two children: a son and an adopted daughter from Vietnam. The children grew up as playmates and quickly became inseparable. Last year, the family traveled to their daughter's birthplace, a small village near the coast. The villagers were warm and friendly, and the daughter met several neighbors who still remembered her as a baby. Her brother, always thoughtful, took hundreds of photos for her. Now the whole family affectionately calls it the best trip ever." | "Mr. and Mrs. Wang have two children: a son and an adopted daughter from Vietnam. The children grew up as playmates and quickly became inseparable. Last year, the family traveled to their daughter's birthplace, a small village near the coast. The villagers were warm and friendly, and the daughter met several neighbors who still remembered her as a baby. Her brother, always thoughtful, took hundreds of photos for her. Now the family often talks affectionately about the trip." |
| b2-u11-l05 | items/14/passageZh | 第②關 issue | "王先生和王太太有兩個孩子：一個兒子，以及一個從越南收養的女兒。兩個孩子從小一起玩，很快就形影不離。去年，一家人去了女兒的出生地，一個靠近海邊的小村莊。村民都很熱情，溫暖地歡迎他們一家，女兒還遇到幾位仍記得她小時候模樣的同胞。她的哥哥總是很貼心，幫她拍了好幾百張照片。現在全家人都親暱地稱那趟旅行是有史以來最棒的旅行。" | "王先生和王太太有兩個孩子：一個兒子，以及一個從越南收養的女兒。兩個孩子從小一起玩，很快就形影不離。去年，一家人去了女兒的出生地，一個靠近海邊的小村莊。村民都很熱情友善，女兒還遇到幾位仍記得她小時候模樣的鄰居。她的哥哥總是很貼心，幫她拍了好幾百張照片。現在全家人都親暱地稱那趟旅行是有史以來最棒的旅行。" |
| b2-u11-l05 | items/14/passageZh | 第③關 S8 | "王先生和王太太有兩個孩子：一個兒子，以及一個從越南收養的女兒。兩個孩子從小一起玩，很快就形影不離。去年，一家人去了女兒的出生地，一個靠近海邊的小村莊。村民都很熱情友善，女兒還遇到幾位仍記得她小時候模樣的鄰居。她的哥哥總是很貼心，幫她拍了好幾百張照片。現在全家人都親暱地稱那趟旅行是有史以來最棒的旅行。" | "王先生和王太太有兩個孩子：一個兒子，以及一個從越南收養的女兒。兩個孩子從小一起玩，很快就形影不離。去年，一家人去了女兒的出生地，一個靠近海邊的小村莊。村民都很熱情友善，女兒還遇到幾位仍記得她小時候模樣的鄰居。她的哥哥總是很貼心，幫她拍了好幾百張照片。現在全家人常常充滿感情地聊起那趟旅行。" |
| b2-u11-l05 | items/5/exampleEn | 第③關 S1（執行長裁示 | "The two sisters have been inseparable since childhood." | "My grandparents are inseparable; they even go to the market together." |
| b2-u11-l05 | items/5/exampleZh | 第③關 S1（執行長裁示 | "這兩姊妹從小就形影不離。" | "我祖父母形影不離，連去市場都一起去。" |
| b2-u11-l05 | items/15/rubricZh/0 | 第③關 FIX14 | "inseparable 表示「形影不離、分不開的」（例如 are always inseparable；寫 have become inseparable 也正確）" | "inseparable 表示「形影不離」（例如 are always inseparable；have become inseparable 也正確）" |
| b2-u11-l05 | items/14/questions/0/options/2 | 執行長正解長度裁示修正 | "日本的大城市" | "日本靠海的一座繁忙大城市" |
| b2-u11-l05 | items/14/questions/0/options/3 | 執行長正解長度裁示修正 | "山上的小鎮" | "越南山上的一座小鎮" |
| b2-u11-l05 | items/14/questions/1/options/1 | 執行長正解長度裁示修正 | "學會了當地語言" | "跟村民學會了當地的語言" |
| b2-u11-l05 | items/14/questions/1/options/2 | 執行長正解長度裁示修正 | "買了很多紀念品" | "替全家買了很多當地紀念品" |
| b2-u11-l05 | items/0/exampleEn | 第②關 issue 結案 |  | 已修正：見本檔 resolvedAfterFinalReview 中 items/0 的 4 筆修正紀錄。 |
| b2-u11-l05 | items/14/passageEn | 第②關 issue 結案 |  | 已修正：見本檔 resolvedAfterFinalReview 中 items/14 的 8 筆修正紀錄。 |
| b2-u11-l05 | items/14/passageZh | 第②關 issue 結案 |  | 已修正：見本檔 resolvedAfterFinalReview 中 items/14 的 8 筆修正紀錄。 |
| b2-u11-l05 | items/15/rubricZh/0 | 第②關 issue 結案 |  | 已修正：見本檔 resolvedAfterFinalReview 中 items/15 的 2 筆修正紀錄。 |
| b2-u11-l05 | items/5/exampleEn | 情境對照表重判 | "My grandparents are inseparable; they even go to the market together." | "This old song is inseparable from my memories of summer camp." |
| b2-u11-l05 | items/5/exampleZh | 情境對照表重判 | "我祖父母形影不離，連去市場都一起去。" | "這首老歌和我對夏令營的回憶是分不開的。" |
| b2-u11-l05 | items/9/options/1 | 執行長正解長度裁示修正 | "Bake bread" | "Bake sweet bread" |
| b2-u11-l05 | items/9/options/2 | 執行長正解長度裁示修正 | "Make clothes" | "Make new clothes" |
| b2-u11-l05 | items/14/questions/0/options/0 | 執行長正解長度裁示修正 | "台北" | "台北市郊的一個小鎮" |
| b2-u11-l05 | items/14/questions/0/options/1 | 執行長正解長度裁示修正 | "越南海邊附近的小村莊" | "越南海邊的小村莊" |
| b2-u11-l05 | items/14/questions/1/options/1 | 執行長正解長度裁示修正 | "跟村民學會了當地的語言" | "跟村民學會了說當地的語言" |
| b2-u11-l06 | items/15/rubricZh/0 | 第②關 issue | "filial 是形容詞，常用 filial respect、filial love、filial duty" | "filial 是形容詞（例如 filial piety、filial respect、filial love、filial duty）" |
| b2-u11-l06 | items/6/exampleEn | 第③關 S19 | "In the old story, a filial daughter cooks every meal for her parents." | "In the old story, a filial son carries his father across the river." |
| b2-u11-l06 | items/6/exampleZh | 第③關 S19 | "在那個古老的故事裡，一個孝順的女兒為父母煮每一餐。" | "在那個古老的故事裡，一個孝順的兒子背著父親過河。" |
| b2-u11-l06 | items/3/exampleEn | 第③關 S1（執行長裁示 | "In the past, a bride's family often had to pay a dowry." | "Her grandmother's dowry included a wooden chest that the family still uses." |
| b2-u11-l06 | items/3/exampleZh | 第③關 S1（執行長裁示 | "過去，新娘的家人常常得準備嫁妝。" | "她奶奶的嫁妝裡有一個木箱，家人至今還在使用。" |
| b2-u11-l06 | items/9/options/1 | 執行長正解長度裁示修正 | "Her room is ready" | "Her room is ready now" |
| b2-u11-l06 | items/9/options/3 | 執行長正解長度裁示修正 | "The hotel is full" | "The hotel is full tonight" |
| b2-u11-l06 | items/14/questions/0/options/1 | 執行長正解長度裁示修正 | "很害羞" | "有點害羞內向" |
| b2-u11-l06 | items/14/questions/0/options/2 | 執行長正解長度裁示修正 | "很嚴肅" | "非常嚴肅" |
| b2-u11-l06 | items/14/questions/1/options/0 | 執行長正解長度裁示修正 | "出海捕魚" | "每天清晨一起出海捕魚" |
| b2-u11-l06 | items/14/questions/1/options/3 | 執行長正解長度裁示修正 | "搬到大城市" | "畢業後都搬到大城市去" |
| b2-u11-l06 | items/15/rubricZh/0 | 第②關 issue 結案 |  | 已修正：見本檔 resolvedAfterFinalReview 中 items/15 的 1 筆修正紀錄。 |
| b2-u11-l06 | items/3/exampleEn | 情境對照表重判 | "Her grandmother's dowry included a wooden chest that the family still uses." | "The old play is about a family that cannot afford a dowry for their daughter." |
| b2-u11-l06 | items/3/exampleZh | 情境對照表重判 | "她奶奶的嫁妝裡有一個木箱，家人至今還在使用。" | "這齣老戲講的是一戶人家付不起女兒嫁妝的故事。" |
| b2-u11-l06 | items/4/exampleEn | 情境對照表重判 | "He sent his wife a valentine with a red rose." | "This valentine was hidden in her old diary for twenty years." |
| b2-u11-l06 | items/4/exampleZh | 情境對照表重判 | "他寄給太太一張附上紅玫瑰的情人節卡片。" | "這張情人節卡片在她的舊日記裡藏了二十年。" |
| b2-u11-l06 | items/5/exampleEn | 情境對照表重判 | "Our new neighbor is very sociable and knows everyone on the street." | "Dolphins are sociable animals that travel in groups." |
| b2-u11-l06 | items/5/exampleZh | 情境對照表重判 | "我們的新鄰居很愛交朋友，認識這條街上的每個人。" | "海豚是合群的動物，總是成群結隊地移動。" |
| b2-u11-l06 | items/9/options/2 | 執行長正解長度裁示修正 | "Her bag is lost" | "Her bag is lost somewhere" |
| b2-u11-l06 | items/14/questions/0/options/0 | 執行長正解長度裁示修正 | "很愛交際" | "很喜歡和別人交際" |
| b2-u11-l06 | items/14/questions/1/options/3 | 執行長正解長度裁示修正 | "畢業後都搬到大城市去" | "畢業後搬到大城市" |
| b2-u11-l06 | items/14/questions/1/options/1 | 執行長正解長度裁示修正 | "準備嫁妝" | "替女兒準備嫁妝" |
| b2-u11-l06 | items/14/questions/1/options/1 | 執行長正解長度裁示修正 | "替女兒準備嫁妝" | "一起到廟裡拜拜" |
| b2-u11-l07 | items/3/glossZh | 第②關 issue | "居民；居住者" | "居民（少用，一般說 inhabitant）" |
| b2-u11-l07 | items/13/passageEn | 第②關 issue | "Every Chinese New Year, the Lin family has a big dinner. Grandma Lin's son-in-law cooks the fish, her daughter-in-law makes the rice cakes, and her sister-in-law brings dessert. The grown-ups talk at the big table, while the children play in the garden. Grandpa Lin is always punctual and makes everyone sit down at six. This year, Grandma's own mother-in-law, who is ninety-five, also came. She said the family reminded her of the habitants of her old village, where everyone shared their food." | "Every Chinese New Year, the Lin family has a big dinner. Grandma Lin's son-in-law cooks the fish, her daughter-in-law makes the rice cakes, and her sister-in-law, the wife of her older brother, brings dessert. The grown-ups talk at the big table, while the children play in the garden. Grandpa Lin is always punctual and makes everyone sit down at six. This year, Grandma's own mother-in-law, who is ninety-five, also came. She said the family reminded her of the habitants of her old village, where everyone shared their food." |
| b2-u11-l07 | items/13/passageZh | 第②關 issue | "每年過年，林家都會吃一頓豐盛的年夜飯。林奶奶的女婿負責煮魚，媳婦做年糕，她的小姑帶甜點來。大人們在大桌子旁聊天，孩子們在花園裡玩。林爺爺總是很準時，六點一到就要大家坐下。今年，林奶奶九十五歲的婆婆也來了。她說這一家人讓她想起從前村子裡的居民，那裡的人總是互相分享食物。" | "每年過年，林家都會吃一頓豐盛的年夜飯。林奶奶的女婿負責煮魚，媳婦做年糕，她的嫂嫂（她哥哥的太太）帶甜點來。大人們在大桌子旁聊天，孩子們在花園裡玩。林爺爺總是很準時，六點一到就要大家坐下。今年，林奶奶九十五歲的婆婆也來了。她說這一家人讓她想起從前村子裡的居民，那裡的人總是互相分享食物。" |
| b2-u11-l07 | items/1/exampleEn | 第③關 S21 | "My father-in-law taught me how to fish." | "My father-in-law still calls me every Sunday to ask about the kids." |
| b2-u11-l07 | items/1/exampleZh | 第③關 S21 | "我岳父教我釣魚。" | "我岳父每個星期天都還會打電話問孩子們的近況。" |
| b2-u11-l07 | items/3/glossZh | 第②關 issue | "居民（少用，一般說 inhabitant）" | "居民（少用，同 inhabitant）" |
| b2-u11-l07 | items/8/options/0 | 執行長正解長度裁示修正 | "It is his birthday" | "It is his birthday today" |
| b2-u11-l07 | items/8/options/2 | 執行長正解長度裁示修正 | "He is moving away" | "He is moving away soon" |
| b2-u11-l07 | items/13/questions/1/options/1 | 執行長正解長度裁示修正 | "她年輕時的工作" | "她年輕時在城裡一家餐廳做過的工作" |
| b2-u11-l07 | items/13/questions/1/options/2 | 執行長正解長度裁示修正 | "一部老電影" | "一部講大家庭過年的老電影" |
| b2-u11-l07 | items/13/questions/0/options/1 | 執行長正解長度裁示修正 | "林奶奶的媳婦" | "林奶奶家的媳婦" |
| b2-u11-l07 | items/3/exampleEn | 第②關 issue 結案 |  | 已修正：見本檔 resolvedAfterFinalReview 中 items/3 的 2 筆修正紀錄。 |
| b2-u11-l07 | items/13/passageZh | 第②關 issue 結案 |  | 已修正：見本檔 resolvedAfterFinalReview 中 items/13 的 5 筆修正紀錄。 |
| b2-u11-l07 | items/3/exampleEn | 情境對照表重判 | "The habitants of the valley grow rice and tea." | "Few habitants remain in the mountain town since the mine closed." |
| b2-u11-l07 | items/3/exampleZh | 情境對照表重判 | "山谷裡的居民種稻米和茶。" | "礦場關閉後，這個山城剩下的居民不多了。" |
| b2-u11-l07 | items/4/exampleEn | 情境對照表重判 | "Her mother-in-law visits every Sunday with a pot of soup." | "My mother-in-law gave us her old piano as a wedding gift." |
| b2-u11-l07 | items/4/exampleZh | 情境對照表重判 | "她的婆婆每個星期天都會帶一鍋湯來看她。" | "我婆婆把她的舊鋼琴送給我們當結婚禮物。" |
| b2-u11-l07 | items/6/exampleEn | 情境對照表重判 | "Mr. Chen's son-in-law helps run the family shop." | "At the wedding, the bride's father warmly welcomed his new son-in-law." |
| b2-u11-l07 | items/6/exampleZh | 情境對照表重判 | "陳先生的女婿幫忙經營家裡的店。" | "婚禮上，新娘的父親熱情地歡迎他的新女婿。" |
| b2-u11-l07 | items/8/options/2 | 執行長正解長度裁示修正 | "He is moving away soon" | "He is moving away next week" |
| b2-u11-l07 | items/13/questions/0/options/1 | 執行長正解長度裁示修正 | "林奶奶家的媳婦" | "林家媳婦" |
| b2-u11-l07 | items/13/questions/1/options/0 | 執行長正解長度裁示修正 | "她念過的學校" | "她小時候念過的學校" |
| b2-u12-l01 | items/0/exampleEn | 第②關 issue＋第③關 FIX15 | "In spite of the rain, the outdoor concert went on." | "He broke his sister's toy out of spite." |
| b2-u12-l01 | items/0/exampleZh | 第③關 FIX15 | "儘管下雨，戶外音樂會還是照常進行。" | "他出於惡意弄壞了妹妹的玩具。" |
| b2-u12-l01 | items/8/sentenceEn | 第③關 FIX15 | "He broke his sister's toy out of spite." | "In spite of the rain, the outdoor concert went on." |
| b2-u12-l01 | items/8/sentenceZh | 第③關 FIX15 | "他出於惡意弄壞了妹妹的玩具。" | "儘管下雨，戶外音樂會還是照常進行。" |
| b2-u12-l01 | items/6/exampleEn | 第③關 FIX16 | "The fans clapped enthusiastically at the end of the game." | "She talked enthusiastically about her new job at dinner." |
| b2-u12-l01 | items/6/exampleZh | 第③關 FIX16 | "比賽結束時，球迷們熱烈地鼓掌。" | "晚餐時，她熱切地談起她的新工作。" |
| b2-u12-l01 | items/14/passageZh | 第②關 issue | "我們團隊規劃週末旅行時，每個人的想法都不一樣。Kim 想要登山的刺激，Sam 則比較想在溫泉純粹放鬆。最後，大家選了一間湖邊小屋，兩種活動都能做。Sam 是我們辦公室最可靠的人，計畫一確定，他就把所有事情都訂好了。第一晚，Kim 講她小時候的故事，逗得大家很開心。湖邊小屋的主人待我們非常有禮，還送來新鮮水果。回家後，經理熱情地提議把這趟旅行變成每年的活動，幾個最愛交際的同事馬上贊成。" | "我們團隊規劃週末旅行時，每個人的想法都不一樣。Kim 想要登山的刺激，Sam 則比較想在溫泉純粹放鬆。最後，大家選了一間湖邊小屋，兩種活動都能做。Sam 是我們辦公室最可靠的人，計畫一確定，Sam 就把所有事情都訂好了。第一晚，Kim 講她小時候的故事，逗得大家很開心。湖邊小屋的主人待我們非常有禮，還送來新鮮水果。回家後，經理熱情地提議把這趟旅行變成每年的活動，幾個最愛交際的同事馬上贊成。" |
| b2-u12-l01 | items/3/exampleEn | 第③關 S1（執行長裁示 | "Many people listen to soft music for relaxation." | "The new park was designed for relaxation, with benches and quiet paths." |
| b2-u12-l01 | items/3/exampleZh | 第③關 S1（執行長裁示 | "很多人聽輕柔的音樂來放鬆。" | "新公園是為休閒放鬆而設計的，有長椅和安靜的小徑。" |
| b2-u12-l01 | items/5/exampleEn | 第③關 S1（執行長裁示 | "The magician amused the children with funny tricks." | "I was amused to see a cat riding on a dog's back." |
| b2-u12-l01 | items/5/exampleZh | 第③關 S1（執行長裁示 | "魔術師用有趣的把戲逗孩子們開心。" | "看到一隻貓騎在狗背上，我覺得很好笑。" |
| b2-u12-l01 | items/2/exampleEn | 情境對照表重判 | "Winning my first race was a great thrill." | "Opening a letter from an old friend still gives me a small thrill." |
| b2-u12-l01 | items/2/exampleZh | 情境對照表重判 | "贏得第一場比賽讓我非常興奮。" | "打開老朋友寄來的信，仍讓我有點小興奮。" |
| b2-u12-l01 | items/14/questions/1/options/0 | 執行長正解長度裁示修正 | "下次出國旅行" | "下次全團改去國外旅行一週" |
| b2-u12-l01 | items/14/questions/1/options/3 | 執行長正解長度裁示修正 | "換一個人負責規劃" | "下次換一個人負責規劃" |
| b2-u12-l01 | items/14/questions/0/options/3 | 執行長正解長度裁示修正 | "逛街購物" | "到市區逛街購物" |
| b2-u12-l01 | items/0/exampleEn | 第②關 issue 結案 |  | 已修正：見本檔 resolvedAfterFinalReview 中 items/0 的 2 筆修正紀錄。 |
| b2-u12-l01 | items/14/passageZh | 第②關 issue 結案 |  | 已修正：見本檔 resolvedAfterFinalReview 中 items/14 的 4 筆修正紀錄。 |
| b2-u12-l01 | items/5/exampleEn | 情境對照表重判 | "I was amused to see a cat riding on a dog's back." | "To amuse ourselves on the long train ride, we played word games." |
| b2-u12-l01 | items/5/exampleZh | 情境對照表重判 | "看到一隻貓騎在狗背上，我覺得很好笑。" | "為了在漫長的火車旅程中自娛，我們玩起了文字遊戲。" |
| b2-u12-l01 | items/9/options/0 | 執行長正解長度裁示修正 | "A free cake" | "A free piece of cake" |
| b2-u12-l01 | items/14/questions/0/options/0 | 執行長正解長度裁示修正 | "在溫泉放鬆" | "在溫泉放鬆一下" |
| b2-u12-l01 | items/14/questions/0/options/2 | 執行長正解長度裁示修正 | "在家看書" | "待在家裡看書" |
| b2-u12-l01 | items/14/questions/1/options/3 | 執行長正解長度裁示修正 | "下次換一個人負責規劃" | "下次換另一個人負責規劃" |
| b2-u12-l01 | items/13/options | 執行長正解長度裁示修正 | ["spite","dependable","amuse","enthusiastically"] | ["spite","dependable","thrill","enthusiastically"] |
| b2-u12-l01 | items/13/optionGlossZh | 執行長正解長度裁示修正 | ["惡意","可靠的","逗樂","熱情地"] | ["惡意","可靠的","興奮","熱情地"] |
| b2-u12-l02 | items/10/sentenceEn | 第③關 FIX17 | "The nurse gently wrapped the baby in a soft blanket." | "Their embrace at the train station lasted almost a minute." |
| b2-u12-l02 | items/10/sentenceZh | 第③關 FIX17 | "護理師輕輕地用柔軟的毯子把寶寶包起來。" | "他們在火車站擁抱了將近一分鐘。" |
| b2-u12-l02 | items/12/stemEn | 第③關 FIX18 | "He is very ____ about his success and never talks about his awards." | "When I praised her painting, she just gave a ____ smile and said, 'It's nothing special.'" |
| b2-u12-l02 | items/12/stemZh | 第③關 FIX18 | "他對自己的成就很謙虛，從不談論他得過的獎。" | "我稱讚她的畫時，她只是謙虛地笑了笑，說：「沒什麼特別的。」" |
| b2-u12-l02 | items/12/options | 第③關 FIX18 | ["punctual","friendly","modest","vacant"] | ["punctual","compatible","modest","seasonal"] |
| b2-u12-l02 | items/12/optionGlossZh | 第③關 FIX18 | ["準時的","友善的","謙虛的","空的"] | ["準時的","相容的","謙虛的","季節性的"] |
| b2-u12-l02 | items/14/questions/0/options/2 | 執行長正解長度裁示修正 | "大學的同學" | "大學時設計系的同學們" |
| b2-u12-l02 | items/14/questions/0/options/3 | 執行長正解長度裁示修正 | "國外的老師" | "國外的一群很有名的老師" |
| b2-u12-l02 | items/14/questions/1/options/0 | 執行長正解長度裁示修正 | "生氣地離開會議" | "生氣地起身離開會議" |
| b2-u12-l02 | items/14/questions/1/options/3 | 執行長正解長度裁示修正 | "向老闆抱怨" | "會後立刻跑去向老闆抱怨" |
| b2-u12-l02 | items/0/exampleEn | 情境對照表重判 | "She greeted her old friend with a warm embrace." | "The two sisters ended their long argument with an embrace." |
| b2-u12-l02 | items/0/exampleZh | 情境對照表重判 | "她用一個溫暖的擁抱迎接老朋友。" | "兩姊妹用一個擁抱結束了長時間的爭吵。" |
| b2-u12-l02 | items/7/exampleEn | 情境對照表重判 | "Despite her success, she remains modest." | "The modest winner thanked her coach and teammates first." |
| b2-u12-l02 | items/7/exampleZh | 情境對照表重判 | "儘管很成功，她依然很謙虛。" | "那位謙虛的冠軍先感謝了她的教練和隊友。" |
| b2-u12-l02 | items/9/options/0 | 執行長正解長度裁示修正 | "She hugged the child" | "She hugged him" |
| b2-u12-l02 | items/14/questions/0/options/0 | 執行長正解長度裁示修正 | "米蘭的一群頂尖設計師" | "米蘭的頂尖設計師" |
| b2-u12-l02 | items/14/questions/0/options/1 | 執行長正解長度裁示修正 | "公司的經理們" | "公司裡的幾位經理們" |
| b2-u12-l02 | items/14/questions/1/options/0 | 執行長正解長度裁示修正 | "生氣地起身離開會議" | "生氣地離開會議" |
| b2-u12-l03 | items/8/sentenceEn | 第③關 FIX19 | "Honesty is a virtue that every good leader needs." | "My grandmother taught me the virtue of working hard." |
| b2-u12-l03 | items/8/sentenceZh | 第③關 FIX19 | "誠實是每位好領導者都需要的美德。" | "奶奶教會我勤奮的美德。" |
| b2-u12-l03 | items/13/stemEn | 第③關 FIX20 | "The man ____ to the police that he had taken the money." | "She finally ____ to being afraid of dogs." |
| b2-u12-l03 | items/13/stemZh | 第③關 FIX20 | "那名男子向警方坦承錢是他拿的。" | "她終於坦承自己怕狗。" |
| b2-u12-l03 | items/15/promptZh | 第②關 issue＋第③關 S13 | "大家對健康飲食的意識正在提高。" | "年輕人的健康意識正在提高。" |
| b2-u12-l03 | items/15/referenceEn | 第②關 issue＋第③關 S13 | ["People's consciousness about healthy eating is growing.","Consciousness about healthy eating is rising among people."] | ["Health consciousness is growing among young people.","Young people's health consciousness is rising."] |
| b2-u12-l03 | items/15/rubricZh/0 | 第②關 issue | "consciousness 表示「意識、觀念」（例如 consciousness about…）" | "consciousness 表示「意識」（例如 health consciousness；寫 awareness of… 意思也對）" |
| b2-u12-l03 | items/2/exampleEn | 第③關 S1（執行長裁示 | "In the story, an evil queen tries to steal a magic mirror." | "Some people believe money is the root of all evil." |
| b2-u12-l03 | items/2/exampleZh | 第③關 S1（執行長裁示 | "故事裡，一位邪惡的皇后想偷走一面魔鏡。" | "有些人認為金錢是萬惡之源。" |
| b2-u12-l03 | items/2/glossZh | 第③關 S1（執行長裁示 | "邪惡的；邪惡" | "邪惡；邪惡的" |
| b2-u12-l03 | items/12/stemEn | 第③關 S1（執行長裁示 | "Many ____ in history were not good at school when they were young." | "Our class has two math ____; they solve every problem in minutes." |
| b2-u12-l03 | items/12/stemZh | 第③關 S1（執行長裁示 | "歷史上許多天才小時候在學校的表現並不好。" | "我們班有兩個數學天才，每道題都幾分鐘就解出來。" |
| b2-u12-l03 | items/14/questions/0/options/0 | 執行長正解長度裁示修正 | "贏得一場比賽" | "贏得一場重要的比賽" |
| b2-u12-l03 | items/14/questions/0/options/1 | 執行長正解長度裁示修正 | "找到失散的家人" | "找到失散了多年的家人" |
| b2-u12-l03 | items/9/options/1 | 執行長正解長度裁示修正 | "It brought many customers" | "It brought many new customers" |
| b2-u12-l03 | items/14/questions/1/options/0 | 執行長正解長度裁示修正 | "成為女孩的老師" | "後來成為女孩的老師" |
| b2-u12-l03 | items/15/referenceEn/0 | 第②關 issue 結案 |  | 已修正：見本檔 resolvedAfterFinalReview 中 items/15 的 3 筆修正紀錄。 |
| b2-u12-l03 | items/0/exampleEn | 情境對照表重判 | "The internet has changed the public consciousness about many issues." | "Growing up by the sea gave her a deep consciousness of nature's power." |
| b2-u12-l03 | items/0/exampleZh | 情境對照表重判 | "網路改變了大眾對許多議題的意識。" | "在海邊長大，讓她深刻意識到大自然的力量。" |
| b2-u12-l03 | items/1/exampleEn | 情境對照表重判 | "Patience is a virtue, especially when you work with children." | "One of his greatest virtues is that he never gives up." |
| b2-u12-l03 | items/1/exampleZh | 情境對照表重判 | "耐心是一種美德，尤其是在和孩子一起工作時。" | "他最大的優點之一，就是從不放棄。" |
| b2-u12-l03 | items/6/exampleEn | 情境對照表重判 | "The boy confessed that he had eaten all the cookies." | "When the teacher asked who broke the window, nobody would confess." |
| b2-u12-l03 | items/6/exampleZh | 情境對照表重判 | "男孩承認他把餅乾都吃光了。" | "老師問是誰打破窗戶時，沒有人願意承認。" |
| b2-u12-l03 | items/9/options/0 | 執行長正解長度裁示修正 | "It was very hard for them" | "It was very hard" |
| b2-u12-l03 | items/14/questions/0/options/0 | 執行長正解長度裁示修正 | "贏得一場重要的比賽" | "贏得一場比賽" |
| b2-u12-l03 | items/14/questions/0/options/1 | 執行長正解長度裁示修正 | "找到失散了多年的家人" | "找到失散的家人" |
| b2-u12-l03 | items/14/questions/1/options/3 | 執行長正解長度裁示修正 | "坦承自己的罪行" | "坦承了自己犯下的罪行" |
| b2-u12-l04 | items/7/glossZh | 第②關 issue＋第③關 FIX22 | "愚蠢的（口語）；啞的" | "笨的（口語不禮貌）；啞的（冒犯）" |
| b2-u12-l04 | items/14/passageEn | 第②關 issue＋第③關 S9 | "Last week, Tom found a wallet full of cash on the bus. His first instinct was to keep it, because he desperately needed money for his rent. But his conscience would not let him. He was reluctant at first, but he finally called the owner, an old man who had spent all morning looking for it. When Tom returned the wallet, the man's face broke into a huge grin. He offered Tom a reward, but Tom refused, saying it would feel like cheating. \"You have shown real dignity,\" the man said. Tom later laughed that keeping the money would have been a dumb idea anyway, since the man lived next door." | "Last week, Tom found a wallet full of cash on the bus. His first instinct was to keep it, because he desperately needed money for his rent. But his conscience would not let him. He was reluctant at first, but he finally called the owner, an old man who had spent all morning looking for it. When Tom returned the wallet, the man's face broke into a huge grin. He offered Tom a reward, but Tom refused, saying that taking money for doing the right thing would feel wrong. \"You are an honest young man,\" the man said. Tom later laughed that keeping the money would have been a dumb idea anyway, since the man lived next door." |
| b2-u12-l04 | items/14/passageZh | 第②關 issue | "上週，Tom 在公車上撿到一個裝滿現金的錢包。他的第一個念頭是留下來，因為他急需錢付房租。但他的良心不允許。他一開始有點猶豫，最後還是打電話給失主，一位找了一整個早上的老先生。Tom 把錢包還給他時，老先生臉上露出大大的笑容。他想給 Tom 一筆謝禮，但 Tom 拒絕了，說那樣感覺像在作弊。老先生說：「你展現了真正的尊嚴。」Tom 後來笑說，反正把錢留下來也是個蠢主意，因為那位老先生就住在他家隔壁。" | "上週，Tom 在公車上撿到一個裝滿現金的錢包。他的第一個念頭是留下來，因為他急需錢付房租。但他的良心不允許。他一開始有點猶豫，最後還是打電話給失主，一位找了一整個早上的老先生。Tom 把錢包還給他時，老先生臉上露出大大的笑容。他想給 Tom 一筆謝禮，但 Tom 拒絕了，說做了對的事還收錢，感覺不對。老先生說：「你是個誠實的年輕人。」Tom 後來笑說，反正把錢留下來也是個蠢主意，因為那位老先生就住在他家隔壁。" |
| b2-u12-l04 | items/14/questions/1/options/3 | 第②關 issue | "覺得那樣像在作弊" | "覺得做對的事還收錢不對" |
| b2-u12-l04 | items/0/exampleEn | 第②關 issue＋第③關 S9 | "Losing the final match filled the young players with grief." | "The old poem expresses the writer's grief at leaving his home country." |
| b2-u12-l04 | items/0/exampleZh | 第②關 issue＋第③關 S9 | "輸掉決賽讓年輕球員們滿懷悲傷。" | "那首古詩表達了作者離開故鄉的悲痛。" |
| b2-u12-l04 | items/8/sentenceEn | 第②關 issue | "It is natural to feel grief when a close friend moves far away." | "Music can help people through times of grief." |
| b2-u12-l04 | items/8/sentenceZh | 第②關 issue | "好朋友搬到很遠的地方時，感到傷心是很自然的。" | "音樂能幫助人們度過悲傷的時刻。" |
| b2-u12-l04 | items/9/options/0 | 執行長正解長度裁示修正 | "The player loses one point" | "The player loses one point each time" |
| b2-u12-l04 | items/9/options/2 | 執行長正解長度裁示修正 | "The player pays a fine" | "The player pays a small fine" |
| b2-u12-l04 | items/14/questions/1/options/0 | 執行長正解長度裁示修正 | "謝禮太少" | "覺得對方給的謝禮實在太少了" |
| b2-u12-l04 | items/14/questions/1/options/2 | 執行長正解長度裁示修正 | "他在趕時間" | "他急著趕去上班" |
| b2-u12-l04 | items/14/questions/0/options/3 | 執行長正解長度裁示修正 | "打電話給朋友" | "打電話給朋友商量" |
| b2-u12-l04 | items/7/glossZh | 第②關 issue 結案 |  | 已修正：見本檔 resolvedAfterFinalReview 中 items/7 的 1 筆修正紀錄。 |
| b2-u12-l04 | items/14/passageEn | 第②關 issue 結案 |  | 已修正：見本檔 resolvedAfterFinalReview 中 items/14 的 6 筆修正紀錄。 |
| b2-u12-l04 | items/0/exampleEn | 第②關 issue 結案 |  | 已修正：見本檔 resolvedAfterFinalReview 中 items/0 的 2 筆修正紀錄。 |
| b2-u12-l04 | items/2/exampleEn | 情境對照表重判 | "The photo shows my grandfather with a wide grin." | "His grin told me he had good news." |
| b2-u12-l04 | items/2/exampleZh | 情境對照表重判 | "照片裡，我爺爺咧嘴笑得很開心。" | "看他咧嘴一笑，我就知道他有好消息。" |
| b2-u12-l04 | items/5/exampleEn | 情境對照表重判 | "She desperately wanted to win the prize." | "The team played desperately in the last few minutes." |
| b2-u12-l04 | items/5/exampleZh | 情境對照表重判 | "她極度渴望贏得那個獎。" | "最後幾分鐘，球隊拚命地踢球。" |
| b2-u12-l04 | items/7/exampleEn | 情境對照表重判 | "Sorry, that was a dumb question." | "I made a dumb mistake and sent the email to the wrong person." |
| b2-u12-l04 | items/7/exampleZh | 情境對照表重判 | "抱歉，那是個蠢問題。" | "我犯了一個蠢錯誤，把電子郵件寄給錯的人。" |
| b2-u12-l04 | items/9/options/1 | 執行長正解長度裁示修正 | "The player must leave the table" | "The player must leave" |
| b2-u12-l04 | items/9/options/3 | 執行長正解長度裁示修正 | "Nothing happens" | "Nothing happens to the player" |
| b2-u12-l04 | items/14/questions/0/options/2 | 執行長正解長度裁示修正 | "把錢包丟掉" | "把錢包丟進垃圾桶" |
| b2-u12-l04 | items/14/questions/1/options/1 | 執行長正解長度裁示修正 | "他很有錢" | "他自己本來就很有錢" |
| b2-u12-l04 | items/14/questions/1/options/2 | 執行長正解長度裁示修正 | "他急著趕去上班" | "他那時急著趕去上班" |
| b2-u12-l04 | items/14/questions/1/options/3 | 執行長正解長度裁示修正 | "覺得做對的事還收錢不對" | "做對的事不該收錢" |
| b2-u12-l05 | items/2/exampleEn | 第③關 FIX21 | "In the film, the hero is betrayed by his closest friend." | "The company betrayed its customers by selling their personal information." |
| b2-u12-l05 | items/2/exampleZh | 第③關 FIX21 | "在電影裡，主角被他最親近的朋友背叛了。" | "那家公司出賣了顧客，把他們的個人資料賣掉了。" |
| b2-u12-l05 | items/14/passageEn | 第②關 issue | "My favorite TV drama this year tells the story of two inseparable friends who open a small restaurant together. Lisa is passionate and full of ideas, while Ben is calm and mature. Their charming little restaurant becomes popular, but then Ben discovers that Lisa has been secretly planning to sell it. He feels completely betrayed. In a moving scene, Lisa makes a confession with tears in her eyes: she needed money to help her family. Ben, who has always shown compassion to others, decides to forgive her. My friends joke that Lisa is the devil of the story, but I think she is just human." | "My favorite TV drama this year tells the story of two inseparable friends who open a small restaurant together. Lisa is passionate and full of ideas, while Ben is calm and mature. Their charming little restaurant becomes popular, but then Ben discovers that Lisa has been secretly planning to sell it. He feels completely betrayed. In a moving scene, Lisa makes a confession with tears in her eyes: she needed money to help her family. Ben, who has always shown compassion to others, decides to forgive her. My friends joke that Lisa is the bad guy of the story, but I think she is just human." |
| b2-u12-l05 | items/14/passageZh | 第②關 issue | "我今年最喜歡的電視劇，講的是兩個形影不離的好朋友一起開小餐廳的故事。Lisa 熱情、點子很多，Ben 則冷靜又成熟。他們那家迷人的小餐廳越來越受歡迎，但後來 Ben 發現 Lisa 一直偷偷計畫要把餐廳賣掉。他覺得自己完全被背叛了。在一場感人的戲裡，Lisa 含淚坦白：她需要錢來幫助家人。一向很有同情心的 Ben 決定原諒她。我朋友開玩笑說 Lisa 是這個故事的魔鬼，但我覺得她只是個普通人。" | "我今年最喜歡的電視劇，講的是兩個形影不離的好朋友一起開小餐廳的故事。Lisa 熱情、點子很多，Ben 則冷靜又成熟。他們那家迷人的小餐廳越來越受歡迎，但後來 Ben 發現 Lisa 一直偷偷計畫要把餐廳賣掉。他覺得自己完全被背叛了。在一場感人的戲裡，Lisa 含淚坦白：她需要錢來幫助家人。一向很有同情心的 Ben 決定原諒她。我朋友開玩笑說 Lisa 是這個故事裡的壞人，但我覺得她只是個普通人。" |
| b2-u12-l05 | items/11/sentenceEn | 第③關 S1（執行長裁示 | "Please choose your words carefully so you don't offend anyone." | "Leaving the dinner early might offend the host." |
| b2-u12-l05 | items/11/sentenceZh | 第③關 S1（執行長裁示 | "請謹慎用字，以免冒犯任何人。" | "提早離開晚宴可能會冒犯主人。" |
| b2-u12-l05 | items/6/exampleEn | 第③關 S4 | "We stayed in a charming little hotel by the lake." | "Her grandson is a charming boy who always says thank you." |
| b2-u12-l05 | items/6/exampleZh | 第③關 S4 | "我們住在湖邊一家迷人的小旅館。" | "她的孫子是個討人喜歡的男孩，總是會說謝謝。" |
| b2-u12-l05 | items/6/glossZh | 第③關 S4 | "迷人的；有魅力的" | "有魅力的；迷人的" |
| b2-u12-l05 | items/9/options/0 | 執行長正解長度裁示修正 | "Traveling abroad" | "Traveling to other countries" |
| b2-u12-l05 | items/9/options/3 | 執行長正解長度裁示修正 | "Writing reports" | "Writing reports for the team" |
| b2-u12-l05 | items/14/questions/0/options/0 | 執行長正解長度裁示修正 | "一家書店" | "一家小書店" |
| b2-u12-l05 | items/14/questions/0/options/3 | 執行長正解長度裁示修正 | "一家花店" | "一家街角的花店" |
| b2-u12-l05 | items/14/questions/1/options/0 | 執行長正解長度裁示修正 | "準備搬到國外" | "準備一個人偷偷搬到國外" |
| b2-u12-l05 | items/14/questions/1/options/1 | 執行長正解長度裁示修正 | "拿走了店裡的錢" | "偷偷拿走了店裡的錢" |
| b2-u12-l05 | items/14/passageEn | 第②關 issue 結案 |  | 已修正：見本檔 resolvedAfterFinalReview 中 items/14 的 6 筆修正紀錄。 |
| b2-u12-l05 | items/0/exampleEn | 情境對照表重判 | "She made a confession: she had never read the book." | "I have a small confession to make: I forgot to water your plants." |
| b2-u12-l05 | items/0/exampleZh | 情境對照表重判 | "她坦白了一件事：她從來沒讀過那本書。" | "我得跟你坦白一件小事：我忘了幫你的植物澆水。" |
| b2-u12-l05 | items/3/exampleEn | 情境對照表重判 | "The teacher showed great compassion to the lonely new student." | "Her eyes were full of compassion when she heard the sad news." |
| b2-u12-l05 | items/3/exampleZh | 情境對照表重判 | "老師對那位孤單的新生表現出深切的關懷。" | "聽到那個令人難過的消息時，她的眼神充滿同情。" |
| b2-u12-l05 | items/5/exampleEn | 情境對照表重判 | "He is passionate about cooking and spends every weekend in the kitchen." | "The passionate fans sang loudly for the whole match." |
| b2-u12-l05 | items/5/exampleZh | 情境對照表重判 | "他熱愛烹飪，每個週末都待在廚房裡。" | "熱情的球迷整場比賽都在大聲唱歌。" |
| b2-u12-l05 | items/7/exampleEn | 情境對照表重判 | "Some words that are normal in one country may offend people in another." | "I hope you weren't offended by my question about your age." |
| b2-u12-l05 | items/7/exampleZh | 情境對照表重判 | "有些在某國很正常的字眼，在另一國可能會冒犯人。" | "希望我問你年紀的事沒有冒犯到你。" |
| b2-u12-l05 | items/9/options/1 | 執行長正解長度裁示修正 | "Saving money" | "Saving money for a new house" |
| b2-u12-l05 | items/14/questions/0/options/1 | 執行長正解長度裁示修正 | "一家小餐廳" | "一家迷人的小餐廳" |
| b2-u12-l05 | items/14/questions/1/options/2 | 執行長正解長度裁示修正 | "偷偷計畫把餐廳賣掉" | "計畫賣掉餐廳" |
| b2-u12-l05 | items/14/questions/1/options/3 | 執行長正解長度裁示修正 | "跟別人吵了架" | "跟客人大吵了一架" |
| b2-u12-l06 | items/12/stemEn | 第③關 FIX23 | "Giving all his money to people in need was a ____ thing to do." | "It is a ____ idea, but I don't think we have enough money for it." |
| b2-u12-l06 | items/12/stemZh | 第③關 FIX23 | "把所有的錢都送給有需要的人，是一件高尚的事。" | "這是個崇高的理想，但我覺得我們的錢不夠。" |
| b2-u12-l06 | items/12/options | 第③關 FIX23＋S20 | ["vacant","furious","noble","oval"] | ["vacant","furious","noble","punctual"] |
| b2-u12-l06 | items/12/optionGlossZh | 第③關 FIX23 | ["空的","狂怒的","高尚的","橢圓形的"] | ["空的","狂怒的","高尚的","準時的"] |
| b2-u12-l06 | items/1/exampleEn | 第③關 S11 | "The storm showed no mercy to the small fishing boats." | "The teacher showed mercy and gave us one more day to finish." |
| b2-u12-l06 | items/1/exampleZh | 第③關 S11 | "暴風雨對小漁船毫不留情。" | "老師網開一面，多給我們一天完成。" |
| b2-u12-l06 | items/14/passageEn | 第③關 S11 | "Last night I watched an old adventure film about a noble prince. When a cruel king takes his land, the prince is furious and makes a vow to get it back. His friends expect him to seek revenge, but the story is more interesting than that. The prince defies the king in public, yet he refuses to fight. Later, when the king's own army turns against him, the prince shows him mercy and saves his life. The film is a little long, and my wife joked that sitting through three hours was torture. Still, I felt genuinely sympathetic toward every character." | "Last night I watched an old adventure film about a noble prince. When a cruel king takes his land, the prince is furious and makes a vow to get it back. His friends expect him to seek revenge, but the story is more interesting than that. The prince defies the king in public, yet he refuses to fight. Later, when the king loses everything, the prince shows him mercy and gives him a home. The film is a little long, and my wife joked that sitting through three hours was torture. Still, I felt genuinely sympathetic toward every character." |
| b2-u12-l06 | items/14/passageZh | 第③關 S11 | "昨晚我看了一部老冒險片，講的是一位高尚的王子。殘暴的國王奪走他的土地時，王子怒不可遏，發誓要把土地奪回來。朋友們以為他會報仇，但故事比這有趣得多。王子在眾人面前違抗國王，卻拒絕動武。後來國王的軍隊背叛他時，王子對他寬大為懷，還救了他一命。這部電影有點長，我太太開玩笑說坐三個小時簡直是折磨。不過，我真心同情片中的每個角色。" | "昨晚我看了一部老冒險片，講的是一位高尚的王子。殘暴的國王奪走他的土地時，王子怒不可遏，發誓要把土地奪回來。朋友們以為他會報仇，但故事比這有趣得多。王子在眾人面前違抗國王，卻拒絕動武。後來國王失去一切時，王子對他寬大為懷，還給了他一個家。這部電影有點長，我太太開玩笑說坐三個小時簡直是折磨。不過，我真心同情片中的每個角色。" |
| b2-u12-l06 | items/1/exampleEn | 情境對照表重判 | "The teacher showed mercy and gave us one more day to finish." | "Show some mercy! I've been working since six this morning." |
| b2-u12-l06 | items/1/exampleZh | 情境對照表重判 | "老師網開一面，多給我們一天完成。" | "饒了我吧！我從早上六點就開始工作了。" |
| b2-u12-l06 | items/9/options/1 | 執行長正解長度裁示修正 | "Don't worry too much about a small mistake" | "Don't worry about one small mistake" |
| b2-u12-l06 | items/9/options/2 | 執行長正解長度裁示修正 | "Tell the boss about it" | "Tell the boss about the mistake" |
| b2-u12-l06 | items/9/options/3 | 執行長正解長度裁示修正 | "Fix the mistake right now" | "Fix the mistake right away by yourself" |
| b2-u12-l06 | items/14/questions/0/options/0 | 執行長正解長度裁示修正 | "偷偷離開國家" | "偷偷離開國家，不再回來" |
| b2-u12-l06 | items/14/questions/0/options/1 | 執行長正解長度裁示修正 | "立刻帶兵攻打他" | "立刻帶兵攻打他，奪回土地" |
| b2-u12-l06 | items/14/questions/1/options/0 | 執行長正解長度裁示修正 | "這是她看過最好的電影" | "這是她這幾年看過最好的電影" |
| b2-u12-l06 | items/1/exampleEn | 情境對照表重判 | "Show some mercy! I've been working since six this morning." | "My coach has no mercy during training; we run until we drop." |
| b2-u12-l06 | items/1/exampleZh | 情境對照表重判 | "饒了我吧！我從早上六點就開始工作了。" | "我的教練練習時毫不留情，我們要跑到累倒為止。" |
| b2-u12-l06 | items/3/exampleEn | 情境對照表重判 | "Revenge is a common theme in old stories." | "After losing the game, the team wanted revenge in the next match." |
| b2-u12-l06 | items/3/exampleZh | 情境對照表重判 | "復仇是古老故事中常見的主題。" | "輸掉這場比賽後，球隊想在下一場報仇。" |
| b2-u12-l06 | items/4/exampleEn | 情境對照表重判 | "I made a vow to exercise every morning this year." | "He kept his vow to visit his grandmother every week." |
| b2-u12-l06 | items/4/exampleZh | 情境對照表重判 | "我發誓今年每天早上都要運動。" | "他信守誓言，每週都去探望奶奶。" |
| b2-u12-l06 | items/5/exampleEn | 情境對照表重判 | "My father was furious when he saw the broken window." | "The furious customer demanded to see the manager." |
| b2-u12-l06 | items/5/exampleZh | 情境對照表重判 | "爸爸看到破掉的窗戶時氣炸了。" | "那位怒氣沖沖的客人要求見經理。" |
| b2-u12-l06 | items/6/exampleEn | 情境對照表重判 | "Helping others without asking for anything is a noble act." | "She gave up her free time for a noble cause: teaching kids to read." |
| b2-u12-l06 | items/6/exampleZh | 情境對照表重判 | "不求回報地幫助別人，是一種高尚的行為。" | "她為了一個崇高的目標放棄空閒時間：教孩子讀書。" |
| b2-u12-l06 | items/7/exampleEn | 情境對照表重判 | "The tiny plant defied the cold and kept growing." | "It's hard to defy a rule that everyone else follows." |
| b2-u12-l06 | items/7/exampleZh | 情境對照表重判 | "那株小植物不畏寒冷，持續生長。" | "大家都遵守的規定，要違抗它很難。" |
| b2-u12-l06 | items/4/exampleEn | 情境對照表重判 | "He kept his vow to visit his grandmother every week." | "She broke her vow and told everyone the secret." |
| b2-u12-l06 | items/4/exampleZh | 情境對照表重判 | "他信守誓言，每週都去探望奶奶。" | "她違背了誓言，把祕密告訴了所有人。" |
| b2-u12-l06 | items/7/exampleEn | 情境對照表重判 | "It's hard to defy a rule that everyone else follows." | "It takes courage to defy your friends when they are doing something wrong." |
| b2-u12-l06 | items/7/exampleZh | 情境對照表重判 | "大家都遵守的規定，要違抗它很難。" | "當朋友在做錯的事時，要違抗他們的意思需要勇氣。" |
| b2-u12-l06 | items/9/options/3 | 執行長正解長度裁示修正 | "Fix the mistake right away by yourself" | "Fix the mistake right away" |
| b2-u12-l06 | items/14/questions/0/options/0 | 執行長正解長度裁示修正 | "偷偷離開國家，不再回來" | "偷偷離開國家，再也不回來" |
| b2-u12-l06 | items/14/questions/1/options/1 | 執行長正解長度裁示修正 | "坐三個小時簡直是折磨" | "坐三小時很折磨" |
| b2-u12-l06 | items/14/questions/1/options/2 | 執行長正解長度裁示修正 | "演員都很年輕" | "演員們都很年輕又好看" |
| b2-u12-l06 | items/14/questions/1/options/3 | 執行長正解長度裁示修正 | "結局太悲傷" | "結局實在太悲傷了" |
| b2-u12-l06 | items/14/questions/0/options/2 | 執行長正解長度裁示修正 | "向他求饒" | "跪下來向他求饒" |
| b2-u12-l07 | items/0/exampleEn | 第③關 FIX24 | "Her aspiration is to open her own design studio." | "The program helps young workers achieve their aspirations." |
| b2-u12-l07 | items/0/exampleZh | 第③關 FIX24 | "她的志向是開一間自己的設計工作室。" | "這個計畫幫助年輕員工實現他們的抱負。" |
| b2-u12-l07 | items/11/sentenceEn | 第③關 FIX25 | "Ignorance about money can lead to serious problems later in life." | "Please forgive my ignorance, but what does this word mean?" |
| b2-u12-l07 | items/11/sentenceZh | 第③關 FIX25 | "對金錢一無所知，可能會在日後造成嚴重的問題。" | "請原諒我的無知，這個字是什麼意思？" |
| b2-u12-l07 | items/14/passageEn | 第②關 issue | "Ever since she was a teenager, Nina's aspiration was to become a chef. Her parents wanted her to study law, but she was determined to follow her dream. At cooking school, she learned to work independently and to cook with great dedication. When she opened her first restaurant, she faced the temptation to use cheaper food to save money, but she refused. Once, a food writer called her an idiot for using simple local vegetables, and many customers expressed outrage at his rude review. Nina simply laughed. She says such criticism often comes from ignorance of local food, and she never takes it personally." | "When she was a teenager, Nina's aspiration was to become a chef. Her parents wanted her to study law, but she was determined to follow her dream. At cooking school, she learned to work independently and to cook with great dedication. When she opened her first restaurant, she faced the temptation to use cheaper food to save money, but she refused. Once, a food writer called her an idiot for using simple local vegetables, and many customers expressed outrage at his rude review. Nina simply laughed. She says such criticism often comes from ignorance of local food, and she never takes it personally." |
| b2-u12-l07 | items/14/passageZh | 第②關 issue | "Nina 從十幾歲起，志向就是當廚師。她的父母希望她念法律，但她下定決心要追求夢想。在烹飪學校，她學會獨立工作，並全心投入地做菜。開第一家餐廳時，她面臨用便宜食材省錢的誘惑，但她拒絕了。有一次，一位美食作家罵她是白痴，因為她用的是簡單的在地蔬菜，許多顧客都對他無禮的評論感到憤慨。Nina 只是笑了笑。她說，這類批評常常來自對在地食物的無知，她從不放在心上。" | "Nina 十幾歲時，志向就是當廚師。她的父母希望她念法律，但她下定決心要追求夢想。在烹飪學校，她學會獨立工作，並全心投入地做菜。開第一家餐廳時，她面臨用便宜食材省錢的誘惑，但她拒絕了。有一次，一位美食作家罵她是白痴，因為她用的是簡單的在地蔬菜，許多顧客都對他無禮的評論感到憤慨。Nina 只是笑了笑。她說，這類批評常常來自對在地食物的無知，她從不放在心上。" |
| b2-u12-l07 | items/9/options/0 | 執行長正解長度裁示修正 | "Buy a new car" | "Buy a new car for work" |
| b2-u12-l07 | items/9/options/2 | 執行長正解長度裁示修正 | "Find a new job" | "Find a new job next year" |
| b2-u12-l07 | items/14/questions/1/options/0 | 執行長正解長度裁示修正 | "從此不再來餐廳" | "從此不再來這家餐廳用餐" |
| b2-u12-l07 | items/14/questions/1/options/2 | 執行長正解長度裁示修正 | "同意他的看法" | "也同意他對在地蔬菜的看法" |
| b2-u12-l07 | items/14/passageEn | 第②關 issue 結案 |  | 已修正：見本檔 resolvedAfterFinalReview 中 items/14 的 4 筆修正紀錄。 |
| b2-u12-l07 | items/1/exampleEn | 情境對照表重判 | "The two teams worked independently on the same problem." | "The museum is run independently, without money from the government." |
| b2-u12-l07 | items/1/exampleZh | 情境對照表重判 | "兩個團隊各自獨立處理同一個問題。" | "這間博物館獨立經營，沒有拿政府的錢。" |
| b2-u12-l07 | items/4/exampleEn | 情境對照表重判 | "His ignorance of the rules caused a lot of problems." | "I was surprised by my own ignorance about how my phone works." |
| b2-u12-l07 | items/4/exampleZh | 情境對照表重判 | "他對規定的無知造成了很多問題。" | "我很驚訝，自己對手機怎麼運作竟然一無所知。" |
| b2-u12-l07 | items/5/exampleEn | 情境對照表重判 | "Shops place sweets near the door as a temptation for children." | "Online shopping late at night is a big temptation for me." |
| b2-u12-l07 | items/5/exampleZh | 情境對照表重判 | "商店把糖果放在門口附近，用來誘惑孩子。" | "深夜網購對我來說是很大的誘惑。" |
| b2-u12-l07 | items/6/exampleEn | 情境對照表重判 | "She was determined to pass the exam on her first try." | "With a determined look, the little boy tried the jump again." |
| b2-u12-l07 | items/6/exampleZh | 情境對照表重判 | "她下定決心要一次就考過。" | "小男孩帶著堅決的神情，又試跳了一次。" |
| b2-u12-l07 | items/9/options/0 | 執行長正解長度裁示修正 | "Buy a new car for work" | "Buy a new car" |
| b2-u12-l07 | items/14/questions/0/options/0 | 執行長正解長度裁示修正 | "當廚師" | "當一名廚師" |
| b2-u12-l07 | items/14/questions/0/options/2 | 執行長正解長度裁示修正 | "開餐廳" | "開一家餐廳" |
| b2-u12-l07 | items/14/questions/1/options/1 | 執行長正解長度裁示修正 | "對他無禮的評論感到憤慨" | "對他無禮的評論感到非常憤慨" |
| b2-u12-l07 | items/14/questions/1/options/3 | 執行長正解長度裁示修正 | "寫信感謝他" | "寫信感謝他的批評" |
| b2-u12-l08 | items/16/referenceEn/1 | 第③關 FIX26 | "Even though my manager is very successful, she is still humble." | "I try to stay humble and learn from my younger colleagues." |
| b2-u12-l08 | items/0/exampleEn | 第③關 S21 | "Despite winning many awards, the scientist stayed humble." | "He is humble enough to ask his students for advice." |
| b2-u12-l08 | items/0/exampleZh | 第③關 S21 | "儘管得過許多獎，那位科學家依然很謙遜。" | "他很謙遜，願意向學生請教。" |
| b2-u12-l08 | items/6/exampleEn | 第③關 S10 | "She looked at the messy room with contempt." | "She looked at the rude customer with contempt." |
| b2-u12-l08 | items/6/exampleZh | 第③關 S10 | "她用鄙視的眼神看著那個亂七八糟的房間。" | "她用鄙視的眼神看著那位無禮的客人。" |
| b2-u12-l08 | items/14/passageEn | 第②關 issue＋第③關 S12 | "Our small town's football team had humble beginnings: twenty years ago, the players trained on a field full of stones. Last season, however, they had improved considerably, played aggressively, and reached the national final. Some fans of the other team treated them with contempt, calling them farmers. The players answered with vigorous training and a calm attitude. In a moving speech before the game, the captain reminded everyone of their oath to always play fair. They lost by one goal, but the whole town proudly welcomed them home. Even the final's ticket prices, which many people called outrageous, did not stop hundreds of fans from traveling to watch." | "Our small town's football team had humble beginnings: twenty years ago, the players trained on a field full of stones. Last season, however, they had improved considerably, played aggressively, and reached the national final. Some fans of the other team treated them with contempt, calling them a team of beginners. The players answered with vigorous training and a calm attitude. In a moving speech before the game, the captain reminded everyone of their oath to always play fair. They lost by one goal, but the whole town proudly welcomed them home. Even the final's ticket prices, which many people called outrageous, did not stop hundreds of fans from traveling to watch." |
| b2-u12-l08 | items/14/passageZh | 第②關 issue | "我們小鎮的足球隊起步很卑微：二十年前，球員們在一片滿是石頭的場地上練習。不過上個球季，他們進步了很多，打法積極，一路打進全國決賽。對方的一些球迷很瞧不起他們，叫他們農夫。球員們用高強度的訓練和冷靜的態度回應。賽前，隊長發表了一段感人的演說，提醒大家他們曾宣誓永遠公平比賽。他們以一球之差落敗，但全鎮的人都驕傲地歡迎他們回家。就連決賽那被許多人稱為離譜的票價，也擋不住數百名球迷遠道去觀賽。" | "我們小鎮的足球隊起步很卑微：二十年前，球員們在一片滿是石頭的場地上練習。不過上個球季，他們進步了很多，打法積極，一路打進全國決賽。對方的一些球迷很瞧不起他們，叫他們新手隊。球員們用高強度的訓練和冷靜的態度回應。賽前，隊長發表了一段感人的演說，提醒大家他們曾宣誓永遠公平比賽。他們以一球之差落敗，但全鎮的人都驕傲地歡迎他們回家。就連決賽那被許多人稱為離譜的票價，也擋不住數百名球迷遠道去觀賽。" |
| b2-u12-l08 | items/12/options | 第③關 S20 | ["outrageous","humble","vigorous","moving"] | ["punctual","humble","vigorous","moving"] |
| b2-u12-l08 | items/12/optionGlossZh | 第③關 S20 | ["離譜的","謙遜的","強而有力的","感人的"] | ["準時的","謙遜的","強而有力的","感人的"] |
| b2-u12-l08 | items/1/exampleEn | 第③關 S1（執行長裁示 | "The hotel charged an outrageous price for a cup of coffee." | "His outrageous behavior at the party shocked everyone." |
| b2-u12-l08 | items/1/exampleZh | 第③關 S1（執行長裁示 | "那家飯店一杯咖啡的價格高得離譜。" | "他在派對上離譜的行為讓大家都很震驚。" |
| b2-u12-l08 | items/5/exampleEn | 第③關 S1（執行長裁示 | "A vigorous walk every morning keeps my grandfather active." | "The plan started a vigorous debate in the office." |
| b2-u12-l08 | items/5/exampleZh | 第③關 S1（執行長裁示 | "每天早上快步走，讓我爺爺保持活力。" | "這個計畫在辦公室裡引起熱烈的辯論。" |
| b2-u12-l08 | items/5/glossZh | 第③關 S1（執行長裁示 | "精力充沛的；強而有力的" | "強而有力的；激烈的" |
| b2-u12-l08 | items/5/distractorsZh | 第③關 S1（執行長裁示 | ["虛弱的","緩慢的","短暫的"] | ["虛弱的","緩慢的","冷淡的"] |
| b2-u12-l08 | items/2/exampleEn | 第③關 S1（執行長裁示 | "It was a moving story that made many people cry." | "Her letter to her younger self is a moving piece of writing." |
| b2-u12-l08 | items/2/exampleZh | 第③關 S1（執行長裁示 | "那是一個感人的故事，讓很多人都哭了。" | "她寫給年輕時自己的信，是一篇感人的文章。" |
| b2-u12-l08 | items/9/options/1 | 執行長正解長度裁示修正 | "The bus is faster" | "The bus is faster in the city" |
| b2-u12-l08 | items/9/options/2 | 執行長正解長度裁示修正 | "The car is broken" | "The car is in the repair shop" |
| b2-u12-l08 | items/14/questions/0/options/1 | 執行長正解長度裁示修正 | "學校的體育館" | "鎮上小學的室內體育館" |
| b2-u12-l08 | items/14/questions/0/options/3 | 執行長正解長度裁示修正 | "大城市的球場" | "大城市裡的正式球場" |
| b2-u12-l08 | items/14/questions/1/options/3 | 執行長正解長度裁示修正 | "雙方打成平手" | "延長賽後雙方打成平手" |
| b2-u12-l08 | items/14/passageEn | 第②關 issue 結案 |  | 已修正：見本檔 resolvedAfterFinalReview 中 items/14 的 5 筆修正紀錄。 |
| b2-u12-l08 | items/0/exampleEn | 情境對照表重判 | "He is humble enough to ask his students for advice." | "In a humble voice, he thanked everyone for their help." |
| b2-u12-l08 | items/0/exampleZh | 情境對照表重判 | "他很謙遜，願意向學生請教。" | "他用謙遜的語氣感謝大家的幫忙。" |
| b2-u12-l08 | items/6/exampleEn | 情境對照表重判 | "She looked at the rude customer with contempt." | "The rude reply was full of contempt." |
| b2-u12-l08 | items/6/exampleZh | 情境對照表重判 | "她用鄙視的眼神看著那位無禮的客人。" | "那句無禮的回覆充滿了鄙視。" |
| b2-u12-l08 | items/7/exampleEn | 情境對照表重判 | "Doctors take an oath to help their patients." | "The hero in the story kept his oath until the very end." |
| b2-u12-l08 | items/7/exampleZh | 情境對照表重判 | "醫生要宣誓幫助病人。" | "故事裡的主角直到最後都信守他的誓言。" |
| b2-u12-l08 | items/9/options/3 | 執行長正解長度裁示修正 | "Parking is too expensive" | "Parking downtown is too expensive" |
| b2-u12-l08 | items/14/questions/0/options/0 | 執行長正解長度裁示修正 | "一片滿是石頭的場地" | "一片滿是石頭的練習場地" |
| b2-u12-l08 | items/14/questions/1/options/0 | 執行長正解長度裁示修正 | "比賽被取消" | "比賽因為下雨被取消" |
| b2-u12-l08 | items/14/questions/1/options/2 | 執行長正解長度裁示修正 | "以一球之差輸了" | "差一球輸了" |
| b2-u12-l08 | items/9/options/0 | 執行長正解長度裁示修正 | "The bus is free" | "The bus is free today" |
| b2-u12-l09 | items/12/stemEn | 第③關 FIX27 | "Going out on a boat in a storm like this is pure ____." | "Paying that much money for a pair of shoes is pure ____." |
| b2-u12-l09 | items/12/stemZh | 第③關 FIX27 | "在這樣的暴風雨中搭船出海，根本是瘋了。" | "花那麼多錢買一雙鞋，根本是瘋了。" |
| b2-u12-l09 | items/13/stemEn | 第③關 FIX28 | "Once in a while, it's fine to ____ in your favorite dessert." | "Once in a while, it's fine to ____ in a long afternoon nap." |
| b2-u12-l09 | items/13/stemZh | 第③關 FIX28 | "偶爾盡情享受一下你最愛的甜點也無妨。" | "偶爾盡情睡個長長的午覺也無妨。" |
| b2-u12-l09 | items/6/exampleEn | 第③關 FIX29 | "After the long journey, the travelers were weary." | "Customers are growing weary of the same old menu." |
| b2-u12-l09 | items/6/exampleZh | 第③關 FIX29 | "長途旅行之後，旅客們都很疲倦。" | "顧客對一成不變的菜單越來越厭倦。" |
| b2-u12-l09 | items/15/rubricZh/0 | 第②關 issue＋第③關 FIX30 | "respected 表示「受尊敬的」，放在名詞前（例如 a respected expert）" | "respected 表示「受尊敬的」（例如 a respected expert；is highly respected 也正確）" |
| b2-u12-l09 | items/5/exampleEn | 第③關 S1（執行長裁示 | "Her fascination with the ocean led her to study fish." | "The children watched the magician with fascination." |
| b2-u12-l09 | items/5/exampleZh | 第③關 S1（執行長裁示 | "她對海洋的著迷，讓她去研究魚類。" | "孩子們著迷地看著魔術師。" |
| b2-u12-l09 | items/14/questions/0/options/0 | 執行長正解長度裁示修正 | "一座古城的遺跡" | "海邊一座古城留下的遺跡" |
| b2-u12-l09 | items/14/questions/0/options/1 | 執行長正解長度裁示修正 | "一本古老的日記" | "一本古代船長親手寫的航海日記" |
| b2-u12-l09 | items/14/questions/1/options/2 | 執行長正解長度裁示修正 | "去國外旅行" | "和太太去國外旅行" |
| b2-u12-l09 | items/15/rubricZh/0 | 第②關 issue 結案 |  | 已修正：見本檔 resolvedAfterFinalReview 中 items/15 的 1 筆修正紀錄。 |
| b2-u12-l09 | items/1/exampleEn | 情境對照表重判 | "The view from the top of the tower is astonishing." | "She has an astonishing memory for names and faces." |
| b2-u12-l09 | items/1/exampleZh | 情境對照表重判 | "從塔頂看出去的景色令人驚嘆。" | "她記人名和長相的能力驚人。" |
| b2-u12-l09 | items/2/exampleEn | 情境對照表重判 | "Driving in this heavy snow would be madness." | "In a moment of madness, I bought a coat I didn't need." |
| b2-u12-l09 | items/2/exampleZh | 情境對照表重判 | "在這種大雪中開車簡直是瘋了。" | "一時瘋狂，我買了一件根本不需要的外套。" |
| b2-u12-l09 | items/7/exampleEn | 情境對照表重判 | "On my birthday, I indulge in a big piece of chocolate cake." | "After the exam, I indulged myself with a whole day of video games." |
| b2-u12-l09 | items/7/exampleZh | 情境對照表重判 | "生日那天，我會盡情吃一大塊巧克力蛋糕。" | "考完試後，我盡情地玩了一整天的電玩。" |
| b2-u12-l09 | items/9/options/2 | 執行長正解長度裁示修正 | "Shorter meetings" | "Meetings that are under an hour" |
| b2-u12-l09 | items/14/questions/0/options/2 | 執行長正解長度裁示修正 | "一張標出被遺忘島嶼的地圖" | "標出被遺忘島嶼的地圖" |
| b2-u12-l09 | items/14/questions/0/options/3 | 執行長正解長度裁示修正 | "一枚稀有的硬幣" | "一枚古代留下的稀有硬幣" |
| b2-u12-l09 | items/14/questions/1/options/3 | 執行長正解長度裁示修正 | "和孫子去釣魚" | "和孫子釣魚" |
| b2-u13-l01 | items/15/passageEn | 第②關 issue | "Last month, I visited a small clothing factory in my hometown. The owner showed me how they choose each fabric: they test every fiber under a light to check its strength. The factory makes elegant outfits for office workers, but its best-selling product is a dress with a soft belt at the waist. Visitors must wear a badge, and photos are not allowed. At the end of the tour, I tried on a costume they had made for a local theater, and everyone laughed. The owner said many hair salons in the city also order uniforms from them." | "Last month, I visited a small clothing factory in my hometown. The owner showed me how they choose each fabric: they pull hard on every fiber to test its strength. The factory makes elegant outfits for office workers, but its best-selling product is a dress with a soft belt at the waist. Visitors must wear a badge, and photos are not allowed. At the end of the tour, I tried on a costume they had made for a local theater, and everyone laughed. The owner said many hair salons in the city also order uniforms from them." |
| b2-u13-l01 | items/15/passageZh | 第②關 issue | "上個月，我參觀了家鄉一間小型成衣工廠。老闆示範他們如何挑選布料：在燈光下檢查每一根纖維的強度。工廠為上班族製作高雅的套裝，但最暢銷的是一款腰間繫著柔軟腰帶的洋裝。參觀者必須配戴識別證，而且不准拍照。參觀結束時，我試穿了他們為當地劇場做的一套戲服，大家都笑了。老闆說，市區很多美髮沙龍也向他們訂製制服。" | "上個月，我參觀了家鄉一間小型成衣工廠。老闆示範他們如何挑選布料：用力拉扯每一根纖維，測試它的強度。工廠為上班族製作高雅的套裝，但最暢銷的是一款腰間繫著柔軟腰帶的洋裝。參觀者必須配戴識別證，而且不准拍照。參觀結束時，我試穿了他們為當地劇場做的一套戲服，大家都笑了。老闆說，市區很多美髮沙龍也向他們訂製制服。" |
| b2-u13-l01 | items/15/questions/0/options | 第②關 issue | ["在燈光下檢查每根纖維的強度","用水洗過一次","讓顧客投票","只買最便宜的"] | ["用力拉扯纖維測試強度","把布料用水洗過一次","讓老顧客投票決定","只買最便宜的布料"] |
| b2-u13-l01 | items/15/questions/0/options/1 | 執行長正解長度裁示修正 | "把布料用水洗過一次" | "把布料先用水仔細洗過一次" |
| b2-u13-l01 | items/10/options/1 | 執行長正解長度裁示修正 | "Cheap and slow" | "Cheap but not fast at all" |
| b2-u13-l01 | items/15/questions/1/options/1 | 執行長正解長度裁示修正 | "買了一件洋裝" | "買了一件有腰帶的洋裝" |
| b2-u13-l01 | items/15/questions/1/options/2 | 執行長正解長度裁示修正 | "拍了很多照片" | "拍了很多工廠的照片" |
| b2-u13-l01 | items/15/passageEn | 第②關 issue 結案 |  | 已修正：見本檔 resolvedAfterFinalReview 中 items/15 的 6 筆修正紀錄。 |
| b2-u13-l01 | items/1/exampleEn | 情境對照表重判 | "The children wore animal costumes for the school play." | "The museum shows traditional costumes from different regions of the country." |
| b2-u13-l01 | items/1/exampleZh | 情境對照表重判 | "孩子們穿著動物裝參加學校話劇。" | "博物館展示了這個國家各地區的傳統服裝。" |
| b2-u13-l01 | items/2/exampleEn | 情境對照表重判 | "She bought a new outfit for the job interview." | "Each dancer changes into three different outfits during the show." |
| b2-u13-l01 | items/2/exampleZh | 情境對照表重判 | "她為了面試買了一套新衣服。" | "每位舞者在表演中會換上三套不同的服裝。" |
| b2-u13-l01 | items/8/exampleEn | 情境對照表重判 | "She tied a red scarf around her waist." | "The water in the lake came up to my waist." |
| b2-u13-l01 | items/8/exampleZh | 情境對照表重判 | "她在腰上綁了一條紅色圍巾。" | "湖水淹到了我的腰部。" |
| b2-u13-l01 | items/7/exampleEn | 情境對照表重判 | "Many people think a deep voice is sexy." | "Red is often seen as a sexy color." |
| b2-u13-l01 | items/7/exampleZh | 情境對照表重判 | "很多人覺得低沉的聲音很性感。" | "紅色常被視為性感的顏色。" |
| b2-u13-l01 | items/11/sentenceEn | 情境對照表重判 | "She wore a simple black outfit to the evening party." | "Many people think a deep voice is sexy." |
| b2-u13-l01 | items/11/sentenceZh | 情境對照表重判 | "她穿了一套簡單的黑色服裝去參加晚宴。" | "很多人覺得低沉的聲音很性感。" |
| b2-u13-l01 | items/7/exampleEn | 情境對照表重判 | "Red is often seen as a sexy color." | "The designer wanted the new dress to look modern and sexy." |
| b2-u13-l01 | items/7/exampleZh | 情境對照表重判 | "紅色常被視為性感的顏色。" | "設計師希望這件新洋裝看起來既現代又性感。" |
| b2-u13-l01 | items/10/options/3 | 執行長正解長度裁示修正 | "Too small for a family" | "Too small for a big family" |
| b2-u13-l01 | items/15/questions/0/options/2 | 執行長正解長度裁示修正 | "讓老顧客投票決定" | "讓老顧客一起投票來決定" |
| b2-u13-l01 | items/15/questions/1/options/0 | 執行長正解長度裁示修正 | "試穿為劇場做的戲服" | "試穿劇場的戲服" |
| b2-u13-l01 | items/15/questions/1/options/3 | 執行長正解長度裁示修正 | "和老闆吃午餐" | "和老闆一起吃午餐" |
| b2-u13-l02 | items/13/options | 第③關 FIX | ["underwear","eyebrow","hood","scent"] | ["curl","eyebrow","hood","scent"] |
| b2-u13-l02 | items/13/optionGlossZh | 第③關 FIX | ["內衣","眉毛","兜帽","香味"] | ["捲髮","眉毛","兜帽","香味"] |
| b2-u13-l02 | items/9/options/1 | 執行長正解長度裁示修正 | "Buy a new shirt" | "Buy a new shirt for work" |
| b2-u13-l02 | items/14/questions/1/options/1 | 執行長正解長度裁示修正 | "妹妹的捲髮" | "妹妹的柔軟捲髮" |
| b2-u13-l02 | items/0/exampleEn | 情境對照表重判 | "This candle has a light scent of lemon." | "Some flowers give off their scent only at night." |
| b2-u13-l02 | items/0/exampleZh | 情境對照表重判 | "這根蠟燭有淡淡的檸檬香。" | "有些花要到夜裡才會散發香味。" |
| b2-u13-l02 | items/9/options/1 | 執行長正解長度裁示修正 | "Buy a new shirt for work" | "Buy a new work shirt" |
| b2-u13-l02 | items/14/questions/0/options/0 | 執行長正解長度裁示修正 | "因為天氣很熱" | "因為天氣很炎熱" |
| b2-u13-l02 | items/14/questions/0/options/3 | 執行長正解長度裁示修正 | "因為要參加婚禮" | "因為要去參加婚禮" |
| b2-u13-l02 | items/14/questions/1/options/2 | 執行長正解長度裁示修正 | "妹妹的刺青" | "那個刺青" |
| b2-u13-l02 | items/14/questions/1/options/0 | 執行長正解長度裁示修正 | "那件洋裝" | "那件新洋裝" |
| b2-u13-l02 | items/14/questions/1/options/3 | 執行長正解長度裁示修正 | "那瓶香水" | "那瓶花香香水" |
| b2-u13-l03 | items/12/options | 第③關 S1 | ["ornament","eyelid","cuff","mustache"] | ["bun","fingernail","cuff","mustache"] |
| b2-u13-l03 | items/12/optionGlossZh | 第③關 S1 | ["裝飾品","眼皮","袖口","鬍子"] | ["髮髻","手指甲","袖口","鬍子"] |
| b2-u13-l03 | items/14/questions/0/options/1 | 執行長正解長度裁示修正 | "去公園散步" | "去附近的公園散步一小時" |
| b2-u13-l03 | items/14/questions/1/options/2 | 執行長正解長度裁示修正 | "水果和優格" | "水果和自己做的優格" |
| b2-u13-l03 | items/9/options/0 | 執行長正解長度裁示修正 | "Closing for the day" | "Closing early for the day" |
| b2-u13-l03 | items/0/exampleEn | 情境對照表重判 | "The jacket has gold buttons on each cuff." | "The tailor sewed new cuffs onto my favorite old shirt." |
| b2-u13-l03 | items/0/exampleZh | 情境對照表重判 | "這件夾克的每個袖口都有金色鈕扣。" | "裁縫師幫我最喜歡的那件舊襯衫縫上了新袖口。" |
| b2-u13-l03 | items/3/exampleEn | 情境對照表重判 | "The actor shaved off his mustache for the new film." | "The famous painter is known for his long, curly mustache." |
| b2-u13-l03 | items/3/exampleZh | 情境對照表重判 | "那位演員為了新電影把鬍子剃掉了。" | "那位知名畫家以他又長又捲的鬍子聞名。" |
| b2-u13-l03 | items/7/exampleEn | 情境對照表重判 | "The children were already in their pajamas at eight." | "These thin cotton pajamas are perfect for hot summer nights." |
| b2-u13-l03 | items/7/exampleZh | 情境對照表重判 | "孩子們八點就已經換上睡衣了。" | "這套薄棉睡衣很適合在炎熱的夏夜穿。" |
| b2-u13-l03 | items/0/exampleEn | 情境對照表重判提案修正 | "The tailor sewed new cuffs onto my favorite old shirt." | "My grandmother sewed new cuffs onto my favorite old shirt." |
| b2-u13-l03 | items/0/exampleZh | 情境對照表重判提案修正 | "裁縫師幫我最喜歡的那件舊襯衫縫上了新袖口。" | "奶奶幫我最喜歡的那件舊襯衫縫上了新袖口。" |
| b2-u13-l03 | items/9/options/2 | 執行長正解長度裁示修正 | "Selling old stock" | "Selling old stock cheaply" |
| b2-u13-l03 | items/14/questions/0/options/3 | 執行長正解長度裁示修正 | "去麵包店買麵包" | "去附近的麵包店買麵包" |
| b2-u13-l03 | items/14/questions/1/options/2 | 執行長正解長度裁示修正 | "水果和自己做的優格" | "水果和優格" |
| b2-u13-l03 | items/9/options/2 | 執行長正解長度裁示修正 | "Selling old stock cheaply" | "Selling old stock for less" |
| b2-u13-l04 | items/14/questions/1/options/2 | 執行長正解長度裁示修正 | "買了一套西裝" | "買了一套新的西裝" |
| b2-u13-l04 | items/14/questions/1/options/3 | 執行長正解長度裁示修正 | "幫狗剪毛" | "幫家裡的狗剪毛" |
| b2-u13-l04 | items/1/exampleEn | 情境對照表重判 | "Every stitch on this cheap jacket was done by machine." | "In sewing class, we practiced one simple stitch for an hour." |
| b2-u13-l04 | items/1/exampleZh | 情境對照表重判 | "這件便宜夾克上的每一針都是機器縫的。" | "在縫紉課上，我們花了一個小時練習一種簡單的針法。" |
| b2-u13-l04 | items/4/exampleEn | 情境對照表重判 | "She has a fair complexion and burns easily in the sun." | "Portrait painters mix many colors to show a natural complexion." |
| b2-u13-l04 | items/4/exampleZh | 情境對照表重判 | "她皮膚白皙，在太陽下很容易曬傷。" | "肖像畫家會調和許多顏色，畫出自然的膚色。" |
| b2-u13-l04 | items/7/exampleEn | 情境對照表重判 | "The jeweler fixed the broken chain of my necklace." | "My uncle trained for five years to become a jeweler." |
| b2-u13-l04 | items/7/exampleZh | 情境對照表重判 | "珠寶商修好了我項鍊上斷掉的鍊子。" | "我叔叔受訓了五年，才成為珠寶匠。" |
| b2-u13-l04 | items/14/questions/1/options/3 | 執行長正解長度裁示修正 | "幫家裡的狗剪毛" | "幫小狗剪毛" |
| b2-u13-l05 | items/12/options | 第③關 FIX | ["drapery","pearl","waistcoat","flax"] | ["drapery","silverware","denim","flax"] |
| b2-u13-l05 | items/12/optionGlossZh | 第③關 FIX | ["窗簾","珍珠","西裝背心","亞麻"] | ["窗簾","銀製餐具","牛仔布","亞麻"] |
| b2-u13-l05 | items/4/exampleEn | 第③關 FIX | "The waiters wear black waistcoats and white shirts." | "The waistcoat had six small buttons down the front." |
| b2-u13-l05 | items/4/exampleZh | 第③關 FIX | "服務生穿著黑色背心和白襯衫。" | "那件背心前面有六顆小鈕扣。" |
| b2-u13-l05 | items/14/passageZh | 第②關 issue | "上週末，我幫阿姨清理她的老房子。在一個舊櫥櫃裡，我們找到一件灰色開襟毛衣、一件爺爺穿過的深色背心，還有一件用自家農場種的亞麻織成的洋裝。有些窗簾已經破爛不堪，但客廳裡厚重的布幔看起來依然很氣派。在一個木盒裡，我們找到一組銀製餐具和一串珍珠。阿姨說珍珠永不過時，但那組銀器看起來有點過時。整理完時，表弟的小兒子衣服只穿一半就到處跑，不肯穿上襯衫，大家都笑了。" | "上週末，我幫阿姨清理她的老房子。在一個舊櫥櫃裡，我們找到一件灰色開襟毛衣、一件爺爺穿過的深色背心，還有一件用自家農場種的亞麻織成的洋裝。有些窗簾已經破爛不堪，但客廳裡厚重的布幔看起來依然很氣派。在一個木盒裡，我們找到一組銀製餐具和一串珍珠。阿姨說珍珠永不過時，但那組銀器看起來有點過時。整理完時，表親的小兒子衣服只穿一半就到處跑，不肯穿上襯衫，大家都笑了。" |
| b2-u13-l05 | items/7/exampleEn | 情境對照表重判 | "The old flag was in tatters after the storm." | "She tore the old sheet into tatters to use as cleaning cloths." |
| b2-u13-l05 | items/7/exampleZh | 情境對照表重判 | "暴風雨過後，那面舊旗子已經破爛不堪。" | "她把舊床單撕成碎布條，拿來當抹布。" |
| b2-u13-l05 | items/3/exampleEn | 情境對照表重判 | "Linen is made from the flax plant." | "Fields of flax turn blue when the plants flower." |
| b2-u13-l05 | items/3/exampleZh | 情境對照表重判 | "亞麻布是用亞麻這種植物做成的。" | "亞麻開花時，整片田會變成藍色。" |
| b2-u13-l05 | items/9/options/2 | 執行長正解長度裁示修正 | "Set up the chairs" | "Set up all the chairs" |
| b2-u13-l05 | items/14/questions/0/options/1 | 執行長正解長度裁示修正 | "一件灰色毛衣" | "一件灰色毛衣和一件深色背心" |
| b2-u13-l05 | items/14/questions/0/options/0 | 執行長正解長度裁示修正 | "爺爺的照片" | "爺爺的照片和一疊舊信" |
| b2-u13-l05 | items/14/passageZh | 第②關 issue 結案 |  | 已修正：見本檔 resolvedAfterFinalReview 中 items/14 的 3 筆修正紀錄。 |
| b2-u13-l05 | items/5/exampleEn | 情境對照表重判 | "The baby was undressed and ready for her bath." | "My little sister left all her dolls undressed on the floor." |
| b2-u13-l05 | items/5/exampleZh | 情境對照表重判 | "寶寶已經脫好衣服，準備洗澡了。" | "妹妹把她所有的娃娃都脫掉衣服，丟在地上。" |
| b2-u13-l05 | items/14/questions/0/options/1 | 執行長正解長度裁示修正 | "一件灰色毛衣和一件深色背心" | "一件毛衣和一件背心" |
| b2-u13-l05 | items/14/questions/0/options/3 | 執行長正解長度裁示修正 | "一疊舊信" | "一疊泛黃的舊信件" |
| b2-u13-l05 | items/14/questions/1/options/3 | 執行長正解長度裁示修正 | "非常昂貴" | "價格非常昂貴" |
| b2-u14-l01 | items/3/exampleEn | 第②關 issue | "There is a laundry on the corner where you can wash clothes for a few coins." | "There is a basket of laundry waiting on my bed." |
| b2-u14-l01 | items/3/exampleZh | 第②關 issue | "轉角有一家投幣式洗衣店。" | "我床上有一籃待洗的衣服。" |
| b2-u14-l01 | items/3/glossZh | 第②關 issue | "洗衣店；待洗的衣物" | "待洗的衣物；洗衣店" |
| b2-u14-l01 | items/6/distractorsZh | 第②關 issue | ["釘子","灰塵","裂縫"] | ["釘子","灰塵","標籤"] |
| b2-u14-l01 | items/7/exampleEn | 第③關 S22 | "The waiter wiped the spilled juice off the floor." | "She wiped the tears from her eyes." |
| b2-u14-l01 | items/7/exampleZh | 第③關 S22 | "服務生把灑在地上的果汁擦掉。" | "她擦掉眼淚。" |
| b2-u14-l01 | items/10/options/3 | 執行長正解長度裁示修正 | "Clean the windows" | "Clean all the windows" |
| b2-u14-l01 | items/15/questions/1/options/1 | 執行長正解長度裁示修正 | "草坪長滿雜草" | "草坪上長滿雜草、需要修剪" |
| b2-u14-l01 | items/3/exampleEn | 第②關 issue 結案 |  | 已修正：見本檔 resolvedAfterFinalReview 中 items/3 的 3 筆修正紀錄。 |
| b2-u14-l01 | items/6/distractorsZh/2 | 第②關 issue 結案 |  | 已修正：見本檔 resolvedAfterFinalReview 中 items/6 的 1 筆修正紀錄。 |
| b2-u14-l01 | items/16/rubricZh/1 | 第②關 issue 結案 |  | 已於 259e7c4（盲審後、判題寫入前）依準則 §11.18 改為「時態合理即可（例如 wiped、has wiped）」。 |
| b2-u14-l01 | items/10/options/3 | 執行長正解長度裁示修正 | "Clean all the windows" | "Clean the windows" |
| b2-u14-l01 | items/15/questions/0/options/0 | 執行長正解長度裁示修正 | "花園" | "屋子外面的花園" |
| b2-u14-l01 | items/15/questions/0/options/1 | 執行長正解長度裁示修正 | "廚房" | "家裡的廚房" |
| b2-u14-l01 | items/15/questions/0/options/2 | 執行長正解長度裁示修正 | "浴室" | "樓上浴室" |
| b2-u14-l01 | items/15/questions/0/options/3 | 執行長正解長度裁示修正 | "車庫" | "地下車庫" |
| b2-u14-l01 | items/15/questions/1/options/3 | 執行長正解長度裁示修正 | "小地毯不見了" | "門邊那塊小地毯被弄不見了" |
| b2-u14-l01 | items/15/questions/1/options/2 | 執行長正解長度裁示修正 | "洗衣機壞了" | "家裡的洗衣機壞了" |
| b2-u14-l02 | items/15/questions/1/options/2 | 執行長正解長度裁示修正 | "因為後院沒有圍牆" | "因為後院四周沒有任何圍牆" |
| b2-u14-l02 | items/8/exampleEn | 第③關 G1（執行長裁示 | "This sweet drink is made from fresh sugar cane." | "In the play, the actor uses a cane to look older." |
| b2-u14-l02 | items/8/exampleZh | 第③關 G1（執行長裁示 | "這種甜飲料是用新鮮甘蔗做的。" | "劇中那位演員拄著手杖，讓自己看起來比較老。" |
| b2-u14-l02 | items/8/glossZh | 第③關 G1（執行長裁示 | "手杖；（甘蔗等的）莖" | "手杖；（甘蔗等的）莖" |
| b2-u14-l02 | items/3/exampleEn | 情境對照表重判 | "The farmer built a wooden shed for his tools and seeds." | "Our neighbor turned her garden shed into a small art studio." |
| b2-u14-l02 | items/3/exampleZh | 情境對照表重判 | "那位農夫蓋了一間木棚子，放工具和種子。" | "我們的鄰居把她花園裡的小屋改成了一間小畫室。" |
| b2-u14-l02 | items/6/exampleEn | 情境對照表重判 | "The writer rented a cottage by the sea to finish her novel." | "This village is famous for its white cottages with flower gardens." |
| b2-u14-l02 | items/6/exampleZh | 情境對照表重判 | "那位作家在海邊租了一間小屋，好寫完她的小說。" | "這個村莊以附有花園的白色小屋聞名。" |
| b2-u14-l02 | items/10/options/1 | 執行長正解長度裁示修正 | "In the garage" | "In the big garage" |
| b2-u14-l02 | items/15/questions/0/options/3 | 執行長正解長度裁示修正 | "因為照明不足" | "因為晚上照明不足" |
| b2-u14-l02 | items/15/questions/1/options/1 | 執行長正解長度裁示修正 | "因為弟弟餵牠" | "因為弟弟每天早上都去餵牠" |
| b2-u14-l02 | items/15/questions/1/options/3 | 執行長正解長度裁示修正 | "因為門沒關" | "因為晚上門沒有關好" |
| b2-u14-l03 | items/6/exampleEn | 第②關 issue | "Children in the story were afraid of the dark cellar under the castle." | "The children in the story were afraid of the dark cellar under the castle." |
| b2-u14-l03 | items/15/passageEn | 第②關 issue | "When my grandparents moved to a smaller house, our whole family came to help. We packed books and dishes into cardboard boxes and carried old jam jars up from the cellar. The house was cozy, with a brick fireplace in the living room and a green hedge around the garden. A stone arch stood over the front gate, covered in climbing roses with a sweet fragrance. My cousin found an old metal tub in the shed and turned it into a flower pot. At the end of the day, we cleared up all the litter, sat on wooden stools in the kitchen, and shared a pot of soup." | "When my grandparents moved to a smaller house, our whole family came to help. We packed books and dishes into cardboard boxes and carried old jam jars up from the cellar. The house was cozy, with a brick fireplace in the living room and a green hedge around the garden. A stone arch stood over the front gate, covered in climbing roses with a sweet fragrance. My cousin found an old metal tub in the shed and turned it into a flower pot. At the end of the day, we cleared up all the mess, sat on wooden stools in the kitchen, and shared a pot of soup." |
| b2-u14-l03 | items/15/passageZh | 第②關 issue | "爺爺奶奶搬到比較小的房子時，我們全家都來幫忙。我們把書和碗盤裝進紙箱，還從地窖搬上來一些舊果醬罐。那間房子很溫馨，客廳裡有座磚砌壁爐，花園四周圍著綠色樹籬。前門上方立著一座石拱門，上面爬滿了香氣甜美的玫瑰。表哥在小屋裡找到一個舊鐵桶，把它改成了花盆。一天結束時，我們把垃圾都清乾淨，坐在廚房的木凳子上，一起分享一鍋湯。" | "爺爺奶奶搬到比較小的房子時，我們全家都來幫忙。我們把書和碗盤裝進紙箱，還從地窖搬上來一些舊果醬罐。那間房子很溫馨，客廳裡有座磚砌壁爐，花園四周圍著綠色樹籬。前門上方立著一座石拱門，上面爬滿了香氣甜美的玫瑰。表哥在小屋裡找到一個舊鐵桶，把它改成了花盆。一天結束時，我們把屋裡收拾乾淨，坐在廚房的木凳子上，一起分享一鍋湯。" |
| b2-u14-l03 | items/16/referenceEn/0 | 第③關 S2 | "Please fold these empty cardboard boxes before you recycle them." | "Please press these empty cardboard boxes flat before you recycle them." |
| b2-u14-l03 | items/15/questions/1/options/1 | 執行長正解長度裁示修正 | "木頭圍欄" | "白色的木頭圍欄" |
| b2-u14-l03 | items/6/exampleEn | 第②關 issue 結案 |  | 已修正：見本檔 resolvedAfterFinalReview 中 items/6 的 1 筆修正紀錄。 |
| b2-u14-l03 | items/15/passageEn | 第②關 issue 結案 |  | 已修正：見本檔 resolvedAfterFinalReview 中 items/15 的 3 筆修正紀錄。 |
| b2-u14-l03 | items/1/exampleEn | 情境對照表重判 | "The hotel lobby has a stone fireplace that guests love." | "Every winter, someone has to clean the ashes out of the fireplace." |
| b2-u14-l03 | items/1/exampleZh | 情境對照表重判 | "那家飯店大廳有一座客人都很喜歡的石砌壁爐。" | "每年冬天，都得有人把壁爐裡的灰清乾淨。" |
| b2-u14-l03 | items/4/exampleEn | 情境對照表重判 | "The bride and groom walked under an arch of white roses." | "This old bridge has three tall arches over the river." |
| b2-u14-l03 | items/4/exampleZh | 情境對照表重判 | "新郎新娘從一座白玫瑰拱門下走過。" | "這座古橋在河上有三個高大的橋拱。" |
| b2-u14-l03 | items/5/exampleEn | 情境對照表重判 | "The library has a cozy reading corner with soft chairs." | "We spent a cozy evening at home playing cards." |
| b2-u14-l03 | items/5/exampleZh | 情境對照表重判 | "圖書館有一個擺著軟椅、舒適溫馨的閱讀角落。" | "我們在家打牌，度過了一個溫馨的夜晚。" |
| b2-u14-l03 | items/10/options/3 | 執行長正解長度裁示修正 | "It is easy to clean" | "It is easy to keep clean" |
| b2-u14-l03 | items/15/questions/0/options/2 | 執行長正解長度裁示修正 | "花盆" | "一個花盆" |
| b2-u14-l03 | items/15/questions/0/options/3 | 執行長正解長度裁示修正 | "浴缸" | "一個小浴缸" |
| b2-u14-l03 | items/15/questions/1/options/1 | 執行長正解長度裁示修正 | "白色的木頭圍欄" | "木圍欄" |
| b2-u14-l04 | items/16/rubricZh/1 | 第②關 issue | "描述要合理；狗用「it」或「its」" | "描述要合理；狗可用 it，也可用 he、she" |
| b2-u14-l04 | items/15/promptZh | 第③關 S3 | "工人把貨物堆在棧板上，方便搬運。" | "我們用舊棧板做了一張花園長椅。" |
| b2-u14-l04 | items/15/referenceEn | 第③關 S3 | ["The workers piled the goods on pallets to make them easy to move.","The workers stacked the goods on pallets so they could be moved easily."] | ["We made a garden bench out of old pallets.","We used old pallets to build a bench for the garden."] |
| b2-u14-l04 | items/15/rubricZh | 第③關 S3 | ["pallet 指「棧板」（例如 on pallets）","沒有時間標記，現在式或過去式都可以；「方便搬運」可寫 to make them easy to move 等"] | ["pallet 指棧板（例如 old pallets）","「做」可寫 make、build 等；時態合理即可（例如 made、have made）"] |
| b2-u14-l04 | items/9/options/1 | 執行長正解長度裁示修正 | "This afternoon" | "Later this afternoon" |
| b2-u14-l04 | items/14/questions/0/options/0 | 執行長正解長度裁示修正 | "為了換新屋瓦" | "為了先在屋頂換上新的屋瓦" |
| b2-u14-l04 | items/14/questions/1/options/0 | 執行長正解長度裁示修正 | "放在櫥櫃裡" | "還放在原來的櫥櫃裡" |
| b2-u14-l04 | items/16/rubricZh/1 | 第②關 issue 結案 |  | 已修正：見本檔 resolvedAfterFinalReview 中 items/16 的 1 筆修正紀錄。 |
| b2-u14-l04 | items/0/exampleEn | 情境對照表重判 | "In ancient times, builders mixed mortar from sand, water and burned stone." | "The mortar in this ancient wall has lasted for almost two thousand years." |
| b2-u14-l04 | items/0/exampleZh | 情境對照表重判 | "古時候，工匠用沙、水和燒過的石頭拌成灰泥。" | "這道古牆裡的灰泥已經撐了將近兩千年。" |
| b2-u14-l04 | items/3/exampleEn | 情境對照表重判 | "The puppy chewed through its leash and chased a ball down the street." | "The pet shop sells leashes in many colors and sizes." |
| b2-u14-l04 | items/3/exampleZh | 情境對照表重判 | "那隻小狗咬斷了牽繩，沿著街追著一顆球跑。" | "那家寵物店賣各種顏色和尺寸的牽繩。" |
| b2-u14-l04 | items/4/exampleEn | 情境對照表重判 | "My uncle bought a new ax to chop wood for the winter." | "In the museum, we saw a stone ax made thousands of years ago." |
| b2-u14-l04 | items/4/exampleZh | 情境對照表重判 | "叔叔買了一把新斧頭，劈過冬用的柴火。" | "我們在博物館看到一把幾千年前做的石斧。" |
| b2-u14-l04 | items/7/exampleEn | 情境對照表重判 | "The truck delivered twenty pallets of bottled water to the store." | "Most pallets in warehouses are made of wood or plastic." |
| b2-u14-l04 | items/7/exampleZh | 情境對照表重判 | "卡車送了二十個棧板的瓶裝水到店裡。" | "倉庫裡的棧板大多是木頭或塑膠做的。" |
| b2-u14-l04 | items/7/exampleEn | 情境對照表重判提案修正 | "Most pallets in warehouses are made of wood or plastic." | "Most pallets in factories are made of wood or plastic." |
| b2-u14-l04 | items/7/exampleZh | 情境對照表重判提案修正 | "倉庫裡的棧板大多是木頭或塑膠做的。" | "工廠裡的棧板大多是木頭或塑膠做的。" |
| b2-u14-l04 | items/9/options/2 | 執行長正解長度裁示修正 | "Tonight" | "Tonight after dinner" |
| b2-u14-l04 | items/9/options/3 | 執行長正解長度裁示修正 | "Next week" | "Sometime next week" |
| b2-u14-l04 | items/14/questions/0/options/0 | 執行長正解長度裁示修正 | "為了先在屋頂換上新的屋瓦" | "為了在屋頂換新屋瓦" |
| b2-u14-l05 | items/0/exampleEn | 第③關 FIX | "In a nutshell, the new system saves us time and money." | "In a nutshell, the house needs a new roof and new windows." |
| b2-u14-l05 | items/0/exampleZh | 第③關 FIX | "簡單來說，新系統幫我們省下時間和金錢。" | "簡單來說，這房子需要換新屋頂和新窗戶。" |
| b2-u14-l05 | items/14/passageEn | 第②關 issue | "When I moved into my first apartment, it felt cold and empty. Over one weekend, I tried to change that. I fixed a hole in the wallboard and took out my paintbrush to paint the bedroom a soft yellow. I bought linen pillowcases and a thick rug for the floor. My neighbor gave me an old birdcage, which I filled with small plants. The building's friendly doorkeeper even helped me carry a lamp up the stairs, holding the handrail with one hand. In a nutshell, it took a little work and very little money, but now the apartment is full of coziness." | "When I moved into my first apartment, it felt cold and empty. Over one weekend, I tried to change that. I fixed a hole in the wallboard and took out my paintbrush to paint the bedroom a soft yellow. I bought linen pillowcases and a thick rug for the floor. My neighbor gave me an old birdcage, which I filled with small plants. The building's friendly doorkeeper even helped me carry a lamp up the stairs, holding the handrail with one hand. In a nutshell, it took a little work and very little money, but now the apartment has a real coziness." |
| b2-u14-l05 | items/9/options/1 | 執行長正解長度裁示修正 | "More paint" | "Some more white paint" |
| b2-u14-l05 | items/14/questions/0/options/1 | 執行長正解長度裁示修正 | "養一隻鳥" | "養一隻小鳥當寵物" |
| b2-u14-l05 | items/14/questions/1/options/0 | 執行長正解長度裁示修正 | "作者的鄰居" | "送鳥籠的那位鄰居" |
| b2-u14-l05 | items/14/passageEn | 第②關 issue 結案 |  | 已修正：見本檔 resolvedAfterFinalReview 中 items/14 的 3 筆修正紀錄。 |
| b2-u14-l05 | items/0/exampleEn | 情境對照表重判 | "In a nutshell, the house needs a new roof and new windows." | "Can you put the story in a nutshell for me?" |
| b2-u14-l05 | items/0/exampleZh | 情境對照表重判 | "簡單來說，這房子需要換新屋頂和新窗戶。" | "你可以把這個故事簡單地說給我聽嗎？" |
| b2-u14-l05 | items/5/exampleEn | 情境對照表重判 | "The builders covered the new walls with wallboard before painting." | "Wallboard is light, cheap and easy to cut to size." |
| b2-u14-l05 | items/5/exampleZh | 情境對照表重判 | "工人在上漆前先在新牆上釘上牆板。" | "牆板又輕又便宜，而且很容易裁成需要的大小。" |
| b2-u14-l05 | items/6/exampleEn | 情境對照表重判 | "An old birdcage full of flowers decorated the café window." | "I clean the birdcage every Saturday and give the birds fresh water." |
| b2-u14-l05 | items/6/exampleZh | 情境對照表重判 | "一個裝滿花的舊鳥籠裝飾著咖啡店的櫥窗。" | "我每個星期六都會清理鳥籠，給鳥換上乾淨的水。" |
| b2-u14-l05 | items/9/options/1 | 執行長正解長度裁示修正 | "Some more white paint" | "More white paint" |
| b2-u14-l05 | items/14/questions/0/options/3 | 執行長正解長度裁示修正 | "當作燈罩" | "當燈罩" |
| b2-u14-l05 | items/14/questions/0/options/1 | 執行長正解長度裁示修正 | "養一隻小鳥當寵物" | "養一隻小鳥" |
| b2-u14-l05 | items/14/questions/0/options/2 | 執行長正解長度裁示修正 | "放書" | "放舊書" |
| b2-u14-l05 | items/14/questions/1/options/2 | 執行長正解長度裁示修正 | "作者的父母" | "作者爸媽" |
| b2-u15-l01 | items/12/options | 第②關 issue＋第③關 FIX | ["chew","pour","boil","slice"] | ["chew","pour","spill","slice"] |
| b2-u15-l01 | items/12/optionGlossZh | 第③關 FIX | ["咀嚼","倒","煮沸","切片"] | ["咀嚼","倒","灑出","切片"] |
| b2-u15-l01 | items/9/options/1 | 執行長正解長度裁示修正 | "Add some oil" | "Add a spoon of olive oil" |
| b2-u15-l01 | items/14/questions/0/options/1 | 執行長正解長度裁示修正 | "堅果" | "切碎的堅果和蜂蜜" |
| b2-u15-l01 | items/14/questions/0/options/2 | 執行長正解長度裁示修正 | "大蒜" | "切碎的大蒜和奶油" |
| b2-u15-l01 | items/14/questions/0/options/3 | 執行長正解長度裁示修正 | "奶油" | "融化的奶油" |
| b2-u15-l01 | items/14/questions/1/options/1 | 執行長正解長度裁示修正 | "他整堂課嚼口香糖，忘了嘗東西" | "他整堂課嚼口香糖忘了試吃" |
| b2-u15-l01 | items/14/questions/1/options/0 | 執行長正解長度裁示修正 | "他把螃蟹弄掉了" | "他把整盤螃蟹都弄掉在地上了" |
| b2-u15-l01 | items/14/questions/1/options/2 | 執行長正解長度裁示修正 | "他的餅乾烤焦了" | "他烤的蜂蜜餅乾全都烤焦了" |
| b2-u15-l01 | items/12 | 第②關 issue 結案 |  | 已修正：見本檔 resolvedAfterFinalReview 中 items/12 的 2 筆修正紀錄。 |
| b2-u15-l01 | judge/verdicts/b2-u15-l01-q13 | 第②關雙答案（chew／boil） | [0,2] | [0] |
| b2-u15-l01 | items/3/exampleEn | 情境對照表重判 | "This chocolate bar is full of roasted nuts." | "Some birds hide nuts in the ground to eat in winter." |
| b2-u15-l01 | items/3/exampleZh | 情境對照表重判 | "這條巧克力棒裡滿是烤過的堅果。" | "有些鳥會把堅果藏在土裡，留到冬天吃。" |
| b2-u15-l01 | items/9/options/2 | 執行長正解長度裁示修正 | "Add a teaspoon of salt" | "Add some salt" |
| b2-u15-l01 | items/9/options/1 | 執行長正解長度裁示修正 | "Add a spoon of olive oil" | "Add some olive oil" |
| b2-u15-l01 | items/14/questions/1/options/0 | 執行長正解長度裁示修正 | "他把整盤螃蟹都弄掉在地上了" | "他把螃蟹弄掉在地上" |
| b2-u15-l01 | items/14/questions/1/options/2 | 執行長正解長度裁示修正 | "他烤的蜂蜜餅乾全都烤焦了" | "他烤的餅乾全都焦了" |
| b2-u15-l01 | items/14/questions/1/options/3 | 執行長正解長度裁示修正 | "他忘了帶麵粉" | "他忘了帶麵粉來上課" |
| b2-u15-l02 | items/14/passageEn | 第②關 issue＋第③關 FIX | "Every autumn, our town holds a harvest festival. Farmers bring huge orange pumpkins and other kinds of squash to show off their size. One stand sells jam made at home made from peaches, cherries and wild berries. Another sells olives in jars of vinegar and herbs, packed in cardboard boxes. My favorite is a small stall selling coconut cake. The streets get so crowded that people are squashed together, but nobody seems to mind. At the end of the day, there is a contest for the biggest pumpkin. Last year's winner weighed over three hundred kilos!" | "Every autumn, our town holds a harvest festival. Farmers bring huge orange pumpkins and other kinds of squash to show off their size. One stand sells jam that a local family makes from peaches, cherries and wild berries. Another sells olives in jars of vinegar and herbs, packed in cardboard boxes. My favorite is a small stall selling coconut cake. The streets get so crowded that people are squashed together, but nobody seems to mind. At the end of the day, there is a contest for the biggest pumpkin. Last year's winner weighed over three hundred kilos!" |
| b2-u15-l02 | items/14/passageZh | 第③關 FIX | "每年秋天，我們鎮上都會舉辦豐收節。農夫們帶來巨大的橘色南瓜和其他各種瓜類，展示它們有多大。有個攤位賣自家用桃子、櫻桃和野莓做的果醬。另一個攤位賣泡在醋和香草裡的罐裝橄欖，裝在紙箱裡。我最喜歡的是一個賣椰子蛋糕的小攤。街上擠到大家都被擠在一起，但似乎沒有人介意。一天結束時，還有最大南瓜比賽。去年的冠軍超過三百公斤！" | "每年秋天，我們鎮上都會舉辦豐收節。農夫們帶來巨大的橘色南瓜和其他各種瓜類，展示它們有多大。有個攤位賣當地一戶人家用桃子、櫻桃和野莓做的果醬。另一個攤位賣泡在醋和香草裡的罐裝橄欖，裝在紙箱裡。我最喜歡的是一個賣椰子蛋糕的小攤。街上擠到大家都被擠在一起，但似乎沒有人介意。一天結束時，還有最大南瓜比賽。去年的冠軍超過三百公斤！" |
| b2-u15-l02 | items/12/options | 第③關 S4 | ["olive","pumpkin","cherry","peach"] | ["olive","berry","cherry","peach"] |
| b2-u15-l02 | items/12/optionGlossZh | 第③關 S4 | ["橄欖","南瓜","櫻桃","桃子"] | ["橄欖","莓果","櫻桃","桃子"] |
| b2-u15-l02 | items/7/glossZh | 第②關 issue＋第③關 S5 | "（n）南瓜類（v）壓扁" | "（n）南瓜類（v）壓扁；擠" |
| b2-u15-l02 | items/9/options/1 | 執行長正解長度裁示修正 | "All year round" | "At any time of the year" |
| b2-u15-l02 | items/14/questions/0/options/2 | 執行長正解長度裁示修正 | "做成果醬" | "和桃子一起做成果醬來賣" |
| b2-u15-l02 | items/14/questions/0/options/3 | 執行長正解長度裁示修正 | "做成蛋糕" | "加進椰子蛋糕裡一起賣" |
| b2-u15-l02 | items/14/questions/1/options/0 | 執行長正解長度裁示修正 | "椰子蛋糕拍賣" | "椰子蛋糕的拍賣會" |
| b2-u15-l02 | items/14/passageEn | 第②關 issue 結案 |  | 已修正：見本檔 resolvedAfterFinalReview 中 items/14 的 5 筆修正紀錄。 |
| b2-u15-l02 | items/7/glossZh | 第②關 issue 結案 |  | 已修正：見本檔 resolvedAfterFinalReview 中 items/7 的 1 筆修正紀錄。 |
| b2-u15-l02 | items/3/exampleEn | 情境對照表重判 | "Bears eat a lot of berries in late summer." | "Berries like strawberries and blueberries are easy to freeze." |
| b2-u15-l02 | items/3/exampleZh | 情境對照表重判 | "熊在夏末會吃大量的莓果。" | "像草莓和藍莓這類莓果很容易冷凍。" |
| b2-u15-l02 | items/3/exampleEn | 情境對照表重判提案修正 | "Berries like strawberries and blueberries are easy to freeze." | "Berries like strawberries are easy to freeze and keep for months." |
| b2-u15-l02 | items/3/exampleZh | 情境對照表重判提案修正 | "像草莓和藍莓這類莓果很容易冷凍。" | "像草莓這類莓果很容易冷凍，可以放好幾個月。" |
| b2-u15-l02 | items/9/options/2 | 執行長正解長度裁示修正 | "Only in winter" | "Only in the cold winter" |
| b2-u15-l02 | items/14/questions/0/options/3 | 執行長正解長度裁示修正 | "加進椰子蛋糕裡一起賣" | "加進椰子蛋糕裡" |
| b2-u15-l03 | items/1/exampleEn | 第③關 S6 | "The soldiers in the old film ate stew from metal bowls." | "My mother puts carrots, potatoes and beans in her stew." |
| b2-u15-l03 | items/1/exampleZh | 第③關 S6 | "老電影裡，士兵們用鐵碗吃燉菜。" | "我媽媽在燉菜裡放紅蘿蔔、馬鈴薯和豆子。" |
| b2-u15-l03 | items/12/stemEn | 第②關 issue＋第③關 S7 | "This famous ____ is made in Scotland and aged in wooden barrels for years." | "This famous ____ is made in Ireland and aged in wooden barrels for years." |
| b2-u15-l03 | items/12/stemZh | 第③關 S7 | "這款知名的威士忌產自蘇格蘭，在木桶裡陳放多年。" | "這款知名的威士忌產自愛爾蘭，在木桶裡陳放多年。" |
| b2-u15-l03 | properNouns | 第③關 S7（專有名詞同步） | ["Scotland"] | ["Ireland"] |
| b2-u15-l03 | items/4/exampleEn | 第③關 G1（執行長裁示 | "Without enough sunlight, these plants will slowly starve." | "In the old story, the clever farmer never lets his family starve." |
| b2-u15-l03 | items/4/exampleZh | 第③關 G1（執行長裁示 | "沒有足夠的陽光，這些植物會慢慢缺乏養分。" | "在那個古老的故事裡，聰明的農夫從不讓家人挨餓。" |
| b2-u15-l03 | items/6/exampleEn | 第③關 G1（執行長裁示 | "This old table is made of solid walnut." | "My grandmother puts walnuts in her banana bread." |
| b2-u15-l03 | items/6/exampleZh | 第③關 G1（執行長裁示 | "這張舊桌子是實心胡桃木做的。" | "奶奶在香蕉麵包裡加核桃。" |
| b2-u15-l03 | items/13/questions/0/options/2 | 執行長正解長度裁示修正 | "核桃麵包" | "抹了厚厚奶油的核桃麵包" |
| b2-u15-l03 | items/13/questions/0/options/0 | 執行長正解長度裁示修正 | "炒蛋" | "炒蛋配烤好的吐司" |
| b2-u15-l03 | items/13/questions/1/options/2 | 執行長正解長度裁示修正 | "牠們在廚房門口等吃不完的食物" | "牠們等著吃剩下的食物" |
| b2-u15-l03 | items/13/questions/1/options/0 | 執行長正解長度裁示修正 | "主人每天買貓食" | "主人每天都會買貓食給牠們" |
| b2-u15-l03 | items/13/questions/1/options/1 | 執行長正解長度裁示修正 | "牠們會抓老鼠" | "牠們很會抓穀倉裡的老鼠" |
| b2-u15-l03 | items/12/stemEn | 第②關 issue 結案 |  | 已修正：見本檔 resolvedAfterFinalReview 中 items/12 的 2 筆修正紀錄。 |
| b2-u15-l03 | items/14/rubricZh/1 | 第②關 issue 結案 |  | 已於 259e7c4 依 §11.18 改為「時態合理即可（例如 put、has put）」。 |
| b2-u15-l03 | items/1/exampleEn | 情境對照表重判 | "My mother puts carrots, potatoes and beans in her stew." | "This restaurant serves a different stew every day of the week." |
| b2-u15-l03 | items/1/exampleZh | 情境對照表重判 | "我媽媽在燉菜裡放紅蘿蔔、馬鈴薯和豆子。" | "這家餐廳一週裡每天都供應不同的燉菜。" |
| b2-u15-l03 | items/4/exampleEn | 情境對照表重判 | "In the old story, the clever farmer never lets his family starve." | "In winter, deer may starve if snow covers all the grass." |
| b2-u15-l03 | items/4/exampleZh | 情境對照表重判 | "在那個古老的故事裡，聰明的農夫從不讓家人挨餓。" | "冬天如果大雪蓋住所有的草，鹿可能會挨餓。" |
| b2-u15-l03 | items/6/exampleEn | 情境對照表重判 | "My grandmother puts walnuts in her banana bread." | "Walnut trees can grow more than twenty meters tall." |
| b2-u15-l03 | items/6/exampleZh | 情境對照表重判 | "奶奶在香蕉麵包裡加核桃。" | "核桃樹可以長到二十多公尺高。" |
| b2-u15-l03 | items/8/options/2 | 執行長正解長度裁示修正 | "Flour and salt" | "Salt and oil" |
| b2-u15-l03 | items/8/options/3 | 執行長正解長度裁示修正 | "Honey and fruit" | "Tea and jam" |
| b2-u15-l03 | items/13/questions/1/options/3 | 執行長正解長度裁示修正 | "牠們吃乾草" | "牠們會跟著馬一起吃乾草" |
| b2-u15-l03 | items/13/questions/0/options/1 | 執行長正解長度裁示修正 | "燉牛肉" | "一鍋燉牛肉" |
| b2-u15-l04 | items/1/exampleEn | 第②關 issue＋第③關 FIX | "Salsa is also the name of a lively dance." | "The salsa at this restaurant is too spicy for my kids." |
| b2-u15-l04 | items/1/exampleZh | 第②關 issue＋第③關 FIX | "騷莎也是一種熱情舞蹈的名稱。" | "這家餐廳的莎莎醬太辣了，我的孩子吃不了。" |
| b2-u15-l04 | items/1/glossZh | 第②關 issue＋第③關 FIX | "莎莎醬；騷莎舞" | "莎莎醬" |
| b2-u15-l04 | items/14/promptZh | 第③關 FIX | "我想在玉米片上加點莎莎醬。" | "我想在烤魚上加點莎莎醬。" |
| b2-u15-l04 | items/14/referenceEn | 第③關 FIX | ["I'd like to add some salsa to my chips.","I want to put some salsa on my corn chips."] | ["I'd like to add some salsa to my grilled fish.","I want to put some salsa on my grilled fish."] |
| b2-u15-l04 | items/14/rubricZh/1 | 第③關 FIX | "「想」可寫 I'd like to、I want to 等；「玉米片」可寫 chips、corn chips" | "「想」可寫 I'd like to、I want to 等；「烤魚」可寫 grilled fish 等" |
| b2-u15-l04 | items/7/sentenceZh | 第②關 issue | "在許多國家，黃豆被用來做豆漿和醬油。" | "在許多國家，黃豆被用來做豆漿和醬料。" |
| b2-u15-l04 | items/13/questions/0/options/0 | 執行長正解長度裁示修正 | "芒果糯米飯" | "甜芒果配糯米飯" |
| b2-u15-l04 | items/13/questions/0/options/3 | 執行長正解長度裁示修正 | "豆漿甜點" | "豆漿和水果做的甜點" |
| b2-u15-l04 | items/1/exampleEn | 第②關 issue 結案 |  | 已修正：見本檔 resolvedAfterFinalReview 中 items/1 的 3 筆修正紀錄。 |
| b2-u15-l04 | items/7/sentenceZh | 第②關 issue 結案 |  | 已修正：見本檔 resolvedAfterFinalReview 中 items/7 的 1 筆修正紀錄。 |
| b2-u15-l04 | items/2/exampleEn | 情境對照表重判 | "The kittens were starving, so we gave them warm milk." | "The starving kittens followed us all the way home." |
| b2-u15-l04 | items/2/exampleZh | 情境對照表重判 | "小貓們餓壞了，所以我們給牠們溫牛奶。" | "那幾隻餓壞的小貓一路跟著我們回家。" |
| b2-u15-l04 | items/8/options/1 | 執行長正解長度裁示修正 | "A cold drink" | "A cold drink of water" |
| b2-u15-l04 | items/8/options/2 | 執行長正解長度裁示修正 | "A short rest" | "A short rest on the sofa" |
| b2-u15-l04 | items/13/questions/0/options/1 | 執行長正解長度裁示修正 | "墨西哥菜配莎莎醬" | "墨西哥料理" |
| b2-u15-l04 | items/13/questions/0/options/2 | 執行長正解長度裁示修正 | "麵包布丁" | "香濃的麵包布丁" |
| b2-u15-l04 | items/13/questions/1/options/2 | 執行長正解長度裁示修正 | "薄荷冰茶" | "加薄荷的冰茶" |
| b2-u15-l05 | items/11/stemEn | 第②關 issue＋第③關 FIX | "The waiter served a bowl of ____ cooked in garlic and white wine." | "The waiter served a bowl of ____ in their shells, cooked in garlic and white wine." |
| b2-u15-l05 | items/11/stemZh | 第③關 FIX | "服務生端上一碗用大蒜和白酒煮的蛤蜊。" | "服務生端上一碗帶殼的蛤蜊，用大蒜和白酒煮的。" |
| b2-u15-l05 | items/12/stemEn | 第②關 issue＋第③關 FIX | "This whiskey is called ____ because it was first made in the United States." | "This kind of whiskey is called ____, and much of it is made in Kentucky." |
| b2-u15-l05 | items/12/stemZh | 第③關 FIX | "這種威士忌叫波本，因為它最早是在美國生產的。" | "這種威士忌叫波本，大部分產自肯塔基州。" |
| b2-u15-l05 | items/4/exampleEn | 執行長裁示（可查證規定一律中性敘述） | "Bourbon must be stored in new wooden barrels." | "Bourbon gets its color from the wooden barrels it is kept in." |
| b2-u15-l05 | items/4/exampleZh | 執行長裁示（可查證規定一律中性敘述） | "波本威士忌必須存放在新的木桶裡。" | "波本威士忌的顏色來自存放它的木桶。" |
| b2-u15-l05 | items/2/exampleEn | 第②關 issue＋第③關 S8 | "The nervous speaker gulped before walking onto the stage." | "He drank the whole bottle of water in a few gulps after the race." |
| b2-u15-l05 | items/2/exampleZh | 第②關 issue＋第③關 S8 | "那位緊張的講者走上台前吞了一下口水。" | "賽跑後，他幾大口就喝光了一整瓶水。" |
| b2-u15-l05 | items/2/glossZh | 第②關 issue＋第③關 S8 | "大口吞；倒吸一口氣" | "大口吞（下）；一大口" |
| b2-u15-l05 | items/14/referenceEn/1 | 第③關 S8 | "He gulped the cold water down in one go." | "He drank the glass of ice water in one gulp." |
| b2-u15-l05 | items/14/referenceEn/1 | 情境對照表重判 | "He drank the glass of ice water in one gulp." | "He gulped the cold water down in one go." |
| b2-u15-l05 | items/13/questions/1/options/1 | 執行長正解長度裁示修正 | "晚餐時喝" | "留著晚餐時自己喝" |
| b2-u15-l05 | items/12/stemEn | 第②關 issue 結案 |  | 已修正：見本檔 resolvedAfterFinalReview 中 items/12 的 2 筆修正紀錄。 |
| b2-u15-l05 | items/2/glossZh | 第②關 issue 結案 |  | 已修正：見本檔 resolvedAfterFinalReview 中 items/2 的 3 筆修正紀錄。 |
| b2-u15-l05 | items/11 | 第②關 issue 結案 |  | 已修正：見本檔 resolvedAfterFinalReview 中 items/11 的 2 筆修正紀錄。 |
| b2-u15-l05 | items/14/rubricZh/1 | 第②關 issue 結案 |  | 已於 259e7c4 依 §11.18 改為「時態合理即可（例如 gulped、has gulped）」。 |
| b2-u15-l05 | items/2/exampleEn | 情境對照表重判 | "He drank the whole bottle of water in a few gulps after the race." | "He took a big gulp of air and dived under the water." |
| b2-u15-l05 | items/2/exampleZh | 情境對照表重判 | "賽跑後，他幾大口就喝光了一整瓶水。" | "他大大吸了一口氣，潛進水裡。" |
| b2-u15-l05 | items/13/questions/1/options/0 | 執行長正解長度裁示修正 | "收藏起來" | "自己收藏起來" |
| b2-u15-l05 | items/13/questions/1/options/2 | 執行長正解長度裁示修正 | "拿來做菜" | "拿來燉菜用" |
| b2-u15-l06 | items/13/passageEn | 第②關 issue＋第③關 S9 | "My cousin from London visited us last summer, and we took her to a night market full of colorful lighting. At first, she asked a seller for an aubergine, and he had no idea what she meant until she pointed at one. She tried grilled prawns, fried spareribs and a spicy mutton soup. 'Yummy!' she said after every bite. At a fish stall, she was surprised to see ling, a fish she usually eats fried at home. Before we left, she bought a bag of junk food to share with her friends back in England. She said the market was like a giant cupboard full of new flavors." | "My cousin from London visited us last summer, and we took her to a night market full of colorful lighting. At first, she pointed at a purple vegetable and called it an aubergine, and we all stared at her. She tried grilled prawns, fried spareribs and a spicy mutton soup. 'Yummy!' she said after every bite. At a fish stall, she was surprised to see ling, a fish she usually eats fried at home. Before we left, she bought a bag of junk food to share with her friends back in England. She said the market was like a giant cupboard full of new flavors." |
| b2-u15-l06 | items/13/passageZh | 第②關 issue | "我住在倫敦的表姊去年夏天來找我們，我們帶她去逛燈光繽紛的夜市。一開始，她用英式說法向老闆要茄子，老闆完全聽不懂，直到她用手指了才明白。她吃了烤明蝦、炸排骨和一碗辣羊肉湯。每吃一口她就說：「好好吃！」在一個魚攤，她很驚訝看到長鱈，那是她在家常吃的炸魚。離開前，她買了一袋零食，要帶回英國和朋友分享。她說夜市就像一個裝滿新口味的大櫥櫃。" | "我住在倫敦的表姊去年夏天來找我們，我們帶她去逛燈光繽紛的夜市。一開始，她指著一種紫色的蔬菜，叫它 aubergine，我們全都愣住了。她吃了烤明蝦、炸排骨和一碗辣羊肉湯。每吃一口她就說：「好好吃！」在一個魚攤，她很驚訝看到長鱈，那是她在家常吃的炸魚。離開前，她買了一袋零食，要帶回英國和朋友分享。她說夜市就像一個裝滿新口味的大櫥櫃。" |
| b2-u15-l06 | items/13/passageZh | 第②關 issue | "我住在倫敦的表姊去年夏天來找我們，我們帶她去逛燈光繽紛的夜市。一開始，她指著一種紫色的蔬菜，叫它 aubergine，我們全都愣住了。她吃了烤明蝦、炸排骨和一碗辣羊肉湯。每吃一口她就說：「好好吃！」在一個魚攤，她很驚訝看到長鱈，那是她在家常吃的炸魚。離開前，她買了一袋零食，要帶回英國和朋友分享。她說夜市就像一個裝滿新口味的大櫥櫃。" | "我住在倫敦的表姊去年夏天來找我們，我們帶她去逛燈光繽紛的夜市。一開始，她指著一種紫色的蔬菜，叫它 aubergine，我們全都愣住了。她吃了烤明蝦、炸排骨和一碗辣羊肉湯。每吃一口她就說：「好好吃！」在一個魚攤，她很驚訝看到長鱈，那是她在家常吃的炸魚。離開前，她買了一袋垃圾食物，要帶回英國和朋友分享。她說夜市就像一個裝滿新口味的大櫥櫃。" |
| b2-u15-l06 | items/13/questions/0/questionZh | 第③關 S9 | "老闆一開始為什麼聽不懂表姊？" | "表姊一開始說了什麼，讓大家愣住？" |
| b2-u15-l06 | items/13/questions/0/options | 第③關 S9 | ["她用了老闆不熟悉的說法","她聽不懂中文","她不喜歡茄子","夜市太吵了"] | ["用了一個英式的說法","說她從來不吃辣的東西","說夜市比倫敦的還大","說她想先去買紀念品"] |
| b2-u15-l06 | items/10/sentenceEn | 第③關 S10 | "My mom's sweet and sour spareribs are famous in our family." | "My dad grills spareribs in the backyard every summer." |
| b2-u15-l06 | items/10/sentenceZh | 第③關 S10 | "我媽媽的糖醋排骨在我們家很有名。" | "我爸每年夏天都在後院烤排骨。" |
| b2-u15-l06 | items/8/options/2 | 執行長正解長度裁示修正 | "The fish soup" | "The hot fish soup" |
| b2-u15-l06 | items/13/questions/1/options/2 | 執行長正解長度裁示修正 | "烤來吃" | "放進烤箱烤來吃" |
| b2-u15-l06 | items/13/passageZh | 第②關 issue 結案 |  | 已修正：見本檔 resolvedAfterFinalReview 中 items/13 的 6 筆修正紀錄。 |
| b2-u15-l06 | items/0/exampleEn | 情境對照表重判 | "The little girl licked her spoon and said the ice cream was yummy." | "This yummy soup takes only ten minutes to make." |
| b2-u15-l06 | items/0/exampleZh | 情境對照表重判 | "小女孩舔了舔湯匙，說冰淇淋好好吃。" | "這道好喝的湯十分鐘就能煮好。" |
| b2-u15-l06 | items/3/exampleEn | 情境對照表重判 | "Our local fish market gets fresh ling twice a week." | "A ling has a long, thin body and can grow up to two meters long." |
| b2-u15-l06 | items/3/exampleZh | 情境對照表重判 | "我們當地的魚市一週進兩次新鮮長鱈。" | "長鱈的身體又細又長，最長可以長到兩公尺。" |
| b2-u15-l06 | items/8/options/1 | 執行長正解長度裁示修正 | "The mutton" | "The mutton soup" |
| b2-u15-l06 | items/13/questions/0/options/2 | 執行長正解長度裁示修正 | "說夜市比倫敦的還大" | "說夜市比倫敦大" |
| b2-u15-l06 | items/13/questions/0/options/3 | 執行長正解長度裁示修正 | "說她想先去買紀念品" | "說她想買紀念品" |
| b2-u15-l06 | items/13/questions/1/options/1 | 執行長正解長度裁示修正 | "做成湯" | "做成魚湯" |
| b2-u15-l06 | items/13/questions/1/options/2 | 執行長正解長度裁示修正 | "放進烤箱烤來吃" | "用烤箱烤" |
| b2-u16-l01 | items/7/exampleEn | 第②關 issue＋第③關 FIX＋第③關 G1（執行長裁示 | "Finding the lost ring in the sand was a real stroke of luck." | "A stroke happens when blood cannot reach part of the brain." |
| b2-u16-l01 | items/7/exampleZh | 第②關 issue＋第③關 FIX＋第③關 G1（執行長裁示 | "在沙灘裡找到那枚遺失的戒指，真是運氣好。" | "中風是血液無法送到腦部某處時發生的。" |
| b2-u16-l01 | items/7/glossZh | 第②關 issue＋第③關 FIX＋第③關 G1（執行長裁示 | "一筆；划水動作；中風" | "中風；一筆；（v）輕撫" |
| b2-u16-l01 | items/7/distractorsZh | 第③關 G1（執行長裁示 | ["一步","一聲","一眼"] | ["感冒","過敏","骨折"] |
| b2-u16-l01 | items/1/exampleEn | 第③關 G1（執行長裁示 | "A small dose of humor can make a long meeting more pleasant." | "The label shows how many doses are in each bottle." |
| b2-u16-l01 | items/1/exampleZh | 第③關 G1（執行長裁示 | "一點點幽默就能讓冗長的會議愉快一些。" | "標籤上寫著每瓶有幾劑。" |
| b2-u16-l01 | items/17/instructionZh | 第③關 S11 | "用 flesh 造一個句子，描述一種水果的果肉。" | "用 flesh 造一個句子，描述水果、魚或肉的肉質。" |
| b2-u16-l01 | items/17/referenceEn | 第③關 S11 | ["I love the soft orange flesh of a ripe mango.","The flesh of this apple is white and crisp."] | ["I like fish with firm white flesh.","The flesh of a ripe mango is soft and sweet."] |
| b2-u16-l01 | items/15/questions/0/options/0 | 執行長正解長度裁示修正 | "為了做新藥" | "為了研發新的藥物給病人" |
| b2-u16-l01 | items/15/questions/0/options/2 | 執行長正解長度裁示修正 | "為了教學生" | "為了教牙醫系的學生" |
| b2-u16-l01 | items/7/glossZh | 第②關 issue 結案 |  | 已修正：見本檔 resolvedAfterFinalReview 中 items/7 的 4 筆修正紀錄。 |
| b2-u16-l01 | items/16/rubricZh/1 | 第②關 issue 結案 |  | 已於 259e7c4 依 §11.18 改為「時態合理即可（例如 stroked、strokes）」。 |
| b2-u16-l01 | items/6/word | 第②關 issue 結案 |  | 不改：schema 規定 word 為小寫 headword，課綱即為 dna；例句、跟讀與閱讀一律寫 DNA，聽打題不考此字。 |
| b2-u16-l01 | items/0/exampleEn | 情境對照表重判 | "The company spent ten years developing the new medication." | "Pharmacies keep some medications in special refrigerators." |
| b2-u16-l01 | items/0/exampleZh | 情境對照表重判 | "那家公司花了十年研發這款新藥。" | "藥局會把某些藥物放在專用的冰箱裡。" |
| b2-u16-l01 | items/2/exampleEn | 情境對照表重判 | "The hotel offers a foot massage after a long day of walking." | "Massage has been part of daily life in many cultures for thousands of years." |
| b2-u16-l01 | items/2/exampleZh | 情境對照表重判 | "飯店在走了一整天路之後提供足部按摩。" | "幾千年來，按摩在許多文化中一直是日常生活的一部分。" |
| b2-u16-l01 | items/3/exampleEn | 情境對照表重判 | "She is studying at a dental school in the city." | "Early dental tools looked very different from the ones we use today." |
| b2-u16-l01 | items/3/exampleZh | 情境對照表重判 | "她在城裡一所牙醫學院就讀。" | "早期的牙科工具和我們今天用的很不一樣。" |
| b2-u16-l01 | items/10/options/1 | 執行長正解長度裁示修正 | "At three" | "At three o'clock" |
| b2-u16-l01 | items/10/options/2 | 執行長正解長度裁示修正 | "Around five" | "Around half past five" |
| b2-u16-l01 | items/15/questions/0/options/2 | 執行長正解長度裁示修正 | "為了教牙醫系的學生" | "為了教牙醫系的學生上課" |
| b2-u16-l01 | items/15/questions/0/options/3 | 執行長正解長度裁示修正 | "為了拍影片" | "為了拍一部影片" |
| b2-u16-l02 | items/15/rubricZh/1 | 第③關 FIX | "「酸的」用 sour；可寫 contains… 或 there is… in" | "「很酸」可寫 very sour 等（寫 acidic 也正確）；可寫 contains… 或 there is… in 等" |
| b2-u16-l02 | items/14/passageEn | 第③關 S21 | "In biology class, we learned how the body works. Our teacher explained that the stomach uses a strong acid to break down food, from pancakes to vegetables. Then she asked us to find our pulse and count it for one minute. Next, we studied the bones in our limbs and learned that the thigh bone is the longest in the human body. The jaw, she said, is one of the strongest. She also mentioned that some cells can form a tumor, which scientists are still researching. Finally, she warned us that many cleaning products are toxic, so we should always read the labels. One student joked that the lesson was less bloody than he had expected." | "In biology class, we learned how the body works. Our teacher explained that the stomach uses a strong acid to break down food, from pancakes to vegetables. Then she asked us to find our pulse and count it for one minute. Next, we studied the bones in our limbs and learned that the thigh bone is the longest in the human body. The jaw, she said, is the strongest bone in the face. She also mentioned that some cells can form a tumor, which scientists are still researching. Finally, she warned us that many cleaning products are toxic, so we should always read the labels. One student joked that the lesson was less bloody than he had expected." |
| b2-u16-l02 | items/14/passageZh | 第③關 S21 | "生物課上，我們學了人體如何運作。老師解釋，胃會用很強的酸來分解食物，從鬆餅到蔬菜都一樣。接著她要我們找到自己的脈搏，數一分鐘。然後我們研究四肢的骨頭，學到大腿骨是人體最長的骨頭。她說，下顎是最強壯的骨頭之一。她也提到有些細胞會形成腫瘤，科學家仍在研究這件事。最後，她提醒我們很多清潔用品是有毒的，所以一定要看標示。有個同學開玩笑說，這堂課沒有他想像中那麼血腥。" | "生物課上，我們學了人體如何運作。老師解釋，胃會用很強的酸來分解食物，從鬆餅到蔬菜都一樣。接著她要我們找到自己的脈搏，數一分鐘。然後我們研究四肢的骨頭，學到大腿骨是人體最長的骨頭。她說，下顎是臉部最強壯的骨頭。她也提到有些細胞會形成腫瘤，科學家仍在研究這件事。最後，她提醒我們很多清潔用品是有毒的，所以一定要看標示。有個同學開玩笑說，這堂課沒有他想像中那麼血腥。" |
| b2-u16-l02 | items/1/exampleEn | 第③關 G1（執行長裁示 | "Strong winds broke a large limb off the old oak tree." | "The tall basketball player has very long limbs." |
| b2-u16-l02 | items/1/exampleZh | 第③關 G1（執行長裁示 | "強風把老橡樹的一根大樹枝吹斷了。" | "那位高個子籃球員四肢很長。" |
| b2-u16-l02 | items/14/questions/1/options/1 | 執行長正解長度裁示修正 | "因為食物會過期" | "因為很多食物很快就會過期" |
| b2-u16-l02 | items/14/questions/1/options/2 | 執行長正解長度裁示修正 | "因為作業要用到" | "因為下次的作業要用到" |
| b2-u16-l02 | items/9/options/3 | 執行長正解長度裁示修正 | "Pork spareribs" | "Fresh pork spareribs" |
| b2-u16-l02 | items/3/exampleEn | 情境對照表重判 | "Some common garden plants are toxic to cats." | "Some frogs produce a toxic liquid on their skin to protect themselves." |
| b2-u16-l02 | items/3/exampleZh | 情境對照表重判 | "有些常見的園藝植物對貓有毒。" | "有些青蛙的皮膚會分泌有毒的液體來保護自己。" |
| b2-u16-l02 | items/5/exampleEn | 情境對照表重判 | "Researchers are studying why some tumors grow faster than others." | "Modern machines can find a very small tumor inside the body." |
| b2-u16-l02 | items/5/exampleZh | 情境對照表重判 | "研究人員正在探究為什麼有些腫瘤長得比其他的快。" | "現代的儀器可以在體內找到很小的腫瘤。" |
| b2-u16-l02 | items/9/options/1 | 執行長正解長度裁示修正 | "Beef steaks" | "Beef steaks and burgers" |
| b2-u16-l02 | items/14/questions/0/options/1 | 執行長正解長度裁示修正 | "下顎骨" | "下巴骨頭" |
| b2-u16-l02 | items/14/questions/0/options/2 | 執行長正解長度裁示修正 | "手臂骨" | "臂骨" |
| b2-u16-l02 | items/14/questions/1/options/0 | 執行長正解長度裁示修正 | "因為很多清潔用品有毒" | "因為清潔用品有毒" |
| b2-u16-l02 | items/14/questions/1/options/3 | 執行長正解長度裁示修正 | "因為要考試" | "因為下週就要考試了" |
| b2-u16-l03 | items/7/exampleEn | 第③關 FIX | "This highway is the main artery connecting the two cities." | "In biology class, we drew the heart and the large arteries around it." |
| b2-u16-l03 | items/7/exampleZh | 第③關 FIX | "這條高速公路是連接兩座城市的主要幹道。" | "生物課上，我們畫了心臟和它周圍的大動脈。" |
| b2-u16-l03 | items/6/exampleEn | 第③關 FIX＋第③關 G1（執行長裁示 | "The new factory brought a welcome injection of jobs into the town." | "Some children are afraid of injections, so the nurse gives each one a sticker." |
| b2-u16-l03 | items/6/exampleZh | 第③關 FIX＋第③關 G1（執行長裁示 | "新工廠為小鎮注入了一批令人欣喜的工作機會。" | "有些小孩怕打針，所以護理師會給每個小孩一張貼紙。" |
| b2-u16-l03 | items/0/exampleEn | 第③關 G1（執行長裁示 | "The restaurant's famous dish is beef ribs with a sweet sauce." | "Humans have twelve pairs of ribs." |
| b2-u16-l03 | items/0/exampleZh | 第③關 G1（執行長裁示 | "那家餐廳的招牌菜是甜醬牛肋排。" | "人類有十二對肋骨。" |
| b2-u16-l03 | items/1/exampleEn | 第③關 G1（執行長裁示 | "Forgetting to save the file was a fatal mistake; I lost three hours of work." | "Some kinds of wild mushrooms are fatal if you eat them." |
| b2-u16-l03 | items/1/exampleZh | 第③關 G1（執行長裁示 | "忘了存檔是個致命的錯誤，我白做了三小時。" | "有些野生蘑菇吃了會致命。" |
| b2-u16-l03 | items/2/exampleEn | 第③關 G1（執行長裁示 | "The old tree still has a scar where lightning hit it." | "Most small scars fade with time." |
| b2-u16-l03 | items/2/exampleZh | 第③關 G1（執行長裁示 | "那棵老樹被閃電劈過的地方，至今還留著一道疤痕。" | "大部分的小疤痕會隨著時間變淡。" |
| b2-u16-l03 | items/4/exampleEn | 第③關 G1（執行長裁示 | "Her good mood soon infected everyone at the party." | "Some viruses infect only birds." |
| b2-u16-l03 | items/4/exampleZh | 第③關 G1（執行長裁示 | "她的好心情很快就感染了派對上的每個人。" | "有些病毒只會感染鳥類。" |
| b2-u16-l03 | items/4/exampleEn | 第③關 G1 | "Some viruses infect only birds." | "Some kinds of viruses infect only birds." |
| b2-u16-l03 | items/14/questions/0/options/3 | 執行長正解長度裁示修正 | "一家當地公司給了一大筆錢" | "當地公司給了一大筆錢" |
| b2-u16-l03 | items/14/questions/0/options/0 | 執行長正解長度裁示修正 | "球員們辦了義賣" | "球員們辦了義賣籌到不少錢" |
| b2-u16-l03 | items/14/questions/0/options/2 | 執行長正解長度裁示修正 | "教練自己出錢" | "教練自己出錢買給大家" |
| b2-u16-l03 | items/14/questions/1/options/2 | 執行長正解長度裁示修正 | "因為電腦病毒全部遺失了" | "被電腦病毒弄丟了" |
| b2-u16-l03 | items/14/questions/1/options/1 | 執行長正解長度裁示修正 | "被教練刪掉了" | "被教練不小心刪掉了" |
| b2-u16-l03 | items/6/exampleEn | 第②關 issue 結案 |  | 已修正：見本檔 resolvedAfterFinalReview 中 items/6 的 2 筆修正紀錄。 |
| b2-u16-l03 | items/3/exampleEn | 情境對照表重判 | "Some games are designed to create an addiction to winning prizes." | "Scientists study how addiction changes the way the brain works." |
| b2-u16-l03 | items/3/exampleZh | 情境對照表重判 | "有些遊戲刻意設計成讓人對贏獎品上癮。" | "科學家研究成癮如何改變大腦運作的方式。" |
| b2-u16-l03 | items/9/options/3 | 執行長正解長度裁示修正 | "Delete the files" | "Delete files" |
| b2-u16-l03 | items/14/questions/0/options/3 | 執行長正解長度裁示修正 | "當地公司給了一大筆錢" | "一家當地公司給了一大筆錢" |
| b2-u16-l03 | items/14/questions/0/options/0 | 執行長正解長度裁示修正 | "球員們辦了義賣籌到不少錢" | "球員們辦了義賣籌到錢" |
| b2-u16-l03 | items/14/questions/1/options/0 | 執行長正解長度裁示修正 | "被其他球隊偷走了" | "被別隊偷走了" |
| b2-u16-l04 | items/3/exampleEn | 第③關 FIX | "Pack the peaches carefully so they don't bruise." | "The bruise on his leg turned from purple to yellow over a week." |
| b2-u16-l04 | items/3/exampleZh | 第③關 FIX | "把桃子小心裝好，以免碰傷。" | "他腿上的瘀青在一週內從紫色變成黃色。" |
| b2-u16-l04 | items/5/exampleEn | 第③關 FIX | "The IT team quickly removed the infected files from the server." | "Scientists kept the infected mosquitoes in a separate room of the lab." |
| b2-u16-l04 | items/5/exampleZh | 第③關 FIX | "資訊團隊很快把中毒的檔案從伺服器上移除了。" | "科學家把受感染的蚊子關在實驗室的另一個房間。" |
| b2-u16-l04 | items/14/passageEn | 第③關 FIX | "Our school held a science fair in the main corridor last month. One group explained how the respiratory system works, using a model made of balloons. Another group showed how computer viruses spread and how to clean infected files. A third team interviewed a researcher about the history of chemotherapy and how it has improved over the years. My group's project was about sleep. We found that many students suffer from exhaustion because they stay up late. One student, a self-described phone addict, admitted he slept only five hours a night. Our teacher's excitement about the fair was infectious, and everyone left feeling inspired." | "Our school held a science fair in the main corridor last month. One group explained how the respiratory system works, using a model made of balloons. Another group showed how computer viruses spread and how to clean infected files. A third team interviewed a researcher about the history of chemotherapy and how it has improved over the years. My group's project was about sleep. We found that many students suffer from exhaustion because they stay up late. One student, a self-described phone addict, admitted he slept only five hours a night. Everyone left the fair feeling inspired." |
| b2-u16-l04 | items/14/passageZh | 第③關 FIX | "我們學校上個月在主走廊舉辦了科學展。有一組用氣球做的模型解釋呼吸系統怎麼運作。另一組展示電腦病毒如何擴散，以及如何清除中毒的檔案。第三組訪問了一位研究人員，請教化學治療的歷史，以及這些年來有什麼改進。我這組的專題是睡眠。我們發現很多學生因為熬夜而筋疲力盡。有位自稱手機成癮的同學承認，他每晚只睡五個小時。老師對科學展的熱情很有感染力，大家離開時都覺得很受啟發。" | "我們學校上個月在主走廊舉辦了科學展。有一組用氣球做的模型解釋呼吸系統怎麼運作。另一組展示電腦病毒如何擴散，以及如何清除中毒的檔案。第三組訪問了一位研究人員，請教化學治療的歷史，以及這些年來有什麼改進。我這組的專題是睡眠。我們發現很多學生因為熬夜而筋疲力盡。有位自稱手機成癮的同學承認，他每晚只睡五個小時。大家離開科學展時都覺得很受啟發。" |
| b2-u16-l04 | items/1/exampleEn | 第③關 G1（執行長裁示 | "The teacher's love of science was infectious, and soon the whole class enjoyed it." | "Flu is very infectious, especially in crowded places." |
| b2-u16-l04 | items/1/exampleZh | 第③關 G1（執行長裁示 | "老師對科學的熱愛很有感染力，不久全班都喜歡上了。" | "流感的傳染力很強，尤其在擁擠的地方。" |
| b2-u16-l04 | items/1/glossZh | 第③關 G1（執行長裁示 | "有感染力的；傳染性的" | "傳染性的；有感染力的" |
| b2-u16-l04 | items/9/options/1 | 執行長正解長度裁示修正 | "Fell off a bike" | "Fell off a bike today" |
| b2-u16-l04 | items/0/exampleEn | 情境對照表重判 | "As a true football addict, she never misses a match on TV." | "This bookshop is a favorite place for mystery novel addicts." |
| b2-u16-l04 | items/0/exampleZh | 情境對照表重判 | "她是個十足的足球迷，電視上的比賽一場都不錯過。" | "這家書店是推理小說迷最愛去的地方。" |
| b2-u16-l04 | items/4/exampleEn | 情境對照表重判 | "Chemotherapy was first developed in the middle of the last century." | "The word chemotherapy is made from 'chemical' and 'therapy'." |
| b2-u16-l04 | items/4/exampleZh | 情境對照表重判 | "化學治療最早是在上個世紀中期發展出來的。" | "chemotherapy 這個字由「chemical」和「therapy」兩個字組成。" |
| b2-u16-l04 | items/9/options/1 | 執行長正解長度裁示修正 | "Fell off a bike today" | "Fell off a bike" |
| b2-u16-l04 | items/14/questions/0/options/0 | 執行長正解長度裁示修正 | "睡眠" | "學生的睡眠" |
| b2-u16-l05 | items/11/sentenceEn | 第③關 S13 | "During the rough flight, a few passengers felt sick and vomited." | "The smell of the old fish was so bad that I almost vomited." |
| b2-u16-l05 | items/11/sentenceZh | 第③關 S13 | "飛機一路顛簸，有幾位乘客覺得不舒服，吐了出來。" | "那條放久的魚臭到我差點吐出來。" |
| b2-u16-l05 | items/5/exampleEn | 第③關 G2 | "A new vaccine against malaria was approved in recent years." | "Many scientists around the world are studying malaria." |
| b2-u16-l05 | items/5/exampleZh | 第③關 G2 | "近年來，一種新的瘧疾疫苗獲得了核准。" | "世界各地有許多科學家在研究瘧疾。" |
| b2-u16-l05 | items/16/rubricZh/1 | 第②關 issue | "描述要合理；動物用 it 或 its" | "描述要合理；動物可用 it，也可用 he、she" |
| b2-u16-l05 | items/9/options/2 | 執行長正解長度裁示修正 | "The weather was hot" | "The weather was very hot" |
| b2-u16-l05 | items/14/questions/1/options/3 | 執行長正解長度裁示修正 | "簡單的做法如何保護很多人" | "簡單做法如何保護很多人" |
| b2-u16-l05 | items/14/questions/1/options/2 | 執行長正解長度裁示修正 | "城市為什麼擁擠" | "以前的城市為什麼又擠又髒" |
| b2-u16-l05 | items/14/questions/1/options/1 | 執行長正解長度裁示修正 | "如何研發新藥" | "科學家如何研發新的藥" |
| b2-u16-l05 | items/16/rubricZh/1 | 第②關 issue 結案 |  | 已修正：見本檔 resolvedAfterFinalReview 中 items/16 的 1 筆修正紀錄。 |
| b2-u16-l05 | items/3/exampleEn | 情境對照表重判 | "A vaccine against tuberculosis has been in use for about a hundred years." | "Tuberculosis usually affects the lungs, but it can also affect other parts of the body." |
| b2-u16-l05 | items/3/exampleZh | 情境對照表重判 | "對抗肺結核的疫苗已經使用了大約一百年。" | "肺結核通常影響肺部，但也可能影響身體的其他部位。" |
| b2-u16-l05 | items/9/options/1 | 執行長正解長度裁示修正 | "The boat trip was rough" | "The trip was rough" |
| b2-u16-l05 | items/9/options/0 | 執行長正解長度裁示修正 | "The food was bad" | "The food was very bad" |
| b2-u16-l05 | items/14/questions/0/options/2 | 執行長正解長度裁示修正 | "透過蚊子" | "透過蚊子叮咬" |
| b2-u16-l05 | items/14/questions/1/options/2 | 執行長正解長度裁示修正 | "以前的城市為什麼又擠又髒" | "以前的城市為什麼很髒" |
| b2-u16-l06 | items/2/exampleEn | 第③關 FIX | "A computer failure crippled the airline's booking system for a whole day." | "High fuel prices crippled many small fishing businesses last year." |
| b2-u16-l06 | items/2/exampleZh | 第③關 FIX | "一次電腦故障讓航空公司的訂位系統癱瘓了一整天。" | "去年油價高漲，重創了許多小型漁業。" |
| b2-u16-l06 | items/11/sentenceEn | 第②關 issue | "Some microbes in our stomachs actually help us break down food." | "Some microbes in our gut actually help us break down food." |
| b2-u16-l06 | items/11/sentenceZh | 第②關 issue | "我們胃裡的有些微生物其實會幫助分解食物。" | "我們腸道裡的有些微生物其實會幫助分解食物。" |
| b2-u16-l06 | items/7/exampleEn | 第②關 issue | "Diarrhea is one of the most common topics in public health research." | "The word diarrhea comes from a Greek word meaning 'to flow through'." |
| b2-u16-l06 | items/7/exampleZh | 第②關 issue | "腹瀉是公共衛生研究中最常見的主題之一。" | "diarrhea 這個字源自意思是「流過」的希臘字。" |
| b2-u16-l06 | properNouns | 第②關 issue（專有名詞同步） | [] | ["Greek"] |
| b2-u16-l06 | items/1/exampleEn | 第②關 issue＋第③關 G1（執行長裁示 | "The idea for the business began as a tiny germ of an idea during a coffee break." | "Germs can spread quickly in crowded classrooms." |
| b2-u16-l06 | items/1/exampleZh | 第②關 issue＋第③關 G1（執行長裁示 | "這門生意最初只是咖啡休息時萌生的一個小念頭。" | "病菌在擁擠的教室裡傳播得很快。" |
| b2-u16-l06 | items/6/exampleEn | 第③關 S14（嚴格標準） | "The city spent millions improving sanitation in its older neighborhoods." | "Sanitation workers collect the city's trash every night." |
| b2-u16-l06 | items/6/exampleZh | 第③關 S14（嚴格標準） | "這座城市花了數百萬改善老舊街區的衛生設施。" | "清潔隊員每天晚上收集城市的垃圾。" |
| b2-u16-l06 | items/4/exampleEn | 第③關 S14＋第③關 G1（執行長裁示 | "Too many choices can cause a kind of paralysis when you shop online." | "Sleep paralysis is a strange feeling that some people have when waking up." |
| b2-u16-l06 | items/4/exampleZh | 第③關 S14＋第③關 G1（執行長裁示 | "網購時選擇太多，可能會讓人陷入一種無法決定的癱瘓狀態。" | "睡眠癱瘓是有些人醒來時會有的奇怪感覺。" |
| b2-u16-l06 | items/11/sentenceEn | 第②關 issue | "Some microbes in our gut actually help us break down food." | "Some microbes inside our bodies actually help us break down food." |
| b2-u16-l06 | items/11/sentenceZh | 第②關 issue | "我們腸道裡的有些微生物其實會幫助分解食物。" | "我們體內的有些微生物其實會幫助分解食物。" |
| b2-u16-l06 | items/9/options/1 | 執行長正解長度裁示修正 | "Woke up late" | "Woke up too late" |
| b2-u16-l06 | items/14/questions/0/options/3 | 執行長正解長度裁示修正 | "因為身體透過發炎對抗病菌" | "因為身體在對抗病菌" |
| b2-u16-l06 | items/14/questions/0/options/2 | 執行長正解長度裁示修正 | "因為傷口太深" | "因為傷口割得太深又流血" |
| b2-u16-l06 | items/14/questions/0/options/1 | 執行長正解長度裁示修正 | "因為天氣太熱" | "因為那天的天氣太熱" |
| b2-u16-l06 | items/14/questions/1/options/0 | 執行長正解長度裁示修正 | "被狗咬壞了" | "被家裡的狗咬壞了" |
| b2-u16-l06 | items/14/questions/0/options/2 | 執行長正解長度裁示修正 | "因為傷口割得太深又流血" | "因為傷口不小心碰到熱水" |
| b2-u16-l06 | items/2/glossZh | 第②關 issue 結案 |  | 已於 259e7c4（盲審後、判題寫入前）依執行長裁示加註「指人時具冒犯意味，避免使用」；本輪 cripple 單字卡另依第③關 FIX 換情境。 |
| b2-u16-l06 | items/3/glossZh | 第②關 issue 結案 |  | 已於 259e7c4（盲審後、判題寫入前）依執行長裁示加註「指人時具冒犯意味，避免使用」。 |
| b2-u16-l06 | items/11/sentenceEn | 第②關 issue 結案 |  | 已修正：見本檔 resolvedAfterFinalReview 中 items/11 的 4 筆修正紀錄。 |
| b2-u16-l06 | items/7/exampleEn | 第②關 issue 結案 |  | 已修正：見本檔 resolvedAfterFinalReview 中 items/7 的 2 筆修正紀錄。 |
| b2-u16-l06 | items/15/rubricZh/1 | 第②關 issue 結案 |  | 已於 259e7c4 依 §11.18 改為「時態合理即可（例如 crippled、has crippled）」。 |
| b2-u16-l06 | items/1/exampleEn | 第②關 issue 結案 |  | 已修正：見本檔 resolvedAfterFinalReview 中 items/1 的 2 筆修正紀錄。 |
| b2-u16-l06 | items/2/exampleEn | 情境對照表重判 | "High fuel prices crippled many small fishing businesses last year." | "Many small farms were crippled by three years without rain." |
| b2-u16-l06 | items/2/exampleZh | 情境對照表重判 | "去年油價高漲，重創了許多小型漁業。" | "連續三年沒下雨，重創了許多小農場。" |
| b2-u16-l06 | items/9/options/3 | 執行長正解長度裁示修正 | "Had a meeting" | "Had a meeting at work" |
| b2-u16-l06 | items/14/questions/0/options/1 | 執行長正解長度裁示修正 | "因為那天的天氣太熱" | "因為那天的天氣實在太熱" |
| b2-u16-l06 | items/14/questions/1/options/1 | 執行長正解長度裁示修正 | "忘在家裡" | "不小心把它忘在家裡" |
| b2-u16-l06 | items/14/questions/1/options/3 | 執行長正解長度裁示修正 | "被雨淋濕了" | "被雨淋得全部濕透了" |
| b2-u16-l06 | items/9/options/2 | 執行長正解長度裁示修正 | "Got lost" | "Got very lost" |
| b2-u16-l06 | items/14/questions/0/options/0 | 執行長正解長度裁示修正 | "因為擦了藥" | "因為擦了太多藥" |
| b2-u16-l07 | items/15/rubricZh/1 | 第③關 FIX | "「必須」可寫 must、have to；被動語態 be given" | "「必須」可寫 must、have to 等；被動（例如 must be given）、主動（例如 Doctors must give…）都可以" |
| b2-u16-l07 | items/11/sentenceEn | 第③關 S15 | "Before the long drive, Dad told everyone to go and pee." | "The baby peed right after we changed her clothes." |
| b2-u16-l07 | items/11/sentenceZh | 第③關 S15 | "開長途車前，爸爸叫大家先去尿尿。" | "我們剛幫寶寶換好衣服，她就尿尿了。" |
| b2-u16-l07 | items/7/exampleEn | 第③關 G1（執行長裁示 | "The new coach gave the tired team a transfusion of fresh energy." | "During the operation, the patient needed a blood transfusion." |
| b2-u16-l07 | items/7/exampleZh | 第③關 G1（執行長裁示 | "新教練為疲憊的球隊注入了一股新的活力。" | "手術期間，病人需要輸血。" |
| b2-u16-l07 | items/8/sentenceEn | 第③關 G2 | "Thanks to vaccines, polio has almost disappeared from the world." | "Polio was once common, but today it has almost disappeared." |
| b2-u16-l07 | items/8/sentenceZh | 第③關 G2 | "多虧了疫苗，小兒麻痺症幾乎已經從世界上消失了。" | "小兒麻痺症曾經很常見，如今幾乎已經消失。" |
| b2-u16-l07 | items/9/options/3 | 執行長正解長度裁示修正 | "The driver is tired" | "The driver is very sleepy" |
| b2-u16-l07 | items/9/options/1 | 執行長正解長度裁示修正 | "The car needs gas" | "The car needs more gas" |
| b2-u16-l07 | items/14/questions/0/options/0 | 執行長正解長度裁示修正 | "因為疫苗很貴" | "因為疫苗每年都會漲價" |
| b2-u16-l07 | items/14/questions/0/options/3 | 執行長正解長度裁示修正 | "因為疫苗會過期" | "因為疫苗放太久就會過期" |
| b2-u16-l07 | items/0/exampleEn | 情境對照表重判 | "The puppy peed on the new carpet, and we had to clean it up." | "Many cats learn to pee in a box of sand." |
| b2-u16-l07 | items/0/exampleZh | 情境對照表重判 | "小狗在新地毯上尿尿，我們只好清理乾淨。" | "很多貓會學著在沙盆裡尿尿。" |
| b2-u16-l07 | items/1/exampleEn | 情境對照表重判 | "Under the microscope, a drop of lake water was full of moving microorganisms." | "Scientists use microorganisms to clean up oil that spills into the sea." |
| b2-u16-l07 | items/1/exampleZh | 情境對照表重判 | "在顯微鏡下，一滴湖水裡滿是會動的微生物。" | "科學家利用微生物清除流進海裡的石油。" |
| b2-u16-l07 | items/2/exampleEn | 情境對照表重判 | "Untreated wood does not last long outdoors." | "This table is made from untreated wood, so it still smells like a forest." |
| b2-u16-l07 | items/2/exampleZh | 情境對照表重判 | "未經處理的木頭放在戶外撐不了多久。" | "這張桌子是用未經處理的木頭做的，所以聞起來還有森林的味道。" |
| b2-u16-l07 | items/3/exampleEn | 情境對照表重判 | "A vaccine for polio was developed more than seventy years ago." | "Polio mainly affected young children, so it was often called a childhood disease." |
| b2-u16-l07 | items/3/exampleZh | 情境對照表重判 | "小兒麻痺疫苗是在七十多年前研發出來的。" | "小兒麻痺症過去主要影響幼童，所以常被稱為兒童疾病。" |
| b2-u16-l07 | items/6/exampleEn | 情境對照表重判 | "Oxygen from the lungs passes into the bloodstream." | "The bloodstream carries heat as well as oxygen around the body." |
| b2-u16-l07 | items/6/exampleZh | 情境對照表重判 | "肺部的氧氣會進入血液中。" | "血液除了運送氧氣，也把熱量帶到全身。" |
| b2-u16-l07 | items/9/options/1 | 執行長正解長度裁示修正 | "The car needs more gas" | "The car needs more gas soon" |
| b2-u16-l07 | items/9/options/2 | 執行長正解長度裁示修正 | "They want to eat" | "They want to eat some lunch" |
| b2-u16-l07 | items/14/questions/0/options/1 | 執行長正解長度裁示修正 | "因為流感每年都會變化" | "因為流感病毒每年都會變化" |
| b2-u16-l07 | items/14/questions/1/options/3 | 執行長正解長度裁示修正 | "捐血者" | "捐血的人" |
| b2-u16-l07 | items/14/questions/1/options/0 | 執行長正解長度裁示修正 | "老師" | "帶隊的老師" |
| b2-u16-l08 | items/11/sentenceEn | 第③關 FIX | "The new animals at the zoo stayed in quarantine for a month." | "In the past, ships had to wait in quarantine for forty days before entering the port." |
| b2-u16-l08 | items/11/sentenceZh | 第③關 FIX | "動物園的新動物先隔離了一個月。" | "從前，船隻必須先隔離四十天，才能進港。" |
| b2-u16-l08 | items/3/exampleEn | 執行長裁示（可查證規定一律中性敘述） | "Pets brought into some countries must spend time in quarantine." | "The sick horse was kept in quarantine, away from the other animals." |
| b2-u16-l08 | items/3/exampleZh | 執行長裁示（可查證規定一律中性敘述） | "帶進某些國家的寵物必須先隔離檢疫一段時間。" | "那匹生病的馬被隔離起來，遠離其他動物。" |
| b2-u16-l08 | items/6/exampleEn | 第②關 issue＋第③關 FIX | "Some phones can recognize users by scanning the retina." | "The retina is a thin layer at the back of the eye." |
| b2-u16-l08 | items/6/exampleZh | 第②關 issue＋第③關 FIX | "有些手機能掃描視網膜來辨識使用者。" | "視網膜是眼球後方的一層薄膜。" |
| b2-u16-l08 | items/16/instructionZh | 第③關 S16 | "用 pandemic 造一個句子，說說疫情期間你生活上的一個改變（輕鬆一點的事）。" | "用 pandemic 造一個句子，說說疫情期間社會上的一個改變（例如遠距上課）。" |
| b2-u16-l08 | items/16/referenceEn | 第③關 S16 | ["During the pandemic, I learned how to bake bread at home.","I started taking online classes during the pandemic."] | ["During the pandemic, many schools moved their classes online.","After the pandemic, many shops started to offer delivery."] |
| b2-u16-l08 | items/16/rubricZh | 第③關 S16 | ["句子要用到 pandemic（例如 during the pandemic）","句子要說到你自己；時態合理即可（例如 learned、have learned）"] | ["句子要用到 pandemic（例如 during the pandemic、after the pandemic）","時態合理即可（例如 moved、have moved）"] |
| b2-u16-l08 | items/14/questions/0/options/1 | 執行長正解長度裁示修正 | "檢查醫院衛生、協助被隔離的人" | "檢查醫院衛生、幫助隔離者" |
| b2-u16-l08 | items/14/questions/0/options/0 | 執行長正解長度裁示修正 | "研發新的眼睛檢查" | "研發拍視網膜的眼睛檢查" |
| b2-u16-l08 | items/14/questions/0/options/2 | 執行長正解長度裁示修正 | "研究刺激物與睡眠" | "研究咖啡裡的刺激物如何影響睡眠" |
| b2-u16-l08 | items/14/questions/0/options/3 | 執行長正解長度裁示修正 | "在學校供應午餐" | "在學校供應營養午餐" |
| b2-u16-l08 | items/14/questions/0/options/0 | 執行長正解長度裁示修正 | "研發拍視網膜的眼睛檢查" | "到國外協助興建好幾間新醫院" |
| b2-u16-l08 | items/14/questions/0/options/2 | 執行長正解長度裁示修正 | "研究咖啡裡的刺激物如何影響睡眠" | "替各大醫院招募新的護理人員" |
| b2-u16-l08 | items/6/exampleEn | 第②關 issue 結案 |  | 已修正：見本檔 resolvedAfterFinalReview 中 items/6 的 2 筆修正紀錄。 |
| b2-u16-l08 | items/16/rubricZh/1 | 第②關 issue 結案 |  | 已於 259e7c4 依 §11.18 改為「時態合理即可（例如 learned、have learned）」；本輪又依第③關 S16 改寫指令與要點。 |
| b2-u16-l08 | items/0/exampleEn | 情境對照表重判 | "The old market was rebuilt to meet modern sanitary standards." | "The camp had no sanitary facilities, so we used the toilets at a gas station." |
| b2-u16-l08 | items/0/exampleZh | 情境對照表重判 | "那座舊市場經過重建，以符合現代衛生標準。" | "營地沒有衛生設施，所以我們去加油站上廁所。" |
| b2-u16-l08 | items/2/exampleEn | 情境對照表重判 | "The pandemic changed the way many companies hold meetings." | "A pandemic is a disease that spreads across many countries at the same time." |
| b2-u16-l08 | items/2/exampleZh | 情境對照表重判 | "那場全球大流行改變了許多公司開會的方式。" | "全球大流行是指同時在許多國家擴散的疾病。" |
| b2-u16-l08 | items/5/exampleEn | 情境對照表重判 | "Plants take nourishment from the soil through their roots." | "Astronauts get their nourishment from specially packed food." |
| b2-u16-l08 | items/5/exampleZh | 情境對照表重判 | "植物透過根從土壤吸收養分。" | "太空人從特別包裝的食物中獲得養分。" |
| b2-u16-l08 | items/7/exampleEn | 情境對照表重判 | "Moving house with three small children was exhausting." | "After an exhausting week, she slept for twelve hours." |
| b2-u16-l08 | items/7/exampleZh | 情境對照表重判 | "帶著三個小孩搬家真是累死人了。" | "累人的一週過後，她睡了十二個小時。" |
| b2-u16-l08 | items/9/options/2 | 執行長正解長度裁示修正 | "Go to bed" | "Go straight to bed" |
| b2-u16-l08 | items/14/questions/0/options/3 | 執行長正解長度裁示修正 | "在學校供應營養午餐" | "替各地學校免費供應營養午餐" |
| b2-u16-l08 | items/14/questions/1/options/1 | 執行長正解長度裁示修正 | "芒果" | "大芒果" |
| b2-u16-l08 | items/14/questions/0/options/3 | 執行長正解長度裁示修正 | "替各地學校免費供應營養午餐" | "替各大學舉辦免費的健康講座" |
| b2-u16-l09 | items/11/sentenceEn | 第③關 FIX | "My sister is an incurable romantic who cries at every love story." | "A hundred years ago, many illnesses were incurable, but today doctors can cure many of them." |
| b2-u16-l09 | items/11/sentenceZh | 第③關 FIX | "我姊姊是個無可救藥的浪漫派，看每部愛情故事都會哭。" | "一百年前，許多疾病都無法治癒，但如今醫生能治好其中很多種。" |
| b2-u16-l09 | items/6/exampleEn | 第③關 FIX | "The young corporal was in charge of six soldiers." | "Many parents today do not believe in corporal punishment." |
| b2-u16-l09 | items/6/exampleZh | 第③關 FIX | "那位年輕的下士負責管六名士兵。" | "現在很多父母不認同體罰。" |
| b2-u16-l09 | items/6/glossZh | 第③關 FIX | "肉體的；（軍）下士" | "肉體的；身體的" |
| b2-u16-l09 | items/6/distractorsZh | 第③關 FIX | ["將軍","教練","隊長"] | ["心理的","公開的","暫時的"] |
| b2-u16-l09 | items/13/options | 第③關 FIX | ["toenails","maladies","ointments","corporals"] | ["toenails","maladies","ointments","eyelids"] |
| b2-u16-l09 | items/13/optionGlossZh | 第③關 FIX | ["腳趾甲","疾病","藥膏","下士"] | ["腳趾甲","疾病","藥膏","眼皮"] |
| b2-u16-l09 | items/15/promptZh | 第②關 issue＋第③關 FIX | "壞天氣是這次旅行唯一美中不足的地方。" | "奶奶把那條藥膏收在浴室的櫃子裡。" |
| b2-u16-l09 | items/15/referenceEn | 第③關 FIX | ["The bad weather was the only fly in the ointment on this trip.","The only fly in the ointment of the trip was the bad weather."] | ["My grandmother keeps the tube of ointment in the bathroom cupboard.","Grandma puts the ointment in the cupboard in the bathroom."] |
| b2-u16-l09 | items/15/rubricZh | 第③關 FIX | ["要用 a/the fly in the ointment 表達「美中不足之處」","時態合理即可（例如 was、is）"] | ["ointment 指藥膏（例如 a tube of ointment、the ointment）","「收在」可寫 keep、put 等；時態合理即可"] |
| b2-u16-l09 | items/2/exampleEn | 第③關 S17 | "The pharmacist placed a small tube of ointment on the counter." | "This ointment smells strongly of mint." |
| b2-u16-l09 | items/2/exampleZh | 第③關 S17 | "藥師把一小條藥膏放在櫃台上。" | "這種藥膏有濃濃的薄荷味。" |
| b2-u16-l09 | items/1/exampleEn | 第③關 G1（執行長裁示 | "Traffic jams are a common malady of big cities." | "In old books, a fever was often described as a mysterious malady." |
| b2-u16-l09 | items/1/exampleZh | 第③關 G1（執行長裁示 | "塞車是大城市常見的通病。" | "在古書裡，發燒常被描述成一種神秘的疾病。" |
| b2-u16-l09 | items/16/instructionZh | 第③關 S18 | "用 malady 造一個句子，比喻現代生活中的一個「通病」（例如手機成癮、塞車）。" | "用 malady 造一個句子，比喻現代生活中的一個「通病」（例如熬夜、久坐不動）。" |
| b2-u16-l09 | items/4/exampleEn | 第③關 G1（執行長裁示 | "My uncle is an incurable optimist who always expects the best." | "Fifty years ago, this disease was incurable, but now there is a cure." |
| b2-u16-l09 | items/4/exampleZh | 第③關 G1（執行長裁示 | "我叔叔是個無可救藥的樂天派，總是往好處想。" | "五十年前這種病無法治癒，但現在已經有治療方法了。" |
| b2-u16-l09 | items/11/sentenceEn | 第③關 G1（執行長裁示 | "A hundred years ago, many illnesses were incurable, but today doctors can cure many of them." | "My sister is an incurable romantic who cries at every love story." |
| b2-u16-l09 | items/11/sentenceZh | 第③關 G1（執行長裁示 | "一百年前，許多疾病都無法治癒，但如今醫生能治好其中很多種。" | "我姊姊是個無可救藥的浪漫派，看每部愛情故事都會哭。" |
| b2-u16-l09 | items/8/sentenceEn | 第③關 S17 | "The discovery of penicillin changed medicine forever." | "Penicillin was one of the first medicines to fight germs." |
| b2-u16-l09 | items/8/sentenceZh | 第③關 S17 | "盤尼西林的發現永遠改變了醫學。" | "盤尼西林是最早用來對抗細菌的藥物之一。" |
| b2-u16-l09 | items/14/passageEn | 第③關 S20 | "Our health class this term, held in a cozy room on the top floor, looked at medicine through history. We learned how penicillin was discovered when a scientist noticed mold killing germs on a dish. We also read about old remedies: people once rubbed strange ointments on their skin for every small malady. Our teacher explained respiration and how the lungs bring oxygen into the bloodstream. In another lesson, a guest speaker talked about eating problems such as bulimia and how researchers study them. We also discussed how many countries have banned corporal punishment in schools. Even my best friend, whose love of jokes is incurable, listened carefully. My only small complaint is the long reading list." | "Our health class this term, held in a cozy room on the top floor, looked at medicine through history. We learned how penicillin was discovered when a scientist noticed that something growing on a dish was killing germs. We also read about old remedies: people once rubbed strange ointments on their skin for every small malady. Our teacher explained respiration and how the lungs bring oxygen into the bloodstream. In another lesson, a guest speaker talked about eating problems such as bulimia and how researchers study them. We also discussed how many countries have banned corporal punishment in schools. Even my best friend, whose love of jokes is incurable, listened carefully. My only small complaint is the long reading list." |
| b2-u16-l09 | items/14/passageZh | 第③關 S20 | "這學期的健康課在頂樓一間溫馨的教室上，從歷史的角度看醫學。我們學到盤尼西林是怎麼被發現的：一位科學家注意到培養皿上的黴菌殺死了細菌。我們也讀到古老的療法：以前的人一有小病小痛，就在皮膚上塗抹奇怪的藥膏。老師講解了呼吸作用，以及肺如何把氧氣送進血液。另一堂課，一位客座講者談到暴食症等飲食問題，以及研究人員如何研究它們。我們也討論了許多國家已經禁止學校體罰。就連我那個愛開玩笑到無可救藥的好朋友都聽得很專心。我唯一的小抱怨是書單太長。" | "這學期的健康課在頂樓一間溫馨的教室上，從歷史的角度看醫學。我們學到盤尼西林是怎麼被發現的：一位科學家注意到培養皿上長出的東西殺死了細菌。我們也讀到古老的療法：以前的人一有小病小痛，就在皮膚上塗抹奇怪的藥膏。老師講解了呼吸作用，以及肺如何把氧氣送進血液。另一堂課，一位客座講者談到暴食症等飲食問題，以及研究人員如何研究它們。我們也討論了許多國家已經禁止學校體罰。就連我那個愛開玩笑到無可救藥的好朋友都聽得很專心。我唯一的小抱怨是書單太長。" |
| b2-u16-l09 | items/14/questions/0/options | 第③關 S20 | ["有人在菜園裡找到的","醫生在研究藥膏","學生在做實驗","科學家注意到黴菌殺死了細菌"] | ["有人在菜園裡找到的","醫生在研究藥膏","學生在做實驗","科學家發現培養皿上的東西殺死細菌"] |
| b2-u16-l09 | items/14/questions/0/options/0 | 執行長正解長度裁示修正 | "有人在菜園裡找到的" | "有人在菜園的泥土裡找到的" |
| b2-u16-l09 | items/14/questions/0/options/1 | 執行長正解長度裁示修正 | "醫生在研究藥膏" | "醫生在研究古老的藥膏時" |
| b2-u16-l09 | items/14/questions/1/options/0 | 執行長正解長度裁示修正 | "非常害羞" | "非常害羞，很少說話" |
| b2-u16-l09 | items/14/questions/1/options/3 | 執行長正解長度裁示修正 | "常常遲到" | "常常遲到又不寫回家作業" |
| b2-u16-l09 | items/14/questions/0/options/3 | 執行長正解長度裁示修正 | "科學家發現培養皿上的東西殺死細菌" | "培養皿上長出的東西殺死細菌" |
| b2-u16-l09 | items/14/questions/0/options/2 | 執行長正解長度裁示修正 | "學生在做實驗" | "學生在學校的實驗室裡做實驗時" |
| b2-u16-l09 | items/15/rubricZh/0 | 第②關 issue 結案 |  | 已修正：見本檔 resolvedAfterFinalReview 中 items/15 的 3 筆修正紀錄。 |
| b2-u16-l09 | items/15/rubricZh/1 | 第②關 issue 結案 |  | 已於 259e7c4 依 §11.18 改為「時態合理即可」；本輪依第③關 FIX 整題改為 ointment 字面義。 |
| b2-u16-l09 | items/0/exampleEn | 情境對照表重判 | "She painted her toenails pink to match her summer sandals." | "Your toenails grow more slowly than your fingernails." |
| b2-u16-l09 | items/0/exampleZh | 情境對照表重判 | "她把腳趾甲塗成粉紅色，搭配夏天的涼鞋。" | "腳趾甲長得比手指甲慢。" |
| b2-u16-l09 | items/1/exampleEn | 情境對照表重判 | "In old books, a fever was often described as a mysterious malady." | "The village doctor in the novel could cure almost any malady." |
| b2-u16-l09 | items/1/exampleZh | 情境對照表重判 | "在古書裡，發燒常被描述成一種神秘的疾病。" | "小說裡那位村醫幾乎什麼病都治得好。" |
| b2-u16-l09 | items/3/exampleEn | 情境對照表重判 | "Penicillin was discovered by accident almost a hundred years ago." | "Penicillin was first used to treat patients more than eighty years ago." |
| b2-u16-l09 | items/3/exampleZh | 情境對照表重判 | "盤尼西林是在將近一百年前意外被發現的。" | "盤尼西林在八十多年前首次用於治療病人。" |
| b2-u16-l09 | items/6/exampleEn | 情境對照表重判 | "Many parents today do not believe in corporal punishment." | "The word corporal comes from an old word meaning 'body'." |
| b2-u16-l09 | items/6/exampleZh | 情境對照表重判 | "現在很多父母不認同體罰。" | "corporal 這個字源自一個意思是「身體」的古字。" |
| b2-u16-l09 | items/7/exampleEn | 情境對照表重判 | "The documentary helped raise public awareness of bulimia." | "Bulimia was first described as a separate illness in 1979." |
| b2-u16-l09 | items/7/exampleZh | 情境對照表重判 | "那部紀錄片幫助提升了大眾對暴食症的認識。" | "暴食症在 1979 年首次被描述為一種獨立的疾病。" |
| b2-u16-l09 | items/3/exampleEn | 情境對照表重判 | "Penicillin was first used to treat patients more than eighty years ago." | "Today, factories can make penicillin in very large amounts." |
| b2-u16-l09 | items/3/exampleZh | 情境對照表重判 | "盤尼西林在八十多年前首次用於治療病人。" | "如今工廠可以大量生產盤尼西林。" |
| b2-u16-l09 | items/9/options/3 | 執行長正解長度裁示修正 | "At midnight" | "At nine" |
| b2-u16-l09 | items/14/questions/1/options/0 | 執行長正解長度裁示修正 | "非常害羞，很少說話" | "非常害羞，在課堂上很少說話" |
| b2-u16-l09 | items/14/questions/1/options/2 | 執行長正解長度裁示修正 | "很愛讀書" | "很愛讀書和寫作" |
| b2-u16-l10 | items/13/stemEn | 第③關 FIX | "Scientists found that a plant from the rainforest has ____ properties." | "Doctors often use two or more ____ drugs at the same time." |
| b2-u16-l10 | items/13/stemZh | 第③關 FIX | "科學家發現一種雨林植物具有抗癌特性。" | "醫生常常同時使用兩種以上的抗癌藥物。" |
| b2-u16-l10 | items/16/referenceEn | 第③關 S19 | ["I read a book about how doctors first started to study neurosis.","In psychology class, I learned the history of the word neurosis."] | ["Our teacher explained that the meaning of neurosis has changed over time.","I learned that the word neurosis comes from Greek."] |
| b2-u16-l10 | properNouns | 第③關 S19（專有名詞同步） | ["Freud"] | ["Freud","Greek"] |
| b2-u16-l10 | items/3/exampleEn | 第③關 G2 | "A vaccine against diphtheria became widely used in the twentieth century." | "Diphtheria mostly affects the throat and nose." |
| b2-u16-l10 | items/3/exampleZh | 第③關 G2 | "白喉疫苗在二十世紀開始廣泛使用。" | "白喉主要影響喉嚨和鼻子。" |
| b2-u16-l10 | items/9/options/1 | 執行長正解長度裁示修正 | "In the room" | "In your hotel room" |
| b2-u16-l10 | items/14/questions/1/options/2 | 執行長正解長度裁示修正 | "尋找具有抗癌特性的植物" | "找有抗癌特性的植物" |
| b2-u16-l10 | items/14/questions/1/options/1 | 執行長正解長度裁示修正 | "尋找新的香料" | "尋找可以做菜用的新香料" |
| b2-u16-l10 | items/14/questions/1/options/3 | 執行長正解長度裁示修正 | "做護手霜" | "做抗菌護手霜的材料" |
| b2-u16-l10 | items/1/exampleEn | 情境對照表重判 | "Freud wrote many books about neurosis more than a century ago." | "In the old novel, the hero's neurosis makes him afraid of open spaces." |
| b2-u16-l10 | items/1/exampleZh | 情境對照表重判 | "佛洛伊德在一百多年前寫了許多關於精神官能症的書。" | "在那本老小說裡，主角的精神官能症讓他害怕開闊的地方。" |
| b2-u16-l10 | items/2/exampleEn | 情境對照表重判 | "The whole family got addicted to the new board game over the holiday." | "Addicted players can spend hours on a game without noticing the time." |
| b2-u16-l10 | items/2/exampleZh | 情境對照表重判 | "假期中，全家人都迷上了那款新桌遊。" | "著迷的玩家可能玩好幾個小時都沒注意到時間。" |
| b2-u16-l10 | items/5/exampleEn | 情境對照表重判 | "The football team hired a masseur to travel with the players." | "He trained for two years to become a professional masseur." |
| b2-u16-l10 | items/5/exampleZh | 情境對照表重判 | "那支足球隊聘了一位按摩師隨球員出賽。" | "他受訓了兩年，才成為專業按摩師。" |
| b2-u16-l10 | items/6/exampleEn | 情境對照表重判 | "Researchers are testing an anticancer drug made from a tree." | "Some anticancer drugs work by stopping cells from dividing." |
| b2-u16-l10 | items/6/exampleZh | 情境對照表重判 | "研究人員正在測試一種從樹木提煉的抗癌藥物。" | "有些抗癌藥物的作用是阻止細胞分裂。" |
| b2-u16-l10 | items/14/questions/0/options/3 | 執行長正解長度裁示修正 | "乾淨的水" | "乾淨的水源" |
| b2-u16-l10 | items/14/questions/0/options/2 | 執行長正解長度裁示修正 | "更多的醫院" | "更多醫院" |
| b2-u16-l10 | items/14/questions/1/options/3 | 執行長正解長度裁示修正 | "做抗菌護手霜的材料" | "做護手霜的材料" |
| b2-u16-l10 | items/14/questions/1/options/0 | 執行長正解長度裁示修正 | "研究白喉" | "研究白喉的病因" |

共 1255 筆。

## 第 1 批本輪修改明細（正解長度）

| 課 | 位置 | 來源 | 改前 | 改後 |
|---|---|---|---|---|
| b2-u01-l01 | items/9/options/1 | 執行長正解長度裁示修正 | "Wait for the next train" | "Wait here for the next train" |
| b2-u01-l01 | items/14/questions/0/options/1 | 執行長正解長度裁示修正 | "所有員工" | "公司的所有員工" |
| b2-u01-l01 | items/14/questions/1/options/1 | 執行長正解長度裁示修正 | "永遠維持不變" | "從下週一起永遠維持不變" |
| b2-u01-l01 | items/9/options/2 | 執行長正解長度裁示修正 | "Walk to the next town" | "Walk to the next town instead" |
| b2-u01-l01 | items/14/questions/0/options/3 | 執行長正解長度裁示修正 | "來訪的客人" | "來訪的公司客人" |
| b2-u01-l01 | items/14/questions/1/options/1 | 執行長正解長度裁示修正 | "從下週一起永遠維持不變" | "永遠維持不變" |
| b2-u01-l02 | items/9/options/0 | 執行長正解長度裁示修正 | "Clean the new office" | "Clean the new office before the meeting" |
| b2-u01-l02 | items/14/questions/1/options/1 | 執行長正解長度裁示修正 | "想要求更高的薪水" | "想要求和銀行一樣的薪水" |
| b2-u01-l02 | items/9/options/0 | 執行長正解長度裁示修正 | "Clean the new office before the meeting" | "Clean the new office on Tuesday" |
| b2-u01-l02 | items/14/questions/0/options/3 | 執行長正解長度裁示修正 | "自己開公司" | "自己開一家公司" |
| b2-u01-l02 | items/14/questions/1/options/1 | 執行長正解長度裁示修正 | "想要求和銀行一樣的薪水" | "想要求更高的薪水" |
| b2-u01-l03 | items/13/questions/0/options/0 | 執行長正解長度裁示修正 | "房間不乾淨、價格太高" | "房間不乾淨、價格又太高" |
| b2-u01-l03 | items/13/questions/1/options/3 | 執行長正解長度裁示修正 | "幫他們換房間" | "幫他們換房" |
| b2-u01-l04 | items/8/options/2 | 執行長正解長度裁示修正 | "To get a better price" | "To get a better price from the client" |
| b2-u01-l04 | items/13/questions/0/options/3 | 執行長正解長度裁示修正 | "聘請了很多新人" | "在台中聘請了很多新人" |
| b2-u01-l04 | items/13/questions/1/options/3 | 執行長正解長度裁示修正 | "因為手機沒電了" | "因為手機剛好沒電了" |
| b2-u01-l04 | items/13/questions/0/options/3 | 執行長正解長度裁示修正 | "在台中聘請了很多新人" | "聘請了很多新人" |
| b2-u01-l04 | items/13/questions/1/options/0 | 執行長正解長度裁示修正 | "因為忘了帶紙" | "因為忘了帶筆記本" |
| b2-u01-l05 | items/8/options/2 | 執行長正解長度裁示修正 | "Something to eat" | "Something to eat after work" |
| b2-u01-l05 | items/13/questions/0/options/3 | 執行長正解長度裁示修正 | "作者的爺爺" | "作者的爺爺奶奶" |
| b2-u01-l05 | items/13/questions/1/options/3 | 執行長正解長度裁示修正 | "因為河邊很遠" | "因為河邊離農場很遠" |
| b2-u01-l05 | items/8/options/1 | 執行長正解長度裁示修正 | "A new box" | "A new and bigger box" |
| b2-u01-l05 | items/13/questions/0/options/2 | 執行長正解長度裁示修正 | "作者的爸爸" | "作者自己的爸爸" |
| b2-u01-l05 | items/13/questions/0/options/3 | 執行長正解長度裁示修正 | "作者的爺爺奶奶" | "作者的爺爺" |
| b2-u01-l05 | items/13/questions/1/options/1 | 執行長正解長度裁示修正 | "因為水桶太大" | "因為水桶本身太大" |
| b2-u01-l05 | items/13/questions/1/options/2 | 執行長正解長度裁示修正 | "因為他不舒服" | "因為他身體不舒服" |
| b2-u02-l01 | items/14/questions/0/options/3 | 執行長正解長度裁示修正 | "認識了所有客人" | "先認識了飯店所有的客人" |
| b2-u02-l01 | items/14/questions/1/options/3 | 執行長正解長度裁示修正 | "客人特別要求" | "有客人特別要求他晚上服務" |
| b2-u02-l01 | items/14/questions/0/options/3 | 執行長正解長度裁示修正 | "先認識了飯店所有的客人" | "認識了所有客人" |
| b2-u02-l02 | items/14/questions/1/options/1 | 執行長正解長度裁示修正 | "會議室太小" | "舊辦公室的會議室太小" |
| b2-u02-l02 | items/14/questions/1/options/3 | 執行長正解長度裁示修正 | "辦公室離河邊太遠" | "舊辦公室離大家的家都太遠" |
| b2-u02-l02 | items/9/options/2 | 執行長正解長度裁示修正 | "A hotel" | "A gym" |
| b2-u02-l02 | items/14/questions/0/options/0 | 執行長正解長度裁示修正 | "銀行" | "電影院" |
| b2-u02-l02 | items/14/questions/0/options/1 | 執行長正解長度裁示修正 | "學校" | "圖書館" |
| b2-u02-l02 | items/14/questions/0/options/3 | 執行長正解長度裁示修正 | "倉庫" | "貨運倉庫" |
| b2-u02-l03 | items/14/questions/0/options/0 | 執行長正解長度裁示修正 | "河邊的碼頭" | "以前是港口的河邊老碼頭" |
| b2-u02-l03 | items/14/questions/0/options/2 | 執行長正解長度裁示修正 | "火車站前面" | "火車站前面的大停車場" |
| b2-u02-l03 | items/14/questions/0/options/1 | 執行長正解長度裁示修正 | "新蓋的公園" | "鎮上新蓋的公園" |
| b2-u02-l03 | items/14/questions/0/options/2 | 執行長正解長度裁示修正 | "火車站前面的大停車場" | "火車站前面的大型停車場" |
| b2-u02-l03 | items/14/questions/1/options/3 | 執行長正解長度裁示修正 | "怕之後會下雨" | "怕會下雨" |
| b2-u02-l04 | items/14/questions/0/options/0 | 執行長正解長度裁示修正 | "設計師離職了" | "原本的資深設計師離職了" |
| b2-u02-l04 | items/14/questions/0/options/2 | 執行長正解長度裁示修正 | "店面太少" | "實體店面太少、不好找" |
| b2-u02-l04 | items/14/questions/1/options/0 | 執行長正解長度裁示修正 | "打折活動和會員卡" | "週年打折活動和會員卡" |
| b2-u02-l04 | items/14/questions/1/options/3 | 執行長正解長度裁示修正 | "海外分店和電視廣告" | "海外分店和全新的電視廣告" |
| b2-u02-l04 | items/9/options/0 | 執行長正解長度裁示修正 | "It is still down" | "It is still down now" |
| b2-u02-l04 | items/9/options/3 | 執行長正解長度裁示修正 | "It is very slow" | "It is still very slow" |
| b2-u02-l04 | items/14/questions/0/options/1 | 執行長正解長度裁示修正 | "價格太高" | "商品價格太高" |
| b2-u02-l04 | items/14/questions/0/options/2 | 執行長正解長度裁示修正 | "實體店面太少、不好找" | "實體店面太少" |
| b2-u02-l04 | items/14/questions/1/options/0 | 執行長正解長度裁示修正 | "週年打折活動和會員卡" | "週年打折活動和新的會員卡" |
| b2-u02-l05 | items/8/options/2 | 執行長正解長度裁示修正 | "The listener paid for dinner" | "The listener paid for dinner last night" |
| b2-u02-l05 | items/13/questions/1/options/0 | 執行長正解長度裁示修正 | "價格的高低" | "收費價格的高低" |
| b2-u02-l05 | items/8/options/3 | 執行長正解長度裁示修正 | "The listener fixed a car" | "The listener fixed the car for free" |
| b2-u02-l05 | items/13/questions/0/options/0 | 執行長正解長度裁示修正 | "他收費很便宜" | "收費便宜" |
| b2-u02-l05 | items/13/questions/0/options/2 | 執行長正解長度裁示修正 | "他的店很大" | "店面很大" |
| b2-u02-l05 | items/13/questions/1/options/1 | 執行長正解長度裁示修正 | "店面的裝潢" | "店面的裝潢風格" |
| b2-u02-l06 | items/13/questions/0/options/0 | 執行長正解長度裁示修正 | "飯店客滿" | "訂好的飯店客滿，沒有房間" |
| b2-u02-l06 | items/13/questions/0/options/1 | 執行長正解長度裁示修正 | "班機延誤" | "班機延誤，晚了好幾個小時才到" |
| b2-u02-l06 | items/13/questions/1/options/1 | 執行長正解長度裁示修正 | "她的外套弄丟了" | "她的外套在機場弄丟了" |
| b2-u02-l06 | items/8/options/0 | 執行長正解長度裁示修正 | "It will snow" | "It will snow a lot" |
| b2-u02-l06 | items/13/questions/0/options/2 | 執行長正解長度裁示修正 | "正好是尖峰時段，火車很擠" | "遇上尖峰時段，火車很擠" |
| b2-u02-l06 | items/13/questions/0/options/3 | 執行長正解長度裁示修正 | "下大雨" | "整天下大雨，哪裡都去不了" |
| b2-u03-l01 | items/10/options/1 | 執行長正解長度裁示修正 | "Takes the bus" | "Takes the bus like other days" |
| b2-u03-l01 | items/10/options/3 | 執行長正解長度裁示修正 | "Rides a bike" | "Rides a bike to the office" |
| b2-u03-l01 | items/15/questions/0/options/1 | 執行長正解長度裁示修正 | "打掃工作台" | "打掃所有的工作台" |
| b2-u03-l01 | items/15/questions/0/options/3 | 執行長正解長度裁示修正 | "規劃隔天的工作" | "坐下來規劃隔天的工作" |
| b2-u03-l01 | items/15/questions/1/options/0 | 執行長正解長度裁示修正 | "自己一個人開車" | "每天早上自己一個人開車去" |
| b2-u03-l01 | items/15/questions/1/options/2 | 執行長正解長度裁示修正 | "搭公車" | "搭工廠附近的公車" |
| b2-u03-l01 | items/10/options/1 | 執行長正解長度裁示修正 | "Takes the bus like other days" | "Takes the bus as usual" |
| b2-u03-l01 | items/10/options/2 | 執行長正解長度裁示修正 | "Walks" | "Walks to work" |
| b2-u03-l01 | items/15/questions/0/options/1 | 執行長正解長度裁示修正 | "打掃所有的工作台" | "打掃工作台" |
| b2-u03-l01 | items/15/questions/1/options/2 | 執行長正解長度裁示修正 | "搭工廠附近的公車" | "搭每天經過工廠附近的公車" |
| b2-u03-l01 | items/15/questions/1/options/3 | 執行長正解長度裁示修正 | "騎腳踏車" | "自己騎腳踏車去" |
| b2-u04-l01 | items/9/options/2 | 執行長正解長度裁示修正 | "Call the seller" | "Call the seller for help" |
| b2-u04-l01 | items/14/questions/0/options/0 | 執行長正解長度裁示修正 | "對方的店太遠" | "對方的門市離她家太遠" |
| b2-u04-l01 | items/14/questions/0/options/1 | 執行長正解長度裁示修正 | "她做不出那麼多包包" | "她一個人做不出那麼多的包包" |
| b2-u04-l01 | items/14/questions/1/options/1 | 執行長正解長度裁示修正 | "舉辦打折活動" | "替忠實顧客舉辦年底打折活動" |
| b2-u04-l01 | items/14/questions/1/options/2 | 執行長正解長度裁示修正 | "出國旅行" | "和家人一起出國旅行" |
| b2-u04-l01 | items/14/questions/0/options/1 | 執行長正解長度裁示修正 | "她一個人做不出那麼多的包包" | "她做不出那麼多包包" |
| b2-u04-l01 | items/14/questions/1/options/3 | 執行長正解長度裁示修正 | "招募新員工" | "招募新的員工" |
| b2-u04-l02 | items/14/questions/0/options/3 | 執行長正解長度裁示修正 | "在網路上賣東西" | "在網路上賣茶具和茶葉" |
| b2-u04-l02 | items/14/questions/1/options/0 | 執行長正解長度裁示修正 | "網路常常故障" | "網路商店常常故障、打不開" |
| b2-u04-l02 | items/14/questions/1/options/3 | 執行長正解長度裁示修正 | "年輕店員要求的" | "新請的年輕店員要求他一定要印" |
| b2-u04-l02 | items/9/options/2 | 執行長正解長度裁示修正 | "A free meal" | "A free dinner" |
| b2-u04-l02 | items/9/options/3 | 執行長正解長度裁示修正 | "A catalog" | "A paper catalog" |
| b2-u04-l02 | items/14/questions/0/options/0 | 執行長正解長度裁示修正 | "開了三家店" | "一開始就開了三家店" |
| b2-u04-l02 | items/14/questions/0/options/1 | 執行長正解長度裁示修正 | "在工廠工作" | "在別人的工廠工作" |
| b2-u04-l02 | items/14/questions/0/options/2 | 執行長正解長度裁示修正 | "在路邊擺小桌子賣茶" | "在路邊擺攤賣茶" |
| b2-u04-l02 | items/14/questions/1/options/0 | 執行長正解長度裁示修正 | "網路商店常常故障、打不開" | "網路商店常常故障、連不上去" |
| b2-u04-l02 | items/14/questions/1/options/1 | 執行長正解長度裁示修正 | "印刷費很便宜" | "印刷費用很便宜" |
| b2-u04-l03 | items/8/options/0 | 執行長正解長度裁示修正 | "He sold her a watch" | "He sold her a watch for money" |
| b2-u04-l03 | items/8/options/2 | 執行長正解長度裁示修正 | "He fixed a ring" | "He fixed a ring for free" |
| b2-u04-l03 | items/13/questions/0/options/1 | 執行長正解長度裁示修正 | "很貪心" | "很貪心，借錢時總是收很高的利息" |
| b2-u04-l03 | items/13/questions/0/options/2 | 執行長正解長度裁示修正 | "每天早上送冰" | "每天早上會送冰到每戶人家" |
| b2-u04-l03 | items/13/questions/1/options/2 | 執行長正解長度裁示修正 | "女店員認識奶奶" | "年輕女店員認識奶奶" |
| b2-u04-l03 | items/8/options/2 | 執行長正解長度裁示修正 | "He fixed a ring for free" | "He fixed a broken ring for free" |
| b2-u04-l03 | items/13/questions/1/options/3 | 執行長正解長度裁示修正 | "奶奶用金融卡付款" | "奶奶刷卡" |
| b2-u04-l03 | items/13/questions/1/options/3 | 執行長正解長度裁示修正 | "奶奶刷卡" | "奶奶用金融卡" |
| b2-u04-l03 | items/13/questions/1/options/0 | 執行長正解長度裁示修正 | "手機很便宜" | "手機的價格很便宜" |
| b2-u04-l03 | items/13/questions/1/options/1 | 執行長正解長度裁示修正 | "當鋪還在營業" | "那家當鋪還在營業" |
| b2-u05-l01 | items/9/options/1 | 執行長正解長度裁示修正 | "Buy one at the shop" | "Buy a new one at the shop next door" |
| b2-u05-l01 | items/9/options/2 | 執行長正解長度裁示修正 | "Fix it yourself" | "Fix it yourself with a piece of tape" |
| b2-u05-l01 | items/14/questions/0/options/1 | 執行長正解長度裁示修正 | "一個抽屜" | "一個小抽屜" |
| b2-u05-l01 | items/9/options/0 | 執行長正解長度裁示修正 | "Go home early" | "Go home early and rest for the day" |
| b2-u05-l01 | items/14/questions/0/options/0 | 執行長正解長度裁示修正 | "一把鑰匙" | "一把小鑰匙" |
| b2-u05-l01 | items/14/questions/0/options/2 | 執行長正解長度裁示修正 | "一片桌面" | "一片玻璃桌面" |
| b2-u05-l01 | items/14/questions/1/options/0 | 執行長正解長度裁示修正 | "降低成本" | "降低每個月的成本" |
| b2-u05-l01 | items/14/questions/1/options/1 | 執行長正解長度裁示修正 | "節省空間" | "節省辦公室空間" |
| b2-u05-l02 | items/9/options/0 | 執行長正解長度裁示修正 | "Tomorrow morning" | "Early tomorrow morning" |
| b2-u05-l02 | items/9/options/1 | 執行長正解長度裁示修正 | "In two hours" | "In about two hours from now" |
| b2-u05-l02 | items/14/questions/0/options/1 | 執行長正解長度裁示修正 | "有相機被偷了" | "有一部相機被偷了，警察趕到現場" |
| b2-u05-l02 | items/14/questions/0/options/2 | 執行長正解長度裁示修正 | "博物館停電了" | "博物館停電了，展覽暫停一天" |
| b2-u05-l02 | items/14/questions/1/options/0 | 執行長正解長度裁示修正 | "博物館要不要買他的相機" | "博物館要不要買下他全部的相機" |
| b2-u05-l02 | items/9/options/2 | 執行長正解長度裁示修正 | "In about twenty minutes" | "In twenty minutes" |
| b2-u05-l02 | items/9/options/3 | 執行長正解長度裁示修正 | "In five minutes" | "In just five minutes" |
| b2-u05-l02 | items/9/options/1 | 執行長正解長度裁示修正 | "In about two hours from now" | "In about two hours" |
| b2-u05-l02 | items/14/questions/0/options/3 | 執行長正解長度裁示修正 | "火災警報響了，大家必須離開" | "火災警報響，大家得離開" |
| b2-u05-l02 | items/14/questions/0/options/0 | 執行長正解長度裁示修正 | "何先生遲到了" | "何先生遲到了快要一個小時" |
| b2-u05-l03 | items/14/questions/0/options/1 | 執行長正解長度裁示修正 | "船撞到岸邊" | "船撞到岸邊，作者受了傷" |
| b2-u05-l03 | items/14/questions/0/options/2 | 執行長正解長度裁示修正 | "他掉進湖裡" | "他掉進湖裡，全身都濕了" |
| b2-u05-l03 | items/14/questions/1/options/1 | 執行長正解長度裁示修正 | "有人唱歌很難聽" | "有人在營火旁邊唱歌很難聽" |
| b2-u05-l03 | items/14/questions/1/options/2 | 執行長正解長度裁示修正 | "房間的裝飾掉下來了" | "房間天花板的紙花全都掉下來了" |
| b2-u05-l03 | items/9/options/2 | 執行長正解長度裁示修正 | "They stayed the same" | "They did not change" |
| b2-u05-l03 | items/14/questions/0/options/0 | 執行長正解長度裁示修正 | "遇到強風，作者很慌張" | "遇到一陣強風，作者很慌張" |
| b2-u05-l03 | items/14/questions/1/options/0 | 執行長正解長度裁示修正 | "有人噴的防蚊液味道很難聞" | "防蚊液的味道很難聞" |
| b2-u05-l03 | items/14/questions/1/options/3 | 執行長正解長度裁示修正 | "教練講了笑話" | "教練講了一個好笑的笑話" |
| b2-u05-l04 | items/9/options/0 | 執行長正解長度裁示修正 | "The room was too small" | "The room was too small for everyone" |
| b2-u05-l04 | items/9/options/3 | 執行長正解長度裁示修正 | "A client wanted to meet there" | "A client wanted to meet in that room" |
| b2-u05-l04 | items/14/questions/0/options/2 | 執行長正解長度裁示修正 | "水電工" | "一位水電工" |
| b2-u05-l04 | items/9/options/2 | 執行長正解長度裁示修正 | "The lights went out" | "All the lights in the room went out" |
| b2-u05-l04 | items/14/questions/0/options/1 | 執行長正解長度裁示修正 | "作者自己" | "作者自己發現的" |
| b2-u05-l04 | items/14/questions/1/options/2 | 執行長正解長度裁示修正 | "兩天" | "整整兩天" |
| b2-u05-l04 | items/14/questions/1/options/1 | 執行長正解長度裁示修正 | "一個早上" | "一上午" |
| b2-u05-l05 | items/14/questions/0/options/1 | 執行長正解長度裁示修正 | "換了一台新的咖啡機" | "換了新的咖啡機、重新鋪了地板" |
| b2-u05-l05 | items/14/questions/0/options/2 | 執行長正解長度裁示修正 | "延長了營業時間" | "延長營業時間、增加菜單、換新招牌" |
| b2-u05-l05 | items/14/questions/1/options/2 | 執行長正解長度裁示修正 | "門外的車聲" | "門外的汽車喇叭聲" |
| b2-u05-l05 | items/14/questions/1/options/3 | 執行長正解長度裁示修正 | "牆上的裝飾" | "牆上掛的裝飾" |
| b2-u05-l05 | items/9/options/0 | 執行長正解長度裁示修正 | "In the trash can" | "In the trash" |
| b2-u05-l05 | items/9/options/2 | 執行長正解長度裁示修正 | "In the blue box" | "In a blue box" |
| b2-u05-l05 | items/9/options/3 | 執行長正解長度裁示修正 | "At the front desk" | "At the desk" |
| b2-u05-l05 | items/14/questions/0/options/1 | 執行長正解長度裁示修正 | "換了新的咖啡機、重新鋪了地板" | "換了新咖啡機、重鋪地板" |
| b2-u05-l05 | items/14/questions/1/options/3 | 執行長正解長度裁示修正 | "牆上掛的裝飾" | "天花板上掛的裝飾" |
| b2-u05-l05 | items/14/questions/0/options/0 | 執行長正解長度裁示修正 | "改成只賣早餐" | "改成只賣早餐和咖啡" |
| b2-u05-l06 | items/14/questions/1/options/0 | 執行長正解長度裁示修正 | "搬到台北" | "搬到台北和兒子同住" |
| b2-u05-l06 | items/14/questions/1/options/1 | 執行長正解長度裁示修正 | "到學校教書" | "到台南的學校教書" |
| b2-u05-l06 | items/14/questions/1/options/2 | 執行長正解長度裁示修正 | "開一家咖啡店" | "和女兒在加拿大開咖啡店" |
| b2-u05-l06 | items/14/questions/1/options/3 | 執行長正解長度裁示修正 | "輪流探望加拿大的女兒和台南的兒子" | "輪流探望女兒和兒子" |
| b2-u05-l06 | items/9/options/0 | 執行長正解長度裁示修正 | "It moved to another city" | "It moved to another city far away" |
| b2-u05-l06 | items/14/questions/0/options/1 | 執行長正解長度裁示修正 | "林女士出國了" | "林女士剛好出國旅行" |
| b2-u05-l06 | items/14/questions/1/options/2 | 執行長正解長度裁示修正 | "和女兒在加拿大開咖啡店" | "每週回公司兼職當顧問" |
| b2-u05-l06 | items/9/options/1 | 執行長正解長度裁示修正 | "It was canceled for good" | "It was canceled" |
| b2-u05-l06 | items/14/questions/0/options/1 | 執行長正解長度裁示修正 | "林女士剛好出國旅行" | "林女士出國旅行" |
| b2-u05-l06 | items/14/questions/0/options/0 | 執行長正解長度裁示修正 | "大廳正在整修" | "大廳正在進行整修" |
| b2-u05-l06 | items/14/questions/1/options/3 | 執行長正解長度裁示修正 | "輪流探望女兒和兒子" | "探望女兒和兒子" |
| b2-u05-l07 | items/9/options/0 | 執行長正解長度裁示修正 | "It will be repainted" | "It will be repainted and used again" |
| b2-u05-l07 | items/9/options/3 | 執行長正解長度裁示修正 | "It will become a school" | "It will become a school for children" |
| b2-u05-l07 | items/14/questions/0/options/0 | 執行長正解長度裁示修正 | "一疊舊照片" | "一疊五十多年前的照片" |
| b2-u05-l07 | items/14/questions/0/options/1 | 執行長正解長度裁示修正 | "一箱錢" | "一箱屋主藏起來的錢" |
| b2-u05-l07 | items/14/questions/1/options/0 | 執行長正解長度裁示修正 | "賣給博物館" | "把信賣給博物館，換來一筆錢" |
| b2-u05-l07 | items/14/questions/1/options/2 | 執行長正解長度裁示修正 | "每封留一份副本，原件寄給屋主家人" | "複製每封信，原件寄給屋主家人" |
| b2-u05-l07 | items/14/questions/1/options/3 | 執行長正解長度裁示修正 | "鎖在箱子裡" | "把原件鎖在箱子裡，副本寄給家人" |
| b2-u05-l07 | items/14/questions/1/options/3 | 執行長正解長度裁示修正 | "把原件鎖在箱子裡，副本寄給家人" | "把信全部捐給鎮上的圖書館公開展覽" |
| b2-u05-l07 | items/9/options/0 | 執行長正解長度裁示修正 | "It will be repainted and used again" | "It will be used again" |
| b2-u05-l07 | items/14/questions/0/options/2 | 執行長正解長度裁示修正 | "一盒五十多年前的信" | "一盒很舊的信" |
| b2-u05-l07 | items/14/questions/0/options/3 | 執行長正解長度裁示修正 | "一把鑰匙" | "一把生鏽的舊鑰匙" |
| b2-u05-l07 | items/14/questions/1/options/0 | 執行長正解長度裁示修正 | "把信賣給博物館，換來一筆錢" | "把信全部賣給博物館，換來一筆錢" |
| b2-u05-l07 | items/14/questions/1/options/1 | 執行長正解長度裁示修正 | "全部丟掉" | "把所有的信全部丟掉" |
| b2-u05-l08 | items/14/questions/0/options/0 | 執行長正解長度裁示修正 | "總經理的秘書" | "總經理辦公室的一位年輕秘書" |
| b2-u05-l08 | items/14/questions/0/options/2 | 執行長正解長度裁示修正 | "一位客戶" | "一位常來公司的老客戶" |
| b2-u05-l08 | items/14/questions/1/options/0 | 執行長正解長度裁示修正 | "產品價格上漲了" | "產品價格上漲了百分之十五" |
| b2-u05-l08 | items/14/questions/1/options/1 | 執行長正解長度裁示修正 | "員工人數增加了" | "員工人數增加了十五個人" |
| b2-u05-l08 | items/9/options/0 | 執行長正解長度裁示修正 | "Speak more quietly" | "Keep their voices down" |
| b2-u05-l08 | items/14/questions/1/options/2 | 執行長正解長度裁示修正 | "辦公室搬家了" | "公司的辦公室搬到市中心" |
| b2-u05-l09 | items/9/options/1 | 執行長正解長度裁示修正 | "Because of a strong wind" | "Because of a very strong wind" |
| b2-u05-l09 | items/14/questions/0/options/1 | 執行長正解長度裁示修正 | "買了新的帳篷" | "去山下買了新的帳篷" |
| b2-u05-l09 | items/14/questions/1/options/0 | 執行長正解長度裁示修正 | "煮晚餐給大家吃" | "煮晚餐給大家吃，再講露營的故事" |
| b2-u05-l09 | items/14/questions/1/options/3 | 執行長正解長度裁示修正 | "去附近散步" | "帶大家去附近散步、看星星" |
| b2-u05-l09 | items/9/options/1 | 執行長正解長度裁示修正 | "Because of a very strong wind" | "Because of a strong wind" |
| b2-u05-l09 | items/14/questions/0/options/2 | 執行長正解長度裁示修正 | "用膠帶把它綁起來" | "用膠帶綁起來" |
| b2-u05-l09 | items/14/questions/0/options/0 | 執行長正解長度裁示修正 | "改睡在車上" | "全部改睡在車上" |
| b2-u05-l09 | items/14/questions/0/options/3 | 執行長正解長度裁示修正 | "打電話求救" | "打電話向山下求救" |
| b2-u05-l09 | items/14/questions/1/options/0 | 執行長正解長度裁示修正 | "煮晚餐給大家吃，再講露營的故事" | "煮晚餐給大家吃" |
| b2-u05-l09 | items/14/questions/1/options/2 | 執行長正解長度裁示修正 | "修理車子" | "把大家的車子修好" |
| b2-u06-l01 | items/14/questions/0/options/1 | 執行長正解長度裁示修正 | "工作量非常大" | "每天的工作量非常大" |
| b2-u06-l01 | items/14/questions/1/options/3 | 執行長正解長度裁示修正 | "自己每天加班" | "自己每天加班到深夜" |
| b2-u06-l01 | items/9/options/3 | 執行長正解長度裁示修正 | "Meet the manager" | "Meet the new manager" |
| b2-u06-l01 | items/14/questions/0/options/0 | 執行長正解長度裁示修正 | "辦公室非常大" | "辦公室的空間非常大" |
| b2-u06-l01 | items/14/questions/0/options/3 | 執行長正解長度裁示修正 | "薪水非常高" | "新進員工的薪水非常高" |
| b2-u06-l01 | items/14/questions/1/options/0 | 執行長正解長度裁示修正 | "降低產品價格" | "大幅降低產品價格" |
| b2-u06-l01 | items/14/questions/1/options/1 | 執行長正解長度裁示修正 | "裁減員工" | "裁減部門一半的員工" |
| b2-u06-l02 | items/14/questions/1/options/0 | 執行長正解長度裁示修正 | "把房間打掃乾淨" | "先把整個房間打掃乾淨" |
| b2-u06-l02 | items/14/questions/0/options/0 | 執行長正解長度裁示修正 | "價格太高" | "房租價格太高" |
| b2-u06-l02 | items/9/options/2 | 執行長正解長度裁示修正 | "It is torn" | "It is torn in half" |
| b2-u06-l02 | items/14/questions/0/options/3 | 執行長正解長度裁示修正 | "沒有洗衣機" | "房間沒有洗衣機" |
| b2-u06-l02 | items/14/questions/1/options/1 | 執行長正解長度裁示修正 | "先付一年的房租" | "先一次付清一整年的房租" |
| b2-u06-l03 | items/14/questions/0/options/1 | 執行長正解長度裁示修正 | "價格太貴" | "房間價格太貴" |
| b2-u06-l03 | items/9/options/0 | 執行長正解長度裁示修正 | "For sending a gift" | "For sending a nice gift" |
| b2-u06-l03 | items/14/questions/0/options/1 | 執行長正解長度裁示修正 | "房間價格太貴" | "價格太貴" |
| b2-u06-l03 | items/14/questions/0/options/0 | 執行長正解長度裁示修正 | "空房不夠" | "空房不夠多" |
| b2-u06-l03 | items/14/questions/1/options/2 | 執行長正解長度裁示修正 | "網路" | "網路的速度" |
| b2-u06-l03 | items/14/questions/1/options/0 | 執行長正解長度裁示修正 | "工作人員" | "飯店工作人員" |
| b2-u06-l03 | items/14/questions/1/options/3 | 執行長正解長度裁示修正 | "會議室" | "會議室的設備" |
| b2-u06-l03 | items/14/questions/1/options/1 | 執行長正解長度裁示修正 | "食物" | "飯店食物" |
| b2-u06-l04 | items/14/questions/1/options/0 | 執行長正解長度裁示修正 | "她下個月要搬家" | "她下個月就要搬到別的城市" |
| b2-u06-l04 | items/14/questions/1/options/1 | 執行長正解長度裁示修正 | "她要送人當禮物" | "她要把它送給朋友當禮物" |
| b2-u06-l04 | items/9/options/0 | 執行長正解長度裁示修正 | "After lunch" | "At night" |
| b2-u06-l04 | items/14/questions/0/options/1 | 執行長正解長度裁示修正 | "咖啡機送錯了" | "送來的咖啡機型號錯了" |
| b2-u06-l04 | items/14/questions/0/options/3 | 執行長正解長度裁示修正 | "咖啡機太吵" | "咖啡機的聲音太吵" |
| b2-u06-l04 | items/14/questions/1/options/1 | 執行長正解長度裁示修正 | "她要把它送給朋友當禮物" | "她要送給朋友當禮物" |
| b2-u06-l05 | items/14/questions/0/options/1 | 執行長正解長度裁示修正 | "食材太貴" | "食材的價格實在太貴" |
| b2-u06-l05 | items/14/questions/0/options/2 | 執行長正解長度裁示修正 | "員工不夠" | "廚房的員工不夠" |
| b2-u06-l05 | items/14/questions/0/options/1 | 執行長正解長度裁示修正 | "食材的價格實在太貴" | "食材價格太貴" |
| b2-u06-l05 | items/14/questions/0/options/2 | 執行長正解長度裁示修正 | "廚房的員工不夠" | "廚房員工不夠" |
| b2-u06-l06 | items/9/options/0 | 執行長正解長度裁示修正 | "At about three" | "At about three o'clock" |
| b2-u06-l06 | items/9/options/3 | 執行長正解長度裁示修正 | "At half past two" | "At around half past two" |
| b2-u06-l06 | items/14/questions/0/options/1 | 執行長正解長度裁示修正 | "要寫一本劇院的歷史" | "要寫一本關於劇院的歷史書" |
| b2-u06-l06 | items/9/options/0 | 執行長正解長度裁示修正 | "At about three o'clock" | "At about three in the afternoon" |
| b2-u06-l06 | items/14/questions/1/options/3 | 執行長正解長度裁示修正 | "經費" | "經費不足" |
| b2-u06-l06 | items/14/questions/1/options/1 | 執行長正解長度裁示修正 | "時間不夠" | "時間不太夠" |
| b2-u06-l06 | items/14/questions/1/options/2 | 執行長正解長度裁示修正 | "工人不足" | "缺工人" |
| b2-u06-l06 | items/9/options/2 | 執行長正解長度裁示修正 | "At noon" | "At twelve o'clock" |
| b2-u06-l07 | items/14/questions/0/options/1 | 執行長正解長度裁示修正 | "員工人數太少" | "負責電腦的員工人數太少" |
| b2-u06-l07 | items/14/questions/1/options/0 | 執行長正解長度裁示修正 | "印表機常壞、網路太貴" | "印表機常常壞、網路的費用太貴" |
| b2-u06-l07 | items/14/questions/0/options/3 | 執行長正解長度裁示修正 | "公司的系統不夠先進" | "系統不夠先進" |
| b2-u06-l07 | items/14/questions/0/options/0 | 執行長正解長度裁示修正 | "預算花太多" | "每年的預算花太多" |
| b2-u06-l07 | items/14/questions/0/options/2 | 執行長正解長度裁示修正 | "辦公室太小" | "辦公室空間太小" |
| b2-u06-l07 | items/14/questions/1/options/0 | 執行長正解長度裁示修正 | "印表機常常壞、網路的費用太貴" | "印表機常壞、網路費用太貴" |
| b2-u06-l08 | items/14/questions/0/options/1 | 執行長正解長度裁示修正 | "特殊的機器" | "特殊的機器和事先藏好的硬幣" |
| b2-u06-l08 | items/14/questions/0/options/2 | 執行長正解長度裁示修正 | "細微的動作和引開注意力的次要動作" | "細微的動作和引開注意力的動作" |
| b2-u06-l08 | items/14/questions/0/options/3 | 執行長正解長度裁示修正 | "昂貴的道具" | "昂貴的道具和舞台上的燈光與音樂" |
| b2-u06-l08 | items/14/questions/1/options/0 | 執行長正解長度裁示修正 | "開一家玩具店" | "開一家賣玩具和圖書的店" |
| b2-u06-l08 | items/14/questions/1/options/1 | 執行長正解長度裁示修正 | "當老師" | "當學校的數學老師" |
| b2-u06-l08 | items/9/options/3 | 執行長正解長度裁示修正 | "Sales fell a lot" | "Sales dropped a great deal" |
| b2-u06-l08 | items/14/questions/1/options/0 | 執行長正解長度裁示修正 | "開一家賣玩具和圖書的店" | "開一家賣玩具的店" |
| b2-u06-l08 | items/14/questions/0/options/0 | 執行長正解長度裁示修正 | "觀眾的幫忙" | "觀眾在台上的幫忙" |
| b2-u06-l08 | items/14/questions/1/options/2 | 執行長正解長度裁示修正 | "去學跳舞" | "去舞蹈班學跳舞" |
| b2-u06-l09 | items/14/questions/0/options/1 | 執行長正解長度裁示修正 | "可以完全摺平" | "可以完全摺平，放進更多行李" |
| b2-u06-l09 | items/14/questions/0/options/2 | 執行長正解長度裁示修正 | "加裝了小冰箱" | "加裝了小冰箱和兩個螢幕" |
| b2-u06-l09 | items/14/questions/0/options/3 | 執行長正解長度裁示修正 | "比較寬，三個大人可以坐得舒服" | "比較寬，三個大人坐得舒服" |
| b2-u06-l09 | items/14/questions/1/options/1 | 執行長正解長度裁示修正 | "車子的速度" | "車子的速度很快" |
| b2-u06-l09 | items/14/questions/1/options/2 | 執行長正解長度裁示修正 | "買主的好運" | "帶給買主未來的好運" |
| b2-u06-l09 | items/14/questions/1/options/0 | 執行長正解長度裁示修正 | "新車的顏色" | "今年新車款的顏色" |
| b2-u06-l09 | items/14/questions/1/options/1 | 執行長正解長度裁示修正 | "車子的速度很快" | "車子的速度非常快" |
| b2-u07-l01 | items/9/options/2 | 執行長正解長度裁示修正 | "The train has left" | "The train has already left" |
| b2-u07-l01 | items/14/questions/0/options/0 | 執行長正解長度裁示修正 | "報告寫得太長" | "每份報告都寫得太長" |
| b2-u07-l01 | items/14/questions/0/options/2 | 執行長正解長度裁示修正 | "電費太高" | "辦公室的電費太高" |
| b2-u07-l01 | items/14/questions/1/options/3 | 執行長正解長度裁示修正 | "需要更多桌子" | "需要買更多新桌子" |
| b2-u07-l01 | items/9/options/3 | 執行長正解長度裁示修正 | "They should run" | "They should run to the train" |
| b2-u07-l01 | items/14/questions/0/options/2 | 執行長正解長度裁示修正 | "辦公室的電費太高" | "電費太高" |
| b2-u07-l01 | items/14/questions/1/options/0 | 執行長正解長度裁示修正 | "工作量變多了" | "工作變多了" |
| b2-u07-l01 | items/14/questions/1/options/2 | 執行長正解長度裁示修正 | "報告寫得更慢" | "報告寫得比以前慢" |
| b2-u07-l02 | items/9/options/2 | 執行長正解長度裁示修正 | "The office is closed" | "The office is closed today" |
| b2-u07-l02 | items/9/options/3 | 執行長正解長度裁示修正 | "The plan is not ready" | "The project plan is not finished yet" |
| b2-u07-l02 | items/14/questions/1/options/1 | 執行長正解長度裁示修正 | "機器壞了" | "機器壞了，停工兩個星期" |
| b2-u07-l02 | items/14/questions/1/options/2 | 執行長正解長度裁示修正 | "工人不足，失去一些訂單" | "工人不足，丟了訂單" |
| b2-u07-l02 | items/14/questions/1/options/3 | 執行長正解長度裁示修正 | "電費太高" | "電費太高，被迫減產" |
| b2-u07-l02 | items/9/options/3 | 執行長正解長度裁示修正 | "The project plan is not finished yet" | "The plan is not ready" |
| b2-u07-l02 | items/14/questions/1/options/3 | 執行長正解長度裁示修正 | "電費太高，被迫減產" | "電費太高，減產了" |
| b2-u07-l02 | items/14/questions/1/options/0 | 執行長正解長度裁示修正 | "鋼材不夠" | "鋼材的原料不夠" |
| b2-u07-l03 | items/14/questions/0/options/0 | 執行長正解長度裁示修正 | "客人嫌湯太鹹" | "有些客人嫌招牌湯太鹹又太油" |
| b2-u07-l03 | items/14/questions/0/options/1 | 執行長正解長度裁示修正 | "有些週的食材成本超過營業額" | "食材成本有時超過營業額" |
| b2-u07-l03 | items/14/questions/0/options/2 | 執行長正解長度裁示修正 | "店面太舊" | "店面太舊，客人越來越少" |
| b2-u07-l03 | items/9/options/2 | 執行長正解長度裁示修正 | "At three" | "Around three" |
| b2-u07-l03 | items/9/options/3 | 執行長正解長度裁示修正 | "Tomorrow" | "Tomorrow night" |
| b2-u07-l03 | items/14/questions/0/options/0 | 執行長正解長度裁示修正 | "有些客人嫌招牌湯太鹹又太油" | "客人嫌招牌湯太鹹" |
| b2-u07-l03 | items/14/questions/0/options/2 | 執行長正解長度裁示修正 | "店面太舊，客人越來越少" | "店面太舊，客人變少" |
| b2-u07-l03 | items/14/questions/1/options/2 | 執行長正解長度裁示修正 | "更大碗的湯" | "大碗的湯" |
| b2-u07-l03 | items/14/questions/0/options/3 | 執行長正解長度裁示修正 | "員工太少" | "店裡員工太少" |
| b2-u07-l04 | items/9/options/1 | 執行長正解長度裁示修正 | "Wait outside" | "Wait outside for a while" |
| b2-u07-l04 | items/9/options/3 | 執行長正解長度裁示修正 | "Bring more chairs" | "Bring more chairs into the room" |
| b2-u07-l04 | items/14/questions/1/options/1 | 執行長正解長度裁示修正 | "一座舊工廠" | "一座舊工廠的機器" |
| b2-u07-l04 | items/14/questions/1/options/2 | 執行長正解長度裁示修正 | "一條地下河" | "一條古老的地下河" |
| b2-u07-l04 | items/9/options/3 | 執行長正解長度裁示修正 | "Bring more chairs into the room" | "Bring more chairs" |
| b2-u07-l04 | items/14/questions/0/options/1 | 執行長正解長度裁示修正 | "年輕人都搬去城市" | "年輕人搬走了" |
| b2-u07-l04 | items/14/questions/1/options/2 | 執行長正解長度裁示修正 | "一條古老的地下河" | "一條地下河" |
| b2-u07-l04 | items/14/questions/1/options/0 | 執行長正解長度裁示修正 | "一箱錢" | "一箱舊錢幣" |
| b2-u07-l05 | items/9/options/0 | 執行長正解長度裁示修正 | "Real houses" | "Real houses for sale" |
| b2-u07-l05 | items/9/options/1 | 執行長正解長度裁示修正 | "Large paintings" | "Large paintings of houses" |
| b2-u07-l05 | items/14/questions/1/options/3 | 執行長正解長度裁示修正 | "燈會一直閃" | "小燈會一直閃" |
| b2-u07-l05 | items/14/questions/0/options/3 | 執行長正解長度裁示修正 | "十年前" | "大約十年前" |
| b2-u07-l05 | items/14/questions/0/options/2 | 執行長正解長度裁示修正 | "二十年前" | "大約二十年前" |
| b2-u07-l05 | items/9/options/2 | 執行長正解長度裁示修正 | "Old cars" | "Some old cars" |
| b2-u07-l06 | items/9/options/2 | 執行長正解長度裁示修正 | "Call the guests" | "Call the guests about the party" |
| b2-u07-l06 | items/9/options/3 | 執行長正解長度裁示修正 | "Clean the room" | "Clean the room before the party" |
| b2-u07-l06 | items/14/questions/0/options/0 | 執行長正解長度裁示修正 | "古董店買的" | "爺爺在古董店一枚一枚買的" |
| b2-u07-l06 | items/14/questions/0/options/1 | 執行長正解長度裁示修正 | "銀行換來的" | "爺爺出國旅行時在銀行兌換來的" |
| b2-u07-l06 | items/14/questions/1/options/0 | 執行長正解長度裁示修正 | "依顏色" | "依顏色和材質" |
| b2-u07-l06 | items/14/questions/1/options/2 | 執行長正解長度裁示修正 | "依大小" | "依硬幣的大小和厚度" |
| b2-u07-l06 | items/14/questions/1/options/0 | 執行長正解長度裁示修正 | "依顏色和材質" | "依顏色深淺" |
| b2-u07-l06 | items/9/options/1 | 執行長正解長度裁示修正 | "Buy more tables" | "Buy more tables first" |
| b2-u07-l06 | items/14/questions/0/options/3 | 執行長正解長度裁示修正 | "朋友送的" | "爺爺的朋友送給他的" |
| b2-u07-l06 | items/14/questions/1/options/3 | 執行長正解長度裁示修正 | "依重量" | "依硬幣重量" |
| b2-u07-l07 | items/9/options/0 | 執行長正解長度裁示修正 | "The room is too big" | "The room is much too big" |
| b2-u07-l07 | items/9/options/2 | 執行長正解長度裁示修正 | "The speaker is tired" | "The speaker is too tired to talk" |
| b2-u07-l07 | items/14/questions/0/options/1 | 執行長正解長度裁示修正 | "員工不夠" | "包裝的員工不夠" |
| b2-u07-l07 | items/14/questions/0/options/2 | 執行長正解長度裁示修正 | "產品缺貨" | "產品常常缺貨" |
| b2-u07-l07 | items/14/questions/1/options/0 | 執行長正解長度裁示修正 | "一組湯匙" | "一組很小的湯匙" |
| b2-u07-l07 | items/14/questions/1/options/3 | 執行長正解長度裁示修正 | "一塊砧板" | "一塊很厚的砧板" |
| b2-u07-l07 | items/9/options/2 | 執行長正解長度裁示修正 | "The speaker is too tired to talk" | "The speaker is tired" |
| b2-u07-l07 | items/9/options/0 | 執行長正解長度裁示修正 | "The room is much too big" | "The room is too big" |
| b2-u07-l07 | items/14/questions/0/options/2 | 執行長正解長度裁示修正 | "產品常常缺貨" | "產品常常都缺貨" |
| b2-u07-l07 | items/14/questions/1/options/0 | 執行長正解長度裁示修正 | "一組很小的湯匙" | "一組湯匙" |
| b2-u07-l08 | items/9/options/1 | 執行長正解長度裁示修正 | "Carry them onto the plane" | "Carry them onto the plane yourself" |
| b2-u07-l08 | items/14/questions/0/options/2 | 執行長正解長度裁示修正 | "接到一筆大訂單" | "接到一筆很大的訂單" |
| b2-u07-l08 | items/14/questions/1/options/0 | 執行長正解長度裁示修正 | "和一枚硬幣一樣大" | "和一枚十元硬幣一樣大" |
| b2-u07-l08 | items/14/questions/0/options/0 | 執行長正解長度裁示修正 | "銀快要賣完了" | "銀快要全部賣完了" |
| b2-u07-l08 | items/14/questions/1/options/1 | 執行長正解長度裁示修正 | "有些只有三毫米寬" | "有些三毫米寬" |
| b2-u07-l08 | items/14/questions/1/options/2 | 執行長正解長度裁示修正 | "大約一公分寬" | "大約有一公分寬" |
| b2-u07-l08 | items/14/questions/1/options/3 | 執行長正解長度裁示修正 | "只有五毫米厚" | "有些只有五毫米厚" |
| b2-u07-l09 | items/13/questions/0/options/0 | 執行長正解長度裁示修正 | "糖放太少了" | "糖放得太少了" |
| b2-u07-l09 | items/13/questions/0/options/2 | 執行長正解長度裁示修正 | "烤箱太熱了" | "烤箱溫度太高了" |
| b2-u07-l09 | items/13/questions/1/options/1 | 執行長正解長度裁示修正 | "奶奶的食譜" | "奶奶那份英格蘭的老食譜" |
| b2-u07-l09 | items/13/questions/1/options/2 | 執行長正解長度裁示修正 | "一個測微計" | "老師用過的測微計" |
| b2-u07-l09 | items/13/questions/0/options/0 | 執行長正解長度裁示修正 | "糖放得太少了" | "糖放得實在太少了" |
| b2-u07-l09 | items/13/questions/0/options/3 | 執行長正解長度裁示修正 | "忘了放蛋" | "忘了放雞蛋進去" |
| b2-u07-l09 | items/13/questions/1/options/2 | 執行長正解長度裁示修正 | "老師用過的測微計" | "老師以前用過的測微計" |
| b2-u07-l09 | items/13/questions/1/options/0 | 執行長正解長度裁示修正 | "一瓶牛奶" | "一整瓶的牛奶" |
| b2-u08-l01 | items/10/options/1 | 執行長正解長度裁示修正 | "Everyone must take it" | "Everyone must take it in the first week" |
| b2-u08-l01 | items/10/options/3 | 執行長正解長度裁示修正 | "It is only for managers" | "It is only for managers and team leaders" |
| b2-u08-l01 | items/15/questions/0/options/0 | 執行長正解長度裁示修正 | "可以自由選擇要不要進辦公室" | "自由選擇要不要進辦公室" |
| b2-u08-l01 | items/15/questions/0/options/1 | 執行長正解長度裁示修正 | "一定要進辦公室" | "每個人一定要進辦公室開會" |
| b2-u08-l01 | items/15/questions/0/options/2 | 執行長正解長度裁示修正 | "全公司放假" | "全公司放假，大家在家休息" |
| b2-u08-l01 | items/15/questions/1/options/0 | 執行長正解長度裁示修正 | "經理自己都在家工作" | "經理自己每週都在家工作兩天" |
| b2-u08-l01 | items/15/questions/1/options/3 | 執行長正解長度裁示修正 | "新專案早就結束了" | "新專案其實一年前就結束了" |
| b2-u08-l01 | items/10/options/1 | 執行長正解長度裁示修正 | "Everyone must take it in the first week" | "Everyone must take it" |
| b2-u08-l01 | items/10/options/3 | 執行長正解長度裁示修正 | "It is only for managers and team leaders" | "It is only for managers" |
| b2-u08-l01 | items/15/questions/0/options/1 | 執行長正解長度裁示修正 | "每個人一定要進辦公室開會" | "每個人都要進辦公室" |
| b2-u08-l01 | items/15/questions/1/options/1 | 執行長正解長度裁示修正 | "公司一年前才稱讚在家工作" | "公司一年前稱讚在家工作" |
| b2-u08-l01 | items/15/questions/1/options/2 | 執行長正解長度裁示修正 | "辦公室太小坐不下" | "辦公室太小，坐不下所有人" |
| b2-u08-l01 | items/15/questions/0/options/3 | 執行長正解長度裁示修正 | "只上半天班" | "星期五只上半天班" |
| b2-u08-l01 | items/15/questions/0/options/3 | 執行長正解長度裁示修正 | "星期五只上半天班" | "星期五上半天的班" |
| b2-u08-l02 | items/15/questions/0/options/1 | 執行長正解長度裁示修正 | "非常有把握" | "對長期的未來非常有把握" |
| b2-u08-l02 | items/15/questions/0/options/3 | 執行長正解長度裁示修正 | "打算出國工作" | "打算幾年內出國工作" |
| b2-u08-l02 | items/15/questions/1/options/0 | 執行長正解長度裁示修正 | "公司裡年輕人很少" | "公司裡的年輕員工人數其實很少" |
| b2-u08-l02 | items/15/questions/1/options/1 | 執行長正解長度裁示修正 | "報告的日期寫錯了" | "報告裡的日期和公司名稱都寫錯了" |
| b2-u08-l02 | items/10/options/0 | 執行長正解長度裁示修正 | "Call the boss" | "Call the boss right now" |
| b2-u08-l02 | items/10/options/1 | 執行長正解長度裁示修正 | "Cancel the meeting" | "Cancel the meeting today" |
| b2-u08-l02 | items/15/questions/0/options/3 | 執行長正解長度裁示修正 | "打算幾年內出國工作" | "打算幾年內就出國去工作" |
| b2-u08-l02 | items/15/questions/1/options/2 | 執行長正解長度裁示修正 | "經理這樣告訴他們" | "經理在會議上這樣告訴他們" |
| b2-u08-l02 | items/15/questions/1/options/3 | 執行長正解長度裁示修正 | "公司很多年輕員工待了五年以上" | "很多年輕員工待超過五年" |
| b2-u08-l02 | items/15/questions/0/options/2 | 執行長正解長度裁示修正 | "想自己創業" | "想要自己出來創業" |
| b2-u08-l03 | items/10/options/3 | 執行長正解長度裁示修正 | "The manager left early too" | "The manager left work early too" |
| b2-u08-l03 | items/15/questions/0/options/0 | 執行長正解長度裁示修正 | "重新裝潢辦公室" | "重新裝潢整間舊辦公室" |
| b2-u08-l03 | items/15/questions/0/options/1 | 執行長正解長度裁示修正 | "招募新員工" | "招募更多新的員工" |
| b2-u08-l03 | items/15/questions/1/options/0 | 執行長正解長度裁示修正 | "工作時間太長" | "每天的工作時間太長" |
| b2-u08-l03 | items/15/questions/1/options/3 | 執行長正解長度裁示修正 | "辦公室離家太遠" | "辦公室離大家住的地方太遠" |
| b2-u08-l03 | items/15/questions/1/options/0 | 執行長正解長度裁示修正 | "每天的工作時間太長" | "每天的工作時間實在太長" |
| b2-u08-l03 | items/15/questions/1/options/1 | 執行長正解長度裁示修正 | "薪水太低" | "大家的薪水太低" |
| b2-u08-l04 | items/9/options/2 | 執行長正解長度裁示修正 | "Because many people came" | "Because many people came to help" |
| b2-u08-l04 | items/9/options/0 | 執行長正解長度裁示修正 | "Because of good weather" | "Because of very good weather" |
| b2-u08-l04 | items/9/options/3 | 執行長正解長度裁示修正 | "Because it was free" | "Because it was free for everyone" |
| b2-u08-l04 | items/14/questions/0/options/3 | 執行長正解長度裁示修正 | "討論加班費" | "討論加班費的問題" |
| b2-u08-l04 | items/14/questions/1/options/1 | 執行長正解長度裁示修正 | "幫他加薪" | "幫他調高薪水" |
| b2-u08-l05 | items/9/options/1 | 執行長正解長度裁示修正 | "Prices will go down" | "Prices will go down next month" |
| b2-u08-l05 | items/14/questions/0/options/3 | 執行長正解長度裁示修正 | "新進員工" | "一位新進員工" |
| b2-u08-l05 | items/14/questions/1/options/0 | 執行長正解長度裁示修正 | "清潔人員的薪水最高" | "清潔人員的薪水比經理高" |
| b2-u08-l05 | items/9/options/3 | 執行長正解長度裁示修正 | "The store opens early" | "The store opens early every day" |
| b2-u08-l05 | items/14/questions/0/options/0 | 執行長正解長度裁示修正 | "清潔人員" | "清潔工" |
| b2-u08-l05 | items/14/questions/0/options/2 | 執行長正解長度裁示修正 | "總監" | "女總監" |
| b2-u08-l05 | items/14/questions/0/options/2 | 執行長正解長度裁示修正 | "女總監" | "老闆" |
| b2-u08-l05 | items/14/questions/0/options/2 | 執行長正解長度裁示修正 | "老闆" | "董事長" |
| b2-u08-l06 | items/14/questions/0/options/0 | 執行長正解長度裁示修正 | "經理不在公司" | "經理很少待在公司" |
| b2-u08-l06 | items/14/questions/0/options/3 | 執行長正解長度裁示修正 | "公司要搬家" | "公司要搬到南部的城市" |
| b2-u08-l06 | items/14/questions/1/options/1 | 執行長正解長度裁示修正 | "取消所有規定" | "取消所有新的工作時間規定" |
| b2-u08-l06 | items/9/options/0 | 執行長正解長度裁示修正 | "Buy now" | "Buy it now" |
| b2-u08-l06 | items/9/options/2 | 執行長正解長度裁示修正 | "Sell everything" | "Sell them" |
| b2-u08-l06 | items/14/questions/0/options/0 | 執行長正解長度裁示修正 | "經理很少待在公司" | "經理很少待在公司裡面" |
| b2-u08-l07 | items/14/questions/0/options/0 | 執行長正解長度裁示修正 | "新辦公室太遠" | "他認為新辦公室離捷運站太遠" |
| b2-u08-l07 | items/14/questions/0/options/3 | 執行長正解長度裁示修正 | "他打算離職" | "他打算明年就離開公司" |
| b2-u08-l07 | items/9/options/0 | 執行長正解長度裁示修正 | "Seven o'clock" | "Seven" |
| b2-u08-l07 | items/14/questions/0/options/0 | 執行長正解長度裁示修正 | "他認為新辦公室離捷運站太遠" | "他認為新辦公室太遠" |
| b2-u08-l07 | items/14/questions/1/options/3 | 執行長正解長度裁示修正 | "換一位經理" | "換經理" |
| b2-u08-l08 | items/9/options/0 | 執行長正解長度裁示修正 | "Something in the garden" | "Something you grow in the garden" |
| b2-u08-l08 | items/14/questions/0/options/1 | 執行長正解長度裁示修正 | "搬去國外，還是留在家鄉" | "搬去國外工作，還是留在台灣的家鄉" |
| b2-u08-l08 | items/14/questions/1/options/1 | 執行長正解長度裁示修正 | "那家店要被賣掉" | "父親早就打算把那家老店賣掉了" |
| b2-u08-l08 | items/9/options/0 | 執行長正解長度裁示修正 | "Something you grow in the garden" | "Something in the garden" |
| b2-u08-l08 | items/14/questions/0/options/0 | 執行長正解長度裁示修正 | "買房子，還是租房子" | "要在城裡買房子，還是繼續租房子" |
| b2-u08-l08 | items/14/questions/0/options/2 | 執行長正解長度裁示修正 | "結婚，還是繼續讀書" | "早點結婚，還是去大學繼續讀書" |
| b2-u08-l08 | items/14/questions/1/options/2 | 執行長正解長度裁示修正 | "她父親曾為她放棄自己的夢想" | "父親曾為她放棄夢想" |
| b2-u08-l08 | items/14/questions/1/options/0 | 執行長正解長度裁示修正 | "她其實不會畫畫" | "她其實一點都不會畫畫" |
| b2-u08-l08 | items/14/questions/1/options/3 | 執行長正解長度裁示修正 | "她父親是有名的畫家" | "她父親以前是有名的畫家" |
| b2-u08-l09 | items/9/options/0 | 執行長正解長度裁示修正 | "To sell old products" | "To sell old products quickly" |
| b2-u08-l09 | items/14/questions/0/options/1 | 執行長正解長度裁示修正 | "認為很聰明" | "認為很棒" |
| b2-u08-l09 | items/14/questions/0/options/2 | 執行長正解長度裁示修正 | "想一起投資" | "想要一起出錢投資" |
| b2-u08-l09 | items/14/questions/1/options/2 | 執行長正解長度裁示修正 | "租金比較低" | "那裡的租金比較低" |
| b2-u08-l10 | items/9/options/0 | 執行長正解長度裁示修正 | "The shop opened late" | "The shop opened two hours late" |
| b2-u08-l10 | items/14/questions/0/options/0 | 執行長正解長度裁示修正 | "他從沒明確說明產品是給誰用的" | "沒說清楚產品是給誰用的" |
| b2-u08-l10 | items/14/questions/0/options/1 | 執行長正解長度裁示修正 | "產品的品質不好" | "產品的品質其實不夠好" |
| b2-u08-l10 | items/14/questions/0/options/3 | 執行長正解長度裁示修正 | "他應該放棄這家公司" | "他應該早一點放棄這家公司" |
| b2-u08-l10 | items/14/questions/1/options/1 | 執行長正解長度裁示修正 | "最早拒絕他的銀行成了最大的支持者" | "最早拒絕他的銀行最支持他" |
| b2-u08-l10 | items/14/questions/1/options/2 | 執行長正解長度裁示修正 | "咖啡店都不喜歡他的產品" | "附近小咖啡店都不喜歡他的產品" |
| b2-u08-l10 | items/14/questions/0/options/3 | 執行長正解長度裁示修正 | "他應該早一點放棄這家公司" | "他應該早點放棄" |
| b2-u08-l10 | items/14/questions/1/options/0 | 執行長正解長度裁示修正 | "朋友開了一樣的公司" | "他最好的朋友開了一樣的公司" |
| b2-u08-l10 | items/14/questions/1/options/3 | 執行長正解長度裁示修正 | "他最後去銀行上班" | "他最後自己跑去那家銀行上班" |
| b2-u08-l10 | items/9/options/1 | 執行長正解長度裁示修正 | "Nobody came" | "Nobody came to the shop" |

共 394 筆。
