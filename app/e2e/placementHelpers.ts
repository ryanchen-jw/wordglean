// 分級測驗 e2e 共用：已提交題本（查字的級距，不經計分程式）與逐組作答
import { readFileSync } from 'node:fs'
import { expect, type Page } from '@playwright/test'

export const BANK = JSON.parse(
  readFileSync(new URL('../../content/placement/placement.json', import.meta.url), 'utf-8'),
) as { levels: Record<string, string[]>; pseudowords: string[] }

export const isLevel = (word: string, ...levels: string[]) =>
  levels.some((l) => BANK.levels[l].includes(word))

/**
 * 逐組作答（5 組）；pick 為 true 的字就勾。onItem 在每格作答後呼叫（模擬每題思考時間用），
 * onGroup 在每組按下一組前呼叫。回傳作答的總題數
 */
export async function answerAll(
  page: Page,
  pick: (word: string) => boolean,
  {
    onItem,
    onGroup,
  }: { onItem?: () => Promise<void>; onGroup?: (g: number) => Promise<void> } = {},
): Promise<number> {
  let items = 0
  for (let g = 1; g <= 5; g++) {
    await expect(page.getByText(`第 ${g}／5 組`)).toBeVisible()
    for (const box of await page.getByRole('checkbox').all()) {
      if (pick((await box.textContent())!)) await box.click()
      items++
      await onItem?.()
    }
    await onGroup?.(g)
    await page.getByRole('button', { name: g < 5 ? /^下一組/ : /^看結果/ }).click()
  }
  return items
}
