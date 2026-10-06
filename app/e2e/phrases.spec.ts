// TASK-24 W5 片語課：課程地圖的片語單元、走完一課片語樣本課（含配對）、點片語中的字看到片語的意思、收藏片語進單字庫；
// 視覺 smoke：片語卡、字典彈層的片語區、課程地圖片語單元（具名截圖存 test-results/，只留本機）。
// 片語課題目尚未寫完（W4），題目來源＝樣本課 fixture src/lesson/fixtures/items/a2-p01-l01.json；課綱取自真 content/curriculum/a2.json
import { writeFile } from 'node:fs/promises'
import { expect, test, type Page, type TestInfo } from '@playwright/test'
import { answerPick, next, stepsOf } from './lesson.js'
import { measureMobile, overflowingChildren } from './measure.js'
import { fakeSystemVoice, lastSpoken } from './speech.js'

const LESSON = 'a2-p01-l01'
const STEPS = stepsOf(LESSON)

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('lg.installDismissed', '1'))
  await fakeSystemVoice(page)
})

async function shot(page: Page, info: TestInfo, name: string, container = 'main') {
  await page.waitForTimeout(300)
  const png = await page.screenshot()
  await info.attach(name, { body: png, contentType: 'image/png' })
  await writeFile(info.outputPath(`${info.project.name}-${name}.png`), png)
  const m = await measureMobile(page)
  expect.soft(m.overflow, `${name}：橫向溢出`).toEqual([])
  expect.soft(m.wrapped, `${name}：單行控件折行`).toEqual([])
  expect.soft(m.small, `${name}：可點目標 <44px`).toEqual([])
  expect.soft(m.latin, `${name}：英文介面字串`).toEqual([])
  expect.soft(await overflowingChildren(page, container), `${name}：子元素溢出`).toEqual([])
}

const count = (page: Page, n: number) =>
  expect(page.getByText(`${n}／${STEPS.length}`, { exact: true })).toBeVisible()

test('課程地圖：A2 出現片語單元（標「片語」、在 a2-u06 之後）', async ({ page }, info) => {
  await page.goto('/course?level=A2')
  const unit = page.getByRole('button', { name: '常用片語（一） 片語 0／4 課' })
  await expect(unit).toBeVisible()
  const titles = await page.getByRole('heading', { level: 2 }).allTextContents()
  const at = titles.indexOf('常用片語（一）')
  expect(titles.slice(at - 1, at + 2)).toEqual(['情緒與個性（一）', '常用片語（一）', '外表與衣著'])
  await unit.click()
  const section = page.locator('section').filter({ has: unit })
  await expect(section.getByRole('button', { name: '第 4 課' })).toBeVisible()
  await unit.scrollIntoViewIfNeeded()
  await shot(page, info, 'phrase-course-unit')
})

test('走完一課片語樣本課：片語卡整串顯示與發音、配對（片語↔第一義）→ 完成、片語進單字庫', async ({
  page,
}, info) => {
  test.setTimeout(90_000)
  // 7 張片語卡、第 4 張後與最後各一題配對、選擇、閱讀
  expect(STEPS).toHaveLength(11)
  expect(STEPS[4].match).toEqual([
    ['clean up', '打掃乾淨'],
    ['come in', '進來'],
    ['come back', '回來'],
    ['find out', '查出'],
  ])
  await page.goto(`/lesson/${LESSON}`)
  await count(page, 1)
  await expect(page.locator('main [lang="en"]').first()).toHaveText('clean up')
  await page.getByRole('button', { name: '發音' }).click()
  await expect.poll(() => lastSpoken(page)).toMatchObject({ text: 'clean up' })
  // 作答前例句提示裡的片語（clean your room up 的 clean、up）不可點，插入的受詞可點
  await page.getByRole('button', { name: '看例句提示' }).click()
  const hint = page.getByTestId('wordcard-hint')
  await expect(hint.getByRole('button', { name: 'room', exact: true })).toBeVisible()
  await expect(hint.getByRole('button', { name: 'clean', exact: true })).toHaveCount(0)
  await expect(hint.getByRole('button', { name: 'up', exact: true })).toHaveCount(0)
  await shot(page, info, 'phrase-card')

  for (let n = 1; n <= STEPS.length; n++) {
    await count(page, n)
    if (STEPS[n - 1].match) await expect(page.getByText('配對', { exact: true })).toBeVisible()
    await answerPick(page, STEPS[n - 1], false)
    await next(page)
  }
  const done = page.getByTestId('lesson-done')
  await expect(done).toContainText('常用片語（一）・第 1 課')
  await expect(done).toContainText(`${STEPS.length} 題`)
  await expect(done).toContainText(`答對 ${STEPS.length} 題`)

  await page.goto('/words')
  const list = page.getByTestId('word-list')
  await expect(list.locator('[lang="en"]')).toHaveCount(7)
  // 片語整串當一個字、中文取單字卡第一義（ice cream 類多字詞被拆開的既有 bug 已修）
  await expect(list.getByRole('listitem').filter({ hasText: 'get on' })).toContainText('上')
  await expect(list.getByRole('listitem').filter({ hasText: 'find out' })).toContainText('查出')
})

test('點片語中的字：彈層先顯示片語的意思（含可分離），再顯示單字；收藏片語後出現在單字庫', async ({
  page,
}, info) => {
  await page.goto(`/course?lesson=${LESSON}`)
  const sheet = page.getByRole('dialog', { name: '小課詳情' })
  await expect(sheet.getByRole('heading')).toHaveText('常用片語（一）・第 1 課')
  await sheet.getByRole('button', { name: 'up', exact: true }).first().click()

  const dict = page.getByRole('dialog', { name: '單字查義' })
  const phrase = dict.getByTestId('dict-phrase')
  await expect(phrase.getByRole('heading', { name: 'clean up' })).toBeVisible()
  await expect(phrase).toContainText('片語')
  await expect(phrase).toContainText('A2')
  await expect(phrase).toContainText('打掃乾淨')
  // 片語在前、單字在後
  await expect(dict.getByRole('heading')).toHaveText(['clean up', 'up'])
  await phrase.getByRole('button', { name: '發音' }).click()
  await expect.poll(() => lastSpoken(page)).toMatchObject({ text: 'clean up' })
  await shot(page, info, 'phrase-dict-sheet', '[data-testid="dict-sheet"]')
  // 有片語區時資料來源註明片語自編（創辦人核可文案 2026-10-06）
  const source = dict.getByText('資料來源：ECDICT；片語：拾字自編（CC BY-SA 4.0）')
  await source.scrollIntoViewIfNeeded()
  await expect(source).toBeVisible()
  await shot(page, info, 'phrase-dict-source', '[data-testid="dict-sheet"]')

  await phrase.getByRole('button', { name: '加入收藏單字庫' }).click()
  await expect(phrase.getByRole('button', { name: '已在收藏單字庫（點一下取消）' })).toBeVisible()
  await page.keyboard.press('Escape')
  await expect(dict).toHaveCount(0)
  await page.keyboard.press('Escape')
  await expect(sheet).toHaveCount(0)

  await page.getByRole('link', { name: '單字庫' }).click()
  const row = page.getByTestId('word-list').getByRole('listitem').filter({ hasText: 'clean up' })
  await expect(row).toHaveCount(1)
  await expect(row).toContainText('打掃乾淨')
  await expect(row.getByLabel('已收藏')).toBeVisible()
  // 單字庫的片語也可點：點任一字看到片語
  await row.getByRole('button', { name: 'clean', exact: true }).click()
  await expect(dict.getByTestId('dict-phrase').getByRole('heading')).toHaveText('clean up')
})

test('點句子裡拆開的可分離片語（clean your room up）：點 up 看到 clean up', async ({ page }) => {
  await page.goto(`/lesson/${LESSON}`)
  await count(page, 1)
  // 作答後回饋的例句可點
  await answerPick(page, STEPS[0], false)
  await page.getByRole('status').getByRole('button', { name: 'up', exact: true }).click()
  const dict = page.getByRole('dialog', { name: '單字查義' })
  await expect(dict.getByTestId('dict-phrase').getByRole('heading')).toHaveText('clean up')
  await page.keyboard.press('Escape')
  // 插入的受詞不屬於片語
  await page.getByRole('status').getByRole('button', { name: 'room', exact: true }).click()
  await expect(dict.getByRole('heading', { name: 'room' })).toBeVisible()
  await expect(dict.getByTestId('dict-phrase')).toHaveCount(0)
  await expect(dict.getByText('資料來源：ECDICT', { exact: true })).toBeVisible()
})

test('授權與致謝：單字資料一節列出片語表（拾字自編、CC BY-SA 4.0）', async ({ page }, info) => {
  await page.goto('/about/licenses')
  const name = page.getByTestId('credit-name').filter({ hasText: '片語表' })
  await expect(name).toHaveCount(1)
  const card = name.locator('..')
  await expect(card).toContainText('授權：CC BY-SA 4.0')
  await expect(card).toContainText('拾字自編')
  await card.scrollIntoViewIfNeeded()
  // 版面量測（含出處英文的白名單）由 about-visual.spec 的授權頁全頁檢查負責；這裡只留截圖
  const png = await page.screenshot()
  await info.attach('phrase-licenses-row', { body: png, contentType: 'image/png' })
  await writeFile(info.outputPath(`${info.project.name}-phrase-licenses-row.png`), png)
})
