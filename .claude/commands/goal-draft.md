---
description: 擬 paste-ready 的 /goal 草稿——授權執行長獨自跑完手頭任務、產 HTML 驗收報告、待裁示事項集中列出；只擬稿不執行
---

# /goal-draft — 擬「獨自完成手頭任務」的 goal 指令草稿

觸發語境：使用者說「給我 goal 指令」「讓你獨自完成手頭任務」「跑完再給我報告」或同義句。`$ARGUMENTS`＝範圍提示（可空，如「只含 293」「今晚」）。

本指令**只擬稿、不開跑**：草稿逐行可刪改，使用者貼回（或回「照這個跑」）才算授權生效。使用者不想逐 stage 守著審，但也不給空白支票——草稿的用途是把授權邊界一次談清，執行長照原則代決、事後可追溯。

## Step 1 盤點手頭任務（憑實況、不憑記憶）

1. `claude agents --json`：本 session 派出的 worker（短 ID、name、狀態、停在哪個 stage）；他 CEO 的 worker 只記「不碰」（daily-brain 鐵律 6）
2. `backlog task list -s "In Progress" --plain` 與 `-s "In Review" --plain`：篩出本 session 派工／驗收中的卡；`$ARGUMENTS` 有指定就只取指定範圍
3. 對話內已浮現、尚未拍板的決策點與已拍板事項各列一份（前者要轉成代決原則、後者寫進「已裁事項」防重問）
4. 每張卡標出下一步會碰到的閘門：驗收／merge／push／部署／prod 操作／對外文案／真錢

## Step 2 寫草稿

落檔 `C:/Projects/LinguaApp/.claude/daily-plan/sessions/goal-<MMDD>-<slug>.md`，並在對話內全文貼出。結構固定：

```
/goal <一句話目標>，全程不再問我；只有「<留閘項>」才停下等我。

【範圍】逐卡列 TASK-ID＋worker 短 ID＋要推到哪個狀態（會被留閘擋的卡自帶例外：「→ Done；若命中留閘則推到 In Review 附裁示材料，即算完成」）；明寫不做的（不新增卡、不碰 TASK-x／他 CEO 範圍）
【已裁事項（不再重問）】本次對話已拍板的參數與方案，逐條
【代決原則】每個原本要問人的決策 → 一條可機械執行的預設值（例：月額度＝日額度×15；文案落地推薦版於 worktree、merge 留閘）
【授權（本 goal 專屬、逐項明示）】
- 驗收：派隔離驗收官／走查官的判準（daily-brain 5.2）
- merge：squash-merge＋commit 由執行長做，基底自檢防他 CEO 推進
- push／部署／prod：逐項明示或明寫「不 push、不部署」；push 前 rev-list 與 push 分兩步、帶到他 session 未驗收 commit 即停
- worker 回收：registry resume／redispatch 續作，不另派新 worker
- 多 CEO：只碰自己派的 worker 與卡，日清跳過（鐵律 6）
【留閘（出現即停等我）】對外文案措辭／真錢／prod destructive SQL／與他 CEO 衝突／既有測試變紅非 fixture 問題／熔斷條件（02 §4）
【HTML 報告】落點 sessions/acceptance-report-<MMDD>-<slug>.html；照 harness/templates/acceptance-report-template.html＋07 §6 三鐵則：一卡一區塊、卡序＝需裁示→半場→全綠、每個決策六欄（問題／選項／建議／影響＋急迫／不裁示的預設／裁示後我會做什麼）；截圖內嵌、禁上雲；durable MD 另落 docs/verification/
【收尾交付】backlog 勾 AC＋標 Done（留閘擋住的停 In Review；不 complete，等日結）＋每個代決結果記回卡 comment；worker 清理規則（已 merge 且不續派才 close）；結束回報一則：commit／部署 sha、報告路徑、待裁示清單一行一項；然後 /goal 結束、停等我
```

填寫鐵則：
- **全文 4000 字內**（使用者貼回的輸入上限）：規則寫引用不抄內文（「照 07 §6」「照鐵律 5」），同類事項合併成行；代決判準與留閘項不為省字而省
- 每一行都對應 Step 1 盤到的實物（卡號、短 ID、檔案路徑），不留模板佔位字
- 代決原則必須具體到執行長不用再問就能做；寫不出判準的決策 → 改進「留閘」
- 底線不因授權鬆動：`daily-brain.md` 鐵律 5「永遠不可」清單、真錢、prod destructive 一律留閘；權限閘（Needs input）仍由使用者 attach 放行
- 對外文案：實作可跑、merge 留閘等使用者逐字審
- **完成條件要條件式**（Stop hook 只讀字面，任何寫下「卡要到哪個狀態」的地方——目標句、範圍段逐卡終態、收尾交付——都算完成條件）：
  - 只寫「真的做完」與「踩到留閘」兩類；**「等待中」絕不列入**（hook 判完成＝永久清除 goal，實測一等就被清）
  - 含時段閘的動作（push 即部署、部署禁區）寫「時段內完成 push＋走查；收尾落在禁區則停在 merge、報告列『待窗口 push』即算完成」；跨夜等待不放進 goal（曾整夜空轉數十輪）
  - 停在留閘時仍逐條 AC 掃一次，不依賴裁示的先做掉；不准為了讓 hook 通過而違反留閘（動被擋的檔、勾未達成的 AC）
  - 長鏈要跨多次等待 worker 時，/goal 不適合當載具——改用 ScheduleWakeup 鏈續作、草稿檔當授權書引用

## Step 3 停下

貼出草稿後**停下等使用者**：刪改後貼回＝授權生效，執行長依草稿開跑、每個代決結果記回 backlog comment；使用者未回不開跑。
