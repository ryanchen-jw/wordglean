# LinguaApp Harness 索引(路由中心細目)

> 本目錄是 LinguaApp 工作流的制度層(Harness)。
> 入口:workspace 根 `CLAUDE.md` 指向本檔;本檔指向各制度檔。
> 修改任何本目錄檔案前,先讀 `04-knowledge-protocol.md` 的權限分級。

## 檔案路由表

> 分層:日常流程=**核心 4＋領域 5**;00 是診斷依據檔、scripts/hooks 是工具,**不是流程步驟**。

### 核心流程檔(執行長日常必用)

| 檔案 | 一句話 | 誰在何時讀 |
|---|---|---|
| `01-model-dispatch.md` | 模型調度與升降級守則:指揮官不下場、派工三件套、升降級、隔離驗證 | 執行長每次派工前;subagent 失敗時 |
| `02-judgment-matrix.md` | 判斷力外化矩陣:換路徑信號、完成判準、熔斷條件(每條附正反例) | 任何 agent 卡住、要宣告完成、或想問 user 之前 |
| `03-delegation-templates.md` | 派工 Prompt 模板 ×5:搜尋研究/功能實作/代碼重構/代碼審查/UI 視覺走查 | 執行長寫派工 prompt 時直接複製填空 |
| `04-knowledge-protocol.md` | 知識迭代協議:哪些檔可自改、踩坑紀錄格式、精簡觸發條件 | 想更新任何規則檔或 memory 之前 |

### 領域 SOP(碰到該領域才讀)

| 檔案 | 一句話 | 誰在何時讀 |
|---|---|---|
| `05-ui-visual-review.md` | UI 視覺走查關:所有 UI 改動必經的畫面走查(挑刺清單 A-E＋M、report-only、`browser` skill headless);補功能 e2e 測不到的名實/文案/破版/狀態 | 執行長派 has-ui 任務、審 UI 交付時 |
| `06-uiux-visual-smoke.md` | 實作端視覺 smoke SOP:app UI 變更 worker 用專案內 Playwright 跑關鍵狀態＋testInfo.attach 截圖、本地報告禁上雲;與 05 兩層互補 | worker 做 UI 任務、審 smoke 報告時 |
| `07-verification-report.md` | 統一驗證報告:特徵完成時把驗收/走查/測試證據收斂成產品負責人可讀的 durable 報告(capture 契約＋emit;落 `docs/verification/`);**§7＝每次部署後的 prod 唯讀實地走查,必做** | 執行長 squash-merge 時(capture)、特徵收官時(emit)、**每次上線後(§7)** |
| `08-smell-baseline.md` | 代碼異味基線:Fowler 12 smell「是什麼→怎麼修」速查(judgement call 非硬違規);05 管介面、08 管代碼 | 執行長派驗收官/雙軸 Standards 軸(貼全文)、親審 diff 時 |
| `09-timezone-convention.md` | 跨專案時間與時區規約:存傳 UTC、算日曆日與顯示用業務時區、排程顯式時區、測試手算字面值＋固定「現在」 | 寫任何存/傳/算/顯示時間的程式碼、派時間相關任務與驗收時 |

### 工具(可執行,非文件)

| 檔案 | 一句話 | 誰在何時讀 |
|---|---|---|
| `scripts/worker.sh` | --bg worker 續派鏈工具:dispatch/resume/close/wait/redispatch(回收復原)、踩坑防護內建(完整 UUID/不 rm transcript/worktree 目錄重試/stale 目錄拒動);`HARNESS_WS`／`HARNESS_WORKER_MODEL` 可設定 | 執行長派工、續派、結案清理、worker 被回收時 |
| `hooks/bash_gate.py` | Bash 權限閘:worker 模式(`HARNESS_WORKER=1`)三級分流(NEVER 擋/本機與唯讀 prod 放/prod 寫入與殼層包裝留閘);作用範圍預設＝本 workspace 根(`HARNESS_GATE_SCOPE` 可覆寫);掛載於 settings.json hooks.PreToolUse(Windows 用 pythonw 免彈視窗) | 權限行為異常、重建環境重掛 hook 時 |
| `hooks/test_bash_gate.py`／`hooks/replay_corpus.py` | 閘門的手寫正反案例／歷史指令全量回歸(語料需新專案自建) | 改 bash_gate 後兩支都要綠 |
| `templates/` | HTML 驗收報告模板、MD 驗證報告範例 | 07 §4/§6 產報告時 |

### 診斷依據檔(考據用,非流程步驟)

| 檔案 | 一句話 | 誰在何時讀 |
|---|---|---|
| `00-diagnosis.md` | Harness 漏水診斷書:三大痛點+阻斷方案+子專案修復清單(§2)+能力極限 | 要改工作流時考據;修復清單執行者 |

## 與既有制度檔的關係

- `.claude/commands/daily-brain.md` — 每日派工流程(操作層);鐵律細節收斂至本目錄,daily-brain 引用不重複定義
- `.claude/session-report-spec.md` — 回報格式契約(格式層);驗收「內容」判準在 `02-judgment-matrix.md`
- `~/.claude/skills/dev-flow/SKILL.md` — 開發 SOP(通用層,不含專案客製);維持不動(skill 組:browser／investigate／plan-eng-review／plan-design-review／qa／design-review／dev-flow,均在 `~/.claude/skills/`)

## 啟動方式(給新 session 的執行長)

1. 讀本檔(退化症狀警覺=`04 §5`)
2. 派工前讀 `01-model-dispatch.md` + `03-delegation-templates.md`
3. 卡住/驗收/想問 user 時查 `02-judgment-matrix.md`
