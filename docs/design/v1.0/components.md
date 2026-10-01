# LinguaApp 元件規格

**v1.0 定版（2026-10-02，創辦人 G2 兩輪圈選）**——TASK-11 以後所有 UI 的唯一依據。

> G1 定案：版面結構取 R1b 方向 3（Bento 模組卡、圓角、密度、按下輕微縮小）＋配色質感取 R1 方向 A（紙感米底、深藍主色、細線分隔、幾乎不用陰影）。
> 數值唯一來源：`app/src/design/tokens.css`；Tailwind 工具類別名見 `app/src/design/theme.css`。本檔只寫「用哪個 token、各狀態長怎樣」，不重複數值。
> 高保真示意：`docs/design/v1.0/review.html`。文案皆為佔位，TASK-4 定稿。
> G2 第一輪（2026-10-02）修改：跟讀改「確認後送出再計分」、單字卡改「四選一釋義」、全 App 英文字可點查義、字體定為主案（刪襯線版）、發音預設手機內建聲音、補確認框與小課完成頁。

## 共通規則

- **觸控**：所有可點元素 ≥44×44px，相鄰可點元素間距 ≥8px。
- **按下（pressed）**：`transform: scale(var(--lg-press-scale))`，加上底色加深一階，時長 `--lg-duration-press`。只用 transform 與顏色，不改版面尺寸。系統開「減少動態效果」時縮放值為 1、時長為 0，只保留變色。
- **焦點**：`outline: 3px solid var(--lg-focus); outline-offset: 2px`，只在鍵盤焦點（`:focus-visible`）顯示。
- **停用（disabled）**：底色 `disabled-bg`、文字 `disabled-text`，加原生 `disabled` 或 `aria-disabled="true"`，不回應點擊。WCAG 不要求停用元件的對比，所以這組不進 AA 測試。
- **讀取中（loading）**：保留元件原尺寸，內容換成 20px 轉圈圖示加文字（例：「批改中…」），設 `aria-busy="true"`，並暫停點擊。
- **錯誤（error）**：顏色＋圖示＋文字三者並用（定案約束 6）。錯誤訊息放在元件正下方，用 `aria-describedby` 連到元件。
- **圖示**：Lucide 線條圖示，線寬 2px，尺寸 20px（行內）／24px（導覽、主要動作）。裝飾用圖示加 `aria-hidden="true"`。TASK-11 用 `lucide-react`（ISC 授權）。
- **分層**：預設不用陰影。卡片靠 `surface` 與 `bg` 的明度差，加 1px `line` 細線；輸入框、選項等需要辨識邊界的元件用 `border`（≥3:1）。只有彈層（`shadow-sheet`）與 Toast（`shadow-toast`）有陰影。

## 狀態對照表

N/A＝該元件沒有這個狀態，括號內為理由。

### 1. 按鈕

| 變體 | 用途 | 樣式 |
|---|---|---|
| 主要 | 每畫面最多一顆（開始、檢查、繼續） | `bg-primary text-on-primary rounded-control`，高 52px，全寬，字重 700 |
| 次要 | 並列的第二動作（聽不出來、跳過） | `bg-surface text-primary border border-border rounded-control`，高 52px |
| 文字 | 低頻入口（> 只複習單字） | `text-primary`，無框，高 44px，前綴 › |
| 危險 | 解除連結、刪除模型、清除資料 | 次要樣式，字改 `text-error`；一律要二次確認 |

| 狀態 | 主要 | 次要／文字／危險 |
|---|---|---|
| default | 如上 | 如上 |
| pressed | 縮放＋底色疊 12% 黑（深色模式疊 12% 白） | 縮放＋底色換 `primary-soft` |
| disabled | `bg-disabled-bg text-disabled-text` | 框線與字改 `disabled-text` |
| loading | 轉圈＋「處理中…」，寬度不變 | 同左 |
| error | N/A（按鈕本身不帶錯誤；錯誤顯示在觸發它的表單欄位或回饋條） | N/A（同左） |

### 2. 題目卡

題型共用的外框：`bg-surface rounded-card border border-line p-5`，內含題型名稱（`text-secondary text-muted`）、題幹（中文 `text-body`、英文 `font-en text-content`）。

| 狀態 | 樣式 |
|---|---|
| default | 如上 |
| pressed | N/A（卡片本身不可點；可點的是裡面的選項、播放鈕） |
| disabled | N/A（題目不會停用；跳過以按鈕處理） |
| loading | 題幹區顯示 3 條骨架線（`bg-line`，圓角 6px），高度與題幹一致，避免版面跳動 |
| error | 題目載入失敗：卡內顯示 ⓘ 圖示＋「這題載入失敗」＋「換下一題」次要按鈕 |

### 3. 選項（單選）

`bg-surface border border-border rounded-control`，最小高度 56px，整列可點；左側字母標 `text-secondary text-muted`，選項文字英文用 `font-en text-content`。

| 狀態 | 樣式 |
|---|---|
| default | 如上 |
| selected | 框線改 2px `primary`，左側字母換成實心圓點；設 `aria-checked="true"` |
| pressed | 縮放＋底色 `primary-soft` |
| disabled | 檢查之後其他選項變停用：字改 `disabled-text`，框線改 `line` |
| loading | N/A（選項跟題目卡一起載入） |
| error（作答後答錯） | 使用者選的那項：框線 2px `error`＋右側 ✗ 圖示＋底色 `error-bg`；正確答案那項：框線 2px `correct`＋✓ 圖示＋底色 `correct-bg` |

### 4. 進度條（小課內）

高 6px，底 `line`、填色 `primary`，圓角 999px；右側文字「5／12」（`text-caption text-muted`，等寬數字）。`role="progressbar"`，帶 `aria-valuenow`／`aria-valuemax`。

| 狀態 | 樣式 |
|---|---|
| default | 如上 |
| pressed／disabled | N/A（不可互動） |
| loading | N/A（題數在課程開始前就確定） |
| error | N/A（進度不會出錯；離線等狀態用全域 Toast） |

另有「模型下載進度」用同一元件，右側文字改「42%」；下載失敗時填色改 `error`，加文字「下載中斷・重試」。

### 5. 底部導覽

三格：今天／課程／單字庫。每格是圖示（24px）＋文字（`text-caption`），高 56px，加安全區底部內距 `env(safe-area-inset-bottom)`。底 `bg-surface`，上方 1px `line`。

| 狀態 | 樣式 |
|---|---|
| default | 圖示與字 `muted` |
| active | 圖示與字 `primary`，字重 700，圖示下方有 4×20px `primary` 小橫條；`aria-current="page"` |
| pressed | 底色 `primary-soft`（不縮放，避免整列晃動） |
| disabled | N/A（導覽項不會停用；未分級時「課程」仍可進） |
| loading／error | N/A |

### 6. 錄音鈕（跟讀）

直徑 76px 圓鈕，置於畫面下 1/3 正中；點一下開始錄音、再點一下結束（規格 §6）。

| 狀態 | 外觀 | 文字（鈕下方） |
|---|---|---|
| default（待錄） | `bg-primary`，白色麥克風圖示 | 點一下開始錄音 |
| recording（錄音中） | `bg-error`，白色方塊停止圖示；外圈 2px `error` 光環隨音量放大（減少動態時改為靜態光環＋秒數） | 點一下結束・0:03 |
| pressed | 縮放 | — |
| loading（辨識中） | `bg-disabled-bg`，轉圈；不可點 | 轉文字中…（不會上傳） |
| disabled | `bg-disabled-bg`，麥克風圖示 `disabled-text` | 語音辨識模型下載中（約 50–80MB） |
| error | 未允許麥克風：`bg-surface border-2 border-error`，麥克風斜線圖示 `error` | 需要麥克風才能跟讀＋「允許麥克風」次要按鈕 |

辨識完成後的流程（規格 §6 G2 修訂）：

1. **確認**：顯示一個可編輯輸入框，預填辨識結果（`font-en text-content`，`border-border`，焦點時 `focus` 外框），上方說明「辨識結果如下，聽錯的地方可以直接改」。底部兩顆按鈕：「再唸一次」（次要）、「送出」（主要）。
2. **結果**：以送出句與目標句逐字比對計分。錯字加 `error` 色底線＋`error-bg` 底，漏字顯示 `＿＿` 佔位（`error`），下方一行「錯字 1・漏字 1・得分 6／8 字」。接回饋條（全對用答對樣式，有錯用答錯樣式並附目標句）＋「繼續」。

辨識結果和送出句的差異只在背景記錄，畫面上不強調、不再有「模型聽錯」標記。

### 7. 字典彈層（底部彈出）

從底部滑出，最高 60% 畫面高；上緣圓角 `rounded-sheet`，`shadow-sheet`；背景蓋 `scrim`。頂部有 36×4px 拖曳把手，可下滑關閉，也可點遮罩關閉（拖曳的替代方式）。內容：單字（`font-en text-title`）、音標（`font-ipa text-secondary text-muted`）＋發音鈕、詞性、級距與多益標籤、繁中釋義（`text-body`）、收藏按鈕、資料來源（`text-caption text-muted`）。

| 狀態 | 樣式 |
|---|---|
| default | 如上 |
| pressed | 收藏、發音鈕依按鈕規則 |
| disabled | N/A（發音預設用手機內建聲音，永遠可用；設定裡選配的高音質發音未下載時也退回內建聲音） |
| loading | 查詢中：單字與釋義位置顯示骨架線 |
| error | 查無此字：ⓘ 圖示＋「字典裡沒有這個字」，收藏鈕隱藏 |

收藏鈕兩態：未收藏「☆ 加入收藏單字庫」（次要按鈕）；已收藏「★ 已在收藏單字庫」（底 `primary-soft`、字 `primary`），點一下取消。

### 8. Toast

浮在底部導覽上方 16px，左右 16px，`bg-text text-bg rounded-control shadow-toast`（反色，兩模式都清楚）。`role="status"`、`aria-live="polite"`，不搶焦點；4 秒後自動消失，可帶一個文字動作（例：「復原」）。有底部彈層開著時，Toast 改出現在畫面上方（狀態列下方 12px），避免蓋住彈層內容。

| 狀態 | 樣式 |
|---|---|
| default（資訊） | ⓘ 圖示＋一行文字，例：「已加入收藏」 |
| error | ✗ 圖示＋文字，例：「批改失敗：網路中斷」＋「重試」 |
| pressed | 只限動作鈕 |
| disabled／loading | N/A（Toast 是一次性訊息） |

離線為常駐狀態，不用 Toast，改用頁首下方的全寬提示條（`hint-bg`／`hint`）：「目前離線：複習與已下載的課程仍可使用」。

### 9. 空狀態

置中於內容區；24px 線條圖示（`muted`）＋標題（`text-title-sm`）＋一句說明（`text-secondary text-muted`）＋一顆主要按鈕。不放插畫或吉祥物（定案約束 5）。

| 狀態 | 樣式 |
|---|---|
| default | 如上 |
| pressed／disabled／loading | 只限內含的按鈕，依按鈕規則 |
| error | N/A（載入失敗屬錯誤狀態，用題目卡的 error 樣式） |

### 10. 首頁模組卡（Bento）

首頁「今天」畫面：一張大卡（今天的學習＋主要按鈕）＋兩張並排小卡（到期複習、下一課）＋一張全寬小卡（今天已完成）。卡片 `bg-surface rounded-card border border-line p-5`；小卡數字用 `text-display` 等寬數字。可點的小卡（到期複習→只複習單字、下一課→課程詳情）右上角有 › 圖示。

| 狀態 | 樣式 |
|---|---|
| default | 如上 |
| pressed | 縮放＋底色 `primary-soft` |
| disabled | 新課暫停時，下一課小卡改 `hint-bg` 底＋ⓘ「新課暫停：先把複習量降下來」，不可點 |
| loading | 數字位置顯示骨架塊 |
| error | N/A（首頁資料都在本機） |

### 11. 單字卡（四選一釋義）

取代原本的「翻面＋四級自評」（G2 修訂）。

- **題目**：卡片中央顯示英文字（`font-en text-display`）＋音標＋發音鈕。下方 4 個中文釋義選項（選項元件，中文 `text-body`）：1 個正確、3 個同級干擾項。卡片下方一顆文字按鈕「看例句提示」。
- **回饋**：點選即判定，不需要「檢查」。選項標示對錯後，卡片下方出現回饋區：正確釋義、例句（英文，可點查義）、例句中譯，加上「繼續」主要按鈕。
- **FSRS 自動評分**（依 TASK-12 通用對應，畫面上不顯示評分鈕）：答錯＝Again；答對但超過 15 秒或用了「看例句提示」＝Hard；其餘答對＝Good；不提供 Easy。

| 狀態 | 樣式 |
|---|---|
| default | 如上，選項皆未選 |
| pressed | 選項依選項規則 |
| disabled | 作答後四個選項不可再點；未選的干擾項改 `disabled-text` |
| loading | 干擾項還沒產生時：選項位置顯示骨架塊 |
| error（答錯） | 點到的選項 `error` 框＋✗；正確選項 `correct` 框＋✓；回饋區用答錯樣式 |

### 12. 可點英文字（全域規則）

**範圍**：所有呈現英文學習內容的地方，每個英文單字都可以點，開啟字典彈層（元件 7）。包括題目、選項、短文、例句、回饋句、單字卡、單字庫列表、批改結果。介面文字（全繁中）不受影響。

- **點擊區**：英文學習內容的行高至少 1.5；每個單字以 `<button>`（或 role="button"）包住，上下加 6px 不影響版面的透明點擊延伸，讓點擊高度達 44px 左右。相鄰兩行的延伸區重疊時，以手指落點最近的字為準。行內文字屬 WCAG 2.5.8 的「行內例外」，但仍盡量做到 44px。
- **視覺提示**：平常**不加底線或顏色**，避免整段英文都是連結而變吵。可點的提示靠三件事：
  1. 按下時該字底色變 `primary-soft`（100ms）。
  2. 彈層開啟期間，被查的字保持 `primary-soft` 底＋2px `primary` 底線，關閉後恢復。
  3. 前三次上課時，在第一個英文內容下方顯示一行說明小字「英文字都可以點，查看意思」（`text-caption text-muted`），之後不再出現。
- **作答中查字**：開彈層不改變題目狀態（不算作答、不選中選項、不暫停也不重置計時）；關閉後回到原狀。查字次數記錄下來，但只有單字卡的「看例句提示」會讓評分變成 Hard，查其他字不影響評分。
- **例外：會洩漏答案的字在作答前不可點**。
  - 單字卡：正面的測驗目標字。
  - 選擇題：選項本身（作答前點選項＝選它）。
  - 分級測驗：所有字（測的就是認不認識）。

  作答後（按下檢查或選完），上述字全部改為可點。
- **鍵盤**：Tab 可依序移到每個單字，Enter 開啟彈層，Esc 關閉並把焦點還給該字。

| 狀態 | 樣式 |
|---|---|
| default | 與一般英文內容相同，無裝飾 |
| pressed | 底色 `primary-soft` |
| active（彈層開啟中） | 底色 `primary-soft`＋2px `primary` 底線 |
| disabled（會洩漏答案的字，作答前） | 外觀不變，不可點、不可聚焦 |
| loading／error | N/A（由字典彈層處理） |

### 13. 確認框（對話框）

用於離開小課、清除資料等會丟失進度或資料的操作。置中浮在 `scrim` 上，`bg-surface rounded-card shadow-sheet`，寬度為畫面寬減 40px。內容依序為：標題（`text-title-sm`）、一句說明後果（`text-secondary`）、兩顆按鈕上下排列。安全的選項放上面、用主要按鈕；有風險的選項放下面，用次要或危險按鈕。`role="alertdialog"`，開啟時焦點移到安全按鈕，Esc 或點遮罩等於選安全選項。

| 狀態 | 樣式 |
|---|---|
| default | 如上 |
| pressed | 依按鈕規則 |
| disabled | 清除資料：勾選「我了解資料無法復原」後，危險按鈕才可點 |
| loading | 危險動作執行中：危險按鈕轉圈「清除中…」，兩顆按鈕都不可點 |
| error | 動作失敗：說明下方加錯誤行（✗＋原因），按鈕恢復可點 |

### 14. 小課完成頁

一課結束後的整頁，不是彈窗。大標題「完成：辦公室 3」；一張卡列出這課學到的新字（每個字可點查義）與「已加入單字庫，明天開始複習」；一張卡寫「12 題・答對 10 題」。底部主要按鈕「回到今天」，文字按鈕「再複習一次剛學的字」。不放星星、分數動畫、連續天數或經驗值（無遊戲化）。

## 微互動

| 互動 | 觸發 | 動作 | 時長 | 減少動態效果時 |
|---|---|---|---|---|
| 按下回饋 | 任何可點元素按下 | scale 0.97＋底色變化 | 100ms 進、放開即回 | 不縮放，只變色 |
| 答對回饋 | 按「檢查」且答對 | 題目卡下方滑出回饋條（向上位移 16px＋淡入），✓ 圖示做一次 0.8→1 縮放 | 200ms | 回饋條直接出現，圖示不動 |
| 答錯回饋 | 按「檢查」且答錯 | 回饋條同上；錯的選項標示 ✗、正確選項標示 ✓。不搖晃、不閃爍 | 200ms | 直接出現 |
| 單字卡選項回饋 | 點四個中文釋義選項之一 | 點到的選項立刻變色（答對 `correct`／答錯 `error`），同時標出正確選項；卡片下方的回饋區（正確釋義、例句、中譯）向上位移 16px＋淡入；「繼續」鈕出現 | 選項變色 100ms、回饋區 200ms | 直接出現 |
| 可點英文字 | 點任何英文學習內容的單字 | 該字底色變 `primary-soft`（按下回饋），彈層開啟期間保持標示 | 100ms | 不變 |
| 彈層開關 | 點字開啟；下滑或點遮罩關閉 | 由下往上滑入，遮罩淡入；關閉時間取開啟的 70% | 200ms 開／140ms 關 | 直接出現與消失 |

所有動效只用 transform 與 opacity；動效進行中仍可點擊（點「繼續」會直接跳到結束狀態）。不做彩帶、星星、音效等慶祝效果（無遊戲化）。

## 字體與自 host

G2 定案：主案（黑體）。

| 用途 | 字體 | @fontsource 套件（TASK-11 安裝） |
|---|---|---|
| 介面、標題、中文翻譯 | Noto Sans TC（標題 700） | `@fontsource-variable/noto-sans-tc` |
| 英文學習內容 | Plus Jakarta Sans | `@fontsource-variable/plus-jakarta-sans` |
| 音標 | Noto Sans | `@fontsource-variable/noto-sans` |

以上套件皆為 OFL-1.1（`npm view` 已確認，2026-10-01）。
