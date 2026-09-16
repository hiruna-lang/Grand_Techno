from pathlib import Path
import json
from html import escape
from urllib.parse import quote
ROOT=Path(__file__).parent

def extra_gallery_items():
 items=json.loads((ROOT/'assets/gallery-media.json').read_text(encoding='utf-8'))
 result=[]
 for i,item in enumerate(items):
  src=quote(item['src'],safe='/');title=escape(item['title']);video=item['type']=='video';category='Videos' if video else item['category']
  media=(f'<span class="gallery-video-preview"><img src="{quote(item['poster'],safe='/')}" alt="" loading="lazy" decoding="async"><span aria-hidden="true">&#9654;</span></span>' if video else f'<img src="{src}" alt="{title}" width="{item["width"]}" height="{item["height"]}" loading="lazy" decoding="async">')
  result.append(f'<button class="gallery-item" id="new-media-{i}" data-category="{category}" data-media="{item["type"]}" data-src="{src}" data-title="{title}" type="button" aria-label="Open {title}">{media}<span class="gallery-caption"><span><small>{category}</small><strong>{title}</strong></span></span></button>')
 return ''.join(result)
