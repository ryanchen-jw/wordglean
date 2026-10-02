// TASK-14 × TASK-18：能跟讀時一課恢復跟讀題，出題順序照穿插規則（單字卡 → 聽→說→讀 每輪各一題）
// 辨識與麥克風為假（可錄音、模型已就緒）；內建聲音用替身。逐題核對題號、總題數、跟讀出現的位置與目標句
import { expect, test } from '@playwright/test'
import { LESSON } from '../e2e/lesson.js'
import { fakeSystemVoice } from '../e2e/speech.js'
import { answerStep, SPEECH_STEPS } from './helpers.js'

test('能跟讀：一課含 2 題跟讀，依穿插順序走完到完成頁', async ({ page }) => {
  test.setTimeout(120_000)
  await fakeSystemVoice(page)
  await page.addInitScript(() => {
    localStorage.setItem('lg.installDismissed', '1')
    ;(window as unknown as { __lgSpeechConfig: unknown }).__lgSpeechConfig = { mic: 'granted' }
  })
  await page.goto(`/lesson/${LESSON}`)
  await expect(page.getByRole('progressbar', { name: '作答進度' })).toHaveAttribute(
    'aria-valuemax',
    String(SPEECH_STEPS.length),
  )
  // 期望值：fixture 第 11、12 題為跟讀（I have a cup of tea.／We go to the park on Sunday.），
  // 穿插後落在第 10、13 步（8 張單字卡後：聽音打字、跟讀、選擇題｜聽音選答、跟讀、選擇題｜閱讀 2 小題）
  expect(SPEECH_STEPS.length).toBe(16)
  expect(
    SPEECH_STEPS.flatMap((s, i) => (s.shadowing !== undefined ? [[i + 1, s.shadowing]] : [])),
  ).toEqual([
    [10, 'I have a cup of tea.'],
    [13, 'We go to the park on Sunday.'],
  ])
  for (let n = 1; n <= SPEECH_STEPS.length; n++) {
    const s = SPEECH_STEPS[n - 1]
    if (s.shadowing !== undefined) await expect(page.getByText(s.shadowing)).toBeVisible()
    await answerStep(page, n)
  }
  await expect(page.getByTestId('lesson-done')).toBeVisible()
})
