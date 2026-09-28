# chrishoneysett.dev

A personal site built with Next.js, React, TypeScript, and CSS Modules. The route in `src/app/page.tsx` assembles the homepage regions. Components used by one region and their styles live under that region in `src/components/home/sections`; resume-specific components live in `src/components/resume`. Reusable resume facts and their types live in focused files under `src/data`, with `resume.ts` combining them for other outputs.

## Run locally

```bash
npm install
npm run dev
```

Open [localhost:3000](http://localhost:3000). Before sharing changes, run `npm run lint` and `npm run build`.

## Generate a resume PDF locally

The generator imports the same `src/data/resume.ts` record as the site and reads
`src/app/theme.css` directly. Updating those files updates the next export too.
`scripts/resume.css` adds Letter-page dimensions and print spacing while reusing
the site's light-theme colors, serif display headings, and sans-serif text.

Install dependencies and Chromium once:

```bash
npm install
npx playwright install chromium
```

Generate the two-page resume, with Project Highlights on page two:

```bash
npm run resume
```

The command writes `output/pdf/chris-honeysett-resume.pdf` and a matching HTML
preview, then updates `public/downloads/chris-honeysett-resume.pdf` for the
site. These generated files are ignored by Git. No running site or Next.js
build is needed. Text remains selectable and contact links are clickable.

If Google Chrome is already installed, you can use it without downloading Chromium:

```bash
RESUME_BROWSER_CHANNEL=chrome npm run resume
```

The first page includes all role summaries, skill groups, and education.
The second page draws its contribution text from `resumeHighlight` in
`src/data/projects.ts`; edit the project ID selection in
`scripts/generate-resume.mts` to choose different highlights. The generator fails
if content would overlap the footer or spill beyond the requested page count,
so expanding the data won't silently produce a clipped resume. Review the PDF
after changing content or theme fonts.

## Publish on GitHub Pages

Every `npm run build` first regenerates the two-page resume into
`public/downloads/chris-honeysett-resume.pdf`. Next.js includes it in the static
export, and `/resume/` provides download and viewing links. The same content also
appears near the bottom of the homepage, linked by the Resume navigation item.
Use `https://chrishoneysett.dev/#resume` to link directly to that section.
The PDF is regenerated from current site data and theme on
every deployment; it is not committed separately. The GitHub Actions workflow
installs Chromium before building.

For a local build with your installed Chrome:

```bash
RESUME_BROWSER_CHANNEL=chrome npm run build -- --webpack
```

To refresh the download while running the development server, run
`npm run resume`.

The site exports static files to `out/` with `npm run build`. The workflow in `.github/workflows/pages.yml` builds and deploys them on every push to `main`.

1. On GitHub, open **Settings → Pages** for the `chrislhoneysett/chrishoneysett.dev` repository and set **Build and deployment → Source** to **GitHub Actions**.
2. Push this configuration to `main` (or run the workflow manually from **Actions**).
3. When the workflow finishes, open [chrislhoneysett.github.io/chrishoneysett.dev](https://chrislhoneysett.github.io/chrishoneysett.dev/).

To verify the GitHub Pages version locally, run:

```bash
NEXT_PUBLIC_BASE_PATH=/chrishoneysett.dev npm run build -- --webpack
```

The `NEXT_PUBLIC_BASE_PATH` value is the repository name. It prefixes page assets for the GitHub Pages URL. For a root domain deployment, leave it unset and rebuild. The contact form submits from the browser to Web3Forms; configure that service and hCaptcha to allow the GitHub Pages hostname if needed.

## Customize the theme

Edit [`src/app/theme.css`](src/app/theme.css) to change the visual system. It defines:

- Type families, sizes, weights, line heights, and letter spacing
- A spacing scale and responsive layout dimensions
- Borders, radii, focus treatment, shadows, and motion
- Semantic colors for the light and dark themes, section surfaces, controls, and artwork

The theme follows the visitor's operating system setting until they choose a mode with the switch in the header. An explicit choice is stored in `localStorage` and restored before the page is hydrated. `src/app/globals.css` contains only sitewide element defaults; `src/components/home/HomeLayout.module.css` and the CSS modules beside each homepage section use theme tokens for their presentation.

To change the palette, update the light values in `:root` and the dark overrides in both dark selectors. To change the sitewide type scale or spacing, edit the corresponding foundation tokens. CSS custom properties cannot be used inside media query conditions, so the `1050px` and `760px` breakpoints are stated directly in the theme and component styles.

The geometric artwork uses local percentages and transforms for its composition. Its colors, sizes, and shadows are theme tokens. This keeps component geometry understandable while making the site's visual language customizable from one place.
