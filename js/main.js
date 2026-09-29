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
			heroBadge: '<span class="hero-badge-dot" aria-hidden="true"></span> Disponível para vagas Júnior / Estágio',
			heroTitle: 'Olá, eu sou <span class="highlight">Lucas Antunes Ferreira</span>',
			heroDesc: 'Desenvolvedor Fullstack com foco em backend .NET<br>C# | .NET | ASP.NET Core | React | TypeScript<br>PostgreSQL | Docker | AWS',
			heroDescMobile: 'Fullstack com foco em backend .NET | C# | React | AWS',
			heroLead: 'Construo produtos B2B do domínio à produção, com foco em consistência, segurança, testes e operação real em cloud.',
			btnCurriculo: 'Currículo',
			btnProjetos: 'Ver Projetos',
			ctaContato: 'Contato',


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
			sobreTexto: '<p>Sou desenvolvedor fullstack com foco em <strong class="highlight">backend C#/.NET</strong>. Construo produtos B2B do domínio à produção, com <strong class="highlight">ASP.NET Core</strong>, <strong class="highlight">React</strong> e <strong class="highlight">PostgreSQL</strong>.</p><p>Curso Ciência da Computação e trabalho com desenvolvimento e sustentação de uma plataforma SaaS corporativa. Nos meus projetos, aplico <strong class="highlight">Clean Architecture</strong>, <strong class="highlight">DDD</strong> e <strong class="highlight">testes automatizados</strong>, com mensageria, segurança e observabilidade na prática.</p><p>Procuro um time onde eu possa entregar código confiável desde o primeiro dia e seguir aprendendo com produto real.</p>',
			sobreTextoMobile: 'Dev fullstack com foco em <strong class="highlight">backend .NET</strong>. Construo produtos B2B do domínio à produção, com testes, segurança e operação real.',
			sobreAvatar: 'Avatar animado',
			statProj: 'Projetos publicados',
			statCert: 'Certificados Alura',
			statForm: 'Formatura prevista',

			// Projetos (busca, filtro e cards em destaque)
			projetosTitle: 'Projetos',
			projetosSubtitle: 'Doze projetos com código aberto no GitHub. Três estão no ar como produtos completos, e cada um tem uma página com arquitetura, decisões técnicas e limites.',
			searchPlaceholder: 'Buscar por nome ou tecnologia...',
			filterAllProjects: 'Todos',
			emptyText: 'Nenhum projeto encontrado',
			emptyHint: 'Tente buscar por outra tecnologia ou termo',
			destaqueTitle: 'Em destaque',
			destaqueSub: 'Três produtos B2B no ar, com vídeo, testes e pentest documentado',
			outrosLead: 'Projetos anteriores, todos com código aberto',
			torreResumo: 'A transportadora perde a entrega de vista quando o veículo sai para a rua. A Torre cobre o trecho entre a saída para rota e a conclusão, com localização, ETA, SLA, alertas e prova de entrega.',
			centralResumo: 'Decisão de risco imediata e explicável para pagamentos digitais, com efeito único mesmo sob requisições simultâneas e mensagens repetidas. Não processa dinheiro: recomenda Permitir, Revisar ou Bloquear.',
			prismaResumo: 'Folha de pagamento brasileira multiempresa que entrega o número e a conta que levou até ele: rubricas, bases, parâmetro vigente e versão do cálculo.',
			statTestes: 'testes',
			torreS2: 'categorias de pentest',
			torreS3: 'apps web',
			centralS2: 'vetores de pentest',
			centralS3: 'fases entregues',
			prismaS2: 'testes de segurança',
			prismaS3: 'rotas, 4 anônimas',
			featuredBadge: 'Destaque',

			// Cards dos outros projetos
			btnDetalhes: 'Detalhes',
			badgeClienteReal: 'Cliente real · em produção',

			projSmartFinanceTitle: 'SmartFinance',
			projSmartFinanceDesc: 'Ecossistema de finanças pessoais com .NET 9, RabbitMQ e Next.js. Implementa Clean Architecture, Outbox Pattern e processamento assíncrono de transações para máxima consistência e resiliência financeira.',
			projTenantCoreTitle: 'TenantCore — Multi-Tenant SaaS',
			projTenantCoreDesc: 'Plataforma SaaS B2B em .NET 9 com isolamento por tenant via query filters do EF Core. JWT com refresh token rotativo, RBAC, cotas por plano, cache Redis, jobs Quartz e observabilidade com OpenTelemetry.',
			projLinkGuardiaoTitle: 'LinkGuardião',
			projLinkGuardiaoDesc: 'Encurtador de links com foco em segurança. .NET + React, links protegidos por senha, expiração configurável, rate limiting e analytics assíncrono processado fora do caminho da requisição.',
			projArmazemTitle: 'Armazém São Joaquim',
			projArmazemDesc: 'Portal para gestão de armazém, restaurante e pousada, no ar em domínio próprio. Next.js e Supabase com CMS dinâmico, fluxo de reservas, área administrativa e foco em SEO e performance.',
			projNfeTitle: 'Emissão de NF-e e Controle de Estoque',
			projNfeDesc: 'Sistema serverless orquestrado por eventos para faturamento e gestão de inventário. .NET, AWS Lambda, EventBridge para desacoplamento e DynamoDB com modelagem single-table.',
			projCollabDocsTitle: 'CollabDocs',
			projCollabDocsDesc: 'Editor de documentos em tempo real com .NET e SignalR. Sincronização de estado via WebSockets, controle de permissão por documento e deploy em infraestrutura serverless.',
			projSummarizerTitle: 'Agente de Sumarização AI',
			projSummarizerDesc: 'Agente que usa LLMs para extrair e resumir artigos da web de forma assíncrona. Python, FastAPI e fila de tarefas em background, com estratégias de fallback para coleta confiável.',
			projBillingTitle: 'BillingLedger',
			projBillingDesc: 'Backend de cobrança, pagamentos e conciliação em ledger. .NET 9 com contextos separados, Outbox Pattern para integração confiável e idempotência no processamento de webhooks de pagamento.',
			projEventSourcingTitle: 'Gestão de Pedidos Distribuído',
			projEventSourcingDesc: 'Pedidos, estoque e pagamento coordenados em Java + Spring Boot. Reserva de estoque com locking, compensação em caso de falha e eventos publicados via Outbox + RabbitMQ. 217 testes automatizados.',

			// Experiências
			experienciasTitle: 'Experiências',
			experienciasSubtitle: 'Minha trajetória profissional e formação acadêmica',
			toggleMore: 'Ver mais',
			toggleLess: 'Ver menos',

			expSinergyPeriod: 'Abr 2026 — Atual',
			expSinergyRole: 'Desenvolvedor Trainee — .NET | SQL Server | ASP.NET',
			expSinergyShort: 'Atuação no desenvolvimento e sustentação de plataforma SaaS corporativa, com foco em estabilidade, manutenção e evolução contínua do sistema...',
			expSinergyFull: 'Atuação no desenvolvimento e sustentação de plataforma SaaS corporativa, com foco em estabilidade, manutenção e evolução contínua do sistema. Implementação e manutenção de funcionalidades em C# / ASP.NET, incluindo ajustes em regras de negócio, APIs e rotinas de suporte à operação. Uso intensivo de SQL Server para consultas, análise de dados, procedures e apoio na geração de relatórios e extrações operacionais. Apoio à qualidade do software por meio de testes, análise de falhas, correção de bugs e colaboração com diferentes áreas do negócio.',

			expRsmPeriod: 'Nov 2024 — Abr 2026',
			expRsmRole: 'Suporte de TI',
			expRsmShort: 'Triagem, registro e atendimento de incidentes (Nível 1 e 2), garantindo continuidade operacional e comunicação clara com usuários...',
			expRsmFull: 'Triagem, registro e atendimento de incidentes (Nível 1 e 2), garantindo continuidade operacional e comunicação clara com usuários. Diagnóstico e resolução de problemas de hardware e software, com foco em causa raiz e prevenção de recorrência. Instalação, configuração e manutenção de aplicativos, sistemas operacionais (Windows, Linux) e periféricos. Suporte à infraestrutura de redes, computadores e impressoras. Padronização e documentação técnica de procedimentos, reduzindo retrabalho e melhorando o tempo de resolução.',

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
			contatoLead: 'Aberto a conversar sobre backend .NET, produtos B2B e oportunidades de trabalho.',
			contatoEmailAria: 'Enviar e-mail para lucas.afvr@gmail.com',
			contatoCv: 'Currículo (PDF)',
			footerRights: '© {year} Lucas Antunes Ferreira. Todos os direitos reservados.',
			pageTitle: 'Lucas Antunes Ferreira | Fullstack .NET Developer'
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
			heroBadge: '<span class="hero-badge-dot" aria-hidden="true"></span> Open to Junior / Internship roles',
			heroTitle: 'Hi, I am <span class="highlight">Lucas Antunes Ferreira</span>',
			heroDesc: 'Fullstack Developer focused on .NET backend<br>C# | .NET | ASP.NET Core | React | TypeScript<br>PostgreSQL | Docker | AWS',
			heroDescMobile: 'Fullstack focused on .NET backend | C# | React | AWS',
			heroLead: 'I build B2B products from domain to production, focused on consistency, security, testing and real-world cloud operation.',
			btnCurriculo: 'Resume',
			btnProjetos: 'See Projects',
			ctaContato: 'Contact',


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
			sobreTexto: '<p>I am a fullstack developer focused on <strong class="highlight">C#/.NET backend</strong>. I build B2B products from domain to production, with <strong class="highlight">ASP.NET Core</strong>, <strong class="highlight">React</strong> and <strong class="highlight">PostgreSQL</strong>.</p><p>I study Computer Science and work on developing and maintaining a corporate SaaS platform. In my projects I apply <strong class="highlight">Clean Architecture</strong>, <strong class="highlight">DDD</strong> and <strong class="highlight">automated testing</strong>, with messaging, security and observability in practice.</p><p>I am looking for a team where I can deliver reliable code from day one and keep learning on a real product.</p>',
			sobreTextoMobile: 'Fullstack dev focused on <strong class="highlight">.NET backend</strong>. I build B2B products from domain to production, with tests, security and real-world operation.',
			sobreAvatar: 'Animated avatar',
			statProj: 'Published projects',
			statCert: 'Alura certificates',
			statForm: 'Expected graduation',

			// Other project cards
			// Projetos (busca, filtro e cards em destaque)
			projetosTitle: 'Projects',
			projetosSubtitle: 'Twelve open source projects on GitHub. Three are live as complete products, and each one has a page with architecture, technical decisions and limits.',
			searchPlaceholder: 'Search by name or technology...',
			filterAllProjects: 'All',
			emptyText: 'No projects found',
			emptyHint: 'Try searching for another technology or term',
			destaqueTitle: 'Featured',
			destaqueSub: 'Three live B2B products, with video, tests and a documented pentest',
			outrosLead: 'Earlier projects, all open source',
			torreResumo: 'A carrier loses sight of the delivery once the vehicle leaves. Torre covers the stretch between leaving for the route and completion, with location, ETA, SLA, alerts and proof of delivery.',
			centralResumo: 'Immediate, explainable risk decisions for digital payments, with a single effect even under simultaneous requests and repeated messages. It does not move money: it recommends Allow, Review or Block.',
			prismaResumo: 'Multi-company Brazilian payroll that delivers the number and the calculation behind it: rubrics, bases, effective parameter and calculation version.',
			statTestes: 'tests',
			torreS2: 'pentest categories',
			torreS3: 'web apps',
			centralS2: 'pentest vectors',
			centralS3: 'phases delivered',
			prismaS2: 'security tests',
			prismaS3: 'routes, 4 anonymous',
			featuredBadge: 'Featured',

			btnDetalhes: 'Details',
			badgeClienteReal: 'Real client · in production',

			projSmartFinanceTitle: 'SmartFinance',
			projSmartFinanceDesc: 'Personal finance ecosystem with .NET 9, RabbitMQ and Next.js. Implements Clean Architecture, the Outbox Pattern and asynchronous transaction processing for consistency and financial resilience.',
			projTenantCoreTitle: 'TenantCore — Multi-Tenant SaaS',
			projTenantCoreDesc: 'B2B SaaS platform in .NET 9 with per-tenant isolation through EF Core global query filters. JWT with rotating refresh tokens, RBAC, per-plan quotas, Redis cache, Quartz jobs and OpenTelemetry observability.',
			projLinkGuardiaoTitle: 'LinkGuardião',
			projLinkGuardiaoDesc: 'Security-focused URL shortener. .NET + React, password-protected links, configurable expiration, rate limiting and asynchronous analytics processed off the request path.',
			projArmazemTitle: 'Armazém São Joaquim',
			projArmazemDesc: 'Portal for managing a warehouse, restaurant and inn, live on its own domain. Next.js and Supabase with a dynamic CMS, booking flow, admin area and a focus on SEO and performance.',
			projNfeTitle: 'Invoice Issuing and Inventory Control',
			projNfeDesc: 'Event-driven serverless system for invoicing and inventory management. .NET, AWS Lambda, EventBridge for decoupling and DynamoDB with single-table design.',
			projCollabDocsTitle: 'CollabDocs',
			projCollabDocsDesc: 'Real-time document editor with .NET and SignalR. State synchronization over WebSockets, per-document permission control and deployment on serverless infrastructure.',
			projSummarizerTitle: 'AI Summarization Agent',
			projSummarizerDesc: 'Agent that uses LLMs to extract and summarize web articles asynchronously. Python, FastAPI and a background task queue, with fallback strategies for reliable collection.',
			projBillingTitle: 'BillingLedger',
			projBillingDesc: 'Backend for billing, payments and ledger reconciliation. .NET 9 with separate contexts, the Outbox Pattern for reliable integration and idempotent payment webhook processing.',
			projEventSourcingTitle: 'Distributed Order Management',
			projEventSourcingDesc: 'Orders, inventory and payment coordinated in Java + Spring Boot. Inventory reservation with locking, compensation on failure and events published through Outbox + RabbitMQ. 217 automated tests.',

			// Experiências
			experienciasTitle: 'Experience',
			experienciasSubtitle: 'My professional journey and academic background',
			toggleMore: 'Read more',
			toggleLess: 'Read less',

			expSinergyPeriod: 'Apr 2026 — Present',
			expSinergyRole: 'Trainee Developer — .NET | SQL Server | ASP.NET',
			expSinergyShort: 'Development and maintenance of a corporate SaaS platform, focused on stability, upkeep and continuous evolution of the system...',
			expSinergyFull: 'Development and maintenance of a corporate SaaS platform, focused on stability, upkeep and continuous evolution of the system. Implementation and maintenance of features in C# / ASP.NET, including business rule changes, APIs and routines that support daily operations. Heavy use of SQL Server for queries, data analysis, stored procedures and support for operational reports and data extraction. Support to software quality through testing, failure analysis, bug fixing and collaboration with different business areas.',

			expRsmPeriod: 'Nov 2024 — Apr 2026',
			expRsmRole: 'IT Support',
			expRsmShort: 'Triage, logging and handling of incidents (Level 1 and 2), ensuring operational continuity and clear communication with users...',
			expRsmFull: 'Triage, logging and handling of incidents (Level 1 and 2), ensuring operational continuity and clear communication with users. Diagnosis and resolution of hardware and software problems, focused on root cause and preventing recurrence. Installation, configuration and maintenance of applications, operating systems (Windows, Linux) and peripherals. Support for network infrastructure, computers and printers. Standardization and technical documentation of procedures, reducing rework and improving resolution time.',

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
			contatoLead: 'Open to talk about .NET backend, B2B products and job opportunities.',
			contatoEmailAria: 'Send an email to lucas.afvr@gmail.com',
			contatoCv: 'Resume (PDF)',
			footerRights: '© {year} Lucas Antunes Ferreira. All rights reserved.',
			pageTitle: 'Lucas Antunes Ferreira | Fullstack .NET Developer'
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
			langBtn.textContent = lang === 'pt' ? 'PT / EN' : 'EN / PT';
			langBtn.setAttribute('aria-label', lang === 'pt' ? 'Mudar para inglês' : 'Switch to Portuguese');
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
