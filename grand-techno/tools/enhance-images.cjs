// Non-generative derivatives only. Always read the unchanged original JPEGs.
const sharp = require('sharp');
const fs = require('node:fs/promises');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const output = path.join(root, 'assets/images/enhanced');
async function enhance(name) {
  const input = path.join(root, 'assets/images', name);
  const meta = await sharp(input).metadata();
  const id = name.match(/IMG_(\d+)/)[1];
  const maxWidth = Math.min(2400, meta.width * 2, Math.floor(3840 * meta.width / meta.height));
  const widths = [...new Set([720, Math.min(1440, maxWidth), maxWidth])].sort((a, b) => a - b);
  const variants = [];
  for (const width of widths) {
    const file = `IMG_${id}-${width}.webp`;
    const info = await sharp(input).rotate()
      .resize({ width, kernel: sharp.kernel.lanczos3 })
      .sharpen({ sigma: 0.8, m1: 0.3, m2: 1.2, x1: 2, y2: 4, y3: 6 })
      .webp({ quality: 94, effort: 5, smartSubsample: true })
      .toFile(path.join(output, file));
    variants.push({ src: `assets/images/enhanced/${file}`, width: info.width, height: info.height, bytes: info.size });
  }
  return [id, { original: name, sourceWidth: meta.width, sourceHeight: meta.height, variants }];
}
(async () => {
  await fs.mkdir(output, { recursive: true });
  const sample = process.argv.includes('--sample');
  const names = sample ? ['IMG_1604.JPG.jpeg'] : (await fs.readdir(path.join(root, 'assets/images'))).filter(name => /^IMG_\d+\.JPG\.jpeg$/.test(name));
  const results = {};
  for (const name of names) {
    const [id, entry] = await enhance(name); results[id] = entry;
  }
  if (!sample) await fs.writeFile(path.join(output, 'manifest.json'), JSON.stringify(results, null, 2) + '\n');
  console.log(`Enhanced ${names.length} original photos using Lanczos resizing and restrained sharpening; no AI, colour grading or scene changes.`);
})().catch(error => { console.error(error); process.exit(1); });
