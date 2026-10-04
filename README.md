# LinguaApp

給母語是繁體中文的學習者的英文學習手機版 Web App：聽、說、讀、寫四種練習，加上間隔重複複習。開源、免費，不登入也能完整使用。

> 開發中，尚未正式上線。產品規格見 [`docs/spec/requirements.md`](docs/spec/requirements.md)。

| 今天 | 課程 | 小課 | 設定 |
|---|---|---|---|
| ![首頁「今天」：第一次開啟時的分級測驗入口](docs/images/home.png) | ![課程地圖：A1–C1 五個級距、主題單元與小課](docs/images/course.png) | ![小課：看字選意思](docs/images/lesson.png) | ![設定：學習、AI 批改、外觀與字級](docs/images/settings.png) |

## 功能

- **新手分級測驗**：勾選認識的單字（混入假字防亂勾），推薦起始級距；之後可在設定頁自己調整。
- **課程**：A1–C1 五個級距，依主題分成單元與小課；每課 6–10 個新字，有多益常考字標記。
- **四種練習**
  - 讀：看字選意思、選擇題、閱讀理解。
  - 聽：聽音打字、聽音選答。預設用手機內建聲音；支援 WebGPU 的手機可另外下載高音質發音（Kokoro）。
  - 說：跟讀，錄音在手機上用 Moonshine 模型轉成文字、逐字比對，錄音不上傳。
  - 寫：中翻英。使用者自帶 OpenRouter 帳號（一鍵授權或貼金鑰）可得到 AI 批改；沒有金鑰時對照參考答案自己判斷。預設模型是 Qwen3.8（免費；提供者不保留、不拿你的句子訓練），可在設定頁更換。
- **間隔重複**：以 FSRS 排程複習；「今天」先複習到期的字、再接下一課，每日新字數可調。
- **點字查義**：英文字都可以點，離線字典（ECDICT，繁體中文釋義）顯示音標與意思，可收藏。
- **離線可用**：PWA，可加到主畫面；課程、字典與已下載的模型不用網路也能用。
- **資料在你手上**：不登入時學習紀錄只存在手機；登入（Email 驗證碼，Google 選配）後跨裝置同步。可匯出學習紀錄、清除手機上的資料。詳見 [隱私說明](docs/privacy.md)。
- 深色模式、三段字級。

## 快速開始（本機開發）

需要 Node.js 22（見 `.nvmrc`）。

```bash
cd app
npm ci
npm run dev   # http://localhost:5287，用瀏覽器的手機模擬開啟
```

自己架一個站（只有靜態站，或加上 Supabase 登入同步）請見 [自架指南](docs/self-hosting.md)。

## 專案結構

| 目錄 | 內容 |
|---|---|
| `app/` | React＋Vite＋TailwindCSS 手機版 PWA；語音合成、語音辨識、字典、FSRS 都在瀏覽器執行 |
| `content/` | 課綱、題庫 JSON、分級測驗題本，以及產生與檢查它們的程式 |
| `data/` | 單字資料（CEFR-J、Octanove、TSL／NGSL、ECDICT 衍生），依各來源授權分檔 |
| `supabase/` | 資料表、Row Level Security、migrations（登入與同步用） |
| `docs/` | 規格、調查、自架指南、隱私說明 |

## 授權

本專案依內容分成不同的授權範圍，互不混用：

| 範圍 | 授權 |
|---|---|
| 程式碼（`app/`、`supabase/`、`scripts/`，以及 `content/`、`data/` 裡的程式與測試） | [GNU AGPL-3.0](LICENSE) |
| 題庫的題目文字（`content/items/`：例句、選項、短文、翻譯、評分要點） | [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/)；選字與分級依據的來源不在此範圍，各依原授權 |
| 課綱與分級測驗題本（`content/curriculum/`、`content/placement/`） | 依 [`data/LICENSES.md`](data/LICENSES.md) 各來源條款 |
| 單字資料（`data/`） | 依各來源原授權分檔標示：預設 CC BY-SA 4.0（Octanove、TSL、NGSL）；CEFR-J 衍生級距適用 CEFR-J 條款（不是 CC BY-SA）；ECDICT 衍生字典為 MIT。逐檔見 [`data/LICENSES.md`](data/LICENSES.md) |

- 第三方資料、模型與元件的出處與授權見 [`NOTICE`](NOTICE)；App 內「設定 → 隱私說明・授權・原始碼 → 授權與致謝」列出同樣的條目。
- 轉用題目文字時的出處標示方式見 [`content/README.md`](content/README.md)。
- 依 AGPL-3.0，修改本專案的程式並架站給別人使用時，須讓使用者能取得修改後的原始碼。

## 文件索引

| 文件 | 內容 |
|---|---|
| [`docs/spec/requirements.md`](docs/spec/requirements.md) | 產品規格 |
| [`docs/self-hosting.md`](docs/self-hosting.md) | 自架指南：最小部署、Cloudflare Pages＋Supabase、本機模擬 |
| [`docs/privacy.md`](docs/privacy.md) | 隱私說明（與 App 內頁相同） |
| [`CONTRIBUTING.md`](CONTRIBUTING.md) | 開發環境、測試、題庫規則、貢獻的授權 |
| [`NOTICE`](NOTICE)、[`data/LICENSES.md`](data/LICENSES.md) | 第三方出處與逐檔授權 |
| [`content/README.md`](content/README.md) | 課綱與題庫的結構與授權 |
| [`app/CLAUDE.md`](app/CLAUDE.md)、[`supabase/CLAUDE.md`](supabase/CLAUDE.md) | App 指令與測試方式、資料庫規則與欄位對照 |
| [`docs/research/`](docs/research/) | 技術選型與競品調查 |
