const isGiveaway = true;
const serverURL = 'http://localhost:3000';

async function setUpGiveaway() {
    if (!isGiveaway) {
        document.querySelector(".giveaway-stuff").remove();
        return;
    }

    const giveawayInput = document.querySelector('.giveaway-x-tag');
    const giveawayButton = document.querySelector('.giveaway-submit');
    const giveawayMessage = document.querySelector('.giveaway-message');

    giveawayButton.addEventListener('click', async (e) => {
        let tag = giveawayInput.value.trim();
        console.log(tag)

        if (!tag) {
            giveawayMessage.textContent = 'Tag is required';
            return;
        }
        if (tag.length > 50) {
            giveawayMessage.textContent = 'Tag is too long';
            return;
        }
        if (tag[0] === "@" || tag[0] === "#") tag = tag.slice(1);

        console.log(tag);

        addedParam = `refaral=${tag}`;

        try {
            const response = await fetch(`${serverURL}/add-tag`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ tag }),
            });

            if (response.ok) {
                const { message } = await response.json();
                giveawayMessage.innerHTML = `You've entered the giveaway! Share the game to get more entries! <br> <a href="${getLink()}">${getLink()}</a>`;
            } else {
                const { error } = await response.json();
                giveawayMessage.textContent = error;
            }
        } catch (err) {
            giveawayMessage.textContent = 'An error occurred';
        }
    });


    if (params.has("refaral") && localStorage.getItem("lastDatePlayed") !== formatDate(new Date())) {
        const refaralTag = params.get("refaral");
        console.log("Refaral tag:", refaralTag);
        try {
            const response = await fetch(`${serverURL}/add-entry`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ tag: refaralTag }),
            });

            if (response.ok) {
                const { message } = await response.json();
                console.log(message);
            } else {
                const { error } = await response.json();
                console.error(error)
            }
        } catch (err) {
            console.error(err);
        }

        localStorage.setItem("lastDatePlayed", formatDate(new Date()));
    }
}

setUpGiveaway();