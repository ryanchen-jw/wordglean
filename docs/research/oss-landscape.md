# 開源同類專案調查（OSS Landscape）

> 2026-10-01 調查。只讀 README、目錄結構與少數關鍵檔，未 clone。
> 星數、授權、最後 commit 日期都是當天用 GitHub REST API（`gh api repos/...`、`.../commits?per_page=1`）實查；Codeberg 專案用 Codeberg API 實查。「最後 commit」指預設分支最新一筆 commit 的 committer 日期（不是 pushed_at）。
> 「AGPL 相容」判準：MIT／Apache-2.0／BSD／GPL-3.0／AGPL-3.0／LGPL-2.1-or-later／Unlicense 可以併入；GPL-2.0-only、非商用條款、沒有授權檔都不行。
> 對應規格：`docs/spec/requirements.md` v0.1；卡號指 `backlog/tasks/`。

## 1. 總表

| # | 專案 | ★ | 最後 commit | 授權 | AGPL 相容 | 技術棧 | 相關卡 |
|---|---|---|---|---|---|---|---|
| 1 | [kantord/LibreLingo](https://github.com/kantord/LibreLingo) | 2,636 | 2026-06-19（**已封存**） | AGPL-3.0 | 可 | 主線是沒做完的 Next.js 重寫；原本完整的 App 是 Svelte＋PouchDB；課程用 Python 把 YAML 匯出成 JSON | 7、8、12、13 |
| 1b | [LibreLingoRelive/LibreLingoRelive](https://codeberg.org/LibreLingoRelive/LibreLingoRelive)（Codeberg 上的延續版） | 14 | 2026-09-27 | AGPL-3.0（看過 LICENSE 原文） | 可 | SvelteKit 2＋Svelte 5、Vite 8；內含 `apps/answer-corrector` | 12、13 |
| 2 | [sanidhyy/duolingo-clone](https://github.com/sanidhyy/duolingo-clone)（Lingo） | 659 | 2026-09-24 | MIT | 可 | Next.js 16、Clerk、Drizzle＋Neon、Stripe、react-admin、zustand | 11、12（只參考 UI） |
| 3 | [baturyilmaz/wordpecker-app](https://github.com/baturyilmaz/wordpecker-app) | 2,265 | 2025-08-08 | MIT | 可 | TypeScript、MongoDB、OpenAI agents、Docker | 8、12、15 |
| 4 | [zyronon/TypeWords](https://github.com/zyronon/TypeWords) | 10,331 | 2026-09-29 | GPL-3.0 | 可 | Nuxt 4／Vue 3、Pinia、idb-keyval、**ts-fsrs ^5.2.3**；有 README.zh-TW | 10、12、13 |
| 5 | [RealKai42/qwerty-learner](https://github.com/RealKai42/qwerty-learner) | 23,284 | 2026-09-08 | GPL-3.0 | 程式可以；詞庫資料不行 | React 18＋Vite＋Tailwind＋**Dexie**＋jotai＋howler | 10、13 |
| 6 | [open-spaced-repetition/ts-fsrs](https://github.com/open-spaced-repetition/ts-fsrs) | 801 | 2026-09-02（最新版 v5.4.2，2026-09-01 發布） | MIT | 可 | TypeScript，FSRS-6；另有 binding 套件可用 WASM 在瀏覽器裡訓練參數 | 10、12、18、20 |
| 7 | [ishiko732/ts-fsrs-demo](https://github.com/ishiko732/ts-fsrs-demo) | 62 | 2026-07-24 | MIT | 可 | Next.js、Prisma、PostgreSQL、NextAuth | 10、19 |
| 8 | [leoon-hu/jiaci](https://github.com/leoon-hu/jiaci)（AI加詞） | 2 | 2026-10-01 | MIT | 可 | Next.js 15、Prisma、PostgreSQL 16、**ts-fsrs ^5.4.2**、**ECDICT**、LLM 離線預先產生詞條 | 6、8、10、11、16、18 |
| 9 | [ankitects/anki](https://github.com/ankitects/anki) | 31,682 | 2026-10-01 | AGPL-3.0-or-later（部分是 BSD-3；GitHub 判讀為 NOASSERTION，以 LICENSE 原文為準） | 可 | Rust、Python、Svelte | 10、20（只參考） |
| 10 | [simjanos-dev/LinguaCafe](https://github.com/simjanos-dev/LinguaCafe) | 1,460 | main 2025-03-19／vue3 分支 2026-08-09 | GPL-3.0 | 可 | Laravel、Vue、spaCy、Docker（記憶體可能超過 2GB） | 16 |
| 11 | [LuteOrg/lute-v3](https://github.com/LuteOrg/lute-v3) | 1,572 | 2026-09-05（develop 分支） | MIT | 可 | Python、Flask | 16 |
| 12 | [HugoFara/learning-with-texts](https://github.com/HugoFara/learning-with-texts)（LWT） | 246 | 2026-09-04 | Unlicense | 可 | PHP、MySQL | 16 |
| 13 | [huggingface/transformers.js-examples](https://github.com/huggingface/transformers.js-examples) → `moonshine-web/` | 2,100 | repo 2026-02-17；`moonshine-web/` 2025-08-02 | Apache-2.0 | 可 | React 18＋Vite 6、`@huggingface/transformers` 3.7.1、Web Worker、Silero VAD | 1、14 |
| 14 | [hexgrad/kokoro](https://github.com/hexgrad/kokoro) → `kokoro.js/`（npm `kokoro-js` 1.2.1） | 9,098 | 2025-08-06 | Apache-2.0，但相依套件 `phonemizer` 內含 **eSpeak NG（GPL-3.0）** | 可（要寫進 NOTICE） | transformers.js；可選 WASM 或 WebGPU；q8、q4、fp16 等精度 | 1、13、21 |
| 14b | [rhulha/StreamingKokoroJS](https://github.com/rhulha/StreamingKokoroJS) | 373 | 2025-06-12 | Apache-2.0 | 可 | 純 JS，瀏覽器內串流 Kokoro | 1、13 |
| 15 | [moonshine-ai/moonshine](https://github.com/moonshine-ai/moonshine) | 11,164 | 2026-08-24 | 程式 MIT；英文模型與所有串流模型 MIT；舊版非英文模型用非商用授權（看過 LICENSE 原文） | 英文可 | C++ 核心＋多語言綁定 | 1、14 |
| 16 | [Thiagohgl/ai-pronunciation-trainer](https://github.com/Thiagohgl/ai-pronunciation-trainer) | 521 | 2025-08-16 | AGPL-3.0 | 可 | Python 後端、Whisper、`WordMatching.py`（編輯距離矩陣＋DTW） | 14 |
| 17 | [Automattic/harper](https://github.com/Automattic/harper)（npm `harper.js` 2.10.0） | 16,066 | 2026-10-01 | Apache-2.0 | 可 | Rust 編成 WASM，在裝置上跑的英文文法檢查 | 15 |
| 18 | [cristianodabc/dialekt](https://github.com/cristianodabc/dialekt) | 22 | 2026-09-01 | Apache-2.0 | 可 | Elixir（Phoenix）；可接 Anthropic、OpenAI、OpenRouter | 15 |
| 19 | [mengxi-ream/read-frog](https://github.com/mengxi-ream/read-frog)（陪讀蛙） | 9,942 | 2026-10-01 | GPL-3.0 | 可 | 瀏覽器擴充、Vercel AI SDK（20 多家供應商，使用者自帶金鑰）、Edge TTS | 15、16 |
| 20 | [languagetool-org/languagetool](https://github.com/languagetool-org/languagetool) | 15,096 | 2026-10-01 | LGPL-2.1-or-later | 可 | Java 伺服器 | 15（只參考） |
| 21 | [gasparl/lextale](https://github.com/gasparl/lextale) | 7 | 2022-10-18 | BSD-2-Clause | 程式可以；題目字表的授權未核 | 純 HTML／JS＋PsychoPy | 17 |
| 22 | [WuggyCode/wuggy](https://github.com/WuggyCode/wuggy) | 30 | 2026-04-17 | 程式 MIT；語言資料子模組 `wuggy_language_plugin_data` **沒有授權檔** | 程式可；資料不可 | Python 假字產生器 | 17 |
| 22b | [crr-ugent/wuggy](https://github.com/crr-ugent/wuggy)（原版） | 8 | 2014-04-08 | GPL-2.0（LICENSE 是 v2 全文，沒看到「或更新版本」字樣） | **不可** | Python 2 | 17 |
| 23 | [englishcentral/ovlt](https://github.com/englishcentral/ovlt)（Open Vocabulary Level Test） | 10 | 2024-02-21 | MIT | 可 | Angular | 17 |
| 24 | [skywind3000/ECDICT](https://github.com/skywind3000/ECDICT) | 8,363 | 2025-03-28 | MIT | 可 | CSV、SQLite、Python 工具；附 `lemma.en.txt`（2.3MB）、`resemble.txt`、`wordroot.txt` | 6、16、17 |
| 25 | [yinyanfr/ecdict](https://github.com/yinyanfr/ecdict)（npm `ecdict`） | 5 | 未核（pushed 2022-12-28） | MIT | 可 | Node 套件，README 自己說「不適用於瀏覽器」 | 16（只參考） |

ECDICT 前端或 PWA 這一類實查**幾乎沒有像樣的專案**：GitHub 上以 ecdict 搜尋到的 JS／TS 專案最多 24★，而且都是外掛或 API 包裝，例如 pot-app 外掛（GPL-3）、coc-ecdict、raycast-ecdict。這部分沒有可以直接拿來用的，要自己做。

## 2. 分類重點與可借鑑處

### 2.1 類 Duolingo 開源 App

- **LibreLingo（#1／#1b）**：概念最接近我們的開源專案。AGPL、社群擁有、課程與程式分開授權，跟我們「程式 AGPL＋資料 CC BY-SA」的分法一樣。
  - 要注意：GitHub 主線**已封存**，而且 main 分支是沒做完的 Next.js 重寫（只有 button、card 兩個元件）。完整可用的版本在 Codeberg 的 LibreLingoRelive（Svelte）。
  - 可借鑑：
    1. 題型分類與「priority」出題順序：cards → short input／options → chips → listening，先認字再產出。見 `docs/courses/challenge.md`。
    2. 課程用 YAML 撰寫，再匯出成每個 skill 一個 JSON（`challenges[]`，每題帶 `type`、`priority`、`group`）。
    3. `apps/answer-corrector/src/index.ts`：先正規化標點、大小寫、空白，接受多個正確答案，Levenshtein 距離 ≤1 算「對，但提示正確寫法」。這幾乎就是 TASK-13 聽音打字的寬鬆比對規則，AGPL 可以直接搬。
  - 沒有的功能：FSRS、STT、LLM、分級測驗。
- **Lingo（#2）**：Duolingo UI 仿作（小課地圖、愛心、進度條、結算頁）。可參考小課進行中與結算頁的版面；但它是 Next.js＋Clerk＋Stripe 的伺服器架構，又帶遊戲化，**不建議 fork**。
- **WordPecker（#3）**：LLM 依情境與等級產生生字，提供「認識／不認識」漸進揭露。可作 TASK-8 產題 prompt 的參考；它在伺服器端呼叫 OpenAI，跟我們使用者自帶金鑰的架構不同。
- **TypeWords（#4）**：華語圈英文學習工具，有繁中 README。值得看的地方：
  1. 在 Vue 裡用 ts-fsrs 5 的寫法：`app/core/hooks/fsrs.ts` 依錯誤次數換算 Rating，Easy、Good、Hard 的門檻可以在設定裡調。這可以佐證 TASK-12 「作答結果自動換算 FSRS 評分」這條路是可行的。
  2. 錯字本、收藏、已掌握三種清單。
  3. 跟打、默寫、自測、默背多種練習模式。
- **qwerty-learner（#5）**：技術棧跟我們幾乎一樣（React、Vite、Tailwind、Dexie）。可以參考它怎麼用 Dexie 加 `dexie-export-import` 做資料匯出（TASK-11 設定頁的「匯出」）。**詞庫資料不可用**：內含紅寶書、考研等市售書詞表，版權有疑慮。

### 2.2 FSRS 與 Anki 系

- **ts-fsrs（#6）**：已經是規格選定的套件。v5 的 API 值得各卡直接引用：
  - 內建 `learning_steps: ['1m','10m']`、`relearning_steps: ['10m']`、`enable_short_term`：TASK-10 不必自己寫學習步驟。
  - `rollback(card, log)`、`forget()`、`reschedule(card, reviews)`：官方說明就是用來重播匯入的 review log、或從儲存資料重建卡片狀態，正好對應 TASK-20「卡片狀態以 review log 重放得出」的合併規則。
  - `forgetting_curve()` 可以算出可提取率（retrievability），單字庫依「熟悉度」篩選（TASK-11）可直接用。
  - `@open-spaced-repetition/binding` 可以在瀏覽器裡（WASM）用使用者自己的紀錄訓練參數，可列為未來功能。
  - 未核：開啟 `enable_fuzz` 時，重播結果是否位元組一致（fuzz 種子怎麼來沒讀原始碼）。TASK-20 AC#1 測試時要固定 fuzz 或先確認這點。
- **ts-fsrs-demo（#7）**：官方的全端範例，示範 Prisma schema 怎麼存 card 與 revlog（TASK-19 表結構可以對照）。用 Next.js 伺服器端渲染，UI 不搬。
- **Jiaci／AI加詞（#8）**：**跟我們重疊最多的單字端**：給中文母語者學英文、ts-fsrs、ECDICT、LLM 離線產生詞條後所有人共用、首頁「待學新詞／待複習／今日已完成」、站內點字從右側滑入的詞條浮層、MIT。
  - 可借鑑：
    1. `src/lib/ai/schema.ts`：LLM 產生的詞條欄位定義與驗證規則，可作 TASK-8 自動檢查器的對照。
    2. `scripts/dict.ts`、`scripts/ai-fill.ts`：ECDICT 匯入與 AI 補欄位的管線（TASK-6、TASK-8）。
    3. 它刻意「不用學習步驟、只排到天」，並把間隔達到門檻的字標為已掌握。這是可以拿來比較的另一種設計。
  - 注意：只有 2★、才剛公開、簡體、伺服器架構（Postgres），成熟度未知，只建議讀程式碼取經。
- **Anki（#9）**：只參考 review log 欄位設計與「重播紀錄得出狀態」的概念，程式太龐大，不適合重用。

### 2.3 閱讀＋點字查義

- **LinguaCafe（#10）、Lute v3（#11）、LWT（#12）** 都是「讀文章、點生字、標熟悉度、匯出到 Anki」的自架伺服器工具。可借鑑的 UX：
  1. 每個字有「熟悉度 1–5／已知／忽略」狀態，文章裡用顏色標出。這可以延伸成我們單字庫的熟悉度篩選與閱讀題標色。
  2. 點字之後就地彈出、不離開文章。
  3. 多字片語（multi-word term）也能當成一個字收藏。
- 三者都是伺服器端架構（Laravel、Flask、PHP），程式無法直接用在純前端 PWA。
- 只要讀它們的 UX，不必讀程式碼。

### 2.4 瀏覽器內 TTS／STT 與跟讀

- **transformers.js-examples `moonshine-web`（#13）**：**這是 TASK-1／14 最直接的起點**。它是 React＋Vite 的 Web Worker 範本：
  1. 先用 `supportsWebGPU()` 判斷，有就用 WebGPU、沒有退回 WASM。
  2. 依裝置選精度：WebGPU 用 decoder q4，WASM 用 q8。
  3. 用 Silero VAD 自動切出語音段，常數全集中在 `constants.js`：SPEECH_THRESHOLD 0.3、MIN_SILENCE 400ms、PAD 80ms。
  4. 載入後先用一秒空音訊暖機，提前編譯 shader。
  5. 推論請求排成 promise 鏈，因為不能同時推論。
  - 它預設用 moonshine-**base**，我們要換成 tiny。程式是 Apache-2.0，可以直接改寫進 AGPL 專案。
- **kokoro-js（#14）**、**StreamingKokoroJS（#14b）**：
  - `KokoroTTS.from_pretrained(id, {dtype, device})`，加上 `TextSplitterStream` 可以邊合成邊播。
  - **授權要注意**：kokoro-js 依賴 `phonemizer`（xenova/phonemizer.js，標 Apache-2.0），但它的 `data/espeakng.worker.data` 是 eSpeak NG 編成 WASM 的產物，而 eSpeak NG 是 GPL-3.0。GPL-3 與 AGPL-3 相容，可以用，但 TASK-21 的 NOTICE 與「授權與致謝」頁必須列出 eSpeak NG（GPL-3.0）。
- **moonshine 官方（#15）**：LICENSE 原文確認英文 tiny／base 與所有串流模型是 MIT。新版有**串流模型**，若 TASK-1 實測延遲不理想，可以列為候選。
- **ai-pronunciation-trainer（#16）**：用「辨識字 × 目標字」編輯距離矩陣做字詞對齊，再標出錯字、漏字。這跟 TASK-14 的逐字比對同一類問題。
  - 不過它用 OR-tools、DTW，對我們來說太重。用標準的 Needleman-Wunsch／Levenshtein 字詞層級對齊就夠了，只借它「多一列空白，代表漏字成本＝字長」的設計。
  - 授權是 AGPL，可以搬，但它是 Python，要改寫成 TS。

### 2.5 LLM 寫作批改與文法糾錯

- **Harper（#17）**：Apache-2.0，`harper.js` 是 WASM，**完全在裝置上跑**的英文文法檢查。可以當作「沒有金鑰時的降級加值」：除了對照參考答案自評，還能先給出規則型的拼字與文法提示。
  - 這是範圍擴充，要由創辦人決定；下載大小未核（npm 解壓後 75MB，內含多種建置，實際 wasm 大小沒量）。
- **dialekt（#18）**：
  1. 對每個 CEFR 等級寫明「不可使用超過此級的詞彙與句構」規則（`lib/dialekt/tutor.ex` 的 `cefr_rules/1`）。
  2. 規定解說（Note、Tips）**必須用母語**撰寫。
  3. 可接 OpenRouter。
  - 這三點可以直接成為 TASK-15 批改 prompt 的骨架（「等級是否合宜」欄位、繁中解釋）。
  - 它的輸出是用前綴文字逐行解析（`Correction:`），不是 JSON。這正好當反例，佐證 TASK-15 要求結構化 JSON 加容錯是對的。
- **read-frog（#19）**：瀏覽器端用 Vercel AI SDK 接 20 多家供應商、使用者自帶金鑰，可以自訂「結構化輸出欄位」的動作。可參考它怎麼在瀏覽器直接呼叫供應商、管理金鑰與選擇模型的設定 UI。
- **LanguageTool（#20）**：規則庫最完整，但要 Java 伺服器，跟我們不寫後端的架構不合，只當參考。

### 2.6 CEFR／詞彙量測驗（Yes/No、假字）

- **LexTALE（#21）**：最標準的 Yes/No 詞彙測驗加假字實作，純 JS。
  - 計分用「平均正確率」：（真字答對率＋假字答對率）÷ 2。這個公式天然懲罰「全勾」灌水，比 TASK-17 草擬的「勾假字率校正」更簡單，而且有文獻依據（Lemhöfer & Broersma 2012）。
  - 它的題目字表來自論文，授權未核，**不要直接用它的字表**；計分邏輯可以參考。
- **Wuggy（#22）**：心理語言學標準的假字產生器，依音節與轉移機率產生「像英文但不是英文」的字。
  - 新版程式是 MIT，可用；英文語言資料子模組沒有授權檔，不可用；原版 crr-ugent 是 GPL-2.0，不可用。
  - 做法：在 TASK-17 的建置腳本裡，用 Wuggy 的演算法搭配**我們自己的 lexicon** 產生假字，產物進 repo；或只參考它的音節轉移方法，自己寫一個簡化版。
- **oVLT（#23）**：開源、以 CEFR 計分的詞彙等級測驗，有規格文件（Google Doc／OSF）。它是選擇題形式的 VLT，不是 Yes/No，但「依各級答對率推定 CEFR」的分級邏輯可以和 TASK-17 互相對照。最後 commit 是 2024 年，維護停滯。

### 2.7 英漢字典（ECDICT）

- **ECDICT（#24）** 本身就提供 TASK-16 最需要的兩樣東西：
  1. `exchange` 欄位：記錄詞形變化，`p` 過去式、`d` 過去分詞、`i` 現在分詞、`3` 第三人稱單數、`s` 複數、`0` 原形、`1` 變化類型。
  2. **`lemma.en.txt`**：作者掃描 BNC 一億詞產生的詞形還原表，README 自稱 95% 可查到。
  - 結論：TASK-16 「輕量規則＋詞形欄位」可以改成「先查 lemma.en.txt 與 exchange，查不到才退回規則」，工作量與錯誤率都會下降。
- **⚠️ 授權地雷**：ECDICT 有 `oxford` 欄位（是否屬牛津 3000）與 `collins` 星級。規格明定**不可使用 Oxford 3000**，TASK-6 匯入時應丟掉 `oxford` 欄位，`collins` 也建議一併丟掉（Collins 星級的資料出處有疑慮，保守處理）。`tag` 欄（中考、高考、CET4、TOEFL 等）屬於中國考試標籤，對台灣使用者沒有用，也建議丟掉。

## 3. 結論

### (a) 有沒有已經做到大部分功能的專案？——沒有

| 候選 | 覆蓋我們的功能 | 缺 | 判斷 |
|---|---|---|---|
| LibreLingo／Relive | 題型引擎、課程 JSON、聽力題、寬鬆比對、AGPL | FSRS、STT、LLM、分級測驗、繁中；技術棧是 Svelte（我們是 React）；GitHub 主線已封存 | fork 等於換框架又要補一半以上功能 → **不 fork** |
| Jiaci | FSRS 單字池、ECDICT、LLM 預產詞條、首頁今日任務 | 題型（聽說寫）、課綱、分級測驗、離線 PWA；靠伺服器（Postgres）、簡體；只有 2★ | 只涵蓋 TASK-10／16 的一部分 → **參考** |
| TypeWords | FSRS、打字式聽寫、收藏與錯字本 | 說、寫、課綱、分級；技術棧 Vue／Nuxt | **參考** |

建議：**自建，逐點參考**。理由：
1. 我們的組合（純前端 PWA＋瀏覽器內 TTS 與 STT＋使用者自帶 OpenRouter 金鑰＋Supabase）沒有任何專案同時具備。
2. 最接近的兩個在框架（Svelte／Vue）或架構（伺服器）上都跟我們不同。
3. 真正可以直接搬的是「小模組」，不是整個 App。

### (b) 最值得借鑑的前 5 名

1. **transformers.js-examples `moonshine-web`**（Apache-2.0）→ TASK-1、14：整套 Worker 範本直接改寫，包含 WebGPU／WASM 偵測、依裝置選精度、Silero VAD 自動斷句、暖機、推論排隊。只要把模型換成 tiny。
2. **ts-fsrs v5 的進階 API**（MIT）→ TASK-10、18、20：內建 learning／relearning steps，以及 `reschedule`、`rollback` 重播 review log，可以直接撐起合併規則。
3. **ECDICT 的 `lemma.en.txt`＋`exchange`**（MIT）→ TASK-6、16：詞形還原改用現成資料表；同時要排除 `oxford` 欄位這個授權地雷。
4. **LibreLingo `answer-corrector`＋題型 priority 設計**（AGPL）→ TASK-12、13：正規化、多個正確答案、Levenshtein ≤1 容錯提示，可以原樣移植成 TS；出題順序由易到難。
5. **LexTALE 計分＋Wuggy 假字演算法**（BSD-2／MIT）→ TASK-17：用平均正確率抓灌水；假字用 Wuggy 的方法搭配自家 lexicon 產生。

次要參考：
- Jiaci（詞條 schema 與 AI 補欄位腳本 → TASK-8）
- dialekt（CEFR 分級 prompt 與母語解說 → TASK-15）
- Harper（無金鑰時的裝置端文法提示 → TASK-15，需要創辦人決定）
- TypeWords（錯誤次數換算 Rating → TASK-12）

### (c) 對既有任務卡的修改建議（只建議，未改檔）

| 卡 | 建議 | 影響 |
|---|---|---|
| TASK-1 | 範圍寫明「以 transformers.js-examples `moonshine-web`、kokoro-js 為起點改寫」，不從零做 Worker。AC#3 加一項：記錄 Silero VAD 的額外記憶體。 | **可縮短** |
| TASK-6 | 範圍加：① 丟棄 ECDICT 的 `oxford`、`collins`、`tag` 欄（授權與在地性）；② `lemma.en.txt` 一起切片，供 TASK-16 使用。AC#1 加一項：「lexicon 不含任何 Oxford 3000 衍生欄位」的守衛測試。 | 範圍小增、風險下降 |
| TASK-10 | 範圍註明直接用 ts-fsrs v5 內建的 `learning_steps`、`relearning_steps`、`forgetting_curve`，不自己寫步驟邏輯。AC#1 不變。 | **可縮短** |
| TASK-12 | 作答結果換算 FSRS 評分的規則，可參考 TypeWords 的「錯誤次數換算 Rating」門檻可調設計。題型順序參考 LibreLingo 的 priority。 | 設計依據補強 |
| TASK-13 | 聽音打字的寬鬆比對規則直接移植 LibreLingo `answer-corrector`：正規化、多個正確答案、距離 ≤1 視為對但給提示。AC#3 可寫成「移植的比對器通過原規則的等價測試＋本專案縮寫與數字案例」。 | **可縮短** |
| TASK-14 | 逐字比對用 Levenshtein 字詞層級對齊（借 ai-pronunciation-trainer 的漏字成本設計，不引入 OR-tools 與 DTW）。STT 服務以 `moonshine-web` worker 為底，**考慮用 VAD 自動停錄**（UX 決策，需確認）。 | 縮短；多一個 UX 選項 |
| TASK-15 | 批改 prompt 參考 dialekt：每級 CEFR 用字規則、解說強制繁中。可選擇加「無金鑰時用 Harper（WASM）給規則型提示」（要擴充範圍、需創辦人決定；若採用，AC#3 要改）。 | 設計依據補強；可選擴充 |
| TASK-16 | 範圍的詞形還原改成「先查 ECDICT `lemma.en.txt` 與 `exchange`，查不到才退回規則」。AC#1 的 30 例保留，但預期大多由資料表命中。 | **可縮短**、準確度上升 |
| TASK-17 | ① 評分演算法改用（或至少對照）LexTALE 平均正確率，取代自訂的「勾假字率校正」；② 假字產生器參考 Wuggy（MIT）的音節轉移法，搭配自家 lexicon，**不得使用 Wuggy 的英文語言資料（無授權）或原版 GPL-2 程式**。AC#2 不變；建議加一條 AC：「計分公式的文獻出處寫入報告」。 | 演算法有文獻依據 |
| TASK-20 | 合併規則實作以 ts-fsrs `reschedule(card, reviews)` 重播。AC#1 要固定 `enable_fuzz` 或先驗證 fuzz 重播的結果是否一致（未核）。 | 縮短、補一個風險點 |
| TASK-21 | NOTICE 與授權致謝頁必列：eSpeak NG（GPL-3.0，經 kokoro-js → phonemizer 帶入）、transformers.js（Apache-2.0）、Silero VAD 模型授權（未核，要補查）、ECDICT `lemma.en.txt`（MIT，出自 BNC 語料統計），以及任何移植自 LibreLingo（AGPL）的程式碼出處。 | 補漏 |
| TASK-8 | 自動檢查器可對照 Jiaci 的 `src/lib/ai/schema.ts`（詞條欄位與驗證規則）。 | 參考 |

## 4. 未核與限制

- LexTALE 題目字表的授權、Silero VAD 模型授權、harper.js 的實際 wasm 大小、ts-fsrs 開啟 fuzz 時重播是否一致：都沒有查到一手資料。
- yinyanfr/ecdict 最後 commit 日期未核（只取得 pushed_at 2022-12-28）。
- LinguaCafe 的 main 分支最後 commit 是 2025-03-19，但 `vue3` 分支 2026-08-09 仍有活動。
- 沒有實際執行任何專案；功能描述都來自 README 與原始碼片段。
