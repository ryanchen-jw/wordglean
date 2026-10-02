# TASK-16 點字查義＋收藏——proposal（SDD）

> 執行長 2026-10-02 核准 Round 1 計畫（D1–D3 全照建議）＝本檔簽核。實作分 5 個 stage，每 stage 回報後停。

## 範圍

- 做：字典資產化與離線、詞形還原、字典彈層（s08）、可點英文字元件、Toast、發音（speechSynthesis 最小實作）、收藏／取消收藏／復原、取消收藏的同步墓碑、單字庫中文釋義與中文搜尋（TASK-11 D5）。
- 不做：句子翻譯；查字次數記錄與「前三次上課說明小字」（小課畫面 TASK-12／18，本卡只給 `onLookup` 回呼）；字典下載 UI（設計無此入口，D1 改預快取）。

## 執行長裁示

| # | 題目 | 裁示 |
|---|---|---|
| D1 | 字典離線 | 字典 597 片＋單字總表全部 PWA 預快取。首次安裝下載：切片 gzip 合計約 3.3MB（3,295,236 bytes）＋單字總表 gzip 約 258KB；本機快取（解壓後）：切片約 12MB＋單字總表 1.6MB |
| D2 | 取消收藏同步 | Stage 4 補同步墓碑：收藏狀態以最後修改者為準；以新增為主，TASK-20 既有測試維持綠；寫回 `docs/verification/2026-10-02-task20-sync-evidence/proposal.md` 已知限制對應條 |
| D3 | 來源歸零的字 | 無課程來源且未收藏的字視為不在單字池（讀取時過濾，不刪資料）；判斷做成具名匯出函式，TASK-18 沿用 |
| — | Dexie | 不升版（TASK-12 用 v3）；真需要升版用 v4 並先回報 |
| — | 埠 | dev 5321、e2e／preview `E2E_PORT=5322`（playwright.config 讀的是 `E2E_PORT`，不改 config） |

## 受測 seam（寫死）

| seam | 位置 | 測試 |
|---|---|---|
| `lookupWord(token, { sentenceStart }, { shards, lex }) → LookupResult` | `app/src/dict/lookup.ts` | `lookup.test.ts`（讀真 `data/dict`、`data/lexicon`） |
| `tokenize(text) → Token[]`、`shardKey(word, n)` | `app/src/dict/tokenize.ts`、`shards.ts` | `tokenize.test.ts` |
| `<EnglishText>`（下節）、`<DictionaryProvider>` | `app/src/dict/` | Stage 2 RTL 測試 |
| `addFavorite`／`removeFavorite`／D3 判斷函式 | `app/src/data/repo.ts` | Stage 2 `repo.test.ts` |
| `mergeSnapshots`、`wordToRows`／`wordFromRows` | `app/src/sync/` | Stage 4 |

`LookupResult`：`{ found: true, query, headword, via: 'self'|'table'|'rule', entry: { phonetic, lines } } | { found: false, query }`。`query`＝去標點與縮寫後的字（彈層「query → 原形 headword」用）。

## 可點英文字介面（已轉 TASK-12）

```ts
<EnglishText
  text: string                              // 純文字；標點與數字不可點
  disabled?: ReadonlySet<string> | 'all'    // 小寫比對；作答前會洩漏答案的字（'all'＝分級測驗）
  onLookup?: (word: string) => void         // 每次開彈層回呼（查字次數記錄用）
  className?: string
/>
```

## 查字規則（`lookup.ts`）

1. 切字：去前後標點與引號；縮寫與所有格去尾（can't→can、won't→will、n't／'s／'re／'ve／'ll／'d／'m、students'→students）；彎引號視同 '。
2. 大小寫：句首大寫先小寫查；句中大寫開頭（人名、月份）先原樣查、再小寫；全大寫原樣先。
3. 順序：
   1. be 動詞小表（am／are／were；ECDICT exchange 漏列）→ rule
   2. 本身在單字總表、且字典釋義第一行不是「原形的…」（has 的「have的第三人稱單數現在式」、does 的「（do的第三人稱單數形式）」）→ self（meeting 不跳 meet、left 不跳 leave）
   3. 變化形表（data/dict 的 `f`，ECDICT exchange 衍生）→ table；多個原形取單字總表內、級距低、詞頻高者
   4. 字典本身有條目 → self
   5. 去字尾規則（-ies／-es／-s／-ied／-ed／-ying／-ing／-iest／-est／-ier／-er，含雙寫子音、補 e），候選須在字典裡 → rule
4. `lemma.en.txt` 不使用（授權）。

## Stage 1 結果：詞形還原命中來源（AC#1、AC#4）

`npx vitest run src/dict/lookup.test.ts -t 命中來源 --silent=false` 輸出：`65 例：{"table":60,"rule":5,"self":0}`。

| 來源 | 例數 | 明細 |
|---|---|---|
| 變化形表 | 60 | 不規則動詞 32（went、gone、took…had、has、did、does、was、been、is）、不規則複數 14（children、mice…cacti、crises）、規則複數 7、規則動詞與比較級 7 |
| 規則 | 5 | am、are、were（be 小表）；emails→email、texting→text（去字尾） |

期望原形取自英文文法，不從資料推得。

### 照實記錄的行為（非 bug，依核准規則）

- 單字總表本身收錄的複數形照本身顯示：`criteria`（Octanove C1）、`data`、`scissors`、`trousers` 不還原。原列測試的 criteria→criterion 因此換成 cacti、crises，並另立一條測試寫明此行為。
- 單字總表收成獨立詞的過去分詞／形容詞照本身顯示：`found`（建立）、`lost`、`given`、`thought`、`saw`（鋸子）不跳原形。
- 風險 #4（執行長代決後已改）：句中大寫字字典沒有原樣時，只有小寫在單字總表內才退回小寫——`March`→march（三月），`Jenny`→查無此字。
- 多原形依級距與詞頻挑：`leaves`→leave（非 leaf）、`lives`→life；不看上下文，短文裡的「樹葉」會顯示 leave。
- `googled` 查無（ECDICT 無 google）。

## Stage 計畫

| Stage | 內容 | 狀態 |
|---|---|---|
| 1 | 查字核心＋≥30 例測試＋命中來源統計 | ✅ |
| 2 | 字典資產化進 build（vite fs.allow、預快取）、彈層、EnglishText、Toast、speak()、收藏／取消／復原、D3 判斷函式 `inPool` | ✅ |
| 3 | 單字庫中文釋義與中文搜尋、列表英文字可點、課程詳情單字可點、搜尋框文案 | ✅ |
| 4 | 取消收藏同步墓碑 | ✅ |
| 5 | e2e（點字→彈層→收藏→單字庫）、離線查未載入切片（chromium）、開啟延遲 <150ms（點擊到彈層出現單字文字，不含滑入動畫）、視覺 smoke | ✅ |

## Stage 2–4 實作紀錄

- 字典資產：`import.meta.glob(..., { query: '?url', eager: true })` 只把檔名表放進 bundle；`build.assetsInlineLimit` 對 `data/dict`、`data/lexicon` 的 json 一律不內嵌（392 片小於 4KB，預設會被內嵌成 base64 進 JS，違反授權分界）。build 實測：預快取 619 項、12,870 KiB；json 資產 602 個（字典 596 片＋單字總表＋課綱 5 檔），`dict/manifest.json` 不輸出。
- 字典彈層依設計 s08；Toast（components.md §8）彈層開著時在上方。BottomSheet 加「Esc 只關最上層」（課程詳情上疊字典彈層）。
- 自創文案（設計未畫，待 G3）：`dict.sheet.loadFailed`「字典載入失敗，請再試一次」、`dict.sheet.loading`「查詢中…」（螢幕閱讀器用）。
- 音標：ECDICT `'` `,` `:` 轉 IPA `ˈ` `ˌ` `ː`；部分詞條的 schwa 是西里爾 ә（U+04D9），改為 IPA ə（U+0259）。
- 單字庫：短釋義＝單字總表 glossZh（無則字典第一行）去詞性與領域標記、取第一個義項；搜尋同時比對英文與釋義行。窄螢幕特大字級時釋義換到第二行，英文字優先。
- D3：`inPool`（`app/src/data/repo.ts`）——`countDue`、單字庫列表與計數已套用；首頁 `firstRun` 判斷（`db.wordPool.count()`）未改。
- D2：見 TASK-20 proposal 已知限制對應條（已回寫）與 `supabase/CLAUDE.md` 欄位對照。
- e2e 量測：`measure.ts` 白名單加 `C2`、`ECDICT`；行內可點英文字（`data-en-word`）屬 WCAG 2.5.8 行內例外、不量 44px。

## Stage 5 驗收證據（2026-10-02）

| AC | 證據 | 結果 |
|---|---|---|
| #1 詞形還原 ≥30 例 | `app/src/dict/lookup.test.ts`「詞形還原」65 例（不規則動詞 35、不規則複數 14、規則複數 7、規則動詞與比較級 7、規則備援 2） | 65/65 綠 |
| #2 點字→彈層→收藏→單字庫 | `app/e2e/dictionary.spec.ts`「AC#2」：課程詳情點 have→彈層→加入收藏→Esc 兩次→單字庫列出 have 且有星號；webkit-iphone15、chromium-pixel7 | 兩引擎綠 |
| #2 離線可查 | 同檔「離線」：預快取 ≥600 項後離線，查 zebra（ze 切片本頁從未載入），回應 `fromServiceWorker()=true`、彈層顯示「斑馬」；chromium（WebKit Windows build 不支援離線導覽，既有已知限制） | chromium 綠 |
| #3 開啟延遲 <150ms | 同檔「AC#3」：30 字各在不同切片，點擊到彈層出現單字文字；`latency.json`（本目錄）：n=30、p50 5.6ms、p95 12ms、max 16.5ms（chromium Pixel 7 模擬、無 CPU 節流、vite preview） | 綠 |
| #4 命中來源統計 | 本檔「Stage 1 結果」：65 例 table 60／rule 5 | 大多由資料表命中 |

- 視覺 smoke：`visual-smoke.spec` 新增 s08（查到／已收藏＋提示／查無此字／疊在課程詳情上），兩引擎 16 項全綠；報告 `app/playwright-report/visual-smoke`（本機、未上雲）。`narrow.spec` 320 標準／320 特大／375 特大 s08、s09 綠。
- 同步（D2）：本機 Supabase 實跑 `supabaseRemote.it.test.ts` 3/3（新增「取消收藏跨裝置同步」；反證：合併改回舊聯集規則時該條變紅）、`npm run e2e:sync` 12/12；跑完 `supabase stop`、容器 0。
- 首頁「第一次使用」改用 `inPool`（執行長代決）：`homeModel.test.ts` 新增一條先紅後綠。
- 音標加 `lang="en-fonipa"`；`measure.ts` 的英文介面字串掃描改排除 `[lang|="en"]`（含 en-fonipa）。

## 驗收修正（2026-10-02，執行長隔離驗收後）

- P1：`iconBtnCls`（`app/src/shell/Screen.tsx`）拆掉文字色、由使用處各自給；字典發音鈕回到 primary。`e2e/icon-color.spec.ts` 以 computed color 對 token 斷言（淺／深兩色系），突變（把 text-text 放回）轉紅。
- **偏差（執行長裁示）**：安裝卡關閉鈕原被同一 bug 蓋成 text 色，修正後為程式原意的 muted（淡灰）；此卡設計 v1.0 未畫。
- P2：已收藏鈕 `text-balance`，320 寬不留孤字。
- 合併 TASK-12：小課畫面改用可點查義版 EnglishText；單字卡正面測驗字改為作答後可點（G2）。
- disabled 改為原形比對：`baseForms`（`app/src/dict/lookup.ts`）＝字本身、縮寫去尾、變化形表原形、be 小表、查字詞條；EnglishText 以此比對 disabled 集合，還原完成前整段先不可點（寧可多擋）。測試：`lookup.test.ts`「baseForms」、`Dictionary.test.tsx`、`WordCardView.test.tsx`（考 meeting、例句 meetings 作答前不可點、作答後可點），先紅後綠；突變（baseForms 只回字本身）5 條轉紅。
- 已知交 TASK-13：`src/lesson/speak.ts` 與 `src/speech/speak.ts` 兩份發音 helper 合併。
