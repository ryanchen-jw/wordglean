# 樣本課 fixture（TASK-12）

- 原文：TASK-8 手寫樣本課，分支 `worktree-task-8-item-bank` commit `198d5fa` 的 `content/test/fixtures/items/{a1-u01-l01,b1-u01-l01}.json`。
- **手補欄位**（題目格式擴充，TASK-12 Round 1 D1；TASK-8 產出前先手補）：`wordCard.glossZh`、`wordCard.distractorsZh`、`mcq.optionGlossZh`。其餘欄位與原文相同。
- 用途：引擎單元測試；E2E 建置以旗標把題目來源換成這兩課（正式建置只讀 `content/items`）。
- `a1-u01-l02.json`（TASK-18）：TASK-8 已合格題目檔原文，分支 `worktree-task-8-item-bank` commit `f6b2984` 的 `content/items/a1/a1-u01-l02.json`，內容未修改（僅以 Prettier 排版）；供 e2e「第二天接下一課」與複習測試。
- `a1-u01-l03.json`（創辦人試用 2026-10-04 合併驗證）：main `4007f04` 的 `content/items/a1/a1-u01-l03.json` 原文（造句改翻譯後，每課 2 題翻譯），內容未修改（僅以 Prettier 排版）；供 e2e「A1 兩題翻譯＋錯題重做」。
- `a2-p01-l01.json`（TASK-24 W5）：手寫片語樣本課（課綱 a2-p01-l01 的 7 個片語；片語卡 glossZh 第一義＝片語表第一義）。供 e2e「片語課走完一課（含配對）、點片語查義、收藏片語」（e2e 建置只讀 fixture；正式片語課題目已在 content/items，68 課）。
