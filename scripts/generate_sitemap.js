/**
 * Gera sitemap.xml a partir da lista de projetos.
 *
 * Uso: node scripts/generate_sitemap.js
 * Rode junto com generate_project_pages.js sempre que adicionar/remover projeto.
 */

const fs = require('fs');
const path = require('path');
const projects = require('./projects-data');

const SITE = 'https://www.lucasafvr.com.br';
const OUT = path.join(__dirname, '..', 'sitemap.xml');
const today = new Date().toISOString().slice(0, 10);

const urls = [
    { loc: `${SITE}/`, priority: '1.0', changefreq: 'monthly' },
    ...projects.map((p) => ({
        loc: `${SITE}/projetos/${p.slug}.html`,
        priority: '0.8',
        changefreq: 'yearly',
    })),
];

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
        .map(
            (u) => `    <url>
        <loc>${u.loc}</loc>
        <lastmod>${today}</lastmod>
        <changefreq>${u.changefreq}</changefreq>
        <priority>${u.priority}</priority>
    </url>`
        )
        .join('\n')}
</urlset>
`;

fs.writeFileSync(OUT, xml, 'utf8');
console.log(`OK -> sitemap.xml (${urls.length} URLs)`);
