---
id: TASK-3
title: 設計 R2——設計系統＋高保真畫面定版
status: Done
assignee: []
created_date: '2026-10-01 16:00'
updated_date: '2026-10-01 18:28'
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
- [x] #4 以 Artifact 交付供圈選與逐畫面意見，停 In Review 等 G2；至少一輪微調
- [x] #5 創辦人宣告定版後，docs/design/ 標 v1.0、圈選與修改紀錄記回卡 comment 才 Done
<!-- AC:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
2026-10-01 Stage 0–4 完成（分支 worktree-task-2-design-r1：1be6ec3 tokens＋Tailwind 4 theme＋對比度單元測試、0276998 元件規格、9317afe 審閱頁、0dd1cc5／9aee780 自審修正與截圖）。代決：對比度進 app 單元測試（43 項，突變紅證）；PWA 主題色改 #f6f1e7；字體自 host 留 TASK-11（@fontsource 套件名已列）；補畫資料匯出／清除、依熟悉度篩；字級 rem 等比放大。webkit＋chromium 6 組 204 張截圖、破版 0、<44px 觸控 0。G2 審閱頁：https://claude.ai/artifact/JCK7dHeNbSybiqXod2h5HG（db screens/choices，發佈後 list 正常、空）。待 G2 微調時處理：模型大小文字（90MB／28MB）依 TASK-1 實測與 TTS 裁示更新；補畫離開小課確認框、清除資料二次確認、小課完成頁。停 In Review 等 G2。

2026-10-02 G2 第一輪結果（Artifact db）：s01/02/03/05/06/09/10/11 OK；s04 跟讀改為確認／修正後送出、以送出句計分（規格 §6 已依創辦人裁示改寫）；s07 單字卡改為四選一中文釋義、FSRS 依 TASK-12 通用對應自動評分（Again/Hard/Good）；s08 全 App 英文字皆可點查義（全域規則）；字體選主案黑體。s09 提問（到期依據）已在對話中回答：FSRS 依每字穩定度預測記得率降到 90% 之日。Stage 5 微調中。

2026-10-02 Stage 5 微調完成（ec5ac55、c1cfee5、01d2b8c）：s04 確認／修正後送出計分、s07 四選一、s08 全 App 可點字（worker 代決例外：會洩漏答案的字作答前不可點，待創辦人確認）、字體黑體定案刪襯線、發音預設系統聲音、新增 s12 離開確認／s13 清除二次確認／s14 小課完成頁。第二輪審閱頁已發佈同網址 Version 2。剩 5 組截圖補拍中。停 In Review 等 G2 第二輪。

2026-10-02 G2 第二輪結果：s01–s14 全部 OK（含 s04 確認後送出計分、s07 四選一、s08 全 App 可點字及『洩漏答案的字作答前不可點』例外、新增 s12–s14），字體黑體。創辦人宣告定版；待截圖補完＋改名 docs/design/v1.0＋驗收後 Done。

2026-10-02 隔離驗收（c6db2b8）FAIL 一條：最終版缺『模型下載中』狀態（第一輪 s03 有、第二輪隨 Kokoro 選配移除；Moonshine 仍需下載）。退件補 s04 新狀態＋兩引擎補拍。其餘 AC1/2/5 與截圖兩引擎各 40 張破版 0 通過。觀察交 TASK-11：間距無 --lg-space token（沿用 Tailwind 4px 基準）；深色與特大字級僅有第一輪截圖（未補 4 組，執行長裁示）；s07-right 的 meeting 查字標示看似示範殘留。

2026-10-02 補件後隔離複驗 PASS（afa0f77：s04 新增『語音辨識模型下載中』，14 畫面 41 狀態，兩引擎各 41 張破版 0）。squash-merge main 8a2cb08；證據 docs/verification/2026-10-02-task-3-design-v1-evidence/（第一輪淺色兩組已被最終版取代、刪除；深色／特大僅第一輪，未補 4 組為執行長裁示）。觀察：兩組 metrics.tsv 為同一 blob（全 0，無法證明分別量測）。
<!-- SECTION:NOTES:END -->
