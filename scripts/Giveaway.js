const isGiveaway = true;
const serverURL = 'https://fragment-server.onrender.com';

async function setUpGiveaway() {
    if (!isGiveaway) {
        document.querySelector(".giveaway-stuff").remove();
        return;
    }

    const giveawayInput = document.querySelector('.giveaway-x-tag');
    const giveawayButton = document.querySelector('.giveaway-submit');
    const giveawayMessage = document.querySelector('.giveaway-message');

    giveawayButton.addEventListener('click', async (e) => {
        let tag = giveawayInput.value.trim().replaceAll(" ", "").toLowerCase();
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

        localStorage.setItem("lastTag", tag);
        addedParam = `referral=${tag}`;
        console.log(getLink());

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
                if (error === "Tag already exists") {
                    giveawayMessage.innerHTML = `You've already entered the giveaway! To get more entries share the game! <br> <a href="${getLink()}">${getLink()}</a>`;
                } else {
                    giveawayMessage.textContent = error;
                }
            }
        } catch (err) {
            giveawayMessage.textContent = 'An error occurred';
        }
    });


    if (params.has("referral") && localStorage.getItem("lastDatePlayed") !== formatDate(new Date()) && localStorage.getItem("lastTag") !== params.get("referral")) {
        const referralTag = params.get("referral");
        console.log("Referral tag:", referral);
        try {
            const response = await fetch(`${serverURL}/add-entry`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ tag: referralTag }),
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