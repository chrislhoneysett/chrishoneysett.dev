import { chromium } from 'playwright'
import { resolve } from 'node:path'
import { pathToFileURL } from 'node:url'

const browser = await chromium.launch()
try {
  const page = await browser.newPage({ deviceScaleFactor: 1 })
  const errors = []
  page.on('pageerror', (error) => errors.push(error.message))
  for (const width of [320, 390, 669, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 1000 })
    await page.goto('http://localhost:3000')
    await page.evaluate(() => document.fonts.ready)
    const result = await page.evaluate(() => ({
      overflow: document.documentElement.scrollWidth > innerWidth,
      fonts: ['400 32px Gelasio', 'italic 400 32px Gelasio', '400 16px Arimo', '700 12px "IBM Plex Mono"'].map(font => ({ font, loaded: document.fonts.check(font) })),
    }))
    console.log(width, JSON.stringify(result))
    if (result.overflow || result.fonts.some(font => !font.loaded)) throw new Error('Font/layout check failed')
    if (width === 390 || width === 1440) await page.screenshot({ path: `/tmp/brand-fonts-${width}.png`, fullPage: true })
  }
  await page.setViewportSize({ width: 1200, height: 800 })
  await page.goto('http://localhost:3000')
  await page.evaluate(() => document.fonts.ready)
  await page.addStyleTag({ content: 'nextjs-portal { display: none !important; }' })
  await page.evaluate(() => {
    document.documentElement.dataset.theme = 'light'
    const section = document.querySelector('#share-card')
    Object.assign(section.style, { display: 'block', padding: '0' })
    section.querySelector(':scope > p').style.display = 'none'
    Object.assign(section.querySelector(':scope > div').style, { width: '1200px', height: '630px', minHeight: '0', border: 'none' })
  })
  await page.locator('#share-card > div').screenshot({ path: 'public/shareImage.png' })
  await page.setViewportSize({ width: 1584, height: 396 })
  await page.goto(pathToFileURL(resolve('output/branding/linkedin-banner.html')).href)
  await page.evaluate(() => document.fonts.ready)
  await page.locator('.banner').screenshot({ path: 'output/branding/linkedin-banner.png' })
  if (errors.length) throw new Error(errors.join('\n'))
} finally {
  await browser.close()
}
