---
id: TASK-25
title: App 名稱與 Logo 定版
status: Done
assignee: []
created_date: '2026-10-05 14:16'
labels:
  - design
dependencies: []
priority: medium
ordinal: 25000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
來源：創辦人 2026-10-05「整個 App 的 Logo 最終定版……App 名稱重新定版，目前的這個我不太確定背後的含義，搭配幾版給我提議，LOGO＋app 名稱」。
【現況】名稱 LinguaApp（lingua＝拉丁文「語言」），圖示為 TASK-3 前的佔位圖（app/public/icons 192／512）。
【做法】執行長以純 SVG（程式碼產生、可縮放、深淺色可變）提出多組「名稱＋Logo」提案，Artifact 交付創辦人圈選；定版後實作。
【定版後範圍】PWA 圖示（192／512／maskable／apple-touch）、favicon、manifest name／short_name、App 內品牌字樣、README／NOTICE／隱私說明等文件中的名稱、自架指南。名稱需另查商標與網域（上線 TASK-23 前）。
<!-- SECTION:DESCRIPTION:END -->

## Comments
<!-- COMMENTS:BEGIN -->
---
created: 2026-10-05 22:30
---
創辦人裁示（10-05）：中文名「拾字」確定（選 B）。不喜歡第一版 Logo 色系：要依現有 App 風格重新設計，追求質感、簡約、蘋果風格（「看到圖示就覺得很高大上」）。再提 5 版色系與圖示；英文名重新設計（音譯 vs 意譯等多方向）。
---
created: 2026-10-06 10:00
---
創辦人裁示（10-06）：圖示選第 1 版「一張字卡」（紙色底、靛藍字卡傾斜被拾起、襯線 a、金點）；英文名 Wordglean。查證（10-06，非正式法律檢索）：wordglean.com、wordglean.app RDAP 皆未註冊；網路與 App 商店搜尋無同名產品；近似商標有 GLEAN EDUCATION（USPTO 6426241，識字教育課程）與企業搜尋 Glean，Wordglean 為合成字、風險低但上線前宜正式檢索。下一步：出定稿（各尺寸 PNG、maskable、favicon、字樣組合）給創辦人確認 → 派 worker 實作。
---
created: 2026-10-06 14:00
---
創辦人確認定稿（10-06）：① 定稿 OK（https://claude.ai/artifact/Cw6awHoaphrCM7LeEzqD1s）② 保留英文副標「Glean a word a day」（僅 App 商店與官網用，App 內不出現）。下一步派 worker 實作，合併前給創辦人手機桌面與 App 內截圖。
---
---
created: 2026-10-06 16:30
---
10-06 完成：58dd447 squash（隔離驗收 PASS：圖示與定稿逐位元組一致、any／maskable／apple／favicon 尺寸與透明度正確、manifest 與介面已改「拾字」、資料庫名與 localStorage key 未改）。創辦人裁示落實：同意說明「…只到你關掉拾字為止」、NOTICE「Copyright (C) 2026 Wordglean contributors」、驗證碼信「拾字 登入驗證碼」、英文副標僅用於 README／商店。首屏 +112B 執行長接受。
---
<!-- COMMENTS:END -->
