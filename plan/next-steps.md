# Resume Website Next Steps

## Goal

Create a maintainable resume website that uses one typed content system to produce:

- A responsive, accessible HTML resume at `/resume`
- A print-focused resume at `/resume/print`
- A static PDF at `/chris-honeysett-resume.pdf`

The PDF should regenerate during the build whenever resume content or print styles change.

## Current State

- Next.js 16 App Router project using React 19 and TypeScript
- Resume content is defined in `src/domains/development/data/resume.ts`
- Resume types are defined in `src/domains/development/types/resume.ts`
- Project records already provide separate `description` and `resumeHighlight` fields
- The current page is statically prerendered
- `npm run lint` and `npm run build` pass

## Architecture Decisions

1. Keep `resume.ts` as the source of factual experience, projects, skills, and a broad default introduction. Keep audience-specific introductions and content selections in `resumeVariants.ts`.
2. Keep content selection separate from presentation.
3. Use normal React and CSS for both screen and print layouts.
4. Generate the PDF from `/resume/print` with Playwright and Chromium.
5. Generate the PDF before `next build`, then serve it from `public/` as a static asset.
6. Start with a frontend developer resume that balances web and mobile work. Show React and React Native as strengths through selected examples and skills, while also representing broader frontend, design, and project planning work. Leave a React-focused version for later.
7. Make theatre, design, direct client collaboration, and whole-project planning part of the core story, beginning in the introduction and supported by concrete experience examples.

## Phase 1: Define the Resume Variant

The first variant is **frontend developer focused**, with a balanced mix of web and mobile work. React and React Native are important strengths, but the introduction should not imply they are the only tools used. Its differentiator is the perspective gained through theatre, design, freelance client work, and planning productions with many stakeholders. The headline, introduction, skills, and project selection should tell that story consistently.

- [x] Choose the focus of the first variant: frontend development with balanced web and mobile work. A React-only version can be created later.
- [x] Draft a broad introduction that connects web and mobile development with theatre, design, client communication, and whole-project planning. The draft is in `resume.ts`; review its wording before publication.
- [ ] Review the headline and introduction together so they foreground frontend engineering and the personal differentiator without narrowing the work to one library.
- [ ] Select the jobs and projects that belong in a two-page resume. Include substantial examples from both web and mobile, favoring clear React contributions and variety of responsibilities.
- [ ] Include React web applications and component library work alongside React Native applications. Keep CMS and other frontend examples that show range, leadership, or scale.
- [ ] Identify specific examples of client conversations, design decisions, scope planning, or coordinating contributors that substantiate the introduction. Add them to the relevant experience summaries or project highlights without inventing outcomes or metrics.
- [ ] Give each resume variant its own introduction. Start with a broad frontend introduction; add specialized copy only when a specialized variant is created.
- [ ] Allow a concise print introduction for the two-page PDF, with more room for the personal story on the website if needed.
- [ ] Decide which skill groups should appear. Put React, React Native, TypeScript, and frontend/UI engineering near the top; retain mobile capabilities such as Bluetooth where supported by the selected projects.
- [ ] Confirm the preferred section order.
- [ ] Add a typed variant configuration, such as `resumeVariants.ts`, with `intro` and optional `printIntro` fields alongside the selected content IDs.
- [ ] Add a selector such as `getResumeVariant("frontend")`.
- [ ] Have the HTML and print renderers read the introduction resolved by the variant selector, rather than using `resume.summary` directly.
- [ ] Keep filtering rules and selected project IDs out of React components.

Potential starting examples from the existing data are Auris, Charity Water Dashboard, and NorthernTrust.com for React web work; Connected Battery Management and Industrial Motor Control for React Native work. These are candidates to evaluate against available page space, not a fixed selection.

The freelance work at Honeysett Design and the theatre background should remain visible even if the PDF gives them less space than the engineering roles. The website can expand on how those experiences shaped client communication, design judgment, and project planning. Across variants, keep this differentiator consistent while changing the opening emphasis to suit the role.

Suggested domain structure:

```text
src/domains/development/
├── data/resume.ts
├── data/resumeVariants.ts
├── selectors/getResumeVariant.ts
└── types/resume.ts
```

## Phase 2: Define the Visual Theme

- [ ] Choose three to five adjectives that describe the intended visual direction, such as precise, experienced, warm, editorial, or technical.
- [ ] Collect a small set of visual references for typography, spacing, color, and resume layouts.
- [ ] Choose a primary typeface and optional display typeface, favoring self-hosted variable fonts that render reliably in Chromium and PDF output.
- [ ] Define the type scale for the name, headline, section headings, body text, metadata, and project details.
- [ ] Define a compact spacing scale that works consistently across screen and print layouts.
- [ ] Choose a restrained color palette with neutral text and background colors plus one accent color.
- [ ] Confirm that all text and interactive colors meet WCAG contrast requirements.
- [ ] Define shared border, radius, shadow, and focus-ring treatments.
- [ ] Decide whether the website supports dark mode; keep the resume print layout explicitly light.
- [ ] Test the theme at mobile, desktop, and Letter-page dimensions before styling every component.

Implement the theme as semantic CSS custom properties rather than component-specific color values:

```css
:root {
  --color-canvas: #ffffff;
  --color-surface: #f6f5f2;
  --color-text: #1d2329;
  --color-text-muted: #59636e;
  --color-accent: #245b78;
  --color-border: #d9dde1;
  --color-focus: #0b6ea8;

  --font-body: sans-serif;
  --font-display: var(--font-body);

  --space-1: 0.25rem;
  --space-2: 0.5rem;
  --space-3: 0.75rem;
  --space-4: 1rem;
  --space-6: 1.5rem;
  --space-8: 2rem;
}
```

These values are placeholders until the visual direction is selected. The finished theme should provide shared foundations for the resume, future portfolio pages, and print output without making all three presentations identical.

Theme deliverables:

- A short written visual-direction statement
- Approved font pairing and weights
- Screen and print color tokens
- Type and spacing scales
- Link, button, focus, divider, and surface styles
- One representative resume section rendered on screen and on a PDF-sized canvas

## Phase 3: Build Reusable Resume Components

- [ ] Break the current page into reusable components.
- [ ] Add components for the header, summary, skills, experience, projects, and education.
- [ ] Give the introduction a clear, prominent position near the top of the HTML resume and print layout.
- [ ] Use `description` for expanded website content.
- [ ] Use `resumeHighlight` for concise print bullets.
- [ ] Preserve semantic headings, lists, and links.
- [ ] Add visible keyboard focus and accessible link labels.

Suggested component structure:

```text
src/components/resume/
├── ResumeDocument.tsx
├── ResumeHeader.tsx
├── ResumeSummary.tsx
├── ResumeSkills.tsx
├── ResumeExperience.tsx
└── ResumeEducation.tsx
```

## Phase 4: Create the Public Resume Page

- [ ] Create `/resume` as the canonical HTML resume.
- [ ] Use the introduction as an entry point to the broader theatre/design story, with selected examples in experience or a short background section.
- [ ] Add a prominent link to download the PDF.
- [ ] Add page-specific title, description, canonical URL, and social metadata.
- [ ] Make the layout responsive for phones, tablets, and desktop screens.
- [ ] Decide whether `/` should remain the resume, redirect to `/resume`, or become a portfolio landing page.
- [ ] Confirm email, telephone, personal site, and LinkedIn links.

## Phase 5: Create the Print Layout

- [ ] Create `/resume/print` using the same selected content.
- [ ] Give the print route its own layout or presentation variant.
- [ ] Target US Letter paper with explicit margins.
- [ ] Add `@media print` styles that remove controls and screen-only decoration.
- [ ] Force a light print color scheme regardless of the user's system preference.
- [ ] Prevent headings and experience blocks from breaking awkwardly across pages.
- [ ] Ensure backgrounds print when intentionally used.
- [ ] Wait for self-hosted fonts to load before PDF export.
- [ ] Target two readable pages rather than compressing the complete work history into one page.

Starting print rules:

```css
@page {
  size: Letter;
  margin: 0.45in 0.5in;
}

@media print {
  .screenOnly {
    display: none;
  }

  article,
  section {
    break-inside: avoid;
  }
}
```

## Phase 6: Add Build-Time PDF Generation

- [ ] Add Playwright as a development dependency.
- [ ] Add `scripts/generate-resume-pdf.ts`.
- [ ] Have the script start a temporary Next.js server on a dedicated port.
- [ ] Wait until `/resume/print` is available.
- [ ] Open the route with Chromium and emulate print media.
- [ ] Wait for `document.fonts.ready`.
- [ ] Generate `public/chris-honeysett-resume.pdf`.
- [ ] Shut down the temporary server even if generation fails.
- [ ] Make generation failures fail the build.
- [ ] Run PDF generation before `next build` so the file is included in the deployment.

Target scripts:

```json
{
  "scripts": {
    "resume:pdf": "tsx scripts/generate-resume-pdf.ts",
    "resume:verify": "tsx scripts/verify-resume-pdf.ts",
    "build": "npm run resume:pdf && next build"
  }
}
```

The PDF export should use settings equivalent to:

```ts
await page.pdf({
  path: "public/chris-honeysett-resume.pdf",
  format: "Letter",
  printBackground: true,
  preferCSSPageSize: true,
});
```

## Phase 7: Verify the Generated PDF

- [ ] Confirm the PDF exists and is not empty.
- [ ] Assert the expected page count.
- [ ] Render every PDF page to PNG for visual inspection.
- [ ] Check for clipped text, overlap, broken page transitions, and missing glyphs.
- [ ] Extract the PDF text and confirm it remains selectable and ATS-readable.
- [ ] Verify email, website, and LinkedIn links.
- [ ] Confirm that web fonts and intentional background colors are present.
- [ ] Run `npm run lint` and `npm run build`.

## Phase 8: Deploy

- [ ] Confirm the deployment environment supports Playwright and its Chromium binary during builds.
- [ ] Deploy the application and generated PDF together.
- [ ] Verify `/resume` on desktop and mobile.
- [ ] Verify `/chris-honeysett-resume.pdf` opens directly and downloads correctly.
- [ ] Configure the preferred `www` or apex-domain redirect.
- [ ] Test the public resume URL in LinkedIn and a representative job application form.

## Definition of Done for the MVP

- Resume facts and variant-specific presentation copy are maintained in one typed content system.
- `/resume` is responsive, accessible, and statically rendered.
- `/resume/print` produces a deliberate two-page Letter layout.
- `npm run build` regenerates the static PDF before building the site.
- The PDF contains selectable text and working links.
- The generated pages pass visual inspection without clipping or overlap.
- The HTML resume and PDF are available from stable public URLs.

## Later Enhancements

- Add React-focused, mobile-focused, or other specialized resume variants if needed, each with its own introduction.
- Allow variant-specific PDF URLs.
- Add portfolio case studies that reuse the project data.
- Add automated visual regression checks for the print route.
- Add CI checks that detect stale or malformed PDF output.
- Add structured data, an Open Graph image, sitemap, and analytics.
