# UI 視覺走查關（所有 UI 改動必經）

> 定位:補「功能 e2e 測不到的畫面本身問題」——選項名不符實、殘留非目標語言、文案籠統、破版、缺狀態。**只審查出報告、不自動改碼**;修由執行長看報告分級後決定。
> 挑刺清單與 SOP 唯一權威處在本檔,他處只放指標(04 §4)。

## §1 何時觸發(has-ui 判準)

任何動到前端可見畫面的任務,feat/fix/重構皆然(**含最小 fix**——最小改動最常漏走查)。

**has-ui 判準**:worktree diff 觸及 app 前端可見檔——（待定）(例:`src/pages/**`、`src/components/**`、`.html`/`.css`、對應頁面腳本)。僅 has-ui 觸發(純後端/純資料/純文件免)。

**共用資產變更 → 走查範圍擴大(必做)**:diff 觸及共用樣式/元件(（待定）,例:全域樣式檔、共用元件目錄、主題/設計 token 設定)時,**不只走查改動頁**——先 `grep` 受動的選擇器/class/token 在哪些頁被引用,把命中頁全部併入受影響畫面清單。共用樣式改一處會漣漪多頁,只走查改動頁會漏掉被波及頁。

**位置**:daily-brain **Step 5.2、隔離驗收官之前**(worker 功能 e2e 綠且 worktree 快照已 commit → 工作區乾淨)。走查報告 **P0 未清 → 退回 worker、不進隔離驗收官**。

## §2 誰執行(隔離原則)

**獨立走查官**(general-purpose subagent 或 --bg worker),比照驗收官——只給「受影響畫面清單＋本檔挑刺清單」,**不給實作者自述**(防錨定)。桌機／平板用 `browser` skill(headless、截圖、Read PNG 判讀),**手機面用 Playwright 裝置描述檔**(§6 末條)。**不得改任何 repo 檔案**(截圖只寫暫存區)。

功能驗收官(模板 D)測「行為」、走查官(模板 E)測「畫面」,與實作端視覺 smoke 的分層權威表=`06 §0`,互不取代。(實作者自審的 design-review 類 skill 只是自審;本關才是獨立信任錨點,fix 類更是唯一覆蓋。)

## §3 前置(執行長派關前確保;走查官只做走查)

1. **`browser` skill 可用**:首次使用前確認其安裝/初始化步驟已在互動 session 完成,否則 --bg 無人環境會卡在 setup。
2. **後端 health 綠(走查頁需要真資料/登入態時)**:（待定）;`curl （待定）` 回健康。**純靜態公開頁免起後端**、只需前端 dev server。需登入態頁另需測試帳號具備對應權限。
3. **前端 dev server**:（待定）(預設埠 （待定）;衝突時改用另一埠並 `--strictPort` 類旗標禁止自動遞增)。
4. **登入態**:Supabase Auth session（存 localStorage，鍵名 sb-<project-ref>-auth-token）(例:測試 fixture 現簽 token;注意 token 存 localStorage 還是 cookie——存 localStorage 時 cookie 匯入類工具無效)。
5. **走查 worktree 改動版(非主分支)**:worktree 缺 `.env`/依賴目錄(gitignored)。複製 `.env` 進 worktree + 於 worktree 內用另一埠起 dev server(依賴解析可能向上吃到主 checkout 的依賴目錄——**前提是 worktree 在主 checkout 目錄樹底下**;否則先在 worktree 安裝依賴)。curl 比對兩個埠的變更 marker 確認服的是改動版;走查後關掉該埠、刪掉複製進 worktree 的 `.env`。

> ⚠ **走查期間避免併發跑 e2e**:走查與 e2e 共用後端,e2e 寫入會讓資料筆數變動、干擾空/資料態判讀;需穩定重現空狀態時用獨立資料快照或錯開時間。

## §4 走查矩陣(畫面 × 狀態)

每個受影響畫面,逐一截圖並 Read 判讀存在的狀態:
**正常 / 空(0 筆)/ 載入中 / 錯誤 / 成功 toast / 表單驗證失敗 / hover-focus / RWD 四尺寸(desktop 1440×900、tablet 768×1024、mobile 375×812 主、mobile 360×800 副;另 320 寬只量溢出,見 §5 M1)**

> ⚠ **資料量級(手機面假綠主因)**:走查與 smoke 一律用 **prod 量級資料**——筆數／頁數／最長名稱／最大數值／最長文案取上限值;mock 要調到上限並在報告註明「mock 值 vs prod 值」。典型事故:走查用 48 筆/3 頁判「375 不擠」,prod 700 筆/35 頁分頁按鈕折兩行。

## §5 挑刺清單(逐項 ✓/✗/NA ＋截圖佐證)

**A. 文案與語言**(對症最常漏的一類)
- A1 介面語言一律為 繁體中文,無殘留其他語言(按鈕/標籤/placeholder/錯誤訊息/toast/表頭/**徽章**);學習內容本身的英文（題目、例句、單字、選項）與品牌名 屬可接受。(若產品本身是多語系/語言學習內容,A1 只審「介面殼層」,學習內容依內容規格另審)
- A2 錯誤訊息在地化**且原因具體**——過期/額滿/格式錯要能分辨(籠統「無效」「失敗」=✗)
- A3 選項/標籤名實相符(「全部」真含全部、「啟用中」不含停用;近義標籤綁不同值=✗)
- A4 空狀態有引導文案**且反映當前篩選**(非空白、非「no data」、非不分篩選的籠統句)

**B. 狀態完整性**
- B1 空/載入/錯誤/成功四態都有且合理,不閃爍不卡死
- B2 邊界:超長文字不撐破、0 筆有空狀態、大量筆數有分頁/捲動

**C. 版面與 RWD**
- C1 四尺寸皆不破版、不水平溢出、不重疊、不裁切
- C2 對齊、間距、圓角一致,無孤兒元素

**M. 手機專屬**(≤639.98px 皆須過;引用標準=WCAG 2.2 **1.4.10 Reflow**／**2.5.8 Target Size**／1.4.4 Resize Text、Apple HIG 44pt、Lighthouse `tap-targets`／`font-size`;本站版式規則權威=（待定）,衝突以該檔為準)
- M1 寬度:375×812 主、360×800 副(Android 主流)皆過;**320 寬**(Reflow AA 下限)只量 `document.scrollWidth==clientWidth`,不截全矩陣
- M2 溢出:document 與**每個**橫捲容器 `scrollWidth-clientWidth`=0;允許橫捲的表格須有橫捲提示且不撐開頁面
- M3 不折行、不擠壓:按鈕／標籤／segmented／分頁控件單行(boundingBox 高 ≤ 1 行高);「標題＋控制項」列窄寬時 wrap 成兩列、不得擠成一列;任何文字不得直排
- M4 觸控目標:≥360px 寬每個可點元素 **≥44×44px**、鄰近目標間距 ≥8px;<360px 只擴命中區
- M5 表單:input／select 字級 **≥16px**(iOS Safari 否則自動縮放)、高 ≥44px
- M6 固定元素不遮內容:navbar／toast／dev 浮標／鍵盤彈起後輸入框仍可見;全屏頁用 `100dvh`
- M7 viewport meta 為 `width=device-width, initial-scale=1`,無 `user-scalable=no`／`maximum-scale=1`

**D. 可讀性與無障礙**
- D1 文字對比足夠(正文對背景 ≥ 4.5:1)
- D2 互動元件有可見 focus/hover 態;鍵盤可達
- D3 圖片有 alt、表單控件有 label

**E. 品牌一致性與 AI-slop**
- E1 色彩/字體/陰影符合既有設計語言,與相鄰頁面不脫節
- E2 無 AI-slop:無意義漸層、萬物置中、emoji 濫用、通用 hero 感

## §6 操作 recipe(照做省踩雷)

- **登入態注入**:goto 同源頁 → 以 JS 寫入 Supabase Auth session（存 localStorage，鍵名 sb-<project-ref>-auth-token） 要求的儲存鍵;管理後台類頁面若另有前端旗標,一併注入(缺旗標會被前端 gate 擋)。
- **auth 檢查**:注入 token 後 app 多半會非同步呼「我是誰」端點——token 有效＋後端起著 → 通過;token 失效或後端未起時會被清 token 跳 login,此時先修前置,不要靠搶在跳轉前截圖。
- **`<select>` 名實比對**:用 JS 讀 `<select>.options` 的 label/value/selected 對——名不符實/值綁錯用此抓(純截圖看不出 value)。
- **殘留其他語言**:DOM 葉節點掃描(Demo/Loading/No data 等屬殘留;§5 A1 白名單內可接受)。
- **⚠ 寫入型錯誤文案**(如重複資料錯誤)需驅動表單寫入,純瀏覽測不到 → 以 source-grep 佐證(查前端是否逐字顯示後端原文錯誤)。
- **⚠ 假陽性防呆**:資料區空白先確認不是後端未回應(API 500 讓頁面空白會被誤判成「文案籠統」);讀 console/network 佐證。
- **清空輸入用 JS**:部分自動化工具的 fill 不收空字串;改 `el.value='';el.dispatchEvent(new Event('input',{bubbles:true}))`。
- **⚠ dev 浮標會遮 UI**:開發模式浮標在 mobile 可能蓋住操作區,干擾純截圖判讀;RWD/元素可達性以 DOM 度量(scrollWidth/scrollLeft/getBoundingClientRect)為準、不只看截圖。
- **⚠ 共用瀏覽器 daemon 會被他人搶 tab**:若 `browser` skill 是跨 session 共用的常駐程序,一律開新 tab 作業並確認只有一個實例。<!-- TODO: browser skill 落地後依實際行為確認 -->
- **⚠ 手機面不用「只改視窗寬度」的指令**:它只改寬度、不模擬 isMobile／hasTouch／DPR／UA,量到的不是手機。§5 M 一律用 **Playwright 裝置描述檔**——在暫存區寫一次性腳本(不進 repo)以 `devices['Pixel 5']`／`devices['iPhone 12']`／`{width:320,isMobile:true,hasTouch:true}` 建 context,或以專案既有 Playwright 的手機 project 跑既有 spec。桌機／平板才用 `browser` skill 的 viewport。

## §7 報告格式(交執行長)

- 每項 ✓/✗/NA ＋ 一行證據(截圖檔名 or 觀察)
- ✗ 分級:**P0 阻斷**(破版/功能性誤導,不修不能 merge)／**P1 該修**(語言殘留、籠統文案、名實不符)／**P2 建議**(微調、品牌細節)
- 截圖組絕對路徑一併附;回報比照 `session-report-spec.md` 場景 7
- **手機面證據硬要求**:每個受影響畫面附 375 截圖路徑＋**三個數字**(溢出 px／關鍵控件行數／最小觸控尺寸 px)＋資料量級(mock vs prod);沒數字＝該畫面手機面未做,「無 P0」一句不接受
- 結尾:一句總評(可 merge / 需修 P0 後再驗)

## §8 執行長處置

看報告:P0 退回實作端修→重走查;P1 當輪修或立即立案;P2 記 backlog。**修與不修的決定權在執行長**(本關只找問題)。派工模板見 `03-delegation-templates.md` §5 模板 E。

**部署後線上複驗一律含手機一張**(裝置模擬,prod 真資料),不只桌機。
