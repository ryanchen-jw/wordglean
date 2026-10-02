# G3 定稿回寫報告（g3-apply.mjs 產生，勿手改）

總表 279 列 → 覆寫 5、值相同 130、新增 143、拆開渲染視同相同 3、衝突保留 4；json 待審（_pendingG3）33

## 覆寫（main 的值與定稿不同）

| json key | 原值 | 定稿 |
|---|---|---|
| `lesson.frame.progress` | 小課進度 | 作答進度 |
| `words.filter.familiarityNew` | 陌生 | 新字 |
| `words.filter.familiarityFamiliar` | 熟悉 | 已熟悉 |
| `install.card.bodyPrompt` | 像一般應用程式一樣從主畫面開啟，沒有網路也能複習。 | 之後從主畫面直接開啟，沒有網路也能複習。 |
| `settings.data.exportDone` | 已匯出學習紀錄 | 學習紀錄已匯出 |

## 衝突：定稿與程式現況不符，保留原值、列入 _pendingG3

| json key | 保留的原值 | 定稿 | 理由 |
|---|---|---|---|
| `home.next.title` | {unit} {n} | {topic} {number}｜{title} | 定稿「{topic} {number}｜{title}」需要小課名稱，但課綱資料沒有小課名（只有主題名＋第幾課），程式顯示「{unit} {n}」 |
| `course.sheet.title` | {unit} {n} | {topic} {number}｜{title} | 定稿「{topic} {number}｜{title}」需要小課名稱，但課綱資料沒有小課名（只有主題名＋第幾課），程式顯示「{unit} {n}」 |
| `lesson.done.subtitle` | {unit} {n} | {topic} {number}｜{title} | 定稿「{topic} {number}｜{title}」需要小課名稱，但課綱資料沒有小課名（只有主題名＋第幾課），程式顯示「{unit} {n}」 |
| `lesson.leave.body` | 目前做到 {done}／{total} 題。離開後下次會從第 {next} 題繼續。 | 目前做到 {current}／{total} 題。離開後下次會從第 1 題重新開始。 | 定稿寫「離開後下次會從第 1 題重新開始」，但 TASK-12 已實作續作（下次從第 {next} 題繼續）；照定稿會說錯話 |

## 拆開渲染、顯示結果與定稿相同（不改）

- `lesson.feedback.answerIs`「答案是 {letter}：」← 定稿「答案是 {letter}：{answer}」：程式把「{answer}」（英文，可點查義）接在後面另外渲染，畫面結果與定稿相同
- `lesson.wordCard.isGloss`「 是「{gloss}」」← 定稿「{word} 是「{meaning}」」：程式先渲染英文字「{word}」（可點查義），再接「 是「{gloss}」」，畫面結果與定稿相同
- `words.header.summaryEmpty`「共 0 字」← 定稿「共 {count} 字」：只在 0 字時顯示，json 寫死「共 0 字」與定稿 count=0 相同

## 待審 _pendingG3（main 有、總表沒有，或衝突，或 G3 後新增）

- `account.panel.mismatch`：這支手機上有另一個帳號的學習資料。請先用原帳號登入並登出，或到設定清除這支手機上的資料。
- `clearData.dialog.failed`：清除失敗，請關閉其他分頁後再試一次
- `common.action.close`：關閉
- `course.sheet.title`：{unit} {n}
- `course.unit.lesson`：第 {n} 課
- `dict.sheet.loadFailed`：字典載入失敗，請再試一次
- `dict.sheet.loading`：查詢中…
- `download.action.startNamed`：下載{name}
- `download.status.failedRetry`：下載中斷・重試
- `download.status.percent`：{n}%
- `home.next.levelDone`：這個級距的課都上完了
- `home.next.title`：{unit} {n}
- `home.today.summaryLesson`：上一課・約 {min} 分鐘
- `install.card.close`：關閉加到主畫面提示
- `lesson.done.subtitle`：{unit} {n}
- `lesson.error.back`：回到課程
- `lesson.error.body`：這一課載入失敗
- `lesson.frame.count`：{n}／{total}
- `lesson.leave.body`：目前做到 {done}／{total} 題。離開後下次會從第 {next} 題繼續。
- `lesson.leave.bodyDone`：這一課已經做完了，離開後會記為完成。
- `lesson.reading.hideTranslation`：收起翻譯
- `lesson.reading.question`：{n}／{total}　{question}
- `lesson.wordCard.hintLabel`：例句提示
- `nav.bar.label`：主要導覽
- `stub.page.backHome`：回到今天
- `stub.page.body`：這個功能還在製作中，之後的版本會開放。
- `stub.page.title`：尚未開放
- `words.due.newWord`：新字
- `words.due.years`：{n} 年後
- `words.filter.familiarityAll`：全部
- `words.filter.familiaritySheet`：依熟悉度篩選
- `words.filter.scopeLabel`：篩選範圍
- `words.list.noMatch`：沒有符合條件的單字

## 新增 key（總表 key → json key）

- `common.text.play` ← common.play
- `common.text.playAgain` ← common.playAgain
- `common.text.toeicApprox` ← common.toeicApprox
- `common.text.processing` ← common.processing
- `common.text.retry` ← common.retry
- `common.text.later` ← common.later
- `common.text.almost` ← common.almost
- `common.text.tapToLookup` ← common.tapToLookup
- `common.text.justNow` ← common.justNow
- `home.tile.nextOffline` ← home.tile.nextOffline
- `course.unit.expand` ← course.expand
- `course.detail.listen` ← course.detail.listen
- `course.detail.speak` ← course.detail.speak
- `course.detail.read` ← course.detail.read
- `course.detail.write` ← course.detail.write
- `lesson.type.listenType` ← lesson.type.listenType
- `lesson.type.listenChoice` ← lesson.type.listenChoice
- `lesson.type.speak` ← lesson.type.speak
- `lesson.type.translate` ← lesson.type.translate
- `lesson.type.sentence` ← lesson.type.sentence
- `lesson.question.loadError` ← lesson.loadError
- `lesson.question.loadErrorNext` ← lesson.loadErrorNext
- `listen.type.instruction` ← listen.type.instruction
- `listen.type.placeholder` ← listen.type.placeholder
- `listen.question.slow` ← listen.slow
- `listen.question.cantHear` ← listen.cantHear
- `listen.question.voiceTag` ← listen.voiceTag
- `listen.question.voiceHint` ← listen.voiceHint
- `speak.question.instruction` ← speak.instruction
- `speak.question.listenDemo` ← speak.listenDemo
- `speak.question.record` ← speak.record
- `speak.question.idleHint` ← speak.idleHint
- `speak.question.skipNow` ← speak.skipNow
- `speak.question.stop` ← speak.stop
- `speak.question.recording` ← speak.recording
- `speak.question.busyAria` ← speak.busyAria
- `speak.question.busy` ← speak.busy
- `speak.question.target` ← speak.target
- `speak.confirm.label` ← speak.confirm.label
- `speak.confirm.hint` ← speak.confirm.hint
- `speak.question.retry` ← speak.retry
- `speak.question.submit` ← speak.submit
- `speak.result.label` ← speak.result.label
- `speak.result.score` ← speak.result.score
- `speak.denied.aria` ← speak.denied.aria
- `speak.denied.body` ← speak.denied.body
- `speak.denied.allow` ← speak.denied.allow
- `speak.denied.skip` ← speak.denied.skip
- `speak.download.aria` ← speak.download.aria
- `speak.download.hint` ← speak.download.hint
- `speak.download.skip` ← speak.download.skip
- `write.question.hintWords` ← write.hintWords
- `write.question.skip` ← write.skip
- `write.question.submit` ← write.submit
- `write.question.grading` ← write.grading
- `write.question.yours` ← write.yours
- `write.ai.suggestion` ← write.ai.suggestion
- `write.ai.explanation` ← write.ai.explanation
- `write.ai.by` ← write.ai.by
- `write.ai.done` ← write.ai.done
- `write.question.reference` ← write.reference
- `write.nokey.prompt` ← write.nokey.prompt
- `write.nokey.hint` ← write.nokey.hint
- `write.nokey.goSettings` ← write.nokey.goSettings
- `write.nokey.wrong` ← write.nokey.wrong
- `write.nokey.right` ← write.nokey.right
- `write.fail.title` ← write.fail.title
- `write.fail.quota` ← write.fail.quota
- `write.fail.network` ← write.fail.network
- `write.fail.offline` ← write.fail.offline
- `write.fail.keyInvalid` ← write.fail.keyInvalid
- `write.fail.changeModel` ← write.fail.changeModel
- `write.sentence.instruction` ← write.sentence.instruction
- `lesson.wordCard.progress` ← card.progress
- `placement.pick.group` ← placement.group
- `placement.pick.instruction` ← placement.instruction
- `placement.pick.hint` ← placement.hint
- `placement.pick.next` ← placement.next
- `placement.pick.finish` ← placement.finish
- `placement.result.title` ← placement.result.title
- `placement.result.chart` ← placement.result.chart
- `placement.result.penalty` ← placement.result.penalty
- `placement.result.start` ← placement.result.start
- `placement.result.choose` ← placement.result.choose
- `settings.learning.levelSheet` ← settings.levelPicker
- `settings.ai.oauthFail` ← settings.ai.oauthFail
- `settings.ai.writingPrivacy` ← settings.ai.writingPrivacy
- `settings.ai.linked` ← settings.ai.linked
- `settings.ai.model` ← settings.ai.model
- `settings.ai.freeModel` ← settings.ai.freeModel
- `settings.ai.quota` ← settings.ai.quota
- `settings.ai.unlink` ← settings.ai.unlink
- `settings.ai.unlinkConfirmTitle` ← settings.ai.unlinkConfirm.title
- `settings.ai.unlinkConfirmBody` ← settings.ai.unlinkConfirm.body
- `settings.key.title` ← settings.key.title
- `settings.key.label` ← settings.key.label
- `settings.key.invalid` ← settings.key.invalid
- `settings.key.rejected` ← settings.key.rejected
- `settings.key.save` ← settings.key.save
- `settings.key.verifying` ← settings.key.verifying
- `settings.voice.hqUnsupported` ← settings.voice.hqUnsupported
- `settings.account.lastSync` ← settings.account.lastSync
- `clearData.dialog.done` ← clearData.done
- `account.panel.entry` ← account.entry
- `account.panel.intro` ← account.intro
- `account.panel.google` ← account.google
- `account.email.label` ← account.email.label
- `account.email.send` ← account.email.send
- `account.code.label` ← account.code.label
- `account.code.submit` ← account.code.submit
- `account.code.changeEmail` ← account.code.changeEmail
- `account.panel.error` ← account.error
- `account.panel.signedIn` ← account.signedIn
- `account.panel.logout` ← account.logout
- `account.panel.logoutBlocked` ← account.logoutBlocked
- `download.stt.title` ← download.stt.title
- `download.stt.body` ← download.stt.body
- `download.status.failed` ← download.failed
- `download.hq.confirmTitle` ← download.hq.confirmTitle
- `download.hq.confirmBody` ← download.hq.confirmBody
- `download.hq.delete` ← download.hq.delete
- `download.hq.deleteConfirmTitle` ← download.hq.deleteConfirmTitle
- `download.hq.deleteConfirmBody` ← download.hq.deleteConfirmBody
- `download.status.storageFull` ← download.storageFull
- `install.update.title` ← install.updateReady
- `install.update.reload` ← install.reload
- `install.update.offlineReady` ← install.offlineReady
- `system.offline.needNetwork` ← system.offline.needNetwork
- `system.offline.lessonNotDownloaded` ← system.offline.lessonNotDownloaded
- `system.mic.title` ← system.mic.title
- `system.mic.body` ← system.mic.body
- `system.mic.blocked` ← system.mic.blocked
- `system.storage.title` ← system.storage.title
- `system.storage.body` ← system.storage.body
- `system.storage.allow` ← system.storage.allow
- `system.error.generic` ← system.error.generic
- `system.error.dataLoad` ← system.error.dataLoad
- `system.sync.failed` ← system.sync.failed
- `system.toast.unsaved` ← system.toast.unsaved
- `system.toast.gradeFailed` ← system.toast.gradeFailed
- `system.toast.unlinked` ← system.toast.unlinked
- `system.page.notFound` ← system.notFound
- `system.page.appDescription` ← system.appDescription
