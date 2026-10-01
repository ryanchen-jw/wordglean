---
id: TASK-6
title: 單字資料管線——CEFR-J／Octanove／TSL／NGSL／ECDICT 匯入與繁中化
status: Done
assignee: []
created_date: '2026-10-01 16:00'
updated_date: '2026-10-01 15:09'
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
【借鑑】匯入 ECDICT 時丟棄 oxford、collins、tag 三欄（oxford 屬牛津 3000 版權衍生；另兩欄非在地需求）；lemma.en.txt（詞形對照表，MIT）一併切片供 TASK-16 使用。（參考 docs/research/oss-landscape.md）
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 所有來源的授權原文存於 data/licenses/，NOTICE 列出每個來源、版本、授權、修改說明；任何未核一手的授權在卡 comment 明列
- [x] #2 lexicon 筆數、各 CEFR 級字數、多益旗標字數輸出成統計報告；抽 30 個字人工比對來源一致
- [x] #3 繁中化檢查：轉換後抽 50 條釋義無簡體字；腳本可重跑且輸出位元組一致（同來源版本）
- [x] #4 字典切片總大小與單片最大值列入報告；瀏覽器端查一個字的冷啟動延遲（chromium 模擬）< 300ms
- [x] #5 data/CLAUDE.md 寫好（來源、授權分界、重建指令）
- [x] #6 守衛測試：lexicon 與字典切片不含任何 Oxford 3000 衍生欄位（oxford 欄或同等資訊），CI 必跑
<!-- AC:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
2026-10-01 執行長代決：CEFR-J 用 olp GitHub 1.5 版（1.6 需填表、不可重現下載）；原表不進 repo；衍生級距獨立檔 data/sources/cefrj/levels.json 依原條款標出處、不標 CC BY-SA。規格寫 1.6、『data/ 整體 CC BY-SA』兩處待創辦人裁示是否改條文。字典收錄篩選（有詞頻／lemma／lexicon，排除片語）。截斷：每詞性≤3義項、每詞條≤160字。

2026-10-01 執行長代決（結案前）：D1 lemma.en.txt 檔頭限 research/educational purposes→依授權有疑慮排除，改用 ECDICT exchange 欄反推 56,911 組詞形對照（MIT 範圍）；D2 CEFR-J 官網自述曾比對 EVP 補字→CEFR-J 為規格明文來源、條款明確，維持採用，列報告告知創辦人；D3 s2twp 用詞誤轉（最高級→最高階 458 等）→加獨立反向修正表；lexicon id 保留大小寫、TASK-7 依小寫聚合。統計：lexicon 10,202 筆／9,073 字；字典 12.4 萬詞、596 片、gzip 3.29MB、最大片 113KB；冷啟動中位 12.8ms／最大 193ms（本機無網路延遲）。ECDICT 釋義原始出處未核一手。

2026-10-01 驗收 PASS（隔離驗收官實跑）。選型：opencc 1.4.2（Apache-2.0）、pytest 9.1.1（MIT）、@playwright/test 1.63.0、actions/setup-python@v7；context7 未登入→查 PyPI/npm/GitHub（偏離）。殘留待順手修：ECDICT 原文簡體『于』6、『云』3 處；NOTICE 第 9 行舊句。
<!-- SECTION:NOTES:END -->
