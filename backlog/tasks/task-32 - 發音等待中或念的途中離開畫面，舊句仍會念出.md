---
id: TASK-32
title: 發音等待中或念的途中離開畫面，舊句仍會念出
status: In Progress
assignee: []
created_date: '2026-11-07 09:11'
labels:
  - app
dependencies: []
priority: medium
ordinal: 29000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
來源：TASK-31 驗收官找碴發現，創辦人 2026-11-07 裁示「修」。

【需求】
按了發音之後，在念出來之前（高音質載入或合成中）或念的途中離開該畫面，那一句不再念出來或立即停止。

【現況（已實證）】
- TASK-31 後發音服務以最後一次請求為準（app/src/speech/tts.ts:53），但沒有對外的取消：只有新的 speak 能取代舊的。
- 呼叫端都沒有在卸載時取消：DictionarySheet、ListenParts、MatchingView、ShadowingView、WordCardView（app/src/dict、app/src/screens/lesson）。
- 路由為自寫 history 路由（app/src/router.ts），navigate 與 popstate 共用 notify。
- 小課內換下一題是同一路由、元件卸載，所以只靠路由變化不夠。

【範圍】
做：
1. 發音服務提供取消：取代所有等待中的請求並停止正在念的（內建與高音質皆然）；被取消的請求正常結束、不出聲、不退回內建聲音、不判高音質失敗。
2. 發起發音的畫面或元件卸載時（離開頁面、返回、換下一題、關閉字典彈層），若它的請求仍是最新的就取消；已被別處新請求取代的不影響新請求。
不做：不改模型載入與預載、不停用按鈕、不加文案、不處理 App 切到背景。

【邊界】
- 延續 TASK-31（已併入 main）的 latest 機制，不重寫。
- 無其他進行中的卡。

dev-flow 情境：修 bug（先紅後綠）。
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 高音質載入或合成中離開頁面（含返回）：該句完全不出聲（先有失敗的重現測試，修後轉綠）
- [ ] #2 小課中按聽力播放後、念出前就換到下一題：舊句不出聲
- [ ] #3 關閉字典彈層：等待中或正在念的該字停止
- [ ] #4 念的途中離開畫面：立即停止（內建聲音與高音質皆然）
- [ ] #5 被取消的請求不退回內建聲音、不提示、不把高音質判為失敗；下一次發音正常
- [ ] #6 下一個畫面自己發起的發音（如單字卡自動發音）不被前一個畫面的卸載取消
- [ ] #7 TASK-31 的既有測試全綠；lint、typecheck、npm test、build 過；listen、tts-hq、lesson、matching e2e 兩引擎皆綠
<!-- AC:END -->
