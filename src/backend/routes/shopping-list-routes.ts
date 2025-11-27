import { Router, Response } from "express";
import { AuthRequest } from "../middleware/auth-middleware";
import { ShoppingListService } from "../services/shopping-list-service";

const router = Router();

router.get("/", async (req: AuthRequest, res: Response) => {
    try {
        const shoppingListService = new ShoppingListService();
        const shoppingLists = await shoppingListService.getShoppingListsByUserId(req.user.id);
        return res.status(200).json({ shoppingLists });
    } catch {
        return res.status(500).json({ error: "Internal server error" });
    }
});

router.post("/", async (req: AuthRequest, res: Response) => {
    try {
        const { name } = req.body;
        
        if (!name || typeof name !== 'string' || name.trim().length === 0) {
            return res.status(400).json({ error: "Name is required and must be a non-empty string" });
        }

        const shoppingListService = new ShoppingListService();
        const shoppingList = await shoppingListService.createShoppingList(name.trim(), req.user.id);
        return res.status(201).json({ shoppingList });
    } catch (error) {
        // Handle uniqueness validation error
        if (error instanceof Error && error.message === "Shopping list with this name already exists") {
            return res.status(409).json({ error: "A shopping list with this name already exists" });
        }
        return res.status(500).json({ error: "Internal server error" });
    }
});

export default router;