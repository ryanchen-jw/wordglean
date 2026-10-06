// TASK-25 品牌定版：以建置產物驗 manifest（name、any＋maskable 圖示）、圖示檔存在且 PNG 標頭尺寸正確、
// index.html 的 title／favicon／apple-touch-icon 連結
import { expect, test } from '@playwright/test'

type ManifestIcon = { src: string; sizes: string; type: string; purpose?: string }

// PNG 標頭：8 bytes 簽章後是 IHDR，寬高在第 16–23 byte（big-endian）
function pngSize(buf: Buffer) {
  expect(buf.subarray(0, 8).toString('hex')).toBe('89504e470d0a1a0a')
  expect(buf.subarray(12, 16).toString('ascii')).toBe('IHDR')
  return `${buf.readUInt32BE(16)}x${buf.readUInt32BE(20)}`
}

test('manifest：名稱「拾字」，列 any 與 maskable 圖示，檔案存在且尺寸正確', async ({ request }) => {
  const res = await request.get('/manifest.webmanifest')
  expect(res.ok()).toBe(true)
  const manifest = (await res.json()) as { name: string; short_name: string; icons: ManifestIcon[] }
  expect(manifest.name).toBe('拾字')
  expect(manifest.short_name).toBe('拾字')
  expect(manifest.icons.map((i) => [i.src, i.sizes, i.purpose])).toEqual([
    ['icons/icon-192.png', '192x192', 'any'],
    ['icons/icon-512.png', '512x512', 'any'],
    ['icons/icon-maskable-512.png', '512x512', 'maskable'],
  ])
  for (const icon of manifest.icons) {
    const png = await request.get(`/${icon.src}`)
    expect(png.ok(), icon.src).toBe(true)
    expect(pngSize(await png.body()), icon.src).toBe(icon.sizes)
  }
})

test('index.html：title「拾字」，favicon 與 apple-touch-icon 連結可取得', async ({
  page,
  request,
}) => {
  await page.goto('/')
  await expect(page).toHaveTitle('拾字')
  const links = await page
    .locator('head link[rel="icon"], head link[rel="apple-touch-icon"]')
    .evaluateAll((els) =>
      els.map((el) => [el.getAttribute('rel'), el.getAttribute('sizes'), el.getAttribute('href')]),
    )
  expect(links).toEqual([
    ['icon', null, '/favicon.svg'],
    ['icon', '32x32', '/icons/favicon-32.png'],
    ['icon', '16x16', '/icons/favicon-16.png'],
    ['apple-touch-icon', null, '/icons/apple-touch-icon.png'],
  ])
  const svg = await request.get('/favicon.svg')
  expect(svg.ok()).toBe(true)
  expect(await svg.text()).toContain('<svg')
  for (const [href, size] of [
    ['/icons/favicon-32.png', '32x32'],
    ['/icons/favicon-16.png', '16x16'],
    ['/icons/apple-touch-icon.png', '180x180'],
  ]) {
    const png = await request.get(href)
    expect(png.ok(), href).toBe(true)
    expect(pngSize(await png.body()), href).toBe(size)
  }
})
