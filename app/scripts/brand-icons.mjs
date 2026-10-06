// TASK-25 品牌圖示（拾字／Wordglean，「一張字卡」）：由 SVG 產生 public/ 下的圖示與 favicon。
// icon() 逐字移植自創辦人定稿頁（TASK-25 brand-final）的 icon()，數值不得自行調整。
// 重產：在 app/ 下執行 `node scripts/brand-icons.mjs`（用既有 Playwright 的 chromium 把 SVG 截成 PNG）
import { mkdirSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { chromium } from '@playwright/test'

let uid = 0
const SQ =
  'M60 0C93 0 107 0 113.5 6.5S120 27 120 60s0 46.5-6.5 53.5S93 120 60 120 13 120 6.5 113.5 0 93 0 60 0 13 6.5 6.5 27 0 60 0Z'
const FULL = 'M0 0H120V120H0Z'
const A =
  'M71 74c-2 1.4-3.6 2-5.4 2-2.8 0-4.2-1.7-4.2-4.6V58.3c0-6-3.6-8.6-9.4-8.6-5 0-8.8 2.2-10.4 5.8l3.4 2.2c1.3-2.6 3.6-4 6.6-4 3.8 0 5.6 1.8 5.6 5.4v1.6l-6 .9c-6.4 1-10 3.8-10 8.5 0 4.6 3.3 7.4 8.2 7.4 3.6 0 6.3-1.5 8-4 .6 2.6 2.4 4 5.4 4 1.9 0 3.6-.6 5.2-1.6Zm-13.6-5.2c-1.2 2.6-3.6 4.2-6.4 4.2-2.8 0-4.5-1.5-4.5-3.9 0-2.6 2-4.1 6.2-4.8l4.7-.7Z'
// shape：SQ＝圓角（四角透明）、FULL＝滿版；scale＝字卡縮放（Android 安全範圍）；simple＝小尺寸去光澤、投影、金點
function icon(size, o) {
  o = o || {}
  const dark = !!o.dark,
    shape = o.shape || SQ,
    scale = o.scale || 1,
    simple = !!o.simple
  const id = ++uid
  const bg = dark ? ['#2a2824', '#1b1a17'] : ['#fbf7ee', '#ebe2cf']
  return (
    '<svg xmlns="http://www.w3.org/2000/svg" width="' +
    size +
    '" height="' +
    size +
    '" viewBox="0 0 120 120" aria-hidden="true">' +
    '<defs><linearGradient id="g' +
    id +
    '" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="' +
    bg[0] +
    '"/><stop offset="1" stop-color="' +
    bg[1] +
    '"/></linearGradient>' +
    '<linearGradient id="h' +
    id +
    '" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".22"/><stop offset=".5" stop-color="#fff" stop-opacity="0"/></linearGradient>' +
    '<filter id="s' +
    id +
    '" x="-30%" y="-30%" width="160%" height="160%"><feDropShadow dx="0" dy="3" stdDeviation="3.2" flood-color="#0b1424" flood-opacity=".28"/></filter></defs>' +
    '<path d="' +
    shape +
    '" fill="url(#g' +
    id +
    ')"/>' +
    (simple ? '' : '<path d="' + shape + '" fill="url(#h' + id + ')"/>') +
    '<g transform="translate(60 60) scale(' +
    scale +
    ') translate(-60 -60)"><g ' +
    (simple ? '' : 'filter="url(#s' + id + ')"') +
    ' transform="rotate(-8 60 60)">' +
    '<rect x="34" y="26" width="52" height="68" rx="10" fill="' +
    (dark ? '#9db8e3' : '#22467a') +
    '"/>' +
    '<path d="' +
    A +
    '" fill="' +
    (dark ? '#14223a' : '#fffcf5') +
    '"/></g>' +
    (simple ? '' : '<circle cx="86" cy="27" r="4.2" fill="#c99a3e"/>') +
    '</g></svg>'
  )
}

// SVG 原檔（public/icons/src/）：PNG 的來源；icon、icon-dark 另供關於頁品牌字樣使用
const SOURCES = {
  icon: icon(512),
  'icon-dark': icon(512, { dark: true }),
  'icon-maskable': icon(512, { shape: FULL, scale: 0.78 }),
  'apple-touch-icon': icon(180, { shape: FULL }),
  favicon: icon(32, { simple: true }),
}

// [輸出檔（相對 public/）, 來源, 邊長 px]
const PNGS = [
  ['icons/icon-192.png', 'icon', 192],
  ['icons/icon-512.png', 'icon', 512],
  ['icons/icon-maskable-512.png', 'icon-maskable', 512],
  ['icons/apple-touch-icon.png', 'apple-touch-icon', 180],
  ['icons/favicon-32.png', 'favicon', 32],
  ['icons/favicon-16.png', 'favicon', 16],
]

const pub = new URL('../public/', import.meta.url)
mkdirSync(new URL('icons/src/', pub), { recursive: true })
for (const [name, svg] of Object.entries(SOURCES))
  writeFileSync(new URL(`icons/src/${name}.svg`, pub), svg + '\n')
writeFileSync(new URL('favicon.svg', pub), SOURCES.favicon + '\n')

const browser = await chromium.launch()
const page = await browser.newPage({ deviceScaleFactor: 1 })
for (const [out, src, px] of PNGS) {
  // 以 viewBox 縮放到目標邊長，背景透明（SQ 四角保持透明）
  const svg = SOURCES[src].replace(/width="\d+" height="\d+"/, `width="${px}" height="${px}"`)
  await page.setViewportSize({ width: px, height: px })
  await page.setContent(
    `<html><body style="margin:0;background:transparent">${svg.replace('<svg ', '<svg style="display:block" ')}</body></html>`,
  )
  await page.screenshot({
    path: fileURLToPath(new URL(out, pub)),
    omitBackground: true,
    clip: { x: 0, y: 0, width: px, height: px },
  })
  console.log(`${out}  ${px}×${px}`)
}
await browser.close()
