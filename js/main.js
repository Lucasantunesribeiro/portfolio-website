document.addEventListener('DOMContentLoaded', function () {
	// Inicializa AOS
	AOS.init({
		duration: 800,
		easing: 'slide'
	});


	// Variáveis globais de navegação controladas por applyMenuListeners
	// A lógica de filtragem de projetos foi movida para js/projetos.js


	// Apenas CSS controla a exibição do menu-toggle

	// Animações de entrada
	const animateElements = document.querySelectorAll('.hero-content, .sobre-grid, .skill-card, .project-card');
	const observer = new IntersectionObserver((entries) => {
		entries.forEach(entry => {
			if (entry.isIntersecting) {
				entry.target.classList.add('animate-in');
				observer.unobserve(entry.target);
			}
		});
	}, {
		threshold: 0.1,
		rootMargin: '0px 0px -50px 0px'
	});
	animateElements.forEach(element => {
		element.classList.add('animate-hidden');
		observer.observe(element);
	});

	// Acessibilidade: Prefers Reduced Motion e Economia de Bateria
	const video = document.querySelector('.hero-video');
	if (video) {
		const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
		if (mediaQuery.matches || window.innerWidth < 768) {
			video.pause();
			// Opcional: esconder vídeo se tiver um poster definido no HTML
			// video.style.display = 'none'; 
		}
	}

	// Mouse tracking para efeito magic card
	const cards = document.querySelectorAll('.magic-card');
	cards.forEach(card => {
		card.addEventListener('mousemove', e => {
			const rect = card.getBoundingClientRect();
			const x = e.clientX - rect.left;
			const y = e.clientY - rect.top;
			card.style.setProperty('--mouse-x', `${x}px`);
			card.style.setProperty('--mouse-y', `${y}px`);
		});
	});

	// Efeito Parallax no Hero
	const heroBackground = document.querySelector('.hero-background');
	window.addEventListener('mousemove', (e) => {
		const mouseX = e.clientX / window.innerWidth;
		const mouseY = e.clientY / window.innerHeight;
		const moveX = (mouseX - 0.5) * 20;
		const moveY = (mouseY - 0.5) * 20;
		if (heroBackground) heroBackground.style.transform = `translate(${moveX}px, ${moveY}px)`;
	});

	// Função para aplicar os listeners do menu hamburguer
	function applyMenuListeners() {
		menuToggle = document.querySelector('.menu-toggle');
		navLinks = document.querySelector('.nav-links');
		if (menuToggle && navLinks) {
			menuToggle.onclick = function (e) {
				e.stopPropagation();
				navLinks.classList.toggle('active');
				menuToggle.classList.toggle('active');
			};
			navLinks.querySelectorAll('a, #toggle-lang').forEach(link => {
				link.onclick = function () {
					navLinks.classList.remove('active');
					menuToggle.classList.remove('active');
				};
			});
			document.addEventListener('click', function (e) {
				if (!navLinks.contains(e.target) && !menuToggle.contains(e.target)) {
					navLinks.classList.remove('active');
					menuToggle.classList.remove('active');
				}
			});
			window.addEventListener('resize', function () {
				if (window.innerWidth > 992) {
					navLinks.classList.remove('active');
					menuToggle.classList.remove('active');
				}
			});
		}
	}
	applyMenuListeners();

	// Barra de Progresso
	window.addEventListener('scroll', () => {
		const progressBar = document.querySelector('.progress-bar');
		if (progressBar) {
			const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
			const scrolled = (window.scrollY / windowHeight) * 100;
			progressBar.style.width = `${scrolled}%`;
		}
	});

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
	//
	// O idioma escolhido fica salvo em localStorage.

	const LANG_STORAGE_KEY = 'portfolio-lang';
	const langBtn = document.getElementById('toggle-lang');

	const translations = {
		pt: {
			// Navbar
			navHome: 'Home',
			navSobre: 'Sobre',
			navProjetos: 'Projetos',
			navExperiencias: 'Experiências',
			navHabilidades: 'Habilidades',
			navCertificados: 'Certificados',

			// Hero
			heroBadge: '<span class="hero-badge-dot" aria-hidden="true"></span> Disponível para vagas Júnior / Estágio',
			heroTitle: 'Olá, eu sou <span class="highlight">Lucas Antunes Ferreira</span>',
			heroDesc: 'Desenvolvedor .NET &amp; React<br>C# | ASP.NET Core | EF Core | SQL Server<br>Clean Architecture | DDD | Docker | AWS',
			heroDescMobile: 'Desenvolvedor .NET &amp; React | C# | ASP.NET Core',
			btnCurriculo: 'Currículo',
			btnProjetos: 'Ver Projetos',

			// Sobre
			sobreTitle: 'Sobre Mim',
			sobreTexto: '<p>Sou desenvolvedor de software com foco em <strong class="highlight">backend .NET</strong> e aplicações fullstack. Construo sistemas com <strong class="highlight">C#</strong> e <strong class="highlight">ASP.NET Core</strong>.</p><p>Curso Ciência da Computação e trabalho com desenvolvimento e sustentação de uma plataforma SaaS corporativa. Nos meus projetos, aplico <strong class="highlight">Clean Architecture</strong>, <strong class="highlight">DDD</strong> e <strong class="highlight">testes automatizados</strong>, com mensageria, cloud e observabilidade na prática.</p><p>Busco vagas <strong class="highlight">Júnior</strong> e de <strong class="highlight">estágio</strong>, onde eu possa aprender rápido e entregar código confiável desde o primeiro dia.</p>',
			sobreTextoMobile: 'Dev com foco em <strong class="highlight">backend .NET</strong>. Uso <strong class="highlight">Clean Architecture</strong> e <strong class="highlight">DDD</strong> para construir sistemas confiáveis. Buscando vagas Júnior/Estágio.',
			statProj: 'Projetos publicados',
			statCert: 'Certificados Alura',
			statForm: 'Formatura prevista',

			// Projetos
			projetosTitle: 'Projetos',
			projetosSubtitle: 'Nove projetos com código aberto no GitHub. Cada um tem uma página com a arquitetura, as decisões técnicas e os limites do que foi construído.',
			searchPlaceholder: 'Buscar projeto...',
			filterAllProjects: 'Todos',
			btnDetalhes: 'Detalhes',
			badgeClienteReal: 'Cliente real · em produção',
			emptyText: 'Nenhum projeto encontrado',
			emptyHint: 'Tente buscar por outra tecnologia ou termo',

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

			// Habilidades
			habilidadesTitle: 'Habilidades',
			habilidadesSubtitle: 'Tecnologias e competências que uso no dia a dia',
			filterAll: 'Todas',
			filterBackend: 'Backend',
			filterFrontend: 'Frontend',
			filterDatabase: 'Database',
			filterCloud: 'Cloud/DevOps',
			filterQuality: 'Qualidade',
			skillBackendTitle: 'Backend',
			skillBackendDesc: 'Desenvolvimento de APIs e serviços em C# e ASP.NET Core, com Clean Architecture, validação e tratamento de erros padronizado.',
			skillFrontendTitle: 'Frontend',
			skillFrontendDesc: 'Interfaces em React e Next.js com TypeScript, consumo de APIs, estados de carregamento e erro, e layout responsivo.',
			skillDatabaseTitle: 'Banco de Dados',
			skillDatabaseDesc: 'Modelagem relacional, consultas e procedures em SQL Server e PostgreSQL, migrations com EF Core e índices pensados para performance.',
			skillCloudTitle: 'Cloud/DevOps',
			skillCloudDesc: 'Containers com Docker, pipelines de CI/CD no GitHub Actions e deploy em AWS e Azure, com logs estruturados e health checks.',
			skillQualityTitle: 'Qualidade &amp; Segurança',
			skillQualityDesc: 'Testes unitários e de integração com xUnit, autenticação JWT com refresh token, RBAC e rate limiting.',
			tagUnitTests: 'Testes unitários',
			tagIntegrationTests: 'Testes de integração',
			tagObservability: 'Observabilidade',

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

			// Footer
			footerLabel: 'Vamos construir algo incrível juntos?',
			footerRights: '© {year} Lucas Antunes Ferreira. Todos os direitos reservados.',
			pageTitle: 'Lucas Antunes Ferreira — Desenvolvedor .NET & React'
		},

		en: {
			// Navbar
			navHome: 'Home',
			navSobre: 'About',
			navProjetos: 'Projects',
			navExperiencias: 'Experience',
			navHabilidades: 'Skills',
			navCertificados: 'Certificates',

			// Hero
			heroBadge: '<span class="hero-badge-dot" aria-hidden="true"></span> Open to Junior / Internship roles',
			heroTitle: 'Hi, I am <span class="highlight">Lucas Antunes Ferreira</span>',
			heroDesc: '.NET &amp; React Developer<br>C# | ASP.NET Core | EF Core | SQL Server<br>Clean Architecture | DDD | Docker | AWS',
			heroDescMobile: '.NET &amp; React Developer | C# | ASP.NET Core',
			btnCurriculo: 'Resume',
			btnProjetos: 'See Projects',

			// Sobre
			sobreTitle: 'About Me',
			sobreTexto: '<p>I am a software developer focused on <strong class="highlight">.NET backend</strong> and fullstack applications. I build systems with <strong class="highlight">C#</strong> and <strong class="highlight">ASP.NET Core</strong>.</p><p>I am studying Computer Science and I work on the development and maintenance of a corporate SaaS platform. In my projects I apply <strong class="highlight">Clean Architecture</strong>, <strong class="highlight">DDD</strong> and <strong class="highlight">automated testing</strong>, with messaging, cloud and observability in practice.</p><p>I am looking for <strong class="highlight">Junior</strong> and <strong class="highlight">internship</strong> roles, where I can learn fast and ship reliable code from day one.</p>',
			sobreTextoMobile: 'Developer focused on <strong class="highlight">.NET backend</strong>. I use <strong class="highlight">Clean Architecture</strong> and <strong class="highlight">DDD</strong> to build reliable systems. Open to Junior/Internship roles.',
			statProj: 'Published projects',
			statCert: 'Alura certificates',
			statForm: 'Expected graduation',

			// Projetos
			projetosTitle: 'Projects',
			projetosSubtitle: 'Nine projects with open source code on GitHub. Each one has a page covering the architecture, the technical decisions and the limits of what was built.',
			searchPlaceholder: 'Search project...',
			filterAllProjects: 'All',
			btnDetalhes: 'Details',
			badgeClienteReal: 'Real client · in production',
			emptyText: 'No projects found',
			emptyHint: 'Try searching for another technology or term',

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

			// Habilidades
			habilidadesTitle: 'Skills',
			habilidadesSubtitle: 'Technologies and skills I use day to day',
			filterAll: 'All',
			filterBackend: 'Backend',
			filterFrontend: 'Frontend',
			filterDatabase: 'Database',
			filterCloud: 'Cloud/DevOps',
			filterQuality: 'Quality',
			skillBackendTitle: 'Backend',
			skillBackendDesc: 'Development of APIs and services in C# and ASP.NET Core, with Clean Architecture, validation and standardized error handling.',
			skillFrontendTitle: 'Frontend',
			skillFrontendDesc: 'Interfaces in React and Next.js with TypeScript, API consumption, loading and error states, and responsive layout.',
			skillDatabaseTitle: 'Database',
			skillDatabaseDesc: 'Relational modeling, queries and stored procedures in SQL Server and PostgreSQL, EF Core migrations and indexes designed for performance.',
			skillCloudTitle: 'Cloud/DevOps',
			skillCloudDesc: 'Containers with Docker, CI/CD pipelines on GitHub Actions and deployment to AWS and Azure, with structured logs and health checks.',
			skillQualityTitle: 'Quality &amp; Security',
			skillQualityDesc: 'Unit and integration tests with xUnit, JWT authentication with refresh tokens, RBAC and rate limiting.',
			tagUnitTests: 'Unit tests',
			tagIntegrationTests: 'Integration tests',
			tagObservability: 'Observability',

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

			// Footer
			footerLabel: "Let's build something great together?",
			footerRights: '© {year} Lucas Antunes Ferreira. All rights reserved.',
			pageTitle: 'Lucas Antunes Ferreira — .NET & React Developer'
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
			// O menu mobile precisa reanexar os listeners apos a troca
			setTimeout(applyMenuListeners, 100);
		});
	}
});

// jQuery functions simplificadas
(function ($) {
	"use strict";

	if (typeof $ === 'undefined') return;

	// Full height function
	$('.js-fullheight').css('height', $(window).height());
	$(window).resize(function () {
		$('.js-fullheight').css('height', $(window).height());
	});

	// Loader
	setTimeout(function () {
		if ($('#ftco-loader').length > 0) {
			$('#ftco-loader').removeClass('show');
		}
	}, 1);

	// One page click navigation
	$(document).on('click', 'a[href^="#"]', function (event) {
		event.preventDefault();
		var href = $(this).attr('href');
		if (href && href !== '#') {
			$('html, body').animate({
				scrollTop: $(href).offset().top - 70
			}, 500);
		}
	});

	// Sticky Header com IntersectionObserver
	const headerSentinel = document.getElementById('scroll-sentinel');
	const navbar = document.querySelector('.navbar');

	if (headerSentinel && navbar) {
		const headerObserver = new IntersectionObserver((entries) => {
			entries.forEach(entry => {
				if (!entry.isIntersecting) {
					navbar.classList.add('scrolled');
				} else {
					navbar.classList.remove('scrolled');
				}
			});
		}, {
			root: null,
			threshold: 0,
			rootMargin: '0px'
		});

		headerObserver.observe(headerSentinel);
	}

})(window.jQuery);