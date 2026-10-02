// TASK-12 AC#2：讀類三題型（單字卡、選擇題、閱讀理解）在兩個手機 project 走完一課；中途離開後可續
// TASK-13 起聽類題也在佇列裡（能播音時，跟讀換聽音打字：一課 16 步，順序見 e2e/lesson.ts stepsOf）；聽題本身的斷言在 listen.spec
import { expect, test } from '@playwright/test'
import { answer, count, LESSON, next, playTo, STEPS } from './lesson.js'
import { fakeSystemVoice } from './speech.js'

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('lg.installDismissed', '1'))
  // 聽類題要能播音才出（TASK-18 能力偵測）；Playwright WebKit（Windows）沒有 speechSynthesis，一律用替身
  await fakeSystemVoice(page)
})

test('課程地圖「開始這一課」→ 三種題型作答 → 完成頁 → 回到今天', async ({ page }) => {
  await page.goto(`/course?lesson=${LESSON}`)
  await page.getByRole('button', { name: '開始這一課' }).click()
  await expect(page).toHaveURL(new RegExp(`/lesson/${LESSON}$`))
  await expect(page.getByRole('progressbar', { name: '作答進度' })).toHaveAttribute(
    'aria-valuemax',
    String(STEPS.length),
  )

  // 單字卡：答對、答錯
  await expect(page.getByText('選出這個字的意思')).toBeVisible()
  await answer(page, 1)
  await expect(page.getByRole('status')).toContainText('正確：那個、這個（指特定的人事物）')
  await next(page)
  await answer(page, 2, true)
  await expect(page.getByRole('status')).toContainText('be 是「是；保持（某種狀態）」')
  await next(page)
  // 第 9 題起依 TASK-18 穿插：聽音打字、選擇題、聽音選答、選擇題、閱讀兩小題
  for (let n = 3; n <= 9; n++) {
    await answer(page, n)
    await next(page)
  }

  // 選擇題：選了才能檢查；答錯顯示正解與兩個選項的釋義
  await count(page, 10)
  await expect(page.getByText('選出最適合的字')).toBeVisible()
  await expect(page.getByRole('button', { name: '檢查' })).toBeDisabled()
  await answer(page, 10, true)
  await expect(page.getByRole('status')).toContainText('答案是 A：of')
  await expect(page.getByRole('status')).toContainText('of＝⋯的（一杯⋯）；in＝在⋯裡面。')
  await next(page)
  await answer(page, 11)
  await next(page)
  await answer(page, 12)
  await expect(page.getByRole('status')).toContainText('正確')
  await next(page)
  // 第 13 題：跟讀換成聽音打字（語音辨識未接上，TASK-18 能力替代）
  await answer(page, 13)
  await next(page)

  // 閱讀理解：中文翻譯、兩小題
  await count(page, 14)
  await expect(page.getByText('閱讀理解')).toBeVisible()
  await page.getByRole('button', { name: '看中文翻譯' }).click()
  await expect(page.getByTestId('reading-translation')).toContainText('Amy 十歲。')
  // 走查 P1：譯文在限高短文卡裡，按下後要整段捲入視野
  await expect(page.getByTestId('reading-translation')).toBeInViewport({ ratio: 1 })
  await answer(page, 14)
  await next(page)
  await answer(page, 15, true)
  await expect(page.getByRole('status')).toContainText('答案是 C：在家裡')
  await next(page)
  await answer(page, 16)
  await next(page)

  const done = page.getByTestId('lesson-done')
  await expect(done.getByRole('heading', { level: 1 })).toHaveText('這一課完成了')
  await expect(done).toContainText('基礎常用字（一） 1')
  await expect(done).toContainText('新學的 8 個字已加入單字庫，明天開始複習')
  await expect(done).toContainText('16 題')
  await expect(done).toContainText('答對 13 題')
  await expect(done).toContainText('答錯的 1 題已排進明天的複習')

  await done.getByRole('button', { name: '回到今天' }).click()
  await expect(page).toHaveURL(/\/$/)
  await expect(page.getByTestId('screen-home')).toBeAttached()

  // 結算後：課程地圖標示這一課已完成、單字庫有 8 個新字
  await page.goto(`/course?level=A1`)
  await expect(page.getByText('1／10 課')).toBeVisible()
  await expect(
    page.getByRole('button', { name: '第 1 課', exact: true }).locator('.text-correct svg'),
  ).toBeVisible()
  await page.goto('/words')
  await expect(page.getByTestId('word-list').locator('[lang="en"]')).toHaveCount(8)
})

test('中途離開（✕ → 離開）後重開，從離開的那題接續', async ({ page }) => {
  await page.goto(`/lesson/${LESSON}`)
  await playTo(page, 4)
  await page.getByRole('button', { name: '離開' }).click()
  const dialog = page.getByRole('alertdialog')
  await expect(dialog).toContainText('目前做到 3／16 題。離開後下次會從第 4 題繼續。')
  await expect(dialog.getByRole('button', { name: '繼續上課' })).toBeFocused()
  await dialog.getByRole('button', { name: '離開' }).click()
  await expect(page).not.toHaveURL(/\/lesson\//)

  await page.goto(`/lesson/${LESSON}`)
  await count(page, 4)
  await expect(page.locator('[lang="en"]').first()).toHaveText('of')
})

test('答完還沒按繼續就重新整理：接續在下一題', async ({ page }) => {
  await page.goto(`/lesson/${LESSON}`)
  await answer(page, 1)
  // 存檔在背景完成；等單字池寫入後再重整
  await expect
    .poll(() =>
      page.evaluate(
        () =>
          new Promise<number>((res) => {
            const r = indexedDB.open('linguaapp')
            r.onsuccess = () => {
              const c = r.result
                .transaction('lessonRuns')
                .objectStore('lessonRuns')
                .get('a1-u01-l01')
              c.onsuccess = () => res(Object.keys(c.result?.results ?? {}).length)
            }
          }),
      ),
    )
    .toBe(1)
  await page.reload()
  await count(page, 2)
})
