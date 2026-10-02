# TASK-9 C1 撰寫狀態

> 依 2026-10-02 創辦人 G5 裁示，題庫由開發端 Claude 逐課撰寫（author `claude-dev`），不呼叫任何外部 LLM，花費 $0。撰寫工具 `scripts/author-lesson.mjs`，帳本 `content/items/_runs/claude-dev-pilot.json`。分支 `worktree-task-9-c1`。

## 各批

| 批 | 單元 | 課數 | 題數 | 撰寫起訖（UTC） | 檢查器 | 待審狀態 |
|---|---|---|---|---|---|---|
| 1 | c1-u01～c1-u10 | 48 | 818 | 2026-10-02 17:49 → 18:57（含 18:20–18:28 依執行長長度名次規則回溯修正已寫 25 課）；三關修正 19:45 → 20:40 | `check-items --require-judge` 48 課全綠；`npm test` 166／166 | 第②③關已審、已依 c1b1 裁示修正，待執行長複核與重新盲答 |
| 2 | c1-u11～c1-u35（本 worker 負責 39 課；u36～u39 改由 task-9-c1b） | 39 | 639 | 2026-10-02 19:20 → 21:04（中間插入第 1 批三關修正、釋義原則複核、只看英文自查） | 全級 `check-items` 與 `--require-judge`（第 1、2 批）87 課全綠；`npm test` 166／166 | 兩關已審，已依 c1b2 裁示修正；`check-items --require-judge` 87 課全綠、`npm test` 166／166 |

## 第 2 批兩關審查與修正（c1b2 裁示）

- **判題**：第②關盲答 195 題位全部和正解一致、0 多解，已寫入 judge。修正後 verdicts 以選項文字對應現行索引；正解文字有改的題，判題同步改成新文字。
- **修正**：第②關 77 條（含疑似）全修，第③關 FIX 91 條全修，兩份第③關疑似 35 條照裁示與審查建議改。對照表與不改理由見 `c1-batch2-changes.md`；每處修改都記在各課 judge.resolvedAfterFinalReview。
- **改到選項或題幹的題 id**：見 `c1-batch2-changes.md` 第一節（選項 36 題位，題幹、音檔、短文或小題題目 51 處；第 1 批只改評分要點）。
- **合格檢查**：
  - 全級 `check-items` 87 課全綠；`--require-judge` 第 1、2 批 87 課全綠。
  - 長度名次：全級 listenChoice 25.3／25.3／25.3／24.1%、mcq 30.7／26.4／23.3／19.5%、reading 25.9／25.3／27.6／21.3%。聽選分段：u11～u20 為 25／25／25／25%，u21～u35 為 26.3／26.3／31.6／15.8%，第 2 批 39 題為 25.6／25.6／28.2／20.5%。reading 與 listenChoice 0.5–2 倍 0 不符。
  - 干擾項（詞形還原後比對，連同 main 上的 c1-u36～u39 共 236 題 mcq）：用字範圍、同課共用、當另一題正解、跨課重複都是 0 違規。
  - 只看英文：改到的 mcq 逐題把干擾項代入英文句，都不通；混合詞性題至少兩個干擾項放得進空格。
- **chauffer**：曾依授權把課綱改為 chauffeur，但 lexicon 沒有該字，Unknown command: "test"


Did you mean this?
  npm test # Test a package
To see a list of supported npm commands, run:
  npm help 的課綱測試擋下（課綱字必須是 lexicon 中有級距的字）。依執行長裁示撤回：curriculum／word-topics／allowlist 維持原狀，c1-u12-l02 照 ECDICT 教「小型輕便爐」，釋義第二段註明「舊式，罕用」；誤植由執行長列報告，之後在 data 層處理。
- **第 1 批評分要點**：依執行長裁示一併改成同一套寫法（171 條，48 課），只改評分要點，沒有改到選項或題幹；修改記在各課 judge.resolvedAfterFinalReview。
- **最終複審（c1b2-final）**：11 條 FIX 全修，另修提醒 4、5 共 4 處；改到選項 3 題位、題幹或音檔 2 題，見 `c1-batch2-changes.md` 第五節。
- **重新附判題時的時間戳**：重寫後舊修正紀錄的 resolvedAt 一律還原成 68c0865 的值。

## 第 1 批本輪改動（隨第 2 批送重新盲答）

第 1 批已定稿，以下是第 2 批撰寫期間依執行長新裁示改到的第 1 批題目。每處都記在該課 judge.resolvedAfterFinalReview。

- **改到 mcq 選項的題（8 題，只看英文新規則）**：
  - c1-u04-l04-q13：adjustable → exterior
  - c1-u06-l05-q13：speculative → knowledgeable
  - c1-u06-l07-q14：speculative → meaningless
  - c1-u10-l06-q13：dismal、tedious → latent、creamy
  - c1-u10-l06-q14：disappointed、uninterested → robust、phenomenal
  - c1-u10-l07-q14：hinted → sprouted
  - c1-u10-l10-q13：elitist → impervious（執行長裁示邊界案例要改）
  - c1-u10-l10-q14：ferocious → elastic
- **改到單字卡的題（33 張，釋義原則：第一義＝最常用義，例句改寫示範第一義）**：只改單字卡的例句、釋義順序與配對干擾項，不動其他題。
  - c1-u01-l01-q08 whilst、c1-u02-l01-q02 expire、c1-u02-l01-q03 predecessor
  - c1-u03-l02-q02 isolate、c1-u03-l02-q06 plunge、c1-u03-l02-q08 clutch、c1-u03-l03-q04 prop、c1-u03-l03-q08 flourish、c1-u03-l04-q02 embark、c1-u03-l04-q05 crumble、c1-u03-l06-q02 sprout、c1-u03-l06-q06 mingle
  - c1-u04-l02-q06 simplicity、c1-u04-l04-q08 closeness、c1-u04-l05-q07 rudimentary、c1-u04-l07-q03 stuffy
  - c1-u05-l01-q01 bulk、c1-u05-l01-q07 marginal
  - c1-u06-l02-q03 sentiment、c1-u06-l06-q04 conditional
  - c1-u07-l01-q02 induction
  - c1-u08-l01-q06 formulate、c1-u08-l02-q04 characterization、c1-u08-l05-q06 acoustics
  - c1-u09-l01-q01 occupant、c1-u09-l01-q03 juvenile、c1-u09-l01-q08 heroine、c1-u09-l02-q01 hostess、c1-u09-l02-q04 paternal
  - c1-u10-l01-q03 hostile、c1-u10-l02-q01 poise、c1-u10-l04-q07 eccentric、c1-u10-l05-q03 dismay
- **commit**：`c847735`（干擾項詞形還原重掃，第 1 批 0 處）、`8f4bd1a`（釋義原則）、`34fe47a`（只看英文自查）、`c07ed49`（u10-l10-q13）。

## 第 1 批三關審查與修正（c1b1 裁示）

- **判題**：第②關盲答 240 題位全部和正解一致、0 多解，已寫入 judge（commit `c643e25`）。修正後 verdicts 以選項文字對應現行索引。
  - c1-u10-l01 q15#0 的正解文字改寫過，判題改以修正後的正解文字對應，並在 resolvedAfterFinalReview 註明。
- **修正**：
  - 第②關 95 條、第③關 FIX 64 條全修；疑似項多數照建議改。
  - 不改的項目與理由見 `c1-batch1-changes.md` 第二節。
  - 每處修改都記在各課 judge.resolvedAfterFinalReview。
- **新規則全量自查**：
  - 干擾項只用本課、先前課或 B2 以下的字；同級但還沒教的字不用。
  - 非本單元的字不跨課重複當干擾項。
  - 同課兩題 mcq 不共用干擾項。
  - 混合詞性題至少兩個干擾項放得進空格。
  - 用腳本列出全部 118 題 mcq 的干擾項級距、教授課與重複次數，0 違規；混合詞性題逐題人工確認。
  - 審查官的建議替換字中，有 4 個不符合「已教」規則（u08-l03 的 stylistically、acoustically、geologically，u08-l04 的 magnetically），已另換成已教的字。
- **長度名次**：
  - reading、listenChoice 仍照題 id 雜湊名次。
  - mcq 只看全級分布：名次 1–4 為 31.8%／29.2%／24.2%／14.8%，全在 13–37% 內。為此 u10-l06 q14 加了一處調整。
- **改到選項或題幹的題 id**：見 `c1-batch1-changes.md` 第一節。
- **第 2 批已寫課**：u11～u16 照同規則自查，改了 12 題位的干擾項，也列在同一節。

## 第 1 批

### 單元與 commit

| 單元 | 主題 | 課 | commit |
|---|---|---|---|
| c1-u01 | 基礎常用字 | l01 | `2dec4ed` |
| c1-u02 | 數字、時間與日期 | l01–l02 | `c6d4a44` |
| c1-u03 | 常用動作（一） | l01–l06 | `a094e74` |
| c1-u04 | 描述事物（一） | l01–l07 | `a7d9354` |
| c1-u05 | 數量與程度 | l01–l03 | `28d2fb6` |
| （u01–u05 回溯） | 選項長度名次依題 id 雜湊分散 | 23 課 | `8e79254` |
| c1-u06 | 想法與意見 | l01–l08 | `21e6edc` |
| c1-u07 | 變化與因果 | l01–l04 | `ff1d829` |
| c1-u08 | 論述與學術用語 | l01–l05 | `c93058e` |
| c1-u09 | 家人與朋友 | l01–l02 | `b332dc2` |
| c1-u10 | 情緒與個性（一） | l01–l10 | `1207d81` |

### 撰寫耗時（帳本）

- 全批牆鐘時間：17:49 → 18:57，約 68 分鐘，其中約 8 分鐘是回溯修正選項長度。
- 計到第一次 0 錯（start → 第一次 0 錯）：48 課合計 51 分鐘，平均 1.1 分，中位數 0.9 分，最短 0.5 分。
  - 最長 11.4 分是 c1-u06-l05：start 之後插入了執行長長度規則的回溯修正。
- 這是帳本的牆鐘時間，從 start 算到 write。構思、讀裁示、寫文件的時間不在內。
- 寫入輪次較多的課，多半是回溯修正長度名次或打破並列造成的重寫，不是檢查器錯誤。

### 每課明細

「四選項同詞性的 mcq」＝那一題的四個選項同詞性、都放得進空格且文法通順，只能靠詞義判斷（§11.7）。括號內是四個選項。另一題 mcq 是混合詞性。

「閱讀短文帶入的前面單元字」＝§11.13 單元間複用。各單元第 1 課不要求。

本表由現行檔重新產生：同詞性 mcq 的選項是修正後的現況；「寫入輪次」含後續修正的重寫次數。

| 課 | 題數 | 開始（UTC） | 到第一次 0 錯（分） | 寫入輪次 | 四選項同詞性的 mcq | 閱讀短文帶入的前面單元字 |
|---|---|---|---|---|---|---|
| c1-u01-l01 | 19 | 17:49 | 0.8 | 14 | q15（ordinarily／beforehand／seldom／thereby） | —（單元第 1 課） |
| c1-u02-l01 | 16 | 17:50 | 0.7 | 15 | q12（predecessor／succession／deadline／outset） | —（單元第 1 課） |
| c1-u02-l02 | 16 | 17:52 | 1.3 | 8 | q12（brief／antiquated／idle／ceaseless） | beforehand、principally |
| c1-u03-l01 | 17 | 17:54 | 0.7 | 7 | q13（discourage／expedite／circulate／unplug） | —（單元第 1 課） |
| c1-u03-l02 | 17 | 17:55 | 0.6 | 16 | q13（cessation／antiquity／restoration／succession） | outset |
| c1-u03-l03 | 17 | 17:57 | 0.7 | 11 | q13（circulate／loom／disappear／flourish） | ordinarily |
| c1-u03-l04 | 17 | 17:58 | 0.6 | 12 | q13（elevation／fusion／retention／restoration） | beforehand |
| c1-u03-l05 | 17 | 17:59 | 0.7 | 8 | q13（investigate／perpetuate／conjure／congratulate） | outset |
| c1-u03-l06 | 17 | 18:00 | 0.7 | 12 | q13（flicker／alignment／retention／fusion） | principally |
| c1-u04-l01 | 17 | 18:01 | 0.6 | 6 | q13（spacious／vertical／structural／dominant） | comprise |
| c1-u04-l02 | 17 | 18:02 | 0.6 | 10 | q13（battered／slack／robust／elusive） | ceaseless |
| c1-u04-l03 | 17 | 18:04 | 0.6 | 5 | q13（superficial／complementary／antiquated／startling） | flourish |
| c1-u04-l04 | 17 | 18:04 | 0.6 | 14 | q13（taut／somber／eclectic／exterior） | discard |
| c1-u04-l05 | 17 | 18:05 | 0.6 | 12 | q13（battered／quirky／stately／rudimentary） | antiquated |
| c1-u04-l06 | 17 | 18:07 | 0.7 | 7 | q13（telltale／versatile／nondescript／classy） | amid |
| c1-u04-l07 | 17 | 18:08 | 0.7 | 11 | q13（motley／effortless／stuffy／supple） | flourish |
| c1-u05-l01 | 18 | 18:09 | 0.5 | 10 | q14（structurally／enormously／subtly／principally） | flourish |
| c1-u05-l02 | 18 | 18:10 | 0.5 | 6 | q14（bulky／staggering／limitless／negligible） | circulate |
| c1-u05-l03 | 17 | 18:11 | 0.7 | 8 | q14（elongate／plummet／circulate／proliferate） | embark |
| c1-u06-l01 | 18 | 18:13 | 0.7 | 9 | q14（convictions／scenarios／criteria／discourses） | bulk |
| c1-u06-l02 | 17 | 18:14 | 0.6 | 9 | q13（sentiment／credibility／likelihood／irony） | succession |
| c1-u06-l03 | 17 | 18:15 | 0.5 | 5 | q13（plausible／obscure／credible／cynical） | elusive |
| c1-u06-l04 | 17 | 18:16 | 0.7 | 7 | q13（profound／intuitive／meaningless／credible） | versatility |
| c1-u06-l05 | 17 | 18:17 | 11.4 | 8 | q13（ingenious／knowledgeable／cynical／frosty） | immense |
| c1-u06-l06 | 17 | 18:28 | 1.0 | 9 | q14（speculation／cynicism／abstraction／ingenuity） | flicker |
| c1-u06-l07 | 17 | 18:30 | 1.0 | 7 | q13（closeness／cynic／rarity／plausibility） | marginal |
| c1-u06-l08 | 17 | 18:31 | 1.1 | 5 | q13（perceptively／meaninglessly／favorably／indefinitely） | fraction |
| c1-u07-l01 | 17 | 18:32 | 0.8 | 8 | q13（constraint／turmoil／diversity／induction） | advantageous |
| c1-u07-l02 | 17 | 18:33 | 1.1 | 6 | q13（diversity／restoration／degradation／turmoil） | envisage |
| c1-u07-l03 | 17 | 18:34 | 1.0 | 5 | q13（detrimental／divergent／notable／resilient） | cynic |
| c1-u07-l04 | 16 | 18:35 | 1.0 | 4 | q12（neutralization／detriment／relapse／divergence） | scrutiny |
| c1-u08-l01 | 17 | 18:36 | 1.2 | 9 | q13（demographic／vertical／ethical／aesthetic） | diversity |
| c1-u08-l02 | 17 | 18:38 | 0.9 | 9 | q13（stylistic／acoustic／demographic／geological） | diverge |
| c1-u08-l03 | 17 | 18:39 | 1.0 | 6 | q13（ethically／inherently／credibly／obscurely） | inherent |
| c1-u08-l04 | 17 | 18:40 | 0.9 | 5 | q13（detrimentally／aesthetically／ethically／geologically） | evoke |
| c1-u08-l05 | 16 | 18:41 | 1.2 | 7 | q12（interjections／acoustics／impediments／anthropologists） | intuition |
| c1-u09-l01 | 18 | 18:42 | 0.9 | 9 | q14（descent／heroine／peasant／clan） | cite |
| c1-u09-l02 | 17 | 18:43 | 1.1 | 7 | q13（aesthetic／paternalistic／acoustic／geological） | synopsis |
| c1-u10-l01 | 17 | 18:45 | 0.9 | 8 | q13（complimentary／hostile／voluntary／enthusiastic） | rapport |
| c1-u10-l02 | 17 | 18:46 | 0.8 | 10 | q13（apt／complimentary／provocative／benign） | ingenuity |
| c1-u10-l03 | 17 | 18:47 | 1.0 | 4 | q13（crave／woo／cite／implicate） | rudiments |
| c1-u10-l04 | 17 | 18:48 | 1.0 | 11 | q13（vitality／constraint／deprivation／degradation） | maternal |
| c1-u10-l05 | 17 | 18:49 | 1.1 | 10 | q13（ruthless／candid／avid／dismal） | possessor |
| c1-u10-l06 | 17 | 18:50 | 1.1 | 9 | q14（robust／flattered／disorganized／phenomenal） | aesthetic |
| c1-u10-l07 | 17 | 18:51 | 1.1 | 8 | q13（timid／prolific／fanatic／ludicrous） | methodical |
| c1-u10-l08 | 17 | 18:52 | 1.2 | 4 | q14（prolific／insensitive／timid／avid） | turmoil |
| c1-u10-l09 | 17 | 18:54 | 1.1 | 7 | q13（craving／individuality／toughness／quirk） | offspring |
| c1-u10-l10 | 17 | 18:55 | 1.2 | 9 | q13（smug／impervious／vicious／tranquil） | cynical |

### 正解位置（48 課合計）

| 題型 | 位置 0 | 1 | 2 | 3 |
|---|---|---|---|---|
| listenChoice | 9 | 12 | 12 | 15 |
| mcq | 26 | 21 | 23 | 26 |
| reading 小題 | 21 | 23 | 25 | 27 |

每個選擇題位以 sha256(題位鍵) 決定位置；違規時以 sha256(鍵#n) 重抽（§11.2，沿用 B2 worker 的 place-answers 做法，在 job tmp 執行，未放進本分支）。

### 選項長度名次（執行長 03:35 最終版）

做法：
- 每個選擇題位以 sha256(題位鍵#len) 決定「正解應排第幾長」，再調整措辭長度去配合。
- 並列不算達標，要求正解是唯一名次。
- reading 與 listenChoice 另守「任一選項不超過其他選項平均長度的 2 倍、不短於一半」。

C1 全級結果（第 1、2 批合計 87 課，四選一，區間 13–37%）：

| 題型 | 題數 | 名次 1（最長） | 2 | 3 | 4（最短） |
|---|---|---|---|---|---|
| listenChoice | 87 | 28.7% | 21.8% | 20.7% | 28.7% |
| mcq | 174 | 29.5% | 27.8% | 22.6% | 20.1% |
| reading 小題 | 174 | 27.0% | 24.7% | 27.0% | 21.3% |

- reading 與 listenChoice 每題都照雜湊名次，並守 0.5–2 倍規則，全級 0 不符。
- mcq 只看全級分布。第 2 批刻意提高「正解最短」，全級從第 1 批的 14.8% 拉到 20.1%，落在執行長要的 20–30%。

### 自查

- **目標字情境（§11.3）**：每個目標字除了單字卡，至少出現在一題計分情境題。聽選音檔不計。腳本逐課檢查，48 課全過。
- **造句與翻譯（§11.9）**：造句參考答案都用到目標字，翻譯參考答案都用到提示字，腳本逐課檢查。
- **題幹洩漏（§11.15）**：0 處。
- **雷同自查（§11.4）**：用 B1 的 selfcheck-similarity，含詞形還原、門檻 40%、句型骨架，唯讀複製到 job tmp 執行。最終列出 29 項，逐項人工判定如下：
  - 13 項是不同字誤配：共同實詞來自別的句子，那個句子根本沒用到該目標字。
    - predecessor、circulate、loom、crumb、complementary、explanatory、estimation、domination、marvel、sarcastic 等。
  - 16 項是句型骨架相同，但主詞與情境都不同（三項換兩項），保留：
    - expedite、render×3、flourish、reap、rarity×2（實際句型不同）、plummet、tantamount×2（be tantamount to 是固定結構）、reassure、concur、envisage、evoke、impede×2、dissect、lust。
  - 撰寫過程中被腳本或自己抓到、已改寫的：
    - u01-l01 notwithstanding、u03-l01 elevate、u03-l03 prop、u03-l04 marginal、u04-l07 impervious、u05-l02 marginally、u05-l03 tantamount、u06-l01 ethical（u08-l01）、u07-l02 degradation、u07-l03 detrimental、u08-l01 anthropologist、u08-l02 geological、u08-l04 aesthetically、u08-l05 acoustically、u10-l01 naive、u10-l06 insecure、u10-l07 scoff 等。
- **情境對照表**：見 `c1-context-tables.md`。
  - 從現行檔產生，含人工摘要與現行檔原句兩欄。
  - 腳本核對摘要列的題號與現行檔實際出現該字的題號一致。

### 自評疑慮（請審查時特別看）

1. **gypsy（u09-l02）**：對羅姆人具冒犯意味的舊稱。
   - 單字卡釋義寫「吉普賽人（舊稱，現多用 Roma）」，例句本身就是在說明這是舊稱。
   - 閱讀短文只用在「當時人們稱他們為 gypsies；現在通常用 Roma」的歷史敘述。
   - 是否該教、要不要改成只出現在單字卡，請執行長裁示。
2. **低頻衍生字的例句可能不自然**：課綱裡有不少罕用的副詞或衍生字。
   - 例如 inclusively、maternalistic、insightfully、meaninglessly、demographically、acoustically、stylistically、magnetically、contextually、detrimentally、conditionally、plausibly、credibly。
   - 我盡量找自然的搭配，但有些例句仍偏書面、偏硬。
   - inclusively 教「包容地」（design public spaces inclusively），不教「包含在內地」的計數用法，因為後者在現代英文少見。
> 第 3、4 點是第 1 批送審時的說法，之後已依 c1b1 裁示與「只看英文」規則換過干擾項，現況見上面每課明細表與「第 1 批本輪改動」一節。

3. **為了長度名次，混合詞性 mcq 的干擾項有些過於明顯**：
   - 要讓正解剛好排在指定的長度名次，常用到長字或短字當干擾項，而且在多課重複出現。
   - 長字如 characterization、uncharacteristic、demographically、amplification；短字如 acre、oval、crumb、clan、lust。
   - 這些干擾項文法上通常就放不進空格，等於靠詞性就能排除。同詞性那題則都逐一代入檢查過。
   - 若審查認為太明顯，請指示要放寬到「只看全級分布」，還是逐題換成較像樣的干擾項。
4. **同詞性 mcq 的邊界題**：以下幾題的干擾項是「語意上矛盾」而不是「完全不通」，請審題員特別看有沒有第二答案。
   - u03-l03 q13：flourish／hibernate／disappear／circulate
   - u04-l03 q13：complementary／straightforward／nonprofessional
   - u05-l03 q14：elongate／hibernate／circulate／concentrate
   - u10-l06 q14：flattered／disappointed／disorganized／bored
   - u10-l01 q13：hostile／complimentary／voluntary／oval
5. **醫療相關**：只寫中性事實或情節，不寫建議。
   - u07-l03 翻譯「長期睡眠不足會影響一個人的判斷力」
   - u08-l05 recessive gene、紅頭髮
   - u08-l02 genome
   - u10-l08 恐怖片以醫院為背景、護理師為主角
6. **詞義選擇**：
   - lust 只教 lust for life／adventure，不碰性慾義。
   - con 教名詞「缺點」（pros and cons）。
   - induction 並列「入職訓練；歸納法」。
   - descent 並列「血統；下降」。
   - hostile 並列「敵意的；惡劣的（環境）」。
   - insecure 並列「沒安全感的；不穩固的」。
7. **apt（u10-l02）與 apt to（u01-l01）**：課綱是兩個條目。u10 教形容詞「恰當的、貼切的」，u01 教 be apt to。
8. **單元間複用字有重複**：flourish 在 u04-l03、u04-l07、u05-l01 都被帶入。後續批次會輪替。

### 建議（工具與準則，未改動）

1. **長度名次規則尚未進檢查器**：main 的 check-items 還沒有 ANSWER_LONGEST 或名次分布規則。我用 job tmp 的腳本逐題檢查。建議 A2 worker 的實作併入後，對 C1 重跑一次。
2. **撰寫流水線**：我在 job tmp 把幾個步驟串成一支腳本，建議收進 repo 供各級共用（本批未放進分支）：
   - place-answers 決定正解位置
   - 長度名次目標
   - author-lesson write
   - 目標字情境／造句用字／同詞性註記／複用檢查
   - 雷同自查
3. **雷同腳本的詞形還原漏網**：appalled 的 ECDICT 原形是 appal，比對 appall 會漏掉。我的檢查另加了 -s／-ed／-ing 後綴比對。
4. **片語目標字被拆開就報 UNLEVELED**：pertain to 寫成 pertain only to 時，pertain 單獨無級距，會報 UNLEVELED。撰寫時只能保持片語連續。
5. **opencc 對台灣也常用的寫法仍會誤擋**：遇到時一律照 opencc 改寫，例如宣布→宣佈、家具→傢俱、舞台→舞臺、雇主→僱主、念書→讀書、社區→改寫。B1 worker 已收進 TWP_ACCEPTED 的部分（公布、宣布），等合併後就不會再擋。

## 第 2 批

### 單元與 commit

| 單元 | 主題 | 課 | commit |
|---|---|---|---|
| c1-u11 | 外表與衣著 | l01–l02 | `9d997b8` |
| c1-u12 | 居家生活 | l01–l02 | `5dc1472` |
| c1-u13 | 食物與飲料 | l01 | `caa8787` |
| c1-u14 | 身體與健康 | l01–l02 | `1dc61ac` |
| c1-u15 | 休閒與嗜好 | l01–l03 | `90f2653` |
| c1-u16 | 運動 | l01 | `9011378` |
| c1-u17 | 城鎮與地點 | l01–l02 | `51fc037` |
| c1-u18 | 天氣與自然 | l01–l03 | `8dfd446` |
| c1-u19 | 環境議題 | l01 | `a012f77` |
| c1-u20 | 生活服務 | l01–l03 | `1f4a628` |
| c1-u21 | 媒體與文化 | l01 | `62807da` |
| c1-u22 | 社會與時事 | l01–l03 | `2b92ddd` |
| c1-u23 | 辦公室日常 | l01 | `94c35bd` |
| c1-u24 | 人事與求職 | l01 | `8d13729` |
| c1-u25 | 商務往來 | l01–l02 | `65b97bd` |
| c1-u26 | 財務與預算 | l01 | `c17a0b1` |
| c1-u27 | 採購與物流 | l01 | `bfe95c1` |
| c1-u28 | 餐敘與外食 | l01 | `31c36e8` |
| c1-u29 | 出差與旅程安排 | l01 | `378d2d4` |
| c1-u30 | 藝文與娛樂 | l01 | `d992a09` |
| c1-u31 | 醫療與保險 | l01 | `20d594e` |
| c1-u32 | 房產與設施 | l01 | `083aa3e` |
| c1-u33 | 製造與品管 | l01 | `93e0567` |
| c1-u34 | 科技與技術 | l01–l02 | `aad8f37` |
| c1-u35 | 研發與企業發展 | l01 | `9685449` |

第 2 批寫作期間另有跨課修正 commit：`9c560c2`、`6e74453`、`b738b16`（第 1 批複審修正，順帶處理 u11～u16），以及 `c847735`、`8f4bd1a`、`34fe47a`（下方「自查」說明）。

### 撰寫耗時（帳本）

- 牆鐘時間：19:20 開始 u11，21:04 寫完 u35。中間插入第 1 批複審修正（約 19:33–19:53）、釋義原則複核、只看英文全級自查，所以總時長不等於撰寫時間。
- **u20～u35 共 22 課漏記 start**：我從 u20 起直接執行 `author-lesson write`，沒先執行 `start`，帳本的 startedAt 是 null，所以這 22 課算不出「到第一次 0 錯」的時間。表中改列第 1 輪寫入時間。我沒有補登時間，以免造出不實紀錄。
- u11～u19 有 start 的 17 課：到第一次 0 錯合計約 26 分鐘，中位數 1.1 分。最長是 c1-u18-l02 的 8.8 分，因為中途插入執行長訊息處理。
- u20～u35 只能看第 1 輪寫入時間：20:13 → 21:03，22 課。扣掉中途插入的修正，相鄰兩課的間隔多半是 1～2 分鐘。

### 每課明細

欄位意義同第 1 批。

| 課 | 題數 | 開始（UTC） | 到第一次 0 錯（分） | 寫入輪次 | 四選項同詞性的 mcq | 閱讀短文帶入的前面單元字 |
|---|---|---|---|---|---|---|
| c1-u11-l01 | 17 | 19:20 | 1.2 | 7 | q13（ornamental／facial／muscular／tangled） | exhilarating |
| c1-u11-l02 | 16 | 19:21 | 1.2 | 4 | q13（posture／manicure／physique／silhouette） | strap、sentimental |
| c1-u12-l01 | 16 | 19:22 | 0.9 | 11 | q12（jerseys／postures／radiators／utensils） | eclectic |
| c1-u12-l02 | 16 | 19:23 | 0.9 | 8 | q12（settee／conservatory／buzzer／lavatory） | tranquil |
| c1-u13-l01 | 15 | 19:25 | 1.1 | 3 | q11（degrees／liters／calories／kilograms） | bliss |
| c1-u14-l01 | 16 | 19:26 | 1.1 | 4 | q12（facial／muscular／voracious／traumatic） | conscientious |
| c1-u14-l02 | 16 | 19:28 | 0.7 | 10 | q12（incisor／incision／midwife／fatality） | exuberant |
| c1-u15-l01 | 18 | 19:29 | 1.0 | 10 | q14（repertory／climax／screenwriter／protagonist） | insightful |
| c1-u15-l02 | 18 | 19:30 | 1.1 | 6 | q14（climactic／strapping／bearded／clammy） | spontaneous |
| c1-u15-l03 | 17 | 19:31 | 1.1 | 8 | q13（fiddler／dramatist／screenwriter／midwife） | silhouette |
| c1-u16-l01 | 16 | 19:32 | 0.9 | 10 | q12（unmusical／traumatic／amateur／victorious） | adrenaline |
| c1-u17-l01 | 16 | 19:53 | 0.8 | 2 | q12（orchard／peninsula／quarry／terrain） | advantageous |
| c1-u17-l02 | 16 | 19:55 | 0.6 | 7 | q12（stamina／pathos／suburbia／unison） | amateur |
| c1-u18-l01 | 17 | 19:56 | 1.1 | 6 | q13（snail／fossil／vegetation／goose） | terrain |
| c1-u18-l02 | 17 | 19:57 | 8.8 | 3 | q13（fissure／seedling／otter／goose） | wooded |
| c1-u18-l03 | 17 | 20:08 | 0.9 | 3 | q13（resin／detritus／vegetation／hibernation） | orchard |
| c1-u19-l01 | 16 | 20:09 | 2.1 | 7 | q12（climactic／panoramic／chilly／sustainable） | seedling |
| c1-u20-l01 | 18 | —（漏記 start；第 1 輪 20:13） | — | 6 | q14（credibility／jurisdiction／speculation／verdict） | —（單元第 1 課） |
| c1-u20-l02 | 17 | —（漏記 start；第 1 輪 20:14） | — | 7 | q13（sedentary／forensic／impoverished／juvenile） | tedious |
| c1-u20-l03 | 17 | —（漏記 start；第 1 輪 20:16） | — | 5 | q13（resilience／bribery／abstraction／fragmentation） | somber |
| c1-u21-l01 | 17 | —（漏記 start；第 1 輪 20:20） | — | 5 | q13（coverage／induction／intuition／magnetism） | —（單元第 1 課） |
| c1-u22-l01 | 18 | —（漏記 start；第 1 輪 20:33） | — | 5 | q14（acre／turmoil／upheaval／legacy） | —（單元第 1 課） |
| c1-u22-l02 | 17 | —（漏記 start；第 1 輪 20:34） | — | 5 | q13（mythology／demography／characterization／dissection） | profound |
| c1-u22-l03 | 17 | —（漏記 start；第 1 輪 20:36） | — | 5 | q13（detriment／manicure／brainwashing／climax） | notable |
| c1-u23-l01 | 16 | —（漏記 start；第 1 輪 20:37） | — | 5 | q12（integral／advisory／symptomatic／revealing） | —（單元第 1 課） |
| c1-u24-l01 | 18 | —（漏記 start；第 1 輪 20:39） | — | 3 | q14（inheritance／apprenticeship／formality／sanctity） | —（單元第 1 課） |
| c1-u25-l01 | 15 | —（漏記 start；第 1 輪 20:46） | — | 3 | q11（depiction／collaboration／portrayal／coverage） | —（單元第 1 課） |
| c1-u25-l02 | 15 | —（漏記 start；第 1 輪 20:48） | — | 3 | q11（pinnacle／sponsorship／fissure／suburbia） | oversee |
| c1-u26-l01 | 16 | —（漏記 start；第 1 輪 20:49） | — | 5 | q12（hibernation／overdraft／salvation／legacy） | —（單元第 1 課） |
| c1-u27-l01 | 15 | —（漏記 start；第 1 輪 20:50） | — | 3 | q11（paywall／fatality／mythology／testament） | —（單元第 1 課） |
| c1-u28-l01 | 15 | —（漏記 start；第 1 輪 20:52） | — | 3 | q11（tastebud／connoisseur／saloon／batter） | extravagance |
| c1-u29-l01 | 18 | —（漏記 start；第 1 輪 20:53） | — | 3 | q14（apprenticeship／veneration／transit／extortion） | invoice |
| c1-u30-l01 | 15 | —（漏記 start；第 1 輪 20:55） | — | 3 | q11（screenplay／darkroom／devotee／billiards） | —（單元第 1 課） |
| c1-u31-l01 | 16 | —（漏記 start；第 1 輪 20:56） | — | 3 | q12（acidic／succulent／remedial／wooded） | —（單元第 1 課） |
| c1-u32-l01 | 19 | —（漏記 start；第 1 輪 20:57） | — | 6 | q15（flask／bouquet／plumbing／utensil） | —（單元第 1 課） |
| c1-u33-l01 | 15 | —（漏記 start；第 1 輪 20:59） | — | 3 | q11（durable／unmanned／prophetic／impoverished） | strap、refurbish |
| c1-u34-l01 | 15 | —（漏記 start；第 1 輪 21:00） | — | 3 | q11（psychiatric／portable／contested／restorative） | —（單元第 1 課） |
| c1-u34-l02 | 15 | —（漏記 start；第 1 輪 21:01） | — | 4 | q11（firewall／invoice／shortlist／specification） | durable |
| c1-u35-l01 | 15 | —（漏記 start；第 1 輪 21:03） | — | 4 | q11（premise／exploitation／credential／renown） | gadget |

### 正解位置（第 2 批 39 課）

| 題型 | 位置 0 | 1 | 2 | 3 |
|---|---|---|---|---|
| listenChoice | 6 | 10 | 11 | 12 |
| mcq | 17 | 28 | 16 | 17 |
| reading 小題 | 19 | 20 | 20 | 19 |

全級 87 課：listenChoice 15／22／23／27，mcq 43／49／39／43，reading 40／43／45／46。

### 自查

- **檢查器**：全級 `check-items` 87 課全綠；第 1 批 `--require-judge` 48 課全綠；`npm test` 166／166。
- **目標字情境、造句與翻譯用字、同詞性 mcq、單元間複用**：腳本逐課檢查，39 課全過。
- **干擾項（mcq 174 題全級重掃，詞形還原後比對）**：
  - 只用本課、先前課或 B2 以下的字。
  - 非本單元的字不跨課重複。
  - 同課兩題不共用干擾項，也不拿另一題正解當干擾項。
  - 結果 0 違規。
  - 詞形還原規則：-s／-es／-ies／-ves、-ed／-ied、-ing、-er／-est、雙子音，加上約 60 個不規則形。有多個可能原形時取最短，寧可多抓。
  - 用 pressed、funerals、duvets、counties 等字驗證過，都能還原。
- **只看英文**：
  - 全級 148 題（當時已寫到 u24）逐題把干擾項放進英文句。違規 16 題，已全改（`34fe47a`）。
  - 執行長裁示的邊界題 u10-l10-q13 也改了（`c07ed49`）。
  - u24 之後照這條規則寫，寫完再逐題看過一次。
- **釋義原則**：
  - 第一義是該級最常用、最符合單元主題的詞義，例句也示範這個詞義。
  - 6e74453 調換過順序的 63 張卡逐張複核：42 張改回原順序並改寫例句，21 張判斷調上去的就是最常用義，維持不變（清單已回報執行長）。
  - 第 2 批另修 chilly、neutralize、conform、somersault。
  - 詞性標註格式的釋義（「（n）X（v）Y」）：全級掃描 0 張。
- **情境對照表**：`c1-context-tables.md` 已依現行 87 課重新產生，腳本核對摘要題號與現行檔一致。

### 自評疑慮（請審查時特別看）

1. **敏感主題單元**：只寫中性事實或情節，不寫建議，不涉政治立場與刻板印象。
   - u20 法律與犯罪：convict、verdict、harassment、bribe、persecution、extortion。persecute／persecution 只用在「過去有人因信念受迫害」的歷史敘述與舊監獄博物館。
   - u22 宗教與社會：preach、prophet、salvation 只寫成中性事實或人物故事。brainwash 用在廣告與電子遊戲的討論。
   - u31 醫療：psychiatrist、psychiatric、trauma、incision 等只寫中性事實，例如醫院屋頂花園、地震後的創傷。翻譯題「有些人壓力太大時會去看精神科醫師」是描述，不是建議。
   - u26 財務：寫成小鎮游泳池預算的故事，不給理財建議。
2. **多義字的第一義選擇**：
   - suspension 教「暫停、停職」，懸吊系統放第二義。
   - saloon 教「酒館」。
   - carrier 教「貨運公司」。
   - demo 教「示範、展示」，試聽帶放第二義。
   - compromised 教「外洩的、被盜用的」。
   - synthetic 教「人造的」。
   - repute 照課綱教動詞「被認為」（is reputed to）。
   - 請確認是否符合「該級最常用」。
3. **只看英文規則與「一眼可排除」的取捨**：為了讓干擾項放進英文句子一定不通，干擾項常用語意明顯不搭的字，例如 canoe、hedgehog、manicure。這可能又落入「一眼可排除」的舊顧慮。我以只看英文規則為優先。
4. **帳本漏記 start**：見上方耗時一節，是我的流程疏失。
5. **連字號目標字**：cost-effective、mark-up 一開始被我自己的自查腳本誤判成缺字，修好腳本後重查通過。正式檢查器沒有這個問題。

### 建議（工具與準則，未改動）

1. **只看英文規則無法自動檢查**：check-items 只能檢查文法層級的東西，語意通不通需要盲答或人工審題。建議第②關盲答時只給英文句。
2. **干擾項稽核建議收進 repo**：詞形還原後比對「同課共用、當另一題正解、跨課重複」三項。我的版本在 job tmp。
3. **author-lesson write 可以在沒有 start 時警告**：避免像這次 u20～u35 的帳本缺 startedAt。
