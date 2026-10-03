// TASK-22 AC#1：完整使用者旅程——新手分級測驗 → 首日學習 → 收藏 → 隔日複習（＋下一課）→ 登入同步 → 另一個裝置看到相同進度
// 跑法同 sync.spec（本機 Supabase＋Mailpit）；題目來源為樣本課 fixture（playwright.sync.config.ts 的 VITE_ITEM_FIXTURES）。
// 「隔日」以 page.clock 注入：第一天＝真實時間前 24 小時，第二天＝真實時間（登入取得的 token 以伺服器時間簽發，
// 用戶端時間不能超前，否則 supabase-js 會判定 token 已過期）。OpenRouter 一律攔下：沒有金鑰時寫作題自評，不應有任何請求
import { expect, test } from '@playwright/test'
import { LESSON } from '../e2e/lesson.js'
import { answerAll } from '../e2e/placementHelpers.js'
import { DAY, GLOSS, NEXT, playLesson, REVIEW_ORDER } from '../e2e/today.js'
import { admin, login, open, SERVICE_KEY, snapshot, waitSynced } from './syncHelpers.js'

test('完整旅程：分級測驗 → 首日一課 → 收藏 → 隔日複習＋下一課 → 登入同步 → 另一個裝置相同進度', async ({
  browser,
}, info) => {
  test.skip(!SERVICE_KEY, '需設 LINGUA_SYNC_SERVICE_KEY（本機 Supabase service_role key）')
  test.setTimeout(240_000)
  const DAY2 = Date.now()
  const DAY1 = DAY2 - DAY
  const email = `e2e-journey-${info.project.name}-${Date.now()}@test.local`
  const seen = new Set<string>()
  const llm: string[] = []
  const ctxA = await browser.newContext()
  const ctxB = await browser.newContext()
  for (const ctx of [ctxA, ctxB])
    await ctx.route(/openrouter\.ai/, (route) => {
      llm.push(route.request().url())
      return route.abort()
    })
  const shot = async (name: string) =>
    info.attach(name, { body: await page.screenshot(), contentType: 'image/png' })

  const page = await ctxA.newPage()
  try {
    await page.addInitScript(() => localStorage.setItem('lg.installDismissed', '1'))

    // ── 第一天：第一次開 App → 分級測驗（一個字都不認識 → 起點 A1）
    await page.clock.setFixedTime(DAY1)
    await page.goto('/')
    const home = page.getByTestId('screen-home')
    await expect(home).toHaveAttribute('data-state', 'first')
    await page.getByRole('button', { name: '開始分級測驗' }).click()
    expect(await answerAll(page, () => false)).toBe(60)
    await expect(page.getByTestId('placement-level')).toHaveText('A1')
    await shot('1-分級結果')
    await page.getByRole('button', { name: '從 A1 開始' }).click()

    // 首日學習：沒有到期的字 → 直接上第一課
    await expect(home).toHaveAttribute('data-state', 'default')
    await page.getByRole('button', { name: '開始今天的學習' }).click()
    await expect(page).toHaveURL(new RegExp(`/lesson/${LESSON}$`))
    await playLesson(page, LESSON)
    await shot('2-首日完成')
    await page.getByTestId('lesson-done').getByRole('button', { name: '回到今天' }).click()
    await expect(home).toHaveAttribute('data-state', 'done')

    // 收藏：課程詳情點字 → 字典彈層 → 加入收藏 → 單字庫有星號
    await page.goto('/course')
    await page
      .getByRole('button', { name: /第 1 課/ })
      .first()
      .click()
    await page
      .getByRole('dialog', { name: '小課詳情' })
      .getByRole('button', { name: 'have', exact: true })
      .click()
    const dict = page.getByRole('dialog', { name: '單字查義' })
    await dict.getByRole('button', { name: '加入收藏單字庫' }).click()
    await expect(dict.getByRole('button', { name: '已在收藏單字庫（點一下取消）' })).toBeVisible()
    await shot('3-收藏')
    await page.keyboard.press('Escape')
    await page.keyboard.press('Escape')
    await page.getByRole('link', { name: '單字庫' }).click()
    const words = page.getByTestId('word-list')
    await expect(words.locator('[lang="en"]')).toHaveCount(8)
    await expect(
      words.getByRole('listitem').filter({ hasText: 'have' }).getByLabel('已收藏'),
    ).toBeVisible()

    // ── 第二天：先複習到期的 8 個字，再接第 2 課
    await page.clock.setFixedTime(DAY2)
    await page.goto('/')
    await expect(page.getByRole('link', { name: /到期複習/ })).toContainText('8')
    await page.getByRole('button', { name: '開始今天的學習' }).click()
    await expect(page).toHaveURL(/\/review\?flow=today$/)
    for (const [i, word] of REVIEW_ORDER.entries()) {
      await expect(page.getByText(`複習 ${i + 1}／8`, { exact: true })).toBeVisible()
      await expect(page.getByTestId('review-screen').locator('[lang="en"]').first()).toHaveText(
        word,
      )
      await page.getByRole('radio', { name: GLOSS.get(word)!, exact: true }).click()
      await page.getByRole('button', { name: '繼續' }).click()
    }
    await expect(page).toHaveURL(new RegExp(`/lesson/${NEXT}$`))
    await playLesson(page, NEXT)
    await page.getByTestId('lesson-done').getByRole('button', { name: '回到今天' }).click()
    await expect(home).toHaveAttribute('data-state', 'done')
    await expect(page.getByText('複習 8／8')).toBeVisible()
    await shot('4-隔日完成')

    // ── 設定 → 隱私說明・授權・原始碼（TASK-21）：登入前看得到隱私說明與授權頁
    await page.goto('/settings')
    await page.getByRole('button', { name: /隱私說明・授權・原始碼/ }).click()
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('隱私說明・授權・原始碼')
    await page.getByRole('button', { name: '隱私說明', exact: true }).click()
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('隱私說明')
    await page.goBack()
    await page.getByRole('button', { name: '授權與致謝', exact: true }).click()
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('授權與致謝')

    // ── 登入：訪客進度上雲
    await page.goto('/settings')
    await page.waitForFunction(() => '__linguaTest' in window)
    await login(page, email, seen)
    await waitSynced(page)
    const local = await snapshot(page)
    expect(local.words).toHaveLength(16)
    // 首日第 1 課 8 字＋隔日複習 8 字＋第 2 課 8 字
    expect(local.reviewLogIds).toHaveLength(24)
    await shot('5-已登入')

    const users = (await (await admin('/auth/v1/admin/users?per_page=1000')).json()) as {
      users: { id: string; email: string }[]
    }
    const userId = users.users.find((u) => u.email === email)!.id
    const rest = async (q: string) =>
      (await (await admin(`/rest/v1/${q}&user_id=eq.${userId}`)).json()) as Record<
        string,
        unknown
      >[]
    try {
      expect(
        (await rest('course_progress?select=lesson_id&order=lesson_id')).map((r) => r.lesson_id),
      ).toEqual([LESSON, NEXT])
      expect(await rest('word_pool?select=word_id')).toHaveLength(16)
      expect((await rest('review_logs?select=id')).map((r) => r.id).sort()).toEqual(
        local.reviewLogIds,
      )
      expect(await rest('favorites?select=word_id,deleted_at')).toEqual([
        { word_id: 'have', deleted_at: null },
      ])
      expect(await rest('settings?select=cefr_level')).toEqual([{ cefr_level: 'A1' }])

      // ── 另一個裝置：全新瀏覽器狀態，登入後拉回相同進度
      const b = await open(ctxB)
      await b.addInitScript(() => localStorage.setItem('lg.installDismissed', '1'))
      await login(b, email, seen)
      await waitSynced(b)
      expect((await snapshot(b)).words).toEqual(local.words)
      await b.goto('/words')
      const wordsB = b.getByTestId('word-list')
      await expect(wordsB.locator('[lang="en"]')).toHaveCount(16)
      await expect(
        wordsB.getByRole('listitem').filter({ hasText: 'have' }).getByLabel('已收藏'),
      ).toBeVisible()
      await info.attach('6-另一個裝置', { body: await b.screenshot(), contentType: 'image/png' })
      expect(llm).toEqual([])
    } finally {
      await admin(`/auth/v1/admin/users/${userId}`, { method: 'DELETE' })
    }
  } finally {
    await ctxA.close()
    await ctxB.close()
  }
})
