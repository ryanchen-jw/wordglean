---
id: TASK-7
title: 課綱骨架——級距→主題單元→小課的結構與單字分配
status: To Do
assignee: []
created_date: '2026-10-01 16:00'
labels:
  - content
dependencies:
  - TASK-6
priority: high
ordinal: 7000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
來源：docs/spec/requirements.md v0.1（2026-10-01 創辦人六輪釐清定案）
【需求】規格 §8：級距 → 主題單元 → 小課；每小課約 5 分鐘、約 8 個新字；主題可對應多益職場情境。
【範圍】做：content/schema/ 定義 curriculum JSON schema；A1–C1 每級的主題單元清單（A1–A2 偏生活、B1 起逐步加入多益職場主題）；依 lexicon 把各級單字分配到小課（同主題相關、詞頻由高到低、多益常考優先）；validator（每字只在一個小課首次出現、級距不越級、每課字數範圍）。不做：題目內容（TASK-8）。
【邊界】主題清單屬內容取捨，以代決原則處理：參考 CEFR-J 主題與多益官方題型情境，不另問創辦人；TASK-8 pilot 審核時創辦人可一併看到主題清單並調整。
【dev-flow】feat
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 curriculum schema 與 validator 完成並有單元測試
- [ ] #2 A1–C1 全部單元與小課生成，validator 全綠；統計報告列每級單元數、小課數、字數
- [ ] #3 多益常考字在 B1–C1 的覆蓋率列入報告
- [ ] #4 content/CLAUDE.md 寫好
<!-- AC:END -->
