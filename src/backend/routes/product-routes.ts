    import { Router, Response } from "express";
import { AuthRequest } from "../middleware/auth-middleware";
import { ProductService } from "../services/product-service";

const router = Router();

router.post("/", async (req: AuthRequest, res: Response) => {
    try {
        const { name } = req.body;

        if (!name) {
            return res.status(400).json({ error: "Product name is required" });
        }

        const productService = new ProductService();
        const product = await productService.createProduct({ name, user_id: req.user.id });

        return res.status(201).json({ product });
    } catch (error) {
        if (error instanceof Error && error.message === 'Product already exists') {
            return res.status(409).json({ error: "Product already exists" });
        }
        if (error instanceof Error && error.message === 'Product name is required') {
            return res.status(400).json({ error: "Product name is required" });
        }
        return res.status(500).json({ error: "Internal server error" });
    }
});

export default router;
