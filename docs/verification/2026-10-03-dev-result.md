# 2026-10-03 開發結果與驗收紀錄（TASK-21、TASK-22）

本機 main，未 push、未部署。看板 21／23 Done；TASK-15 In Review（只差 AC#4 評測）；TASK-23 To Do（上線）。

## TASK-21 開源與法遵文件——Done（5283f26）

- 產出：README.md 改寫、CONTRIBUTING.md、docs/self-hosting.md、docs/privacy.md、App 內隱私說明頁、App 內授權與致謝頁、NOTICE 補漏 9 項、建置變數 VITE_SOURCE_URL、app/.env.example
- 創辦人 10-03 裁示免逐字審（AC#3），由執行長審稿
- 隔離驗收 PASS：
  - 在乾淨副本照指南跑通最小部署與本機 Supabase（Email 驗證碼登入成功）
  - NOTICE 守衛雙向紅證
  - 隱私承諾抽 3 條核對程式碼，屬實
  - VITE_SOURCE_URL 實測：有值時顯示原始碼連結，無值時不顯示
- 測試：app unit 806、主 e2e 211、content 213，全綠
- 重跑：`cd app && npm ci && npm test && npm run build && npx playwright test --workers=2`；`cd content && npm ci && npm test`
- 證據：docs/pending/2026-10-03-task21-docs/（自架演練 log、紅證 log）

## TASK-22 全面 QA——Done（ac18f89）

### 健康分數（四輪）

| 輪次 | 分數 | 主要修正 |
|---|---|---|
| 1 | 94→97 | 首屏不抓單字總表 |
| 2 | 97→97 | 移交項、離線 e2e |
| 3 | 95→97 | TASK-21 新三頁的鍵盤捲動 |
| 4 | 97→98 | 作答後淡化選項對比 |

### 隔離驗收

- 首驗 FAIL：AC3，作答後淡化選項 color-contrast 為 3.48:1。
- 第 4 輪修正：改用 muted 文字並加虛線框，新增 e2e/a11y-answered.spec.ts。
- 複驗 PASS：
  - 守衛紅證：還原 ChoiceOption 後 12 條全紅。
  - axe（全規則、兩引擎、淺色／深色、含作答後狀態）：critical 與 serious 皆為 0。

### 測試結果

- 旅程 E2E：連跑 3 次，兩引擎共 6/6
- unit：818
- 主 e2e：228
- sync：16
- speech：20
- content：213

### 效能

- 首屏 JS gzip 191.8KB，預算 200KB。
- 首屏不載入字典與模型（perf-budget e2e 守衛）。
- LCP 為本機成對比較，中位數 1360ms → 1268ms；線上數字待 TASK-23。

### 重跑

- `cd app && npm test && npx playwright test --workers=2`
- 先在 repo 根執行 `npx supabase start`，再跑 `npx playwright test --config playwright.sync.config.ts e2e-sync/journey.spec.ts --repeat-each=3`

### 證據

docs/verification/2026-10-03-task22-qa-evidence/：round1–4、journey-x3.log、lcp-paired.log、真機未驗 8 項

## 待創辦人裁示

1. 單字庫列表的中文意思取自 data 層字典第一義，有錯，例如 a 顯示「累加器」。建議單字庫改顯示課程單字卡的第一義。
2. 隱私說明缺兩項：刪除雲端帳號資料的功能、聯絡方式。建議併入 TASK-23。
3. TASK-15 評測續跑：每日 08:05 之後，$0。
4. 跟讀「錄音太短」專屬提示的文案。

## 未修 P2

- 小課、複習畫面沒有 h1。
- 首屏 JS 只剩 8KB 餘裕。
- 「下一課」卡標題在全形括號處折行。
- 單字庫列表的英文字按鈕小於 44px（目前以行內例外處理）。
- NOTICE 開頭的「骨架…待補」字樣已過時。
- 全新 volume 首次啟動時自動套用 migration 的行為未實測。
