---
id: TASK-24
title: 片語學習——規劃並加入課綱
status: Done
assignee: []
created_date: '2026-10-05 11:47'
updated_date: '2026-10-05 11:54'
labels:
  - content
dependencies: []
priority: medium
ordinal: 24000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
來源：創辦人 2026-10-05「片語的學習好像有點少，請規劃並給我加入課綱的建議」。
【現況（執行長 10-05 盤點）】課綱 7,771 字中多字詞 141 個，多為複合名詞（ice cream、living room）；片語動詞僅 3 個（bulk up、turn to、fed up），give up、look for、pick up、get along with 等高頻片語動詞完全沒有；搭配詞（make a decision、take a photo）只出現在例句，未當學習目標、不進複習排程。原因：課綱由單字表（CEFR-J／Octanove／TSL／NGSL）排課，這些表以單字為主。
【建議方案】見課綱報告 Artifact 的「片語」節（六欄決策）；創辦人裁示後補範圍與 AC。
【dev-flow】plan → content（含資料來源授權查證）→ app（片語卡顯示、字典查片語）
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 片語來源授權查證完成（開放授權清單或開發端自編），結論寫入 data/LICENSES.md 與規劃文件
- [x] #2 各級片語清單（A2–C1）定稿並經創辦人看過樣本
- [x] #3 排課器加入片語單元：不位移既有課號、級距檔＝排課器產出、validator 全綠
- [x] #4 片語課題目撰寫完成並通過三關審查（check-items --require-judge 全綠）
- [x] #5 App：片語卡顯示、字典可查片語、片語進複習排程；e2e 全綠
<!-- AC:END -->

## Comments
<!-- COMMENTS:BEGIN -->
---
created: 2026-10-05 21:00
---
創辦人裁示（10-05）：選 A——A2–C1 各級新增「片語單元」（片語動詞＋常用搭配，約 400–500 個、60–70 課），插在主題單元之間、進複習排程、不位移既有 984 課課號。第一步：片語來源授權查證＋各級片語清單樣本給創辦人看。
---
---
created: 2026-10-06 16:30
---
創辦人與執行長 10-06 收尾：W4 四級 68 課片語題（A2 15、B1 20、B2 22、C1 11）經第③關審查與修正、重新盲答全一致，併入 0270b14、db32bae；W5 App 支援片語課併入 61593c6（隔離驗收兩輪：首輪 FAIL 守衛無紅證→PASS）。執行長代決：翻譯要點一律收不用片語但正確的說法；「姐」統一為「姊」；題目檔對照表移出首屏（199.42→183.21 kB）。創辦人核可文案：字典來源「資料來源：ECDICT；片語：拾字自編（CC BY-SA 4.0）」、授權頁片語表列。已知待處理（未阻擋）：come up with 與 figure out 第一義相同、give out 與 hand out 同義致配對難分（需改 data/phrases）；Dictionary.test 滿載偶發 unhandled TransactionInactiveError。
---
<!-- COMMENTS:END -->
