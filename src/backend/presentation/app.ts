
import express from "express";
import helmet from "helmet";
import cors from "cors";
import jwt from "jsonwebtoken";

if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET environment variable is not defined. Backend cannot start.");
}

const app = express();
app.use(helmet());
app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true
}));
app.use(express.json());

// JWT middleware
app.use((req, res, next) => {
    // Public routes
    if (
        req.path === "/health" ||
        req.path === "/auth/signup"
    ) {
        return next();
    }
    const authHeader = req.headers["authorization"];
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ error: "Missing or invalid Authorization header" });
    }
    const token = authHeader.split(" ")[1];
    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET as string);
        (req as any).user = payload;
        next();
    } catch {
        return res.status(401).json({ error: "Invalid token" });
    }
});

import { signupHandler } from "./auth-handler";

app.post("/auth/signup", signupHandler);

app.get("/health", (req, res) => {
    res.json({ status: "ok" });
});

export default app;
