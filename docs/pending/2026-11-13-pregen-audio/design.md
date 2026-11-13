# TASK-35 第一階段：預先產生發音音檔——設計與試產量測

> 卡片：`backlog/tasks/task-35 - 發音改為預先產生音檔、按需載入，移除手機端模型下載.md`。本文件只是設計＋試產結果，**不改 app 程式碼**；第二階段等執行長確認後才做。
> 試產腳本：`pilot/pregen.mjs`（產生）、`pilot/summarize.mjs`（彙整）、`pilot/estimate.mjs`（全量推估＋包格式自檢）。輸出在 `pilot/out/`（gitignore）。

## 0. 先更正的事實（實測）

`node pilot/pregen.mjs --count` 依 app 實際呼叫端（見 §1.4）抽出全部要發音的文字：

| 項目 | 數量 |
|---|---|
| 題目檔（課） | **1,052**（卡片寫 1,054；`content/items/{a1..c1}/*.json` 實數 1,052） |
| 單字卡 word（單字） | 7,630 |
| 單字卡 word（含空格：468 個片語＋lexicon 多字詞） | 609 |
| 句子（聽音打字＋跟讀 3,156、聽音選答 1,052） | 4,208 |
| **總段數** | **12,447**（片語 468 已含在單字卡 8,239 內，不是另加） |
| 跨課重複的文字 | 0（正規化後每段文字只出現在一課） |

## 1. 設計

### 1.1 腳本放哪

- 產生工具：`content/audio-gen/`——獨立 package（自己的 `package.json`／lock，依賴 `kokoro-js 1.2.1`，與 app 現用版本相同）。**不併進 `content/package.json`**：kokoro-js 會帶進 onnxruntime-node＋transformers.js（試產 node_modules 721 MB），併進去會讓 content 的 CI `npm ci` 變重。
- 產物：`content/audio/<級>/<lessonId>.lga`（一課一包，§1.3）。
- 校驗（不需模型，進 CI）：`content/test/audio.test.mjs`——每課都要有包、包內文字集合＝該課要發音的文字、包標頭的產生參數＝目前設定；不符列出「待重產的課」。
- 文字正規化與「哪些題目欄位要發音」只寫一份：`app/src/speech/clipKey.ts`，content 端以 Node 22 型別剝除直接 import（前例：`content/scripts/llm-eval.mjs` import `app/src/llm/*.ts`）。
- 外部工具：ffmpeg（libmp3lame）。只在產生音檔的機器需要，CI 不需要。

### 1.2 音檔格式

- **MP3、單聲道、24 kHz（Kokoro 原生取樣率，不重取樣）、CBR**。iOS Safari 與 Android Chrome 都原生支援 MPEG-2 Layer III 24 kHz。ffmpeg 參數 `-map_metadata -1 -fflags +bitexact`（不寫中繼資料，位元組可重現）。
- 位元率：試產 32 kbps 與 48 kbps 兩版（§2），**待創辦人試聽裁示**（§4-1）。
- 頭尾靜音裁切：Kokoro 輸出頭尾約有 0.5–0.7 秒靜音（單字原始 1.27 秒→裁後 0.57 秒）。以振幅門檻 0.003、保留 60 ms 邊界裁掉——檔案小約四成，按下去到出聲也更快。裁切是否切到字尾子音要人耳確認（§3 試聽檔）。
- 速度：一律以 speed 1 產生；**慢速 0.8 用 `HTMLAudioElement.playbackRate = 0.8`**（`preservesPitch` 預設開，音高不變），不另產生。不用 Web Audio 的 `AudioBufferSourceNode.playbackRate`——它會連音高一起降。

### 1.3 分組與檔案數

- **一課一包**：該課所有發音段（單字卡的字／片語、聽打、聽選、跟讀句）串成一個檔。格式（試產已實作並自檢）：
  `"LGA1"`（4 bytes）＋ uint32LE 標頭長度 ＋ 標頭 JSON `{v, gen, clips: {文字: [位移, 長度]}}` ＋ 依序串接的 MP3。
  `gen`＝產生參數（模型、音色、dtype、kokoro-js 版本、位元率、裁切參數），重產比對用。
- 檔案數：**1,052 個包**；加上目前預快取約 2,738 檔，部署總數約 3,800，遠低於 2 萬上限；日後課程增加也是一課加一檔。
- 不採「一段一檔」：12,447 檔＋2,738≈15,200，雖在上限內但餘裕小，而且每課要 12–16 個請求。
- 不採「依雜湊分片的大包＋Range 取片段」：Cloudflare Pages **不支援 Range**（官方：「Pages currently returns `200` responses for HTTP range requests」，https://developers.cloudflare.com/pages/configuration/serving-pages/ ，2026-11-13 讀），本設計整包下載、不依賴 Range。
- 每包大小（§2 實測）：A1 課 47 KB（32k）／70 KB（48k）；B1 片語課 68／101 KB。全量平均約 73／110 KB。

### 1.4 文字怎麼對到音檔（含正規化與同字多義）

現行呼叫端（實查 `speak(` 呼叫處）：WordCardView、MatchingView、DictionarySheet 念 `word`／`headword`／`phrase.phrase`；ListenParts 念 `sentenceEn`（聽打）、`audioEn`（聽選）；ShadowingView 念 `sentenceEn`。單字卡例句 `exampleEn` 目前**沒有**發音鈕，不產生。

正規化 `clipKey(text, kind)`：
1. Unicode NFC；彎引號 `‘’“”` → `'` `"`；連續空白併成一個空格、去頭尾空白。
2. **字與片語（kind=word）轉小寫**（March／march 在課綱已併為一字，發音相同）；**句子保留大小寫與標點**——標點影響語調（`?`、逗號停頓），大小寫影響專有名詞判讀。
3. 包標頭的鍵就是正規化後的文字本身（可讀、好除錯）；查找時先 clipKey 再查。

同字多義／同形異音：**同一拼字共用一個音檔**（全課綱一字只引入一次，本來就只會產一份）。限制：同形異音字（read、live、lead、close、wind…）單字卡只會有 Kokoro 預設的那個念法；句子內的由上下文決定、不受影響。第二階段可加一份人工覆寫表（字→送進 Kokoro 的替代文字），本階段不做。

### 1.5 按需載入與快取（不進預快取）

- app 端以 `import.meta.glob('../../../content/audio/*/*.lga', { query: '?url', import: 'default' })` 取得「課 → 帶雜湊的網址」對照表，**照 `src/lesson/itemUrls.ts` 的作法只以 `import()` 延遲載入**（不進首屏，`scripts/check-entry-lazy.mjs` 加守這個檔）。Vite 會把包複製到 `dist/assets/<名>-<雜湊>.lga`，內容變了網址就變，舊快取自然失效，不需自訂 manifest。
- 預快取：workbox `globPatterns` 是 `**/*.{js,css,html,json,svg,png}`，`.lga` 本來就不在內；第二階段再加一條測試斷言「`sw.js` 的預快取清單不含 `.lga`」。
- 執行期快取：workbox `runtimeCaching` 加一條 `/\.lga$/` → `CacheFirst`、cacheName `lg-audio`、`maxEntries: 1200`（全量也只約 77–115 MB）、`purgeOnQuotaError: true`。
- 何時抓：進入小課（LessonScreen 拿到 lessonId）就抓該課的包；複習開始時抓本次卡片 `courseRefs` 涉及的課（`review/session.ts` 已知每張卡的來源課）。包下載後在記憶體解析成 `Map<文字, Blob(audio/mpeg)>`，只留最近幾課。
- HTTP 標頭：Pages 對靜態檔預設 `Cache-Control: public, max-age=0, must-revalidate`＋ETag（同上官方頁）。因為有 service worker CacheFirst，第二次起不經網路，**不需要 `_headers`**；若要讓沒有 SW 的情況也長快取，可加 `/assets/*` → `public, max-age=31536000, immutable`（檔名帶雜湊才安全；限 100 條規則、每行 2,000 字，https://developers.cloudflare.com/pages/configuration/headers/ ）。列為可選，不在預設範圍。
- MIME：官方未記載 `.lga` 這類未知副檔名的 Content-Type；app 以 `fetch().arrayBuffer()` 讀、切片後自己包成 `Blob({type:'audio/mpeg'})`，與伺服器 Content-Type 無關。

### 1.6 複習與字典如何找到音檔（不只在該課頁面）

- **複習**：卡片本來就由來源課題目檔出卡，知道 lessonId → 抓那幾課的包。配對題在複習中（每 4 張到期卡一題）的字也都來自這些課。
- **字典**：點字後 DictionarySheet 念 `headword`／片語。需要「字 → 課」對照：由已預快取的課綱級距檔（`content/curriculum/{a1..c1}.json`，`curriculum/load.ts` 的 `loadLevel`）第一次查字時建一張 `Map<小寫字或片語, lessonId>`，再抓該課的包。課綱外的字（字典 12.4 萬詞條的其餘部分）找不到 → 手機內建聲音（卡片裁示）。
- 已知邊界：字典若顯示的是變化形本身的詞條（例如 headword 為 does 而非 do），課綱查不到 → 內建聲音。第二階段實作時查 `lookup.ts` 回傳的是原形還是變化形再定。

### 1.7 離線行為

- 已進過的課（包在 `lg-audio`）→ 離線照樣播預產音檔。
- 沒進過的課、字典點到沒抓過的課 → 離線抓不到 → 這一次改用手機內建聲音，不提示錯誤（AC#4）。
- 等待上限：包還在下載時按發音，等最多約 1.5 秒（第二階段以實測定），超過就這一次用內建聲音；包到了之後下一次就用預產音檔。

### 1.8 與 TASK-31／32（tts.ts、useSpeak.ts）銜接

- `createTts` 的 `hq` 引擎換成「預產音檔引擎」`clips`：`speak(text, rate)` → 有片段就播；沒有或失敗 → reject，由 tts 改用 system。**`latest` 計數（TASK-31：最後一次為準）與 `cancel()`（TASK-32：離開畫面停止）的骨架不動**，只換引擎；`useSpeak.ts` 不用改。
- 與現行 hq 的差異：找不到片段是常態（課綱外的字），**不觸發 `hqFailed` 那種「整個 session 不再試」的退回**——逐句判斷。播放失敗（NotAllowedError 等）才逐句退回。
- 播放：重用**同一個** `HTMLAudioElement`（換 `src` 為 Blob URL）。iOS Safari 的自動播放限制是以元素為單位：第一次使用者點擊時播放過的元素之後可由程式播放；每次 `new Audio()`（現行 `playWav` 的寫法）在單字卡進場自動念時可能被擋。**此點在 Playwright WebKit（Windows build）無法驗證**，依 memory 的手機驗收規則列為「未驗項」。
- `ttsAvailable()`：改為「有內建聲音」或「預產音檔可用（有 `Audio` 且能播 audio/mpeg）」。
- `engine()` 給 ListenParts 顯示「手機內建聲音」提示用：改成依文字判斷（該句有沒有片段）；這會動到題目卡的提示文案 → 列給創辦人逐字審。

### 1.9 授權

- 音檔內容：句子音檔是題目文字（CC BY-SA 4.0）的衍生，**音檔整包標 CC BY-SA 4.0**；`content/CLAUDE.md` 授權分界表與 `content/README.md`、`NOTICE` 加一列 `audio/`，註明「以 Kokoro-82M（Apache-2.0）音色 af_heart 合成」。
- 模型：Kokoro-82M 權重 Apache-2.0；產生工具 kokoro-js（Apache-2.0）、phonemizer 內含 eSpeak NG（GPL-3.0-or-later）**只在開發端產生時使用、不隨 app 散布**；合成出來的音檔不受工具授權約束。
- 移除手機端模型後，NOTICE 現有「高音質發音」段落（NOTICE:76–82）的 kokoro-js／phonemizer／eSpeak NG 不再隨程式散布，改寫為「開發端產生音檔所用工具」；transformers.js／onnxruntime 仍因語音辨識（Moonshine）保留。

### 1.10 放進 git 的體積與替代方案

- 現況：repo pack 約 34 MB（`git count-objects -vH`）。
- 全量音檔（推估，§2.3）：32k 約 **77 MB**、48k 約 **115 MB**。MP3 已壓縮，git 無法再壓。
- 日後重產：只改某課一句 → 只重寫該課一包（平均 73–110 KB），歷史多存一份。全量重產（換位元率、換裁切參數、kokoro-js 改版）＝再加 77–115 MB 到歷史，不可回收（除非改寫歷史）。所以 `gen` 參數要在第二階段一次定案。
- GitHub 單檔上限 100 MB、建議 repo < 1 GB：一課一包單檔 < 0.2 MB，不受影響。
- 替代方案 Cloudflare R2：免費額度 10 GB-月儲存、每月 Class A 100 萬／Class B 1,000 萬次、出站流量免費（https://developers.cloudflare.com/r2/pricing/ ）。但 `r2.dev` 公開網址「rate-limited and should only be used for development purposes」（https://developers.cloudflare.com/r2/buckets/public-buckets/ ），正式使用需自訂網域；而拾字已裁示只留 pages.dev、不買網域。另需設 CORS、部署流程多一步上傳、離線快取與版本對應要自己做。**結論：預設放 repo**；若日後要涵蓋字典 12.4 萬詞條（約 0.4 GB 級）再評估 R2＋自訂網域。

## 2. 試產與量測（實測）

環境：本機 Windows、22 核 CPU、無 NVIDIA GPU；Node 22.20、kokoro-js 1.2.1（transformers.js 3.8.1，onnxruntime-node），`dtype: fp32`、`device: cpu`、音色 af_heart、speed 1；ffmpeg 9.0（libmp3lame）。單一行程、逐段串行。產生期間空閒記憶體均高於 2.5 GB（腳本內建閘門，未觸發暫停）。

模型載入＋暖機：11.4 秒（模型已快取；首次另需下載約 310 MB）。

### 2.1 兩課試產

| 課 | 類別 | 段數 | 平均秒數（裁後／原始） | 平均大小 32k | 平均大小 48k | 平均產生耗時 |
|---|---|---|---|---|---|---|
| a1-u01-l03（A1 主題課，含單字卡→配對、聽打、聽選、跟讀） | 單字 | 8 | 0.57／1.27 s | 2.5 KB | 3.7 KB | 360 ms |
|  | 句子 | 4 | 1.58／2.21 s | 6.6 KB | 9.8 KB | 882 ms |
| b1-p01-l01（B1 片語課） | 片語 | 7 | 0.75／1.41 s | 3.3 KB | 4.9 KB | 706 ms |
|  | 句子 | 4 | 2.70／3.36 s | 11.1 KB | 16.6 KB | 1,506 ms |

| 課 | 包大小 32k | 包大小 48k | 整課產生耗時 |
|---|---|---|---|
| a1-u01-l03（12 段） | 46.7 KB | 69.7 KB | 6.4 s |
| b1-p01-l01（11 段） | 67.5 KB | 100.9 KB | 11.0 s |

包格式自檢：解析 a1-u01-l03 32k 包、取出 `do` 片段，ffprobe：24000 Hz、單聲道、32 kbps、0.624 s，可獨立播放。

### 2.2 校準抽樣（全課程等距抽樣，實測）

兩課偏 A1 短字（試產單字平均 3 字元，全課程平均 7.2），另以 `pregen.mjs --calibrate` 從全課程等距取單字 40、片語 15、句子 30（A1–C1 都有）量測：

| 類別 | 樣本 | 平均秒數 | 平均大小 32k | 平均產生耗時 |
|---|---|---|---|---|
| 單字 | 40 | 0.74 s | 3.2 KB | 442 ms |
| 片語／多字詞 | 15 | 0.85 s | 3.7 KB | 615 ms |
| 句子 | 30 | 2.92 s | 11.9 KB | 1,342 ms |

### 2.3 全量推估（**推估**：校準樣本平均 × 全量段數；48k 以兩課 48k/32k 實測比 1.49 換算）

| 項目 | 32 kbps | 48 kbps |
|---|---|---|
| 總大小 | 約 77 MB | 約 115 MB |
| 每課平均包 | 約 73 KB | 約 110 KB |
| 檔案數 | 1,052 包（部署總數約 3,800） | 同左 |
| 音訊總長 | 約 5.1 小時 | 同左 |
| 產生總時間（單行程、本機 CPU） | 約 2.6 小時（＋ffmpeg 編碼，試產中可忽略） | 同左 |

產生時間可用 2–3 個行程分級距平行縮短，但每行程記憶體峰值本次未量，第二階段先量再決定（依 memory：空閒 ≥4 GB 才加開）。

## 3. 試聽檔（`pilot/out/`，gitignore；32k／48k 成對）

- 單字 this：`pilot/out/a1-u01-l03/02-word-c2543fff.{32k,48k}.mp3`
- A1 句子 We have lunch at twelve.：`pilot/out/a1-u01-l03/09-sentence-499c4ceb.{32k,48k}.mp3`
- 片語 come up with：`pilot/out/b1-p01-l01/06-word-b236b19e.{32k,48k}.mp3`
- B1 句子 My grandparents brought me up, and we lived in a town by the sea.：`pilot/out/b1-p01-l01/09-sentence-8a68ac47.{32k,48k}.mp3`
- C1 句子（校準樣本，僅 32k）The critic wrote a scathing review, …：`pilot/out/calib/85-sentence.32k.mp3`

試聽重點：32k 與 48k 的齒擦音（s、th）差別；字尾子音是否被裁切切掉；與現行手機端高音質（同模型）是否一致。

## 4. 待裁示

1. **位元率 32k 或 48k**——建議 48k：學發音的齒擦音清楚度較重要；每課只多約 37 KB、repo 多約 38 MB。若試聽聽不出差別就用 32k。
2. **頭尾靜音裁切**——建議採用（小四成、按下即出聲）；試聽若有切字尾就調低門檻或加長邊界。
3. **同形異音字覆寫表**——建議第二階段先不做，上線後有人回報再加。
4. **`_headers` 長快取 `/assets/*`**——建議不做（SW 已 CacheFirst）。

## 5. 第二階段切分與預估 diff

| 段 | 內容 | 預估 diff |
|---|---|---|
| 2a 內容 | `content/audio-gen/`（產生＋只補新增或變更：讀舊包、`gen` 相同且文字仍需要的片段原樣保留）、`app/src/speech/clipKey.ts`、`content/test/audio.test.mjs`、全量產生 1,052 包、授權標示 | 程式約 +350 行；二進位 1,052 檔約 77–115 MB；產生約 2.6 小時 |
| 2b App 接上 | `src/speech/clips.ts`（對照表延遲載入、抓包解析、播放、等待上限）、tts.ts 換引擎、LessonScreen／review 預抓、字典字→課對照、workbox runtimeCaching、check-entry-lazy、單元測試與 e2e（以假包驗證「有片段播片段、無片段走內建、慢速 playbackRate、連按最後一次、離開停止、不在預快取」） | 約 +450／−60 行 |
| 2c 移除舊功能 | hqVoice／kokoro.worker／kokoroProtocol、設定頁高音質選項與下載列、`download/download.ts` 中高音質的部分（下載元件語音辨識仍在用，保留）、/debug/voice（VoiceDiagnosticsScreen＋routes）、tts-hq.spec、playwright.tts.config、e2e:tts、vite.config 的 kokoro 條目、kokoro-js 依賴；更新 privacy、NOTICE、credits.ts、README、app/CLAUDE.md；設定頁語音區文案列給創辦人逐字審 | 約 −1,800／+150 行 |

建議順序 2a → 2b → 2c；2b、2c 可同一 worker 依序做（2c 依賴 2b 的新引擎）。

## 6. 第二階段實作紀錄（與上方設計不同處）

- 裁示（執行長轉創辦人，2026-11-13）：48 kbps、頭尾靜音裁切採用、不做同形異音覆寫表與 `_headers`；兩字以上連念（片語）一律要有預產音檔；字典含連字號的字也預產（字典專用包）。
- 字典專用包：`data/dict` 各切片詞條含連字號者（12,289 個，小寫去重），以 FNV-1a 32 位元雜湊 `% 512` 分包（`clipKey.ts` 的 `dictPackOf`），App 與產生端算同一包，**不需字→包對照表**；包網址表與課程包同在 `audioUrls.ts`（只以 `import()` 取得）。日後加字只動該字所在的一包。
- 字典點到片語：468 個片語全都是片語課的單字卡（逐一核對，缺 0），依課綱字→課找到課的包。
- 並行實測：同機 3 個行程各自吃滿 CPU（onnxruntime 預設多執行緒），每行程慢 5–6 倍、總吞吐反而低於單行程，改為單行程跑完。
- 聽題卡的「手機內建聲音」標示、高音質首次提示與失敗提示、播放鈕忙碌標示一併拿掉（皆為高音質而設）。
