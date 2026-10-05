import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { askGemini } from "./gemini.js";
import { getUserFromToken, getDbClient } from "./supabase.js";
import { checkAndRecordUsage, rollbackUsage } from "./rateLimiter.js";

dotenv.config({ path: "./server/.env" });

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json({ limit: "10mb" }));

app.get("/", (req, res) => {
    res.json({
        message: "Medora API is running",
    });
});

app.post("/api/chat", async (req, res) => {
    // 1. Authenticate user from Supabase access token (do not trust user_id from frontend)
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({
            error: "Authentication required. Please sign in.",
        });
    }

    const token = authHeader.split(" ")[1];
    const { user, error: authError } = await getUserFromToken(token);

    if (authError || !user) {
        console.error("Token verification failed:", authError?.message || "User not found");
        return res.status(401).json({
            error: "Invalid or expired session. Please sign in again.",
        });
    }

    // 2. Validate request payload
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

    // 3. Obtain database client for rate limit check
    const dbClient = getDbClient(token);

    let usageRecord = null;

    try {
        // 4. Rate-limit check within rolling window (with concurrency lock)
        const rateLimitResult = await checkAndRecordUsage(user, dbClient);

        if (!rateLimitResult.allowed) {
            // Return 429 Too Many Requests, do NOT call Gemini
            return res.status(429).json({
                error: "AI chat rate limit reached",
                retryAfter: rateLimitResult.retryAfter,
                retryAt: rateLimitResult.retryAt,
                rateLimit: rateLimitResult.rateLimit,
            });
        }

        usageRecord = rateLimitResult.usageRecord;

        // 5. Call Gemini
        const response = await askGemini(
            message || "",
            image,
            imageMimeType,
            medications || []
        );

        // 6. Return response with rate limit metadata
        res.json({
            response,
            rateLimit: rateLimitResult.rateLimit,
        });
    } catch (error) {
        console.error("Gemini/chat processing error:", error);

        // If Gemini failed after recording usage, rollback the usage record
        // so internal server/Gemini errors do NOT consume the user's quota
        if (usageRecord?.id) {
            await rollbackUsage(usageRecord.id, dbClient).catch((err) => {
                console.error("Rollback failed:", err);
            });
        }

        res.status(500).json({
            error: error.message || "Internal server error",
        });
    }
});

app.listen(PORT, () => {
    console.log(
        `Medora server running on http://localhost:${PORT}`
    );
});