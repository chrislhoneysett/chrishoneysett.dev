import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { pathToFileURL } from 'node:url'
import { chromium } from 'playwright'

// Reuse the site's exact H silhouette; every part of the repeat can be cropped.
const mark = await readFile('src/app/icon.svg', 'utf8')
const paths = [...mark.matchAll(/<path[^>]+\/>/g)].map(match => match[0]).join('\n')
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1584" height="396" viewBox="0 0 1584 396">
  <defs>
    <filter id="thin" x="-10%" y="-10%" width="120%" height="120%"><feMorphology operator="erode" radius="5" /></filter>
    <g id="motif" opacity=".65">
      <circle r="72" fill="#426a6a" />
      <g transform="translate(-61 -61) scale(.122)" fill="#e3b448">${paths}</g>
    </g>
    <pattern id="repeat" width="320" height="320" patternUnits="userSpaceOnUse">
      <use href="#motif" x="80" y="80" />
      <use href="#motif" x="240" y="240" />
      <path d="M234 75h12m-6-6v12M74 235h12m-6-6v12" fill="none" stroke="#426a6a" opacity=".2" />
    </pattern>
  </defs>
  <rect width="100%" height="100%" fill="#e8e9df" />
  <rect width="100%" height="100%" fill="url(#repeat)" />
</svg>`
await mkdir('output/branding', { recursive: true })
await writeFile('output/branding/linkedin-banner-pattern-sage.svg', svg)
const browser = await chromium.launch()
try {
  const page = await browser.newPage({ viewport: { width: 1584, height: 396 }, deviceScaleFactor: 1 })
  await page.goto(pathToFileURL(resolve('output/branding/linkedin-banner-pattern-sage.svg')).href)
  await page.screenshot({ path: 'output/branding/linkedin-banner-pattern-sage.png' })
} finally {
  await browser.close()
}
