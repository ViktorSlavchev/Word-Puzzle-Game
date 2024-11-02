let timeStarted = new Date();
let gameActive = true;
let timer = 0;

function formatTime(time) {
    return `${String(Math.floor(time / 60000)).padStart(2, "0")}:${String(Math.floor((time % 60000) / 1000)).padStart(2, "0")}`;
}
function updateTime() {
    if (!gameActive) return;

    const time = new Date() - timeStarted;
    timer = time;
    document.querySelector(".timer").textContent = formatTime(time);
}

setInterval(updateTime, 10);
