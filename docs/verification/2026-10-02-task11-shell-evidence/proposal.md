# TASK-11 App 外殼與主要畫面——proposal

> 執行長 2026-10-02 核准 Round 1 計畫（D1–D8 照建議）即為簽核。規格依據：`docs/design/v1.0/`（components.md、review.html）、`docs/spec/requirements.md`。

## 範圍

五畫面（D1）：

| 畫面 | 設計 | 狀態 |
|---|---|---|
| 首頁 | s01 | 預設／今天都完成／新課暫停／第一次開啟／離線 |
| 課程地圖 | s02 | 預設（目前單元展開）／點開某課（底部彈層） |
| 單字庫 | s09 | 預設／空的；分頁（全部／到期／收藏）＋熟悉度下拉＋英文搜尋 |
| 設定 | s11 | 預設（未授權）；已連結、金鑰錯誤屬 TASK-15／20 |
| 清除確認 | s13 | 未勾選／已勾選＋元件 13 的執行中、失敗 |

另含：底部導覽、離線提示條、PWA 安裝提示（D2）、模型下載進度 UI 骨架（只有型別與元件，不接真下載）。

## 路由（自寫 history 路由，不加路由套件）

| 路徑 | 畫面 | 底部導覽 |
|---|---|---|
| `/` | 今天 | 有 |
| `/course` | 課程 | 有 |
| `/words` | 單字庫 | 有 |
| `/settings` | 設定（含 s13 確認框） | 無，返回鍵 |
| `/review`、`/lesson/:id`、`/placement`、`/about` | 「尚未開放」暫時頁 | 無，返回鍵 |
| 其他 | 導回 `/` | — |

## 文案

`app/src/i18n/zh-TW.json`，頂層 `"_status": "draft-pending-G3"`。key 規則同 TASK-4：`<畫面>.<區塊>.<用途>`；頂層為 `common`、`nav`、`system`、`home`、`course`、`words`、`settings`、`clearData`、`download`、`install`、`stub`；參數 `{name}`。讀取：`t(key, params)`（`src/i18n/t.ts`），key 由 json 型別推導，寫錯編譯失敗。

## 資料來源與推導規則

- db 單例：`src/data/appDb.ts`（`export const db = createDb()`），TASK-20 改用此處。
- 待複習數＝`countDue`；新課暫停＝`getTodayQuota().paused`。
- 今日已複習＝今日（裝置時區）reviewLogs 中 `state !== New` 的筆數；複習總數＝已複習＋待複習。
- 今日新課＝courseProgress 中 `completedAt` 落在今日的筆數，目標 1。
- 目前級距（D3）：沒有任何 courseProgress 也沒有單字＝「第一次開啟」；否則取最後完成的那一課（`completedAt` 最大）的級距；都沒有則 A1。正式欄位留給 TASK-17。
- 下一課：目前級距課綱順序中第一個未完成的小課；標示＝單元名＋單元內序號＋「新字 N」（D4，第二行標題省略＝設計偏差）。
- 時間估算（佔位，交 G3）：複習每字 15 秒、無條件進位到分鐘；每課 5 分鐘（規格 §8）。
- 多益對照（佔位，交 G3）：取 ETS 聽力門檻 A1 60、A2 110、B1 275、B2 400、C1 490。
- 熟悉度（D6）：陌生＝New 或 Relearning；熟悉＝Review 且 stability ≥ 21 天；其餘＝學習中。
- 單字庫只顯示英文、只搜英文（D5，TASK-16 補中文＝設計偏差）。
- 外觀、字級（D7）：存 localStorage（讀寫包 try/catch），套到 `<html data-theme / data-text-size>`；不進同步表。
- 每日新字數（D8）：底部彈層 5／10／15／20／30，寫入 `saveSettings`；D7 共用同一彈層。

## 課綱取用

`import.meta.glob('../../../content/curriculum/{a1,a2,b1,b2,c1}.json', { query: '?url', import: 'default' })` 產生獨立 json 資產、執行期 fetch。資料檔不併進 AGPL 程式碼 bundle（data 授權分界），並由 PWA 預快取。

## 離線

- 預快取：js、css、html、svg、png、json（課綱）。
- 字體 woff2：runtime CacheFirst（不預快取）。
- `navigateFallback: index.html`。
- 離線提示條：外框頁首下方，依 `navigator.onLine`＋online／offline 事件。

## 受測 seam（寫死）

| Stage | seam | 測試 |
|---|---|---|
| 1 | `t(key, params?)`（`src/i18n/t.ts`） | `t.test.ts`：參數替換、`_status` 存在、json 內所有字串無未替換以外的英文 UI 字 |
| 1 | `<App />` 依 `location.pathname` 渲染；底部導覽 `nav` 內三連結（`aria-current="page"`） | `App.test.tsx` |
| 2 | `buildHomeModel(input: HomeInput): HomeModel`（`src/screens/home/homeModel.ts`，純函式） | `homeModel.test.ts`：s01 四態字面值 |
| 2 | `loadHomeInput(db, curriculum, nowMs, timeZone): Promise<HomeInput>` | `homeModel.test.ts`（fake-indexeddb） |
| 2 | `currentLevel(progress)`、`nextLesson(level: LevelDoc, completedIds: Set<string>)`、`lessonLabel`（`src/curriculum/curriculum.ts`） | `curriculum.test.ts`：真課綱檔字面值 |
| 3 | `familiarityOf(word)`、`filterWords(words, filter, nowMs)`、`dueLabel(due, nowMs, timeZone)`（`src/screens/words/wordsModel.ts`） | `wordsModel.test.ts` |
| 3 | `exportData(db)`、`clearLocalData(db)`（`src/data/localData.ts`） | `localData.test.ts`（fake-indexeddb） |
| 3 | `DownloadStatus` 型別＋`<DownloadProgress status />`（`src/download/`） | 四態元件測試 |
| 4 | `useInstallPrompt(win)`（`src/shell/installPrompt.ts`） | 合成 beforeinstallprompt；iOS 說明分支；standalone 不顯示 |
| 4 | e2e `shell.spec.ts`（AC#4）、`offline.spec.ts`（AC#3，只在 chromium） | Playwright |
| 5 | e2e `visual-smoke.spec.ts`（AC#2）：兩引擎各狀態 attach 截圖、06 三件套、英文字串掃描（排除 `[lang=en]`；白名單 LinguaApp、OpenRouter、A1–C1、MB、WebGPU、AI（設計稿「AI 批改」）、Safari（iOS 加入主畫面說明））  | Playwright |

## 埠

`playwright.config.ts` 以 `E2E_PORT` 改埠（與 TASK-20 合併後統一用 main 的變數名，預設 5288 不變）；本卡跑 5302（dev 5301）。

## 設計偏差（實作中持續補，Stage 5 彙整成差異清單）

| # | 偏差 | 理由 |
|---|---|---|
| 1 | 安裝提示卡片（設計稿無） | D2 |
| 2 | 下一課只顯示「單元名＋序號」，無小課標題 | D4：課綱無小課標題 |
| 3 | 單字庫無中文釋義、搜尋只比對英文 | D5：字典屬 TASK-16 |
| 4 | 課程彈層不顯示題型數（聽 2／說 2…） | 需每課題數資料：題庫屬 TASK-8、題型組課屬 TASK-12，尚無資料 |
| 5 | 「開始」類按鈕導到暫時頁 | 小課／複習／分級屬 TASK-17／18 |
| 6 | 課程地圖小課列顯示「第 N 課」，展開單元列出全部小課（設計為「1　自我介紹與部門」＋「5–8 展開」） | D4：無小課標題；每單元最多 10 課，全列不需二次展開 |
| 7 | 離線時下一課小卡不改成「已下載・可離線上課」 | 「已下載」概念屬題庫下載（尚無）；離線提示條已涵蓋 |
| 8 | tokens.css 字體堆疊前置 `… Variable` 字族名 | @fontsource-variable 註冊的字族名帶 Variable 後綴，不加則自 host 字體不生效 |
| 9 | 小課詳情彈層的拖曳關閉只在把手區 | 避免與彈層內捲動衝突；點遮罩、Esc 為替代方式 |
| 10 | 單字庫搜尋框寫「搜尋英文單字」（設計「搜尋英文或中文」） | D5：中文釋義屬 TASK-16，提示不可承諾做不到的事 |
| 11 | 單字庫排序：依到期時間（最急在前），未開始學的新字排最後、標「新字」 | 設計示意未定排序；新字無到期日 |
| 12 | 單字庫一次畫 50 筆、捲到底再補 | 單字池上限數千字；設計未畫分頁，不加分頁 UI |
| 13 | 設定頁語音辨識模型顯示「下載」（設計 s11 預設為「已下載」） | 下載狀態只有骨架、一律回報未下載；TASK-14 接真狀態 |
| 14 | OpenRouter 授權／貼金鑰、發音、模型下載、隱私授權列導到「尚未開放」暫時頁 | 分屬 TASK-15／13／14／21 |
| 15 | 清除資料後整頁重新載入回首頁，並一併清掉外觀與字級偏好 | 資料庫刪除後需重開連線；文案「設定都會刪除」涵蓋偏好 |
| 16 | 危險按鈕停用態用灰底實心（照 s13 畫面），不照 components.md §1「框線與字改灰」 | 執行長裁示（2026-10-02）：以 s13 畫面為準——創辦人 G2 圈選的是畫面，components.md 文字落後 |
| 17 | 匯出格式：`linguaapp-YYYY-MM-DD.json`，含五張學習資料表、schemaVersion、exportedAt | 設計未定格式；同步內部表（TASK-20）不匯出 |
| 18 | 首頁離線狀態保留「今天已完成」卡（設計 s01 離線示意沒畫） | 離線不影響本機資料與今日進度；提示條已表達離線 |
| 19 | 展開中的單元標題列右側多一個向下箭頭（設計只有「3／8 課」） | 單元可收合，需要可見的收合提示（收合時為向右箭頭，與設計一致） |
| 20 | 單字庫搜尋或篩選無結果時顯示「沒有符合條件的單字」（設計未畫） | 無結果時需要回饋，否則像載入失敗；用空狀態的次要文字樣式 |
| 21 | 「用 OpenRouter 帳號一鍵授權」在 320 寬或 375 特大字級折兩行（置中、text-balance 不留孤字）；全寬按鈕左右內距 16px（設計 `.btn` 無內距） | 走查 P1-2／P2：文案 G3 才定稿，不改字；內距只在折行時可見。設定列只在大／特大字級允許折行 |
| 22 | 清除失敗只顯示通用文案「清除失敗，請關閉其他分頁後再試一次」（佔位，交 G3），原始錯誤只進 console | 走查 P1-1：Dexie 原始錯誤是英文且使用者無法處理 |
