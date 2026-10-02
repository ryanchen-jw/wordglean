// 小課 e2e 共用：E2E 建置的題目來源＝樣本課 fixture（VITE_ITEM_FIXTURES，見 playwright.config.ts）
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { expect, type Page } from '@playwright/test'

export const LESSON = 'a1-u01-l01'

interface Pick {
  /** [正解, 錯誤選項…]（選項文字） */
  options: string[]
  check: boolean
  /** 聽音打字：正解要打的句子（答錯時改打 WRONG_TYPED） */
  typed?: string
  /** 跟讀（stt＝true 時才在佇列裡）：目標句 */
  shadowing?: string
  /** 寫作題（TASK-15，e2e 沒有金鑰→對照參考答案自評）：要寫的句子（參考答案第一句） */
  write?: string
}

export const WRONG_TYPED = 'x'

interface FixtureDoc {
  items: {
    type: string
    word?: string
    sentenceEn?: string
    glossZh?: string
    distractorsZh?: string[]
    options?: string[]
    answer?: number
    questions?: { options: string[]; answer: number }[]
    referenceEn?: string[]
  }[]
}

export const readFixture = (lessonId: string) =>
  JSON.parse(
    readFileSync(
      resolve(import.meta.dirname, '../src/lesson/fixtures/items', `${lessonId}.json`),
      'utf-8',
    ),
  ) as FixtureDoc

const rest = (opts: string[], answer: number) => [
  opts[answer],
  ...opts.filter((_, i) => i !== answer),
]

// 依題目檔算出每一步的正解與錯誤選項；與引擎無關（直接讀 fixture）。
// 出題順序照 TASK-18 穿插規則：單字卡在前，其餘聽→說→讀→寫每輪各出一題；
// 能力替代（capabilities.ts）：stt＝false（不能跟讀）時跟讀換成聽音打字；tts＝false（手機不能播音）時聽類題整題略過。
// e2e 主套件建置固定 STT 不可用（playwright.config 的 VITE_E2E_STT=off），所以預設 stt＝false；跟讀在 e2e-speech 驗
export const stepsOf = (lessonId: string, { tts = true, stt = false } = {}): Pick[] => {
  const items = readFixture(lessonId).items.map((it) =>
    it.type === 'shadowing' && !stt ? { ...it, type: 'listenType' } : it,
  )
  const toSteps = (it: FixtureDoc['items'][number]): Pick[] => {
    if (it.type === 'wordCard')
      // 選項只顯示第一義（全形分號前一段、去括號註記）
      return [
        {
          options: [it.glossZh!, ...it.distractorsZh!].map((g) =>
            g.split('；')[0].replace(/（[^）]*）/g, ''),
          ),
          check: false,
        },
      ]
    if (it.type === 'mcq' || it.type === 'listenChoice')
      return [{ options: rest(it.options!, it.answer!), check: true }]
    if (it.type === 'listenType') return [{ options: [], check: true, typed: it.sentenceEn! }]
    if (it.type === 'shadowing') return [{ options: [], check: false, shadowing: it.sentenceEn! }]
    if (it.type === 'reading')
      return it.questions!.map((q) => ({ options: rest(q.options, q.answer), check: true }))
    if (it.type === 'translate' || it.type === 'makeSentence')
      return [{ options: [], check: false, write: it.referenceEn![0] }]
    return []
  }
  const groups = [
    tts ? ['listenType', 'listenChoice'] : [],
    ['shadowing'],
    ['mcq', 'reading'],
    ['translate', 'makeSentence'],
  ].map((types) => items.filter((it) => types.includes(it.type)))
  const out = items.filter((it) => it.type === 'wordCard').flatMap(toSteps)
  for (let round = 0; groups.some((g) => round < g.length); round++)
    for (const g of groups) if (round < g.length) out.push(...toSteps(g[round]))
  return out
}

/** 聽類題在內（lesson／lesson-visual 以 e2e/speech.ts 替身保證可播音） */
export const STEPS: Pick[] = stepsOf(LESSON)

/** 寫作題在全課的題號（從 1 起；依穿插順序，中翻英在前、造句在後） */
export const WRITE_STEPS: number[] = STEPS.flatMap((s, i) => (s.write !== undefined ? [i + 1] : []))

export const count = (page: Page, n: number) =>
  expect(page.getByText(`${n}／${STEPS.length}`, { exact: true })).toBeVisible()

// 寫作題自評按鈕按下即進下一題；之後那一次 next() 不再按「繼續」
let advanced = false

/**
 * 作答第 n 題（從 1 起）；wrong＝選第一個錯誤選項。不按「繼續」。
 * 寫作題：寫參考答案送出 → 沒有金鑰的自評畫面 → 按「我寫對了」（wrong＝「我寫錯了」），會直接進下一題
 */
export async function answer(page: Page, n: number, wrong = false) {
  await count(page, n)
  const s = STEPS[n - 1]
  if (s.write !== undefined) {
    await page.getByRole('textbox', { name: '你的句子' }).fill(s.write)
    await page.getByRole('button', { name: '送出批改' }).click()
    await expect(page.getByText('跟參考答案比一比，意思一樣嗎？')).toBeVisible()
    await page.getByRole('button', { name: wrong ? '我寫錯了' : '我寫對了' }).click()
    advanced = true
    return
  }
  if (s.typed !== undefined)
    await page
      .getByRole('textbox', { name: '把聽到的英文打在這裡' })
      .fill(wrong ? WRONG_TYPED : s.typed)
  else await page.getByRole('radio', { name: s.options[wrong ? 1 : 0], exact: true }).click()
  if (s.check) await page.getByRole('button', { name: '檢查' }).click()
  await expect(page.getByRole('status').filter({ has: page.locator('strong') })).toBeVisible()
}

export async function next(page: Page) {
  if (advanced) {
    advanced = false
    return
  }
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
