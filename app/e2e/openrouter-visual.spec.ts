// TASK-15 視覺 smoke（harness 06）：s06 寫作四態（作答／AI 批改／沒有金鑰／批改失敗）、s11 AI 批改區
// （預設／已連結／貼金鑰錯誤／模型清單／解除確認），兩個手機引擎＋320 特大字級。
// 每個狀態截圖 attach＋具名檔存 test-results/（gitignored），斷言 06 三件套＋英文介面字串＋body 色＋卡片內子元素不溢出。
// 資料：樣本課 fixture 的寫作題原文；批改結果與模型清單由假端點回（mock 值＝設計 s06 例句的長度量級）
import { writeFile } from 'node:fs/promises'
import { expect, test, type Page, type TestInfo } from '@playwright/test'
import { answer, LESSON, next, playTo, WRITE_STEPS } from './lesson.js'
import { measureMobile, overflowingChildren } from './measure.js'
import { fakeOpenRouter, FAKE_KEY, gradeOk, type FakeOpenRouter } from './openrouter.js'
import { fakeSystemVoice } from './speech.js'

test.use({ serviceWorkers: 'block' })

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
  // 彈層開著時 main 裡的固定定位遮罩以視窗為準、不屬於卡片，改量彈層內容（清單、確認框）
  const modal = (await page.locator('[aria-modal="true"]').count()) > 0
  const sels = modal ? ['[role="listbox"]', '[role="alertdialog"]'] : ['main', '[role="alert"]']
  for (const sel of sels)
    if (await page.locator(sel).count())
      expect.soft(await overflowingChildren(page, sel), `${name}：${sel} 子元素溢出`).toEqual([])
}

// 設計 s06 的例句長度量級；說明兩點
const AI_RESULT = {
  isCorrect: false,
  corrected: 'I have an apple and a banana.',
  errors: [
    {
      original: 'a apple',
      corrected: 'an apple',
      explanationZh: 'apple 是母音開頭，前面要用 an，不用 a。',
    },
  ],
  explanationZh: '可數名詞單數前要加 a 或 an；看後面那個字的發音決定。',
  levelOk: true,
}

async function link(page: Page) {
  await page.goto('/openrouter')
  await page.getByLabel('金鑰').fill(FAKE_KEY)
  await page.getByRole('button', { name: '驗證並儲存' }).click()
  await expect(page.getByText('已連結')).toBeVisible()
}

async function toWriting(page: Page) {
  await page.goto(`/lesson/${LESSON}`)
  await playTo(page, WRITE_STEPS[0])
  await expect(page.getByText('中翻英')).toBeVisible()
}

async function submit(page: Page, text = 'I have a apple and a banana.') {
  await page.getByRole('textbox', { name: '你的句子' }).fill(text)
  await page.getByRole('button', { name: '送出批改' }).click()
}

let fake: FakeOpenRouter
test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('lg.installDismissed', '1'))
  // 聽類題要能播音才出（TASK-18 能力偵測）；固定用替身，題號才與 e2e/lesson.ts stepsOf 一致
  await fakeSystemVoice(page)
  fake = await fakeOpenRouter(page)
})

test('s06 寫：作答中／沒有金鑰（降級）', async ({ page }, info) => {
  test.setTimeout(90_000)
  await toWriting(page)
  await page.getByRole('textbox', { name: '你的句子' }).fill('I have a apple and a banana.')
  await check(page, info, 's06-input')
  await page.getByRole('button', { name: '送出批改' }).click()
  await expect(page.getByText('跟參考答案比一比，意思一樣嗎？')).toBeVisible()
  await check(page, info, 's06-nokey')
})

test('s06 寫：AI 批改結果／批改失敗（額度用完）', async ({ page }, info) => {
  test.setTimeout(90_000)
  fake.grades = [
    gradeOk(AI_RESULT),
    {
      status: 429,
      body: { error: { code: 429, message: 'Rate limit exceeded: free-models-per-day' } },
    },
  ]
  await link(page)
  await toWriting(page)
  await submit(page)
  await expect(page.getByText('建議寫法')).toBeVisible()
  await check(page, info, 's06-ai')
  await page.getByRole('button', { name: '我懂了，繼續' }).click()
  for (let n = WRITE_STEPS[0] + 1; n < WRITE_STEPS[1]; n++) {
    await answer(page, n)
    await next(page)
  }
  await expect(page.getByText('造句')).toBeVisible()
  await submit(page, 'The pen is on the desk.')
  await expect(page.getByRole('alert')).toBeVisible()
  await check(page, info, 's06-fail')
})

test('s11 設定 AI 區：預設／已連結／模型清單／解除確認／貼金鑰錯誤', async ({ page }, info) => {
  await page.goto('/settings')
  await expect(page.getByText('狀態：未設定')).toBeVisible()
  await check(page, info, 's11-ai-default')
  await page.goto('/openrouter')
  await page.getByLabel('金鑰').fill('sk-or-v1-3f9a')
  await page.getByRole('button', { name: '驗證並儲存' }).click()
  await expect(page.getByRole('alert')).toBeVisible()
  await check(page, info, 's11-keyerr')
  await page.getByLabel('金鑰').fill(FAKE_KEY)
  await page.getByRole('button', { name: '驗證並儲存' }).click()
  await expect(page.getByText('今日免費額度剩 37 次')).toBeVisible()
  await check(page, info, 's11-linked')
  await page.getByRole('button', { name: /模型\s*免費模型/ }).click()
  await expect(page.getByRole('listbox', { name: '模型' })).toBeVisible()
  // 模型名稱是服務方英文名（lang="en"），英文字串掃描照常
  await check(page, info, 's11-model-sheet')
  await page.keyboard.press('Escape')
  await page.getByRole('button', { name: '解除連結' }).click()
  await expect(page.getByRole('alertdialog')).toBeVisible()
  await check(page, info, 's11-unlink-confirm')
})

// 結果畫面最上方是原題卡（創辦人試用 2026-10-05）；內容超過一屏時 main 捲到頂看得到整張原題、捲到底看得到最後一張卡
async function scrollsWhole(page: Page, name: string, zh: string) {
  const main = page.locator('main')
  await expect(main.locator(':scope > :first-child')).toContainText(zh)
  const r = await main.evaluate((m) => {
    const box = () => m.getBoundingClientRect()
    m.scrollTop = 0
    const first = m.firstElementChild!.getBoundingClientRect()
    const top = first.top >= box().top - 1
    m.scrollTop = m.scrollHeight
    const last = m.lastElementChild!.getBoundingClientRect()
    const bottom = last.bottom <= box().bottom + 1
    m.scrollTop = 0
    return { top, bottom, scrolls: m.scrollHeight > m.clientHeight }
  })
  expect.soft(r.top, `${name}：捲到頂原題卡不被截斷`).toBe(true)
  expect.soft(r.bottom, `${name}：捲到底最後一張卡不被截斷`).toBe(true)
  return r.scrolls
}

test.describe('320 特大字級', () => {
  test.use({ viewport: { width: 320, height: 640 } })

  test('s06 三種結果畫面：原題在最上方、捲動後內容不被截斷', async ({ page }, info) => {
    test.setTimeout(120_000)
    await page.addInitScript(() => localStorage.setItem('lg.textSize', 'xl'))
    // 沒有金鑰：自評
    await toWriting(page)
    await submit(page)
    await expect(page.getByText('跟參考答案比一比，意思一樣嗎？')).toBeVisible()
    await check(page, info, '320-xl-s06-nokey-question', false)
    const scrolled = [await scrollsWhole(page, 'nokey', '我有一個蘋果和一根香蕉。')]

    // AI 批改結果（小課進度已存：重開接續在第一題寫作題）
    fake.grades = [
      gradeOk(AI_RESULT),
      {
        status: 429,
        body: { error: { code: 429, message: 'Rate limit exceeded: free-models-per-day' } },
      },
    ]
    await link(page)
    await page.goto(`/lesson/${LESSON}`)
    await submit(page)
    await expect(page.getByText('建議寫法')).toBeVisible()
    await check(page, info, '320-xl-s06-ai-question', false)
    scrolled.push(await scrollsWhole(page, 'ai', '我有一個蘋果和一根香蕉。'))

    // 批改失敗
    await page.getByRole('button', { name: '我懂了，繼續' }).click()
    for (let n = WRITE_STEPS[0] + 1; n < WRITE_STEPS[1]; n++) {
      await answer(page, n)
      await next(page)
    }
    await submit(page, 'The pen is on the desk.')
    await expect(page.getByRole('alert')).toBeVisible()
    await check(page, info, '320-xl-s06-fail-question', false)
    scrolled.push(
      await scrollsWhole(page, 'fail', '用 the 造一個句子，說說房間裡的一樣東西在哪裡。'),
    )
    // 320 特大字級下三種結果都超過一屏，捲動斷言才有意義
    expect(scrolled).toEqual([true, true, true])
  })

  test('s06 AI 批改／沒有金鑰、s11 已連結與貼金鑰錯誤不破版', async ({ page }, info) => {
    test.setTimeout(120_000)
    await page.addInitScript(() => localStorage.setItem('lg.textSize', 'xl'))
    await toWriting(page)
    await submit(page)
    await expect(page.getByText('跟參考答案比一比，意思一樣嗎？')).toBeVisible()
    await check(page, info, '320-xl-s06-nokey', false)

    fake.grades = [gradeOk(AI_RESULT)]
    await link(page)
    await check(page, info, '320-xl-s11-linked', false)
    // 小課進度已存：重開接續在第一題寫作題（剛才只送出、還沒自評）
    await page.goto(`/lesson/${LESSON}`)
    await expect(page.getByText('中翻英')).toBeVisible()
    await page.getByRole('textbox', { name: '你的句子' }).fill('I have a apple and a banana.')
    await check(page, info, '320-xl-s06-input', false)
    await page.getByRole('button', { name: '送出批改' }).click()
    await expect(page.getByText('建議寫法')).toBeVisible()
    await check(page, info, '320-xl-s06-ai', false)

    await page.goto('/openrouter')
    await page.getByLabel('金鑰').fill('not-a-key')
    await page.getByRole('button', { name: '驗證並儲存' }).click()
    await expect(page.getByRole('alert')).toBeVisible()
    await check(page, info, '320-xl-s11-keyerr', false)
  })
})

test.describe('深色', () => {
  test.use({ colorScheme: 'dark' })

  test('s06 AI 批改、s11 已連結（深色）', async ({ page }, info) => {
    test.setTimeout(90_000)
    fake.grades = [gradeOk(AI_RESULT)]
    await link(page)
    await check(page, info, 'dark-s11-linked')
    await toWriting(page)
    await submit(page)
    await expect(page.getByText('建議寫法')).toBeVisible()
    await check(page, info, 'dark-s06-ai')
  })
})
