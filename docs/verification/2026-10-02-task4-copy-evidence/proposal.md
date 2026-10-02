# TASK-4 介面文案定稿——proposal

> 2026-10-02。Round 1 計畫經執行長核准（A：檢查腳本放 repo 根 `scripts/`；B：登入流程字串一起收；C：PWA 加入主畫面提示、模型下載前告知一起收）。

## 產出

| 檔案 | 用途 |
|---|---|
| `copy-table.json`（本資料夾） | 文案總表：推薦文案＋位置白話描述＋類型＋設計稿原字；另列「刻意不收」的設計稿文字與理由 |
| `extract-check.mjs`（本資料夾） | 覆蓋檢查：設計稿 `review.src.html` 41 狀態裡每一段中文（含 `aria-label`）都必須出現在總表某列的 `design`，或列在 `excluded`；否則列出來、exit 1 |
| `scripts/check-zh.mjs`（repo 根） | 用語檢查（AC#2）：簡體字、大陸用語、OpenCC cn→twp 反查；對總表（或日後的 zh-TW.json）全量跑，可重跑 |
| `review.html`（本資料夾） | 圈選頁骨架：`window.__COPY_ROWS__` 帶資料，保存走 `onSave(rows)` 鉤子（db 寫入由執行長補） |
| `build-review.mjs`（本資料夾） | 把 copy-table.json 注入 review.html（總表改了就重跑；可重跑、結果相同） |

G3 審定後的後續 stage（不在本輪）：定稿寫進 `app/src/i18n/zh-TW.json`、AC#4 硬編碼守衛。

## key 命名規則（TASK-11、TASK-20 沿用）

- 形式：`<區域>.<區塊>.<用途>`，全小寫駝峰、以 `.` 分層，最多 4 層。例：`home.today.start`、`speak.confirm.submit`。
- **區域**（第一層）固定清單：

| 區域 | 範圍 |
|---|---|
| `common` | 跨畫面共用（繼續、取消、處理中…、級距顯示、進度題數、相對日期） |
| `nav` | 底部導覽 |
| `home` | 畫面 1 首頁「今天」 |
| `course` | 畫面 2 課程地圖 |
| `lesson` | 小課共用外框（離開、題型名稱、回饋條）、畫面 12 離開確認、畫面 14 完成頁 |
| `listen`／`speak`／`read`／`write` | 畫面 3／4／5／6 四種題型 |
| `card` | 畫面 7 單字卡複習 |
| `dict` | 畫面 8 單字查義彈層 |
| `words` | 畫面 9 單字庫 |
| `placement` | 畫面 10 新手分級測驗 |
| `settings` | 畫面 11 設定 |
| `clearData` | 畫面 13 清除資料二次確認 |
| `account` | 登入／帳號（設計未畫，TASK-20） |
| `download` | 模型下載（語音辨識、高音質發音）的進度、告知、失敗、刪除 |
| `install` | PWA 加入主畫面提示、新版本提示 |
| `system` | 其餘系統字串：權限說明、離線、錯誤、Toast、找不到頁面 |

> 頂層名與 TASK-11 的 zh-TW.json 一致（2026-10-02 執行長補充：home／course／words／settings／clearData，加 common、nav、system、download、install；TASK-11 另有 `stub` 給佔位頁用，本表不收）。

- **用途**（最後一層）慣用字：`title` 標題、`body` 說明、`hint` 小字提示、`label` 欄位／列名、`aria` 只給讀螢幕軟體、`error` 錯誤訊息、`toast` 提示；按鈕直接用動詞（`start`、`submit`、`skip`、`retry`、`cancel`）。
- 同一句話出現在多個畫面時只建一個 key（放 `common` 或首次出現的區域），位置描述列出所有出現處。
- **變數**：`{name}` 單大括號，名稱用英文小駝峰（`{count}`、`{current}`、`{total}`、`{level}`、`{score}`）。數字一律由程式帶入，文案不寫死數字（「約 5 分鐘」寫成 `約 {minutes} 分鐘`）。不做複數變化（中文不需要）。
- 不用 ICU MessageFormat。若日後需要再議，key 不變。

## copy-table.json 欄位

```jsonc
{
  "meta": { "version": "...", "designSource": "docs/design/v1.0/review.src.html", ... },
  "rows": [{
    "key": "home.today.start",
    "text": "開始今天的學習",            // 推薦文案（G3 前即 TASK-11 可先用的版本）
    "where": "畫面 1 首頁・平常與離線時・最上面大卡的主要按鈕",  // 白話位置：第幾個畫面的哪裡、什麼時候出現
    "type": "按鈕",                      // 見下方類型清單
    "screen": "s01",                     // 分組用：s01–s14，設計未畫的用 sys
    "design": ["開始今天的學習"],         // 設計稿原字（可多個：同一 key 在不同狀態的範例）；設計未畫＝[]
    "states": ["s01/default", "s01/offline"],  // 出現在設計稿哪些狀態（設計未畫＝[]）；覆蓋檢查用
    "undrawn": false,                    // true＝設計未畫
    "note": ""                           // 給創辦人的備註（改了什麼、為什麼、待確認）
  }],
  "excluded": [{ "text": "會議改期", "reason": "學習內容（課名來自題庫）" }]
}
```

**類型**（封閉清單）：按鈕、標題、標籤、說明、錯誤、空狀態、Toast、權限說明、無金鑰、隱私、無障礙（只給讀螢幕軟體念、畫面上看不到）。

## 收錄邊界

- **收**：14 畫面 41 狀態中所有介面文字（含 `aria-label`）；`components.md` 規格寫明但示意畫面沒畫到的狀態字（處理中…、批改中…、清除中…、這題載入失敗、下載中斷、已取消收藏…）；設計未畫的系統字串（麥克風／儲存空間權限說明、離線、錯誤、Toast、PWA 加入主畫面與更新、模型下載前告知、登入流程、找不到頁面）。
- **不收**（列在 `excluded`）：英文學習內容；題目的中文題幹、選項、翻譯、解釋（題庫或 LLM 產出）；課名與主題名（content）；字典釋義（ECDICT）；示意用的數字與 email。
- **組合格式**算介面字：例如課名的排列格式 `{topic} {number}｜{title}` 收成一個 key，內容由程式帶入。

## 用語檢查（scripts/check-zh.mjs）

- 三層，邏輯改寫自 TASK-8 分支的 `content/scripts/lib/zh-guard.mjs`（尚未進 main，兩份獨立維護、檔頭註明出處）：
  1. 簡體字：手選清單（抄自 zh-guard `SIMPLIFIED_ONLY`）。
  2. 大陸用語：zh-guard 清單＋介面常見詞（設置、保存、加載、刷新、用戶、登錄、賬號、帳戶名、鏈接、默認、緩存、彈窗、激活、卸載、音頻、屏幕、點擊、支持、文件夾、運營、反饋、質量、優化、搜索、在線、離線包、二維碼、視頻、信息、網絡⋯）。
  3. OpenCC cn→twp 反查：轉換後與原文不同就報。豁免清單用介面專用的（**不**沿用 zh-guard 的「點擊、支持、文件」——介面上這三個偏大陸用法，台灣慣用「點、支援、檔案」）。
- 不含中文字的字串（`B1`、`{current}／{total}`、`Email`）略過，不報錯。
- 輸入：`node scripts/check-zh.mjs <檔案>`，接受 copy-table.json（讀 `rows[].text`）或扁平／巢狀的 zh-TW.json（讀所有字串值）。輸出每條違規的 key、代碼、訊息；有違規 exit 1。
- 測試：`node --test scripts/`，正例（台灣用語通過）、反例（簡體字、大陸用語、OpenCC 會改的字）各至少一條，期望值寫字面值。

## 驗證方式

| 目標 | 怎麼驗 |
|---|---|
| AC#1 涵蓋全部定版畫面 | `node docs/verification/2026-10-02-task4-copy-evidence/extract-check.mjs` → 0 漏收；41 狀態每個都至少有一列的 `where` 提到 |
| AC#2 用語 | `cd scripts && npm ci && npm test && node check-zh.mjs ../docs/verification/2026-10-02-task4-copy-evidence/copy-table.json` → 0 錯 |
| AC#3 圈選頁 | 手機模擬（webkit＋chromium）開 review.html 截圖自檢；`onSave` 收到的 rows 結構正確（console 驗）；發佈與 db 由執行長 |
