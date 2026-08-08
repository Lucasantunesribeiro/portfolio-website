/**
 * Gera as páginas de detalhe em `projetos/` a partir de `scripts/projects-data.js`.
 *
 * Uso: node scripts/generate_project_pages.js
 *
 * O site é estático e não tem build step, então o HTML gerado é versionado.
 * Edite o conteúdo em projects-data.js e rode este script de novo — nunca
 * edite os arquivos em `projetos/` à mão, eles serão sobrescritos.
 */

const fs = require('fs');
const path = require('path');
const projects = require('./projects-data');

const OUT_DIR = path.join(__dirname, '..', 'projetos');
const SITE = 'https://www.lucasafvr.com.br';

/** Escapa texto que vai para atributos HTML. */
function attr(str) {
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/"/g, '&quot;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
}

/** Remove tags para usar o texto em meta description. */
function plain(str) {
    return String(str).replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
}

function renderPage(project, index, all) {
    const prev = all[(index - 1 + all.length) % all.length];
    const next = all[(index + 1) % all.length];

    const description = plain(project.overview[0]).slice(0, 180);

    const tags = project.tags
        .map((tag) => `                    <span class="pd-tag">${attr(tag)}</span>`)
        .join('\n');

    const facts = project.facts
        .map(
            (fact) => `                <div class="pd-fact">
                    <dt class="pd-fact-label">${attr(fact.label)}</dt>
                    <dd class="pd-fact-value">${fact.value}</dd>
                </div>`
        )
        .join('\n');

    const overview = project.overview.map((p) => `                <p>${p}</p>`).join('\n');

    const layers = project.architecture.layers
        .map(
            (layer) => `                    <li class="pd-layer">
                        <code class="pd-layer-name">${attr(layer.name)}</code>
                        <span class="pd-layer-desc">${layer.desc}</span>
                    </li>`
        )
        .join('\n');

    const steps = project.flow.steps.map((s) => `                    <li>${s}</li>`).join('\n');
    const highlights = project.highlights.map((h) => `                    <li>${h}</li>`).join('\n');
    const limits = project.limits.map((l) => `                    <li>${l}</li>`).join('\n');

    const demoButton = project.demo
        ? `                    <a class="pd-btn pd-btn-secondary" href="${attr(project.demo)}" target="_blank" rel="noopener noreferrer">
                        <i class="fas fa-external-link-alt" aria-hidden="true"></i>
                        <span>Ver demo</span>
                    </a>`
        : '';

    const badge = project.badge
        ? `                <p class="pd-badge">${attr(project.badge)}</p>\n`
        : '';

    return `<!DOCTYPE html>
<html lang="pt-BR">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <title>${attr(project.title)} — Lucas Antunes Ferreira</title>
    <meta name="description" content="${attr(description)}">
    <meta name="author" content="Lucas Antunes Ferreira">
    <meta name="robots" content="index, follow">
    <meta name="theme-color" content="#0B1120">
    <link rel="canonical" href="${SITE}/projetos/${project.slug}.html">

    <meta property="og:type" content="article">
    <meta property="og:url" content="${SITE}/projetos/${project.slug}.html">
    <meta property="og:site_name" content="Lucas Antunes Ferreira">
    <meta property="og:locale" content="pt_BR">
    <meta property="og:title" content="${attr(project.title)} — ${attr(project.subtitle)}">
    <meta property="og:description" content="${attr(description)}">
    <meta property="og:image" content="${SITE}/assets/og-image.png">
    <meta property="og:image:width" content="1200">
    <meta property="og:image:height" content="630">

    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${attr(project.title)} — ${attr(project.subtitle)}">
    <meta name="twitter:description" content="${attr(description)}">
    <meta name="twitter:image" content="${SITE}/assets/og-image.png">

    <link rel="icon" href="../assets/favicon.ico" type="image/x-icon">

    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "SoftwareSourceCode",
      "name": ${JSON.stringify(project.title)},
      "description": ${JSON.stringify(description)},
      "codeRepository": ${JSON.stringify(project.repo)},
      "programmingLanguage": ${JSON.stringify(project.tags)},
      "author": {
        "@type": "Person",
        "name": "Lucas Antunes Ferreira",
        "url": "${SITE}/"
      }
    }
    </script>

    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    <link rel="stylesheet" href="../css/style.css">
    <link rel="stylesheet" href="../css/projeto-detalhe.css">

    <script defer src="/_vercel/insights/script.js"></script>
</head>

<body class="pd-body">
    <a class="pd-skip" href="#conteudo">Pular para o conteúdo</a>

    <nav class="pd-nav">
        <div class="pd-container">
            <a href="../index.html" class="pd-back">
                <i class="fas fa-arrow-left" aria-hidden="true"></i>
                <span>Voltar ao portfólio</span>
            </a>
            <a href="../index.html#projetos" class="pd-nav-link">Todos os projetos</a>
        </div>
    </nav>

    <main id="conteudo">
        <!-- ==================== HERO ==================== -->
        <header class="pd-hero">
            <div class="pd-container">
${badge}                <h1 class="pd-title">${attr(project.title)}</h1>
                <p class="pd-subtitle">${attr(project.subtitle)}</p>

                <div class="pd-tags" aria-label="Tecnologias utilizadas">
${tags}
                </div>

                <div class="pd-actions">
                    <a class="pd-btn pd-btn-primary" href="${attr(project.repo)}" target="_blank" rel="noopener noreferrer">
                        <i class="fab fa-github" aria-hidden="true"></i>
                        <span>Ver código no GitHub</span>
                    </a>
${demoButton}
                </div>
            </div>
        </header>

        <div class="pd-container pd-content">
            <img class="pd-image" src="${attr(project.image)}" alt="Interface do projeto ${attr(project.title)}"
                loading="lazy" decoding="async" width="1200" height="750">

            <!-- ==================== FICHA TÉCNICA ==================== -->
            <dl class="pd-facts">
${facts}
            </dl>

            <!-- ==================== VISÃO GERAL ==================== -->
            <section class="pd-section">
                <h2 class="pd-section-title">Visão geral</h2>
${overview}
            </section>

            <!-- ==================== ARQUITETURA ==================== -->
            <section class="pd-section">
                <h2 class="pd-section-title">Arquitetura</h2>
                <p>${project.architecture.summary}</p>
                <ul class="pd-layers">
${layers}
                </ul>
            </section>

            <!-- ==================== FLUXO ==================== -->
            <section class="pd-section">
                <h2 class="pd-section-title">${attr(project.flow.title)}</h2>
                <ol class="pd-steps">
${steps}
                </ol>
            </section>

            <!-- ==================== PONTOS FORTES ==================== -->
            <section class="pd-section">
                <h2 class="pd-section-title">Pontos fortes</h2>
                <ul class="pd-list pd-list-positive">
${highlights}
                </ul>
            </section>

            <!-- ==================== LIMITES ==================== -->
            <section class="pd-section">
                <h2 class="pd-section-title">Limites e decisões conscientes</h2>
                <p class="pd-limits-intro">
                    O que este projeto <strong>não</strong> faz, e por quê. Descrever isso com precisão vale mais do
                    que exagerar o escopo.
                </p>
                <ul class="pd-list pd-list-caveat">
${limits}
                </ul>
            </section>

            <!-- ==================== NAVEGAÇÃO ==================== -->
            <nav class="pd-pager" aria-label="Navegação entre projetos">
                <a class="pd-pager-link pd-pager-prev" href="${prev.slug}.html">
                    <span class="pd-pager-label"><i class="fas fa-chevron-left" aria-hidden="true"></i> Anterior</span>
                    <span class="pd-pager-title">${attr(prev.title)}</span>
                </a>
                <a class="pd-pager-link pd-pager-next" href="${next.slug}.html">
                    <span class="pd-pager-label">Próximo <i class="fas fa-chevron-right" aria-hidden="true"></i></span>
                    <span class="pd-pager-title">${attr(next.title)}</span>
                </a>
            </nav>
        </div>
    </main>

    <footer class="pd-footer">
        <div class="pd-container">
            <p>
                <a href="mailto:lucas.afvr@gmail.com">lucas.afvr@gmail.com</a>
                <span aria-hidden="true">·</span>
                <a href="https://www.linkedin.com/in/lucasantunesferreira/" target="_blank"
                    rel="noopener noreferrer">LinkedIn</a>
                <span aria-hidden="true">·</span>
                <a href="https://github.com/Lucasantunesribeiro" target="_blank"
                    rel="noopener noreferrer">GitHub</a>
            </p>
            <p class="pd-footer-copy">&copy; ${new Date().getFullYear()} Lucas Antunes Ferreira</p>
        </div>
    </footer>
</body>

</html>
`;
}

function main() {
    fs.mkdirSync(OUT_DIR, { recursive: true });

    const slugs = new Set();
    projects.forEach((p) => {
        if (slugs.has(p.slug)) throw new Error(`slug duplicado: ${p.slug}`);
        slugs.add(p.slug);
    });

    projects.forEach((project, i) => {
        const html = renderPage(project, i, projects);
        const file = path.join(OUT_DIR, `${project.slug}.html`);
        fs.writeFileSync(file, html, 'utf8');
        console.log(`OK -> projetos/${project.slug}.html (${html.length} bytes)`);
    });

    console.log(`\n${projects.length} páginas geradas.`);
}

main();
