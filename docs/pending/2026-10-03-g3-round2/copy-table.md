# G3 第二輪介面文案定稿對照表（2026-10-03）

執行長代決（創辦人 2026-10-02 授權），worker 依派工原則定稿；共 81 條：改寫 17、沿用 64。
原句＝app/src/i18n/zh-TW.json 於 66914ed 的值；定稿已寫入同檔，`_pendingG3` 已移除、`_status`＝approved-CEO-G3r2-2026-10-03。

| key | 畫面位置（白話） | 原句 | 定稿 | 理由 |
|---|---|---|---|---|
| `account.panel.mismatch` | 設定頁「帳號與同步」區：登入時發現這支手機的資料屬於另一個帳號、剛登入的帳號被自動登出，登入入口上方的紅字 | 這支手機上有另一個帳號的學習資料。請先用原帳號登入並登出，或到設定清除這支手機上的資料。 | 這支手機上的學習資料屬於另一個帳號，所以沒有登入。請先用原帳號登入再登出，或在上方「資料」區清除這支手機上的資料，再重新登入。 | 補「發生什麼」（沒登入成功）；人已在設定頁，不再說「到設定」，改指上方「資料」區。已核：登出會先同步再清空本機（sync/engine.ts flushAndClear），故「原帳號登入再登出」可解 |
| `clearData.dialog.failed` | 設定 →「清除這支手機上的資料」確認框：清除失敗時，按鈕上方的紅字 | 清除失敗，請關閉其他分頁後再試一次 | 清除沒有完成。如果其他分頁也開著 LinguaApp，請先關掉再試一次。 | 改成「發生什麼＋怎麼辦」；其他分頁占用資料庫是常見原因但非唯一，改用「如果」語氣；補句號與第一輪錯誤訊息一致 |
| `common.action.close` | （目前沒有畫面使用；預留的通用「關閉」） | 關閉 | 關閉 | 沿用。程式內無引用，列為未使用 key 提報、不刪 |
| `course.sheet.title` | 課程頁點某一課後跳出的小課詳情彈層，最上面的標題（例：自我介紹・第 3 課） | {unit} {n} | {unit}・第 {n} 課 | 課名維持「單元名＋序號」、不另造小課名；原「{unit} {n}」遇單元名以（一）結尾時會讀成「數字、時間與日期（一） 3」，改與課程地圖「第 {n} 課」同一說法 |
| `course.unit.lesson` | 課程地圖展開單元後，每一課的名稱 | 第 {n} 課 | 第 {n} 課 | 沿用 |
| `dict.sheet.loadFailed` | 點英文字查義的字典彈層：字典資料讀取失敗時，英文字下方的說明 | 字典載入失敗，請再試一次 | 字典載入失敗。請關閉後再點一次這個字。 | 彈層沒有重試鈕，「請再試一次」沒說怎麼試；改寫具體做法 |
| `dict.sheet.loading` | 字典彈層讀取中（只給讀螢幕軟體念） | 查詢中… | 查詢中… | 沿用 |
| `download.action.startNamed` | 設定「語音」區的「下載」鈕，讀螢幕軟體念的完整名稱（例：下載語音辨識模型） | 下載{name} | 下載{name} | 沿用 |
| `download.status.failedRetry` | 模型下載失敗時，進度條下方的紅字按鈕（設定頁與跟讀題皆用） | 下載中斷・重試 | 下載中斷・重試 | 沿用（第一輪「下載中斷」＋「重試」的合併版） |
| `download.status.percent` | 模型下載中，進度條旁的百分比 | {n}% | {n}% | 沿用 |
| `home.next.levelDone` | 首頁「下一課」小卡：目前級距的課全部上完時 | 這個級距的課都上完了 | 這個級距的課都上完了 | 沿用 |
| `home.next.title` | 首頁「下一課」小卡裡的課名 | {unit} {n} | {unit}・第 {n} 課 | 同 course.sheet.title，全 App 課名同一格式 |
| `home.today.summaryLesson` | 首頁「今天的學習」大卡標題下方：今天沒有到期複習、只上新課時 | 上一課・約 {min} 分鐘 | 上一堂新課・約 {min} 分鐘 | 放在行首的「上一課」會被讀成「前一課」；改「上一堂新課」，與首頁「新課」用語一致 |
| `install.card.close` | 「把 LinguaApp 加到主畫面」提示卡右上角 ✕，讀螢幕軟體念的名稱 | 關閉加到主畫面提示 | 關閉加到主畫面提示 | 沿用 |
| `lesson.done.subtitle` | 小課完成頁，大標題「這一課完成了」下方的課名 | {unit} {n} | {unit}・第 {n} 課 | 同 course.sheet.title |
| `lesson.error.back` | 小課整課載入失敗時，訊息下方的按鈕 | 回到課程 | 回到課程 | 沿用 |
| `lesson.error.body` | 小課整課載入失敗時顯示的訊息 | 這一課載入失敗 | 這一課載入失敗，請回到課程再試一次。 | 補「怎麼辦」，與下方「回到課程」鈕呼應 |
| `lesson.frame.count` | 上課中頂部進度條旁的題數（例：3／12） | {n}／{total} | {n}／{total} | 沿用 |
| `lesson.leave.body` | 上課中按左上角 ✕ 跳出的離開確認框說明（還沒做完時） | 目前做到 {done}／{total} 題。離開後下次會從第 {next} 題繼續。 | 已完成 {done}／{total} 題。進度會保留，下次從第 {next} 題繼續。 | 依實際行為寫可續（lesson/session.ts 有對得上的存檔即接續）；不採第一輪「從第 1 題重新開始」；{done}{total}{next} 三參數皆保留 |
| `lesson.leave.bodyDone` | 離開確認框說明（最後一題已作答、還沒按繼續時） | 這一課已經做完了，離開後會記為完成。 | 這一課已經做完了，離開後會記為完成。 | 沿用。已核：此時離開會執行結算（LessonScreen leave→finish） |
| `lesson.listen.almost` | 聽音打字答錯時，底部回饋條開頭（後面接錯在哪） | 差一點： | 差一點： | 沿用（同第一輪「差一點：」） |
| `lesson.listen.answerWas` | 聽音打字按「聽不出來」後，底部回饋條的標題（下面接正確句子） | 這一句是 | 答案是 | 與選擇題回饋「答案是 {letter}：」同一說法；「這一句是」語意偏弱 |
| `lesson.listen.choiceTitle` | 聽音選答題卡片標題 | 聽音選答 | 聽音選答 | 沿用（同題型名） |
| `lesson.listen.giveUp` | 聽音打字題底部左邊的次要按鈕 | 聽不出來 | 聽不出來 | 沿用（第一輪 listen.question.cantHear 已定「聽不出來」） |
| `lesson.listen.hqFailed` | 聽力題：高音質發音出錯、自動改用內建聲音時，卡片下方的提示 | 高音質發音無法使用，已改用手機內建聲音 | 高音質發音無法使用，已改用手機內建聲音 | 沿用。已核：失敗自動退回內建聲音（speech/speak.ts） |
| `lesson.listen.hqHint` | 聽力題作答前，卡片下方建議開啟高音質發音的小字 | 想要更自然的發音，可以到設定開啟「高音質發音」（選配） | 想要更自然的發音，可以到設定開啟「高音質發音」（選配） | 沿用（同第一輪 listen.question.voiceHint） |
| `lesson.listen.missing` | 聽音打字答錯時，正解句子中漏打的字以底線標示 | ＿＿ | ＿＿ | 沿用（符號，無中文） |
| `lesson.listen.placeholder` | 聽音打字輸入框裡的灰字提示（也是讀螢幕軟體念的名稱） | 把聽到的英文打在這裡 | 把聽到的英文打在這裡 | 沿用（同第一輪 listen.type.placeholder） |
| `lesson.listen.slow` | 聽力題播放鈕旁的「慢速播放」鈕 | 慢速播放 | 慢速播放 | 沿用（同第一輪） |
| `lesson.listen.systemVoice` | 聽力題播放鈕旁的小標籤，表示目前用哪種聲音 | 手機內建聲音 | 手機內建聲音 | 沿用（同第一輪 listen.question.voiceTag） |
| `lesson.listen.typePrompt` | 聽音打字題卡片裡的說明 | 聽句子，把聽到的英文打出來 | 聽句子，把聽到的英文打出來 | 沿用（同第一輪 listen.type.instruction） |
| `lesson.listen.typeTitle` | 聽音打字題卡片標題 | 聽音打字 | 聽音打字 | 沿用（同題型名） |
| `lesson.reading.hideTranslation` | 閱讀理解題：中文翻譯展開後，切換鈕的文字 | 收起翻譯 | 收起中文翻譯 | 與展開前的「看中文翻譯」對稱 |
| `lesson.reading.question` | 閱讀理解題：文章下方的小題題號與題目（例：1／3　題目） | {n}／{total}　{question} | {n}／{total}　{question} | 沿用 |
| `lesson.wordCard.hintLabel` | 單字卡按「看例句提示」後，例句上方的小標 | 例句提示 | 例句提示 | 沿用 |
| `nav.bar.label` | 底部導覽列（今天／課程／單字庫），讀螢幕軟體念的名稱 | 主要導覽 | 主要導覽 | 沿用 |
| `placement.pick.exit` | 分級測驗左上角 ✕，讀螢幕軟體念的名稱 | 離開 | 離開 | 沿用（同第一輪 common.exitLesson） |
| `placement.result.retest` | 分級測驗結果頁：勾到太多假字時，底部取代「從 X 開始」的主要按鈕 | 重新測驗 | 重新測驗 | 沿用 |
| `placement.result.retestHint` | 分級測驗結果頁：勾到太多假字時的黃色提示 | 勾到 {count} 個假字，結果可能不準，建議重新測驗 | 勾到 {count} 個假字，這次結果不太準。建議重新測驗，或自己選級距。 | 結果頁同時有「想自己選級距」鈕，提示補上第二條路；{count} 保留 |
| `placement.result.toeicNote` | 分級測驗結果頁：大字級距下方的小字註記 | 多益分數依 ETS 官方 CEFR 對照，僅供參考 | 多益分數指聽力分項，依 ETS 官方的 CEFR 對照，僅供參考 | 核對程式：顯示的分數取自 TOEIC_LISTENING（聽力分項門檻，curriculum.ts），補「聽力分項」以免誤讀為總分 |
| `review.done.correct` | 複習完成頁統計卡：答對幾個 | 答對 {n} 個 | 答對 {n} 個 | 沿用 |
| `review.done.empty` | 複習完成頁：進來時沒有到期單字 | 目前沒有到期的單字 | 目前沒有到期的單字 | 沿用 |
| `review.done.home` | 複習完成頁底部主要按鈕 | 回到今天 | 回到今天 | 沿用 |
| `review.done.summary` | 複習完成頁統計卡標題 | 這一輪 | 這一輪 | 沿用（對應小課完成頁「這一課」） |
| `review.done.title` | 複習完成頁大標題 | 複習完成 | 複習完成 | 沿用 |
| `review.done.words` | 複習完成頁統計卡：共複習幾個字 | {n} 個字 | {n} 個字 | 沿用 |
| `review.error.back` | 複習載入失敗時，訊息下方的按鈕 | 回到今天 | 回到今天 | 沿用 |
| `review.error.body` | 複習載入失敗時顯示的訊息 | 複習載入失敗 | 複習載入失敗，請回到今天再試一次。 | 補「怎麼辦」，與下方「回到今天」鈕呼應 |
| `review.frame.count` | 複習中頂部進度條旁的計數（例：複習 3／10） | 複習 {n}／{total} | 複習 {n}／{total} | 沿用（同第一輪 lesson.wordCard.progress） |
| `review.frame.progress` | 複習中頂部進度條，讀螢幕軟體念的名稱 | 複習進度 | 複習進度 | 沿用 |
| `settings.voice.ttsHqValue` | 設定「語音」區「發音」列右側：目前選高音質時 | 高音質發音 | 高音質發音 | 沿用 |
| `speak.download.bodyIdle` | 跟讀題：語音辨識模型還沒下載時，卡片下方的說明 | 約 50–80MB，只需下載一次，之後不用網路也能跟讀。 | 約 50–80MB，只需下載一次，之後不用網路也能跟讀。 | 沿用（第一輪 download.stt.body 前半）。已核：模型存在瀏覽器快取 transformers-cache，下載後可離線 |
| `speak.download.titleIdle` | 跟讀題：語音辨識模型還沒下載時，卡片標題（右邊有「下載」鈕） | 需要下載語音辨識模型 | 需要下載語音辨識模型 | 沿用 |
| `speak.fallback.accept` | 改用瀏覽器語音辨識的同意框：主要按鈕 | 同意並使用 | 同意並使用 | 沿用 |
| `speak.fallback.body` | 改用瀏覽器語音辨識的同意框說明 | 這支手機無法在本機轉文字。改用瀏覽器的語音辨識時，錄音將傳送到瀏覽器廠商伺服器轉成文字。同意只在這次使用期間有效。 | 這支手機無法在本機把錄音轉成文字。改用瀏覽器內建的語音辨識時，錄音可能會傳送到瀏覽器廠商的伺服器轉成文字。這次同意到關閉 LinguaApp 為止，下次開啟會再詢問。 | 隱私事實逐條核對 speech/webSpeech.ts：同意只存記憶體、重開要再問 → 把「只在這次使用期間有效」寫成白話；各瀏覽器 Web Speech 實作不同（有的在裝置上處理），送廠商伺服器改「可能會」（執行長審定）。用「LinguaApp」不用「App」：e2e 英文字串守衛（e2e/measure.ts）白名單沒有「App」 |
| `speak.fallback.decline` | 同意框的次要按鈕 | 不用了 | 不用了 | 沿用 |
| `speak.fallback.offer` | 跟讀題：本機辨識不能用時出現的文字按鈕 | 改用瀏覽器的語音辨識 | 改用瀏覽器的語音辨識 | 沿用 |
| `speak.fallback.title` | 同意框標題 | 改用瀏覽器的語音辨識？ | 改用瀏覽器的語音辨識？ | 沿用 |
| `speak.question.busyWeb` | 跟讀題：用瀏覽器語音辨識轉文字時，大圓鈕下方的小字 | 轉文字中…（錄音會傳送到瀏覽器廠商伺服器） | 轉文字中…（錄音可能會傳送到瀏覽器廠商的伺服器） | 與同意框說明同一句法（補「的」、改「可能會」：各瀏覽器 Web Speech 實作不同，執行長審定）；事實同上 |
| `speak.question.failed` | 跟讀題：錄音或辨識失敗時，大圓鈕下方的小字 | 錄音或轉文字失敗，請再唸一次 | 錄音或轉文字失敗，請再唸一次 | 沿用 |
| `speak.question.preparing` | 跟讀題：辨識模型載入中，大圓鈕下方的小字與鈕名 | 語音辨識準備中… | 語音辨識準備中… | 沿用 |
| `speak.question.unsupported` | 跟讀題：瀏覽器不能錄音時，大圓鈕下方的小字與鈕名 | 這個瀏覽器無法錄音 | 這個瀏覽器無法錄音 | 沿用 |
| `speak.result.almost` | 跟讀送出後有錯時，底部回饋條開頭（後面接漏掉的字） | 差一點： | 差一點： | 沿用 |
| `speak.result.missing` | 跟讀結果句中漏唸位置的底線，讀螢幕軟體念的名稱 | 漏字 | 漏字 | 沿用（同計分列「漏字」） |
| `stub.page.backHome` | 尚未開放頁的按鈕 | 回到今天 | 回到今天 | 沿用 |
| `stub.page.body` | 設定「隱私說明・授權・原始碼」等尚未完成的頁面，標題下方的說明 | 這個功能還在製作中，之後的版本會開放。 | 這一頁還在製作中，之後的版本會開放。 | 目前掛的是「隱私說明」等頁面而非功能，改「這一頁」 |
| `stub.page.title` | 尚未開放頁的標題 | 尚未開放 | 尚未開放 | 沿用 |
| `words.due.newWord` | 單字庫列表：還沒開始複習的字，右側標示 | 新字 | 新字 | 沿用（同熟悉度「新字」） |
| `words.due.years` | 單字庫列表：下次複習在一年以後 | {n} 年後 | {n} 年後 | 沿用 |
| `words.filter.familiarityAll` | 單字庫「熟悉度」篩選彈層的第一個選項 | 全部 | 全部 | 沿用 |
| `words.filter.familiaritySheet` | 單字庫「熟悉度」篩選彈層的標題 | 依熟悉度篩選 | 依熟悉度篩選 | 沿用 |
| `words.filter.scopeLabel` | 單字庫篩選鈕群組（全部／到期／收藏），讀螢幕軟體念的名稱 | 篩選範圍 | 篩選範圍 | 沿用 |
| `words.list.noMatch` | 單字庫搜尋或篩選後沒有結果 | 沒有符合條件的單字 | 沒有符合條件的單字 | 沿用 |
| `settings.ai.oauthPending` | 從 OpenRouter 授權頁跳回 App、等待完成時的畫面文字 | 正在完成 OpenRouter 授權… | 正在完成 OpenRouter 授權… | 沿用 |
| `settings.ai.unlinkCancel` | 「解除 OpenRouter 連結？」確認框的次要按鈕 | 取消 | 取消 | 沿用 |
| `settings.ai.modelFree` | 設定 AI 批改「模型」選單：免費模型那一列（{name} 為英文模型名） | {name}・免費 | {name}・免費 | 沿用 |
| `settings.ai.modelPrice` | 設定 AI 批改「模型」選單：付費模型那一列的價格 | {name}・每百萬詞元 輸入 {input}／輸出 {output} 美元 | {name}・每百萬詞元 輸入 {input}／輸出 {output} 美元 | 沿用。已核：價格為每百萬 token 美元（llm/client.ts promptPerM）；英文「token」會被介面英文字串守衛擋下，維持「詞元」 |
| `settings.ai.modelsLoading` | 模型選單讀取中 | 正在讀取模型清單… | 正在讀取模型清單… | 沿用 |
| `settings.ai.modelsFailed` | 模型選單讀取失敗 | 讀不到模型清單，請稍後再試。 | 讀不到模型清單，請稍後再試。 | 沿用 |
| `settings.key.unverified` | 貼上金鑰頁：連不到 OpenRouter、無法驗證時的紅字 | 現在連不到 OpenRouter 驗證金鑰，請稍後再試。 | 現在連不到 OpenRouter 驗證金鑰，請稍後再試。 | 沿用 |
| `write.fail.other` | 寫作題 AI 批改失敗（原因不是額度、網路或金鑰）時的說明 | AI 這次沒有給出可用的結果。可以先對照參考答案，或稍後再試。 | AI 這次沒有給出可用的結果。可以先對照參考答案，或稍後再試。 | 沿用 |
