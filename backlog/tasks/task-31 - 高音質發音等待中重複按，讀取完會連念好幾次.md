---
id: TASK-31
title: 高音質發音等待中重複按，讀取完會連念好幾次
status: In Progress
assignee: []
created_date: '2026-11-07 07:49'
labels:
  - app
dependencies: []
priority: high
ordinal: 28000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
來源：創辦人 2026-11-07 回報（「第一次使用的讀取會比較慢，但發音按鈕可以重複按，導致讀取成功後，會突然唸好幾次」）。

【需求】
高音質發音等待載入或合成時重複按發音鈕，等好了只念一次，且念的是最後按的那一句。

【現況（已實證，尚未重現）】
- app/src/speech/tts.ts:53 speak：每次按都各自 await 模型載入；載入完成後每一筆都依序 cancel 再 speak，彼此沒有「已被後來的請求取代」的判斷。
- app/src/speech/hqVoice.ts:121 engine.speak：讀快取、合成都是非同步，完成後直接 play。cancel（hqVoice.ts:141）只停得掉已在播放的，還在等待中的請求停不掉，所以每一筆等到後都會出聲。
- 同一句重按也會重複送合成（hqVoice.ts:129），排隊的請求還可能撞 30 秒合成逾時（hqVoice.ts:131），誤判高音質失敗。
- 設計規定發音鈕永遠可按（docs/design/v1.0/components.md:120、app/src/speech/speak.ts:2），所以不能用停用按鈕處理。
- 既有測試只驗「同時按兩次只載入一次模型」（app/src/speech/tts.test.ts:82），沒驗念幾次。
- 呼叫端：DictionarySheet、ListenParts、MatchingView、ShadowingView、WordCardView，都走 speak.ts，修在服務層即可一次涵蓋。

【範圍】
做：
1. 發音服務改成最後一次請求為準：等待中的舊請求不出聲，也不會退回內建聲音念出來；舊請求的 promise 要正常結束。
2. 同一句（相同文字＋語速）合成中再按，共用同一次合成，不重複送 Worker。
3. ListenParts 的忙碌標示維持到最後一次請求結束，不因舊請求結束而提早消失。
不做：不停用按鈕、不加新文案或新畫面、不改模型載入流程與預載策略、不改內建聲音的行為、不動 Worker 內部。

【邊界】
- 與 TASK-30 無檔案重疊（TASK-30 動設定頁、示範課 e2e），可並行。
- 正在播放時再按同一句：維持現有行為，停掉重念一次。

dev-flow 情境：修 bug（先寫重現測試，先紅後綠）。
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 模型載入中連按發音鈕 N 次：載入完成後只念一次（先有失敗的重現測試，修後轉綠）
- [ ] #2 合成中連按同一句：只送一次合成、只念一次
- [ ] #3 等待中改按另一句：只念最後按的那一句，舊句完全不出聲
- [ ] #4 等待中被取代的請求，即使載入或合成失敗，也不會用內建聲音念出舊句；高音質真的失敗時，最後一句仍退回內建聲音並提示一次
- [ ] #5 連按多次不會誤觸合成逾時而把高音質判為失敗
- [ ] #6 聽力題播放鈕的忙碌標示持續到最後一次請求結束
- [ ] #7 發音鈕全程可按；既有單元測試與 listen、tts-hq e2e 兩引擎皆綠，lint、typecheck、build 皆過
<!-- AC:END -->
