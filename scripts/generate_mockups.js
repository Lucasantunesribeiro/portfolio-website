const fs = require('fs');
const path = require('path');
const { chromium, devices } = require('playwright');
const sharp = require('sharp');

// Configuration
const SCREENSHOT_DIR = path.join(__dirname, '../assets/screens');
const OUTPUT_DIR = path.join(__dirname, '../assets');
const JS_FILE = path.join(__dirname, '../js/main.js');

// Ensure directories exist
if (!fs.existsSync(SCREENSHOT_DIR)) fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });

function extractObject(content, startIndex) {
  let braceCount = 0;
  let bracketCount = 0;
  let inString = false;
  let stringChar = '';
  let escape = false;
  let endIndex = -1;

  for (let i = startIndex; i < content.length; i++) {
    const char = content[i];

    if (inString) {
      if (escape) {
        escape = false;
      } else if (char === '\\') {
        escape = true;
      } else if (char === stringChar) {
        inString = false;
      }
      continue;
    }

    if (char === "'" || char === '"' || char === '`') {
      inString = true;
      stringChar = char;
      continue;
    }

    if (char === '{') braceCount++;
    else if (char === '}') braceCount--;
    else if (char === '[') bracketCount++;
    else if (char === ']') bracketCount--;

    if (braceCount === 0 && bracketCount === 0) {
      endIndex = i;
      break;
    }
  }
  return endIndex;
}

async function main() {
  console.log('Starting mockup generation...');

  // 1. Read js/main.js
  let content = fs.readFileSync(JS_FILE, 'utf8');

  // Find "projetos: ["
  // We want the one inside the PT block (first one) or handle both?
  // The user wants to generate mockups for ALL projects.
  // The projects are duplicated in PT and EN.
  // We should parse the first one (PT) to get the list of URLS/Slugs.
  // Then generate images.
  // Then update BOTH locations in the file.

  const keyword = 'projetos: [';
  const firstIndex = content.indexOf(keyword);

  if (firstIndex === -1) {
    console.error('Could not find projects array');
    process.exit(1);
  }

  const arrayStartIndex = firstIndex + keyword.length - 1; // pointing to '['
  const arrayEndIndex = extractObject(content, arrayStartIndex);

  if (arrayEndIndex === -1) {
    console.error('Could not parse projects array boundaries');
    process.exit(1);
  }

  const arrayString = content.substring(arrayStartIndex, arrayEndIndex + 1);
  console.log('Extracted projects array string length:', arrayString.length);

  let projectsData = [];
  try {
    projectsData = eval(arrayString);
  } catch (e) {
    console.error('Eval failed:', e);
    process.exit(1);
  }

  // Filter projects
  const projects = projectsData
    .filter(p => p.demo && p.demo.startsWith('http'))
    .map(p => ({
      title: p.title,
      demo: p.demo,
      currentImg: p.img,
      slug: p.title.toLowerCase().replace(/[^a-z0-9]/g, '_')
    }));

  console.log(`Found ${projects.length} projects with demos.`);

  // 2. Browser
  const browser = await chromium.launch();

  for (const project of projects) {
    console.log(`Processing ${project.title}...`);
    const page = await browser.newPage();

    try {
      // Desktop
      await page.setViewportSize({ width: 1440, height: 900 });
      try {
        // If url ends with /login, it's fine.
        await page.goto(project.demo, { waitUntil: 'networkidle', timeout: 60000 });
      } catch (e) { console.warn('  Navigation timeout, capturing anyway'); }

      // Cookie banners
      try {
        const cookieBtns = await page.getByText(/aceitar|accept|agree|entendi|i understand|allow|cookies/i).elementHandles();
        if (cookieBtns.length > 0) {
          await cookieBtns[0].click();
          await page.waitForTimeout(1000);
        }
      } catch (e) { }

      const desktopPath = path.join(SCREENSHOT_DIR, `${project.slug}_desktop.png`);
      await page.screenshot({ path: desktopPath });

      // Mobile
      const iphone = devices['iPhone 13'];
      await page.setViewportSize(iphone.viewport);
      await page.reload({ waitUntil: 'networkidle', timeout: 60000 }).catch(() => { });
      await page.waitForTimeout(1000);
      try {
        const cookieBtns = await page.getByText(/aceitar|accept|allow/i).elementHandles();
        if (cookieBtns.length > 0) {
          await cookieBtns[0].click();
          await page.waitForTimeout(500);
        }
      } catch (e) { }

      const mobilePath = path.join(SCREENSHOT_DIR, `${project.slug}_mobile.png`);
      await page.screenshot({ path: mobilePath });

      // Composite
      await createMockup(desktopPath, mobilePath, project.slug);
      project.newImg = `assets/${project.slug}_mockup.webp`;

    } catch (err) {
      console.error(`Error processing ${project.title}:`, err);
    } finally {
      await page.close();
    }
  }

  await browser.close();

  // 4. Update File
  console.log('Updating file...');
  let newContent = content;

  for (const project of projects) {
    if (project.newImg && fs.existsSync(path.join(OUTPUT_DIR, `${project.slug}_mockup.webp`))) {
      const escapeRegExp = (string) => string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const oldImgRegex = escapeRegExp(project.currentImg);
      const regex = new RegExp(`(img:\\s*['"])${oldImgRegex}(['"])`, 'g');

      if (newContent.match(regex)) {
        newContent = newContent.replace(regex, `$1${project.newImg}$2`);
        console.log(`  Updated ${project.title}`);
      }
    }
  }

  fs.writeFileSync(JS_FILE, newContent);
  console.log('Done.');
}

async function createMockup(desktopPath, mobilePath, slug) {
  // Re-using the same simple mockup logic
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
  } catch (e) {
    throw e;
  }
}

main().catch(console.error);
