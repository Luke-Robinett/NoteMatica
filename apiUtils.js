const axios = require("axios");

function createPrompt(template, rawNotes) {
    const instructions = "Fill in the provided template with the supplied note data. Be concise, using lists when appropriate.";
    return `${instructions}\n\nTemplate:\n${template}\n\nNotes:\n${rawNotes}`;
}

async function sendAPIRequest(prompt) {
    const endpoint = "https://api.openai.com/v1/chat/completions";

    try {
        const response = await axios.post(endpoint, {
            messages: [{ role: "user", content: prompt }],
            model: "gpt-3.5-turbo"
        }, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
            }
        });

        return response;
    } catch (error) {
        throw new Error("Failed to send API request");
    }
}

async function extractFilledTemplate(response) {
    try {
        const data = response.data;
        return data.choices[0].message.content;
    } catch (error) {
        throw new Error("Failed to extract filled template");
    }
}

module.exports = {
    createPrompt,
    sendAPIRequest,
    extractFilledTemplate
};
