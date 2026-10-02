# supabase/

LinguaApp 的雲端同步層：PostgreSQL schema、Row Level Security、migrations。規格 §3：不登入也能完整使用，登入後才同步；伺服器不收錄音、不碰 OpenRouter 金鑰（`tests/database/schema_guard.test.sql` 守住）。時間規約見 `.claude/harness/09-timezone-convention.md`。

## 本機操作（repo 根目錄執行）

CLI 一律 `npx --yes supabase@2.118.0`（鎖版本、不全域安裝）。project_id `linguaapp`，埠段 55420–55429（API 55421、DB 55422）。目前只啟動 db／auth／rest，其餘服務在 `config.toml` 關閉（TASK-20 要收 Email OTP 時再開 `[local_smtp]`）。

| 動作 | 指令 |
|---|---|
| 啟動 | `npx --yes supabase@2.118.0 start` |
| 從零套用全部 migration | `npx --yes supabase@2.118.0 db reset` |
| pgTAP 測試 | `MSYS_NO_PATHCONV=1 npx --yes supabase@2.118.0 test db`（Git Bash 要加前綴，否則路徑會被改寫） |
| HTTP 真入口 smoke | `bash supabase/tests/smoke-rls-http.sh` |
| 停止（只停本專案） | `npx --yes supabase@2.118.0 stop` |

- 新增 migration：`npx --yes supabase@2.118.0 migration new <name>`；只能新增檔，不改已套用的檔。
- 新增表：必須同時寫 RLS policy，並更新 `tests/database/schema_guard.test.sql` 的 `tables_are` 與 `rls_isolation.test.sql`（守衛會擋未登記的表）。
- 本機 Docker 上可能有其他專案的容器：不用 `docker compose down`／`--remove-orphans`，只用上表的 `stop`。

## RLS 規則

每張表只給 `authenticated` 角色讀寫自己的列（`(select auth.uid()) = user_id`，profiles 用 `id`）；`anon` 沒有任何權限；`authenticated` 另收回 TRUNCATE（不受 RLS 管）、REFERENCES、TRIGGER。例外：
- `profiles`：只能 select／update，列由註冊觸發器 `on_auth_user_created` 建立、隨帳號刪除 cascade。
- `review_logs`：append-only，沒有 update（合併靠「聯集＋重播」，紀錄不可改寫）。

## 欄位對照表（app 本機資料層 TASK-10 ↔ 雲端）

型別換算：本機時間＝UTC epoch ms（number）↔ 雲端 `timestamptz`。寫入用 `new Date(ms).toISOString()`，讀回用 `Date.parse(s)`。timestamptz 精度是微秒，毫秒來回不失真。雲端每列另有 `user_id`（取自登入身分），本機沒有。FSRS 列舉照 ts-fsrs：state 0 New／1 Learning／2 Review／3 Relearning；rating 1 Again／2 Hard／3 Good／4 Easy。

| 本機 store.欄位 | 雲端 表.欄位 | 型別（雲端） | 備註 |
|---|---|---|---|
| settings.dailyNewLimit | settings.daily_new_limit | integer，預設 10 | 規格 §7 |
| settings.pauseMultiplier | settings.pause_multiplier | integer，預設 10 | TASK-10 代決值 |
| settings.desiredRetention | settings.desired_retention | double，預設 0.9 | 規格 §7 |
| settings.cefrLevel | settings.cefr_level | text A1–C1，可空 | TASK-17 目前級距；null＝未分級。本機無索引、Dexie 未升版，TASK-17 前的舊列缺此欄時讀為 null |
| settings.updatedAt | settings.updated_at | timestamptz | 由用戶端寫入，供最後修改時間合併；伺服器不覆寫 |
| wordPool.wordId（PK） | word_pool.word_id | text | PK＝(user_id, word_id)；暫定小寫 headword，待 TASK-6 |
| wordPool.state | word_pool.state | smallint 0–3 | |
| wordPool.due | word_pool.due | timestamptz | |
| wordPool.stability | word_pool.stability | double ≥0 | |
| wordPool.difficulty | word_pool.difficulty | double ≥0 | |
| wordPool.scheduledDays | word_pool.scheduled_days | integer ≥0 | |
| wordPool.learningSteps | word_pool.learning_steps | integer ≥0 | |
| wordPool.reps | word_pool.reps | integer ≥0 | |
| wordPool.lapses | word_pool.lapses | integer ≥0 | |
| wordPool.lastReview | word_pool.last_review | timestamptz，可空 | |
| wordPool.courseRefs | word_pool.course_refs | text[]，預設 `{}` | |
| wordPool.favoritedAt | favorites.created_at／deleted_at | timestamptz | 雲端不放在 word_pool。非 null ⇔ favorites 有列且 deleted_at 為 null；取消收藏時寫 deleted_at（墓碑），不刪列 |
| wordPool.addedAt | word_pool.added_at | timestamptz | |
| wordPool.wordId（收藏的字） | favorites.word_id | text | PK＝(user_id, word_id) |
| wordPool.favoriteUpdatedAt | favorites.updated_at | timestamptz | 收藏狀態（收藏／取消）最後修改時間，合併以最後修改者為準（TASK-16）；本機舊資料沒有此欄時推送時間代替 |
| reviewLogs.id（PK） | review_logs.id | uuid | 用戶端產生，去重鍵 |
| reviewLogs.wordId | review_logs.word_id | text | |
| reviewLogs.rating | review_logs.rating | smallint 1–4 | |
| reviewLogs.state | review_logs.state | smallint 0–3 | 作答前的狀態 |
| reviewLogs.due | review_logs.due | timestamptz | |
| reviewLogs.stability | review_logs.stability | double | |
| reviewLogs.difficulty | review_logs.difficulty | double | |
| reviewLogs.scheduledDays | review_logs.scheduled_days | integer | |
| reviewLogs.learningSteps | review_logs.learning_steps | integer | |
| reviewLogs.review | review_logs.review | timestamptz | 等同 ts-fsrs FSRSHistory；不含已棄用的 elapsed_days／last_elapsed_days |
| （無） | review_logs.inserted_at | timestamptz | 雲端專用；伺服器寫入時間（觸發器覆寫用戶端值），TASK-20 拉取游標 |
| courseProgress.lessonId（PK） | course_progress.lesson_id | text | PK＝(user_id, lesson_id)；格式待 TASK-7 |
| courseProgress.completedAt | course_progress.completed_at | timestamptz，可空 | |
| courseProgress.updatedAt | course_progress.updated_at | timestamptz | |
| speechCorrections.id | speech_corrections.id | uuid | 用戶端產生 |
| speechCorrections.itemId | speech_corrections.item_id | text | |
| speechCorrections.targetText | speech_corrections.target_text | text | |
| speechCorrections.recognizedText | speech_corrections.recognized_text | text | |
| speechCorrections.correctedText | speech_corrections.corrected_text | text | 只存文字，不存錄音 |
| speechCorrections.createdAt | speech_corrections.created_at | timestamptz | |
| （無） | profiles.cefr_level | text A1–C1，可空 | **未使用**：TASK-17 改存 settings.cefr_level（隨設定同步）；保留不刪 |
| （無） | profiles.id／created_at／updated_at | uuid／timestamptz | 雲端專用；id＝auth.users.id |
