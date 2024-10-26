function setUpDailyGame() {
    const date = new Date();
    const day = date.getDay();

    let difficulty = "easy";
    if (day == 1) difficulty = "easy";
    if (day == 2) difficulty = "medium";
    if (day == 3) difficulty = "hard";
    if (day == 4) difficulty = "easy";
    if (day == 5) difficulty = "medium";
    if (day == 6) difficulty = "medium";
    if (day == 0) difficulty = "hard";

    date.setHours(3, 0, 0, 0);
    Math.seedrandom(date.toISOString());

    return difficulty;
}
function formatDate(date) {
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    const dayName = days[date.getDay()];
    const monthName = months[date.getMonth()];
    const day = date.getDate();

    return `${dayName} ${monthName}, ${day}`;
}

document.querySelector(".btn-gamemode").addEventListener("click", () => {
    const current = document.querySelector(".btn-gamemode span").textContent;
    if (current === "Free Play") {
        window.location.href = window.location.origin + window.location.pathname;
    } else {
        window.location.href = window.location.origin + window.location.pathname + "?free-play";
    }
});
