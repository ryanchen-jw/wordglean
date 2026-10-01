---
id: TASK-7
title: 課綱骨架——級距→主題單元→小課的結構與單字分配
status: Done
assignee: []
created_date: '2026-10-01 16:00'
updated_date: '2026-10-01 15:38'
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
- [x] #1 curriculum schema 與 validator 完成並有單元測試
- [x] #2 A1–C1 全部單元與小課生成，validator 全綠；統計報告列每級單元數、小課數、字數
- [x] #3 多益常考字在 B1–C1 的覆蓋率列入報告
- [x] #4 content/CLAUDE.md 寫好
<!-- AC:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
2026-10-01 驗收 PASS（隔離驗收官，含獨立重算）。代決：主題清單參考 CEFR-J 主題與 ETS 情境（不問創辦人，TASK-8 pilot 時可調整）；字→主題人工分類（Claude 訂閱額度、非 app 金鑰）；以小寫 headword 為單位、最低級引入一次；C2 不排課；每課 6–10 字目標 8；小課 ID a1-u01-l03 上線後凍結；授權依 data/LICENSES.md。選型：ajv 8.20（MIT）＋node:test；context7 未登入（偏離）。待 G5：TSL 377 字無級距未排課；B2/C1 有單課單元、C1『情緒與個性』占 25%。
<!-- SECTION:NOTES:END -->
