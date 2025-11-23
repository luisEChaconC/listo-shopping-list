import { Router, Request, Response } from "express";
import { SignupService } from "../services/signup-service";

const router = Router();

router.post("/signup", async (req: Request, res: Response) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
        return res.status(400).json({ error: "Missing required fields" });
    }
    try {
        const signupService = new SignupService();
        const user = await signupService.register({ name, email, password });
        return res.status(201).json({ user: { id: user.id, name: user.name, email: user.email } });
    } catch (error) {
        if (error instanceof Error && error.message === "User already exists") {
            return res.status(409).json({ error: "User already exists" });
        }
        return res.status(500).json({ error: "Internal server error" });
    }
});

export default router;