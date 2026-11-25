/**
 * Builds the placeholder social-share image public/og-image.png (1200×630) from the real logo.
 * When the final designed image is ready, just overwrite public/og-image.png with it (same name and size).
 * Run: npm run make:og
 */
import sharp from 'sharp';

const W = 1200;
const H = 630;

const logo = await sharp('src/assets/logo.png').resize({ width: 860 }).toBuffer();
const { height: logoH } = await sharp(logo).metadata();

// Thin brand bars top and bottom; tagline under the logo.
const overlay = Buffer.from(`
<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
  <rect x="0" y="0" width="${W}" height="14" fill="#f97316"/>
  <rect x="0" y="${H - 14}" width="${W}" height="14" fill="#0b5e96"/>
  <text x="${W / 2}" y="${H - 92}" text-anchor="middle" font-family="Georgia, 'Times New Roman', serif"
        font-size="40" font-style="italic" fill="#1a3557">Your smile is our passion.</text>
  <text x="${W / 2}" y="${H - 48}" text-anchor="middle" font-family="Arial, Helvetica, sans-serif"
        font-size="24" letter-spacing="3" fill="#4d5d73">BELLEVUE · MOUNTLAKE TERRACE, WA</text>
</svg>`);

await sharp({ create: { width: W, height: H, channels: 4, background: '#fbfaf7' } })
  .composite([
    { input: logo, top: Math.round((H - 150 - logoH) / 2) + 10, left: Math.round((W - 860) / 2) },
    { input: overlay, top: 0, left: 0 },
  ])
  .png({ compressionLevel: 9 })
  .toFile('public/og-image.png');

console.log('Wrote public/og-image.png');
