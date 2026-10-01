---
name: qa
description: |
  網頁應用 QA：像真實使用者一樣點過每個按鈕、填過每張表單、檢查每種狀態，產出健康分數＋附截圖的重現步驟。
  預設模式會修 bug（每個修正一個 commit、修完重測）；加 `--report-only` 只報告不修。
  瀏覽一律走 browser skill（playwright-cli）。
  觸發詞：「QA」「測一下網站」「幫我點點看有沒有壞」「只要報告不要修」「qa report only」。
  其他旗標：`--quick`（冒煙）、`--exhaustive`（連低嚴重度也修）、`--regression <baseline.json>`。
allowed-tools:
  - Bash
  - Read
  - Grep
  - Glob
  - Edit
  - Write
  - AskUserQuestion
---

# qa — 測試 → （修正 → 驗證）

## 參數

| 參數 | 預設 | 範例 |
|---|---|---|
| 目標網址 | 自動偵測或詢問 | `http://localhost:5173`、預覽站網址 |
| 修不修 | 修 | `--report-only`：只報告 |
| 層級 | standard | `--quick`、`--exhaustive` |
| 模式 | full | `--regression qa-reports/baseline.json` |
| 範圍 | 全站（或依 diff） | 「只看練習頁」 |
| 登入 | 無 | 指定 storage state 檔、或由使用者登入 |
| 輸出 | `qa-reports/<YYYY-MM-DD>/` | 使用者指定目錄 |

層級決定修哪些：quick＝critical＋high；standard＝再加 medium；exhaustive＝全部含 low。

## 模式

- **diff 模式**（在 feature 分支、沒給網址時自動進入，最常用）：
  1. `git diff <base>...HEAD --name-only`、`git log <base>..HEAD --oneline` 看改了什麼。
  2. 由檔案推出受影響頁面（路由、元件、樣式、API）。推不出來也**不能跳過瀏覽器測試**，退回 quick 模式。
  3. 偵測本機服務（依專案 dev server 埠號；找不到就問使用者網址）。
  4. 對照 commit 訊息與 PR 描述理解「這次改動應該做到什麼」，驗證它真的做到。
- **full**（給了網址）：系統性走過所有可達頁面，記錄 5–10 個證據充分的問題。
- **quick**：首頁＋前 5 個導覽目標；只看能否載入、console 錯誤、壞連結。
- **regression**：跑 full，再與 baseline 比對：哪些修好了、哪些是新的、分數變化。

## 前置

1. **（修正模式）工作樹必須乾淨**：`git status --porcelain` 有輸出就停下問：A) 先 commit B) stash，QA 後 pop C) 中止。
2. **瀏覽器**：照 `browser` skill。開一個唯一 session（例：`qa-<短亂數>`），全程帶 `-s=`，結束必 close。
3. **登入**：
   - 有 storage state 檔 → `open` → `state-load` → `reload`，確認已登入。
   - 需要帳密 → 使用者提供或使用者自行登入；報告中密碼一律寫 `[REDACTED]`。
   - 遇到 OTP／CAPTCHA → 請使用者處理，等他說繼續。
4. 建輸出目錄 `qa-reports/<日期>/screenshots/`。

## Phase 1：定位

- 開目標網址，截圖（Read 檢查），看 `console warning`。
- 找出導覽結構（`find` 導覽元素、或 `eval` 收集 `a[href]`）。SPA 的路由常不在 `<a>` 裡，要從按鈕與選單找。

## Phase 2：探索（每頁）

1. 截圖 → Read 看版面是否異常。
2. 互動元素：按鈕、連結、控制項——點了有沒有反應？
3. 表單：正常值、空值、非法值、超長值。
4. 導覽：進得來、出得去、上一頁／重新整理後狀態是否正確。
5. 狀態：空、loading、錯誤、內容溢出。
6. 每次互動後看 console。
7. 手機版：iOS（webkit＋iPhone）與 Android（chromium `--mobile`）各一輪；判字重只看 chromium。

重點頁面（核心學習流程、付費、登入）花多時間；條款、關於頁少花時間。

## Phase 3：記錄（發現就寫，不要累積）

- **互動型 bug**：操作前截圖 → 操作 → 結果截圖 → 寫重現步驟。
- **靜態型 bug**（錯字、版面、缺圖）：一張截圖＋描述。
- 寫進報告前**重試一次**確認可重現，不是偶發。
- 每張截圖都要 Read 過。

嚴重度：

| 等級 | 定義 | 例 |
|---|---|---|
| critical | 卡住核心流程、資料遺失、整頁掛掉 | 送出答案跳錯誤頁、進度被清空 |
| high | 主要功能壞且無替代路徑 | 音檔不播、登入重導迴圈 |
| medium | 功能可用但問題明顯、有替代路徑 | 載入 > 5 秒、只有手機版跑版 |
| low | 外觀或打磨問題 | 錯字、1px 對齊、hover 不一致 |

類別：visual／functional／ux／content／performance／console／accessibility。

## Phase 4：健康分數

各類別 0–100，再加權平均：

- **Console（15%）**：0 錯＝100；1–3＝70；4–10＝40；> 10＝10
- **Links（10%）**：每個壞連結 −15（最低 0）
- **其他類別**：從 100 起扣，critical −25、high −15、medium −8、low −3（最低 0）

| 類別 | 權重 |
|---|---|
| Console | 15% |
| Links | 10% |
| Visual | 10% |
| Functional | 20% |
| UX | 15% |
| Performance | 10% |
| Content | 5% |
| Accessibility | 15% |

寫出「最該修的 3 件事」、console 錯誤彙整，並存 `baseline.json`（日期、網址、分數、問題清單、各類別分數）。

**`--report-only` 到此結束**，直接跳到「報告」。不讀原始碼、不改檔、報告裡不寫修法建議。

## Phase 5：修正迴圈（預設模式）

依嚴重度排序，照層級決定要修的；無法從原始碼修的（第三方元件、基礎設施）標「延後」。

每一個問題：
1. **找原始碼**：Grep 錯誤訊息、元件名、路由。只動與此問題直接相關的檔案。
2. **先寫重現測試**（有 JS 行為的 bug）：照專案既有測試風格；斷言正確行為；先跑確認是紅的。純 CSS 問題可略，靠重測截圖驗證。
3. **最小修正**：不重構、不順手改善。
4. **commit**：一個問題一個 commit，`git add <只加改到的檔案>`，訊息 `fix(qa): ISSUE-NNN — 簡述`。
5. **重測**：回到該頁，拍修正後截圖（與修正前成對），看 console，測試轉綠。
6. **分類**：verified（確認修好）／best-effort（修了但無法完整驗證）／reverted（造成回歸 → `git revert HEAD`，標延後）。

**自我節制**：每修 5 個（或任何一次 revert 後）算風險：
```
起始 0%；每次 revert +15%；每個改動 > 3 檔的修正 +5%；
第 15 個之後每個 +1%；剩下全是 low +10%；碰到無關檔案 +20%
```
> 20% 立刻停，向使用者報告目前進度並詢問是否繼續。硬上限 50 個修正。

不改 CI 設定；不改既有測試，只新增測試檔。

## Phase 6：最終 QA

修完後重跑受影響頁面、重算分數。**最終分數比 baseline 低 → 顯著警告**。

## 報告

`qa-reports/<日期>/qa-report-<網域>.md`，結構：

```
# QA 報告：<App 名>
日期｜網址｜分支｜commit｜層級｜範圍｜耗時｜瀏覽頁數｜截圖數｜瀏覽器/裝置
## 健康分數：NN/100（各類別分數表）
## 最該修的 3 件事
## Console 健康（錯誤｜次數｜首次出現頁）
## 嚴重度統計（critical/high/medium/low/總計）
## 問題
### ISSUE-001：標題
嚴重度｜類別｜網址
描述：預期 vs 實際
重現步驟：
1. 前往 <網址>  ![](screenshots/issue-001-step-1.png)
2. <操作>        ![](screenshots/issue-001-step-2.png)
3. 觀察：<哪裡錯>
（修正模式另加）修正狀態｜commit SHA｜改動檔案｜修正前/後截圖｜回歸測試位置
```

修正模式摘要另寫：總問題數、修正數（verified／best-effort／reverted）、延後項、分數 baseline → final，以及一行 PR 用摘要：「QA 發現 N 個問題，修了 M 個，健康分數 X → Y。」

手機驗收僅靠模擬時，明列未驗：真實觸控、實機字體渲染、軟鍵盤遮擋、瀏覽器 UI 列高度。

## 規則

1. 重現就是一切：每個問題至少一張截圖。
2. 不放任何帳密與 token 到報告。
3. 邊發現邊寫報告，不累積。
4. 每次互動後看 console：沒有視覺症狀的 JS 錯誤仍是 bug。
5. 用真實資料、走完整流程。
6. 深度勝過廣度：5–10 個證據充分的問題 > 20 個模糊描述。
7. 使用者叫了 qa 就一定要開瀏覽器測，不以單元測試代替。
8. 收尾必 `close` 瀏覽器 session。
