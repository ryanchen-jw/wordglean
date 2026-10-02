# TASK-20 登入與同步——proposal（SDD）

> 執行長 2026-10-02 核准 Round 1 計畫即為簽核。本檔寫死受測 seam；實作變更 seam 須先回報。

## 範圍

規格 §3：不登入可完整使用；Google＋Email 驗證碼（Supabase Auth）；登入後本機資料合併到雲端、跨裝置同步；未設定 Supabase 時 App 照常可用。不做：真實 Google OAuth client（G6，TASK-23 補驗）、TASK-11 外殼、正式文案（TASK-4）。

## 合併規則（純函式，`app/src/sync/merge.ts`）

| 資料 | 規則 |
|---|---|
| review_logs | 以 `id` 取聯集去重；輸出依 (`review`, `id`) 排序 |
| 單字池 FSRS 欄位 | 該字合併後的 review log 依 (`review`, `id`) 排序後以 `replay()`（ts-fsrs `reschedule`）重播得出；無紀錄則保留 `addedAt` 較早那筆的欄位 |
| 單字池 courseRefs／addedAt | courseRefs 取聯集並排序；addedAt 取較早 |
| 收藏 favoritedAt | 取聯集（任一側非 null 即收藏，值取較早）。遠端 `deleted_at` 非 null 由轉接層轉成 `favoritedAt: null`，所以本機有收藏時以本機為準。**TASK-16 起改為最後修改者為準**（見已知限制對應條） |
| 設定 | `updatedAt` 晚者勝；同時間取鍵排序後穩定序列化（JSON）字串較大者，與參數順序無關 |
| 課程進度 | 以 `lessonId` 合併；completedAt 取較早、updatedAt 取較晚 |
| 跟讀修正 | 以 `id` 取聯集 |

輸出一律依主鍵排序，使 `merge(a,b)` 與 `merge(b,a)` 相同、重跑逐位元一致。

## 受測 seam（寫死）

| Stage | seam | 測試 |
|---|---|---|
| 1 | `mergeSnapshots(a: SyncSnapshot, b: SyncSnapshot): SyncSnapshot`（`app/src/sync/merge.ts`）；`SyncSnapshot = { settings: Settings \| null; words: PoolWord[]; reviewLogs: ReviewLogRow[]; courseProgress: CourseProgress[]; speechCorrections: SpeechCorrection[] }`，型別沿用 `data/db.ts` | `merge.test.ts`：AC#1、AC#4 |
| 2 | `createSyncEngine({ db, remote })` → `{ sync(), requestSync(), flushAndClear(): Promise<boolean> }`；`startAutoSync(engine, window)`；`RemoteStore` 介面（`userId()`／`pull(cursor)`／`push(changes)`，`app/src/sync/remote.ts`），單元測試注入假 remote；Supabase 實作 `createSupabaseRemote(client)` 另有本機整合測試（`supabaseRemote.it.test.ts`，設環境變數才跑） | `engine.test.ts`、`rows.test.ts`、`supabaseRemote.it.test.ts` |
| 3 | `authConfigFromEnv(env)` → `AuthConfig \| null`（原訂名 `isAuthConfigured`，改為回傳設定物件）；`<AccountEntry config db />` 可獨立掛載（db 由呼叫端傳入，TASK-11 接 AccountSection）；`<AccountPanel auth />` 以 `AuthApi` 注入；testid：`login-entry`、`login-email`、`login-send`、`login-code`、`login-verify`、`login-google`、`login-error`、`account-email`、`logout`、`logout-warning` | Vitest＋一般 e2e（AC#3）＋視覺 smoke（`npm run e2e:sync`） |
| 4 | 真入口：`npm run e2e:sync`（本機 Supabase、埠 5297／5298） | `e2e/sync.spec.ts`（AC#2） |

## 執行長裁示（2026-10-02 Round 1）

1. 登出：先推完佇列再清空本機；推不出去就警告、不清。
2. 拉取：新增 migration 給 `review_logs` 加 `inserted_at timestamptz not null default now()` 當游標，拉取時往前留重疊窗、以 id 去重；附 pgTAP；不改既有 migration。
3. 收藏：聯集；遠端墓碑但本機有收藏時以本機為準（見已知限制）。
4. 設計 token：登入元件用 Tailwind 最小樣式，尺寸照 `docs/design/v1.0/components.md` 按鈕規格（主要鈕高 52px、全寬、字重 700；文字鈕高 44px），標 `TODO(TASK-11 token)`；v1.0 進主線後由 TASK-11 接管。
5. AC#2 走獨立 `npm run e2e:sync` 本機跑、不進 CI；AC#3 留一般 e2e。

## fuzz 實驗（AC#4）

實驗結果（2026-10-02，ts-fsrs 5.4.2，`app/src/sync/merge.test.ts`「AC#4 實驗」）：

- ts-fsrs 的 fuzz 種子由 `DefaultInitSeedStrategy` 產生＝`${作答時間 ms}_${reps}_${difficulty×stability}`（`node_modules/ts-fsrs/dist/index.mjs`），不取系統時間或 Math.random。
- 8 次作答、跨 130 天的序列：fuzz 開啟時，逐次作答、重播、再重播三者的卡片完全相同；fuzz 開／關的 scheduled_days 確實不同（實驗不是空測）。
- 結論：fuzz 不破壞重播一致性。封裝仍維持 `enable_fuzz: false`（`srs/scheduler.ts`），不改既有行為；日後要開 fuzz 不必另設種子。
- 同毫秒的兩筆紀錄依 id 排序重播，與輸入順序無關；`merge(a,b)`、`merge(b,a)`、`merge(merge(a,b), a)` 序列化後逐位元相同。

## 換帳號行為（執行長 2026-10-02 驗收代決）

- 本機 `syncMeta.userId` 記錄本機資料已同步給哪個帳號。以**不同**帳號登入時，同步引擎丟 `AccountMismatchError`、不拉不推（本機資料與未推佇列都不會流到新帳號）；登入接線（`auth/session.ts`）隨即把新帳號登出，畫面顯示阻擋說明（`login-blocked`，佔位文案 `TODO(TASK-4 文案)`：請先用原帳號登入並登出，或到設定清除這支手機上的資料）。
- 從未同步過的訪客資料（`syncMeta.userId` 為空）：任何帳號首次登入照舊整份合併上雲。
- 原帳號登出（`flushAndClear` 成功）會清掉 `syncMeta`，之後即可改用其他帳號。
- 測試：`sync/engine.test.ts`（引擎拒絕、本機不動、訪客照常）、`auth/session.test.ts`（假 Supabase client：Y 被登出、未呼叫雲端）、`auth/AccountPanel.test.tsx`（說明顯示與消失）。

## 已知限制

- 重播一律用合併後設定的 `desiredRetention`；使用者中途改過保留率時，重播結果與當初逐次作答的結果不同。AC#1 只在固定保留率下斷言。
- ~~本機尚無「取消收藏」，故收藏只做聯集、遠端墓碑會被本機收藏覆寫回收藏；取消收藏功能出現後改為最後修改者為準。~~ **已解除（TASK-16 Stage 4，2026-10-02）**：本機單字新增 `favoriteUpdatedAt`（收藏／取消的最後修改時間，非索引欄、Dexie 不升版）；取消收藏推墓碑（`deleted_at`＝取消時間），`updated_at`＝修改時間；合併改為收藏狀態以最後修改者為準（同時間收藏勝、兩側都收藏取較早收藏時間）。沒有修改時間的舊資料仍退化為聯集。規則見 `app/src/sync/merge.ts` 的 `mergeFavorite`、`app/src/sync/rows.ts` 的 `favoriteRow`。
- 「每次結算後同步」目前無結算流程可掛，Stage 2 匯出 `requestSync()` 供 TASK-11／小課流程呼叫。
- 單字池的課程來源（courseRefs）以整列 upsert 推送：兩台裝置在「拉取→推送」之間的數百毫秒內同時推同一個字時，後推者可能蓋掉先推者新增的來源；下次任一側同步會因本機仍有聯集而補回，但可能暫時不一致。
- 雲端課程進度 completed_at 為空的列不帶回本機（本機只記已完成）。
- AC#2 的「學習」與「看到相同進度」：學習畫面待 TASK-11 之後，e2e 以建置期 `VITE_E2E_HOOKS=true` 才載入的 `src/testHooks.ts` 呼叫真實資料層函式並讀本機進度；登入、收信、驗證碼、同步、登出走真實 UI 與真實本機 Supabase。學習畫面上線後應改為由畫面操作與斷言。
- 換帳號被擋時，使用者要「到設定清除這支手機上的資料」：清除功能屬 TASK-11 設定頁（設計 v1.0 已有該確認框），本卡未實作。
