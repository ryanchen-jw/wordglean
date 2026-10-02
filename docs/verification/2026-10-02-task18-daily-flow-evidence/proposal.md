# TASK-18 每日動線與課程流程——proposal

> Round 1 計畫經執行長核准（2026-10-02，D1–D7 裁示見下）＝本檔簽核。實作分支 `worktree-task-18-daily-flow`，基底 main 54301fc。

## 範圍

- 做：今日學習組裝（到期複習依 due 排序＋一輪上限、接續下一小課、受每日新字上限與暫停門檻約束）；小課題型穿插；能力偵測介面＋替代規則（stub 能力，TASK-13～15 併入後接真）；`/review` 複習流程（沿用 TASK-12 單字卡畫面）；完成頁「再複習一次剛學的字」；結算後同步（`AuthApi.requestSync`＋共用 session 單例）。
- 不做：遊戲化；聽說寫題型畫面（TASK-13～15）；收藏字的複習卡（TASK-16 併入後再接，D7）；課程地圖鎖課（D1）。

## 執行長裁示（Round 1）

| #   | 裁示                                                                                                                                                  |
| --- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| D1  | 課程地圖照設計 s02 不鎖課；「同級依序」只用來決定推薦的下一課（`nextLesson`，已在 main）。記偏差 #1。                                                 |
| D2  | 新增共用 session 單例（設定頁與結算後同步共用同一個 AuthApi）；`AuthApi` 加 `requestSync`；`AccountEntry` 小改；TASK-20 測試維持綠。                  |
| D3  | 今日額度 >0 就照常出一課（可能超出最多一課的字數）；每日新字上限 0 或暫停時不出課。                                                                   |
| D4  | 一輪複習上限＝暫停門檻（每日新字 × 暫停倍數，預設 100）。                                                                                             |
| D5  | 「再複習一次剛學的字」只練習、不寫排程。                                                                                                              |
| D6  | 從今日動線進來：複習完直接接下一課；單獨進複習：顯示完成卡（記偏差）。                                                                                |
| D7  | TASK-16 尚未在 main：Stage 0–1 不改 `repo.ts`／`countDue` 的 `inPool`；複習佇列先只取有課程來源的字。Stage 2 開工前執行長告知 main 是否已含 TASK-16。 |

## 受測 seam（Stage 1 寫死，測試只打這些）

| 檔                                    | 公開介面                                                                                                                                          | 說明                                                                                 |
| ------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------ |
| `app/src/today/plan.ts`               | `assembleToday({ due, quota, nextLessonId, reviewCap }) → TodayPlan`；`reviewCapOf(settings)`；`loadTodayPlan(db, nowMs, timeZone, nextLessonId)` | 純函式組裝＋從本機資料庫取輸入                                                       |
| `app/src/lesson/capabilities.ts`      | `Capabilities`、`CAPABILITY_RULES`（替代規則設定）、`applyCapabilities(doc, caps) → { doc, changes }`、`detectCapabilities()`                     | 能力不足時換題型、改自評或略過                                                       |
| `app/src/lesson/assemble.ts`          | `interleave(steps) → Step[]`；`buildLessonQueue(doc, registry, caps) → { steps, skipped, changes }`                                               | 穿插＋能力替代＋既有 `buildQueue`                                                    |
| `app/src/review/session.ts`           | `loadReviewCards(db, wordIds, loadItems) → { cards, missing }`；`lessonWordCards(doc)`；`answerReview(db, card, input, nowMs, { practice })`      | 複習卡片（取自原課題目檔）與作答寫入                                                 |
| `app/src/today/plan.ts`（Stage 3 增） | `loadNextLessonId(db, loadLevel)`                                                                                                                 | 今日動線的推薦下一課，與首頁同規則（目前級距中第一個未完成的課）                     |
| `app/src/auth/sessionHandle.ts`       | `getAuthSession(config, db)`（共用單例，失敗後可重試）；`syncAfterSettle(config, db)`                                                             | Stage 2（D2）：結算後同步；沒設定登入不載入 Supabase。`AuthApi` 新增 `requestSync()` |

### 規則

- **TodayPlan**：`{ reviews: string[]（wordId，依 due 由早到晚、最多 reviewCap 個）, reviewOverflow: number, lessonId: string | null, lessonBlocked: 'paused' | 'quota' | 'levelDone' | null }`。
  - 暫停 → `lessonId=null`、`lessonBlocked='paused'`；未暫停但額度 0 → `'quota'`；沒有下一課 → `'levelDone'`；其餘出 `nextLessonId`（D3）。暫停優先於額度判斷。
  - 同 due 以 wordId 排序（結果固定）。
- **一輪上限**：`reviewCapOf = dailyNewLimit × pauseMultiplier`；乘積為 0（每日新字設 0）時退回預設門檻 100，避免「一題都不能複習」（偏差 #2，D4 的補充）。
- **到期字**：`state !== New`、`due ≤ now`、且 `courseRefs` 非空（D7：先只取課程來源）。
- **能力替代**（`CAPABILITY_RULES`）：

  | 題型                     | 需要   | 不可用時                                                                      |
  | ------------------------ | ------ | ----------------------------------------------------------------------------- |
  | listenType、listenChoice | tts    | 略過                                                                          |
  | shadowing                | stt    | 改成 listenType（欄位相同：`sentenceEn`／`sentenceZh`），再套 listenType 規則 |
  | translate、makeSentence  | llmKey | 標 `selfCheck: true`（對照參考答案自評，規格 §6；畫面屬 TASK-15）             |

  讀類題不需任何能力。替代後題型仍未登記（畫面未做）就照 `buildQueue` 略過，不會卡住。

- **能力偵測（stub）**：`tts`＝瀏覽器有 `speechSynthesis`；`stt`、`llmKey` 先固定 `false`，TASK-14／15 併入後接真。
- **穿插**：單字卡先出（照題目檔順序，先學字）；其餘題目依「聽→說→讀→寫」輪流各出一題（同組內照題目檔順序），閱讀的多個小題相連不拆開。
- **複習作答**：不寫 `lessonRuns`、不加課程來源；正式複習＝`recordReview`（評分照 `gradeFor`）；練習（D5）不寫任何資料。
- **複習卡片來源**：依字的 `courseRefs` 載入原課題目檔，取 `word` 相同（小寫）的單字卡；找不到的字列入 `missing`、不出題（不卡住）。

## Fixture

`app/src/lesson/fixtures/items/a1-u01-l02.json`：TASK-8 已合格題目檔原文（分支 `worktree-task-8-item-bank` commit f6b2984 `content/items/a1/a1-u01-l02.json`），供 e2e「第二天接下一課」。

## Stage 計畫

| Stage | 內容                                                                                                                                        | 狀態 |
| ----- | ------------------------------------------------------------------------------------------------------------------------------------------- | ---- |
| 0     | 本 proposal                                                                                                                                 | ✅   |
| 1     | 純邏輯＋AC#1（組裝四情境）＋AC#4 引擎層（三能力皆不可用仍完成一課）；能力介面與替代規則；穿插；複習卡片與作答                               | ✅   |
| 2     | 同步接線（D2）＋AC#2 14 天模擬整合測試；每日新字 0 不顯示新課暫停（執行長裁示，偏差 #3）                                                    | ✅   |
| 3     | 畫面：`/review`、今日動線、完成頁接線、LessonScreen 改用 `buildLessonQueue`、i18n；`inPool` 與收藏字複習卡待 TASK-16 併入後 merge main 補上 | ✅   |
| 4     | E2E（AC#3、AC#4）＋06 視覺 smoke＋e2e:sync＋偏差清單（E2E_PORT=5372、dev 5371、workers=1）                                                  | ✅   |

## 設計偏差

| #   | 偏差                                                                                                                       | 理由                                                                                              |
| --- | -------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| 1   | 課程地圖不鎖課（卡片代決「同級依序解鎖」未採）                                                                             | D1：創辦人 G2 圈過的設計 s02 優先                                                                 |
| 2   | 每日新字設 0 時，一輪複習上限退回 100                                                                                      | 暫停門檻＝0 會讓複習一題都出不來，違反「不可讓使用者卡住」                                        |
| 3   | 每日新字設 0 時不算「新課暫停」（`newWordQuota`：上限 0＝使用者不要新字）                                                  | 執行長 Stage 1 審查裁示：原行為任一到期即顯示「新課暫停」，與使用者設定意圖不符；首頁照常顯示複習 |
| 4   | 單獨進複習做完：整頁完成卡「複習完成」＋「這一輪 N 個字・答對 M 個」＋「回到今天」；沒有到期時卡內寫「目前沒有到期的單字」 | D6：設計未畫，沿用 s14 組合；文案佔位、G3 審                                                      |
| 5   | 複習按 ✕ 直接離開、不跳確認框                                                                                              | 每題作答當下已寫入排程，離開不會失去進度；s12 是小課專用                                          |
| 6   | 「再複習一次剛學的字」與一般複習共用畫面與完成卡（標題同為「複習完成」）                                                   | D5 只練習；設計只畫按鈕                                                                           |

## 路由（Stage 3）

- `/review`：到期複習（首頁「到期複習」小卡）。
- `/review?flow=today`：首頁「開始今天的學習／開始複習」——有到期先複習，做完後若今日組裝出得了課就直接換到 `/lesson/:id`（replace），否則顯示完成卡；沒有到期直接進課。沒有到期且沒有下一課時首頁原本就導到這裡，會顯示完成卡。
- `/review?lesson=<id>`：完成頁「再複習一次剛學的字」，只練習（D5）。
- `LessonScreen` 改用 `buildLessonQueue(doc, registry, capabilities ?? detectCapabilities())`；目前只有讀類題畫面，出題順序與 TASK-12 相同。

## 驗證（Stage 4，2026-10-02 本機實跑，E2E_PORT=5372、workers=1）

- 單元：`npm test`（組裝四情境 AC#1、14 天模擬 AC#2、能力替代與穿插 AC#4 引擎層、複習畫面、同步接線）。
- E2E（兩個手機 project）：`e2e/today.spec.ts`（AC#3 今日動線、AC#4 三能力皆不可用、練習不影響今日複習數）、`e2e/review-visual.spec.ts`（06 視覺 smoke：複習出題／答對／答錯／完成卡／空狀態／練習、light／dark 狀態色 computed 斷言、320 標準／320 特大／375 特大）；全套回歸 chromium 46 passed、webkit 44 passed＋2 skipped（WebKit 離線重載已知限制）。
- e2e:sync（本機 Supabase）：`e2e-sync/settle-sync.spec.ts`（登入後重開 App、不經設定頁直接上課，結算後佇列清空、雲端有課程進度／8 字／8 筆作答）＋既有 `sync.spec`、`auth-visual.spec`，14 passed；反證：拿掉 onSettle 接線後同一測試紅（佇列留 25 筆）。
- 看報告：`npx playwright show-report playwright-report/task18`（本地、未上雲）。

## TASK-16 併入後補上（merge main 7874889）

- 到期字改以 `inPool`（課程來源或收藏）過濾，取代 D7 期間的「只取課程來源」。
- 收藏字（沒有課程來源）的複習卡：`app/src/review/favoriteCard.ts`——中文取單字總表、去掉開頭詞性；3 個干擾項取同級同詞性（不足用同級其他詞性），依字雜湊挑選、每次相同；`loadReviewCards` 第四參數 `loadLex` 只在有字找不到課程卡時才載入。課程卡優先。
- 偏差 #7：收藏字複習卡沒有例句——不顯示「看例句提示」、回饋只有釋義（字典不含例句；`WordCardView` 在 `exampleEn` 為空時省略）。
- 最終回歸（merge main 5b96f3d 後，HEAD 616427e）：unit 455 passed／3 skipped；e2e chromium 57 passed／2 skipped、webkit 55 passed／4 skipped（皆為既有的條件略過）；e2e:sync 14 passed。
- merge main 7033aac（TASK-17）後：`loadNextLessonId` 改為設定的 `cefrLevel` 優先、無值退回課程進度推導、再退回 A1（與首頁同規則）。回歸（HEAD 803bfc0）：unit 485 passed／3 skipped（連跑兩次）；e2e chromium 66 passed／2 skipped、webkit 64 passed／4 skipped；lint／typecheck／build 綠。sync／auth 無新衝突，e2e:sync 未重跑（執行長裁示可免）。
