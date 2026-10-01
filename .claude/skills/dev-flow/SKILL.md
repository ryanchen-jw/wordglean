---
name: dev-flow
version: 2.0.0
description: |
  開發週期 SOP 編排器。依任務類型（新功能／修 bug／重構／純文件）分流到對應的 skill 序列
  （plan-eng-review、plan-design-review、investigate、/code-review、qa、design-review…），
  每階段結束停下來確認。
  使用時機：開始任何非 trivial 的開發任務時呼叫 /dev-flow。
  觸發詞：「開發 SOP」、「跑完整流程」、「dev flow」。
allowed-tools:
  - Bash
  - Read
  - AskUserQuestion
  - Skill
  - TaskCreate
  - TaskUpdate
  - TaskList
---

# /dev-flow — 開發週期 SOP

這個 skill 是**編排者**，不做實質工作。審查、除錯、QA 交給對應的 skill；實作由使用者或其他 agent 執行。

## 核心原則

1. **不要重新發明**：每個階段只負責呼叫對應的 skill，不自己另寫一套流程。
2. **停下來再繼續**：每個階段結束後，用 `AskUserQuestion` 問 `continue / skip / redo / stop`。
3. **鐵律優先**：使用者在任何時候輸入「停」「STOP」「中止」「算了」「先這樣」，立刻停止並總結進度。
4. **用 TaskCreate 追蹤**：進入 SOP 時先把適用階段建成 task list，使用者隨時知道現在在哪一步。
5. **目標先可驗證**：開工前把任務轉成可驗證的完成條件（例：「修 bug」＝「重現測試先紅後綠」）；薄弱的完成條件（「讓它能動」）不開工。

## Stage 0：分流（必跑）

### 0.1 環境檢查（輕量）

```bash
git branch --show-current 2>/dev/null
git status --short 2>/dev/null | head -20
```

### 0.2 用 AskUserQuestion 問任務類型與旗標

```
Question 1：這次的任務類型？
  - feat（新功能／新頁面／新服務）
  - fix（修 bug／故障排除）
  - refactor（重構／效能優化／不改行為）
  - docs（純文件／架構圖／文案）

Question 2：附加情況？（multiSelect）
  - has-ui（有 UI 變更）
  - prod-impact（會影響正式環境）
  - security-critical（安全敏感：認證、付款、個資）
  - none
```

### 0.3 依答案建立序列

查下表，把適用階段用 `TaskCreate` 建成 todo。開始呼叫該階段的 skill 前標 `in_progress`；使用者回 `continue` 後標 `completed`。

### 0.4 護欄

- `prod-impact`：進 Stage 1 前先跟使用者確認回滾方式（怎麼退回上一版），寫進 task 描述。
- `security-critical`：Stage 7 必跑。

---

## 四種情境 × 階段對應表

`—` 代表跳過。

| # | Stage | feat | fix | refactor | docs |
|---|---|---|---|---|---|
| 1 | 需求釐清 | 主對話釐清目標、使用者、驗收條件 | — | — | — |
| 2 | 工程計畫審 | `plan-eng-review` | —（影響面大時才跑） | `plan-eng-review` | 涉及 API／schema 時跑 |
| 3 | 設計計畫審 | `plan-design-review`（若 `has-ui`） | — | — | — |
| 4 | 根因調查 | — | `investigate`（含重現測試與修正） | — | — |
| 5 | 實作 | 使用者／其他 agent | 由 Stage 4 完成 | 使用者／其他 agent | 使用者編寫 |
| 6 | Code Review | `/code-review` | `/code-review` | `/code-review`（可加 `/simplify`） | — |
| 7 | 安全審查 | `/security-review`（若 `security-critical`） | 同左 | 同左 | — |
| 8 | 測試與 QA | 全套測試＋`qa`（若 `has-ui`） | `qa --report-only` → 確認 → `qa` | 重構前後全套測試皆綠＋（有 UI）`qa --quick` | — |
| 9 | 設計 QA | `design-review`（若 `has-ui`） | — | — | — |
| 10 | 冒煙測試 | 真實端到端跑一遍 | 真實端到端跑一遍 | 真實端到端跑一遍 | — |
| 11 | 收尾 | 回報＋交使用者決定 commit／PR | 同左 | 同左 | 同左 |

說明：
- Stage 6、7 是 Claude Code 內建的 `/code-review`、`/security-review`。
- Stage 10：單元測試綠不算完成，要真的把功能跑起來走一次（本機優先）。牽涉畫面用 `browser` skill 截圖並 Read 檢查。
- 本 SOP **不含** 發布、部署、部署後監控；這些由使用者依專案流程自行處理。

### fix 情境的特殊規則

- Stage 4 `investigate` 是**鐵律**：沒找到根因不准修。使用者想跳過時提醒一次。
- 修 bug ＝ 先寫能重現的測試（紅），再讓它通過（綠）。
- 修可疑的既有邏輯前，先 `git blame`／讀 commit 坐實來由，確認不是刻意設計。

### refactor 情境的特殊規則

- 重構前先確認既有測試全綠並記錄；重構後同一套測試仍全綠才算完成。
- 有效能目標時，重構前後各量一次（同環境、同資料），數字寫進回報。
- 不同時做結構變更與行為變更。

### docs 情境的特殊規則

- 通常只跑 Stage 11；文件涉及 API 合約／schema 變更時補跑 Stage 2。

---

## 階段控制（必要模式）

每個階段依序：

1. `TaskUpdate` 設為 `in_progress`
2. 用 `Skill` tool 呼叫對應 skill，例如：
   ```
   Skill(skill="plan-eng-review")
   Skill(skill="code-review")
   ```
3. 等該 skill 完成（它會自己和使用者互動）
4. `AskUserQuestion` 問下一步：
   - `continue`：進入下一階段
   - `skip`：跳過下一階段
   - `redo`：重跑這階段
   - `stop`：結束 SOP
5. `TaskUpdate` 設為 `completed`（`redo` 除外）

使用者的任何文字回應出現「停」「STOP」「中止」「算了」「先這樣」，立刻進入結束流程。

---

## 結束流程

流程跑完、被 skip 到底、或使用者叫停時：

1. 讀 TaskList，列出已完成／跳過／未執行的階段。
2. 提醒下一步：
   - 有 `prod-impact` 但還沒做冒煙測試 → 提醒要做
   - 有未修的 QA／設計發現 → 列出
   - 還沒 commit 的變更 → 列出檔案，交使用者決定
3. 值得記住的教訓（非顯而易見、下次能省時間）列出來，由使用者決定要不要存。

---

## 呼叫 skill 的注意事項

1. **瀏覽器**：qa、design-review、冒煙測試都走 `browser` skill（playwright-cli）。首次使用前確認已安裝：`playwright-cli --version`；沒有就照 `browser` skill 第 1 節安裝。
2. **登入頁面**：QA 涉及登入時，先依 `browser` skill 第 4 節存好 storage state，再開始。
3. **skill 呼叫失敗**：不要自己改 skill，問使用者 `redo` / `skip` / `stop`。

---

## 快速參考卡（給使用者）

| 我現在想⋯ | 直接用 | 或用 dev-flow |
|---|---|---|
| 從零做新功能 | — | `/dev-flow` → feat |
| 修某個 bug | `/investigate` | `/dev-flow` → fix |
| 重構不改行為 | `/plan-eng-review` → `/code-review` | `/dev-flow` → refactor |
| 只更新文件 | — | `/dev-flow` → docs |
| 緊急 hotfix | `/investigate` → `/code-review` | 不建議用 dev-flow |
| 看網頁／截圖 | `/browser` | — |
| 只要 QA 報告 | `/qa --report-only` | — |

---

## 非目標

- 只是編排層，不取代各 skill。
- 不做發布、部署、監控。
- 不做專案客製，保持通用。

## 回報

執行完畢時告訴使用者：
- 哪些階段完成
- 哪些階段跳過（原因）
- 各 skill 產出了什麼（審查結論、QA 報告路徑、截圖、測試結果）
- 下一步建議
