import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { pathToFileURL } from 'node:url'
import { chromium } from 'playwright'
import { brandMark } from '../src/data/brandMark'

// Keep the static mark identical to the animation's final silhouette.
const { background, foreground, inset, thinning, closingPath, openingPath } = brandMark
const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000">
  <defs><filter id="thin" x="-10%" y="-10%" width="120%" height="120%"><feMorphology operator="erode" radius="${thinning}" /></filter></defs>
  <circle cx="500" cy="500" r="500" fill="${background}" />
  <g fill="${foreground}">
    <path filter="url(#thin)" transform="translate(${inset} 0)" d="${closingPath}" />
    <path filter="url(#thin)" transform="translate(${-inset} 0)" d="${openingPath}" />
  </g>
</svg>
`

// Apply thinning to each brace separately, as in the animated mark.
for (const file of ['src/app/icon.svg', 'public/ch.svg', 'public/nav-mark.svg']) {
  await writeFile(file, svg)
}
await mkdir('output/branding', { recursive: true })
const banner = await readFile('scripts/branding-linkedin-banner.html', 'utf8')
await writeFile('output/branding/linkedin-banner.html', banner.replaceAll('../src/', '../../src/'))

const browser = await chromium.launch()
try {
  const page = await browser.newPage({ deviceScaleFactor: 1 })
  for (const size of [16, 32, 192]) {
    await page.setViewportSize({ width: size, height: size })
    await page.goto(pathToFileURL(resolve('src/app/icon.svg')).href)
    await page.screenshot({
      path: size === 192 ? 'src/app/icon.png' : `output/branding/favicon-${size}.png`,
      omitBackground: true,
    })
  }
} finally {
  await browser.close()
}

console.log('Static marks and favicon PNGs generated. Run scripts/preview-brand-fonts.mjs with the dev server available to export share and LinkedIn images.')
