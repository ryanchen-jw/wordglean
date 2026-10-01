# LinguaApp 工作區

LinguaApp——英文學習手機版 Web App（聽說讀寫＋間隔重複），開源免費（AGPL-3.0）。本檔是**路由中心**:只放架構事實與檔案指標,規則細節一律在被指向的檔案裡,不在此重複。

**產品規格以 `docs/spec/requirements.md` 為準**；調查依據在 `docs/research/`。

## 結構（單一 git repo）

| 資料夾 | 一句話定位 | 詳細文件 |
|---|---|---|
| `app/` | React＋Vite＋TailwindCSS 手機版 PWA；TTS／STT／字典／FSRS 皆在瀏覽器執行 | `app/CLAUDE.md` |
| `supabase/` | schema、RLS、migrations；Auth（Google、Email 驗證碼） | `supabase/CLAUDE.md` |
| `content/` | 題庫與課程 JSON（LLM 批次產生＋抽審）、產題與校驗腳本 | `content/CLAUDE.md` |
| `data/` | 單字資料（CEFR-J、Octanove、TSL/NGSL、ECDICT 衍生），**獨立授權 CC BY-SA**，不得混入 AGPL 程式碼 | `data/CLAUDE.md`（授權索引 `data/LICENSES.md`） |

## 依賴圖

```
data（單字表）──> content（題庫 JSON）──build──> app（React PWA）<──supabase-js──> supabase
app ──（使用者自帶金鑰，瀏覽器直呼）──> OpenRouter
```

## 共用基礎設施

- Supabase：PostgreSQL＋Auth＋Row Level Security；免費方案閒置 7 天會暫停，官方站需每日喚醒排程
- Cloudflare Pages：前端靜態部署
- 伺服器端**不碰** OpenRouter 金鑰、**不收**錄音

## Harness(工作流制度層)—— 先讀這裡

| 情境 | 讀哪份 |
|---|---|
| 新 session 接手執行長 | `.claude/harness/INDEX.md`(退化症狀警覺見 `04-knowledge-protocol.md` §5) |
| 每日派工 | `/daily-brain`(`.claude/commands/daily-brain.md`) |
| 派工前:怎麼派、派給誰、驗收 | `.claude/harness/01-model-dispatch.md` |
| 寫派工 prompt | `.claude/harness/03-delegation-templates.md`(直接填空) |
| 卡住 / 判斷是否完成 / 是否該問 user | `.claude/harness/02-judgment-matrix.md` |
| 想更新任何規則檔或 memory | `.claude/harness/04-knowledge-protocol.md` |
| 回報格式(實作端 ↔ 執行長) | `.claude/session-report-spec.md` |
| 日結＋存記憶＋壓縮前收尾 | `/day-close` |
| 授權執行長獨自跑完手頭任務 | `/goal-draft` |
| 建任務卡 | `/new-task` |

**角色分工**:使用者維護 backlog 任務、做大方向決策;執行長(主對話)派工、審核、commit;push 的預設(不做)與例外授權**只以 `daily-brain.md` 鐵律 5 為準**。實作在 sub-session 或 subagent 進行。

## 工具路由

| 需求 | 用這個 | 禁用 |
|---|---|---|
| 網頁瀏覽、爬頁、headless QA、截圖、手機模擬 | `browser` skill（`.claude/skills/browser`，Playwright CLI，一律 `-s=<唯一名>`） | gstack `/browse` |
| E2E 測試 | 專案內 Playwright（`npx playwright test`） | playwright plugin 的 browser_* tools |
| 函式庫文件 | context7 MCP | 憑記憶回答版本問題 |

## 工作規則

- 待辦:repo 根 `backlog/`(Backlog.md;`backlog board` / `backlog browser`)。一任務一檔,細節寫任務檔 Description
- `docs/pending/` = 進行中工作;結案後關鍵證據搬 `docs/verification/<日期>-<feature>-evidence/`、其餘刪除
- `.gitignore` 須含:`.claude/daily-plan/`、`.claude/mailbox/`、`.claude/settings.local.json`、`.playwright-cli/`

## 部署規則

尚無自動部署（開發中）。上線前補：Cloudflare Pages 的部署方式、Supabase migration 流程、部署後唯讀走查(`.claude/harness/07-verification-report.md` §7)。
