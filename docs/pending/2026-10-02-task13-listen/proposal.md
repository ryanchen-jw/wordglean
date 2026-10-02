# TASK-13 聽——發音服務（系統聲音預設、Kokoro 選配）與聽音打字／聽音選答——proposal

> Round 1 計畫經執行長核准（2026-10-02，D1–D5 裁示見下）＝本檔簽核。實作分支 `worktree-task-13-listen`，基底 main 54301fc。

## 範圍

- 做：發音服務（預設手機內建聲音 speechSynthesis；Kokoro-82M fp32 為設定選配，僅 WebGPU 可用時提供、下載前告知約 310MB；載入失敗或分頁崩潰自動退回內建聲音並提示）；語速 1.0／0.8（「慢速播放」）；聽音打字（s03，寬鬆比對＋錯字標示）、聽音選答（s03）；設定頁語音區接上真下載；LibreLingo answer-corrector 移植。
- 不做：發音評分；離線預產音檔（voice-poc §5 替代方案，未裁示）；聽類題寫 FSRS（TASK-12 D2：只有單字卡寫入）。
- 卡片「預設 Kokoro」已由創辦人 G4／「聽」A 裁示取代（規格 §2、`docs/research/voice-poc.md` §5）。

## 執行長裁示（Round 1）

| # | 裁示 |
|---|---|
| D1 | 寬鬆比對以設計 v1.0 為準（s03 答錯畫的就是 move → moved）：App 層只寬鬆大小寫、標點與彎引號、縮寫、數字；**拼錯一律算錯**並標錯字。移植的 LibreLingo 比對器保留、通過原 5 例等價測試（AC#4），但 App 層**不採用**它的「編輯距離 ≤1 算對」規則。 |
| D2 | kokoro-js 1.2.1＋@huggingface/transformers 3.8.1 鎖版本（偏離見選型清單）。 |
| D3 | 「Kokoro 實際合成一句」只做本機選用測試（不進 CI）；跑前空閒記憶體 ≥3GB；模型快取放 gitignored 目錄。 |
| D4 | 合併順序 TASK-16 先、本卡後。本卡沿用 `app/src/speech/speak.ts` 同路徑、同介面 `speak(text)`；Stage 2 開工前若 main 已含 TASK-16 就先 merge main。 |
| D5 | 設定「發音」列改開 OptionSheet（手機內建聲音／高音質發音）；高音質未下載時不能選，改導向下載。 |

## 受測 seam（寫死，測試只打這些）

| 檔 | 公開介面 | 說明 |
|---|---|---|
| `app/src/lesson/answer/corrector.ts` | `evaluateAnswer({ validAnswers, answer }) → { correct, suggestion }` | LibreLingo 原樣移植（AC#4 等價測試）；App 判題不用 |
| `app/src/lesson/answer/check.ts` | `checkTyped(input, expected) → { correct, typed: { text, wrong }[], fixes: { from, to }[] }` | 聽音打字判題（D1 規則）；`typed`＝使用者輸入照原樣切字、拼錯或多打的字 `wrong`；`fixes`＝改正清單（`from` null＝漏打、`to` null＝多打） |
| `app/src/speech/tts.ts` | `createTts(deps)`：`speak(text, { rate })`、`engine`、`onNotice` | Stage 2 定細節；引擎以注入的 system／hq 實作，單元測試以 mock 驗退回（AC#1） |
| `app/src/speech/speak.ts` | `speak(text)` | 與 TASK-16 相容的薄包裝，改走 TTS 服務 |
| `app/src/lesson/queue.ts` | `LISTEN_TYPES`（listenType 1 步、listenChoice 1 步，`srsWord: null`） | 與 `READ_TYPES` 並列註冊 |
| e2e | 題型畫面以角色／可見文字斷言；`speechSynthesis` 以 init script 換成記錄呼叫的替身 | AC#2、#3 |

### 聽音打字判題規則（D1）

1. 兩邊都正規化：小寫；`’ ‘ ʼ` → `'`；去標點（字內的 `'` 保留，`-` 與數字間的 `:` 視為分字）；`$N` → `N dollars`、`N%` → `N percent`；數字組的逗點去掉。
2. 縮寫展開成**候選集合**（兩邊都展開，交集非空即同）：`n't`→`not`（`can't`→`can not`、`won't`→`will not`、`shan't`→`shall not`）、`cannot`→`can not`、`'re`→`are`、`'ve`→`have`、`'ll`→`will`、`'m`→`am`、`let's`→`let us`；歧義的 `'s`→ 原樣（所有格）／`is`／`has`，`'d`→`would`／`had`。
3. 數字：阿拉伯數字一律轉英文字（基數 0–999,999；序數 `1st`→`first`；1100–1999 的四位數另加年份讀法候選，如 `1990`→`nineteen ninety`）。
4. 正規化後的字序列完全相同才算對；拼錯（即使只差一個字母）算錯。
5. 錯字標示：取字數差最小的一組候選做逐字對齊（字層級 Levenshtein），對回使用者原輸入的字。

已知限制（記錄、不處理）：小數唸法（`2.5` ↔ `two point five`）、`a hundred` ↔ `one hundred`、英式 `and`（`one hundred and five`）；所有格與 is 縮寫的歧義——`'s` 一律可展開成 is／has，所以正解是「Tom's dog」時打「Tom is dog」也算對（驗收裁示：記為限制、不改）。

追加（驗收 P2）：輸入與正解先做 NFKC 正規化，全形英數、標點與全形空白等同半形。

## 選型清單（新依賴，Stage 4 才加）

| 套件 | 版本 | 授權 | 最後發布 | 判斷 |
|---|---|---|---|---|
| kokoro-js | 1.2.1（鎖） | Apache-2.0 | 2025-05 | **偏離「近 6 個月有維護」**：TASK-1 原型實測可用；只走選配路徑，失敗一律退回內建聲音 |
| @huggingface/transformers | 3.8.1（鎖、overrides） | Apache-2.0 | 4.3.0 於 2026-09 | 與原型同版；kokoro-js 要求 ^3.5.1，不升 4.x |
| phonemizer（kokoro-js 依賴） | ^1.2.1 | npm 標 Apache-2.0，內含 espeak-ng（GPL-3.0） | 2025-01 | GPL-3.0 與 AGPL-3.0 相容；NOTICE 記 espeak-ng |

比對器不加依賴：Levenshtein 自寫（原版用 js-levenshtein，Relive 版用 leven，皆 MIT；移植時以自寫取代、行為相同）。

## Stage 計畫

| Stage | 內容 | 狀態 |
|---|---|---|
| 0 | 本 proposal | ✅ f1f01bb |
| 1 | 比對器移植＋原 5 例等價測試（AC#4）；`checkTyped` 與縮寫、數字、標點、錯字標示單元測試（AC#3 後半）；NOTICE | ✅ f1f01bb |
| 2 | TTS 服務（系統聲音、語速、退回、提示事件）；`speech/speak.ts`；mock 單元測試（AC#1 前半） | ✅ 9ffa96a |
| 3 | 聽音打字／聽音選答畫面＋登記；首次提示條；i18n；TASK-12 受影響斷言更新（一課 12 → 14 題）；兩題型 e2e（AC#3） | ✅ b01fee7、1a3c471 |
| 4 | Kokoro 選配：worker、下載前告知、真下載進度、Cache Storage、WebGPU 偵測、崩潰旗標；設定頁兩列；強制載入失敗 e2e（AC#2） | ✅（見分支 Stage 4 commit） |
| 5 | 本機選用「實際合成一句」測試（AC#1 後半）；s03／s11 視覺 smoke；文件 | ✅ |

## 設計偏差（對照 docs/design/v1.0 s03／s11）

| # | 偏差 | 理由 |
|---|---|---|
| 1 | LibreLingo「距離 ≤1 算對但提示」不用於 App 判題 | D1：設計 s03 把 move → moved 畫成答錯；卡片【借鑑】的這條規則讓位給設計 |
| 2 | 作答中的題目卡同時有「慢速播放」與「手機內建聲音」說明 | 設計「作答中」畫了慢速、「內建聲音」狀態畫了說明，兩者是同一畫面的不同截面；預設就是內建聲音，所以兩者並列。用高音質時不顯示說明 |
| 3 | 「聽不出來」按下後：記為答錯，回饋條標題「這一句是」＋英中原句 | 設計沒畫；文案為新增佔位（draft-pending-G3） |
| 4 | 漏打／多打的改正寫成「＿＿ → the」「on → ＿＿」 | 設計只畫了替換（move → moved）；漏字佔位符照 components.md 跟讀結果的 `＿＿` |
| 5 | 聽音打字答對：「正確」＋英中原句；聽音選答答錯：「答案是 B：…」＋英中原句；聽音選答出題前狀態同選擇題（選了才能檢查） | 設計沒畫這三個狀態，照選擇題（s05）組合 |
| 6 | 高音質提示條「第一次」以本機 localStorage `lg.ttsHqHintSeen` 判定（每台裝置一次） | 設計註記「只在第一次出現一行提示」；與外觀偏好同為裝置層級、不同步 |

| 7 | 高音質下載前告知用確認框（ConfirmDialog）：「下載高音質發音？／檔案約 310MB，建議連上無線網路再下載。下載完成後會改用高音質發音。／先不要・下載」；下載完成即改選高音質 | 設計只寫「下載前告知」沒畫；文案為新增佔位（_pendingG3） |
| 8 | 沒有 WebGPU 的手機：高音質列右側顯示「這支手機不支援」、發音選單只列內建聲音 | 設計沒畫不支援狀態；照下載元件四態外加一態 |
| 9 | 高音質失敗退回時，聽題區出現提示條「高音質發音無法使用，已改用手機內建聲音」（hint 色），這次開啟內持續顯示；題目卡說明改回「手機內建聲音」 | AC#2「UI 有提示」；設計沒畫 |
| 10 | 單字卡發音鈕改為永遠顯示（原本瀏覽器沒有 speechSynthesis 就隱藏） | 發音入口合併為 speech/speak.ts（執行長指示）；components.md §7「發音鈕永遠可用」，與 TASK-16 字典彈層一致 |

## 測試影響（TASK-12 既有測試）

聽類兩題進佇列後樣本課 A1 由 12 步變 14 步（第 9、10 題為聽題）：`LessonScreen.test.tsx`、`e2e/lesson.spec.ts`、`e2e/lesson-visual.spec.ts` 只改題號與題數、作答 helper 加聽題分支；讀類斷言內容不變。

## 已知限制與追加裁示（Stage 4 後，執行長 2026-10-02）

- **清除資料不清模型／音檔快取**：「清除這支手機上的資料」不刪 Cache Storage 的 `transformers-cache`、`kokoro-voices`、`lg-tts-audio`——維持現狀（非個人資料）。
- **ort wasm 放本站**：Kokoro Worker 與 TASK-14 語音辨識同一慣例——`env.backends.onnx.wasm.wasmPaths` 指向 `?url` 匯入的 `@huggingface/transformers/dist/ort-wasm-simd-threaded.jsep.{mjs,wasm}`，不連 jsDelivr（隱私與離線一致）；runtimeCaching 規則與 `worker: { format: 'es' }` 與 TASK-14 逐字相同，`dist/` 只有一份 wasm。
- **Testing Library 等待上限 3 秒**：`src/test/setup.ts` `asyncUtilTimeout: 3000`——全套平行跑時首頁測試偶爾超過預設 1 秒（單跑 74–541ms、全套逾時 1024–1061ms）；斷言不變。
- **WebKit e2e 驗不到「已下載」狀態**：Playwright WebKit（Windows build）Cache Storage 不跨導覽保留（實測），`tts-hq.spec` 兩例只在 chromium 驗。
- **實際合成一句（AC#1 後半）**：本機選用測試 `npm run e2e:tts`（`playwright.tts.config.ts`、`e2e-tts/kokoro-real.spec.ts`，不進 CI）。瀏覽器以 gitignored 的 `app/.tts-model-cache/profile` 當持久設定檔，模型存在它的 Cache Storage。不用 route 把模型轉送給頁面——311MB 主檔經 Playwright 協定回應會讓瀏覽器崩潰（2026-10-02 實測）。證據：`evidence/kokoro-real-run1-download.json`（下載 44s、合成 5.3s、1.85 秒 WAV；連線主機只有本站與 Hugging Face）、`evidence/kokoro-real-run2-cached.json`（不再下載，連線主機只有本站）。
