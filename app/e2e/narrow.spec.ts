// 窄螢幕與特大字級（走查 P0／P2）：320 標準、320 特大、375 特大下，單字庫、設定、清除確認、分級測驗不得破版
import { writeFile } from 'node:fs/promises'
import { expect, test, type Page, type TestInfo } from '@playwright/test'
import { measureMobile, overflowingChildren } from './measure.js'
import { answerAll, BANK } from './placementHelpers.js'

const CASES = [
  { name: '320-md', width: 320, height: 640, textSize: null },
  { name: '320-xl', width: 320, height: 640, textSize: 'xl' },
  { name: '375-xl', width: 375, height: 812, textSize: 'xl' },
] as const

async function seedWords(page: Page) {
  await page.waitForFunction(async () =>
    (await indexedDB.databases()).some((d) => d.name === 'linguaapp'),
  )
  await page.evaluate(async () => {
    const db = await new Promise<IDBDatabase>((res, rej) => {
      const r = indexedDB.open('linguaapp')
      r.onsuccess = () => res(r.result)
      r.onerror = () => rej(r.error)
    })
    const tx = db.transaction('wordPool', 'readwrite')
    // jennyx：字典查無此字（s08 查無狀態）
    const words = [
      'internationalization',
      'counterproductive',
      'meeting',
      'agenda',
      'postpone',
      'jennyx',
    ]
    words.forEach((wordId, i) =>
      tx.objectStore('wordPool').put({
        wordId,
        state: 2,
        due: Date.now() + (i * 40 - 1) * 86_400_000,
        stability: 5,
        difficulty: 5,
        scheduledDays: 3,
        learningSteps: 0,
        reps: 2,
        lapses: 0,
        lastReview: null,
        courseRefs: ['a1-u01-l01'], // 有來源才算在池中（TASK-16 D3）
        favoritedAt: i % 2 ? 1 : null,
        addedAt: i,
      }),
    )
    await new Promise((r) => (tx.oncomplete = r))
    db.close()
  })
}

async function check(page: Page, info: TestInfo, name: string) {
  await page.waitForTimeout(300) // 等彈層動畫結束
  const shot = await page.screenshot()
  await info.attach(name, { body: shot, contentType: 'image/png' })
  await writeFile(info.outputPath(`${info.project.name}-${name}.png`), shot)
  const m = await measureMobile(page)
  expect.soft(m.overflow, `${name}：橫向溢出`).toEqual([])
  expect.soft(m.wrapped, `${name}：單行控件折行`).toEqual([])
  expect.soft(m.small, `${name}：可點目標 <44px`).toEqual([])
}

for (const c of CASES) {
  test.describe(c.name, () => {
    test.beforeEach(async ({ page }) => {
      await page.setViewportSize({ width: c.width, height: c.height })
      await page.addInitScript((size) => {
        localStorage.setItem('lg.installDismissed', '1')
        if (size) localStorage.setItem('lg.textSize', size)
      }, c.textSize)
    })

    test('s09 單字庫', async ({ page }, info) => {
      await page.goto('/words')
      await expect(page.getByText('單字庫還是空的')).toBeVisible()
      await seedWords(page)
      await page.reload()
      await expect(page.getByTestId('word-list')).toBeVisible()
      await check(page, info, `${c.name}-s09`)
      // 走查 P0-1b：每一列（含到期標示、分隔線）不得伸出卡片框
      expect(await overflowingChildren(page, '[data-testid="word-card"]'), '列伸出卡片').toEqual([])
    })

    test('s08 字典彈層：查到、已收藏＋提示、查無此字（TASK-16）', async ({ page }, info) => {
      await page.goto('/words')
      await expect(page.getByText('單字庫還是空的')).toBeVisible()
      await seedWords(page)
      await page.reload()
      const dialog = page.getByRole('dialog', { name: '單字查義' })
      await page.getByRole('button', { name: 'postpone', exact: true }).click()
      await expect(dialog.getByRole('heading', { name: 'postpone' })).toBeVisible()
      await check(page, info, `${c.name}-s08-default`)
      expect(await overflowingChildren(page, '[data-testid="dict-sheet"]'), '彈層內容伸出').toEqual(
        [],
      )
      await dialog.getByRole('button', { name: '加入收藏單字庫' }).click()
      await expect(page.getByRole('status').filter({ hasText: '已加入收藏' })).toBeVisible()
      await check(page, info, `${c.name}-s08-saved`)
      expect(await overflowingChildren(page, '[data-testid="dict-sheet"]'), '彈層內容伸出').toEqual(
        [],
      )
      await page.keyboard.press('Escape')
      await page.getByRole('button', { name: 'jennyx', exact: true }).click()
      await expect(dialog.getByText('字典裡沒有這個字（可能是人名或專有名詞）')).toBeVisible()
      await check(page, info, `${c.name}-s08-notfound`)
      expect(await overflowingChildren(page, '[data-testid="dict-sheet"]'), '彈層內容伸出').toEqual(
        [],
      )
    })

    test('s11 設定', async ({ page }, info) => {
      await page.goto('/settings')
      await expect(page.getByTestId('settings-account-slot')).toBeVisible()
      await check(page, info, `${c.name}-s11-top`)
      await page.getByRole('button', { name: '下載語音辨識模型' }).scrollIntoViewIfNeeded()
      await check(page, info, `${c.name}-s11-voice`)
    })

    test('s10 分級測驗：勾選中、結果（勾到假字）、重測、選級距彈層', async ({ page }, info) => {
      // 走兩輪 60 題（作答＋重測）；WebKit 在本機負載高時單輪約 15 秒，預設 30 秒不夠（非 UI 逾時，AC#3 計時另驗）
      test.setTimeout(90_000)
      await page.goto('/placement')
      await expect(page.getByText('第 1／5 組')).toBeVisible()
      // 勾 A1／A2 真字＋第一個假字（級距查已提交題本）
      let pseudo = 0
      const pick = (word: string) =>
        BANK.levels.A1.includes(word) ||
        BANK.levels.A2.includes(word) ||
        (BANK.pseudowords.includes(word) && pseudo++ === 0)
      await answerAll(page, pick, {
        onGroup: async (g) => {
          if (g === 1) await check(page, info, `${c.name}-s10-pick`)
        },
      })
      await expect(page.getByText('勾到 1 個假字，結果已向下修正')).toBeVisible()
      await check(page, info, `${c.name}-s10-result`)
      await page.getByRole('button', { name: '想自己選級距' }).click()
      await expect(page.getByRole('dialog', { name: '目前級距' })).toBeVisible()
      await check(page, info, `${c.name}-s10-levelsheet`)
      await page.keyboard.press('Escape')
      // 重測狀態：全勾
      await page.goto('/placement')
      await answerAll(page, () => true)
      await expect(page.getByRole('button', { name: '重新測驗' })).toBeVisible()
      await check(page, info, `${c.name}-s10-retest`)
    })

    test('s13 清除確認：彈窗在視窗內', async ({ page }, info) => {
      await page.goto('/settings')
      await page.getByRole('button', { name: '清除這支手機上的資料' }).click()
      const dialog = page.getByRole('alertdialog')
      await expect(dialog).toBeVisible()
      await check(page, info, `${c.name}-s13-default`)
      await page.getByText('我了解資料無法復原').click()
      await check(page, info, `${c.name}-s13-checked`)
      const box = (await dialog.boundingBox())!
      expect(box.y, '彈窗頂端超出視窗').toBeGreaterThanOrEqual(0)
      expect(box.y + box.height, '彈窗底端超出視窗').toBeLessThanOrEqual(c.height)
    })
  })
}

// 走查 P2：特大字級＋清除失敗（多一行錯誤）時，彈窗仍在視窗內、內容可捲。
// 用 320×480：錯誤文案改短後 320×640 已放得下，矮螢幕才驗得出限高與捲動（反證：拿掉 max-h 會紅）
test('320×480 特大：清除失敗時彈窗不超出視窗、錯誤訊息可見', async ({ page }, info) => {
  await page.setViewportSize({ width: 320, height: 480 })
  await page.addInitScript(() => {
    localStorage.setItem('lg.installDismissed', '1')
    localStorage.setItem('lg.textSize', 'xl')
    // 讓刪庫請求失敗（模擬資料庫被其他分頁佔用等）
    indexedDB.deleteDatabase = () => {
      const req = {} as IDBOpenDBRequest
      setTimeout(() => {
        Object.defineProperty(req, 'error', { value: new DOMException('mock', 'UnknownError') })
        // Dexie 從 event.target.error 取錯誤
        const ev = new Event('error')
        Object.defineProperty(ev, 'target', { value: req })
        req.onerror?.(ev)
      })
      return req
    }
  })
  await page.goto('/settings')
  await page.getByRole('button', { name: '清除這支手機上的資料' }).click()
  await page.getByText('我了解資料無法復原').click()
  await page.getByRole('button', { name: '清除資料' }).click()
  const alert = page.getByRole('alert')
  await expect(alert).toHaveText('清除失敗，請關閉其他分頁後再試一次')
  await check(page, info, '320-xl-s13-failed')
  const dialog = page.getByRole('alertdialog')
  const box = (await dialog.boundingBox())!
  expect(box.y).toBeGreaterThanOrEqual(0)
  expect(box.y + box.height).toBeLessThanOrEqual(480)
  // 內容超過時可在彈窗內捲到最底的按鈕
  await page.getByRole('button', { name: '清除資料' }).scrollIntoViewIfNeeded()
  await expect(page.getByRole('button', { name: '清除資料' })).toBeInViewport()
})

// 走查 P2：「用 OpenRouter 帳號一鍵授權」在 320 標準字級折行時不留孤字，左右內距與主要按鈕一致（≥16px）
test('320 標準：OpenRouter 主鈕折行不留孤字、左右內距 ≥16px', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 640 })
  await page.addInitScript(() => localStorage.setItem('lg.installDismissed', '1'))
  await page.goto('/settings')
  const btn = page.getByRole('button', { name: '用 OpenRouter 帳號一鍵授權' })
  await expect(btn).toBeVisible()
  const m = await btn.evaluate((el) => {
    const r = el.getBoundingClientRect()
    const tw = document.createTreeWalker(el, NodeFilter.SHOW_TEXT)
    const rects: DOMRect[] = []
    for (let n = tw.nextNode(); n; n = tw.nextNode()) {
      if (!n.textContent?.trim()) continue
      const range = document.createRange()
      range.selectNodeContents(n)
      rects.push(...[...range.getClientRects()].filter((x) => x.width > 0))
    }
    // 依行（top）彙總每行的左右界
    const lines = new Map<number, { left: number; right: number }>()
    for (const x of rects) {
      const key = [...lines.keys()].find((k) => Math.abs(k - x.top) < 8) ?? x.top
      const cur = lines.get(key)
      lines.set(key, {
        left: Math.min(cur?.left ?? x.left, x.left),
        right: Math.max(cur?.right ?? x.right, x.right),
      })
    }
    const ls = [...lines.entries()].sort((a, b) => a[0] - b[0]).map(([, v]) => v)
    return {
      widths: ls.map((l) => l.right - l.left),
      gapLeft: Math.min(...ls.map((l) => l.left)) - r.left,
      gapRight: r.right - Math.max(...ls.map((l) => l.right)),
      padLeft: parseFloat(getComputedStyle(el).paddingLeft),
      padRight: parseFloat(getComputedStyle(el).paddingRight),
    }
  })
  expect(m.padLeft, '左內距').toBeGreaterThanOrEqual(16)
  expect(m.padRight, '右內距').toBeGreaterThanOrEqual(16)
  expect(m.gapRight, '文字到右框').toBeGreaterThanOrEqual(16)
  if (m.widths.length > 1) {
    const last = m.widths.at(-1)!
    // 最後一行至少是第一行的 40% 寬（「權」一個字約 17px，第一行約 230px）
    expect(
      last / m.widths[0],
      `孤字：各行寬 ${m.widths.map((w) => w.toFixed(0)).join('/')}`,
    ).toBeGreaterThanOrEqual(0.4)
  }
})
