"""Download Latin webfonts and licenses from Google Fonts for local hosting."""
from pathlib import Path
import re
from urllib.request import Request, urlopen

root = Path(__file__).resolve().parents[1]
destination = root / 'public/fonts'
destination.mkdir(parents=True, exist_ok=True)
families = [('Gelasio', 'ital,wght@0,400;1,400', 'gelasio'),
            ('Arimo', 'ital,wght@0,400..700;1,400..700', 'arimo'),
            ('IBM+Plex+Mono', 'wght@400;700', 'ibmplexmono')]
rules = []
for family, axes, slug in families:
    request = Request(f'https://fonts.googleapis.com/css2?family={family}:{axes}&display=swap',
                      headers={'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'})
    css = urlopen(request).read().decode()
    blocks = re.findall(r'/\* latin \*/\s*(@font-face\s*\{[^}]+\})', css)
    if not blocks:
        raise RuntimeError(f'{family}: unexpected font response: {css}')
    for index, block in enumerate(blocks):
        url = re.search(r'url\(([^)]+)\)', block).group(1)
        filename = f'{slug}-latin-{index}.woff2'
        destination.joinpath(filename).write_bytes(urlopen(url).read())
        rules.append(block.replace(url, f'../../public/fonts/{filename}'))
    license_url = f'https://raw.githubusercontent.com/google/fonts/main/ofl/{slug}/OFL.txt'
    destination.joinpath(f'{slug}-OFL.txt').write_bytes(urlopen(license_url).read())
    print(f'{family}: {len(blocks)} Latin font files')
(root / 'src/app/fonts.css').write_text('\n\n'.join(rules) + '\n')
