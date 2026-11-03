/**
 * Gera os mockups (notebook + celular) dos sites de negócio a partir de prints reais.
 *
 * Uso (rode na sua máquina, com acesso à internet):
 *   npm install
 *   npx playwright install chromium
 *   node scripts/capture-mockups.mjs                 # os três sites
 *   node scripts/capture-mockups.mjs parallel        # só um (parallel | armazem | novo-lar)
 *   node scripts/capture-mockups.mjs --placeholder novo-lar   # placeholder neutro, sem rede
 *
 * Os arquivos são gravados com os mesmos nomes que o site já usa, então basta
 * rodar o script e commitar as imagens. O layout é o mesmo de
 * scripts/create_custom_mockup.js: 1200x800, notebook à esquerda e celular à direita.
 */

import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const ASSETS = path.join(ROOT, 'public', 'assets');

const SITES = {
    parallel: {
        title: 'Parallel Store',
        url: 'https://parallelstore.netlify.app/',
        out: 'parallel_store_mockup.webp',
    },
    armazem: {
        title: 'Armazém São Joaquim',
        url: 'https://armazemsaojoaquim.netlify.app/pt',
        out: 'armazem_sao_joaquim_mockup.jpg',
    },
    'novo-lar': {
        title: 'Novo Lar Geriatria',
        url: 'https://geriatrianovolar.com.br/',
        out: 'novo_lar_geriatria_mockup.webp',
    },
};

// Geometria do mockup (igual à de create_custom_mockup.js)
const W = 1200;
const H = 800;
const LAPTOP = { body: { x: 50, y: 130, w: 840, h: 540 }, screen: { x: 70, y: 150, w: 800, h: 500 } };
const PHONE = { body: { x: 800, y: 250, w: 220, h: 420 }, screen: { x: 810, y: 260, w: 200, h: 400 } };

const svg = (w, h, inner) => Buffer.from(`<svg width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg">${inner}</svg>`);

const escapeXml = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

async function compose(desktopPng, mobilePng, outFile) {
    const desktop = await sharp(desktopPng)
        .resize(LAPTOP.screen.w, LAPTOP.screen.h, { fit: 'cover', position: 'top' })
        .toBuffer();
    const mobile = await sharp(mobilePng)
        .resize(PHONE.screen.w, PHONE.screen.h, { fit: 'cover', position: 'top' })
        .toBuffer();

    const image = sharp({ create: { width: W, height: H, channels: 4, background: { r: 243, g: 244, b: 246, alpha: 1 } } })
        .composite([
            { input: svg(LAPTOP.body.w, LAPTOP.body.h, `<rect width="${LAPTOP.body.w}" height="${LAPTOP.body.h}" rx="20" fill="#d1d5db"/>`), left: LAPTOP.body.x, top: LAPTOP.body.y },
            { input: desktop, left: LAPTOP.screen.x, top: LAPTOP.screen.y },
            { input: svg(PHONE.body.w, PHONE.body.h, `<rect width="${PHONE.body.w}" height="${PHONE.body.h}" rx="30" fill="#374151"/>`), left: PHONE.body.x, top: PHONE.body.y },
            { input: mobile, left: PHONE.screen.x, top: PHONE.screen.y },
        ]);

    const file = path.join(ASSETS, outFile);
    if (outFile.endsWith('.jpg')) await image.jpeg({ quality: 82, mozjpeg: true }).toFile(file);
    else await image.webp({ quality: 80 }).toFile(file);
    console.log(`OK -> public/assets/${outFile}`);
}

/** Tela neutra (sem logo nem print de terceiros) com o nome e o domínio do projeto. */
function placeholderScreen(w, h, title, domain, big) {
    const t = escapeXml(title);
    const d = escapeXml(domain);
    return svg(w, h, `
        <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="#0B1120"/><stop offset="100%" stop-color="#1E293B"/>
        </linearGradient></defs>
        <rect width="${w}" height="${h}" fill="url(#g)"/>
        <text x="50%" y="${big ? 46 : 47}%" text-anchor="middle" font-family="Inter, Arial, Helvetica, sans-serif"
            font-size="${big ? 44 : 18}" font-weight="700" fill="#F8FAFC">${t}</text>
        <text x="50%" y="${big ? 56 : 54}%" text-anchor="middle" font-family="Inter, Arial, Helvetica, sans-serif"
            font-size="${big ? 22 : 11}" fill="#94A3B8">${d}</text>`);
}

async function placeholder(key) {
    const site = SITES[key];
    const domain = new URL(site.url).hostname;
    const desktop = await sharp(placeholderScreen(LAPTOP.screen.w, LAPTOP.screen.h, site.title, domain, true)).png().toBuffer();
    const mobile = await sharp(placeholderScreen(PHONE.screen.w, PHONE.screen.h, site.title, domain, false)).png().toBuffer();
    await compose(desktop, mobile, site.out);
}

async function capture(browser, key) {
    const site = SITES[key];
    const shot = async (viewport, isMobile) => {
        const ctx = await browser.newContext({ viewport, deviceScaleFactor: 2, isMobile, hasTouch: isMobile, locale: 'pt-BR' });
        const page = await ctx.newPage();
        await page.goto(site.url, { waitUntil: 'networkidle', timeout: 60000 });
        await page.waitForTimeout(1500); // animações de entrada
        const buf = await page.screenshot();
        await ctx.close();
        return buf;
    };
    const desktop = await shot({ width: 1280, height: 800 }, false);
    const mobile = await shot({ width: 390, height: 780 }, true);
    await compose(desktop, mobile, site.out);
}

async function main() {
    const args = process.argv.slice(2);
    const isPlaceholder = args.includes('--placeholder');
    const keys = args.filter((a) => !a.startsWith('--'));
    const targets = keys.length ? keys : Object.keys(SITES);
    const unknown = targets.filter((k) => !SITES[k]);
    if (unknown.length) {
        console.error(`Projeto desconhecido: ${unknown.join(', ')}. Use: ${Object.keys(SITES).join(' | ')}`);
        process.exit(1);
    }

    if (isPlaceholder) {
        for (const key of targets) await placeholder(key);
        return;
    }

    const { chromium } = await import('playwright');
    const browser = await chromium.launch();
    let failed = 0;
    try {
        for (const key of targets) {
            try {
                await capture(browser, key);
            } catch (err) {
                failed++;
                console.error(`Falha ao capturar ${SITES[key].url}: ${err.message}`);
            }
        }
    } finally {
        await browser.close();
    }
    if (failed) process.exit(1);
}

main();
