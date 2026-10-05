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
  // 穿插後落在第 12、16 步（8 張單字卡、每 4 張後一題配對（ca42edf）共 10 步後：聽音打字、跟讀、選擇題、中翻英｜
  // 聽音選答、跟讀、選擇題、造句｜閱讀 2 小題）
  expect(SPEECH_STEPS.length).toBe(20)
  expect(
    SPEECH_STEPS.flatMap((s, i) => (s.shadowing !== undefined ? [[i + 1, s.shadowing]] : [])),
  ).toEqual([
    [12, 'I have a cup of tea.'],
    [16, 'We go to the park on Sunday.'],
  ])
  for (let n = 1; n <= SPEECH_STEPS.length; n++) {
    const s = SPEECH_STEPS[n - 1]
    if (s.shadowing !== undefined) await expect(page.getByText(s.shadowing)).toBeVisible()
    await answerStep(page, n)
  }
  // 錯題重做（創辦人試用 2026-10-04 ⑤）：跳過＝首答算錯，兩題跟讀依原順序再出一輪；重做中再跳過就不再出，進完成頁
  await expect(page.getByText('再練一次錯題')).toBeVisible()
  for (const [i, sentence] of ['I have a cup of tea.', 'We go to the park on Sunday.'].entries()) {
    await expect(page.getByText(`${i + 1}／2`, { exact: true })).toBeVisible()
    await expect(page.getByText(sentence)).toBeVisible()
    await page.getByRole('button', { name: /跳過/ }).click()
  }
  await expect(page.getByTestId('lesson-done')).toBeVisible()
})
