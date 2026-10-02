// TASK-13 AC#1 後半：chromium 模擬下 Kokoro 實際合成一句成功（真模型、真 WebGPU；本機選用、不進 CI）。
// 流程照使用者路徑：設定頁下載高音質發音（下載前告知）→ 已下載 → 進聽題按播放 → 合成出音檔、沒有退回內建聲音。
// 模型快取：瀏覽器用 gitignored 的 app/.tts-model-cache/profile 當持久設定檔，transformers.js 存進它的 Cache Storage，
// 第二次起不再下載。不用 route 攔截轉送：把 311MB 的模型主檔經 Playwright 協定回給頁面會讓瀏覽器崩潰（實測）
import { writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { chromium, devices, expect, test } from '@playwright/test'
import { LESSON, playTo } from '../e2e/lesson.js'
import { fakeSystemVoice, spokenList } from '../e2e/speech.js'

const PROFILE = resolve(import.meta.dirname, '../.tts-model-cache/profile')
const SENTENCE = 'The book is in the bag.'

test('Kokoro 實際合成一句：下載 → 已下載 → 聽題播放出高音質音檔', async ({ baseURL }, info) => {
  const context = await chromium.launchPersistentContext(PROFILE, {
    ...devices['Pixel 7'],
    baseURL,
    channel: 'chromium',
    args: ['--enable-unsafe-webgpu', '--autoplay-policy=no-user-gesture-required'],
    // Service Worker 會接手請求；本測試只驗合成
    serviceWorkers: 'block',
  })
  try {
    const page = context.pages()[0] ?? (await context.newPage())
    const hosts = new Set<string>()
    page.on('request', (r) => hosts.add(new URL(r.url()).host))
    context.on('request', (r) => hosts.add(new URL(r.url()).host))
    await page.addInitScript(() => localStorage.setItem('lg.installDismissed', '1'))
    await fakeSystemVoice(page)

    // 1. 設定頁：這台 chromium 必須有 WebGPU（沒有就是環境不符，不是 App 的錯）
    await page.goto('/settings')
    const download = page.getByRole('button', { name: '下載高音質發音（選配）' })
    const done = page.getByText('已下載')
    await expect(
      download.or(done).or(page.getByText('這支手機不支援高音質發音')).first(),
    ).toBeVisible()
    expect(
      await page.getByText('這支手機不支援高音質發音').count(),
      '這台機器的 chromium 沒有 WebGPU，無法驗真模型',
    ).toBe(0)

    // 2. 下載前告知 → 下載 → 已下載（設定檔裡已有模型就略過下載，記錄為快取命中）
    const alreadyCached = (await download.count()) === 0
    const t0 = Date.now()
    if (!alreadyCached) {
      await download.click()
      const dialog = page.getByRole('alertdialog')
      await expect(dialog).toContainText('約 310MB')
      await dialog.getByRole('button', { name: '下載', exact: true }).click()
      await expect(done).toBeVisible({ timeout: 15 * 60_000 })
    }
    const downloadMs = Date.now() - t0
    await expect(page.getByRole('button', { name: /^發音\s*高音質發音$/ })).toBeVisible()

    // 3. 聽題播放：合成出音檔（存進 lg-tts-audio 快取）、沒有退回內建聲音
    // 持久設定檔會留下上次的音檔快取與小課進度：先清掉，這次一定從第 1 題、重新合成
    await page.evaluate(
      (lessonId) =>
        Promise.all([
          caches.delete('lg-tts-audio'),
          new Promise<void>((done, fail) => {
            const open = indexedDB.open('linguaapp')
            open.onerror = () => fail(open.error)
            open.onsuccess = () => {
              const tx = open.result.transaction('lessonRuns', 'readwrite')
              tx.objectStore('lessonRuns').delete(lessonId)
              tx.oncomplete = () => done()
              tx.onerror = () => fail(tx.error)
            }
          }),
        ]),
      LESSON,
    )
    await page.goto(`/lesson/${LESSON}`)
    await playTo(page, 9)
    const t1 = Date.now()
    await page.getByRole('button', { name: '播放', exact: true }).click()
    const key = `${new URL(page.url()).origin}/__tts-audio/${encodeURIComponent(`1|${SENTENCE}`)}`
    // WAV 標頭：0–3＝RIFF、28–31＝每秒位元組數；資料區從第 44 位元組起
    const readWav = () =>
      page.evaluate(async (k) => {
        const hit = await (await caches.open('lg-tts-audio')).match(k)
        if (!hit) return null
        const b = new Uint8Array(await hit.arrayBuffer())
        const byteRate = new DataView(b.buffer).getUint32(28, true)
        return {
          tag: String.fromCharCode(...b.slice(0, 4)),
          bytes: b.length,
          seconds: (b.length - 44) / byteRate,
        }
      }, key)
    await expect.poll(readWav, { timeout: 5 * 60_000, intervals: [500] }).not.toBeNull()
    const synthMs = Date.now() - t1
    const wav = (await readWav())!

    expect(wav.tag).toBe('RIFF')
    // 「The book is in the bag.」約 1.5–2.5 秒；過短代表沒合成出聲音
    expect(wav.seconds).toBeGreaterThan(0.8)
    expect(wav.seconds).toBeLessThan(6)
    await expect(page.getByTestId('hq-failed')).toHaveCount(0)
    expect(await spokenList(page)).toEqual([])

    const evidence = {
      sentence: SENTENCE,
      alreadyCached,
      downloadMs,
      synthMs,
      wav,
      hosts: [...hosts].sort(),
      device:
        'chromium（Playwright channel: chromium，Pixel 7 模擬，--enable-unsafe-webgpu，持久設定檔），vite preview',
    }
    await info.attach('evidence', {
      body: JSON.stringify(evidence, null, 2),
      contentType: 'application/json',
    })
    await writeFile(info.outputPath('kokoro-real-evidence.json'), JSON.stringify(evidence, null, 2))
  } finally {
    await context.close()
  }
})
