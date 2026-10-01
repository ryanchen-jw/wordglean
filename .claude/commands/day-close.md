# /day-close——日結＋存記憶＋壓縮前收尾

觸發語境：使用者說「日結」「日結，重要資訊存入記憶，我要壓縮對話」或同義句。本指令＝`daily-brain.md` Step 6＋7 的獨立化（規則細節以該檔為準、此處不重抄），外加記憶保存與壓縮前收尾。

## 執行順序

### 1. 對帳與收報
- `claude agents --json` 對帳現役 worker；有停下未收報的先收報處理（未完成任務只 stop 不 rm、明日 resume）

### 2. 結案盤點（daily-brain Step 6.1）
- `backlog task list -s Done --plain` 收集本日驗收通過任務
- **只 complete 自己這條線派工／驗收的卡**：已給使用者看過驗收報告＋執行長驗收完畢的直接 complete；未出過報告的先列清單給使用者過目（除非本次指示或 goal 已授權「直接 complete」）
- 逐條補結案 comment（`--comment "YYYY-MM-DD 結案：<一句話結果>；★ <副發現>"`；已 complete 出板的卡補不了 comment、改記驗證報告）→ `backlog task complete <id>`
- 他 CEO 線的 Done 卡不代結案、不代寫 comment，逐條標「他 CEO」列進回報（對方可能還有未 push 的 commit；使用者明示收整個看板時例外）

### 3. 清理（daily-brain Step 6.3）
- 已 squash-merge 的 worker 鏈：`worker.sh close <短ID> <Project> <topic|-> TASK-<id>`
- close 報 worktree 有殘留時：**先搶救驗收證據**（報告/截圖 cp 回主工作區——worktree remove 會刪光 gitignore 產物）再 force remove；settings.local.json 換行幻影可棄
- 未完成任務的 worker 只 stop、worktree/分支保留

### 4. 未完成外溢（daily-brain Step 6.2）
- 沒做完的工作寫 `<Project>/docs/pending/<YYYY-MM-DD>-<topic>/pending.md`（session-report-spec 場景 6）

### 5. 重要資訊存 memory
判準（`harness/04-knowledge-protocol.md` 為準）：跨 session 有用、且 repo/卡面未記載的才存——
- 新教訓／使用者拍板 → feedback 或 project 類 memory 檔＋`MEMORY.md` 索引行
- **既有 memory 已過時的先更新**（本日事實推翻舊記載時必改、勿只加新檔）
- repo 已載（CLAUDE.md、卡 comment、驗證報告）的不重複存
- 當日有新增索引行時量一次上限：`wc -m ~/.claude/projects/C--Projects-LinguaApp/memory/MEMORY.md` > 20000 就提精簡（超載會靜默截斷後段索引、不報錯，見 `harness/04-knowledge-protocol.md` §3）

### 6. 統一驗證報告收尾
- 當日 `docs/verification/<date>-<feature>.md` 補收尾段（結案數字、教訓、環境備忘）；證據圖確認已落 `<feature>-evidence/`

### 7. workspace commit
- **只 add 具體路徑**（`backlog/`、`docs/verification/...`、本次動過的制度層檔）——禁 `add -A`；不掃入他 CEO 線的未提交改動
- message：`chore(backlog): MMDD 日結——N 卡 complete（<id 清單>）＋<其他要點>`

### 8. 對話內結案回報
- 30 秒掃完：complete 清單／commit hash／未 push 清單／pending 與明日待辦／需決策事項
- 最後一句告知使用者可壓縮對話

## 邊界
- complete 只在本指令（或使用者明示日結）執行；白天驗收停 Done
- push 不在本指令範圍（依 daily-brain 鐵律 5／使用者授權為準）
- 記憶檔一律寫 memory 目錄、不進 repo
