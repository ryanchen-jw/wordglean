// e2e-sync 共用（TASK-20 sync.spec 抽出，TASK-18 settle-sync.spec 共用）：本機 Supabase admin、Mailpit 收碼、登入、同步完成判定
import { expect, type BrowserContext, type Page } from '@playwright/test'

const SUPABASE_URL = process.env.LINGUA_SYNC_SUPABASE_URL ?? 'http://127.0.0.1:55421'
export const SERVICE_KEY = process.env.LINGUA_SYNC_SERVICE_KEY ?? ''
const MAILPIT_URL = process.env.LINGUA_SYNC_MAILPIT_URL ?? 'http://127.0.0.1:55424'

// src/testHooks.ts 的對外形狀（e2e 的 tsconfig 為 nodenext，不直接 import app 模組）
export interface Snapshot {
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

export const admin = (path: string, init: RequestInit = {}) =>
  fetch(`${SUPABASE_URL}${path}`, {
    ...init,
    headers: { apikey: SERVICE_KEY, authorization: `Bearer ${SERVICE_KEY}`, ...init.headers },
  })

export async function open(context: BrowserContext) {
  const page = await context.newPage()
  await page.goto('/settings')
  // 登入入口在設定頁「帳號與同步」（TASK-11 接線）
  await expect(page.getByTestId('settings-account-slot')).toBeAttached()
  await page.waitForFunction(() => '__linguaTest' in window)
  return page
}

export const snapshot = (page: Page): Promise<Snapshot> =>
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

export async function login(page: Page, email: string, seen: Set<string>) {
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
export async function waitSynced(page: Page) {
  await expect
    .poll(async () => {
      const s = await snapshot(page)
      return s.userId !== null && s.outbox === 0
    })
    .toBe(true)
}
