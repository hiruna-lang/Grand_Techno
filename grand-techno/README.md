# Grand Techno ? project instructions

## Folder structure

- `index.html`, `about.html`, `celebrations.html`, `contact.html`, `gallery.html`, `leisure.html`, `restaurant.html`: website pages.
- `css/`: shared styling, responsive rules and animations.
- `js/`: navigation, animations, homepage slideshow, gallery, footer and contact behaviour.
- `assets/images/`: original venue photos and responsive WebP sizes. Multiple sizes support different screens; they are not unnecessary duplicates.
- `assets/videos/`: gallery videos and preview posters.
- `assets/icons/`, `assets/logo/`: graphic assets.
- `assets/vendor/`: bundled animation libraries. Keep their license headers.
- `assets/gallery-media.json`: gallery media information used by the authoring helper.
- `tools/`: image-processing script, dependency declaration and image manifest.
- `build-pages.py`, `image_assets.py`, `gallery_media.py`: optional authoring helpers.

## Working on the website

Open `index.html` with Live Server. The site runs without installing Python or Node dependencies. Google Fonts, Google Maps and external contact links require an internet connection.

Edit the HTML, CSS and JavaScript files for website changes. Preserve relative asset paths when moving files. Keep the original photos for future image processing.

The optional `build-pages.py` script overwrites all seven HTML pages. It is not required to preview the website. Maintain its templates alongside direct HTML edits before using it again; generated pages may need formatting afterwards.

To regenerate image variants from the repository root, install the optional image-tool dependencies with `npm install --prefix grand-techno/tools`, run `npm run enhance --prefix grand-techno/tools`, then run `python grand-techno/image_assets.py`. These commands are for authoring only.

## Contact and media

Contact configuration is in `js/main.js`. Inquiries are prepared for WhatsApp; the site has no booking backend. Gallery videos open with native playback controls. Original photos, responsive image sizes and video posters must remain available at their referenced paths.

## Search metadata

Page titles, descriptions, canonical URLs, sharing metadata and JSON-LD are maintained by `tools/seo.py`. Run `python grand-techno/tools/seo.py` from the repository root after editing SEO settings. It updates only document heads, `sitemap.xml` and `robots.txt`; it does not rewrite page bodies. The optional page generator also applies these settings.

The configured public URL is `https://grandtechnoalupathwila.com`. Canonicals and the sitemap assume this folder's `index.html` will be served at the domain root, not at `/grand-techno/`. Confirm that URL layout when hosting is requested. No hosting or Search Console submission has been performed. Do not invent opening hours, prices, reviews or coordinates in structured data.
