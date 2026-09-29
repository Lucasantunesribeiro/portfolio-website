/**
 * Servidor local que imita a Vercel: serve só `public/`, aplica os mesmos cabeçalhos do
 * `vercel.json` (inclusive a CSP) e resolve as URLs sem extensão (`/projetos/torre-logistica`).
 * Suporta Range, que o navegador exige para buscar vídeo.
 *
 * Uso: npm run dev   (porta 8000; outra porta: PORT=3000 npm run dev)
 *
 * Não é um framework: é só o mínimo para validar o site como ele roda em produção.
 */
const http = require('http');
const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

const ROOT = path.resolve(path.join(__dirname, '..', 'public'));
const NOT_FOUND = path.join(ROOT, '404.html');
const CONFIG = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'vercel.json'), 'utf8'));
const PORT = Number(process.env.PORT) || 8000;

const TYPES = {
    '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8',
    '.js': 'text/javascript; charset=utf-8', '.mjs': 'text/javascript; charset=utf-8',
    '.json': 'application/json; charset=utf-8', '.map': 'application/json; charset=utf-8',
    '.xml': 'application/xml; charset=utf-8', '.txt': 'text/plain; charset=utf-8',
    '.webmanifest': 'application/manifest+json; charset=utf-8',
    '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp',
    '.gif': 'image/gif', '.svg': 'image/svg+xml', '.ico': 'image/x-icon', '.avif': 'image/avif',
    '.mp4': 'video/mp4', '.webm': 'video/webm', '.pdf': 'application/pdf',
    '.woff': 'font/woff', '.woff2': 'font/woff2', '.ttf': 'font/ttf', '.otf': 'font/otf',
};

/** Converte o `source` do vercel.json (ex.: "/(css|js)/(.*)") em RegExp. */
function toRegExp(source) {
    return new RegExp('^' + source.replace(/\//g, '\\/') + '$');
}

/** Cabeçalhos do vercel.json que casam com o caminho informado (a última regra vence). */
function headersFor(urlPath) {
    const out = {};
    for (const rule of CONFIG.headers || []) {
        if (toRegExp(rule.source).test(urlPath)) for (const h of rule.headers) out[h.key] = h.value;
    }
    return out;
}

/** Resolve um caminho da URL para um arquivo dentro de `public/`. `null` se não existir. */
function resolveFile(urlPath) {
    const target = path.resolve(path.join(ROOT, urlPath));
    if (target !== ROOT && !target.startsWith(ROOT + path.sep)) return null; // path traversal
    const candidates = [target, target + '.html', path.join(target, 'index.html')];
    for (const c of candidates) {
        try {
            if (fs.statSync(c).isFile()) return c;
        } catch { /* tenta o próximo */ }
    }
    return null;
}

function send(res, status, headers, body) {
    res.writeHead(status, headers);
    if (body === undefined) return res.end();
    if (typeof body === 'string' || Buffer.isBuffer(body)) return res.end(body);
    body.pipe(res);
}

function sendRedirect(res, location, extra) {
    send(res, 308, { ...extra, Location: location, 'Content-Type': 'text/plain; charset=utf-8' },
        `Redirecionando para ${location}\n`);
}

function sendNotFound(req, res, base) {
    const headers = { ...base, 'Content-Type': TYPES['.html'] };
    if (!fs.existsSync(NOT_FOUND)) return send(res, 404, { ...headers, 'Content-Type': 'text/plain; charset=utf-8' }, 'Not found\n');
    const stat = fs.statSync(NOT_FOUND);
    send(res, 404, { ...headers, 'Content-Length': stat.size }, req.method === 'HEAD' ? undefined : fs.createReadStream(NOT_FOUND));
}

/** Tipos que valem a pena comprimir (a Vercel já comprime em produção). */
const COMPRESSIBLE = /^(text\/|application\/(json|xml|manifest\+json)|image\/svg)/;

/** Resposta com Range (206), 416 quando inválido, ou 200 completo (com gzip quando dá). */
function sendFile(req, res, file, base) {
    const stat = fs.statSync(file);
    const type = TYPES[path.extname(file)] || 'application/octet-stream';
    const headers = { ...base, 'Content-Type': type, 'Accept-Ranges': 'bytes', 'Vary': 'Accept-Encoding' };
    const isHead = req.method === 'HEAD';

    const match = /^bytes=(\d*)-(\d*)$/.exec(req.headers.range || '');
    if (match && (match[1] || match[2])) {
        const size = stat.size;
        const start = match[1] ? Number(match[1]) : Math.max(0, size - Number(match[2]));
        const end = match[1] && match[2] ? Math.min(Number(match[2]), size - 1) : size - 1;
        if (!Number.isFinite(start) || !Number.isFinite(end) || start > end || start >= size) {
            return send(res, 416, { ...base, 'Content-Range': `bytes */${size}` }, 'Range inválido\n');
        }
        return send(res, 206, { ...headers, 'Content-Range': `bytes ${start}-${end}/${size}`, 'Content-Length': end - start + 1 },
            isHead ? undefined : fs.createReadStream(file, { start, end }));
    }

    // Sem Range: comprime texto se o cliente aceitar (sem Content-Length, vai chunked).
    if (/\bgzip\b/i.test(req.headers['accept-encoding'] || '') && COMPRESSIBLE.test(type)) {
        return send(res, 200, { ...headers, 'Content-Encoding': 'gzip' },
            isHead ? undefined : fs.createReadStream(file).pipe(zlib.createGzip()));
    }

    send(res, 200, { ...headers, 'Content-Length': stat.size }, isHead ? undefined : fs.createReadStream(file));
}

http.createServer((req, res) => {
    if (req.method !== 'GET' && req.method !== 'HEAD') {
        return send(res, 405, { Allow: 'GET, HEAD', 'Content-Type': 'text/plain; charset=utf-8' }, 'Método não permitido\n');
    }

    let url;
    try {
        url = new URL(req.url, 'http://localhost');
        // decodeURIComponent pode lançar em percent-encoding malformado
        decodeURIComponent(url.pathname);
    } catch {
        return send(res, 400, { 'Content-Type': 'text/plain; charset=utf-8' }, 'Requisição inválida\n');
    }

    let pathname;
    try {
        pathname = decodeURIComponent(url.pathname);
    } catch {
        return send(res, 400, { 'Content-Type': 'text/plain; charset=utf-8' }, 'Requisição inválida\n');
    }

    const base = headersFor(url.pathname);

    // cleanUrls: /x.html e /index.html redirecionam para a forma limpa (sem loop)
    if (CONFIG.cleanUrls && /\.html$/i.test(pathname)) {
        const clean = (pathname.replace(/(^|\/)index\.html$/i, '$1').replace(/\.html$/i, '') || '/') + url.search;
        return sendRedirect(res, clean, base);
    }
    // trailingSlash: false
    if (CONFIG.trailingSlash === false && pathname.length > 1 && pathname.endsWith('/')) {
        return sendRedirect(res, pathname.slice(0, -1) + url.search, base);
    }

    const file = resolveFile(pathname === '/' ? '/index.html' : pathname);
    if (!file) return sendNotFound(req, res, base);

    sendFile(req, res, file, base);
}).listen(PORT, () => {
    console.log(`http://localhost:${PORT}  (servindo ${path.relative(process.cwd(), ROOT) || '.'}/)`);
});
