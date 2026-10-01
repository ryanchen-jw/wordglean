# LinguaApp

英文學習手機版 Web App（聽、說、讀、寫＋間隔重複），開源免費。

> 開發中。產品規格見 `docs/spec/requirements.md`。

## 專案結構

| 目錄 | 內容 |
|---|---|
| `app/` | React＋Vite＋TailwindCSS 手機版 PWA（開發說明見 `app/CLAUDE.md`） |
| `data/` | 單字資料（獨立授權，見下方） |
| `docs/` | 規格與調查文件 |

## 快速開始

```bash
cd app
npm ci
npm run dev   # http://localhost:5287
```

## 授權

本專案分兩個授權範圍，**互不混用**：

| 範圍 | 授權 | 授權全文 |
|---|---|---|
| 程式碼（`data/` 以外的全部內容） | GNU Affero General Public License v3.0（AGPL-3.0） | [`LICENSE`](LICENSE) |
| 單字資料（`data/` 目錄） | Creative Commons Attribution-ShareAlike 4.0 International（CC BY-SA 4.0） | [`data/LICENSE`](data/LICENSE) |

- 單字資料來自 CC BY-SA 等來源，依「相同方式分享」條款，`data/` 以 CC BY-SA 4.0 獨立發布，不併入 AGPL 程式碼。
- 第三方資料與元件的出處與歸屬見 [`NOTICE`](NOTICE)。
