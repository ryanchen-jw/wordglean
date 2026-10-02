// 小課 e2e 共用：E2E 建置的題目來源＝樣本課 fixture（VITE_ITEM_FIXTURES，見 playwright.config.ts）
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { expect, type Page } from '@playwright/test'

export const LESSON = 'a1-u01-l01'

interface Pick {
  /** [正解, 錯誤選項…]（選項文字） */
  options: string[]
  check: boolean
}

// 依題目檔算出每一步的正解與錯誤選項；與引擎無關（直接讀 fixture）
const doc = JSON.parse(
  readFileSync(
    resolve(import.meta.dirname, '../src/lesson/fixtures/items', `${LESSON}.json`),
    'utf-8',
  ),
) as {
  items: {
    type: string
    glossZh?: string
    distractorsZh?: string[]
    options?: string[]
    answer?: number
    questions?: { options: string[]; answer: number }[]
  }[]
}

const rest = (opts: string[], answer: number) => [
  opts[answer],
  ...opts.filter((_, i) => i !== answer),
]

export const STEPS: Pick[] = doc.items.flatMap((it): Pick[] => {
  if (it.type === 'wordCard')
    return [{ options: [it.glossZh!, ...it.distractorsZh!], check: false }]
  if (it.type === 'mcq') return [{ options: rest(it.options!, it.answer!), check: true }]
  if (it.type === 'reading')
    return it.questions!.map((q) => ({ options: rest(q.options, q.answer), check: true }))
  return []
})

export const count = (page: Page, n: number) =>
  expect(page.getByText(`${n}／${STEPS.length}`, { exact: true })).toBeVisible()

/** 作答第 n 題（從 1 起）；wrong＝選第一個錯誤選項。不按「繼續」 */
export async function answer(page: Page, n: number, wrong = false) {
  await count(page, n)
  const s = STEPS[n - 1]
  await page.getByRole('radio', { name: s.options[wrong ? 1 : 0], exact: true }).click()
  if (s.check) await page.getByRole('button', { name: '檢查' }).click()
  await expect(page.getByRole('status').filter({ has: page.locator('strong') })).toBeVisible()
}

export async function next(page: Page) {
  await page.getByRole('button', { name: '繼續' }).click()
}

/** 連續答對到第 n 題之前（停在第 n 題出題狀態） */
export async function playTo(page: Page, n: number) {
  for (let i = 1; i < n; i++) {
    await answer(page, i)
    await next(page)
  }
  await count(page, n)
}
