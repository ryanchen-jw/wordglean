# 第 1 輪 QA（2026-10-03）

- 對象：正式建置 `dist/prod`（真題庫、真課綱），vite preview 本機；webkit iPhone 15、chromium Pixel 7 模擬
- 巡檢腳本：Playwright 函式庫走全畫面（首頁首次／分級測驗／結果／首頁／課程／小課詳情／字典彈層／正式第一課逐題型／完成頁／複習／單字庫／設定／深色），每狀態截圖＋axe-core 4（wcag2a/aa、21a/aa、22aa、best-practice）＋`e2e/measure.ts` 手機量測＋console／失敗請求
- 原始資料：`qa-r1.json`；截圖：`webkit/`、`chromium/`（挑選 10 張／引擎）

## 健康分數：94（修正前）

| 類別 | 權重 | 分數 | 扣分依據 |
|---|---|---|---|
| Console | 15% | 100 | 0 error（chromium 只有 WebGPU「No available adapters.」warning，headless 無 GPU） |
| Links | 10% | 100 | 0 失敗請求 |
| Visual | 10% | 97 | Low：首頁「下一課」卡標題在全形括號處折行（P3） |
| Functional | 20% | 100 | — |
| UX | 15% | 92 | Medium：跟讀模型未下載／下載失敗時寫「下載中」（移交 G3①） |
| Performance | 10% | 85 | High：首屏就抓單字總表 lexicon.json（1.6MB／gzip 260KB），違反「字典延遲載入」預算 |
| Content | 5% | 77 | High：單字庫 `a` 釋義顯示「累加器」（資料 data/lexicon 取到 ECDICT 計算機義，P2 記錄）；Medium：`i` 顯示小寫（移交①） |
| Accessibility | 15% | 86 | Medium：作答後淡化選項文字 3.48:1（axe serious）；Low：小課／複習無 h1；Low：跟讀提示文字不在 landmark |

## 本輪修正

| # | 問題 | 嚴重度 | 修法 | 測試（先紅後綠） |
|---|---|---|---|---|
| 1 | 首屏載入單字總表 lexicon.json（字典未延遲載入） | P1（效能預算） | 預載從 DictionaryProvider 掛載移到「畫面出現第一個可點英文字」（EnglishText）；首頁無英文字不載，課程／小課照樣先載好 | `Dictionary.test.tsx`「字典延遲載入」；`e2e/perf-budget.spec.ts`（還原舊碼跑 chromium 紅：收到 lexicon-*.json；新碼兩引擎綠） |
| 2 | e2e-sync `settle-sync` 在 chromium 恆紅（sync 建置沒關跟讀，chromium 出跟讀題） | P1（測試套件壞） | `playwright.sync.config.ts` 帶 `VITE_E2E_STT=off`（同主 config） | 基線 `sync-base` 紅 → 修後綠 |
| 3 | 移交①：單字顯示小寫（i、tv、t-shirt、monday） | P2→移交必處理 | `src/dict/displayCase.ts` 49 字對照表（手寫、不內嵌 data/），單字卡／回饋／完成頁／單字庫／課程詳情顯示用 | `displayCase.test.ts`（含與單字總表＋課綱逐字核對）、`WordCardView.test.tsx`「i 顯示 I」先紅後綠 |
| 4 | 移交 G3①：模型未下載／失敗時卡片標題、錄音鈕 aria 寫「下載中」 | P2→移交必處理 | 失敗改用「需要下載語音辨識模型」＋進度條名「下載中斷」；錄音鈕只在下載中才說下載中，其餘用「模型下載完才能錄音」（皆既有文案，無新增字串） | `ShadowingView.test.tsx` 先紅後綠；`speech-visual.spec` 隨之更新 |

## 本輪 axe／量測摘要

- 兩引擎全狀態：overflow 0、單行控件折行 0、<44px 0、英文介面字串 0、body token 色一致
- axe：無 critical；serious 1（淡化選項對比，見上）；moderate 為 best-practice（page-has-heading-one、region）

## 回歸

app 單元 800 綠／3 skip；content 213 綠；主 e2e webkit 97＋chromium 102 綠（skip 為既有 WebKit 限制）；speech（假辨識）20 綠；sync 16 綠（含旅程）
