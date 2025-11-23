import { Router, Response } from "express";
import { authMiddleware, AuthRequest } from "../middleware/auth-middleware";
import { ShoppingListService } from "../services/shopping-list-service";

const router = Router();

router.get("/", async (req: AuthRequest, res: Response) => {
    try {
        const shoppingListService = new ShoppingListService();
        const shoppingLists = await shoppingListService.getShoppingListsByUserId(req.user.id);
        return res.status(200).json({ shoppingLists });
    } catch (error) {
        return res.status(500).json({ error: "Internal server error" });
    }
});

export default router;