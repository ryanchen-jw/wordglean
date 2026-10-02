// 跟讀 e2e 共用：能跟讀（stt）時的小課出題順序照 TASK-18 穿插規則（e2e/lesson.ts stepsOf）；
// 內建聲音一律用替身（e2e/speech.ts），兩引擎都有聽類題、順序一致
import { expect, type Page } from '@playwright/test'
import { LESSON, stepsOf } from '../e2e/lesson.js'

export const SPEECH_STEPS = stepsOf(LESSON, { stt: true })
export const FIRST_SHADOWING = SPEECH_STEPS.findIndex((s) => s.shadowing !== undefined) + 1

export const countIs = (page: Page, n: number) =>
  expect(page.getByText(`${n}／${SPEECH_STEPS.length}`, { exact: true })).toBeVisible()

/** 依正解作答第 n 題並往下（跟讀按跳過＝直接到下一題） */
export async function answerStep(page: Page, n: number) {
  await countIs(page, n)
  const s = SPEECH_STEPS[n - 1]
  if (s.shadowing !== undefined) {
    await expect(page.getByText('跟讀', { exact: true })).toBeVisible()
    await page.getByRole('button', { name: /跳過/ }).click()
    return
  }
  if (s.typed !== undefined)
    await page.getByRole('textbox', { name: '把聽到的英文打在這裡' }).fill(s.typed)
  else await page.getByRole('radio', { name: s.options[0], exact: true }).click()
  if (s.check) await page.getByRole('button', { name: '檢查' }).click()
  await page.getByRole('button', { name: '繼續' }).click()
}

/** 從第 1 題作答到第一題跟讀（停在跟讀出題狀態） */
export async function toShadowing(page: Page) {
  for (let n = 1; n < FIRST_SHADOWING; n++) await answerStep(page, n)
  await countIs(page, FIRST_SHADOWING)
  await expect(page.getByText('跟讀', { exact: true })).toBeVisible()
}
