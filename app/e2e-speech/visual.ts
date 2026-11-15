// 跟讀視覺 smoke 共用（speech-visual、live-shadowing）：開到第一題跟讀、截圖＋06 三件套、token 色比對、操作假辨識
import { writeFile } from 'node:fs/promises'
import { expect, type Locator, type Page, type TestInfo } from '@playwright/test'
import { LESSON } from '../e2e/lesson.js'
import { measureMobile, overflowingChildren } from '../e2e/measure.js'
import { fakeSystemVoice } from '../e2e/speech.js'
import { toShadowing } from './helpers.js'
// 與 src/speech/e2eSpeech.ts 的 E2eSpeechConfig 同形（e2e 的 tsconfig 不編 src）
export interface E2eSpeechConfig {
  model?: string
  mic?: 'granted' | 'prompt' | 'denied' | 'unsupported'
  heard?: string[]
  hold?: boolean
  wasm?: boolean
  webSpeech?: boolean
  live?: string[]
  liveHold?: boolean
  liveMic?: boolean
}

export async function check(page: Page, info: TestInfo, name: string, strict = true) {
  await page.waitForTimeout(300) // 等回饋動畫結束
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
  for (const sel of ['main', '[role="status"]', '[role="alertdialog"]'])
    if (await page.locator(sel).count())
      expect.soft(await overflowingChildren(page, sel), `${name}：${sel} 子元素溢出`).toEqual([])
}

/** token 的實際顏色（rgb 字串） */
export const token = (page: Page, name: string) =>
  page.evaluate((n) => {
    const probe = document.createElement('div')
    probe.style.color = `var(${n})`
    document.body.append(probe)
    const c = getComputedStyle(probe).color
    probe.remove()
    return c
  }, name)

const style = (l: Locator, prop: 'backgroundColor' | 'color' | 'borderTopColor') =>
  l.evaluate((el, p) => getComputedStyle(el)[p], prop)

export async function expectColor(
  page: Page,
  l: Locator,
  prop: 'backgroundColor' | 'color' | 'borderTopColor',
  name: string,
) {
  expect(await style(l, prop), `${prop} 應為 ${name}`).toBe(await token(page, name))
}

export async function open(page: Page, cfg: E2eSpeechConfig, theme: 'light' | 'dark' = 'light') {
  await fakeSystemVoice(page)
  await page.addInitScript(
    ([c, th]) => {
      localStorage.setItem('lg.installDismissed', '1')
      localStorage.setItem('lg.theme', th as string)
      ;(window as unknown as { __lgSpeechConfig: unknown }).__lgSpeechConfig = c
    },
    [cfg, theme] as const,
  )
  // 即時跟讀的 20 秒退路、60 秒上限以 page.clock 快轉
  await page.clock.install()
  await page.goto(`/lesson/${LESSON}`)
  await toShadowing(page)
  await expect(page.getByText('跟讀', { exact: true })).toBeVisible()
}

export const speech = (page: Page, fn: string, arg?: unknown) =>
  page.evaluate(
    ([f, a]) =>
      (window as unknown as { __lgSpeech: Record<string, (x?: unknown) => void> }).__lgSpeech[
        f as string
      ](a),
    [fn, arg] as const,
  )
