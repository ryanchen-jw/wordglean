// 配對題（創辦人 2026-10-05 裁示一）：小課第 4 張單字卡後出現配對、配錯進錯題重做、做完；複習每 4 張到期字卡後出配對；
// 視覺 smoke：初始、配對中、配錯、完成四態截圖（具名檔存 test-results/），並在 320 標準／320 特大／375 特大量測
import { writeFile } from 'node:fs/promises'
import { expect, test, type Page, type TestInfo } from '@playwright/test'
import { answer, answerRetry, LESSON, next, STEPS } from './lesson.js'
import { measureMobile, overflowingChildren } from './measure.js'
import { fakeSystemVoice, lastSpoken } from './speech.js'
import { GLOSS, learnThenNextDay, REVIEW_ORDER, REVIEW_TOTAL } from './today.js'

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('lg.installDismissed', '1'))
  await fakeSystemVoice(page)
})

const MATCH = 5
const pairs = STEPS[MATCH - 1].match!
const tile = (page: Page, name: string) => page.getByRole('button', { name, exact: true })

async function check(page: Page, info: TestInfo, name: string) {
  await page.waitForTimeout(300)
  const png = await page.screenshot()
  await info.attach(name, { body: png, contentType: 'image/png' })
  await writeFile(info.outputPath(`${info.project.name}-${name}.png`), png)
  const m = await measureMobile(page)
  expect.soft(m.overflow, `${name}：橫向溢出`).toEqual([])
  expect.soft(m.wrapped, `${name}：單行控件折行`).toEqual([])
  expect.soft(m.small, `${name}：可點目標 <44px`).toEqual([])
  expect.soft(m.latin, `${name}：英文介面字串`).toEqual([])
  expect.soft(await overflowingChildren(page, 'main'), `${name}：main 子元素溢出`).toEqual([])
}

async function toMatching(page: Page) {
  await page.goto(`/lesson/${LESSON}`)
  for (let n = 1; n < MATCH; n++) {
    await answer(page, n)
    await next(page)
  }
  await expect(page.getByText(`${MATCH}／${STEPS.length}`, { exact: true })).toBeVisible()
}

test('小課：第 4 張單字卡後出現配對 → 配錯 → 主輪做完進錯題重做、整題重配 → 完成', async ({
  page,
}) => {
  test.setTimeout(90_000)
  expect(pairs.map(([en]) => en)).toEqual(['the', 'be', 'and', 'of'])
  await toMatching(page)
  await expect(page.getByText('配對', { exact: true })).toBeVisible()
  // 點英文發音（走 speak.ts → 預產音檔，TASK-35）
  await tile(page, 'be').click()
  await expect.poll(() => lastSpoken(page)).toMatchObject({ engine: 'clip', text: 'be' })
  await answer(page, MATCH, true)
  await next(page)
  for (let n = MATCH + 1; n <= STEPS.length; n++) {
    await answer(page, n)
    await next(page)
  }
  await answerRetry(page, MATCH, { n: 1, total: 1 })
  await next(page)
  const done = page.getByTestId('lesson-done')
  await expect(done).toContainText(`${STEPS.length} 題`)
  await expect(done).toContainText(`答對 ${STEPS.length - 1} 題`)
  // 配對不寫 FSRS：作答紀錄只有 8 張單字卡
  const logs = await page.evaluate(
    () =>
      new Promise<number>((res) => {
        const r = indexedDB.open('linguaapp')
        r.onsuccess = () => {
          const c = r.result.transaction('reviewLogs').objectStore('reviewLogs').count()
          c.onsuccess = () => res(c.result)
        }
      }),
  )
  expect(logs).toBe(8)
})

test('複習：做完 4 張到期字卡後出現配對（那 4 個字）', async ({ page }) => {
  test.setTimeout(90_000)
  await learnThenNextDay(page)
  await page.goto('/review')
  for (const [i, w] of REVIEW_ORDER.slice(0, 4).entries()) {
    await expect(page.getByText(`複習 ${i + 1}／${REVIEW_TOTAL}`, { exact: true })).toBeVisible()
    await page.getByRole('radio', { name: GLOSS.get(w)!, exact: true }).click()
    await page.getByRole('button', { name: '繼續' }).click()
  }
  await expect(page.getByText(`複習 5／${REVIEW_TOTAL}`, { exact: true })).toBeVisible()
  await expect(page.getByText('把英文和中文配成一對')).toBeVisible()
  for (const w of REVIEW_ORDER.slice(0, 4)) await expect(tile(page, w)).toBeEnabled()
})

test('視覺 smoke：配對初始／配對中／配錯／完成', async ({ page }, info) => {
  test.setTimeout(60_000)
  await toMatching(page)
  await check(page, info, 'matching-initial')
  await tile(page, pairs[0][0]).click()
  await tile(page, pairs[0][1]).click()
  await tile(page, pairs[1][0]).click()
  await expect(tile(page, pairs[0][0])).toHaveAttribute('data-match', 'locked')
  await expect(tile(page, pairs[1][0])).toHaveAttribute('data-match', 'selected')
  await check(page, info, 'matching-progress')
  await tile(page, pairs[2][1]).click()
  await expect(tile(page, pairs[1][0])).toHaveAttribute('data-match', 'wrong')
  await expect(tile(page, pairs[2][1])).toHaveAttribute('data-match', 'wrong')
  // 標紅用 error token
  const colors = await tile(page, pairs[1][0]).evaluate((el) => {
    const cs = getComputedStyle(el)
    const root = getComputedStyle(document.documentElement)
    const probe = document.createElement('i')
    probe.style.color = root.getPropertyValue('--lg-error').trim()
    document.body.append(probe)
    const error = getComputedStyle(probe).color
    probe.remove()
    return { border: cs.borderTopColor, error }
  })
  expect(colors.border).toBe(colors.error)
  await page.screenshot().then(async (png) => {
    await info.attach('matching-wrong', { body: png, contentType: 'image/png' })
    await writeFile(info.outputPath(`${info.project.name}-matching-wrong.png`), png)
  })
  await expect(tile(page, pairs[1][0])).toHaveAttribute('data-match', 'idle')
  for (const [en, zh] of pairs.slice(1)) {
    await tile(page, en).click()
    await tile(page, zh).click()
  }
  await expect(page.getByRole('button', { name: '繼續' })).toBeVisible()
  await check(page, info, 'matching-done')
})

const NARROW = [
  { name: '320', width: 320, height: 568, textSize: null },
  { name: '320-xl', width: 320, height: 568, textSize: 'xl' },
  { name: '375-xl', width: 375, height: 812, textSize: 'xl' },
] as const

for (const c of NARROW) {
  test(`窄螢幕／特大字級 ${c.name}：配對題不破版`, async ({ page }, info) => {
    test.setTimeout(60_000)
    await page.setViewportSize({ width: c.width, height: c.height })
    await page.addInitScript((size) => {
      if (size) localStorage.setItem('lg.textSize', size)
    }, c.textSize)
    await toMatching(page)
    await check(page, info, `${c.name}-matching-initial`)
    for (const [en, zh] of pairs) {
      await tile(page, en).click()
      await tile(page, zh).click()
    }
    await expect(page.getByRole('button', { name: '繼續' })).toBeInViewport()
    await check(page, info, `${c.name}-matching-done`)
  })
}
