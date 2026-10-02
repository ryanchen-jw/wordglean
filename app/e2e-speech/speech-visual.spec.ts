// TASK-14 視覺 smoke（harness 06）：設計 s04 跟讀各狀態兩引擎截圖＋06 三件套＋狀態色（computed style 對 token）
// 辨識與麥克風為假（window.__lgSpeechConfig，見 src/speech/e2eSpeech.ts），不下載模型；題目＝樣本課 A1 第 9 步「I have a cup of tea.」
// mock vs 真實：辨識結果為寫死字串（真實為 Moonshine 輸出）；下載進度 42% 為手動設定（真實為下載量比例）
import { writeFile } from 'node:fs/promises'
import { expect, test, type Locator, type Page, type TestInfo } from '@playwright/test'
import { LESSON } from '../e2e/lesson.js'
import { measureMobile, overflowingChildren } from '../e2e/measure.js'
import { fakeSystemVoice } from '../e2e/speech.js'
import { toShadowing } from './helpers.js'
// 與 src/speech/e2eSpeech.ts 的 E2eSpeechConfig 同形（e2e 的 tsconfig 不編 src）
interface E2eSpeechConfig {
  model?: string
  mic?: 'granted' | 'prompt' | 'denied' | 'unsupported'
  heard?: string[]
  hold?: boolean
  wasm?: boolean
  webSpeech?: boolean
}

async function check(page: Page, info: TestInfo, name: string, strict = true) {
  await page.waitForTimeout(300) // 等回饋動畫結束
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
  for (const sel of ['main', '[role="status"]', '[role="alertdialog"]'])
    if (await page.locator(sel).count())
      expect.soft(await overflowingChildren(page, sel), `${name}：${sel} 子元素溢出`).toEqual([])
}

/** token 的實際顏色（rgb 字串） */
const token = (page: Page, name: string) =>
  page.evaluate((n) => {
    const probe = document.createElement('div')
    probe.style.color = `var(${n})`
    document.body.append(probe)
    const c = getComputedStyle(probe).color
    probe.remove()
    return c
  }, name)

const style = (l: Locator, prop: 'backgroundColor' | 'color' | 'borderTopColor') =>
  l.evaluate((el, p) => getComputedStyle(el)[p], prop)

async function expectColor(
  page: Page,
  l: Locator,
  prop: 'backgroundColor' | 'color' | 'borderTopColor',
  name: string,
) {
  expect(await style(l, prop), `${prop} 應為 ${name}`).toBe(await token(page, name))
}

async function open(page: Page, cfg: E2eSpeechConfig, theme: 'light' | 'dark' = 'light') {
  await fakeSystemVoice(page)
  await page.addInitScript(
    ([c, th]) => {
      localStorage.setItem('lg.installDismissed', '1')
      localStorage.setItem('lg.theme', th as string)
      ;(window as unknown as { __lgSpeechConfig: unknown }).__lgSpeechConfig = c
    },
    [cfg, theme] as const,
  )
  await page.goto(`/lesson/${LESSON}`)
  await toShadowing(page)
  await expect(page.getByText('跟讀', { exact: true })).toBeVisible()
}

const speech = (page: Page, fn: string, arg?: unknown) =>
  page.evaluate(
    ([f, a]) =>
      (window as unknown as { __lgSpeech: Record<string, (x?: unknown) => void> }).__lgSpeech[
        f as string
      ](a),
    [fn, arg] as const,
  )

for (const theme of ['light', 'dark'] as const) {
  test(`s04 錄音流程：待錄／錄音中／轉文字中／確認／結果（錯、對）＋狀態色（${theme}）`, async ({
    page,
  }, info) => {
    test.setTimeout(90_000)
    await open(page, { hold: true, heard: ['I have a cap', 'I have a cup of tea'] }, theme)
    const rec = (name: string) => page.getByRole('button', { name })

    await expectColor(page, rec('開始錄音'), 'backgroundColor', '--lg-primary')
    await check(page, info, `${theme}-s04-idle`)

    await rec('開始錄音').click()
    await expectColor(page, rec('結束錄音'), 'backgroundColor', '--lg-error')
    await check(page, info, `${theme}-s04-recording`)

    await rec('結束錄音').click()
    await expect(page.getByText('轉文字中…（錄音不會上傳）')).toBeVisible()
    await expectColor(page, rec('辨識中'), 'backgroundColor', '--lg-disabled-bg')
    await check(page, info, `${theme}-s04-busy`)

    await speech(page, 'finish')
    await expect(page.getByRole('textbox')).toHaveValue('I have a cap')
    await check(page, info, `${theme}-s04-confirm`)

    await page.getByRole('button', { name: '送出' }).click()
    await expect(
      page.getByTestId('shadowing-tally').filter({ hasText: '錯字 1・漏字 2・得分 3／6 字' }),
    ).toBeVisible()
    await expectColor(page, page.locator('[data-mark="wrong"]'), 'color', '--lg-error')
    await expectColor(page, page.locator('[data-mark="wrong"]'), 'backgroundColor', '--lg-error-bg')
    await expectColor(page, page.locator('[data-mark="missing"]').first(), 'color', '--lg-error')
    await expectColor(
      page,
      page.getByTestId('shadowing-tally').filter({ hasText: '錯字 1・漏字 2・得分 3／6 字' }),
      'color',
      '--lg-error',
    )
    await expectColor(
      page,
      page.locator('[data-feedback="no"]'),
      'backgroundColor',
      '--lg-error-bg',
    )
    await check(page, info, `${theme}-s04-result-wrong`)

    await page.getByRole('button', { name: '再唸一次' }).click()
    await rec('開始錄音').click()
    await rec('結束錄音').click()
    await speech(page, 'finish')
    await page.getByRole('button', { name: '送出' }).click()
    await expect(
      page.getByTestId('shadowing-tally').filter({ hasText: '錯字 0・漏字 0・得分 6／6 字' }),
    ).toBeVisible()
    await expectColor(
      page,
      page.getByTestId('shadowing-tally').filter({ hasText: '錯字 0・漏字 0・得分 6／6 字' }),
      'color',
      '--lg-correct',
    )
    await expectColor(
      page,
      page.locator('[data-feedback="ok"]'),
      'backgroundColor',
      '--lg-correct-bg',
    )
    await check(page, info, `${theme}-s04-result-right`)
    // 兩色系 token 不同，避免同色假綠
    expect(await token(page, '--lg-error')).not.toBe(await token(page, '--lg-primary'))
  })
}

test('s04 未允許麥克風：外框與圖示 error、底 surface', async ({ page }, info) => {
  await open(page, { mic: 'denied' })
  const btn = page.getByRole('button', { name: '麥克風未允許' })
  await expectColor(page, btn, 'borderTopColor', '--lg-error')
  await expectColor(page, btn, 'color', '--lg-error')
  await expectColor(page, btn, 'backgroundColor', '--lg-surface')
  await check(page, info, 's04-denied')
})

test('s04 模型：下載前（D4）／下載中 42%／下載失敗／準備中', async ({ page }, info) => {
  await open(page, { model: 'notDownloaded' })
  await expect(page.getByText('需要下載語音辨識模型')).toBeVisible()
  await expectColor(
    page,
    page.getByRole('button', { name: '語音辨識模型下載中，暫時無法錄音' }),
    'backgroundColor',
    '--lg-disabled-bg',
  )
  await check(page, info, 's04-download-idle')

  await speech(page, 'setModel', { kind: 'downloading', progress: 0.42 })
  await expect(page.getByText('42%')).toBeVisible()
  const fill = page.getByRole('progressbar', { name: '語音辨識模型下載中' }).locator('div')
  await expectColor(page, fill, 'backgroundColor', '--lg-primary')
  await check(page, info, 's04-stt-download')

  await speech(page, 'setModel', { kind: 'failed' })
  await expect(page.getByRole('button', { name: '下載中斷・重試' })).toBeVisible()
  await expectColor(page, fill, 'backgroundColor', '--lg-error')
  await check(page, info, 's04-download-failed')

  await speech(page, 'setModel', { kind: 'loading' })
  await expect(page.getByText('語音辨識準備中…')).toBeVisible()
  await check(page, info, 's04-preparing')
})

// 瀏覽器不能錄音／沒有 WebAssembly 時跟讀已換成聽音打字（TASK-18），後備只會在模型載入失敗時出現
test('s04 模型載入失敗：提出瀏覽器語音辨識後備＋同意框', async ({ page }, info) => {
  await open(page, { model: 'failed', webSpeech: true })
  await expect(page.getByRole('button', { name: '下載中斷・重試' })).toBeVisible()
  await check(page, info, 's04-failed-offer')
  await page.getByRole('button', { name: '改用瀏覽器的語音辨識' }).click()
  const dialog = page.getByRole('alertdialog')
  await expect(dialog).toContainText('錄音可能會傳送到瀏覽器廠商的伺服器')
  await check(page, info, 's04-fallback-dialog')
  await dialog.getByRole('button', { name: '同意並使用' }).click()
  await expect(page.getByRole('button', { name: '開始錄音' })).toBeEnabled()
  await check(page, info, 's04-fallback-idle')
})

const NARROW = [
  { name: '320-md', width: 320, height: 640, textSize: null },
  { name: '320-xl', width: 320, height: 640, textSize: 'xl' },
  { name: '375-xl', width: 375, height: 812, textSize: 'xl' },
] as const

for (const c of NARROW) {
  test(`窄螢幕／特大字級 ${c.name}：待錄、下載中、確認、結果、未允許麥克風`, async ({
    page,
  }, info) => {
    test.setTimeout(90_000)
    await page.setViewportSize({ width: c.width, height: c.height })
    await page.addInitScript((size) => {
      if (size) localStorage.setItem('lg.textSize', size)
    }, c.textSize)
    await open(page, { model: 'notDownloaded', heard: ['I have a cap'] })
    await speech(page, 'setModel', { kind: 'downloading', progress: 0.42 })
    await check(page, info, `${c.name}-s04-stt-download`, false)
    await speech(page, 'setModel', { kind: 'ready' })
    await check(page, info, `${c.name}-s04-idle`, false)
    await page.getByRole('button', { name: '開始錄音' }).click()
    await page.getByRole('button', { name: '結束錄音' }).click()
    await expect(page.getByRole('textbox')).toBeVisible()
    await check(page, info, `${c.name}-s04-confirm`, false)
    // 主鈕與次要鈕都在畫面內
    await expect(page.getByRole('button', { name: '送出' })).toBeInViewport()
    await page.getByRole('button', { name: '送出' }).click()
    await expect(
      page.getByTestId('shadowing-tally').filter({ hasText: '錯字 1・漏字 2・得分 3／6 字' }),
    ).toBeVisible()
    await check(page, info, `${c.name}-s04-result`, false)
    await expect(page.getByRole('button', { name: '繼續' })).toBeInViewport()
  })
}
