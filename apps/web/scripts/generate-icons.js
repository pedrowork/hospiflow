const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

async function run() {
  const src = path.join(__dirname, '..', 'public', 'next.svg');
  const outDir = path.join(__dirname, '..', 'public', 'icons');
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
  // Generate placeholder icons from next.svg rasterized to PNG
  const sizes = [192, 512];
  for (const size of sizes) {
    const buf = await sharp({ create: { width: size, height: size, channels: 4, background: '#0ea5e9' } })
      .png()
      .toBuffer();
    await sharp(buf).png().toFile(path.join(outDir, `icon-${size}.png`));
  }
  await sharp({ create: { width: 512, height: 512, channels: 4, background: '#0ea5e9' } })
    .png()
    .toFile(path.join(outDir, 'maskable-512.png'));
  console.log('Icons generated in public/icons');
}

run().catch((e) => { console.error(e); process.exit(1); });


