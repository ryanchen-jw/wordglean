---
id: TASK-35
title: 發音改為預先產生音檔、按需載入，移除手機端模型下載
status: Done
assignee: []
created_date: '2026-11-13 02:28'
updated_date: '2026-11-13 11:59'
labels:
  - app
  - content
dependencies: []
priority: high
ordinal: 32000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
來源：創辦人 2026-11-13 裁示：發音改為預先產生音檔、按需載入，取代手機端下載 Kokoro 模型。三項決定皆照建議：字典冷門字用手機內建聲音；整個移除高音質模型下載功能；所有人預設用預先產生的聲音，沒有音檔才用內建聲音。創辦人另指出手機端模型每句延遲約 1.5–2 秒，預先產生可改善。

【需求】
課程句子、單字卡單字、片語的發音改播預先產生的音檔（同一模型與音色：Kokoro-82M、af_heart），進入課程時按需載入。使用者不必下載模型，所有手機（含 iPhone）都有好聽的發音、幾乎沒有延遲。

【現況（已實證）】
- 需要發音的固定內容（content/items 共 1054 課）：單字卡單字約 8,239 個、跟讀與聽音打字句 3,156 句、聽音選答 1,052 段，片語 468 個（data/phrases/phrases.json）。字典詞條約 12.4 萬（data/dict），本卡不涵蓋課程範圍外的字。
- 發音呼叫端：DictionarySheet（headword、片語）、ListenParts（含慢速 0.8）、MatchingView、ShadowingView、WordCardView；統一經 app/src/speech/speak.ts 與 useSpeak（TASK-32）。
- 手機端模型：app/src/speech/hqVoice.ts、kokoro.worker.ts（kokoro-js、transformers.js），設定頁語音區的高音質選項與下載列、/debug/voice 診斷頁（TASK-34）、e2e/tts-hq.spec.ts、e2e:tts。
- 文件提到模型下載：docs/privacy.md、NOTICE、app/src/screens/about/credits.ts、README。原型與取捨紀錄：docs/research/voice-poc.md。
- 本機無 NVIDIA GPU，產生音檔以 CPU 執行。
- Cloudflare Pages 免費方案每次部署上限 20,000 個檔案、單檔 25 MiB；目前預快取約 2,738 檔。

【範圍】
分兩階段，第一階段結束停下回報、等執行長確認再做第二階段。
第一階段：設計＋試產。
1. 設計：產生腳本放哪、音檔格式（必須 iOS Safari 與 Android Chrome 都能播，預設 MP3 單聲道）、檔案如何分組以遠低於 2 萬檔上限、文字到音檔的對應方式（相同文字共用）、app 如何按需載入與快取（不得進 service worker 預快取清單，避免首次開啟下載全部）、離線行為、慢速用播放速率調整而不另產生、授權標示。
2. 試產兩課（含單字卡、跟讀、聽力、配對），量測：每段平均大小、每課總量、產生速度，推估全量的時間與總大小。
第二階段：全量產生＋接上 App＋移除舊功能。
3. 全量產生課程範圍音檔並納入版控；腳本可只補產生新增或變更的文字。
4. App：發音優先播預先產生的音檔，找不到才用手機內建聲音；保留 TASK-31（最後一次為準）與 TASK-32（離開畫面取消）的行為。
5. 移除手機端模型：高音質選項、下載列、hqVoice、kokoro worker、/debug/voice、相關測試與依賴、e2e:tts；設定頁語音區只剩必要項目。
6. 更新隱私說明、NOTICE、授權頁、README、app/CLAUDE.md 中與模型下載相關的敘述。
不做：不涵蓋字典 12.4 萬詞條中課程範圍外的字、不換音色、不改題目內容、不動語音辨識（跟讀錄音的 Moonshine）。

【邊界】
- 設定頁語音區文案變動須列出供創辦人逐字審。
- TASK-34 第二階段因本卡而不再需要。
- 無其他進行中的卡。

dev-flow 情境：新功能＋移除舊功能（分階段）。
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 第一階段：設計文件與兩課試產完成，回報每段大小、每課總量、產生速度與全量推估，檔案數遠低於 2 萬上限
- [x] #2 課程範圍內的單字、句子、片語都有預先產生的音檔；腳本可重跑且只補新增或變更的文字
- [x] #3 單字卡、配對、聽音打字、聽音選答、跟讀、字典（課程範圍內的字與片語）播放預先產生的音檔；慢速以播放速率調整
- [x] #4 沒有對應音檔或載入失敗時改用手機內建聲音，不出錯
- [x] #5 首次開啟不會下載全部音檔（不在預快取清單）；進入課程才載入該課需要的音檔；已載入過的可離線播放
- [x] #6 TASK-31、32 的行為保留（連按只念最後一次、離開畫面停止），相關測試改寫後仍涵蓋
- [x] #7 手機端模型下載功能、/debug/voice、相關依賴與測試已移除；隱私說明、NOTICE、授權頁、README 已更新
- [x] #8 lint、typecheck、npm test、build 過；相關 e2e 兩引擎綠；首屏 JS 預算不惡化；部署檔案數在上限內
<!-- AC:END -->

## Comments

<!-- COMMENTS:BEGIN -->
created: 2026-11-13 11:59
---
2026-11-13 驗收通過：獨立驗收官 PASS（8 條；首屏 JS gzip 187,128→183,815 B；e2e 185 綠、跟讀假辨識 20 綠）；補件 cecee1a：預快取回 2,746 項並加上限守衛、啟動清舊高音質快取（保留 Moonshine）。課程 1,052 包 113.7MB、字典連字號 512 包 71.2MB。★ 未驗：iOS 自動播放、真機 playbackRate 音高、WebKit 離線播放。★ content npm test 未進 CI（既有缺口）。
---
<!-- COMMENTS:END -->
