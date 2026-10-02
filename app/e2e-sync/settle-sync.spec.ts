// TASK-18 D2：已登入的使用者重新開 App、沒進設定頁就直接上課，結算後也會同步（共用 session 單例＋onSettle）
// 跑法同 sync.spec（本機 Supabase＋Mailpit）；題目來源為樣本課 fixture（playwright.sync.config.ts 的 VITE_ITEM_FIXTURES）
import { expect, test } from '@playwright/test'
import { LESSON } from '../e2e/lesson.js'
import { playLesson } from '../e2e/today.js'
import { admin, login, open, snapshot, waitSynced } from './syncHelpers.js'

test('登入後重開 App 直接上一課 → 結算後同步上雲（不經過設定頁）', async ({ browser }, info) => {
  test.skip(!process.env.LINGUA_SYNC_SERVICE_KEY, '需設 LINGUA_SYNC_SERVICE_KEY')
  test.setTimeout(120_000)
  const email = `e2e-settle-${info.project.name}-${Date.now()}@test.local`
  const ctx = await browser.newContext()
  try {
    const page = await open(ctx)
    await page.addInitScript(() => localStorage.setItem('lg.installDismissed', '1'))
    await login(page, email, new Set())
    await waitSynced(page)

    // 整頁重新載入：JS 狀態歸零，設定頁的登入元件不會掛上
    await page.goto(`/lesson/${LESSON}`)
    await playLesson(page, LESSON)

    await page.waitForFunction(() => '__linguaTest' in window)
    await expect.poll(async () => (await snapshot(page)).outbox, { timeout: 15_000 }).toBe(0)

    const users = (await (await admin('/auth/v1/admin/users?per_page=1000')).json()) as {
      users: { id: string; email: string }[]
    }
    const userId = users.users.find((u) => u.email === email)!.id
    const rest = async (q: string) =>
      (await (await admin(`/rest/v1/${q}&user_id=eq.${userId}`)).json()) as Record<
        string,
        unknown
      >[]
    expect(await rest('course_progress?select=lesson_id')).toEqual([{ lesson_id: LESSON }])
    expect(await rest('word_pool?select=word_id')).toHaveLength(8)
    expect(await rest('review_logs?select=id')).toHaveLength(8)

    await admin(`/auth/v1/admin/users/${userId}`, { method: 'DELETE' })
  } finally {
    await ctx.close()
  }
})
