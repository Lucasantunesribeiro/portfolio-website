/**
 * Captura prints e vídeos de demonstração dos sites dos clientes reais.
 *
 * Roda no GitHub Actions (.github/workflows/capture-demos.yml), que tem acesso
 * à internet. Também funciona localmente:
 *   npm ci && npx playwright install chromium
 *   node scripts/capture-demos.mjs                 # os três sites
 *   node scripts/capture-demos.mjs parallel        # só um (novo-lar | parallel | armazem)
 *
 * Para cada site, grava em demos/ (ou no diretório de DEMOS_OUT):
 *   <slug>-desktop.png   print 1440x900 (deviceScaleFactor 2)
 *   <slug>-mobile.png    print 390x844 (deviceScaleFactor 2)
 *   <slug>-pagina-N.png  print 1440x900 de até 2 páginas internas do menu
 *   <slug>-demo.mp4      vídeo 1920x950, H.264, sem áudio (~25 s)
 *   <slug>-poster.jpg    frame de ~2 s do vídeo
 *   manifest.json        páginas visitadas e duração de cada vídeo
 *
 * Os arquivos não vão direto para public/: os prints viram mockups e os vídeos
 * são conferidos antes de entrar no site.
 *
 * Tempo limitado de propósito: cada navegação tem ~30 s, nada espera
 * `networkidle` mais que alguns segundos, cada site tem um teto (SITE_LIMIT_MS)
 * e o script inteiro tem um teto (TOTAL_LIMIT_MS) — no fim ele sai com
 * process.exit para não ficar preso em handles abertos do navegador.
 */

import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT = path.resolve(process.env.DEMOS_OUT || path.join(ROOT, 'demos'));

const SITES = {
    'novo-lar': {
        slug: 'novo-lar-geriatria',
        url: 'https://geriatrianovolar.com.br/',
        prefer: [/servi[cç]o/i, /unidade/i, /sobre|quem somos/i, /not[ií]cia|blog/i],
    },
    parallel: {
        slug: 'parallel-store',
        url: 'https://parallelstore.netlify.app/',
        prefer: [/produto|loja|shop|cat[aá]logo|cole[cç][aã]o/i, /sobre|about/i, /contato|contact/i],
    },
    armazem: {
        slug: 'armazem-sao-joaquim',
        url: 'https://armazemsaojoaquim.netlify.app/pt',
        prefer: [/menu|card[aá]pio/i, /pousada/i, /caf[eé]/i, /blog/i, /galeria/i],
    },
};

const VIDEO = { width: 1920, height: 950 };
const NAV_TIMEOUT_MS = 30000;
const SITE_LIMIT_MS = 4 * 60 * 1000;
const TOTAL_LIMIT_MS = 14 * 60 * 1000;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const T0 = Date.now();
/** Log de progresso com o tempo decorrido desde o início. */
function log(msg) {
    const s = ((Date.now() - T0) / 1000).toFixed(1).padStart(6);
    console.log(`[${s}s] ${msg}`);
}

/** Rejeita se `promise` não terminar em `ms`. */
function withTimeout(promise, ms, label) {
    let timer;
    const limit = new Promise((_, reject) => {
        timer = setTimeout(() => reject(new Error(`${label}: passou de ${Math.round(ms / 1000)} s`)), ms);
    });
    return Promise.race([promise, limit]).finally(() => clearTimeout(timer));
}

/** Fecha banners de cookie/consentimento comuns, se houver. Nunca lança erro. */
async function dismissBanners(page) {
    try {
        await withTimeout(tryDismissBanners(page), 8000, 'fechar banners');
    } catch (err) {
        log(`  aviso: ${err.message}`);
    }
}

async function tryDismissBanners(page) {
    const patterns = [
        /^(aceitar|aceito|aceitar todos|aceitar tudo|accept|accept all|concordo|entendi|ok|permitir|permitir todos|got it|allow all)$/i,
    ];
    for (const re of patterns) {
        const buttons = page.getByRole('button', { name: re });
        const count = await buttons.count().catch(() => 0);
        for (let i = 0; i < count; i++) {
            const b = buttons.nth(i);
            if (await b.isVisible().catch(() => false)) {
                await b.click({ timeout: 2000 }).catch(() => {});
                await sleep(400);
            }
        }
    }
    // Alguns banners usam <a> ou <div role="button"> com o texto.
    const links = page.locator('a, [role="button"]').filter({ hasText: /^(aceitar|aceito|accept|concordo|entendi)( todos| all| cookies)?$/i });
    const n = await links.count().catch(() => 0);
    for (let i = 0; i < n; i++) {
        const l = links.nth(i);
        if (await l.isVisible().catch(() => false)) await l.click({ timeout: 2000 }).catch(() => {});
    }
}

/** Abre a URL sem esperar a rede ficar ociosa indefinidamente. */
async function load(page, url) {
    log(`  abrindo ${url}`);
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: NAV_TIMEOUT_MS });
    await page.waitForLoadState('load', { timeout: 10000 }).catch(() => {});
    await page.waitForLoadState('networkidle', { timeout: 4000 }).catch(() => {});
}

/**
 * Rola a página suavemente com a roda do mouse (funciona com libs de smooth scroll).
 * Controlado por tempo: termina em ~durationMs mesmo se cada evento demorar.
 */
async function smoothScroll(page, distance, durationMs) {
    await page.mouse.move(VIDEO.width / 2, VIDEO.height / 2);
    const startAt = Date.now();
    let done = 0;
    while (done < distance) {
        const elapsed = Date.now() - startAt;
        if (elapsed >= durationMs) break;
        const target = distance * Math.min(1, (elapsed + 50) / durationMs);
        const dy = Math.max(1, target - done);
        await page.mouse.wheel(0, dy);
        done += dy;
        await sleep(50);
    }
}

/** Escolhe até `max` links internos reais do menu, na ordem de preferência do site. */
async function pickMenuLinks(page, site, max) {
    const origin = new URL(site.url).origin;
    const current = new URL(page.url());
    const candidates = await page.evaluate(() => {
        const nodes = Array.from(document.querySelectorAll('header a[href], nav a[href]'));
        return nodes
            .filter((a) => {
                const r = a.getBoundingClientRect();
                const s = getComputedStyle(a);
                return r.width > 0 && r.height > 0 && s.visibility !== 'hidden' && s.display !== 'none' && r.top < window.innerHeight;
            })
            .map((a, idx) => ({ idx, text: (a.textContent || '').trim().replace(/\s+/g, ' '), href: a.href }));
    });
    const seen = new Set();
    const usable = candidates.filter((c) => {
        if (!c.text || c.text.length > 40) return false;
        let u;
        try { u = new URL(c.href); } catch { return false; }
        if (u.origin !== origin) return false;
        const key = u.pathname.replace(/\/$/, '') + u.hash;
        const curKey = current.pathname.replace(/\/$/, '');
        if (key === curKey || key === '' || key === '/pt' || seen.has(key)) return false;
        if (/^#?(home|inicio|início|top|topo)?$/i.test(u.hash) && u.pathname.replace(/\/$/, '') === curKey) return false;
        if (/login|entrar|admin|carrinho|cart|checkout|conta|account/i.test(c.text + u.pathname)) return false;
        seen.add(key);
        return true;
    });
    const picked = [];
    for (const re of site.prefer) {
        const hit = usable.find((c) => re.test(c.text) && !picked.includes(c));
        if (hit) picked.push(hit);
        if (picked.length >= max) break;
    }
    // Sem preferência encontrada: páginas internas antes de âncoras da mesma página.
    const rest = usable.filter((c) => !picked.includes(c));
    rest.sort((a, b) => Number(new URL(a.href).hash !== '') - Number(new URL(b.href).hash !== ''));
    for (const c of rest) {
        if (picked.length >= max) break;
        picked.push(c);
    }
    return picked.slice(0, max);
}

async function clickLink(page, link) {
    const loc = page.locator('header a[href], nav a[href]').filter({ hasText: link.text }).first();
    const before = page.url();
    log(`  menu: ${link.text}`);
    try {
        await loc.click({ timeout: 5000 });
    } catch {
        await page.goto(link.href, { waitUntil: 'domcontentloaded', timeout: NAV_TIMEOUT_MS });
    }
    if (page.url() !== before) await page.waitForLoadState('load', { timeout: 10000 }).catch(() => {});
    await page.waitForLoadState('networkidle', { timeout: 4000 }).catch(() => {});
}

async function screenshots(browser, site) {
    const shots = [
        { name: 'desktop', viewport: { width: 1440, height: 900 }, isMobile: false },
        { name: 'mobile', viewport: { width: 390, height: 844 }, isMobile: true },
    ];
    for (const s of shots) {
        const ctx = await browser.newContext({
            viewport: s.viewport,
            deviceScaleFactor: 2,
            isMobile: s.isMobile,
            hasTouch: s.isMobile,
            locale: 'pt-BR',
        });
        const page = await ctx.newPage();
        page.setDefaultTimeout(15000);
        await load(page, site.url);
        await sleep(1500);
        await dismissBanners(page);
        await sleep(2000); // animações de entrada
        const file = path.join(OUT, `${site.slug}-${s.name}.png`);
        await page.screenshot({ path: file, timeout: 15000 });
        log(`  print ${s.name} -> ${path.relative(ROOT, file)}`);
        if (!s.isMobile) {
            // Prints extras de páginas internas, para a galeria da página de detalhe.
            const links = await pickMenuLinks(page, site, 2).catch(() => []);
            for (const [i, link] of links.entries()) {
                try {
                    await load(page, link.href);
                    await sleep(1500);
                    await dismissBanners(page);
                    await sleep(1000);
                    const extra = path.join(OUT, `${site.slug}-pagina-${i + 1}.png`);
                    await page.screenshot({ path: extra, timeout: 15000 });
                    log(`  print ${link.text} -> ${path.relative(ROOT, extra)}`);
                } catch (err) {
                    log(`  aviso: print de ${link.text} falhou: ${err.message}`);
                }
            }
        }
        await ctx.close();
    }
}

async function video(browser, site) {
    const tmpDir = fs.mkdtempSync(path.join(OUT, `.video-${site.slug}-`));
    const ctx = await browser.newContext({
        viewport: VIDEO,
        deviceScaleFactor: 1,
        locale: 'pt-BR',
        recordVideo: { dir: tmpDir, size: VIDEO },
    });
    const t0 = Date.now();
    const page = await ctx.newPage();
    page.setDefaultTimeout(15000);
    const visited = [];

    await load(page, site.url);
    await sleep(800);
    await dismissBanners(page);
    // O vídeo começa aqui: corta o carregamento em branco.
    const start = (Date.now() - t0) / 1000;
    visited.push({ title: await page.title(), url: page.url() });

    await sleep(2500);
    const height = await page.evaluate(() => document.documentElement.scrollHeight - window.innerHeight);
    await smoothScroll(page, Math.min(height, 2600), 7000);
    await sleep(1200);
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'smooth' }));
    await sleep(1500);

    const links = await pickMenuLinks(page, site, 2);
    for (const link of links) {
        await clickLink(page, link);
        await sleep(2000);
        visited.push({ title: await page.title(), url: page.url(), via: link.text });
        const h = await page.evaluate(() => document.documentElement.scrollHeight - window.innerHeight);
        if (h > 100) await smoothScroll(page, Math.min(h, 1400), 4000);
        await sleep(1200);
    }
    const end = (Date.now() - t0) / 1000;

    const raw = await page.video().path();
    log('  fechando o contexto (grava o webm)');
    await withTimeout(ctx.close(), 60000, 'fechar contexto do vídeo');
    const mp4 = path.join(OUT, `${site.slug}-demo.mp4`);
    const poster = path.join(OUT, `${site.slug}-poster.jpg`);
    const duration = Math.max(5, end - start);
    log('  convertendo o vídeo (ffmpeg)');
    // Mesmo formato dos vídeos já publicados: H.264 High, 1920x950, 30 fps, sem áudio.
    // maxrate limita o tamanho a ~2 MB para ~25 s.
    execFileSync('ffmpeg', [
        '-y', '-loglevel', 'error',
        '-ss', start.toFixed(2), '-i', raw, '-t', duration.toFixed(2),
        '-vf', `scale=${VIDEO.width}:${VIDEO.height},fps=30`,
        '-c:v', 'libx264', '-profile:v', 'high', '-crf', '30', '-maxrate', '650k', '-bufsize', '1300k',
        '-preset', 'slow', '-pix_fmt', 'yuv420p',
        '-movflags', '+faststart', '-an', mp4,
    ], { timeout: 180000 });
    execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-ss', '2', '-i', mp4, '-frames:v', '1', '-q:v', '3', poster], { timeout: 30000 });
    fs.rmSync(tmpDir, { recursive: true, force: true });
    log(`  vídeo ${duration.toFixed(1)} s -> ${path.relative(ROOT, mp4)}`);
    return { duration: Number(duration.toFixed(1)), visited };
}

async function main() {
    const keys = process.argv.slice(2).filter((a) => !a.startsWith('--'));
    const targets = keys.length ? keys : Object.keys(SITES);
    const unknown = targets.filter((k) => !SITES[k]);
    if (unknown.length) {
        console.error(`Site desconhecido: ${unknown.join(', ')}. Use: ${Object.keys(SITES).join(' | ')}`);
        process.exit(1);
    }
    fs.mkdirSync(OUT, { recursive: true });

    // Teto do script inteiro: se algo travar, sai com erro em vez de esperar o timeout do job.
    setTimeout(() => {
        console.error(`Tempo total passou de ${TOTAL_LIMIT_MS / 60000} min; encerrando.`);
        process.exit(2);
    }, TOTAL_LIMIT_MS).unref();

    // CHROMIUM_PATH: opcional, para usar um Chromium já instalado na máquina.
    const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || undefined });
    const manifest = {};
    let failed = 0;
    try {
        for (const key of targets) {
            const site = SITES[key];
            log(`${key}: ${site.url}`);
            manifest[site.slug] = { url: site.url };
            const siteStart = Date.now();
            const left = () => Math.max(10000, SITE_LIMIT_MS - (Date.now() - siteStart));
            try {
                await withTimeout(screenshots(browser, site), left(), `prints de ${key}`);
            } catch (err) {
                failed++;
                manifest[site.slug].screenshotError = err.message;
                log(`  falha nos prints: ${err.message}`);
            }
            try {
                Object.assign(manifest[site.slug], await withTimeout(video(browser, site), left(), `vídeo de ${key}`));
            } catch (err) {
                failed++;
                manifest[site.slug].videoError = err.message;
                log(`  falha no vídeo: ${err.message}`);
            }
        }
    } finally {
        fs.writeFileSync(path.join(OUT, 'manifest.json'), JSON.stringify(manifest, null, 2));
        log('fechando o navegador');
        await withTimeout(browser.close(), 20000, 'fechar navegador').catch((err) => log(`aviso: ${err.message}`));
    }
    log(failed ? `terminou com ${failed} falha(s)` : 'terminou sem falhas');
    // Sai explicitamente: handles abertos do navegador já seguraram o processo até o timeout do job.
    process.exit(failed ? 1 : 0);
}

main().catch((err) => {
    console.error(err);
    process.exit(1);
});
