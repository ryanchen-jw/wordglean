# TASK-21 驗收證據（2026-10-03）

## 實跑結果（worktree `task-21-docs`）

| 項目 | 結果 |
|---|---|
| app `npm run lint`／`npm run typecheck` | 綠 |
| app `npm test` | 78 檔、803 passed／3 skipped |
| app `npm run build` | 綠 |
| app e2e（webkit-iphone15＋chromium-pixel7，workers=2，E2E_PORT=5391） | 211 passed／9 skipped（既有跳過項） |
| app `e2e/about-visual.spec.ts`（06 三件套＋英文字串＋body 色＋main 子元素溢出；兩引擎×預設／320 特大／深色） | 14 passed；首輪抓到 320 特大下 `@huggingface/transformers` 撐出卡片 45px，改 `wrap-anywhere` 後綠 |
| content `npm test` | 213 passed |
| `scripts/check-zh.mjs` 對 zh-TW.json | 0 問題 |

## 授權頁 ↔ NOTICE 比對測試（先紅後綠）

- `red-1-notice-has-more.log`：NOTICE 已補 9 條、頁面未補 → 紅（列出缺的 9 條）
- `red-2-page-missing.log`：頁面拿掉 Workbox → 紅
- `red-3-page-extra.log`：頁面多一條 NOTICE 沒有的 → 紅

## 自架指南演練（乾淨 clone）

- `selfhost-a.log`：(a) 最小部署——npm ci、build、preview；設定頁只顯示「未登入：進度只存在這支手機」、無登入入口；直接開 `/about/licenses` 正常
- `selfhost-b-local.log`、`selfhost-b-signed-in.png`：本機模擬完整部署——supabase start、status 取 key、帶 env 建置、preview、Email 驗證碼登入（Mailpit 取碼）成功、supabase stop（容器 0）
- 未演練：Cloudflare Pages 與 Supabase 雲端步驟（本卡禁建雲端資源）

## 隱私承諾 ↔ 程式碼依據（app/ 為根）

| 承諾 | 依據 |
|---|---|
| 不登入資料只在手機 | `src/auth/config.ts:13`（沒設定就不建登入）、`src/screens/settings/AccountSection.tsx:12`、資料層 `src/data/db.ts:72-82`（IndexedDB） |
| 錄音只在裝置辨識、不上傳不存檔 | `src/speech/mic.ts:2`；辨識在 Worker：`src/speech/stt.worker.ts`、`src/speech/sttEngine.ts:6` |
| 瀏覽器辨識後備需同意、只到關閉 App | `src/speech/webSpeech.ts:2-3`、`src/screens/lesson/ShadowingView.tsx:72-73`、文案 `speak.fallback.body` |
| 金鑰只存瀏覽器、不同步不匯出 | `src/llm/keyStore.ts:1,33`、`src/data/db.ts:105`、匯出表清單 `src/data/localData.ts:5-11`、同步佇列表清單 `src/data/db.ts:62` |
| 瀏覽器直連 OpenRouter | `src/llm/client.ts:4,153`；e2e `openrouter.spec` 檢查金鑰只送往 openrouter.ai |
| 寫作內容只送使用者選的模型 | `src/llm/grade.ts:18`（`modelChain(link.model)`）；模型清單只在已連結時讀 `src/llm/startup.ts:9` |
| 登入後同步哪些資料 | `src/sync/supabaseRemote.ts:113-129`（settings、word_pool、favorites、review_logs、course_progress、speech_corrections）；`src/sync/rows.ts` |
| 修改過的辨識文字只有文字 | `src/data/repo.ts:120`；`../supabase/CLAUDE.md` 欄位對照「只存文字，不存錄音」 |
| 每個帳號只能讀寫自己的資料 | `../supabase/migrations/20261001000000_init_schema.sql:137-140`（RLS `auth.uid()`） |
| 伺服器無金鑰／錄音欄位 | `../supabase/tests/database/schema_guard.test.sql:25` |
| 外觀與字級、小課中途作答不同步 | `src/shell/prefs.ts:1`、`src/data/db.ts:104`（lessonRuns 只存本機） |
| 模型直接從 Hugging Face 下載 | `src/speech/kokoro.worker.ts:13`、`src/speech/sttEngine.ts:6` |
| 內建聲音可能經廠商網路合成 | `src/speech/systemVoice.ts:9-10`（未限定 localService 聲音） |
| 匯出與清除 | `src/data/localData.ts:20,33` |
