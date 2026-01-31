document.addEventListener('DOMContentLoaded', function () {
	// Inicializa AOS
	AOS.init({
		duration: 800,
		easing: 'slide'
	});


	// Variáveis globais de navegação controladas por applyMenuListeners
	// A lógica de filtragem de projetos foi movida para js/projetos.js


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
			heroTitle: 'Olá, eu sou <span class="highlight">Lucas Antunes Ferreira</span>',
			heroDesc: 'Desenvolvedor Full Stack | .NET Specialist | Arquitetura de Software',
			heroDescMobile: 'Desenvolvedor Full Stack | .NET Specialist',
			btnCurriculo: 'Currículo',
			btnProjetos: 'Ver Projetos',
			sobreTitle: 'Sobre Mim',
			sobreTexto: '<p>Sou um desenvolvedor Fullstack apaixonado por construir sistemas <strong class="highlight">robustos</strong> e <strong class="highlight">escaláveis</strong>.</p><p>Com uma base sólida em Ciência da Computação e experiência prática em ambientes corporativos, foco em entregar valor através de <strong class="highlight">Clean Architecture</strong>, <strong class="highlight">testes automatizados</strong> e <strong class="highlight">boas práticas</strong>.</p><p>Transformo requisitos complexos em soluções eficientes, sempre priorizando performance, segurança e uma excelente experiência para o usuário.</p>',
			sobreTextoMobile: 'Dev Fullstack focado em sistemas <strong class="highlight">robustos</strong>. Uso <strong class="highlight">Clean Architecture</strong> para criar soluções eficientes e de alta performance.',
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
				periodo: 'Janeiro de 2024 - Atual',
				cargo: 'Desenvolvedor Fullstack',
				tech: 'C#, .NET Core, React, Java, Spring, Python, Django, Flask, Node.js, PHP, Laravel, TypeScript e JavaScript',
				desc: 'Responsável pelo desenvolvimento fullstack de aplicações web e APIs RESTful utilizando C#, .NET Core, React, Node.js, PHP, Laravel, TypeScript e JavaScript. Experiência em modelagem e otimização de bancos de dados relacionais (SQL Server, MySQL) e NoSQL (MongoDB). Implementa princípios SOLID, Clean Architecture e Design Patterns para garantir código limpo e manutenível. Desenvolve testes automatizados (unitários e de integração) com xUnit e PHPUnit. Atua em todo o ciclo de vida do desenvolvimento: análise de requisitos, design, desenvolvimento, testes e deploy, utilizando metodologias ágeis (Scrum/Kanban) e versionamento com Git.'
			},
			habilidadesTitle: 'Habilidades',
			habilidades: [
				{ title: 'Backend', desc: 'C#/.NET (ASP.NET Core, EF Core), Node.js (Express), APIs REST, JWT, Clean Architecture' },
				{ title: 'Frontend', desc: 'React, Next.js, TypeScript, Tailwind, shadcn/ui' },
				{ title: 'Banco de Dados', desc: 'PostgreSQL, SQL, Prisma, Supabase (RLS)' },
				{ title: 'Cloud/DevOps', desc: 'AWS, Docker, CI/CD (GitHub Actions), Observabilidade' },
				{ title: 'Qualidade & Segurança', desc: 'Testes unitários/integração, Health Checks, Performance & Security' }
			],
			projetosTitle: 'Projetos',
			projetosSubtitle: 'Explore minha jornada de desenvolvimento através destes projetos',
			contato: 'Entre em contato: ',
			stacks: ['Todos', '.NET', 'React', 'TypeScript', 'Python', 'Java', 'JavaScript', 'PHP', 'Node.js', 'CSS'],
			projetos: [
				{
					img: 'assets/sistema_distribuido_mockup.webp',
					alt: 'Sistema Distribuído',
					title: 'Sistema de Gestão Distribuído',
					desc: 'Arquitetura complexa de Microsserviços utilizando Event Sourcing e CQRS. Implementado com Java Spring Boot, RabbitMQ e PostgreSQL para alta escalabilidade.',
					tags: ['Java', 'Spring Boot', 'RabbitMQ', 'Event Sourcing', 'CQRS'],
					code: 'https://github.com/Lucasantunesribeiro/Sistema_de_Gestao_de_Pedidos_Distribu-do_com_Event_Sourcing'
				},
				{
					img: 'assets/emiss_o_automatizada_de_nf_e_mockup.webp',
					alt: 'Emissão NF-e',
					title: 'Emissão Automatizada de NF-e',
					desc: 'Sistema distribuído Serverless Event-Driven na AWS. Utiliza Lambda (Go + .NET 9), EventBridge e SQS para emissão fiscal massiva e geração de PDFs com alta performance.',
					tags: ['AWS Lambda', 'Go', '.NET 9', 'EventBridge', 'Serverless'],
					code: 'https://github.com/Lucasantunesribeiro/emissao_nfe',
					demo: 'https://d3065hze06690c.cloudfront.net/login'
				},
				{
					img: 'assets/emailtriageai_mockup.webp',
					alt: 'EmailTriageAI',
					title: 'EmailTriageAI',
					desc: 'Sistema inteligente de triagem de emails corporativos. Utiliza IA (Gemini) e NLP para classificar, resumir e gerar respostas automáticas para mensagens, otimizando o fluxo de trabalho.',
					tags: ['Python', 'FastAPI', 'Gemini AI', 'NLP', 'Docker'],
					code: 'https://github.com/Lucasantunesribeiro/EmailTriageAI',
					demo: 'http://100.48.50.86/'
				},
				{
					img: 'assets/linkguardi_o_mockup.webp',
					alt: 'LinkGuardião',
					title: 'LinkGuardião',
					desc: 'Encurtador de URLs corporativo com proteção por senha e analytics detalhado. Backend robusto em ASP.NET Core 8 com arquitetura limpa.',
					tags: ['ASP.NET Core 8', 'React', 'EF Core', 'Docker', 'Analytics'],
					code: 'https://github.com/Lucasantunesribeiro/LinkGuardiao',
					demo: 'https://linkguardiao.pages.dev/'
				},
				{
					img: 'assets/article_summarizer_agent_mockup.webp',
					alt: 'Article Summarizer Agent',
					title: 'Article Summarizer Agent',
					desc: 'Agente de IA capaz de contornar WAFs avançados (Cloudflare) para extrair e resumir artigos da web. Utiliza Selenium stealth e fallback strategies para garantia de coleta.',
					tags: ['Python', 'Selenium Stealth', 'Flask', 'AI Agent', 'WAF Bypass'],
					code: 'https://github.com/Lucasantunesribeiro/article_summarizer_agent',
					demo: 'https://article-summarizer-agent.onrender.com/'
				},
				{
					img: 'assets/smartfinance_mockup.webp',
					alt: 'SmartFinance',
					title: 'SmartFinance',
					desc: 'Aplicação Fullstack multi-idioma segura com ALB privado e ECS. Oferece gestão financeira com dashboards interativos, CSRF protection e autenticação JWT robusta.',
					tags: ['Next.js', 'Node.js', 'AWS ECS', 'Terraform', 'Multi-tenant'],
					code: 'https://github.com/Lucasantunesribeiro/smart_finance',
					demo: 'http://smartfinance-prod-alb-1713518371.sa-east-1.elb.amazonaws.com/'
				},
				{
					img: 'assets/kogui_pokedex_mockup.webp',
					alt: 'Kogui Pokédx',
					title: 'Kogui Pokédx',
					desc: 'Desafio técnico Fullstack com Django 5.0 e Angular 17. Integração à PokéAPI, autenticação JWT, sistema de favoritos e painel administrativo.',
					tags: ['Angular 17', 'Django 5.0', 'PostgreSQL', 'Docker', 'JWT'],
					code: 'https://github.com/Lucasantunesribeiro/Kogui_pokedex'
				},
				{
					img: 'assets/collabdocs_mockup.webp',
					alt: 'CollabDocs',
					title: 'CollabDocs',
					desc: 'Plataforma de edição colaborativa de documentos em tempo real. Arquitetura serverless moderna com Cloudflare Workers e D1, construída em Monorepo.',
					tags: ['Cloudflare Workers', 'Next.js', 'D1 SQL', 'Real-time', 'Monorepo'],
					code: 'https://github.com/Lucasantunesribeiro/Collabdocs',
					demo: 'https://collabdocs-app.vercel.app/'
				},
				{
					img: 'assets/armaz_m_s_o_joaquim_mockup.webp',
					alt: 'Armazém São Joaquim',
					title: 'Armazém São Joaquim',
					desc: 'Plataforma digital completa com Next.js 15 e Supabase. Inclui cardápio interativo, sistema de reservas, blog e área administrativa, com foco em SEO e performance.',
					tags: ['Next.js 15', 'TypeScript', 'Supabase', 'Tailwind', 'Shadcn/ui'],
					code: 'https://github.com/Lucasantunesribeiro/armazemsaojoaquim',
					demo: 'https://armazemsaojoaquim.com.br/'
				},
				{
					img: 'assets/parallel_store_mockup.webp',
					alt: 'Parallel Store',
					title: 'Parallel Store',
					desc: 'E-commerce urbano moderno construído com Next.js 15 e React 18. Foco total em conversão, performance e experiência do usuário (UX).',
					tags: ['Next.js 15', 'React 18', 'Tailwind', 'E-commerce'],
					code: 'https://github.com/Lucasantunesribeiro/parallel_store',
					demo: 'https://parallelstore.netlify.app/'
				},
				{
					img: 'assets/locadora_de_carros_mockup.webp',
					alt: 'Locadora de Carros',
					title: 'Locadora de Carros',
					desc: 'Sistema de gestão de frota e locação desenvolvido em PHP 8.1+. Possui autenticação segura, controle de permissões (ACL) e CRUDs completos.',
					tags: ['PHP 8.1', 'SQLite', 'MVC', 'Bootstrap', 'Auth'],
					code: 'https://github.com/Lucasantunesribeiro/locadora_de_carros',
					demo: 'https://locadora-de-carros.onrender.com/'
				},
				{
					img: 'assets/logic_games_suite_mockup.webp',
					alt: 'Logic Games Suite',
					title: 'Logic Games Suite',
					desc: 'Coleção de mini-jogos lógicos desenvolvidos com JavaScript puro, focando em lógica de programação e interatividade responsiva.',
					tags: ['HTML5', 'CSS3', 'JavaScript', 'Logic'],
					code: 'https://github.com/Lucasantunesribeiro/Numero-Secreto',
					demo: 'https://sorteador-de-numeros-six-pi.vercel.app/'
				}
			]
		},
		en: {
			home: 'Home',
			sobre: 'About',
			experiencias: 'Experience',
			habilidades: 'Skills',
			projetos: 'Projects',
			heroTitle: 'Hi, I am <span class="highlight">Lucas Antunes Ferreira</span>',
			heroDesc: 'Full Stack Developer | .NET Specialist | Software Architecture',
			heroDescMobile: 'Full Stack Developer | .NET Specialist',
			btnCurriculo: 'Resume',
			btnProjetos: 'See Projects',
			sobreTitle: 'About Me',
			sobreTexto: '<p>I am a Fullstack Developer passionate about building <strong class="highlight">robust</strong> and <strong class="highlight">scalable</strong> systems.</p><p>With a solid foundation in Computer Science and practical experience in corporate environments, I focus on delivering value through <strong class="highlight">Clean Architecture</strong>, <strong class="highlight">automated testing</strong>, and <strong class="highlight">best practices</strong>.</p><p>I transform complex requirements into efficient solutions, always prioritizing performance, security, and an excellent user experience.</p>',
			sobreTextoMobile: 'Fullstack Dev focused on <strong class="highlight">robust systems</strong>. Using <strong class="highlight">Clean Architecture</strong> to build efficient and high-performance solutions.',
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
				tech: 'C#, .NET Core, React, Node.js, PHP, Laravel, TypeScript and JavaScript',
				desc: 'Responsible for fullstack development of web applications and RESTful APIs using C#, .NET Core, React, Node.js, PHP, Laravel, TypeScript and JavaScript. Experience in modeling and optimizing relational (SQL Server, MySQL) and NoSQL (MongoDB). Implements SOLID principles, Clean Architecture and Design Patterns to ensure clean and maintainable code. Develops automated tests (unit and integration) with xUnit and PHPUnit. Works throughout the development lifecycle: requirements analysis, design, development, testing and deployment, using agile methodologies (Scrum/Kanban) and versioning with Git.'
			},
			habilidadesTitle: 'My Skills',
			habilidades: [
				{ title: 'Backend', desc: 'C#/.NET (ASP.NET Core, EF Core), Node.js (Express), APIs REST, JWT, Clean Architecture' },
				{ title: 'Frontend', desc: 'React, Next.js, TypeScript, Tailwind, shadcn/ui' },
				{ title: 'Database', desc: 'PostgreSQL, SQL, Prisma, Supabase (RLS)' },
				{ title: 'Cloud/DevOps', desc: 'AWS, Docker, CI/CD (GitHub Actions), Observability' },
				{ title: 'Quality & Security', desc: 'Unit/Integration Testing, Health Checks, Performance & Security' }
			],
			projetosTitle: 'Projects',
			projetosSubtitle: 'Explore my development journey through these projects',
			contato: 'Contact: ',
			stacks: ['All', '.NET', 'React', 'TypeScript', 'Python', 'Java', 'JavaScript', 'PHP', 'Node.js', 'CSS'],
			projetos: [
				{
					img: 'assets/sistema_distribuido_mockup.webp',
					alt: 'Distributed System',
					title: 'Distributed Management System',
					desc: 'Complex Microservices architecture using Event Sourcing and CQRS. Implemented with Java Spring Boot, RabbitMQ, and PostgreSQL for high scalability.',
					tags: ['Java', 'Spring Boot', 'RabbitMQ', 'Event Sourcing', 'CQRS'],
					code: 'https://github.com/Lucasantunesribeiro/Sistema_de_Gestao_de_Pedidos_Distribu-do_com_Event_Sourcing'
				},
				{
					img: 'assets/emiss_o_automatizada_de_nf_e_mockup.webp',
					alt: 'NF-e Automation',
					title: 'Automated NF-e Issuance',
					desc: 'Serverless Event-Driven Distributed System on AWS. Uses Lambda (Go + .NET 9), EventBridge, and SQS for massive fiscal issuing and high-performance PDF generation.',
					tags: ['.NET', 'C#', 'PostgreSQL', 'Docker', 'AWS'],
					code: 'https://github.com/Lucasantunesribeiro/emissao_nfe',
					demo: 'https://d3065hze06690c.cloudfront.net/login'
				},
				{
					img: 'assets/emailtriageai_mockup.webp',
					alt: 'EmailTriageAI',
					title: 'EmailTriageAI',
					desc: 'Intelligent corporate email triage system. Uses AI (Gemini) and NLP to classify, summarize, and auto-reply to messages, optimizing workflow.',
					tags: ['Python', 'FastAPI', 'Gemini AI', 'NLP', 'Docker'],
					code: 'https://github.com/Lucasantunesribeiro/EmailTriageAI',
					demo: 'http://100.48.50.86/'
				},
				{
					img: 'assets/linkguardi_o_mockup.webp',
					alt: 'LinkGuardião',
					title: 'LinkGuardião',
					desc: 'Corporate URL shortener with password protection and detailed analytics. Robust backend in ASP.NET Core 8 with clean architecture.',
					tags: ['ASP.NET Core 8', 'React', 'TypeScript', 'Tailwind'],
					code: 'https://github.com/Lucasantunesribeiro/LinkGuardiao',
					demo: 'https://linkguardiao.pages.dev/'
				},
				{
					img: 'assets/article_summarizer_agent_mockup.webp',
					alt: 'Article Summarizer Agent',
					title: 'Article Summarizer Agent',
					desc: 'AI Agent capable of bypassing advanced WAFs (Cloudflare) to extract and summarize web articles. Uses Selenium stealth and fallback strategies for reliable collection.',
					tags: ['Python', 'Selenium Stealth', 'Flask', 'AI Agent', 'WAF Bypass'],
					code: 'https://github.com/Lucasantunesribeiro/article_summarizer_agent',
					demo: 'https://article-summarizer-agent.onrender.com/'
				},
				{
					img: 'assets/smartfinance_mockup.webp',
					alt: 'SmartFinance',
					title: 'SmartFinance',
					desc: 'Secure multi-language Fullstack application with private ALB and ECS. Offers financial management with interactive dashboards, CSRF protection, and robust JWT auth.',
					tags: ['Next.js', 'React', 'Node.js', 'Tailwind', 'JWT'],
					code: 'https://github.com/Lucasantunesribeiro/smart_finance',
					demo: 'http://smartfinance-prod-alb-1713518371.sa-east-1.elb.amazonaws.com/'
				},
				{
					img: 'assets/kogui_pokedex_mockup.webp',
					alt: 'Kogui Pokédx',
					title: 'Kogui Pokédx',
					desc: 'Fullstack technical challenge with Django 5.0 and Angular 17. PokéAPI integration, JWT authentication, favorites system and admin panel.',
					tags: ['Angular 17', 'Django 5.0', 'PostgreSQL', 'Docker', 'JWT'],
					code: 'https://github.com/Lucasantunesribeiro/Kogui_pokedex'
				},
				{
					img: 'assets/collabdocs_mockup.webp',
					alt: 'CollabDocs',
					title: 'CollabDocs',
					desc: 'Real-time collaborative document editing platform. Modern serverless architecture with Cloudflare Workers and D1, built in Monorepo.',
					tags: ['Next.js', 'TypeScript', 'Cloudflare', 'Tailwind'],
					code: 'https://github.com/Lucasantunesribeiro/Collabdocs',
					demo: 'https://collabdocs-app.vercel.app/'
				},
				{
					img: 'assets/armaz_m_s_o_joaquim_mockup.webp',
					alt: 'Armazém São Joaquim',
					title: 'Armazém São Joaquim',
					desc: 'Complete digital platform with Next.js 15 and Supabase. Includes interactive menu, reservation system, blog, and admin area, focused on SEO and performance.',
					tags: ['Next.js 15', 'TypeScript', 'Supabase', 'Tailwind', 'Shadcn/ui'],
					code: 'https://github.com/Lucasantunesribeiro/armazemsaojoaquim',
					demo: 'https://armazemsaojoaquim.com.br/'
				},
				{
					img: 'assets/parallel_store_mockup.webp',
					alt: 'Parallel Store',
					title: 'Parallel Store',
					desc: 'Modern urban e-commerce built with Next.js 15 and React 18. Total focus on conversion, performance, and user experience (UX).',
					tags: ['Next.js 15', 'React 18', 'Tailwind', 'E-commerce'],
					code: 'https://github.com/Lucasantunesribeiro/parallel_store',
					demo: 'https://parallelstore.netlify.app/'
				},
				{
					img: 'assets/locadora_de_carros_mockup.webp',
					alt: 'Car Rental System',
					title: 'Car Rental System',
					desc: 'Fleet management and rental system developed in PHP 8.1+. Features secure authentication, permission control (ACL), and complete CRUDs.',
					tags: ['PHP', 'SQLite', 'JavaScript'],
					code: 'https://github.com/Lucasantunesribeiro/locadora_de_carros',
					demo: 'https://locadora-de-carros.onrender.com/'
				},
				{
					img: 'assets/logic_games_suite_mockup.webp',
					alt: 'Logic Games Suite',
					title: 'Logic Games Suite',
					desc: 'Collection of logic mini-games developed with vanilla JavaScript, focusing on programming logic and responsive interactivity.',
					tags: ['HTML5', 'CSS3', 'JavaScript'],
					code: 'https://github.com/Lucasantunesribeiro/Numero-Secreto',
					demo: 'https://sorteador-de-numeros-six-pi.vercel.app/'
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
			navLinks[2].textContent = translations[lang].projetos;
			navLinks[3].textContent = translations[lang].experiencias;
			navLinks[4].textContent = translations[lang].habilidades;
		}

		// Hero section

		// Hero section
		const heroTitle = document.querySelector('.hero-content h1');
		if (heroTitle) heroTitle.innerHTML = translations[lang].heroTitle;

		const heroDesc = document.querySelector('.hero-description.desktop-text');
		if (heroDesc) heroDesc.innerHTML = translations[lang].heroDesc;

		const heroDescMobile = document.querySelector('.hero-description.mobile-text');
		if (heroDescMobile) heroDescMobile.innerHTML = translations[lang].heroDescMobile;

		// Hero buttons
		const btns = document.querySelectorAll('.hero-buttons .btn');
		if (btns[0]) btns[0].textContent = translations[lang].btnCurriculo;
		if (btns[1]) btns[1].textContent = translations[lang].btnProjetos;

		// Sobre section
		const sobreTitle = document.querySelector('#sobre h2');
		if (sobreTitle) sobreTitle.textContent = translations[lang].sobreTitle;

		const sobreTexto = document.querySelector('.sobre-conteudo .desktop-text');
		if (sobreTexto) sobreTexto.innerHTML = translations[lang].sobreTexto;

		const sobreTextoMobile = document.querySelector('#about-text-mobile');
		if (sobreTextoMobile) sobreTextoMobile.innerHTML = translations[lang].sobreTextoMobile;

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
		// Traduz botões de stacks
		const stackBtns = document.querySelectorAll('.stack-btn');
		if (stackBtns.length === translations[lang].stacks.length) {
			translations[lang].stacks.forEach((stackText, i) => {
				const btn = stackBtns[i];
				const span = btn.querySelector('span');
				if (span) {
					span.textContent = stackText;
				} else {
					// Fallback caso não tenha span (estrutura antiga)
					const icon = btn.querySelector('i');
					btn.innerHTML = icon ? icon.outerHTML + ' ' + stackText : stackText;
				}
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

		// Projetos section - A regeneração dinâmica foi desativada para manter a compatibilidade com o sistema de filtros (js/projetos.js)
		// e a estrutura HTML Premium.
		/*
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
		*/

		if (typeof window.updateProjectsLabels === 'function') {
			window.updateProjectsLabels(lang);
		}

		// Atualizar labels das seções Experiências e Habilidades
		if (typeof window.updateExperienciasHabilidadesLabels === 'function') {
			window.updateExperienciasHabilidadesLabels(lang);
		}
	}

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