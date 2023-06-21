const pageSound = new Audio("media/page-turn.mp3");
const pencilSound = new Audio("media/pencil.mp3");

$(document).ready(function () {
    $("#fillButton").on("click", async function () {
        disableButton();
        playPencilSound();

        const template = $("#template").val();
        const rawNotes = $("#rawNotes").val();

        try {
            const filledTemplate = await formatNote(template, rawNotes);
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

async function formatNote(template, rawNotes) {
    try {
        const response = await $.ajax({
            url: "/api",
            type: "POST",
            dataType: "json",
            contentType: "application/json",
            data: JSON.stringify({ template, rawNotes })
        });

        return response.filledTemplate;
    } catch (error) {
        console.error("Error calling local API:", error);
        throw error;
    }
}
