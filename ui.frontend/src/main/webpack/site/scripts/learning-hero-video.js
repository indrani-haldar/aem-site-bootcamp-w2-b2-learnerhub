document.addEventListener("click", async (event) => {
    if (!(event.target instanceof Element)) {
        return;
    }

    const button = event.target.closest(
        ".LearningHero-card__cta[data-action='play-video']"
    );
    if (!(button instanceof HTMLButtonElement)) {
        return;
    }

    const card = button.closest(".LearningHero-card");
    const video = card && card.querySelector(".LearningHero-card__video");
    if (!(video instanceof HTMLVideoElement)) {
        console.error("Learning Hero play button has no video player.", button);
        return;
    }

    const status = card.querySelector(".LearningHero-card__video-status");
    if (status) {
        status.hidden = true;
        status.textContent = "";
    }

    try {
        if (video.ended) {
            video.currentTime = 0;
        }
        await video.play();
    } catch (error) {
        console.error("Unable to start the Learning Hero video.", error);
        if (status) {
            status.textContent = "The video could not be started. Use the video controls to try again.";
            status.hidden = false;
        }
    }
});
