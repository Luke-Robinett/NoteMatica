require("dotenv").config();

const express = require("express");
const axios = require("axios");
const path = require("path");

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, "src")));

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "src", "index.html"));
});

app.post("/api", async (req, res) => {
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
});

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

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
