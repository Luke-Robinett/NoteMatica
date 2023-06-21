const pageSound = new Audio("media/page-turn.mp3");
const pencilSound = new Audio("media/pencil.mp3");

$(document).ready(function () {
    $("#fillButton").on("click", async function () {
        disableButton();
        playPencilSound();

        const template = $("#template").val();
        const rawNotes = $("#rawNotes").val();
        const prompt = createPrompt(template, rawNotes);

        try {
            const filledTemplate = await formatNote(prompt);
            $("#filledTemplate").val(filledTemplate);
        } catch (error) {
            console.error(error);
        } finally {
            enableButton();
            stopPencilSound();
            pageSound.play();
        }
    });
});

function disableButton() {
    $("#fillButton").prop("disabled", true).text("Working...");
}

function enableButton() {
    $("#fillButton").prop("disabled", false).text("Fill It Out!");
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
        const response = await $.ajax({
            url: "/api",
            type: "POST",
            dataType: "json",
            contentType: "application/json",
            data: JSON.stringify({ prompt })
        });

        return response.filledTemplate;
    } catch (error) {
        console.error("Error calling local API:", error);
        throw error;
    }
}
