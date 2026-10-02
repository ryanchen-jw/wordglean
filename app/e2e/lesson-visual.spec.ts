// TASK-12 AC#3 視覺 smoke（harness 06）：讀類三題型的出題／答對／答錯、例句提示、閱讀翻譯、離開確認 s12、完成頁 s14。
// 每個狀態截圖 attach＋具名檔存 test-results/（gitignored），斷言 06 三件套＋英文介面字串＋body 色；
// 另在 320 標準／320 特大／375 特大下量溢出、折行與卡片內子元素溢出（比照 narrow.spec）。
// 資料：樣本課 fixture（A1 一課 12 步）；最長的選項與回饋文字取 fixture 原文（mock＝真實題目格式）
import { writeFile } from 'node:fs/promises'
import { expect, test, type Page, type TestInfo } from '@playwright/test'
import { answer, LESSON, next, playTo } from './lesson.js'
import { measureMobile, overflowingChildren } from './measure.js'

async function check(page: Page, info: TestInfo, name: string, strict = true) {
  await page.waitForTimeout(300) // 等回饋動畫（200ms）結束
  const shot = await page.screenshot()
  await info.attach(name, { body: shot, contentType: 'image/png' })
  await writeFile(info.outputPath(`${info.project.name}-${name}.png`), shot)
  const m = await measureMobile(page)
  expect.soft(m.overflow, `${name}：橫向溢出`).toEqual([])
  expect.soft(m.wrapped, `${name}：單行控件折行`).toEqual([])
  expect.soft(m.small, `${name}：可點目標 <44px`).toEqual([])
  if (strict) {
    expect.soft(m.latin, `${name}：英文介面字串`).toEqual([])
    expect.soft(m.bodyColors, `${name}：body 未套 token 色`).toEqual([])
  }
  // 卡片、選項、回饋條內的子元素不得伸出框
  for (const sel of ['main', '[role="status"]', '[role="alertdialog"]'])
    if (await page.locator(sel).count())
      expect.soft(await overflowingChildren(page, sel), `${name}：${sel} 子元素溢出`).toEqual([])
}

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('lg.installDismissed', '1'))
})

test('s07 單字卡：出題／例句提示／答對／答錯', async ({ page }, info) => {
  await page.goto(`/lesson/${LESSON}`)
  await expect(page.getByText('選出這個字的意思')).toBeVisible()
  await check(page, info, 's07-question')
  await page.getByRole('button', { name: '看例句提示' }).click()
  await check(page, info, 's07-hint')
  await answer(page, 1)
  await check(page, info, 's07-right')
  await next(page)
  await answer(page, 2, true)
  await check(page, info, 's07-wrong')
})

// 走查 P1 守衛：答題後選項要有 correct-bg／error-bg 填色（components.md §3），不能被共用的 surface 底蓋掉
for (const theme of ['light', 'dark'] as const) {
  test(`答題後選項底色＝correct-bg／error-bg（${theme}）`, async ({ page }) => {
    await page.addInitScript((th) => localStorage.setItem('lg.theme', th), theme)
    await page.goto(`/lesson/${LESSON}`)
    await answer(page, 1, true)
    const bg = (state: string) =>
      page
        .locator(`[data-choice="${state}"]`)
        .first()
        .evaluate((el) => getComputedStyle(el).backgroundColor)
    const token = (name: string) =>
      page.evaluate((n) => {
        const probe = document.createElement('div')
        probe.style.background = `var(${n})`
        document.body.append(probe)
        const c = getComputedStyle(probe).backgroundColor
        probe.remove()
        return c
      }, name)
    expect(await bg('correct')).toBe(await token('--lg-correct-bg'))
    expect(await bg('wrong')).toBe(await token('--lg-error-bg'))
    expect(await bg('dim')).toBe(await token('--lg-surface'))
    // 兩色系的 token 不同，避免「兩邊都是同一個顏色」的假綠
    expect(await token('--lg-correct-bg')).not.toBe(await token('--lg-surface'))
  })
}

test('s05 選擇題：已選未檢查／答錯／答對', async ({ page }, info) => {
  await page.goto(`/lesson/${LESSON}`)
  await playTo(page, 9)
  await page.getByRole('radio', { name: 'in', exact: true }).click()
  await check(page, info, 's05-mc-selected')
  await page.getByRole('button', { name: '檢查' }).click()
  await check(page, info, 's05-mc-wrong')
  await next(page)
  await answer(page, 10)
  await check(page, info, 's05-mc-right')
})

test('s05 閱讀理解：作答中／看中文翻譯／答錯；s12 離開確認', async ({ page }, info) => {
  await page.goto(`/lesson/${LESSON}`)
  await playTo(page, 11)
  await page.getByRole('radio', { name: '兩個', exact: true }).click()
  await check(page, info, 's05-reading')
  await page.getByRole('button', { name: '看中文翻譯' }).click()
  await check(page, info, 's05-reading-zh')
  await page.getByRole('button', { name: '離開' }).click()
  await expect(page.getByRole('alertdialog')).toBeVisible()
  await check(page, info, 's12-default')
  await page.getByRole('button', { name: '繼續上課' }).click()
  await page.getByRole('radio', { name: '一個', exact: true }).click()
  await page.getByRole('button', { name: '檢查' }).click()
  await check(page, info, 's05-reading-wrong')
})

test('s14 完成頁', async ({ page }, info) => {
  await page.goto(`/lesson/${LESSON}`)
  for (let n = 1; n <= 12; n++) {
    await answer(page, n, n === 2 || n === 9)
    await next(page)
  }
  await expect(page.getByTestId('lesson-done')).toBeVisible()
  await check(page, info, 's14-default')
})

const NARROW = [
  { name: '320-md', width: 320, height: 640, textSize: null },
  { name: '320-xl', width: 320, height: 640, textSize: 'xl' },
  { name: '375-xl', width: 375, height: 812, textSize: 'xl' },
] as const

for (const c of NARROW) {
  test(`窄螢幕／特大字級 ${c.name}：單字卡答錯、選擇題答錯、閱讀、離開確認、完成頁`, async ({
    page,
  }, info) => {
    test.setTimeout(90_000)
    await page.setViewportSize({ width: c.width, height: c.height })
    await page.addInitScript((size) => {
      if (size) localStorage.setItem('lg.textSize', size)
    }, c.textSize)
    await page.goto(`/lesson/${LESSON}`)
    await page.getByRole('button', { name: '看例句提示' }).click()
    await check(page, info, `${c.name}-s07-hint`, false)
    await answer(page, 1, true)
    await check(page, info, `${c.name}-s07-wrong`, false)
    await next(page)
    for (let n = 2; n <= 8; n++) {
      await answer(page, n)
      await next(page)
    }
    await answer(page, 9, true)
    await check(page, info, `${c.name}-s05-mc-wrong`, false)
    await next(page)
    await answer(page, 10)
    await next(page)
    await page.getByRole('button', { name: '看中文翻譯' }).click()
    await check(page, info, `${c.name}-s05-reading-zh`, false)
    // 閱讀卡限高自己捲動，選項與底部按鈕仍在畫面內
    await expect(page.getByRole('button', { name: '檢查' })).toBeInViewport()
    await page.getByRole('button', { name: '離開' }).click()
    const dialog = page.getByRole('alertdialog')
    await check(page, info, `${c.name}-s12`, false)
    const box = (await dialog.boundingBox())!
    expect(box.y).toBeGreaterThanOrEqual(0)
    expect(box.y + box.height).toBeLessThanOrEqual(c.height)
    await page.getByRole('button', { name: '繼續上課' }).click()
    for (let n = 11; n <= 12; n++) {
      await answer(page, n)
      await next(page)
    }
    await expect(page.getByTestId('lesson-done')).toBeVisible()
    await check(page, info, `${c.name}-s14`, false)
  })
}
