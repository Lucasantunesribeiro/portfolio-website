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
    /**
     * Rotulo do botao ("Ver mais"/"Ver menos") no idioma atual.
     * Cai para portugues se o dicionario do main.js ainda nao tiver carregado.
     */
    function toggleLabel(expanded) {
        const lang = typeof window.getCurrentLang === 'function' ? window.getCurrentLang() : 'pt';
        const key = expanded ? 'toggleLess' : 'toggleMore';
        const fallback = expanded ? 'Ver menos' : 'Ver mais';

        if (typeof window.i18nText === 'function') {
            return window.i18nText(lang, key) || fallback;
        }
        return fallback;
    }

    function handleTimelineToggle(button) {
        const textElement = button.parentElement.querySelector('.timeline-text');
        if (!textElement) return;

        const isExpanded = button.getAttribute('aria-expanded') === 'true';
        const nextText = isExpanded
            ? textElement.getAttribute('data-short')
            : textElement.getAttribute('data-full');

        if (nextText) textElement.textContent = nextText;

        button.setAttribute('aria-expanded', String(!isExpanded));
        button.querySelector('.toggle-text').textContent = toggleLabel(!isExpanded);
        textElement.classList.toggle('expanded', !isExpanded);

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

            // Sem texto longo, o botao nao tem funcao
            const textElement = button.parentElement.querySelector('.timeline-text');
            const shortText = textElement?.getAttribute('data-short');
            const fullText = textElement?.getAttribute('data-full');

            if (!shortText || !fullText || shortText === fullText) {
                button.style.display = 'none';
                return;
            }

            textElement.textContent = shortText;
            button.setAttribute('aria-expanded', 'false');
            button.querySelector('.toggle-text').textContent = toggleLabel(false);
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

    }

    // ==================== AUTO-INIT ====================
    // Safe init call
    if (document.readyState !== 'loading') {
        init();
    } else {
        document.addEventListener('DOMContentLoaded', init);
    }
})();

/*
 * As traducoes desta secao passaram a ser resolvidas pelo motor data-i18n
 * em js/main.js, que le as chaves diretamente do HTML. Manter um segundo
 * dicionario aqui era a causa dos textos dessincronizados entre PT e EN.
 */
