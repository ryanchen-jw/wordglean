# 2026-10-06 驗收紀錄：片語課（TASK-24）、成長儀表板（TASK-26）、品牌定版（TASK-25）

| 項目 | commit | 驗收 | 重點 |
|---|---|---|---|
| A2、B1 片語課 35 課 557 題 | 0270b14 | 第③關（A2 FIX 9／SUS 27、B1 FIX 54／SUS 34）→ 修正 → 81 題位重新盲答全一致 | 翻譯要點一律收非片語正確說法；「姊」統一 |
| B2、C1 片語課 33 課 523 題 | db32bae | 第③關（B2 FIX 17／SUS 38、C1 FIX 31／SUS 24）→ 修正 → 89 判題點重新盲答全一致 | PHRASE_ITEMS_PENDING_LEVELS 清空；check-items 1052 課全綠 |
| App 支援片語課（W5） | 61593c6 | 隔離驗收首輪 FAIL（片語表進首屏無守衛）→ 第二輪 PASS | 題目檔對照表移出首屏 199.42→183.21 kB；首屏預算 >200KB 警告、>300KB 失敗（創辦人裁示） |
| 首頁「我的成長」卡 | db43f94 | 隔離驗收 PASS（手算 R 與程度） | 計算延遲載入；最高程度只存本機 |
| 品牌：拾字（Wordglean） | 58dd447 | 隔離驗收 PASS（圖示與定稿逐位元組一致） | 資料庫名、localStorage key 未改 |

- 測試（最後一輪）：unit 993 綠；e2e chromium、webkit 全綠（webkit narrow.spec:87 字典彈層為 main 既有偶發）。
- 已知待處理：come up with／figure out 第一義相同、give out／hand out 同義（data/phrases）；Dictionary.test、HomeScreen.test 滿載偶發；成長卡跨午夜不自動重算。
- 截圖（本機）：docs/pending/2026-10-06-{task24-w5-shots,task24-w5-verify2,growth-shots,growth-verify,brand-shots,brand-verify}/
