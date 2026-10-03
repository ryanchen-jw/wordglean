# 第 2 輪 QA（2026-10-03）

同第 1 輪方法（`dist/prod` 重建後巡檢，webkit 29 狀態／chromium 32 狀態）。原始資料 `qa-r2.json`。

## 健康分數：97

| 類別 | 分數 | 說明 |
|---|---|---|
| Console 15% | 100 | 0 error（chromium 只有 headless 無 GPU 的 WebGPU warning） |
| Links 10% | 100 | 0 失敗請求 |
| Visual 10% | 97 | P3：首頁下一課卡標題在全形括號處折行 |
| Functional 20% | 100 | — |
| UX 15% | 100 | 跟讀模型卡已不再寫「下載中」（`chromium/08-shadowing-after-fix.png`） |
| Performance 10% | 100 | 首屏不再抓單字總表 |
| Content 5% | 85 | 未修 P2：單字庫 `a` 釋義「累加器」（data/ 資料問題，禁區外） |
| Accessibility 15% | 86 | 未修 P2：作答後淡化選項對比 3.48:1；P3：小課／複習無 h1、跟讀提示不在 landmark |

手機量測：兩引擎全狀態 overflow／折行／<44px／英文字串／body 色 皆 0。

## 本輪修正（移交項）

| # | 問題 | 嚴重度 | 修法 | 測試（先紅後綠） |
|---|---|---|---|---|
| 5 | 移交 TASK-13 P2(b)：全形逗號後無空白判錯（`Lisa，stay calm`） | P2→移交 | `check.ts` NFKC 後在 `, ; : ! ? 。 、` 緊接字元處補空白（數字間千分位與時間冒號不動） | `check.test.ts`「全形標點後沒有空白」 |
| 6 | 移交 TASK-13 P2(a)：播放時載入共用 90 秒逾時 | P2→移交 | `hqVoice.load()` 第一次回音時限 10 秒，有回音後恢復 90 秒閒置逾時；下載路徑不變 | `hqVoice.test.ts` 兩條（10 秒失敗／有回音後 90 秒） |
| 7 | 移交 TASK-13 P2(c)：合成階段無逾時 | P2→移交 | 合成一句 30 秒沒回傳即判 Worker 失敗、收掉、下次重開（沿用既有退回內建聲音＋提示） | `hqVoice.test.ts`「合成久無回應」 |
| 8 | 移交 TASK-14 複驗 P2：跳過時存檔與前進都失敗，gone 旗標殘留、之後錄音被立刻停掉 | P2→移交 | 按「開始錄音」時復位 gone（按得到＝人還在這題） | `ShadowingView.test.tsx`「之後仍能開始錄音」 |
| 9 | 移交 TASK-15：e2e `lesson.ts` 的 advanced 模組層旗標跨頁殘留 | P2→移交 | 改 `WeakSet<Page>`，以頁面為單位 | `e2e/lesson-helpers.spec.ts`（舊碼兩引擎紅：停在第 1 題） |
| 10 | 移交 G3r2：英文白名單兩份不一致 | P2→移交 | 抽成 `src/i18n/allowedLatin.json`，`t.test.ts` 與 `e2e/measure.ts` 共用；measure 另加畫面才有的 C2、A–D | `tts-hq.spec`「下載前告知」加手機量測（舊清單兩引擎紅：Wi、Fi） |
| 11 | 移交 G3②：未引用 i18n key | P2→移交 | 刪 `common.action.close` 與整組 `listen.*`（6 條，逐條與 `lesson.listen.*` 重複）；typecheck（MessageKey 型別）證明無引用 | 無行為改動，typecheck＋全套 |
| 12 | 離線全流程未有 e2e | P1（驗收缺口） | 新增 `e2e/offline-lesson.spec.ts`：裝好後斷網→略過分級→開始今天的學習→完成一課→首頁今天完成→重新載入仍在 | chromium 綠；webkit 受 Windows build 限制 skip（列真機未驗） |

## 不改碼的移交項

- **HomeScreen.test 偶發逾時**：TASK-13（a9d1490）已把 `asyncUtilTimeout` 放到 3 秒。今日 4 次正常全套首頁測試最慢 669ms（4.5 倍餘裕）。CPU 壓力實驗（22 支忙迴圈打滿 22 核）全套 2 次各紅 2 條（HomeScreen「預設」3167ms、SettingsScreen、simulate），屬同一類牆鐘逾時。反證實驗：同壓力下暫把等待拉到 10 秒、測試時限 30 秒 → 805/805 綠，證明是純時間因素、無邏輯錯誤；正常負載已有充足餘裕，不再放寬。
- **錄音太短專屬提示**：需新增對外文案，依規定須創辦人逐字審；現行「錄音或轉文字失敗，請再唸一次」正確且可重錄。建議文案：「錄音太短了，唸完整句再按結束」。
- **lessonRun StepResult 不記題型／自評或 AI 批改**：目前沒有任何讀取端（學習統計未排程），先不加欄位；做統計時再補。

## 回歸

app 單元 805 綠／3 skip；content 213 綠；主 e2e webkit 98＋chromium 104 綠；speech 20 綠；sync 16 綠；typecheck、eslint、prettier 綠
