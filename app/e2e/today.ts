// 今日動線 e2e 共用（TASK-18）：以 page.clock 固定時間，第一天上完樣本課、第二天早上有 8 個字到期
import { expect, type Page } from '@playwright/test'
import { answerMatching, LESSON, readFixture, stepsOf } from './lesson.js'

export const DAY = 86_400_000
export const DAY1 = Date.parse('2026-10-05T01:00:00Z') // 台北 09:00
export const NEXT = 'a1-u01-l02'

/** 依 fixture 正解走完一課（穿插順序見 lesson.ts stepsOf；能播音才有聽類題）；停在完成頁 */
export async function playLesson(page: Page, lessonId: string) {
  const tts = await page.evaluate(() => 'speechSynthesis' in window)
  const steps = stepsOf(lessonId, { tts })
  for (const [i, s] of steps.entries()) {
    await expect(page.getByText(`${i + 1}／${steps.length}`, { exact: true })).toBeVisible()
    // 寫作題（TASK-15）：沒有金鑰→寫參考答案、自評「我寫對了」，按下即進下一題
    if (s.write !== undefined) {
      await page.getByRole('textbox', { name: '你的句子' }).fill(s.write)
      await page.getByRole('button', { name: '送出批改' }).click()
      await page.getByRole('button', { name: '我寫對了' }).click()
      continue
    }
    // 配對（創辦人 2026-10-05 裁示一）：四對配完出現「繼續」
    if (s.match !== undefined) await answerMatching(page, s.match)
    else if (s.typed !== undefined)
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

// 樣本課 8 個字的正解選項（只顯示第一義＝全形分號前一段、去括號註記）；到期時間相同時依字母排序出題（today/plan.ts）
export const GLOSS = new Map(
  readFixture(LESSON)
    .items.filter((it) => it.type === 'wordCard')
    .map((it) => [it.word!, it.glossZh!.split('；')[0].replace(/（[^）]*）/g, '')]),
)
export const REVIEW_ORDER = [...GLOSS.keys()].sort()

/** 到期複習的題數：8 張字卡＋每 4 張後一題配對（創辦人 2026-10-05 裁示一） */
export const REVIEW_TOTAL = 10

/** 到期複習第 i 張字卡（從 0 起）在頁首的題號 */
export const reviewPos = (i: number) => i + 1 + Math.floor(i / 4)

/** 到期複習：剛做完第 i 張字卡（已按「繼續」）；滿 4 張就把配對做完並按「繼續」 */
export async function reviewMatching(page: Page, i: number) {
  if ((i + 1) % 4 !== 0) return
  await expect(
    page.getByText(`複習 ${reviewPos(i) + 1}／${REVIEW_TOTAL}`, { exact: true }),
  ).toBeVisible()
  await answerMatching(
    page,
    REVIEW_ORDER.slice(i - 3, i + 1).map((w) => [w, GLOSS.get(w)!]),
  )
  await page.getByRole('button', { name: '繼續' }).click()
}
