// 英文標點斷行：EnglishText 把單字包成按鈕（atomic inline）後，字與緊鄰標點之間不得折行。
// jsdom 不排版，這裡用真引擎逐字量測；掃寬度讓每個標點都有機會碰到行尾。題目經路由換成邊界句，元件仍是正式的那一份
import { expect, test, type Page } from '@playwright/test'
import { readFixture } from './lesson.js'
import { fakeSystemVoice } from './speech.js'

test.use({ serviceWorkers: 'block' })

const ORIGINAL = (
  readFixture('a1-u01-l03').items.find((i) => i.type === 'reading') as unknown as {
    passageEn: string
  }
).passageEn

// 連字號、撇號、引號、括號、省略號、word,word、數字
const EDGE =
  'Every Saturday, they go (to the park) at "nine," he said. Don\'t stop; it\'s well-known: wait... ' +
  'really? Yes! red,green,blue and/or so,on; \'single\' "double" “curly” ‘quote’ [box] {set} ' +
  "mother-in-law's rock-and-roll dogs' 5-day 3rd 9:30pm $20, 100%, no. 7. wait—now to–from end… " +
  '...begin (5 cats), (cats 5).'
const LONG =
  'See internationalization, (counterproductive) "uncharacteristically," and supercalifragilisticexpialidocious.'

// 行首不可出現的標點；「...begin」是字前的省略號，跟著後面的字在行首是對的
const CLOSING = /^(?!\.\.\.[A-Za-z])[,.;:!?)\]}”’…%—–/-]/
const OPENING = /[([{“‘]$/

async function openReading(page: Page, passage: string, textSize?: 'xl') {
  await page.addInitScript((size) => {
    localStorage.setItem('lg.installDismissed', '1')
    if (size) localStorage.setItem('lg.textSize', size)
  }, textSize)
  await fakeSystemVoice(page)
  await page.route(/huggingface\.co|jsdelivr\.net|openrouter\.ai|supabase/, (r) => r.abort())
  await page.route(/a1-u01-l03[^/]*\.json/, async (route) => {
    const doc = await (await route.fetch()).json()
    for (const it of doc.items) if (it.type === 'reading') it.passageEn = passage
    await route.fulfill({ json: doc })
  })
  await page.goto('/lesson/demo?type=reading')
  await expect(page.locator('[data-en-word]').first()).toBeVisible()
}

/** 逐字取排版行（只看可見字元）；新行＝top 跳超過字級 0.6 倍 */
const layout = (page: Page) =>
  page.evaluate(() => {
    const root = document.querySelector('[lang=en]') as HTMLElement
    const fontSize = parseFloat(getComputedStyle(root).fontSize)
    const chars: { c: string; top: number; right: number }[] = []
    const tw = document.createTreeWalker(root, NodeFilter.SHOW_TEXT)
    for (let n = tw.nextNode(); n; n = tw.nextNode()) {
      const s = n.textContent ?? ''
      for (let i = 0; i < s.length; i++) {
        if (/\s/.test(s[i])) continue
        const r = document.createRange()
        r.setStart(n, i)
        r.setEnd(n, i + 1)
        const b = r.getBoundingClientRect()
        chars.push({ c: s[i], top: b.top, right: b.right })
      }
    }
    const lines: string[] = []
    let prev = -Infinity
    for (const { c, top } of chars) {
      if (top - prev > fontSize * 0.6) lines.push('')
      lines[lines.length - 1] += c
      prev = top
    }
    const card = root.parentElement as HTMLElement
    const contentRight =
      card.getBoundingClientRect().right - parseFloat(getComputedStyle(card).paddingRight)
    return {
      text: root.textContent ?? '',
      lines,
      // 字元伸出卡片內容區、卡片內橫捲、整頁橫捲，取最大
      overflow: Math.max(
        Math.max(...chars.map((c) => c.right)) - contentRight,
        card.scrollWidth - card.clientWidth,
        document.documentElement.scrollWidth - document.documentElement.clientWidth,
      ),
      words: [...root.querySelectorAll('[data-en-word]')].map((b) => b.textContent ?? ''),
    }
  })

async function sweep(page: Page, from: number, to: number) {
  const bad: string[] = []
  for (let w = from; w <= to; w += 2) {
    await page.setViewportSize({ width: w, height: 800 })
    const { lines, overflow } = await layout(page)
    lines.forEach((l, i) => {
      if (i > 0 && CLOSING.test(l)) bad.push(`${w}px 行首標點「${l.slice(0, 12)}」`)
      if (OPENING.test(l)) bad.push(`${w}px 行尾開標點「${l.slice(-12)}」`)
    })
    if (overflow > 0.5) bad.push(`${w}px 溢出 +${overflow.toFixed(1)}`)
  }
  return bad
}

for (const [name, passage] of [
  ['原短文', ORIGINAL],
  ['邊界句', EDGE],
] as const) {
  for (const size of [undefined, 'xl'] as const) {
    test(`${name}（字級 ${size ?? '標準'}）320–430 每個寬度行首都沒有標點、不溢出`, async ({
      page,
    }) => {
      await openReading(page, passage, size)
      expect(await sweep(page, 320, 430)).toEqual([])
    })
  }
}

test('長字（特大字級、窄螢幕）：不溢出、標點不獨立成行', async ({ page }) => {
  await openReading(page, LONG, 'xl')
  expect(await sweep(page, 280, 430)).toEqual([])
})

test('文字內容不變；只有單字可點，標點不在按鈕內', async ({ page }) => {
  await openReading(page, EDGE)
  const { text, words } = await layout(page)
  expect(text).toBe(EDGE)
  expect(words.filter((w) => /[^A-Za-z'’-]/.test(w))).toEqual([])
  await expect(page.getByRole('button', { name: 'Saturday', exact: true })).toHaveText('Saturday')
})

test('點字開字典；點緊鄰的標點不開', async ({ page }) => {
  await openReading(page, ORIGINAL)
  const sat = page.getByRole('button', { name: 'Saturday', exact: true })
  const box = (await sat.boundingBox())!
  await page.mouse.click(box.x + box.width + 2, box.y + box.height / 2)
  await expect(page.getByRole('dialog', { name: '單字查義' })).toHaveCount(0)
  await sat.click()
  await expect(page.getByRole('dialog', { name: '單字查義' })).toBeVisible()
})
