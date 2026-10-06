---
id: TASK-22
title: 全面 QA——手機雙引擎 E2E、無障礙、效能預算
status: Done
assignee: []
created_date: '2026-10-01 16:00'
updated_date: '2026-10-03 14:07'
labels:
  - app
dependencies:
  - TASK-13
  - TASK-14
  - TASK-15
  - TASK-16
  - TASK-17
  - TASK-18
  - TASK-20
priority: medium
ordinal: 22000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
來源：docs/spec/requirements.md v0.1（2026-10-01 創辦人六輪釐清定案）
【需求】上線前整體驗收。
【範圍】做：完整使用者旅程 E2E（新手測驗→首日學習→隔日複習→收藏→登入同步）在 webkit 與 chromium 手機模擬；qa skill 跑一輪報告並修；無障礙稽核（audit skill：對比、觸控目標 ≥ 44px、螢幕閱讀器標籤）；效能預算（首屏 JS ≤ 200KB gzip、模型與字典一律延遲載入、Lighthouse 以線上數字為準，本機只做成對比較——記憶 reference_local_lighthouse_lcp_bimodal）；離線全流程。
【邊界】驗收官隔離派工（harness 01／daily-brain 5.2）；真機項目依記憶以模擬代替時明列未驗項。
【dev-flow】fix（發現即修）
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 完整旅程 E2E 在兩引擎全綠且連跑 3 次穩定
- [x] #2 qa 健康分數與修正清單入報告；P0／P1 全修
- [x] #3 無障礙稽核 P0 全修
- [x] #4 效能預算達標的量測證據
<!-- AC:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
2026-10-02 執行長移交（TASK-13／TASK-9 帶入）：①單字卡顯示層大小寫——題庫 word 欄位＝課綱小寫 headword（i、tv、t-shirt 等），App 顯示時需轉為 I、TV、T-shirt（含月份、星期等專有名詞的大寫；小型對照表或 lexicon 原形）；②TASK-13 P2：播放時載入共用 90 秒逾時（首次回音改約 10 秒）、全形逗號後無空白判錯、合成階段無逾時；③HomeScreen.test 全套負載下偶發逾時（單跑綠）。
2026-10-02 執行長移交（TASK-14 帶入）：按開始後立刻結束的近零秒錄音，MediaRecorder 偶發 EncodingError（約 1/4），目前顯示「錄音或轉文字失敗，請再唸一次」可重錄；可考慮改為「錄音太短」專屬提示。
2026-10-02 執行長移交（TASK-14 複驗 P2）：跳過時存檔與前進都失敗的極端情況下，ShadowingView 的 gone 旗標殘留，之後按開始錄音會被立即停掉且無提示（再按跳過可脫困）。
2026-10-03 執行長移交（TASK-15 整合驗收 P2）：app/e2e/lesson.ts 的 advanced 為模組層旗標，answer 後未呼叫 next 時會跨呼叫／跨測試殘留；lessonRun 的 StepResult 不記題型與自評／AI 批改區別（若之後要做學習統計需補）。
2026-10-03 執行長移交（G3 第二輪帶入）：①跟讀題模型下載失敗時卡片標題仍顯示「語音辨識模型下載中」（ShadowingView.tsx 約 535 行）；②未被引用的 i18n key：common.action.close、整組 listen.*（5 條，與 lesson.listen.* 重複），QA 時確認後刪除。
2026-10-03 執行長移交（G3r2）：英文字串白名單兩份不一致——app/src/i18n/t.test.ts 允許 Email、Google、Wi、Fi、sk、or，e2e/measure.ts 沒有（App 已統一）；QA 時擇一統一。
<!-- SECTION:NOTES:END -->

## Comments
<!-- COMMENTS:BEGIN -->
---
created: 2026-10-03 23:30
---
Done（main ac18f89）。四輪 QA→修→重測，健康分數 94→97→97→98。隔離驗收首驗 FAIL（作答後淡化選項 color-contrast 3.48:1，worker 原列 P2；依代決原則屬無障礙 P0）→ 第 4 輪修（muted 文字＋虛線框、a11y-answered axe 守衛）→ 複驗 PASS：旅程 6/6、unit 818、主 e2e 228、sync 16、speech 20、content 213；首屏 JS 191.8KB；axe critical／serious 0。代決：TASK-21 併入後 merge main 納入三頁；LCP 只做本機成對比較（1360→1268ms），線上數字待 TASK-23；移交項 8 修 3 不修（HomeScreen 偶發＝純時間因素有反證、錄音太短需新文案→列創辦人裁示、StepResult 無讀取端）。備查：單字庫 a 顯示「累加器」（data 層 glossZh，列創辦人裁示）；小課／複習無 h1、首屏 JS 餘裕 8KB、單字庫列表英文字按鈕 <44px（行內例外可再裁量）。
---
created: 2026-10-04 20:30
---
10-04 創辦人試用回饋（掛本卡後續）：c6dd3f0 區網／舊 Safari 作答卡住修正（UUID 後備＋存檔失敗提示）；ad63571 跟讀下載完自動可錄音、單字卡自動發音、多益總分、音效、錯題重做到全對、提示字大小寫。代決：跳過類首答算錯、重做中再跳過不再出；webkit 長流程逾時量測為步驟變多→調 e2e 時限與流程不放寬斷言；narrow.spec:87 偶發屬既有。隔離驗收首驗 FAIL→複驗 PASS。
---
created: 2026-10-06 15:00
---
創辦人裁示（10-06）：首屏 JS 200KB 不再是硬性上限。改為超過 200KB gzip 時警告、超過 300KB 才讓測試失敗（10-06 創辦人由 250 改 300）；以「會隨內容成長的資料不進首屏」為結構原則（題目檔對照表移出首屏，TASK-24 W5 分支實作）。
---
<!-- COMMENTS:END -->
