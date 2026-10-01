# 英文學習 Web App(手機版、母語繁中、開源免費)技術與資料調查

調查日:2026-10-01。標記規則:**[一手]** = 官方文件／論文／repo／授權原文;**[二手]** = 部落格、論壇、搜尋摘要,未能取得一手來源;**[實測]** = 本次直接呼叫 API／registry 取得。

---

## 1. 間隔重複(Spaced Repetition)

### 1.1 Ebbinghaus 原始研究 vs 坊間「5分/30分/12h/1/2/4/7/15天」表

- **原始研究** [一手]:Ebbinghaus (1885)《Über das Gedächtnis》第 7 章,自己背無意義音節,測的是「重學節省量(savings)」而非「記得幾 %」。七個間隔與節省率:20 分 58%、1 小時 44%、9 小時 36%、1 天 34%、2 天 28%、6 天 25%、31 天 21%。
  來源:https://psychclassics.yorku.ca/Ebbinghaus/memory7.htm
- **重製研究** [一手]:Murre & Dros (2015, PLOS ONE) 照原方法重做,曲線非常接近原始資料;另發現 24 小時點有上跳(推測和睡眠鞏固有關)。
  來源:https://journals.plos.org/plosone/article?id=10.1371/journal.pone.0120644
- **坊間「5分/30分/12h/1/2/4/7/15天」表** [二手/查無一手]:Ebbinghaus 原文沒有這張表,他也沒有提出「依此表複習」的排程。中文網路廣泛流傳的「艾賓浩斯複習表」找不到可以追溯的原始出處(論文或書),判定為後人依遺忘曲線概念自行編的經驗表。注意:坊間常說的「20 分鐘忘 58%」是把 savings 誤讀成遺忘率。
  搜尋紀錄(都是二手):https://supermemo.guru/wiki/Hermann_Ebbinghaus_(1885)_and_spaced_repetition_(1985)

### 1.2 SM-2 [一手]

來源:https://www.supermemo.com/en/blog/application-of-a-computer-to-improve-the-results-obtained-in-working-with-the-supermemo-method(Wozniak,1987–1990)

- 初始 EF = 2.5
- I(1) = 1 天,I(2) = 6 天,n>2 時 I(n) = I(n-1) × EF
- EF' = EF + (0.1 − (5−q) × (0.08 + (5−q) × 0.02)),q 是 0–5 分的作答品質
- EF 下限 1.3
- q < 3:從 I(1) 重新開始,但 EF 不變

### 1.3 FSRS / ts-fsrs

- **ts-fsrs** [一手+實測]:MIT 授權,https://github.com/open-spaced-repetition/ts-fsrs
  - npm `latest` = **5.4.2**(2026-09-01 發布),`beta` = 6.0.0-beta.12 [實測 registry.npmjs.org]
  - 5.4.2 的 dist 實作 **FSRS-6.0**(從 tarball 字串查到)[實測]
  - 預設值(來源:`packages/fsrs/src/constant.ts`)[一手]:
    - `request_retention` = **0.9**(desired retention)
    - `maximum_interval` = 36500
    - `enable_fuzz` = false
    - `enable_short_term` = true
    - `learning_steps` = **['1m','10m']**
    - `relearning_steps` = **['10m']**
    - `w` 共 21 個參數(FSRS-6)
- FSRS 演算法本身的版本:目前是 FSRS-6,有 21 參數;舊版 FSRS-5 是 19 參數(後面這點屬背景知識,沒有另外核對一手來源)。

### 1.4 Duolingo Half-Life Regression [一手]

- Settles & Meeder (2016), "A Trainable Spaced Repetition Model for Language Learning", ACL 2016, pp.1848–1858, DOI 10.18653/v1/P16-1174
  https://aclanthology.org/P16-1174/
- 模型:p = 2^(−Δ/h),h = 2^(Θ·x)。h 是半衰期,x 是特徵(答對/答錯次數、詞彙標籤等)
- 結果:預測回憶率的誤差比多個 baseline 少 **45% 以上**(MAE:HLR 0.128,Leitner 0.235);線上 A/B 測試的**每日使用者參與度提升 12%**
- 程式與 1,290 萬筆學習紀錄:https://github.com/duolingo/halflife-regression(MIT),資料放在 Harvard Dataverse doi:10.7910/DVN/N8XJME

### 1.5 建議方案

- **排程核心直接用 ts-fsrs 5.4.2(FSRS-6、MIT)**,在瀏覽器端跑、沒有後端成本。預設 retention 0.9 和 learning steps 1m/10m 可以直接用。
- 冷啟動用預設 w;使用者累積幾百筆複習紀錄後,再考慮用 FSRS optimizer 做個人化(屬可選功能)。
- 不要用「艾賓浩斯表」,它沒有實證來源。UI 可以把 FSRS 算出的下次到期日顯示成「下次複習:3 天後」。
- HLR 需要大量資料才訓練得起來,不適合單機開源 App;只作設計參考(例如把詞彙難度當特徵)。

---

## 2. 多益分級與單字表

### 2.1 ETS 官方 TOEIC ↔ CEFR 最低分 [一手]

來源:https://www.ets.org/pdfs/toeic/toeic-mapping-cefr-reference.pdf(©2025 ETS;Tannenbaum & Wylie 的標準設定研究,22 位專家)

| 測驗 | 分數範圍 | A1 | A2 | B1 | B2 | C1 |
|---|---|---|---|---|---|---|
| Listening | 5–495 | 60 | 110 | 275 | 400 | 490 |
| Reading | 5–495 | 60 | 115 | 275 | 385 | 455 |
| Speaking | 0–200 | 50 | 90 | 120 | 160 | 180 |
| Writing | 0–200 | 30 | 70 | 120 | 150 | 180 |

- 表中沒有 C2。Reading C1 只有 45% 專家同意;S&W 的分數經過 ETS 調整。
- ETS 明說這只是參考準則,不建議當成硬性切點。
- L&R **沒有官方的總分 CEFR 門檻**。坊間「總分 785 = B2、945 = C1」是把聽、讀兩科相加得到的,屬推算。

### 2.2 多益單字表

- **官方單字表**:ETS 沒有公開的官方多益單字表(本次在 ETS 網站上找不到)。
- **TSL(TOEIC Service List)** [一手]:Browne & Culligan,版本 1.2
  https://www.newgeneralservicelist.com/toeic-service-list
  - 1,250 字,語料是 150 萬字的多益備考教材;和 NGSL 2,809 字合併後,對多益試題的覆蓋率約 98.5%
  - 有頻率排名、簡易英文釋義、詞形還原(lemmatized)版;格式有 CSV/TXT/XLSX
  - 授權 **CC BY-SA 4.0**
- **NGSL 家族** [一手]:
  - NGSL 1.2(2023-04)共 2,809 字,號稱一般英文覆蓋率 92% 以上,對多益文本 94%,授權 CC BY-SA 4.0
  - 其他清單:NAWL(學術)、BSL(商務)、NGSL-Spoken、New Dolch、NGSL-GR 等。網站說明「Free under Creative Commons, including commercial use」
  - 有頻率統計,**沒有 CEFR 分級**,也沒有中文翻譯
  - https://www.newgeneralservicelist.com/new-general-service-list

### 2.3 CEFR 分級單字表的授權

| 清單 | 內容 | 授權 | 能否放進開源 repo |
|---|---|---|---|
| CEFR-J Wordlist 1.6 [一手] | 7,801 詞:A1 1,166 / A2 1,411 / B1 2,445 / B2 2,779 | 標明出處即可「研究教育及商用皆免費」;如需監修等服務另議收費。沒有指定標準開源授權 | **可以**,但要附完整引用:「CEFR-J Wordlist Version 1.6 東京外國語大學投野由紀夫研究室」。建議在 README 註明「非 OSI 授權」 |
| Octanove Vocabulary Profile C1/C2 [一手] | 補 CEFR-J 沒有的 C1/C2 | **CC BY-SA 4.0** | 可以(資料檔要維持 BY-SA) |
| English Vocabulary Profile(Cambridge)[二手] | 約 7,000 詞頭、含片語 | 線上免費查詢;商用資料要向 Cambridge 申請授權並付費(dictionary-api.cambridge.org) | **不可以** |
| Oxford 3000/5000(OUP)[二手] | 3000 詞 A1–B2;5000 詞加到 C1 | OUP 版權。官網兩度回 403,抓不到條款原文;沒有找到任何開放授權聲明 | **不可以**(保守判斷) |

- CEFR-J/Octanove 已整理好的 repo:https://github.com/openlanguageprofiles/olp-en-cefrj
- CEFR-J 官方下載與條款:https://www.cefr-j.org/download.html
- Cambridge 資料授權:https://dictionary-api.cambridge.org/

### 2.4 結論

- **課綱分級軸用 CEFR(A1–C1)**,多益分數只作為外部對照:A2 = L110/R115,B1 = L275/R275,B2 = L400/R385,C1 = L490/R455。CEFR 有公開可用的詞表,多益沒有官方詞表。
- **單字資料用兩層**:
  1. 分級:CEFR-J 1.6(A1–B2)加 Octanove(C1/C2)
  2. 多益主題標籤:TSL 1.2 加 NGSL 1.2(CC BY-SA),用來標「多益高頻」
- 授權處理:BY-SA 會傳染。建議把這些資料放在獨立的 `data/` 目錄,單獨以 CC BY-SA 4.0 發布;程式碼另用 MIT。Oxford 和 EVP 不要放。

---

## 3. 點單字翻譯(英 → 繁中)

### 3.1 Google 翻譯

- **Cloud Translation 官方 API** [一手]:
  - 每月前 50 萬字元免費(Basic 和 Advanced 都適用;Advanced 是以每月 $10 抵用額的形式給)
  - 超過之後每百萬字元 $20
  - **必須綁定計費帳戶**(文件原文:"You must enable billing to use Cloud Translation")
  - 計價:https://cloud.google.com/products/translate/pricing
  - 設定:https://docs.cloud.google.com/translate/docs/setup
  - 對開源前端 App 的影響:API key 會暴露在前端,需要後端代理;而且它只做文字翻譯,不是字典,沒有詞性和音標
- **非官方端點**(`translate.googleapis.com/translate_a/single?client=gtx` 這類):沒有文件、沒有 SLA。Google 服務條款禁止用自動化方式違反機器可讀指示存取內容,也禁止逆向工程。有被封鎖或格式突然改變的風險,**不建議**用在要散布的開源產品。
  - 條款:https://policies.google.com/terms
  - 判斷依據是條款通則,沒有找到針對這個端點的專門條文

### 3.2 替代方案

- **ECDICT** [一手]:https://github.com/skywind3000/ECDICT
  - **MIT** 授權
  - 基礎版 76 萬詞條,完整版 222 萬
  - 欄位:音標、英文釋義、**中文釋義(簡體)**、詞性、Collins 星級、是否屬 Oxford 3000、考試標籤(中考/高考/CET4/TOEFL/IELTS…)、BNC 與當代語料詞頻、詞形變化
  - 格式:CSV/SQLite/StarDict/MDX
  - 最後主版本 1.0.14(2017-04)
  - **需要 OpenCC 轉繁體**:用 `s2twp` 設定(含台灣用語),可在建置階段先轉好;OpenCC 是 Apache-2.0,有官方 JS 版 opencc-js(https://github.com/BYVoid/OpenCC)
  - 簡轉繁之後仍要人工抽查用語,例如「軟件 → 軟體」靠 s2twp 處理,但釋義內的大陸慣用說法不一定會被轉換
- **Free Dictionary API**(dictionaryapi.dev)[一手]:
  - 回傳音標、發音音檔、詞性、英英釋義、例句、同反義詞
  - **只有英英,沒有中文**
  - repo 標 GPL-3.0,資料來源是爬 Google Dictionary
  - 作者自述每月超過 1,000 萬次請求、AWS 成本吃緊,需要捐款支撐
  - 適合當英英補充,不適合當主要來源
  - https://dictionaryapi.dev/ ,https://github.com/meetDeveloper/freeDictionaryAPI
- **Wiktionary 衍生資料** [一手]:
  - 授權 CC BY-SA 4.0 + GFDL 雙授權(https://en.wiktionary.org/wiki/Wiktionary:Copyrights)
  - kaikki.org 的 wiktextract 每週更新 JSONL:英文版 2.8GB 壓縮;中文維基詞典另有 222MB 壓縮檔(https://kaikki.org/dictionary/rawdata.html)
  - 英文 Wiktionary 詞條常附「Translations → Chinese (Mandarin)」,繁簡並列,但覆蓋率不一致。這點屬背景知識,沒有逐項驗證

### 3.3 推薦

**以 ECDICT 為主**:建置時用 OpenCC s2twp 轉繁,依 CEFR-J/NGSL 詞表裁成約 2–3 萬詞的子集,做成靜態 JSON/SQLite-wasm 離線包。不靠任何 API,而且 MIT 可以重新散布。

片語、搭配、例句的中文解釋交給第 5 節的 LLM(使用者自帶金鑰)即時補。英英釋義與發音可選擇性串 dictionaryapi.dev。

---

## 4. 瀏覽器端 TTS / STT(手機)

### 4.1 iOS Safari 的 WebGPU [一手]

Safari **26.0** 起,macOS、iOS、iPadOS、visionOS 都**預設開啟 WebGPU**。
https://webkit.org/blog/17333/webkit-features-in-safari-26-0/

iOS 26 之前的版本沒有 WebGPU,只能退回 WASM。

### 4.2 iOS 的 WASM 記憶體上限 [一手]

WebKit Bug 269777(2024-02,iOS 17):
- 首次載入約可配置 1GB,重新整理後只剩 300–500MB,極端情況 28MB(iPhone Xs)
- 超過上限時分頁會直接被關掉,沒有可攔截的錯誤
- 已併入 bug 269937(WASM memory / Gigacage 碎片化問題)
- https://bugs.webkit.org/show_bug.cgi?id=269777

這是 iOS 26 是否已改善**沒有查到一手資料**。設計時要假設穩定可用的只有約 300MB。

### 4.3 Kokoro-82M / kokoro-js

- kokoro-js npm 1.2.1(2025-05),Apache-2.0;支援 WebGPU、WASM;dtype 有 fp32/fp16/q8/q4/q4f16 [一手+實測]
  https://github.com/hexgrad/kokoro/tree/main/kokoro.js
- **只有美式和英式英文的聲音**,沒有中文 TTS
- ONNX 檔大小 [實測 HF API,onnx-community/Kokoro-82M-v1.0-ONNX]:

| 版本 | 大小 |
|---|---|
| fp32 | 325.5MB |
| fp16 | 163.2MB |
| q4f16 | 154.6MB |
| quantized(q8) | 92.4MB |
| q8f16 | 86.0MB |

- 速度:
  - [二手] 有 benchmark 部落格寫 M2 MacBook Air 用 WebGPU fp32 的 RTF 是 0.2–0.4;一般 x86 筆電用 WASM int8 單執行緒約 1.1(https://offlinetts.com/blog/browser-tts-showdown-kokoro-piper-kitten/)
  - **找不到可信的手機實測數據**
  - HN 討論串(2025-02,iOS 26 之前)[二手、軼事]:Android 中低階機產生一段示範文字要 20–30 秒;iPhone/iPad Safari 有多起當掉回報;部分三星 Chrome 出現雜音(https://hn.svelte.dev/item/42973769)
- 判斷:手機上可以當「預先生成、快取」用,不適合當即時互動的主要方案。第一次下載至少約 90MB。

### 4.4 Whisper(transformers.js)

ONNX 大小取 encoder + decoder_merged [實測 HF API,onnx-community/whisper-*.en]:

| 模型 | fp32 | int8/quantized |
|---|---|---|
| tiny.en | 33 + 119 ≈ 152MB | 10 + 31 ≈ 41MB |
| base.en | 83 + 209 ≈ 291MB | 23 + 54 ≈ 77MB |
| small.en | 353 + 615 ≈ 968MB | 92 + 157 ≈ 249MB |

英文 WER,LibriSpeech test-clean / test-other(引自 Moonshine 論文表格)[一手]:
- tiny.en:5.66 / 15.45
- base.en:4.25 / 10.35
- small.en:本次沒有取得一手數字

transformers.js 最新版 `@huggingface/transformers` 4.3.0(2026-09-16)[實測]。

判斷:手機上 tiny.en/base.en 的 int8 版本可行;small.en 在 iOS 的記憶體上限下風險高。

### 4.5 Moonshine(更小的英文 ASR)[一手]

- 論文 arXiv 2410.15608:https://arxiv.org/html/2410.15608
  - Tiny 2,710 萬參數,Base 6,150 萬參數
  - 處理 10 秒語音的運算量比 Whisper tiny.en 少 5 倍
  - LibriSpeech clean/other WER:Tiny 4.52/11.71,Base 3.23/8.18,都優於同級 Whisper
- **有瀏覽器版**:
  - `@moonshine-ai/moonshine-js` 0.1.29(MIT,2025-07)[實測 npm]
  - transformers.js 也可以直接載入 onnx-community/moonshine-*-ONNX
- 大小 [實測]:tiny int8 約 8 + 20 = 28MB,base int8 約 21 + 42 = 63MB
- 授權:英文模型 MIT;非英文的舊版模型是非商用的 Moonshine Community License(https://github.com/moonshine-ai/moonshine)

### 4.6 Web Speech API 當後備 [一手]

- MDN:SpeechRecognition **預設會把語音送到伺服器**辨識,有隱私疑慮,也不能離線。新規格提供 `processLocally = true` 加 `SpeechRecognition.available()/install()`,可下載語言包在裝置上辨識,但瀏覽器支援程度不一。
  - https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API/Using_the_Web_Speech_API
  - https://developer.mozilla.org/en-US/docs/Web/API/SpeechRecognition
- speechSynthesis 用作業系統內建的聲音:iOS/Android 都有不錯的英文聲音,而且**有繁中聲音**,零下載。
- 以下屬背景知識,未逐項核對:Chrome 的辨識送到 Google 伺服器;Safari 走 Apple 的語音服務;Firefox 不支援 SpeechRecognition。

### 4.7 建議

- **TTS**:預設用 Web Speech speechSynthesis(零下載、有中英文);Kokoro 當「高品質英文聲音」選配,WebGPU 可用時才提供,而且先生成再快取。
- **STT**:
  - 預設用 Moonshine tiny 的 int8 版(約 28MB),跑 WebGPU,沒有就退回 WASM
  - 發音評分需要更高準確度時,讓使用者選 base(約 63MB)
  - Web Speech 辨識只當最後後備,並在 UI 告知「語音會傳到瀏覽器廠商的伺服器」
- 全部模型存進 Cache Storage,並在下載前詢問使用者(行動數據的流量考量)。

---

## 5. OpenRouter

- **計價** [一手]:
  - 模型價格照供應商原價轉收,推論不加價
  - 買點數的手續費:Stripe 5.5%(最低 $0.80),加密貨幣 5%
  - 沒有月費訂閱,用儲值點數
  - 預設不記錄 prompt 和回應內容
  - 免費模型的規則:有記錄或會用資料訓練的供應商,只有在使用者開啟訓練選項後才會收到請求
  - https://openrouter.ai/docs/faq
- **`:free` 模型速率限制** [一手]:
  - 每分鐘 20 次
  - 每日上限:累計儲值未滿 $10 的帳號 **50 次/天**;累計儲值 ≥ $10 的帳號 **1,000 次/天**(UTC 換日重置)
  - https://openrouter.ai/docs/api/reference/limits
- **OAuth PKCE(讓終端使用者用自己的帳號授權)** [一手]:**支援**,純前端就能做:
  1. 導向 `https://openrouter.ai/auth?callback_url=…&code_challenge=…&code_challenge_method=S256`
  2. 拿回 `code`,POST 到 `/api/v1/auth/keys` 換到**使用者自己的 API key**,用量算在使用者帳上
  - code 10 分鐘內有效
  - https://openrouter.ai/docs/guides/overview/auth/oauth
- **BYOK** [一手]:OpenRouter 的 BYOK 是指「把 OpenAI/Vertex 等供應商的金鑰交給 OpenRouter 代為路由」。費用是原價的 5%,但每月有 $25,000 的免費額度(按牌價計)。這和「終端使用者自帶 OpenRouter 金鑰」是兩回事;後者直接用 PKCE,或讓使用者貼上 key 就可以。
  - https://openrouter.ai/docs/guides/overview/auth/byok
- **文法糾錯 + 繁中解釋的模型候選**(2026-10-01 從 `/api/v1/models` 實測,共 462 個模型,其中 16 個 :free)[實測]:

  免費:
  - `google/gemma-4-31b-it:free`、`google/gemma-4-26b-a4b-it:free`:多語能力好,中文解釋可用
  - `qwen/qwen3.8-27b:free`:中文強
  - 這些都受 50 或 1,000 次/天限制

  付費、低價(單位:美元/百萬 token,輸入/輸出):

  | 模型 | 輸入 | 輸出 |
  |---|---|---|
  | `openai/gpt-5-nano` | 0.05 | 0.40 |
  | `google/gemini-2.5-flash-lite` | 0.10 | 0.40 |
  | `qwen/qwen3.7-flash` | 0.03 | 0.13 |
  | `deepseek/deepseek-v3.2` | 0.28 | 0.42 |
  | `openai/gpt-4o-mini` | 0.15 | 0.60 |
  | `openai/gpt-5.4-mini` | 0.75 | 4.5 |
  | `google/gemini-3.5-flash-lite` | 0.30 | 2.5 |

  - 品質優先的 `anthropic/claude-haiku-4.5` 是 1/5
  - **以上候選都還沒做實際的繁中糾錯品質評測**。建議用 20–30 句台灣學習者的典型錯句做小型盲測再決定預設模型,並在 prompt 明確要求「繁體中文(台灣用語)」。
- **建議**:App 只做「Sign in with OpenRouter(PKCE)」,金鑰只存在使用者瀏覽器,專案方零成本。預設模型挑一個 :free 模型,UI 顯示每日剩餘次數(可用 `GET /api/v1/key` 的 `free_model_daily_requests` 欄位);額度用完時引導使用者切換到低價付費模型。

---

## 未能取得一手來源／待補

1. 「5分/30分/12h/1/2/4/7/15天」表的原始出處:查無,判為坊間經驗表
2. Oxford 3000/5000 授權條款原文(官網回 403);EVP 授權條款原文
3. Whisper small.en 的英文 WER 一手數字
4. Kokoro 在手機(尤其是 iOS 26 之後)的可信實測速度
5. iOS 26 是否已改善 WASM 記憶體上限
6. 各 LLM 的繁中文法糾錯品質(需要自行評測)
