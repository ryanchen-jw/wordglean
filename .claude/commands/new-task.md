---
description: 建任務卡專用流程——先概覽全板查重複/耦合，釐清＋實地調查後才建卡；不派工
---

# /new-task — 建任務卡 SOP

觸發時機：使用者丟一個新需求/問題回報要立卡。`$ARGUMENTS` ＝需求描述（可空）。本指令**只建卡不派工**（派工歸 CEO session / `/daily-brain`）。

## Step 1 需求釐清

- 用自己的話重述需求；有多種解釋就攤開反問，不默默替使用者決定。
- 需要拍板的決策點（語意定義、方案取捨、呈現位置等）用 AskUserQuestion 問完才建卡；使用者給明確指示時直接執行、不追問不加說明。

## Step 2 任務概況概覽（防重複／防耦合——建卡前必做）

1. `backlog task list --plain` 全板掃過（Deferred / To Do / In Progress / In Review / Done 全部）。
2. 同主題檢索：標題關鍵字比對；疑似相關的卡 **Read 全文**（含 `backlog/completed/` 近期歸檔——已收官的定案不重翻、已修過的不重開）。中文檔名用 Glob 工具找檔（Git Bash glob 會炸）。
3. 三判斷：
   - **重複**：既有卡已涵蓋 → 不開新卡，回報既有卡號；需求屬細項 → `backlog task edit` 補進既有卡（描述整段替換：先讀原文、合併後重寫，`--ac` 增列驗收）。
   - **耦合**：與既有卡同檔案／同資料表／有依賴 → 照開，但【邊界】必寫協調備註（同工程師序列、先後依賴、合併 re-publish 等），給 CEO 派工時參考。
   - **疑似 supersede**：新需求可能取代既有卡 → 問使用者，不自行裁決。

## Step 3 實地調查（不憑記憶與推斷開卡）

- 檔案路徑、行號、schema、DB 現況一律實查；大範圍掃描派 Explore subagent，不在主對話連環 Read/Grep。
- 數據比對以Supabase 正式專案為準（原制度：正式環境為準、本機 dev 庫有髒資料與缺口）；prod 一律唯讀。
- 疑似 bug 先坐實來由（git blame / design 文件 / 相關已結案卡），確認非刻意才立修復卡。

## Step 4 建卡

- `backlog task create`：多行描述先落 scratchpad 檔再 `-d "$(cat ...)"`；描述與指令內**不用反引號**（bash 命令替換陷阱）。
- 描述格式（沿用現行慣例）：
  `來源` ／ `【需求】` ／ `【現況（已實證，附 file:line）】` ／ `【範圍】做＋不做` ／ `【邊界】`（含 Step 2 的耦合協調備註）／ `dev-flow 情境`
- AC 逐條可驗證（含零回歸與 smoke 要求）；labels＝子專案名（workspace 制度層用 `workspace`）；priority 依上線關聯度。

## Step 5 回報

卡號＋一句話重點＋給 CEO 的協調備註（檔案衝突／依賴／建議派工順序）。到此為止，不展開派工。
