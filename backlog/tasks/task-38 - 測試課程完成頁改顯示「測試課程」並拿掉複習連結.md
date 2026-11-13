---
id: TASK-38
title: 測試課程完成頁改顯示「測試課程」並拿掉複習連結
status: In Progress
assignee: []
created_date: '2026-11-13 15:21'
labels:
  - app
dependencies: []
priority: low
ordinal: 35000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
來源：創辦人 2026-11-13 裁示（照建議）。走查發現從設定頁走完測試課程，完成頁副標寫「基礎常用字（一）・第 3 課」並有「再複習一次剛學的字」連結，看起來像真的上完第 3 課。

【需求】
測試課程（示範課 /lesson/demo）的完成頁副標顯示「測試課程」，並拿掉「再複習一次剛學的字」連結。正式課程不變。

【現況】
app/src/screens/lesson/LessonDone.tsx 已有 demo 分支（TASK-30 只換了主按鈕）；設定頁列名文案 settings 的「測試課程」可沿用。

【範圍】
做：完成頁 demo 分支改副標、隱藏複習連結；單元與 demo.spec 斷言。
不做：不改正式課完成頁、不改示範課題目。

【邊界】只動 LessonDone、LessonScreen 傳參與測試。
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 示範課完成頁副標為「測試課程」，沒有「再複習一次剛學的字」連結；正式課完成頁不變
- [ ] #2 有單元與 demo.spec 斷言；lint、typecheck、npm test、build 過；demo、lesson e2e 兩引擎綠
<!-- AC:END -->
