const sharp = require('sharp');
const path = require('path');

const OUTPUT_DIR = path.join(__dirname, '../assets');

const PROJECTS = [
  {
    desktop: path.join(OUTPUT_DIR, 'collabdocs_desktop.png'),
    mobile: path.join(OUTPUT_DIR, 'collabdocs_mobile.png'),
    slug: 'collabdocs'
  }
];

async function createMockup(desktopPath, mobilePath, slug) {
  console.log(`Generating mockup for ${slug}...`);
  const width = 1200;
  const height = 800;

  // Laptop: ~840x540
  const laptopBody = Buffer.from(`<svg><rect x="0" y="0" width="840" height="540" rx="20" fill="#d1d5db"/></svg>`);
  const laptopScreenBg = Buffer.from(`<svg><rect x="0" y="0" width="800" height="500" fill="#000"/></svg>`);

  // Phone: ~220x420
  const phoneBody = Buffer.from(`<svg><rect x="0" y="0" width="220" height="420" rx="30" fill="#374151"/></svg>`); // Gray-700

  try {
    const desktopBuffer = await sharp(desktopPath).resize(800, 500, { fit: 'cover', position: 'top' }).toBuffer();
    const mobileBuffer = await sharp(mobilePath).resize(200, 400, { fit: 'cover', position: 'top' }).toBuffer();

    await sharp({
      create: {
        width: width,
        height: height,
        channels: 4,
        background: { r: 243, g: 244, b: 246, alpha: 1 }
      }
    })
      .composite([
        // Laptop
        { input: laptopBody, top: 130, left: 50 },
        { input: laptopScreenBg, top: 150, left: 70 },
        { input: desktopBuffer, top: 150, left: 70 },

        // Phone
        { input: phoneBody, top: 250, left: 800 },
        { input: mobileBuffer, top: 260, left: 810 }
      ])
      .webp({ quality: 80 })
      .toFile(path.join(OUTPUT_DIR, `${slug}_mockup.webp`));

    console.log(`Mockup created successfully: ${slug}_mockup.webp`);
  } catch (e) {
    console.error(`Error creating mockup for ${slug}:`, e);
    process.exit(1);
  }
}

async function main() {
  for (const p of PROJECTS) {
    await createMockup(p.desktop, p.mobile, p.slug);
  }
}

main();
