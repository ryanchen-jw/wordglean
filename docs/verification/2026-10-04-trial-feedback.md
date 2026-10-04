# 2026-10-04 創辦人試用回饋與裁示——驗收紀錄

本機 main ad63571，未 push、未部署。試用網站：本機 vite preview，埠 4600（localhost 與區網 IP）。

## 合併清單

| 項目 | commit | 驗收 |
|---|---|---|
| 非安全來源（區網 IP／舊 Safari）作答後卡住：UUID 後備＋存檔失敗提示與重試 | c6dd3f0 | 隔離驗收 PASS：區網 IP 兩引擎 secure=false 可前進；unit 827、e2e 230 |
| TASK-15 v3：prompt 台灣繁中＋含簡體才 OpenCC twp 轉換、fallback max_tokens 4096 | 405febe | 三輪（逐字表誤轉→OpenCC；缺載入失敗測試＋正確字被改→含簡體才轉）第三輪 PASS：unit 853、e2e 42、content 215；首屏 177.9KB |
| 造句改翻譯（每課 2 翻譯 0 造句） | A1 4007f04、A2 55403e0、C1 773877f、B2 0c905ab、B1 c600765 | 每級：撰寫→第③關獨立審查（FIX＋SUS 全修）→執行長親審→check-items --require-judge 984 課全綠、content 223、app unit 全綠；題庫 makeSentence 0 題；準則 §12.11 |
| 試用回饋五項＋補兩項：跟讀下載完自動可錄音、單字卡自動發音、多益總分、音效（小課＋複習）、錯題重做、提示字大小寫 | ad63571 | 首驗 FAIL（webkit 長流程負載下 30s 逾時）→ 量測判定步驟變多（主流程 main 12.0s／分支 13.7s，每步約 0.6s 未變慢）→ 調 e2e 流程與時限、不放寬斷言 → 複驗 PASS：unit 890、webkit 主 e2e 114×2、chromium 120、守衛紅證 13 組；首屏 195,110B（main 193,690B） |

## 新文案（已呈創辦人）
「音效」、「再練一次錯題」、「還有 {left} 題錯題要再練一次。進度會保留，下次接著練。」、「多益分數為聽力＋閱讀總分，依 ETS 官方的 CEFR 對照，僅供參考」

## 已知限制
- 繁簡混雜句中，少數同形字可能誤轉（例如余→餘、于→於）；文法解釋裡罕見。
- webkit narrow.spec:87 字典彈層偶發紅，屬既有問題，main 也會發生。
- main.tsx 的 watchFirstInteraction 接線沒有測試守住；只影響不支援 userActivation 的舊瀏覽器。

## 待辦
- TASK-15 v3 重評：cron 每天 08:14，評 qwen 與 apodex 的 v3 各 40 題。
- TASK-23 上線。

## 重跑
- `cd app && npm ci && npm test && npm run lint && npm run typecheck && npm run build`
- `E2E_PORT=<埠> npx playwright test --project=webkit-iphone15 --workers=2`（chromium 用 `--project=chromium-pixel7`）
- `cd content && npm test && node scripts/check-items.mjs --require-judge`
