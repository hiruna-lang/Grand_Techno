"""Apply search metadata without rewriting page bodies or presentation assets."""
from pathlib import Path
from html import escape
import json
import re

ROOT = Path(__file__).resolve().parents[1]
BASE_URL = 'https://grandtechnoalupathwila.com'
PAGES = {
 'index': ('Grand Techno Alupathwila | Dining, Leisure & Celebrations', 'Discover Grand Techno in Alupathwila, Sri Lanka: garden dining, swimming, peaceful surroundings and spaces for weddings, birthdays and private celebrations.'),
 'restaurant': ('Grand Techno Studio | Dining in Alupathwila', 'Explore indoor, outdoor and private dining at Grand Techno Studio in Alupathwila. Contact the team to plan a meal, group gathering or special occasion.'),
 'leisure': ('Grand Techno Leisure | Pool & Gardens in Alupathwila', 'Explore the swimming pool, tropical gardens, private pavilions and peaceful stays at Grand Techno Leisure in Alupathwila, Sri Lanka. Plan your visit.'),
 'celebrations': ('Weddings & Celebrations | Grand Techno Alupathwila', 'Plan a wedding, birthday, private gathering or corporate event at Grand Techno in Alupathwila. Explore garden settings and send your event inquiry.'),
 'gallery': ('Photo & Video Gallery | Grand Techno Alupathwila', 'View real photos and videos of Grand Techno in Alupathwila, including dining spaces, the swimming pool, gardens, celebrations and evening views.'),
 'about': ('About Grand Techno | Alupathwila, Sri Lanka', 'Meet Grand Techno in Alupathwila, Sri Lanka, where dining, gardens, leisure and celebrations come together. Explore the venue and its experiences.'),
 'contact': ('Contact & Reservations | Grand Techno Alupathwila', 'Contact Grand Techno in Alupathwila on +94 77 753 0659. Find the location and send dining, leisure or celebration inquiries by WhatsApp.')
}

def page_url(slug):
 return BASE_URL + ('/' if slug == 'index' else '/' + slug + '.html')

def apply_seo(html, slug):
 title, description = PAGES[slug]
 match = re.search(r'<head>(.*?)</head>', html, re.S)
 if not match: raise ValueError('Missing head')
 head = match[1]
 head = re.sub(r'\n?<!-- SEO metadata -->.*?<!-- End SEO metadata -->\n?', '', head, flags=re.S)
 head = re.sub(r'<title>.*?</title>', '<title>'+escape(title)+'</title>', head, flags=re.S)
 for key, value in [('description', description), ('og:title', title), ('og:description', description)]:
  pattern = r'<meta\b[^>]*(?:name|property)="'+re.escape(key)+r'"[^>]*>'
  attr = 'property' if key.startswith('og:') else 'name'
  tag = '<meta '+attr+'="'+key+'" content="'+escape(value, quote=True)+'">'
  head, count = re.subn(pattern, lambda _: tag, head)
  if not count: head += tag
 image = re.search(r'<meta\s+property="og:image"\s+content="([^"]+)"', head)
 image_url = image[1] if image else ''
 if image_url and not image_url.startswith('https://'):
  image_url = BASE_URL + '/' + image_url.lstrip('/')
  head = head.replace(image[0], '<meta property="og:image" content="'+image_url+'"')
 business = {'@type':'LocalBusiness', '@id':BASE_URL+'/#business', 'name':'Grand Techno Alupathwila', 'alternateName':'Grand Techno', 'url':BASE_URL+'/', 'telephone':'+94777530659', 'email':'Grandtechno@technoind.biz', 'address':{'@type':'PostalAddress','addressLocality':'Alupathwila','addressCountry':'LK'}, 'sameAs':['https://www.facebook.com/grandtechnoalupathwila/']}
 business['logo'] = BASE_URL + '/assets/logo/grand-techno-logo.png'
 if image_url: business['image'] = image_url
 website = {'@type':'WebSite','@id':BASE_URL+'/#website','url':BASE_URL+'/','name':'Grand Techno Alupathwila','alternateName':'Grand Techno','publisher':{'@id':BASE_URL+'/#business'},'inLanguage':'en'}
 page = {'@type':{'about':'AboutPage','contact':'ContactPage','gallery':'CollectionPage'}.get(slug,'WebPage'),'@id':page_url(slug)+'#webpage','url':page_url(slug),'name':title,'description':description,'inLanguage':'en','isPartOf':{'@id':BASE_URL+'/#website'},'about':{'@id':BASE_URL+'/#business'}}
 graph = [business,website,page]
 if slug != 'index':
  graph.append({'@type':'BreadcrumbList','@id':page_url(slug)+'#breadcrumb','itemListElement':[{'@type':'ListItem','position':1,'name':'Home','item':BASE_URL+'/'},{'@type':'ListItem','position':2,'name':{'restaurant':'Studio','leisure':'Leisure'}.get(slug,slug.title()),'item':page_url(slug)}]})
  page['breadcrumb']={'@id':page_url(slug)+'#breadcrumb'}
 tags = ['<link rel="canonical" href="'+page_url(slug)+'">','<meta name="robots" content="index, follow, max-image-preview:large">','<meta property="og:url" content="'+page_url(slug)+'">','<meta property="og:locale" content="en_LK">','<meta name="twitter:card" content="summary_large_image">','<meta name="twitter:title" content="'+escape(title,quote=True)+'">','<meta name="twitter:description" content="'+escape(description,quote=True)+'">']
 if image_url: tags.append('<meta name="twitter:image" content="'+image_url+'">')
 tags.append('<script type="application/ld+json">'+json.dumps({'@context':'https://schema.org','@graph':graph},ensure_ascii=True).replace('<','\\u003c')+'</script>')
 head += '\n<!-- SEO metadata -->\n'+'\n'.join(tags)+'\n<!-- End SEO metadata -->\n'
 return html[:match.start(1)] + head + html[match.end(1):]

def write_crawl_files():
 from xml.sax.saxutils import escape as xml_escape
 urls='\n'.join('  <url><loc>'+xml_escape(page_url(slug))+'</loc></url>' for slug in PAGES)
 (ROOT/'sitemap.xml').write_text('<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'+urls+'\n</urlset>\n',encoding='utf-8')
 (ROOT/'robots.txt').write_text('User-agent: *\nAllow: /\n\nSitemap: '+BASE_URL+'/sitemap.xml\n',encoding='utf-8')

if __name__ == '__main__':
 for slug in PAGES:
  path=ROOT/(slug+'.html')
  path.write_text(apply_seo(path.read_text(encoding='utf-8'),slug),encoding='utf-8')
 write_crawl_files()
 print('Updated metadata for seven pages without changing their bodies.')
