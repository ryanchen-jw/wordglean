# 語音原型實測——Kokoro TTS＋Moonshine STT 在手機瀏覽器的可行性（TASK-1）

> 原型：`prototypes/voice-poc/`（獨立 package，不進 `app/`）。背景調查見 `docs/research/langapp-research.md` §4。

## 1. 結論：需降級（TTS 不在手機瀏覽器即時合成；STT 可行但只載一個、分時載入）

- **STT（Moonshine tiny）可行**：10 句真人朗讀逐字正確率 98.0%（WebGPU）／98.8%（WASM），每句平均 1.5–1.8 秒，WASM 後備路徑實測可用。
- **TTS（Kokoro）在手機上即時合成不可行**：手機建議的 q8 版即使在桌機 GPU 上，念一句 2–4 秒的句子要 11–32 秒（比說話慢 5–9 倍）；唯一夠快的 fp32 版要下載 310 MB、單一行程吃到 1.7 GB，手機扛不住。
- **兩個一起載**：chromium（Android 代理）與 webkit（iOS 代理）模擬下兩者同時載入都未崩潰；webkit 實際佔用（working set）峰值 1.7 GB、單一行程 1.4 GB。依 `langapp-research.md` §4.2，iOS 穩定可用約 300 MB，模擬機器沒有這個上限，**兩者同時常駐不該當預設**。

> 所有數字都在**桌機**（Windows、22 核、獨立 GPU）以手機尺寸模擬量得，是手機的**下限**；真機數字待 §4 自測回填（閘門 G4）。

## 2. 數據

環境：Playwright 1.63（chromium 153，`channel:'chromium'` 走真 GPU；webkit 為 Playwright 的 Windows build）、transformers.js 3.8.1、kokoro-js 1.2.1。原始數據：`prototypes/voice-poc/results/<project>/*.json`，`node tests/summarize.mjs` 可重印。

### 2.1 Kokoro TTS（AC#1）

| 情境 | 裝置 | 下載 | 載入（含下載） | 單句合成（音長） | 速度比* | 峰值記憶體（單行程／本量測合計） |
|---|---|---|---|---|---|---|
| A 冷啟動 q8 | WebGPU | 88 MB／11.7 s | 18.3 s | 31.9 s（4.3 s）、17.9 s（2.3 s）、20.4 s（2.8 s） | 7.3–7.9 | 671 MB／1.3 GB |
| A2 暖啟動 q8（已快取） | WebGPU | 0.2 s | 6.0 s | 20.5 s（2.3 s） | 9.0 | 601 MB／1.2 GB |
| E q8（強制 WASM） | WASM | 88 MB／16.4 s | 18.4 s | 11.5 s（2.2 s） | 5.3 | 見 2.3 |
| F fp32 | WebGPU | 310 MB／43.5 s | 45.9 s | 5.5 s（3.4 s）、1.2 s（2.2 s） | 1.6、0.5 | 見 2.3 |

\* 速度比＝合成時間 ÷ 音長；>1 代表比說話還慢。q8 在 WebGPU 反而比 WASM 慢，與 kokoro-js 建議「WebGPU 用 fp32、WASM 用 q8」一致。

### 2.2 Moonshine tiny STT（AC#2）

測試音檔：LibriSpeech test-clean 10 句（共 251 字、92 秒，CC BY 4.0）。

| 情境 | 裝置／精度 | 下載 | 載入＋暖機 | 10 句逐字正確率 | 平均辨識延遲 |
|---|---|---|---|---|---|
| C（與 Kokoro 同載） | WebGPU／encoder fp32＋decoder q4（moonshine-web 範本） | 76 MB／14.7 s | 18.0＋2.1 s | **98.0%**（錯 5 字） | 1.5 s |
| E（強制 WASM） | WASM／encoder fp32＋decoder q8（範本） | 52 MB／10.0 s | 14.6＋0.7 s | **98.8%**（錯 3 字） | 1.8 s |
| B2 全 q8 | WebGPU／全 q8 | 31 MB／4.8 s | 9.9＋2.4 s | **0%（輸出亂碼）** | 18.6 s |

- 規格估的「tiny int8 約 28 MB」版本在 WebGPU 上**不能用**（輸出重複亂碼、直到長度上限）；可用的組合是範本的 52 MB（WASM）／76 MB（WebGPU）。
- 暖機與辨識都**必須限制輸出長度**：tiny 對靜音不會自己停，範本原寫法曾在 WebGPU 上暖機跑了 17 分鐘（本原型改為暖機 2 個 token、辨識依音長每秒 6 個 token＋10）。
- G 麥克風路徑（chromium 假麥克風）：錄音→轉 16 kHz→辨識整條流程跑通、無錯，但辨識結果為空字串（4.4 秒錄音、0.2 秒）；假麥克風送進來的內容未能驗證，真人錄音留給 §4 真機自測。

### 2.3 兩者同時載入、記憶體、WASM 後備（AC#3）

**chromium（Android 代理）**——指標：private bytes

| 情境 | 結果 | 是否崩潰 | 峰值單行程 private | 本量測合計 private | 該行程 working set＊ |
|---|---|---|---|---|---|
| C 兩者同載（各一支 worker，q8＋範本，WebGPU） | 全部步驟完成 | 否 | 1.1 GB | 2.4 GB | 1.1 GB |
| E 強制 WASM（兩者同載） | 全部步驟完成 | 否 | 1.0 GB | 1.4 GB | 1.0 GB |
| F Kokoro fp32＋Moonshine（WebGPU） | 全部步驟完成 | 否 | 1.7 GB | 3.0 GB | 1.8 GB |

＊原始數據只記了「private bytes 最大那支行程」當下的 working set，沒有合計，所以只列這一欄；未重跑。

**webkit（iOS 代理）**——指標：working set（實際佔用）

| 情境 | 結果 | 是否崩潰 | 峰值單行程 WS | 本量測合計 WS | Kokoro q8 下載／載入 | 單句合成（音長 2.2 s） | Moonshine 下載／載入＋暖機 | 10 句正確率／平均辨識 |
|---|---|---|---|---|---|---|---|---|
| C 兩者同載（各一支 worker，auto） | 全部步驟完成 | 否 | 1.42 GB | 1.67 GB | 88 MB／17.9 s；22.4 s | 13.8 s、13.5 s | 52 MB／10.9 s；16.6＋1.0 s | 98.8%／1.8 s |
| E 強制 WASM（兩者同載） | 全部步驟完成 | 否 | 1.43 GB | 1.67 GB | 88 MB／18.5 s；22.3 s | 16.0 s | 52 MB／12.2 s；18.9＋0.5 s | 98.8%／1.9 s |

- Playwright 的 WebKit 沒有 WebGPU，auto 會自動退回 WASM，所以 C 與 E 實際上是同一條路徑（數字也幾乎一樣）。
- 同一段 webkit 的 private bytes 峰值約 10.5 GB（WebKit Windows build 為 WASM 預留的位址空間），不代表實際佔用。
- Playwright 的 Windows 版 WebKit 也**沒有 Web Audio**（`AudioContext`、`OfflineAudioContext`、`MediaRecorder` 都不存在）；原型因此加了量測用後備路徑：直接解析 16 kHz WAV、略過播放。真機 Safari 有這些 API，不受影響。

> **兩種指標不可直接比較**：webkit 用 working set（實際佔用的實體記憶體），chromium 用 private bytes（已承諾的私有記憶體，含尚未實際佔用的部分）。閘門也依此區分：webkit 補跑時中止條件為「本量測 working set 合計 > 3 GB 或系統空閒 < 1.2 GB」。

## 3. 未量項目與原因

| 項目 | 原因 |
|---|---|
| webkit A／B／B2／F | 第一輪閘門用 private bytes，「本量測行程合計 >3 GB」一開頁就觸發（`results/webkit-ios/` 的 A／B／B2 三檔：單行程 private bytes `procPeak.maxProcPrivateMB` 4553–4797 MB，同一行程的 working set `procPeak.maxProcWorkingSetMB` 只有 244–650 MB；C、E 的第一輪檔已被補跑結果覆蓋）。改用 working set 後執行長只授權補跑 C、E：AC#3 要的「兩者同載＋WASM 後備」已由 C、E 涵蓋；webkit 只有 WASM，單模型情境（A／B／B2）的速度可從 C、E 的分段時間讀出；F 的 fp32 是為 WebGPU 準備的設定，webkit 沒有 WebGPU。中止前拿到的數字：A 情境 Kokoro q8 在 WASM 下載 88 MB／11.5 s、載入 15.1 s |
| chromium B（只載 Moonshine 範本） | 跑中系統空閒掉到 979 MB（本量測只用 1.7 GB，其餘為本機其他程式），閘門中止；同組設定的數據已由 C、E 取得 |
| D（兩者共用一支 worker）、COI 組（跨來源隔離下的頁內記憶體 API） | 量測排程跑到 webkit F 時，因本機整體記憶體吃緊被執行環境回收；執行長裁示不補——D 只影響「一支或兩支 worker」的記憶體差，結論已建議分時載入不同時常駐；COI 只為取得頁內記憶體數字，OS 指標已足夠 |
| Playwright WebKit 的 WebGPU | 不支援（`navigator.gpu` 不存在），所以 webkit 只能量 WASM；iOS 26 Safari 的 WebGPU 只能靠真機 |


## 4. 手機自測步驟（真機回填用，閘門 G4）

模擬量測無法代表真機（記憶體上限、GPU、散熱都不同），以下步驟讓有手機的人 10 分鐘內回填 6 個數字。

### 4.1 準備（電腦端，一次）

1. 在 `prototypes/voice-poc/` 執行 `npm ci`，再執行 `npx vite build`
2. 開本機伺服器：`npx vite preview --port 5320 --strictPort`
3. 手機錄音（麥克風）只在 HTTPS 下可用，所以要開一條 HTTPS 通道，二擇一：
   - **ngrok**（已實測可用）：另開視窗執行 `ngrok http 5320`，複製畫面上 `https://….ngrok-free.dev` 網址。第一次需 `ngrok config add-authtoken <token>`（ngrok 免費帳號）
   - **cloudflared**（未實測）：`cloudflared tunnel --url http://localhost:5320`，複製 `https://….trycloudflare.com` 網址；免帳號
4. 用完一定要關：兩個視窗都按 Ctrl+C（通道開著＝任何拿到網址的人都看得到這頁）

### 4.2 手機端

1. 手機連 Wi-Fi（第一次會下載約 140–165 MB 模型：Kokoro q8 88 MB＋Moonshine 52 MB（WASM）或 76 MB（WebGPU），取自結果 JSON 的 `bytes`），關掉其他分頁與 App
2. 用 iPhone 的 Safari 或 Android 的 Chrome 開上面的 https 網址
   - ngrok 免費版會先出現一頁「You are about to visit…」警告，按 **Visit Site** 一次即可（實測：之後就是原型頁）
3. 按藍色「一鍵自測」，等表格 6 列都出現數字（約 2–5 分鐘；畫面中途可能卡住數十秒屬正常）
   - 若頁面中途自己重新整理或跳出「發生問題」→ 不用再按，直接看第 ⑥ 列（會顯示「是」）
4. 按「複製結果」，把整段貼回給執行長；另外手動記下手機型號與系統版本（例：iPhone 13／iOS 26.1）

### 4.3 要回填的 6 個數字

| # | 項目 | 意義 |
|---|---|---|
| ① | Kokoro 首次下載 | 語音合成模型下載花多久（含 MB 數） |
| ② | Kokoro 載入（含下載） | 從按下到可以念句子要等多久；括號內為 webgpu 或 wasm |
| ③ | 單句合成（第 2 句） | 念一句約 2 秒長的英文要算多久（第 1 句含暖機，取第 2 句） |
| ④ | Moonshine 載入（含暖機） | 語音辨識模型從按下到可用要等多久 |
| ⑤ | 辨識延遲（1 句） | 一句約 3 秒的錄音轉成文字要多久，括號內為辨識結果 |
| ⑥ | 兩者同時載入後當掉／自動重整？ | 兩個模型同時在記憶體時分頁有沒有被系統關掉 |

想額外測真人錄音：展開「手動操作」→「載入 Moonshine」→「開始錄音」念一句 →「停止並辨識」。

## 5. 給 TASK-13／14 的載入策略建議

**TASK-13（聽，TTS）**
1. **預設用系統聲音（speechSynthesis）**：零下載、即時、有中英文；這是 TASK-13【邊界】裡「不可行時改為預設系統聲音、Kokoro 選配」的路線。
2. Kokoro 在瀏覽器內只當**選配**，且只在 WebGPU 可用時提供 fp32 版（310 MB，需事先告知流量）；q8 太慢（每句 10–30 秒）不提供。合成結果存 Cache Storage，同一句不重算。
3. 可考慮的替代方案（需使用者裁示，不在 TASK-1 範圍）：題庫句子是固定的，可在 `content/` 產題時用 Kokoro **離線預先產生音檔**、隨題庫發佈，手機只播放、不跑模型——音質與 Kokoro 相同，但會增加靜態檔流量與題庫建置時間。

**TASK-14（說，STT）**
1. 用 Moonshine tiny 範本精度：WebGPU 用 encoder fp32＋decoder q4（76 MB），WASM 用 encoder fp32＋decoder q8（52 MB）；**不要用全 q8**（WebGPU 上輸出亂碼）。
2. 暖機與每次辨識都要設 `max_new_tokens`（暖機 2；辨識約每秒音長 6 個＋10）。
3. **分時載入**：進入「說」題型才載 Moonshine，離開或切到要用 Kokoro 的頁面時釋放 worker；不和 Kokoro 同時常駐（iOS 穩定可用記憶體約 300 MB）。
4. 推論一律串成一條鏈（transformers.js 不支援同時推論），按鈕開始／結束錄音、不用 VAD。
5. 98% 是母語者朗讀的乾淨錄音；學習者口音的正確率會更低，兩欄修正 UI 是必要的。

**共同**：模型下載前詢問、顯示進度、存 Cache Storage；載入失敗或分頁被殺（以 sessionStorage 旗標偵測重整）時自動退回系統方案並提示。
