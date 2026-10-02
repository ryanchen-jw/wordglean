# TASK-14 說——Moonshine STT 整合與跟讀題：proposal（SDD）

> 2026-10-02 Round 1 計畫經執行長核准（D1–D8 全照建議）即為簽核。規格權威：`docs/spec/requirements.md` §6（G2 裁示）；畫面權威：`docs/design/v1.0` s04。

## 1. 範圍

做：逐字比對；Moonshine STT（Web Worker、分時載入、限輸出長度）；錄音（按鈕開始／結束，不做 VAD）與麥克風權限；跟讀題（設計 s04 七個狀態：idle／recording／busy／confirm／result／denied／stt-download）；每次送出寫入 speechCorrections；Web Speech 後備（需同意）；10 句音檔實測。
不做：音素級發音評分；新增 DB 版本或 migration（`speechCorrections` 本機表、雲端 `speech_corrections`、同步都已存在）。

## 2. 執行長裁示（Round 1，2026-10-02）

| # | 裁示 | 實作 |
|---|---|---|
| D1 | 不做「模型聽錯」標記；**每次送出都寫一筆紀錄**（沒改也寫） | `recognizedText`＝辨識原文、`correctedText`＝送出句。AC#3 回報為「文字與 G2 衝突，待創辦人改 AC」，不自行勾選 |
| D2 | 「跳過」計為答錯 | `onAnswer({ correct:false, usedHint:false })`；跟讀 `srsWord:null`，不寫 FSRS |
| D3 | 以第一次送出計分；result 的「再唸一次」只當練習，但仍寫紀錄 | 引擎維持每步只答一次 |
| D4 | 先顯示下載鈕（約 50–80MB），按了才下載 | **設計偏差**：s04 只畫了「下載中」 |
| D5 | transformers.js 鎖定 3.8.1（TASK-13 用同一版） | `package.json` 精確版號 |
| D6 | 回饋條第二行改為目標句＋中譯 | **設計偏差**：設計稿的逐題提示文字，題目檔沒有對應欄位 |
| D7 | 模型從 HF hub 下載，ort wasm 放本站 | 「下載模型會連 Hugging Face」轉交 TASK-21 隱私說明 |
| D8 | 只在 Moonshine 不可用時提出 Web Speech，同意只在本次開 App 期間有效 | 不新增設定項 |

合併順序：TASK-16 → TASK-13 → 本卡。queue 題數與 e2e 題數由本卡（後併者）負責對齊。

## 3. 受測 seam（寫死，測試只打這些）

| Stage | seam | 測什麼 |
|---|---|---|
| 1 | `app/src/speech/align.ts`：`compareWords(target, said): Comparison` | AC#1 |
| 2 | `app/src/speech/sttEngine.ts`：`createSttEngine(pipeline, device)`（精度、輸出上限、推論鏈；推論為假）；`app/src/speech/stt.ts`：`createSttClient({ createWorker, isCached })`（`refresh`／`load`／`transcribe`／`acquire`，狀態以 `get`／`subscribe` 讀；Worker 為假）；`app/src/speech/mic.ts`：`micPermission`／`startRecording`（瀏覽器 API 為假） | 單元測試 |
| 3 | 引擎題型 `shadowingType`（`lesson/queue.ts` 的 `SPEAK_TYPES`）；`data/repo.addSpeechCorrection`（寫一筆＋outbox，同一交易）；畫面經 `LessonScreen`＋`SpeechContext`（`speech/services.ts`，測試注入假的辨識與麥克風） | AC#3 寫紀錄的那一半；元件測試 |

> Stage 3 實作調整：紀錄不從 `session.answerStep` 寫（原計畫加選填欄位），改由題型畫面的 `onSpeech` 回呼交給 `LessonScreen`，再呼叫 `addSpeechCorrection`。原因是 D3 之後的練習送出不經過 `answerStep`，這樣兩種送出走同一條路，也完全不用改 session.ts。
| 4 | `speech/webSpeech.ts`：沒同意前不建立 `SpeechRecognition` | AC#4（單元）＋e2e 錄音到辨識全程無上傳請求 |
| 5 | Playwright（獨立 config、不進 CI）：真模型跑 10 句 LibriSpeech | AC#2 正確率 |

## 4. 逐字比對規則（Stage 1）

- **斷字**：以空白和「字母間的連字號」斷開（`well-known`＝2 字）。頭尾標點去掉；保留 `$`、`%`、縮寫的點（`a.m.`、`Mr.`）、字中撇號。彎撇號視同直撇號。
- **一個原字可展開成多個比對字**：
  - 縮寫：`I'm`→i am；`can't`／`cannot`→can not；`won't`→will not；`shan't`→shall not；`let's`→let us；`<助動詞>n't`→<助動詞> not；代名詞＋`'s`→<代名詞> is；`'re／'ll／'ve／'d`→are／will／have／would；`Mr／Mrs／Ms／Dr／OK`→mister／missus／miz／doctor／okay。其餘撇號與點直接拿掉（所有格 john's→johns、o'clock→oclock、a.m.→am）。
  - 數字（0–9999）：一律轉成英文字（21→twenty one、1,000→one thousand）；序數 1st→first、22nd→twenty second；時間 3:30→three thirty、5:00→five oclock、9:05→nine oh five；小數 3.5→three point five；`$5`→five dollars；`50%`→fifty percent。
  - 已知不處理：「a hundred」對「100」、「one hundred and five」裡的 and、年份唸法（1990→nineteen ninety）。兩邊都寫數字時不受影響。
- **對齊**：在比對字層級做 Levenshtein。漏字、多字成本各 1；替換成本＝兩字的字母編輯距離÷較長的字長（0–1），讓相近的字（meeting／meetings）優先配對。回溯遇到同分時，順序是配對＞漏字＞多字。
- **判定**：
  - 目標字：每個比對字都配對且相同＝對；全部漏掉＝漏字；其餘（含縮寫只唸到一半）＝錯字。
  - 送出字：對到的目標字整個是對的、而且自己的比對字都相同＝對；全部對不到＝多字；其餘＝錯字。
- **計分**：`得分 correct／total 字`，total＝目標原字數。多字不扣得分，但不算全對。`perfect`＝沒有錯字、漏字、多字，也就是引擎的 `correct`。
- **畫面**：送出句依原本寫法逐字顯示；整個漏掉的目標字插一個佔位。畫面上「錯字 n」＝`wrong + extra`、「漏字 n」＝`missing`。

## 5. 偏差紀錄

1. D4 下載鈕（設計只畫下載中）。
2. D6 回饋條第二行改為目標句＋中譯。
3. result 狀態的送出句尾不補目標句的標點（設計範例 `next ＿＿?` 的 `?` 來自目標句）；送出句照使用者原樣顯示。
4. 設計未畫、依元件規格組合的狀態，新增的佔位文案（draft-pending-G3）：
   - `lesson.shadowing.modelTitleIdle`「需要下載語音辨識模型」、`modelBodyIdle`（取 s04 下載說明的前半句）：用在 D4 的下載前狀態。
   - `recPreparing`「語音辨識準備中…」：模型已在快取、正在載入。
   - `recFailed`「錄音或轉文字失敗，請再唸一次」。
   - `recUnsupported`「這個瀏覽器無法錄音」：瀏覽器沒有錄音 API。Stage 4 的 Web Speech 後備會從這裡提出。
5. 「轉文字中」照 s04 畫面用「（錄音不會上傳）」；components.md 寫的是「（不會上傳）」，以畫面為準。
6. 模型下載進度卡沿用 s04 畫面版型：標題列＋百分比、全寬進度條、說明。沒有直接用設定頁的 `DownloadProgress` 元件，因為它是行內右側版型。

## 6. Stage 劃分

0–1 proposal＋比對演算法（純邏輯）→ 2 STT 服務＋錄音／權限＋下載狀態 → 3 跟讀題畫面＋紀錄＋e2e 題數對齊 → 4 Web Speech 後備＋無上傳 e2e → 5 10 句實測（chromium，記憶體閘門 ≥3GB）→ 6 視覺 smoke（s04 × 兩引擎＋窄螢幕）＋smoke 實跑＋驗收證據。

## 7. 驗收結果（2026-10-02，worktree-task-14-shadowing）

| AC | 狀態 | 證據 |
|---|---|---|
| #1 逐字比對 ≥15 組 | ✅ 23 組（含縮寫、數字、漏字、多字）；突變 5 種皆被抓到 | `app/src/speech/align.test.ts` |
| #2 預錄 10 句整合測試＋正確率 | ✅ **98.8%**（251 字錯 3；WASM；平均約 1.6 秒／句），3 次重跑相同 | `app/e2e-speech/stt-real.spec.ts`；`evidence/run{1,2,3}-stt-accuracy.json` |
| #3 修正後分數不變＋標記＋紀錄 | ⚠️ 文字與 G2 裁示衝突待改 AC；依裁示實作「以送出句計分、不標記、每次送出寫紀錄」並有測試 | `ShadowingView.test.tsx`、`repo.test.ts` |
| #4 Web Speech 需同意＋錄音無上傳 | ✅ 同意閘單元＋畫面測試；真模型下錄音開始到出現辨識結果之間 0 個網路請求、整個測試 0 個帶內容的上傳；連線主機只有本站與 Hugging Face（模型下載） | `webSpeech.test.ts`、`ShadowingView.test.tsx`、`evidence/run*-mic-path.json`、`run*-network-hosts.json` |

發現與限制：
- 假麥克風（Chromium 循環播放 LibriSpeech 0007）錄到的片段常含「整句＋空檔＋下一輪開頭殘句」，tiny 對尾端殘句偶爾輸出空字串（實測約 1/3–1/2 次；同一段切掉殘句即可辨識）。曾試「辨識前修剪頭尾靜音」，反證實驗未改善 → 撤回、不加入。產品端已有確認步驟可改字或再唸一次（空字串時「送出」停用）。e2e 改為斷言「錄到聲音＋零請求＋轉文字完成」，內容正確率由 10 句乾淨音檔驗證。
- 合併 main（TASK-16）後 service worker 會在背景預快取數百個字典切片；量「錄音期間零請求」前先等網路安靜 3 秒（未放寬斷言）。
- 未驗：iOS 真機 Safari（MediaRecorder 輸出 mp4／WebGPU）、Android 真機、學習者口音正確率、真機記憶體上限——依「手機版驗收一律模擬」原則以 Playwright 模擬代替；Windows 版 WebKit 沒有 MediaRecorder／Web Audio，webkit 只驗畫面（假辨識）。
- 文案：跟讀改用 TASK-4 定稿 key（`speak.*`）；定稿未涵蓋的 13 則（準備中、失敗、不支援、下載前、差一點、漏字、後備 5 則等）列入 `_pendingG3` 待審。

## 8. 併入 TASK-18（main e0979c9）後的接法

- 跟讀題經 `buildLessonQueue`（題型穿插）組裝；能力偵測 `detectCapabilities(speech.sttUsable)`：
  STT 可用＝能錄音（getUserMedia＋MediaRecorder＋Web Audio）且有 WebAssembly，或本次已同意瀏覽器語音辨識。不可用時照 TASK-18 規則改成聽音打字（TASK-13 未併入前聽音打字未登記，該題略過）。
- 因此「瀏覽器不能錄音／沒有 WebAssembly」時跟讀題不會出現，後備同意框實際只會在「模型載入失敗」時提出；ShadowingView 內的「這個瀏覽器無法錄音」狀態保留為防禦用（能力在開課時判斷，作答中情況改變時仍有出口）。
- e2e 主套件以 `VITE_E2E_STT=off` 固定 STT 不可用：Windows 版 WebKit 本來就不能錄音，兩引擎一致走替代路徑、題數與 main 相同；跟讀本身由 `playwright.speech.config.ts` 驗（作答到出現跟讀題，不依賴題號）。

## 9. 併入 TASK-13／TASK-8（main a9d1490）與 AC#3 新文字

AC#3（創辦人 2026-10-02 改寫）：「以使用者確認／修正後送出的句子與目標句比對計分；辨識結果與送出句的差異寫入紀錄（speech_corrections），有測試」——現有實作符合，對應測試：

| 要求 | 測試（檔案 › 名稱） |
|---|---|
| 以送出句計分（不是辨識結果） | `ShadowingView.test.tsx` › 修正後送出：以送出句計分（全對）；記一筆辨識原文 vs 送出句並排入同步；不寫 FSRS（辨識原文 6／8、改正後送出得 8／8 且該步記為答對） |
| 不修改就送出時以原句計分、逐字標錯漏 | `ShadowingView.test.tsx` › 不修改就送出：逐字標出錯字與漏字、得分 6／8；回饋「差一點」＋目標句與中譯 |
| 第一次送出計分、之後練習不改分但仍記錄 | `ShadowingView.test.tsx` › 送出後再唸一次只當練習：分數維持第一次，但每次送出都記一筆 |
| 只有送出才記錄 | `ShadowingView.test.tsx` › 確認畫面按「再唸一次」不寫紀錄；清空句子時不能送出 |
| 瀏覽器語音辨識路徑同樣寫紀錄 | `ShadowingView.test.tsx` › 同意後才用瀏覽器辨識：錄音 → 確認 → 送出並寫紀錄；不經本機辨識 |
| 紀錄內容（辨識原文、送出句、目標句）＋排入同步 | `repo.test.ts` › 跟讀紀錄（TASK-14） › 每次送出記一筆辨識原文與送出句（uuid、時間），並排入同步佇列 |
| 比對計分演算法 | `align.test.ts`（23 組，AC#1） |

本輪變更：
- 能力偵測 `detectCapabilities(ttsAvailable, sttUsable)` 兩者由呼叫端傳入並存；聽（LISTEN_TYPES）說（SPEAK_TYPES）讀三類題型並存；跟讀畫面改用 `speech/speak`（TASK-13 的發音入口）。
- 出題順序：能跟讀時一課 16 步，跟讀落在第 10、13 步（`e2e-speech/lesson-order.spec.ts` 兩引擎逐題核對）。e2e 主套件仍以 `VITE_E2E_STT=off` 固定不能跟讀（題號同 main，避免改動 TASK-12／13／18 各 spec 的題號）。
- 真模型 e2e 修正計時：原本從按下「開始錄音」就計 4 秒，但畫面要等取得麥克風（負載高時 1.9–3.0 秒）才進入錄音中，導致錄音只有 0.4–0.6 秒；改為出現「結束錄音」後再錄 4 秒，錄音長度穩定 4.1–4.5 秒（3／3）。產品行為不變。

## 10. 隔離驗收修正（2026-10-02）

| 項目 | 修法 | 測試（修前紅、修後綠） |
|---|---|---|
| P1-1 送出後再唸一次再跳過 → 整課卡死 | ShadowingView：已送出過的題按跳過只前進、不再計分；LessonScreen：作答存檔 reject 時記錄錯誤並退回當時進度、「繼續」失敗也記錄不中斷，✕ 照常；跟讀紀錄寫入失敗改為記錄錯誤（原為未處理的 rejection） | 單元：`P1-1 送出後「再唸一次」再跳過…`、`P1-1 作答存檔失敗…`；e2e：`e2e-speech/regressions.spec.ts`（兩引擎） |
| P1-2 麥克風不釋放 | 取得麥克風期間防重入（連點只取一次）；跳過或卸載後才到的串流立刻停止所有 track | 單元：`P1-2 取得麥克風期間連點兩下…`、`…按跳過…`、`…離開小課…`；e2e：`stt-real` 新步驟「麥克風釋放」（真麥克風串流，離開小課後所有 track＝ended） |
| P2-1 測試缺口 | 補模型未下載／下載中不提出後備 | `P2-1 …`（offerWeb 改成只看瀏覽器支援時會紅，已反證） |
| P2-2 得分行念不出 | 每個狀態同一位置常駐 `aria-live="polite"` 空容器，送出後才填；畫面上那行 `aria-hidden` 避免念兩次 | `P2-2 …` |
| P2-3 音量條貼光環 | 音量條 `mb-2`（距光環外緣 8px） | 視覺 smoke 截圖 |

驗收官 `verify.spec.ts` 重跑（暫存副本、埠 5352）：C——跳過後音軌 ended、再唸一次再跳過前進到 14、✕ 確認框可叫出、無頁面錯誤；A——連點兩下只開 1 條串流、離開小課後所有音軌 ended、Worker 釋放、錄音期間 0 請求。

發現（未修）：按下開始後立刻按結束（錄音近乎 0 秒），MediaRecorder 的音訊偶發無法解碼（`EncodingError`，4 次中 1 次），畫面顯示「錄音或轉文字失敗，請再唸一次」，可直接重錄、不會卡住；修正前即存在。
