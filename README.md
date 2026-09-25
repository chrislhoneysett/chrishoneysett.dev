# chrishoneysett.dev

A personal site built with Next.js, React, TypeScript, and CSS Modules. The route in `src/app/page.tsx` assembles the homepage regions. Components used by one region and their styles live under that region in `src/components/home/sections`; resume-specific components live in `src/components/resume`. Reusable resume facts and their types live in focused files under `src/data`, with `resume.ts` combining them for other outputs.

## Run locally

```bash
npm install
npm run dev
```

Open [localhost:3000](http://localhost:3000). Before sharing changes, run `npm run lint` and `npm run build`.

## Customize the theme

Edit [`src/app/theme.css`](src/app/theme.css) to change the visual system. It defines:

- Type families, sizes, weights, line heights, and letter spacing
- A spacing scale and responsive layout dimensions
- Borders, radii, focus treatment, shadows, and motion
- Semantic colors for the light and dark themes, section surfaces, controls, and artwork

The theme follows the visitor's operating system setting until they choose a mode with the switch in the header. An explicit choice is stored in `localStorage` and restored before the page is hydrated. `src/app/globals.css` contains only sitewide element defaults; `src/components/home/HomeLayout.module.css` and the CSS modules beside each homepage section use theme tokens for their presentation.

To change the palette, update the light values in `:root` and the dark overrides in both dark selectors. To change the sitewide type scale or spacing, edit the corresponding foundation tokens. CSS custom properties cannot be used inside media query conditions, so the `1050px` and `760px` breakpoints are stated directly in the theme and component styles.

The geometric artwork uses local percentages and transforms for its composition. Its colors, sizes, and shadows are theme tokens. This keeps component geometry understandable while making the site's visual language customizable from one place.
