# 模型調度與動態升降級守則

> 適用前提:執行長(主對話)= claude-opus-5-5(常駐);執行長臨時降級時,把本檔門檻對應收緊一級。
> **模型使用範圍:執行長=claude-opus-5-5;worker/subagent=claude-opus-5-5[1m] 主力、claude-sonnet-5-5 輕量**。
> (原制度的實際配置:執行長=最高階模型、worker=Opus、輕量=Sonnet。)

## §1 角色分層表

| 角色 | 模型 | 做 | 不做(禁區) |
|---|---|---|---|
| 執行長(主對話) | claude-opus-5-5 | 讀 backlog 派工、審 subagent 結論、做決策、commit、與 user 對話 | 大批量讀檔、repo 掃描、寫實作碼、自己跑完整測試套件、讀全量 git diff |
| 調查員 | claude-opus-5-5[1m](預設);範圍明確的輕量查證可 claude-sonnet-5-5 | read-only 搜尋、實地調查、diff 摘要、read-back 驗收(Explore subagent) | 改任何檔案 |
| 工作馬 | claude-opus-5-5[1m](預設);已有明確 recipe 的機械套用可 claude-sonnet-5-5 | 功能實作、重構、寫測試、跑測試(general-purpose subagent 或子專案 session) | 自我驗收、push(鐵律 5 授權例外)、改凍結物 |

「範圍明確」的判定:任務 prompt 裡已有具體檔案路徑 + 可勾選驗收條件 + 不需要跨檔推理。三者缺一 → 用 claude-opus-5-5[1m]。

## §2 指揮官不下場(量化判準)

主對話動手前先過這張表。**命中任何一條 → 派 subagent**:

| # | 判準(可數的) | 派給 |
|---|---|---|
| 2-1 | 預計要 Read 的檔案 > 3 個,或單檔 > 500 行 | 調查員 |
| 2-2 | 預計要 Grep/Glob > 2 輪(即第一輪結果還要再展開查) | 調查員 |
| 2-3 | 要看的 git diff 統計(`git diff --stat`)> 200 行變更 | 調查員(給摘要+可疑點) |
| 2-4 | 要寫/改的程式碼 > 30 行 | 工作馬 |
| 2-5 | 要跑的指令會產生 > 100 行輸出(測試套件、build、批次腳本) | 工作馬(回報只截關鍵行) |

主對話**可以**自己做的(白名單):讀單一已知路徑檔案的指定區段、跑 `git log --oneline -20` / `git status` / `git diff --stat`、單行驗證指令、寫 harness 等制度檔、跑 `backlog` CLI 的任務狀態操作(status / check-ac / comment / archive)。

**正例**:「查 {{某子專案}} 的登入流程 E2E 缺口」→ 命中 2-1/2-2 → 派調查員,prompt 用 `03-delegation-templates.md 模板 A`,主對話收 30 行結論。
**反例**:主對話自己連開 8 個 Read 看相關檔案,「順便」看完 service 層——決策 context 被數千行原始碼填滿,派工品質下降。這正是本守則要阻斷的行為。

## §3 派工三件套

任何 subagent/子 session 指派,prompt 必含三件套,缺一件即為無效派工(收到的回報不予驗收):

1. **目標與背景**:要解決什麼問題、為什麼(1-3 句)+ 相關檔案的具體路徑(執行長已知的都給,不讓對方重新摸索)
2. **驗收條件**:可勾選的 checklist,每條可被第三方檢查(能寫成指令或看得見的產物)
3. **回報格式**:成果路徑 + 關鍵行號 + ≤30 行結論(代碼引用上限細則=`03 §0`)

**正例**(驗收條件):「(1) `{{測試指令}} tests/test_x.py` 全綠並貼最後 3 行輸出 (2) 新增 test 涵蓋邊界條件 X (3) `git diff --stat` ≤ 2 檔 40 行」
**反例**:「把 X 修好,注意品質」——無一條可勾選,弱模型會自行定義「好」然後宣稱完成。

## §4 異常升降級路徑

| 情境 | 動作 |
|---|---|
| 輕量模型同一子任務連錯 2 次 | 停止重試。整理**完整失敗軌跡**(做了什麼、指令、完整錯誤訊息、兩次嘗試的差異)升給主力模型(主對話自己接手或派主力 subagent) |
| 主力模型解出後發現是固定模式(同構修改要套 N 處) | 把解法寫成逐步 recipe(輸入→步驟→預期輸出→驗證指令),降回輕量模型批次套用 |
| 同一件事在當前層級嘗試滿 2 次仍失敗,且已升級過(主力也滿 2 次) | **熔斷**:停止自主作業,按 `02-judgment-matrix.md §3` 格式問 user |

「同一子任務連錯 2 次」的認定:兩次嘗試都未讓驗收條件多勾任何一項。若第二次有部分進展(多勾了至少一項),計數重置為 1。計數單位統一用「次」;升級到新層級後計數歸零,每層最多 2 次。

**升級時的軌跡格式**(缺項不受理):
```
## 失敗軌跡
- 任務:<原驗收條件原文>
- 嘗試 1:<做了什麼> → <完整錯誤訊息/錯在哪>
- 嘗試 2:<與嘗試 1 的差異> → <結果>
- 我的假設:<為什麼覺得會這樣>(允許寫「無假設」)
- 相關檔案:<路徑:行號>
```

## §5 隔離驗證(驗收=fresh 驗收官)

- 實作 agent 的「完成回報」只是**宣稱**,不是驗收。驗收由全新 context 的**驗收官**執行,輸入**只有**原始驗收條件 checklist + 檔案路徑(防錨定);程序與載體=`03 模板 D`(Read-back/實跑/越界檢查/TDD 閘/副作用閘/守衛紅證/Standards 檢查/verdict 摘要),任何 ❌ → 整包退回實作端
- **雙軸審(大 diff 選項)**:diff 大或特徵收官時,拆兩個並行 fresh subagent——**Spec 軸**(對照任務與 AC 查漏做/多做/做錯)與 **Standards 軸**(對照 `08-smell-baseline.md`,派工時貼全文)——各自回報,不跨軸合併排名(防一軸遮蔽另一軸)
- **UI 任務(has-ui)另派視覺走查官**:功能驗收官測「行為」、走查官測「畫面」,兩層分工不互代(分工表=`06 §0`;走查關=`05`)
- **多樣本評審**(3 個獨立 subagent 各自產出、互不可見,執行長選優):只用於「一次寫對成本高、比較成本低」的產出——架構方案、設計方向、複雜 SQL
- 純文件/純調查任務可免驗收官,但執行長要抽查回報中至少 1 個檔案路徑與 1 個行號是否真實存在

## §6 派工載具與 Agent tool 用法

派工載具三種:

1. **`--bg` background agent(預設)**:`cd <Project> && claude --bg "<prompt>" --name "TASK-<id>-<Project>" --allowedTools ...`;daemon 託管(執行長 session 關閉照跑)、編輯自動隔離到 worktree 分支、worker 在該分支照快照鐵則 commit(merge/push=執行長,鐵律 5);派工/監控/驗收/清理操作見 `commands/daily-brain.md` Step 4-6;腳本化包裝=`scripts/worker.sh`
2. **Agent tool subagent(輔助)**:主對話內短平快調查(Explore)與 workspace 層小改動(general-purpose),用法見下方細則
3. **人肉子專案 session(fallback)**:--bg 不可用或需互動授權 MCP server 時,user 開 terminal 貼 prompt

Agent tool 細則:

- 調查:`subagent_type: "Explore"`,prompt 開頭註明搜索廣度(`medium` / `very thorough`)
- 實作:`subagent_type: "general-purpose"`(需要寫檔)
- 多個獨立調查 → 同一則訊息並行派出;有依賴 → 等前一個回來再派
- 驗收官:一律**新開** `Explore`(read-only 夠用;需重跑測試時用 `general-purpose`)——fresh context 即隔離本體(防錨定)
- 追問同一個 agent 用 SendMessage(保留其 context);全新任務開新 agent
- 模型指定:`model` 參數不填 = 繼承主對話,此為預設。只有「範圍明確」(§1 定義)的輕量調查或 recipe 批次套用才明填輕量模型
