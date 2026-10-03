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

- 題庫 JSON（`items/`）的題目文字（例句、選項、短文、翻譯、評分要點）：由開發端撰寫，採 **CC BY-SA 4.0**。
- 選字與分級依據的來源不在上述 CC BY-SA 4.0 範圍內，各依原授權：CEFR-J（CEFR-J 條款，不是 CC BY-SA）；Octanove、TSL、NGSL（CC BY-SA 4.0）；ECDICT（MIT）。條款與引用格式見 `data/LICENSES.md`。
- 課綱與分級測驗題本（`curriculum/`、`placement/`）：依 `data/LICENSES.md` 各來源條款（CEFR-J 衍生級距適用 CEFR-J 條款，不是 CC BY-SA）。
- 程式碼（`schema/`、`scripts/`、`test/`）：AGPL-3.0，同 repo 根 `LICENSE`。

各來源與修改說明見 repo 根 `NOTICE`「content/（題庫與課程）」一節。

## 出處標示

轉用或改作題庫的題目文字時，請依 CC BY-SA 4.0 標示：

> LinguaApp 題庫題目文字，CC BY-SA 4.0（https://creativecommons.org/licenses/by-sa/4.0/）。選字與分級依據的來源各依原授權，見 LinguaApp `NOTICE` 與 `data/LICENSES.md`。

並以相同授權釋出改作的題目文字。選字與分級依據的來源（CEFR-J、Octanove、TSL、NGSL、ECDICT）依各自的原授權處理，引用格式照 `data/LICENSES.md` 保留。

## 檢查

```bash
cd content
npm ci
node scripts/check-items.mjs --require-judge   # 檢查全部題庫
npm test
```
