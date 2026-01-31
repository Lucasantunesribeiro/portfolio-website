/**
 * ========================================
 * PROJETOS - JAVASCRIPT PREMIUM 2026 (FIX)
 * ========================================
 * - Filtro por stack
 * - Busca em tempo real
 * - Acessível + performance (debounce + raf)
 * - Não depende de libs
 */

(function () {
    "use strict";

    // ==================== STATE ====================
    let currentFilter = "all";
    let searchQuery = "";
    let filterRunId = 0;
    const hideTimeouts = new WeakMap();

    // ==================== DOM CACHE ====================
    const elements = {
        stackButtons: null,
        projectCards: null,
        searchInput: null,
        projectsGrid: null,
        emptyState: null,
    };

    // ==================== UTILITIES ====================
    function debounce(fn, wait = 150) {
        let t;
        return (...args) => {
            clearTimeout(t);
            t = setTimeout(() => fn(...args), wait);
        };
    }

    function normalizeString(str) {
        return (str || "")
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .trim();
    }

    function getCardText(card) {
        const titleEl = card.querySelector(".project-title") || card.querySelector("h3");
        const descEl = card.querySelector(".project-description") || card.querySelector("p");

        const title = normalizeString(titleEl?.textContent || "");
        const desc = normalizeString(descEl?.textContent || "");

        // tags visíveis (se existirem)
        let tagEls = Array.from(card.querySelectorAll(".project-tag"));
        if (tagEls.length === 0) {
            const container = card.querySelector(".project-tags");
            if (container) tagEls = Array.from(container.querySelectorAll("span"));
        }
        const visibleTags = tagEls.map((t) => normalizeString(t.textContent));

        // data-tags="a,b,c"
        const dataTagsAttr = normalizeString(card.getAttribute("data-tags") || "");
        const dataTags = dataTagsAttr
            .split(",")
            .map((t) => normalizeString(t))
            .filter(Boolean);

        const allTags = Array.from(new Set([...visibleTags, ...dataTags]));
        return { title, desc, allTags };
    }

    function matchesStack(filter, tags) {
        const f = normalizeString(filter);

        if (f === "all" || f === "todos") return true;

        // Normaliza botões tipo ".NET"
        const clean = f.replace(".", ""); // ".net" -> "net"

        // Heurísticas por stack
        if (clean === "net" || clean === "dotnet") {
            return tags.some((t) =>
                t.includes(".net") ||
                t.includes("dotnet") ||
                t.includes("asp.net") ||
                t.includes("aspnet") ||
                t.includes("c#") ||
                t.includes("csharp") ||
                t.includes("entity framework") ||
                t.includes("ef core") ||
                t.includes("efcore")
            );
        }

        if (clean === "react") {
            return tags.some((t) => t.includes("react") || t.includes("next.js") || t.includes("nextjs"));
        }

        if (clean === "typescript") {
            return tags.some((t) => t.includes("typescript") || t === "ts");
        }

        if (clean === "python") {
            return tags.some((t) => t.includes("python") || t.includes("django") || t.includes("fastapi"));
        }

        if (clean === "java") {
            return tags.some((t) => t === "java" || t.includes("spring") || t.includes("spring boot"));
        }

        // fallback: bate por inclusão simples
        return tags.some((t) => t.includes(clean));
    }

    function matchesSearch(q, title, desc, tags) {
        const query = normalizeString(q);
        if (!query) return true;

        return (
            title.includes(query) ||
            desc.includes(query) ||
            tags.some((t) => t.includes(query))
        );
    }

    function updateEmptyState(visibleCount) {
        if (!elements.emptyState) return;
        elements.emptyState.hidden = visibleCount !== 0;
    }

    function applyFilter() {
        if (!elements.projectCards) return;

        const runId = ++filterRunId;
        const filter = currentFilter;
        const q = searchQuery;

        let visibleCount = 0;
        let visibleIndex = 0;

        elements.projectCards.forEach((card) => {
            // cancel any pending timeout from previous runs
            const pending = hideTimeouts.get(card);
            if (pending) {
                clearTimeout(pending);
                hideTimeouts.delete(card);
            }

            const { title, desc, allTags } = getCardText(card);

            const okStack = matchesStack(filter, allTags);
            const okSearch = matchesSearch(q, title, desc, allTags);
            const shouldShow = okStack && okSearch;

            card.classList.remove("filtering-in", "filtering-out");

            if (shouldShow) {
                visibleCount++;
                const delay = Math.min(0.45, visibleIndex * 0.03);
                visibleIndex++;

                card.hidden = false;
                card.classList.remove("is-hidden");

                // visual entrance
                card.classList.add("filtering-in");
                card.style.animationDelay = `${delay}s`;

                const t = setTimeout(() => card.classList.remove("filtering-in"), 420);
                hideTimeouts.set(card, t);
            } else {
                card.classList.add("filtering-out");

                const t = setTimeout(() => {
                    if (filterRunId !== runId) return; // stale run

                    // recompute to avoid hiding after fast toggles
                    const { title: tTitle, desc: tDesc, allTags: tTags } = getCardText(card);
                    const stillOk =
                        matchesStack(currentFilter, tTags) &&
                        matchesSearch(searchQuery, tTitle, tDesc, tTags);

                    if (stillOk) {
                        card.hidden = false;
                        card.classList.remove("is-hidden", "filtering-out");
                        return;
                    }

                    card.hidden = true;
                    card.classList.add("is-hidden");
                    card.classList.remove("filtering-out");
                }, 220);

                hideTimeouts.set(card, t);
            }
        });

        updateEmptyState(visibleCount);
    }

    const applyFilterDebounced = debounce(applyFilter, 120);

    // ==================== EVENTS ====================
    function setActiveButton(btn) {
        elements.stackButtons.forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
    }

    function handleStackFilter(btn) {
        setActiveButton(btn);
        currentFilter = btn.getAttribute("data-stack") || "all";
        applyFilter();
    }

    function handleSearchInput(e) {
        searchQuery = e.target.value || "";
        applyFilterDebounced();
    }

    function setupEventListeners() {
        // filtros
        if (elements.stackButtons?.length) {
            elements.stackButtons.forEach((btn) => {
                btn.addEventListener("click", () => handleStackFilter(btn));
            });
        }

        // busca
        if (elements.searchInput) {
            elements.searchInput.addEventListener("input", handleSearchInput);

            elements.searchInput.addEventListener("keydown", (e) => {
                if (e.key === "Escape") {
                    e.target.value = "";
                    searchQuery = "";
                    applyFilter();
                }
            });
        }
    }

    // ==================== INIT ====================
    function cacheElements() {
        elements.stackButtons = document.querySelectorAll(".stack-btn");
        elements.projectCards = document.querySelectorAll(".project-card");
        elements.searchInput = document.getElementById("project-search");

        elements.projectsGrid =
            document.getElementById("projetos-grid") || document.querySelector(".projetos-grid");

        elements.emptyState = document.getElementById("projetos-empty");
    }

    function init() {
        cacheElements();

        if (!elements.projectsGrid) {
            console.error("❌ Projects grid not found (#projetos-grid / .projetos-grid).");
            return;
        }

        setupEventListeners();

        // estado inicial
        const activeBtn = document.querySelector(".stack-btn.active");
        if (activeBtn) {
            currentFilter = activeBtn.getAttribute("data-stack") || "all";
        }
        applyFilter();

        console.log(
            `✅ Projetos OK. Cards: ${elements.projectCards.length}, filtros: ${elements.stackButtons.length}`
        );
    }

    if (document.readyState !== "loading") init();
    else document.addEventListener("DOMContentLoaded", init);
})();

/**
 * ========================================
 * TRANSLATION SUPPORT (INTEGRATION)
 * ========================================
 */
(function () {
    "use strict";

    function updateProjectsLabels(lang) {
        const translations = {
            pt: {
                all: "Todos",
                search: "Buscar projeto...",
                emptyText: "Nenhum projeto encontrado",
                emptyHint: "Tente buscar por outra tecnologia ou termo",
            },
            en: {
                all: "All",
                search: "Search project...",
                emptyText: "No projects found",
                emptyHint: "Try searching for another technology or term",
            },
        };

        const t = translations[lang] || translations.pt;

        const allButton = document.querySelector('.stack-btn[data-stack="all"] span');
        if (allButton) allButton.textContent = t.all;

        const searchInput = document.getElementById("project-search");
        if (searchInput) searchInput.placeholder = t.search;

        const emptyText = document.querySelector(".projetos-empty-text");
        if (emptyText) emptyText.textContent = t.emptyText;

        const emptyHint = document.querySelector(".projetos-empty-hint");
        if (emptyHint) emptyHint.textContent = t.emptyHint;
    }

    window.updateProjectsLabels = updateProjectsLabels;
})();

