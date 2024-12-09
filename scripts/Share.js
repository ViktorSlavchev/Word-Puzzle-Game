
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

function getLink() {
    let currentURL = window.location.href;

    // Parse the URL to remove "refaral={anything}"
    const url = new URL(currentURL);
    url.searchParams.forEach((value, key) => {
        if (key === "refaral") {
            url.searchParams.delete(key);
        }
    });

    // Add the new parameter
    url.searchParams.append(addedParam.split('=')[0], addedParam.split('=')[1]);

    let link = url.toString();

    if (document.querySelector(".btn-gamemode").textContent.trim() === "Free Play") {
        const origin = window.location.origin;
        link = `${origin}/?free-play&difficulty=${diffcultyString}&seed=${seed}&${addedParam}`;
    }

    return link;
}

document.querySelector(".btn-share").addEventListener("click", async () => {
    console.log(navigator.share);
    let message = `I completed today's ${GAME_NAME} in ${formatTime(timer)}. Think you can beat my time? Give it a try: ${getLink()}`;

    if (document.querySelector(".btn-gamemode").textContent.trim() === "Free Play") {
        message = `I completed ${GAME_NAME} on ${diffcultyString[0].toUpperCase() + diffcultyString.slice(1)} Mode in ${formatTime(timer)}. Think you can beat my time? Give it a try: ${getLink()}`;
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
