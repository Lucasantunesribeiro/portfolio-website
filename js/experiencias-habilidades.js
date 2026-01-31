/**
 * ========================================
 * EXPERIÊNCIAS & HABILIDADES - JS PREMIUM 2026
 * ========================================
 *
 * Features:
 * - Expandir/Recolher descrições nas experiências
 * - Filtro de habilidades por categoria
 * - Navegação por teclado completa
 * - Acessibilidade WCAG 2.1 AAA
 * - Performance otimizada
 */
// ==================== FIX: anti-race (skills) ====================
let skillsRunId = 0;
const skillsHideTimers = new WeakMap();
const skillsInTimers = new WeakMap();

function clearSkillTimers(card) {
    const ht = skillsHideTimers.get(card);
    if (ht) clearTimeout(ht);
    skillsHideTimers.delete(card);

    const it = skillsInTimers.get(card);
    if (it) clearTimeout(it);
    skillsInTimers.delete(card);
}


(function () {
    'use strict';

    // ==================== STATE ====================
    let currentSkillFilter = 'all';

    // ==================== DOM CACHE ====================
    const elements = {
        timelineToggles: null,
        skillFilterBtns: null,
        skillCards: null,
    };

    // ==================== EXPERIÊNCIAS: VER MAIS/MENOS ====================
    /**
     * Handle toggle button click for experience descriptions
     */
    function handleTimelineToggle(button) {
        const textElement = button.previousElementSibling;
        if (!textElement) return;

        const fullText = textElement.getAttribute('data-full-text');
        const isExpanded = button.getAttribute('aria-expanded') === 'true';

        if (isExpanded) {
            // Collapse
            const preview = fullText.substring(0, 150) + '...';
            textElement.textContent = preview;
            button.setAttribute('aria-expanded', 'false');
            button.querySelector('.toggle-text').textContent = 'Ver mais';
            textElement.classList.remove('expanded');
        } else {
            // Expand
            textElement.textContent = fullText;
            button.setAttribute('aria-expanded', 'true');
            button.querySelector('.toggle-text').textContent = 'Ver menos';
            textElement.classList.add('expanded');
        }

        // Announce to screen readers
        const company = button.closest('.timeline-card').querySelector('.timeline-company')?.textContent;
        announceToScreenReader(
            isExpanded
                ? `Descrição de ${company} recolhida`
                : `Descrição de ${company} expandida`
        );
    }

    /**
     * Initialize timeline toggles
     */
    function initTimelineToggles() {
        if (!elements.timelineToggles) return;

        elements.timelineToggles.forEach(button => {
            // Click event
            button.addEventListener('click', () => handleTimelineToggle(button));

            // Keyboard: Enter/Space
            button.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleTimelineToggle(button);
                }
            });

            // Initialize with preview text
            const textElement = button.previousElementSibling;
            const fullText = textElement.getAttribute('data-full-text');
            if (fullText && fullText.length > 150) {
                const preview = fullText.substring(0, 150) + '...';
                textElement.textContent = preview;
            } else {
                // No need for toggle if text is short
                button.style.display = 'none';
            }
        });
    }

    // ==================== HABILIDADES: FILTRO ====================
    /**
     * Filter skill cards by category
     */
    function filterSkills(category) {
        if (!elements.skillCards) return;

        const runId = ++skillsRunId;
        let visibleCount = 0;
        let visibleIndex = 0;

        elements.skillCards.forEach((card) => {
            const pending = skillsHideTimers.get(card);
            if (pending) {
                clearTimeout(pending);
                skillsHideTimers.delete(card);
            }

            const cardCategory = card.getAttribute('data-category');
            const shouldShow = category === 'all' || cardCategory === category;

            requestAnimationFrame(() => {
                card.classList.remove('filtering-in', 'filtering-out');

                if (shouldShow) {
                    visibleCount++;
                    const delay = Math.min(0.5, visibleIndex * 0.05);
                    visibleIndex++;

                    card.hidden = false;
                    card.classList.add('filtering-in');
                    card.style.animationDelay = `${delay}s`;

                    const t = setTimeout(() => card.classList.remove('filtering-in'), 420);
                    skillsHideTimers.set(card, t);
                } else {
                    card.classList.add('filtering-out');

                    const t = setTimeout(() => {
                        if (skillsRunId !== runId) return;

                        // re-check to avoid stale hides
                        const nowCategory = currentSkillFilter;
                        const nowCardCategory = card.getAttribute('data-category');
                        const stillShouldShow = nowCategory === 'all' || nowCardCategory === nowCategory;

                        if (stillShouldShow) {
                            card.hidden = false;
                            card.classList.remove('filtering-out');
                            return;
                        }

                        card.hidden = true;
                        card.classList.remove('filtering-out');
                    }, 300);

                    skillsHideTimers.set(card, t);
                }
            });
        });

        announceToScreenReader(
            `${visibleCount} ${visibleCount === 1 ? 'habilidade encontrada' : 'habilidades encontradas'}`
        );
    }

    /**
     * Handle skill filter button click
     */
    function handleSkillFilter(button) {
        // Update active state
        elements.skillFilterBtns.forEach(btn => {
            btn.classList.remove('active');
            btn.setAttribute('aria-selected', 'false');
        });

        button.classList.add('active');
        button.setAttribute('aria-selected', 'true');

        // Update current filter
        currentSkillFilter = button.getAttribute('data-category') || 'all';

        // Apply filter
        filterSkills(currentSkillFilter);

        // Announce to screen readers
        const category = button.querySelector('span')?.textContent || currentSkillFilter;
        announceToScreenReader(`Filtrando habilidades: ${category}`);
    }

    /**
     * Handle keyboard navigation in skill filter
     */
    function handleSkillFilterKeyboard(event) {
        const currentButton = event.target;
        const buttons = Array.from(elements.skillFilterBtns);
        const currentIndex = buttons.indexOf(currentButton);

        let nextIndex = currentIndex;

        switch (event.key) {
            case 'ArrowRight':
            case 'ArrowDown':
                event.preventDefault();
                nextIndex = (currentIndex + 1) % buttons.length;
                break;

            case 'ArrowLeft':
            case 'ArrowUp':
                event.preventDefault();
                nextIndex = (currentIndex - 1 + buttons.length) % buttons.length;
                break;

            case 'Home':
                event.preventDefault();
                nextIndex = 0;
                break;

            case 'End':
                event.preventDefault();
                nextIndex = buttons.length - 1;
                break;

            case 'Enter':
            case ' ':
                event.preventDefault();
                handleSkillFilter(currentButton);
                return;

            default:
                return;
        }

        // Focus next button
        if (buttons[nextIndex]) {
            buttons[nextIndex].focus();
        }
    }

    /**
     * Initialize skill filters
     */
    function initSkillFilters() {
        if (!elements.skillFilterBtns) return;

        elements.skillFilterBtns.forEach(button => {
            // Click event
            button.addEventListener('click', () => handleSkillFilter(button));

            // Keyboard navigation
            button.addEventListener('keydown', handleSkillFilterKeyboard);
        });

        // Initial filter (show all)
        filterSkills('all');
    }

    // ==================== UTILITIES ====================
    /**
     * Announce message to screen readers
     */
    function announceToScreenReader(message) {
        const announcement = document.createElement('div');
        announcement.setAttribute('role', 'status');
        announcement.setAttribute('aria-live', 'polite');
        announcement.className = 'sr-only';
        announcement.style.cssText = 'position:absolute;left:-10000px;width:1px;height:1px;overflow:hidden;';
        announcement.textContent = message;

        document.body.appendChild(announcement);

        setTimeout(() => {
            document.body.removeChild(announcement);
        }, 1000);
    }

    // ==================== INITIALIZATION ====================
    /**
     * Cache DOM elements
     */
    function cacheElements() {
        elements.timelineToggles = document.querySelectorAll('.timeline-toggle');
        elements.skillFilterBtns = document.querySelectorAll('.skill-filter-btn');
        elements.skillCards = document.querySelectorAll('.skill-card');
    }

    /**
     * Initialize all modules
     */
    function init() {
        // Wait for DOM if not ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', init);
            return;
        }

        // Cache elements
        cacheElements();

        // Verify critical elements
        if (elements.skillFilterBtns.length === 0) {
            console.warn('⚠️ No skill filter buttons found (.skill-filter-btn)');
        }

        if (elements.skillCards.length === 0) {
            console.warn('⚠️ No skill cards found (.skill-card)');
        }

        // Initialize modules
        initTimelineToggles();
        initSkillFilters();

        console.log(`✅ Experiências & Habilidades module initialized. Found ${elements.skillCards.length} skills.`);
    }

    // ==================== AUTO-INIT ====================
    // Safe init call
    if (document.readyState !== 'loading') {
        init();
    } else {
        document.addEventListener('DOMContentLoaded', init);
    }
})();

/**
 * ========================================
 * TRANSLATION SUPPORT (INTEGRATION)
 * ========================================
 */
(function () {
    'use strict';

    /**
     * Update labels when language changes
     */
    function updateExperienciasHabilidadesLabels(lang) {
        const translations = {
            pt: {
                // Experiências
                experienciasTitle: 'Experiências',
                experienciasSubtitle: 'Minha trajetória profissional e formação acadêmica',
                verMais: 'Ver mais',
                verMenos: 'Ver menos',

                // Habilidades
                habilidadesTitle: 'Habilidades',
                habilidadesSubtitle: 'Tecnologias e competências que domino',
                filterAll: 'Todas',
                filterBackend: 'Backend',
                filterFrontend: 'Frontend',
                filterDatabase: 'Database',
                filterCloud: 'Cloud/DevOps',
                filterQuality: 'Qualidade',

                // Skills descriptions
                skillBackendDesc: 'Desenvolvimento de APIs robustas e escaláveis com foco em Clean Architecture e boas práticas.',
                skillFrontendDesc: 'Criação de interfaces modernas e responsivas com foco em performance e experiência do usuário.',
                skillDatabaseDesc: 'Modelagem e otimização de bancos de dados relacionais com foco em performance e integridade.',
                skillCloudDesc: 'Deploy e gerenciamento de infraestrutura cloud com automação e monitoramento contínuo.',
                skillQualityDesc: 'Garantia de qualidade através de testes automatizados e práticas de segurança robustas.',
            },
            en: {
                // Experiências
                experienciasTitle: 'Experience',
                experienciasSubtitle: 'My professional journey and academic background',
                verMais: 'Read more',
                verMenos: 'Read less',

                // Habilidades
                habilidadesTitle: 'Skills',
                habilidadesSubtitle: 'Technologies and skills I master',
                filterAll: 'All',
                filterBackend: 'Backend',
                filterFrontend: 'Frontend',
                filterDatabase: 'Database',
                filterCloud: 'Cloud/DevOps',
                filterQuality: 'Quality',

                // Skills descriptions
                skillBackendDesc: 'Development of robust and scalable APIs focused on Clean Architecture and best practices.',
                skillFrontendDesc: 'Creation of modern and responsive interfaces focused on performance and user experience.',
                skillDatabaseDesc: 'Modeling and optimization of relational databases focused on performance and integrity.',
                skillCloudDesc: 'Cloud infrastructure deployment and management with automation and continuous monitoring.',
                skillQualityDesc: 'Quality assurance through automated testing and robust security practices.',
            },
        };

        const t = translations[lang] || translations.pt;

        // Update Experiências
        const expTitle = document.querySelector('.experiencias-title-accent');
        if (expTitle) expTitle.textContent = t.experienciasTitle;

        const expSubtitle = document.querySelector('.experiencias-subtitle');
        if (expSubtitle) expSubtitle.textContent = t.experienciasSubtitle;

        const toggles = document.querySelectorAll('.timeline-toggle .toggle-text');
        toggles.forEach(toggle => {
            const isExpanded = toggle.closest('.timeline-toggle').getAttribute('aria-expanded') === 'true';
            toggle.textContent = isExpanded ? t.verMenos : t.verMais;
        });

        // Update Habilidades
        const habTitle = document.querySelector('.habilidades-title-accent');
        if (habTitle) habTitle.textContent = t.habilidadesTitle;

        const habSubtitle = document.querySelector('.habilidades-subtitle');
        if (habSubtitle) habSubtitle.textContent = t.habilidadesSubtitle;

        // Update filter buttons
        const filterBtns = document.querySelectorAll('.skill-filter-btn');
        const filterMap = {
            'all': t.filterAll,
            'backend': t.filterBackend,
            'frontend': t.filterFrontend,
            'database': t.filterDatabase,
            'cloud': t.filterCloud,
            'quality': t.filterQuality,
        };

        filterBtns.forEach(btn => {
            const category = btn.getAttribute('data-category');
            const span = btn.querySelector('span');
            if (span && filterMap[category]) {
                span.textContent = filterMap[category];
            }
        });

        // Update skill descriptions
        const skillCards = document.querySelectorAll('.skill-card');
        const descriptionMap = {
            'backend': t.skillBackendDesc,
            'frontend': t.skillFrontendDesc,
            'database': t.skillDatabaseDesc,
            'cloud': t.skillCloudDesc,
            'quality': t.skillQualityDesc,
        };

        skillCards.forEach(card => {
            const category = card.getAttribute('data-category');
            const desc = card.querySelector('.skill-description');
            if (desc && descriptionMap[category]) {
                desc.textContent = descriptionMap[category];
            }
        });
    }

    // Expose function globally for integration with main.js
    window.updateExperienciasHabilidadesLabels = updateExperienciasHabilidadesLabels;
})();
