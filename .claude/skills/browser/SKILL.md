---
name: browser
description: |
  Headless 瀏覽器操作（包 Microsoft playwright-cli）。凡是要「開網頁看」的事都走這裡：
  網頁瀏覽、爬頁讀文字、headless QA、截圖驗收、手機模擬（webkit＝iOS／chromium＝Android）、
  登入態（storage state）存取與重用、看 console 錯誤與網路請求。
  觸發詞：「開這個網址」「看一下頁面」「截圖」「爬這頁」「手機版長怎樣」「用登入狀態看」。
  qa、design-review、plan-design-review 的瀏覽層也一律走本 skill。
allowed-tools:
  - Bash
  - Read
---

# browser — playwright-cli 操作手冊

本 skill 只是一層「慣例＋速查」。指令本體是 `playwright-cli`（npm 套件 `@playwright/cli`）。
官方另附一份完整 SKILL.md（`playwright-cli install --skills`），需要冷門指令時再查它或 `playwright-cli <cmd> --help`。

## 1. 安裝與首次設定（每台機器一次）

```bash
npm install -g @playwright/cli@latest        # 需 Node 18+
playwright-cli --version
playwright-cli install-browser webkit         # iOS 模擬要用，約 60 MiB
playwright-cli install-browser chromium       # 選用：不想依賴系統 Chrome 時才裝
```

- 預設瀏覽器是系統安裝的 Google Chrome（`--browser=chrome`）。
- 第一次 `--browser=webkit` 若報缺 browser，就是還沒跑 `install-browser webkit`；它與專案內 Playwright 測試裝的 webkit 版本可能不同，各裝各的、互不影響。
- 專案 `.gitignore` 加一行：`.playwright-cli/`（snapshot 檔會堆在 cwd 底下）。
- 升級 CLI 後，若有裝官方 skill，重跑一次 `playwright-cli install --skills` 讓版本對齊。

## 2. 鐵律

1. **一律帶 session 名**：每個指令都寫 `-s=<唯一名>`，或先設環境變數 `PLAYWRIGHT_CLI_SESSION=<唯一名>`。
   同一個 cwd 不帶 `-s` 就會共用預設 session，兩個對話／worker 會互搶同一個瀏覽器。
   命名建議：`<用途>-<短亂數>`，例如 `qa-7k2`、`ios-login`。
2. **用完就 close**：`playwright-cli -s=<名> close`。每個 session 背後有一支 node daemon，閒置 1 小時才自己退。
   卡住或懷疑殘留：`playwright-cli list` 看，`playwright-cli kill-all` 清。
3. **`.playwright-cli/` 必進 .gitignore**；或乾脆在暫存目錄（scratchpad）執行。
4. **網址含 `&`**：Git Bash 用雙引號包住即可；PowerShell 要寫 `playwright-cli --% -s=x goto "https://a.com/?p=1&q=2"`；cmd 用 `^&`。
5. **手機模擬對應**：iOS ＝ `--browser=webkit --device="iPhone 15"`；Android ＝ chromium `--mobile`（Pixel 預設）。
   兩個都要驗才算手機版驗完；用模擬代替真機時，報告要寫明「未在真機驗證」。
6. **判字重只看 chromium**：WebKit 不套可變字體的字重軸，所有 variable font 都會顯示成最細，不能拿來判斷字重對不對。
7. **全頁截圖前先捲一輪**：`--full-page` 不會觸發 IntersectionObserver，捲動才出現的區塊會拍成空白。先跑速查第 10 條的捲動 eval，再截。
8. **截圖拍完自己 Read 檢查**：用 Read 打開 png 實際看過（空白、被遮、還在 loading 都要重拍），沒看過的截圖不能當驗收證據。
9. **不讀整份 snapshot**：指令只回傳 snapshot 檔路徑；先 `find "文字"` 定位拿 ref，必要時才 `snapshot --depth=N` 或 `snapshot <ref>` 局部讀。
10. **Git Bash 路徑**：`--profile=/c/...` 這類 POSIX 路徑可能被 MSYS 改寫，改寫成 `C:/...`，或在指令前加 `MSYS_NO_PATHCONV=1`。

## 3. 指令速查（15 條）

標記：✔＝已在 Windows 11／Git Bash、@playwright/cli 0.1.22 實跑過；△＝只確認過 `--help` 有此參數、未實跑；未標＝來自官方說明，未實測。

```bash
S=qa-7k2   # 以下 $S 換成你的唯一 session 名

# 1  開瀏覽器並前往（headless chrome）                                    ✔
playwright-cli -s=$S open "https://example.com"
# 2  iOS 模擬（webkit＋iPhone）                                            ✔
playwright-cli -s=$S open --browser=webkit --device="iPhone 15" "<url>"
# 3  Android 模擬（chromium --mobile）                                     ✔
playwright-cli -s=$S open --mobile "<url>"
# 4  換頁
playwright-cli -s=$S goto "<url>"
# 5  讀全頁純文字（爬頁用；--raw 只輸出值）                                ✔
playwright-cli -s=$S --raw eval "document.body.innerText"
# 6  在 snapshot 中找文字、取得元素 ref
playwright-cli -s=$S find "登入"
# 7  淺層結構（寫檔，回傳路徑）
playwright-cli -s=$S snapshot --depth=4
# 8  用 ref 操作
playwright-cli -s=$S click e15
playwright-cli -s=$S fill e5 "hello" --submit
# 9  視窗截圖                                                              ✔
playwright-cli -s=$S screenshot --filename=out/home.png
# 10 全頁截圖：先捲一輪觸發 lazy reveal，再截                              ✔
playwright-cli -s=$S --raw eval "async () => { for (let y = 0; y < document.body.scrollHeight; y += 600) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 150)); } window.scrollTo(0, 0); }"
playwright-cli -s=$S screenshot --full-page --filename=out/full.png
# 11 console 訊息與網路請求
playwright-cli -s=$S console warning
playwright-cli -s=$S requests
# 12 存登入態（標準 Playwright storageState JSON）                         ✔
mkdir -p auth && playwright-cli -s=$S state-save auth/state.json   # 實測時存在 cwd；子目錄是否自動建立未測，先 mkdir
# 13 另一個 session 載入登入態（載入後 reload 才生效）                     ✔
playwright-cli -s=$S-2 open "<url>"
playwright-cli -s=$S-2 state-load auth/state.json
playwright-cli -s=$S-2 reload
# 14 深色模式／改視窗大小
playwright-cli -s=$S set-color-scheme dark
playwright-cli -s=$S resize 1440 900
# 15 收尾（必做）；卡住時列出與全清                                         ✔
playwright-cli -s=$S close
playwright-cli list ; playwright-cli kill-all
```

補充：
- 元素截圖：`screenshot <ref> --filename=...`（△）；高解析：`--hires`（△）。
- 截圖、snapshot 的相對路徑以 **cwd** 為準。
- 其他可用指令（未實測）：`go-back`／`reload`／`press`／`hover`／`select`／`upload`、`tab-new`／`tab-list`、`route`（mock 請求）、`set-reduced-motion`、`run-code "<playwright 片段>"`。

## 4. 登入態（storage state）流程

1. **第一次登入**：開 headed 或 headless session，照正常流程登入（帳密／OTP 由使用者提供或使用者自己操作；密碼不寫進任何報告或檔名）。
2. **登入成功後存檔**：`state-save auth/<帳號用途>.json`。
3. **檔案管理**：
   - `auth/` 放 gitignore；state 檔等同登入憑證，不 commit、不貼進對話、不上傳。
   - 檔名寫用途不寫帳號（例：`auth/paid-user.json`、`auth/admin.json`）。
4. **重用**：新 session `open <url>` → `state-load auth/<x>.json` → `reload`，再用 `find` 確認看到登入後才有的元素。
5. **失效判斷**：reload 後被導回登入頁＝state 過期，重做步驟 1–2，不要硬繞。
6. 專案內既有 Playwright 測試的 storageState 檔格式相同，可以直接共用。

## 5. 驗收輸出慣例

- 截圖放 `out/` 或報告目錄，檔名帶頁面與狀態：`login-ios.png`、`checkout-error-android.png`。
- 回報時列出：網址、瀏覽器／裝置、session 名、截圖路徑、看到了什麼（Read 過的描述）。
- 手機驗收若只用模擬，明列未驗項目：真實觸控手感、實機字體渲染、軟鍵盤遮擋、瀏覽器 UI 列高度。

## 6. 派工給 worker／subagent 時

在派工 prompt 加這一行（`<worker名>` 換成該 worker 的唯一名）：

```
瀏覽網頁一律用 browser skill（playwright-cli），所有指令帶 -s=<worker名>（或先 export PLAYWRIGHT_CLI_SESSION=<worker名>），截圖後自己 Read 檢查，結束前必 close。
```

多個 worker 並行時，每個 worker 的 session 名必須不同。
