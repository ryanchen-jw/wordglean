---
id: TASK-15
title: 寫——OpenRouter 自帶金鑰、批改與無金鑰降級＋預設模型評測
status: Done
assignee: []
created_date: '2026-10-01 16:00'
updated_date: '2026-10-04 01:47'
labels:
  - app
dependencies:
  - TASK-12
priority: high
ordinal: 15000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
來源：docs/spec/requirements.md v0.1（2026-10-01 創辦人六輪釐清定案）
【需求】規格 §2、§6：使用者自帶 OpenRouter（OAuth PKCE 一鍵授權或貼金鑰），金鑰只存瀏覽器、瀏覽器直呼；可自選模型；寫作題 LLM 改錯並以繁中解釋語法；無金鑰時降級為對照參考答案自評。
【範圍】做：PKCE 授權流程與貼金鑰；金鑰存放（IndexedDB，提供一鍵清除）；模型清單（OpenRouter models API，標價格與是否免費）；批改 prompt（輸出結構化 JSON：修正後句子、逐處錯誤、繁中解釋、等級是否合宜）與解析容錯；中翻英、造句題 UI；無金鑰降級 UI；預設模型評測：準備 40 句台灣學習者常見錯句，比較 4 個候選模型的正確率與繁中解釋品質。不做：伺服器代呼（伺服器永不碰金鑰）。
【邊界】真錢：評測走開發方金鑰，預估 < US$2，超過即停（含在 G5 預算授權內，若 G5 未核則評測只用免費模型）。預設模型以評測結果代決（正確率最高且單次 < US$0.002 者）。
【dev-flow】feat
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 PKCE 流程以 mock OpenRouter 端點做 E2E；貼金鑰、清除金鑰有測試；網路面板確認金鑰只送往 openrouter.ai
- [x] #2 批改回應解析對 5 種畸形輸出有容錯測試
- [x] #3 無金鑰時寫作題可用參考答案自評，並顯示設定金鑰提示
- [x] #4 評測報告 docs/research/llm-eval.md（40 句、4 模型、花費），預設模型依代決原則選定並記錄
<!-- AC:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
2026-10-02 派工代決：評測只用 :free、花費 $0、預設模型只從免費模型選（不訓練提供商＋data_collection deny＋fallback）；評測真打等執行長放行（TASK-8 共用每日 50 次額度），額度不足評測停 In Review。

2026-10-02 Round 1 代決：評測 40 句×4 免費模型分天跑（排除 NVIDIA，Trial Terms 限內部評估）；寫作跳過／批改失敗算錯；預設模型＝不訓練免費模型中正確率最高、次高 fallback（取代原卡單次 < US$0.002）；解釋品質 worker 打分、執行長抽審。

2026-10-02 創辦人確認：免費 LLM 只用於使用者端即時批改（本卡），題庫改開發端產生。

2026-10-02 App 端完成（b345977…3d573ad）：PKCE（mock 端點）、貼金鑰三種錯誤、清除、金鑰只送 openrouter.ai（e2e 記錄請求）、5+3 種畸形輸出容錯、無金鑰自評、寫作畫面登記；評測題組 40 句、:free 硬守衛、乾跑 160 次。代決：dots 排除改 apodex；暫定預設 Gemma 4 31B／fallback Qwen；放行真打評測（題庫改由開發端撰寫，額度不再被 TASK-8 使用），分天跑。

2026-10-02 Round 3（e809b26）：content 52、e2e 合併後 110 綠、兩處修正重截圖；評測候選 Gemma 4 31B／Qwen3.8 27B／Gemma 4 26B-A4B／apodex；批改 prompt 升 v2（守衛擋中文 prompt 改英文）；評測第 1 天：額度剩 8（前 42 次為 TASK-8 改方向前用掉）、送 6 成功 1、有效 0/160、$0。評測分天跑，AC#4 待完成，卡停 In Review。

2026-10-02 Round 4（682803c）：離線文案（先紅後綠）、merge main 7fc6245、unit 537、e2e 128、content 68。App 端派驗收兼走查；評測 0/160（v2）待分天跑。

2026-10-02 隔離驗收＋走查（682803c）：AC#1–#4 ✅（PKCE S256 對 RFC 7636 向量、金鑰只送 openrouter.ai、匯出／同步不含金鑰、5 種畸形容錯、:free／NVIDIA 守衛、乾跑可重現）、守衛 5/5、computed 色全吻合；FAIL P0 付費模型 id 撐破設定頁（360／320 特大）。P2：無 state（PKCE 已涵蓋）、無 CSP、callback 失敗路徑缺測、尾逗號 regex 會改字串內容、marked key。退修。

2026-10-02 走查 P0 修正（f90882c）：AI 卡 grid-cols-[minmax(0,1fr)]＋openrouter-narrow.spec 16 項（修前 12 紅、溢出 7–722px）；P2 尾逗號字串感知、marked key 用起點、callback 失敗 e2e 2 條；unit 538、e2e 148。接受。待 TASK-13、14 併入後 merge main 再 squash；AC#4 評測分天跑，卡停 In Review。
2026-10-03 merge main（66914ed）：App 端 AC#1–#3 驗收 PASS；合併 TASK-13／14／A1 後整合驗收 PASS（id/key 不錯位、FSRS 不受影響、三能力皆無仍可完成、openrouter.ai 真實外送 0）。卡維持 In Review：AC#4 評測真打每日台北 08:05 後分天跑（0/160，prompt v2）。P2 移 TASK-22：e2e lesson.ts 的 advanced 模組層旗標可能跨測試殘留；lessonRun 不記題型與自評／AI 批改區別。
<!-- SECTION:NOTES:END -->


## Comments
<!-- COMMENTS:BEGIN -->
---
created: 2026-10-04 20:30
---
10-04 v3（405febe）：prompt 台灣繁中、含簡體才 OpenCC twp 轉換（動態載入）、fallback max_tokens 4096。代決：逐字表改 OpenCC；純繁體不轉；大陸用語依創辦人「不刁難」不擴術語表；已知限制：繁簡混雜句同形字。v3 重評由 cron 每日 08:14 跑（qwen、apodex 各 40）。
---
<!-- COMMENTS:END -->
