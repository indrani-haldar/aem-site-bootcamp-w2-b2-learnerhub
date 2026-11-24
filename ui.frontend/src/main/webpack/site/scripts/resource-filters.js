const initializeResourceFilters = () => {
    const resourceTypes = {
        all: "all",
        articles: "article",
        videos: "video",
        guides: "guide",
        documentation: "documentation"
    };
    let selectedType = "all";

    const applyFilter = () => {
        document.querySelectorAll("#resource-filters .cmp-button").forEach(button => {
            const label = button.textContent.trim().toLowerCase();
            button.setAttribute("aria-pressed", String(resourceTypes[label] === selectedType));
        });

        document.querySelectorAll("#resource-list [data-resource-type]").forEach(card => {
            const type = card.dataset.resourceType.trim().toLowerCase();
            const wrapper = card.closest(".resourcecard") || card;
            wrapper.hidden = selectedType !== "all" && type !== selectedType;
        });
    };

    document.addEventListener("click", event => {
        if (!(event.target instanceof Element)) {
            return;
        }
        const button = event.target.closest("#resource-filters .cmp-button");
        if (!button) {
            return;
        }
        const label = button.textContent.trim().toLowerCase();
        const type = resourceTypes[label];
        if (!type) {
            console.error("Unknown resource filter:", button.textContent.trim());
            return;
        }
        event.preventDefault();
        selectedType = type;
        applyFilter();
    });

    applyFilter();

    // AEM can replace components after a dialog save or an authoring insertion.
    new MutationObserver(applyFilter).observe(document.body, {
        childList: true,
        subtree: true
    });
};

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initializeResourceFilters, { once: true });
} else {
    initializeResourceFilters();
}
