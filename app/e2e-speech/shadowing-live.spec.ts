// TASK-40 即時跟讀（課程跟讀題預設流程）：假辨識串流驅動逐字標記＋視覺 smoke（mockup.html 各狀態），兩引擎
// 辨識與麥克風為假（window.__lgSpeechConfig 的 live＝每輪辨識文字，見 src/speech/e2eSpeech.ts），不下載模型；
// 題目＝樣本課第一題跟讀「I have a cup of tea.」（have、a、of 為功能字：不擋整句完成）
// mock vs 真實：每輪文字寫死（真實為 Moonshine 滑動視窗或瀏覽器語音辨識的中間結果）；20 秒退路、60 秒上限以 page.clock 快轉
import { expect, test, type Locator, type Page } from '@playwright/test'
import { countIs, FIRST_SHADOWING } from './helpers.js'
import { check, expectColor, open, speech, token } from './visual.js'

const ROUNDS = ['I have', 'I have a cup', 'cup of tea', 'tea']

const word = (page: Page, text: string) =>
  page.getByTestId('live-word').filter({ hasText: new RegExp(`^${text}`) })
const marks = (page: Page) =>
  page
    .getByTestId('live-word')
    .evaluateAll((ws) =>
      ws.map((w) => `${w.firstChild?.textContent}:${(w as HTMLElement).dataset.mark}`).join(' '),
    )
/** 字的底色與字色有 200 ms 過渡：等過渡結束再比 token */
const settled = async (page: Page, l: Locator, prop: 'backgroundColor' | 'color', name: string) =>
  expect
    .poll(() => l.evaluate((el, p) => getComputedStyle(el)[p], prop), {
      message: `${prop} 應為 ${name}`,
    })
    .toBe(await token(page, name))

const counts = (page: Page) =>
  page.evaluate(() =>
    (
      window as unknown as {
        __lgSpeech: {
          live(): { micStarts: number; micStops: number; webStarts: number; webStops: number }
        }
      }
    ).__lgSpeech.live(),
  )

for (const theme of ['light', 'dark'] as const) {
  test(`開始前／錄音中部分完成／剛唸對／暫停／整句完成（自動停錄）＋狀態色（${theme}）`, async ({
    page,
  }, info) => {
    test.setTimeout(90_000)
    await open(page, { live: ROUNDS, liveHold: true }, theme)
    await expect(page.getByRole('button', { name: '開始唸' })).toBeVisible()
    expect(await marks(page)).toBe('I:todo have:todo a:todo cup:todo of:todo tea:todo')
    await expect(page.getByText('點一下開始唸。一個字一個字唸也可以，唸對就會變色')).toBeVisible()
    await expectColor(
      page,
      page.getByRole('button', { name: '開始唸' }),
      'backgroundColor',
      '--lg-primary',
    )
    await check(page, info, `${theme}-live-before`)

    await page.getByRole('button', { name: '開始唸' }).click()
    await expectColor(
      page,
      page.getByRole('button', { name: '暫停' }),
      'backgroundColor',
      '--lg-error',
    )
    await speech(page, 'next')
    await expect(page.getByTestId('live-heard')).toHaveText('聽到：I have')
    await speech(page, 'next')
    await expect(page.getByTestId('live-tally')).toHaveText('已完成 2／6 個字')
    expect(await marks(page)).toBe('I:done have:done a:todo cup:todo of:todo tea:todo')
    await settled(page, word(page, 'I'), 'backgroundColor', '--lg-correct-bg')
    await settled(page, word(page, 'I'), 'color', '--lg-correct')
    await check(page, info, `${theme}-live-partial`)

    await speech(page, 'next')
    await expect(word(page, 'cup')).toHaveAttribute('data-mark', 'done')
    await page
      .screenshot()
      .then((b) => info.attach(`${theme}-live-fresh`, { body: b, contentType: 'image/png' }))
    await check(page, info, `${theme}-live-fresh-after`)

    await page.getByRole('button', { name: '暫停' }).click()
    await expect(page.getByText('已暫停，唸對的字都留著。點一下繼續')).toBeVisible()
    expect(await counts(page)).toMatchObject({ micStarts: 1, micStops: 1 })
    await check(page, info, `${theme}-live-paused`)

    await page.getByRole('button', { name: '開始唸' }).click()
    await expect(page.getByRole('button', { name: '暫停' })).toBeVisible()
    await speech(page, 'next')
    await expect(page.getByText('整句完成！')).toBeVisible()
    expect(await marks(page)).toBe('I:done have:done a:light cup:done of:light tea:done')
    await expect(page.getByTestId('live-longest')).toHaveText('最長一口氣：4／6 個字')
    expect(await counts(page)).toMatchObject({ micStarts: 2, micStops: 2 })
    await expectColor(
      page,
      page.locator('[data-feedback="ok"]'),
      'backgroundColor',
      '--lg-correct-bg',
    )
    await settled(page, word(page, 'a'), 'color', '--lg-muted')
    await check(page, info, `${theme}-live-done`)
    expect(await token(page, '--lg-correct')).not.toBe(await token(page, '--lg-muted'))

    await page.getByRole('button', { name: '繼續' }).click()
    await countIs(page, FIRST_SHADOWING + 1)
  })
}

test('不照順序、連續辨識串流（不逐輪放行）：自然節奏下標記並整句完成，計答對', async ({ page }) => {
  await open(page, { live: ['tea', 'cup of tea', 'I have a cup of tea', 'I have a cup of tea'] })
  await page.getByRole('button', { name: '開始唸' }).click()
  await expect(page.getByText('整句完成！')).toBeVisible()
  expect(await marks(page)).toBe('I:done have:done a:done cup:done of:done tea:done')
  await expect(page.getByTestId('live-longest')).toHaveText('最長一口氣：6／6 個字')
  await expect(page.getByText('整句一口氣唸完，很流暢。')).toBeVisible()
  expect(await counts(page)).toMatchObject({ micStarts: 1, micStops: 1 })
  // 一口氣再唸一次：走整句錄音（只當練習）
  await page.getByRole('button', { name: '一口氣再唸一次' }).click()
  await expect(page.getByRole('button', { name: '開始錄音' })).toBeVisible()
})

test('卡住 20 秒：出現「改用整句錄音」→ 停錄並進整句錄音', async ({ page }, info) => {
  await open(page, { live: ['I have'], liveHold: true, heard: ['I have a cup of tea'] })
  await page.getByRole('button', { name: '開始唸' }).click()
  await speech(page, 'next')
  await page.clock.fastForward(20_000)
  await expect(page.getByRole('button', { name: '改用整句錄音' })).toBeVisible()
  await expect(page.getByText(/^錄音中・0:2\d\s點一下暫停$/)).toBeVisible()
  await check(page, info, 'live-stuck')
  await page.getByRole('button', { name: '改用整句錄音' }).click()
  await expect(page.getByRole('button', { name: '開始錄音' })).toBeVisible()
  expect(await counts(page)).toMatchObject({ micStarts: 1, micStops: 1 })
})

test('單次錄音 60 秒自動暫停：麥克風釋放', async ({ page }) => {
  await open(page, {})
  await page.getByRole('button', { name: '開始唸' }).click()
  await expect(page.getByRole('button', { name: '暫停' })).toBeVisible()
  await page.clock.fastForward(60_000)
  await expect(page.getByText('已暫停，唸對的字都留著。點一下繼續')).toBeVisible()
  expect(await counts(page)).toMatchObject({ micStarts: 1, micStops: 1 })
})

test('錄音中跳過：答錯並到下一題，麥克風釋放', async ({ page }) => {
  await open(page, {})
  await page.getByRole('button', { name: '開始唸' }).click()
  await page.getByRole('button', { name: '這題跳過' }).click()
  await countIs(page, FIRST_SHADOWING + 1)
  expect(await counts(page)).toMatchObject({ micStarts: 1, micStops: 1 })
})

test('錄音中按 ✕ 離開小課：麥克風釋放', async ({ page }) => {
  await open(page, {})
  await page.getByRole('button', { name: '開始唸' }).click()
  await expect(page.getByRole('button', { name: '暫停' })).toBeVisible()
  await page.getByRole('button', { name: '離開', exact: true }).first().click()
  await page.getByRole('alertdialog').getByRole('button', { name: '離開' }).click()
  await expect(page.getByText('跟讀', { exact: true })).toBeHidden()
  expect(await counts(page)).toMatchObject({ micStarts: 1, micStops: 1 })
})

test('本機不能即時辨識：提出瀏覽器語音辨識→同意→中間結果驅動標記、整句完成停止辨識', async ({
  page,
}, info) => {
  await open(page, {
    liveMic: false,
    webSpeech: true,
    live: ['I have a cup', 'I have a cup of tea', 'tea'],
  })
  await expect(page.getByText('這支手機無法邊唸邊辨識')).toBeVisible()
  await check(page, info, 'live-local-unavailable')
  await page.getByRole('button', { name: '改用瀏覽器的語音辨識' }).click()
  await page.getByRole('alertdialog').getByRole('button', { name: '同意並使用' }).click()
  await page.getByRole('button', { name: '開始唸' }).click()
  await expect(page.getByText('整句完成！')).toBeVisible()
  expect(await counts(page)).toMatchObject({ webStarts: 1, webStops: 1, micStarts: 0 })
})

test('瀏覽器語音辨識錄音中：提示改為可能傳送到瀏覽器廠商', async ({ page }, info) => {
  await open(page, { liveMic: false, webSpeech: true, live: ['I have'], liveHold: true })
  await page.getByRole('button', { name: '改用瀏覽器的語音辨識' }).click()
  await page.getByRole('alertdialog').getByRole('button', { name: '同意並使用' }).click()
  await page.getByRole('button', { name: '開始唸' }).click()
  await expect(page.getByText('錄音中・錄音可能會傳送到瀏覽器廠商的伺服器')).toBeVisible()
  await check(page, info, 'live-web-recording')
})

const NARROW = [
  { name: '320-md', width: 320, height: 640, textSize: null },
  { name: '320-xl', width: 320, height: 640, textSize: 'xl' },
  { name: '375-xl', width: 375, height: 812, textSize: 'xl' },
] as const

for (const c of NARROW) {
  test(`窄螢幕／特大字級 ${c.name}：開始前、部分完成、卡住、整句完成`, async ({ page }, info) => {
    test.setTimeout(90_000)
    await page.setViewportSize({ width: c.width, height: c.height })
    await page.addInitScript((size) => {
      if (size) localStorage.setItem('lg.textSize', size)
    }, c.textSize)
    await open(page, { live: ROUNDS, liveHold: true })
    await check(page, info, `${c.name}-live-before`, false)
    await page.getByRole('button', { name: '開始唸' }).click()
    await speech(page, 'next')
    await speech(page, 'next')
    await expect(page.getByTestId('live-tally')).toHaveText('已完成 2／6 個字')
    await check(page, info, `${c.name}-live-partial`, false)
    await page.clock.fastForward(20_000)
    await expect(page.getByRole('button', { name: '改用整句錄音' })).toBeVisible()
    await check(page, info, `${c.name}-live-stuck`, false)
    await speech(page, 'next')
    await speech(page, 'next')
    await expect(page.getByText('整句完成！')).toBeVisible()
    await check(page, info, `${c.name}-live-done`, false)
    await expect(page.getByRole('button', { name: '繼續' })).toBeInViewport()
    await expect(page.getByRole('button', { name: '一口氣再唸一次' })).toBeInViewport()
  })
}
