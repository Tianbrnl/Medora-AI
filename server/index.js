import express from "express";
import cors from "cors";
import { askGemini } from "./gemini.js";

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json({ limit: "10mb" }));

app.get("/", (req, res) => {
    res.json({
        message: "Medora API is running",
    });
});

app.post("/api/chat", async (req, res) => {
    try {
        const {
            message,
            image,
            imageMimeType,
            medications,
        } = req.body;

        if (!message?.trim() && !image) {
            return res.status(400).json({
                error: "Message or image is required",
            });
        }

        const response = await askGemini(
            message || "",
            image,
            imageMimeType,
            medications || []
        );

        res.json({
            response,
        });
    } catch (error) {
        console.error("Gemini API error:", error);

        res.status(500).json({
            error: error.message,
        });
    }
});

app.listen(PORT, () => {
    console.log(
        `Medora server running on http://localhost:${PORT}`
    );
});