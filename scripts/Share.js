async function copyToClipboard(text) {
    if (navigator.clipboard && window.isSecureContext) {
        try {
            await navigator.clipboard.writeText(text);
            console.log("Text copied to clipboard");
        } catch (err) {
            console.error("Failed to copy text: ", err);
        }
    } else {
        // Fallback approach for older browsers
        const textarea = document.createElement("textarea");
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        textarea.setSelectionRange(0, 99999); // For mobile devices
        document.execCommand("copy");
        document.body.removeChild(textarea);
    }
}

document.querySelector(".btn-share").addEventListener("click", async () => {
    console.log(navigator.share);
    let message = `I completed today's ${GAME_NAME} in ${formatTime(timer)}. Think you can beat my time? Give it a try: ${window.location.href}`;

    if (document.querySelector(".btn-gamemode").textContent.trim() === "Free Play") {
        message = `I completed ${GAME_NAME} on ${diffcultyString[0].toUpperCase() + diffcultyString.slice(1)} Mode in ${formatTime(timer)}. Think you can beat my time? Give it a try: ${window.location.origin}/?free-play&difficulty=${diffcultyString}&seed=${seed}`;
    }
    if (navigator.share) {
        try {
            const shareData = {
                title: `${GAME_NAME} Puzzle Game`,
                text: message,
            };

            await navigator.share(shareData);
            console.log("Content shared successfully!");
        } catch (err) {
            console.error("Error sharing content:", err);
        }
    } else {
        await copyToClipboard(message);
    }
});
