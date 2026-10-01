# Brand fonts

Latin WOFF2 files downloaded from Google Fonts and hosted locally:

- Gelasio: regular and italic headings, weight 400.
- Arimo: regular and italic body text, variable weights 400–700.
- IBM Plex Mono: labels, weights 400 and 700.

Each family's SIL Open Font License is included alongside its files.
Run `python3 scripts/download-brand-fonts.py` to refresh the files and
`src/app/fonts.css`. The site and banner both use this stylesheet.

Sources: https://github.com/google/fonts/tree/main/ofl/gelasio,
https://github.com/google/fonts/tree/main/ofl/arimo,
https://github.com/google/fonts/tree/main/ofl/ibmplexmono.
