document.addEventListener('DOMContentLoaded', function () {
	// Inicializa AOS
	AOS.init({
		duration: 800,
		easing: 'slide'
	});

	const stackBtns = document.querySelectorAll('.stack-btn');
	const projectCards = document.querySelectorAll('.project-card');
	let menuToggle = document.querySelector('.menu-toggle');
	let navLinks = document.querySelector('.nav-links');

	stackBtns.forEach(btn => {
		btn.addEventListener('click', function () {
			stackBtns.forEach(b => b.classList.remove('active'));
			btn.classList.add('active');
			const stack = btn.getAttribute('data-stack').toLowerCase();
			const projectCards = document.querySelectorAll('.project-card');
			projectCards.forEach(card => {
				if (stack === 'all' || stack === 'todos') {
					card.style.display = '';
				} else {
					const tags = Array.from(card.querySelectorAll('.project-tags span')).map(s => s.textContent.trim().toLowerCase());
					let match = false;
					if (stack === 'java') {
						match = tags.some(t => t === 'java' || t.startsWith('java '));
					} else if (stack === 'javascript') {
						match = tags.some(t => t === 'javascript' || t === 'js' || t.includes('javascript'));
					} else if (stack === 'php') {
						match = tags.some(t => t === 'php' || t.startsWith('php') || t.includes('php'));
					} else if (stack === '.net') {
						match = tags.some(t =>
							t === '.net' ||
							t === '.net 8' ||
							t === '.net 9' ||
							t === '.net core' ||
							t === '.net aspire' ||
							t === 'asp.net core' ||
							t === 'entity framework' ||
							t === 'c#' ||
							t.includes('.net') ||
							t.includes('asp.net') ||
							t.includes('entity framework') ||
							t.includes('c#')
						);
					} else {
						match = tags.some(t => t === stack);
					}
					card.style.display = match ? '' : 'none';
				}
			});
		});
	});

	// Apenas CSS controla a exibição do menu-toggle
	console.log('DOM fully loaded, JS running');

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
				console.log('Menu toggle clicked');
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

	// Language system - movido para dentro do DOMContentLoaded
	let currentLang = 'pt';
	const langBtn = document.getElementById('toggle-lang');

	// Texts for translation

	// Exemplo de troca de idioma (substitua pela sua lógica real)
	if (langBtn) {
		langBtn.addEventListener('click', function () {
			// ...sua lógica de troca de idioma...
			// Após trocar o idioma, reaplique os listeners do menu hamburguer
			setTimeout(applyMenuListeners, 100); // aguarda DOM atualizar
		});
	}
	const translations = {
		pt: {
			home: 'Home',
			sobre: 'Sobre',
			experiencias: 'Experiências',
			habilidades: 'Habilidades',
			projetos: 'Projetos',
			heroTitle: 'Olá, eu sou <span class="highlight">Lucas Antunes</span>',
			heroDesc: 'Desenvolvedor .NET Especialista | Azure Cloud | Sistemas Enterprise & Bancários',
			btnCurriculo: 'Currículo',
			btnProjetos: 'Ver Projetos',
			sobreTitle: 'Sobre Mim',
			sobreTexto: 'Desenvolvedor .NET com sólida experiência em <strong>C#</strong>, <strong>.NET 8/9</strong> e <strong>ASP.NET Core</strong>, especializado no desenvolvimento de sistemas enterprise críticos com foco no setor bancário e financeiro. Expertise comprovada em <strong>Clean Architecture</strong>, <strong>microserviços</strong> e <strong>Domain-Driven Design (DDD)</strong> para sistemas de alta disponibilidade 24/7.<br><br>Proficiente em <strong>Azure Cloud</strong>, <strong>DevOps</strong> e práticas de <strong>DevSecOps</strong> essenciais para compliance bancário. Experiência no desenvolvimento de <strong>APIs RESTful</strong> escaláveis, implementação de padrões de segurança (<strong>OAuth 2.0</strong>, <strong>JWT</strong>) e conhecimento em regulamentações financeiras (<strong>LGPD</strong>, <strong>Open Banking</strong>, <strong>PIX</strong>).<br><br>Capacidade analítica para resolução de problemas complexos em ambientes corporativos, com metodologias ágeis (<strong>Scrum</strong>/<strong>Kanban</strong>) e forte orientação para qualidade através de <strong>testes automatizados</strong> e <strong>CI/CD</strong>.',
			statExp: 'Anos de Experiência',
			statProj: 'Projetos Enterprise',
			statDisp: 'Disponibilidade Sistemas',
			sobreImgAlt: 'Minha foto de perfil',
			experienciasTitle: 'Experiências',
			expRSM: {
				empresa: 'RSM Brasil',
				periodo: 'Dezembro 2024 - Atual',
				cargo: 'Analista de Suporte de TI',
				tech: 'Azure, Windows, Linux, SQL Server, MySQL',
				desc: 'Responsável pelo atendimento e registro de chamados técnicos (Nível 1 e 2), garantindo a continuidade das operações de TI. Encarregado do diagnóstico e resolução de problemas de hardware e software, assegurando a eficiência operacional. Realiza a instalação, configuração e manutenção de aplicativos, sistemas operacionais (Windows, Linux) e periféricos. Presta suporte à infraestrutura de redes, computadores e impressoras, além de otimizar processos internos através de suporte técnico proativo.'
			},
			expAlura: {
				empresa: 'Alura',
				periodo: '2022 - Atual',
				cargo: 'Formação para Programação',
				desc: 'Na Alura, estou seguindo as principais formações no assunto Full-stack, tendo a oportunidade de aprender sobre programação, construção e desenvolvimento de software.'
			},
			expEstacio: {
				empresa: 'Estácio',
				periodo: '2023 - 2027 (previsão)',
				cargo: 'Ciência da Computação',
				desc: 'Atualmente, estou cursando Ciência da Computação na Universidade Veiga de Almeida, onde tenho a oportunidade de aprimorar minhas habilidades e conhecimentos em programação desenvolvendo software e projetos para trabalhos escolares.'
			},
			expFreela: {
				empresa: 'Freelancer',
				periodo: 'Janeiro de 2024 - Novembro de 2024',
				cargo: 'Desenvolvedor Fullstack',
				tech: 'C#,.NET Core, React, Node.js, PHP, Laravel, TypeScript e JavaScript',
				desc: 'Responsável pelo desenvolvimento fullstack de aplicações web e APIs RESTful utilizando C#, .NET Core, React, Node.js, PHP, Laravel, TypeScript e JavaScript. Experiência em modelagem e otimização de bancos de dados relacionais (SQL Server, MySQL) e NoSQL (MongoDB). Implementa princípios SOLID, Clean Architecture e Design Patterns para garantir código limpo e manutenível. Desenvolve testes automatizados (unitários e de integração) com xUnit e PHPUnit. Atua em todo o ciclo de vida do desenvolvimento: análise de requisitos, design, desenvolvimento, testes e deploy, utilizando metodologias ágeis (Scrum/Kanban) e versionamento com Git.'
			},
			habilidadesTitle: 'Habilidades',
			habilidades: [
				{title: '.NET Development', desc: '.NET 8/9 (LTS), C#, ASP.NET Core, Entity Framework Core, Blazor, Worker Services, .NET Aspire'},
				{title: 'Banco de Dados Enterprise', desc: 'SQL Server, T-SQL, Oracle Database, PostgreSQL, Entity Framework, Redis Cache, Azure SQL'},
				{title: 'Azure Cloud & DevOps', desc: 'Azure DevOps, Azure Service Bus, Azure Key Vault, Docker, Kubernetes, CI/CD, GitHub Actions'},
				{title: 'Arquitetura Enterprise', desc: 'Clean Architecture, DDD, CQRS, Event Sourcing, Microservices, API Gateway, Event-Driven Architecture'},
				{title: 'Segurança & Compliance', desc: 'OAuth 2.0, JWT, mTLS, PCI-DSS, LGPD, Open Banking, DevSecOps, Security Headers, Input Validation'},
				{title: 'APIs & Integração Bancária', desc: 'REST APIs, SignalR, Swagger/OpenAPI, Core Banking Systems, PIX, WebSockets, RabbitMQ'},
				{title: 'Frontend Enterprise', desc: 'Angular, React, TypeScript, Blazor Server, HTML5, CSS3, Tailwind CSS, JavaScript ES6+'},
				{title: 'Qualidade & Testes', desc: 'xUnit, NUnit, TDD, BDD, Clean Code, SOLID, Code Review, SonarQube, Integration Testing'},
				{title: 'Metodologias Corporativas', desc: 'Scrum, Kanban, Agile, Git Flow, Azure Boards, Code Review, Pair Programming, ITIL'}
			],
			projetosTitle: 'Projetos',
			projetosSubtitle: 'Explore minha jornada de desenvolvimento através destes projetos que demonstram diferentes tecnologias e arquiteturas',
			contato: 'Entre em contato: ',
			stacks: ['Todos','.NET','React','TypeScript','Python','Java','JavaScript','PHP','Node.js','CSS'],
			projetos: [
				{
					img: 'assets/Armazem_saojoaquim.png',
					alt: 'Armazém São Joaquim',
					title: 'Armazém São Joaquim',
					desc: 'Sistema completo de restaurante com cardápio digital interativo, pousada, café e blog. Inclui gestão de reservas, painel administrativo e design responsivo multilíngue (PT/EN).',
					tags: ['Next.js 14','TypeScript','Supabase','Tailwind CSS','PostgreSQL','Resend API','Row Level Security','Multilíngue'],
					code: 'https://github.com/Lucasantunesribeiro/armazemsaojoaquim',
					demo: 'https://armazemsaojoaquim.com.br/pt'
				},
				{
					img: 'assets/article_summarizer_agent.png',
					alt: 'Article Summarizer Agent',
					title: 'Article Summarizer Agent',
					desc: 'Aplicação Python que extrai, processa e resume artigos de qualquer site, com bypass avançado de WAF (Cloudflare, DataCamp), múltiplos formatos de saída e API RESTful completa.',
					tags: ['Python','Flask','Selenium','NLP','WAF Bypass','API REST','Docker'],
					code: 'https://github.com/Lucasantunesribeiro/article_summarizer_agent',
					demo: 'https://article-summarizer-agent.onrender.com/'
				},
				{
					img: 'assets/Collab_docs.png',
					alt: 'CollabDocs',
					title: 'CollabDocs',
					desc: 'Plataforma de documentos colaborativos com Next.js 15, Cloudflare Workers, D1 database e KV storage. Sistema 100% funcional com autenticação OAuth e colaboração em tempo real.',
					tags: ['Next.js 15','TypeScript','Cloudflare Workers','D1 Database','KV Storage','Tailwind CSS','OAuth','Edge Computing'],
					code: 'https://github.com/Lucasantunesribeiro/Collabdocs',
					demo: 'https://collabdocs-app.vercel.app/'
				},
				{
					img: 'assets/nfe_api_swagger_com_moldura.png',
					alt: 'Emissão NF-e',
					title: 'Emissão Automatizada de NF-e',
					desc: 'Sistema enterprise para emissão automatizada de Nota Fiscal Eletrônica com .NET 9, Clean Architecture, background services, health checks e deploy automatizado na AWS Lambda.',
					tags: ['.NET 9','Clean Architecture','PostgreSQL','Docker','Health Checks','Background Services','xUnit','AWS Lambda'],
					code: 'https://github.com/Lucasantunesribeiro/simulador_emissor',
					demo: 'https://42zqg8iw8b.execute-api.us-east-1.amazonaws.com/prod/swagger/index.html'
				},
				{
					img: 'assets/linkguardiao_com_moldura.png',
					alt: 'LinkGuardião',
					title: 'LinkGuardião',
					desc: 'Sistema completo de encurtamento de URLs com proteção por senha, expiração automática, estatísticas detalhadas e dashboard administrativo. Inclui análise de cliques e localização geográfica.',
					tags: ['ASP.NET Core 8','React','TypeScript','SQLite','Entity Framework','JWT Auth','Chart.js','Tailwind CSS'],
					code: 'https://github.com/Lucasantunesribeiro/LinkGuardiao'
				},
				{
					img: 'data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'400\' height=\'250\' viewBox=\'0 0 400 250\'%3E%3Crect width=\'400\' height=\'250\' fill=\'%23111827\'/%3E%3Ctext x=\'200\' y=\'115\' text-anchor=\'middle\' dominant-baseline=\'middle\' fill=\'%237c3aed\' font-family=\'Inter, sans-serif\' font-size=\'20\' font-weight=\'600\'%3EOrder Management%3C/text%3E%3Ctext x=\'200\' y=\'140\' text-anchor=\'middle\' dominant-baseline=\'middle\' fill=\'%239ca3af\' font-family=\'Inter, sans-serif\' font-size=\'14\'%3EEvent Sourcing + CQRS%3C/text%3E%3C/svg%3E',
					alt: 'Sistema Distribuído',
					title: 'Sistema de Gestão Distribuído com Event Sourcing',
					desc: 'Arquitetura de microserviços com Event Sourcing, CQRS, comunicação assíncrona via RabbitMQ, frontend React 18 e observabilidade completa com métricas e health checks.',
					tags: ['Java 17','Spring Boot','Event Sourcing','CQRS','RabbitMQ','PostgreSQL','React 18','Docker'],
					code: 'https://github.com/Lucasantunesribeiro/Sistema_de_Gestao_de_Pedidos_Distribu-do_com_Event_Sourcing'
				},
				{
					img: 'assets/Locadora_decarros.png',
					alt: 'Locadora de Carros',
					title: 'Sistema de Locadora de Carros',
					desc: 'Sistema completo de gestão de locadora com autenticação, CRUD de usuários e carros, sistema de aluguéis com validações, controle de permissões e interface responsiva moderna.',
					tags: ['PHP 8.1+','SQLite','HTML5','CSS3','JavaScript','Design System','shadcn/ui','Responsivo'],
					code: 'https://github.com/Lucasantunesribeiro/locadora_de_carros',
					demo: 'https://locadora-de-carros.onrender.com/'
				},
				{
					img: 'assets/Smart_finance.png',
					alt: 'SmartFinance',
					title: 'SmartFinance - Sistema de Gestão Financeira Empresarial',
					desc: 'Sistema financeiro empresarial completo com dashboard em tempo real, gestão de transações, processamento de pagamentos, análise de dados e segurança enterprise-ready. Arquitetura moderna, microserviços e deploy automatizado.',
					tags: ['Next.js 14','TypeScript','Tailwind CSS','.NET 8','Node.js','SQL Server','MongoDB','Docker','AWS'],
					code: 'https://github.com/lucasantunesribeiro/smart_finance',
					demo: 'http://204.236.248.148'
				},
				{
					img: 'assets/jogo_numero_secreto_com_moldura.png',
					alt: 'Número Secreto',
					title: 'Sorteador de Números',
					desc: 'Aplicação interativa com múltiplas funcionalidades: sorteador de números, adivinhação, par ou ímpar e roleta. Interface moderna com tema escuro e design responsivo.',
					tags: ['HTML','CSS','JavaScript','Responsivo','Dark Theme','Interativo'],
					code: 'https://github.com/Lucasantunesribeiro/Numero-Secreto',
					demo: 'https://sorteador-de-numeros-six-pi.vercel.app/'
				},
				{
					img: 'assets/super_burger_com_moldura.png',
					alt: 'Hamburgueria Website',
					title: 'Super Burger - Website Premium',
					desc: 'Website responsivo para hamburgueria artesanal com design premium, cardápio interativo, seção de equipe e contato. Interface moderna com tema escuro e elementos visuais atrativos.',
					tags: ['HTML','CSS','JavaScript','Responsivo','Dark Theme','Premium Design','Mobile-First'],
					code: 'https://github.com/Lucasantunesribeiro/hamburgueria-website',
					demo: 'https://projeto-hamburgueria-pi.vercel.app/'
				}
			]
		},
		en: {
			home: 'Home',
			sobre: 'About',
			experiencias: 'Experience',
			habilidades: 'Skills',
			projetos: 'Projects',
			heroTitle: 'Hi, I am <span class="highlight">Lucas Antunes</span>',
			heroDesc: '.NET Specialist Developer | Azure Cloud | Enterprise & Banking Systems',
			btnCurriculo: 'Resume',
			btnProjetos: 'See Projects',
			sobreTitle: 'About Me',
			sobreTexto: '.NET developer with solid experience in <strong>C#</strong>, <strong>.NET 8/9</strong> and <strong>ASP.NET Core</strong>, specialized in building critical enterprise systems for the banking and financial sector. Proven expertise in <strong>Clean Architecture</strong>, <strong>microservices</strong> and <strong>Domain-Driven Design (DDD)</strong> for high availability 24/7 systems.<br><br>Proficient in <strong>Azure Cloud</strong>, <strong>DevOps</strong> and <strong>DevSecOps</strong> practices essential for banking compliance. Experience in developing scalable <strong>RESTful APIs</strong>, implementing security standards (<strong>OAuth 2.0</strong>, <strong>JWT</strong>) and knowledge of financial regulations (<strong>LGPD</strong>, <strong>Open Banking</strong>, <strong>PIX</strong>).<br><br>Analytical skills for solving complex problems in corporate environments, with agile methodologies (<strong>Scrum</strong>/<strong>Kanban</strong>) and strong focus on quality through <strong>automated testing</strong> and <strong>CI/CD</strong>.',
			statExp: 'Years of Experience',
			statProj: 'Enterprise Projects',
			statDisp: 'System Availability',
			sobreImgAlt: 'My profile photo',
			experienciasTitle: 'Experience',
			expRSM: {
				empresa: 'RSM Brasil',
				periodo: 'Dec 2024 - Present',
				cargo: 'IT Support Analyst',
				tech: 'Azure, Windows, Linux, SQL Server, MySQL',
				desc: 'Responsible for technical support and ticket registration (Level 1 and 2), ensuring continuity of IT operations. In charge of diagnosing and solving hardware and software issues, ensuring operational efficiency. Installs, configures and maintains applications, operating systems (Windows, Linux) and peripherals. Provides support for network infrastructure, computers and printers, and optimizes internal processes through proactive technical support.'
			},
			expAlura: {
				empresa: 'Alura',
				periodo: '2022 - Present',
				cargo: 'Programming Training',
				desc: 'At Alura, I am following the main full-stack training programs, having the opportunity to learn about programming, software construction and development.'
			},
			expEstacio: {
				empresa: 'Estácio',
				periodo: '2023 - 2027 (expected)',
				cargo: 'Computer Science',
				desc: 'Currently studying Computer Science at Universidade Veiga de Almeida, where I have the opportunity to improve my programming skills and knowledge by developing software and projects for school assignments.'
			},
			expFreela: {
				empresa: 'Freelancer',
				periodo: 'Jan 2024 - Nov 2024',
				cargo: 'Fullstack Developer',
				tech: 'C#,.NET Core, React, Node.js, PHP, Laravel, TypeScript and JavaScript',
				desc: 'Responsible for fullstack development of web applications and RESTful APIs using C#, .NET Core, React, Node.js, PHP, Laravel, TypeScript and JavaScript. Experience in modeling and optimizing relational (SQL Server, MySQL) and NoSQL (MongoDB) databases. Implements SOLID principles, Clean Architecture and Design Patterns to ensure clean and maintainable code. Develops automated tests (unit and integration) with xUnit and PHPUnit. Works throughout the development lifecycle: requirements analysis, design, development, testing and deployment, using agile methodologies (Scrum/Kanban) and versioning with Git.'
			},
			habilidadesTitle: 'My Skills',
			habilidades: [
				{title: '.NET Development', desc: '.NET 8/9 (LTS), C#, ASP.NET Core, Entity Framework Core, Blazor, Worker Services, .NET Aspire'},
				{title: 'Enterprise Databases', desc: 'SQL Server, T-SQL, Oracle Database, PostgreSQL, Entity Framework, Redis Cache, Azure SQL'},
				{title: 'Azure Cloud & DevOps', desc: 'Azure DevOps, Azure Service Bus, Azure Key Vault, Docker, Kubernetes, CI/CD, GitHub Actions'},
				{title: 'Enterprise Architecture', desc: 'Clean Architecture, DDD, CQRS, Event Sourcing, Microservices, API Gateway, Event-Driven Architecture'},
				{title: 'Security & Compliance', desc: 'OAuth 2.0, JWT, mTLS, PCI-DSS, LGPD, Open Banking, DevSecOps, Security Headers, Input Validation'},
				{title: 'Banking APIs & Integration', desc: 'REST APIs, SignalR, Swagger/OpenAPI, Core Banking Systems, PIX, WebSockets, RabbitMQ'},
				{title: 'Enterprise Frontend', desc: 'Angular, React, TypeScript, Blazor Server, HTML5, CSS3, Tailwind CSS, JavaScript ES6+'},
				{title: 'Quality & Testing', desc: 'xUnit, NUnit, TDD, BDD, Clean Code, SOLID, Code Review, SonarQube, Integration Testing'},
				{title: 'Corporate Methodologies', desc: 'Scrum, Kanban, Agile, Git Flow, Azure Boards, Code Review, Pair Programming, ITIL'}
			],
			projetosTitle: 'Projects',
			projetosSubtitle: 'Explore my development journey through these projects showcasing different technologies and architectures',
			contato: 'Contact: ',
			stacks: ['All','.NET','React','TypeScript','Python','Java','JavaScript','PHP','Node.js','CSS'],
			projetos: [
				{
					img: 'assets/Armazem_saojoaquim.png',
					alt: 'Armazém São Joaquim',
					title: 'Armazém São Joaquim',
					desc: 'Complete restaurant system with interactive digital menu, inn, coffee shop and blog. Includes reservation management, admin panel and responsive multilingual design (PT/EN).',
					tags: ['Next.js 14','TypeScript','Supabase','Tailwind CSS','PostgreSQL','Resend API','Row Level Security','Multilingual'],
					code: 'https://github.com/Lucasantunesribeiro/armazemsaojoaquim',
					demo: 'https://armazemsaojoaquim.com.br/pt'
				},
				{
					img: 'assets/article_summarizer_agent.png',
					alt: 'Article Summarizer Agent',
					title: 'Article Summarizer Agent',
					desc: 'Python app that extracts, processes and summarizes articles from any site, with advanced WAF bypass (Cloudflare, DataCamp), multiple output formats and full RESTful API.',
					tags: ['Python','Flask','Selenium','NLP','WAF Bypass','REST API','Docker'],
					code: 'https://github.com/Lucasantunesribeiro/article_summarizer_agent',
					demo: 'https://article-summarizer-agent.onrender.com/'
				},
				{
					img: 'assets/Collab_docs.png',
					alt: 'CollabDocs',
					title: 'CollabDocs',
					desc: 'Collaborative document platform with Next.js 15, Cloudflare Workers, D1 database and KV storage. Fully functional system with OAuth authentication and real-time collaboration.',
					tags: ['Next.js 15','TypeScript','Cloudflare Workers','D1 Database','KV Storage','Tailwind CSS','OAuth','Edge Computing'],
					code: 'https://github.com/Lucasantunesribeiro/Collabdocs',
					demo: 'https://collabdocs-app.vercel.app/'
				},
				{
					img: 'assets/nfe_api_swagger_com_moldura.png',
					alt: 'NF-e Automation',
					title: 'Automated NF-e Issuance',
					desc: 'Enterprise system for automated Electronic Invoice Issuance with .NET 9, Clean Architecture, background services, health checks and automated deployment on AWS Lambda.',
					tags: ['.NET 9','Clean Architecture','PostgreSQL','Docker','Health Checks','Background Services','xUnit','AWS Lambda'],
					code: 'https://github.com/Lucasantunesribeiro/simulador_emissor',
					demo: 'https://42zqg8iw8b.execute-api.us-east-1.amazonaws.com/prod/swagger/index.html'
				},
				{
					img: 'assets/linkguardiao_com_moldura.png',
					alt: 'LinkGuardião',
					title: 'LinkGuardião',
					desc: 'Complete URL shortener system with password protection, automatic expiration, detailed statistics and admin dashboard. Includes click analysis and geolocation.',
					tags: ['ASP.NET Core 8','React','TypeScript','SQLite','Entity Framework','JWT Auth','Chart.js','Tailwind CSS'],
					code: 'https://github.com/Lucasantunesribeiro/LinkGuardiao'
				},
				{
					img: 'data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'400\' height=\'250\' viewBox=\'0 0 400 250\'%3E%3Crect width=\'400\' height=\'250\' fill=\'%23111827\'/%3E%3Ctext x=\'200\' y=\'115\' text-anchor=\'middle\' dominant-baseline=\'middle\' fill=\'%237c3aed\' font-family=\'Inter, sans-serif\' font-size=\'20\' font-weight=\'600\'%3EOrder Management%3C/text%3E%3Ctext x=\'200\' y=\'140\' text-anchor=\'middle\' dominant-baseline=\'middle\' fill=\'%239ca3af\' font-family=\'Inter, sans-serif\' font-size=\'14\'%3EEvent Sourcing + CQRS%3C/text%3E%3C/svg%3E',
					alt: 'Distributed System',
					title: 'Distributed Order Management System with Event Sourcing',
					desc: 'Microservices architecture with Event Sourcing, CQRS, asynchronous communication via RabbitMQ, React 18 frontend and full observability with metrics and health checks.',
					tags: ['Java 17','Spring Boot','Event Sourcing','CQRS','RabbitMQ','PostgreSQL','React 18','Docker'],
					code: 'https://github.com/Lucasantunesribeiro/Sistema_de_Gestao_de_Pedidos_Distribu-do_com_Event_Sourcing'
				},
				{
					img: 'assets/Locadora_decarros.png',
					alt: 'Car Rental System',
					title: 'Car Rental System',
					desc: 'Complete car rental management system with authentication, CRUD for users and cars, rental system with validations, permission control and modern responsive interface.',
					tags: ['PHP 8.1+','SQLite','HTML5','CSS3','JavaScript','Design System','shadcn/ui','Responsive'],
					code: 'https://github.com/Lucasantunesribeiro/locadora_de_carros',
					demo: 'https://locadora-de-carros.onrender.com/'
				},
				{
					img: 'assets/Smart_finance.png',
					alt: 'SmartFinance',
					title: 'SmartFinance - Enterprise Financial System',
					desc: 'Complete enterprise financial system with real-time dashboard, transaction management, categories, bank accounts, budgets and advanced reports with interactive charts.',
					tags: ['Next.js 13.5','React','TypeScript','Tailwind CSS','Node.js','JWT Auth','Chart.js','PM2'],
					code: 'https://github.com/Lucasantunesribeiro/smart_finance',
					demo: 'http://34.203.238.219:3000/dashboard'
				},
				{
					img: 'assets/jogo_numero_secreto_com_moldura.png',
					alt: 'Secret Number',
					title: 'Number Sorter',
					desc: 'Interactive app with multiple features: number sorter, guessing, even or odd and roulette. Modern interface with dark theme and responsive design.',
					tags: ['HTML','CSS','JavaScript','Responsive','Dark Theme','Interactive'],
					code: 'https://github.com/Lucasantunesribeiro/Numero-Secreto',
					demo: 'https://sorteador-de-numeros-six-pi.vercel.app/'
				},
				{
					img: 'assets/super_burger_com_moldura.png',
					alt: 'Burger Website',
					title: 'Super Burger - Premium Website',
					desc: 'Responsive website for artisanal burger shop with premium design, interactive menu, team and contact section. Modern interface with dark theme and attractive visuals.',
					tags: ['HTML','CSS','JavaScript','Responsive','Dark Theme','Premium Design','Mobile-First'],
					code: 'https://github.com/Lucasantunesribeiro/hamburgueria-website',
					demo: 'https://projeto-hamburgueria-pi.vercel.app/'
				}
			]
		}
	};

	function setLanguage(lang) {
		// Navbar links
		const navLinks = document.querySelectorAll('.nav-links a');
		if (navLinks.length >= 5) {
			navLinks[0].textContent = translations[lang].home;
			navLinks[1].textContent = translations[lang].sobre;
			navLinks[2].textContent = translations[lang].experiencias;
			navLinks[3].textContent = translations[lang].habilidades;
			navLinks[4].textContent = translations[lang].projetos;
		}

		// Hero section
		const heroTitle = document.querySelector('.hero-content h1');
		if (heroTitle) heroTitle.innerHTML = translations[lang].heroTitle;
		const heroDesc = document.querySelector('.hero-content p');
		if (heroDesc) heroDesc.textContent = translations[lang].heroDesc;

		// Hero buttons
		const btns = document.querySelectorAll('.hero-buttons .btn');
		if (btns[0]) btns[0].textContent = translations[lang].btnCurriculo;
		if (btns[1]) btns[1].textContent = translations[lang].btnProjetos;

		// Sobre section
		const sobreTitle = document.querySelector('#sobre h2');
		if (sobreTitle) sobreTitle.textContent = translations[lang].sobreTitle;
		const sobreTexto = document.querySelector('.sobre-texto p');
		if (sobreTexto) sobreTexto.innerHTML = translations[lang].sobreTexto;
		
		// Estatísticas
		const statItems = document.querySelectorAll('.stat-item p');
		if (statItems.length >= 3) {
			statItems[0].textContent = translations[lang].statExp;
			statItems[1].textContent = translations[lang].statProj;
			statItems[2].textContent = translations[lang].statDisp;
		}
		
		// Imagem alt
		const sobreImg = document.querySelector('.profile-img');
		if (sobreImg) sobreImg.alt = translations[lang].sobreImgAlt;

		// Experiências
		const expTitle = document.querySelector('#experiencias .section-title');
		if (expTitle) expTitle.textContent = translations[lang].experienciasTitle;
		const expBlocks = document.querySelectorAll('#experiencias .timeline-item');
		if (expBlocks.length >= 4) {
			// RSM
			const rsm = expBlocks[0];
			if (rsm) {
				const h3 = rsm.querySelector('h3');
				if (h3) h3.textContent = translations[lang].expRSM.empresa;
				const period = rsm.querySelector('.timeline-period');
				if (period) period.textContent = translations[lang].expRSM.periodo;
				const role = rsm.querySelector('.timeline-role');
				if (role) role.textContent = translations[lang].expRSM.cargo;
				const tech = rsm.querySelector('.timeline-tech');
				if (tech) tech.textContent = translations[lang].expRSM.tech;
				const ps = rsm.querySelectorAll('p');
				if (ps.length > 2 && ps[2]) ps[2].textContent = translations[lang].expRSM.desc;
			}
			// Alura
			const alura = expBlocks[1];
			if (alura) {
				const h3 = alura.querySelector('h3');
				if (h3) h3.textContent = translations[lang].expAlura.empresa;
				const period = alura.querySelector('.timeline-period');
				if (period) period.textContent = translations[lang].expAlura.periodo;
				const role = alura.querySelector('.timeline-role');
				if (role) role.textContent = translations[lang].expAlura.cargo;
				const ps = alura.querySelectorAll('p');
				if (ps.length > 1 && ps[1]) ps[1].textContent = translations[lang].expAlura.desc;
			}
			// Estácio
			const estacio = expBlocks[2];
			if (estacio) {
				const h3 = estacio.querySelector('h3');
				if (h3) h3.textContent = translations[lang].expEstacio.empresa;
				const period = estacio.querySelector('.timeline-period');
				if (period) period.textContent = translations[lang].expEstacio.periodo;
				const role = estacio.querySelector('.timeline-role');
				if (role) role.textContent = translations[lang].expEstacio.cargo;
				const ps = estacio.querySelectorAll('p');
				if (ps.length > 1 && ps[1]) ps[1].textContent = translations[lang].expEstacio.desc;
			}
			// Freelancer
			const freela = expBlocks[3];
			if (freela) {
				const h3 = freela.querySelector('h3');
				if (h3) h3.textContent = translations[lang].expFreela.empresa;
				const period = freela.querySelector('.timeline-period');
				if (period) period.textContent = translations[lang].expFreela.periodo;
				const role = freela.querySelector('.timeline-role');
				if (role) role.textContent = translations[lang].expFreela.cargo;
				const tech = freela.querySelector('.timeline-tech');
				if (tech) tech.textContent = translations[lang].expFreela.tech;
				const ps = freela.querySelectorAll('p');
				if (ps.length > 2 && ps[2]) ps[2].textContent = translations[lang].expFreela.desc;
			}
		}

		// Habilidades
		const habilidadesTitle = document.querySelector('#habilidades h2');
		if (habilidadesTitle) habilidadesTitle.textContent = translations[lang].habilidadesTitle;
		const skillCards = document.querySelectorAll('.skill-card');
		// Atualiza apenas os cards que têm tradução
		translations[lang].habilidades.forEach((skill, i) => {
			if (skillCards[i]) {
				const h3 = skillCards[i].querySelector('h3');
				const p = skillCards[i].querySelector('p');
				if (h3) h3.textContent = skill.title;
				if (p) p.textContent = skill.desc;
			}
		});
		// Limpa cards extras
		for (let i = translations[lang].habilidades.length; i < skillCards.length; i++) {
			const h3 = skillCards[i].querySelector('h3');
			const p = skillCards[i].querySelector('p');
			if (h3) h3.textContent = '';
			if (p) p.textContent = '';
		}

		// Projetos section
		const projetosTitle = document.querySelector('#projetos h2');
		if (projetosTitle) projetosTitle.innerHTML = translations[lang].projetosTitle;
		const projetosSubtitle = document.querySelector('.projetos-subtitle');
		if (projetosSubtitle) projetosSubtitle.textContent = translations[lang].projetosSubtitle;
		// Traduz botões de stacks
		const stackBtns = document.querySelectorAll('.stack-btn');
		if (stackBtns.length === translations[lang].stacks.length) {
			translations[lang].stacks.forEach((stackText, i) => {
				const btn = stackBtns[i];
				const icon = btn.querySelector('i');
				btn.innerHTML = icon ? icon.outerHTML + ' ' + stackText : stackText;
			});
		}

		// Corrige links de navegação para mostrar apenas 'Habilidades' e 'Projetos'
		const habilidadesLink = document.querySelector('a[href="#habilidades"]');
		if (habilidadesLink) {
			habilidadesLink.textContent = translations[lang].habilidadesTitle;
		}
		const projetosLink = document.querySelector('a[href="#projetos"]');
		if (projetosLink) {
			projetosLink.textContent = translations[lang].projetosTitle;
		}

		// Footer contact
		const contato = document.querySelector('.contact-info p');
		if (contato) contato.textContent = translations[lang].contato;

		// Projetos traduzidos
		const projetosGrid = document.querySelector('.projetos-grid');
		if (projetosGrid && translations[lang].projetos && translations[lang].projetos.length > 0) {
			projetosGrid.innerHTML = '';
			translations[lang].projetos.forEach(proj => {
				const card = document.createElement('div');
				card.className = 'project-card';
				card.innerHTML = `
					<div class="project-image">
						<img src="${proj.img}" alt="${proj.alt}">
					</div>
					<div class="project-content">
						<h3>${proj.title}</h3>
						<p>${proj.desc}</p>
						<div class="project-tags">
							${proj.tags.map(tag => `<span>${tag}</span>`).join('')}
						</div>
						<div class="project-links">
							${proj.code ? `<a href="${proj.code}" class="btn-project"><i class="fas fa-code"></i> ${lang === 'pt' ? 'Ver Código' : 'See Code'}</a>` : ''}
							${proj.demo ? `<a href="${proj.demo}" class="btn-project"><i class="fas fa-external-link-alt"></i> Demo</a>` : ''}
						</div>
					</div>
				`;
				projetosGrid.appendChild(card);
			});
		}
	}

	// Event listener para botão de idioma
	if (langBtn) {
		langBtn.addEventListener('click', function () {
			currentLang = currentLang === 'pt' ? 'en' : 'pt';
			setLanguage(currentLang);
			langBtn.textContent = currentLang === 'pt' ? 'PT / EN' : 'EN / PT';
		});

		// Set initial language
		setLanguage(currentLang);
	}
});

// jQuery functions simplificadas
(function($) {
	"use strict";

	if (typeof $ === 'undefined') return;

	// Full height function
	$('.js-fullheight').css('height', $(window).height());
	$(window).resize(function(){
		$('.js-fullheight').css('height', $(window).height());
	});

	// Loader
	setTimeout(function() { 
		if($('#ftco-loader').length > 0) {
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

	// Scroll window
	$(window).scroll(function(){
		var $w = $(this),
			st = $w.scrollTop(),
			navbar = $('.ftco_navbar');

		if (st > 150) {
			navbar.addClass('scrolled');
		} else {
			navbar.removeClass('scrolled sleep');
		}
		
		if (st > 350) {
			navbar.addClass('awake');
		} else {
			navbar.removeClass('awake').addClass('sleep');
		}
	});

})(window.jQuery);