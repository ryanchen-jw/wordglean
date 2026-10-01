# 統一驗證報告（特徵級、產品負責人可讀）

> 定位:把散落的驗證證據(驗收官 verdict、走查報告、測試數字、截圖)在**特徵完成時**收斂成一份 durable、人可讀的報告——受眾是**產品負責人(user)**;worker→執行長格式仍見 `session-report-spec.md`,兩者不互相取代。
> 格式範例(即標準):`harness/templates/verification-report-example.md`;歷史實例見 `docs/verification/`。

## §1 觸發與單位

- **特徵導向、非 repo 導向**:一個特徵/批次(可跨多個子專案 repo)完成時產一份(單位=特徵、非卡)。
- 觸發:執行長判定特徵收官時、或 user 開口要(「有報告嗎」「怎麼驗的」)。日常單卡小修不產。

## §2 落點(durable、版控)

- 報告本體:workspace 根 `docs/verification/<YYYY-MM-DD>-<feature>.md`(workspace repo 版控;特徵常跨 repo,workspace 是唯一共同家)
- 截圖:同層 `<feature>-evidence/` 放**策展後的關鍵張**(隱私驗證、對比實測這類 load-bearing 證據;約 5-10 張/特徵——大量 PNG 不進 git 原則不變,全量留 temp/report 資料夾並在報告註明路徑)
- 🚫 **禁上雲**同 `06 §4`:禁 Artifact/claude.ai/任何對外 hosting

## §3 Capture 契約(邊做邊收,不事後重建)

1. **驗收官(模板 D)/走查官(模板 E)回報末段附「verdict 摘要」**——格式定義=`03` 模板 D/E,此處不重述
2. 執行長在 **daily-brain Step 5.4 squash-merge 當下**把該卡 verdict 摘要(含 commit sha)append 進當前特徵的 verification 檔
3. 走查關鍵截圖:走查 PASS 當下從 temp 複製進 evidence 目錄(temp 會被清、隔離 subagent transcript 不 durable)

## §4 Emit(特徵收官)

- 執行長(量大可派 subagent)整併成:總覽表(卡×類型×commit×自動化證據×走查)→ 逐卡段(改了什麼/驗收官實跑/重跑指令)→「你自己驗」步驟 → 證據落檔位置 → **誠實聲明**(哪些證據 transient、哪些驗證跳過、哪些 P2 延後)
- 每個數字都要有**重跑指令**——報告可信度來自可再現,不來自口說
- 先手動(照範本格式)跑幾輪;自動化 emit 腳本等格式穩定後另立任務(crawl-walk-run)

## §5 接縫

- `daily-brain.md` Step 5.4(capture 時點)、Step 7(收官 emit 提醒;HTML 版照 §6 模板)
- `03-delegation-templates.md` 模板 D/E(verdict 摘要一行)
- worker 端契約不變(`session-report-spec.md` 原樣)——capture 由執行長做,零新增 agent 管線

## §6 日結/批次 HTML 驗收報告(決策導向)

同一批事實只經營一次,兩份分工不重疊:

| | HTML 驗收報告 | 本檔 §1-§4 的 MD 報告 |
|---|---|---|
| 受眾/用途 | user **當天讀完就要下裁示** | durable 留底、事後查「怎麼驗的」 |
| 落點 | `.claude/daily-plan/sessions/acceptance-report-<MMDD>-<slug>.html`(日拋、不版控) | `docs/verification/<date>-<feature>.md`(版控) |
| 內容 | 狀況＋決策同處、截圖內嵌 | 事實、數字、重跑指令 |

HTML 引 MD 的路徑即可,MD 不抄 HTML 的裁示選項。模板(即標準):`harness/templates/acceptance-report-template.html`,填充鐵則寫在檔頭註解。**結構鐵則三條**(使用者拍板,違反即退回重排):

1. **一卡一區塊**——該卡的狀況/決策/新發現/截圖全寫在自己的卡內,不按資料型別分章(按「詳情/截圖/決策/新發現」四章切法會讓 user 讀一張卡要上下跳四處,已廢)。真無主的跨卡風險才進「跨卡事項」
2. **卡序=需裁示 → 半場/未完 → 全綠**;全綠無待辦卡用 `<details>` 收合成一行
3. **每個決策六欄不可省**:問題/選項/建議/影響＋急迫/**不裁示的預設**/**裁示後我會做什麼**——前四欄讓 user 能判斷,後兩欄讓「不回也能跑、回了不用再問一輪」

> 交付形式:原制度後期改以 Artifact 連結交付「決策用」HTML(使用者偏好);但含未發布畫面/內部測試證據者仍依 `06 §4` 禁上雲。兩者衝突時以禁上雲為準。{{確認新專案是否沿用}}

## §7 部署後 prod 實地走查(**每次部署必做,不等 user 提醒**)

**觸發**:Cloudflare Pages（app）與 Supabase migration 任何一次部署上線之後(自動 CD 或手動觸發皆算)。**CI 綠不等於驗過**。

**為什麼不能省**(理由要記住否則下次又會覺得多餘):CI 的單元/建置/e2e 多半**全程跑 mock**,它證明的是「前端對著自己寫的假資料是對的」。前端與後端的**真實 HTTP 契約**、真資料的邊界值、真登入態下的渲染,CI **結構上碰不到**。打真後端的 spec 若長期跑不起來,缺口只能靠這一關補。

**做什麼**(唯讀,約 5 分鐘):

1. **唯讀鐵則**:攔截並記錄所有業務寫入請求,報告要寫 `writesAttempted: []`。
   ⚠️ 攔截的判準是「**這個請求會不會改到業務資料**」不是「它是不是 POST」——token refresh、埋點事件這類要放行,**擋掉它們會自己把登入態弄死**,然後被誤判成「登入態失效」
2. 真登入態載入每一條動過的路徑:HTTP 狀態、真資料列數、error banner 數、console error、非 2xx 的 API 呼叫
3. 新加的入口在**真資料**上長出來了沒(用 `data-*` seam 數,別用肉眼)
4. 互動狀態實點一次(收摺、抽屜、分頁),含 `localStorage` 持久化與**重整後仍在**
5. 手機寬與桌面寬各一輪
6. 跑完把改到的使用者偏好**還原**(例:收摺狀態改回展開)

**兩個每次都會咬人的坑**:
- **存檔登入態可能跑一次就輪替**(refresh token rotation)——第二個 context 直接落登入頁。多 viewport 要用**同一個 context `setViewportSize`**,不是開新 context。過期的補登流程:（待定）
- **換頁中止的請求會記成 `requestfailed`**——不是缺檔。判定資源真的掉了要另外 `curl` 一次拿狀態碼,別直接寫進報告

**探針只能斷言它真的量到的東西**:寫斷言前先確認對應的測試/實作**宣稱的是哪個元素**。量錯對象(例:驗「外層 main 有沒有 inert」,但規格守的是「側欄自己 inert」)會差點把正常行為報成缺陷。

**產出**:併進當批的 HTML 驗收報告(§6),獨立一節;數字進 durable MD(§1-§4)。
