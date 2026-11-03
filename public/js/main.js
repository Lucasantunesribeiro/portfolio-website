document.addEventListener('DOMContentLoaded', function () {
	// Vídeo de fundo do hero: economiza bateria e respeita prefers-reduced-motion
	const heroVideo = document.querySelector('.hero-video');
	if (heroVideo && (window.matchMedia('(prefers-reduced-motion: reduce)').matches || window.innerWidth < 768)) {
		heroVideo.pause();
	}

	// Avatar da seção Sobre: só toca quando aparece na tela e o usuário não pediu
	// menos movimento. Sem isso o vídeo baixaria e rodaria fora da vista.
	const avatar = document.querySelector('.profile-img');
	if (avatar && 'IntersectionObserver' in window &&
		!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
		const avatarObserver = new IntersectionObserver((entries) => {
			entries.forEach((entry) => {
				if (entry.isIntersecting) {
					avatar.play().catch(() => { /* autoplay bloqueado: fica o poster */ });
				} else {
					avatar.pause();
				}
			});
		}, { threshold: 0.25 });
		avatarObserver.observe(avatar);
	}

	// ==================== MENU MOBILE ====================
	const menuToggle = document.querySelector('.menu-toggle');
	const navLinks = document.querySelector('.nav-links');

	function setMenu(open) {
		if (!menuToggle || !navLinks) return;
		navLinks.classList.toggle('active', open);
		menuToggle.classList.toggle('active', open);
		menuToggle.setAttribute('aria-expanded', String(open));
	}

	if (menuToggle && navLinks) {
		menuToggle.addEventListener('click', (e) => {
			e.stopPropagation();
			setMenu(!navLinks.classList.contains('active'));
		});
		navLinks.querySelectorAll('a, #toggle-lang').forEach((link) => {
			link.addEventListener('click', () => setMenu(false));
		});
		document.addEventListener('click', (e) => {
			if (!navLinks.contains(e.target) && !menuToggle.contains(e.target)) setMenu(false);
		});
		document.addEventListener('keydown', (e) => {
			if (e.key === 'Escape' && navLinks.classList.contains('active')) {
				setMenu(false);
				menuToggle.focus();
			}
		});
		window.addEventListener('resize', () => {
			if (window.innerWidth > 992) setMenu(false);
		});
	}

	// ==================== BARRA DE PROGRESSO ====================
	const progressBar = document.querySelector('.progress-bar');
	if (progressBar) {
		let ticking = false;
		window.addEventListener('scroll', () => {
			if (ticking) return;
			ticking = true;
			requestAnimationFrame(() => {
				const scrollable = document.documentElement.scrollHeight - document.documentElement.clientHeight;
				progressBar.style.width = scrollable > 0 ? `${(window.scrollY / scrollable) * 100}%` : '0';
				ticking = false;
			});
		}, { passive: true });
	}

	// ==================== SISTEMA DE IDIOMAS (PT / EN) ====================
	//
	// Motor baseado em atributos no HTML, para que o conteudo nunca fique
	// dessincronizado entre os dois idiomas:
	//
	//   data-i18n="chave"             -> troca o textContent
	//   data-i18n-html="chave"        -> troca o innerHTML (textos com <strong>, <br>)
	//   data-i18n-placeholder="chave" -> troca o placeholder do input
	//   data-i18n-short="chave"       -> troca o atributo data-short (timeline)
	//   data-i18n-full="chave"        -> troca o atributo data-full  (timeline)
	//   data-i18n-alt="chave"         -> troca o alt de imagens
	//   data-i18n-aria="chave"        -> troca o aria-label
	//
	// O idioma escolhido fica salvo em localStorage.

	const LANG_STORAGE_KEY = 'portfolio-lang';
	const langBtn = document.getElementById('toggle-lang');

	const translations = {
		pt: {
			// Navbar
			navProjetos: 'Projetos',
			navSobre: 'Sobre',
			navExperiencias: 'Experiências',
			navCertificados: 'Certificados',
			navContato: 'Contato',
			skipLink: 'Pular para o conteúdo',

			// Hero
			heroBadge: '<span class="hero-badge-dot" aria-hidden="true"></span> Sites e sistemas para pequenas empresas',
			heroTitle: 'Olá, eu sou <span class="highlight">Lucas Antunes Ferreira</span>',
			heroDesc: 'Crio sites e sistemas sob medida para pequenas empresas:<br>site institucional, loja virtual, reservas e painel administrativo.',
			heroDescMobile: 'Sites e sistemas sob medida para pequenas empresas.',
			heroLead: 'Conte o que o seu negócio precisa e veja uma prévia antes de decidir.',
			btnProjetos: 'Ver Projetos',
			btnCurriculo: 'Currículo',


			// Projetos principais — rótulos comuns
			lnkDemo: 'Demo ao vivo',

			// 01 Torre Logística
			torreTag: 'Operação logística em tempo real',
			torreStatus: 'v1.0.1 · no ar · set 2026',

			// 02 Central Antifraude
			centralTag: 'Sistemas distribuídos e decisão de risco',
			centralStatus: 'v1.0.0 · no ar · set 2026',

			// 03 Prisma RH
			prismaTag: 'Domínio complexo de folha de pagamento',
			prismaStatus: 'v1.0.0 · no ar · set 2026',

			// Outros projetos
			outrosTitle: 'Outros projetos',



			// Sobre
			sobreTitle: 'Sobre Mim',
			sobreTexto: '<p>Sou desenvolvedor fullstack no Rio de Janeiro e crio <strong class="highlight">sites e sistemas para pequenas empresas</strong>: site institucional, loja virtual, reservas e painel administrativo.</p><p>Curso Ciência da Computação. Trabalho com <strong class="highlight">Next.js</strong>, <strong class="highlight">React</strong>, <strong class="highlight">.NET</strong> e <strong class="highlight">PostgreSQL</strong>, com testes automatizados e cuidado com segurança.</p><p>Antes de você decidir, eu mostro uma prévia do que vou entregar. É só chamar no WhatsApp e contar o que o seu negócio precisa.</p>',
			sobreTextoMobile: 'Crio <strong class="highlight">sites e sistemas para pequenas empresas</strong>, com uma prévia antes de você decidir.',
			sobreAvatar: 'Avatar animado',
			statCert: 'Certificados Alura',
			statForm: 'Formatura prevista',

			// Projetos (busca, filtro e cards em destaque)
			projetosTitle: 'Projetos',
			projetosSubtitle: 'Cada projeto mostra o problema, o que foi entregue, a stack usada e o link.',
			searchPlaceholder: 'Buscar por nome ou tecnologia...',
			filterAllProjects: 'Todos',
			emptyText: 'Nenhum projeto encontrado',
			emptyHint: 'Tente buscar por outra tecnologia ou termo',
			destaqueTitle: 'Sistemas em destaque',
			destaqueSub: 'Três sistemas completos no ar, com vídeo de demonstração',
			outrosLead: 'Projetos anteriores, todos com código aberto',
			featuredBadge: 'Destaque',

			// Cards dos outros projetos
			btnDetalhes: 'Detalhes',
			badgeClienteReal: 'Cliente real',

			projSmartFinanceTitle: 'SmartFinance',
			projTenantCoreTitle: 'TenantCore — Multi-Tenant SaaS',
			projLinkGuardiaoTitle: 'LinkGuardião',
			projArmazemTitle: 'Armazém São Joaquim',
			projNfeTitle: 'Emissão de NF-e e Controle de Estoque',
			projCollabDocsTitle: 'CollabDocs',
			projSummarizerTitle: 'Agente de Sumarização AI',
			projBillingTitle: 'BillingLedger',
			projEventSourcingTitle: 'Gestão de Pedidos Distribuído',

			// Cases (Problema → Entrega) e chaves novas
			negociosTitle: 'Projetos para negócios',
			negociosSub: 'Sites e loja virtual feitos para o dia a dia de um negócio',
			case_armazem_problema: 'Restaurante, pousada e café no mesmo negócio, sem um lugar único para mostrar cardápio, quartos e conteúdo e receber reservas.',
			case_armazem_entrega: 'Site institucional com cardápio online, blog, área da pousada, catálogo do café e galeria; reservas com confirmação; painel administrativo para o próprio negócio atualizar o conteúdo; versões em português e inglês.',
			lnkSite: 'Ver site',
			case_novolar_problema: 'Clínica geriátrica precisava de presença online.',
			case_novolar_entrega: 'Site institucional publicado em domínio próprio.',
			case_parallel_problema: 'Vender moda urbana pela internet exige uma vitrine que funcione bem no celular e um pagamento online confiável.',
			case_parallel_entrega: 'Loja virtual mobile-first com catálogo, checkout integrado ao Stripe e gerenciamento de pedidos.',
			case_torre_problema: 'A transportadora perde a entrega de vista quando o veículo sai para a rua.',
			case_torre_entrega: 'Console de operação, app do motorista que funciona offline e página de rastreamento para o destinatário, com localização, previsão de chegada, SLA, alertas e prova de entrega.',
			case_central_problema: 'Quem recebe pagamentos digitais precisa decidir na hora se aceita uma transação, sem aplicar o efeito duas vezes quando a mesma requisição chega repetida.',
			case_central_entrega: 'Avaliação de risco que recomenda Permitir, Revisar ou Bloquear e mostra os motivos de cada decisão, com fila de alertas e investigação de casos. Não processa dinheiro.',
			case_prisma_problema: 'Departamentos pessoais e BPOs processam folha para muitas empresas e precisam explicar cada valor, às vezes anos depois.',
			case_prisma_entrega: 'Folha de pagamento multiempresa (mensal, férias, rescisão e 13º) que guarda a memória de cálculo de cada holerite, com conferência de inconsistências e trilha de auditoria.',
			case_smartfinance_problema: 'Contas, receitas, despesas e orçamento espalhados em lugares diferentes dificultam ver a situação financeira.',
			case_smartfinance_entrega: 'Aplicação única com contas, transações, categorias, orçamentos e relatórios, com o painel atualizado em tempo real.',
			case_tenantcore_problema: 'Várias empresas usando a mesma plataforma não podem enxergar os dados umas das outras.',
			case_tenantcore_entrega: 'Plataforma SaaS com isolamento por empresa, usuários e perfis de acesso, cadastro de clientes, projetos e tarefas, planos com limite de uso e auditoria.',
			case_linkguardiao_problema: 'Controlar quem acessa um link, por quanto tempo ele vale e como é usado, sem deixar o redirecionamento lento.',
			case_linkguardiao_entrega: 'Encurtador de links com senha opcional, expiração configurável, limite diário de criação e estatísticas de acesso processadas em segundo plano.',
			case_nfe_problema: 'Fechar uma nota precisa reservar o estoque correspondente, e uma falha no meio do caminho não pode deixar os dois desencontrados.',
			case_nfe_entrega: 'Faturamento interno inspirado na NF-e (não é emissor fiscal oficial): cadastro de produtos, fechamento de notas, reserva de estoque por eventos e geração de PDF.',
			case_collabdocs_problema: 'Várias pessoas precisam criar, compartilhar e editar os mesmos documentos, com regras de acesso e sincronização entre elas.',
			case_collabdocs_entrega: 'Editor de documentos com login via GitHub ou Google, controle de quem vê e quem edita, gestão de colaboradores e edição em tempo real.',
			case_summarizer_problema: 'Transformar um artigo longo da web em resumo sem copiar e colar o texto à mão.',
			case_summarizer_entrega: 'Recebe a URL, coleta o texto com proteção contra SSRF e devolve o resumo em segundo plano, com histórico e download em txt, md ou json.',
			case_billing_problema: 'Separar faturamento, pagamento e contabilização sem amarrar tudo numa única transação síncrona.',
			case_billing_entrega: 'Backend que emite faturas, recebe pagamentos por webhook com assinatura verificada e registra cada efeito financeiro num livro-caixa imutável.',
			case_pedidos_problema: 'Evitar venda sem estoque e manter pagamento e pedido coordenados, mesmo quando uma das etapas falha.',
			case_pedidos_entrega: 'Sistema de pedidos com reserva de estoque, cobrança, compensação em caso de falha, painel operacional e eventos publicados via Outbox.',
			caseProblema: 'Problema',
			caseEntrega: 'Entrega',
			ctaWhatsapp: 'Pedir uma prévia grátis',

			// Experiências
			experienciasTitle: 'Experiências',
			experienciasSubtitle: 'Minha trajetória profissional e formação acadêmica',
			toggleMore: 'Ver mais',
			toggleLess: 'Ver menos',



			expFreelaPeriod: 'Jan 2024 — Abr 2026',
			expFreelaRole: 'Desenvolvedor Full Stack Jr (.NET/C# + React)',
			expFreelaShort: 'Desenvolvimento full stack com ASP.NET Core Web API e React + TypeScript, cobrindo modelagem, regras de negócio, autenticação e integrações...',
			expFreelaFull: 'Desenvolvimento full stack com ASP.NET Core Web API e React + TypeScript, cobrindo modelagem, regras de negócio, autenticação e integrações. Implementação de processamento assíncrono (workers e filas) e padrões de resiliência para tarefas de backoffice e integrações. Persistência com SQL Server e PostgreSQL, com camada de dados em Entity Framework Core. Aplicação de SOLID, Clean Architecture e Design Patterns, com testes automatizados em xUnit. Deploy na AWS e ambientes locais com Docker, com automações de entrega via CI/CD.',

			expEstacioPeriod: 'Jan 2024 — Dez 2027 (previsão)',
			expEstacioRole: 'Ciência da Computação',
			expEstacioDesc: 'Graduação em Ciência da Computação, com formatura prevista para dezembro de 2027. Base em algoritmos, estruturas de dados, banco de dados e engenharia de software, aplicada diretamente nos projetos deste portfólio.',

			expAluraPeriod: '2022 — Atual',
			expAluraRole: 'Formação em Programação',
			expAluraDesc: 'Formações Full-stack e .NET, com 30 certificados emitidos. Cobrem orientação a objetos com C#, ASP.NET Core, consumo de APIs, LINQ e boas práticas de desenvolvimento.',

			// Certificados & Idiomas
			certTitle: 'Certificados &amp; Idiomas',
			certSubtitle: 'Formação contínua registrada e verificável',
			certCountTitle: 'certificados emitidos pela Alura',
			certCountDesc: 'Formações de C#, .NET e desenvolvimento web, com credencial verificável em cada certificado.',
			certIssuedMar2025: 'Emitido em março de 2025',
			certCredential: 'Credencial',
			certSeeAll: 'Ver os 30 certificados no LinkedIn',
			idiomasTitle: 'Idiomas',
			idiomaPt: 'Português',
			idiomaPtNivel: 'Nativo',
			idiomaEn: 'Inglês',
			idiomaEnNivel: 'Avançado',
			idiomasNota: 'Leitura de documentação técnica e comunicação escrita em inglês no dia a dia.',

			// Contato
			contatoTitle: 'Contato',
			contatoLead: 'Conte o que o seu negócio precisa e peça uma prévia grátis pelo WhatsApp.',
			contatoEmailAria: 'Enviar e-mail para lucas.afvr@gmail.com',
			contatoCv: 'Currículo (PDF)',
			footerRights: '© {year} Lucas Antunes Ferreira. Todos os direitos reservados.',
			pageTitle: 'Lucas Antunes Ferreira | Sites e sistemas para pequenas empresas'
		},

		en: {
			// Navbar
			navProjetos: 'Projects',
			navSobre: 'About',
			navExperiencias: 'Experience',
			navCertificados: 'Certificates',
			navContato: 'Contact',
			skipLink: 'Skip to content',

			// Hero
			heroBadge: '<span class="hero-badge-dot" aria-hidden="true"></span> Websites and systems for small businesses',
			heroTitle: 'Hi, I am <span class="highlight">Lucas Antunes Ferreira</span>',
			heroDesc: 'I build custom websites and systems for small businesses:<br>institutional websites, online stores, bookings and admin panels.',
			heroDescMobile: 'Custom websites and systems for small businesses.',
			heroLead: 'Tell me what your business needs and see a preview before you decide.',
			btnProjetos: 'See Projects',
			btnCurriculo: 'Resume',


			// Featured projects — shared labels
			lnkDemo: 'Live demo',

			// 01 Torre Logística
			torreTag: 'Real-time logistics operation',
			torreStatus: 'v1.0.1 · live · Sep 2026',

			// 02 Central Antifraude
			centralTag: 'Distributed systems and risk decisions',
			centralStatus: 'v1.0.0 · live · Sep 2026',

			// 03 Prisma RH
			prismaTag: 'Complex payroll domain',
			prismaStatus: 'v1.0.0 · live · Sep 2026',

			// Other projects
			outrosTitle: 'Other projects',



			// About
			sobreTitle: 'About Me',
			sobreTexto: '<p>I am a fullstack developer based in Rio de Janeiro and I build <strong class="highlight">websites and systems for small businesses</strong>: institutional websites, online stores, bookings and admin panels.</p><p>I study Computer Science. I work with <strong class="highlight">Next.js</strong>, <strong class="highlight">React</strong>, <strong class="highlight">.NET</strong> and <strong class="highlight">PostgreSQL</strong>, with automated tests and attention to security.</p><p>Before you decide, I show you a preview of what I will deliver. Just message me on WhatsApp and tell me what your business needs.</p>',
			sobreTextoMobile: 'I build <strong class="highlight">websites and systems for small businesses</strong>, with a preview before you decide.',
			sobreAvatar: 'Animated avatar',
			statCert: 'Alura certificates',
			statForm: 'Expected graduation',

			// Other project cards
			// Projetos (busca, filtro e cards em destaque)
			projetosTitle: 'Projects',
			projetosSubtitle: 'Each project shows the problem, what was delivered, the stack used and the link.',
			searchPlaceholder: 'Search by name or technology...',
			filterAllProjects: 'All',
			emptyText: 'No projects found',
			emptyHint: 'Try searching for another technology or term',
			destaqueTitle: 'Featured systems',
			destaqueSub: 'Three complete systems live, with a demo video',
			outrosLead: 'Earlier projects, all open source',
			featuredBadge: 'Featured',

			btnDetalhes: 'Details',
			badgeClienteReal: 'Real client',

			projSmartFinanceTitle: 'SmartFinance',
			projTenantCoreTitle: 'TenantCore — Multi-Tenant SaaS',
			projLinkGuardiaoTitle: 'LinkGuardião',
			projArmazemTitle: 'Armazém São Joaquim',
			projNfeTitle: 'Invoice Issuing and Inventory Control',
			projCollabDocsTitle: 'CollabDocs',
			projSummarizerTitle: 'AI Summarization Agent',
			projBillingTitle: 'BillingLedger',
			projEventSourcingTitle: 'Distributed Order Management',

			// Cases (Problema → Entrega) e chaves novas
			negociosTitle: 'Business projects',
			negociosSub: 'Websites and an online store built for the day-to-day of a business',
			case_armazem_problema: 'A restaurant, inn and café in a single business, with no single place to show the menu, rooms and content and take bookings.',
			case_armazem_entrega: 'Institutional website with online menu, blog, inn section, café catalog and gallery; bookings with confirmation; an admin panel so the business updates its own content; Portuguese and English versions.',
			lnkSite: 'View website',
			case_novolar_problema: 'A geriatric clinic needed an online presence.',
			case_novolar_entrega: 'Institutional website published on its own domain.',
			case_parallel_problema: 'Selling streetwear online needs a storefront that works well on mobile and reliable online payment.',
			case_parallel_entrega: 'Mobile-first online store with catalog, Stripe-integrated checkout and order management.',
			case_torre_problema: 'A carrier loses sight of the delivery once the vehicle leaves.',
			case_torre_entrega: 'Operations console, a driver app that works offline and a tracking page for the recipient, with location, ETA, SLA, alerts and proof of delivery.',
			case_central_problema: 'Anyone taking digital payments must decide on the spot whether to accept a transaction, without applying the effect twice when the same request arrives again.',
			case_central_entrega: 'Risk assessment that recommends Allow, Review or Block and shows the reasons for each decision, with an alert queue and case investigation. It does not move money.',
			case_prisma_problema: 'HR departments and payroll outsourcers process payroll for many companies and must explain every amount, sometimes years later.',
			case_prisma_entrega: 'Multi-company payroll (monthly, vacation, termination and 13th salary) that stores the calculation trail of every payslip, with inconsistency checks and an audit trail.',
			case_smartfinance_problema: 'Accounts, income, expenses and budgets spread across different places make it hard to see where the money stands.',
			case_smartfinance_entrega: 'A single app with accounts, transactions, categories, budgets and reports, with the dashboard updated in real time.',
			case_tenantcore_problema: 'Several companies sharing the same platform must not see each other\'s data.',
			case_tenantcore_entrega: 'SaaS platform with per-company isolation, users and access roles, clients, projects and tasks, plans with usage limits and auditing.',
			case_linkguardiao_problema: 'Controlling who opens a link, how long it stays valid and how it is used, without slowing down the redirect.',
			case_linkguardiao_entrega: 'Link shortener with optional password, configurable expiration, a daily creation limit and access statistics processed in the background.',
			case_nfe_problema: 'Closing an invoice must reserve the matching stock, and a failure halfway must not leave the two out of sync.',
			case_nfe_entrega: 'Internal invoicing inspired by Brazil\'s NF-e (not an official tax issuer): product catalog, invoice closing, event-driven stock reservation and PDF generation.',
			case_collabdocs_problema: 'Several people need to create, share and edit the same documents, with access rules and sync between them.',
			case_collabdocs_entrega: 'Document editor with GitHub or Google sign-in, control over who can view and edit, collaborator management and real-time editing.',
			case_summarizer_problema: 'Turning a long web article into a summary without copying and pasting the text by hand.',
			case_summarizer_entrega: 'Takes a URL, collects the text with SSRF protection and returns the summary in the background, with history and download as txt, md or json.',
			case_billing_problema: 'Separating invoicing, payment and bookkeeping without tying everything into a single synchronous transaction.',
			case_billing_entrega: 'Backend that issues invoices, receives payments through signature-checked webhooks and records every financial effect in an immutable ledger.',
			case_pedidos_problema: 'Avoiding sales without stock and keeping payment and order in step, even when one of the steps fails.',
			case_pedidos_entrega: 'Order system with stock reservation, charging, compensation on failure, an operations dashboard and events published through an outbox.',
			caseProblema: 'Problem',
			caseEntrega: 'Delivery',
			ctaWhatsapp: 'Ask for a free preview',

			// Experiências
			experienciasTitle: 'Experience',
			experienciasSubtitle: 'My professional journey and academic background',
			toggleMore: 'Read more',
			toggleLess: 'Read less',



			expFreelaPeriod: 'Jan 2024 — Apr 2026',
			expFreelaRole: 'Full Stack Jr Developer (.NET/C# + React)',
			expFreelaShort: 'Full stack development with ASP.NET Core Web API and React + TypeScript, covering modeling, business rules, authentication and integrations...',
			expFreelaFull: 'Full stack development with ASP.NET Core Web API and React + TypeScript, covering modeling, business rules, authentication and integrations. Implementation of asynchronous processing (workers and queues) and resilience patterns for back-office tasks and integrations. Persistence with SQL Server and PostgreSQL, with a data layer in Entity Framework Core. Application of SOLID, Clean Architecture and Design Patterns, with automated tests in xUnit. Deployment on AWS and local environments with Docker, with delivery automation through CI/CD.',

			expEstacioPeriod: 'Jan 2024 — Dec 2027 (expected)',
			expEstacioRole: 'Computer Science',
			expEstacioDesc: 'Bachelor of Computer Science, expected to graduate in December 2027. Foundation in algorithms, data structures, databases and software engineering, applied directly to the projects in this portfolio.',

			expAluraPeriod: '2022 — Present',
			expAluraRole: 'Programming Training',
			expAluraDesc: 'Full-stack and .NET learning paths, with 30 certificates issued. They cover object-oriented programming with C#, ASP.NET Core, consuming APIs, LINQ and development best practices.',

			// Certificados & Idiomas
			certTitle: 'Certificates &amp; Languages',
			certSubtitle: 'Continuous learning, recorded and verifiable',
			certCountTitle: 'certificates issued by Alura',
			certCountDesc: 'Learning paths in C#, .NET and web development, each one with a verifiable credential.',
			certIssuedMar2025: 'Issued in March 2025',
			certCredential: 'Credential',
			certSeeAll: 'See all 30 certificates on LinkedIn',
			idiomasTitle: 'Languages',
			idiomaPt: 'Portuguese',
			idiomaPtNivel: 'Native',
			idiomaEn: 'English',
			idiomaEnNivel: 'Advanced',
			idiomasNota: 'I read technical documentation and communicate in writing in English every day.',

			// Contact
			contatoTitle: 'Contact',
			contatoLead: 'Tell me what your business needs and ask for a free preview on WhatsApp.',
			contatoEmailAria: 'Send an email to lucas.afvr@gmail.com',
			contatoCv: 'Resume (PDF)',
			footerRights: '© {year} Lucas Antunes Ferreira. All rights reserved.',
			pageTitle: 'Lucas Antunes Ferreira | Websites and systems for small businesses'
		}
	};

	/**
	 * Resolve uma chave do dicionario, substituindo placeholders dinamicos.
	 * Se a chave nao existir, devolve null para que o texto do HTML seja mantido
	 * (falhar em silencio e melhor do que apagar o conteudo da pagina).
	 */
	function t(lang, key) {
		const dict = translations[lang] || translations.pt;
		const value = dict[key];
		if (typeof value !== 'string') return null;
		return value.replace('{year}', String(new Date().getFullYear()));
	}

	/**
	 * Sincroniza o texto visivel dos paragrafos da timeline com o estado
	 * atual do botao "Ver mais" apos uma troca de idioma.
	 */
	function refreshTimelineTexts(lang) {
		document.querySelectorAll('.timeline-toggle').forEach((button) => {
			const textEl = button.parentElement.querySelector('.timeline-text');
			if (!textEl) return;

			const expanded = button.getAttribute('aria-expanded') === 'true';
			const next = expanded ? textEl.getAttribute('data-full') : textEl.getAttribute('data-short');
			if (next) textEl.textContent = next;

			const label = button.querySelector('.toggle-text');
			if (label) label.textContent = t(lang, expanded ? 'toggleLess' : 'toggleMore') || label.textContent;
		});
	}

	function setLanguage(lang) {
		document.documentElement.lang = lang === 'en' ? 'en' : 'pt-BR';

		const title = t(lang, 'pageTitle');
		if (title) document.title = title;

		document.querySelectorAll('[data-i18n]').forEach((el) => {
			const value = t(lang, el.getAttribute('data-i18n'));
			// Chaves de texto puro podem conter entidades (&amp;), entao usamos
			// innerHTML — os valores vem do dicionario, nunca de input do usuario.
			if (value !== null) el.innerHTML = value;
		});

		document.querySelectorAll('[data-i18n-html]').forEach((el) => {
			const value = t(lang, el.getAttribute('data-i18n-html'));
			if (value !== null) el.innerHTML = value;
		});

		document.querySelectorAll('[data-i18n-placeholder]').forEach((el) => {
			const value = t(lang, el.getAttribute('data-i18n-placeholder'));
			if (value !== null) el.placeholder = value;
		});

		document.querySelectorAll('[data-i18n-short]').forEach((el) => {
			const value = t(lang, el.getAttribute('data-i18n-short'));
			if (value !== null) el.setAttribute('data-short', value);
		});

		document.querySelectorAll('[data-i18n-full]').forEach((el) => {
			const value = t(lang, el.getAttribute('data-i18n-full'));
			if (value !== null) el.setAttribute('data-full', value);
		});

		document.querySelectorAll('[data-i18n-alt]').forEach((el) => {
			const value = t(lang, el.getAttribute('data-i18n-alt'));
			if (value !== null) el.setAttribute('alt', value);
		});

		document.querySelectorAll('[data-i18n-aria]').forEach((el) => {
			const value = t(lang, el.getAttribute('data-i18n-aria'));
			if (value !== null) el.setAttribute('aria-label', value);
		});

		refreshTimelineTexts(lang);

		if (langBtn) {
			const visible = lang === 'pt' ? 'PT / EN' : 'EN / PT';
			langBtn.textContent = visible;
			// O nome acessível precisa conter o texto visível (WCAG 2.5.3, Label in Name)
			langBtn.setAttribute('aria-label',
				lang === 'pt' ? `Mudar para inglês — ${visible}` : `Switch to Portuguese — ${visible}`);
		}

		try {
			localStorage.setItem(LANG_STORAGE_KEY, lang);
		} catch (e) {
			// localStorage indisponivel (modo privado): a troca continua valendo
			// para a sessao atual, apenas nao persiste.
		}
	}

	// Expoe para os outros scripts (o toggle da timeline precisa saber o idioma)
	window.getCurrentLang = function () {
		return document.documentElement.lang === 'en' ? 'en' : 'pt';
	};
	window.i18nText = t;

	// ==================== TIMELINE PREMIUM 2026 ====================
	function initTimeline() {
		const timelineSection = document.querySelector('#experiencias');
		const timelineProgress = document.querySelector('.timeline-progress');
		const timelineItems = document.querySelectorAll('.timeline-item');

		if (!timelineSection || !timelineProgress) return;

		// 1. Scroll Progress Logic
		function updateTimelineProgress() {
			const sectionTop = timelineSection.offsetTop;
			const sectionHeight = timelineSection.offsetHeight;
			const scrollY = window.scrollY;
			const windowHeight = window.innerHeight;

			// Start progress when section enters viewport (buffer of 200px)
			const startOffset = sectionTop - windowHeight + 200;
			// End progress when section leaves viewport
			const endOffset = sectionTop + sectionHeight - 200;

			let percentage = 0;

			if (scrollY > startOffset) {
				const scrolled = scrollY - startOffset;
				const totalScrollable = endOffset - startOffset;
				percentage = Math.min(100, Math.max(0, (scrolled / totalScrollable) * 100));
			}

			timelineProgress.style.height = `${percentage}%`;
		}

		window.addEventListener('scroll', () => {
			requestAnimationFrame(updateTimelineProgress);
		}, { passive: true });

		// Initial check
		updateTimelineProgress();

		// 2. Intersection Observer for Items (Slide-in)
		const observerOptions = {
			threshold: 0.1,
			rootMargin: '0px 0px -50px 0px'
		};

		const timelineObserver = new IntersectionObserver((entries) => {
			entries.forEach(entry => {
				if (entry.isIntersecting) {
					entry.target.classList.add('is-visible');
					// Optional: Stop observing once visible to save performance
					timelineObserver.unobserve(entry.target);
				}
			});
		}, observerOptions);

		timelineItems.forEach(item => {
			timelineObserver.observe(item);
		});
	}

	initTimeline();

	// ==================== INICIALIZACAO DO IDIOMA ====================
	// Ordem de prioridade: escolha salva > idioma do navegador > portugues.
	let savedLang = null;
	try {
		savedLang = localStorage.getItem(LANG_STORAGE_KEY);
	} catch (e) {
		savedLang = null;
	}

	let currentLang = savedLang === 'pt' || savedLang === 'en' ? savedLang : null;
	if (!currentLang) {
		const navLang = (navigator.language || 'pt').toLowerCase();
		currentLang = navLang.startsWith('pt') ? 'pt' : 'en';
	}

	setLanguage(currentLang);

	if (langBtn) {
		langBtn.addEventListener('click', function () {
			currentLang = currentLang === 'pt' ? 'en' : 'pt';
			setLanguage(currentLang);
		});
	}
});

// Header fixo: o sentinel no topo sai da tela e a navbar ganha fundo.
(function () {
	const headerSentinel = document.getElementById('scroll-sentinel');
	const navbar = document.querySelector('.navbar');
	if (!headerSentinel || !navbar || !('IntersectionObserver' in window)) return;

	new IntersectionObserver((entries) => {
		entries.forEach((entry) => {
			navbar.classList.toggle('scrolled', !entry.isIntersecting);
		});
	}).observe(headerSentinel);
})();
