# TASK-12 題型引擎＋讀類題型——proposal

> Round 1 計畫經執行長核准（2026-10-02，D1–D5 裁示見下）＝本檔簽核。實作分支 `worktree-task-12-read-items`，基底 main 23e3180。

## 範圍

- 做：題型引擎（題目佇列、作答紀錄、計分、FSRS 寫入、中途離開可續、結算）；讀類三題型——單字卡（四選一釋義，s07）、選擇題（s05）、閱讀理解（s05）；小課外框（s03：✕、進度）、離開確認（s12）、小課完成頁（s14）；`/lesson/:id` 接線。
- 不做：聽說寫題型（TASK-13～15，引擎可註冊、目前略過並記錄）；點字查義（TASK-16，本卡留 `<EnglishText>` seam）；今日組裝、題型穿插、替代題、`/review`（TASK-18）；同步接線（TASK-18，本卡只呼叫可注入的 `onSettle`）。

## 執行長裁示（Round 1）

| # | 裁示 |
|---|---|
| D1 | 題目格式由 TASK-8 擴充：`wordCard` 加 `glossZh`（本課語境的繁中釋義）、`distractorsZh`（3 個繁中干擾釋義）；`mcq` 加選填 `optionGlossZh`（各選項字的繁中釋義）。`ipa`、`toeic` 不進題目檔，App 從字典（TASK-16）與 lexicon 取。本卡照新格式讀；樣本課 fixture 手補欄位、標成偏差。 |
| D2 | 只有單字卡寫入 FSRS；選擇題、閱讀只計分。 |
| D3 | 本卡：小課外框、完成頁、`completeLesson`、新字入池。TASK-18：今日組裝、穿插、替代題、`/review`。 |
| D4 | Dexie v3 新表 `lessonRuns`（本機、不同步、不匯出；清除資料＝刪庫、登出＝`flushAndClear` 清全部表，一併清）。版號協調：TASK-17 不升版，TASK-16 若要升版用 v4。 |
| D5 | E2E 建置以旗標把題目來源換成樣本課 fixture；正式建置只讀 `content/items`。 |

## 受測 seam（Stage 1 寫死，測試只打這些）

`app/src/lesson/`：

| 檔 | 公開介面 | 說明 |
|---|---|---|
| `items.ts` | `LessonItemsDoc`、`LessonItem`、`WordCardItem`、`McqItem`、`ReadingItem` 型別 | 對應 `content/schema/lesson-items.schema.json`（TASK-8）＋D1 擴充欄位 |
| `queue.ts` | `buildQueue(doc, registry) → { steps, skipped }`；`createRegistry(defs)`；`READ_TYPES` | 題目 → 作答步驟；未註冊題型 `skipped`（reason `unsupported`），欄位不全 `skipped`（reason `invalid`） |
| `grade.ts` | `gradeFor({ correct, elapsedMs, usedHint }) → Grade` | 答錯＝Again；答對且（`elapsedMs > 15000` 或用了提示）＝Hard；其餘答對＝Good；不出 Easy |
| `run.ts` | `createRun`、`withAnswer`、`advance`、`currentKey`、`isComplete`、`score`、`matchesQueue` | 純函式的小課進度狀態 |
| `session.ts` | `startOrResume(db, lessonId, steps, now)`、`answerStep(db, run, step, input, now)`、`continueRun(db, run, now)`、`settleLesson(db, run, steps, { now, onSettle })` | 寫 IndexedDB：作答紀錄＋FSRS 同一交易；結算寫 `courseProgress`、清 run、呼叫 `onSettle` |

`app/src/data/repo.ts` 新增 `completeLesson(db, lessonId, now)`（`completedAt` 保留第一次、`updatedAt` 更新、記同步佇列；與 TASK-20 合併規則 min/max 一致）。

### 規則

- **步驟**：單字卡、選擇題各 1 步；閱讀每小題 1 步（key `<題號>#<索引>`，與 TASK-8 判題的小題命名一致）。進度條與完成頁題數都以步驟計。
- **單字卡選項順序**：`glossZh` 插入 `distractorsZh` 中，位置由題號雜湊決定——同一題每次（含續作）順序相同。
- **FSRS 寫入時機**：單字卡作答當下，於同一交易內 `addFromCourse`（新字入池）＋`recordReview`＋存 run，避免「已寫評分、run 沒存」的重複寫入。
- **續作**：每次作答與按「繼續」後存 run；重開同一課時若 run 的步驟 key 與目前題目一致就接續（目前步驟已作答則直接跳下一題），不一致（題目更新）就重新開始。
- **結算**：全部步驟作答後才可結算；回傳 `{ lessonId, total, correct, newWords, wrongKeys }`。

## Fixture

`app/src/lesson/fixtures/items/{a1-u01-l01,b1-u01-l01}.json`：TASK-8 手寫樣本課（分支 `worktree-task-8-item-bank` commit 198d5fa `content/test/fixtures/items/`）原文，**手補** D1 新欄位（`glossZh`、`distractorsZh`、`optionGlossZh`）。來源說明見同目錄 `README.md`。

## Stage 計畫

| Stage | 內容 | 狀態 |
|---|---|---|
| 0 | 本 proposal | ✅ |
| 1 | 純邏輯引擎＋AC#1 單元測試（佇列、計分、FSRS 寫入、中途離開可續）；Dexie v3；`completeLesson` | ✅ 818f8f4 |
| 2 | 畫面（外框、三題型、回饋、s12、s14）、題目載入（`import.meta.glob ?url`＋E2E 旗標）、`/lesson/:id`、i18n | ✅ 89cfe59 |
| 3 | E2E 兩個手機 project（AC#2）＋視覺 smoke（AC#3）＋設計偏差清單 | ✅ |
| 4 | 收尾、文件 | 併入 Stage 3 |

### Stage 2 已知介面（TASK-16 定案，執行長轉交）

`app/src/dict/EnglishText.tsx`：props `text: string`、`disabled?: ReadonlySet<string> | 'all'`（小寫比對；作答前會洩漏答案的字）、`onLookup?: (word: string) => void`（查字次數只記錄、不影響評分）、`className?: string`；App 根層掛 `<DictionaryProvider>`。本卡先做同名同 props 的純文字 stub，TASK-16 併入後替換。

## 設計偏差（對照 docs/design/v1.0 s03／s05／s07／s12／s14）

| # | 偏差 | 理由 |
|---|---|---|
| 1 | s12 文案改為「可接續」的意思（設計：離開後從第 1 題重新開始） | AC#1「中途離開可續」優先（執行長代決），G3 再審 |
| 2 | 選擇題答錯回饋：有 `optionGlossZh` 時照設計「postpone＝延後；promote＝推廣、升遷」，沒有時改顯示補好答案的整句＋中譯 | `optionGlossZh` 為選填（D1） |
| 3 | s14「明天開始複習」「答錯的 N 題已排進明天的複習」照佔位文案，但實際：新字學習步驟 1／10 分鐘、只有單字卡進排程 | 文案 G3 審 |
| 4 | 樣本課 fixture 的 `glossZh`／`distractorsZh`／`optionGlossZh` 為手補 | D1 新欄位尚未由 TASK-8 產出 |
| 5 | s07 不顯示音標、詞性、級距與「多益常考」標籤 | 資料來自字典與 lexicon（D1：不進題目檔），屬 TASK-16；接上後補 |
| 6 | s07「看例句提示」的狀態設計未畫：在選項上方顯示提示條（`hint` 色）＋英文例句（不給中譯，中譯會直接洩漏意思）；用過後提示鈕消失 | 設計只畫按鈕；評分照裁示記 Hard |
| 7 | s07 發音鈕用手機內建聲音（`speechSynthesis`），瀏覽器不支援時隱藏 | Kokoro 與退回邏輯屬 TASK-13（`lesson/speak.ts` 為替換點） |
| 8 | 進度文字為「n／總題數」，不是 s07 的「複習 n／24」 | 本卡只做小課；複習流程屬 TASK-18 |
| 9 | 閱讀：「看中文翻譯」展開後中譯接在短文下方（同一張卡內捲動），按鈕改為「收起翻譯」 | 設計未畫展開狀態；「收起中文翻譯」在 320 特大字級會折行，改短 |
| 10 | 閱讀：不顯示「英文字都可以點，查看意思」提示小字 | 點字查義屬 TASK-16，現在顯示會承諾做不到的事 |
| 11 | 閱讀與選擇題答對的回饋條設計未畫：閱讀＝「正確」／「答案是 X：選項」；選擇題答對＝「正確」＋整句＋中譯 | 依 s03 聽音選答答對樣式與元件規格組合 |
| 12 | s14 副標為「單元名 序號」（設計「辦公室 3｜會議改期」） | 課綱沒有小課標題資料（TASK-7） |
| 13 | s14「再複習一次剛學的字」導到 `/review`（尚未開放頁） | 只複習本課新字屬 TASK-18 |
| 14 | 整課載入失敗（沒有題目檔或沒有可作答的題目）：卡片內 ⓘ「這一課載入失敗」＋「回到課程」 | 元件 §2 題目卡 error 樣式套到整課；單題欄位不全在出題前就略過，不需「換下一題」 |
| 15 | 中文內容（題目、選項、翻譯、例句中譯）裡的英文人名標 `lang="en"`，以英文字體顯示 | 讀屏念對；e2e 英文介面字串掃描以 lang 區分學習內容 |
| 16 | 閱讀題底部兩顆按鈕：左欄最少為按鈕文字寬（設計比例 1:1.4） | 320 特大字級下左鈕折行 |
| 17 | `e2e/measure.ts` 的英文白名單加入選項字母 A–D | 設計的選項字母標 |
| 18 | 閱讀「看中文翻譯」展開時，把譯文捲進短文卡的可視範圍（英文短文隨之捲上去；收起後可自行捲回） | 走查 P1：譯文接在限高 220px 卡片底部，原本展開後看不到；最小可逆修法，保留設計的「短文卡限高、選項永遠看得到」 |
| 19 | 最後一題已作答、未按「繼續」就按 ✕：確認框改說「這一課已經做完了，離開後會記為完成。」，按「離開」即結算（記完成、清進度、呼叫 onSettle）再返回 | 走查 P2：原文案說「下次從第 12 題繼續」但重開會直接結算；佔位文案，G3 再審 |

## 驗證

- 單元：`src/lesson/*.test.ts`（佇列、評分、進度、session＋FSRS 寫入、續作、結算）、`src/screens/lesson/LessonScreen.test.tsx`（三題型互動、回饋文案、評分、離開確認、續作、完成頁、載入失敗）、`src/data/{db,repo}.test.ts`（v3、`completeLesson`）。
- E2E（`E2E_PORT=5312`，workers=1，兩個手機 project）：`e2e/lesson.spec.ts`（課程地圖進入→三題型→完成頁→回到今天→單字庫 8 字；✕ 離開後接續；答完未按繼續就重整）、`e2e/lesson-visual.spec.ts`（12 個狀態截圖＋06 三件套＋英文字串＋body 色；320 標準／320 特大／375 特大的溢出、折行、子元素溢出、確認框在視窗內）。
- 看報告：`npx playwright show-report playwright-report/lesson`（本地、未上雲）。
