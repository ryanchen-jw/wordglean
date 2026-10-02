// TASK-14 真模型整合測試（只跑 chromium-stt-real；第一次會自 Hugging Face 下載約 52MB 模型）
// AC#4：小課跟讀題按「下載」→ 假麥克風（播放 LibriSpeech 0007）錄音 → 本機轉文字；錄音開始到出現辨識結果之間沒有任何網路請求，
//       整個測試期間也沒有任何帶內容的上傳（POST／PUT 或 request body）
// AC#2：以真模型辨識 10 句 LibriSpeech 預錄音檔，逐字正確率寫入 test-results 與報告附件
import { readFileSync } from 'node:fs'
import { writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { expect, test, type Request } from '@playwright/test'
import { compareWords } from '../src/speech/align.js'
import { LESSON } from '../e2e/lesson.js'
import { fakeSystemVoice } from '../e2e/speech.js'
import { toShadowing } from './helpers.js'

const FIXTURES = resolve(import.meta.dirname, 'fixtures/librispeech')
const manifest = JSON.parse(readFileSync(resolve(FIXTURES, 'manifest.json'), 'utf-8')) as {
  id: string
  file: string
  text: string
}[]

interface Seen {
  at: number
  method: string
  url: string
  hasBody: boolean
}

test('真模型：跟讀錄音全程不上傳（AC#4）＋10 句預錄音檔逐字正確率（AC#2）', async ({
  page,
  context,
}, info) => {
  test.setTimeout(20 * 60_000)
  const seen: Seen[] = []
  const log = (r: Request) =>
    seen.push({
      at: Date.now(),
      method: r.method(),
      url: r.url(),
      hasBody: r.postDataBuffer() !== null,
    })
  context.on('request', log)

  await fakeSystemVoice(page)
  // 記錄每次取得的麥克風串流；__gumDelay 可延後取得（重現「取得麥克風期間」的競態，驗收 P1-2）
  await page.addInitScript(() => {
    const w = window as unknown as { __streams: MediaStream[]; __gumDelay: number }
    w.__streams = []
    w.__gumDelay = 0
    const md = navigator.mediaDevices
    const orig = md.getUserMedia.bind(md)
    md.getUserMedia = async (c?: MediaStreamConstraints) => {
      if (w.__gumDelay) await new Promise((r) => setTimeout(r, w.__gumDelay))
      const stream = await orig(c)
      w.__streams.push(stream)
      return stream
    }
  })
  await page.addInitScript(() => localStorage.setItem('lg.installDismissed', '1'))
  await page.route('**/__fixtures/librispeech/*.wav', (route) =>
    route.fulfill({
      path: resolve(FIXTURES, new URL(route.request().url()).pathname.split('/').pop()!),
      contentType: 'audio/wav',
    }),
  )

  await test.step('跟讀題：下載模型 → 錄音 → 本機轉文字，期間零網路請求', async () => {
    await page.goto(`/lesson/${LESSON}`)
    await toShadowing(page)
    await page.getByRole('button', { name: '下載', exact: true }).click()
    await expect(page.getByText('語音辨識模型下載中')).toBeVisible()
    const start = page.getByRole('button', { name: '開始錄音' })
    await expect(start).toBeEnabled({ timeout: 10 * 60_000 })

    // 等 service worker 預快取（字典切片等數百個本站檔）跑完、網路安靜 3 秒，再量錄音期間的請求
    await page.evaluate(() => navigator.serviceWorker.ready.then(() => undefined))
    await expect
      .poll(
        async () => {
          const n = seen.length
          await page.waitForTimeout(3_000)
          return seen.length === n
        },
        { timeout: 180_000, intervals: [0] },
      )
      .toBe(true)

    const mark = seen.length
    const clicked = Date.now()
    await start.click()
    // 畫面在真正開始錄音（getUserMedia 完成）後才切到錄音中；從那時起錄 4 秒（負載高時取得麥克風可能要數秒）
    const stop = page.getByRole('button', { name: '結束錄音' })
    await expect(stop).toBeVisible({ timeout: 30_000 })
    const startDelayMs = Date.now() - clicked
    await page.waitForTimeout(4_000)
    await stop.click()
    const box = page.getByRole('textbox')
    await expect(box).toBeVisible({ timeout: 120_000 })
    const during = seen.slice(mark)
    const heard = await box.inputValue()
    const recordings = await page.evaluate(() =>
      (
        window as unknown as {
          __lgSpeech: { recordings(): { seconds: number; rms: number }[] }
        }
      ).__lgSpeech.recordings(),
    )
    info.annotations.push({ type: '假麥克風辨識結果', description: heard || '（空字串）' })
    await writeFile(
      info.outputPath('mic-path.json'),
      JSON.stringify(
        { heard, requestsDuringRecording: during.length, startDelayMs, recordings },
        null,
        2,
      ),
    )
    expect(during, '錄音開始到出現辨識結果之間的網路請求').toEqual([])
    // 真的錄到聲音（約 4 秒、有音量）；辨識內容只記錄不斷言：假麥克風循環播放，錄音常含「整句＋空檔＋下一輪開頭殘句」，
    // tiny 對尾端殘句偶爾輸出空字串（2026-10-02 實測約半數）——內容正確率由下方 10 句乾淨音檔驗證
    expect(recordings).toHaveLength(1)
    expect(recordings[0].seconds).toBeGreaterThan(2.5)
    expect(recordings[0].rms).toBeGreaterThan(0.01)
    // 空字串時就像使用者自己打字修正後送出
    if (!heard.trim()) await box.fill('I have a cup of tea')

    await page.getByRole('button', { name: '送出' }).click()
    await expect(
      page
        .getByTestId('shadowing-tally')
        .filter({ hasText: /^錯字 \d+・漏字 \d+・得分 \d+／\d+ 字$/ }),
    ).toBeVisible()
  })

  await test.step('10 句預錄音檔逐字正確率', async () => {
    const rows = []
    for (const m of manifest) {
      const t0 = Date.now()
      const hyp = await page.evaluate(
        (url) =>
          (
            window as unknown as {
              __lgSpeech: { transcribeWav(u: string): Promise<string> }
            }
          ).__lgSpeech.transcribeWav(url),
        `/__fixtures/librispeech/${m.file}`,
      )
      const c = compareWords(m.text, hyp)
      rows.push({
        id: m.id,
        ref: m.text,
        hyp,
        words: c.total,
        correct: c.correct,
        errors: c.wrong + c.missing + c.extra,
        ms: Date.now() - t0,
      })
    }
    const words = rows.reduce((s, r) => s + r.words, 0)
    const errors = rows.reduce((s, r) => s + r.errors, 0)
    const correct = rows.reduce((s, r) => s + r.correct, 0)
    const summary = {
      // 有 navigator.gpu 才可能走 WebGPU（76MB 版），否則 WASM（52MB 版）
      navigatorGpu: await page.evaluate(() => 'gpu' in navigator),
      sentences: rows.length,
      words,
      // 與 TASK-1 原型同算法：1 −（錯字＋漏字＋多字）÷ 目標字數
      accuracy: 1 - errors / words,
      // 唸對的目標字比例（跟讀畫面的「得分」）
      hitRate: correct / words,
      avgMs: Math.round(rows.reduce((s, r) => s + r.ms, 0) / rows.length),
      rows,
    }
    const json = JSON.stringify(summary, null, 2)
    await writeFile(info.outputPath('stt-accuracy.json'), json)
    await info.attach('stt-accuracy.json', { body: json, contentType: 'application/json' })
    info.annotations.push({
      type: '逐字正確率',
      description: `${(summary.accuracy * 100).toFixed(1)}%（${words} 字、錯 ${errors}）；唸對比例 ${(summary.hitRate * 100).toFixed(1)}%；平均 ${summary.avgMs} ms／句`,
    })
    expect(summary.accuracy).toBeGreaterThanOrEqual(0.9)
  })

  await test.step('麥克風釋放（驗收 P1-2）：連點兩下只開一條、取得前跳過與離開小課後所有音軌都停止', async () => {
    const tracks = () =>
      page.evaluate(() =>
        (window as unknown as { __streams: MediaStream[] }).__streams.flatMap((st) =>
          st.getTracks().map((t) => t.readyState),
        ),
      )
    const delay = (ms: number) =>
      page.evaluate((v) => ((window as unknown as { __gumDelay: number }).__gumDelay = v), ms)
    const before = (await tracks()).length
    // 連點兩下「開始錄音」（取得麥克風延後 1.5 秒）
    await page.getByRole('button', { name: '再唸一次' }).click()
    await delay(1_500)
    const start = page.getByRole('button', { name: '開始錄音' })
    await start.click()
    await start.click({ timeout: 1_000 }).catch(() => undefined)
    const stop = page.getByRole('button', { name: '結束錄音' })
    await expect(stop).toBeVisible({ timeout: 30_000 })
    await page.waitForTimeout(1_000)
    await stop.click()
    await expect(page.getByRole('textbox')).toBeVisible({ timeout: 120_000 })
    expect((await tracks()).slice(before), '連點兩下只取得一次麥克風').toHaveLength(1)
    // 取得麥克風前按跳過（這題已送出過 → 只往下）
    await page.getByRole('button', { name: '再唸一次' }).click()
    await page.getByRole('button', { name: '開始錄音' }).click()
    await page.getByRole('button', { name: /跳過/ }).click()
    await page.waitForTimeout(2_500)
    // 離開小課
    await page.getByRole('button', { name: '離開', exact: true }).first().click()
    await page.getByRole('alertdialog').getByRole('button', { name: '離開', exact: true }).click()
    await page.waitForTimeout(2_000)
    const all = await tracks()
    await writeFile(info.outputPath('mic-release.json'), JSON.stringify({ tracks: all }, null, 2))
    expect(all.length).toBeGreaterThan(before)
    expect(
      all.filter((t) => t !== 'ended'),
      '離開小課後仍 live 的音軌',
    ).toEqual([])
  })

  await test.step('整個測試期間沒有任何帶內容的上傳', async () => {
    const uploads = seen.filter((r) => r.hasBody || !['GET', 'HEAD'].includes(r.method))
    const hosts = [...new Set(seen.map((r) => new URL(r.url).host))].sort()
    const body = JSON.stringify({ hosts, total: seen.length, uploads }, null, 2)
    await writeFile(info.outputPath('network-hosts.json'), body)
    await info.attach('network-hosts.json', { body, contentType: 'application/json' })
    expect(uploads).toEqual([])
  })
})
