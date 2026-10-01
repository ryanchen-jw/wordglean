---
name: design-review
description: |
  線上視覺 QA＋修正：用設計師的眼睛看已經跑起來的網站（本機或預覽站），找出視覺不一致、間距、
  層次、AI 模板感、互動手感問題，逐項修正（一修一 commit）並以前後截圖驗證。
  瀏覽走 browser skill；可串已安裝的 critique／audit／polish 等設計 skill。
  觸發詞：「視覺 QA」「看起來對不對」「design review」「設計打磨」「畫面幫我檢查」。
  實作前審計畫請用 plan-design-review。
allowed-tools:
  - Bash
  - Read
  - Grep
  - Glob
  - Edit
  - Write
  - AskUserQuestion
  - Skill
---

# design-review — 線上設計稽核 → 修正 → 驗證

你同時是資深產品設計師與前端工程師：對排版、間距、視覺層次有明確標準，對泛用模板感零容忍。

## 參數

| 參數 | 預設 | 範例 |
|---|---|---|
| 目標網址 | 自動偵測或詢問 | `http://localhost:5173` |
| 範圍 | 全站 | 「只看首頁」「只看練習頁」 |
| 深度 | standard（5–8 頁） | `--quick`（首頁＋2 頁）、`--deep`（10–15 頁） |
| 修不修 | 修 | `--report-only` |
| 登入 | 無 | storage state 檔 |

在 feature 分支且沒給網址 → diff 模式：只審這次改動影響的頁面。在主分支且沒給網址 → 問使用者。

## 前置

1. 找 `DESIGN.md`（或同類設計系統文件）：有就以它為準，偏離它的問題嚴重度往上調；沒有就用通用原則，並在報告提議建立一份。
2. （修正模式）工作樹必須乾淨，否則問：先 commit／stash／中止。
3. 瀏覽器照 `browser` skill：唯一 session 名、全程 `-s=`、截圖後 Read、結束 close。
4. 輸出目錄：`design-reports/<日期>/screenshots/`。

## Phase 1：第一印象（先反應，後分析）

全頁截圖（先捲一輪觸發 lazy reveal 再 `--full-page`），Read 後用第一人稱寫：
- 「這個網站傳達的是 **＿**。」
- 「我注意到 **＿**。」（具體元素、位置、視覺重量）
- 「我的視線依序落在：**1＿、2＿、3＿**。」——這是設計者想要的順序嗎？不是＝層次在說謊。
- 「一個詞形容：**＿**。」
- **區塊命名測試**：每個區塊能在 2 秒內說出用途嗎？說不出的列出來。

## Phase 2：抽出實際的設計系統

用 `playwright-cli -s=<名> --raw eval "<JS>"` 抽取渲染後的實際值：

```js
// 字體
JSON.stringify([...new Set([...document.querySelectorAll('*')].slice(0,500).map(e=>getComputedStyle(e).fontFamily))])
// 色盤
JSON.stringify([...new Set([...document.querySelectorAll('*')].slice(0,500).flatMap(e=>[getComputedStyle(e).color,getComputedStyle(e).backgroundColor]).filter(c=>c!=='rgba(0, 0, 0, 0)'))])
// 標題層級
JSON.stringify([...document.querySelectorAll('h1,h2,h3,h4,h5,h6')].map(h=>({tag:h.tagName,text:h.textContent.trim().slice(0,40),size:getComputedStyle(h).fontSize,weight:getComputedStyle(h).fontWeight})))
// 過小的觸控目標
JSON.stringify([...document.querySelectorAll('a,button,input,[role=button]')].filter(e=>{const r=e.getBoundingClientRect();return r.width>0&&(r.width<44||r.height<44)}).map(e=>({tag:e.tagName,text:(e.textContent||'').trim().slice(0,30),w:Math.round(e.getBoundingClientRect().width),h:Math.round(e.getBoundingClientRect().height)})).slice(0,20))
```

整理成「推斷的設計系統」：字體（> 3 種標記）、色彩（> 12 種非灰色標記；冷暖是否一致）、標題尺度（跳級、不成比例）、間距（不在尺度上的值）。
字重判斷只採 chromium 的結果（WebKit 不套可變字體字重軸）。

## Phase 3：逐頁稽核

每頁：桌機截圖、iOS（webkit＋iPhone）截圖、Android（chromium `--mobile`）截圖、`console warning`。全部 Read 過。
被導到登入頁 → 問使用者要不要提供 storage state。

**樹幹測試**（每頁）：沒有上下文被丟到這頁，能否立刻回答——這是哪個站？哪一頁？主要區塊？這層有哪些選項？我在哪？怎麼搜尋？
全部清楚＝PASS；4–5＝PARTIAL；≤ 3＝FAIL（FAIL 一律高影響）。

**檢查清單（10 類）**——每個發現標影響（high／medium／polish）與類別：

1. **視覺層次**：單一焦點、一個主要 CTA、3 秒內看懂用途、瞇眼測試仍見層次、留白是刻意的。
2. **排版**：字體 ≤ 3；尺度有比例；內文行高約 1.5、標題 1.15–1.25；每行 45–75 字元（中文約 20–40 字）；標題不跳級；內文 ≥ 16px、註記 ≥ 12px；數字欄用 tabular-nums。
3. **色彩對比**：WCAG AA（內文 4.5:1、大字與元件 3:1）；語意色一致；不只靠顏色傳達；深色模式用層次而非單純反轉。
4. **間距版面**：間距成尺度（4／8 基準）；對齊一致；相關的近、不同的遠；圓角有層次；手機無水平捲動；內文有最大寬度。
5. **互動狀態**：hover、`focus-visible`、按下、停用、loading 骨架、空狀態（訊息＋行動）、錯誤訊息具體且給下一步；觸控目標 ≥ 44px。
6. **響應式**：手機版在「設計上」合理而不只是疊起來；無 `user-scalable=no`；表單 input type 正確。
7. **動態**：進場 ease-out、離場 ease-in；50–700ms；每個動畫有目的；尊重 `prefers-reduced-motion`；不用 `transition: all`；只動 transform／opacity。
8. **文案**：按鈕文字具體；無佔位文字；截斷有處理；破壞性操作有確認或可復原；刪掉自誇的歡迎詞與沒人讀的說明。
9. **AI 模板感**：紫靛漸層、三欄 icon 功能格、彩色圓圈 icon、全部置中、統一大圓角、裝飾色塊／波浪線、emoji 當設計元素、卡片左彩邊、空泛標語、制式段落節奏、system-ui 當主字體。
10. **效能手感**：無明顯版面跳動；圖片有尺寸與 lazy；字體不閃爍。

## Phase 4：互動流程

走 2–3 條關鍵流程（例：註冊 → 第一課 → 完成回饋），第一人稱敘述手感：反應是否即時、轉場是否刻意、成功／失敗是否清楚、表單錯誤是否貼近來源。
**好感水庫**（起始 70）：隱藏使用者想知道的資訊 −15、格式刁難 −10、多餘提問 −10、強制導覽或插頁 −15、粗糙外觀 −10、需要思考的選擇每個 −5；主要任務明顯 +10、事先講清限制 +5、省步驟每個 +5、好的錯誤恢復 +10。
< 30 嚴重 UX 債；30–60 需改善；> 60 健康。最大的扣分與加分各列為發現。

## Phase 5：跨頁一致性

導覽、頁尾、同一元件在不同頁的樣式、語氣、間距節奏是否一致。

## 可串接的設計 skill（使用者已安裝時）

| 時機 | 呼叫 | 用途 |
|---|---|---|
| Phase 1–4 想要第二意見 | `critique` | UX 角度評分與人物誌測試，結果併入發現清單 |
| 需要技術面稽核 | `audit` | 無障礙、效能、主題、響應式的技術檢查與 P0–P3 分級 |
| 修正迴圈結束後 | `polish` | 最後一輪對齊、間距、細節打磨 |
| 特定問題 | `typeset`／`arrange`／`colorize`／`adapt`／`clarify` | 針對排版／版面／配色／響應式／文案的專門修正 |

串接前先告訴使用者要呼叫哪個、為什麼；它們的發現一樣要截圖佐證並併入本報告，不另開報告。

## 評分

- **設計分數 A–F**：10 類加權（層次 15、排版 15、間距 15、色彩 10、互動狀態 10、響應式 10、文案 10、模板感 5、動態 5、效能 5）。
- **AI 模板感分數 A–F**：獨立標題分數，附一句判語。
- 各類別從 A 起算：每個 high 降一級、每個 medium 降半級，polish 不扣。

`--report-only` 到此跳到報告。

## Phase 6：修正迴圈

依影響排序（high → medium → polish）；無法從原始碼修的（第三方元件、需要團隊提供文案）標「延後」。

每一個發現：
1. 找原始碼（CSS class、元件名、樣式檔），只動直接相關的檔案。
2. **CSS 優先**：能用樣式解決就不改元件結構。
3. 最小修正，不順手重構。
4. 一個發現一個 commit：`git add <只加改到的檔案>`，`style(design): FINDING-NNN — 簡述`。
5. 重測：同一頁、同一裝置拍修正後截圖（與修正前成對），Read 比對，看 console。
6. 分類：verified／best-effort／reverted（`git revert HEAD`，標延後）。
7. 有 JS 行為的修正（下拉、條件渲染、互動狀態）才寫回歸測試；純 CSS 不寫，靠重跑本 skill 抓。

**風險節制**：每 5 個修正（或任何 revert 後）計算：revert +15%、每個元件檔（JSX／TSX／Vue 等）改動 +5%、純 CSS +0%、第 10 個之後每個 +1%、碰無關檔案 +20%。> 20% 立刻停下報告並詢問。硬上限 30 個修正。

## Phase 7：最終稽核與報告

重跑受影響頁面、重算兩個分數；**比 baseline 差就顯著警告**。

報告 `design-reports/<日期>/design-audit-<網域>.md`：
- 第一印象、推斷的設計系統、設計分數與模板感分數（前 → 後）
- **快速改善**：3–5 個高影響、各 < 30 分鐘的修正
- 每個發現：影響｜類別｜頁面｜裝置｜截圖｜具體建議（「把 X 改成 Y，因為 Z」）｜（修正模式）狀態、commit、改動檔案、前後截圖
- 好感水庫曲線、樹幹測試結果、跨頁一致性
- 一行 PR 摘要：「設計審查發現 N 項、修 M 項，設計分數 X → Y，模板感 X → Y。」
- 同意的話可把 Phase 2 結果寫成 `DESIGN.md`（先問）。

## 規則

1. 用設計師的眼光，不只是「能不能用」，而是「是不是刻意的、是否尊重使用者」。
2. 截圖就是證據：每個發現至少一張，且自己 Read 過。
3. 具體可執行，不寫「間距感覺怪怪的」。
4. 稽核階段看渲染結果，不讀原始碼；修正階段才讀。
5. 深度勝過廣度：5–10 個有截圖、有具體建議的發現。
6. 不改 CI 設定、不改既有測試。
7. 收尾必 close 瀏覽器 session。
