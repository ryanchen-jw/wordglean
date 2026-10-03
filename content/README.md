# content/——課綱與題庫

LinguaApp 的課程結構（級距 → 主題單元 → 小課）、題庫 JSON，以及產生與校驗它們的腳本。`app/` 在 build 時讀取這裡的資料。

| 路徑 | 用途 |
|---|---|
| `curriculum/` | 課綱：各級距的單元、小課與每課新字 |
| `items/{a1,a2,b1,b2,c1}/` | 題庫：一課一檔 JSON |
| `placement/` | 分級測驗題本 |
| `schema/`、`scripts/`、`test/` | JSON Schema、產生與檢查腳本、測試 |

## 授權

題庫與課程資料的授權**和程式碼分開**：

- 題庫 JSON（`items/`）：**CC BY-SA 4.0**——衍生自 CC BY-SA 單字表（Octanove C1/C2、TSL／NGSL）；題目由開發端撰寫。
- 課綱與分級測驗題本（`curriculum/`、`placement/`）：依 `data/LICENSES.md` 各來源條款（CEFR-J 衍生級距適用 CEFR-J 條款，不是 CC BY-SA）。
- 程式碼（`schema/`、`scripts/`、`test/`）：AGPL-3.0，同 repo 根 `LICENSE`。

各來源與修改說明見 repo 根 `NOTICE`「content/（題庫與課程）」一節。

## 出處標示

轉用或改作題庫時，請依 CC BY-SA 4.0 標示：

> LinguaApp 題庫，CC BY-SA 4.0（https://creativecommons.org/licenses/by-sa/4.0/）。單字級距與清單出處見 LinguaApp `NOTICE` 與 `data/LICENSES.md`。

並以相同授權釋出改作內容；原單字表的引用格式（CEFR-J、Octanove、TSL、NGSL、ECDICT）照 `data/LICENSES.md` 保留。

## 檢查

```bash
cd content
npm ci
node scripts/check-items.mjs --require-judge   # 檢查全部題庫
npm test
```
