// TASK-22 隔離驗收 AC3：作答後的選項（對、錯、淡化）在淺色／深色都要過 axe——critical／serious 違規＝0。
// 淡化選項仍含可點查義的英文字，文字對比要 ≥4.5:1（WCAG 1.4.3）。狀態：小課第 1 題（看字選意）、選擇題、複習作答後
import { resolve } from 'node:path'
import { expect, test, type Page } from '@playwright/test'
import { answer, LESSON, playTo, readFixture, STEPS } from './lesson.js'
import { fakeSystemVoice } from './speech.js'
import { GLOSS, learnThenNextDay, REVIEW_ORDER } from './today.js'

const AXE = resolve(import.meta.dirname, '../node_modules/axe-core/axe.min.js')

async function axeSerious(page: Page) {
  // 量穩定後的畫面：回饋條有淡入動畫（lg-rise-in），動畫中途半透明會被量成低對比
  await page.evaluate(() => Promise.all(document.getAnimations().map((a) => a.finished)))
  await page.addScriptTag({ path: AXE })
  return page.evaluate(async () => {
    const { violations } = await (
      window as unknown as {
        axe: {
          run(
            ctx: Document,
            opts: object,
          ): Promise<{
            violations: { id: string; impact: string; nodes: { target: string[] }[] }[]
          }>
        }
      }
    ).axe.run(document, {
      runOnly: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'],
    })
    return violations
      .filter((v) => v.impact === 'critical' || v.impact === 'serious')
      .map((v) => `${v.id}（${v.impact}）：${v.nodes.map((n) => n.target.join(' ')).join('、')}`)
  })
}

// 選擇題在本課的題號（從 1 起）：選項＝正解在前的那一步
const mcq = readFixture(LESSON).items.find((it) => it.type === 'mcq')!
const MCQ_STEP = STEPS.findIndex((s) => s.check && s.options[0] === mcq.options![mcq.answer!]) + 1

for (const theme of ['light', 'dark'] as const) {
  test.describe(`作答後 axe（${theme}）`, () => {
    test.beforeEach(async ({ page }) => {
      await page.addInitScript((th) => {
        localStorage.setItem('lg.installDismissed', '1')
        localStorage.setItem('lg.theme', th)
      }, theme)
      await fakeSystemVoice(page)
    })

    test('小課第 1 題（看字選意）答錯後', async ({ page }) => {
      await page.goto(`/lesson/${LESSON}`)
      await answer(page, 1, true)
      await expect(page.locator('[data-choice="dim"]').first()).toBeVisible()
      expect(await axeSerious(page)).toEqual([])
    })

    test('選擇題答錯後', async ({ page }) => {
      test.setTimeout(60_000)
      expect(MCQ_STEP).toBeGreaterThan(1)
      await page.goto(`/lesson/${LESSON}`)
      await playTo(page, MCQ_STEP)
      await answer(page, MCQ_STEP, true)
      await expect(page.locator('[data-choice="dim"]').first()).toBeVisible()
      expect(await axeSerious(page)).toEqual([])
    })

    test('複習答錯後', async ({ page }) => {
      test.setTimeout(90_000)
      await learnThenNextDay(page)
      await page.goto('/review')
      const right = GLOSS.get(REVIEW_ORDER[0])!
      await page.getByRole('radio').filter({ hasNotText: right }).first().click()
      await expect(page.locator('[data-choice="dim"]').first()).toBeVisible()
      expect(await axeSerious(page)).toEqual([])
    })
  })
}
