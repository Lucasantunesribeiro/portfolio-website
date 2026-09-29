# Portfólio — Lucas Antunes Ferreira

![C#](https://img.shields.io/badge/C%23-239120?style=flat&logo=c-sharp&logoColor=white)
![ASP.NET Core](https://img.shields.io/badge/ASP.NET_Core-512BD4?style=flat&logo=dotnet&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=flat&logo=react&logoColor=61DAFB)
![DevOps](https://img.shields.io/badge/DevOps-AWS%20%7C%20Azure%20%7C%20Vercel-232F3E?style=flat&logo=amazon-aws&logoColor=white)
![SQL](https://img.shields.io/badge/SQL-4479A1?style=flat&logo=postgresql&logoColor=white)

Site estático (HTML + CSS + JavaScript, sem framework nem build step) hospedado na Vercel.
No ar em <https://www.lucasafvr.com.br>. Só o diretório `public/` é publicado, e as
páginas são servidas com URL limpa (sem `.html`).

## Estrutura

```
Portfolio/
  public/                 # ÚNICO diretório publicado na Vercel (outputDirectory)
    index.html            # Página principal (hero, projetos com busca e filtro, sobre, timeline, certificados, contato)
    projetos/*.html       # Páginas de detalhe — GERADAS, não edite à mão (servidas como /projetos/<slug>)
    404.html
    robots.txt
    sitemap.xml           # GERADO
    css/
      style.css                    # Base, reset, navbar, hero (com vídeo de fundo)
      projetos.css                 # Cards, busca e filtro por stack da seção Projetos
      portfolio.css                # Cards em destaque, grupos de projetos, contato e ajustes das seções antigas
      sobre.css
      experiencias-habilidades.css # Só a timeline de experiências
      certificados.css             # Certificados e idiomas
      projeto-detalhe.css          # Só as páginas em projetos/ e a 404
    js/
      main.js                      # Motor de i18n, menu, barra de progresso, header fixo
      projetos.js                  # Busca por nome/stack e filtro por tecnologia (esconde grupos vazios)
      experiencias.js              # Botão "Ver mais" da timeline
    assets/               # Imagens, vídeos, currículo
  scripts/                # Geradores e o servidor local (não são publicados)
  vercel.json             # Configuração da Vercel (outputDirectory, cleanUrls, headers)
  README.md
```

Tudo que está fora de `public/` — `scripts/`, `package.json`, `README.md`, `docs/`,
`readme/`, `node_modules/` — fica fora da saída publicada. Não é bloqueio por
JavaScript: esses arquivos simplesmente não vão para o ar.

## Como rodar localmente

O jeito mais fiel é o servidor local, que imita a Vercel: serve só `public/`, resolve
as URLs sem extensão, comprime com gzip e envia os mesmos headers de segurança do
`vercel.json`.

```bash
npm run dev          # http://localhost:8000
PORT=3000 npm run dev   # outra porta (no PowerShell: $env:PORT=3000; npm run dev)
```

`python -m http.server` ou `npx serve` também servem o site, mas não resolvem
`/projetos/<slug>` sem `.html` nem aplicam os headers — para validar o comportamento
real, use o `npm run dev`.

## Scripts de geração

O site não tem build step: o HTML é versionado pronto. Os scripts abaixo
regeneram artefatos e só precisam rodar quando o conteúdo muda.

```bash
npm install                  # instala sharp (só para gerar imagens)

npm run gen:pages            # regenera public/projetos/*.html
npm run gen:sitemap          # regenera public/sitemap.xml
npm run gen:images           # regenera public/assets/og-image.png e public/assets/hero-poster.jpg
npm run gen                   # roda os três
```

| Script | O que faz |
| --- | --- |
| `scripts/projects-data.js` | **Fonte da verdade** do conteúdo das páginas de detalhe. É aqui que se edita texto de projeto. |
| `scripts/generate_project_pages.js` | Renderiza `public/projetos/*.html` a partir do arquivo acima. |
| `scripts/generate_sitemap.js` | Renderiza `public/sitemap.xml` com a home + uma URL por projeto (sem `.html`). |
| `scripts/generate_og_image.js` | Gera a imagem de preview de link (`og-image.png`) e o poster do vídeo do hero. |
| `scripts/generate_mockups.js`, `scripts/create_custom_mockup.js` | Geram os mockups dos cards de projeto (usam Playwright). |
| `scripts/serve.js` | Servidor local (`npm run dev`). Não faz parte do site publicado. |

## Projetos em destaque e mídia

A seção `#projetos` tem dois grupos, com o mesmo design de card: **Em destaque** (Torre Logística, Central Antifraude e Prisma RH, com vídeo) e **Outros projetos**. A busca (`#project-search`) casa com título, descrição e tecnologias; os botões filtram por stack. Ambos valem para os dois grupos, e um grupo sem resultado some junto com o título. Para a busca achar uma tecnologia, ela precisa estar no `data-tags` do card.

Os três destaques também têm página de detalhe, geradas de `scripts/projects-data.js` (com vídeo, galeria e links de release e pentest). Cada número exibido (testes, pentests, rotas) vem do README ou do relatório de segurança do respectivo repositório; ao atualizar um projeto, confira esses números.

- `public/assets/projetos/*-demo.mp4`: vídeos curtos (24–33 s, sem áudio, H.264 com `faststart`), 1920x950. São cópias **recortadas** das versões finais curtas: a faixa preta inferior e a barra do navegador da gravação foram cortadas com `ffmpeg -vf crop`. As gravações originais não foram alteradas, e as versões longas (~45 MB) não são usadas.
- `public/assets/projetos/*-poster.jpg`: quadro de cada vídeo, usado como `poster`.
- Os vídeos usam `controls`, `preload="metadata"` e `playsinline`; nada toca sozinho com áudio.
- Demos fora do ar não têm botão (SmartFinance e Emissão de NF-e, conferidos em 2026-09-29).

> Ao adicionar ou remover um projeto: edite `scripts/projects-data.js`, ajuste o
> card correspondente em `index.html` e rode `npm run gen`.

## Internacionalização (PT / EN)

A tradução é feita por atributos no próprio HTML, resolvidos por `js/main.js`.
Não existe um segundo dicionário separado — se um texto precisa traduzir, ele
recebe um atributo e uma chave no dicionário de `main.js`.

| Atributo | Efeito |
| --- | --- |
| `data-i18n="chave"` | Troca o conteúdo do elemento |
| `data-i18n-html="chave"` | Idem, para textos com `<strong>`, `<br>` etc. |
| `data-i18n-placeholder="chave"` | Troca o `placeholder` do input |
| `data-i18n-short` / `data-i18n-full` | Trocam os atributos `data-short`/`data-full` da timeline |
| `data-i18n-alt="chave"` | Troca o `alt` de imagens |
| `data-i18n-aria="chave"` | Troca o `aria-label` |

O idioma escolhido é salvo em `localStorage` (`portfolio-lang`). Na primeira
visita, o idioma do navegador decide entre PT e EN.

## Deploy, URLs limpas e segurança (`vercel.json`)

- **Publicação**: `outputDirectory: "public"` — só o conteúdo de `public/` é publicado.
  `scripts/`, `README.md`, `package.json`, `package-lock.json`, `docs/`, `readme/` e
  `node_modules/` ficam fora da saída (não dependem de nada em runtime).
- **URLs limpas**: `cleanUrls: true` serve `/projetos/torre-logistica` e a Vercel
  redireciona (308) `/projetos/torre-logistica.html` para a forma sem `.html`.
  `trailingSlash: false` remove a barra final. Links internos, cards, sitemap e
  `canonical`/`og:url` já usam a forma limpa.
- **CSP** (restritiva, montada sobre o que o site realmente carrega):
  `default-src 'self'`, `script-src 'self'`, `style-src 'self'` + Google Fonts +
  cdnjs, `font-src 'self'` + `fonts.gstatic.com` + cdnjs, `img-src 'self'`,
  `media-src 'self'`, `connect-src 'self'` + as origens de fonte/CDN (para o
  `preconnect`), `object-src 'none'`, `frame-src 'none'`, `base-uri 'none'`,
  `form-action 'none'`, `frame-ancestors 'none'` e `upgrade-insecure-requests`.
  Sem `unsafe-inline` nem `unsafe-eval`; `script-src-attr 'none'` e
  `style-src-attr 'none'` fecham eventos e `style=` inline — por isso não há
  atributo `style` no HTML (os que existiam viraram classes em `portfolio.css`).
- **Demais headers**: `Strict-Transport-Security` (2 anos, `includeSubDomains`),
  `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`,
  `Referrer-Policy: strict-origin-when-cross-origin`,
  `Cross-Origin-Opener-Policy: same-origin` e `Permissions-Policy` fechando câmera,
  microfone, geolocalização, pagamento, USB, serial e bluetooth.
- **Cache de `/assets`**: 7 dias com `stale-while-revalidate`. Deliberadamente **sem `immutable`** — os arquivos não têm hash no nome, então trocar um mockup mantendo o mesmo nome precisa surtir efeito em dias, não em um ano.
- **Cache de `/css` e `/js`**: 1 hora com revalidação, porque mudam junto com o HTML.
- `404.html` é servido automaticamente pela Vercel em rotas inexistentes.
- O Font Awesome é carregado do cdnjs com `integrity` (SRI sha512) e `crossorigin`;
  se o arquivo remoto mudar, o navegador recusa e o site cai nas fontes do sistema.

## Analytics

O `index.html` e as páginas de detalhe carregam o script do **Vercel Web
Analytics** (`/_vercel/insights/script.js`). Ele só responde depois de habilitar
*Web Analytics* no painel do projeto na Vercel — antes disso o request retorna
404 sem quebrar nada na página. O script é same-origin, então `script-src 'self'`
já o cobre, e o beacon dele também é same-origin (`connect-src 'self'`).

## Dependências externas em runtime

Carregadas por CDN, sem bundler (sem jQuery nem biblioteca de animação; o scroll suave é CSS):

- [Google Fonts — Inter](https://fonts.google.com/specimen/Inter)
- [Font Awesome 6](https://fontawesome.com/)
