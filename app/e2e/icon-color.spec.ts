// 圖示鈕顏色（TASK-16 驗收 P1）：共用 iconBtnCls 不帶顏色、由使用處各自給；
// 以 computed color 對照當下色系的 token（淺色、深色兩輪），防「共用 class 自帶顏色蓋掉覆寫」再發生
import { expect, test, type Locator, type Page } from '@playwright/test'
import { LESSON } from './lesson.js'

/** 元素的文字色是否等於 token（以同頁 probe 取 token 的 computed 值比對，與色系無關） */
async function colorOf(el: Locator) {
  return el.evaluate((node) => getComputedStyle(node).color)
}
async function tokenColor(page: Page, token: string) {
  return page.evaluate((v) => {
    const probe = document.createElement('div')
    probe.style.color = `var(${v})`
    document.body.append(probe)
    const c = getComputedStyle(probe).color
    probe.remove()
    return c
  }, token)
}

for (const theme of ['light', 'dark'] as const) {
  test.describe(theme, () => {
    test.beforeEach(async ({ page }) => {
      await page.addInitScript((theme) => {
        localStorage.setItem('lg.theme', theme)
        if (!sessionStorage.getItem('lg.keepInstall'))
          localStorage.setItem('lg.installDismissed', '1')
      }, theme)
    })

    test('字典彈層發音鈕＝primary（設計 s08）', async ({ page }) => {
      await page.goto('/course?level=A1')
      await page
        .getByRole('button', { name: /第 1 課/ })
        .first()
        .click()
      await page
        .getByRole('dialog', { name: '小課詳情' })
        .getByRole('button', { name: 'have', exact: true })
        .click()
      const speakBtn = page.getByRole('dialog', { name: '單字查義' }).getByRole('button', {
        name: '發音',
      })
      await expect(speakBtn).toBeVisible()
      expect(await colorOf(speakBtn)).toBe(await tokenColor(page, '--lg-primary'))
    })

    test('其他圖示鈕：首頁設定＝text、子頁返回＝text、小課離開＝text、單字卡發音＝primary', async ({
      page,
      browserName,
    }) => {
      await page.goto('/')
      const settings = page.getByRole('link', { name: '設定' })
      expect(await colorOf(settings)).toBe(await tokenColor(page, '--lg-text'))
      await settings.click()
      const back = page.getByRole('button', { name: '返回' })
      expect(await colorOf(back)).toBe(await tokenColor(page, '--lg-text'))

      await page.goto(`/lesson/${LESSON}`)
      const leave = page.getByRole('button', { name: '離開' })
      expect(await colorOf(leave)).toBe(await tokenColor(page, '--lg-text'))
      // 單字卡發音鈕只在支援 speechSynthesis 時出現（Playwright WebKit Windows build 沒有）
      if (browserName !== 'chromium') return
      const speakBtn = page.getByRole('button', { name: '發音' })
      await expect(speakBtn).toBeVisible()
      expect(await colorOf(speakBtn)).toBe(await tokenColor(page, '--lg-primary'))
    })

    test('安裝卡關閉鈕＝muted（webkit 顯示 iOS 說明卡）', async ({ page, browserName }) => {
      test.skip(
        browserName !== 'webkit',
        '安裝卡在 chromium 需模擬 beforeinstallprompt，webkit 一輪即可',
      )
      await page.addInitScript(() => {
        sessionStorage.setItem('lg.keepInstall', '1')
        localStorage.removeItem('lg.installDismissed')
      })
      await page.goto('/')
      const close = page.getByRole('button', { name: '關閉加到主畫面提示' })
      await expect(close).toBeVisible()
      expect(await colorOf(close)).toBe(await tokenColor(page, '--lg-muted'))
    })
  })
}
