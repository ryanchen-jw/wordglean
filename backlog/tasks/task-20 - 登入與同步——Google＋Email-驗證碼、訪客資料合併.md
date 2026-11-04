---
id: TASK-20
title: 登入與同步——Google＋Email 驗證碼、訪客資料合併
status: Done
assignee: []
created_date: '2026-10-01 16:00'
updated_date: '2026-10-01 19:51'
labels:
  - app
  - supabase
dependencies:
  - TASK-19
  - TASK-10
priority: medium
ordinal: 20000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
來源：docs/spec/requirements.md v0.1（2026-10-01 創辦人六輪釐清定案）
【需求】規格 §3：不登入也能完整使用；登入方式 Google、Email 驗證碼（Supabase Auth）；登入後本機資料合併到雲端、跨裝置同步；自架者沒設定登入時 App 仍可用。
【範圍】做：Supabase Auth 整合（Email OTP 在本機用 Supabase 內建收信模擬器測、Google 以設定開關控制）；合併規則（代決：review_logs 取聯集去重，FSRS 卡片狀態以 review log 重放得出；收藏取聯集；設定以最後修改時間為準）；同步時機（登入當下、每次結算後、回到前景時）；離線佇列；未設定 Supabase 環境變數時隱藏登入入口。不做：真實 Google OAuth client 申請（G6）。
【邊界】Google 登入真實驗證在 G6 後補做一次（TASK-23 涵蓋）。
【dev-flow】feat
【借鑑】合併規則以 ts-fsrs 的 reschedule(card, reviews) 重播合併後的 review log 實作。fuzz 開啟時重播是否一致未核：須先驗證，不一致則合併重播時固定 enable_fuzz=false 或固定亂數種子。（參考 docs/research/oss-landscape.md）
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 合併規則單元測試：兩裝置各自離線學習後合併，FSRS 狀態與只在單一裝置作答的結果一致
- [x] #2 E2E（本機 Supabase）：訪客學習→Email OTP 登入→資料上雲→另一個瀏覽器 context 登入看到相同進度
- [x] #3 未設定 Supabase 時無登入入口且其餘功能正常，有測試
- [x] #4 驗證並記錄 fuzz 對重播一致性的影響，合併結果在重跑時位元一致
<!-- AC:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
2026-10-02 執行長代決（Round 1 審核）：登出＝先推完佇列再清本機（推不出警告不清）；拉取＝新增 migration review_logs.inserted_at 當游標（重疊＋id 去重）；收藏＝聯集、本機收藏覆寫遠端 deleted_at（取消收藏功能出現後改最後修改者為準）；登入元件用最小 Tailwind 樣式、標 TODO(TASK-11 token)、文案標 TODO(TASK-4 文案)；AC#2 走本機 npm run e2e:sync 不進 CI。新依賴 @supabase/supabase-js 2.117.2（MIT、2026-09-25 更新）。worker e9e1e3f5→11071c2f。

2026-10-02 Stage 4 結案（ac562db）：AC#1–#4 實作完成；本機 Supabase 真收信 E2E 8/8、pgTAP 81/81、單元 135。已知限制 6 條見 docs/pending/2026-10-02-task20-sync/proposal.md（AC#2 學習步驟暫用測試掛鉤，學習畫面上線後改從 UI 操作）。交接 TASK-11：AccountEntry 接 AccountSection＋appDb；結算後同步需在 AuthApi 暴露 requestSync（交 TASK-18）。派隔離驗收官中。

2026-10-02 隔離驗收 PASS（ac562db）：AC#1–4 全綠（e2e:sync 8/8、pgTAP 81、RLS 與 inserted_at 防竄改親自試打、__linguaTest 不在一般 build）。執行長代決 merge 前修：(1) 換帳號隱私——本機資料已屬帳號 X 時以 Y 登入不合併、顯示阻擋並登出 Y；(2) App.test AC#3 案例無鑑別力改寫。觀察：同步表清單在 4 處重複（新增同步表要改多處）。

2026-10-02 驗收後修正（66b3b3c）：換帳號阻擋（AccountMismatchError、Y 自動登出、訪客首登照舊合併），三層測試先紅後綠＋突變；App.test AC#3 改 findBy 逾時判定、突變會紅；e2e:sync 同信箱 1 秒寄送限制偶發 429 修在測試端（間隔 1.5 秒），連 3 輪 8/8。UI 走查官派出中。

2026-10-02 UI 走查（66b3b3c）：P0 長 email 不折行水平溢出（375 34px／320 89px／特大 136px）→ 退修；P2 錯誤缺圖示、讀取中缺轉圈、文字鈕缺 ›（TODO TASK-11 共用元件）。body 未套 --lg-bg 轉 TASK-11。

2026-10-02 走查修正 29353fd（長 email 折行＋375/320 回歸測試先紅後綠；錯誤訊息移到輸入框下、aria-busy）。squash-merge main a28af5d；證據 docs/verification/2026-10-02-task20-sync-evidence/。特大字級未另測（overflow-wrap:anywhere）。
<!-- SECTION:NOTES:END -->
