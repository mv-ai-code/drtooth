/**
 * Builds the favicon and app icons from the tooth mark in src/assets/logo.png.
 * Run: npm run make:icons  (outputs into public/, commit the results)
 */
import sharp from 'sharp';
import { writeFile } from 'node:fs/promises';

const LOGO = 'src/assets/logo.png';
const OUT = 'public';
// The tooth-and-implant mark sits in the left part of the logo (1920×870).
const MARK = { left: 0, top: 0, width: 850, height: 870 };
const CREAM = { r: 251, g: 250, b: 247, alpha: 1 };

// The "DR. TOOTH" and "FAMILY…" lettering overlaps the mark's box, so erase those areas first.
const textMask = Buffer.from(`
<svg width="1920" height="870" xmlns="http://www.w3.org/2000/svg">
  <rect x="465" y="232" width="1455" height="200" fill="#000"/>
  <rect x="775" y="465" width="1145" height="100" fill="#000"/>
  <rect x="770" y="600" width="1150" height="70" fill="#000"/>
</svg>`);
const masked = await sharp(LOGO).composite([{ input: textMask, blend: 'dest-out' }]).png().toBuffer();
const mark = await sharp(masked).extract(MARK).png().toBuffer().then((b) => sharp(b).trim().png().toBuffer());

/** Mark centred on a square canvas. `pad` is the fraction of the canvas left as margin on each side. */
async function square(size, { pad = 0.06, background = { r: 0, g: 0, b: 0, alpha: 0 } } = {}) {
  const inner = Math.round(size * (1 - 2 * pad));
  const resized = await sharp(mark).resize(inner, inner, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } }).toBuffer();
  return sharp({ create: { width: size, height: size, channels: 4, background } })
    .composite([{ input: resized, gravity: 'center' }])
    .png()
    .toBuffer();
}

await writeFile(`${OUT}/icon-192.png`, await square(192));
await writeFile(`${OUT}/icon-512.png`, await square(512, { pad: 0.1, background: CREAM }));
await writeFile(`${OUT}/apple-touch-icon.png`, await square(180, { pad: 0.12, background: CREAM }));

// favicon.ico holding 16, 32 and 48 px PNGs (PNG-in-ICO, supported by all current browsers).
const sizes = [16, 32, 48];
const pngs = await Promise.all(sizes.map((s) => square(s, { pad: 0.02 })));
const header = Buffer.alloc(6 + 16 * sizes.length);
header.writeUInt16LE(0, 0);
header.writeUInt16LE(1, 2);
header.writeUInt16LE(sizes.length, 4);
let offset = header.length;
sizes.forEach((s, i) => {
  const e = 6 + 16 * i;
  header.writeUInt8(s, e);
  header.writeUInt8(s, e + 1);
  header.writeUInt16LE(1, e + 4); // colour planes
  header.writeUInt16LE(32, e + 6); // bits per pixel
  header.writeUInt32LE(pngs[i].length, e + 8);
  header.writeUInt32LE(offset, e + 12);
  offset += pngs[i].length;
});
await writeFile(`${OUT}/favicon.ico`, Buffer.concat([header, ...pngs]));

console.log('Wrote favicon.ico, icon-192.png, icon-512.png, apple-touch-icon.png');
