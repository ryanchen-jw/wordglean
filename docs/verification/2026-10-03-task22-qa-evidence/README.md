# TASK-22 全面 QA——驗收證據（2026-10-03）

分支 `worktree-task-22-qa`（基底 main 5294333，第 2 輪後 merge main 5283f26／TASK-21）。各輪細節：`round1/`、`round2/`、`round3/`（README＋截圖＋axe／量測原始資料 qa-r*.json）。截圖只存本機 repo，未上雲。

## 每輪健康分數（qa skill 權重表；正式建置 dist/prod、兩引擎手機模擬）

| 輪 | 修正前 | 修正後 | 本輪重點 |
|---|---|---|---|
| 1 | 94 | 97 | 首屏抓單字總表（效能預算）、單字大小寫、跟讀模型卡誤寫下載中 |
| 2 | 97 | 97 | 移交項清理（無新 P0／P1），離線完成一課 e2e |
| 3 | 95 | 97 | 合併 TASK-21 後新三頁：長文頁鍵盤捲不動（無障礙 P0） |
| 4 | 97 | 98（Accessibility 86→94；其餘不變） | 隔離驗收 FAIL 補修：作答後淡化選項對比（無障礙 P0，前三輪誤列 P2） |

第 3 輪後自評無 P0／P1；隔離驗收指出淡化選項對比屬無障礙 P0，第 4 輪修正後清零。

## 修正清單（P0／P1 與移交項）

| # | 問題 | 嚴重度 | 修法摘要 | commit |
|---|---|---|---|---|
| 1 | 首屏載入單字總表 lexicon.json（1.6MB／gzip 260KB） | P1 效能 | 預載改在第一個可點英文字出現時 | 4a4c7ef |
| 2 | sync e2e 的 settle-sync 在 chromium 恆紅（未關跟讀） | P1 測試 | sync config 帶 VITE_E2E_STT=off；改由 config 自取本機 Supabase 金鑰 | 4a4c7ef |
| 3 | 單字顯示小寫（i、tv、monday…） | 移交① | 49 字顯示層對照表＋與單字總表／課綱逐字核對的測試 | 4a4c7ef |
| 4 | 跟讀模型未下載／失敗時寫「下載中」 | 移交 G3① | 改用既有文案（無新字串） | 4a4c7ef |
| 5–7 | TASK-13 P2：全形標點斷字、播放載入 10 秒首次回音、合成 30 秒逾時 | 移交 | check.ts、hqVoice.ts | 3cf26dc |
| 8 | 跟讀 gone 旗標殘留 | 移交 | 按開始錄音時復位 | 3cf26dc |
| 9 | e2e advanced 模組層旗標 | 移交 | WeakSet<Page> | 3cf26dc |
| 10 | 英文白名單兩份不一致 | 移交 | 單一來源 src/i18n/allowedLatin.json（merge 時納入 TASK-21 五字） | 3cf26dc、61c3883 |
| 11 | 未引用 i18n key（common.action.close、listen.* 6 條） | 移交 | 刪除 | 3cf26dc |
| 12 | 離線全流程無 e2e | P1 驗收缺口 | e2e/offline-lesson.spec.ts | 3cf26dc |
| 13 | 隱私說明／授權頁捲動區鍵盤不可及 | 無障礙 P0 | SubScreen `reading`（加法） | c5bd049 |
| 15 | 作答後淡化選項文字 3.48:1（含可點英文字） | 無障礙 P0 | dim 改 text-muted＋虛線框 | 2cf266c |
| 16 | axe 作答後測試量到淡入動畫中途 | 測試量測 | 量前等動畫結束（反證見 round4） | 2cf266c |
| 14 | 旅程涵蓋 TASK-21 三頁 | 範圍 | journey.spec | c5bd049 |

每條的先紅後綠測試見各輪 README。

## 無障礙稽核（audit：對比、≥44px、螢幕閱讀器標籤）

- 工具：axe-core 4（wcag2a/aa、21a/aa、22aa、best-practice）＋ `e2e/measure.ts`（44px、溢出、單行控件、英文字串、token 色），兩引擎、淺／深色
- 結果（第 4 輪修正後）：critical 0；serious 0（作答後狀態由 `e2e/a11y-answered.spec.ts` 兩引擎淺深色守住）；moderate 為 best-practice（小課／複習無 h1、跟讀提示不在 landmark）
- 觸控目標 <44px：全狀態 0；對比 token：tokens.test 守 AA；可點元素皆有名稱（axe button-name／link-name 0）
- 已修：#4（錄音鈕 aria 誤述狀態）、#13（WCAG 2.1.1）、#15（WCAG 1.4.3）

## 效能預算

| 項目 | 數字 | 判定 |
|---|---|---|
| 首屏 JS（gzip，build 產物實測） | 第 1 輪 187.5KB → 合併 TASK-21 後 191.8KB（index-*.js 191.7KB＋registerSW 0.1KB） | ≤200KB 達標；餘裕 8KB（見 P2） |
| 模型與字典延遲載入 | 修前首屏抓 lexicon-*.json；修後首屏頁面請求無字典切片、單字總表、onnx／wasm／kokoro／stt Worker／HF／jsDelivr | `e2e/perf-budget.spec.ts` 兩引擎守住 |
| LCP（本機成對比較，chromium Pixel 7、4G 級節流＋CPU 4x、無快取無 SW，交錯各 5 次） | 修正前中位 1360ms → 修正後 1268ms（`lcp-paired.log`） | 僅供成對比較；**線上數字待上線後** |

service worker 在 load 之後背景預快取（含字典切片，TASK-16 D1 離線查字的既有決定，約 28MB／2589 檔）不在首屏內。

## 旅程 E2E

`app/e2e-sync/journey.spec.ts`：分級測驗 → 首日一課 → 收藏 → 隔日複習＋第 2 課（page.clock）→ 隱私說明／授權頁 → Email 驗證碼登入（本機 Supabase＋Mailpit）→ 上雲對帳 → 另一個裝置登入看到相同進度；OpenRouter 全攔、斷言零請求。webkit／chromium 各連跑 3 次 6/6 綠（`journey-x3.log`）。

## 真機未驗項（以 Playwright 模擬代替）

1. 真實觸控手感、捲動慣性、軟鍵盤遮擋輸入框（寫作題、聽音打字、登入）
2. 實機字體渲染與字重（Playwright WebKit Windows build 不套可變字體字重軸）
3. 瀏覽器 UI 列高度與 safe-area（瀏海、Home 指示條）
4. WebKit 離線導覽（Windows build 限制：offline 重載與離線上課只在 chromium 驗）
5. iOS Safari 的 speechSynthesis 實際發音、麥克風權限與 MediaRecorder（含近零秒錄音 EncodingError）
6. 高音質發音（WebGPU／Kokoro）：首次回音 10 秒、合成 30 秒門檻未在真機量過；真模型測試需下載約 310MB（禁外部呼叫，未跑）
7. 跟讀真模型（Moonshine，HF 下載約 52MB）未跑；加入主畫面（PWA 安裝）實際流程
8. 真實 4G／弱網下的 LCP 與預快取耗時（線上數字待上線後）

## 未修 P2 以下（只記錄）

- 單字庫 `a` 中文顯示「累加器」：data/lexicon 的 glossZh 取到 ECDICT 計算機義（data/ 為禁區，需資料端處理）
- 小課、複習畫面沒有 h1；跟讀提示文字不在 landmark
- 首頁「下一課」卡標題在全形括號處折行（P3）
- 首屏 JS 餘裕僅 8KB：之後新增畫面建議路由層延遲載入（about 三頁等）
- 正式建置未設 `VITE_SOURCE_URL` 時「查看原始碼」連結不出現——AGPL 對網路使用者的原始碼提供，上線部署必須設定
- 錄音太短專屬提示：需新文案（創辦人逐字審），建議「錄音太短了，唸完整句再按結束」
- lessonRun StepResult 不記題型／批改方式：尚無讀取端，做學習統計時再補
