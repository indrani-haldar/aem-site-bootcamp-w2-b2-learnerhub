let latestSearch = 0;

function normalize(value) {
    return value.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

function getCourseMatch(results, query) {
    const normalizedQuery = normalize(query);
    const queryWords = normalizedQuery.split(/\s+/).filter(Boolean);

    return results
        .map((result, index) => {
            if (!result.title || !result.path || !result.url) {
                return null;
            }

            const path = new URL(result.path, window.location.origin).pathname;
            if (!path.startsWith("/content/learnerhub/us/en/courses/")) {
                return null;
            }

            const title = normalize(result.title);
            let score = 0;
            if (title === normalizedQuery) {
                score = 4;
            } else if (title.startsWith(normalizedQuery)) {
                score = 3;
            } else if (title.includes(normalizedQuery)) {
                score = 2;
            } else if (queryWords.every((word) => title.split(" ").includes(word))) {
                score = 1;
            }

            return score > 0 ? { result, index, score } : null;
        })
        .filter(Boolean)
        .sort((a, b) => b.score - a.score || a.index - b.index)[0]?.result;
}

function getStatusElement(search) {
    let status = search.querySelector(".header-course-search-status");
    if (!status) {
        status = document.createElement("div");
        status.className = "header-course-search-status";
        status.setAttribute("role", "status");
        status.setAttribute("aria-live", "polite");
        search.prepend(status);
    }
    return status;
}

document.addEventListener("keydown", (event) => {
    if (event.key !== "Enter" || event.isComposing || !(event.target instanceof Element)) {
        return;
    }

    const input = event.target.closest("header.experiencefragment .cmp-search__input");
    const form = input && input.closest(".cmp-search__form");
    if (form) {
        event.preventDefault();
        event.stopPropagation();
        form.requestSubmit();
    }
}, true);

document.addEventListener("submit", async (event) => {
    const form = event.target;
    if (!(form instanceof HTMLFormElement)) {
        return;
    }

    const search = form.closest("header.experiencefragment .cmp-search");
    if (!search) {
        return;
    }

    event.preventDefault();
    event.stopPropagation();

    const input = form.querySelector(".cmp-search__input");
    const status = getStatusElement(search);
    const requestId = ++latestSearch;
    const query = input ? input.value.trim() : "";
    if (!query) {
        status.textContent = "Enter a course name to search.";
        return;
    }

    status.textContent = "Searching courses...";

    try {
        const searchUrl = new URL(form.action, window.location.href);
        searchUrl.searchParams.set("fulltext", query);
        const response = await fetch(searchUrl, { credentials: "same-origin" });
        if (!response.ok) {
            throw new Error(`Course search failed with status ${response.status}.`);
        }

        const results = await response.json();
        if (!Array.isArray(results)) {
            throw new Error("Course search returned an invalid response.");
        }

        if (requestId !== latestSearch) {
            return;
        }

        const match = getCourseMatch(results, query);
        if (!match) {
            status.textContent = "No matching course found.";
            return;
        }

        const destination = new URL(match.url, window.location.origin);
        if (
            destination.origin !== window.location.origin ||
            !destination.pathname.startsWith("/content/learnerhub/us/en/courses/")
        ) {
            throw new Error("Course search returned an invalid URL.");
        }
        window.location.assign(destination.href);
    } catch (error) {
        if (requestId === latestSearch) {
            console.error("Unable to search course pages.", error);
            status.textContent = "Course search is temporarily unavailable.";
        }
    }
}, true);
