// 走查 P0（TASK-15）：已連結且選了付費模型時，設定列顯示模型 id；一般長度與極長 id 在窄螢幕／特大字級下
// 整頁不得橫向溢出、AI 批改卡內子元素不得伸出卡片（量法同 narrow.spec：e2e/measure.ts）
import { expect, test } from '@playwright/test'
import { measureMobile, overflowingChildren } from './measure.js'
import { fakeOpenRouter, FAKE_KEY, MODELS } from './openrouter.js'

test.use({ serviceWorkers: 'block' })

const PAID = MODELS.filter((m) => !m.id.endsWith(':free') && m.id !== 'openrouter/free')
const CASES = [
  { name: '320-xl', width: 320, height: 640, textSize: 'xl', theme: 'light' },
  { name: '360-md', width: 360, height: 740, textSize: 'md', theme: 'light' },
  { name: '375-xl-dark', width: 375, height: 812, textSize: 'xl', theme: 'dark' },
  { name: '375-md', width: 375, height: 812, textSize: 'md', theme: 'light' },
] as const

for (const c of CASES)
  for (const model of PAID)
    test(`${c.name}：付費模型 ${model.id.length > 40 ? '極長 id' : '一般 id'} 不溢出`, async ({
      page,
    }) => {
      await page.setViewportSize({ width: c.width, height: c.height })
      await page.addInitScript(
        ({ size, theme }) => {
          localStorage.setItem('lg.installDismissed', '1')
          localStorage.setItem('lg.textSize', size)
          localStorage.setItem('lg.theme', theme)
        },
        { size: c.textSize, theme: c.theme },
      )
      await fakeOpenRouter(page)
      await page.goto('/openrouter')
      await page.getByLabel('金鑰').fill(FAKE_KEY)
      await page.getByRole('button', { name: '驗證並儲存' }).click()
      await expect(page.getByText('已連結')).toBeVisible()
      await page.getByRole('button', { name: /模型\s*免費模型/ }).click()
      await page.getByRole('option', { name: new RegExp(`^${model.name}`) }).click()
      const card = page.getByTestId('ai-linked')
      await expect(card.getByText(model.id)).toBeVisible()

      const m = await measureMobile(page)
      expect(m.overflow, '整頁橫向溢出').toEqual([])
      expect(
        await overflowingChildren(page, '[data-testid="ai-linked"]'),
        'AI 卡子元素溢出',
      ).toEqual([])
    })
