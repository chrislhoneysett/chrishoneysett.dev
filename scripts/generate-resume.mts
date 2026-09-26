import { readFile, mkdir, writeFile, copyFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import { chromium } from 'playwright'
import { resume } from '../src/data/resume'

const root = fileURLToPath(new URL('../', import.meta.url))
const args = process.argv.slice(2)
if (args.some((arg) => !['--two-pages', '--publish'].includes(arg))) {
  throw new Error('Usage: npm run resume -- [--two-pages] [--publish]')
}
const publish = args.includes('--publish')
const twoPages = publish || args.includes('--two-pages')
const escape = (value: string) =>
  value.replace(
    /[&<>"']/g,
    (char) =>
      ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;',
      })[char]!,
  )
const heading = (label: string) => `<h2>${escape(label)}</h2>`
const roles = resume.experience
  .map(
    (role) => `<article class="role">
  <div class="role-heading"><h3>${escape(role.company)}</h3><span class="meta">${escape(role.startDate)} - ${escape(role.endDate)}</span></div>
  <div class="role-title">${escape(role.title)} <span class="muted">/ ${escape(role.location)}</span></div>
  <p>${escape(role.summary)}</p>
</article>`,
  )
  .join('')
const extraRoles = resume.additionalExperience
  .map(
    (role) => `<article class="additional-role">
  <div class="role-heading"><h3>${escape(role.company)}</h3><span class="meta">${escape(role.startDate)} - ${escape(role.endDate)}</span></div>
  <div class="role-title">${escape(role.title)}</div><p>${escape(role.summary)}</p>
</article>`,
  )
  .join('')
const skills = resume.skills
  .map(
    (group) =>
      `<p class="skill-group"><strong>${escape(group.label)}</strong> ${group.items.map(escape).join(' · ')}</p>`,
  )
  .join('')
const education = resume.education
  .map(
    (item) =>
      `<p><strong>${escape(item.institution)}</strong> / ${escape(item.school)}<br>${escape(item.degree)} · Minor: ${escape(item.minor)}<br><span class="muted">${item.honors.map(escape).join(' · ')}</span></p>`,
  )
  .join('')
// Selection is presentation only: all project wording stays in src/data/projects.ts.
const selectedProjects = new Set([
  'secure-physical-access',
  'connected-battery-management',
  'auris',
  'charity-water',
  'uci-medicine',
  'kelloggs-family-rewards',
  'walmart-crowd-planning',
  'ford-quicklane',
])
const projects = resume.experience
  .map((role) => {
    const selected = role.projects.filter((project) =>
      selectedProjects.has(project.id),
    )
    if (!selected.length) return ''
    return `<section class="project-group">${heading(role.company)}${selected.map((project) => `<article class="project"><h3>${escape(project.name)}</h3><p>${escape(project.resumeHighlight)}</p><p class="technologies">${project.technologies.map(escape).join(' · ')}</p></article>`).join('')}</section>`
  })
  .join('')
const [theme, printStyles] = await Promise.all([
  readFile(path.join(root, 'src/app/theme.css'), 'utf8'),
  readFile(path.join(root, 'scripts/resume.css'), 'utf8'),
])
const html = `<!doctype html><html lang="en" data-theme="light"><head><meta charset="utf-8"><title>${escape(resume.name)} - Resume</title><style>${theme}\n${printStyles}</style></head><body>
<main class="sheet"><header><div class="kicker">${escape(resume.location)}</div><h1>${escape(resume.name)}<span class="period">.</span></h1><p class="headline">${escape(resume.headline)}</p><div class="contact">${resume.links.map((link) => `<a href="${escape(link.url)}">${escape(link.label)}</a>`).join('<span> / </span>')}${resume.phone ? `<span> / </span><a href="tel:${escape(resume.phone)}">${escape(resume.phone)}</a>` : ''}</div></header>
<section class="summary"><p>${escape(resume.summary)}</p></section>
<section>${heading('Experience')}${roles}</section>
<section>${heading('Additional experience')}${extraRoles}</section>
<section>${heading('Capabilities')}${skills}</section>
<section>${heading('Education')}${education}</section>
<footer>${escape(resume.name)}<span>Resume / 01</span></footer></main>
${twoPages ? `<main class="sheet project-sheet"><header><div class="kicker">${escape(resume.name)} / Selected work</div><h1>Project <em>highlights</em><span class="period">.</span></h1><p class="headline">${escape(resume.headline)}</p></header>${projects}<footer>${escape(resume.links[0]?.label ?? resume.name)}<span>Resume / 02</span></footer></main>` : ''}
</body></html>`
const outputDir = path.join(root, 'output/pdf')
await mkdir(outputDir, { recursive: true })
const basename = `chris-honeysett-resume${twoPages ? '-two-pages' : ''}`
const browser = await chromium.launch({
  channel: process.env.RESUME_BROWSER_CHANNEL || undefined,
})
try {
  const page = await browser.newPage({ viewport: { width: 816, height: 1056 } })
  await page.emulateMedia({ media: 'print', colorScheme: 'light' })
  await page.setContent(html, { waitUntil: 'load' })
  await page.evaluate(() => document.fonts.ready)
  // Fail visibly if growing content exceeds the intended page count.
  const overflow = await page.locator('.sheet').evaluateAll((sheets) =>
    sheets
      .map((sheet, index) => ({
        page: index + 1,
        overflow:
          sheet.scrollHeight > sheet.clientHeight + 1 ||
          Array.from(sheet.children).some(
            (child) =>
              child.tagName !== 'FOOTER' &&
              child.getBoundingClientRect().bottom >
                sheet.querySelector('footer')!.getBoundingClientRect().top - 8,
          ),
      }))
      .filter((sheet) => sheet.overflow),
  )
  if (overflow.length)
    throw new Error(
      `Resume content exceeds page ${overflow.map((item) => item.page).join(', ')}. Adjust scripts/resume.css or project selection before exporting.`,
    )
  await writeFile(path.join(outputDir, `${basename}.html`), html)
  await page.pdf({
    path: path.join(outputDir, `${basename}.pdf`),
    preferCSSPageSize: true,
    printBackground: true,
    tagged: true,
  })
  if (publish) {
    const publicDir = path.join(root, 'public/downloads')
    await mkdir(publicDir, { recursive: true })
    await copyFile(
      path.join(outputDir, `${basename}.pdf`),
      path.join(publicDir, 'chris-honeysett-resume.pdf'),
    )
  }
  console.log(
    `Generated ${path.join(outputDir, `${basename}.pdf`)} (${twoPages ? 2 : 1} page${twoPages ? 's' : ''})`,
  )
} finally {
  await browser.close()
}
