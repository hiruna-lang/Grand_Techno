"""Apply the pre-rendered, non-AI photo variants to static HTML."""
import json
import re
from pathlib import Path

ROOT = Path(__file__).parent

def responsive_images(html):
    manifest_path = ROOT / 'assets/images/enhanced/manifest.json'
    if not manifest_path.exists():
        return html
    manifest = json.loads(manifest_path.read_text(encoding='utf-8'))

    def replace_image(match):
        tag = match.group(0)
        number = re.search(r'IMG_(\d+)(?:\.JPG\.jpeg|-\d+\.webp)', tag)
        if not number or number.group(1) not in manifest:
            return tag
        variants = manifest[number.group(1)]['variants']
        large = variants[-1]
        # Hero photos are contained panels, rather than full-screen backdrops.
        sizes = '(max-width: 767px) calc(100vw - 44px), (max-width: 1440px) 45vw, 620px' if 'hero-image' in tag else 'auto, 100vw'
        for attr in ('src', 'srcset', 'sizes', 'width', 'height'):
            tag = re.sub(rf'\s{attr}="[^"]*"', '', tag)
        srcset = ', '.join(f'{v["src"]} {v["width"]}w' for v in variants)
        return tag[:-1] + f' src="{large["src"]}" srcset="{srcset}" sizes="{sizes}" width="{large["width"]}" height="{large["height"]}">'

    return re.sub(r'<img\b[^>]*>', replace_image, html)

if __name__ == '__main__':
    for page in ROOT.glob('*.html'):
        page.write_text(responsive_images(page.read_text(encoding='utf-8')), encoding='utf-8')
    print('Updated responsive photo sources on all seven pages.')
