// Courses page: filter cards by search text, Category and Level checkboxes,
// show the matching course count, and split the results into pages.
// Nothing checked in a group means that group shows everything.

const COURSES_PER_PAGE = 6;
let currentPage = 1;

function getCheckedValues(group) {
    if (!group) {
        return [];
    }
    const checkedBoxes = group.querySelectorAll(".cmp-custom-checkbox__input:checked");
    return Array.from(checkedBoxes).map((box) => box.value.toLowerCase());
}

function getMatchingCards() {
    const groups = document.querySelectorAll("#course-filters .cmp-custom-checkbox");
    const categories = getCheckedValues(groups[0]);
    const levels = getCheckedValues(groups[1]);
    const searchInput = document.querySelector("#course-catalog-layout .cmp-search__input");
    const searchText = searchInput ? searchInput.value.trim().toLowerCase() : "";

    const matching = [];
    document.querySelectorAll("#course-grid .cmp-coursecard").forEach((card) => {
        const category = (card.dataset.category || "").toLowerCase();
        const level = (card.dataset.level || "").toLowerCase();
        const title = card.querySelector(".cmp-coursecard__title").textContent.toLowerCase();

        const categoryMatch = categories.length === 0 || categories.includes(category);
        const levelMatch = levels.length === 0 || levels.includes(level);
        const searchMatch = title.includes(searchText);

        const wrapper = card.closest(".coursecard") || card;
        wrapper.hidden = true;
        if (categoryMatch && levelMatch && searchMatch) {
            matching.push(wrapper);
        }
    });
    return matching;
}

function createPageButton(label, page, disabled, active) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "course-pagination__button";
    button.textContent = label;
    button.dataset.page = page;
    button.disabled = disabled;
    if (active) {
        button.classList.add("is-active");
        button.setAttribute("aria-current", "page");
    }
    return button;
}

function showCourses() {
    const grid = document.getElementById("course-grid");
    if (!grid) {
        return;
    }

    let noResults = document.querySelector(".course-no-results");
    if (!noResults) {
        noResults = document.createElement("p");
        noResults.className = "course-no-results";
        noResults.textContent = "No Courses Found";
        noResults.setAttribute("role", "status");
        noResults.setAttribute("aria-live", "polite");
        grid.append(noResults);
    }

    // Create the count label and pagination once, around the card grid.
    let count = document.querySelector(".course-count");
    let pagination = document.querySelector(".course-pagination");
    if (!count) {
        count = document.createElement("p");
        count.className = "course-count";
        grid.before(count);

        pagination = document.createElement("nav");
        pagination.className = "course-pagination";
        pagination.setAttribute("aria-label", "Course pages");
        grid.after(pagination);
    }

    const matching = getMatchingCards();
    const totalPages = Math.max(1, Math.ceil(matching.length / COURSES_PER_PAGE));
    currentPage = Math.min(currentPage, totalPages);

    const start = (currentPage - 1) * COURSES_PER_PAGE;
    matching.slice(start, start + COURSES_PER_PAGE).forEach((wrapper) => {
        wrapper.hidden = false;
    });

    noResults.hidden = matching.length !== 0;

    count.textContent = matching.length === 1 ? "1 Course" : `${matching.length} Courses`;

    pagination.innerHTML = "";
    pagination.append(createPageButton("‹", currentPage - 1, currentPage === 1, false));
    for (let page = 1; page <= totalPages; page++) {
        pagination.append(createPageButton(page, page, false, page === currentPage));
    }
    pagination.append(createPageButton("›", currentPage + 1, currentPage === totalPages, false));
    pagination.hidden = matching.length === 0;
}

// Checkbox clicked: go back to page 1 and filter again.
document.addEventListener("change", (event) => {
    if (event.target.matches("#course-filters .cmp-custom-checkbox__input")) {
        currentPage = 1;
        showCourses();
    }
});

// Typing in the search box: go back to page 1 and filter again.
document.addEventListener("input", (event) => {
    if (event.target.matches("#course-catalog-layout .cmp-search__input")) {
        currentPage = 1;
        showCourses();
    }
});

// Stop the search form from leaving the page when Enter is pressed.
document.addEventListener("submit", (event) => {
    if (event.target.closest("#course-catalog-layout .cmp-search")) {
        event.preventDefault();
    }
});

// Pagination button clicked: show that page.
document.addEventListener("click", (event) => {
    const button = event.target.closest(".course-pagination__button");
    if (button && !button.disabled) {
        currentPage = Number(button.dataset.page);
        showCourses();
    }
});

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", showCourses);
} else {
    showCourses();
}
