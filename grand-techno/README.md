# Grand Techno

Seven-page hospitality website built with HTML, CSS, vanilla JavaScript, GSAP and ScrollTrigger. All venue photography comes from the supplied images folder; original files are preserved in `assets/images/`.

## Open the website

Open this folder in VS Code. Right-click `index.html` and choose **Open with Live Server**. No npm install or build is required. Alternatively, run `python -m http.server 5500` from this folder and visit `http://localhost:5500`.

The supplied GSAP 3.13.0 and ScrollTrigger scripts are local, so animation does not depend on a CDN at runtime. Google Fonts requires internet access; Georgia and Arial provide fallback typography. Core content and navigation remain accessible without JavaScript. Gallery filtering, the photo viewer, and inquiry preparation require JavaScript.

## Client details

WhatsApp and calls are configured to the supplied number **072 483 2444** (`+94 72 483 2444`, international digits `94724832444`). The inquiry form now opens WhatsApp for this recipient.

### Remaining setup before publishing

- In `js/main.js`, set `GRAND_TECHNO.whatsappNumber` and `phoneNumber` to verified international-format digits, without `+` or spaces. Set `phoneDisplay` to the desired human-readable format.
- Set `mapsUrl` to the verified Google Maps URL. Replace the clearly labelled map illustration with a verified embed if desired.
- Replace the opening-hours and contact placeholders in the HTML. Footer social names are intentionally non-interactive until official profile URLs are known.
- Confirm all descriptions and available facilities with the venue, particularly pool access, stay arrangements, dining options and private events.
- Replace the SVG monogram and HTML wordmark with the client logo when available.
- After a domain is chosen, make Open Graph image URLs absolute and add canonical URLs. No unverified domain or address is assumed.

## Reservation behavior

Experience inquiry links preselect the appropriate form category. Required fields use browser validation; the date input disallows earlier dates. The form prepares an encoded WhatsApp message with name, phone, email, inquiry type, date, time, guest count and message. With a configured number, submission opens WhatsApp for the visitor to review and send; a manual link handles blocked popups. With no verified number, submission produces a selectable and copyable inquiry without opening an invalid recipient. The site stores no inquiry data and has no backend. Sending an inquiry is not a confirmed booking.

## Editing and structure

Edit the seven HTML files directly. Shared styling lives in `css/style.css`, `responsive.css`, and `animations.css`. Shared behavior lives in `js/main.js` and `animations.js`; gallery and contact behavior use their own small files.

`build-pages.py` is an optional authoring helper used to generate the static pages. It is not needed to run the website. If you use it again, edit content there first: running it replaces all seven HTML files. It does not replace CSS, JavaScript or images.

Reduced-motion preferences disable large transitions and parallax. The mobile navigation manages focus, Escape dismissal and background interaction. The native dialog photo viewer supports Escape, arrow keys and return focus. Gallery categories use pressed-state buttons and live result counts.

## Animation reference

ScrollTrigger registration, viewport reveals and responsive animation contexts follow the [official GSAP documentation](https://gsap.com/docs/v3/Plugins/ScrollTrigger/). Bundled GSAP scripts retain their upstream license headers; see the linked GSAP license in those files.


## Natural photo enhancement

The website serves non-AI WebP derivatives from `assets/images/enhanced/`. All 42 original JPEGs remain unchanged. Variants use Lanczos resizing and restrained sharpening without scene reconstruction, colour grading or generated details. Each image has three responsive sizes; large landscape versions reach 2400 pixels wide, with upscaling limited to 2? the source dimensions. Upscaling improves rendering control but does not recover missing photographic detail.

The gallery viewer opens the largest version. Opening photo panels use responsive sizes matched to their contained width and fade in without zooming. Contact, Gallery and About use short text introductions; Home and experience pages pair text with modest photo panels. No page uses a viewport-height opening image.

Optional regeneration: run `npm install --prefix grand-techno/tools` and `npm run enhance --prefix grand-techno/tools` from the repository root, followed by `python grand-techno/image_assets.py`. These tools are for authoring only; the website still needs no runtime build or installation. `build-pages.py` also applies the responsive image manifest automatically.

Processing uses [Sharp sharpening](https://sharp.pixelplumbing.com/api-operation/#sharpen) and [resizing](https://sharp.pixelplumbing.com/api-resize/).
