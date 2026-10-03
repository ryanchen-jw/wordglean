// e2e 小課輔助（lesson.ts）自身的回歸（TASK-22 移交，TASK-15 整合驗收 P2）：
// 寫作題自評按下即進下一題，answer() 記下「這一頁已前進」；這個記號不得殘留到別的頁面（別的測試）
import { test } from '@playwright/test'
import { answer, count, LESSON, next, playTo, WRITE_STEPS } from './lesson.js'
import { fakeSystemVoice } from './speech.js'

test('寫作題作答後沒呼叫 next，換一個頁面時 next 仍會按「繼續」', async ({ browser }) => {
  test.setTimeout(90_000)
  const ctxA = await browser.newContext()
  const ctxB = await browser.newContext()
  try {
    const a = await ctxA.newPage()
    await a.addInitScript(() => localStorage.setItem('lg.installDismissed', '1'))
    await fakeSystemVoice(a)
    await a.goto(`/lesson/${LESSON}`)
    await playTo(a, WRITE_STEPS[0])
    await answer(a, WRITE_STEPS[0])

    const b = await ctxB.newPage()
    await b.addInitScript(() => localStorage.setItem('lg.installDismissed', '1'))
    await fakeSystemVoice(b)
    await b.goto(`/lesson/${LESSON}`)
    await answer(b, 1)
    await next(b)
    await count(b, 2)
  } finally {
    await ctxA.close()
    await ctxB.close()
  }
})
