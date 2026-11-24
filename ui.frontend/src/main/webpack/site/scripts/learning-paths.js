function initLearningPathSelector() {
    const cardsContainer = document.getElementById("learning-path-list");
    const stepsPanel = document.querySelector("#learning-path-detail .cmp-learningpathsteps");
    if (!cardsContainer || !stepsPanel) {
        return;
    }

    const title = stepsPanel.querySelector(".cmp-learningpathsteps__title");
    const description = stepsPanel.querySelector(".cmp-learningpathsteps__description");
    const stepsList = stepsPanel.querySelector(".cmp-learningpathsteps__steps");
    const startButton = stepsPanel.querySelector(".cmp-learningpathsteps__button");
    if (!title || !stepsList) {
        console.error("Learning Path Steps component is missing its title or steps list.");
        return;
    }

    function selectPath(card) {
        const pathSteps = card.querySelector(".cmp-learningpathcard__steps-data");
        if (!pathSteps || pathSteps.children.length === 0) {
            console.error("Learning Path Card has no authored steps:", card);
            return;
        }

        title.textContent = `Learning Path: ${card.dataset.pathTitle}`;
        if (description) {
            const pathDescription = card.dataset.pathDescription || "";
            description.textContent = pathDescription;
            description.hidden = !pathDescription;
        }
        if (startButton) {
            const pathLink = card.dataset.pathLink;
            if (pathLink) {
                startButton.href = pathLink;
            }
        }

        stepsList.replaceChildren();
        Array.from(pathSteps.children).forEach((pathStep, index) => {
            const item = document.createElement("li");
            item.className = "cmp-learningpathsteps__step";

            const number = document.createElement("span");
            number.className = "cmp-learningpathsteps__number";
            number.textContent = String(index + 1);

            const body = document.createElement("div");
            body.className = "cmp-learningpathsteps__step-body";

            const stepTitle = document.createElement("span");
            stepTitle.className = "cmp-learningpathsteps__step-title";
            stepTitle.textContent = pathStep.dataset.title || "";
            body.append(stepTitle);

            if (pathStep.dataset.duration) {
                const duration = document.createElement("span");
                duration.className = "cmp-learningpathsteps__step-duration";
                duration.textContent = pathStep.dataset.duration;
                body.append(duration);
            }

            item.append(number, body);
            stepsList.append(item);
        });

        cardsContainer.querySelectorAll(".cmp-learningpathcard").forEach((item) => {
            const isSelected = item === card;
            item.classList.toggle("is-selected", isSelected);
            item.setAttribute("aria-current", isSelected ? "true" : "false");
        });
    }

    cardsContainer.querySelectorAll(".cmp-learningpathcard").forEach((card) => {
        if (!card.querySelector(".cmp-learningpathcard__link")) {
            card.setAttribute("role", "button");
            card.setAttribute("tabindex", "0");
        }
    });

    cardsContainer.addEventListener("click", (event) => {
        const card = event.target.closest(".cmp-learningpathcard");
        if (!card || !cardsContainer.contains(card)) {
            return;
        }
        event.preventDefault();
        selectPath(card);
    });

    cardsContainer.addEventListener("keydown", (event) => {
        if (event.key !== "Enter" && event.key !== " ") {
            return;
        }
        const card = event.target.closest(".cmp-learningpathcard[role='button']");
        if (!card || !cardsContainer.contains(card)) {
            return;
        }
        event.preventDefault();
        selectPath(card);
    });

    const firstCard = cardsContainer.querySelector(".cmp-learningpathcard");
    if (firstCard) {
        selectPath(firstCard);
    }
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initLearningPathSelector, { once: true });
} else {
    initLearningPathSelector();
}
