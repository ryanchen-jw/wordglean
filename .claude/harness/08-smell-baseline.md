# 代碼異味基線(Standards 軸審查用)

> 來源:Fowler《Refactoring》smell 目錄選 12 條。
> 消費方式:執行長派驗收官/Standards 軸審查時**貼本檔全文**進 prompt(03 模板 D);執行長親審 diff 時對照。分工:05 管介面品質、本檔管代碼品質。
>
> 三條約束(先讀再用):
> 1. repo 明文規範(該專案 CLAUDE.md/lint 設定)優先於本基線,衝突以 repo 為準
> 2. 每條都是 judgement call——發現列「觀察」供執行長裁量(PASS/FAIL 不受影響)
> 3. 工具已管的跳過:linter/typecheck/formatter 能抓的(未用變數/型別錯/格式)

## 12 條基線(是什麼 → 怎麼修)

1. **Mysterious Name**:名字看不出用途或與行為不符 → 改名到「讀名即知」,必要時先拆函式再命名
2. **Duplicated Code**:同邏輯 ≥2 處 → 抽函式/上提共用層;結構偶似但將各自演化的可放過
3. **Feature Envy**:函式取用別家資料多於自己的 → 把函式搬去資料所在處
4. **Data Clumps**:同一組參數/欄位總是結伴出現 → 抽成物件/dataclass,給群組一個名字
5. **Primitive Obsession**:裸 str/int/dict 表達領域概念(金額/日期區間/狀態) → 引入小值物件或 Enum
6. **Repeated Switches**:同一組型別/狀態判斷在多處重複 → 多型、策略表或 dict dispatch 收斂一處
7. **Shotgun Surgery**:改一個行為要動很多檔 → 把散落邏輯收斂進單一模組
8. **Divergent Change**:同一模組因多種不相干原因常被改 → 按變更原因拆開
9. **Speculative Generality**:為「未來可能」加的抽象/參數/hook 無人用 → 刪到剛好夠用
10. **Message Chains**:a.b().c().d() 一路挖 → 起點提供所需查詢,或把邏輯搬到鏈末端
11. **Middle Man**:方法一半只是轉手委派 → 呼叫方直接找真正做事者,刪空殼
12. **Refused Bequest**:子類只用父類一小角、其餘覆寫成 no-op → 改組合或下推,不硬繼承
