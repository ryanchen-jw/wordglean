---
id: TASK-6
title: 單字資料管線——CEFR-J／Octanove／TSL／NGSL／ECDICT 匯入與繁中化
status: To Do
assignee: []
created_date: '2026-10-01 16:00'
labels:
  - data
dependencies:
  - TASK-5
priority: high
ordinal: 6000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
來源：docs/spec/requirements.md v0.1（2026-10-01 創辦人六輪釐清定案）
【需求】規格 §4、§2：分級用 CEFR-J＋Octanove，多益高頻用 TSL＋NGSL 標記，字典用 ECDICT 轉台灣繁體。
【範圍】做：data/scripts/ 下載與轉換腳本（可重跑、鎖來源版本與 checksum）；授權原文逐一存 data/licenses/，NOTICE 歸屬補齊；合併成 lexicon（headword、CEFR 等級、多益常考旗標、詞頻、詞性、音標、繁中釋義）；ECDICT 以 OpenCC s2twp 轉繁；字典切片（依首字母或雜湊分片）供瀏覽器延遲載入，單片大小上限 200KB gzip；釋義過長截斷規則。不做：Oxford 3000/5000、English Vocabulary Profile（版權不可用）。
【邊界】每份來源的授權條款須以一手原文核對（記憶 reference_agent_verbatim_claim_unreliable：抓不到原文就標未核，不可轉述二手）。若授權有疑慮，該來源排除並記錄，不得自行放寬。
【dev-flow】feat
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 所有來源的授權原文存於 data/licenses/，NOTICE 列出每個來源、版本、授權、修改說明；任何未核一手的授權在卡 comment 明列
- [ ] #2 lexicon 筆數、各 CEFR 級字數、多益旗標字數輸出成統計報告；抽 30 個字人工比對來源一致
- [ ] #3 繁中化檢查：轉換後抽 50 條釋義無簡體字；腳本可重跑且輸出位元組一致（同來源版本）
- [ ] #4 字典切片總大小與單片最大值列入報告；瀏覽器端查一個字的冷啟動延遲（chromium 模擬）< 300ms
- [ ] #5 data/CLAUDE.md 寫好（來源、授權分界、重建指令）
<!-- AC:END -->
