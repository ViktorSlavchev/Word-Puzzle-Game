function showWinModal() {
    const winModal = document.querySelector(".win-modal");
    const overlay = document.querySelector(".overlay");
    winModal.classList.remove("hidden");
    overlay.classList.remove("hidden");

    const messageText = document.querySelector(".message-text");
    if (document.querySelector(".btn-gamemode").textContent.trim() === "Free Play") {
        messageText.textContent = `You completed ${GAME_NAME} on ${diffcultyString[0].toUpperCase() + diffcultyString.slice(1)} Mode`;
    } else {
        messageText.textContent = `You completed today's ${GAME_NAME}`;
    }

    const specialTimer = document.querySelector(".special-timer");
    specialTimer.textContent = formatTime(timer);
}
document.querySelector(".btn-play-again").addEventListener("click", () => {
    window.location.reload();
});

function showHelpModal() {
    const helpModal = document.querySelector(".help-modal");
    const overlay = document.querySelector(".overlay");
    helpModal.classList.remove("hidden");
    overlay.classList.remove("hidden");
}

function hideModal() {
    const openedModal = document.querySelector(".modal:not(.hidden)");
    const overlay = document.querySelector(".overlay");

    if (!openedModal) return;
    if (openedModal.classList.contains("win-modal")) return;

    openedModal.classList.add("hidden");
    overlay.classList.add("hidden");
}

document.querySelector(".btn-help").addEventListener("click", () => {
    showHelpModal();
});

document.querySelector(".btn-close").addEventListener("click", () => {
    hideModal();
});

document.querySelector(".overlay").addEventListener("click", () => {
    hideModal();
});

const toggleTheme = () => {
    document.body.classList.toggle("dark-mode");
    document.querySelector(".btn-theme").innerHTML = `<ion-icon name="${document.body.classList.contains("dark-mode") ? "sunny" : "moon"}"></ion-icon>`;

    if (document.body.classList.contains("dark-mode")) {
        localStorage.setItem("theme", "dark");

        // document.querySelector(".help-gif").src = "images/help.gif";
    } else {
        localStorage.setItem("theme", "light");
        // document.querySelector(".help-gif").src = "images/help_white.gif";
    }
};

if (localStorage.getItem("theme") === "dark") {
    toggleTheme();
}

document.querySelector(".btn-theme").addEventListener("click", toggleTheme);
