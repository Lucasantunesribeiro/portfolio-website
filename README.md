# Portfólio — Lucas Antunes Ferreira

![C#](https://img.shields.io/badge/C%23-239120?style=flat&logo=c-sharp&logoColor=white)
![ASP.NET Core](https://img.shields.io/badge/ASP.NET_Core-512BD4?style=flat&logo=dotnet&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=flat&logo=react&logoColor=61DAFB)
![DevOps](https://img.shields.io/badge/DevOps-AWS%20%7C%20Azure%20%7C%20Vercel-232F3E?style=flat&logo=amazon-aws&logoColor=white)
![SQL](https://img.shields.io/badge/SQL-4479A1?style=flat&logo=postgresql&logoColor=white)

Site estático (HTML + CSS + JavaScript, sem framework nem build step) hospedado na Vercel.
No ar em <https://www.lucasafvr.com.br>.

## Estrutura

```
Portfolio/
  index.html              # Página principal (hero, sobre, projetos, timeline, skills, certificados)
  projetos/*.html         # Páginas de detalhe — GERADAS, não edite à mão
  robots.txt
  sitemap.xml             # GERADO
  css/
    style.css                    # Base, reset, navbar, hero
    sobre.css
    projetos.css
    experiencias-habilidades.css
    certificados.css             # Certificados e idiomas
    projeto-detalhe.css          # Só as páginas em projetos/
  js/
    main.js                      # Motor de i18n, timeline, menu, scroll
    projetos.js                  # Filtro por stack e busca
    experiencias-habilidades.js  # Toggle "Ver mais" e filtro de skills
  scripts/                # Geradores (rodam em Node, fora do runtime do site)
  assets/                 # Imagens, vídeos, currículo
```

## Como rodar localmente

Qualquer servidor estático serve. Abrir o `index.html` direto pelo `file://`
funciona parcialmente, mas quebra caminhos absolutos — prefira um servidor:

```bash
python -m http.server 8000
# ou
npx serve .
```

Depois acesse <http://localhost:8000>.

## Scripts de geração

O site não tem build step: o HTML é versionado pronto. Os scripts abaixo
regeneram artefatos e só precisam rodar quando o conteúdo muda.

```bash
npm install                  # instala sharp (só para gerar imagens)

npm run gen:pages            # regenera projetos/*.html
npm run gen:sitemap          # regenera sitemap.xml
npm run gen:images           # regenera assets/og-image.png e assets/hero-poster.jpg
npm run gen                   # roda os três
```

| Script | O que faz |
| --- | --- |
| `scripts/projects-data.js` | **Fonte da verdade** do conteúdo das páginas de detalhe. É aqui que se edita texto de projeto. |
| `scripts/generate_project_pages.js` | Renderiza `projetos/*.html` a partir do arquivo acima. |
| `scripts/generate_sitemap.js` | Renderiza `sitemap.xml` com a home + uma URL por projeto. |
| `scripts/generate_og_image.js` | Gera a imagem de preview de link (`og-image.png`) e o poster do vídeo do hero. |
| `scripts/generate_mockups.js`, `scripts/create_custom_mockup.js` | Geram os mockups dos cards de projeto (usam Playwright). |

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

O idioma escolhido é salvo em `localStorage` (`portfolio-lang`). Na primeira
visita, o idioma do navegador decide entre PT e EN.

## Deploy e headers (`vercel.json`)

- **Segurança**: `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy` e `Permissions-Policy` em todas as rotas.
- **Cache de `/assets`**: 7 dias com `stale-while-revalidate`. Deliberadamente **sem `immutable`** — os arquivos não têm hash no nome, então trocar um mockup mantendo o mesmo nome precisa surtir efeito em dias, não em um ano.
- **Cache de `/css` e `/js`**: 1 hora com revalidação, porque mudam junto com o HTML.
- `404.html` é servido automaticamente pela Vercel em rotas inexistentes.

## Analytics

O `index.html` e as páginas de detalhe carregam o script do **Vercel Web
Analytics** (`/_vercel/insights/script.js`). Ele só responde depois de habilitar
*Web Analytics* no painel do projeto na Vercel — antes disso o request retorna
404 sem quebrar nada na página.

## Dependências externas em runtime

Carregadas por CDN, sem bundler:

- [Google Fonts — Inter](https://fonts.google.com/specimen/Inter)
- [Font Awesome 6](https://fontawesome.com/)
- [AOS](https://michalsnik.github.io/aos/) — animações de scroll
- [jQuery 3.7](https://jquery.com/) — usado apenas pelo scroll suave legado
