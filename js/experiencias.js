/**
 * Experiências — botão "Ver mais / Ver menos" da timeline.
 *
 * Os textos vêm de data-short / data-full, que o motor de idioma do main.js
 * troca junto com PT/EN. O rótulo do botão também sai do dicionário de lá.
 */
(function () {
    'use strict';

    function toggleLabel(expanded) {
        const lang = typeof window.getCurrentLang === 'function' ? window.getCurrentLang() : 'pt';
        const key = expanded ? 'toggleLess' : 'toggleMore';
        const fallback = expanded ? 'Ver menos' : 'Ver mais';

        if (typeof window.i18nText === 'function') {
            return window.i18nText(lang, key) || fallback;
        }
        return fallback;
    }

    function announceToScreenReader(message) {
        const announcement = document.createElement('div');
        announcement.setAttribute('role', 'status');
        announcement.setAttribute('aria-live', 'polite');
        announcement.className = 'sr-only';
        announcement.textContent = message;

        document.body.appendChild(announcement);
        setTimeout(() => announcement.remove(), 1000);
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

        const company = button.closest('.timeline-card').querySelector('.timeline-company')?.textContent;
        announceToScreenReader(
            isExpanded
                ? `Descrição de ${company} recolhida`
                : `Descrição de ${company} expandida`
        );
    }

    function initTimelineToggles() {
        document.querySelectorAll('.timeline-toggle').forEach((button) => {
            // <button> já dispara click com Enter e Espaço; não precisa de keydown.
            button.addEventListener('click', () => handleTimelineToggle(button));

            // Sem texto longo, o botão não tem função
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

    if (document.readyState !== 'loading') {
        initTimelineToggles();
    } else {
        document.addEventListener('DOMContentLoaded', initTimelineToggles);
    }
})();
