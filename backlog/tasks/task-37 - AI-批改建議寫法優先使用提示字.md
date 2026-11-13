---
id: TASK-37
title: AI 批改建議寫法優先使用提示字
status: Done
assignee: []
created_date: '2026-11-13 15:21'
updated_date: '2026-11-13 16:08'
labels:
  - app
dependencies: []
priority: low
ordinal: 34000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
來源：創辦人 2026-11-13 裁示（照建議）。上線試用時「你昨天打電話給誰？」提示字 whom，AI 建議寫法卻用 who，看起來像提示錯（評分規則兩者都算對）。

【需求】
AI 批改的建議寫法，在自然的前提下優先使用題目的提示字。

【現況】
提示字以 Hint words 送進批改指令（app/src/llm/gradePrompt.ts 約 48 行），但沒有要求建議寫法使用。題目例：content/items/a2/a2-u01-l06.json q16。

【範圍】
做：批改指令加一句規則；單元測試斷言指令含此規則（造句題的必用字不受影響）。
不做：不做模型評測、不改模型清單。

【邊界】只動 app/src/llm 與其測試。
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 中翻英批改指令含「在自然的前提下，建議寫法優先使用提示字」規則，造句題不受影響
- [x] #2 有單元測試；lint、typecheck、npm test、build 過；openrouter e2e 綠
<!-- AC:END -->

## Comments

<!-- COMMENTS:BEGIN -->
created: 2026-11-13 16:08
---
2026-11-14 驗收通過（與 TASK-36、38 合驗 PASS）；prompt 版本 grade-writing.v4。
---
<!-- COMMENTS:END -->
