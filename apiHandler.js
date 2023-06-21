const axios = require("axios");
const { createPrompt, sendAPIRequest, extractFilledTemplate } = require("./apiUtils");

async function handleAPIRequest(req, res) {
    const { template, rawNotes } = req.body;
    const prompt = createPrompt(template, rawNotes);

    try {
        const response = await sendAPIRequest(prompt);
        const filledTemplate = await extractFilledTemplate(response);

        res.json({ filledTemplate });
    } catch (error) {
        console.error(error);

        if (error.response) {
            const { status, data } = error.response;
            res.status(status).json({ error: data });
        } else {
            res.status(500).json({ error: "An error occurred" });
        }
    }
}

module.exports = handleAPIRequest;
