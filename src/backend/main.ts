import express from "express";
import helmet from "helmet";
import cors from "cors";
import jwt from "jsonwebtoken";
import "dotenv/config";
import { AppDataSource } from "./config/database";
import authRoutes from "./routes/auth-routes";

if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET environment variable is not defined. Backend cannot start.");
}

const app = express();
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:3000",
  credentials: true
}));
app.use(express.json());

// JWT middleware
app.use((req, res, next) => {
  if (req.path === "/health" || req.path.startsWith("/auth")) return next();
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

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

// Mount routes
app.use("/auth", authRoutes);

const PORT = process.env.BACKEND_PORT || 3001;

AppDataSource.initialize()
  .then(() => {
    console.log("Database connected");
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => console.log("Database connection error:", error));
