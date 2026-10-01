// TASK-20 AC#2：訪客學習 → Email 驗證碼登入（本機 Supabase、Mailpit 收信）→ 資料上雲 → 另一個 browser context 登入看到相同進度
// 學習畫面尚未存在（TASK-11 之後），「學習」以建置期開啟的測試掛鉤呼叫真實資料層函式（src/testHooks.ts）
import { expect, test, type BrowserContext, type Page, type TestInfo } from '@playwright/test'

const SUPABASE_URL = process.env.LINGUA_SYNC_SUPABASE_URL ?? 'http://127.0.0.1:55421'
const SERVICE_KEY = process.env.LINGUA_SYNC_SERVICE_KEY ?? ''
const MAILPIT_URL = process.env.LINGUA_SYNC_MAILPIT_URL ?? 'http://127.0.0.1:55424'

// src/testHooks.ts 的對外形狀（e2e 的 tsconfig 為 nodenext，不直接 import app 模組）
interface Snapshot {
  words: { wordId: string; reps: number }[]
  reviewLogIds: string[]
  settings: { dailyNewLimit: number } | null
  outbox: number
  userId: string | null
}

declare global {
  interface Window {
    __linguaTest: {
      addFromCourse(word: string, lessonId: string): Promise<void>
      addFavorite(word: string): Promise<void>
      recordReview(word: string, grade: 1 | 2 | 3 | 4): Promise<void>
      saveSettings(patch: { dailyNewLimit: number }): Promise<void>
      snapshot(): Promise<Snapshot>
    }
  }
}

const admin = (path: string, init: RequestInit = {}) =>
  fetch(`${SUPABASE_URL}${path}`, {
    ...init,
    headers: { apikey: SERVICE_KEY, authorization: `Bearer ${SERVICE_KEY}`, ...init.headers },
  })

async function shot(page: Page, info: TestInfo, name: string) {
  await info.attach(name, { body: await page.screenshot(), contentType: 'image/png' })
}

async function open(context: BrowserContext) {
  const page = await context.newPage()
  await page.goto('/settings')
  // 登入入口在設定頁「帳號與同步」（TASK-11 接線）
  await expect(page.getByTestId('settings-account-slot')).toBeAttached()
  await page.waitForFunction(() => '__linguaTest' in window)
  return page
}

const snapshot = (page: Page): Promise<Snapshot> =>
  page.evaluate(() => window.__linguaTest.snapshot())

// Mailpit：取寄給 email、且 ID 不在 seen 之內的最新一封信中的 6 碼
async function readCode(email: string, seen: Set<string>): Promise<string> {
  let code = ''
  await expect
    .poll(
      async () => {
        const res = await fetch(
          `${MAILPIT_URL}/api/v1/search?query=${encodeURIComponent(`to:"${email}"`)}`,
        )
        const { messages } = (await res.json()) as { messages: { ID: string }[] }
        const fresh = messages.find((m) => !seen.has(m.ID))
        if (!fresh) return ''
        const msg = (await (await fetch(`${MAILPIT_URL}/api/v1/message/${fresh.ID}`)).json()) as {
          HTML: string
        }
        seen.add(fresh.ID)
        code = /data-otp>(\d{6})</.exec(msg.HTML)?.[1] ?? ''
        return code
      },
      { timeout: 15_000, message: `Mailpit 收不到寄給 ${email} 的驗證碼` },
    )
    .toMatch(/^\d{6}$/)
  return code
}

// 同一信箱兩次寄碼至少間隔 [auth.email] max_frequency（本機 1s）；
// 實測：間隔不足時 Supabase 回 429 over_email_send_rate_limit，第二台裝置登入會偶發失敗
const SEND_GAP_MS = 1_500
const lastSent = new Map<string, number>()

async function login(page: Page, email: string, seen: Set<string>) {
  await page.getByTestId('login-entry').click()
  await page.getByTestId('login-email').fill(email)
  const wait = (lastSent.get(email) ?? 0) + SEND_GAP_MS - Date.now()
  if (wait > 0) await page.waitForTimeout(wait)
  await page.getByTestId('login-send').click()
  lastSent.set(email, Date.now())
  await expect(page.getByTestId('login-code')).toBeVisible()
  await page.getByTestId('login-code').fill(await readCode(email, seen))
  await page.getByTestId('login-verify').click()
  await expect(page.getByTestId('account-email')).toHaveText(email)
}

// 同步完成：本機已綁定帳號且佇列清空
async function waitSynced(page: Page) {
  await expect
    .poll(async () => {
      const s = await snapshot(page)
      return s.userId !== null && s.outbox === 0
    })
    .toBe(true)
}

test('訪客學習 → 驗證碼登入 → 上雲 → 另一個裝置登入看到相同進度', async ({ browser }, info) => {
  test.skip(!SERVICE_KEY, '需設 LINGUA_SYNC_SERVICE_KEY（本機 Supabase service_role key）')
  const email = `e2e-${info.project.name}-${Date.now()}@test.local`
  const seen = new Set<string>()
  const ctxA = await browser.newContext()
  const ctxB = await browser.newContext()

  try {
    // 裝置 A：未登入學習
    const a = await open(ctxA)
    await a.evaluate(async () => {
      const t = window.__linguaTest
      await t.addFromCourse('apple', 'a1-u1-l1')
      await t.recordReview('apple', 3)
      await t.recordReview('apple', 3)
      await t.addFromCourse('river', 'a1-u1-l1')
      await t.addFavorite('stone')
      await t.saveSettings({ dailyNewLimit: 7 })
    })
    const guest = await snapshot(a)
    expect(guest.userId).toBeNull()
    expect(guest.words.map((w) => w.wordId)).toEqual(['apple', 'river', 'stone'])
    expect(guest.reviewLogIds).toHaveLength(2)

    // A 登入 → 本機資料上雲
    await login(a, email, seen)
    await waitSynced(a)
    await shot(a, info, '5-已登入')

    const users = (await (await admin('/auth/v1/admin/users?per_page=1000')).json()) as {
      users: { id: string; email: string }[]
    }
    const userId = users.users.find((u) => u.email === email)!.id
    const rest = async (q: string) =>
      (await (await admin(`/rest/v1/${q}&user_id=eq.${userId}`)).json()) as Record<
        string,
        unknown
      >[]
    expect((await rest('review_logs?select=id')).map((r) => r.id).sort()).toEqual(
      guest.reviewLogIds,
    )
    expect((await rest('word_pool?select=word_id&order=word_id')).map((r) => r.word_id)).toEqual([
      'apple',
      'river',
      'stone',
    ])
    expect((await rest('favorites?select=word_id,deleted_at')).map((r) => r.word_id)).toEqual([
      'stone',
    ])
    expect(await rest('settings?select=daily_new_limit')).toEqual([{ daily_new_limit: 7 }])

    // 裝置 B：全新瀏覽器狀態，登入後拉回相同進度
    const b = await open(ctxB)
    expect((await snapshot(b)).words).toEqual([])
    await login(b, email, seen)
    await waitSynced(b)
    const fromCloud = await snapshot(b)
    const onA = await snapshot(a)
    expect(fromCloud.words).toEqual(onA.words)
    expect(fromCloud.reviewLogIds).toEqual(onA.reviewLogIds)
    expect(fromCloud.settings).toMatchObject({ dailyNewLimit: 7 })

    // B 再作答一次 → A 恢復連線時（同步時機之一）拉到
    await b.evaluate(() => window.__linguaTest.recordReview('apple', 3))
    await b.evaluate(() => window.dispatchEvent(new Event('online')))
    await waitSynced(b)
    await a.evaluate(() => window.dispatchEvent(new Event('online')))
    await expect
      .poll(async () => (await snapshot(a)).words.find((w) => w.wordId === 'apple')?.reps)
      .toBe(3)
    expect((await snapshot(a)).words).toEqual((await snapshot(b)).words)

    // A 登出：推完後清空本機，回到未登入
    await a.getByTestId('logout').click()
    await expect(a.getByTestId('login-entry')).toBeVisible()
    const after = await snapshot(a)
    expect(after.words).toEqual([])
    expect(after.userId).toBeNull()
    await shot(a, info, '6-登出後')

    await admin(`/auth/v1/admin/users/${userId}`, { method: 'DELETE' })
  } finally {
    await ctxA.close()
    await ctxB.close()
  }
})
