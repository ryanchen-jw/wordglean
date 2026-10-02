// 今日動線 e2e 共用（TASK-18）：以 page.clock 固定時間，第一天上完樣本課、第二天早上有 8 個字到期
import { expect, type Page } from '@playwright/test'
import { LESSON, readFixture, stepsOf } from './lesson.js'

export const DAY = 86_400_000
export const DAY1 = Date.parse('2026-10-05T01:00:00Z') // 台北 09:00
export const NEXT = 'a1-u01-l02'

/** 依 fixture 正解走完一課（穿插順序見 lesson.ts stepsOf；能播音才有聽類題）；停在完成頁 */
export async function playLesson(page: Page, lessonId: string) {
  const tts = await page.evaluate(() => 'speechSynthesis' in window)
  const steps = stepsOf(lessonId, { tts })
  for (const [i, s] of steps.entries()) {
    await expect(page.getByText(`${i + 1}／${steps.length}`, { exact: true })).toBeVisible()
    if (s.typed !== undefined)
      await page.getByRole('textbox', { name: '把聽到的英文打在這裡' }).fill(s.typed)
    else await page.getByRole('radio', { name: s.options[0], exact: true }).click()
    if (s.check) await page.getByRole('button', { name: '檢查' }).click()
    await page.getByRole('button', { name: '繼續' }).click()
  }
  await expect(page.getByTestId('lesson-done')).toBeVisible()
}

/** 第一天上完樣本課，時間跳到第二天早上 */
export async function learnThenNextDay(page: Page) {
  await page.clock.setFixedTime(DAY1)
  await page.goto(`/lesson/${LESSON}`)
  await playLesson(page, LESSON)
  await page.clock.setFixedTime(DAY1 + DAY)
}

// 樣本課 8 個字的正解；到期時間相同時依字母排序出題（today/plan.ts）
export const GLOSS = new Map(
  readFixture(LESSON)
    .items.filter((it) => it.type === 'wordCard')
    .map((it) => [it.word!, it.glossZh!]),
)
export const REVIEW_ORDER = [...GLOSS.keys()].sort()
