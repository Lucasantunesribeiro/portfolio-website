/**
 * Gera assets/og-image.png (1200x630) — imagem de preview usada em
 * og:image / twitter:image quando o link do portfolio e compartilhado.
 *
 * Uso: node scripts/generate_og_image.js
 */

const sharp = require('sharp');
const path = require('path');

const W = 1200;
const H = 630;
const OUT = path.join(__dirname, '..', 'assets', 'og-image.png');

const svg = `<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#0B1120"/>
      <stop offset="55%" stop-color="#111C33"/>
      <stop offset="100%" stop-color="#0B1120"/>
    </linearGradient>
    <linearGradient id="accent" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#38BDF8"/>
      <stop offset="100%" stop-color="#818CF8"/>
    </linearGradient>
  </defs>

  <rect width="${W}" height="${H}" fill="url(#bg)"/>

  <circle cx="1020" cy="120" r="260" fill="#38BDF8" opacity="0.10"/>
  <circle cx="140" cy="560" r="220" fill="#818CF8" opacity="0.09"/>

  <rect x="80" y="150" width="86" height="6" rx="3" fill="url(#accent)"/>

  <text x="80" y="248" font-family="Segoe UI, Arial, Helvetica, sans-serif" font-size="66" font-weight="700" fill="#F8FAFC">Lucas Antunes Ferreira</text>
  <text x="80" y="318" font-family="Segoe UI, Arial, Helvetica, sans-serif" font-size="36" font-weight="600" fill="#38BDF8">Desenvolvedor .NET &amp; React</text>

  <text x="80" y="382" font-family="Segoe UI, Arial, Helvetica, sans-serif" font-size="26" fill="#94A3B8">C# · ASP.NET Core · EF Core · SQL Server · React · TypeScript</text>
  <text x="80" y="422" font-family="Segoe UI, Arial, Helvetica, sans-serif" font-size="26" fill="#94A3B8">Clean Architecture · DDD · Docker · AWS · Azure</text>

  <g font-family="Segoe UI, Arial, Helvetica, sans-serif" font-size="22" font-weight="600">
    <rect x="80" y="472" width="150" height="46" rx="23" fill="#1E293B" stroke="#334155"/>
    <text x="105" y="502" fill="#E2E8F0">.NET 9</text>

    <rect x="246" y="472" width="132" height="46" rx="23" fill="#1E293B" stroke="#334155"/>
    <text x="271" y="502" fill="#E2E8F0">React</text>

    <rect x="394" y="472" width="176" height="46" rx="23" fill="#1E293B" stroke="#334155"/>
    <text x="419" y="502" fill="#E2E8F0">SQL Server</text>

    <rect x="586" y="472" width="136" height="46" rx="23" fill="#1E293B" stroke="#334155"/>
    <text x="611" y="502" fill="#E2E8F0">Docker</text>
  </g>

  <text x="80" y="580" font-family="Segoe UI, Arial, Helvetica, sans-serif" font-size="24" font-weight="500" fill="#64748B">lucasafvr.com.br</text>
</svg>`;

/**
 * Poster do video do hero. Serve como primeiro quadro enquanto o .mp4
 * carrega (e como imagem final em conexoes lentas / prefers-reduced-motion),
 * evitando o flash de tela preta sem custar quase nada de banda.
 */
const POSTER_OUT = path.join(__dirname, '..', 'assets', 'hero-poster.jpg');
const posterSvg = `<svg width="1920" height="1080" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="p" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#0B1120"/>
      <stop offset="50%" stop-color="#141F38"/>
      <stop offset="100%" stop-color="#080D18"/>
    </linearGradient>
  </defs>
  <rect width="1920" height="1080" fill="url(#p)"/>
  <circle cx="1500" cy="260" r="420" fill="#38BDF8" opacity="0.07"/>
  <circle cx="320" cy="880" r="380" fill="#818CF8" opacity="0.06"/>
</svg>`;

Promise.all([
    sharp(Buffer.from(svg))
        .png({ compressionLevel: 9 })
        .toFile(OUT),
    sharp(Buffer.from(posterSvg))
        .jpeg({ quality: 72, mozjpeg: true })
        .toFile(POSTER_OUT),
])
    .then(([og, poster]) => {
        console.log(`OK -> ${OUT} (${og.width}x${og.height}, ${og.size} bytes)`);
        console.log(`OK -> ${POSTER_OUT} (${poster.width}x${poster.height}, ${poster.size} bytes)`);
    })
    .catch((err) => {
        console.error('Falha ao gerar imagens:', err);
        process.exit(1);
    });
