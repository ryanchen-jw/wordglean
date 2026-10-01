---
id: TASK-3
title: 設計 R2——設計系統＋高保真畫面定版
status: In Progress
assignee: []
created_date: '2026-10-01 16:00'
updated_date: '2026-10-01 16:40'
labels:
  - app
dependencies:
  - TASK-2
priority: high
ordinal: 3000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
來源：docs/spec/requirements.md v0.1（2026-10-01 創辦人六輪釐清定案）
【需求】依 G1 圈選結果，產出可直接實作的設計系統與高保真畫面，作為 TASK-11 以後所有 UI 的唯一依據。
【範圍】做：(1) design tokens（色彩含語意色：正確／錯誤／提示、字級階、間距、圓角、陰影、動效時長）落 app/src/design/tokens 與 Tailwind theme；(2) 元件清單與規格（按鈕、題目卡、選項、進度條、底部導覽、錄音鈕狀態、字典彈層、Toast、空狀態）；(3) TASK-2 所列 11 個畫面的高保真 HTML（390×844），含關鍵狀態：答對／答錯、錄音中／辨識中／辨識完可修改兩欄、無金鑰降級、離線、模型下載中；(4) 微互動說明（答對回饋、翻卡）。不做：React 實作、正式文案（以佔位文案標記，TASK-4 定稿）。
【邊界】高保真用 Artifact 交付供圈選微調；依記憶 feedback_design_pick_minimal_variant 圈選後必做一輪微調。用 frontend-design 與 impeccable 系 skill（critique、polish、typeset）自審。定版後的檔案存 docs/design/（HTML＋截圖），標註版本 v1.0。
【dev-flow】non-dev（設計），留閘 G2
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 tokens 檔與 Tailwind theme 可被 app 直接 import；色彩組合全部通過 WCAG AA
- [x] #2 元件規格文件含每個元件的狀態（default／pressed／disabled／loading／error）
- [x] #3 11 個畫面的高保真 HTML 與截圖，含範圍所列全部關鍵狀態；browser skill 以 webkit 與 chromium 各截一輪並自檢無破版
- [ ] #4 以 Artifact 交付供圈選與逐畫面意見，停 In Review 等 G2；至少一輪微調
- [ ] #5 創辦人宣告定版後，docs/design/ 標 v1.0、圈選與修改紀錄記回卡 comment 才 Done
<!-- AC:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
2026-10-01 Stage 0–4 完成（分支 worktree-task-2-design-r1：1be6ec3 tokens＋Tailwind 4 theme＋對比度單元測試、0276998 元件規格、9317afe 審閱頁、0dd1cc5／9aee780 自審修正與截圖）。代決：對比度進 app 單元測試（43 項，突變紅證）；PWA 主題色改 #f6f1e7；字體自 host 留 TASK-11（@fontsource 套件名已列）；補畫資料匯出／清除、依熟悉度篩；字級 rem 等比放大。webkit＋chromium 6 組 204 張截圖、破版 0、<44px 觸控 0。G2 審閱頁：https://claude.ai/artifact/JCK7dHeNbSybiqXod2h5HG（db screens/choices，發佈後 list 正常、空）。待 G2 微調時處理：模型大小文字（90MB／28MB）依 TASK-1 實測與 TTS 裁示更新；補畫離開小課確認框、清除資料二次確認、小課完成頁。停 In Review 等 G2。

2026-10-02 G2 第一輪結果（Artifact db）：s01/02/03/05/06/09/10/11 OK；s04 跟讀改為確認／修正後送出、以送出句計分（規格 §6 已依創辦人裁示改寫）；s07 單字卡改為四選一中文釋義、FSRS 依 TASK-12 通用對應自動評分（Again/Hard/Good）；s08 全 App 英文字皆可點查義（全域規則）；字體選主案黑體。s09 提問（到期依據）已在對話中回答：FSRS 依每字穩定度預測記得率降到 90% 之日。Stage 5 微調中。
<!-- SECTION:NOTES:END -->
