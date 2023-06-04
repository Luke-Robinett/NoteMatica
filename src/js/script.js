const fillButton = document.querySelector("#fillButton");
const templateTextArea = document.querySelector("#template");
const rawNotesTextArea = document.querySelector("#rawNotes");
const filledTemplateTextArea = document.querySelector("#filledTemplate");

const pageSound = new Audio("media/page-turn.mp3");
const pencilSound = new Audio("media/pencil.mp3");

fillButton.addEventListener("click", async () => {
    disableButton();
    playPencilSound();

    const template = templateTextArea.value;
    const rawNotes = rawNotesTextArea.value;

    const prompt = createPrompt(template, rawNotes);

    try {
        const filledTemplate = await formatNote(prompt);
        filledTemplateTextArea.value = filledTemplate;
    } catch (error) {
        console.error(error);
    } finally {
        enableButton();
        stopPencilSound();
        pageSound.play();
    }
});

function disableButton() {
    fillButton.disabled = true;
    fillButton.textContent = "Working...";
}

function enableButton() {
    fillButton.disabled = false;
    fillButton.textContent = "Fill It Out!";
}

function playPencilSound() {
    pencilSound.loop = true;
    pencilSound.play();
}

function stopPencilSound() {
    pencilSound.pause();
    pencilSound.currentTime = 0;
}

function createPrompt(template, rawNotes) {
    const instructions = "Fill in the provided template with the supplied note data. Be concise, using lists when appropriate.";
    return `${instructions}\n\nTemplate:\n${template}\n\nNotes:\n${rawNotes}`;
}

async function formatNote(prompt) {
    try {
        const response = await fetch("/api", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ prompt })
        });

        const data = await response.json();
        return data.filledTemplate;
    } catch (error) {
        console.error("Error calling local API:", error);
        throw error;
    }
}
