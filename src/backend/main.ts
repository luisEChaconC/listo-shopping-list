import express from "express";
import helmet from "helmet";
import cors from "cors";
import jwt from "jsonwebtoken";
import "dotenv/config";
import { AppDataSource } from "./config/database";
import authRoutes from "./routes/auth-routes";
import userRoutes from "./routes/user-routes";
import shoppingListRoutes from "./routes/shopping-list-routes";
import productRoutes from "./routes/product-routes";
import shoppingListProductRoutes from "./routes/shopping-list-product-routes"
import { authMiddleware } from "./middleware/auth-middleware";
import { validationMiddleware } from "./middleware/validation-middleware";
import { CreateUserDto } from "./dtos/CreateUserDto";
import { LoginDto } from "./dtos/LoginDto";
import { RefreshDto } from "./dtos/RefreshDto";
import { CreateProductDto } from "./dtos/CreateProductDto";
import { CreateShoppingListDto } from "./dtos/CreateShoppingListDto";
import { AddShoppingListProductDto } from "./dtos/AddShoppingListProductDto";
import { UpdateShoppingListProductDto } from "./dtos/UpdateShoppingListProductDto";

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

// Map of routes to DTOs for validation
const routeToDto: { [key: string]: any } = {
  '/auth/signup': CreateUserDto,
  '/auth/login': LoginDto,
  '/auth/refresh': RefreshDto,
  '/products': CreateProductDto,
  '/shopping-lists': CreateShoppingListDto,
  '/shopping-list-products': AddShoppingListProductDto,
};

// Global validation middleware
app.use((req, res, next) => {
  if (req.path === '/health' || req.method !== 'POST' && req.method !== 'PUT') {
    return next();
  }
  const dtoClass = routeToDto[req.path];
  if (dtoClass) {
    return validationMiddleware(dtoClass)(req, res, next);
  }
  next();
});

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

// Global auth middleware for all routes except /health and /auth
app.use((req, res, next) => {
  if (req.path === '/health' || req.path.startsWith('/auth')) {
    return next();
  }
  authMiddleware(req, res, next);
});

// Mount routes
app.use("/auth", authRoutes);
app.use("/user", userRoutes);
app.use("/shopping-lists", shoppingListRoutes);
app.use("/products", productRoutes);
app.use("/shopping-list-products", shoppingListProductRoutes);

const PORT = process.env.BACKEND_PORT || 3001;

AppDataSource.initialize()
  .then(() => {
    console.log("Database connected");
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => console.log("Database connection error:", error));
