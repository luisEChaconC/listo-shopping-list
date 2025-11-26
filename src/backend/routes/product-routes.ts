import { Router, Response } from "express";
import { AuthRequest } from "../middleware/auth-middleware";
import { ProductService } from "../services/product-service";

const router = Router();

router.get("/", async (req: AuthRequest, res: Response) => {
    try {
        const productService = new ProductService();
        const products = await productService.getUserProducts(req.user.id);
        return res.status(200).json({ products });
    } catch (error) {
        return res.status(500).json({ error: "Internal server error" });
    }
});

export default router;