# app 視覺 smoke + 本地截圖報告（實作端 dev-flow 層）

> 定位:補「route-mock 斷言(pass/fail)測不到的『畫面到底有沒有真的渲染出來』」——用真實瀏覽器跑關鍵狀態、截圖存證。
> 挑刺/SOP 唯一權威處在本檔,他處只放指標(04 §4)。

## §0 兩層 UIUX 驗證(先分清,別跟 05 搞混)

| 層 | 誰 | 用什麼 | 何時 | 測什麼 |
|---|---|---|---|---|
| **本檔 06 · 視覺 smoke** | **實作端 worker(自驗)** | 專案內既有 **Playwright** + `testInfo.attach()` | 開發流程 **qa 前** | 畫面**真的渲染**、關鍵**狀態對**(邏輯↔畫面一致) |
| `05` · 視覺走查關 | 執行長層**獨立走查官** | `browser` skill headless | daily-brain **Step 5.2** | 畫面**內容對不對**(名實/文案/破版/AI-slop 挑刺 A-E＋手機 M) |

兩層互補:smoke=worker 自證畫面沒壞;走查關=執行長獨立抓內容品質。

## §1 何時觸發

**app feat/fix 涉及可見 UI 變更者**——has-ui 判準同 `05 §1`。**純邏輯 / 無 UI 變更任務免。**

## §2 做法(真瀏覽器 Playwright,關鍵狀態逐一截圖)

1. 寫一支 smoke spec(放 （待定）,沿用既有 config),用真瀏覽器渲染**受影響畫面的關鍵狀態**——取 `05 §4` 狀態矩陣子集,外加**邊界觸發態**(如提醒橫幅出現)。**手機面必跑(頁面手機可見即必跑,非選配)**:手機 project 至少跑一次,斷言固定三件套——(a) document 與每個橫捲容器 `scrollWidth-clientWidth`=0、(b) 關鍵控件(按鈕／分頁／segmented)boundingBox 高 ≤ 1 行高、(c) 可點元素 boundingBox ≥44×44——**只量 scrollWidth 不算**(只量溢出會綠燈放行擠壓版面)。資料量級照 `05 §4` 用 prod 上限值,mock vs prod 寫進報告。
2. **每個狀態用 `testInfo.attach()` 把截圖嵌進報告**:
   ```js
   await testInfo.attach('limit-banner', { body: await page.screenshot(), contentType: 'image/png' });
   ```
   `testInfo.attach()` **不受 config `screenshot:'only-on-failure'` 影響(成功也附)**,故沿用既有 config 即可。
3. 跑法(沿用現有 config):（待定）(例:`npx playwright test --config <config> <smoke>.spec.js`)。
4. **價值提醒**:斷言綠 ≠ 畫面真的出現;smoke 常抓到的是 **setup 問題(route 註冊順序、mock 沒生效)**。

## §3 快速觸發邊界態(mock 設小值,真後端 config 一律不動)

邊界型 UI(門檻、上限、額滿…)不必真湊滿資料——**用 `page.route` 把後端值 mock 成小值**快速觸發(例:把「每日上限」mock 成 3,只做 3 次就觸發上限橫幅)。

**鐵則**:
- **只能 mock(`page.route` override / 前端 dev-only mock 旋鈕),不得改真後端 config / DB / `.env`**——避免擾動共用後端與別的 session。
- 報告**須註明「mock 值 vs 真實值」**。

## §4 報告:本地、🚫 禁上雲

- **產出**:Playwright 原生 HTML report(`npx playwright show-report <folder>`);截圖靠 `testInfo.attach()` 嵌入。
- 後端如需報告:用既有覆蓋率工具出 HTML 或終端輸出;要新增報告外掛另立子專案任務。
- **🚫 明文禁上雲(硬規則,違反即制度違規)**:**禁用 `Artifact` 工具、禁發布到 `claude.ai`、禁任何對外 hosting**。測試/畫面證據只留本機。理由:內部測試證據含產品未發布畫面與後端行為,一律不外流。

## §5 報告落點(不進 git)

- Playwright HTML report 落在**已 gitignore 的**報告目錄(（待定）)——天然不進 git。
- spec 的截圖輸出**一律寫進已 gitignore 的報告目錄**或 `testInfo.attach`,**不得寫進 `docs/`**——全套回歸會覆寫已入 git 的 PNG、在 docs/ 下亂建目錄。需保存為證據的截圖由執行長 squash-merge 時搬 `docs/verification/<feature>-evidence/`(07 規則);回報只給「report 資料夾路徑 + `npx playwright show-report <folder>` 指令」供執行長本機開。

## §6 回報(worker → 執行長,附在 session-report 場景 2)

- 跑了哪些狀態、各一句結論(渲染 OK / 抓到什麼 setup 問題)
- HTML report 資料夾路徑 + 開啟指令(`npx playwright show-report <folder>`)
- 若用 mock 觸發:mock 值 vs 真實值對照
- ✅ **報告在本機、未上雲**(勾選確認)

派工時的一句話要求見 `03-delegation-templates.md` 模板 B(UI 變更段)。
