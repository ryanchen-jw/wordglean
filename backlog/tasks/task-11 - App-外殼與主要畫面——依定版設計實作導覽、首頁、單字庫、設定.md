---
id: TASK-11
title: App 外殼與主要畫面——依定版設計實作導覽、首頁、單字庫、設定
status: Done
assignee: []
created_date: '2026-10-01 16:00'
updated_date: '2026-10-01 23:43'
labels:
  - app
dependencies:
  - TASK-3
  - TASK-5
  - TASK-10
priority: high
ordinal: 11000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
來源：docs/spec/requirements.md v0.1（2026-10-01 創辦人六輪釐清定案）
【需求】依 TASK-3 定版設計（docs/design/ v1.0）實作 App 外殼。
【範圍】做：路由與底部導覽；首頁「今天的學習」（待複習數、今日進度、開始按鈕）、課程地圖、單字庫（全部／收藏／依熟悉度篩）、設定（每日新字數、OpenRouter 連結區塊佔位、語音模型下載狀態、資料匯出／清除）；PWA 安裝提示；離線可用；模型與字典的下載進度 UI 骨架。文案一律讀 zh-TW.json。不做：題型（TASK-12 起）、登入（TASK-20）。
【邊界】畫面與 docs/design/ 不一致時以設計為準，偏差須記錄理由；依 harness 05／06 做視覺 smoke（webkit＋chromium 截圖自檢）。
【dev-flow】feat
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 五個畫面實作完成，與定版截圖並排比對的差異清單 = 0 或每項附理由
- [x] #2 視覺 smoke：webkit 與 chromium 手機模擬各截一輪，全部經 Read 檢查無破版、無殘留英文 UI 字串
- [x] #3 離線：關網後重開可進入首頁與單字庫
- [x] #4 E2E：首次開啟→首頁→單字庫→設定 流程通過
<!-- AC:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
2026-10-02 執行長代決：本卡建 app/src/i18n/zh-TW.json 與讀取機制，字串先抄設計 v1.0 佔位文案並標 draft-pending-G3，不等 G3；間距沿用 Tailwind 預設（設計無 space token）。

2026-10-02 Round 1 代決：五畫面＝s01/s02/s09/s11/s13；安裝提示＝首頁可關閉卡片（設計偏差）；目前級距由課程進度推導（欄位留 TASK-17）；小課顯示單元名＋序號；單字庫只英文（TASK-16 補中文）；熟悉＝穩定度≥21 天；外觀／字級實作、偏好存 localStorage；每日新字數底部彈層 5/10/15/20/30；自寫 history 路由不加套件；AC#3 webkit 未驗（Windows build 限制）；key 規則與 TASK-4 對齊。

2026-10-02 Stage 3a/3b 審過（d1ec092、0c11afa）：單字庫、設定、清除確認；偏差 #16 以 s13 畫面為準（components.md 文字落後）。AccountEntry 接線待 TASK-20 併入後另開小 stage。

2026-10-02 Stage 5 結案（74efb13）：視覺 smoke 兩引擎 40 張（含 body token 色斷言）、design-diff 每項附理由（偏差 #1–19）、TASK-20 AccountEntry 接進設定頁、單元 219、e2e 22 過 2 跳（webkit 離線）。e2e:sync 入口路徑改設定頁但未實跑。派驗收官＋走查官。

2026-10-02 隔離驗收（74efb13）FAIL：e2e:sync 6/12 紅（auth-visual 嚴格折行量法掃到設定頁其他列）、design-diff 漏列 s13 停用鈕圖示；AC#2/#3(chromium)/#4 綠、數字抽查相符、守衛突變會紅（navigateFallback 為預設值、多餘）。UI 走查：P0 單字庫 chromium 特大／320 橫向溢出（input size=20）、P0 設定『下載』鈕直排；P1 清除失敗顯示英文原始錯誤、OpenRouter 鈕折行；P2 若干。退修。

2026-10-02 退修完成（d7bb769）：折行量測收斂為 e2e/measure.ts、e2e:sync 12/12；s13 停用鈕不顯示圖示；/words 外框 minmax(0,1fr)＋搜尋 w-0；下載鈕 nowrap；清除失敗改通用文案（偏差 #22）；授權鈕折行置中（#21）；彈窗限高可捲；新增 narrow.spec 20 條。分隔符號色維持（設計截圖色邊為 ClearType，review.src.html 未上色）。派複驗。

2026-10-02 複驗（d7bb769）：驗收 PASS（e2e:sync 12/12、F1/F2/P1-1 突變紅證、AC 無回歸）；走查 P0-2/P1-2/P2 過、分隔符號理由成立；P0-1 剩 320 特大列表伸出卡片 +39px（ul grid 欄）→ 退修並補子元素溢出守衛。第一位複驗官卡在等背景工作 2.5h、已停。

2026-10-02 修正 f5bc898：ul minmax(0,1fr)＋overflowingChildren 子元素溢出守衛（修前 +25px 紅）、全寬按鈕 px-4＋授權鈕 text-balance、data-multiline 只在大／特大字級。squash-merge main a407e8b；證據 docs/verification/2026-10-02-task11-shell-evidence/。AC#3 webkit 未驗（Windows WebKit 限制）。
<!-- SECTION:NOTES:END -->
