# 自架指南

拾字（Wordglean）是純前端的 PWA：沒有自己的後端程式，登入與同步交給 Supabase。你可以選兩種部署：

| | (a) 最小部署 | (b) 完整部署 |
|---|---|---|
| 需要什麼 | 任何靜態網站主機（本文以 Cloudflare Pages 為例） | Cloudflare Pages＋Supabase |
| 登入與同步 | 沒有（設定頁不顯示登入） | Email 驗證碼登入（Google 登入選配），跨裝置同步 |
| 學習進度存哪裡 | 只在使用者的瀏覽器（IndexedDB） | 瀏覽器＋你的 Supabase 資料庫 |
| AI 批改 | 使用者自帶 OpenRouter 金鑰，兩種部署都一樣（伺服器不經手） | 同左 |

兩種部署用的是同一份程式；差別只在建置時有沒有給 Supabase 的環境變數。

指令以 bash 撰寫（macOS、Linux、Windows 的 Git Bash 皆可），除非另外註明，都在 repo 根目錄執行。

## 事前準備

- Node.js 22（版本寫在 repo 根的 `.nvmrc`）與 npm
- Git
- 只有 (b) 的本機模擬需要：Docker（Docker Desktop 或相容的 Docker 引擎）

```bash
git clone <你的 LinguaApp repo 網址> linguaapp
cd linguaapp
node --version   # v22.x
```

## 建置時讀取的環境變數

App 只在**建置時**讀這四個變數（範例檔 `app/.env.example`；登入相關見 `app/src/auth/config.ts`），會被寫進前端程式、任何人都看得到，所以只能放公開值：

| 變數 | 用途 | 沒設定時 |
|---|---|---|
| `VITE_SUPABASE_URL` | Supabase 專案網址 | 不顯示登入，App 照常可用 |
| `VITE_SUPABASE_ANON_KEY` | Supabase 的 anon（公開）金鑰；資料由 RLS 保護 | 同上（兩個都要有才會啟用登入） |
| `VITE_AUTH_GOOGLE` | 設成 `true` 才顯示「使用 Google 登入」 | 只有 Email 驗證碼登入 |
| `VITE_SOURCE_URL` | 你的原始碼網址；設定 →「隱私說明・授權・原始碼」顯示「查看原始碼」連結 | 只顯示授權說明、沒有連結 |

**關於 `VITE_SOURCE_URL`**：AGPL-3.0 第 13 條要求，透過網路提供修改版給別人使用時，要讓使用者能取得對應的原始碼。請填**你自己的** repo 網址（含你的修改），不要填上游 LinguaApp 的網址。兩種部署都建議設定。

**絕對不要**把 Supabase 的 `service_role` 金鑰或資料庫密碼放進任何 `VITE_` 變數。OpenRouter 金鑰也不需要設定：每位使用者在 App 的設定頁自己連結，金鑰只存在使用者的瀏覽器。

## (a) 最小部署：只有靜態站

### 1. 本機建置與預覽

```bash
cd app
npm ci
npm run build      # 型別檢查＋產出 app/dist/
npm run preview    # http://localhost:5288
```

用手機尺寸的瀏覽器開啟 `http://localhost:5288`，應該看到首次開啟的分級測驗入口；到「設定」頁時，「帳號與同步」區只寫「未登入：進度只存在這支手機」，沒有登入按鈕。按 Ctrl+C 停止預覽。

建置會讀 repo 裡的 `content/`（課綱、題庫、分級題本）與 `data/`（字典、單字總表），所以一定要在完整的 clone 裡建置，不能只複製 `app/`。

### 2. 部署到 Cloudflare Pages

在 Cloudflare 後台（Workers & Pages → Create → Pages → Connect to Git）連結你的 repo，建置設定如下：

| 欄位 | 值 |
|---|---|
| Framework preset | None |
| Root directory | `app` |
| Build command | `npm ci && npm run build` |
| Build output directory | `dist` |
| 環境變數 | `NODE_VERSION` = `22`、`VITE_SOURCE_URL` = 你的 repo 網址（不要設任何 `VITE_SUPABASE_*`） |

不想連 Git 時，也可以在本機建置後用 Wrangler 直接上傳（第一次會開瀏覽器登入 Cloudflare）：

```bash
cd app
npm run build
npx wrangler pages deploy dist --project-name <你的專案名>
```

說明：

- `dist/` 裡沒有 `404.html`，Cloudflare Pages 會把它當單頁應用，`/settings`、`/words` 這類網址都回 `index.html`，不需要額外設定轉址。
- PWA 需要 HTTPS；Cloudflare Pages 的網址預設就是 HTTPS。
- 高音質發音與語音辨識的模型由使用者的瀏覽器直接從 Hugging Face 下載，你的站不需要存放模型檔。

## (b) 完整部署：Cloudflare Pages＋Supabase

### 1. 建立 Supabase 專案並套用資料表

1. 在 Supabase 後台建立新專案，記下 **Project ref**（專案網址 `https://<ref>.supabase.co` 中間那段）與資料庫密碼。
2. 在 repo 根目錄用 Supabase CLI 連結專案並套用 migration（`supabase/migrations/`，含全部資料表與 RLS 規則）：

```bash
npx --yes supabase@2.118.0 login
npx --yes supabase@2.118.0 link --project-ref <你的 Project ref>
npx --yes supabase@2.118.0 db push
```

`db push` 會列出要套用的 migration 並要求確認。套用後，每張表都只允許登入者讀寫自己的資料，`anon`（未登入）沒有任何權限；規則說明見 `supabase/CLAUDE.md`。

### 2. 設定 Auth

在 Supabase 後台 Authentication 設定：

| 項目 | 設定 |
|---|---|
| URL Configuration → Site URL | 你的站台網址，例如 `https://<你的專案>.pages.dev` |
| URL Configuration → Redirect URLs | 同上（Google 登入完成後回到這裡） |
| Sign In / Providers → Email | 開啟；App 用 6 位數驗證碼登入，不用密碼 |
| Email Templates → Magic Link 與 Confirm signup | 信件內容要包含 `{{ .Token }}`（驗證碼），可直接貼 `supabase/templates/otp.html` 的內容 |
| SMTP Settings | 建議設定自己的寄信服務：Supabase 內建寄信每小時只能寄很少封，只適合測試 |
| Sign In / Providers → Google（選配） | 填入你在 Google Cloud 申請的 OAuth client ID 與 secret，並把 Supabase 顯示的 callback URL 加到 Google 的授權重新導向 URI；建置時再設 `VITE_AUTH_GOOGLE=true` |

### 3. 建置與部署前端

在 Supabase 後台 Project Settings → API 取得 Project URL 與 anon public key，設成 Cloudflare Pages 的環境變數（Settings → Variables and Secrets，Production 與 Preview 都要設）：

| 變數 | 值 |
|---|---|
| `NODE_VERSION` | `22` |
| `VITE_SUPABASE_URL` | `https://<你的 Project ref>.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | anon public key |
| `VITE_AUTH_GOOGLE` | `true`（有設定 Google 登入時才加） |
| `VITE_SOURCE_URL` | 你的 repo 網址 |

其餘建置設定同 (a)。改了環境變數之後要重新部署一次（變數是在建置時寫進程式的）。

本機建置的寫法：

```bash
cd app
VITE_SUPABASE_URL=https://<你的 Project ref>.supabase.co \
VITE_SUPABASE_ANON_KEY=<anon public key> \
npm run build
npx wrangler pages deploy dist --project-name <你的專案名>
```

### 4. 免費方案的暫停

Supabase 免費方案的專案閒置 7 天會自動暫停。正式營運的站需要定期有請求（例如每日排程呼叫一次 API）或改用付費方案。

## 本機模擬完整部署

不建任何雲端帳號，就能在本機把 (b) 跑一遍：Supabase 用 Docker 跑在本機，前端用建置產物預覽。

### 1. 啟動本機 Supabase

```bash
npx --yes supabase@2.118.0 start
```

第一次會下載 Docker 映像檔，需要幾分鐘。啟動時會自動套用 `supabase/migrations/` 的全部 migration。本機用的埠：API `55421`、資料庫 `55422`、收信模擬器（Mailpit）`55424`。

取得本機的 API 網址與 anon 金鑰（本機示範值，不是機密）：

```bash
npx --yes supabase@2.118.0 status -o env | grep -E '^(API_URL|ANON_KEY)='
```

### 2. 以本機 Supabase 建置並預覽

```bash
cd app
npm ci
VITE_SUPABASE_URL=http://127.0.0.1:55421 \
VITE_SUPABASE_ANON_KEY=<上一步 ANON_KEY 引號內的值> \
npm run build
npm run preview    # http://localhost:5288
```

### 3. 試登入

1. 用手機尺寸的瀏覽器開啟 `http://localhost:5288/settings`，「帳號與同步」區出現「登入以同步進度」。
2. 點它，輸入任一 Email（例如 `test@example.com`），按「寄驗證碼」。
3. 本機不會真的寄信：開啟 `http://127.0.0.1:55424`（Mailpit），在「拾字 登入驗證碼」信中找到 6 位數驗證碼。
4. 回到 App 輸入驗證碼並登入，帳號區顯示「已登入：test@example.com」。

### 4. 收尾

```bash
# 在 app/ 按 Ctrl+C 停止預覽，再回到 repo 根目錄
cd ..
npx --yes supabase@2.118.0 stop
```

`stop` 會停止並移除本專案的容器，資料保留在 Docker volume，下次 `start` 還在；要連資料一起清掉，改用 `npx --yes supabase@2.118.0 stop --no-backup`。

## 更新版本

```bash
git pull
npx --yes supabase@2.118.0 db push   # 有新的 migration 時（完整部署）
```

前端在 Cloudflare Pages 連 Git 時，push 後會自動重新建置；用 Wrangler 上傳的，重跑 (a) 第 2 步。

## 授權義務

拾字的程式碼以 AGPL-3.0 授權。你修改程式後架站給別人使用時，必須讓使用者能取得你修改後的原始碼——建置時設定 `VITE_SOURCE_URL`，App 內就會顯示連結。題庫題目文字採 CC BY-SA 4.0，單字資料依各來源原授權（見 `NOTICE` 與 `data/LICENSES.md`）。自架站的隱私說明請依你實際的設定調整（見 `docs/privacy.md` 最後一節）。
