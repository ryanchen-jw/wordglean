// 示範課 /lesson/demo（創辦人 2026-10-05 裁示二）：一課走過所有題型（題目取自 a1-u01-l03），練習模式不寫任何本機資料；
// ?type= 直接從該題型開始。e2e 主套件建置語音辨識固定不可用（VITE_E2E_STT=off），跟讀題顯示不能錄音的狀態、按跳過
import { writeFile } from 'node:fs/promises'
import { expect, test, type Page, type TestInfo } from '@playwright/test'
import { answerMatching, readFixture } from './lesson.js'
import { measureMobile, overflowingChildren } from './measure.js'
import { fakeSystemVoice } from './speech.js'

const items = readFixture('a1-u01-l03').items
const first = (type: string) => items.find((i) => i.type === type)!
const sense = (g: string) => g.split('；')[0].replace(/（[^）]*）/g, '')
const cards = items.filter((i) => i.type === 'wordCard').slice(0, 4)
const TOTAL = 13

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('lg.installDismissed', '1'))
  await fakeSystemVoice(page)
  // 不呼叫外部服務：模型與 CDN 一律攔下（跟讀不按下載就不會發出，攔下只是保險）
  await page.route(/huggingface\.co|jsdelivr\.net|openrouter\.ai|supabase/, (r) => r.abort())
})

/** 本機資料庫全部資料表的內容（示範課做完要完全不變） */
const snapshot = (page: Page) =>
  page.evaluate(
    () =>
      new Promise<Record<string, unknown[]>>((res, rej) => {
        const r = indexedDB.open('linguaapp')
        r.onerror = () => rej(r.error)
        r.onsuccess = () => {
          const db = r.result
          const names = [...db.objectStoreNames]
          const out: Record<string, unknown[]> = {}
          const tx = db.transaction(names)
          for (const n of names) {
            const q = tx.objectStore(n).getAll()
            q.onsuccess = () => (out[n] = q.result)
          }
          tx.oncomplete = () => res(out)
        }
      }),
  )

const header = (page: Page, n: number, total = TOTAL) =>
  expect(page.locator('header').getByText(`${n}／${total}`, { exact: true })).toBeVisible()
const cont = (page: Page) => page.getByRole('button', { name: '繼續' }).click()
const radio = (page: Page, name: string) => page.getByRole('radio', { name, exact: true }).click()

async function skipShadowing(page: Page) {
  await expect(page.getByText('聽一次，再唸出這句')).toBeVisible()
  await page.getByRole('button', { name: /跳過/ }).click()
}

async function write(page: Page, text: string) {
  await expect(page.getByText('中翻英')).toBeVisible()
  await page.getByRole('textbox', { name: '你的句子' }).fill(text)
  await page.getByRole('button', { name: '送出批改' }).click()
  await page.getByRole('button', { name: '我寫對了' }).click()
}

async function shot(page: Page, info: TestInfo, name: string, container = 'main') {
  await page.waitForTimeout(300)
  const png = await page.screenshot()
  await info.attach(name, { body: png, contentType: 'image/png' })
  await writeFile(info.outputPath(`${info.project.name}-${name}.png`), png)
  const m = await measureMobile(page)
  expect.soft(m.overflow, `${name}：橫向溢出`).toEqual([])
  expect.soft(m.small, `${name}：可點目標 <44px`).toEqual([])
  expect.soft(await overflowingChildren(page, container), `${name}：子元素溢出`).toEqual([])
}

test('/lesson/demo 依序走完所有題型（單字卡、配對、選擇、閱讀、聽打、聽選、跟讀、翻譯兩題）；資料庫沒有變化', async ({
  page,
}, info) => {
  test.setTimeout(90_000)
  await page.goto('/lesson/demo')
  await header(page, 1)
  const before = await snapshot(page)

  for (const [i, c] of cards.entries()) {
    await header(page, i + 1)
    await radio(page, sense(c.glossZh!))
    await cont(page)
  }
  await header(page, 5)
  await answerMatching(
    page,
    cards.map((c) => [c.word!, sense(c.glossZh!)]),
  )
  await shot(page, info, 'demo-matching-done')
  await cont(page)

  const mcq = first('mcq')
  await header(page, 6)
  await expect(page.getByText('選出最適合的字')).toBeVisible()
  await radio(page, mcq.options![mcq.answer!])
  await page.getByRole('button', { name: '檢查' }).click()
  await cont(page)
  for (const [k, q] of first('reading').questions!.entries()) {
    await header(page, 7 + k)
    await expect(page.getByText('閱讀理解')).toBeVisible()
    await radio(page, q.options[q.answer])
    await page.getByRole('button', { name: '檢查' }).click()
    await cont(page)
  }
  await header(page, 9)
  await expect(page.getByText('聽句子，把聽到的英文打出來')).toBeVisible()
  await page
    .getByRole('textbox', { name: '把聽到的英文打在這裡' })
    .fill(first('listenType').sentenceEn!)
  await page.getByRole('button', { name: '檢查' }).click()
  await cont(page)
  const lc = first('listenChoice')
  await header(page, 10)
  await expect(page.getByText('聽音選答')).toBeVisible()
  await radio(page, lc.options![lc.answer!])
  await page.getByRole('button', { name: '檢查' }).click()
  await cont(page)
  await header(page, 11)
  await shot(page, info, 'demo-shadowing')
  await skipShadowing(page)
  await header(page, 12)
  await write(page, 'This is his bike.')
  await header(page, 13)
  await write(page, 'This shop is small, but it is clean.')
  // 跟讀跳過＝答錯：錯題重做再出一次，再跳過就不再出
  await expect(page.getByText('再練一次錯題', { exact: true })).toBeVisible()
  await skipShadowing(page)

  const done = page.getByTestId('lesson-done')
  await expect(done).toContainText(`${TOTAL} 題`)
  await expect(done).toContainText(`答對 ${TOTAL - 1} 題`)
  await expect(done).not.toContainText('已加入單字庫')
  await shot(page, info, 'demo-done')
  expect(await snapshot(page)).toEqual(before)
})

test('/lesson/demo?type=shadowing 直接從跟讀開始；做完資料庫沒有變化', async ({ page }, info) => {
  await page.goto('/lesson/demo?type=shadowing')
  await header(page, 1, 3)
  await expect(page.getByText('This is his room.')).toBeVisible()
  await shot(page, info, 'demo-type-shadowing')
  const before = await snapshot(page)
  await skipShadowing(page)
  await header(page, 2, 3)
  await write(page, 'This is his bike.')
  await header(page, 3, 3)
  await write(page, 'This shop is small, but it is clean.')
  await expect(page.getByText('再練一次錯題', { exact: true })).toBeVisible()
  await skipShadowing(page)
  await expect(page.getByTestId('lesson-done')).toContainText('3 題')
  expect(await snapshot(page)).toEqual(before)
  const after = await snapshot(page)
  for (const table of ['reviewLogs', 'wordPool', 'lessonRuns', 'courseProgress', 'outbox'])
    expect(after[table], table).toEqual(before[table])
})

// 入口（創辦人 2026-11-07 改變 10-05 裁示，TASK-30）：只開在設定頁，首頁與課程頁仍不連
const openTestLesson = async (page: Page) => {
  await page.goto('/settings')
  await page.getByRole('button', { name: '測試課程' }).click()
  return page.getByRole('dialog', { name: '從哪個題型開始' })
}

test('示範課入口只在設定頁：「關於」上方有測試課程；首頁與課程頁沒有', async ({ page }, info) => {
  await page.goto('/')
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('今天')
  await expect(page.locator('a[href*="/lesson/demo"]')).toHaveCount(0)
  await expect(page.getByText('測試課程')).toHaveCount(0)

  await page.goto('/course')
  await expect(page.getByRole('button', { name: /基礎常用字（一）/ })).toBeVisible()
  await expect(page.locator('a[href*="/lesson/demo"]')).toHaveCount(0)
  await expect(page.getByText('測試課程')).toHaveCount(0)

  await page.goto('/settings')
  const row = page.getByRole('button', { name: '測試課程' })
  await row.scrollIntoViewIfNeeded()
  const rowBox = (await row.boundingBox())!
  const aboutBox = (await page.getByRole('button', { name: /隱私說明/ }).boundingBox())!
  expect(rowBox.y + rowBox.height).toBeLessThanOrEqual(aboutBox.y + 1)
  await shot(page, info, 'settings-test-lesson-row')
  await row.click()
  await expect(page.getByRole('dialog', { name: '從哪個題型開始' })).toBeVisible()
  await shot(page, info, 'settings-test-lesson-sheet', '[role="listbox"]')
})

test('測試課程：八個選項依序、各進到對應題型；離開回設定頁', async ({ page }) => {
  test.setTimeout(90_000)
  const options: [string, string, number, string | null][] = [
    ['全部題型', '', 13, null],
    ['配對', '?type=matching', 9, '把英文和中文配成一對'],
    ['選擇題', '?type=mcq', 8, '選出最適合的字'],
    ['閱讀', '?type=reading', 7, '閱讀理解'],
    ['聽音打字', '?type=listenType', 5, '聽句子，把聽到的英文打出來'],
    ['聽音選答', '?type=listenChoice', 4, '聽音選答'],
    ['跟讀', '?type=shadowing', 3, '聽一次，再唸出這句'],
    ['中翻英（AI 批改）', '?type=translate', 2, '中翻英'],
  ]
  const sheet = await openTestLesson(page)
  await expect(sheet.getByRole('option')).toHaveText(options.map(([label]) => label))
  await page.keyboard.press('Escape')

  for (const [label, search, total, text] of options) {
    await page.getByRole('button', { name: '測試課程' }).click()
    await sheet.getByRole('option', { name: label, exact: true }).click()
    await expect(page).toHaveURL(new RegExp(`/lesson/demo${search.replace('?', '\\?')}$`))
    await header(page, 1, total)
    if (text) await expect(page.getByText(text, { exact: true }).first()).toBeVisible()
    await page.getByRole('button', { name: '離開' }).click()
    await expect(page).toHaveURL(/\/settings$/)
    await expect(page.getByTestId('screen-settings')).toBeAttached()
  }
})

test('從設定頁走完測試課程（中翻英）：資料庫沒有變化', async ({ page }) => {
  const sheet = await openTestLesson(page)
  const before = await snapshot(page)
  await sheet.getByRole('option', { name: '中翻英（AI 批改）' }).click()
  await header(page, 1, 2)
  await write(page, 'This is his bike.')
  await header(page, 2, 2)
  await write(page, 'This shop is small, but it is clean.')
  await expect(page.getByTestId('lesson-done')).toContainText('2 題')
  expect(await snapshot(page)).toEqual(before)
  await page.getByTestId('lesson-done').getByRole('button', { name: '返回' }).click()
  await expect(page).toHaveURL(/\/settings$/)
})
