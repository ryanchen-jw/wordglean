# 先紅後綠與突變紀錄（TASK-10）

## AC#1 FSRS 封裝（Stage 1）
- 紅：`npx vitest run src/srs/scheduler.test.ts`（尚無 scheduler.ts）→ `Test Files 1 failed`，模組不存在、no tests。
- 綠：實作後 `Tests 11 passed (11)`，見 `ac1-green.log`。
- 突變（鑑別力）：learning_steps 改 `['1m','5m']`、relearning 改 `['5m']` → 2 failed（10 分鐘學習步驟、10 分鐘重學兩條）；已還原。
- 探測：`enable_fuzz: true` 時 replay 等值測試仍綠（本例 5 次作答）——fuzz 種子由作答時間＋卡片狀態決定，重播可重現；僅單一樣本，非定論，TASK-20 參考。

## AC#2 換日與新字額度（Stage 2）
- 紅：`npx vitest run src/srs/daily.test.ts`（尚無 daily.ts）→ `Cannot find module './daily'`、1 failed。
- 綠：`Tests 12 passed (12)`，TZ=UTC 與 TZ=Asia/Taipei 各跑一次，見 `ac2-daily-TZ-*.log`。
- 突變：暫停判斷 `>` 改 `>=` → 1 failed（門檻邊界）；日界夏令校正拿掉 → 原測試全綠（未鑑別），補 Australia/Sydney 夏令開始日測試後 → 1 failed；皆已還原。
- 跨時區「今日已出新字」計數（Asia/Taipei vs America/Bogota 同一批紀錄）在 Stage 4 repo 測試覆蓋。

## AC#3 DB migration（Stage 3）
- 紅：`npx vitest run src/data/db.test.ts`（尚無 db.ts）→ `Cannot find module './db'`、1 failed。
- 綠：`Tests 4 passed (4)`，見 `ac3-green.log`。v1 以凍結 fixture 寫入五張表 → 測試專用 v2（新增複合索引＋新表＋upgrade 改既有列）開啟 → 全表逐列相等。
- 突變：正式 v1 wordPool 少一個索引 → 凍結守衛 1 failed；createDb 不套 upgrade → 升版測試 1 failed；皆已還原。

## AC#4 收藏不重複建卡＋AC#2 跨時區今日額度（Stage 4）
- 紅：`npx vitest run src/data/repo.test.ts`（尚無 repo.ts）→ `Cannot find module './repo'`、1 failed。
- 綠：`Tests 12 passed (12)`，見 `ac4-ac2-repo-green.log`。
- 突變：入池一律新建卡（覆蓋既有）→ 4 failed；待複習數含新字 → 1 failed；今日額度改用 UTC 換日 → 1 failed（台北案例）；皆已還原。

## Stage 5 全套
- `npm run lint`：ESLint 無錯、Prettier 全符合；`npm run typecheck`（tsc -b）無錯；`npm run build` 成功。
- `npm test`：TZ=UTC 與 TZ=Asia/Taipei 各一次，皆 `Test Files 5 passed (5)`、`Tests 40 passed (40)`（含骨架既有 App.test.tsx）。
- 冒煙：本卡無 UI 入口；repo 測試即以公開 API 經真 Dexie（fake-indexeddb）跑完入池→作答→額度整條流程。真瀏覽器 IndexedDB 依 Round 1 風險 3 留待 TASK-11 以 Playwright webkit 補驗。
