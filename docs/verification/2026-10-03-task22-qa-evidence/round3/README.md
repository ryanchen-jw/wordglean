# 第 3 輪 QA（2026-10-03，已 merge main 5283f26：TASK-21 三頁）

範圍加入 TASK-21 新頁：設定 →「隱私說明・授權・原始碼」（/about）→ 隱私說明（/about/privacy）／授權與致謝（/about/licenses）。webkit 32 狀態／chromium 35 狀態，原始資料 `qa-r3.json`。

## 健康分數：修正前 95 → 修正後 97

| 類別 | 修正前 | 修正後 | 說明 |
|---|---|---|---|
| Console 15% | 100 | 100 | 0 error |
| Links 10% | 100 | 100 | 0 失敗請求 |
| Visual 10% | 97 | 97 | P3 同前 |
| Functional 20% | 100 | 100 | — |
| UX 15% | 100 | 100 | — |
| Performance 10% | 100 | 100 | 合併 TASK-21 後首屏 JS 191.8KB gzip（仍 ≤200KB） |
| Content 5% | 85 | 85 | 未修 P2：`a` 釋義（data/） |
| Accessibility 15% | 71 | 86 | 新發現並修：隱私說明、授權頁捲動區鍵盤不可及（axe serious ×2／引擎） |

授權頁的英文為出處條目（來源名、授權名、著作權行），依 TASK-21 設計原文保留、不列為英文介面字串。

## 本輪修正

| # | 問題 | 嚴重度 | 修法 | 測試（先紅後綠） |
|---|---|---|---|---|
| 13 | 隱私說明、授權與致謝：`main` 是捲動容器但內無可聚焦元素，只用鍵盤（外接鍵盤、切換控制）捲不下去、讀不完（WCAG 2.1.1；axe scrollable-region-focusable serious） | 無障礙 P0 → P1 | `SubScreen` 加可選 `reading`（加法、預設關）：main `tabIndex=0`＋`aria-labelledby` 頁面標題；只有這兩頁開啟 | `PrivacyScreen.test`、`LicensesScreen.test`「捲動區可用鍵盤聚焦，並以頁面標題命名」先紅後綠；重跑巡檢 axe 該項 0 |
| 14 | 旅程 E2E 未涵蓋 TASK-21 三頁 | 範圍補齊 | `journey.spec` 登入前：設定 → 隱私說明・授權・原始碼 → 隱私說明 → 授權與致謝 | 兩引擎各 3 次綠 |

## 回歸

app 單元 818 綠／3 skip；content 213 綠；主 e2e webkit 105＋chromium 111 綠；speech 20 綠；sync 16 綠；旅程 ×3 兩引擎 6/6 綠（`../journey-x3.log`）；typecheck、eslint、prettier 綠
