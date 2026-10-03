# 參與貢獻

歡迎回報問題、修正錯字、改善題目或送出程式修改。本檔說明開發環境、測試指令、題庫規則在哪裡，以及貢獻內容的授權。

## 開發環境

| 工具 | 版本 | 用在哪裡 |
|---|---|---|
| Node.js＋npm | 22（見 `.nvmrc`） | `app/`、`content/`、`scripts/` |
| Docker | 任一近期版本 | 本機 Supabase（登入與同步、資料庫測試） |
| Python | 3.12 | 只有改 `data/` 的建置程式時需要 |

```bash
cd app && npm ci && npx playwright install webkit chromium   # e2e 用的瀏覽器
cd ../content && npm ci
```

各子專案的 `node_modules` 各自安裝；多個工作目錄（例如 git worktree）並行時也各自 `npm ci`，不要用連結共用。

本機開發：`cd app && npm run dev`，開 `http://localhost:5287`，用瀏覽器的手機模擬（App 只做手機版）。需要登入與同步時，見 [自架指南](docs/self-hosting.md)「本機模擬完整部署」。

## 測試指令

送出修改前，請在相關目錄跑過下列檢查（CI 也會跑 `app/` 與 `data/` 的部分，見 `.github/workflows/ci.yml`）。

| 目錄 | 指令 | 內容 |
|---|---|---|
| `app/` | `npm run lint` | ESLint＋Prettier |
| `app/` | `npm run typecheck` | TypeScript 型別檢查 |
| `app/` | `npm test` | 單元測試（Vitest） |
| `app/` | `npm run e2e` | 手機模擬 e2e（Playwright：iPhone 15／WebKit、Pixel 7／Chromium），會自動建置並預覽 |
| `app/` | `npm run build` | 正式建置 |
| `app/` | `npm run e2e:sync` | 登入與同步 e2e，需本機 Supabase（跑法見 `app/playwright.sync.config.ts`） |
| `content/` | `npm test` | 課綱、題庫、分級題本的程式測試 |
| `content/` | `node scripts/check-items.mjs --require-judge` | 檢查全部題庫 |
| repo 根 | `npx --yes supabase@2.118.0 start`，再 `MSYS_NO_PATHCONV=1 npx --yes supabase@2.118.0 test db` | 資料表與 RLS 的 pgTAP 測試（`MSYS_NO_PATHCONV=1` 只有 Windows Git Bash 需要）；用完 `npx --yes supabase@2.118.0 stop` |
| `data/` | `python -m pytest data/tests -q`（repo 根執行，先 `pip install -r data/requirements.txt`） | 單字資料建置程式 |
| `scripts/` | `npm ci && node check-zh.mjs ../app/src/i18n/zh-TW.json` | 介面文案用語檢查（簡體字、大陸用語） |

各目錄的細節：`app/CLAUDE.md`（指令、資料夾結構、測試慣例）、`supabase/CLAUDE.md`（migration 與 RLS 規則）、`content/CLAUDE.md`、`data/CLAUDE.md`。

## 修改時的規則

- **介面文字**：一律寫在 `app/src/i18n/zh-TW.json`，程式碼裡不得硬寫中文字串（`noHardcoded.test.ts` 會擋）。用語用台灣繁體中文、稱呼使用者用「你」。
- **資料庫**：只新增 migration，不改已套用的檔；新增資料表要同時寫 RLS 規則並更新 `supabase/tests/database/` 的守衛測試。
- **隱私**：伺服器端不收錄音、不碰 OpenRouter 金鑰。改到資料流向時，同步更新 [`docs/privacy.md`](docs/privacy.md) 與 App 內的隱私說明（兩邊有測試比對）。
- **第三方來源**：加入新的資料、模型或隨 App 提供的套件時，在 [`NOTICE`](NOTICE) 加一條，並在 App 的「授權與致謝」頁加上同名條目（`app/src/screens/about/credits.ts` 與 zh-TW.json 的 `credits`；測試會比對兩者）。
- **單字資料**：不得使用 Oxford 3000／5000、English Vocabulary Profile 等有版權的字表。

## 題庫規則

題目的撰寫規則在 [`content/prompts/claude-dev.authoring-guide.md`](content/prompts/claude-dev.authoring-guide.md)（題型與題數、用字限本課可用字表、繁體台灣用語、句長、選項、評分要點的寫法，附審題例子）。題庫格式與檢查器見 `content/CLAUDE.md`。

- 每課用字限該課與先前各課的生字；新增或修改題目後跑 `node scripts/check-items.mjs`，0 錯才算完成。
- `content/curriculum/*.json`、`content/placement/placement.json` 由程式產生，不要手改。

## 貢獻的授權

送出貢獻即表示你同意：你的貢獻依**所在目錄的授權**釋出，且你有權以該授權釋出。

| 修改的位置 | 你的貢獻的授權 |
|---|---|
| 程式碼（`app/`、`supabase/`、`scripts/`，以及 `content/`、`data/` 裡的程式與測試） | AGPL-3.0 |
| 題庫題目文字（`content/items/`） | CC BY-SA 4.0 |
| 單字資料、課綱與分級題本（`data/`、`content/curriculum/`、`content/placement/`） | 依 [`data/LICENSES.md`](data/LICENSES.md) 該檔所列的授權 |

不要把授權不相容的內容（例如不允許改作或商用的字表、來源不明的例句）放進 repo。不確定時，先開 issue 討論。
